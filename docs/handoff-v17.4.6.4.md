# v17.4.6.4 — Universal card sharing and Calendly support (handoff)

## Reused, not rebuilt
- `Sheet` (shared modal), `ShareCardSheet` (the existing Share control; "Send my card" by phone is unchanged), `PlayerCard`, `Card17` (studio cards), `EventCard11`, `ShiftMini11`, `VipCard21`, `CompanyCardFace`, `CARD_DOMAIN`, the `PATH17` address structure, `PkgRoute18`-style hash routing, `BusinessSupport19`, `FF_SITE_BRAND`.
- Book, Review, Join and every referral or booking mechanism are untouched.

## Files
- New: `src/utils/card-export17.js` (export utility), `src/components/shared/card-share17.jsx` (`CardShareSheet17`, `CardShareBtn17`), `src/components/home/support-book20.jsx` (support page and route), `src/content/data/support.json` (the one place the Calendly address is set).
- Changed: `profile-from-text.jsx` (Share sheet), `card-studio.jsx` (`CardPop17`), `booking-flow.jsx` (Event and Shift cards), `vip-site.jsx` (VIP card), `network-directory.jsx` (Company card), `discover-and-support.jsx` (button), `exports.js`, `App.jsx`, `seo.js`, `icons.js`, `base.css`, `v11.css`, `manifest.json`.

## Card sharing
- One utility, `cardToPng17(node, { url })`, renders the card as it is on the page (the real component) to a PNG in the browser. No backend. The renderer (html-to-image) loads from cdnjs, then jsDelivr, only when a card is first shared.
- Size: 5:7 cards 1500 x 2100. Other shapes keep their ratio (landscape 2100 wide, otherwise 1500 wide).
- The FireFlair address is on every image: cards that show their own address are used as is; others get a slim address band under the card (nothing on the card is covered).
- Pictures on other sites are fetched first; if one cannot be read, the export stops with a clear message (no incomplete image). A blank render is refused too.
- Menu: Share (device share sheet with image and link), WhatsApp (share sheet where files are supported; otherwise the image downloads and WhatsApp opens with the link), Download PNG, Copy Link. The image is prepared when the menu opens so the Share tap is a direct tap (iPhone). The menu never says the image was saved to Photos.
- Instagram uses the same image (content already sits inside the card's own margins).
- No private contact details are on any export; no QR, NFC, wallet, vCard or analytics.

## Address status
| Card | Address on the image | Status |
|---|---|---|
| Profile Card | `ffparty.uk/<tag>` | existing generation |
| Company Card (claimed) | `ffparty.uk/<slug>` | existing generation |
| VIP Card | `ffvip.uk/<slug>` | existing generation |
| Signature / Classic Cocktail | `ffparty.uk/<tag>/cocktails/<slug>` | planned route (Studio structure) |
| Service Card | `ffparty.uk/<tag>/services/<slug>` | planned route |
| Story / Post Card | `ffparty.uk/<tag>/stories/<slug>` | planned route |
| Event Card | `ffparty.uk` | no public event page yet; site address |
| Shift Card | `ffstaff.uk` | no public shift page yet; site address |
Production confirms each planned route with Core.

## Calendly
- "Book a 15-minute Call" in Business & Support on all four sites opens `#/support/book-a-call` (also read from the path `/support/book-a-call` when the host serves the app there). Branded per site, short explanation, embed plus an "Open in a new tab" link, "Back to support options".
- **Owner configuration needed:** set `calendlyUrl` in `src/content/data/support.json` (an https://calendly.com/... link). While it is empty the page shows "Call booking isn't connected yet" and is `noindex`. Nothing is presented as live.
- Production: a server rewrite so `/support/book-a-call` serves the app directly on each domain.

## Not possible in the prototype
Server-side image rendering for link previews (Open Graph), real public routes for cocktail/service/story/event/shift cards, and confirming that WhatsApp attaches the image (the browser decides; the link always goes as text).

## Checked
`npm run check`, `npm run build`; headless Chrome (desktop and 390 mobile): Profile Card export 1500 x 2100 (opened and viewed), Event, Company, VIP and cocktail frame exports at their own ratios, long text, a local image, a blocked remote image (stops with a message), download, WhatsApp link, device share with a mocked share API, share fallback to download, Calendly page direct route and via the button on all four sites with a test address (restored to empty), not-configured state, back link.
Not tested: real iPhone Safari and Android Chrome share sheets, real Google Fonts (offline test), a real Calendly address.
