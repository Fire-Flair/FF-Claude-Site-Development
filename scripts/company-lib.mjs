/* scripts/company-lib.mjs — shared by build-companies.mjs, check-companies.mjs and convert-seeds.mjs.
   Loads the company profile files (data/companies/profiles/<slug>.json, format version 2), checks them against
   data/companies/company-profile.schema.json plus the rules a schema cannot hold, and resolves area names to place ids.
   No dependencies: the schema checker below reads the subset of JSON Schema that the schema file uses. */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {execFileSync} from 'child_process';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PROFILES_DIR = path.join(ROOT, 'data/companies/profiles');
export const SCHEMA_FILE = path.join(ROOT, 'data/companies/company-profile.schema.json');
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

/* ---- loading ------------------------------------------------------------------------------------------------ */
export function loadProfiles(dir = PROFILES_DIR) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort().map((f) => {
    const file = path.join(dir, f);
    try { return {file, name: f, data: JSON.parse(fs.readFileSync(file, 'utf8'))}; }
    catch (e) { return {file, name: f, error: 'not valid JSON: ' + e.message}; }
  });
}
/* The directory list order: by meta.position, then by slug. A file without a position goes last. */
export const listOrder = (a, b) => ((a.meta && a.meta.position) ?? 1e9) - ((b.meta && b.meta.position) ?? 1e9) || (a.slug < b.slug ? -1 : a.slug > b.slug ? 1 : 0);

/* ---- the subset of JSON Schema the schema file uses ------------------------------------------------------------- */
const typeOf = (v) => v === null ? 'null' : Array.isArray(v) ? 'array' : Number.isInteger(v) ? 'integer' : typeof v;
const typeOk = (t, v) => (t === 'number' ? typeof v === 'number' : t === 'integer' ? Number.isInteger(v) : typeOf(v) === t);
export function schemaErrors(schema, value, root = schema, p = '') {
  const out = [];
  if (schema.$ref) {
    const target = schema.$ref.replace(/^#\//, '').split('/').reduce((o, k) => o[k], root);
    out.push(...schemaErrors(target, value, root, p));
  }
  const at = p || '(file)';
  if ('const' in schema && value !== schema.const) out.push(`${at}: must be ${JSON.stringify(schema.const)}`);
  if (schema.enum && !schema.enum.includes(value)) out.push(`${at}: ${JSON.stringify(value)} is not one of ${schema.enum.map((x) => JSON.stringify(x)).join(', ')}`);
  if (schema.type) {
    const ts = [].concat(schema.type);
    if (!ts.some((t) => typeOk(t, value))) { out.push(`${at}: should be ${ts.join(' or ')}, found ${typeOf(value)}`); return out; }
  }
  if (typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) out.push(`${at}: is empty`);
    if (schema.maxLength !== undefined && value.length > schema.maxLength) out.push(`${at}: is ${value.length} characters long (limit ${schema.maxLength})`);
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) out.push(`${at}: ${JSON.stringify(value)} is not in the expected form`);
  }
  if (typeof value === 'number') {
    if (schema.minimum !== undefined && value < schema.minimum) out.push(`${at}: below ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) out.push(`${at}: above ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.maxItems !== undefined && value.length > schema.maxItems && !/\.media$/.test(p)) out.push(`${at}: has ${value.length} items (limit ${schema.maxItems})`);
    if (schema.minItems !== undefined && value.length < schema.minItems) out.push(`${at}: needs at least ${schema.minItems} items`);
    if (schema.items) value.forEach((v, i) => out.push(...schemaErrors(schema.items, v, root, `${p}[${i}]`)));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const k of schema.required || []) if (!(k in value)) out.push(`${p ? p + '.' : ''}${k}: is missing`);
    const props = schema.properties || {}, pats = Object.entries(schema.patternProperties || {});
    for (const [k, v] of Object.entries(value)) {
      const sub = props[k] || (pats.find(([re]) => new RegExp(re).test(k)) || [])[1];
      if (sub) out.push(...schemaErrors(sub, v, root, p ? `${p}.${k}` : k));
      else if (schema.additionalProperties === false) out.push(`${p ? p + '.' : ''}${k}: is not part of format 2`);
    }
  }
  return out;
}

