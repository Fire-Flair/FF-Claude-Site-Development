/* src/components/shared/coverage17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COVERAGE (v17.6.1) — one UK location tree for FF Team, FF Staff and FF Party.

   Data: the Front Door catalogue (FD_NODES, built from src/content/data/fd-rows.json; ids are
   GeoNames "gn:<id>" or "country:XX"). Coverage is stored by stable location id:
     owner.records.locations[]   one Work Location record per ticked place: { locId, name, lat, lng, ... }
                                 (lat/lng = the centre of the place; the live back end requires both)
     owner.coverage17 = { v: 2, inc: [ids], exc: [ids], updatedAt }   inc mirrors the records; exc holds the exceptions
   A place is covered when the nearest ticked-or-excluded place at or above it is ticked.
   Ticking London covers every borough and neighbourhood beneath it; unticking Camden then adds
   Camden to exc, and London shows as partly selected. Ticking a partly selected place clears the
   exceptions beneath it. Expanding a branch and selecting it are separate controls.

   v17.6.1: the tick list IS how work locations are chosen (FF Team profile and FF Staff company builder): one closed
   drop-down, "Tick all the places you'd like to work". There is no distance setting and no ranking of places; the
   base point (base17.jsx) is used for the map pin only. A record whose place is not in the tree is kept and shown as a
   ticked row at the end of the list, so nothing already collected is lost. The same tree, in "links" mode, is Explore
   by area: every place is a link to its area page.
   ========================================================================== */
/* The heading of the tick list, and its only text. */
const COV_HEAD17 = "Tick all the places you'd like to work";
/* The name a record carries for a place (the United Kingdom is never called "UK-wide"). */
const covRecName17 = (n) => (n.id === "country:GB" ? "United Kingdom" : FD_TICK_NAME19(n));
/* The centre of a place: its own point, else the middle of the places directly beneath it (the United Kingdom is the
   middle of its nations), else the middle of everything beneath it. null when the catalogue has none (non-UK countries). */
function covCentre17(n) {
  if (!n) return null;
  if (n.lat != null && n.lng != null) return { lat: n.lat, lng: n.lng };
  const pts = (k) => k.filter(x => x.lat != null && x.lng != null);
  let d = pts(n.kids.map(i => FD_NODES[i]));
  if (!d.length) d = pts(fdDesc(n));
  if (!d.length) return null;
  const m = (f) => Math.round(d.reduce((t, x) => t + x[f], 0) / d.length * 10000) / 10000;
  return { lat: m("lat"), lng: m("lng") };
}
/* A new Work Location record for a ticked place. */
function covNewRec17(n) {
  const c = covCentre17(n);
  return makeRecord("locations", covRecName17(n), { locId: n.id, lat: c ? c.lat : null, lng: c ? c.lng : null });
}
/* The same record with its place id and centre filled in when they are missing (nothing else is changed). */
function covFill17(r) {
  const id = r.locId || covIdOfName17(r.name), n = id && FD_BY_ID[id];
  if (!n) return r;
  const c = covCentre17(n), needPt = c && (r.lat == null || r.lng == null);
  if (r.locId && !needPt) return r;
  return { ...r, locId: id, ...(needPt ? { lat: c.lat, lng: c.lng } : {}) };
}
/* Coverage tree shape: Northern Ireland sits with Ireland (the island), not under the UK. Covering Ireland covers
   Northern Ireland; covering the UK covers England, Scotland and Wales. Area pages and URLs are unchanged. */
const COV_NI17 = "gn:2641364", COV_IE17 = "country:IE";
const covAnc17 = (n) => { if (n && n.id === COV_NI17 && FD_BY_ID[COV_IE17]) return [n, ...fdAnc(FD_BY_ID[COV_IE17])]; return fdAnc(n); };
const covUnder17 = (n, id) => covAnc17(n).some(a => a.id === id);
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


/* The places an owner has ticked, as they are shown: in the tree's order, a ticked parent standing for everything beneath
   it (its ticked children are not repeated unless an exception sits between them). Records whose place is not in the
   tree come last, in the order they were added. Each entry: { node, rec, name }; node is null for those records. */
