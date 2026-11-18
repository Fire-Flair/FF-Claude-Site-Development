/* src/components/party/delivery-and-extras.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
const hirerOf11 = (state, ev) => (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "The host";


/* Where a booking came from (v17.4.6): the event record says so (event.source, or site "party" for
   FF Party bookings); older records without either are read from the hirer, as hirerCard11 does. */
function eventSource17(state, ev) {
  if (!ev) return "staff";
  if (ev.source === "party" || ev.source === "staff") return ev.source;
  if (ev.site === "party" || ev.hirerKind === "host") return "party";
  return hirerCard11(state, ev).party ? "party" : "staff";
}


const whenOf11 = (sh) => `${shortDay(sh.iso) || sh.date || ""}${sh.time ? ` · ${sh.time}` : ""}`;


const pending11 = (state) => !(state.auth && state.auth.status === "signedIn" && ["SAM42", "ALEXG"].includes(state.auth.tag) && state.role === "team") ? [] : (state.engagements || []).filter(e => e.staffId === "me" && ["requested", "discuss"].includes(e.state) && (e.auto || e.exclusive)).filter(e => { const sh = state.shifts.find(x => x.id === e.shiftId); const st = sh && startMs17(sh); return sh && !(st && st <= now17(state)) && !(e.expiresAt && e.expiresAt <= now17(state)); });


/* Who the shift is for: a Company Card for a business, a VIP Host Card for a person. */
function hirerCard11(state, ev) {
  const nm = (ev && ev.hirer) || "";
  if (/vooshka/i.test(nm)) return { party: false, c: coFromProfile17("vooshka") };
  const co = companyList(state).find(x => x.name === nm);
  if (co) { const { id, mine, tier, ...rest } = co; return { party: false, c: rest }; }
  const mineCo = state.company || {};
  if (nm && mineCo.name === nm) return { party: state.site === "party", c: mineCo };
  if (!nm || nm === "The host" || (ev && ev.hirerKind === "host") || /private|party|wedding/i.test((ev && ev.kind) || ""))
    return { party: true, c: { ...DEMO_HOST17, name: nm && nm !== "The host" ? nm : DEMO_HOST17.name, photo: (window.FF_IMG || {}).face_you || "" } };
  return { party: false, c: { name: nm, kind: (ev && ev.kind) || "", slug: slugify(nm) } };
}


/* FF Team next steps: nothing about Event Cards, which belong to FF Staff and FF Party. */
function TeamSteps11({ onClose }) {
  const { state, dispatch } = useStore();
  const people = useDirectory();
  const p = state.profile;
  const live = !!p.live;
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const net = myNetwork(state, people).list.length;
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
  );
}


/* Notifications (v17.4.3): only cards that are waiting for YOUR reply. A Shift Card you were sent, or an
   Availability Card you were asked. Each is a dropdown, closed by default; opened, it shows the card itself
   with its reply buttons. Answer it and it leaves the list (history lives in Bookings). Booking history,
   "card sent", "signed off" and similar are NOT notifications. Next steps sit underneath. */
function availWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const answers = (state.profile && state.profile.answers) || {};
  return availabilityAskedOfMe(state).filter(x => !isPast(x.iso) && !isAnswered(answers[`av_${x.iso}`]));
}


/* Team invitations sent TO you. The real ones are state.teamAsksIn17 (a join link brought you in; see src/state/invite17.js).
   Core supplies the rest in production. These two samples appear only for the DEV complete-profile login (state.devDone.team).
   netAdd: the person added you to their network; the card asks whether to add them to your team. */
const TEAM_ASKS_DEMO17 = [
  { id: "tia_gav", fromId: "stf_gav", name: "Alexandru Gavrilas", tag: "GAVRILAS", netAdd: true, at: Date.UTC(2026, 10, 8) },
  { id: "tia_vooshka", fromId: "co_vooshka", name: "Vooshka Cocktail Bar", company: true, note: "Wants you on their company team", at: Date.UTC(2026, 10, 9) },
];


function teamAsksWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const done = state.teamAsks17 || {};
  const real = (state.teamAsksIn17 || []).filter(x => !done[x.id] && !(state.connections || []).some(c => c.id === x.fromId));
  const sample = state.devDone && state.devDone.team ? TEAM_ASKS_DEMO17.filter(x => !done[x.id] && !(state.connections || []).some(c => c.id === x.fromId) && !(x.company && (state.netAdds17 || []).includes(x.fromId))) : [];
  return [...real, ...sample];
}


