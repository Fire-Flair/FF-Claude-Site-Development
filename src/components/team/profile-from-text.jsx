/* src/components/team/profile-from-text.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Share Card — FF Team's Add FireFlair action. Enter a number, send the
   card. Deliberately simple: no new send infrastructure, just the flow the
   spec asks for, using the existing tag/session data already on the card. */
/* Media — photos and videos on the profile itself, not tucked inside one
   skill. Photos are stored as data URLs, same as everywhere else media is
   handled in this prototype; video is a linked URL rather than an uploaded
   file, since a video blob would blow the size budget this app works within. */
/* ==========================================================================
   PROFILE FFAI — "Tell us about yourself".
   The same FFAI component as every other page, given the Profile's purpose.
   What the person writes or says becomes PROPOSED profile information
   (professions, skills, interests, locations, languages) plus Question Card
   answers; they tick what's right before anything is saved. Confirmed items
   join the one profile through RECORDS_MERGE — whether each is featured on
   the card is then chosen in the profile editor below.
   FireFlair reads the text through CV_ADAPTER (the same engine as a CV upload).
   profileFromText() below is the fallback when FireFlair isn't available in a
   view, and is labelled as simple matching when it is used.
   ========================================================================== */
const PROFILE_SKILLS = [
  "Cocktail Mixology", "Flair Bartending", "Wine Pairing", "Wine Service", "Silver Service", "Fine Dining",
  "Bar Management", "Stock Control", "Batch Cocktails", "Classic Cocktails", "Customer Service",
  "Guest Relations", "Menu Design", "Live Cooking", "Canapé Service", "Banqueting", "Public Speaking",
  "Event Management", "Coffee", "Barista", "Mixing", "Beatmatching", "Photography", "Editing",
];


const reEsc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");



