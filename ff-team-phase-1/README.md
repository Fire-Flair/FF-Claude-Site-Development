# FF Team Phase 1

**v1.6 · in development, not final.**

The Phase 1 reference for FF Team: a professional profile and networking
platform that gets hospitality and event professionals ready for bookings. It is
a separate prototype, built from the FireFlair prototype v16.15 (the
`fireflair-v*.html` files in the folder above, which are unchanged) and checked
against Griffy's frontend and backend on GitHub.

- `ff-team-phase-1-v1.6.html` — the latest prototype. One page; open it in a browser.
- Earlier versions: `ff-team-phase-1-v1.5.html`, `-v1.4.html`, `-v1.3.4.html`, `-v1.3.3.html`, `-v1.3.2.html`, `-v1.3.1.html`, `-v1.3.html`, `-v1.2.1.html`, `-v1.2.html`, `-v1.1.html`, `-final-v1.0.html`.
- `ff-team-phase-1-v1.2.1.html`, `ff-team-phase-1-v1.2.html` — earlier versions.
- `ff-team-phase-1-v1.1.html` — the previous version.
- `ff-team-phase-1-final-v1.0.html` — the first version, kept for reference
  (it was called "Phase 1 Final"; from v1.1 the name is "FF Team Phase 1").
- `AUDIT.md` — the GitHub audit: feature-by-feature comparison, what was reused,
  restored or changed, how it was tested, and the open dependencies and decisions.

Versions follow the repo's rule: point releases (v1.1, v1.2 …) for updates,
whole numbers only for an entirely new version. The highest-numbered file is
always the latest.

## What's in Phase 1

Operational:

1. **Home and sign-up** — FF AI welcome; What is FireFlair? (your first three
   steps, then "FireFlair is here to get you bookings."); FF Team; the network;
   Review Cards; Register interest for Training and for Dream jobs; a Coming
   Soon section; the sites; the map.
2. **Profile** — FF Tag + phone + WhatsApp code; Profile Card; FF AI and CV
   reading (PDF, Word .doc/.docx, photo); every section (Professions,
   Qualifications, Skills, Experience, Venues, Work locations, Languages,
   Interests, Media, Network, Reviews, Q&A); Save, Share and Publish on FF Team.
3. **Discovery** — search the network, browse Profile Cards by profession, open
   anyone's full profile, the map.
4. **Networking** — whoever invited you is in your network automatically; add
   people to your team with a review; invite people you work with; review anyone
   in your network.
5. **Getting ready for bookings** (Bookings tab) — peak-date availability,
   register for FF Party Service Cards, Training and Dream jobs.
6. **FF XP Beta 2026** — opened from the FF coin only: next steps, your tier and
   level, how FF XP works. Uses the prototype's existing XP and tier logic.

Shown as Coming Soon (nothing here can book, pay or award anything): requests
from companies and booked shifts, booking passes, Apple Wallet and Google
Wallet, FF Staff, FF Party (next to launch), FF VIP, your own Service Cards,
Cocktail Cards.

The whole boundary is the `PHASE1` object near the top of the page's script.

## How to review it

- **On claude.ai** (the published artifact): everything works, including saving
  your progress and FF AI reading a CV (the page asks once before using Claude).
- **Locally**: open the `.html` file in Chrome, Edge, Safari or Firefox. It loads
  React, Babel, the icons and the map from cdnjs / jsDelivr, so it needs an
  internet connection. Saving and FF AI need claude.ai; locally the page keeps
  your work until you reload, and CV reading falls back to simple word
  matching, which the page says on screen.
- Prototype shortcuts: any six-digit code signs you up; log in with FF Tag
  `SAM42` to see a finished profile. Every visitor arrives on Don Gee's invite
  link, so Don is already in your network.
- Check on both a phone-width and a desktop window: the FF coin sits in the
  middle of the bottom bar on phones and on the right of the top bar on desktop.

