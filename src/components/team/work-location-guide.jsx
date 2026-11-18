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
