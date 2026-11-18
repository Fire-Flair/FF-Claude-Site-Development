/* src/components/team/attribute-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Quick-pick: five suggested professions per display category (v1.6 §2).
   Anything else can be typed — "Add another profession". */
/* Phase 1: search as you type (as Griffy's ProfessionPickerPanel does against
   GET /user/professions?search=), across the 35 v1.6 professions, plus
   "Add" for anything else — FireFlair then asks for its category if the rules
   can't tell. Without a search it shows the category chips as before. */
const ALL_PROFESSIONS = PROFESSION_CATEGORIES.flatMap(c => c.suggested.map(n => ({ name: n, cat: c.key })));


const RANK_CSS17 = __ff_css("styles/rank17.css");


/* v17.21: the v17.15 gold "Pick your professions" box is back: a search-or-type field, the category chips in one row that
   scrolls across (never up and down), and the suggestions. Typing a profession that isn't on the list asks for its category. */
function ProfessionPicker({ selected = [], onPick, title = "Pick your professions" }) {
  const [cat, setCat] = useState(PROFESSION_CATEGORIES[0].key);
  const [q, setQ] = useState("");
  const [newCat, setNewCat] = useState(null);
  const c = PROFESSION_CATEGORIES.find(x => x.key === cat);
  const has = (n) => selected.some(x => String(x).toLowerCase() === n.toLowerCase());
  const n = q.trim().toLowerCase();
  const hits = n ? [
    ...ALL_PROFESSIONS.filter(p => p.name.toLowerCase().startsWith(n)),
    ...ALL_PROFESSIONS.filter(p => !p.name.toLowerCase().startsWith(n) && p.name.toLowerCase().includes(n)),
  ] : [];
  const typed = q.trim().replace(/\s+/g, " ").replace(/\b\w/g, ch => ch.toUpperCase());
  const custom = n && !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n) ? typed : null;
  const customCat = custom ? professionCategory(custom) : null;
  const pick = (name, category) => { onPick(name, category); setQ(""); setNewCat(null); };
  const enter = (e) => { if (e.key === "Enter" && n) { e.preventDefault(); if (hits[0]) pick(hits[0].name); else if (customCat) pick(typed); } };
  const chip = (name, onClick, extra) => (
    <button key={name} type="button" className={"ff-pk21-chip" + (has(name) ? " on" : "")} aria-pressed={has(name)} onClick={onClick}>
      {has(name) ? <Check size={13} strokeWidth={2.6} /> : <Plus size={13} strokeWidth={2.4} />}<span>{name}</span>{extra}
    </button>
  );
  return (
    <div className="ff-pk21">
      <div className="ff-pk21-h">{title}</div>
      <div className="ff-pk21-q">
        <Search size={16} aria-hidden="true" />
        <input type="search" value={q} autoComplete="off" spellCheck={false} enterKeyHint="enter"
          onChange={(e) => setQ(e.target.value)} placeholder="Search or type a profession" aria-label="Search or type a profession" onKeyDown={enter} />
      </div>
      {n ? (
        <div className="ff-pk21-wrap" role="list" aria-label="Matching professions">
          {hits.map(p => chip(p.name, () => pick(p.name)))}
          {custom && customCat && chip(`Add \u201c${custom}\u201d`, () => pick(custom))}
          {custom && !customCat && (
            <div className="ff-pk21-new">
              <div className="ff-pk21-h sm">Which category is \u201c{custom}\u201d in?</div>
              <div className="ff-pk21-cats" role="radiogroup" aria-label="Category">
                {CATEGORY_ORDER.map(k => (
                  <button key={k} type="button" role="radio" aria-checked={newCat === k} className={"ff-pk21-cat" + (newCat === k ? " on" : "")} onClick={() => setNewCat(k)}>{k}</button>
                ))}
              </div>
              <button type="button" className="ff-pk21-chip add" disabled={!newCat} onClick={() => newCat && pick(custom, newCat)}>
                <Plus size={13} strokeWidth={2.4} /><span>Add \u201c{custom}\u201d</span>
              </button>
            </div>
          )}
        </div>
      ) : (<>
        <div className="ff-pk21-cats" role="tablist" aria-label="Profession categories">
          {PROFESSION_CATEGORIES.map(x => (
            <button key={x.key} type="button" role="tab" aria-selected={x.key === cat} className={"ff-pk21-cat" + (x.key === cat ? " on" : "")} onClick={() => setCat(x.key)}>{x.key}</button>
          ))}
        </div>
        <div className="ff-pk21-wrap">{c.suggested.map(nm => chip(nm, () => pick(nm)))}</div>
      </>)}
      <p className="ff-pk21-note">Your first three show on your card.</p>
    </div>
  );
}



/* ==========================================================================
   PROFILE CARD SYSTEM — one set of parts for every attribute.
   GenericAttributeCard          how one item looks (portrait, or landscape
                                 for venues)
   HorizontalCardRanker          left-to-right order; position decides what
                                 the Profile Card features (see cardRank)
   ProfileAttributeSection       drop-down section: cards + an add-card tile
   GenericAttributeCardCreator   the ONE sheet that adds or updates a card:
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



/* MEDIA CARD — a title at the top, then the media itself filling the card.
   No description: the picture (or document) is the content. */
