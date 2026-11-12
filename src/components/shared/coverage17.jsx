/* src/components/shared/coverage17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COVERAGE (v17.4.6) — one UK location tree for FF Team, FF Staff and FF Party.

   Data: the Front Door catalogue (FD_NODES, built from src/content/data/fd-rows.json; ids are
   GeoNames "gn:<id>" or "country:XX"). Coverage is stored by stable location id:
     owner.records.locations[].locId   the places the owner ticked (what the public sees)
     owner.coverage17 = { v: 2, inc: [ids], exc: [ids], updatedAt }
   A place is covered when the nearest ticked-or-excluded place at or above it is ticked.
   Ticking London covers every borough and neighbourhood beneath it; unticking Camden then adds
   Camden to exc, and London shows as partly selected. Ticking a partly selected place clears the
   exceptions beneath it. Expanding a branch and selecting it are separate controls.
   The postcode (state.workPostcode) is private: it opens and suggests branches, nothing more.
   The same tree, in "links" mode, is Explore by area: every place is a link to its area page.
   ========================================================================== */
const covIdOfName17 = (name) => { const n = fdTickNode19(name); return n ? n.id : null; };


/* Effective coverage of an owner (profile or company). */
function covOf17(owner) {
  const recs = ((owner && owner.records) || {}).locations || [];
  const c = (owner && owner.coverage17) || {};
  const inc = new Set();
  recs.forEach(r => { if (r.hidden || r.proposed) return; const id = r.locId || covIdOfName17(r.name); if (id && FD_BY_ID[id]) inc.add(id); });
  const exc = new Set((c.exc || []).filter(id => FD_BY_ID[id]));
  return { inc, exc };
}


/* Is this place covered? The nearest marked place at or above it decides. */
function covOn17(cov, n) {
  for (const a of fdAnc(n)) { if (cov.exc.has(a.id)) return false; if (cov.inc.has(a.id)) return true; }
  return false;
}


/* Some place beneath n differs from n (shown as partly selected). */
function covPartial17(cov, n) {
  const on = covOn17(cov, n);
  for (const id of [...cov.inc, ...cov.exc]) {
    if (id === n.id) continue;
    const m = FD_BY_ID[id];
    if (m && fdUnder(m, n.id) && covOn17(cov, m) !== on) return true;
  }
  return false;
}


/* Tick or untick one place. Returns a new { inc, exc }. */
function covToggle17(cov, n) {
  const want = covPartial17(cov, n) ? true : !covOn17(cov, n);
  const inc = new Set(cov.inc), exc = new Set(cov.exc);
  [...inc, ...exc].forEach(id => { const m = FD_BY_ID[id]; if (m && (id === n.id || fdUnder(m, n.id))) { inc.delete(id); exc.delete(id); } });
  const inherited = covOn17({ inc, exc }, n);
  if (inherited !== want) (want ? inc : exc).add(n.id);
  return { inc, exc };
}


/* Coverage in the Front Door matching shape: whole = ticked places, exc = exceptions. */
const covForFd17 = (owner) => { const c = covOf17(owner); return { whole: [...c.inc], sub: [], exc: [...c.exc] }; };


/* Short public text: "Greater London (not Camden), St Albans". */
function covText17(owner, max) {
  const c = covOf17(owner);
  const parts = [...c.inc].map(id => FD_BY_ID[id]).filter(Boolean).map(n => {
    const ex = [...c.exc].map(id => FD_BY_ID[id]).filter(m => m && fdUnder(m, n.id));
    return FD_TICK_NAME19(n) + (ex.length ? ` (not ${ex.slice(0, 2).map(m => m.name).join(", ")}${ex.length > 2 ? ` and ${ex.length - 2} more` : ""})` : "");
  });
  return max && parts.length > max ? parts.slice(0, max).join(", ") + ` and ${parts.length - max} more` : parts.join(", ");
}


/* Store side. COV_SET { owner: "company" | undefined, inc, exc } rewrites the location records for
   the ticked places (existing records keep their id, rank, description and media; free-text places
   that are not in the catalogue are kept as they are) and stores the exceptions. */
