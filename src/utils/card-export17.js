/* src/utils/card-export17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   CARD EXPORT (v17.4.6.4) — one browser-side utility that turns a card, as rendered on the page, into a PNG.

   It uses the real card component's DOM (nothing is redrawn from a separate template). The browser's own layout
   engine draws it through an SVG foreignObject (html-to-image, loaded from cdnjs, then jsDelivr, only when someone
   first exports; it is not part of the page load). Container-relative sizes (the Profile Card) and fixed sizes both
   scale because the whole card is scaled as one piece.

   Size:  5:7 portrait cards export at 1500 x 2100. Other shapes keep their own aspect ratio: portrait and square
          at 1500 wide, landscape at 2100 wide. Never cropped to portrait. Capped at about 3.3 million pixels
          (iOS Safari's canvas limit is far above that).
   Link:  the card's FireFlair address must be visible on the image. If the card already shows it, nothing is
          added; otherwise a slim address band is added under the card (nothing on the card is covered).
          The PNG is not clickable; the share message carries the real link as text.
   Safe:  pictures on other origins are fetched first; if one cannot be read the export stops with a clear error
          (CardExportError) instead of producing a card with a hole in it. A blank result is also refused.
   No backend, no QR code, no wallet, no analytics.
   ========================================================================== */
const CX17 = {
  libUrls: ["https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js", "https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.js"],
  portrait: [1500, 2100], wide: 2100, maxPixels: 3300000, ratio: 5 / 7,
};


class CardExportError extends Error {
  constructor(code, message) { super(message); this.name = "CardExportError"; this.code = code; }
}


let CX17_LIB = null;


/* Loads the renderer once. Tries each address in turn. */
function cx17Lib() {
  if (window.htmlToImage) return Promise.resolve(window.htmlToImage);
  if (CX17_LIB) return CX17_LIB;
  CX17_LIB = new Promise((resolve, reject) => {
    let i = 0;
    const next = () => {
      if (window.htmlToImage) { resolve(window.htmlToImage); return; }
      if (i >= CX17.libUrls.length) { CX17_LIB = null; reject(new CardExportError("lib", "The image maker couldn't load. Check your connection and try again.")); return; }
      const s = document.createElement("script");
      s.src = CX17.libUrls[i++]; s.async = true;
      s.onload = () => (window.htmlToImage ? resolve(window.htmlToImage) : next());
      s.onerror = () => { s.remove(); next(); };
      document.head.appendChild(s);
    };
    next();
  });
  return CX17_LIB;
}


/* Output size for a card of this shape. */
function cx17Size(w, h) {
  const a = w / h;
  let W, H;
  if (Math.abs(a - CX17.ratio) < 0.02) { W = CX17.portrait[0]; H = CX17.portrait[1]; }
  else if (a > 1.05) { W = CX17.wide; H = Math.round(W / a); }
  else { W = CX17.portrait[0]; H = Math.round(W / a); }
  const px = W * H;
  if (px > CX17.maxPixels) { const k = Math.sqrt(CX17.maxPixels / px); W = Math.floor(W * k); H = Math.floor(H * k); }
  return [W, H];
}


