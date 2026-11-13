/* src/components/team/profile-marks-qa.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- 4a. Profession symbols on the Profile Card --------------------------- */
const PROFESSION_MARKS = [
  [/flair/, ["Flame"]],
  [/mixolog/, ["FlaskConical", "Martini"]],
  [/cocktail/, ["Martini"]],
  [/barback/, ["GlassWater", "Beer"]],
  [/sommelier|wine/, ["Wine"]],
  [/barista|coffee/, ["Coffee"]],
  [/manager|director|supervisor|head of/, ["ClipboardList", "Briefcase"]],
  [/planner|coordinator|organiser|organizer/, ["CalendarDays", "Calendar"]],
  [/bartend|\bbar\b/, ["Beer", "Martini"]],
  [/porter|kitchen assistant/, ["CookingPot", "Utensils"]],
  [/chef|cook|pastry|baker/, ["ChefHat"]],
  [/caterer|catering/, ["UtensilsCrossed", "Utensils"]],
  [/waiter|waitress|server|front of house|runner|silver service/, ["ConciergeBell", "HandPlatter", "Utensils"]],
  [/host|usher|greeter|reception/, ["Users"]],
  [/\bdj\b/, ["Disc3", "Disc", "Headphones"]],
  [/singer|vocal|\bmc\b/, ["Mic"]],
  [/sax|violin|music|band|pian|guitar|drum/, ["Music"]],
  [/magician|magic/, ["WandSparkles", "Wand2", "Sparkles"]],
  [/photo/, ["Camera"]],
  [/video|film/, ["Video", "Camera"]],
  [/content|influencer|social/, ["Smartphone"]],
  [/stylist|florist|decor/, ["Flower2", "Flower", "Sparkles"]],
  [/stock|logistic|cellar|warehouse/, ["Package", "Bookmark"]],
];


const GROUP_MARK = { Bar: "Martini", "Front of House": "ConciergeBell", Chefs: "ChefHat", Management: "Briefcase", Entertainment: "Music", Services: "Camera", "Back of House": "Package" };


const MARK_CACHE = {};


const markIcon = (name) => (MARK_CACHE[name] = MARK_CACHE[name] || lucideIcon(name));


const hasLucide = (name) => !!(window.lucide && window.lucide.icons && window.lucide.icons[name]);


function professionMark(name) {
  const n = String(name || "").toLowerCase();
  const hit = PROFESSION_MARKS.find(([re]) => re.test(n));
  const options = [...(hit ? hit[1] : []), GROUP_MARK[professionCategory(name)]].filter(Boolean);
  return options.find(hasLucide) || null;
}


/* One symbol per profession (up to three, no repeats), the brand diamond
   between them, and the car when the person drives. */
function ProfessionMarks({ professions, hasCar, full, color }) {
  const cq = (n) => `${n}cqw`;
  const seen = new Set();
  const marks = (professions || []).map(p => ({ p, icon: professionMark(p) })).filter(m => m.icon && !seen.has(m.icon) && seen.add(m.icon)).slice(0, 3);
  const s = cq(full ? 4.4 : 5.4), d = cq(full ? 1.2 : 1.5);
  const diamond = (k) => <span key={k} style={{ width: d, height: d, transform: "rotate(45deg)", display: "block", flex: "none", background: color, opacity: .8 }} />;
  if (!marks.length) return <>{diamond("solo")}{hasCar && <span style={{ width: cq(full ? 3.2 : 4), height: cq(full ? 3.2 : 4), display: "block", flex: "none" }}><Car size="100%" color={color} strokeWidth={1.8} /></span>}</>;
  const label = [...marks.map(m => m.p), hasCar ? "drives to events" : null].filter(Boolean).join(", ");
  return (
    <span className="ff-pc-marks" role="img" aria-label={label} title={label}>
      {marks.map((m, i) => {
        const I = markIcon(m.icon);
        return (
          <React.Fragment key={m.icon}>
            {i > 0 && diamond(`d${i}`)}
            <span style={{ width: s, height: s, display: "block", flex: "none" }}><I size="100%" color={color} strokeWidth={1.7} /></span>
          </React.Fragment>
        );
      })}
      {hasCar && <>{diamond("dc")}<span style={{ width: s, height: s, display: "block", flex: "none" }}><Car size="100%" color={color} strokeWidth={1.7} /></span></>}
    </span>
  );
}