/* ---- places: the same names the page resolves (covIdOfName17 in src/components/shared/coverage17.jsx) -------------- */
let PLACES = null;
function places() {
  if (PLACES) return PLACES;
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/data/fd-rows.json'), 'utf8'));
  const aliases = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/content/data/fd-aliases.json'), 'utf8'));
  const nodes = rows.map((r, i) => ({i, id: r[0], name: r[1], pi: r[3], lat: r[5], lng: r[6], kids: []}));
  nodes.forEach((n) => { if (n.pi >= 0) nodes[n.pi].kids.push(n.i); });
  const byId = {}; nodes.forEach((n) => { byId[n.id] = n; });
  const dup = {}; nodes.forEach((n) => { dup[n.name] = (dup[n.name] || 0) + 1; });
  const label = (n) => (dup[n.name] > 1 && n.pi >= 0 ? `${n.name}, ${nodes[n.pi].name}` : n.name);
  const tick = (n) => (n.id === 'country:GB' ? 'UK-wide' : n.id === 'worldwide' ? 'Worldwide' : label(n));
  const map = {};
  nodes.forEach((n) => { const k = tick(n).toLowerCase(); if (!map[k]) map[k] = n; });
  map['united kingdom'] = byId['country:GB']; map['greater london'] = byId['gn:2648110'];
  Object.entries(aliases.names || {}).forEach(([k, id]) => { if (!map[k] && byId[id]) map[k] = byId[id]; });
  const desc = (n, acc = []) => { n.kids.forEach((i) => { acc.push(nodes[i]); desc(nodes[i], acc); }); return acc; };
  const centre = (n) => {
    if (n.lat != null && n.lng != null) return {lat: n.lat, lng: n.lng};
    const pts = (k) => k.filter((x) => x.lat != null && x.lng != null);
    let d = pts(n.kids.map((i) => nodes[i]));
    if (!d.length) d = pts(desc(n));
    if (!d.length) return null;
    const m = (f) => Math.round(d.reduce((t, x) => t + x[f], 0) / d.length * 10000) / 10000;
    return {lat: m('lat'), lng: m('lng')};
  };
  PLACES = {map, tick, centre};
  return PLACES;
}
/* One work location record for a stated place name: { locId, name, lat, lng }, or { name } when the name is not in the list. */
export function resolveArea(name) {
  const P = places(), n = P.map[String(name || '').trim().toLowerCase()];
  if (!n) return {name};
  const c = P.centre(n);
  return {locId: n.id, name: n.id === 'country:GB' ? 'United Kingdom' : P.tick(n), lat: c ? c.lat : null, lng: c ? c.lng : null};
}

/* ---- the rules a schema cannot hold ---------------------------------------------------------------------------- */
const CURRENCY = /[£$€]\s*\d|\d\s*(?:gbp|usd|eur|euros?|pounds?|quid)\b|\b(?:gbp|usd|eur)\s*\d|\b(?:from|only|just)\s+[£$€]/i;
const EMAIL = /[a-z0-9._%+-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}/i;
const PHONE = /(?:\+44\s?|\b0)\d[\d\s()-]{8,13}\d/;
const AGENT_CONTACT_KINDS = ['Website', 'Instagram', 'Facebook', 'LinkedIn', 'TikTok'];

