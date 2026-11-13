/* src/components/team/landing-shell.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* HOME (signed out) — FireFlair "Welcome to FireFlair", then everything FireFlair
   offers (FF Team, FF Party, Service Cards, Training, Festivals, FF Staff), where the
   network is, then every FireFlair site with a way in (v16.9 — replaces the
   two role cards). The full people wall lives on Network; Home shows four
   example Profile Cards and the FF Party search. */
function Landing() {
  const { state, dispatch } = useStore();
  if (state.tab === "network") return <NetworkScreen guest />;
  if (state.tab === "bookings") return PHASE1.bookingsLive ? <TeamBookings guest /> : <P1Bookings guest />;
  if (state.tab && state.tab !== "home") {
    return (
      <div className="ff-landing">
        <div style={{ textAlign: "center", padding: "40px 0 10px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><Coin size={50} tier="gold" /></div>
          <h1 className="ff-h1" style={{ fontSize: 20 }}>This is where your Profile Card lives</h1>
          <p className="ff-lede" style={{ marginTop: 10, maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>Choose how you'll use FireFlair.</p>
        </div>
        <RoleCards />
      </div>
    );
  }

  return (
    <V101.Home101 />
  );
}



function ActionSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  if (isPartySite17(state)) return null;
  const go = (fn) => () => { onClose(); fn(); };
  const item = (Icon, label, note, onClick) => (
    <button onClick={onClick} className="ff-frame" style={{ width: "100%", textAlign: "left", padding: 14, marginBottom: 8, display: "flex", gap: 12, alignItems: "center" }}>
      <span style={{ width: 34, height: 34, borderRadius: "50%", background: "#5C1220", display: "grid", placeItems: "center", flex: "none" }}>
        <Icon size={16} color="#EAD79C" strokeWidth={1.6} />
      </span>
      <span style={{ flex: 1 }}>
        <span className="ff-display" style={{ fontSize: 14, display: "block" }}>{label}</span>
        <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{note}</span>
      </span>
      <ChevronRight size={16} color="#B0A895" />
    </button>
  );
  return (
    <Sheet open={open} onClose={onClose} title={state.role === "team" ? "Add to your profile" : "Start a booking"}>
      {state.role === "team" ? (
        <>
          {item(FileText, "Send a CV", "We read it and propose your cards", go(() => { dispatch({ type: "TAB", tab: "profile", route: "home" }); dispatch({ type: "FOCUS", focus: { target: "cv" } }); }))}
          {item(Plus, "Add information cards", "Professions, skills, interests, qualifications", go(() => { dispatch({ type: "TAB", tab: "profile", route: "home" }); dispatch({ type: "FOCUS", focus: { target: "professions" } }); }))}
          {item(Users, "Invite people you work with", "They accept before anything connects", go(() => dispatch({ type: "TAB", tab: "network" })))}
          {item(Share2, "Share my card", `${CARD_DOMAIN}/${state.session.tag || "username"}`, go(() => dispatch({ type: "TOAST", toast: "Link copied" })))}
        </>
      ) : (
        <>
          {item(Calendar, "Create Event Card", "Date, venue, guests and team size", go(() => dispatch({ type: "TAB", tab: "home", route: "eventNew" })))}
          {state.activeEventId && item(Clock, "Open your Event Card", "Service Cards, credits and responses", go(() => dispatch({ type: "TAB", tab: "home", route: "eventPage" })))}
          {item(Search, "Find staff", "Fill your basket from any profile", go(() => dispatch({ type: "TAB", tab: "home", route: "staffHome" })))}
          {item(Briefcase, state.company && state.company.name ? "Your company profile" : "Create your company profile", "Company Card, T&Cs, documents and hiring questions", go(() => dispatch({ type: "TAB", tab: "profile", route: "staffHome" })))}
        </>
      )}
    </Sheet>
  );
}



const NAV = [
  { key: "home", label: "Home", mark: "home" },
  { key: "network", label: "Network", mark: "network" },
  { key: "__ff", label: "", mark: null },
  { key: "bookings", label: "Bookings", mark: "bookings" },
  { key: "profile", label: "Profile", mark: "profile" },
];



/* XP bar — same footprint as the basket bar, filling as the person earns XP
   toward their next FireFlair tier. The reward on the right is the same Coin
   used everywhere else, in that tier's metal, so "reaching Bronze" always
   looks like the same coin the rest of the app already shows for Bronze. */
/* ==========================================================================
   XP AREA — opened by the central FireFlair coin.
   Today it holds XP, level and tasks. It is deliberately the person's whole
   progression/account area, so Wallet, earnings and rewards can be added as
   further blocks here without touching the navigation.
   ========================================================================== */
/* XP Beta timeline — the current and next quarterly period, generated from
   XP_TIMELINE rather than hand-written, so a future quarter is a data change
   to XP_CURRENT_PERIOD/XP_TIMELINE, not a UI rewrite. */
function XPTimeline() {
  const idx = XP_TIMELINE.findIndex(p => p.year === XP_CURRENT_PERIOD.year && p.q === XP_CURRENT_PERIOD.q);
  const visible = XP_TIMELINE.slice(Math.max(0, idx), idx + 2);
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ textAlign: "center", marginBottom: 8 }}>
        <span className="ff-eyebrow" style={{ fontSize: 10 }}>FF XP Beta</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {visible.map((p, i) => {
          const isCurrent = p.year === XP_CURRENT_PERIOD.year && p.q === XP_CURRENT_PERIOD.q;
          return (
            <React.Fragment key={xpPeriodKey(p)}>
              <div style={{ textAlign: "center", flex: "none" }}>
                <div className="ff-display" style={{
                  fontSize: isCurrent ? 15 : 12, color: isCurrent ? "var(--ink)" : "#8C857A",
                  letterSpacing: ".06em",
                }}>{quarterLabel(p)}</div>
                <div className="ff-body ff-muted" style={{ fontSize: 9, marginTop: 2 }}>
                  {isCurrent ? "Current" : "Next"}
                </div>
              </div>
              {i < visible.length - 1 && (
                <div style={{ flex: 1, height: 2, background: "linear-gradient(90deg, var(--gold), rgba(201,162,39,.15))" }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="ff-body ff-muted" style={{ fontSize: 10.5, textAlign: "center", marginTop: 8, marginBottom: 0 }}>
        FireFlair XP runs in quarterly performance periods. Your progress resets each quarter — nothing you've earned is lost.
      </p>
    </div>
  );
}



/* THE FF COIN — "What do I need to do next?"
   The existing XP tasks, incomplete first, each one a shortcut into the part
   of Profile where it gets done. XP and tiers sit underneath as the reward. */
function XPSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  if (!open) return null;
  const info = xpProgress(state.profile.xp);
  const claimed = state.profile.xpClaimed || [];
  const qsAll = allQuestions(state);
  const answered = qsAll.filter(q => isAnswered(answerOf(state, q))).length;
  const live = !!state.profile.live;

  const tasks = [
    ...XP_TASKS.map(t => ({ ...t, done: claimed.includes(t.id), reward: `+${t.xp} XP` })),
    {
      id: "questions", label: "Answer Question Cards", hint: `${answered} of ${qsAll.length} answered`,
      done: answered >= qsAll.length, reward: `+${XP_VALUES.question} XP each`,
    },
  ];
  const todo = tasks.filter(t => !t.done);
  const done = tasks.filter(t => t.done);

  /* Send the person to where the task is done. Reuses the Profile routes:
     card editor, review screen (all categories + Question Cards), tag,
     verification, and — once live — the profile's own sections. */
  const goTask = (id) => {
    onClose();
    let focus = null;
    if (id === "create_card") focus = "card";
    else if (id === "publish_profile") focus = live ? "card" : "share";
    else if (id === "first_review") {
      if (live) focus = "reviews";
      else { focus = "share"; dispatch({ type: "TOAST", toast: "Share your Profile Card first — then ask people you've worked with for a review." }); }
    }
    else if (id === "questions") focus = "questions";
    else if (id.startsWith("add_")) focus = id.slice(4);
    if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab: "profile", route: "home" });
    if (focus) dispatch({ type: "FOCUS", focus: { target: focus } });
    else window.scrollTo(0, 0);
  };

  const Task = ({ t }) => {
    const body = (<>
      <span className="dot">{t.done && <Check size={13} strokeWidth={2.6} />}</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="ff-serif" style={{ fontSize: 15.5, display: "block", color: "#1D1B18", lineHeight: 1.2, textDecoration: t.done ? "line-through" : "none", textDecorationColor: "rgba(126,97,29,.5)" }}>{t.label}</span>
        <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{t.hint}</span>
      </span>
      {t.done ? <Pill tone="ok">Earned</Pill> : <Pill tone="gold">{t.reward}</Pill>}
      {!t.done && <ChevronRight size={16} color="var(--gold-dk)" style={{ flex: "none" }} />}
    </>);
    return t.done
      ? <div className="ff-task done">{body}</div>
      : <button className="ff-task" onClick={() => goTask(t.id)}>{body}</button>;
  };

  return (
    <Sheet open onClose={onClose} title="Your FireFlair">
      {/* XP summary — compact, the reward behind the list */}
      <div className="ff-frame ff-lattice" style={{ padding: "14px 14px 12px", marginBottom: 18, display: "flex", gap: 14, alignItems: "center" }}>
        <Corners />
        <Coin size={52} tier={info.currentTier} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span className="ff-display" style={{ fontSize: 24 }}>{info.xp} XP</span>
            <span className="ff-label">{TIERS[info.currentTier].name}</span>
          </div>
          <div className="ff-xptrack" style={{ margin: "8px 0 6px", background: "rgba(20,20,22,.12)" }}>
            <div className="ff-xpfill" style={{ width: `${info.pct}%` }} />
          </div>
          <div className="ff-body ff-muted" style={{ fontSize: 11.5 }}>
            {info.next ? `${info.nextXp - info.xp} XP to ${info.next.label}` : "Top numbered tier reached"} · {state.profile.xpPeriod || 0} XP this quarter
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10 }}>
        <h3 className="ff-h2" style={{ fontSize: 16, flex: 1 }}>{todo.length ? "Next steps" : "All done"}</h3>
        <span className="ff-label">{done.length} of {tasks.length} done</span>
      </div>
      {todo.length === 0 && <p className="ff-body ff-muted" style={{ marginTop: 0 }}>Every task is complete. New ones arrive as FireFlair grows.</p>}
      {todo.map(t => <Task key={t.id} t={t} />)}
      {done.length > 0 && <>
        <div className="ff-label" style={{ margin: "16px 0 8px", opacity: .8 }}>Completed</div>
        {done.map(t => <Task key={t.id} t={t} />)}
      </>}

      <Divider />
      <XPTimeline />
      <div className="ff-label" style={{ marginBottom: 8 }}>Levels</div>
      {XP_LEVELS.map(l => {
        const isGold = l.tier === "gold";
        const reached = isGold ? false : info.xp >= l.xp;
        return (
          <div key={l.tier} className="ff-frame" style={{ padding: 12, marginBottom: 8, display: "flex", gap: 11, alignItems: "center", opacity: reached ? 1 : .62 }}>
            <Coin size={30} tier={l.tier} />
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="ff-display" style={{ fontSize: 13, display: "block" }}>
                {l.label} · {isGold ? `Top performers — ${quarterLabel(XP_CURRENT_PERIOD)}` : `${l.xp} XP`}
              </span>
              <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{l.unlocks}</span>
            </span>
            {isGold ? <Pill tone="warn">Quarterly</Pill> : reached ? <Pill tone="ok"><Check size={10} /> Unlocked</Pill> : <Pill>Locked</Pill>}
          </div>
        );
      })}
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "12px 0 0" }}>
        Wallet, earnings and rewards will live here too — this is your FireFlair account area.
      </p>
    </Sheet>
  );
}



