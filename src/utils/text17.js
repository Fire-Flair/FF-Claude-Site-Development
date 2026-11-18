/* src/utils/text17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v17.16: every word of a saved name starts with a capital. A word typed with any capital in it (McDonald's, WSET, UK) is left
   as typed; small joining words (and, of, the, &, in, on, for, to, a, an, or, at, by, upon, with — pb-typecards added the last six) stay lower case unless first. */
const CAP_SMALL17 = /^(and|of|the|&|in|on|for|to|a|an|or|at|by|upon|with)$/;


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
