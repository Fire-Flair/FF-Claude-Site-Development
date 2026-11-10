/* src/components/shared/home-scenes.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const sceneRnd = (seed, i) => { const x = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453; return x - Math.floor(x); };


function SceneCoupe({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 0h44c0 17-10 27-22 27S0 17 0 0z M22 27v28 M8 55h28" /></g>; }


function SceneHigh({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M0 0h28l-3 56H3z M4 14h20" /></g>; }


function SceneShaker({ x, y, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d="M7 0h14l-1 12H8z M3 12h22l-3 46H6z" /></g>; }


function SceneBottle({ x, y, h = 70, s = 1 }) { return <g transform={`translate(${x} ${y}) scale(${s})`}><path d={`M8 0h8v${h * .32}l5 8v${h * .6}H3V${h * .32 + 8}l5-8z`} /></g>; }


function HomeScene({ kind = "bar" }) {
  const seed = kind.length * 7 + kind.charCodeAt(0);
  const dots = Array.from({ length: 24 }, (_, i) => ({ x: sceneRnd(seed, i) * 400, y: sceneRnd(seed, i + 40) * 190 + 6, r: 5 + sceneRnd(seed, i + 80) * 20, o: .06 + sceneRnd(seed, i + 120) * .2, c: i % 3 ? "#E7C566" : "#F4EBD6" }));
  const fest = kind === "festival";
  return (
    <svg className="ff-scene" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.c} opacity={d.o} />)}
      {fest ? (<g>
        <path d="M-10 40 Q100 110 200 56 T410 50" fill="none" stroke="#C9A227" strokeOpacity=".55" strokeWidth="1.4" />
        {[18, 62, 108, 154, 200, 246, 292, 338, 382].map((x, i) => <circle key={i} cx={x} cy={52 + Math.sin(i * 1.1) * 22 + 22} r="5" fill="#F7E3A0" opacity=".9" />)}
        <g fill="rgba(244,235,214,.07)" stroke="#C9A227" strokeOpacity=".5" strokeWidth="1.2"><path d="M20 250 L110 168 L200 250z" /><path d="M170 250 L270 150 L370 250z" /></g>
        <rect x="0" y="244" width="400" height="56" fill="#0E0809" /><rect x="0" y="244" width="400" height="3" fill="#C9A227" opacity=".7" />
        <g fill="rgba(244,235,214,.08)" stroke="#E7C566" strokeWidth="1.4" strokeLinejoin="round"><SceneCoupe x={120} y={196} s={.7} /><SceneHigh x={186} y={200} s={.75} /><SceneShaker x={238} y={190} s={.75} /><SceneHigh x={290} y={200} s={.75} /></g>
      </g>) : (<g>
        <rect x="0" y="238" width="400" height="62" fill="#0E0809" /><rect x="0" y="238" width="400" height="3" fill="#C9A227" opacity=".7" />
        <g fill="rgba(244,235,214,.07)" stroke="#E7C566" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
          <SceneBottle x={26} y={150} h={80} /><SceneBottle x={58} y={162} h={68} s={.95} /><SceneBottle x={92} y={146} h={86} />
          <SceneCoupe x={158} y={186} /><SceneShaker x={232} y={176} s={1.1} /><SceneHigh x={290} y={180} s={1.05} /><SceneBottle x={346} y={156} h={78} />
        </g>
      </g>)}
    </svg>
  );
}



/* ---- Hero ---------------------------------------------------------------- */

/* ---- Carousel with controls + swipe ---------------------------------------- */
function HomeCarousel({ label, children }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useDragScroll(ref);
  const upd = () => { const el = ref.current; if (!el) return; setEdge({ start: el.scrollLeft < 12, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 12 }); };
  useEffect(() => { upd(); const el = ref.current; if (!el) return; el.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); return () => { el.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); }; }, []);
  const by = (dir) => { const el = ref.current; if (el) el.scrollBy({ left: dir * Math.max(220, el.clientWidth * .8), behavior: "smooth" }); };
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className="ff-hc" role="region" aria-roledescription="carousel" aria-label={label}>
      <button type="button" className="ff-hc-btn prev" aria-label="Previous" disabled={edge.start} onClick={() => by(-1)}><ChevronLeft size={18} /></button>
      <div className="ff-hc-track" ref={ref} tabIndex={0}>
        {items.map((c, i) => <div className="ff-hc-item" key={i}>{c}</div>)}
      </div>
      <button type="button" className="ff-hc-btn next" aria-label="Next" disabled={edge.end} onClick={() => by(1)}><ChevronRight size={18} /></button>
    </div>
  );
}


