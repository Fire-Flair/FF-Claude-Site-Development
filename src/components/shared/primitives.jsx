/* src/components/shared/primitives.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
// The "Create your Profile Card" button carries its own black-and-gold rim (class ff-pcard, styles/v11.css).
function ffPcardClass(children) {
  const walk = (n) => Array.isArray(n) ? n.map(walk).join("") : (typeof n === "string" ? n : "");
  return walk(children).replace(/\s+/g, " ").trim().toLowerCase() === "create your profile card" ? " ff-pcard" : "";
}

function Btn({ children, variant = "", onClick, disabled, type = "button", style }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`ff-btn ${variant}${ffPcardClass(children)}`} style={style}>{children}</button>;
}



function Pill({ children, tone = "" }) { return <span className={`ff-pill ${tone}`}>{children}</span>; }



function Field({ label, hint, children }) {
  return (
    <label className="ff-field">
      <span className="ff-label" style={{ display: "block", marginBottom: 6 }}>{label}</span>
      {children}
      {hint && <span className="ff-body ff-muted" style={{ fontSize: 12, display: "block", marginTop: 5 }}>{hint}</span>}
    </label>
  );
}



function Sheet({ open, onClose, title, children, center = false, newLogo = false }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement;
    const k = (e) => {
      if (e.key === "Escape") { closeRef.current(); return; }
      if (e.key !== "Tab" || !ref.current) return;
      const f = [...ref.current.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || at === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", k);
    if (ref.current && !ref.current.contains(document.activeElement)) ref.current.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", k);
      if (prev && prev.focus && document.contains(prev)) { try { prev.focus({ preventScroll: true }); } catch (e) {} }
    };
  }, [open]);
  if (!open) return null;
  /* float-sheets (Alex, 18 Nov 23:30): every pop-up is a centred floating panel, never a sheet rising from the bottom
     edge. A gap is always left under it, so the bottom row and the blurred page show and a tap there closes it. The
     pop-up is drawn at the top of the page (a portal into .ff-shell), so no box it was opened from can clip or cover it. */
  const host = typeof document !== "undefined" && (document.querySelector(".ff-shell") || document.querySelector(".ff"));
  const body = (
    <div className={`ff-scrim ff-float${center ? " center" : ""}`} onClick={onClose}>
      <div className={`ff-sheet${center ? " center" : ""}`} ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ff-sheet-head">
          {newLogo ? <FFLogo size={24} tier="gold" /> : <Coin size={22} />}
          <span className="ff-h2" style={{ flex: 1 }}>{title}</span>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
  return host && ReactDOM.createPortal ? ReactDOM.createPortal(body, host) : body;
}



function Divider() { return <div className="ff-diamond" style={{ margin: "18px 0" }}><i /></div>; }




function Empty({ icon, title, action }) {
  return (
    <div className="ff-frame" style={{ padding: 28, textAlign: "center" }}>
      <Corners />
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, color: "var(--gold-mid)" }}>{icon}</div>
      <p className="ff-serif" style={{ fontSize: 17, margin: "0 0 14px", color: "#4A443A" }}>{title}</p>
      {action}
    </div>
  );
}


/* grow-boxes (Alex, 18 Nov 21:15): no text box on the site scrolls inside itself. Every textarea grows with its text
   (typed, pasted, or filled in by speech to text or GPT) and, when empty, is tall enough for its whole placeholder.
   One global hook: the value setter React uses, input events, new textareas appearing, and width changes. */
