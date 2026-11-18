/* src/components/staff/events.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   EVENT CARD (v1.1) — the same family as every other FireFlair card: the
   plate, the coin, the name, a diamond rule and rows with black icon tiles.
   Only the start and the location are needed; name, type and guests are
   optional. Everything else goes on each person's Service Card.
   ========================================================================== */
const EVENT_TYPES = ["Wedding", "Birthday", "Private party", "Corporate event", "Brand launch", "Christmas party", "Festival", "Bar shift", "Other"];


const eventTitle = (ev) => (ev && String(ev.title || "").trim()) || (ev && ev.kind ? ev.kind : "Your event");



function EvRow({ icon: Icon, k, children }) {
  return (
    <div className="ff-evc-row">
      <span className="ic" aria-hidden="true"><Icon size={14} strokeWidth={1.9} /></span>
      <span className="k">{k}</span>
      <span className="v">{children}</span>
    </div>
  );
}



/* A box that opens into a short list of choices, right where it sits (no pop-up to get clipped).
   Used for the event type and the Service Card job role. */
function PickBox({ icon: Icon, k, value, options, onChange, placeholder, tone = "light", other }) {
  const [open, setOpen] = useState(false);
  const known = options.includes(value);
  return (
    <div className={`ff-pick5 ${tone}${open ? " open" : ""}`}>
      <button type="button" className="hd" aria-expanded={open} aria-label={`${k}: ${value || "not set"}`} onClick={() => setOpen(o => !o)}>
        <span className="ic" aria-hidden="true"><Icon size={14} strokeWidth={1.9} /></span>
        <span className="k">{k}</span>
        <span className={`v${value ? "" : " ph"}`}>{value || placeholder}</span>
        <I11.ChevronDown size={16} className="chev" />
      </button>
      {open && (
        <div className="opts" role="listbox" aria-label={k}>
          {options.map(o => <button key={o} type="button" role="option" aria-selected={o === value} className={o === value ? "on" : ""} onClick={() => { onChange(o); setOpen(false); }}>{o}</button>)}
          {other && <input className="oth" value={known ? "" : value || ""} placeholder={other} aria-label={other} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") setOpen(false); }} />}
        </div>
      )}
    </div>
  );
}



/* ---- Job roles, grouped the way the FF Team profile groups professions -------------------
   A row of categories (Bar, Front of House, Chefs …), the roles in the chosen category, and a box
   for any other role. Used on the Staff step (tap a role to add a person) and on the shift details
   card (tap a role to set it). */
/* The coin spins only where it is wanted: once the page has loaded, near the screen, never on a slow
   or data-saving connection, a low-memory device, or with reduced motion. Otherwise it stays a flat, still disc. */
function useSpinReady11(ref) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const c = navigator.connection;
    if ((c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return;
    let near = false, loaded = document.readyState !== "loading", done = false;
    const chk = () => { if (near && loaded && !done) { done = true; setOk(true); } };
    const io = new IntersectionObserver(([e]) => { if (e && e.isIntersecting) { near = true; io.disconnect(); chk(); } }, { rootMargin: "600px 0px" });
    io.observe(el);
    const onLoad = () => { loaded = true; chk(); };
    if (!loaded) document.addEventListener("DOMContentLoaded", onLoad);
    const tm = setTimeout(onLoad, 2500);
    return () => { io.disconnect(); clearTimeout(tm); document.removeEventListener("DOMContentLoaded", onLoad); };
  }, []);
  return ok;
}


/* A flat disc that turns into a real 3D coin (a stack of gold discs for the rim, a face each side) once it is ready.
   Nothing runs while it is idle: it only moves while you drag or swipe it, and a tap still presses what is inside. */