/* Reviews written about you that wait for your decision (FF Team). Real: state.reviews about "me" with status "pending".
   The sample appears only for the DEV complete-profile login (state.devDone.team) until it is decided. */
const REVIEW_ASKS_DEMO17 = [{ id: "rva_gav", aboutId: "me", byId: "stf_gav", byName: "Alexandru Gavrilas", worked: true, rating: 5, text: "Calm behind a busy bar and great with guests.", at: Date.UTC(2026, 10, 8) }];


function reviewAsksWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const asked = state.reviewAsks17 || {};
  const real = (state.reviews || []).filter(r => r.aboutId === "me" && r.status === "pending");
  const sample = state.devDone && state.devDone.team ? REVIEW_ASKS_DEMO17.filter(r => !asked[r.id] && !(state.reviews || []).some(x => x.id === r.id)) : [];
  return [...real, ...sample];
}


/* Questions people asked on your profile that you haven't answered (FF Team). */
function questionsWaiting17(state, people) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  return askedOfMe(state, people).filter(q => !isAnswered(answerOf(state, q)));
}


/* Booker side (v17.4.6.1): replies to the invitations you sent, read from the same engagement records that drive the
   Event Card. One update per invitation and state, so retries and reloads never duplicate. Scoped to the site the
   booking was made on. "available" is an action (choose them) until it lapses; the others are updates. */
function bookingUpdates17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "staff")) return [];
  const site = state.site === "party" ? "party" : "staff", now = now17(state), out = [];
  (state.engagements || []).forEach(e => {
    const sh = state.shifts.find(x => x.id === e.shiftId), ev = sh && state.events.find(x => x.id === sh.eventId);
    if (!sh || !ev || isPast(ev.iso) || eventSource17(state, ev) !== site) return;
    /* The signed-in FF Team user ("me") counts only on a shift from their own FF Staff company, so a decline there reaches this list too. */
    if (e.staffId === "me" && !(ev.hirer && ((state.company && ev.hirer === state.company.name) || (["SAM42", "ALEXG"].includes(state.auth.tag) && coIsVk17(state) && ev.hirer === "Vooshka Cocktail Bar")))) return;
    const chosen = !!e.exclusive && !e.auto;
    const h = e.history || [], last = h[h.length - 1] || {}, prev = h[h.length - 2] || {};
    let kind = null;
    if (e.state === "confirmed") kind = "confirmed";
    else if (e.state === "unavailable" && chosen) kind = "unavailable";
    else if (e.state === "available" && e.selectBy > now) kind = "available";
    else if (e.state === "expired" && chosen && !e.filled && !e.closed && !e.cancelled && ["requested", "discuss"].includes(prev.state)) kind = "noreply";
    if (kind) out.push({ id: `${e.id}:${kind}`, kind, e, sh, ev, at: last.at || e.sentAt || 0, action: kind === "available" });
  });
  return out.sort((a, b) => b.at - a.at);
}


/* Join requests to your company (FF Staff) and company invitations to you (FF Team). */
const coRequests17 = (state) => ctRequestsForMe17(state);
const coInvites17 = (state) => ctInvitesForMe17(state);


/* One list per site. FF Team: cards sent to you, team invitations, questions on your profile.
   FF Staff and FF Party: replies to your invitations, questions from the people you asked to work, join requests.
   The badge counts what the list shows as new: every action, plus updates since the list was last opened. */
const notifyCount17 = (state) => state.role !== "team" ? 0
  : pending11(state).length + availWaiting17(state).length + teamAsksWaiting17(state).length + reviewAsksWaiting17(state).length + coInvites17(state).length + questionsWaiting17(state, state.directory || []).length;


/* Yes, No and a type box below, in the .ff-qa17 look. No send button: what is typed travels with Yes or No. */
function YesNoSay17({ placeholder, onAnswer }) {
  const [txt, setTxt] = useState("");
  return (
    <div className="ff-qa17">
      <div className="yn" role="group" aria-label="Your answer">
        <button type="button" onClick={() => onAnswer(true, txt.trim())}>Yes</button>
        <button type="button" onClick={() => onAnswer(false, txt.trim())}>No</button>
      </div>
      <div className="ty solo"><input aria-label={placeholder} value={txt} maxLength={400} onChange={(e) => setTxt(e.target.value)} placeholder={placeholder} /></div>
    </div>
  );
}


