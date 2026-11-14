/* src/components/team/work-locations.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- Postcode → area table (offline estimate) ---------------------------
   v17.6.1: the postcode is private (state.workPostcode, never shown on a profile
   or card) and only puts the base on the map (base17.jsx). Work locations are
   ticked from one list (coverage17.jsx), with no primary place and no distance.
   In the prototype the postcode → area step is this table, used when the live
   postcode lookup cannot be reached (LOCATION_ADAPTER.offline); the real site
   would use a postcode lookup (e.g. postcodes.io). */
const PC_PRESETS = {
  SE: ["London", "Central London", "Birmingham"],
  LDN: ["Central London", "Hertfordshire", "Birmingham"],
  MID: ["Birmingham", "Manchester", "Central London"],
  NW: ["Manchester", "Liverpool", "Central London"],
  NE: ["Newcastle upon Tyne", "Leeds", "Central London"],
  SW: ["Bristol", "Central London", "Birmingham"],
  SC: ["Edinburgh", "Glasgow", "Central London"],
  WL: ["Cardiff", "Bristol", "Central London"],
  EA: ["Cambridge", "Central London", "Birmingham"],
};


const PC_TABLE = `HP4|Berkhamsted|St Albans,Aylesbury,Hemel Hempstead|SE
HP|Hemel Hempstead|St Albans,Aylesbury,Watford|SE
AL|St Albans|Harpenden,Hatfield,Watford|SE
WD|Watford|St Albans,Harrow,Hemel Hempstead|SE
EN|Enfield|North London,Barnet,Cheshunt|LDN
N|North London|Islington,Camden,Enfield|LDN
NW|North London|Camden,Barnet,Harrow|LDN
E|East London|Shoreditch,Hackney,Stratford|LDN
EC|Central London|Shoreditch,City of London,Islington|LDN
WC|Central London|Soho,Westminster,Camden|LDN
W|West London|Notting Hill,Kensington,Mayfair|LDN
SW|South London|Chelsea,Clapham,Wimbledon|LDN
SE|South London|Greenwich,Brixton,Croydon|LDN
SL|Slough|Windsor,Ascot,Reading|SE
UB|West London|Harrow,Richmond,Windsor|SE
HA|Harrow|Watford,West London,Barnet|SE
TW|Richmond|Kingston upon Thames,West London,Windsor|SE
KT|Kingston upon Thames|Richmond,Epsom,Guildford|SE
CR|Croydon|South London,Epsom,Brighton|SE
BR|South London|Croydon,Greenwich,Kent|SE
DA|Kent|Greenwich,South London,Canterbury|SE
IG|East London|Stratford,Essex,Chelmsford|SE
RM|Essex|East London,Chelmsford,Southend-on-Sea|SE
LU|Luton|St Albans,Milton Keynes,Hertfordshire|SE
MK|Milton Keynes|Northampton,Oxford,Cambridge|SE
OX|Oxford|Reading,Cheltenham,The Cotswolds|SE
RG|Reading|Windsor,Oxford,Guildford|SE
GU|Guildford|Surrey,Epsom,Southampton|SE
BN|Brighton|Surrey,Kent,Portsmouth|SE
SO|Southampton|Portsmouth,Bournemouth,Bath|SW
PO|Portsmouth|Southampton,Brighton,Bournemouth|SW
BH|Bournemouth|Southampton,Exeter,Bath|SW
BA|Bath|Bristol,Cheltenham,The Cotswolds|SW
BS|Bristol|Bath,Cardiff,Cheltenham|SW
EX|Exeter|Plymouth,Bath,Bristol|SW
PL|Plymouth|Exeter,Bristol,Bath|SW
GL|Cheltenham|Bristol,Bath,The Cotswolds|SW
CB|Cambridge|Norwich,Ipswich,Milton Keynes|EA
NR|Norwich|Cambridge,Ipswich,Colchester|EA
IP|Ipswich|Norwich,Colchester,Cambridge|EA
CO|Colchester|Chelmsford,Ipswich,Essex|EA
CM|Chelmsford|Colchester,Essex,Southend-on-Sea|EA
SS|Southend-on-Sea|Chelmsford,Essex,East London|EA
CT|Canterbury|Kent,Tunbridge Wells,Brighton|SE
TN|Tunbridge Wells|Kent,Brighton,Surrey|SE
B|Birmingham|Coventry,Leicester,Derby|MID
CV|Coventry|Birmingham,Leicester,Northampton|MID
LE|Leicester|Nottingham,Derby,Coventry|MID
NG|Nottingham|Derby,Leicester,Sheffield|MID
DE|Derby|Nottingham,Leicester,Birmingham|MID
NN|Northampton|Milton Keynes,Leicester,Coventry|MID
M|Manchester|Liverpool,Leeds,Sheffield|NW
L|Liverpool|Manchester,Chester,Leeds|NW
CH|Chester|Liverpool,Manchester,Birmingham|NW
S|Sheffield|Leeds,Nottingham,Manchester|NW
LS|Leeds|Harrogate,York,Sheffield|NE
BD|Leeds|Harrogate,York,Manchester|NE
HG|Harrogate|Leeds,York,Newcastle upon Tyne|NE
YO|York|Harrogate,Leeds,Newcastle upon Tyne|NE
NE|Newcastle upon Tyne|York,Leeds,Edinburgh|NE
CF|Cardiff|Swansea,Bristol,Bath|WL
SA|Swansea|Cardiff,Bristol,Bath|WL
EH|Edinburgh|Glasgow,Aberdeen,Newcastle upon Tyne|SC
G|Glasgow|Edinburgh,Aberdeen,Belfast|SC
AB|Aberdeen|Edinburgh,Glasgow,Newcastle upon Tyne|SC
BT|Belfast|Glasgow,Edinburgh,Manchester|SC`;


const PC_AREAS = Object.fromEntries(PC_TABLE.split("\n").map(l => {
  const [k, t, n, f] = l.split("|");
  return [k, { t, n: n.split(","), f: PC_PRESETS[f] }];
}));


function parsePostcode(raw) {
  const s = String(raw || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const full = s.match(/^([A-Z]{1,2}\d[A-Z\d]?)(\d[A-Z]{2})$/);
  const out = full ? full[1] : (/^[A-Z]{1,2}\d[A-Z\d]?$/.test(s) ? s : null);
  if (!out) return { ok: false };
  return { ok: true, outward: out, display: full ? `${full[1]} ${full[2]}` : out, partial: !full };
}


function postcodeArea(p) {
  const letters = (p.outward.match(/^[A-Z]+/) || [""])[0];
  return PC_AREAS[p.outward] || PC_AREAS[letters] || null;
}
