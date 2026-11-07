# FireFlair Front Doors implementation kit

Prepared 7 November 2026. This is an implementation handover and reusable location seed, not a deployed website. Read `FireFlair_Front_Doors_Claude_Prompt.md` for the complete product brief.

## Start here

1. Give Claude the prompt alongside the current FireFlair project. If your environment accepts archives, extract this kit into the project workspace. Otherwise supply the prompt first and make the data files available to the implementation environment separately.
2. Have Claude inspect this README and `data/validation_report.json`. It should use code to query/import data, not paste tens of thousands of rows into its context.
3. Build the shared page system and real request workflow. Demonstrate a handful of locations across the three site intents before expanding publication.
4. Review the geography, actual service capability and usefulness of each page before allowing it into a search sitemap.

The site is not modified by this kit. No providers, jobs, leads, notifications, payment transactions or live indexed pages have been created.

## What is included

| File | Use |
|---|---|
| `FireFlair_Front_Doors_Claude_Prompt.md` | Full implementation instructions, editorial rules, workflow and acceptance checks |
| `build_location_seed.py` | Standard-library Python importer; rebuilds the supplied candidate data offline |
| `data/locations.jsonl` | Full source-derived catalog, one JSON object per line; use server-side |
| `data/launch_pages.json` | 1,000 candidate locations, browsing parents, slugs, routes and review flags |
| `data/launch_locations.csv` | Compact human-review version of the candidate routes |
| `data/countries_and_territories.json` | 250 source country/territory records for future navigation |
| `data/page_routing_aliases.json` | Routing suggestions; never interpret as merged geographic coverage |
| `data/EUROPE_NAVIGATION.md` | Initial European country/territory navigation list |
| `data/validation_report.json` | Counts, checksums and build-time structural checks |
| `data/handoff_validation.json` | Additional independent handover checks |
| `source_data/GB.zip` | Downloaded GeoNames UK source, unmodified |
| `source_data/countryInfo.txt` | Downloaded GeoNames country/territory source, unmodified |
| `LICENSE_AND_SOURCES.md` | Attribution, source links, transformations and limitations |

## Actual scope

| Item | Count |
|---|---:|
| Raw GeoNames UK source rows | 109,182 |
| Retained populated-place source records | 43,681 |
| Catalog records including administration, countries and navigation hubs | 47,990 |
| Countries and territories in the underlying catalog | 250 |
| Initial page candidates | 1,000 |
| Potential routes across Party, Team and the business site | 3,000 |
| Europe navigation entries excluding UK | 52 |
| London borough records | 32 |
| City of London record | 1 |
| Selected Camden neighbourhood records | 20 |

The 1,000-page seed includes 53 country/territory pages including the UK, two broad navigation hubs, and 945 subnational pages: 778 England, 79 Scotland, 57 Wales and 31 Northern Ireland. These numbers describe route candidates, not search volume, live pages, providers or available jobs.

The catalog preserves many more locations than the initial page set. Outside the UK, this first kit supplies country/territory records, not a complete foreign city/borough database. Other continents exist in the catalog but have not been expanded into the initial page manifest. International service is not assumed.

## Why these 1,000 candidates

The selection reserves UK national/administrative coverage, all London boroughs, the City of London, 20 named Camden places, the requested Berkhamsted/Hemel Hempstead/St Albans/Birmingham/Northampton examples, European navigation, and a minimum spread of Scottish, Welsh and Northern Irish settlements. It fills the remaining places using population values in the downloaded source, deduplicating same-area, same-name settlement candidates where possible.

This is a deterministic starting list, not a keyword-research ranking or the final commercial rollout. A smaller place with real customers, providers or sourcing activity can be a better launch candidate than a larger place in this seed. Do not remove an already published location simply because a future population-ranked seed changes.

## Data mapping

| Seed field | Application meaning |
|---|---|
| `locations.id` | Stable internal source ID, e.g. `gn:2655858`, `country:GB` |
| `locations.parent_id` | Source-derived parent; import as `source_parent_id` |
| `locations.source_aliases` | Search suggestions requiring sensible filtering; not automatically alternate SEO URLs |
| `locations.latitude`, `longitude` | Representative source point; not a boundary or a professional's address |
| `locations.admin_codes` | Source administrative identifiers; not ONS GSS codes |
| `launch_pages.location_id` | Link to the source catalog |
| `launch_pages.parent_page_id` | Proposed browsing parent; import as `browse_parent_id` |
| `launch_pages.path` | Proposed relative canonical route on each configured site |
| `launch_pages.geo_review_status` | Defaults to `needs_review` |
| `launch_pages.publication_state` | Defaults to `prepared` |
| `launch_pages.index_state` | Defaults to `noindex` |
| `launch_pages.index_approval_by_site` | Empty until actual site-specific editorial approval |

Create separate site-area records for Party, Team and the business site, with their own copy, market mode and review state. Do not accidentally turn a location-wide approval into permission to index all three sites.

Location source IDs remain distinct even where two geographic entities share a browsing page. For example, London and Greater London share one suggested browsing hub; a city and its wider council area can share a navigation page. These routing choices never mean that a person serving the city serves the entire administrative area. Where that distinction makes the page misleading, editorially split the page before publication and preserve explicit coverage semantics.

Neighbourhood boundaries may overlap or be informal. Cross-borough flags are examples, not a complete boundary assessment. Official geography validation is still needed before using these relations for automatic whole-area coverage matching. Country code `GB` supports the public `/uk` slug; `XK` is a source extension for Kosovo rather than an ordinary assigned ISO code. Navigation classification is not a geopolitical claim.

## Rebuild the supplied seed offline

From the extracted kit directory, using Python 3.9 or later:

```bash
python3 build_location_seed.py --source-dir source_data --output-dir rebuilt_data --retrieved-on 2026-11-07
```

This reads the included source files and writes a separate output directory. No API key, account, geocoding service, database or network access is required. The default target is 1,000 page candidates. The curated baseline imposes a minimum set, so do not pass an arbitrarily small `--target`.

For a deliberate future source refresh:

```bash
python3 build_location_seed.py --source-dir refreshed_sources --output-dir refreshed_data --download
```

That command downloads current public GeoNames files. Review its differences before importing anything into production. It may encounter changed records or external network failures. The importer is a seed-building tool, not an unattended production migration service.

## Cost and context control

Store the data and generated copy once. Import the catalog server-side, fetch only relevant children/results, and cache rendered area pages. Do not attach the 25 MB JSONL to every user request or force Claude to read it in full. Normal visitors need no model calls, geocoding API calls or full-catalog downloads. The reusable template plus data approach is the main cost saving.

Preserve location attribution in the product, for example through a linked data-sources page. Read the licence notes before redistributing the datasets.
