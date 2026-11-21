/* src/components/party/terms-and-packages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* FF Team profile: the terms a business sees when it hires you. Five points, ready to use, all editable. */
const MY_TERMS17 = [
  { k: "pay", label: "Payment", text: "Cash is preferred. If you are paying by bank transfer, please use the bank details I provide when the booking is confirmed." },
  { k: "tax", label: "Tax and self-employment", text: "I work as a self-employed freelancer. I am responsible for my own tax and National Insurance, and I am not an employee of the business that books me." },
  { k: "safe", label: "Emergency contact and safety", text: "I am responsible for my own health and safety while I work. If I am unwell or unable to respond, please call my emergency contact, whose name and number I provide with each booking." },
  { k: "kit", label: "Uniform and arrival", text: "My preferred uniform is a black shirt, black trousers and black shoes, unless the event asks for something different. I will arrive ready to work, within 10 minutes of the shift start time." },
  { k: "food", label: "Food and dietary needs", text: "I appreciate being fed on shifts longer than 4 hours, and a meal provided will cover my break period. I have no allergies and I am happy to eat everything." },
];


/* v17.5.1: the terms shown when you sign up to FF Party packages, and when you save your FF Staff shift rates. How the platform works, in five points each. */
const PARTY_PKG_TERMS17 = [
  { k: "how", label: "How packages work", text: "A package is a fixed offer that clients book on FF Party. Every package shows what you earn before you sign up: FireFlair sets it on FireFlair packages, and you set it on your own. By signing up you agree to that amount." },
  { k: "boss", label: "You are your own boss", text: "You work as a self-employed freelancer. You deal directly with the client, and FireFlair is here to support you. FireFlair is not your employer." },
  { k: "book", label: "Bookings", text: "When a client books a package, FireFlair invites you on WhatsApp. The booking is yours once you accept, and not before." },
  { k: "cancel", label: "Cancelling", text: "If you cannot make a booking, tell the client and FireFlair as early as you can. Late cancellations affect your reputation on FireFlair." },
  { k: "work", label: "Standards and reviews", text: "Arrive on time, dressed as agreed, and deliver the package as it is described. Clients can review you afterwards, and your reviews appear on your profile." },
];


const STAFF_SHIFT_TERMS17 = [
  { k: "how", label: "How shifts work", text: "Businesses create shift cards and set the pay rate for each shift. Your preferred rate is a guide that businesses see on FF Staff. It does not set the rate for a shift." },
  { k: "invite", label: "Invitations", text: "When a business invites you to a shift, FireFlair sends you a WhatsApp message with the details. You are only booked once you accept." },
  { k: "boss", label: "Self-employed", text: "You work as a self-employed freelancer and are responsible for your own tax. The business that books you is not your employer, and neither is FireFlair." },
  { k: "cancel", label: "Cancelling", text: "If you can no longer work a shift, tell the business and FireFlair as early as you can. Late cancellations affect your reputation on FireFlair." },
  { k: "rep", label: "Reputation", text: "Businesses can review you after a shift. Turning up on time and doing great work builds your reputation and gets you booked again." },
];


/* FF Team terms, the way FF Staff shows them: a card for each set of terms. Tap one to read and edit its five points in a pop-up. */
const TERM_SETS17 = {
  mine: { key: "myTerms17", title: "Personal T&Cs", note: "Shown when a business hires you.", head: "Personal terms and conditions", list: MY_TERMS17 },
  service: { key: "svcTerms17", title: "Service card T&Cs", note: "Shown when a client books one of your service cards.", head: "Service card terms and conditions", list: TERMS17 },
};


/* NET188 round 2: the terms for the member's own Signature package (five suggested points, all editable). Not in TERM_SETS17, so the bar's pop-up does not list it. */
const TERM_SETS188 = {
  pkg: { key: "pkgTerms188", title: "Signature package T&Cs", note: "", head: "Terms and conditions", list: PARTY_PKG_TERMS17, rows: 2 },
};

