# Handoff — v17.4.6 (Phase 3 prototype line)

Prototype only. Everything marked SIMULATED keeps its data in this preview's store; the production work
is listed at the end. Built on v17.4.5 (`6d829aa`).

## 1. FF Team Bookings

- **FireFlair bookings** now has two boxes: **FF Staff Shifts** and **FF Party packages**. The duplicate
  "Are you available for freelance work?" question is gone from Bookings; its Question Card (`g_freelance`)
  stays on the profile.
- **FF Staff Shifts**: one grey/silver card per profession (a version of the FF Party package card), in a
  horizontal rail. Categories and names come from `PROFESSION_CATEGORIES` (Pick your professions). Signed-in
  members see "Your professions" first (their profession records plus any profession they have answered);
  every category stays one tap away. Guests see the whole catalogue; the rate field asks them to log in.
- Each card keeps the availability question (answers stay in `profile.staffAvail`, unchanged) and adds
  **Your preferred hourly rate** (optional, £/hour).
  - Stored as a typed Q&A answer: question `rate.<profession id>`, `typed: { kind: "rate_gbp_hour", pence }`,
    visibility `ff-staff`. One rate per member per profession; clearing the field withdraws it.
  - Profession ids: `professionId(name)` = `prof.` + slug (new; there were no ids before). Example
    `prof.cocktail-bartender`.
  - Shown beside the matching profession on the member's profile **on FF Staff only**
    (`staffRateP17` → `publicAnswers17(state, account, "staff")`). FF Party and FF Team never read it, and
    `publicAnswers17(…, "party")` excludes it, so it must stay out of the FF Party public payload.
  - Businesses still set the actual rate on each Shift Card. No suggested wage table (the empty
    `SUGGESTED_PAY21` is removed). FF Party packages keep their set pay, accepted when the professional
    confirms.
- **Invitation cards** (`ShiftDelivery11`, every place it is used):
  - Source from the event record: `eventSource17(state, event)` = `event.source` → `event.site === "party"`
    → the hirer (older records). New events from the booking flow now save `source`.
  - Label and style per source: "FF Staff shift" (burgundy) and "FF Party package" (gold).
  - Same footprint in the rail (cards stretch to the tallest; notes clamp to four lines; the full brief is
    under More information; actions are never hidden).
  - **Pay** row shows **Hourly** and **Shift total** side by side from one function, `payOf17(shift)`
    (`src/utils/pay17.js`): pence and minutes, half-up rounding to the penny.
    Hourly = `rateP` > `rate` > "£22 an hour" in `pay`. Fixed total = `totalP` > `total` > package pay
    (`PAY17[svcId]`), with the hourly figure derived from it. Paid duration = `paidMins` > `hoursM` > the time
    span (an end at or before the start runs past midnight) less `breakMins`.
  - Missing pay shows "Pay not recorded"; unreadable times or amounts show "Pay can't be read" (the reason is
    in the tooltip). Nothing is filled in.
  - Demo records repaired: every demo event has `source`; the two FF Party demo shifts carry their package
    (`shf_5` Bartending Package, `shf_9` Cocktail Bar Service). Other demo shifts have no agreed pay and say so.
  - Checked: overnight (20:00 — 02:00), partial hours (19:10 — 22:50), hours typed by the business, breaks,
    24-hour span, unreadable times and amounts, and the booking-flow shape (`rate` + `total` + `pay`).

## 2. FF Team profile — Build your packages

- Order: **Signature cocktails** (open, with the two-card editor inline from the start), **Service Cards**,
  **FireFlair Stories** (both closed until opened; each opens straight into its inline editor). The bulk
  "many cards at once" box (Coming soon) moved to the bottom.
- Cocktails: one plus card. Classic or Signature is chosen inside the card (the existing switch). The
  separate Classic and Signature plus boxes are gone.
- Stories: the editor shows the story rendered as an article underneath (`V101.StoryPreview17`, same article
  layout as published Stories). User text is rendered as text; only `https://` and `/stories/` links stay links.
