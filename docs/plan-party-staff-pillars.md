# Plan: FF Party and FF Staff pillars in the FF Team format (v17.10)

Owner: Alex. Written 15 Nov 2026. Repo: `/tmp/ffrepo` (branch `p2`, pushes to `phase-2-final`). `src/` is the source of truth.

## Goal

The four home-page pillars on FF Party and on FF Staff must be laid out exactly like the four FF Team pillars (v17.9.3). Same components, same CSS, same proportions. Alex's words: "the exact same format and photos ... I want the layout to be identical ... some of the content is actually quite good on FF Party, so we don't need to change all the content, just how it's laid out."

This is a layout job first. Keep the good copy. Do not redesign anything on FF Team.

## What "the FF Team format" is (read these first)

- `src/components/home/team-pillars.jsx`: `PillarCards21` (the 1, 2, 3 row), `PillarSection21` (a numbered section), `Visual21` and the `Vis*21` visuals, `TeamInfoPage21`.
- `src/styles/team-pillars21.css`: all of the pillar CSS.
- `src/content/homepage/team-pillars.json`: the content schema (`pillars[].{k,slug,t,s,h,tldr,seo,sections[]}`, `sections[].{id,slug,card{t,d},h,p[],visual,cta{label,go},seo,card_img}`, `photos`).
- `src/components/home/package-pages.jsx`: `DX_TEAM` is built from that JSON; `DX_BIZ` (FF Staff) is still the old hand-written shape.
- `src/components/home/discover-hub.jsx`: `DX_PARTY` (old shape) and `DiscoverHub11`, which has two branches: `cur.sections` (new format) and the legacy `p / jn / parts` branch.

Anatomy of an open pillar, top to bottom. Party and Staff must match this exactly:

1. `h3` headline, then one short summary paragraph (`tldr`).
2. The 1, 2, 3 row: three small cards on ONE line at every width, small picture (16:7), gold number, title, short description (hidden under 640px). No button. The whole card is the link and scrolls to its section.
3. Three numbered sections. Each: gold number circle and title on one line; text on the left, visual on the right (from 680px; stacked on a phone); one gold call-to-action button under the text.
4. The existing foot (Next pillar, Close).

Every pillar has exactly three sections.

## Work

### A. Shared code (small refactor, FF Team output must not change)

1. Add `src/content/homepage/party-pillars.json` and `src/content/homepage/staff-pillars.json` in the same schema as `team-pillars.json` (`pillars` and `photos` only; no team-only keys). Add `homepagePartyPillars()` and `homepageStaffPillars()` to `src/adapters/content-adapter.js` next to `homepageTeamPillars()`. Check how JSON files are registered for `__ff_json` (manifest/build) and register the new ones the same way.
2. Turn the `DX_TEAM` mapper into one function used for all three sites, and build `DX_PARTY` and `DX_BIZ` from the new JSON with it. Keep their `k`, `icon` and tile behaviour. Classic scripts share one scope and load in `src/manifest.json` order, so mind where each constant is defined.
3. `DiscoverHub11` must render the `cur.sections` branch for Party and Staff. Leave the legacy branch in the file (the VIP site still passes its own cats through it). `DX_ALIAS` maps old anchor ids to sections: add aliases so every old id used elsewhere in the site (`#ff-offer`, `#ff-guarantee`, `#ff-team`, `#ff-relationships`, `#ff-companies`, `#ff-how`, `#ff-occasions`, `#ff-yourparty`, `#ff-teams`, `#ff-trust`, and the Staff ones) still opens the right pillar and scrolls to the right new section. Grep for each id before you finish.
4. Generalise `usePillarRun21` so a section CTA can use every `go` value the old `jn` buttons used (`book`, `profile`, `bookings`, `network`, `#id`). Where the old button was a `LockedBtn17` (FF Party: `book`, `profile`, `bookings`), the new CTA keeps exactly that gating. Do not add or remove any lock.
5. Section titles: on FF Team each title links to an `/info/<slug>` page. For Party and Staff render the title as plain text (`link: false`) unless step E is done.

### B. Visuals for Party and Staff

Add the new visuals to `Visual21` (put them in a new file `src/components/home/site-pillar-visuals.jsx` if `team-pillars.jsx` gets long; add it to the manifest). Rules, all from Alex:

- Use the prototype's real cards and components (the existing `parts`: `PartyPackages18`, `Guarantee18`, `TrustSection17`, `HireFeatured`, `HireReviews`, `PartyCompanies`, `HowBooking17`, `PartyOccasions17`, `YourParty17`, `StaffTeams` and the Staff ones), in a compact form that fits the right-hand column (about 300 to 380px). No stock icons in chips, no invented illustrations, no random photos.
- Nothing a visitor can do today inside a pillar may be lost. If a part is live today (open a package, open a profile, open a company page, read reviews), the compact visual stays live and opens the same thing, or the section's gold CTA goes there. Anything that is only an example (ticks, type boxes) may be tickable or typable but leads nowhere, like the FF Team visuals.
- Package tiles: client-facing tiles (not the FF Team "You earn" tiles), in price order: Masterclass, Flair, Cocktail, Bartending, then Staffing. They scroll sideways on a phone and wrap two-up on desktop (see `.pv-pk` in the CSS).
- Real people on cards: use the live examples already in `team-pillars.json` `examples` (SIMAO with his photo `simao_face`, then the team) wherever a Profile Card is shown as an example, and the real directory companies for company cards (Vooshka is the featured company).
- No "Coming 2027" badges, no helper or instruction text, collapsibles shut by default, squircle corners, words never split across lines (shrink the font instead), Cinzel and Inter only, burgundy (never "oxblood"), share buttons are WhatsApp green.