function XPBar({ info }) {
  const { dispatch } = useStore();
  const atMax = !info.next;
  return (
    <div className="ff-xpbar">
      <div style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 560, margin: "0 auto" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
            <span style={{ fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#EAD79C" }}>
              {atMax ? "Top tier reached" : `${info.xp} / ${info.nextXp} XP`}
            </span>
            {!atMax && <span style={{ fontSize: 9, color: "rgba(244,239,228,.55)" }}>Next: {info.next.label}</span>}
          </div>
          <div className="ff-xptrack">
            <div className="ff-xpfill" style={{ width: `${info.pct}%` }} />
          </div>
        </div>
        <button onClick={() => dispatch({ type: "TOAST", toast: atMax ? "You're at the top FireFlair tier." : `${info.nextXp - info.xp} XP to ${info.next.label}` })}
          aria-label="Your FireFlair tier" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Coin size={30} tier={info.currentTier} />
          <span style={{ fontSize: 7, letterSpacing: ".1em", textTransform: "uppercase", color: "#D9BE68" }}>{TIERS[info.currentTier].name}</span>
        </button>
      </div>
    </div>
  );
}



/* LOG IN — FF Tag + WhatsApp code (every account), or FF Tag + password
   (accounts that chose to create one). Talks only to AUTH_ADAPTER; a
   successful result becomes AUTH_SIGNED_IN, which is the one thing the nav
   button reads. */
function LoginSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState("otp");
  const [tag, setTag] = useState("");
  const [pw, setPw] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => { if (open) { setMode("otp"); setPw(""); setCode(""); setSent(false); setErr(null); setBusy(false); } }, [open]);
  if (!open) return null;
  if (hireSiteOf(state).party) return <PartyLoginSheet17 onClose={onClose} />;

  const clean = AUTH_ADAPTER.cleanTag(tag);
  const tagOk = AUTH_ADAPTER.tagOk(clean);
  const run = async (fn) => {
    setBusy(true); setErr(null);
    try { return await fn(); } catch (e) { setErr(e.message); return null; } finally { setBusy(false); }
  };
  const done = (res) => {
    if (!res) return;
    const demo = false;
    if (demo) dispatch({ type: "SEED_DEMO" });
    else if (res.method === "otp") dispatch({ type: "SESSION", patch: { tag: res.tag, phone, verified: true } });
    else dispatch({ type: "SESSION", patch: { tag: res.tag } });
    dispatch({ type: "AUTH_SIGNED_IN", tag: demo ? "SAM42" : res.tag, method: res.method });
    dispatch({ type: "TOAST", toast: `Logged in as ${demo ? "SAM42" : res.tag}` });
    onClose();
  };
  const switchTo = (m) => { setMode(m); setErr(null); setSent(false); setCode(""); };
  const loginPw = () => run(() => AUTH_ADAPTER.loginWithPassword(clean, pw)).then(done);
  const sendCode = () => run(() => AUTH_ADAPTER.sendCode(clean, phone)).then(r => { if (r) setSent(true); });
  const verify = () => run(() => AUTH_ADAPTER.verifyCode(clean, phone, code)).then(done);

  return (
    <Sheet open onClose={onClose} title="Log in">
      <div className="ff-authtabs" role="tablist" aria-label="How to log in">
        <button type="button" role="tab" aria-selected={mode === "otp"} className={mode === "otp" ? "on" : ""} onClick={() => switchTo("otp")}>
          <WhatsAppIcon size={12} /> WhatsApp code
        </button>
        <button type="button" role="tab" aria-selected={mode === "password"} className={mode === "password" ? "on" : ""} onClick={() => switchTo("password")}>
          <Lock size={11} /> Password
        </button>
      </div>

      <Field label="FF Tag">
        <TagInput value={clean} onChange={setTag} />
      </Field>

      {mode === "password" ? (<>
        <Field label="Password">
          <input className="ff-input" type="password" autoComplete="current-password" value={pw}
            onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tagOk && pw && !busy && loginPw()} />
        </Field>
        <Btn variant="primary wide" disabled={busy || !tagOk || !pw} onClick={loginPw}>
          {busy ? <Loader2 size={14} className="ff-spin" /> : <ShieldCheck size={14} />} Log in
        </Btn>
        <div style={{ height: 8 }} />
        <Btn variant="ghost wide" onClick={() => switchTo("otp")}><WhatsAppIcon size={13} /> Use a WhatsApp code instead</Btn>
      </>) : (<>
        <Field label="Phone number" hint="The mobile number on your FireFlair account. We'll send a code on WhatsApp.">
          <input className="ff-input" type="tel" autoComplete="tel" placeholder="+44 7700 900000" value={phone} disabled={sent}
            onChange={(e) => setPhone(e.target.value)} />
        </Field>
        {!sent ? (
          <Btn variant="primary wide" disabled={busy || !tagOk || phone.replace(/\D/g, "").length < 9} onClick={sendCode}>
            {busy ? <Loader2 size={14} className="ff-spin" /> : <WhatsAppIcon size={14} />} Send WhatsApp code
          </Btn>
        ) : (<>
          <Field label="Code from WhatsApp" hint={`Sent to ${phone}.`}>
            <input className="ff-input ff-tagin" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" aria-label="Code from WhatsApp" />
          </Field>
          <Btn variant="primary wide" disabled={busy || code.length < 6} onClick={verify}>
            {busy ? <Loader2 size={14} className="ff-spin" /> : <ShieldCheck size={14} />} Verify & log in
          </Btn>
          <div style={{ height: 8 }} />
          <Btn variant="ghost wide" onClick={() => { setSent(false); setCode(""); }}>Change number</Btn>
        </>)}
        <div style={{ height: 8 }} />
        <Btn variant="ghost wide" onClick={() => switchTo("password")}><Lock size={13} /> Use your password instead</Btn>
        <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "8px 0 0", textAlign: "center" }}>Only if you created one — passwords are optional.</p>
      </>)}

      {err && <p className="ff-body" role="alert" style={{ color: "var(--bad)", fontSize: 12.5, margin: "12px 0 0" }}>{err}</p>}
      <p className="ff-body ff-muted" style={{ fontSize: 11, margin: "14px 0 0" }}>
        {AUTH_ADAPTER.note} Any FF Tag with a six-digit code, or a password of five or more characters, logs in.
        New to FireFlair? Create your FF Tag at the top of the Profile page.
      </p>
      <button type="button" className="ff-dev17 login" onClick={() => {
        ["team", "biz", "party"].forEach(k => seedDemo17(state, dispatch, k));
        dispatch({ type: "V11_SET", patch: { devDone: { team: true, biz: true, party: true } } });
        dispatch({ type: "AUTH_SIGNED_IN", tag: "ALEXG", method: "dev" });
        if (!state.role) dispatch({ type: "ROLE", role: "team" });
        if (state.role === "staff") {
          const party = state.site === "party";
          dispatch({ type: "COMPANY_SAVE", company: party
            ? { name: "Jennifer Aniston", kind: "Host", location: "London", description: "Hosts private dinners, birthdays and garden parties across London.", saved: true, cardSavedAt: Date.now(), finishedAt: Date.now(), joinedAt: Date.now() }
            : { ...vooshkaEditable17(), phone: "+44 7814 904355", saved: true, cardSavedAt: Date.now(), finishedAt: Date.now(), joinedAt: Date.now() } });
          dispatch({ type: "COMPANY_SIGNED_IN", slug: party ? "jenniferaniston" : "vooshka" });
        }
        dispatch({ type: "TOAST", toast: "Complete profile loaded" });
        onClose();
      }}>DEV · complete profile</button>
    </Sheet>
  );
}



