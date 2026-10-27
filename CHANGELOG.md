# FireFlair prototype — changelog

## v16.56 — 2026-10-27 — M25 London map, real-map snapshots, richer coin leather
Artifact version 1793143368-1c8b · file `fireflair-v16.56.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- London view of the map: now frames everything inside the M25. The area is one clean Greater London silhouette (the borough outlines are gone), with the Thames drawn as a smoothed river line and a dashed M25 ring labelled "M25". The area names that used to sit over the map are removed; the profile pins stay area-level.
- London outline data: replaced the coarse borough shapes with a detailed outline merged from MIT-licensed London borough boundaries. The M25 ring is a hand-traced guide through the motorway junctions, not survey data; the real site should use proper map data for it.
- The Thames and the UK county lines now show only at the zoom levels where they help, so the UK view no longer has a stray red river line.
- "Put yourself on the map" card: the two hand-drawn images (UK squiggle and globe) are replaced with snapshots of the real map, taken from the Network map at high resolution (UK view and whole-world view, with the FF coin on London). They are static images, so the card stays light.
- Community coin front: the leather background is now one large, non-repeating texture built from the full-size coin artwork (grain, scratches and a soft sheen), instead of a small tile stretched up. It matches the back of the coin.

## v16.55 — 2026-10-27 — Sharper leather on the Community coin
Artifact version 1793142646-356c · file `fireflair-v16.55.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- What is FireFlair? circle, front side: the leather background was rebuilt from the full-size coin artwork, so the grain and scratches are sharp on high-density screens and match the back of the coin.
- The new tile is made seamless, so it repeats without visible joins; it is used on the circle's front and its central Community disc.

## v16.54 — 2026-10-27 — Service Card figures on FF Team
Artifact version 1793136635-429d · file `fireflair-v16.54.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Team Service Cards now show a figure £50 below the FF Party equivalent (all five, including Staff); FF Party and FF Staff are unchanged apart from the Platinum Full Service card, which was updated on FF Party.
- The reduction happens at display time in the shared ServicePoster; FF Party booking cards still read the unreduced data.
- Home divider coins now start after DOMContentLoaded (with a load fallback) instead of waiting for the full window load.

## v16.53 — 2026-10-27 — Community coin front: leather, red ring, richer gold
Artifact version 1793130028-199a · file `fireflair-v16.53.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- What is FireFlair? circle, front side: enhanced using the look of the coin's back, with the layout unchanged.
  - Background: black leather with fine scratches, taken from the new FF coin artwork and made seamless, plus a soft warm light in the middle and a darker edge.
  - A thin deep-red ring (with a dark gap either side) now runs just inside the rim, echoing the red ring on the coin.
  - The outer rim is a richer, metallic gold gradient that goes round the circle, brighter at the upper left, instead of the earlier flat gold.
  - The central Community circle keeps its shape and burgundy, now with leather texture, a gold rim and its own red ring, and a warmer glow.
  - The six gold icons have a brighter metallic gold face with a dark gap and a fine gold ring; the spokes are a warmer gold; the labels have a gold edge and a soft shadow.
- The texture adds about 10KB to the page. It is part of the circle's styling, so it appears wherever the circle does.

## v16.52 — 2026-10-27 — One-circle profile photo button
Artifact version 1793129803-a7d2 · file `fireflair-v16.52.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Team profile card, photo button: now one circle. With no photo yet, the circle itself carries a gold camera icon in the middle; the extra gold camera circle and the black "+" badge are gone. Once a photo is added, the photo shows with a single small camera button to change it.

## v16.51 — 2026-10-27 — Larger FF coin on the back of the What is FireFlair? circle
Artifact version 1793129739-e1bc · file `fireflair-v16.51.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- What is FireFlair? circle: the back of the spinning coin now uses the new larger FF coin (the "gold bright" file from the supplied logo assets), filling the whole face. It was cropped to a clean circle and resized to 1120px (about 200KB) so it stays sharp on high-density screens. It is only loaded when the coin is ready to spin, so slow devices never fetch it.
- The other logo files stay in assets/ff-coin/ for later. The Review and confirm coin is unchanged.

## v16.50 — 2026-10-27 — Gold-on-gold coin edge; smaller logo back on the circle; FF coin logo files kept
Artifact version 1793129604-4e06 · file `fireflair-v16.50.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Coin edge lines on both big spinning coins are now a different shade of gold (tone on tone, like an indented milled edge) instead of near-black, so they no longer stand out too much.
- What is FireFlair? circle: the back of the coin goes back to the smaller FF logo on the dark disc with the gold border, until a larger, higher-resolution FF coin is supplied.
- New FF coin logo files (gold dark, gold bright, gold white, silver white, silver white alt; lossless masters plus 1x and 2x WebP) are kept in the repo under assets/ff-coin/ for later use. They are not used on the site yet. They have solid backgrounds, not transparency.

## v16.49 — 2026-10-27 — Ridged coin edge, full-size FF coin on the back of the circle
Artifact version 1793129119-6125 · file `fireflair-v16.49.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Both big spinning coins (Review and confirm, and the What is FireFlair? circle) now have a milled, ridged edge: fine dark and gold lines run across the rim, like the reeding on a real coin, and show as you spin it. The lines scale with the size of the coin.
- What is FireFlair? circle: the back of the coin is now the full-size FF coin logo filling the whole face, instead of a small logo on a dark disc.

## v16.48 — 2026-10-27 — Host Card, social links on all three profiles
Artifact version 1793128965-036a · file `fireflair-v16.48.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Party profile: the step is still "Your FF Party Card", but the card itself is now labelled "Host Card" (the Company Card plate on the FF Party site says "Host Card" too).
- Host Card: five social icons (WhatsApp, LinkedIn, Instagram, Facebook, TikTok) sit centred along the bottom of the card. They are dim until a link is added, then light up.
- FF Party profile: new "Social links" drop-down (collapsed by default) to add those links. Each row is named, so nobody has to guess the icon.
- FF Team: "Social links" is now a drop-down section on the profile, not on the Profile Card. Visitors to someone's profile see their links with the site names; the section only shows when they have added some.
- Company profile (FF Staff): the social links rows now show the site name above each box (WhatsApp, LinkedIn, Instagram, Facebook, TikTok) instead of just an icon and "yourname". The same named editor is shared by the Company Card, the Host Card and the FF Team profile.

## v16.47 — 2026-10-27 — No Later button, confirm folds back to the coin, role box opens itself, Shift gap fixed, coins start reliably
Artifact version 1793128866-170f · file `fireflair-v16.47.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Company Card prompt on the FF Staff booking page: the "Later" button is gone, so it can't be dismissed and lost. The prompt simply disappears once the person has saved a Company Card.
- Review and confirm: with the review open, tapping the Confirm bar folds it back into the coin.
- Coins: the 3D coin and the home-page coin dividers no longer wait for every last page resource to finish loading. They start once the page is usable (DOM ready, then idle), with a 2.5 second fallback, so a slow or stuck resource can't stop them. Reduced motion no longer blocks the drag-spin, because the person is driving it. Data-saving, 2G and low-memory devices still keep the coins flat.
- Shift details: the role box opens by itself on a card that has no role yet, so the roles are ready to tap.
- Role categories: Chefs now sit between Services and Back of House (applies wherever the profession categories are used, including FF Team profiles).
- Shift cards: fixed the big gap that opened under the Shift card when there were several cards. The strip is now exactly as tall as the card you are on, so shorter cards no longer leave empty space before the booking box.
- Your next step (FF coin): each step now shows once; the highlighted next step is no longer repeated in the list below it.

## v16.46 — 2026-10-27 — 3D coins (confirm and Community circle), role plus icons, staff capped at 10 with search card
Artifact version 1793128432-a744 · file `fireflair-v16.46.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Staff booking: the FF AI box is one line shorter. The Shift details hint now reads "Timing, pay and terms." and the Staff hint reads "Choose your team."
- "Your booking" (the mini Event Card) is back inside the booking box as its first item, so it scrolls with the role cards. The arrow bubbles still point at the selected role card.
- Terms and conditions, point 5, is now "Conduct and dress code" (the text mentions the dress code too). Changed in both places the default terms are defined.
- Review and confirm coin: rebuilt as a shared 3D coin component (Spin3D11). It is a flat still disc until ready; then it gets a stack of gold discs for a thick rim (the same idea as the home-page coin dividers) and a back face. The back face wears exactly the same rim as the front, and the FF logo on it is centred (measured at 0px off in both directions).
- The 3D coin only switches on once the page has loaded and the coin is within 600px of the screen. It stays flat and still on data-saving or 2G connections, low-memory devices (2GB or less) and with reduced motion. Nothing runs while idle: it only moves while you drag or swipe it, and a tap still presses the button.
- What is FireFlair? circle uses the same component: swipe or drag it and the whole circle turns as a thick gold-rimmed coin, with the full FF logo on its back in the same gold border.
- Shift card role picker: every role you can pick now has a "+" to its left; the categories above are plain tabs with an underline, so it reads clearly which row is which. The category tabs scroll sideways on their own without moving the whole card.
- Staff box: shows up to 10 staff cards, with a final dashed "+" card that jumps to the search. The box has more padding so the cards sit fully inside it.

## v16.45 — 2026-10-27 — Gold-ringed What is FireFlair? wheel; FF Team home follows Discover order, Community first
Artifact version 1793127474-31a2 · file `fireflair-v16.45.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Team home, "What is FireFlair?": the circle is now a solid dark disc with a thick gold gradient border all the way round, replacing the fading black vignette that looked like a smudge. Applies to all three sites.
- FF Team Discover FireFlair cards are back in the earlier order with Community first: Community, Profiles, Services, Cocktail Menu, Events, Career Support, Build Your Team, Get Discovered, Reviews & Reputation, The Platforms (always last).
- FF Team home sections now follow that order, the Discover list leading the page: Discover, What is FireFlair?, Community map, Featured professionals, Services, Career Support, Build your team, Reviews. "Your CV, brought into the 21st century" (the What is FF Team section) moves right down, just above The Platforms.

## v16.44 — 2026-10-27 — Wider booking boxes on desktop, arrow bubbles, spinning confirm coin
Artifact version 1793127066-6785 · file `fireflair-v16.44.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking page on desktop (900px and up): the Event Card, Shift details and Staff boxes, the booking box and the confirm area are now two-thirds of the screen wide (capped at 1180px). Phones and small screens keep the 440px width. The staff box shows many more cards at once. The phone and FF AI boxes at the top stay narrow.
- "Your booking" (the mini Event Card) now sits beside the booking box instead of inside it, so it no longer shifts the role cards or the arrow bubbles.
- Arrow bubbles (the pointers on the open Shift card and the Staff box) are rebuilt. They always point at the selected role card in the booking box, and at the + tile while a new role is being added. They are measured again on every scroll, swipe, resize and selection change. Tested with 2 roles at 400px and 1280px: all arrows land on the role card centre.
- Review and confirm button: the logo and words are now centred together as one unit. Swiping (or dragging with a mouse) spins the coin in 3D to a plain gold back face and settles back to the front; a tap still opens the review. Reduced-motion users get no animation.

## v16.43 — 2026-10-27 — What is FireFlair?, Discover cards per site in home-page order, FF Party What we offer
Artifact version 1793124771-d242 · file `fireflair-v16.43.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Discover FireFlair, by site. Each home page now follows the order of its cards, with What is FireFlair? straight after Discover. The Platforms is always the last card.
  - FF Staff: Company Profiles (seen by everyone you book, and on FF Party so people can book your services), Book Staff, Service Cards (new copy below), Cocktail Menu, Shift cards, Community, Build Your Team, Reviews & Reputation, The Platforms. The home page sections are reordered to match.
  - Service Cards copy: create them to show every potential customer what you offer, and get full, complete bookings for your approval instead of generic enquiries. Every Service Card comes in Bronze (best value), Silver (the middle ground) and Gold (best quality), so each customer gets an accurate quote for the level they pick. Customers can add cocktails to their package.
  - FF Team: Profiles, Services, Cocktail Menu (new: your signature cocktails belong to you, live on your profile, travel to every venue, and businesses and customers can hire you for them), Get Discovered, Build Your Team, Reviews & Reputation, Career Support, Community, Events, The Platforms. "Your CV, brought into the 21st century" moves up to follow What is FireFlair?.
  - FF Party: Service Cards (What we offer), Cocktail Menu, Bartenders & Staff, Companies, Reviews, Your Profile, Favourite Staff, Plan Your Event, The Platforms. Cocktail Menu copy: choose classics or each bartender's or provider's signature cocktails; cocktails and quantities go into your package for an accurate quote; a bar company brings the stock, and individual bartenders come with a shopping list.