/* Someone added you to their network: a Question Card asks whether to add them to your team. */
function NetAddNote17({ x, person, onAccepted }) {
  const { dispatch } = useStore();
  const first = firstName(x.name);
  const answer = (accept, text) => {
    dispatch({ type: "TEAM_ASK_REPLY", ask: x, accept, text });
    dispatch({ type: "TOAST", toast: accept ? `You and ${first} are on each other's team` : "Not added" });
    if (accept && x.viaLink) dispatch({ type: "INV_PATCH", patch: { reviewOfferedAt: Date.now() } });
    if (accept && person && onAccepted) onAccepted(person);
  };
  return (
    <div className="ff-ndcard17 qn17">
      <div className="face"><QuestionCard q={{ text: `Add ${first} to your team?`, group: "asked" }} answer="" label="Network" asker={`${first} added you to their network`} pending=" " /></div>
      <YesNoSay17 placeholder={`Say hello to ${first}`} onAnswer={answer} />
    </div>
  );
}


/* A review written about you: a Question Card asks whether to show it on your profile. */
function ReviewAskNote17({ r }) {
  const { dispatch } = useStore();
  const first = firstName(r.byName);
  const n = r.rating ? Math.max(1, Math.min(5, Math.round(r.rating))) : 0;
  const answer = (show, text) => {
    dispatch({ type: "REVIEW_DECIDE", id: r.id, show, text, review: r });
    dispatch({ type: "TOAST", toast: show ? "Review added to your profile" : "Review not shown" });
  };
  const asker = <>{`${first} reviewed you`}{n ? <span className="stars" role="img" aria-label={`${n} out of 5 stars`}>{"★".repeat(n)}</span> : null}</>;
  return (
    <div className="ff-ndcard17 qn17">
      <div className="face"><QuestionCard q={{ text: "Show this review on your profile?", group: "asked" }} answer="" label="Review" slotLabel="Review" asker={asker} pending={String(r.text || "").trim() || " "} /></div>
      <YesNoSay17 placeholder={`Reply to ${first}`} onAnswer={answer} />
    </div>
  );
}


function TeamAskNote17({ x, onAccepted }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const person = x.company ? null : all.find(p => p.id === x.fromId);
  if (x.netAdd) return <NetAddNote17 x={x} person={person} onAccepted={onAccepted} />;
  const co = x.company ? companyById(state, x.fromId) : null;
  const first = x.company ? x.name : firstName(x.name);
  const reply = (accept) => { dispatch({ type: "TEAM_ASK_REPLY", ask: x, accept }); dispatch({ type: "TOAST", toast: accept ? `You and ${first} are on each other's team` : "Invitation declined" }); if (accept && x.viaLink) dispatch({ type: "INV_PATCH", patch: { reviewOfferedAt: Date.now() } }); if (accept && person && onAccepted) onAccepted(person); };
  return (
    <div className="ff-ndcard17">
      <div className="face">{co ? <CompanyCardFace c={co} size="sm" /> : person ? <PlayerCard person={person} format="portrait" themeKey={person.theme || "paper"} /> : null}</div>
      <p className="nt">{x.note}</p>
      <div className="btns two">
        <button type="button" className="yes" onClick={() => reply(true)}>Accept</button>
        <button type="button" className="no" onClick={() => reply(false)}>Decline</button>
      </div>
    </div>
  );
}


/* A company team invitation (to you, on FF Team) or a join request (to your company, on FF Staff). */
function CoTeamNote17({ x }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const co = companyList(state).find(c => coKey17(c) === x.companyKey);
  const person = x.personId ? findPerson(all, state, x.personId) : null;
  const reply = (accept) => { dispatch({ type: "CT_DECIDE", id: x.id, accept }); dispatch({ type: "TOAST", toast: accept ? (x.dir === "invite" ? `You're on ${x.companyName || "the company"}'s team` : `${firstName((person || x).name || "") || "They"} joined your team`) : x.dir === "invite" ? "Invitation declined" : "Request declined" }); };
  return (
    <div className="ff-ndcard17">
      <div className="face">{x.dir === "invite" ? (co ? <CompanyCardFace c={co} size="sm" /> : null) : person ? <PlayerCard person={person} format="portrait" themeKey={person.theme || "paper"} /> : null}</div>
      <p className="nt">{x.dir === "invite" ? `${x.companyName || "A company"} invites you to join their company team.` : `${(person || x).name || "Someone"} asks to join your company team.`}</p>
      <div className="btns two">
        <button type="button" className="yes" onClick={() => reply(true)}>Accept</button>
        <button type="button" className="no" onClick={() => reply(false)}>Decline</button>
      </div>
    </div>
  );
}


