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
      const on = active === it.k;
      return React.createElement("button", { key: it.k, type: "button", role: "tab", "aria-selected": on, className: "ff-cb20-b" + (on ? " on" : ""), onClick: function (e) {
        onPick(it.k); const b = e.currentTarget, row = b.parentNode; if (row && row.scrollTo) row.scrollTo({ left: b.offsetLeft - (row.clientWidth - b.offsetWidth) / 2, behavior: "smooth" }); } },
        React.createElement("span", { className: "ic", "aria-hidden": "true" }, it.icon),
        React.createElement("span", { className: "lb" }, it.label),
        React.createElement("span", { className: "ct" }, it.count));
    }));
}

/* A Network heading with its words under it and, on a wide screen, the search on the right in line with the title. */
function HeadRow20({ title, k, desc, search, grab }) {
  const ref = useRef(null);
  /* Typing in one search box switches the page to the results view, which unmounts the box that had the cursor. The first heading's box takes the cursor over. */
  useEffect(function () {
    if (grab && window.__ffSrchFocus && ref.current) {
      const i = ref.current.querySelector("textarea,input");
      if (i) { i.focus(); const n = (i.value || "").length; try { i.setSelectionRange(n, n); } catch (e) { /* not a text field */ } }
    }
  }, []);
  return React.createElement("div", { className: "ff-hr20", ref: ref },
    React.createElement("div", { className: "ff-hr20-l" },
      React.createElement(LinedHead20, { title: title, k: k }),
      desc ? React.createElement("p", { className: "ff-hr20-d" }, desc) : null),
    search ? React.createElement("div", { className: "ff-hr20-s", onFocusCapture: function () { window.__ffSrchFocus = true; }, onBlurCapture: function (e) { if (document.body.contains(e.target)) window.__ffSrchFocus = false; } }, search) : null);
}

/* Our professionals: the same way as the Directory. One box per type of professional, one row of Player Cards below. */
function ProsBrowse20({ onPick }) {
  const everyone = useDirectory();
  const kindOf = function (g) { return (PRO_TYPES17.find(function (t) { return t[2] === g; }) || ["other"])[0]; };
  const lists = PRO_TYPES17.map(function (t) {
    const k = t[0], label = t[1];
    const list = everyone.map(function (p, i) { return [p, (p.groups || [{ group: p.group, profession: p.profession, rank: 0 }]).find(function (x) { return kindOf(x.group) === k; }), i]; })
      .filter(function (r) { return r[1]; }).sort(function (a, b) { return a[1].rank - b[1].rank || a[2] - b[2]; }).map(function (r) { return plateAs17(r[0], r[1].profession); });
    return { k: k, label: label, list: list, icon: React.createElement(GroupIcon, { group: t[2] }) };
  }).filter(function (x) { return x.list.length; });
  const [on, setOn] = useState("");
  const cur = lists.find(function (x) { return x.k === on; }) || lists[0];
  if (!cur) return null;
  return React.createElement("div", { className: "ff-br20" },
    React.createElement(CatBoxes20, { label: "Types of professional", active: cur.k, onPick: setOn, items: lists.map(function (x) { return { k: x.k, label: x.label, icon: x.icon, count: x.list.length }; }) }),
    React.createElement(HScroll, { label: cur.label, snap: true, key: cur.k }, cur.list.map(function (p) { return React.createElement(PlayerTile, { key: p.id, person: p, onClick: function () { onPick(p); } }); })));
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
  const [cat, setCat] = useState("");
  const [sub, setSub] = useState({});
  const cur = cats.find(function (x) { return x.k === cat; }) || cats[0];
  if (!cur) return null;
  const d = NET_DIR_TABS20[cur.k] || NET_DIR_TABS20.bar;
  const groups = {};
  cur.list.forEach(function (c) { const k = dirTabOf20(c, cur.k); (groups[k] = groups[k] || []).push(c); });
  const tabs = d.tabs.filter(function (t) { return (groups[t.k] || []).length; });
  const tcur = tabs.find(function (t) { return t.k === sub[cur.k]; }) || tabs[0];
  return React.createElement("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } },
    React.createElement("style", null, NET20_CSS),
    React.createElement(HeadRow20, { title: "FF Event Directory", k: "dir", desc: NET_DIR_DESC20, search: props && props.search }),
    React.createElement("div", { className: "ff-br20" },
      React.createElement(CatBoxes20, { label: "Types of company", active: cur.k, onPick: setCat, items: cats.map(function (x) { return { k: x.k, label: x.label, icon: catIcon17(x.k), count: x.list.length }; }) }),
      tabs.length > 1 ? React.createElement("div", { className: "ff-dr20-mid ff-br20-pills", role: "tablist", "aria-label": cur.label + " types" },
        tabs.map(function (t) {
          const on = tcur && tcur.k === t.k;
          return React.createElement("button", { key: t.k, type: "button", role: "tab", "aria-selected": on, className: "ff-dr20-sub" + (on ? " on" : ""),
            onClick: function () { setSub(Object.assign({}, sub, { [cur.k]: t.k })); } },
            React.createElement("span", { className: "lb" }, t.label), React.createElement("span", { className: "ct" }, "(" + groups[t.k].length + ")"));
        })) : null,
      React.createElement(HScroll, { label: tcur ? tcur.label : cur.label, key: cur.k + (tcur ? tcur.k : "") }, (tcur ? groups[tcur.k] : cur.list).map(function (co) { return React.createElement(CoTile20, { key: co.id, co: co }); }))));
}

const NET_DIR_DESC20 = "Find the companies you want to work for or work with. Around 150 UK bar companies, DJs, caterers and event services, with contact details, so you can find support for your own events, find out more and register your interest.";
const NET_MAP_DESC20 = "Everyone in events and hospitality, on one UK map. Our goal is to put you on it and get you jobs where you want to go.";

/* The map on its own (the Explore by area drop-downs stay on the other pages). */
function NetMap20(props) {
  const search = props && props.search;
  return React.createElement("section", { id: "ff-netmap", style: { marginTop: 0, scrollMarginTop: 70 } },
    React.createElement("div", { className: "ff-nm20" },
      React.createElement("div", { className: "ff-nm20-l" },
        React.createElement(LinedHead20, { tag: "h1", title: "Explore our network", k: "page" }),
        React.createElement("p", { className: "ff-hr20-d" }, NET_MAP_DESC20)),
      React.createElement("div", { className: "ff-nm20-r" },
        search ? React.createElement("div", { id: "ff-net-search", className: "ff-netsrch20", style: { margin: "0 0 14px", scrollMarginTop: 70 } }, search) : null,
        React.createElement(FFMap, { mode: "network" }))));
}


/* Netmap: FF Team's map section with the network search placed under its heading (the search is at the top of the page). */
function netMapWithSearch20(props) {
  const after = props.after;
  if (!after) return props.search ? React.createElement("section", { id: "ff-net-search", style: { marginTop: 18 } }, props.search) : null;
  return after.type === NetMap20 ? React.cloneElement(after, { search: props.search }) : React.createElement(React.Fragment, null, props.search, after);
}


/* The map section without the search, and the search on its own (v1.91: the search sits between Our professionals and the FF Event Directory). */
function netMapOnly20(props) {
  const after = props.after;
  return after && after.type === NetMap20 ? React.cloneElement(after, { search: null }) : (after || null);
}
function netSearch20(props) {
  return props.search ? React.createElement("div", { id: "ff-net-search", className: "ff-netsrch20", style: { margin: "22px 0 18px", scrollMarginTop: 70 } }, props.search) : null;
}
