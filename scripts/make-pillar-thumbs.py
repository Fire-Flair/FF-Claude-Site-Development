#!/usr/bin/env python3
"""Makes the 1-2-3 card pictures of the home pillars (v17.10).

For every section of a site's pillars it screenshots the section's own visual in the built page, composes it, contained, on a plain
640x400 background, saves it as webp in src/assets/img/ and registers it in src/content/data/photos17.json as j17_<card_img>.

  npm run build && python3 scripts/make-pillar-thumbs.py party    # thp_* (FF Party)
  npm run build && python3 scripts/make-pillar-thumbs.py staff    # ths_* (FF Staff)

Needs Playwright with Chrome. CHROME / LIBS env vars point to the browser and to local copies of react, react-dom, lucide and leaflet
(the page loads them from a CDN; offline runs route the requests to the local copies). The FF Team pictures (th_*) were made the same way."""
import asyncio, io, json, hashlib, os, sys
from playwright.async_api import async_playwright
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = sys.argv[1] if len(sys.argv) > 1 else "party"
CHROME = os.environ.get("CHROME", "/usr/bin/google-chrome")
L = os.environ.get("LIBS", "/tmp/libs") + "/node_modules/"
LOCAL = {"react.production": L + "react/umd/react.production.min.js", "react-dom.production": L + "react-dom/umd/react-dom.production.min.js",
         "lucide.min": L + "lucide/dist/umd/lucide.min.js", "leaflet.js": L + "leaflet/dist/leaflet.js", "leaflet.css": L + "leaflet/dist/leaflet.css"}
BG = "#F3EAD5"
# visual key -> (selectors inside the section, crop height in css px or None)
SPEC = {
 "party-pkgs": (['.pv-tile:nth-child(1)', '.pv-tile:nth-child(2)'], None),
 "party-guarantee": (['.pv-gr .gb'], None),
 "party-people": (['.pv-row3'], None),
 "party-featured": (['.pv-tile:nth-child(1)', '.pv-tile:nth-child(2)'], None),
 "party-review": (['.ff-rvcard'], None),
 "party-companies": (['.pv-tile:nth-child(1)'], None),
 "party-event": (['.pv-face'], None),
 "party-occasions": (['.pv-occ'], None),
 "party-steps": (['.pv-steps'], None),
 "party-prefs": (['.pv-ticks'], None),
 "party-favourites": (['.pv-people'], None),
 "party-again": (['.pv-again'], None),
 "staff-featured": (['.pv-tile:nth-child(1)', '.pv-tile:nth-child(2)'], None),
 "staff-teams": (['.pv-tms'], None),
 "staff-review": (['.ff-rvcard'], None),
 "staff-event": (['.pv-face'], None),
 "staff-steps": (['.pv-steps'], None),
 "staff-modern": (['.pv-mod'], None),
 "staff-follow": (['.pv-flc:nth-child(1)', '.pv-flc:nth-child(2)', '.pv-flc:nth-child(3)'], None),
 "staff-party": (['.pv-mod'], None),
 "staff-services": (['.pv-sq'], None),
 "staff-company": (['.pv-coface'], None),
 "staff-profile": (['.pv-ticks'], None),
 "staff-find": (['.pv-row3'], None),
}

async def route(r):
    u = r.request.url
    for k, v in LOCAL.items():
        if k in u and ("cdnjs" in u or "jsdelivr" in u or "unpkg" in u):
            return await r.fulfill(path=v, content_type="text/css" if v.endswith("css") else "application/javascript")
    if u.startswith("file:"):
        return await r.continue_()
    return await r.abort()

async def main():
    data = json.load(open(f"{ROOT}/src/content/homepage/{SITE}-pillars.json"))
    photos_path = f"{ROOT}/src/content/data/photos17.json"
    photos = json.load(open(photos_path))
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path=CHROME, args=["--no-sandbox"])
        pg = await b.new_page(viewport={"width": 820, "height": 1100}, device_scale_factor=2)
        await pg.route("**/*", route)
        await pg.goto(f"file://{ROOT}/build/fireflair-v17.4.html#/ff-{SITE}")
        await pg.wait_for_timeout(3500)
        # horizontal scrollers are laid out flat so every tile is fully in view
        await pg.add_style_tag(content=".ff .pv-scroll{flex-wrap:wrap!important;overflow:visible!important}")
        for n, pl in enumerate(data["pillars"]):
            await pg.locator(".ff-dx-tile").nth(n).click()
            await pg.wait_for_timeout(1500)
            for s in pl["sections"]:
                sels, ct = SPEC[s["visual"]]
                ims = []
                for sel in sels:
                    el = pg.locator(f"#{s['id']} {sel}").first
                    await el.evaluate('e=>e.scrollIntoView({block:"center"})')
                    await pg.wait_for_timeout(350)
                    im = Image.open(io.BytesIO(await el.screenshot())).convert("RGB")
                    if ct:
                        im = im.crop((0, 0, im.size[0], min(im.size[1], ct * 2)))
                    ims.append(im)
                gap = 24
                w = sum(x.size[0] for x in ims) + gap * (len(ims) - 1)
                h = max(x.size[1] for x in ims)
                row = Image.new("RGB", (w, h), BG)
                x = 0
                for im in ims:
                    row.paste(im, (x, (h - im.size[1]) // 2)); x += im.size[0] + gap
                W, H, pad = 640, 400, 28
                sc = min((W - 2 * pad) / w, (H - 2 * pad) / h)
                nw, nh = int(w * sc), int(h * sc)
                row = row.resize((nw, nh), Image.LANCZOS)
                c = Image.new("RGB", (W, H), BG)
                c.paste(row, ((W - nw) // 2, (H - nh) // 2))
                buf = io.BytesIO(); c.save(buf, "WEBP", quality=86, method=6); bb = buf.getvalue()
                hx = hashlib.sha256(bb).hexdigest()[:16]
                open(f"{ROOT}/src/assets/img/{hx}.webp", "wb").write(bb)
                photos["j17_" + s["card_img"]] = f"ffasset:img/{hx}.webp"
                print(s["card_img"], hx, len(bb))
            await pg.locator(".ff-dx-tile").nth(n).click()
            await pg.wait_for_timeout(600)
        await b.close()
    json.dump(photos, open(photos_path, "w"), indent=1, ensure_ascii=False)

asyncio.run(main())
