/* src/components/team/work-location-guide.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const P12_CSS = __ff_css("styles/p12.css");





/* ==========================================================================
   FF TEAM PHASE 1 — screens and parts added for Phase 1.
   Everything below reuses the prototype's own components (Sect, Sheet, Btn,
   Pill, CardFrame, Coin, PlayerTile, ComingSoonTile …) and its store.
   ========================================================================== */

/* --- Work locations ------------------------------------------------------
   v17.6.1: work locations are ticked from one list (CoverageTree17, coverage17.jsx); the typed-chip sheet that stood
   here is gone. */


/* --- Languages: type-ahead from the master list -------------------------- */
function LanguagePicker({ selected = [], onPick }) {
  const [q, setQ] = useState("");
  const has = (n) => selected.some(x => String(x).toLowerCase() === n.toLowerCase());
  const n = q.trim().toLowerCase();
  const hits = n
    ? LANGUAGE_MASTER.filter(l => l.name.toLowerCase().includes(n) || l.iso === n || LANGUAGE_ALIASES[n] === l.iso)
    : LANGUAGE_MASTER.slice(0, 8);
  const custom = n && !hits.some(l => l.name.toLowerCase() === n) ? q.trim().replace(/\b\w/g, c => c.toUpperCase()) : null;
  return (
    <div className="ff-frame ff-goldpick" style={{ padding: 14, marginTop: 4, marginBottom: 14 }}>
      <div className="ff-label" style={{ marginBottom: 8 }}>{n ? "Matching languages" : "Pick a language"}</div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={15} color="#7A7366" style={{ position: "absolute", left: 11, top: 13 }} />
        <input className="ff-input" style={{ paddingLeft: 34 }} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search 52 languages, or type your own" aria-label="Search languages" />
      </div>
      <div>
        {hits.map(l => (
          <button key={l.iso} type="button" className="ff-chip" onClick={() => { onPick(l.name); setQ(""); }}
            style={has(l.name) ? { background: "#5C1220", borderColor: "#5C1220", color: "#F6E7B4" } : undefined}>
            <LangFlag lang={l.name} /> {l.name}
          </button>
        ))}
        {custom && <button type="button" className="ff-chip ff-chip-custom" onClick={() => { onPick(custom); setQ(""); }}><LangFlag lang="" /> Add “{custom}”</button>}
      </div>
    </div>
  );
}





/* --- Coming Soon card: one design for every future feature ---------------
   A calm white card with the feature's icon, what it will do, and a small
   locked label built into the card, so future features read as planned,
   not unfinished. */
/* WhatsApp's mark in its own green, for a Coming Soon card. */
function WaGlyph({ size = 18 }) { return <span style={{ color: "#1FA855", display: "flex" }}><WhatsAppIcon size={size} /></span>; }



function SoonCard({ icon: Icon, title, note, when = "Coming 2027", next }) {
  return (
    <article className={`ff-soon${next ? " next" : ""}`}>
      <span className="ff-soon-ic" aria-hidden="true">{Icon ? <Icon size={18} strokeWidth={1.7} /> : <Coin size={22} tier="gold" />}<i><Lock size={9} strokeWidth={2.4} /></i></span>
      <div style={{ minWidth: 0 }}>
        <b>{title}</b>
        <p>{note}</p>
        <span className="ff-soon-badge">{next ? <Sparkles size={10} strokeWidth={2.2} /> : <Lock size={10} strokeWidth={2.2} />} {when}</span>
      </div>
    </article>
  );
}




/* Beneath Save & Share, before the profile is saved: where the finished card
   will appear (it does, in Welcome to the Team, once saved). */
function CardPreviewSoon() {
  return (
    <div className="ff-cardpreview-wrap">
      <div className="ff-cardpreview">
        <div className="ff-cardghost" aria-hidden="true">
          <span className="coin"><FFLogo size={22} tier="gold" /></span>
          <span className="av" /><span className="l1" /><span className="l2" /><span className="l3" /><span className="l4" />
        </div>
        <div className="ff-cardpreview-tx">
          <b>Your complete card will display here</b>
          <p>Save or publish your profile and your finished Profile Card appears here. Share it, and soon add it to your phone's wallet.</p>
        </div>
        <ShareStack />
      </div>
    </div>
  );
}



