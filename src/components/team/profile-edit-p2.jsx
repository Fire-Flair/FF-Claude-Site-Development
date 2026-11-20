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
function PE2TopSlots({ profs, catKey = "professions", noun = "professions" }) {
  const { dispatch } = useStore();
  const ids = profs.map(r => r.id);
  const nameOf = (id) => (profs.find(r => r.id === id) || {}).name || "";
  const [slots, setSlots] = useState(() => [0, 1, 2].map(i => ids[i] || null));
  const cleared = useRef(new Set());
  /* Keep the slots in step with the list (a profession added, removed or renamed elsewhere). */
  useEffect(() => {
    setSlots(cur => {
      const kept = cur.map(id => (id && ids.includes(id)) ? id : null);
      const used = new Set(kept.filter(Boolean));
      const free = ids.filter(id => !used.has(id));
      /* An empty slot the member emptied stays empty until they fill it; any other empty slot takes the next profession. */
      return kept.map((id, i) => id || (cleared.current.has(i) ? null : (free.shift() || null)));
    });
  }, [ids.join("|")]);
  const save = (next) => {
    const top = next.filter(Boolean);
    top.forEach((id, i) => dispatch({ type: "REC_MOVE", category: catKey, id, to: i }));
  };
  const empty = (i) => {
    const id = slots[i]; if (!id) return;
    const next = slots.map((x, k) => k === i ? null : x);
    cleared.current.add(i);
    setSlots(next);
    dispatch({ type: "REC_MOVE", category: catKey, id, to: ids.length - 1 });
    save(next);
  };
  const fill = (id) => {
    const at = slots.indexOf(null); if (at < 0) return;
    const next = slots.map((x, k) => k === at ? id : x);
    cleared.current.delete(at);
    setSlots(next); save(next);
  };
  const rest = ids.filter(id => !slots.includes(id));
  const open = slots.includes(null) && rest.length > 0;
  return (
    <div className="pe2-top3" role="group" aria-label={`Your top three ${noun}`}>
      <div className="pe2-top3-slots">
        {slots.map((id, i) => (
          <button key={i} type="button" className={"pe2-top3-slot" + (id ? " on" : "")} onClick={() => empty(i)} disabled={!id}
            aria-label={id ? `Number ${i + 1}: ${nameOf(id)}. Remove from your top three` : `Number ${i + 1}: empty`}>
            <span className="t">{id ? nameOf(id) : ""}</span>
          </button>
        ))}
      </div>
      {open && (
        <div className="pe2-top3-pick" role="group" aria-label={`Choose one of your ${noun} for your top three`}>
          {rest.map(id => <button key={id} type="button" className="pe2-top3-chip" onClick={() => fill(id)}>{nameOf(id)}</button>)}
        </div>
      )}
    </div>
  );
}