function MediaCard({ record, def, themeKey = "onyx", onClick, highlight, rank }) {
  const tier = !record.proposed && RANK_TIER[rank] || "standard";
  const t = tier !== "standard" ? RANK_THEMES[tier] : (THEMES[themeKey === "slate" ? "onyx" : themeKey] || THEMES.onyx);
  const media = record.media || [];
  const doc = record.document && record.document.name ? record.document : null;
  const lead = media[0];
  return (
    <CardFrame as={onClick ? "button" : "div"} tier={tier} theme={t} ratio="1 / 1" className="sq" onClick={onClick}
      style={{ width: CARD_W.info, padding: "24px 8px 8px", display: "flex", flexDirection: "column", textAlign: "left" }}>
      <span style={{ position: "absolute", top: 10, left: 13, fontSize: 8.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: t.sub, zIndex: 4 }}>{def.singular}</span>
      {record.proposed && <span style={{ position: "absolute", top: 7, right: 8, zIndex: 4 }}><Pill tone="warn">Proposed</Pill></span>}
      {!record.proposed && highlight && (
        <span style={{ position: "absolute", top: 8, right: 9, zIndex: 4, color: t.accent, display: "flex" }} title="Featured">
          {rank === "primary" ? <Star size={13} fill="currentColor" /> : <Check size={13} strokeWidth={2.4} />}
        </span>
      )}
      <div style={{ fontFamily: "var(--sans)", color: t.ink, fontSize: 14.5, fontWeight: 700, lineHeight: 1.25, padding: "4px 4px 8px",
        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{record.name}</div>
      <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: 8, overflow: "hidden", border: `1px solid ${t.rule}`,
        background: lead ? `url("${lead.dataUrl}") center/cover` : (t.dark ? "rgba(255,255,255,.06)" : "rgba(20,20,22,.05)"),
        display: "grid", placeItems: "center", color: t.sub }}>
        {!lead && doc && (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: 10, textAlign: "center", minWidth: 0, maxWidth: "100%" }}>
            <FileText size={34} strokeWidth={1.3} />
            <span className="ff-serif" style={{ fontSize: 12, lineHeight: 1.25, overflowWrap: "anywhere" }}>{doc.name}</span>
          </span>
        )}
        {!lead && !doc && (
          <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: .75 }}>
            <Camera size={24} strokeWidth={1.4} />
            <span style={{ fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase" }}>Add media</span>
          </span>
        )}
        {(media.length > 1 || (lead && doc)) && (
          <span style={{ position: "absolute", right: 6, bottom: 6, display: "flex", gap: 6, alignItems: "center", padding: "3px 7px", borderRadius: 999,
            background: "rgba(10,10,12,.72)", color: "#EAD79C", fontSize: 9.5 }}>
            {media.length > 1 && <><Camera size={11} strokeWidth={1.6} />{media.length}</>}
            {lead && doc && <FileText size={11} strokeWidth={1.6} />}
          </span>
        )}
      </div>
    </CardFrame>
  );
}



