#!/usr/bin/env node
/* FireFlair build: src/ -> ONE single-file HTML (the reviewable prototype).
   Usage: node scripts/build.mjs [--out DIR] [--name FILE]   (default: build/fireflair-<version>.html)
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
const NAME = opt('--name', `fireflair-${manifest.version}.html`);
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const MIME = {webp: 'image/webp', png: 'image/png', jpg: 'image/jpeg', gif: 'image/gif', svg: 'image/svg+xml'};

function assetBytes(rel) {  // 'img/<hash>.webp' lives in src/assets; 'story/<slug>.webp' in stories/images
  const p = rel.startsWith('story/') ? path.join(ROOT, 'stories', 'images', rel.slice(6)) : path.join(SRC, 'assets', rel);
  if (!fs.existsSync(p)) throw new Error('missing asset: ' + rel);
  return fs.readFileSync(p);
}
const dataUri = (rel) => `data:${MIME[rel.split('.').pop()]};base64,${assetBytes(rel).toString('base64')}`;
const resolveAssets = (t) => t.replace(/ffasset:((?:img|story)\/[A-Za-z0-9._-]+\.(?:webp|png|jpg|gif|svg))/g, (m, rel) => dataUri(rel));
const resolveDirectives = (t) =>
  t.replace(/__ff_css\(((?:"[^"]+"(?:,\s*)?)+)\)/g, (m, list) => JSON.stringify([...list.matchAll(/"([^"]+)"/g)].map((x) => read(x[1])).join('')))
   .replace(/__ff_json\("([^"]+)"\)/g, (m, f) => JSON.stringify(JSON.parse(read(f))));

function join(entries) {
  return entries.map((e) => typeof e === 'string' ? read(e)
    : `${e.open}\n${join(e.files)}\n${e.close}`).join('\n');
}
const code = resolveAssets(resolveDirectives(join(manifest.order)));
const js = transformSync(code, {loader: 'jsx', target: 'es2020', legalComments: 'none', logLevel: 'error'}).code;

const shell = read('shell/index.html')
  .replace('<!--FF:IMG-->', () => JSON.stringify(JSON.parse(resolveAssets(read('shell/ff-img.json')))))
  .replace('<!--FF:UKGEO-->', () => read('content/data/uk-geo.json'))
  .replace('<!--FF:APP-->', () => js.replace(/<\/script/gi, '<\\/script'));
const html = resolveAssets(shell);
fs.mkdirSync(OUT, {recursive: true});
fs.writeFileSync(path.join(OUT, NAME), html);
console.log(`built ${path.join(OUT, NAME)}  ${Buffer.byteLength(html)} bytes`);
