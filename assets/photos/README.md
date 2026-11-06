# Photo crops used by the prototype (v17.3.81)

Each file is a crop of a photo from `photo-library/` (ids in `photo-library/library.json`), cut to the exact shape it is shown at, with heads kept in frame. The published page embeds these as data URIs under `PHOTOS17`; `FOCUS17` gives the face position for places that show a crop at another shape.

## Pillar photos (rotate on the home page)

`t17_<id>.webp` is the tile crop, `j17_<id>.webp` the card crop. Five photos per pillar; the tile shows one and the three cards show three others.

**FF Team**

- community: p37 (Team at a glass atrium bar), p35 (Two bartenders at a marquee bar), p26 (Two bartenders at a brand bar), p46 (Beach club team at a race weekend (1)), p21 (Shaking cocktails at a garden party (1))
- services: p01 (Rosemary and lime highballs), p30 (Strawberry sours lined up), v01 (Cocktail line-up (video)), p34 (Bartender serving strawberry cocktails), p05 (Bartender tool roll (wide))
- events: p39 (Bar show selfie: gin stand), p40 (Bar show selfie: tequila stand), p41 (Bar show selfie: mastiha stand), p43 (Bar show: cocktail passports), p44 (Brand event team under a light arch)
- profiles: p29 (Waiter with a tray of cocktails), p11 (Smiling bartender with a pink drink), p27 (Bartender in a suit, dark bar), p04 (Bartender with a blow torch), p10 (Bartender flaming a coupe)

**FF Business**

- community: p44 (Brand event team under a light arch), p37 (Team at a glass atrium bar), p35 (Two bartenders at a marquee bar), p45 (Hospitality team in a race grandstand), p26 (Two bartenders at a brand bar)
- events: p29 (Waiter with a tray of cocktails), p23 (Bartender pouring at a garden bar), p46 (Beach club team at a race weekend (1)), p24 (Three women shaking cocktails), p31 (Bartender behind a row of sours)
- services: p06 (Martini glasses and mixing glass), v01 (Cocktail line-up (video)), p30 (Strawberry sours lined up), p01 (Rosemary and lime highballs), p34 (Bartender serving strawberry cocktails)
- profiles: p27 (Bartender in a suit, dark bar), p36 (Bartender tool roll (top down)), p11 (Smiling bartender with a pink drink), p05 (Bartender tool roll (wide)), p04 (Bartender with a blow torch)

**FF Party**

- community: p31 (Bartender behind a row of sours), p29 (Waiter with a tray of cocktails), p11 (Smiling bartender with a pink drink), p35 (Two bartenders at a marquee bar), p27 (Bartender in a suit, dark bar)
- services: p30 (Strawberry sours lined up), p01 (Rosemary and lime highballs), v01 (Cocktail line-up (video)), p14 (Row of pink shots), p07 (Three flutes)
- events: p32 (Event bar under red lights), p44 (Brand event team under a light arch), p24 (Three women shaking cocktails), p26 (Two bartenders at a brand bar), p46 (Beach club team at a race weekend (1))
- profiles: p12 (Guest photographing her cocktail), p18 (Martini with rose petals), p20 (Iced coffee cocktail), p15 (Gin balloon), p08 (Frosted shot with grapefruit crisp)

## Other places

| File | Photo | Where |
|---|---|---|
| `tm_live.webp` | p42 Night selfie with brand team | FF Team, Your team: Live event |
| `cocktail_0.webp` | p19 Martini with mint and raspberries | Signature Cocktails card 1 (also FF Party cocktail menu) |
| `cocktail_1.webp` | p17 Three martinis with a red swirl | Signature Cocktails card 2 (also FF Party cocktail menu) |
| `cocktail_2.webp` | p28 Creamy cocktail on a saucer | Signature Cocktails card 3 (also FF Party cocktail menu) |
| `jr_whyteam.webp` | p25 Shaking a cocktail at a festival | Story: Why join FF Team |
| `jr_sidehustle.webp` | p06 Martini glasses and mixing glass | Story: Side hustle tax-free allowance |
| `jr_workteam.webp` | p23 Bartender pouring at a garden bar | Story: How to receive and accept work on FF Team |
| `jr_profile.webp` | p33 Bartender pouring at a tequila stand | Story: How to build a bartender profile |
| `jr_shifts.webp` | p32 Event bar under red lights | Story: How to get your first event shifts |
| `jr_sites.webp` | p38 Bar show selfie: drinks stand | Story: Three FireFlair sites, one network |
| `jr_cards.webp` | p14 Row of pink shots | Story: Why everything on FireFlair is a card |
| `jr_menuteam.webp` | p03 Whiskey sours being garnished | Story: Learn the menu |
| `jr_cardsteam.webp` | p13 Guests photographing strawberry mojitos | Story: Your Service Cards |
| `bk_training.webp` | p24 Three women shaking cocktails | Bookings: Training drop-down photo |
| `bk_jobs.webp` | p45 Hospitality team in a race grandstand | Bookings: Dream jobs drop-down photo |
| `bk_rewards.webp` | p36 Bartender tool roll (top down) | Bookings: FireFlair rewards drop-down photo |
| `in_tr_mixology.webp` | p18 Martini with rose petals | Training card: Mixology |
| `in_tr_wset_spirits.webp` | p15 Gin balloon | Training card: WSET Spirits |
| `in_tr_wset_wine.webp` | p07 Three flutes | Training card: WSET Wine |
| `in_tr_ff_open_class.webp` | p31 Bartender behind a row of sours | Training card: FireFlair Open Class |
| `in_tr_ff_masterclass.webp` | p08 Frosted shot with grapefruit crisp | Training card: FireFlair Masterclass |
| `in_dj_food_festivals.webp` | p20 Iced coffee cocktail | Dream job: Food festivals and markets |
| `in_dj_flair.webp` | p09 Flaming a cocktail (GIF) | Dream job: Flair jobs |
| `in_rw_party.webp` | p16 Layered shots | Reward: FF January Christmas party |
| `in_rw_shoot.webp` | p12 Guest photographing her cocktail | Reward: Professional photoshoot |

## Kept from v17.3.80 (shared keys)

`training_*`, `reward_bar_kit`, `reward_photoshoot`, `reward_bar_shows`, `reward_ff_party`, `dream_music_festivals`, `dream_flair_jobs`, `dream_food_festivals_markets`, `teams`, `face_vooshka`, `px_bar` still carry the v17.3.80 photos for FF Business and FF Party pages and stories. FF Team cards read the original images (`window.FF_IMG_AI`) for these keys, so FF Team never repeats a photo.
