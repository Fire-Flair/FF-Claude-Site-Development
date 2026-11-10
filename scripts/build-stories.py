#!/usr/bin/env python3
"""Build the FireFlair Stories data from stories/*/*.md and patch it into the prototype.

Usage:
  scripts/build-stories.py --html fireflair-v17.3.93.html --out build/fireflair-stories.html [--jsx source/fireflair-app.jsx --jsx-out source/fireflair-app.jsx]

The reader template is scripts/stories-reader.js. The patch replaces the old Journal17
component and adds the new articles, so it must be run on a copy that still has the old one.
"""
import argparse, json, math, os, re, glob, datetime, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

ORDER = {  # slugs (new articles first, then older stories that have no replacement yet)
    "party": ["P27", "P28", "P29", "P24", "P25", "P26", "P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "P21", "P23", "C01", "C02", "C05", "C06", "C07", "C08", "C09", "wedding", "cardsparty", "sites"],
    "team": ["T22", "T23", "T19", "T20", "T21", "T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18", "C03", "C10"],
    "staff": ["B22", "B23", "B19", "B20", "B21", "B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18", "C04", "C11", "C12"],
}


def parse(path):
    raw = open(path, encoding="utf-8").read()
    m = re.match(r"---\n(.*?)\n---\n(.*)$", raw, re.S)
    fm, body = {}, m.group(2)
    for line in m.group(1).split("\n"):
        k, _, v = line.partition(":")
        fm[k.strip()] = v.strip()
    return fm, body


def listval(v):
    return [x.strip() for x in v.strip("[]").split(",") if x.strip()]


def nice_date(iso):
    d = datetime.date.fromisoformat(iso)
    return f"{d.day} {d.strftime('%b %Y')}"


def plain(s):
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)
    return re.sub(r"\*+", "", s)


def _images():
    p = os.path.join(ROOT, "stories", "images.json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


IMAGES = _images()


def _json(name):
    p = os.path.join(ROOT, "stories", name)
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}


QA = _json("qa.json")  # reader Q&A sets (AI-generated, reviewed per article), keyed by slug
PROFILES = _json("profiles.json")  # profile resolver registry for featured people


def article(path):
    # sources: internal reference codes (S01...) are never shown to readers; only named sources appear in the footer
    fm, body = parse(path)
    body = re.sub(r"^# .*\n", "", body.strip(), count=1).strip()
    parts = re.split(r"^## (.+)$", body, flags=re.M)
    intro = parts[0].strip()
    sections = [[parts[i].strip(), parts[i + 1].strip()] for i in range(1, len(parts), 2)]
    words = len(body.split())
    first = plain(intro.split("\n\n")[0])
    blurb = first if len(first) <= 190 else first[:187].rsplit(" ", 1)[0] + "..."
    if fm.get("excerpt"):
        blurb = fm["excerpt"]  # a supplied card excerpt wins over the first paragraph
    cta = re.search(r"label:\s*([^,}]+)", fm.get("cta", ""))
    dest = re.search(r"destination:\s*([^,}]+)", fm.get("cta", ""))
    return {
        "id": fm["id"], "slug": fm["slug"], "site": fm["site"], "title": fm["title"], "seo": fm.get("seo_title", ""),
        "date": nice_date(fm["published"]), "iso": fm["modified"], "reviewed": nice_date(fm["reviewed"]),
        "by": fm.get("author", "FireFlair editorial team"), "cat": fm.get("category", "How-to guides"),
        "img": ("s18_" + fm["slug"]) if fm["slug"] in IMAGES else "", "alt": IMAGES.get(fm["slug"], {}).get("alt", ""),
        "min": max(2, math.ceil(words / 200)), "blurb": blurb, "intro": intro, "body": sections,
        "posted": fm.get("posted_by", "FireFlair editorial team"), "featured": listval(fm.get("featured", "[]")),
        "sources": [x for x in listval(fm.get("sources", "[]")) if not re.fullmatch(r"S\d+", x)], "qa": QA.get(fm["slug"]),
        "cta": cta.group(1).strip() if cta else "", "to": dest.group(1).strip() if dest else "", "related": listval(fm.get("related", "[]")),
    }


