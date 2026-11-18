# FF Team version 1.1. Final — changelog

The front-end export of FF Team, taken from the Phase Two prototype (phase-2-final v17.59, commit 518b5e8).
The prototype keeps its own `CHANGELOG.md` at the repo root; this file is the changelog of the export only.
The newest heading here is the version the page shows (`scripts/build.mjs` reads it).

## v1.70 (draft: buttons)

Buttons under the Profile Card on someone else's profile, back to the earlier layout (Alex, 18 Nov 21:56). `src/components/team/network.jsx` (`PublicProfile` actions), `src/shell/index.html` (v1.70 block at the end of the style sheet).

- Signed out: Back is the full width of the Profile Card on its own row (the same `ff-pback` Back bar the signed-in view uses), then one row of Join team (left) and Share (right), equal halves, the row the card's width. The in-row Back button (`ff-pub-back11`, the "Back | Join team | Share" row) is gone.
- Share is olive green `#5F6E33` with cream text and the WhatsApp logo in cream `#FFF8E6` (contrast 5.27:1), border `#4A5627`, hover `#56642E`. Same in the signed-in grid (Back on top, then Add to network | Share | Ask | Availability; no buttons removed).
- Same on phone, iPad and desktop: at 390, 820 and 1280 the Back bar and the Join team | Share row line up with the card's edges; labels stay on one line.
- Checked: `npm run check`, `npm run build`, screenshots signed out at 390, 820, 1280 and signed in (DEV · complete profile) at 390 of `#/ff-team/simao`; no console errors.

## v1.69

Profile Packages tab, in the profile builder and on a public profile (Alex, 18 Nov 20:51). New `team/profile-packages.jsx`, `styles/profile-packages.css`; `team/profile-edit-tabs.jsx`, `team/introductions.jsx`, `team/public-profile.jsx` (CoverFlow), `styles/p12.css`, `manifest.json`.

