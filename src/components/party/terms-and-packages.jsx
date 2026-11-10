/* src/components/party/terms-and-packages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* FF Team profile: the terms a business sees when it hires you. Five points, ready to use, all editable. */
const MY_TERMS17 = [
  { k: "pay", label: "Payment", text: "Cash is preferred. If you are paying by bank transfer, please use the bank details I provide when the booking is confirmed." },
  { k: "tax", label: "Tax and self-employment", text: "I work as a self-employed freelancer. I am responsible for my own tax and National Insurance, and I am not an employee of the business that books me." },
  { k: "safe", label: "Emergency contact and safety", text: "I am responsible for my own health and safety while I work. If I am unwell or unable to respond, please call my emergency contact, whose name and number I provide with each booking." },
  { k: "kit", label: "Uniform and arrival", text: "My preferred uniform is a black shirt, black trousers and black shoes, unless the event asks for something different. I will arrive ready to work, within 10 minutes of the shift start time." },
  { k: "food", label: "Food and dietary needs", text: "I appreciate being fed on shifts longer than 4 hours, and a meal provided will cover my break period. I have no allergies and I am happy to eat everything." },
];


/* FF Team terms, the way FF Staff shows them: a card for each set of terms. Tap one to read and edit its five points in a pop-up. */
const TERM_SETS17 = {
  mine: { key: "myTerms17", title: "Personal T&Cs", note: "Shown when a business hires you.", head: "Personal terms and conditions", list: MY_TERMS17 },
  service: { key: "svcTerms17", title: "Service card T&Cs", note: "Shown when a client books one of your service cards.", head: "Service card terms and conditions", list: TERMS17 },
};


function TermsSheet17({ set, onClose }) {
  const { state, dispatch } = useStore();
  const S = TERM_SETS17[set];
  const [terms, setTerms] = useState(() => ({ ...Object.fromEntries(S.list.map(t => [t.k, t.text])), ...(state[S.key] || {}) }));
  const save = () => { dispatch({ type: "V11_SET", patch: { [S.key]: terms } }); dispatch({ type: "TOAST", toast: "Terms saved to your profile" }); onClose(); };
  return (
    <Sheet open onClose={onClose} title={S.head}>
      <p className="ff-fp" style={{ margin: "0 0 10px" }}>{S.note}</p>
      <div className="ff-tc5">
        {S.list.map((t, i) => (
          <label key={t.k}><span><b>{i + 1}</b>{t.label}</span>
            <textarea rows={3} value={terms[t.k] || ""} maxLength={500} aria-label={t.label} onChange={(e) => setTerms({ ...terms, [t.k]: e.target.value })} /></label>
        ))}
      </div>
      <div className="ff-bsec-acts" style={{ marginTop: 8 }}>
        <Btn variant="primary" onClick={save}><S17I.Check size={14} /> Save to my profile</Btn>
        <Btn variant="sm ghost" onClick={() => setTerms(Object.fromEntries(S.list.map(t => [t.k, t.text])))}>Reset</Btn>
      </div>
    </Sheet>
  );
}


function TermsCards17() {
  const [open, setOpen] = useState(null);
  const def = { label: "Terms and conditions", singular: "Terms", icon: "qualification", fields: ["description"] };
  return (
    <>
      <HScroll label="Terms and conditions">
        {Object.entries(TERM_SETS17).map(([k, S]) => <InformationCard key={k} record={{ ...makeRecord("terms", S.title), id: `tc_${k}`, description: S.note }} def={def} themeKey="onyx" editable onClick={() => setOpen(k)} />)}
      </HScroll>
      {open && <TermsSheet17 set={open} onClose={() => setOpen(null)} />}
    </>
  );
}


function PersonalTerms17() {
  const [open, setOpen] = useState(false);
  return (
    <section className="ff-cr17 ff-mt17" aria-label="Terms and conditions">
      <StaffBox id="ff-cr17-terms" icon={E17I.Layers} title="Terms and conditions" open={open} onToggle={() => setOpen(o => !o)}><TermsCards17 /></StaffBox>
    </section>
  );
}


