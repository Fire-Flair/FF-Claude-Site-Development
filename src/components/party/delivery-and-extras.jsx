/* src/components/party/delivery-and-extras.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The FF coin is the notification centre on every site. Next steps (and XP, later) sit under the notifications. */
/* ==== v1.1 Shift delivery ====================================================================
   One Shift card for the person being booked, in two flavours that share the same layout:
     selected   the business chose you (engagement.exclusive). Reply Yes, No or Ask a question.
     autofill   one of up to 10 invited (engagement.auto). Yes means "available": the business then chooses.
   Every action is the same record the WhatsApp buttons change (AF_RESPOND). WhatsApp allows at most three
   buttons, so the card has three too: Yes, No, Ask a question. Confirmed bookings keep a quiet
   "Can't make it?" link: refer someone, invite someone new, or a hard cancel (back to Autofill).
   Cream background, burgundy and black only. PROTOTYPE: the WhatsApp text is shown, not sent. */
const SD11_CSS = __ff_css("styles/sd11.css");


if (typeof document !== "undefined" && !document.getElementById("ff-sd11-css")) {
  const st11 = document.createElement("style");
  st11.id = "ff-sd11-css";
  st11.textContent = SD11_CSS;
  document.head.appendChild(st11);
}


/* Reply buttons for a Shift Card, the same on the website and in the WhatsApp templates (docs/whatsapp-templates.md).
   WhatsApp allows three quick-reply buttons: the third is Ask. */
const WA_BTN17 = { exclusive: ["Accept shift", "Unavailable", "Ask"], auto: ["I’m available", "Unavailable", "Ask"] };


