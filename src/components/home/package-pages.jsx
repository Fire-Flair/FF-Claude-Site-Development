/* src/components/home/package-pages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
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

  /* ---- v17.3.112: FireFlair Packages (pop-ups from the site, front-door pages for search), Our Packages / Our Network / Your Booking / Your Party ---- */
const h18 = React.createElement;

/* v17.4.7: headline, description and the extra lines come from the package catalogue (state/package-catalogue17.js). */
const PKG18 = {};

[["bartending", "svc_bartending"], ["mixology", "svc_mixology"], ["masterclass", "svc_masterclass"], ["flair", "svc_flair"], ["tasting", "svc_full"], ["staffing", "svc_staffing"]].forEach(([slug, id]) => {
  const c = PKG_BY17[id];
  PKG18[slug] = { id, head: c.headline, desc: c.description, more: c.points.slice(), cond: c.conditions };
});


function pkg18(slug) {
  const m = PKG18[slug];
  if (!m) return null;
  const sv = PARTY_SERVICES.find((s) => s.id === m.id);
  if (!sv) return null;
  return Object.assign({ slug: slug, sv: sv }, m);
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

function pkgNav18(dispatch, slug) {
  try { const u = "#/ff-party/packages" + (slug ? "/" + slug : ""); if (window.location.hash !== u) window.history.pushState({ ff: "pkg" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { pkgPage: { slug: slug || "" } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}