const HOME_FEATURED = ["stf_sam", "stf_pri", "stf_mia", "stf_tom", "stf_don", "stf_ava", "stf_leo", "stf_jam"];


function HomeFeatured() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const people = HOME_FEATURED.map((id) => directory.find((p) => p.id === id) || (state.directory || []).find((p) => p.id === id)).filter(Boolean);
  const goNetwork = () => {
    dispatch({ type: "NET_QUERY", q: "" });
    dispatch({ type: "TAB", tab: "network" });
    window.scrollTo(0, 0);
  };
  return React.createElement("section", {
    className: "ff-sect ff-feat17",
    id: "ff-team",
    "aria-labelledby": "ff-feat17-h"
  }, React.createElement("div", {
    className: "ff-feat17-head"
  }, React.createElement("h2", {
    id: "ff-feat17-h",
    className: "ff-h1"
  }, "Featured professionals"), React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: goNetwork
  }, "See everyone ", React.createElement(ArrowRight, {
    size: 13
  }))), React.createElement(HomeCarousel, {
    label: "Featured professionals"
  }, people.map((p) => React.createElement(PlayerTile, {
    key: p.id,
    person: p,
    onClick: () => {
      dispatch({ type: "VIEW", id: p.id });
      window.scrollTo(0, 0);
    }
  }))));
}




/* ---- v1.8: What is FireFlair? — the master brand, told mostly by type ------
   Fire is momentum, Flair is the people (Brand & Identity v1.1). The wordmark
   carries the lighter catch of gold across "AI". */
const FF_WORDMARK = <>FIREFL<span className="ai">AI</span>R</>;





/* ---- FireFlair Teams (new) -------------------------------------------------- */

/* ---- Built on real relationships -------------------------------------------- */
function HomeRelationships() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const by = (id) => directory.find(p => p.id === id) || (state.directory || []).find(p => p.id === id);
  const crew = ["stf_ava", "stf_sam", "stf_leo", "stf_pri"].map(by).filter(Boolean);
  const goNetwork = () => { dispatch({ type: "NET_QUERY", q: "" }); dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); };
  return (
    <section className="ff-sect ff-rel17 ff-cv18" id="ff-relationships" aria-labelledby="ff-rel17-h">
      <div className="ff-cv18-box">
        <span className="ff-cv18-eye">Community verification</span>
        <h2 id="ff-rel17-h" className="ff-cv18-h">Verified by the people you work with.</h2>
        <div className="ff-cv18-vis" aria-hidden="true">
          <div className="ppl">{crew.map(p => <span key={p.id}><Portrait src={p.photo} name={p.name} size={46} tier={p.tier} /></span>)}</div>
          <div className="rec"><Check size={14} strokeWidth={2.6} /> Recommended</div>
          <div className="lvl">
            <div><Coin size={44} tier="bronze" /><small>Bronze</small></div>
            <i><ArrowRight size={14} /></i>
            <div><Coin size={44} tier="silver" /><small>Silver</small></div>
            <i><ArrowRight size={14} /></i>
            <div><Coin size={44} tier="gold" /><small>Gold</small></div>
          </div>
        </div>
        <p className="ff-cv18-t">Recommendations from colleagues you know and like raise your level.</p>
        <Btn variant="onDark" onClick={goNetwork}><Users size={14} /> Explore the network</Btn>
      </div>
    </section>
  );
}


function HomeMapSection() {
  const { dispatch } = useStore();
  const goMap = () => {
    dispatch({ type: "NET_QUERY", q: "" });
    dispatch({ type: "TAB", tab: "network" });
    window.scrollTo(0, 0);
    setTimeout(() => {
      const el = document.getElementById("ff-netmap");
      if (el)
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }, 150);
  };
  return React.createElement("section", {
    className: "ff-sect ff-mapbox",
    id: "ff-map",
    "aria-label": "Where FireFlair is"
  }, React.createElement("button", {
    type: "button",
    className: "ff-mapbox-btn",
    onClick: goMap
  }, React.createElement("span", {
    className: "ff-mb-head"
  }, React.createElement("b", null, "Put yourself on the map."), React.createElement("small", null, "Launching in the UK. Building a worldwide network of bartenders.")), React.createElement("span", {
    className: "ff-mb-vis"
  }, React.createElement("span", {
    className: "uk"
  }, React.createElement("img", { decoding: "async",
    className: "ff-mb-snap",
    src: (window.FF_IMG || {}).map_uk,
    alt: "Map of the UK with FireFlair profiles",
    loading: "eager",
    decoding: "async"
  }), React.createElement("em", null, "UK · Live")), React.createElement("span", {
    className: "gl"
  }, React.createElement("img", { decoding: "async",
    className: "ff-mb-snap",
    src: (window.FF_IMG || {}).map_world,
    alt: "World map",
    loading: "eager",
    decoding: "async"
  }), React.createElement("em", null, "Worldwide · Search anywhere"))), React.createElement("span", {
    className: "ff-mb-foot"
  }, "Hospitality travels. So does your profile.", React.createElement(ChevronRight, {
    size: 16,
    "aria-hidden": "true"
  }))));
}



