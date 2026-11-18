import asyncio,sys,json
sys.path.insert(0,"/home/claude/scripts")
from ffpage import setup,url_for,dev_login
from playwright.async_api import async_playwright
WT="/home/claude/wt-titles"; OUT="/home/claude/shots/titles/"
PAGES=[("home","#/ff-team",False),("home-in","#/ff-team",True),("network","#/ff-team/network",True),("bookings","#/ff-team/bookings",True),("profile","#/ff-team/profile",True)]
SIZES=[(390,844),(1280,900)]
INJECT=sys.argv[1] if len(sys.argv)>1 else None   # css file to inject (options)
TAG=sys.argv[2] if len(sys.argv)>2 else "before"
JS=r"""()=>{
const vis=e=>{const r=e.getBoundingClientRect();const s=getComputedStyle(e);return r.height>0&&r.width>0&&s.visibility!='hidden'&&s.display!='none'&&!e.closest('[aria-hidden="true"],dialog:not([open]),.ff-card-face,svg')};
const els=[...document.querySelectorAll('h1,h2,h3,.ff-h1,.ff-h2,.ff-secthead,.ff-sect-head > *:first-child')].filter(vis);
const uniq=[...new Set(els)];
const prevBottom=(e)=>{let n=e;while(n&&n!==document.body){let p=n.previousElementSibling;while(p){const r=p.getBoundingClientRect();if(r.height>0&&getComputedStyle(p).display!='none'&&p.tagName!='STYLE')return r.bottom;p=p.previousElementSibling}n=n.parentElement}return null};
const nextTop=(e)=>{let n=e;while(n&&n!==document.body){let p=n.nextElementSibling;while(p){const r=p.getBoundingClientRect();if(r.height>0&&getComputedStyle(p).display!='none'&&p.tagName!='STYLE')return r.top;p=p.nextElementSibling}n=n.parentElement}return null};
return uniq.map(e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();
 const t=e.querySelector('.t')||e;const ts=getComputedStyle(t);const af=getComputedStyle(e,'::after');const bf=getComputedStyle(e,'::before');
 const pb=prevBottom(e),nt=nextTop(e);
 return {tag:e.tagName,cls:e.className&&e.className.baseVal===undefined?e.className:'',text:e.innerText.replace(/\s+/g,' ').trim().slice(0,60),
 y:Math.round(r.top+scrollY),x:Math.round(r.left),w:Math.round(r.width),h:Math.round(r.height),
 font:s.fontFamily.split(',')[0].replace(/"/g,''),size:s.fontSize,weight:s.fontWeight,ls:s.letterSpacing,tt:s.textTransform,color:s.color,align:s.textAlign,
 mt:s.marginTop,mb:s.marginBottom,
 rule:(ts.borderBottomWidth!='0px'?('border '+ts.borderBottomWidth+' '+ts.borderBottomColor):'')+(af.content!='none'&&af.content!='normal'?(' ::after '+af.width+'x'+af.height+' '+af.backgroundColor):'')+(bf.content!='none'&&bf.content!='normal'?(' ::before '+bf.width+'x'+bf.height+' '+bf.backgroundColor):''),
 gapAbove:pb==null?null:Math.round(r.top-pb),gapBelow:nt==null?null:Math.round(nt-r.bottom)}})}""" 
async def main():
  res={}
  async with async_playwright() as p:
    b=await p.chromium.launch()
    for name,route,signed in PAGES:
      for w,h in SIZES:
        pg=await b.new_page(viewport={"width":w,"height":h}); errs=[]
        pg.on("pageerror",lambda e:errs.append(str(e)[:200]))
        await setup(pg); await pg.goto(url_for(WT)+"#/ff-team"); await pg.wait_for_timeout(2500)
        if signed: await dev_login(pg)
        await pg.goto(url_for(WT)+route); await pg.wait_for_timeout(2000)
        await pg.add_style_tag(path="/home/claude/scripts/titles/fonts.css")
        if INJECT: await pg.add_style_tag(path=INJECT)
        await pg.evaluate("document.fonts.ready"); await pg.wait_for_timeout(400)
        H=await pg.evaluate("document.documentElement.scrollHeight")
        for y in range(0,H,700): await pg.evaluate(f"scrollTo(0,{y})"); await pg.wait_for_timeout(60)
        await pg.evaluate("scrollTo(0,0)"); await pg.wait_for_timeout(600)
        if INJECT: print(tag_pre:=name, w, "tagged", await pg.evaluate(open("/home/claude/scripts/titles/prep.js").read())); await pg.wait_for_timeout(300)
        tag=f"{name}-{w}"
        await pg.screenshot(path=OUT+f"{TAG}/{tag}.png",full_page=True)
        info=await pg.evaluate(JS)
        ov=await pg.evaluate("[document.documentElement.scrollWidth,innerWidth]")
        res[tag]={"heads":info,"errs":errs,"overflow":ov}
        await pg.close()
    await b.close()
  json.dump(res,open(OUT+f"{TAG}/inventory.json","w"),indent=1,ensure_ascii=False)
  for k,v in res.items():
    print("==",k,"overflow",v["overflow"],"errs",len(v["errs"]),v["errs"][:2])
    for d in v["heads"]: print(f'  {d["tag"]:3} y{d["y"]:5} {d["text"][:34]:34} | {d["font"][:6]} {d["size"]} w{d["weight"]} ls{d["ls"]} {d["tt"][:5]} {d["color"]} {d["align"][:5]} | mt{d["mt"]} mb{d["mb"]} above{d["gapAbove"]} below{d["gapBelow"]} | {d["rule"]} | {d["cls"][:40]}')
asyncio.run(main())
