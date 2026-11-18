/* src/components/shared/venues17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* ==========================================================================
   VENUES (v17.14) — the places someone has worked, picked from Google's business search.

   A venue is a record in records.venues (FF Team profile and FF Staff company alike):
     { name, address, description, media,
       place: { id, lat, lng, primaryType, types, mapsUri, parts, source } | null,   from Google (PLACES_ADAPTER)
       area:  { id, name, path, how: "name" | "nearest" | "country", from } | null,   our place in the area list
       review: true when FireFlair has to look at it (typed by hand, or found but not placed) }
   Picking a Google result fills place, then area is worked out with no question to the member:
     1. the most specific name Google (and, for UK postcodes, the postcode lookup) gives — neighbourhood, ward,
        parish, local authority, postal town, locality — that is a place in our list (a name shared by two places
        takes the nearer one);
     2. otherwise the nearest UK neighbourhood, borough or town to the venue's map point (within 50 km);
     3. otherwise the county names Google gives; abroad, the country.
   A venue that is typed by hand (not on Google), or found but not placed, stays on the member's profile, is not
   shown on any area page or map, and is listed in FF Admin under Venues to review.
   Public: area pages list the placed venues at or under that place; the map shows each placed venue at its own
   point (people stay at area level). One venue added by several people is one venue (by Google place id).
   ========================================================================== */
const VEN_CSS17 = __ff_css("styles/venues17.css");


const VEN_TYPE_LABEL17 = { bar: "Bar", cocktail_bar: "Cocktail bar", pub: "Pub", wine_bar: "Wine bar", restaurant: "Restaurant", night_club: "Night club", hotel: "Hotel", event_venue: "Event venue", wedding_venue: "Wedding venue", banquet_hall: "Banquet hall" };


const venTypeLabel17 = (place) => (place && (VEN_TYPE_LABEL17[place.primaryType] || (place.types || []).map(t => VEN_TYPE_LABEL17[t]).find(Boolean))) || "Venue";


