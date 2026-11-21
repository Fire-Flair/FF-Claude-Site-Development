/* src/components/staff/network-directory20.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* ==========================================================================
   v17.20 — FF Team Network page: the FF Event Directory in sub-category tabs (rule of five) and the Venues section.

   NET_DIR_TABS20 is the one place the tabs are decided. Per Directory category (bar, dj, photo, catering, svc):
     tabs   the tabs in the order shown: { k, label, icon (lucide name), re, on }
     order  the order the rules are tried in: the first tab whose rule matches the company is its tab
     rest   the tab a company lands in when no rule matches (so every company is in exactly one tab)
   A rule is a regular expression read against the company's type line ("kind") or, with on: "all", its type line plus its
   listed services. min: how many different matches are needed. A tab nobody lands in is not shown.
   ========================================================================== */
const NET20_CSS = __ff_css("styles/net20.css");




const NET_DIR_TABS20 = {
  bar: { rest: "hire", order: ["cater", "special", "staff", "mobile"], tabs: [
    { k: "mobile", label: "Mobile cocktail bars", icon: "Martini", re: /cocktail|mixolog/i, on: "kind" },
    { k: "hire", label: "Event bar hire", icon: "CalendarDays" },
    { k: "staff", label: "Bartender staffing", icon: "Users", re: /staffing|bartender hire|bartenders|bartending|bar management/i, on: "kind" },
    { k: "special", label: "Specialist bars", icon: "Wine", re: /\b(gin|prosecco|whisky|whiskey|beer|wine|cask|keg)\b/gi, on: "all", min: 2 },
    { k: "cater", label: "Bar & catering", icon: "UtensilsCrossed", re: /catering/i, on: "kind" }] },
  dj: { rest: "party", order: ["live", "sound", "wedding", "corporate", "party"], tabs: [
    { k: "wedding", label: "Wedding DJs", icon: "Heart", re: /wedding/i, on: "kind" },
    { k: "party", label: "Party & club DJs", icon: "PartyPopper", re: /disco|party|club|karaoke|video/i, on: "kind" },
    { k: "corporate", label: "Corporate DJs", icon: "Briefcase", re: /corporate/i, on: "kind" },
    { k: "live", label: "DJ & live music", icon: "Music", re: /live|saxophon|musician/i, on: "all" },
    { k: "sound", label: "Sound & lighting", icon: "Volume2", re: /sound|lighting|\bAV\b/i, on: "kind" }] },
  photo: { rest: "plan", order: ["plan", "video", "booth", "style", "photo"], tabs: [
    { k: "photo", label: "Photography", icon: "Camera", re: /photograph/i, on: "kind" },
    { k: "video", label: "Videography", icon: "Video", re: /video|film/i, on: "kind" },
    { k: "booth", label: "Photo booths", icon: "Aperture", re: /photo booth/i, on: "kind" },
    { k: "style", label: "Styling & decor", icon: "Flower2", re: /styling|decor|floral|flowers/i, on: "kind" },
    { k: "plan", label: "Planning & staffing", icon: "ClipboardList", re: /management|planning|staffing/i, on: "kind" }] },
  catering: { rest: "wedding", order: ["street", "dessert", "chef", "wedding", "corporate"], tabs: [
    { k: "street", label: "Street food", icon: "Flame", re: /street food|paella|tapas|hog|ox roast|bbq|barbecue|fish and chip/i, on: "all" },
    { k: "chef", label: "Private chefs", icon: "ChefHat", re: /chef/i, on: "kind" },
    { k: "wedding", label: "Wedding catering", icon: "Heart", re: /wedding/i, on: "kind" },
    { k: "corporate", label: "Corporate catering", icon: "Briefcase", re: /corporate/i, on: "kind" },
    { k: "dessert", label: "Desserts & cakes", icon: "Cake", re: /dessert|cake|patisserie|bakery/i, on: "all" }] },
  svc: { rest: "glass", order: ["ice", "masterclass", "build", "consult", "glass"], tabs: [
    { k: "glass", label: "Glassware & equipment", icon: "GlassWater", re: /glassware|equipment|hire/i, on: "kind" },
    { k: "ice", label: "Ice & drinks supply", icon: "Snowflake", re: /\bice\b|drinks supply/i, on: "kind" },
    { k: "masterclass", label: "Cocktail masterclasses", icon: "GraduationCap", re: /masterclass|cocktail class|training/i, on: "kind" },
    { k: "build", label: "Mobile bar builds", icon: "Hammer", re: /bar build/i, on: "kind" },
    { k: "consult", label: "Drinks consultancy", icon: "Lightbulb", re: /consult/i, on: "kind" }] },
};




