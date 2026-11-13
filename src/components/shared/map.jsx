/* src/components/shared/map.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   THE MAP (FF Team, FF Staff, FF Party) — the FF Team coins on a real map of
   the UK. The map is drawn from Natural Earth data (public domain) embedded in
   the page (#ff-ukgeo), so nothing is fetched from a map server. It opens on
   the UK; the London coin flies in to the areas. Pins stay area-only.
   ========================================================================== */
let UK_GEO11 = null;


const ukGeo11 = () => {
  if (UK_GEO11) return UK_GEO11;
  try { const el = document.getElementById("ff-ukgeo"); UK_GEO11 = el ? JSON.parse(el.textContent) : null; } catch (e) { UK_GEO11 = null; }
  return UK_GEO11;
};


const decRing11 = (r) => { const o = []; for (let i = 0; i < r.length; i += 2) o.push([r[i] / 1e4, r[i + 1] / 1e4]); return o; };


const UK_CITIES11 = [
  ["London", 51.507, -0.128, 1], ["Birmingham", 52.486, -1.890], ["Manchester", 53.480, -2.242], ["Leeds", 53.800, -1.549],
  ["Liverpool", 53.408, -2.991, 0, 1], ["Newcastle", 54.978, -1.617], ["Bristol", 51.454, -2.588], ["Cardiff", 51.481, -3.179, 0, 1],
  ["Edinburgh", 55.953, -3.188], ["Glasgow", 55.864, -4.252], ["Belfast", 54.597, -5.930], ["Aberdeen", 57.149, -2.094],
  ["Norwich", 52.630, 1.297], ["Dublin", 53.350, -6.260], ["Inverness", 57.478, -4.224],
];


const UK_BOUNDS11 = [[49.9, -8.2], [58.7, 1.8]];


const WORLD_Z11 = 3.5;


const LDN11 = [51.5, -0.12];


const NEAR_Z11 = 8.5;


/* The M25 ring (hand-traced from the motorway junctions; a drawn guide, not survey data) and the frame that holds all of it. */
const M25_11 = [[51.462, 0.262], [51.484, 0.287], [51.566, 0.256], [51.618, 0.241], [51.646, 0.100], [51.683, 0.001], [51.700, -0.080],
  [51.699, -0.190], [51.693, -0.230], [51.722, -0.300], [51.716, -0.380], [51.708, -0.440], [51.660, -0.510], [51.640, -0.540],
  [51.578, -0.520], [51.485, -0.513], [51.440, -0.510], [51.374, -0.500], [51.318, -0.460], [51.292, -0.340], [51.265, -0.190],
  [51.254, -0.065], [51.280, 0.150], [51.320, 0.170], [51.400, 0.190], [51.426, 0.235]];


const LONDON_BOUNDS11 = [[51.243, -0.545], [51.733, 0.315]];


const smooth11 = (pts, closed, n = 3) => {
  let a = pts;
  for (let k = 0; k < n; k++) {
    const o = [];
    const m = closed ? a.length : a.length - 1;
    if (!closed) o.push(a[0]);
    for (let i = 0; i < m; i++) {
      const p = a[i], q = a[(i + 1) % a.length];
      o.push([0.75 * p[0] + 0.25 * q[0], 0.75 * p[1] + 0.25 * q[1]], [0.25 * p[0] + 0.75 * q[0], 0.25 * p[1] + 0.75 * q[1]]);
    }
    if (!closed) o.push(a[a.length - 1]);
    a = o;
  }
  return closed ? a.concat([a[0]]) : a;
};



/* Simplified coin for the map: a flat disc in the tier colour with the FF mark. */
function MapCoin({ size = 24, tier = "standard", style }) {
  const m = metalOf(tier);
  const base = tier === "base";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" style={{ display: "block", flex: "none", filter: "drop-shadow(0 1px 2px rgba(0,0,0,.4))", ...style }}>
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" />
      <circle cx="50" cy="50" r="42" fill={base ? "#E7E4DE" : m.edge[1]} stroke={base ? "#8E8A82" : m.edge[2]} strokeWidth="3" />
      <g transform="translate(33.66 29.84) skewX(-9) scale(0.84)" fill={base ? "#8E8A82" : "#2A210A"}>
        <path d={F_FORM} />
        <g transform="translate(22 0)"><path d={F_FORM} /></g>
      </g>
    </svg>
  );
}



