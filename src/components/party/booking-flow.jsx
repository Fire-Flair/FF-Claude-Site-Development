/* src/components/party/booking-flow.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==== v1.1 Bookings: the whole booking on one screen ==========================
   New Event Card opens in place. Tap an Event Card and its booking shows
   underneath as a card stack, solitaire style: the Event Card on top, its
   Service Cards under it, and the people on each Service Card. Press and hold any
   card to open it up and edit it. Checkout is at the bottom: pay and send.
   Previous bookings come last.

   A Service Card can now hold more than one person: shift.staffIds (with
   shift.qty people needed). Older shifts with a single staffId still work. */

const staffOf = (sh) => (sh && (sh.staffIds || (sh.staffId ? [sh.staffId] : []))) || [];


/* How many people the Service Card needs. Who it is sent to (staffIds) can be more: first come, first served. */
const qtyOf = (sh) => Math.max((sh && sh.qty) || 1, 1);


const engFor = (state, shiftId, pid) => state.engagements.filter(e => e.shiftId === shiftId && e.staffId === pid).slice(-1)[0] || null;


const LIVE = ["requested", "available", "discuss", "confirmed", "completed", "signed_off", "paid"];


const DONE = ["confirmed", "completed", "signed_off", "paid"];



/* Booking actions, in front of the main reducer (see v11Reducer). */
function v11BookReducer(s, a) {
  switch (a.type) {
    case "SHIFT_STAFF": return { ...s, shifts: s.shifts.map(x => x.id === a.id ? { ...x, staffIds: a.staffIds, staffId: a.staffIds[0] || "", route: a.staffIds.length ? "" : x.route } : x) };
    case "EVENT_DELETE": return { ...s, events: s.events.filter(e => e.id !== a.id), shifts: s.shifts.filter(x => x.eventId !== a.id), activeEventId: s.activeEventId === a.id ? null : s.activeEventId };
    /* Confirm: every Service Card goes out. People chosen for it get it directly;
       a Service Card sent to the team (sh.offer === "team") goes to the whole
       team, first come first served. */
    case "BOOK_SEND": {
      const now = now17(s); const made = []; const R = rules17(s);
      const mine = s.shifts.filter(x => x.eventId === a.eventId);
      mine.forEach(sh => {
        const pids = staffOf(sh);
        pids.forEach(pid => {
          const last = s.engagements.filter(e => e.shiftId === sh.id && e.staffId === pid).slice(-1)[0];
          if (last && LIVE.includes(last.state)) return;
          /* Someone chosen by name gets an exclusive invitation; a Service Card sent to more people than it needs stays first come, first served. */
          const exclusive = pids.length <= qtyOf(sh);
          const respondBy = Math.min(now + (exclusive ? R.exclusiveH : R.batchH) * 36e5, startMs17(sh) || Infinity);
          made.push({ id: uid("eng"), shiftId: sh.id, staffId: pid, state: "requested", credit: false, offer: true, exclusive, sentAt: now, expiresAt: respondBy, thread: [], questions: a.questions || [], history: [{ state: "requested", at: now }] });
        });
      });
      const sent = made.map(m => m.staffId);
      const ev = s.events.find(v => v.id === a.eventId);
      const party = isParty17(s);
      const paid = (s.paid17 || {})[a.eventId] ? s.paid17 : { ...(s.paid17 || {}), [a.eventId]: { at: now, kind: party ? "party" : "business", amount: party ? R.feeParty : mine.length * R.feeBusiness, policy: POLICY17.version } };
      const snap = (s.snap17 || {})[a.eventId] ? s.snap17 : { ...(s.snap17 || {}), [a.eventId]: { policy: POLICY17.version, at: now, kind: party ? "party" : "business", fee: party ? R.feeParty : R.feeBusiness, shifts: mine.map(x => ({ id: x.id, role: x.role, qty: qtyOf(x), pay: x.total || "", rate: x.rate || "", time: x.time || "", venue: (ev && ev.venue) || x.venue || "" })) } };
      let n = { ...s, paid17: paid, snap17: snap, engagements: [...s.engagements, ...made], selection: s.selection.filter(x => !sent.includes(x)) };
      /* Payment first, then Autofill: Service Cards on the Autofill route start matching now. */
      mine.filter(x => x.route === "auto" && !(n.af17 || {})[x.id] && open17(n, x) > 0).forEach(sh => {
        n = { ...n, af17: { ...(n.af17 || {}), [sh.id]: { id: uid("af"), shiftId: sh.id, eventId: sh.eventId, status: "matching", replacement: false, batches: [], needBatch: true, exhausted: false, startedAt: now } } };
      });
      return audit17(n, "Booker", `Paid and sent: ${ev ? eventTitle(ev) : a.eventId}`);
    }
    /* Someone says yes. On a Service Card sent to the team the first people to
       accept fill it; once it's full, the rest are told it's filled. */
    case "OFFER_ACCEPT": {
      const e = s.engagements.find(x => x.id === a.id); if (!e) return s;
      const sh = s.shifts.find(x => x.id === e.shiftId); if (!sh) return s;
      const now = Date.now();
      let credits = s.credits || { balance: 0, log: [] };
      let engs = s.engagements.map(x => {
        if (x.id !== e.id) return x;
        const next = { ...x, state: "confirmed", history: [...(x.history || []), { state: "confirmed", at: now }] };
        if (x.credit && !x.creditUsed) { next.creditUsed = true; credits = { balance: Math.max(0, credits.balance - 1), log: [...credits.log, { kind: "used", n: 1, shiftId: x.shiftId, at: now }] }; }
        return next;
      });
      const q = Math.max(sh.qty || 1, 1);
      const got = engs.filter(x => x.shiftId === sh.id && DONE.includes(x.state)).length;
      if (got >= q) engs = engs.map(x => x.shiftId === sh.id && x.state === "requested" ? { ...x, state: "expired", filled: true, history: [...(x.history || []), { state: "expired", at: now }] } : x);
      const ids = [...new Set([...staffOf(sh), e.staffId])];
      return { ...s, credits, engagements: engs, shifts: s.shifts.map(x => x.id === sh.id ? { ...x, staffIds: ids, staffId: ids[0] || "" } : x) };
    }
    case "PEEK": return { ...s, peek: a.id || null };
    default: return auto17Reduce(s, a);
  }
}





/* ---- Card preview: tap someone's card on FF Staff ------------------------- */
function CardPeek() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const id = state.peek;
  const p = id && findPerson(all, state, id);
  if (!p) return null;
  const ev = state.events.find(e => e.id === state.activeEventId && !isPast(e.iso));
  const inBar = state.selection.includes(p.id);
  const sv = svcWords(state);
  const fav = (state.favs || []).includes(p.id);
  const onShift = ev ? state.shifts.filter(x => x.eventId === ev.id).find(x => staffOf(x).includes(p.id)) : null;
  const added = inBar || !!onShift;
  const av = ev && availabilityFor(state, p.id, ev.iso);
  const close = () => dispatch({ type: "PEEK", id: null });
  const inNet = (state.connections || []).some(c => c.id === p.id), inTeam = (state.myTeam11 || []).includes(p.id);
  const favT = () => { dispatch({ type: "FAV_TOGGLE", id: p.id }); dispatch({ type: "TOAST", toast: fav ? `${firstName(p.name)} removed from your favourites` : `${firstName(p.name)} added to your favourites` }); };
  const netT = () => { if (inNet) { dispatch({ type: "TOAST", toast: `${firstName(p.name)} is already in your network` }); return; } dispatch({ type: "CONNECT", people: [{ id: p.id, name: p.name, note: p.profession || "", onFF: true, tag: p.tag }] }); dispatch({ type: "TOAST", toast: `${firstName(p.name)} added to your network` }); };
  const teamT = () => { dispatch({ type: "TEAM11_TOGGLE", id: p.id }); dispatch({ type: "TOAST", toast: inTeam ? `${firstName(p.name)} removed from your team` : `${firstName(p.name)} added to your team` }); };
  const add = () => {
    const name = firstName(p.name);
    if (!inBar) dispatch({ type: "SELECT_ADD", id: p.id });
    let placed = null;
    if (ev && !onShift) {
      const prof = String(p.profession || "").toLowerCase();
      const mine = state.shifts.filter(x => x.eventId === ev.id);
      const fit = mine.find(x => { const r = String(x.role || "").toLowerCase(); const last = r.split(" ").pop(); return r && (prof.includes(last) || r.includes(prof.split(" ").pop())); }) || (mine.length === 1 ? mine[0] : null);
      if (fit) { dispatch({ type: "SHIFT_STAFF", id: fit.id, staffIds: [...staffOf(fit), p.id] }); placed = fit; }
    }
    dispatch({ type: "TOAST", toast: placed ? `${name} added to ${eventTitle(ev)} · ${placed.role}` : ev ? `${name} added to ${eventTitle(ev)}` : `${name} added to your booking bar` });
    close();
  };
  const remove = () => {
    if (inBar) dispatch({ type: "SELECT", id: p.id });
    if (onShift && !engFor(state, onShift.id, p.id)) dispatch({ type: "SHIFT_STAFF", id: onShift.id, staffIds: staffOf(onShift).filter(x => x !== p.id) });
    dispatch({ type: "TOAST", toast: `${firstName(p.name)} removed` });
    close();
  };
  return (
    <div className="ff-peek-scrim" onClick={close}>
      <div className="ff-peek" role="dialog" aria-modal="true" aria-label={`${p.name}'s card`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="ff-xpd-x" onClick={close} aria-label="Close"><I11.X size={18} /></button>
        <div className="ff-peek-card"><PlayerCard person={p} format="portrait" themeKey={p.theme || "paper"} /></div>
        {sv.party && <PeekHire11 p={p} />}
        {ev && <p className="ff-peek-ev"><I11.CalendarDays size={13} /> {eventTitle(ev)}{eventTitle(ev).includes(shortDay(ev.iso)) ? "" : ` · ${shortDay(ev.iso)}`}
          {av && <span className={`ff-pill ${availTone(av.answer)}`}>{av.answer === "Yes" ? "Available" : av.answer === "No" ? "Not free" : "Maybe"}</span>}</p>}
        <div className="ff-peek-acts">
          {sv.party ? (<>
            {added
              ? <Btn variant="ghost wide" onClick={remove}><I11.Check size={14} /> {onShift ? `On ${onShift.role || sv.a}` : "In your booking"} · Remove</Btn>
              : <Btn variant="primary wide" onClick={add}><I11.Plus size={14} /> Add to booking</Btn>}
            <Btn variant="wide ghost" onClick={favT}>{fav ? <><I11.Check size={14} /> In your favourites</> : <><I11.Heart size={14} /> Add to favourites</>}</Btn>
          </>) : (<>
            <Btn variant={inNet ? "ghost wide" : "primary wide"} onClick={netT}>{inNet ? <><I11.Check size={14} /> In your network</> : <><I11.Plus size={14} /> Add to network</>}</Btn>
            <Btn variant={inTeam ? "ghost wide" : "wide"} onClick={teamT}>{inTeam ? <><I11.Check size={14} /> In your team</> : <><I11.Plus size={14} /> Add to team</>}</Btn>
            <Btn variant="wide ghost" onClick={favT}>{fav ? <><I11.Check size={14} /> In your favourites</> : <><I11.Heart size={14} /> Add to favourites</>}</Btn>
          </>)}
          <Btn variant="wide" onClick={() => { close(); dispatch({ type: "VIEW", id: p.id, direct: true }); window.scrollTo(0, 0); }}><I11.Eye size={14} /> View profile</Btn>
        </div>
      </div>
    </div>
  );
}




/* A previous booking: review the people who worked it. */
function PastReviews({ ev }) {
  const { state } = useStore();
  const all = useDirectory();
  const [reviewing, setReviewing] = useState(null);
  const worked = state.shifts.filter(x => x.eventId === ev.id).flatMap(sh => staffOf(sh).map(pid => ({ sh, pid, e: engFor(state, sh.id, pid) }))).filter(x => x.e && DONE.includes(x.e.state) && x.pid !== "me");
  return (
    <section className="ff-co11out">
      <div className="ff-co11out-h"><span className="ic"><I11.Star size={18} /></span><h2>Review your team</h2></div>
      {worked.length ? worked.map(({ sh, pid }) => {
        const p = findPerson(all, state, pid); if (!p) return null;
        const done = state.reviews.some(r => r.shiftId === sh.id && r.aboutId === pid);
        return (
          <div key={sh.id + pid} className="ff-co11out-sent"><div className="row"><Portrait src={p.photo} name={p.name} size={28} /><span><b>{p.name}</b><small>{sh.role}</small></span>
            {done ? <span className="ff-pill ok">Reviewed</span> : <Btn variant="sm" onClick={() => setReviewing({ p, sh })}><I11.Award size={12} /> Review</Btn>}</div></div>
        );
      }) : <p className="ff-body ff-muted" style={{ margin: 0 }}>Nobody to review on this booking.</p>}
      <ReviewSheet open={!!reviewing} person={reviewing && reviewing.p} shiftId={reviewing && reviewing.sh.id} onClose={() => setReviewing(null)} />
    </section>
  );
}


(function navHeightSync() {
  if (typeof window === "undefined")
    return;
  let cur = null, ro = null;
  const set = (n) => {
    const h = Math.round(n.getBoundingClientRect().height);
    if (h > 0)
      document.documentElement.style.setProperty("--ff-navh", h + "px");
  };
  const tick = () => {
    const n = document.querySelector(".ff-bottomnav");
    if (!n || n === cur)
      return;
    cur = n;
    if (ro)
      ro.disconnect();
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => set(n));
      ro.observe(n);
    }
    set(n);
  };
  setInterval(tick, 800);
})();



/* ==== v1.1 Bookings: one booking box ==============================================
   Four centred buttons: Event Card, Service Card, Staff, Confirm. Tap one and it
   opens in place; you type straight onto the card; when you're done it shrinks to
   the finished card. Do them in any order. Staff are dragged onto Service Cards
   (or tapped to add); several people on one Service Card go out together and it is
   first come, first served. Confirm is the order review: an invoice preview, then
   the availability requests go out. (In the beta nothing is charged.)
   Your bookings sit below as full Event Cards. */

/* ---- Pay: hours x per hour = shift rate ---------------------------------- */
const numOf = (s) => { const v = parseFloat(String(s == null ? "" : s).replace(/[^\d.]/g, "")); return isFinite(v) ? v : 0; };


const moneyOf = (n) => { const v = Math.round(n * 100) / 100; return !isFinite(v) || v === 0 ? "" : (v % 1 === 0 ? String(v) : v.toFixed(2)); };


const hoursBetween = (a, b) => {
  if (!a || !b) return 0;
  const [h1, m1] = a.split(":").map(Number), [h2, m2] = b.split(":").map(Number);
  let d = (h2 * 60 + m2) - (h1 * 60 + m1); if (d <= 0) d += 1440;
  return Math.round(d / 60 * 100) / 100;
};


const hrsText = (h) => `${h % 1 === 0 ? h : h.toFixed(2).replace(/0$/, "")} hr${h === 1 ? "" : "s"}`;


const shiftHours = (sh) => { const [a, b] = splitTime(sh.time || ""); return hoursBetween(a, b) || numOf(sh.hoursM); };



/* ---- Where a booking is up to, and who's in the team ----------------------- */
const staffPlanned = (sh) => staffOf(sh).length > 0 || sh.route === "auto";


const evComplete = (ev) => !!(ev && ev.iso && String(ev.venue || "").trim());


const detailsOK = (sh) => { const [a, b] = splitTime(sh.time || ""); return !!(sh.role && a && b); };


