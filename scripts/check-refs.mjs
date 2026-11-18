#!/usr/bin/env node
/* npm run check-refs (also part of npm run check) — undefined-name check for the joined src/ script.
   The build joins the src/manifest.json files into ONE classic script with a shared global scope, so deleting a
   file or a function can leave a name that is still used somewhere else and only fails when that code runs.
   This script parses the joined source (JSX included) with Babel's scope analysis and fails on:
     1. a name that is used but declared nowhere (not in src/, not a browser or JavaScript global, not a CDN global
        from src/shell/index.html, not a build directive). `typeof X` guards are allowed: they are safe by design.
     2. a top-level const / let / class used at the top level of a file that comes BEFORE its declaration in the
        manifest (a temporal-dead-zone error at load; functions are hoisted and are fine).
   Each problem is reported as src/<file>:<line>  <name>. Usage: node scripts/check-refs.mjs [--list] [--write-baseline]
   --list prints every global the source relies on (for reviewing what a strip removed).
   Browser globals: scripts/browser-globals.json (Chromium window properties, regenerate with
   /home/claude/scripts/v11-tests/dump_globals.py if a new browser API is used). */
import fs from 'fs';
import path from 'path';
import {createRequire} from 'module';
import {fileURLToPath} from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const require = createRequire(import.meta.url);
let Babel;
try { Babel = require('@babel/standalone'); }
catch { console.error('check-refs: @babel/standalone is missing — run `npm install` once in this repo.'); process.exit(1); }

const manifest = JSON.parse(fs.readFileSync(path.join(SRC, 'manifest.json'), 'utf8'));
/* Join exactly as scripts/build.mjs does, remembering which lines belong to which file. */
const parts = [];  // {file, startLine, lines}
let text = '', line = 1;
const push = (s, file) => { const n = s.split('\n').length; parts.push({file, start: line, end: line + n - 1}); text += s + '\n'; line += n; };
(function join(entries) {
  for (const e of entries) {
    if (typeof e === 'string') push(fs.readFileSync(path.join(SRC, e), 'utf8'), e);
    else { push(e.open, '(manifest group open)'); join(e.files); push(e.close, '(manifest group close)'); }
  }
})(manifest.order);
const where = (ln) => { const p = parts.find((x) => ln >= x.start && ln <= x.end); return p ? {file: p.file, line: ln - p.start + 1, idx: parts.indexOf(p)} : {file: '?', line: ln, idx: -1}; };

const ALLOWED = new Set([
  ...JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts', 'browser-globals.json'), 'utf8')),
  ...Object.getOwnPropertyNames(globalThis),
  'React', 'ReactDOM', 'lucide', 'L', 'FF_IMG',                   // src/shell/index.html (CDN scripts and FF_IMG)
  '__ff_css', '__ff_json', '__ff_changelog_version',              // build directives, replaced by scripts/build.mjs
  'undefined', 'NaN', 'Infinity', 'arguments',
]);

