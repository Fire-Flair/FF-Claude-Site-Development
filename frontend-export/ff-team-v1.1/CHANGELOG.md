# FF Team version 1.1. Final — changelog

The front-end export of FF Team, taken from the Phase Two prototype (phase-2-final v17.59, commit 518b5e8).
The prototype keeps its own `CHANGELOG.md` at the repo root; this file is the changelog of the export only.
The newest heading here is the version the page shows (`scripts/build.mjs` reads it).

## v1.1

Artifact: "FF Team version 1.1. Final", slug a139e698-9bc3-47b1-93d6-b2e3c541732e, version 1794999824-240d (claude.ai folder "FF Team — Front-end export").

FF Team only, stripped by deletion from the prototype. FF Directory and company pages stay (read-only).

### Build and tooling

- `npm run build` writes `build/ff-team-v1.1.html` (whitespace-minified, as v17.60). It also writes the same bytes as
  `build/fireflair-v17.4.html` for the shared test helpers and `scripts/check-src.mjs`, which still open that name.
- `npm run publish-build` splits `build/ff-team-v1.1.html` into `build/release/` (index.html, hashed images, video).
- New `scripts/check-refs.mjs`, part of `npm run check` (also `npm run check-refs`): parses the joined source with
  Babel's scope analysis and fails on any name that is used but declared nowhere, and on a top-level const/let/class
  used at load time before its file. `typeof` guards are allowed. Names that were already undefined in unreached code
  at 518b5e8 are listed in `scripts/check-refs-baseline.json`; the check names any entry that is no longer found so
  the list shrinks as code is deleted. `--list` prints every global name the source relies on.
- `@babel/standalone` added as a dev dependency for that check: run `npm install` once.
- The FF Team v1.1 artifact is published by hand; `scripts/sync-published-site.sh` is not used on this line (see
  `CLAUDE.md`).

### What was stripped (branches v11-strip, v11-dead)

- FF Team only. Deleted: the FF VIP site (`TeamRouter` moved to `components/team/team-router.jsx`), FF Admin (only the hidden-content readers in `admin-state.js` remain, so admin-hidden reviews stay hidden), payments and the payment adapter, the FF Party home and special requests. FF Staff and FF Party files that FF Team still needs (notifications and the coin count, own questions, date helpers, company pages, FF Directory, package cards, venue cards, FitWords17) are trimmed in place, each with a "v1.1 (FF Team only): trimmed" header.
- Routes: only `#/ff-team/...` (home, network, bookings, profile, `<tag>`, join, info, stories). Any `#/ff-staff`, `#/ff-party`, `#/fx`, `#/areas` or `#/packages` address opens FF Team.
- Top bar: FF logo and "FF Team" (links home); no site drop-down.
- Store and saved state hold FF Team only (saved keys 60 → 42); `company` stays for the read-only company pages.
- Removed: the four DEV sign-in buttons, the "Prototype sign-in" note, the "FireFlair prototype" footer, DEV tags in the FF Directory, the XP bar, sheet, timeline and points (the coin and its pop-up stay), leaderboards, `TeamProfile`, `ReviewsTab17`, `LaunchBar20`, `TEAM_CP21_CSS`, `P1Bookings`, `ProtoNote`, unused FF Staff tiles and terms. FF AI introduces itself as "FF AI".
- `profile-edit-tabs.jsx` (was `aragorn-preview.jsx`) is the own-profile edit page; only option 1 remains.
- Demo profiles stay (one place, for testing); remove before going live.
- Sizes: source JS 2.46 MB → 1.75 MB (125 → 120 files), CSS 405 KB → 372 KB, published page 4.61 MB → 3.78 MB.
- Checks: `npm run check` (with check-refs) and `npm run build` pass; journey tests (`/home/claude/scripts/v11-tests/journeys.py`) 47/48 at 390/768/1280 with no page errors; the one failure is the Share sheet at 390, where the edit bar and bottom menu cover Download PNG and Copy Link (also failing on the prototype).