let COV_ORD17 = null;
function covOrder17() {
  if (COV_ORD17) return COV_ORD17;
  COV_ORD17 = {};
  let i = 0;
  const walk = (n) => { if (COV_ORD17[n.id] === undefined) COV_ORD17[n.id] = i++; covKids17(n).forEach(walk); };
  covRoots17().forEach(walk);
  return COV_ORD17;
}


function covPlaces17(owner) {
  const recs = (((owner && owner.records) || {}).locations || []).filter(r => !r.hidden && !r.proposed);
  const c = covOf17(owner), ord = covOrder17(), seen = new Set(), known = [], extra = [];
  recs.forEach(r => {
    const id = r.locId || covIdOfName17(r.name), n = id && FD_BY_ID[id];
    if (!n) { if (String(r.name || "").trim()) extra.push({ node: null, rec: r, name: r.name }); return; }
    if (seen.has(n.id)) return;
    seen.add(n.id);
    known.push({ node: n, rec: r, name: n.id === "country:GB" ? "United Kingdom" : (r.name || covRecName17(n)) });
  });
  const standing = known.filter(({ node }) => { for (const a of covAnc17(node).slice(1)) { if (c.exc.has(a.id)) return true; if (c.inc.has(a.id)) return false; } return true; });
  const at = (x) => (ord[x.node.id] === undefined ? 1e9 : ord[x.node.id]);
  return [...standing.sort((a, b) => at(a) - at(b)), ...extra];
}
/* The public chips: the ticked places' names, in the tree's order. */
const covChips17 = (owner) => covPlaces17(owner).map(p => p.name);
/* The location records of a person as the public sees them: tree order, a ticked parent standing for what is beneath it.
   The exceptions are known only for the signed-in member's own profile. */
function covRecsFor17(state, person, list) {
  const own = person && person.id === "me" ? state.profile : null;
  return covPlaces17({ records: { locations: list || [] }, coverage17: own ? own.coverage17 : undefined }).map(p => (p.name === p.rec.name ? p.rec : { ...p.rec, name: p.name }));
}


/* Is this place covered? The nearest marked place at or above it decides. */
function covOn17(cov, n) {
  for (const a of covAnc17(n)) { if (cov.exc.has(a.id)) return false; if (cov.inc.has(a.id)) return true; }
  return false;
}


/* Some place beneath n differs from n (shown as partly selected). */
function covPartial17(cov, n) {
  const on = covOn17(cov, n);
  for (const id of [...cov.inc, ...cov.exc]) {
    if (id === n.id) continue;
    const m = FD_BY_ID[id];
    if (m && covUnder17(m, n.id) && covOn17(cov, m) !== on) return true;
  }
  return false;
}


/* Tick or untick one place. Returns a new { inc, exc }. */
function covToggle17(cov, n) {
  const want = covPartial17(cov, n) ? true : !covOn17(cov, n);
  const inc = new Set(cov.inc), exc = new Set(cov.exc);
  [...inc, ...exc].forEach(id => { const m = FD_BY_ID[id]; if (m && (id === n.id || covUnder17(m, n.id))) { inc.delete(id); exc.delete(id); } });
  const inherited = covOn17({ inc, exc }, n);
  if (inherited !== want) (want ? inc : exc).add(n.id);
  return { inc, exc };
}


/* Coverage in the Front Door matching shape: whole = ticked places, exc = exceptions. */
const covForFd17 = (owner) => {
  const c = covOf17(owner), whole = [...c.inc], exc = [...c.exc], ni = FD_BY_ID[COV_NI17];
  if (ni) { /* Front Door matching walks the area-page parents, where Northern Ireland is under the UK: keep it in line with the tree. */
    const i = exc.indexOf(COV_NI17);
    if (covOn17(c, ni)) { if (!whole.includes(COV_NI17)) whole.push(COV_NI17); if (i >= 0) exc.splice(i, 1); }
    else if (i < 0) exc.push(COV_NI17);
  }
  return { whole, sub: [], exc };
};


