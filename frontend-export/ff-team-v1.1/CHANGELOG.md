# FF Team version 1.1. Final — changelog

The front-end export of FF Team, taken from the Phase Two prototype (phase-2-final v17.59, commit 518b5e8).
The prototype keeps its own `CHANGELOG.md` at the repo root; this file is the changelog of the export only.
The newest heading here is the version the page shows (`scripts/build.mjs` reads it).

## v1.16

- CV upload now reads the CV and asks before adding anything (Alex, 18 Nov 13:58). Built from the live FF Team flow:
  fireflair-frontend `CVPanel.tsx` / `useFfai.ts` / `FfaiReview.tsx` / `utils/ffaiLocal.ts` and fireflair-backend
  `services/ffai/prompt.js`, `suggestions.js`, `documentReader.js`. Ported in `src/utils/ffai-cv.js`.
- "Let's get started" box order: 1 Phone number, 2 Talk or type to GPT (unchanged), 3 CV upload.
- No "Read my CV" or "Replace" buttons. Choosing a file swaps the Upload CV button for a progress bar while the
  file is read and extracted; then the box extends with the approval list: Name, About, Professions,
  Qualifications, Skills, Interests, Work locations, Languages, Experience, Questions. Each item is Yes / No
  (new items start on Yes; items already on the profile show as on your profile); one "Add to my profile" button
  adds the approved ones. The builder then shows them in its sections (same follow-up as Talk or type).
- Extraction uses the live backend's prompt and strict output schema (full_name, about_me, professions,
  qualifications, skills, interests, work_locations, languages, experience, answers, unreadable) with the
  prototype's own lists (professions, categories, languages, Question Card questions), and the live suggestion
  rules (no phone numbers, emails or street addresses in evidence; region-only work locations; About copied word
  for word; capitalised names title-cased; already-on-profile checks).
- Model call: `CV_ADAPTER.ffaiExtract(doc)` in `src/adapters/cv-adapter.js`, through the artifact's `sample`
  capability (`{ sample: { images: true } }`). The real endpoints are noted there: POST /api/user/ffai/extract
  and POST /api/user/ffai/extractions/:extractionId/apply. Scanned CVs and photos go as page pictures.
- Apply: `ffaiApplyLocal17` (the live on-device apply) maps onto the existing records via RECORDS_MERGE, the
  PROFILE patch (name, about) and ANSWER (Question Card answers). Experience keeps the "Employer — Role" title.
- The CV file is no longer stored on the profile (it used to be kept as a Qualification card); it is read in the
  browser and dropped. Existing CV cards are left as they are.
- Failure state: a message with Try again (when a retry can help) and dismiss; nothing is added.

## v1.15

- Share message (Alex, 18 Nov 13:48–13:51). WhatsApp and Share now send:
  "Check out my profile page and join my team. Help me win the FF Team Launch Challenge.
  Get seen, get booked, get paid.
  FFTeam.uk/<tag>"
  The share sheet title is "Check out my profile page".
- One address everywhere: the share link is the member's profile page, FFTeam.uk/<tag>, the same address printed on the Profile Card. Visitors join from the Join team button on the profile. Old /join/<tag> links still open. (`state/invite17.js` holds the link, title and message; `utils/card-export17.js` puts the link on its own line.)
- Journey tests 48/48. Artifact version 1795010275-f98e.

## v1.14

Fixes from the fellowship review of v1.13 (Aragorn, Legolas, Gimli, Sam, Frodo; reports in the Tolkien AI plans folder).
- Page head: title, canonical address, link-preview address and site data now say FF Team and FFTeam.uk (they still said "FireFlair Phase 2" and the FF Party address, which WhatsApp previews read).
- Profile builder: FireFlair Introductions showed twice after the first Save (a card with a pencil and a second block with its own edit button). The second block is gone; the pencil opens the editor.
- Q&A "Asked by …" labels wrap instead of cutting off with "…".
- The WhatsApp code line in the phone box wraps inside its box instead of running off the screen.
- Share sheet: WhatsApp is the green WhatsApp button; the sheet title has no trailing colon. Join links are shown as FFTeam.uk/join/<tag>.
- "Skip to content" moves focus to the page without changing the address (a reload had sent people to Home).
- Company headings read "… across the UK" instead of "… in UK-wide"; a DJ is "a DJ", not "a dj"; the home pop-up close button reads "Close" (it read "Close your profile").
- Checked: the Profile Card PNG keeps uploaded photos. Only the drawn demo avatar drops out of the PNG.
- Journey tests 48/48. Artifact version 1795009266-00ea.

## v1.13

- Testing only (Alex, 18 Nov 12:59): the log-in sheet has DEV sign-ins again so every FF Team screen can be tested — "DEV · complete profile" (Alexander Gagnon with the demo data, notifications and asks), "DEV · join from invite" (arrives from FFTeam.uk/join/alex424) and "DEV · new member" (empty profile). They are marked in `landing-shell.jsx` and must be removed before go-live. Journey tests 48/48. Artifact version 1795007371-ec41.

## v1.12

Artifact version 1795001443-0407.

Alex's first changes after the split (queued 18 Nov 10:20). Branches merged: `v11-a`, `v11-b`.

- Titles (new `styles/titles2.css`, `css-registry.js`, `App.jsx`): option 2 "Gold mark" — a gold coin beside section titles (Our professionals, FF Event Directory, Can FF Team help you?, FFParty, FFStaff, Grow with FireFlair; small gold dot on profile labels). "Explore our network", "Your bookings" and a new "Your profile" page title share the full underline. "What is FF Team?", "FF Team is built for getting you bookings" (soft gold, in its dark box) and "FF Team Launch Challenge" use the gold mark; the coin between the welcome and "What is FF Team?" is gone. "FFStories" is one word, centred, with FF slightly slanted.
- Home (`team-home.jsx`, `discover-and-support.jsx`, `stories-reader.jsx`, `tm20.css`): no "Life at FF Team" title; the door video is full size again; Join FF Team and the coin game are one box again, last on the page.
- Network (`network-directory20.jsx`, `map.jsx`): FF Event Directory opens only Bar companies and Entertainment; the map pins members at the centre of the first place on their profile it knows, so the legend shows Professionals (with group counts) before FF Directory.
- Profile builder (`profile-builder.jsx`, `prof21.css`): Let's get started runs Upload CV, Talk or type, Phone number; the phone box is a muted WhatsApp green (white text 4.8:1 or better).
- Share sheet (`p12.css`): sits above the bottom bar on phones, so Download PNG and Copy Link can be tapped.
- Journey tests: 48/48 at 390/768/1280.

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
