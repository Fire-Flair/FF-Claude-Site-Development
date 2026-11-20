/* src/components/team/attribute-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Quick-pick: five suggested professions per display category (v1.6 §2).
   Anything else can be typed — "Add another profession". */
/* Phase 1: search as you type (as Griffy's ProfessionPickerPanel does against
   GET /user/professions?search=), across the 35 v1.6 professions, plus
   "Add" for anything else — FireFlair then asks for its category if the rules
   can't tell. Without a search it shows the category chips as before. */
const ALL_PROFESSIONS = PROFESSION_CATEGORIES.flatMap(c => c.suggested.map(n => ({ name: n, cat: c.key })));


const RANK_CSS17 = __ff_css("styles/rank17.css");





/* ==========================================================================
   PROFILE CARD SYSTEM — the sheet that opens an attribute card.
   GenericAttributeCardCreator   opens a card to read it, or to update it:
                                 title, description, images, document
   ========================================================================== */
const mapsUrl = (r) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([r.name, r.address].filter(Boolean).join(", "))}`;



/* v17.15: a venue card is small and plain: the name, the kind of place and area, and the Google Maps link.
   It is the same size as the dotted outline in the Primary, Secondary and Extra boxes (VEN_W17 x VEN_H17),
   in one neutral, faded blue. onRemove adds the X while the profile is being edited; noLink is for cards
   that already sit inside a Google Maps link. */
function VenueLandscapeCard({ record, onClick, onRemove, noLink }) {
  const words = String(record.name || "").split(/\s+/);
  const lw = Math.max(...words.map(w => w.length), 1);
  const n = String(record.name || "").length;
  const fs = Math.min(lw <= 9 ? 14 : lw <= 12 ? 12.5 : lw <= 15 ? 11 : 9.5, n <= 14 ? 14 : n <= 20 ? 12.5 : n <= 28 ? 11 : 10);
  const meta = record.place ? [n > 10 ? null : venTypeLabel17(record.place), record.area && record.area.name].filter(Boolean).join(" · ") : "";
  const Tag = onClick ? "button" : "div";
  return (
    <Tag type={onClick ? "button" : undefined} className="ff-venmini17" onClick={onClick}>
      <span className="nm" style={{ fontSize: fs }}>{record.name}</span>
      {meta && <span className="meta">{meta}</span>}
      {record.place && (noLink
        ? <span className="map">{"View on Google Maps\u00a0→"}</span>
        : <a className="map" href={venueMapsUrl17(record)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{"View on Google Maps\u00a0→"}</a>)}
      {onRemove && <button type="button" className="x" aria-label={`Remove ${record.name}`} onClick={(e) => { e.stopPropagation(); onRemove(); }}><X size={12} strokeWidth={2.4} /></button>}
    </Tag>
  );
}














/* v17.21: builder sections with no drop-down (type boxes, the professions picker, the venue search). */
const OPEN_CATS21 = ["professions", "qualifications", "skills", "interests", "languages", "experience", "venues"];


function PhotoBoxes19({ media, onRemove, onAdd, max, busy }) {
  const ref = useRef(null);
  const list = (media || []).filter(m => m && (m.dataUrl || m.src));
  if (!onAdd && !list.length) return null;
  return (
    <div className="ff-rl19-photos">
      {list.map((m, i) => (
        <span key={m.id || i} className="ff-rl19-ph" style={{ backgroundImage: `url("${m.dataUrl || m.src}")` }} role="img" aria-label={m.name || `Picture ${i + 1}`}>
          {onRemove && <button type="button" className="x" aria-label={`Remove picture ${i + 1}`} onClick={() => onRemove(m)}><X size={12} strokeWidth={2.4} /></button>}
        </span>
      ))}
      {onAdd && list.length < max && (
        <>
          <input ref={ref} type="file" accept="image/*" className="ff-sr" tabIndex={-1} aria-label="Add a picture" onChange={(e) => { onAdd(e.target.files && e.target.files[0]); e.target.value = ""; }} />
          <button type="button" className="ff-rl19-ph add" aria-label="Add a picture" disabled={!!busy} onClick={() => ref.current && ref.current.click()}>{busy ? <Loader2 size={18} className="ff-spin" /> : <Plus size={20} strokeWidth={1.8} />}</button>
        </>
      )}
    </div>
  );
}


function RankDetail19({ r, catKey }) {
  const meta = detailsLine(r.details, catKey === "languages" ? r.proficiency : "", r.name);
  const text = String(r.description || "").trim();
  const media = (r.media || []).filter(m => m && (m.dataUrl || m.src));
  const doc = r.document && r.document.name ? r.document.name : "";
  if (!meta && !text && !media.length && !doc) return null;
  return (
    <div className="ff-rl19-det">
      {meta && <p className="meta">{meta}</p>}
      {text && <p>{text}</p>}
      {doc && !r.cv && <p className="meta">{doc}</p>}
      <PhotoBoxes19 media={media} />
    </div>
  );
}


/* Read-only list: numbers, names, details and picture boxes. No buttons, no handles. */
function RankListView17({ catKey, items, extra }) {
  const rows = rankedRecords(items || []).filter(r => !r.hidden && !r.proposed);
  if (!rows.length) return null;
  return (
    <div className="ff-rl19 view" role="list">
      <style>{RANK_CSS17}</style>
      {rows.map((r, i) => (
        <div key={r.id} className="ff-rl19-item" role="listitem">
          <div className="ff-rl19-row">
            <span className="ff-rl19-disc" aria-hidden="true">{i + 1}</span>
            <span className="nm">{r.name}{r.cv ? " (CV)" : ""}</span>
          </div>
          {extra ? extra(r) : null}
          <RankDetail19 r={r} catKey={catKey} />
        </div>
      ))}
    </div>
  );
}


const CornerDownLeft21 = lucideIcon("CornerDownLeft");


/* While an entry is dragged with a mouse, no text on the page gets selected. */
const noSel21 = (on) => { try { document.body.style.userSelect = on ? "none" : ""; document.body.style.webkitUserSelect = on ? "none" : ""; } catch (e) { /* no document */ } };


/* v17.21: the one editor for an entry (Professions, Qualifications, Skills, Interests, Languages). It opens under the entry
   when the entry is tapped: the detail text, the pictures, then one row — remove (trash), hide, and Done. */
function EntryEditor21({ r, catKey, def, onDone }) {
  /* prof-edits (Alex, 18 Nov 20:58): a profession with no text of its own opens with its default description (its own, or its category's, e.g. Front of House) ready to edit; clearing the box on purpose keeps it empty. */
  const [edTouched, setEdTouched] = useState(false);
  const { dispatch } = useStore();
  const [busy, setBusy] = useState(null);
  const [sure, setSure] = useState(false);
  const maxMedia = def.maxMedia || MAX_MEDIA_PER_CARD;
  const patch = (p) => dispatch({ type: "REC_PATCH", category: catKey, id: r.id, patch: p });
  const addPhoto = async (f) => {
    if (!f) return;
    if (!/^image\//.test(f.type || "")) { setBusy("Only pictures can be added here."); return; }
    if (f.size > MAX_MEDIA_BYTES) { setBusy(`That image is ${prettyBytes(f.size)} — keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.`); return; }
    setBusy("loading");
    try {
      const dataUrl = await shrinkPhoto(f, 1000);
      patch({ media: [...(r.media || []), { id: uid("med"), name: f.name, dataUrl }] });
      setBusy(null);
    } catch (e) { setBusy(e.message); }
  };
  const meta = detailsLine(r.details, "", r.name);
  return (
    <div className="ff-ed21" role="group" aria-label={`Details for ${r.name}`}>
      {r.proposed && (
        <div className="ff-ed21-acc">
          <button type="button" className="ff-btn sm primary" onClick={() => dispatch({ type: "REC_ACCEPT", category: catKey, id: r.id })}><Check size={13} /> Accept</button>
          <button type="button" className="ff-btn sm ghost" onClick={() => { dispatch({ type: "REC_DELETE", category: catKey, id: r.id }); onDone(); }}>Reject</button>
        </div>
      )}
      {meta && <p className="meta">{meta}</p>}
      <textarea className="ff-ed21-ta" rows={Math.max(2, Math.min(6, Math.ceil(String(r.description || "").length / 34)))} value={r.description || (catKey === "professions" && !edTouched ? professionDefaultDesc(r.name, r.displayCategory) : "")} aria-label={`Details for ${r.name}`} placeholder="Details"
        autoFocus={FF_FINE_POINTER} onChange={(e) => { setEdTouched(true); patch({ description: e.target.value }); }} />
      <PhotoBoxes19 media={r.media} max={maxMedia} busy={busy === "loading"} onAdd={addPhoto}
        onRemove={(m) => patch({ media: (r.media || []).filter(x => x.id !== m.id) })} />
      {catHas(def, "document") && <EntryDocBox r={r} patch={patch} />}
      {busy && busy !== "loading" && <p className="ff-wlbox-err" role="alert">{busy}</p>}
      {catKey === "professions" && (<>
        <div className="ff-levels-wrap"><ProfessionLevelPicker value={r.level || null} onChange={(n) => patch({ level: n })} /></div>
      </>)}
      {catKey === "languages" && (
        <select className="ff-input ff-ed21-sel" aria-label="Level" value={r.proficiency || ""} onChange={(e) => patch({ proficiency: e.target.value })}>
          <option value="">Level</option>
          {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      )}
      <div className="ff-ed21-foot">
        <button type="button" className={"ff-ed21-ic del" + (sure ? " sure" : "")} aria-label={sure ? `Yes, remove ${r.name}` : `Remove ${r.name}`} title="Remove"
          onBlur={() => setSure(false)}
          onClick={() => { if (!sure) { setSure(true); return; } dispatch({ type: "REC_DELETE", category: catKey, id: r.id }); dispatch({ type: "TOAST", toast: `${r.name} removed` }); onDone(); }}>
          <Trash2 size={17} strokeWidth={1.8} aria-hidden="true" />{sure && <span>Remove</span>}
        </button>
        <button type="button" className="ff-ed21-ic" aria-pressed={!!r.hidden} aria-label={r.hidden ? `Show ${r.name} on your profile` : `Hide ${r.name} from your profile`} title={r.hidden ? "Show" : "Hide"}
          onClick={() => { patch({ hidden: !r.hidden }); dispatch({ type: "TOAST", toast: r.hidden ? `${r.name} shown again` : `${r.name} hidden — still on your profile` }); }}>
          {r.hidden ? <Eye size={17} strokeWidth={1.8} aria-hidden="true" /> : <EyeOff size={17} strokeWidth={1.8} aria-hidden="true" />}
        </button>
        <button type="button" className="ff-ed21-done" onClick={onDone}><Check size={15} strokeWidth={2.4} /> Done</button>
      </div>
    </div>
  );
}


/* v17.21: the white type box at the top of a list. Type, press Enter (or the return key in the box), and the entry is added. */
function TypeBox21({ catKey, def, rows, placeholder, onAdded }) {
  const { state, dispatch } = useStore();
  const [typed, setTyped] = useState("");
  const one = def.singular.toLowerCase();
  const an = /^[aeiou]/i.test(one) ? "an" : "a";
  const add = (e) => {
    e && e.preventDefault();
    const nm = typed.trim();
    if (!nm) return;
    if (rows.some(r => String(r.name).toLowerCase() === nm.toLowerCase())) { dispatch({ type: "TOAST", toast: `${nm} is already on your profile` }); return; }
    const taskId = xpTaskFor(catKey);
    const fresh = XP_TASKS.some(t => t.id === taskId) && !(state.profile.xpClaimed || []).includes(taskId);
    const rec = makeRecord(catKey, nm);
    dispatch({ type: "REC_ADD", category: catKey, record: rec });
    dispatch({ type: "TOAST", toast: `${def.singular} added${fresh ? xpNote(XP_VALUES.task) : ""}` });
    setTyped("");
    if (onAdded) onAdded(rec);
  };
  return (
    <form className={"ff-type21" + (typed.trim() ? " has" : "")} onSubmit={add}>
      <input type="text" name={`add-${catKey}`} value={typed} autoComplete="off" spellCheck={false} enterKeyHint="enter"
        placeholder={placeholder || `Type ${an} ${one}`} aria-label={`Add ${an} ${one}`} onChange={(e) => setTyped(e.target.value)} />
    </form>
  );
}


/* Editable list (Qualifications, Skills, Interests, Languages): the type box, then the numbered entries. Tap an entry to
   open its editor under it; the three-line handle on the right drags it into place. */
function RankList17({ catKey, def, items }) {
  const { dispatch } = useStore();
  const rows = rankedRecords(items || []);
  const ids = rows.map(r => r.id);
  const [openId, setOpenId] = useState(null);
  const [drag, setDrag] = useState(null);
  const rects = useRef([]);

  const down = (e, id) => {
    if (e.button !== undefined && e.button !== 0) return;
    const wrap = e.currentTarget.closest("[data-rl-list]");
    if (!wrap) return;
    rects.current = [...wrap.querySelectorAll("[data-rl-id]")].map(el => { const b = el.getBoundingClientRect(); return { id: el.getAttribute("data-rl-id"), mid: b.top + b.height / 2 }; });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { /* older browsers */ }
    e.preventDefault();
    const from = ids.indexOf(id);
    noSel21(true);
    setDrag({ id, y0: e.clientY, dy: 0, from, over: from });
  };
  const move = (e) => setDrag(d => d && ({ ...d, dy: e.clientY - d.y0, over: rects.current.filter(r => r.id !== d.id && e.clientY > r.mid).length }));
  const up = () => {
    const d = drag;
    noSel21(false);
    setDrag(null);
    if (d && d.over !== d.from) dispatch({ type: "REC_MOVE", category: catKey, id: d.id, to: d.over });
  };
  const key = (e, id, i) => {
    if (e.key === "ArrowUp" && i > 0) { e.preventDefault(); dispatch({ type: "REC_MOVE", category: catKey, id, to: i - 1 }); }
    else if (e.key === "ArrowDown" && i < rows.length - 1) { e.preventDefault(); dispatch({ type: "REC_MOVE", category: catKey, id, to: i + 1 }); }
  };
  const others = drag ? ids.filter(x => x !== drag.id) : [];
  const dropBefore = drag && drag.over !== drag.from && drag.over < others.length ? others[drag.over] : null;
  const dropAfter = drag && drag.over !== drag.from && drag.over >= others.length ? others[others.length - 1] : null;

  return (
    <div className="ff-rl21" data-rl-list={catKey}>
      <style>{RANK_CSS17}</style>
      <TypeBox21 catKey={catKey} def={def} rows={rows} />
      {rows.length > 0 && (
        <div className={"ff-rl19 ff-rl21-list" + (drag ? " dragging" : "")}>
          {rows.map((r, i) => {
            const open = openId === r.id;
            const lifted = drag && drag.id === r.id;
            return (
              <div key={r.id} data-rl-id={r.id} className={"ff-rl19-item" + (open ? " open" : "") + (lifted ? " lifted" : "") + (dropBefore === r.id ? " before" : "") + (dropAfter === r.id ? " after" : "") + (r.hidden ? " hid" : "")}
                style={lifted ? { transform: `translateY(${drag.dy}px)` } : undefined}>
                <div className="ff-rl19-row">
                  <span className="ff-rl19-disc" aria-hidden="true">{i + 1}</span>
                  <button type="button" className="ff-rl21-nm" aria-expanded={open} onClick={() => setOpenId(open ? null : r.id)}>
                    <span className="nm">{r.name}{r.cv ? " (CV)" : ""}{r.hidden ? <span className="hd"><EyeOff size={11} /> Hidden</span> : null}{r.proposed ? <span className="hd">Proposed</span> : null}</span>
                    {!open && <Pencil size={13} strokeWidth={2} className="pen" aria-hidden="true" />}
                  </button>
                  <span className="ff-rl19-grip" role="button" tabIndex={0} aria-label={`Move ${r.name}. Drag, or use the up and down arrow keys`}
                    onPointerDown={(e) => down(e, r.id)} onPointerMove={(e) => drag && move(e)} onPointerUp={up} onPointerCancel={() => { noSel21(false); setDrag(null); }} onKeyDown={(e) => key(e, r.id, i)}>
                    <i /><i /><i />
                  </span>
                </div>
                {open
                  ? <div className="ff-rl21-panel"><EntryEditor21 r={r} catKey={catKey} def={def} onDone={() => setOpenId(null)} /></div>
                  : <RankDetail19 r={r} catKey={catKey} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}



/* ==========================================================================
   v17.21 — PROFESSION TILES (the v17.15 look): one tile per profession in a row that scrolls across only.
   The first is gold, the second silver, the rest bronze. On the displayed profile a tap opens the profession.
   In the builder a tap opens its editor under the row, and the three-line handle drags a tile left or right.
   ========================================================================== */
/* As many whole sentences as fit in max characters (at least the first). Never a cut word and never "…". */
function wholeSentences21(text, max) {
  const t = String(text || "").trim();
  if (t.length <= max) return t;
  const parts = t.match(/[^.!?]+[.!?]+(\s|$)/g) || [t];
  let out = "";
  for (const p of parts) { if ((out + p).trim().length > max && out) break; out += p; }
  return out.trim();
}


/* Hyphenated words stay whole on one line (non-breaking hyphen). */
const nbh21 = (t) => String(t || "").replace(/(\w)-(?=\w)/g, "$1\u2011");


function ProfTile21({ r, i, editable, open, lifted, dx, onTap, grip, extra, catKey = "professions", compact, pen, star }) {
  const own = String(r.description || "").trim();
  /* Professions show their default description when the member wrote none; other categories have none. */
  const dflt = !own && catKey === "professions" ? professionDefaultDesc(r.name, r.displayCategory) : "";
  const desc = wholeSentences21(own || dflt, compact ? 110 : 150);
  const media = (r.media || []).filter(m => m && (m.dataUrl || m.src)).slice(0, 3);
  const lvl = r.level ? PROFESSION_LEVELS.find(l => l.n === r.level) : null;
  if (compact) {
    /* v17.40 (proposal A): the compact dark box in the builder. Name, its text, then small marks. */
    const meta = catKey === "languages" ? (r.proficiency || "") : "";
    const ai = !!(r.source && r.source.origin && r.source.origin !== "manual");   /* added by FF AI (CV or FireFlair), not typed */
    const doc = !!(r.document && r.document.name);
    const nPh = (r.media || []).filter(m => m && (m.dataUrl || m.src)).length;
    return (
      <div className={"ff-pt21-it" + (lifted ? " lifted" : "")} data-pt-id={r.id} style={lifted ? { transform: `translateX(${dx}px)` } : undefined}>
        <button type="button" className={"ff-pa40-tile" + (i === 0 ? " first" : "") + (open ? " open" : "") + (r.hidden ? " hid" : "")}
          aria-expanded={open} aria-label={`${r.name}. Edit`} onClick={onTap}>
          <span className="h">{i === 0 && <Star size={13} strokeWidth={2.2} className="st" aria-hidden="true" />}{nbh21(r.name)}{r.cv ? " (CV)" : ""}</span>
          {meta && <span className="m">{meta}</span>}
          {desc && <span className={"d" + (dflt && !own ? " dflt" : "")}>{nbh21(desc)}</span>}
          {(dflt || ai || doc || nPh > 0 || r.hidden || r.proposed || lvl) && (
            <span className="mk">
              {r.proposed && <span>Proposed</span>}
              {r.hidden && <span><EyeOff size={10} aria-hidden="true" /> Hidden</span>}
              {dflt && !own && <span>Default</span>}
              {ai && <span className="ai"><Sparkles size={10} aria-hidden="true" /> FF AI</span>}
              {lvl && <span>{lvl.title}</span>}
              {doc && <span aria-label="Document"><FileText size={10} aria-hidden="true" /></span>}
              {nPh > 0 && <span aria-label={`${nPh} pictures`}><Camera size={10} aria-hidden="true" /> {nPh}</span>}
            </span>
          )}
        </button>
        {grip}
      </div>
    );
  }
  return (
    <div className={"ff-pt21-it" + (lifted ? " lifted" : "")} data-pt-id={r.id} style={lifted ? { transform: `translateX(${dx}px)` } : undefined}>
      <button type="button" className={"ff-agrp prof ff-pt21 cat-" + catKey + " " + tierCls17(i) + (open ? " open" : "") + (r.hidden ? " hid" : "")}
        aria-expanded={editable ? open : undefined} aria-label={editable ? `${r.name}. Edit` : `${r.name}. Open details`} onClick={onTap}>
        <span className="ff-agrp-top"><span className="ff-agrp-h">{nbh21(r.name)}</span></span>
        {pen && <span className="pe2-pen1 pe2-pen-t" aria-hidden="true"><Pencil size={15} strokeWidth={2.1} /></span>}
        {r.hidden && <span className="ff-pt21-hd"><EyeOff size={11} /> Hidden</span>}
        {extra}
        {desc && <span className="ff-agrp-d">{nbh21(desc)}</span>}
        {(media.length > 0 || lvl) && (
          <span className="ff-pt21-foot">
            {media.length > 0 && <span className="ff-pt21-ph" aria-hidden="true">{media.map((m, k) => <span key={m.id || k} style={{ backgroundImage: `url("${m.dataUrl || m.src}")` }} />)}</span>}
            {lvl && <span className="ff-pt21-lv">{lvl.title}</span>}
          </span>
        )}
      </button>
      {star && <button type="button" className={"pe2-star-t" + (star.on ? " on" : "")} aria-pressed={star.on} aria-label={`${star.on ? "Remove from" : "Put on"} your profile card: ${r.name}`} onClick={star.toggle}><Star size={16} strokeWidth={2} fill={star.on ? "currentColor" : "none"} aria-hidden="true" /></button>}
      {grip}
    </div>
  );
}


/* pb-professions (Alex 19:19): reorder lets the read-only tiles (builder Professions, which open their own editor) be
   dragged into order; top marks the first N as the "top three" that go onto the Profile Card (.ff-top3 + .ff-top3-n). */
function ProfTiles21({ items, editable, def, onOpen, extra, tail, label = "Professions", catKey = "professions", compact, reorder, top = 0, pen, stars = 0 }) {
  const { dispatch } = useStore();
  const rows = editable ? rankedRecords(items || []) : rankedRecords(items || []).filter(r => !r.hidden && !r.proposed);
  const ids = rows.map(r => r.id);
  const [openId, setOpenId] = useState(null);
  const [drag, setDrag] = useState(null);
  const rects = useRef([]);
  const rowRef = useRef(null);
  useDragScroll(rowRef);
  const down = (e, id) => {
    if (e.button !== undefined && e.button !== 0) return;
    const row = rowRef.current; if (!row) return;
    rects.current = [...row.querySelectorAll("[data-pt-id]")].map(el => { const b = el.getBoundingClientRect(); return { id: el.getAttribute("data-pt-id"), mid: b.left + b.width / 2 }; });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) { /* older browsers */ }
    e.preventDefault(); e.stopPropagation();
    const from = ids.indexOf(id);
    noSel21(true);
    setDrag({ id, x0: e.clientX, s0: row.scrollLeft, dx: 0, from, over: from });
  };
  const move = (e) => {
    const row = rowRef.current;
    if (row) { const b = row.getBoundingClientRect(); if (e.clientX > b.right - 36) row.scrollLeft += 10; else if (e.clientX < b.left + 36) row.scrollLeft -= 10; }
    setDrag(d => {
      if (!d) return d;
      const ds = row ? row.scrollLeft - d.s0 : 0;
      const x = e.clientX + ds;
      return { ...d, dx: e.clientX - d.x0 + ds, over: rects.current.filter(r => r.id !== d.id && x > r.mid).length };
    });
  };
  const up = () => { const d = drag; noSel21(false); setDrag(null); if (d && d.over !== d.from) dispatch({ type: "REC_MOVE", category: catKey, id: d.id, to: d.over }); };
  const key = (e, id, i) => {
    if (e.key === "ArrowLeft" && i > 0) { e.preventDefault(); dispatch({ type: "REC_MOVE", category: catKey, id, to: i - 1 }); }
    else if (e.key === "ArrowRight" && i < rows.length - 1) { e.preventDefault(); dispatch({ type: "REC_MOVE", category: catKey, id, to: i + 1 }); }
  };
  /* v1.139 (Alex 20 Nov 02:31): a star puts an entry on the profile card. The first `stars` entries are starred to begin with; a starred entry sits above the unstarred ones. */
  const starOn = (r, i) => r.star !== undefined ? !!r.star : i < stars;
  const toggleStar = (r, i) => {
    const cur = rows.map((x, k) => starOn(x, k));
    rows.forEach((x, k) => dispatch({ type: "REC_PATCH", category: catKey, id: x.id, patch: { star: cur[k] } }));
    dispatch({ type: "REC_PATCH", category: catKey, id: r.id, patch: { star: !cur[i] } });
    const at = rows.filter((x, k) => x.id !== r.id && cur[k]).length;
    dispatch({ type: "REC_MOVE", category: catKey, id: r.id, to: at });
  };
  const others = drag ? ids.filter(x => x !== drag.id) : [];
  const mark = drag && drag.over !== drag.from ? (drag.over < others.length ? { id: others[drag.over], side: "l" } : { id: others[others.length - 1], side: "r" }) : null;
  const openRec = editable ? rows.find(r => r.id === openId) : null;
  if (!rows.length) return null;
  return (<>
    <div ref={rowRef} className={"ff-pt21-row" + (compact ? " ff-pa40-row" : "") + (drag ? " dragging" : "")} role="list" aria-label={`${label}, ${rows.length}`}>
      {rows.map((r, i) => (
        <div role="listitem" key={r.id} className={"ff-pt21-slot" + (i < top ? " ff-top3" : "") + (mark && mark.id === r.id ? " mk-" + mark.side : "")}>
          {i < top && <span className="ff-top3-n" aria-label={`Top ${top}, number ${i + 1}`}>{i + 1}</span>}
          <ProfTile21 r={r} i={i} editable={editable} catKey={catKey} compact={compact} pen={pen} star={stars ? { on: starOn(r, i), toggle: () => toggleStar(r, i) } : null} open={openId === r.id} lifted={drag && drag.id === r.id} dx={drag ? drag.dx : 0}
            extra={extra ? extra(r) : null}
            onTap={() => editable ? setOpenId(openId === r.id ? null : r.id) : onOpen && onOpen(r)}
            grip={editable || reorder ? (
              <span className="ff-pt21-grip" role="button" tabIndex={0} aria-label={`Move ${r.name}. Drag, or use the left and right arrow keys`}
                onPointerDown={(e) => down(e, r.id)} onPointerMove={(e) => drag && move(e)} onPointerUp={up} onPointerCancel={() => { noSel21(false); setDrag(null); }} onKeyDown={(e) => key(e, r.id, i)}>
                <i /><i /><i />
              </span>) : null} />
        </div>
      ))}
      {tail}
      <span className="ff-acar-end" aria-hidden="true" />
    </div>
    {openRec && (
      <div className={"ff-pt21-ed" + (compact ? " ff-pa40-ed" : "")}>
        <div className="ff-pt21-edh">{compact ? null : <span className={"dot " + tierCls17(ids.indexOf(openRec.id))} aria-hidden="true" />}{openRec.name}</div>
        <EntryEditor21 r={openRec} catKey={catKey} def={def} onDone={() => setOpenId(null)} />
      </div>
    )}
  </>);
}



/* ==========================================================================
   v17.19 — VENUES: the venue tile (VenueCard19), still used by the Network page's Venues section (switched off).
   Profiles use the Experience cards below (v1.29).
   record.details.kind "worked" | "favourite"; a venue with no kind (every CV import) is "worked".
   ========================================================================== */
const venueKind19 = (r) => (r && r.details && r.details.kind === "favourite" ? "favourite" : "worked");


const venueIcon19 = (r) => {
  const t = (r.place && (r.place.primaryType || (r.place.types || [])[0])) || "";
  if (!r.place) return Pencil;
  if (/hotel|lodging/.test(t)) return Building2;
  if (/wine/.test(t)) return Wine;
  if (/bar|pub/.test(t)) return Martini;
  if (/restaurant|cafe|food/.test(t)) return ChefHat;
  if (/club|music/.test(t)) return Music;
  if (/event|wedding|banquet/.test(t)) return PartyPopper;
  return MapPin;
};


function VenueCard19({ record: r0, onClick }) {
  /* p2/pubprof: an older Experience record shows as a venue: the employer is the venue, the role and dates its line. */
  const xp = r0 && r0.category === "experience";
  const xd = (xp && r0.details) || {};
  const r = xp && xd.employer ? { ...r0, name: xd.employer, address: xd.location || "", description: [xd.start, xd.end].filter(Boolean).join(" to ") } : r0;
  if (xp) return (
    <div className="ff-vc19 hand" role={onClick ? "button" : "group"} tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${r.name}. Open details` : undefined} onClick={onClick} onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}>
      <span className="ic" aria-hidden="true"><Briefcase size={22} strokeWidth={1.8} /></span>
      <span className="bd">
        <span className="ty">{xd.employer ? r0.name : "Venue"}</span>
        <b>{r.name}</b>
        {r.address && <span className="ad">{r.address}</span>}
        {String(r.description || "").trim() && <span className="nt">{r.description}</span>}
      </span>
    </div>
  );
  const hand = !r.place;
  const Icon = venueIcon19(r);
  const fav = venueKind19(r) === "favourite";
  const street = String(r.address || "").split(",")[0].trim();
  const where = [street, r.area && r.area.name].filter(Boolean).join(", ") || r.address || "";
  const open = (e) => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } };
  return (
    <div className={"ff-vc19" + (fav ? " fav" : "") + (hand ? " hand" : "")} role={onClick ? "button" : "group"} tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `${r.name}. Open details` : undefined} onClick={onClick} onKeyDown={onClick ? open : undefined}>
      <span className="ic" aria-hidden="true"><Icon size={22} strokeWidth={1.8} /></span>
      <span className="bd">
        <span className="ty">{hand ? "Venue" : venTypeLabel17(r.place)}</span>
        <b>{r.name}</b>
        {where && <span className="ad">{where}</span>}
        {String(r.description || "").trim() && <span className="nt">{r.description}</span>}
        {hand
          ? <span className="by">Added by hand</span>
          : <a className="gm" href={venueMapsUrl17(r)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><MapPin size={12} strokeWidth={2.2} /> Google Maps</a>}
      </span>
    </div>
  );
}


