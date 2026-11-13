/* src/components/team/questions.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const AppleWalletMark = () => (
  <svg width="26" height="20" viewBox="0 0 26 20" aria-hidden="true">
    <rect x="1" y="1" width="24" height="18" rx="3.5" fill="#fff" />
    <rect x="3" y="3" width="20" height="4" rx="1.2" fill="#3EA6E8" />
    <rect x="3" y="6" width="20" height="4" rx="1.2" fill="#F5B82E" />
    <rect x="3" y="9" width="20" height="4" rx="1.2" fill="#F26C4F" />
    <path d="M1 12h7.5c1 0 1.6 2.2 4.5 2.2S16.5 12 17.5 12H25v4.5A2.5 2.5 0 0 1 22.5 19h-19A2.5 2.5 0 0 1 1 16.5z" fill="#D9D9D9" />
  </svg>
);


const GoogleWalletMark = () => (
  <svg width="24" height="20" viewBox="0 0 24 20" aria-hidden="true">
    <rect x="2" y="1" width="20" height="7" rx="3" fill="#EA4335" />
    <rect x="2" y="4.5" width="20" height="7" rx="3" fill="#FBBC04" />
    <rect x="2" y="8" width="20" height="7" rx="3" fill="#34A853" />
    <path d="M2 11.5h7c1.5 0 2 2.5 5 2.5h8v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#4285F4" />
  </svg>
);


function WalletButton({ kind, payload, wide, provider = "apple" }) {
  const { dispatch } = useStore();
  const [busy, setBusy] = useState(false);
  const go = async () => {
    setBusy(true);
    try {
      await WALLET_ADAPTER.passFor({ kind, provider, ...payload });
    } catch (e) {
      dispatch({ type: "TOAST", toast: e.message });
    } finally {
      setBusy(false);
    }
  };
  const google = provider === "google";
  return React.createElement("button", {
    type: "button",
    className: `ff-walletbtn ${google ? "google" : "apple"}${wide ? " wide" : ""}`,
    onClick: go,
    disabled: busy,
    "aria-label": google ? "Add to Google Wallet" : "Add to Apple Wallet"
  }, busy ? React.createElement(Loader2, {
    size: 18,
    className: "ff-spin"
  }) : google ? React.createElement(GoogleWalletMark, null) : React.createElement(AppleWalletMark, null), google ? React.createElement("b", {
    style: { fontSize: 15, fontWeight: 500 }
  }, "Add to Google Wallet") : React.createElement("span", null, React.createElement("small", null, "Add to"), React.createElement("b", null, "Apple Wallet")));
}



/* ==========================================================================
   QUESTION CARDS
   Internal profile data. Same card frame as everything else, but these stay
   off the public Profile Card — they exist so FireFlair understands the
   professional. Answering one is worth XP_VALUES.question (+1), once.
   ========================================================================== */
/* Question -> Answer -> metadata. Both halves are Tier 1, in Inter; the
   group, XP and "Answer" labels are Tier 3 and stay out of the way. */
/* A drawn tick, so it never depends on the icon library. */
function TickGlyph({ size = 16, width = 3.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      <path d="M5 12.5l4.6 4.6L19 7.5" />
    </svg>
  );
}


const QUESTION_DONE = { bg: "linear-gradient(165deg,#165238,#07241A)", ink: "#EEFBF3", sub: "#8FE6B8", rule: "rgba(143,230,184,.36)" };


const SPARKS = [[-62, -40], [58, -46], [-70, 18], [66, 22], [-24, -70], [30, 66]];