function cov17Reducer(s, a) {
  if (a.type !== "COV_SET") return null;
  const co = a.owner === "company";
  const owner = co ? (s.company || {}) : s.profile;
  const recs = ((owner.records || {}).locations) || [];
  const inc = [...a.inc].filter(id => FD_BY_ID[id]);
  const keep = recs.filter(r => { const id = r.locId || covIdOfName17(r.name); return !id || inc.includes(id) || r.proposed; })
    .map(r => r.locId || !covIdOfName17(r.name) ? r : { ...r, locId: covIdOfName17(r.name) });
  const have = new Set(keep.map(r => r.locId).filter(Boolean));
  const fresh = inc.filter(id => !have.has(id)).map(id => makeRecord("locations", FD_TICK_NAME19(FD_BY_ID[id]), { locId: id }));
  const list = addRanked(keep, fresh);
  const coverage17 = { v: 2, inc, exc: [...a.exc].filter(id => FD_BY_ID[id]), updatedAt: new Date().toISOString() };
  if (co) return { ...s, company: { ...owner, records: { ...(owner.records || {}), locations: list }, coverage17 } };
  return { ...s, profile: { ...s.profile, records: { ...(s.profile.records || {}), locations: list }, coverage17 } };
}


/* Older saved coverage (location records with names only) gets stable ids once. Names that match no
   catalogue place stay as they are and are shown, but are not used for area matching. */
function covMigrate17(s) {
  const fix = (owner) => {
    if (!owner || !owner.records || !(owner.records.locations || []).length) return owner;
    let changed = false;
    const locations = owner.records.locations.map(r => { if (r.locId) return r; const id = covIdOfName17(r.name); if (!id) return r; changed = true; return { ...r, locId: id }; });
    return changed || !owner.coverage17 ? { ...owner, records: { ...owner.records, locations }, coverage17: owner.coverage17 || { v: 2, inc: locations.map(r => r.locId).filter(Boolean), exc: [], updatedAt: null } } : owner;
  };
  const profile = fix(s.profile), company = fix(s.company);
  return profile === s.profile && company === s.company ? s : { ...s, profile, company };
}


/* ---- The tree -------------------------------------------------------------------------------------- */
const COV17_CSS = `
.ff .ff-cov17{padding:14px;margin-top:14px}
.ff .ff-cov17 h3{margin:0 0 8px;font-size:15px}
.ff .ff-cov17-box{list-style:none;margin:0;padding:0;max-height:360px;overflow:auto;border-top:1px solid var(--line,#e5dcc8);padding-top:6px;overscroll-behavior:contain}
.ff .ff-cov17-ul{list-style:none;margin:0;padding:0}
.ff .ff-cov17-row{display:flex;align-items:center;gap:4px;min-height:40px}
.ff .ff-cov17-x{width:36px;height:36px;flex:none;border:0;background:none;color:var(--gold-dk);cursor:pointer;border-radius:10px;corner-shape:squircle;display:grid;place-items:center}
.ff .ff-cov17-x svg{transition:transform .15s}
.ff .ff-cov17-x[aria-expanded=true] svg{transform:rotate(90deg)}
.ff .ff-cov17-lb{display:flex;align-items:center;gap:10px;flex:1;min-width:0;cursor:pointer;font-size:14.5px;overflow-wrap:normal;word-break:normal}
.ff .ff-cov17-lb input{width:20px;height:20px;flex:none;accent-color:var(--gold-dk)}
.ff .ff-cov17-lb small{color:#7A7366;font-size:12px}
.ff .ff-cov17-a{flex:1;min-width:0;font-size:14.5px;color:#16130F;text-decoration:none;font-weight:600;padding:8px 0}
.ff .ff-cov17-a:hover{text-decoration:underline}
.ff .ff-cov17-pc{display:flex;gap:8px;margin:0 0 10px}
.ff .ff-cov17-pc input,.ff .ff-cov17-q input{flex:1;min-width:0;font-size:16px;padding:10px 12px;border:1px solid var(--rule,#d8ccb0);border-radius:12px;corner-shape:squircle;background:#fff}
.ff .ff-cov17-q{display:flex;align-items:center;gap:8px;margin:0 0 8px}
.ff .ff-cov17-sug{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}
.ff .ff-cov17-msg{font-size:13px;margin:0 0 8px;color:#5C1220}
.ff .ff-cov17-hits{list-style:none;margin:0 0 8px;padding:0}
.ff .ff-cov17-sum{font-size:13px;margin:8px 0 0;color:#3A342B}
`;


