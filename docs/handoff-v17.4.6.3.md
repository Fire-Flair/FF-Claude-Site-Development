# Handoff — v17.4.6.3 (Phase 3 prototype)

Follows `handoff-v17.4.6.1.md`. Source in `src/`; `npm run check`, `npm run build`, `npm run publish-build`.

## FF Team: Where are you based?
- The editable Profile Card has a **Where are you based?** field (`BaseField17`, `src/components/shared/base17.jsx`) under the professions. The postcode goes through `LOCATION_ADAPTER.lookupPostcode`; the result is a single-choice list of catalogue places (nothing preselected). If the lookup fails, or the person prefers, a catalogue search offers the same single-choice list.
- Stored as `profile.base17 = { locId }` (stable catalogue id), separate from coverage. The label is derived from the location tree (`baseLabelOf17`): place plus nearest useful parent ("Berkhamsted, Hertfordshire"; "Newport, Wales" and "Newport, Isle of Wight" stay distinct). The rendered Profile Card shows it as **Based in** wherever the card renders (`meAsStaff().base`).
- The postcode and its coordinates are private: `state.workPostcode = { code, lat, lng, approx, baseId }`, never inside `profile`, a card, a page or a public payload. Production keeps them in the private account record and calls the lookup server-side.
- **Travel distance** reads the base through one path: `baseOrigin17` / `baseDistanceKm17` (private postcode point when it belongs to the base, otherwise the place centre). Distances shown to businesses should call this on the server with the stored origin.
- Changing the base only writes `base17` (and replaces the private postcode). Saved coverage and search eligibility are untouched until coverage is edited.
- Older profiles: `baseMigrate17` sets the base once from the saved postcode area when it names a catalogue place. It writes only `base17`; location records and `coverage17` are unchanged.

## FF Team: What areas do you cover?
- Same heading in the Work locations dropdown. A short **Suggested areas** list (the base, its parent, nearby places) sits above the tick-box tree and uses the same tick boxes and partly-selected states, so both surfaces read and write the same coverage. Suggestions start unticked unless already covered; picking a base never ticks anything. The postcode box left the tree (it moved to the card).

## FF Team: remote work
- **Available for remote work** is a checkbox in each profession's card editor, stored as `remote` on the profession record through the existing record patch path. It is independent of coverage and shows as a small Remote mark on that profession's card.
- Assumption: offered on every profession rather than a curated subset. Say if a shorter list is wanted.

## FF Team Bookings
- FF Staff Shifts profession cards are matte forest green (flat fill, no sheen), deepened from the card-creator green so the rate input, labels and small text stay readable (lowest text contrast 9.3:1). FF Party Packages keep their red and their buttons unchanged.
- Rate field label is unchanged; the helper line reads exactly "Shown to businesses on FF Staff only". Validation, Q&A storage (`rate.<profession id>`, visibility `ff-staff`) and visibility are unchanged.

## Checked in this build
Headless Chrome, desktop (1280) and mobile (390), against the built file; the postcode service was mocked for one precise result and blocked for the failure cases.
- Real: `npm run check`, `npm run build`; postcode to base selection on the card; nothing saved until a choice; private postcode (absent from profile, card person and page text); saved label "Berkhamsted, Hertfordshire" and "Based in" on the rendered card; distance from the base lookup; duplicate names; lookup failure and bad format with manual search; base change keeps coverage and eligibility byte-identical; suggestions refresh and tick/untick with parent/child and partly-selected states shared with the tree; legacy profile migration (coverage and records unchanged, idempotent, no base when none can be derived); remote on one profession only; green and red cards side by side, contrast, button states, rate validation, saved answer, helper copy.
- Simulated: the postcode service response (mocked); production calls the server-side lookup.
- Not exercised: a real mouse and touch session on a physical phone.
