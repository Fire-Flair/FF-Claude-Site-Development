/* src/components/shared/find-directory.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FRONT DOORS (v17.3.110) — location pages for FF Party, FF Team and FF Staff.

   One shared engine, three site intents. Developers: read docs/front-doors/ first.
   What is REAL in this prototype: the 1,000-route manifest, the area-page template,
   coverage matching and bounded parent fallback, the Explore by area disclosure,
   the "Ask us to find people" lead form, the admin queue and the per-(site, location)
   review / publish / index controls.
   What is SIMULATED: persistence (state.fd, saved with the rest of the preview's data),
   admin and customer notifications, the sitemap (previewed in FF Admin, not served), and
   the provider coverage (fixtures below). No page is marked operational or approved
   for search by default.

   FD_ROWS is the compact route manifest built from data/front-doors/launch_pages.json:
   [location id, name, kind, parent row (-1 = none), slug, lat, lng, country, ukScope].
   Kinds: c country, n UK nation, a area/county/unitary, b London borough, p town or city,
   h neighbourhood, r navigation hub, t continent. ukScope 1 = fallback stops at the nation.
   In production children are fetched on demand from the location table; this prototype
   ships the 1,000 prepared pages only, never the 47,990-record catalogue.
   ========================================================================== */
const FD_ROWS = __ff_json("content/data/fd-rows.json");


const FD_KIND_LABEL = { c: "Country", n: "Nation", a: "Area", b: "Borough", p: "Town or city", h: "Neighbourhood", r: "Hub", t: "Continent" };


const FD_NODES = (() => {
  const nodes = FD_ROWS.map((r, i) => ({ i, id: r[0], name: r[1], k: r[2], pi: r[3], slug: r[4], lat: r[5], lng: r[6], cc: r[7], uk: r[8] === 1, kids: [] }));
  nodes.forEach(n => { if (n.pi >= 0) nodes[n.pi].kids.push(n.i); });
  const pathOf = (n) => n.path || (n.path = (n.pi >= 0 ? pathOf(nodes[n.pi]) : "/areas") + "/" + n.slug);
  nodes.forEach(pathOf);
  nodes.forEach(n => n.kids.sort((a, b) => nodes[a].name.localeCompare(nodes[b].name)));
  return nodes;
})();


const FD_BY_ID = {}, FD_BY_PATH = {};


FD_NODES.forEach((n) => {
  FD_BY_ID[n.id] = n;
  FD_BY_PATH[n.path] = n;
});


const FD_DUP_NAMES = (() => { const c = {}; FD_NODES.forEach(n => { c[n.name] = (c[n.name] || 0) + 1; }); return c; })();


/* Valid alternate routes, redirected once to the preferred page. The kit's page_routing_aliases.json
   covers gazetteer records; these two are route-level aliases for duplicate-URL avoidance. */
const FD_PATH_ALIASES = { "/areas": "/areas/uk", "/areas/uk/england/london": "/areas/uk/england/greater-london", "/areas/worldwide/europe/united-kingdom": "/areas/uk" };


/* v17.4.6: alternate names and legacy paths from the catalogue build (scripts/build-locations.py). */
const FD_ALIASES = __ff_json("content/data/fd-aliases.json");


Object.assign(FD_PATH_ALIASES, FD_ALIASES.paths || {});


const FD_LONDON = "gn:2648110", FD_HERTS = "gn:2647043";


const fdParent = (n) => (n && n.pi >= 0 ? FD_NODES[n.pi] : null);


const fdAnc = (n) => { const out = []; let x = n, g = 0; while (x && g++ < 12) { out.push(x); x = fdParent(x); } return out; };


const fdLabel = (n) => (FD_DUP_NAMES[n.name] > 1 && fdParent(n) ? `${n.name}, ${fdParent(n).name}` : n.name);


const fdDesc = (n, acc) => { acc = acc || []; n.kids.forEach(i => { acc.push(FD_NODES[i]); fdDesc(FD_NODES[i], acc); }); return acc; };


const fdUnder = (n, id) => fdAnc(n).some(a => a.id === id);



const FD_SITES = {
  party: { key: "party", slug: "ff-party", name: "FF Party", domain: "ffparty.uk", origin: "https://ffparty.uk" },
  team:  { key: "team",  slug: "ff-team",  name: "FF Team",  domain: "ffteam.uk",  origin: "https://ffteam.uk" },
  staff: { key: "staff", slug: "ff-staff", name: "FF Staff", domain: "ffstaff.uk", origin: "https://ffstaff.uk" },
};


const FD_SITE_BY_SLUG = { "ff-party": "party", "ff-team": "team", "ff-staff": "staff" };


const fdSiteKey = (state) => state.role === "team" ? "team" : state.role === "staff" ? (state.site === "party" ? "party" : "staff") : "party";


const fdHref = (siteKey, path) => "#/" + FD_SITES[siteKey].slug + path;


const fdUrl = (siteKey, path) => FD_SITES[siteKey].origin + path;



/* Roles come from the real profession taxonomy (see DIRECTORY / professionCategory). */
const FD_ROLES = [
  { id: "bartender", label: "Bartender", re: /bartend|mixolog|flair/i, cat: "bar" },
  { id: "waiter", label: "Waiter or waitress", re: /waiter|waitress|silver service/i },
  { id: "dj", label: "DJ", re: /\bdj\b|saxophon/i, cat: "dj" },
  { id: "host", label: "Event host or MC", re: /\bhost\b|\bmc\b/i },
  { id: "photo", label: "Photographer", re: /photo/i, cat: "photo" },
  { id: "chef", label: "Chef or caterer", re: /chef|cater/i, cat: "cater" },
];


const FD_ROLE_LABEL = Object.fromEntries(FD_ROLES.map(r => [r.id, r.label]));



/* ---- Provider coverage ------------------------------------------------------------------------------
   Coverage is explicit and has two meanings, kept apart:
     whole: the provider serves everywhere beneath this location (Greater London covers Camden).
     sub:   the provider serves exactly these locations (Camden alone does not cover Fitzrovia).
   FIXTURES: the prototype's sample people only have loose region labels ("North London"), so
   FD_REGION and FD_PERSON_COV translate them into reviewed-looking coverage records. In production
   this is the professional's own confirmed work-location selection, never inferred from an address,
   CV or an AI suggestion. */
const FD_REGION = {
  "Central London": ["Westminster", "Camden", "City of London", "Islington", "Kensington and Chelsea", "Lambeth", "Southwark", "Tower Hamlets"],
  "North London": ["Barnet", "Enfield", "Haringey", "Islington", "Camden"],
  "East London": ["Hackney", "Tower Hamlets", "Newham", "Waltham Forest", "Redbridge"],
  "West London": ["Ealing", "Hammersmith and Fulham", "Hounslow", "Hillingdon", "Brent", "Kensington and Chelsea"],
  "South London": ["Lambeth", "Southwark", "Lewisham", "Greenwich", "Wandsworth", "Croydon"],
};


const FD_PERSON_COV = {
  stf_sam: { whole: [FD_LONDON] },
  stf_fre: { sub: [FD_HERTS] },
  stf_zar: { sub: ["gn:2638867", "gn:2647138"] },
};


let FD_BOROUGH_IDS = null;


const fdBoroughId = (name) => { if (!FD_BOROUGH_IDS) { FD_BOROUGH_IDS = {}; FD_BY_ID[FD_LONDON].kids.forEach(i => { FD_BOROUGH_IDS[FD_NODES[i].name] = FD_NODES[i].id; }); } return FD_BOROUGH_IDS[name]; };


const fdPersonCover = (p) => {
  const fx = FD_PERSON_COV[p.id] || {};
  const sub = new Set(fx.sub || []);
  (p.locations || []).forEach(l => (FD_REGION[l] || []).forEach(b => { const id = fdBoroughId(b); if (id) sub.add(id); }));
  /* v17.4.6: a profile's own coverage (ticked places by id, with exceptions) joins the fixtures. */
  const own = p.coverage || { whole: [], exc: [] };
  const exc = own.exc || [];
  const whole = [...new Set([...(fx.whole || []), ...(own.whole || [])])];
  return { whole, sub: [...sub].filter(id => !exc.includes(id)), exc, fixture: !own.whole || !own.whole.length };
};


/* Companies: their base location(s) from the Company Card seed. A base in Greater London counts as
   serving Greater London; elsewhere the nearest prepared town or area within 30 km is used. These are
   the owner-unconfirmed bases of unclaimed cards (see data/companies/README.md). */
const fdHav = (a, b, c, d) => { const p = Math.PI / 180, x = Math.sin((c - a) * p / 2) ** 2 + Math.cos(a * p) * Math.cos(c * p) * Math.sin((d - b) * p / 2) ** 2; return 12742 * Math.asin(Math.sqrt(x)); };


const FD_CO_CACHE = {};


const fdCompanyCover = (c) => {
  if (FD_CO_CACHE[c.id]) return FD_CO_CACHE[c.id];
  const whole = new Set();
  (c.locations || []).forEach(l => {
    if (l.lat >= 51.28 && l.lat <= 51.70 && l.lng >= -0.52 && l.lng <= 0.34) { whole.add(FD_LONDON); return; }
    let best = null;
    FD_NODES.forEach(n => { if (n.lat == null || (n.k !== "p" && n.k !== "a")) return; const d = fdHav(l.lat, l.lng, n.lat, n.lng); if (!best || d < best[0]) best = [d, n.id]; });
    if (best && best[0] < 30) whole.add(best[1]);
  });
  return (FD_CO_CACHE[c.id] = { whole: [...whole], sub: [], fixture: true });
};


