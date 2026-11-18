/* src/components/shared/map.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   THE MAP (FF Team, FF Staff, FF Party) — a standard Leaflet map on CARTO Voyager tiles (OpenStreetMap data), the familiar
   look of every map app. Under the tiles sits a simple drawing of the UK from Natural Earth data (public domain, embedded in
   the page as #ff-ukgeo): it shows only while tiles have not arrived (or when they cannot load), so the map is never blank.
   It opens on the UK; the London button frames Greater London. People's pins stay area-only; v17.14: venues from Google's
   business search sit at their own point.
   v17.28: back to one pin per place, a green drawn map and place names (MAP_TOWNS27); tiles are off (MAP_TILES27).
   (v17.21, withdrawn) pins that would overlap were grouped into one numbered cluster (a squircle ringed in the category colours); tap a
   cluster to zoom into it. The grouping is a plain screen-distance grouping (a dot within CLUSTER_R21 screen pixels (56 when zoomed in) of a group joins it) recomputed on every zoom, so hundreds of
   dots stay readable. To change the map style, change TILE_URL21 only.
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


/* v17.28: place names on the drawn map, [name, lat, lng, rank]. Rank 1 shows from the UK view, 2 from the first zoom in,
   3 closer still. Coordinates are the ones the FF Event Directory's location list uses (content/data/fd-rows.json).
   A name is left off when it would touch one already placed, so the map never crowds; zooming in brings more out. */
