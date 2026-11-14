/* src/utils/routes17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   ADDRESSES — one router for the pages people can open and share.

   The artifact is one file, so the prototype address is a hash route
   (#/ff-party/sammy). The live sites use real paths (ffparty.uk/sammy).
   docs/URLS.md lists every address in both forms.

   This module owns:
     rt17Parse(hash)       hash -> route
     rt17Href(route)       route -> hash
     rt17Target(state)     what the address should be for what is on screen
     rt17Apply(route, ...) opens the screen an address names
     Routes17              mounted once in App: loads, Back and Forward, and
                           writes the address when the visible screen changes

   Left to their own routers (this one ignores their addresses):
     #/<site>/areas/...    FdRoute11   (find-directory.jsx)
     #/ff-party/packages   PkgRoute18  (package-pages.jsx)
     /support/book-a-call  SupportRoute20
     #/<site>/home/<pillar> DiscoverHub11 (open section on a home page)
   Stories open in the reader (Journal17) and use #/<site>/stories/<slug>
   through rt17Parse and rt17Go.
   ========================================================================== */
const RT17_SITE_BY_PREFIX = { "ff-party": "party", "ff-team": "team", "ff-staff": "staff" };
const RT17_PREFIX = { party: "ff-party", team: "ff-team", staff: "ff-staff" };
/* First segments that can never be a tag or a company slug. */
const RT17_RESERVED = ["network", "browse", "bookings", "book", "profile", "party", "areas", "packages", "stories", "vip", "team", "staff", "admin", "login", "home"];
const RT17_TAB_WORD = { browse: "network", network: "network", book: "bookings", bookings: "bookings", party: "profile", profile: "profile" };
/* Profile tab words in the address, and the tab each one opens (people and companies name their tabs differently). */
const RT17_SUB_PERSON = { packages: "services", team: "teams", reviews: "reviews" };
const RT17_SUB_COMPANY = { packages: "qa", team: "team", reviews: "reviews" };
const RT17_WORD_PERSON = { services: "packages", teams: "team", reviews: "reviews" };
const RT17_WORD_COMPANY = { qa: "packages", team: "team", reviews: "reviews" };

const RT17_SITE_OF_KIND = (k) => (k === "party" || k === "staff" ? k : "team");
const rt17Reserved = (w) => RT17_RESERVED.includes(String(w || "").toLowerCase());
const rt17Slug = (co) => String((co && (co.slug || cx17Slug(co.name || ""))) || "").toLowerCase();


/* ---- hash <-> route ------------------------------------------------------ */
function rt17Parse(hash) {
  const h = String(hash || "");
  if (h === "" || h === "#" || h === "#/") return { kind: "root" };
  const m = /^#\/(ff-party|ff-team|ff-staff)(?:\/(.*))?$/i.exec(h);
  if (!m) return { kind: "foreign" };
  const site = RT17_SITE_BY_PREFIX[m[1].toLowerCase()];
  let segs = [];
  try { segs = String(m[2] || "").split("/").filter(Boolean).map(s => decodeURIComponent(s)); } catch (e) { return { kind: "home", site }; }
  if (!segs.length) return { kind: "home", site };
  const s0 = segs[0].toLowerCase(), s1 = (segs[1] || "").toLowerCase();
  if (s0 === "areas") return { kind: "other", site };
  if (s0 === "packages") return site === "party" ? { kind: "other", site } : { kind: "home", site };
  if (s0 === "home") return { kind: "pillar", site };
  if (s0 === "stories") return /^[a-z0-9-]{1,120}$/.test(s1) ? { kind: "stories", site, slug: s1 } : { kind: "home", site };
  if (RT17_TAB_WORD[s0]) return { kind: "tab", site, tab: RT17_TAB_WORD[s0] };
  if (rt17Reserved(s0) || !/^[a-z0-9-]{1,40}$/.test(s0)) return { kind: "home", site };
  return { kind: "entity", site, key: s0, sub: s1 };
}


function rt17Href(r) {
  if (!r || r.kind === "root") return "";
  const base = "#/" + RT17_PREFIX[r.site];
  if (r.kind === "home") return base;
  if (r.kind === "tab") return base + "/" + r.tab;
  if (r.kind === "stories") return base + "/stories/" + r.slug;
  if (r.kind === "person" || r.kind === "company") return base + "/" + r.key + (r.sub ? "/" + r.sub : "");
  return base;
}


