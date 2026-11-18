/* src/components/party/booking-flow.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
const engFor = (state, shiftId, pid) => state.engagements.filter(e => e.shiftId === shiftId && e.staffId === pid).slice(-1)[0] || null;




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



/* ---- FF Party: the FireFlair Service Cards (the ones listed on the FF Team home page), bookable. ----
   The set price and what's included can't be changed. The start time comes from the Event Card. */
const SVC_ROLE = PKG_CAT17.reduce((m, x) => { m[x.id] = x.id === "svc_flair" ? "Bartender" : x.id === "svc_full" ? "Bartender" : x.role; return m; }, {});


const addHours = (hhmm, h) => { const [a, b] = String(hhmm).split(":").map(Number); const m = (a * 60 + b + Math.round(h * 60)) % 1440; return `${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`; };


const svcHours = (svc) => { const m = String(svc.time || "").match(/\d+/); return m ? +m[0] : 3; };


const svcTimeFor = (svc, start) => start ? [start, addHours(start, svcHours(svc))].join(" — ") : "";