/* ---- 4b. Q&A: questions people ask on Network ---------------------------- */
/* Questions asked on someone's profile ("Ask a question" on Network) appear
   on that profile with who asked. Directory examples, so the idea shows: */
const ASKED_EXAMPLES = [
  { id: "askx_sam1", personId: "stf_sam", byId: "stf_ava", text: "Do you bring your own bar kit to events?", answer: "Yes — a full cocktail and flair kit.", askedAt: Date.UTC(2026, 9, 9) },
  { id: "askx_don1", personId: "stf_don", byId: "stf_leo", text: "Can you run a whisky tasting for 30 guests?", answer: "Yes. I've hosted tastings for up to 60.", askedAt: Date.UTC(2026, 9, 12) },
];


const ASK_FROM_INVITER = "Do you run cocktail masterclasses for private parties?";


/* What people asked you: anything in profileQuestions for "me", plus (in
   this preview) one question from whoever invited you. Answers are kept
   with your other answers; answering one counts as a Question Card. */
function askedOfMe(state, people) {
  const inv = inviterOf(state, people);
  const demo = inv ? [{ id: `ask_in_${inv.id}`, personId: "me", text: ASK_FROM_INVITER, byId: inv.id, byName: inv.name, askedAt: Date.UTC(2026, 9, 14), example: true }] : [];
  const mine = (state.profileQuestions || []).filter(q => q.personId === "me");
  return [...demo, ...mine].map(q => ({ ...q, type: "text", group: "asked", placeholder: "Your answer", xp: XP_VALUES.question }));
}


function askerName(q, people, myName) {
  if (q.byId === "me") return myName ? `${myName} (you)` : "you";
  if (q.byName) return q.byName;
  const p = q.byId && people.find(x => x.id === q.byId);
  return p ? p.name : "someone on FireFlair";
}


const askedOn = (ms) => ms ? new Date(ms).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "";



/* The Q&A collection on your own profile, in one rounded panel: filter chips (All, About me, Asked, Interests), the
   questions people asked you, your Question Cards (To answer / Answered) and your Interests. */