/* Roots of the tree: the UK first, then the rest of the world. */
const covRoots17 = () => [FD_BY_ID["country:GB"], FD_BY_ID["worldwide"]].filter(Boolean);


const covKids17 = (n) => fdTickKids19(n);


function CovCheck17({ n, cov, onToggle, label }) {
  const ref = useRef(null);
  const on = covOn17(cov, n), part = covPartial17(cov, n);
  useEffect(() => { if (ref.current) ref.current.indeterminate = part; });
  return (
    <label className="ff-cov17-lb">
      <input ref={ref} type="checkbox" checked={on && !part} aria-checked={part ? "mixed" : on} onChange={() => onToggle(n)} />
      <span>{label || (n.id === "country:GB" ? "United Kingdom" : n.name)}</span>
    </label>
  );
}


/* The tree can sit inside parents that rebuild their children on every change (the Profile Card editor's
   rows), so what is open, typed and suggested is kept per tree here and survives a remount. */
const COV17_MEMO = {};


function useCovState17(key, name, init) {
  const box = COV17_MEMO[key] || (COV17_MEMO[key] = {});
  const [v, setV] = useState(() => (name in box ? box[name] : (typeof init === "function" ? init() : init)));
  const set = (x) => { const cur = name in box ? box[name] : v; const next = typeof x === "function" ? x(cur) : x; box[name] = next; setV(next); };
  return [v, set];
}


/* mode "select": tick boxes (FF Team work areas, FF Staff company coverage).
   mode "links":  every place is a link to its area page (Explore by area). */
