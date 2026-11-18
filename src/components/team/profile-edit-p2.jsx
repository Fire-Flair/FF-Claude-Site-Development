/* src/components/team/profile-edit-p2.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   p2/pbuild (18 Nov 2026): the own-profile edit page, below Media, looks like the finished profile.
   p2/pfb: Professions have no pencil — a card opens its own editor (level, description, media).
   pb-professions: no pop-up; with no professions the category boxes are listed in the Professions area, and once there
   are professions a "+" card at the end opens the same boxes under the row. Every Attribute card shows even when empty, as a placeholder card with a pencil; a pencil opens the
   Light sheet editor (approved editor option 1).
   Q&A sits above Save, always open, answered inline. Ported from the p2/profpick drafts; reads and writes the real records. */

const PE2_CSS = __ff_css("styles/profile-edit-p2.css");

/* top-slots (Alex, 18 Nov 21:02): choosing the top three without dragging. Three slots, 1 to 3, are the three on the
   Profile Card. Tapping a filled slot empties it; while a slot is empty, the other professions show underneath and tapping
   one fills the next empty slot. The order is saved as before (REC_MOVE), so the card, the public page and the network all
   follow it. An emptied profession goes to the end of the list, so the card shows the next one in line until it is refilled. */
function PE2TopSlots({ profs }) {
  const { dispatch } = useStore();
  const ids = profs.map(r => r.id);
  const nameOf = (id) => (profs.find(r => r.id === id) || {}).name || "";
  const [slots, setSlots] = useState(() => [0, 1, 2].map(i => ids[i] || null));
  /* Keep the slots in step with the list (a profession added, removed or renamed elsewhere). */
  useEffect(() => {
    setSlots(cur => {
      const kept = cur.map(id => (id && ids.includes(id)) ? id : null);
      const used = new Set(kept.filter(Boolean));
      const free = ids.filter(id => !used.has(id));
      /* An empty slot the member left stays empty; a slot left over from a removed profession takes the next one. */
      return kept.map((id, i) => id || (cur[i] && !ids.includes(cur[i]) ? (free.shift() || null) : null));
    });
  }, [ids.join("|")]);
  const save = (next) => {
    const top = next.filter(Boolean);
    top.forEach((id, i) => dispatch({ type: "REC_MOVE", category: "professions", id, to: i }));
  };
  const empty = (i) => {
    const id = slots[i]; if (!id) return;
    const next = slots.map((x, k) => k === i ? null : x);
    setSlots(next);
    dispatch({ type: "REC_MOVE", category: "professions", id, to: ids.length - 1 });
    save(next);
  };
  const fill = (id) => {
    const at = slots.indexOf(null); if (at < 0) return;
    const next = slots.map((x, k) => k === at ? id : x);
    setSlots(next); save(next);
  };
  const rest = ids.filter(id => !slots.includes(id));
  const open = slots.includes(null) && rest.length > 0;
  return (
    <div className="pe2-top3" role="group" aria-label="Your top three professions, shown on your Profile Card">
      <div className="pe2-top3-slots">
        {slots.map((id, i) => (
          <button key={i} type="button" className={"pe2-top3-slot" + (id ? " on" : "")} onClick={() => empty(i)} disabled={!id}
            aria-label={id ? `Number ${i + 1}: ${nameOf(id)}. Remove from your top three` : `Number ${i + 1}: empty`}>
            <span className="n">{i + 1}</span>
            <span className="t">{id ? nameOf(id) : ""}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="pe2-top3-pick" role="group" aria-label="Choose a profession for your top three">
          {rest.map(id => <button key={id} type="button" className="pe2-top3-chip" onClick={() => fill(id)}>{nameOf(id)}</button>)}
        </div>
      )}
    </div>
  );
}


/* The Bar ladder, entry to top: 1 Barback … 5 Mixologist, shown top down (p2/pfb: Barback first and smallest,
   Mixologist last and largest). Every other category is alphabetical. */
const PE2_LADDER = ["Barback", "Bartender", "Cocktail Bartender", "Flair Bartender", "Mixologist"];
const PE2_CATS = PROFESSION_CATEGORIES.map(c => ({
  key: c.key, ranked: c.key === "Bar",
  list: c.key === "Bar" ? PE2_LADDER : [...c.suggested].sort((a, b) => a.localeCompare(b)),
}));
/* p2/pubprof: Languages live on the Profile Card and Experience has its own section, so neither is an Attribute here. */
/* pb-qualifications (Alex 18:59): Qualifications first, on the left. */
const PE2_ATTRS = ["qualifications", "skills", "interests"];

/* The member's professions and add / remove. Removing goes by record id (never by name), so a hidden or
   renamed record with the same name can't be hit by mistake; adding a name that is already there (hidden or
   proposed) shows it again instead of being dropped by the merge. */
function usePE2Profs() {
  const { state, dispatch } = useStore();
  const all = rankedRecords(recsOf(state.profile, "professions"));
  const mine = all.filter(r => !r.hidden && !r.proposed);
  const find = (n) => mine.find(r => r.name.toLowerCase() === String(n).toLowerCase());
  const remove = (r) => dispatch({ type: "REC_DELETE", category: "professions", id: r.id });
  const toggle = (n, category) => {
    const r = find(n);
    if (r) { remove(r); return; }
    const old = all.find(x => x.name.toLowerCase() === String(n).toLowerCase());
    if (old) { dispatch({ type: "REC_PATCH", category: "professions", id: old.id, patch: { hidden: false, proposed: false } }); return; }
    const approved = ALL_PROFESSIONS.some(p => p.name.toLowerCase() === String(n).toLowerCase());
    dispatch({ type: "RECORDS_MERGE", byCategory: { professions: [makeRecord("professions", n, { professionSource: approved ? "approved" : "user", ...(category ? { displayCategory: category } : {}) })] } });
  };
  const catOf = (r) => professionCategory(r.name, r.displayCategory) || "Other";
  const ownIn = (key) => mine.filter(r => !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === r.name.toLowerCase()) && catOf(r) === key);
  return { mine, has: (n) => !!find(n), toggle, remove, catOf, ownIn, dispatch };
}