function TermsSheet17({ set, onClose }) {
  const { state, dispatch } = useStore();
  const S = TERM_SETS17[set] || TERM_SETS188[set];
  const [terms, setTerms] = useState(() => ({ ...Object.fromEntries(S.list.map(t => [t.k, t.text])), ...(state[S.key] || {}) }));
  const save = () => { dispatch({ type: "V11_SET", patch: { [S.key]: terms } }); dispatch({ type: "TOAST", toast: "Terms saved to your profile" }); onClose(); };
  return (
    <Sheet center open onClose={onClose} title={S.head}>
      {S.note && <p className="ff-fp" style={{ margin: "0 0 10px" }}>{S.note}</p>}
      <div className="ff-tc5">
        {S.list.map((t, i) => (
          <label key={t.k}><span><b>{i + 1}</b>{t.label}</span>
            <textarea rows={S.rows || 3} value={terms[t.k] || ""} maxLength={500} aria-label={t.label} onChange={(e) => setTerms({ ...terms, [t.k]: e.target.value })} /></label>
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


/* NET188 (Alex 21 Nov): Terms and conditions from the bar's second button: a centred pop-up holding the two term sets; tapping one swaps it for that set's editor (never two pop-ups at once). */
function TermsPop188({ open, onClose }) {
  const [set, setSet] = useState(null);
  const def = { label: "Terms and conditions", singular: "Terms", icon: "qualification", fields: ["description"] };
  if (set) return <TermsSheet17 set={set} onClose={() => { setSet(null); onClose(); }} />;
  return (
    <Sheet center open={open} onClose={onClose} title="Terms and conditions">
      <HScroll label="Terms and conditions">
        {Object.entries(TERM_SETS17).map(([k, S]) => <InformationCard key={k} record={{ ...makeRecord("terms", S.title), id: `tc_${k}`, description: S.note }} def={def} themeKey="onyx" editable onClick={() => setSet(k)} />)}
      </HScroll>
    </Sheet>
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




/* Tab names, by site: FF Party is Home, Browse, Book, Party. FF Staff is Home, Our people, Your bookings, Your business. */
const tabLabel17 = (key, state, dflt) => {
  const staff = state.role === "staff", party = staff && state.site === "party";
  if (state.role === "vip") return ({ network: "Experiences", bookings: "Book", profile: "My card" })[key] || dflt;
  if (party) return ({ network: "Browse", bookings: "Book", profile: "Party" })[key] || dflt;
  if (staff) return ({ network: "Our people", bookings: "Your bookings", profile: "Your business" })[key] || dflt;
  return key === "profile" ? "Profile" : dflt;
};


/* Training, Dream jobs and FF Rewards cards (FF Team Bookings and FF Staff). The photo is the top half of the card and
   only the title sits on it; the label, the description and the button are below, on the solid card.
   `pos` is the photo's object-position (where its subject is), so a crop never cuts a head. */
function FlipChoice17({ kind, title, img, pos, note, on, onClick }) {
  return (
    <div className={`ff-fc17${on ? " on" : ""}`}>
      <div className="ph">
        {img ? <img decoding="async" src={img} alt="" loading="lazy" draggable="false" style={pos ? { objectPosition: pos } : undefined} /> : <HomeScene kind="bar" />}
        <span className="t">{title}</span>
        {on && <span className="chk" aria-hidden="true"><S17I.Check size={13} strokeWidth={3} /></span>}
      </div>
      <div className="bd">
        {kind && <span className="k">{kind}</span>}
        {note && <p className="d">{note}</p>}
        <button type="button" className="tick" aria-pressed={on} aria-label={`${title}: ${on ? "interested" : "I'm interested"}`} onClick={onClick}>
          {on ? <><S17I.Check size={13} strokeWidth={2.6} /> Interested</> : <><span className="pl" aria-hidden="true"><S17I.Plus size={13} /></span> I'm interested</>}
        </button>
      </div>
    </div>
  );
}


















function CbCard17({ icon, thumb, title, onX, sent, gold }) {
  return (
    <div className={`ff-mc has ff-cb17-c${gold ? " tbf" : ""}`} role="listitem">
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

