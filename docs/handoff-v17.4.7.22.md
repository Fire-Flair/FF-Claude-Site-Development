# v17.4.7.22 — FF Partners, Phase 3 (handoff)

FF Partners is the fourth site in Phase 3 only. It is a prototype: nothing here talks to a server. This note carries no prices by repository rule.

## What changed
- New `src/state/partners17.js` (data, local store, one visibility resolver, brief enquiries, FF Party handoff) and `src/components/partners/partners-site.jsx` (home, People, Bookings, Profile, guest page, sheets). Styles in `src/styles/partners.css`.
- Site list (`phase-config.js`, `landing-and-sites.jsx`): order FF Team, FF Staff, FF Party, FF Partners, FF VIP from every site. Phase 2 does not list Partners; a Phase 2 switch from Partners or a Phase 2 deep link takes the safe path to FF Team with a toast.
- Discover hub gains four Partners entries. Shift hiring routes to FF Staff.
- Two Stories guides (P30, P31) under `stories/ffparty/`; other sites' lists are unchanged.
- SEO: Partners screens and local previews are noindex. Analytics uses existing event patterns and never carries brief text.

## Data rules
- One resolver (`ptnResolve`) returns ok, missing or paused. Guest pages and the discovery list read only the public view (`ptnPublicView`): private address, access instructions and team notes never reach discovery, share URLs, share cards or exports.
- Public properties are listed. Link-only properties open by link only. Drafts open only for their owner, as a Preview.
- A brief is an enquiry (`ptnAddBrief`, stage "review", marked local). It is not a booking, shift or invoice, and not stored in `specialReq17`.
- Only UK places show "Book this experience". Other places, Italy included, show "Request an experience", a labelled enquiry.

## Handoff to FF Party (audit)
- `ptnHandoff` binds the FF Party basket (`bk17.evId`) to its own unsent draft event, found again through `event.partnerRef`. Repeat taps, refresh and Back reuse that draft or open a new one cleanly; they never touch another event. The deposit stays in the FF Party flow.

## Production dependencies
- Core: partner accounts, owner records, role and permission checks.
- MongoDB: partner, property, brief and link collections with server-side visibility (public, link only, draft, paused).
- Link resolution across devices: guest links currently resolve from this browser's storage only.
- Partner-record API: create, edit, publish, pause, delete; returns the public view only.
- Payments: none for Partners itself; FF Party deposits use the existing flow.
- Messaging: confirmation and reply to a brief (nothing is sent today, and the UI says so).
- Photos: Partners reuses the FF Party coin; no new brand asset.

## Preview limits
- Partners data lives in browser localStorage (`ff.partners.v1`) and is honest about it in the UI. FF Party events are in memory and do not survive a refresh.
- iPad and Safari were checked at simulated viewports only, not on a device.
- The share card image maker needs its CDN script; it was not exercised offline.