- Storage: one profile-owned, versioned field (`src/state/profile-content17.js`):

  ```
  profile.content = { v: 1, rev, updatedAt, owner, cocktails: [], services: [], stories: [] }
  ```

  Entries keep their ids (`ck_…`, `sv_…`, `bp_…`). Save is the only publication action: a saved entry shows
  on the published profile at once; on an unpublished profile it is kept and appears once the profile is
  published (`publicContent17` reads `profile.live`). Unsaved edits stay in the editor.
  Older `state.myCocktails / myServices / myPosts` are moved in once with the same ids (`migrate1746`).
- Writes go through `PROFILE_ADAPTER.saveContent(tag, content)`: strings cleaned and capped, structure,
  ownership (`owner` = signed-in tag), id format and uniqueness, limits (60 cocktails, 30 services, 40
  stories, 10 photos each) and image references (uploaded `data:image/…`, packaged asset, photo-library key,
  or https). Photos use the existing upload path (`shrinkPhoto`).
- FF Staff company cards keep their own lists (`coCocktails17`, `coServices17`); only the UI changes there.
- Out of this release: global search, separate catalogues, listings and promotional placements.

**Live API.** `ff-team-phase-1/AUDIT.md` §4 lists `PATCH /api/user/card/profile`, the card section routes and
`GET /api/user/card/public/:ffTag`. No supported profile extension field is documented, so the minimal change is:

| Route | Who | Body / result |
|---|---|---|
| `PUT /api/user/card/content` | owner, authenticated | `{ v, rev, cocktails, services, stories }`; same validation server-side; returns the stored content with `rev + 1` |
| `GET /api/user/card/content` | owner | the full content, published or not |
| `GET /api/user/card/public/:ffTag` | anyone | adds `content`, only when the profile is published |

**SIMULATED**: validation runs in the browser and the store is the persistence.

## 3. Register interest and Q&A — routing audit

Every Register interest action now goes through `QA_ADAPTER` (`src/adapters/qa-adapter.js`) with a stable
question id and stable option ids (the existing catalogue ids). Success shows only after the save resolves.
A repeated `submissionRef` is a retry and changes nothing. Older answers are kept in `history`; withdrawal
sets `withdrawnAt`. The legacy key each screen used is still written in the same step, so nothing that reads
it breaks.

| UI surface | Handler | Storage before | Q&A now |
|---|---|---|---|
| FF Team Bookings → Training | `InterestSection` (kind training) | `state.trainingInterest` | `int.training`, options = `TRAINING_COURSES` ids + own text; withdraw supported |
| FF Team Bookings → Dream jobs | `InterestSection` (jobs) | `state.jobsInterest` | `int.jobs`, `DREAM_JOBS` ids + own text; withdraw |
| FF Team Bookings → FireFlair rewards | `InterestSection` (rewards) | `state.rewardsInterest` | `int.rewards`, `XP_REWARDS` ids + own text; withdraw |
| FF Team home tiles (Training, Dream jobs, Rewards) | `HomeBookingTiles` → navigate | none (opens Bookings) | the Bookings forms above |
| FF Team Bookings → FF Party packages (Sign up on a package card) | `toggleService` in `TeamBookings` | `profile.serviceInterest` | `int.party_package`, options = package ids; last one off withdraws |
| FF Team Bookings → FF Staff Shifts rate | `ProfRateTile17` | (new) | `rate.prof.<slug>`, typed rate, visibility `ff-staff`; empty field withdraws |
| FF Staff → Train / Reward your staff | `BizInterest17` | UI state only (lost on reload) | `int.biz_training`, `int.biz_rewards` for the company account |
| FF Staff Bookings → Business packages (Silver, Gold) | `Plans11` | `state.planInterest` | `int.planning`, options `bronze/silver/gold` |
| Area pages where FireFlair isn't taking requests (guest form) | `FdAsk11` (expansion_interest) | lead queue `state.fd.requests` | `int.area_expansion` (guest allowed; contact kept), options = role ids, subject = location id; the lead keeps `qaResponseId` and the same reference |
| FF VIP → Join the launch party guest list | VIP card save | lead queue (`vip_guest`) | `int.vip`, option `launch_party_guest_list`, linked to the lead by reference |
| Legacy `P1Bookings` | — | `profile.serviceInterest` | not reachable (`PHASE1.bookingsLive` is true); unchanged |
| `VIP_INTEREST` action | — | `state.vipInterest` | never dispatched; migrated if present |

