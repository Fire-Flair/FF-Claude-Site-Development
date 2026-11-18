# Handoff v17.9: FF Team home, Discover FireFlair pillars

## What changed

The four FF Team home pillars were rebuilt. Order: Your profile, Our packages, Your bookings, Our community. Slugs: `profile`, `packages`, `bookings`, `community` (the old `events` slug opens `bookings`). FF Staff, FF Party and FF VIP pillars are unchanged.

An open pillar shows, top to bottom: the title, one summary paragraph, three numbered cards (their buttons scroll to the section), then three full sections, then the Next pillar and Close footer. Each section has a number, a title that links to its own page, three paragraphs, a visual beside the text (stacked on mobile), an optional `ff-soonbadge` tag (shows 2027) and a button.

## Where things are

- Copy: `src/content/homepage/team-pillars.json`, read only through `CONTENT_ADAPTER.homepageTeamPillars()`. Change wording there only. It also holds the tile photo pools, the Launch Challenge boxes and rewards, the growth events and the "Suggest a reward" question.
- Pillar data: `src/components/home/package-pages.jsx` (`DX_TEAM`, built from the JSON).
- Sections, cards, the twelve visuals, the info pages and SEO: `src/components/home/team-pillars.jsx`, styles in `src/styles/team-pillars21.css`.
- Open-pillar panel: `src/components/home/discover-hub.jsx` (branch used when a pillar has `sections`).
- Router: `src/utils/routes17.js` (`info` is a reserved word; parse, build, apply). SEO: `src/utils/seo.js` (`state.infoPage21`).
- Launch Challenge box: `TeamCompetition20` in `src/components/home/discover-and-support.jsx`.

## The 16 addresses

Each is `#/ff-team/info/<slug>` in the prototype and `https://ffteam.uk/info/<slug>` in production, with robots `index, follow` and the canonical set to the production address. Titles and descriptions come from the JSON.

| Slug | SEO title |
|---|---|
| `your-profile` | Digital CV and Profile Card for Hospitality Staff | FF Team |
| `hospitality-digital-cv` | Turn Your Hospitality CV into a Digital Profile | FF Team |
| `build-your-events-team` | Build Your Events Team and Hospitality Network | FF Team |
| `hospitality-reviews` | Collect Reviews for Bartending and Event Work | FF Team |
| `our-packages` | Get Booked for Private Events | FireFlair Packages | FF Team |
| `get-found-for-event-work` | Get Found for Event Work in the UK | FF Team |
| `private-event-bartender-jobs` | Private Event Bartender Jobs with Set Pay | FF Team |
| `create-your-own-event-packages` | Sell Your Own Event Packages and Cocktail Menus | FF Team |
| `your-bookings` | How Event Bookings and Pay Work for Freelancers | FF Team |
| `set-your-freelance-rates` | Set Your Freelance Hospitality Rates | FF Team |
| `shift-requests-on-whatsapp` | Event Shift Requests on WhatsApp | FF Team |
| `booking-terms-and-pay` | Booking Terms, Event Briefs and Getting Paid | FF Team |
| `our-community` | Hospitality Community, Events and Rewards | FF Team |
| `launch-challenge` | FF Team Launch Challenge: Build Your Team, Win Prizes |
| `launch-party` | The FireFlair Launch Party for Hospitality Pros | FF Team |
| `hospitality-industry-events` | Bar Shows, Training and Hospitality Events | FF Team |

A pillar page shows the H1, summary, cards linking to the section pages, and the three sections. A section page shows a breadcrumb to its pillar, the H1, paragraphs, the visual, the button and links to the other two sections. An unknown slug goes to the FF Team home.

## Server-render note

The prototype sets title, description, canonical and robots in the browser. For production each address must return that HTML from the server (title, description, canonical, H1 and the paragraphs from the JSON) so crawlers do not depend on script. The section titles and cards are already real `<a href="/info/<slug>">` links.

## Removed from FF Team pillars

Featured professionals, the map block, the platforms roadmap, the Follow-a-booking card journey and the old Services block. The components stay in the code because FF Staff and FF Party still use them. Gold, Silver, Bronze and Mystery Prize text was removed from the Launch Challenge box and its rules.

## Anchors re-pointed

Old FF Team anchors map to the new section ids (`DX_ALIAS_TEAM21` in `discover-hub.jsx`): ff-teams to ff-pl-team; ff-map to ff-pl-marketing; ff-cards, ff-how to ff-pl-requests; ff-coming, ff-nx-svc-h, ff-nx-ck-h, ff-nx-svc, ff-nx-ck to ff-pl-own; ff-terms to ff-pl-terms; ff-barshows, ff-career, ff-training to ff-pl-industry; ff-what to ff-pl-cv; ff-relationships, ff-team to ff-pl-reviews. Also `profile-card-parts.jsx` (ff-coming now ff-pl-own), `home-scenes.jsx` (`goHomeSection` tries the pillar reveal first) and the career guide button in `growth-and-terms.jsx`.

## Suggest a reward

Opens a sheet using the Q&A mechanism: Yes/No plus a type box, sent with `qaSubmit17` as question `int.challenge_reward` (defined in `src/adapters/qa-adapter.js`, guests allowed).

## Photos

New crops are listed in `assets/photos/README.md`; hp01 to hp04 and the pens are in `photo-library/`. pen02 is library only. `python3 scripts/check-team-photos.py` checks no photo is used twice on the pillars.