/* The same cards, as a row on the profile creation page: between Reviews and Q&A, closed to start with. */
function TermsRow17() {
  const { state } = useStore();
  const open = state.categoryVisibility.terms17 === true;
  return (
    <section id="ff-sec-terms" style={{ marginTop: 22 }}>
      <SectionHead icon={<E17I.Layers size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Terms and conditions" count={Object.keys(TERM_SETS17).length} action={<CategoryToggle sectionKey="terms17" defaultOpen={false} />} />
      {open && <TermsCards17 />}
    </section>
  );
}



/* Tab names, by site: FF Party is Home, Browse, Book, Party. FF Staff is Home, Our people, Your bookings, Your business. */
const tabLabel17 = (key, state, dflt) => {
  const staff = state.role === "staff", party = staff && state.site === "party";
  if (state.role === "vip") return ({ network: "Experiences", bookings: "Book", profile: "My card" })[key] || dflt;
  if (party) return ({ network: "Browse", bookings: "Book", profile: "Party" })[key] || dflt;
  if (staff) return ({ network: "Our people", bookings: "Your bookings", profile: "Your business" })[key] || dflt;
  return key === "profile" ? "Profile" : dflt;
};



/* Training, Dream jobs and FF rewards cards: tap one and it turns over to its description. Both sites. */
function FlipChoice17({ kind, title, img, note, on, onClick }) {
  const [back, setBack] = useState(false);
  const key = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setBack(b => !b); } };
  const tick = (
    <button type="button" className="tick" aria-pressed={on} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {on ? <><S17I.Check size={13} strokeWidth={2.6} /> Interested</> : <><S17I.Plus size={13} /> I'm interested</>}
    </button>
  );
  return (
    <div className={`ff-fc17${back ? " back" : ""}`}>
      <div className="fi">
        <div className="ff-shine-img fr" role="button" tabIndex={back ? -1 : 0} aria-pressed={on} aria-label={`${title}: turn over`} onClick={() => setBack(true)} onKeyDown={key}>
          {img ? <img decoding="async" src={img} alt="" loading="eager" draggable="false" /> : <HomeScene kind="bar" />}
          <span className="shade" aria-hidden="true" />
          <span className="k">{kind}</span>
          <span className="tx"><span className="t">{title}</span>
          {note && <span className="d">{note}</span>}</span>
          {tick}
          {on && <span className="chk" aria-hidden="true"><S17I.Check size={13} strokeWidth={3} /></span>}
        </div>
        <div className="bk" role="button" tabIndex={back ? 0 : -1} aria-label={`${title}: turn back`} onClick={() => setBack(false)} onKeyDown={key}>
          <b className="bt">{title}</b>
          <p>{note}</p>
          {tick}
        </div>
      </div>
    </div>
  );
}



/* ---- v17.3.37: FireFlair package cards, the size of a featured company card, and the pop-up that books one ---- */
const PKICON17 = { bar: S17I.Martini, ent: S17I.Music, svc: S17I.Camera, food: S17I.UtensilsCrossed };


