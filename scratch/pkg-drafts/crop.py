import asyncio
from playwright.async_api import async_playwright
B="file:///home/claude/wt-pkg/scratch/pkg-drafts/index.html"
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={"width":390,"height":844}, device_scale_factor=2)
        for o,q in [(3,"&open=1"),(1,""),(2,"")]:
            await pg.goto(B+f"?opt={o}&mode=sheet{q}"); await pg.wait_for_function("document.body.dataset.fitted==='1'")
            await pg.locator('[data-pk="svc_staffing"]').screenshot(path=f"/home/claude/shots/pkg/opt{o}-card-staffing-390{'-open' if q else ''}.png")
        await b.close()
asyncio.run(main())