const MAP_TOWNS27 = [
  ["London", 51.5, -0.167, 1], ["Birmingham", 52.48, -1.898, 1], ["Manchester", 53.417, -2.25, 1], ["Leeds", 53.796, -1.548, 1], ["Liverpool", 53.417, -2.917, 1],
  ["Newcastle", 55.0, -1.667, 1], ["Bristol", 51.45, -2.6, 1], ["Cardiff", 51.5, -3.167, 1], ["Edinburgh", 55.95, -3.193, 1], ["Glasgow", 55.865, -4.258, 1],
  ["Belfast", 54.583, -5.917, 1], ["Aberdeen", 57.144, -2.098, 1], ["Norwich", 52.628, 1.298, 1], ["Inverness", 57.479, -4.224, 1], ["Plymouth", 50.383, -4.133, 1],
  ["Southampton", 50.917, -1.383, 1], ["Nottingham", 52.967, -1.15, 1], ["Sheffield", 53.417, -1.5, 1], ["Dublin", 53.35, -6.26, 1], ["Brighton", 50.828, -0.14, 2],
  ["Oxford", 51.752, -1.256, 2], ["Cambridge", 52.2, 0.117, 2], ["Leicester", 52.633, -1.133, 2], ["Coventry", 52.417, -1.5, 2], ["Hull", 53.75, -0.333, 2],
  ["York", 53.964, -1.091, 2], ["Swansea", 51.621, -3.943, 2], ["Exeter", 50.724, -3.527, 2], ["Bournemouth", 50.721, -1.879, 2], ["Portsmouth", 50.8, -1.067, 2],
  ["Reading", 51.45, -0.967, 2], ["Milton Keynes", 52.083, -0.75, 2], ["Luton", 51.891, -0.428, 2], ["Stoke-on-Trent", 53.0, -2.167, 2], ["Derby", 52.921, -1.472, 2],
  ["Peterborough", 52.583, -0.25, 2], ["Ipswich", 52.059, 1.155, 2], ["Dundee", 56.469, -2.975, 2], ["Carlisle", 54.895, -2.938, 2], ["Middlesbrough", 54.533, -1.2, 2],
  ["Preston", 53.763, -2.704, 2], ["Bath", 51.375, -2.362, 2], ["Canterbury", 51.279, 1.08, 2], ["Lincoln", 53.227, -0.538, 2], ["Chester", 53.191, -2.892, 2],
  ["Derry", 54.998, -7.309, 2], ["Perth", 56.395, -3.431, 2], ["Stirling", 56.115, -4.234, 2], ["Cork", 51.898, -8.476, 2], ["Galway", 53.271, -9.049, 2],
  ["Limerick", 52.664, -8.623, 2], ["St Albans", 51.75, -0.333, 3], ["Watford", 51.655, -0.396, 3], ["Northampton", 52.25, -0.883, 3], ["Cheltenham", 51.9, -2.08, 3],
  ["Gloucester", 51.866, -2.243, 3], ["Worcester", 52.189, -2.22, 3], ["Swindon", 51.583, -1.75, 3], ["Southend-on-Sea", 51.533, 0.7, 3], ["Colchester", 51.889, 0.904, 3],
  ["Chelmsford", 51.736, 0.47, 3], ["Maidstone", 51.267, 0.517, 3], ["Guildford", 51.235, -0.574, 3], ["Slough", 51.5, -0.567, 3], ["Blackpool", 53.833, -3.033, 3],
  ["Bolton", 53.583, -2.5, 3], ["Wolverhampton", 52.583, -2.117, 3], ["Bradford", 53.833, -1.833, 3], ["Sunderland", 54.883, -1.417, 3], ["Durham", 54.777, -1.576, 3],
  ["Harrogate", 53.991, -1.537, 3], ["Newport", 51.588, -2.998, 3], ["Truro", 50.265, -5.054, 3], ["Lancaster", 54.047, -2.8, 3], ["Shrewsbury", 52.71, -2.752, 3],
  ["Hereford", 52.057, -2.715, 3], ["Salisbury", 51.069, -1.796, 3], ["Winchester", 51.065, -1.319, 3], ["Wakefield", 53.681, -1.499, 3], ["Doncaster", 53.5, -1.083, 3],
  ["Huddersfield", 53.649, -1.784, 3], ["Warrington", 53.417, -2.583, 3], ["Crawley", 51.113, -0.183, 3], ["Basingstoke", 51.263, -1.087, 3], ["Bedford", 52.188, -0.453, 3],
  ["Stevenage", 51.902, -0.203, 3], ["Telford", 52.677, -2.449, 3], ["Taunton", 51.015, -3.103, 3], ["Torquay", 50.462, -3.525, 3], ["Hastings", 50.856, 0.58, 3],
  ["Eastbourne", 50.769, 0.284, 3], ["Margate", 51.381, 1.386, 3], ["Dover", 51.126, 1.313, 3], ["Scarborough", 54.28, -0.404, 3], ["Kendal", 54.327, -2.748, 3],
  ["Bangor", 54.661, -5.668, 3], ["Aberystwyth", 52.416, -4.083, 3], ["Wrexham", 53.0, -3.0, 3], ["Lisburn", 54.523, -6.035, 3], ["Newry", 54.178, -6.337, 3],
  ["Ayr", 55.463, -4.634, 3], ["Dumfries", 55.07, -3.611, 3], ["Falkirk", 56.0, -3.75, 3], ["Paisley", 55.832, -4.433, 3]
];
/* v17.29: London area names, drawn from the London view inwards (rank 4). */
const MAP_LONDON27 = [["Shoreditch", 51.5265, -0.0780], ["Soho", 51.5137, -0.1337], ["Camden", 51.5390, -0.1426], ["The City", 51.5155, -0.0922], ["Mayfair", 51.5099, -0.1478],
  ["Covent Garden", 51.5117, -0.1240], ["Kensington", 51.4990, -0.1938], ["Chelsea", 51.4875, -0.1687], ["Notting Hill", 51.5090, -0.1960], ["Canary Wharf", 51.5054, -0.0235],
  ["Brixton", 51.4613, -0.1156], ["Clapham", 51.4620, -0.1380], ["Hackney", 51.5450, -0.0553], ["Islington", 51.5380, -0.1030], ["Greenwich", 51.4826, -0.0077],
  ["Stratford", 51.5416, -0.0033], ["King's Cross", 51.5308, -0.1238], ["Southwark", 51.5035, -0.0900], ["Battersea", 51.4700, -0.1670], ["Hammersmith", 51.4927, -0.2229],
  ["Fulham", 51.4740, -0.2010], ["Peckham", 51.4740, -0.0690], ["Wimbledon", 51.4214, -0.2064], ["Richmond", 51.4613, -0.3037], ["Croydon", 51.3762, -0.0982],
  ["Wembley", 51.5520, -0.2960], ["Ealing", 51.5130, -0.3040], ["Tottenham", 51.5975, -0.0680], ["Bromley", 51.4060, 0.0140], ["Kingston", 51.4120, -0.3000],
  ["Walthamstow", 51.5830, -0.0200], ["Hampstead", 51.5560, -0.1780], ["Barnet", 51.6500, -0.2000], ["Enfield", 51.6520, -0.0810], ["Romford", 51.5770, 0.1830],
  ["Bexleyheath", 51.4580, 0.1400], ["Uxbridge", 51.5460, -0.4790], ["Harrow", 51.5800, -0.3340], ["Sutton", 51.3610, -0.1930], ["Ilford", 51.5590, 0.0740]].map((r) => [...r, 4]);