const missing = [], tdz = [], used = new Map();
/* `typeof X !== "undefined" && X.y` and `typeof X === "function" ? X() : z` are safe: the use only runs when X exists. */
const hasTypeof = (node, name) => { let hit = false; Babel.packages.types.traverseFast(node, (n) => { if (n.type === 'UnaryExpression' && n.operator === 'typeof' && n.argument.type === 'Identifier' && n.argument.name === name) hit = true; }); return hit; };
const guarded = (p, name) => {
  for (let c = p; c.parentPath; c = c.parentPath) {
    const q = c.parentPath;
    if (q.isLogicalExpression({operator: '&&'}) && c.key === 'right' && hasTypeof(q.node.left, name)) return true;
    if ((q.isConditionalExpression() || q.isIfStatement()) && c.key === 'consequent' && hasTypeof(q.node.test, name)) return true;
    if (c.isFunction() || c.isStatement() && !q.isIfStatement() && !q.isBlockStatement()) return false;
  }
  return false;
};
const isFnBoundary = (p) => p.isFunction() || p.isClassMethod() || p.isClassProperty() || p.isClassPrivateProperty() || p.isStaticBlock?.();
const plugin = () => ({
  visitor: {
    Program(prog) {
      const top = prog.scope;
      prog.traverse({
        ReferencedIdentifier(p) {
          const name = p.node.name;
          if (p.isJSXIdentifier() && /^[a-z]/.test(name)) return;          // <div>, <span>: HTML tags, not names
          const binding = p.scope.getBinding(name);
          if (!binding) {
            if (p.parentPath.isUnaryExpression({operator: 'typeof'}) || guarded(p, name)) return;
            used.set(name, (used.get(name) || 0) + 1);
            if (!ALLOWED.has(name)) missing.push({name, ...where(p.node.loc.start.line)});
            return;
          }
          /* top-level const/let/class referenced at the top level of an earlier manifest file */
          if (binding.scope !== top || !['const', 'let', 'module'].includes(binding.kind) && !binding.path.isClassDeclaration()) return;
          if (p.findParent(isFnBoundary)) return;
          const use = where(p.node.loc.start.line), decl = where(binding.identifier.loc.start.line);
          if (use.idx >= 0 && decl.idx >= 0 && use.idx < decl.idx) tdz.push({name, ...use, declFile: decl.file});
        },
      });
    },
  },
});

try {
  Babel.transform(text, {ast: false, code: false, babelrc: false, configFile: false, sourceType: 'script',
    parserOpts: {plugins: ['jsx'], errorRecovery: false}, plugins: [plugin]});
} catch (e) {
  const ln = e.loc && e.loc.line; const w = ln ? where(ln) : null;
  console.error(`check-refs: parse error${w ? ` at src/${w.file}:${w.line}` : ''}: ${String(e.message).split('\n')[0]}`);
  process.exit(1);
}

if (process.argv.includes('--list')) {
  for (const [n, c] of [...used].sort()) console.log(`${ALLOWED.has(n) ? 'global ' : 'MISSING'}  ${n}  (${c})`);
}
const uniq = (a) => [...new Map(a.map((x) => [`${x.file}:${x.line}:${x.name}`, x])).values()];
/* scripts/check-refs-baseline.json: undefined names that were already in the code when this check was added
   (all in unreached code). They are listed, not failed; any NEW undefined name fails. Remove an entry when its code
   is deleted or fixed — the check says which entries are no longer found. */
const BASE_FILE = path.join(ROOT, 'scripts', 'check-refs-baseline.json');
const baseline = fs.existsSync(BASE_FILE) ? JSON.parse(fs.readFileSync(BASE_FILE, 'utf8')).known : [];
const key = (x) => `${x.file} ${x.name}`;
const known = new Set(baseline.map(key));
const all = uniq(missing), t = uniq(tdz);
const m = all.filter((x) => !known.has(key(x))), old = all.filter((x) => known.has(key(x)));
const gone = baseline.filter((b) => !all.some((x) => key(x) === key(b)));
for (const x of old) console.log(`known (baseline): src/${x.file}:${x.line}  ${x.name}`);
for (const b of gone) console.log(`baseline entry no longer found, remove it from scripts/check-refs-baseline.json: ${b.file} ${b.name}`);
if (process.argv.includes('--write-baseline')) {
  fs.writeFileSync(BASE_FILE, JSON.stringify({note: 'Undefined names already in src/ when check-refs was added (unreached code). See scripts/check-refs.mjs.', known: [...new Map(all.map((x) => [key(x), {file: x.file, name: x.name}])).values()]}, null, 1) + '\n');
  console.log('baseline written: ' + BASE_FILE);
}
for (const x of m) console.error(`undefined name: src/${x.file}:${x.line}  ${x.name}`);
for (const x of t) console.error(`used before its file loads: src/${x.file}:${x.line}  ${x.name} (declared in src/${x.declFile})`);
console.log(`check-refs: ${parts.filter((p) => !p.file.startsWith('(')).length} files, ${line - 1} lines, ${used.size} global names used, ${m.length} new undefined (${old.length} known), ${t.length} used too early`);
if (m.length || t.length) process.exit(1);
console.log('check-refs: ok');
