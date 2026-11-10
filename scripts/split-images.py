#!/usr/bin/env python3
"""Publish build: move inline base64 images out of the single-file prototype.
Usage: split-images.py fireflair-vN.html OUTDIR  ->  OUTDIR/index.html + OUTDIR/i/NNN.webp
The single file in the repo stays the source of truth; this output is what goes to the artifact."""
import re, base64, os, sys
src, out = sys.argv[1], sys.argv[2]
os.makedirs(os.path.join(out, "i"), exist_ok=True)
s = open(src, encoding="utf-8").read(); seen = {}
def rep(m):
    t, b = m.group(1), m.group(2)
    if len(b) < 3000: return m.group(0)
    if b not in seen:
        fn = "i/%03d.%s" % (len(seen) + 1, {"image/webp": "webp", "image/png": "png", "image/jpeg": "jpg"}[t])
        open(os.path.join(out, fn), "wb").write(base64.b64decode(b)); seen[b] = fn
    return seen[b]
html = re.sub(r"data:(image/webp|image/png|image/jpeg);base64,([A-Za-z0-9+/=]+)", rep, s)
open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(html)
print(len(s), "->", len(html.encode()), "bytes;", len(seen), "image files")
