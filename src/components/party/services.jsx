/* src/components/party/services.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* --- Service Cards (v16.13) --------------------------------------------------
   FireFlair's standard Service Cards carry from prices (Alex's figures). The
   Staffing Service is FF Staff's, and stays white. FireFlair users, both
   businesses and freelancers, will create their own Service Cards; the two
   examples are square, to set them apart from FireFlair's own. */
const PARTY_SERVICES = pkgServices17({ baseOnly: true });


const STAFFING_SERVICE = { ...pkgServices17({ all: true }).find(x => x.id === "svc_staffing"), site: "FF Staff", domain: "FFStaff.uk" };



function ServicePoster({ svc, price }) {
  return (
    <PosterCard tone={svc.tone} ribbon={(svc.kind === "package" || svc.id !== "svc_staffing" ? "Package Card" : "Service Card")} eyebrow={[(/^(bronze|silver|gold)$/i.test(svc.level) ? "" : svc.level), svc.site || "FF Party"].filter(Boolean).join(" · ")} title={svc.title} tagline={svc.tagline}
      rows={[
        { icon: <Sparkles size={17} />, label: "Includes", value: svc.includes },
        { icon: <Users size={17} />, label: "Ideal for", value: svc.ideal },
        { icon: <Clock size={17} />, label: "Duration", value: svc.time },
      ]}
      footer={<>
        {price && svc.from
          ? <span className="ff-poster-price"><small>From</small>{svc.from}</span>
          : <span className="ff-poster-small" style={{ margin: 0 }}>{svc.domain || "FFParty.uk"}</span>}
        <Pill tone="warn"><Lock size={10} /> Coming 2027</Pill>
      </>} />
  );
}



const OWN_SERVICE_EXAMPLES = [
  { id: "own_dj", personId: "stf_tom", theme: "burgundy", kind: "DJ", title: "Party DJ Set",
    text: "Music from first drinks to last dance, with speakers and lights. Tell Tom your must-plays and your never-plays." },
  { id: "own_photo", personId: "stf_jon", theme: "ivory", kind: "Photography", title: "Event Photography",
    text: "Natural, candid photos of your guests and the details, with an edited gallery the week after." },
];



/* A user's own Service Card: square, on the same card system as skills. */
function OwnServiceCard({ item, onClick }) {
  const p = item.person;
  const t = THEMES[item.theme] || THEMES.onyx;
  const first = String(p.name || "").split(" ")[0];
  return (
    <CardFrame as={onClick ? "button" : "div"} tier={p.tier} theme={t} ratio="1 / 1" className="sq ff-svcsq" onClick={onClick}
      style={{ width: CARD_W.svcsq, padding: "14px 14px 12px", display: "flex", flexDirection: "column", textAlign: "left" }}>
      <span className="ff-svcsq-top" style={{ color: t.sub }}>
        <span>Service Card</span>
        <span className="kind" style={{ borderColor: t.rule, color: t.ink }}>{item.kind}</span>
      </span>
      <span className="ff-svcsq-title" style={{ color: t.ink }}>{item.title}</span>
      <span className="ff-svcsq-desc" style={{ color: t.ink }}>{item.text}</span>
      <span className="ff-svcsq-by" style={{ borderTopColor: t.rule }}>
        <Portrait src={p.photo} name={p.name} size={34} tier={p.tier} />
        <span style={{ minWidth: 0 }}>
          <b style={{ color: t.ink }}>{p.name}</b>
          <small style={{ color: t.sub }}>Priced by {first}</small>
        </span>
      </span>
    </CardFrame>
  );
}






/* A FireFlair site's mark: its coin, or its own logo (FF VIP's platinum
   monogram). Locked sites carry a small lock. */
function SiteMark({ site, size = 30 }) {
  return (
    <span className="ff-sitemark" style={{ width: size, height: size }}>
      <img decoding="async" src={FF_SITE_BRAND[siteBrandKey(site.key)].icon} width={size} height={size} alt="" draggable={false} />
      {site.locked && <span className="lock" aria-hidden="true"><Lock size={Math.max(8, Math.round(size * .26))} strokeWidth={2.2} /></span>}
    </span>
  );
}



/* ==========================================================================
   SHINE CARDS (v16.14) — the look first made for the Training cards, now one
   family: each card has its own colourway, a metal edge, a gloss, a lit medal
   and a large watermark icon, a sheen that sweeps across on hover and a lift
   with a slight 3D tilt. ShineChoice = a card you tick (Training, Dream
   jobs); ShineSquare = a square card you open (Home feed, venues, family).
   ========================================================================== */
const Trophy = lucideIcon("Trophy"), Flag = lucideIcon("Flag"), Sailboat = lucideIcon("Sailboat"),
  Plane = lucideIcon("Plane"), Moon = lucideIcon("Moon"), Flame = lucideIcon("Flame"),
  UtensilsCrossed = lucideIcon("UtensilsCrossed"), Building2 = lucideIcon("Building2"), Newspaper = lucideIcon("Newspaper");






