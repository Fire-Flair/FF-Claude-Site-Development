/* src/components/shared/base17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   WHERE ARE YOU BASED? (v17.4.6.3) — one base place per FF Team Profile Card.

   v17.6: Where are you based? is one map point (v17.6.1: used for the map pin only; nothing is measured from it).
   state.profile.base17 (and state.company.base17) =
     { locId, label, lat, lng, approx, postcode?: { code, lat, lng, approx }, at }
       locId, label   the public place, chosen at town or city level (any London postcode gives London). Public.
       lat, lng       the centre of that public place (or the postcode point rounded to about 1 km when the place is not
                      in the catalogue). This is the only point ever plotted on the map. Public.
       postcode       PRIVATE and optional: the postcode and its exact point. Never shown, plotted or sent in a public payload.
       approx         true when there is no postcode-accurate point (a typed place such as London, or an offline estimate).
     A base saved before v17.6 is { locId, at }: its place centre stands in for the missing fields.
   state.workPostcode   = { code, lat, lng, approx, baseId, at }   PRIVATE (profile only, kept as before). Never part
                          of the profile, a card, an area page or any public payload.
   The base is not coverage. Choosing it never touches records.locations or coverage17, so changing the
   base keeps every saved coverage selection, and search eligibility only changes when coverage is edited.
   Older profiles have no base17: baseMigrate17 (run with the other one-time moves) sets it once from their saved
   postcode area (workPostcode.town) when that names a catalogue place, marked legacy. It writes only base17: saved
   location records and coverage17 are never touched, so nothing is widened or removed.

   Production: LOCATION_ADAPTER.lookupPostcode runs server-side; the postcode and coordinates stay in the
   private account record; profile.base17.locId is the only location field the public profile carries.
   ========================================================================== */
const BASE_KINDS17 = ["p", "h", "b", "a"];


/* The nearest parent worth showing: not a country, nation or the world. */
function baseParent17(n) {
  const kinds = ["c", "n", "r", "t"];
  for (const a of fdAnc(n).slice(1)) { if (!kinds.includes(a.k) && a.id !== "country:GB") return a; }
  return null;
}


/* "Berkhamsted, Hertfordshire". A top-level area that shares its name with another place gets its nation
   ("Newport, Wales"), so two places with one name never read the same. */
function baseLabelOf17(n) {
  if (!n) return "";
  const par = baseParent17(n);
  if (par) return `${n.name}, ${par.name}`;
  if (FD_DUP_NAMES[n.name] > 1) { const nat = fdAnc(n).slice(1).find(a => a.k === "n"); if (nat) return `${n.name}, ${nat.name}`; }
  return n.name;
}


/* The base place of a profile (by its saved id). */
function baseNode17(s) {
  const id = s && s.profile && s.profile.base17 && s.profile.base17.locId;
  return id && FD_BY_ID[id] ? FD_BY_ID[id] : null;
}


/* Older profiles: the saved postcode area was their "primary location". It becomes the base once, when it names
   a catalogue place. Only base17 is written: location records and coverage17 are left exactly as they are. */
function baseMigrate17(s) {
  if (!s || !s.profile || s.profile.base17) return s;
  const town = s.workPostcode && s.workPostcode.town;
  const n = town ? fdTickNode19(town) : null;
  if (!n || !BASE_KINDS17.includes(n.k)) return s;
  const wp = s.workPostcode;
  return { ...s, profile: { ...s.profile, base17: { locId: n.id, at: Date.now(), legacy: true } }, workPostcode: { ...wp, baseId: n.id } };
}


const baseLabel17 = (s) => baseLabelOf17(baseNode17(s));


/* A town or city is shown by its plain name; a name shared by two places gets its parent ("Newport, Wales"). */
const baseTown17 = (n) => (n ? (FD_DUP_NAMES[n.name] > 1 ? baseLabelOf17(n) : n.name) : "");


/* The public label of an owner's base (profile or company): the saved label, else the place's label. "" when none. */
function baseLabelOfOwner17(owner) {
  const b = owner && owner.base17;
  if (!b) return "";
  if (b.label) return b.label;
  return b.locId && FD_BY_ID[b.locId] ? baseLabelOf17(FD_BY_ID[b.locId]) : "";
}


/* Is there a base to plot? */
const baseHas17 = (owner) => !!(owner && owner.base17 && (owner.base17.lat != null || (owner.base17.locId && FD_BY_ID[owner.base17.locId])));


/* The public map point of an owner's base: the centre of the public place. Never the postcode point.
   Returns { lat, lng, label } or null. */