/* Every item on a page that can carry a source, with the text it holds. */
export function itemsOf(p) {
  const items = [];
  const add = (path, label, kind, obj, texts, extra = {}) => items.push({path, label, kind, obj, source: obj && obj.source, texts: texts.filter((t) => typeof t === 'string' && t), ...extra});
  add('description', 'About text', 'about', {source: p.aboutSource, description: p.description}, [p.description], {source: p.aboutSource});
  (p.media || []).forEach((m, i) => add(`media[${i}]`, `photo ${m.id}`, 'photo', m, [m.alt]));
  (p.info || []).forEach((s, i) => add(`info[${i}]`, `section "${s.title}" (id ${s.id})`, 'section', s, [s.title, s.lead, s.text, s.quote, ...(s.chips || [])]));
  for (const [key, list] of Object.entries(p.records || {})) {
    (list || []).forEach((c, i) => {
      add(`records.${key}[${i}]`, `card "${c.name}" (id ${c.id})`, 'card', c, key === 'contact' ? [] : [c.name, c.description], {cat: key});
      (c.media || []).forEach((m, j) => add(`records.${key}[${i}].media[${j}]`, `photo ${m.id} on card "${c.name}"`, 'photo', m, [m.alt], {cat: key, onCard: true}));
    });
  }
  (p.qa || []).forEach((q, i) => add(`qa[${i}]`, `question "${q.text}"`, 'qa', q, [q.text, q.note]));
  return items;
}

export function checkProfiles(loaded, opts = {}) {
  const errors = [], warnings = [];
  const schema = JSON.parse(fs.readFileSync(SCHEMA_FILE, 'utf8'));
  const seenSlug = new Map(), seenTag = new Map();
  for (const f of loaded) {
    const where = opts.relFile ? opts.relFile(f) : rel(f.file);
    const E = (m) => errors.push(`ERROR ${where}: ${m}`), W = (m) => warnings.push(`WARN  ${where}: ${m}`);
    if (f.error) { E(f.error); continue; }
    const p = f.data;
    const se = schemaErrors(schema, p);
    se.forEach(E);
    if (!p || typeof p !== 'object' || se.some((m) => /^(\(file\)|formatVersion|slug|meta)\b/.test(m) && /should be|is missing/.test(m))) continue;
    if (p.slug) {
      if (f.name !== p.slug + '.json') E(`file name should be ${p.slug}.json`);
      if (seenSlug.has(p.slug)) E(`slug "${p.slug}" is already used by ${seenSlug.get(p.slug)}`); else seenSlug.set(p.slug, f.name);
    }
    const m = p.meta || {};
    if (m.tag) { if (seenTag.has(m.tag)) E(`tag "${m.tag}" is already used by ${seenTag.get(m.tag)}`); else seenTag.set(m.tag, f.name); }
    if (m.category === 'svc' && !m.sub) W('category svc has no sub (ice, glassware or events)');
    if (m.category !== 'svc' && m.sub) E('sub is only for category svc');
    /* ids are unique inside each list; cards of a section need the section */
    const dupIds = (list, label) => { const s = new Set(); (list || []).forEach((x) => { if (x && x.id) { if (s.has(x.id)) E(`${label}: id "${x.id}" is used twice`); s.add(x.id); } }); };
    dupIds(p.media, 'media'); dupIds(p.info, 'info'); dupIds(p.qa, 'qa');
    const secIds = new Set((p.info || []).map((s) => s.id));
    for (const [key, list] of Object.entries(p.records || {})) {
      dupIds(list, `records.${key}`);
      if (key.startsWith('info_') && !secIds.has(key.slice(5))) E(`records.${key}: cards for a section that does not exist (no info entry with id "${key.slice(5)}")`);
      (list || []).forEach((c, i) => {
        const n = (c.media || []).length;
        if (n > 5) E(`records.${key}[${i}] "${c.name}" (id ${c.id}): ${n} photos on one card (limit 5)`);
        if (!String(c.name || '').trim()) E(`records.${key}[${i}] (id ${c.id}): card has no title`);
        if (Array.isArray(c.document)) E(`records.${key}[${i}] "${c.name}": more than one PDF (limit 1)`);
      });
    }
    (p.info || []).forEach((s, i) => { if (!String(s.title || '').trim()) E(`info[${i}] (id ${s.id}): section has no title`); });
    /* G2: rules for what the agent wrote */
    const items = itemsOf(p);
    for (const it of items) {
      const s = it.source, by = s && s.by;
      if (it.obj && it.obj.proposed && by !== 'agent') E(`${it.path} ${it.label}: proposed is only for cards the agent adds`);
      if (by === 'agent' && !s.url) E(`${it.path} ${it.label}: agent item has no source.url`);
      if (by !== 'agent') continue;
      for (const t of it.texts) {
        if (CURRENCY.test(t)) E(`${it.path} ${it.label}: currency amount in text written by the agent (${JSON.stringify(t.slice(0, 60))})`);
        if (EMAIL.test(t)) E(`${it.path} ${it.label}: email address in text written by the agent`);
        if (PHONE.test(t)) E(`${it.path} ${it.label}: phone number in text written by the agent`);
      }
      if (it.cat === 'contact' && !AGENT_CONTACT_KINDS.includes(it.obj.description)) E(`${it.path} ${it.label}: the agent may only write ${AGENT_CONTACT_KINDS.join(', ')} contacts, not "${it.obj.description}"`);
      if (it.cat === 'contact' && (EMAIL.test(it.obj.name) || PHONE.test(it.obj.name))) E(`${it.path} ${it.label}: contact value looks like an email address or phone number`);
      if (it.cat === 'web_reviews' && (m.permission || {}).text !== 'granted') E(`${it.path} ${it.label}: customer review written by the agent without meta.permission.text "granted"`);
      if (it.onCard && (m.permission || {}).images !== 'granted') E(`${it.path} ${it.label}: photo added by the agent without meta.permission.images "granted"`);
    }
    if (m.status && m.status !== 'directory') {
      if (!m.statusAt) E(`meta.statusAt: missing (needed once status is ${m.status})`);
      else {
        for (const it of items) if (it.source && it.source.by === 'agent' && it.source.at > m.statusAt) E(`${it.path} ${it.label}: written by the agent on ${it.source.at}, after status became ${m.status} on ${m.statusAt}`);
        if (m.source && m.source.retrievedAt > m.statusAt) E(`meta.source.retrievedAt ${m.source.retrievedAt} is after status became ${m.status} on ${m.statusAt}: the agent writes nothing to this file`);
      }
    }
    const hasPhotos = (p.media || []).length || p.logo;
    if (hasPhotos && (m.permission || {}).images && m.permission.images !== 'granted') W(`gallery or logo present while meta.permission.images is "${m.permission.images}"`);
    /* areas that match no place */
    for (const a of p.areas || []) if (!resolveArea(a).locId) W(`area "${a}" does not match a place in the location list; it stays a plain name`);
  }
  return {errors, warnings};
}

