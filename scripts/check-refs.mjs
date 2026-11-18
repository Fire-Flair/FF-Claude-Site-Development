#!/usr/bin/env node
/* check-refs: lists names the joined script uses but no longer defines anywhere.
   Usage: node scripts/check-refs.mjs            (exit 1 when an undefined name is found)
          node scripts/check-refs.mjs --all      (also print every free name it found, for tuning)

   How it works (esbuild only, no parser dependency):
   1. Join src/manifest.json the way scripts/build.mjs does (css/json directives become literals).
   2. Wrap the whole script in one function and let esbuild minify identifiers. Every name the script declares
      (top-level functions, consts, the V101 closure's locals) is then renamed; a name esbuild cannot rename is a
      free reference: a browser or CDN global, a window.X the page sets, or a name nothing defines any more.
   3. Scan the output for identifiers in reference position (not after ".", not an object key, not a method name).
   4. Report the free names that are not browser/JS globals (BROWSER below), CDN globals (React, ReactDOM, lucide, L)
      or window.<name> assignments found in the source or the shell.
   A name used only under `typeof name` is reported separately: it does not throw, but it is dead code now.
   Free names are told apart from renamed ones by running the minifier three times with different padding (see PADS).
   The exit code is 1 when a new undefined name is found, 2 when the runs cannot be compared. */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {transformSync} from 'esbuild';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const ALL = process.argv.includes('--all');
const read = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');
const manifest = JSON.parse(read('manifest.json'));

