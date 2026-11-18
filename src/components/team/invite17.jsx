/* src/components/team/invite17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   INVITATIONS (v17.6.1)
   InviteBanner17  the banner at the top of the create-a-profile page: the inviter's Profile Card (small, left) and, on the right,
                   who invited you. Shown only when a real record says someone brought you in (src/state/invite17.js).
   InviteHost17    mounted once in App: the "ff-invite" event opens the Share sheet with your own Profile Card and your join link.
   docs/invitations-phase2.md has the states and the exact words.
   ========================================================================== */
const INV17_CSS = `
.ff .ff-inv17 { display:grid; grid-template-columns:auto minmax(0,1fr); gap:14px; align-items:center; margin:0 0 18px; padding:14px; border-radius:22px; corner-shape:squircle; background:#FFF8E8; border:1px solid rgba(176,141,42,.5); box-shadow:0 10px 22px -16px rgba(60,20,8,.45); box-sizing:border-box; min-width:0; }
.ff .ff-inv17 .card { width:112px; flex:none; display:block; padding:0; border:0; background:none; cursor:pointer; border-radius:12px; corner-shape:squircle; }
.ff .ff-inv17 .card > * { width:100%; pointer-events:none; }
.ff .ff-inv17 .tx { display:grid; gap:8px; min-width:0; }
.ff .ff-inv17 .h { margin:0; font-family:var(--serif); font-size:clamp(16px,4.6vw,19px); line-height:1.25; font-weight:700; color:#5C1220; overflow-wrap:normal; word-break:normal; hyphens:none; }
.ff .ff-inv17 .p { margin:0; font-size:13.5px; line-height:1.4; color:#3A2E10; overflow-wrap:normal; word-break:normal; hyphens:none; }
.ff .ff-inv17 .btns { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:2px; }
.ff .ff-inv17 .btns button { min-height:42px; padding:0 8px; border-radius:999px; corner-shape:squircle; border:1.5px solid #6B1226; background:#FBF8F1; color:#6B1226; font-weight:700; font-size:13.5px; cursor:pointer; white-space:nowrap; }
.ff .ff-inv17 .btns button.yes { background:#6B1226; color:#FBF8F1; }
@media (min-width:700px) {
  .ff .ff-inv17 { gap:22px; padding:18px 22px; }
  .ff .ff-inv17 .card { width:148px; }
  .ff .ff-inv17 .h { font-size:22px; }
  .ff .ff-inv17 .p { font-size:15px; }
  .ff .ff-inv17 .btns { max-width:340px; }
}
`;


function InviteBanner17() {
  const { state, dispatch } = useStore();
  const people = useDirectory();
  const [reviewing, setReviewing] = useState(false);
  const signedIn = !!(state.auth && state.auth.status === "signedIn");
  const ref = signedIn ? state.profile.referredBy : null;
  const inv = inviterOf(state, people);
  if (!inv || (signedIn && !ref)) return null;
  const kind = signedIn ? ref.kind : state.session.refKind;
  const first = String(inv.name || "").split(" ")[0];
  /* v17.22: a waiting team invitation from this person decides the banner, whatever the link kind (a shared-card sign-up creates one too).
     An older shared-card account with no invitation record behaves as before. */
  const rec = signedIn ? (state.teamAsksIn17 || []).find(x => x.fromId === inv.id) : null;
  const teamish = signedIn && (kind === "team" || !!rec);
  const verdict = rec ? (state.teamAsks17 || {})[rec.id] : null;
  const accepted = teamish && (verdict === "accepted" || (state.connections || []).some(c => c.id === inv.id));
  const setAside = teamish && !accepted && (verdict === "declined" || !!ref.notNowAt);
  const pending = teamish && !accepted && !setAside && !!rec;
  const complete = signedIn && (!!ref.completedAt || profileBasics17(state));
  const reviewDone = !accepted || !!ref.reviewOfferedAt;
  const finished = signedIn && complete && (!teamish || accepted || setAside || !rec) && reviewDone && !reviewing;
  if (finished) return null;
  const accept = () => {
    dispatch({ type: "TEAM_ASK_REPLY", ask: rec, accept: true });
    dispatch({ type: "TOAST", toast: `You and ${first} are on each other's team` });
    dispatch({ type: "INV_PATCH", patch: { reviewOfferedAt: Date.now() } });
    setReviewing(true);
  };
  const open = () => { dispatch({ type: "VIEW", id: inv.id }); window.scrollTo(0, 0); };
  const line1 = (signedIn ? !teamish : kind !== "team") ? `${inv.name} invited you to FireFlair` : accepted ? `You are on ${first}'s team` : `You have been invited to join ${inv.name}'s team`;
  return (
    <div className="ff-inv17" data-inv17={kind}>
      <style>{INV17_CSS}</style>
      <button type="button" className="card" onClick={open} aria-label={`Open ${inv.name}'s profile`}>
        <PlayerCard person={inv} format="portrait" nameAs="div" themeKey={inv.theme || "paper"} />
      </button>
      <div className="tx">
        <h2 className="h">{line1}</h2>
        {!complete && <p className="p">{first} will be rewarded when your profile is complete.</p>}
        {pending && (
          <div className="btns">
            <button type="button" className="yes" onClick={accept}>Accept</button>
            <button type="button" onClick={() => dispatch({ type: "INV_PATCH", patch: { notNowAt: Date.now() } })}>Not now</button>
          </div>
        )}
      </div>
      {reviewing && <ReviewSheet open person={inv} onClose={() => setReviewing(false)} />}
    </div>
  );
}


/* Invite: the Share sheet with your own Profile Card, "Join my team on FireFlair:" and your join link.
   Needs a signed-in member whose profile is complete; anyone else is taken to FF Team > Profile. */
function InviteHost17() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => {
      const s = ref.current;
      if (s.role !== "team") return;
      if (profileBasics17(s)) { setOpen(true); return; }
      dispatch({ type: "TAB", tab: "profile", route: s.profile.live ? "home" : s.route });
      window.scrollTo(0, 0);
    };
    window.addEventListener("ff-invite", h);
    return () => window.removeEventListener("ff-invite", h);
  }, []);
  if (!open || !profileBasics17(state)) return null;
  const tag = String(state.auth.tag || state.session.tag || "");
  const me = { ...meAsStaff(state.profile, state.session), group: "Your profile" };
  return (
    <CardShareSheet17 open onClose={() => setOpen(false)} title={SHARE_TITLE17} message={SHARE_MSG17} url={inv17Link(tag)} noRef fileName={"fireflair-join-" + cx17Slug(tag)}>
      <PlayerCard person={me} format="full" nameAs="div" themeKey={state.profile.theme} />
    </CardShareSheet17>
  );
}