function flowInfo(state, ev) {
  const shifts = ev ? state.shifts.filter(x => x.eventId === ev.id) : [];
  const sent = shifts.some(sh => state.engagements.some(e => e.shiftId === sh.id && LIVE.includes(e.state)));
  const hasShifts = shifts.length > 0;
  const has1 = evComplete(ev), has2 = hasShifts && shifts.every(detailsOK), has3 = hasShifts && shifts.every(staffPlanned);
  return { shifts, has1, has2, has3, hasShifts, sent, doneN: [has1, has2, has3, sent].filter(Boolean).length };
}


const teamOf = (state, all) => [...new Set([...(state.myTeam11 || []), ...state.engagements.filter(e => DONE.includes(e.state)).map(e => e.staffId)])]
  .filter(id => id !== "me").map(id => all.find(p => p.id === id)).filter(p => p && !p.isCompany);


const engText = (e) => e.filled ? "Shift filled" : e.state === "requested" ? "Waiting for reply" : ENG_LABEL[e.state];


const areaOf = (ev) => String((ev && ev.venue) || "").split(",").slice(1).join(" ").trim() || String((ev && ev.venue) || "");



/* ---- Recommendations: best people for this job, on this date, in this area -- */
function rankPeople(state, all, { role, iso, area, exclude = [], team = [], teamLabel = "In your team" }) {
  const words = (s) => String(s || "").toLowerCase().split(/[^a-z]+/).filter(w => w.length >= 4 && !["staff", "event", "team"].includes(w));
  const rw = words(role), aw = words(area);
  const day = iso ? shortDay(iso) : "";
  return all.filter(p => p.id !== "me" && !p.isCompany && !exclude.includes(p.id)).map(p => {
    const hay = personSearchText(p), prof = String(p.profession || "").toLowerCase();
    let score = 0; const why = [];
    if (rw.some(w => prof.includes(w.replace(/s$/, "")))) { score += 6; why.push(p.profession); }
    else if (rw.some(w => hay.includes(w.replace(/s$/, "")))) { score += 2; why.push("Has the skill"); }
    const av = availabilityFor(state, p.id, iso);
    if (av) { if (av.answer === "Yes") { score += 4; why.push(`Free ${day}`); } else if (av.answer === "Maybe") { score += 1; why.push("Might be free"); } else score -= 10; }
    if (aw.some(w => hay.includes(w))) { score += 2; why.push("Covers your area"); }
    if (team.includes(p.id)) { score += 2; why.push(teamLabel); }
    return { p, score, why, av };
  }).sort((a, b) => b.score - a.score);
}



/* ---- Drag and drop: drag a person onto a Service Card ----------------------------
   Mouse: drag straight away. Touch: press and hold a moment, then drag (so the row
   still scrolls sideways). The drop is announced with an "ff-drop" event. */
const DND = { on: false };


if (typeof window !== "undefined" && !window.__ffDndTouch) {
  window.__ffDndTouch = true;
  window.addEventListener("touchmove", (e) => {
    if (DND.on)
      e.preventDefault();
  }, { passive: false });
}


function attachDrag(e, p, srcEl) {
  if (e.button > 0) return;
  if (e.target.closest && e.target.closest("[data-nodrag],input,select,textarea")) return;
  const st = { x: e.clientX, y: e.clientY, cx: e.clientX, cy: e.clientY, touch: e.pointerType === "touch", drag: false, timer: null, ghost: null, over: null, raf: null };
  const place = () => { if (st.ghost) st.ghost.style.transform = `translate(${st.cx - (st.gw || 0) / 2}px, ${st.cy - (st.gh || 0) * 0.4}px) rotate(-4deg)`; };
  const hit = () => {
    if (st.ghost) st.ghost.style.display = "none";
    const el = document.elementFromPoint(st.cx, st.cy);
    if (st.ghost) st.ghost.style.display = "";
    const t = el && el.closest ? el.closest("[data-dropshift]") : null;
    if (t !== st.over) { if (st.over) st.over.classList.remove("dnd-over"); if (t) t.classList.add("dnd-over"); st.over = t; }
  };
  const begin = () => {
    st.drag = true; DND.on = true; document.body.classList.add("ff-dragging");
    const g = document.createElement("div"); g.className = "ff-gVIP Host Card";
    const card = srcEl && srcEl.firstElementChild ? srcEl.firstElementChild.firstElementChild || srcEl.firstElementChild : null;
    if (card) {
      const r = card.getBoundingClientRect(), k = 0.5;
      const c = card.cloneNode(true); c.removeAttribute("id");
      c.style.cssText += `;width:${r.width}px;height:${r.height}px;margin:0;transform:scale(${k});transform-origin:0 0;pointer-events:none;`;
      g.style.width = r.width * k + "px"; g.style.height = r.height * k + "px"; g.appendChild(c); st.gw = r.width * k; st.gh = r.height * k;
    } else {
      g.className = "ff-ghost";
      const ph = document.createElement("span"); ph.className = "ph"; if (p.photo) ph.style.backgroundImage = `url("${p.photo}")`; else ph.textContent = coInitials(p.name);
      const nm = document.createElement("b"); nm.textContent = firstName(p.name);
      g.appendChild(ph); g.appendChild(nm); st.gw = 120; st.gh = 44;
    }
    document.body.appendChild(g); st.ghost = g; place();
    const tick = () => { if (!st.drag) return; if (st.cy < 90) window.scrollBy(0, -14); else if (st.cy > window.innerHeight - 90) window.scrollBy(0, 14); hit(); st.raf = requestAnimationFrame(tick); };
    tick();
  };
  const move = (ev) => {
    st.cx = ev.clientX; st.cy = ev.clientY;
    if (!st.drag) {
      const dx = Math.abs(st.cx - st.x), dy = Math.abs(st.cy - st.y);
      if (st.touch) { if (dx > 8 || dy > 8) { clearTimeout(st.timer); end(false); } return; }
      if (dx + dy > 6) begin();
    } else { place(); hit(); }
  };
  const end = (drop) => {
    window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", cancel);
    clearTimeout(st.timer); if (st.raf) cancelAnimationFrame(st.raf);
    if (st.drag) {
      window.__ffDragged = Date.now();
      if (drop && st.over) window.dispatchEvent(new CustomEvent("ff-drop", { detail: { shiftId: st.over.getAttribute("data-dropshift"), personId: p.id } }));
      if (st.over) st.over.classList.remove("dnd-over");
      if (st.ghost) st.ghost.remove();
    }
    st.drag = false; DND.on = false; document.body.classList.remove("ff-dragging");
  };
  const up = () => end(true), cancel = () => end(false);
  window.addEventListener("pointermove", move); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", cancel);
  if (st.touch) st.timer = setTimeout(begin, 320);
}


const suppressClick = (e) => { if (Date.now() - (window.__ffDragged || 0) < 350) { e.stopPropagation(); e.preventDefault(); } };



/* ---- Pieces ----------------------------------------------------------------- */
/* Miniature cards on the step buttons, so you know what opens. */
function Mini11({ kind, people = [], icon: Icon }) {
  if (kind === "staff") return (
    <span className="ff-mini11 fan" aria-hidden="true">
      {[0, 1, 2].map(i => { const p = people[i]; return <span key={i} className={`pc p${i}`}>{p && p.photo ? <img decoding="async" src={p.photo} alt="" /> : <I11.User size={14} />}<i /></span>; })}
    </span>
  );
  if (kind === "shift") return (
    <span className="ff-mini11 sh" aria-hidden="true"><i className="pl" />{[0, 1, 2, 3].map(i => <i key={i} className="rw"><b /></i>)}</span>
  );
  return (
    <span className="ff-mini11 ev" aria-hidden="true"><i className="pl" /><span className="ic">{Icon ? <Icon size={13} strokeWidth={1.8} /> : null}</span><i className="ln" /><i className="ln s" /></span>
  );
}


function BigBtn({ n, icon: Icon, title, hint, onClick, id, done, faces, mini }) {
  return (
    <button type="button" id={id} className={`ff-bbtn s${n}${done ? " ok" : ""}`} onClick={onClick} aria-expanded="false">
      <span className="n">{done ? <I11.Check size={16} strokeWidth={3} /> : n}</span>
      <span className="tx"><b>{title}</b><small>{hint}</small></span>
      {mini ? <Mini11 kind={mini} people={faces || []} icon={Icon} />
        : faces && faces.length > 0
        ? <span className="faces">{faces.slice(0, 4).map(p => <Portrait key={p.id} src={p.photo} name={p.name} size={30} tier={p.tier} />)}</span>
        : <span className="ic"><Icon size={22} strokeWidth={1.7} /></span>}
      <span className="dd"><I11.ChevronDown size={18} /></span>
    </button>
  );
}


function SecHead({ n, title, state, action, onToggle }) {
  const inner = (<>
    <span className={`n${state === "done" ? " ok" : ""}`}>{state === "done" ? <I11.Check size={13} strokeWidth={3} /> : n}</span>
    <b>{title}</b>
    {action}
    {onToggle && <span className="dd open"><I11.ChevronDown size={18} /></span>}
  </>);
  return onToggle
    ? <button type="button" className="ff-bsec-h tap" aria-expanded="true" onClick={onToggle}>{inner}</button>
    : <div className="ff-bsec-h">{inner}</div>;
}


const focusSec = (id) => setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 90);



/* ---- A Service Card you type straight onto: five boxes ------------------------------------ */
const BOOKING_FEE = 10;

 // per Service Card, shown on the invoice
function ShiftFaceEdit({ sh, ev, ensure, onClose, n, onConfirm, onStaff }) {
  const { state, dispatch } = useStore();
  const isNew = !sh;
  const sv = svcWords(state);
  const all11 = useDirectory();
  const mine = ev ? state.shifts.filter(x => x.eventId === ev.id) : [];
  const prev = mine[mine.length - 1];
  const base = sh || (prev ? { ...prev, role: "" } : {});
  const [a, b] = splitTime(base.time || "");
  const [f, setF] = useState({ role: sh ? sh.role || "" : "", start: a || (sh ? "" : startOf(ev)), finish: b || "", rate: base.rate || "", total: base.total || "", hoursM: base.hoursM || "" });
  const [terms, setTerms] = useState(false);
  const firstRun = useRef(true);
  const evStart = startOf(ev);
  useEffect(() => { if (evStart && !f.start) setF(g => (g.start ? g : { ...g, start: evStart })); }, [evStart]);
  const sentN = sh ? state.engagements.filter(e => e.shiftId === sh.id && LIVE.includes(e.state)).length : 0;
  const hrsT = hoursBetween(f.start, f.finish);
  const hours = hrsT || numOf(f.hoursM);
  const reprice = (g, h) => {
    if (numOf(g.rate) && h) return { ...g, total: moneyOf(numOf(g.rate) * h) };
    if (numOf(g.total) && h) return { ...g, rate: moneyOf(numOf(g.total) / h) };
    return g;
  };
  const setTime = (k) => (e) => { const g = { ...f, [k]: e.target.value }; setF(reprice(g, hoursBetween(g.start, g.finish) || numOf(g.hoursM))); };
  const setHrs = (e) => { const g = { ...f, hoursM: e.target.value.replace(/[^\d.]/g, "") }; setF(reprice(g, numOf(g.hoursM))); };
  const setRate = (e) => { const r = e.target.value.replace(/[^\d.]/g, ""); setF({ ...f, rate: r, total: r ? (hours ? moneyOf(numOf(r) * hours) : f.total) : "" }); };
  const setTotal = (e) => { const t = e.target.value.replace(/[^\d.]/g, ""); setF({ ...f, total: t, rate: t ? (hours ? moneyOf(numOf(t) / hours) : f.rate) : "" }); };
  const ready = !!(f.role.trim() && f.start);
  const payload = (g = f) => ({ role: g.role.trim(), qty: 1, time: [g.start, g.finish].filter(Boolean).join(" — "), dress: (sh && sh.dress) || "", notes: (sh && sh.notes) || "", tcs: "company",
    rate: g.rate, total: g.total, hoursM: g.hoursM, pay: g.total ? `£${g.total}${g.rate ? ` (£${g.rate}/hr)` : ""}` : "",
    date: (ev && ev.date) || "", iso: (ev && ev.iso) || "", venue: (ev && ev.venue) || "" });
  const persist = () => {
    const d = payload();
    if (isNew) { const evId = ensure(); dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: evId, staffIds: [], staffId: "", skills: [], ...d } }); return { evId, d }; }
    dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: d }); return { evId: sh.eventId, d };
  };
  const save = () => { persist(); dispatch({ type: "TOAST", toast: `${sv.T} ${isNew ? "added" : "saved"}` }); onClose(); };
  useEffect(() => {
    if (isNew) return;
    if (firstRun.current) { firstRun.current = false; return; }
    const t = setTimeout(() => dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: payload() }), 250);
    return () => clearTimeout(t);
  }, [f.role, f.start, f.finish, f.rate, f.total, f.hoursM]);
  const dup = () => { const { evId, d } = persist(); dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: evId, staffIds: [], staffId: "", skills: [], ...d } }); dispatch({ type: "TOAST", toast: `${sv.T} duplicated` }); onClose(); };
  return (
    <div className="ff-sfwrap" id={sh ? `ff-sf-${sh.id}` : undefined}>
      <div className="ff-sface edit">
        <span className="plate"><I11.ClipboardList size={11} /> {sv.plate}{n ? ` ${n}` : ""}</span>
        <span className="coin"><Coin size={28} tier="gold" /></span>
        <div className="bxs">
          <RoleBox11 value={f.role} onChange={(v) => {
            const g = { ...f, role: v }; setF(g);
            if (isNew && v) { const evId = ensure(); dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: evId, staffIds: [], staffId: "", skills: [], ...payload(g) } }); dispatch({ type: "TOAST", toast: `${v} added` }); }
          }} />
          <label className="bx"><span className="ic"><I11.Clock size={14} /></span><span className="k">Starts</span><input type="time" value={f.start} onChange={setTime("start")} aria-label="Start time" /></label>
          <label className="bx"><span className="ic"><I11.Clock size={14} /></span><span className="k">Finishes</span><input type="time" value={f.finish} onChange={setTime("finish")} aria-label="Finish time" /></label>
          <div className="bx pay" role="group" aria-label="Pay">
            <span className="ic"><I11.Banknote size={14} /></span><span className="k">Pay</span>
            <div className="ff-calc">
              <div className="pc"><small>Hours</small>
                {hrsT ? <b className="hrsv">{hrsText(hrsT)}</b> : <span className="in"><input inputMode="decimal" value={f.hoursM} onChange={setHrs} placeholder="0" aria-label="Hours" /></span>}</div>
              <span className="op" aria-hidden="true">×</span>
              <label className="pc"><small>Per hour</small><span className="in"><i>£</i><input inputMode="decimal" value={f.rate} onChange={setRate} placeholder="0" aria-label="Pay per hour" /></span></label>
              <span className="op" aria-hidden="true">=</span>
              <label className="pc tot"><small>Shift rate</small><span className="in"><i>£</i><input inputMode="decimal" value={f.total} onChange={setTotal} placeholder="0" aria-label="Shift rate" /></span></label>
            </div>
          </div>
          <button type="button" className="bx trm" onClick={() => setTerms(true)} aria-label="Terms and conditions">
            <span className="ic"><I11.FileText size={14} /></span><span className="k">Terms</span><span className="v">{tcsLine(state, {})}</span><I11.ChevronRight size={16} />
          </button>
          {sh && onStaff && (() => { const ppl = staffOf(sh).map(pid => findPerson(all11, state, pid)).filter(Boolean); return (
            <button type="button" className="bx trm stf" onClick={onStaff} aria-label="Staff">
              <span className="ic"><I11.Users size={14} /></span><span className="k">Staff</span>
              <span className="v">{ppl.length ? <span className="ppl">{ppl.slice(0, 3).map(p => <Portrait key={p.id} src={p.photo} name={p.name} size={24} tier={p.tier} />)}<span>{ppl.map(p => firstName(p.name)).join(", ")}</span></span> : "Choose"}</span><I11.ChevronRight size={16} />
            </button>); })()}
        </div>
        {sentN > 0 && <p className="ff-shed-warn">Already sent to {sentN}. Changes go to them on WhatsApp.</p>}
      </div>
      <TermsSheet11 open={terms} onClose={() => setTerms(false)} />
    </div>
  );
}




