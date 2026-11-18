# FF Team version 1.1. Final — changelog

The front-end export of FF Team, taken from the Phase Two prototype (phase-2-final v17.59, commit 518b5e8).
The prototype keeps its own `CHANGELOG.md` at the repo root; this file is the changelog of the export only.
The newest heading here is the version the page shows (`scripts/build.mjs` reads it).

## v1.28

Merged after Alex's approval (18 Nov 17:29): the title lines (branch `title-bars`, Gimli) and the 1-2-3 pillar drop-downs (branch `pillar-dropdowns`, Gimli and Legolas). Applied onto v1.27 and published by a three-way merge onto the live page so the photo-browsing chat's unpushed work stays.

- Title lines (`styles/titles2.css`, wrappers in `discover-hub.jsx`, `discover-and-support.jsx`, `team/bookings.jsx`, one selector in `bkd.css`): wherever a title has text under it, one gold-to-champagne line starts at the top of the title, runs beside the title and its text, and fades out at the text's last line. Titles with no text under them keep the line beside the title only. Network: "Our professionals" and "FF Event Directory" line up with "Explore our network" (they were 19px too far left). Bookings: the text under "FFParty – Our bar packages", "FFStaff – Shifts with businesses" and "Grow with FireFlair" moves 19px right to line up with its title.
- Bookings box on phones, open: the "Review Card" label stays ivory (the gold moves to the bottom corner of the taller box); it is burgundy only while the box is closed.
- Pillar drop-downs (`team-pillars.jsx`, `discover-hub.jsx`, `team-pillars21.css`): inside an open FF Team pillar, the 1-2-3 steps are collapsible boxes (picture, gold number, title, burgundy chevron), collapsed by default; each opens to its full section. Picture wells use the deeper champagne from v1.25.
- Checked: `npm run check`, `npm run build`; screenshots at 390, 820 and 1180 of the bookings box open and closed, an open pillar with a step open, and the Network titles. Merged page saved as `live-v1.28-index.html`. Artifact version 1795023137-ff60.

## v1.27

Profile builder, "Let's get started" (Alex, 18 Nov 17:06). Published by a three-way merge onto the live page
(live 1795022225-c9ef), so the photo-browsing chat's unpushed work and the homepage v1.25/v1.26 all stay.

- Talk or type to GPT now works exactly like the CV upload: the same FF AI extraction (`CV_ADAPTER.ffaiExtract`, with
  the typed text as a one-page document via `CV_READER.fromText`), the same simulated progress bar (0% to 92% over
  40 s, then 100%), and the same approval list with Yes / No / Edit per item and one "Add to my profile" button.
  Before, Talk or type added everything straight onto the profile with no review. Shared code in
  `src/components/team/profile-builder.jsx`: `useFfaiRun17` (runner and progress), `FfaiBar17` (bar), `FfaiError17`,
  `FfaiReview17` (approval list); `CVUpload17` and `StartBox17` both use them. Records from Talk or type carry
  source `{ origin: "FireFlair", location: "Talk or type" }`; from a CV `{ origin: "CV", location: <file name> }`.
- Phone number box, everywhere it appears (Let's get started, the WhatsApp code step, a signed-in member's number):
  flat WhatsApp green #25D366, no white inner border line, no shine; text in dark ink #0B1F12 on the green for
  readability; the WhatsApp mark stays white. "Phone number" always sits on its own line above the entry. The white
  number box is a fixed size (up to 220px, the code box up to 180px) and no longer stretches on desktop; on a phone
  the country code, number and Verify stay on one line. Styles at the end of `src/styles/prof21.css` (v1.27 block).
- Let's get started has a maximum width of 640px on wide screens, centred, so its boxes no longer stretch across the
  page (`.ff-start17`).
- Checked: `npm run check`, `npm run build`, phone (390) and desktop (1440) screenshots, and a Talk or type run with a
  stand-in extraction (progress bar, review list, Edit, Add to my profile; the edited item lands on the profile).
  The merged page is saved as `live-v1.27-index.html`. Artifact version 1795022470-524d.
## v1.26

FF Team home, phones only (Alex, 18 Nov 17:12, from his sketch). `styles/home-text.css`.