Anything that needs FireFlair Core sits behind a named adapter in the code
(`AUTH_ADAPTER`, `PROFILE_ADAPTER`, `CV_ADAPTER`, `NETWORK_ADAPTER` and others).
`AUDIT.md` §4 maps each one to Griffy's endpoint, or says it doesn't exist yet.

## Changes

### v1.6 — 17 October 2026 · in development

Visitor profile layout, smaller FF AI box, and editing tools only while editing.

**Visitor profile**
- **Pictures lead the page** (where Back used to be): every picture the person
  uploaded to Media **plus every picture on any of their cards**, in that order.
- **Phone and tablet:** the carousel stays in place behind the page and the
  Profile Card slides over it, starting about halfway down the profile
  picture. Expand / Collapse, swipe, drag, dots.
- **Desktop (900px and wider):** the Profile Card moves to the left and the
  pictures fill the right side as a mosaic (up to five tiles, "+N" for the
  rest). Click any picture to open a viewer on it.
- **Back** now sits under the Profile Card, above Add to Team / Review and Ask a
  Question. The "Book · Review · Join" row at the bottom is gone.
- **Overview:** About Me, then **Professions**, then **Professional Profile**:
  every other attribute in one carousel, fullest cards first (description,
  details, pictures, documents), with **View all attributes** kept.
- **Q&A moved to the Services tab.**

**FF AI box (every screen)**
- One tight row: microphone on the left, text (starts at one line, grows as you
  type), round send button on the right. The send button is always visible and
  switches on when there is text; it replaces the "Fill out my profile" /
  "Go" buttons underneath (the label is kept for screen readers).
- The heading and a one-line purpose sit next to the coin; long purposes are
  cut with an ellipsis. Padding and spacing are smaller throughout.

**Your own profile**
- FF AI, Have a CV?, Media and About Me show **only while editing** (and while
  first building the profile). Otherwise a **View your profile as a guest**
  card shows in their place and opens the visitor view.
- Media uploader: the Add tile is a real file picker (works where scripted
  clicks are blocked), drop pictures onto the grid, and a clearly marked
  prototype-only **Add sample pictures** button so the carousel can be tried
  without uploading. The live site needs a proper uploader (below).

**Dependencies for the live site**
- A real media uploader and storage: ordered list of pictures per profile,
  server-side resizing, moderation, and a way to attach pictures to cards.
- Everything from v1.5 still applies (team memberships, AI call, Service Cards).

### v1.5 — 17 October 2026 · in development

Visitor profile with a media carousel and four tabs, new Media and About Me
sections in the creator, and a smaller FF AI box.

**Visitor profile (Network, "view as guest")**
- Order: media carousel (only if the person uploaded pictures), the full
  Profile Card (unchanged), the three actions (Add to Team and Review side by
  side, Ask a Question full width; connected state kept), then tabs.
- Tabs: **Overview, Services (N), Teams (N), Reviews (N)** with real counts, a
  thin gold underline on the active tab, arrow-key / Home / End navigation. The
  header (carousel, card, actions) stays put when you switch tabs; carousel
  position and each tab's scroll or centre-card position are remembered.
- **Media carousel**: wide, swipe and mouse drag, dots, previous/next on
  desktop, Expand / Collapse. Uses only the person's own uploaded pictures
  (`profile.media`, plus pictures on their Media cards). Images only today.
  Omitted entirely when there are none or every image fails to load.
- **Overview**: About Me (heading, saved text, Read more / Read less, nothing
  if empty, no edit control for visitors), then **Professional Profile**: one
  horizontal carousel of square attribute cards (professions, qualifications,
  skills, experience, venues, locations, languages, interests and the rest, in
  the same tier order) with **View all attributes** opening the grouped
  browser. Cards render in chunks of 18 as you scroll, so hundreds are fine.
  Q&A appears at the bottom only if there are questions.
- **Services**: Cover Flow of real Service Cards: the FireFlair defaults the
  person registered for, plus their own cards. Centre card enlarged,
  neighbours visible; select the centre card for the full view.
- **Teams**: replaces Network. Team cards reuse the organisation card.
  Real team memberships only; see the dependency below.