/* ---- Staff: your team, our recommendations, search; drag onto a Service Card ---------- */
function DragTile({ p, onAdd, why, onRemove }) {
  const { state, dispatch } = useStore();
  const party = hireSiteOf(state).party, fav = (state.favs || []).includes(p.id);
  return (
    <div className="ff-dtile" onPointerDown={(e) => attachDrag(e, p, e.currentTarget)} onClickCapture={suppressClick} onDragStart={(e) => e.preventDefault()}>
      <PlayerTile person={p} onClick={() => dispatch({ type: "VIEW", id: p.id })} />
      {party && <button type="button" data-nodrag className={`fav${fav ? " on" : ""}`} aria-pressed={fav} aria-label={fav ? `Remove ${firstName(p.name)} from favourites` : `Add ${firstName(p.name)} to favourites`}
        onClick={() => { dispatch({ type: "FAV_TOGGLE", id: p.id }); dispatch({ type: "TOAST", toast: fav ? `${firstName(p.name)} removed from your favourites` : `${firstName(p.name)} added to your favourites` }); }}><I11.Heart size={14} /></button>}
      {why && why.length > 0 && <div className="why">{why.slice(0, 2).map(w => <i key={w}>{w}</i>)}</div>}
      {onRemove
        ? <button type="button" data-nodrag className="ff-btn sm ghost" onClick={() => onRemove(p)}><I11.X size={12} /> Remove</button>
        : <button type="button" data-nodrag className="ff-btn sm" onClick={() => onAdd(p)}><I11.Plus size={12} /> Add</button>}
    </div>
  );
}


function StaffBox({ icon: Icon, title, count, open, onToggle, children, id }) {
  return (
    <section className={`ff-sbox${open ? " open" : ""}`} id={id}>
      <button type="button" className="h" aria-expanded={open} onClick={onToggle}>
        <span className="ic"><Icon size={16} /></span><b>{title}</b>{count != null && <span className="ct">{count}</span>}<I11.ChevronRight size={16} className="chev" />
      </button>
      {open && <div className="body">{children}</div>}
    </section>
  );
}


function StaffPanel({ ev, shifts, slotId, setSlotId, place, onRemove, onClose, onAddRole, onRemoveSlot, onSelect }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const sv = svcWords(state), party = sv.party;
  const team = teamOf(state, all);
  const favs = favsOf(state, all);
  const pool = party ? favs : team, poolName = party ? "favourites" : "team";
  const [openB, setOpenB] = useState({ prof: true, team: false, rec: false, find: false, fav: false });
  const [q, setQ] = useState("");
  const forSh = shifts.find(x => x.id === slotId) || shifts.find(x => !staffPlanned(x)) || shifts[0] || null;
  const placed = new Set(shifts.flatMap(staffOf));
  const picks = state.selection.filter(id => !placed.has(id) && id !== "me").map(id => findPerson(all, state, id)).filter(Boolean);
  const rec = rankPeople(state, all, { role: forSh && (forSh.matchRole || forSh.role), iso: ev && ev.iso, area: areaOf(ev), exclude: [...placed], team: pool.map(t => t.id), teamLabel: party ? "Your favourite" : "In your team" }).filter(r => r.score > -5).slice(0, 10);
  const nq = q.trim().toLowerCase();
  const found = nq ? all.filter(p => p.id !== "me" && !p.isCompany && personSearchText(p).includes(nq)).slice(0, 20) : [];
  const tog = (k) => setOpenB({ ...openB, [k]: !openB[k] });
  const wholePool = (sh) => { const add = pool.map(t => t.id).filter(id => !staffOf(sh).includes(id)); dispatch({ type: "SHIFT_STAFF", id: sh.id, staffIds: [...staffOf(sh), ...add] }); dispatch({ type: "TOAST", toast: `Your ${poolName} added to ${sh.role}` }); };
  const browse = () => { dispatch({ type: "V11_SET", patch: { netBrief: { eventId: ev && ev.id, shiftId: forSh && forSh.id } } }); dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); };
  const timeOf = (sh) => { const [a, b] = splitTime(sh.time || ""); return a ? (b ? `${a} to ${b}` : a) : "Time to set"; };
  const counts = {}; shifts.forEach(sh => { const k = String(sh.role || "").toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
  const poolBox = (key, title, icon) => (
    <StaffBox key={key} icon={icon} title={title} count={pool.length} open={openB[key]} onToggle={() => tog(key)}>
      {pool.length ? (<>
        {shifts.length > 0 && <div className="ff-chiprow"><span>{party ? "Add all your favourites to:" : "Send to your whole team:"}</span>{shifts.map((sh, i) => <button key={sh.id} type="button" onClick={() => wholePool(sh)}>{i + 1}. {sh.role}</button>)}</div>}
        <HScroll label={title}>{pool.map(p => <DragTile key={p.id} p={p} onAdd={place} />)}</HScroll>
      </>) : <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 13 }}>{party ? "Nobody yet. Tap the heart on anyone's card or profile to keep them here for next time." : "Nobody yet. People you've booked and confirmed appear here, ready for next time."}</p>}
    </StaffBox>
  );
  return (
    <div className="ff-spanel" id="ff-bs-staff-open">

      {party && <StaffBox icon={I11.Sparkles} title="FireFlair recommends" count={rec.length} open={openB.rec} onToggle={() => tog("rec")}>
        {rec.length ? <HScroll label="Recommended">{rec.map(({ p, why }) => <DragTile key={p.id} p={p} why={why} onAdd={place} />)}</HScroll> : <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 13 }}>No matches yet. Try search.</p>}
      </StaffBox>}

      <StaffBox icon={I11.Search} title="Search for staff" open={openB.find} onToggle={() => tog("find")}>
        <SearchBox11 value={q} onChange={setQ} placeholder="Name, profession, skill or area" label="Search for staff" />
        {nq ? (found.length ? <HScroll label="Search results">{found.map(p => <DragTile key={p.id} p={p} onAdd={place} />)}</HScroll> : <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 13 }}>Nobody matches that yet.</p>) : null}
        {ev && forSh && <Btn variant="wide ghost" onClick={browse}><I11.ArrowRight size={14} /> Open the Network with this booking filled in</Btn>}
      </StaffBox>

      {party && poolBox("fav", "Favourite staff", I11.Heart)}

    </div>
  );
}




function Basket11({ ev, onEvent, shifts, bub, onSelect, onAdd, placeOn, onRemove, onRemoveSlot }) {
  const { state } = useStore();
  const all = useDirectory();
  const sv = svcWords(state), party = sv.party;
  const placed = new Set(shifts.flatMap(staffOf));
  const picks = state.selection.filter(id => !placed.has(id) && id !== "me").map(id => findPerson(all, state, id)).filter(Boolean);
  const cur = bub ? shifts.find(x => x.id === bub.id) : null;
  const boxRef = useRef(null);
  const [tx, setTx] = useState(null);
  const measure = () => {
    if (!cur || !boxRef.current) { setTx(null); return; }
    const el = boxRef.current.querySelector(`[data-dropshift="${cur.id}"]`);
    if (!el) return;
    const b = boxRef.current.getBoundingClientRect(), r = el.getBoundingClientRect();
    setTx(Math.max(18, Math.min(b.width - 18, r.left + r.width / 2 - b.left)));
  };
  React.useLayoutEffect(measure, [cur && cur.id, shifts.length]);
  useEffect(() => { window.addEventListener("resize", measure); return () => window.removeEventListener("resize", measure); });
  return (
    <div className={`ff-mbasket${shifts.length ? "" : " empty"}`} id="ff-bs-basket" ref={boxRef}>
      <div className="ff-mc-row" role="list" aria-label={sv.Ts} onScroll={measure}>
      <button type="button" className="ff-mbev" onClick={onEvent} aria-label="Your booking: open the Event Card">
        <span className="lb">Your booking</span>
        <span className="mc">
          <i className="pl">Event</i>
          <b>{ev && ev.iso ? new Date(ev.iso + "T12:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : "Date"}</b>
          <small>{(ev && startOf(ev)) || "Time"}</small>
          <small className="v">{(ev && String(ev.venue || "").split(",")[0]) || "Location"}</small>
        </span>
      </button>
        {shifts.map((sh, i) => {
          const ids = staffOf(sh), on = cur && cur.id === sh.id, sentN = state.engagements.filter(e => e.shiftId === sh.id && LIVE.includes(e.state)).length;
          return (
            <div key={sh.id} role="listitem" tabIndex={0} className={`ff-mc${on ? " on" : ""}${ids.length ? " has" : ""}`} data-dropshift={sh.id}
              onClick={() => onSelect(sh)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(sh); } }}
              aria-pressed={!!on} aria-label={`${sh.role}, ${ids.length} chosen`}>
              <span className="n">{i + 1}</span>
              {!party && sentN === 0 && <button type="button" data-nodrag className="rm" aria-label={`Remove ${sh.role}`} onClick={(e) => { e.stopPropagation(); onRemoveSlot(sh); }}><I11.X size={11} strokeWidth={3} /></button>}
              <span className="faces">{ids.length ? ids.slice(0, 3).map(pid => { const p = findPerson(all, state, pid); return p ? (
                <span key={pid} className="f" title={p.name}><Portrait src={p.photo} name={p.name} size={ids.length > 1 ? 24 : 30} tier={p.tier} />
                  {!engFor(state, sh.id, pid) && <button type="button" data-nodrag aria-label={`Remove ${p.name}`} onClick={(e) => { e.stopPropagation(); onRemove(sh, pid); }}><I11.X size={9} strokeWidth={3} /></button>}</span>) : null; })
                : <span className="empty" aria-hidden="true"><I11.Plus size={15} strokeWidth={2.4} /></span>}
                {ids.length > 3 && <i>+{ids.length - 3}</i>}</span>
              <b>{sh.role || sv.T}</b>
            </div>
          );
        })}
        <button type="button" role="listitem" className="ff-mc add" onClick={onAdd} aria-label={shifts.length ? "Add another role" : "Add a role"}><span className="faces"><span className="empty"><I11.Plus size={18} strokeWidth={2.4} /></span></span></button>
      </div>
    </div>
  );
}



/* FF Staff, step 3: one row of staff cards. Your picks and your team first, then FireFlair's
   recommendations, then everyone else, closest first. All sorting happens on the page. */
const areaKey11 = (txt) => { const t = String(txt || "").toLowerCase(); return Object.keys(MAP_AREAS).find(k => t.includes(k.toLowerCase())) || (t.includes("london") ? "Central London" : ""); };


const personArea11 = (p) => (p.locations || []).find(l => MAP_AREAS[l]) || "";


const roleKey11 = (role) => { const w = String(role || "").toLowerCase().split(/[^a-z]+/).filter(Boolean); const h = w[w.length - 1] || ""; return h.slice(0, Math.max(4, Math.min(6, h.length))); };


function StaffRow11({ ev, shifts, sel, onToggle }) {
  const { state } = useStore();
  const all = useDirectory();
  const [q, setQ] = useState("");
  const teamIds = new Set(teamOf(state, all).map(t => t.id));
  const placed = new Set(sel ? staffOf(sel) : shifts.flatMap(staffOf));
  const nq = q.trim().toLowerCase();
  const key = sel ? roleKey11(sel.role) : "";
  const pool = all.filter(p => p.id !== "me" && !p.isCompany && (!nq || personSearchText(p).toLowerCase().includes(nq)) && (!key || personSearchText(p).toLowerCase().includes(key)));
  const ranked = rankPeople(state, pool, { role: sel ? sel.role : shifts.map(x => x.role).join(" "), iso: ev && ev.iso, area: areaOf(ev) });
  const home = areaKey11(ev && ev.venue) || "Central London";
  const dist = (p) => { const a = personArea11(p); if (!a) return 999; const [x1, y1] = MAP_AREAS[a], [x2, y2] = MAP_AREAS[home]; return Math.hypot(x1 - x2, y1 - y2); };
  const picks = state.selection.map(id => pool.find(p => p.id === id)).filter(Boolean);
  const first = [
    ...picks.map(p => ({ p, tag: "Your pick" })),
    ...ranked.filter(r => teamIds.has(r.p.id) && !picks.includes(r.p)).map(r => ({ p: r.p, tag: "Your team", team: true })),
  ];
  const seen = new Set(first.map(x => x.p.id));
  const rec = ranked.filter(r => !seen.has(r.p.id) && r.score > -5).sort((x, y) => (y.score - x.score) || ((y.p.rating || 0) - (x.p.rating || 0)) || ((y.p.years || 0) - (x.p.years || 0))).slice(0, 3).map(r => ({ p: r.p, tag: "Recommended" }));
  rec.forEach(x => seen.add(x.p.id));
  const rest = pool.filter(p => !seen.has(p.id)).sort((a, b) => dist(a) - dist(b)).map(p => ({ p, tag: personArea11(p) || "Closest" }));
  const items = [...first, ...rec, ...rest].slice(0, 10), nFirst = first.length + rec.length;
  const tile = ({ p, tag, team }) => (
    <div key={p.id} className={`ff-pick11-t${team ? " team" : ""}${placed.has(p.id) ? " on" : ""}`}>
      <PlayerTile person={p} onClick={() => onToggle(p)} />
      {placed.has(p.id) && <span className="tick" aria-hidden="true"><I11.Check size={16} strokeWidth={3} /></span>}
      <i>{tag}</i>
    </div>
  );
  return (
    <div className="ff-srow11">
      <p className="ff-sfnote">{sel ? `Staff for ${sel.role}` : "Staff"}</p>
      <SearchBox11 value={q} onChange={setQ} placeholder="Name, profession, skill or area" label="Search for staff" />
      <HScroll label="Staff">
        {items.flatMap((x, i) => (i === nFirst && nFirst > 0 ? [<div key="gap" className="ff-srow11-gap" aria-hidden="true"><span>Closest to your event</span></div>, tile(x)] : [tile(x)]))}
        <button type="button" key="more" className="ff-pick11-t ff-pick11-more" aria-label="Search for more staff" onClick={(e) => { const i = e.currentTarget.closest(".ff-srow11").querySelector("input[type=search]"); if (i) { i.scrollIntoView({ behavior: "smooth", block: "center" }); i.focus(); } }}>
          <span className="card"><I11.Plus size={38} strokeWidth={2.2} /></span><i>Search</i>
        </button>
        <AutofillCard17 key="auto" shifts={sel ? [sel] : shifts} />
      </HScroll>
      {!pool.length && <p className="ff-body ff-muted" style={{ margin: "8px 0 0", fontSize: 13 }}>{sel && !nq ? `Nobody with ${sel.role} on their profile yet.` : "Nobody matches that yet."}</p>}
    </div>
  );
}



/* ---- Contact for the booking: phone and email, each saved on its own ---- */
const contactOf11 = (state, ev) => { const c = state.company || {}; return [(ev && ev.phone) || state.bookPhone || c.phone || (state.session && state.session.phone), (ev && ev.email) || state.bookEmail || c.email].filter(Boolean).join(" · "); };



