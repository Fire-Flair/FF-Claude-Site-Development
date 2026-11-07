#!/usr/bin/env python3
"""Build FireFlair's location catalog and an unindexed launch-page candidate set.

Uses GeoNames public downloads, CC BY 4.0. No application writes or paid APIs.
Source coordinates are representative points, not service-area boundaries.
"""
import argparse
import collections
import csv
import hashlib
import json
import re
import unicodedata
import urllib.request
import zipfile
from datetime import date
from pathlib import Path

URLS = {
    'countryInfo.txt': 'https://download.geonames.org/export/dump/countryInfo.txt',
    'GB.zip': 'https://download.geonames.org/export/dump/GB.zip',
}
POP_CODES = {'PPLC', 'PPLA', 'PPLA2', 'PPLA3', 'PPLA4', 'PPL', 'PPLL', 'PPLX'}
CONTINENTS = {'EU':'Europe', 'AS':'Asia', 'AF':'Africa', 'NA':'North America',
              'SA':'South America', 'OC':'Oceania', 'AN':'Antarctica'}
# Explicit source IDs select populated places, rather than same-named wards.
CAMDEN_IDS = [3345437,6690587,2647553,6615314,6690581,6690582,6690583,
              2655333,2646781,6690589,6690576,6941041,8299557,13269392,
              2646958,6690572,6545172,2652222,2638707,13269393]
CROSS_BOUNDARY_NAMES = {'Highgate','Kilburn','Fitzrovia','Covent Garden','Holborn',"King's Cross"}
REQUIRED_IDS = [2655858,2647138,2638867,2655603,2641430]

def slug(value):
    s = unicodedata.normalize('NFKD', value).encode('ascii','ignore').decode().lower()
    s = s.replace("'",'').replace('’','').replace('&',' and ')
    return re.sub(r'[^a-z0-9]+','-',s).strip('-')

def display_admin(name):
    if name == 'City of London': return name
    overrides = {'Royal Kensington and Chelsea':'Kensington and Chelsea',
                 'Royal Kingston upon Thames':'Kingston upon Thames'}
    if name in overrides: return overrides[name]
    for prefix in ['City and Borough of ', 'Royal Borough of ', 'Metropolitan Borough of ',
                   'Borough of ', 'City of ']:
        if name.startswith(prefix): return name[len(prefix):]
    return name

def dump(path, data):
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')

