from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
big=ImageFont.truetype(F,40); mid=ImageFont.truetype(F,17); sm=ImageFont.truetype(R,20)
OPT={1:("Option 1 (recommended): one home for bookings, black and gold","The separate box is gone. Open Your bookings and you get the title, the four-symbol flow, the four steps, and Get paid on clear terms."),
     2:("Option 2: the same merge, ivory and gold","As option 1, with the flow on a light ivory box with a gold edge. No dark block at all."),
     3:("Option 3: nothing moves, colour only","The box stays under the four pillars, in black and gold instead of burgundy. Your bookings pillar unchanged.")}
def build(o):
    if o in(1,2): items=[("Phone: closed",f"o{o}-a-390.png",1),("Phone: pillar open",f"o{o}-b-390.png",1),("Phone: steps open",f"o{o}-c-390.png",1),("Phone: Get paid open",f"o{o}-d-390.png",1),("Desktop: Your bookings open",f"o{o}-b-1180.png",.75),("Desktop: steps open",f"o{o}-c-1180.png",.75)]
    else: items=[("Phone: closed",f"o{o}-a-390.png",1),("Phone: open",f"o{o}-b-390.png",1),("Desktop: closed",f"o{o}-a-1180.png",.75),("Desktop: open",f"o{o}-b-1180.png",.75)]
    ims=[]
    for lab,f,sc in items:
        im=Image.open(f).convert('RGB'); im=im.resize((int(im.width*sc),int(im.height*sc)),Image.LANCZOS); ims.append((lab,im))
    gap=36; top=150; W=gap+sum(im.width+gap for _,im in ims); H=top+50+max(im.height for _,im in ims)+gap
    c=Image.new('RGB',(W,H),'#FFFFFF'); d=ImageDraw.Draw(c)
    d.rectangle((0,0,W,110),fill='#16130F'); d.text((gap,18),OPT[o][0],font=big,fill='#EDD58F'); d.text((gap,72),OPT[o][1],font=sm,fill='#FFFCF4')
    x=gap
    for lab,im in ims:
        d.text((x,top),f"Option {o} · {lab}",font=mid,fill='#16130F'); c.paste(im,(x,top+44)); d.rectangle((x-1,top+43,x+im.width,top+44+im.height),outline='#B08D2A'); x+=im.width+gap
    c.save(f'/home/claude/aragorn-option-{o}.png'); print(o,c.size)
for o in(1,2,3): build(o)
