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



function Sheet({ open, onClose, title, children, center = false }) {
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
  return (
    <div className={`ff-scrim${center ? " center" : ""}`} onClick={onClose}>
      <div className={`ff-sheet${center ? " center" : ""}`} ref={ref} tabIndex={-1} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="ff-sheet-head">
          <Coin size={22} />
          <span className="ff-h2" style={{ flex: 1 }}>{title}</span>
          <button onClick={onClose} aria-label="Close"><X size={20} /></button>
        </div>
        <div style={{ padding: 16 }}>{children}</div>
      </div>
    </div>
  );
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
