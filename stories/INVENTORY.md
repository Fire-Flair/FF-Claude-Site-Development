# FireFlair Stories: inventory, decisions and handover (draft 1, 7 Nov 2026)

Base: fireflair-v17.3.93 (JR17 holds 21 editorial stories, ordered per site by JR17_ORDER; Journal17 opens them in a Sheet with local state).
Brief: "FireFlair Stories: research and implementation prompt" (7 Nov 2026).

## Decisions taken with Alex (7 Nov 2026)
- Build across all three sites in prototype phase 2, FF Party first for SEO (B2C search), FF Team for job seekers, FF Staff lighter. Backlinks between the sites are wanted.
- Fee figures may appear in the cost and refund articles, framed as first-year launch pricing that stays fixed for loyal users. Final wording, VAT presentation and the "fixed for loyal users" terms still need approval before publication.
- Business site name: the prototype uses FF Staff in current story titles (v17.3.93 "How to book staff on FF Staff"). Used FF Staff. Canonical domain not confirmed in the repo: to be set from approved configuration.

## Existing 21 stories: action
| Existing id | Action | Destination |
|---|---|---|
| sidehustle | Rewrite, remove unverified quotes | T18 |
| workteam | Expand, separate exclusive vs Autofill, check 30-day reminder | T03 |
| bookstaff | Update | B01 |
| securestaff | Merge with whyparty | P01 |
| wedding | Expand | P08 |
| howmany | Expand with assumptions, own on FF Party | P05 |
| cocktails | Merge with menuparty | P10 |
| launch | Expand | B10 |
| profile | Expand | T02 |
| shifts | Rewrite | T10 (work-finding to T01) |
| sites | Consolidate | T16 |
| cards | Distribute | T03, B01, P01 |
| whyparty | Merge | P01, P03, P04, P10 (correct instant-confirmation and 24-hour claims) |
| menuparty | Merge | P10 |
| cardsparty | Merge useful material | P03, P13 (verify tiers first) |
| whybiz | Rebuild | B14-B17, B01, B18 |
| signbiz | Hold | C12 (conditional) |
| cardsbiz | Rewrite | B16 |
| whyteam | Consolidate, drop unsupported £15/£30 comparison | T16, T01, T05 |
| menuteam | Expand | T17 |
| cardsteam | Merge | T03 |

## Batch 1 (this commit): FF Party Priority A
P01, P02, P03, P04, P05, P06, P10, P17, P23. Files in stories/ffparty/.
Remaining Priority A: T01-T05, T13 (FF Team); B01, B02, B03, B07, B18 (FF Staff).

## Unmet publication conditions (batch 1)
- P02: dated supplier price examples (S21, S26, S29) were not in the brief's text; add after a live check of those pages. Article currently explains cost drivers and FireFlair's own charge only.
- P04, P17: the scope of complete bar companies in the FF Party network must be confirmed before the "what FF Party covers" paragraph goes live; wording is written conditionally.
- P05: staffing ratios need experienced-bartender review before publication.
- P10: confirm whether the menu basket records preferences, quantities or a paid order.
- P23: post-confirmation cancellation wording is not stated because it is not approved.
- All competitor facts were taken from the brief's 7 Nov 2026 research; recheck on the day of publication.

## Technical state (not yet done)
- Real /stories/{slug} routes need hosting or prerendering work; the prototype is a single compiled page.
- The compiled page cannot be rebuilt from source/fireflair-app.jsx in this environment (the source has image markers, and the build step is not in the repo), so the template and reader changes are specified, not yet shipped.
- Pushing to GitHub is currently refused for this session (Claude GitHub app not installed for the organisation).

## Batch 2 (v17.3.95): Priority B complete

Totals: FF Party 22 files (P01–P21 with P22 and P24 merged into P07, plus P23), FF Team 18 (T01–T18), FF Staff 18 (B01–B18). 58 articles in the prototype.

Replaced legacy stories: `sidehustle` → T18 (trading allowance, verified against the GOV.UK policy paper of 28 October 2026), `menuteam` → T17, team `sites`/`whyteam` → T16, `launch` → B10, `cardsbiz` → B16. Party legacy `wedding`, `cardsparty`, `sites` remain after the new articles until reviewed.

