# usage: sheet.py <shotdir> <outprefix> [label]
import json,sys
from PIL import Image,ImageDraw,ImageFont
D=sys.argv[1].rstrip("/")+"/"; OUT=sys.argv[2]; LABEL=sys.argv[3] if len(sys.argv)>3 else ""
inv=json.load(open(D+"inventory.json"))
F=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-SemiBold.otf",20)
FB=ImageFont.truetype("/usr/share/fonts/opentype/inter/Inter-Bold.otf",44)
SKIP=("DIV","SPAN")
def page_sheet(page):
  cols=[]
  for w in (390,1280):
    key=f"{page}-{w}"; im=Image.open(D+key+".png").convert("RGB")
    crops=[]
    for d in inv[key]["heads"]:
      if d["tag"] in SKIP and "Top staff" not in d["text"] and "Bar companies" not in d["text"]: continue
      if d["text"].startswith(("VOOSHKA","PRIVATE PARTY","ALEXANDER GAGNON")): continue
      top=max(0,d["y"]-60); bot=min(im.height,d["y"]+d["h"]+120)
      cw=min(im.width,900) if w==1280 else im.width
      c=im.crop((0,top,cw,bot)); crops.append((d,c))
    cols.append((w,crops))
  # layout: two columns, 390 strips left, 1280 strips right (scaled 0.7)
  pad=16; lw=390; rw=630
  rows=[]
  def h_of(cs,scale): return sum(int(c.height*scale)+40 for _,c in cs)
  H=max(h_of(cols[0][1],1),h_of(cols[1][1],0.7))+110
  S=Image.new("RGB",(lw+rw+pad*3,H),(232,226,214)); dr=ImageDraw.Draw(S)
  dr.text((pad,20),f"{LABEL} {page}  (left 390 / right 1280)",font=FB,fill=(92,18,32))
  for ci,(w,cs) in enumerate(cols):
    x=pad if ci==0 else lw+pad*2; y=90; sc=1 if ci==0 else 0.7
    for d,c in cs:
      dr.text((x,y),f'{d["tag"]} {d["size"]} w{d["weight"]} above {d["gapAbove"]} below {d["gapBelow"]}',font=F,fill=(60,50,40)); y+=26
      cc=c.resize((int(c.width*sc),int(c.height*sc))) if sc!=1 else c
      S.paste(cc,(x,y)); y+=cc.height+14
  S.save(OUT+f"-{page}.png"); print(OUT+f"-{page}.png",S.size)
for pg in ("home","network","bookings","profile"): page_sheet(pg)
