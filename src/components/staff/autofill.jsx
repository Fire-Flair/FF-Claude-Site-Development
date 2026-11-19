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