const NET_ICONS20 = {};


function netIc20(name, size) {
  const C = NET_ICONS20[name] || (NET_ICONS20[name] = lucideIcon(name));
  return React.createElement(C, { size: size || 15, strokeWidth: 1.8 });
}




/* Which tab of its category a Directory company is in. */
function dirTabOf20(c, cat) {
  const d = NET_DIR_TABS20[cat] || NET_DIR_TABS20.bar;
  const kind = String(c.kind || "");
  const all = [c.kind].concat((c.seed && c.seed.services) || []).join(" ; ");
  for (let i = 0; i < d.order.length; i++) {
    const t = d.tabs.find(function (x) { return x.k === d.order[i]; });
    if (!t || !t.re) continue;
    const text = t.on === "all" ? all : kind;
    const hits = text.match(new RegExp(t.re.source, t.re.flags.replace("g", "") + "g")) || [];
    if (new Set(hits.map(function (x) { return x.toLowerCase(); })).size >= (t.min || 1)) return t.k;
  }
  return d.rest;
}




/* The tab row (17.21): squircle buttons, icon beside the label, one line, scrolls left and right only. */
function NetTabs20({ tabs, active, onChange, label, count }) {
  return React.createElement("div", { className: "ff-ptabs ff-nt20", role: "tablist", "aria-label": label },
    tabs.map(function (t) {
      return React.createElement("button", { key: t.k, type: "button", role: "tab", "aria-selected": active === t.k, className: active === t.k ? "on" : "", onClick: function (e) { const b = e.currentTarget, row = b.parentNode, rb = row.getBoundingClientRect(), bb = b.getBoundingClientRect(); if (row.scrollTo) row.scrollTo({ left: row.scrollLeft + bb.left - rb.left - 16, behavior: "smooth" }); onChange(t.k); } },
        React.createElement("span", { className: "ic", "aria-hidden": "true" }, netIc20(t.icon, 15)),
        React.createElement("span", { className: "lb" }, t.label),
        count ? React.createElement("span", { className: "ct" }, "(" + count(t) + ")") : null);
    }));
}




/* A Directory company's tile (the Company Card, then its team). The FF logo on a claimed card already marks it; no Featured tag. */
function CoTile20({ co }) {
  const { state, dispatch } = useStore();
  return React.createElement("button", {
    type: "button", className: "ff-co11-tile",
    onClick: function () { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); },
    "aria-label": (co.name || "Your company") + ": open their page"
  },
    React.createElement(CompanyCardFace, { c: co, size: "sm" }),
    co.team && co.team.length > 0 && React.createElement("span", { className: "ff-co11-team" }, co.team.slice(0, 4).map(function (id) {
      const p = (state.directory || []).find(function (x) { return x.id === id; });
      return p ? React.createElement(Portrait, { key: id, src: p.photo, name: p.name, size: 24, tier: p.tier }) : null;
    }), React.createElement("small", null, co.team.length, " on the team")));
}




/* v1.102 (Alex, 19 Nov 22:00): browsing for the FF Event Directory and Our professionals. A row of squircle category boxes (left and
   right selects), the sub-category pills under it, and one browsing row of cards for the open choice. Replaces the drop-downs. */
