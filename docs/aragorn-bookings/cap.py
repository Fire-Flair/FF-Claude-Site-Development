import asyncio,sys,json
exec(open('/home/claude/shot.py').read().split('url=sys.argv')[0])
# usage: cap.py opt width  -> o{opt}-{name}-{w}.png
opt,w=int(sys.argv[1]),int(sys.argv[2])
HIDE="document.querySelectorAll('nav,header,[class*=tabbar],[class*=bottom-nav]').forEach(e=>{if(getComputedStyle(e).position==='fixed'||getComputedStyle(e).position==='sticky')e.style.display='none'});[...document.querySelectorAll('body *')].forEach(e=>{const p=getComputedStyle(e).position;if(p==='fixed')e.style.display='none'})"
PILL="[...document.querySelectorAll('#ff-discover .ff-dx-tile')].find(b=>/Your bookings/.test(b.innerText)).click()"
async def region(pg,name,sel_from,sel_to=None,pad=14):
    box=await pg.evaluate("""([a,b])=>{const A=document.querySelector(a).getBoundingClientRect(),B=(b?document.querySelector(b):document.querySelector(a)).getBoundingClientRect();return [A.top+scrollY,B.bottom+scrollY]}""",[sel_from,sel_to])
    y0=max(0,box[0]-pad); h=box[1]-box[0]+2*pad
    await pg.screenshot(path=f'o{opt}-{name}-{w}.png',full_page=True,clip={'x':0,'y':y0,'width':w,'height':h})
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(executable_path='/usr/bin/google-chrome',args=['--no-sandbox'])
        pg=await b.new_page(viewport={'width':w,'height':1180 if w>600 else 844})
        await pg.add_init_script(f'window.FF_AR_OPT={opt}')
        await pg.route('**/*',route)
        pg.on('pageerror',lambda e:print('PAGEERR',e))
        await pg.goto('file:///home/claude/aragorn/build/ff-team-v1.1.html#/ff-team'); await pg.wait_for_timeout(5000)
        await pg.evaluate(HIDE)
        merged=opt in(1,2)
        end='#ff-how' if not merged else '#ff-discover'
        # A: home as it lands (pillars closed)
        await region(pg,'a','#ff-discover',end)
        if merged:
            await pg.evaluate(PILL); await pg.wait_for_timeout(2500)
            await region(pg,'b','#ff-discover')
            await pg.evaluate("document.querySelector('.ff-hbc-btn').click()"); await pg.wait_for_timeout(1500)
            await region(pg,'c','#ff-dx-panel')
            await pg.evaluate("document.querySelector('.ff-hbc-btn').click()"); await pg.wait_for_timeout(800)
            await pg.evaluate("document.querySelector('.ff-st21 .hh button').click()"); await pg.wait_for_timeout(1500)
            await region(pg,'d','#ff-dx-panel')
        else:
            await pg.evaluate("document.querySelector('.ff-hbc-btn').click()"); await pg.wait_for_timeout(1500)
            await region(pg,'b','#ff-how')
        # checks: split words / overflow
        print(opt,w,await pg.evaluate("({ov:document.documentElement.scrollWidth>innerWidth, how:!!document.querySelector('#ff-how')})"))
        await b.close()
asyncio.run(main())