const hirerOf11 = (state, ev) => (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "The host";


/* Where a booking came from (v17.4.6): the event record says so (event.source, or site "party" for
   FF Party bookings); older records without either are read from the hirer, as hirerCard11 does. */
function eventSource17(state, ev) {
  if (!ev) return "staff";
  if (ev.source === "party" || ev.source === "staff") return ev.source;
  if (ev.site === "party" || ev.hirerKind === "host") return "party";
  return hirerCard11(state, ev).party ? "party" : "staff";
}


const SRC17_LABEL = { staff: "FF Staff shift", party: "FF Party package" };


/* The plate at the top left of a Shift Card says where it came from. */
const PLATE17 = { staff: "FF Staff shift card", party: "FF Party card" };


/* The Pay row: Hourly and Shift total side by side, from payOf17. Missing or unreadable pay is shown
   as such, never filled in. */
function PayPair17({ shift }) {
  const p = payOf17(shift);
  if (p.status !== "ok") return <span className="ff-pay17 bad" title={p.problem || ""}>{p.status === "missing" ? "Pay not recorded" : "Pay can't be read"}</span>;
  const hrs = Math.round((p.mins / 60) * 100) / 100;
  return <span className="ff-pay17 one"><b>{gbp17(p.hourlyP)} p/h × {hrs} {hrs === 1 ? "hr" : "hrs"} = {gbp17(p.totalP)}</b></span>;
}


const whenOf11 = (sh) => `${shortDay(sh.iso) || sh.date || ""}${sh.time ? ` · ${sh.time}` : ""}`;


/* The WhatsApp message that goes with a Shift card. Selected and Autofill read differently; the card is the same. */
const waMsg11 = (state, e, sh, ev) => {
  const h = hirerOf11(state, ev), when = whenOf11(sh), place = sh.venue || (ev && ev.venue) || "";
  return e.auto
    ? `${h} needs a ${sh.role} on ${when}${place ? ` at ${place}` : ""}.\nYou're one of ${e.batchSize || 10} people invited. If you're free, tap I'm available and ${h} will choose from everyone available. This doesn't confirm the shift.`
    : `${h} has chosen you as ${sh.role} on ${when}${place ? ` at ${place}` : ""}.\nThe shift is held for you until ${dt17(e.expiresAt)}. Tap Accept shift to confirm it.`;
};


const pending11 = (state) => !(state.auth && state.auth.status === "signedIn" && ["SAM42", "ALEXG"].includes(state.auth.tag) && state.role === "team") ? [] : (state.engagements || []).filter(e => e.staffId === "me" && ["requested", "discuss"].includes(e.state) && (e.auto || e.exclusive)).filter(e => { const sh = state.shifts.find(x => x.id === e.shiftId); const st = sh && startMs17(sh); return sh && !(st && st <= now17(state)) && !(e.expiresAt && e.expiresAt <= now17(state)); });



function ShiftDelivery11({ e, shift, event, mini, onDone, viewer }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [brief, setBrief] = useState(false), [ask, setAsk] = useState(false), [txt, setTxt] = useState(""), [mode, setMode] = useState(null), [nm, setNm] = useState(""), [ph, setPh] = useState("");
  if (!shift) return null;
  const now = now17(state), st = startMs17(shift), ended = !!(st && st <= now);
  const pend = ["requested", "discuss"].includes(e.state), avail = e.state === "available", conf = e.state === "confirmed";
  const hirer = hirerOf11(state, event);
  const go = (as, text) => dispatch({ type: "AF_RESPOND", id: e.id, as, text });
  const yes = () => { go(e.auto ? "available" : "accept"); dispatch({ type: "TOAST", toast: e.auto ? "You're available. The host will choose" : "Shift accepted. It's in your bookings" }); onDone && onDone(); };
  const no = () => { go("unavailable"); dispatch({ type: "TOAST", toast: "Marked unavailable. The host has been told" }); onDone && onDone(); };
  const send = () => { if (!txt.trim()) return; go("discuss", txt.trim()); setTxt(""); setAsk(false); };
  const people = (state.connections || []).map(c => findPerson(all, state, c.id)).filter(p => p && !p.isCompany && p.id !== "me").slice(0, 8);
  const handTo = e.handover && ((findPerson(all, state, (state.engagements.find(x => x.id === e.handover.to) || {}).staffId) || {}).name || e.handover.name);
  const handEng = e.handover && state.engagements.find(x => x.id === e.handover.to);
  const kind = e.auto ? "auto" : "sel";
  const src = eventSource17(state, event);
  const hv = viewer === "hirer", act = !hv;
  const who = findPerson(all, state, e.staffId) || {};
  const fn = firstName(who.name || "");
  const tag = e.auto ? "Open shift" : hv ? (e.staffId ? `Selected${fn ? ` · ${fn}` : ""}` : "Shift card") : `${fn ? `${fn}, you've` : "You've"} been selected`;
  const hn = hirer === "The host" ? "the host" : hirer;
  const intro = e.auto
    ? `${hirer} needs a ${shift.role}. If you're free, say so and ${hn} will choose. Saying you're available doesn't confirm the shift.`
    : `${hirer} has chosen you for this shift. It is held for you until ${dt17(e.expiresAt)}.`;
  const rows = (
    <div className="ff-evc-rows">
      <EvRow icon={I11.CalendarDays} k="When">{whenOf11(shift)}</EvRow>
      <EvRow icon={I11.MapPin} k="Where">{shift.venue || (event && event.venue) || "To be confirmed"}</EvRow>
      <EvRow icon={I11.Banknote} k="Pay"><PayPair17 shift={shift} /></EvRow>
      <EvRow icon={I11.Shirt} k="Dress">{shift.dress || "To be confirmed"}</EvRow>
      <EvRow icon={I11.Briefcase} k="Hired by">{hirer}</EvRow>
    </div>
  );
  const askBox = ask && <div className="ask"><input aria-label="Your question" value={txt} onChange={(x) => setTxt(x.target.value.slice(0, 200))} placeholder="Your question" /><div className="btns" style={{ gridTemplateColumns: "1fr" }}><button type="button" className="yes" disabled={!txt.trim()} onClick={send}>Send question</button></div></div>;
  const thread = (e.thread || []).length > 0 && <div className="thread">{e.thread.map((m, i) => <p key={i}>{m.from === "pro" ? (viewer === "hirer" ? `${firstName((findPerson(all, state, e.staffId) || {}).name || "") || "They"}: ` : "You: ") : (viewer === "hirer" ? "You: " : `${hirer}: `)}{m.text}</p>)}</div>;
  return (<div className="ff-sdw">
    <article className={`ff-evc ff-sd11 ${kind} src-${src}${mini ? " mini" : ""}`} aria-label={`${SRC17_LABEL[src]}: ${shift.role}`}>
      <span className="ff-evc-plate">{PLATE17[src]}</span>
      <span className="ff-evc-coin"><Coin size={30} tier="gold" /></span>
      <span className="stag">{tag}</span>
      <h3 className="ff-evc-name">{shift.role}</h3>
      <p className="sev">{event ? eventTitle(event) : ""}</p>
      <div className="ff-evc-rule" aria-hidden="true"><i /><span>◆</span><i /></div>
      {mini ? <p className="sev" style={{ marginTop: 8 }}>{whenOf11(shift)}</p> : rows}
      <div className="sbd">
        {!mini && shift.notes ? <p className="nt">{shift.notes}</p> : null}
        {thread}
        {hv && <p className="ok">{engText(e) || "Not sent yet"}{conf ? ` · Ref ${e.ref || ref17(e)}` : ""}</p>}
      </div>
    </article>
    {act && (
      <div className={`ff-sd11 acts src-${src}`}>
        {act && pend && <p className="nt">{intro}</p>}
        {act && pend && !ended && (<>
          <div className="btns" role="group" aria-label="Your reply" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button type="button" className="yes" onClick={yes}>{e.auto ? WA_BTN17.auto[0] : WA_BTN17.exclusive[0]}</button>
            <button type="button" className="no" onClick={no}>{WA_BTN17.exclusive[1]}</button>
          </div>
          <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button type="button" onClick={() => setAsk(!ask)} aria-expanded={ask}>Ask</button>
            <button type="button" onClick={() => setBrief(true)}>More information</button>
          </div>
          {askBox}
        </>)}
        {act && pend && ended && <p className="mute">This shift has started.</p>}
        {act && avail && (<>
          <p className="ok">You're available. {hirer} will choose by {dt17(e.selectBy)}.</p>
          <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button type="button" onClick={() => setAsk(!ask)} aria-expanded={ask}>Ask</button>
            <button type="button" onClick={() => setBrief(true)}>More information</button>
          </div>
          {askBox}
        </>)}
        {act && conf && (<>
          <p className="ok">Confirmed</p>
          <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button type="button" onClick={() => setAsk(!ask)} aria-expanded={ask}>Ask</button>
            <button type="button" onClick={() => setBrief(true)}>More information</button>
          </div>
          {askBox}
          {e.handover && !e.handover.done && <p className="mute">Handover offered to {handTo || "your referral"}. You stay booked until they confirm.</p>}
          {e.handover && !e.handover.done && handEng && handEng.state === "requested" && (
            <div className="proto">Prototype: <button type="button" onClick={() => dispatch({ type: "SHIFT_REFER_ACCEPT", id: handEng.id })}>{handTo || "They"} accept</button></div>)}
          {!ended && !(e.handover && !e.handover.done) && mode === null && <button type="button" className="quiet" onClick={() => setMode("menu")}>Can't make it?</button>}
          {mode === "menu" && (
            <div className="cm">
              <button type="button" className="row" onClick={() => setMode("refer")}><b>Refer a team member</b></button>
              <button type="button" className="row" onClick={() => setMode("invite")}><b>Invite someone new</b></button>
              <button type="button" className="row hard" onClick={() => setMode("cancel")}><b>Cancel the shift</b></button>
              <button type="button" className="quiet" onClick={() => setMode(null)}>Back</button>
            </div>)}
          {mode === "refer" && (
            <div className="cm">
              {people.length === 0 && <p className="mute">No one in your network yet.</p>}
              {people.map(p => <button key={p.id} type="button" className="row" onClick={() => { dispatch({ type: "SHIFT_REFER", id: e.id, personId: p.id }); dispatch({ type: "TOAST", toast: `${firstName(p.name)} has been asked to take your shift` }); setMode(null); }}><Portrait src={p.photo} name={p.name} size={28} /><span><b>{p.name}</b><br /><small>{p.profession}</small></span></button>)}
              <button type="button" className="quiet" onClick={() => setMode("menu")}>Back</button>
            </div>)}
          {mode === "invite" && (
            <div className="cm">
              <input aria-label="Their name" value={nm} onChange={(x) => setNm(x.target.value)} placeholder="Their name" />
              <input aria-label="Their mobile number" value={ph} onChange={(x) => setPh(x.target.value)} placeholder="Mobile number" inputMode="tel" />
              <div className="btns" style={{ gridTemplateColumns: "1fr" }}><button type="button" className="yes" disabled={!nm.trim() || !ph.trim()} onClick={() => { dispatch({ type: "SHIFT_REFER", id: e.id, name: nm.trim(), phone: ph.trim() }); dispatch({ type: "TOAST", toast: `${nm.trim()} has been invited to take your shift` }); setMode(null); }}>Send invitation</button></div>
              <button type="button" className="quiet" onClick={() => setMode("menu")}>Back</button>
            </div>)}
          {mode === "cancel" && (
            <div className="cm">
              <p className="mute">Cancelling returns this shift to Autofill and affects your reputation. Referring someone keeps it.</p>
              <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <button type="button" className="no" onClick={() => { dispatch({ type: "SHIFT_HARD_CANCEL", id: e.id }); dispatch({ type: "TOAST", toast: "Shift cancelled. The host has been told" }); setMode(null); onDone && onDone(); }}>Cancel shift</button>
                <button type="button" onClick={() => setMode(null)}>Keep it</button>
              </div>
            </div>)}
        </>)}
        {act && e.state === "unavailable" && <p className="mute">You said no.</p>}
        {act && e.state === "withdrawn" && <p className="mute">You withdrew.</p>}
        {act && e.state === "expired" && <p className="mute">This request has ended.</p>}
        {act && e.state === "not_selected" && <p className="mute">{e.filled ? "This shift has been filled." : "You weren't chosen for this one."}</p>}
        {act && e.state === "cancelled_pro" && <p className="mute">{e.handedOver ? "Handed over. Your reputation is kept." : "You cancelled this shift."}</p>}
        {act && ["completed", "signed_off", "paid"].includes(e.state) && <p className="mute">Worked.</p>}
      </div>
    )}
    {brief && <EventBrief11 ev={event} shift={shift} e={e} onClose={() => setBrief(false)} />}
  </div>);
}



/* Who the shift is for: a Company Card for a business, a VIP Host Card for a person. */
function hirerCard11(state, ev) {
  const nm = (ev && ev.hirer) || "";
  if (/vooshka/i.test(nm)) return { party: false, c: vooshkaEditable17() };
  const co = companyList(state).find(x => x.name === nm);
  if (co) { const { id, mine, tier, ...rest } = co; return { party: false, c: rest }; }
  const mineCo = state.company || {};
  if (nm && mineCo.name === nm) return { party: state.site === "party", c: mineCo };
  if (!nm || nm === "The host" || (ev && ev.hirerKind === "host") || /private|party|wedding/i.test((ev && ev.kind) || ""))
    return { party: true, c: { ...DEMO_HOST17, name: nm && nm !== "The host" ? nm : DEMO_HOST17.name, photo: (window.FF_IMG || {}).face_you || "" } };
  return { party: false, c: { name: nm, kind: (ev && ev.kind) || "", slug: slugify(nm) } };
}



/* The Event brief, as a team member sees it. The hirer's Company Card or VIP Host Card sits underneath. */
function EventBrief11({ ev, shift, e, onClose }) {
  const { state } = useStore();
  if (!ev || !shift) return null;
  const h = hirerCard11(state, ev);
  return (
    <Sheet open onClose={onClose} title="Event brief">
      <div className="ff-brief11">
        <EventGuide ev={ev} shifts={[shift]} viewer="pro" stamp={e.state === "confirmed" ? "Confirmed" : "Brief"} />
        <section className="hc" aria-label={h.party ? "VIP Host Card" : "Company Card"}>
          <h4>{h.party ? "Your host" : "Your client"}</h4>
          <HScroll label={h.party ? "VIP Host Card" : "Company Card"}>
            <div className="hc-i">{h.party ? <PartyCard11 demo={h.c} /> : <CompanyCardFace c={h.c} />}</div>
          </HScroll>
        </section>
        <section className="tc" aria-label="Terms and conditions">
          <h4>Terms and conditions</h4>
          <ol>{termsOf(h.c).map((t) => <li key={t.k}><b>{t.label}</b><span>{t.text}</span></li>)}</ol>
        </section>
      </div>
    </Sheet>
  );
}



/* Referral, hard cancel and handover. Returns the new state, or null for any other action. */
function ship11Reduce(s, a) {
  const now = now17(s);
  if (a.type === "TEAM11_TOGGLE") { const t = s.myTeam11 || []; return { ...s, myTeam11: t.includes(a.id) ? t.filter(x => x !== a.id) : [...t, a.id] }; }
  if (a.type === "SHIFT_HARD_CANCEL") {
    const e = s.engagements.find(x => x.id === a.id); if (!e || e.state !== "confirmed") return null;
    const n = auto17Reduce(s, { type: "PRO_CANCEL", id: a.id });
    return { ...n, rep11: [...(n.rep11 || []), { at: now, kind: "hard_cancel", shiftId: e.shiftId, staffId: e.staffId }] };
  }
  if (a.type === "SHIFT_REFER") {
    const e = s.engagements.find(x => x.id === a.id); if (!e || e.state !== "confirmed" || e.handover) return null;
    const sh = s.shifts.find(x => x.id === e.shiftId); if (!sh) return null;
    const nid = uid("eng"), who = a.personId || uid("inv");
    const t = { id: nid, shiftId: e.shiftId, staffId: who, invitedName: a.name || "", invitedPhone: a.phone || "", state: "requested", exclusive: true, referredBy: e.staffId, thread: [], sentAt: now, expiresAt: now + 48 * 36e5, history: [{ state: "requested", at: now }] };
    let n = { ...s, engagements: [...s.engagements.map(x => x.id === e.id ? { ...x, handover: { to: nid, name: a.name || "", at: now } } : x), t] };
    n = note17(n, { to: "pro", staffId: who, eventId: sh.eventId, shiftId: sh.id, text: `You've been asked to take over ${sh.role} on ${whenOf11(sh)}. Tap Yes to confirm it.` });
    n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `${sh.role}: your professional has offered the shift to someone else. They stay booked until the new person confirms.` });
    return audit17(n, "Professional", `Handover offered for ${ref17(e)} (${sh.role})`);
  }
  if (a.type === "SHIFT_REFER_ACCEPT") {
    const t = s.engagements.find(x => x.id === a.id); const m = t && s.engagements.find(x => x.handover && x.handover.to === t.id); if (!m) return null;
    const sh = s.shifts.find(x => x.id === t.shiftId);
    let n = { ...s, engagements: s.engagements.map(x => x.id === m.id ? mark17(x, "cancelled_pro", now, { handedOver: true, repKept: true, handover: { ...x.handover, done: true } }) : x), shifts: s.shifts.map(x => x.id === sh.id ? { ...x, staffIds: staffOf(x).filter(p => p !== m.staffId), staffId: staffOf(x).filter(p => p !== m.staffId)[0] || "" } : x) };
    n = confirm17(n, { ...t });
    n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `${sh.role}: the new person has confirmed. Your booking is unchanged.` });
    return { ...n, rep11: [...(n.rep11 || []), { at: now, kind: "handover", shiftId: sh.id, staffId: m.staffId }] };
  }
  return null;
}



