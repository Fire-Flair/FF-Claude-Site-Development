/* src/utils/cv-extraction.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- validate -------------------------------------------------------------
   The schema every reply must meet before anything is shown. Lenient where
   a fix is safe (missing confidence -> "medium", i.e. "check this"), strict
   where it isn't (no category or title -> rejected and counted). */
function validateExtraction(raw) {
  const out = { name: "", summary: "", photo: null, unreadable: [], items: [], rejected: [] };
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    out.rejected.push({ reason: "The reply wasn't a JSON object" });
    return out;
  }
  const str = (v, max) => typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : (typeof v === "number" ? String(v) : "");
  out.name = str(raw.name, 80);
  out.summary = str(raw.summary, 1200);
  if (Array.isArray(raw.unreadable)) out.unreadable = raw.unreadable.map(x => str(x, 240)).filter(Boolean).slice(0, 12);
  const ph = raw.photo;
  if (ph && typeof ph === "object") {
    if (Number.isInteger(ph.candidate) && ph.candidate > 0) out.photo = { candidate: ph.candidate };
    else if (Number.isInteger(ph.page) && Array.isArray(ph.box) && ph.box.length === 4 && ph.box.every(n => typeof n === "number" && n >= 0 && n <= 1) && ph.box[2] > 0.02 && ph.box[3] > 0.02) {
      out.photo = { page: ph.page, box: ph.box };
    }
  }
  if (!Array.isArray(raw.items)) { out.rejected.push({ reason: "No items list in the reply" }); return out; }
  raw.items.forEach((it) => {
    const no = (reason) => out.rejected.push({ reason, title: str(it && it.title, 80), category: str(it && it.category, 24) });
    if (!it || typeof it !== "object" || Array.isArray(it)) return no("Item isn't an object");
    const category = str(it.category, 24).toLowerCase();
    if (!CVX_CATEGORIES[category]) return no(`Unknown category "${category || "none"}"`);
    const title = str(it.title, 400);
    if (title.length < 2) return no("No title");
    if (title.length > 160) return no("Title too long to be a card title");
    const d = it.details && typeof it.details === "object" && !Array.isArray(it.details) ? it.details : {};
    const details = {};
    CVX_DETAIL_KEYS.forEach(k => { const v = str(d[k], 140); if (v) details[k] = v; });
    if (Array.isArray(d.venues)) {
      const v = [...new Set(d.venues.map(x => str(x, 90)).filter(Boolean))].slice(0, 40);
      if (v.length) details.venues = v;
    }
    let prof = str(it.proficiency, 30);
    if (prof) {
      const m = PROFICIENCY.find(p => p.toLowerCase() === prof.toLowerCase());
      if (m) prof = m;
      else { if (!details.level) details.level = prof; prof = ""; }
    }
    out.items.push({
      category, title, proficiency: prof, details,
      description: str(it.description, 900),
      evidence: str(it.evidence, 260),
      confidence: CVX_CONFIDENCE.includes(it.confidence) ? it.confidence : "medium",
      page: Number.isInteger(it.page) && it.page > 0 ? it.page : null,
    });
  });
  return out;
}



/* ---- dedupe -------------------------------------------------------------
   Semantic, not exact: case, punctuation, "&"/"and", plurals, word order,
   filler words and bracketed notes don't make a new attribute. Distinct
   activities stay distinct ("Running" is not "Marathon Running"). */
const ATTR_FILLER = new Set(["a", "an", "the", "of", "and", "in", "for", "to", "at", "with", "on", "my", "skill", "skills"]);


function normAttr(s) {
  return String(s || "").toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, " ").replace(/&/g, " and ").replace(/[—–-]/g, " ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/).filter(w => w && !ATTR_FILLER.has(w))
    .map(w => w.length > 4 && w.endsWith("ies") ? w.slice(0, -3) + "y" : w.length > 3 && w.endsWith("s") && !w.endsWith("ss") ? w.slice(0, -1) : w)
    .sort().join(" ");
}


const sameAttr = (a, b) => { const x = normAttr(a); return !!x && x === normAttr(b); };


/* Does `whole` already name `part`? (every word of it, in any order) */
const namesAttr = (whole, part) => {
  const p = normAttr(part).split(" ").filter(Boolean);
  if (!p.length) return false;
  const w = new Set(normAttr(whole).split(" "));
  return p.every(t => w.has(t));
};



/* The card title a suggestion becomes. Experience keeps the app's
   "Employer — Role" convention. */
function recordNameFor(s) {
  const d = s.details || {};
  const t = String(s.title || "").trim();
  if (s.category === "employment" && d.employer && !namesAttr(t, d.employer)) return `${d.employer} — ${t}`;
  if (s.category === "freelance" && !/freelanc/i.test(t)) return `Freelance — ${t}`;
  if (s.category === "education" && d.employer && !namesAttr(t, d.employer)) return `${t} — ${d.employer}`;
  return t;
}



const CONF_RANK = { high: 3, medium: 2, low: 1 };


