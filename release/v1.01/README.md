# FF Team v1.01 (6 Nov build)

The current prototype (v17.3.84) prepared for the developers to copy across. Built from `source/fireflair-app.jsx`; that file is not changed.

Published page: https://claude.ai/artifact/HnsNKCoFwCsXBbppQJYtQQ

- `fireflair-app.jsx`: readable source of this build (commented).
- `fireflair-team-v1.01.html`: the published page (compiled, no comments).

## Locked, as on ffteam.uk
- FF Business and FF Party: "Coming soon". FF VIP: "Coming 2027". Set in one place: `PHASE1.sitesOpen`.
- Signature cocktail builder hidden on Create (`ph17` returns 1).
- Phase 2/3 switch and FF Admin site toggles removed.

## Removed for the developers
- The "DEV · complete profile" button on the log-in sheet and the "DEV · admin preview" tags.
- All seeded demo data: the 18 default profiles (`DIRECTORY`), demo venues, companies, contacts, events, shifts, engagements, map businesses and map events are now empty lists (`[]`). The back end supplies the real lists.
- The prototype footer on the home page and the "Prototype sign-in" note on the log-in sheet.

## Also in this build
- FF Stories filter shows one "FireFlair news" chip (it was spelled two ways).
- The photo of a bartender with glasses is removed from the page.
- Business & Support is at the bottom of the Bookings page as well as on Home and People.

## Map
Map pins and the cluster use the standard FF logo (`FFEmblem`, through `MapCoin`). The cluster is hidden while the map has no pins.

## Still in the code, not shown
Unused demo helpers (for example `seedDemo17`, `DEMO_RECORDS`, `DEMO_HOST17`) are left for FF Business and FF Party, which are locked. The mock sign-in (`AUTH_ADAPTER`) accepts any FF Tag with a six-digit code until the real WhatsApp verification is connected.
