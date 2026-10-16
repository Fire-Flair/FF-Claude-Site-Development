# FF Team Phase 1

**v1.2 · in development, not final.**

The Phase 1 reference for FF Team: a professional profile and networking
platform that gets hospitality and event professionals ready for bookings. It is
a separate prototype, built from the FireFlair prototype v16.15 (the
`fireflair-v*.html` files in the folder above, which are unchanged) and checked
against Griffy's frontend and backend on GitHub.

- `ff-team-phase-1-v1.2.html` — the latest prototype. One page; open it in a browser.
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
