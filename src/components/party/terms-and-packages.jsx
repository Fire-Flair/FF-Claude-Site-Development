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
  { k: "how", label: "How packages work", text: "A package is a fixed offer that clients book on FFParty. Every package shows what you earn before you sign up: FireFlair sets it on FireFlair packages, and you set it on your own. By signing up you agree to that amount." },
  { k: "boss", label: "You are your own boss", text: "You work as a self-employed freelancer. You deal directly with the client, and FireFlair is here to support you. FireFlair is not your employer." },
  { k: "book", label: "Bookings", text: "When a client books a package, FireFlair invites you on WhatsApp. The booking is yours once you accept, and not before." },
  { k: "cancel", label: "Cancelling", text: "If you cannot make a booking, tell the client and FireFlair as early as you can. Late cancellations affect your reputation on FireFlair." },
  { k: "work", label: "Standards and reviews", text: "Arrive on time, dressed as agreed, and deliver the package as it is described. Clients can review you afterwards, and your reviews appear on your profile." },
];


const STAFF_SHIFT_TERMS17 = [
  { k: "how", label: "How shifts work", text: "Businesses create shift cards and set the pay rate for each shift. Your preferred rate is a guide that businesses see on FFStaff. It does not set the rate for a shift." },
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


/* v1.189 (Alex 21 Nov 10:53): the core terms of a member's OWN Signature packages: ONE set of five for all of them. A separate
   constant, so PARTY_PKG_TERMS17 (the FFParty package sign-up terms and FireFlair packages' Details) stays word for word.
   Wording: Elrond's /home/claude/orders/NET189/elrond/signature-terms-v189.md, pasted word for word. */
const SIGNATURE_TERMS189 = [
  { k: "how", label: "How packages work", text: "This package is a fixed offer that clients book on FFParty. I set its amount, and it is shown before you book. By offering the package, I agree to that amount." },
  { k: "boss", label: "Self-employed", text: "I work as a self-employed freelancer. I deal with you directly, and FireFlair supports me. FireFlair is not my employer." },
  { k: "book", label: "Bookings", text: "When you book this package, FireFlair sends me an invitation on WhatsApp. The booking is confirmed once I accept, and not before." },
  { k: "cancel", label: "Cancelling", text: "If I cannot make a booking, I will tell you and FireFlair as early as I can. Late cancellations affect my reputation on FireFlair." },
  { k: "work", label: "Standards and reviews", text: "I will arrive on time, dressed as agreed, and deliver the package as it is described. You can review me afterwards, and your review appears on my profile." },
];

/* The five core terms as the member has them: saved values (state.pkgTerms188), else the defaults above. */
const sigCoreTerms189 = (state) => SIGNATURE_TERMS189.map(t => ({ ...t, text: ((state.pkgTerms188 || {})[t.k]) != null ? state.pkgTerms188[t.k] : t.text }));

/* One box per Signature package: the tab's package label, used when the package has no typed name yet. */
const SIG_TAB_LABEL189 = { bar: "Bar package", ent: "Entertainment package", svc: "Services package" };


/* NET188 round 2: the terms for the member's own Signature package (five points, all editable). Not in TERM_SETS17, so the bar's pop-up does not list it. */
const TERM_SETS188 = {
  pkg: { key: "pkgTerms188", title: "Signature package T&Cs", note: "", head: "Terms and conditions", list: SIGNATURE_TERMS189 },
};

/* v1.189 (Alex 21 Nov 10:53): a text box that grows with its text, so the whole text shows and nothing scrolls inside it. */
function GrowTA189({ value, onChange, label, maxLength }) {
  const ref = useRef(null);
  const fit = () => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; };
  React.useLayoutEffect(() => {
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [value]);
  return <textarea ref={ref} data-no-grow rows={1} value={value} maxLength={maxLength} aria-label={label} onChange={onChange} />;
}

/* v1.190 (Alex 21 Nov 12:52): the standard T's and C's, one box and one pop-up wherever terms appear.
   TcBox190 is the closed box (Aragorn's option B); TcPop190 is the pop-up (option C) with the row of term sets from option B on top.
   Own screens: Personal, Service card and Signature are editable in place; accept mode: the FF Party package terms, read only. */
const TC190I = {
  Scroll: lucideIcon("ScrollText"), Check: lucideIcon("Check"), Doc: lucideIcon("FileText"), Cal: lucideIcon("CalendarDays"),
  XC: (props) => { const A = lucideIcon("CircleX"), B = lucideIcon("XCircle"); return window.lucide && window.lucide.icons && window.lucide.icons.CircleX ? <A {...props} /> : <B {...props} />; },
};
const TC190_SETS = {
  mine: { name: "Personal", pdf: true, key: "myTerms17", list: MY_TERMS17 },
  service: { name: "Service card", pdf: true, key: "svcTerms17", list: TERMS17 },
  pkg: { name: "Signature", pdf: false, key: "pkgTerms188", list: SIGNATURE_TERMS189 },
  party: { name: "FF Party packages", pdf: true, key: null, list: PARTY_PKG_TERMS17 },
};
const TC190_PDF = "#";
/* v1.190 (Alex 21 Nov 13:17): the green tick on each of the five terms is off; the only tick left is on Agree. Set true to show them again. */
const TC190_TERM_TICKS = false;

function TcBox190({ sets, start }) {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const ag = state.tcAgreed190 || {};
  const done = ag[start];
  return (
    <>
      <style>{PROFILE_PACKAGES_CSS}</style>
      <button type="button" className="tc190-box" onClick={() => setOpen(true)}>
        <span className="ic"><TC190I.Scroll size={26} aria-hidden="true" /></span><span className="lb">T's and C's</span>
        {done && <span className="st" aria-label="Agreed"><TC190I.Check size={13} strokeWidth={3} aria-hidden="true" /></span>}
      </button>
      {open && <TcPop190 sets={sets} start={start} mode="own" onClose={() => setOpen(false)} />}
    </>
  );
}

function TcPop190({ sets, start, mode = "own", onAccept, onClose }) {
  const { state, dispatch } = useStore();
  const accept = mode === "accept";
  const own = !accept;
  const [sel, setSel] = useState(start || sets[0]);
  const initTerms = (k) => { const S = TC190_SETS[k]; return { ...Object.fromEntries(S.list.map(t => [t.k, t.text])), ...(S.key ? (state[S.key] || {}) : {}) }; };
  const [edits, setEdits] = useState(() => Object.fromEntries(sets.filter(k => TC190_SETS[k].key).map(k => [k, initTerms(k)])));
  const account = own ? qaAccount17(state) : null;
  const groups = own ? ownPkgGroups185(state) : [];
  const tabs = groups.length ? groups : ["bar"];
  const pkName = (tab) => { const a = account ? qaAnswer17(state, account, pkcOwnQid17(tab)) : null; const n = a && !a.withdrawnAt && a.typed && a.typed.name; return n ? String(n) : SIG_TAB_LABEL189[tab]; };
  const [pk, setPk] = useState(() => Object.fromEntries(tabs.map(t => [t, (state.sigPkgTerms189 || {})[t] || ""])));
  const ag = state.tcAgreed190 || {};
  const S = TC190_SETS[sel];
  const cur = edits[sel] || {};
  const cal = V101.support20Url();
  const agree = () => {
    if (accept) { if (onAccept) onAccept(); return; }
    const patch = { tcAgreed190: { ...ag, [sel]: true } };
    sets.forEach(k => { const SS = TC190_SETS[k]; if (SS.key) patch[SS.key] = edits[k]; });
    if (sets.includes("pkg")) patch.sigPkgTerms189 = { ...(state.sigPkgTerms189 || {}), ...pk };
    dispatch({ type: "V11_SET", patch }); dispatch({ type: "TOAST", toast: "Terms saved to your profile" }); onClose();
  };
  const foot = (
    <div className="tc190-foot">
      <button type="button" className="tc190-act yes" onClick={agree}><span className="dot"><TC190I.Check size={13} strokeWidth={3} aria-hidden="true" /></span><span>Agree</span></button>
      <button type="button" className="tc190-act" onClick={onClose}><TC190I.XC size={21} aria-hidden="true" /><span>Decline</span></button>
      {cal && <a className="tc190-act" href={cal} target="_blank" rel="noopener noreferrer"><TC190I.Cal size={21} aria-hidden="true" /><span>Book a meeting</span></a>}
    </div>
  );
  return (
    <Sheet center open onClose={onClose} title="Terms and conditions" noX foot={foot} sheetClass="tc190-sheet" icon={<span className="tc190-badge"><TC190I.Scroll size={21} aria-hidden="true" /></span>}>
      <div className="tc190">
        <style>{PROFILE_PACKAGES_CSS}</style>
        <div className="tc190-sets" role="tablist" aria-label="Terms and conditions">
          {sets.map(k => { const SS = TC190_SETS[k]; const on = k === sel; const yes = !!ag[k];
            return (
              <button key={k} type="button" role="tab" aria-selected={on} className={`tc190-set${on ? " on" : ""}`} onClick={() => setSel(k)}>
                <span className="nm">{SS.name}</span>
                <span className="row">
                  {SS.pdf ? <span className="pf"><TC190I.Doc size={21} aria-hidden="true" /><span className="w">Full PDF</span></span> : <span />}
                  {(own && yes) ? <span className="st y" aria-label="Agreed"><TC190I.Check size={13} strokeWidth={3} aria-hidden="true" /></span> : <span className="st n" aria-label="Not agreed yet"><TC190I.XC size={21} aria-hidden="true" /></span>}
                </span>
              </button>);
          })}
        </div>
        <div className={`tc190-terms${TC190_TERM_TICKS ? "" : " no-tick"}`} role="list" aria-label={S.name}>
          {S.list.map((t, i) => (
            <div key={t.k} role="listitem" className="tc190-term">
              <span className="no">{i + 1}</span><span className="lb">{t.label}</span>
              {TC190_TERM_TICKS && <span className="ok" aria-hidden="true"><TC190I.Check size={13} strokeWidth={3} /></span>}
              {own
                ? <div className="tx"><GrowTA189 value={cur[t.k] || ""} maxLength={500} label={t.label} onChange={(e) => setEdits({ ...edits, [sel]: { ...cur, [t.k]: e.target.value } })} /></div>
                : <p className="tx">{t.text}</p>}
            </div>
          ))}
          {own && sel === "pkg" && tabs.map(tab => (
            <div key={"pk-" + tab} role="listitem" className="tc190-term pk">
              <span className="lb">{pkName(tab)}</span>
              <div className="tx"><GrowTA189 value={pk[tab] || ""} maxLength={600} label={pkName(tab)} onChange={(e) => setPk({ ...pk, [tab]: e.target.value.slice(0, 600) })} /></div>
            </div>
          ))}
        </div>
        <a className="tc190-pdf" href={TC190_PDF} onClick={(e) => e.preventDefault()}><TC190I.Doc size={21} aria-hidden="true" /><span>Full terms and conditions (PDF)</span></a>
      </div>
    </Sheet>
  );
}


/* v1.190: the member's finished profile shows the standard box (was two cards). Collapsed by default, as every box on the site. */
function PersonalTerms17() {
  const [open, setOpen] = useState(false);
  const { state } = useStore();
  const sets = ["mine", "service", ...(ownPkgGroups185(state).length > 0 ? ["pkg"] : [])];
  return (
    <section className="ff-cr17 ff-mt17" aria-label="Terms and conditions">
      <StaffBox id="ff-cr17-terms" icon={E17I.Layers} title="Terms and conditions" open={open} onToggle={() => setOpen(o => !o)}><div className="tc190-wrap"><TcBox190 sets={sets} start="mine" /></div></StaffBox>
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



/* v1.190 (Alex 21 Nov 13:17): the standard T's and C's box at the bottom of the Overview tab of the finished profile (the Packages tab no longer shows terms boxes; PersonalTerms17 and the term data stay for later reuse). */
function ProfileTc190() {
  const { state } = useStore();
  const sets = ["mine", "service", ...(ownPkgGroups185(state).length > 0 ? ["pkg"] : [])];
  return <div className="tc190-wrap tc190-ov"><TcBox190 sets={sets} start="mine" /></div>;
}
