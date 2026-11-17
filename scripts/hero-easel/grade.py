import cv2, numpy as np, json, sys
G=json.load(open('geom.json')); C=G['crop']
img=cv2.imread('clean_full.png').astype(np.float32)/255
img=img[C['y']:C['y']+C['h'],C['x']:C['x']+C['w']]
img=cv2.resize(img,(1800,850),interpolation=cv2.INTER_AREA)
H,W=img.shape[:2]
P=dict(violet=1.0,warm=1.0,spot=0.55,rim=0.5,vig=0.55,board=0.5)
for a in sys.argv[2:]:
    k,v=a.split('='); P[k]=float(v)
lin=img**2.2
lum=lin.mean(axis=2,keepdims=True)
yy,xx=np.mgrid[0:H,0:W].astype(np.float32)
card=np.array(G['card'])*[W,H]; cx,cy=card.mean(axis=0)
board=(np.array(G['board'])*[W,H]).astype(np.int32)
def blob(x,y,sx,sy): return np.exp(-(((xx-x)/sx)**2+((yy-y)/sy)**2)/2)[...,None]
# one warm source above the easel: pool on the card, spill on the kit either side and on the bar top in front
spot=np.clip(blob(cx,cy-10,250,300)+0.55*blob(cx+30,card[:,1].max()+70,330,70),0,1)
amber=np.clip(0.75*blob(1400,430,330,230),0,1)            # drinks and barrel stay red-amber
wm=np.clip(spot+amber*(1-spot),0,1)
# all colour changes are gains on the light already in the photo, so black stays black
B,Gc,R=lin[...,0:1],lin[...,1:2],lin[...,2:3]
violet=np.concatenate([B*1.1+0.80*R, Gc*0.85+0.06*R, 0.50*R+0.1*B],axis=2)   # hue-rotate the red room wash to violet
warmv =np.concatenate([B*0.45, Gc*0.9+0.40*R, R*1.02],axis=2)                           # ... and to amber inside the pool
out=lin*(1-P['violet']*(1-wm)) + violet*P['violet']*(1-wm)
out=out*(1-P['warm']*wm*0.85) + warmv*P['warm']*wm*0.85
out*=1+P['spot']*spot                                      # exposure lift inside the pool
# violet rim: push the brightest speculars outside the pool further to violet-white
hi=np.clip((lum-0.18)/0.5,0,1)*(1-wm)
out+=hi*P['rim']*np.array([0.30,0.05,0.14])*lum*4
# tame the easel (it blows out to peach under the spot)
out=np.where(out>0.55,0.55+(out-0.55)*0.55,out)
# board: true black with a faint warm falloff from the top
bm=np.zeros((H,W),np.float32); cv2.fillConvexPoly(bm,board,1.0); bm=cv2.GaussianBlur(bm,(0,0),0.7)[...,None]
out=out*(1-bm)+ (out*P['board']*(0.75+0.5*np.clip(1-(yy[...,None]-board[:,1].min())/(np.ptp(board[:,1])+1),0,1)))*bm
# vignette to black
vg=1-P['vig']*np.clip(((xx-W*0.52)/(W*0.60))**2+((yy-H*0.42)/(H*0.78))**2,0,1)**1.3
out*=vg[...,None]
out=np.clip(out,0,1)**(1/2.2)
out=np.clip((out-0.5)*1.08+0.5-0.006,0,1)
cv2.imwrite(sys.argv[1],(out*255+0.5).astype(np.uint8))