/* rank: "primary" | "secondary" | "tertiary" (internal only, never shown as words). */
function GenericAttributeCard({ record, def, themeKey, onClick, rank, editable, pub }) {
  const card = def.landscape && pub !== "c"
    ? <VenueLandscapeCard record={record} />
    : def.mediaCard
    ? <MediaCard record={record} def={def} themeKey={record.proposed ? "paper" : themeKey} onClick={onClick} highlight={rank !== "tertiary" && !record.hidden} rank={rank} />
    : <InformationCard record={record} def={def} themeKey={record.proposed ? "paper" : themeKey} onClick={onClick} highlight={rank !== "tertiary" && !record.hidden} rank={rank} editable={editable} pub={pub} />;
  if (!record.hidden) return card;
  return (
    <div style={{ position: "relative" }}>
      <div style={{ opacity: .42, filter: "grayscale(.6)" }}>{card}</div>
      <span style={{ position: "absolute", top: "42%", left: 0, right: 0, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <Pill><EyeOff size={10} /> Hidden</Pill>
      </span>
    </div>
  );
}



/* Left-to-right ordering, kept separate so any card category can use it.
   Hidden and proposed items keep their place but never take a featured slot. */
/* v1.2: cards show in tier order — primary (gold), secondary (silver, two
   at most), tertiary (bronze). No arrows: ordering happens in Edit Profile. */
function HorizontalCardRanker({ items, label, renderCard, tail }) {
  return (
    <HScroll label={label}>
      {withRanks(items).map(({ r, rank }) => (
        <div key={r.id} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {renderCard(r, rank)}
        </div>
      ))}
      {tail}
    </HScroll>
  );
}



/* ==========================================================================
   v17.19 — RANKED LISTS (Professions, Qualifications, Skills, Interests, Languages)
   One numbered list per section: number, name, "+" (detail text and pictures), a three-line handle to drag it into
   place. The order is the rank; there are no coloured tiers. The detail text and every picture sit under the entry
   once saved. RankListView17 is the read-only look for the displayed profile.
   ========================================================================== */
const RANK_CATS19 = ["professions", "qualifications", "skills", "interests", "languages", "experience"];


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
      <textarea className="ff-ed21-ta" rows={Math.max(2, Math.min(6, Math.ceil(String(r.description || "").length / 34)))} value={r.description || ""} aria-label={`Details for ${r.name}`} placeholder="Details"
        autoFocus={FF_FINE_POINTER} onChange={(e) => patch({ description: e.target.value })} />
      <PhotoBoxes19 media={r.media} max={maxMedia} busy={busy === "loading"} onAdd={addPhoto}
        onRemove={(m) => patch({ media: (r.media || []).filter(x => x.id !== m.id) })} />
      {busy && busy !== "loading" && <p className="ff-wlbox-err" role="alert">{busy}</p>}
      {catKey === "professions" && (<>
        <div className="ff-levels-wrap"><ProfessionLevelPicker value={r.level || null} onChange={(n) => patch({ level: n })} /></div>
        <label className="ff-remote17 ff-rl19-chk"><input type="checkbox" checked={!!r.remote} onChange={(e) => patch({ remote: e.target.checked })} /><span>Available for remote work</span></label>
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
function TypeBox21({ catKey, def, rows, placeholder }) {
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
    dispatch({ type: "REC_ADD", category: catKey, record: makeRecord(catKey, nm) });
    dispatch({ type: "TOAST", toast: `${def.singular} added${fresh ? xpNote(XP_VALUES.task) : ""}` });
    setTyped("");
  };
  return (
    <form className={"ff-type21" + (typed.trim() ? " has" : "")} onSubmit={add}>
      <input type="text" name={`add-${catKey}`} value={typed} autoComplete="off" spellCheck={false} enterKeyHint="enter"
        placeholder={placeholder || `Type ${an} ${one}`} aria-label={`Add ${an} ${one}`} onChange={(e) => setTyped(e.target.value)} />
      <button type="submit" className="ff-type21-key" aria-label={`Add ${an} ${one}`} tabIndex={-1}><span>Enter</span><CornerDownLeft21 size={15} strokeWidth={2.2} aria-hidden="true" /></button>
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


function ProfTile21({ r, i, editable, open, lifted, dx, onTap, grip, extra, catKey = "professions", compact }) {
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
      <button type="button" className={"ff-agrp prof ff-pt21 " + tierCls17(i) + (open ? " open" : "") + (r.hidden ? " hid" : "")}
        aria-expanded={editable ? open : undefined} aria-label={editable ? `${r.name}. Edit` : `${r.name}. Open details`} onClick={onTap}>
        <span className="ff-agrp-top"><span className="ff-agrp-h">{nbh21(r.name)}</span></span>
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
      {grip}
    </div>
  );
}


function ProfTiles21({ items, editable, def, onOpen, extra, label = "Professions", catKey = "professions", compact }) {
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
  const others = drag ? ids.filter(x => x !== drag.id) : [];
  const mark = drag && drag.over !== drag.from ? (drag.over < others.length ? { id: others[drag.over], side: "l" } : { id: others[others.length - 1], side: "r" }) : null;
  const openRec = editable ? rows.find(r => r.id === openId) : null;
  if (!rows.length) return null;
  return (<>
    <div ref={rowRef} className={"ff-pt21-row" + (compact ? " ff-pa40-row" : "") + (drag ? " dragging" : "")} role="list" aria-label={`${label}, ${rows.length}`}>
      {rows.map((r, i) => (
        <div role="listitem" key={r.id} className={"ff-pt21-slot" + (mark && mark.id === r.id ? " mk-" + mark.side : "")}>
          <ProfTile21 r={r} i={i} editable={editable} catKey={catKey} compact={compact} open={openId === r.id} lifted={drag && drag.id === r.id} dx={drag ? drag.dx : 0}
            extra={extra ? extra(r) : null}
            onTap={() => editable ? setOpenId(openId === r.id ? null : r.id) : onOpen && onOpen(r)}
            grip={editable ? (
              <span className="ff-pt21-grip" role="button" tabIndex={0} aria-label={`Move ${r.name}. Drag, or use the left and right arrow keys`}
                onPointerDown={(e) => down(e, r.id)} onPointerMove={(e) => drag && move(e)} onPointerUp={up} onPointerCancel={() => { noSel21(false); setDrag(null); }} onKeyDown={(e) => key(e, r.id, i)}>
                <i /><i /><i />
              </span>) : null} />
        </div>
      ))}
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
   v17.19 — VENUES: Worked at and Favourites, two rows that scroll across.
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


function VenueCard19({ record: r, onClick }) {
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


function VenueRows19({ items, onOpen }) {
  const list = (items || []).filter(r => onOpen || (!r.hidden && !r.proposed));
  const rows = [["worked", "Worked at"], ["favourite", "Favourites"]].map(([k, label]) => [k, label, list.filter(r => venueKind19(r) === k)]).filter(x => x[2].length);
  return (<>
    {rows.map(([k, label, group]) => (
      <div key={k} className="ff-vr19">
        <div className="ff-vr19-h">{label} · {group.length}</div>
        <div className="ff-vr19-row" role="list" aria-label={label}>
          {group.map(r => <div key={r.id} role="listitem" className="ff-vr19-it"><VenueCard19 record={r} onClick={onOpen ? () => onOpen(r) : undefined} /></div>)}
        </div>
      </div>
    ))}
  </>);
}


function VenuesEditor19({ items, onOpen }) {
  const { dispatch } = useStore();
  const [kind, setKind] = useState("worked");
  const [key, setKey] = useState(0);
  const same = (r, p) => (r.place && p.place && r.place.id === p.place.id) || String(r.name).toLowerCase() === String(p.name).toLowerCase();
  const add = (p) => {
    if (!p || !p.name) return;
    if (items.some(r => same(r, p))) { dispatch({ type: "TOAST", toast: `${p.name} is already on your profile` }); setKey(k => k + 1); return; }
    dispatch({ type: "REC_ADD", category: "venues", record: makeRecord("venues", p.name, { ...p, details: { kind } }) });
    dispatch({ type: "TOAST", toast: `${p.name} added` });
    setKey(k => k + 1);
  };
  return (
    <div className="ff-venedit17 ff-ven19">
      <style>{VEN_CSS17}</style>
      <style>{RANK_CSS17}</style>
      <p className="ff-venedit17-line">Add the top venues you've worked at, or your favourite bars.</p>
      <div className="ff-seg19" role="radiogroup" aria-label="Kind of venue">
        {[["worked", "Worked at", Briefcase], ["favourite", "Favourites", Heart]].map(([k, label, Ic]) => (
          <button key={k} type="button" role="radio" aria-checked={kind === k} className={kind === k ? "on" : ""} onClick={() => setKind(k)}><Ic size={15} strokeWidth={2} aria-hidden="true" />{label}</button>
        ))}
      </div>
      <VenueSearch17 key={key} label="Search for a venue" placeholder="Search for a venue" onPick={add} />
      <VenueRows19 items={items} onOpen={onOpen} />
    </div>
  );
}


/* owner "company" (v16.12): the same section on the FF Staff Company profile,
   with its records in company.records and its own show/hide keys. */
function ProfileAttributeSection({ catKey, def, list, isMe, shade, onOpen, onAdd, owner, pub, top, moreTail, quiet, plus, hideZero }) {
  const { state, dispatch } = useStore();
  const items = isMe ? list : list.filter(r => !r.hidden && !r.proposed);
  if (!isMe && !items.length) return null;
  /* Work locations are the ticked places (one record each): the count and the public chips read them in the tree's order. */
  const covSrc = owner === "company" ? (state.company || {}) : (isMe || list === recsOf(state.profile, "locations")) ? state.profile : {};
  const locOwner = catKey === "locations" ? { records: { locations: items }, coverage17: covSrc.coverage17 } : null;
  const vkey = owner === "company" ? `co_${catKey}` : `attr_${catKey}`;
  const v = state.categoryVisibility[vkey];
  /* v1.2: on your own profile every section starts closed except Professions. */
  const startOpen = owner === "company" ? false : (isMe ? catKey === "professions" : (catKey === "professions" || (items.length > 0 && state.role !== "staff")));
  /* Editing: while the profile is being built, or after "Edit profile". */
  const savedOnce = state.auth.status === "signedIn" && (!!state.profile.finishedAt || !!state.profile.live);
  const editing = isMe && owner !== "company" && EDIT_CATS.includes(catKey) && (!savedOnce || !!(state.profileEdit && state.profileEdit.on));
  const ekey = `edit_${vkey}`;
  const ev = editing ? state.categoryVisibility[ekey] : undefined;
  /* v17.21: in the builder the type-box sections have no drop-down — they are always open. */
  /* v17.40: the builder's boxes are collapsible again, closed by default; Professions stays open. */
  const always = editing && catKey === "professions";
  const open = always || (editing ? (ev === undefined ? catKey === "professions" : ev !== false) : (v === undefined ? startOpen : v !== false));
  const unresolved = isMe && catKey === "professions" ? items.find(r => !r.proposed && !r.hidden && !professionCategory(r.name, r.displayCategory)) : null;
  /* Phase 1: Professions are added from Pick your professions (typing one
     creates its card), so that section has no separate Add square. */
  const addTile = isMe && !def.system && catKey !== "professions" && catKey !== "experience" && catKey !== "venues" && (
    <button className="ff-card ff-addtile" aria-label={`Add ${def.singular.toLowerCase()}`} onClick={onAdd}
      style={def.landscape ? { width: CARD_W.venue, aspectRatio: "7 / 5" } : { width: CARD_W.info, aspectRatio: "1 / 1", borderRadius: 22 }}>
      <span style={{ textAlign: "center" }}>
        <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, margin: "0 auto", border: "1px solid var(--gold-dk)", borderRadius: 12 }}><Plus size={20} color="var(--gold-dk)" /></span>
        <span className="ff-label" style={{ display: "block", marginTop: 8 }}>Add {def.singular.toLowerCase()}</span>
      </span>
    </button>
  );
  return (
    <section id={isMe ? (owner === "company" ? `ff-co-${catKey}` : `ff-sec-${catKey}`) : undefined} style={{ marginTop: 22 }}>
      <SectionHead icon={<CatIcon kind={def.icon} size={15} color="var(--gold-dk)" />} title={def.label} count={(n => hideZero && !n ? undefined : n)(locOwner ? covPlaces17(locOwner).length : items.filter(r => !r.hidden).length)}
        action={plus ? <span className="ff-co17-acts">
          <button type="button" className="ff-co17-plus" aria-label={`Add to ${def.label}`} onClick={() => { dispatch({ type: "TOGGLE_CATEGORY", key: vkey, visible: true }); plus(); }}><Plus size={14} /></button>
          <CategoryToggle sectionKey={vkey} defaultOpen={startOpen} /></span>
          : always ? null
          : editing
          ? <CategoryToggle sectionKey={ekey} defaultOpen={catKey === "professions"} />
          : <CategoryToggle sectionKey={vkey} defaultOpen={startOpen} />} />
      {quiet && !open ? <p className="ff-co17-quiet">{quiet}</p> : null}
      {open && (<>
        {top || null}
        {unresolved && (
          <div className="ff-frame" style={{ padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 8 }}>
              <Coin size={22} tier="gold" />
              <span className="ff-body" style={{ fontSize: 13 }}><b>FireFlair:</b> which category is “{unresolved.name}”? It decides where you appear on Network.</span>
            </div>
            <div className="ff-pk21-cats wrap">
              {CATEGORY_ORDER.map(k => (
                <button key={k} type="button" className="ff-pk21-cat" onClick={() => {
                  dispatch({ type: "REC_PATCH", category: "professions", id: unresolved.id, patch: { displayCategory: k } });
                  dispatch({ type: "TOAST", toast: `${unresolved.name} → ${k}` });
                }}>{k}</button>
              ))}
            </div>
          </div>
        )}
        {isMe && catKey === "locations" && <CoverageTree17 owner={owner} />}
        {catKey === "locations" ? (isMe ? null : <AreasChips17 owner={locOwner} />) : catKey === "venues" && isMe && owner !== "company" ? (
          <VenuesEditor19 items={items} onOpen={(r) => onOpen(r)} />
        ) : isMe && owner !== "company" && catKey === "professions" ? (<>
          <ProfessionPicker selected={items.map(r => r.name)} onPick={(n, category) => {
            if (items.some(r => r.name.toLowerCase() === n.toLowerCase())) { dispatch({ type: "TOAST", toast: `${n} is already on your profile` }); return; }
            /* source of the profession: "approved" = on the FireFlair list, "user" = typed by the member (kept with the category they chose). */
            const approved = ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n.toLowerCase());
            const fresh = makeRecord("professions", n, { professionSource: approved ? "approved" : "user", ...(category ? { displayCategory: category } : {}) });
            dispatch({ type: "RECORDS_MERGE", byCategory: { professions: [fresh] } });
            dispatch({ type: "TOAST", toast: `${n} added` });
          }} />
          <ProfTiles21 items={items} editable def={def} compact />
        </>) : isMe && owner !== "company" && RANK_CATS19.includes(catKey) ? (
          <div className="ff-pa40-cat">
            <style>{RANK_CSS17}</style>
            <TypeBox21 catKey={catKey} def={def} rows={rankedRecords(items || [])} />
            <ProfTiles21 items={items} editable def={def} catKey={catKey} label={def.label} compact />
          </div>
        ) : (
          pub && !isMe ? <PubGrid catKey={catKey} def={def} items={items} shade={shade} onOpen={onOpen} /> : (
          <HorizontalCardRanker items={items} label={def.label}
            renderCard={(r, rank) => <GenericAttributeCard record={r} def={def} themeKey={shade} rank={rank} editable={isMe && !def.system} onClick={() => onOpen(r)} />}
            tail={moreTail ? [React.cloneElement(addTile, { key: "add" }), React.cloneElement(moreTail, { key: "more" })] : addTile} />)
        )}
      </>)}
    </section>
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



function GenericAttributeCardCreator({ open, record, def, category, readOnly, onClose, owner, rank }) {
  const { state, dispatch: rawDispatch } = useStore();
  /* owner "company": the same editor writes to the Company profile's records. */
  const dispatch = (a) => rawDispatch(owner && /^REC_/.test(a.type) ? { ...a, owner } : a);
  const holder = owner === "company" ? (state.company || {}) : state.profile;
  const adding = !record;
  const [draft, setDraft] = useState(record);
  const [busy, setBusy] = useState(null);
  const mediaRef = useRef(null);
  const docRef = useRef(null);

  useEffect(() => { if (open) { setDraft(record || makeRecord(category, "")); setBusy(null); } }, [open, record && record.id, category]);
  if (!open || !def || !draft) return null;
  const live = adding ? draft : (recsOf(holder, category).find(r => r.id === record.id) || draft);

  const patch = (p) => {
    setDraft(d => ({ ...d, ...p }));
    if (!readOnly && !adding) dispatch({ type: "REC_PATCH", category, id: record.id, patch: p });
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

  const commit = () => {
    const rec = { ...draft, name: draft.name.trim(), description: (draft.description || "").trim() };
    const taskId = xpTaskFor(category);
    const fresh = !owner && XP_TASKS.some(t => t.id === taskId) && !(state.profile.xpClaimed || []).includes(taskId);
    dispatch({ type: "REC_ADD", category, record: rec });
    /* v17.18: a card added from the plus in a box goes into that box. */
    if (rank && !owner) dispatch({ type: "PE_MOVE", category, id: rec.id, rank, index: 0 });
    dispatch({ type: "TOAST", toast: `${def.singular} added${fresh ? xpNote(XP_VALUES.task) : ""}` });
    onClose();
  };

  const doc = draft.document;
  const one = def.singular.toLowerCase();
  const maxMedia = def.maxMedia || MAX_MEDIA_PER_CARD;

  return (
    <Sheet open onClose={onClose} title={adding ? `Add ${one}` : def.singular}>
      {adding && category === "languages" && (
        <LanguagePicker selected={[draft.name, ...recsOf(holder, "languages").map(r => r.name)]} onPick={(n) => patch({ name: n })} />
      )}
      {adding && category === "professions" && (
        <ProfessionPicker title="Suggested professions" selected={[draft.name, ...recsOf(state.profile, "professions").map(r => r.name)]}
          onPick={(n, category) => patch({ name: n, professionSource: ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n.toLowerCase()) ? "approved" : "user", ...(category ? { displayCategory: category } : {}) })} />
      )}

      <Field label={def.titleLabel || "Title"}>
        {readOnly
          ? <div className="ff-display" style={{ fontSize: 17 }}>{draft.name}</div>
          : category === "venues"
          ? <VenueSearch17 value={draft.name} label={def.titleLabel} autoFocus={FF_FINE_POINTER && adding} onPick={(p) => patch(p)} />
          : <input className="ff-input" style={{ fontSize: 17 }} value={draft.name} autoFocus={FF_FINE_POINTER && (adding && category !== "professions")}
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

      {/* Remote work for this profession: independent of the areas covered */}
      {category === "professions" && !readOnly && owner !== "company" && !adding && (
        <label className="ff-remote17" style={{ display: "flex", alignItems: "center", gap: 10, minHeight: 44, margin: "0 0 14px", cursor: "pointer", fontSize: 14.5, color: "#16130F" }}>
          <input type="checkbox" checked={!!live.remote} onChange={(e) => patch({ remote: e.target.checked })} style={{ width: 20, height: 20, accentColor: "#5C1220", flex: "none" }} />
          <span>Available for remote work</span>
        </label>
      )}

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

      {catHas(def, "proficiency") && (
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
          : <textarea className="ff-input" rows={5} value={draft.description || ""} placeholder={def.descPlaceholder || undefined}
              onChange={(e) => patch({ description: e.target.value })} />}
      </Field>
      )}

      <div style={{ marginBottom: 16 }}>
        <div className="ff-label" style={{ marginBottom: 4 }}>Images and documents</div>
        {!readOnly && owner !== "company" && <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>Add up to {maxMedia} images. They show under the card's title, in place of the description.</p>}
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
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input ref={mediaRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { addMedia(e.target.files?.[0]); e.target.value = ""; }} />
            <input ref={docRef} type="file" accept=".pdf,.doc,.docx,.txt,application/pdf" style={{ display: "none" }}
              onChange={(e) => { addDoc(e.target.files?.[0]); e.target.value = ""; }} />
            <Btn variant="sm" disabled={(draft.media || []).length >= maxMedia} onClick={() => mediaRef.current?.click()}><Camera size={12} /> Image {(draft.media || []).length}/{maxMedia}</Btn>
            <Btn variant="sm" onClick={() => docRef.current?.click()}><FileText size={12} /> {doc ? "Replace document" : "Document"}</Btn>
          </div>
        )}
      </div>

      {!adding && !readOnly && category === "professions" && (
        <Field label="Display category">
          <select className="ff-input" value={professionCategory(draft.name, draft.displayCategory) || ""}
            onChange={(e) => patch({ displayCategory: e.target.value || undefined })}>
            <option value="">Not sure yet</option>
            {CATEGORY_ORDER.map(k => <option key={k} value={k}>{k}</option>)}
          </select>
        </Field>
      )}

      {busy && <p className="ff-body ff-muted" style={{ fontSize: 12 }}>{busy}</p>}

      {!readOnly && adding && (
        <Btn variant="primary wide" disabled={!draft.name.trim()} onClick={commit}><Plus size={14} /> Add {one}</Btn>
      )}
      {!readOnly && !adding && !draft.proposed && (<>
        <Btn variant="primary wide" disabled={!draft.name.trim()} onClick={onClose}><Check size={14} /> Update {one}</Btn>
        {owner === "company" && !live.hidden && (
          <div className="ff-co-shift17" role="group" aria-label="Order">
            <button type="button" aria-label="Move earlier" onClick={() => dispatch({ type: "REC_SHIFT", category, id: record.id, dir: -1 })}><ChevronLeft size={15} /> Earlier</button>
            <button type="button" aria-label="Move later" onClick={() => dispatch({ type: "REC_SHIFT", category, id: record.id, dir: 1 })}>Later <ChevronRight size={15} /></button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
          <button className="ff-btn sm ghost" onClick={() => { patch({ hidden: !live.hidden }); dispatch({ type: "TOAST", toast: live.hidden ? `${draft.name} shown again` : `${draft.name} hidden — still on your profile` }); }}>
            {live.hidden ? <><Eye size={12} /> Show {one}</> : <><EyeOff size={12} /> Hide {one}</>}
          </button>
          <button className="ff-link" style={{ fontSize: 11, color: "#5E574C", textDecoration: "underline", background: "none" }}
            onClick={() => { dispatch({ type: "REC_DELETE", category, id: record.id }); onClose(); }}>Delete</button>
        </div>
      </>)}
    </Sheet>
  );
}



/* ==========================================================================
   PROFILE PAGE — a collection of linked Information Cards.
   Every category the person has becomes a section; every record in it opens
   its own full card. This is the depth behind the Profile Card summary.
   ========================================================================== */


function ProfileSections({ person, isMe, hideQuestions, doneSlot }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [openRec, setOpenRec] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [addRank, setAddRank] = useState(null);
  const [btab, setBtab] = useState("overview");
  const [asking, setAsking] = useState(false);
  const shade = "onyx";

  const [editingAbout, setEditingAbout] = useState(false);
  const records = recordsForPerson(state, person);
  const cats = BASE_CATEGORIES;
  const aboutText = String(isMe ? (state.profile.about || "") : (person.about || "")).trim();
  const aboutSection = aboutText ? (
    <section id={isMe ? "ff-sec-about" : undefined} style={{ marginTop: 22 }}>
      <SectionHead icon={<User size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="About"
        action={isMe ? <button className="ff-btn sm ghost" onClick={() => setEditingAbout(true)}>Edit</button> : null} />
      <p className="ff-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.55, whiteSpace: "pre-wrap", color: "#2A2620" }}>{aboutText}</p>
    </section>
  ) : null;
  /* v17.14: Experience shows only where entries were already saved; new work history goes into Venues. */
  const order0 = categoryOrder().filter(k => !cats[k].system && (k !== "experience" || (records.experience || []).some(r => !r.hidden || isMe)));
  /* v17.19: Professions, About me, Qualifications, Skills, Interests, Work locations, Languages, Venues. */
  const ORDER19 = ["professions", "qualifications", "skills", "interests", "locations", "languages", "venues"];
  const order = [...ORDER19.filter(k => order0.includes(k)), ...order0.filter(k => !ORDER19.includes(k))];
  const reviewList = (records.reviews || []).filter(r => !hid17(state, "reviews", r.id));
  const reviewDef = cats.reviews || BASE_CATEGORIES.reviews;
  const pendingRequests = isMe
    ? state.reviewRequests.filter(r => r.aboutId === "me" && !state.reviews.some(rv => rv.aboutId === "me" && rv.byId === r.fromId))
    : [];
  const pendingCount = pendingRequests.length;
  const bTabs = isMe ? (() => {
    const td = teamTabData17(state, all, person);
    return [
      { key: "overview", label: "Overview" },
      { key: "services", label: "Bookings", count: servicesOf(state, person).length },
      { key: "teams", label: "Team", count: td.teams.length },
      { key: "reviews", label: "Reviews", count: reviewsOf(state, person).length },
    ];
  })() : [];

  /* Your own network shows on your profile whether you're editing it or
     viewing it as a guest. */
  const mine = person.id === "me" ? myNetwork(state, all) : null;
  const network = mine ? mine.list : all.filter(p => p.id !== person.id && p.id !== "me").slice(0, 6);
  const netOpen = isMe ? false : true;
  const revOpen = isMe ? false : reviewList.length > 0;

  const focusHandlers = {
    reviews: () => { setBtab("reviews"); dispatch({ type: "TOGGLE_CATEGORY", key: "reviews", visible: true }); setAsking(true); },
    questions: () => { setBtab("services"); dispatch({ type: "TOGGLE_CATEGORY", key: "questions", visible: true }); setTimeout(() => { const el = document.getElementById("ff-sec-questions"); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }, 200); },
  };
  order.forEach(k => { focusHandlers[k] = k === "locations" ? () => dispatch({ type: "TOGGLE_CATEGORY", key: "attr_locations", visible: true }) : () => setAddingTo(k); });
  useProfileFocus(focusHandlers, isMe);

  const renderCategorySection = (catKey) => (<React.Fragment key={catKey}>
    <ProfileAttributeSection catKey={catKey} def={cats[catKey]} list={records[catKey] || []} isMe={isMe} shade={shade}
      onOpen={(r) => setOpenRec({ record: r, def: cats[catKey], category: catKey })}
      onAdd={(rank) => { setAddRank(rank || null); setAddingTo(catKey); }} />
    {catKey === "professions" && isMe && <CreatorAboutMe />}
  </React.Fragment>);

  const networkSection = (
      <section style={{ marginTop: 26 }}>
        <SectionHead icon={<Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Network" count={network.length}
          action={
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CategoryToggle sectionKey="profile_network" defaultOpen={netOpen} />
            </span>
          } />
        {(state.categoryVisibility.profile_network === undefined ? netOpen : state.categoryVisibility.profile_network !== false) && (
        <HScroll label="Network" snap>
          {network.map(p => <NetworkTile key={p.id} person={p} invited={!!(mine && mine.inviter && mine.inviter.id === p.id)} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
          {isMe && (
            <button className="ff-card ff-portrait ff-addtile" style={{ width: CARD_W.player }} onClick={() => dispatch({ type: "TAB", tab: "network" })}>
              <span style={{ textAlign: "center" }}><Plus size={20} color="var(--gold-dk)" />
                <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Add people</span></span>
            </button>
          )}
        </HScroll>
        )}
      </section>
  );
  const reviewsSection = (
      <section id={isMe ? "ff-sec-reviews" : undefined} style={{ marginTop: 22 }}>
        <SectionHead icon={<CatIcon kind="reviews" size={15} color="var(--gold-dk)" />} title="Reviews & References" count={reviewList.length}
          action={
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CategoryToggle sectionKey="reviews" defaultOpen={revOpen} />
            </span>
          } />
        {(state.categoryVisibility.reviews === undefined ? !revOpen : state.categoryVisibility.reviews === false) ? null : (reviewList.length || (isMe && pendingCount > 0)) ? (
          <ReviewCards35 person={person} records={reviewList} onOpen={(r) => setOpenRec({ record: r, def: reviewDef, category: "reviews" })}>
            {isMe && pendingRequests.map(req => (
              <div key={req.id} className="ff-tile" style={{ justifyContent: "center", alignItems: "center", textAlign: "center", gap: 6 }}>
                <Clock size={18} color="var(--gold-dk)" strokeWidth={1.5} />
                <span className="ff-serif" style={{ fontSize: 13, fontStyle: "normal" }}>Waiting on {req.fromName}</span>
              </div>
            ))}
            {isMe && (
              <button className="ff-card ff-addtile" onClick={() => setAsking(true)}>
                <span style={{ textAlign: "center" }}><Plus size={20} color="var(--gold-dk)" />
                  <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Ask for a review</span></span>
              </button>
            )}
          </ReviewCards35>
        ) : isMe ? (
          <button className="ff-card ff-addtile" style={{ width: CARD_W.info, minHeight: 140 }} onClick={() => setAsking(true)}>
            <span style={{ textAlign: "center" }}><Plus size={20} color="var(--gold-dk)" />
              <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Ask for a review</span></span>
          </button>
        ) : (
          <p className="ff-body ff-muted" style={{ margin: 0 }}>No reviews yet.</p>
        )}
      </section>
  );

  /* Someone else's profile leads with proof: their work (Media), who they
     work with (Network), what people say (Reviews), then Professions and
     the rest. Q&A is always last, then Book · Review · Join (PersonProfile).
     Your own profile keeps its editing order. */
  const restPublic = order.filter(k => k !== "media" && k !== "professions");
  /* v1.4: a visitor reads, in this order: professions and featured work,
     qualifications and skills, experience, locations and languages, interests
     and anything else, then network, reviews, Q&A. */
  const renderPub = (catKey) => order.includes(catKey) ? (
    <ProfileAttributeSection key={catKey} catKey={catKey} def={cats[catKey]} list={records[catKey] || []} isMe={false} shade={shade} pub
      onOpen={(r) => setOpenRec({ record: r, def: cats[catKey], category: catKey })} onAdd={() => {}} />
  ) : null;

  return (
    <>
      {isMe ? (<>
        <div id="ff-pe-anchor" style={{ scrollMarginTop: 84 }} />
        {/* v17.18: the builder has the same four tabs as the displayed profile. */}
        <div className="ff-ptabs-wrap ff-pa40">
          <ProfileTabs tabs={bTabs} active={btab} onChange={setBtab} />
          <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${btab}`} className="ff-tabpanel" tabIndex={0}>
            {btab === "overview" && (<>
              {order.filter(k => k !== "locations").map(renderCategorySection)}
            </>)}
            {btab === "services" && (<>
              {/* v17.21: Packages is now Bookings, and Work locations live here. */}
              {order.includes("locations") && renderCategorySection("locations")}
              <section id="ff-sec-questions" style={{ marginTop: 4 }}>
                <SectionHead icon={<MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Q&A"
                  action={<CategoryToggle sectionKey="questions" defaultOpen={false} />} />
                {state.categoryVisibility.questions === true && (<>
                  <p className="ff-body" style={{ margin: "-2px 0 6px", fontSize: 13.5 }}>
                    Saved to your profile — if anyone asks, FireFlair answers from what you've told it here.
                  </p>
                  <QuestionCardsCollection />
                </>)}
              </section>
              <Creators17 kind="team" by={person.name} />
              <TermsRow17 />
            </>)}
            {btab === "teams" && (<>
              <ProfileSocial11 isMe />
              <div style={{ marginTop: 22 }}><TeamTab17 person={person} /></div>
            </>)}
            {btab === "reviews" && (<>
              {reviewsSection}
            </>)}
          </div>
        </div>
      </>) : (
        <div className="ff-pub">
          {PUB_ORDER.map(renderPub)}
          {order.filter(k => !PUB_ORDER.includes(k)).map(renderPub)}
          <ProfileSocial11 person={person} />
          {doneSlot ? (<>
            {!hideQuestions && <PublicQA person={person} />}
            {doneSlot}
            {networkSection}
            {reviewsSection}
          </>) : (<>
          {networkSection}
          {reviewsSection}
          {!hideQuestions && <PublicQA person={person} />}
          </>)}
        </div>
      )}

      <GenericAttributeCardCreator open={!!openRec} record={openRec?.record} def={openRec?.def} category={openRec?.category}
        readOnly={!isMe || !!openRec?.record?.readOnly} onClose={() => setOpenRec(null)} />
      <GenericAttributeCardCreator open={!!addingTo} record={null} category={addingTo} def={addingTo ? cats[addingTo] : null} rank={addRank}
        onClose={() => { setAddingTo(null); setAddRank(null); }} />
      <AskForReviewSheet open={asking} onClose={() => setAsking(false)} />
      <AboutSheet open={editingAbout} onClose={() => setEditingAbout(false)} />
    </>
  );
}


function AboutSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [text, setText] = useState("");
  useEffect(() => {
    if (open)
      setText(state.profile.about || "");
  }, [open]);
  if (!open)
    return null;
  const save = () => {
    dispatch({ type: "PROFILE", patch: { about: text.trim() } });
    dispatch({ type: "TOAST", toast: text.trim() ? "About saved" : "About removed" });
    onClose();
  };
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: "About"
  }, React.createElement(Field, {
    label: "About you"
  }, React.createElement("textarea", {
    className: "ff-input",
    rows: 6,
    autoFocus: FF_FINE_POINTER && (true),
    value: text,
    onChange: (e) => setText(e.target.value),
    style: { resize: "vertical" }
  })), React.createElement(Btn, {
    variant: "primary wide",
    onClick: save
  }, React.createElement(Check, {
    size: 14
  }), " Save"));
}
