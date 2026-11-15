#!/usr/bin/env python3
"""FF Team home pillars: no photo may be used twice, pen02 never, at most one photo of Alex (p43).
Reads src/content/homepage/team-pillars.json (photos pools plus section img) and prints any clash.
Run: python3 scripts/check-team-photos.py  (exit 1 on a clash)."""
import json, sys, collections, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
J = json.load(open(root / "src/content/homepage/team-pillars.json"))
use = collections.defaultdict(list)
for k, ids in J["photos"].items():
    if k.startswith("_"): continue
    for i in ids: use[i].append("pool:" + k)
for pl in J["pillars"]:
    for s in pl["sections"]:
        if s.get("img"): use[s["img"]].append("section:" + s["slug"])
bad = 0
for i, w in sorted(use.items()):
    pools = [x for x in w if x.startswith("pool:")]
    if len(w) > 1 and not (len(pools) == 0 or len(set(w)) < len(w)):
        print("CLASH", i, w); bad += 1
    if len(pools) > 1: print("CLASH (two pools)", i, w); bad += 1
if "pen02" in use: print("pen02 is library only"); bad += 1
if sum(1 for i in use if i == "p43") > 1: bad += 1
print("alex photos:", [i for i in use if i == "p43"], "| photos checked:", len(use))
print("check-team-photos: ok" if not bad else "check-team-photos: %d problem(s)" % bad)
sys.exit(1 if bad else 0)
