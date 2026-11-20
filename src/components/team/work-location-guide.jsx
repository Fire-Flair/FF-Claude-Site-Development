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







/* Beneath Save & Share, before the profile is saved: where the finished card
   will appear (it does, in Welcome to the Team, once saved).
   v1.96: a member editing a live profile (me given) sees their own Profile Card in the same box. */
function CardPreviewSoon({ me, themeKey } = {}) {
  return (
    <div className={`ff-cardpreview-wrap${me ? " has-card" : ""}`}>
      <div className="ff-cardpreview">
        {me ? <div className="ff-cardpreview-card"><PlayerCard person={me} format="full" themeKey={themeKey} /></div> : <>
        <div className="ff-cardghost" aria-hidden="true">
          <span className="coin"><FFLogo size={22} tier="gold" /></span>
          <span className="av" /><span className="l1" /><span className="l2" /><span className="l3" /><span className="l4" />
        </div>
        <div className="ff-cardpreview-tx">
          <b>Join the Launch Challenge</b>
          <p>We will send you your card. Share it, bring in the people you work with and build a team to win.</p>
        </div>
        </>}
        {me ? <ShareStack /> : <ChallengeStack />}
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