const inLondon11 = (ll) => ll[0] >= LONDON_BOUNDS11[0][0] && ll[0] <= LONDON_BOUNDS11[1][0] && ll[1] >= LONDON_BOUNDS11[0][1] && ll[1] <= LONDON_BOUNDS11[1][1];


/* Bar companies on the map: one area-level pin per base (town centre, never an address). Same pins on FF Team, FF Staff and FF Party. */
const COMPANY_PINS11 = (() => {
  const seen = {}, out = [];
  [...REAL_COMPANIES11, ...REAL_SUPPLIERS17].forEach(c => (c.locations || []).forEach((l, i) => {
    const k = l.lat.toFixed(2) + "," + l.lng.toFixed(2), n = (seen[k] = (seen[k] || 0) + 1) - 1;
    const a = n * 2.4, r = n ? 0.012 + 0.006 * Math.floor(n / 6) : 0;
    const ll = [l.lat + r * Math.sin(a), l.lng + r * 1.6 * Math.cos(a)];
    out.push({ id: "co_" + c.slug + "_" + i, coId: "co_" + c.slug, kind: "company", name: c.name, profession: c.kind, area: l.label, ll, ldn: inLondon11(ll), cat: c.cat || "bar" });
  }));
  return out;
})();



const MAP_LAYERS19 = [["partners", "Companies"], ["pros", "Professionals"], ["dir", "Directory"], ["venues", "Venues"]];


function MapVenue20({ size = 22, on }) {
  return React.createElement("span", { style: { width: size, height: size, borderRadius: "50%", background: MAP_LAYER.venue.color, border: "1.5px solid #141416", display: "inline-grid", placeItems: "center", flex: "none", boxShadow: on ? "0 0 10px rgba(198,200,204,.9)" : "none" } },
    React.createElement(Building2, { size: Math.round(size * 0.58), color: "#141416", strokeWidth: 1.8 }));
}


const catOf19 = (p) => p.kind === "person" ? (p.profession || p.group || "Other") : p.kind === "company" ? ((NET_CO_TYPES17.find((x) => x[0] === (p.cat || "bar")) || [])[1] || "Bar companies") : p.kind === "venue" ? (p.kind2 || p.vtype || p.venueKind || "Venue") : "";


const layerOf19 = (p) => p.kind === "person" ? "pros" : p.kind === "company" ? (p.partner ? "partners" : "dir") : p.kind === "venue" ? "venues" : "";


const mapLayer19 = (show, hide) => (p) => { const k = layerOf19(p); return !k ? true : show[k] && !(hide || {})[k + ":" + catOf19(p)]; };


