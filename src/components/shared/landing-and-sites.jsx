/* src/components/shared/landing-and-sites.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   8. SHELL — landing, action sheet, nav, root
   ========================================================================== */

const MAP_AREAS = {
  "Enfield": [58, 9], "North London": [44, 26], "West London": [18, 50],
  "Central London": [48, 51], "East London": [77, 44], "South London": [50, 78],
};



const MAP_BUSINESSES = [
  ...REAL_COMPANIES11.slice(0, 3).map(c => ({ id: "biz_" + c.slug, name: c.name, profession: c.kind, tag: c.tag, tier: "standard", area: c.areas[0] || "", business: true })),
];



/* boxed (v16.14): the whole section sits inside one large rounded square
   (true = cream, "dark" = black). kicker: a larger question above the title. */
function Sect({ id, eyebrow, title, lede, children, boxed, kicker }) {
  const inner = (<>
    {(eyebrow || title || kicker) && (
      <div className="ff-sect-head">
        {kicker && <h2 className="ff-kicker">{kicker}</h2>}
        {eyebrow && <div className="ff-eyebrow">{eyebrow}</div>}
        {title && (kicker ? <p className="ff-h1 ff-kicker-sub">{title}</p> : <h2 className="ff-h1" style={{ marginTop: 6 }}>{title}</h2>)}
        {lede && <p className="ff-lede" style={{ marginTop: 10, marginBottom: 0 }}>{lede}</p>}
      </div>
    )}
    {children}
  </>);
  return (
    <section className={`ff-sect${boxed ? " boxed" : ""}`} id={id}>
      {boxed ? <div className={`ff-bigsq${boxed === "dark" ? " dark" : ""}`}>{inner}</div> : inner}
    </section>
  );
}



function LandingRoleCard({ role, tier, plate, question, line, cta }) {
  const { dispatch } = useStore();
  return (
    <CardFrame as="button" tier={tier} theme={THEMES.onyx} ratio="5 / 7" corners
      onClick={() => { dispatch({ type: "ROLE", role }); if (role === "team") dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0); }}
      style={{ padding: "24px 11px 10px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", width: "100%" }}>
      <span className="ff-label" style={{ position: "absolute", top: 10, left: 12, fontSize: 7, letterSpacing: ".2em", color: THEMES.onyx.sub, zIndex: 4 }}>{plate}</span>
      <div style={{ marginTop: 10 }}><Coin size={42} tier={tier} /></div>
      <div className="ff-display" style={{ color: "#F2ECE0", fontSize: 12.5, marginTop: 11, letterSpacing: ".05em", lineHeight: 1.25 }}>{question}</div>
      <div className="ff-serif" style={{ color: "#D9BE68", fontStyle: "normal", fontSize: 12.5, marginTop: 6, lineHeight: 1.35 }}>{line}</div>
      <div style={{ marginTop: "auto", width: "100%", borderTop: "1px solid rgba(201,162,39,.3)", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, color: "#EAD79C", fontSize: 8.5, letterSpacing: ".14em", textTransform: "uppercase" }}>
        {cta} <ChevronRight size={11} />
      </div>
    </CardFrame>
  );
}



function RoleCards() {
  return (
    <div className="ff-rolegrid">
      <LandingRoleCard role="team" tier="gold" plate="FF Team"
        question="FF Team" line="Join the Team" cta="Create your card" />
      {p1SiteOpen("staff") && <LandingRoleCard role="staff" tier="silver" plate="FF Staff"
        question="FF Staff" line="Hire Staff" cta="Create your profile" />}
    </div>
  );
}



/* Events on the Home map — demo locations only, never exact addresses. */
const MAP_EVENTS = [
  { id: "mev_lcw", name: "London Cocktail Week", note: "3–9 October · bar takeovers", area: "Central London", event: true },
  { id: "mev_wws", name: "Winter Wedding Showcase", note: "18 October · Charlotte House", area: "West London", event: true },
  { id: "mev_expo", name: "Hospitality Expo", note: "5 November · ExCeL", area: "East London", event: true },
  { id: "mev_launch", name: "Brand Launch — Hackney", note: "11 October · Hackney Depot", area: "East London", event: true },
  { id: "mev_autumn", name: "Autumn Cocktail Party", note: "The Loft Lounge", area: "Enfield", event: true },
  { id: "mev_lunch", name: "Riverside Seated Lunch", note: "Riverside Pavilion", area: "South London", event: true },
];


const MAP_LAYER = {
  person: { label: "Professionals" },
  business: { label: "Hospitality businesses" },
  company: { label: "Company" },
  venue: { label: "Venues", color: "#C6C8CC" },
  event: { label: "Events", color: "#2F8A7E" },
};






function scrollToSection(id) {
  if (window.__ffDxReveal && window.__ffDxReveal(id)) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}


const FF_VIP_LOGO = __ff_json("content/data/ff-vip-logo.json");