function CatBoxes20({ items, active, onPick, label }) {
  return React.createElement("div", { className: "ff-cb20", role: "tablist", "aria-label": label },
    items.map(function (it) {
      const on = active === it.k && !it.disabled;
      /* v1.187: a box nobody belongs to is greyed and cannot be tapped (the Directory never passes disabled). */
      return React.createElement("button", Object.assign({ key: it.k, type: "button", role: "tab", "aria-selected": on, className: "ff-cb20-b" + (on ? " on" : "") + (it.disabled ? " off" : "") },
        it.disabled ? { disabled: true, "aria-disabled": "true" } : { onClick: function (e) {
        onPick(it.k); const b = e.currentTarget, row = b.parentNode; if (row && row.scrollTo) row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.offsetWidth) / 2, behavior: "smooth" }); } }),
        React.createElement("span", { className: "ic", "aria-hidden": "true" }, it.icon),
        React.createElement("span", { className: "lb" }, it.label),
        React.createElement("span", { className: "ct" }, it.count));
    }));
}

/* v1.187 (Alex 21 Nov): bring a Network search bar, and its title when the two are close, to the top of the visible
   screen under the sticky top bar. Works with the iOS keyboard up: visualViewport.offsetTop is where the visible part starts. */
function netPinTop187(row) {
  if (!row || !document.body.contains(row)) return;
  const bar = row.querySelector(".ff-hr20-s"); if (!bar) return;
  const head = row.querySelector("h1,h2");
  const vv = window.visualViewport, vvTop = vv ? vv.offsetTop : 0;
  const tb = document.querySelector(".ff-topbar");
  const stuck = tb && getComputedStyle(tb).position === "sticky" ? tb.getBoundingClientRect().bottom : 0;
  const b = bar.getBoundingClientRect(), t = head ? head.getBoundingClientRect() : b;
  const top = b.bottom - t.top <= 140 ? Math.min(t.top, b.top) : b.top;
  const dy = Math.round(top - (Math.max(stuck, vvTop) + 10));
  if (Math.abs(dy) > 2) window.scrollTo({ top: window.scrollY + dy, behavior: "instant" });
}

/* v1.187: the search results, moved unchanged out of NetBrowse17. They sit under the heading row of the box being typed in. */
function NetResults187(props) {
  const state = useStore().state;
  const found = netSearch17(state, props.query);
  if (!found) return null;
  const anyCo = found.cos.length + found.dir.length > 0;
  return React.createElement(React.Fragment, null,
    React.createElement(GroupedPeople, { query: props.query, onPick: props.onPick, scope: props.scope, quietEmpty: anyCo }),
    found.cos.length ? React.createElement(CompaniesSection, { title: "Companies", list: found.cos }) : null,
    found.dir.length ? React.createElement(CompaniesSection, { title: "FF Event Directory", list: found.dir }) : null);
}

/* A Network heading with its words under it and, on a wide screen, the search on the right in line with the title. */
function HeadRow20({ title, k, desc, search, q }) {
  const ref = useRef(null);
  const timers = useRef([]);
  const still = function () { return !!(ref.current && ref.current.contains(document.activeElement)); };
  useEffect(function () {
    const vv = window.visualViewport;
    if (!vv || !search) return undefined;
    const on = function () { if (still()) netPinTop187(ref.current); };
    vv.addEventListener("resize", on);
    return function () { vv.removeEventListener("resize", on); };
  }, [!!search]);
  useEffect(function () { return function () { timers.current.forEach(clearTimeout); timers.current = []; }; }, []);
  React.useLayoutEffect(function () { if (still()) netPinTop187(ref.current); }, [q]);
  const onFocus = function () {
    window.__ffSrchAt = k;
    netPinTop187(ref.current);
    timers.current.forEach(clearTimeout);
    timers.current = [60, 250, 500, 900].map(function (ms) { return setTimeout(function () { if (still()) netPinTop187(ref.current); }, ms); });
  };
  return React.createElement("div", { className: "ff-hr20", ref: ref },
    React.createElement("div", { className: "ff-hr20-l" },
      React.createElement(LinedHead20, { title: title, k: k }),
      desc ? React.createElement("p", { className: "ff-hr20-d" }, desc) : null),
    search ? React.createElement("div", { className: "ff-hr20-s", id: k === "pros" ? "ff-net-search" : undefined, "data-srch": k, onFocusCapture: onFocus }, search) : null);
}