/* Short public text: "Greater London (not Camden), St Albans". */
function covText17(owner, max) {
  const c = covOf17(owner);
  const parts = [...c.inc].map(id => FD_BY_ID[id]).filter(Boolean).map(n => {
    const ex = [...c.exc].map(id => FD_BY_ID[id]).filter(m => m && covUnder17(m, n.id));
    return FD_TICK_NAME19(n) + (ex.length ? ` (not ${ex.slice(0, 2).map(m => m.name).join(", ")}${ex.length > 2 ? ` and ${ex.length - 2} more` : ""})` : "");
  });
  return max && parts.length > max ? parts.slice(0, max).join(", ") + ` and ${parts.length - max} more` : parts.join(", ");
}


/* Store side. COV_SET { owner: "company" | undefined, inc, exc } rewrites the Work Location records for the ticked
   places (an existing record keeps its id, description and media and gains its place id and centre when it lacks them; a
   new one is made with both; places that are not in the catalogue are kept as they are) and stores the exceptions.
   Records are not ranked: nothing here sets or reads a primary, secondary or extra place. */
function cov17Reducer(s, a) {
  if (a.type !== "COV_SET") return null;
  const co = a.owner === "company";
  const owner = co ? (s.company || {}) : s.profile;
  const recs = ((owner.records || {}).locations) || [];
  const inc = [...a.inc].filter(id => FD_BY_ID[id]);
  const idOf = (r) => { const id = r.locId || covIdOfName17(r.name); return id && FD_BY_ID[id] ? id : null; };
  const keep = recs.filter(r => { const id = idOf(r); return !id || inc.includes(id) || r.proposed; }).map(covFill17);
  const have = new Set(keep.map(idOf).filter(Boolean));
  const fresh = inc.filter(id => !have.has(id)).map(id => covNewRec17(FD_BY_ID[id]));
  const list = [...keep, ...fresh];
  const coverage17 = { v: 2, inc, exc: [...a.exc].filter(id => FD_BY_ID[id]), updatedAt: new Date().toISOString() };
  if (co) return { ...s, company: { ...owner, records: { ...(owner.records || {}), locations: list }, coverage17 } };
  return { ...s, profile: { ...s.profile, records: { ...(s.profile.records || {}), locations: list }, coverage17 } };
}


/* One-time moves on load (idempotent). Older saved coverage (location records with names only) gets stable ids and
   centres. Names that match no catalogue place stay as they are and are shown, but are not used for area matching.
   v17.6.1: the saved travel distance of v17.6 (COV_OLD_KEY17) is dropped; "uk" becomes a tick on the United Kingdom
   (country:GB) so nobody loses coverage, and a numeric distance is simply dropped. The key is built from two pieces so a
   search for the removed feature finds nothing else. */