/* The host's view of someone who said they're available: a card, with Choose. */
function AvailCard11({ e, who, disabledWhy, onChoose, onProfile }) {
  const { state } = useStore();
  const n = reviewRecordsFor(state, who.id || "").length;
  return (
    <div className="ff-av11">
      <Portrait src={who.photo} name={who.name} size={56} tier={who.tier} />
      <b>{who.name}</b>
      <small>{who.profession || "Professional"}</small>
      <small>{n} review{n === 1 ? "" : "s"}</small>
      <button type="button" className="pick" disabled={!!disabledWhy} title={disabledWhy || ""} onClick={onChoose}>Choose {firstName(who.name)}</button>
      <button type="button" className="prof" onClick={onProfile}>View profile</button>
    </div>
  );
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



/* FF VIP: the same Next steps list. Steps that need the VIP card or booking show a lock until FF VIP opens. */
function VipSteps21({ onClose }) {
  const { state, dispatch } = useStore();
  const v = state.vip21 || {};
  const cardDone = vipCardDone21(v), joined = !!v.guest, booked = (v.bookings || []).length > 0;
  const go = (tab) => {
    onClose();
    if (state.role !== "vip") dispatch({ type: "ROLE", role: "vip" });
    dispatch({ type: "TAB", tab });
    window.scrollTo(0, 0);
  };
  const steps = [
    { id: "card", label: "Create your VIP card", hint: "Your drinks, what you eat and where you like to sit", done: cardDone, lock: true, onClick: () => go("profile") },
    { id: "guest", label: "Join the guest list", hint: "Your card is your invitation to the launch party", done: joined, lock: true, onClick: () => go("profile") },
    { id: "exp", label: "Explore experiences", hint: "Venues, spa days and private tables, chosen for you", done: false, lock: false, onClick: () => go("network") },
    { id: "book", label: "Book a VIP table", hint: "Send your card to the venue with your drinks ready", done: booked, lock: true, onClick: () => go("bookings") },
  ];
  return (
    <div className="ff-xpsec">
      {steps.map(t => (
        <button key={t.id} type="button" className={`ff-task${t.done ? " done" : ""}`} onClick={t.onClick} aria-label={t.label + (VIP_LOCKED21 && t.lock && !t.done ? ". " + VIP_LOCK_LABEL21 : "")}>
          <span className="dot">{t.done && <Check size={13} strokeWidth={2.6} />}</span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="ff-serif" style={{ fontSize: 15.5, display: "block", color: "#1D1B18", lineHeight: 1.2 }}>{t.label}</span>
            <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{t.hint}</span>
          </span>
          {t.done ? <Pill tone="ok">Done</Pill> : (VIP_LOCKED21 && t.lock ? <Lock size={15} color="var(--gold-dk)" style={{ flex: "none" }} aria-hidden="true" /> : <ChevronRight size={16} color="var(--gold-dk)" style={{ flex: "none" }} />)}
        </button>
      ))}
    </div>
  );
}

function notifySite17(state) {
  if (state.role === "vip") return "vip";
  if (state.role === "staff") return state.site === "party" ? "party" : "staff";
  return "team";
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


/* Team invitations sent TO you (sample: one person, one company). Core supplies these in production. */
const TEAM_ASKS_DEMO17 = [
  { id: "tia_ava", fromId: "stf_ava", name: "Ava Clarke", tag: "AVA03", note: "Worked with you before · would work with you again", at: Date.UTC(2026, 10, 8) },
  { id: "tia_vooshka", fromId: "co_vooshka", name: "Vooshka Cocktail Bar", company: true, note: "Wants you on their company team", at: Date.UTC(2026, 10, 9) },
];


function teamAsksWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const done = state.teamAsks17 || {};
  return TEAM_ASKS_DEMO17.filter(x => !done[x.id] && !(state.connections || []).some(c => c.id === x.fromId) && !(x.company && (state.netAdds17 || []).includes(x.fromId)));
}


/* Questions people asked on your profile that you haven't answered (FF Team). */
function questionsWaiting17(state, people) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  return askedOfMe(state, people).filter(q => !isAnswered(answerOf(state, q)));
}