/* Same joining as build.mjs, without inlining images (not needed to find names). */
const resolveDirectives = (t) => t
  .replace(/__ff_changelog_version\(\)/g, '"0"')
  .replace(/__ff_css\(((?:"[^"]+"(?:,\s*)?)+)\)/g, () => '""')
  .replace(/__ff_json\("([^"]+)"\)/g, (m, f) => JSON.stringify(JSON.parse(read(f))));
const files = [];
function join(entries) {
  return entries.map((e) => {
    if (typeof e === 'string') { files.push(e); return read(e); }
    return `${e.open}\n${join(e.files)}\n${e.close}`;
  }).join('\n');
}
const joined = resolveDirectives(join(manifest.order));
const wrapped = `(function(){\n${joined}\n})();`;
/* esbuild picks the new names from the script's character frequencies. Each run adds a different padding string, so every
   renamed local gets different names in each run, while a free name stays the same: a name is free only if it is the
   same at the same place in all runs. */
const PADS = ['QjXkZwVqYxJzKbGhWfPm', 'xZqJyKvWbQmGfHpXjYkV', 'VmPfWhGbKzJxYqVwZkXj'];
const pad = (chars) => chars.split('').map((c, i) => c.repeat((chars.length - i) * 25000)).join('');
const outs = [];
for (const p of PADS) {
  try {
    outs.push(transformSync(wrapped + `\n;${JSON.stringify(pad(p))};`, {loader: 'jsx', target: 'es2020', minifyIdentifiers: true, legalComments: 'none', logLevel: 'silent'}).code);
  } catch (e) {
    console.error('check-refs: esbuild could not parse the joined script:\n' + (e.errors || []).map((x) => `${x.text} (${x.location && x.location.file}:${x.location && x.location.line}: ${x.location && x.location.lineText})`).join('\n'));
    process.exit(1);
  }
}

/* ---- tokenizer for esbuild's printed output ---- */
const KEYWORDS = new Set(('break case catch class const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield await async of null true false undefined NaN Infinity static get set arguments').split(' '));
const REGEX_AFTER = new Set(['(', ',', '=', ':', '[', '!', '&', '|', '?', '{', '}', ';', '+', '-', '*', '%', '<', '>', '~', '^', '=>', 'return', 'typeof', 'case', 'do', 'else', 'in', 'of', 'new', 'delete', 'void', 'throw', 'yield', 'await', '&&', '||', '??']);
const isIdStart = (c) => /[A-Za-z_$À-￿]/.test(c);
const isId = (c) => /[A-Za-z0-9_$À-￿]/.test(c);
function tokenize(s) {
  const toks = [];   // {t: 'id'|'p'|'str'|'num'|'re', v}
  { let i = 0; const tmpl = []; // stack of brace depths at which a template ${ was opened
  let depth = 0;
  const prevSig = () => { const p = toks[toks.length - 1]; return p ? (p.t === 'p' || (p.t === 'id' && KEYWORDS.has(p.v)) ? p.v : '#val') : '('; };
  const readTemplate = () => { // at a char after ` or after the } closing ${ ... }
    while (i < s.length) {
      const c = s[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { i++; toks.push({t: 'str', v: '`'}); return; }
      if (c === '$' && s[i + 1] === '{') { i += 2; tmpl.push(depth); depth++; toks.push({t: 'p', v: '('}); return; }
      i++;
    }
  };
  while (i < s.length) {
    const c = s[i];
    if (c === ' ' || c === '\n' || c === '\t' || c === '\r') { i++; continue; }
    if (c === '/' && s[i + 1] === '/') { while (i < s.length && s[i] !== '\n') i++; continue; }
    if (c === '/' && s[i + 1] === '*') { i = s.indexOf('*/', i + 2) + 2; continue; }
    if (c === '"' || c === "'") { const q = c; i++; while (i < s.length && s[i] !== q) { if (s[i] === '\\') i++; i++; } i++; toks.push({t: 'str', v: q}); continue; }
    if (c === '`') { i++; readTemplate(); continue; }
    if (c === '/' && REGEX_AFTER.has(prevSig())) {
      i++; let cls = false;
      while (i < s.length) { const d = s[i]; if (d === '\\') { i += 2; continue; } if (d === '[') cls = true; else if (d === ']') cls = false; else if (d === '/' && !cls) break; i++; }
      i++; while (i < s.length && isId(s[i])) i++;
      toks.push({t: 're', v: '/'}); continue;
    }
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1]))) { i++; while (i < s.length && (isId(s[i]) || s[i] === '.')) i++; toks.push({t: 'num', v: '0'}); continue; }
    if (c === '#' && isIdStart(s[i + 1] || '')) { i++; while (i < s.length && isId(s[i])) i++; toks.push({t: 'priv', v: '#'}); continue; }
    if (isIdStart(c)) { const st = i; while (i < s.length && isId(s[i])) i++; toks.push({t: 'id', v: s.slice(st, i), at: st}); continue; }
    if (c === '{') { depth++; toks.push({t: 'p', v: '{'}); i++; continue; }
    if (c === '}') {
      depth--; i++;
      if (tmpl.length && tmpl[tmpl.length - 1] === depth) { tmpl.pop(); toks.push({t: 'p', v: ')'}); readTemplate(); continue; }
      toks.push({t: 'p', v: '}'}); continue;
    }
    const three = s.slice(i, i + 3), two = s.slice(i, i + 2);
    if (three === '...' || three === '?.(' || three === '?.[') { toks.push({t: 'p', v: three === '...' ? '...' : '?.'}); i += three === '...' ? 3 : 2; continue; }
    if (['=>', '?.', '&&', '||', '??'].includes(two)) { toks.push({t: 'p', v: two}); i += 2; continue; }
    toks.push({t: 'p', v: c}); i++;
  }
  }
  return toks;
}
const runs = outs.map(tokenize);
const toks = runs[0];
/* Line the other runs up with run 0. The only structural difference esbuild makes is shorthand: when a renamed local
   matches its key it prints { key } (or { key = 1 } in a pattern) instead of { key: local }. same[k] is true when the
   token at k in run 0 has the same text in every run. */
