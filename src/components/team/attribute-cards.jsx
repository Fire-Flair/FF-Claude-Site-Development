/* src/components/team/attribute-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Quick-pick: five suggested professions per display category (v1.6 §2).
   Anything else can be typed — "Add another profession". */
/* Phase 1: search as you type (as Griffy's ProfessionPickerPanel does against
   GET /user/professions?search=), across the 35 v1.6 professions, plus
   "Add" for anything else — FireFlair then asks for its category if the rules
   can't tell. Without a search it shows the category chips as before. */
const ALL_PROFESSIONS = PROFESSION_CATEGORIES.flatMap(c => c.suggested.map(n => ({ name: n, cat: c.key })));


function ProfessionPicker({ selected = [], onPick, title = "Pick your professions" }) {
  const [cat, setCat] = useState(PROFESSION_CATEGORIES[0].key);
  const [q, setQ] = useState("");
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
  const pick = (name) => { onPick(name); setQ(""); };
  const picked = (name) => has(name) ? { background: "#5C1220", borderColor: "#5C1220", color: "#F6E7B4" } : undefined;
  return (
    <div className="ff-frame ff-goldpick" style={{ padding: 14, marginTop: 14 }}>
      <div className="ff-label" style={{ marginBottom: 8 }}>{title}</div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={15} color="#7A7366" style={{ position: "absolute", left: 11, top: 13 }} />
        <input className="ff-input" type="search" value={q} style={{ paddingLeft: 34 }} autoComplete="off" spellCheck={false}
          onChange={(e) => setQ(e.target.value)} placeholder="Search or type a profession" aria-label="Search or type a profession"
          onKeyDown={(e) => { if (e.key === "Enter" && n) { e.preventDefault(); pick(hits[0] ? hits[0].name : typed); } }} />
      </div>
      {n ? (
        <div role="list" aria-label="Matching professions">
          {hits.map(p => (
            <button key={p.name} type="button" role="listitem" className="ff-chip" onClick={() => pick(p.name)} style={picked(p.name)}>
              {has(p.name) ? "✓ " : "+ "}{p.name}<span className="ff-chipcat">{p.cat}</span>
            </button>
          ))}
          {custom && (
            <button type="button" className="ff-chip ff-chip-custom" onClick={() => pick(custom)}>
              + Add “{custom}”{customCat && <span className="ff-chipcat">{customCat}</span>}
            </button>
          )}
          {custom && !customCat && <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "4px 0 0" }}>FireFlair will ask which category “{custom}” belongs to.</p>}
        </div>
      ) : (<>
        <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 6, scrollbarWidth: "none" }}>
          {PROFESSION_CATEGORIES.map(x => (
            <button key={x.key} className="ff-chip" onClick={() => setCat(x.key)} aria-pressed={x.key === cat}
              style={{ whiteSpace: "nowrap", margin: 0, flex: "none", ...(x.key === cat ? { background: "#141416", color: "#EAD79C", borderColor: "#141416" } : {}) }}>{x.key}</button>
          ))}
        </div>
        <div style={{ marginTop: 6 }}>
          {c.suggested.map(nm => (
            <button key={nm} className="ff-chip" onClick={() => pick(nm)} style={picked(nm)}>
              {has(nm) ? "✓ " : "+ "}{nm}
            </button>
          ))}
        </div>
      </>)}
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "6px 0 0" }}>
        Your first three show on your card.
      </p>
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



function VenueLandscapeCard({ record, onClick }) {
  const t = THEMES.onyx;
  const desc = (record.description || "").trim();
  return (
    <CardFrame as={onClick ? "button" : "div"} tier="standard" theme={t} ratio="7 / 5" onClick={onClick}
      style={{ width: CARD_W.venue, padding: "26px 16px 12px", display: "flex", flexDirection: "column", textAlign: "left" }}>
      <span style={{ position: "absolute", top: 10, left: 15, fontSize: 8.5, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 700, color: t.sub, zIndex: 4 }}>Venue</span>
      <span style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1, minHeight: 0 }}>
        <span style={{ flex: 1, minWidth: 0 }}>
          <span style={{ display: "block", fontFamily: "var(--sans)", color: t.ink, fontSize: 15.5, fontWeight: 700, lineHeight: 1.25 }}>{record.name}</span>
          {desc && <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontFamily: "var(--sans)", color: t.ink, opacity: .82, fontSize: 13, marginTop: 6, lineHeight: 1.4 }}>{desc}</span>}
        </span>
        <span style={{ flex: "none", maxWidth: "42%", fontFamily: "var(--sans)", color: t.sub, fontWeight: 600, fontSize: 12.5, textAlign: "right", display: "flex", gap: 5, alignItems: "flex-start" }}>
          <MapPin size={12} strokeWidth={1.6} style={{ flex: "none", marginTop: 2 }} />{record.address || "—"}
        </span>
      </span>
      <span style={{ display: "flex", alignItems: "center", paddingTop: 7, borderTop: `1px solid ${t.rule}`, marginTop: 8 }}>
        <span className="ff-label" style={{ marginLeft: "auto", fontSize: 8, color: "#EAD79C" }}>View on Google Maps →</span>
      </span>
    </CardFrame>
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
    ? <VenueLandscapeCard record={record} onClick={onClick} />
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



