#!/usr/bin/env python3
"""Build the shared UK location catalogue used by FF Team, FF Staff and FF Party (v17.4.6).

Inputs (authoritative, in data/front-doors/):
  launch_pages.json            the 1,000 GeoNames launch pages from the Front Doors kit (never rewritten here)
  prototype_world_rows.json    worldwide navigation rows added in the prototype
  location_additions.json      verified pages added after the kit (edit this file to add places)
Outputs:
  src/content/data/fd-rows.json   compact rows for the prototype:
                                  [id, name, kind, parent row, slug, lat, lng, country, ukScope]
  src/content/data/fd-aliases.json alternate names and legacy paths -> canonical path
  data/front-doors/catalogue_additions_report.json  what was added and every check that ran

Row order is stable: kit pages first (their row numbers never change), then the worldwide rows,
then additions in file order. A new place never moves an existing one.

Checks (the build fails on any error): duplicate ids, duplicate paths, unknown or later parents,
cycles, empty slugs or names, alias collisions with real paths, and every route resolvable.
Usage: python3 scripts/build-locations.py [--check]   (--check validates without writing)
"""
import json, re, sys, unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FD = ROOT / "data" / "front-doors"
OUT_ROWS = ROOT / "src" / "content" / "data" / "fd-rows.json"
OUT_ALIASES = ROOT / "src" / "content" / "data" / "fd-aliases.json"
REPORT = FD / "catalogue_additions_report.json"

KIND = {"country_or_territory": "c", "uk_nation": "n", "administrative_area": "a", "london_borough": "b",
        "city_corporation": "b", "populated_place": "p", "neighbourhood": "h", "navigation_root": "r", "continent": "t"}
# Display names the prototype shows instead of the kit's (route and id unchanged).
DISPLAY = {"gn:2648110": "London"}


def r4(v):
    return None if v is None else round(float(v), 4)


def slug(v):
    s = unicodedata.normalize("NFKD", v).encode("ascii", "ignore").decode().lower()
    s = s.replace("'", "").replace("’", "").replace("&", " and ")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def main(check_only):
    kit = json.loads((FD / "launch_pages.json").read_text())["pages"]
    world = json.loads((FD / "prototype_world_rows.json").read_text())["rows"]
    adds = json.loads((FD / "location_additions.json").read_text())["pages"]
    errors, notes = [], []

    rows = []
    idx = {}
    for p in kit:
        idx[p["location_id"]] = len(rows)
        rows.append([p["location_id"], DISPLAY.get(p["location_id"], p["display_name"]), KIND[p["kind"]], None, p["slug"],
                     r4(p.get("latitude")), r4(p.get("longitude")), p.get("country_code") or "", 1 if p.get("nearby_fallback_scope") == "same_uk_nation" else 0])
    for p, r in zip(kit, rows):
        par = p.get("parent_page_id")
        r[3] = idx.get(par, -1) if par else -1
        if par and par not in idx: errors.append(f"kit page {p['location_id']} has unknown parent {par}")
    base = len(rows)
    for w in world:
        if w[0] in idx: errors.append(f"world row {w[0]} duplicates an id"); continue
        idx[w[0]] = len(rows)
        rows.append(list(w))
    alias_rows = []
    for a in adds:
        lid = a["location_id"]
        if lid in idx: errors.append(f"addition {lid} ({a['display_name']}) duplicates an existing id"); continue
        if a["parent_page_id"] not in idx: errors.append(f"addition {lid} has unknown parent {a['parent_page_id']}"); continue
        if a["kind"] not in KIND: errors.append(f"addition {lid} has unknown kind {a['kind']}"); continue
        par = rows[idx[a["parent_page_id"]]]
        idx[lid] = len(rows)
        rows.append([lid, a["display_name"], KIND[a["kind"]], idx[a["parent_page_id"]], a.get("slug") or slug(a["display_name"]),
                     r4(a.get("lat")), r4(a.get("lng")), par[7] or "GB", par[8]])
        for al in a.get("aliases", []):
            alias_rows.append((lid, al))

    # paths, cycles, duplicates
    paths, by_path = {}, {}
    def path_of(i, seen=()):
        if i in paths: return paths[i]
        if i in seen: errors.append(f"cycle at {rows[i][0]}"); return "/cycle"
        r = rows[i]
        pre = "/areas" if r[3] < 0 else path_of(r[3], seen + (i,))
        paths[i] = pre + "/" + r[4]
        return paths[i]
    ids = set()
    for i, r in enumerate(rows):
        if r[0] in ids: errors.append(f"duplicate id {r[0]}")
        ids.add(r[0])
        if not r[1] or not r[4]: errors.append(f"empty name or slug at {r[0]}")
        if r[3] >= i: errors.append(f"parent of {r[0]} comes after it (row {r[3]} >= {i})")
        p = path_of(i)
        if p in by_path: errors.append(f"duplicate path {p} ({by_path[p]} and {r[0]})")
        by_path[p] = r[0]

    # aliases: alternate names (search) and alias paths (redirect to the canonical page)
    aliases = {"names": {}, "paths": {}}
    for lid, al in alias_rows:
        i = idx[lid]
        ap = paths[rows[i][3]] + "/" + slug(al) if rows[i][3] >= 0 else "/areas/" + slug(al)
        aliases["names"][al.lower()] = lid
        if ap == paths[i]: continue
        if ap in by_path: errors.append(f"alias path {ap} collides with a real page"); continue
        aliases["paths"][ap] = paths[i]

    # every route resolves to a row, and every addition is reachable from the UK root
    for p, lid in by_path.items():
        if lid not in idx: errors.append(f"route {p} has no row")
    for a in adds:
        lid = a["location_id"]
        if lid in idx and not paths[idx[lid]].startswith("/areas/uk/"): errors.append(f"addition {lid} is not under /areas/uk")

    names = {}
    for r in rows: names.setdefault(r[1], []).append(r[0])
    dup_names = {n: v for n, v in names.items() if len(v) > 1}
    notes.append(f"{len(dup_names)} names are shared by more than one page; the prototype labels them with their parent (fdLabel).")

    report = {"rows": len(rows), "kit_rows": base, "world_rows": len(world), "added": [{"id": a["location_id"], "name": a["display_name"], "path": paths.get(idx.get(a["location_id"], -1))} for a in adds],
              "aliases": aliases, "errors": errors, "notes": notes,
              "checks": ["duplicate ids", "duplicate paths", "unknown parents", "parent order", "cycles", "empty names or slugs", "alias collisions", "every route has a row", "additions under /areas/uk"]}
    if errors:
        print("\n".join("ERROR " + e for e in errors)); sys.exit(1)
    if check_only:
        print(f"ok: {len(rows)} rows ({base} kit, {len(world)} world, {len(adds)} added), {len(aliases['paths'])} alias paths"); return
    OUT_ROWS.write_text(json.dumps(rows, ensure_ascii=False, separators=(",", ":")))
    OUT_ALIASES.write_text(json.dumps(aliases, ensure_ascii=False, indent=1) + "\n")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1) + "\n")
    print(f"wrote {OUT_ROWS.relative_to(ROOT)}: {len(rows)} rows ({base} kit, {len(world)} world, {len(adds)} added); {len(aliases['paths'])} alias paths")


if __name__ == "__main__":
    main("--check" in sys.argv)
