# FireFlair photo library

Every photo Alex has supplied for the FireFlair sites, in one place, so any image on the website can be swapped and future features (for example a slideshow) can draw from the same set.

- `originals/`: the files exactly as supplied (full resolution, original format).
- `web/`: web copies (WebP, up to 2000 px, orientation fixed). Screenshots have the app interface trimmed off. The video has an H.264 `.mp4` that plays in every browser and a still.
- `thumbs/`: 480 px previews.
- `library.json`: one entry per photo: id, title, description, sizes, orientation, people, visible brands, tags, `focus` (where the faces/subject are, 0 to 1 across and down), `keep` (the area that must stay in any crop), near-duplicates, and where the photo is used.
- `contact-sheet.jpg`: every photo at a glance.

## How the prototype uses them

- **Pillar photos (home page, all three sites):** each pillar has five photos. The tile shows one and the pillar's three cards show three others, so nothing repeats. Every visit starts one photo further on, and while no pillar is open the tiles crossfade to their next photo, one tile at a time (no movement when the visitor has reduced motion on). Crops: `t17_<id>` (tile) and `j17_<id>` (card) in `assets/photos/`.
- **FF Team uses no photo twice** anywhere on the site. Duplicates across different sites are fine.
- Each crop is made to the exact shape it is shown at, with heads kept in frame; `FOCUS17` in the code tells the browser where the faces are when a photo is shown at another shape (desktop tiles, the Next strip, story headers).

## Notes

- Many photos show identifiable people and visible drinks brands (see `brands_visible`). Confirm permission before the public launch.
- Near-duplicates: p21/p22 (two takes of the same moment) and p46/p47 (two takes of the beach club team). Only one of each pair is used per site.
- p02 (purple selfie) is in the library but not on the sites: its faces sit at the edges and do not crop cleanly into the site's shapes.

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
| p09 | Flaming a cocktail (GIF) | animation, portrait | - | - | Dream job |
| p10 | Bartender flaming a coupe | photo, landscape | 1 | - | FF Team home; Shared image key (set in v17.3.80) |
| p11 | Smiling bartender with a pink drink | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home; Shared image key (set in v17.3.80) |
| p12 | Guest photographing her cocktail | photo, portrait | 1 | - | FF Party home; Reward; Shared image key (set in v17.3.80) |
| p13 | Guests photographing strawberry mojitos | photo, landscape | 2 | - | Story |
| p14 | Row of pink shots | photo, portrait | - | - | FF Party home; Story |
| p15 | Gin balloon | photo, portrait | - | Bombay Sapphire | FF Party home; Shared image key (set in v17.3.80); Training card |
| p16 | Layered shots | photo, portrait | - | - | Reward |
| p17 | Three martinis with a red swirl | photo, portrait | - | - | Signature Cocktails card 2 (also FF Party cocktail menu) |
| p18 | Martini with rose petals | photo, portrait | - | - | FF Party home; Shared image key (set in v17.3.80); Training card |
| p19 | Martini with mint and raspberries | photo, portrait | - | - | Signature Cocktails card 1 (also FF Party cocktail menu) |
| p20 | Iced coffee cocktail | photo, portrait | - | - | Dream job; FF Party home; Shared image key (set in v17.3.80) |
| p21 | Shaking cocktails at a garden party (1) | photo, landscape | 2 | - | FF Team home |
| p22 | Shaking cocktails at a garden party (2) | photo, landscape | 2 | - | Shared image key (set in v17.3.80) |
| p23 | Bartender pouring at a garden bar | photo, landscape | 1 | - | FF Business home; Shared image key (set in v17.3.80); Story |
| p24 | Three women shaking cocktails | photo, portrait | 3 | - | Bookings; FF Business home; FF Party home; Shared image key (set in v17.3.80) |
| p25 | Shaking a cocktail at a festival | photo, portrait | 1 | - | Shared image key (set in v17.3.80); Story |
| p26 | Two bartenders at a brand bar | photo, portrait | 2 | - | FF Business home; FF Party home; FF Team home; Shared image key (set in v17.3.80) |
| p27 | Bartender in a suit, dark bar | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home |
| p28 | Creamy cocktail on a saucer | photo, portrait | - | - | Signature Cocktails card 3 (also FF Party cocktail menu) |
| p29 | Waiter with a tray of cocktails | photo, portrait | 1 | - | FF Business home; FF Party home; FF Team home |
| p30 | Strawberry sours lined up | photo, portrait | - | - | FF Business home; FF Party home; FF Team home |
| p31 | Bartender behind a row of sours | photo, portrait | 1 | - | FF Business home; FF Party home; Training card |
| p32 | Event bar under red lights | photo, landscape | - | Vooshka | FF Party home; Story |
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
| p45 | Hospitality team in a race grandstand | photo, square | 30 | - | Bookings; FF Business home |
| p46 | Beach club team at a race weekend (1) | photo, landscape | 11 | Nikki Beach, F1 | FF Business home; FF Party home; FF Team home |
| p47 | Beach club team at a race weekend (2) | photo, landscape | 11 | Nikki Beach, F1 | library only |