/* Compare with an earlier commit: the agent may not change or remove anything a person wrote, nor touch a file once it is claimed. */
export function checkAgainst(loaded, ref, opts = {}) {
  const errors = [];
  for (const f of loaded) {
    if (f.error || !f.data) continue;
    const where = opts.relFile ? opts.relFile(f) : rel(f.file);
    let old = null;
    try { old = JSON.parse(execFileSync('git', ['show', `${ref}:${rel(f.file)}`], {cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore']}).toString()); } catch (e) { continue; }
    if (JSON.stringify(old) === JSON.stringify(f.data)) continue;
    const st = (old.meta || {}).status;
    if (st && st !== 'directory') { errors.push(`ERROR ${where}: changed since ${ref}, but its status was already ${st}; the agent writes nothing to this file`); continue; }
    const now = new Map(itemsOf(f.data).map((i) => [i.path.replace(/\[\d+\]/g, '') + ':' + (i.obj.id || i.path), i]));
    for (const it of itemsOf(old)) {
      if (it.source && it.source.by === 'agent') continue;
      const key = it.path.replace(/\[\d+\]/g, '') + ':' + (it.obj.id || it.path);
      const cur = now.get(key);
      if (!cur) errors.push(`ERROR ${where}: ${it.path} ${it.label} was written by ${(it.source && it.source.by) || 'a person'} and has been removed`);
      else if (JSON.stringify(cur.obj) !== JSON.stringify(it.obj)) errors.push(`ERROR ${where}: ${it.path} ${it.label} was written by ${(it.source && it.source.by) || 'a person'} and has been changed`);
    }
  }
  return errors;
}
