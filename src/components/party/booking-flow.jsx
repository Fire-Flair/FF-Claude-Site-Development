




(function navHeightSync() {
  if (typeof window === "undefined")
    return;
  let cur = null, ro = null;
  const set = (n) => {
    const h = Math.round(n.getBoundingClientRect().height);
    if (h > 0)
      document.documentElement.style.setProperty("--ff-navh", h + "px");
  };
  const tick = () => {
    const n = document.querySelector(".ff-bottomnav");
    if (!n || n === cur)
      return;
    cur = n;
    if (ro)
      ro.disconnect();
    if (window.ResizeObserver) {
      ro = new ResizeObserver(() => set(n));
      ro.observe(n);
    }
    set(n);
  };
  setInterval(tick, 800);
})();


function StaffBox({ icon: Icon, title, count, open, onToggle, children, id }) {
  return (
    <section className={`ff-sbox${open ? " open" : ""}`} id={id}>
      <button type="button" className="h" aria-expanded={open} onClick={onToggle}>
        <span className="ic"><Icon size={16} /></span><b>{title}</b>{count != null && <span className="ct">{count}</span>}<I11.ChevronRight size={16} className="chev" />
      </button>
      {open && <div className="body">{children}</div>}
    </section>
  );
}


/* FF Staff, step 3: one row of staff cards. Your picks and your team first, then FireFlair's
   recommendations, then everyone else, closest first. All sorting happens on the page. */
const areaKey11 = (txt) => { const t = String(txt || "").toLowerCase(); return Object.keys(MAP_AREAS).find(k => t.includes(k.toLowerCase())) || (t.includes("london") ? "Central London" : ""); };


const personArea11 = (p) => (p.locations || []).find(l => MAP_AREAS[l]) || "";


/* ---- Contact for the booking: phone and email, each saved on its own ---- */
const contactOf11 = (state, ev) => { const c = state.company || {}; return [(ev && ev.phone) || state.bookPhone || c.phone || (state.session && state.session.phone), (ev && ev.email) || state.bookEmail || c.email].filter(Boolean).join(" · "); };


const pad2 = (n) => String(n).padStart(2, "0");


const addHours = (hhmm, h) => { const [a, b] = String(hhmm).split(":").map(Number); const m = (a * 60 + b + Math.round(h * 60)) % 1440; return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };


const svcHours = (svc) => { const m = String(svc.time || "").match(/\d+/); return m ? +m[0] : 3; };

