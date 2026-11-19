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







function pkgNav18(dispatch, slug) {
  try { const u = "#/ff-party/packages" + (slug ? "/" + slug : ""); if (window.location.hash !== u) window.history.pushState({ ff: "pkg" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { pkgPage: { slug: slug || "" } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}