/* ---- Dream jobs / Training / Rewards: tiles into the Booking screen ---------- */


/* ---- v1.7.1: Beta badge and the feedback screen -------------------------------
   The badge sits by Log in. It opens a feedback sheet built on the existing
   Question Cards (the feedback group), for signed-in people only. */
function BetaBadge() {
  return (
    <button type="button" className="ff-beta" onClick={() => window.dispatchEvent(new Event("ff-feedback"))} aria-label="Beta V1.1 — give feedback">
      Beta V1.1
    </button>
  );
}


function FeedbackSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [q, setQ] = useState(null);
  const signed = state.auth && state.auth.status === "signedIn";
  const qs = QUESTIONS.filter(x => x.group === "feedback");
  const done = qs.filter(x => isAnswered(answerOf(state, x))).length;
  if (!open) return null;
  const login = () => { onClose(); setTimeout(() => window.dispatchEvent(new Event("ff-login")), 50); };
  return (
    <>
      <Sheet open onClose={onClose} title="Beta feedback">
        <p className="ff-body" style={{ margin: "0 0 4px" }}>FireFlair is in <b>Beta V1.1</b>. Your answers help us improve it.</p>
        {!signed ? (
          <div className="ff-panel" style={{ marginTop: 12 }}>
            <p className="ff-body" style={{ margin: "0 0 12px" }}>Log in to leave feedback.</p>
            <Btn variant="primary wide" onClick={login}><User size={14} /> Log in</Btn>
          </div>
        ) : (<>
          <p className="ff-body ff-muted" style={{ fontSize: 12.5, margin: "0 0 10px" }}>{done} of {qs.length} answered. Tap a card to answer.</p>
          <HScroll label="Feedback questions" snap>
            {qs.map(x => <QuestionCard key={x.id} q={x} answer={answerOf(state, x)} onClick={() => setQ(x)} />)}
          </HScroll>
        </>)}
      </Sheet>
      <QuestionSheet open={!!q} q={q} onClose={() => setQ(null)} />
    </>
  );
}



/* ---- v1.7.1: Dream jobs / Training / Rewards swipe carousels (Home) -------------
   A picture with its title on the card. The section heading sits above, not on
   the card. "Open" (or a tap on any card) goes to that section of the Booking
   screen, where interest is registered. */
const swipeImgs = () => {
  /* v17.3.81: the base images are the originals (FF_IMG_AI), so a card never repeats a photo
     used elsewhere on FF Team; a card with its own library photo (in_tr_*, in_dj_*, in_rw_*) shows that. */
  const I = window.FF_IMG_AI || window.FF_IMG || {}, F = window.FF_IMG || {};
  const base = {
    jobs: { music_festivals: I.dream_music_festivals, food_festivals: I.dream_food_festivals_markets, sports: I.dream_sports_events, motorsport: I.dream_motorsport, international: I.dream_international_events, yachts: I.dream_yacht_jobs, after_dark: I.dream_after_dark, flair: I.dream_flair_jobs },
    training: { intro_cocktails: I.training_cocktail_basics, mixology: I.training_mixology, wset_spirits: I.training_spirits_qualification, wset_wine: I.training_wine_qualification, brand_training: I.training_brand_training, ff_open_class: I.training_ff_open_class, ff_open_bar: I.training_ff_open_bar, ff_masterclass: I.training_masterclass },
    rewards: { bar_shows: I.reward_bar_shows, training: I.reward_training_tickets, amex: I.reward_amex_card, nfc: I.reward_nfc_card, kit: I.reward_bar_kit, car: I.reward_car_rental, party: I.reward_ff_party, shoot: I.reward_photoshoot },
  };
  const own = (pre, m) => { const r = {}; for (const k in m) r[k] = F[pre + k] || m[k]; return r; };
  return { jobs: own("in_dj_", base.jobs), training: own("in_tr_", base.training), rewards: own("in_rw_", base.rewards) };
};