- **Reviews**: Cover Flow of the real Review Cards (reviewer, stars with a text
  label, date, shift role and venue where the review is linked to a shift);
  **View all reviews** lists them.
- Empty states for Overview cards, Services, Teams and Reviews.

**Creator**
- Order: Have a CV?, **Media**, **About Me**, Professions, then the rest.
- **Media**: grid of square tiles with Add; several at a time (up to 12),
  replace, remove, move earlier/later; pictures only, 10 MB each, shrunk to
  1,600 px JPEG; busy and error states. Saved with the profile; shown in order
  on the carousel; never shown on the public page as a section.
- **About Me**: multiline, 500 characters, live counter ("245 / 500"), limit
  message, placeholder as briefed. It is the same `profile.about` field the
  public page reads (v1.4's 1,000 limit and Profile Card field are gone).
- **Help me write with FF AI**: write, improve or shorten from the person's own
  profile items and note. Never invents credentials, retries shorter if over
  500, shows an editable suggestion with Apply / Make it shorter / Reject, and
  saves only on Apply. Uses the existing `sample` capability; if it is not
  available the box says so and manual editing is unchanged.

**FF AI box**
- Shared `FFAI` is smaller everywhere (padding, coin, heading, spacing; text
  entry starts at two rows and grows); new `compact` prop; mic and styling kept.

**Dependencies for the live site**
- Team memberships need a data source (`person.teams`); today only "Your team"
  (someone you added) is real.
- Media needs file storage; today pictures live in the profile state.
- AI writing needs a server-side model call with the same prompt rules.
- Service Cards per person need a stored list; today it is the registered
  interest list and the seeded own-card examples.

### v1.4 — 16 October 2026 · in development

Biography / Introduction, and a redesigned public profile.

**Profile Card Creator (the only change there)**
- New **Biography / Introduction** field: multiline, 1,000 characters,
  visible counter ("245 / 1,000"), leading space dropped as you type, text
  trimmed when you leave the field and on save. The limit is enforced by the
  field, on paste, and again in the store (`PROFILE` patch).
- It is the profile's existing `about` text (`state.profile.about`): no new
  data store, no schema change. It saves, survives reload, and is what other
  people see. The Biography section on your own profile edits the same field.
- CV import no longer writes a biography (it used to fill an empty one);
  the biography is only ever the person's own words.

**Public profile (what a visitor sees from Network, and "view as guest")**
- Centred intro first: photo with tier ring, name, headline (main profession,
  then up to two more), location, rating/years where present, FF Tag, then the
  biography (compact; "Read more" past about six lines), then Add to team /
  Review / Ask a question. Nothing is shown for fields that are empty, and an
  empty biography leaves no panel.
- Content sits in a centred container (max 1,040 px). Hybrid layout, in the
  reading order: Professions and featured work, Qualifications, Skills,
  Experience, Work locations, Languages, Interests, anything else, then
  Network, Reviews, Q&A (always last).
  - Professions: medium cards. Experience: medium-wide with room for
    employer, role, dates and a short description. Qualifications: compact
    document cards (issuer, Doc badge; Verified only when the record is
    actually verified, so CV imports are never shown verified). Skills,
    Languages (with flags), Interests, Locations: compact chips.
  - Cards are about 25-45 percent smaller than before depending on type,
    laid out in a responsive grid (auto-fit, no fixed column count). Network
    and Reviews rows are scaled to match.
- Tiers come from the saved `rank` on each card: gold, silver (two at most),
  bronze, in the order set while editing. Finish never implies verification.
- Tap or press Enter on a card to open its full details (the existing
  read-only card dialog). Dialogs now have `aria-modal`, move focus in, keep
  Tab inside, close on Escape and return focus. Hover and pressed states on
  cards; reduced-motion respected.
- No editing controls, tick boxes or drag handles on a public profile.
- Own profile, editing, CV upload, Network list, Bookings and Home are unchanged.

For Griffy: no schema or API change beyond making sure the biography is
saved as the profile's existing text field, capped at 1,000 characters on
the server as well.

Tested: journeys 88/88, features 26/26, CV import 9/9, drag 16/16, SEO 32/32,
work locations 17/17, new biography and public view 24/24, visitor view of a
full profile 14/14 (phone, iPad and desktop widths, no horizontal overflow,
keyboard open and close), no page errors.

### v1.3.4 — 16 October 2026 · in development

Work locations (profile) gets its explanation back, and a postcode step.

- **"Where you work" box** at the top of the Work locations section (same gold
  box style as Pick your professions). It explains why to list more than one
  place: it is for Google, so list the large towns you live in, work in, work
  around and would like to work in; the more you list, the more searchable the
  profile becomes. It also says the Primary location is used to calculate
  travel distances for jobs, always measured from it, so a postcode is
  recommended. The same wording is in the Add work locations sheet.
- **Postcode step (FF AI):** enter a postcode, "Find my area" gives the
  primary location (editable) plus large towns nearby and some further
  afield (e.g. HP4 → Berkhamsted; St Albans, Aylesbury, Hemel Hempstead;
  London, Central London, Birmingham). Each can be switched off; one tap adds
  them. The area becomes the Primary location (an earlier primary moves to
  Secondary). Only Primary and two Secondary show on the Profile Card; all of
  them count for search.
- **The postcode stays private:** saved as `workPostcode`, shown only as
  "HP4 •••" on your own profile, never on the card or public profile.
  Change postcode and Add more locations stay available, with no limit on
  how many locations are added.
- The postcode → area lookup is a built-in table of UK postcode areas.
  For Griffy: use a postcode lookup service plus the existing Google Places
  search, and keep the full postcode server-side for distance calculations.

Tested: journeys 88/88, features 26/26, CV import 9/9, drag 16/16, SEO 32/32,
new work-locations check 17/17, no page errors.

### v1.3.3 — 16 October 2026 · in development

- **FF Team is for everyone**: "Are you a freelancer or a business?" now says
  FF Team is for everyone in hospitality — freelancers and the people who work
  in and run businesses — and everyone starts with an FF Team page. FF Staff
  shows "Notify me": signed in, it puts you on the list (`staffNotify`);
  signed out, it takes you to create your FF Team page first. FF Staff is
  "where we help you find staff and support your business in every way
  possible". The FF Team label and site-selector line say "For everyone in
  hospitality".
- **Desktop menu**: no divider to the right of the FF coin.
- **Base coin**: white and stencilled (colourless), no longer silver-looking.
- **FF XP pop-up**: a new FF Rewards part at the foot — verification helps you
  get bookings; rewards are coming — with Register interest, which goes to the
  rewards on Home. The pop-up scrolls.
- **Home, at the bottom**: FF XP (how you earn it: Build, Share, Grow; the
  verification ladder Base → Bronze 5 connections → Silver 20 → Gold locked)
  and **FF XP Rewards**, in the Dream jobs / Training style: eight rewards —
  international bar shows with flights and hotel (Lisbon Bar Show, Perfect
  Serve Amsterdam, Athens Bar Show, Bar Convent Berlin), free training tickets,
  American Express Gold business card, FF NFC business card, Barfly cocktail
  equipment, car rental, the FF January Christmas party, a professional
  photoshoot — plus "What reward would help you most?" with suggestions, and
  Register interest (`rewardsInterest`). Nothing is awarded.

### v1.3.2 — 16 October 2026 · in development

The screen after Save (Welcome to the Team):

- No "Publish on FF Team" button (Publish is beside Save) and no Add FF button.
- A name is optional: with no name, the card shows the FF Tag.
- No profile picture yet: "You don't have a profile picture yet. Add one now"
  with Add photo — the picture goes straight onto the card (`P1PhotoPrompt`).
- Underneath, only Share (WhatsApp, works) and, side by side below it, Add to
  Apple Wallet and Add to Google Wallet (locked, coming soon).

### v1.3.1 — 16 October 2026 · in development

- **FF AI looks the same everywhere**: the gold gradient from the Profile page's
  FF AI is now on every FF AI box (Home, Network, Bookings) — `FFAI` defaults
  to `tint`.
- **Network quick searches** under FF AI, like Bookings and Home: the three most
  common professions and the three most common locations in the network
  (`networkQuickSearches`). One tap searches for it.
- **Desktop FF coin** moved to the right of Profile in the top menu. Phones
  unchanged.

### v1.3 — 16 October 2026 · in development

Placing cards, simplified (replaces v1.2's Edit Profile draft):

- **Drag the whole card**: no handle. Mouse: press and drag. Touchscreen: press
  and hold, then drag (a quick swipe still scrolls the row). A quick tap opens
  the card to edit, hide or delete it. Arrow keys on a focused card: ← → reorder,
  ↑ ↓ change tier.
- **Primary, Secondary, Tertiary** only — the colours stay (gold, silver,
  bronze finishes) but the words and the counts are gone. One short line of help:
  "Drag and drop cards to place them. Primary attributes always show on your
  Profile Card, followed by secondary where possible. Tertiary stay on your
  profile page."
- **No tick boxes**: everything FF AI finds goes straight onto the profile.
- **Tier guesses**: new cards (from a CV, FF AI or added by hand, professions
  included) fill Primary first, then Secondary's two places, then Tertiary;
  CV items with higher confidence go first. A third Secondary card moves the last
  one down to Tertiary, and says so.
- **Always editing while you build**: no Edit Profile button until the first
  Save. After that, Edit profile appears on your own profile.
- **One save**: no Save Changes bar. Save in Save & Publish saves and ends
  editing; when editing a saved profile, Save & Publish appears at the foot.
- Changes apply to the profile as you make them (saved with it, as before);
  ranks are stored on each card as `rank`.

FF XP Beta 2026:

- **XP isn't live in version 1** (`PHASE1.xpLive: false`): no XP amounts anywhere.
- **Desktop**: the FF coin sits in the middle of the menu, between Network and
  Bookings. Phones unchanged (coin centred in the bottom bar).
- **The pop-up**: three next steps (Build your profile, Share your Profile Card,
  Grow your network); **Verification levels** from network connections — Base
  (a new greyed-out coin) to start, Bronze at 5 connections, Silver at 20, Gold
  locked for now; then "FF XP · Coming soon: XP is rewarded for building, sharing
  and growing your profile. The more connections you have, the more XP you're
  rewarded, and the more your verification level grows." No rewards listed.
- The profile's pill shows your verification level.

### v1.2.1 — 16 October 2026 · in development

- **Are you a freelancer or a business?** v16.15's box is back on Home, straight
  under What is FireFlair?. FF Team (freelancers) opens the profile; FF Staff
  (businesses) shows Coming soon and can't be entered yet. Copy: "If you're a
  business, FireFlair is here to connect you with the people you want to find —
  that's FF Staff, coming soon." Component `P1WhoAreYou`, reusing v16.15's
  `.ff-whoami` styles.

### v1.2 — 16 October 2026 · in development

From Alex's notes after reviewing v1.1, and the brief "FireFlair Team — Profile
Edit Mode, Card Hierarchy & CV Import Workflow". Same artifact, updated in
place. Details and what the live site needs in `AUDIT.md` §8.

- **Home**: Dream jobs now sits above Training (and in the jump links).
- **Bookings**: the green WhatsApp panel is back ("Requests come to you on
  WhatsApp"), and Requests from companies carries the WhatsApp mark.
- **Profile sections**: on your own profile every section starts closed except
  Professions. Network starts open when someone invited you, with them first.
- **Q&A**: one rounded panel with rounded Question Cards, To answer / Answered
  tabs and round legend dots. Questions people ask from Network ("Ask a
  question" on a profile) appear on that person's profile with "Asked by …" and
  the date. Your own Q&A has "Asked on your profile" first (in this preview, a
  question from whoever invited you), which you answer like any Question Card.
- **Save & Publish** (was Save & Share): Save, and Publish (saves and publishes
  on FF Team in one step). Share moved down beside the wallets.
- **Share and wallets**: one stack — Share (WhatsApp), then Add to Apple Wallet
  and Add to Google Wallet, all the same size and shape. The wallets are locked
  ("Soon") and make nothing.
- **Your finished profile**: no Book · Review · Join on your own page (visitors
  still see them); Edit card straight under the card; Share is in the wallet
  section.
- **Profile Card**: under the main profession, a symbol for each of your top
  three professions (martini, flame, clipboard and so on), the brand diamond
  between them, and the car when you drive.
- **Edit Profile** (new): an Edit profile button on your profile. In Edit Profile
  each section shows three lanes — Primary (gold), Secondary (silver, two at
  most) and Tertiary (bronze). Every card has a keep checkbox, a Move menu and a
  drag handle (mouse, touch, or arrow keys). A third Secondary card asks which
  one moves down. One Save Changes at the foot of the screen saves everything;
  a failed save keeps your changes; leaving with changes asks first.
- **Tiers in normal view**: cards show gold first, then up to two silver, then
  bronze. The numbered arrows under cards are gone.
- **CV and FF AI import**: no review screen. What FF AI finds goes straight onto
  the profile, in Edit Profile, marked From CV (or New), ticked; name, About and
  photo are offered at the top. Nothing is added until Save Changes; Cancel
  discards it. Imported qualifications aren't marked verified.

### v1.1 — 16 October 2026 · in development

Refinement of v1.0 from Alex's "FF Team Phase 1 v1.1" brief. Same artifact,
updated in place. Details in `AUDIT.md` §7.

- **Name**: "FF Team Phase 1", v1.1, in development. "Final" removed everywhere.
- **What is FireFlair?**: one container, no gold gradient on cream. Part A, "Your
  first three steps": Build your profile, Grow your network, Take reviews (no
  Phase labels). Part B, straight below: "FireFlair is here to get you
  bookings." with the Profile Card copy and the FF Party jobs line. No
  guarantees of bookings or jobs.
- **Work locations**: the guidance text is only inside Add location now; the
  profile page shows the locations themselves. Venues stay a separate section.
- **Professions**: "Pick your professions" stays; the separate Add profession
  square is gone. Typing a profession still creates its card.
- **Training and Dream jobs**: Register interest is back on Home and on Bookings
  (the v16.15 sections, unchanged).
- **FF XP**: the Coming Soon bar at the bottom and the XP screen are gone. The FF
  coin opens one pop-up, "FF XP Beta 2026": Next steps, Your tier and level,
  How FF XP works. Points and tiers use the existing logic (10 XP a step, 1 XP a
  Question Card, Bronze 100, Silver 500, Gold for each quarter's top
  performers). Steps a viewer completed in v1.0 are credited once, on first
  load.
- **Site selector**: FF Team, FF Staff (Coming soon), FF Party (Coming soon,
  next to launch), FF VIP (Coming soon), in that order.
- **Save & Share**: the 05 marker stays; the line now stops above and below it.
  The three dashes are replaced by one gradient line that runs on down the page.
  Beneath it, "Your complete card will display here", with Add to Apple Wallet
  and Add to Google Wallet as locked Coming Soon cards (they are not buttons and
  make no pass). Once the profile is saved, Welcome to the Team takes its place
  with the finished card, as before.
- **Bookings**: rebuilt from the Home page's cards. "Your bookings" (requests,
  booked shifts, booking passes) is a Coming Soon panel; "Available now" holds
  FF Party Service Cards registration, Availability (the existing peak-dates
  list, no calendar), Training and Dream jobs.
- **Coming Soon cards**: one card style everywhere (icon, title, a line of
  text, a small lock label), grouped in one container.
- **Desktop**: FF coin stays on the right; the Add FF button is hidden
  (`PHASE1.desktopAdd`). Phone layout unchanged, coin centred.

### v1.0 — 16 October 2026

First version, "FF Team Phase 1 Final". See `AUDIT.md` §3 for every change from
v16.15.
