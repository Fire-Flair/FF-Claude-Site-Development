import cv2, numpy as np, json
rng=np.random.default_rng(7)
src=cv2.imread('/mnt/user-data/uploads/038386ea-image.jpg').astype(np.float32)
H0,W0=src.shape[:2]
Q=np.float32([[720,430],[1120,436],[1169,962],[745,995]])   # board corners TL TR BR BL (source px)
BA=0.757                                                    # board true aspect (from the square QR code)
RH=1000; RW=int(RH*BA)
M=cv2.getPerspectiveTransform(Q,np.float32([[0,0],[RW,0],[RW,RH],[0,RH]]))
# v17.32: the board is moved 26px to the right so it sits centred on the easel's ledge
SHIFT=26
Q0=Q.copy(); Q=Q+np.float32([SHIFT,0])
Mi=np.linalg.inv(cv2.getPerspectiveTransform(Q,np.float32([[0,0],[RW,0],[RW,RH],[0,RH]])))
# --- 1. blank the board: remove the print, keep the board's own light falloff
rect=cv2.warpPerspective(src,M,(RW,RH),flags=cv2.INTER_CUBIC)
g=rect.max(axis=2)
bg=cv2.medianBlur(np.clip(rect,0,255).astype(np.uint8),51).astype(np.float32)
txt=(g>bg.max(axis=2)+14).astype(np.uint8); txt=cv2.dilate(txt,np.ones((9,9),np.uint8))
clean=cv2.inpaint(np.clip(rect,0,255).astype(np.uint8),txt,7,cv2.INPAINT_TELEA).astype(np.float32)
clean=cv2.GaussianBlur(clean,(0,0),28)
clean+=rng.normal(0,2.2,clean.shape).astype(np.float32)
back=cv2.warpPerspective(clean,Mi,(W0,H0),flags=cv2.INTER_LINEAR)
qm=np.zeros((H0,W0),np.uint8); cv2.fillConvexPoly(qm,Q.astype(np.int32),255)
qm=cv2.erode(qm,np.ones((5,5),np.uint8)); 
# keep the easel ledge where it crosses the board's bottom edge
ledge=np.zeros((H0,W0),np.uint8); cv2.fillConvexPoly(ledge,np.int32([[855,983],[1115,964],[1118,1000],[855,1010]]),255)
qm[ledge>0]=0
qmf=cv2.GaussianBlur(qm,(0,0),1.0).astype(np.float32)[...,None]/255
oldq=np.zeros((H0,W0),np.uint8); cv2.fillConvexPoly(oldq,Q0.astype(np.int32),255); oldq=cv2.dilate(oldq,np.ones((9,9),np.uint8))
newq=np.zeros((H0,W0),np.uint8); cv2.fillConvexPoly(newq,Q.astype(np.int32),255)
left=((oldq>0)&(newq==0)).astype(np.uint8)*255; left[ledge>0]=0
src=cv2.inpaint(np.clip(src,0,255).astype(np.uint8),left,11,cv2.INPAINT_NS).astype(np.float32)
src+=(left>0)[...,None]*rng.normal(0,2.0,src.shape).astype(np.float32)
img=src*(1-qmf)+back*qmf
# --- 1b. the card has round corners and covers the whole board, so the board's four square corner tips are painted out
RR=int(0.044*RW)+2
rr=np.zeros((RH,RW),np.uint8)
cv2.rectangle(rr,(RR,0),(RW-RR,RH),255,-1); cv2.rectangle(rr,(0,RR),(RW,RH-RR),255,-1)
for c in [(RR,RR),(RW-RR,RR),(RR,RH-RR),(RW-RR,RH-RR)]: cv2.circle(rr,c,RR,255,-1)
rrs=cv2.warpPerspective(rr,Mi,(W0,H0),flags=cv2.INTER_LINEAR)
quad=np.zeros((H0,W0),np.uint8); cv2.fillConvexPoly(quad,Q.astype(np.int32),255); quad=cv2.dilate(quad,np.ones((7,7),np.uint8))
tips=((quad>0)&(rrs<128)).astype(np.uint8)*255
tips[ledge>0]=0
u8=cv2.inpaint(np.clip(img,0,255).astype(np.uint8),tips,9,cv2.INPAINT_TELEA)
tf=cv2.GaussianBlur(tips,(0,0),1.2).astype(np.float32)[...,None]/255
img=img*(1-tf)+u8.astype(np.float32)*tf
# --- 2. remove the mirrored logo and QR reflections on the bar top (inpaint the bright print only, keep the bar's own texture)
u8=np.clip(img,0,255).astype(np.uint8)
reg=np.zeros((H0,W0),np.uint8)
cv2.fillConvexPoly(reg,np.int32([[846,1130],[1098,1122],[1100,1212],[846,1212]]),255)
cv2.fillConvexPoly(reg,np.int32([[1092,1112],[1168,1108],[1168,1178],[1092,1178]]),255)
gray=u8.max(axis=2); med=cv2.medianBlur(gray,41)
m2=((gray.astype(np.int16)-med)>7).astype(np.uint8)*255
m2=cv2.dilate(m2,np.ones((7,7),np.uint8)); m2[reg==0]=0
u8=cv2.inpaint(u8,m2,6,cv2.INPAINT_TELEA)
soft=cv2.GaussianBlur(u8,(0,0),2.2)
rf=cv2.GaussianBlur((m2>0).astype(np.float32),(0,0),3)[...,None]
img=u8.astype(np.float32)*(1-rf)+soft.astype(np.float32)*rf
img+=rf*rng.normal(0,1.6,img.shape).astype(np.float32)
cv2.imwrite('clean_full.png',np.clip(img,0,255).astype(np.uint8))
# --- 3. card rectangle on the board (board-normalised u,v) -> source px
u0,u1,v0,v1=0.0,1.0,0.0,0.994
pts=np.float32([[u0*RW,v0*RH],[u1*RW,v0*RH],[u1*RW,v1*RH],[u0*RW,v1*RH]]).reshape(-1,1,2)
card_src=cv2.perspectiveTransform(pts,Mi).reshape(-1,2)
CROP=dict(x=0,y=340,w=1900,h=round(1900*850/1800))
card_frac=[[float((x-CROP['x'])/CROP['w']),float((y-CROP['y'])/CROP['h'])] for x,y in card_src]
board_frac=[[float((x-CROP['x'])/CROP['w']),float((y-CROP['y'])/CROP['h'])] for x,y in Q]
json.dump(dict(crop=CROP,card=card_frac,board=board_frac,card_src=card_src.tolist()),open('geom.json','w'),indent=1)
print(json.dumps(card_frac))
