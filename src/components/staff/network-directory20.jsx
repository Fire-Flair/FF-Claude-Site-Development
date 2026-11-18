/* src/components/staff/network-directory20.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
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


/* Venues, five tabs by Google type. A venue typed by hand (no type) goes under Event venues. */
const NET_VEN_TABS20 = [
  { k: "bars", label: "Cocktail bars", icon: "Martini", types: ["cocktail_bar", "bar", "pub", "wine_bar"] },
  { k: "hotels", label: "Hotels", icon: "Building2", types: ["hotel", "lodging"] },
  { k: "food", label: "Restaurants", icon: "UtensilsCrossed", types: ["restaurant", "cafe", "food"] },
  { k: "events", label: "Event venues", icon: "PartyPopper", types: ["event_venue", "wedding_venue", "banquet_hall"] },
  { k: "clubs", label: "Clubs & late bars", icon: "Music", types: ["night_club"] },
];


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


function venTabOf20(r) {
  const p = r && r.place;
  const list = p ? [p.primaryType].concat(p.types || []).filter(Boolean) : [];
  for (let i = 0; i < list.length; i++) {
    const t = NET_VEN_TABS20.find(function (x) { return x.types.includes(list[i]); });
    if (t) return t.k;
  }
  return "events";
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


/* One category of the FF Event Directory: a heading with its sub-category tabs, the companies of the open tab across. */
function DirSection20({ cat, title, list, open }) {
  const d = NET_DIR_TABS20[cat] || NET_DIR_TABS20.bar;
  const groups = {};
  list.forEach(function (c) { const k = dirTabOf20(c, cat); (groups[k] = groups[k] || []).push(c); });
  const tabs = d.tabs.filter(function (t) { return (groups[t.k] || []).length; });
  const [tab, setTab] = useState("");
  const cur = tabs.find(function (t) { return t.k === tab; }) || tabs[0];
  return React.createElement(Fold17, { shut: !open, id: "ff-dir-" + cat, icon: catIcon17(cat), title: title, count: list.length },
    list.length ? React.createElement(React.Fragment, null,
      tabs.length > 1 ? React.createElement(NetTabs20, { tabs: tabs, active: cur.k, onChange: setTab, label: title + " types", count: function (t) { return groups[t.k].length; } }) : null,
      React.createElement(HScroll, { label: cur ? cur.label : title, key: cur ? cur.k : "" }, (cur ? groups[cur.k] : []).map(function (co) { return React.createElement(CoTile20, { key: co.id, co: co }); })))
      : React.createElement("p", { className: "ff-body ff-muted", style: { margin: 0 } }, "No companies listed yet."));
}


/* The FF Event Directory on the FF Team Network page: no Featured section; a claimed company comes first in its category. */
function NetDirectory20() {
  const state = useStore().state;
  const every = browseCompanies17(state);
  return React.createElement("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } },
    React.createElement("style", null, NET20_CSS),
    React.createElement(BigHead20, { title: "FF Event Directory" }),
    NET_CO_TYPES17.map(function (t) {
      const inCat = every.filter(function (c) { return (c.cat || "bar") === t[0]; });
      const list = inCat.filter(function (c) { return !c.unclaimed; }).concat(inCat.filter(function (c) { return c.unclaimed; }));
      /* Netmap: a category shows once it has a company, and every Directory box is open by default (Alex's exception). */
      return list.length ? React.createElement(DirSection20, { key: t[0], cat: t[0], title: t[1], list: list, open: true }) : null;
    }));
}


/* Every venue the members listed, once each, with the members who listed it. */
function netVenues20(state) {
  const by = {};
  venueEntries17(state, false).filter(function (x) { return x.by.kind === "person"; }).forEach(function (x) {
    const k = x.rec.place && x.rec.place.id ? x.rec.place.id : "n:" + String(x.rec.name).trim().toLowerCase();
    const v = by[k] || (by[k] = { key: k, rec: x.rec, by: [] });
    if (!v.by.some(function (b) { return b.id === x.by.id; })) v.by.push(x.by);
  });
  return Object.values(by).sort(function (a, b) { return a.rec.name.localeCompare(b.rec.name); });
}


function NetVenues20() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const list = netVenues20(state);
  const [tab, setTab] = useState("");
  const tabs = NET_VEN_TABS20.filter(function (t) { return list.some(function (v) { return venTabOf20(v.rec) === t.k; }); });
  const cur = tabs.find(function (t) { return t.k === tab; }) || tabs[0];
  const shown = cur ? list.filter(function (v) { return venTabOf20(v.rec) === cur.k; }) : [];
  return React.createElement("section", { id: "ff-venues", style: { marginTop: 30, scrollMarginTop: 70 } },
    React.createElement("style", null, NET20_CSS), React.createElement("style", null, RANK_CSS17),
    React.createElement(BigHead20, { title: "Venues" }),
    list.length ? React.createElement(React.Fragment, null,
      tabs.length > 1 ? React.createElement(NetTabs20, { tabs: tabs, active: cur.k, onChange: setTab, label: "Venue types", count: function (t) { return list.filter(function (v) { return venTabOf20(v.rec) === t.k; }).length; } }) : null,
      React.createElement(HScroll, { label: cur.label, key: cur.k }, shown.map(function (v) {
        return React.createElement("div", { key: v.key, className: "ff-vt20" },
          React.createElement(VenueCard19, { record: v.rec }),
          React.createElement("span", { className: "lb" }, "Listed by"),
          React.createElement("span", { className: "by", role: "list", "aria-label": "Listed by" }, v.by.map(function (b) {
            const p = all.find(function (x) { return x.id === b.id; });
            return React.createElement("button", { key: b.id, type: "button", role: "listitem", "aria-label": b.name + ": open their profile", onClick: function () { dispatch({ type: "VIEW", id: b.id }); window.scrollTo(0, 0); } },
              React.createElement(Portrait, { src: p && p.photo, name: b.name, size: 32, tier: p && p.tier }));
          }))); })))
      : React.createElement("p", { className: "ff-body ff-muted", style: { margin: 0 } }, "No venues added yet."));
}


/* The map on its own (the Explore by area drop-downs stay on the other pages). */
function NetMap20(props) {
  const search = props && props.search;
  return React.createElement("section", { id: "ff-netmap", style: { marginTop: 22, scrollMarginTop: 70 } },
    React.createElement(BigHead20, { title: "Explore our network" }),
    search ? React.createElement("div", { id: "ff-net-search", className: "ff-netsrch20", style: { margin: "0 0 14px", scrollMarginTop: 70 } }, search) : null,
    React.createElement(FFMap, { mode: "network" }));
}


/* Netmap: FF Team's map section with the network search placed under its heading (the search is at the top of the page). */
function netMapWithSearch20(props) {
  const after = props.after;
  if (!after) return props.search ? React.createElement("section", { id: "ff-net-search", style: { marginTop: 18 } }, props.search) : null;
  return after.type === NetMap20 ? React.cloneElement(after, { search: props.search }) : React.createElement(React.Fragment, null, props.search, after);
}