function profileFromText(text) {
  const raw = String(text || "");
  const t = raw.toLowerCase();
  const out = {};
  const title = (x) => x.replace(/\b\w/g, c => c.toUpperCase());
  const add = (cat, v) => {
    const val = String(v || "").trim().replace(/^(a|an|the)\s+/i, "").replace(/[.,;:!]+$/, "");
    if (!val || val.length > 40) return;
    const list = (out[cat] = out[cat] || []);
    if (!list.some(x => x.toLowerCase() === val.toLowerCase())) list.push(val);
  };
  const has = (n) => new RegExp(`\\b${reEsc(n.toLowerCase())}s?\\b`).test(t);

  PROFESSION_CATEGORIES.forEach(c => c.suggested.forEach(n => { if (has(n)) add("professions", n); }));
  PROFILE_SKILLS.forEach(n => { if (has(n)) add("skills", n); });
  LANGUAGE_MASTER.map(x => x.name.replace(/\s*\(.*\)$/, "")).forEach(l => { if (new RegExp(`\\b${l.toLowerCase()}\\b`).test(t)) add("languages", l); });
  [...Object.keys(MAP_AREAS), ...Object.keys(LOCATION_NEIGHBOURS).map(title)].forEach(a => { if (has(a)) add("locations", a); });
  const grab = (re, cat) => {
    const r = new RegExp(re, "gi"); let m;
    while ((m = r.exec(raw))) m[1].split(/,|\band\b|\//).forEach(x => add(cat, title(x.trim())));
  };
  grab("\\b(?:i love|i enjoy|i'm into|i am into|interested in|passionate about)\\s+([^.!?\\n]+)", "interests");
  grab("\\b(?:skilled in|good at|experienced in|specialise in|specialize in)\\s+([^.!?\\n]+)", "skills");
  grab("\\b(?:i work (?:in|around|across))\\s+([^.!?\\n]+)", "locations");
  /* "Cocktail Bartender" beats "Bartender"; "Central London" beats "London". */
  ["professions", "skills", "locations"].forEach(cat => {
    if (out[cat]) out[cat] = out[cat].filter(v => !out[cat].some(o => o !== v && o.toLowerCase().includes(v.toLowerCase())));
  });
  return out;
}



function ProfileFFAI() {
  const [text, setText] = useState("");
  const ex = useExtraction({ withAnswers: true });
  const run = (v) => { if (String(v || "").trim().length < 3 || ex.busy) return; ex.start({ text: v }); };
  return (
    <div id="ff-sec-ffai">
      <FFAI hero multiline tint coinSize={40} title="FF AI"
        purpose="Autofill your profile. Type here."
        placeholder="I'm a bartender in Central London…"
        query={text} onQuery={setText} onSubmit={run} submitLabel="Fill out my profile">
        <ExtractionStatus ex={ex} />
        {ex.st.phase === "review" && (
          <ImportToEdit key={ex.st.result.report && ex.st.result.report.ms} result={ex.st.result} onDone={() => { ex.reset(); setText(""); }} />
        )}
      </FFAI>
    </div>
  );
}



/* ==========================================================================
   FireFlair REVIEW — what FireFlair found, before any of it is saved.
   Used by "Tell us about yourself" and by the CV upload. Suggestions are
   grouped by category with an honest total; each can be ticked, edited
   (title, details, description, where it's saved) or removed. "Add to my
   profile" is the approval step: only then do records join the profile,
   new ones at the end of each row, existing cards only ever having their
   EMPTY fields filled. Nothing here publishes or shares anything.
   ========================================================================== */


/* The extraction state machine: idle -> reading -> thinking -> review
   (or error). One per FireFlair surface; Stop aborts the AI call. */
function useExtraction({ withAnswers = false } = {}) {
  const { state } = useStore();
  const [st, setSt] = useState({ phase: "idle" });
  const ctl = useRef(null);
  const last = useRef(null);
  const ref = useRef(state); ref.current = state;
  useEffect(() => () => { if (ctl.current) ctl.current.abort(); }, []);

  const start = async (input) => {
    if (ctl.current) ctl.current.abort();
    const c = ctl.current = new AbortController();
    last.current = input;
    const t0 = Date.now();
    const isFile = typeof Blob !== "undefined" && input instanceof Blob;
    const what = isFile ? "your CV" : "what you wrote";
    let doc = null;
    try {
      setSt({ phase: "reading", msg: isFile ? "Opening your CV…" : "Reading…", what });
      doc = isFile ? await CV_READER.read(input, (msg) => { if (!c.signal.aborted) setSt({ phase: "reading", msg, what }); }) : CV_READER.fromText(input.text);
    } catch (e) {
      if (c.signal.aborted) return;
      if (!e.code) { try { console.warn("[FireFlair] reader failed", e); } catch (x) { /* no console */ } }
      const report = extractionReport({ doc, error: e, ms: Date.now() - t0 });
      setSt({ phase: "error", msg: e.code ? e.message : "This file couldn't be read. Save it again as a PDF or Word file and upload that.", canRetry: e.code === "reader", report });
      return;
    }
    if (c.signal.aborted) return;
    const src = isFile ? { origin: "CV", location: doc.fileName || "CV" } : { origin: "FireFlair", location: "Tell us about yourself" };
    const answers = () => {
      if (!withAnswers) return [];
      const s = ref.current;
      const qOf = (qid) => QUESTIONS.find(q => q.id === qid);
      return proposeAnswersFromText(doc.text)
        .filter(p => p.ai
          ? !(s.profile.aiQuestions || []).some(x => x.text.toLowerCase() === p.text.toLowerCase())
          : !isAnswered(answerOf(s, qOf(p.qid))))
        .map(p => ({ key: uid("sg"), kind: "answer", category: "question", p, confidence: "medium",
          title: p.ai ? p.text : (qOf(p.qid) || {}).text, description: p.value }));
    };
    setSt({ phase: "thinking", what, pages: doc.pagesRead, found: 0 });
    try {
      const x = await CV_ADAPTER.extract(doc, { signal: c.signal, onProgress: (n) => { if (!c.signal.aborted) setSt(s => s.phase === "thinking" ? { ...s, found: n } : s); } });
      if (c.signal.aborted) return;
      setSt(s => ({ ...s, phase: "thinking", found: x.items.length, msg: "Checking against your profile…" }));
      const built = buildSuggestions(x, ref.current.profile);
      built.suggestions.push(...answers());
      const photo = await resolvePhoto(x, doc);
      const photoCandidates = !photo && !(x.sent && x.sent.candidates) && doc.candidates.length
        ? await Promise.all(doc.candidates.map(async (cd) => ({ src: await blobToDataUrl(cd.blob), from: `page ${cd.page}` })))
        : [];
      const report = extractionReport({ doc, x, built, ms: Date.now() - t0 });
      if (c.signal.aborted) return;
      setSt({ phase: "review", result: { ...built, photo, photoCandidates, report, src, what, failed: x.calls.filter(k => !k.ok) } });
    } catch (e) {
      if (c.signal.aborted || e.code === "cancelled") { setSt({ phase: "idle" }); return; }
      if (e.code === "unavailable") {
        const built = fallbackSuggestions(doc.text, ref.current.profile);
        built.suggestions.push(...answers());
        const report = extractionReport({ doc, built, fallback: true, ms: Date.now() - t0 });
        setSt({ phase: "review", result: { ...built, photo: null, photoCandidates: [], report, src, what, fallback: e.cause || "unavailable", failed: [] } });
        return;
      }
      const report = extractionReport({ doc, error: e, x: e.calls ? { calls: e.calls } : null, ms: Date.now() - t0 });
      setSt({ phase: "error", msg: e.code === "unreadable" ? e.message : cvxCopy(e.code), canRetry: e.code !== "unreadable" && e.code !== "refused", report });
    }
  };
  return {
    st, start,
    stop: () => { if (ctl.current) ctl.current.abort(); setSt({ phase: "idle" }); },
    retry: () => last.current && start(last.current),
    reset: () => setSt({ phase: "idle" }),
    busy: st.phase === "reading" || st.phase === "thinking",
  };
}



function ExtractionStatus({ ex }) {
  const s = ex.st;
  if (s.phase === "reading" || s.phase === "thinking") return (
    <div className="ff-cvprog" role="status" aria-live="polite">
      <Loader2 size={18} className="ff-spin" color="var(--gold-dk)" />
      <span style={{ flex: 1, minWidth: 0 }}>
        <b>{s.phase === "reading" ? s.msg : s.msg ? s.msg : s.found ? `FireFlair has found ${s.found} so far…` : `FireFlair is reading ${s.what}…`}</b>
        {s.phase === "thinking" && !s.msg && (
          <span className="sub">{s.pages > 1 ? `All ${s.pages} pages. ` : ""}This can take a minute or two.</span>
        )}
      </span>
      <Btn variant="sm ghost" onClick={ex.stop}>Stop</Btn>
    </div>
  );
  if (s.phase === "error") return (
    <div className="ff-cverr" role="alert">
      <AlertCircle size={17} style={{ flex: "none", marginTop: 1 }} />
      <span style={{ flex: 1, minWidth: 0 }}>{s.msg}</span>
      {s.canRetry && <Btn variant="sm ghost" onClick={ex.retry}><RotateCcw size={12} /> Try again</Btn>}
      <button className="ff-cverr-x" aria-label="Dismiss" onClick={ex.reset}><X size={15} /></button>
    </div>
  );
  return null;
}


function ShareCardSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (open) {
      setPhone("");
      setSent(null);
      setBusy(false);
    }
  }, [open]);
  if (!open)
    return null;
  const tag = state.auth.status === "signedIn" ? state.auth.tag || state.session.tag : null;
  const ok = phone.replace(/\D/g, "").length >= 9;
  const send = async () => {
    if (!ok || busy)
      return;
    setBusy(true);
    try {
      const r = await PROFILE_ADAPTER.shareTo(tag, phone);
      setSent(r.sentTo);
      dispatch({ type: "TOAST", toast: `Card sent to ${r.sentTo}` });
    } finally {
      setBusy(false);
    }
  };
  const phoneUi = React.createElement(React.Fragment, null, React.createElement("p", {
    className: "ff-body",
    style: { marginTop: 0, fontSize: 15 }
  }, "Type someone's phone number here to share your card with them."), React.createElement(Field, {
    label: "Phone number"
  }, React.createElement("input", {
    className: "ff-input",
    type: "tel",
    inputMode: "tel",
    autoComplete: "off",
    placeholder: "+44 7700 900000",
    value: phone,
    autoFocus: FF_FINE_POINTER && (true),
    onChange: (e) => setPhone(e.target.value),
    onKeyDown: (e) => e.key === "Enter" && send()
  })), React.createElement(Btn, {
    variant: "primary wide",
    disabled: !ok || busy,
    onClick: send
  }, busy ? React.createElement(Loader2, {
    size: 14,
    className: "ff-spin"
  }) : React.createElement(WhatsAppIcon, {
    size: 15
  }), " Send my card"));
  if (tag && !sent) {
    const me = meAsStaff(state.profile, state.session);
    return React.createElement(CardShareSheet17, {
      open: true, onClose, title: "My FireFlair card", url: "https://" + CARD_DOMAIN + "/" + tag, fileName: "fireflair-" + cx17Slug(tag),
      extra: React.createElement("div", { style: { marginTop: 14 } }, phoneUi)
    }, React.createElement(PlayerCard, { person: me, format: "full", themeKey: state.profile.theme }));
  }
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: "Share your card"
  }, !tag ? React.createElement(React.Fragment, null, React.createElement("p", {
    className: "ff-body",
    style: { marginTop: 0 }
  }, "Create your FF Tag first — then you can share your card."), React.createElement(Btn, {
    variant: "primary wide",
    onClick: () => {
      onClose();
      if (state.role !== "team")
        dispatch({ type: "ROLE", role: "team" });
      dispatch({ type: "TAB", tab: "profile" });
      window.scrollTo(0, 0);
    }
  }, React.createElement(User, {
    size: 14
  }), " Join the Team")) : sent ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "ff-frame",
    style: { padding: 16, textAlign: "center" }
  }, React.createElement(Check, {
    size: 22,
    color: "var(--ok)",
    style: { marginBottom: 6 }
  }), React.createElement("p", {
    className: "ff-body",
    style: { margin: 0 }
  }, "Sent to ", React.createElement("b", null, sent), ".")), React.createElement("div", {
    style: { height: 10 }
  }), React.createElement(Btn, {
    variant: "ghost wide",
    onClick: () => {
      setSent(null);
      setPhone("");
    }
  }, React.createElement(Plus, {
    size: 13
  }), " Share with someone else")) : null);
}



