# Developing the FireFlair prototype (v17.4 layout)

`src/` is the source of truth. The single-file HTML (`fireflair-v17.4.html`) is a **build output** you open in a
browser to review and edit pages. It is not committed (`build/` is gitignored); earlier `fireflair-v*.html` files stay
as history. The UI is unchanged from v17.3.138.

## Commands

```
npm install            # esbuild only (no framework, no install scripts needed)
npm run build          # src/ -> build/fireflair-v17.4.html (one file, deterministic)
npm run check          # manifest, directives, assets, no inline images in src, two builds byte-identical
npm run stories        # stories/*/*.md -> src/content/stories/*.json
npm run locations      # data/front-doors/ inputs -> src/content/data/fd-rows.json + fd-aliases.json (validated)
npm run publish-build  # build/fireflair-v17.4.html -> build/release/ (index.html + hashed images + manifest.json)
```

## Layout

```
src/
  manifest.json      ordered list of files; the build joins them into ONE classic script (shared global scope)
  App.jsx            the FireFlair root component
  main.js            mounts the app
  adapters/          one file per adapter: AUTH, PROFILE, CV, NETWORK, PAYMENT, WALLET, SPEECH, ANALYTICS, ADMIN, CONTENT
  components/
    shared/ team/ staff/ party/ vip/ admin/ home/   screens and parts, grouped by site (home/ = the v1.01 home pages)
  state/             reducer, store, seed data, persistence, admin state
  content/           JSON read through CONTENT_ADAPTER: companies/ packages/ homepage/ stories/ data/
  styles/            real .css files; tokens.css holds the design tokens (:root variables)
  utils/             icons, language, CV reading, SEO, analytics
  assets/img/        every image, named by a hash of its bytes
  shell/             index.html (head, CDN tags, boot screen) and ff-img.json
scripts/             build.mjs, check-src.mjs, split-images.py, build-stories.py, sync-published-site.sh
```

Files are plain JSX in the original global-scope style (not ES modules), so a function in one file can use a
constant from another. **Order matters for `const` values** (a file may only use top-level constants from files
earlier in `manifest.json`; functions are hoisted). Add a file by adding it to the manifest; `npm run check`
fails if a file is left out.

## How the single HTML is produced (`scripts/build.mjs`)

1. Join the manifest files in order (the `home/` group sits inside the `V101` closure, as in v17.3.138).
2. `__ff_css("styles/x.css")` and `__ff_json("content/x.json")` become string/JSON literals.
3. `ffasset:img/<hash>.webp` tokens become base64 data URIs (stories images come from `stories/images/`).
4. esbuild transforms JSX to JavaScript (target es2020, no minify, no bundling).
5. The result is inlined into `src/shell/index.html`.

## Artifact publish build

`npm run publish-build` runs `scripts/split-images.py`: images become files named by the hash of their bytes
(`i/<sha256-16>.webp`, identical images stored once), `manifest.json` lists path, type, size and hash, and an audit is
printed (references, unique files, duplicates, small inline images left on purpose, remote image URLs that are not
packaged, bytes before and after). The run fails on malformed base64 or an unexpected image type, rebuilds the output
directory from scratch, and exits 1 if `index.html` is over 5 MiB (5,242,880 bytes). Upload `index.html` plus `i/`.

## Addresses

Every page has an address on all three sites (hash form in the prototype, real path in production). `src/utils/routes17.js` is the router; `docs/URLS.md` is the full map, reserved words, redirect rules and the test list.

## Contracts for the real services

* **ADMIN_ADAPTER** (`src/adapters/admin-adapter.js`): one method per Admin API route with its inputs and outputs.
  Every method resolves `{ ok, ... }`; in the prototype they all resolve `{ ok: false, reason: "not-connected" }` and
  FF Admin reads this preview's own store. Admins never delete; every write is logged.
* **CONTENT_ADAPTER** (`src/adapters/content-adapter.js`): read-only JSON for company profiles, supplier directory,
  homepage "discover" copy, package cards and Stories. The prototype reads `src/content/**`; the Content API returns the
  same JSON. Stories: edit `stories/<site>/<slug>.md`, run `npm run stories`, commit the JSON it writes.
* Other adapters keep their names and behaviour; each file starts with a contract summary (methods and inputs).

## Stage 2 (not done here)

De-duplicate shared components across the sites, remove more dead code (needs proof per symbol), split the JS by
responsibility into real ES modules, and move `home/` (the v1.01 closure) out of its wrapper.