/* v1.187 (Alex 21 Nov): the four tiles of Our professionals. The one place to change them. A person's top 3 professions
   (profs17) decide where they appear. Any group not named by the first three tiles belongs to Specialists. */
const PRO_TILES187 = [
  { k: "hosp", label: "Hospitality",   icons: ["ConciergeBell", "Martini"], groups: ["Bar", "Front of House", "Management", "Back of House", "Chefs"],
    pills: [["Bar", "Bar"], ["Front of House", "Front of House"], ["Management", "Management"], ["Back of House", "Back of House"], ["Chefs", "Food"]] },
  { k: "ent",  label: "Entertainment", icons: ["Music"],  groups: ["Entertainment"] },
  { k: "svc",  label: "Services",      icons: ["Camera"], groups: ["Services"] },
  { k: "spec", label: "Specialists",   icons: ["Sparkles", "Award"], groups: null },
];
function proTiles187(people) {
  const norm = function (x) { return String(x || "").trim().toLowerCase(); };
  const tileOf = function (g) {
    const i = PRO_TILES187.findIndex(function (t) { return t.groups && t.groups.indexOf(g) >= 0; });
    return i >= 0 ? i : PRO_TILES187.findIndex(function (t) { return !t.groups; });
  };
  /* rows: [{ p, i, e }] sorted by the entry's rank, then by position; a person once, shown as their best entry */
  const asPeople = function (rows) {
    return rows.slice().sort(function (a, b) { return a.e.rank - b.e.rank || a.i - b.i; }).map(function (r) { return plateAs17(r.p, r.e.profession); });
  };
  const perTile = PRO_TILES187.map(function () { return []; });
  (people || []).forEach(function (p, i) {
    const es = p.profs17 && p.profs17.length ? p.profs17 : [{ profession: p.profession || "", rank: 0, group: p.group }];
    es.forEach(function (e) { perTile[tileOf(e.group)].push({ p: p, i: i, e: e }); });
  });
  /* the lowest-rank entry of each person within a list of entries */
  const bestPer = function (entries) {
    const m = {};
    entries.forEach(function (r) { if (!m[r.i] || r.e.rank < m[r.i].e.rank) m[r.i] = r; });
    return Object.keys(m).map(function (k) { return m[k]; });
  };
  return PRO_TILES187.map(function (t, ti) {
    const entries = perTile[ti];
    const rows = bestPer(entries);
    let pills;
    if (t.pills) {
      pills = t.pills.map(function (d) {
        const list = asPeople(bestPer(entries.filter(function (r) { return r.e.group === d[0]; })));
        return { k: d[0], label: d[1], off: list.length === 0, people: list };
      });
    } else {
      const names = {}, order = [];
      entries.forEach(function (r) { const n = norm(r.e.profession); if (!n) return; if (!names[n]) { names[n] = { label: String(r.e.profession).trim(), rows: [] }; order.push(n); } names[n].rows.push(r); });
      pills = order.map(function (n) { return { k: n, label: names[n].label, off: false, people: asPeople(bestPer(names[n].rows)) }; })
        .sort(function (a, b) { return b.people.length - a.people.length || (a.label < b.label ? -1 : a.label > b.label ? 1 : 0); });
    }
    const list = asPeople(rows);
    return { k: t.k, label: t.label, off: list.length === 0, people: list, pills: pills };
  });
}
const PROS187_CSS = __ff_css("styles/pros187.css");

