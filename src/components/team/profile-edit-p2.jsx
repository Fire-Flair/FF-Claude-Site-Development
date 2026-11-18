/* src/components/team/profile-edit-p2.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   p2/pbuild (18 Nov 2026): the own-profile edit page, below Media, looks like the finished profile.
   p2/pfb: Professions have no pencil — a card opens its own editor (level, description, media) and a blank "+" card
   at the end opens the Tiles picker. Every Attribute card shows even when empty, as a placeholder card with a pencil; a pencil opens the
   Light sheet editor (approved editor option 1); the Professions editor holds the Tiles picker (approved picker option 2).
   Q&A sits above Save, always open, answered inline. Ported from the p2/profpick drafts; reads and writes the real records. */

const PE2_CSS = __ff_css("styles/profile-edit-p2.css");

/* The Bar ladder, entry to top: 1 Barback … 5 Mixologist, shown top down (p2/pfb: Barback first and smallest,
   Mixologist last and largest). Every other category is alphabetical. */
const PE2_LADDER = ["Barback", "Bartender", "Cocktail Bartender", "Flair Bartender", "Mixologist"];
const PE2_LINE = {
  Bar: "From first shift to signature menus",
  "Front of House": "Hosts, waiters and sommeliers",
  Management: "Managers and planners",
  Entertainment: "DJs, musicians and performers",
  Services: "Photo, video and styling",
  Chefs: "Private, event and kitchen chefs",
  "Back of House": "Stock, kitchen and logistics",
  Other: "Your own profession",
};
const PE2_CATS = PROFESSION_CATEGORIES.map(c => ({
  key: c.key, ranked: c.key === "Bar",
  list: c.key === "Bar" ? PE2_LADDER : [...c.suggested].sort((a, b) => a.localeCompare(b)),
}));
/* p2/pubprof: Languages live on the Profile Card and Experience has its own section, so neither is an Attribute here. */
/* pb-qualifications (Alex 18:59): Qualifications first, on the left. */
const PE2_ATTRS = ["qualifications", "skills", "interests"];
const PE2_TITLES = { profs: "Professions", attrs: "Attributes", venues: "Experience" };

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

function PE2Item({ name, on, onClick, step }) {
  return (
    <button type="button" className={"pp-row" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>
      {step ? <span className="pp-step">{step}</span> : null}
      <span className="pp-nm">{name}</span>
      <span className="pp-mk" aria-hidden="true">{on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} strokeWidth={2.4} />}</span>
    </button>
  );
}

function PE2StairMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={1 + i * 5.8} y={24 - i * 5} width={4.6} height={5 + i * 5} rx={1.4} fill="currentColor" opacity={0.45 + i * 0.13} />)}
    </svg>
  );
}

/* Shrink, never split: the longest word decides the size. */
const pe2Fit = (t, wide) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return wide ? "15px" : L >= 13 ? "12px" : L >= 11 ? "13px" : "15px"; };

/* FireFlair asks which category a typed profession belongs to when it can't place it. */
function PE2Which({ P }) {
  const r = P.mine.find(x => !professionCategory(x.name, x.displayCategory));
  if (!r) return null;
  return (
    <div className="pp-which">
      <div className="pp-which-q"><Coin size={20} tier="gold" /><span>Which category is {"“"}{r.name}{"”"}?</span></div>
      <div className="pp-which-row">
        {PROFESSION_CATEGORIES.map(c => (
          <button key={c.key} type="button" className="pp-cat-b" onClick={() => P.dispatch({ type: "REC_PATCH", category: "professions", id: r.id, patch: { displayCategory: c.key } })}>{c.key}</button>
        ))}
      </div>
    </div>
  );
}