function QuestionCardsCollection() {
  const { state } = useStore();
  const people = useDirectory();
  const [openId, setOpenId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [openAsked, setOpenAsked] = useState(null);
  const [openInt, setOpenInt] = useState(null);
  const [celebrate, setCelebrate] = useState(null);
  const [side, setSide] = useState("todo");
  const [adding, setAdding] = useState(false);
  const [cat, setCat] = useState("all");
  const qs = allQuestions(state);
  const asked = askedOfMe(state, people);
  const interests = interestCards17(state, { id: "me" });
  const canAdd = qs.filter(q => q.mine).length < CUSTOM_QUESTION_LIMIT;
  const isDone = (q) => isAnswered(answerOf(state, q));
  const byRank = (a, b) => qaRank(a.id) - qaRank(b.id);
  const aboutQs = cat === "about" ? qs.filter(q => q.group !== "feedback") : qs;
  const todo = aboutQs.filter(q => !isDone(q)).sort(byRank);
  const done = aboutQs.filter(isDone).sort(byRank);
  const openQ = qs.find(q => q.id === (openId || editId)) || null;
  const askedQ = asked.find(q => q.id === openAsked) || null;
  const intCard = interests.find(c => c.id === openInt) || null;
  const present = QUESTION_GROUPS.filter(g => aboutQs.some(q => q.group === g.key));
  const counts = { about: qs.filter(q => q.group !== "feedback").length, asked: asked.length, interest: interests.length };
  const showAsked = asked.length > 0 && (cat === "all" || cat === "asked");
  const showAbout = cat === "all" || cat === "about";
  const showInt = interests.length > 0 && (cat === "all" || cat === "interest");
  const onSaved = (id, isNew) => {
    if (!isNew) return;
    setCelebrate(id);
    setTimeout(() => setCelebrate(c => (c === id ? null : c)), 2000);
  };
  const card = (q) => (
    <span key={q.id} data-qid={q.id} style={{ display: "block", position: "relative" }}>
      <QuestionCard q={q} answer={answerOf(state, q)} label={q.mine ? "My question" : undefined} celebrate={celebrate === q.id} onClick={() => setOpenId(q.id)} />
      {q.mine && <button type="button" className="ff-qedit17" aria-label="Edit question" onClick={() => setEditId(q.id)}><Pencil size={13} strokeWidth={2} /></button>}
    </span>
  );
  const list = side === "todo" ? todo : done;
  return (
    <div className="ff-qa-panel">
      <QaFilter17 counts={counts} value={cat} onChange={setCat} />
      {showAsked && (
        <div className="ff-qa-asked">
          <div className="ff-qa-subh">
            <span className="ff-qa-ic"><MessageSquare size={14} /></span>
            <b>Asked on your profile</b><span className="ff-pill">{asked.length}</span>
          </div>
          <HScroll label="Questions people asked you">
            {asked.map(q => (
              <QuestionCard key={q.id} q={q} answer={answerOf(state, q)} label="Asked you" onClick={() => setOpenAsked(q.id)}
                asker={`${askerName(q, people)}${q.askedAt ? ` · ${askedOn(q.askedAt)}` : ""}`} pending="Tap to answer" />
            ))}
          </HScroll>
        </div>
      )}
      {showAbout && (
      <div className="ff-qa-cards">
        <div className="ff-qa-subh">
          <span className="ff-qa-ic"><HelpCircle size={14} /></span>
          <b>Question Cards</b>
          {PHASE1.xpLive && <span className="ff-qa-meta">{`+${XP_VALUES.question} XP each`}</span>}
        </div>
        <div className="ff-qa-tabs" role="tablist" aria-label="Question Cards">
          <button type="button" role="tab" aria-selected={side === "todo"} className={side === "todo" ? "on" : ""} onClick={() => setSide("todo")}>To answer <span>{todo.length}</span></button>
          <button type="button" role="tab" aria-selected={side === "done"} className={`done${side === "done" ? " on" : ""}`} onClick={() => setSide("done")}>Answered <span>{done.length}</span></button>
        </div>
        <div className="ff-qa-legend">
          {present.map(g => (
            <span key={g.key}><i style={{ background: questionGroupColor(g.key).bg, borderColor: questionGroupColor(g.key).sub }} />{g.label}{g.key === "feedback" ? " (private)" : ""}</span>
          ))}
          <span><i style={{ background: QUESTION_DONE.bg, borderColor: "#39C27E" }} />Answered</span>
        </div>
        <HScroll label={side === "todo" ? "Question Cards to answer" : "Answered Question Cards"}>
          {list.length ? list.map(card) : <div className="ff-qa-slot">{side === "todo" ? "All answered — nice work." : "Answered questions move here."}</div>}
          {canAdd && <AddQuestionCard onClick={() => setAdding(true)} />}
        </HScroll>
      </div>
      )}
      {showInt && (
        <div className="ff-qa-cards ff-qa-ints" style={cat === "all" ? { marginTop: 14 } : undefined}>
          <div className="ff-qa-subh">
            <span className="ff-qa-ic"><I11.Heart size={14} /></span>
            <b>Interests</b><span className="ff-pill">{interests.length}</span>
          </div>
          <HScroll label="Interests">
            {interests.map(c => (
              <QuestionCard key={c.id} q={c} answer="Yes" label="Interests" onClick={() => setOpenInt(c.id)} />
            ))}
          </HScroll>
        </div>
      )}
      <NewQuestionSheet open={adding} onClose={() => setAdding(false)} onAdded={() => { setSide("done"); setCat(c => (c === "asked" || c === "interest" ? "about" : c)); }} />
      <QuestionSheet open={!!openQ} q={openQ} edit={!!editId} onClose={() => { setOpenId(null); setEditId(null); }} onSaved={onSaved} />
      <QuestionSheet open={!!askedQ} q={askedQ} onClose={() => setOpenAsked(null)} />
      <InterestSheet17 card={intCard} onClose={() => setOpenInt(null)} />
    </div>
  );
}



/* What a profile shows in Q&A: answered questions the person made public (About me, Asked), and their Interests.
   Someone else's pending questions are not shown to the public; the person who asked still sees theirs, marked as sent. */
function publicQaItems17(state, person, people) {
  const isMine = person.id === "me";
  const items = [];
  if (isMine) {
    allQuestions(state).filter(q => q.group !== "feedback" && isAnswered(answerOf(state, q)) && qaVisOf17(state, q) === "public")
      .forEach(q => items.push({ id: q.id, cat: "about", q: { text: q.text, group: q.group }, label: q.mine ? "My question" : undefined, answer: answerOf(state, q) }));
    askedOfMe(state, people).filter(q => !hid17(state, "questions", q.id)).forEach(q => {
      const ans = answerOf(state, { ...q, group: "asked" });
      if (isAnswered(ans) && qaVisOf17(state, q) === "public") items.push({ id: q.id, cat: "asked", q: { text: q.text, group: "asked" }, label: "Asked", asker: `Asked by ${askerName(q, people, String(state.profile.name || "").trim())}${q.askedAt ? ` · ${askedOn(q.askedAt)}` : ""}`, answer: ans });
    });
  } else {
    [...ASKED_EXAMPLES.filter(q => q.personId === person.id), ...(state.profileQuestions || []).filter(q => q.personId === person.id && !q.companyKey && !hid17(state, "questions", q.id))].forEach(q => {
      const mineAsk = q.byId === "me" || (!q.byId && !q.byName), answered = isAnswered(q.answer), pub = ASKED_EXAMPLES.includes(q) || q.visibility === "public";
      if (answered && pub) items.push({ id: q.id, cat: "asked", q: { text: q.text, group: "asked" }, label: mineAsk ? "Your question" : "Asked", asker: `Asked by ${mineAsk ? "you" : askerName(q, people)}${q.askedAt ? ` · ${askedOn(q.askedAt)}` : ""}`, answer: q.answer });
      else if (!answered && mineAsk) items.push({ id: q.id, cat: "asked", q: { text: q.text, group: "asked" }, label: "Your question", asker: `Asked by you${q.askedAt ? ` · ${askedOn(q.askedAt)}` : ""}`, answer: "", pending: `Sent to ${String(person.name || "").split(" ")[0] || "them"}` });
    });
  }
  interestCards17(state, person).filter(c => c.vis === "public")
    .forEach(c => items.push({ id: c.id, cat: "interest", q: { text: c.text, group: "interest" }, label: "Interests", answer: "Yes" }));
  return items;
}



/* Q&A on a profile someone views: the public answers in three categories with a filter; on someone else's profile, Ask a question. */
function PublicQA({ person }) {
  const { state } = useStore();
  const people = useDirectory();
  const [asking, setAsking] = useState(false);
  const [cat, setCat] = useState("all");
  const first = String(person.name || "").split(" ")[0] || "them";
  const isMine = person.id === "me";
  const all = publicQaItems17(state, person, people);
  const counts = { about: all.filter(x => x.cat === "about").length, asked: all.filter(x => x.cat === "asked").length, interest: all.filter(x => x.cat === "interest").length };
  const shown = cat === "all" || !counts[cat] ? all : all.filter(x => x.cat === cat);
  return (
    <section id="ff-public-qa" style={{ marginTop: 26 }}>
      <SectionHead icon={<MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Q&A" count={all.length} />
      <div className="ff-qa-panel">
        <QaFilter17 counts={counts} value={counts[cat] ? cat : "all"} onChange={setCat} />
        {shown.length > 0 ? (
          <HScroll label="Q&A" snap>
            {shown.map(x => (
              <QuestionCard key={x.id} q={x.q} answer={x.answer} label={x.label} asker={x.asker} pending={x.pending || "Waiting for an answer"} />
            ))}
          </HScroll>
        ) : (
          <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 13.5 }}>No questions yet{isMine ? "." : ` — ask ${first} the first one.`}</p>
        )}
        {!isMine && (
          <div style={{ marginTop: 12 }}>
            <Btn variant="wide" onClick={() => setAsking(true)}><MessageSquare size={14} /> Ask {first} a question</Btn>
          </div>
        )}
      </div>
      <AskQuestionSheet open={asking} person={person} onClose={() => setAsking(false)} />
    </section>
  );
}