/* Our professionals: four tiles, nothing chosen until a person taps one. Left and right select; the page only scrolls up and down. */
function ProsBrowse20({ onPick }) {
  const everyone = useDirectory();
  const tiles = proTiles187(everyone);
  /* v1.187: the chosen tile and, per tile, the chosen pill survive opening a profile and coming back. Tile and pill are never both required. */
  const [on, setOn0] = useState(function () { return (window.__ffNetSel && window.__ffNetSel.on) || ""; });
  const [psub, setPsub0] = useState(function () { return (window.__ffNetSel && window.__ffNetSel.psub) || {}; });
  const setOn = function (v) { window.__ffNetSel = Object.assign({}, window.__ffNetSel, { on: v }); setOn0(v); };
  const setPsub = function (v) { window.__ffNetSel = Object.assign({}, window.__ffNetSel, { psub: v }); setPsub0(v); };
  const tile = tiles.find(function (x) { return x.k === on && !x.off; }) || null;
  const pill = tile ? (tile.pills.find(function (x) { return x.k === psub[tile.k] && !x.off; }) || null) : null;
  const pickTile = function (k) {
    if (tile && tile.k === k) { setPsub(Object.assign({}, psub, { [k]: "" })); setOn(""); } else setOn(k);
  };
  const pickPill = function (k) { setPsub(Object.assign({}, psub, { [tile.k]: pill && pill.k === k ? "" : k })); };
  const shown = pill ? pill.people : tile ? tile.people : everyone;
  const items = tiles.map(function (x, i) {
    const d = PRO_TILES187[i];
    const nm = d.icons.find(function (n) { return window.lucide && window.lucide.icons && window.lucide.icons[n]; }) || d.icons[0];
    return { k: x.k, label: x.label, icon: netIc20(nm, 26), count: x.people.length, disabled: x.off };
  });
  return React.createElement("div", { className: "ff-br20 ff-pros187" },
    React.createElement("style", null, PROS187_CSS),
    React.createElement(CatBoxes20, { label: "Types of professional", active: tile ? tile.k : "", onPick: pickTile, items: items }),
    tile ? React.createElement("div", { className: "ff-dr20-mid ff-br20-pills", role: "tablist", "aria-label": tile.label + " types" },
      tile.pills.map(function (x) {
        const sel = !!pill && pill.k === x.k;
        return React.createElement("button", Object.assign({ key: x.k, type: "button", role: "tab", "aria-selected": sel, className: "ff-dr20-sub" + (sel ? " on" : "") + (x.off ? " off" : "") },
          x.off ? { disabled: true, "aria-disabled": "true" } : { onClick: function () { pickPill(x.k); } }),
          React.createElement("span", { className: "lb" }, x.label));
      })) : null,
    React.createElement(HScroll, { label: pill ? pill.label : tile ? tile.label : "Our professionals", snap: true, key: (tile ? tile.k : "") + "|" + (pill ? pill.k : "") },
      shown.map(function (p) { return React.createElement(PlayerTile, { key: p.id, person: p, onClick: function () { onPick(p); } }); })));
}

