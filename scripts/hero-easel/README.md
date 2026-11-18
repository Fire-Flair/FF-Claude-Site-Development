# Hero easel image (v17.24)

How the home hero photo was made from photo-library rb04 (IMG_8273). Kept so the photo can be rebuilt or re-cropped.

- `base.py`: finds the display board (four corner points, source pixels), paints the printed menu off it, removes the menu's mirror image from the bar top, and writes `geom.json`.
- `geom.json`: the crop, plus the card's corner points as fractions of the hero image (`card`) and its mirror image (`refl`). These are the numbers in `HERO_EASEL24` and `HERO_EASEL24_REFL` in `src/components/shared/hero-easel.jsx`.
- `grade.py`: crops to 1800×850 and relights: the room's red wash becomes violet, one warm lamp pools on the easel and the drinks, blacks stay black.

The scripts read the original from a local path; point them at `photo-library/originals/rb04-vooshka-rb-wedding.webp`.
If the hero photo changes, measure the four board corners again and update both constants.

## home2 (18 Nov): natural photo

Alex asked for no lighting on the hero. `natural.py` replaces `grade.py`: the same crop and card geometry, with only an
even colour balance (no violet lamps, golden spotlight, beam or vignette). Saved as 1800×850 and 900×425 WebP
(`hero` / `hero_sm` in `src/shell/ff-img.json`).