/* Smallest zoom at which each rank is drawn. */
const MAP_TOWN_Z27 = { 1: 0, 2: 6.25, 3: 7.5, 4: 9 };
/* The drawn map is the map: land green, sea blue. Set MAP_TILES27 to true to lay map-server tiles (TILE_URL21) over it. */
const MAP_TILES27 = false;


const UK_BOUNDS11 = [[49.9, -8.2], [58.7, 1.8]];


const WORLD_Z11 = 3.5;


const LDN11 = [51.5, -0.12];


const NEAR_Z11 = 8.5;


const TILE_URL21 = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";


const TILE_ATTR21 = "\u00A9 <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\" rel=\"noopener\">OpenStreetMap</a> \u00A9 <a href=\"https://carto.com/attributions\" target=\"_blank\" rel=\"noopener\">CARTO</a>";


const CLUSTER_R21 = 76;


const CLUSTER_Z21 = 11.5;


const clusterColour21 = (p) => p.kind === "company" ? (MAP_COL17[p.cat || "bar"] || MAP_COL17.bar) : p.kind === "person" ? "#141416" : p.kind === "venue" ? "#C6C8CC" : "#C9A227";


/* The ring of a cluster: its members' category colours as arcs, in proportion. */
const clusterRing21 = (members) => {
  const by = {};
  members.forEach((p) => { const c = clusterColour21(p); by[c] = (by[c] || 0) + 1; });
  let at = 0;
  const stops = Object.entries(by).sort((a, b) => b[1] - a[1]).map(([c, n]) => { const from = at; at += n / members.length * 100; return `${c} ${from}% ${at}%`; });
  return `conic-gradient(${stops.join(",")})`;
};


/* The frame of the London button (Greater London). 17.21: no M25 overlay any more. */
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
  [...REAL_COMPANIES11, ...REAL_SUPPLIERS17].filter(c => c.unclaimed).forEach(c => (c.locations || []).forEach((l, i) => {
    const k = l.lat.toFixed(2) + "," + l.lng.toFixed(2), n = (seen[k] = (seen[k] || 0) + 1) - 1;
    const a = n * 2.4, r = n ? 0.012 + 0.006 * Math.floor(n / 6) : 0;
    const ll = [l.lat + r * Math.sin(a), l.lng + r * 1.6 * Math.cos(a)];
    out.push({ id: "co_" + c.slug + "_" + i, coId: "co_" + c.slug, kind: "company", name: c.name, profession: c.kind, area: l.label, ll, ldn: inLondon11(ll), cat: c.cat || "bar" });
  }));
  return out;
})();