/* pb-professions (Alex, 18 Nov 18:03 / 18:59; variant "categories" picked 19:26): no pop-up. The categories are boxes
   the size of the Attribute boxes, listed across the Professions area, each with its professions inside; tapping one
   adds it (tap again removes it). With no professions yet the boxes show straight away; once there are professions,
   a "+" box after them opens the same boxes below the row. */
/* Typed professions: up to 60 characters on the profile (Alex 19:19; boxes wrap between words). The Profile Card's
   16-character rule only affects the card: a longer entry is left off the card whole, never cut. */
const PROF_MAX_LEN = 60;
const PE2_CAT_KEYS = [...PROFESSION_CATEGORIES.map(c => c.key), "Other"];
const pe2Title = (t) => String(t).trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase()).slice(0, PROF_MAX_LEN);
/* A typed name that matches a listed profession (any case) becomes that profession. */
const pe2Listed = (t) => ALL_PROFESSIONS.find(p => p.name.toLowerCase() === String(t).trim().toLowerCase());

function PE2StairMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={1 + i * 5.8} y={24 - i * 5} width={4.6} height={5 + i * 5} rx={1.4} fill="currentColor" opacity={0.45 + i * 0.13} />)}
    </svg>
  );
}

/* Shrink, never split: the longest word decides the size. */
const pe2Fit = (t) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return L >= 13 ? "14.5px" : L >= 11 ? "15.5px" : "17px"; };

/* The category's mark: the Bar ladder's steps, Other a spark (GroupIcon gives Other the Front of House people icon). */
const pe2CatIcon = (k, size) => k === "Bar" ? <PE2StairMark size={size + 2} /> : k === "Other" ? <Sparkles size={size} strokeWidth={1.6} /> : <GroupIcon group={k} size={size} color="currentColor" />;

