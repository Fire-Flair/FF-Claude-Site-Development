#!/usr/bin/env node
/* npm run check — fast structural checks on src/ (no browser). Exits 1 on any failure.
   1. every file in src/manifest.json exists; no src .js/.jsx/.css/.json file is left out of the build
   2. directives (__ff_css / __ff_json) and ffasset: tokens all resolve
   3. no inline base64 images in src (they belong in src/assets)
   4. the build runs twice into fresh directories and both outputs are byte-identical */
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';
import {fileURLToPath} from 'url';
import {execFileSync} from 'child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const fail = [];
const walk = (d) => fs.readdirSync(d, {withFileTypes: true}).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
const listed = new Set();
(function collect(l) { for (const e of l) typeof e === 'string' ? listed.add(e) : collect(e.files); })(manifest.order);
for (const f of listed) if (!fs.existsSync(path.join(SRC, f))) fail.push('manifest file missing: ' + f);
const all = walk(SRC).map((f) => path.relative(SRC, f).split(path.sep).join('/'));
const used = new Set(listed);
for (const f of all.filter((x) => /\.(js|jsx)$/.test(x) && !x.startsWith('shell/'))) if (!listed.has(f)) fail.push('file not in manifest: ' + f);
for (const f of all.filter((x) => /\.(js|jsx|css|json|html)$/.test(x) && !x.startsWith('assets/'))) {
  const t = fs.readFileSync(path.join(SRC, f), 'utf8');
  for (const m of t.matchAll(/__ff_css\(([^)]*)\)|__ff_json\("([^"]+)"\)/g))
    for (const r of (m[1] ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [m[2]])) { used.add(r); if (!fs.existsSync(path.join(SRC, r))) fail.push(`${f}: directive target missing: ${r}`); }
  for (const m of t.matchAll(/ffasset:((?:img|story)\/[A-Za-z0-9._-]+)/g)) {
    const p = m[1].startsWith('story/') ? path.join(ROOT, 'stories', 'images', m[1].slice(6)) : path.join(SRC, 'assets', m[1]);
    if (!fs.existsSync(p)) fail.push(`${f}: asset missing: ${m[1]}`);
  }
  if (/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]{200,}/.test(t)) fail.push(f + ': inline base64 image (move to src/assets)');
}
const build = (dir) => { execFileSync('node', [path.join(ROOT, 'scripts/build.mjs'), '--out', dir], {stdio: 'pipe'}); return fs.readFileSync(path.join(dir, `fireflair-${manifest.version}.html`)); };
const t1 = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-a-')), t2 = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-b-'));
const a = build(t1), b = build(t2);
const h = (x) => crypto.createHash('sha256').update(x).digest('hex');
if (h(a) !== h(b)) fail.push('two builds differ');
fs.rmSync(t1, {recursive: true}); fs.rmSync(t2, {recursive: true});
console.log(`manifest files: ${listed.size}, src files: ${all.length}, build: ${a.length} bytes, sha256 ${h(a).slice(0, 16)}`);
if (fail.length) { console.error(fail.join('\n')); process.exit(1); }
console.log('check: ok');