/* Map gestures (every Leaflet map): on a touch screen one finger scrolls the page and two fingers pan and zoom (Leaflet's
   touchZoom pans with the pinch); a mouse press turns dragging back on, a touch turns it off again. The wheel scrolls the
   page; ctrl/cmd + wheel (and a trackpad pinch) zooms. Returns a clean-up function. */
function ffMapGestures17(map, el) {
  const touchy = (navigator.maxTouchPoints || 0) > 0 || "ontouchstart" in window;
  const drag = (on) => { if (!map.dragging) return; if (on && !map.dragging.enabled()) map.dragging.enable(); if (!on && map.dragging.enabled()) map.dragging.disable(); };
  drag(!touchy);
  const down = (e) => drag(e.pointerType === "mouse");
  const wheel = (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    const step = Math.max(-1, Math.min(1, -e.deltaY / (e.deltaMode ? 3 : 100)));
    map.setZoomAround(map.mouseEventToContainerPoint(e), map.getZoom() + step, { animate: false });
  };
  el.addEventListener("pointerdown", down, true);
  el.addEventListener("wheel", wheel, { passive: false });
  return () => { el.removeEventListener("pointerdown", down, true); el.removeEventListener("wheel", wheel); };
}


/* v17.29: venues are not on this map (a separate Google map for venues may follow); the Directory layer reads "FF Directory". */
/* v17.30: the legend lists Professionals and FF Directory only; FireFlair partner companies stay on the map and are always shown. */
const MAP_LAYERS19 = [["pros", "Professionals"], ["dir", "FF Directory"]];


function MapVenue20({ size = 22, on }) {
  return React.createElement("span", { style: { width: size, height: size, borderRadius: "50%", background: MAP_LAYER.venue.color, border: "1.5px solid #141416", display: "inline-grid", placeItems: "center", flex: "none", boxShadow: on ? "0 0 10px rgba(198,200,204,.9)" : "none" } },
    React.createElement(Building2, { size: Math.round(size * 0.58), color: "#141416", strokeWidth: 1.8 }));
}


const catOf19 = (p) => p.kind === "person" ? (p.profession || p.group || "Other") : p.kind === "company" ? ((NET_CO_TYPES17.find((x) => x[0] === (p.cat || "bar")) || [])[1] || "Bar companies") : p.kind === "venue" ? (p.kind2 || p.vtype || p.venueKind || "Venue") : "";


const layerOf19 = (p) => p.kind === "person" ? "pros" : p.kind === "company" ? (p.partner ? "partners" : "dir") : p.kind === "venue" ? "venues" : "";


/* v17.48: a person counts under each of their top 3 professions; their one pin shows if any of those is switched on.
   cats: the Professionals list shows the groups those professions are in (Bar, Front of House, ... Food), each person once per group. */
const catsOf19 = (p) => p.kind === "person" ? [...new Set((p.profs17 || [{ group: p.group || "Other" }]).map((x) => groupLabel17(x.group || "Other")))] : [catOf19(p)];


const mapLayer19 = (show, hide) => (p) => { const k = layerOf19(p); return !k ? true : show[k] && catsOf19(p).some((c) => !(hide || {})[k + ":" + c]); };