/* --- Training (v16.14: inside its own large square) ------------------------ */
const TRAINING_COURSES = [
  { id: "intro_cocktails", kind: "Course", icon: Martini, tone: "amber", title: "Introduction to Cocktails", note: "The classics, the bar tools and the core techniques. A first step for anyone new to the bar." },
  { id: "mixology", kind: "Course", icon: Martini, tone: "burgundy", title: "Mixology", note: "Balance, flavour and fresh ingredients, through to designing a cocktail menu of your own." },
  { id: "wset_spirits", kind: "Qualification", icon: Award, tone: "steel", title: "WSET Spirits", note: "Wine & Spirit Education Trust spirits qualifications, taught by an approved course provider." },
  { id: "wset_wine", kind: "Qualification", icon: Wine, tone: "violet", title: "WSET Wine", note: "Wine & Spirit Education Trust wine qualifications, taught by an approved course provider." },
  { id: "brand_training", kind: "Brand event", icon: Sparkles, tone: "emerald", title: "Spirit brand training", note: "Training events hosted by spirit brands: their spirits, their story and how to serve them." },
  { id: "ff_open_class", kind: "FireFlair event", coin: true, tone: "onyx", title: "FireFlair Open Class", note: "Open training sessions run by FireFlair for everyone in the network." },
  { id: "ff_open_bar", kind: "FireFlair event", coin: true, tone: "bronze", title: "FireFlair Open Bar", note: "Hands-on sessions behind the bar with other FF Team members." },
  { id: "ff_masterclass", kind: "FireFlair event", coin: true, tone: "platinum", title: "FireFlair Masterclass", note: "Led by experienced bartenders, one technique or spirit at a time." },
];



function TrainingSection() { return <InterestSection kind="training" />; }



/* --- Dream jobs (v16.14: replaces Festivals) ---------------------------------
   Eight kinds of job people actually want, picked like Training, plus a box
   for their own dream job. Registering interest tells FireFlair to go out,
   negotiate the best rate and find the work. After Dark is adults only and
   always opt-in. */
const DREAM_JOBS = [
  { id: "music_festivals", kind: "Festivals", icon: Music, tone: "electric", title: "Music festivals", note: "Main stages, VIP bars and backstage hospitality, all summer long." },
  { id: "food_festivals", kind: "Festivals", icon: UtensilsCrossed, tone: "ember", title: "Food festivals & markets", note: "Street food, night markets and tasting tents. Great food and big crowds." },
  { id: "sports", kind: "Events", icon: Trophy, tone: "pitch", title: "Sports events", note: "Hospitality boxes and members' bars at the races, the rugby, the tennis and the big matches." },
  { id: "motorsport", kind: "Events", icon: Flag, tone: "racing", title: "Motorsport", note: "Paddock clubs, team hospitality and grandstand bars on race weekends." },
  { id: "international", kind: "Travel", icon: Plane, tone: "sky", title: "International jobs", note: "Ski seasons, beach clubs and events abroad. Take your skills around the world." },
  { id: "yachts", kind: "Travel", icon: Sailboat, tone: "ocean", title: "Yacht jobs", note: "Charters and private yachts: cocktails at sea for a handful of guests." },
  { id: "after_dark", kind: "18+ only", icon: Moon, tone: "night", title: "After Dark", note: "Adults-only private parties, topless bartending and adult entertainment. Always opt-in: you set your own limits." },
  { id: "flair", kind: "Showtime", icon: Flame, tone: "fire", title: "Flair jobs", note: "Bottle flips and fire. Brand launches, shows and bars that want a performance." },
];



function JobsSection() { return <InterestSection kind="jobs" />; }



/* --- Review Cards (v16.14: "Verified by your community") -------------------
   Review any bartender you've worked with, or one you'd like to work with.
   The card goes to them on WhatsApp; nothing shows until they accept. Same
   questions as the Add to team sheet (v16.11). */
function ReviewCardSample({ from, to, worked, how, text, status, done }) {
  const first = (p) => String(p.name || "").split(" ")[0];
  return (
    <article className="ff-rvcard" aria-label={`Example Review Card from ${from.name} to ${to.name}`}>
      <div className="ff-rvcard-ribbon"><Star size={11} fill="currentColor" /> Review Card</div>
      <span className="ff-rvcard-coin"><FFLogo size={34} tier="gold" /></span>
      <div className="ff-rvcard-who">
        <span className="p"><Portrait src={from.photo} name={from.name} size={54} tier={from.tier} /><b>{first(from)}</b><small>{from.profession}</small></span>
        <span className="arrow" aria-hidden="true"><ArrowRight size={18} /></span>
        <span className="p"><Portrait src={to.photo} name={to.name} size={54} tier={to.tier} /><b>{first(to)}</b><small>{to.profession}</small></span>
      </div>
      <div className="ff-rvcard-kind">{worked ? "Worked together" : "Would love to work together"}</div>
      {worked && <div className="ff-rvcard-stars" aria-label="Five out of five">★★★★★</div>}
      <div className="ff-rvcard-rows">
        <div><span>Worked with {first(to)} before?</span><b className={worked ? "yes" : "soon"}>{worked ? "Yes" : "Not yet"}</b></div>
        <div><span>{worked ? "Work together again?" : `Want to work with ${first(to)}?`}</span><b className="yes">Yes</b></div>
        {how && <div><span>How is {first(to)} to work with?</span><b className="yes">{how}</b></div>}
      </div>
      <p className="ff-rvcard-quote">“{text}”</p>
      <div className={`ff-rvcard-foot${done ? " done" : ""}`}>{done ? <Check size={14} strokeWidth={2.6} /> : <WhatsAppIcon size={15} />} {status}</div>
    </article>
  );
}
