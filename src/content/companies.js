/* src/content/companies.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Real UK event companies, as unclaimed draft Company Cards built from public information.
   Source of truth: one file per company in data/companies/profiles/<slug>.json (format version 2, docs/company-profile-format.md).
   npm run companies (also part of npm run build) checks them and writes src/content/companies/real-companies.json (bar companies) and
   suppliers.json (every other category), which CONTENT_ADAPTER reads. The page is the profile passed through as it is, so a directory
   company with packages, cocktails, Q&A or its own sections shows them with no further code.
   Unclaimed: not offered for booking and kept off FF Party until the company claims it. */

/* The kind each contact card is, as the key the Company Card icons use. */
const DIR_SOCIAL17 = { Instagram: "instagram", Facebook: "facebook", LinkedIn: "linkedin", TikTok: "tiktok", WhatsApp: "whatsapp" };

/* The short row the lists, the map and the search read, taken from a profile. The profile itself stays on the row. */
function dirRow17(p) {
  const m = p.meta || {};
  return { slug: p.slug, name: p.name, kind: p.kind, tag: m.tag, base: p.base || "", areas: p.areas || [], locations: m.pins || [], cat: m.category === "bar" ? undefined : m.category, status: m.partner ? "partner" : "unclaimed", unclaimed: m.status !== "claimed", profile: p };
}

/* Contact details a company supplied that must not sit in a profile file (this repository is public). The page shows them as
   the company's own contact cards, after the file's cards (or at the position given). Core holds these in the company's private
   contact record; this list is only the prototype's stand-in for it. Each entry: [kind, value, position]. */
const DIR_PRIVATE17 = {
  "raise-the-bar": [["Email", "info@raisethebarglasgow.com"], ["Phone", "07498 723388"]],
  vooshka: [["WhatsApp", "+44 7814 904355", 0]],
};

/* A profile with the private contact cards added. Nothing else changes. */
function dirWithPrivate17(p) {
  const extra = DIR_PRIVATE17[p.slug];
  if (!extra) return p;
  const list = [...((p.records && p.records.contact) || [])];
  extra.forEach(([kind, value, at]) => {
    const card = { id: "private-" + kind.toLowerCase(), name: value, description: kind, source: { by: "owner", at: "2026-11-10" } };
    if (at === undefined) list.push(card); else list.splice(at, 0, card);
  });
  return { ...p, records: { ...(p.records || {}), contact: list } };
}

const REAL_COMPANIES11 = CONTENT_ADAPTER.companyProfiles().map((p) => dirRow17(dirWithPrivate17(p)));


const realBase11 = (c) => ({ id: "co_" + c.slug, name: c.name, kind: c.kind, area: c.areas[0] || "", tag: c.tag, tier: "standard", unclaimed: c.unclaimed, locations: c.locations || [] });


/* A profile card as the builder's card record. A card with no source reads as written by a person. */
function dirCard17(cat, r) {
  return makeRecord(cat, r.name, {
    id: r.id,
    description: r.description || "",
    media: (r.media || []).slice(0, 5).map((m, i) => ({ id: m.id || r.id + "_p" + i, name: m.alt || r.name, dataUrl: m.src })),
    document: r.document ? { name: r.document.name, type: r.document.type || "application/pdf", dataUrl: r.document.src } : null,
    hidden: !!r.hidden,
    proposed: !!r.proposed,
    source: r.source || { by: "owner" },
  });
}