function PkgCard17({ svc, n, noun, match, on, onToggle, onInfo }) {
  const Ic = PKICON17[svc.cat] || S17I.Sparkles;
  return (
    <div className={`ff-pk17w${on ? " sel" : ""}`} data-pk17={svc.id} data-pk17-alt={svc.title === "BYOB" ? "byob" : ""}>
      <button type="button" className={`ff-lst ff-pk17 ${svc.tone || ""}${match ? " match" : ""}`} onClick={onToggle} aria-pressed={!!on} aria-label={`${svc.title}: ${on ? "selected" : "select"}`}>
        <span className="ph" style={svc.img ? { backgroundImage: `linear-gradient(rgba(10,8,8,.12),rgba(10,8,8,.55)), url(${svc.img})`, backgroundSize: "cover", backgroundPosition: "center 20%" } : undefined}>
          <span className="pl">{lvl17(svc.level)}</span>
          <span className="cn"><Coin size={30} tier="gold" /></span>
          <span className="ic"><Ic size={34} strokeWidth={1.4} /></span>
          {svc.price && !svc.noPrice && <span className="pr">{svc.price}</span>}
        </span>
        <span className="tx">
          <b>{svc.title}</b>
          <small className="tg">{svc.tagline}</small>
          {svc.includes && <span className="ft"><S17I.Sparkles size={12} /> {svc.includes}</span>}
          {svc.ideal && <span className="ft"><S17I.Star size={12} /> {svc.ideal}</span>}
          {svc.time && <span className="ft"><S17I.Clock size={12} /> {svc.time}</span>}
          {shop17(svc) && <span className="ft"><S17I.ShoppingBasket size={12} /> Shopping list for your cocktails</span>}
          <span className="ft rec"><S17I.Users size={12} /> Best for {recOf17(svc.bands)}</span>
          <span className="by">{svc.by ? svc.by : svc.mine ? "Your package" : n > 0 ? `${n} ${noun} to choose from` : "FF Party"}</span>
          <span className="go">{on ? <><S17I.Check size={13} strokeWidth={2.6} /> Selected</> : <>Select</>}</span>
        </span>
      </button>
      <button type="button" className="inf" aria-label={`${svc.title}: details`} onClick={onInfo}><S17I.Info size={16} strokeWidth={2} /></button>
    </div>
  );
}


function PkgSheet17({ svc, qual, onClose }) {
  const { state, dispatch } = useStore();
  const bk = bkOf17(state);
  const on = bk.pk.includes(svc.id);
  const Ic = PKICON17[svc.cat] || S17I.Sparkles;
  const feats = [...(svc.features || String(svc.includes || "").split(/,\s*|\s+and\s+/).filter(Boolean).map(x => x.charAt(0).toUpperCase() + x.slice(1))), ...(shop17(svc) ? ["We provide a shopping list for all of your selected cocktails"] : [])];
  const sf = state.svFav17 || [], inF = sf.includes(svc.id);
  const toggleF = () => { dispatch({ type: "V11_SET", patch: { svFav17: inF ? sf.filter(x => x !== svc.id) : [...sf, svc.id] } }); if (!inF) dispatch({ type: "TOAST", toast: `${svc.title} added to your favourites` }); };
  const toggle = () => {
    dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: pkFlip17(bk.pk, svc.id) } } });
    if (!on) dispatch({ type: "TOAST", toast: `${svc.title} added to your basket` });
    onClose();
  };
  return (
    <Sheet open onClose={onClose} title={svc.title}>
      <div className={`ff-pks17 ${svc.tone || ""}`}>
        <div className="hd">
          <span className="ic"><Ic size={30} strokeWidth={1.4} /></span>
          <span className="t"><small>{[lvl17(svc.level), svc.by || "FF Party"].filter(Boolean).join(" · ")}</small><b>{svc.title}</b></span>
          {svc.price && !svc.noPrice && <span className="pr">{svc.price}</span>}
        </div>
        <p className="tg">{svc.tagline}</p>
        <ul className="fx">{feats.map(f => <li key={f}><S17I.Check size={14} strokeWidth={2.6} /> {f}</li>)}</ul>
        {svc.id === "rtb_bar" && <RtbAddons17 />}
        <div className="mt">
          <span><S17I.Users size={13} /> Best for {recOf17(svc.bands)}</span>
          {svc.ideal && <span><S17I.Star size={13} /> {svc.ideal}</span>}
          {svc.time && <span><S17I.Clock size={13} /> {svc.time}</span>}
          {qual && <span className={`q ${qual}`}>{(QUALITY17.find(o => o.k === qual) || {}).label} preferred</span>}
        </div>
        {svc.id === "svc_full" && <div className="ff-br17-qual" role="group" aria-label="Preferred quality">
          {QUALITY17.map(o => <button key={o.k} type="button" className={`${o.k}${qual === o.k ? " on" : ""}`} aria-pressed={qual === o.k} onClick={() => dispatch({ type: "V11_SET", patch: { br17: { ...(state.br17 || {}), q: qual === o.k ? "" : o.k } } })}><b>{o.label}</b></button>)}
        </div>}
        <button type="button" className="ff-pks17-go" aria-pressed={on} onClick={toggle}>{on ? <><S17I.Check size={16} strokeWidth={2.6} /> In your basket</> : <><S17I.Plus size={16} /> Add to basket</>}</button>
        <button type="button" className={`ff-pks17-fav${inF ? " on" : ""}`} aria-pressed={inF} onClick={toggleF}><S17I.Heart size={16} fill={inF ? "currentColor" : "none"} /> {inF ? "In your favourites" : "Add to favourites"}</button>
      </div>
    </Sheet>
  );
}