const fdCoverNames = (cov) => {
  const exOf = (n) => (cov.exc || []).map(id => FD_BY_ID[id]).filter(m => m && fdUnder(m, n.id));
  const w = (cov.whole || []).map(id => FD_BY_ID[id]).filter(Boolean).map(n => { const ex = exOf(n); return n.name + (ex.length ? ` (not ${ex.slice(0, 2).map(m => m.name).join(", ")}${ex.length > 2 ? "…" : ""})` : " (whole area)"); });
  const s = (cov.sub || []).map(id => FD_BY_ID[id]).filter(Boolean).map(n => n.name);
  const all = [...w, ...s];
  return all.length > 3 ? all.slice(0, 3).join(", ") + " and " + (all.length - 3) + " more" : all.join(", ");
};


/* Does coverage include this exact location? whole = ancestor-or-self, sub = this very place, and an
   exclusion (v17.4.6: cov.exc) closer to the place than the ticked area wins. */
const fdCovers = (cov, node) => {
  if ((cov.sub || []).includes(node.id)) return true;
  const exc = cov.exc || [];
  for (const a of fdAnc(node)) { if (exc.includes(a.id)) return false; if ((cov.whole || []).includes(a.id)) return true; }
  return false;
};


/* Does coverage touch anything beneath (or at) this location? Used for parent pages and fallback. */
const fdServesWithin = (cov, node) => (cov.whole || []).concat(cov.sub || []).some(id => { const n = FD_BY_ID[id]; return n && fdUnder(n, node.id) && fdCovers(cov, n); })
  || (!!(cov.exc || []).length && (cov.whole || []).some(id => fdUnder(node, id)) && fdCovers(cov, node));



function fdProviders(state, people, roleId) {
  const role = FD_ROLES.find(r => r.id === roleId);
  const out = [];
  (people || []).forEach(p => {
    if (!p || !p.name || p.hidden || p.suspended || p.deleted) return;
    if (role && !role.re.test((p.profession || "") + " " + (p.group || ""))) return;
    out.push({ key: p.id, kind: "person", p, cov: fdPersonCover(p) });
  });
  companyList(state).forEach(c => {
    if (!c || c.mine) return;
    if (role && !(role.cat ? (c.cat || "bar") === role.cat : false) && !role.re.test((c.kind || "") + " " + (c.name || ""))) return;
    const cov = fdCompanyCover(c);
    if (cov.whole.length) out.push({ key: c.id, kind: "company", c, cov });
  });
  return out;
}


/* Exact coverage first. If nobody qualifies, climb the reviewed browsing tree, one bounded step at a
   time, and stop at the UK nation (UK places) or the country (everywhere else). The first parent with
   anyone is shown, labelled as a wider area. Never nearest-by-distance, never Europe-wide. */
function fdResults(state, node, people, roleId) {
  const all = fdProviders(state, people, roleId);
  const isDir = (x) => x.kind === "company" && x.c && x.c.unclaimed;
  const provs = all.filter((x) => !isDir(x));
  const exact = provs.filter(x => fdCovers(x.cov, node));
  const hasKids = node.kids.length > 0;
  const within = hasKids ? provs.filter(x => !exact.includes(x) && fdServesWithin(x.cov, node)) : [];
  let wider = [], scope = null;
  if (!exact.length && !within.length) {
    for (const a of fdAnc(node).slice(1)) {
      if (a.k === "r" || a.k === "t" || a.k === "c" && node.uk) break;
      const found = provs.filter(x => fdServesWithin(x.cov, a));
      if (found.length) { wider = found; scope = a; break; }
      if (a.k === "n" || a.k === "c") break;
    }
  }
  const person = (l) => l.filter(x => x.kind === "person"), comp = (l) => l.filter(x => x.kind === "company");
  const dir = all.filter((x) => isDir(x) && (fdCovers(x.cov, node) || (hasKids && fdServesWithin(x.cov, node))));
  return { exact, within, wider, scope, total: provs.length, exactPeople: person(exact), exactCos: comp(exact), dir };
}



/* ---- State: pages, markets, requests -------------------------------------------------------------- */
const FD_DEFAULT_PUBLISHED = new Set(["country:GB", "gn:6269131", "gn:2638360", "gn:2634895", "gn:3333122", "worldwide", "continent:EU", "country:FR", FD_LONDON, FD_HERTS, "gn:3333125", "gn:2655858", "gn:2647138", "gn:2638867"]);


/* Every place has a page (v17.3.125). Admin can still unpublish one. */
const fdDefaultPub = (n) => "published";


const FD_MODES = [["inactive", "Inactive"], ["interest_only", "Interest only"], ["recruiting", "Recruiting"], ["operational", "Operational"]];


const FD_STATUSES = [["new", "New"], ["triaged", "Triaged"], ["sourcing", "Sourcing"], ["options_found", "Options found"], ["contacted", "Contacted"], ["converted", "Converted"], ["closed", "Closed"], ["unable_to_fill", "Unable to fill"]];


const FD_STATUS_LABEL = Object.fromEntries(FD_STATUSES);


const fdOf = (state) => ({ pages: {}, markets: {}, sourcing: {}, requests: [], log: [], ...(state.fd || {}) });


const fdSet = (state, dispatch, patch) => dispatch({ type: "V11_SET", patch: { fd: { ...fdOf(state), ...patch } } });


const fdPageState = (fd, siteKey, n) => (fd.pages[siteKey + "|" + n.id]) || { pub: fdDefaultPub(n) };


/* Market mode per country and site. UK defaults to recruiting (not operational); France is the
   interest-only example. Hubs without a country inherit interest_only. Owners change these in FF Admin. */
const fdMarket = (fd, siteKey, n) => {
  const m = fd.markets[siteKey + "|" + (n.cc || "")];
  if (m) return m;
  if (n.cc === "GB" || n.id === "country:GB") return "recruiting";
  if (n.cc === "FR") return "interest_only";
  return n.cc ? "inactive" : "interest_only";
};


const fdSourcingOn = (fd, siteKey, mode) => siteKey !== "team" && (mode === "recruiting" || mode === "operational") && fd.sourcing[siteKey] !== false;



/* ---- Copy: one template, three intents ---------------------------------------------------------------- */
function fdCopyBase20(siteKey, node, ctx) {
  const X = fdLabel(node), nExact = ctx.nExact;
  const q = (question, answer) => ({ q: question, a: answer });
  if (siteKey === "team") {
    const live = ctx.mode === "recruiting" || ctx.mode === "operational";
    /* v17.4.6 page intent: "Bartending jobs in X". Real job listings appear only when FireFlair has them
       (none in this prototype), so the page leads with the sign-up and work journey. */
    return {
      title: live ? `Bartending jobs in ${X} — FF Team` : `FF Team in ${X} — join the network`,
      h1: live ? `Bartending and hospitality jobs in ${X}` : `FF Team in ${X}`,
      desc: `Bartending and hospitality work in ${X}: create a free FF Team Profile Card, add ${X} to the areas you cover and get shift requests from businesses and hosts.`,
      intro: [
        `Create your Profile Card, add ${X} to the areas you cover, and say which professions you're available for. Businesses booking shifts in ${X} and hosts planning parties find you, and every request comes to you on WhatsApp.`,
        nExact ? `${nExact === 1 ? "One professional has" : nExact + " professionals have"} chosen ${X} as somewhere they work.` : `Be one of the first professionals in ${X}: add ${X} to the areas you cover.`],
      cta: "Create your Profile Card", cta2: null, ask: null, ctaKind: "signup", ctaAfterFaq: true,
      /* v17.4.6.1: five area questions. This page recruits people into the network and is the landing page
         for individual job adverts, which carry the details of their own role and link to this area's page. */
      faq: [
        q(`Is FF Team recruiting in ${X}?`, `Yes. We’re actively building a hospitality network in ${X}. Create your Profile Card so event businesses can find you and hire you directly from your profile.`),
        q("What kind of event work can I do?", "Think cocktail parties, weddings, private dinners and corporate events. Add the roles you want to work in, from bartending and waiting to cooking and hosting."),
        q("How much could I earn on an event shift?", "Event shifts can offer strong rates. Each invitation shows the hourly rate and total shift pay before you decide."),
        q("When do event shifts come up?", "Shifts come up as events are planned. Add the areas you cover so businesses can find you for events you’d like to work."),
        q(`How do I get started in ${X}?`, "Create your free Profile Card, add your professions and work areas, then publish it so businesses can find you.")],
    };
  }
  if (siteKey === "staff") {
    /* v17.4.6 page intent: businesses hiring shift staff in X. */
    return {
      title: `Hire shift staff in ${X} — FF Staff`,
      h1: `Hire bar and event shift staff in ${X}`,
      desc: nExact ? `Hire bar and hospitality professionals who work in ${X}. Choose your people and book your shift with FireFlair.` : `Hire bar and hospitality staff for ${X}. Start an Event Card and choose your people with FireFlair.`,
      intro: [
        nExact ? `${nExact === 1 ? "One professional lists" : nExact + " professionals list"} ${X} as somewhere they work. Choose your people and start your booking.`
               : `Hire bar and hospitality professionals for ${X}. Start an Event Card with your date and place, and FireFlair shows the people who suit it.`,
        `Availability for your shift is confirmed when you book. Nothing is booked, reserved or charged when you start an Event Card.`],
      cta: nExact ? "See who works here" : "Hire staff", cta2: nExact ? "Hire staff" : null, ask: null, ctaKind: nExact ? "results" : "event",
      faq: [
        q(`Can we hire staff in ${X}?`, `Yes. Start an Event Card with your date and the roles you need, then choose your people.`),
        q("Who sees our Event Card?", `Only you and the people you choose to book. Your contact details are never put in a web address.`),
        q("How does booking work?", `Choose your package, choose your people and choose your add-ons. The details and terms are shown before anything is confirmed.`)],
    };
  }
  /* v17.4.6 page intent: "Hire a bartender in X". No date-specific availability is claimed here;
     availability comes from booking data when a date is chosen. */
  return {
    title: `Hire a bartender in ${X} | FF Party`,
    h1: `Hire a bartender in ${X}`,
    desc: nExact ? `Browse professionals who work in ${X} and plan your event with FireFlair.` : `Plan your party in ${X} with FireFlair. Start an Event Card and choose your package and your people.`,
    intro: [
      nExact ? `These professionals have said they work in ${X}. Choose someone to view their profile, then plan your event around them.`
             : `Plan your party in ${X}. Start an Event Card with your date, place and guests, and FireFlair shows the packages and people that suit it.`,
      `Availability for your date is confirmed when you book. Nothing is booked, reserved or charged when you start an Event Card.`],
    cta: nExact ? "See who works here" : "Plan your event", cta2: nExact ? "Plan your event" : null, ask: null, ctaKind: nExact ? "results" : "event",
    faq: [
      q(`Can I book a bartender in ${X}?`, `Yes. Start an Event Card with your date and place, choose your package, then choose your people and add-ons.`),
      q("Are the people shown free on my date?", `Not necessarily. Each person has said where they work. Availability for your date is confirmed when you book.`),
      q("What if the people shown are from a wider area?", `They are labelled with the area they actually cover. Whether they can work at your event is confirmed when you book.`),
      ...(ctx.hasUnclaimed ? [q("What is the FF Event Directory?", `The Directory lists bar and event companies with their public contact details, in one place. A listing is not an endorsement or a partnership, and Directory companies cannot be booked through FireFlair. FF companies are the companies that have joined and can be booked. A company can ask us to update or remove its listing.`)] : []),
      q("How does booking work?", `Choose your package, choose your people and choose your add-ons. The details and terms are shown before anything is confirmed.`)],
  };
}



