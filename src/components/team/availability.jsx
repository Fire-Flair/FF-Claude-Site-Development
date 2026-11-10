/* src/components/team/availability.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const AVAIL_OPTIONS = ["Yes", "No", "Maybe"];


const availQ = (iso) => ({ id: `av_${iso}`, iso, group: "availability", type: "choice", options: AVAIL_OPTIONS, xp: 0, public: false,
  text: `Are you available on ${longDay(iso) || "this date"}?` });


/* Answers some of the sample people have already given, so "Check
   availability" can show an instant answer. */
const AVAIL_DEMO = {
  stf_sam: { "2026-11-15": "Yes", "2026-12-12": "Yes", "2026-12-19": "Yes", "2026-12-24": "No", "2026-12-31": "Yes" },
  stf_pri: { "2026-11-15": "Yes", "2026-12-12": "Maybe", "2026-12-31": "Yes" },
  stf_mia: { "2026-11-15": "Yes", "2026-12-12": "No" },
  stf_tom: { "2026-12-12": "Yes", "2026-12-31": "Yes" },
  stf_ava: { "2026-11-15": "Yes", "2026-12-19": "Yes" },
  stf_fre: { "2026-12-12": "Yes" },
  stf_leo: { "2026-12-19": "Maybe" },
};


/* What a person has said about a date: null if nobody's asked yet. */
function availabilityFor(state, personId, iso) {
  if (!iso) return null;
  if (personId === "me") { const v = (state.profile.answers || {})[`av_${iso}`]; return isAnswered(v) ? { answer: v, source: "card" } : null; }
  const asked = (state.availabilityAsks || []).filter(x => x.personId === personId && x.iso === iso && x.answer).slice(-1)[0];
  if (asked) return { answer: asked.answer, source: "asked", at: asked.answeredAt };
  const demo = (AVAIL_DEMO[personId] || {})[iso];
  return demo ? { answer: demo, source: "card" } : null;
}


const availTone = (a) => a === "Yes" ? "ok" : a === "No" ? "bad" : "warn";


const availWord = (a, name) => a === "Yes" ? `${name} is available` : a === "No" ? `${name} isn't available` : `${name} might be available`;



/* Availability requests sent to you (sample: one from a company), each an
   Availability Card waiting for your answer. */
const AVAIL_ASKED_DEMO = [{ id: "avx_loft", iso: "2026-12-12", byName: "Vooshka Cocktail Bar", byCompany: "co_vooshka", at: Date.UTC(2026, 9, 22) }];


function availabilityAskedOfMe(state) {
  const mine = (state.availabilityAsks || []).filter(x => x.personId === "me");
  return [...(state.role === "team" || state.profile.live ? AVAIL_ASKED_DEMO : []), ...mine];
}



function AddAvailabilityTile({ onClick }) {
  return (
    <button type="button" className="ff-qadd ff-avadd" onClick={onClick} style={{ width: CARD_W.question }} aria-label="Add a date">
      <span className="ff-qadd-plus"><I11.Plus size={26} strokeWidth={2} /></span>
      <b>Add a date</b>
      <small>Say if you're free, before anyone asks.</small>
    </button>
  );
}



function AddAvailabilitySheet({ open, onClose, initialIso }) {
  const { state, dispatch } = useStore();
  const [iso, setIso] = useState("");
  useEffect(() => { if (open) setIso(initialIso || ""); }, [open]);
  if (!open) return null;
  const prev = iso ? (state.profile.answers || {})[`av_${iso}`] : undefined;
  const save = (v) => {
    dispatch({ type: "ANSWER", qid: `av_${iso}`, value: v });
    dispatch({ type: "TOAST", toast: `Saved · ${shortDay(iso)}: ${v}` });
    onClose();
  };
  return (
    <Sheet open onClose={onClose} title="Availability Card">
      <Field label="Date">
        <input className="ff-input" type="date" min={TODAY_ISO} value={iso} onChange={(e) => setIso(e.target.value)} aria-label="Date" />
      </Field>
      {iso && <p className="ff-body" style={{ margin: "0 0 10px", fontWeight: 700, fontSize: 16 }}>Are you available on {longDay(iso)}?</p>}
      <div className="ff-av-opts">
        {AVAIL_OPTIONS.map(o => (
          <button key={o} type="button" className={`ff-av-opt ${availTone(o)}${prev === o ? " on" : ""}`} disabled={!iso} onClick={() => save(o)}>{o}</button>
        ))}
      </div>
      <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "12px 0 0" }}>
        Saved with your other answers. When a business asks about this date, they see your answer straight away. You can change it at any time.
      </p>
    </Sheet>
  );
}