/* The Tiles picker: every category as an equal tile; one opens its list under its row. */
function PE2Picker({ P }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState("");
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.innerWidth >= 900);
  useEffect(() => { const f = () => setWide(window.innerWidth >= 900); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f); }, []);
  const n = q.trim().toLowerCase();
  const ok = (name) => !n || name.toLowerCase().includes(n);
  const enter = () => {
    const t = q.trim(); if (!t) return;
    const hit = ALL_PROFESSIONS.find(p => p.name.toLowerCase().startsWith(t.toLowerCase()));
    P.toggle(hit ? hit.name : t.replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    setQ("");
  };
  const cats = [...PE2_CATS, ...(P.ownIn("Other").length && !PE2_CATS.some(c => c.key === "Other") ? [{ key: "Other", list: [] }] : [])];
  const items = (c) => [...c.list.filter(ok).map(x => ({ n: x, on: P.has(x) })), ...P.ownIn(c.key).filter(r => ok(r.name)).map(r => ({ n: r.name, on: true }))];
  const chosen = (c) => items(c).filter(x => x.on).length;
  const cols = wide ? 4 : 2;
  const openIdx = cats.findIndex(c => c.key === open);
  const rowEnd = openIdx < 0 ? -1 : Math.min(cats.length - 1, Math.floor(openIdx / cols) * cols + cols - 1);
  const panel = (c) => (
    <div key="panel" className={"pp2-panel" + (c.ranked ? " ladder" : "")} role="region" aria-label={c.key}>
      {c.ranked ? (
        <div className="pp2-stairs">
          {c.list.map((x, i) => ({ x, i })).filter(o => ok(o.x)).map(({ x, i }) => (
            <div key={x} className="pp2-stair" style={{ "--s": c.list.length - 1 - i, "--g": i }}><PE2Item name={x} on={P.has(x)} onClick={() => P.toggle(x)} step={i + 1} /></div>
          ))}
          {P.ownIn(c.key).map(r => <div key={r.id} className="pp2-own"><PE2Item name={r.name} on onClick={() => P.remove(r)} /></div>)}
        </div>
      ) : (
        <div className="pp2-list">{items(c).map(x => <PE2Item key={x.n} name={x.n} on={x.on} onClick={() => P.toggle(x.n, c.key === "Other" ? undefined : c.key)} />)}</div>
      )}
    </div>
  );
  return (
    <div className="pp-pick pp2">
      <label className="pp-q">
        <Search size={17} aria-hidden="true" />
        <input type="search" value={q} autoComplete="off" spellCheck={false} enterKeyHint="enter" placeholder="Search or type a profession" aria-label="Search or type a profession"
          onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); enter(); } }} />
      </label>
      <PE2Which P={P} />
      <div className="pp2-grid" style={{ "--cols": cols }}>
        {cats.map((c, i) => (
          <React.Fragment key={c.key}>
            <button type="button" className={"pp2-tile" + (c.key === open ? " on" : "") + (c.ranked ? " bar" : "")} aria-expanded={c.key === open} onClick={() => setOpen(c.key === open ? "" : c.key)}>
              <span className="pp2-ic">{c.ranked ? <PE2StairMark size={30} /> : <GroupIcon group={c.key} size={28} color="currentColor" />}</span>
              <span className="pp2-nm" style={{ "--fs": pe2Fit(c.key, wide) }}>{c.key}</span>
              <span className="pp2-sub">{PE2_LINE[c.key] || ""}</span>
              {chosen(c) > 0 && <span className="pp-cnt"><Check size={11} strokeWidth={3} />{chosen(c)}</span>}
            </button>
            {i === rowEnd && panel(cats[openIdx])}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* Professions editor: your professions in order (the first is the headline), then the Tiles picker. */
function PE2ProfEd() {
  const P = usePE2Profs();
  return (
    <div className="pp-profed">
      {P.mine.length > 0 && (
        <div className="pp-rank" role="list">
          {P.mine.map((r, i) => (
            <div key={r.id} role="listitem" className={"pp-rank-r" + (i === 0 ? " first" : "")}>
              <span className="pp-rank-n">{i === 0 ? <Star size={12} fill="currentColor" strokeWidth={0} /> : i + 1}</span>
              <span className="pp-rank-nm">{r.name}</span>
              <span className="pp-rank-c">{P.catOf(r)}</span>
              <button type="button" className="rm" aria-label={`Remove ${r.name}`} onClick={() => P.remove(r)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
      )}
      <PE2Picker P={P} />
    </div>
  );
}

/* The Light sheet: one title, the editor, one Done (everything saves as you go). */
function PE2Sheet({ open, title, wide, onClose, children }) {
  useEffect(() => {
    if (!open) return;
    const f = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [open]);
  if (!open) return null;
  /* On the site root, so the header and the edit bar sit under it. */
  return ReactDOM.createPortal(
    <div className="pe1-scrim" onClick={onClose}>
      <style>{PE2_CSS}</style>
      <div className={"pe1-sheet" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="pe1-grab" aria-hidden="true" />
        <h2 className="pe1-h">{title}</h2>
        <div className="pe1-body">{children}</div>
        <div className="pe1-foot"><button type="button" className="pp-done" onClick={onClose}><Check size={16} strokeWidth={2.6} /> Done</button></div>
      </div>
    </div>,
    document.querySelector(".ff") || document.body
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

function PE2AddProf({ onClick }) {
  return <button type="button" className="pe2-add-prof" aria-label="Add a profession" onClick={onClick}><span className="pe2-add-ic" aria-hidden="true"><Plus size={26} strokeWidth={2.2} /></span></button>;
}

/* Professions and Attributes on the edit page, laid out as the finished profile, empty ones as placeholder cards. */
function PE2Overview({ records }) {
  const [sheet, setSheet] = useState(null);
  const [attrOpen, setAttrOpen] = useState(null);
  const [qualOpen, setQualOpen] = useState(null);
  const [openVen, setOpenVen] = useState(null);
  const [openProf, setOpenProf] = useState(null);
  const profs = rankedRecords(records.professions || []).filter(r => !r.hidden && !r.proposed);
  const cats = PE2_ATTRS.filter(k => BASE_CATEGORIES[k]);
  /* v1.29 Experience (was Venues): venue records and the older Experience records together. */
  const venAll = [...(records.venues || []), ...(records.experience || [])];
  return (
    <>
      <style>{PE2_CSS}</style>
      <section className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-profs-h">
        <div className="ff-pp-head"><h2 id="pe2-profs-h" className="ff-about-h">Professions</h2></div>
        {profs.length
          ? <ProfTiles21 items={profs} def={BASE_CATEGORIES.professions} onOpen={(r) => setOpenProf(r)} extra={(r) => <PE2Level r={r} />}
              tail={<div role="listitem" className="ff-pt21-slot"><PE2AddProf onClick={() => setSheet("profs")} /></div>} />
          : <div className="ff-pt21-row" role="list" aria-label="Professions"><div role="listitem" className="ff-pt21-slot"><PE2AddProf onClick={() => setSheet("profs")} /></div></div>}
      </section>
      <section className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-attr-h">
        <div className="ff-pp-head"><h2 id="pe2-attr-h" className="ff-about-h">Attributes</h2></div>
        <div className="ff-mrow ff-acar pe2-rail" role="list" aria-label="Attributes">
          {cats.map((k, ci) => {
            if (k === "qualifications") return <PE2QualCard key={k} records={records.qualifications} openId={qualOpen} onOpen={(id) => { setQualOpen(id); if (id) setAttrOpen(null); }} />;
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
      <PE2Sheet open={!!sheet && !openVen && !openProf} title={PE2_TITLES[sheet] || ""} wide={sheet === "profs"} onClose={() => setSheet(null)}>
        {sheet === "profs" && <PE2ProfEd />}
      </PE2Sheet>
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