(function ffGrowBoxes() {
  if (typeof window === "undefined" || window.__ffGrow) return;
  window.__ffGrow = true;
  const proto = HTMLTextAreaElement.prototype;
  const desc = Object.getOwnPropertyDescriptor(proto, "value");
  const size = (el) => {
    if (!el || !el.isConnected || el.dataset.noGrow != null) return;
    const cs = getComputedStyle(el);
    if (cs.display === "none") return;
    const edge = cs.boxSizing === "border-box" ? (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0) : -((parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0));
    const v = desc.get.call(el);
    const usePh = !v && el.placeholder;
    if (usePh) desc.set.call(el, el.placeholder);
    el.style.height = "auto";
    const h = el.scrollHeight + edge;
    if (usePh) desc.set.call(el, "");
    el.style.height = h + "px";
  };
  Object.defineProperty(proto, "value", {
    configurable: true, enumerable: desc.enumerable,
    get() { return desc.get.call(this); },
    set(x) { desc.set.call(this, x); const el = this; requestAnimationFrame(() => size(el)); },
  });
  const all = () => document.querySelectorAll("textarea").forEach(size);
  document.addEventListener("input", (e) => { if (e.target && e.target.tagName === "TEXTAREA") size(e.target); }, true);
  let t = 0;
  const later = () => { if (t) return; t = requestAnimationFrame(() => { t = 0; all(); }); };
  new MutationObserver((ms) => { if (ms.some((m) => [...m.addedNodes].some((n) => n.nodeType === 1 && (n.tagName === "TEXTAREA" || (n.querySelector && n.querySelector("textarea")))))) later(); })
    .observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("resize", later);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(later).catch(() => {});
  const st = document.createElement("style");
  st.textContent = ".ff textarea{overflow-y:hidden!important;max-height:none!important;resize:none!important}"
    /* top-pop-ups (Alex, 19 Nov): every pop-up is the blurred Share look. Dark-tinted blurred page behind, the panel near the
       TOP, never rising from the bottom, never full page. A gap of at least 72px is always left under it so a tap on the
       blurred area closes it; taller content scrolls inside the panel (head stays). --ffpp-t / --ffpp-b: top offset / bottom gap. */
    + "html .ff .ff-scrim.ff-float{--ffpp-t:calc(14px + env(safe-area-inset-top,0px));--ffpp-b:calc(88px + env(safe-area-inset-bottom,0px));position:fixed!important;inset:0!important;z-index:200!important;box-sizing:border-box!important;display:flex!important;align-items:flex-start!important;justify-content:center!important;padding:var(--ffpp-t) 10px 0!important;overflow:hidden!important;overscroll-behavior:contain;background:rgba(10,9,8,.52)!important;-webkit-backdrop-filter:blur(16px) saturate(.85)!important;backdrop-filter:blur(16px) saturate(.85)!important;animation:ffCsxIn .18s ease-out}"
    + "@media(min-width:900px){html .ff .ff-scrim.ff-float{--ffpp-t:calc(28px + env(safe-area-inset-top,0px));--ffpp-b:calc(84px + env(safe-area-inset-bottom,0px))}}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet{box-sizing:border-box!important;width:100%!important;max-width:560px!important;height:auto!important;margin:0 auto!important;max-height:calc(100vh - 102px)!important;max-height:calc(100dvh - var(--ffpp-t) - var(--ffpp-b))!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;border-radius:24px!important;corner-shape:squircle;border:1px solid var(--gold-dk,#7E611D)!important;box-shadow:0 24px 60px rgba(0,0,0,.35)!important;padding-bottom:calc(20px + env(safe-area-inset-bottom,0px))!important;transform-origin:50% 0;animation:ffPopTop .2s ease-out!important;word-break:normal;hyphens:none}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet.center{max-width:680px!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet:has(.ff-doc17),html .ff .ff-scrim.ff-float>.ff-sheet:has(.ff-bkterms17){max-width:760px!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet.center:has(.ff-jr17-art){max-width:640px!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet.center:has(.ff-ib17){max-width:420px!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet:has(.ff-pk18full){max-width:560px!important;height:auto!important;border-radius:24px!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet:has(.ff-disc-modal){width:min(88vw,400px)!important;max-width:none!important;border-radius:30px!important;overflow:hidden!important;animation:ffDiscFlip .5s cubic-bezier(.22,.7,.25,1) both!important}"
    + "html .ff .ff-scrim.ff-float>.ff-sheet>.ff-sheet-head{border-radius:24px 24px 0 0}"
    + "@keyframes ffPopTop{from{opacity:0;transform:scale(.97)}to{opacity:1;transform:none}}"
    + ".ff .ff-scrim.ff-csx{box-sizing:border-box!important;padding-bottom:calc(86px + env(safe-area-inset-bottom,0px))!important}"
    + "@media(min-width:900px){.ff .ff-scrim.ff-csx{padding-bottom:40px!important}}"
    + "@media(prefers-reduced-motion:reduce){html .ff .ff-scrim.ff-float,html .ff .ff-scrim.ff-float>.ff-sheet{animation:none!important}}";
  document.head.appendChild(st);
})();