function QuestionCard({ q, answer, onClick, label, pending, celebrate, asker }) {
  const answered = isAnswered(answer);
  const c = answered ? QUESTION_DONE : questionGroupColor(q.group);
  const groupLabel = label || (QUESTION_GROUPS.find(g => g.key === q.group) || {}).label || q.group;
  const shown = Array.isArray(answer) ? answer.join(", ") : String(answer);
  return (
    <CardFrame as="button" tier="standard" theme={{ bg: c.bg, ink: c.ink, sub: c.sub, rule: c.rule, dark: true }} ratio="5 / 7" onClick={onClick}
      className={`ff-qcard ${answered ? "ff-qdone" : ""} ${celebrate ? "ff-qcelebrate" : ""}`}
      style={{ width: CARD_W.question, padding: "28px 10px 10px", display: "flex", flexDirection: "column", textAlign: "left" }}>
      <span style={{ position: "absolute", top: 10, left: 13, zIndex: 4, fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: c.sub }}>{groupLabel}</span>
      {answered
        ? <span className="ff-qbadge" title="Answered"><TickGlyph size={16} /></span>
        : q.xp && PHASE1.xpLive ? <span style={{ position: "absolute", top: 9, right: 10, zIndex: 4, fontSize: 9, fontWeight: 700, letterSpacing: ".06em", color: c.sub, opacity: .85 }}>+{q.xp} XP</span> : null}
      {celebrate && (
        <span className="ff-qburst" aria-hidden="true">
          <span className="ring" />
          {SPARKS.map(([dx, dy], i) => <span key={i} className="spark" style={{ "--dx": `${dx}px`, "--dy": `${dy}px` }} />)}
          <span className="disc" style={{ color: "#fff" }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.6 4.6L19 7.5" /></svg>
          </span>
        </span>
      )}

      <div style={{ flex: "1 1 0", minHeight: 0, padding: "4px 3px 10px", overflow: "hidden" }}>
        <div style={{ fontFamily: "var(--sans)", color: c.ink, fontSize: 16, fontWeight: 600, lineHeight: 1.32, display: "-webkit-box", WebkitLineClamp: asker ? 4 : 5, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{q.text}</div>
        {asker && <span className="ff-qasker" style={{ color: c.sub }}><MessageSquare size={10} /> {asker}</span>}
      </div>

      <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column", padding: "9px 10px 8px", borderRadius: 9,
        border: `1px solid ${c.rule}`, background: "rgba(255,255,255,.08)" }}>
        <span style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: c.sub }}>Answer</span>
        <span style={{ flex: 1, minHeight: 0, marginTop: 5, fontFamily: "var(--sans)", color: c.ink, fontSize: answered ? 17 : 15, fontWeight: answered ? 700 : 500,
          opacity: answered ? 1 : .78, lineHeight: 1.25, display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", overflow: "hidden", overflowWrap: "anywhere" }}>
          {answered ? shown : (pending || "Tap to answer")}
        </span>
        <span style={{ alignSelf: "flex-end", color: c.sub, display: "flex", opacity: .8 }}><ChevronRight size={14} /></span>
      </div>
    </CardFrame>
  );
}


/* Every open question is answered the same quick way: Yes, No, or type something. One tap or one line. */
function QuickAnswer17({ value = "", onSave, vis, onVis }) {
  const [txt, setTxt] = useState(value === "Yes" || value === "No" ? "" : value);
  const send = () => { if (txt.trim()) onSave(txt.trim()); };
  return (
    <div className="ff-qa17">
      <div className="yn" role="group" aria-label="Your answer">
        <button type="button" className={value === "Yes" ? "on" : ""} onClick={() => onSave("Yes")}>Yes</button>
        <button type="button" className={value === "No" ? "on" : ""} onClick={() => onSave("No")}>No</button>
      </div>
      <div className="ty">
        <input aria-label="Type your answer" value={txt} maxLength={400} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") send(); }} placeholder="Type your answer" />
        <button type="button" aria-label="Send answer" disabled={!txt.trim()} onClick={send}><Send size={16} /></button>
      </div>
      {onVis && <VisSwitch17 value={vis || "private"} onChange={onVis} />}
    </div>
  );
}


function QuestionSheet({ open, q, onClose, onSaved, edit }) {
  const { state, dispatch } = useStore();
  const [vis, setVis] = useState("private");
  const [qtext, setQtext] = useState("");
  const [val, setVal] = useState("");
  const [choice, setChoice] = useState("");
  const [detail, setDetail] = useState("");
  useEffect(() => {
    if (!open || !q)
      return;
    const ex = String(answerOf(state, q) || "");
    setVis(qaVisOf17(state, q));
    setQtext(q.text || "");
    setVal(ex);
    if (q.detail && ex.startsWith(q.detail.option)) {
      setChoice(q.detail.option);
      setDetail(ex.slice(q.detail.option.length).replace(/^\s*—\s*/, ""));
    } else {
      setChoice(ex);
      setDetail("");
    }
  }, [open, q && q.id]);
  if (!open || !q)
    return null;
  const existing = answerOf(state, q);
  const isNew = !isAnswered(existing);
  const save = (v) => {
    dispatch({ type: "ANSWER", qid: q.id, value: v, visibility: q.group === "feedback" ? undefined : vis });
    dispatch({ type: "TOAST", toast: isNew ? `Answered${xpNote(q.xp)}` : "Answer updated" });
    if (onSaved)
      onSaved(q.id, isNew);
    onClose();
  };
  const pick = (o) => {
    if (q.detail && o === q.detail.option) {
      setChoice(o);
      return;
    }
    save(o);
  };
  const needsDetail = q.detail && choice === q.detail.option;
  const note = q.group === "feedback" ? "Feedback goes to the FireFlair team to improve FF Team. It's kept separately from your profile and never shown on it." : "";
  const canVis = q.group !== "feedback";
  const changeVis = (v) => { setVis(v); if (isAnswered(existing)) dispatch({ type: "QA_VIS", qid: q.id, visibility: v }); };
  const editing = !!(edit && q.mine);
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: q.group === "feedback" ? "Feedback" : q.group === "ai" ? q.mine ? "Your question" : "FireFlair question" : q.group === "asked" ? "Question for you" : "Question"
  }, q.group === "asked" && q.byName && React.createElement("p", {
    className: "ff-label",
    style: { margin: "0 0 6px" }
  }, "Asked by ", q.byName), !editing && React.createElement("p", {
    className: "ff-serif",
    style: { fontSize: 19, lineHeight: 1.35, marginTop: 0 }
  }, q.text), editing && React.createElement(Field, {
    label: "Your question",
    hint: `${qtext.length} / ${CUSTOM_QUESTION_MAX}`
  }, React.createElement("input", {
    className: "ff-input",
    value: qtext,
    maxLength: CUSTOM_QUESTION_MAX,
    "aria-label": "Your question",
    onChange: (e) => setQtext(e.target.value)
  })), editing && React.createElement(Btn, {
    variant: "primary wide",
    disabled: !qtext.trim() || qtext.trim() === q.text,
    onClick: () => { dispatch({ type: "MY_QUESTION_EDIT", id: q.id, text: qtext }); dispatch({ type: "TOAST", toast: "Question updated" }); onClose(); }
  }, "Save question"), editing && React.createElement("div", { style: { height: 12 } }), canVis && React.createElement("div", {
    style: { margin: "0 0 12px" }
  }, React.createElement(VisSwitch17, { value: vis, onChange: changeVis })), q.type === "choice" && React.createElement("div", {
    style: { display: "grid", gap: 8 }
  }, q.options.map((o) => React.createElement(Btn, {
    key: o,
    variant: choice === o ? "primary" : "",
    onClick: () => pick(o)
  }, o))), needsDetail && React.createElement(React.Fragment, null, React.createElement("div", {
    style: { height: 12 }
  }), React.createElement(Field, {
    label: q.detail.label
  }, React.createElement("input", {
    className: "ff-input",
    value: detail,
    onChange: (e) => setDetail(e.target.value),
    placeholder: q.detail.placeholder || "",
    autoFocus: FF_FINE_POINTER && (true)
  })), React.createElement(Btn, {
    variant: "primary wide",
    disabled: !q.detail.optional && !detail.trim(),
    onClick: () => save(detail.trim() ? `${choice} — ${detail.trim()}` : choice)
  }, isNew ? `Save${xpNote(q.xp)}` : "Save answer")), q.type === "text" && React.createElement(QuickAnswer17, { value: val, onSave: save }), note && React.createElement("p", {
    className: "ff-body ff-muted",
    style: { fontSize: 11.5, marginTop: 14, marginBottom: 0 }
  }, note), q.mine && React.createElement(DeleteMyQuestion, {
    q,
    onClose
  }));
}



/* A group of Question Cards — used for logistics, availability, experience,
   and for the dream-opportunity questions that become Job Request data. */
/* ONE unified Question Cards carousel — every category's questions in a
   single left/right swipeable collection, each card carrying its own
   category name and colour so the category stays legible while swiping. */
/* Question order is shuffled once per visit to the Profile page (ProfilePage
   calls resetQuestionOrder when it mounts) and then held still while the
   person works through them. Answered and unanswered are shuffled
   independently. Display order only — answers are never touched. */
let QA_RANKS = {};


const resetQuestionOrder = () => { QA_RANKS = {}; };


const qaRank = (id) => (QA_RANKS[id] === undefined ? (QA_RANKS[id] = Math.random()) : QA_RANKS[id]);
