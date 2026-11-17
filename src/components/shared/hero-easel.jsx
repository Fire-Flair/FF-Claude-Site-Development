/* src/components/shared/hero-easel.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   v17.24 — HERO EASEL. The home hero photo has a blank display board on an
   easel in the middle of the bar. A real member's Profile Card is drawn onto
   that board, a different member each time the page loads.

   The card is the live PlayerCard (format "full"), not a picture: it is laid
   onto the board with a perspective transform worked out from the four corner
   points below, so any member's card (and any card design change) fits with
   no new artwork. Two light layers on top match the card to the room.

   HERO_EASEL24 = the board's four corners on the hero photo (the card covers the whole board; the photo's board has the same round corners), as fractions of
   the photo's width and height (top-left, top-right, bottom-right,
   bottom-left). They belong to the hero image: if the photo is ever replaced
   or re-cropped these four points must be measured again.

   Live site: pick one published FF Team profile at random per page load.
   ========================================================================== */
const HERO_EASEL24 = [[0.39263, 0.10033], [0.60316, 0.10702], [0.62878, 0.68968], [0.40571, 0.72617]];
/* The same card mirrored in the polished bar top below the easel (same corner order, so the card comes out upside down). Only its foot shows. */
const HERO_EASEL24_REFL = [[0.39000, 1.51544], [0.60053, 1.44186], [0.62615, 0.85106], [0.40307, 0.88545]];

/* CSS matrix3d that maps a w×h box (origin top-left) onto the quad q (px). */
function heroEaselMatrix24(w, h, q) {
  const s = [[0, 0], [w, 0], [w, h], [0, h]], A = [], b = [];
  for (let i = 0; i < 4; i++) {
    const [x, y] = s[i], [X, Y] = q[i];
    A.push([x, y, 1, 0, 0, 0, -x * X, -y * X]); b.push(X);
    A.push([0, 0, 0, x, y, 1, -x * Y, -y * Y]); b.push(Y);
  }
  for (let c = 0; c < 8; c++) {
    let p = c;
    for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r;
    if (Math.abs(A[p][c]) < 1e-12) return "";
    [A[c], A[p]] = [A[p], A[c]]; [b[c], b[p]] = [b[p], b[c]];
    for (let r = 0; r < 8; r++) {
      if (r === c) continue;
      const f = A[r][c] / A[c][c];
      for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
      b[r] -= f * b[c];
    }
  }
  const m = b.map((v, i) => v / A[i][i]);
  return `matrix3d(${m[0]},${m[3]},0,${m[6]},${m[1]},${m[4]},0,${m[7]},0,0,1,0,${m[2]},${m[5]},0,1)`;
}

/* v17.36: how many dots show under the easel at once (a window that follows the current member). */
const HERO_EASEL_DOTS = 7;