# Inspirational FF Party drafts: written but held back until photos are chosen (see CHANGELOG, v17.3.99).
HELD = {"I01", "I02", "I03", "I04", "I05", "I06"}


def collect():
    arts = [article(p) for p in sorted(glob.glob(os.path.join(ROOT, "stories", "*", "*.md"))) if os.sep + "held" + os.sep not in p]
    return {a["slug"]: a for a in arts if a["id"] not in HELD}


def reader(arts):
    by_id = {a["id"]: a["slug"] for a in arts.values()}
    order = {k: [by_id.get(i, i) for i in v] for k, v in ORDER.items()}
    tpl = open(os.path.join(ROOT, "scripts", "stories-reader.js"), encoding="utf-8").read()
    import base64
    imgs = {}
    for slug, m in IMAGES.items():
        f = os.path.join(ROOT, "stories", "images", slug + ".webp")
        if os.path.exists(f):
            imgs["s18_" + slug] = {"src": "data:image/webp;base64," + base64.b64encode(open(f, "rb").read()).decode(), "pos": m["pos"]}
    return (tpl.replace("__ST18_IMGS__", json.dumps(imgs))
               .replace("__ST18_DATA__", json.dumps(arts, ensure_ascii=False, indent=1))
               .replace("__ST19_PROFILES__", json.dumps({k: v for k, v in PROFILES.items() if not k.startswith("_")}, ensure_ascii=False))
               .replace("__ST18_ORDER__", json.dumps(order, ensure_ascii=False)))


def repatch(src, code):
    """Replace the Stories block in a file that already has it (from the ST18_ROUTES line to the end of Journal17)."""
    a = src.index("const ST18_ROUTES")
    c = src.rfind("/* ==== Stories phase 2", 0, a)
    start = (c if c != -1 and a - c < 1200 else src.rfind("\n", 0, a) + 1)
    j = src.index("function Journal17(", a)
    ends = [src.find(m, j) for m in ("/* ---- Hospitality industry events", "const GE17 = [")]
    e = min(x for x in ends if x != -1)
    e = src.rfind("\n", 0, e) + 1 if src[e - 1] != "\n" else e
    indent = src[src.rfind("\n", 0, a) + 1:a]
    return src[:start] + "\n".join((indent + l if l else l) for l in code.split("\n")) + "\n\n" + src[e:]


def patch(src, code):
    s = src.index("function Journal17(")
    # include the leading indentation of the function line
    ls = src.rfind("\n", 0, s) + 1
    ends = [src.find(m, s) for m in ("/* ---- Hospitality industry events", "const GE17 = [")]
    e = min(x for x in ends if x != -1)
    e = src.rfind("\n", 0, e) + 1 if src[e - 1] != "\n" else e
    indent = src[ls:s]
    return src[:ls] + "\n".join((indent + l if l else l) for l in code.split("\n")) + "\n\n" + src[e:]


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--html"); ap.add_argument("--out")
    ap.add_argument("--jsx"); ap.add_argument("--jsx-out")
    a = ap.parse_args()
    arts = collect()
    json.dump(arts, open(os.path.join(ROOT, "stories", "stories-data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    code = reader(arts)
    for src, out in ((a.html, a.out), (a.jsx, a.jsx_out)):
        if src and out:
            os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
            text = open(src, encoding="utf-8").read()
            if "ST18_ROUTES" in text:
                open(out, "w", encoding="utf-8").write(repatch(text, code))  # already patched: replace the block
            else:
                open(out, "w", encoding="utf-8").write(patch(text, code))
            print("wrote", out)
    print(len(arts), "articles")