function mergeSuggestion(a, b) {
  if ((b.description || "").length > (a.description || "").length) a.description = b.description;
  if (CONF_RANK[b.confidence] > CONF_RANK[a.confidence]) a.confidence = b.confidence;
  if (!a.evidence && b.evidence) a.evidence = b.evidence;
  if (!a.proficiency && b.proficiency) a.proficiency = b.proficiency;
  const da = a.details || (a.details = {}), db = b.details || {};
  Object.keys(db).forEach(k => {
    if (k === "venues") da.venues = [...new Set([...(da.venues || []), ...db.venues])];
    else if (!da[k]) da[k] = db[k];
  });
  a.merged = (a.merged || 0) + 1;
}



/* Only fills what the existing card leaves empty — never overwrites. */
function blanksToFill(existing, s) {
  const fill = {};
  if (!String(existing.description || "").trim() && s.description) fill.description = s.description;
  if (s.to === "languages" && !existing.proficiency && s.proficiency) fill.proficiency = s.proficiency;
  if (s.to === "venues" && !String(existing.address || "").trim() && s.details && s.details.location) fill.address = s.details.location;
  const det = detailsForRecord(s);
  if (det) {
    const cur = existing.details || {};
    const add = {};
    Object.entries(det).forEach(([k, v]) => { if (k !== "type" && (cur[k] === undefined || cur[k] === "" || (Array.isArray(cur[k]) && !cur[k].length))) add[k] = v; });
    if (Object.keys(add).length) fill.details = add;
  }
  return Object.keys(fill).length ? fill : null;
}



function detailsForRecord(s) {
  const d = { ...(s.details || {}) };
  Object.keys(d).forEach(k => { if (!d[k] || (Array.isArray(d[k]) && !d[k].length)) delete d[k]; });
  if (s.category && s.category !== s.to) d.type = s.category;
  return Object.keys(d).length ? d : null;
}



/* Which details a category keeps — a Profession isn't tied to one employer. */
const CVX_KEEP_DETAILS = { profession: [], skill: [], interest: [], location: [], language: ["level"], other: ["group"] };



/* "ALEXANDRU GAVRILAS" -> "Alexandru Gavrilas"; names already in mixed case are left alone. */
const displayName = (n) => /[a-z]/.test(n) ? n : String(n).toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (m, a, c) => a + c.toUpperCase());



/* Validated extraction -> review suggestions: merged inside the result,
   matched against the profile, with the photo and profile text alongside. */
function buildSuggestions(x, profile) {
  const list = [], seen = new Map();
  let merged = 0;
  (x.items || []).forEach(it => {
    const def = CVX_CATEGORIES[it.category] || CVX_CATEGORIES.other;
    const keep = CVX_KEEP_DETAILS[it.category];
    const details = {};
    Object.entries(it.details || {}).forEach(([dk, dv]) => { if (!keep || keep.includes(dk)) details[dk] = dv; });
    const s = { key: uid("sg"), kind: "record", ...it, details, to: def.to };
    const nk = normAttr(recordNameFor(s));
    const k = `${s.to}|${nk}|${s.category === "employment" ? normAttr(s.details.start || "") : ""}`;
    /* "other" never repeats something already found under a real category. */
    const twin = s.category === "other" ? list.find(o => normAttr(recordNameFor(o)) === nk || normAttr(o.title) === normAttr(s.title)) : null;
    if (twin || seen.has(k)) { mergeSuggestion(twin || seen.get(k), { ...s, details: twin && twin.to !== s.to ? {} : s.details }); merged++; return; }
    seen.set(k, s); list.push(s);
  });
  list.forEach(s => {
    const name = recordNameFor(s);
    const ex = recsOf(profile, s.to).find(r => sameAttr(r.name, name));
    if (ex) { s.existing = { id: ex.id, name: ex.name }; s.fill = blanksToFill(ex, s); }
  });
  const extra = [];
  if (x.name && !String(profile.name || "").trim()) extra.push({ key: uid("sg"), kind: "name", category: "profile", title: displayName(x.name), description: "", confidence: "high" });
  if (x.summary) {
    const has = String(profile.about || "").trim();
    if (!sameAttr(has, x.summary)) extra.push({ key: uid("sg"), kind: "about", category: "profile", title: "About you", description: x.summary, confidence: "high", replaces: !!has });
  }
  return { suggestions: [...extra, ...list], merged };
}



/* Approved suggestions -> new records + fills for existing ones. */
function recordsFromSuggestions(list, src) {
  const byCategory = {}, fills = [];
  list.forEach(s => {
    if (s.existing) { if (s.fill) fills.push({ category: s.to, id: s.existing.id, patch: s.fill }); return; }
    const extra = {
      description: s.description || "",
      proposed: false,
      source: { origin: src.origin, location: s.page ? `${src.location} · page ${s.page}` : src.location, confidence: s.confidence || "medium", evidence: s.evidence || "" },
    };
    if (s.to === "languages" && s.proficiency) extra.proficiency = s.proficiency;
    const det = detailsForRecord(s);
    if (det) extra.details = det;
    if (s.to === "venues" && s.details && s.details.location) extra.address = s.details.location;
    (byCategory[s.to] = byCategory[s.to] || []).push(makeRecord(s.to, recordNameFor(s), extra));
  });
  return { byCategory, fills };
}