- Work locations are off the Packages tab for now (builder and public page). Their records, the coverage editor elsewhere and the Overview are unchanged.
- The packages slider stays. Its cards are now the Bookings page's FF Party package cards (`BkPkgCard17`, `BkPkgOwn17`, `PkgFace17`, used as they are, with the Bookings styles), including Entertainment and Services packages you signed up for. Sign up / Signed up opens Bookings at FF Party – Our packages, where sign-ups are made. On someone else's page (or yours viewed as a guest) "You earn" is left off the cards.
- Create your own is the same size as every other card (one width, all as tall as the tallest) and has the Staffing card's platinum face. On your own profile it is the Bookings type-box card, saved to the same answer, so both places match.
- Swiping fixed on phones and iPads: a swipe that is more sideways than up-and-down moves the slider and holds the page still, a short swipe moves on to the next card instead of snapping back, and up-and-down swipes still scroll the page. Mouse drag and the arrows are unchanged.
- Under the slider, one Terms and conditions box (closed to start with) for the card in the centre: that package's own condition, then the five FF Party package terms from the Bookings terms.
- Your own profile only: FF Staff, a card per profession with your preferred hourly rate (empty until you type it) and your preferred terms, one Save. Rates are the same answers as Bookings' FF Staff box, so a rate saved in either place shows in both; terms are saved per profession. With no professions yet it says the professions show here. Nobody else sees this part.
- Checked: `npm run check`, `npm run build`; touch swipes (clean, 15°, 30°, 45°, short, from the card's middle, vertical) at 390, 820 and 1180 signed out and with the DEV sign-in, on the builder, the live own profile and a public profile; page never moved sideways; Bookings page screenshot identical to before; desktop arrows and drag; no console errors.
- Merged onto the live page 1795037978-eab3 (v1.68). Artifact version 1795038385-8581.

## v1.68

Profile builder, Professions picker (Alex, 18 Nov 21:34, option 5 of six mock-ups). `src/components/team/profile-edit-p2.jsx` (`PE2ProfCats`, `PE2CatSheet`, `PE2TopSlots`), `src/styles/profile-edit-p2.css` (prof-grid).

- Under "Type a profession" all eight categories are on screen as icon tiles, four across (Bar, Front of House, Management, Back of House, Entertainment, Services, Food, Other), each showing how many of its professions are chosen. A long label shrinks, never splits.
- Tapping a tile opens that category in a pop-up: tap professions to add or remove as many as you like, "Add your own" puts a typed profession under that category (Other included), Done closes it. Replaces the sideways row of category boxes.
- Top three slots: a new profession fills an empty slot automatically, unless the member emptied that slot on purpose.
- Checked: `npm run check`, `npm run build`, new member at 390 and 1280: Services opened, Photographer picked, "Drone Pilot" added, tile shows 2, slots 1 and 2 filled; labels fit; no console errors.
- Published over live 1795037897-f382 (v1.67), index.html only (all other files kept). Artifact version 1795037978-eab3. Built page saved as `live-v1.68-index.html`.

## v1.67

Bookings, Your bookings (Alex, 18 Nov 21:33: a hybrid of the live FFTeam.uk Bookings screen and v1.66). `src/components/team/bookings.jsx`, `src/styles/bkd.css` (bk-hybrid).

- Design from live FFTeam.uk, content from v1.66: the section now sits in one cream squircle panel. Inside it, the WhatsApp banner (paler green, softer body text, as live) holds only the WhatsApp line.
- Below the banner, white cards in the live style: a cream icon tile with a small black lock badge when the feature is still to come, a bold title, a grey line and a gold uppercase status.
  - Confirmed bookings: "When you're selected for a booking, it will be shown here." Coming soon.
  - Notifications (FF mark tile): "Notifications will also be shown here."
- No split by site (no "Coming with FF Staff / FF Party" labels) and no Booking passes card, as agreed on 17 Nov. The page title keeps the agreed underline title system.
- Cards stack on phones and sit two across from 760px.
- Checked: `npm run check`, `npm run build`, Bookings at 390 and 1180, no console errors.
- Merged onto the live page 1795037719-8da7 (v1.66), index.html only (all other files kept). Artifact version 1795037897-f382. Built page saved as `live-v1.67-index.html`.

## v1.66

Profile tabs (Alex, 18 Nov 21:13: "I like number 5", from the six mock-ups on branch `tabs-mock`). `shell/index.html`.

- A gold line with the FF coin in the middle now separates the Profile Card buttons from the tabs (coin 52px on phones, 44px from 760px).
- Overview, Packages, Team and Reviews are separate ivory boxes with a fine gold edge; the chosen tab is burgundy with gold-leaf text and a small pointer down into its page. The burgundy box joining the tab to its page is gone.
- The About Me box is ivory with a fine gold edge.
- Applies wherever the profile tabs are used: public profiles, the profile builder and company profiles. The other five options were not kept (the mock-up switch is not in the release).
- Checked: `npm run check`, `npm run build`; public profile and builder at 390 and 1180, no sideways overflow, no tab label cut.
- Merged onto the live page 1795037620-f350 (v1.65). Artifact version 1795037719-8da7.

## v1.65

Profile builder, Let's get started (Alex, 18 Nov 21:31). `src/components/team/profile-builder.jsx`, `src/styles/v11.css`.

- CV upload progress bar moves faster between 10% and 40%: 0-10% in 4 s, 10-40% in the next 4.5 s, then 40-92% over
  the remaining 31.5 s, so it still reaches 92% at 40 s and jumps to 100% when the extraction returns. The same bar
  serves Talk or type. Timing is the table `CV_SIM_STEPS` ([ms, %] points) read by `cvSimPct()`.
- "Create your profile in <1 minute" is larger (600 weight, 17.5px, larger timer icon; class `.ff-way17-fast`) and
  stays on one line: on a phone the text shrinks slightly to fit rather than wrapping.
- Checked: `npm run check`, `npm run build`, phone (390) and desktop (1440) screenshots; timing table checked in Node. Artifact version 1795037620-f350 (published straight onto live 1795037345-3440, which matched GitHub).

## v1.64

Profile builder, Professions (Alex, 18 Nov 20:58 and 21:24). `src/components/team/profile-edit-p2.jsx`, `src/components/team/attribute-cards.jsx`, `src/styles/profile-edit-p2.css` (prof-edits).

- "Type a profession" now suggests as you type, the same search as the rest of the profile: known professions that start with the letters, then ones that contain them, each with its category; tap one or press Enter to add the first.
- Tapping a profession that has no text of its own opens with its default description ready to edit: its own default, or its category's (a custom profession under Front of House shows the Front of House description). Nothing is saved until the member edits it; clearing the box on purpose keeps it empty. Both editors (the profession pop-up and the compact entry editor).
- "Available for remote work" is removed from both profession editors.
- Image uploads on professions stay as they are (Alex, 21:24).
- Checked: `npm run check`, `npm run build`, DEV complete profile at 390: "wai" suggests Waiter; a custom "Guest Greeter" set to Front of House opens with the Front of House description; no remote work tick; no console errors.
- Published over live 1795036897-879d (v1.63), index.html only (all other files kept). Artifact version 1795037345-3440. Built page saved as `live-v1.64-index.html`.

## v1.63

Profile builder photo and About Me (Alex, 18 Nov 21:16–21:17). `src/components/team/creator-media.jsx` (`PhotoFrame17`, `ffFramePhoto17`), `src/components/team/profile-marks-qa.jsx`, `src/components/team/network.jsx`, `src/components/team/profile-builder.jsx`, `src/components/team/profile-edit-p2.jsx`, `src/styles/prof21.css` (photo-frame).

- Choosing a profile photo (Media box, the Profile Card photo circle, or the "no profile picture yet" prompt) now opens a framing pop-up first: the picture under a circular window the size of the card's circle, dragged to line up, zoomed with the slider, a pinch or the mouse wheel. "Use photo" saves the square around the circle (800px JPEG), so the card shows exactly what was framed; the X or Escape cancels.
- Media box: the profile photo is a circle (as on the Profile Card); the Page pictures stay squares.
- About Me moves from above the tabs into the Overview tab, between Professions and Attributes, where it sits on the published profile.
- Text boxes can no longer be resized by hand (the grow-boxes rule now overrides resize handles too).
- Checked: `npm run check`, `npm run build`, DEV complete profile at 390: photo picked, dragged, zoomed, used (round tile, no console errors); About Me in Overview signed in and signed out.
- Published over live 1795036642-f29e (v1.62), index.html only (all other files kept). Artifact version 1795036897-879d. Built page saved as `live-v1.63-index.html`.

## v1.62

Text boxes (Alex, 18 Nov 21:15). `src/components/shared/primitives.jsx` (grow-boxes), `src/components/team/profile-card-parts.jsx` (FFAI box).

- No text box on the site scrolls inside itself any more. Every textarea grows with its text, whether typed, pasted, or filled in by speech to text or GPT, and when empty it is tall enough for its whole placeholder. One global hook sizes them: the value setter React uses, input events, new text boxes appearing and width changes. The "Talk or type to GPT" box on the profile page lost its 140px cap.
- A text box that must keep a fixed height can opt out with `data-no-grow`.
- Checked: `npm run check`, `npm run build`, profile GPT box empty and with a long answer at 390 and 1280, Bookings Create your own boxes (no inner scroll, no console errors).
- Published over live 1795036430-22ae (v1.61), index.html only (all other files kept). Artifact version 1795036642-f29e. Built page saved as `live-v1.62-index.html`.

## v1.61

Profile page top (Alex, 18 Nov 21:10). `src/components/team/profile-builder.jsx`, `src/styles/titles2.css` (prof-top).

- The "FF Team · Profile" eyebrow at the top left is gone; the page opens straight on "1 Let's get started", 22px under the top bar (as Your bookings and Explore our network).
- Checked: `npm run check`, `npm run build`, profile page at 390 and 1280 (no console errors).
- Published over live 1795036260-d6d7 (v1.60), index.html only (all other files kept). Artifact version 1795036430-22ae. Built page saved as `live-v1.61-index.html`.

## v1.60

Bookings, FFParty – Our packages (Alex, 18 Nov 20:51). `team/bookings.jsx`, `styles/bkd.css`.

- The line "Packages are offered where you work: your areas are on your profile." is removed, with its link handler (`goAreas`) and its styles. The intro now says it instead: "Be your own boss. Sign up to the packages you want to deliver, or create your own, and we find you work close to home. Every package shows …" (rest unchanged).
- iPad pop-up fix. The package Details pop-up (Event brief and invoice) was drawn inside the package slider's scroll box; on iPad Safari a fixed pop-up inside a touch scroll box is clipped to that box, so it sat under the Bar / Entertainment / Services tabs, cut off top and bottom, with the page and the Confirm bar showing through. The Details pop-up and the package terms pop-up now render at the app root (`PkPop17`, a portal), above everything (z-index 200), centred, rounded all round.
- While either pop-up is open the page behind it does not scroll (html and body overflow held, touch moves outside the pop-up held, scrollbar gutter kept on desktop so nothing jumps); the pop-up scrolls inside itself (`overscroll-behavior: contain`). Closing (X, tap outside, Escape) restores the page exactly where it was.
- Package terms pop-up: same floating panel, and "Accept and confirm" stays pinned in view at its foot.
- Package slider: `overscroll-behavior-x: contain` so a sideways swipe at either end no longer drags the page; swipes left and right step card by card from any position.
- Shared components unchanged (`Sheet`, `HScroll`, `PkgFace17` / `PkgDoc17` props).
- Checked: `npm run check`, `npm run build`; touch emulation at 768×1024, 820×1180, 1024×1366 and landscape 1180×820, 1366×1024, phone 390×844, desktop 1280: pop-up outside the slider, hit-tested on top, inner scroll moves the pop-up only (page stays put), close by X / outside tap / Escape, slider swipes both ways with page X 0.
- Merged onto the live page 1795036085-feac (v1.59). Artifact version 1795036260-d6d7.

## v1.59

Profile builder, top three professions (Alex, 18 Nov 21:02, option 1 for testing). `src/components/team/profile-edit-p2.jsx` (`PE2TopSlots`), `src/styles/profile-edit-p2.css` (top-slots block).

- Drag and drop and the grip are gone from the Professions tiles in the profile builder. Above the tiles, three slots numbered 1 to 3 are the three on the Profile Card.
- Tapping a filled slot empties it (dashed outline). While a slot is empty, the other professions show underneath as buttons; tapping one fills the next empty slot.
- The order is still saved with `REC_MOVE`, so the Profile Card, public profile and Network follow it. An emptied profession moves to the end of the list, so the card shows the next one in line until the slot is refilled.
- Checked: `npm run check`, `npm run build`, DEV complete profile at 390 and 1280: empty slot 2, pick a profession, slot filled (no console errors).
- Published over live 1795035813-4a04 (v1.58), index.html only (all other files kept). Artifact version 1795036085-feac. Built page saved as `live-v1.59-index.html`.

## v1.58

Bookings titles and iPad layout (Alex, 18 Nov 20:25). `src/components/team/bookings.jsx`, `src/styles/bkd.css` (bk-titles and bk-ipad blocks).

- New page title "Get booked" (same style as "Your bookings": Cinzel with the gold underline) above the FF Party and FF Staff boxes.
- "Grow with FireFlair" is now the same page title style; the "Training, dream jobs and rewards." line under it is gone (the cards say it).
- The gold gradient bar is for titles outside a box: inside the FF Party and FF Staff boxes the title and its text now sit flush left with no bar. (Alex may make this a site-wide rule later.)
- Grow with FireFlair on iPad: from 470px wide (iPad split view included) the three cards share one row like desktop, and an opened card's contents span the full width below. Between 470px and 899px each card is photo, title and an icon row; its description moves into the opened panel, where it has room. Phones (under 470px) and desktop are unchanged.
- Checked: `npm run check`, `npm run build`, Playwright at 390, 490, 820 and 1280 (no console errors, no sideways scroll), Training opened at 490.
- Published over live 1795035610-b601 (v1.57), index.html only (all other files kept). Artifact version 1795035813-4a04. Built page saved as `live-v1.58-index.html`.

## v1.57

Profile builder photo circle (Alex, 18 Nov: "appears to be an oval", then "the bust crop wasn't done successfully"). `shared/card-brand.jsx`, `team/network.jsx`, `styles/base.css`, `styles/prof21.css`.

- Root cause: two circles were stacked. The Portrait (108px, its own gold band and dark disc) sat inside a `<button>` that kept the browser's default padding (1px 6px), so the button was 120x110 and the Portrait sat off to one side; the empty-state overlay then drew a second dark disc (`::before`, inset 5px of the button) on a different centre, so the gold band looked thicker on one side. The bust (`::after`) was clipped by the button-sized box, not by the disc, so its shoulders ended in a flat cut.
- Fix: `.ff-photobtn` gets `padding: 0` (base.css), so the button is exactly the Portrait's size. `Portrait` takes optional `children`, drawn inside its own dark disc in place of the initials when there is no photo; the builder passes the empty-state bust there. The overlay disc (`::before`) is gone; the bust is drawn over the whole disc (head and shoulders on a 100x100 mask) and the disc's round clip shapes the shoulders, like a standard avatar. The v1.51 patch (forced 110x110, `!important`) is removed.
- The "+" (and the camera when a photo is set) moves to right/bottom 8px so it sits centred on the gold band, bottom right.
- Measured (360 to 1440 wide, DPR 2 and 3, page zoom 0.9 to 1.5): button = ring 108x108 (scaled with zoom), disc 98.31x98.31, gold band 4.84px on all four sides, bust box centred on the disc (offset 0, 0).
- Checked, no change needed: the Profile Card face (`.pc17-photo`) on the live profile, Network and share card is round and its no-photo bust is already clipped by its disc. On the home easel the card is drawn in perspective (matrix3d) with a mirrored reflection, so its circle's screen box is not square by design; its layout box is 117x117.
- Merged onto the live page 1795035296-d6d9 (v1.56; its only change was the title, renamed to "FF Team version 1.1. Final"). Artifact version 1795035610-b601.

## v1.56

Profile builder, FF Tag and Media (Alex, 18 Nov 20:46). `team/creator-media.jsx`, `styles/prof21.css`.

- Media always sits below FF Tag, on every size (they were side by side from 900px); FF Tag is only as tall as its contents.
- Media shows two labelled groups with dotted empty boxes: "Profile" (the profile photo) and, after a thin line, "Page" (the pictures across the top of the public profile). While Page is empty a faint second box shows there is room for more.
- The Profile box is the same picture as the Profile Card's photo circle (`profile.photo`): a photo added on the card shows here, and one added here shows on the card (shrunk to 800px; X removes it). Page pictures are unchanged (`profile.media`, up to 12, reorder and remove).
- Merged onto the live page (v1.55). Artifact version 1795035122-bd5c.
- Artifact title restored to "FF Team version 1.1. Final" (title-only publish, no code change). Artifact version 1795035296-d6d9.

## v1.55

- Profile builder (Alex, 18 Nov 20:43): the Let's get started box is centred again on desktop (max 640px, under the Profile Card); it was left-aligned under its heading since v1.29 (`styles/prof21.css`). Merged onto the live page (v1.54). Artifact version 1795034708-9a3c.

## v1.54

Alex, 18 Nov 20:40. `team/creator-media.jsx`, `styles/prof21.css`, `styles/base.css`.

- Profile builder, Media: the first photo box no longer has the gold edge or the small bust mark in its corner (markup and styles deleted); the thin line after the first photo stays.
- Desktop top bar: Home, Network, Bookings and Profile sit further apart (10px gaps, no dividers) and read as quiet buttons — a faint gold-edged squircle that warms on hover, and a soft gold fill with gold-leaf text on the current page. Visible focus ring for keyboard users.
- Merged onto the live page 1795034370-98d9 (v1.53). Artifact version 1795034546-d40c.

## v1.53

- Profile page photos (Alex, 18 Nov 20:10), bug fixes. Phone and iPad: the photos now end exactly on the Profile Card's icon line, which is where the card sits when the page opens, and from there the whole page scrolls as one (the photos no longer stay stuck behind the card until the Overview tabs). While the photos are open, a scroll anywhere on the page, up or down, by touch, wheel or keys, brings the card back up (before, only a long upward drag did). Opening the photos from further down the page brings them into view.
- iPad at every size, portrait or landscape, uses the phone layout; the desktop layout needs a wide window with a mouse or trackpad.
- Desktop: one big photo with every photo in a row below it (arrows and keys step through; the row scrolls left and right after five), in place of the mosaic that opened one photo full size. `components/team/public-profile.jsx` (DeskGallery11, PublicHero), `styles/p12.css`.
- Company Cards (no icon line) keep the previous photo behaviour.
- Checked: `npm run check`, `npm run build`, touch simulations at 390, 820 and 1180 (photos end on the icon line at every scroll position; open photos close on any scroll), desktop at 1280; no console errors. Published over live 1795034255-f8d9 (v1.52), index.html, manifest and one new image. Artifact version 1795034370-98d9.

## v1.52

Bookings and the bar (Alex, 18 Nov 20:35). `team/bookings.jsx`, `styles/bkd.css`, `team/landing-shell.jsx`, `state/seed-data.js`.

- Bookings: the "Are you happy to receive bookings via WhatsApp?" question and its Yes button from v1.49 are removed (component, styles and the `pref.whatsapp_bookings` Question Card deleted). In their place the WhatsApp box has a second row: the Add FireFlair mark (FF in a speech bubble, `AddFireFlairMark`) on a black circle, with "Notifications will also be shown here."
- Mobile bottom bar: the centre FF coin is a mark, not a button (it no longer opens the notification pop-up). Desktop top bar: the FF coin button after Profile is removed. Notifications are to show on Bookings.
- Merged onto the live page (v1.51). Artifact version 1795034255-f8d9.

## v1.51

- Profile builder, Profile Card face (Alex, 18 Nov 20:31): the empty photo with the bust was an oval (120×110, from the photo button's side padding). It is now a true 110px circle on every size (`styles/prof21.css`). Merged onto the live page (v1.50). Artifact version 1795034109-a91a.

## v1.50

- FF Team home, Launch Challenge (Alex, 18 Nov 20:26): the Top 10 rewards tile's faint background symbol is a champagne bottle instead of a credit card (`ChampagneBottle22` in `discover-and-support.jsx`, drawn in the lucide line style). Merged onto the live page (v1.49). Artifact version 1795033808-5463.

## v1.49

Two branches merged (Alex, 18 Nov 20:06): `bk-1206` (Gimli, Bookings) and `shell-1206` (Frodo, top bar and profiles).

### Bookings and Network titles

Bookings and Network titles (Alex, 18 Nov 20:06). Branch bk-1206. `src/components/team/bookings.jsx`, `src/state/seed-data.js`, `src/styles/bkd.css`, `src/styles/titles2.css`, `src/styles/tokens.css` (`--color-platinum-hi`, `--color-platinum`, `--color-platinum-edge`, `--color-wa-deep`), `src/content/data/photos17.json`, `photo-library/library.json`, `photo-library/README.md`, one new image in `src/assets/img/`.

- Titles higher: "Your bookings" and "Explore our network" sit 22px under the top bar instead of 40px, on phone, iPad and desktop. Nothing else on either page moves.
- WhatsApp box: under "When you're selected for a booking, it will be shown here." the question "Are you happy to receive bookings via WhatsApp?" with one Yes button. On tap the circle fills and a tick draws in (no motion with reduced motion on), and it stays answered. For the developers: a Yes/No Question Card, id `pref.whatsapp_bookings` (option `yes`, private), saved through the Q&A adapter and mirrored into the profile's Question Cards (listed in `QUESTIONS`). Signed out it is kept as a guest Q&A answer and filed to the account the next time Bookings is open signed in.
- FF Party packages, Services tab: Event Host is first, with the amount Alex gave; Photography stays second; "Event Services Package" is now "Event Management Package" (role Event Manager; id `svc_events` unchanged, so sign-ups still match).
- Bar tab: Staffing keeps its place and has a platinum face so it reads as different. Text contrast stays well above 4.5:1.
- FF Staff, Shifts with businesses, signed out: three steps (Choose your profession, Set your preferred rates, Set your preferred terms) and Get started, which opens sign-in. No example professions, no confirm step. Signed in is unchanged (it had no confirm step).
- Grow with FireFlair: the FireFlair rewards photo is now the copper-mug Moscow Mule (library vkc10, not used elsewhere on FF Team; its wall is widened to the tile's shape). The pink photo (p14) stays in the library and on FF Party.
- Checked: `npm run check`, `npm run build`, `scripts/check-team-photos.py`, Playwright at 390, 820 and 1180 signed out and with DEV sign-in (WhatsApp tap signed out and carried over on sign-in, all three package tabs, FF Staff both states), no page errors. Not published.

## v1.45

- FF Team hero tagline (Alex, 18 Nov 19:56): capital first letters, "Get Seen, Get Booked, Get Paid." (`home-sections.jsx`; the share message is unchanged). Bigger on iPad: 22–27px from 560px to 759px and 26–28px from 760px to 899px (`styles/home-text.css`); desktop keeps 15–21px on one line beside the card. Merged onto the live page 1795031702-ea2c (v1.44); page saved as `live-v1.45-index.html`. Artifact version 1795032246-a1af.

### Top bar and profile pages

Top left and member profile pages (Alex, 18 Nov 20:06). `src/components/team/landing-shell.jsx`, `src/components/team/team-router.jsx`, `src/styles/v11.css`.

- The FF logo and "FF Team" in the top left now open the FireFlair sites list (no drop-down arrow): FF Team marked "You're here" (its row opens the FF Team home), then FF Staff, FF Party and FF VIP marked "Coming soon", each with its line and address (FFStaff.uk, FFParty.uk, FFVip.uk). The Coming soon rows do nothing. Reuses the prototype's site-menu styles (`ff-acct-menu`, `ff-site`, `SiteMark`) with squircle corners. Closes on a tap outside, Escape or a second tap; button has `aria-haspopup`/`aria-expanded`, the list is a `menu` with arrow-key focus and focus back to the button on Escape.
- The label reads "FF Team" on every route checked (home, Network, Bookings, Profile, a member profile, a company page, an info page, a story address, the invite address), signed in and out, at 390, 844 and 1180.
- Business & Support is no longer at the bottom of someone else's profile page (deleted from the `state.viewing` branch of the FF Team router). It stays on Home, Network, Bookings and your own Profile as before; company pages never had it.
- Checked: `npm run check`, `npm run build`, Playwright at 390 and 1180 (menu open/close, keyboard, outside tap, profile bottom). Not published.
- Published by a three-way merge onto the live page 1795033554-e789 (v1.48, home questions), so its work stays. Artifact version 1795033593-2c64.

## v1.48

FF Team home, "Can FF Team help you?" (Alex, 18 Nov 20:21; question agent). `src/components/home/growth-and-terms.jsx` (team questions only).

- Three questions, three answers each:
  1. "Do you work in events?" Yes (Create your Profile Card) / No, but I'd like to (Explore the network) / What kind of events? (private parties, weddings, corporate events, festivals, launches and more; See events and support).
  2. "Are you a freelancer?" replaces "Do you work in hospitality?": Yes (Create your Profile Card) / No, but I'd like to be (See events and support) / What is a freelancer? (self-employed, you choose your work and rates, work for different clients and look after your own tax; Read FFStories, which has the freelance bartending guides).
  3. "What would help you most right now?" Getting booked (button now Create your Profile Card) / Training events (replaces Building my team; See events and support) / A support network (replaces Collecting reviews; Explore the network).
- Checked: `npm run check`, `npm run build`, home page at phone and desktop width with answers opened (no overflow, no console errors).
- Published over live 1795033110-6709 (v1.47), index.html only (all other files kept). Artifact version 1795033554-e789. Built page saved as `live-v1.48-index.html`.

## v1.47

FF Team home, FF Party Launch Event intro (Alex, 18 Nov 20:16; writer agent). `src/components/home/discover-and-support.jsx`.

- The intro above the launch video no longer says "It kicks off with our training, a cocktail training competition and the FF Party launch event". It now reads: "When the 90-day challenge ends, our marketing campaign begins. It opens with the FF Party launch event. Cocktail masterclass. Cocktail competition. Launch party. One night, all three. Then our UK‑wide marketing gets to work, bringing jobs and bookings to you and your team." (writer agent's recommended option of three).
- Checked: `npm run check`, `npm run build`, home page screenshot at phone and desktop width.
- Published over live 1795032854-05d4 (v1.46), index.html only (all other files kept). Artifact version 1795033110-6709. Built page saved as `live-v1.47-index.html`.

## v1.46

Network, Vooshka Company Card (Alex, 18 Nov 20:12). `data/companies/profiles/vooshka.json`, `data/companies/company-profile.schema.json`, `src/content/companies.js`, `src/components/staff/company-shape.jsx`, `src/components/staff/company-cards.jsx`, `src/content/companies/real-companies.json` (rebuilt with `npm run companies`).

- The Vooshka card gets the "Company Card" plate back and loses the FF logo, so it matches the directory cards exactly. Its logo and everything on its page stay as they are.
- New card field `card.plate` (format 2 schema): a signed-up company with `plate: true` shows the plate and no FF logo (`claimed = !co.unclaimed && !co.plate` in `CompanyCardFace`). Only Vooshka sets it.
- Checked: `npm run companies`, `npm run check`, `npm run build`, Network page screenshot of the Mobile cocktail bars row.
- Published over live 1795032246-a1af (v1.45), index.html only (all other files kept). Artifact version 1795032854-05d4. Built page saved as `live-v1.46-index.html`.

## v1.45

- FF Team hero tagline (Alex, 18 Nov 19:56): capital first letters, "Get Seen, Get Booked, Get Paid." (`home-sections.jsx`; the share message is unchanged). Bigger on iPad: 22–27px from 560px to 759px and 26–28px from 760px to 899px (`styles/home-text.css`); desktop keeps 15–21px on one line beside the card. Merged onto the live page 1795031702-ea2c (v1.44); page saved as `live-v1.45-index.html`. Artifact version 1795032246-a1af.

## v1.44

Network, FF Event Directory (Alex, 18 Nov 19:50). `data/companies/profiles/vooshka.json`, `src/content/companies.js`, `src/content/companies/real-companies.json` (rebuilt with `npm run companies`).

- The Vooshka Company Card now matches every other company card: Classic layout (logo left, words right) instead of Centred, and the standard frame instead of the gold one. As a claimed company it keeps the FF logo top right in place of the "Company Card" plate (the existing rule for claimed companies).
- Checked: `npm run check`, `npm run build`, Network page screenshot of the Mobile cocktail bars row.
- Published over live 1795031374-236e (v1.43), index.html only (all other files kept). Artifact version 1795031702-ea2c. Built page saved as `live-v1.44-index.html`.

## v1.43

Bookings, FF Party packages wording (Alex, 18 Nov 19:20). `src/components/team/bookings.jsx`, `src/components/party/terms-and-packages.jsx`.

- Title is "FFParty – Our packages" on all three tabs (the tab already names Bar, Entertainment or Services). One title keeps the heading at one size on phones; a title per tab would shrink "entertainment" to a much smaller size.
- Intro no longer says FireFlair sets the pay rate for each package: "Be your own boss. Sign up to the packages you want to deliver, or create your own. Every package shows what you earn before you sign up, and you deal directly with the client, with FireFlair here to support you. The rates are strong, so we expect strong work in return."
- Term 1, How packages work: "A package is a fixed offer that clients book on FF Party. Every package shows what you earn before you sign up: FireFlair sets it on FireFlair packages, and you set it on your own. By signing up you agree to that amount."
- Checked: `npm run check`, `npm run build`, Playwright at 390 and 1280 on all three tabs (cards unchanged: equal heights and gaps, no overflow, no console errors), terms in the Event brief and invoice.
- Published over live 1795031295-681c (v1.42), index.html only (all other files kept). Artifact version 1795031374-236e. Built page saved as `live-v1.43-index.html`.

## v1.42

FF Team home (Alex, 18 Nov 19:42). `discover-hub.jsx`, `team-home.jsx`, `styles/home-text.css`, `tokens.css` (`--color-ink-warm` #16130F).

- Your bookings pillar (Aragorn's option 1, as Alex chose): the pillar opens to the title "Built for getting you bookings", its intro, and the "How bookings work" box in black and gold (the four-symbol flow; its drop-down opens the four step cards). The 1-2-3 drop-downs there (Set your rates, Requests on WhatsApp, Get paid on clear terms) are no longer shown on the home page; their content stays in `team-pillars.json` and on the info pages. The separate burgundy box under the pillars is removed.
- The 1-2-3 drop-downs in the other three pillars get the same black and gold on their header row (warm black, gold edge, gold-leaf title and chevron); the opened section stays on ivory.
- Hero: "Get seen, get booked, get paid." is one line from 760px wide (15–21px).
- Colour check: gold leaf on warm black and ivory on warm black are both well above 7:1.
- Merged onto the live page 1795030434-a840 (v1.41); page saved as `live-v1.42-index.html`. Artifact version 1795031295-681c.

## v1.41

Profile builder thread (18 Nov, about 19:40): Professions, Skills/Interests, Qualifications and Profile Card fitting. Merged over v1.40; nothing from other chats removed. Built from branches pb-professions, pb-typecards, pb-qualifications and pb-cardfit (all on GitHub). Published over live 1795030282-bffd (v1.40), index.html and manifest.json only (all other files kept). Artifact version 1795030434-a840. Built page saved as `live-v1.41-index.html`.

Known for review: on Skills/Interests the top-three numbers mark the first three entries; with next-in-line fitting the card may show the 4th entry in place of one over the width, and that 4th entry has no number yet (pending Alex's feedback).

### pb-professions

Profile builder, Professions (Alex, 18 Nov 18:03, 18:59 and 19:19). Builder only; the display page is unchanged.

- **No pop-up.** The Professions sheet is gone (`PE2Sheet`, `PE2ProfEd`, `PE2Picker`, `PE2Item` and their CSS deleted).
- **No professions yet** (no CV, or a CV that gave none): a type box, then every category as a box the size of the
  Attribute boxes (`.ff-agrp t-card` in the same `.ff-acar` rail), each listing its professions. Tap one to add it
  (burgundy with a tick); tap again to remove it. Bar keeps its ranked ladder (Barback to Mixologist, a rising gold
  bar per step); other categories are alphabetical. The rail scrolls across on phones and wraps from 700 px.
  It stays open while they pick, with the chosen professions appearing as tiles above it.
- **Professions already there:** the tiles, then a "+" box. The "+" opens the same type box and category boxes under
  the row and turns into a burgundy close (x). Alex picked this flow (19:26); the "type" variant (type box with
  suggestions, then a category picker) and its `PROF_ADD_MODE` switch were deleted. The tiles row always starts at the
  first tile, also when the "+" opens or closes the boxes.
- **Any profession:** typed ones that FireFlair can't place still get "Which category is ...?", now with Other.
- **Length:** typed professions up to 60 characters (`PROF_MAX_LEN`); the boxes wrap between words. The Profile Card's
  16-character rule is only for the card (an entry that doesn't fit is left off whole, never cut); not built here.
- **Top three** (Alex 19:19): the first three professions (`FEATURE_LIMIT`) go onto the Profile Card, so the builder
  marks them with a gold number tab (1, 2, 3) on the tile's top edge and a stronger gold border. The tiles can now be
  dragged into order (handle bottom right; arrow keys work too). Shared marking for other sections: `.ff-top3` on
  the entry's wrapper plus a `.ff-top3-n` child holding the number (CSS at the end of `src/styles/prof21.css`).
  `ProfTiles21` takes new `reorder` and `top` props; the display page passes neither.
- Files: `src/components/team/profile-edit-p2.jsx`, `src/components/team/attribute-cards.jsx` (`ProfTiles21` props
  only), `src/styles/profile-edit-p2.css`, `src/styles/prof21.css`.
### pb-typecards

- **Skills and Interests are typed straight onto their cards** in the profile builder's Attributes rail (new
  `src/components/team/type-cards.jsx`, `TypeCards26`; CSS `src/styles/type-cards.css`). The old tap-to-open editor
  (TypeBox21 + tiles) is no longer used for these two; Qualifications is unchanged.
- A card holds 5 entries. The last card has the type line; when it fills, a new empty card appears and the cursor moves onto it.
  Enter or a comma adds an entry (pasting a comma list adds each one); Backspace in an empty line removes the last entry;
  tapping an entry opens it to edit, with earlier / later / remove buttons. Mouse and pen can drag entries to reorder.
- **Top three:** the first 3 entries in order go on the Profile Card; they carry a small gold number. A top-three entry over
  16 characters shows its number hollow with a dashed edge (it can't go on the card).
- Profile entries may be up to 60 characters (wrap between words; one long word shrinks). The Profile Card
  (`PlayerFace17`) leaves out a Skill or Interest over 16 characters whole, never cut and not replaced.
- Data shape unchanged: ordered records in `profile.records.skills` / `.interests`. Order is `rankedRecords()` (rank, then
  list order); moves dispatch `REC_MOVE { id, to }`, which rewrites ranks from positions. New entries join the end.
  CV imports fill the cards 5 at a time (no cap).
- Title Case: `CAP_SMALL17` now also keeps an, or, at, by, upon and with lower case.
- The Profile Card editor's Skills / Interests chips: 60-character limit, Title Case on add, neutral placeholders
  ("Skill", "Interest") in place of instruction text.
- The public profile is unchanged: it already shows 5 per card and never an empty card.
### pb-qualifications

Qualifications in Attributes, on the left (Alex, 18 Nov 18:59 and 19:19). No version bump.

- **Builder:** Qualifications is the first (left-hand) Attributes card (`PE2_ATTRS` order). The card is typed onto: one
  line at its foot, Enter adds the entry (`QUAL_MAX_CHARS = 60`; names wrap between words, never split). Tapping an
  entry opens its editor under the rail (no pop-up): details, up to 4 pictures (`record.media`) and one document
  (`record.document`). The document slot is new in `EntryEditor21` for any category whose def has `"document"` (only
  Qualifications today); it reuses the existing record shape and file rules from `GenericAttributeCardCreator`.
  Empty cards still show on the builder so people can type onto them.
- **CV = a qualification:** uploading a CV in Let's get started (`CVUpload17`) now also saves it as the Qualification
  record `{ name: "CV", cv: true, document }` (`pbqSaveCV`, same record `CVPanel` makes; a new upload replaces it).
  Deleting the CV entry (trash in its editor) takes it off the public profile.
- **Public profile:** empty cards are never shown. Qualifications is the left-hand card and shows only with at least one
  entry; the CV counts. Anyone can open the CV from the card (and from View all) while `SHOW_CV_PUBLIC = true`
  (src/components/team/pb-qualifications.jsx); set it false to keep the CV off public profiles. Entries with a document or
  pictures show small marks after the name. Certificates are not openable by visitors (file name in View all only).
- The CV is left out of the FF AI introduction and About-me facts (it is a file, not a qualification name).
- Qualifications are not on the Profile Card (unchanged).
- **Back end (Griffy):** each entry is card-section data (`POST|PATCH|DELETE /api/user/card/sections/:sectionId/data`).
  Needed per entry: `name` (<= 60), `description`, `media[]` (<= 4 images, S3), `document` (one file: name, size, type,
  url), `cv: boolean`, `hidden`. The repo does not document the per-entry media field; the prototype stores data URLs.
  The CV file must be served to visitors at a public URL (`document.url`; the front end prefers it over `dataUrl`), and
  removed from storage when the member deletes the CV entry.
- Files: new `src/components/team/pb-qualifications.jsx`, `src/styles/pb-qualifications.css` (manifest after
  profile-edit-p2.jsx); small edits in profile-edit-p2.jsx, attribute-cards.jsx (one line in `EntryEditor21`),
  public-profile.jsx (`attributesOf` order and CV filter, `AttrGroups`, `ExpandedAttrs`), introductions.jsx,
  creator-media.jsx, profile-builder.jsx (`CVUpload17`).

### pb-cardfit

- Profile Card (large share card and small site card): every row now shows the member's "top three" (Professions, Skills,
  Interests, Locations). If a top-three entry doesn't fit, it is left out whole and the next entry in the member's order that fits
  takes its place, so the row still shows up to three. `pc17Fit` walks each row's ordered list (`PC17_PER_ROW = 3`); large card
  rows may run to two lines, the small card stays one line. If the large card's box would reach the footer, the row with the
  most entries on two lines is re-walked on one line. Never truncates, never splits a word.
- `meAsStaff` gives the card a `cardLists` pool (all visible professions/skills/interests in order); `professions`/`skills`/`interests` stay top three for everything else.
- Locations on the card: town or city only, each once (`cardPlaces17` in src/utils/text17.js): "Montreal, Quebec, Canada" -> Montreal;
  "St Albans, UK" + "London, UK" -> St Albans, London. A name with no comma (UK, Scotland, International) stays as it is.
  Card only for now; the profile page is unchanged.
- Capitals: "upon", "under", "le", "la", "de", "du", "en", "sur" stay lower case inside names ("Newcastle upon Tyne").


## v1.40

- Home questions ("Can FF Team help you?", Alex 18 Nov): back to Alex's original questions from v16.66, in a new order. 1 "Do you work events, or would you like to?" (Yes, I work events / I'd like to), 2 "Do you work in hospitality?" (Yes, it's my career / Not yet, but I'd like to), 3 "What would help you most right now?" unchanged. The Launch Challenge question and "I'd like shifts around my main job" are no longer in the box; "No, I'm here for something else" is left out because it only led to FF Party (Alex chose to drop it). `components/home/growth-and-terms.jsx`.
- Also repairs the live page: version 1795029777-6437 (v1.39) did not load (SyntaxError) because every "VER" in the published file had been replaced with `version:"1.39"` (e.g. `VERIFICATION_LEVELS`, `FF_LOGO_SILVER`, `FI_VERSION`); this publish is built from GitHub, so that is gone. It also carries the palette tokens from d9face0, which were on GitHub but not yet live. Check, build and phone/desktop screenshots of the questions done (no journey-test script in this repo). Artifact version 1795030282-bffd.

## v1.39 (homepage)

FF Team home on iPad and desktop (Alex, 18 Nov 19:16). `styles/home-text.css`.

- Pillar tiles: the chevron moves to the bottom right, beside the title. The photo is shorter and ends above a champagne band with room for the title, so the words never sit on the photo (titles were wrapping onto the photo with four tiles in a row). With four tiles in a row (from 1024px) the band is 84px and fits a two-line title; the title size there is 18–23px. iPad (760–1023px) keeps one-line titles with a 60px band.
- Hero (900px and wider): the welcome title, "Get seen, get booked, get paid." and Create your profile card sit in the bottom left of the photo instead of the middle.
- Published as a patch onto the live page 1795028903-26df (v1.38), so every other chat's work stays; merged page saved as `live-v1.39-index.html`. Artifact version 1795029777-6437.

## v1.39

- Palette (Alex, 18 Nov 19:21): champagne, rosé and sage are added to the FireFlair colour palette for future use, as
  tokens in `src/styles/tokens.css` (`--tone-champagne-*`, `--tone-rose-*`, `--tone-sage-*`: light, deep, ring,
  accent, ink). Champagne is the house choice: the Experience cards (`XP_TONE29 = "champagne"`) and the Phone number
  box (`PHONE_TONE21 = "ff-wa-champ"`). Nothing on the page changes; the next publish carries the tokens.

## v1.38

Bookings, FF Party package cards (Alex, 18 Nov 18:12–19:02). `src/components/team/bookings.jsx`, `src/styles/bkd.css` (pkc-team, pkc-doc and pkc-tabs blocks).

- One card design on every tab: cream face, no gold strip along the top, one heading (the FF Party ribbon; the "+ FF Party +" line is gone). The ribbon icon follows the tab: a cocktail glass for Bar, music for Entertainment, a concierge bell for Services. Bar starts with the highest-earning package.
- Written for the professional who signs up (`PKC_TEAM17`): "You provide" replaces "Includes", and every line speaks to "you" and "the client". FF Party's client-facing catalogue wording (`PKG_CAT17`) is unchanged. The shopping list is off the card face; it sits in the Event brief only (the client buys everything on it).
- Fixed, equal gaps between every part of the card; every card in every tab is the same height (`usePkcEven17`, which keeps the Bar height for the other tabs). Any spare height goes into the three row boxes, so there is never a gap above the footer.
- Details is a button that opens the package's Event brief and invoice (`PkgDoc17`) as a floating panel the width of the screen with a gap below it: FireFlair Ltd letterhead, client and professional, event fields filled in when booked, the package, what you do, shopping list, points, conditions, You earn, and the five FF Party package terms inside the document.
- Bar packages keep their existing amounts from the catalogue (unchanged). Entertainment and Services each list three FireFlair packages (`PKC_EXTRA17`: Live Music, DJ, Entertainer; Event Services, Photography, Event Host), all at the same "You earn" amount Alex set, with a small "to be confirmed" line under the rail and in each brief. Both tabs have their own Confirm.
- Create your own (`BkPkgOwn17`) ends all three tabs and looks like the other cards: name, line, You provide, Ideal for, Duration and You earn are type boxes that grow with their text. Sign up saves one typed Q&A answer per tab (`int.party_package_own_<tab>`, kind `own_package`); name and amount are needed, and a missing one gets a red outline. Signed out, Sign up opens sign-in.
- Checked: `npm run check`, `npm run build`, Playwright at 390 and 1280 on all three tabs (equal heights and gaps on all 14 cards, no overflow or split words, no console errors), Details pop-ups, Create your own filled in.
- Published over live 1795028595-33d7 (v1.37), index.html only (all other files kept). Artifact version 1795028903-26df. Built page saved as `live-v1.38-index.html`.

## v1.37

Profile builder thread (Legolas merge, 18 Nov 19:00). No new features: this release puts the missing source on GitHub so
every chat builds from complete code.

- Live-only code recovered into `src/` (it had been published onto the artifact by hand without its source being pushed):
  - Photo browser and visitor button row (photo-browsing chat, 16:00–17:50): `ffPvScroller11`, `PhotoStrip11`,
    `MediaMosaic`, `PublicHero` in `src/components/team/public-profile.jsx`; Back | Join team | Share row and
    MyShareBtn17 in `src/components/team/network.jsx`; `shareIcon` on `CardShareBtn17`
    (`src/components/shared/card-share17.jsx`); photos for Bruno, Simao, Dany and James in `src/content/people-demo.js`;
    `.ff-ps*` and button-row styles in the head `<style>` of `src/shell/index.html`.
  - Display-page tabs: the open tab joins the tab page, Share champagne with a green WhatsApp mark.
- From branch `professions-review` (approved by Alex): Cocktail Bartender and Mixologist descriptions in
  `src/content/data/profession-descriptions.json`. For the developers: please add profession descriptions to the admin
  tools so Alex can edit them without a code change.
- Merged with v1.36 (Experience, phone box, bookings box, home blurb); nothing from any other chat removed.
- Published over live 1795028117-1329 (v1.36), index.html and manifest.json only (all other files kept). Artifact version 1795028595-33d7. Built page saved as `live-v1.37-index.html`.
- Also recovered into source: the signed-in member button grid on someone else's profile (Back on top, then Add to network | Share | Ask | Availability), which had been patched onto the live page in v1.35/v1.36: `grid11` in `src/components/team/network.jsx`, `.ff-pub-grid11` styles in `src/shell/index.html`.
- Other chats: please merge `ff-team-v1.1` before your next publish; the photo browser now lives in `src/`, so building
  from source no longer drops it.

## v1.36

FF Team home (Alex, 18 Nov 18:37). `styles/home-text.css`, `discover-hub.jsx`.

- "Built for getting you bookings": no gold on phones. The box is one flat burgundy on every size, closed and open. Legolas's alignment of "How bookings work" and the hover-tint fix from v1.32 stay.
- Intro under "Built for event and hospitality professionals" (writer agent), now a two-sentence summary of FF Team: "Made for the events industry, FF Team runs through WhatsApp. Availability requests arrive as shifts come up, with clear terms and conditions for everything you sign up to." Three lines on iPad and desktop, four on phones.
- Published as a string patch onto the live page 1795028072-45c8 (v1.35), so every other chat's work stays; merged page saved as `live-v1.36-index.html`. Artifact version 1795028117-1329.

## v1.35

Profile page, Experience cards (Alex, 18 Nov 18:49). `src/components/team/attribute-cards.jsx`, `src/styles/experience29.css` (v1.35 block).

- No more black cards: the Experience cards are a muted tone that suits the finished profile page. Default
  champagne (`#F8F0DC` > `#E9DAB4`, gold ring, dark ink `#2A1E04`, gold accents `#8A6A1E`). Two more tones are one
  line away: `XP_TONE29 = "rose"` (dusty rosé, burgundy accents) or `"sage"` (soft sage, green accents). Each tone
  sets the card ring too (`XP_TONES29[..].ring`), so there is no dark edge on light cards.
- Pop-up: the note is typed straight onto the card (a borderless text area where the note sits, a faint line under
  it); the separate text box under the card is gone. Done, or closing the pop-up, saves; Remove stays in the pop-up.
- Checked: `npm run check`, `npm run build`; desktop screenshots of the finished profile in all three tones; phone and
  desktop pop-up with a note typed onto the card and saved. Published by a three-way merge onto live 1795027943-0e21
  (another chat's unpushed publish, kept). Merged page saved as `live-v1.35-index.html`. Artifact version 1795028072-45c8.

## v1.34

Profile page, Experience (Alex, 18 Nov 18:39). `src/components/team/attribute-cards.jsx` (`ExperienceEditor29`, new
`ExperienceSheet29`), `src/styles/experience29.css` (v1.34 block).

- One Google search box for Experience: it finds real businesses, and "Add … as a venue" adds one Google doesn't know.
  The numbered rows (1, 2, 3, 4) with an X on the right are gone.
- Every venue shows as an Experience card below. Real businesses carry "View on Google Maps →"; hand-added ones say
  "Added by hand". The card design is kept from v1.33 (colours to be revisited later).
- Tapping a card opens it in a pop-up at its real shape and size, with a text box for what they did there (saved to
  the venue's description and shown on the card as you type). Remove is in the pop-up; closing the pop-up or Done
  saves. Older Experience records open the same way; removing one hides it (nothing is deleted).
- Developers: both callers still pass `onOpen`, which the editor now ignores (it opens its own pop-up).
- Checked: `npm run check`, `npm run build`, phone (390) and desktop (1440) screenshots of the editor, the search
  drop-down and the pop-up; adding a venue and saving a note tested in the page. Published by a three-way merge onto
  live 1795026837-609e (the page label now reads 1.34). Merged page saved as `live-v1.34-index.html`. Artifact version 1795027509-b304.

## v1.33

Profile page (Alex, 18 Nov 17:49), two parallel branches merged: `v11-phone-1749` (phone box, Let's get started) and `v11-venues-1749` (Experience). Published by a three-way merge onto the live page 1795026796-63b5 (homepage v1.32 and other chats' unpushed work stay). The page's version label still reads 1.32 (the homepage chat's number, taken while this was publishing); the next publish corrects it. Merged page saved as `live-v1.33-index.html`. Artifact version 1795026837-609e.

### Phone number box and Let's get started
- **Final colour (Alex, 18 Nov 18:22): champagne box with a green WhatsApp logo** — new default tone `ff-wa-champ` (`PHONE_TONE21`): champagne `#F5ECD3` > `#EADBB4` > `#DCCB9F`, text `#2A1E04`, WhatsApp mark `#1A9E4B`, gold edge. The sage / olive / moss tones below stay available as one-line switches.
Alex, 18 Nov 17:49: the WhatsApp-green phone box was too intense; and on desktop the Let's get started box sits on the left under its heading. Profile builder page (`#/ff-team/profile`) only.

- Phone number box (`.ff-gb21.shine.ff-wa-pfa`), everywhere it appears (Let's get started, the WhatsApp code step, a signed-in member's verified number): the flat `#25D366` with its dark text is replaced by a muted sage / champagne-gold gradient. Three tones, each one class, in `src/styles/prof21.css` (v1.27 block, now driven by CSS custom properties `--wa-bg`, `--wa-ink`, `--wa-mark` …):
  - `ff-wa-sage` (default): light sage-champagne `#D9DFBD` > `#C6CFA3` > `#B0BC8B`, text `#1F2A14` (contrast 7.4:1 or more), WhatsApp mark `#24573A`.
  - `ff-wa-olive`: olive champagne-gold `#D3C990` > `#BDB57B` > `#A3A56A`, text `#1E1F0E` (6.5:1 or more), mark `#1F4A30`.
  - `ff-wa-moss`: deep muted WhatsApp green `#466F52` > `#3B6347` > `#2F5139`, champagne text `#F4EACB` (4.8:1 or more), mark `#EADBB4`.
  - Switching is one line: `PHONE_TONE21` in `src/components/team/profile-builder.jsx` (the three `GoldBox21` phone boxes use `PHONE_BOX21` = `"shine ff-wa-pfa " + PHONE_TONE21`). Plain `.ff-wa-pfa` with no tone class falls back to sage.
  - The edge is a 1px inset shadow (not a border), so the box keeps v1.27's inner width and the number placeholder still fits on a 390px phone. Kept from v1.27: no white inner border line (`::before` off), no shine streak, "Phone number" on its own line, fixed-size white number box (max 220px, code box 180px), country code + number + Verify on one line on a phone. Verify stays black with champagne text when enabled; disabled Verify, focus ring and links follow the tone.
- Let's get started on desktop (`prof21.css`, new rule `.ff .ff-journey > #ff-sec-ffai.ff-start17 { margin-left: 0 }`): the box keeps its 640px maximum width but sits on the left, its left edge in line with the "Let's get started" title. The Profile Card stays centred. Need help? and Book a meeting (other `.ff-start17` boxes) keep the centred rule. Phone layout unchanged.

### Experience (was Venues)
Profile page and profile builder, Experience (Alex, 18 Nov 17:49): "Remove the Favourite bars, and instead of saying Venues, it's going to say Experience … each venue will have the search bar … boxes below."

- **Venues is now Experience** wherever members see it: the section heading on your profile edit page / builder (`profile-edit-p2.jsx`, `PE2_TITLES`), on a visitor's view of a profile and your own live profile (`introductions.jsx`), and the venues category label (`state/records.js`, `BASE_CATEGORIES.venues.label`; the record key stays `venues`).
- **Favourites removed.** The "Worked at / Favourites" switch, the Favourites row and the line "List the venues you've worked at, or your favourite bars." are gone (`VenuesEditor19` and `VenueRows19` deleted from `attribute-cards.jsx`). Only venues you've worked at show.
- **A search bar per venue** (`ExperienceEditor29`, `attribute-cards.jsx`): one numbered row per venue, each with its own Google business search (`VenueSearch17`, the same Places search as before), prefilled with the venue's name, and a small X in a circle to remove it. An empty row with a + at the end adds the next venue. Picking a different place on a row updates that venue (`REC_PATCH`, its note is kept).
- **Experience boxes below** (`ExperienceCard29` / `ExperienceCards29`, new `styles/experience29.css`): full-size onyx landscape cards (260 to 320px wide) replacing the small blue/slate tiles (`.ff-vc19`). Each shows the kind of place (Hotel, Bar, Event venue …, or Employer / Experience), the name in large Inter, a gold map pin with street and area, a gold-ringed icon, the role and dates in gold (older Experience records), the note, and a footer rule with the area and "View on Google Maps →". Venues typed by hand (not on Google) show "Added by hand" and no map link. Squircle corners on the card, its gold hairline and the icon. They scroll across on phones and wrap into a grid from 760px. Tapping a card on the edit page opens its details sheet, as before.
- **Where the design came from:** the onyx venue card `VenueLandscapeCard` from v16 to v17.14 (first in `fireflair-v16.1.html`, commit 9ac5212; last full-size version in `src/components/team/attribute-cards.jsx` at commit 69b680f, "v17.14: Venues replace Experience"): `CardFrame` with the onyx theme and gold hairline, "VENUE" kicker, name, pin and address, a rule and "View on Google Maps →", plus the "Type · Area" footer v17.14 added. Replaced in v17.15 (41de882) by the small blue `.ff-venmini17` cards and in v17.19 (349ae9f) by the `.ff-vc19` tiles. Those two were the other candidates; the v16/v17.14 card was the most finished, so it was ported and brought up to the current rules (squircle corners, Inter, no split words).
- **Older Experience records** (employer, role, dates, from CVs and the real members' work history) still show under Experience, as cards (employer = venue name, role and dates on the card, Google Maps search on employer and location) and as rows in the editor. Picking a Google place on such a row adds a venue record with the role and dates as its note (`details.fromExperience` = the old record's id) and hides the old record (`hidden: true`); removing such a row hides it too. Nothing is deleted.
- Checked: `npm run check`, `npm run build`; screenshots at 390 and 1440 of the edit page (rows, the search open, a venue added, the cards), your own live profile, two real members' profiles, and the old v17.4.5 venue cards for comparison.

Developer notes:
- Data: a venue record with `details.kind === "favourite"` is kept untouched in the data but never shown or edited (`xpShown29`). Do not migrate or delete those records; new venues are saved with `details: { kind: "worked" }` as before.
- `VenueCard19` (the small tile) stays only for the Network page's Venues section, which is switched off (`SHOW_VENUES17 = false`). The old `.ff-ven19` / `.ff-seg19` / `.ff-vc19` rules in `prof21.css` and `rank17.css` are left in place (another chat edits `prof21.css`); they can be deleted when the Network venues code goes.
- The new styles are in `src/styles/experience29.css`, loaded by the Experience components themselves.

## v1.32

"Built for getting you bookings" box, phones (Alex, 18 Nov 18:15; Legolas, branch `bookings-box`). `styles/home-text.css`.

- The gold now runs from behind the chevron down the right side to the bottom right, closed and open, with no line: a 16px gold strip down the whole right edge (grows with the box, narrows to nothing at the bottom right) over a 72×200px wedge behind the chevron, each fully faded before its own edges. The line was the old 150px layer ending in colour, plus the button's hover tint left after a tap; the tint is off on phones, and off on iPad/desktop while the box is open.
- "How bookings work" and the step cards share the title's left and right edges (14px on phones, 30px from 900px); the step row can shrink, so at 360px the cards no longer overflow.
- Contrast (360–430 and 1180, closed and open): title 8.1:1 or better, flow labels 12.8:1 or better, "How bookings work" 9.8:1. iPad and desktop stay flat burgundy.
- Merged onto the live page 1795026408-9c88 (a Share-button update from another chat, not on GitHub), so that work stays; page saved as `live-v1.32-index.html`. Artifact version 1795026796-63b5.

## v1.31

FF Team home, the four pillar boxes (Alex, 18 Nov 18:15). `discover-hub.jsx`, `styles/home-text.css`.

- No gradient on the pillar boxes on phones: plain champagne (#EAE0C3), as on iPad and desktop.
- The chevron is a solid burgundy button with a champagne outline and arrow on every size, open and closed.
- Each tile shows its title only (the subtitle line, e.g. "Your CV, as your own page", is removed from the tile; the text stays in `team-pillars.json` for the pages that use it). Titles are bold (700) and bigger: 25px on phones, 27px on iPad, 24px with four tiles in a row.
- iPad and desktop: the photo comes down to 56px above the tile's bottom edge, since there is now one line of words.
- Merged onto the live page (v1.30); page saved as `live-v1.31-index.html`. Artifact version 1795026094-3cb5.

## v1.30

- FF Team home pillar boxes on iPad and desktop (Alex, 18 Nov 18:04): no fade on the photos. The photo ends cleanly above the champagne area with the words (`styles/home-text.css`); phones unchanged.
- Merged onto the live page 1795025163-2b90 (a profile-tabs update from another chat, not on GitHub), so that work stays; page saved as `live-v1.30-index.html`. Artifact version 1795025706-b439.

## v1.29

FF Team home (Alex, 18 Nov 17:41). `styles/home-text.css`, `discover-hub.jsx`.

- Intro under "Built for event and hospitality professionals" (writer agent): "Bartenders, mixologists, waiters, hosts, DJs and photographers: get seen by clients, confirm bookings on WhatsApp, get paid per shift." It says what the hero's "Get seen, get booked, get paid." means; the CV line and "Explore the boxes below" are gone (the CV is in Your profile). Three lines on phones from 360px (font 12.5–14.5px there, `text-wrap:pretty`); two on iPad and desktop.
- "Built for getting you bookings": one flat burgundy #5C1220 on every size, closed and open, so the box, its chevron button and its inside are the same shade. On phones the gold wedge moved to the top right corner (behind the chevron), as a fixed 150px layer at the top, so it stays put when the box opens and never reaches the labels; the "Review Card" label is ivory again.
- Pillar boxes on phones: the burgundy wedge sits at the top right and fades out completely by the bottom right corner, so nothing sits behind the drop-down's bottom edge; the open tile ends in plain champagne.
- iPad and desktop: no gradients on the pillar boxes or the bookings box.
- The bookings box's chevron button is the same flat burgundy on every size.
- Colour check at 360, 390 and 430 px: pillar words on champagne, bookings title and labels on burgundy. Merged onto the live page (v1.28), page saved as `live-v1.29-index.html`. Artifact version 1795025052-bb9f.

## v1.28

Merged after Alex's approval (18 Nov 17:29): the title lines (branch `title-bars`, Gimli) and the 1-2-3 pillar drop-downs (branch `pillar-dropdowns`, Gimli and Legolas). Applied onto v1.27 and published by a three-way merge onto the live page so the photo-browsing chat's unpushed work stays.

- Title lines (`styles/titles2.css`, wrappers in `discover-hub.jsx`, `discover-and-support.jsx`, `team/bookings.jsx`, one selector in `bkd.css`): wherever a title has text under it, one gold-to-champagne line starts at the top of the title, runs beside the title and its text, and fades out at the text's last line. Titles with no text under them keep the line beside the title only. Network: "Our professionals" and "FF Event Directory" line up with "Explore our network" (they were 19px too far left). Bookings: the text under "FFParty – Our bar packages", "FFStaff – Shifts with businesses" and "Grow with FireFlair" moves 19px right to line up with its title.
- Bookings box on phones, open: the "Review Card" label stays ivory (the gold moves to the bottom corner of the taller box); it is burgundy only while the box is closed.
- Pillar drop-downs (`team-pillars.jsx`, `discover-hub.jsx`, `team-pillars21.css`): inside an open FF Team pillar, the 1-2-3 steps are collapsible boxes (picture, gold number, title, burgundy chevron), collapsed by default; each opens to its full section. Picture wells use the deeper champagne from v1.25.
- Checked: `npm run check`, `npm run build`; screenshots at 390, 820 and 1180 of the bookings box open and closed, an open pillar with a step open, and the Network titles. Merged page saved as `live-v1.28-index.html`. Artifact version 1795023137-ff60.

## v1.27

Profile builder, "Let's get started" (Alex, 18 Nov 17:06). Published by a three-way merge onto the live page
(live 1795022225-c9ef), so the photo-browsing chat's unpushed work and the homepage v1.25/v1.26 all stay.

- Talk or type to GPT now works exactly like the CV upload: the same FF AI extraction (`CV_ADAPTER.ffaiExtract`, with
  the typed text as a one-page document via `CV_READER.fromText`), the same simulated progress bar (0% to 92% over
  40 s, then 100%), and the same approval list with Yes / No / Edit per item and one "Add to my profile" button.
  Before, Talk or type added everything straight onto the profile with no review. Shared code in
  `src/components/team/profile-builder.jsx`: `useFfaiRun17` (runner and progress), `FfaiBar17` (bar), `FfaiError17`,
  `FfaiReview17` (approval list); `CVUpload17` and `StartBox17` both use them. Records from Talk or type carry
  source `{ origin: "FireFlair", location: "Talk or type" }`; from a CV `{ origin: "CV", location: <file name> }`.
- Phone number box, everywhere it appears (Let's get started, the WhatsApp code step, a signed-in member's number):
  flat WhatsApp green #25D366, no white inner border line, no shine; text in dark ink #0B1F12 on the green for
  readability; the WhatsApp mark stays white. "Phone number" always sits on its own line above the entry. The white
  number box is a fixed size (up to 220px, the code box up to 180px) and no longer stretches on desktop; on a phone
  the country code, number and Verify stay on one line. Styles at the end of `src/styles/prof21.css` (v1.27 block).
- Let's get started has a maximum width of 640px on wide screens, centred, so its boxes no longer stretch across the
  page (`.ff-start17`).
- Checked: `npm run check`, `npm run build`, phone (390) and desktop (1440) screenshots, and a Talk or type run with a
  stand-in extraction (progress bar, review list, Edit, Add to my profile; the edited item lands on the profile).
  The merged page is saved as `live-v1.27-index.html`. Artifact version 1795022470-524d.
## v1.26

FF Team home, phones only (Alex, 18 Nov 17:12, from his sketch). `styles/home-text.css`.

- Pillar boxes: the champagne-to-burgundy edge now runs diagonally (burgundy wider at the top right, narrowing to the bottom right), as drawn; the chevron is a solid burgundy button with a champagne outline, so it reads on either side of the edge.
- "Built for getting you bookings": the same diagonal, larger, in gold, coming in from the bottom right (burgundy into gold #C9A227 into gold leaf #EDD58F). The last label ("Review Card") sits on the gold, so it is burgundy. The champagne top-right glow from v1.25 is gone.
- Colour check at 360, 390 and 430 px: every pillar word stays on champagne and every bookings label on its own colour (ivory on burgundy, burgundy on gold).
- Published as a string patch onto the live page (1795022040-46b2, published by another chat after v1.25 without pushing), so its work stays; the merged page is saved as `live-v1.26-index.html`. Artifact version 1795022225-c9ef.

## v1.25

FF Team home page `#/ff-team` (Alex's homepage thread, 18 Nov 16:26–16:59). New file `styles/home-text.css`, loaded after `home-colours.css`; two tokens in `tokens.css` (`--color-champagne-box`, `--color-champagne-deep`).

- Titles (`discover-hub.jsx`): "Built for event and hospitality professionals" (was "FF Team is for…"), with a two-to-three line intro in place of "Find out how it works"; the bookings box title is "Built for getting you bookings".
- New intro lines (`discover-and-support.jsx`, class `.ff-sec-intro`): under "FF Team Launch Challenge" (what the challenge is, in plain words) and a new "FF Party Launch Event" title with a few lines above the door video (what happens when the 90 days end). Copy by the writer agent; "UK‑wide" uses a non-breaking hyphen.
- Pillar boxes are champagne (#EAE0C3) when closed as well as open. On iPad and desktop the photo stops above the words and only fades over its last part, so the fade no longer covers the photos.
- Open pillar: no dark inset bar at the top of the box; "Build, share, grow" and the section titles inside the pillars are smaller and sit higher.
- 1-2-3 picture wells: deeper champagne (#DCCB9F) instead of rosé (also covers the coming drop-down steps, `.ff-st21 .ph`).
- Phones (under 760px): pillar boxes run champagne into burgundy (burgundy behind the chevron; chevrons switched to champagne on burgundy); the open tile fades back to champagne at its bottom edge so it joins its box. The bookings box runs the other way: burgundy with champagne glowing in from the top-right corner behind the chevron. Colour check (360/390/430 px): all pillar and bookings text sits on its own colour field (champagne behind the pillar words, burgundy behind every bookings label and the title).
- Published by a three-way merge onto the live page (live 1795020546-7c3f, published by the photo-browsing chat without pushing its code), so the live photo-browser work stays. Its source is not in `src/` yet: that chat still has to push it. The merged page is saved as `frontend-export/ff-team-v1.1/live-v1.25-index.html` for reference.
- Artifact version 1795021775-72c9.

## v1.24

- Home pillars (Alex, 18 Nov 16:04): when a pillar is open, its tile is the same cream as the box below it (#EAE0C3; on wide screens the photo fades into it), so the tile and its content read as one continuous box. Closed tiles stay ivory to sand with the burgundy border. `styles/home-colours.css`.
- The 1-2-3 cards inside the pillars (Alex, 18 Nov 16:07): their pictures are screenshots on cream, which matched the cream box. The picture well is now a soft rosé (#E8CCD0) and the picture is multiplied onto it, so the cream turns rosé and dark parts stay dark.
- Title line, site-wide (Alex, 18 Nov 16:05): no dark gold. Gold (#C9A227) fades into champagne (#DCC48C) and then fades away, beside every section title, profile label and page title. On the Network page the line only runs beside the title and the first two lines of the description (`styles/titles2.css`).
- Journey tests 48/48. Artifact version 1795018765-be2d.

## v1.23

- Home (Alex, 18 Nov 15:56). The four "What is FF Team?" pillars go back to v1.20's ivory to sand (#FFFCF4 to #F3EAD5) with a burgundy #5C1220 border and burgundy titles; the burgundy version looked heavy on wide screens.
- The "FF Team is built for getting you bookings" box is burgundy (#6E1A2C to #5C1220 to #4A0E1A) instead of plum, with the champagne title, arrows and chevron and no line before the title.
- FFStories: the category buttons (All, How it works, Planning and booking…) are centred under the FFStories title (`styles/home-fix22.css`).
- The natural hero photo from v1.22 is unchanged. Journey tests 48/48. Artifact version 1795017727-c908.

## v1.22

FF Team home page `#/ff-team` only (Alex, 18 Nov 15:29), with the homepage chat's `home-update` branch merged in.

- From `home-update` (Alex, 18 Nov 14:18): a drop-down chevron in the top right of the bookings box (it turns when open;
  the box stays collapsed by default with the four-symbol flow as its summary); a spinning FF coin (`CoinDivider`)
  between FFStories and the door video and another below the video, and no coin under "Can FF Team help you?";
  "Can FF Team help you?" is three questions with three answers each, every answer leading inside FF Team
  (`growth-and-terms.jsx`).
- Title (`discover-hub.jsx`): "FF Team is for event and hospitality professionals", same gold-mark title, with a small
  Inter subheading under it: "Find out how it works" (`.ff-dx-tag`, `titles2.css`).
- Hero, no lighting: the champagne beams (`.ff-hero18::after`) are gone, and the photo itself is the natural photo
  again. The old hero image had violet lamps, a golden spotlight, a light cone and a vignette baked in (`grade.py`);
  it is replaced by the same crop with only an even colour balance (`scripts/hero-easel/natural.py`; `hero` /
  `hero_sm` in `src/shell/ff-img.json`, 1800×850 and 900×425 WebP). Card geometry is unchanged, so the Profile Card,
  its shine, the easel position and the crops (easel above the title on phones) are as before. On wide screens a
  soft dark fade (`rgba(24,6,11,.78)` to clear at 52% of the width) sits behind the words only. Contrast of the
  title `#F7EED8` / line `#E4C36A` against the pixels behind them (2nd percentile): 390 wide 11.55 / 9.40;
  1280 wide 12.21 / 8.19 (worst single pixel 9.32 / 5.97).
- "What is FF Team?" pillars (`home-colours.css`): burgundy tiles (`#6E1A2C` → `#5C1220` → `#4A0E1A`) with champagne
  `#EADBB4` borders, ivory `#FFFCF4` titles, champagne descriptions and chevrons (open chevron: burgundy on
  champagne). The open box is burgundy `#5C1220` fading to `#4A0E1A` at the foot, with one champagne outline shared
  with its tile; its heading is ivory, its text champagne; the cards inside stay ivory with champagne edges.
  Contrast: ivory on burgundy 11.1–15.0, champagne on burgundy 8.3–11.2.
- "FF Team is built for getting you bookings" box: plum (`#5E2759` → `#4E1E4A` → `#301230`) with a champagne edge;
  no line before the title; title, arrows and chevron champagne, labels ivory. The 1-2-3-4 icons are unchanged.
  Contrast: champagne on plum 8.0–12.2, ivory on plum 10.7–16.3. New tokens in `tokens.css`: `--color-ox-hi`,
  `--color-ox-deep`, `--color-plum`, `--color-plum-hi`, `--color-plum-dk`.
- Coins around the door video: both coins are the same distance from the video and from the sections either side
  (the one above comes up 14px, the room FFStories keeps under its cards, `titles2.css`).
- Checks: `npm run check` and `npm run build` pass; journeys 48/48; screenshots at 390 and 1280 (all four pillars
  opened, the bookings box opened) with no page errors and no sideways overflow.
- Artifact version 1795017020-b47e.

## v1.21

- (v1.20 of this thread was briefly published over the home-colour v1.20; v1.21 carries both.)
- CV upload progress bar (Alex, 18 Nov 15:06): the bar now starts at 0% the moment a file is chosen and runs
  steadily to 92% over 40 seconds, then holds at 92% if the extraction is still running, and jumps to 100% as soon
  as the extraction comes back. It is a simulated (time-based) bar: OpenAI gives no real progress during the
  extraction, so there is nothing to report from the backend. Developers: start a 40 s timer on upload
  (`CV_SIM_MS = 40000`, `CV_SIM_MAX = 92` in `src/components/team/profile-builder.jsx`), set 100% when the
  backend confirms the extraction is complete. The old phase-based and streamed-characters progress is removed.
- CV approval list (Alex, 18 Nov 15:07): every item is now Yes / No / Edit. Edit opens the value in place (a text
  box, or a larger box for About me and long items); an edited item is ticked Yes and is added to the profile as
  edited. Name, About me, every section item and Question answers can be edited. Applied through
  `cvWithEdits17()` before `ffaiApplyLocal17()`; styles `.ff-cvok17 .yn` (three buttons) and `.ff-cvok17 .ed`
  in `src/styles/v11.css`.
- Artifact version 1795014646-7617.

## v1.20

- FF Team home colours: ivory and burgundy (Alex, 18 Nov 14:53, from option 1 "Ivory and wine"). Every colour on the
  front screen now comes from one set: ivory, burgundy, gold, champagne. Switch `FF_HOME_COLOUR = 4` in
  `src/components/home/team-home.jsx` (root class `ff-home-c4`; 0 gives the v1.18 look). Styles in
  `src/styles/home-colours.css`; the unused options 1–3 were removed from it.
- "What is FF Team?" pillars: ivory tiles `#FFFCF4` to sand `#F3EAD5` with a burgundy `#5C1220` border; titles in
  burgundy (Cinzel), descriptions `#4A443A`, burgundy chevron on burgundy tint `#F7E9EC` (ivory on burgundy when
  open). Open: the tile and its box share one burgundy outline (border, top line and curved joins); the box keeps its
  cream `#EAE0C3` content. On wide screens the photo fades into the sand.
- "FF Team is built for getting you bookings": gold leaf `#F7EAC2` to `#EDD58F` to `#E2C677`, gold-mid `#B08D2A`
  border, burgundy title and title marker, ink labels `#1A1712`, burgundy arrows.
- Hero: the violet beams are now champagne spotlights, `rgba(255,244,214,.85)` peak and champagne `#EADBB4` at .5.
  Same shape, position, blur and fade as before (bottom-left and bottom-right corners, rising and spreading
  slightly). Burgundy centre, photo, card shine and easel are unchanged.
- Hero line "Get seen, get booked, get paid." under the title in gold `#E4C36A` (option 1's place); it wraps only
  between "Get seen, get booked," and "get paid.".
- Tokens: `--color-ivory`, `--color-champagne`, `--color-gold-leaf` kept; the unused `--color-wine`,
  `--color-bottle`, `--color-bottle-dk` removed.
- Contrast (measured behind the text on the rendered page, 390): title `#F7EED8` 7.2:1 at the lightest pixel; hero
  line 5.7:1 at the lightest pixel, 9.7:1 median. Pillar title 13.1:1, description 8.0:1, chevron 11.4:1 on tint;
  bookings title 8.1:1 and labels 10.7:1 on the darkest gold leaf. At 1280 the words sit over the photo as before;
  the lowest points there are photo highlights (unchanged from v1.18), medians 14:1 and 10:1.
- Artifact version 1795014425-b296.

## v1.19

- Gold title lines (Alex, 18 Nov 14:49): the vertical gold line beside every section title and profile label now has
  fully squared ends (no rounded top or bottom), on every page and width (`src/styles/titles2.css`).
- Network page: "Explore our network" drops its gold underline for a longer vertical gold line that runs down beside the
  title and its description and fades out at the bottom. The description now sits directly under the title text, right
  of the line, and the title sits a little lower on the page. "Our professionals" and "FF Event Directory" use the same
  fading line with their descriptions. New `LinedHead20` in `src/components/staff/network-directory.jsx`, styles
  `.ff-tl20` in `titles2.css`. "Your bookings" and "Your profile" keep their underline. No wording changes.
- Artifact version 1795014110-5553.

## v1.18

- CV upload now reads the CV and asks before adding anything (Alex, 18 Nov 13:58). Built from the live FF Team flow:
  fireflair-frontend `CVPanel.tsx` / `useFfai.ts` / `FfaiReview.tsx` / `utils/ffaiLocal.ts` and fireflair-backend
  `services/ffai/prompt.js`, `suggestions.js`, `documentReader.js`. Ported in `src/utils/ffai-cv.js`.
- "Let's get started" box order: 1 Phone number, 2 Talk or type to GPT (unchanged), 3 CV upload.
- No "Read my CV" or "Replace" buttons. Choosing a file swaps the Upload CV button for a progress bar while the
  file is read and extracted; then the box extends with the approval list: Name, About, Professions,
  Qualifications, Skills, Interests, Work locations, Languages, Experience, Questions. Each item is Yes / No
  (new items start on Yes; items already on the profile show as on your profile); one "Add to my profile" button
  adds the approved ones. The builder then shows them in its sections (same follow-up as Talk or type).
- Extraction uses the live backend's prompt and strict output schema (full_name, about_me, professions,
  qualifications, skills, interests, work_locations, languages, experience, answers, unreadable) with the
  prototype's own lists (professions, categories, languages, Question Card questions), and the live suggestion
  rules (no phone numbers, emails or street addresses in evidence; region-only work locations; About copied word
  for word; capitalised names title-cased; already-on-profile checks).
- Model call: `CV_ADAPTER.ffaiExtract(doc)` in `src/adapters/cv-adapter.js`, through the artifact's `sample`
  capability (`{ sample: { images: true } }`). The real endpoints are noted there: POST /api/user/ffai/extract
  and POST /api/user/ffai/extractions/:extractionId/apply. Scanned CVs and photos go as page pictures.
- Apply: `ffaiApplyLocal17` (the live on-device apply) maps onto the existing records via RECORDS_MERGE, the
  PROFILE patch (name, about) and ANSWER (Question Card answers). Experience keeps the "Employer — Role" title.
- The CV file is no longer stored on the profile (it used to be kept as a Qualification card); it is read in the
  browser and dropped. Existing CV cards are left as they are.
- Failure state: a message with Try again (when a retry can help) and dismiss; nothing is added.
- Journey tests 48/48. Artifact version 1795013639-e2d9.

## v1.17

- Titles (Alex, 18 Nov 14:07: one titling system, no gold dots). Every gold dot beside a heading is now the vertical gold gradient line (light to deep gold, squircle ends, as tall as the title; 5px beside section titles, 3px beside the small uppercase labels). Home, Network, Bookings, profile view and builder, person and company pages. Only `styles/titles2.css` changed. The three page titles (Explore our network, Your bookings, Your profile) keep their gold underline for now, pending Alex.
- Network page (Alex, 18 Nov 14:07; text by Sam). Short texts under the headings:
  - Explore our network: "Meet the event and hospitality professionals of FF Team and discover the companies behind great events. Professionals sign up from all over the world, and bookings are focused on the UK."
  - Our professionals: "The event and hospitality professionals of FF Team, from bartenders and mixologists to managers and front of house, each with their own Profile Card."
  - FF Event Directory: "The UK companies that make events happen, from mobile cocktail bars and DJs to caterers and event services. Each one has its own Company Card."
  (`components/staff/network-directory.jsx`, `network-directory20.jsx`.)
- Journey tests 48/48. Artifact version 1795013227-d4ff.

## v1.16

- Font (Alex, 18 Nov 14:04: "Inter everywhere"). All body and UI text is Inter. The Tailwind file `styles/v101.css` had reset `--font-sans` to the device font and `--font-serif` to Georgia; both now start with Inter. Other fixed system-font stacks switched too (attribute boxes, wallet buttons, terms page). Titles stay Cinzel.
- Inter is built into the page (`src/assets/font/inter-latin-wght-normal.woff2`, variable 100–900, SIL OFL licence alongside), so it loads even where Google Fonts is blocked. `scripts/build.mjs` inlines `ffasset:font/*.woff2`; Google Fonts now loads Cinzel only. Release page +65 KB, no extra files.
- The Profile Card PNG waits for Inter before it is drawn.
- Share message: "Help me win the FF Team Launch Challenge." now has its own line:
  "Check out my profile page and join my team. / Help me win the FF Team Launch Challenge. / Get seen, get booked, get paid. / FFTeam.uk/<tag>"
- Audit at 390 and 1280: text not in Inter or Cinzel went from 968 elements to 0 (apart from the testing-only DEV buttons). Artifact version 1795012571-37ae.

## v1.15

- Share message (Alex, 18 Nov 13:48–13:51). WhatsApp and Share now send:
  "Check out my profile page and join my team. Help me win the FF Team Launch Challenge.
  Get seen, get booked, get paid.
  FFTeam.uk/<tag>"
  The share sheet title is "Check out my profile page".
- One address everywhere: the share link is the member's profile page, FFTeam.uk/<tag>, the same address printed on the Profile Card. Visitors join from the Join team button on the profile. Old /join/<tag> links still open. (`state/invite17.js` holds the link, title and message; `utils/card-export17.js` puts the link on its own line.)
- Journey tests 48/48. Artifact version 1795010275-f98e.

## v1.14

Fixes from the fellowship review of v1.13 (Aragorn, Legolas, Gimli, Sam, Frodo; reports in the Tolkien AI plans folder).
- Page head: title, canonical address, link-preview address and site data now say FF Team and FFTeam.uk (they still said "FireFlair Phase 2" and the FF Party address, which WhatsApp previews read).
- Profile builder: FireFlair Introductions showed twice after the first Save (a card with a pencil and a second block with its own edit button). The second block is gone; the pencil opens the editor.
- Q&A "Asked by …" labels wrap instead of cutting off with "…".
- The WhatsApp code line in the phone box wraps inside its box instead of running off the screen.
- Share sheet: WhatsApp is the green WhatsApp button; the sheet title has no trailing colon. Join links are shown as FFTeam.uk/join/<tag>.
- "Skip to content" moves focus to the page without changing the address (a reload had sent people to Home).
- Company headings read "… across the UK" instead of "… in UK-wide"; a DJ is "a DJ", not "a dj"; the home pop-up close button reads "Close" (it read "Close your profile").
- Checked: the Profile Card PNG keeps uploaded photos. Only the drawn demo avatar drops out of the PNG.
- Journey tests 48/48. Artifact version 1795009266-00ea.

## v1.13

- Testing only (Alex, 18 Nov 12:59): the log-in sheet has DEV sign-ins again so every FF Team screen can be tested — "DEV · complete profile" (Alexander Gagnon with the demo data, notifications and asks), "DEV · join from invite" (arrives from FFTeam.uk/join/alex424) and "DEV · new member" (empty profile). They are marked in `landing-shell.jsx` and must be removed before go-live. Journey tests 48/48. Artifact version 1795007371-ec41.

## v1.12

Artifact version 1795001443-0407.

Alex's first changes after the split (queued 18 Nov 10:20). Branches merged: `v11-a`, `v11-b`.

- Titles (new `styles/titles2.css`, `css-registry.js`, `App.jsx`): option 2 "Gold mark" — a gold coin beside section titles (Our professionals, FF Event Directory, Can FF Team help you?, FFParty, FFStaff, Grow with FireFlair; small gold dot on profile labels). "Explore our network", "Your bookings" and a new "Your profile" page title share the full underline. "What is FF Team?", "FF Team is built for getting you bookings" (soft gold, in its dark box) and "FF Team Launch Challenge" use the gold mark; the coin between the welcome and "What is FF Team?" is gone. "FFStories" is one word, centred, with FF slightly slanted.
- Home (`team-home.jsx`, `discover-and-support.jsx`, `stories-reader.jsx`, `tm20.css`): no "Life at FF Team" title; the door video is full size again; Join FF Team and the coin game are one box again, last on the page.
- Network (`network-directory20.jsx`, `map.jsx`): FF Event Directory opens only Bar companies and Entertainment; the map pins members at the centre of the first place on their profile it knows, so the legend shows Professionals (with group counts) before FF Directory.
- Profile builder (`profile-builder.jsx`, `prof21.css`): Let's get started runs Upload CV, Talk or type, Phone number; the phone box is a muted WhatsApp green (white text 4.8:1 or better).
- Share sheet (`p12.css`): sits above the bottom bar on phones, so Download PNG and Copy Link can be tapped.
- Journey tests: 48/48 at 390/768/1280.

## v1.1

Artifact: "FF Team version 1.1. Final", slug a139e698-9bc3-47b1-93d6-b2e3c541732e, version 1794999824-240d (claude.ai folder "FF Team — Front-end export").

FF Team only, stripped by deletion from the prototype. FF Directory and company pages stay (read-only).

### Build and tooling

- `npm run build` writes `build/ff-team-v1.1.html` (whitespace-minified, as v17.60). It also writes the same bytes as
  `build/fireflair-v17.4.html` for the shared test helpers and `scripts/check-src.mjs`, which still open that name.
- `npm run publish-build` splits `build/ff-team-v1.1.html` into `build/release/` (index.html, hashed images, video).
- New `scripts/check-refs.mjs`, part of `npm run check` (also `npm run check-refs`): parses the joined source with
  Babel's scope analysis and fails on any name that is used but declared nowhere, and on a top-level const/let/class
  used at load time before its file. `typeof` guards are allowed. Names that were already undefined in unreached code
  at 518b5e8 are listed in `scripts/check-refs-baseline.json`; the check names any entry that is no longer found so
  the list shrinks as code is deleted. `--list` prints every global name the source relies on.
- `@babel/standalone` added as a dev dependency for that check: run `npm install` once.
- The FF Team v1.1 artifact is published by hand; `scripts/sync-published-site.sh` is not used on this line (see
  `CLAUDE.md`).

### What was stripped (branches v11-strip, v11-dead)

- FF Team only. Deleted: the FF VIP site (`TeamRouter` moved to `components/team/team-router.jsx`), FF Admin (only the hidden-content readers in `admin-state.js` remain, so admin-hidden reviews stay hidden), payments and the payment adapter, the FF Party home and special requests. FF Staff and FF Party files that FF Team still needs (notifications and the coin count, own questions, date helpers, company pages, FF Directory, package cards, venue cards, FitWords17) are trimmed in place, each with a "v1.1 (FF Team only): trimmed" header.
- Routes: only `#/ff-team/...` (home, network, bookings, profile, `<tag>`, join, info, stories). Any `#/ff-staff`, `#/ff-party`, `#/fx`, `#/areas` or `#/packages` address opens FF Team.
- Top bar: FF logo and "FF Team" (links home); no site drop-down.
- Store and saved state hold FF Team only (saved keys 60 → 42); `company` stays for the read-only company pages.
- Removed: the four DEV sign-in buttons, the "Prototype sign-in" note, the "FireFlair prototype" footer, DEV tags in the FF Directory, the XP bar, sheet, timeline and points (the coin and its pop-up stay), leaderboards, `TeamProfile`, `ReviewsTab17`, `LaunchBar20`, `TEAM_CP21_CSS`, `P1Bookings`, `ProtoNote`, unused FF Staff tiles and terms. FF AI introduces itself as "FF AI".
- `profile-edit-tabs.jsx` (was `aragorn-preview.jsx`) is the own-profile edit page; only option 1 remains.
- Demo profiles stay (one place, for testing); remove before going live.
- Sizes: source JS 2.46 MB → 1.75 MB (125 → 120 files), CSS 405 KB → 372 KB, published page 4.61 MB → 3.78 MB.
- Checks: `npm run check` (with check-refs) and `npm run build` pass; journey tests (`/home/claude/scripts/v11-tests/journeys.py`) 47/48 at 390/768/1280 with no page errors; the one failure is the Share sheet at 390, where the edit bar and bottom menu cover Download PNG and Copy Link (also failing on the prototype).