function SwipeCarousel({ section, title, icon: Icon, items, onOpen }) {
  const ref = useRef(null);
  const [active, setActive] = useState(0);
  const [moved, setMoved] = useState(false);
  const [edge, setEdge] = useState({ start: true, end: false });
  useDragScroll(ref);
  const upd = () => {
    const el = ref.current; if (!el) return;
    const kids = [...el.children]; let best = 0, d = 1e9;
    kids.forEach((k, i) => { const x = Math.abs(k.offsetLeft - el.scrollLeft - 4); if (x < d) { d = x; best = i; } });
    setActive(best);
    setEdge({ start: el.scrollLeft < 12, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 12 });
    if (el.scrollLeft > 20) setMoved(true);
  };
  useEffect(() => { upd(); const el = ref.current; if (!el) return; el.addEventListener("scroll", upd, { passive: true }); window.addEventListener("resize", upd); return () => { el.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); }; }, []);
  const by = (dir) => { const el = ref.current; if (el) el.scrollBy({ left: dir * Math.max(200, el.clientWidth * .8), behavior: "smooth" }); };
  const Swipe = pickIcon("MoveHorizontal", "ChevronsLeftRight", "Hand");
  return (
    <section className={`ff-sw18 ${section}`} aria-label={title}>
      <header className="ff-sw18-head">
        <span className="ico" aria-hidden="true"><Icon size={18} strokeWidth={1.6} /></span>
        <h3>{title}</h3>
        <span className={`hint${moved ? " gone" : ""}`} aria-hidden="true"><Swipe size={15} strokeWidth={1.8} /><span className="lbl">Swipe</span></span>
        <button type="button" className="open" onClick={onOpen}>Open <ArrowRight size={13} /></button>
      </header>
      <div className="ff-sw18-stage">
        <button type="button" className="ff-sw18-btn prev" aria-label={`Previous ${title}`} disabled={edge.start} onClick={() => by(-1)}><ChevronLeft size={18} /></button>
        <div className="ff-sw18-track" ref={ref} tabIndex={0} role="group" aria-roledescription="carousel" aria-label={`${title} carousel`}>
          {items.map(it => (
            <button key={it.id} type="button" className="ff-sw18-card" onClick={onOpen} aria-label={`${it.title}. Open ${title}`}>
              {it.img ? <img decoding="async" src={it.img} alt="" loading="eager" draggable="false" /> : <HomeScene kind="bar" />}
              <span className="shade" aria-hidden="true" />
              <span className="t">{it.title}</span>
            </button>
          ))}
        </div>
        <button type="button" className="ff-sw18-btn next" aria-label={`Next ${title}`} disabled={edge.end} onClick={() => by(1)}><ChevronRight size={18} /></button>
      </div>
      <div className="ff-sw18-dots" aria-hidden="true">{items.map((it, i) => <i key={it.id} className={i === active ? "on" : ""} />)}</div>
    </section>
  );
}


function HomeBookingTiles({ only }) {
  const { dispatch } = useStore();
  const imgs = swipeImgs();
  const sets = [
    { section: "training", id: "ff-training", title: "Training", icon: Award, list: TRAINING_COURSES, map: imgs.training },
    { section: "jobs", id: "ff-jobs", title: "Dream jobs", icon: Plane, list: DREAM_JOBS, map: imgs.jobs },
    { section: "rewards", id: "ff-rewards", title: "Rewards", icon: Sparkles, list: XP_REWARDS, map: imgs.rewards },
  ];
  return (
    <section className={`ff-sect ff-bt17 ff-bt18${only ? " one" : ""}`} id={only && only !== "training" ? `ff-booktiles-${only}` : "ff-booktiles"}
      aria-label={only ? (sets.find(s => s.section === only) || {}).title : "Training, dream jobs and rewards"}>
      <div className="ff-bt18-grid">
        {sets.filter(s => !only || s.section === only).map(s => (
          <SwipeCarousel key={s.section} section={s.section} title={s.title} icon={s.icon}
            items={s.list.map(x => ({ id: x.id, title: x.title, img: s.map[x.id] }))}
            onOpen={() => goBookingSection(dispatch, s.id)} />
        ))}
      </div>
    </section>
  );
}