/* One line of the facts that matter on a card: employer · place · dates
   (or a language's level). The employer is left out when the card's title
   already names it. */
function detailsLine(details, proficiency, name) {
  const d = details || {};
  const dates = [d.start, d.end].filter(Boolean).join(" – ");
  const level = d.level && proficiency && d.level.toLowerCase().includes(proficiency.toLowerCase()) ? d.level : [proficiency, d.level].filter(Boolean).join(" · ");
  const employer = d.employer && name && namesAttr(name, d.employer) ? "" : d.employer;
  return [level, employer, d.location, dates, d.issuer].filter(Boolean).join(" · ");
}



/* Photo: the AI names a candidate picture, or a box on a page picture. */
async function resolvePhoto(x, doc) {
  const sel = x && x.photo;
  if (!sel) return null;
  try {
    if (sel.candidate) {
      const c = (x.photoFrom || [])[sel.candidate - 1];
      if (c) return { src: await blobToDataUrl(c.blob), from: c.page ? `page ${c.page} of your CV` : "your CV" };
    }
    if (sel.page && sel.box) {
      const pg = doc.pageImages.find(p => p.page === sel.page);
      if (!pg) return null;
      const bmp = await createImageBitmap(pg.hi);
      const [l, t, w, h] = sel.box, pad = 0.12;
      const side = Math.max(w * bmp.width, h * bmp.height) * (1 + pad * 2);
      const cx = (l + w / 2) * bmp.width, cy = (t + h / 2) * bmp.height;
      const r = { x: Math.max(0, cx - side / 2), y: Math.max(0, cy - side / 2) };
      r.w = Math.min(bmp.width - r.x, side); r.h = Math.min(bmp.height - r.y, side);
      const blob = await cropBlob(bmp, r, 900);
      bmp.close && bmp.close();
      return { src: await blobToDataUrl(blob), from: `page ${sel.page} of your CV` };
    }
  } catch (e) { /* no photo rather than a wrong one */ }
  return null;
}



/* Without the AI: the old phrase matcher, honestly labelled. */
function fallbackSuggestions(text, profile) {
  const map = { professions: "profession", skills: "skill", interests: "interest", locations: "location", languages: "language" };
  const items = [];
  Object.entries(profileFromText(text)).forEach(([cat, vals]) => vals.forEach(v => items.push({
    category: map[cat] || "other", title: v, description: "", evidence: "", confidence: "medium", page: null, proficiency: "", details: {},
  })));
  return buildSuggestions({ items }, profile);
}



/* The extraction report — what was read, what came back, and why anything
   is missing. Logged to the console and shown under "How this was read". */
function extractionReport({ doc, x, built, error, fallback, ms }) {
  const sugg = (built && built.suggestions) || [];
  const recs = sugg.filter(s => s.kind === "record");
  const byCategory = {};
  recs.forEach(s => { byCategory[s.category] = (byCategory[s.category] || 0) + 1; });
  const unreadable = [...((doc && doc.warnings) || []), ...((x && x.unreadable) || [])];
  if (x && x.sent && x.sent.truncated) unreadable.push("The end of the document was too long to read.");
  const r = {
    file: doc ? { name: doc.fileName, kind: doc.kind, pages: doc.pageCount, pagesRead: doc.pagesRead, textChars: (doc.text || "").length, scannedPages: doc.scannedPages, pictures: doc.pageImages.length, candidates: doc.candidates.length } : null,
    method: fallback ? "Simple matching (FireFlair not available)" : x ? `FireFlair (${CV_ADAPTER.provider})` : "—",
    statuses: {
      extracted: recs.filter(s => !s.existing && s.confidence === "high").length,
      needsConfirmation: recs.filter(s => !s.existing && s.confidence !== "high").length,
      unreadable: unreadable.length,
      rejectedBySchema: ((x && x.rejected) || []).length,
      duplicatesMerged: (built && built.merged) || 0,
      alreadyOnProfile: recs.filter(s => s.existing).length,
      failures: ((x && x.calls) || []).filter(c => !c.ok).length + (error ? 1 : 0),
    },
    byCategory,
    unreadableNotes: unreadable,
    rejected: (x && x.rejected) || [],
    calls: (x && x.calls) || [],
    sent: (x && x.sent) || null,
    error: error ? { code: error.code || "error", message: error.message } : null,
    ms,
  };
  try {
    console.info("[FireFlair] extraction report", r);
    if (Object.keys(byCategory).length) console.table(byCategory);
  } catch (e) { /* console unavailable */ }
  try { window.FFAI_LAST_REPORT = r; } catch (e) { /* read-only window */ }
  return r;
}