/* One profession inside a category box. The Bar ladder shows its step as a rising bar. */
function PE2CatItem({ name, on, onClick, step }) {
  return (
    <button type="button" className={"pe2-ci" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>
      {step ? <span className="pe2-ci-step" style={{ "--h": step }} aria-label={`Step ${step} of 5`}><i /></span> : null}
      <span className="pe2-ci-nm">{name}</span>
      <span className="pe2-ci-mk" aria-hidden="true">{on ? <Check size={13} strokeWidth={2.8} /> : <Plus size={13} strokeWidth={2.4} />}</span>
    </button>
  );
}

/* FireFlair asks which category a typed profession belongs to when it can't place it (Other included). */
function PE2Which({ P }) {
  const r = P.mine.find(x => !professionCategory(x.name, x.displayCategory));
  if (!r) return null;
  return (
    <div className="pp-which">
      <div className="pp-which-q"><Coin size={20} tier="gold" /><span>Which category is {"“"}{r.name}{"”"}?</span></div>
      <div className="pp-which-row">
        {PE2_CAT_KEYS.map(k => (
          <button key={k} type="button" className="pp-cat-b" onClick={() => P.dispatch({ type: "REC_PATCH", category: "professions", id: r.id, patch: { displayCategory: k } })}>{k}</button>
        ))}
      </div>
    </div>
  );
}

/* The add flow: a type box, then every category as an Attribute-sized box. */
function PE2ProfCats({ P }) {
  const [q, setQ] = useState("");
  /* prof-edits (Alex, 18 Nov 20:58): the same search-as-you-type as the rest of the profile (ProfTypeIn): known
     professions that start with what was typed, then ones that contain it; Enter takes the first. */
  const qn = q.trim().toLowerCase();
  const hits = qn ? [
    ...ALL_PROFESSIONS.filter(x => x.name.toLowerCase().startsWith(qn)),
    ...ALL_PROFESSIONS.filter(x => !x.name.toLowerCase().startsWith(qn) && x.name.toLowerCase().includes(qn)),
  ].filter(x => !P.has(x.name)).slice(0, 6) : [];
  const pickHit = (nm) => { if (!P.has(nm)) P.toggle(nm); setQ(""); };
  const add = (e) => {
    e.preventDefault();
    const t = q.trim(); if (!t) return;
    if (hits[0] && hits[0].name.toLowerCase().startsWith(t.toLowerCase())) { pickHit(hits[0].name); return; }
    const hit = pe2Listed(t);
    const nm = hit ? hit.name : pe2Title(t);
    if (!P.has(nm)) P.toggle(nm);
    setQ("");
  };
  const own = P.ownIn("Other");
  const cats = [...PE2_CATS.filter(c => c.key !== "Other"), ...(own.length ? [{ key: "Other", list: [] }] : [])];
  return (
    <div className="pe2-pc">
      <form className={"ff-type21 pe2-pc-type" + (q.trim() ? " has" : "")} onSubmit={add}>
        <input type="text" value={q} maxLength={PROF_MAX_LEN} autoComplete="off" spellCheck={false} enterKeyHint="enter" placeholder="Type a profession" aria-label="Add a profession"
          onChange={(e) => setQ(e.target.value)} />
        <button type="submit" className="ff-type21-key" aria-label="Add a profession" tabIndex={-1}><span>Enter</span><CornerDownLeft21 size={15} strokeWidth={2.2} aria-hidden="true" /></button>
      </form>
      {hits.length > 0 && (
        <div className="pe2-pc-hits" role="listbox" aria-label="Matching professions">
          {hits.map(x => <button key={x.name} type="button" role="option" aria-selected="false" className="pe2-pc-hit" onClick={() => pickHit(x.name)}><span>{x.name}</span><small>{x.cat}</small></button>)}
        </div>
      )}
      <PE2Which P={P} />
      <div className="ff-mrow ff-acar pe2-rail pe2-cats" role="list" aria-label="Profession categories">
        {cats.map(c => {
          const mineHere = P.ownIn(c.key);
          const n = c.list.filter(x => P.has(x)).length + mineHere.length;
          return (
            <div key={c.key} role="listitem" className={"ff-agrp t-card pe2-cat" + (c.ranked ? " bar" : "") + (n ? " has" : "")}>
              <span className="ff-agrp-top">
                <span className="pe2-cat-ic" aria-hidden="true">{pe2CatIcon(c.key, 18)}</span>
                <span className="ff-agrp-h" style={{ "--fs": pe2Fit(c.key) }}>{c.key}</span>
                {n > 0 && <span className="ff-agrp-n">{n}</span>}
              </span>
              <span className="pe2-cat-l" role="group" aria-label={c.key}>
                {c.list.map((x, i) => <PE2CatItem key={x} name={x} on={P.has(x)} step={c.ranked ? i + 1 : 0} onClick={() => P.toggle(x)} />)}
                {mineHere.map(r => <PE2CatItem key={r.id} name={r.name} on onClick={() => P.remove(r)} />)}
              </span>
            </div>
          );
        })}
        <span className="ff-acar-end" aria-hidden="true" />
      </div>
    </div>
  );
}

/* p2/pfb: a profession's level, five grey diamonds filling in (the earlier system, as on the live FF Team site). */
function PE2Level({ r }) {
  const n = r.level || 0;
  return (
    <span className="ff-proflevel pe2-lv" role="img" aria-label={n ? `Level ${n} of 5, ${professionLevelTitle(n)}` : "Level not set"}>
      {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= n ? "on" : ""} />)}
    </span>
  );
}