function MapLegend19({ pins, show, setShow, hide, setHide }) {
  const h = React.createElement;
  const [openK, setOpenK] = useState("");
  const members = (k) => { const seen = {}; return pins.filter((p) => layerOf19(p) === k).filter((p) => { const key = p.coId || p.id; if (seen[key]) return false; seen[key] = 1; return true; }); };
  const cats = (k) => { const m = {}; members(k).forEach((p) => { catsOf19(p).forEach((c) => { m[c] = (m[c] || 0) + 1; }); }); const ord = (c) => { const i = CATEGORY_ORDER.map(groupLabel17).indexOf(c); return i < 0 ? 99 : i; }; return Object.keys(m).sort((a, b) => k === "pros" ? ord(a) - ord(b) || a.localeCompare(b) : a.localeCompare(b)).map((c) => [c, m[c]]); };
  const count = {}; MAP_LAYERS19.forEach(([k]) => { count[k] = members(k).length; });
  const icon = { partners: h(Coin, { size: 17 }), pros: h(MapPerson17, { size: 18 }), dir: h(MapDot17, { cat: "bar", size: 18 }), venues: h(MapVenue20, { size: 18 }) };
  return h("div", { className: "ff-ml19", role: "group", "aria-label": "Map layers" },
    h("style", null, ".ff .ff-ml19 { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin:10px 0 14px; } .ff .ff-ml19 label { display:flex; align-items:center; gap:7px; font-size:12px; cursor:pointer; padding:6px 11px; border:1px solid var(--rule); border-radius:12px; corner-shape:squircle; background:#fff; color:var(--ink); } .ff .ff-ml19 input { accent-color:#7E611D; width:15px; height:15px; margin:0; } .ff .ff-ml19-row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; } .ff .ff-ml19-x { border:0; background:none; cursor:pointer; padding:0 0 0 4px; font-size:12px; color:inherit; } .ff .ff-ml19-list { width:100%; max-height:190px; overflow:auto; border:1px solid var(--rule, #d8d2c6); border-radius:16px; background:var(--card, #fff); padding:6px; display:flex; flex-direction:column; } .ff .ff-ml19-list button { text-align:left; border:0; background:none; cursor:pointer; padding:7px 10px; border-radius:10px; font-size:12px; color:inherit; } .ff .ff-ml19-list button:hover { background:rgba(0,0,0,.05); } .ff .ff-ml19-row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; } .ff .ff-ml19-x { border:0; background:none; cursor:pointer; padding:0 0 0 4px; font-size:12px; color:inherit; } .ff .ff-ml19-list { width:100%; max-height:220px; overflow:auto; border:1px solid var(--rule, #d8d2c6); border-radius:16px; background:var(--card, #fff); padding:6px; display:flex; flex-direction:column; } .ff .ff-ml19-list label { display:flex; align-items:center; gap:8px; border:0; border-radius:10px; padding:7px 10px; font-size:12px; cursor:pointer; background:none; } .ff .ff-ml19-list label:hover { background:rgba(0,0,0,.05); } .ff .ff-ml19-list label span { margin-left:auto; opacity:.6; }"),
    h("div", { className: "ff-ml19-row" }, MAP_LAYERS19.filter(([k]) => count[k] > 0).map(([k, label]) => h("label", { key: k }, h("input", { type: "checkbox", checked: !!show[k], onChange: () => setShow({ ...show, [k]: !show[k] }) }), icon[k], label + (count[k] ? " (" + count[k] + ")" : ""),
      count[k] ? h("button", { type: "button", className: "ff-ml19-x", "aria-expanded": openK === k, "aria-label": label + " categories", onClick: (e) => { e.preventDefault(); e.stopPropagation(); setOpenK(openK === k ? "" : k); } }, openK === k ? "\u25B4" : "\u25BE") : null))),
    openK ? h("div", { className: "ff-ml19-list" }, cats(openK).map(([c, n]) => h("label", { key: c }, h("input", { type: "checkbox", checked: !hide[openK + ":" + c], onChange: () => setHide({ ...hide, [openK + ":" + c]: !hide[openK + ":" + c] }) }), c, h("span", null, n)))) : null);
}



