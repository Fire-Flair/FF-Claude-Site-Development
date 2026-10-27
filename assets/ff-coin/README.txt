FireFlair FF Coin Logo Assets

Included:
- *-master.png: lossless PNG conversion of the uploaded JPEG's decoded pixels; source dimensions preserved.
- *.webp: source-resolution WebP for ordinary web placements.
- *-2x.webp: 2x upscaled WebP for high-density displays. This uses high-quality resampling only; it does not invent detail or redraw the official logo.

Important:
- These assets preserve each uploaded variant and its existing background. No background removal, recolouring, logo reconstruction, or AI regeneration was performed.
- Upscaling cannot recover detail absent from the source image. For maximum sharpness, avoid rendering beyond the 2x asset's dimensions and use the original proportions.
- If the website needs a transparent background, supply an original transparent/vector source if available; automatic background removal could alter fine coin edges and reflections.

React example:
  <img
    src="/assets/ff-coin-gold-dark-2x.webp"
    alt="FireFlair coin"
    width={600}
    height={600}
    style={{ width: "100%", maxWidth: 600, height: "auto", objectFit: "contain" }}
  />

For smaller UI icons, use the source-resolution .webp and size it to the actual display dimensions.
