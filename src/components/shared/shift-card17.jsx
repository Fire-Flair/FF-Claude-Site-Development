/* src/components/shared/shift-card17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   SHIFT CARD (v17.5.5) — the one Shift Card, and the shift brief page at /fx/<code>.

   ShiftCard17({ shift, event, source, status, company })
     5 x 7, drawn in container units so it is the same at any width and at 1080 x 1512.
     Top row: site plate (FF Staff | FF Party), status plate (Open shift | Chosen for you | Confirmed), FF logo.
     Headline: the event name. Rows: Role, When, Time, Where, Pay, and Company on FF Staff shifts.
     Footer: logo and the site address on the left (WhatsApp prints the time over the bottom right of an image).
     Not on the face: dress code, notes, operational details. They live in the brief.
   Pay comes only from payLine17(shift) (utils/pay17.js).

   Shift codes (the address of the brief): five characters from an alphabet without lookalikes (no 0, 1, I, L, O),
   not case sensitive. The first four identify the event, the fifth the shift within it: 7K2Q is the event,
   7K2QA and 7K2QB its shifts. The prototype derives stable codes from the demo ids (fxCodeOf17); production issues
   them from Core and keeps them unique.
   ========================================================================== */
const SC17_CSS = __ff_css("styles/shift17.css");


if (typeof document !== "undefined" && !document.getElementById("ff-sc17-css")) {
  const st17 = document.createElement("style");
  st17.id = "ff-sc17-css";
  st17.textContent = SC17_CSS;
  document.head.appendChild(st17);
}


const SC17_ADDR = "ffteam.uk";
const SC17_STATUS = { open: "Open shift", chosen: "Chosen for you", confirmed: "Confirmed" };
const SC17I = { Martini: lucideIcon("Martini"), CalendarDays: lucideIcon("CalendarDays"), Clock: lucideIcon("Clock"), MapPin: lucideIcon("MapPin"), Banknote: lucideIcon("Banknote"), Briefcase: lucideIcon("Briefcase"), CalendarPlus: lucideIcon("CalendarPlus") };


/* ---- Codes ---------------------------------------------------------------------------------------------- */
const FX17_ALPHA = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";       /* 31 characters: no 0, 1, I, L, O */
const FX17_SHIFT_CHARS = FX17_ALPHA.slice(8) + FX17_ALPHA.slice(0, 8);   /* A, B, C ... then 2 - 9 */


function fx17Hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h >>> 0;
}


const fx17Four = (n) => { let s = ""; for (let i = 0; i < 4; i++) { s += FX17_ALPHA[n % 31]; n = Math.floor(n / 31); } return s; };


/* event id -> four-character event code, unique within the list (a clash steps to the next free code, in id order). */
function fxEventCodes17(state) {
  const ids = [...new Set((state.events || []).map(v => v.id))].sort();
  const taken = new Set(), out = {};
  ids.forEach(id => {
    let n = fx17Hash(id) % 923521, c = fx17Four(n);
    while (taken.has(c)) { n = (n + 1) % 923521; c = fx17Four(n); }
    taken.add(c); out[id] = c;
  });
  return out;
}


/* The five-character code of a shift, or "". */
function fxCodeOf17(state, shift) {
  if (!shift) return "";
  const ec = fxEventCodes17(state)[shift.eventId];
  if (!ec) return "";
  const i = (state.shifts || []).filter(x => x.eventId === shift.eventId).findIndex(x => x.id === shift.id);
  return i < 0 || i >= FX17_SHIFT_CHARS.length ? "" : ec + FX17_SHIFT_CHARS[i];
}


