/* src/components/home/team-pillars.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   v17.9: FF Team home pillars. The copy is src/content/homepage/team-pillars.json (read through CONTENT_ADAPTER, see DX_TEAM in package-pages.jsx).
   This file holds the full section (one component, used on the home panel and on the /info/<slug> pages), the visuals that sit beside the text,
   the card row, the "Suggest a reward" question and the page itself. Visuals use the prototype's own live components, read-only. */
  const TP21_CSS = __ff_css("styles/team-pillars21.css");

  const P21I = {
    FileText: lucideIcon("FileText"), Globe: lucideIcon("Globe"), ArrowRight: lucideIcon("ArrowRight"), ArrowDown: lucideIcon("ArrowDown"),
    Lock: lucideIcon("Lock"), Check: lucideIcon("Check"), Timer: lucideIcon("Timer"), Plane: lucideIcon("Plane"), Trophy: lucideIcon("Trophy"),
    Martini: lucideIcon("Martini"), Camera: lucideIcon("Camera"), GraduationCap: lucideIcon("GraduationCap"), Package: lucideIcon("Package"),
    Nfc: lucideIcon("Nfc"), CalendarDays: lucideIcon("CalendarDays"), MapPin: lucideIcon("MapPin"), Ticket: lucideIcon("Ticket"),
    HeartHandshake: lucideIcon("HeartHandshake"), PartyPopper: lucideIcon("PartyPopper"), Briefcase: lucideIcon("Briefcase"),
    Building2: lucideIcon("Building2"), Calendar: lucideIcon("Calendar"), Award: lucideIcon("Award"), Plus: lucideIcon("Plus"),
    Users: lucideIcon("Users"), Lightbulb: lucideIcon("Lightbulb"), ChevronLeft: lucideIcon("ChevronLeft"), Gift: lucideIcon("Gift"), ChevronDown: lucideIcon("ChevronDown")
  };

  const P21_FIND = (slug) => {
    for (const pl of TP21.pillars) {
      if (pl.slug === slug) return { pl, s: null };
      const s = pl.sections.find((x) => x.slug === slug);
      if (s) return { pl, s };
    }
    return null;
  };
  const infoKnown21 = (slug) => !!P21_FIND(slug);
  const infoHref21 = (slug) => "#/ff-team/info/" + slug;
  const infoUrl21 = (slug) => FF_SEO.siteOrigins.team + "/info/" + slug;

  /* One history step per page. rt17Go keeps Back honest (it steps back when the page asked for is the one we came from). */
  function infoNav21(dispatch, slug) {
    rt17Go(infoHref21(slug));
    dispatch({ type: "V11_SET", patch: { infoPage21: { slug }, viewing: null, viewingCompany: null, fdArea: null, pkgPage: null, supportPage20: null } });
    try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  }

  function infoSeo21(state) {
    const f = state.infoPage21 && P21_FIND(state.infoPage21.slug);
    if (!f) return state.infoPage21 ? { page: "info-404", title: "Page not found | FF Team", description: "This FF Team page does not exist.", canonical: FF_SEO.siteOrigins.team + "/", robots: "noindex, nofollow", type: "website", jsonLd: null } : null;
    const x = f.s || f.pl;
    const url = infoUrl21(x.slug);
    const crumbs = [{ "@type": "ListItem", position: 1, name: "FF Team", item: FF_SEO.siteOrigins.team + "/" }, { "@type": "ListItem", position: 2, name: f.pl.t, item: infoUrl21(f.pl.slug) }];
    if (f.s) crumbs.push({ "@type": "ListItem", position: 3, name: f.s.h, item: url });
    return {
      page: f.s ? "info-section" : "info-pillar", title: x.seo.title, description: x.seo.description, canonical: url, robots: "index, follow", type: "website",
      jsonLd: [{ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: crumbs }]
    };
  }

  /* What a call to action does: the same destinations the pillars have always used. */
  function usePillarRun21(kind = "team") {
    const home = useHomeNav();
    const hire = useHireNav();
    const goSite = useGoSite();
    const { dispatch } = useStore();
    return (go) => {
      if (go[0] === "#") { const el = document.getElementById(go.slice(1)); if (el) el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" }); }
      else if (go.indexOf("site:") === 0) goSite(go.slice(5));
      else if (go === "profile") { if (kind === "team") home.goProfile(); else hire.toProfile(); }
      else if (go === "network") hire.toNetwork("");
      else if (go === "bookings") hire.toBookings();
      else if (go === "book") hire.toEvent();
      else if (go === "pkgs") pkgNav18(dispatch, "");
    };
  }
  /* FF Party: these three actions are locked in Phase 2, so their call to action is the locked button. */
  const P21_LOCKED_GO = ["book", "profile", "bookings"];

  const p21Person = (dir, id) => (dir || []).find((p) => p.id === id) || null;

  /* ---- Visuals ---------------------------------------------------------------------------------------------------------------- */
  /* v17.9.2: every visual sits on the right of its text (stacked under it on a phone). Buttons and ticks in the visuals are live
     but lead nowhere: they only show their pressed state. */
  /* Real FF Team members' public Profile Cards (ffteam.uk). Their data is in team-pillars.json "examples". */
  const p21Live = (x) => ({ level: 4, rating: null, reviews: 0, hasCar: false, availability: "open", qualifications: [], tier: "standard", photo: null, ...x, photo: (x.photo && (window.FF_IMG || {})[x.photo]) || null, profession: x.professions[0], group: "Bartenders", theme: "onyx" });
  const P21_CARD = p21Live(TP21.examples.card);
  const P21_TEAM = TP21.examples.team.map(p21Live);
  const useTog21 = (init) => { const [v, setV] = useState(init || {}); return [v, (k) => setV((o) => ({ ...o, [k]: !o[k] }))]; };

  function VisCvToProfile21({ dir }) {
    const me = P21_CARD;
    const IM = window.FF_IMG || {};
    const ph = me && me.photo ? me.photo : null;
    const ini = me ? String(me.name || "").trim().charAt(0).toUpperCase() : "";
    const down = <span className="pv-ar dn" aria-hidden="true"><P21I.ChevronDown size={26} strokeWidth={2.2} /></span>;
    return (
      <div className="pv pv-cv">
        <div className="pv-step">
          <b>Your CV</b>
          <span className="pv-doc" aria-hidden="true"><P21I.FileText size={22} strokeWidth={1.6} /><i /><i /><i /><i className="s" /><i /><i className="s" /></span>
        </div>
        {down}
        <div className="pv-step">
          <b>Profile Card</b>
          <InertBox className="pv-pcard">{me ? <PlayerCard person={me} /> : null}</InertBox>
        </div>
        {down}
        <div className="pv-step">
          <b>Profile page</b>
          {me ? (
            <div className="pv-ppage" aria-hidden="true">
              <span className="av">{ph ? <img src={ph} alt="" draggable={false} /> : ini}</span>
              <span className="nm">{me.name}</span>
              <span className="ti">{(me.professions || []).join(" · ")}</span>
              <span className="sec"><em>Skills</em>{(me.skills || []).concat(me.interests || []).map((x) => <u key={x}>{x}</u>)}</span>
              <span className="sec"><em>Based in</em>{(me.locations || []).map((x) => <u key={x}>{x}</u>)}</span>
              <span className="sec"><em>Languages</em>{(me.languages || []).map((x) => <u key={x}>{x}</u>)}</span>
            </div>
          ) : null}
        </div>
      </div>
    );
  }

  function VisShareTeam21({ dir }) {
    const me = P21_CARD;
    const crew = P21_TEAM;
    const [on, tog] = useTog21();
    const acts = [["Book", P21I.Calendar], ["Review", P21I.Award], ["Join", P21I.Plus]];
    return (
      <div className="pv pv-share">
        <div className="pv-wab">
          <div className="top"><WhatsAppIcon size={16} /> WhatsApp</div>
          <div className="bub">
            <InertBox className="pv-wcard">{me ? <PlayerCard person={me} /> : null}</InertBox>
            <span className="t">now</span>
          </div>
          <div className="pv-3b" role="group" aria-label="Profile Card actions">
            {acts.map(([t, Ic]) => <button key={t} type="button" className={on[t] ? "on" : ""} aria-pressed={!!on[t]} onClick={() => tog(t)}><Ic size={15} strokeWidth={1.9} /> {t}</button>)}
          </div>
        </div>
        <InertBox className="pv-row3">
          {crew.map((p) => <div key={p.id} className="pv-c3"><PlayerCard person={p} /></div>)}
        </InertBox>
      </div>
    );
  }

  function VisReviews21() {
    const rec = useMemo(() => ({ ...makeRecord("reviews", "5★ from Priya"), id: "demo_rv21", description: "Ran the bar at our launch night without a single hiccup. Fast, clean and great with the guests.", rating: 5, primary: true, readOnly: true }), []);
    const [a, setA] = useState({ w: true, a: true, h: "excellent" });
    const set = (k) => (v) => setA((o) => ({ ...o, [k]: v }));
    return (
      <div className="pv pv-rv">
        <InertBox className="ff-rvslide"><InformationCard record={rec} def={BASE_CATEGORIES.reviews} themeKey="onyx" pub="r" highlight rank="primary" /></InertBox>
        <div className="ff-tickqs pv-tq">
          <TickChoice id="pv-w" label="Have you worked with Simao before?" options={YES_NO} value={a.w} onChange={set("w")} />
          <TickChoice id="pv-a" label="Would you like to work with Simao again?" options={YES_NO} value={a.a} onChange={set("a")} />
          <TickChoice id="pv-h" label="How is Simao to work with?" options={HOW_TO_WORK.map((h) => ({ v: h.key, label: h.label }))} value={a.h} onChange={set("h")} />
        </div>
      </div>
    );
  }

  function VisMarketing21() {
    const IM = window.FF_IMG || {};
    return (
      <div className="pv pv-mk">
        {IM.pen_strip ? <img className="pv-pen" src={IM.pen_strip} alt="A black and gold FireFlair pen engraved Add FF, ffparty.uk" decoding="async" draggable={false} /> : null}
        <ul className="pv-pills" aria-label="Where your Profile Card is taken">
          {TP21.marketed.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}
        </ul>
      </div>
    );
  }

  function VisPartyPackages21() {
    const all = pkgServices17({ all: true, short: true });
    const order = ["svc_masterclass", "svc_flair", "svc_mixology", "svc_bartending", "svc_staffing"];
    const list = order.map((id) => all.find((x) => x.id === id)).filter(Boolean);
    return (
      <div className="pv pv-pk" aria-hidden="true">
        <div className="pv-scroll">
          {list.map((sv) => (
            <InertBox key={sv.id} className="pv-tile"><PkgTile17 sv={sv} on={false} onClick={() => {}} /></InertBox>
          ))}
        </div>
      </div>
    );
  }

  function VisOwnPackages21({ dir }) {
    const IM = window.FF_IMG || {};
    const jon = { id: "you", name: "Your name", tag: "you", tier: "standard", photo: null, profession: "Photographer", group: "Photographers" }; /* v17.12: an example service card, made by "you" */
    const ex = OWN_SERVICE_EXAMPLES.find((x) => x.id === "own_photo");
    const ck = ckAdapt17({ name: "Raspberry Mint Martini", glass: "martini", description: "Fresh raspberry and mint, shaken cold.", ingredients: ["50ml vodka", "20ml raspberry liqueur", "Fresh mint", "Garnish: raspberries"], photo: IM.cocktail_0 });
    return (
      <div className="pv pv-own" aria-hidden="true">
        <InertBox className="pv-sq">{jon && ex ? <OwnServiceCard item={{ ...ex, person: jon }} /> : null}</InertBox>
        <InertBox className="pv-ck"><Card17 kind="cocktail" tone="dark" plate="Signature Cocktail" size="sm" url="By you"><CocktailFront17 c={ck} /></Card17></InertBox>
      </div>
    );
  }

  /* A rate tile you can tick and type in. Nothing is saved. */
  function RateTile21({ name, cat }) {
    const [yn, setYn] = useState("");
    const [v, setV] = useState("");
    return (
      <div className="ff-tp17 grn prof" role="group" aria-label={name}>
        <span className="lv">{cat}</span>
        <b className="tt">{name}</b>
        <span className="in">{"Are you available for bookings as " + (/^[aeiou]/i.test(name) ? "an " : "a ") + name.toLowerCase() + "?"}</span>
        <span className="yn" role="group">
          {["Yes", "No"].map((o) => <button key={o} type="button" className={yn === o ? "on" : ""} aria-pressed={yn === o} onClick={() => setYn(o)}>{o}</button>)}
        </span>
        <span className="pay">
          <small>Your preferred hourly rate</small>
          <span className="rt"><span aria-hidden="true">£</span>
            <input type="text" inputMode="decimal" value={v} aria-label={"Your preferred hourly rate as " + name + ", pounds per hour"} onChange={(e) => setV(e.target.value.replace(/[^\d.]/g, "").slice(0, 7))} />
            <span>/hour</span></span>
        </span>
      </div>
    );
  }

  function VisRatesStaff21() {
    return (
      <div className="pv pv-rt">
        <div className="pv-rates"><RateTile21 name="Bartender" cat="Bar" /><RateTile21 name="DJ" cat="Music" /></div>
        <ul className="pv-routes">
          <li><b>FF Party</b><span>Private clients book set-price packages</span></li>
          <li><b>FF Staff</b><span>Businesses hire you at your rates</span></li>
        </ul>
      </div>
    );
  }

  /* Demo booking for the visuals: an FF Party Flair Package shift, so the pay shown is the catalogue's own figure (PKG_CAT17) and nothing is invented. */
  const P21_DEMO_EVENT = { id: "demo_ff21", title: "Birthday cocktail party", kind: "Private party", iso: "2027-03-20", start: "19:00", time: "19:00 — 22:00", venue: "Islington, London", guests: "30", source: "party" };
  const P21_DEMO_SHIFT = { id: "demo_ff21_s", eventId: "demo_ff21", role: "Flair Bartender", svcId: "svc_flair", venue: "Islington, London", iso: "2027-03-20", time: "19:00 — 22:00", dress: "Black shirt and trousers" };

  function VisWhatsapp21() {
    const [pick, setPick] = useState("");
    return (
      <div className="pv pv-wa">
        <div className="pv-wab">
          <div className="top"><WhatsAppIcon size={16} /> WhatsApp</div>
          <div className="bub">
            <InertBox className="pv-shift"><ShiftCard17 shift={P21_DEMO_SHIFT} event={P21_DEMO_EVENT} source="party" status="open" /></InertBox>
            <span className="t">now</span>
          </div>
          <div className="pv-3b wa" role="group" aria-label="Reply to the request">
            {["Available", "Unavailable", "More info"].map((t) => <button key={t} type="button" className={pick === t ? "on" : ""} aria-pressed={pick === t} onClick={() => setPick(t)}>{t}</button>)}
          </div>
        </div>
      </div>
    );
  }

  /* Event brief and invoice (compact) with the terms underneath as drop-downs you can edit. */
  function VisTerms21() {
    const pts = STAFF_SHIFT_TERMS17;
    const pay = (() => { try { return pkgPayLabel17("svc_flair"); } catch (e) { return ""; } })();
    const [txt, setTxt] = useState(() => Object.fromEntries(pts.map((t) => [t.k, t.text])));
    const [open, setOpen] = useState("");
    const rows = [["Event", "Birthday cocktail party"], ["Date", "Saturday 20 March 2027"], ["Venue", "Islington, London"], ["Arrive", "18:30"], ["Role", "Flair Bartender"], ["Dress", "Black shirt and trousers"]];
    return (
      <div className="pv pv-tb">
        <div className="pv-inv" role="group" aria-label="Event brief and invoice">
          <div className="hd"><b>Event brief and invoice</b><span>FF-00001</span></div>
          <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
          {pay ? <div className="tot"><span>Your pay</span><b>{pay}</b></div> : null}
        </div>
        <div className="pv-tcs">
          <h4>Terms and conditions</h4>
          {pts.map((t, i) => (
            <div key={t.k} className={"r" + (open === t.k ? " open" : "")}>
              <button type="button" aria-expanded={open === t.k} onClick={() => setOpen(open === t.k ? "" : t.k)}><i>{i + 1}</i><b>{t.label}</b><P21I.ChevronDown size={16} /></button>
              {open === t.k ? <textarea rows={4} value={txt[t.k]} aria-label={t.label} onChange={(e) => setTxt({ ...txt, [t.k]: e.target.value })} /> : null}
            </div>
          ))}
        </div>
      </div>
    );
  }

  function RewardSuggest21({ open, onClose }) {
    const { state, dispatch } = useStore();
    const [yn, setYn] = useState("");
    const [text, setText] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    useEffect(() => { if (open) { setYn(""); setText(""); setDone(false); } }, [open]);
    const send = async () => {
      if (!yn || busy) return;
      setBusy(true);
      const r = await qaSubmit17(dispatch, { questionId: "int.challenge_reward", optionIds: [yn], text: text.trim(), account: qaAccount17(state), visibility: "private", source: "FF Team home · Launch Challenge" });
      setBusy(false);
      if (r.ok) setDone(true);
    };
    return (
      <Sheet open={open} onClose={onClose} title="Suggest a reward" center>
        <div className="pv-q">
          <p className="ff-serif" style={{ fontSize: 19, lineHeight: 1.35, marginTop: 0 }}>{TP21.challenge.suggestQuestion}</p>
          {done ? <p className="ff-body" style={{ fontWeight: 700 }}>Thank you. Your suggestion is saved.</p> : <>
            <div className="yn" role="group" aria-label={TP21.challenge.suggestQuestion}>
              {["Yes", "No"].map((o) => <button key={o} type="button" className={yn === o.toLowerCase() ? "on" : ""} aria-pressed={yn === o.toLowerCase()} onClick={() => setYn(o.toLowerCase())}>{o}</button>)}
            </div>
            <textarea className="ff-input" rows={3} maxLength={500} value={text} aria-label="Your answer" onChange={(e) => setText(e.target.value)} />
            <Btn variant="primary wide" disabled={!yn || busy} onClick={send}><P21I.Check size={14} /> Send</Btn>
          </>}
        </div>
      </Sheet>
    );
  }

  function VisChallenge21() {
    const [ask, setAsk] = useState(false);
    const IM = window.FF_IMG || {};
    return (
      <div className="pv pv-ch">
        <div className="pv-cd" aria-hidden="true"><Countdown20 /></div>
        <ul className="pv-prizes">
          <li className="g">
            <span className="pv-gold" aria-hidden="true"><Coin size={34} tier="gold" /><span className="tx"><b>FireFlair Gold</b><small>Business expense card</small></span></span>
            <b>Top 10: FireFlair Gold</b>
          </li>
          <li className="w">
            {IM.j17_p43 ? <img className="pv-ph" src={IM.j17_p43} style={fp17("j17_p43")} alt="Cocktail passports at a bar show" decoding="async" draggable={false} /> : null}
            <b>Overall winner: Athens Bar Show</b>
            <small>Flights, accommodation and a ticket</small>
          </li>
          <li>
            <b>Runners-up: your choice</b>
            <button type="button" className="pv-sug" onClick={() => setAsk(true)}><P21I.Lightbulb size={14} /> Suggest a reward</button>
          </li>
        </ul>
        <RewardSuggest21 open={ask} onClose={() => setAsk(false)} />
      </div>
    );
  }

  function VisLaunchParty21() {
    const IM = window.FF_IMG || {};
    const items = TP21.launchParty.items;
    return (
      <div className="pv pv-lp">
        {IM.j17_hp04 ? <figure className="pv-nfc"><img src={IM.j17_hp04} style={fp17("j17_hp04")} alt="A grand venue set for an evening event" decoding="async" draggable={false} /><figcaption>{TP21.launchParty.title}<small>{TP21.launchParty.where}</small></figcaption></figure> : null}
        <ul className="pv-lpl">{items.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    );
  }

  function VisEvents21() {
    const [open, setOpen] = useState(false);
    const cal = TP21.calendar;
    const row = (e) => (
      <li key={e.n}><span className="dt"><b>{e.dm[0]}</b><i>{e.dm[1]}</i></span><span className="nm"><b>{e.n}</b><small>{e.w}</small></span></li>
    );
    return (
      <div className="pv pv-ev">
        <ul className="pv-evs">{TP21.community.map(([t, d]) => <li key={t}><b>{t}</b><span>{d}</span></li>)}</ul>
        <div className={"pv-cal" + (open ? " open" : "")}>
          <button type="button" aria-expanded={open} onClick={() => setOpen(!open)}><b>Event calendar</b><P21I.ChevronDown size={18} /></button>
          {open ? <ul>{cal.map(row)}</ul> : null}
        </div>
      </div>
    );
  }

  function Visual21({ k }) {
    const dir = useDirectory();
    switch (k) {
      case "cv-to-profile": return <VisCvToProfile21 dir={dir} />;
      case "share-and-team": return <VisShareTeam21 dir={dir} />;
      case "reviews": return <VisReviews21 />;
      case "marketing": return <VisMarketing21 />;
      case "party-packages": return <VisPartyPackages21 />;
      case "own-packages": return <VisOwnPackages21 dir={dir} />;
      case "rates-and-staff": return <VisRatesStaff21 />;
      case "whatsapp-request": return <VisWhatsapp21 />;
      case "terms-and-brief": return <VisTerms21 />;
      case "challenge": return <VisChallenge21 />;
      case "launch-party": return <VisLaunchParty21 />;
      case "events-and-support": return <VisEvents21 />;
      default: return <SiteVisual21 k={k} dir={dir} />;
    }
  }

  /* ---- The section (home panel and pages) -------------------------------------------------------------------------------------- */
  /* level: "h4" inside the home panel, "h2" on a pillar page, "h1" on the section's own page. link: the title is a real link to the section page. */
  function PillarSection21({ s, n, run, level = "h4", link = false, locked = false }) {
    const { dispatch } = useStore();
    const H = level;
    const title = link
      ? <a href={infoHref21(s.slug)} onClick={(e) => { e.preventDefault(); infoNav21(dispatch, s.slug); }}>{s.h}</a>
      : s.h;
    return (
      <article className="ff-ps21" id={s.id} aria-labelledby={s.id + "-h"}>
        <header className="hd">
          <span className="n" aria-hidden="true">{n}</span>
          <H id={s.id + "-h"} className="ttl">{title}</H>
        </header>
        <div className="bd">
          <div className="tx">{s.p.map((t, i) => <p key={i}>{t}</p>)}</div>
          <div className="vs"><Visual21 k={s.visual} /></div>
        </div>
      </article>
    );
  }

  /* The 1-2-3 cards. `href` (pages) makes each button a link to the section's page; otherwise it scrolls to the section (`jump`). */
  function PillarCards21({ pl, photo, jump, href, onLink }) {
    const IM = window.FF_IMG || {};
    return (
      <ol className="ff-cta17 nb" aria-label={`${pl.t}: three ways in`}>
        {pl.sections.map((s, i) => {
          const ik = photo(i);
          return (
            <li key={s.id}>
              <a className="cd" href={href ? infoHref21(s.slug) : "#" + s.id} onClick={(e) => { e.preventDefault(); if (href) onLink(s.slug); else jump(s.id); }}>
                <span className="ph">{IM[ik] ? <img decoding="async" src={IM[ik]} style={fp17(ik)} alt="" draggable={false} /> : null}<i>{i + 1}</i></span>
                <b>{s.card.t}</b>
                <span className="t">{s.card.d}</span>
              </a>
            </li>
          );
        })}
      </ol>
    );
  }

  /* ---- The pages ---------------------------------------------------------------------------------------------------------------- */
  function TeamInfoPage21() {
    const { state, dispatch } = useStore();
    const run = usePillarRun21();
    const slug = (state.infoPage21 && state.infoPage21.slug) || "";
    const f = P21_FIND(slug);
    const close = () => {
      try { window.history.pushState(null, "", window.location.pathname + window.location.search + "#/ff-team"); } catch (e) { /* ignore */ }
      dispatch({ type: "V11_SET", patch: { infoPage21: null } });
      try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
    };
    useEffect(() => { try { window.scrollTo(0, 0); } catch (e) { /* ignore */ } }, [slug]);
    const go = (sl) => infoNav21(dispatch, sl);
    const back = <button type="button" className="ff-fd-back" onClick={() => rt17Back(close)}>{"←"} Back</button>;
    if (!f) {
      return (
        <main className="ff-fd-page ff-ip21" aria-labelledby="ip21-h1"><style>{TP21_CSS}</style>{back}
          <h1 id="ip21-h1" className="ff-h1">We can't find that page</h1>
          <p><a href={infoHref21(TP21.pillars[0].slug)} onClick={(e) => { e.preventDefault(); go(TP21.pillars[0].slug); }}>{TP21.pillars[0].t}</a></p>
        </main>
      );
    }
    const { pl, s } = f;
    const cat = DX_TEAM.find((c) => c.k === pl.k);
    const link = (x, kids, cls) => <a href={infoHref21(x)} className={cls} onClick={(e) => { e.preventDefault(); go(x); }}>{kids}</a>;
    if (!s) {
      return (
        <main className="ff-fd-page ff-ip21" aria-labelledby="ip21-h1"><style>{TP21_CSS}</style>{back}
          <h1 id="ip21-h1" className="ff-h1">{pl.h}</h1>
          <p className="ff-ip21-tl">{pl.tldr}</p>
          <PillarCards21 pl={pl} photo={(i) => dxCard17(cat, 0, i)} href onLink={go} />
          <div className="ff-ip21-secs">{pl.sections.map((x, i) => <PillarSection21 key={x.id} s={x} n={i + 1} run={run} level="h2" link />)}</div>
        </main>
      );
    }
    const n = pl.sections.indexOf(s) + 1;
    const others = pl.sections.filter((x) => x !== s);
    return (
      <main className="ff-fd-page ff-ip21" aria-labelledby={s.id + "-h"}><style>{TP21_CSS}</style>{back}
        <nav aria-label="Breadcrumb" className="ff-ip21-bc">{link(pl.slug, pl.t, "")}</nav>
        <PillarSection21 s={s} n={n} run={run} level="h1" />
        <nav className="ff-ip21-more" aria-label={`More from ${pl.t}`}>
          {others.map((x) => link(x.slug, <><b>{x.card.t}</b><span>{x.card.d}</span></>, "c"))}
        </nav>
      </main>
    );
  }
