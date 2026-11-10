#!/usr/bin/env python3
"""Build the FireFlair Stories data from stories/<site>/<slug>.md into src/content/stories/*.json.

Usage:
  python3 scripts/build-stories.py            (or: npm run stories)

Writes articles.json, order.json, profiles.json and images.json in src/content/stories/ plus stories/stories-data.json.
The reader code is src/content/stories/stories-reader.jsx (static); it reads the data through CONTENT_ADAPTER
(src/adapters/content-adapter.js). Story images stay in stories/images/*.webp and are packed by scripts/build.mjs.
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


def write_src(arts):
    by_id = {a["id"]: a["slug"] for a in arts.values()}
    order = {k: [by_id.get(i, i) for i in v] for k, v in ORDER.items()}
    imgs = {}
    for slug, m in IMAGES.items():
        if os.path.exists(os.path.join(ROOT, "stories", "images", slug + ".webp")):
            imgs["s18_" + slug] = {"src": "ffasset:story/" + slug + ".webp", "pos": m["pos"]}
    out = os.path.join(ROOT, "src", "content", "stories")
    os.makedirs(out, exist_ok=True)
    data = {"articles.json": arts, "order.json": order,
            "profiles.json": {k: v for k, v in PROFILES.items() if not k.startswith("_")}, "images.json": imgs}
    for name, obj in data.items():
        with open(os.path.join(out, name), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=1)
            f.write("\n")
        print("wrote", os.path.join("src/content/stories", name))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default="src", help="kept for npm run stories; output is always src/content/stories")
    ap.parse_args()
    arts = collect()
    json.dump(arts, open(os.path.join(ROOT, "stories", "stories-data.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    write_src(arts)
    print(len(arts), "articles")
