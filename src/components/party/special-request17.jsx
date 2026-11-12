/* src/components/party/special-request17.jsx — the gold Special Request Card (v17.4.8), shown in Bar, Entertainment, Services and Food.
   Free to send. FireFlair finds the right professional or company, the customer agrees, and only then is a deposit due.
   Requests are kept in state.specialReq17 (persisted) and never in events / engagements, so nothing is billed or "paid" by sending one. */
function srWho17(state) {
  const p = state.profile || {}, se = state.session || {}, c = state.company || {}, au = state.auth || {};
  return { name: String(c.name || p.name || se.name || "").trim(), contact: String(p.email || se.email || au.email || c.email || "").trim() };
}

/* One Special Request package card per pillar. It sits in the package rows and is chosen like any other package. */
const SR_PKGS17 = SR17_CATS.map(function (c) {
  return { id: "sr_" + c[0], special: true, ff: true, cat: c[0], title: "Special Request", tagline: "Your event. Your way.", includes: "FireFlair finds the right professional or company",
    ideal: "Something not listed here", time: "Arranged with you", noPrice: true, by: "FireFlair", tone: "special", role: c[1], bands: ALLB17 };
});

/* Choosing the Special Request records a pending request from what the Event Card already holds. No form: FireFlair follows up from the booking. */
function srAuto17(state, dispatch, cat) {
  const ev = state.events.find(function (e) { return e.id === state.activeEventId; }) || null;
  const who = srWho17(state);
  const draft = { cat: cat, kind: (ev && ev.kind) || "", what: (ev && String(ev.details || "").trim()) || "Details to be agreed with FireFlair", iso: (ev && ev.iso) || "", flex: false, where: (ev && ev.venue) || "", guests: (ev && ev.guests) || "", name: who.name, contact: who.contact, budget: "", eventId: ev ? ev.id : "" };
  const r = sr17Add(state, draft, Date.now());
  if (r.added) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } });
}

/* Choose a package for the booking: it joins the basket and the booking screen builds its Service card and People slot. */
function selectPkg17(state, dispatch, id, go) {
  const bk = bkOf17(state);
  if (!bk.pk.includes(id)) dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: pkFlip17(bk.pk, id) } } });
  if (go) { dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } }); dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); }
}

