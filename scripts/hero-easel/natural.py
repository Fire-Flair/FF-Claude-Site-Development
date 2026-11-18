# home2 (Alex, 18 Nov 15:29, "no lighting"): the hero photo without the relight of grade.py.
# Crops clean_full.png (from base.py) to 1800x850 and applies one even colour balance in linear light, matched to the
# untouched v17.22 photo (a little less red, as the camera saw it). No lamps, spotlight, beams or vignette.
import cv2, numpy as np, json, sys
G=json.load(open('geom.json')); C=G['crop']
img=cv2.imread('clean_full.png')[C['y']:C['y']+C['h'],C['x']:C['x']+C['w']]
img=cv2.resize(img,(1800,850),interpolation=cv2.INTER_AREA)
GAIN=np.array([0.835,1.215,1.075])   # BGR, linear light
out=np.clip(((img/255.)**2.2)*GAIN,0,1)**(1/2.2)
cv2.imwrite(sys.argv[1] if len(sys.argv)>1 else 'hero-natural.png',(out*255+.5).astype(np.uint8))