function ReviewSheet({ open, person, shiftId, onClose }) {
  const { state, dispatch } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  useEffect(() => { if (open) { setRating(5); setText(""); } }, [open, person && person.id]);
  if (!open || !person) return null;

  const submit = () => {
    dispatch({
      type: "REVIEW_ADD",
      review: {
        id: uid("rev"), aboutId: person.id, byId: "me", shiftId: shiftId || null,
        byName: (state.role === "staff" && state.site !== "party" && state.company?.name) || state.profile.name || "You", rating, text: text.trim(), at: Date.now(),
      },
    });
    dispatch({ type: "TOAST", toast: `Review posted for ${person.isCompany ? person.name : person.name.split(" ")[0]}` });
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={`Review ${person.isCompany ? person.name : person.name.split(" ")[0]}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
        <Portrait src={person.photo} name={person.name} size={44} tier={person.tier} />
        <div>
          <div className="ff-display" style={{ fontSize: 15 }}>{person.name}</div>
          <div className="ff-serif" style={{ fontSize: 12.5, color: "var(--gold-dk)", fontStyle: "normal" }}>{person.profession}</div>
        </div>
      </div>
      <Field label="Rating">
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: REVIEW_MAX }).map((_, i) => (
            <button key={i} aria-label={`${i + 1} star${i ? "s" : ""}`} onClick={() => setRating(i + 1)}
              style={{ padding: 6, minWidth: 44, minHeight: 44, color: i < rating ? "var(--gold)" : "#C9C3B4" }}>
              <Star size={30} strokeWidth={i < rating ? 0 : 1.5} fill={i < rating ? "currentColor" : "none"} />
            </button>
          ))}
        </div>
      </Field>
      <Field label="Review" hint="How they were to work with — this goes on their profile.">
        <textarea className="ff-input" rows={4} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Reliable, great with guests, always on time…" />
      </Field>
      <Btn variant="primary wide" onClick={submit}><Star size={14} /> Post review</Btn>
      <ProtoNote>Prototype: saved in this preview only. On the live site {person.name.split(" ")[0]} is notified and accepts before it shows on their profile.</ProtoNote>
    </Sheet>
  );
}



/* Ask anyone in your network for a review/reference. If they don't have one
   posted yet, the fallback is simply to share your card with them. */
function AskForReviewSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [picked, setPicked] = useState(null);
  useEffect(() => { if (open) setPicked(null); }, [open]);
  if (!open) return null;

  const asked = (id) => state.reviewRequests.some(r => r.fromId === id && r.aboutId === "me");
  const network = state.connections.map(c => all.find(p => p.id === c.id)).filter(Boolean);

  const ask = (person) => {
    dispatch({ type: "REVIEW_REQUEST", request: { id: uid("req"), aboutId: "me", fromId: person.id, fromName: person.name, at: Date.now() } });
    dispatch({ type: "TOAST", toast: `Asked ${person.name.split(" ")[0]} for a review` });
  };

  return (
    <Sheet open onClose={onClose} title="Ask for a review">
      <p className="ff-body" style={{ marginTop: 0 }}>
        Anyone in your network can leave you a review or a reference, whether or not you've worked an event
        together on FireFlair — most people you'd ask have worked with you somewhere.
      </p>
      {network.length === 0 ? (
        <div className="ff-frame" style={{ padding: 14, marginTop: 10 }}>
          <p className="ff-body" style={{ margin: "0 0 10px" }}>Nobody in your network yet. Share your card instead — they can send you a review once they have it.</p>
          <Btn variant="primary wide" onClick={() => { dispatch({ type: "TOAST", toast: "Link copied" }); onClose(); }}>
            <Share2 size={14} /> Share my card
          </Btn>
        </div>
      ) : network.map(p => (
        <div key={p.id} className="ff-frame" style={{ padding: 11, marginBottom: 8, display: "flex", gap: 11, alignItems: "center" }}>
          <Portrait src={p.photo} name={p.name} size={36} tier={p.tier} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span className="ff-display" style={{ fontSize: 13, display: "block" }}>{p.name}</span>
            <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{p.profession}</span>
          </span>
          {asked(p.id)
            ? <Pill tone="ok">Asked</Pill>
            : <Btn variant="sm" onClick={() => ask(p)}><Send size={12} /> Ask</Btn>}
        </div>
      ))}
    </Sheet>
  );
}