/* ---- v1.7.1: the Team card ---------------------------------------------------- */
function TeamCard17({ name, tag, url, members, more = 0 }) {
  return (
    <article className="ff-tc17" aria-label={`Team card: ${name}`}>
      <span className="ff-tc17-label">Team</span>
      <span className="ff-tc17-coin"><Coin size={26} tier="gold" /></span>
      <div className="ff-tc17-faces">
        {members.slice(0, 4).map(p => <span key={p.id} className="f"><Portrait src={p.photo} name={p.name} size={60} tier={p.tier} /></span>)}
        {more > 0 && <span className="f more">+{more}</span>}
      </div>
      <h3 className="ff-tc17-name">{name}</h3>
      <span className="ff-tc17-tag">{tag}</span>
      <span className="ff-tc17-url">{url}</span>
    </article>
  );
}


function HomeTeams() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const pick = (ids) => ids.map(id => directory.find(p => p.id === id)).filter(Boolean);
  const trio = pick(["stf_don", "stf_ava", "stf_leo"]);
  const crew = pick(["stf_sam", "stf_pri", "stf_mia", "stf_tom"]);
  const mine = state.role === "team" && state.profile.live;
  const IMG = window.FF_IMG || {};
  const goProfile = () => { if (state.role !== "team") dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };
  const goNetwork = () => { dispatch({ type: "NET_QUERY", q: "" }); dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); };
  return (
    <section className="ff-sect ff-teams17" id="ff-teams" aria-labelledby="ff-teams17-h">
      <div className="ff-hi ff-teams17-img">
        {IMG.teams ? <img decoding="async" className="ff-hi-img" src={IMG.teams} alt="" loading="eager" /> : <HomeScene kind="festival" />}
        <div className="ff-hi-shade" aria-hidden="true" />
        <div className="ff-teams17-cap">
          <div className="ff-eyebrow">FireFlair Teams</div>
          <h2 id="ff-teams17-h" className="ff-teams17-h">Your people. Your team. Your events.</h2>
          <p>Build your network, bring your team together and pursue event bookings.</p>
        </div>
      </div>
      <ol className="ff-teams17-flow" aria-label="From individuals to a team to a live event">
        <li>
          <div className="vis people">{trio.map(p => <span key={p.id}><Portrait src={p.photo} name={p.name} size={52} tier={p.tier} /></span>)}</div>
          <b>Individuals</b><small>Your Profile Card</small>
        </li>
        <li className="arr" aria-hidden="true"><ArrowRight size={18} /></li>
        <li>
          <div className="vis team"><TeamCard17 name="The Dream Team" tag="Weddings & festivals" url={`${CARD_DOMAIN}/dreamteam`} members={crew} more={3} /></div>
          <b>Team</b><small>Bring your people together</small>
        </li>
        <li className="arr" aria-hidden="true"><ArrowRight size={18} /></li>
        <li>
          <div className="vis live">{IMG.dream_music_festivals ? <img decoding="async" src={IMG.dream_music_festivals} alt="" loading="eager" /> : <HomeScene kind="festival" />}<span className="shade" aria-hidden="true" /></div>
          <b>Live event</b><small>Pursue bookings together</small>
        </li>
      </ol>
      <div className="ff-teams17-cta">
        <Btn variant="primary" onClick={goProfile}><User size={14} /> {mine ? "My Profile Card" : "Create your Profile Card"}</Btn>
        <Btn onClick={goNetwork}><Users size={14} /> Explore the network</Btn>
      </div>
    </section>
  );
}



/* ---- v1.7.1: What's next — images, and real cards as previews ------------------- */
function InertBox({ className, children }) {
  const r = useRef(null);
  useEffect(() => { if (r.current) r.current.setAttribute("inert", ""); }, []);
  return <div ref={r} className={className} aria-hidden="true">{children}</div>;
}