Saved answers from before v17.4.6 (training, jobs, rewards, FF VIP, package sign-ups) are copied into Q&A once
on load, keeping their dates (`qaMigrate17`). FF Admin → Answers now lists everything from the one Q&A store.

**Live API gaps.** `GET /api/user/questions` and `PUT /api/user/questions/:questionId/answer` take one answer per
question. Missing for this flow:

1. Multi-select: `optionIds: string[]` plus `own: string[]` (free text options).
2. Typed answers: `typed: { kind: "rate_gbp_hour", pence }` and a per-profession subject (`subjectId`).
3. `visibility`: `private | ff-staff | public`, enforced in every public projection.
4. Withdrawal: `DELETE /api/user/questions/:questionId/answer` (or `withdrawnAt`), keeping history.
5. Guest submissions without an account: `POST /api/public/questions/:questionId/answers` with `contact`
   and a client `submissionRef` used as an idempotency key; returns the answer id for the lead queue.
6. Company accounts as answer owners (FF Staff).

## 4. Shared UK location tree and area pages

- **Catalogue.** `data/front-doors/launch_pages.json` (the kit) stays authoritative for its 1,000 pages and is not
  rewritten. New pages go in `data/front-doors/location_additions.json`; worldwide navigation rows added in the
  prototype are in `prototype_world_rows.json`. `npm run locations` (`scripts/build-locations.py`) builds
  `src/content/data/fd-rows.json` and `fd-aliases.json`. Row order is stable: the 1,034 existing rows are
  byte-identical, additions are appended, no page moves. The build fails on duplicate ids or paths, unknown or
  later parents, cycles, empty names or slugs, alias paths that collide with real pages, unresolved routes and
  additions outside `/areas/uk`. Report: `data/front-doors/catalogue_additions_report.json`.
- **34 verified additions** (GeoNames GB dump of 7 Nov 2026: exact name, current feature, coordinates and the
  administrative unit it sits in; no retired authority names):
  - London: Mayfair, Belgravia, Knightsbridge, St John's Wood (Westminster); Kensington (Kensington and
    Chelsea); Dulwich (Southwark, alias Dulwich Village).
  - Home Counties and Thames Valley: Elmbridge (Surrey) with Cobham and Oxshott; Virginia Water (Surrey);
    Sunningdale (Windsor and Maidenhead); Beaconsfield (Buckinghamshire); Radlett, Chorleywood
    (Hertfordshire); Henley-on-Thames (Oxfordshire, alias Henley).
  - Northern and coastal England: Alderley Edge, Knutsford (Cheshire East); Hale, Bowdon (Trafford); Ilkley
    (Bradford); Sandbanks, Canford Cliffs (Bournemouth, Christchurch and Poole); Salcombe (Devon).
  - Scotland: Stockbridge, Morningside (Edinburgh); Giffnock (East Renfrewshire); North Berwick, Gullane
    (East Lothian).
  - Wales: Cowbridge (Vale of Glamorgan); Monmouth, Usk (Monmouthshire).
  - Northern Ireland: Holywood, Cultra (Ards and North Down); Hillsborough (Lisburn and Castlereagh).
  - Notes: Sandbanks is a peninsula in GeoNames, not a populated place. Belgravia and Knightsbridge straddle
    Westminster and Kensington and Chelsea (GeoNames places both in Westminster). Esher, East Molesey and
    Weybridge keep their pages directly under Surrey so their routes don't change; a developer can move them
    under Elmbridge later with alias paths. Every candidate in the brief verified, so all were added and no
    further ranking against ONS GDHI or UK HPI was needed; those sources remain the guide for the next batch.