/* Head metadata for an area page: self-canonical per site, robots from the (site, location) state. */
function fdSeo(state, people) {
  const a = state.fdArea; if (!a) return null;
  const siteKey = a.site || "party", site = FD_SITES[siteKey], node = FD_BY_PATH[a.path];
  if (!node) return { page: "area-404", title: "Page not found — FireFlair", description: "This area page does not exist.", canonical: fdUrl(siteKey, "/areas/uk"), robots: "noindex, nofollow", type: "website", jsonLd: null };
  const fd = fdOf(state), ps = fdPageState(fd, siteKey, node), mode = fdMarket(fd, siteKey, node);
  const sourcing = fdSourcingOn(fd, siteKey, mode);
  const res = fdResults(state, node, people || [], "");
  const copy = fdCopy(siteKey, node, { mode, sourcing, nExact: res.exactPeople.length, hasUnclaimed: false, ov: (adm17(state).copy || {})[siteKey + ":" + node.id] });
  const approved = ps.pub === "approved" && !FF_SEO.demoData;
  const robots = ps.pub === "prepared" ? "noindex, nofollow" : approved ? "index, follow" : "noindex, follow";
  const crumbs = fdAnc(node).reverse().filter(n => fdPageState(fd, siteKey, n).pub !== "prepared").map((n, i) => ({ "@type": "ListItem", position: i + 1, name: n.name, item: fdUrl(siteKey, n.path) }));
  const ld = [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }];
  /* FAQ markup is built from the same questions the page shows. */
  if ((copy.faq || []).length) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: copy.faq.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) });
  if (res.exactPeople.length && siteKey !== "staff") ld.push({ "@context": "https://schema.org", "@type": "CollectionPage", name: copy.h1, url: fdUrl(siteKey, node.path),
    mainEntity: { "@type": "ItemList", itemListElement: res.exactPeople.slice(0, 12).map((x, i) => ({ "@type": "ListItem", position: i + 1, url: FF_SEO.profileOrigin + "/" + (x.p.tag || x.p.id) })) } });
  if (sourcing) ld.push({ "@context": "https://schema.org", "@type": "Service", name: siteKey === "staff" ? `Hospitality staffing requests in ${fdLabel(node)}` : `Event staffing requests in ${fdLabel(node)}`, areaServed: { "@type": "Place", name: fdLabel(node) }, provider: { "@type": "Organization", name: "FireFlair" } });
  /* No JobPosting markup anywhere: FF Team pages are profile sign-up pages, not vacancies. */
  return { page: "area", title: ffSeoClip(copy.title, FF_SEO.title.max), description: ffSeoClip(copy.desc, FF_SEO.description.max), canonical: fdUrl(siteKey, node.path), robots, type: "website", jsonLd: ld };
}