function basePublicPoint17(owner) {
  const b = owner && owner.base17;
  if (!b) return null;
  const n = b.locId && FD_BY_ID[b.locId];
  if (n && n.lat != null) return { lat: n.lat, lng: n.lng, label: baseLabelOfOwner17(owner) };
  if (b.lat != null && b.lng != null) return { lat: Math.round(b.lat * 100) / 100, lng: Math.round(b.lng * 100) / 100, label: baseLabelOfOwner17(owner) };
  return null;
}


/* From a postcode lookup to the public place: London for any London postcode, otherwise the local authority's
   town or area, then a named town, then the nearest town within 40 km. Returns a catalogue node or null. */
function baseResolve17(r) {
  const lon = FD_BY_ID[FD_LONDON];
  const named = (nm, kinds) => {
    const low = String(nm || "").toLowerCase();
    if (!low) return null;
    const m = FD_NODES.filter(x => x.uk && x.name.toLowerCase() === low && kinds.includes(x.k));
    return m.find(x => x.k === "p") || m[0] || null;
  };
  let n = /^london$/i.test(r.region || "") ? lon : null;
  if (!n) n = named(r.district, ["p", "a", "b"]);
  if (!n) { for (const nm of (r.names || []).slice(1)) { if (r.source === "offline-estimate") break; n = named(nm, ["p"]); if (n) break; } }
  if (!n && r.lat != null && r.lng != null) {
    let best = null;
    FD_NODES.forEach(x => { if (!x.uk || x.lat == null || x.k !== "p") return; const d = fdHav(r.lat, r.lng, x.lat, x.lng); if (!best || d < best[0]) best = [d, x]; });
    if (best && best[0] < 40) n = best[1];
  }
  if (n && n !== lon && covUnder17(n, FD_LONDON)) n = lon;
  return n;
}


/* The same base place for a company (FF Staff / FF Party Company Card): company.base17 = { locId, at }. */
function baseNodeOfCo17(co) {
  const id = co && co.base17 && co.base17.locId;
  return id && FD_BY_ID[id] ? FD_BY_ID[id] : null;
}