const realPage11 = (c) => {
  const p = c.profile, m = p.meta || {};
  const chipsOf = (title) => ((p.info || []).find((s) => s.title === title) || {}).chips || [];
  const cards = (p.records && p.records.contact) || [];
  const live = cards.filter((r) => !r.hidden && !r.proposed);
  const records = Object.fromEntries(Object.entries(p.records || {}).filter(([, list]) => list && list.length).map(([key, list]) => [key, rankAll(list.map((r) => dirCard17(key.startsWith("info_") ? "info" : key, r)))]));
  const qa = (p.qa || []).filter((q) => !q.proposed).map((q, i) => ({ id: q.id || "qa_" + p.slug + i, group: q.group || "business", answer: "", note: "", ...q }));
  return ["co_" + c.slug, {
    name: p.name, kind: p.kind, areas: (p.areas || []).join(" · "), slug: p.slug,
    socials: Object.fromEntries(live.filter((r) => DIR_SOCIAL17[r.description]).map((r) => [DIR_SOCIAL17[r.description], r.name])),
    theme: (p.card && p.card.theme) || ({ dj: "magenta", photo: "cobalt", catering: "saffron", svc: "grey" })[c.cat] || "onyx", layout: (p.card && p.card.layout) || "classic", tier: m.tier || "standard", unclaimed: c.unclaimed,
    description: p.description, team: [], venues: [], reviews: [],
    logo: p.logo || undefined, logoWide: !!p.logoWide, logoBg: p.logoBg || "dark",
    media: (p.media || []).map((x) => ({ id: x.id, src: x.src, alt: x.alt || p.name })),
    /* Contact rows are the website, phone, email and WhatsApp cards; the social links show as the icons on the Company Card. */
    contact: live.filter((r) => !DIR_SOCIAL17[r.description] || r.description === "WhatsApp").map((r) => [r.description || "Contact", r.description === "Website" ? r.name.replace(/^https?:\/\/(www\.)?/, "") : r.name]),
    /* The company's own sections (their cards are in records["info_<id>"]). Services, Events, Scale and Good to know are sections that use Tags. */
    info: (p.info || []).filter((s) => !s.proposed).map((s) => ({ ...s, ...(s.chips ? { chips: [...s.chips] } : {}) })),
    seed: { services: chipsOf("Services"), eventTypes: chipsOf("Events"), scale: chipsOf("Scale"), facts: chipsOf("Good to know"), base: p.base || "" },
    ...(Object.keys(records).length ? { records } : {}),
    ...(qa.length ? { qa } : {}),
    areaPlaces: c.profile.areaPlaces || [],
    areasNote: p.areasNote || "",
    aboutSource: p.aboutSource,
    profileMeta: m,
  }];
};


/* ===========================================================================
   Event suppliers (v17.3.105): 30 DJs, 30 photographers and 30 caterers as
   unclaimed draft Company Cards, from data/companies/seed-djs.json,
   seed-photographers.json and seed-caterers.json. cat is "dj", "photo" or
   "catering". They have a page and a map pin but are NOT added to COMPANIES,
   so the FF Party "Bar companies" lists stay bars only.
   =========================================================================== */
const REAL_SUPPLIERS17 = CONTENT_ADAPTER.supplierProfiles().map(dirRow17);


const SUPPLIER_BASES17 = Object.fromEntries(REAL_SUPPLIERS17.map((c) => ["co_" + c.slug, { ...realBase11(c), cat: c.cat, ...(c.status === "partner" ? { partner: true } : {}) }]));


const MAP_GLYPH17 = {
  bar: '<path d="M5 5h14l-7 8z"/><path d="M12 13v6M8.5 19h7"/>',
  dj: '<path d="M4.5 15v-3a7.5 7.5 0 0 1 15 0v3"/><rect x="3.5" y="14" width="4" height="6" rx="1.6"/><rect x="16.5" y="14" width="4" height="6" rx="1.6"/>',
  photo: '<path d="M4 8.5h3l1.4-2h7.2l1.4 2h3V19H4z"/><circle cx="12" cy="13.4" r="3.2"/>',
  catering: '<path d="M7 3.5v5a2.5 2.5 0 0 0 5 0v-5M9.5 11v9.5"/><path d="M17 3.5c-2.2 1.4-3 4.2-3 7.5h3.2V3.5zM17 11v9.5"/>',
  person: '<circle cx="12" cy="8.5" r="3.6"/><path d="M5 20c0-4.2 3-6.4 7-6.4s7 2.2 7 6.4z"/>'
};


MAP_GLYPH17.svc = MAP_GLYPH17.photo;


/* Netmap: FF Directory map dots in muted FireFlair palette tints (burgundy, dark gold, warm grey, burgundy tint). */
const MAP_COL17 = { bar: "#5C1220", dj: "#7E611D", photo: "#4A443A", svc: "#4A443A", catering: "#8A4A55" };


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


const COMPANY_CATS17 = [["bar", "Bar companies", "#5C1220"], ["dj", "Entertainment", "#7E611D"], ["photo", "Event services", "#4A443A"], ["catering", "Caterers", "#8A4A55"]];


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
  ...REAL_COMPANIES11.filter((c) => c.slug !== "vooshka").map(realBase11),
];




/* ==========================================================================
   FF STAFF 1.0 — booking rules held as data, so Core can serve them later.
   ========================================================================== */
const RESPONSE_HOURS = 24;

                       // Availability + Question Cards expire after this
const RESPONSE_MS = RESPONSE_HOURS * 36e5;


const CREDIT_FEE = "£10";
