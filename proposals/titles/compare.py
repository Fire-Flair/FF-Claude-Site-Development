import json
from PIL import Image,ImageDraw,ImageFont
R="/home/claude/shots/titles/"
F=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf",22)
FB=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf",120)
FT=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf",40)
NAMES={"before":"Now","opt1":"1  Eyebrow","opt2":"2  Gold mark","opt3":"3  Monogram + line"}
inv={k:json.load(open(R+k+"/inventory.json")) for k in NAMES}
def titles(key):  # tagged titles from opt1, texts used to find same in other runs
  return [d for d in inv["opt1"][key]["heads"] if "tl-" in (d["cls"] or "")]
def find(run,key,d):
  t=d["text"]
  for h in inv[run][key]["heads"]:
    ht=h["text"]
    if ht==t or (t.startswith("What is FF Team") and ht.startswith("Discover FireFlair")) or (h["tag"]==d["tag"] and ht.lower()==t.lower()): return h
def crops(run,key,w,maxn=None,before=50,after=150):
  im=Image.open(R+f"{run}/{key}.png").convert("RGB"); out=[]
  for d in titles(key)[:maxn]:
    h=find(run,key,d)
    if not h: continue
    cw=im.width if w==390 else 960
    c=im.crop((0,max(0,h["y"]-before),cw,min(im.height,h["y"]+h["h"]+after)))
    if w!=390: c=c.resize((int(c.width*0.5),int(c.height*0.5)))
    out.append(c)
  return out
def column(run,key,w,**k):
  cs=crops(run,key,w,**k); H=sum(c.height+12 for c in cs); W=max(c.width for c in cs)
  col=Image.new("RGB",(W,H),(255,255,255)); y=0
  for c in cs: col.paste(c,(0,y)); y+=c.height+12
  return col
def page_sheet(page):
  for w in (390,1280):
    key=f"{page}-{w}"; cols=[(r,column(r,key,w)) for r in NAMES]
    gap=28; W=sum(c.width for _,c in cols)+gap*(len(cols)+1); H=max(c.height for _,c in cols)+150
    S=Image.new("RGB",(W,H),(226,219,205)); dr=ImageDraw.Draw(S); x=gap
    dr.text((gap,14),f"{page.upper()} · {w}px",font=FT,fill=(92,18,32))
    for r,c in cols:
      dr.text((x,80),NAMES[r],font=F,fill=(11,11,12) if r=="before" else (92,18,32)); S.paste(c,(x,120)); x+=c.width+gap
    S.save(R+f"page-{page}-{w}.png"); print(R+f"page-{page}-{w}.png",S.size)
for p in ("home","network","bookings","profile"): page_sheet(p)
# contact sheet: three options, each a stack of key titles at 390
def option_stack(run):
  parts=[crops(run,"network-390",390,1,before=40,after=110)[0],
         *crops(run,"bookings-390",390,2,before=30,after=60)[:2],
         crops(run,"home-390",390,1,before=40,after=110)[0],
         crops(run,"profile-390",390,None,before=30,after=70)[-1],
         crops(run,"network-1280",1280,2,before=40,after=90)[1]]
  H=sum(p.height+10 for p in parts); W=max(p.width for p in parts)
  col=Image.new("RGB",(W,H),(255,255,255)); y=0
  for p in parts: col.paste(p,(0,y)); y+=p.height+10
  return col
cols=[(r,option_stack(r)) for r in ("opt1","opt2","opt3")]
gap=40; W=sum(c.width for _,c in cols)+gap*4; H=max(c.height for _,c in cols)+230
S=Image.new("RGB",(W,H),(226,219,205)); dr=ImageDraw.Draw(S); x=gap
dr.text((gap,16),"Section titles: three options (390 phone; last strip 1280)",font=FT,fill=(11,11,12))
for r,c in cols:
  n=r[-1]; dr.text((x,62),n,font=FB,fill=(92,18,32)); dr.text((x+90,120),NAMES[r][3:],font=FT,fill=(92,18,32))
  S.paste(c,(x,210)); x+=c.width+gap
S.save(R+"options.png"); print(R+"options.png",S.size)