/* ---- 4c. Share and the wallets, one stack --------------------------------
   Share (WhatsApp) first, then Add to Apple Wallet and Add to Google Wallet:
   the same size and shape. The wallets are locked — no pass is made. */
function ShareStack({ blocker }) {
  const { state, dispatch } = useStore();
  const { share, busy } = useShareCard();
  const signedIn = state.auth.status === "signedIn";
  const p = state.profile;
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const why = blocker !== undefined ? blocker : !signedIn ? "Create your FF Tag first to share your card." : !cardReady ? "Add a profession to share." : null;
  return (
    <div className="ff-sharestack">
      <button type="button" className="ff-stackbtn wa" disabled={!!why || busy} onClick={share}>
        {busy ? <Loader2 size={18} className="ff-spin" /> : <WhatsAppIcon size={20} />} <span>Share</span>
      </button>
      {why && <p className="ff-sharestack-note">{why}</p>}
      <div className="ff-walletpair">
        {[["Apple Wallet", AppleWalletMark], ["Google Wallet", GoogleWalletMark]].map(([name, Mark]) => (
          <button key={name} type="button" className="ff-stackbtn soon" aria-disabled="true" aria-label={`Add to ${name} — coming in 2027`}
            onClick={() => dispatch({ type: "TOAST", toast: `Add to ${name} is coming in 2027` })}>
            <span className="mk"><Mark /></span>
            <span className="wtx"><small>Add to</small><b>{name}</b></span>
            <span className="ff-stack-lock" title="Coming 2027"><Lock size={9} strokeWidth={2.6} /></span>
          </button>
        ))}
      </div>
      <p className="ff-sharestack-soon">Wallet passes coming in 2027</p>
    </div>
  );
}