/* FF Team Bookings: your Availability Cards. */
function AvailabilityCards() {
  const { state } = useStore();
  const [adding, setAdding] = useState(false);
  const [openQ, setOpenQ] = useState(null);
  const answers = state.profile.answers || {};
  const asked = availabilityAskedOfMe(state).filter(x => !isPast(x.iso));
  const askedIsos = asked.map(x => x.iso);
  const mine = Object.keys(answers).filter(k => k.startsWith("av_") && isAnswered(answers[k])).map(k => k.slice(3))
    .filter(iso => !askedIsos.includes(iso) && !isPast(iso)).sort();
  const todo = asked.filter(x => !isAnswered(answers[`av_${x.iso}`]));
  const askedDone = asked.filter(x => isAnswered(answers[`av_${x.iso}`]));
  const card = (iso, extra = {}) => {
    const q = availQ(iso);
    return <QuestionCard key={q.id + (extra.key || "")} q={q} answer={answers[q.id]} label="Availability" onClick={() => setOpenQ(q)} {...extra} />;
  };
  return (
    <div className="ff-av-panel">
      <div className="ff-qa-subh">
        <span className="ff-qa-ic ff-av-ic"><I11.CalendarCheck size={14} /></span>
        <b>Availability Cards</b>
        {todo.length > 0 && <span className="ff-pill gold">{todo.length} to answer</span>}
      </div>
      <p className="ff-qa-note">Answer once and it's saved. When a business asks if you're free on a date you've answered, your answer is already there. Requests also come to you on WhatsApp.</p>
      <HScroll label="Availability Cards" snap>
        <AddAvailabilityTile onClick={() => setAdding(true)} />
        {todo.map(x => card(x.iso, { asker: `Asked by ${x.byName}${x.at ? ` · ${askedOn(x.at)}` : ""}`, pending: "Tap to answer" }))}
        {askedDone.map(x => card(x.iso, { asker: `Asked by ${x.byName}` }))}
        {mine.map(iso => card(iso))}
      </HScroll>
      <AddAvailabilitySheet open={adding} onClose={() => setAdding(false)} />
      <QuestionSheet open={!!openQ} q={openQ} onClose={() => setOpenQ(null)} />
    </div>
  );
}



/* On someone's profile: Check availability. If they've answered for that
   date, the answer shows at once; if not, an Availability Card goes to them
   on WhatsApp and the answer comes back here. */
function CheckAvailabilitySheet({ open, person, onClose }) {
  const { state, dispatch } = useStore();
  const ev = state.events.find(e => e.id === state.activeEventId);
  const [iso, setIso] = useState("");
  const [sent, setSent] = useState(null);
  useEffect(() => { if (open) { setIso(ev && ev.iso && !isPast(ev.iso) ? ev.iso : ""); setSent(null); } }, [open]);
  if (!open || !person) return null;
  const name = firstName(person.name);
  const known = availabilityFor(state, person.id, iso);
  const pending = (state.availabilityAsks || []).find(x => x.personId === person.id && x.iso === iso && !x.answer);
  const send = () => {
    const ask = { id: uid("avq"), personId: person.id, iso, byId: "me", byName: meLabel(state), at: Date.now(), answer: null };
    dispatch({ type: "AVAIL_ASK", ask });
    setSent(ask);
  };
  const preview = (a) => { dispatch({ type: "AVAIL_ASK_PATCH", id: (sent || pending).id, patch: { answer: a, answeredAt: Date.now() } }); dispatch({ type: "TOAST", toast: `${name} answered: ${a}` }); };
  const live = sent || pending;
  return (
    <Sheet open onClose={onClose} title="Check availability">
      <Field label={`Which date would you like to book ${name} for?`}>
        <input className="ff-input" type="date" min={TODAY_ISO} value={iso} onChange={(e) => { setIso(e.target.value); setSent(null); }} aria-label="Date" />
      </Field>
      {iso && known ? (
        <div className={`ff-av-result ${availTone(known.answer)}`}>
          <span className="big">{known.answer}</span>
          <span><b>{availWord(known.answer, name)} on {longDay(iso)}.</b><br />
            {known.source === "card" ? `${name} answered this on an Availability Card, so you don't need to ask.` : `${name} answered your Availability Card.`}</span>
        </div>
      ) : iso && live ? (<>
        <WhatsAppPreview lines={[`FireFlair · ${live.byName} would like to know:`, `Are you available on ${longDay(iso)}?`]} buttons={AVAIL_OPTIONS} />
        <p className="ff-body" style={{ fontSize: 13, margin: "10px 0 0" }}>Sent to {name} on WhatsApp. Their answer shows here and is saved to their Availability Cards.</p>
        <div className="ff-preview" style={{ marginTop: 10 }}>
          <span className="ff-label" style={{ fontSize: 8.5 }}>Prototype preview</span>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {AVAIL_OPTIONS.map(o => <button key={o} onClick={() => preview(o)}>{name}: {o}</button>)}
          </div>
        </div>
      </>) : iso ? (<>
        <p className="ff-body" style={{ margin: "0 0 12px" }}>{name} hasn't answered for {longDay(iso)} yet.</p>
        <Btn variant="primary wide" onClick={send}><WhatsAppIcon size={15} /> Send an Availability Card</Btn>
      </>) : <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 13 }}>Choose a date to see if {name} has already answered.</p>}
    </Sheet>
  );
}