const fx17Clean = (c) => String(c || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
const fx17Valid = (c) => /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{5}$/.test(fx17Clean(c));


/* code -> { event, shift } or null. Four characters find the event only. */
function fxFind17(state, code) {
  const c = fx17Clean(code);
  if (c.length < 4) return null;
  const codes = fxEventCodes17(state);
  const evId = Object.keys(codes).find(id => codes[id] === c.slice(0, 4));
  const event = evId && (state.events || []).find(v => v.id === evId);
  if (!event) return null;
  const list = (state.shifts || []).filter(x => x.eventId === event.id);
  if (c.length === 4) return { event, shift: list[0] || null };
  const i = FX17_SHIFT_CHARS.indexOf(c[4]);
  return list[i] ? { event, shift: list[i] } : null;
}


const fx17Link = (code) => `https://${SC17_ADDR}/fx/${fx17Clean(code)}`;


/* ---- Wording -------------------------------------------------------------------------------------------- */
/* "19:00 — 23:00" -> "7pm to 11pm"; "18:30 — 00:00" -> "6:30pm to midnight" */
function timeText17(t) {
  const one = (x) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(x || "").trim());
    if (!m) return String(x || "").trim();
    const h = +m[1], mi = +m[2];
    if (h % 24 === 0 && mi === 0) return h === 0 || h === 24 ? "midnight" : "12am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}${mi ? ":" + String(mi).padStart(2, "0") : ""}${h >= 12 && h < 24 ? "pm" : "am"}`;
  };
  const [a, b] = splitTime(t || "");
  return a && b ? `${one(a)} to ${one(b)}` : one(a || b);
}


function statusOf17(e) {
  if (!e) return "open";
  if (["confirmed", "completed", "signed_off", "paid"].includes(e.state)) return "confirmed";
  return e.auto ? "open" : "chosen";
}