function FFMap({ mode = "home" }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const [sel, setSel] = useState(null);
  const [show, setShow] = useState({ partners: true, pros: true, dir: true });
  const [hideCat, setHideCat] = useState({});
  const home = mode === "home";

  const pins0 = useMemo(() => {
    /* v17.6: a person with a base is plotted at the centre of their public base place (p.basePin, never the postcode point);
       everyone else keeps the area pin from their work areas. */
    const people = directory.map(p => ({ ...p, kind: "person", area: p.basePin ? p.basePin.label : (p.locations || []).find(l => MAP_AREAS[l]) })).filter(p => p.area);
    const p1 = mode === "phase1";
    const all = home || p1
      ? [...people, ...(p1 ? [] : MAP_BUSINESSES.map(b => ({ ...b, kind: "business" }))), ...(p1 ? [] : MAP_EVENTS.map(e => ({ ...e, kind: "event" })))]
      : people;
    const seen = {};
    const RING = [[0, 0], [7, -6], [-7, 5], [8, 7], [-8, -6], [0, 9], [0, -9], [11, 0], [-11, 0], [10, -9], [-10, 9]];
    const cos = mode === "phase1" ? [] : COMPANY_PINS11.map(p => ({ ...p, x: (p.ll[1] + 0.4045) / 0.00525, y: (51.654 - p.ll[0]) / 0.002957 + 9 }));
    const partnerPins = mode !== "network" ? [] : companyList(state).filter((c) => !c.unclaimed && !c.mine && (c.locations || []).length).flatMap((c) => c.locations.map((l, i) => { const ll = [l.lat, l.lng]; return { id: "pt_" + c.id + "_" + i, coId: c.id, kind: "company", partner: true, name: c.name, profession: c.kind, area: l.label, ll, ldn: inLondon11(ll), cat: c.cat || "bar", x: (ll[1] + 0.4045) / 0.00525, y: (51.654 - ll[0]) / 0.002957 + 9 }; }));
    const xyOf = (ll) => ({ x: (ll[1] + 0.4045) / 0.00525, y: (51.654 - ll[0]) / 0.002957 + 9 });
    /* v17.14: venues members added from Google's business search, each at its own point (people stay at area level). */
    const venuePins = home || p1 ? publicVenues17(state).map(v => {
      const ll = [v.rec.place.lat, v.rec.place.lng];
      return { id: "ven_" + v.key, kind: "venue", venue: true, name: v.rec.name, vtype: venTypeLabel17(v.rec.place), area: v.rec.area.name, ll, ldn: inLondon11(ll), rec: v.rec, ...xyOf(ll) };
    }) : [];
    /* The signed-in company's base (the seeded companies already have their pins above). */
    const mine = mode === "phase1" ? null : companyList(state).find(c => c.mine && baseHas17(c));
    const bp = mine ? basePublicPoint17(mine) : null;
    const minePin = bp && !COMPANY_PINS11.some(p => p.name === mine.name) ? (() => {
      const k = bp.lat.toFixed(2) + "," + bp.lng.toFixed(2); const n = (seen["co" + k] = (seen["co" + k] || 0) + 1) - 1;
      const ll = [bp.lat + (n ? 0.012 * Math.sin(n * 2.4) : 0), bp.lng + (n ? 0.019 * Math.cos(n * 2.4) : 0)];
      return [{ id: "base_mine", coId: "mine", kind: "company", partner: mode === "network", name: mine.name, profession: mine.kind, area: bp.label, ll, ldn: inLondon11(ll), cat: mine.cat || "bar", ...xyOf(ll) }];
    })() : [];
    return [...all.map(p => {
      if (p.basePin) {
        const k = p.basePin.lat.toFixed(2) + "," + p.basePin.lng.toFixed(2), n = (seen[k] = (seen[k] || 0) + 1) - 1;
        const ll = [p.basePin.lat + (n ? 0.012 * Math.sin(n * 2.4) : 0), p.basePin.lng + (n ? 0.019 * Math.cos(n * 2.4) : 0)];
        const xy = xyOf(ll);
        return { ...p, ll, x: Math.max(4, Math.min(96, xy.x)), y: Math.max(5, Math.min(95, xy.y)) };
      }
      const [bx, by] = MAP_AREAS[p.area];
      const n = (seen[p.area] = (seen[p.area] || 0) + 1) - 1;
      const ring = RING[n % RING.length];
      return { ...p, x: Math.max(4, Math.min(96, bx + ring[0])), y: Math.max(5, Math.min(95, by + ring[1])) };
    }), ...cos, ...partnerPins, ...minePin];
  }, [home, mode, directory.length, state.company, state.profile.base17, state.profile.live, state.profile.records && state.profile.records.venues]);
  const netQ = useContext(NetQ17), searching = mode === "network" && !!String(netQ || "").trim();
  const netPillar = mode === "network" && !searching ? (state.netPillar17 || "") : "";
  const pinsAll = useMemo(() => {
    if (!netPillar) return pins0;
    return pins0.filter((p) => p.kind === "company" ? PILLAR_OF_CAT17[p.cat || "bar"] === netPillar : p.kind === "person" ? (p.groups || [{ group: p.group }]).some((x) => PILLAR_OF_GROUP17[x.group] === netPillar) : false);
  }, [pins0, netPillar]);
  /* While a network search is active the map shows only the matching people, companies and Directory entries (venues are hidden). */
  const hitCos = useMemo(() => { const f = searching ? netSearch17(state, netQ) : null; return f ? new Set([...f.cos, ...f.dir].map(c => c.id)) : null; }, [searching, netQ, state.company, state.admin17]);
  const pinsFound = useMemo(() => !searching ? pinsAll : pinsAll.filter(p => p.kind === "person" ? !!netSearchHit17(p, String(netQ).trim().toLowerCase()) : p.kind === "company" ? hitCos.has(p.coId) : false), [pinsAll, searching, netQ, hitCos]);
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
        zoomControl: false, attributionControl: false, scrollWheelZoom: false, dragging: true, touchZoom: true,
        zoomSnap: 0.25, zoomDelta: 1, minZoom: 1, maxZoom: 16, preferCanvas: true,
        maxBounds: [[-80, -200], [86, 200]], maxBoundsViscosity: 0.9, worldCopyJump: false,
      });
      mapRef.current = map;
      const unGest = ffMapGestures17(map, boxRef.current);
      map.on("unload", unGest);
      map.fitBounds(UK_BOUNDS11, { padding: [8, 8] });
      /* Under the tiles: a plain drawing of the UK in the Voyager colours (shows only until tiles arrive, or if they cannot load). */
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
      /* Closer in: county lines, then Greater London and the Thames. */
      const adm = area(G.adm, { color: "#3F6B33", opacity: 0.3, weight: 0.6, fill: false });
      const ldn = area(G.ldnu, { color: "#3F6B33", opacity: 0.6, weight: 1.2, fillColor: "#86B862", fillOpacity: 0.7 });
      const thSm = G.thames && G.thames.map(r => smooth11(decRing11(r), false, 2));
      const thames = L.layerGroup(thSm ? [
        L.polyline(thSm, { renderer: cv, interactive: false, color: "#2F7FC1", opacity: 0.95, weight: 4.5, lineJoin: "round", lineCap: "round" }),
        L.polyline(thSm, { renderer: cv, interactive: false, color: "#BFE3F7", opacity: 0.9, weight: 1.6, lineJoin: "round", lineCap: "round" }),
      ] : []);
      if (MAP_TILES27) {
        const tiles = L.tileLayer(TILE_URL21, { subdomains: "abcd", maxZoom: 20, maxNativeZoom: 19 }).addTo(map);
        tiles.once("tileload", () => { if (boxRef.current) boxRef.current.classList.add("tiles-ok"); });
        L.control.attribution({ prefix: false, position: "bottomright" }).addAttribution(TILE_ATTR21).addTo(map);
      }
      L.control.zoom({ position: "topright" }).addTo(map);

      /* v17.28: every place is its own pin again (no numbered clusters). */
      const h = {};
      pins.forEach(p => {
        const m = L.marker(p.ll || toLL(p.x, p.y), { interactive: false, keyboard: false, zIndexOffset: p.kind === "person" ? 100 : p.kind === "company" ? 300 : 0,
          icon: L.divIcon({ className: "ff-lpin" + (p.kind === "company" ? " ff-lco" + (p.ldn ? " ldn" : "") : ""), html: "<div></div>", iconSize: [0, 0] }) }).addTo(map);
        h[p.kind + p.id] = m.getElement().firstChild;
      });
      setHosts(h);

      /* Place names: highest rank first; a name is skipped when its box would touch one already on the map. */
      const names = L.layerGroup().addTo(map);
      const drawNames = () => {
        names.clearLayers();
        const z = map.getZoom();
        if (z < WORLD_Z11) return;
        const b = map.getBounds().pad(0.05), placed = [];
        [...(z >= MAP_TOWN_Z27[4] ? MAP_LONDON27 : []), ...MAP_TOWNS27].forEach(([nm, la, lo, rank]) => {
          if (z < MAP_TOWN_Z27[rank] || !b.contains([la, lo]) || (nm === "London" && z >= MAP_TOWN_Z27[4])) return;
          const pt = map.latLngToContainerPoint([la, lo]);
          const w = nm.length * 7.2 + 14, hit = (bx) => placed.some(q => bx[0] < q[2] && bx[2] > q[0] && bx[1] < q[3] && bx[3] > q[1]);
          /* the name sits to the right of its dot; if that would touch another name it sits to the left instead */
          let box = [pt.x - 6, pt.y - 10, pt.x + w, pt.y + 10], left = false;
          if (hit(box)) { box = [pt.x - w, pt.y - 10, pt.x + 6, pt.y + 10]; left = true; if (hit(box)) return; }
          placed.push(box);
          L.marker([la, lo], { interactive: false, keyboard: false, zIndexOffset: 2000,
            icon: L.divIcon({ className: "ff-lcity ff-ltown27 r" + rank + (left ? " l" : ""), html: `<i></i><span>${nm}</span>`, iconSize: [0, 0] }) }).addTo(names);
        });
      };

      const sync = () => {
        const z = map.getZoom(), f = z < NEAR_Z11;
        if (boxRef.current) { boxRef.current.classList.toggle("far", f); boxRef.current.classList.toggle("world", z < WORLD_Z11); }
        setView(z < WORLD_Z11 ? "world" : f ? "uk" : "london");
        if (z >= 6.5 && z < 8.5) { if (!map.hasLayer(adm)) adm.addTo(map); } else if (map.hasLayer(adm)) map.removeLayer(adm);
        if (z >= 8.5) { if (!map.hasLayer(ldn)) { ldn.addTo(map); thames.addTo(map); thames.eachLayer(l => l.bringToFront()); } }
        else if (map.hasLayer(ldn)) { map.removeLayer(ldn); map.removeLayer(thames); }
        drawNames();
      };
      map.on("zoomend", sync); map.on("moveend", drawNames); sync();
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
          {pins.filter(p => (p.kind !== "company" && p.kind !== "venue") || (p.ldn && p.x > 2 && p.x < 98 && p.y > 2 && p.y < 98)).map(p => renderPin(p, { left: `${p.x}%`, top: `${p.y}%` }))}
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
          {SHOW_VENUES17 && <span className="ff-body ff-muted" style={{ fontSize: 11, display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 11, height: 11, borderRadius: 2, background: MAP_LAYER.venue.color, border: "1px solid #141416", display: "block" }} /> Venues
          </span>}
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
            : sel.kind === "venue" ? <a className="ff-ven17-sel" href={venueMapsUrl17(sel.rec)} target="_blank" rel="noopener noreferrer" aria-label={`${sel.name}: view on Google Maps`}><style>{VEN_CSS17}</style><VenueLandscapeCard record={sel.rec} noLink /></a>
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