function MapLegend19({ pins, show, setShow, hide, setHide }) {
  const h = React.createElement;
  const [openK, setOpenK] = useState("");
  const members = (k) => { const seen = {}; return pins.filter((p) => layerOf19(p) === k).filter((p) => { const key = p.coId || p.id; if (seen[key]) return false; seen[key] = 1; return true; }); };
  const cats = (k) => { const m = {}; members(k).forEach((p) => { const c = catOf19(p); m[c] = (m[c] || 0) + 1; }); return Object.keys(m).sort().map((c) => [c, m[c]]); };
  const count = {}; MAP_LAYERS19.forEach(([k]) => { count[k] = members(k).length; });
  const icon = { partners: h(Coin, { size: 17 }), pros: h(MapPerson17, { size: 18 }), dir: h(MapDot17, { cat: "bar", size: 18 }), venues: h(MapVenue20, { size: 18 }) };
  return h("div", { className: "ff-ml19", role: "group", "aria-label": "Map layers" },
    h("style", null, ".ff .ff-ml19 { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin:10px 0 14px; } .ff .ff-ml19 label { display:flex; align-items:center; gap:7px; font-size:12px; cursor:pointer; padding:6px 11px; border:1px solid var(--rule); border-radius:12px; corner-shape:squircle; background:#fff; color:var(--ink); } .ff .ff-ml19 input { accent-color:#7E611D; width:15px; height:15px; margin:0; } .ff .ff-ml19-row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; } .ff .ff-ml19-x { border:0; background:none; cursor:pointer; padding:0 0 0 4px; font-size:12px; color:inherit; } .ff .ff-ml19-list { width:100%; max-height:190px; overflow:auto; border:1px solid var(--rule, #d8d2c6); border-radius:16px; background:var(--card, #fff); padding:6px; display:flex; flex-direction:column; } .ff .ff-ml19-list button { text-align:left; border:0; background:none; cursor:pointer; padding:7px 10px; border-radius:10px; font-size:12px; color:inherit; } .ff .ff-ml19-list button:hover { background:rgba(0,0,0,.05); } .ff .ff-ml19-row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; } .ff .ff-ml19-x { border:0; background:none; cursor:pointer; padding:0 0 0 4px; font-size:12px; color:inherit; } .ff .ff-ml19-list { width:100%; max-height:220px; overflow:auto; border:1px solid var(--rule, #d8d2c6); border-radius:16px; background:var(--card, #fff); padding:6px; display:flex; flex-direction:column; } .ff .ff-ml19-list label { display:flex; align-items:center; gap:8px; border:0; border-radius:10px; padding:7px 10px; font-size:12px; cursor:pointer; background:none; } .ff .ff-ml19-list label:hover { background:rgba(0,0,0,.05); } .ff .ff-ml19-list label span { margin-left:auto; opacity:.6; }"),
    h("div", { className: "ff-ml19-row" }, MAP_LAYERS19.map(([k, label]) => h("label", { key: k }, h("input", { type: "checkbox", checked: !!show[k], onChange: () => setShow({ ...show, [k]: !show[k] }) }), icon[k], label + (count[k] ? " (" + count[k] + ")" : ""),
      count[k] ? h("button", { type: "button", className: "ff-ml19-x", "aria-expanded": openK === k, "aria-label": label + " categories", onClick: (e) => { e.preventDefault(); e.stopPropagation(); setOpenK(openK === k ? "" : k); } }, openK === k ? "\u25B4" : "\u25BE") : null))),
    openK ? h("div", { className: "ff-ml19-list" }, cats(openK).map(([c, n]) => h("label", { key: c }, h("input", { type: "checkbox", checked: !hide[openK + ":" + c], onChange: () => setHide({ ...hide, [openK + ":" + c]: !hide[openK + ":" + c] }) }), c, h("span", null, n)))) : null);
}