/* Billed to: a name, or a box to type one in. */
function BillPhone11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const known = String(c.phone || (state.session && state.session.phone) || "").trim();
  const val = state.bookPhone !== undefined && state.bookPhone !== null && state.bookPhone !== "" ? state.bookPhone : known;
  return <input id="ff-bill-phone" className="ff-billin" type="tel" autoComplete="tel" value={val} placeholder="Phone number" aria-label="Phone number"
    onChange={(e) => dispatch({ type: "V11_SET", patch: { bookPhone: e.target.value.slice(0, 24) } })} />;
}


function BillEmail11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const known = String(c.email || "").trim();
  const val = state.bookEmail !== undefined && state.bookEmail !== null && state.bookEmail !== "" ? state.bookEmail : known;
  return <input className="ff-billin" type="email" autoComplete="email" value={val} placeholder="Email (optional)" aria-label="Email, optional"
    onChange={(e) => dispatch({ type: "V11_SET", patch: { bookEmail: e.target.value.slice(0, 80) } })} />;
}


function BillName11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const known = String(c.name || (state.profile && state.profile.name) || (state.session && state.session.name) || "").trim();
  const val = state.bookName !== undefined && state.bookName !== null ? state.bookName : known;
  return <input className="ff-billin" value={val} placeholder="Your name or company" aria-label="Billed to"
    onChange={(e) => dispatch({ type: "V11_SET", patch: { bookName: e.target.value.slice(0, 60) } })} />;
}



/* What happens after you confirm: WhatsApp, then the staff confirm. */
function Availability11() {
  const steps = [
    { t: "You confirm", s: "Your booking and Shift cards are ready.", i: I11.Check, gold: true },
    { t: "Sent on WhatsApp", s: "Each person gets their shift details.", i: WhatsAppIcon },
    { t: "Staff confirm", s: "They accept on WhatsApp. You see it here.", i: I11.Users, gold: true },
  ];
  return (
    <section className="ff-avail11" aria-labelledby="ff-avail11-h">
      <span className="coin"><Coin size={30} tier="gold" /></span>
      <h3 id="ff-avail11-h">How availability works</h3>
      <ol className="steps">
        {steps.map((x, i) => (
          <li key={x.t}>
            <span className={`ic${x.gold ? " gold" : ""}`}><x.i size={18} /></span><b>{x.t}</b><small>{x.s}</small>
            {i < steps.length - 1 && <span className="ar" aria-hidden="true"><I11.ArrowRight size={16} strokeWidth={2.6} /></span>}
          </li>
        ))}
      </ol>
      <p className="note">The person you choose has 24 hours to accept, and is held for you meanwhile. If they decline or don't reply, Autofill invites matching professionals near your event and you choose from those who are available. If we can't fill your shift, you get your money back.</p>
    </section>
  );
}



/* Terms shown the way the terms sheet shows them, but not editable. */
function TermsRead11({ open, onClose, title, intro, terms, docs = [] }) {
  return (
    <Sheet open={open} onClose={onClose} title={title} center>
      {intro && <p className="ff-fp" style={{ margin: "0 0 10px" }}>{intro}</p>}
      <div className="ff-tc5 ro">
        {terms.map((t, i) => (
          <div key={t.k || i} className="t"><span><b>{i + 1}</b>{t.label}</span><p>{t.text}</p></div>
        ))}
      </div>
      {docs.length > 0 && <ul className="ff-tc5-docs">{docs.map(d => <li key={d.id}><I11.FileText size={14} /><span>{d.name}</span></li>)}</ul>}
    </Sheet>
  );
}


/* Under the event invoice: your terms with your staff. Review is read only; Edit saves to your company profile. */
function TermsBtns11() {
  const { state } = useStore();
  const c = state.company || {};
  const [view, setView] = useState(false);
  const [edit, setEdit] = useState(false);
  return (
    <div className="ff-tcbtns">
      <button type="button" className="ff-tcbox" onClick={() => setView(true)}>
        <span className="ic"><I11.FileText size={15} /></span><span className="tx"><b>Review T&amp;Cs</b></span><I11.ChevronRight size={18} />
      </button>
      <button type="button" className="ff-tcbox" onClick={() => setEdit(true)}>
        <span className="ic"><I11.Pencil size={15} /></span><span className="tx"><b>Edit T&amp;Cs</b></span><I11.ChevronRight size={18} />
      </button>
      <TermsRead11 open={view} onClose={() => setView(false)} title="Terms and conditions" intro="These terms go with every Service Card." terms={termsOf(c)} docs={c.tcDocs || []} />
      <TermsSheet11 open={edit} onClose={() => setEdit(false)} />
    </div>
  );
}



/* FireFlair's terms, in full, from the FF invoice. The same layout as your own terms, not editable. */
const FFT_TERMS11 = [
  { k: "fee", label: "The connection fee", text: "You pay FireFlair a connection fee for each Shift card a staff member accepts." },
  { k: "covers", label: "What the fee covers", text: "Finding and booking your staff, and sending each Shift card on WhatsApp. On Bronze it is charged per fulfilled Shift card; Silver and Gold packages include unlimited Shift cards." },
  { k: "pay", label: "Pay for each shift", text: "Pay for each shift is agreed between you and your staff in your own terms and conditions, and paid to them directly. FireFlair does not take a share of it." },
  { k: "beta", label: "Beta", text: "No payment is taken while FireFlair is in beta. Bookings are confirmed without payment, and you will be told before payment starts." },
];


function FFTerms11({ open, onClose }) {
  return <TermsRead11 open={open} onClose={onClose} title="FireFlair terms and conditions" intro="These are FireFlair's terms for using FF Staff." terms={FFT_TERMS11} />;
}



/* ---- Confirm: review your order ------------------------------------------------------- */
/* The invoice and event guide: one document with everything about the booking. */
function GuideSec({ title, children }) { return <section className="gs"><h4>{title}</h4>{children}</section>; }


/* Pending, confirmed or unavailable, for each person on a Shift card. */
const bst11 = (e) => !e ? null : DONE.includes(e.state) ? ["ok", "Confirmed"] : (!LIVE.includes(e.state) || e.filled) ? ["bad", "Unavailable"] : ["warn", "Pending"];


function EventGuide({ ev, shifts, billTo, stamp, viewer }) {
  const { state } = useStore();
  const sv = svcWords(state);
  const all = useDirectory();
  const c = state.company || {};
  const fee = shifts.length * BOOKING_FEE;
  const allSvc = sv.party && (shifts.length === 0 || shifts.every(x => x.svcId));
  const fromAny = shifts.some(x => x.svcId && /from/i.test(x.svcPrice || ""));
  const svcSum = shifts.reduce((n, x) => n + (x.svcId ? numOf(x.svcPrice) : BOOKING_FEE), 0);
  const rq17 = (state.req17 || {})[ev.id] || {};
  const tip17 = sv.party ? numOf(rq17.tip) : 0, disc17 = sv.party && rq17.disc !== true ? numOf(rq17.disc) : 0, dReq17 = sv.party && rq17.disc === true;
  const cks17 = sv.party ? cocktailLines17(state, ev.id) : [];
  const no = "FF-" + (String(ev.id || "").replace(/\D/g, "").slice(-5) || "00001");
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const questions = (c.questions || []).filter(q => (ev.questionIds || []).includes(q.id));
  const docs = typeof companyDocs === "function" ? companyDocs(c) : [];
  const contact = contactOf11(state, ev);
  const times = [];
  if (startOf(ev)) times.push([startOf(ev), "Event starts"]);
  shifts.forEach(sh => { const [a, b] = splitTime(sh.time || ""); if (a) times.push([a, `${sh.role}: arrive and start`]); if (b) times.push([b, `${sh.role}: finish`]); });
  times.sort((x, y) => x[0].localeCompare(y[0]));
  const who = (sh) => staffOf(sh).map(pid => { const p = findPerson(all, state, pid); const e = engFor(state, sh.id, pid); return { p, e }; }).filter(x => x.p);
  const pro = viewer === "pro";
  const whoAll = (sh) => [...new Set([...staffOf(sh), ...state.engagements.filter(x => x.shiftId === sh.id && x.staffId).map(x => x.staffId)])].map(pid => { const p = findPerson(all, state, pid); const e = engFor(state, sh.id, pid); return { p, e }; }).filter(x => x.p);
  return (<>
    <div className="ff-inv guide" role="group" aria-label="Event brief">
      <div className="top"><div><b>Event brief</b><small>{no} · {today}</small></div><span className="stamp">{stamp}</span><span className="coin"><Coin size={30} tier="gold" /></span></div>

      <GuideSec title="The event">
        <dl className="meta">
          <div><dt>Event</dt><dd>{eventTitle(ev)}</dd></div>
          {ev.kind && <div><dt>Type</dt><dd>{ev.kind}</dd></div>}
          <div><dt>Date</dt><dd>{ev.iso ? longDay(ev.iso) : "To confirm"}</dd></div>
          {startOf(ev) && <div><dt>Starts</dt><dd>{startOf(ev)}</dd></div>}
          <div><dt>Location</dt><dd>{ev.venue || "To confirm"}</dd></div>
          {ev.guests && <div><dt>Guests</dt><dd>{ev.guests}</dd></div>}
        </dl>
        {ev.details && <div className="det"><span>Event brief</span><p>{ev.details}</p></div>}
        {sv.party && rq17.ask && <div className="det"><span>Special requests</span><p>{rq17.ask}</p></div>}
      </GuideSec>

      {sv.party && ((state.xa17 || {})[ev.id] || []).length > 0 && (
        <GuideSec title="Add-ons">
          <ul className="ff-xa17">{((state.xa17 || {})[ev.id] || []).map(id => { const a = ALLAX17.find(y => y.id === id); return a && <li key={id}><b>{a.title}</b> {a.tagline}</li>; })}</ul>
        </GuideSec>
      )}

      {times.length > 0 && (
        <GuideSec title="Timings">
          <ul className="tl">{times.map(([t, l], i) => <li key={i}><b>{t}</b><span>{l}</span></li>)}</ul>
        </GuideSec>
      )}

      <GuideSec title={sv.Ts}>
        {shifts.map((sh, i) => {
          const [a, b] = splitTime(sh.time || ""); const h = shiftHours(sh); const w = who(sh);
          return (
            <div key={sh.id} className="svc">
              <div className="t"><b>{i + 1}. {sh.role}</b></div>
              <dl className="meta">
                <div><dt>Time</dt><dd>{a || startOf(ev) || "To confirm"}{b ? ` to ${b}` : ""}{h ? ` (${hrsText(h)})` : ""}</dd></div>
                {sh.dress && <div><dt>Uniform</dt><dd>{sh.dress}</dd></div>}
                <div><dt>{sh.svcId ? "Price" : "Pay"}</dt><dd>{sh.svcId ? sh.svcPrice : (sh.total ? `£${sh.total}` : (sh.pay || "Not set"))}{!sh.svcId && sh.rate ? ` (£${sh.rate} an hour)` : ""}</dd></div>
                {sh.notes && <div><dt>Extra details</dt><dd>{sh.notes}</dd></div>}
                {!pro && <div><dt>Staff</dt><dd>{whoAll(sh).length ? <ul className="ff-bst11">{whoAll(sh).map(x => { const b = bst11(x.e); return <li key={x.p.id}><span>{x.p.name}</span>{b && <b className={b[0]}>{b[1]}</b>}</li>; })}</ul> : sh.route === "auto" ? "Autofill. We invite matching professionals and you choose" : "Not chosen yet"}{w.length > 1 ? ". The first to accept gets it." : ""}</dd></div>}
              </dl>
            </div>
          );
        })}
      </GuideSec>

      {allSvc ? (
        <GuideSec title="Your services">
          <table>
            <thead><tr><th>Service</th><th>Duration</th><th>Price</th></tr></thead>
            <tbody>{shifts.map(sh => <tr key={sh.id}><td><b>{sh.role}</b></td><td>{sh.svcTime || "–"}</td><td>{sh.svcPrice || "–"}</td></tr>)}</tbody>
            <tfoot>
              {(tip17 > 0 || disc17 > 0 || dReq17) && <tr><td colSpan={2}>Services</td><td>{fromAny ? "From " : ""}£{svcSum}</td></tr>}
              {tip17 > 0 && <tr><td colSpan={2}>Tip</td><td>£{tip17}</td></tr>}
              {disc17 > 0 && <tr><td colSpan={2}>Charitable discount requested</td><td>-£{disc17}</td></tr>}
              {dReq17 && <tr><td colSpan={2}>Charitable discount requested</td><td>Yes</td></tr>}
              <tr><td colSpan={2}>Total</td><td>{fromAny ? "From " : ""}£{Math.max(0, svcSum + tip17 - disc17)}</td></tr>
            </tfoot>
          </table>
          <p className="fine">Prices are set by FireFlair. Payment terms are in the terms and conditions.</p>
        </GuideSec>
      ) : pro ? null : (<>
      <GuideSec title="Pay summary">
        <table>
          <thead><tr><th>{sv.party ? "Service Card" : "Shift"}</th><th>Staff</th><th>Hours</th><th>Agreed pay</th></tr></thead>
          <tbody>{shifts.map((sh, i) => { const h = shiftHours(sh); const w = who(sh); return (
            <tr key={sh.id}><td><b>{i + 1}. {sh.role}</b></td><td>{w.length ? w.map(x => firstName(x.p.name)).join(", ") : "–"}</td><td>{h ? hrsText(h) : "–"}{sh.rate ? <><br /><small>£{sh.rate}/hr</small></> : null}</td><td>{numOf(sh.total) ? `£${moneyOf(numOf(sh.total))}` : "–"}</td></tr>); })}</tbody>
          {shifts.some(sh => numOf(sh.total)) && <tfoot><tr><td colSpan={3}>To your staff</td><td>£{moneyOf(shifts.reduce((n, sh) => n + numOf(sh.total) * Math.max(1, Math.min(qtyOf(sh), staffOf(sh).length || 1)), 0))}</td></tr></tfoot>}
        </table>
        <p className="fine">Agreed between you and each staff member, and paid to them directly. FireFlair does not take a share.</p>
      </GuideSec>

      </>)}

      {cks17.length > 0 && (
        <GuideSec title="Your cocktails">
          {cks17.map(({ c, qty }) => (
            <div key={c.id} className="svc ck">
              <div className="t"><b>{c.name}</b><span>{qty} servings</span></div>
              <table>
                <thead><tr><th>Ingredient</th><th>One serving</th><th>For {qty}</th></tr></thead>
                <tbody>{(c.ings || []).filter(i => String(i.name).trim()).map(i => <tr key={i.id}><td>{i.name}</td><td>{i.amt ? `${i.amt} ${i.unit || "ml"}` : "–"}</td><td>{scaleAmt17(i, qty)}</td></tr>)}</tbody>
              </table>
            </div>))}
          <p className="fine">{cks17.reduce((n, x) => n + x.qty, 0)} servings across {cks17.length} {cks17.length === 1 ? "drink" : "drinks"}. Quantities are worked out from the number of servings you chose.</p>
        </GuideSec>)}

      {!pro && <GuideSec title={allSvc ? "Terms and conditions" : "Terms between you and your staff"}>
        <ul className="plain">
          <li>Your terms and conditions ({termsOf(c).length} terms) go with every {sv.each}.</li>
          {(c.tcDocs || []).map(d => <li key={d.id}>Document: {d.name}</li>)}
          {questions.map(q => <li key={q.id}>Question: {q.text || q.title || q.label}</li>)}
          {docs.map((d, i) => <li key={i}>Document: {d.name || d.title || "Document"}</li>)}
        </ul>
      </GuideSec>}

      {!viewer && <GuideSec title="How it works">
        <ul className="plain">
          <li>Each person gets their {sv.lc} as an availability request on WhatsApp.</li>
          <li>When {sv.goes} to more than one person, the first people to accept get the places.</li>
          <li>You're told when everything is confirmed.</li>
          <li>This event brief is sent to you on WhatsApp and by email once your booking is confirmed.</li>
          {sv.party && stamp === "Preview" && <li>This is a preview. As soon as your selected professional confirms, we deliver the full and final event brief, confirming your event.</li>}
        </ul>
      </GuideSec>}
    </div>
    {!viewer && sv.party && stamp === "Preview" && <TipRequest17 ev={ev} attach />}
    {!viewer && !allSvc && <TermsBtns11 />}
    {!viewer && !allSvc && <FFInvoice11 shifts={shifts} no={no} today={today} contact={contact} />}
    </>
  );
}