/* Bar keeps its entry-to-top order, Barback first, Mixologist last; every other category is alphabetical. */
const PE2_LADDER = ["Barback", "Bartender", "Cocktail Bartender", "Flair Bartender", "Mixologist"];
const PE2_CATS = PROFESSION_CATEGORIES.map(c => ({
  key: c.key,
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

/* Shrink, never split: the longest word decides the size. */
const pe2Fit = (t) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return L >= 13 ? "14.5px" : L >= 11 ? "15.5px" : "17px"; };

/* The category's mark: GroupIcon's (Bar a cocktail glass, Alex 18 Nov 22:16), Other a spark (GroupIcon gives Other the Front of House people icon). */
const pe2CatIcon = (k, size) => k === "Other" ? <Sparkles size={size} strokeWidth={1.6} /> : <GroupIcon group={k} size={size} color="currentColor" />;

/* FireFlair asks which category a typed profession belongs to when it can't place it (Other included). */
function PE2Which({ P }) {
  const r = P.mine.find(x => !professionCategory(x.name, x.displayCategory));
  if (!r) return null;
  return (
    <div className="pp-which">
      <div className="pp-which-q"><Coin size={20} tier="gold" /><span>Which category is {"“"}{r.name}{"”"}?</span></div>
      <div className="pp-which-row">
        {PE2_CAT_KEYS.map(k => (
          <button key={k} type="button" className="pp-cat-b" onClick={() => P.dispatch({ type: "REC_PATCH", category: "professions", id: r.id, patch: { displayCategory: k } })}>{k === "Other" ? "Specialist" : k}</button>
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
  const [openCat, setOpenCat] = useState(null);
  const cats5 = [...PE2_CATS.filter(c => c.key !== "Other"), { key: "Other", list: [] }].sort((a, b) => CATEGORY_ORDER.indexOf(a.key) - CATEGORY_ORDER.indexOf(b.key));
  const openIdx = cats5.findIndex(c => c.key === openCat);
  return (
    <div className="pe2-pc">
      <form className={"ff-type21 pe2-pc-type" + (q.trim() ? " has" : "")} onSubmit={add}>
        <input type="text" value={q} maxLength={PROF_MAX_LEN} autoComplete="off" spellCheck={false} enterKeyHint="enter" placeholder="Type a profession" aria-label="Add a profession"
          onChange={(e) => setQ(e.target.value)} />
      </form>
      {hits.length > 0 && (
        <div className="pe2-pc-hits" role="listbox" aria-label="Matching professions">
          {hits.map(x => <button key={x.name} type="button" role="option" aria-selected="false" className="pe2-pc-hit" onClick={() => pickHit(x.name)}><span>{x.name}</span><small>{x.cat}</small></button>)}
        </div>
      )}
      <PE2Which P={P} />
      {/* prof-grid (Alex, 18 Nov 21:34, option 5): every category on screen as an icon tile (eight, four across), with how
          many of its professions are chosen.
          prof-inline (Alex, 18 Nov 21:49): no pop-up. Tapping a tile opens its professions in a panel straight under that
          tile's row, the full width of the grid (as an opened Grow with FireFlair card on Bookings); tapping the same tile
          closes it, tapping another switches. */}
      <div className="pe2-grid" role="group" aria-label="Profession categories">
        {cats5.map((c, i) => {
          const n = c.list.filter(x => P.has(x)).length + P.ownIn(c.key).length;
          const on = openCat === c.key;
          const rowEnd = Math.min(cats5.length, (Math.floor(openIdx / PE2_GRID_COLS) + 1) * PE2_GRID_COLS) - 1;
          return (
            <React.Fragment key={c.key}>
              <button type="button" className={"pe2-gt" + (n ? " has" : "") + (on ? " open" : "")} aria-expanded={on} aria-controls={on ? "pe2-cat-panel" : undefined}
                  onClick={() => setOpenCat(on ? null : c.key)} aria-label={`${groupLabel17(c.key)}${n ? `, ${n} chosen` : ""}`}>
                  <span className="ic" aria-hidden="true">{pe2CatIcon(c.key, 22)}</span>
                  <span className="nm" style={{ fontSize: pe2TileFs(groupLabel17(c.key)) }}>{groupLabel17(c.key)}</span>
                  {n > 0 && <span className="ct" aria-hidden="true">{n}</span>}
              </button>
              {openIdx >= 0 && i === rowEnd && <PE2CatPanel key={"p-" + openCat} P={P} c={cats5[openIdx]} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* prof-grid: a tile label never splits a word; the longest word sets a smaller size (Entertainment on a phone). */
const pe2TileFs = (t) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return L >= 13 ? "clamp(9.5px,2.6vw,13.5px)" : L >= 10 ? "clamp(10.5px,2.9vw,13.5px)" : undefined; };

/* prof-inline (Alex, 18 Nov 21:49): one category's professions in a panel under the grid row, no pop-up. The professions
   are chips that wrap across the panel (Bar keeps its order); the member's own professions in this category
   show as chosen chips; "Add your own" puts a typed profession under this category (a listed name stays that profession). */
const PE2_GRID_COLS = 4;
function PE2CatPanel({ P, c }) {
  const [q, setQ] = useState("");
  if (!c) return null;
  const mineHere = P.ownIn(c.key);
  const label = groupLabel17(c.key);
  const add = (e) => {
    e.preventDefault();
    const t = q.trim(); if (!t) return;
    const hit = pe2Listed(t);
    const nm = hit ? hit.name : pe2Title(t);
    if (!P.has(nm)) P.toggle(nm, hit ? undefined : c.key);
    setQ("");
  };
  return (
    <div id="pe2-cat-panel" className="pe2-cp" role="region" aria-label={label}>
      <div className="pe2-cp-h"><span className="ic" aria-hidden="true">{pe2CatIcon(c.key, 18)}</span><span className="t" style={{ fontSize: pe2CpFs(label) }}>{label}</span></div>
      {(c.list.length > 0 || mineHere.length > 0) && (
        <div className="pe2-cp-l" role="group" aria-label={label}>
          {c.list.map(x => <PE2Chip key={x} name={x} on={P.has(x)} onClick={() => P.toggle(x)} />)}
          {mineHere.map(r => <PE2Chip key={r.id} name={r.name} on onClick={() => P.remove(r)} />)}
        </div>
      )}
      {c.key === "Other" && <form className={"ff-type21 pe2-pc-type pe2-cp-type" + (q.trim() ? " has" : "")} onSubmit={add}>
        <input type="text" value={q} maxLength={PROF_MAX_LEN} autoComplete="off" spellCheck={false} enterKeyHint="enter" placeholder="Add your own" aria-label={`Add your own ${label} profession`}
          onChange={(e) => setQ(e.target.value)} />
      </form>}
    </div>
  );
}
/* The panel title shrinks for a long word (Entertainment) instead of splitting it. */
const pe2CpFs = (t) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return L >= 13 ? "clamp(14px,4.2vw,18px)" : undefined; };

/* prof-inline: a compact chip; chosen is burgundy with gold text and a tick, not chosen is white with a "+". */
function PE2Chip({ name, on, onClick }) {
  return (
    <button type="button" className={"pe2-chip" + (on ? " on" : "")} aria-pressed={on} onClick={onClick}>
      <span className="nm">{name}</span>
      <span className="mk" aria-hidden="true">{on ? <Check size={14} strokeWidth={2.8} /> : <Plus size={14} strokeWidth={2.4} />}</span>
    </button>
  );
}

function PE2AddProf({ on, onClick }) {
  return <button type="button" className={"pe2-add-prof" + (on ? " on" : "")} aria-label="Add a profession" aria-expanded={on} aria-controls="pe2-prof-add" onClick={onClick}><span className="pe2-add-ic" aria-hidden="true"><Plus size={26} strokeWidth={2.2} /></span></button>;
}

/* Professions and Attributes on the edit page, laid out as the finished profile, empty ones as placeholder cards. */
function PE2Overview({ records }) {
  const P = usePE2Profs();
  const [attrOpen, setAttrOpen] = useState(null);
  const [attrRec, setAttrRec] = useState(null);
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
      {/* about-first (Alex, 18 Nov 22:19): About Me sits above Professions, on the edit page and the published profile. */}
      <CreatorAboutMe top />
      <section ref={profsRef} className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-profs-h">
        <div className="ff-pp-head"><h2 id="pe2-profs-h" className="ff-about-h">Professions</h2></div>
        {profs.length > 0 && (
          <PE2TopSlots profs={profs} />
        )}
        {profs.length > 0 && (
          <ProfTiles21 items={profs} pen def={BASE_CATEGORIES.professions} onOpen={(r) => setOpenProf(r)} 
            tail={<div role="listitem" className="ff-pt21-slot"><PE2AddProf on={adding} onClick={() => setAdding(!adding)} /></div>} />
        )}
        {(adding || !profs.length) && (
          <div id="pe2-prof-add" className={"pe2-prof-add" + (profs.length ? " under" : "")} role="region" aria-label="Add a profession">
            <PE2ProfCats P={P} />
          </div>
        )}
      </section>
      <section className="ff-pp ff-pp21 pp-sec" aria-labelledby="pe2-attr-h">
        <div className="ff-pp-head"><h2 id="pe2-attr-h" className="ff-about-h">Attributes</h2></div>
        <div className="ff-mrow ff-acar pe2-rail" role="list" aria-label="Attributes">
          {cats.map((k, ci) => {
            const def = BASE_CATEGORIES[k];
            const shown = rankedRecords(records[k] || []).filter(r => !r.hidden && !r.proposed);
            const empty = !shown.length;
            const on = attrOpen === k;
            const card = (isEmpty, key) => (
              <button key={key} type="button" role="listitem" className={"ff-agrp " + (isEmpty ? "pe2-agrp-empty" : tierCls17(ci)) + (on ? " pe2-agrp-on" : "")} aria-label={`${isEmpty && !empty ? "Add another" : "Edit"} ${def.label}`} aria-expanded={on} onClick={() => { setAttrOpen(on ? null : k); setQualOpen(null); }}>
                <span className="ff-agrp-top"><span className="ff-agrp-h">{def.label}</span>{!isEmpty && <span className="ff-agrp-n">{shown.length}</span>}</span>
                {isEmpty ? <span className="pe2-empty-fill" aria-hidden="true" /> : <span className="ff-agrp-l">{shown.slice(0, 5).map(r => <span key={r.id}>{nbh21(r.name)}</span>)}</span>}
                {!isEmpty && shown.length > 5 && <span className="ff-agrp-more">{`+${shown.length - 5}`}</span>}
                {isEmpty && <span className="pe2-plus1" aria-hidden="true"><Plus size={26} strokeWidth={2.2} /></span>}
                <span className="pe2-pen1" aria-hidden="true"><Pencil size={15} strokeWidth={2.1} /></span>
              </button>
            );
            /* v1.133 (Alex 20 Nov 01:20): once there is an entry, an empty dotted plus box follows it, so there is always one to add to. */
            return empty ? card(true, k) : <React.Fragment key={k}>{card(false, k)}{card(true, k + "-add")}</React.Fragment>;
          })}
          <span className="ff-acar-end" aria-hidden="true" />
        </div>
        {attrOpen && BASE_CATEGORIES[attrOpen] && !attrRec && (
          <Sheet open center title={BASE_CATEGORIES[attrOpen].label} onClose={() => setAttrOpen(null)}>
            <div className="pe2-attr-pop">
              <style>{RANK_CSS17}</style>
              <TypeBox21 key={attrOpen} catKey={attrOpen} def={BASE_CATEGORIES[attrOpen]} rows={rankedRecords(records[attrOpen] || [])} />
              {(records[attrOpen] || []).filter(r => !r.proposed).length > 3 && <PE2TopSlots key={"s" + attrOpen} profs={rankedRecords(records[attrOpen] || []).filter(r => !r.proposed)} catKey={attrOpen} noun={BASE_CATEGORIES[attrOpen].label.toLowerCase()} />}
              <ProfTiles21 key={"t" + attrOpen} items={records[attrOpen] || []} def={BASE_CATEGORIES[attrOpen]} catKey={attrOpen} label={BASE_CATEGORIES[attrOpen].label} pen onOpen={(r) => setAttrRec(r)} />
            </div>
          </Sheet>
        )}
        {attrRec && attrOpen && <GenericAttributeCardCreator open record={attrRec} def={BASE_CATEGORIES[attrOpen]} category={attrOpen} onClose={() => setAttrRec(null)} />}
      </section>
      {SHOW_VENUES_PROFILE17 && (
        <section className="ff-pp ff-pp21 pp-sec pe2-ven" aria-labelledby="pe2-ven-h">
          <div className="ff-pp-head"><h2 id="pe2-ven-h" className="ff-about-h">Venues – where have you worked?</h2></div>
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
/* qa-cards (Alex, 18 Nov 22:21): each Question Card is answered on the card itself. Its Answer area holds the answers as
   buttons (Yes / No, or the question's own options, e.g. I drive / Public transport / Other) and a type box. No box
   below the cards and no pop-up. The 11th card is "Create your own question": the question is typed onto the card and
   answered Yes / No or typed, which replaces the separate Yes / No / Type your own question box. */
function PE2QCard({ q, value, onAnswer, label }) {
  const [txt, setTxt] = useState("");
  const answered = isAnswered(value);
  const c = answered ? QUESTION_DONE : questionGroupColor(q.group);
  const groupLabel = label || (q.mine ? "My question" : ((QUESTION_GROUPS.find(g => g.key === q.group) || {}).label || q.group));
  const opts = q.type === "text" ? ["Yes", "No"] : (q.options || ["Yes", "No"]);
  const v = String(Array.isArray(value) ? value.join(", ") : (value || ""));
  const isOpt = opts.includes(v) || (q.detail && v.startsWith(q.detail.option + " —"));
  const on = (o) => v === o || (q.detail && o === q.detail.option && v.startsWith(o + " —"));
  const send = () => {
    const t = txt.trim();
    if (!t) return;
    const pre = q.detail && (v === q.detail.option || v.startsWith(q.detail.option + " —")) ? `${q.detail.option} — ` : "";
    onAnswer(pre + t);
    setTxt("");
  };
  /* v1.126 (Alex 20 Nov 00:51): the type box shows only when "Other" (or the question's own typed option) is chosen, or the question is a typed one. */
  const needsType = q.type === "text" || on("Other") || (q.detail && on(q.detail.option));
  const ph = q.detail && on(q.detail.option) ? (q.detail.placeholder || q.detail.label) : (q.placeholder || "Type");
  return (
    <CardFrame as="div" tier="standard" theme={{ bg: c.bg, ink: c.ink, sub: c.sub, rule: c.rule, dark: true }}
      className={"ff-qcard pe2-qc" + (answered ? " ff-qdone" : "")} style={{ width: CARD_W.question, "--qc-ink": c.ink, "--qc-sub": c.sub, "--qc-rule": c.rule }}>
      <span className="pe2-qc-grp">{groupLabel}</span>
      {answered && <span className="ff-qbadge" title="Answered"><TickGlyph size={16} /></span>}
      <div className="pe2-qc-q">{q.text}</div>
      <div className="pe2-qc-ans">
        <span className="pe2-qc-k">Answer</span>
        {answered && !isOpt && <span className="pe2-qc-typed">{v}</span>}
        <div className="pe2-qc-opts" role="group" aria-label={q.text}>
          {opts.map(o => <button key={o} type="button" className={"pe2-qc-opt" + (on(o) ? " on" : "")} aria-pressed={!!on(o)} onClick={() => onAnswer(o)}>{o}</button>)}
        </div>
        {needsType && <form className="pe2-qc-type" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <input type="text" value={txt} maxLength={400} placeholder={ph} aria-label={`${q.text} — type your answer`} onChange={(e) => setTxt(e.target.value)} />
        </form>}
      </div>
      {q.mine && <PE2QDelete q={q} />}
    </CardFrame>
  );
}


function PE2QDelete({ q }) {
  const { dispatch } = useStore();
  const [sure, setSure] = useState(false);
  return (
    <button type="button" className="pe2-qc-del" onClick={() => { if (!sure) return setSure(true); dispatch({ type: "MY_QUESTION_DELETE", id: q.id }); }}>
      {sure ? "Tap again to delete" : "Delete question"}
    </button>
  );
}


/* The 11th card: Create your own question. Type the question on the card, then answer it Yes, No or by typing. */
function PE2QCreate({ onCreate }) {
  const [text, setText] = useState("");
  const [txt, setTxt] = useState("");
  const c = { bg: "linear-gradient(165deg,#4E1220,#230710)", ink: "#F6EDE4", sub: "#E2C27A", rule: "rgba(226,194,122,.32)" };
  const ok = text.trim().length > 2;
  const make = (val) => { if (!ok || !String(val || "").trim()) return; onCreate(text.trim(), String(val).trim()); setText(""); setTxt(""); };
  return (
    <CardFrame as="div" tier="standard" theme={{ bg: c.bg, ink: c.ink, sub: c.sub, rule: c.rule, dark: true }}
      className="ff-qcard pe2-qc pe2-qc-new" style={{ width: CARD_W.question, "--qc-ink": c.ink, "--qc-sub": c.sub, "--qc-rule": c.rule }}>
      <span className="pe2-qc-grp">My question</span>
      <textarea className="pe2-qc-qin" rows={3} maxLength={CUSTOM_QUESTION_MAX} value={text} placeholder="Create your own question"
        aria-label="Create your own question" onChange={(e) => setText(e.target.value)} />
      <div className="pe2-qc-ans">
        <span className="pe2-qc-k">Answer</span>
        <div className="pe2-qc-opts" role="group" aria-label="Answer your question">
          {["Yes", "No"].map(o => <button key={o} type="button" className="pe2-qc-opt" disabled={!ok} onClick={() => make(o)}>{o}</button>)}
        </div>
        <form className="pe2-qc-type" onSubmit={(e) => { e.preventDefault(); make(txt); }}>
          <input type="text" value={txt} maxLength={400} placeholder="Type" aria-label="Type your answer" onChange={(e) => setTxt(e.target.value)} />
        </form>
      </div>
    </CardFrame>
  );
}


function PE2QA() {
  const { state, dispatch } = useStore();
  const qs = allQuestions(state);
  const [side, setSide] = useState("todo");
  /* Cards answered while this tab is showing stay where they are until the tab changes, so a card never jumps away mid-answer. */
  const [stay, setStay] = useState([]);
  const canAdd = qs.filter(q => q.mine).length < CUSTOM_QUESTION_LIMIT;
  const isDone = (q) => isAnswered(answerOf(state, q));
  const todo = qs.filter(q => !isDone(q) || (side === "todo" && stay.includes(q.id)));
  const done = qs.filter(q => isDone(q) && !(side === "todo" && stay.includes(q.id)));
  const nTodo = qs.filter(q => !isDone(q)).length, nDone = qs.length - nTodo;
  const list = qs;
  const present = QUESTION_GROUPS.filter(g => qs.some(q => q.group === g.key));
  const pick = (t) => { setSide(t); setStay([]); };
  const answer = (q, v) => {
    dispatch({ type: "ANSWER", qid: q.id, value: v });
    setStay(s => s.includes(q.id) ? s : [...s, q.id]);
  };
  const create = (text, value) => {
    const id = `my_${Date.now().toString(36)}`;
    dispatch({ type: "MY_QUESTION_ADD", question: { id, text, type: "yesno" }, value, visibility: "private" });
    setStay(s => [...s, id]);
  };
  return (
    <section className="ff-pp ff-pp21 pe2-qa" id="pe2-qa" aria-labelledby="pe2-qa-h">
      <style>{PE2_CSS}</style>
      <div className="ff-pp-head"><h2 id="pe2-qa-h" className="ff-about-h">Q&amp;A</h2></div>
      <div className="ff-qa-panel pe2-qa-panel">
        <HScroll label="Questions" snap>
          {list.map(q => (
            <span key={q.id} data-qid={q.id} className="pe2-qa-cardw">
              <PE2QCard q={q} value={answerOf(state, q)} onAnswer={(v) => answer(q, v)} />
            </span>
          ))}
          {canAdd && <span className="pe2-qa-cardw"><PE2QCreate onCreate={create} /></span>}
        </HScroll>
      </div>
    </section>
  );
}
