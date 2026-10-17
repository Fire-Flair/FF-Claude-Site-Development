"""Build the v1.7.1 image pack.
Reads: the user's carousel zips (z2/ webps for Dream jobs + Training, zip/ JPG collages for Rewards),
       the hero and teams images already optimised in assets/.
Writes: assets/reward_*.webp (single panels), ff_img.js (window.FF_IMG = {key: data-URI}).
The Rewards files in the supplied pack are two-panel collages (white gutter) whose contents do
not match their file names, so each panel is cut out and matched to a reward by what it shows.
"""
import base64, json, os
from pathlib import Path
from PIL import Image
S = Path(__file__).resolve().parent.parent
A = S / "a17" / "assets"
SRC = S / "zip" / "fireflair_carousel_images"
# (output name, source collage, panel)  L = left panel, R = right panel
PANELS = [
    ("reward_bar_shows",        "reward_international_travel", "L"),   # plane + Big Ben at sunset
    ("reward_training_tickets", "reward_international_travel", "R"),   # a bar, training-session feel
    ("reward_amex_card",        "reward_professional_training", "L"),  # leather wallet + whiskey
    ("reward_nfc_card",         "reward_nfc_card", "R"),               # brushed black card (no mark)
    ("reward_bar_kit",          "reward_bar_kit", "L"),                # leather bar-tool roll
    ("reward_car_rental",       "reward_ff_party", "R"),               # car
    ("reward_ff_party",         "reward_professional_photography", "L"),  # Christmas bar, garland, candles
    ("reward_photoshoot",       "reward_professional_photography", "R"),  # camera on tripod
]
for old in A.glob("reward_*.webp"):
    old.unlink()
import numpy as np
for out, stem, side in PANELS:
    im = Image.open(SRC / f"{stem}.jpg").convert("RGB")
    a = np.asarray(im).astype(float); w, h = im.size
    col = a.mean(axis=(0, 2))
    g = [x for x in range(int(w * .4), int(w * .6)) if col[x] > 235]
    g0, g1 = g[0], g[-1]
    box = (0, 0, g0 - 2, h) if side == "L" else (g1 + 3, 0, w, h)
    im.crop(box).save(A / f"{out}.webp", "WEBP", quality=84, method=6)
keymap = {"fireflair_hero_whiskey_bar": "hero", "fireflair_hero_whiskey_bar_900": "hero_sm", "fireflair_teams_event": "teams"}
m = {}
for f in sorted(A.glob("*.webp")):
    if f.stem.endswith("_unused"):
        continue
    m[keymap.get(f.stem, f.stem)] = "data:image/webp;base64," + base64.b64encode(f.read_bytes()).decode()
(S / "a17" / "ff_img.js").write_text("window.FF_IMG=" + json.dumps(m, separators=(",", ":")) + ";\n")
print(len(m), sorted(m))
print(sum(len(v) for v in m.values()) // 1024, "KB")