/* ---- v17.3.57: Confirm your booking. The basket in two layers, the Event Card, the invoice and the confirm spin button. ---- */
function HostDrop17() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [open, setOpen] = useState(false);
  const save = () => { dispatch({ type: "COMPANY_SAVE", company: { cardSavedAt: Date.now(), joinedAt: c.joinedAt || Date.now() } }); dispatch({ type: "TOAST", toast: "VIP Host Card saved" }); setOpen(false); };
  return (
    <div className="ff-hc17">
      <button type="button" className="h" aria-expanded={open} onClick={() => setOpen(v => !v)}>
        <span className="cn"><Coin size={34} tier="gold" /></span>
        <span className="t"><b>Host info</b><small>We recommend you create a VIP Host Card to share your details.</small></span>
        <S17I.ChevronDown size={18} className="cv" />
      </button>
      {open && <div className="b"><PartyCard11 edit /><ConfirmSpin17 lines={["Save"]} label="Save VIP Host Card" onClick={save} /></div>}
    </div>);
}


function CbCard17({ icon, thumb, title, onX, sent }) {
  return (
    <div className="ff-mc has ff-cb17-c" role="listitem">
      <span className="faces"><span className="f ic">{thumb ? <img decoding="async" src={thumb} alt="" draggable={false} /> : icon}</span></span>
      <b>{title}</b>
      {onX && !sent && <button type="button" className="rm" aria-label={`Remove ${title}`} onClick={onX}><S17I.X size={11} strokeWidth={3} /></button>}
    </div>);
}


/* v17.3.126: "Get help with your event" on the Confirm page. Sends the Event Card to FireFlair as a request
   (saved in FF Admin, Areas and requests) so the team can help plan it. Collapsed by default. */
