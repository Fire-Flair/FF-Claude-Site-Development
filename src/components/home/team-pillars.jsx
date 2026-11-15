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
    Users: lucideIcon("Users"), Lightbulb: lucideIcon("Lightbulb"), ChevronLeft: lucideIcon("ChevronLeft"), Gift: lucideIcon("Gift")
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
  function usePillarRun21() {
    const home = useHomeNav();
    const hire = useHireNav();
    return (go) => {
      if (go === "profile") home.goProfile();
      else if (go === "network") hire.toNetwork("");
      else if (go === "bookings") hire.toBookings();
    };
  }

  const p21Person = (dir, id) => (dir || []).find((p) => p.id === id) || null;

  /* ---- Visuals ---------------------------------------------------------------------------------------------------------------- */
  function Arrow21() {
    return <span className="pv-ar" aria-hidden="true"><P21I.ArrowRight className="r" size={20} /><P21I.ArrowDown className="d" size={20} /></span>;
  }

  function VisCvToProfile21({ dir }) {
    const sam = p21Person(dir, "stf_sam");
    return (
      <div className="pv pv-cv" aria-hidden="true">
        <div className="pv-step">
          <span className="pv-doc"><P21I.FileText size={22} strokeWidth={1.6} /><i /><i /><i /><i className="s" /></span>
          <b>Your CV</b>
        </div>
        <Arrow21 />
        <div className="pv-step">
          <InertBox className="pv-pcard">{sam ? <PlayerCard person={sam} /> : null}</InertBox>
          <b>Profile Card</b>
        </div>
        <Arrow21 />
        <div className="pv-step">
          <span className="pv-chip big"><P21I.Globe size={16} /> ffteam.uk/yourname</span>
          <b>Your page</b>
        </div>
      </div>
    );
  }

  function VisShareTeam21({ dir }) {
    const crew = ["stf_sam", "stf_tom", "stf_idr", "stf_jon"].map((id) => p21Person(dir, id)).filter(Boolean);
    return (
      <div className="pv pv-share" aria-hidden="true">
        <div className="pv-opts">
          <div className="ff-pc-acts ff-pc-acts17">
            <span className="ff-pc-act big"><P21I.Plus size={20} strokeWidth={1.7} /><span>Join</span></span>
            <span className="ff-pc-act"><P21I.Calendar size={16} strokeWidth={1.7} /><span>Book</span></span>
            <span className="ff-pc-act"><P21I.Award size={16} strokeWidth={1.7} /><span>Review</span></span>
          </div>
          <span className="ff-csm-btn"><WhatsAppIcon size={18} /> Share</span>
        </div>
        <InertBox className="pv-fan">
          {crew.map((p) => <div key={p.id} className="pv-fc"><PlayerCard person={p} /></div>)}
        </InertBox>
      </div>
    );
  }

  function VisReviews21() {
    const rec = useMemo(() => ({ ...makeRecord("reviews", "5\u2605 from Priya"), id: "demo_rv21", description: "Ran the bar at our launch night without a single hiccup. Fast, clean and great with the guests.", rating: 5, primary: true, readOnly: true }), []);
    return (
      <InertBox className="pv pv-rv">
        <div className="ff-rvslide"><InformationCard record={rec} def={BASE_CATEGORIES.reviews} themeKey="onyx" pub="r" highlight rank="primary" /></div>
        <div className="ff-tickqs pv-tq">
          <TickChoice id="pv-w" label="Have you worked with Sammy before?" options={YES_NO} value={true} onChange={() => {}} />
          <TickChoice id="pv-a" label="Would you like to work with Sammy again?" options={YES_NO} value={true} onChange={() => {}} />
          <TickChoice id="pv-h" label="How is Sammy to work with?" options={HOW_TO_WORK.map((h) => ({ v: h.key, label: h.label }))} value="excellent" onChange={() => {}} />
        </div>
      </InertBox>
    );
  }

  function VisMarketing21() {
    const IM = window.FF_IMG || {};
    const where = [[P21I.PartyPopper, "FF Party"], [P21I.Briefcase, "FF Staff"], [P21I.Building2, "FF Event Directory"], [WhatsAppIcon, "WhatsApp"]];
    return (
      <div className="pv pv-mk">
        {IM.pen_strip ? <img className="pv-pen" src={IM.pen_strip} alt="A black and gold FireFlair pen engraved Add FF, ffparty.uk" decoding="async" draggable={false} /> : null}
        <ul className="pv-chips" aria-label="Where your card is taken">
          {where.map(([Ic, t]) => <li key={t} className="pv-chip"><Ic size={15} /> {t}</li>)}
        </ul>
      </div>
    );
  }

  function VisPartyPackages21() {
    const all = pkgServices17({ baseOnly: true, short: true });
    const order = ["svc_flair", "svc_bartending", "svc_mixology", "svc_masterclass"];
    const list = order.map((id) => all.find((x) => x.id === id)).filter(Boolean);
    return (
      <div className="pv pv-pk" aria-hidden="true">
        <div className="pv-scroll">
          {list.map((sv, i) => (
            <InertBox key={sv.id} className={"pv-tile" + (i === 0 ? " hl" : "")}>
              <PkgTile17 sv={sv} on={false} onClick={() => {}} />
            </InertBox>
          ))}
        </div>
      </div>
    );
  }

  function VisOwnPackages21({ dir }) {
    const IM = window.FF_IMG || {};
    const jon = p21Person(dir, "stf_jon");
    const ex = OWN_SERVICE_EXAMPLES.find((x) => x.id === "own_photo");
    const ck = ckAdapt17({ name: "Raspberry Mint Martini", glass: "martini", description: "Fresh raspberry and mint, shaken cold.", ingredients: ["50ml vodka", "20ml raspberry liqueur", "Fresh mint", "Garnish: raspberries"], photo: IM.cocktail_0 });
    const soon = <span className="ff-soonbadge sm"><P21I.Lock size={10} strokeWidth={2.4} /> Coming 2027</span>;
    return (
      <div className="pv pv-own" aria-hidden="true">
        <div className="pv-ownc">
          <InertBox className="pv-ck"><Card17 kind="cocktail" tone="dark" plate="Signature Cocktail" size="sm" url="By you"><CocktailFront17 c={ck} /></Card17></InertBox>
          {soon}
        </div>
        <div className="pv-ownc">
          <InertBox className="pv-sq">{jon && ex ? <OwnServiceCard item={{ ...ex, person: jon }} /> : null}</InertBox>
          {soon}
        </div>
      </div>
    );
  }

  function VisRatesStaff21() {
    const lane = (a, b, c, cls) => (
      <div className={"pv-lane " + cls}>
        <span className="pv-node site">{a}</span><P21I.ArrowRight size={14} className="a" /><span className="pv-node">{b}</span><P21I.ArrowRight size={14} className="a" /><span className="pv-node end">{c}</span>
      </div>
    );
    return (
      <div className="pv pv-rt" aria-hidden="true">
        <div className="pv-rates">
          <InertBox className="pv-rt1"><ProfRateTile17 name="Bartender" cat="Bar" guest val={undefined} onVal={() => {}} /></InertBox>
          <InertBox className="pv-rt1"><ProfRateTile17 name="DJ" cat="Music" guest val={undefined} onVal={() => {}} /></InertBox>
        </div>
        <div className="pv-lanes">
          {lane("FF Party", "Private clients", "Set-price packages", "p")}
          {lane("FF Staff", "Businesses", "Your rates", "s")}
          <div className="pv-feed"><span className="pv-node dir"><P21I.Building2 size={14} /> FF Event Directory</span><P21I.ArrowDown size={16} className="a" /><span className="pv-feedt">feeds FF Staff</span></div>
        </div>
      </div>
    );
  }

  /* Demo booking for the visuals: an FF Party Flair Package shift, so the pay shown is the catalogue's own figure (PKG_CAT17) and nothing is invented. */
  const P21_DEMO_EVENT = { id: "demo_ff21", title: "Birthday cocktail party", kind: "Private party", iso: "2027-03-20", start: "19:00", time: "19:00 — 22:00", venue: "Islington, London", guests: "30", source: "party" };
  const P21_DEMO_SHIFT = { id: "demo_ff21_s", eventId: "demo_ff21", role: "Flair Bartender", svcId: "svc_flair", venue: "Islington, London", iso: "2027-03-20", time: "19:00 — 22:00", dress: "Black shirt and trousers" };

  function VisWhatsapp21() {
    const steps = ["Personal request", "24 hours, exclusive to you", "Offered nearby"];
    return (
      <div className="pv pv-wa" aria-hidden="true">
        <InertBox className="pv-wab">
          <div className="top"><WhatsAppIcon size={16} /> WhatsApp</div>
          <div className="bub">
            <div className="pv-shift"><ShiftCard17 shift={P21_DEMO_SHIFT} event={P21_DEMO_EVENT} source="party" status="open" /></div>
            <span className="t">now</span>
          </div>
          <div className="btns"><span>Available</span><span>Unavailable</span><span>More info</span></div>
        </InertBox>
        <ol className="pv-tl">
          {steps.map((t, i) => <li key={t}><span className="ic">{i === 1 ? <P21I.Timer size={18} /> : <b>{i === 0 ? 1 : 2}</b>}</span><span>{t}</span></li>)}
        </ol>
      </div>
    );
  }

  function VisTerms21() {
    const pts = STAFF_SHIFT_TERMS17;
    return (
      <div className="pv pv-tb" aria-hidden="true">
        <InertBox className="ff-brief11 pv-terms">
          <section className="tc" aria-label="Terms and conditions">
            <h4>Terms and conditions</h4>
            <ol>{pts.map((t, i) => <li key={t.k}><b><i>{i + 1}</i>{t.label}</b></li>)}</ol>
          </section>
        </InertBox>
        <InertBox className="ff-brief11 pv-brief">
          <EventGuide ev={P21_DEMO_EVENT} shifts={[P21_DEMO_SHIFT]} viewer="pro" stamp="Brief" />
        </InertBox>
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
          <li>
            <span className="pv-ic" aria-hidden="true"><P21I.Plane size={30} strokeWidth={1.5} /></span>
            <b>Overall winner: Athens Bar Show</b>
            <small>Flights · Accommodation · Ticket</small>
          </li>
          <li>
            <span className="pv-ic" aria-hidden="true"><P21I.Gift size={30} strokeWidth={1.5} /></span>
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
    const chips = [[P21I.Trophy, "Winners announced"], [P21I.Martini, "Cocktail competition"], [P21I.Camera, "Professional photoshoot"], [P21I.GraduationCap, "Training session"], [P21I.Package, "Cocktail equipment"], [P21I.Nfc, "NFC business cards"]];
    return (
      <div className="pv pv-lp" aria-hidden="true">
        <ul className="pv-chips">{chips.map(([Ic, t]) => <li key={t} className="pv-chip"><Ic size={15} /> {t}</li>)}</ul>
        <div className="pv-lprow">
          <span className="pv-nfc"><Coin size={30} tier="gold" /><b>NFC Profile Card</b><P21I.Nfc size={18} /></span>
          {IM.j17_hp04 ? <img className="pv-ph" src={IM.j17_hp04} style={fp17("j17_hp04")} alt="" decoding="async" draggable={false} /> : null}
        </div>
      </div>
    );
  }

  function VisEvents21() {
    const IM = window.FF_IMG || {};
    const chips = [[P21I.Ticket, "Industry events"], [P21I.GraduationCap, "Training"], [P21I.HeartHandshake, "Support"]];
    return (
      <div className="pv pv-ev" aria-hidden="true">
        <ul className="pv-evl">
          {TP21.growthEvents.map((e) => (
            <li key={e.n}>
              <span className="ic"><P21I.CalendarDays size={18} strokeWidth={1.7} /></span>
              <b>{e.n}</b><em>{e.d}</em>
              <small><P21I.MapPin size={12} /> {e.w}</small>
              <p>{e.t}</p>
            </li>
          ))}
        </ul>
        <div className="pv-evb">
          {IM.j17_p43 ? <img className="pv-ph" src={IM.j17_p43} style={fp17("j17_p43")} alt="" decoding="async" draggable={false} /> : null}
          <ul className="pv-chips">{chips.map(([Ic, t]) => <li key={t} className="pv-chip"><Ic size={15} /> {t}</li>)}</ul>
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
      default: return null;
    }
  }

  /* ---- The section (home panel and pages) -------------------------------------------------------------------------------------- */
  /* level: "h4" inside the home panel, "h2" on a pillar page, "h1" on the section's own page. link: the title is a real link to the section page. */
  function PillarSection21({ s, n, run, level = "h4", link = false }) {
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
          {s.tag ? <span className="ff-soonbadge sm"><P21I.Lock size={10} strokeWidth={2.4} /> {s.tag}</span> : null}
        </header>
        <div className="bd">
          <div className="tx">{s.p.map((t, i) => <p key={i}>{t}</p>)}</div>
          <div className="vs"><Visual21 k={s.visual} /></div>
        </div>
        <div className="ft"><button type="button" className="ff-ps21-cta" onClick={() => run(s.cta.go)}>{s.cta.label}</button></div>
      </article>
    );
  }

  /* The 1-2-3 cards. `href` (pages) makes each button a link to the section's page; otherwise it scrolls to the section (`jump`). */
  function PillarCards21({ pl, photo, jump, href, onLink }) {
    const IM = window.FF_IMG || {};
    return (
      <ol className="ff-cta17" aria-label={`${pl.t}: three ways in`}>
        {pl.sections.map((s, i) => {
          const ik = photo(i);
          return (
            <li key={s.id}>
              <span className="ph">{IM[ik] ? <img decoding="async" src={IM[ik]} style={fp17(ik)} alt="" draggable={false} /> : null}<i>{i + 1}</i></span>
              <b>{s.card.t}</b>
              <span className="t">{s.card.d}</span>
              {href
                ? <a className="btn" href={infoHref21(s.slug)} onClick={(e) => { e.preventDefault(); onLink(s.slug); }}>{s.card.b}</a>
                : <button type="button" onClick={() => jump(s.id)}>{s.card.b}</button>}
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
