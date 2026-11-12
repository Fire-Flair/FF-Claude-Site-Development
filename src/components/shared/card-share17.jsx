/* src/components/shared/card-share17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   CARD SHARE MENU (v17.4.6.4) — one sheet for every shareable card.
   Shows the real card, then: Share (device share sheet), WhatsApp, Download PNG, Copy Link.
   The PNG is made as soon as the sheet opens so the Share tap still counts as a direct tap on iPhone
   (a share started after a wait can be refused). Uses cardToPng17 from utils/card-export17.js.
   Props: open, onClose, title (share message), url (the card's FireFlair address, https://…), fileName,
          children (the card element, rendered exactly as on the page), extra (optional content below the menu).
   ========================================================================== */
function CardShareSheet17({ open, onClose, title, url, fileName, children, extra }) {
  const { dispatch } = useStore();
  const holder = useRef(null);
  const [png, setPng] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const full = /^https?:/.test(url || "") ? url : "https://" + (url || "");
  const make = () => {
    setPng(null); setErr(""); setBusy(true);
    const node = holder.current && holder.current.firstElementChild;
    return cardToPng17(node, { url: full }).then(r => { setPng(r); setBusy(false); return r; })
      .catch(e => { setErr((e && e.message) || "The card couldn't be turned into an image."); setBusy(false); return null; });
  };
  useEffect(() => {
    if (!open) return;
    setNote("");
    const t = setTimeout(make, 450);
    return () => clearTimeout(t);
  }, [open, full]);
  if (!open) return null;
  const file = png ? cx17File(png.blob, fileName) : null;
  const say = (t) => { setNote(t); dispatch({ type: "TOAST", toast: t }); };
  const doShare = async () => {
    if (!png) return;
    if (!cx17CanShareFiles()) { cx17Download(png.blob, fileName); say("Image downloaded. Your browser can't open the share sheet from here."); return; }
    try { const r = await cx17Share(file, title, full); if (r === "shared") say("Shared"); }
    catch (e) { cx17Download(png.blob, fileName); say("Sharing wasn't available, so the image was downloaded."); }
  };
  const doWhatsApp = async () => {
    if (!png) return;
    if (cx17CanShareFiles()) {
      try { const r = await cx17Share(file, title, full); if (r === "shared") say("Shared"); return; } catch (e) { /* fall back below */ }
    }
    cx17Download(png.blob, fileName);
    window.open(cx17WaLink(title, full), "_blank", "noopener");
    say("WhatsApp opened with your link. Add the downloaded image there.");
  };
  const doDownload = () => { if (!png) return; cx17Download(png.blob, fileName); say("Image downloaded"); };
  const doCopy = async () => { const ok = await cx17Copy(full); say(ok ? "Link copied" : "Copy didn't work. Long-press the link to copy it."); };
  const ready = !!png && !busy;
  const opt = (label, onClick, icon, dis) => (
    <button type="button" className="ff-csm-opt" onClick={onClick} disabled={dis} aria-label={label}>
      {icon}<span>{label}</span>
    </button>
  );
  return (
    <Sheet open onClose={onClose} title={title || "Share"}>
      <div className="ff-csm-stage" ref={holder}>{children}</div>
      <p className="ff-csm-url" aria-label="Card address">{full.replace(/^https?:\/\//, "")}</p>
      {err ? (
        <div className="ff-cverr" role="alert"><span>{err}</span><Btn variant="sm ghost" onClick={make}><RotateCcw size={12} /> Try again</Btn></div>
      ) : busy ? (
        <p className="ff-body ff-csm-busy" role="status"><Loader2 size={14} className="ff-spin" /> Getting your image ready</p>
      ) : null}
      <div className="ff-csm-menu" role="group" aria-label="Share options">
        {opt("Share", doShare, <Share2 size={16} />, !ready)}
        {opt("WhatsApp", doWhatsApp, <MessageCircle size={16} />, !ready)}
        {opt("Download PNG", doDownload, <Download size={16} />, !ready)}
        {opt("Copy Link", doCopy, <Link2 size={16} />, false)}
      </div>
      <div className="ff-csm-live" aria-live="polite">{note}</div>
      {extra}
    </Sheet>
  );
}


/* A Share button that opens the menu over any card. render() returns the card exactly as it appears on the page. */
function CardShareBtn17({ title, url, fileName, render, label = "Share", className = "" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={"ff-csm-btn " + className} onClick={() => setOpen(true)} aria-label={`${label} ${title}`}><Share2 size={14} /> {label}</button>
      {open ? <CardShareSheet17 open onClose={() => setOpen(false)} title={title} url={url} fileName={fileName}>{render()}</CardShareSheet17> : null}
    </>
  );
}
