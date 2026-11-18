# FireFlair v17.5 — Phase 2 Final: hand-off notes

v17.5 is the Phase 2 build: the prototype stripped to what goes live in Phase 2, plus the front-end pieces for every row of the
Phase 2 timeline. Phase 3 (FF Partners, the phase switch, FF Admin, custom packages and add-ons) stays on `main`. This branch is
`phase-2-final`. Build and check it as before (`docs/DEVELOPING.md`); every address is listed in `docs/URLS.md`.

The prototype keeps its data in one store. Each piece below names the reducer actions and state keys the back end replaces. The
records keep the same shape in Core; the prototype only stands in for the service.

## What was removed

- FF Partners: the site, its state (`partners17.js`), styles, Stories and SEO entries.
- The FF Admin item and the Phase 2 / Phase 3 switch in the site menu. `ph17` no longer reads state. The admin panel code is still in
  `src/components/admin/` because shared helpers use it; nothing opens it.
- Custom packages and add-ons in bookings, the Stories builder, cocktail-menu add-ons on bookings and Special Request.
- The site menu is FF Team, FF Staff, FF Party, FF VIP. The page and share title is "FireFlair Phase 2".

## What is locked

- **FF VIP**: in the menu, locked as in the Phase Two artifact (`VIP_LOCKED21`, `VipLockBtn21`).
- **FF Party is display only.** Home, Browse, profiles, company pages, area pages, package pages and Stories work. Everything that
  would start a booking or the host profile is the same button, dimmed, with a small lock, `aria-disabled`, and does nothing:
  the Book and Party tabs, Book now, Book this person, Add to booking, Plan your event, Create your VIP Host Card, deposit and checkout.
  One helper does this: `LockedBtn17` in `src/components/shared/locked17.jsx` (`PARTY_LOCKED_TABS17`, `PARTY_LOCKED_ROUTES17`).
  The Book and Party tabs cannot be reached by a click, an address or a notification (`questions-and-dates.jsx` and `vip-site.jsx`
  send them to Home).
- **Card builders** (Signature cocktails, Service Cards) on FF Team and FF Staff work and save as before, with a small lock and
  "Coming soon" beside the title (`SoonTitle17` in `card-studio.jsx`). What they save is not shown on any public view
  (`PkgExtras17`; `coCards17(state, co, true)` returns nothing for your own company).

## New front-end pieces, by timeline row

### FF Team — Networks page
- Search covers people, then Companies, then the FF Event Directory, each in its own group; the map shows only the results while a
  search is on. `netSearch17`, `coSearchText17`, `NetQ17` in `src/components/staff/network-directory.jsx` (used on all three sites).
- Add a person or a company to your network: `NET_TOGGLE` → `netAdds17`. Adding a company also writes
  `coNetNotes17` ("<Name> added you to their network").

### FF Team — Public profile
- Q&A has three categories with a chip filter wherever it is listed: About me, Asked, Interests (`QaFilter17`, `QA_CATS17`,
  `publicQaItems17` in `src/components/team/qa17.jsx` and `profile-marks-qa.jsx`). Feedback questions stay private and outside the filter.
- Public / Private on every answer (`VisSwitch17`). Default Private; Interests default Public.
  Action `QA_VIS` (`qid`, `visibility`) → `profile.qaVis17[qid]`, or `visibility` on your own question.
  `ANSWER` also takes `visibility`.
- Own questions: create with Yes / No and a type box (`MY_QUESTION_ADD`, now with `visibility`), edit with the pencil
  (`MY_QUESTION_EDIT`: `id`, `text`), delete as before (`MY_QUESTION_DELETE`).
- "I'm interested" (Training, Dream jobs, Rewards, package sign-ups) shows as "Interested in <thing>?" = Yes in Interests.
  Nothing new is stored: the cards are read from the saved `int.*` answers (`interestCards17`, `INT_QIDS17`).
- Add to network, Add to team, Ask a question, Availability, Review and the green Share button are unchanged.

### FF Team — Company card view
- Details, Add to network, Ask a question, Review, Join team.
- A question asked on a company page is a profile question with `companyKey`; the company answers it (`COQ_ANSWER`: `id`, `value`,
  `visibility`). Answered public ones show in the company's Q&A.
- A review posted on a company page is stored with `aboutId` = the company and shows first on its Reviews tab. It is credited to the
  person who wrote it (the company name is used only when a signed-in FF Staff business writes it).
