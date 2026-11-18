/* src/components/team/landing-shell.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* HOME (signed out) — FireFlair "Welcome to FireFlair", then everything FireFlair
   offers (FF Team, FF Party, Service Cards, Training, Festivals, FF Staff), where the
   network is, then every FireFlair site with a way in (v16.9 — replaces the
   two role cards). The full people wall lives on Network; Home shows four
   example Profile Cards and the FF Party search. */
function Landing() {
  const { state, dispatch } = useStore();
  if (state.tab === "network") return <NetworkScreen guest />;
  if (state.tab === "bookings") return <TeamBookings guest />;
  /* The old chooser screen is retired. Signed out with no role, any other tab (a TAB "profile" sent without a role, or a
     saved state) hands over: Profile opens FF Team Profile, the same as the hero's Create your Profile Card; anything else
     goes to the home page. */
  if (state.tab && state.tab !== "home") return <LandingHandOver17 tab={state.tab} />;

  return (
    <V101.Home101 />
  );
}


/* Runs once, then unmounts (Profile hands over to TeamRouter, Home to the home page), so it cannot loop. */
function LandingHandOver17({ tab }) {
  const { dispatch } = useStore();
  useEffect(() => {
    if (tab === "profile") { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); }
    else dispatch({ type: "TAB", tab: "home" });
  }, []);
  return null;
}



const NAV = [
  { key: "home", label: "Home", mark: "home" },
  { key: "network", label: "Network", mark: "network" },
  { key: "__ff", label: "", mark: null },
  { key: "bookings", label: "Bookings", mark: "bookings" },
  { key: "profile", label: "Profile", mark: "profile" },
];



const LOGIN_CSS21 = __ff_css("styles/login21.css");

/* Dial codes offered on the log-in sheet (the backend takes the code and the digits separately). */
const LOGIN_DIAL21 = [["+44", "UK"], ["+353", "IE"], ["+1", "US"], ["+33", "FR"], ["+34", "ES"], ["+39", "IT"], ["+49", "DE"], ["+31", "NL"], ["+351", "PT"], ["+971", "AE"], ["+61", "AU"], ["+91", "IN"]];

/* Six one-digit boxes for the WhatsApp code: types forward, backspace goes back, a pasted code fills all six. */
function CodeBoxes21({ value, onChange, onDone }) {
  const refs = useRef([]);
  const set = (digits) => { const d = digits.replace(/\D/g, "").slice(0, 6); onChange(d); if (d.length === 6 && onDone) onDone(d); };
  const put = (i, ch) => {
    const d = value.split(""); d[i] = ch; const next = d.join("").slice(0, 6);
    set(next); if (ch && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  return (
    <div className="ff-lg21-code" role="group" aria-label="Code from WhatsApp">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input key={i} ref={(el) => (refs.current[i] = el)} className={value[i] ? "on" : ""} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`Digit ${i + 1}`}
          value={value[i] || ""}
          onChange={(e) => { const ch = e.target.value.replace(/\D/g, "").slice(-1); if (ch) put(i, ch); else { const d = value.split(""); d[i] = ""; set(d.join("")); } }}
          onKeyDown={(e) => { if (e.key === "Backspace" && !value[i] && i > 0) refs.current[i - 1].focus(); }}
          onPaste={(e) => { e.preventDefault(); set(e.clipboardData.getData("text")); const n = Math.min(5, e.clipboardData.getData("text").replace(/\D/g, "").length); if (refs.current[n]) refs.current[n].focus(); }} />
      ))}
    </div>
  );
}

/* LOG IN — phone number + WhatsApp code, or username (FF Tag) + password. Talks only to AUTH_ADAPTER;
   a successful result becomes AUTH_SIGNED_IN, which is the one thing the nav button reads.
   v17.111: the WhatsApp tab asks for the phone number only (the account's FF Tag comes back from the
   service); the password tab asks for username and password. */
function LoginSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [mode, setMode] = useState("otp");
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [dial, setDial] = useState("+44");
  const [local, setLocal] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => { if (open) { setMode("otp"); setPw(""); setShowPw(false); setCode(""); setSent(false); setErr(null); setBusy(false); } }, [open]);
  if (!open) return null;

  const clean = AUTH_ADAPTER.cleanTag(user);
  const tagOk = AUTH_ADAPTER.tagOk(clean);
  const digits = local.replace(/\D/g, "").replace(/^0+/, "");
  const phone = `${dial} ${digits}`;
  const phoneOk = (dial.replace(/\D/g, "") + digits).length >= 9;
  const run = async (fn) => {
    setBusy(true); setErr(null);
    try { return await fn(); } catch (e) { setErr(e.message); return null; } finally { setBusy(false); }
  };
  const done = (res) => {
    if (!res) return;
    const mine = state.session && state.session.phone && state.session.phone.replace(/\D/g, "") === phone.replace(/\D/g, "") && state.session.tag;
    const tag = res.method === "otp" && mine ? state.session.tag : res.tag;
    if (res.method === "otp") dispatch({ type: "SESSION", patch: { tag, phone, verified: true } });
    else dispatch({ type: "SESSION", patch: { tag } });
    const draft = !!(state.session && state.session.reviewDraft17);
    dispatch({ type: "AUTH_SIGNED_IN", tag, method: res.method, login: true });
    /* A review written while signed out posts at sign-in with its own "Review sent to …" toast; keep that one. */
    if (!draft) dispatch({ type: "TOAST", toast: `Logged in as ${tag}` });
    onClose();
  };
  const switchTo = (m) => { setMode(m); setErr(null); setSent(false); setCode(""); };
  const loginPw = () => run(() => AUTH_ADAPTER.loginWithPassword(clean, pw)).then(done);
  const sendCode = () => run(() => AUTH_ADAPTER.sendCode(phone)).then(r => { if (r) setSent(true); });
  const verify = (c) => run(() => AUTH_ADAPTER.verifyCode(phone, c || code)).then(done);

  return (
    <Sheet open onClose={onClose} title="Log in" newLogo>
      <style>{LOGIN_CSS21}</style>
      <div className="ff-lg21">
        <header className="ff-lg21-hd">
          <span className="mk" aria-hidden="true"><FFLogo size={64} tier="gold" /></span>
          <h2>Welcome back</h2>
        </header>

        <div className="ff-lg21-tabs" role="tablist" aria-label="How to log in">
          <button type="button" role="tab" aria-selected={mode === "otp"} className={mode === "otp" ? "on" : ""} onClick={() => switchTo("otp")}><WhatsAppIcon size={14} /> WhatsApp</button>
          <button type="button" role="tab" aria-selected={mode === "password"} className={mode === "password" ? "on" : ""} onClick={() => switchTo("password")}><Lock size={13} /> Password</button>
        </div>

        {mode === "password" ? (
          <form className="ff-lg21-form" onSubmit={(e) => { e.preventDefault(); if (tagOk && pw && !busy) loginPw(); }}>
            <label className="ff-lg21-f"><span>Username</span>
              <input className="ff-lg21-in" autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Your FF Tag" value={clean} maxLength={AUTH_ADAPTER.TAG_MAX} onChange={(e) => setUser(e.target.value)} />
            </label>
            <label className="ff-lg21-f"><span>Password</span>
              <span className="ff-lg21-pw">
                <input className="ff-lg21-in" type={showPw ? "text" : "password"} autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
                <button type="button" className="eye" aria-label={showPw ? "Hide password" : "Show password"} aria-pressed={showPw} onClick={() => setShowPw(v => !v)}>{showPw ? <EyeOff size={17} /> : <Eye size={17} />}</button>
              </span>
            </label>
            <button type="submit" className="ff-lg21-go" disabled={busy || !tagOk || !pw}>{busy ? <Loader2 size={16} className="ff-spin" /> : <ShieldCheck size={16} />} Log in</button>
          </form>
        ) : !sent ? (
          <form className="ff-lg21-form" onSubmit={(e) => { e.preventDefault(); if (phoneOk && !busy) sendCode(); }}>
            <label className="ff-lg21-f"><span>Phone number</span>
              <span className="ff-lg21-ph">
                <select aria-label="Country code" value={dial} onChange={(e) => setDial(e.target.value)}>{LOGIN_DIAL21.map(([d, n]) => <option key={d} value={d}>{n} {d}</option>)}</select>
                <input className="ff-lg21-in" type="tel" autoComplete="tel-national" placeholder="7700 900000" value={local} onChange={(e) => setLocal(e.target.value)} />
              </span>
            </label>
            <button type="submit" className="ff-lg21-go wa" disabled={busy || !phoneOk}>{busy ? <Loader2 size={16} className="ff-spin" /> : <WhatsAppIcon size={16} />} Send code on WhatsApp</button>
          </form>
        ) : (
          <div className="ff-lg21-form">
            <p className="ff-lg21-to">Code sent to <b>{phone}</b></p>
            <CodeBoxes21 value={code} onChange={setCode} onDone={(c) => !busy && verify(c)} />
            <button type="button" className="ff-lg21-go" disabled={busy || code.length < 6} onClick={() => verify()}>{busy ? <Loader2 size={16} className="ff-spin" /> : <ShieldCheck size={16} />} Log in</button>
            <button type="button" className="ff-lg21-link" onClick={() => { setSent(false); setCode(""); setErr(null); }}>Use a different number</button>
          </div>
        )}

        {err && <p className="ff-lg21-err" role="alert">{err}</p>}
      </div>
      {/* TESTING ONLY (Alex, 18 Nov 12:59): DEV sign-ins so every FF Team screen can be tested. Remove before go-live. */}
      <button type="button" className="ff-dev17 login" onClick={() => {
        seedDemo17(state, dispatch, "team");
        dispatch({ type: "V11_SET", patch: { devDone: { team: true } } });
        dispatch({ type: "AUTH_SIGNED_IN", tag: "ALEXG", method: "dev" });
        if (!state.role) dispatch({ type: "ROLE", role: "team" });
        dispatch({ type: "TOAST", toast: "Complete profile loaded" });
        onClose();
      }}>DEV · complete profile</button>
      <button type="button" className="ff-dev17 login" onClick={() => {
        dispatch({ type: "SIGN_OUT" });
        dispatch({ type: "ROLE", role: "team" });
        dispatch({ type: "SESSION", patch: { refTag: "ALEX424", refKind: "team" } });
        dispatch({ type: "TAB", tab: "profile" });
        dispatch({ type: "TOAST", toast: "Join from invite loaded" });
        onClose();
        window.scrollTo(0, 0);
      }}>DEV · join from invite</button>
      <button type="button" className="ff-dev17 login" onClick={() => {
        dispatch({ type: "SIGN_OUT" });
        dispatch({ type: "ROLE", role: "team" });
        dispatch({ type: "TAB", tab: "profile" });
        dispatch({ type: "TOAST", toast: "New member loaded" });
        onClose();
        window.scrollTo(0, 0);
      }}>DEV · new member</button>
    </Sheet>
  );
}



