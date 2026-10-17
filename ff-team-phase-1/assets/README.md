# Phase 1 image pack (v1.7.1)

These are the optimised images that v1.7.1 embeds in the page (as data URIs, so
the single `.html` file still opens on its own). They are here so the real site
can serve them as normal files.

- **Illustrative only.** The supplied pack is AI-generated artwork. It stands in
  until real, licensed or approved photography replaces it. No new images with
  people were generated for v1.7.1 (crowds and hands only).
- `fireflair_hero_whiskey_bar.webp` (1800 px) and `_900.webp` (900 px): the
  whiskey-glass bar photo. The official FireFlair Coin is overlaid by the page
  and is never redrawn or baked into the photo.
- `fireflair_teams_event.webp`: the FireFlair Teams section image.
- `dream_*.webp` (8): Dream jobs carousel. `training_*.webp` (8): Training carousel.
- `reward_*.webp` (8): Rewards carousel. See the note below.
- `fireflair_home_hero_sunset_rooftop_unused.webp`: the earlier hero from the
  first pack, kept for use elsewhere. Not used in the page.

## Rewards: the supplied files did not match their names

The Rewards images arrived as two-panel collages (a white gutter between the
panels), and what the panels show does not match the file names. For example,
`reward_international_travel.jpg` is a plane over Big Ben on the left and a bar
on the right. v1.7.1 therefore cuts each panel out and matches it to a reward
by what it shows (`mk_assets.py`, `PANELS`):

| Reward | Panel used (source collage, side) | What it shows |
|---|---|---|
| Bar shows | `reward_international_travel`, left | plane and Big Ben at sunset |
| Training tickets | `reward_international_travel`, right | a bar, training-session feel |
| Amex card | `reward_professional_training`, left | leather wallet and whiskey |
| NFC card | `reward_nfc_card`, right | brushed black card, no mark |
| Bar kit | `reward_bar_kit`, left | leather bar-tool roll |
| Car rental | `reward_ff_party`, right | car |
| FF Party | `reward_professional_photography`, left | Christmas bar, garland, candles |
| Photoshoot | `reward_professional_photography`, right | camera on tripod |

The pairing is a best fit, not a given. Confirm it, or supply one corrected
image per reward, and swap the file. `mk_assets.py` was run in the working
folder of the person building the prototype (it reads the supplied zips from
there), so it is a record of how the panels were cut, not a script that runs
from this repo.
