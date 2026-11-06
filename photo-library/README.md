# FireFlair photo library

Every photo supplied for the FireFlair sites, in one place, so any image on the website can be swapped and future features (for example a slideshow) can draw from the same set. 166 items.

- `originals/`: the files as supplied (full resolution, original format). Vooshka photos are the files from the Vooshka profile in the prototype.
- `web/`: web copies (WebP, up to 2000 px, orientation fixed). Screenshots have the app interface trimmed off. The video has an H.264 `.mp4` that plays in every browser and a still.
- `thumbs/`: 480 px previews.
- `library.json`: one entry per photo: id, title, description, batch, sizes, orientation, people, visible brands, tags, `focus` (where the faces/subject are, 0 to 1 across and down), `keep` (the area that must stay in any crop), near-duplicates, and where the photo is used.
- `contact-sheet.jpg`: every photo at a glance.

## Groups and ids

| Ids | Group | Count | On FF Team? |
|---|---|---|---|
| p01-p47, v01 | Alex's uploads (three batches and a video) | 48 | Yes, all but p02, p09, p22, p47 (see notes) |
| vkg01-vkg17, vko01 | Vooshka gallery: event bars and bartenders | 18 | Bar and people photos without prominent Vooshka branding |
| vke01-vke13 | Photos the prototype used before 6 Nov (Vooshka events) | 13 | Yes, the people and event-bar ones; vke08 and vke13 are copies of vkg02 and vkg15 |
| vkb01-vkb42 | Vooshka bar designs | 42 | No (library only) |
| vks01-vks16 | Vooshka signature cocktails | 16 | No (library only) |
| vkc01-vkc29 | Classic cocktail photos | 29 | No (library only) |

## How the prototype uses them

- **Pillar photos (home page):** FF Team pillars have five tile photos and their own set of card photos; the two never overlap, so a pillar never shows the same photo twice. FF Business and FF Party pillars have five photos shared between the tile and the cards (the cards always show the photos after the tile one). Every visit starts one photo further on, and while no pillar is open the tiles crossfade one at a time (no movement with reduced motion on). Crops: `t17_<id>` (tile) and `j17_<id>` (card) in `assets/photos/`.
- **FF Team uses no photo twice** anywhere on the site. Duplicates across different sites are fine.
- Each crop is cut to the exact shape it is shown at, with heads kept in frame; `FOCUS17` in the code gives the face position for places that show a crop at another shape.

## Notes

- Many photos show identifiable people and visible drinks brands (see `brands_visible`). Confirm permission before the public launch.
- Near-duplicates: p21/p22, p46/p47, p09/p10 (same bartender and bar), vkg02/vkg08/vke08 (same monogram bar), vkg15/vke13 (same bartender). Only one of each is used per site.
- Not on FF Team: p02 (faces at the edges, will not crop cleanly), p09 (too close to p10), p22 and p47 (second takes), Vooshka photos with prominent branding, bar designs and cocktail photos.

## Photos