/* Places to offer when someone looks up a postcode or searches: real places only, nearest first. */
function baseCandidates17(r) {
  const list = covSuggest17(r).filter(n => BASE_KINDS17.includes(n.k));
  const rank = (n) => (n.k === "a" ? 1 : 0);
  return list.map((n, i) => [n, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(x => x[0]).slice(0, 6);
}


function base17Reducer(s, a) {
  if (a.type === "BASE_SET") {
    const n = a.locId ? FD_BY_ID[a.locId] : null;
    if (a.locId && (!n || !BASE_KINDS17.includes(n.k))) return s;
    if (!n && (a.lat == null || a.lng == null || !a.label)) return s;
    const pc = a.postcode && a.postcode.code ? { code: String(a.postcode.code).slice(0, 9), lat: a.postcode.lat != null ? a.postcode.lat : null, lng: a.postcode.lng != null ? a.postcode.lng : null, approx: !!a.postcode.approx } : null;
    const r2 = (x) => Math.round(x * 100) / 100;
    const pub = n && n.lat != null ? { lat: n.lat, lng: n.lng } : { lat: r2(a.lat), lng: r2(a.lng) };
    const base = { locId: n ? n.id : null, label: a.label || baseLabelOf17(n), lat: pub.lat, lng: pub.lng, approx: pc ? !!pc.approx : true, ...(pc ? { postcode: pc } : {}), at: Date.now() };
    if (a.owner === "company") return { ...s, company: { ...(s.company || {}), base17: base } };
    return { ...s, profile: { ...s.profile, base17: base }, workPostcode: pc ? { ...pc, baseId: n ? n.id : null, at: Date.now() } : null };
  }
  return null;
}


const BASE17_CSS = `
.ff .ff-base17{display:flex;flex-direction:column;gap:8px}
.ff .ff-base17-now{display:flex;align-items:center;gap:8px;justify-content:space-between}
.ff .ff-base17-now b{font-size:15px;font-weight:700;overflow-wrap:normal;word-break:normal}
.ff .ff-base17-in{display:flex;gap:6px}
.ff .ff-base17-in input{flex:1;min-width:0;font-size:16px;padding:9px 11px;border:1px solid var(--rule,#d8ccb0);border-radius:12px;corner-shape:squircle;background:#fff;color:#16130F}
.ff .ff-base17-in.card input{padding:3px 0;border:0;border-radius:0;background:transparent;font-size:15px;font-family:var(--sans);outline:none;border-bottom:1px solid transparent}
.ff .ff-base17-in.card input:focus{border-bottom-color:var(--gold)}
.ff .ff-base17-in.card input::placeholder{color:inherit;opacity:.62}
.ff .ff-base17-opts{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.ff .ff-base17-opt{display:flex;align-items:center;gap:9px;min-height:40px;padding:4px 10px;border-radius:12px;corner-shape:squircle;border:1px solid var(--rule,#d8ccb0);background:rgba(255,255,255,.65);color:#16130F;cursor:pointer;font-size:14px}
.ff .ff-base17-opt input{width:18px;height:18px;flex:none;accent-color:#5C1220}
.ff .ff-base17-opt span{min-width:0;overflow-wrap:normal;word-break:normal}
.ff .ff-base17-msg{font-size:12.5px;margin:0;color:#8A2A2A}
.ff .ff-base17-note{margin:0;font-size:12.5px;opacity:.75;overflow-wrap:normal;word-break:normal}
.ff .ff-base17-link{background:none;border:0;padding:4px 0;font-size:12.5px;font-weight:600;text-decoration:underline;color:inherit;cursor:pointer;text-align:left}
`;


/* The card's location field: one postcode box. A postcode is looked up and saved at once; a place name can be
   typed instead and is saved as an approximate base. */
function BaseField17({ ink, owner }) {
  const { state, dispatch } = useStore();
  const co = owner === "company";
  const mk = co ? "base17co" : "base17";
  const own = co ? (state.company || {}) : state.profile;
  const curLabel = baseLabelOfOwner17(own);
  const [editing, setEditing] = useCovState17(mk, "editing", false);
  const [pc, setPc] = useCovState17(mk, "pc", "");
  const [msg, setMsg] = useCovState17(mk, "msg", "");
  const [busy, setBusy] = useState(false);
  const latest = useRef("");
  latest.current = pc;
  const pcOk = parsePostcode(pc).ok;
  const partial = pcOk && parsePostcode(pc).partial;
  const hits = !pcOk && pc.trim().length >= 2 ? fdSearch(pc).filter(n => BASE_KINDS17.includes(n.k)) : [];
  const done = () => { setEditing(false); setPc(""); setMsg(""); };
  const pick = (n) => { dispatch({ type: "BASE_SET", owner: co ? "company" : undefined, locId: n.id, label: baseLabelOf17(n), approx: true }); done(); };
  const find = async () => {
    const typed = latest.current;
    if (busy || !parsePostcode(typed).ok) return;
    setBusy(true); setMsg("");
    const r = await LOCATION_ADAPTER.lookupPostcode(typed);
    setBusy(false);
    if (latest.current !== typed) return;
    if (!r.ok) { setMsg(r.reason === "format" ? "That isn't a UK postcode." : "We couldn't look that postcode up."); return; }
    const n = baseResolve17(r);
    if (!n && (r.lat == null || r.lng == null)) { setMsg("We couldn't place that postcode."); return; }
    dispatch({ type: "BASE_SET", owner: co ? "company" : undefined, locId: n ? n.id : undefined, label: n ? baseTown17(n) : (r.district || r.display), lat: r.lat, lng: r.lng, postcode: { code: r.display, lat: r.lat, lng: r.lng, approx: !!r.approx } });
    done();
  };
  useEffect(() => {
    if (!pcOk) { if (msg) setMsg(""); return; }
    const t = setTimeout(find, partial ? 1200 : 400);
    return () => clearTimeout(t);
  }, [pc]);
  const line = co ? "We put you on the map so people nearby can find you." : "We put you on the map to find jobs close to you.";
  return (
    <div className="ff-base17">
      <style>{BASE17_CSS}</style>
      {curLabel && !editing ? (
        <div className="ff-base17-now">
          <b style={{ color: ink }}>{curLabel}</b>
          <button type="button" className="ff-base17-link" style={{ color: ink }} onClick={() => setEditing(true)}>Change</button>
        </div>
      ) : (
        <>
          <div className={`ff-base17-in${ink ? " card" : ""}`}>
            <input value={pc} onChange={(e) => { setPc(e.target.value.slice(0, 40)); setMsg(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); find(); } }}
              placeholder="Postcode" aria-label="Postcode" autoComplete="off" spellCheck={false} style={ink ? { color: ink } : undefined} />
          </div>
          {msg && <p className="ff-base17-msg" role="alert">{msg}</p>}
          {!pcOk && pc.trim().length >= 2 && (hits.length
            ? <div role="radiogroup" aria-label="Places" className="ff-base17-opts">{hits.map(n => (
              <label key={n.id} className="ff-base17-opt">
                <input type="radio" name={"ff-base17" + (co ? "co" : "")} checked={false} onChange={() => pick(n)} />
                <span>{baseLabelOf17(n)}</span>
              </label>))}</div>
            : <p className="ff-base17-msg">No matching place.</p>)}
          {curLabel && <button type="button" className="ff-base17-link" style={{ color: ink }} onClick={done}>Keep {curLabel}</button>}
        </>
      )}
      <p className="ff-base17-note" style={{ color: ink }}>{line}</p>
    </div>
  );
}