/* Who's asking, as the other person sees it. */
const meLabel = (state) => (state.role === "staff" && state.company && String(state.company.name || "").trim())
  || String(state.profile.name || "").trim()
  || (state.role === "staff" ? (state.site === "party" ? "Someone planning a party" : "A business on FF Staff") : "Someone on FF Team");



/* A WhatsApp message, drawn — what the other person receives. */
function WhatsAppPreview({ lines, buttons, link }) {
  return (
    <div className="ff-wapv" aria-label="WhatsApp message preview">
      <div className="ff-wapv-top"><WhatsAppIcon size={16} /> WhatsApp</div>
      <div className="ff-wapv-bubble">
        {lines.map((l, i) => <p key={i} className={i === 0 ? "from" : ""}>{l}</p>)}
        {link && <p className="lnk">{link}</p>}
        <span className="t">now</span>
      </div>
      {buttons && <div className="ff-wapv-btns">{buttons.map(b => <span key={b}>{b}</span>)}</div>}
    </div>
  );
}


function AskQuestionSheet({ open, person, onClose }) {
  const { state, dispatch } = useStore();
  const [text, setText] = useState("");
  const [sent, setSent] = useState(null);
  useEffect(() => {
    if (open) {
      setText("");
      setSent(null);
    }
  }, [open]);
  if (!open || !person)
    return null;
  const first = person.isCompany ? person.name : firstName(person.name);
  const ok = text.trim().length >= 5;
  const me = meLabel(state);
  const send = () => {
    if (!ok)
      return;
    const q = { id: uid("ask"), personId: person.id, text: text.trim(), askedAt: Date.now(), by: state.session.tag || null, byId: "me", byName: me, answer: null };
    dispatch({ type: "ASK_QUESTION", q });
    setSent(q);
  };
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: sent ? "Question sent" : `Ask ${first} a question`
  }, !sent ? React.createElement(React.Fragment, null, React.createElement(Field, {
    label: `Your question for ${first}`
  }, React.createElement("textarea", {
    className: "ff-input",
    rows: 3,
    autoFocus: FF_FINE_POINTER && (true),
    value: text,
    maxLength: 200,
    onChange: (e) => setText(e.target.value),
    placeholder: "Do you run cocktail masterclasses?",
    style: { resize: "vertical" }
  })), React.createElement(Btn, {
    variant: "primary wide",
    disabled: !ok,
    onClick: send
  }, React.createElement(WhatsAppIcon, {
    size: 15
  }), " Send to ", first), React.createElement("p", {
    className: "ff-body ff-muted",
    style: { fontSize: 12, margin: "10px 0 0" }
  }, first, " gets a Question Card and a WhatsApp message. When they answer, it shows on their profile with your question.")) : React.createElement(React.Fragment, null, React.createElement("div", {
    className: "ff-ask-sent"
  }, React.createElement(QuestionCard, {
    q: { text: sent.text, group: "asked" },
    label: "Your question",
    pending: `Sent to ${first}`
  }), React.createElement(WhatsAppPreview, {
    lines: [`FireFlair · ${me} asked you a question:`, `“${sent.text}”`],
    link: `Tap to answer · ${CARD_DOMAIN}/${person.tag || "you"}`
  })), React.createElement("p", {
    className: "ff-body",
    style: { fontSize: 13, margin: "12px 0" }
  }, "Sent. ", first, "'s answer will show on their profile and you'll get a WhatsApp message."), React.createElement(Btn, {
    variant: "wide",
    onClick: onClose
  }, "Done")));
}
