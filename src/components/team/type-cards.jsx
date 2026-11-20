/* src/components/team/type-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   pb-typecards (Alex, 18 Nov): Skills and Interests are typed straight onto their cards in the profile builder.
   - A card holds TYPECARD_MAX (5) entries. The last card carries the type line; when it fills, a new empty card follows.
   - Enter or a comma adds the entry and keeps the cursor on the cards (it moves to the new card when one appears).
   - Backspace in an empty type line removes the last entry. Tapping an entry opens it for editing, with a remove button.
   - Entries are at most TYPECARD_CHARS (60) characters on the profile (enforced while typing; long entries wrap between words,
     one word too long for the box shrinks) and are saved in Title Case (capWords17).
   - Top three (Alex, 19:19): the first FEATURE_LIMIT (3) entries in order are the ones on the Profile Card. They carry a small
     gold number. An entry over PC_ENTRY_CHARS (16) characters can't go on the card (PlayerFace17 leaves it out whole), so a
     top-three entry that long shows its number hollow instead. Entries are reordered by dragging (mouse or pen) or, on a
     touch screen, by tapping an entry and using its earlier / later buttons; both dispatch REC_MOVE { id, to }.
   Data: nothing new. Entries are the ordinary records in profile.records.skills / .interests; the cards show
   rankedRecords(list) (visible records, rank then list order) chunked five to a card, the same order and chunking as the
   public profile's AttrGroups. The public profile never shows an empty card; only this builder does. */

const TYPECARD_CATS = ["skills", "interests"];
const TYPECARD_MAX = 5;
const TYPECARD_CHARS = 60;
const PC_ENTRY_CHARS = 16;
const TcUp26 = lucideIcon("ArrowUp"), TcDown26 = lucideIcon("ArrowDown");
const TYPECARD_CSS = __ff_css("styles/type-cards.css");

/* One word that is too long for the card shrinks to fit instead of breaking across lines. */
function useFitText26(ref, key) {
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      let px = parseFloat(getComputedStyle(el).fontSize) || 14, g = 0;
      while (el.scrollWidth > el.clientWidth + 0.5 && px > 9 && g++ < 30) { px -= 0.5; el.style.fontSize = px + "px"; }
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
  }, [key]);
}

function TypeChip26({ rec, pos, onOpen, drag }) {
  const ref = useRef(null);
  useFitText26(ref, rec.name);
  const top = pos < FEATURE_LIMIT;
  const off = top && String(rec.name).length > PC_ENTRY_CHARS;
  return (
    <button type="button" className={"tc26-chip" + (top ? " top" : "") + (off ? " off" : "")}
      onClick={(e) => { e.stopPropagation(); if (drag.moved()) return; onOpen(rec); }}
      onPointerDown={(e) => drag.down(e, rec.id)} onPointerMove={drag.move} onPointerUp={drag.up} onPointerCancel={drag.cancel}
      aria-label={`${rec.name}${top ? (off ? `, number ${pos + 1}, too long for the Profile Card` : `, number ${pos + 1} on the Profile Card`) : ""}, edit`}>
      <span ref={ref} className="tc26-chip-t">{nbh21(rec.name)}</span>
      {top && <span className="tc26-no" aria-hidden="true">{pos + 1}</span>}
    </button>
  );
}

function TypeChipEdit26({ rec, pos, count, onSave, onRemove, onCancel, onMove }) {
  const [v, setV] = useState(rec.name);
  const done = useRef(false);
  const ref = useRef(null);
  useEffect(() => { const el = ref.current; if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, []);
  /* A text box that wraps between words and grows, so a long entry stays readable while it is edited. */
  React.useLayoutEffect(() => { const el = ref.current; if (el) { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; } }, [v]);
  const save = () => { if (done.current) return; done.current = true; onSave(v); };
  /* The buttons keep the focus in the box (no blur, so no save) until one is used. */
  const keepFocus = (e) => e.preventDefault();
  return (
    <div className={"tc26-chip tc26-chip-ed" + (pos < FEATURE_LIMIT ? " top" : "")} onClick={(e) => e.stopPropagation()}>
      <textarea ref={ref} rows={1} value={v} maxLength={TYPECARD_CHARS} autoComplete="off" spellCheck={false} enterKeyHint="done"
        aria-label={`Edit ${rec.name}`} onChange={(e) => setV(e.target.value.replace(/[\r\n]+/g, " ").slice(0, TYPECARD_CHARS))} onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); save(); }
          else if (e.key === "Escape") { e.preventDefault(); done.current = true; onCancel(); }
        }} />
      <span className="tc26-acts">
        <button type="button" className="tc26-act" aria-label={`Move ${rec.name} earlier`} disabled={pos === 0}
          onPointerDown={keepFocus} onClick={() => onMove(rec, pos - 1)}><TcUp26 size={14} strokeWidth={2.4} aria-hidden="true" /></button>
        <button type="button" className="tc26-act" aria-label={`Move ${rec.name} later`} disabled={pos >= count - 1}
          onPointerDown={keepFocus} onClick={() => onMove(rec, pos + 1)}><TcDown26 size={14} strokeWidth={2.4} aria-hidden="true" /></button>
        <button type="button" className="tc26-act rm" aria-label={`Remove ${rec.name}`}
          onPointerDown={keepFocus} onClick={() => { done.current = true; onRemove(rec); }}><X size={14} strokeWidth={2.4} aria-hidden="true" /></button>
      </span>
    </div>
  );
}