/* The FF Event Directory on the FF Team Network page: a box for each category, its sub-category pills, one row of Company Cards. */
function NetDirectory20(props) {
  const state = useStore().state;
  const every = browseCompanies17(state);
  const cats = NET_CO_TYPES17.map(function (t) {
    const inCat = every.filter(function (c) { return (c.cat || "bar") === t[0]; });
    const list = inCat.filter(function (c) { return !c.unclaimed; }).concat(inCat.filter(function (c) { return c.unclaimed; }));
    return { k: t[0], label: t[1], list: list };
  }).filter(function (x) { return x.list.length; });
  const [cat, setCat0] = useState(function () { return (window.__ffNetSel && window.__ffNetSel.cat) || ""; });
  const [sub, setSub0] = useState(function () { return (window.__ffNetSel && window.__ffNetSel.sub) || {}; });
  const setCat = function (v) { window.__ffNetSel = Object.assign({}, window.__ffNetSel, { cat: v }); setCat0(v); };
  const setSub = function (fn) { setSub0(function (o) { const n = typeof fn === "function" ? fn(o) : fn; window.__ffNetSel = Object.assign({}, window.__ffNetSel, { sub: n }); return n; }); };
  const cur = cats.find(function (x) { return x.k === cat; }) || cats[0];
  const heading = React.createElement(HeadRow20, { title: "FF Event Directory", k: "dir", desc: NET_DIR_DESC20, search: props.search, q: props.q });
  if (props.results) return React.createElement("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } }, React.createElement("style", null, NET20_CSS), heading, props.results);
  if (!cur) return null;
  const d = NET_DIR_TABS20[cur.k] || NET_DIR_TABS20.bar;
  const groups = {};
  cur.list.forEach(function (c) { const k = dirTabOf20(c, cur.k); (groups[k] = groups[k] || []).push(c); });
  const tabs = d.tabs.filter(function (t) { return (groups[t.k] || []).length; });
  const tcur = tabs.find(function (t) { return t.k === sub[cur.k]; }) || tabs[0];
  return React.createElement("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } },
    React.createElement("style", null, NET20_CSS),
    heading,
    React.createElement(FeaturedCos20, null),
    React.createElement("div", { className: "ff-br20" },
      React.createElement(CatBoxes20, { label: "Types of company", active: cur.k, onPick: setCat, items: cats.map(function (x) { return { k: x.k, label: x.label, icon: catIcon17(x.k), count: x.list.length }; }) }),
      tabs.length > 1 ? React.createElement("div", { className: "ff-dr20-mid ff-br20-pills", role: "tablist", "aria-label": cur.label + " types" },
        tabs.map(function (t) {
          const on = tcur && tcur.k === t.k;
          return React.createElement("button", { key: t.k, type: "button", role: "tab", "aria-selected": on, className: "ff-dr20-sub" + (on ? " on" : ""),
            onClick: function () { setSub(Object.assign({}, sub, { [cur.k]: t.k })); } },
            React.createElement("span", { className: "lb" }, t.label), React.createElement("span", { className: "ct" }, "(" + groups[t.k].length + ")"));
        })) : null,
      React.createElement(HScroll, { loose: true, label: tcur ? tcur.label : cur.label, key: cur.k + (tcur ? tcur.k : "") }, (tcur ? groups[tcur.k] : cur.list).map(function (co) { return React.createElement(CoTile20, { key: co.id, co: co }); }))));
}

const NET_DIR_DESC20 = "Find the companies you want to work for or work with. UK bar companies, DJs, caterers and event services, a list that keeps growing, with contact details, so you can find support for your own events, find out more and register your interest.";
const NET_MAP_DESC20 = "Everyone in events and hospitality, on one UK map. Our goal is to put you on it and get you jobs where you want to go.";

/* The map on its own (the Explore by area drop-downs stay on the other pages). v1.187: the search lives in the two heading rows, not here. */
function NetMap20() {
  return React.createElement("section", { id: "ff-netmap", style: { marginTop: 0, scrollMarginTop: 70 } },
    React.createElement("div", { className: "ff-nm20" },
      React.createElement("div", { className: "ff-nm20-l" },
        React.createElement(LinedHead20, { tag: "h1", title: "Explore our network", k: "page" }),
        React.createElement("p", { className: "ff-hr20-d" }, NET_MAP_DESC20)),
      React.createElement("div", { className: "ff-nm20-r" },
        React.createElement(FFMap, { mode: "network" }))));
}


/* The map section on its own. */
function netMapOnly20(props) {
  return props.after || null;
}


/* v1.115 Hero Flow (Spotlight): the featured row. One card sits large in the middle, its neighbours step back; swipe or
   scroll sideways to bring the next one forward. Used for Featured professionals and Featured companies only. */
function HeroFlow20(props) {
  const items = React.Children.toArray(props.children).filter(Boolean);
  const ref = React.useRef(null);
  const lastAt = React.useRef(-1);
  const paint = function () {
    const r = ref.current; if (!r) return;
    const mid = r.getBoundingClientRect().left + r.clientWidth / 2;
    let best = 0, bestD = 1e9;
    Array.prototype.forEach.call(r.children, function (c, ci) {
      const b = c.getBoundingClientRect();
      const raw = Math.abs(b.left + b.width / 2 - mid);
      if (raw < bestD) { bestD = raw; best = ci; }
      const d = Math.min(1, raw / Math.max(1, b.width * 1.4));
      c.style.setProperty("--hf-s", (1 - d * 0.2).toFixed(3));
      c.style.setProperty("--hf-o", (1 - d * 0.5).toFixed(3));
      c.style.zIndex = String(10 - Math.round(d * 9));
    });
    /* v1.162: onIndex tells the page which card is in the middle (the Packages tab shows that card's terms). */
    if (props.onIndex && best !== lastAt.current) { lastAt.current = best; props.onIndex(best); }
  };
  React.useEffect(function () {
    const r = ref.current; if (!r) return;
    const first = r.children[0];
    paint();
    let raf = 0;
    const on = function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(paint); };
    r.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const t = setTimeout(paint, 300);
    return function () { r.removeEventListener("scroll", on); window.removeEventListener("resize", on); clearTimeout(t); cancelAnimationFrame(raf); };
  }, [items.length]);
  const centre = function (e, i) {
    const r = ref.current, c = r && r.children[i]; if (!c) return;
    const mid = r.getBoundingClientRect().left + r.clientWidth / 2, b = c.getBoundingClientRect();
    if (Math.abs(b.left + b.width / 2 - mid) > b.width * 0.35) { /* v1.186 (Alex 21 Nov): a Sign up button works on the first tap, also on a card that is not in the middle (the card still slides to the middle). */ if (!(e.target && e.target.closest && e.target.closest(".ff-pkc-go"))) { e.preventDefault(); e.stopPropagation(); } r.scrollTo({ left: r.scrollLeft + (b.left + b.width / 2 - mid), behavior: "smooth" }); }
  };
  return React.createElement("div", { className: "ff-hf20", ref: ref, role: "list", "aria-label": props.label },
    items.map(function (c, i) { return React.createElement("div", { className: "ff-hf20-i", role: "listitem", key: i, onClickCapture: function (e) { centre(e, i); } }, c); }));
}