/* Every picture the card uses that lives on another origin must be readable, or the export stops. */
async function cx17CheckPictures(node) {
  const urls = new Set();
  const take = (u) => { if (u && /^https?:/i.test(u) && new URL(u, location.href).origin !== location.origin) urls.add(u); };
  node.querySelectorAll("img").forEach(im => take(im.currentSrc || im.src));
  [node, ...node.querySelectorAll("*")].forEach(el => {
    const bg = getComputedStyle(el).backgroundImage || "";
    (bg.match(/url\((["']?)(https?:[^)"']+)\1\)/g) || []).forEach(m => take(m.replace(/^url\((["']?)/, "").replace(/(["']?)\)$/, "")));
  });
  for (const u of urls) {
    try { const r = await fetch(u, { mode: "cors", cache: "force-cache" }); if (!r.ok) throw new Error("status " + r.status); await r.blob(); }
    catch (e) { throw new CardExportError("image", "A picture on this card can't be included (it blocks other sites from using it). Replace it with an uploaded photo and try again."); }
  }
  const pending = [...node.querySelectorAll("img")].filter(im => !im.complete);
  await Promise.all(pending.map(im => new Promise(res => { im.addEventListener("load", res, { once: true }); im.addEventListener("error", res, { once: true }); })));
  if ([...node.querySelectorAll("img")].some(im => im.complete && im.naturalWidth === 0 && im.getAttribute("src"))) throw new CardExportError("image", "A picture on this card didn't load. Try again in a moment.");
}


const cx17Img = (blob) => new Promise((res, rej) => {
  const u = URL.createObjectURL(blob), im = new Image();
  im.onload = () => { URL.revokeObjectURL(u); res(im); };
  im.onerror = () => { URL.revokeObjectURL(u); rej(new CardExportError("render", "The card couldn't be turned into an image.")); };
  im.src = u;
});


/* The address band for cards that don't carry their own address: a strip under the card, so nothing on the card is covered.
   Returns a new, taller canvas. */
function cx17Band(cv, url) {
  const W = cv.width, H = cv.height, text = String(url || "").replace(/^https?:\/\//, "");
  const fs = Math.round(W * 0.034), bh = Math.round(fs * 3.1);
  const out = document.createElement("canvas"); out.width = W; out.height = H + bh;
  const ctx = out.getContext("2d");
  ctx.drawImage(cv, 0, 0);
  ctx.fillStyle = "#0B0A09"; ctx.fillRect(0, H, W, bh);
  ctx.fillStyle = "#C9A24B"; ctx.fillRect(0, H, W, Math.max(2, Math.round(W * 0.002)));
  ctx.font = `700 ${fs}px "Inter", system-ui, -apple-system, "Segoe UI", sans-serif`;
  ctx.fillStyle = "#EAD79C"; ctx.textBaseline = "middle"; ctx.textAlign = "center";
  ctx.fillText(text, W / 2, H + bh / 2, W * 0.9);
  return out;
}


/* Renders `node` to a PNG Blob. opts: { url (the card's FireFlair address), name }.
   Resolves { blob, width, height, plate (true when the address band was added) }. */
async function cardToPng17(node, opts) {
  opts = opts || {};
  if (!node) throw new CardExportError("node", "There is no card to export.");
  const rect = node.getBoundingClientRect();
  if (!rect.width || !rect.height) throw new CardExportError("node", "The card isn't showing, so it can't be exported.");
  const [W, H] = cx17Size(rect.width, rect.height);
  const k = W / rect.width;
  const lib = await cx17Lib();
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) { /* fonts API missing: carry on */ }
  await cx17CheckPictures(node);
  const render = () => lib.toBlob(node, {
    width: W, height: H, pixelRatio: 1, cacheBust: false,
    style: { transform: `scale(${k})`, transformOrigin: "top left", width: rect.width + "px", height: rect.height + "px", margin: "0", maxWidth: "none" },
    filter: (n) => !(n.nodeType === 1 && n.hasAttribute && n.hasAttribute("data-cx-skip")),
  });
  /* Safari draws pictures on the second pass; the first result is thrown away. One pass is enough elsewhere. */
  const safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  let blob;
  try { if (safari) await render(); blob = await render(); }
  catch (e) { throw new CardExportError("render", "The card couldn't be turned into an image. Try again."); }
  if (!blob) throw new CardExportError("render", "The card couldn't be turned into an image. Try again.");
  const img = await cx17Img(blob);
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d");
  ctx.drawImage(img, 0, 0, W, H);
  /* A blank render (all one transparent or single colour) is refused. */
  const probe = ctx.getImageData(0, 0, W, H, { colorSpace: "srgb" }).data;
  let seen = null, varied = false;
  for (let i = 0; i < probe.length && !varied; i += 4 * 997) { const c = probe[i] + "," + probe[i + 1] + "," + probe[i + 2] + "," + probe[i + 3]; if (seen === null) seen = c; else if (c !== seen) varied = true; }
  if (!varied) throw new CardExportError("render", "The card came out blank. Try again.");
  const wantUrl = String(opts.url || "").replace(/^https?:\/\//, "");
  const shows = !wantUrl || (node.innerText || "").toLowerCase().includes(wantUrl.toLowerCase());
  const fin = shows ? cv : cx17Band(cv, wantUrl);
  const out = await new Promise((res) => fin.toBlob(res, "image/png"));
  if (!out) throw new CardExportError("render", "The image couldn't be saved. Try again.");
  return { blob: out, width: fin.width, height: fin.height, plate: !shows };
}


/* ---- Sharing -------------------------------------------------------------------------------------------- */
const cx17File = (blob, name) => new File([blob], (name || "fireflair-card") + ".png", { type: "image/png" });


/* Can this browser hand a PNG to the share sheet? Checked without rendering anything. */
function cx17CanShareFiles() {
  try { return !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" })] })); } catch (e) { return false; }
}


/* The device's share sheet with the image and the link as text. Resolves "shared", "cancelled" or throws. */
async function cx17Share(file, title, url) {
  const text = `${title} ${url}`.trim();
  try { await navigator.share({ files: [file], title, text }); return "shared"; }
  catch (e) { if (e && e.name === "AbortError") return "cancelled"; throw e; }
}


/* The share sheet showed up without error, but the person may not have saved anything: only "shared" is reported. */
function cx17Download(blob, name) {
  const a = document.createElement("a"), u = URL.createObjectURL(blob);
  a.href = u; a.download = (name || "fireflair-card") + ".png"; a.rel = "noopener"; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(u); a.remove(); }, 4000);
}


const cx17WaLink = (title, url) => "https://wa.me/?text=" + encodeURIComponent(`${title} ${url}`.trim());


async function cx17Copy(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
  try { const t = document.createElement("textarea"); t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select(); const ok = document.execCommand("copy"); t.remove(); return !!ok; } catch (e) { return false; }
}


/* The address each kind of card carries, in one place. "live" says whether the route exists yet.
     profile            existing: the address the Profile Card already shows
     cocktail/service/story  planned structure already in the Studio: <profile address>/<kind>/<slug>
     company            existing: the address the Company Card already shows
     vip                existing: the FF VIP address used by the VIP share text
     event/shift        no public page exists: the site's address (the booking journey lives there)
   Production confirms each route with Core. */
const CX17_KINDS = {
  profile: { live: true }, company: { live: true }, vip: { live: true },
  cocktail: { live: false, note: "planned: /<tag>/cocktails/<slug>" }, service: { live: false, note: "planned: /<tag>/services/<slug>" }, story: { live: false, note: "planned: /<tag>/stories/<slug>" },
  event: { live: false, note: "no public event page: site address used" }, shift: { live: false, note: "no public shift page: site address used" },
};


const cx17Slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "card";