/* A reply to one of your invitations. Available opens the selection step on that booking; the rest open the booking. */
function BookingUpdateNote17({ u, who, onGo }) {
  const { state, dispatch } = useStore();
  const go = () => { dispatch({ type: "VIEW", id: null }); dispatch({ type: "V11_SET", patch: { bkView: { eventId: u.ev.id, open: "confirm", n: Date.now() } } }); dispatch({ type: "TAB", tab: "bookings" }); onGo && onGo(); window.scrollTo(0, 0); };
  const text = { confirmed: `${who.name || "They"} accepted the shift. It's confirmed.`, unavailable: `${who.name || "They"} can't work this shift.`, available: `${who.name || "They"} is available. Choosing them confirms the shift.`, noreply: `${who.name || "They"} didn't reply before the deadline. The invitation has ended.` }[u.kind];
  return (
    <div className="ff-ndcard17">
      <p className="nt">{text}</p>
      <div className="btns">{isPartySite17(state) ? <LockedBtn17 bare className="yes">{u.kind === "available" ? "Choose who to confirm" : "Open booking"}</LockedBtn17> : <button type="button" className="yes" onClick={go}>{u.kind === "available" ? "Choose who to confirm" : "Open booking"}</button>}</div>
    </div>
  );
}


/* A question in a notification is the same Question Card as on the profile page, with the quick answer under it. */
function QuestionNote17({ q, label, asker, noVis }) {
  const { state, dispatch } = useStore();
  const [vis, setVis] = useState("private");
  const save = (v) => { dispatch({ type: "ANSWER", qid: q.id, value: v, visibility: noVis ? undefined : vis }); dispatch({ type: "TOAST", toast: "Answer saved" }); };
  return (
    <div className="ff-ndcard17">
      <div className="face"><QuestionCard q={q} answer={answerOf(state, q)} label={label} asker={asker} pending=" " /></div>
      <QuickAnswer17 onSave={save} vis={vis} onVis={noVis ? undefined : setVis} />
    </div>
  );
}


/* A profile question asked on your Company page (FF Staff): answered Yes, No or typed, and Public or Private. */
function CoQuestionNote17({ q }) {
  const { dispatch } = useStore();
  const [vis, setVis] = useState("private");
  const save = (v) => { dispatch({ type: "COQ_ANSWER", id: q.id, value: v, visibility: vis }); dispatch({ type: "TOAST", toast: "Answer saved" }); };
  return (
    <div className="ff-ndcard17">
      <div className="face"><QuestionCard q={{ text: q.text, group: "asked" }} answer="" label="Asked" asker={`Asked by ${q.byName || "someone on FireFlair"}`} pending=" " /></div>
      <QuickAnswer17 onSave={save} vis={vis} onVis={setVis} />
    </div>
  );
}


function NoteDrop17({ id, open, onToggle, icon, title, sub, children }) {
  const ref = useRef(null);
  useEffect(() => { if (open && ref.current) ref.current.scrollIntoView({ block: "start", behavior: prefersReducedMotion() ? "auto" : "smooth" }); }, [open]);
  return (
    <li ref={ref} className={`ff-nd17${open ? " open" : ""}`}>
      <button type="button" className="hd" aria-expanded={open} aria-controls={`ff-nd-${id}`} onClick={onToggle}>
        <span className="ic" aria-hidden="true">{icon}</span>
        <span className="tx"><b>{title}</b><small>{sub}</small></span>
        <I11.ChevronDown size={18} className="chev" aria-hidden="true" />
      </button>
      {open && <div className="bd" id={`ff-nd-${id}`}>{children}</div>}
    </li>
  );
}


const NOTE_ICON17 = { shift: "Briefcase", avail: "CalendarCheck", team: "Users", coinvite: "Users", corequest: "UserPlus", question: "MessageSquare", coquestion: "MessageSquare", netadd: "Users", review: "Star", bkavail: "CalendarCheck", bkupd: "Check" };