function SpecialRequestSheet17({ cat, onClose, onDone }) {
  const { state, dispatch } = useStore();
  const ev = state.events.find(function (e) { return e.id === state.activeEventId; }) || null;
  const who = srWho17(state);
  const [f, setF] = useState(function () {
    return { cat: cat, kind: (ev && ev.kind) || "", what: "", iso: (ev && ev.iso) || "", flex: false, where: (ev && ev.venue) || "", guests: (ev && ev.guests) || "", name: who.name, contact: who.contact, budget: "" };
  });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(null);
  const sending = useRef(false);
  const set = function (k) { return function (e) { const v = e.target.type === "checkbox" ? e.target.checked : e.target.value; setF(function (o) { return Object.assign({}, o, { [k]: v }); }); }; };
  const list = sr17List(state).filter(function (r) { return r.cat === cat; }).slice().reverse();
  const deposit = (typeof rules17 === "function" ? rules17(state).feeParty : null);
  const submit = function () {
    if (sending.current) return;
    if (!String(f.what).trim()) { setErr("Tell us what you're looking for."); return; }
    if (!String(f.name).trim() || !String(f.contact).trim()) { setErr("Add your name and how to reach you."); return; }
    sending.current = true;
    const draft = { cat: f.cat, kind: String(f.kind).trim(), what: String(f.what).trim(), iso: f.iso, flex: !!f.flex, where: String(f.where).trim(), guests: String(f.guests).trim(), name: String(f.name).trim(), contact: String(f.contact).trim(), budget: String(f.budget).trim(), eventId: ev ? ev.id : "" };
    const r = sr17Add(state, draft, Date.now());
    if (r.added) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } });
    dispatch({ type: "TOAST", toast: r.added ? "Special request added to your booking" : "That request is already with FireFlair" });
    if (onDone) onDone();
    else setSent(r.added || r.dup);
  };
  const agree = function (id) { const r = sr17Move(state, id, "deposit", "customer", "Customer agreed the arrangement", Date.now()); if (r.ok) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } }); };
  const withdraw = function (id) { const r = sr17Move(state, id, "closed", "customer", "Withdrawn by customer", Date.now()); if (r.ok) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } }); };
  return (
    <Sheet open onClose={onClose} title="Special Request" center>
      <div className="ff-sr17-sheet">
        {list.length ? (
          <div className="ff-sr17-mine">
            {list.map(function (r) {
              return (
                <div className="ff-sr17-item" key={r.id}>
                  <b>{r.kind || r.what.slice(0, 40)}</b>
                  <span className={"ff-sr17-st st-" + r.stage}>{sr17Label(r.stage)}</span>
                  {r.stage === "approval" ? <div className="ff-sr17-act"><Btn variant="gold" onClick={function () { agree(r.id); }}>Agree arrangement</Btn><Btn onClick={function () { withdraw(r.id); }}>Withdraw</Btn></div> : null}
                  {r.stage === "deposit" ? <p className="ff-body ff-muted">{deposit != null ? "A deposit of £" + deposit + " is now due to secure this arrangement." : "A deposit is now due to secure this arrangement."}</p> : null}
                  {r.stage === "review" ? <div className="ff-sr17-act"><Btn onClick={function () { withdraw(r.id); }}>Withdraw</Btn></div> : null}
                </div>);
            })}
          </div>) : null}
        {sent ? (
          <p className="ff-body">Thank you. Your request is with FireFlair, and we will be in touch at {sent.contact}. Nothing is charged to send it.</p>
        ) : (
          <>
            <Field label="Category"><select className="ff-input" value={f.cat} onChange={set("cat")}>{SR17_CATS.map(function (c) { return <option key={c[0]} value={c[0]}>{c[1]}</option>; })}</select></Field>
            <Field label="Type of event"><input className="ff-input" value={f.kind} onChange={set("kind")} /></Field>
            <Field label="What are you looking for?"><textarea className="ff-input" rows={4} value={f.what} onChange={set("what")} /></Field>
            <Field label="Preferred date"><input className="ff-input" type="date" value={f.iso} onChange={set("iso")} /></Field>
            <label className="ff-sr17-chk"><input type="checkbox" checked={f.flex} onChange={set("flex")} /> My date is flexible</label>
            <Field label="Location"><input className="ff-input" value={f.where} onChange={set("where")} /></Field>
            <Field label="Number of guests"><input className="ff-input" inputMode="numeric" value={f.guests} onChange={set("guests")} /></Field>
            <Field label="Your name"><input className="ff-input" value={f.name} onChange={set("name")} /></Field>
            <Field label="Email or phone"><input className="ff-input" value={f.contact} onChange={set("contact")} /></Field>
            <Field label="Budget (optional)"><input className="ff-input" value={f.budget} onChange={set("budget")} /></Field>
            {err ? <p className="ff-body" role="alert" style={{ color: "#8B1A2B" }}>{err}</p> : null}
            <Btn variant="gold" onClick={submit}>Submit special request</Btn>
          </>)}
      </div>
    </Sheet>);
}

/* FireFlair admin: every special request with its stage, history and the moves FireFlair may make. */
function AdmSpecial17({ state, dispatch }) {
  const list = sr17List(state).slice().reverse();
  if (!list.length) return null;
  const move = function (id, to) {
    const r = sr17Move(state, id, to, "admin", "", Date.now());
    if (r.ok) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } });
  };
  const catName = function (k) { const f = SR17_CATS.find(function (x) { return x[0] === k; }); return f ? f[1] : k; };
  return (
    <div className="ff-adm-bk ff-sr17-adm">
      <div className="hd"><span className="mn"><b>Special requests</b><small>{list.filter(sr17Open).length} open</small></span></div>
      {list.map(function (r) {
        const next = ((SR17_NEXT[r.stage] || {}).admin) || [];
        return (
          <div className="ff-sr17-item" key={r.id}>
            <b>{catName(r.cat)} · {r.kind || "Request"}</b>
            <span className={"ff-sr17-st st-" + r.stage}>{sr17Label(r.stage)}</span>
            <p className="ff-body">{r.what}</p>
            <small className="ff-muted">{[r.name, r.contact, r.iso ? r.iso + (r.flex ? " (flexible)" : "") : "", r.where, r.guests ? r.guests + " guests" : "", r.budget ? "Budget: " + r.budget : ""].filter(Boolean).join(" · ")}</small>
            <ol className="ff-sr17-hist">{(r.history || []).map(function (h, i) { return <li key={i}>{sr17Label(h.stage)} · {h.by} · {new Date(h.at).toLocaleString("en-GB")}{h.note ? " · " + h.note : ""}</li>; })}</ol>
            {next.length ? <div className="ff-sr17-act">{next.map(function (to) { return <Btn key={to} onClick={function () { move(r.id, to); }}>{to === "closed" ? "Close request" : "Move to: " + sr17Label(to)}</Btn>; })}</div> : null}
          </div>);
      })}
    </div>);
}