/* Drag to reorder (mouse and pen; on touch the rail keeps scrolling and the edit buttons move an entry). The drop place is
   worked out from the chip nearest the pointer, across all of the category's cards. */
function useTypeDrag26(catKey, ids, dispatch) {
  const [drag, setDrag] = useState(null);
  const st = useRef(null);
  const movedAt = useRef(0);
  const rects = () => [...document.querySelectorAll(`[data-tc-cat="${catKey}"] [data-tc-id]`)].map(el => {
    const b = el.getBoundingClientRect(); return { id: el.getAttribute("data-tc-id"), x: b.left + b.width / 2, y: b.top + b.height / 2, l: b.left, r: b.right };
  });
  const place = (x, y, id) => {
    const others = rects().filter(r => r.id !== id);
    if (!others.length) return { to: 0, mark: null };
    let best = 0, bd = Infinity;
    others.forEach((r, i) => { const d = Math.hypot((x - r.x) * 0.6, y - r.y) + (x < r.l || x > r.r ? 200 : 0); if (d < bd) { bd = d; best = i; } });
    const after = y > others[best].y;
    return { to: best + (after ? 1 : 0), mark: { id: others[best].id, after } };
  };
  const down = (e, id) => {
    if (e.pointerType === "touch" || (e.button !== undefined && e.button !== 0)) return;
    st.current = { id, x0: e.clientX, y0: e.clientY, on: false, pid: e.pointerId, el: e.currentTarget };
  };
  const move = (e) => {
    const s = st.current; if (!s) return;
    const dx = e.clientX - s.x0, dy = e.clientY - s.y0;
    if (!s.on) {
      if (Math.hypot(dx, dy) < 6) return;
      s.on = true; noSel21(true);
      try { s.el.setPointerCapture(s.pid); } catch (x) { /* older browsers */ }
    }
    e.preventDefault();
    const p = place(e.clientX, e.clientY, s.id);
    s.to = p.to;
    setDrag({ id: s.id, dx, dy, mark: p.mark });
  };
  const end = (commit) => {
    const s = st.current; st.current = null;
    if (!s || !s.on) return;
    noSel21(false); setDrag(null); movedAt.current = Date.now();
    const from = ids.indexOf(s.id);
    if (commit && s.to !== undefined && s.to !== from) dispatch({ type: "REC_MOVE", category: catKey, id: s.id, to: s.to });
  };
  return { drag, down, move, up: () => end(true), cancel: () => end(false), moved: () => Date.now() - movedAt.current < 250 };
}

