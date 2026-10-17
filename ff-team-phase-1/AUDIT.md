# FF Team Phase 1 — code audit and consolidation notes

Version 1.3 (in development) · 16 October 2026 · file `ff-team-phase-1-v1.3.html`

This is the audit the Phase 1 brief asks for: what was inspected, how the two
codebases compare feature by feature, what was reused, restored or changed,
and what is still open. §1–§5 are the v1.0 audit, with the table updated where
v1.1 changed the outcome; §7 lists the v1.1 changes and §8 the v1.2 changes. Version 1.0 was named
"FF Team Phase 1 Final"; from v1.1 the name is "FF Team Phase 1".

## 1. What was inspected

| Source | Where | Version inspected |
| --- | --- | --- |
| Claude prototype | `FireFlair456/FF-Claude-Site-Development`, `fireflair-v16.15.html` | v16.15, 16 Oct 2026 (latest) |
| Griffy's frontend | `Fire-Flair/fireflair-frontend`, branch `dev` (`main` is an empty first commit) | `0bdeeff` "ffai fixed", 16 Oct 2026 |
| Griffy's backend | `Fire-Flair/fireflair-backend`, branch `dev` | `9956e4e`, 15 Oct 2026 |
| Unmerged backend branch | `feature/cv-extraction-openai` | `b369d66`, 9 Oct 2026 |
| Live frontend | `dev.djovt2i6l8m2j.amplifyapp.com` | serves the `dev` branch; its page tags match commit `c20e3a7` ("seo files") |
| Live backend | `fireflair-backend-development.up.railway.app` | its published API list (30 endpoints) matches the repo exactly |

Stack, for reference: the frontend is React 19 + TypeScript + Vite + Tailwind 4;
the backend is Node/Express/MongoDB with S3 for media and OpenAI for FF AI. The
prototype is one HTML page (React 18 + Babel from cdnjs) with every backend call
behind a named adapter.

All 27 calls the frontend makes have a matching backend route, and the field
names sent for card sections and FF AI match what the backend reads.

## 2. Feature by feature

Legend: **Both** = in both codebases · **Griffy** = only in Griffy's delivery ·
**Prototype** = only in the prototype.