def build(source_dir, out_dir, target, retrieved_on):
    out_dir.mkdir(parents=True,exist_ok=True)
    with zipfile.ZipFile(source_dir/'GB.zip') as z:
        rows=[line.split('\t') for line in z.read('GB.txt').decode('utf-8').splitlines()]
    assert all(len(r)==19 for r in rows), 'Unexpected GeoNames columns'
    raw={int(r[0]):r for r in rows}
    countries=[r.split('\t') for r in (source_dir/'countryInfo.txt').read_text().splitlines()
               if r and not r.startswith('#')]
    # Deprecated entities documented in the source header.
    countries=[r for r in countries if r[0] not in {'AN','CS'}]
    nodes={}
    def put(node):
        assert node['id'] not in nodes, node['id']
        nodes[node['id']]=node
    put({'id':'worldwide','name':'Worldwide','kind':'navigation_root','parent_id':None})
    for code,name in CONTINENTS.items():
        put({'id':'continent:'+code,'name':name,'kind':'continent',
             'parent_id':'worldwide','continent_code':code})
    for r in countries:
        code=r[0]; continent=r[8]
        put({'id':'country:'+code,'name':r[4],'kind':'country_or_territory',
             'country_code':code,'iso3':r[1],'geonames_id':int(r[16]),
             'continent_code':continent,'parent_id':'continent:'+continent,
             'source_url':'https://download.geonames.org/export/dump/countryInfo.txt',
             'navigation_shortcut':code=='GB','code_status':'geonames_extension' if code=='XK' else 'source_iso_code'})
    admin_maps={level:{} for level in (1,2,3)}
    for r in rows:
        if r[7] in {'ADM1','ADM2','ADM3'}:
            level=int(r[7][-1]); admin_maps[level][tuple(r[10:10+level])]='gn:'+r[0]
    def source_parent(r):
        max_level=int(r[7][-1])-1 if r[7] in {'ADM1','ADM2','ADM3'} else 3
        for level in range(max_level,0,-1):
            key=tuple(r[10:10+level])
            if all(key) and key in admin_maps[level]: return admin_maps[level][key]
        return 'country:GB'
    for r in rows:
        if r[7] not in POP_CODES|{'ADM1','ADM2','ADM3'}: continue
        feature=r[7]
        kind=('uk_nation' if feature=='ADM1' else
              'london_borough' if feature=='ADM3' and r[11]=='GLA' and r[1]!='City of London' else
              'city_corporation' if feature=='ADM3' and r[1]=='City of London' else
              'administrative_area' if feature.startswith('ADM') else
              'neighbourhood' if feature=='PPLX' else 'populated_place')
        aliases=list(dict.fromkeys(x for x in r[3].split(',') if x and x!=r[1]))
        put({'id':'gn:'+r[0],'geonames_id':int(r[0]),'name':r[1],
             'ascii_name':r[2],'source_aliases':aliases,'kind':kind,'feature_code':feature,
             'country_code':'GB','continent_code':'EU','admin_codes':r[10:14],
             'parent_id':source_parent(r),'latitude':float(r[4]),'longitude':float(r[5]),
             'population_for_seed_ordering':int(r[14] or 0),'source_modified':r[18],
             'source_url':'https://www.geonames.org/'+r[0],
             'geometry_quality':'representative_point_not_boundary',
             'hierarchy_quality':'source_gazetteer_requires_boundary_review'})
    for n in nodes.values():
        assert n['parent_id'] is None or n['parent_id'] in nodes,(n['id'],n['parent_id'])
    page_geo_aliases={'gn:2643743':'gn:2648110'} # London city navigation -> Greater London hub.
    for n in list(nodes.values()):
        if n.get('feature_code') not in POP_CODES: continue
        codes=n['admin_codes']; parent=admin_maps[2].get(tuple(codes[:2]))
        if parent and slug(n['name'])==slug(display_admin(nodes[parent]['name'])):
            page_geo_aliases[n['id']]=parent
    # Matching must retain these geographic IDs separately: these are page-routing aliases only.
    selected=set()
    def add(node_id):
        node_id=page_geo_aliases.get(node_id,node_id)
        n=nodes[node_id]
        if node_id in selected: return
        selected.add(node_id)
        if node_id=='worldwide': return
        if node_id=='country:GB': return
        if n['kind']=='continent': add('worldwide'); return
        if n['kind']=='country_or_territory': add(n['parent_id']); return
        codes=n.get('admin_codes',[])
        if n.get('feature_code')=='ADM1': add('country:GB')
        elif n.get('feature_code')=='ADM2': add(admin_maps[1][tuple(codes[:1])])
        elif n.get('feature_code')=='ADM3' and codes[1]=='GLA': add('gn:2648110')
        elif n.get('feature_code') in POP_CODES:
            # Keep browse depth short. Preserve district codes in the raw data separately.
            if codes[1]=='GLA' and tuple(codes[:3]) in admin_maps[3]: add(admin_maps[3][tuple(codes[:3])])
            elif tuple(codes[:2]) in admin_maps[2]: add(admin_maps[2][tuple(codes[:2])])
            elif tuple(codes[:1]) in admin_maps[1]: add(admin_maps[1][tuple(codes[:1])])
            else: add('country:GB')
    add('worldwide');add('continent:EU');add('country:GB')
    for r in countries:
        if r[8]=='EU': add('country:'+r[0])
    for n in nodes.values():
        if n.get('feature_code') in {'ADM1','ADM2'} or n['kind'] in {'london_borough','city_corporation'}: add(n['id'])
    for gid in CAMDEN_IDS+REQUIRED_IDS: add('gn:'+str(gid))
    populated=[n for n in nodes.values() if n.get('feature_code') in POP_CODES]
    populated.sort(key=lambda n:(-n['population_for_seed_ordering'],n['name'],n['id']))
    seen=set()
    def add_unique(n):
        key=(n['admin_codes'][0],n['admin_codes'][1],slug(n['name']))
        if key in seen: return
        seen.add(key);add(n['id'])
    # Avoid a second populated-place record with the same source-area/name as a
    # manually selected place. Geographic IDs remain distinct in the full catalog.
    for nid in selected:
        n=nodes[nid]
        if n.get('feature_code') in POP_CODES:
            seen.add((n['admin_codes'][0],n['admin_codes'][1],slug(n['name'])))
    # These are breadth quotas for the candidate set, not demand or search-volume estimates.
    for nation,minimum in [('SCT',35),('WLS',30),('NIR',20)]:
        for n in [p for p in populated if p['admin_codes'][0]==nation][:minimum]: add_unique(n)
    for n in populated:
        if len(selected)>=target: break
        add_unique(n)
    assert len(selected)==target,(len(selected),target)
    def browse_parent(node_id):
        n=nodes[node_id]
        if node_id=='worldwide': return None
        if node_id=='country:GB': return None # UK is a top-level navigation shortcut.
        if n['kind'] in {'continent','country_or_territory'}: return n['parent_id']
        c=n['admin_codes']; feature=n['feature_code']
        if feature=='ADM1': return 'country:GB'
        if feature=='ADM2': return admin_maps[1][tuple(c[:1])]
        if n['kind'] in {'london_borough','city_corporation'}: return 'gn:2648110'
        if c[1]=='GLA' and tuple(c[:3]) in admin_maps[3]: return admin_maps[3][tuple(c[:3])]
        return admin_maps[2].get(tuple(c[:2]),admin_maps[1].get(tuple(c[:1]),'country:GB'))
    pages={}
    for nid in selected:
        n=nodes[nid]
        name=display_admin(n['name']) if n.get('feature_code') in {'ADM2','ADM3'} else n['name']
        name={'United Kingdom':'UK','The Netherlands':'Netherlands','Aland Islands':'Åland Islands','Vatican':'Vatican City'}.get(name,name)
        parent=browse_parent(nid)
        pages[nid]={'location_id':nid,'display_name':name,'kind':n['kind'],
                    'parent_page_id':parent,'slug':slug(name) or nid.replace(':','-'),
                    'country_code':n.get('country_code'),'source_url':n.get('source_url'),
                    'latitude':n.get('latitude'),'longitude':n.get('longitude'),
                    'source_population_for_ordering':n.get('population_for_seed_ordering'),
                    'geo_review_status':'needs_review','publication_state':'prepared',
                    'index_state':'noindex','index_approval_by_site':{},
                    'nearby_fallback_scope':'same_uk_nation' if n.get('country_code')=='GB' else 'same_country',
                    'notes':[]}
        if n['name'] in CROSS_BOUNDARY_NAMES:
            pages[nid]['notes'].append('Neighbourhood may cross borough boundaries; browse parent is not an exact containment assertion.')
        if n.get('feature_code') in {'ADM2','ADM3'}:
            pages[nid]['notes'].append('Check current ONS/OSNI administrative scope before using as a coverage polygon.')
        if nid=='gn:2648110': pages[nid]['notes'].append('One London/Greater London page; City of London remains a separate child.')
    siblings=collections.defaultdict(list)
    for p in pages.values(): siblings[(p['parent_page_id'],p['slug'])].append(p)
    for matches in siblings.values():
        if len(matches)>1:
            for p in matches:
                p['slug']+='-'+p['location_id'].split(':')[-1]
                p['notes'].append('Slug disambiguated by source ID; replace with a human area qualifier during review if appropriate.')
    def route(nid,stack=()):
        assert nid not in stack,'cycle'
        p=pages[nid]
        if nid=='worldwide':return '/areas/worldwide'
        if nid=='country:GB':return '/areas/uk'
        return route(p['parent_page_id'],stack+(nid,))+'/'+p['slug']
    for nid,p in pages.items():
        p['path']=route(nid)
        p['child_page_ids']=sorted([k for k,v in pages.items() if v['parent_page_id']==nid],key=lambda k:pages[k]['display_name'])
    assert len({p['path'] for p in pages.values()})==len(pages)
    assert all(p['parent_page_id'] is None or p['parent_page_id'] in pages for p in pages.values())
    european_navigation=[r for r in countries if r[8]=='EU' and r[0]!='GB']
    page_list=sorted(pages.values(),key=lambda p:p['path'])
    with (out_dir/'locations.jsonl').open('w') as f:
        for n in sorted(nodes.values(),key=lambda n:n['id']): f.write(json.dumps(n,ensure_ascii=False,separators=(',',':'))+'\n')
    dump(out_dir/'launch_pages.json',{'schema_version':1,'generated_from_sources_on':retrieved_on,
         'purpose':'Candidate routes, not publication or indexing approvals',
         'sites':['party','team','business'],'pages':page_list})
    dump(out_dir/'page_routing_aliases.json',{'warning':'Routing only. Do not merge geographic identities or infer whole-area work coverage.',
         'location_to_preferred_page':{a:b for a,b in page_geo_aliases.items() if b in pages},
         'path_redirect_candidates':[{'from':'/areas/uk/england/london','to':pages['gn:2648110']['path']}]})
    dump(out_dir/'countries_and_territories.json',[nodes['country:'+r[0]] for r in countries])
    with (out_dir/'launch_locations.csv').open('w',newline='') as f:
        cols=['location_id','display_name','kind','parent_page_id','path','country_code','geo_review_status','publication_state','index_state']
        writer=csv.DictWriter(f,fieldnames=cols,extrasaction='ignore');writer.writeheader();writer.writerows(page_list)
    hashes={name:hashlib.sha256((source_dir/name).read_bytes()).hexdigest() for name in URLS}
    metrics={'retrieved_on':retrieved_on,'raw_GB_records':len(rows),
      'populated_place_source_records':len(populated),'location_records_including_hubs':len(nodes),
      'countries_and_territories':len(countries),'europe_navigation_entries_excluding_UK':len(european_navigation),
      'launch_location_pages':len(pages),'potential_site_routes':len(pages)*3,
      'london_boroughs':sum(n['kind']=='london_borough' for n in nodes.values()),
      'city_of_london_records':sum(n['kind']=='city_corporation' for n in nodes.values()),
      'curated_camden_places':len(CAMDEN_IDS),'nation_page_counts':dict(collections.Counter(nodes[p['location_id']].get('admin_codes',[''])[0] for p in page_list if nodes[p['location_id']].get('admin_codes'))),
      'structural_checks':{'unique_ids':True,'all_source_parents_resolve':True,'all_page_parents_resolve':True,'unique_paths':True,'acyclic_page_tree':True,'default_noindex':all(p['index_state']=='noindex' for p in page_list)},
      'source_sha256':hashes,
      'limitations':['Gazetteer records can contain duplicates and historical administrative associations.','Population is source data used only for seed ordering, not current search demand.','No polygons are supplied. Neighbourhood containment and coverage need review.','Launch records are prepared candidates; none is approved for automatic search indexing.']}
    dump(out_dir/'validation_report.json',metrics)
    europe='\n'.join('- '+r[4]+' ('+r[0]+')' for r in sorted(european_navigation,key=lambda r:r[4]))
    (out_dir/'EUROPE_NAVIGATION.md').write_text('# Europe navigation seed\n\nUK is a separate navigation shortcut; its underlying continent remains Europe. Countries and territories follow the supplied GeoNames classification. Kosovo uses the source extension XK. Countries classified elsewhere, such as Türkiye, remain in the worldwide catalog; editorial cross-links may be added without duplicating their canonical page.\n\n'+europe+'\n')
    return metrics

def main():
    ap=argparse.ArgumentParser();ap.add_argument('--source-dir',type=Path,default=Path('sources'))
    ap.add_argument('--output-dir',type=Path,default=Path('data'));ap.add_argument('--target',type=int,default=1000)
    ap.add_argument('--download',action='store_true');ap.add_argument('--retrieved-on',default=date.today().isoformat());a=ap.parse_args()
    a.source_dir.mkdir(parents=True,exist_ok=True)
    if a.download:
        for name,url in URLS.items():
            req=urllib.request.Request(url,headers={'User-Agent':'FireFlair-location-import/1.0'})
            with urllib.request.urlopen(req,timeout=60) as response: data=response.read()
            (a.source_dir/name).write_bytes(data)
    print(json.dumps(build(a.source_dir,a.output_dir,a.target,a.retrieved_on),indent=2))

if __name__=='__main__':main()
