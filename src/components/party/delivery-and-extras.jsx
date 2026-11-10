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


const hirerOf11 = (state, ev) => (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "The host";


const whenOf11 = (sh) => `${shortDay(sh.iso) || sh.date || ""}${sh.time ? ` · ${sh.time}` : ""}`;


/* The WhatsApp message that goes with a Shift card. Selected and Autofill read differently; the card is the same. */
const waMsg11 = (state, e, sh, ev) => {
  const h = hirerOf11(state, ev), when = whenOf11(sh), place = sh.venue || (ev && ev.venue) || "";
  return e.auto
    ? `${h} needs a ${sh.role} on ${when}${place ? ` at ${place}` : ""}.\nYou're one of ${e.batchSize || 10} people invited. If you're free, tap Yes and ${h} will choose from everyone available.`
    : `${h} has chosen you as ${sh.role} on ${when}${place ? ` at ${place}` : ""}.\nThe shift is held for you until ${dt17(e.expiresAt)}. Tap Yes to confirm it.`;
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
  const yes = () => { go(e.auto ? "available" : "accept"); dispatch({ type: "TOAST", toast: e.auto ? "Marked available. The host will choose" : "Confirmed. It's in your bookings" }); onDone && onDone(); };
  const no = () => { go("unavailable"); dispatch({ type: "TOAST", toast: "Declined. The host has been told" }); onDone && onDone(); };
  const send = () => { if (!txt.trim()) return; go("discuss", txt.trim()); setTxt(""); setAsk(false); };
  const people = (state.connections || []).map(c => findPerson(all, state, c.id)).filter(p => p && !p.isCompany && p.id !== "me").slice(0, 8);
  const handTo = e.handover && ((findPerson(all, state, (state.engagements.find(x => x.id === e.handover.to) || {}).staffId) || {}).name || e.handover.name);
  const handEng = e.handover && state.engagements.find(x => x.id === e.handover.to);
  const kind = e.auto ? "auto" : "sel";
  const hv = viewer === "hirer", act = !hv;
  const who = findPerson(all, state, e.staffId) || {};
  const fn = firstName(who.name || "");
  const tag = e.auto ? "Open shift" : hv ? (e.staffId ? `Selected${fn ? ` · ${fn}` : ""}` : "Shift card") : `${fn ? `${fn}, you've` : "You've"} been selected`;
  const hn = hirer === "The host" ? "the host" : hirer;
  const intro = e.auto
    ? `${hirer} needs a ${shift.role}. You're one of ${e.batchSize || 10} people invited. If you're free, say yes and ${hn} will choose.`
    : `${hirer} has chosen you for this shift. It is held for you until ${dt17(e.expiresAt)}.`;
  const rows = (
    <div className="ff-evc-rows">
      <EvRow icon={I11.CalendarDays} k="When">{whenOf11(shift)}</EvRow>
      <EvRow icon={I11.MapPin} k="Where">{shift.venue || (event && event.venue) || "To be confirmed"}</EvRow>
      <EvRow icon={I11.Banknote} k="Pay">{shift.pay || (shift.total ? `£${shift.total}` : "Agreed with the host")}</EvRow>
      <EvRow icon={I11.Shirt} k="Dress">{shift.dress || "To be confirmed"}</EvRow>
      <EvRow icon={I11.Briefcase} k="Hired by">{hirer}</EvRow>
    </div>
  );
  const askBox = ask && <div className="ask"><input aria-label="Your question" value={txt} onChange={(x) => setTxt(x.target.value.slice(0, 200))} placeholder="Your question" /><div className="btns" style={{ gridTemplateColumns: "1fr" }}><button type="button" className="yes" disabled={!txt.trim()} onClick={send}>Send question</button></div></div>;
  const thread = (e.thread || []).length > 0 && <div className="thread">{e.thread.map((m, i) => <p key={i}>{m.from === "pro" ? "You: " : `${hirer}: `}{m.text}</p>)}</div>;
  return (<>
    <article className={`ff-evc ff-sd11 ${kind}${mini ? " mini" : ""}`} aria-label={`Shift card: ${shift.role}`}>
      <span className="ff-evc-plate">Shift Card</span>
      <span className="ff-evc-coin"><Coin size={30} tier="gold" /></span>
      <span className="stag">{tag}</span>
      <h3 className="ff-evc-name">{shift.role}</h3>
      <p className="sev">{event ? eventTitle(event) : ""}</p>
      <div className="ff-evc-rule" aria-hidden="true"><i /><span>◆</span><i /></div>
      {mini ? <p className="sev" style={{ marginTop: 8 }}>{whenOf11(shift)}</p> : rows}
      <div className="sbd">
        {act && pend && <p className="nt">{intro}</p>}
        {!mini && shift.notes ? <p className="nt">{shift.notes}</p> : null}
        {!mini && <p className="by">{tcsLine(state, shift)}</p>}
        {thread}
        {hv && <p className="ok">{engText(e) || "Not sent yet"}{conf ? ` · Ref ${e.ref || ref17(e)}` : ""}</p>}
        {act && pend && !ended && (<>
          <div className="btns" role="group" aria-label="Your reply" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <button type="button" className="yes" onClick={yes}>Yes</button>
            <button type="button" className="no" onClick={no}>No</button>
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
    </article>
    {brief && <EventBrief11 ev={event} shift={shift} e={e} onClose={() => setBrief(false)} />}
  </>);
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
  const waiting = pending11(state).length;
  const go = (tab, focus) => {
    onClose();
    if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab, route: "home" });
    if (focus) dispatch({ type: "FOCUS", focus: { target: focus } }); else window.scrollTo(0, 0);
  };
  const steps = [
    ...(waiting ? [{ id: "shifts", label: `Reply to ${waiting} shift ${waiting === 1 ? "card" : "cards"}`, hint: "Yes, No or More information", done: false, onClick: () => go("bookings") }] : []),
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



function NotifySheet17({ open, onClose }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [tab, setTab] = useState("n");
  useEffect(() => { if (open) dispatch({ type: "NOTES_SEEN" }); }, [open]);
  if (!open) return null;
  const notes = bookingNotes(state, all);
  const reqs11 = pending11(state);
  const items = [];
  (state.events || []).forEach(ev => {
    const open_ = (state.shifts || []).filter(x => x.eventId === ev.id && !(x.staffIds && x.staffIds.length) && !x.staffId && x.route !== "auto").length;
    if (open_ > 0) items.push({ id: "ev" + ev.id, t: `${eventTitle(ev)}: ${open_} ${open_ === 1 ? "place" : "places"} still to fill`, sub: "Choose your team", go: () => { dispatch({ type: "ACTIVE_EVENT", id: ev.id }); dispatch({ type: "V11_SET", patch: { bkView: { eventId: ev.id } } }); dispatch({ type: "TAB", tab: "bookings" }); } });
  });
  (state.teamInvites || []).filter(i => i.status === "pending").forEach(i => items.push({ id: "in" + i.id, t: "A team invite is waiting for you", sub: "Open your bookings", go: () => dispatch({ type: "TAB", tab: "bookings" }) }));
  const unread = notes.filter(n => n.at > (state.notesSeenAt || 0)).length;
  return (
    <Sheet open onClose={onClose} title={tab === "n" ? "Notifications" : "Next steps"}>
      <div className="ff-ntf17">
        <div className="seg" role="tablist" aria-label="Notifications and next steps">
          <button type="button" role="tab" aria-selected={tab === "n"} className={tab === "n" ? "on" : ""} onClick={() => setTab("n")}>Notifications{notes.length + items.length + reqs11.length > 0 && <em>{notes.length + items.length + reqs11.length}</em>}</button>
          <button type="button" role="tab" aria-selected={tab === "s"} className={tab === "s" ? "on" : ""} onClick={() => setTab("s")}>Next steps</button>
        </div>
        {tab === "n" ? (<>
          {reqs11.length > 0 && <div className="ff-sdrail11"><HScroll label="Shift cards">{reqs11.map(e => { const sh = state.shifts.find(x => x.id === e.shiftId); return <ShiftDelivery11 key={e.id} mini e={e} shift={sh} event={sh && state.events.find(x => x.id === sh.eventId)} onDone={onClose} />; })}</HScroll></div>}
          {items.length === 0 && notes.length === 0 && reqs11.length === 0 ? <p className="none">You are all caught up.</p> : (<>
            {items.length > 0 && <ul>{items.map(i => (
              <li key={i.id}><button type="button" onClick={() => { onClose(); i.go(); window.scrollTo(0, 0); }}><b>{i.t}</b><small>{i.sub}</small><S17I.ArrowRight size={16} /></button></li>))}</ul>}
            {notes.length > 0 && <ul className="ff-notes11">{notes.map(n => (
              <li key={n.id}><i className={`dot ${n.tone || ""}`} /><span><b>{n.text}</b>{n.ev ? <small>{eventTitle(n.ev)} · {shortDay(n.ev.iso)}</small> : null}</span>
                <time>{n.at ? new Date(n.at).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : ""}</time></li>))}</ul>}
          </>)}
        </>) : state.role === "team" ? <TeamSteps11 onClose={onClose} /> : <StaffGuideSheet open bare onClose={onClose} />}
      </div>
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
const PAY17 = { svc_bartending: 100, svc_mixology: 150, svc_masterclass: 200, svc_flair: 200, svc_staffing: 50 };


const TIME17 = { svc_bartending: "3 hours", svc_mixology: "From 4 hours", svc_masterclass: "From 2 hours", svc_flair: "From 2 hours", svc_staffing: "From 1 hour" };



function PkgTile17({ sv, on, onClick }) {
  const pay = PAY17[sv.id];
  return (
    <button type="button" className={`ff-tp17 ${sv.tone}${on ? " on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span className="lv">{sv.level}</span>
      <b className="tt">{sv.title}</b>
      <span className="in">{sv.includes}</span>
      <span className="tm"><S17I.Clock size={12} /> {TIME17[sv.id] || sv.time}</span>
      <span className="pay">{pay != null && <><small>You earn</small><strong>£{pay}+</strong></>}</span>
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
  const { dispatch } = useStore();
  const I = swipeImgs();
  const list = kind === "train" ? TRAINING_COURSES : XP_REWARDS, imgs = kind === "train" ? I.training : I.rewards;
  const [picked, setPicked] = useState([]);
  const [sent, setSent] = useState(false);
  const toggle = (id) => { setSent(false); setPicked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]); };
  const send = () => { if (!picked.length) return; setSent(true); dispatch({ type: "TOAST", toast: "Interest registered. We'll tell you when a date is available." }); };
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
