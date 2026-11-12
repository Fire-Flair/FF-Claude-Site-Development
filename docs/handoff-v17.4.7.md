# v17.4.7 — package catalogue and deposit function (handoff)

Stage 1 of the package system. The spec figures live in code only (`src/state/package-catalogue17.js`); this note carries no prices by repository rule.

## What changed
- New `src/state/package-catalogue17.js`, loaded before `utils/pay17.js`. Exposes `PKG_CAT17`, `PKG_BY17`, `pkgServices17()` (a fresh array per caller), `pkgPayPence17`, `pkgPriceLabel17`, `pkgPayLabel17`, `partyDeposit17`, `PKG_MAX_BASE17`.
- `home/images-and-scenes.jsx` and `party/services.jsx`: both `PARTY_SERVICES` arrays now come from the catalogue (separate instances, so admin hiding on one does not leak into the other). `home/staff-party-home.jsx`: the splice and override of the list were removed.
- `party/delivery-and-extras.jsx`: `PAY17` and `TIME17` are derived from the catalogue. FF Team tiles show the derived pay and the catalogue duration.
- `party/packages-browse.jsx`: `FEATS17` comes from the catalogue's three selling points. `party/booking-flow.jsx`: `SVC_ROLE` from the catalogue.
- `home/package-pages.jsx` and `content/packages/package-page-order.json`: pop-up and page text from the catalogue; order is by price.
- Deposit: `partyDeposit17(state, shifts)` is used by checkout (`terms-and-packages.jsx`), the FireFlair invoice and snapshot and paid records (`booking-flow.jsx`), and the refund row (`staff/autofill.jsx`). Shifts flagged `addOn` never count. Phase 2 caps the base-package count at one (`PKG_MAX_BASE17`); lifting the cap is one constant.
- "Booking charge" wording replaced by "booking deposit" on FF Party screens and in the cancelled-professional messages (FF Staff keeps its own wording).

## Compatibility
- No ids renamed. Saved shifts keep their stored price strings; new shifts take the catalogue price at the time they are added. The invoice still reads the stored string, so confirmed bookings are not rewritten.

## Known gaps (later stages)
- Shifts still carry price as a display string; integer-pennies snapshot fields (`pricePence`) are to be added with the add-on work.
- Staffing Add-on cards, per-professional requests and tips, Gold Special Request Card, FF Staff Tastings & Consultations.
- Standalone Staffing Package duration shows the catalogue value on both FF Party and FF Team; confirm it is the one wanted.
- `svc_full` is still mapped to bartender registration in `orderPeople17` and the booking basket; to be replaced by the business interest route.
- The booking screen still lets more than one package onto an Event Card; the deposit is capped at one base package, but the screen itself is not yet restricted.