const SHORT_END = new Set([',', '}', '=']);
const isLong = (r, i) => r[i].t === 'id' && r[i + 1] && r[i + 1].v === ':' && r[i + 2] && r[i + 2].t === 'id' && r[i - 1] && (r[i - 1].v === '{' || r[i - 1].v === ',');
const isShort = (r, i) => r[i].t === 'id' && r[i + 1] && SHORT_END.has(r[i + 1].v) && r[i - 1] && (r[i - 1].v === '{' || r[i - 1].v === ',');
const same = toks.map((t) => t.t === 'id');
for (const b of runs.slice(1)) {
  let i = 0, j = 0;
  const a = toks;
  while (i < a.length && j < b.length) {
    if (isLong(a, i) && isShort(b, j)) { same[i] = false; if (a[i + 2].v !== b[j].v) same[i + 2] = false; i += 3; j += 1; continue; }
    if (isShort(a, i) && isLong(b, j)) { if (a[i].v !== b[j + 2].v) same[i] = false; i += 1; j += 3; continue; }
    if (a[i].t === b[j].t && (a[i].t !== 'p' || a[i].v === b[j].v)) { if (a[i].t === 'id' && a[i].v !== b[j].v) same[i] = false; i++; j++; continue; }
    console.error(`check-refs: cannot line up the runs at token ${i}: ${a.slice(i - 5, i + 5).map((x) => x.v).join(' ')}  ##  ${b.slice(j - 5, j + 5).map((x) => x.v).join(' ')}`);
    process.exit(2);
  }
}

/* ---- free names in reference position ---- */
const free = new Map();   // name -> {n, typeofOnly}
for (let k = 0; k < toks.length; k++) {
  const tk = toks[k];
  if (tk.t !== 'id' || KEYWORDS.has(tk.v)) continue;
  if (!same[k]) continue;                                                                       // renamed: declared in the script
  const prev = toks[k - 1] || {}, next = toks[k + 1] || {};
  if (prev.t === 'p' && (prev.v === '.' || prev.v === '?.')) continue;                         // property access
  if (next.t === 'p' && next.v === ':' && prev.t === 'p' && (prev.v === '{' || prev.v === ',')) continue; // object key
  if (prev.t === 'id' && (prev.v === 'get' || prev.v === 'set' || prev.v === 'static' || prev.v === 'async') && next.v === '(') continue;
  if (next.t === 'p' && next.v === '(' && prev.t === 'p' && (prev.v === '{' || prev.v === '}' || prev.v === ',' || prev.v === ';')) {
    /* a method in a class or object literal: name(...) { ... } — find the matching ")" and look for "{" */
    let d = 0, j = k + 1;
    for (; j < toks.length; j++) { if (toks[j].v === '(') d++; else if (toks[j].v === ')') { d--; if (d === 0) break; } }
    if (toks[j + 1] && toks[j + 1].v === '{') continue;
  }
  if (prev.t === 'id' && (prev.v === 'class' || prev.v === 'function')) continue;            // a name esbuild kept (should not happen)
  const isTypeof = prev.t === 'id' && prev.v === 'typeof';
  const e = free.get(tk.v) || {n: 0, typeofOnly: true};
  e.n++; if (!isTypeof) e.typeofOnly = false;
  free.set(tk.v, e);
}