function FeaturedCos20() {
  const state = useStore().state;
  const { dispatch } = useStore();
  const all = browseCompanies17(state);
  const pool0 = all.filter(function (c) { return !c.unclaimed; }).concat(all.filter(function (c) { return c.unclaimed && (c.logo || (c.mediaList || []).length); }));
  /* v1.162: a type of company with no logo yet still gets into the mix, so the featured row shows every type. */
  const have = {}; pool0.forEach(function (c) { have[c.cat || "bar"] = true; });
  const pool = pool0.concat(all.filter(function (c) { return c.unclaimed && !have[c.cat || "bar"]; }));
  /* v1.145 (Alex 20 Nov 04:12): a random selection of eight, drawn afresh each time the page opens.
     v1.162 (Alex 20 Nov 05:15): a mix of every type of company, not just bars: shuffle, then take one from each type in turn. */
  const list = React.useMemo(function () {
    const a = pool.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; }
    const by = {}; a.forEach(function (c) { const k = c.cat || "bar"; (by[k] = by[k] || []).push(c); });
    const keys = Object.keys(by).sort(function () { return Math.random() - 0.5; });
    const out = [];
    for (let r = 0; out.length < 8 && keys.some(function (k) { return by[k].length > r; }); r++) {
      keys.forEach(function (k) { if (out.length < 8 && by[k][r]) out.push(by[k][r]); });
    }
    return out.sort(function () { return Math.random() - 0.5; });
  }, [pool.map(function (c) { return c.id; }).join("|")]);
  if (list.length < 2) return null;
  return React.createElement("section", { id: "ff-featured-cos", className: "ff-hf20-sec" },
    React.createElement("h3", { className: "ff-hf20-h" }, "Featured companies"),
    React.createElement(HeroFlow20, { label: "Featured companies" }, list.map(function (co) {
      return React.createElement("button", { key: co.id, type: "button", className: "ff-co11-tile", "aria-label": co.name, onClick: function () { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); } }, React.createElement(CompanyCardFace, { c: co, size: "sm" }));
    })));
}