| Feature | Prototype v16.15 | Griffy (dev) | FF Team Phase 1 (v1.1) |
| --- | --- | --- | --- |
| Sign-up: FF Tag + phone + WhatsApp code, optional password, log in by code or password | Both. Prototype is a mock (`AUTH_ADAPTER`, any six digits) | Real endpoints: `send-otp`, `verify-otp`, `login`, `password`, `password/change`, `tag-availability`, `tag` | Kept the prototype journey. Each `AUTH_ADAPTER` call maps to one of Griffy's endpoints (table in §4) |
| Profile Card builder (name, photo, professions, skills, interests, locations, languages; colours) | Both | Card saved through the section APIs (fixed 16 Oct), auto-save, card themes, profile image upload to S3 | Kept |
| Profession search as you type | **Missing**: category chips only | **Griffy**: search field against `GET /user/professions?search=`, plus "add your own" | **Restored**: type-ahead across the 35 v1.6 professions, ranked starts-with first, plus "Add “…”" for anything else; FF AI asks for the category when the rules can't tell. v1.1: "Pick your professions" stays; the separate Add profession square is removed, since typing creates the card |
| 7 categories × 5 professions (v1.6) | Both | Both (backend seed) | Kept |
| Qualifications, Skills, Experience, Interests, Media | Both | Both (card template sections) | Kept |
| Venues | Prototype: own section with address and "View on Google Maps" | **Switched off** (`SHOW_VENUES = false` in `ProfileSections.tsx`) and **no `venue` section in the backend card template** (`scripts/seedCards.js`) | Kept, editable, placed straight after Experience. Backend needs a `venue` section (see §6) |
| Work locations | Free text, suggestions from a short list of nearby areas | **Griffy**: Google Places autocomplete limited to regions, with coordinates (`src/api/places.ts`) | Separate section; v1.1 shows the guidance copy only inside Add location (v1.0 had it in the section too); a multi-add sheet with type-ahead over ~90 UK towns and areas, rename and remove, no limit, "5 recommended" meter. Production keeps Griffy's Google Places search (§6) |
| Section order | Professions, Qualifications, Skills, Signature cocktails, Interests, Work locations, Languages, Experience, Media, Venues | Backend template: Profession, Qualification, Skill, Interest, Work Location, Language, Experience, Media | Professions, **Qualifications, Skills**, Experience, **Venues**, Work locations, Languages, Interests, Media, then Network, Reviews, Q&A |
| Languages and flags | 20 languages, flag **emoji** (Windows shows "FR" instead of a flag) | **Griffy**: 52-language master from "Language Flags Specification" v1.1, SVG flags, proficiency list | **Restored**: the same 52 languages and order, real flag images (Wales and Scotland included), a language picker with type-ahead, common aliases (Mandarin, Farsi, BSL…), globe for anything not on the list. Proficiency list already matched |
| CV reading | In the browser: PDF (pdf.js), .docx, photos, text; **.doc refused** | Backend `POST /user/ffai/extract`: PDF, .docx, text, images; **.doc not supported** | All of the prototype's formats plus **.doc (Word 97–2003)**, read in the browser. Verified (§5) |
| CV → profile | FF AI (Claude, through the page's `sample` capability) proposes cards; nothing saves until reviewed | FF AI on OpenAI (`gpt-5-mini`), review and apply (`/ffai/extractions/:id/apply`), guest extraction allowed | Kept the prototype's review-before-save. Outside claude.ai the page says FF AI isn't available and falls back to simple word matching, labelled as such |
| Question Cards (10 launch cards) | Both | Both (`/user/questions`, answer endpoint) | Kept. "+1 XP each" removed |
| Public profile at `ffparty.uk/TAG` | "View as a guest" inside the one page (an artifact has one URL) | **Griffy**: route `/:tag` and `GET /user/card/public/:ffTag` | Kept "view as a guest"; the real URL is Griffy's |
| Publish | "Publish on FF Party" | — | **"Publish on FF Team"** (FF Party is locked) |
| Network: discover and search | FF AI search, people by profession group, rankings, map | Static demo directory, rankings | Kept search and groups ("Discover professionals"). **Rankings removed** (leaderboards are deferred with XP) |
| Network: inviter connected automatically | Every visitor arrives on Don Gee's invite link (`DONGE`) and has him in their network | Not built (invite is a toast) | Kept, and made visible: an "Invited you" panel says the inviter is already in your network and offers "Review" |
| Network: invite people you work with | Contacts sheet; people already on FireFlair were **connected straight away** (contradicting "an invitation is not a connection") | Toast only | Fixed: people already on FireFlair get a pending team invitation; people not on it get a WhatsApp invite. New "Invitations you've sent" list with preview buttons ("Preview: Marcus joins" adds Marcus to your network automatically) |
| Network: add to team with review (worked before, work again, how to work with, written review) | Prototype | — | Kept |
| Reviews | Review sheet, Review Cards section, ask for a review | Ask-for-review sheet (UI only) | Kept. Every review and invitation sheet now says it is kept in this preview only |
| Map | Leaflet + CARTO tiles, falls back to a drawn map | No map; Google is used for place search only | Kept. Home shows Profile Cards and venues; Network shows Profile Cards only. Businesses and events return with FF Staff / FF Party |
| XP | XP bar with points, tiers, levels, quarterly periods, "+10 XP" toasts | None | v1.1: **FF XP Beta 2026 pop-up** behind the FF coin only (next steps, tier and level, how FF XP works), on the prototype's existing XP and tier logic. No XP bar, no XP page, no leaderboards. Activities a viewer completed under v1.0 are credited once on load. (v1.0 had an XP Coming Soon screen with no points) |
| Site selector (top left) | FF Team, FF Staff, FF Party open; FF VIP locked | Not built | v1.1: FF Team open; FF Staff, FF Party (next to launch) and FF VIP locked with a lock icon and "Coming soon", in that order. (v1.0 left FF Staff out) |
| Bookings tab | Full FF Team bookings (shift requests, availability, Service Cards) | Static bookings page | v1.1: "Your bookings" (requests, booked shifts, booking passes) as a Coming Soon panel; "Available now": FF Party Service Cards registration, peak-dates availability, Training, Dream jobs — the v16.15 components. Nothing can send, book or pay. (v1.0 was a Coming Soon page) |
| Home | FF Team, FF Party, Service Cards, Training, Dream jobs, Review Cards, sites, map | Home page with FF AI | Phase 1 home: FF AI, What is FireFlair? (first three steps, then "FireFlair is here to get you bookings."), FF Team, Network, Review Cards, Training, Dream jobs, Coming Soon, sites, map |
| Saving your work | One shared `fireflair/state` document for every viewer (a bug: viewers overwrote each other) | Backend database | Each viewer's own private document (`data/users/<id>/ff-team-phase-1`) |
| SEO | Head tags per view, self-test | `robots.txt`, `sitemap.xml`, per-page tags | Kept; FF Team wording; self-test passes 32/32 |

## 3. What changed during consolidation

Every change is a small, named edit to v16.15, so the rest of the prototype is
unchanged and still in the file for later releases. The Phase 1 boundary lives
in one object near the top of the script, `PHASE1`:

- `sitesShown` / `sitesOpen` — which sites the selector shows and which open.
- `profileOrder` — Phase 1 sections and their order (Signature cocktails held back).
- `xpLive` — v1.0 `false` (activities recorded, no points); v1.1 `true` (FF XP Beta 2026 on the existing logic).
- `xpBar` — v1.1 `false`: no XP bar; the FF coin pop-up is the only way in.
- `bookingsLive: false` — requests and booked shifts are Coming Soon; "Book" on profiles is locked.
- `leaderboards: false` — rankings hidden.
- `desktopAdd` — v1.1 `false`: the desktop Add FF button is hidden.

Flipping a flag brings the existing feature back; nothing was deleted.

New in the page: `XPComingSoon`, `NextStepsSheet`, `Phase1XPBar`,
`BookingsComingSoon`, the Phase 1 Home sections, `WorkLocationsGuide` and
`WorkLocationsSheet`, `LanguagePicker` and `LangFlag` with `LANGUAGE_MASTER`,
`InvitedByBanner`, `SentInvitations`, `NETWORK_ADAPTER`, and the .doc reader
(`cfbStreams`, `docText`, `readDoc`). The reducer gained `SCREEN` (the XP
screen) and `INVITE_JOINED` (preview of an invitee joining), and refuses to
switch into FF Staff / FF Party while they are closed.

In v1.1, `XPComingSoon`, `NextStepsSheet`, `Phase1XPBar`, `BookingsComingSoon`
and the `SCREEN` action are gone, replaced by `XPPopup`, `P1Bookings`,
`SoonCard`, `WalletSoon`, `CardPreviewSoon` and `WhatIsFireFlair` (§7).

## 4. Prototype adapters → Griffy's endpoints

| Prototype call | Griffy endpoint |
| --- | --- |
| `AUTH_ADAPTER.isAvailable` | `GET /api/user/auth/tag-availability` |
| `AUTH_ADAPTER.sendSignupCode` / `sendCode` | `POST /api/user/auth/send-otp` |
| `AUTH_ADAPTER.verifySignupCode` / `verifyCode` | `POST /api/user/auth/verify-otp` |
| `AUTH_ADAPTER.loginWithPassword` | `POST /api/user/auth/login` |
| Password sheet (create / change) | `POST /api/user/auth/password`, `POST /api/user/auth/password/change` |
| FF Tag change (account settings) | `PATCH /api/user/auth/tag` |
| `PROFILE_ADAPTER.save` (card + profile) | `PATCH /api/user/card/profile`, `PATCH /api/user/card/theme`, `POST /api/user/card/profile-image`, `POST|PATCH|DELETE /api/user/card/sections/:sectionId/data[/:dataId]`, `PATCH …/data/order` |
| Professions list / search | `GET /api/user/professions?search=`, `GET /api/user/professions/categories` |
| Languages | `GET /api/user/languages` |
| Question Cards | `GET /api/user/questions`, `PUT /api/user/questions/:questionId/answer` |
| `CV_ADAPTER.extract` | `POST /api/user/ffai/extract`, then `GET /api/user/ffai/extractions/:id` and `POST …/apply` |
| Guest view of a profile | `GET /api/user/card/public/:ffTag` |
| `NETWORK_ADAPTER` (invite, connect, review) | **None yet** (§6) |

## 5. How it was tested

Headless Chromium at phone (390 px) and desktop (1280 px) widths, with local
copies of React and the icons; the map runs its built-in fallback there because
Leaflet's CDN isn't reachable from the test machine. 63 checks, all passing, no
page errors:

- Home sections and that no hire / plan-an-event action is offered; no XP amounts.
- Site selector: exactly FF Team, FF Party, FF VIP; two locked with lock icons; FF Party says "coming soon" and stays put.
- FF coin → "What to do next" → FireFlair XP screen: heading, Coming Soon, intro, retroactive notice, eight planned activities, no points or levels; Back works.
- Bookings is a Coming Soon page with four locked tiles.
- Network as a guest: discover, search narrows the cards, a profile opens, "Book" is locked.
- Profile: section order, no Signature cocktails, sign-up with FF Tag + phone + code.
- Profession type-ahead ("mix" → Mixologist) and a custom profession (Sommelier).
- Work locations: guidance in the section and in the editor; six added, one renamed, one removed; "5 added".
- Languages: Welsh from the picker; flags render as images.
- CV: the same CV as .doc, .docx and PDF. For each, the document's text (including a unique marker) reached FF AI and the review appeared; the reviewed items landed in Qualifications and Venues. FF AI was replaced by a stand-in for this test, so the real model's answers were not exercised.
- .doc reader on its own: a LibreOffice "Word 97–2003" CV with headings, a table and accented text, and a 120-line file with Polish and Chinese text — both read in full.
- Save → Welcome to the Team → "Publish on FF Team" → published.
- XP bar (phone) and XP row (desktop) open the XP screen; completed activities show as done with no points.
- Network signed in: the inviter is already in your network; review the inviter; invite two contacts; the one already on FireFlair waits to accept; "Preview: Marcus joins" adds Marcus to your network.
- No XP amounts or tiers on Home, Network, Bookings or Profile.
- Saving: a reload brings back the signed-in session from the viewer's own document.
- SEO self-test: 32/32.

Not verified here: FF AI's real answers (it runs only inside claude.ai, with the
viewer's consent), the real map tiles, and anything that needs Griffy's backend.

**v1.1** was tested the same way: 66 checks, all passing, no page errors on
phone or desktop. They cover every item on the v1.1 brief's checklist — the
three steps and the bookings message, Training and Dream jobs on Home and
Bookings, no XP bar or XP page, the pop-up's three parts on the existing
rewards, the selector order and locks, no Add profession square, guidance only
inside Add location, the card preview with locked wallets and no dashes, the
Bookings cards and availability, coin centred on phone and on the right on
desktop, Add FF hidden — and the v1.0 journeys again (sign-up, professions,
locations, a .doc CV through FF AI, save, publish, network with the inviter,
viewing another profile, the map). Separately: a v1.0 save with three completed
steps loads as 30 XP, credited once across reloads; SEO self-test 32/32.

## 6. Remaining dependencies, bugs and decisions

**Backend (FireFlair Core)**

1. **Networking has no backend.** Needed: invitations (to a phone number or FF Tag, sent on WhatsApp), automatic two-way connection when someone signs up from an invitation link, team invitations that the other person accepts, the user's network list (inviter first), and reviews that stay pending until accepted. `NETWORK_ADAPTER` in the page lists them.
2. **Venues**: add a `venue` section to the FF Team card template (`scripts/seedCards.js`) and turn `SHOW_VENUES` on in the frontend.
3. **Section order**: the card template's order should follow §2 (Qualifications above Skills, Venues after Experience).
4. **.doc CVs**: `documentReader.js` accepts PDF, .docx, text and images only. Add Word 97–2003 support (for example a `.doc` text extractor) or keep refusing .doc with a clear message. The prototype's reader (`docText` in the page) shows the approach.
5. **Sign-in code**: still the fixed `123456` until WhatsApp delivery is connected, so anyone can sign in as any number on the dev site.
6. **API documentation** at `/api/docs` is public on the live backend (the condition gating it was removed on 14 Oct).
7. **FF XP**: v1.1 awards XP live in the page. Core needs somewhere to keep it — points, the steps already claimed, dated activity events and the quarter's total (the prototype keeps `profile.xp`, `xpClaimed`, `xpLog` and `xpPeriod`). Griffy's backend has no XP yet.

**Frontend (Griffy)**

8. The frontend repo still commits `.env` with the Google Maps key. Move it to Amplify's environment variables and restrict the key to the FireFlair domains.
9. Phase 1 UI to bring across (as of v1.1): profession type-ahead already exists (no separate Add profession tile); the Work Locations guidance copy inside the add-location step and the "5 recommended" meter; What is FireFlair? with the three steps and the bookings message; the FF XP Beta 2026 pop-up on the FF coin (no XP bar); the site selector with FF Staff, FF Party and FF VIP locked; the Bookings layout (§7); the card preview with locked wallet cards; the invitation and review flows; "Publish on FF Team"; Add FF hidden on desktop.
10. Google Maps / Places: the prototype can't load Google's script inside an artifact and must not carry the key, so it suggests from a fixed list. The live site keeps Griffy's Places search (regions only) for work locations.

**Decisions for Alex**

11. ~~FF Staff in the site selector.~~ Settled in v1.1: restored, Coming soon, between FF Team and FF Party.
12. ~~XP Coming Soon screen with ticks.~~ Settled in v1.1: no XP screen; FF XP Beta 2026 runs in the coin pop-up on the existing logic, completed steps marked Earned.
13. Tags: the prototype allows 3–8 characters; earlier specs say five-character tags. Confirm which rule launches.
14. The demo directory still shows ratings and review counts on example cards. Keep as examples, or hide numbers until real reviews exist.
15. Bookings shows "Your bookings" (Coming soon) first, then "Available now". The brief asks to make available and future features easy to tell apart; if Alex prefers the working parts first, it is one move in `P1Bookings`.
16. v16.15's Festivals 2027 shift-request cards are not on the Phase 1 Bookings tab (shift requests open with FF Staff and FF Party); festival work is covered by Dream jobs registration. Confirm.

## 7. v1.1 changes (16 October 2026)

From Alex's brief "Claude Artifact Update — FF Team Phase 1 v1.1". The artifact
was updated in place, not rebuilt: same build from v16.15, same adapters, data
model and components, with these edits on top of v1.0.

| Brief item | What changed in the page |
| --- | --- |
| Name and status | `<title>` and footer: "FF Team Phase 1 · v1.1 · in development". `PHASE1.name`, `version`, `status` |
| Work locations guidance | `WorkLocationsGuide` removed from the profile section; still at the top of `WorkLocationsSheet` (Add location). Section data and the Venues section unchanged |
| Add profession square | The "add" tile is no longer rendered for Professions (`addTile` skips `catKey === "professions"`). "Pick your professions" and type-to-create unchanged |
| Training and Dream jobs | v16.15's `TrainingSection` and `JobsSection` (Register interest, unchanged) back on Home and on Bookings |
| What is FireFlair? | New `WhatIsFireFlair`: one container (`.ff-wif`), no gold gradient. Part A "Your first three steps" (Step 1–3, no Phase labels); Part B on dark, "FireFlair is here to get you bookings." with the brief's copy, the FF Party jobs line, a Create your Profile Card button and an example card |
| FF XP | `Phase1XPBar`, `XPComingSoon`, `NextStepsSheet` and the XP screen removed (`PHASE1.xpBar = false`). New `XPPopup` titled "FF XP Beta 2026", opened by the FF coin (phone and desktop) and the profile's tier pill: Next steps (the existing `XP_TASKS` plus Question Cards, with their existing rewards), Your tier and level (`xpProgress`, `XP_LEVELS`, quarter total), How FF XP works (+ the existing `XPTimeline`). `claimXP` and the values are unchanged. Viewers' v1.0 steps (logged with 0 XP) are credited once on load |
| Site selector | `sitesShown: ["team", "staff", "party", "vip"]`; FF Staff gets `locked: true`, "Coming soon". Only FF Team opens; the reducer still refuses to switch into a closed site |
| Save & Share line | The 05 marker stays put; the line has a gap above and below it. The three dashes are gone; a gradient line runs down from Save & Share through the card preview and fades out |
| Card preview and wallets | New `CardPreviewSoon` under Save & Share until the profile is saved: an outline card, "Your complete card will display here", and `WalletSoon` (Add to Apple Wallet, Add to Google Wallet) as locked cards with "Coming soon" — not buttons, no pass made. `WalletSoon` also replaces the wallet buttons in Welcome to the Team and the published panel |
| Bookings | New `P1Bookings` (guest and signed in) built from existing parts: `FFAI`, `SectionHead`, `ServicePoster`, `PeakAvailability`, `TrainingSection`, `JobsSection`, and the new `SoonCard`. No calendar; the availability flow is v16.15's |
| Coming Soon cards | One `SoonCard` style (icon with a small lock, title, a line, a small label) inside one `.ff-soonpanel`, on Home and Bookings. FF Party is marked "Next to launch" |
| Desktop / phone | `PHASE1.desktopAdd = false` hides the top-bar Add FF button. The coin stays on the right on desktop and centred in the bottom bar on phones (no change there) |

Not changed: the map (Leaflet with CARTO tiles, drawn fallback when they can't
load — the prototype never had Google Maps, and the page must not carry a Google
key), networking, profiles, publishing, saving, CV reading and the SEO tags.
Google Places for work locations remains in Griffy's site.


## 8. v1.2 changes (16 October 2026)

From Alex's review notes on v1.1 and the brief "FireFlair Team — Profile Edit
Mode, Card Hierarchy & CV Import Workflow". Same artifact, updated in place;
built as `build.py` (v1.1) plus `build12.py`, with the new parts in one block
near the Phase 1 components.

### What changed in the page

| Item | Change |
| --- | --- |
| Home order | `JobsSection` above `TrainingSection`; jump links in the same order |
| Bookings WhatsApp | v16.15's `.ff-wa` panel back in "Your bookings"; the Requests card uses the WhatsApp mark |
| Sections closed | `ProfileAttributeSection`: on your own profile only Professions starts open. `profile_network` starts open when `inviterOf()` finds an inviter; Reviews and Q&A start closed. Saved show/hide choices still win |
| Q&A | New `QuestionCardsCollection` and `PublicQA` (v16.15's kept as `…_v16`). `QuestionCard` takes `asker`, has rounded corners (`.ff-qcard`). Asked questions carry `byId`, `byName`, `askedAt`. `askedOfMe()` lists questions for "me" plus one example from the inviter; answers go to `profile.answers[id]` through the existing `ANSWER` action (+1 XP, as any Question Card) |
| Save & Publish | `SaveShareCard` title and buttons: Save, Publish (save, `published`/`publishedAt`, `PUBLISH_XP`, opens Welcome with the confirmation) |
| Share stack | `ShareStack` replaces `WalletSoon` in the card preview, Welcome and the published panel: Share (existing `useShareCard`), then two locked wallet buttons of the same size |
| Own finished page | `TeamProfile`: `PlayerCard` without actions; Edit card full width under it; Share in `PublishedPanel`. `PersonProfile` no longer passes actions for "me" |
| Profession symbols | `ProfessionMarks` in the card's rule: up to three distinct icons from `PROFESSION_MARKS` (name patterns, then the category), diamonds between, car last. Icons that the CDN's lucide version lacks fall back to the next name |
| Tiers | `withRanks()` orders records primary → secondary (max 2) → tertiary, using `record.rank`; records without a rank keep the old positional look. `visibleRecs` (the card front) and `HorizontalCardRanker` use it. Arrows removed |
| Edit Profile | `profileEdit` in the store (persisted with the rest): `layout` per section (`id`, `rank`, `keep`), `added` (cards FF AI found, not yet on the profile), `fills`, `extras`. Actions `PE_START`, `PE_KEEP`, `PE_MOVE` (with `makeRoom` for the Secondary limit), `PE_PATCH_NEW`, `PE_EXTRA`, `PE_CANCEL`, `PE_COMMIT`. UI: `ProfileEditHead`, `TierEditor` (pointer-event drag with auto-scroll, drop marker, keyboard ← → ↑ ↓, Move sheet, Secondary chooser), `NewCardSheet`, `ProfileEditBar` (one Save Changes, busy state, error kept in Edit Profile, confirm on leave, `beforeunload` while unsaved) |
| Save Changes | `applyEdit()` builds the new records: kept new cards join with `proposed: false`; unticked saved cards become `hidden: true` (recoverable, as before); unticked new cards are dropped. Then `PROFILE_ADAPTER.save` (when signed in), `PE_COMMIT`, `RECORDS_FILL` for fills, and the Question Card answers FF AI found |
| CV / FF AI import | `CVPanel` and `ProfileFFAI` render `ImportToEdit` instead of `ExtractionReview` (still in the file, unused). Same extraction, same `buildSuggestions` / `recordsFromSuggestions` mapping; duplicates are still skipped; new cards get `proposed: true, verified: false` and keep `source` (origin, page, evidence). The CV file itself is still saved as the CV document card on upload |

### For the live site (Griffy)

1. **Card tier field**: card section data needs a `rank` per item (`primary` / `secondary` / `tertiary`), saved with the order. `PATCH /api/user/card/sections/:sectionId/data/order` could take `[{ id, rank }]`. Rule: at most two `secondary`. Existing items without a rank: first = primary, next two = secondary, rest = tertiary (what the prototype does).
2. **Hidden items**: unticking a saved card hides it (`hidden: true`), it isn't deleted. The section data needs a hidden flag if it doesn't have one.
3. **Edit Profile draft**: the prototype keeps the unsaved draft in the viewer's saved state so it survives a reload. On the live site it can live in the browser until Save Changes; Save Changes should send one request (or one batch) for the whole profile and only report success when it completes.
4. **CV import**: `POST /api/user/ffai/extract` stays. Instead of the review-and-apply screen, the frontend shows the extraction's items as unsaved cards in Edit Profile and sends the kept ones with Save Changes (or calls `…/apply` with only the kept items and their ranks). Imported qualifications must not be marked verified.
5. **Asked questions**: "Ask a question" needs a backend: store the question against the profile with who asked and when; the profile owner answers it; both show on the public profile. None of this exists in the backend yet.
6. **Profession symbols**: a mapping from profession (or category) to an icon; the prototype's `PROFESSION_MARKS` is a starting list.

### Tested

Headless Chromium, phone (390 px) and desktop (1280 px):

- **v1.2 journeys, 82 checks** (all v1.1 journeys plus): Dream jobs above Training; the WhatsApp panel on Bookings; Save & Publish with Publish and no Share; Share above Apple and Google Wallet, all one size, wallets locked; sections closed except Professions; Network open with the inviter; CV (.doc) → Edit Profile with From CV cards and no review screen → Save Changes → cards on the profile, no arrows; Welcome and the finished page with the share stack; Edit card under the card.
- **v1.2 features, 35 checks** on the demo profile with a stand-in private save: no Book · Review · Join on your own page; profession symbols with a spoken label; tiers in normal view; Q&A panel and rounded cards; answering a question from the inviter, with who asked; asking someone a question on Network and seeing "Asked by you" on their profile; Edit Profile lanes, checkboxes, Move, drag handles; the Secondary chooser; ↑ to promote with the keyboard; finishes change at once; a failed save keeps the changes and shows a message; leaving asks first; Save Changes; order, tiers and the hidden card survive a reload; the card front follows the tiers.
- **CV import, 13 checks** with a stand-in for FF AI: mapping to qualification, venue and experience cards; the CV document card kept; "not verified" note; the draft survives a reload; Cancel adds nothing; unticked cards not added; a second import adds no duplicates and says so.
- Drag and drop checked with a mouse and with touch input.
- v1.0 XP credit still applied once; SEO self-test 32/32; no page errors.

Not verified here: FF AI's real answers, the real map tiles, saving on claude.ai itself, and anything that needs Griffy's backend.


## 9. v1.3 changes (16 October 2026)

Supersedes parts of §8 (the Edit Profile draft, tick boxes and Save Changes).

- **No draft.** `profileEdit` is now just `{ on }`. Moves apply straight to the
  records (`PE_MOVE` → `moveRecord`), which carry `rank`. `rankAll()` writes
  ranks onto older lists from their positions; `addRanked()` gives new cards a
  guess (Primary if none, then Secondary up to two, then Tertiary), used by
  `REC_ADD` and `RECORDS_MERGE`. `ImportToEdit` adds everything found (no
  review), sorted by confidence, `verified: false`, and fills name, About and
  photo only when empty.
- **Editing mode**: on while the profile has never been saved; afterwards only
  after Edit profile. `SaveShareCard`'s Save and Publish end it (`PE_DONE`).
  On the finished profile page, `P1SaveWhileEditing` shows Save & Publish at
  the foot while editing.
- **Drag**: `TierEditor` listens on the whole card (pointer events). Mouse and
  pen start after 6 px; touch after a 240 ms hold, with a non-passive
  `touchmove` listener stopping the scroll once a drag starts. A drag never opens
  the card; a tap does. The row auto-scrolls near its ends.
- **Verification levels**: `VERIFICATION_LEVELS` (Base 0, Bronze 5, Silver 20,
  Gold locked) from `myNetwork(...).list.length`. New coin tier `base` (the gold
  logo greyed out; grey metal for the drawn fallback). `XPPopup` rewritten;
  `MyVerificationPill` replaces the XP tier pill. `PHASE1.xpLive: false`.
- **Desktop coin** in `ff-desknav` at the `__ff` slot.

For Griffy: the live site needs a connection count per profile to work out
the level (inviter counts as a connection), and `rank` on card section items
(§8 point 1). No XP is awarded in version 1.

Tested: journeys 82/82, features 26/26, CV import 9/9, drag 16/16 (mouse drag,
tap opens, keyboard, the Secondary bump, Save ends editing, touch swipe scrolls,
touch hold-and-drag), SEO 32/32, no page errors.

## 10. v1.3.1 to v1.3.4 changes (16 October 2026)

- **v1.3.1:** gold FF AI gradient on every FF AI box (`FFAI` defaults to
  `tint`); Network quick searches (top three professions and locations, from
  `networkQuickSearches`); desktop FF coin to the right of Profile.
- **v1.3.2:** after-save Welcome screen: FF Tag when there is no name, "add a
  profile picture" prompt (`P1PhotoPrompt`, photo shrunk to 640 px JPEG),
  Share then Apple and Google Wallet side by side (`ShareStack`).
- **v1.3.3:** FF Team for everyone; FF Staff "Notify me" (`staffNotify`); white
  stencilled Base coin; XP pop-up FF Rewards; Home FF XP and FF XP Rewards
  (`rewardsInterest`).
- **v1.3.4:** Work locations box and postcode step (`workPostcode`,
  `P1_SET_PRIMARY_LOC`, `PC_TABLE`).

For Griffy: the live site needs (1) a stored notify list for FF Staff and
rewards interest (prototype keeps these in the viewer's own state; nothing is
sent), (2) a connection count to work out the verification level, (3) `rank`
on each card item, and (4) a private postcode field per profile with a
postcode lookup for the primary location and travel distance.

## 11. v1.4 changes (16 October 2026)

- **Biography / Introduction** is `profile.about` (same source of truth),
  capped at 1,000 characters in the field (`BioField`) and in the store.
  CV import no longer writes it.
- **Public profile**: `PublicIntro`, `PubGrid`, `PUB_KIND`/`PUB_ORDER`;
  `InformationCard` takes a `pub` size (m, x, d, s). Tiers still come from
  `rank` via `withRanks`. `Sheet` is now an accessible modal dialog.
- Griffy: store the biography as the profile's text field with a
  server-side 1,000 limit; no other API change.


## 12. v1.5 changes (17 October 2026)

- **Public profile**: `MediaCarousel` (`mediaOf`), the unchanged `PlayerCard`,
  `ProfileTabs` (ARIA tablist), `PublicProfileBody` with `AboutMeBlock`,
  `AttrCarousel` (chunked), `CoverFlow` for Services and Reviews, `MemScroll`
  for Teams, `useDragScroll` for mouse drag. Cards reuse `GenericAttributeCard`
  / `InformationCard` (new `pub` sizes `c` and `r`, `subline`), `ServicePoster`,
  `OwnServiceCard` (renders as a div when it has no click handler) and
  `OrgCard` (people mark for "Team").
- **Data**: counts come from `servicesOf` (registered interest plus own cards),
  `teamsOf` (`person.teams`, plus "Your team" from `state.connections`),
  `reviewsOf` (`reviewRecordsFor`, with shift context). Nothing is invented.
- **Creator**: `CreatorMedia` (MEDIA_ADD / MEDIA_DELETE, new P1_MEDIA_MOVE and
  P1_MEDIA_REPLACE), `CreatorAboutMe` (500, `aboutAssist`, `aboutFacts`).
  The v1.4 Profile Card biography field and `PublicIntro` are removed.
- **FFAI**: `compact` prop, smaller padding, coin, heading and text entry; the
  submit button no longer overlaps the mic for long labels.
- Griffy: `profile.about` limit is 500; media list (ordered, images) per
  profile; team memberships per person; a server-side AI call for About Me.

## 13. v1.6 changes (17 October 2026)

- **Hero**: `PublicHero` (media, Profile Card, `below` = Back, guest note,
  actions), `MediaCarousel` (sticky behind the card on phones, `flat` in a
  dialog), `MediaMosaic` (desktop), `useWide(900)`. `mediaOf` now reads
  `record.media` on every category, not only Media cards.
- **Overview**: Professions via `PubGrid`; `attributesOf` leaves professions out
  and sorts by `completeness`. Q&A (`PublicQA`) renders under the Services tab.
  The Book / Review / Join row under public profiles is removed.
- **FFAI**: new render, one row (`.ff-ai-row`: mic, auto-growing textarea, send).
  `compact` kept. The `ProfileFFAI` purpose and placeholder are shorter.
- **Own profile**: `OwnEditTools` shows `ProfileFFAI`, `CVPanel`, `CreatorMedia`
  and `CreatorAboutMe` while `useEditing`; otherwise a guest-view prompt.
  `CreatorMedia`: label-wrapped file input, drag and drop, prototype sample
  pictures (canvas, three, marked "Sample picture").
- Griffy: a real uploader and storage for profile media (see README).

## 14. v1.7 changes (17 October 2026)

- **Home**: new `HomeHero`, `HomeFeatured` (`HomeCarousel`: buttons, swipe, drag), compact `P1WhoAreYouV17`, `WhatIsFireFlairV17` (three steps, shorter bookings panel), `HomeTeams`, `HomeRelationships`, image-led `P1ComingSoonSectionV17`, `HomeMapSection` (real `FFMap`), `P1XPSection` (shorter copy, same tiers), `HomeBookingTiles`. `TeamHomeV17` and the signed-out Landing share `P1FireFlairInfoV17`.
- **Booking screen** (`P1Bookings`): `P1RewardsSection` added after Training and Dream jobs, with a Rewards chip and search route. Reward sign-up logic unchanged.
- **Hero input**: `FFAI` `bare` mode; routing in `HomeFFAI` unchanged apart from sending training, dream jobs and rewards to the Booking screen.
- **Images**: `HOME_IMAGES` slots with branded fallbacks; real licensed photography is outstanding.
- **Not touched**: backend schemas, auth, booking logic, XP rules, nav bars, Profile Card and Review Card templates.
- **Tested**: new homepage suite (94 checks) plus journeys (91), features (26), CV (9), location (17), debug (32), drag (16), profile (98), persistence.
- **Decisions**: photography supply; final wording of Step 3, the hero subline and the Verify line; the example Team card is a labelled illustration of the existing Team card.


## 15. v1.7.1 changes (17 October 2026)

- **Home hero**: `HomeHero` is now a banner (copy, `HomeFFAI` and the Create your Profile Card button on the left; `img.ff-hero18-photo` with `srcSet` 900 w / 1800 w on the right, faded into the page). The official Coin is a separate overlay (`.ff-hero18-coin`), never part of the photo. Two columns at 900 px and up, stacked below.
- **Beta badge**: `BetaBadge` (top bar, beside the auth button) fires `ff-feedback`; `FeedbackSheet` filters `QUESTIONS` for `group === "feedback"`, renders the existing `QuestionCard`s and opens `QuestionSheet`. Signed out it shows a log-in prompt. Answers go to `state.feedback`.
- **Carousels**: `SwipeCarousel` (heading outside the cards, Open, prev / next, dots, `useDragScroll`) in `HomeBookingTiles` for Dream jobs, Training and Rewards, 8 items each. Open and cards call `goBookingSection`. Interest controls are not on Home.
- **Booking screen**: `TrainingSection`, `JobsSection` and `P1RewardsSection` are replaced by one `InterestSection({kind})` built on `ShineImgChoice` (image, kind, title, "I'm interested" tick). Item ids and the interest reducers (`TRAINING_INTEREST`, `JOBS_INTEREST`, `P1_REWARDS_INTEREST`) are unchanged; a null payload clears.
- **Register interest**: signed-in only. Phone and WhatsApp fields removed. The registration is stamped with the signed-in tag (`account`) and shown only when it matches, so another account on the same device sees nothing. One bar (own entry plus Submit), "Registered" with Change and Withdraw. Signed out: log-in / create-card prompt. Service Cards by profession are not offered.
- **FF AI**: `FFAI` takes `bare` and `chat` (default on for the single-line, non-compact box). `ffaiIntent` classifies text (capabilities, greet, thanks, whatsapp, training, jobs, rewards, profile, event, find, unknown, or null for a plain keyword search); `FFAIChat` renders the panel with "Prototype response" tags and action chips; `ffaiReply` holds the canned replies. Hint lines and the Network quick-search chips are removed; section-jump chips on the Booking screen stay because they are navigation. The Network placeholder is "FF AI, search the network. Describe who you're looking for."
- **What's next**: `homeNext()` has the new copy and images; `PreviewServices` (three Service Cards), `PreviewCocktails` (four cards, draggable) and `PreviewWallet` (phone mock-up with a real `PlayerTile` from `useDirectory`) sit inside `InertBox`, so they are not interactive.
- **Teams**: `TeamCard17` (member portraits, name, tag, `ffparty.uk/dreamteam`, rounded) and `HomeTeams` with the teams image and the live-event thumbnail.
- **Images**: `assets/` (27 optimised webp files, about 1.4 MB), embedded by `window.FF_IMG`. The supplied Rewards files are two-panel collages whose contents do not match their names; panels were cut and re-matched by content (`assets/README.md`). Awaiting confirmation.
- **Not touched**: backend schemas, auth, booking logic, XP rules, nav bars, Profile Card and Review Card templates, routes.
- **Tested** (mobile and desktop, signed in and out, interest states, carousel links): homepage suite 130 of 130, v1.7.1 suite 89 of 89, journeys 91 of 91, profile 98 of 98, features 26 of 26, CV 9 of 9, locations 17 of 17, debug 32 of 32 (no failures), drag 16 of 16, persistence clean. No page-level horizontal overflow at 360, 430, 820 and 1280 px, signed in and out, on Home, Network, Bookings and Profile. Console clean.
- **Backend dependencies**: (1) an account-level interest endpoint (register, change, withdraw, read) for Training, Dream jobs and Rewards; (2) a feedback endpoint; (3) the FF AI / WhatsApp chatbot behind `ffaiReply`; (4) real licensed or approved images.
- **Decisions**: confirm or correct the Rewards image pairing; whether Booking-screen FF AI section chips stay; FF Staff tile uses a hands-only bar image; the NFC reward uses the card panel with no mark so no logo is drawn by AI.
