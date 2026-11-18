#!/usr/bin/env node
/* FireFlair build: src/ -> ONE single-file HTML (the reviewable prototype).
   Usage: node scripts/build.mjs [--out DIR] [--name FILE]   (default: build/ff-team-v1.1.html)
   FF Team v1.1 line: the page is build/ff-team-v1.1.html. Without --name the same bytes are also written as
   build/fireflair-<manifest version>.html (legacy name), because scripts/check-src.mjs and the shared Playwright
   helpers (ffpage.py, devcheck.py, loadcheck.py) still open that name; drop the copy once they read the new one.
   Steps: join the files listed in src/manifest.json (order matters: one classic script with shared global
   scope) -> inline css/json directives -> put image assets back as data URIs -> esbuild transform (JSX, no
   bundling, no minify) -> inline into src/shell/index.html. Output is deterministic (same input, same bytes). */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {transformSync} from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const argv = process.argv.slice(2);
const opt = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const OUT = path.resolve(opt('--out', path.join(ROOT, 'build')));
const NAME = opt('--name', 'ff-team-v1.1.html');
const LEGACY = argv.includes('--name') ? null : `fireflair-${manifest.version}.html`;
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const MIME = {webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml', woff2: 'font/woff2'};

function assetBytes(rel) {  // 'img/<hash>.webp' and 'font/<name>.woff2' live in src/assets; 'story/<slug>.webp' in stories/images
  const p = rel.startsWith('story/') ? path.join(ROOT, 'stories', 'images', rel.slice(6)) : path.join(SRC, 'assets', rel);
  if (!fs.existsSync(p)) throw new Error('missing asset: ' + rel);
  return fs.readFileSync(p);
}
const dataUri = (rel) => `data:${MIME[rel.split('.').pop()]};base64,${assetBytes(rel).toString('base64')}`;
const resolveAssets = (t) => t.replace(/ffasset:((?:img|story|font)\/[A-Za-z0-9._-]+\.(?:webp|png|jpg|gif|svg|woff2))/g, (m, rel) => dataUri(rel));
/* The page's version is the newest entry of its changelog ("## v1.1" -> "1.1"): frontend-export/ff-team-v1.1/CHANGELOG.md
   on this line, else the prototype's CHANGELOG.md ("## v17.49" -> "17.49"). PHASE1.version reads it. */
const CL_FILE = [path.join(ROOT, 'frontend-export', 'ff-team-v1.1', 'CHANGELOG.md'), path.join(ROOT, 'CHANGELOG.md')].find((f) => fs.existsSync(f));
const CL_VERSION = ((fs.readFileSync(CL_FILE, 'utf8').match(/^## v(\d+(?:\.\d+)*)\s*$/m) || [])[1]) || manifest.version.replace(/^v/, '');
const resolveDirectives = (t) =>
  t.replace(/__ff_changelog_version\(\)/g, () => JSON.stringify(CL_VERSION)).replace(/__ff_css\(((?:"[^"]+"(?:,\s*)?)+)\)/g, (m, list) => JSON.stringify([...list.matchAll(/"([^"]+)"/g)].map((x) => read(x[1])).join('')))
   .replace(/__ff_json\("([^"]+)"\)/g, (m, f) => JSON.stringify(JSON.parse(read(f))));

function join(entries) {
  return entries.map((e) => typeof e === 'string' ? read(e)
    : `${e.open}\n${join(e.files)}\n${e.close}`).join('\n');
}
const code = resolveAssets(resolveDirectives(join(manifest.order)));
const js = transformSync(code, {loader: 'jsx', target: 'es2020', legalComments: 'none', logLevel: 'error', minifyWhitespace: true}).code;  /* v17.60: whitespace minified to stay under the artifact's 5 MiB page limit; src/ stays readable */

const shell = read('shell/index.html')
  .replace('<!--FF:IMG-->', () => JSON.stringify(JSON.parse(resolveAssets(read('shell/ff-img.json')))))
  .replace('<!--FF:UKGEO-->', () => read('content/data/uk-geo.json'))
  .replace('<!--FF:APP-->', () => js.replace(/<\/script/gi, '<\\/script'));
const html = resolveAssets(shell);
fs.mkdirSync(OUT, {recursive: true});
fs.writeFileSync(path.join(OUT, NAME), html);
if (LEGACY && LEGACY !== NAME) fs.writeFileSync(path.join(OUT, LEGACY), html);
console.log(`built ${path.join(OUT, NAME)}  ${Buffer.byteLength(html)} bytes  (version ${CL_VERSION})${LEGACY ? `  + legacy copy ${LEGACY}` : ''}`);