function PE2AddProf({ on, onClick }) {
  return <button type="button" className={"pe2-add-prof" + (on ? " on" : "")} aria-label="Add a profession" aria-expanded={on} aria-controls="pe2-prof-add" onClick={onClick}><span className="pe2-add-ic" aria-hidden="true"><Plus size={26} strokeWidth={2.2} /></span></button>;
}

/* Professions and Attributes on the edit page, laid out as the finished profile, empty ones as placeholder cards. */
function PE2Overview({ records }) {
  const P = usePE2Profs();
  const [attrOpen, setAttrOpen] = useState(null);
  const [qualOpen, setQualOpen] = useState(null);
  const [openVen, setOpenVen] = useState(null);
  const [openProf, setOpenProf] = useState(null);
  const profs = rankedRecords(records.professions || []).filter(r => !r.hidden && !r.proposed);
  /* adding: the category boxes are open (always while there are no professions, so they stay open while people pick). */
  const [adding, setAdding] = useState(() => !profs.length);
  useEffect(() => { if (!profs.length) setAdding(true); }, [profs.length]);
  /* The tiles row always starts at the first tile, also when the "+" opens or closes the boxes. */
  const profsRef = useRef(null);
  useEffect(() => { const r = profsRef.current && profsRef.current.querySelector(".ff-pt21-row"); if (r) r.scrollLeft = 0; }, [adding]);
  const cats = PE2_ATTRS.filter(k => BASE_CATEGORIES[k]);
  /* v1.29 Experience (was Venues): venue records and the older Experience records together. */
  const venAll = [...(records.venues || []), ...(records.experience || [])];
  return (
    <>
      <style>{PE2_CSS}</style>
      <section ref={profsRef} className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-profs-h">
        <div className="ff-pp-head"><h2 id="pe2-profs-h" className="ff-about-h">Professions</h2></div>
        {profs.length > 0 && (
          <PE2TopSlots profs={profs} />
        )}
        {profs.length > 0 && (
          <ProfTiles21 items={profs} def={BASE_CATEGORIES.professions} onOpen={(r) => setOpenProf(r)} extra={(r) => <PE2Level r={r} />} top={FEATURE_LIMIT}
            tail={<div role="listitem" className="ff-pt21-slot"><PE2AddProf on={adding} onClick={() => setAdding(!adding)} /></div>} />
        )}
        {(adding || !profs.length) && (
          <div id="pe2-prof-add" className={"pe2-prof-add" + (profs.length ? " under" : "")} role="region" aria-label="Add a profession">
            <PE2ProfCats P={P} />
          </div>
        )}
      </section>
      {/* about-overview (Alex, 18 Nov 21:17): About Me between Professions and Attributes, as on the published profile. */}
      <CreatorAboutMe top />
      <section className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-attr-h">
        <div className="ff-pp-head"><h2 id="pe2-attr-h" className="ff-about-h">Attributes</h2></div>
        <div className="ff-mrow ff-acar pe2-rail" role="list" aria-label="Attributes">
          {cats.map((k, ci) => {
            if (k === "qualifications") return <PE2QualCard key={k} records={records.qualifications} openId={qualOpen} onOpen={(id) => { setQualOpen(id); if (id) setAttrOpen(null); }} />;
            /* pb-typecards: Skills and Interests are typed straight onto their cards (type-cards.jsx). */
            if (TYPECARD_CATS.includes(k)) return <TypeCards26 key={k} catKey={k} records={records[k] || []} tone={tierCls17(ci)} />;
            const def = BASE_CATEGORIES[k];
            const shown = rankedRecords(records[k] || []).filter(r => !r.hidden && !r.proposed);
            const empty = !shown.length;
            const on = attrOpen === k;
            return (
              <button key={k} type="button" role="listitem" className={"ff-agrp " + (empty ? "pe2-agrp-empty" : tierCls17(ci)) + (on ? " pe2-agrp-on" : "")} aria-label={`Edit ${def.label}`} aria-expanded={on} aria-controls="pe2-attr-ed" onClick={() => { setAttrOpen(on ? null : k); setQualOpen(null); }}>
                <span className="ff-agrp-top"><span className="ff-agrp-h">{def.label}</span>{!empty && <span className="ff-agrp-n">{shown.length}</span>}</span>
                {empty ? <span className="pe2-empty-fill" aria-hidden="true" /> : <span className="ff-agrp-l">{shown.slice(0, 5).map(r => <span key={r.id}>{nbh21(r.name)}</span>)}</span>}
                {shown.length > 5 && <span className="ff-agrp-more">{`+${shown.length - 5}`}</span>}
                <span className="pe2-cardpen" aria-hidden="true"><Pencil size={14} strokeWidth={2} /></span>
              </button>
            );
          })}
          <span className="ff-acar-end" aria-hidden="true" />
        </div>
        {qualOpen && <PE2QualEditor records={records.qualifications} id={qualOpen} onDone={() => setQualOpen(null)} />}
        {/* pfc (Alex 03:29): the tapped card opens its editor here, in the page, as on the live FF Team site: the type box,
            then the entries as tiles; a tile opens its own editor under the row. No pop-up. */}
        {attrOpen && BASE_CATEGORIES[attrOpen] && (
          <div id="pe2-attr-ed" className="ff-pa40-cat pe2-attr-ed" role="region" aria-label={BASE_CATEGORIES[attrOpen].label}>
            <style>{RANK_CSS17}</style>
            <div className="pe2-attr-edh">{BASE_CATEGORIES[attrOpen].label}</div>
            <TypeBox21 key={attrOpen} catKey={attrOpen} def={BASE_CATEGORIES[attrOpen]} rows={rankedRecords(records[attrOpen] || [])} />
            <ProfTiles21 key={"t" + attrOpen} items={records[attrOpen] || []} editable def={BASE_CATEGORIES[attrOpen]} catKey={attrOpen} label={BASE_CATEGORIES[attrOpen].label} compact />
          </div>
        )}
      </section>
      {SHOW_VENUES_PROFILE17 && (
        <section className="ff-pp ff-pp21 pp-sec pe2-ven" aria-labelledby="pe2-ven-h">
          <div className="ff-pp-head"><h2 id="pe2-ven-h" className="ff-about-h">Experience</h2></div>
          {/* v1.29: a Google business search per venue, then the Experience cards. */}
          <ExperienceEditor29 items={venAll} onOpen={(r) => setOpenVen(r)} />
        </section>
      )}
      <GenericAttributeCardCreator open={!!openProf} record={openProf} def={BASE_CATEGORIES.professions} category="professions" onClose={() => setOpenProf(null)} />
      <GenericAttributeCardCreator open={!!openVen} record={openVen} def={openVen && BASE_CATEGORIES[openVen.category]} category={openVen && openVen.category} onClose={() => setOpenVen(null)} />
    </>
  );
}

