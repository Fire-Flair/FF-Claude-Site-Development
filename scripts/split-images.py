#!/usr/bin/env python3
"""Publish build: move inline base64 images out of the single-file prototype.

Usage: split-images.py fireflair-vN.html OUTDIR
  -> OUTDIR/index.html, OUTDIR/i/<sha256-16>.<ext> (deterministic names, identical images stored once),
     OUTDIR/manifest.json (path, type, bytes, sha256 of every image) and a printed audit.
The single file (npm run build) stays the reviewable prototype; this output is what goes to the artifact.
Fails with a clear message on malformed base64 or an unexpected image type. Release HTML must stay under
5 MiB (5,242,880 bytes): the run exits 1 otherwise. OUTDIR is rebuilt from scratch on every run."""
import re, base64, os, sys, json, hashlib, shutil, binascii

LIMIT = 5 * 1024 * 1024
EXT = {"image/webp": "webp", "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/svg+xml": "svg"}
KEEP_INLINE = 3000  # base64 chars: smaller payloads (tiny icons) stay inline on purpose

def main(src, out):
    if os.path.exists(out): shutil.rmtree(out)
    os.makedirs(os.path.join(out, "i"))
    s = open(src, encoding="utf-8").read()
    files, refs, dups, inline_left = {}, 0, 0, 0

    def rep(m):
        nonlocal refs, dups, inline_left
        t, b = m.group(1), m.group(2)
        if t not in EXT: raise SystemExit("unexpected image type in page: " + t)
        if len(b) < KEEP_INLINE: inline_left += len(m.group(0)); return m.group(0)
        try: raw = base64.b64decode(b, validate=True)
        except (binascii.Error, ValueError): raise SystemExit("malformed base64 image (%s, %d chars)" % (t, len(b)))
        h = hashlib.sha256(raw).hexdigest()[:16]; rel = "i/%s.%s" % (h, EXT[t]); refs += 1
        if rel in files: dups += 1
        else:
            open(os.path.join(out, rel), "wb").write(raw); files[rel] = {"path": rel, "type": t, "bytes": len(raw), "sha256": hashlib.sha256(raw).hexdigest()}
        return rel

    html = re.sub(r"data:(image/[a-z+]+);base64,([A-Za-z0-9+/=]+)", rep, s)
    open(os.path.join(out, "index.html"), "w", encoding="utf-8").write(html)
    json.dump(sorted(files.values(), key=lambda x: x["path"]), open(os.path.join(out, "manifest.json"), "w"), indent=1)
    remote = len(re.findall(r"https://[^\"'\s)]*\.(?:webp|png|jpe?g|gif)", html))
    size = len(html.encode()); pkg = size + sum(f["bytes"] for f in files.values())
    print("before: %d bytes (%.2f MiB)" % (len(s.encode()), len(s.encode()) / 1048576))
    print("release index.html: %d bytes (%.2f MiB, limit %d)" % (size, size / 1048576, LIMIT))
    print("embedded references %d, unique files %d, duplicate references %d, small inline images left %d bytes, remote image urls %d (not packaged)" % (refs, len(files), dups, inline_left, remote))
    print("full package: %d bytes (%.2f MiB) in %d image files" % (pkg, pkg / 1048576, len(files)))
    if size > LIMIT: shutil.rmtree(out); raise SystemExit("FAIL: release HTML is over 5 MiB")

if __name__ == "__main__":
    if len(sys.argv) != 3: raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