/* On your saved profile, while editing: the same Save & Publish at the foot
   of the page — Save ends editing. */
function P1SaveWhileEditing() {
  const { state } = useStore();
  if (!(state.profileEdit && state.profileEdit.on)) return null;
  return <div hidden style={{ display: "none" }}><SaveShareCard onSaved={() => { const el = document.getElementById("ff-pe-anchor"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }} /></div>;
}



/* ---- 4e. Verification levels (FF XP · 2027) ---------------------------
   XP isn't live in version 1. Levels grow with network connections: Base
   (the greyed-out coin) to start, Bronze at 5, Silver at 20, Gold locked. */
const VERIFICATION_LEVELS = [
  { tier: "base", name: "Base", connections: 0, note: "Where everyone starts" },
  { tier: "bronze", name: "Bronze", connections: 5, note: "5 network connections" },
  { tier: "silver", name: "Silver", connections: 20, note: "20 network connections" },
  { tier: "gold", name: "Gold", connections: null, note: "Locked for now" },
];


function verificationLevel(connections) {
  const reached = VERIFICATION_LEVELS.filter(l => l.connections !== null && connections >= l.connections);
  const cur = reached[reached.length - 1] || VERIFICATION_LEVELS[0];
  const next = VERIFICATION_LEVELS.find(l => l.connections !== null && l.connections > connections) || null;
  return { ...cur, next };
}


function MyVerificationPill() {
  const { state } = useStore();
  const people = useDirectory();
  const n = myNetwork(state, people).list.length;
  const lv = verificationLevel(n);
  return (
    <button type="button" className="ff-pill ff-pillbtn ff-verpill" onClick={() => window.dispatchEvent(new Event("ff-xp"))}>
      <Coin size={14} tier={lv.tier} /> {lv.name} · Verification level
    </button>
  );
}




/* ---- 4g. No profile picture yet: add one now -----------------------------
   Under the finished card. Picks a photo, makes it a small square-ish JPEG
   and puts it on the card straight away. */
function shrinkPhoto(file, max = 640) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      resolve(c.toDataURL("image/jpeg", 0.86));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a picture we can read.")); };
    img.src = url;
  });
}


