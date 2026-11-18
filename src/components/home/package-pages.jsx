/* src/components/home/package-pages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  const DX_I = {
    Users: lucideIcon("Users"),
    Sparkles: lucideIcon("Sparkles"),
    Contact: lucideIcon("Contact"),
    CalendarDays: lucideIcon("CalendarDays"),
    PartyPopper: lucideIcon("PartyPopper"),
    ChevronDown: lucideIcon("ChevronDown"),
    ChevronUp: lucideIcon("ChevronUp"),
    ArrowRight: lucideIcon("ArrowRight"),
    X: lucideIcon("X")
  };

  /* v17.9: FF Team pillars are built from src/content/homepage/team-pillars.json (copy lives there only). */
  const TP21 = CONTENT_ADAPTER.homepageTeamPillars();

  /* v17.10: one mapper for the pillars of all three sites (FF Team, FF Party, FF Staff). */
  const dxFromPillars21 = (P, icons, extra) => P.pillars.map((pl) => {
    const fixed = pl.sections.every((x) => x.card_img);
    return {
      k: pl.k,
      t: pl.t,
      s: pl.s,
      img: "t17_" + P.photos[pl.k][0],
      pool: P.photos[pl.k],
      fixedCards: fixed ? pl.sections.map((x) => x.card_img) : null,
      icon: icons[pl.k],
      h: pl.h,
      tldr: pl.tldr,
      slug: pl.slug,
      seo: pl.seo,
      sections: pl.sections,
      p: [pl.tldr],
      parts: pl.sections.map((x) => ({ id: x.id, label: x.h })),
      jn: pl.sections.map((x) => ({ t: x.card.t, x: x.card.d, b: x.card.b, go: "#" + x.id })),
      ...extra
    };
  });

  const DX_TEAM = dxFromPillars21(TP21, { profiles: DX_I.Contact, services: DX_I.Sparkles, events: DX_I.CalendarDays, community: DX_I.Users }, { infoLinks: true });
  const DX_PARTY = dxFromPillars21(CONTENT_ADAPTER.homepagePartyPillars(), { services: DX_I.Sparkles, community: DX_I.Users, events: DX_I.PartyPopper, profiles: DX_I.Contact }, { infoLinks: false });
  const DX_BIZ = dxFromPillars21(CONTENT_ADAPTER.homepageStaffPillars(), { community: DX_I.Users, events: DX_I.PartyPopper, services: DX_I.Sparkles, profiles: DX_I.Contact }, { infoLinks: false });

  /* ---- v17.3.112: FireFlair Packages (pop-ups from the site, front-door pages for search), Our Packages / Our Network / Your Booking / Your Party ---- */
const h18 = React.createElement;

/* v17.4.7: headline, description and the extra lines come from the package catalogue (state/package-catalogue17.js). */
const PKG18 = {};
[["bartending", "svc_bartending"], ["mixology", "svc_mixology"], ["masterclass", "svc_masterclass"], ["flair", "svc_flair"], ["tasting", "svc_full"], ["staffing", "svc_staffing"]].forEach(([slug, id]) => {
  const c = PKG_BY17[id];
  PKG18[slug] = { id, head: c.headline, desc: c.description, more: c.points.slice(), cond: c.conditions };
});

const PKG18_ORDER = CONTENT_ADAPTER.packagePageOrder();

function pkg18(slug) {
  const m = PKG18[slug];
  if (!m) return null;
  const sv = PARTY_SERVICES.find((s) => s.id === m.id);
  if (!sv) return null;
  return Object.assign({ slug: slug, sv: sv }, m);
}

const CSS18 = __ff_css("styles/css18.css");

function Css18() { return h18("style", null, CSS18); }

function PkgBody18({ m, onPlan }) {
  const sv = m.sv;
  const partyOnly = pk18Site(useStore().state).party;
  const inc = m.more && m.more.length ? m.more : [sv.includes];
  return h18("div", { className: "ff-pk18" },
    h18("p", { className: "ff-pk18-eb" }, "FireFlair Package"),
    h18("p", { className: "ff-pk18-head" }, m.head),
    h18("p", { className: "ff-pk18-d" }, m.desc),
    h18("dl", { className: "ff-pk18-rows" },
      h18("div", null, h18("dt", null, "Includes"), h18("dd", null, h18("ul", null, inc.map((x) => h18("li", { key: x }, x))))),
      h18("div", null, h18("dt", null, "Perfect for"), h18("dd", null, sv.ideal)),
      m.pers ? h18("div", null, h18("dt", null, "Your way"), h18("dd", null, m.pers)) : null,
      h18("div", null, h18("dt", null, "Duration"), h18("dd", null, sv.time)),
      m.cond ? h18("div", null, h18("dt", null, "Good to know"), h18("dd", null, m.cond)) : null,
      h18("div", null, h18("dt", null, "Price"), h18("dd", null, sv.price))),
    h18("ol", { className: "ff-pk18-steps" }, ["Choose your package", "Choose your people", "Choose your add\u2011ons", "Your booking is secured"].map((t, i) => h18("li", { key: t }, h18("span", null, i + 1), t))),
    h18("p", { className: "ff-pk18-g" }, h18("b", null, "The FireFlair Booking Guarantee. "), "Confirmed, or refunded in full."),
    h18("div", { className: "ff-pk18-cta" }, partyOnly ? h18(LockedBtn17, { shine: true }, "Plan your event") : h18(ShineButton, { onClick: onPlan }, "Plan your event")));
}