- Join team → `CT_REQUEST` → `coTeams17` (`dir: "request"`), answered by the company (`CT_DECIDE`, `accept`).
  `myCoKeys17` and `coKey17` in `src/state/co-teams17.js` tie a Directory entry and the signed-in business to one key.

### FF Team — Bookings
- Current and History as before. A shift the business deleted shows "Cancelled by the business" (engagement state `cancelled_biz`).
- Build your career: "I'm interested" saves the `int.*` answer that feeds Interests above.

### FF Staff — Network
- Tapping a person opens the pop-up with Add to network, Add to team, Add to favourites, Share and View profile.
- Favourites: `FAV_TOGGLE` → `favs`. Listed only for the signed-in owner in a private Favourites section on Your business
  (`CompanyFavs17` in `company-cards.jsx`), collapsed by default, with remove. Never on the public company page.
- On Our people the business sees its own Company Card once (its Directory entry is left out of Top companies).

### FF Staff — Bookings
- Event Card, Shift Cards, choose staff, payment sheet as before. After payment the FF invoice no longer says
  "Beta: no payment taken".
- Autofill is one checkbox per booking, ticked by default: `AF_CHECKBOX` (`eventId`, `on`) → `event.afOff` (true when unticked).
  Helpers `afOn17`, `afRoute17`, `afBackup17` in `src/components/staff/autofill.jsx`. It replaces `AF_ROUTE`, `AF_BACKUP`,
  `shift.route` and `shift.afBackup`.
- Under a shift, "Autofill · N invited" lists everyone Autofill sent the shift to, with a live status (Waiting, Available,
  Unavailable, Wants to discuss), collapsed by default (`InvitedList17`, `INV_STATUS17`). The business chooses from those
  Available (`AF_PICK`).
- Before a professional accepts: "Cancel request & refund" as before. After: no refund; a small "Delete booking" link at the bottom
  with the confirm text "Are you sure? This will affect your reputation. If you wish to get a refund, please contact MrG@FFVip.uk."
  and Delete booking / Keep booking. `BOOKING_DELETE` (`eventId`): the event gets `deletedAt` and moves to History marked Deleted;
  open and confirmed engagements become `cancelled_biz`; running Autofill stops; each confirmed professional is told. No refund is
  issued by this action.
- Prototype controls stay, with "<Name> declines" and "+24 hours" for a chosen person.

### FF Staff — Your business
- Join with a phone number and WhatsApp code, Company Card, Describe your business with FF AI "Propose my profile", the company page,
  Save & Share. Builders carry the Coming soon lock (above). Favourites sit here (above).

### FF Staff — FF AI
- "Fill in my cards" turns a typed or spoken brief into the Event Card and Shift Cards, as before.

### FF Party set-up
- Display only (see What is locked). Browse uses the same search groups and map filtering as FF Team.

## Notifications

All sites: a notification that has been dealt with does not vanish. It greys out under the active ones, shows its outcome
("Accepted", "Declined", "Answered: Yes", "Chosen", "Seen"), has no reply buttons, and stays until Clear or seven days. The badge
counts active ones only.

- `notesWatch17` wraps the reducer: any row that was active before an action and is not after it is kept in `notesDone17`
  (`{ id, acct, kind, title, sub, outcome, at }`, one list per account and site). `NOTES_SEEN` stamps the list as opened.
  `NOTES_CLEAR` removes the greyed rows. All in `src/state/notes17.js`.
- In Core the outcome and decision time live on the notification row; rows are dropped seven days after they were decided.

Who is told what:

| Event | Who is told | Row |
|---|---|---|
| A shift is offered or you are chosen | the professional (FF Team) | Open shift / You've been selected |
| Availability asked | the professional | Are you available? |
| Team invitation (person or company) | the person invited | Team invitation / Company team invitation |
| Question on your profile | the profile owner | Question for you |
| Question on a company page | the company owner (FF Staff) | Question for your company |
| Someone adds a company to their network | the company owner | "<Name> added you to their network" (greys when the list is opened) |
| Join team request | the company owner | Asks to join your team (Accept / Decline) |
| A professional says Available (Autofill or chosen) | the business | "<Name> is available" (one per person) |
| The chosen professional is unavailable or does not reply in time | the business | "<Name> is unavailable" / "<Name> didn't reply" |
| A professional confirms | the business | "<Name> confirmed" (news: greys once seen) |
| Autofill invitee declines | nobody | — |
| The business deletes a confirmed booking | each confirmed professional | the shift shows "Cancelled by the business" |

## Autofill rules as built

