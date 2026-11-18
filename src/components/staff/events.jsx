/* src/components/staff/events.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
const eventTitle = (ev) => (ev && String(ev.title || "").trim()) || (ev && ev.kind ? ev.kind : "Your event");



/* ---- Job roles, grouped the way the FF Team profile groups professions -------------------
   A row of categories (Bar, Front of House, Chefs …), the roles in the chosen category, and a box
   for any other role. Used on the Staff step (tap a role to add a person) and on the shift details
   card (tap a role to set it). */
/* The coin spins only where it is wanted: once the page has loaded, near the screen, never on a slow
   or data-saving connection, a low-memory device, or with reduced motion. Otherwise it stays a flat, still disc. */
function useSpinReady11(ref) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const c = navigator.connection;
    if ((c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || ""))) || (navigator.deviceMemory && navigator.deviceMemory <= 2)) return;
    let near = false, loaded = document.readyState !== "loading", done = false;
    const chk = () => { if (near && loaded && !done) { done = true; setOk(true); } };
    const io = new IntersectionObserver(([e]) => { if (e && e.isIntersecting) { near = true; io.disconnect(); chk(); } }, { rootMargin: "600px 0px" });
    io.observe(el);
    const onLoad = () => { loaded = true; chk(); };
    if (!loaded) document.addEventListener("DOMContentLoaded", onLoad);
    const tm = setTimeout(onLoad, 2500);
    return () => { io.disconnect(); clearTimeout(tm); document.removeEventListener("DOMContentLoaded", onLoad); };
  }, []);
  return ok;
}


/* A flat disc that turns into a real 3D coin (a stack of gold discs for the rim, a face each side) once it is ready.
   Nothing runs while it is idle: it only moves while you drag or swipe it, and a tap still presses what is inside. */
function Spin3D11({ half = 8, inset = 0, back, className = "", children }) {
  const box = useRef(null), inn = useRef(null), ready = useSpinReady11(box);
  const st = useRef({ a: 0, x: 0, t: 0, v: 0, down: false, moved: false, id: null, to: 0 });
  const levels = useMemo(() => Array.from({ length: half * 2 + 1 }, (_, i) => i - half), [half]);
  const apply = (deg, ease) => { const el = inn.current; if (!el) return; el.style.transition = ease || "none"; el.style.transform = `rotateY(${deg}deg)`; };
  const onDown = (e) => { const z = st.current; z.down = true; z.moved = false; z.x = e.clientX; z.t = performance.now(); z.v = 0; z.id = e.pointerId; };
  const onMove = (e) => {
    const z = st.current; if (!z.down) return;
    const dx = e.clientX - z.x;
    if (!z.moved && Math.abs(dx) < 8) return;
    if (!z.moved) { z.moved = true; clearTimeout(z.to); if (inn.current) inn.current.style.willChange = "transform"; try { e.currentTarget.setPointerCapture(z.id); } catch (_) {} }
    const now = performance.now(), dt = Math.max(1, now - z.t);
    z.v = 0.8 * z.v + 0.2 * (dx / dt); z.x = e.clientX; z.t = now; z.a += dx * 1.1;
    apply(z.a);
  };
  const onUp = () => {
    const z = st.current; if (!z.down) return; z.down = false;
    if (!z.moved) return;
    const dir = z.v < 0 || (z.v === 0 && z.a < 0) ? -1 : 1;
    const turns = Math.max(1, Math.round(Math.abs(z.v) * 2.2));
    z.a = Math.round(z.a / 360) * 360 + dir * 360 * turns;
    const secs = 0.7 + 0.25 * turns;
    apply(z.a, `transform ${secs}s cubic-bezier(.15,.75,.2,1)`);
    z.to = setTimeout(() => { z.moved = false; if (inn.current) inn.current.style.willChange = ""; }, secs * 1000 + 80);
  };
  const stopClick = (e) => { if (st.current.moved) { e.preventDefault(); e.stopPropagation(); } };
  const live = ready ? { onPointerDown: onDown, onPointerMove: onMove, onPointerUp: onUp, onPointerCancel: onUp, onClickCapture: stopClick } : {};
  return (
    <div ref={box} className={`ff-sp3 ${className}${ready ? " live" : ""}`} {...live}>
      <div className="in" ref={inn}>
        {ready ? <div className="edges" aria-hidden="true">{levels.map(z => <i key={z} style={{ transform: `translateZ(${z}px)`, inset }} />)}</div> : null}
        <div className="face front" style={ready ? { transform: `translateZ(${half + 0.5}px)` } : undefined}>{children}</div>
        {ready ? <div className="face back" aria-hidden="true" style={{ transform: `rotateY(180deg) translateZ(${half + 0.5}px)` }}>{back}</div> : null}
      </div>
    </div>
  );
}



/* FF Party favourites. */
const favsOf = (state, all) => (state.favs || []).map(id => all.find(p => p.id === id)).filter(p => p && !p.isCompany);


function FavBtn11({ person, wide }) {
  const { state, dispatch } = useStore();
  const on = (state.favs || []).includes(person.id);
  return (
    <Btn variant={on ? "ghost" + (wide ? " wide" : "") : "primary" + (wide ? " wide" : "")} onClick={() => { dispatch({ type: "FAV_TOGGLE", id: person.id }); dispatch({ type: "TOAST", toast: on ? `${firstName(person.name)} removed from your favourites` : `${firstName(person.name)} added to your favourites` }); }}>
      {on ? <><I11.Check size={14} /> In your favourites</> : <><I11.Heart size={14} /> Add to favourites</>}
    </Btn>
  );
}



const eventDraft11 = (ev) => ev ? { title: ev.title || "", kind: ev.kind || "", iso: ev.iso || "", start: startOf(ev), venue: ev.venue || "", guests: ev.guests || "", details: ev.details || "" }
  : { title: "", kind: "", iso: "", start: "", venue: "", guests: "", details: "" };


/* A typed two-digit year ("26") arrives as 0026: read it as 2026. Returns the date, and whether it has passed. */
function cleanIso11(iso) {
  const m = /^(\d{1,4})-(\d{2})-(\d{2})$/.exec(iso || "");
  if (!m) return { iso: iso || "", past: false };
  const y = +m[1] < 100 ? 2000 + +m[1] : +m[1];
  const fixed = `${String(y).padStart(4, "0")}-${m[2]}-${m[3]}`;
  return { iso: fixed, past: fixed < TODAY_ISO };
}


const eventData11 = (d) => ({
  title: d.title.trim() || [d.kind || "Event", d.iso ? shortDay(d.iso) : ""].filter(Boolean).join(" · "),
  kind: d.kind, iso: d.iso, start: d.start, venue: d.venue.trim(), guests: d.guests, details: (d.details || "").trim(),
  date: longDate(d.iso) || "", time: d.start || "",
});



/* People on an event, from its Service Cards. */
const eventPeople = (state, all, ev) => [...new Set(state.shifts.filter(x => x.eventId === ev.id && x.staffId).map(x => x.staffId))]
  .map(id => findPerson(all, state, id)).filter(Boolean);