function EventHelp21({ d, ev }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const first = String(contactOf11(state, ev) || "").split(" \u00B7 ")[0] || "";
  const [contact, setContact] = useState(first);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const send = (e) => {
    e.preventDefault();
    const c = contact.trim(), ph = c.replace(/[^\d+]/g, "");
    if (!c || (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && ph.replace(/\D/g, "").length < 7)) { setErr("Add a phone number or email address."); return; }
    setErr("");
    const cur = fdOf(state), ref = "FD-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const isMail = c.includes("@");
    const bits = [d.title && "Event: " + d.title, d.kind && "Type: " + d.kind, d.guests && "Guests: " + d.guests, d.start && "Start: " + d.start, note.trim()].filter(Boolean);
    const rec = {
      id: uid("lsr"), ref, key: ref, kind: "event_card_help", siteKey: "party", locationId: null, locationText: (d.venue || "").trim() || "Not stated",
      roles: [], eventDate: d.iso || null, dateUndecided: !d.iso, tz: "Europe/London",
      contact: { name: "", email: isMail ? c : "", phone: isMail ? "" : c, whatsappOk: !isMail },
      headcount: d.guests || "", brief: bits.join(" | "), companyId: null, companyName: "",
      createdAt: new Date().toISOString(), status: "new", assignee: "", adminNote: "", eventId: ev ? ev.id : null,
      sourcePath: "", sourceSite: "party", notif: { admin: "simulated", ack: "simulated message", failed: false }, bookingId: null,
    };
    fdSet(state, dispatch, { requests: [rec, ...cur.requests], log: [{ at: rec.createdAt, by: "visitor", what: "event_card_help " + ref, site: "party" }, ...cur.log].slice(0, 200) });
    setDone(ref);
  };
  return (
    <div className="ff-cb17-sub ff-eh21">
      <button type="button" className="h" aria-expanded={open} onClick={() => setOpen(v => !v)}><span className="ic"><S17I.Sparkles size={16} strokeWidth={1.8} /></span><b>Get help with your event</b><S17I.ChevronDown size={18} className="cv" /></button>
      {open && <div className="b">
        {done ? <div role="status"><b>Sent. Reference {done}</b><p style={{ margin: "6px 0 0" }}>The FireFlair team will be in touch about your Event Card.</p></div> :
          <form onSubmit={send} noValidate style={{ display: "grid", gap: 10 }}>
            <label className="ff-ff wide"><span className="k">Phone or email</span><span className="in"><input value={contact} onChange={(e) => setContact(e.target.value)} aria-label="Phone or email" autoComplete="off" /></span></label>
            <label className="ff-ff wide"><span className="k">What do you need help with?</span><span className="in"><textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} aria-label="What do you need help with?" style={{ width: "100%", font: "inherit", border: 0, background: "transparent", resize: "vertical" }} /></span></label>
            {err && <p role="alert" style={{ margin: 0, color: "var(--burgundy, #8C1526)" }}>{err}</p>}
            <Btn variant="primary wide" onClick={send}>Send my Event Card</Btn>
          </form>}
      </div>}
    </div>);
}