Wording rules applied: FF Party has the refundable deposit only (never "charge"), no booking connection fee, no hourly example, no "new/young" wording. FF Staff alone carries the booking connection fee per filled Shift Card and the hourly example (B02, B13). FF Team lists the prototype pay figures and direct contact with the client.

Open for Alex: ratio bands (P05) and drinks-per-guest figure (P10) need an experienced bartender's review; 30-day rule reading (credit toward the next event at 30+ days, no refund within 30 days once staff are confirmed, refund before confirmation); B18 fee timing against the prototype flow (it currently takes the fee before invitations); VAT presentation; recheck competitor and supplier facts on the publication day; T18 relies on legislation not yet enacted, so recheck before launch.

Deferred: C01–C12 conditional candidates. Community-question articles (up to six) not yet written.

Tested (headless, 390px): Team 18 cards, Staff 18 cards, Party 25 cards (22 plus 3 legacy); article opens, related link, Esc, CTA closes the reader and starts the right flow. No page errors.

## Decisions confirmed by Alex (v17.3.96)

- FF Staff fee is taken before the Shift Card is sent and refunded if the card cannot be filled.
- FF Party: no credits. Cancelling at least 30 days before the event is refunded; cancelling within 30 days once staff are confirmed is not. Changing the date up to 30 days before is the feature to promote.
- Menu: three cocktails and two alcohol-free drinks as a starting point, client's choice; the event booking handles up to ten cocktails with recipes; larger menus suit a bar company.
- VAT is not mentioned while the business is below the threshold. Professionals are responsible for their own tax and legal obligations. A tax update will be made when VAT starts.
- Comparison pages keep the "published by FireFlair" disclosure and checked dates; the word "facts" is avoided.
- Still open: conditional candidates C01–C12 and community-question articles (need source material from Alex).

## Story images (v17.3.100)