/* FireFlair's own invoice: the connection fee only. Pay for the shifts is between you and your staff. */
function FFInvoice11({ shifts, no, today, contact }) {
  const [terms, setTerms] = useState(false);
  const { state } = useStore();
  const party = svcWords(state).party;
  const n = shifts.length;
  const total = party ? POLICY17.feeParty : n * BOOKING_FEE;
  return (
    <div className="ff-inv ffi" role="group" aria-label="FF invoice">
      <div className="top"><div><b>FF invoice</b><small>{no}-FF · {today}</small></div><span className="coin"><Coin size={30} tier="gold" /></span></div>
      <GuideSec title="Billed to"><div className="ff-bill17"><BillName11 /><BillPhone11 /><BillEmail11 /></div></GuideSec>
      <GuideSec title={party ? "FireFlair booking charge" : "Bronze · pay per shift"}>
        <table>
          <tbody><tr><td>{party ? "Event Card booking · 1 × £" + POLICY17.feeParty : `Fulfilled Shift cards · ${n} × £${BOOKING_FEE}`}</td><td>£{total}</td></tr></tbody>
          <tfoot><tr><td>Total cost</td><td>£{total}</td></tr></tfoot>
        </table>
        {party && <p className="fine">Your staff are paid separately, as set out in your Pay summary. This charge is not added to their pay.</p>}
      </GuideSec>
      <button type="button" className="ff-tcbox" onClick={() => setTerms(true)}>
        <span className="ic"><I11.FileText size={15} /></span>
        <span className="tx"><b>Review T&amp;Cs</b><small>Beta: no payment taken</small></span>
        <I11.ChevronRight size={18} />
      </button>
      <FFTerms11 open={terms} onClose={() => setTerms(false)} />
    </div>
  );
}



/* Business packages: Bronze, Silver, Gold. How paying FireFlair works on FF Staff. */
function Plans11() {
  const { state, dispatch } = useStore();
  const want = state.planInterest || [];
  const plans = [
    { k: "bronze", t: "Bronze", p: `£${BOOKING_FEE}`, per: "per fulfilled Shift card", perks: ["Pay as you go", "Company Card", "Custom Service Cards"] },
    { k: "silver", t: "Silver", p: "£50", per: "per month", perks: ["Unlimited Shift cards", "Priority staff matching", "Featured Company Card"], soon: true },
    { k: "gold", t: "Gold", p: "", per: "For our most valuable users", perks: ["Unlimited Shift cards", "Shareholder privileges", "Dedicated account manager"], soon: true },
  ];
  const reg = (x) => { if (want.includes(x.k)) return; dispatch({ type: "V11_SET", patch: { planInterest: [...want, x.k] } }); dispatch({ type: "TOAST", toast: `Thanks. We'll be in touch about ${x.t}` }); };
  return (
    <section className="ff-plans11" aria-labelledby="ff-plans11-h">
      <span className="coin"><Coin size={30} tier="gold" /></span>
      <h3 id="ff-plans11-h">Business packages</h3>
      <p>Pay per fulfilled Shift card, or one package for unlimited Shift cards.</p>
      <div className="row">
        {plans.map(x => (
          <div key={x.k} className={`pl ${x.k}${x.soon ? " soon" : " on"}`}>
            <span className="cn"><Coin size={22} tier={x.k} flat /></span>
            <b>{x.t}</b>
            {x.p ? <span className="pr">{x.p}</span> : null}<small className="per">{x.per}</small>
            <ul>{x.perks.map(t => <li key={t}>{t}</li>)}</ul>
            {x.soon && <span className="soonl">Coming 2027</span>}
            {x.soon && <button type="button" className="ri" aria-pressed={want.includes(x.k)} onClick={() => reg(x)}>{want.includes(x.k) ? <><I11.Check size={13} strokeWidth={3} /> Registered</> : "Register interest"}</button>}
          </div>
        ))}
      </div>
    </section>
  );
}



/* After Confirm booking: create a Company Card, so the people you hire know who you are. */
function CardPrompt11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [open, setOpen] = useState(false);
  if (c.cardSavedAt) return null;
  const party = svcWords(state).party;
  const save = () => {
    dispatch({ type: "COMPANY_SAVE", company: { cardSavedAt: Date.now(), phone: c.phone || state.bookPhone || "", email: c.email || state.bookEmail || "", name: c.name || state.bookName || "" } });
    dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0);
  };
  return (
    <div className="ff-hc17 ff-cardprompt">
      <button type="button" className="h" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span className="cn"><Coin size={34} tier="gold" /></span>
        <span className="t"><b>{party ? "Create your VIP Host Card" : "Create your Company Card"}</b><small>{party ? "We recommend you create a VIP Host Card, so we can share your details with the people you're booking." : "We recommend you create a Company Card, so we can share your company's details with the people you're hiring."}</small></span>
        <I11.ChevronDown size={18} className="cv" />
      </button>
      {open && <div className="b">{party ? <PartyCard11 edit /> : <EditableCompanyCard plain />}
        <Btn variant="primary" onClick={save}><I11.Check size={14} /> Save</Btn></div>}
    </div>
  );
}



function ConfirmPanel({ ev, shifts, missing, fix, onClose }) {
  const { state, dispatch } = useStore();
  const sv = svcWords(state);
  const all = useDirectory();
  const c = state.company || {};
  const questions = (c.questions || []).filter(q => (ev.questionIds || []).includes(q.id));
  const name = (pid) => (findPerson(all, state, pid) || {}).name || "Someone";
  const live = (sh, pid) => { const e = engFor(state, sh.id, pid); return e && LIVE.includes(e.state) ? e : null; };
  const nSend0 = shifts.reduce((n, sh) => n + staffOf(sh).filter(pid => !live(sh, pid) && !(engFor(state, sh.id, pid) || {}).exclusive).length, 0);
  const nAuto = shifts.filter(sh => sh.route === "auto" && !(state.af17 || {})[sh.id]).length;
  const nSend = nSend0 + nAuto;
  const fee17 = sv.party ? POLICY17.feeParty : shifts.length * BOOKING_FEE;
  const rows = shifts.map(sh => ({ sh, es: state.engagements.filter(e => e.shiftId === sh.id && !e.auto && (LIVE.includes(e.state) || e.filled)) }));
  const anySent = rows.some(r => r.es.length) || paid17(state, ev.id);
  const open = shifts.reduce((n, sh) => n + Math.max(0, qtyOf(sh) - state.engagements.filter(e => e.shiftId === sh.id && DONE.includes(e.state)).length), 0);
  const allDone = anySent && !nSend && open === 0;
  const [stripe, setStripe] = useState(false);
  const send = () => {
    if (missing.length) { dispatch({ type: "TOAST", toast: missing[0].t }); missing[0].go(); return; }
    if (!nSend) return;
    setStripe(true); /* Stripe pay window; the requests go out only once it reports paid */
  };
  const afterPay = () => {
    setStripe(false);
    dispatch({ type: "BOOK_SEND", eventId: ev.id, questions: questions.map(q => q.id) });
    dispatch({ type: "TOAST", toast: `Booking confirmed. Availability requests sent to ${nSend} ${nSend === 1 ? "person" : "people"} on WhatsApp` });
  };
  return (
    <div className="ff-cpanel" id="ff-bs-confirm-open">
      {!anySent && (<>
        <h3 className="ff-fh">Review your order</h3>
        <p className="ff-fp">Check it over. When you confirm, each person gets their {sv.lc} as an availability request on WhatsApp.</p>
        <EventGuide ev={ev} shifts={shifts} stamp="Preview" />
        {sv.party ? (<>
          <div className="ff-cb17-ph"><Field label="Your phone number"><input className="ff-input" type="tel" autoComplete="tel" placeholder="+44 7700 900000" value={state.bookPhone || ""} onChange={(e) => dispatch({ type: "V11_SET", patch: { bookPhone: e.target.value } })} /></Field></div>
          <ConfirmSpin17 lines={["Confirm", "booking"]} disabled={!missing.length && !nSend} onClick={send} />
        </>) : (<>
        <ConfirmSpin17 lines={["Confirm"]} label="Confirm booking" disabled={!missing.length && !nSend} onClick={send} />
        </>)}
        {stripe && <StripePay17 total={fee17} reference={ev.id} payLabel="Pay and confirm" onClose={() => setStripe(false)} onPaid={afterPay} />}
      </>)}
      {anySent && (<>
        <h3 className="ff-fh">{allDone ? "Everything's confirmed" : "Sent. Waiting for replies"}</h3>
        <p className="ff-fp">{allDone ? "Everyone has said yes. We've let you know on WhatsApp." : "Availability requests are out on WhatsApp. We'll tell you the moment everything is confirmed."}</p>
        <div className="ff-sum">
          <div className="ff-sum-ev"><I11.MapPin size={14} /><b>{ev.venue || "Location to confirm"}</b><span>{ev.iso ? shortDay(ev.iso) : "Date to confirm"}{startOf(ev) ? ` · ${startOf(ev)}` : ""}</span></div>
          {rows.map(({ sh, es }) => (
            <div key={sh.id} className="ff-sum-sh">
              <div className="top"><b>{sh.role}</b><span className="pay">{got17(state, sh)} of {qtyOf(sh)} confirmed</span></div>
              {qtyOf(sh) < staffOf(sh).length && <small>First {qtyOf(sh)} to accept get it</small>}
              <ul className="ff-replies">{es.map(e => (
                <li key={e.id}><Portrait src={(findPerson(all, state, e.staffId) || {}).photo} name={name(e.staffId)} size={26} /><span><b>{name(e.staffId)}</b></span>
                  <span className={`ff-pill ${e.filled ? "" : ENG_TONE[e.state]}`}>{engText(e)}</span>
                  {e.state === "requested" && <button type="button" className="ff-acc" onClick={() => dispatch({ type: "OFFER_ACCEPT", id: e.id })}>{firstName(name(e.staffId))} accepts</button>}</li>
              ))}</ul>
              <AutoPanel17 sh={sh} ev={ev} />
            </div>
          ))}
        </div>
        {nSend > 0 && <Btn variant="primary wide" onClick={send}><WhatsAppIcon size={15} /> Send to {nSend} more</Btn>}
        <details className="ff-gdet"><summary>View the invoice and event guide</summary>
          <EventGuide ev={ev} shifts={shifts} stamp="Sent" /></details>
        <p className="ff-co11out-note">Your invoice goes to you on WhatsApp and by email.</p>
        {!sv.party && !(state.auth && state.auth.status === "signedIn" && c.joinedAt) && <CardPrompt11 />}
      </>)}
    </div>
  );
}



/* ---- Tell us about your event: reads the simple details out of what you type or say ----
   Prototype: there is no AI model behind this yet. It picks out dates, times, numbers,
   a place and job roles. The real version will be FireFlair, and the same cards will be
   open to other assistants through an API. */
const MONTHS3 = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];


const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];


const NUMW = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };


const ROLE_WORDS = [["silver service waiter", "Silver Service Waiter"], ["cocktail bartender", "Cocktail Bartender"], ["flair bartender", "Flair Bartender"], ["bar manager", "Bar Manager"], ["event manager", "Event Manager"],
  ["photographer", "Photographer"], ["mixologist", "Mixologist"], ["bartender", "Bartender"], ["bar staff", "Bartender"], ["barback", "Barback"], ["waitress", "Waiter"], ["waiter", "Waiter"], ["event host", "Event Host"], ["host", "Event Host"], ["chef", "Chef"], ["dj", "DJ"]];


const pad2 = (n) => String(n).padStart(2, "0");


const isoOf = (y, m, d) => `${y}-${pad2(m)}-${pad2(d)}`;


function clock(h, mi, ap) {
  h = +h; mi = +(mi || 0);
  if (ap === "pm" && h < 12) h += 12; if (ap === "am" && h === 12) h = 0;
  return h > 23 || mi > 59 ? "" : `${pad2(h)}:${pad2(mi)}`;
}


function parseBooking(text) {
  const raw = String(text || "").replace(/\s+/g, " ").trim(), low = raw.toLowerCase();
  const out = { event: {}, shifts: [] };
  const ty = [["wedding", "Wedding"], ["birthday", "Birthday"], ["christmas", "Christmas party"], ["corporate", "Corporate event"], ["brand launch", "Brand launch"], ["launch", "Brand launch"], ["festival", "Festival"], ["private party", "Private party"], ["party", "Private party"]].find(([k]) => low.includes(k));
  if (ty) out.event.kind = ty[1];
  const g = low.match(/(\d{1,5})\s*(?:guests|people|pax|attendees|covers)/); if (g) out.event.guests = g[1];
  // date
  const ty0 = +TODAY_ISO.slice(0, 4);
  let m, iso = "";
  if ((m = low.match(/\b(20\d\d)-(\d{2})-(\d{2})\b/))) iso = m[0];
  else if ((m = low.match(new RegExp(`\\b(\\d{1,2})(?:st|nd|rd|th)?\\s*(?:of\\s+)?(${MONTHS3.join("|")})[a-z]*(?:\\s+(20\\d\\d))?`)))) iso = isoOf(m[3] || ty0, MONTHS3.indexOf(m[2]) + 1, +m[1]);
  else if ((m = low.match(new RegExp(`\\b(${MONTHS3.join("|")})[a-z]*\\s+(\\d{1,2})(?:st|nd|rd|th)?\\b(?:,?\\s+(20\\d\\d))?`)))) iso = isoOf(m[3] || ty0, MONTHS3.indexOf(m[1]) + 1, +m[2]);
  else if (/\btomorrow\b/.test(low)) { const d = new Date(TODAY_ISO + "T12:00:00"); d.setDate(d.getDate() + 1); iso = isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate()); }
  else if ((m = low.match(new RegExp(`\\b(next|this)?\\s*(${WEEKDAYS.join("|")})\\b`)))) {
    const d = new Date(TODAY_ISO + "T12:00:00"); let diff = (WEEKDAYS.indexOf(m[2]) - d.getDay() + 7) % 7 || 7; if (m[1] === "next" && diff < 7) diff += 7;
    d.setDate(d.getDate() + diff); iso = isoOf(d.getFullYear(), d.getMonth() + 1, d.getDate());
  }
  if (iso && !(m && m[0].match(/20\d\d/)) && iso < TODAY_ISO) iso = iso.replace(/^\d{4}/, String(ty0 + 1));
  if (iso && dayOf(iso)) out.event.iso = iso;
  // times
  const T = "(?:\\d{1,2}(?::\\d{2})?\\s*(?:am|pm)|\\d{1,2}:\\d{2}|midnight|noon)";
  const conv = (t, inherit) => { t = t.trim(); if (t === "midnight") return "00:00"; if (t === "noon") return "12:00"; const q = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/); return q ? clock(q[1], q[2], q[3] || inherit) : ""; };
  let start = "", finish = "";
  const r1 = low.match(new RegExp(`(\\d{1,2}(?::\\d{2})?)\\s*(am|pm)?\\s*(?:to|until|till|-|–)\\s*(${T})`));
  if (r1) { const endAp = (r1[3].match(/(am|pm)$/) || [])[1]; start = conv(r1[1] + (r1[2] ? " " + r1[2] : ""), r1[2] ? "" : endAp); finish = conv(r1[3]); }
  else { const r2 = low.match(new RegExp(`(?:at|from|starting|starts|start at)\\s+(${T})`)); if (r2) start = conv(r2[1]); }
  if (start) out.event.start = start;
  // place
  const mons = [...MONTHS3, ...WEEKDAYS];
  for (const v of raw.matchAll(/\b(?:at|in)\s+((?:the\s+)?[A-Z][\w'&.-]*(?:\s+(?:of\s+|&\s+)?[A-Z][\w'&.-]*){0,5}(?:,\s*[A-Z][\w'&.-]*(?:\s+[A-Z][\w'&.-]*){0,2})?)/g)) {
    const first = v[1].replace(/^the\s+/i, "").split(/[\s,]/)[0].toLowerCase();
    if (mons.some(x => first.startsWith(x.slice(0, 3)) && (first === x || first.startsWith(x)))) continue;
    out.event.venue = v[1].trim(); break;
  }
  // roles
  const dress = (low.match(/\b(all black|black tie|smart casual|smart|black and white)\b/) || [])[1] || "";
  const rate = (low.match(/£\s?(\d+(?:\.\d{1,2})?)\s*(?:an hour|per hour|\/\s?h(?:ou)?r|ph|hourly)/) || [])[1] || "";
  const per = (low.match(/£\s?(\d+(?:\.\d{1,2})?)\s*(?:per shift|a shift|each|per person)/) || [])[1] || "";
  const hrs = hoursBetween(start, finish);
  let work = low; const found = {};
  ROLE_WORDS.forEach(([k, name]) => {
    work = work.replace(new RegExp(`(?:\\b(\\d{1,2}|a|an|one|two|three|four|five|six|seven|eight|nine|ten)\\s+(?:x\\s*)?)?\\b${k}(?:s|es)?\\b`, "g"), (all, n) => { found[name] = (found[name] || 0) + (n ? (NUMW[n] || +n || 1) : 1); return " "; });
  });
  out.shifts = Object.entries(found).map(([role, qty]) => ({ role, qty, start, finish, dress, rate: rate || (per && hrs ? moneyOf(+per / hrs) : ""), total: per || (rate && hrs ? moneyOf(+rate * hrs) : "") }));
  return out;
}