function ConfirmBooking17({ ev, setView, bkey }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const info = flowInfo(state, ev);
  const shifts = info.shifts;
  const [d, setD] = useState(() => ({ ...eventDraft11(ev), band: bandOf11(ev), aud: (ev && ev.audience) || "" }));
  const set = (x) => setD(v => ({ ...v, ...x }));
  useEffect(() => {
    const any = d.iso || d.venue.trim() || d.title.trim() || d.kind || d.start || d.band || d.aud;
    if (!any) return;
    const t = setTimeout(() => {
      const ci = cleanIso11(d.iso);
      const data = { ...eventData11({ ...d, iso: ci.past ? ((ev && ev.iso) || "") : ci.iso }), band: "", audience: "", site: "party" };
      if (ev) {
        if (["title", "kind", "iso", "start", "venue", "guests", "band", "audience"].every(k => String(ev[k] || "") === String(data[k] || ""))) return;
        dispatch({ type: "EVENT_PATCH", id: ev.id, patch: data });
        shifts.forEach(sh => dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: { iso: data.iso, date: data.date, venue: data.venue, ...(sh.svcId && sh.svcTime ? { time: svcTimeFor({ time: sh.svcTime }, data.start) } : {}) } }));
      } else {
        const id = uid("evt");
        dispatch({ type: "EVENT_ADD", event: { id, ...data, phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } });
        dispatch({ type: "ACTIVE_EVENT", id });
        if ((state.req17 || {}).draft) dispatch({ type: "V11_SET", patch: { req17: { ...state.req17, [id]: state.req17.draft } } });
        setView({ eventId: id, keep: bkey });
      }
    }, 350);
    return () => clearTimeout(t);
  }, [d]);
  const pkgs = pkgsOf17(state);
  const evId = ev ? ev.id : "";
  const ck = Object.keys(((state.addons17 || {})[evId]) || {}).map(id => ALLCK17.find(y => y.id === id)).filter(Boolean);
  const xa = (((state.xa17 || {})[evId]) || []).map(id => ALLAX17.find(y => y.id === id)).filter(Boolean);
  const goBack = () => { dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); };
  const drop = (sh) => { dispatch({ type: "SHIFT_DELETE", id: sh.id }); const bk = bkOf17(state); dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: bk.pk.filter(x => x !== sh.svcId) } } }); };
  const dropCk = (id) => { const ao = state.addons17 || {}, cur = { ...(ao[evId] || {}) }; delete cur[id]; dispatch({ type: "V11_SET", patch: { addons17: { ...ao, [evId]: cur } } }); };
  const dropXa = (id) => { const xs = state.xa17 || {}; dispatch({ type: "V11_SET", patch: { xa17: { ...xs, [evId]: (xs[evId] || []).filter(x => x !== id) } } }); };
  const dropPerson = (sh, pid) => dispatch({ type: "SHIFT_STAFF", id: sh.id, staffIds: staffOf(sh).filter(x => x !== pid) });
  const sent = info.sent || (ev && paid17(state, ev.id));
  const [stripe, setStripe] = useState(false);
  const [open, setOpen] = useState({ s: true, p: true, e: true, r: true, i: true, f: true });
  const tg = (k) => setOpen(o => ({ ...o, [k]: !o[k] }));
  const missing = [];
  if (!shifts.length) missing.push({ t: "Choose your package first", go: goBack });
  else if (!shifts.every(staffPlanned)) missing.push({ t: "Choose who delivers it", go: goBack });
  if (!d.iso || !d.venue.trim()) missing.push({ t: "Add the date and location", go: () => focusSec("ff-cb17-event") });
  if (!String(contactOf11(state, ev)).trim()) missing.push({ t: "Add your phone number", go: () => { const el = document.getElementById("ff-bill-phone"); if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); el.focus(); } } });
  const nSend = new Set(shifts.flatMap(staffOf)).size + shifts.filter(sh => sh.route === "auto").length;
  const confirm = () => {
    if (missing.length) { dispatch({ type: "TOAST", toast: missing[0].t }); missing[0].go(); return; }
    setStripe(true); /* Stripe pay window; the requests go out only once it reports paid */
  };
  const afterPay = () => {
    setStripe(false);
    dispatch({ type: "BOOK_SEND", eventId: ev.id, questions: [] });
    dispatch({ type: "TOAST", toast: `Booking confirmed. Availability requests sent to ${nSend} ${nSend === 1 ? "person" : "people"} on WhatsApp` });
  };
  const gev = ev || { id: "draft", ...eventData11({ ...d }), phone: "", email: "", questionIds: [] };
  const no = "FF-" + (String(gev.id || "").replace(/\D/g, "").slice(-5) || "00001");
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const box = (k, n, id, title, count, children, cls) => (
    <div className={`ff-bsec ${cls} ff-cb17-box`} id={id} key={k}>
      <button type="button" className="ff-bsec-h tap" aria-expanded={open[k]} onClick={() => tg(k)}><span className="n">{n}</span><b>{title}</b>{count ? <em>{count}</em> : null}<span className="dd"><S17I.ChevronDown size={18} className="cv" /></span></button>
      {open[k] && <div className="ff-cb17-in">{children}</div>}
    </div>);
  const sub = (k, Ic, title, children) => (
    <div className="ff-cb17-sub" key={k}>
      <button type="button" className="h" aria-expanded={open[k]} onClick={() => tg(k)}><span className="ic"><Ic size={16} strokeWidth={1.8} /></span><b>{title}</b><S17I.ChevronDown size={18} className="cv" /></button>
      {open[k] && <div className="b">{children}</div>}
    </div>);
  const arrow = (j) => <div className={`ff-barrow j${j}`} aria-hidden="true"><S17I.ChevronDown size={20} strokeWidth={2.4} /></div>;
  const nSvc = shifts.length + ck.length + xa.length, nPeople = new Set(shifts.flatMap(staffOf)).size + shifts.filter(sh => sh.route === "auto").length;
  const payments = ["Apple Pay", "Google Pay", "Card"];
  return (
    <section className="ff-bbox ff-pb ff-cb17" aria-label="Confirm your booking">
      {box("e", 1, "ff-cb17-event", "Event Card", "", <div className="ff-evwrap"><EventCard11 ev={d} edit onPatch={(x) => set(x)} /></div>, "s3")}
      <EventHelp21 d={d} ev={ev} />
      {arrow(1)}
      {box("s", 2, "ff-cb17-svc", "Services", nSvc ? `${nSvc} chosen` : "", <>
        <div className="ff-mbasket ff-cb17-bar"><div className="ff-mc-row" role="list" aria-label="Services">
          {shifts.map(sh => { const svc = pkgs.find(y => y.id === sh.svcId); const Ic = (svc && PKICON17[svc.cat]) || S17I.Sparkles; return <CbCard17 sent={sent} key={sh.id} icon={<Ic size={24} strokeWidth={1.5} />} title={sh.role} onX={() => drop(sh)} />; })}
          {ck.map(x => <CbCard17 sent={sent} key={x.id} thumb={x.photo} icon={<S17I.Martini size={24} strokeWidth={1.5} />} title={x.name} onX={() => dropCk(x.id)} />)}
          {xa.map(x => <CbCard17 sent={sent} key={x.id} icon={<x.Ic size={24} strokeWidth={1.5} />} title={x.title} onX={() => dropXa(x.id)} />)}
          {!sent && <button type="button" role="listitem" className="ff-mc add" onClick={goBack} aria-label="Add a package"><span className="faces"><span className="empty"><S17I.Plus size={18} strokeWidth={2.4} /></span></span><b>Add</b></button>}
        </div></div></>, "s1")}
      {arrow(2)}
      {box("p", 3, "ff-cb17-people", "People", nPeople ? `${nPeople} chosen` : "", <>
        <div className="ff-mbasket ff-cb17-bar"><div className="ff-mc-row" role="list" aria-label="People">
          {shifts.flatMap(sh => [
            ...staffOf(sh).map(pid => { const p = findPerson(all, state, pid); return p && <CbCard17 sent={sent} key={sh.id + pid} thumb={p.photo} icon={<S17I.Users size={24} />} title={firstName(p.name)} onX={engFor(state, sh.id, pid) ? null : () => dropPerson(sh, pid)} />; }),
            sh.route === "auto" && <CbCard17 sent={sent} key={sh.id + "auto"} icon={<Coin size={34} tier="gold" />} title="Auto match" onX={() => dispatch({ type: "SHIFT_PATCH", id: sh.id, patch: { route: "" } })} />,
          ]).filter(Boolean)}
          {!sent && <button type="button" role="listitem" className="ff-mc add" onClick={goBack} aria-label="Choose people"><span className="faces"><span className="empty"><S17I.Plus size={18} strokeWidth={2.4} /></span></span><b>Add</b></button>}
        </div></div></>, "s2")}
      {arrow(3)}
      {box("r", 4, "ff-cb17-review", "Review your order", "", sent && ev ? <ConfirmPanel ev={ev} shifts={shifts} missing={missing} onClose={() => {}} /> : <>
        {sub("i", S17I.FileText, "Invoice and event guide", <EventGuide ev={gev} shifts={shifts} stamp="Preview" />)}
        {sub("f", S17I.Receipt, "FireFlair invoice", <FFInvoice11 shifts={shifts} no={no} today={today} contact={contactOf11(state, ev)} />)}
      </>, "s4")}
      {!sent && <>
        {arrow(3)}
        <div className="ff-cb17-cf">
          <ConfirmSpin17 lines={["Confirm", "booking"]} onClick={confirm} />
          {stripe && <StripePay17 total={POLICY17.feeParty} reference={ev ? ev.id : "draft"} onClose={() => setStripe(false)} onPaid={afterPay} />}
        </div></>}
      <HostDrop17 />
    </section>);
}