/* owner "company" (v16.12): the same section on the FF Staff Company profile,
   with its records in company.records and its own show/hide keys. */
function ProfileAttributeSection({ catKey, def, list, isMe, shade, onOpen, onAdd, owner, pub }) {
  const { state, dispatch } = useStore();
  const items = isMe ? list : list.filter(r => !r.hidden && !r.proposed);
  if (!isMe && !items.length) return null;
  const vkey = owner === "company" ? `co_${catKey}` : `attr_${catKey}`;
  const v = state.categoryVisibility[vkey];
  /* v1.2: on your own profile every section starts closed except Professions. */
  const startOpen = owner === "company" ? false : (isMe ? catKey === "professions" : (catKey === "professions" || (items.length > 0 && state.role !== "staff")));
  /* Editing: while the profile is being built, or after "Edit profile". */
  const savedOnce = state.auth.status === "signedIn" && (!!state.profile.finishedAt || !!state.profile.live);
  const editing = isMe && owner !== "company" && EDIT_CATS.includes(catKey) && (!savedOnce || !!(state.profileEdit && state.profileEdit.on));
  const eRows = editing ? editRows(state.profile, catKey) : null;
  const ekey = `edit_${vkey}`;
  const ev = editing ? state.categoryVisibility[ekey] : undefined;
  const open = editing ? (ev === undefined ? catKey === "professions" : ev !== false) : (v === undefined ? startOpen : v !== false);
  const unresolved = isMe && catKey === "professions" ? items.find(r => !r.proposed && !r.hidden && !professionCategory(r.name, r.displayCategory)) : null;
  /* Phase 1: Professions are added from Pick your professions (typing one
     creates its card), so that section has no separate Add square. */
  const addTile = isMe && !def.system && catKey !== "professions" && (
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
      <SectionHead icon={<CatIcon kind={def.icon} size={15} color="var(--gold-dk)" />} title={def.label} count={editing ? eRows.filter(r => !r.rec.hidden).length : items.filter(r => !r.hidden).length}
        action={editing
          ? <CategoryToggle sectionKey={ekey} defaultOpen={catKey === "professions"} />
          : <CategoryToggle sectionKey={vkey} defaultOpen={startOpen} />} />
      {open && (<>
        {unresolved && (
          <div className="ff-frame" style={{ padding: 12, marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 9, alignItems: "center", marginBottom: 8 }}>
              <Coin size={22} tier="gold" />
              <span className="ff-body" style={{ fontSize: 13 }}><b>FireFlair:</b> which category is “{unresolved.name}”? It decides where you appear on Network.</span>
            </div>
            <div>
              {PROFESSION_CATEGORIES.map(c => (
                <button key={c.key} className="ff-chip" onClick={() => {
                  dispatch({ type: "REC_PATCH", category: "professions", id: unresolved.id, patch: { displayCategory: c.key } });
                  dispatch({ type: "TOAST", toast: `${unresolved.name} → ${c.key}` });
                }}>{c.key}</button>
              ))}
            </div>
          </div>
        )}
        {isMe && catKey === "professions" && (
          <ProfessionPicker selected={items.map(r => r.name)} onPick={(n) => {
            if (items.some(r => r.name.toLowerCase() === n.toLowerCase())) { dispatch({ type: "TOAST", toast: `${n} is already on your profile` }); return; }
            dispatch({ type: "RECORDS_MERGE", byCategory: { professions: [makeRecord("professions", n)] } });
            dispatch({ type: "TOAST", toast: `${n} added` });
          }} />
        )}
        {isMe && catKey === "locations" && <CoverageTree17 owner={owner} {...(owner === "company" ? { title: null, compact: true, startOpen: ["country:GB"] } : {})} />}
        <div style={{ height: isMe && (catKey === "professions" || catKey === "locations") && owner !== "company" ? 12 : 0 }} />
        {isMe && catKey === "locations" && owner === "company" ? null : editing ? (
          <TierEditor catKey={catKey} def={def} rows={eRows} onOpen={(r) => onOpen(r)} tail={addTile} />
        ) : (
          pub && !isMe ? <PubGrid catKey={catKey} def={def} items={items} shade={shade} onOpen={onOpen} /> : (
          <HorizontalCardRanker items={items} label={def.label}
            renderCard={(r, rank) => <GenericAttributeCard record={r} def={def} themeKey={shade} rank={rank} editable={isMe && !def.system} onClick={() => onOpen(r)} />}
            tail={addTile} />)
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
      {d.venues && d.venues.length > 0 && <div className="ff-body" style={{ fontSize: 13.5, marginTop: 4 }}>Venues: {d.venues.join(", ")}</div>}
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
      {d.venues !== undefined && (
        <label style={{ display: "block", marginTop: 8 }}><span className="ff-label" style={{ fontSize: 9 }}>Venues</span>
          <input className="ff-input" value={venues} onChange={(e) => setVenues(e.target.value)}
            onBlur={() => onChange({ ...d, venues: venues.split(",").map(x => x.trim()).filter(Boolean) })} /></label>
      )}
    </div>
  );
}



function GenericAttributeCardCreator({ open, record, def, category, readOnly, onClose, owner }) {
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
    if ((draft.media || []).length >= MAX_MEDIA_PER_CARD) { setBusy(`Each card holds up to ${MAX_MEDIA_PER_CARD} images.`); return; }
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
    dispatch({ type: "TOAST", toast: `${def.singular} added${fresh ? xpNote(XP_VALUES.task) : ""}` });
    onClose();
  };

  const doc = draft.document;
  const one = def.singular.toLowerCase();

  return (
    <Sheet open onClose={onClose} title={adding ? `Add ${one}` : def.singular}>
      {adding && category === "languages" && (
        <LanguagePicker selected={[draft.name, ...recsOf(holder, "languages").map(r => r.name)]} onPick={(n) => patch({ name: n })} />
      )}
      {adding && category === "professions" && (
        <ProfessionPicker title="Suggested professions" selected={[draft.name, ...recsOf(state.profile, "professions").map(r => r.name)]}
          onPick={(n) => patch({ name: n })} />
      )}

      <Field label="Title">
        {readOnly
          ? <div className="ff-display" style={{ fontSize: 17 }}>{draft.name}</div>
          : <input className="ff-input" style={{ fontSize: 17 }} value={draft.name} autoFocus={FF_FINE_POINTER && (adding && category !== "professions")}
              onChange={(e) => patch({ name: e.target.value })} placeholder={def.placeholder || def.singular} />}
      </Field>

      {draft.details && Object.keys(draft.details).some(k => k !== "type" && draft.details[k] && (!Array.isArray(draft.details[k]) || draft.details[k].length)) && (
        <RecordDetailsField details={draft.details} readOnly={readOnly} onChange={(d) => patch({ details: d })} />
      )}

      {draft.proposed && (
        <div className="ff-frame" style={{ padding: 12, marginBottom: 14 }}>
          <p className="ff-body" style={{ margin: "0 0 10px" }}>Proposed from your CV — nothing is on your profile until you accept it.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn variant="primary" onClick={() => { dispatch({ type: "REC_ACCEPT", category, id: record.id }); patch({ proposed: false }); }}>
              <Check size={13} /> Accept
            </Btn>
            <Btn variant="danger" onClick={() => { dispatch({ type: "REC_DELETE", category, id: record.id }); onClose(); }}>Reject</Btn>
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

      {catHas(def, "address") && (
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
      <Field label="Description">
        {readOnly
          ? <p className="ff-serif" style={{ fontSize: 16, lineHeight: 1.5, margin: 0 }}>{draft.description || "Nothing written yet."}</p>
          : <textarea className="ff-input" rows={5} value={draft.description || ""}
              onChange={(e) => patch({ description: e.target.value })} />}
      </Field>
      )}

      <div style={{ marginBottom: 16 }}>
        <div className="ff-label" style={{ marginBottom: 4 }}>Images and documents</div>
        {!readOnly && <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "0 0 8px" }}>Add up to {MAX_MEDIA_PER_CARD} images. They show under the card's title, in place of the description.</p>}
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
            <Btn variant="sm" disabled={(draft.media || []).length >= MAX_MEDIA_PER_CARD} onClick={() => mediaRef.current?.click()}><Camera size={12} /> Image {(draft.media || []).length}/{MAX_MEDIA_PER_CARD}</Btn>
            <Btn variant="sm" onClick={() => docRef.current?.click()}><FileText size={12} /> {doc ? "Replace document" : "Document"}</Btn>
          </div>
        )}
      </div>

      {!adding && !readOnly && category === "professions" && (
        <Field label="Display category">
          <select className="ff-input" value={professionCategory(draft.name, draft.displayCategory) || ""}
            onChange={(e) => patch({ displayCategory: e.target.value || undefined })}>
            <option value="">Not sure yet</option>
            {PROFESSION_CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.key}</option>)}
          </select>
        </Field>
      )}

      {busy && <p className="ff-body ff-muted" style={{ fontSize: 12 }}>{busy}</p>}

      {!readOnly && adding && (
        <Btn variant="primary wide" disabled={!draft.name.trim()} onClick={commit}><Plus size={14} /> Add {one}</Btn>
      )}
      {!readOnly && !adding && !draft.proposed && (<>
        <Btn variant="primary wide" disabled={!draft.name.trim()} onClick={onClose}><Check size={14} /> Update {one}</Btn>
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
  const order = categoryOrder().filter(k => !cats[k].system);
  const reviewList = (records.reviews || []).filter(r => !hid17(state, "reviews", r.id));
  const reviewDef = cats.reviews || BASE_CATEGORIES.reviews;
  const pendingRequests = isMe
    ? state.reviewRequests.filter(r => r.aboutId === "me" && !state.reviews.some(rv => rv.aboutId === "me" && rv.byId === r.fromId))
    : [];
  const pendingCount = pendingRequests.length;

  /* Your own network shows on your profile whether you're editing it or
     viewing it as a guest. */
  const mine = person.id === "me" ? myNetwork(state, all) : null;
  const network = mine ? mine.list : all.filter(p => p.id !== person.id && p.id !== "me").slice(0, 6);
  const netOpen = isMe ? false : true;
  const revOpen = isMe ? false : reviewList.length > 0;

  const focusHandlers = {
    reviews: () => { dispatch({ type: "TOGGLE_CATEGORY", key: "reviews", visible: true }); setAsking(true); },
    questions: () => dispatch({ type: "TOGGLE_CATEGORY", key: "questions", visible: true }),
  };
  order.forEach(k => { focusHandlers[k] = () => setAddingTo(k); });
  useProfileFocus(focusHandlers, isMe);

  const renderCategorySection = (catKey) => (
    <ProfileAttributeSection key={catKey} catKey={catKey} def={cats[catKey]} list={records[catKey] || []} isMe={isMe} shade={shade}
      onOpen={(r) => setOpenRec({ record: r, def: cats[catKey], category: catKey })}
      onAdd={() => setAddingTo(catKey)} />
  );

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
          <HScroll label="Reviews & References">
            {reviewList.map((r, i) => (
              <InformationCard key={r.id} record={r} def={reviewDef} themeKey={shade} highlight={i < 3}
                onClick={() => setOpenRec({ record: r, def: reviewDef, category: "reviews" })} />
            ))}
            {isMe && pendingRequests.map(req => (
              <div key={req.id} className="ff-tile" style={{ width: CARD_W.info, minHeight: 140, justifyContent: "center", alignItems: "center", textAlign: "center", gap: 6 }}>
                <Clock size={18} color="var(--gold-dk)" strokeWidth={1.5} />
                <span className="ff-serif" style={{ fontSize: 13, fontStyle: "normal" }}>Waiting on {req.fromName}</span>
              </div>
            ))}
            {isMe && (
              <button className="ff-card ff-addtile" style={{ width: CARD_W.info, minHeight: 140 }} onClick={() => setAsking(true)}>
                <span style={{ textAlign: "center" }}><Plus size={20} color="var(--gold-dk)" />
                  <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Ask for a review</span></span>
              </button>
            )}
          </HScroll>
        ) : isMe ? (
          <button className="ff-card ff-addtile" style={{ width: "100%", padding: 18 }} onClick={() => setAsking(true)}>
            <span style={{ textAlign: "center" }}><Plus size={18} color="var(--gold-dk)" />
              <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Ask someone you've worked with for a review</span></span>
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
        <ProfileEditHead />
        {order.map(renderCategorySection)}
        <ProfileSocial11 isMe />
        {networkSection}
        {reviewsSection}
        {isMe && <TermsRow17 />}
      {isMe && (
        <section id="ff-sec-questions" style={{ marginTop: 22 }}>
          <SectionHead icon={<MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Q&A"
            action={<CategoryToggle sectionKey="questions" defaultOpen={false} />} />
          {state.categoryVisibility.questions === true && (<>
            <p className="ff-body" style={{ margin: "-2px 0 6px", fontSize: 13.5 }}>
              Saved to your profile — if anyone asks, FireFlair answers from what you've told it here.
            </p>
            <QuestionCardsCollection />
          </>)}
        </section>
      )}
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
      <GenericAttributeCardCreator open={!!addingTo && addingTo !== "locations"} record={null} category={addingTo} def={addingTo ? cats[addingTo] : null}
        onClose={() => setAddingTo(null)} />
      <WorkLocationsSheet open={addingTo === "locations"} onClose={() => setAddingTo(null)} />
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