/* v17.4.7.18 the package card button, by site: FF Team Sign up, FF Staff Create your own, FF Party Book now (gold, shiny). */
function pk18Site(state) {
  const team = state.role === "team", staffSite = state.role === "staff" && !(hireSiteOf(state) || {}).party;
  return { team: team, staffSite: staffSite, party: !team && !staffSite, label: team ? "Sign up" : staffSite ? "Create your own" : "Book now" };
}

function pk18Act(st, m, hire) {
  const state = st.state, dispatch = st.dispatch, sv = m.sv, site = pk18Site(state);
  if (site.team) {
    if (!qaAccount17(state)) { window.dispatchEvent(new Event("ff-login")); return; }
    const on = ((state.profile && state.profile.serviceInterest) || []).includes(sv.id);
    if (!on) pkgSignup17(state, dispatch, sv);
    dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0);
    return;
  }
  if (site.staffSite) { dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); return; }
  selectPkg17(state, dispatch, sv.id, false);
  hire.toEvent();
}

function PkgBtn18({ st, m, hire, onDone, full }) {
  const site = pk18Site(st.state);
  if (site.party) return h18(LockedBtn17, { className: "ff-pk18-go" + (full ? " full" : ""), variant: "gold", shine: true }, site.label);
  return h18("button", { type: "button", className: "ff-btn ff-pk18-go" + (full ? " full" : "") + (site.party ? " gold ff-shine" : ""), onClick: (e) => { e.stopPropagation(); if (onDone) onDone(); pk18Act(st, m, hire); } }, site.label);
}

/* The pop-up: the card, larger, with the full text. Scrolls on a phone. */
function PkgFull18({ m, st, hire, onClose, people, place }) {
  const sv = m.sv, state = st.state;
  const inc = m.more && m.more.length ? m.more : [sv.includes];
  const price = state.role === "staff" || state.site === "party" ? sv.price : String(sv.price).replace(/£(\d+)/, (x, n) => "£" + Math.max(0, +n - 50));
  const lines = (arr) => h18(React.Fragment, null, arr.map((x) => h18("span", { key: x, className: "ff-pk18full-li" }, x)));
  const rows = [
    { icon: h18(Sparkles, { size: 17 }), label: "Includes", value: lines(inc) },
    { icon: h18(Users, { size: 17 }), label: "Perfect for", value: sv.ideal },
    m.pers ? { icon: h18(Sparkles, { size: 17 }), label: "Your way", value: m.pers } : null,
    { icon: h18(Clock, { size: 17 }), label: "Duration", value: sv.time },
    m.cond ? { icon: h18(Sparkles, { size: 17 }), label: "Good to know", value: m.cond } : null
  ].filter(Boolean);
  return h18("div", { className: "ff-pk18full" },
    h18(PosterCard, {
      tone: sv.tone, ribbon: "Package Card", eyebrow: `${sv.level} · FF Party`, title: sv.title, subtitle: m.head, tagline: m.desc, price: price, rows: rows,
      footer: h18(PkgBtn18, { st: st, m: m, hire: hire, onDone: onClose, full: true })
    }),
    people && people.length ? h18("div", { className: "ff-pk18-who" },
      h18("b", null, "Available in " + place),
      h18("div", { className: "ff-pk18-chips" }, people.map((p) => h18("button", { type: "button", key: p.id, className: "ff-pk18-chip", onClick: () => { onClose(); st.dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); } }, p.name)))) : null,
    h18("ol", { className: "ff-pk18-steps" }, ["Choose your package", "Choose your people", "Choose your add\u2011ons", "Your booking is secured"].map((t, i) => h18("li", { key: t }, h18("span", null, i + 1), t))),
    h18("p", { className: "ff-pk18-g" }, h18("b", null, "The FireFlair Booking Guarantee. "), "Confirmed, or refunded in full."));
}

