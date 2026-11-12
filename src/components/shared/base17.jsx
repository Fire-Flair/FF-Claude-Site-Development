/* src/components/shared/base17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   WHERE ARE YOU BASED? (v17.4.6.3) — one base place per FF Team Profile Card.

   state.profile.base17 = { locId, at }      the chosen place, by stable catalogue id (public: shown as a label)
   state.workPostcode   = { code, lat, lng, approx, baseId, at }   PRIVATE. Never part of the profile, a card, an
                          area page or any public payload. Used only for travel distance from the base.
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


/* Where distances are measured from: the private postcode point when it belongs to this base, otherwise the
   centre of the base place. Returns { lat, lng, precise } or null. */
function baseOrigin17(s) {
  const n = baseNode17(s);
  const wp = s && s.workPostcode;
  if (wp && wp.lat != null && wp.lng != null && (!wp.baseId || (n && wp.baseId === n.id))) return { lat: wp.lat, lng: wp.lng, precise: !wp.approx };
  return n && n.lat != null ? { lat: n.lat, lng: n.lng, precise: false } : null;
}


/* Travel distance in kilometres from the member's base to a point; null when there is no base. */
function baseDistanceKm17(s, lat, lng) {
  const o = baseOrigin17(s);
  if (!o || lat == null || lng == null) return null;
  return fdHav(o.lat, o.lng, lat, lng);
}