/* ---- Navigation ---------------------------------------------------------------------------------------- */
function fdNav(dispatch, siteKey, path) {
  try { const u = fdHref(siteKey, path); if (window.location.hash !== u) window.history.pushState({ ff: "area" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { fdArea: { site: siteKey, path } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}


function fdClose(dispatch) {
  try { window.history.pushState(null, "", window.location.pathname + window.location.search); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { fdArea: null, fdPreview: false } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}


/* Keeps the address bar and the view in step: a direct #/ff-party/areas/... link opens the page, Back closes it. */
function FdRoute11() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  useEffect(() => {
    const read = () => {
      const m = /^#\/(ff-party|ff-team|ff-staff)(\/areas(?:\/[a-z0-9-]+)*)\/?$/i.exec(String(window.location.hash || ""));
      return m ? { site: FD_SITE_BY_SLUG[m[1].toLowerCase()], path: m[2].toLowerCase() } : null;
    };
    const sync = () => {
      const r = read(), cur = ref.current.fdArea;
      if (r) { if (!cur || cur.path !== r.path || cur.site !== r.site) dispatch({ type: "V11_SET", patch: { fdArea: r } }); }
      else if (cur) dispatch({ type: "V11_SET", patch: { fdArea: null, fdPreview: false } });
    };
    sync();
    window.addEventListener("popstate", sync); window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  return null;
}


const fdChain = (n) => fdAnc(n).slice(1).filter(a => a.k !== "r").reverse().map(a => a.name).join(", ");


function fdSearch(q) {
  const s = String(q || "").trim().toLowerCase();
  if (s.length < 2) return [];
  const rank = { a: 1, b: 1, p: 2, h: 3, n: 0, c: 0 };
  const al = Object.entries(FD_ALIASES.names || {}).filter(([k]) => k.includes(s)).map(([, id]) => id);
  return FD_NODES.filter(n => n.k !== "r" && n.k !== "t" && (n.name.toLowerCase().includes(s) || al.includes(n.id)))
    .sort((a, b) => (a.name.toLowerCase().startsWith(s) ? 0 : 1) - (b.name.toLowerCase().startsWith(s) ? 0 : 1) || (rank[a.k] - rank[b.k]) || a.name.localeCompare(b.name)).slice(0, 8);
}


const fdToday = () => { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date()); } catch (e) { return new Date().toISOString().slice(0, 10); } };



/* ---- "Ask us to find people" ---------------------------------------------------------------------------- */
function FdAsk11({ siteKey, node, kind, company, onDone }) {
  const { state, dispatch } = useStore();
  const fd = fdOf(state), site = FD_SITES[siteKey];
  const mode = node ? fdMarket(fd, siteKey, node) : "recruiting";
  const sourcing = fdSourcingOn(fd, siteKey, mode);
  const leadKind = sourcing ? "sourcing_request" : "expansion_interest";
  const team = siteKey === "team";
  const [f, setF] = useState({ loc: node ? fdLabel(node) : "", locId: node ? node.id : "", date: "", tbd: false, roles: [], email: "", phone: "", wa: false, name: "", brief: "", hc: "", hp: "" });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [sug, setSug] = useState([]);
  const busy = useRef(false);
  const set = (k, v) => setF(x => ({ ...x, [k]: v }));
  const venue = siteKey === "staff";
  const toggleRole = (id) => set("roles", f.roles.includes(id) ? f.roles.filter(x => x !== id) : [...f.roles, id]);
  const submit = async (e) => {
    e.preventDefault();
    if (busy.current) return;
    const er = {};
    if (!f.loc.trim()) er.loc = "Tell us where the event is.";
    if (!team && !f.tbd) { if (!f.date) er.date = "Choose the event date, or tick Date not decided."; else if (f.date < fdToday()) er.date = "That date has passed (UK time)."; }
    if (!f.roles.length) er.roles = "Choose at least one kind of professional.";
    const em = f.email.trim(), ph = f.phone.replace(/[^\d+]/g, "");
    if (!em && !ph) er.contact = "Give us an email address or a telephone number.";
    else if (em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) er.contact = "That email address doesn't look right.";
    else if (!em && ph.replace(/\D/g, "").length < 7) er.contact = "That telephone number looks too short.";
    if (f.wa && !ph) er.contact = er.contact || "Add a telephone number to use WhatsApp.";
    setErr(er);
    if (Object.keys(er).length) return;
    if (f.hp) { setDone({ ref: "FD-" + Math.random().toString(36).slice(2, 8).toUpperCase(), dupe: false }); return; }
    busy.current = true;
    const key = [siteKey, f.locId || f.loc.trim().toLowerCase(), [...f.roles].sort().join("+"), f.tbd ? "tbd" : f.date, em.toLowerCase(), ph].join("|");
    const cur = fdOf(state);
    const had = cur.requests.find(r => r.key === key);
    if (had) { setDone({ ref: had.ref, dupe: true }); busy.current = false; return; }
    const ref = "FD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const rec = {
      id: uid("lsr"), ref, key, kind: leadKind, siteKey, locationId: f.locId || null, locationText: f.loc.trim(),
      roles: f.roles, eventDate: team || f.tbd ? null : f.date, dateUndecided: !team && !!f.tbd, tz: "Europe/London",
      contact: { name: f.name.trim(), email: em, phone: f.phone.trim(), whatsappOk: !!(f.wa && ph) },
      headcount: f.hc.trim(), brief: f.brief.trim(), companyId: company ? company.id : null, companyName: company ? company.name : "",
      createdAt: new Date().toISOString(), status: "new", assignee: "", adminNote: "",
      sourcePath: node ? node.path : "", sourceSite: siteKey, notif: { admin: "simulated", ack: em ? "simulated email" : "simulated message", failed: false }, bookingId: null,
    };
    /* v17.4.6: interest is a Q&A answer first (int.area_expansion, option ids = roles, subject = the
       place); the lead queue entry carries its id (qaResponseId) and the same reference. */
    if (leadKind === "expansion_interest") {
      const r = await qaSubmit17(dispatch, { questionId: "int.area_expansion", account: qaAccount17(state), subjectId: rec.locationId || rec.locationText, optionIds: f.roles, text: rec.brief, contact: rec.contact, submissionRef: ref, visibility: "private", source: `${site.name} area page ${rec.sourcePath}` });
      if (!r.ok) { setErr({ contact: "That couldn't be saved. Try again." }); busy.current = false; return; }
      rec.qaResponseId = r.answer.id;
    }
    fdSet(state, dispatch, { requests: [rec, ...cur.requests], log: [{ at: rec.createdAt, by: "visitor", what: `${leadKind} ${ref}`, site: siteKey }, ...cur.log].slice(0, 200) });
    setDone({ ref, dupe: false });
    busy.current = false;
  };
  if (done) {
    return (
      <div className="ff-fd-done" role="status">
        <b>{sourcing ? "Request received." : "Thanks, we've noted your interest."}</b>
        <p>{done.dupe ? `We already have this request. ` : ""}Your reference is <b className="ref">{done.ref}</b>. {sourcing ? `Nothing is confirmed yet: no one has been booked or reserved, and you have not been charged. The FireFlair team will look for suitable people and contact you about the options${f.email || f.phone ? ` by ${f.email ? "email" : "telephone"}` : ""}.` : `FireFlair isn't taking requests here yet. We'll use your details only to tell you if that changes.`}</p>
        <p className="ff-fd-dev"><span className="ff-dev17 tag">DEV</span> Saved to the preview's data as a local_service_request. Admin and acknowledgement notifications are simulated; see FF Admin → Areas and requests.</p>
        {onDone && <Btn onClick={onDone}>Done</Btn>}
      </div>
    );
  }
  const tomorrow = fdToday();
  return (
    <form className="ff-fd-form" onSubmit={submit} noValidate aria-label={sourcing ? "Ask us to find people" : "Register interest"}>
      {company && <p className="ff-fd-co">You're asking about <b>{company.name}</b>. This company hasn't claimed its FireFlair card yet, so we'll contact them for you and pass your enquiry on.</p>}
      <label className="ff-fd-f"><span>{team ? "Where do you work?" : venue ? "Where is the shift or venue?" : "Where is the event?"}</span>
        <input value={f.loc} onChange={(e) => { set("loc", e.target.value); set("locId", ""); setSug(fdSearch(e.target.value)); }} autoComplete="off" aria-invalid={!!err.loc} />
        {sug.length > 0 && !f.locId && <ul className="ff-fd-sug" role="listbox" aria-label="Matching places">{sug.map(n => <li key={n.id}><button type="button" onClick={() => { setF(x => ({ ...x, loc: fdLabel(n), locId: n.id })); setSug([]); }}>{n.name}<small>{FD_KIND_LABEL[n.k]}{fdChain(n) ? " · " + fdChain(n) : ""}</small></button></li>)}</ul>}
        {!f.locId && f.loc.trim() && <em className="ff-fd-hint">We'll check this place with you if it isn't one we recognise.</em>}
        {err.loc && <em className="ff-fd-err">{err.loc}</em>}</label>
      {!team && <div className="ff-fd-two">
        <label className="ff-fd-f"><span>Date</span><input type="date" value={f.date} min={tomorrow} disabled={f.tbd} onChange={(e) => set("date", e.target.value)} aria-invalid={!!err.date} />
          {err.date && <em className="ff-fd-err">{err.date}</em>}</label>
        <label className="ff-fd-chk"><input type="checkbox" checked={f.tbd} onChange={(e) => set("tbd", e.target.checked)} /> Date not decided</label>
      </div>}
      <fieldset className="ff-fd-f"><legend>{team ? "What do you do?" : "Who do you need?"}</legend>
        <div className="ff-fd-chips">{FD_ROLES.map(r => <button type="button" key={r.id} className={f.roles.includes(r.id) ? "on" : ""} aria-pressed={f.roles.includes(r.id)} onClick={() => toggleRole(r.id)}>{r.label}</button>)}</div>
        {err.roles && <em className="ff-fd-err">{err.roles}</em>}</fieldset>
      <div className="ff-fd-two">
        <label className="ff-fd-f"><span>Email</span><input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" /></label>
        <label className="ff-fd-f"><span>Telephone</span><input type="tel" value={f.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" /></label>
      </div>
      {err.contact && <em className="ff-fd-err">{err.contact}</em>}
      <label className="ff-fd-chk"><input type="checkbox" checked={f.wa} onChange={(e) => set("wa", e.target.checked)} /> You may contact me on WhatsApp on this number</label>
      <p className="ff-fd-note">We use your details only to reply about this request. {f.email || !f.phone ? "We'll answer by email." : "We'll answer by telephone."}</p>
      <details className="ff-fd-opt"><summary>Add more detail (optional)</summary>
        <label className="ff-fd-f"><span>Your name</span><input value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" /></label>
        <label className="ff-fd-f"><span>How many people?</span><input value={f.hc} inputMode="numeric" onChange={(e) => set("hc", e.target.value.replace(/[^\d]/g, ""))} /></label>
        <label className="ff-fd-f"><span>Anything else we should know?</span><textarea rows={3} value={f.brief} onChange={(e) => set("brief", e.target.value)} /></label>
      </details>
      <input className="ff-fd-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.hp} onChange={(e) => set("hp", e.target.value)} />
      <Btn type="submit" variant="gold">{sourcing ? "Ask us to find people" : "Register interest"}</Btn>
      <p className="ff-fd-note">{sourcing ? `This sends a request to the FireFlair team. It doesn't book anyone, reserve anyone or take payment.` : `FireFlair isn't taking requests for this area yet, so this only registers your interest.`}</p>
    </form>
  );
}



/* ---- Explore by area (compact; sits above the map, separate from it) ------------------------------------ */
/* ---- Explore by area (v17.3.113): a short path under the map -----------------------------------------------
   UK > England > Greater London, or Worldwide > continent > country, then a slider of the people listed there.
   Every place keeps its own page (they are the entrance pages for search); the explorer only shows the main ones. */
const FD_WORLD_ORDER19 = ["europe", "north-america", "south-america", "asia", "middle-east", "africa", "oceania"];


const FD_TOP19 = {
  europe: ["france", "spain", "netherlands", "denmark", "germany", "italy", "portugal", "ireland", "belgium", "greece"],
  "north-america": ["united-states", "canada", "mexico", "jamaica", "barbados", "bahamas"],
  "south-america": ["brazil", "argentina", "colombia", "chile"],
  asia: ["japan", "singapore", "thailand", "india", "south-korea", "indonesia"],
  "middle-east": ["united-arab-emirates", "qatar", "saudi-arabia", "oman"],
  africa: ["south-africa", "morocco", "egypt", "kenya", "nigeria", "mauritius"],
  oceania: ["australia", "new-zealand"],
};


const FD_EAST19 = ["poland", "czechia", "slovakia", "hungary", "romania", "bulgaria", "croatia", "serbia", "slovenia", "estonia", "latvia", "lithuania", "ukraine", "moldova"];


(() => {
  const w = FD_BY_PATH["/areas/worldwide"];
  if (!w) return;
  w.kids.forEach((i) => FD_DEFAULT_PUBLISHED.add(FD_NODES[i].id));
  Object.keys(FD_TOP19).forEach((c) => {
    const cn = FD_BY_PATH["/areas/worldwide/" + c];
    if (!cn) return;
    FD_TOP19[c].concat(c === "europe" ? FD_EAST19 : []).forEach((s) => { const n = FD_BY_PATH[cn.path + "/" + s]; if (n) FD_DEFAULT_PUBLISHED.add(n.id); });
  });
})();


const FD_CSS19 = __ff_css("styles/fd-19.css");


/* "What areas do you cover?" — the explorer's area tree with a tick box at every level (FF Team location section, FF Staff company coverage).
   Ticking a place covers everything beneath it; a ticked parent replaces its ticked children. Saved as ordinary "locations" records. */
const FD_TICK_NAME19 = (n) => (n.id === "country:GB" ? "UK-wide" : n.id === "worldwide" ? "Worldwide" : fdLabel(n));


let FD_TICK_MAP19 = null;


const fdTickNode19 = (name) => {
  if (!FD_TICK_MAP19) { FD_TICK_MAP19 = {}; FD_NODES.forEach((n) => { const k = FD_TICK_NAME19(n).toLowerCase(); if (!FD_TICK_MAP19[k]) FD_TICK_MAP19[k] = n; }); FD_TICK_MAP19["united kingdom"] = FD_BY_ID["country:GB"]; FD_TICK_MAP19["greater london"] = FD_BY_ID[FD_LONDON]; Object.entries(FD_ALIASES.names || {}).forEach(([k, id]) => { if (!FD_TICK_MAP19[k] && FD_BY_ID[id]) FD_TICK_MAP19[k] = FD_BY_ID[id]; }); }
  return FD_TICK_MAP19[String(name || "").trim().toLowerCase()] || null;
};


const fdTickKids19 = (n) => {
  if (n.id === "worldwide") return FD_WORLD_ORDER19.map((s) => FD_BY_PATH["/areas/worldwide/" + s]).filter(Boolean);
  const kids = n.kids.map((i) => FD_NODES[i]);
  return kids.slice().sort((a, b) => (b.id === FD_LONDON) - (a.id === FD_LONDON) || a.name.localeCompare(b.name));
};


/* Explore by area (v17.4.6): the same tree as "What areas do you cover?", in links mode. Places are links to
   their area pages and branches expand on their own; the people listed in the last branch opened (Greater
   London to start with) show underneath, as before. */
function AreaExplorer11() {
  const h = React.createElement;
  const { state, dispatch } = useStore();
  const siteKey = fdSiteKey(state);
  const people = useDirectory();
  const [cur, setCur] = useState(() => FD_BY_ID[FD_LONDON] || FD_NODES[0]);
  const res = useMemo(() => fdResults(state, cur, people, ""), [state.directory, state.admin17, state.company, cur.id, people.length]);
  const tiles = res.exact.concat(res.within);
  const open = (e, n) => { e.preventDefault(); fdNav(dispatch, siteKey, n.path); };
  return h("section", { id: "ff-fd-explore", style: { marginTop: 22, scrollMarginTop: 70 } },
    h("style", null, FD_CSS19),
    h(Fold17, { id: "ff-fd-explore-f", icon: h(I11.MapPinned, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.6 }), title: "Explore by area", shut: true },
      h(CoverageTree17, { mode: "links", siteKey, compact: true, title: null, onOpen: setCur, startOpen: ["country:GB", "gn:6269131"] }),
      h("div", { className: "ff-ax19-head" }, h("h3", null, fdLabel(cur)),
        h("a", { className: "ff-ax19-open", href: fdHref(siteKey, cur.path), onClick: (e) => open(e, cur) }, tiles.length > 12 ? "See all " + tiles.length : tiles.length ? "See everyone in " + cur.name : "Open the " + cur.name + " page")),
      tiles.length > 0 && h(HScroll, { label: "People in " + fdLabel(cur), snap: true }, tiles.slice(0, 12).map((x) => h(FdResultTile11, { key: x.key, x, scope: res.within.includes(x) })))));
}


function FdResultTile11({ x, scope, onAsk }) {
  const { state, dispatch } = useStore();
  const cov = React.createElement("p", { className: "ff-fd-cov" }, React.createElement("b", null, scope ? "Covers: " : "Works in: "), fdCoverNames(x.cov) || "not stated");
  if (x.kind === "person") return React.createElement("div", { className: "ff-fd-res" }, React.createElement(PlayerTile, { person: x.p, onClick: () => dispatch({ type: "VIEW", id: x.p.id }) }), cov);
  const c = x.c;
  return React.createElement("div", { className: "ff-fd-res" }, React.createElement("button", { type: "button", className: "ff-co11-tile", onClick: () => dispatch({ type: "VIEW_COMPANY", id: c.id }) }, React.createElement(CompanyCardFace, { c, size: "sm" })), React.createElement("p", { className: "ff-fd-unc" }, c.unclaimed ? "FF Event Directory" : "FireFlair Partner"), cov);
}


function AreaPage11() {
  const { state, dispatch } = useStore();
  const a = state.fdArea || {}, siteKey = a.site || "party", site = FD_SITES[siteKey];
  const fd = fdOf(state);
  const people = useDirectory();
  const [role, setRole] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [askCo, setAskCo] = useState(null);
  const askRef = useRef(null);
  const go19 = () => { fdClose(dispatch); if (siteKey === "team") { if (state.role === "team") dispatch({ type: "TAB", tab: "profile" }); else dispatch({ type: "ROLE", role: "team" }); } else { dispatch({ type: "V11_SET", patch: { bkView: siteKey === "party" ? { mode: "new" } : { mode: "new", open: "event" } } }); dispatch({ type: "TAB", tab: "bookings" }); try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } } };
  const node = FD_BY_PATH[a.path];
  /* A valid alternate route is redirected once. */
  useEffect(() => {
    const to = FD_PATH_ALIASES[a.path];
    if (to) { try { window.history.replaceState({ ff: "area" }, "", fdHref(siteKey, to)); } catch (e) { /* ignore */ } dispatch({ type: "V11_SET", patch: { fdArea: { site: siteKey, path: to } } }); }
  }, [a.path]);
  useEffect(() => { setRole(""); setShowAll(false); setAskCo(null); }, [a.path, siteKey]);
  const res = useMemo(() => node ? fdResults(state, node, people, role) : null, [state.directory, state.admin17, state.company, a.path, role, people.length]);
  const back = <button type="button" className="ff-fd-back" onClick={() => fdClose(dispatch)}>← Back</button>;
  if (FD_PATH_ALIASES[a.path]) return <div className="ff-fd-page"><p>Redirecting…</p></div>;
  if (!node) {
    return (
      <main className="ff-fd-page" aria-labelledby="fd-h1">{back}
        <h1 id="fd-h1" className="ff-h1">We can't find that place</h1>
        <p>There's no {site.name} page at <code>{a.path}</code>. Real address checking returns a 404 for unknown places.</p>
        <Btn onClick={() => fdNav(dispatch, siteKey, "/areas/uk")}>Explore the UK</Btn>
      </main>);
  }
  const ps = fdPageState(fd, siteKey, node), mode = fdMarket(fd, siteKey, node), sourcing = fdSourcingOn(fd, siteKey, mode);
  const anc = fdAnc(node).reverse();
  const livePub = (n) => fdPageState(fd, siteKey, n).pub !== "prepared";
  const crumb = anc.filter(n => n.k !== "r" || livePub(n));
  if (ps.pub === "prepared" && !state.fdPreview) {
    return (
      <main className="ff-fd-page" aria-labelledby="fd-h1">{back}
        <h1 id="fd-h1" className="ff-h1">{fdLabel(node)}</h1>
        <p>{site.name} doesn't have a page for {fdLabel(node)} yet.</p>
        <Btn variant="gold" onClick={go19}>{siteKey === "team" ? "Create your Profile Card" : siteKey === "staff" ? "Hire staff" : "Plan your event"}</Btn>
        {fdParent(node) && livePub(fdParent(node)) && <p style={{ marginTop: 16 }}>Or look at <a href={fdHref(siteKey, fdParent(node).path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, siteKey, fdParent(node).path); }}>{fdLabel(fdParent(node))}</a>.</p>}
      </main>);
  }
  const hasUnclaimed = res.dir.length > 0;
  const nExact = res.exactPeople.length;
  const copy = fdCopy(siteKey, node, { mode, sourcing, nExact, hasUnclaimed, ov: (adm17(state).copy || {})[siteKey + ":" + node.id] });
  const scrollAsk = () => { setAskCo(null); try { askRef.current && askRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* ignore */ } };
  const goAsk = (c) => { setAskCo(c); try { askRef.current && askRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) { /* ignore */ } };
  const signup = () => { fdClose(dispatch); if (state.role === "team") dispatch({ type: "TAB", tab: "profile" }); else dispatch({ type: "ROLE", role: "team" }); };
  const cta = () => { if (copy.ctaKind === "signup") signup(); else if (copy.ctaKind === "results") { const el = document.getElementById("ff-fd-results"); el && el.scrollIntoView({ behavior: "smooth", block: "start" }); } else go19(); };
  const kidsLive = node.kids.map(i => FD_NODES[i]).filter(livePub);
  const sibs = fdParent(node) ? fdParent(node).kids.map(i => FD_NODES[i]).filter(n => n.id !== node.id && livePub(n)) : [];
  const CAP = 12;
  const list = (l) => (showAll ? l : l.slice(0, CAP));
  const hasAny = res.exact.length || res.within.length || res.wider.length || res.dir.length;
  const exactLabel = nExact || res.exactCos.length ? `${siteKey === "team" ? "Professionals who work in" : "Covering"} ${fdLabel(node)}` : "";
  const lk = (n, t) => <a href={fdHref(siteKey, n.path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, siteKey, n.path); }}>{t || fdLabel(n)}</a>;
  return (
    <main className="ff-fd-page" aria-labelledby="fd-h1">
      {back}
      {ps.pub === "prepared" && <div className="ff-fd-banner" role="note">Admin preview. This page isn't public yet: it has no advertised route and is excluded from the sitemap.</div>}
      <nav aria-label="Breadcrumb" className="ff-fd-crumb"><ol>{crumb.map((n, i) => <li key={n.id}>{i === crumb.length - 1 ? <span aria-current="page">{n.name}</span> : livePub(n) ? lk(n, n.name) : <span>{n.name}</span>}</li>)}</ol></nav>
      <div className="ff-eyebrow">{site.name}</div>
      <h1 id="fd-h1" className="ff-h1">{copy.h1}</h1>
      {copy.intro.map((t, i) => <p key={i} className="ff-fd-intro">{t}</p>)}
      {!copy.ctaAfterFaq && <div className="ff-fd-cta"><Btn variant="gold" onClick={cta}>{copy.cta}</Btn>
        {copy.cta2 && <button type="button" className="ff-fd-link" onClick={go19}>{copy.cta2}</button>}
        {siteKey === "staff" && <button type="button" className="ff-fd-link" onClick={() => dispatch({ type: "ROLE", role: "staff", site: "staff" })}>Create a company profile</button>}</div>}

      <section id="ff-fd-results" aria-labelledby="fd-res-h" style={{ marginTop: 26, scrollMarginTop: 70 }}>
        <div className="ff-fd-rhead"><h2 id="fd-res-h" className="ff-h2">{siteKey === "team" ? "Who works here" : "Professionals and companies"}</h2>
          <div className="ff-fd-chips" role="group" aria-label="Filter by profession (doesn't change the web address)">
            <button type="button" className={!role ? "on" : ""} aria-pressed={!role} onClick={() => setRole("")}>All</button>
            {FD_ROLES.map(r => <button type="button" key={r.id} className={role === r.id ? "on" : ""} aria-pressed={role === r.id} onClick={() => setRole(role === r.id ? "" : r.id)}>{r.label}</button>)}</div></div>
        {res.exact.length > 0 && <>
          <h3 className="ff-fd-h3">{exactLabel}</h3>
          <p className="ff-fd-sub">Each has said they work here. The event date still needs confirming.</p>
          <HScroll label={exactLabel} snap>{list(res.exact).map(x => <FdResultTile11 key={x.key} x={x} onAsk={goAsk} />)}</HScroll></>}
        {res.within.length > 0 && <>
          <h3 className="ff-fd-h3">Serving places within {fdLabel(node)}</h3>
          <p className="ff-fd-sub">This is an overview of people who work in parts of {fdLabel(node)}. Their cover is shown on each card; one place isn't the same as another.</p>
          <HScroll label={`Serving places within ${fdLabel(node)}`} snap>{list(res.within).map(x => <FdResultTile11 key={x.key} x={x} scope onAsk={goAsk} />)}</HScroll></>}
        {res.wider.length > 0 && <>
          <div className="ff-fd-wider" role="note"><b>Explore professionals across {fdLabel(res.scope)}</b>
            <p>Nobody lists {fdLabel(node)} as somewhere they work, so here are people who cover other places in {fdLabel(res.scope)}. This isn't a distance match. Whether they can work in {fdLabel(node)} needs checking{siteKey === "team" ? "" : ", and your request stays for " + fdLabel(node)}.</p></div>
          <HScroll label={`Professionals across ${fdLabel(res.scope)}`} snap>{list(res.wider).slice(0, 8).map(x => <FdResultTile11 key={x.key} x={x} scope onAsk={goAsk} />)}</HScroll></>}
        {(res.exact.length + res.within.length > CAP || res.wider.length > CAP) && !showAll && <button type="button" className="ff-fd-more" onClick={() => setShowAll(true)}>Show more</button>}
        {!hasAny && <div className="ff-fd-empty">
          <b>{role ? `No ${FD_ROLE_LABEL[role].toLowerCase()} lists ${fdLabel(node)} yet.` : `Nobody lists ${fdLabel(node)} yet.`}</b>
          <p>{siteKey === "team" ? `You could be the first. Create a Profile Card and choose ${fdLabel(node)} as a place you work.` : "Start an Event Card with your date and place, and FireFlair shows the packages and people that suit it."}</p></div>}
      </section>

      {res.dir.length > 0 && <section id="ff-fd-dir" aria-labelledby="fd-dir-h" style={{ marginTop: 26, scrollMarginTop: 70 }}>
        <h2 id="fd-dir-h" className="ff-h2">FF Event Directory</h2>
        <p className="ff-fd-sub">Companies listed from their public contact details. FF companies are the companies that have joined and can be booked through FireFlair.</p>
        <HScroll label={`FF Event Directory in ${fdLabel(node)}`} snap>{res.dir.slice(0, showAll ? 60 : 24).map(x => <FdResultTile11 key={x.key} x={x} />)}</HScroll>
      </section>}
      {copy.ask && <section id="ff-fd-ask" ref={askRef} className="ff-fd-card" aria-labelledby="fd-ask-h" style={{ scrollMarginTop: 70 }}>
        <h2 id="fd-ask-h" className="ff-h2">{sourcing ? (siteKey === "staff" ? `Need staff in ${fdLabel(node)}?` : `Need people for an event in ${fdLabel(node)}?`) : `Interested in ${fdLabel(node)}?`}</h2>
        <p className="ff-fd-sub">{sourcing ? `Tell us the date and the kind of professional you need. Our team will look for suitable people and contact you about the options.` : siteKey === "team" ? `Tell us where you work and what you do and we'll contact you if FF Team starts recruiting here.` : `FireFlair isn't taking requests here yet. Tell us what you'd need and we'll contact you if that changes.`}</p>
        <FdAsk11 key={siteKey + node.id + (askCo ? askCo.id : "")} siteKey={siteKey} node={node} company={askCo} />
      </section>}
      <section aria-labelledby="fd-how-h" style={{ marginTop: 26 }}><h2 id="fd-how-h" className="ff-h2">Questions</h2>
        {copy.faq.map(f => <details key={f.q} className="ff-fd-faq"><summary>{f.q}</summary><p>{f.a}</p></details>)}</section>
      {copy.ctaAfterFaq && <div className="ff-fd-cta" style={{ marginTop: 16 }}><Btn variant="gold" onClick={cta}>{copy.cta}</Btn></div>}

      {(kidsLive.length > 0 || sibs.length > 0) && <nav aria-label="Other places" className="ff-fd-links">
        {kidsLive.length > 0 && <><h2 className="ff-h2">Places in {fdLabel(node)}</h2><ul>{kidsLive.slice(0, 24).map(n => <li key={n.id}>{lk(n)}</li>)}</ul>{kidsLive.length > 24 && <p className="ff-fd-fine">and {kidsLive.length - 24} more</p>}</>}
        {sibs.length > 0 && fdParent(node) && <><h2 className="ff-h2">Other places in {fdLabel(fdParent(node))}</h2><ul>{sibs.slice(0, 12).map(n => <li key={n.id}>{lk(n)}</li>)}</ul></>}
      </nav>}
      <p className="ff-fd-dev"><span className="ff-dev17 tag">DEV · {site.name}</span> {ps.pub === "approved" ? "Approved for search" : ps.pub === "published" ? "Published for use: noindex, not in the sitemap" : "Prepared: preview only"} · market {FD_MODES.find(m => m[0] === mode)[1]} · canonical {fdUrl(siteKey, node.path)}{FF_SEO.demoData ? " · demo data, so the prototype emits noindex regardless" : ""}</p>
    </main>
  );
}



/* ---- FF Admin: requests queue, page review / publish / index, markets, sitemap preview ------------------- */
const FD_CHECKS = [
  ["geo", "The geography is accurate for this place"],
  ["cap", "FireFlair can actually serve or recruit here"],
  ["task", "The page has a working action for this site's visitor"],
  ["facts", "Every visible fact is reliable and supported"],
  ["distinct", "It is useful separately from its parent and sibling pages"],
];


function fdEvidence(state, siteKey, n, people) {
  const fd = fdOf(state), mode = fdMarket(fd, siteKey, n), res = fdResults(state, n, people, "");
  const flags = [];
  if (mode === "inactive") flags.push("Market is inactive: nothing should be published here.");
  if (mode === "interest_only") flags.push("Interest-only market: keep out of search unless the interest page is genuinely useful.");
  if (!res.exact.length && !res.within.length && !fdSourcingOn(fd, siteKey, mode) && siteKey !== "team") flags.push("No local providers and no sourcing service: nothing useful to do here.");
  if (!res.exact.length && !res.within.length && n.kids.length === 0 && siteKey !== "team") flags.push("Only a request form, no local providers or child places. Check it adds something its parent doesn't.");
  if (n.k === "h") flags.push("Neighbourhood boundaries are unreviewed (GeoNames points). Don't claim exact boundaries.");
  return { mode, exact: res.exact.length, within: res.within.length, kids: n.kids.length, sourcing: fdSourcingOn(fd, siteKey, mode), flags };
}


function AdmAreas11({ state, dispatch, can }) {
  const fd = fdOf(state), people = useDirectory();
  const [tab, setTab] = useState("requests");
  const by = "@" + (String(state.auth.tag || "DEV").toUpperCase());
  const stamp = (what, site) => ({ at: new Date().toISOString(), by, what, site });
  const upd = (id, patch) => fdSet(state, dispatch, { requests: fd.requests.map(r => r.id === id ? { ...r, ...patch } : r), log: [stamp(`request ${id} ${Object.keys(patch).join(", ")}`), ...fd.log].slice(0, 200) });
  return (
    <>
      <div className="ff-adm-tools"><AdmChips17 value={tab} onChange={setTab} options={[["requests", "Requests", fd.requests.filter(r => r.status === "new").length], ["pages", "Pages"], ["markets", "Markets"], ["sitemap", "Sitemap"], ["about", "How it works"]]} /></div>
      {tab === "requests" && <FdReqs11 fd={fd} upd={upd} dispatch={dispatch} state={state} />}
      {tab === "pages" && <FdPages11 fd={fd} state={state} dispatch={dispatch} can={can} by={by} people={people} stamp={stamp} />}
      {tab === "markets" && <FdMarkets11 fd={fd} state={state} dispatch={dispatch} can={can} />}
      {tab === "sitemap" && <FdSitemap11 fd={fd} />}
      {tab === "about" && <FdAbout11 fd={fd} />}
    </>
  );
}


function FdReqs11({ fd, upd, dispatch, state }) {
  const [q, setQ] = useState(""), [st, setSt] = useState(""), [role, setRole] = useState(""), [site, setSite] = useState(""), [from, setFrom] = useState(""), [to, setTo] = useState("");
  const [openId, setOpenId] = useState(null);
  const rows = fd.requests.filter(r => (!st || r.status === st) && (!role || r.roles.includes(role)) && (!site || r.siteKey === site)
    && (!q || (r.locationText + " " + r.ref + " " + (r.contact.name || "") + " " + (r.companyName || "")).toLowerCase().includes(q.toLowerCase()))
    && (!from || (r.eventDate && r.eventDate >= from)) && (!to || (r.eventDate && r.eventDate <= to)));
  return (
    <>
      <p className="ff-fd-note">Private to FireFlair admins. Requests are saved before anything else happens, retries don't make duplicates, and contact details never go in addresses or analytics.</p>
      <div className="ff-adm-tools ff-fd-filters">
        <Search17 value={q} onChange={setQ} placeholder="Place, reference, name or company" />
        <select aria-label="Status" value={st} onChange={(e) => setSt(e.target.value)}><option value="">Any status</option>{FD_STATUSES.map(s => <option key={s[0]} value={s[0]}>{s[1]}</option>)}</select>
        <select aria-label="Profession" value={role} onChange={(e) => setRole(e.target.value)}><option value="">Any profession</option>{FD_ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}</select>
        <select aria-label="Site" value={site} onChange={(e) => setSite(e.target.value)}><option value="">Any site</option>{Object.values(FD_SITES).map(s => <option key={s.key} value={s.key}>{s.name}</option>)}</select>
        <label>Event from <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label>
        <label>to <input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label>
      </div>
      {!fd.requests.length ? <Empty17>No requests yet.</Empty17> :
        !rows.length ? <Empty17>No requests match those filters.</Empty17> :
        <div className="ff-fd-tbl" role="table" aria-label="Local service requests">
          <div className="tr th" role="row"><span>Ref</span><span>Place</span><span>Needs</span><span>Event date</span><span>Status</span></div>
          {rows.map(r => (
            <div key={r.id} className="tr-wrap">
              <button type="button" className="tr" role="row" onClick={() => setOpenId(openId === r.id ? null : r.id)} aria-expanded={openId === r.id}>
                <span><b>{r.ref}</b><small>{FD_SITES[r.siteKey].name} · {r.kind === "expansion_interest" ? "interest" : "sourcing"}</small></span>
                <span>{r.locationText}{!r.locationId && <small>unresolved place</small>}</span>
                <span>{r.roles.map(x => FD_ROLE_LABEL[x]).join(", ")}</span>
                <span>{r.dateUndecided ? "Not decided" : r.eventDate}</span>
                <span><em className={"ff-fd-st " + r.status}>{FD_STATUS_LABEL[r.status]}</em></span>
              </button>
              {openId === r.id && <div className="ff-fd-det">
                <dl>
                  <dt>Received</dt><dd>{new Date(r.createdAt).toLocaleString("en-GB")}</dd>
                  <dt>Contact</dt><dd>{r.contact.name ? r.contact.name + " · " : ""}{r.contact.email || "no email"} · {r.contact.phone || "no phone"}{r.contact.whatsappOk ? " · WhatsApp OK" : ""}</dd>
                  <dt>Place</dt><dd>{r.locationText}{r.locationId ? ` (${r.locationId})` : " (not matched to a known place)"}</dd>
                  {r.companyName && <><dt>Asked about</dt><dd>{r.companyName} (unclaimed card): contact the company and pass the enquiry on.</dd></>}
                  {r.headcount && <><dt>People</dt><dd>{r.headcount}</dd></>}
                  {r.brief && <><dt>Notes</dt><dd>{r.brief}</dd></>}
                  <dt>Source</dt><dd>{FD_SITES[r.siteKey].name} · {r.sourcePath || "no page"}</dd>
                  <dt>Notifications</dt><dd>Admin: {r.notif.admin} · Acknowledgement: {r.notif.ack}{r.notif.failed ? " · FAILED, retry" : ""} <span className="ff-dev17 tag">DEV</span></dd>
                </dl>
                <div className="ff-fd-act">
                  <label>Status <select value={r.status} onChange={(e) => upd(r.id, { status: e.target.value })}>{FD_STATUSES.map(s => <option key={s[0]} value={s[0]}>{s[1]}</option>)}</select></label>
                  <label>Assigned to <input value={r.assignee} placeholder="@tag" onChange={(e) => upd(r.id, { assignee: e.target.value })} /></label>
                  <label className="grow">Admin note <input value={r.adminNote} onChange={(e) => upd(r.id, { adminNote: e.target.value })} /></label>
                </div>
                <p className="ff-fd-fine">When options are agreed, create the event in the normal booking flow so required details, terms and payment are collected before invitations go out. This queue never books, reserves or charges. Linking a booking ID is backend work.</p>
              </div>}
            </div>))}
        </div>}
    </>
  );
}


function FdPages11({ fd, state, dispatch, can, by, people, stamp }) {
  const [site, setSite] = useState("party"), [q, setQ] = useState(""), [kind, setKind] = useState(""), [pub, setPub] = useState(""), [lim, setLim] = useState(40);
  const [sel, setSel] = useState([]);
  const [rev, setRev] = useState(false);
  const [reason, setReason] = useState(""), [checks, setChecks] = useState({}), [skip, setSkip] = useState({});
  const canEdit = can("sites");
  const all = useMemo(() => FD_NODES.filter(n => n.k !== "r" || true), []);
  const rows = all.filter(n => (!kind || n.k === kind) && (!pub || fdPageState(fd, site, n).pub === pub) && (!q || (n.name + " " + n.path).toLowerCase().includes(q.toLowerCase())));
  const counts = { prepared: 0, published: 0, approved: 0 };
  all.forEach(n => { counts[fdPageState(fd, site, n).pub]++; });
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const write = (ids, pubState, extra) => {
    const pages = { ...fd.pages }, log = [...fd.log];
    ids.forEach(id => { const n = FD_BY_ID[id]; pages[site + "|" + id] = { pub: pubState, by, at: new Date().toISOString(), ...extra }; log.unshift({ ...stamp(`${pubState} ${n.name}${extra && extra.reason ? ": " + extra.reason : ""}`, site) }); });
    fdSet(state, dispatch, { pages, log: log.slice(0, 200) });
    setSel([]); setRev(false); setReason(""); setChecks({}); setSkip({});
  };
  const eligible = (id) => fdMarket(fd, site, FD_BY_ID[id]) !== "inactive";
  const publishUse = () => { const ids = sel.filter(eligible); if (!ids.length) { dispatch({ type: "TOAST", toast: "Those places are in an inactive market." }); return; } write(ids, "published", { reason: "Published for use" }); };
  const approveIds = sel.filter(id => !skip[id]);
  const okForm = reason.trim().length >= 10 && FD_CHECKS.every(c => checks[c[0]]) && approveIds.length > 0;
  const approve = () => { const ids = approveIds.filter(id => ["recruiting", "operational"].includes(fdMarket(fd, site, FD_BY_ID[id]))); if (!ids.length) { dispatch({ type: "TOAST", toast: "Only recruiting or operational markets can be approved for search." }); return; }
    write(ids, "approved", { reason: reason.trim(), checks: { ...checks }, exceptions: sel.filter(id => skip[id]) }); };
  const pre = (id) => { dispatch({ type: "V11_SET", patch: { adminOpen17: false, fdPreview: true } }); fdNav(dispatch, site, FD_BY_ID[id].path); };
  const showAdmin = !!canEdit;
  return (
    <>
      <p className="ff-fd-note">Each row is one page on one site. Prepared pages have no public route. Published pages work but stay <b>noindex</b> and out of the sitemap. Only reviewed pages are approved for search, and only by choice: approval is our editorial decision, not a promise that Google will index or rank the page.</p>
      <div className="ff-adm-tools"><AdmChips17 value={site} onChange={(v) => { setSite(v); setSel([]); }} options={Object.values(FD_SITES).map(s => [s.key, s.name])} />
        <span className="ff-fd-count">{counts.prepared} prepared · {counts.published} published · {counts.approved} approved</span></div>
      <div className="ff-adm-tools ff-fd-filters">
        <Search17 value={q} onChange={(v) => { setQ(v); setLim(40); }} placeholder="Search places or routes" />
        <select aria-label="Type" value={kind} onChange={(e) => setKind(e.target.value)}><option value="">Any type</option>{Object.entries(FD_KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
        <select aria-label="State" value={pub} onChange={(e) => setPub(e.target.value)}><option value="">Any state</option><option value="prepared">Prepared</option><option value="published">Published for use</option><option value="approved">Approved for search</option></select>
      </div>
      {showAdmin && sel.length > 0 && <div className="ff-fd-batch" role="region" aria-label="Batch actions">
        <b>{sel.length} selected</b>
        <Btn onClick={publishUse}>Publish for use</Btn>
        <Btn variant="gold" onClick={() => setRev(true)}>Review for search…</Btn>
        <Btn onClick={() => write(sel, "prepared", { reason: "Returned to prepared" })}>Return to prepared</Btn>
        <button type="button" className="ff-fd-link" onClick={() => setSel([])}>Clear</button></div>}
      {rev && <div className="ff-fd-review" role="dialog" aria-label="Approve for search">
        <h3>Approve {approveIds.length} page{approveIds.length === 1 ? "" : "s"} for search on {FD_SITES[site].name}</h3>
        <p className="ff-fd-fine">Reviewer {by}. The date is recorded. Untick a page to leave it out of this batch.</p>
        <ul className="ff-fd-ev">{sel.map(id => { const n = FD_BY_ID[id], e = fdEvidence(state, site, n, people); return <li key={id}>
          <label><input type="checkbox" checked={!skip[id]} onChange={() => setSkip(s => ({ ...s, [id]: !s[id] }))} /> <b>{fdLabel(n)}</b> <small>{FD_KIND_LABEL[n.k]} · {FD_MODES.find(m => m[0] === e.mode)[1]} · {e.exact} covering · {e.within} within · {e.kids} child places · {e.sourcing ? "sourcing on" : "no sourcing"}</small></label>
          {e.flags.map(f => <em key={f} className="ff-fd-flag">{f}</em>)}</li>; })}</ul>
        <fieldset><legend>I confirm, for each page ticked above</legend>
          {FD_CHECKS.map(c => <label key={c[0]} className="ff-fd-chk"><input type="checkbox" checked={!!checks[c[0]]} onChange={(e) => setChecks(x => ({ ...x, [c[0]]: e.target.checked }))} /> {c[1]}</label>)}</fieldset>
        <label className="ff-fd-f"><span>Short reason (recorded)</span><textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why is this page useful in its own right?" /></label>
        <div className="ff-fd-act"><Btn variant="gold" disabled={!okForm} onClick={approve}>Approve for search</Btn><Btn onClick={() => setRev(false)}>Cancel</Btn></div>
        {FF_SEO.demoData && <p className="ff-fd-fine"><span className="ff-dev17 tag">DEV</span> The prototype still emits noindex while demo data is on. Approval is recorded for the real build.</p>}
      </div>}
      <div className="ff-fd-tbl pages" role="table" aria-label="Pages">
        <div className="tr th" role="row"><span /><span>Place</span><span>Type</span><span>Market</span><span>State</span><span /></div>
        {rows.slice(0, lim).map(n => { const ps = fdPageState(fd, site, n), md = fdMarket(fd, site, n); return (
          <div className="tr" role="row" key={n.id}>
            <span>{showAdmin ? <input type="checkbox" aria-label={`Select ${n.name}`} checked={sel.includes(n.id)} onChange={() => toggle(n.id)} /> : null}</span>
            <span><b>{fdLabel(n)}</b><small>{n.path}</small></span>
            <span>{FD_KIND_LABEL[n.k]}</span>
            <span>{FD_MODES.find(m => m[0] === md)[1]}</span>
            <span><em className={"ff-fd-st " + ps.pub}>{ps.pub === "prepared" ? "Prepared" : ps.pub === "published" ? "Published · noindex" : "Approved for search"}</em>{ps.by && <small>{ps.by} · {String(ps.at).slice(0, 10)}{ps.reason ? " · " + ps.reason : ""}</small>}</span>
            <span><button type="button" className="ff-fd-link" onClick={() => pre(n.id)}>{ps.pub === "prepared" ? "Preview" : "View"}</button></span>
          </div>); })}
        {rows.length > lim && <button type="button" className="ff-fd-more" onClick={() => setLim(lim + 60)}>Show more ({rows.length - lim} left)</button>}
        {!rows.length && <Empty17>No pages match.</Empty17>}
      </div>
      {fd.log.length > 0 && <details className="ff-fd-opt"><summary>Recent decisions ({fd.log.length})</summary><ul className="ff-fd-log">{fd.log.slice(0, 30).map((l, i) => <li key={i}><small>{String(l.at).slice(0, 16).replace("T", " ")}</small> {l.by} · {l.what}{l.site ? ` · ${FD_SITES[l.site] ? FD_SITES[l.site].name : l.site}` : ""}</li>)}</ul></details>}
    </>
  );
}


function FdMarkets11({ fd, state, dispatch, can }) {
  const [q, setQ] = useState("");
  const countries = FD_NODES.filter(n => n.k === "c" && n.cc).filter(n => !q || n.name.toLowerCase().includes(q.toLowerCase()));
  const edit = can("sites");
  const setM = (site, cc, v) => fdSet(state, dispatch, { markets: { ...fd.markets, [site + "|" + cc]: v } });
  return (
    <>
      <p className="ff-fd-note">A market mode decides what a site may promise in a country. <b>Inactive</b>: nothing published. <b>Interest only</b>: a register-interest page. <b>Recruiting</b>: sign-up and sourcing requests are accepted. <b>Operational</b>: FireFlair fulfils there. Nothing is set to operational for you, and UK charges, currencies and terms are never reused abroad without approved configuration.</p>
      <h3 className="ff-adm-h3">Accepting "Ask us to find people"</h3>
      <div className="ff-fd-act">{["party", "staff"].map(s => <label key={s} className="ff-fd-chk"><input type="checkbox" disabled={!edit} checked={fd.sourcing[s] !== false} onChange={(e) => fdSet(state, dispatch, { sourcing: { ...fd.sourcing, [s]: e.target.checked } })} /> {FD_SITES[s].name}: the team is looking after sourcing requests</label>)}</div>
      <p className="ff-fd-fine">Switch a site off if the team can't service requests. The page then offers "Register interest" instead of the sourcing promise.</p>
      <Search17 value={q} onChange={setQ} placeholder="Search countries" />
      <div className="ff-fd-tbl markets" role="table" aria-label="Market modes">
        <div className="tr th" role="row"><span>Country or territory</span>{Object.values(FD_SITES).map(s => <span key={s.key}>{s.name}</span>)}</div>
        {countries.slice(0, 40).map(n => <div className="tr" role="row" key={n.id}><span><b>{n.name}</b><small>{n.cc}</small></span>
          {Object.values(FD_SITES).map(s => <span key={s.key}><select disabled={!edit} aria-label={`${n.name} on ${s.name}`} value={fdMarket(fd, s.key, n)} onChange={(e) => setM(s.key, n.cc, e.target.value)}>{FD_MODES.map(m => <option key={m[0]} value={m[0]}>{m[1]}</option>)}</select></span>)}</div>)}
      </div>
    </>
  );
}


function FdSitemap11({ fd }) {
  const [site, setSite] = useState("party");
  const rows = FD_NODES.filter(n => fdPageState(fd, site, n).pub === "approved");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` + rows.map(n => `  <url><loc>${fdUrl(site, n.path)}</loc><lastmod>${String(fdPageState(fd, site, n).at).slice(0, 10)}</lastmod></url>`).join("\n") + `\n</urlset>`;
  return (
    <>
      <p className="ff-fd-note">What each site's area sitemap would contain: only pages approved for search, self-canonical, with the date they were last reviewed. Published and prepared pages are never listed. This is a preview; nothing is served.</p>
      <div className="ff-adm-tools"><AdmChips17 value={site} onChange={setSite} options={Object.values(FD_SITES).map(s => [s.key, s.name, FD_NODES.filter(n => fdPageState(fd, s.key, n).pub === "approved").length])} /></div>
      {rows.length ? <pre className="ff-fd-xml">{xml}</pre> : <Empty17>Nothing approved for {FD_SITES[site].name} yet, so its area sitemap is empty. That is intended until pages are reviewed.</Empty17>}
      <p className="ff-fd-fine">Keep a published <b>noindex</b> page crawlable: don't block it in robots.txt, or crawlers can't read its noindex. Search crawlers (including OAI-SearchBot) and training crawlers are separate decisions in robots.txt.</p>
    </>
  );
}


function FdAbout11({ fd }) {
  const L = [
    ["What this is", "One location system shared by FF Party, FF Team and FF Staff. 1,000 prepared places can each have one page per site: up to 3,000 routes, each with its own intent, copy and canonical."],
    ["Three states", "Prepared: admin preview only. Published for use: a working page, noindex, not in the sitemap. Approved for search: reviewed, indexable, self-canonical and in its site's sitemap. Each (site, place) pair moves on its own."],
    ["Coverage", "Whole-area coverage (Greater London) includes places beneath it. A selected place (Camden) covers only that place. Parent fallback climbs the browsing tree, is labelled, and stops at the UK nation. Distance is never claimed."],
    ["Requests", "Every request is saved first as a local_service_request with a reference. It books, reserves and charges nothing. Unclaimed company cards: FireFlair contacts the company and passes the enquiry on."],
    ["Simulated here", "Persistence (saved with the preview data), notifications, the sitemap, and the provider coverage (fixtures built from the sample people's regions and company base locations)."]
  ];
  return React.createElement("dl", { className: "ff-fd-about" }, L.map(([a, b]) => React.createElement(React.Fragment, { key: a }, React.createElement("dt", null, a), React.createElement("dd", null, b))), React.createElement("dt", null, "Developer handover"), React.createElement("dd", null, "See docs/front-doors/ in the repository."));
}



const FD_CSS = __ff_css("styles/fd.css");



function NetMap11() {
  return React.createElement(React.Fragment, null, React.createElement("section", { id: "ff-netmap", style: { marginTop: 22, scrollMarginTop: 70 } }, React.createElement(BigHead20, { title: "Browse the network" }), React.createElement(FFMap, { mode: "network" })), React.createElement(AreaExplorer11, null));
}