/* The package cards. ids / peopleOf / place are optional: the location pages show only the packages someone there offers. */
function PartyPackages18({ ids, peopleOf, place, title } = {}) {
  const st18 = useStore();
  const [open, setOpen] = useState(null);
  const hire = useHireNav();
  const list = PKG18_ORDER.map(pkg18).filter(Boolean).filter((m) => !ids || ids.includes(m.sv.id));
  const cur = open ? pkg18(open) : null;
  const heading = title === undefined ? "FireFlair Packages" : title;
  if (!list.length) return null;
  return h18(
    "section",
    { className: "ff-sect ff-pk18-sect", id: "ff-offer", "aria-labelledby": "ff-pk18-h" },
    h18(Css18, null),
    heading ? h18("h2", { id: "ff-pk18-h", className: "ff-h1" }, heading) : null,
    h18(HomeCarousel, { label: heading || "FireFlair Packages" }, list.map((m) => h18(
      "div",
      { key: m.slug, style: { width: CARD_W.poster, flex: "none" } },
      h18(
        "div",
        { className: "ff-pk18-hit", role: "group", "aria-label": m.sv.title, tabIndex: 0, onClick: () => setOpen(m.slug), onKeyDown: (e) => { if (e.target === e.currentTarget && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen(m.slug); } } },
        h18(ServicePoster, { svc: Object.assign({}, m.sv, { kind: "package" }), cta: h18(PkgBtn18, { st: st18, m: m, hire: hire }) })
      )
    ))),
    cur ? h18(
      Sheet,
      { open: true, onClose: () => setOpen(null), title: cur.sv.title, center: true },
      h18(PkgFull18, { m: cur, st: st18, hire: hire, onClose: () => setOpen(null), people: peopleOf ? peopleOf(cur.sv.id) : null, place: place })
    ) : null
  );
}

window.PartyPackages18 = PartyPackages18;

function Guarantee18() {
  return h18("section", { className: "ff-sect ff-g18", id: "ff-guarantee" },
    h18(Coin, { size: 64, tier: "gold" }),
    h18("h3", null, "The FireFlair Booking Guarantee"),
    h18("p", null, "Book with nothing to lose. Confirmed, or refunded in full."));
}

function Fold18({ id, title, sub, children }) {
  const [open, setOpen] = useState(false);
  return h18("section", { className: "ff-sect ff-fold18", id: id },
    h18("button", { type: "button", className: "ff-fold18-b", "aria-expanded": open, onClick: () => setOpen(!open) },
      h18("span", null, h18("b", null, title), sub ? h18("small", null, sub) : null)),
    open ? h18("div", { className: "ff-fold18-c" }, children) : null);
}

function FireFlairFold18({ kind = "party" }) {
  /* Collapsed: a compact card with a small fire picture. Open: the original Fire / Flair section and Our dream, unchanged.
     v17.4.6.1: FF Staff uses the same fold; What is FireFlair? (moved out of Our community) sits inside it. */
  const [open, setOpen] = useState(false);
  return h18("div", { className: "ff-sect ff-firefold18", id: "ff-why-fold" },
    h18("button", { type: "button", className: "ff-firefold18-b", "aria-expanded": open, "aria-controls": "ff-why-panel", onClick: () => setOpen(!open) },
      h18("span", { className: "th", "aria-hidden": "true" }, h18("img", { src: FIRE17_STILL, alt: "", width: 64, height: 60, decoding: "async", draggable: false })),
      h18("span", { className: "tx" }, h18("b", null, "Fire & Flair"), h18("small", null, "Why we are called FireFlair?"))),
    open ? h18("div", { id: "ff-why-panel" }, h18(WhyFlair17, { kind }), h18(OurDream17, { kind })) : null);
}

const PKG18_RE = /^#\/ff-party\/packages(?:\/([a-z0-9-]+))?\/?$/i;