/* ---- what counts as defined outside the script ---- */
const BROWSER = new Set([
  ...Object.getOwnPropertyNames(globalThis),
  'window', 'document', 'navigator', 'location', 'history', 'localStorage', 'sessionStorage', 'screen', 'performance', 'crypto',
  'alert', 'confirm', 'prompt', 'open', 'close', 'print', 'getComputedStyle', 'matchMedia', 'requestAnimationFrame', 'cancelAnimationFrame',
  'requestIdleCallback', 'cancelIdleCallback', 'innerWidth', 'innerHeight', 'outerWidth', 'scrollX', 'scrollY', 'pageYOffset', 'pageXOffset',
  'devicePixelRatio', 'scrollTo', 'scrollBy', 'addEventListener', 'removeEventListener', 'dispatchEvent', 'visualViewport', 'self', 'top', 'parent', 'frames', 'name', 'origin', 'opener', 'speechSynthesis',
  'Image', 'Audio', 'Option', 'FileReader', 'FormData', 'Blob', 'File', 'URL', 'URLSearchParams', 'XMLHttpRequest', 'WebSocket', 'Worker',
  'HTMLElement', 'HTMLCanvasElement', 'HTMLImageElement', 'HTMLInputElement', 'HTMLVideoElement', 'Element', 'Node', 'NodeFilter', 'Event', 'CustomEvent', 'KeyboardEvent', 'MouseEvent',
  'IntersectionObserver', 'ResizeObserver', 'MutationObserver', 'DOMParser', 'XMLSerializer', 'Range', 'Selection', 'getSelection', 'CSS', 'DOMRect',
  'MediaRecorder', 'MediaStream', 'SpeechSynthesisUtterance', 'SpeechRecognition', 'webkitSpeechRecognition', 'AudioContext', 'webkitAudioContext',
  'OffscreenCanvas', 'ImageData', 'ImageBitmap', 'createImageBitmap', 'Path2D', 'ClipboardItem', 'Notification', 'caches', 'indexedDB', 'fetch', 'Headers', 'Request', 'Response', 'AbortController',
  'TextEncoder', 'TextDecoder', 'atob', 'btoa', 'structuredClone', 'queueMicrotask', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', 'Intl',
  'React', 'ReactDOM', 'lucide', 'L', 'claude', 'pdfjsLib', 'mammoth', 'JSZip', 'html2canvas', 'Tesseract',
]);
const windowSets = new Set();
const scan = (t) => { for (const m of t.matchAll(/\b(?:window|globalThis|self)\.([A-Za-z_$][\w$]*)\s*=(?!=)/g)) windowSets.add(m[1]); };
scan(joined); scan(read('shell/index.html'));

/* Undefined before the v1.1 strip (518b5e8): listed, but they do not fail the run. Remove a name once it is fixed.
   BellIcon (Bell, unused), QUARTER_MONTHS (quarterMonths, unused), IMGS (card-studio, typeof-guarded),
   Skeleton / fetchFeatured / useNavigate (HomeFeatured_unused), phoneOk (TagSection in profile-builder.jsx: not destructured). */
const KNOWN = new Set(['BellIcon', 'QUARTER_MONTHS', 'IMGS', 'Skeleton', 'fetchFeatured', 'useNavigate', 'phoneOk']);
const undefinedNames = [], typeofOnly = [], known = [];
for (const [name, e] of [...free.entries()].sort()) {
  if (BROWSER.has(name) || windowSets.has(name)) continue;
  (KNOWN.has(name) ? known : e.typeofOnly ? typeofOnly : undefinedNames).push(name);
}

/* Where each name appears in src (file:line), so the report points at the code to fix. */
const where = (name) => {
  const re = new RegExp(`(^|[^.\\w$])${name.replace(/\$/g, '\\$')}(?![\\w$])`);
  const hits = [];
  for (const f of files) {
    read(f).split('\n').forEach((l, n) => { if (hits.length < 4 && re.test(l)) hits.push(`${f}:${n + 1}`); });
  }
  return hits.join(', ');
};

if (ALL) console.log('free names: ' + [...free.keys()].sort().join(' '));
console.log(`check-refs: ${files.length} files, ${free.size} free names, ${undefinedNames.length} undefined, ${typeofOnly.length} under typeof only, ${known.length} known from before`);
undefinedNames.forEach((n) => console.log(`  UNDEFINED ${n}  (${where(n)})`));
typeofOnly.forEach((n) => console.log(`  typeof-only ${n}  (${where(n)})`));
if (known.length) console.log(`  known from before: ${known.join(' ')}`);
process.exit(undefinedNames.length ? 1 : 0);