- **Coverage** (`src/components/shared/coverage17.jsx`), one control in the Profile Card editor (Work
  locations row) and under What areas do you cover? (FF Team profile, FF Staff company), same state.
  - Stored by stable id: ticked places are `locations` records with `locId` (what the public sees);
    exceptions are `coverage17.exc`. A place is covered when the nearest ticked-or-excluded place at or above it
    is ticked. Ticking London covers every borough and neighbourhood; unticking Camden adds an exception and
    London shows as partly selected; ticking a partly selected place clears the exceptions beneath it.
  - Expand and select are separate controls; arrow keys open and close a branch; checkboxes carry
    `aria-checked="mixed"`.
  - Postcode is private (`state.workPostcode`), used only to suggest and open the nearest branches.
    `LOCATION_ADAPTER.lookupPostcode` tries postcodes.io, then the offline outward-code table; a manual place
    search is always there. Production should run the lookup server-side.
  - Matching honours exclusions (`fdCovers`, `fdServesWithin`, `fdCoverNames`), so a Camden page no longer
    lists someone who covers London but not Camden.
  - Older saved coverage (names only) gets ids on load; names that match no catalogue place (for example
    "International") stay as typed and are shown, not matched. Shared names (Newport, Bangor) are matched only
    by id, and labelled with their parent.
- **Explore by area** (Browse the network) uses the same tree with links; branches expand on their own, the
  people in the last branch opened show underneath as before, and Worldwide is the second root.
- **Area pages** keep their routes, per-site canonicals and robots. Page intent:
  FF Party "Hire a bartender in X" (no date availability claims); FF Team "Bartending jobs in X" (sign-up and
  work journey; real job listings appear only when FireFlair has them, none in the prototype; still no
  JobPosting markup); FF Staff "Hire bar and event shift staff in X".
- **Route checks run** (preview, direct hash links, canonical and robots read from the head):

  | Link | Result |
  |---|---|
  | `#/ff-party/areas/uk/england/greater-london/westminster/mayfair` | Hire a bartender in Mayfair · canonical ffparty.uk/… · noindex, follow |
  | `#/ff-team/…/westminster/mayfair` | Bartending and hospitality jobs in Mayfair · canonical ffteam.uk/… |
  | `#/ff-staff/…/westminster/mayfair` | Hire bar and event shift staff in Mayfair · canonical ffstaff.uk/… |
  | `#/ff-party/…/southwark/dulwich-village` | redirects to `/southwark/dulwich` |
  | `#/ff-team/areas/uk/scotland/edinburgh/stockbridge` | opens |
  | `#/ff-staff/areas/uk/northern-ireland/ards-and-north-down/holywood` | opens |
  | `#/ff-party/areas/uk/england/surrey/elmbridge/cobham` | opens |

  New pages start as published, not indexed (`noindex, follow`) until approved in FF Admin, like the rest.
  **Production hosting:** the real sites need server routes for `/areas/**` on each domain (the prototype uses
  `#/ff-party/areas/…` because an artifact has one URL), a per-site sitemap of approved pages only, and
  301s for every alias path.

## 5. Directory and shared data

Directory entries (unclaimed company profiles), site images and site content are to live in a separate GitHub
repository that both the prototype and the real site read. See `docs/shared-data-repo.md`. Directory data can
sit outside the main FireFlair database and be copied across when a business owner claims their profile.

## 6. Minimum production backend work left

1. Q&A API additions listed in §3 (multi-select, typed answers, visibility, withdrawal, guest submissions with
   idempotency, company owners).
2. Profile content routes in §2, with server-side validation and the public projection.
3. Coverage: store `locations[].locId` and `coverage17.exc` with the profile and company; area matching on the
   server with the same rule.
4. Postcode lookup server-side.
5. Area page routes, sitemaps and alias redirects on the three domains.
6. Event `source` saved on every event; Shift Cards carry `rateP`/`totalP`/`paidMins` (or the current fields)
   so pay is read the same way everywhere.
