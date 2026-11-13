/* src/components/staff/questions-and-dates.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==== v1.01: Create your own question ========================================
   A card at the start of the Question Cards row. You write the question and
   answer it Yes or No, or type an answer. It joins your Question Cards, already
   answered, and can be deleted (two taps). Kept on the profile like FireFlair's. */
const CUSTOM_QUESTION_MAX = 200, CUSTOM_QUESTION_LIMIT = 10;


function AddQuestionCard({ onClick }) {
  return (
    <button type="button" className="ff-qadd" style={{ width: CARD_W.question }} onClick={onClick} aria-label="Create your own question">
      <span className="ff-qadd-plus"><Plus size={26} strokeWidth={2} /></span>
      <b>Create your own question</b>
    </button>
  );
}


function NewQuestionSheet({ open, onClose, onAdded }) {
  const { dispatch } = useStore();
  const [question, setQuestion] = useState("");
  const [yes, setYes] = useState(null);
  const [text, setText] = useState("");
  useEffect(() => {
    if (open) {
      setQuestion("");
      setYes(null);
      setText("");
    }
  }, [open]);
  if (!open)
    return null;
  const kind = yes !== null ? "yesno" : "text";
  const ready = !!question.trim() && (yes !== null || !!text.trim());
  const submit = () => {
    if (!ready)
      return;
    dispatch({ type: "MY_QUESTION_ADD", question: { id: `my_${Date.now().toString(36)}`, text: question.trim(), type: kind }, value: kind === "yesno" ? yes ? "Yes" : "No" : text.trim() });
    onAdded && onAdded();
    onClose();
  };
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: "Create your own question"
  }, React.createElement("form", {
    onSubmit: (e) => {
      e.preventDefault();
      submit();
    }
  }, React.createElement(Field, {
    label: "Your question",
    hint: `${question.length} / ${CUSTOM_QUESTION_MAX}`
  }, React.createElement("input", {
    className: "ff-input",
    value: question,
    maxLength: CUSTOM_QUESTION_MAX,
    onChange: (e) => setQuestion(e.target.value),
    placeholder: "e.g. Can you work with flames?",
    autoFocus: FF_FINE_POINTER && (true)
  })), React.createElement("p", {
    className: "ff-label",
    style: { margin: "4px 0 8px" }
  }, "Your answer"), React.createElement("div", {
    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 },
    role: "radiogroup",
    "aria-label": "Yes or No"
  }, [true, false].map((v) => React.createElement(Btn, {
    key: String(v),
    variant: yes === v ? "primary" : "",
    onClick: () => {
      setYes(yes === v ? null : v);
      setText("");
    }
  }, v ? "Yes" : "No"))), React.createElement(Field, {
    label: "Or type your answer"
  }, React.createElement("textarea", {
    className: "ff-input",
    rows: 3,
    value: text,
    maxLength: 2000,
    onChange: (e) => {
      setText(e.target.value);
      if (e.target.value)
        setYes(null);
    },
    placeholder: "Type your answer"
  })), React.createElement(Btn, {
    type: "submit",
    variant: "primary wide",
    disabled: !ready
  }, "Add question"), React.createElement("p", {
    className: "ff-body ff-muted",
    style: { margin: "14px 0 0", fontSize: 11.5 }
  }, "Like the other Question Cards, it doesn't appear on your public card.")));
}


function DeleteMyQuestion({ q, onClose }) {
  const { dispatch } = useStore();
  const [sure, setSure] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <Btn variant="wide" onClick={() => { if (!sure) return setSure(true); dispatch({ type: "MY_QUESTION_DELETE", id: q.id }); onClose(); }}>
        {sure ? "Tap again to delete this question" : "Delete this question"}
      </Btn>
    </div>
  );
}


/* ==== v1.1 — FF Staff, FF Party and FF Team =================================
   Everything new in v1.1 sits below: the Event Card and Service Card redesign,
   Bookings (Events / Shifts), the Company Card layouts, the company profile,
   Companies on Network, Availability Cards and Ask a question. Older versions
   of the components replaced here are kept, renamed "_old", so nothing else in
   the prototype changes. */
