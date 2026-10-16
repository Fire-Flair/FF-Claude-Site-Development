# FF Team Phase 1 Final

The definitive Phase 1 reference for FF Team: a professional profile and
networking platform. It is a separate prototype, built from the FireFlair
prototype v16.15 (the `fireflair-v*.html` files in the folder above, which
are unchanged) and checked against Griffy's frontend and backend on GitHub.

- `ff-team-phase-1-final-v1.0.html` — the prototype. One page; open it in a browser.
- `AUDIT.md` — the GitHub audit: feature-by-feature comparison, what was reused,
  restored or changed, how it was tested, and the open dependencies and decisions.

Versions follow the repo's rule: point releases (v1.1, v1.2 …) for updates,
whole numbers only for an entirely new version.

## What's in Phase 1

Operational:

1. **Home and sign-up** — FF AI welcome, what FireFlair is, FF Team, the network, Review Cards, a locked Coming Soon row, the map.
2. **Profile** — FF Tag + phone + WhatsApp code; Profile Card; FF AI and CV reading (PDF, Word .doc/.docx, photo); every section (Professions, Qualifications, Skills, Experience, Venues, Work locations, Languages, Interests, Media, Network, Reviews, Q&A); Save, Share and Publish on FF Team.
3. **Discovery** — search the network, browse Profile Cards by profession, open anyone's full profile, the map.
4. **Networking** — whoever invited you is in your network automatically; add people to your team with a review; invite people you work with; review anyone in your network.

Reachable but Coming Soon (nothing here can book, pay or award anything):
FireFlair XP (its own screen), Bookings, FF Party, FF VIP, Service Cards,
Training, Dream jobs, Cocktail Cards. FF Staff stays in the code but isn't offered.

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

Anything that needs FireFlair Core sits behind a named adapter in the code
(`AUTH_ADAPTER`, `PROFILE_ADAPTER`, `CV_ADAPTER`, `NETWORK_ADAPTER` and others).
`AUDIT.md` §4 maps each one to Griffy's endpoint, or says it doesn't exist yet.

## Changes

### v1.0 — 16 October 2026

First version. See `AUDIT.md` §3 for every change from v16.15.