/* --- FF XP · 2027: the FF coin pop-up ---------------------------------
   The only way into XP. Next steps, then your tier and level, then how FF XP
   works. Uses the prototype's own XP logic (XP_TASKS, XP_VALUES, XP_LEVELS,
   xpProgress, quarterly periods) unchanged. */
function XPPopup({ open, onClose }) {
  const { state, dispatch } = useStore();
  const people = useDirectory();
  if (!open) return null;
  const p = state.profile;
  const live = !!p.live;
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const net = myNetwork(state, people).list.length;
  const lv = verificationLevel(net);
  const go = (tab, focus) => {
    onClose();
    if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab, route: "home" });
    if (focus) dispatch({ type: "FOCUS", focus: { target: focus } }); else window.scrollTo(0, 0);
  };
  const steps = [
    { id: "build", label: "Build your profile", hint: "Your Profile Card, professions and experience", done: cardReady, onClick: () => go("profile", "card") },
    { id: "share", label: "Share your Profile Card", hint: "Publish and send it on WhatsApp", done: live, onClick: () => go("profile", live ? "card" : "share") },
    { id: "grow", label: "Grow your network", hint: `${net} connection${net === 1 ? "" : "s"} so far`, done: net >= VERIFICATION_LEVELS[1].connections, onClick: () => go("network") },
  ];
  return (
    <Sheet open onClose={onClose} title="Next steps">
      <div className="ff-xpsec">
        {steps.map(t => (
          <button key={t.id} type="button" className={`ff-task${t.done ? " done" : ""}`} onClick={t.onClick}>
            <span className="dot">{t.done && <Check size={13} strokeWidth={2.6} />}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="ff-serif" style={{ fontSize: 15.5, display: "block", color: "#1D1B18", lineHeight: 1.2 }}>{t.label}</span>
              <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{t.hint}</span>
            </span>
            {t.done ? <Pill tone="ok">Done</Pill> : <ChevronRight size={16} color="var(--gold-dk)" style={{ flex: "none" }} />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}



/* --- Bookings (Phase 1) ---------------------------------------------------
   What works now first in each part, futures as Coming Soon cards: booked
   shifts (Coming 2027), FF Party Service Cards (register interest),
   Availability (peak dates), Training and Dream jobs (register interest). */
function P1Bookings({ guest = false }) {
  const { state, dispatch } = useStore();
  const svcInterest = state.profile.serviceInterest || [];
  const goProfile = () => { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };
  const toggleService = (sv) => {
    if (guest) { goProfile(); dispatch({ type: "TOAST", toast: "Create your Profile Card first, then register for Service Cards" }); return; }
    const on = svcInterest.includes(sv.id);
    dispatch({ type: "PROFILE", patch: { serviceInterest: on ? svcInterest.filter(x => x !== sv.id) : [...svcInterest, sv.id] } });
    dispatch({ type: "TOAST", toast: on ? `Withdrawn from ${sv.title}` : `Registered for ${sv.title}. We'll review your profile.` });
  };
  const jump = (id) => scrollToSection(id);
  const onSubmit = (v) => {
    const t = v.toLowerCase();
    if (/\b(rewards?|perks|gifts?|xp)\b/.test(t)) return jump("ff-rewards");
    if (/\b(train|training|course|wset|masterclass|learn|qualif)/.test(t)) return jump("ff-training");
    if (/\b(festival|yacht|motorsport|abroad|international|cruise|ski|dream|job)/.test(t)) return jump("ff-jobs");
    if (/\b(christmas|halloween|new year|nye|available|availability|dates?|free)\b/.test(t)) return jump("ff-bk-avail");
    if (/\b(service|party|mixology|masterclass|bartending)\b/.test(t)) return jump("ff-bk-party");
    return jump("ff-bk-booked");
  };
  return (
    <div>
      <div className="ff-eyebrow">{guest ? "FireFlair" : "FF Team"}</div>
      <h1 className="ff-h1" style={{ marginTop: 4 }}>Bookings</h1>

      <FFAI title="Search your bookings" onSubmit={onSubmit}
        purpose="Get ready for bookings: tell FireFlair when you're free, which Service Cards you can perform, and the training and jobs you want."
        placeholder="Christmas, mixology, festivals…"
        actions={[
          { label: "Availability", onClick: () => jump("ff-bk-avail") },
          { label: "Service Cards", onClick: () => jump("ff-bk-party") },
          { label: "Training", onClick: () => jump("ff-training") },
          { label: "Dream jobs", onClick: () => jump("ff-jobs") },
          { label: "Rewards", onClick: () => jump("ff-rewards") },
        ]} />

      <section id="ff-bk-booked" className="ff-bkpart">
        <SectionHead icon={<Calendar size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Your bookings" />
        <div className="ff-soonpanel">
          <div className="ff-wa" style={{ marginBottom: 12 }}>
            <span className="ff-wa-ico"><WhatsAppIcon size={22} /></span>
            <span className="ff-body" style={{ color: "#0B3D22", fontSize: 13.5 }}>
              <b>Requests come to you on WhatsApp.</b> When companies and clients ask if you're free, each request is sent to you directly on WhatsApp and shows here. You reply in either place.
            </span>
          </div>
          <p className="ff-soonpanel-lede">Your booked shifts will be shown here. Bookings open with FF Staff and FF Party.</p>
          <div className="ff-soongrid">
            <SoonCard icon={WaGlyph} title="Requests from companies" note="Businesses ask if you're free, on WhatsApp. You reply there or here." when="Coming with FF Staff" />
            <SoonCard icon={Calendar} title="Booked shifts" note="Confirmed shifts with the venue, times and directions, in one place." when="Coming with FF Staff and FF Party" />
            <SoonCard icon={Wallet} title="Booking passes" note="Each confirmed booking as a pass in Apple Wallet or Google Wallet." when="Coming 2027" />
          </div>
        </div>
      </section>

      <div className="ff-bkgroup-h">
        <span className="ff-eyebrow">Available now</span>
        <h2 className="ff-h2">Get ready for bookings</h2>
      </div>

      <section id="ff-bk-party" className="ff-bkpart">
        <SectionHead icon={<Martini size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="FF Party Service Cards"
          action={<Pill tone="gold">{svcInterest.length ? `${svcInterest.length} registered` : "Register interest"}</Pill>} />
        <p className="ff-body" style={{ marginTop: -2, fontSize: 13.5 }}>
          Register for the Service Cards you can perform. We'll review your profile, and once FF Party launches, your profile will be advertised alongside those Service Cards.
        </p>
        <HScroll label="FF Party Service Cards" snap>
          {PARTY_SERVICES.map(sv => {
            const on = svcInterest.includes(sv.id);
            return (
              <div key={sv.id} style={{ width: CARD_W.poster }}>
                <ServicePoster svc={sv} />
                <div className="ff-svcreg">
                  {on ? (<>
                    <span className="ff-svcreg-on"><Check size={14} strokeWidth={2.6} /> Registered · we'll review your profile</span>
                    <button type="button" className="ff-linkbtn" onClick={() => toggleService(sv)}>Withdraw</button>
                  </>) : (
                    <Btn variant="primary wide" onClick={() => toggleService(sv)}><Star size={14} /> Register interest</Btn>
                  )}
                </div>
              </div>
            );
          })}
        </HScroll>
      </section>

      <section id="ff-bk-avail" className="ff-bkpart">
        <SectionHead icon={<Clock size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Availability" />
        <p className="ff-body" style={{ marginTop: -2, fontSize: 13.5 }}>
          Answer once and it's saved. Businesses see your answer when they ask about a date, and you're first in line on the busiest dates of the year.
        </p>
        <AvailabilityCards />
        <div className="ff-bkgroup-h" style={{ margin: "18px 0 8px" }}><span className="ff-eyebrow">Busy dates</span></div>
        <PeakAvailability />
      </section>

      <TrainingSection />
      <JobsSection />
      <P1RewardsSection />
    </div>
  );
}