const I11 = {
  Shirt: lucideIcon("Shirt"), Bell: lucideIcon("Bell"), BellRing: lucideIcon("BellRing"), CalendarDays: lucideIcon("CalendarDays"),
  CalendarCheck: lucideIcon("CalendarCheck"), Copy: lucideIcon("Copy"), Images: lucideIcon("Images"), Phone: lucideIcon("Phone"),
  Mail: lucideIcon("Mail"), Globe: lucideIcon("Globe"), ImagePlus: lucideIcon("ImagePlus"), PartyPopper: lucideIcon("PartyPopper"),
  ClipboardList: lucideIcon("ClipboardList"), BadgeCheck: lucideIcon("BadgeCheck"), MapPinned: lucideIcon("MapPinned"),
  Lock: lucideIcon("Lock"), Martini: lucideIcon("Martini"), Sparkles: lucideIcon("Sparkles"), Send: lucideIcon("Send"),
  ArrowRight: lucideIcon("ArrowRight"), Trash2: lucideIcon("Trash2"), UserPlus: lucideIcon("UserPlus"), Star: lucideIcon("Star"),
  Search: lucideIcon("Search"), Briefcase: lucideIcon("Briefcase"), MessageCircle: lucideIcon("MessageCircle"),
  HelpCircle: lucideIcon("HelpCircle"), Users: lucideIcon("Users"), Clock: lucideIcon("Clock"), MapPin: lucideIcon("MapPin"),
  Check: lucideIcon("Check"), Plus: lucideIcon("Plus"), Pencil: lucideIcon("Pencil"), ChevronLeft: lucideIcon("ChevronLeft"),
  ChevronRight: lucideIcon("ChevronRight"), ChevronDown: lucideIcon("ChevronDown"), Banknote: lucideIcon("Banknote"), FileText: lucideIcon("FileText"), MessageSquare: lucideIcon("MessageSquare"),
  User: lucideIcon("User"), X: lucideIcon("X"), Eye: lucideIcon("Eye"), Award: lucideIcon("Award"), Heart: lucideIcon("Heart"),
};