/* Booker side (FF Staff, FF Party): a question someone asked on a Shift Card you sent, not yet answered. */
function shiftQuestionsWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "staff")) return [];
  return (state.engagements || []).filter(e => e.staffId !== "me" && ["requested", "discuss", "available", "confirmed"].includes(e.state)
    && (e.thread || []).length > 0 && e.thread[e.thread.length - 1].from === "pro" && state.shifts.some(x => x.id === e.shiftId));
}


/* Booker side (v17.4.6.1): replies to the invitations you sent, read from the same engagement records that drive the
   Event Card. One update per invitation and state, so retries and reloads never duplicate. Scoped to the site the
   booking was made on. "available" is an action (choose them) until it lapses; the others are updates. */
function bookingUpdates17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "staff")) return [];
  const site = state.site === "party" ? "party" : "staff", now = now17(state), out = [];
  (state.engagements || []).forEach(e => {
    if (e.staffId === "me") return;
    const sh = state.shifts.find(x => x.id === e.shiftId), ev = sh && state.events.find(x => x.id === sh.eventId);
    if (!sh || !ev || isPast(ev.iso) || eventSource17(state, ev) !== site) return;
    const h = e.history || [], last = h[h.length - 1] || {}, prev = h[h.length - 2] || {};
    let kind = null;
    if (e.state === "confirmed") kind = "confirmed";
    else if (e.state === "unavailable") kind = "unavailable";
    else if (e.state === "available" && e.selectBy > now) kind = "available";
    else if (e.state === "expired" && !e.filled && !e.closed && !e.cancelled && ["requested", "discuss"].includes(prev.state)) kind = "noreply";
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
const notifyCount17 = (state) => state.role === "vip" ? 0 : state.role === "team"
  ? pending11(state).length + availWaiting17(state).length + teamAsksWaiting17(state).length + coInvites17(state).length + questionsWaiting17(state, state.directory || []).length
  : shiftQuestionsWaiting17(state).length + coRequests17(state).length + bookingUpdates17(state).filter(u => u.action || u.at > (state.notesSeenAt || 0)).length;


function TeamAskNote17({ x, onAccepted }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const person = x.company ? null : all.find(p => p.id === x.fromId);
  const co = x.company ? companyById(state, x.fromId) : null;
  const first = x.company ? x.name : firstName(x.name);
  const reply = (accept) => { dispatch({ type: "TEAM_ASK_REPLY", ask: x, accept }); dispatch({ type: "TOAST", toast: accept ? `You and ${first} are on each other's team` : "Invitation declined" }); if (accept && person && onAccepted) onAccepted(person); };
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
function QuestionNote17({ q, label, asker }) {
  const { state, dispatch } = useStore();
  const save = (v) => { dispatch({ type: "ANSWER", qid: q.id, value: v }); dispatch({ type: "TOAST", toast: "Answer saved" }); };
  return (
    <div className="ff-ndcard17">
      <div className="face"><QuestionCard q={q} answer={answerOf(state, q)} label={label} asker={asker} pending=" " /></div>
      <QuickAnswer17 onSave={save} />
    </div>
  );
}


function ShiftQuestionNote17({ e }) {
  const { state, dispatch } = useStore();
  const [txt, setTxt] = useState("");
  const sh = state.shifts.find(x => x.id === e.shiftId), ev = sh && state.events.find(x => x.id === sh.eventId);
  const send = () => { if (!txt.trim()) return; dispatch({ type: "AF_REPLY", id: e.id, text: txt.trim() }); dispatch({ type: "TOAST", toast: "Reply sent" }); };
  return (
    <div className="ff-ndcard17">
      <ShiftDelivery11 e={e} shift={sh} event={ev} viewer="hirer" />
      <div className="reply"><textarea aria-label="Your reply" rows={2} value={txt} onChange={(x) => setTxt(x.target.value.slice(0, 300))} placeholder="Your reply" />
        <button type="button" className="yes" disabled={!txt.trim()} onClick={send}>Send reply</button></div>
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
  const lastQ = (e) => e.thread[e.thread.length - 1].text;
  const rows = state.role === "vip" ? [] : state.role === "team" ? [
    ...pending11(state).map(e => {
      const sh = state.shifts.find(x => x.id === e.shiftId), ev = sh && state.events.find(x => x.id === sh.eventId);
      return sh ? { id: e.id, icon: <I11.Briefcase size={18} />, title: `${e.auto ? "Open shift" : "You've been selected"} · ${sh.role}`, sub: `${hirerOf11(state, ev)} · ${whenOf11(sh)}`, body: <ShiftDelivery11 e={e} shift={sh} event={ev} /> } : null;
    }).filter(Boolean),
    ...availWaiting17(state).map(x => ({ id: x.id, icon: <I11.CalendarCheck size={18} />, title: "Are you available?", sub: `${x.byName} · ${shortDay(x.iso)}`, body: <QuestionNote17 q={availQ(x.iso)} label="Availability" asker={`Asked by ${x.byName}`} /> })),
    ...teamAsksWaiting17(state).map(x => ({ id: x.id, icon: <I11.Users size={18} />, title: "Team invitation", sub: x.name, body: <TeamAskNote17 x={x} onAccepted={setReview} /> })),
    ...coInvites17(state).map(x => ({ id: x.id, icon: <I11.Users size={18} />, title: "Company team invitation", sub: x.companyName, body: <CoTeamNote17 x={x} /> })),
    ...questionsWaiting17(state, people).map(q => ({ id: q.id, icon: <I11.MessageSquare size={18} />, title: "Question for you", sub: `${askerName(q, people)} · ${q.text}`, body: <QuestionNote17 q={q} asker={`Asked by ${askerName(q, people)}`} /> })),
  ] : [
    ...coRequests17(state).map(x => ({ id: x.id, icon: <I11.UserPlus size={18} />, title: "Asks to join your team", sub: x.name || (findPerson(people, state, x.personId) || {}).name || "", body: <CoTeamNote17 x={x} /> })),
    ...shiftQuestionsWaiting17(state).map(e => {
      const sh = state.shifts.find(x => x.id === e.shiftId), who = findPerson(people, state, e.staffId) || {};
      return { id: e.id, icon: <I11.MessageSquare size={18} />, title: `Question from ${firstName(who.name || "") || "your team"}`, sub: `${sh.role} · ${lastQ(e)}`, body: <ShiftQuestionNote17 e={e} /> };
    }),
    ...bookingUpdates17(state).filter(u => u.action || u.at > since.current).map(u => {
      const who = findPerson(people, state, u.e.staffId) || {}, fn = firstName(who.name || "") || "Someone";
      const title = { confirmed: `${fn} confirmed`, unavailable: `${fn} is unavailable`, available: `${fn} is available`, noreply: "No reply before the deadline" }[u.kind];
      const icon = { confirmed: <I11.Check size={18} />, unavailable: <I11.X size={18} />, available: <I11.CalendarCheck size={18} />, noreply: <I11.Clock size={18} /> }[u.kind];
      return { id: u.id, icon, title, sub: `${u.sh.role} · ${eventTitle(u.ev)} · ${whenOf11(u.sh)}`, body: <BookingUpdateNote17 u={u} who={who} onGo={onClose} /> };
    }),
  ];
  return (
    <Sheet open onClose={onClose} title="Notifications">
      <div className="ff-ntf17">
        {rows.length === 0 ? (state.auth.status !== "signedIn"
          ? <p className="none">Sign in to view your notifications.</p>
          : <p className="none">You are all caught up.</p>) : (
          <ul className="ff-ndlist17">{rows.map(r => (
            <NoteDrop17 key={r.id} id={r.id} open={at === r.id} onToggle={() => setAt(at === r.id ? null : r.id)} icon={r.icon} title={r.title} sub={r.sub}>{r.body}</NoteDrop17>))}</ul>)}
        {!isPartySite17(state) && <section className="ff-ntf-next17" aria-labelledby="ff-ntf-next-h">
          <h3 id="ff-ntf-next-h">Next steps</h3>
          {{ team: <TeamSteps11 onClose={onClose} />, vip: <VipSteps21 onClose={onClose} /> }[notifySite17(state)] || <StaffGuideSheet open bare onClose={onClose} />}
        </section>}
      </div>
      <ReviewSheet open={!!review} person={review} onClose={() => setReview(null)} />
    </Sheet>
  );
}



/* ======================================================================================================
   v17.3.33 — Bookings (FF Team), FF events (FF Staff), personal terms (FF Team profile)
   ====================================================================================================== */
const E17I = { GraduationCap: lucideIcon("GraduationCap"), Plane: lucideIcon("Plane"), Gift: lucideIcon("Gift"), Layers: lucideIcon("Layers"), ChevronLeft: lucideIcon("ChevronLeft"), ChevronRight: lucideIcon("ChevronRight") };



/* A dropdown box. Collapsed by default. It opens itself when the page is sent to it, or to anything inside it. */
function Drop17({ id, title, icon, kids = [], children }) {
  const [open, setOpen] = useState(false);
  const key = kids.join("|");
  useEffect(() => {
    const h = (e) => { const d = e.detail; if (d === id || kids.includes(d)) setOpen(true); };
    window.addEventListener("ff-opendrop", h);
    return () => window.removeEventListener("ff-opendrop", h);
  }, [id, key]);
  return <StaffBox id={id} icon={icon} title={title} open={open} onToggle={() => setOpen(o => !o)}>{children}</StaffBox>;
}



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



/* This month and next: everyone starts as available; untick the days you can't work. */
function AvailMonths17() {
  const { state, dispatch } = useStore();
  const signedIn = state.auth.status === "signedIn";
  const off = state.profile.unavail17 || [];
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const flip = (k) => {
    if (!signedIn) { dispatch({ type: "TOAST", toast: "Create your Profile Card first" }); return; }
    dispatch({ type: "PROFILE", patch: { unavail17: off.includes(k) ? off.filter(x => x !== k) : [...off, k] } });
  };
  return (
    <div className="ff-av17">
      {[0, 1].map(i => {
        const d0 = new Date(now.getFullYear(), now.getMonth() + i, 1);
        const y = d0.getFullYear(), m = d0.getMonth(), n = new Date(y, m + 1, 0).getDate(), lead = (d0.getDay() + 6) % 7;
        return (
          <div className="mo" key={i}>
            <h3>{MONTHS[m]} {y}</h3>
            <div className="wk" aria-hidden="true">{["M", "T", "W", "T", "F", "S", "S"].map((w, j) => <span key={j}>{w}</span>)}</div>
            <div className="dy">
              {Array.from({ length: lead }, (_, j) => <span key={"b" + j} />)}
              {Array.from({ length: n }, (_, j) => {
                const k = `${y}-${pad(m + 1)}-${pad(j + 1)}`, past = k < today, no = off.includes(k);
                return <button key={k} type="button" disabled={past} aria-pressed={!no && !past} aria-label={`${j + 1} ${MONTHS[m]}: ${no ? "not available" : "available"}`}
                  className={past ? "past" : no ? "no" : "yes"} onClick={() => flip(k)}>{j + 1}</button>;
              })}
            </div>
          </div>
        );
      })}
      <p className="nt">Availability is about priority. Mark a day as available and we put your profile first for it. You are always asked before any shift, and we never assume you can work.</p>
    </div>
  );
}



/* The training, dream jobs and FF rewards a team member can register for. All dropdowns. */
function TeamExtras17() {
  return null;
}



/* FF Staff: train and reward the people who work for you. */
function BizInterest17({ kind }) {
  const { state, dispatch } = useStore();
  const I = swipeImgs();
  const list = kind === "train" ? TRAINING_COURSES : XP_REWARDS, imgs = kind === "train" ? I.training : I.rewards;
  /* v17.4.6: saved as a Q&A answer for the company account (was UI state only). */
  const qid = kind === "train" ? "int.biz_training" : "int.biz_rewards";
  const account = (state.company && state.company.slug) || qaAccount17(state);
  const savedAns = account ? qaAnswer17(state, account, qid) : null;
  const [picked, setPicked] = useState(() => (savedAns ? savedAns.optionIds : []));
  const [sent, setSent] = useState(!!savedAns);
  const [busy, setBusy] = useState(false);
  const toggle = (id) => { setSent(false); setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };
  const send = async () => {
    if (!picked.length || busy) return;
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    setBusy(true);
    const r = await qaSubmit17(dispatch, { questionId: qid, account, optionIds: picked, visibility: "private", source: kind === "train" ? "FF Staff · Train your staff" : "FF Staff · Reward your staff" });
    setBusy(false);
    if (!r.ok) { dispatch({ type: "TOAST", toast: "That couldn't be saved. Try again." }); return; }
    setSent(true); dispatch({ type: "TOAST", toast: "Interest registered. We'll tell you when a date is available." });
  };
  return (
    <div className="ff-bi17">
      <div className="ff-courses ff-courses-img">
        {list.map(x => <FlipChoice17 key={x.id} kind={x.kind} title={x.title} note={x.note} img={imgs[x.id]} on={picked.includes(x.id)} onClick={() => toggle(x.id)} />)}
      </div>
      <div className="acts">
        <Btn variant="primary" onClick={send}>{sent ? <><S17I.Check size={14} /> Interest registered</> : "Register interest"}</Btn>
        {picked.length > 0 && <span>{picked.length} selected</span>}
      </div>
    </div>
  );
}


function FFEvents17() {
  return null;
}