function Spin3D11({ half = 8, inset = 0, back, className = "", children }) {
  const box = useRef(null), inn = useRef(null), ready = useSpinReady11(box);
  const st = useRef({ a: 0, x: 0, t: 0, v: 0, down: false, moved: false, id: null, to: 0 });
  const levels = useMemo(() => Array.from({ length: half * 2 + 1 }, (_, i) => i - half), [half]);
  const apply = (deg, ease) => { const el = inn.current; if (!el) return; el.style.transition = ease || "none"; el.style.transform = `rotateY(${deg}deg)`; };
  const onDown = (e) => { const z = st.current; z.down = true; z.moved = false; z.x = e.clientX; z.t = performance.now(); z.v = 0; z.id = e.pointerId; };
  const onMove = (e) => {
    const z = st.current; if (!z.down) return;
    const dx = e.clientX - z.x;
    if (!z.moved && Math.abs(dx) < 8) return;
    if (!z.moved) { z.moved = true; clearTimeout(z.to); if (inn.current) inn.current.style.willChange = "transform"; try { e.currentTarget.setPointerCapture(z.id); } catch (_) {} }
    const now = performance.now(), dt = Math.max(1, now - z.t);
    z.v = 0.8 * z.v + 0.2 * (dx / dt); z.x = e.clientX; z.t = now; z.a += dx * 1.1;
    apply(z.a);
  };
  const onUp = () => {
    const z = st.current; if (!z.down) return; z.down = false;
    if (!z.moved) return;
    const dir = z.v < 0 || (z.v === 0 && z.a < 0) ? -1 : 1;
    const turns = Math.max(1, Math.round(Math.abs(z.v) * 2.2));
    z.a = Math.round(z.a / 360) * 360 + dir * 360 * turns;
    const secs = 0.7 + 0.25 * turns;
    apply(z.a, `transform ${secs}s cubic-bezier(.15,.75,.2,1)`);
    z.to = setTimeout(() => { z.moved = false; if (inn.current) inn.current.style.willChange = ""; }, secs * 1000 + 80);
  };
  const stopClick = (e) => { if (st.current.moved) { e.preventDefault(); e.stopPropagation(); } };
  const live = ready ? { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp, onClickCapture: stopClick } : {};
  return (
    <div ref={box} className={`ff-sp3 ${className}${ready ? " live" : ""}`} {...live}>
      <div className="in" ref={inn}>
        {ready ? <div className="edges" aria-hidden="true">{levels.map(z => <i key={z} style={{ transform: `translateZ(${z}px)`, inset }} />)}</div> : null}
        <div className="face front" style={ready ? { transform: `translateZ(${half + 0.5}px)` } : undefined}>{children}</div>
        {ready ? <div className="face back" aria-hidden="true" style={{ transform: `rotateY(180deg) translateZ(${half + 0.5}px)` }}>{back}</div> : null}
      </div>
    </div>
  );
}


function RoleChips11({ value, onPick, counts, other = "Another role", pickLabel }) {
  const start = (value && professionCategory(value)) || PROFESSION_CATEGORIES[0].key;
  const [cat, setCat] = useState(start);
  const [typed, setTyped] = useState("");
  const c = PROFESSION_CATEGORIES.find(x => x.key === cat) || PROFESSION_CATEGORIES[0];
  const add = () => { const t = typed.trim().replace(/\s+/g, " ").replace(/\b\w/g, ch => ch.toUpperCase()); if (!t) return; onPick(t); setTyped(""); };
  return (
    <div className="ff-rolechips">
      <div className="ff-rc-cats" role="tablist" aria-label="Role categories">
        {PROFESSION_CATEGORIES.map(x => <button key={x.key} type="button" role="tab" aria-selected={x.key === cat} className={x.key === cat ? "on" : ""} onClick={() => setCat(x.key)}>{x.key}</button>)}
      </div>
      <div className="ff-rc-roles" role="listbox" aria-label={`${cat} roles`}>
        {c.suggested.map(r => {
          const n = counts ? (counts[r.toLowerCase()] || 0) : 0, on = !counts && r === value;
          return <button key={r} type="button" role="option" aria-selected={on || n > 0} className={on || n > 0 ? "on" : ""} onClick={() => onPick(r)}><I11.Plus size={12} strokeWidth={2.6} />{r}{n > 0 && <em>{n}</em>}</button>;
        })}
      </div>
      <div className="ff-rc-oth">
        <input value={typed} placeholder={other} aria-label={other} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
        <button type="button" disabled={!typed.trim()} onClick={add}>{counts ? "Add" : "Use"}</button>
      </div>
    </div>
  );
}