function CoverageTree17({ mode = "select", owner: ownerKind, siteKey, compact, title, onOpen, startOpen }) {
  const { state, dispatch } = useStore();
  const co = ownerKind === "company";
  const owner = co ? (state.company || {}) : state.profile;
  const cov = covOf17(owner);
  const links = mode === "links";
  const sk = siteKey || fdSiteKey(state);
  const mk = `${mode}|${ownerKind || "profile"}|${compact ? "c" : "f"}|${sk}`;
  const [openIds, setOpenIds] = useCovState17(mk, "open", () => Object.fromEntries((startOpen || []).map(id => [id, true])));
  const [pc, setPc] = useCovState17(mk, "pc", "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useCovState17(mk, "msg", "");
  const [sug, setSug] = useCovState17(mk, "sug", []);
  const [q, setQ] = useCovState17(mk, "q", "");
  const hits = fdSearch(q);
  const toggle = (n) => { const next = covToggle17(cov, n); dispatch({ type: "COV_SET", owner: co ? "company" : undefined, inc: [...next.inc], exc: [...next.exc] }); };
  const openTo = (n) => { const o = { ...openIds }; fdAnc(n).slice(1).forEach(a => { o[a.id] = true; }); setOpenIds(o); };
  const setOpen = (id, v) => { setOpenIds(o => ({ ...o, [id]: v })); if (v && onOpen && FD_BY_ID[id]) onOpen(FD_BY_ID[id]); };
  const find = async () => {
    if (busy || !pc.trim()) return;
    setBusy(true); setMsg(""); setSug([]);
    const r = await LOCATION_ADAPTER.lookupPostcode(pc);
    setBusy(false);
    if (!r.ok) { setMsg(r.reason === "format" ? "That isn't a UK postcode." : "We couldn't look that postcode up. Search for your area instead."); return; }
    const near = covSuggest17(r);
    setSug(near);
    if (near[0]) openTo(near[0]);
    dispatch({ type: "V11_SET", patch: { workPostcode: { code: r.display, town: near[0] ? near[0].name : "", at: Date.now(), approx: !!r.approx } } });
  };
  const row = (n, depth) => {
    const kids = covKids17(n), isOpen = !!openIds[n.id];
    const x = kids.length ? (
      <button type="button" className="ff-cov17-x" aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${n.name}`}
        onClick={() => setOpen(n.id, !isOpen)}
        onKeyDown={(e) => { if (e.key === "ArrowRight" && !isOpen) { e.preventDefault(); setOpen(n.id, true); } if (e.key === "ArrowLeft" && isOpen) { e.preventDefault(); setOpen(n.id, false); } }}>
        <I11.ChevronRight size={16} />
      </button>) : <span className="ff-cov17-x" aria-hidden="true" />;
    return (
      <li key={n.id} role="treeitem" aria-expanded={kids.length ? isOpen : undefined} aria-level={depth + 1}>
        <div className="ff-cov17-row" style={{ paddingLeft: depth * 14 }}>
          {x}
          {links
            ? <a className="ff-cov17-a" href={fdHref(sk, n.path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, sk, n.path); }}>{n.id === "country:GB" ? "United Kingdom" : n.name}</a>
            : <CovCheck17 n={n} cov={cov} onToggle={toggle} />}
        </div>
        {isOpen && kids.length > 0 && <ul className="ff-cov17-ul" role="group">{kids.map(k => row(k, depth + 1))}</ul>}
      </li>
    );
  };
  const summary = !links && covText17(owner, 4);
  return (
    <div className={`ff-cov17${compact ? "" : " ff-frame"}`}>
      <style>{COV17_CSS}</style>
      {title !== null && <h3 className="ff-label">{title || (links ? "Explore by area" : "What areas do you cover?")}</h3>}
      {!links && !co && (
        <div className="ff-cov17-pc">
          <input value={pc} onChange={(e) => { setPc(e.target.value.toUpperCase().slice(0, 9)); setMsg(""); }} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); find(); } }}
            placeholder="Your postcode" aria-label="Your postcode (private)" autoComplete="postal-code" spellCheck={false} />
          <Btn variant="sm" onClick={find} disabled={busy || !pc.trim()}>{busy ? "Finding…" : "Find"}</Btn>
        </div>
      )}
      {msg && <p className="ff-cov17-msg" role="alert">{msg}</p>}
      {sug.length > 0 && (
        <div className="ff-cov17-sug" role="group" aria-label="Places near you">
          {sug.map(n => { const on = covOn17(cov, n); return <button key={n.id} type="button" className="ff-chip" aria-pressed={on} onClick={() => toggle(n)} style={on ? { background: "#5C1220", borderColor: "#5C1220", color: "#F6E7B4" } : undefined}>{on ? "✓ " : "+ "}{fdLabel(n)}</button>; })}
        </div>
      )}
      <label className="ff-cov17-q"><A17I.Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a town, borough or neighbourhood" aria-label="Search for a place" /></label>
      {q.trim().length >= 2 ? (
        <ul className="ff-cov17-hits" aria-label="Matching places">
          {hits.length ? hits.map(n => (
            <li key={n.id} className="ff-cov17-row">
              {links
                ? <a className="ff-cov17-a" href={fdHref(sk, n.path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, sk, n.path); }}>{fdLabel(n)} <small>{fdChain(n)}</small></a>
                : <CovCheck17 n={n} cov={cov} onToggle={(m) => { toggle(m); openTo(m); }} label={<>{fdLabel(n)} <small>{fdChain(n)}</small></>} />}
            </li>)) : <li className="ff-cov17-row">No matching place.</li>}
        </ul>
      ) : (
        <ul className="ff-cov17-box" role="tree" aria-label={links ? "Places" : "Areas you cover"}>{covRoots17().map(n => row(n, 0))}</ul>
      )}
      {summary ? <p className="ff-cov17-sum"><b>Shown on your profile:</b> {summary}</p> : null}
    </div>
  );
}


/* Nearest relevant branches for a postcode result: catalogue places named like its district, ward or
   parish first, then the closest towns and neighbourhoods within 25 km. */
function covSuggest17(r) {
  const out = [], seen = new Set();
  const add = (n) => { if (n && !seen.has(n.id)) { seen.add(n.id); out.push(n); } };
  (r.names || []).forEach(nm => { const low = String(nm || "").toLowerCase(); FD_NODES.filter(n => n.uk && n.name.toLowerCase() === low).forEach(add); });
  if (r.lat != null && r.lng != null) {
    FD_NODES.filter(n => n.uk && n.lat != null && (n.k === "p" || n.k === "h" || n.k === "b"))
      .map(n => [fdHav(r.lat, r.lng, n.lat, n.lng), n]).filter(x => x[0] < 25).sort((a, b) => a[0] - b[0]).slice(0, 6).forEach(x => add(x[1]));
  }
  return out.slice(0, 8);
}
