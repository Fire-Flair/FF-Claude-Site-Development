#!/usr/bin/env node
/* scripts/convert-seeds.mjs — one-off conversion of the five seed files into one profile file per company (format 2).
   Usage: node scripts/convert-seeds.mjs [--force]
   Reads data/companies/seed-*.json (unchanged) and writes data/companies/profiles/<slug>.json.
   A file that already exists is left alone unless --force is given, so people's and the agent's later edits are never overwritten.
   Raise the Bar Glasgow: its seed record is out of date, so its page as it shows today (scripts/convert-seeds-rtb.json, with its
   package, cocktail and question texts exactly as they are) is the source; the company supplied those texts, so those cards are "owner".
   Nothing is invented: every value comes from a seed file, that data file or the cocktail list in src/content/packages. */
import fs from 'fs';
import path from 'path';
import {ROOT, PROFILES_DIR} from './company-lib.mjs';

const force = process.argv.includes('--force');
const read = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const SEEDS = ['seed-companies', 'seed-djs', 'seed-photographers', 'seed-caterers', 'seed-barservices'];
const SOCIAL = [['instagram', 'Instagram'], ['facebook', 'Facebook'], ['linkedin', 'LinkedIn'], ['tiktok', 'TikTok']];
const IMAGES = {granted: 'granted', granted_by_owner: 'granted', to_confirm: 'to_confirm', pending: 'none', declined: 'none'};
/* The seeds give two companies the tag EVENT. Tags must be unique, so the later one gets a new code (the tag only shows in network search). */
const TAG_FIX = {eventologists: 'EVNTL'};
const SECTIONS = [['services', 'services', 'Services'], ['eventTypes', 'events', 'Events'], ['scale', 'scale', 'Scale'], ['facts', 'good-to-know', 'Good to know']];

function convert(c, category, position, rtb) {
  const src = {by: 'agent', url: c.source.urls[0], at: c.source.retrievedAt};
  const im = c.images || {};
  const card = (id, name, description, extra = {}) => ({id, name, ...(description ? {description} : {}), source: {...src}, ...extra});
  const contact = [];
  if (c.website) contact.push(card('website', c.website, 'Website'));
  for (const [k, label] of SOCIAL) if ((c.social || {})[k]) contact.push(card(k, c.social[k], label));
  const records = {};
  if (contact.length) records.contact = contact;
  const p = {
    formatVersion: 2, slug: c.slug, name: c.name, kind: c.kind, base: c.base, areas: [...c.areas],
    ...(im.logo ? {logo: im.logo} : {}), ...(im.logoBg ? {logoBg: im.logoBg} : {}), ...(im.logoWide !== undefined ? {logoWide: im.logoWide} : {}),
    description: c.summary, aboutSource: {...src},
    media: (im.photos || []).map((u, i) => ({id: `${c.slug}_${i}`, src: u, alt: c.name, source: {...src}})),
    info: SECTIONS.filter(([k]) => (c[k] || []).length).map(([k, id, title]) => ({id, title, chips: [...c[k]], source: {...src}})),
    records,
  };
  p.meta = {
    status: 'directory', category, ...(c.sub ? {sub: c.sub} : {}), tag: TAG_FIX[c.slug] || c.tag, ...(c.status === 'partner' ? {partner: true} : {}), position,
    ...(c.legalName || c.companyNumber ? {legal: {form: null, legalName: c.legalName || null, companyNumber: c.companyNumber || null}} : {}),
    source: {urls: [...c.source.urls], retrievedAt: c.source.retrievedAt},
    permission: {text: 'own-words', images: IMAGES[im.permission] || 'none'},
    verifiedBy: c.verifiedBy ?? null,
    pins: (c.locations || []).map((l) => ({label: l.label, lat: l.lat, lng: l.lng, approx: !!l.approx})),
  };
  return p;
}

/* Raise the Bar Glasgow: the directory fields as the page shows them, plus the owner's own packages, cocktails and questions. */
function convertRtb(position) {
  const rtb = read('scripts/convert-seeds-rtb.json'), full = read('data/companies/raise-the-bar.json');
  const row = {...rtb.row, status: 'unclaimed', images: {...rtb.row.images, permission: 'granted_by_owner'}};
  const p = convert(row, 'bar', position);
  const owner = {by: 'owner', url: full.source, at: full.retrievedAt};
  const money = (n) => '£' + (n % 1 ? n.toFixed(2) : String(n));
  const blob = 'https://6istx3ephgqw5ngz.public.blob.vercel-storage.com/cocktails/';
  const menu = read('src/content/packages/raise-the-bar-menu.json');
  p.meta.permission = {text: 'granted', images: 'granted'};
  p.meta.source.urls = [...new Set([...p.meta.source.urls, full.source])];
  p.records.packages = rtb.packages.map(([t, price, d], i) => ({id: `package-${i + 1}`, name: t + ' · ' + price, description: d, source: {...owner}}));
  p.records.cocktail_menu = menu.map(([n, i, m, pr, f], k) => ({
    id: `cocktail-${k + 1}`, name: n,
    description: [i && 'Single ' + money(i), m && 'Mini ' + money(m), pr && 'Party ' + money(pr)].filter(Boolean).join(' · '),
    media: [{id: `cocktail-${k + 1}-0`, src: blob + f, alt: n, source: {...owner}}], source: {...owner},
  }));
  p.qa = rtb.faq.map(([text, note], i) => ({id: `qa-rtb-${i}`, group: 'business', text, answer: '', note, source: {...owner}}));
  return p;
}

const out = [];
let pos = 0;
for (const f of SEEDS) {
  const d = read(`data/companies/${f}.json`);
  for (const c of d.companies) {
    const category = d.category || 'bar';
    out.push(c.slug === 'raise-the-bar' ? convertRtb(pos) : convert(c, category, pos));
    pos++;
  }
}
fs.mkdirSync(PROFILES_DIR, {recursive: true});
let written = 0, skipped = 0;
for (const p of out) {
  const file = path.join(PROFILES_DIR, p.slug + '.json');
  if (fs.existsSync(file) && !force) { skipped++; continue; }
  fs.writeFileSync(file, JSON.stringify(p, null, 2) + '\n'); written++;
}
console.log(`profiles: ${out.length} companies, ${written} written, ${skipped} left alone (already exist)`);