const interestCfg = (kind) => {
  const I = swipeImgs();
  if (kind === "training") return {
    id: "ff-training-sect", boxed: true, eyebrow: "Training", title: "Learn, qualify, get booked.",
    lede: "Courses and training events for every level, from your first cocktail to an internationally recognised qualification. Qualifications you earn go on your profile, so clients can find you by them.",
    list: TRAINING_COURSES, imgs: I.training, stateKey: "trainingInterest", action: "TRAINING_INTEREST", idsKey: "courses", ownKey: "own",
    ownLabel: "Anything else you'd like to learn?", ownPh: "A course or skill…", empty: "Choose a training event above, or add your own.",
    ok: "Interest registered", follow: "We'll tell you when dates are set.", noun: "training",
  };
  if (kind === "jobs") return {
    id: "ff-jobs-sect", boxed: "dark", eyebrow: "Dream jobs", title: "The jobs you actually want.",
    lede: "FireFlair: we're here to work with you. Register your interest and we'll go out there, negotiate the best rate for you and get you the work. When you get work, we get paid too. Win-win.",
    list: DREAM_JOBS, imgs: I.jobs, stateKey: "jobsInterest", action: "JOBS_INTEREST", idsKey: "jobs", ownKey: "dream",
    ownLabel: "What's your dream hospitality job?", ownPh: "Your dream job…", empty: "Choose a job above, or tell us your dream job.",
    ok: "Interest registered. We'll find you the work.", follow: "We'll go out and find the work.", noun: "jobs",
  };
  return {
    id: "ff-rewards-sect", boxed: "dark", eyebrow: "FF Rewards", title: "Rewards for growing FireFlair.",
    lede: "Verification helps you get bookings. We're also building rewards for the people who grow FireFlair. Tell us what you'd want — the rewards with the most interest come first.",
    list: XP_REWARDS, imgs: I.rewards, stateKey: "rewardsInterest", action: "P1_REWARDS_INTEREST", idsKey: "rewards", ownKey: "own",
    ownLabel: "What reward would help you most?", ownPh: "Your own reward idea…", empty: "Choose a reward above, or suggest your own.",
    ok: "Interest registered — we'll tell you when FF Rewards open", follow: "We'll tell you when FF Rewards open.", noun: "rewards",
  };
};


/* Inside a drop-down box on Bookings: the same interest section, without its own heading or dark panel. */
function InterestInner({ id, lede, children }) {
  return (
    <div id={id}>
      {lede && <p className="ff-body" style={{ margin: "0 0 14px", fontSize: 13.5 }}>{lede}</p>}
      {children}
    </div>
  );
}



function InterestSection({ kind, inner }) {
  const c = interestCfg(kind);
  const { state, dispatch } = useStore();
  const who = signedInAs(state);
  const acct = who ? (who.tag || "me") : null;
  const raw = state[c.stateKey];
  const reg = who && raw && (!raw.account || raw.account === acct) ? raw : null;
  const [picked, setPicked] = useState(reg ? (reg[c.idsKey] || []) : []);
  const [own, setOwn] = useState(reg ? (reg[c.ownKey] || []) : []);
  const [v, setV] = useState("");
  const [editing, setEditing] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (reg) { setPicked(reg[c.idsKey] || []); setOwn(reg[c.ownKey] || []); }
  }, [acct, !!reg]);
  const toggle = (id) => { setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); setErr(null); if (reg) setEditing(true); };
  const addOwn = () => {
    const t = v.trim().slice(0, 60);
    if (!t) return own;
    return own.some(x => x.toLowerCase() === t.toLowerCase()) ? own : [...own, t];
  };
  const submit = () => {
    const nextOwn = addOwn();
    if (!picked.length && !nextOwn.length) { setErr(c.empty); return; }
    dispatch({ type: c.action, interest: { [c.idsKey]: picked, [c.ownKey]: nextOwn, account: acct, at: Date.now() } });
    dispatch({ type: "TOAST", toast: c.ok });
    setOwn(nextOwn); setV(""); setErr(null); setEditing(false);
  };
  const withdraw = () => {
    dispatch({ type: c.action, interest: null });
    dispatch({ type: "TOAST", toast: "Interest withdrawn" });
    setPicked([]); setOwn([]); setV(""); setErr(null); setEditing(false);
  };
  const login = () => window.dispatchEvent(new Event("ff-login"));
  const goProfile = () => { if (state.role !== "team") dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };
  const names = (ids) => ids.map(id => (c.list.find(x => x.id === id) || {}).title).filter(Boolean);
  const count = picked.length + own.length;
  const showBar = who && (!reg || editing);
  const Wrap = inner ? InterestInner : Sect;
  return (
    <Wrap id={c.id} boxed={c.boxed} eyebrow={c.eyebrow} title={c.title} lede={c.lede}>
      <div className="ff-courses ff-courses-img">
        {c.list.map(x => (
          <FlipChoice17 key={x.id} kind={x.kind} title={x.title} note={x.note} img={c.imgs[x.id]} on={picked.includes(x.id)} onClick={() => toggle(x.id)} />
        ))}
      </div>
      <div className={`ff-panel ff-champagne ff-ireg ${!who ? "out" : reg && !editing ? "done" : "edit"}`} style={{ marginTop: 16 }}>
        {!who ? (<>
          <div className="ff-label">Register your interest</div>
          <p className="ff-body" style={{ margin: "6px 0 12px" }}>Log in or create your Profile Card to register your interest.</p>
          <div className="ff-ireg-acts">
            <Btn variant="primary" onClick={login}><User size={14} /> Log in</Btn>
            <Btn onClick={goProfile}>Create your Profile Card</Btn>
          </div>
        </>) : !showBar ? (<>
          <div className="ff-ireg-top"><Pill tone="ok"><Check size={11} strokeWidth={2.6} /> Registered</Pill></div>
          <p className="ff-body" style={{ margin: "8px 0 4px" }}>{[...names(reg[c.idsKey] || []), ...(reg[c.ownKey] || [])].join(", ")}.</p>
          <p className="ff-body" style={{ margin: "0 0 12px" }}>{c.follow}</p>
          <div className="ff-ireg-acts">
            <Btn variant="sm ghost" onClick={() => setEditing(true)}><Pencil size={12} /> Change</Btn>
            <Btn variant="sm ghost" onClick={withdraw}><X size={12} /> Withdraw</Btn>
          </div>
          <p className="ff-body ff-muted ff-ireg-proto">Prototype: saved on this device. Saving to your account needs the backend.</p>
        </>) : (<>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div className="ff-label" style={{ flex: 1 }}>Register your interest</div>
            <Pill tone="gold">{count} selected</Pill>
          </div>
          {own.length > 0 && (
            <div className="ff-dreamlist" style={{ marginTop: 8 }}>
              {own.map(d => (
                <span key={d} className="ff-dreamchip">{d}
                  <button type="button" aria-label={`Remove ${d}`} onClick={() => { setOwn(own.filter(x => x !== d)); setErr(null); if (reg) setEditing(true); }}><X size={12} /></button>
                </span>
              ))}
            </div>
          )}
          <label className="ff-label ff-ireg-l" htmlFor={`${c.id}-own`}>{c.ownLabel}</label>
          <div className="ff-ireg-bar">
            <input id={`${c.id}-own`} className="ff-input" value={v} maxLength={60} placeholder={c.ownPh}
              onChange={(e) => { setV(e.target.value); setErr(null); }} onKeyDown={(e) => e.key === "Enter" && submit()} />
            <Btn variant="primary" onClick={submit}>Submit</Btn>
          </div>
          {err && <p className="ff-body" role="alert" style={{ margin: "8px 0 0", fontSize: 12.5, color: "var(--bad)" }}>{err}</p>}
        </>)}
      </div>
    </Wrap>
  );
}