function FFMap({ mode = "home" }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState({ partners: true, pros: true, dir: true, venues: true });
  const [hideCat, setHideCat] = useState({});
  const home = mode === "home";

  const pins0 = useMemo(() => {
    const people = directory.map(p => ({ ...p, kind: "person", area: (p.locations || []).find(l => MAP_AREAS[l]) })).filter(p => p.area);
    const p1 = mode === "phase1";
    const all = home || p1
      ? [...people, ...(p1 ? [] : MAP_BUSINESSES.map(b => ({ ...b, kind: "business" }))),
         ...VENUES.map(v => ({ ...v, vtype: v.kind, kind: "venue", venue: true })), ...(p1 ? [] : MAP_EVENTS.map(e => ({ ...e, kind: "event" })))]
      : mode === "network" ? [...people, ...VENUES.map((v) => ({ ...v, vtype: v.kind, kind: "venue", venue: true }))] : people;
    const seen = {};
    const RING = [[0, 0], [7, -6], [-7, 5], [8, 7], [-8, -6], [0, 9], [0, -9], [11, 0], [-11, 0], [10, -9], [-10, 9]];
    const cos = mode === "phase1" ? [] : COMPANY_PINS11.map(p => ({ ...p, x: (p.ll[1] + 0.4045) / 0.00525, y: (51.654 - p.ll[0]) / 0.002957 + 9 }));
    const partnerPins = mode !== "network" ? [] : companyList(state).filter((c) => !c.unclaimed && !c.mine && (c.locations || []).length).flatMap((c) => c.locations.map((l, i) => { const ll = [l.lat, l.lng]; return { id: "pt_" + c.id + "_" + i, coId: c.id, kind: "company", partner: true, name: c.name, profession: c.kind, area: l.label, ll, ldn: inLondon11(ll), cat: c.cat || "bar", x: (ll[1] + 0.4045) / 0.00525, y: (51.654 - ll[0]) / 0.002957 + 9 }; }));
    return [...all.map(p => {
      const [bx, by] = MAP_AREAS[p.area];
      const n = (seen[p.area] = (seen[p.area] || 0) + 1) - 1;
      const ring = RING[n % RING.length];
      return { ...p, x: Math.max(4, Math.min(96, bx + ring[0])), y: Math.max(5, Math.min(95, by + ring[1])) };
    }), ...cos, ...partnerPins];
  }, [home, mode, directory.length, state.company]);
  const netQ = useContext(NetQ17), searching = mode === "network" && !!String(netQ || "").trim();
  const netPillar = mode === "network" && !searching ? (state.netPillar17 || "") : "";
  const pinsAll = useMemo(() => {
    if (!netPillar) return pins0;
    return pins0.filter((p) => p.kind === "company" ? PILLAR_OF_CAT17[p.cat || "bar"] === netPillar : p.kind === "person" ? PILLAR_OF_GROUP17[p.group] === netPillar : false);
  }, [pins0, netPillar]);
  /* While a network search is active the map shows only the matching people, companies and Directory entries (venues are hidden). */
  const hitCos = useMemo(() => { const f = searching ? netSearch17(state, netQ) : null; return f ? new Set([...f.cos, ...f.dir].map(c => c.id)) : null; }, [searching, netQ, state.company, state.admin17]);
  const pinsFound = useMemo(() => !searching ? pinsAll : pinsAll.filter(p => p.kind === "person" ? personSearchText(p).includes(String(netQ).trim().toLowerCase()) : p.kind === "company" ? hitCos.has(p.coId) : false), [pinsAll, searching, netQ, hitCos]);
  const pins = useMemo(() => mode !== "network" ? pinsAll : pinsFound.filter(mapLayer19(show, hideCat)), [pinsAll, pinsFound, show, hideCat, mode]);

  const boxRef = useRef(null), mapRef = useRef(null);
  const [fallback, setFallback] = useState(() => !window.L || !ukGeo11());
  const [hosts, setHosts] = useState(null);
  const [view, setView] = useState("uk");
  const toLL = (x, y) => [51.654 - 0.002957 * (y - 9), -0.4045 + 0.00525 * x];
  const flyUK = () => { const m = mapRef.current; if (m) m.flyToBounds(UK_BOUNDS11, { duration: 1.1, padding: [8, 8] }); };
  const flyWorld = () => { const m = mapRef.current; if (m) m.flyTo([34, 10], 1.5, { duration: 1.3 }); };
  const flyLondon = () => { const m = mapRef.current; if (m) m.flyToBounds(LONDON_BOUNDS11, { duration: 1.3, padding: [6, 6] }); };

  useEffect(() => {
    if (fallback || !boxRef.current) return;
    const L = window.L, G = ukGeo11();
    let map;
    try {
      map = L.map(boxRef.current, {
        zoomControl: false, attributionControl: false, scrollWheelZoom: false, dragging: !L.Browser.mobile,
        zoomSnap: 0.25, zoomDelta: 1, minZoom: 0.5, maxZoom: 13, preferCanvas: true,
        maxBounds: [[-80, -200], [86, 200]], maxBoundsViscosity: 0.9, worldCopyJump: false,
      });
      mapRef.current = map;
      map.fitBounds(UK_BOUNDS11, { padding: [8, 8] });
      const cv = L.canvas({ padding: 0.4 });
      const area = (sets, style) => sets && sets.length ? L.polygon(sets.map(p => p.map(decRing11)), { renderer: cv, interactive: false, ...style }) : null;
      const line = (sets, style) => sets && sets.length ? L.polyline(sets.map(decRing11), { renderer: cv, interactive: false, ...style }) : null;
      [
        area(G.world, { color: "#6E9A5A", opacity: 0.55, weight: 0.7, fillColor: "#C9DDB0", fillOpacity: 1 }),
        area(G.ie, { color: "#5E8C4A", opacity: 0.7, weight: 1, fillColor: "#B9D69B", fillOpacity: 1 }),
        area(G.gb, { color: "#4E7F3C", opacity: 0.9, weight: 1.3, fillColor: "#9FCB7A", fillOpacity: 1 }),
        area(G.lakes, { stroke: false, fillColor: "#8FC3E6", fillOpacity: 1 }),
        line(G.rivers, { color: "#4F9AD3", opacity: 0.8, weight: 1 }),
      ].forEach(l => l && l.addTo(map));
      const adm = area(G.adm, { color: "#3F6B33", opacity: 0.3, weight: 0.6, fill: false });
      const ldn = area(G.ldnu, { color: "#3F6B33", opacity: 0.6, weight: 1.2, fillColor: "#86B862", fillOpacity: 0.7 });
      const m25 = L.polyline(smooth11(M25_11, true), { renderer: cv, interactive: false, color: "#8C1526", opacity: 0.85, weight: 1.6, dashArray: "7 6" });
      const thSm = G.thames && G.thames.map(r => smooth11(decRing11(r), false, 2));
      const thames = L.layerGroup(thSm ? [
        L.polyline(thSm, { renderer: cv, interactive: false, color: "#2F7FC1", opacity: 0.95, weight: 4.5, lineJoin: "round", lineCap: "round" }),
        L.polyline(thSm, { renderer: cv, interactive: false, color: "#BFE3F7", opacity: 0.9, weight: 1.6, lineJoin: "round", lineCap: "round" }),
      ] : []);
      const m25lbl = L.marker([51.7, -0.075], { interactive: false, keyboard: false,
        icon: L.divIcon({ className: "ff-lm25", html: "<span>M25</span>", iconSize: [0, 0] }) });

      UK_CITIES11.forEach(([nm, la, lo, big, left]) => {
        L.marker([la, lo], { interactive: false, keyboard: false,
          icon: L.divIcon({ className: `ff-lcity${big ? " big" : ""}${left ? " l" : ""}`, html: `<i></i><span>${nm}</span>`, iconSize: [0, 0] }) }).addTo(map);
      });
      const h = {};
      pins.forEach(p => {
        const m = L.marker(p.ll || toLL(p.x, p.y), { interactive: false, keyboard: false, zIndexOffset: p.kind === "person" ? 100 : p.kind === "company" ? 300 : 0,
          icon: L.divIcon({ className: "ff-lpin" + (p.kind === "company" ? " ff-lco" + (p.ldn ? " ldn" : "") : ""), html: "<div></div>", iconSize: [0, 0] }) }).addTo(map);
        h[p.kind + p.id] = m.getElement().firstChild;
      });
      L.control.zoom({ position: "topright" }).addTo(map);

      const sync = () => {
        const z = map.getZoom(), f = z < NEAR_Z11;
        if (boxRef.current) { boxRef.current.classList.toggle("far", f); boxRef.current.classList.toggle("world", z < WORLD_Z11); }
        if (z >= 6.5 && z < 8) { if (!map.hasLayer(adm)) adm.addTo(map); } else if (map.hasLayer(adm)) map.removeLayer(adm);
        if (z >= 8) { if (!map.hasLayer(ldn)) { ldn.addTo(map); m25.addTo(map); m25lbl.addTo(map); thames.addTo(map); thames.eachLayer(l => l.bringToFront()); } }
        else if (map.hasLayer(ldn)) { map.removeLayer(ldn); map.removeLayer(m25); map.removeLayer(m25lbl); map.removeLayer(thames); }
        setView(z < WORLD_Z11 ? "world" : f ? "uk" : "london");
      };
      map.on("zoomend", sync); sync();
      setHosts(h);
      return () => { setHosts(null); mapRef.current = null; map.remove(); };
    } catch (e) {
      if (map) map.remove();
      mapRef.current = null;
      setFallback(true);
    }
  }, [fallback, pins]);

  const renderPin = (p, pos) => {
    const on = sel && sel.id === p.id && sel.kind === p.kind;
    return (
      <button key={p.kind + p.id} className="ff-pin" style={{ ...pos, zIndex: on ? 3 : 1 }}
        onClick={() => setSel(p)} aria-label={`${MAP_LAYER[p.kind].label}: ${p.name}`}>
        {p.kind === "company" ? (
          <MapDot17 cat={p.cat || "bar"} on={on} />
        ) : p.kind === "person" ? (
          <MapPerson17 on={on} />
        ) : p.kind === "event" ? (
          <span style={{ display: "block", width: on ? 18 : 14, height: on ? 18 : 14, transform: "rotate(45deg)", background: MAP_LAYER.event.color, border: "1.5px solid #EAD79C", boxShadow: on ? "0 0 10px rgba(47,138,126,.9)" : "none" }} />
        ) : p.kind === "venue" ? (
          <MapVenue20 size={on ? 28 : 22} on={on} />
        ) : (<>
          {p.kind === "business" && <span style={{ position: "absolute", inset: -7, borderRadius: "50%", border: "1px solid rgba(140,21,38,.9)", background: "rgba(92,18,32,.5)" }} />}
          <span style={{ position: "relative", display: "block", filter: on ? "drop-shadow(0 0 8px rgba(201,162,39,.9))" : "none" }}>
            <MapCoin size={on ? 30 : 24} tier={p.tier} />
          </span>
        </>)}
      </button>
    );
  };
  const nPeople = pins.filter(p => p.kind === "person").length;
  const nCo = new Set(pins.filter(p => p.kind === "company").map(p => p.coId)).size;
  const nLdn = pins.filter(p => p.kind !== "company" || p.ldn).length;

  return (
    <div>
      {!fallback ? (
        <div className="ff-map ff-map-real ff-map-uk" style={{ height: 440, isolation: "isolate" }}>
          <div ref={boxRef} className="ff-map-uk-in far" style={{ position: "absolute", inset: 0 }} />
          {hosts && pins.map(p => {
            const host = hosts[p.kind + p.id];
            return host ? ReactDOM.createPortal(renderPin(p, { left: 0, top: 0 }), host, p.kind + p.id) : null;
          })}
          <div className="ff-map-seg" role="group" aria-label="Map view">
            <button type="button" className="globe" aria-pressed={view === "world"} onClick={flyWorld} aria-label="World" title="World"><I11.Globe size={15} /></button>
            <button type="button" aria-pressed={view === "uk"} onClick={flyUK}>UK</button>
            <button type="button" aria-pressed={view === "london"} onClick={flyLondon}>London</button>
          </div>
        </div>
      ) : (
        <div className="ff-map ff-lattice" style={{ height: 380 }}>
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
            {[15, 30, 45, 60, 75, 90].map(y => <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#C9A227" strokeOpacity=".08" strokeWidth=".25" />)}
            {[15, 30, 45, 60, 75, 90].map(x => <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#C9A227" strokeOpacity=".08" strokeWidth=".25" />)}
            <path d="M -2 62 C 20 56, 32 70, 50 64 C 68 58, 80 70, 102 63" fill="none" stroke="#C9A227" strokeOpacity=".38" strokeWidth="1.2" />
            <path d="M -2 62 C 20 56, 32 70, 50 64 C 68 58, 80 70, 102 63" fill="none" stroke="#8C1526" strokeOpacity=".35" strokeWidth="3" />
          </svg>
          {Object.entries(MAP_AREAS).map(([a, [x, y]]) => (
            <span key={a} style={{ position: "absolute", left: `${x}%`, top: `${y}%`, transform: "translate(-50%,-260%)", fontSize: 8, letterSpacing: ".16em", textTransform: "uppercase", color: "rgba(234,215,156,.45)", whiteSpace: "nowrap", pointerEvents: "none" }}>{a}</span>
          ))}
          {pins.filter(p => p.kind !== "company" || (p.ldn && p.x > 2 && p.x < 98 && p.y > 2 && p.y < 98)).map(p => renderPin(p, { left: `${p.x}%`, top: `${p.y}%` }))}
        </div>
      )}

      {mode === "network" && <MapLegend19 pins={pinsFound} show={show} setShow={setShow} hide={hideCat} setHide={setHideCat} />}
      <div style={{ display: mode === "network" ? "none" : "flex", gap: 14, alignItems: "center", justifyContent: "center", margin: "10px 0 14px", flexWrap: "wrap" }}>
        <span className="ff-body ff-muted" style={{ fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}><MapPerson17 size={18} /> Professionals{nPeople ? ` (${nPeople})` : ""}</span>
        {companyLegend17(pins)}
        {(home || mode === "phase1") && <>
          {home && <span className="ff-body ff-muted" style={{ fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid rgba(140,21,38,.9)", background: "rgba(92,18,32,.5)", display: "block" }} /> Hospitality businesses
          </span>}
          <span className="ff-body ff-muted" style={{ fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: MAP_LAYER.venue.color, border: "1px solid #141416", display: "block" }} /> Venues
          </span>
          {home && <span className="ff-body ff-muted" style={{ fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 10, height: 10, transform: "rotate(45deg)", background: MAP_LAYER.event.color, display: "block" }} /> Events
          </span>}
        </>}
      </div>

      {sel ? (
        <div>
          {sel.kind === "company" ? (() => { const co = companyList(state).find(x => x.id === sel.coId) || companyById(state, sel.coId); return co ? (
            <button type="button" className="ff-co11-tile" style={{ display: "block", margin: "0 auto", maxWidth: 360, width: "100%" }} onClick={() => { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); }} aria-label={`${co.name}: open their page`}>
              <CompanyCardFace c={co} size="sm" />
            </button>) : null; })()
            : sel.kind === "business" ? <OrgCard org={{ ...sel, kind: sel.profession }} kindLabel="Company" width="100%" />
            : sel.kind === "venue" ? <VenueCard venue={sel} width="100%" />
            : sel.kind === "event" ? (
              <div className="ff-tile dark" style={{ width: "100%", minHeight: 0, gap: 6 }}>
                <Corners />
                <span className="ff-label" style={{ color: "#7FC7BC" }}>Event · {sel.area}</span>
                <span className="ff-display" style={{ fontSize: 15, color: "#F2ECE0" }}>{sel.name}</span>
                <span className="ff-serif" style={{ fontSize: 13.5, color: "rgba(242,236,224,.75)" }}>{sel.note}</span>
              </div>
            ) : (<>
              <PlayerCard person={{ ...sel, tag: sel.tag, photo: sel.photo, level: sel.level || 3 }} format="mini" themeKey={sel.theme || "onyx"} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <span className="ff-label" style={{ color: "var(--gold-dk)" }}>{TIERS[sel.tier] ? TIERS[sel.tier].name : ""} · {sel.area}</span>
                <span style={{ flex: 1, height: 1, background: "var(--rule)" }} />
                <button onClick={() => { dispatch({ type: "VIEW", id: sel.id }); window.scrollTo(0, 0); }} className="ff-btn sm ghost">View profile</button>
              </div>
            </>)}
        </div>
      ) : null}
    </div>
  );
}