/* The role box on the shift details card: the same box as the other four, opening into the grouped roles. */
function RoleBox11({ value, onChange, tone = "warm" }) {
  const [open, setOpen] = useState(!value);
  return (
    <div className={`ff-pick5 ${tone}${open ? " open" : ""}`}>
      <button type="button" className="hd" aria-expanded={open} aria-label={`Role: ${value || "not set"}`} onClick={() => setOpen(o => !o)}>
        <span className="ic" aria-hidden="true"><I11.Briefcase size={14} strokeWidth={1.9} /></span>
        <span className="k">Role</span>
        <span className={`v${value ? "" : " ph"}`}>{value || "Choose"}</span>
        <I11.ChevronDown size={16} className="chev" />
      </button>
      {open && <div className="opts rc"><RoleChips11 value={value} onPick={(r) => { onChange(r); setOpen(false); }} other="Another role" /></div>}
    </div>
  );
}



/* FF Party favourites. */
const favsOf = (state, all) => (state.favs || []).map(id => all.find(p => p.id === id)).filter(p => p && !p.isCompany);


function FavBtn11({ person, wide }) {
  const { state, dispatch } = useStore();
  const on = (state.favs || []).includes(person.id);
  return (
    <Btn variant={on ? "ghost" + (wide ? " wide" : "") : "primary" + (wide ? " wide" : "")} onClick={() => { dispatch({ type: "FAV_TOGGLE", id: person.id }); dispatch({ type: "TOAST", toast: on ? `${firstName(person.name)} removed from your favourites` : `${firstName(person.name)} added to your favourites` }); }}>
      {on ? <><I11.Check size={14} /> In your favourites</> : <><I11.Heart size={14} /> Add to favourites</>}
    </Btn>
  );
}


function EventCard11({ ev, edit, onPatch, people = [], foot, onClick, className = "" }) {
  const p = (x) => onPatch && onPatch(x);
  const start = startOf(ev);
  const Tag = onClick ? "button" : "article";
  return React.createElement(
    Tag,
    {
      type: onClick ? "button" : void 0,
      className: `ff-evc${edit ? " edit" : ""}${onClick ? " hit" : ""} ${className}`,
      onClick,
      "aria-label": edit ? "Your Event Card" : `Event Card: ${eventTitle(ev)}`
    },
    React.createElement("span", { className: "ff-evc-plate" }, "Event Card"),
    React.createElement("span", { className: "ff-evc-coin" }, React.createElement(FFLogo, { size: 30, tier: "gold" })),
    edit ? React.createElement(
      "input",
      {
        className: "ff-evc-name in",
        value: ev.title || "",
        placeholder: "Event name",
        "aria-label": "Event name",
        maxLength: 50,
        onChange: (e) => p({ title: e.target.value })
      }
    ) : React.createElement("h3", { className: "ff-evc-name" }, eventTitle(ev)),
    React.createElement("div", { className: "ff-evc-rule", "aria-hidden": "true" }, React.createElement("i", null), React.createElement("span", null, "\u25C6"), React.createElement("i", null)),
    React.createElement("div", { className: "ff-evc-rows" }, edit ? React.createElement(PickBox, { icon: I11.PartyPopper, k: "Type", value: ev.kind || "", options: EVENT_TYPES, placeholder: "Choose", onChange: (v) => p({ kind: v }) }) : React.createElement(EvRow, { icon: I11.PartyPopper, k: "Type" }, ev.kind || "Not set"), React.createElement(EvRow, { icon: I11.CalendarDays, k: "Date" }, edit ? React.createElement("input", { type: "date", value: ev.iso || "", min: TODAY_ISO, onChange: (e) => p({ iso: e.target.value }), "aria-label": "Date" }) : ev.iso ? shortDay(ev.iso) : ev.date || "To confirm"), React.createElement(EvRow, { icon: I11.Clock, k: "Starts" }, edit ? React.createElement("input", { type: "time", value: start, onChange: (e) => p({ start: e.target.value }), "aria-label": "Start time" }) : start || "Not set"), React.createElement(EvRow, { icon: I11.MapPin, k: "Location" }, edit ? React.createElement("input", { value: ev.venue || "", placeholder: "Venue or postcode", "aria-label": "Location", onChange: (e) => p({ venue: e.target.value }) }) : ev.venue || "To confirm"), React.createElement(EvRow, { icon: I11.Users, k: "Guests" }, edit ? React.createElement(
      "input",
      {
        value: ev.guests || "",
        inputMode: "numeric",
        placeholder: "How many?",
        "aria-label": "Number of guests",
        onChange: (e) => p({ guests: e.target.value.replace(/[^\d]/g, "").slice(0, 5) })
      }
    ) : ev.guests ? `${ev.guests} guests` : "Not set")),
    edit ? React.createElement("label", { className: "ff-evc-more" }, React.createElement("span", null, React.createElement(I11.FileText, { size: 13 }), " Event brief"), React.createElement(
      "textarea",
      {
        rows: 3,
        value: ev.details || "",
        placeholder: "Anything else the team should know",
        "aria-label": "Event brief",
        onChange: (e) => p({ details: e.target.value })
      }
    )) : ev.details ? React.createElement("p", { className: "ff-evc-more ro" }, React.createElement(I11.FileText, { size: 13 }), React.createElement("span", null, ev.details)) : null,
    !edit && ev.request && React.createElement("p", { className: "ff-evc-more ro req" }, React.createElement(I11.Sparkles, { size: 13 }), React.createElement("span", null, React.createElement("b", null, "Request:"), " ", ev.request)),
    !edit && people.length > 0 && React.createElement("div", { className: "ff-evc-faces", "aria-label": `${people.length} on the team` }, people.slice(0, 5).map((x) => React.createElement("span", { key: x.id, className: "f" }, React.createElement(Portrait, { src: x.photo, name: x.name, size: 34, tier: x.tier }))), people.length > 5 && React.createElement("span", { className: "f more" }, "+", people.length - 5)),
    foot ? React.createElement("div", { className: "ff-evc-foot" }, foot) : React.createElement("div", { className: "ff-evc-end", "aria-hidden": "true" })
  );
}