function Shell({ children }) {
  const { state, dispatch } = useStore();
  const [act, setAct] = useState(false);
  const [xpOpen, setXpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const pend11 = pending11(state);
  useEffect(() => { const h = () => setFbOpen(true); window.addEventListener("ff-feedback", h); return () => window.removeEventListener("ff-feedback", h); }, []);
  const [acctOpen, setAcctOpen] = useState(false);
  useEffect(() => { const h = () => setLoginOpen(true); window.addEventListener("ff-login", h); return () => window.removeEventListener("ff-login", h); }, []);
  useEffect(() => { const h = () => setShareOpen(true); window.addEventListener("ff-add", h); return () => window.removeEventListener("ff-add", h); }, []);
  /* Anything can open the FF XP pop-up with an "ff-xp" event. */
  useEffect(() => { const h = () => setXpOpen(true); window.addEventListener("ff-xp", h); return () => window.removeEventListener("ff-xp", h); }, []);
  const authed = !!state.auth && state.auth.status === "signedIn";
  const logout = async () => {
    setMenuOpen(false);
    try { await AUTH_ADAPTER.logout(); } catch (e) { /* signed out locally either way */ }
    dispatch({ type: "SIGN_OUT" });
    window.scrollTo(0, 0);
  };
  const isTeam = state.role === "team";
  const isStaff = state.role === "staff";
  const isParty = isStaff && state.site === "party";
  const partyLocked = isParty;
  const isVip = state.role === "vip";
  const goSite = useGoSite();
  const currentSite = isVip ? "vip" : isParty ? "party" : isStaff ? "staff" : isTeam ? "team" : null;
  useEffect(() => {
    if (!menuOpen) return;
    const h = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [menuOpen]);
  const goTab = (tab) => {
    if (partyLocked && PARTY_LOCKED_TABS17.includes(tab)) return;
    if (!state.role && tab === "profile") { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile" }); return; }
    if (!state.role) { dispatch({ type: "TAB", tab }); return; }
    if (isTeam) dispatch({ type: "TAB", tab, route: state.profile.live ? "home" : state.route });
    else dispatch({ type: "TAB", tab, route: tab === "home" ? "staffHome" : state.route });
  };

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "TOAST", toast: null }), 2400);
    return () => clearTimeout(t);
  }, [state.toast, dispatch]);

  /* The basket is FireFlair-wide: people can be added from any profile, in
     either role, and it persists until they're on an Event Card. */
  /* v16.12: the basket is now the booking bar. It shows when there are
     people in it, when a hirer has an Event Card, or while a card is being
     dragged on FF Staff. */
  const [dragging, setDragging] = useState(false);
  useEffect(() => { const h = (e) => setDragging(!!e.detail); window.addEventListener("ff-drag", h); return () => window.removeEventListener("ff-drag", h); }, []);
  const hasEvent = isStaff && !!state.events.find(e => e.id === state.activeEventId);
  const basket = false && !!state.role && !(isStaff && state.tab === "bookings") && (state.selection.length > 0 || hasEvent || (isStaff && dragging));
  /* Phase 1: no XP bar (PHASE1.xpBar) — the FF coin pop-up is the way into XP. */
  const xpInfo = PHASE1.xpBar && isTeam && state.profile.live ? xpProgress(state.profile.xp) : null;
  /* Desktop: once the page is scrolled down, the XP row under the menu bar
     hides and only the menu bar stays. Hide past 120px, show again above
     20px; the gap stops it flickering as the row collapses. */
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(was => (was ? window.scrollY > 20 : window.scrollY > 120));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const xpRow = xpInfo && !scrolled;
  const bottomBarUp = basket || xpInfo;
  const bothBars = basket && xpInfo;

  return (
    <div className="ff-shell">
      <a className="ff-skip" href="#ff-main">Skip to content</a>
      <header className="ff-topbar ff-lattice">
        <div className="ff-topbar-in">
          {/* Top left, on every FireFlair site: the FireFlair button opens the
              list of FireFlair sites (and, when signed in, the account items). */}
          <div className="ff-acct">
            <button type="button" className="ff-acct-btn"
              aria-haspopup="menu" aria-expanded={menuOpen} aria-label="FireFlair sites and account"
              onClick={() => setMenuOpen(o => !o)}>
              <img decoding="async" className="ff-acct-logo" src={FF_SITE_BRAND[isVip ? "vip" : isParty ? "party" : isStaff ? "staff" : "team"].icon} width={30} height={30} alt="" draggable={false} />
              <span style={{ lineHeight: 1.1, textAlign: "left" }}>
                <Wordmark size={13} />
                <span style={{ display: "block", fontSize: 9, letterSpacing: ".2em", color: "rgba(234,215,156,.7)", textTransform: "uppercase" }}>
                  {isVip ? "VIP" : isParty ? "Party" : isStaff ? "Staff" : "Team"}
                </span>
              </span>
              <span aria-hidden="true" className="ff-acct-caret">
                <svg width="14" height="9" viewBox="0 0 14 9" style={{ display: "block" }}><path d="M1 1.2h12L7 8.2z" fill="currentColor" /></svg>
              </span>
            </button>
            {menuOpen && (
              <>
                <button type="button" className="ff-acct-scrim" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
                <div className="ff-acct-menu" role="menu" aria-label="FireFlair sites">
                  {state.role && (
                    <div className="ff-acct-who">
                      <div className="ff-acct-name">{isVip ? (((state.vip21 || {}).card || {}).name || "FF VIP") : isTeam ? (state.profile.name || state.session.tag || "Your profile") : ((state.company && state.company.name) || (isParty ? "FF Party" : "FF Staff"))}</div>
                      <div className="ff-acct-sub">
                        {isVip ? "FF VIP" : isTeam ? "FF Team" : isParty ? "FF Party" : "FF Staff"}{isVip ? (state.session.tag ? ` · ${state.session.tag}` : "") : isTeam ? (state.session.tag ? ` · ${state.session.tag}` : "") : (state.company && state.company.slug ? ` · ${CARD_DOMAIN}/${state.company.slug}` : "")}
                      </div>
                    </div>
                  )}
                  <div className="ff-acct-sect">FireFlair sites</div>
                  {FF_SITES.filter(s => PHASE1.sitesShown.includes(s.key)).sort((a, b) => { const o = SITE_ORDER17[currentSite || "team"] || SITE_ORDER17.team; return o.indexOf(a.key) - o.indexOf(b.key); })
                  .map(s => (
                    <button key={s.key} type="button" role="menuitem" className={`ff-site${s.locked ? " locked" : ""}`} data-href={s.url}
                      aria-current={currentSite === s.key ? "page" : undefined} aria-disabled={s.locked || undefined}
                      onClick={() => { setMenuOpen(false); goSite(s.key); }}>
                      <SiteMark site={s} size={30} />
                      <span style={{ minWidth: 0 }}>
                        <span className="ff-site-name">{s.name}</span>
                        <span className="ff-site-line">{s.line}</span>
                        {s.domain ? <span className="ff-site-dom">{s.domain}</span> : null}
                      </span>
                      {currentSite === s.key ? <span className="ff-site-here">You're here</span>
                        : s.locked ? <span className="ff-site-soon"><Lock size={10} /> Coming 2027</span>
                        : <ChevronRight size={15} color="rgba(234,215,156,.7)" />}
                    </button>
                  ))}
                  {authed && state.session.tag && (
                    <div className="ff-acct-foot">
                      <button type="button" role="menuitem" className="ff-acct-item" onClick={() => { setMenuOpen(false); setAcctOpen(true); }}>
                        FF Tag &amp; sign-in
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          {/* Home, Network, Bookings, Profile — centred in the bar on desktop. */}
          <nav className="ff-desknav" aria-label="Main">
            {/* v1.3: the FF coin sits to the right of Profile. */}
            {NAV.filter(n => n.key !== "__ff").map(n => partyLocked && PARTY_LOCKED_TABS17.includes(n.key) ? (
              <button key={n.key} type="button" className="ff-navlocked17" aria-disabled="true" aria-label={`${tabLabel17(n.key, state, n.label)}. ${LOCKED_LABEL17}`} title={LOCKED_LABEL17} onClick={(e) => e.preventDefault()}>{tabLabel17(n.key, state, n.label)}<Lock size={9} className="ff-locked17-ic" aria-hidden="true" /></button>
            ) : (
              <button key={n.key} className={state.tab === n.key ? "on" : ""} aria-current={state.tab === n.key ? "page" : undefined} onClick={() => goTab(n.key)}>{tabLabel17(n.key, state, n.label)}</button>
            ))}
            <button key="__ff" type="button" className="ff-topcoin ff-navcoin" style={{ position: "relative" }} onClick={() => setNotifyOpen(true)} aria-label="Notifications"><Coin size={30} tier="gold" />{notifyCount17(state) > 0 && <i className="ff-nbadge11">{notifyCount17(state)}</i>}</button>
          </nav>
          <div className="ff-topbar-right">
            {PHASE1.desktopAdd && state.role && (
              <button type="button" className="ff-topadd ff-deskonly" onClick={() => isTeam ? setShareOpen(true) : setAct(true)}
                aria-label={isTeam ? "Share your FireFlair card" : "Add FireFlair"}>
                Add <AddFireFlairMark size={16} />
              </button>
            )}
            <button type="button" className={`ff-authbtn${authed ? " out" : ""}`} onClick={() => authed ? logout() : setLoginOpen(true)}>
              {authed ? "Log out" : "Log in"}
            </button>
          </div>
        </div>
        {/* Desktop companion row: XP + booking status, same information as the
            mobile bottom bars, laid out for the header instead of floating
            fixed at the bottom of a wide viewport. */}
        {(xpRow || basket) && (
          <div className="ff-topbar-extras">
            {xpRow && (
              <button onClick={() => setXpOpen(true)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }} aria-label="Your FireFlair XP">
                <Coin size={24} tier={xpInfo.currentTier} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "flex", justifyContent: "space-between", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#EAD79C", marginBottom: 3 }}>
                    <span>{xpInfo.xp} XP</span>
                    <span style={{ color: "rgba(244,239,228,.55)" }}>{xpInfo.next ? `Next: ${xpInfo.next.label}` : "Top tier"}</span>
                  </span>
                  <span className="ff-xptrack" style={{ height: 5 }}><span className="ff-xpfill" style={{ width: `${xpInfo.pct}%` }} /></span>
                </span>
              </button>
            )}
            {basket && <BookingBar placement="top" dragging={dragging} />}
          </div>
        )}
        <LiveActionBar17 placement="top" />
      </header>

      <main id="ff-main" tabIndex={-1} className="ff-main" style={{ paddingBottom: bothBars ? 240 : bottomBarUp ? 190 : undefined }}>{children}<Phase1Footer /></main>

      {basket && <BookingBar placement="bottom" dragging={dragging} style={bothBars ? { bottom: "calc(var(--ff-navh, 64px) + 52px)" } : undefined} />}

      {xpInfo && <XPBar info={xpInfo} />}

      {state.toast && (
        <div style={{ position: "fixed", left: 14, right: 14, bottom: bothBars ? 200 : bottomBarUp ? 150 : 90, zIndex: 55, display: "flex", justifyContent: "center" }}>
          <span style={{ background: "#141416", color: "#EAD79C", border: "1px solid var(--gold-dk)", padding: "10px 16px", fontSize: 12, letterSpacing: ".06em", maxWidth: 420, textAlign: "center" }}>{state.toast}</span>
        </div>
      )}

      <nav className="ff-bottomnav ff-lattice" aria-label="Main, mobile">
        <LiveActionBar17 placement="bottom" />
        <div className="ff-bottomnav-in">
          {NAV.map(n => n.key === "__ff" ? (
            <div key="ff" className="ff-navcentre">
              <button className="ff-coinbtn" style={{ position: "relative" }} onClick={() => setNotifyOpen(true)} aria-label="Notifications">
                <Coin size={56} tier={isTeam ? xpProgress(state.profile.xp).currentTier : "gold"} />{notifyCount17(state) > 0 && <i className="ff-nbadge11">{notifyCount17(state)}</i>}
              </button>
            </div>
          ) : partyLocked && PARTY_LOCKED_TABS17.includes(n.key) ? (
            <button key={n.key} type="button" className="ff-navbtn ff-navlocked17" aria-disabled="true" aria-label={`${tabLabel17(n.key, state, n.label)}. ${LOCKED_LABEL17}`} title={LOCKED_LABEL17} onClick={(e) => e.preventDefault()}>
              <NavMark shape={n.mark} size={23} tone="#D8D6D0" /><Lock size={9} className="ff-locked17-ic" aria-hidden="true" />
            </button>
          ) : (
            <button key={n.key} className={`ff-navbtn ${state.tab === n.key ? "on" : ""}`}
              onClick={() => goTab(n.key)} aria-label={tabLabel17(n.key, state, n.label)} aria-current={state.tab === n.key ? "page" : undefined} title={tabLabel17(n.key, state, n.label)}>
              <NavMark shape={n.mark} size={23} tone={state.tab === n.key ? "#EAD79C" : "#D8D6D0"} />
            </button>
          ))}
        </div>
      </nav>

      <ActionSheet open={act} onClose={() => setAct(false)} />
      {state.role === "staff" ? <StaffGuideSheet open={xpOpen} onClose={() => setXpOpen(false)} /> : PHASE1.xpBar ? <XPSheet open={xpOpen} onClose={() => setXpOpen(false)} /> : <XPPopup open={xpOpen} onClose={() => setXpOpen(false)} />}
      <NotifySheet17 open={notifyOpen} onClose={() => setNotifyOpen(false)} onNext={() => { setNotifyOpen(false); setXpOpen(true); }} />
      <ShareCardSheet open={shareOpen} onClose={() => setShareOpen(false)} />
      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
      <FeedbackSheet open={fbOpen} onClose={() => setFbOpen(false)} />
      <Sheet open={acctOpen} onClose={() => setAcctOpen(false)} title="FF Tag & sign-in">
        <AccountSettings />
      </Sheet>
    </div>
  );
}



/* PROFILE PAGE — everything about "me" on one page. Before sharing: FF Tag
   first, then the card, FireFlair, CV, the full profile, then Save & Share — no
   separate screens. After sharing: the card and profile. Either way the
   profile saves itself once the account exists. */
function ProfilePage() {
  const { state } = useStore();
  useState(() => { resetQuestionOrder(); return 0; });   // new question order per visit
  useAutoSave();
  return state.profile.live ? <TeamProfile /> : <ProfileBuilder />;
}
