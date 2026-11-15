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

  const DX_TEAM = TP21.pillars.map((pl) => {
    const fixed = pl.sections.every((x) => x.img);
    return {
      k: pl.k,
      t: pl.t,
      s: pl.s,
      img: "t17_" + TP21.photos[pl.k][0],
      pool: TP21.photos[pl.k],
      fixedCards: fixed ? pl.sections.map((x) => x.img) : null,
      icon: { profiles: DX_I.Contact, services: DX_I.Sparkles, events: DX_I.CalendarDays, community: DX_I.Users }[pl.k],
      h: pl.h,
      tldr: pl.tldr,
      slug: pl.slug,
      seo: pl.seo,
      sections: pl.sections,
      p: [pl.tldr],
      parts: pl.sections.map((x) => ({ id: x.id, label: x.h })),
      jn: pl.sections.map((x) => ({ t: x.card.t, x: x.card.d, b: x.card.b, go: "#" + x.id }))
    };
  });

  const DX_BIZ = [
    {
      k: "community",
      t: "Our community",
      s: "What we are building together",
      img: "t17_aiIntl",
      pool: ["aiIntl", "vke06", "p35", "p45", "aiMusic"],
      icon: DX_I.Users,
      h: "Hospitality, brought together.",
      p: ["Hospitality is a community, and FireFlair brings it together: bartenders, waiters, event staff and the businesses that hire them, all in one place, all building the same thing.", "Everyone shares the same values: be reliable, be kind, and make every event a night worth remembering. Find the people who work that way and keep them close.", "Reputation travels with people on FireFlair, so you hire with confidence. Choose staff your colleagues already trust and build a bench you can call on all year."],
      parts: [
        { id: "ff-teams", label: "Book a team", r: () => React.createElement(StaffTeams, null) },
        { id: "ff-relationships", label: "Reviews", r: () => React.createElement(HireReviews, {
          kind: "staff"
        }) },
        { id: "ff-team", label: "Featured staff", r: () => React.createElement(HireFeatured, {
          title: "Featured staff",
          ids: ["dir_sam", "dir_priya", "dir_ines", "dir_theo", "stf_don", "dir_maya", "dir_kofi", "stf_jam"],
          note: "Tap a card to see their profile and add them to your booking bar."
        }) }
      ],
      jn: [
        { ic: "Users", t: "Meet featured staff", d: "Bartenders, waiters and event staff to book.", b: "Meet the staff", go: "#ff-team", x: "Featured staff are bartenders, waiters and event staff with strong profiles and reviews. Browse them and see who they work with." },
        { ic: "UserPlus", t: "Book a whole team", d: "Companies with teams ready to hire together.", b: "Book a team", go: "#ff-teams", x: "Companies on FireFlair bring teams that are ready to work together. Book the whole team in one go, rather than person by person." },
        { ic: "Star", t: "Trust the reviews", d: "What other businesses say.", b: "Read reviews", go: "#ff-relationships", x: "Reviews come from other businesses that have hired the same people, so you can book with confidence." }
      ]
    },
    {
      k: "events",
      t: "Your events",
      s: "Enhance your events with the best staff, made easy",
      img: "t17_vke04",
      pool: ["vke04", "p23", "p46", "p24", "p31"],
      icon: DX_I.PartyPopper,
      h: "From one shift to a festival.",
      p: ["Whether it is a single bar shift or a full festival, start with an Event Card: the date, the place and the roles you need.", "Choose your people, send the shifts and let everyone confirm on WhatsApp. Everything stays in one place.", "Plan once, repeat with ease. Your Event Cards stay in Bookings, so the next festival, launch or private party starts from what already worked."],
      parts: [
        { id: "ff-steps", label: "Book in four steps", r: () => React.createElement(HowSteps17, {
          kind: "staff"
        }) },
        { id: "ff-what", label: "Hire the modern way", r: () => React.createElement(StaffWhatIs, null) },
        { id: "ff-how", label: "The platforms", r: () => React.createElement(StaffPlatforms, null) }
      ],
      jn: [
        { ic: "CalendarDays", t: "Create an Event Card", d: "Your date, venue and the staff you need.", b: "Create your Event Card", go: "book", x: "An Event Card holds your date, venue and the staff you need. Everything else in the booking grows from it." },
        { ic: "ListChecks", t: "Book in four steps", d: "From Event Card to confirmation.", b: "See the steps", go: "#ff-steps", x: "Four steps take you from Event Card to confirmation: choose your people, send the request, and let everyone confirm on WhatsApp." },
        { ic: "Rocket", t: "Hire the modern way", d: "From one bar shift to a festival.", b: "See how", go: "#ff-what", x: "Whether it is one bar shift or a festival, you book the same way, with everything in one place." }
      ]
    },
    {
      k: "services",
      t: "Our events",
      s: "Every booking, start to finish",
      img: "t17_p06",
      pool: ["p06", "v01", "p30", "p01", "p13"],
      icon: DX_I.Sparkles,
      h: "Grow with every event.",
      p: ["Our events are where hospitality gets better: every booking is followed from the first request to the five-star review.", "Follow every booking from the first request to the five-star review, and learn from each event so the next one runs even better.", "If your company offers services of its own, list them as Service Cards, and get booked by hosts on FF Party as your reputation grows."],
      parts: [
        { id: "ff-cards", label: "Follow a booking", r: () => React.createElement(CardJourney11, {
          kind: "staff"
        }) },
        { id: "ff-coming", label: "Service Cards", r: () => React.createElement(StaffComingSoon, null) }
      ],
      jn: [
        { ic: "Layers", t: "Follow a booking", d: "The cards, in the order a booking happens.", b: "Follow a booking", go: "#ff-cards", x: "A booking moves through four cards, from the Event Card to the Review Card. Following them shows you how every request is handled." },
        { ic: "PartyPopper", t: "Get booked on FF Party", d: "Hosts book companies like yours.", b: "Visit FF Party", go: "site:party", x: "FF Party is where hosts book bar companies for their events. List your company there and the bookings come to you." }
      ]
    },
    {
      k: "profiles",
      t: "Your business",
      s: "Build your company profile to advertise to staff and new customers",
      img: "t17_p27",
      pool: ["p27", "p11", "p05", "p04"],
      icon: DX_I.Contact,
      h: "A company card people trust.",
      p: ["Your Company Card tells everyone you hire who you are, what you do and who is on your team.", "Share it with a link, send it with every booking and let your professionalism show before the first message.", "A strong Company Card wins the trust of the best people before you have said a word. Keep it fresh, add your team and let your reputation do the recruiting."],
      parts: [
        { id: "ff-company", label: "Company Card", r: () => React.createElement(StaffCompanyCard, null) }
      ],
      jn: [
        { ic: "Briefcase", t: "Your Company Card", d: "Sent to everyone you hire.", b: "See the Company Card", go: "#ff-company", x: "Your Company Card is what everyone you hire sees first. It says who you are, what you do and who is on your team." },
        { ic: "Contact", t: "Create your company profile", d: "Set up your company and your team.", b: "Create your Company Card", go: "profile", x: "Joining FF Staff sets up your company and your team, so you can book, and be booked, with your own card." },
        { ic: "Search", t: "Find your people", d: "Search the whole network.", b: "Explore the network", go: "network", x: "People search the whole network by skill, area and level, so you find the right person for every event." }
      ]
    }
  ];

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