function P1PhotoPrompt() {
  const { state, dispatch } = useStore();
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  if (state.profile.photo) return null;
  const pick = async (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    setBusy(true);
    try {
      const photo = await shrinkPhoto(f);
      dispatch({ type: "PROFILE", patch: { photo } });
      dispatch({ type: "TOAST", toast: "Profile picture added" });
    } catch (err) { dispatch({ type: "TOAST", toast: err.message }); }
    finally { setBusy(false); }
  };
  return (
    <div className="ff-photoprompt" role="note">
      <span className="ph"><Camera size={20} strokeWidth={1.7} /></span>
      <span className="tx"><b>You don't have a profile picture yet.</b><small>Add one now — people book faces they know.</small></span>
      <input ref={ref} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} aria-label="Choose a profile picture" />
      <button type="button" className="ff-photoprompt-btn" disabled={busy} onClick={() => ref.current && ref.current.click()}>
        {busy ? <Loader2 size={14} className="ff-spin" /> : <Plus size={14} />} Add photo
      </button>
    </div>
  );
}



function Bell(props) { return <BellIcon {...props} />; }


const pickIcon = (...names) => markIcon(names.find(hasLucide) || "Sparkles");


const XP_HOW = [
  { icon: "User", title: "Build", text: "Complete your Profile Card and profile." },
  { icon: "Send", title: "Share", text: "Publish and share your Profile Card." },
  { icon: "Users", title: "Grow", text: "Connect with the people you work with." },
];



const XP_REWARDS = [
  { id: "bar_shows", kind: "Travel", icons: ["Plane"], tone: "sky", title: "International bar shows", note: "Flights and hotel paid: Lisbon Bar Show, Perfect Serve Amsterdam, Athens Bar Show, Bar Convent Berlin." },
  { id: "training", kind: "Training", icons: ["Ticket", "GraduationCap"], tone: "amber", title: "Free training tickets", note: "Places on masterclasses, brand training and courses that grow your skills." },
  { id: "amex", kind: "Business", icons: ["CreditCard"], tone: "steel", title: "American Express Gold business card", note: "A business expense card for your freelance work." },
  { id: "nfc", kind: "Your card", icons: ["Nfc", "Smartphone"], tone: "burgundy", title: "FF NFC business card", note: "A physical FireFlair card: tap it on a phone to share your Profile Card." },
  { id: "kit", kind: "Kit", icons: ["Martini"], tone: "ember", title: "Branded cocktail equipment", note: "High-quality branded bar tools for your own professional kit." },
  { id: "car", kind: "Travel", icons: ["Car"], tone: "racing", title: "Car rental", note: "A car for the jobs that need one: your kit, late finishes and out-of-town events." },
  { id: "party", kind: "FF party", icons: ["PartyPopper"], tone: "night", title: "FF staff parties", note: "You work everyone else's parties. We throw yours." },
  { id: "shoot", kind: "Profile", icons: ["Camera"], tone: "violet", title: "Professional photoshoot", note: "Headshots and action shots for your Profile Card and media." },
];



function P1RewardsSection() { return <InterestSection kind="rewards" />; }



/* Set by Publish in Save & Publish, read once by Welcome to the Team, which
   then shows the "published" confirmation. */
const P1_JUST_PUBLISHED = { v: false };