function PkgRoute18() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  useEffect(() => {
    const sync = () => {
      const m = PKG18_RE.exec(String(window.location.hash || ""));
      const cur = ref.current.pkgPage;
      if (m) { const slug = (m[1] || "").toLowerCase(); if (!cur || cur.slug !== slug) dispatch({ type: "V11_SET", patch: { pkgPage: { slug: slug } } }); }
      else if (cur) dispatch({ type: "V11_SET", patch: { pkgPage: null } });
    };
    sync();
    window.addEventListener("popstate", sync); window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  return null;
}

function pkgNav18(dispatch, slug) {
  try { const u = "#/ff-party/packages" + (slug ? "/" + slug : ""); if (window.location.hash !== u) window.history.pushState({ ff: "pkg" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { pkgPage: { slug: slug || "" } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}

function pkgClose18(dispatch) {
  try { window.history.pushState(null, "", window.location.pathname + window.location.search); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { pkgPage: null } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}

function pkgSeo18(state) {
  const p = state.pkgPage;
  if (!p) return null;
  const m = p.slug ? pkg18(p.slug) : null;
  if (p.slug && !m) return { page: "package-404", title: "Page not found — FireFlair", description: "This package page does not exist.", canonical: fdUrl("party", "/packages"), robots: "noindex, nofollow", type: "website", jsonLd: null };
  const url = fdUrl("party", p.slug ? "/packages/" + p.slug : "/packages");
  const indexable = !FF_SEO.demoData;
  const name = m ? m.sv.title : "FireFlair Packages";
  const title = ffSeoClip(m ? `${name} for your party | FF Party` : "FireFlair Packages for your party | FF Party", FF_SEO.title.max);
  const description = ffSeoClip(m
    ? `${m.head} ${m.desc} Book the ${name} with a professional on FF Party.`
    : "FireFlair Packages bring professional bartenders and cocktails to your celebration. Choose a package, choose your people and secure your booking on FF Party.", FF_SEO.description.max);
  const crumbs = [{ "@type": "ListItem", position: 1, name: "FF Party", item: fdUrl("party", "") + "/" }, { "@type": "ListItem", position: 2, name: "FireFlair Packages", item: fdUrl("party", "/packages") }];
  if (m) crumbs.push({ "@type": "ListItem", position: 3, name: name, item: url });
  const ld = [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }];
  if (m) ld.push({ "@context": "https://schema.org", "@type": "Service", name: name, description: m.desc, provider: { "@type": "Organization", name: "FireFlair" }, areaServed: "GB" });
  return { page: "package", title: title, description: description, canonical: url, robots: indexable ? "index, follow" : "noindex, nofollow", type: "website", jsonLd: indexable ? ld : null };
}

function PackagePage18() {
  const { state, dispatch } = useStore();
  const goSite = useGoSite();
  const slug = (state.pkgPage && state.pkgPage.slug) || "";
  const m = slug ? pkg18(slug) : null;
  const back = h18("button", { type: "button", className: "ff-fd-back", onClick: () => rt17Back(() => pkgClose18(dispatch)) }, "← Back");
  const plan = () => { if (m) selectPkg17(state, dispatch, m.sv.id, false); pkgClose18(dispatch); goSite("party"); };
  const link = (s, kids, cls) => h18("a", { href: "#/ff-party/packages" + (s ? "/" + s : ""), className: cls, onClick: (e) => { e.preventDefault(); pkgNav18(dispatch, s); } }, kids);
  if (slug && !m) {
    return h18("main", { className: "ff-fd-page", "aria-labelledby": "pk18-h1" }, h18(Css18, null), back,
      h18("h1", { id: "pk18-h1", className: "ff-h1" }, "We can't find that package"),
      h18("p", null, "Take a look at all of our packages."), link("", "FireFlair Packages", "ff-pk18-card"));
  }
  if (!m) {
    return h18("main", { className: "ff-fd-page", "aria-labelledby": "pk18-h1" }, h18(Css18, null), back,
      h18("h1", { id: "pk18-h1", className: "ff-h1" }, "FireFlair Packages"),
      h18("p", { className: "ff-pk18-d" }, "Your celebration, beautifully looked after. Choose a package, choose your people and secure your booking."),
      h18("div", { className: "ff-pk18-grid" }, PKG18_ORDER.map(pkg18).filter(Boolean).map((x) => link(x.slug, [h18("b", { key: "b" }, x.sv.title), h18("span", { key: "s" }, x.head), h18("span", { key: "d" }, x.desc)], "ff-pk18-card"))),
      h18(Guarantee18, null),
      h18("div", { className: "ff-pk18-cta", style: { marginTop: 16 } }, h18(ShineButton, { onClick: plan }, "Visit FF Party")));
  }
  return h18("main", { className: "ff-fd-page", "aria-labelledby": "pk18-h1" }, h18(Css18, null), back,
    h18("nav", { "aria-label": "Breadcrumb", className: "ff-pk18-eb", style: { marginBottom: 6 } }, link("", "FireFlair Packages", ""), " / " + m.sv.title),
    h18("h1", { id: "pk18-h1", className: "ff-h1" }, m.sv.title),
    h18(PkgBody18, { m: m, onPlan: plan }));
}