/* ---- v1.7.1: FireFlair — compact everywhere, with a prototype chat panel ----------------
   No AI model is connected. Question-like messages open a chat panel under the
   bar with clearly labelled prototype responses; plain keyword searches work
   exactly as before. FireFlair will later be powered by the same chatbot as the
   WhatsApp assistant. */
const FFAI_ASK = "What can you do?";


function ffaiIntent(raw) {
  const t = String(raw || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!t) return null;
  const words = t.split(" ").length;
  if (/\b(what can you do|what do you do|what are you|who are you|how do(es)? (this|it|you) work|what is ff ?ai|what is fireflair)\b/.test(t) || t === "help" || /^help( me)?\b/.test(t)) return "capabilities";
  if (/^(hi|hello|hey|hiya|good (morning|afternoon|evening))\b/.test(t) && words <= 4) return "greet";
  if (/^(thanks|thank you|cheers)\b/.test(t)) return "thanks";
  const isQ = /\?\s*$/.test(t) || /^(who|what|where|when|why|how|can|could|do|does|is|are|will|would|should|tell me|show me|find me|i need|i want|i'm looking|im looking|looking for|can you)\b/.test(t) || words >= 6;
  if (!isQ) return null;
  if (/\bwhats ?app\b/.test(t)) return "whatsapp";
  if (/\b(train|training|course|courses|wset|masterclass|learn|qualification)\b/.test(t)) return "training";
  if (/\b(dream jobs?|festivals?|yachts?|motorsport|cruise|abroad|international)\b/.test(t)) return "jobs";
  if (/\b(rewards?|perks|xp|points)\b/.test(t)) return "rewards";
  if (/\b(profile card|my profile|my card|my cv|cv|create (a|my) (card|profile))\b/.test(t)) return "profile";
  if (/^(who|find( me)?|looking for|i'?m looking|im looking|i need (a|an|some|someone)|show me|tell me who)\b/.test(t)) return "find";
  if (/\b(book|booking|hire|hiring|party|parties|wedding|event|events|shift|shifts)\b/.test(t) && !/\b(bartenders?|chefs?|waiters?)\b/.test(t)) return "event";
  if (/\b(find|looking for|who|bartenders?|barista|chefs?|waiters?|waitress|staff|manager|host|dj|mixologist|flair|speaks?|spanish|french|london|manchester|available|near)\b/.test(t)) return "find";
  return "unknown";
}


function ffaiReply(it, raw) {
  const q = String(raw || "").trim();
  const R = {
    capabilities: { text: "I'm the FireFlair prototype. In the live version I'll be able to:", bullets: ["Search the network for people by name, profession, skill or area", "Fill in your Profile Card from a few sentences", "Point you to Training, Dream jobs and Rewards", "Answer questions about FireFlair, here and on WhatsApp"], actions: [{ label: "Search the network", go: "network" }, { label: "Create your Profile Card", go: "profile" }] },
    greet: { text: "Hello! I'm the FireFlair prototype. Try asking “What can you do?”", actions: [{ label: FFAI_ASK, ask: FFAI_ASK }] },
    thanks: { text: "You're welcome." },
    whatsapp: { text: "FireFlair will eventually be powered by the same assistant you can message on WhatsApp. It isn't connected here yet; this is a placeholder.", actions: [{ label: FFAI_ASK, ask: FFAI_ASK }] },
    training: { text: "Training is on the Booking screen. Log in there to register your interest.", actions: [{ label: "Open Training", go: "booking", id: "ff-training" }] },
    jobs: { text: "Dream jobs are on the Booking screen. Log in there to register your interest.", actions: [{ label: "Open Dream jobs", go: "booking", id: "ff-jobs" }] },
    rewards: { text: "Rewards are on the Booking screen. Log in there to register your interest.", actions: [{ label: "Open Rewards", go: "booking", id: "ff-rewards" }] },
    profile: { text: "Your Profile Card is how people find and book you.", actions: [{ label: "Open your Profile Card", go: "profile" }] },
    event: { text: "Booking a team for a party or an event is coming with FF Party and FF Staff. You can see what's next on Home.", actions: [{ label: "See what's next", go: "next" }] },
    find: { text: `I can't read a description yet, because no AI model is connected. For now I can run a keyword search for “${q.slice(0, 60)}”.`, actions: [{ label: "Search the network", go: "network", q }] },
    unknown: { text: "I don't have an answer for that yet; no AI model is connected in this prototype. Try “What can you do?”", actions: [{ label: FFAI_ASK, ask: FFAI_ASK }] },
  };
  return R[it] || R.unknown;
}


function FFAIChat({ msgs, onAct, onClose }) {
  const box = useRef(null);
  /* Show the latest question with its answer under it, from the top of the answer's question. */
  useEffect(() => {
    const el = box.current; if (!el) return;
    const us = el.querySelectorAll(".u");
    const last = us[us.length - 1];
    el.scrollTop = last ? Math.max(0, last.offsetTop - 4) : 0;
  }, [msgs.length]);
  return (
    <div className="ff-chat" role="log" aria-live="polite" aria-label="FireFlair conversation">
      <div className="ff-chat-bar">
        <span className="proto"><Coin size={14} tier="gold" /> Prototype · no AI model connected</span>
        <button type="button" className="x" aria-label="Close conversation" onClick={onClose}><X size={15} /></button>
      </div>
      <div className="ff-chat-msgs" ref={box}>
        {msgs.map((m, i) => m.role === "user"
          ? <div key={i} className="u">{m.text}</div>
          : (
            <div key={i} className="a">
              <span className="tag">Prototype response</span>
              <p>{m.text}</p>
              {m.bullets && <ul>{m.bullets.map(b => <li key={b}>{b}</li>)}</ul>}
              {m.actions && m.actions.length > 0 && <div className="acts">{m.actions.map(a => <button key={a.label} type="button" onClick={() => onAct(a)}>{a.label}</button>)}</div>}
            </div>
          ))}
      </div>
    </div>
  );
}



/* Scroll to a section of Home from anywhere (used by the FireFlair prototype replies). */
function goHomeSection(dispatch, id) {
  dispatch({ type: "TAB", tab: "home", route: "home" });
  window.scrollTo(0, 0);
  let tries = 0;
  const go = () => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); else if (++tries < 20) setTimeout(go, 50); };
  setTimeout(go, 60);
}