- One checkbox per booking, ticked by default.
- Ticked, nobody chosen: Autofill starts as soon as the booking is paid.
- Ticked, someone chosen: that person is held for 24 hours. If they decline or 24 hours pass, Autofill starts.
- Unticked: only the chosen person is asked. If they decline, the business is told and nothing else happens.
- Autofill invites up to ten nearby professionals who match, in batches; they reply within the batch window. The business chooses one
  from those who are Available. "To be found" shifts always use Autofill.
- No Autofill after the booking is deleted or after the shift has started.

## Addresses

`src/utils/routes17.js` (`Routes17`, `rt17Parse`, `rt17Href`, `rt17Target`, `rt17Apply`) gives every page an address on all three
sites. The full map, canonical rules, redirects and the test list are in `docs/URLS.md`. Home sections now use
`#/<site>/home/<section>`.

## Last pass (merged live update, directory addresses, Back, canonicals, Vooshka, fresh companies)

### FF Team Bookings (merged from the live page)
- Heading `BigHead20` "FF Bookings". Invitations show only for the demo account (`demo && requests.length`).
- Packages: tiles are a selection (`sel`, `picked`); Confirm opens `PkgTerms17` (the personal terms, read-only, "Accept and confirm"), and accepting runs
  `confirmPkgs`, the same `int.party_package` answer as before, `visibility: "public"` (Interests). Packages stay above FF Staff Shifts.
- Rates: `ProfRateTile17` is controlled by `ProfRates17` (`val`, `onVal`, `err`); one "Save your rates" button (`ff-bkconfirm17`) saves every edited rate
  (`rate_gbp_hour` answers) and withdraws an emptied one.
- Profile builder Save row: two equal columns; "Available for hire" is the outline `hire17` button.

### Directory addresses
- Every company has one stable address word from `rt17SlugMap()` (`src/utils/routes17.js`); `rt17Slug(co)` reads it. Directory entries open at
  `#/<site>/<slug>` and load, refresh, Back and Forward work. They have no tabs. `rt17Resolve` finds claimed companies and Directory entries
  (`browseCompanies17`). `rt17DirSlugTaken` stops a new company taking a Directory slug (`-co`).
- The Company Card footer shows the address for unclaimed entries again; the hire-list tile shows the same address.
- No true duplicates in the directory data. "Pure Photo N.I" and "EPIC Caterers" each have two base locations, so they show two map pins.

### Back
- Each tab click is a history step. `rt17Back(fallback)` (`routes17.js`) calls `history.back()` when the app has pushed history (every entry carries `ff17i`,
  added by a small `pushState`/`replaceState` wrapper), otherwise `fallback` (the parent list or home). `BackBtn17` (`src/components/shared/back17.jsx`)
  is the profile-style button, now on the Story article; profile, company, Directory company, area page and package page use the same call.

### Indexing and canonicals
- `seo.js`: `ffSeoOrigin17(state)` gives the site's own host (`FF_SEO.siteOrigins`); the canonical of a profile, company or Directory entry is that host plus path.
  The site-based `noindex` is removed. `FF_SEO.demoData` still makes the whole prototype `noindex`. Share links still use `FF_SEO.profileOrigin` (ffparty.uk).
  `window.__ffSeo.selfTest()` checks the production rules for all four site views.

### Vooshka Cocktail Bar
- Based in Luton: `base17` (card subtitle), one `locations` entry (map pin). Coverage is `cover: ["England", "Wales"]` on the company; `fdCompanyCover` in
  `find-directory.jsx` turns it into the two nations, so every English and Welsh area page lists it and no Scottish or Northern Irish page does. Areas covered reads "England and Wales".

### Fresh companies start empty
- The sample events, shifts, engagements and Autofill runs are the demo accounts' sample bookings. Joining a company with a new phone number dispatches
  `SAMPLE_OFF` (clears them, `sampleOff17`); signing in as the dev Vooshka company or SAM42 / ALEXG puts them back (`sample17Pre` in `src/state/notes17.js`).
  `coIsVk17` is true only for the `vooshka` company or the signed-out preview, so a joined company gets no sample cards either.

## Known gaps for the developers

- The sample company Vooshka still shows its own Packages and Cocktails on its public page. These come from its company content file,
  not from the builders.
- On FF Team the dev account still sees its own Company Card next to the Vooshka Directory tile (the dev account is both the person
  and the business). Only FF Staff hides the duplicate.
- Opening an unknown address (for example `#/ff-party/zzqqxx`) while an area page is open lands on the site's Network tab instead of Home the first time
  (the area router closes its page and the address follows the old tab before the address router reads the new one). A second load goes to Home. It was
  there before the last pass.
