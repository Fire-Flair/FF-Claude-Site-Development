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



function Sheet({ open, onClose, title, children, center = true, newLogo = false }) /* v1.188 (Alex 21 Nov): every pop-up is centred */ {
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
  /* Pop-up (Alex, 18-19 Nov): drawn at the top of the page (a portal into .ff-shell), so no box it was opened from can clip
     or cover it. Its look (blurred page, panel at the top, a gap below that closes it) is .ff-scrim / .ff-sheet in base.css. */
  const host = typeof document !== "undefined" && (document.querySelector(".ff-shell") || document.querySelector(".ff"));
  const body = (
    <div className="ff-scrim" onClick={onClose}>
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
  st.textContent = ".ff textarea{overflow-y:hidden!important;max-height:none!important;resize:none!important}";
  document.head.appendChild(st);
})();
