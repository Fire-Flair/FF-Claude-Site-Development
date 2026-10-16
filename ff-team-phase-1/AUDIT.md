# FF Team Phase 1 Final — code audit and consolidation notes

Version 1.0 · 16 October 2026 · file `ff-team-phase-1-final-v1.0.html`

This is the audit the Phase 1 brief asks for: what was inspected, how the two
codebases compare feature by feature, what was reused, restored or changed,
and what is still open.

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

| Feature | Prototype v16.15 | Griffy (dev) | Phase 1 Final |
| --- | --- | --- | --- |
| Sign-up: FF Tag + phone + WhatsApp code, optional password, log in by code or password | Both. Prototype is a mock (`AUTH_ADAPTER`, any six digits) | Real endpoints: `send-otp`, `verify-otp`, `login`, `password`, `password/change`, `tag-availability`, `tag` | Kept the prototype journey. Each `AUTH_ADAPTER` call maps to one of Griffy's endpoints (table in §4) |
| Profile Card builder (name, photo, professions, skills, interests, locations, languages; colours) | Both | Card saved through the section APIs (fixed 16 Oct), auto-save, card themes, profile image upload to S3 | Kept |
| Profession search as you type | **Missing**: category chips only | **Griffy**: search field against `GET /user/professions?search=`, plus "add your own" | **Restored**: type-ahead across the 35 v1.6 professions, ranked starts-with first, plus "Add “…”" for anything else; FF AI asks for the category when the rules can't tell |
| 7 categories × 5 professions (v1.6) | Both | Both (backend seed) | Kept |
| Qualifications, Skills, Experience, Interests, Media | Both | Both (card template sections) | Kept |
| Venues | Prototype: own section with address and "View on Google Maps" | **Switched off** (`SHOW_VENUES = false` in `ProfileSections.tsx`) and **no `venue` section in the backend card template** (`scripts/seedCards.js`) | Kept, editable, placed straight after Experience. Backend needs a `venue` section (see §6) |
| Work locations | Free text, suggestions from a short list of nearby areas | **Griffy**: Google Places autocomplete limited to regions, with coordinates (`src/api/places.ts`) | Separate section with the required guidance copy (in the section and in its editor), a multi-add sheet with type-ahead over ~90 UK towns and areas, rename and remove, no limit, "5 recommended" meter. Production keeps Griffy's Google Places search (§6) |
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
| XP | XP bar with points, tiers, levels, quarterly periods, "+10 XP" toasts | None | **XP Coming Soon screen** behind the XP bar and the FF coin; no points, tiers or leaderboards anywhere. Completed activities are still recorded with dates (`profile.xpLog`) for the retroactive award |
| Site selector (top left) | FF Team, FF Staff, FF Party open; FF VIP locked | Not built | FF Team open; FF Party and FF VIP locked with a lock icon and "Coming soon". FF Staff stays in the code but isn't offered |
| Bookings tab | Full FF Team bookings (shift requests, availability, Service Cards) | Static bookings page | Coming Soon page; nothing on it can send, book or pay |
| Home | FF Team, FF Party, Service Cards, Training, Dream jobs, Review Cards, sites, map | Home page with FF AI | Phase 1 home: FF AI, What is FireFlair (build profile, grow network, take reviews), FF Team, Network, Review Cards, a locked Coming Soon row, sites, map |
| Saving your work | One shared `fireflair/state` document for every viewer (a bug: viewers overwrote each other) | Backend database | Each viewer's own private document (`data/users/<id>/ff-team-phase-1`) |
| SEO | Head tags per view, self-test | `robots.txt`, `sitemap.xml`, per-page tags | Kept; FF Team wording; self-test passes 32/32 |

## 3. What changed during consolidation

Every change is a small, named edit to v16.15, so the rest of the prototype is
unchanged and still in the file for later releases. The Phase 1 boundary lives
in one object near the top of the script, `PHASE1`:

- `sitesShown` / `sitesOpen` — which sites the selector shows and which open.
- `profileOrder` — Phase 1 sections and their order (Signature cocktails held back).
- `xpLive: false` — activities recorded, no points shown or added.
- `bookingsLive: false` — Bookings tab is a Coming Soon page; "Book" on profiles is locked.
- `leaderboards: false` — rankings hidden.

Flipping a flag brings the existing feature back; nothing was deleted.

New in the page: `XPComingSoon`, `NextStepsSheet`, `Phase1XPBar`,
`BookingsComingSoon`, the Phase 1 Home sections, `WorkLocationsGuide` and
`WorkLocationsSheet`, `LanguagePicker` and `LangFlag` with `LANGUAGE_MASTER`,
`InvitedByBanner`, `SentInvitations`, `NETWORK_ADAPTER`, and the .doc reader
(`cfbStreams`, `docText`, `readDoc`). The reducer gained `SCREEN` (the XP
screen) and `INVITE_JOINED` (preview of an invitee joining), and refuses to
switch into FF Staff / FF Party while they are closed.

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

## 6. Remaining dependencies, bugs and decisions

**Backend (FireFlair Core)**

1. **Networking has no backend.** Needed: invitations (to a phone number or FF Tag, sent on WhatsApp), automatic two-way connection when someone signs up from an invitation link, team invitations that the other person accepts, the user's network list (inviter first), and reviews that stay pending until accepted. `NETWORK_ADAPTER` in the page lists them.
2. **Venues**: add a `venue` section to the FF Team card template (`scripts/seedCards.js`) and turn `SHOW_VENUES` on in the frontend.
3. **Section order**: the card template's order should follow §2 (Qualifications above Skills, Venues after Experience).
4. **.doc CVs**: `documentReader.js` accepts PDF, .docx, text and images only. Add Word 97–2003 support (for example a `.doc` text extractor) or keep refusing .doc with a clear message. The prototype's reader (`docText` in the page) shows the approach.
5. **Sign-in code**: still the fixed `123456` until WhatsApp delivery is connected, so anyone can sign in as any number on the dev site.
6. **API documentation** at `/api/docs` is public on the live backend (the condition gating it was removed on 14 Oct).
7. **XP activity log**: to reward Phase 1 activity retroactively, Core should record dated activity events from now on (the prototype keeps `profile.xpLog`).

**Frontend (Griffy)**

8. The frontend repo still commits `.env` with the Google Maps key. Move it to Amplify's environment variables and restrict the key to the FireFlair domains.
9. Phase 1 UI to bring across: profession type-ahead already exists; add the Work Locations guidance copy and "5 recommended" meter, the XP Coming Soon screen, the locked site selector, the Bookings Coming Soon page, the invitation and review flows, and "Publish on FF Team".
10. Google Maps / Places: the prototype can't load Google's script inside an artifact and must not carry the key, so it suggests from a fixed list. The live site keeps Griffy's Places search (regions only) for work locations.

**Decisions for Alex**

11. FF Staff is not in the Phase 1 site selector (the brief lists FF Team, FF Party and FF VIP). Confirm.
12. The XP Coming Soon screen shows activities the person has already done (ticked, with no points). Confirm this is wanted, or show the list without ticks.
13. Tags: the prototype allows 3–8 characters; earlier specs say five-character tags. Confirm which rule launches.
14. The demo directory still shows ratings and review counts on example cards. Keep as examples, or hide numbers until real reviews exist.