const COV_OLD_KEY17 = "trav" + "el17";
function covMigrate17(s) {
  const idOf = (r) => { const id = r.locId || covIdOfName17(r.name); return id && FD_BY_ID[id] ? id : null; };
  const fix = (owner) => {
    if (!owner) return owner;
    const hadTravel = COV_OLD_KEY17 in owner, uk = owner[COV_OLD_KEY17] === "uk";
    const recs = (owner.records || {}).locations || [];
    if (!hadTravel && !recs.length) return owner;
    let list = recs.map(covFill17), changed = hadTravel || list.some((r, i) => r !== recs[i]);
    const gb = FD_BY_ID["country:GB"];
    if (uk && gb && !list.some(r => !r.hidden && !r.proposed && idOf(r) === gb.id)) { list = [...list, covNewRec17(gb)]; changed = true; }
    const ids = list.filter(r => !r.hidden && !r.proposed).map(idOf).filter(Boolean);
    const cov = owner.coverage17 ? (uk && !(owner.coverage17.inc || []).includes("country:GB") ? { ...owner.coverage17, inc: [...(owner.coverage17.inc || []), "country:GB"] } : owner.coverage17) : { v: 2, inc: ids, exc: [], updatedAt: null };
    if (!changed && owner.coverage17) return owner;
    const rest = { ...owner };
    delete rest[COV_OLD_KEY17];
    return { ...rest, records: { ...(rest.records || {}), locations: list }, coverage17: cov };
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
.ff .ff-cov17-q{display:flex;align-items:center;gap:8px;margin:0 0 8px}
.ff .ff-cov17-q input{flex:1;min-width:0;font-size:16px;padding:10px 12px;border:1px solid var(--rule,#d8ccb0);border-radius:12px;corner-shape:squircle;background:#fff}
.ff .ff-cov17-hits{list-style:none;margin:0 0 8px;padding:0}
/* The work-locations drop-down (select mode): one closed control; the tree opens beneath it and scrolls with the page. */
.ff .ff-cov17-pick{margin-top:14px}
.ff .ff-cov17-ctl{display:flex;align-items:center;gap:12px;width:100%;box-sizing:border-box;min-height:58px;padding:10px 14px;border:1px solid var(--gold-mid,#B08D2A);border-radius:20px;corner-shape:squircle;background:linear-gradient(180deg,#FFFDF7,#F6EDD8);color:#16130F;text-align:left;cursor:pointer;font:inherit;box-shadow:0 1px 0 rgba(255,255,255,.7) inset,0 1px 6px rgba(126,97,29,.10)}
.ff .ff-cov17-ctl:focus-visible{outline:2px solid var(--gold-dk);outline-offset:2px}
.ff .ff-cov17-pin{flex:none;width:36px;height:36px;border-radius:12px;corner-shape:squircle;display:grid;place-items:center;background:rgba(201,162,39,.16);color:var(--gold-dk)}
.ff .ff-cov17-cb{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.ff .ff-cov17-h{font-size:15px;font-weight:700;line-height:1.25;overflow-wrap:normal;word-break:normal}
.ff .ff-cov17-ctl.has .ff-cov17-h{font-size:13px;color:#6A4F12}
.ff .ff-cov17-pills{display:flex;flex-wrap:wrap;gap:6px}
.ff .ff-cov17-pill{display:inline-block;padding:4px 10px;border-radius:12px;corner-shape:squircle;background:#16130F;color:#F4DC8E;font-size:13px;font-weight:600;line-height:1.3;max-width:100%;overflow-wrap:normal;word-break:normal}
.ff .ff-cov17-chev{flex:none;color:var(--gold-dk);transition:transform .18s}
.ff .ff-cov17-ctl[aria-expanded=true] .ff-cov17-chev{transform:rotate(180deg)}
.ff .ff-cov17-panel{margin-top:8px;padding:10px 8px 8px;border:1px solid var(--rule,#d8ccb0);border-radius:20px;corner-shape:squircle;background:#FFFDF8}
.ff .ff-cov17-pick .ff-cov17-q{margin:0 4px 8px;padding:0 4px 0 12px;border:1px solid var(--rule,#d8ccb0);border-radius:14px;corner-shape:squircle;background:#fff;color:#7A7366}
.ff .ff-cov17-pick .ff-cov17-q input{border:0;background:none;padding:12px 8px;min-height:44px;box-sizing:border-box}
.ff .ff-cov17-pick .ff-cov17-q input:focus{outline:none}
.ff .ff-cov17-pick .ff-cov17-q:focus-within{border-color:var(--gold-dk)}
.ff .ff-cov17-pick .ff-cov17-row{min-height:44px;border-radius:12px;corner-shape:squircle}
.ff .ff-cov17-pick .ff-cov17-x{width:44px;height:44px}
.ff .ff-cov17-pick .ff-cov17-lb{align-self:stretch;padding:4px 8px 4px 2px;border-radius:12px;corner-shape:squircle;line-height:1.3;font-size:15px}
.ff .ff-cov17-pick .ff-cov17-lb input{width:22px;height:22px}
.ff .ff-cov17-pick .ff-cov17-lb:has(input:checked){background:rgba(201,162,39,.14);font-weight:600}
.ff .ff-cov17-pick .ff-cov17-lb:has(input:indeterminate){background:rgba(201,162,39,.07)}
.ff .ff-cov17-pick .ff-cov17-x[aria-hidden=true]{pointer-events:none}
.ff .ff-cov17-pick .ff-cov17-ul .ff-cov17-ul{border-left:1px solid rgba(201,162,39,.35);margin-left:22px}
.ff .ff-cov17-pick .ff-cov17-box{max-height:none;overflow:visible;border-top:0;padding-top:0}
.ff .ff-cov17-end{border-top:1px solid var(--line,#e5dcc8);margin-top:6px;padding-top:6px}
@media (max-width:480px){.ff .ff-cov17-pick .ff-cov17-lb{font-size:15.5px}}
`;


/* Roots of the tree: the UK first, then the rest of the world. */
const covRoots17 = () => [FD_BY_ID["country:GB"], FD_BY_ID["worldwide"]].filter(Boolean);


const covKids17 = (n) => {
  if (n.id === COV_IE17) return FD_BY_ID[COV_NI17] ? [FD_BY_ID[COV_NI17]] : [];
  const k = fdTickKids19(n);
  return n.id === "country:GB" ? k.filter(m => m.id !== COV_NI17) : k;
};


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
  const box = key ? (COV17_MEMO[key] || (COV17_MEMO[key] = {})) : null;
  const [v, setV] = useState(() => (box && name in box ? box[name] : (typeof init === "function" ? init() : init)));
  const set = (x) => {
    if (!box) { setV(x); return; }
    const cur = name in box ? box[name] : v; const next = typeof x === "function" ? x(cur) : x; box[name] = next; setV(next);
  };
  return [v, set];
}


/* mode "select": the work-locations drop-down (FF Team work locations, FF Staff areas covered). Closed until opened;
                  every branch is closed until expanded.
   mode "links":  every place is a link to its area page (Explore by area). */
function CoverageTree17({ mode = "select", owner: ownerKind, siteKey, compact, title, onOpen, startOpen }) {
  const { state, dispatch } = useStore();
  const co = ownerKind === "company";
  const owner = co ? (state.company || {}) : state.profile;
  const cov = covOf17(owner);
  const links = mode === "links";
  const sk = siteKey || fdSiteKey(state);
  const mk = `${mode}|${ownerKind || "profile"}|${compact ? "c" : "f"}|${sk}`;
  /* The drop-down starts closed, with every branch closed, each time it appears (nothing is remembered); Explore by area keeps its place. */
  const mem = links ? mk : null;
  const [openIds, setOpenIds] = useCovState17(mem, "open", () => Object.fromEntries((startOpen || []).map(id => [id, true])));
  const [q, setQ] = useCovState17(mem, "q", "");
  const [drop, setDrop] = useCovState17(mem, "drop", false);
  const hits = fdSearch(q);
  const toggle = (n) => { const next = covToggle17(cov, n); dispatch({ type: "COV_SET", owner: co ? "company" : undefined, inc: [...next.inc], exc: [...next.exc] }); };
  const openTo = (n) => { const o = { ...openIds }; covAnc17(n).slice(1).forEach(a => { o[a.id] = true; }); setOpenIds(o); };
  const setOpen = (id, v) => { setOpenIds(o => ({ ...o, [id]: v })); if (v && onOpen && FD_BY_ID[id]) onOpen(FD_BY_ID[id]); };
  const row = (n, depth) => {
    const kids = links ? fdTickKids19(n) : covKids17(n), isOpen = !!openIds[n.id];
    const x = kids.length ? (
      <button type="button" className="ff-cov17-x" aria-expanded={isOpen} aria-label={`${isOpen ? "Collapse" : "Expand"} ${n.id === "country:GB" ? "United Kingdom" : n.name}`}
        onClick={() => setOpen(n.id, !isOpen)}
        onKeyDown={(e) => { if (e.key === "ArrowRight" && !isOpen) { e.preventDefault(); setOpen(n.id, true); } if (e.key === "ArrowLeft" && isOpen) { e.preventDefault(); setOpen(n.id, false); } }}>
        <I11.ChevronRight size={16} />
      </button>) : <span className="ff-cov17-x" aria-hidden="true" />;
    return (
      <li key={n.id} role="treeitem" aria-expanded={kids.length ? isOpen : undefined} aria-level={depth + 1}>
        <div className="ff-cov17-row" style={links ? { paddingLeft: depth * 14 } : undefined}>
          {x}
          {links
            ? <a className="ff-cov17-a" href={fdHref(sk, n.path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, sk, n.path); }}>{n.id === "country:GB" ? "United Kingdom" : n.name}</a>
            : <CovCheck17 n={n} cov={cov} onToggle={toggle} />}
        </div>
        {isOpen && kids.length > 0 && <ul className="ff-cov17-ul" role="group">{kids.map(k => row(k, depth + 1))}</ul>}
      </li>
    );
  };
  if (!links) {
    const places = covPlaces17(owner), extras = places.filter(p => !p.node), shown = places.slice(0, 3);
    const untick = (p) => dispatch({ type: "REC_DELETE", owner: co ? "company" : undefined, category: "locations", id: p.rec.id });
    return (
      <div className="ff-cov17 ff-cov17-pick">
        <style>{COV17_CSS}</style>
        <button type="button" className={`ff-cov17-ctl${places.length ? " has" : ""}`} aria-expanded={drop} onClick={() => setDrop(!drop)}>
          <span className="ff-cov17-pin" aria-hidden="true"><MapPin size={18} strokeWidth={1.8} /></span>
          <span className="ff-cov17-cb">
            <span className="ff-cov17-h">{COV_HEAD17}</span>
            {places.length > 0 && <span className="ff-cov17-pills">{shown.map(p => <span key={p.node ? p.node.id : p.rec.id} className="ff-cov17-pill">{p.name}</span>)}{places.length > shown.length && <span className="ff-cov17-pill">+{places.length - shown.length}</span>}</span>}
          </span>
          <I11.ChevronDown className="ff-cov17-chev" size={18} aria-hidden="true" />
        </button>
        {drop && (
          <div className="ff-cov17-panel">
            <label className="ff-cov17-q"><A17I.Search size={16} /><input value={q} onChange={(e) => setQ(e.target.value.slice(0, 60))} aria-label="Search places" autoComplete="off" spellCheck={false} /></label>
            {q.trim().length >= 2 ? (
              <ul className="ff-cov17-hits" aria-label="Matching places">
                {hits.length ? hits.map(n => (
                  <li key={n.id} className="ff-cov17-row">
                    <CovCheck17 n={n} cov={cov} onToggle={(m) => { toggle(m); openTo(m); }} label={<>{fdLabel(n)} <small>{fdChain(n)}</small></>} />
                  </li>)) : <li className="ff-cov17-row">No matching place.</li>}
              </ul>
            ) : (
              <>
                <ul className="ff-cov17-box" role="tree" aria-label="Places">{covRoots17().map(n => row(n, 0))}</ul>
                {extras.length > 0 && (
                  <ul className="ff-cov17-ul ff-cov17-end" aria-label="Other places">
                    {extras.map(p => (
                      <li key={p.rec.id} className="ff-cov17-row"><span className="ff-cov17-x" aria-hidden="true" />
                        <label className="ff-cov17-lb"><input type="checkbox" checked onChange={() => untick(p)} /><span>{p.name}</span></label>
                      </li>))}
                  </ul>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={`ff-cov17${compact ? "" : " ff-frame"}`}>
      <style>{COV17_CSS}</style>
      {title !== null && <h3 className="ff-label">{title || "Explore by area"}</h3>}
      <label className="ff-cov17-q"><A17I.Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a town, borough or neighbourhood" aria-label="Search for a place" /></label>
      {q.trim().length >= 2 ? (
        <ul className="ff-cov17-hits" aria-label="Matching places">
          {hits.length ? hits.map(n => (
            <li key={n.id} className="ff-cov17-row">
              <a className="ff-cov17-a" href={fdHref(sk, n.path)} onClick={(e) => { e.preventDefault(); fdNav(dispatch, sk, n.path); }}>{fdLabel(n)} <small>{fdChain(n)}</small></a>
            </li>)) : <li className="ff-cov17-row">No matching place.</li>}
        </ul>
      ) : (
        <ul className="ff-cov17-box" role="tree" aria-label="Places">{covRoots17().map(n => row(n, 0))}</ul>
      )}
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