/* p2/pfd (Alex): Q&A above Save, in the live FF Team look (Griffy's QuestionCardsCollection): one panel, Question Cards
   split into To answer / Answered with a colour key, a left/right row of cards. Tapping a card opens its answer box right
   under the row (Yes / No, then a type box) instead of a sheet; the answer shows on the card at once and it moves to
   Answered. Your own question: Yes / No, then type it and press Enter. */
function PE2Answer({ q, value, onAnswer, onClose }) {
  const [txt, setTxt] = useState("");
  const opts = q.type === "text" ? ["Yes", "No"] : (q.options || ["Yes", "No"]);
  const send = () => {
    const t = txt.trim();
    if (!t) return;
    const pre = q.detail && String(value || "").startsWith(q.detail.option) ? `${q.detail.option} — ` : "";
    onAnswer(pre + t, true);
    setTxt("");
  };
  const on = (o) => value === o || (q.detail && o === q.detail.option && String(value || "").startsWith(o + " —"));
  return (
    <div className="pe2-qa-ans" data-qid={q.id}>
      <div className="pe2-qa-ans-q">{q.text}</div>
      <div className="pe2-q-opts" role="group" aria-label={q.text}>
        {opts.map(o => <button key={o} type="button" className={"pe2-opt" + (on(o) ? " on" : "")} aria-pressed={!!on(o)}
          onClick={() => onAnswer(o, !(q.detail && o === q.detail.option))}>{o}</button>)}
      </div>
      <form className={"ff-type21 pe2-q-type" + (txt.trim() ? " has" : "")} onSubmit={(e) => { e.preventDefault(); send(); }}>
        <input type="text" value={txt} maxLength={400} placeholder={(q.detail && q.detail.placeholder) || q.placeholder || "Your answer"} aria-label={`${q.text} — your answer`} onChange={(e) => setTxt(e.target.value)} />
        <button type="submit" className="ff-type21-key" aria-label="Save answer"><span>Enter</span><CornerDownLeft21 size={15} strokeWidth={2.2} aria-hidden="true" /></button>
      </form>
      {q.mine && <DeleteMyQuestion q={q} onClose={onClose} />}
    </div>
  );
}

