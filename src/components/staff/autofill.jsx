/* src/components/staff/autofill.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* ==== Booking policy 2026.1: exclusive invitations, Autofill, selection, refunds, replacement =====
   PROTOTYPE. Everything here runs in the browser and is simulated: there is no server, no payment
   provider and no WhatsApp sending. The rules are the ones in the Booking specification, so the
   backend can be built from the same state names.

   Records (all on the app state):
     af17[shiftId]   one Autofill record per Service Card (a Service Card needing several people reopens
                     only the positions still open: open = qty - confirmed)
     engagements     one per professional invitation. New fields: auto, exclusive, batch, batchSize,
                     selectBy, thread, ref. New states: discuss, withdrawn, not_selected, cancelled_pro
     paid17          payment taken per Event Card, snap17 the terms and prices agreed at that moment
     refunds17       refunds issued, or held for FireFlair to decide (part-filled cases)
     notes17         messages, with the website and WhatsApp status kept apart from booking status
     audit17, revs17 who did what and when; manual changes to terms
     rules17         admin settings. warp17 moves the prototype clock so deadlines can be tried. */

const POLICY17 = { version: "2026.1", feeBusiness: 10, feeParty: 50, batch: 10, exclusiveH: 24, batchH: 24, selectDays: 7, distance: 0 };


const rules17 = (s) => ({ ...POLICY17, ...(s.rules17 || {}) });


const now17 = (s) => Date.now() + ((s && s.warp17) || 0);


const startMs17 = (sh) => {
  if (!sh || !sh.iso) return 0;
  const m = /^(\d{1,2}):(\d{2})/.exec(splitTime(sh.time || "")[0] || "");
  return new Date(`${sh.iso}T${m ? String(m[1]).padStart(2, "0") + ":" + m[2] : "12:00"}:00`).getTime();
};


/* Payment is on record for an Event Card once its first invitations went out. */
const paid17 = (s, eventId) => !!(s.paid17 || {})[eventId] || s.engagements.some(e => (s.shifts.find(x => x.id === e.shiftId) || {}).eventId === eventId);


/* FF Staff launch (Be first in line for Gold): a company is recorded once, at its first confirmed hire on an FF Staff
   booking. The list is the prototype's stand-in for the server-side count; nothing is enrolled automatically. */
const goldKey17 = (s) => {
  const c = (s && s.company) || {};
  const nm = c.slug || c.name;
  if (nm) return "co:" + slugify(nm);
  return s && s.auth && s.auth.status === "signedIn" && s.role === "staff" && s.site !== "party" && s.auth.tag ? "tag:" + String(s.auth.tag).toLowerCase() : "";
};



/* Words are never split across lines: a long word makes its text smaller instead. Several words may wrap. */
function FitWords17() {
  useEffect(() => {
    const SEL = ".ff-dx-tile .tx b, .ff-br17-opts b, .ff-br17-qual b";
    let raf = 0;
    const run = () => { raf = 0;
      document.querySelectorAll(SEL).forEach(el => {
        if (!el.offsetParent) return;
        el.style.fontSize = "";
        let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
        while (el.scrollWidth > el.clientWidth + 0.5 && fs > 8 && n++ < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; }
      }); };
    const q = () => { if (!raf) raf = requestAnimationFrame(run); };
    const mo = new MutationObserver(q); mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", q); q();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(q);
    return () => { mo.disconnect(); window.removeEventListener("resize", q); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}



/* Hold a card for half a second and it pops up, anywhere on FF Party: people, packages, drinks and companies. */
function LongPress17() {
  const { state, dispatch } = useStore();
  const [pop, setPop] = useState(null);
  const on = state.role === "staff" && state.site === "party";
  const ref = useRef({ on, state });
  ref.current = { on, state };
  useEffect(() => {
    let tm = 0, sx = 0, sy = 0, hold = 0;
    const SEL = "[data-pk17],[data-ck17],[data-co17],[data-pr17]";
    const stop = () => { clearTimeout(tm); tm = 0; };
    const onDown = (e) => {
      if (!ref.current.on || (e.pointerType === "mouse" && e.button !== 0)) return;
      const el = e.target.closest && e.target.closest(SEL); if (!el) return;
      if (el.closest(".inf")) return;
      sx = e.clientX; sy = e.clientY; stop();
      tm = setTimeout(() => {
        tm = 0; hold = Date.now();
        try { navigator.vibrate && navigator.vibrate(15); } catch (_) {}
        if (el.dataset.pk17) setPop({ k: "pk", id: el.dataset.pk17, alt: el.dataset.pk17Alt });
        else if (el.dataset.ck17) setPop({ k: "ck", id: el.dataset.ck17 });
        else if (el.dataset.co17) dispatch({ type: "VIEW_COMPANY", id: el.dataset.co17 });
        else if (el.dataset.pr17) dispatch({ type: "VIEW", id: el.dataset.pr17 });
      }, 480);
    };
    const onMove = (e) => { if (tm && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) stop(); };
    const onClick = (e) => { if (hold && Date.now() - hold < 900) { e.preventDefault(); e.stopPropagation(); hold = 0; } };
    const onCtx = (e) => { if (ref.current.on && e.target.closest && e.target.closest(SEL)) e.preventDefault(); };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", stop, true);
    document.addEventListener("pointercancel", stop, true);
    document.addEventListener("scroll", stop, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onCtx, true);
    return () => { stop(); document.removeEventListener("pointerdown", onDown, true); document.removeEventListener("pointermove", onMove, true); document.removeEventListener("pointerup", stop, true); document.removeEventListener("pointercancel", stop, true); document.removeEventListener("scroll", stop, true); document.removeEventListener("click", onClick, true); document.removeEventListener("contextmenu", onCtx, true); };
  }, []);
  if (!pop) return null;
  const close = () => setPop(null);
  if (pop.k === "ck") { const c = ALLCK17.find(x => x.id === pop.id); return c ? <ClassicPop17 c={c} onClose={close} /> : null; }
  const svc = pop.alt === "byob" ? byobOf17(state) : pkgsOf17(state).find(x => x.id === pop.id);
  return svc ? <PkgSheet17 svc={svc} qual={(state.br17 || {}).q || ""} onClose={close} /> : null;
}