- Pillar boxes: the champagne-to-burgundy edge now runs diagonally (burgundy wider at the top right, narrowing to the bottom right), as drawn; the chevron is a solid burgundy button with a champagne outline, so it reads on either side of the edge.
- "Built for getting you bookings": the same diagonal, larger, in gold, coming in from the bottom right (burgundy into gold #C9A227 into gold leaf #EDD58F). The last label ("Review Card") sits on the gold, so it is burgundy. The champagne top-right glow from v1.25 is gone.
- Colour check at 360, 390 and 430 px: every pillar word stays on champagne and every bookings label on its own colour (ivory on burgundy, burgundy on gold).
- Published as a string patch onto the live page (1795022040-46b2, published by another chat after v1.25 without pushing), so its work stays; the merged page is saved as `live-v1.26-index.html`. Artifact version 1795022225-c9ef.

## v1.25

FF Team home page `#/ff-team` (Alex's homepage thread, 18 Nov 16:26–16:59). New file `styles/home-text.css`, loaded after `home-colours.css`; two tokens in `tokens.css` (`--color-champagne-box`, `--color-champagne-deep`).

- Titles (`discover-hub.jsx`): "Built for event and hospitality professionals" (was "FF Team is for…"), with a two-to-three line intro in place of "Find out how it works"; the bookings box title is "Built for getting you bookings".
- New intro lines (`discover-and-support.jsx`, class `.ff-sec-intro`): under "FF Team Launch Challenge" (what the challenge is, in plain words) and a new "FF Party Launch Event" title with a few lines above the door video (what happens when the 90 days end). Copy by the writer agent; "UK‑wide" uses a non-breaking hyphen.
- Pillar boxes are champagne (#EAE0C3) when closed as well as open. On iPad and desktop the photo stops above the words and only fades over its last part, so the fade no longer covers the photos.
- Open pillar: no dark inset bar at the top of the box; "Build, share, grow" and the section titles inside the pillars are smaller and sit higher.
- 1-2-3 picture wells: deeper champagne (#DCCB9F) instead of rosé (also covers the coming drop-down steps, `.ff-st21 .ph`).
- Phones (under 760px): pillar boxes run champagne into burgundy (burgundy behind the chevron; chevrons switched to champagne on burgundy); the open tile fades back to champagne at its bottom edge so it joins its box. The bookings box runs the other way: burgundy with champagne glowing in from the top-right corner behind the chevron. Colour check (360/390/430 px): all pillar and bookings text sits on its own colour field (champagne behind the pillar words, burgundy behind every bookings label and the title).
- Published by a three-way merge onto the live page (live 1795020546-7c3f, published by the photo-browsing chat without pushing its code), so the live photo-browser work stays. Its source is not in `src/` yet: that chat still has to push it. The merged page is saved as `frontend-export/ff-team-v1.1/live-v1.25-index.html` for reference.
- Artifact version 1795021775-72c9.

## v1.24

- Home pillars (Alex, 18 Nov 16:04): when a pillar is open, its tile is the same cream as the box below it (#EAE0C3; on wide screens the photo fades into it), so the tile and its content read as one continuous box. Closed tiles stay ivory to sand with the burgundy border. `styles/home-colours.css`.
- The 1-2-3 cards inside the pillars (Alex, 18 Nov 16:07): their pictures are screenshots on cream, which matched the cream box. The picture well is now a soft rosé (#E8CCD0) and the picture is multiplied onto it, so the cream turns rosé and dark parts stay dark.
- Title line, site-wide (Alex, 18 Nov 16:05): no dark gold. Gold (#C9A227) fades into champagne (#DCC48C) and then fades away, beside every section title, profile label and page title. On the Network page the line only runs beside the title and the first two lines of the description (`styles/titles2.css`).
- Journey tests 48/48. Artifact version 1795018765-be2d.

## v1.23

- Home (Alex, 18 Nov 15:56). The four "What is FF Team?" pillars go back to v1.20's ivory to sand (#FFFCF4 to #F3EAD5) with a burgundy #5C1220 border and burgundy titles; the burgundy version looked heavy on wide screens.
- The "FF Team is built for getting you bookings" box is burgundy (#6E1A2C to #5C1220 to #4A0E1A) instead of plum, with the champagne title, arrows and chevron and no line before the title.
- FFStories: the category buttons (All, How it works, Planning and booking…) are centred under the FFStories title (`styles/home-fix22.css`).
- The natural hero photo from v1.22 is unchanged. Journey tests 48/48. Artifact version 1795017727-c908.

## v1.22

FF Team home page `#/ff-team` only (Alex, 18 Nov 15:29), with the homepage chat's `home-update` branch merged in.

- From `home-update` (Alex, 18 Nov 14:18): a drop-down chevron in the top right of the bookings box (it turns when open;
  the box stays collapsed by default with the four-symbol flow as its summary); a spinning FF coin (`CoinDivider`)
  between FFStories and the door video and another below the video, and no coin under "Can FF Team help you?";
  "Can FF Team help you?" is three questions with three answers each, every answer leading inside FF Team
  (`growth-and-terms.jsx`).
- Title (`discover-hub.jsx`): "FF Team is for event and hospitality professionals", same gold-mark title, with a small
  Inter subheading under it: "Find out how it works" (`.ff-dx-tag`, `titles2.css`).
- Hero, no lighting: the champagne beams (`.ff-hero18::after`) are gone, and the photo itself is the natural photo
  again. The old hero image had violet lamps, a golden spotlight, a light cone and a vignette baked in (`grade.py`);
  it is replaced by the same crop with only an even colour balance (`scripts/hero-easel/natural.py`; `hero` /
  `hero_sm` in `src/shell/ff-img.json`, 1800×850 and 900×425 WebP). Card geometry is unchanged, so the Profile Card,
  its shine, the easel position and the crops (easel above the title on phones) are as before. On wide screens a
  soft dark fade (`rgba(24,6,11,.78)` to clear at 52% of the width) sits behind the words only. Contrast of the
  title `#F7EED8` / line `#E4C36A` against the pixels behind them (2nd percentile): 390 wide 11.55 / 9.40;
  1280 wide 12.21 / 8.19 (worst single pixel 9.32 / 5.97).
- "What is FF Team?" pillars (`home-colours.css`): burgundy tiles (`#6E1A2C` → `#5C1220` → `#4A0E1A`) with champagne
  `#EADBB4` borders, ivory `#FFFCF4` titles, champagne descriptions and chevrons (open chevron: burgundy on
  champagne). The open box is burgundy `#5C1220` fading to `#4A0E1A` at the foot, with one champagne outline shared
  with its tile; its heading is ivory, its text champagne; the cards inside stay ivory with champagne edges.
  Contrast: ivory on burgundy 11.1–15.0, champagne on burgundy 8.3–11.2.
- "FF Team is built for getting you bookings" box: plum (`#5E2759` → `#4E1E4A` → `#301230`) with a champagne edge;
  no line before the title; title, arrows and chevron champagne, labels ivory. The 1-2-3-4 icons are unchanged.
  Contrast: champagne on plum 8.0–12.2, ivory on plum 10.7–16.3. New tokens in `tokens.css`: `--color-ox-hi`,
  `--color-ox-deep`, `--color-plum`, `--color-plum-hi`, `--color-plum-dk`.
- Coins around the door video: both coins are the same distance from the video and from the sections either side
  (the one above comes up 14px, the room FFStories keeps under its cards, `titles2.css`).
- Checks: `npm run check` and `npm run build` pass; journeys 48/48; screenshots at 390 and 1280 (all four pillars
  opened, the bookings box opened) with no page errors and no sideways overflow.
- Artifact version 1795017020-b47e.

## v1.21

- (v1.20 of this thread was briefly published over the home-colour v1.20; v1.21 carries both.)
- CV upload progress bar (Alex, 18 Nov 15:06): the bar now starts at 0% the moment a file is chosen and runs
  steadily to 92% over 40 seconds, then holds at 92% if the extraction is still running, and jumps to 100% as soon
  as the extraction comes back. It is a simulated (time-based) bar: OpenAI gives no real progress during the
  extraction, so there is nothing to report from the backend. Developers: start a 40 s timer on upload
  (`CV_SIM_MS = 40000`, `CV_SIM_MAX = 92` in `src/components/team/profile-builder.jsx`), set 100% when the
  backend confirms the extraction is complete. The old phase-based and streamed-characters progress is removed.
- CV approval list (Alex, 18 Nov 15:07): every item is now Yes / No / Edit. Edit opens the value in place (a text
  box, or a larger box for About me and long items); an edited item is ticked Yes and is added to the profile as
  edited. Name, About me, every section item and Question answers can be edited. Applied through
  `cvWithEdits17()` before `ffaiApplyLocal17()`; styles `.ff-cvok17 .yn` (three buttons) and `.ff-cvok17 .ed`
  in `src/styles/v11.css`.
- Artifact version 1795014646-7617.

## v1.20

- FF Team home colours: ivory and burgundy (Alex, 18 Nov 14:53, from option 1 "Ivory and wine"). Every colour on the
  front screen now comes from one set: ivory, burgundy, gold, champagne. Switch `FF_HOME_COLOUR = 4` in
  `src/components/home/team-home.jsx` (root class `ff-home-c4`; 0 gives the v1.18 look). Styles in
  `src/styles/home-colours.css`; the unused options 1–3 were removed from it.
- "What is FF Team?" pillars: ivory tiles `#FFFCF4` to sand `#F3EAD5` with a burgundy `#5C1220` border; titles in
  burgundy (Cinzel), descriptions `#4A443A`, burgundy chevron on burgundy tint `#F7E9EC` (ivory on burgundy when
  open). Open: the tile and its box share one burgundy outline (border, top line and curved joins); the box keeps its
  cream `#EAE0C3` content. On wide screens the photo fades into the sand.
- "FF Team is built for getting you bookings": gold leaf `#F7EAC2` to `#EDD58F` to `#E2C677`, gold-mid `#B08D2A`
  border, burgundy title and title marker, ink labels `#1A1712`, burgundy arrows.
- Hero: the violet beams are now champagne spotlights, `rgba(255,244,214,.85)` peak and champagne `#EADBB4` at .5.
  Same shape, position, blur and fade as before (bottom-left and bottom-right corners, rising and spreading
  slightly). Burgundy centre, photo, card shine and easel are unchanged.
- Hero line "Get seen, get booked, get paid." under the title in gold `#E4C36A` (option 1's place); it wraps only
  between "Get seen, get booked," and "get paid.".
- Tokens: `--color-ivory`, `--color-champagne`, `--color-gold-leaf` kept; the unused `--color-wine`,
  `--color-bottle`, `--color-bottle-dk` removed.
- Contrast (measured behind the text on the rendered page, 390): title `#F7EED8` 7.2:1 at the lightest pixel; hero
  line 5.7:1 at the lightest pixel, 9.7:1 median. Pillar title 13.1:1, description 8.0:1, chevron 11.4:1 on tint;
  bookings title 8.1:1 and labels 10.7:1 on the darkest gold leaf. At 1280 the words sit over the photo as before;
  the lowest points there are photo highlights (unchanged from v1.18), medians 14:1 and 10:1.
- Artifact version 1795014425-b296.

## v1.19

- Gold title lines (Alex, 18 Nov 14:49): the vertical gold line beside every section title and profile label now has
  fully squared ends (no rounded top or bottom), on every page and width (`src/styles/titles2.css`).
- Network page: "Explore our network" drops its gold underline for a longer vertical gold line that runs down beside the
  title and its description and fades out at the bottom. The description now sits directly under the title text, right
  of the line, and the title sits a little lower on the page. "Our professionals" and "FF Event Directory" use the same
  fading line with their descriptions. New `LinedHead20` in `src/components/staff/network-directory.jsx`, styles
  `.ff-tl20` in `titles2.css`. "Your bookings" and "Your profile" keep their underline. No wording changes.
- Artifact version 1795014110-5553.

## v1.18

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
- Journey tests 48/48. Artifact version 1795013639-e2d9.

## v1.17

- Titles (Alex, 18 Nov 14:07: one titling system, no gold dots). Every gold dot beside a heading is now the vertical gold gradient line (light to deep gold, squircle ends, as tall as the title; 5px beside section titles, 3px beside the small uppercase labels). Home, Network, Bookings, profile view and builder, person and company pages. Only `styles/titles2.css` changed. The three page titles (Explore our network, Your bookings, Your profile) keep their gold underline for now, pending Alex.
- Network page (Alex, 18 Nov 14:07; text by Sam). Short texts under the headings:
  - Explore our network: "Meet the event and hospitality professionals of FF Team and discover the companies behind great events. Professionals sign up from all over the world, and bookings are focused on the UK."
  - Our professionals: "The event and hospitality professionals of FF Team, from bartenders and mixologists to managers and front of house, each with their own Profile Card."
  - FF Event Directory: "The UK companies that make events happen, from mobile cocktail bars and DJs to caterers and event services. Each one has its own Company Card."
  (`components/staff/network-directory.jsx`, `network-directory20.jsx`.)
- Journey tests 48/48. Artifact version 1795013227-d4ff.

## v1.16

- Font (Alex, 18 Nov 14:04: "Inter everywhere"). All body and UI text is Inter. The Tailwind file `styles/v101.css` had reset `--font-sans` to the device font and `--font-serif` to Georgia; both now start with Inter. Other fixed system-font stacks switched too (attribute boxes, wallet buttons, terms page). Titles stay Cinzel.
- Inter is built into the page (`src/assets/font/inter-latin-wght-normal.woff2`, variable 100–900, SIL OFL licence alongside), so it loads even where Google Fonts is blocked. `scripts/build.mjs` inlines `ffasset:font/*.woff2`; Google Fonts now loads Cinzel only. Release page +65 KB, no extra files.
- The Profile Card PNG waits for Inter before it is drawn.
- Share message: "Help me win the FF Team Launch Challenge." now has its own line:
  "Check out my profile page and join my team. / Help me win the FF Team Launch Challenge. / Get seen, get booked, get paid. / FFTeam.uk/<tag>"
- Audit at 390 and 1280: text not in Inter or Cinzel went from 968 elements to 0 (apart from the testing-only DEV buttons). Artifact version 1795012571-37ae.

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