/* ---- Placing a venue in the area list ---------------------------------------------------------------- */
const venNorm17 = (s) => String(s || "").toLowerCase().replace(/[’`]/g, "'").replace(/\./g, "").replace(/\s+/g, " ").trim();


let VEN_ALIASES17 = null;


function venNamed17(name, ll, uk) {
  const low = venNorm17(name);
  if (!low) return null;
  if (!VEN_ALIASES17) { VEN_ALIASES17 = {}; Object.entries(FD_ALIASES.names || {}).forEach(([k, id]) => { VEN_ALIASES17[venNorm17(k)] = id; }); }
  const ids = new Set(FD_NODES.filter(n => venNorm17(n.name) === low).map(n => n.id));
  if (VEN_ALIASES17[low]) ids.add(VEN_ALIASES17[low]);
  const reach = { h: 6, b: 25, p: 30, a: 80 };
  const found = [...ids].map(id => FD_BY_ID[id]).filter(n => n && reach[n.k] && n.uk === uk)
    .map(n => [ll && n.lat != null ? fdHav(ll[0], ll[1], n.lat, n.lng) : null, n])
    .filter(([d, n]) => d == null || d <= reach[n.k])
    .sort((a, b) => (a[0] == null ? 0 : a[0]) - (b[0] == null ? 0 : b[0]));
  return found.length ? found[0][1] : null;
}


const venArea17 = (n, how, from) => ({ id: n.id, name: n.name, label: fdLabel(n), path: n.path, how, from: String(from || "") });


/* place (PLACES_ADAPTER shape) + an optional postcode lookup -> our area, or null. */
function venueAreaFor17(place, lookup) {
  if (!place) return null;
  const P = place.parts || {}, ll = place.lat != null && place.lng != null ? [place.lat, place.lng] : null;
  const L = lookup && lookup.ok && lookup.source !== "offline-estimate" ? lookup : null;
  const uk = (P.cc || "GB") === "GB";
  if (uk) {
    const names = [P.neighbourhood, P.sublocality, L && L.ward, L && L.parish, L && L.district, P.postalTown, P.locality];
    for (const nm of names) { const n = venNamed17(nm, ll, true); if (n) return venArea17(n, "name", nm); }
    if (ll) {
      let best = null;
      FD_NODES.forEach(x => { if (!x.uk || x.lat == null || !["h", "b", "p"].includes(x.k)) return; const d = fdHav(ll[0], ll[1], x.lat, x.lng); if (!best || d < best[0]) best = [d, x]; });
      if (best && best[0] <= 50) return venArea17(best[1], "nearest", `${Math.round(best[0] * 10) / 10} km`);
    }
    for (const nm of [P.admin3, P.admin2]) { const n = venNamed17(nm, ll, true); if (n) return venArea17(n, "name", nm); }
    return null;
  }
  const c = P.cc && FD_NODES.find(n => n.k === "c" && String(n.cc || "").toUpperCase() === P.cc && n.id !== "country:GB");
  return c ? venArea17(c, "country", P.country) : null;
}


/* What a picked place writes onto the venue record. */
function venuePatch17(place, area) {
  return {
    name: place.name, address: place.address || "",
    place: { id: place.id, lat: place.lat, lng: place.lng, primaryType: place.primaryType, types: place.types, mapsUri: place.mapsUri, parts: place.parts, source: place.source },
    area: area || null, review: !area,
  };
}


const venueTypedPatch17 = (text) => ({ name: String(text || "").trim(), address: "", place: null, area: null, review: true });


/* Google result -> the record patch: Place Details, then (UK) the postcode lookup, then the area. */
async function venueResolve17(placeId, sessionToken) {
  const d = await PLACES_ADAPTER.details(placeId, { sessionToken });
  if (!d.ok) return null;
  const pc = d.place.parts && d.place.parts.cc === "GB" && d.place.parts.postcode;
  let lk = null;
  if (pc) { try { lk = await LOCATION_ADAPTER.lookupPostcode(pc); } catch (e) { lk = null; } }
  return venuePatch17(d.place, venueAreaFor17(d.place, lk));
}


/* A sample place as a record patch, worked out at once (used by the demo profile). */
function venueFromSample17(id) {
  const p = PLACES_SAMPLES17.find(x => x.id === id);
  if (!p) return null;
  const place = placesNorm17(p, "sample");
  return venuePatch17(place, venueAreaFor17(place, null));
}


/* "View on Google Maps": Google's own link when the search gave one, else a search for the name and address. */
function venueMapsUrl17(r) {
  if (!r || !r.place) return "";
  if (r.place.mapsUri) return r.place.mapsUri;
  const q = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([r.name, r.address].filter(Boolean).join(", "))}`;
  return r.place.source === "google" && r.place.id ? `${q}&query_place_id=${encodeURIComponent(r.place.id)}` : q;
}


/* ---- Who has which venues ------------------------------------------------------------------------------ */
/* Every venue record with whoever added it. all = true includes a profile that isn't live yet (FF Admin). */
function venueEntries17(state, all) {
  const out = [];
  const p = state.profile;
  if (p && (all || p.live)) recsOf(p, "venues").forEach(r => out.push({ rec: r, by: { kind: "person", id: "me", name: p.name || "Your profile" } }));
  (companyList(state) || []).filter(c => c.mine && c.name).forEach(c => recsOf(c, "venues").forEach(r => out.push({ rec: r, by: { kind: "company", id: c.id, name: c.name } })));
  return out.filter(x => x.rec && !x.rec.hidden && !x.rec.proposed && String(x.rec.name || "").trim());
}


const venuePlaced17 = (r) => !!(r && r.place && r.place.lat != null && r.area && FD_BY_ID[r.area.id] && !r.review);


/* Placed venues, one per Google place, with everyone who listed it. */
function publicVenues17(state) {
  if (!SHOW_VENUES17) return [];
  const by = {};
  venueEntries17(state, false).filter(x => venuePlaced17(x.rec)).forEach(x => {
    const k = x.rec.place.id;
    const v = by[k] || (by[k] = { key: k, rec: x.rec, by: [] });
    if (!v.by.some(b => b.kind === x.by.kind && b.id === x.by.id)) v.by.push(x.by);
  });
  return Object.values(by).sort((a, b) => a.rec.name.localeCompare(b.rec.name));
}


/* FF Admin: everything FireFlair still has to place. In production this is a server-side queue; the prototype keeps
   what was waiting when someone signs out (state.venueReview17, like claims), so FF Admin can still show it. */
const venueReviewSlim17 = (x) => ({ rec: { id: x.rec.id, name: x.rec.name, address: x.rec.address || "", place: x.rec.place ? { id: x.rec.place.id } : null, review: !!x.rec.review }, by: x.by });


function venueReviewList17(state) {
  const all = venueEntries17(state, true);
  const kept = (state.venueReview17 || []).filter(k => !all.some(x => x.rec.id === k.rec.id));
  return [...all.filter(x => !venuePlaced17(x.rec)), ...kept];
}


const venueReviewKeep17 = (s) => venueReviewList17(s).map(venueReviewSlim17);


/* ---- The business search ----------------------------------------------------------------------------- */
function VenueSearch17({ value, onPick, autoFocus, label, placeholder }) {
  const [q, setQ] = useState(value || "");
  const [list, setList] = useState([]);
  const [live, setLive] = useState(false);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [act, setAct] = useState(-1);
  const tok = useRef(null), seq = useRef(0), boxId = useRef(uid("ven")).current;
  const t = q.trim();
  useEffect(() => { setQ(value || ""); }, [value]);
  useEffect(() => {
    if (!open || t.length < 2) { setList([]); setAct(-1); return undefined; }
    const n = ++seq.current;
    const h = setTimeout(async () => {
      if (!tok.current) tok.current = uid("ses");
      const r = await PLACES_ADAPTER.autocomplete(t, { sessionToken: tok.current });
      if (n !== seq.current) return;
      setList(r.ok ? r.suggestions : []); setLive(!!r.live); setAct(-1);
    }, 160);
    return () => clearTimeout(h);
  }, [t, open]);
  const pick = async (s) => {
    setOpen(false); setBusy(true);
    const patch = await venueResolve17(s.placeId, tok.current);
    tok.current = null; setBusy(false);
    if (patch) { setQ(patch.name); onPick(patch); } else onPick(venueTypedPatch17(s.main));
  };
  const typed = () => { if (!t) return; setOpen(false); tok.current = null; onPick(venueTypedPatch17(t)); };
  const rows = t.length >= 2 ? [...list.map(s => ({ s })), { typed: true }] : [];
  const choose = (i) => { const r = rows[i]; if (!r) return; if (r.typed) typed(); else pick(r.s); };
  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setAct(Math.min(rows.length - 1, act + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setAct(Math.max(0, act - 1)); }
    else if (e.key === "Enter" && open && act >= 0) { e.preventDefault(); choose(act); }
    else if (e.key === "Escape") setOpen(false);
  };
  return (
    <div className="ff-ven17">
      <style>{VEN_CSS17}</style>
      <input className="ff-input" style={{ fontSize: 17 }} value={q} autoFocus={autoFocus} role="combobox" aria-label={label || "Venue"} placeholder={placeholder}
        aria-expanded={open && rows.length > 0} aria-controls={boxId} aria-autocomplete="list" aria-busy={busy || undefined}
        aria-activedescendant={act >= 0 ? `${boxId}-${act}` : undefined} autoComplete="off" spellCheck={false}
        onChange={(e) => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={onKey}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      {open && rows.length > 0 && (
        <ul id={boxId} role="listbox" className="ff-ven17-list">
          {rows.map((r, i) => (
            <li key={r.typed ? "typed" : r.s.placeId} id={`${boxId}-${i}`} role="option" aria-selected={act === i}>
              <button type="button" tabIndex={-1} className={(r.typed ? "typed" : "") + (act === i ? " on" : "")} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(i)}>
                {r.typed ? <Plus size={15} strokeWidth={1.8} /> : <MapPin size={15} strokeWidth={1.6} />}
                <span>{r.typed ? <b>Add “{t}” as a venue</b> : <><b>{r.s.main}</b><small>{r.s.secondary}</small></>}</span>
              </button>
            </li>
          ))}
          <li role="presentation" className="ff-ven17-by">{live ? "Powered by Google" : "Sample places"}</li>
        </ul>
      )}
    </div>
  );
}
