import cv2, numpy as np, json, sys
G=json.load(open('geom.json')); C=G['crop']
img=cv2.imread('clean_full.png').astype(np.float32)/255
img=img[C['y']:C['y']+C['h'],C['x']:C['x']+C['w']]
img=cv2.resize(img,(1800,850),interpolation=cv2.INTER_AREA)
H,W=img.shape[:2]
P=dict(violet=1.0,warm=1.0,spot=0.7,beam=0.11,wash=0.05,vig=0.5,board=0.5,room=0.62)
for a in sys.argv[2:]:
    k,v=a.split('='); P[k]=float(v)
lin=img**2.2
lum=lin.mean(axis=2,keepdims=True)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
card=np.array(G['card'])*[W,H]; cx,cy=card.mean(axis=0); ctop=card[:,1].min(); cbot=card[:,1].max()
board=(np.array(G['board'])*[W,H]).astype(np.int32)
def blob(x,y,sx,sy): return np.exp(-(((xx-x)/sx)**2+((yy-y)/sy)**2)/2)[...,None]
B,Gc,R=lin[...,0:1],lin[...,1:2],lin[...,2:3]
# --- two violet lamps low in the bottom-left and bottom-right corners, throwing light up and inward
vl=blob(-60,H+40,620,470); vr=blob(W+60,H+40,600,470)
vm=np.clip(1.35*(vl+vr),0,1)
# --- one golden spotlight straight above the easel: pool on the card, the easel and the bar in front of it
pool=np.clip(blob(cx,cy,240,300)+0.6*blob(cx+20,cbot+60,320,60),0,1)
spill=0.85*blob(cx+400,cy+60,300,190)+0.35*blob(cx-330,cy+120,200,170)                      # the nearest drinks catch the edge of it
gm=np.clip(pool+spill*(1-pool),0,1)
vm=vm*(1-gm)
violet=np.concatenate([B*1.15+0.95*R, Gc*0.80+0.05*R, 0.46*R+0.1*B],axis=2)
gold  =np.concatenate([B*0.40, Gc*0.85+0.40*R, R*1.08],axis=2)
room  =lin*np.array([0.9,0.9,0.78])*P['room']                # the rest of the room drops back, a little less red
out=room*(1-vm-gm)+violet*vm*P['violet']*1.25+gold*gm*P['warm']
out*=1+P['spot']*pool
# visible light in the air: a soft golden cone from the top of frame to the card, and violet glow rising from the corners
cone_w=40+(yy-(-120))*0.26
cone=np.exp(-((xx-(cx+ (yy-cy)*0.02))/cone_w)**2/2)*np.clip((cbot+40-yy)/(cbot+160),0,1)
out+=cone[...,None]*P['beam']*np.array([0.22,0.62,1.0])
out+=(vl+vr)*(1-gm)*P['wash']*np.array([1.0,0.16,0.50])*np.clip((yy/H)[...,None]*1.3-0.25,0,1)
# keep highlights from clipping to peach on the easel
out=np.where(out>0.6,0.6+(out-0.6)*0.5,out)
# board: dark, catching the top of the pool
bm=np.zeros((H,W),np.float32); cv2.fillConvexPoly(bm,board,1.0); bm=cv2.GaussianBlur(bm,(0,0),0.7)[...,None]
out=out*(1-bm)+out*P['board']*bm
vg=1-P['vig']*np.clip(((xx-W*0.5)/(W*0.62))**2+((yy-H*0.55)/(H*0.85))**2,0,1)**1.4*np.clip(1.3-(yy/H)[...,None][...,0]*0.9,0,1)
out*=vg[...,None]
out=np.clip(out,0,1)**(1/2.2)
out=np.clip((out-0.5)*1.08+0.5-0.006,0,1)
cv2.imwrite(sys.argv[1],(out*255+0.5).astype(np.uint8))
