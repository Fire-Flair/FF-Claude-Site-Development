/* src/content/companies.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Real UK event bar companies, built as unclaimed draft Company Cards from public information.
   The same data lives in data/companies/seed-companies.json, ready to import into the real site
   as drafts. Unclaimed: not offered for booking and kept off FF Party until the company claims it. */
const REAL_COMPANIES11 = CONTENT_ADAPTER.companyProfiles();


const realBase11 = (c) => ({ id: "co_" + c.slug, name: c.name, kind: c.kind, area: c.areas[0] || "", tag: c.tag, tier: "standard", unclaimed: true, locations: c.locations || [] });


const realPage11 = (c) => ["co_" + c.slug, {
  name: c.name, kind: c.kind, areas: c.areas.join(" · "), slug: c.slug, socials: c.social || {}, theme: "onyx", layout: "classic", tier: "standard", unclaimed: true,
  description: c.summary, team: [], venues: [], reviews: [],
  logo: (c.images && c.images.logo) || undefined, logoWide: !!(c.images && c.images.logoWide), logoBg: (c.images && c.images.logoBg) || "dark",
  media: ((c.images && c.images.photos) || []).map((u, i) => ({ id: c.slug + "_" + i, src: u, alt: c.name })),
  contact: c.website ? [["Website", c.website.replace(/^https?:\/\/(www\.)?/, "")]] : [],
  seed: { services: c.services || [], eventTypes: c.eventTypes || [], scale: c.scale || [], facts: c.facts || [], base: c.base || "" },
}];


/* ===========================================================================
   Event suppliers (v17.3.105): 30 DJs, 30 photographers and 30 caterers as
   unclaimed draft Company Cards, from data/companies/seed-djs.json,
   seed-photographers.json and seed-caterers.json. cat is "dj", "photo" or
   "catering". They have a page and a map pin but are NOT added to COMPANIES,
   so the FF Party "Bar companies" lists stay bars only.
   =========================================================================== */
const REAL_SUPPLIERS17 = CONTENT_ADAPTER.supplierProfiles();


const SUPPLIER_BASES17 = Object.fromEntries(REAL_SUPPLIERS17.map((c) => ["co_" + c.slug, { ...realBase11(c), cat: c.cat, ...(c.status === "partner" ? { partner: true } : {}) }]));


const MAP_GLYPH17 = {
  bar: '<path d="M5 5h14l-7 8z"/><path d="M12 13v6M8.5 19h7"/>',
  dj: '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.6"/><rect x="16.5" y="14" width="4" height="6" rx="1.6"/>',
  photo: '<path d="M4 8.5h3l1.4-2h7.2l1.4 2h3V19H4z"/><circle cx="12" cy="13.4" r="3.2"/>',
  catering: '<path d="M7 3.5v5a2.5 2.5 0 0 0 5 0v-5M9.5 11v9.5"/><path d="M17 3.5c-2.2 1.4-3 4.2-3 7.5h3.2V3.5zM17 11v9.5"/>',
  person: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c0-4.2 3-6.4 7-6.4s7 2.2 7 6.4z"/>'
};


MAP_GLYPH17.svc = MAP_GLYPH17.photo;


const MAP_COL17 = { bar: "#6E1F2F", dj: "#6B3FB5", photo: "#2A6BB0", svc: "#2A6BB0", catering: "#D2762B" };


function MapGlyph17(props) {
  return React.createElement("svg", { viewBox: "0 0 24 24", width: props.size, height: props.size, fill: "none", stroke: props.color || "#fff", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", dangerouslySetInnerHTML: { __html: MAP_GLYPH17[props.g] || MAP_GLYPH17.bar } });
}


function MapDot17(props) {
  const cat = props.cat || "bar", s = props.size || (props.on ? 28 : 22);
  return React.createElement("span", { className: "ff-mdot" + (props.on ? " on" : ""), style: { width: s, height: s, background: MAP_COL17[cat] || MAP_COL17.bar } }, React.createElement(MapGlyph17, { g: cat, size: Math.round(s * 0.62) }));
}


function MapPerson17(props) {
  const s = props.size || (props.on ? 28 : 22);
  return React.createElement("span", { className: "ff-mper" + (props.on ? " on" : ""), style: { width: s, height: s } }, React.createElement(MapGlyph17, { g: "person", size: Math.round(s * 0.66), color: "#EAD79C" }));
}


const COMPANY_CATS17 = [["bar", "Bar companies", "#6E1F2F"], ["dj", "Entertainment", "#6B3FB5"], ["photo", "Event services", "#2A6BB0"], ["catering", "Caterers", "#D2762B"]];


function companyLegend17(pins) {
  const items = COMPANY_CATS17.map(([cat, label, col]) => {
    const n = new Set(pins.filter((p) => p.kind === "company" && (p.cat || "bar") === cat).map((p) => p.coId)).size;
    if (!n) return null;
    return React.createElement("span", { key: cat, className: "ff-body ff-muted", style: { fontSize: 11, display: "flex", gap: 6, alignItems: "center" } },
      React.createElement(MapDot17, { cat: cat, size: 18 }), " " + label + " (" + n + ")");
  });
  if (!items.some(Boolean)) return items;
  return [React.createElement("span", { key: "dir", className: "ff-body", style: { fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center" } }, "FF Event Directory")].concat(items);
}


const COMPANIES = [
  /* Based in Luton; covers England and Wales (not Scotland or Northern Ireland). cover is read by the area pages' company lookup (fdCompanyCover). */
  { id: "co_vooshka", name: "Vooshka Cocktail Bar", kind: "Luxury mobile cocktail bar", area: "Luton", tag: "VOOSH", tier: "gold", base17: { locId: "gn:3333168" }, cover: ["England", "Wales"], locations: [{ label: "Luton", lat: 51.8911, lng: -0.4279, approx: false }] },
  ...REAL_COMPANIES11.map(realBase11),
];




const CONTACTS = [
  { id: "c1", name: "Olivia Grace", note: "Event Planner", onFF: true, tag: "OLIVG" },
  { id: "c2", name: "Marcus Bell", note: "Worked together at The Loft", onFF: false },
  { id: "c3", name: "Priya Raman", note: "Bartender", onFF: true, tag: "PRIYA" },
  { id: "c4", name: "Danny O'Shea", note: "Bar manager", onFF: false },
  { id: "c5", name: "Elena Duarte", note: "Sommelier", onFF: false },
];



/* ==========================================================================
   FF STAFF 1.0 — booking rules held as data, so Core can serve them later.
   ========================================================================== */
const RESPONSE_HOURS = 24;

                       // Availability + Question Cards expire after this
const RESPONSE_MS = RESPONSE_HOURS * 36e5;


const CREDIT_FEE = "£10";