function aiSummary(r, sv) {
  const n = r.shifts.reduce((t, x) => t + (x.qty || 1), 0);
  const got = [Object.keys(r.event).length ? "your Event Card" : "", n ? sv.n(n) : ""].filter(Boolean);
  return got.length ? `Filled in ${got.join(" and ")}. Check them and change anything.` : "Couldn't find a date, place or job roles. Add a few more details.";
}



/* ---- Guide: the FF button on FF Staff and FF Party ------------------------------------ */
function StaffGuideSheet({ open, onClose, bare }) {
  const { state, dispatch } = useStore();
  if (!open) return null;
  const ev = state.events.find(e => e.id === state.activeEventId && !isPast(e.iso)) || null;
  const info = flowInfo(state, ev);
  const sv = svcWords(state);
  const sEvent = { k: "event", t: "Create your Event Card", d: "Where and when. Just a location and a date.", done: info.has1 };
  const sStaff = sv.party
    ? { k: "staff", t: "Choose your staff", d: `Our recommendations, search or your favourites. Add them to a ${sv.T}.`, done: info.has3 }
    : { k: "staff", t: "Choose your staff", d: "Pick the roles you need, then your team, our recommendations or search.", done: info.has3 };
  const sShift = sv.party
    ? { k: "shift", t: "Choose your Service Cards", d: "Pick the FireFlair services you want. They start at your Event Card time.", done: info.has2 }
    : { k: "shift", t: "Add the shift details", d: "Times, pay and terms for each person.", done: info.has2 };
  const steps = [sEvent, ...(sv.party ? [sShift, sStaff] : [sStaff, sShift]), { k: "confirm", t: "Confirm", d: "Review your order, then send it out on WhatsApp.", done: info.sent }];
  const next = steps.find(x => !x.done);
  const go = (k) => {
    dispatch({ type: "V11_SET", patch: { bkView: ev ? { eventId: ev.id } : {} } }); dispatch({ type: "TAB", tab: "bookings" });
    onClose(); window.scrollTo(0, 0);
    setTimeout(() => window.dispatchEvent(new CustomEvent("ff-bk-open", { detail: k })), 400);
  };
  const faq = [
    ["How does first come, first served work?", `Put as many people as you like on one ${sv.party ? "Service Card" : "role"}. They all get it on WhatsApp, and the first to accept gets the shift. Everyone else is told it's filled.`],
    ["What happens when I confirm?", `Each person gets their ${sv.lc} as an availability request on WhatsApp. You're told when everything is confirmed, and we send you the invoice and event guide.`],
    ["Do I pay?", "Not in the beta. Once payment is live, the requests go out after payment is taken. Pro businesses will be able to book free."],
    ["Can I change a card after sending?", "Yes. Open it from Bookings and make the change. The people on it are told on WhatsApp."],
  ];
  const body = (<>
      {next ? (
        <button type="button" className="ff-guide-next" onClick={() => go(next.k)}>
          <span className="n">{steps.indexOf(next) + 1}</span><span className="tx"><small>Next</small><b>{next.t}</b><span>{next.d}</span></span><I11.ArrowRight size={18} />
        </button>
      ) : <p className="ff-co11out-ok"><I11.Check size={15} strokeWidth={2.6} /> Everything's done for this booking. Replies show on Bookings.</p>}
      <ol className="ff-guide-steps">
        {steps.map((x, i) => x === next ? null : <li key={x.k} className={x.done ? "done" : ""}><button type="button" onClick={() => go(x.k)}><span className="n">{x.done ? <I11.Check size={13} strokeWidth={3} /> : i + 1}</span><span className="tx"><b>{x.t}</b><small>{x.d}</small></span></button></li>)}
      </ol>
      <Btn variant="wide" onClick={() => go("ai")}><I11.Sparkles size={14} /> Tell FireFlair about your event</Btn>
      <div className="ff-label" style={{ margin: "16px 0 6px" }}>How it works</div>
      {faq.map(([q, a]) => <details key={q} className="ff-gdet faq"><summary>{q}</summary><p>{a}</p></details>)}
  </>);
  return bare ? body : <Sheet open onClose={onClose} title="Your next step">{body}</Sheet>;
}



function BookingAI({ onFill, note, onClear }) {
  const [q, setQ] = useState("");
  return (
    <div className="ff-bkai">
      <FFAI bare compact multiline tint context="FF Staff" title="Tell us about your event" placeholder="Paste in the details, or tell us what you're looking for, and we'll fill everything in."
        query={q} onQuery={setQ} submitLabel="Fill in my cards" onSubmit={(v) => { onFill(v); setQ(""); }}>
        {note && <p className="ff-bkai-note"><I11.Check size={13} /> <span>{note}</span><button type="button" onClick={onClear} aria-label="Dismiss"><I11.X size={12} /></button></p>}
      </FFAI>
    </div>
  );
}



/* ---- FF Party: the FireFlair Service Cards (the ones listed on the FF Team home page), bookable. ----
   The set price and what's included can't be changed. The start time comes from the Event Card. */
const SVC_ROLE = { svc_bartending: "Bartender", svc_mixology: "Cocktail Bartender", svc_masterclass: "Mixologist", svc_flair: "Bartender", svc_full: "Bartender", svc_staffing: "Event Staff" };


const addHours = (hhmm, h) => { const [a, b] = String(hhmm).split(":").map(Number); const m = (a * 60 + b + Math.round(h * 60)) % 1440; return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };


const svcHours = (svc) => { const m = String(svc.time || "").match(/\d+/); return m ? +m[0] : 3; };


const svcTimeFor = (svc, start) => start ? [start, addHours(start, svcHours(svc))].join(" — ") : "";


function ServicePosterBook11({ svc, sh, start, onBook, onRemove }) {
  return (
    <div className={`ff-svcp${sh ? " on" : ""}`}>
      <V101.PosterCard tone={svc.tone} ribbon={(svc.kind === "package" || svc.id !== "svc_staffing" ? "Package Card" : "Service Card")} eyebrow={[lvl17(svc.level), "FF Party"].filter(Boolean).join(" · ")} title={svc.title} tagline={svc.tagline} price={svc.price}
        rows={[
          { icon: <I11.Sparkles size={17} />, label: "Includes", value: svc.includes },
          { icon: <I11.Users size={17} />, label: "Ideal for", value: svc.ideal },
          { icon: <I11.Clock size={17} />, label: "Duration", value: svc.time, sub: start ? `Starts ${start}, from your Event Card` : "Starts at the time on your Event Card" },
        ]}
        footer={<>
          <span className="ff-poster-small m-0">FFParty.uk</span>
          {sh ? <button type="button" className="ff-svcbtn on" onClick={onRemove} aria-label={`${svc.title} booked. Remove`}><I11.Check size={12} strokeWidth={3} /> Booked · Remove</button>
            : <button type="button" className="ff-svcbtn" onClick={onBook} aria-label={`Book ${svc.title}`}>Book this</button>}
        </>} />
    </div>
  );
}



/* ---- The booking box ------------------------------------------------------------------- */
function BookingBox({ ev, setView, bkey }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const sv = svcWords(state), party = sv.party;
  const info = flowInfo(state, ev);
  const shifts = info.shifts;
  const [op, setOp] = useState(() => { const o = (state.bkView || {}).open; return o ? { [o]: true } : {}; });                   // event / staff / confirm: any mix can be open at once
  const setOpK = (k, v) => setOp(o => ({ ...o, [k]: v }));
  const [editShift, setEditShift] = useState(null);   // "new" | shift id | null
  const [draft, setDraft] = useState(() => eventDraft11(ev));
  const [slotId, setSlotId] = useState(null);         // the slot people are being added to
  const [bub, setBub] = useState(null);
  const contact = contactOf11(state, ev);               // the role card whose staff row or Shift card is open

  const newShift = (evId, extra) => ({ id: uid("shf"), eventId: evId, staffIds: [], staffId: "", skills: [], qty: 1, dress: "", notes: "", tcs: "company",
    rate: "", total: "", hoursM: "", pay: "", time: startOf(ev) || "", date: (ev && ev.date) || "", iso: (ev && ev.iso) || "", venue: (ev && ev.venue) || "", ...extra });
  const ensure = () => {
    if (ev) return ev.id;
    const id = uid("evt");
    dispatch({ type: "EVENT_ADD", event: { id, title: "", kind: "", iso: "", start: "", venue: "", guests: "", date: "", time: "", questionIds: [] } });
    dispatch({ type: "ACTIVE_EVENT", id });
    setView({ eventId: id, keep: bkey });
    return id;
  };
  const openEvent = () => { setDraft(eventDraft11(ev)); setOpK("event", true); focusSec("ff-bs-event"); };
  const saveEvent = () => {
    if (!draft.iso || !draft.venue.trim()) { dispatch({ type: "TOAST", toast: "Add the date and location" }); return; }
    const ci = cleanIso11(draft.iso);
    if (ci.past) { setDraft(d => ({ ...d, iso: ci.iso })); dispatch({ type: "TOAST", toast: "That date has already passed. Choose today or a later date" }); return; }
    const data = eventData11({ ...draft, iso: ci.iso });
    if (ev) {
      dispatch({ type: "EVENT_PATCH", id: ev.id, patch: data });
      shifts.forEach(sh => dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: { iso: data.iso, date: data.date, venue: data.venue, ...(sh.svcId ? { time: svcTimeFor({ time: sh.svcTime }, data.start) } : {}) } }));
    } else {
      const id = uid("evt");
      dispatch({ type: "EVENT_ADD", event: { id, ...data, phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } });
      dispatch({ type: "ACTIVE_EVENT", id }); setView({ eventId: id, keep: bkey });
    }
    dispatch({ type: "TOAST", toast: "Event Card saved" });
    setOpK("event", false);
  };
  const placeOn = (p, shId) => {
    const sh = shifts.find(x => x.id === shId);
    if (!sh) return;
    if (staffOf(sh).includes(p.id)) { dispatch({ type: "TOAST", toast: `${firstName(p.name)} is already on ${sh.role}` }); return; }
    dispatch({ type: "SHIFT_STAFF", id: sh.id, staffIds: [...staffOf(sh), p.id] });
    if (state.selection.includes(p.id)) dispatch({ type: "SELECT", id: p.id });
    dispatch({ type: "TOAST", toast: `${firstName(p.name)} added to ${sh.role}` });
  };
  const addPerson = (p) => {
    const target = shifts.find(x => x.id === slotId) || shifts.find(x => !staffPlanned(x)) || shifts[0];
    if (target) { placeOn(p, target.id); return; }
    if (!state.selection.includes(p.id)) dispatch({ type: "SELECT_ADD", id: p.id });
    dispatch({ type: "TOAST", toast: party ? `${firstName(p.name)} picked. Pick a ${sv.T}, then add them to it` : `${firstName(p.name)} picked. Tap a role, then add them to it` });
  };
  /* Staff step, FF Staff: tapping a role adds one person's worth of shift details, with the times and pay of the one before. */
  const addRole = (role) => {
    const evId = ensure();
    const prev = shifts[shifts.length - 1];
    const sh = newShift(evId, { role, ...(prev ? { time: prev.time || "", rate: prev.rate || "", total: prev.total || "", hoursM: prev.hoursM || "", pay: prev.pay || "" } : {}) });
    dispatch({ type: "SHIFT_ADD", shift: sh });
    setSlotId(sh.id);
    dispatch({ type: "TOAST", toast: `${role} added` });
  };
  const removeSlot = (sh) => { dispatch({ type: "SHIFT_DELETE", id: sh.id }); if (slotId === sh.id) setSlotId(null); dispatch({ type: "TOAST", toast: `${sh.role} removed` }); };
  /* FF Party: book one of the FireFlair Service Cards. The start time is the Event Card's. */
  const addService = (svc) => {
    const evId = ensure();
    const st = startOf(ev);
    dispatch({ type: "SHIFT_ADD", shift: newShift(evId, { role: svc.title, matchRole: SVC_ROLE[svc.id] || svc.title, svcId: svc.id, svcPrice: svc.price, svcTime: svc.time, svcLevel: svc.level, time: svcTimeFor(svc, st), pay: svc.price }) });
    dispatch({ type: "TOAST", toast: st ? `${svc.title} booked. It starts at ${st}` : `${svc.title} booked. Add the start time on your Event Card` });
  };
  const removeService = (sh) => { dispatch({ type: "SHIFT_DELETE", id: sh.id }); dispatch({ type: "TOAST", toast: `${sh.role} removed` }); };
  useEffect(() => {
    const h = (e) => { const { shiftId, personId } = e.detail || {}; const p = findPerson(all, state, personId); if (p) placeOn(p, shiftId); };
    window.addEventListener("ff-drop", h);
    return () => window.removeEventListener("ff-drop", h);
  });
  const fill = (text) => {
    const r = parseBooking(text);
    const base = eventDraft11(ev);
    const d = { ...base, ...Object.fromEntries(Object.entries(r.event).filter(([, v]) => v)) };
    if (d.iso && isPast(d.iso)) d.iso = base.iso;
    d.details = [base.details, text.trim()].filter(Boolean).join("\n\n");
    const data = eventData11(d);
    let id;
    if (ev) { id = ev.id; dispatch({ type: "EVENT_PATCH", id, patch: data }); shifts.filter(x => x.svcId && data.start).forEach(x => dispatch({ type: "SHIFT_PATCH", id: x.id, patch: { time: svcTimeFor({ time: x.svcTime }, data.start) } })); }
    else { id = uid("evt"); dispatch({ type: "EVENT_ADD", event: { id, ...data, phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } }); dispatch({ type: "ACTIVE_EVENT", id }); setView({ eventId: id, keep: bkey }); }
    r.shifts.forEach(x => {
      const have = shifts.filter(y => String(y.role).toLowerCase() === x.role.toLowerCase()).length;
      for (let i = have; i < (x.qty || 1); i++) dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: id, staffIds: [], staffId: "", skills: [], role: x.role, qty: 1,
        time: [x.start, x.finish].filter(Boolean).join(" — "), dress: x.dress || "", notes: "", tcs: "company", rate: x.rate, total: x.total, hoursM: "", pay: x.total ? `£${x.total}${x.rate ? ` (£${x.rate}/hr)` : ""}` : "", date: data.date, iso: data.iso, venue: data.venue } });
    });
    dispatch({ type: "V11_SET", patch: { aiNote: aiSummary(r, sv) } });
  };
  useEffect(() => {
    const h = (e) => {
      const k = e.detail;
      if (k === "event") openEvent();
      else if (k === "shift") goShift();
      else if (k === "staff") { setOpK("staff", true); focusSec("ff-bs-staff"); }
      else if (k === "confirm" && ev && shifts.length) { setOpK("confirm", true); focusSec("ff-bs-confirm"); }
      else if (k === "ai") { const t = document.querySelector(".ff-bbox .ff-ai-in"); if (t) { t.scrollIntoView({ behavior: "smooth", block: "center" }); t.focus(); } }
    };
    window.addEventListener("ff-bk-open", h);
    return () => window.removeEventListener("ff-bk-open", h);
  });
  const removeFrom = (sh, pid) => dispatch({ type: "SHIFT_STAFF", id: sh.id, staffIds: staffOf(sh).filter(x => x !== pid) });
  const goStaff = () => { setOpK("staff", true); focusSec("ff-bs-staff"); };
  /* Tapping a role card in the booking box: Shift details shows that card, and Staff shows people for that profession. */
  const gridEl = () => document.querySelector("#ff-bs-shift .ff-sfgrid");
  const showCard = (id) => setTimeout(() => {
    const g = gridEl(), w = id && document.getElementById(`ff-sf-${id}`);
    if (g && w) g.scrollTo({ left: w.offsetLeft - g.firstElementChild.offsetLeft, behavior: "smooth" });
  }, 70);
  const selectRole = (sh) => {
    if (!sh) { setBub({ none: true }); return; }
    setSlotId(sh.id); setBub({ id: sh.id }); setOp(o => ({ ...o, shift: true, staff: true })); showCard(sh.id);
  };
  const scrollT = useRef(null);
  const onGridScroll = (e) => {
    const g = e.currentTarget;
    clearTimeout(scrollT.current);
    scrollT.current = setTimeout(() => {
      const kids = [...g.children]; if (!kids.length) return;
      const x = g.scrollLeft, w = kids[0].offsetWidth || 1, step = kids.length > 1 ? (kids[1].offsetLeft - kids[0].offsetLeft) || w : w;
      const i = Math.max(0, Math.min(kids.length - 1, Math.round(x / step)));
      const sh = shifts[i];
      setBub(sh ? { id: sh.id } : { none: true });
      if (sh) { const rc = document.querySelector(`#ff-bs-basket [data-dropshift="${sh.id}"]`); if (rc) rc.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" }); }
    }, 120);
  };
  const goDetails = (sh) => { selectRole(sh); focusSec("ff-bs-shift"); };
  const goShift = (id) => {
    setOpK("shift", true); focusSec(id ? `ff-sf-${id}` : "ff-bs-shift");
  };
  /* One Shift card open at a time: a role card's Shift card closes the Shift details section. */
  const selSh = bub && bub.none ? null : ((bub && shifts.find(x => x.id === bub.id)) || shifts[0] || null);
  /* Arrow bubbles: the open Shift card points down at its role in the booking box; the staff box points up at it.
     While a new role is being added they point at the + tile. They are measured again whenever anything moves. */
  const arrowKey = `${selSh ? selSh.id : "new"}|${shifts.length}|${op.shift}|${op.staff}`;
  React.useLayoutEffect(() => {
    let raf = 0, alive = true;
    const sync = () => {
      if (!alive) return;
      const wraps = [...document.querySelectorAll("#ff-bs-shift .ff-sfwrap")];
      wraps.forEach(w => w.classList.remove("sel"));
      const sb = document.querySelector("#ff-bs-staff .ff-staffbub");
      if (sb) sb.classList.remove("pt");
      const rc = document.querySelector(selSh ? `#ff-bs-basket [data-dropshift="${selSh.id}"]` : "#ff-bs-basket .ff-mc.add");
      if (!rc) return;
      const r = rc.getBoundingClientRect(), cx = r.left + r.width / 2;
      const w = selSh ? document.getElementById(`ff-sf-${selSh.id}`) : wraps[wraps.length - 1];
      const put = (el, face, cls) => {
        if (!el || !face) return;
        const a = face.getBoundingClientRect();
        el.classList.add(cls); el.style.setProperty("--tx", `${Math.max(24, Math.min(a.width - 24, cx - a.left))}px`);
      };
      if (w) put(w, w.querySelector(".ff-sface") || w, "sel");
      const grid = document.querySelector("#ff-bs-shift .ff-sfgrid");
      if (grid && w) { const cs = getComputedStyle(grid); grid.style.height = `${Math.ceil(w.offsetHeight + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom))}px`; }
      if (sb) put(sb, sb, "pt");
    };
    const kick = () => { cancelAnimationFrame(raf); const t0 = performance.now(); const tick = () => { sync(); if (performance.now() - t0 < 900) raf = requestAnimationFrame(tick); }; tick(); };
    kick();
    const els = ["#ff-bs-basket .ff-mc-row", "#ff-bs-shift .ff-sfgrid"].map(q => document.querySelector(q)).filter(Boolean);
    els.forEach(e => e.addEventListener("scroll", sync));
    window.addEventListener("resize", kick);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(sync) : null;
    if (ro) { ["#ff-bs-basket", "#ff-bs-shift", "#ff-bs-staff"].forEach(q => { const e = document.querySelector(q); if (e) ro.observe(e); }); const cur = selSh ? document.getElementById(`ff-sf-${selSh.id}`) : [...document.querySelectorAll("#ff-bs-shift .ff-sfwrap")].pop(); if (cur) ro.observe(cur); }
    return () => { alive = false; cancelAnimationFrame(raf); els.forEach(e => e.removeEventListener("scroll", sync)); window.removeEventListener("resize", kick); if (ro) ro.disconnect(); };
  }, [arrowKey]);

  const staffN = new Set(shifts.flatMap(staffOf)).size;
  const people = [...new Set(shifts.flatMap(staffOf))].map(id => findPerson(all, state, id)).filter(Boolean);
  const missing = [];
  if (!info.has1) missing.push({ t: "Add the date and location on your Event Card", go: openEvent });
  if (!String(contact).trim()) missing.push({ t: "Add your phone number", go: () => { const el = document.querySelector("#ff-bill-phone"); if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); } } });
  const autoN = shifts.filter(sh => sh.route === "auto" && !staffOf(sh).length).length;
  if (!staffN && !autoN) missing.push({ t: party ? "Choose a Service Card and your staff" : "Choose your staff", go: goStaff });
  const placedB = new Set(shifts.flatMap(staffOf));
  const hasBasket = shifts.length > 0 || state.selection.some(id => id !== "me" && !placedB.has(id));

  const collapseEvent = () => { if (draft.iso && draft.venue.trim()) saveEvent(); else setOpK("event", false); };
  /* The open Event Card saves as you type, so nothing is lost if you move on without collapsing it. */
  useEffect(() => {
    if (!op.event) return;
    const t = setTimeout(() => {
      const any = draft.iso || draft.venue.trim() || draft.title.trim() || draft.kind || draft.start || draft.guests || String(draft.details || "").trim();
      if (!any) return;
      const ci = cleanIso11(draft.iso);
      const data = eventData11({ ...draft, iso: ci.past ? ((ev && ev.iso) || "") : ci.iso });
      if (ev) {
        if (["title", "kind", "iso", "start", "venue", "guests", "details"].every(k => String(ev[k] || "") === String(data[k] || ""))) return;
        dispatch({ type: "EVENT_PATCH", id: ev.id, patch: data });
        shifts.forEach(sh => dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: { iso: data.iso, date: data.date, venue: data.venue, ...(sh.svcId ? { time: svcTimeFor({ time: sh.svcTime }, data.start) } : {}) } }));
      } else {
        const id = uid("evt");
        dispatch({ type: "EVENT_ADD", event: { id, ...data, phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } });
        dispatch({ type: "ACTIVE_EVENT", id }); setView({ eventId: id, keep: bkey });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [draft, op.event]);
  /* 1 Event Card */
  const secEvent = (n) => (
    <div className={`ff-bsec s${n}`} id="ff-bs-event" key="event">
      {op.event ? (<>
        <SecHead n={n} title="Event Card" onToggle={collapseEvent} />
        <div className="ff-evwrap"><EventCard11 ev={draft} edit onPatch={(x) => setDraft(d => ({ ...d, ...x }))} /></div>
      </>) : (
        <BigBtn n={n} icon={I11.CalendarDays} mini="event" title="Event Card" done={info.has1}
          hint={info.has1 ? [ev.iso ? new Date(ev.iso + "T12:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : ev.date, startOf(ev), ev.venue].filter(Boolean).join(" · ") : ev && (ev.iso || ev.venue) ? "Still needed: " + [!ev.iso && "date", !String(ev.venue || "").trim() && "location"].filter(Boolean).join(" and ") : "Where and when."} onClick={openEvent} />
      )}
    </div>
  );

  /* Shift details (FF Staff) / Service Cards (FF Party) */
  const own = shifts.filter(sh => !(party && sh.svcId));
  const shelf = () => (
    <HScroll label="FireFlair Service Cards">
      {V101.PARTY_SERVICES.map(svc => { const sh = shifts.find(x => x.svcId === svc.id); return (
        <ServicePosterBook11 key={svc.id} svc={svc} sh={sh} start={startOf(ev)} onBook={() => addService(svc)} onRemove={() => removeService(sh)} />); })}
    </HScroll>
  );
  const confirmShift = () => { if (shifts.every(x => String(x.role || "").trim() && splitTime(x.time || "")[0])) setOpK("shift", false); };
  const faces = (list) => list.map((sh) => <ShiftFaceEdit key={sh.id} sh={sh} ev={ev} n={party ? 0 : shifts.indexOf(sh) + 1} ensure={ensure} onClose={() => {}} onConfirm={confirmShift} />);
  const secShift = (n) => (
    <div className={`ff-bsec wide s${n}`} id="ff-bs-shift" key="shift">
      {op.shift ? (<>
        <SecHead n={n} title={sv.Ts} state={info.has2 && shifts.length ? "done" : undefined} onToggle={() => setOpK("shift", false)} />
        {party ? (<>
          {own.length > 0 && <div className="ff-sfgrid">{faces(own)}</div>}
          {shelf()}
        </>) : (<>
          {<div className="ff-sfgrid" onScroll={onGridScroll}>{faces(shifts)}<ShiftFaceEdit key={`new${shifts.length}-${(shifts[shifts.length - 1] || {}).time || ""}-${(shifts[shifts.length - 1] || {}).rate || ""}-${(shifts[shifts.length - 1] || {}).total || ""}`} sh={null} ev={ev} n={shifts.length + 1} ensure={ensure} onClose={() => {}} /></div>}
        </>)}
      </>) : (
        <BigBtn n={n} icon={I11.ClipboardList} mini={party ? undefined : "shift"} title={party ? sv.Ts : sv.T} done={shifts.length > 0 && info.has2}
          hint={shifts.length ? (party ? sv.n(shifts.length) : `${shifts.length} ${shifts.length === 1 ? "shift" : "shifts"}`) : party ? "Our bars, cocktails and staff, ready to book." : "Timing, pay and terms."}
          onClick={() => goShift()} />
      )}
    </div>
  );

  const roleCounts = {}; shifts.forEach(sh => { const k = String(sh.role || "").toLowerCase(); roleCounts[k] = (roleCounts[k] || 0) + 1; });
  /* Staff */
  const secStaff = (n) => (
    <div className={`ff-bsec wide s${n}`} id="ff-bs-staff" key="staff">
      {op.staff ? (<>
        {party && <SecHead n={n} title="Staff" onToggle={() => setOpK("staff", false)} />}
        {!party ? <div className="ff-staffbub">
          <button type="button" className="ff-staffbub-x" onClick={() => setOpK("staff", false)} aria-label="Close staff" title="Close"><I11.ChevronDown size={18} /></button><StaffRow11 ev={ev} shifts={shifts} sel={selSh} onToggle={(p) => {
          if (!selSh) { staffToggle(p); return; }
          if (staffOf(selSh).includes(p.id)) { removeFrom(selSh, p.id); dispatch({ type: "TOAST", toast: `${firstName(p.name)} removed from ${selSh.role}` }); return; }
          const other = shifts.find(sh => sh.id !== selSh.id && staffOf(sh).includes(p.id)); if (other) removeFrom(other, p.id);
          if (staffOf(selSh).length >= qtyOf(selSh)) { dispatch({ type: "SHIFT_STAFF", id: selSh.id, staffIds: [p.id] }); dispatch({ type: "TOAST", toast: `${firstName(p.name)} is now on ${selSh.role}` }); }
          else placeOn(p, selSh.id);
        }} /></div> : <StaffPanel ev={ev} shifts={shifts} slotId={slotId} setSlotId={setSlotId} place={addPerson} onRemove={removeFrom} onRemoveSlot={removeSlot} onSelect={goDetails} onAddRole={addRole} onClose={() => setOpK("staff", false)} />}
      </>) : (
        <BigBtn n={n} icon={I11.Users} mini="staff" title="Staff" done={shifts.length > 0 && info.has3} faces={people}
          hint={staffN > 0 || autoN > 0 ? [staffN > 0 ? `${staffN} ${staffN === 1 ? "person" : "people"} chosen` : "", autoN > 0 ? `Autofill for ${autoN} ${autoN === 1 ? "role" : "roles"}` : ""].filter(Boolean).join(" · ") : party ? "Our recommendations, search, or your favourites." : "Choose your team."}
          onClick={goStaff} />
      )}
    </div>
  );

  const body = { event: secEvent, shift: secShift, staff: secStaff };
  const order = party ? ["shift", "event", "staff"] : ["event", "shift", "staff"];
  /* Choosing someone in Staff puts them on an open Shift card for their profession, or makes one for them. */
  const staffToggle = (p) => {
    const onSh = shifts.find(sh => staffOf(sh).includes(p.id));
    if (onSh) { removeFrom(onSh, p.id); dispatch({ type: "TOAST", toast: `${firstName(p.name)} removed from ${onSh.role}` }); return; }
    const open = shifts.filter(sh => staffOf(sh).length < qtyOf(sh));
    const target = open.find(sh => personSearchText(p).toLowerCase().includes(roleKey11(sh.role))) || open[0];
    if (target) { placeOn(p, target.id); return; }
    const evId = ensure();
    const prev = shifts[shifts.length - 1];
    const role = p.profession || "Staff";
    dispatch({ type: "SHIFT_ADD", shift: newShift(evId, { role, staffIds: [p.id], ...(prev ? { time: prev.time || "", rate: prev.rate || "", total: prev.total || "", hoursM: prev.hoursM || "", pay: prev.pay || "" } : {}) }) });
    if (state.selection.includes(p.id)) dispatch({ type: "SELECT", id: p.id });
    dispatch({ type: "TOAST", toast: `${firstName(p.name)} added as ${role}` });
  };
  return (
    <>
    <section className="ff-bbox" aria-label="Your booking">
      <header className="ff-bbox-h">
        <div>{ev && <span className="ff-ev11-eye">Your booking</span>}<h2>{ev ? (evComplete(ev) ? eventTitle(ev) : "Your booking") : "Create a booking"}</h2></div>
        {ev && <button type="button" className="ff-flow-x" onClick={() => setView({ n: Date.now() })} aria-label="Start a new booking" title="New booking"><I11.Plus size={18} /></button>}
      </header>
      <div className="ff-pb-top">
      <BookingAI onFill={fill} note={state.aiNote} onClear={() => dispatch({ type: "V11_SET", patch: { aiNote: "" } })} /></div>
      {order.flatMap((k, i) => [body[k](i + 1), i === 1 && (op.shift || op.staff)
        ? <Basket11 key="basket" ev={ev} onEvent={openEvent} shifts={shifts} bub={selSh ? { id: selSh.id } : null} onSelect={selectRole} onAdd={() => { setBub({ none: true }); setOpK("shift", true); setTimeout(() => { const g = gridEl(); if (g) g.scrollTo({ left: g.scrollWidth, behavior: "smooth" }); const el = document.querySelector("#ff-bs-shift .ff-sfwrap:last-child .ff-pick5 .hd"); if (el && el.getAttribute("aria-expanded") !== "true") el.click(); focusSec("ff-bs-shift"); }, 200); }} placeOn={placeOn} onRemove={removeFrom} onRemoveSlot={(sh) => { if (bub && bub.id === sh.id) setBub(undefined); removeSlot(sh); }} />
        : <div key={k + "-j"} className={`ff-barrow j${i + 1}`} aria-hidden="true"><I11.ChevronDown size={20} strokeWidth={2.4} /></div>])}

      {/* 4 Confirm: a round FF coin button */}
      <div className="ff-bsec s4 coin" id="ff-bs-confirm">
        {op.confirm && ev ? (<>
          <SecHead n={4} title="Confirm" onToggle={() => setOpK("confirm", false)} />
          <ConfirmPanel ev={ev} shifts={shifts} missing={missing} onClose={() => setOpK("confirm", false)} />
        </>) : (
          <Spin3D11 half={8} inset="0px" className="cfm" back={<div className="ff-cfm-back big"><span className="lg" /></div>}>
          <button type="button" className={`ff-cfm11${info.sent && ev ? " done" : ""}`} aria-label={info.sent && ev ? "Booking sent. See who has replied" : "Confirm: review your order"}
            onClick={() => { if (info.sent && ev) { setOpK("confirm", true); focusSec("ff-bs-confirm"); return; } ensure(); setOpK("confirm", true); focusSec("ff-bs-confirm"); }}>
            <span className="unit">
            {info.sent && ev ? <><b>Booking sent</b><small>See who's replied</small></> : <><b>Review</b><i className="amp" aria-hidden="true">&amp;</i><b>Confirm</b></>}</span>
          </button>
          </Spin3D11>
        )}
      </div>
    </section>
    {!party && <Availability11 />}
    {!party && <Plans11 />}
    </>
  );
}



/* A previous booking: what happened, and reviews. */
function ShiftMini11({ sh, ev }) {
  const { state } = useStore();
  const sv = svcWords(state);
  const [start, end] = splitTime(sh.time);
  return (
    <div className="ff-shm">
      <span className="plate"><I11.ClipboardList size={10} /> {sv.plate}</span>
      <b className="role">{sh.role || "Job role"}{qtyOf(sh) > 1 ? <em> × {qtyOf(sh)}</em> : null}</b>
      <span className="row"><I11.Clock size={12} /> {start || startOf(ev) || "Start to set"}{end ? ` – ${end}` : ""}</span>
      {sh.dress && <span className="row"><I11.Shirt size={12} /> {sh.dress}</span>}
    </div>
  );
}


function PastBooking({ ev, close }) {
  const { state } = useStore();
  const sv = svcWords(state);
  const all = useDirectory();
  const shifts = state.shifts.filter(x => x.eventId === ev.id);
  const people = [...new Set(shifts.flatMap(staffOf))].map(id => findPerson(all, state, id)).filter(Boolean);
  return (
    <section className="ff-bbox past" aria-label={`Previous booking: ${eventTitle(ev)}`}>
      <header className="ff-bbox-h">
        <div><span className="ff-ev11-eye">Previous booking</span><h2>{eventTitle(ev)}</h2></div>
        <button type="button" className="ff-flow-x" onClick={close} aria-label="Close"><I11.X size={18} /></button>
      </header>
      <div className="ff-evwrap"><EventCard11 ev={ev} people={people} foot={<><I11.ClipboardList size={15} /><span>{sv.n(shifts.length)}</span></>} /></div>
      {shifts.length > 0 && <div className="ff-fcards-shifts" style={{ maxWidth: 380, margin: "12px auto 0" }}>{shifts.map(sh => <ShiftMini11 key={sh.id} sh={sh} ev={ev} />)}</div>}
      <div style={{ marginTop: 14 }}><PastReviews ev={ev} /></div>
    </section>
  );
}



/* ---- Bookings ------------------------------------------------------------------------- */
function BookingsList11({ onOpen, onAgain }) {
  const { state, dispatch } = useStore();
  const signedIn = !!(state.auth && state.auth.status === "signedIn");
  const byDate = (a, b) => String(a.iso || "9").localeCompare(String(b.iso || "9"));
  const hasShifts = (e) => state.shifts.some(x => x.eventId === e.id);
  const events = !signedIn ? [] : [...state.events].filter(e => (e.iso || e.venue || hasShifts(e)) && !hid17(state, "events", e.id)).sort(byDate);
  const current = events.filter(e => !isPast(e.iso));
  const past = events.filter(e => isPast(e.iso)).reverse();
  const [hist, setHist] = useState(false);
  const [openId, setOpenId] = useState(null);
  const label = (e) => {
    const i = flowInfo(state, e), need = i.shifts.reduce((n, sh) => n + qtyOf(sh), 0);
    const conf = i.shifts.reduce((n, sh) => n + state.engagements.filter(x => x.shiftId === sh.id && DONE.includes(x.state)).length, 0);
    if (isPast(e.iso)) return `Past · ${conf} worked`;
    if (i.sent) return conf >= need && need ? "Confirmed" : `Sent · ${conf} of ${need}`;
    return `Draft · ${i.doneN} of 4 done`;
  };
  const open = (e) => { setOpenId(null); dispatch({ type: "ACTIVE_EVENT", id: e.id }); onOpen(e); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const sel = events.find(e => e.id === openId);
  const list = hist ? [...current, ...past] : current;
  return (
    <section className="ff-bkrow" aria-label="Your bookings">
      <div className="ff-bk11-h"><span>Your bookings</span><i />
        {past.length > 0 && <button type="button" className="ff-bkq-hist" aria-pressed={hist} onClick={() => setHist(v => !v)}><I11.Clock size={13} /> {hist ? "Hide history" : "History"}</button>}
      </div>
      {list.length ? (
        <div className="ff-bkq-rail">
          <HScroll label="Your bookings">
            {list.map(e => <EventCard11 key={e.id} ev={e} onClick={() => setOpenId(e.id)} foot={<><I11.Users size={13} /> {label(e)}</>} />)}
          </HScroll>
        </div>
      ) : <div className="ff-bkempty"><I11.CalendarDays size={20} /><p>{signedIn ? "No bookings yet." : "Your bookings will appear here."}</p></div>}
      {sel && <Sheet open onClose={() => setOpenId(null)} title={eventTitle(sel)}>
        <EventGuide ev={sel} shifts={state.shifts.filter(x => x.eventId === sel.id)} viewer="hirer" stamp={label(sel)} />
        <Btn variant="sm primary" onClick={() => open(sel)}><I11.ArrowRight size={13} /> {isPast(sel.iso) ? "Open and review" : "Open booking"}</Btn>
        {isPast(sel.iso) && onAgain && <Btn variant="sm ghost" onClick={() => onAgain(sel)}><I11.CalendarDays size={13} /> Book again</Btn>}
      </Sheet>}
    </section>
  );
}



function BuildBooking17() {
  const st = useStore(), state = st.state, dispatch = st.dispatch;
  const all = useDirectory();
  const br = state.br17 || {}, qual = br.q || "", band = br.band || "";
  const bk = bkOf17(state), pkgs = pkgsOf17(state);
  const popS = useState(null), pop = popS[0], setPop = popS[1];
  const cont = () => {
    const label = (PARTY_BANDS11.find(b => b.k === band) || {}).guests || "";
    let ev = state.events.find(e => e.id === state.activeEventId);
    let evId = ev && ev.id;
    if (!evId) {
      evId = uid("evt");
      dispatch({ type: "EVENT_ADD", event: { id: evId, ...eventData11({ ...eventDraft11(null), band, aud: "", guests: label }), band, audience: "", site: "party", phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } });
      dispatch({ type: "ACTIVE_EVENT", id: evId });
    } else if (band && !ev.band) dispatch({ type: "EVENT_PATCH", id: evId, patch: { band, guests: label } });
    if (qual) dispatch({ type: "EVENT_PATCH", id: evId, patch: { quality: qual } });
    bk.pk.forEach(id => {
      const svc = pkgs.find(y => y.id === id); if (!svc) return;
      const who = all.filter(p => (bk.pp || []).includes(p.id) && signedUp11(p, svc.id === "svc_full" ? "svc_bartending" : svc.id)).map(p => p.id), auto = (bk.pp || []).includes("auto:" + svc.id);
      const had = state.shifts.find(x => x.eventId === evId && x.svcId === svc.id);
      if (had) { if (who.length) dispatch({ type: "SHIFT_STAFF", id: had.id, staffIds: [...new Set([...(had.staffIds || []), ...who])] }); return; }
      dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: evId, staffIds: who, staffId: who[0] || "", skills: [], ...(auto ? { route: "auto" } : {}), qty: 1, dress: "", notes: "", tcs: "company", rate: "", total: "", hoursM: "", pay: svc.price,
        role: svc.title, matchRole: svc.role || SVC_ROLE[svc.id] || svc.title, svcId: svc.id, svcPrice: svc.price, svcTime: svc.time, svcLevel: svc.level, provider: svc.by || "",
        time: svcTimeFor(svc, (ev && ev.start) || ""), date: (ev && ev.date) || "", iso: (ev && ev.iso) || "", venue: (ev && ev.venue) || "" } });
    });
    const ao = state.addons17 || {}, sel = { ...(ao[evId] || {}) };
    bk.ck.forEach(id => { if (!sel[id]) sel[id] = 20; });
    dispatch({ type: "V11_SET", patch: { addons17: { ...ao, [evId]: sel }, xa17: { ...(state.xa17 || {}), [evId]: bk.ex }, bkView: { eventId: evId } } });
    
  };
  const prev = useRef([]);
  useEffect(function () {
    const gone = prev.current.filter(function (id) { return !bk.pk.includes(id); });
    prev.current = bk.pk.slice();
    const cur = state.events.find(function (e) { return e.id === state.activeEventId; });
    if (cur) gone.forEach(function (id) { state.shifts.filter(function (x) { return x.eventId === cur.id && x.svcId === id; }).forEach(function (x) { dispatch({ type: "SHIFT_DELETE", id: x.id }); }); });
    if (bk.pk.length) cont();
  }, [JSON.stringify([bk.pk, bk.pp, bk.ck, bk.ex])]);
  const go = function () { cont(); setTimeout(function () { var el = document.querySelector(".ff-cb17"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, 200); };
  /* v17.3.126: the Confirm page no longer shows the packages explorer (it lives on the Network page).
     This component keeps the basket logic above, which turns chosen packages into shifts. */
  return null;
}


function StaffBookings() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const view = state.bkView || {};
  const setView = (v) => dispatch({ type: "V11_SET", patch: { bkView: v } });
  const site = hireSiteOf(state);
  const sv = svcWords(state);
  const picked = view.eventId ? state.events.find(e => e.id === view.eventId) : null;
  const bk = String(view.keep || view.n || (picked ? picked.id : "new"));
  return (
    <div className="ff-bk11 v4">
      <div className="ff-eyebrow">{site.name}</div>
      <div className="ff-bk11-top"><h1 className="ff-h1">{site.party ? "Confirm your booking" : "Bookings"}</h1></div>

      {picked && isPast(picked.iso)
        ? <PastBooking key={picked.id} ev={picked} close={() => setView({})} />
        : site.party ? <><BuildBooking17 /><ConfirmBooking17 key={bk} bkey={bk} ev={picked} setView={setView} /></> : <BookingBox key={bk} bkey={bk} ev={picked} setView={setView} />}

      {!site.party && <BookingsList11 onOpen={(e) => setView({ eventId: e.id })} />}
      {!site.party && <FFEvents17 />}
    </div>
  );
}



/* ---- Network: looking for people for a booking ------------------------------------ */
function BookingBrief({ brief }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const ev = state.events.find(e => e.id === brief.eventId);
  const sh = state.shifts.find(x => x.id === brief.shiftId);
  const [f, setF] = useState(() => ({ role: (sh && sh.role) || "", iso: (ev && ev.iso) || "", area: areaOf(ev) }));
  if (!ev || !sh) return null;
  const team = teamOf(state, all).map(t => t.id);
  const on = staffOf(sh);
  const ranked = rankPeople(state, all, { role: f.role, iso: f.iso, area: f.area, team }).slice(0, 12);
  const add = (p) => { dispatch({ type: "SHIFT_STAFF", id: sh.id, staffIds: [...on, p.id] }); dispatch({ type: "TOAST", toast: `${firstName(p.name)} added to ${sh.role}` }); };
  const back = () => { dispatch({ type: "V11_SET", patch: { netBrief: null, bkView: { eventId: ev.id, open: "staff" } } }); dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); };
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  return (
    <section className="ff-brief" aria-label="Finding people for your booking">
      <div className="ff-brief-h">
        <div><span className="ff-ev11-eye">Finding people for</span><h2>{eventTitle(ev)} · {sh.role}</h2></div>
        <button type="button" className="ff-flow-x" aria-label="Clear" onClick={() => dispatch({ type: "V11_SET", patch: { netBrief: null } })}><I11.X size={18} /></button>
      </div>
      <div className="ff-brief-form">
        <label className="ff-ff wide"><span className="k">Job role</span><span className="in"><I11.Briefcase size={14} /><input value={f.role} onChange={set("role")} aria-label="Job role" /></span></label>
        <label className="ff-ff"><span className="k">Date</span><span className="in"><input type="date" value={f.iso} onChange={set("iso")} aria-label="Date" /></span></label>
        <label className="ff-ff"><span className="k">Area</span><span className="in"><I11.MapPin size={14} /><input value={f.area} onChange={set("area")} aria-label="Area" /></span></label>
      </div>
      <div className="ff-rec-h" style={{ marginTop: 14 }}><I11.Sparkles size={13} /> Best matches first<small>{on.length} chosen</small></div>
      <HScroll label="Best matches">
        {ranked.map(({ p, why, av }) => (
          <div key={p.id} className="ff-brief-t">
            <PlayerTile person={p} selected={on.includes(p.id)} onClick={() => dispatch({ type: "VIEW", id: p.id })} />
            <div className="why">{av && av.answer === "No" ? <i>Not free</i> : why.slice(0, 2).map(w => <i key={w}>{w}</i>)}</div>
            {on.includes(p.id) ? <Btn variant="sm ghost" disabled><I11.Check size={12} /> On this shift</Btn> : <Btn variant="sm" onClick={() => add(p)}><I11.Plus size={12} /> Add to shift</Btn>}
          </div>
        ))}
      </HScroll>
      <Btn variant="wide ghost" onClick={back}><I11.ChevronLeft size={14} /> Back to your booking</Btn>
    </section>
  );
}