### C. Content (`party-pillars.json`, `staff-pillars.json`)

Start from what is there: `DX_PARTY` in `discover-hub.jsx`, `DX_BIZ` in `package-pages.jsx` (also `src/content/homepage/discover-party.json` and `discover-staff.json` if they are still read). For each pillar:

- `t`, `s`: keep. FF Party pillar names are approved and fixed: Our Packages, Our Network, Your Booking, Your Party. Keep the FF Staff names as they are.
- `h`: keep the existing headline. `tldr`: one short paragraph made from the existing `p` lines. It leads with what the visitor is looking for, then the answer.
- Three sections from the three `jn` items: `card.t` from `jn.t`, `card.d` from `jn.d`, section `h` a fuller title, `p` two or three short paragraphs built from `jn.x` and the matching `p` lines, `cta` from `jn.b` and `jn.go`, `visual` the matching part. Write new sentences only where a section would otherwise be one line long.

Writing rules (approved content strategy; apply to every new or edited line):

- British English. No em dashes. Positive, direct, exciting; cards and buttons carry plain facts.
- Never write about price, cost, deposits or payment in sentences. Prices appear only where a package card already lists them. Do not write new numbers.
- Booking steps are: choose your package, choose your people, choose your add-ons, secure your booking. The confirmation wording is "Your booking is secured".
- The FireFlair Booking Guarantee is a benefit: confirmed, or refunded in full. Say no more than that.
- Names: FF Party, FF Staff, FF Team (never "FF Business"). Profile Card, Company Card, Event Card. "FF companies" for signed-up companies, "FF Event Directory" for the directory, "Featured companies" (not "Top companies"). "Ask us to find people" is gone; the Event Card takes enquiries.
- Package names must match `src/state/package-catalogue17.js`: Bartending, Cocktail, Flair, Masterclass, Staffing (and Platinum Tasting). The old copy says "Mixology Package" in places: change it to "Cocktail Package". The Masterclass is the Open Bar Masterclass.
- Everything must agree with how the FF Team pillars describe the same thing from the professional's side (read `team-pillars.json` first): professionals set their own rates; a request reaches them on WhatsApp; your first choice is asked first; every booking has an event brief and invoice with clear terms; everyone reviews everyone after an event; FireFlair markets its people. Describe the same mechanics from the client's side. Never contradict them.
- At most one photo of Alex (the bearded man) on a home page. Never crop a head. No photo twice on the same site (the same photo on two different sites is fine).

### D. Pictures

1. Tile photos (`photos` pools in the new JSON): choose photos from the library (`src/content/data/photos17.json`, `src/shell/ff-img.json`, assets in `src/assets/img/`) that suit each pillar. Party: celebrations, cocktails, guests, hosts. Staff: teams at work, venues, business events. Make a contact sheet and LOOK at the candidates before choosing; check the `t17_` tile crop of each one (heads!) and the `FOCUS17` table in `src/components/staff/company-pages.jsx`.
2. The 1, 2, 3 card pictures (`card_img`): a picture of that section's own visual, exactly as FF Team does it (`th_*`). `/tmp/thumbs2.py` is the script that made the FF Team ones: it screenshots each visual in the built page and composes it, contained, on a plain 640x400 background, saved as webp and registered in `photos17.json` as `j17_<key>`. Adapt it; use keys `thp_*` (Party) and `ths_*` (Staff). Save the adapted script as `scripts/make-pillar-thumbs.py`.

### E. Optional, only if A to D are finished and verified

Section pages for Party and Staff like `TeamInfoPage21` (`#/ff-party/info/<slug>`, `#/ff-staff/info/<slug>`), with titles as links. Only if it is a small, clean generalisation of the existing page and route. Otherwise leave it and say so in the report.

## Verify (do not skip)

- `npm run check`, `npm run build`, `npm run publish-build` all pass. `build/release/index.html` must stay under 5 MiB (it is about 4.71 MB now, so keep the JSON lean).
- Screenshot helpers: `/tmp/shot.py` (Chrome with local library routing), `/tmp/pill3.py <width>` (opens every pillar tile on the FF Team home and screenshots the panel). Make a version that takes the site (`#/ff-team`, `#/ff-party`, `#/ff-staff`; confirm the routes in the code).
- For each of Party and Staff, each of the four pillars, at widths 390, 820 and 1100: open the screenshot and look at it. Fix: the 1, 2, 3 row not on one line, words split across lines, text overflow, clipped cards, cropped heads, a visual wider than its column, a missing picture, any page error in the console.
- FF Team: screenshot all four pillars at 820 before you start and after you finish. They must look the same.
- Click through: each 1, 2, 3 card scrolls to its section; each CTA does what the old button did; each old anchor id still lands on the right section.

## Deliver

- Add a `## v17.10` entry at the top of `CHANGELOG.md` with notes for the developers.
- Do NOT publish the artifact, do NOT commit, do NOT push. Leave the work in the tree.
- Make two review sheets: `/tmp/review_party.png` and `/tmp/review_staff.png` (the four pillars at 820 wide, side by side, scaled so each sheet is at most 2000px wide), plus phone sheets `/tmp/review_party_390.png` and `/tmp/review_staff_390.png`.
- Final report: what changed (files), what copy was newly written (quote it), which photos were chosen for which tile, anything skipped or uncertain, and the size of `build/release/index.html`.