const FF_SITES = [
  { key: "team",  name: "FF Team",  domain: "ffteam.uk",  url: "https://ffteam.uk",  tier: "bronze",
    line: "For hospitality professionals", pitch: "Freelancers and the people who work in and run businesses: build your Profile Card and get booked.", cta: "Create your card" },
  { key: "staff", name: "FF Staff", domain: "ffstaff.uk", url: "https://ffstaff.uk", tier: "silver",
    line: "For hospitality businesses", pitch: "Bars, restaurants, venues, caterers and event companies: hire staff for your events and keep the people you trust.", cta: "Hire staff" },
  { key: "party", name: "FF Party", domain: "ffparty.uk", url: "https://ffparty.uk", tier: "gold",
    line: "Plan an event and book your team", pitch: "Planning a party? Find your team and create your Event Card in minutes.", cta: "Plan an event" },
  { key: "vip",   name: "FF VIP",   domain: "ffvip.uk",   url: "https://ffvip.uk",   tier: "standard", logo: FF_VIP_LOGO, locked: true,
    line: "Your VIP card, luxury experiences and rewards", pitch: "Create your VIP card, book luxury experiences and VIP tables, and earn FF Rewards. Launch party in Shoreditch, early 2027.", cta: "Join the guest list" },
];


/* The site-menu order, by the site the visitor is on. */
const SITE_ORDER17 = { party: ["party","vip","team","staff"], staff: ["staff","team","party","vip"], vip: ["vip","party","staff","team"], team: ["team","staff","party","vip"] };

const FF_SITE_BRAND = __ff_json("content/data/ff-site-brand.json");


function siteBrandKey(k) { return k === "biz" ? "staff" : (FF_SITE_BRAND[k] ? k : "team"); }


function SiteHeroCoin({ site }) {
  const b = FF_SITE_BRAND[siteBrandKey(site)];
  return <img decoding="async" src={b.hero} alt="" width={160} height={160} decoding="async" draggable={false} style={{ objectFit: "contain" }} />;
}



function useGoSite() {
  const { state, dispatch } = useStore();
  return (key, opts = {}) => {
    /* Sites not in PHASE1.sitesOpen say so and go nowhere. */
    if (!p1SiteOpen(key)) { dispatch({ type: "TOAST", toast: `${p1SiteName(key)} is coming in 2027` }); return; }
    /* FF Staff and FF Party are both hirer sites: one account, two sites. */
    if (key === "staff" || key === "party") {
      dispatch({ type: "ROLE", role: "staff", site: key });
      window.scrollTo(0, 0);
      return;
    }
    if (key === "team") {
      if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
      dispatch({ type: "TAB", tab: opts.to === "profile" ? "profile" : "home", route: opts.to === "profile" ? "home" : undefined });
      window.scrollTo(0, 0);
      return;
    }
    /* FF VIP is its own site: role "vip", with its own four pages. */
    if (key === "vip") {
      if (state.role !== "vip") dispatch({ type: "ROLE", role: "vip" });
      dispatch({ type: "TAB", tab: "home" });
      window.scrollTo(0, 0);
    }
  };
}



/* Signed in? Then early-access forms don't ask for a number: the person
   just confirms. Returns null when signed out. */
function signedInAs(state) {
  if (!state.auth || state.auth.status !== "signedIn") return null;
  const tag = state.auth.tag || state.session.tag || "";
  return { tag, phone: state.session.phone || null };
}




const maskNumber = (n) => (n ? `•••• ${String(n).replace(/\D/g, "").slice(-3)}` : "");


const longDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? "" : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};




/* --- What FireFlair is --------------------------------------------------- */

function PromiseMark({ mark, size = 24 }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      {mark === "connect" && (<>
        <circle cx="8.6" cy="12" r="5" {...p} />
        <circle cx="15.4" cy="12" r="5" {...p} />
        <path d="M12 8.3v7.4" {...p} strokeWidth="1.1" opacity=".7" />
      </>)}
      {mark === "profile" && (<>
        <rect x="5" y="3.4" width="14" height="17.2" rx="2" {...p} />
        <circle cx="12" cy="9.6" r="2.7" {...p} />
        <path d="M8 16.6c.8-2.1 2.2-3.1 4-3.1s3.2 1 4 3.1" {...p} />
      </>)}
      {mark === "reviews" && (
        <path d="M12 3.8l2.45 5 5.5.8-3.98 3.88.94 5.48L12 16.36l-4.91 2.6.94-5.48L4.05 9.6l5.5-.8z" {...p} />
      )}
      {mark === "bookings" && (<>
        <rect x="4" y="5.6" width="16" height="14.4" rx="1.6" {...p} />
        <path d="M4 9.8h16M8.2 3.6v3.6M15.8 3.6v3.6" {...p} />
        <path d="M9.2 14.8l2 2 3.8-4" {...p} />
      </>)}
    </svg>
  );
}