/* ==========================================================================
   v1.29 — EXPERIENCE (was Venues; Alex 18 Nov 17:49): the venues you've worked at.
   Favourites are gone: a record with details.kind "favourite" is kept in the data but never shown or edited.
   Editing: one row per venue, each with its own Google business search (VenueSearch17); an empty row at the end
   adds the next one. Below: one Experience card per venue, the onyx landscape venue card first designed in
   v16 (VenueLandscapeCard, fireflair-v16.1.html to v17.14, src/components/team/attribute-cards.jsx at 69b680f),
   brought back at full size with squircle corners.
   An older Experience record (employer, role, dates) shows the same way: the employer is the venue.
   ========================================================================== */
const xpShown29 = (r) => !!r && venueKind19(r) !== "favourite";
const xpCSS29 = __ff_css("styles/experience29.css");


/* One record (a venue, or an older Experience entry) -> what its card shows. */
function xpView29(r) {
  if (r.category === "experience") {
    const d = r.details || {};
    const dates = [d.start, d.end].filter(Boolean).join(" to ");
    const name = d.employer || r.name;
    const where = d.location || "";
    return {
      kicker: d.employer ? "Employer" : "Venue", name, where, Icon: Briefcase,
      role: d.employer ? r.name : "", dates, note: String(r.description || "").trim(),
      foot: "", maps: d.employer ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([name, where].filter(Boolean).join(", "))}` : "",
      hand: false,
    };
  }
  const hand = !r.place;
  const street = String(r.address || "").split(",")[0].trim();
  const where = hand ? (r.address || "") : ([street, r.area && r.area.name].filter(Boolean).join(", ") || r.address || "");
  return {
    kicker: hand ? "Venue" : venTypeLabel17(r.place), name: r.name, where, Icon: venueIcon19(r),
    role: "", dates: "", note: String(r.description || "").trim(),
    foot: !hand && r.area ? r.area.name : "", maps: hand ? "" : venueMapsUrl17(r), hand,
  };
}


/* v1.35 (Alex, 18 Nov 18:49): no black — a muted card that suits the finished profile page. One line to switch:
   XP_TONE29 = "champagne" | "rose" | "sage". Colours in experience29.css (.ff-xc29.t-<tone>). */
const XP_TONE29 = "onyx";
const XP_TONES29 = {
  onyx: { bg: "linear-gradient(165deg,#2E2D31 0%,#171619 100%)", ring: "linear-gradient(160deg,#EBD58F,#C9A227 50%,#E2C46A)", dark: true },
  champagne: { bg: "linear-gradient(168deg,#F8F0DC,#E9DAB4)", ring: "linear-gradient(160deg,#EBD58F,#C9A227 50%,#E2C46A)", dark: false },
  rose: { bg: "linear-gradient(168deg,#F1E3DF,#DDC5BE)", ring: "linear-gradient(160deg,#E2C4BE,#A86A72 50%,#D9B3AC)", dark: false },
  sage: { bg: "linear-gradient(168deg,#ECEEDC,#D3D8BB)", ring: "linear-gradient(160deg,#D8DDBE,#8C9A6A 50%,#C9D0A8)", dark: false },
};


/* note / onNote (v1.35): in the pop-up the note is typed straight onto the card. */
function ExperienceCard29({ record, onClick, note, onNote, tone }) {
  const v = xpView29(record);
  const tn = XP_TONES29[tone || XP_TONE29] ? (tone || XP_TONE29) : "champagne";
  const typing = typeof onNote === "function";
  const Icon = v.Icon;
  const key = (e) => { if (onClick && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); onClick(); } };
  return (
    <CardFrame as="div" theme={XP_TONES29[tn]} className={"ff-xc29 t-" + tn + (v.hand ? " hand" : "") + (typing ? " typing" : "")} onClick={onClick}
      style={{ width: CARD_W.venue, backgroundImage: `${XP_TONES29[tn].bg}, ${XP_TONES29[tn].ring}` }}>
      <div className="ff-xc29-in" role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? `${v.name}. Open details` : undefined} onKeyDown={onClick ? key : undefined}>
        <span className="k vb" title={v.kicker}><Icon size={17} strokeWidth={1.8} aria-hidden="true" /><span className="ff-sr">{v.kicker}</span></span>
        <span className="top">
          <span className="nm">
            <b>{v.name}</b>
            {v.where && <span className="ad"><MapPin size={12} strokeWidth={1.8} aria-hidden="true" />{v.where}</span>}
          </span>
        </span>
        {(v.role || v.dates) && <span className="role">{v.role && <b>{v.role}</b>}{v.dates && <span>{v.dates}</span>}</span>}
        {typing
          ? <textarea className="nt ff-xc29-tx" rows={3} autoFocus value={note || ""} onChange={(e) => onNote(e.target.value)}
              aria-label={`What you did at ${v.name}`} placeholder="What I did there" />
          : v.note && <span className="nt">{v.note}</span>}
        <span className="ft">
          {v.foot ? <span className="ar">{v.foot}</span> : v.hand ? <span className="ar">Added by hand</span> : <span />}
          {v.maps && <a className="gm" href={v.maps} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>View on Google Maps →</a>}
        </span>
      </div>
    </CardFrame>
  );
}


/* The Experience cards, scrolling across. */
function ExperienceCards29({ items, onOpen, onAdd }) {
  const list = (items || []).filter(r => xpShown29(r) && !r.hidden && (onOpen || !r.proposed));
  if (!list.length && !onAdd) return null;
  return (
    <div className="ff-xr29" role="list" aria-label={`Venues, ${list.length}`}>
      <style>{xpCSS29}</style>
      {list.map(r => <div key={r.id} role="listitem" className="ff-xr29-it"><ExperienceCard29 record={r} onClick={onOpen ? () => onOpen(r) : undefined} /></div>)}
      {onAdd && <div role="listitem" className="ff-xr29-it"><button type="button" className="ff-xc29-add" style={{ width: CARD_W.venue }} aria-label="Add a venue" onClick={onAdd}>
        <span className="k vb" aria-hidden="true"><MapPin size={17} strokeWidth={1.8} /></span>
        <span className="pe2-plus1" aria-hidden="true"><Plus size={26} strokeWidth={2.2} /></span>
      </button></div>}
      <span className="ff-xr29-end" aria-hidden="true" />
    </div>
  );
}


/* v1.34 (Alex, 18 Nov 18:39): Experience editing is one Google search box (real businesses, or "Add … as a venue"
   for one Google doesn't know), then the Experience cards. No numbered rows, no X buttons. Tapping a card opens it in
   a pop-up at its real shape and size, with a text box for what they did there; Remove lives in the pop-up. */
function ExperienceSheet29({ record, onClose }) {
  const { dispatch } = useStore();
  const [note, setNote] = useState(String((record && record.description) || ""));
  if (!record) return null;
  const v = xpView29(record);
  const save = () => {
    const t = note.trim();
    if (t !== String(record.description || "").trim()) dispatch({ type: "REC_PATCH", category: record.category, id: record.id, patch: { description: t } });
    onClose();
  };
  const remove = () => {
    if (record.category === "experience") dispatch({ type: "REC_PATCH", category: "experience", id: record.id, patch: { hidden: true } });
    else dispatch({ type: "REC_DELETE", category: "venues", id: record.id });
    dispatch({ type: "TOAST", toast: `${v.name} removed` });
    onClose();
  };
  return (
    <Sheet open center title="Venues" onClose={save}>
      <style>{xpCSS29}</style>
      <div className="ff-xs29">
        <div className="ff-xs29-card"><ExperienceCard29 record={record} note={note} onNote={setNote} /></div>
        <div className="ff-xs29-act">
          <button type="button" className="ff-linkbtn ff-xs29-rm" onClick={remove}>Remove</button>
          <Btn variant="gold" onClick={save}><Check size={15} strokeWidth={2.4} /> Done</Btn>
        </div>
      </div>
    </Sheet>
  );
}


function ExperienceEditor29({ items }) {
  const { dispatch } = useStore();
  const [key, setKey] = useState(0);
  const [openId, setOpenId] = useState(null);
  const [finding, setFinding] = useState(false);
  const rows = (items || []).filter(r => xpShown29(r) && !r.hidden && !r.proposed);
  const venues = (items || []).filter(r => r.category !== "experience");
  const same = (r, p) => (r.place && p.place && r.place.id === p.place.id) || String(r.name).toLowerCase() === String(p.name).toLowerCase();
  const taken = (p) => venues.some(r => !r.hidden && same(r, p));
  const add = (p) => {
    setKey(k => k + 1);
    if (!p || !p.name) return;
    setFinding(false);
    setTimeout(() => { const r = document.querySelector(".ff-xe29 .ff-xr29"); if (r) r.scrollLeft = 0; }, 120);
    if (taken(p)) { dispatch({ type: "TOAST", toast: `${p.name} is already on your profile` }); return; }
    dispatch({ type: "REC_ADD", category: "venues", record: makeRecord("venues", p.name, { ...p, details: { kind: "worked" } }) });
    dispatch({ type: "TOAST", toast: `${p.name} added` });
  };
  const openRec = rows.find(r => r.id === openId) || null;
  return (
    <div className="ff-xe29">
      <style>{VEN_CSS17}</style>
      <style>{xpCSS29}</style>
      <ExperienceCards29 items={rows} onOpen={(r) => setOpenId(r.id)} onAdd={() => setFinding(true)} />
      {finding && <Sheet open center title="Venues" onClose={() => setFinding(false)}><div className="ff-xe29-one"><VenueSearch17 key={key} cards autoFocus label="Add a venue" placeholder="Search for a venue" onPick={add} /></div></Sheet>}
      {openRec && <ExperienceSheet29 key={openRec.id} record={openRec} onClose={() => setOpenId(null)} />}
    </div>
  );
}





/* One creator for every attribute. With no `record` it adds a new card;
   with one it updates that card in place (changes save as you type). */
function ProfessionLevelPicker({ value, onChange }) {
  return (
    <div className="ff-levels" role="radiogroup" aria-label="Profession level">
      {PROFESSION_LEVELS.map(l => {
        const on = value === l.n;
        return (
          <button key={l.n} type="button" role="radio" aria-checked={on} className={on ? "on" : ""}
            onClick={() => onChange(on ? null : l.n)} title={`Level ${l.n} · ${l.title}`}>
            <b>{l.n}</b><span>{l.title}</span>
          </button>
        );
      })}
    </div>
  );
}



/* CV details on a card — employer, place, dates, venues. Shown when FireFlair
   added them; editable like the rest of the card. */
function RecordDetailsField({ details, readOnly, onChange }) {
  const d = details || {};
  const [venues, setVenues] = useState((d.venues || []).join(", "));
  const keys = [["employer", d.type === "education" ? "Where" : "Employer"], ["location", "Location"], ["start", "From"], ["end", "To"], ["issuer", "Issued by"], ["level", "Level as written"]]
    .filter(([k]) => d[k] !== undefined);
  if (readOnly) return (
    <Field label="Details">
      <div className="ff-serif" style={{ fontSize: 15 }}>{detailsLine(d) || "—"}</div>
      {SHOW_VENUES17 && d.venues && d.venues.length > 0 && <div className="ff-body" style={{ fontSize: 13.5, marginTop: 4 }}>Venues: {d.venues.join(", ")}</div>}
    </Field>
  );
  return (
    <div className="ff-field">
      <span className="ff-label" style={{ display: "block", marginBottom: 6 }}>Details</span>
      <div className="ff-cvr-grid">
        {keys.map(([k, label]) => (
          <label key={k}><span className="ff-label" style={{ fontSize: 9 }}>{label}</span>
            <input className="ff-input" value={d[k] || ""} onChange={(e) => onChange({ ...d, [k]: e.target.value })} /></label>
        ))}
      </div>
      {SHOW_VENUES17 && d.venues !== undefined && (
        <label style={{ display: "block", marginTop: 8 }}><span className="ff-label" style={{ fontSize: 9 }}>Venues</span>
          <input className="ff-input" value={venues} onChange={(e) => setVenues(e.target.value)}
            onBlur={() => onChange({ ...d, venues: venues.split(",").map(x => x.trim()).filter(Boolean) })} /></label>
      )}
    </div>
  );
}



/* v1.134 (Alex 20 Nov 01:30): Hide is gone everywhere; a subtle grey Delete sits on the same row as Image and Document (a second tap confirms). */
function GacDelete17({ onDelete }) {
  const [sure, setSure] = useState(false);
  return <button type="button" className={"ff-gac17-b del" + (sure ? " sure" : "")} onClick={() => { if (!sure) { setSure(true); return; } onDelete(); }} onBlur={() => setSure(false)}><Trash2 size={14} /> <span>{sure ? "Sure?" : "Delete"}</span></button>;
}

function GenericAttributeCardCreator({ open, record, def, category, readOnly, onClose, owner, rank }) {
  const { state, dispatch: rawDispatch } = useStore();
  /* owner "company": the same editor writes to the Company profile's records. */
  const dispatch = (a) => rawDispatch(owner && /^REC_/.test(a.type) ? { ...a, owner } : a);
  const holder = owner === "company" ? (state.company || {}) : state.profile;
  const [draft, setDraft] = useState(record);
  const [busy, setBusy] = useState(null);
  const mediaRef = useRef(null);
  const docRef = useRef(null);

  useEffect(() => { if (open) { setDraft(record); setBusy(null); } }, [open, record && record.id, category]);
  if (!open || !def || !draft) return null;
  const live = recsOf(holder, category).find(r => r.id === record.id) || draft;

  const patch = (p) => {
    setDraft(d => ({ ...d, ...p }));
    if (!readOnly) dispatch({ type: "REC_PATCH", category, id: record.id, patch: p });
  };

  const addMedia = async (file) => {
    if (!file) return;
    if ((draft.media || []).length >= (def.maxMedia || MAX_MEDIA_PER_CARD)) { setBusy(`Each card holds up to ${def.maxMedia || MAX_MEDIA_PER_CARD} images.`); return; }
    if (file.size > MAX_MEDIA_BYTES) { setBusy(`That image is ${prettyBytes(file.size)} — keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.`); return; }
    setBusy("Adding…");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      patch({ media: [...(draft.media || []), { id: uid("med"), name: file.name, dataUrl }] });
      setBusy(null);
    } catch (e) { setBusy(e.message); }
  };

  const addDoc = async (file) => {
    if (!file) return;
    setBusy("Attaching…");
    try {
      const big = file.size > MAX_MEDIA_BYTES;
      const dataUrl = big ? null : await readFileAsDataUrl(file);
      patch({ document: { name: file.name, size: file.size, type: file.type || "application/pdf", dataUrl } });
      setBusy(big ? "Attached by reference — too large to store in this prototype, so it can't be reopened here." : null);
    } catch (e) { setBusy(e.message); }
  };

  const doc = draft.document;
  const one = def.singular.toLowerCase();
  const maxMedia = def.maxMedia || MAX_MEDIA_PER_CARD;

  return (
    <Sheet open onClose={onClose} title={def.singular}>
      <span className="ff-gac17" hidden />
      <Field label={def.titleLabel || "Title"}>
        {readOnly
          ? <div className="ff-display" style={{ fontSize: 17 }}>{draft.name}</div>
          : category === "venues"
          ? <VenueSearch17 value={draft.name} label={def.titleLabel} onPick={(p) => patch(p)} />
          : <input className="ff-input" style={{ fontSize: 17 }} value={draft.name} 
              onChange={(e) => patch({ name: e.target.value })} placeholder={def.placeholder || def.singular} />}
      </Field>

      {draft.details && Object.keys(draft.details).some(k => k !== "type" && k !== "kind" && draft.details[k] && (!Array.isArray(draft.details[k]) || draft.details[k].length)) && (
        <RecordDetailsField details={draft.details} readOnly={readOnly} onChange={(d) => patch({ details: d })} />
      )}

      {draft.proposed && (
        <div className="ff-frame" style={{ padding: 12, marginBottom: 14 }}>
          {owner !== "company" && <p className="ff-body" style={{ margin: "0 0 10px" }}>Proposed from your CV — nothing is on your profile until you accept it.</p>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn variant="primary" onClick={() => { dispatch({ type: "REC_ACCEPT", category, id: record.id }); patch({ proposed: false }); }}>
              <Check size={13} /> {owner === "company" ? "Keep" : "Accept"}
            </Btn>
            <Btn variant="danger" onClick={() => { dispatch({ type: "REC_DELETE", category, id: record.id }); onClose(); }}>{owner === "company" ? "Remove" : "Reject"}</Btn>
          </div>
        </div>
      )}

      {/* prof-edits (Alex, 18 Nov 20:58): "Available for remote work" removed. */}

      {/* Profession level: only ever seen by the owner, while editing */}
      {category === "professions" && !readOnly && (
        <div className="ff-field">
          <span className="ff-label" style={{ display: "block", marginBottom: 7 }}>Level</span>
          <ProfessionLevelPicker value={draft.level || null} onChange={(n) => patch({ level: n })} />
          <span className="ff-body ff-muted" style={{ fontSize: 12, display: "block", marginTop: 7 }}>
            Profession level helps FireFlair connect Masters with Apprentices for training and development.
          </span>
        </div>
      )}

      {catHas(def, "proficiency") && !["skills", "interests", "qualifications"].includes(category) && (
        <Field label="Level">
          {readOnly ? <div className="ff-serif" style={{ fontSize: 16 }}>{draft.proficiency || "Not stated"}</div> : (
            <select className="ff-input" value={draft.proficiency || ""} onChange={(e) => patch({ proficiency: e.target.value })}>
              <option value="">Not stated</option>
              {PROFICIENCY.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
        </Field>
      )}

      {catHas(def, "address") && category === "venues" && draft.address && (
        <Field label="Address">
          <p className="ff-ven17-addr" style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.4 }}>{draft.address}</p>
          {draft.place && (
            <a className="ff-btn sm" href={venueMapsUrl17(draft)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <MapPin size={12} /> View on Google Maps →
            </a>
          )}
        </Field>
      )}
      {catHas(def, "address") && category !== "venues" && (
        <Field label="Location">
          {readOnly ? <div className="ff-serif" style={{ fontSize: 16 }}>{draft.address || "—"}</div>
            : <input className="ff-input" value={draft.address || ""} onChange={(e) => patch({ address: e.target.value })} placeholder="Street, area or postcode" />}
          {draft.name.trim() && (
            <a className="ff-btn sm" href={mapsUrl(draft)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", marginTop: 8 }}>
              <MapPin size={12} /> View on Google Maps →
            </a>
          )}
        </Field>
      )}

      {catHas(def, "ingredients") && (
        <Field label="Ingredients" hint={readOnly ? null : "One per line, with measures. Include the garnish."}>
          {readOnly
            ? <ul className="ff-recipe-ul">{ingredientsOf(draft).map((g, i) => <li key={i}>{g}</li>)}</ul>
            : <textarea className="ff-input" rows={5} value={draft.ingredients || ""} placeholder={"50ml bourbon\n10ml maple syrup\n2 dashes Angostura bitters\nGarnish: orange zest"}
                onChange={(e) => patch({ ingredients: e.target.value })} />}
        </Field>
      )}
      {catHas(def, "glass") && (
        <Field label="Glass">
          {readOnly ? <span className="ff-glassread"><GlassIcon glass={draft.glass} size={24} /> {glassLabel(draft.glass) || "Not set"}</span> : (
            <div className="ff-glasspick" role="group" aria-label="Glass">
              {GLASSES.map(g => (
                <button key={g.key} type="button" aria-pressed={draft.glass === g.key} onClick={() => patch({ glass: g.key })}>
                  <GlassIcon glass={g.key} size={24} /><span>{g.label}</span>
                </button>
              ))}
            </div>
          )}
        </Field>
      )}

      {!def.mediaCard && (
      <Field label={def.descLabel || "Description"}>
        {readOnly
          ? <p className="ff-serif" style={{ fontSize: 16, lineHeight: 1.5, margin: 0 }}>{draft.description || (category === "professions" ? professionDefaultDesc(draft.name, draft.displayCategory) : "") || "Nothing written yet."}</p>
          : <textarea className="ff-input" rows={5} value={draft.description != null && draft.description !== "" ? draft.description : (category === "professions" && !draft.descTouched ? professionDefaultDesc(draft.name, draft.displayCategory) : "")} placeholder={def.descPlaceholder || undefined}
              onChange={(e) => { setDraft(d => ({ ...d, descTouched: true })); patch({ description: e.target.value }); }} />}
      </Field>
      )}

      <div style={{ marginBottom: 16 }}>
        {(draft.media || []).length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            {draft.media.map(m => (
              <span key={m.id} style={{ position: "relative", width: 84, height: 84, border: "1px solid var(--rule)", borderRadius: 14, overflow: "hidden", background: `url("${m.dataUrl}") center/cover` }}>
                {!readOnly && (
                  <button aria-label={`Remove ${m.name}`}
                    onClick={() => patch({ media: draft.media.filter(x => x.id !== m.id) })}
                    style={{ position: "absolute", top: 4, right: 4, background: "rgba(12,12,14,.82)", color: "#EAD79C", width: 20, height: 20, borderRadius: 999, display: "grid", placeItems: "center" }}>
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>
        )}
        {doc && (
          <div className="ff-frame" style={{ padding: 10, display: "flex", gap: 11, alignItems: "center", marginBottom: 10 }}>
            <span style={{ width: 30, height: 30, flex: "none", background: "#5C1220", display: "grid", placeItems: "center" }}>
              <FileText size={15} color="#EAD79C" strokeWidth={1.6} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="ff-serif" style={{ fontSize: 14, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.name}</span>
              <span className="ff-body ff-muted" style={{ fontSize: 11 }}>{doc.size ? prettyBytes(doc.size) : "Attached"}</span>
            </span>
            {doc.dataUrl && <a className="ff-btn sm ghost" href={doc.dataUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }} aria-label="Open document"><Eye size={12} /></a>}
            {!readOnly && <button className="ff-btn sm ghost" aria-label="Remove document" onClick={() => patch({ document: null })}><X size={12} /></button>}
          </div>
        )}
        {readOnly && !(draft.media || []).length && !doc && <p className="ff-body ff-muted" style={{ margin: 0 }}>None.</p>}
        {!readOnly && (
          <div className="ff-gac17-row">
            <input ref={mediaRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { addMedia(e.target.files?.[0]); e.target.value = ""; }} />
            <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.txt,application/pdf" style={{ display: "none" }}
              onChange={(e) => { addDoc(e.target.files?.[0]); e.target.value = ""; }} />
            <button type="button" className="ff-gac17-b" disabled={(draft.media || []).length >= maxMedia} onClick={() => mediaRef.current?.click()}><Camera size={14} /> <span>Image {(draft.media || []).length}/{maxMedia}</span></button>
            <button type="button" className="ff-gac17-b" onClick={() => docRef.current?.click()}><FileText size={14} /> <span>{doc ? "Replace" : "Document"}</span></button>
            {!draft.proposed && <GacDelete17 onDelete={() => { dispatch({ type: "REC_DELETE", category, id: record.id }); onClose(); }} />}
          </div>
        )}
      </div>

      {!readOnly && category === "professions" && (!professionCategory(draft.name) || draft.displayCategory) && (
        <Field label="Display category">
          <select className="ff-input" value={professionCategory(draft.name, draft.displayCategory) || "Other"}
            onChange={(e) => patch({ displayCategory: e.target.value })}>
            {CATEGORY_ORDER.map(k => <option key={k} value={k}>{k === "Other" ? "Specialist" : k}</option>)}
          </select>
        </Field>
      )}

      {busy && <p className="ff-body ff-muted" style={{ fontSize: 12 }}>{busy}</p>}

      {!readOnly && !draft.proposed && (<>
        <Btn variant="primary wide" disabled={!draft.name.trim()} onClick={onClose}><Check size={14} /> Update {one}</Btn>
        {owner === "company" && !live.hidden && (
          <div className="ff-co-shift17" role="group" aria-label="Order">
            <button type="button" aria-label="Move earlier" onClick={() => dispatch({ type: "REC_SHIFT", category, id: record.id, dir: -1 })}><ChevronLeft size={15} /> Earlier</button>
            <button type="button" aria-label="Move later" onClick={() => dispatch({ type: "REC_SHIFT", category, id: record.id, dir: 1 })}>Later <ChevronRight size={15} /></button>
          </div>
        )}
      </>)}
    </Sheet>
  );
}



/* ==========================================================================
   PROFILE PAGE — a collection of linked Information Cards.
   Every category the person has becomes a section; every record in it opens
   its own full card. This is the depth behind the Profile Card summary.
   ========================================================================== */