| Id | Title | Kind | People | Brands | Used on |
|---|---|---|---|---|---|
| p01 | Rosemary and lime highballs | photo, portrait | - | - | FF Business home; FF Party home; FF Team home |
| p02 | Guests and bartender selfie | photo, square | 3 | - | library only |
| p03 | Whiskey sours being garnished | photo, portrait | - | - | Story |
| p04 | Bartender with a blow torch | photo, portrait | 1 | - | FF Business home; FF Team home; Shared image key (set in v17.3.80) |
| p05 | Bartender tool roll (wide) | photo, landscape | - | ROOT7 | FF Business home; FF Team home |
| p06 | Martini glasses and mixing glass | photo, portrait | - | - | FF Business home; Shared image key (set in v17.3.80); Story |
| p07 | Three flutes | photo, landscape | - | - | FF Party home; Shared image key (set in v17.3.80); Training card |
| p08 | Frosted shot with grapefruit crisp | photo, landscape | - | - | FF Party home; Training card |
| p09 | Flaming a cocktail (GIF) | animation, portrait | - | - | library only |
| p10 | Bartender flaming a coupe | photo, landscape | 1 | - | FF Team home |
| p11 | Smiling bartender with a pink drink | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home; Shared image key (set in v17.3.80) |
| p12 | Guest photographing her cocktail | photo, portrait | 1 | - | FF Party home; Shared image key (set in v17.3.80); Story |
| p13 | Guests photographing strawberry mojitos | photo, landscape | 2 | - | FF Team home |
| p14 | Row of pink shots | photo, portrait | - | - | FF Party home; Story |
| p15 | Gin balloon | photo, portrait | - | Bombay Sapphire | FF Party home; Shared image key (set in v17.3.80); Story |
| p16 | Layered shots | photo, portrait | - | - | Training card |
| p17 | Three martinis with a red swirl | photo, portrait | - | - | Signature Cocktails card 2 (also FF Party cocktail menu) |
| p18 | Martini with rose petals | photo, portrait | - | - | FF Party home; Shared image key (set in v17.3.80); Training card |
| p19 | Martini with mint and raspberries | photo, portrait | - | - | Signature Cocktails card 1 (also FF Party cocktail menu) |
| p20 | Iced coffee cocktail | photo, portrait | - | - | Dream job; FF Party home; Shared image key (set in v17.3.80) |
| p21 | Shaking cocktails at a garden party (1) | photo, landscape | 2 | - | FF Team home |
| p22 | Shaking cocktails at a garden party (2) | photo, landscape | 2 | - | Shared image key (set in v17.3.80) |
| p23 | Bartender pouring at a garden bar | photo, landscape | 1 | - | FF Business home; FF Team home |
| p24 | Three women shaking cocktails | photo, portrait | 3 | - | Bookings; FF Business home; FF Party home |
| p25 | Shaking a cocktail at a festival | photo, portrait | 1 | - | Shared image key (set in v17.3.80); Story |
| p26 | Two bartenders at a brand bar | photo, portrait | 2 | - | FF Business home; FF Party home; FF Team home; Shared image key (set in v17.3.80) |
| p27 | Bartender in a suit, dark bar | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home |
| p28 | Creamy cocktail on a saucer | photo, portrait | - | - | Signature Cocktails card 3 (also FF Party cocktail menu) |
| p29 | Waiter with a tray of cocktails | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home |
| p30 | Strawberry sours lined up | photo, portrait | - | - | FF Business home; FF Party home; FF Team home |
| p31 | Bartender behind a row of sours | photo, portrait | 1 | - | FF Business home; FF Party home; Story |
| p32 | Event bar under red lights | photo, landscape | - | Vooshka | FF Party home; FF Team home |
| p33 | Bartender pouring at a tequila stand | photo, square | 1 | Altos | Shared image key (set in v17.3.80); Story |
| p34 | Bartender serving strawberry cocktails | photo, square | 1 | - | FF Business home; FF Team home; Shared image key (set in v17.3.80) |
| p35 | Two bartenders at a marquee bar | photo, landscape | 2 | - | FF Business home; FF Party home; FF Team home |
| p36 | Bartender tool roll (top down) | photo, landscape | - | ROOT7 | Bookings; FF Business home; Shared image key (set in v17.3.80) |
| p37 | Team at a glass atrium bar | photo, landscape | 7 | - | FF Business home; FF Team home |
| v01 | Cocktail line-up (video) | video, portrait | - | - | FF Business home; FF Party home; FF Team home |
| p38 | Bar show selfie: drinks stand | photo, landscape | 3 | - | Story |
| p39 | Bar show selfie: gin stand | photo, landscape | 5 | Malfy Gin | FF Team home |
| p40 | Bar show selfie: tequila stand | photo, landscape | 4 | Cazcabel | FF Team home |
| p41 | Bar show selfie: mastiha stand | photo, landscape | 4 | Kleos, Difford's Guide | FF Team home |
| p42 | Night selfie with brand team | photo, landscape | 5 | Jägermeister | FF Team, Your team |
| p43 | Bar show: cocktail passports | photo, landscape | 3 | Luxardo, Granikal | FF Team home |
| p44 | Brand event team under a light arch | photo, landscape | 11 | Patrón | FF Business home; FF Party home; FF Team home |
| p45 | Hospitality team in a race grandstand | photo, square | 30 | - | FF Business home; FF Team home |
| p46 | Beach club team at a race weekend (1) | photo, landscape | 11 | Nikki Beach, F1 | Bookings; FF Business home; FF Party home |
| p47 | Beach club team at a race weekend (2) | photo, landscape | 11 | Nikki Beach, F1 | library only |
| vko01 | Vooshka event bar with team | photo, landscape | 4 | Vooshka | library only |
| vkg01 | Vooshka gallery: Behind every memorable occasion | photo, portrait | 1 | - | Reward |
| vkg02 | Vooshka gallery: A personalised focal point | photo, landscape | - | - | FF Team home |
| vkg03 | Vooshka gallery: Bespoke tropical styling | photo, landscape | - | Vooshka | library only |
| vkg04 | Vooshka gallery: A statement in light | photo, landscape | - | Vooshka | library only |
| vkg05 | Vooshka gallery: Classic lines, distinctive details | photo, landscape | - | Vooshka | library only |
| vkg06 | Vooshka gallery: After-dark atmosphere | photo, portrait | - | - | library only |
| vkg07 | Vooshka gallery: Warm hospitality, expertly delivered | photo, landscape | - | Vooshka | library only |
| vkg08 | Vooshka gallery: An elegant centrepiece | photo, portrait | - | - | library only |
| vkg09 | Vooshka gallery: A setting made for celebration | photo, portrait | - | Vooshka | library only |
| vkg10 | Vooshka gallery: The details set the tone | photo, portrait | - | - | library only |
| vkg11 | Vooshka gallery: At the heart of the occasion | photo, portrait | - | - | FF Team home |
| vkg12 | Vooshka gallery: Your bar, your way | photo, portrait | - | - | library only |
| vkg13 | Vooshka gallery: A distinctive focal point | photo, landscape | - | Vooshka | library only |
| vkg14 | Vooshka gallery: A look entirely your own | photo, portrait | - | - | FF Team home |
| vkg15 | Vooshka gallery: A little theatre, expertly delivered | photo, portrait | - | Vooshka | library only |
| vkg16 | Vooshka gallery: Expert service, from cocktails to draught beer | photo, portrait | 1 | - | Training card |
| vkg17 | Vooshka gallery: Expert hands, memorable occasions | photo, portrait | 1 | - | Training card |
| vkb01 | Vooshka bar design: Bar 04 | photo, landscape | - | Vooshka | library only |
| vkb02 | Vooshka bar design: Bar 01 | photo, landscape | - | Vooshka | library only |
| vkb03 | Vooshka bar design: Bar 02 | photo, landscape | - | Vooshka | library only |
| vkb04 | Vooshka bar design: Bar 08 | photo, landscape | - | Vooshka | library only |
| vkb05 | Vooshka bar design: Bar 17 | photo, landscape | - | Vooshka | library only |
| vkb06 | Vooshka bar design: Bar 31 | photo, landscape | - | Vooshka | library only |
| vkb07 | Vooshka bar design: Bar 07 | photo, landscape | - | Vooshka | library only |
| vkb08 | Vooshka bar design: Bar 13 | photo, landscape | - | Vooshka | library only |
| vkb09 | Vooshka bar design: Bar 06 | photo, landscape | - | Vooshka | library only |
| vkb10 | Vooshka bar design: Bar 33 | photo, landscape | - | Vooshka | library only |
| vkb11 | Vooshka bar design: Bar 03 | photo, landscape | - | Vooshka | library only |
| vkb12 | Vooshka bar design: Bar 11 | photo, landscape | - | Vooshka | library only |
| vkb13 | Vooshka bar design: Bar 34 | photo, landscape | - | Vooshka | library only |
| vkb14 | Vooshka bar design: Bar 09 | photo, landscape | - | Vooshka | library only |
| vkb15 | Vooshka bar design: Bar 10 | photo, landscape | - | Vooshka | library only |
| vkb16 | Vooshka bar design: Bar 05 | photo, landscape | - | Vooshka | library only |
| vkb17 | Vooshka bar design: Bar 32 | photo, landscape | - | Vooshka | library only |
| vkb18 | Vooshka bar design: Bar 14 | photo, landscape | - | Vooshka | library only |
| vkb19 | Vooshka bar design: Bar 23 | photo, landscape | - | Vooshka | library only |
| vkb20 | Vooshka bar design: Bar 16 | photo, landscape | - | Vooshka | library only |
| vkb21 | Vooshka bar design: Bar 22 | photo, landscape | - | Vooshka | library only |
| vkb22 | Vooshka bar design: Bar 35 | photo, landscape | - | Vooshka | library only |
| vkb23 | Vooshka bar design: Bar 29 | photo, landscape | - | Vooshka | library only |
| vkb24 | Vooshka bar design: Bar 12 | photo, landscape | - | Vooshka | library only |
| vkb25 | Vooshka bar design: Bar 21 | photo, landscape | - | Vooshka | library only |
| vkb26 | Vooshka bar design: Bar 38 | photo, landscape | - | Vooshka | library only |
| vkb27 | Vooshka bar design: Bar 20 | photo, landscape | - | Vooshka | library only |
| vkb28 | Vooshka bar design: Bar 41 | photo, landscape | - | Vooshka | library only |
| vkb29 | Vooshka bar design: Bar 15 | photo, landscape | - | Vooshka | library only |
| vkb30 | Vooshka bar design: Bar 37 | photo, landscape | - | Vooshka | library only |
| vkb31 | Vooshka bar design: Bar 26 | photo, landscape | - | Vooshka | library only |
| vkb32 | Vooshka bar design: Bar 36 | photo, landscape | - | Vooshka | library only |
| vkb33 | Vooshka bar design: Bar 18 | photo, landscape | - | Vooshka | library only |
| vkb34 | Vooshka bar design: Bar 39 | photo, landscape | - | Vooshka | library only |
| vkb35 | Vooshka bar design: Bar 24 | photo, landscape | - | Vooshka | library only |
| vkb36 | Vooshka bar design: Bar 19 | photo, landscape | - | Vooshka | library only |
| vkb37 | Vooshka bar design: Bar 25 | photo, landscape | - | Vooshka | library only |
| vkb38 | Vooshka bar design: Bar 30 | photo, landscape | - | Vooshka | library only |
| vkb39 | Vooshka bar design: Bar 40 | photo, landscape | - | Vooshka | library only |
| vkb40 | Vooshka bar design: Bar 27 | photo, landscape | - | Vooshka | library only |
| vkb41 | Vooshka bar design: Bar 28 | photo, landscape | - | Vooshka | library only |
| vkb42 | Vooshka bar design: Bar 42 | photo, landscape | - | Vooshka | library only |
| vks01 | Vooshka signature cocktail: Popcorn Whisky | photo, square | - | - | library only |
| vks02 | Vooshka signature cocktail: Marmalade Gin | photo, landscape | - | - | library only |
| vks03 | Vooshka signature cocktail: Limoncello Martini | photo, landscape | - | - | library only |
| vks04 | Vooshka signature cocktail: Maple Old Fashioned | photo, landscape | - | - | library only |
| vks05 | Vooshka signature cocktail: Maple Manhattan | photo, landscape | - | - | library only |
| vks06 | Vooshka signature cocktail: Maple Espresso Martini | photo, landscape | - | - | library only |
| vks07 | Vooshka signature cocktail: Raspberry & Lychee Mojito | photo, square | - | - | library only |
| vks08 | Vooshka signature cocktail: Ginger & Passionfruit Mojito | photo, square | - | - | library only |
| vks09 | Vooshka signature cocktail: Strawberry & Ting Mojito | photo, square | - | - | library only |
| vks10 | Vooshka signature cocktail: Limoncello & Lychee Mojito | photo, square | - | - | library only |
| vks11 | Vooshka signature cocktail: Spicy Strawberry Margarita | photo, portrait | - | - | library only |
| vks12 | Vooshka signature cocktail: Mango Colada | photo, portrait | - | - | library only |
| vks13 | Vooshka signature cocktail: Penicillin | photo, square | - | - | library only |
| vks14 | Vooshka signature cocktail: Passionfruit & Lychee Sour | photo, square | - | - | library only |
| vks15 | Vooshka signature cocktail: Guava & Ginger Mule | photo, square | - | - | library only |
| vks16 | Vooshka signature cocktail: Raspberry & Rose Martini | photo, square | - | - | library only |
| vkc01 | Classic cocktail: Margarita | photo, portrait | - | - | library only |
| vkc02 | Classic cocktail: Mojito | photo, portrait | - | - | library only |
| vkc03 | Classic cocktail: Passion Fruit Martini | photo, square | - | - | library only |
| vkc04 | Classic cocktail: Espresso Martini | photo, landscape | - | - | library only |
| vkc05 | Classic cocktail: Cosmopolitan | photo, square | - | - | library only |
| vkc06 | Classic cocktail: Piña Colada | photo, portrait | - | - | library only |
| vkc07 | Classic cocktail: Aperol Spritz | photo, landscape | - | - | library only |
| vkc08 | Classic cocktail: Old Fashioned | photo, landscape | - | - | library only |
| vkc09 | Classic cocktail: Negroni | photo, landscape | - | - | library only |
| vkc10 | Classic cocktail: Moscow Mule | photo, landscape | - | - | library only |
| vkc11 | Classic cocktail: Tom Collins | photo, landscape | - | - | library only |
| vkc12 | Classic cocktail: Whisky Sour | photo, landscape | - | - | library only |
| vkc13 | Classic cocktail: Bramble | photo, square | - | - | library only |
| vkc14 | Classic cocktail: Manhattan | photo, landscape | - | - | library only |
| vkc15 | Classic cocktail: Paloma | photo, square | - | - | library only |
| vkc16 | Classic cocktail: Lychee Martini | photo, square | - | - | library only |
| vkc17 | Classic cocktail: Strawberry Daiquiri | photo, landscape | - | - | library only |
| vkc18 | Classic cocktail: Mai Tai | photo, landscape | - | - | library only |
| vkc19 | Classic cocktail: French 75 | photo, square | - | - | library only |
| vkc20 | Classic cocktail: French Martini | photo, square | - | - | library only |
| vkc21 | Classic cocktail: Limoncello Spritz | photo, square | - | - | library only |
| vkc22 | Classic cocktail: Sarti Rosé Spritz | photo, square | - | - | library only |
| vkc23 | Classic cocktail: Elderflower Spritz | photo, square | - | - | library only |
| vkc24 | Classic cocktail: Spicy Margarita | photo, portrait | - | - | library only |
| vkc25 | Classic cocktail: Guava Margarita | photo, square | - | - | library only |
| vkc26 | Classic cocktail: Strawberry Mojito | photo, landscape | - | - | library only |
| vkc27 | Classic cocktail: Pineapple Mojito | photo, landscape | - | - | library only |
| vkc28 | Classic cocktail: Mango Mojito | photo, landscape | - | - | library only |
| vkc29 | Classic cocktail: Peach Mojito | photo, landscape | - | - | library only |
| vke01 | Bartenders serving at an event | photo, portrait | 2 | - | FF Team home |
| vke02 | Martini tray under pink light | photo, portrait | - | - | FF Team home |
| vke03 | Bartender pouring under stage lights | photo, portrait | 1 | - | FF Team home |
| vke04 | Bartender straining a cocktail | photo, portrait | 1 | - | FF Team home |
| vke05 | Mojitos under purple light | photo, portrait | - | - | Training card |
| vke06 | A busy event bar | photo, portrait | 6 | - | FF Team home |
| vke07 | Bartender pouring (black and white) | photo, portrait | 1 | - | Training card |
| vke08 | Monogram bar with tree (tile crop) | photo, portrait | - | - | library only |
| vke09 | Bartender in a cap (black and white) | photo, portrait | 1 | - | FF Team home |
| vke10 | Party cocktails with cherries | photo, portrait | - | - | Reward |
| vke11 | Pink cocktail line-up | photo, portrait | - | - | Dream job |
| vke12 | Rows of coupes with cherries | photo, portrait | - | - | FF Team home |
| vke13 | Bartender in a Vooshka apron | photo, square | 1 | Vooshka | library only |
