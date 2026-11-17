/* src/components/shared/hero-easel.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   v17.24 — HERO EASEL. The home hero photo has a blank display board on an
   easel in the middle of the bar. A real member's Profile Card is drawn onto
   that board, a different member each time the page loads.

   The card is the live PlayerCard (format "full"), not a picture: it is laid
   onto the board with a perspective transform worked out from the four corner
   points below, so any member's card (and any card design change) fits with
   no new artwork. Two light layers on top match the card to the room.

   HERO_EASEL24 = the card's four corners on the hero photo, as fractions of
   the photo's width and height (top-left, top-right, bottom-right,
   bottom-left). They belong to the hero image: if the photo is ever replaced
   or re-cropped these four points must be measured again.

   Live site: pick one published FF Team profile at random per page load.
   ========================================================================== */
const HERO_EASEL24 = [[0.38709, 0.11353], [0.58310, 0.11897], [0.60739, 0.68088], [0.40016, 0.71408]];
/* The same card mirrored in the polished bar top below the easel (same corner order, so the card comes out upside down). Only its foot shows. */
const HERO_EASEL24_REFL = [[0.38446, 1.50400], [0.58047, 1.43629], [0.60475, 0.86667], [0.39753, 0.89930]];

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

function HeroEasel24() {
  const { state } = useStore();
  /* One member per page load. */
  const person = React.useMemo(() => {
    const list = (state.directory || []).filter((p) => p && p.name && p.tag);
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }, []);
  const stage = React.useRef(null), card = React.useRef(null);
  const [m, setM] = React.useState(""), [mr, setMr] = React.useState("");
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
  return (
    <div className="ff-easel24" ref={stage} aria-hidden="true">
      <div className="ff-easel24-card refl" style={{ transform: mr || undefined, visibility: mr ? "visible" : "hidden" }}>{face}</div>
      <div className="ff-easel24-card" ref={card} style={{ transform: m || undefined, visibility: m ? "visible" : "hidden" }}>
        {face}
        <span className="ff-easel24-shade" />
        <span className="ff-easel24-key" />
      </div>
    </div>
  );
}
