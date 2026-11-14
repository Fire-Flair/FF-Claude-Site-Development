#!/usr/bin/env node
/* npm run companies (also run by npm run build) — turns the company profile files into the two bundles the prototype reads through
   CONTENT_ADAPTER: src/content/companies/real-companies.json (bar companies) and suppliers.json (every other category).
   Usage: node scripts/build-companies.mjs [--profiles <dir>] [--out <dir>] [--check]
   1. every profile is checked (the same checks as npm run check-companies); any error stops the build
   2. each profile is written as it is, plus areaPlaces: the stated areas resolved to place ids ({ locId, name, lat, lng }, or { name }
      where the name is not in the location list). The page does not show areaPlaces yet; it is what a claimed company's areas start from.
   3. the order is meta.position, then slug; output is deterministic (same files, same bytes).
   --check: writes nothing; exits 1 if the bundles on disk are not what the profile files produce (used by npm run check). */
import fs from 'fs';
import path from 'path';
import {ROOT, PROFILES_DIR, loadProfiles, checkProfiles, listOrder, resolveArea} from './company-lib.mjs';

const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const dir = path.resolve(opt('--profiles', PROFILES_DIR));
const out = path.resolve(opt('--out', path.join(ROOT, 'src/content/companies')));
const loaded = loadProfiles(dir);
const {errors, warnings} = checkProfiles(loaded);
if (errors.length) { errors.forEach((l) => console.error(l)); console.error(`build-companies: ${errors.length} errors in the profile files; nothing written`); process.exit(1); }
const all = loaded.map((f) => ({...f.data, areaPlaces: (f.data.areas || []).map(resolveArea)})).sort(listOrder);
const files = {
  'real-companies.json': all.filter((p) => p.meta.category === 'bar'),
  'suppliers.json': all.filter((p) => p.meta.category !== 'bar'),
};
let stale = 0;
for (const [name, list] of Object.entries(files)) {
  const text = JSON.stringify(list) + '\n', file = path.join(out, name);
  if (argv.includes('--check')) { if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) { console.error(`${path.relative(ROOT, file)} is out of date: run npm run companies`); stale++; } continue; }
  fs.mkdirSync(out, {recursive: true}); fs.writeFileSync(file, text);
}
if (argv.includes('--check')) process.exit(stale ? 1 : 0);
console.log(`build-companies: ${all.length} profiles (${files['real-companies.json'].length} bar, ${files['suppliers.json'].length} other), ${warnings.length} warnings`);