/* ---- state -> address ---------------------------------------------------- */
function rt17SiteOf(state) {
  if (state.role === "team") return "team";
  if (state.role === "staff") return state.site === "party" ? "party" : "staff";
  return "team";        /* signed-out Home and the guest Network are the FF Team public pages */
}


function rt17People(state) {
  try { return ffSeoPeople(state); } catch (e) { return []; }
}


function rt17PersonTag(state, p) {
  if (!p) return "";
  if (p.id === "me") return state.auth && state.auth.status === "signedIn" ? String(state.auth.tag || state.session.tag || "").toLowerCase() : "";
  return String(p.tag || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}


function rt17Companies(state) {
  try { return companyList(state) || []; } catch (e) { return []; }
}


/* The address for what is on screen: a hash string, or null when another router owns the screen
   or the screen has no address (a Directory entry leaves the address as it was). */
function rt17Target(state) {
  if (state.supportPage20 || state.pkgPage || state.fdArea) return null;
  if (state.role === "vip") return "";
  const site = rt17SiteOf(state);
  if (state.viewingCompany) {
    const co = companyById(state, state.viewingCompany);
    if (!co || co.unclaimed) return null;
    const key = rt17Slug(co);
    if (!key || rt17Reserved(key)) return null;
    const pt = state.ptab17 && state.ptab17.key === "c:" + co.id ? RT17_WORD_COMPANY[state.ptab17.tab] : "";
    return rt17Href({ kind: "company", site, key, sub: pt || "" });
  }
  if (state.viewing) {
    const p = rt17People(state).find(x => x && x.id === state.viewing);
    const key = rt17PersonTag(state, p);
    if (!key || rt17Reserved(key)) return null;
    const pt = state.ptab17 && state.ptab17.key === "p:" + p.id ? RT17_WORD_PERSON[state.ptab17.tab] : "";
    return rt17Href({ kind: "person", site, key, sub: pt || "" });
  }
  const tab = state.tab || "home";
  if (!state.role && tab === "home") return "";
  if (site === "party" && PARTY_LOCKED_TABS17.includes(tab)) return rt17Href({ kind: "home", site });
  if (tab === "network" || tab === "bookings" || tab === "profile") return rt17Href({ kind: "tab", site, tab });
  return rt17Href({ kind: "home", site });
}


/* ---- address -> screen --------------------------------------------------- */
/* Turns a parsed entity (a tag or a slug) into a person or a company, or sends it to the site home. */
function rt17Resolve(r, state) {
  if (r.kind !== "entity") return r;
  const p = rt17People(state).find(x => x && rt17PersonTag(state, x) === r.key);
  if (p) return { kind: "person", site: r.site, key: r.key, id: p.id, sub: RT17_WORD_PERSON[RT17_SUB_PERSON[r.sub]] || "" };
  const co = rt17Companies(state).find(c => c && !c.unclaimed && rt17Slug(c) === r.key);
  if (co) return { kind: "company", site: r.site, key: r.key, id: co.id, sub: RT17_WORD_COMPANY[RT17_SUB_COMPANY[r.sub]] || "" };
  return { kind: "home", site: r.site };
}


function rt17Replace(hash) {
  try { if (window.location.hash !== hash) window.history.replaceState(window.history.state, "", hash || (window.location.pathname + window.location.search)); } catch (e) { /* ignore */ }
}


/* Opens the screen a parsed address names. Fixes the address first (unknown -> home, tag in lower case, locked tab -> home).
   Returns the address the screen will show once it is open (null: nothing to wait for). */
function rt17Apply(route0, state, dispatch) {
  let r = rt17Resolve(route0, state);
  if (r.kind === "foreign") return null;
  if (r.kind === "root" && state.role) r = { kind: "home", site: rt17SiteOf(state) };
  if (r.kind === "tab" && r.site === "party" && PARTY_LOCKED_TABS17.includes(r.tab)) r = { kind: "home", site: "party" };
  if (r.kind === "stories" && !(typeof V101 !== "undefined" && V101.storyKnown17 && V101.storyKnown17(r.slug))) r = { kind: "home", site: r.site };
  /* A story or an open home section keeps the address it was given; the screen underneath is that site's home. */
  const homeLike = r.kind === "stories" || r.kind === "pillar";
  const expect = r.kind === "other" ? null : homeLike ? rt17Href({ kind: "home", site: r.site }) : rt17Href(r);
  if (r.kind !== "other" && r.kind !== "pillar") rt17Replace(rt17Href(r));
  const away = { viewing: null, viewingAsGuest: false, viewingCompany: null, peek: null, ptab17: null };
  if (r.kind === "other") { dispatch({ type: "V11_SET", patch: away }); return null; }
  if (r.kind === "root") {
    dispatch({ type: "V11_SET", patch: { ...away, fdArea: null, pkgPage: null, supportPage20: null } });
    return null;
  }
  /* Signed out, the start page is already the FF Team home: switching role would remount it and close the open section. */
  if (r.kind === "pillar" && !state.role && r.site === "team") return null;
  const here = state.role === "vip" ? "" : state.role ? rt17SiteOf(state) : "";
  if (here !== r.site) {
    if (!p1SiteOpen(r.site)) return null;
    dispatch(r.site === "team" ? { type: "ROLE", role: "team" } : { type: "ROLE", role: "staff", site: r.site });
  }
  const clear = { ...away, fdArea: null, fdPreview: false, pkgPage: null, supportPage20: null };
  if (r.kind === "person") {
    dispatch({ type: "V11_SET", patch: { ...clear, viewing: r.id, viewingAsGuest: r.id === "me", ptab17: r.sub ? { key: "p:" + r.id, tab: RT17_SUB_PERSON[r.sub] } : null } });
  } else if (r.kind === "company") {
    dispatch({ type: "V11_SET", patch: { ...clear, viewingCompany: r.id, ptab17: r.sub ? { key: "c:" + r.id, tab: RT17_SUB_COMPANY[r.sub] } : null } });
  } else {
    const tab = r.kind === "tab" ? r.tab : "home";
    const isTeam = r.site === "team";
    dispatch({ type: "V11_SET", patch: clear });
    if (here !== r.site || (state.tab || "home") !== tab)
      dispatch({ type: "TAB", tab, route: isTeam ? (state.profile && state.profile.live ? "home" : undefined) : (tab === "home" ? "staffHome" : undefined) });
  }
  return expect;
}


/* Moves the address. Back to the entry before this one uses history.back so the list does not grow. */
function rt17Go(target, replace) {
  try {
    const cur = window.location.hash;
    if (cur === target) return;
    if (replace || cur.toLowerCase() === target.toLowerCase()) { rt17Replace(target); return; }
    const st = window.history.state;
    if (st && typeof st.ff17prev === "string" && st.ff17prev === target) { window.history.back(); return; }
    window.history.pushState({ ff17prev: cur }, "", target || (window.location.pathname + window.location.search));
  } catch (e) { /* ignore */ }
}


function Routes17() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  const boot = useRef(null);
  const mounted = useRef(false);
  const target = rt17Target(state);
  /* 1. Load on an address, and Back / Forward. */
  useEffect(() => {
    const open = (first) => {
      const r = rt17Parse(window.location.hash);
      if (r.kind === "foreign") return;
      if (r.kind === "root" && first) return;
      const t = rt17Apply(r, ref.current, dispatch);
      if (first && t) { boot.current = t; setTimeout(() => { boot.current = null; }, 1200); }
    };
    open(true);
    const pop = () => open(false);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  /* 2. Opening a profile or company from an area, package or support page closes that page. */
  const s = state;
  useEffect(() => {
    if ((s.viewing || s.viewingCompany) && (s.fdArea || s.pkgPage || s.supportPage20)) dispatch({ type: "V11_SET", patch: { fdArea: null, fdPreview: false, pkgPage: null, supportPage20: null } });
  }, [s.viewing, s.viewingCompany]);
  useEffect(() => {
    if (!s.viewing && !s.viewingCompany && s.ptab17) dispatch({ type: "V11_SET", patch: { ptab17: null } });
    else if (s.ptab17 && s.ptab17.key !== "p:" + s.viewing && s.ptab17.key !== "c:" + s.viewingCompany) dispatch({ type: "V11_SET", patch: { ptab17: null } });
  }, [s.viewing, s.viewingCompany, s.ptab17]);
  /* 3. The address follows the screen. */
  useEffect(() => {
    /* The first run is the page loading: the address it arrived on is opened by effect 1, not rewritten. */
    if (!mounted.current) { mounted.current = true; return; }
    if (target === null) return;
    if (boot.current) { if (target === boot.current) boot.current = null; return; }
    const cur = window.location.hash;
    if (target === "" && !/^#\/ff-/i.test(cur)) return;
    rt17Go(target);
  }, [target]);
  return null;
}