/* ---- State: one small reducer in front of the main one ------------------- */
function v11Reducer(s, a) {
  /* Phase 2: FF Party is display only. Book and Party (the host profile) cannot be opened, whatever asks for them. */
  if (isPartySite17(s) && a.type === "TAB" && PARTY_LOCKED_TABS17.includes(a.tab)) return s;
  if (isPartySite17(s) && a.type === "TAB" && PARTY_LOCKED_ROUTES17.includes(a.route)) return v11Reducer(s, { ...a, route: undefined });
  if (isPartySite17(s) && a.type === "GO" && PARTY_LOCKED_ROUTES17.includes(a.route)) return s;
  const booked = v11BookReducer(s, a); if (booked) return booked;
  switch (a.type) {
    case "ADMIN17": return admin17Reduce(s, a);
    case "V11_SET": return { ...s, ...a.patch };
    /* FF Party: favourite staff (a heart on someone's card or profile). */
    case "FAV_TOGGLE": { const f = s.favs || []; return { ...s, favs: f.includes(a.id) ? f.filter(x => x !== a.id) : [...f, a.id] }; }
    case "VIEW_COMPANY": return { ...s, viewingCompany: a.id, viewing: null };
    case "AVAIL_ASK": return { ...s, availabilityAsks: [...(s.availabilityAsks || []), a.ask] };
    case "AVAIL_ASK_PATCH": return { ...s, availabilityAsks: (s.availabilityAsks || []).map(x => x.id === a.id ? { ...x, ...a.patch } : x) };
    case "COMPANY_MEDIA_ADD": { const c = s.company || {}; return { ...s, company: { ...c, media: [...(c.media || []), a.item] } }; }
    case "COMPANY_MEDIA_DELETE": { const c = s.company || {}; return { ...s, company: { ...c, media: (c.media || []).filter(m => m.id !== a.id) } }; }
    case "NOTES_SEEN": return { ...s, notesSeenAt: Date.now() };
    /* v17.4.4 networking. Network = a one-way add of a person or a company (no confirmation). Team stays two-way (TEAM_INVITE). */
    case "NET_TOGGLE": { const n = s.netAdds17 || []; return { ...s, netAdds17: n.includes(a.id) ? n.filter(x => x !== a.id) : [...n, a.id] }; }
    /* A team invitation sent TO you: accept (you join each other's team) or decline. */
    case "TEAM_ASK_REPLY": {
      const done = { ...(s.teamAsks17 || {}), [a.ask.id]: a.accept ? "accepted" : "declined" };
      if (!a.accept) return { ...s, teamAsks17: done };
      /* v17.4.6.1: accepting a company's invitation makes you a member of its team (and keeps it in your network). */
      if (a.ask.company) { const co = companyById(s, a.ask.fromId) || { name: a.ask.name }; return ct17Reducer({ ...s, teamAsks17: done, netAdds17: (s.netAdds17 || []).includes(a.ask.fromId) ? s.netAdds17 : [...(s.netAdds17 || []), a.ask.fromId] }, { type: "CT_ACCEPTED", companyKey: coKey17(co), companyName: co.name || a.ask.name, personId: "me", tag: (s.auth && s.auth.tag) || "", name: (s.profile && s.profile.name) || "", ref: a.ask.id }); }
      return { ...s, teamAsks17: done, connections: s.connections.some(c => c.id === a.ask.fromId) ? s.connections : [...s.connections, { id: a.ask.fromId, name: a.ask.name, onFF: true, tag: a.ask.tag }] };
    }
    /* On FF Staff, tapping someone's card enlarges it first (CardPeek):
       Add to your event, or View profile (which sends direct: true). */
    case "VIEW":
      if (a.id && !a.direct && a.id !== "me" && s.role === "staff") return { ...s, peek: a.id };
      if (s.viewingCompany || s.peek) return reducer({ ...s, viewingCompany: null, peek: null }, a);
      return null;
    case "TAB": case "ROLE": case "ACTIVE_EVENT": {
      /* Leaving the Network drops the booking you were searching for. */
      const base = (a.type === "TAB" && a.tab !== "network" && s.netBrief) ? { ...s, netBrief: null } : s;
      if (a.type === "TAB" && base.supportPage20) return reducer({ ...base, supportPage20: null }, a);
      if (base.viewingCompany || base.peek) return reducer({ ...base, viewingCompany: null, peek: null }, a);
      return base !== s ? reducer(base, a) : null;
    }
    default: return null;
  }
}



/* ---- Dates --------------------------------------------------------------- */
const TODAY_ISO = (() => { const d = new Date(); return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); })();


const dayOf = (iso) => { if (!iso) return null; const d = new Date(iso + "T12:00:00"); return isNaN(d) ? null : d; };


const shortDay = (iso) => { const d = dayOf(iso); return d ? d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }) : ""; };


const longDay = (iso) => { const d = dayOf(iso); return d ? d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : ""; };


const startOf = (ev) => (ev && (ev.start || splitTime(ev.time)[0])) || "";


const isPast = (iso) => !!iso && iso < TODAY_ISO;


/* What a Service Card is called: "Shift details" on FF Staff, "Service Card" on FF Party. */
function svcWords(state) {
  const party = hireSiteOf(state).party;
  return party
    ? { party, T: "Service Card", Ts: "Service Cards", lc: "Service Card", lcs: "Service Cards", a: "a Service Card", n: (k) => `${k} Service Card${k === 1 ? "" : "s"}`, plate: "Service Card", each: "Service Card", goes: "a Service Card goes" }
    : { party, T: "Shift details", Ts: "Shift details", lc: "shift details", lcs: "shift details", a: "shift details", n: (k) => `${k} shift${k === 1 ? "" : "s"}`, plate: "Shift card", each: "shift", goes: "shift details go" };
}


const firstName = (n) => String(n || "").trim().split(" ")[0] || "them";


QUESTION_GROUP_COLOR.availability = { bg: "linear-gradient(165deg,#103A33,#06191A)", ink: "#ECFAF5", sub: "#8FD9C4", rule: "rgba(143,217,196,.32)" };