const eventDraft11 = (ev) => ev ? { title: ev.title || "", kind: ev.kind || "", iso: ev.iso || "", start: startOf(ev), venue: ev.venue || "", guests: ev.guests || "", details: ev.details || "" }
  : { title: "", kind: "", iso: "", start: "", venue: "", guests: "", details: "" };


/* A typed two-digit year ("26") arrives as 0026: read it as 2026. Returns the date, and whether it has passed. */
function cleanIso11(iso) {
  const m = /^(\d{1,4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return { iso: iso || "", past: false };
  const y = +m[1] < 100 ? 2000 + +m[1] : +m[1];
  const fixed = `${String(y).padStart(4, "0")}-${m[2]}-${m[3]}`;
  return { iso: fixed, past: fixed < TODAY_ISO };
}


const eventData11 = (d) => ({
  title: d.title.trim() || [d.kind || "Event", d.iso ? shortDay(d.iso) : ""].filter(Boolean).join(" · "),
  kind: d.kind, iso: d.iso, start: d.start, venue: d.venue.trim(), guests: d.guests, details: (d.details || "").trim(),
  date: longDate(d.iso) || "", time: d.start || "",
});



/* People on an event, from its Service Cards. */
const eventPeople = (state, all, ev) => [...new Set(state.shifts.filter(x => x.eventId === ev.id && x.staffId).map(x => x.staffId))]
  .map(id => findPerson(all, state, id)).filter(Boolean);





const tcsLine = (state, sh) => "View T&Cs";



function ShiftCard11({ shift, event, person, status, onClick, acts }) {
  const start = splitTime(shift.time)[0];
  const end = splitTime(shift.time)[1];
  const Tag = onClick ? "button" : "article";
  const { state } = useStore();
  return (
    <div className="ff-shc-wrap">
      <Tag type={onClick ? "button" : undefined} className={`ff-shc${onClick ? " hit" : ""}`} onClick={onClick} aria-label={`Service Card: ${shift.role || "role to set"}${person ? `, ${person.name}` : ""}`}>
        <span className="ff-shc-plate"><I11.ClipboardList size={11} /> Service Card</span>
        <span className="ff-shc-coin"><FFLogo size={28} tier="gold" /></span>
        <div className="ff-shc-who">
          {person ? <Portrait src={person.photo} name={person.name} size={46} tier={person.tier} /> : <span className="empty"><I11.User size={20} strokeWidth={1.5} /></span>}
          <span className="nm">{person ? person.name : "Not assigned yet"}</span>
        </div>
        <h3 className="ff-shc-role">{shift.role || "Job role"}</h3>
        <div className="ff-shc-rule" aria-hidden="true"><i /><span>◆</span><i /></div>
        <div className="ff-shc-rows">
          <div><span className="ic"><I11.Clock size={13} /></span><span className="k">Start</span><span className="v">{shortDay(shift.iso || (event && event.iso)) || shift.date}{start ? ` · ${start}` : ""}{end ? `–${end}` : ""}</span></div>
          <div><span className="ic"><I11.Shirt size={13} /></span><span className="k">Uniform</span><span className="v">{shift.dress || "To add"}</span></div>
          <div><span className="ic"><I11.CalendarDays size={13} /></span><span className="k">Event</span><span className="v">{event ? eventTitle(event) : "—"}</span></div>
          <div><span className="ic"><I11.FileText size={13} /></span><span className="k">T&Cs</span><span className="v">{tcsLine(state, shift)}</span></div>
        </div>
        {shift.notes ? <p className="ff-shc-notes">{shift.notes}</p> : <p className="ff-shc-notes muted">No extra details.</p>}
        <div className={`ff-shc-foot ${status ? status.tone : ""}`}>{status ? status.label : "Service Card"}</div>
      </Tag>
      {acts && <div className="ff-shc-acts">{acts}</div>}
    </div>
  );
}



const ROLE_SUGGEST = ["Bartender", "Cocktail Bartender", "Mixologist", "Flair Bartender", "Barback", "Bar Manager", "Waiter", "Silver Service Waiter", "Event Host", "DJ", "Chef", "Photographer", "Event Staff"];



/* Create or edit one Service Card. Same props as before, so every screen that
   opened the old sheet opens this one. */
function ShiftSheet({ open, shift, event, onClose, onSaved }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const blank = { role: "", start: "", finish: "", dress: "", notes: "", staffId: "", tcs: "company" };
  const [f, setF] = useState(blank);
  useEffect(() => {
    if (!open) return;
    if (shift) { const [a, b] = splitTime(shift.time); setF({ role: shift.role || "", start: a || startOf(event), finish: b, dress: shift.dress || "", notes: shift.notes || "", staffId: shift.staffId || "", tcs: shift.tcs || "company" }); }
    else setF({ ...blank, start: startOf(event) });
  }, [open, shift && shift.id]);
  if (!open || !event) return null;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const existing = shift && state.shifts.some(x => x.id === shift.id);
  const e = existing && latestEng(state, shift.id);
  const sent = e && e.staffId === shift.staffId && !["unavailable", "expired"].includes(e.state);
  const taken = state.shifts.filter(x => x.eventId === event.id && (!shift || x.id !== shift.id)).map(x => x.staffId);
  const team = [...new Set([...(f.staffId ? [f.staffId] : []), ...state.selection, ...state.engagements.filter(x => ["confirmed", "completed", "signed_off", "paid"].includes(x.state)).map(x => x.staffId)])]
    .filter(id => id === f.staffId || !taken.includes(id)).map(id => findPerson(all, state, id)).filter(Boolean);
  const avail = f.staffId && availabilityFor(state, f.staffId, event.iso);
  const save = () => {
    const data = {
      role: f.role.trim(), time: [f.start, f.finish].filter(Boolean).join(" — "), dress: f.dress.trim(), notes: f.notes.trim(),
      staffId: f.staffId, tcs: f.tcs, date: event.date || "", iso: event.iso || "", venue: event.venue || "",
    };
    if (existing) dispatch({ type: "SHIFT_PATCH", id: shift.id, patch: data });
    else dispatch({ type: "SHIFT_ADD", shift: { id: (shift && shift.id) || uid("shf"), eventId: event.id, skills: [], pay: "", ...data } });
    dispatch({ type: "TOAST", toast: existing ? "Service Card updated" : "Service Card added" });
    onSaved && onSaved();
    onClose();
  };
  const own = state.company && state.company.tcMode === "own";
  return (
    <Sheet open onClose={onClose} title={existing ? "Edit Service Card" : "New Service Card"}>
      <p className="ff-body ff-muted" style={{ marginTop: 0, fontSize: 12.5 }}>For {eventTitle(event)} · {shortDay(event.iso)} · {event.venue || "location to confirm"}. One Service Card is for one person.</p>
      <Field label="Job role">
        <input className="ff-input" list="ff-roles11" value={f.role} onChange={set("role")} placeholder="Cocktail Bartender" />
        <datalist id="ff-roles11">{ROLE_SUGGEST.map(r => <option key={r} value={r} />)}</datalist>
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Start time"><input className="ff-input" type="time" value={f.start} onChange={set("start")} /></Field>
        <Field label="Finish · optional"><input className="ff-input" type="time" value={f.finish} onChange={set("finish")} /></Field>
      </div>
      <Field label="Uniform"><input className="ff-input" value={f.dress} onChange={set("dress")} placeholder="All black, black shoes" /></Field>
      <Field label="Extra details"><textarea className="ff-input" rows={2} value={f.notes} onChange={set("notes")} placeholder="Arrive 30 minutes early. Parking at the back." /></Field>
      <div className="ff-field">
        <span className="ff-label" style={{ display: "block", marginBottom: 6 }}>T&amp;Cs</span>
        <div className="ff-seg11" role="group" aria-label="T&Cs">
          <button type="button" aria-pressed={f.tcs !== "none"} onClick={() => setF({ ...f, tcs: "company" })}>{own ? "Your T&Cs" : "FireFlair template"}</button>
          <button type="button" aria-pressed={f.tcs === "none"} onClick={() => setF({ ...f, tcs: "none" })}>None</button>
        </div>
        <span className="ff-body ff-muted" style={{ fontSize: 12, display: "block", marginTop: 5 }}>Set your T&amp;Cs, documents and Q&amp;A once on your Company profile.</span>
      </div>
      <Field label="Person" hint={team.length ? "From your booking bar and your team." : "Add people to your booking bar from Featured staff or Network."}>
        <select className="ff-input" value={f.staffId} onChange={set("staffId")} disabled={sent}>
          <option value="">Not assigned yet</option>
          {team.map(p => <option key={p.id} value={p.id}>{p.name} · {p.profession}</option>)}
        </select>
      </Field>
      {avail && <p className={`ff-av-inline ${availTone(avail.answer)}`}><I11.CalendarCheck size={13} /> {availWord(avail.answer, firstName(findPerson(all, state, f.staffId)?.name))} on {shortDay(event.iso)}</p>}
      <Btn variant="primary wide" disabled={!f.role.trim() || !f.start} onClick={save}><I11.Check size={14} /> {existing ? "Save Service Card" : "Add Service Card"}</Btn>
    </Sheet>
  );
}



/* ==========================================================================
   BOOKINGS (FF Staff / FF Party, v1.1) — manage your Event Cards and Shift
   Cards, in two tabs. Updates come on WhatsApp and under the bell.
   ========================================================================== */
const ENG_NOTE = {
  requested: (n, r) => `Availability Card sent to ${n} · ${r}`, available: (n) => `${n} is available`, unavailable: (n) => `${n} declined`,
  expired: (n) => `${n} didn't reply in time`, confirmed: (n, r) => `${n} confirmed · ${r}`, completed: (n) => `${n}'s shift was worked`,
  signed_off: (n) => `${n}'s shift was signed off`, paid: (n) => `${n}'s booking closed`,
};


function bookingNotes(state, all) {
  const out = [];
  state.engagements.forEach(e => {
    const sh = state.shifts.find(x => x.id === e.shiftId); if (!sh) return;
    const ev = state.events.find(x => x.id === sh.eventId);
    const p = findPerson(all, state, e.staffId);
    (e.history || [{ state: e.state, at: e.sentAt }]).forEach(h => {
      const f = ENG_NOTE[h.state]; if (!f) return;
      out.push({ id: `${e.id}_${h.state}`, at: h.at || 0, text: f(p ? p.name : "Someone", sh.role), ev, tone: ENG_TONE[h.state] });
    });
  });
  (state.availabilityAsks || []).filter(x => x.answer && x.personId !== "me").forEach(x => {
    const p = findPerson(all, state, x.personId);
    out.push({ id: x.id, at: x.answeredAt || x.at, text: `${p ? p.name : "Someone"} answered ${x.answer} for ${shortDay(x.iso)}`, tone: availTone(x.answer) });
  });
  return out.sort((a, b) => b.at - a.at).slice(0, 30);
}