function NotifySheet17({ open, onClose }) {
  const { state, dispatch } = useStore();
  const people = useDirectory();
  const [review, setReview] = useState(null);
  const [at, setAt] = useState(null);
  /* Updates that were new when the list opened stay listed while it is open. */
  const since = useRef(0), was = useRef(false);
  if (open && !was.current) since.current = state.notesSeenAt || 0;
  was.current = open;
  useEffect(() => { if (open) { dispatch({ type: "NOTES_SEEN" }); setAt(null); } }, [open]);
  if (!open) return null;
  const ic = (k, size = 18) => { const C = I11[NOTE_ICON17[k]] || I11.Users; return <C size={size} />; };
  const bodyOf = (it) => {
    if (it.kind === "shift") return null;   /* v1.1: Shift Cards come back with FF Staff */
    if (it.kind === "avail") return <QuestionNote17 q={availQ(it.x.iso)} label="Availability" asker={`Asked by ${it.x.byName}`} noVis />;
    if (it.kind === "team") return <TeamAskNote17 x={it.x} onAccepted={setReview} />;
    if (it.kind === "review") return <ReviewAskNote17 r={it.r} />;
    if (it.kind === "coinvite" || it.kind === "corequest") return <CoTeamNote17 x={it.x} />;
    if (it.kind === "bkavail") return <BookingUpdateNote17 u={it.u} who={findPerson(people, state, it.u.e.staffId) || {}} onGo={onClose} />;
    if (it.kind === "question") return <QuestionNote17 q={it.q} asker={`Asked by ${askerName(it.q, people)}`} />;
    return <CoQuestionNote17 q={it.q} />;
  };
  const brief = notesBrief17(state, people).map(it => ({ id: it.id, icon: ic(it.kind), title: it.title, sub: it.sub, body: bodyOf(it) }));
  const rows = brief;
  const ids = new Set(rows.map(r => r.id));
  const done = notesDoneFor17(state).filter(d => !ids.has(d.id));
  return (
    <Sheet open onClose={onClose} title="Notifications">
      <div className="ff-ntf17">
        {rows.length === 0 && done.length === 0 ? (state.auth.status !== "signedIn"
          ? <p className="none">Sign in to view your notifications.</p>
          : <p className="none">You are all caught up.</p>) : (
          <ul className="ff-ndlist17">
            {rows.map(r => (
              <NoteDrop17 key={r.id} id={r.id} open={at === r.id} onToggle={() => setAt(at === r.id ? null : r.id)} icon={r.icon} title={r.title} sub={r.sub}>{r.body}</NoteDrop17>))}
            {done.map(d => (
              <li key={`done-${d.id}`} className="ff-nd17 done" data-done="1">
                <div className="hd">
                  <span className="ic" aria-hidden="true">{ic(d.kind)}</span>
                  <span className="tx"><b>{d.title}</b><small>{d.sub}</small></span>
                  <span className="oc">{d.outcome}</span>
                </div>
              </li>))}
          </ul>)}
        {done.length > 0 && <div className="ff-ntf-clear17"><button type="button" onClick={() => dispatch({ type: "NOTES_CLEAR" })}>Clear</button></div>}
        <section className="ff-ntf-next17" aria-labelledby="ff-ntf-next-h">
          <h3 id="ff-ntf-next-h">Next steps</h3>
          <TeamSteps11 onClose={onClose} />
        </section>
      </div>
      <ReviewSheet open={!!review} person={review} onClose={() => setReview(null)} />
    </Sheet>
  );
}


/* ======================================================================================================
   v17.3.33 — Bookings (FF Team), FF events (FF Staff), personal terms (FF Team profile)
   ====================================================================================================== */
const E17I = { GraduationCap: lucideIcon("GraduationCap"), Plane: lucideIcon("Plane"), Gift: lucideIcon("Gift"), Layers: lucideIcon("Layers"), ChevronLeft: lucideIcon("ChevronLeft"), ChevronRight: lucideIcon("ChevronRight") };


/* What an FF Team member earns per package, and the shortest booking. */
const PAY17 = PKG_CAT17.filter(x => x.teamRegistration).reduce((m, x) => { m[x.id] = pkgPayPence17(x.id) / 100; return m; }, {});


const TIME17 = PKG_CAT17.reduce((m, x) => { m[x.id] = x.durationLabel; return m; }, {});


function PkgTile17({ sv, on, onClick }) {
  const pay = PAY17[sv.id];
  return (
    <button type="button" className={`ff-tp17 ${sv.tone}${on ? " on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span className="lv">{sv.level}</span>
      <b className="tt">{sv.title}</b>
      <span className="in">{sv.includes}</span>
      <span className="tm"><S17I.Clock size={12} /> {TIME17[sv.id] || sv.time}</span>
      <span className="pay">{pay != null && <><small>You earn</small><strong>{pkgPayLabel17(sv.id)}</strong></>}</span>
      <em className="go">{on ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}</em>
    </button>
  );
}