- Core Values is now "What is FireFlair?", answered with "The card-based event connection platform." Underneath: "Our dream is to make it easy to build real, lasting connections from every event you attend." The circle is bigger, the dotted ring is gone, and a vignette fades out towards the edge so the outer circles stand out. The words around the circle still differ by site.
- FF Party: a new "What we offer" section straight after What is FireFlair?, for content and SEO. It has the Service Cards, a Plan your event button, six services (mobile bar hire, cocktail bartenders, mixologists and signature cocktails, cocktail masterclasses, full event service, event staff), a "Perfect for" list of 16 occasions (hen parties, stag dos, weddings, birthdays, house parties and more), and a descriptive paragraph. The old "Coming to FF Party" section is gone. The platforms section is added at the end.
- FF Party booking: Service Cards now come first (1 Service Cards, 2 Event Card, 3 Staff).

## v16.42 — 2026-10-27 — 5:7 Discover pop-ups; Discover and Core Values on every home page
Artifact version 1793123499-a581 · file `fireflair-v16.42.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Discover FireFlair pop-ups are now 5:7 cards: the category photo at the top, the text, then the buttons at the foot. The FF coin is top right next to the close button. Content is unchanged for now.
- Discover FireFlair and Core Values now open every home page, straight after the hero, each written for its site:
  - FF Staff: Company Profiles, Book Staff, Shift cards, Community, Build Your Team, Reviews & Reputation, Services, The Platforms. Core Values: "The right people for every event", around event staffing, company profiles, shift cards, the professional network, training and hospitality services.
  - FF Party: Your Profile (favourite cocktails and drinks, house rules, and what your staff should know before they come to your venue, home or chosen venue), Plan Your Event, Service Cards, Bartenders & Staff, Cocktails, Favourite Staff, Companies, Reviews. Core Values: "Every party starts with people".
- Every pop-up button goes to an existing place: the profile page, Create a booking, the Network, or a section of that home page. All 16 were checked.

## v16.41 — 2026-10-27 — Phone-only WhatsApp continue, mini cards on the steps, Your booking box
Artifact version 1793122419-6232 · file `fireflair-v16.41.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Phone number only at the top of Create a booking and on Join FF Staff / FF Party. Email is no longer asked for there. Continue keeps its dark button and now has a green WhatsApp logo, as the one-time code comes by WhatsApp.
- FF AI has moved out of the Event Card to sit under the phone box, tall enough to show its whole prompt.
- Step buttons show a miniature of what opens: a mini Event Card (with the calendar), a mini Shift card, and three profile cards in a fan for Staff (the chosen people's photos once picked).
- Booking box: only shown while Shift details or Staff is open; otherwise the arrow sits there. It's a little taller, and its left side is "Your booking" with a mini Event Card (date, time, place) that opens the Event Card. The role cards follow, and the arrows still line up with the Shift card and the staff box.
- The staff box keeps the Staff button's colour when open and is roomy enough for whole staff cards.
- Shift details: the "Choose your role" line is gone, and the Shift card joins straight onto the Shift details bar.

## v16.40 — 2026-10-27 — Phone-or-email join, Service Card and cocktail builders, aligned booking arrows, Tom fix
Artifact version 1793115244-2d73 · file `fireflair-v16.40.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Tom in everyone's basket: the prototype saves one shared state for every viewer (the artifact's database, document fireflair/state), and "selection" (the basket) was part of it. Someone added Tom once, so he showed for everyone, on every site. The basket is no longer saved, and the stored basket has been cleared. The same shared save had the Company Card set to Forest green, so the card looked green for everyone; it's been reset to Onyx (black) in the middle layout. Bookings, events and profile edits are still shared between viewers; for the real site this needs to be per user.
- Join FF Staff / FF Party: no company name or username at the top (the name comes from the Company Card / FF Party Card). Phone number first, then "or", then email, then Continue. Either is enough. Phone gets a WhatsApp code, email gets an email code (any six digits in the preview). A recognised phone number logs in.
- Create a booking uses exactly the same box at the top. Once joined or signed in, it collapses to one line with the name and the phone/email.
- Company profile: the "Coming with FF Party" box is removed (profile and public page).
- Services tab, now working:
  - Services: "Create a Service Card" builds a custom Service Card in the same frame as FireFlair's own, inside the drop-down, with a live preview. Fields: name, one line, includes, ideal for, duration and an amount the business types in. Colours: Bronze, Silver, Gold, Platinum, Black, White. Tap a saved card to edit or delete it.
  - Cocktail menu: "Add a cocktail" builds a Signature Cocktail card the same way: name, one line, ingredients, method, glass and garnish.
  - Saved on the company profile as svcCards and menu.
- Booking box: 136px tall, so the role cards and the selected outline fit without overlapping. The + tile is the same size as the role cards, with the same-size + icon.
- The booking bar, Shift cards and the staff bubble are now the same width (the section column, 440px at most), so the arrows line up exactly. Checked at 400px and 1280px: the role card's centre, the Shift card's arrow and the staff bubble's arrow land on the same x.
- Staff (step 3), open: no "3 Staff" bar, just the bubble box, full column width, with "Staff for <role>" and a small close button. Staff cards are slightly smaller inside it, so more show at once.
- Shift cards: Confirm, Duplicate and the bin are gone (they sat between the card and its arrow). Remove a role with the X on the booking bar. A new role's Shift card always starts as a copy of the previous one (start, finish, rate, pay) until changed. Hours fill in from start and finish.
- FF AI inside the Event Card is taller, so the whole prompt shows, with the microphone inside the box at the bottom right.
- The FF AI search box in Staff had its microphone sitting on top of the FF AI label; fixed.
- Review: "Review T&Cs" and "Edit T&Cs" side by side. The FF invoice's box reads "T&Cs".
- "How availability works", with an added line: if we're unable to fill your shift, you'll get FF credits for future bookings.

## v16.39 — 2026-10-27 — Linked Shift card carousel and staff bubble; FF Party personal profile
Artifact version 1793114021-12c0 · file `fireflair-v16.39.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking box, built to the four answers from the last round:
  - Shift details is a swipeable row, one Shift card at a time. Swiping to a card selects its role in the booking bar; tapping a role swipes to its card. The first card is selected by default.
  - The selected Shift card has a speech-bubble arrow at its bottom pointing down to its role. The staff box under Staff is a card-width bubble with an arrow at its top pointing up to the same role. Both arrows follow the role as you swipe or tap.
  - The booking bar is about 120px tall. It shows only role cards (a + when empty) and a + to add another role. The earlier diamond markers are gone.
- People picked elsewhere (such as Tom) no longer appear in the booking bar. They show as "Your pick" first in the staff box.
- Shift cards: the Event Card's start time fills in on any Shift card without one (new or existing). Hours fill in as soon as both start and finish are set. The Staff row on the Shift card is gone; the card points to the booking bar instead.
- FF Party profile, for a person rather than a business: no company wording, no FF AI company step and no "Coming with FF Party" box.
  - Step 2 is a 5:7 FF Party Card, mostly the person's photo, with name, profession, interests, favourite cocktails and favourite drinks, and a line saying it's shared with the people they book.
  - Step 3 has tabs: Overview (About me, My kind of party, Favourite cocktails, Favourite drinks, Interests), Favourite staff, and Reviews.
  - FF Staff keeps the company profile.

## v16.38 — 2026-10-27 — Booking box links Shift details and Staff
Artifact version 1793113066-e924 · file `fireflair-v16.38.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking box, as agreed: one row with a fixed height, always between Shift details and Staff. When empty it shows a single +, which opens Shift details with the role picker open. Once there are roles, a + at the end of the row adds another.
- Tapping a role card selects it: two burgundy pointers mark the card, one up to Shift details and one down to Staff. Shift details shows only that role's Shift card ("Shift card 1: Bartender"); Staff shows only people with that profession ("Staff for Bartender"), your team first. Tapping a person puts them on that card, or swaps them in if it's already full.
- Tapping the selected card again deselects it: Shift details shows every card again and Staff goes back to everyone.
- People picked elsewhere (for example from the Network) wait as small faces at the start of the row; tapping one puts them on the selected role.

## v16.37 — 2026-10-27 — Company name join, compact booking box, FF AI in the Event Card
Artifact version 1793112852-0cf4 · file `fireflair-v16.37.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Join FF Staff: no username. You give your company name (your name on FF Party), and the page address is made from it. New companies start with a black (Onyx) card in the middle layout: big logo on the left, name on the right.
- Company Card: "What you do" now has a small briefcase icon to match the location pin on "Where you're based". The Company Card shown in Review your order has no colour or layout options.
- Company profile: the Q&A tab is now Services, with three sections: Services (custom Service Cards, coming soon), Cocktail menu (coming soon) and Q&A.
- Create a booking: phone number and email sit side by side in the same style as the Join FF Staff fields, each with a Save button inside the box.
- FF AI now sits inside the Event Card drop-down, with the microphone inside the text box on the right and the prompt "Paste in the details, or tell us what you're looking for, and we'll fill everything in."
- Availability box: the You confirm and Staff confirm icons are gold; Sent on WhatsApp stays green.
- Booking box: role cards are half the height, with a small + when empty and a small face once filled. The full staff cards only appear while choosing, and close once someone is picked.
- Review your order: the event invoice no longer has Billed to; only the FF invoice asks for a name or company. Under the event invoice: Review terms and conditions and Edit terms and conditions (saved to the company profile). Apple Pay, Google Pay and Card sit under Confirm booking. The Company Card suggestion only shows for people who aren't signed in with a company yet.

## v16.36 — 2026-10-27 — Booking box back, action bar off, payment screen, availability
Artifact version 1793111699-12c2 · file `fireflair-v16.36.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Corrects the last round: the live action bar ("Add people: tap or drag their cards here · Open booking") is now switched off everywhere. The booking box stays and is back between Shift details and Staff, replacing the arrow once there is a role.
- Picking a role on the blank Shift card adds it straight away: the card appears in the booking box at once. Tapping a card in the booking box drops down the staff with that profession on their profile (your team first) to choose from.
- Phone number and email are two separate boxes at the top of the booking, each with its own Save button (a tick once saved). Join FF Staff now asks for an email as well as the phone number.
- Invoices: the FF invoice is plain white like the event invoice; only the event invoice is stamped Preview. If there is no name, "Billed to" is a box to type one into instead of "You". The FF invoice ends with a total line and a Terms and conditions box ("Beta: no payment taken") that opens FireFlair's full terms.
- Confirm booking now goes to a Payment screen (package line, total, Apple Pay / Google Pay / Card, beta note), then "Pay and send on WhatsApp". No payment is taken in the beta.
- Review your order: the Close button is gone. Below Confirm booking: a note recommending a Company Card, the Company Card from the profile, and Save / Later. Save keeps the card and the booking's phone, email and name on the company, then opens the company profile.
- Company Card: "What areas do you cover?" is now "Where are you based?".
- New WhatsApp-themed Availability box above Business packages: You confirm → Sent on WhatsApp → Staff confirm, with the note on the 24-hour reward and the 48-hour follow-up offering to share the shift with other members.
- Business packages: three perks each. Bronze: pay as you go, Company Card, custom Service Cards. Silver: unlimited Shift cards, priority staff matching, featured Company Card. Gold: unlimited Shift cards, shareholder privileges, dedicated account manager. Silver and Gold have Register interest buttons (stored on the page for now). The second and third perks for Silver, and the third for Gold, are placeholders until confirmed.

## v16.35 — 2026-10-27 — FF Team home: Discover FireFlair, Core Values, new order
Artifact version 1793111111-86e4 · file `fireflair-v16.35.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Team homepage, from the "Core Values, Section Navigation & Content Hierarchy" brief. New order: hero and search (unchanged), Discover FireFlair, Core Values, Services, Put Yourself on the Map, Build Your Team, Collect Reviews, Career Support, Featured Professionals, then the remaining sections (What is FireFlair, the platforms, XP, beta feedback, join).
- Discover FireFlair: a swipeable row of eight 5:7 squircle cards (Community, Profiles, Services, Events, Career Support, Build Your Team, Get Discovered, Reviews & Reputation), each with a photo, title and subtitle. The next card peeks at the edge on phones; arrows appear on wider screens. Each card opens a short text pop-up (the existing Sheet: focus trap, Escape and a close button) with one or two buttons.
- Pop-up buttons go to existing places only: Community → Network; Profiles → Profile Card creation; Services → Services section; Events → the FireFlair platforms section, plus Training; Career Support → Career Support; Build Your Team → Build your team section, plus Network; Get Discovered → the map section, plus Profile Card creation; Reviews → Collect reviews section.
- No dedicated events page exists yet, so Events points at the platforms section, where FF Party and FF Staff are explained.
- Core Values: a circular diagram with COMMUNITY ("People, connected through events") at the centre, linked to six ways people connect: parties and celebrations, hospitality services, professional networking, training and learning, jobs and careers, business and team events. It scales down on phones.
- Services: the existing Service Cards section (formerly "What's next for FireFlair?") is now headed "Services" with a one-line introduction, and sits straight after Core Values. Same cards and data.
- Career Support: Training, Dream Jobs and Rewards are grouped under one Career Support heading. Their content and buttons are unchanged.
- Code: glue-tail.jsx (DiscoverFireFlair, CoreValues, CareerSupport, Home101 order), v11.css (styles), build.mjs (the Services heading on the ported HomeComingSoon). The frontend repo is untouched.

## v16.34 — 2026-10-27 — Staff row, Shift cards first, business packages
Artifact version 1793110590-f819 · file `fireflair-v16.34.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking bar between the sections removed for now; people go straight onto Shift cards.
- Shift details: no profession picker at the top. A "Choose your role" line, then the Shift cards themselves; the Role box on each card holds the profession picker, and a blank next card is always at the end for another role. Each card has a Staff row showing who is on it, and three buttons: Confirm, Duplicate and a bin.
- Staff (step 3): opens to one swipeable row of staff cards. Order: your picks and your team (gold glow, "Your team"), three Recommended, then a divider and everyone else sorted closest to the event's area. A search box filters the row. Tapping a card puts that person on an open Shift card for their profession, or makes a new Shift card for them, so staff can be chosen before shift details; tapping again takes them off. All sorting runs on the page.
- Confirm coin: smaller bezel, reads "Review and confirm", and always opens the invoice preview, even with nothing entered.
- Business packages now sit in their own box below the booking box: Bronze (pay per fulfilled Shift card), Silver (monthly, unlimited Shift cards) and Gold (yearly, amount still to be set, unlimited Shift cards). Silver and Gold are marked "Coming soon · 2027". Richer bronze, silver and gold colouring. Amounts are in the UI only.
- The FF coin is now top right in every box: the packages, each package tile, and both invoices.

## v16.33 — 2026-10-27 — Contact box, shift-first booking, plans, two invoices
Artifact version 1793108945-54bb · file `fireflair-v16.33.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Staff booking: an email or phone number box sits at the top, under "Create a booking" and above FF AI. It is saved on the booking and shown on both invoices. Confirm asks for it if it is empty.
- New order: 1 Event Card, 2 Shift details, 3 Staff. Shift details now opens with the profession picker, so you choose the professions first, then set the times, pay and terms on each Shift card. Each one appears straight away in the burgundy booking bar under Shift details.
- Staff: tap a card in the booking bar to drop down the staff for that shift. Only people with that profession on their profile are shown (Mixologist shows only mixologists). People you have booked before are highlighted in gold, marked "Your team" and shown first, so the separate Your team box is gone. All matching and sorting runs on the page; nothing new is needed on the backend.
- Under the Confirm button: three plan boxes coloured Bronze, Silver and Gold. Bronze is pay per fulfilled Shift card and is the one in use. Silver (monthly) and Gold (yearly) are locked for now; both give unlimited Shift cards. Amounts are in the UI only.
- Review your order is now two invoices. The Event invoice covers the event, the timings, each Shift card, who is paid what, and the terms between the hirer and the staff. The FF invoice covers FireFlair's connection charge only, with a short note that pay for the shifts goes directly to the staff.

## v16.32 — 2026-10-27 — Fix: Event Card saves as you type, Confirm always opens
Artifact version 1793100094-d70a · file `fireflair-v16.32.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Bug fix: the Event Card only saved when its bar was tapped, so a date and location typed in, followed by a move straight on to Staff, were lost and Confirm said to add them. The open Event Card now saves as you type.
- Bug fix: the Confirm coin now always opens Review your order. Confirm booking is never a dead button: if the date, location or staff are still missing, it says so and opens the Event Card or Staff.

## v16.31 — 2026-10-27 — Shift details back as step 3
Artifact version 1793098987-6edd · file `fireflair-v16.31.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Staff booking screen: Shift details is back as section 3, so the order is 1 Event Card, 2 Staff, 3 Shift details, then Confirm. It opens to every shift card, side by side, as before.
- The role cards between Staff and Shift details stay. A role card's + still opens the staff row; tapping a role card still opens its Shift card underneath. Only one copy of a Shift card is open at a time: opening a role card's Shift card closes the Shift details section, and opening Shift details closes the role card's Shift card.

## v16.30 — 2026-10-27 — World map, staff row and Shift card bubble
Artifact version 1793075360-dd04 · file `fireflair-v16.30.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Map: three views, switched top left: World (globe icon), UK and London. The world outline comes from the same embedded Natural Earth data, so still nothing is fetched from a map server. In the World and UK views, all the coins sit behind one London coin with a count; tapping it flies in.
- Network on all three sites (FF Team, FF Staff, FF Party): Top staff, then the map ("Where FireFlair is"), then the professions. On FF Staff and FF Party, Companies and Your team follow. FF Team keeps Your network and invitations above Top staff.
- Booking box (FF Staff): the separate Shift details section is gone; shift details now live in the booking box. Each role added from Staff becomes a role card in the burgundy box under Staff.
- Tapping a role card's + opens a row of staff underneath (best matches for that role first: your team, availability, area). Tapping a person fills the role card, then the box shows that person's Shift card.
- Tapping a role card opens its Shift card underneath as a speech bubble whose point moves to whichever role card is selected. Shift cards save as they are edited and keep Duplicate and Remove.
- FF Party keeps its Service Cards section; the role cards for booked services open the staff row the same way.

## v16.29 — 2026-10-27 — UK map, inline basket, one-button sections
Artifact version 1793074468-6ff8 · file `fireflair-v16.29.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Map (FF Team, FF Staff, FF Party): the coins now sit on a real map of the UK, drawn from Natural Earth data (public domain) embedded in the page, so nothing is fetched from a map server. It opens on the UK with a London coin showing the count; tapping it, or the London switch, flies in to the London areas (boroughs and the Thames), where each coin opens its card as before. The UK switch flies back out. Areas only, never addresses.
- In the real build, the same view can use Google Maps (VITE_GOOGLE_MAPS_API_KEY) or any tile provider; the coin placement and London fly-in carry over.
- Booking screen: the matching area (people chosen but not placed, plus the mini cards) is no longer fixed to the bottom of the screen. It sits between Staff and Shift details. It had picked up the old fixed `.ff-basket` style by name; it is now `.ff-mbasket`.
- Event Card, Staff and Shift details each collapse back to one large button with a dropdown chevron, showing a short summary (date, time and place; people chosen; number of shifts). Shift details also starts collapsed; tapping a mini card opens it at that shift.
- Review your order: the to-do list is gone. Confirm only needs the Event Card date and location plus at least one person.
- Map coins inside the live map were collapsing to zero width; fixed.

## v16.28 — 2026-10-27 — Company tabs, Q&A, collapsed by default
Artifact version 1793072727-647b · file `fireflair-v16.28.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking screen: tapping an open section bar (Event Card, Staff, Shift details) collapses it; Save/Cancel and "Done with staff" are gone, and collapsing the Event Card saves it. Black arrow buttons replaced by a chevron on the right of each bar.
- "Create your Event Card" on Home opens the booking screen with the Event Card section open; returning from the Network opens Staff.
- Staff step: "Your picks" removed; chosen-but-unplaced people sit in the basket (burgundy border) with the mini cards. Confirm coin has a smaller black bezel plus a burgundy outer ring. "Do it" buttons removed from the order review. Card plate reads "Shift card" (section stays "Shift details").
- Everything collapsible on FF Staff / FF Party is collapsed by default (Profession stays open).
- Company profile: media on top, then four tabs (Overview, Q&A, Team, Reviews). Q&A replaces Hiring questions: 5 website-feedback and 5 business questions, each Yes/No plus a type box, with add-your-own. Business answers show on the public company page; feedback stays private.
- Company Card: social icons (WhatsApp, LinkedIn, Instagram, Facebook, TikTok) edited under Social links. New wording that the card is sent to anyone you hire and can be added to FF Party. FF AI company box shortened, no "prototype".
- Join: "I already have an account" removed; Continue logs in when the phone number is recognised.
- Network (FF Staff): Top staff, professions, map, Companies, Your team.

## v16.27 — 2026-10-27 — Ring on Confirm, cards below staff, direct edit
Artifact version 1793071067-2842 · file `fireflair-v16.27.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Confirm button: the "4" badge and the "After steps 1 to 3" line are removed. The coin now has a black ring with a thin gold line inside it.
- Staff step: the mini profile cards for chosen professions (and "Your picks") now sit below all the staff boxes, directly above Shift details, so each card is next to the shift it belongs to. No time is written on them.
- Tapping a mini card selects it for adding people and scrolls to that card's shift details.
- Shift details: no Edit button. Every card is editable straight away and saves as you type. Duplicate + and Remove stay. There is no "Add more shift details" button; shift details are created by choosing a profession in Staff.
- If no professions are chosen yet, the Shift details step opens Staff.

## v16.26 — 2026-10-27 — Profession box, mini cards, less text
Artifact version 1793070670-7f71 · file `fireflair-v16.26.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Staff step (FF Staff): the "Who do you need?" panel is now a "Profession" dropdown box, sitting with "Your team" and "Search for staff". Same grouped professions as the FF Team profile.
- "FireFlair recommends" is removed from FF Staff for now (it stays on FF Party).
- Chosen professions show as small 5:7 mini profile cards in a row instead of long rows. Each card has its number, the profession, the time, and the chosen people's faces. Cards are drop targets for dragging staff and can be removed.
- Shift details cards are numbered to match the mini cards.
- Instruction and helper text removed from the booking screen ("Four steps, in any order…", staff hints, "Tap to open", the service-card intro line) so the screen explains itself.

## v16.25 — 2026-10-26 — FF Party books the real Service Cards
Artifact version 1793049777-6afb · file `fireflair-v16.25.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Party Service Card step now uses the real FireFlair Service Cards from the FF Team "What's next" row (Bartending, Mixology, Masterclass, Full Service, Staff Service), taken from PARTY_SERVICES in the v1.01 repo, drawn with the same poster card. The earlier template idea is removed.
- Each card has a "Book this" button. Booking one adds it to the booking and marks the card as booked, with "Booked · Remove". Everything on the card is fixed as listed on the home page.
- The start time is not edited on the card: it comes from the Event Card, and the finish is worked out from the card's duration. If the Event Card start time changes, booked Service Cards follow it. If there is no start time yet, Confirm lists "Add the start time on your Event Card".
- Staff step on FF Party shows each booked service as a slot and ranks recommendations by the matching role (Bartender, Mixologist, Event Staff).
- Invoice and event guide on FF Party lists the booked services with their duration and the amounts shown on the cards, and a total ("From" when any card is a "From" card). FF Staff's invoice is unchanged.
- Dev note: the prototype reads PARTY_SERVICES and PosterCard from the v1.01 port (exported through V101).

## v16.24 — 2026-10-26 — Shift details step, role picker, Party favourites
Artifact version 1793047450-84f0 · file `fireflair-v16.24.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Bookings page: the heading is just "Create a booking" (no "New booking" label).
- Event Card, Staff and Shift details can all be open at the same time. Opening one no longer closes another, and the booking no longer resets when it is first created.
- Fix: saving an Event Card could send a new booking to "Previous bookings" with no team. A date typed with a two-digit year (read as year 0026) counted as past. Two-digit years now read as 20xx, and a date that has genuinely passed is refused with a message instead of being saved.
- FF Staff order is now 1 Event Card, 2 Staff, 3 Shift details, 4 Confirm. "Service Card" is called "Shift details" on FF Staff (FF Party keeps "Service Card").
- Staff step starts with "Who do you need?": roles grouped by the same categories as the FF Team profile (Bar, Front of House, Chefs, Management, Entertainment, Services, Back of House), plus an "Another role" box. Tapping a role adds one person's shift details with the times of the one before. Then choose people for each role. The same grouped picker is used for the Role box in Shift details.
- A shift needs a role, start and finish time to count as complete. Missing items are listed on the Confirm step.
- FF Party: Service Card step is a row of FireFlair templates (role, typical hours, short description). Pick one and it opens for editing. Pay is left blank for the hirer to enter.
- FF Party: no team is assumed. "Favourite staff" sits at the bottom of the Staff step, below recommendations and search. A heart on staff tiles, "Add to favourites" on the card preview and on the profile (replacing "Add to team"). Favourites are kept in state.favs.
- Card preview on the Network keeps "Add to your event" and "View profile"; on FF Party it also has "Add to favourites".
- FF Staff home wording follows the new order and "shift details" naming.

## v16.23 — 2026-10-26 — Gold gradient, coin Confirm, T&Cs pop-up
Artifact version 1793018670-bbbf · file `fireflair-v16.23.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Colours: one continuous gold gradient across the four booking steps, with the same dark text on all four (no red end, no mix of black and white text).
- Layout: Event Card, Service Card and Staff now share one column width, so each header bar is the same size as the box it drops down from. Opening Staff no longer jumps to a full-width box.
- Step 4 is now a round FF coin Confirm button after three boxes, with arrows between the steps.
- Search boxes (staff search, home hire search) show the FF AI tag and a microphone.
- Your bookings: "Coming up" and "Past" are dropdowns with horizontal scrolling date tiles, sorted by date (Coming up soonest first, Past most recent first). Tapping a tile shows details and an Open booking button.
- Terms and conditions: no full-screen page. "View T&Cs" opens a normal pop-up with five standard terms that can be edited and saved to the company profile. The "use AI to create my terms" option is removed; adding a document is kept.

## v16.22 — 2026-10-25 — Gradient steps, five-box cards, terms page
Artifact version 1792958440-9643 · file `fireflair-v16.22.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Booking box colours: one continuous gradient across the four steps (gold to wine) with arrows between them. The old teal is gone.
- Event Card is five boxes: Type (opens into a list of choices in place), Date, Starts, Location, Guests. "More details" is now "Extra details" (placeholder: anything else the team should know). The WhatsApp line at the bottom of the card is removed.
- Service Card is five boxes: Role (list of roles), Starts, Finishes, Pay (hours x per hour = shift rate, both ways) and Terms. One Service Card is one person, so there is no "how many people" and no uniform field (uniform belongs in the company terms). Duplicate + replaces Cancel. Cards sit side by side in a row and size to their container.
- Terms: tapping Terms opens a full-page editor (company.tcOwn, company.tcDocs). Options: write or paste, "Use AI to create my terms" (a local template for now), "Add a document here". The FireFlair template choice, the "no T&Cs" option and every NDA mention are removed.
- Staff step: the second set of cards and the drag-onto-card target are replaced by a slot list, one row per Service Card. Tap a slot, then Add people to it (or drag a person's mini card onto a slot). Several people on one slot is still first come, first served.
- FF AI at the top of booking is one compact row; a sentence now creates one Service Card per person asked for. Still a prototype text parser.
- Invoice and event guide: pay summary lists each Service Card with the agreed pay and a note that it is agreed between the hirer and the staff member and that payment terms are in the terms and conditions. The invoice total is calculated per Service Card (one constant in flow11.jsx).
- Your bookings is now an open-and-close list (Coming up / Past) instead of Event Cards; each row opens to the details, Service Cards and an Open button.
- Company profile: every section can be collapsed (About and Media included). About is a plain text box with no Add/Edit button. The Company Card layout choices are small unnamed icons about the size of the colour swatches.
- FF coin guide wording updated for Service Cards.

## v16.21 — 2026-10-25 — Service Cards, event guide, FF AI box
Artifact version 1792956115-be91 · file `fireflair-v16.21.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- "Shift Card" is now "Service Card" everywhere (teal card face, not black). Note: the coming-soon FF Party "Service Cards" module shares this name.
- Booking box: Duplicate puts the new Service Card side by side in a horizontal row. Event Card no longer shows Needed/Optional labels; intro reads "Four steps, in any order. Tap a card to open it", and the step cards look tappable.
- Event Card has a free-text "More details" field (event.details) for any extra info, mainly for B2C / FF Party clients.
- Staff step: only "Your team" opens by default; "FireFlair recommends" and "Search for staff" start closed. Drag and drop now drags a mini copy of the person's card instead of a name tag.
- Confirm step shows a full "Invoice and event guide" (event details, timings, every Service Card, pay summary, terms, how it works); the sent copy carries a "Sent" stamp.
- New FF AI box at the top of booking: type or speak about the event and it fills the Event Card and Service Cards. Prototype only: a simple text parser, no model. Backend idea: expose the same card actions through an API so external assistants (e.g. ChatGPT) can create bookings.
- FF coin button on FF Staff / FF Party no longer shows verification levels; it opens a "Your next step" guide with the 4 steps and quick how-it-works answers.

## v16.20 — 2026-10-25 — FF Staff Bookings: one booking box
Artifact version 1792954535-2690 · file `fireflair-v16.20.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- Bookings is now one booking box (BookingBox in v11/flow11) with four centred buttons: Event Card, Shift Card, Staff, Confirm. They can be done in any order; a booking record is created behind the scenes the first time anything is saved.
- Event Card: tap it and it opens as the real card; you type straight onto it (only location and date are required; start time, guests, name and type are optional). Saved, it shrinks to the finished card; tap it to change it. Editing the Event Card also updates the date and location stored on its Shift Cards.
- Shift Card: opens as the real card with the fields on it: job role, how many people, starts, finishes, uniform, pay calculator (hours x per hour = shift rate, either direction), extra details and T&Cs. Duplicate a card and change the role to make a waiter, bartender, bar manager and so on. Saved Shift Cards show as finished cards that people are dropped onto.
- Staff: three boxes that open and close: Your team (with Send to your whole team per Shift Card), FireFlair recommends (ranked by job role, availability for the date, area and team; switch which Shift Card it is for), and Search for staff (plus a link to the Network with the booking filled in). Each box scrolls sideways like the rest of the site.
- Drag and drop: drag a person onto a Shift Card (or a Shift Card target at the top of Staff). Mouse drags straight away; touch needs a short press and hold so the rows still scroll. A drop fires an ff-drop event. Tap Add is the alternative (one Shift Card: goes straight on; several: choose; none yet: they wait as Your picks).
- First come, first served: a Shift Card needs shift.qty people; shift.staffIds is who it is sent to and can be more. BOOK_SEND sends to everyone on the card; OFFER_ACCEPT confirms one and, once the card is full, marks the rest Shift filled. The earlier "send to team" flag is gone; the whole team is just added to the card.
- Confirm: Review your order with an invoice preview (billed to, event, a line per Shift Card with people, hours, per-hour and amount, total), a list of anything still missing with a button to fix each, and Confirm booking. The invoice is described as sent on WhatsApp and by email once the booking is confirmed. For the beta the booking is confirmed without payment; with payment live the availability requests go out only after payment, and free bookings for Pro businesses are planned. After sending, replies show with prototype Accept buttons.
- Your bookings is below the box as full Event Cards in a sideways row (current, then past). Tap one to open it in the box; past ones open read-only with reviews. Empty draft records are hidden from the row.
- The Event Card builder on FF Party also only needs date and location now.
- Tested headless at phone and desktop widths: shift first, then event, duplicate, staff drag and drop (stacking two on one card), tap Add, review order, confirm, accept, bookings row. No page errors.

## v16.19 — 2026-10-25 — FF Staff Bookings: four-step booking
Artifact version 1792953241-3932 · file `fireflair-v16.19.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Staff Bookings rebuilt as a four-step booking (StaffBookings, BookingFlow in v11/flow11): 1 Event Card, 2 Shift Card, 3 Staff, 4 Confirm. The card stack and hold-to-edit are removed from Bookings.
- Top of Bookings: a Create event card box (the four steps listed). Under it, a row that scrolls sideways through current then past bookings, each with a status (Draft with its step, Sent, Confirmed, Past). A new user with no bookings goes straight into step 1 with an empty row.
- Step 1: location and date are the only required fields; start time, guests, name and type are optional. The built cards sit on the left on desktop (sticky) and as a small summary above the step on phones.
- Step 2: Shift Card with job role, how many people, start/finish, uniform, extra details, T&Cs and a pay calculator: hours x per hour = shift rate. Typing the per-hour figure sets the shift rate, typing the shift rate sets the per-hour figure; hours come from the start/finish times (or can be typed if there is no finish time). Stored on the shift as rate, total, hoursM, plus a pay text. Duplicate and remove on each Shift Card.
- Step 3: each Shift Card can be sent to the whole team (shift.offer = "team", first come first served; team rule shown, favourites-first marked as coming later) and/or have people picked. Three suggested people per shift, ranked by job role, availability for the date, area and being in the team (rankPeople). Browse the Network opens the Network with a booking brief (state.netBrief) at the top: job role, date and area filled in from the booking and editable, people ranked best match first with Add to shift.
- Step 4: summary of the booking and who each Shift Card goes to, then Confirm and send. BOOK_SEND now sends team offers to every team member; OFFER_ACCEPT confirms one person and, once a team Shift Card is full, marks the rest as Shift filled. Replies show on the step with prototype Accept buttons.
- The Add people booking bar is hidden on the Bookings screen. Leaving the Network clears the booking brief.
- Previous bookings open read-only with the cards and Review buttons.
- Tested headless at phone and desktop widths: create, all four steps, pay calculator both ways, send to team, add suggested people, Network brief and back, confirm, accept, bookings row. No page errors.

## v16.18 — 2026-10-25 — FF Staff Bookings: card stack and checkout
Artifact version 1792950083-b24c · file `fireflair-v16.18.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB)

- FF Staff and FF Party home: the same hero photograph and gold coin as FF Team for now, so the coin sits on the bar. The Event Card builder is no longer on the home page; Create your Event Card opens it on Bookings.
- The booking bar, XP bar and basket sit flush on the bottom bar on phones: the bottom bar's measured height is kept in the CSS variable --ff-navh (navHeightSync) instead of a fixed 64px.
- Card preview (CardPeek): on FF Staff and FF Party, tapping someone's card enlarges it with Add to your event and View profile, instead of opening the profile. VIEW actions from the hirer sites set state.peek; View profile sends VIEW with direct: true. Add to your event puts them in the booking bar and, if the open event has a Shift Card for their profession with room, on that Shift Card.
- Bookings rebuilt as one screen for processing bookings (StaffBookings in v11/book11): a strip of upcoming events plus New Event Card, which opens the builder in place. The open event shows as a card stack, solitaire style: the Event Card on top, its Shift Cards under it, and the people on each Shift Card fanned underneath. Press and hold any card to open it up and edit it (useHold / Holdable, 450 ms; a small edit button does the same from a keyboard or mouse). Tapping a person opens them up too.
- A Shift Card can now hold several people: shift.staffIds with shift.qty people needed (older shifts with one staffId still read). Empty places show as Add slots; One more adds a place. Picking people lists the booking bar, your team and people whose profession fits, with their availability for the date.
- Checkout at the bottom of the booking: each Shift Card and who's on it, the T&Cs, hiring questions and documents that go with it, people to book and FireFlair credits, a payment method, and Pay and send. Sending creates one request per person per Shift Card (BOOK_SEND) on WhatsApp; the status of each person shows underneath, then Booking confirmed. No payment provider is connected in the prototype.
- Previous bookings are listed last; opening one shows its stack read-only with Review buttons for the people who worked it.
- The old Event page is no longer reached from Bookings or the booking bar (both now open the booking on Bookings).
- Tested headless at phone and desktop widths: hero, card preview, bar flush with the bottom bar, stack, hold to edit (event and shift), adding people, checkout and confirm, new Event Card and Shift Card, View profile. No page errors.

## v16.17 — 2026-10-25 — FF Team & FF Staff v1.1 review copy
Artifact version 1792946842-5002 · file `fireflair-v16.17.html` · review copy (https://claude.ai/artifact/HLrHKveVSQ1gge9xbaA6VB), built on v16.16

v1.01 brought across from the FF Team React front end:
- The v1.01 Home (coins between sections that turn as you scroll, Join with the coin drop), Beta label, the 1-minute CV box, password minimum of 5, Create your own question, Media as one section, Help me write removed, the edge bounce, and the v1.01 colours and fonts. The v1.01 CSS is added as a rule-by-rule diff against the original, with the original's variant rules (e.g. `.ff-tile.dark`) re-asserted so nothing in the older screens changes.
- Not yet brought across: the Live Action Bar, Save = Publish, five card icons and flags, the car icon, Share to WhatsApp, and the v1.01 public profile changes.

v1.1:
- FF Staff home rebuilt from the FF Team home (StaffHome11): hero (Find staff. Book staff.), Featured staff (no profession rows), What is FF Staff?, How booking works (Event Card → Shift Card → WhatsApp), Create your Event Card, Book a team (business teams), reviews, Your Company Card, the platforms (FF Party as phase 2), What's next for FF Staff (Service Cards, Signature Cocktails and the rest as coming soon), beta feedback and Join FF Staff with the coin drop.
- FF Party home (PartyHome11): a simple how-it-works for people planning a party, the existing Event Card builder, featured bartenders, Book a bar company, reviews, cocktails and coming soon.
- Event Card redesigned in the Team Card family (EventCard11). Only date, start time and location are needed; name, event type and guests are optional. Finish time, client, dress code, team size and notes move to the Shift Card.
- Shift Card redesigned (ShiftCard11) with job role, start time, uniform, extra details and T&Cs, assigned to an Event Card and duplicable. The new Shift Card editor replaces ShiftSheet (same props) and drops the pay field.
- FF Staff / FF Party Bookings rebuilt (StaffBookings): Events and Shifts tabs, past events as a list, Shift Cards grouped by event with Edit, Duplicate, Assign and Send, and a notifications bell (updates also go on WhatsApp). Two upcoming demo events added.
- Join FF Staff: username (page address) and phone only; the company name goes on the card.
- Company Card: "What areas do you cover?" replaces "Where you're based", and three layouts under the colours (Classic, Big logo, Centred), saved as `company.layout`.
- Company profile reordered: About, Media (new, `company.media`), Contact & social, Areas covered, Venues, Documents, T&Cs, hiring questions, your team, reviews; Services and Signature cocktails are coming soon (FF Party).
- Network: "Partner venues" becomes Companies (FF Staff and FF Team), each opening a company page (CompanyPublic, `state.viewingCompany`) with media, contact, their team (Book from their team on FF Staff), areas covered and reviews. Sample company pages in COMPANY_PAGES.
- Availability Cards: stored exactly like Question Cards (`profile.answers["av_<date>"]`, choices Yes / No / Maybe). FF Team Bookings shows them (add a date, and requests from businesses). On any profile, Availability shows the saved answer straight away or sends an Availability Card on WhatsApp (`state.availabilityAsks`). Who is free is also shown when picking a person for a Shift Card.
- Ask a question: sends a Question Card plus a WhatsApp message (preview shown), from any person or company page, on FF Team and FF Staff.
- New actions go through v11Reducer in front of the main reducer: V11_SET, VIEW_COMPANY, AVAIL_ASK, AVAIL_ASK_PATCH, COMPANY_MEDIA_ADD, COMPANY_MEDIA_DELETE, NOTES_SEEN. Older replaced components are kept, renamed `_old`.
- Tested headless at phone and desktop widths: FF Staff home, event and shift creation, duplicate, Bookings tabs and bell, join, card layouts, company pages, availability, ask a question, FF Party home, FF Team bookings and network. No page errors.

## v16.16 — 2026-10-25 — Published prototype, as the base for v1.1
File `fireflair-v16.16.html`

- The FireFlair prototype artifact as published (PHASE1 version 16.16), saved so v16.17 can be compared against it.

## FF Team Phase 1 v1.8 — 2026-10-19 — Profile pages, card builder, Home content
Artifact version 1792357829-5456 · file `ff-team-phase-1/ff-team-phase-1-v1.8.html`

- Profile pages: photos sit behind the Profile Card; on phone, pulling down drags the card below the photos (no Expand button); desktop shows the photos beside the card, with a swipe carousel above four pictures.
- Attributes: one 5:7 card per category listing titles, a centred pop-up with every item expanded, separate 5:7 Profession cards, and a rounded Back / Ask a question panel.
- Dummy profiles (demo only) now have About text, photos and filler attribute descriptions.
- Card builder: Professions open the Pick your professions box inside the card; removing an item with its X now deletes it (it was only hidden, so it came back).
- Home: shorter What is FireFlair? with Find your place, How FF Team works (Build, Share, Grow), community verification, a larger UK map and globe box linking to the Network map, a more compact Teams section, and a new section order.
- What's next: FF Staff and Service Cards are next to launch; Signature Cocktails, FF VIP and the Digital business card follow FF Party.

## v16.15 — 2026-10-16 — Quick Event Card, Cocktails page, signatures
Artifact version 1792150124-d0b9 · file `fireflair-v16.15.html`

- FF Party quick Event Card builder (PartyEventSection): five tap-first questions (occasion, date, guests, where, who you need) beside a live card that fills itself in. The name comes from the occasion (and the host's first name if given), e.g. "Alex's Birthday". "Add more detail" opens the card for typing (name, times, venue, notes, colours) as before. The draft lives in the store (state.partyDraft, PARTY_DRAFT / PARTY_DRAFT_PATCH, not persisted), so going to the Cocktails page and back keeps everything.
- Cocktail Cards (the spec's Menu Cards): ingredients with measures, garnish included ("Garnish: …" lines), and the glass as an icon (GLASSES + GlassIcon, ten glass shapes). No method or equipment, as agreed.
- 52 FireFlair classics (CLASSICS), one per playing card: four suits of 13, Spades = whisky & brandy, Hearts = gin, Diamonds = vodka & sparkling, Clubs = rum & tequila, A down to 2. This is a starter list for Alex to confirm or replace.
- New FF Party page "Cocktails" (route "cocktails", CocktailsPage): your cocktail menu panel, search, suit filters, Signature cocktails (square cards) and the 52 classics as playing cards. Tap + to add, or open a card for the full recipe. Reached from the builder ("Add cocktails"), the saved Event Card, the FF Party home teaser (CocktailTeaser) and the Event page.
- Cocktail menu: { picks: [cocktail ids], mode: "start" | "whole", count } with "To get started" or "The whole event" and "How many cocktails?" (suggestions of 1, 2, 3 or 4 each from the guest count). It is stored on the open event (event.cocktails) or as a draft (state.cocktailMenu, persisted) until an Event Card is saved, then attached on save. One reducer action, COCKTAILS_PATCH, writes to whichever applies.
- The chosen cocktails show as a "Cocktails" row on the FF Party Event Card, in a Cocktails panel on the Event page (Change cocktails, Recipe sheet), and the recipes are added to the invoice (InvoiceCard: a "Cocktail recipes" block, also in the copied/WhatsApp text). The Recipe sheet is the same list.
- Signature Cocktail Cards: a new profile category "cocktails" (Signature cocktails) on the FF Team profile and the FF Staff / FF Party company profile, made with the same card editor as everything else. Two new editor fields: Ingredients (one per line) and Glass (picker). The square card shows the glass and the key ingredients. Demo: the finished demo profile has one; Sammy, Ava and The Loft Lounge have signatures (DEMO_SIGNATURES) shown on their profiles and on the Cocktails page.
- Every Signature Cocktail Card (demo network, your own, your company's) is selectable on the Cocktails page and credited to whoever made it. Core should store classics and signatures as one cocktail record type, so searches, invoices, shopping lists and later menus all read the same data.
- Copy: FF Party how-it-works is now Create, Choose, Cocktails, Book, Celebrate; the Home FF Party steps mention cocktails.
- Tested headless at phone and desktop widths: quick builder, Cocktails page (52 cards, 3 signatures, add, detail, mode, count, recipe sheet), saving with cocktails, Event page panel, recipes on the invoice, Signature cocktails on the profile and the editor's glass picker; earlier FF Staff and Home flows. SEO self-test 36/36, no page errors.

## v16.14 — 2026-10-15 — Dream jobs, Review Cards, square cards, map
Artifact version 1792089883-1b55 · file `fireflair-v16.14.html`

- Home intro: a large "What is FireFlair?" now sits above "The event connection platform." (new Sect `kicker` prop).
- New "Are you a business?" block near the top of Home (WhoAreYou): two links, FF Team (freelance hospitality staff) and FF Staff (hospitality businesses). The FF Staff section further down Home is removed; FF Staff is reached from this link, the sites menu and the closing cards.
- Large squares: FF Party, Training and Dream jobs each sit inside one large rounded square (new Sect `boxed` prop: true = cream, "dark" = black).
- Shine cards: the v16.13 Training card look is now one shared component family. ShineChoice (a card you tick: Training, Dream jobs) and ShineSquare (a square card you open). Colourways live in SHINE and are applied with shineVars(). The old .ff-course styles are removed.
- Festivals section replaced by "Dream jobs" (JobsSection, id ff-jobs): eight jobs to tick, laid out like Training (Music festivals, Food festivals & markets, Sports events, Motorsport, International jobs, Yacht jobs, After Dark (18+, opt-in), Flair jobs), a "What's your dream hospitality job?" box (type your own, or tap Weddings, House parties, Ski seasons, Cruise ships, Celebrity parties, Film & TV sets), and register interest like Training (signed-in people just confirm). Saved as state.jobsInterest (JOBS_INTEREST, persisted). The intro says FireFlair will negotiate the best rate and find the work, win-win.
- "Verified by your community" is now a Review Cards section (id ff-reviews): two example Review Cards (worked together: stars, yes/yes/Excellent, accepted; would love to work together: not yet/yes, waiting on WhatsApp), four steps (Review, Send, Accept, Build) and the three community points. The cards use the same questions as the Add to team sheet.
- "One family of cards" now shows square Shine cards (Company, Venue, Event, Job). FF Team home: the "Coming up" section is removed; Events, Job posts, Sponsorship, Online, Top cocktails, Bar content and Venues are all square Shine cards; the page finishes with the map. Signed-out Home now ends with the map too (after "Find your place on FireFlair").
- Home jump links: FF Team, FF Party, Service Cards, Training, Dream jobs, Review Cards. FF AI on Home sends festival, yacht, motorsport, travel and dream-job requests to Dream jobs.
- Network: the map ("Where FireFlair is", the same map as Home) now sits just under Connected, above Top Performers This Week.
- FF Team Bookings: the FF Party Service Cards section replaces Show/Hide with "Register interest" per card (state.profile.serviceInterest). Registered cards say "we'll review your profile", with Withdraw. Copy: once FF Party launches, the profile is advertised alongside those Service Cards. Signed-out visitors are sent to create a Profile Card first.
- Tested headless at phone and desktop widths: section order, Dream jobs pick/add/register, Review Cards, square cards, FF Team home, Network map position, Bookings register. SEO self-test 36/36, no page errors.

## v16.13 — 2026-10-15 — FF Party site, Service Cards, Training, FF VIP lock
Artifact version 1792088149-5f1f · file `fireflair-v16.13.html`

- FF Party is now its own site (ffparty.uk), a copy of FF Staff for people planning events. In the prototype it is the same hirer role ("staff") with a new `state.site` ("staff" or "party", persisted; set by the ROLE action's `site`, default "staff"). `hireSiteOf(state)` gives the site's name and Event Card anchor. Shell label, account menu, "You're here" in the sites menu, SEO page names and the Event page eyebrow follow the site.
- FF Party home (PartyHome): "Plan the perfect event", FF AI "Search FireFlair for your team", the FF Party Event Card (the ffme.uk-style EventPoster, typed onto, with background swatches, occasion and roles), five how-it-works steps, people by group (shared HirePeople component, tap or drag into the booking bar), FF Party Service Cards, and Coming soon.
- The FF Party Event Card is saved as a normal event (EVENT_ADD) with the card in `event.poster`, so the booking bar, Event page, Shift Cards and Bookings all work as on FF Staff. eventFromPoster / posterFromEvent map between the two. People in the booking bar appear on the card's "Your team". The booking bar's small Event Card keeps the poster's colours. The Event page shows the poster for party events.
- FF Party's Profile tab is the FF Staff hirer profile, relabelled ("Join FF Party", "Your name or company", "Your FF Party Card", "Welcome to FF Party"). Both sites share `state.company` in the prototype; core should decide whether party hosts get a lighter profile.
- Home: the FF Party section is now a short link to the FF Party site (three steps, a "Go to FF Party" panel, and "Found wherever people search"). The old in-page search and lead-style Event Card (PartySearch, PartyEventCreator) are removed; `partyEvents` state is left for old saved data.
- New full section "FF Party Service Cards" (eyebrow "Service Cards × FF Party") on Home and on FF Party home: an explanation; the FireFlair standard Service Cards (Bartending, Mixology, Masterclass) with a "From" figure in the footer (field `from` in PARTY_SERVICES; amounts set by Alex); then "Your own Service Cards" explaining that businesses and freelancers will create their own, with two square examples (Tom Beatson's DJ set, Jonah Reed's event photography, "Priced by" the person) and a Create your own tile (coming soon).
- The white Staffing Service card now belongs to FF Staff only: shown on FF Staff home in a dark "FireFlair Staffing Service" panel (STAFFING_SERVICE, also with a `from` figure). It no longer appears on FF Party or in FF Team Bookings.
- Training: the course cards keep their layout but each has its own colourway (COURSE_TONES) with a metal edge, gloss, lit medal, a large watermark icon, a sheen that sweeps across on hover and a lift with a slight 3D tilt. Selected cards get a gold edge, a gold tick pill and a check badge. Hover effects only on devices that hover; reduced-motion users get no movement.
- FF VIP: removed from Home (VipSection and its styles deleted; the copy is in v16.12 if needed for the FF VIP site). In the sites menu and the closing "Find your place" cards FF VIP shows the new platinum FF logo (FF_VIP_LOGO, cut out of Alex's artwork) with a lock and "Coming soon"; tapping it shows "FF VIP is coming soon". FF VIP will become its own site, built from FF Team and ffme.uk.
- Home jump links: FF Team, FF Party, Service Cards, Training, Festivals, FF Staff. FF AI on Home sends party/wedding/birthday requests straight to the FF Party site.
- Tested headless at phone and desktop widths: Home sections, menu and finale, FF Party Event Card create/save, booking bar, Event page, FF Party profile, FF Staff with Staffing Service, the earlier FF Staff and FF Team flows. SEO self-test 36/36, no page errors.

## v16.12 — 2026-10-15 — FF Staff Event Card, booking bar, company profile
Artifact version 1792072685-c201 · file `fireflair-v16.12.html`

- Definitions: FF Team is for freelance hospitality staff; FF Staff is for hospitality businesses of all kinds and is where they hire staff for their events. Updated in the sites menu (FF_SITES), the FF Team and FF Staff sections on Home, the FF Staff home page, the map legend and the SEO description.
- FF Staff home: the Event Card is now made on the page itself (StaffEventSection / StaffEventCard), no separate "create event" screen. It follows the Shift Card picture: white card, black "Event Card" tab, FF coin, rows with black icon tiles (date, time, venue, company/client, dress code, guests and team), notes, and a black WhatsApp footer with a QR code. Typed straight onto, then saved; Edit and New Event Card under it. The old eventNew route lands here.
- Booking bar (BookingBar) replaces the basket count. Works like the XP bar: fixed at the bottom on phones (stacks above the XP bar when both show), a row under the menu bar on desktop (stays when the XP row hides on scroll). Shows the Event Card as a small card (or a dashed blank card where it will go), then a small card for each person added. Appears once there's an Event Card or anyone in the basket.
- Drag and drop on desktop: Profile Cards on FF Staff home are draggable (dragPerson); dropping on the booking bar adds that person (new SELECT_ADD action). The bar shows a "Drop" slot while dragging. The drag state change is deferred a tick so Chrome doesn't cancel the drag. Phones tap instead.
- FF Staff company profile rebuilt on the FF Team Profile page pattern and card system: 1 Join FF Staff (company name and page address instead of an FF Tag, phone verified on WhatsApp, new COMPANY_SIGNED_IN action), 2 Company Card typed straight onto (logo upload, name, what you do, location, colour), 3 FF AI (proposes card and profile, approve before saving), 4 company profile as cards, then Save & Share and Section 5 (Welcome to FF Staff: Create an Event Card, Add FF). All on the Profile tab; CompanyEdit screen removed and every "Create/Edit Company Card" link now opens the Profile tab.
- Company information uses the same records and card editor as FF Team: company.records, with REC_* actions carrying owner "company" (reducer re-runs them against the company's records). Categories in COMPANY_CATEGORIES: services, service locations, venues, documents, contact & social. T&Cs/NDA show as cards ("Sent with every booking"), hiring questions as Question Cards (new gold "hiring" colour), reviews as cards, regular team as Profile Cards. companyDocs() / companyLocations() merge the older company.documents / serviceLocations fields with the new records.
- Information Cards redesigned: square with rounded corners (22px), calmer and closer to Apple's style, no grain. Label at the top, then the title, then either the description (up to four lines) or up to four images (1, 2, 3 or 4-image layouts). Profession Cards keep their five level diamonds in the top row. MAX_MEDIA_PER_CARD is now 4 and Qualifications can carry images too. Add tiles are matching dashed rounded squares.
- Account menu shows the company name and page address when on FF Staff.
- Tested headless at phone and desktop widths: Event Card create/view/edit, booking bar (tap, synthetic drag and drop), Event page, company join/card/FF AI/cards with images/save/welcome, square cards on FF Team. SEO self-test 36/36, no page errors.

## v16.11 — 2026-10-15 — Two-way Add to team, Section 5, Publish
Artifact version 1792070271-02de · file `fireflair-v16.11.html`

Network: two-way "Add to team" with a review, and Ask a question on FF Team. Profile page: Section 5 on the left line, card creator cleaned up, levels on Profession Cards, Publish on FF Party.

How the network works (Alex's answer to the developers' questions):
- You add people to your network, you review them, and they are invited to join your team. It is a two-way confirmation: nobody is connected until the other person accepts.

For the developers:
- Person profile (from Network): the Back button at the top stays. On FF Team (and for guests) "Add to basket" is replaced by "Ask a question", which opens the existing Ask a question sheet and adds a Question Card to their profile. FF Staff keeps Add to basket.
- "Add to team" opens a sheet like the review box: "Have you worked with [name] before?" Yes/No, "Would you like to work with [name] again?" Yes/No, "How is [name] to work with?" (Excellent, Great, Good, Could improve; only when they have worked together) and a free-text review (a note instead when they haven't). Add is enabled once the questions are answered.
- Add shows a confirmation: "Your team invitation and review will be sent to [name] on WhatsApp. [Name] will be notified that you'd like to add them to your team. You're connected once [name] accepts." Send invitation / Back.
- Sending stores a team invitation (state `teamInvites`, action `TEAM_INVITE`, persisted) with status "pending": the answers, the how-to-work-with label mapped to a 1-5 rating, and the review. The button then reads "Invitation sent" with a waiting note.
- When they accept (`TEAM_INVITE_ACCEPT`), they join your network (connections) and, if you've worked together, the review is posted to their profile. The prototype has a "Preview: [name] accepts" link to show this; the real accept comes from their WhatsApp notification. Core should require a signed-in sender and send the WhatsApp message.
- Previously "Add to team" connected people instantly (`CONNECT`); that button no longer does.
- Profile page, Section 5: the 05 marker now sits on the left-hand line, level with the middle of Save & Share, with the line and three dashes running down beneath it. The journey line continues from Section 4. After Save, the page extends and "Welcome to the Team" opens with its marker on the same line (`ff-s5row`, `ff-s5mark`, `ff-s5open`). Save & Share now lines up with the section column.
- Profile Card creator: removed the second FF Tag under Professions (the footer keeps it) and the five level diamonds. The label is just "Professions". The colour picker is unchanged.
- The finished Profile Card no longer shows five level diamonds under the title either; it has the single brand diamond on the gold rule, so creator and card match.
- Profession Cards: the profession's level (record.level, 1-5, chosen in the card's editor) shows as five diamonds top right, grey until filled. Demo people show their level on their top profession.
- Section 5, Welcome to the Team: the card, then the main button "Publish on FF Party", then Add FF, then Add to Apple Wallet and Add to Google Wallet.
- Publish sets `profile.published` / `publishedAt` (and the publish XP, once) and opens a pop-up: "We've published your profile as a website", a "Click here to view it as a guest" button, and the note "For now we're publishing on FF Team, to help build the network. Once FF Party goes live, your profile will be ready for B2C bookings." Afterwards the button reads "View my published profile".
- Guest view of your own profile: `VIEW` with `guest: true` sets `viewingAsGuest`. It shows the public layout (no editing, no hidden or proposed cards, your own network) under "This is your profile as a guest sees it", with "Back to my profile".

## v16.10 — 2026-10-15 — Sticky desktop bar, new arrow
Artifact version 1792058955-7aba · file `fireflair-v16.10.html`

Desktop menu bar stays on screen; new dropdown arrow.

For the developers:
- Desktop (900px and wider): the menu bar (FireFlair menu, Home / Network / Bookings / Profile, coin, Add, Log in/out) now stays at the top of the screen while scrolling. It was always meant to be sticky, but `overflow-x: hidden` on the `.ff` wrapper made it a scroll container, which stopped `position: sticky` working. The wrapper now uses `overflow-x: clip` (with `hidden` kept before it as a fallback for older browsers); it still stops the page scrolling sideways.
- Desktop: the XP row under the menu bar hides once the page is scrolled down (past 120px) and comes back near the top (above 20px). The gap between the two stops it flickering as the row collapses. If someone has a basket, the basket row stays so "Build team" is always reachable. State: `scrolled` in `Shell`, passive scroll listener.
- Phones: the top bar is no longer sticky and scrolls away with the page, because the bottom nav with the five icons is always on screen and already gives the way between pages and the coin. The phone XP and basket bars at the bottom are unchanged.
- The dropdown arrow beside FireFlair (top left) is now a larger plain triangle pointing down, drawn as a small SVG, with no circle round it. It still turns over when the menu is open.
- The sticky bar uses `top: env(safe-area-inset-top, 0px)` so it clears a phone's status bar in the app.

## v16.9 — 2026-10-15 — Sites menu, Event Card, FF VIP
Artifact version 1792058542-6c88 · file `fireflair-v16.9.html`

Header, Home and FF Party changes across the site. The top-left FireFlair menu is now a standing rule for every FireFlair site.

For the developers:
- Top-left FireFlair button (every site, signed in or out): opens a "FireFlair sites" menu listing FF Team, FF Staff, FF Party and FF VIP with their domains (ffteam.uk, ffstaff.uk, ffparty.uk, ffvip.uk). The current site is marked "You're here". One list, `FF_SITES`, drives the menu and the closing section on Home; add a row to add a site. On the real sites each row is a link to its `url`. In the prototype FF Team and FF Staff switch role; FF Party and FF VIP open their section on FireFlair Home (`useGoSite`). Signed in, the menu still shows the name, tag and "FF Tag & sign-in". Escape closes it.
- Desktop header: Home, Network, Bookings and Profile now sit in the centre of the bar (three-column grid). The XP coin, Add and Log in/Log out moved to the right-hand group. Phone bottom nav unchanged.
- Buttons: the standard button is now a light gold gradient instead of cream. Black (primary) is unchanged; cream stays the page background. Each button kind keeps its own colour on hover (fixes primary, ghost and on-dark buttons turning cream on desktop hover). Home jump links are light gold too.
- Home intro: Connect, Take reviews and Take bookings are one three-step journey. Their marks are drawn (`PromiseMark`), not taken from the icon library, in matching burgundy medallions, joined by gold diamonds. Rows on phones, cards from 640px.
- FF Party, step 1 "Search FireFlair for your team" (was "Search the FF Team") now comes before the Event Card. Each result has "Add to my Event Card"; the people added show in a tray and on the card.
- FF Party, step 2: the side form and preview are replaced by the ffme.uk card builder, used the same way as the Profile page: you type straight onto the Event Card (name, line under the title, note, guests, venue, area, date, start and finish times, your name). Occasion and roles are chips under the card; backgrounds are round swatches (Onyx, Ivory, Burgundy, Gold Confetti, Champagne). "Your team" on the card shows the people added and an open place for each role nobody covers yet. Component: `EventPoster` (CSS `.ff-ec-*`, sized in cqw like the ffme.uk Invite Card). The FF mark carries a spade, matching the Ace of Spades Event Card on the flyer. Saved cards keep all fields plus `team` (person ids) in `partyEvents`.
- Training: easier to read. Stronger borders, a gold label band for the kind, bold titles, darker text and a clear "I'm interested" footer on each option. Multiple choices still work.
- Signed-in visitors don't type a WhatsApp number on Training, the Event Card or the FF VIP list. They see "Signed in as TAG" and confirm (`signedInAs`, `SignedInContact`). Signed out, the number field is unchanged.
- FF VIP rewritten. For the people who book the most (yearly Christmas and summer parties, regular staff bookings): a VIP profile with preferences, a regular team, suppliers added by phone, Event Cards and invoices for everything with the whole party on a single invoice; invitations worth having; favourite cocktails and an About you section later. VIP Experiences (not "venues"): package bookings at bars, restaurants, spas and wellness venues, also used as FF Team rewards; the venue is briefed before arrival so something is ready (champagne or favourite drinks); at select venues you choose your private bartender and waiter. New "Join the FF VIP list" form: state `vipInterest`, action `VIP_INTEREST`, persisted. Anchors `ff-vip` and `ff-vip-join`; FF VIP added to the Home jump links. Home FF AI sends VIP and experience questions there.
- Closing section: "Join them." and the two role cards are replaced by "Find your place on FireFlair": one card per FireFlair site with a way in, plus "See a finished profile". Two across on phones, four across from 760px.
- New colour alias `--burg` for burgundy, used by the new code.
- SEO self-test still passes 36/36. No change to routes, sign-in, profile editing, XP or FF Staff booking.

## v16.8 — 2026-10-13 — Home: FF Party, Training, Festivals
Artifact version 1791913778-7ac5 · file `fireflair-v16.8.html`

Home rebuilt as FireFlair's main selling page. It is the first page people see, so it now introduces everything FireFlair offers, in this order: what FireFlair is, FF Team, FF Party, Training, Festivals, FF Staff, FF VIP, then the map and the join cards. The same sections show on FF Team Home when signed in.

For the developers:
- Intro (from the coming-soon page): "The event connection platform", the three promises (Connect, Take reviews, Take bookings) and jump links to each section. Sect now takes an `id`; section anchors are ff-team, ff-party, ff-training, ff-festivals, ff-staff.
- FF Team: four example Profile Cards (labelled as examples; the full people wall stays on Network), why join, and a Create your Profile Card button.
- FF Party: the three steps, an Event Card you fill in on Home with a live preview (occasion, date, guests, area or venue, who you need, WhatsApp number). Saving stores the card as a lead (FF Party stage 1); bookings open with FF Party 1.0. New state `partyEvents`, action PARTY_EVENT_SAVE.
- FF Party search: clients search FF Team members by skill, interest, qualification, language or area, with results as bookable Profile Cards. One shared `personSearchText(p)` now powers this and the Network search, which also gained interests, qualifications and languages.
- "Found wherever people search": FF Party is where the public Profile Card pages live, written for Google and AI assistants like ChatGPT. Wording is aspirational, not a ranking promise.
- Service Cards (coming soon) moved into the FF Party section, with the Party > Service > Review > Rebook line.
- Training: eight training types (Introduction to Cocktails, Mixology, WSET Spirits, WSET Wine, spirit brand training, FireFlair Open Class, FireFlair Open Bar, FireFlair Masterclass). Tap to mark interest, then Register interest with a WhatsApp number. New state `trainingInterest`, action TRAINING_INTEREST. The separate Training feed row on FF Team Home was removed, as this section replaces it.
- Festivals 2027: complete teams. Work festivals and other jobs with friends as one team. Shows an example team, Join FF Team and Invite a friend. Signed-in FF Team members get the Festivals 2027 wish list (ShiftRequests) right there. Team booking itself is marked coming soon.
- Home FF AI now sends events to FF Party, training to Training and festivals to Festivals; actions are Join FF Team, Plan an event, Training, Hire staff.
- Demo people now carry qualifications (WSET, Personal Licence, Food Hygiene). They show on their profiles and are searchable.
- WhatsApp numbers: the prototype stores only a masked copy (last three digits). The real site sends the full number to Core with the person's WhatsApp opt-in.
- Brand rule: the card theme previously keyed with the other word is now `burgundy` / "Burgundy". A profile saved with the old key falls back to Burgundy on load.
- SEO: home meta description and the text crawlers read before scripts run now mention FF Party, training and festival teams. The SEO self-test still passes 36/36.

## v16.7 — 2026-10-13 — SEO metadata module and accessibility pass
Artifact version 1791884567-4c1f · file `fireflair-v16.7.html`

SEO and accessibility pass — no change to look, routes, sign-in, profile editing, XP or cards.

For the developers:
- New SEO module (FF_SEO, ffSeoFor, ffSeoApply, ffSeoValidate, ffSeoSelfTest) builds title, description, canonical, robots, social tags and JSON-LD for each view and writes them to the head. Port it as the metadata layer of the real site; it is plain JS with no dependencies.
- Only signed-out Home is indexable. Signed-in and guest screens are noindex. A Profile Card is indexable only when person.public === true, it has a tag and FF_SEO.demoData is false (the sample people here are fictional, so it is true).
- Published cards get ProfilePage + Person JSON-LD built from the fields the card shows; never phone or e-mail. No dateModified is invented — Core must supply createdAt / updatedAt (ISO) if wanted.
- In the real site these tags must be in the server-rendered HTML, and each Profile Card needs its own URL (/TAG). Search engines may not honour a noindex or canonical that is only added by script.
- Home description now fits the 160-character limit; home title unchanged. Twitter card changed to "summary" because there is no share image yet; add a real 1200x630 image URL and switch to summary_large_image.
- Landing HTML now carries readable text before scripts run (replaced on first render).
- Headings: Home and signed-in Home FF AI title is now the page h1; the person page name is an h1 (PlayerCard nameAs prop, FFAI titleAs prop). Defaults unchanged.
- Accessibility: skip link, main landmark id, labelled navs, aria-current on the active tab, text alternative on profile photos (they are CSS backgrounds).
- Self-test: window.__ffSeo.selfTest() checks every screen and production-mode cases (36 checks).
- Hook point for analytics: FF_SEO.onView(seo). Nothing is sent from here.

## v16.6 — 2026-10-09 — FF AI CV reading tuned on real CVs
Artifact version 1791554187-acd6 · file `fireflair-v16.6.html`

FF AI CV extraction tuned against the five real CVs Alex supplied: Alexandru Gavrilas (regression CV), Hemant Shah, Marco (Word) and the two Mixology editions. The CVs themselves are not in this repo.

What changed
- Skills: one item per distinct skill, near-synonyms merged, and not every duty turned into a skill. On the regression CV this cut skill suggestions from 21 to 17, and on the Word CV from 39 to 32.
- Evidence quotes never carry phone numbers, emails or street addresses (these were showing up on location items).
- A name written in capitals on the CV ("ALEXANDRU GAVRILAS") is proposed in normal case ("Alexandru Gavrilas").
- Prompt wording for one page / one picture ("Picture 1 shows page 1…") and the photo line in the review ("From page 1 of your CV").

Regression result: Alexandru Gavrilas CV, through the app with a stand-in Claude answering the app's own prompts
- 64 suggestions. All 13 checks pass:
  - 7 employment entries, each with employer, title, dates, location and responsibilities.
  - Freelance section kept separate with Soho Mews House, The Roof Gardens, 77 Nightclub and Oriole.
  - All 10 interests (cooking, running, swimming, marathon, half marathon, shorter races, Ironman goal, drinks, team development, memorable guest experiences).
  - 7 professions and 17 skills.
  - WSET Wine & Spirits Level 2, plus flair/bartending courses and seminars/masterclasses.
  - Romanian Native and English Fluent.
  - Education.
  - Profile summary as About.
  - Achievements.
  - His portrait was found inside the PDF, proposed, and saved as the profile photo.
- 0 items rejected by validation. No duplicates when added twice.

Other CVs
- Hemant Shah (2-page PDF, no photo): 93 suggestions, including 12 jobs, 9 achievements and 4 degrees.
- Marco (Word): 67 suggestions, including 7 jobs and 3 languages.
- Mixology 5.1 (2 pages, logo grid): 123 suggestions, including 26 venues read from client logos (marked "check this") and a photo proposal.
- Mixology 5.0 is read identically.
- No errors on any of them.

## v16.5 — 2026-10-09 — FF AI reads CVs: extraction + review
Artifact version 1791552281-a5e0 · file `fireflair-v16.5.html`

FF AI now really reads a CV (PDF, Word, a photo or text) — every page — and turns it into editable profile suggestions. Nothing is saved until the person adds it.

Why
- The old FF AI was a keyword matcher (profileFromText) and the CV adapter was a mock that always said "not connected". That is why interests, descriptions and job history were missed and only a handful of items came back.

Pipeline (section 4, SERVICES — FF AI profile extraction)
- CV_READER.read(file): PDFs through pdf.js (pdfjs-dist 6.2.108, legacy build, loaded from jsDelivr only when a PDF is read; parsed on the page, no Worker). Text page by page in reading order, sections kept; each page is also pictured for the AI (layout, columns, scans); pictures inside the PDF are found from the drawing operations and cropped as possible profile photos. Word (.docx) is unzipped in the browser (DecompressionStream) — paragraphs, headings, bullets, tables, text boxes, headers/footers and embedded pictures. Photos of CVs go to the AI as pictures (it reads them). Text files as text. Old .doc and unknown types get a clear message.
- CV_ADAPTER.extract(doc): two FF AI calls run side by side (work history; profile details), each with the whole CV. The CV is wrapped as untrusted data and the prompt forbids following anything written inside it. Typed "Tell us about yourself" text uses one call.
- In this prototype FF AI is Claude through the artifact's `sample` capability (the viewer's own Claude account; no key in the page). The artifact now declares `sample` alongside `db`.
- validateExtraction(): every item is checked against the schema (category, title, description, evidence, confidence, page, proficiency, details: employer, location, start, end, venues, level, issuer, group). Failures are counted and listed, never silently dropped.
- buildSuggestions(): semantic de-duplication (case, punctuation, &/and, plurals, word order, bracketed notes) inside the result and against the profile. Distinct activities stay distinct (Running is not Marathon Running).
- extractionReport(): what was read, statuses (extracted, needs confirmation, unreadable, rejected by validation, duplicates merged, already on profile, failures), per-category counts, timings. Logged to the console as "[FF AI] extraction report" and shown under "How FF AI read this".

Review (ExtractionReview, used by both FF AI and the CV panel)
- Replaces "Found N things": "FF AI found N suggestions" where N is exactly what is listed. Grouped by category with counts and Tick all / Untick all; every item can be ticked, edited (title, employer, location, dates, level, description, and where it's saved) or removed. Employment shows employer · place · dates, freelance shows its venues, each item shows the CV quote it came from, and anything not clearly stated is marked "Check this".
- Proposed profile photo: preview, drag to move, zoom to crop, "Not me". Ticked only when the profile has no photo; otherwise it says it would replace the current one and stays unticked.
- Name (only when the profile has none) and the CV's personal summary as About.
- Things already on the profile are listed separately; if FF AI found details a card is missing, it can fill those EMPTY fields only (new RECORDS_FILL action). RECORDS_MERGE now uses the same semantic match so it never adds a near-duplicate card.
- When FF AI isn't available in a view (or the viewer declines), the old matcher is used and the review says so plainly.
- Progress with Stop; clear messages and a manual Try again for busy, failed or unreadable documents; a scanned CV in a view that can't send pictures is told so rather than returning nothing.

Profile
- New About section (profile.about) at the top of the profile, editable; shown on public profiles too.
- Information Cards show the CV details line (employer · place · dates, or a language's level as written); the card sheet shows and edits those details (record.details, with details.type = employment / freelance / education / achievement …). Venues get their location as the address.
- CV panel: "FF AI fills in your profile from it — PDF, Word or a photo." After upload FF AI starts reading; a saved CV has "Read with FF AI".

Tested in the built page (headless Chromium, phone and desktop)
- A synthetic two-page CV (7 jobs, freelance section with venues, interests in the summary and closing lines, WSET Level 2, flair courses, Romanian + English, education, portrait + logo) as PDF, Word and a photo; prompts recorded from the app and answered by a stand-in Claude, then replayed through the app: all 17 checks pass (all 7 jobs with details, freelance + venues, all 10 interests incl. Ironman goal, WSET, courses, languages with levels, education, About). Adding twice creates no duplicate cards and never overwrites an edit.
- Failure cases pass: FF AI absent or declined (fallback, labelled), busy (message + manual retry, no automatic retries), one call failing (partial result, flagged), Stop, picture-only CV without vision, damaged PDF, invalid items rejected and counted, oversized document cut to fit and flagged.
- Not testable from here: live FF AI answers in the published page (needs the viewer's consent), and the real Alexandru Gavrilas CV (not received yet).

Backend
- FireFlair-Backend gets the same contract on OpenAI as a separate pull request for Griffy (key in Render's environment only).

## v16.4 — 2026-10-09 — Q&A: green answered cards, two sides, shuffled
Artifact version 1791549316-6309 · file `fireflair-v16.4.html`

Q&A section: answered questions feel like an achievement, sit on their own side, and the order changes each visit.

Answered state
- Answered Question Cards turn green (QUESTION_DONE colours) with a green outline and a large green tick badge top-right, replacing the small tick.
- Answering a question for the first time plays a completion animation on that card: the card pops, a large green disc draws a tick, a ring pulses out with a few gold sparks (about 1.5s). Editing an existing answer doesn't replay it. Reduced-motion settings switch the animation off.
- The green state comes from the saved answer, so it's there on every visit.

Two sides
- One row, split by an "Answered" divider: unanswered on the left, answered on the right. Labels above: "To answer · n" and "Answered · n" (tap to jump to the answered side).
- Answering moves the card to the right side straight away and scrolls the row to it while the animation plays.
- Empty states: "Answered questions move here." / "All answered — nice work."

Order
- Each side is shuffled independently once per visit to the Profile page (ProfilePage calls resetQuestionOrder on mount) and stays still while the person is answering. Display order only — answers and completion are never changed.

Wording
- The "Generic" question group is now labelled "Freelancer" everywhere it shows (the internal key stays "generic").


## v16.3 — 2026-10-09 — Profession levels; public profile order + Ask a question
Artifact version 1791501889-f4bd · file `fireflair-v16.3.html`

Two focused additions: a level on each Profession Card, and a new section order for someone else's profile.

Profession level (Profession Card editor)
- New LEVEL field when creating or editing a Profession Card: five boxes, 1 Apprentice, 2 Developing, 3 Professional, 4 Expert, 5 Master. The chosen one is black/gold; tap it again to clear.
- One short line under it: "Profession level helps FireFlair connect Masters with Apprentices for training and development."
- Stored per profession as record.level (1–5, null until chosen); each profession has its own level. Constants: PROFESSION_LEVELS / professionLevelTitle.
- Never shown on the Profile Card, on profession cards, or to visitors (the field only appears in the owner's editor). Purpose: later Master <-> Apprentice training and mentorship matching in FireFlair Core.

Someone else's profile (PersonProfile / ProfileSections when isMe is false)
- Section order: Media, Network, Reviews & References, Professions, then the rest (qualifications, skills, interests, work locations, languages, experience, venues). Empty sections stay hidden, as before.
- Q&A is always the last section. "Ask a question" opens a sheet; the question becomes a Question Card on that person's profile (state.profileQuestions: { id, personId, text, askedAt, by, answer }). In this prototype it shows as "Sent to <name>"; Core needs to deliver it and supply the answer (from the person, or from FF AI using their profile).
- Book · Review · Join moved from under the card to the very bottom, below Q&A (same behaviour, now a shared ProfileActions component).
- Your own profile keeps its existing order.


## v16.2 — 2026-10-08 — Readability: Profile Card and Q&A text
Artifact version 1791498672-eb3d · file `fireflair-v16.2.html`

Readability pass on the Profile Card, Q&A cards and other cards. No layout or colour changes.

Typography rule now used on the profile:
- Tier 1 (names, main profession, questions, answers): biggest, darkest.
- Tier 2 (skills, interests, locations, languages, card titles, descriptions): medium size, strong contrast.
- Tier 3 (labels, card types, XP, status): small but solid, never faint.
- Display type (Cinzel) stays for headings, the card plate and the name. Everything a person writes about themselves is in Inter, which stays legible at small sizes. Cormorant is no longer used for profile content.

Profile Card (editable, in Profile Card step 2)
- Name: larger and bolder (Cinzel, 22px, 700).
- Profession, skill, interest, location and language chips: Inter 13.5px; the first profession (the main one) is bold.
- Typing fields in Inter 15px with stronger placeholders. Row labels are small but darker.
- FF Tag line and footer address in Inter, darker and larger.

Profile Card (finished: Section 5, Network tiles, profile view)
- Main profession bigger and darker gold (#6A4F12 on light cards).
- Row values in Inter semibold, about 1.5x the previous visible size. Labels darker.
- FF Tag address on the black pill is larger, with less letter-spacing.
- The FF watermark behind the card is about half as strong.
- Mini and landscape card formats: profession and address in Inter too.

Q&A cards
- Slightly wider (176–204px). Question in Inter 16px semibold; answer Inter 17px bold. "Tap to answer" is 15px, not tiny italic.
- Group, XP and "Answer" labels are smaller and quieter, so question and answer come first.

Other cards
- Profession / skill / qualification / experience cards, media cards and venue cards: titles in Inter bold 15px, descriptions in Inter 13px with stronger contrast, type labels raised from 6.5px to 8.5px.


## v16.1 — 2026-10-08 — Join the Team profile, WhatsApp sign-up, Save & Share, Section 5, invited-by Network
Artifact version 1791497422-8086 · file `fireflair-v16.1.html`

Everything since v16, in one release.

Profile page — "Join the Team"
- Section 1 is the account: FF Tag + phone number -> Continue -> WhatsApp code -> Create. The account exists once the code is verified.
- Optional password pop-up straight after ("Create a password?" / Skip for now). Without one, people sign in with a WhatsApp code.
- FF Tag is now a username: 3 to 8 letters or numbers, unique, not case sensitive, stored lower case (alex, alexg, alex94). It's suggested from the person's name, shown after "ffparty.uk/" with a live available/taken tick, and can be changed later (Section 1, or "FF Tag & sign-in" in the account menu). The placeholder is /username.
- Log in opens on "WhatsApp code"; password is the second option.
- Short headings, far less explanatory text: 1 Join the Team, 2 Profile Card, 3 FF AI & CV, 4 Your profile, then Save & Share, then Section 5.
- The profile saves itself once the account exists (no "Save your Profile Card" section).
- Save & Share replaces Save & Publish. Save is the explicit "done". Share sends the card to the person's own WhatsApp and turns their card link on.
- Section 5 sits under Save & Share, closed (its number, a short line and three dashes running down). Save opens it: "Welcome to the Team" + the finished Profile Card + an Add button.
- Add (the FF mark, also in the header) = "Share your card": type someone's phone number and send them your card.

Network
- A new user starts with one connection: the person who invited them, labelled "Invited you". Prototype: everyone arrives on Don Gee's link (DONGE). Tapping Join on someone's profile before having an account makes that person the inviter instead.

Cards
- Reorder controls are clear left/right arrows: <- 1 ->
- The decorative circle between the card type and the title is gone.
- Media cards: title at the top, the media fills the rest, no description.
- Question cards: question on the top half, answer on the bottom half in larger type.

Look and feel
- Have a CV?: pale burgundy box with a burgundy button before upload; after upload it stays on the page in a calm neutral state with Replace.
- Pick your professions uses the FireFlair gold, with dark text and burgundy for chosen professions.
- Profile photo control: camera with a + in the small circle on the card. The microphone is drawn into the page. The icon library now loads from a second source if the first doesn't arrive.
- Real map (Leaflet) on Home and Network.

For the developers — what Core needs to provide (all mocked here, nothing is sent):
- AUTH_ADAPTER: suggestTag, isAvailable, sendSignupCode, verifySignupCode (this creates the account), setPassword, changeTag, loginWithPassword, sendCode/verifyCode (WhatsApp log-in).
- PROFILE_ADAPTER: save (auto-save and the Save button), share (card to the person's own WhatsApp), shareTo (card to someone else's number).
- Invites: the inviter comes from the link's tag (INVITE_LINK_TAG in the prototype) or from Join on a profile.