function PE2QA() {
  const { state, dispatch } = useStore();
  const qs = allQuestions(state);
  const [side, setSide] = useState("todo");
  const [openId, setOpenId] = useState(null);
  const [own, setOwn] = useState("");
  const [yn, setYn] = useState("Yes");
  const canAdd = qs.filter(q => q.mine).length < CUSTOM_QUESTION_LIMIT;
  const isDone = (q) => isAnswered(answerOf(state, q));
  const todo = qs.filter(q => !isDone(q));
  const done = qs.filter(isDone);
  const list = side === "todo" ? todo : done;
  const present = QUESTION_GROUPS.filter(g => qs.some(q => q.group === g.key));
  const openQ = qs.find(q => q.id === openId) || null;
  const answer = (v, close) => {
    dispatch({ type: "ANSWER", qid: openQ.id, value: v });
    if (close) setOpenId(null);
  };
  const add = () => {
    const text = own.trim();
    if (!text || !canAdd) return;
    dispatch({ type: "MY_QUESTION_ADD", question: { id: `my_${Date.now().toString(36)}`, text, type: "yesno" }, value: yn, visibility: "private" });
    setOwn("");
    setSide("done");
  };
  return (
    <section className="ff-pp ff-pp21 pe2-qa" id="pe2-qa" aria-labelledby="pe2-qa-h">
      <style>{PE2_CSS}</style>
      <div className="ff-pp-head"><h2 id="pe2-qa-h" className="ff-about-h">Q&amp;A</h2></div>
      <div className="ff-qa-panel pe2-qa-panel">
        <div className="ff-qa-subh">
          <span className="ff-qa-ic"><HelpCircle size={14} /></span>
          <b>Question Cards</b>
          <span className="ff-qa-meta">never on your public card</span>
        </div>
        <div className="ff-qa-tabs" role="tablist" aria-label="Question Cards">
          <button type="button" role="tab" aria-selected={side === "todo"} className={side === "todo" ? "on" : ""} onClick={() => setSide("todo")}>To answer <span>{todo.length}</span></button>
          <button type="button" role="tab" aria-selected={side === "done"} className={`done${side === "done" ? " on" : ""}`} onClick={() => setSide("done")}>Answered <span>{done.length}</span></button>
        </div>
        <div className="ff-qa-legend">
          {present.map(g => <span key={g.key}><i style={{ background: questionGroupColor(g.key).bg, borderColor: questionGroupColor(g.key).sub }} />{g.label}</span>)}
          <span><i style={{ background: QUESTION_DONE.bg, borderColor: "#39C27E" }} />Answered</span>
        </div>
        <HScroll label={side === "todo" ? "Question Cards to answer" : "Answered Question Cards"} snap>
          {list.length
            ? list.map(q => (
                <span key={q.id} data-qid={q.id} className={"pe2-qa-cardw" + (openId === q.id ? " sel" : "")}>
                  <QuestionCard q={q} answer={answerOf(state, q)} label={q.mine ? "My question" : undefined} pending=" "
                    onClick={() => setOpenId(id => (id === q.id ? null : q.id))} />
                </span>
              ))
            : <div className="ff-qa-slot">{side === "todo" ? "All answered — nice work." : "Answered questions move here."}</div>}
        </HScroll>
        {openQ && <PE2Answer key={openQ.id} q={openQ} value={answerOf(state, openQ)} onAnswer={answer} onClose={() => setOpenId(null)} />}
        {canAdd && (
          <div className="pe2-qa-own">
            <div className="pe2-q-opts">
              {["Yes", "No"].map(o => <button key={o} type="button" className={"pe2-opt" + (yn === o ? " on" : "")} aria-pressed={yn === o} onClick={() => setYn(o)}>{o}</button>)}
            </div>
            <form className={"ff-type21 pe2-q-type" + (own.trim() ? " has" : "")} onSubmit={(e) => { e.preventDefault(); add(); }}>
              <input type="text" value={own} maxLength={CUSTOM_QUESTION_MAX} placeholder="Type your own question" aria-label="Your own question" onChange={(e) => setOwn(e.target.value)} />
              <button type="submit" className="ff-type21-key" aria-label="Add question"><span>Enter</span><CornerDownLeft21 size={15} strokeWidth={2.2} aria-hidden="true" /></button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}
