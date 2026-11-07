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
    "party": ["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09", "P10", "P11", "P12", "P13", "P14", "P15", "P16", "P17", "P18", "P19", "P20", "P21", "P23", "wedding", "cardsparty", "sites"],
    "team": ["T01", "T02", "T03", "T04", "T05", "T06", "T07", "T08", "T09", "T10", "T11", "T12", "T13", "T14", "T15", "T16", "T17", "T18"],
    "staff": ["B01", "B02", "B03", "B04", "B05", "B06", "B07", "B08", "B09", "B10", "B11", "B12", "B13", "B14", "B15", "B16", "B17", "B18"],
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


def article(path):
    fm, body = parse(path)
    body = re.sub(r"^# .*\n", "", body.strip(), count=1).strip()
    parts = re.split(r"^## (.+)$", body, flags=re.M)
    intro = parts[0].strip()
    sections = [[parts[i].strip(), parts[i + 1].strip()] for i in range(1, len(parts), 2)]
    words = len(body.split())
    first = plain(intro.split("\n\n")[0])
    blurb = first if len(first) <= 190 else first[:187].rsplit(" ", 1)[0] + "..."
    cta = re.search(r"label:\s*([^,}]+)", fm.get("cta", ""))
    return {
        "id": fm["id"], "slug": fm["slug"], "site": fm["site"], "title": fm["title"], "seo": fm.get("seo_title", ""),
        "date": nice_date(fm["published"]), "iso": fm["modified"], "reviewed": nice_date(fm["reviewed"]),
        "by": fm.get("author", "FireFlair editorial team"), "cat": fm.get("category", "How-to guides"), "img": "",
        "min": max(2, math.ceil(words / 200)), "blurb": blurb, "intro": intro, "body": sections,
        "cta": cta.group(1).strip() if cta else "", "related": listval(fm.get("related", "[]")),
    }


def collect():
    arts = [article(p) for p in sorted(glob.glob(os.path.join(ROOT, "stories", "*", "*.md")))]
    return {a["slug"]: a for a in arts}


def reader(arts):
    by_id = {a["id"]: a["slug"] for a in arts.values()}
    order = {k: [by_id.get(i, i) for i in v] for k, v in ORDER.items()}
    tpl = open(os.path.join(ROOT, "scripts", "stories-reader.js"), encoding="utf-8").read()
    return (tpl.replace("__ST18_DATA__", json.dumps(arts, ensure_ascii=False, indent=1))
               .replace("__ST18_ORDER__", json.dumps(order, ensure_ascii=False)))


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
                sys.exit(f"{src} already has the Stories patch; run on a pristine copy")
            open(out, "w", encoding="utf-8").write(patch(text, code))
            print("wrote", out)
    print(len(arts), "articles")