function HeroEasel24() {
  const { state, dispatch } = useStore();
  /* v17.36: every member with a card can be swiped through; the first one is random per page load. */
  const list = React.useMemo(() => (state.directory || []).filter((p) => p && p.name && p.tag), [state.directory]);
  const [curId, setCurId] = React.useState(() => (list.length ? list[Math.floor(Math.random() * list.length)].id : null));
  const at = Math.max(0, list.findIndex((p) => p.id === curId));
  const person = list.length ? list[at] : null;
  const stage = React.useRef(null), card = React.useRef(null);
  const [m, setM] = React.useState(""), [mr, setMr] = React.useState("");
  /* the shine either moves or is not there: only with motion allowed, and dropped if its animation is not running */
  const [shine, setShine] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    const upd = () => setShine(!!mq && !mq.matches);
    upd();
    if (mq && mq.addEventListener) mq.addEventListener("change", upd);
    return () => { if (mq && mq.removeEventListener) mq.removeEventListener("change", upd); };
  }, []);
  React.useEffect(() => {
    if (!shine || !card.current) return undefined;
    const t = setTimeout(() => {
      const el = card.current && card.current.querySelector(".ff-easel24-sheen");
      const ok = !!el && typeof el.getAnimations === "function" && el.getAnimations({ subtree: true }).some((a) => a.playState === "running");
      if (!ok) setShine(false);
    }, 400);
    return () => clearTimeout(t);
  }, [shine]);
  /* swipe: dx = drag offset (card px), slide = the short change-over animation */
  const [dx, setDx] = React.useState(0);
  const [slide, setSlide] = React.useState({ x: 0, o: 1, t: 0 });
  const drag = React.useRef(null), moved = React.useRef(false), busy = React.useRef(false);
  const go = (step) => {
    if (!list.length || list.length < 2 || busy.current) return;
    const next = list[(at + step + list.length) % list.length].id;
    if (!shine) { setDx(0); setCurId(next); return; }
    busy.current = true;
    setSlide({ x: step > 0 ? -70 : 70, o: 0, t: 130 });
    setTimeout(() => {
      setDx(0); setCurId(next);
      setSlide({ x: step > 0 ? 45 : -45, o: 0, t: 0 });
      requestAnimationFrame(() => requestAnimationFrame(() => { setSlide({ x: 0, o: 1, t: 190 }); busy.current = false; }));
    }, 130);
  };
  React.useLayoutEffect(() => {
    const st = stage.current, c = card.current;
    if (!st || !c) return undefined;
    const fit = () => {
      const W = st.clientWidth, H = st.clientHeight, w = c.offsetWidth, h = c.offsetHeight;
      if (!(W && H && w && h)) return;
      setM(heroEaselMatrix24(w, h, HERO_EASEL24.map(([x, y]) => [x * W, y * H])));
      setMr(heroEaselMatrix24(w, h, HERO_EASEL24_REFL.map(([x, y]) => [x * W, y * H])));
    };
    fit();
    if (typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(fit);
    ro.observe(st); ro.observe(c);
    return () => ro.disconnect();
  }, [person && person.id]);
  if (!person) return null;
  const face = <PlayerCard person={person} format="full" nameAs="div" themeKey={person.theme || "ivory"} />;
  /* v17.30: the card on the easel opens that member's profile (a tap, not a swipe). */
  const open = () => dispatch({ type: "VIEW", id: person.id });
  const down = (e) => {
    if (e.button > 0) return;
    moved.current = false;
    const c = card.current, r = c ? c.getBoundingClientRect() : null;
    drag.current = { x: e.clientX, y: e.clientY, k: r && r.width ? c.offsetWidth / r.width : 1, w: r ? r.width : 100, on: false };
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    const ddx = e.clientX - d.x, ddy = e.clientY - d.y;
    if (!d.on) {
      if (Math.abs(ddx) > 8 && Math.abs(ddx) > Math.abs(ddy)) {
        d.on = true; moved.current = true;
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* capture is optional */ }
      } else { if (Math.abs(ddy) > 10) drag.current = null; return; }
    }
    d.dx = ddx;
    setDx(ddx * d.k);
  };
  const up = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || !d.on) return;
    if (Math.abs(d.dx || 0) > Math.max(24, d.w * 0.18)) go(d.dx < 0 ? 1 : -1); else setDx(0);
  };
  const cancel = () => { drag.current = null; setDx(0); };
  const dragging = !!(drag.current && drag.current.on);
  const faceStyle = {
    transform: `translateX(calc(${slide.x}% + ${dx}px))`, opacity: slide.o,
    transition: dragging ? "none" : `transform ${slide.t || 180}ms cubic-bezier(.2,.8,.2,1), opacity ${slide.t || 180}ms ease`,
  };
  const n = list.length, win = Math.min(n, HERO_EASEL_DOTS);
  const first = Math.min(Math.max(0, at - Math.floor(win / 2)), n - win);
  const dots = Array.from({ length: win }, (_, i) => first + i);
  return (
    <div className="ff-easel24" ref={stage}>
      <div className="ff-easel24-card refl" aria-hidden="true" style={{ transform: mr || undefined, visibility: mr ? "visible" : "hidden" }}>
        <span className="ff-easel24-clip"><span className="ff-easel24-slide" style={faceStyle}>{face}</span></span>
      </div>
      <div className="ff-easel24-card" ref={card} role="link" tabIndex={0} aria-label={`${person.name}: open profile`}
        onClick={() => { if (moved.current) { moved.current = false; return; } open(); }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
          else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
        }}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}
        onDragStart={(e) => e.preventDefault()}
        style={{ transform: m || undefined, visibility: m ? "visible" : "hidden" }}>
        <span className="ff-easel24-clip"><span className="ff-easel24-face ff-easel24-slide" aria-hidden="true" style={faceStyle}>{face}</span></span>
        <span className="ff-easel24-shade" />
        <span className="ff-easel24-key" />
        {shine ? <span className="ff-easel24-sheen" /> : null}
        {n > 1 ? <span className="ff-easel24-dots" aria-hidden="true">{dots.map((i) => <i key={list[i].id} className={i === at ? "on" : undefined} />)}</span> : null}
      </div>
    </div>
  );
}
