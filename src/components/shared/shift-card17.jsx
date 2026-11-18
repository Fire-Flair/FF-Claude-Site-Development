/* src/components/shared/shift-card17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */



/* src/components/shared/shift-card17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   SHIFT CARD (v17.5.5) — the one Shift Card, and the shift brief page at /fx/<code>.

   ShiftCard17({ shift, event, source, status, company })
     5 x 7, drawn in container units so it is the same at any width and at 1080 x 1512.
     Top row: site plate (FF Staff | FF Party), status plate (Open shift | Chosen for you | Confirmed), FF logo.
     Headline: the event name. Rows: Role, When, Time, Where, Pay, and Company on FF Staff shifts.
     Footer: logo and the site address on the left (WhatsApp prints the time over the bottom right of an image).
     Not on the face: dress code, notes, operational details. They live in the brief.
   Pay comes only from payLine17(shift) (utils/pay17.js).

   Shift codes (the address of the brief): five characters from an alphabet without lookalikes (no 0, 1, I, L, O),
   not case sensitive. The first four identify the event, the fifth the shift within it: 7K2Q is the event,
   7K2QA and 7K2QB its shifts. The prototype derives stable codes from the demo ids (fxCodeOf17); production issues
   them from Core and keeps them unique.
   ========================================================================== */
const SC17_CSS = __ff_css("styles/shift17.css");


if (typeof document !== "undefined" && !document.getElementById("ff-sc17-css")) {
  const st17 = document.createElement("style");
  st17.id = "ff-sc17-css";
  st17.textContent = SC17_CSS;
  document.head.appendChild(st17);
}
const SC17_ADDR = "ffteam.uk";
const SC17_STATUS = { open: "Open shift", chosen: "Chosen for you", confirmed: "Confirmed" };
const SC17I = { Martini: lucideIcon("Martini"), CalendarDays: lucideIcon("CalendarDays"), Clock: lucideIcon("Clock"), MapPin: lucideIcon("MapPin"), Banknote: lucideIcon("Banknote"), Briefcase: lucideIcon("Briefcase"), CalendarPlus: lucideIcon("CalendarPlus") };


/* ---- Wording -------------------------------------------------------------------------------------------- */
/* "19:00 — 23:00" -> "7pm to 11pm"; "18:30 — 00:00" -> "6:30pm to midnight" */
function timeText17(t) {
  const one = (x) => {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(x || "").trim());
    if (!m) return String(x || "").trim();
    const h = +m[1], mi = +m[2];
    if (h % 24 === 0 && mi === 0) return h === 0 || h === 24 ? "midnight" : "12am";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}${mi ? ":" + String(mi).padStart(2, "0") : ""}${h >= 12 && h < 24 ? "pm" : "am"}`;
  };
  const [a, b] = splitTime(t || "");
  return a && b ? `${one(a)} to ${one(b)}` : one(a || b);
}


/* The hirer's company name for a FF Staff shift card, or "". */
function companyOf17(state, ev) {
  const n = (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "";
  return n && n !== "The host" ? n : "";
}


/* ---- The card ------------------------------------------------------------------------------------------- */
/* Shrinks text that does not fit its place (never splits a word). Sizes are in container units. */
function useFit17(ref, deps) {
  React.useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const fit = () => {
      root.querySelectorAll("[data-fit]").forEach(el => {
        const base = parseFloat(el.dataset.fit);
        const box = el.dataset.fitBox === "1";
        el.style.fontSize = base + "cqw";
        const over = () => box ? (el.scrollHeight > el.parentElement.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) : el.scrollWidth > el.clientWidth + 1;
        let k = 1, g = 0;
        while (over() && k > 0.4 && g++ < 80) { k -= 0.02; el.style.fontSize = (base * k).toFixed(3) + "cqw"; }
      });
    };
    fit();
    let ro = null;
    if (window.ResizeObserver) { let w = root.clientWidth; ro = new ResizeObserver(() => { const nw = root.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(root); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, deps);
}


function ShiftCard17({ shift, event, source, status, company }) {
  const { state } = useStore();
  const ref = useRef(null);
  const src = source || eventSource17(state, event);
  const st = status || "open";
  const pay = payLine17(shift);
  const when = (shift.iso && longDay(shift.iso)) || (event && event.iso && longDay(event.iso)) || shift.date || (event && event.date) || "To be confirmed";
  const where = shift.venue || (event && event.venue) || "To be confirmed";
  const title = (event && eventTitle(event)) || shift.role || "Shift";
  const co = src === "staff" ? (company != null ? company : companyOf17(state, event)) : "";
  const row = (cls, Icon, k, v, fit) => (
    <div className={"row" + (cls ? " " + cls : "")}>
      <span className="ic"><Icon strokeWidth={1.8} /></span>
      <span className="k">{k}</span>
      {v}
    </div>
  );
  const val = (text, size = 4.65) => <span className="v" data-fit={size}>{text}</span>;
  useFit17(ref, [title, shift.role, when, shift.time, where, pay.text, co, src, st]);
  return (
    <article ref={ref} className={`ff-sc17 src-${src === "party" ? "party" : "staff"}`} data-cx-fixed="1" aria-label={`${src === "party" ? "FF Party" : "FF Staff"} shift: ${title}, ${SC17_STATUS[st]}`}>
      <div className="card"><div className="face">
        <div className="in">
          <div className="top">
            <span className="plate site">{src === "party" ? "FF Party" : "FF Staff"}</span>
            <span className={"plate " + st}>{SC17_STATUS[st]}</span>
            <span className="logo"><FFLogo size="100%" tier="gold" /></span>
          </div>
          <div className="role"><div className="rin"><h1 data-fit="6.6" data-fit-box="1">{title}</h1></div></div>
          <div className="rows">
            {row("", SC17I.Martini, "Role", val(shift.role || "To be confirmed"))}
            {co ? row("", SC17I.Briefcase, "Company", val(co)) : null}
            {row("", SC17I.CalendarDays, "When", val(when))}
            {row("", SC17I.Clock, "Time", val(timeText17(shift.time) || "To be confirmed"))}
            {row("", SC17I.MapPin, "Where", val(where))}
            {row("pay", SC17I.Banknote, "Pay", pay.status === "ok"
              ? <span className="v" data-fit="5.5">{pay.hourly} <small>p/h</small> <span className="eq">=</span> {pay.total}</span>
              : val(pay.text))}
          </div>
        </div>
        <div className="foot"><span className="fl"><FFLogo size="100%" tier="gold" /></span><span className="url">{SC17_ADDR}</span></div>
      </div></div>
    </article>
  );
}