function Shell({ children }) {
  const { state, dispatch } = useStore();
  const [xpOpen, setXpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [fbOpen, setFbOpen] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);
  useEffect(() => { const h = () => setFbOpen(true); window.addEventListener("ff-feedback", h); return () => window.removeEventListener("ff-feedback", h); }, []);
  useEffect(() => { const h = () => setLoginOpen(true); window.addEventListener("ff-login", h); return () => window.removeEventListener("ff-login", h); }, []);
  useEffect(() => { const h = () => setShareOpen(true); window.addEventListener("ff-add", h); return () => window.removeEventListener("ff-add", h); }, []);
  /* Anything can open the FF XP pop-up with an "ff-xp" event. */
  useEffect(() => { const h = () => setXpOpen(true); window.addEventListener("ff-xp", h); return () => window.removeEventListener("ff-xp", h); }, []);
  const authed = !!state.auth && state.auth.status === "signedIn";
  const logout = async () => {
    try { await AUTH_ADAPTER.logout(); } catch (e) { /* signed out locally either way */ }
    dispatch({ type: "SIGN_OUT" });
    window.scrollTo(0, 0);
  };
  const isTeam = state.role === "team";
  const goTab = (tab) => {
    if (!state.role && tab === "profile") { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile" }); return; }
    if (!state.role) { dispatch({ type: "TAB", tab }); return; }
    dispatch({ type: "TAB", tab, route: state.profile.live ? "home" : state.route });
  };

  useEffect(() => {
    if (!state.toast) return;
    const t = setTimeout(() => dispatch({ type: "TOAST", toast: null }), 2400);
    return () => clearTimeout(t);
  }, [state.toast, dispatch]);


  return (
    <div className="ff-shell">
      <a className="ff-skip" href="#ff-main">Skip to content</a>
      <header className="ff-topbar ff-lattice">
        <div className="ff-topbar-in">
          {/* Top left (v1.1): the FF logo and "FF Team". It opens the FF Team home; there is no site list. */}
          <div className="ff-acct">
            <button type="button" className="ff-acct-btn" aria-label="FF Team home" onClick={() => goTab("home")}>
              <img decoding="async" className="ff-acct-logo" src={FF_SITE_BRAND.team.icon} width={30} height={30} alt="" draggable={false} />
              <span className="ff-display" style={{ fontSize: 15, lineHeight: 1.1, letterSpacing: ".06em", color: "#EAD79C", whiteSpace: "nowrap" }}>FF Team</span>
            </button>
          </div>
          {/* Home, Network, Bookings, Profile — centred in the bar on desktop. */}
          <nav className="ff-desknav" aria-label="Main">
            {/* v1.3: the FF coin sits to the right of Profile. */}
            {NAV.filter(n => n.key !== "__ff").map(n => (
              <button key={n.key} className={state.tab === n.key ? "on" : ""} aria-current={state.tab === n.key ? "page" : undefined} onClick={() => goTab(n.key)}>{tabLabel17(n.key, state, n.label)}</button>
            ))}
            <button key="__ff" type="button" className="ff-topcoin ff-navcoin" style={{ position: "relative" }} onClick={() => setNotifyOpen(true)} aria-label={notifyCount17(state) > 0 ? `Notifications, ${notifyCount17(state)} waiting` : "Notifications"}>
              {/* The coin becomes the count: the number replaces FF on the black face. */}
              <span className="ff-coinwrap20 desk"><style>{NET20_CSS}</style><Coin size={30} tier="gold" /><span className={`ff-coinnum20${notifyCount17(state) > 0 ? " on" : ""}${notifyCount17(state) > 9 ? " d2" : ""}`} aria-hidden="true">{notifyCount17(state) > 0 ? Math.min(notifyCount17(state), 99) : ""}</span></span>
            </button>
          </nav>
          <div className="ff-topbar-right">
            {PHASE1.desktopAdd && state.role && (
              <button type="button" className="ff-topadd ff-deskonly" onClick={() => setShareOpen(true)}
                aria-label="Share your FireFlair card">
                Add <AddFireFlairMark size={16} />
              </button>
            )}
            <button type="button" className={`ff-authbtn${authed ? " out" : ""}`} onClick={() => authed ? logout() : setLoginOpen(true)}>
              {authed ? "Log out" : "Log in"}
            </button>
          </div>
        </div>
        <LiveActionBar17 placement="top" />
      </header>

      <main id="ff-main" tabIndex={-1} className="ff-main">{children}</main>


      {state.toast && (
        <div style={{ position: "fixed", left: 14, right: 14, bottom: 90, zIndex: 55, display: "flex", justifyContent: "center" }}>
          <span style={{ background: "#141416", color: "#EAD79C", border: "1px solid var(--gold-dk)", padding: "10px 16px", fontSize: 12, letterSpacing: ".06em", maxWidth: 420, textAlign: "center" }}>{state.toast}</span>
        </div>
      )}

      <nav className="ff-bottomnav ff-lattice" aria-label="Main, mobile">
        <LiveActionBar17 placement="bottom" />
        <div className="ff-bottomnav-in">
          {NAV.map(n => n.key === "__ff" ? (
            <div key="ff" className="ff-navcentre">
              <button className="ff-coinbtn" style={{ position: "relative" }} onClick={() => setNotifyOpen(true)} aria-label={notifyCount17(state) > 0 ? `Notifications, ${notifyCount17(state)} waiting` : "Notifications"}>
                <span className="ff-coinwrap20 mob"><style>{NET20_CSS}</style><FFLogo size={56} tier={isTeam ? "standard" : "gold"} /><span className={`ff-coinnum20${notifyCount17(state) > 0 ? " on" : ""}${notifyCount17(state) > 9 ? " d2" : ""}`} aria-hidden="true">{notifyCount17(state) > 0 ? Math.min(notifyCount17(state), 99) : ""}</span></span>
              </button>
            </div>
          ) : (
            <button key={n.key} className={`ff-navbtn ${state.tab === n.key ? "on" : ""}`}
              onClick={() => goTab(n.key)} aria-label={tabLabel17(n.key, state, n.label)} aria-current={state.tab === n.key ? "page" : undefined} title={tabLabel17(n.key, state, n.label)}>
              <NavMark shape={n.mark} size={23} tone={state.tab === n.key ? "#EAD79C" : "#D8D6D0"} />
            </button>
          ))}
        </div>
      </nav>

      <XPPopup open={xpOpen} onClose={() => setXpOpen(false)} />
      <NotifySheet17 open={notifyOpen} onClose={() => setNotifyOpen(false)} onNext={() => { setNotifyOpen(false); setXpOpen(true); }} />
      <ShareCardSheet open={shareOpen} onClose={() => setShareOpen(false)} />
      <LoginSheet open={loginOpen} onClose={() => setLoginOpen(false)} />
      <FeedbackSheet open={fbOpen} onClose={() => setFbOpen(false)} />
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
  /* v17.40: one edit screen for new and existing members. A live profile reaches this only through Edit; TeamProfile
     (bookings.jsx) is no longer shown here. */
  return <ProfileBuilder />;
}
