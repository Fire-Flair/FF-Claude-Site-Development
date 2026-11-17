import asyncio
from playwright.async_api import async_playwright
BASE="file:///home/claude/wt-pkg/scratch/pkg-drafts/index.html"; OUT="/home/claude/shots/pkg/"
CHECK="""() => { const bad=[]; document.querySelectorAll('.k *').forEach(e=>{ const cs=getComputedStyle(e); if(cs.display==='none'||e.closest('details:not([open]) .dt')) return;
  if(e.children.length===0 && e.textContent.trim() && e.scrollWidth>e.clientWidth+1 && cs.overflow!=='visible'===false && e.clientWidth>0) bad.push(e.className+':'+e.textContent.slice(0,40)); });
  const fs=[...document.querySelectorAll('.fit')].filter(e=>e.style.fontSize).map(e=>e.textContent.slice(0,30)+'→'+e.style.fontSize);
  return {overflowX: document.documentElement.scrollWidth>innerWidth, bad, shrunk:fs}; }"""
JOBS=[]
for o in (1,2,3):
    for w in (390,1280):
        JOBS.append((f"opt{o}-sheet-{w}.png", f"?opt={o}&mode=sheet&sel=svc_mixology", w, True))
    JOBS.append((f"opt{o}-rail-390.png", f"?opt={o}&mode=rail&sel=svc_bartending", 390, True))
JOBS += [("opt3-sheet-open-390.png","?opt=3&mode=sheet&open=1",390,True),("opt3-sheet-open-1280.png","?opt=3&mode=sheet&open=1",1280,True),
         ("options.png","?mode=contact",1600,True)]
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        for name,qs,w,full in JOBS:
            pg=await b.new_page(viewport={"width":w,"height":844 if w==390 else 900}); errs=[]
            pg.on("pageerror",lambda e: errs.append(str(e)))
            await pg.goto(BASE+qs); await pg.wait_for_function("document.body.dataset.fitted==='1'"); await pg.wait_for_timeout(300)
            r=await pg.evaluate(CHECK)
            await pg.screenshot(path=OUT+name, full_page=full)
            print(name, "errs",errs, "overflowX",r["overflowX"], "bad",r["bad"][:5], "shrunk",r["shrunk"][:6])
            await pg.close()
        await b.close()
asyncio.run(main())