Every article has one photo from `photo-library/` (cropped 8:5, `stories/images/{slug}.webp`, 640 px wide) with descriptive alt text, listed in `stories/images.json` (slug, library id, alt text, focus point). Rules applied: no photo is used twice on the same site (checked against the library's usage list, including the home-page pillars and older stories); no photo with a visible third-party brand; no Vooshka bar-design product shots; faces kept inside every crop. Photos may repeat across FF Team, FF Staff and FF Party.

For the real site: use the `.webp` files as the article's lead image, keep the alt text, add `width` and `height`, add the absolute image URL to the Article structured data, and use `loading="lazy"` below the fold. People photos still need permission confirmed before launch (see photo-library/README.md).

Gap: few unused people photos remain for FF Team and FF Staff, so many of their articles use drink or bar photos. New supplied photos of bartenders at work would improve them.

| Article slug | Library photo | Alt text |
|---|---|---|
| add-to-event-alternatives-party-bar-hire | vkg10 | A black marble event bar with a monogram front and an easel cocktail menu, in a dark hall. |
| add-to-event-and-bark-alternatives-bar-companies | vkg14 | A long event bar wrapped in a bright patterned print with a personalised sign. |
| bar-staffing-agency-or-freelance-platform | p37 | A team of bartenders and guests smile with mojitos at a long blue bar in a glass office atrium. |
| barback-bartender-or-bar-manager | p10 | A young bartender aims a blow torch flame over a coupe cocktail in front of a back bar of bottles. |
| bartender-hire-vs-mobile-bar-hire | vkg02 | A round event bar with a monogram front and a tree centrepiece under purple light. Small Vooshka text under the monogram. |
| bartender-mixologist-flair-bartender-difference | p10 | A young bartender aims a blow torch flame over a coupe cocktail in front of a back bar of bottles. |
| book-bartender-and-dj-for-a-party | vks08 | Vooshka signature cocktail: Ginger & Passionfruit Mojito. |
| cash-bar-or-open-bar-for-a-wedding | vkc19 | Classic cocktail photo: French 75. |
| christmas-party-bar-staffing | vke11 | A long line of pink cocktails with cherries under purple party lights. |
| cocktail-bartender-or-masterclass-hen-party | p13 | Two smiling guests photograph a row of strawberry mojitos on their table. |
| cocktail-masterclass-at-home | vks13 | Vooshka signature cocktail: Penicillin. |
| cocktail-party-ice-and-glassware | vke12 | Rows of foamy coupe cocktails with cherries at an event bar. |
| cocktail-skills-for-event-bartending | p17 | Three foamy martinis with a red swirl on a bar mat. |
| coople-alternatives-uk-bar-staff | vkg10 | A black marble event bar with a monogram front and an easel cocktail menu, in a dark hall. |
| dj-or-live-musician-house-party | vkg06 | Vooshka event bar photo: After-dark atmosphere. |
| dry-bar-hire-staffed-bar-full-bar-service | vkg12 | Vooshka event bar photo: Your bar, your way. |
| ff-party-booking-deposits-and-refunds | vkc24 | Classic cocktail photo: Spicy Margarita. |
| ff-party-vs-add-to-event | vke07 | A bartender in a bow tie pours into martini glasses, in black and white. |
| ff-party-vs-poptop | vke09 | A bartender in a flat cap and bow tie pours into rows of coupes, in black and white. |
| ff-party-vs-togather | vke03 | A bartender with glasses pours juice into a row of glasses under blue stage lights. |
| ff-staff-booking-fees-refunds-replacements | vkc12 | Classic cocktail photo: Whisky Sour. |
| ff-staff-vs-brigad-hospitality-staffing | vke04 | A bartender in a bow tie strains a cocktail into a coupe at a long event bar. |
| ff-staff-vs-indeed-flex-bar-staffing | vke09 | A bartender in a flat cap and bow tie pours into rows of coupes, in black and white. |
| ff-team-vs-brigad-for-bartenders | vkc09 | Classic cocktail photo: Negroni. |
| ff-team-vs-indeed-flex-for-bartenders | vkc04 | Classic cocktail photo: Espresso Martini. |
| first-event-bar-shift-checklist | vkg08 | Vooshka event bar photo: An elegant centrepiece. |
| freelance-bartender-work-london | vkc27 | Classic cocktail photo: Pineapple Mojito. |
| freelance-bartending-or-agency-bar-work | vkg12 | Vooshka event bar photo: Your bar, your way. |
| freelance-bartending-trading-allowance | vkc20 | Classic cocktail photo: French Martini. |
| hire-photographer-birthday-party | vkc05 | Classic cocktail photo: Cosmopolitan. |
| hospitality-staffing-fees-explained | vkc10 | Classic cocktail photo: Moscow Mule. |
| how-far-in-advance-to-book-a-bartender | vkc02 | Classic cocktail photo: Mojito. |
| how-many-bartenders-do-i-need | vke06 | Guests crowd a long event bar while a bartender serves, in a bright hall. |
| how-many-cocktails-for-a-party | vke11 | A long line of pink cocktails with cherries under purple party lights. |
| how-many-waiters-for-a-private-party | p29 | A smiling waiter carries a wooden tray of cocktails out of a marquee at a country event. |
| how-much-does-it-cost-to-hire-a-bartender | vkg11 | A round event bar with a monogram front in a vaulted hall dressed for a wedding. |
| how-to-accept-bookings-on-ff-team | p37 | A team of bartenders and guests smile with mojitos at a long blue bar in a glass office atrium. |
| how-to-book-a-bartender-on-ff-party | p23 | A bartender in a shearling vest pours into a martini glass at an outdoor event bar with a chalkboard menu. |
| how-to-book-bar-staff-on-ff-staff | vke01 | Two bartenders in bow ties pour and garnish rows of red punch at a bright event bar. |
| how-to-build-a-bartender-network | p38 | Selfie at a bar show stand with a drinks menu board and a bartender behind. |
| how-to-build-a-bartender-profile | p29 | A smiling waiter carries a wooden tray of cocktails out of a marquee at a country event. |
| how-to-choose-a-bartender-training-course | vkc11 | Classic cocktail photo: Tom Collins. |
| how-to-compare-mobile-bar-companies | vkg14 | A long event bar wrapped in a bright patterned print with a personalised sign. |
| how-to-find-freelance-bartending-work-uk | p21 | A smiling bartender in a white shearling vest shakes a cocktail; a guest in a floral shirt and feather boa laughs beside her. |
| how-to-find-last-minute-bar-staff | vke02 | A tray of martinis glowing under pink event lighting. |
| how-to-get-mobile-bar-bookings | vkg12 | Vooshka event bar photo: Your bar, your way. |
| how-to-hire-a-bartender-for-a-house-party | p21 | A smiling bartender in a white shearling vest shakes a cocktail; a guest in a floral shirt and feather boa laughs beside her. |
| how-to-hire-a-bartender-in-hertfordshire | vkc07 | Classic cocktail photo: Aperol Spritz. |
| how-to-hire-a-cocktail-bartender-in-london | vkc14 | Classic cocktail photo: Manhattan. |
| how-to-plan-a-cocktail-menu-for-a-party | vkc04 | Classic cocktail photo: Espresso Martini. |
| how-to-plan-a-wedding-bar | vkg08 | Vooshka event bar photo: An elegant centrepiece. |
| how-to-rebook-bartenders | p21 | A smiling bartender in a white shearling vest shakes a cocktail; a guest in a floral shirt and feather boa laughs beside her. |
| how-to-set-freelance-bartender-rates | vkc08 | Classic cocktail photo: Old Fashioned. |
| how-to-write-a-bartender-cv | vks02 | Vooshka signature cocktail: Marmalade Gin. |
| how-to-write-a-mobile-bar-package | vkg08 | Vooshka event bar photo: An elegant centrepiece. |
| indeed-flex-alternatives-for-bartenders | vkg06 | Vooshka event bar photo: After-dark atmosphere. |
| indeed-flex-alternatives-for-hiring-bar-staff | vke07 | A bartender in a bow tie pours into martini glasses, in black and white. |
| repeat-bookings-event-bar-business | vkg11 | A round event bar with a monogram front in a vaulted hall dressed for a wedding. |
| repeat-bookings-freelance-bartender | vkc12 | Classic cocktail photo: Whisky Sour. |
| signature-cocktail-services-on-ff-party | vks04 | Vooshka signature cocktail: Maple Old Fashioned. |
| staffing-a-product-launch-or-drinks-reception | vkg02 | A round event bar with a monogram front and a tree centrepiece under purple light. Small Vooshka text under the monogram. |
| supply-own-alcohol-hire-bartender | vkc08 | Classic cocktail photo: Old Fashioned. |
| temporary-bar-staff-brief-template | vkg10 | A black marble event bar with a monogram front and an easel cocktail menu, in a dark hall. |
| temporary-bar-staff-hertfordshire-guide | vke12 | Rows of foamy coupe cocktails with cherries at an event bar. |
| temporary-bar-staff-hire-cost | vke10 | Cocktails with dried orange and cherries at a party, guests out of focus behind. |
| weekend-bar-work-alongside-another-job | vkc07 | Classic cocktail photo: Aperol Spritz. |
| what-is-ff-team | p19 | A martini beside fresh mint, raspberries and rose petals on a bar. |
| what-to-check-before-accepting-a-bar-shift | vkc14 | Classic cocktail photo: Manhattan. |
| what-to-do-when-an-event-bartender-cancels | vkg06 | Vooshka event bar photo: After-dark atmosphere. |
| what-to-provide-when-hiring-a-bartender | vke05 | A row of mojitos with mint along a bar under purple party lights. |

## Batch 2: FF Party inspirational stories (8 Nov 2026, drafts, not yet in the Stories build)
Quantity first; quality refinement later. Each ends with a link to its FireFlair Package page or to booking.
I01 the-art-of-hosting-an-unforgettable-house-party (Bartending), I02 making-birthdays-feel-extraordinary (Mixology), I03 create-a-cocktail-experience-at-home (Masterclass), I04 small-parties-with-big-personalities (Flair), I05 ideas-for-memorable-hen-parties (Masterclass), I06 setting-the-atmosphere-for-your-celebration (Packages). Image choices and the build step (scripts/build-stories.py) are still to do. All existing stories and categories stay as they are.