/* The hirer's company name for a FF Staff shift card, or "". */
function companyOf17(state, ev) {
  const n = (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "";
  return n && n !== "The host" ? n : "";
}


/* ---- The card ------------------------------------------------------------------------------------------- */
/* Shrinks text that does not fit its place (never splits a word). Sizes are in container units. */
function useFit17(ref, deps) {
  React.useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const fit = () => {
      root.querySelectorAll("[data-fit]").forEach(el => {
        const base = parseFloat(el.dataset.fit);
        const box = el.dataset.fitBox === "1";
        el.style.fontSize = base + "cqw";
        const over = () => box ? (el.scrollHeight > el.parentElement.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) : el.scrollWidth > el.clientWidth + 1;
        let k = 1, g = 0;
        while (over() && k > 0.4 && g++ < 80) { k -= 0.02; el.style.fontSize = (base * k).toFixed(3) + "cqw"; }
      });
    };
    fit();
    let ro = null;
    if (window.ResizeObserver) { let w = root.clientWidth; ro = new ResizeObserver(() => { const nw = root.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(root); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, deps);
}


function ShiftCard17({ shift, event, source, status, company }) {
  const { state } = useStore();
  const ref = useRef(null);
  const src = source || eventSource17(state, event);
  const st = status || "open";
  const pay = payLine17(shift);
  const when = (shift.iso && longDay(shift.iso)) || (event && event.iso && longDay(event.iso)) || shift.date || (event && event.date) || "To be confirmed";
  const where = shift.venue || (event && event.venue) || "To be confirmed";
  const title = (event && eventTitle(event)) || shift.role || "Shift";
  const co = src === "staff" ? (company != null ? company : companyOf17(state, event)) : "";
  const row = (cls, Icon, k, v, fit) => (
    <div className={"row" + (cls ? " " + cls : "")}>
      <span className="ic"><Icon strokeWidth={1.8} /></span>
      <span className="k">{k}</span>
      {v}
    </div>
  );
  const val = (text, size = 4.65) => <span className="v" data-fit={size}>{text}</span>;
  useFit17(ref, [title, shift.role, when, shift.time, where, pay.text, co, src, st]);
  return (
    <article ref={ref} className="ff-sc17" data-cx-fixed="1" aria-label={`${src === "party" ? "FF Party" : "FF Staff"} shift: ${title}, ${SC17_STATUS[st]}`}>
      <div className="card"><div className="face">
        <div className="in">
          <div className="top">
            <span className="plate site">{src === "party" ? "FF Party" : "FF Staff"}</span>
            <span className={"plate " + st}>{SC17_STATUS[st]}</span>
            <span className="logo"><FFLogo size="100%" tier="gold" /></span>
          </div>
          <div className="role"><div className="rin"><h1 data-fit="7.85" data-fit-box="1">{title}</h1></div></div>
          <div className="rows">
            {row("", SC17I.Martini, "Role", val(shift.role || "To be confirmed"))}
            {co ? row("", SC17I.Briefcase, "Company", val(co)) : null}
            {row("", SC17I.CalendarDays, "When", val(when))}
            {row("", SC17I.Clock, "Time", val(timeText17(shift.time) || "To be confirmed"))}
            {row("", SC17I.MapPin, "Where", val(where))}
            {row("pay", SC17I.Banknote, "Pay", pay.status === "ok"
              ? <span className="v" data-fit="5.5">{pay.hourly} <small>p/h</small> <span className="eq">=</span> {pay.total}</span>
              : val(pay.text))}
          </div>
        </div>
        <div className="foot"><span className="fl"><FFLogo size="100%" tier="gold" /></span><span className="url">{SC17_ADDR}</span></div>
      </div></div>
    </article>
  );
}


/* ---- Add to calendar ------------------------------------------------------------------------------------ */
function ics17(state, shift, event) {
  const iso = (shift.iso || (event && event.iso) || "").replace(/-/g, "");
  const [a, b] = splitTime(shift.time || "");
  const m = (t) => { const x = /^(\d{1,2}):(\d{2})$/.exec(t || ""); return x ? [+x[1], +x[2]] : null; };
  const s = m(a), e2 = m(b);
  const esc = (t) => String(t || "").replace(/[\;,]/g, (c) => "\\" + c).replace(/\n/g, "\\n");
  const stamp = (new Date()).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const at = (h, mi, plus) => {
    const d = new Date(`${shift.iso || (event && event.iso)}T12:00:00`); d.setDate(d.getDate() + (plus || 0));
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(h)}${p(mi)}00`;
  };
  const code = fxCodeOf17(state, shift);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//FireFlair//Shift//EN", "BEGIN:VEVENT", `UID:${code || shift.id}@fireflair`, `DTSTAMP:${stamp}Z`];
  if (iso && s) {
    lines.push(`DTSTART:${at(s[0], s[1])}`);
    if (e2) lines.push(`DTEND:${at(e2[0], e2[1], e2[0] * 60 + e2[1] <= s[0] * 60 + s[1] ? 1 : 0)}`);
  } else if (iso) lines.push(`DTSTART;VALUE=DATE:${iso}`);
  lines.push(`SUMMARY:${esc(`${shift.role || "Shift"} · ${(event && eventTitle(event)) || "FireFlair shift"}`)}`);
  const where = shift.venue || (event && event.venue) || "";
  if (where) lines.push(`LOCATION:${esc(where)}`);
  const co = companyOf17(state, event);
  lines.push(`DESCRIPTION:${esc([co && `Company: ${co}`, code && `Shift brief: ${fx17Link(code)}`].filter(Boolean).join("\n"))}`);
  lines.push("END:VEVENT", "END:VCALENDAR");
  return lines.join("\r\n");
}


function addToCalendar17(state, shift, event) {
  const blob = new Blob([ics17(state, shift, event)], { type: "text/calendar;charset=utf-8" });
  cx17Download(blob, "fireflair-shift-" + (fxCodeOf17(state, shift) || "card").toLowerCase(), "ics");
}


/* ---- Sharing the card ------------------------------------------------------------------------------------ */
/* The Share sheet for a Shift Card: the 5 x 7 image and the /fx/<code> link, which carries the sharer's code. */
function ShiftShareBtn17({ shift, event, source, status, company }) {
  const { state } = useStore();
  const code = fxCodeOf17(state, shift);
  if (!code) return null;
  const nm = (event && eventTitle(event)) || shift.role || "Shift";
  return <CardShareBtn17 title={`${shift.role || "Shift"}: ${nm}`} url={fx17Link(code)} fileName={"fireflair-shift-" + code.toLowerCase()} label="Share" className="wide"
    render={() => <ShiftCard17 shift={shift} event={event} source={source} status={status} company={company} />} />;
}


/* ---- Opening the brief ----------------------------------------------------------------------------------- */
const openBrief17 = (dispatch, code) => dispatch({ type: "V11_SET", patch: { fxPage17: fx17Clean(code), viewing: null, viewingAsGuest: false, viewingCompany: null, peek: null, ptab17: null, fdArea: null, fdPreview: false, pkgPage: null, supportPage20: null } });


/* ---- Reply buttons: Available, Unavailable, More info ------------------------------------------------------ */
/* The same three words as the WhatsApp template (docs/whatsapp-templates.md).
     Available on a shift chosen for you confirms it at once, with Add to calendar.
     Available on an open shift puts you on the list; the hirer chooses.
     More info opens the brief; on the brief itself asking a question takes its place.
   Someone with no profile who taps Available is sent to Join with the shift code carried through. */
function ShiftReplyBar17({ e, shift, event, mode, onMore, onDone }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [ask, setAsk] = useState(false), [txt, setTxt] = useState(""), [m, setM] = useState(null), [nm, setNm] = useState(""), [ph, setPh] = useState("");
  const signedIn = !!(state.auth && state.auth.status === "signedIn");
  const brief = mode === "brief";
  const code = fxCodeOf17(state, shift);
  const hirer = hirerOf11(state, event);
  const now = now17(state), st = startMs17(shift), ended = !!(st && st <= now);
  const go = (as, text) => dispatch({ type: "AF_RESPOND", id: e.id, as, text });
  const toast = (t) => dispatch({ type: "TOAST", toast: t });
  const more = () => { openBrief17(dispatch, code); onMore && onMore(); };
  const send = () => { if (!txt.trim() || !e) return; go("discuss", txt.trim()); setTxt(""); setAsk(false); };
  const third = brief ? <button type="button" onClick={() => setAsk(!ask)} aria-expanded={ask}>Ask a question</button> : <button type="button" onClick={more}>More info</button>;
  const askBox = brief && ask && e && <div className="ask"><input aria-label="Your question" value={txt} onChange={(x) => setTxt(x.target.value.slice(0, 200))} placeholder="Your question" /><div className="btns" style={{ gridTemplateColumns: "1fr" }}><button type="button" className="yes" disabled={!txt.trim()} onClick={send}>Send question</button></div></div>;
  const thread = e && (e.thread || []).length > 0 && <div className="thread">{e.thread.map((x, i) => <p key={i}>{x.from === "pro" ? "You: " : `${hirer}: `}{x.text}</p>)}</div>;
  const people = (state.connections || []).map(c => findPerson(all, state, c.id)).filter(p => p && !p.isCompany && p.id !== "me").slice(0, 8);
  /* No reply recorded yet (a visitor, or a member who was not invited): the open shift. */
  if (!e) {
    if (ended) return <div className="ff-sd11 acts"><p className="mute">This shift has started.</p></div>;
    const yes = () => {
      if (!signedIn) { dispatch({ type: "SESSION", patch: { fxReturn17: code } }); window.dispatchEvent(new Event("ff-login")); return; }
      dispatch({ type: "SHIFT_APPLY17", shiftId: shift.id, as: "available" }); toast(`You're on the list. ${hirer === "The host" ? "The host" : hirer} will choose`);
    };
    const no = () => { if (signedIn) dispatch({ type: "SHIFT_APPLY17", shiftId: shift.id, as: "unavailable" }); toast("Marked unavailable"); };
    return (
      <div className="ff-sd11 acts">
        <div className="btns" role="group" aria-label="Your reply" style={{ gridTemplateColumns: brief ? "1fr 1fr" : "1fr 1fr 1fr" }}>
          <button type="button" className="yes" onClick={yes}>Available</button>
          <button type="button" className="no" onClick={no}>Unavailable</button>
          {brief ? null : third}
        </div>
      </div>
    );
  }
  const pend = ["requested", "discuss"].includes(e.state), avail = e.state === "available", conf = e.state === "confirmed";
  const yes = () => {
    if (avail) { toast("You're on the list"); return; }
    go(e.auto ? "available" : "accept");
    toast(e.auto ? "You're available. The host will choose" : "Shift confirmed");
  };
  const no = () => { go("unavailable"); toast("Marked unavailable. The host has been told"); onDone && onDone(); };
  const handTo = e.handover && ((findPerson(all, state, (state.engagements.find(x => x.id === e.handover.to) || {}).staffId) || {}).name || e.handover.name);
  const handEng = e.handover && state.engagements.find(x => x.id === e.handover.to);
  const buttons = (
    <div className="btns" role="group" aria-label="Your reply" style={{ gridTemplateColumns: brief ? "1fr 1fr 1fr" : "1fr 1fr 1fr" }}>
      <button type="button" className="yes" aria-pressed={avail} onClick={yes}>Available</button>
      <button type="button" className="no" onClick={no}>Unavailable</button>
      {third}
    </div>
  );
  return (
    <div className="ff-sd11 acts">
      {pend && !ended && (<>
        {thread}{buttons}{askBox}
      </>)}
      {pend && ended && <p className="mute">This shift has started.</p>}
      {avail && (<>
        {thread}
        <p className="ok">You're available. {hirer} will choose by {dt17(e.selectBy)}.</p>
        {buttons}{askBox}
      </>)}
      {conf && (<>
        {thread}
        <p className="ok">Confirmed</p>
        <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
          <button type="button" className="yes" onClick={() => addToCalendar17(state, shift, event)}><SC17I.CalendarPlus size={15} style={{ verticalAlign: "-3px", marginRight: 6 }} />Add to calendar</button>
          {third}
        </div>
        {askBox}
        {e.handover && !e.handover.done && <p className="mute">Handover offered to {handTo || "your referral"}. You stay booked until they confirm.</p>}
        {e.handover && !e.handover.done && handEng && handEng.state === "requested" && (
          <div className="proto">Prototype: <button type="button" onClick={() => dispatch({ type: "SHIFT_REFER_ACCEPT", id: handEng.id })}>{handTo || "They"} accept</button></div>)}
        {!ended && !(e.handover && !e.handover.done) && m === null && <button type="button" className="quiet" onClick={() => setM("menu")}>Can't make it?</button>}
        {m === "menu" && (
          <div className="cm">
            <button type="button" className="row" onClick={() => setM("refer")}><b>Refer a team member</b></button>
            <button type="button" className="row" onClick={() => setM("invite")}><b>Invite someone new</b></button>
            <button type="button" className="row hard" onClick={() => setM("cancel")}><b>Cancel the shift</b></button>
            <button type="button" className="quiet" onClick={() => setM(null)}>Back</button>
          </div>)}
        {m === "refer" && (
          <div className="cm">
            {people.length === 0 && <p className="mute">No one in your network yet.</p>}
            {people.map(p => <button key={p.id} type="button" className="row" onClick={() => { dispatch({ type: "SHIFT_REFER", id: e.id, personId: p.id }); toast(`${firstName(p.name)} has been asked to take your shift`); setM(null); }}><Portrait src={p.photo} name={p.name} size={28} /><span><b>{p.name}</b><br /><small>{p.profession}</small></span></button>)}
            <button type="button" className="quiet" onClick={() => setM("menu")}>Back</button>
          </div>)}
        {m === "invite" && (
          <div className="cm">
            <input aria-label="Their name" value={nm} onChange={(x) => setNm(x.target.value)} placeholder="Their name" />
            <input aria-label="Their mobile number" value={ph} onChange={(x) => setPh(x.target.value)} placeholder="Mobile number" inputMode="tel" />
            <div className="btns" style={{ gridTemplateColumns: "1fr" }}><button type="button" className="yes" disabled={!nm.trim() || !ph.trim()} onClick={() => { dispatch({ type: "SHIFT_REFER", id: e.id, name: nm.trim(), phone: ph.trim() }); toast(`${nm.trim()} has been invited to take your shift`); setM(null); }}>Send invitation</button></div>
            <button type="button" className="quiet" onClick={() => setM("menu")}>Back</button>
          </div>)}
        {m === "cancel" && (
          <div className="cm">
            <p className="mute">Cancelling returns this shift to Autofill and affects your reputation. Referring someone keeps it.</p>
            <div className="btns" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <button type="button" className="no" onClick={() => { dispatch({ type: "SHIFT_HARD_CANCEL", id: e.id }); toast("Shift cancelled. The host has been told"); setM(null); onDone && onDone(); }}>Cancel shift</button>
              <button type="button" onClick={() => setM(null)}>Keep it</button>
            </div>
          </div>)}
      </>)}
      {e.state === "unavailable" && <p className="mute">You said no.</p>}
      {e.state === "withdrawn" && <p className="mute">You withdrew.</p>}
      {e.state === "expired" && <p className="mute">This request has ended.</p>}
      {e.state === "not_selected" && <p className="mute">{e.filled ? "This shift has been filled." : "You weren't chosen for this one."}</p>}
      {e.state === "cancelled_pro" && <p className="mute">{e.handedOver ? "Handed over. Your reputation is kept." : "You cancelled this shift."}</p>}
      {["completed", "signed_off", "paid"].includes(e.state) && <p className="mute">Worked.</p>}
    </div>
  );
}


/* ---- The brief page: /fx/<code> -------------------------------------------------------------------------- */
const hirerCompanyId17 = (state, ev) => {
  const nm = (ev && ev.hirer) || "";
  const co = nm && companyList(state).find(x => x.name === nm || (/vooshka/i.test(nm) && /vooshka/i.test(x.name || "")));
  return co ? co.id : "";
};


function ShiftBriefPage17() {
  const { state, dispatch } = useStore();
  const code = state.fxPage17;
  const found = fxFind17(state, code);
  const back = () => rt17Back(() => dispatch({ type: "V11_SET", patch: { fxPage17: null } }));
  useEffect(() => { window.scrollTo(0, 0); }, [code]);
  /* Leaving the page by the address bar or Back clears it (Routes17); this keeps the screen in step. */
  if (!found || !found.shift) {
    return (
      <div className="ff-fx17 page">
        <button type="button" className="ff-fx17-back" onClick={back}><ChevronLeft size={16} /> Back</button>
        <p className="ff-body" style={{ textAlign: "center", margin: "30px 0" }}>This shift isn't available.</p>
      </div>
    );
  }
  const { event, shift } = found;
  const e = (state.engagements || []).filter(x => x.shiftId === shift.id && x.staffId === "me" && state.auth && state.auth.status === "signedIn").sort((a, b) => (b.sentAt || 0) - (a.sentAt || 0))[0] || null;
  const status = statusOf17(e);
  const src = eventSource17(state, event);
  const cid = hirerCompanyId17(state, event);
  const h = hirerCard11(state, event);
  const hirer = hirerOf11(state, event);
  const openCo = () => dispatch({ type: "V11_SET", patch: { fxPage17: null, viewingCompany: cid, viewing: null } });
  const stamp = status === "confirmed" ? "Confirmed" : "Brief";
  return (
    <div className="ff-fx17 page">
      <button type="button" className="ff-fx17-back" onClick={back}><ChevronLeft size={16} /> Back</button>
      <div className="ff-fx17-card"><ShiftCard17 shift={shift} event={event} source={src} status={status} /></div>
      <div className="ff-fx17-share"><ShiftShareBtn17 shift={shift} event={event} source={src} status={status} /></div>
      <div className="ff-fx17-reply"><ShiftReplyBar17 e={e} shift={shift} event={event} mode="brief" /></div>
      <div className="ff-brief11 ff-fx17-body">
        <EventGuide ev={event} shifts={[shift]} viewer="pro" stamp={stamp} />
        {shift.dress ? <section className="tc" aria-label="Dress code"><h4>Dress code</h4><ol><li><span>{shift.dress}</span></li></ol></section> : null}
        <section className="hc" aria-label={h.party ? "VIP Host Card" : "Company Card"}>
          <h4>{h.party ? "Your host" : "Your client"}</h4>
          <HScroll label={h.party ? "VIP Host Card" : "Company Card"}>
            <div className="hc-i">{h.party ? <PartyCard11 demo={h.c} /> : <CompanyCardFace c={h.c} />}</div>
          </HScroll>
          {cid ? <div style={{ marginTop: 8 }}><Btn variant="wide ghost" onClick={openCo}><I11.Briefcase size={14} /> {hirer} profile</Btn></div> : null}
        </section>
        <section className="tc" aria-label="Terms and conditions">
          <h4>Terms and conditions</h4>
          <ol>{termsOf(h.c).map((t) => <li key={t.k}><b>{t.label}</b><span>{t.text}</span></li>)}</ol>
        </section>
      </div>
    </div>
  );
}