/* Places to offer when someone looks up a postcode or searches: real places only, nearest first. */
function baseCandidates17(r) {
  const list = covSuggest17(r).filter(n => BASE_KINDS17.includes(n.k));
  const rank = (n) => (n.k === "a" ? 1 : 0);
  return list.map((n, i) => [n, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(x => x[0]).slice(0, 6);
}


function base17Reducer(s, a) {
  if (a.type === "BASE_SET") {
    const n = FD_BY_ID[a.locId];
    if (!n || !BASE_KINDS17.includes(n.k)) return s;
    const pc = a.postcode && a.postcode.code ? { code: String(a.postcode.code).slice(0, 9), lat: a.postcode.lat != null ? a.postcode.lat : null, lng: a.postcode.lng != null ? a.postcode.lng : null, approx: !!a.postcode.approx, baseId: n.id, at: Date.now() } : null;
    return { ...s, profile: { ...s.profile, base17: { locId: n.id, at: Date.now() } }, workPostcode: pc };
  }
  return null;
}


const BASE17_CSS = `
.ff .ff-base17{display:flex;flex-direction:column;gap:8px}
.ff .ff-base17-now{display:flex;align-items:center;gap:8px;justify-content:space-between}
.ff .ff-base17-now b{font-size:15px;font-weight:700;overflow-wrap:normal;word-break:normal}
.ff .ff-base17-in{display:flex;gap:6px}
.ff .ff-base17-in input{flex:1;min-width:0;font-size:16px;padding:9px 11px;border:1px solid var(--rule,#d8ccb0);border-radius:12px;corner-shape:squircle;background:#fff;color:#16130F}
.ff .ff-base17-opts{border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.ff .ff-base17-opt{display:flex;align-items:center;gap:9px;min-height:40px;padding:4px 10px;border-radius:12px;corner-shape:squircle;border:1px solid var(--rule,#d8ccb0);background:rgba(255,255,255,.65);color:#16130F;cursor:pointer;font-size:14px}
.ff .ff-base17-opt input{width:18px;height:18px;flex:none;accent-color:#5C1220}
.ff .ff-base17-opt span{min-width:0;overflow-wrap:normal;word-break:normal}
.ff .ff-base17-msg{font-size:12.5px;margin:0;color:#8A2A2A}
.ff .ff-base17-link{background:none;border:0;padding:4px 0;font-size:12.5px;font-weight:600;text-decoration:underline;color:inherit;cursor:pointer;text-align:left}
`;


/* The card's location field. The postcode finds places; the person chooses exactly one. */
function BaseField17({ ink }) {
  const { state, dispatch } = useStore();
  const cur = baseNode17(state);
  const [editing, setEditing] = useCovState17("base17", "editing", false);
  const [pc, setPc] = useCovState17("base17", "pc", "");
  const [q, setQ] = useCovState17("base17", "q", "");
  const [opts, setOpts] = useCovState17("base17", "opts", []);
  const [look, setLook] = useCovState17("base17", "look", null);
  const [msg, setMsg] = useCovState17("base17", "msg", "");
  const [manual, setManual] = useCovState17("base17", "manual", false);
  const [busy, setBusy] = useState(false);
  const hits = q.trim().length >= 2 ? fdSearch(q).filter(n => BASE_KINDS17.includes(n.k)) : [];
  const choose = (n, withPostcode) => {
    dispatch({ type: "BASE_SET", locId: n.id, postcode: withPostcode && look ? { code: look.display, lat: look.lat, lng: look.lng, approx: look.approx } : null });
    setEditing(false); setOpts([]); setLook(null); setPc(""); setQ(""); setMsg(""); setManual(false);
  };
  const find = async () => {
    if (busy || !pc.trim()) return;
    setBusy(true); setMsg(""); setOpts([]); setLook(null);
    const r = await LOCATION_ADAPTER.lookupPostcode(pc);
    setBusy(false);
    if (!r.ok) { setMsg(r.reason === "format" ? "That isn't a UK postcode." : "We couldn't look that postcode up."); setManual(true); return; }
    const near = baseCandidates17(r);
    if (!near.length) { setMsg("No places found for that postcode."); setManual(true); return; }
    setLook(r); setOpts(near);
  };
  const radio = (n, withPostcode) => (
    <label key={n.id} className="ff-base17-opt">
      <input type="radio" name="ff-base17" checked={cur && cur.id === n.id && !editing} onChange={() => choose(n, withPostcode)} />
      <span>{baseLabelOf17(n)}</span>
    </label>
  );
  const search = (
    <div className="ff-base17">
      <div className="ff-base17-in">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for a town or area" aria-label="Search for your town or area" style={{ color: "#16130F" }} />
      </div>
      {q.trim().length >= 2 && (hits.length
        ? <div role="radiogroup" aria-label="Places" className="ff-base17-opts">{hits.map(n => radio(n, false))}</div>
        : <p className="ff-base17-msg">No matching place.</p>)}
    </div>
  );
  return (
    <div className="ff-base17">
      <style>{BASE17_CSS}</style>
      {cur && !editing ? (
        <div className="ff-base17-now">
          <b style={{ color: ink }}>{baseLabelOf17(cur)}</b>
          <button type="button" className="ff-base17-link" style={{ color: ink }} onClick={() => setEditing(true)}>Change</button>
        </div>
      ) : (
        <>
          <div className="ff-base17-in">
            <input value={pc} onChange={(e) => { setPc(e.target.value.toUpperCase().slice(0, 9)); setMsg(""); }}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); find(); } }}
              placeholder="Your postcode" aria-label="Your postcode (kept private)" autoComplete="postal-code" spellCheck={false} />
            <Btn variant="sm" onClick={find} disabled={busy || !pc.trim()}>{busy ? "Finding…" : "Find"}</Btn>
          </div>
          {msg && <p className="ff-base17-msg" role="alert">{msg}</p>}
          {opts.length > 0 && <div role="radiogroup" aria-label="Where are you based?" className="ff-base17-opts">{opts.map(n => radio(n, true))}</div>}
          {manual ? search : <button type="button" className="ff-base17-link" style={{ color: ink }} onClick={() => setManual(true)}>Search for a place</button>}
          {cur && <button type="button" className="ff-base17-link" style={{ color: ink }} onClick={() => { setEditing(false); setOpts([]); setMsg(""); }}>Keep {baseLabelOf17(cur)}</button>}
        </>
      )}
    </div>
  );
}
