/* src/utils/text17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v17.16: every word of a saved name starts with a capital. A word typed with any capital in it (McDonald's, WSET, UK) is left
   as typed; small joining words (and, of, the, &, in, on, for, to, a) stay lower case unless first.
   pb-cardfit: place-name joiners too (upon, under, le, la, de, du, en, sur): "Newcastle upon Tyne", "Chester le Street". */
const CAP_SMALL17 = /^(and|of|the|&|in|on|for|to|a|upon|under|le|la|de|du|en|sur)$/;


/* pb-cardfit: place names on the Profile Card — the town or city only (the first comma-separated part), each once.
   "Montreal, Quebec, Canada" -> "Montreal"; "St Albans, UK" + "London, UK" -> "St Albans", "London".
   A name with no comma (a country or region on its own: "UK", "Scotland", "International") stays as it is. */
function cardPlaces17(list) {
  const seen = new Set(), out = [];
  (Array.isArray(list) ? list : list ? [list] : []).forEach((l) => {
    const p = String(l == null ? "" : l).split(",").map((x) => x.trim()).filter(Boolean)[0] || "";
    const k = p.toLowerCase();
    if (!p || seen.has(k)) return;
    seen.add(k);
    out.push(p);
  });
  return out;
}


function capWords17(s) {
  const t = String(s == null ? "" : s).trim().replace(/\s+/g, " ");
  if (!t) return t;
  return t.split(" ").map((w, i) => {
    if (w !== w.toLowerCase()) return w;
    if (i > 0 && CAP_SMALL17.test(w)) return w;
    return w.replace(/^(\P{L}*)(\p{L})/u, (m, a, b) => a + b.toUpperCase());
  }).join(" ");
}


/* Categories whose names are not words people read as titles: contact details, media file names, reviews. */
const CAP_SKIP17 = ["contact", "media", "reviews"];


function capRec17(cat, r) {
  if (!r || typeof r.name !== "string" || CAP_SKIP17.includes(cat)) return r;
  const n = capWords17(r.name);
  return n === r.name ? r : { ...r, name: n };
}


/* Saved records from before v17.16: every name normalised once. */
function capRecords17(records) {
  if (!records) return records;
  const out = {};
  Object.keys(records).forEach((k) => { out[k] = Array.isArray(records[k]) ? records[k].map((r) => capRec17(k, r)) : records[k]; });
  return out;
}


/* The card's own lists (people in the directory): every entry capitalised. */
function capList17(list) { return (list || []).map((x) => (typeof x === "string" ? capWords17(x) : x)); }