/* All the cards of one category (skills or interests) in the edit page's Attributes rail. */
function TypeCards26({ catKey, records, tone }) {
  const { state, dispatch } = useStore();
  const def = BASE_CATEGORIES[catKey];
  const shown = rankedRecords(records || []).filter(r => !r.hidden && !r.proposed);
  const [typed, setTyped] = useState("");
  const [editId, setEditId] = useState(null);
  const inRef = useRef(null);
  const keep = useRef(false);
  const n = shown.length;
  const ids = shown.map(r => r.id);
  const dr = useTypeDrag26(catKey, ids, dispatch);

  /* Cards of five; the type line sits on the last card, or on a new empty card when the last one is full. */
  const cards = [];
  for (let i = 0; i < n; i += TYPECARD_MAX) cards.push(shown.slice(i, i + TYPECARD_MAX));
  if (!cards.length || cards[cards.length - 1].length === TYPECARD_MAX) cards.push([]);

  React.useLayoutEffect(() => {
    if (!keep.current) return;
    keep.current = false;
    const el = inRef.current; if (!el) return;
    el.focus({ preventScroll: true });
    const card = el.closest(".ff-agrp");
    if (card && card.scrollIntoView) card.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  });

  const has = (nm, except) => (records || []).some(r => r.id !== except && !r.hidden && !r.proposed && String(r.name).toLowerCase() === nm.toLowerCase());
  const clean = (s) => String(s || "").replace(/\s+/g, " ").trim().slice(0, TYPECARD_CHARS).trim();

  const addAll = (parts) => {
    const names = [];
    parts.map(clean).filter(Boolean).forEach(nm => { if (!has(nm) && !names.some(x => x.toLowerCase() === nm.toLowerCase())) names.push(nm); });
    if (!names.length) {
      const dup = parts.map(clean).find(Boolean);
      if (dup) dispatch({ type: "TOAST", toast: `${capWords17(dup)} is already on your profile` });
      return;
    }
    const taskId = xpTaskFor(catKey);
    const fresh = XP_TASKS.some(t => t.id === taskId) && !(state.profile.xpClaimed || []).includes(taskId);
    /* New entries join the end. The first entry of an empty list takes the usual guessed rank; later ones are Extra so
       they never jump ahead of what is already on the cards. */
    names.forEach((nm, i) => dispatch({ type: "REC_ADD", category: catKey, record: makeRecord(catKey, nm, n + i > 0 ? { rank: "tertiary" } : {}) }));
    if (fresh) dispatch({ type: "TOAST", toast: `${def.singular} added${xpNote(XP_VALUES.task)}` });
  };
  const commit = () => { const t = typed; setTyped(""); if (clean(t)) addAll([t]); };

  const onChange = (e) => {
    const v = e.target.value;
    if (/[,\n]/.test(v)) { const parts = v.split(/[,\n]/); setTyped(parts.pop().slice(0, TYPECARD_CHARS)); addAll(parts); keep.current = true; return; }
    setTyped(v.slice(0, TYPECARD_CHARS));
  };
  const onPaste = (e) => {
    const t = (e.clipboardData && e.clipboardData.getData("text")) || "";
    if (!/[,\n;]/.test(t)) return;
    e.preventDefault();
    const parts = (typed + t).split(/[,\n;]/);
    setTyped(""); addAll(parts); keep.current = true;
  };
  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); keep.current = true; }
    else if (e.key === "Backspace" && !typed && n) { e.preventDefault(); dispatch({ type: "REC_DELETE", category: catKey, id: shown[n - 1].id }); keep.current = true; }
  };

  const saveEdit = (rec, v) => {
    setEditId(null);
    const nm = clean(v);
    if (!nm) { dispatch({ type: "REC_DELETE", category: catKey, id: rec.id }); return; }
    if (nm === rec.name) return;
    if (has(nm, rec.id)) { dispatch({ type: "TOAST", toast: `${capWords17(nm)} is already on your profile` }); return; }
    dispatch({ type: "REC_PATCH", category: catKey, id: rec.id, patch: { name: nm } });
  };
  const remove = (rec) => { setEditId(null); dispatch({ type: "REC_DELETE", category: catKey, id: rec.id }); };
  const moveTo = (rec, to) => { if (to < 0 || to >= n) return; dispatch({ type: "REC_MOVE", category: catKey, id: rec.id, to }); };

  return (
    <>
      <style>{TYPECARD_CSS}</style>
      {cards.map((part, ci) => {
        const base = ci * TYPECARD_MAX;
        const last = ci === cards.length - 1;
        const empty = !part.length;
        return (
          <div key={`${catKey}-${ci}`} role="listitem" className={"ff-agrp tc26 " + (empty ? "pe2-agrp-empty tc26-empty" : tone)}
            data-cat={catKey} data-tc-cat={catKey} aria-label={def.label}
            onClick={last ? () => { const el = inRef.current; if (el && document.activeElement !== el) el.focus(); } : undefined}>
            <span className="ff-agrp-top"><span className="ff-agrp-h">{def.label}</span>{!empty && <span className="ff-agrp-n" aria-hidden="true"><ChevronDown size={16} strokeWidth={2.2} /></span>}</span>
            <div className={"tc26-list" + (dr.drag ? " dragging" : "")} role="list" aria-label={def.label}>
              {part.map((r, j) => {
                const pos = base + j;
                const d = dr.drag;
                const lifted = d && d.id === r.id;
                const mk = d && d.mark && d.mark.id === r.id ? (d.mark.after ? " after" : " before") : "";
                return (
                  <div key={r.id} role="listitem" data-tc-id={r.id} className={"tc26-li" + (lifted ? " lifted" : "") + mk}
                    style={lifted ? { transform: `translate(${d.dx}px, ${d.dy}px)` } : undefined}>
                    {editId === r.id
                      ? <TypeChipEdit26 rec={r} pos={pos} count={n} onSave={(v) => saveEdit(r, v)} onRemove={remove} onCancel={() => setEditId(null)} onMove={moveTo} />
                      : <TypeChip26 rec={r} pos={pos} drag={dr} onOpen={(x) => setEditId(x.id)} />}
                  </div>
                );
              })}
              {last && (
                <div className="tc26-li tc26-li-in">
                  <input ref={inRef} className="tc26-in" type="text" value={typed} maxLength={TYPECARD_CHARS} autoComplete="off" spellCheck={false}
                    autoCapitalize="words" enterKeyHint="enter" name={`add-${catKey}`} aria-label={`Add ${def.singular.toLowerCase()}`}
                    onChange={onChange} onKeyDown={onKeyDown} onPaste={onPaste} onBlur={commit} />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
