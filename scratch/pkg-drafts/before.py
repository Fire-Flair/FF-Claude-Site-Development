import asyncio, sys
sys.path.insert(0,"/home/claude/scripts")
from ffpage import setup, url_for, dev_login
from playwright.async_api import async_playwright
WT="/home/claude/wt-pkg"; OUT="/home/claude/shots/pkg/"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for w,h in [(390,844),(1280,900)]:
            pg=await b.new_page(viewport={"width":w,"height":h}); errs=[]
            pg.on("pageerror",lambda e: errs.append(str(e)))
            await setup(pg); await pg.goto(url_for(WT)+"#/ff-team/bookings"); await pg.wait_for_timeout(2500)
            await dev_login(pg); await pg.goto(url_for(WT)+"#/ff-team/bookings"); await pg.wait_for_timeout(1500)
            el=pg.locator("#ff-bk-party"); await el.scroll_into_view_if_needed(); await pg.wait_for_timeout(400)
            await el.screenshot(path=OUT+f"before-{w}.png")
            print(w,"errors",errs[:3])
        await b.close()
asyncio.run(main())
