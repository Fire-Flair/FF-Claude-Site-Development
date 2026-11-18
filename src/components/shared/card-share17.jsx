/* src/components/shared/card-share17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   CARD SHARE MENU (v17.4.6.4) — one sheet for every shareable card.
   Shows the real card, then: Share (device share sheet), WhatsApp, Download PNG, Copy Link.
   v1.70: no scrolling, blurred page behind, card on top scaled to fit (CardShareView17).
   The PNG is made as soon as the sheet opens so the Share tap still counts as a direct tap on iPhone
   (a share started after a wait can be refused). Uses cardToPng17 from utils/card-export17.js.
   Props: open, onClose, title (share message), url (the card's FireFlair address, https://…), fileName,
          children (the card element, rendered exactly as on the page).
   v1.72: every Share pop-up (profile, own card, Card Studio, invite) uses CardShareView17; the old Sheet layout and its
          `extra` slot are gone.
   ========================================================================== */
/* The sharer's code: their tag. Every link the Share sheet produces carries it as ?r=<code> (v17.5.5). */
const shareCode17 = (state) => String((state.auth && state.auth.status === "signedIn" && (state.auth.tag || state.session.tag)) || "").toLowerCase();
const withRef17 = (url, code) => {
  if (!code) return url;
  try { const u = new URL(url); u.searchParams.set("r", code); return u.toString(); } catch (e) { return url + (url.includes("?") ? "&" : "?") + "r=" + encodeURIComponent(code); }
};


function CardShareSheet17({ open, onClose, title, message, url, fileName, children, noRef }) {
  const { state, dispatch } = useStore();
  const holder = useRef(null);
  const [png, setPng] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const base = /^https?:/.test(url || "") ? url : "https://" + (url || "");
  const full = noRef ? base : withRef17(base, shareCode17(state));
  const make = () => {
    setPng(null); setErr(""); setBusy(true);
    const node = holder.current && holder.current.firstElementChild;
    return cardToPng17(node, { url: base }).then(r => { setPng(r); setBusy(false); return r; })
      .catch(e => { setErr((e && e.message) || "The card couldn't be turned into an image."); setBusy(false); return null; });
  };
  useEffect(() => {
    if (!open) return;
    setNote("");
    const t = setTimeout(make, 450);
    return () => clearTimeout(t);
  }, [open, base]);
  if (!open) return null;
  const file = png ? cx17File(png.blob, fileName) : null;
  const say = (t) => { setNote(t); dispatch({ type: "TOAST", toast: t }); };
  const doShare = async () => {
    if (!png) return;
    if (!cx17CanShareFiles()) { cx17Download(png.blob, fileName); say("Image downloaded. Your browser can't open the share sheet from here."); return; }
    try { const r = await cx17Share(file, message || title, full); if (r === "shared") say("Shared"); }
    catch (e) { cx17Download(png.blob, fileName); say("Sharing wasn't available, so the image was downloaded."); }
  };
  const doWhatsApp = async () => {
    if (!png) return;
    if (cx17CanShareFiles()) {
      try { const r = await cx17Share(file, message || title, full); if (r === "shared") say("Shared"); return; } catch (e) { /* fall back below */ }
    }
    cx17Download(png.blob, fileName);
    window.open(cx17WaLink(message || title, full), "_blank", "noopener");
    say("WhatsApp opened with your link. Add the downloaded image there.");
  };
  const doDownload = () => { if (!png) return; cx17Download(png.blob, fileName); say("Image downloaded"); };
  const doCopy = async () => { const ok = await cx17Copy(full); say(ok ? "Link copied" : "Copy didn't work. Long-press the link to copy it."); };
  const ready = !!png && !busy;
  const opt = (label, onClick, icon, dis, cls) => (
    <button type="button" className={"ff-csm-opt" + (cls ? " " + cls : "")} onClick={onClick} disabled={dis} aria-label={label}>
      {icon}<span>{label}</span>
    </button>
  );
  const name = String(title || "Share").replace(/:\s*$/, "");
  const wait = (ic) => busy ? <Loader2 size={18} className="ff-spin" aria-hidden="true" /> : ic;
  return (
    <CardShareView17 name={name} onClose={onClose} holder={holder} card={children} note={note}
      err={err ? <div className="ff-csx-err" role="alert"><span>{err}</span><button type="button" onClick={make} aria-label="Try again"><RotateCcw size={16} aria-hidden="true" /></button></div> : null}>
      {opt("Share", doShare, wait(<ShareUp17 size={18} aria-hidden="true" />), !ready)}
      {opt("WhatsApp", doWhatsApp, wait(<WhatsAppIcon size={18} />), !ready, "wa")}
      {opt("Download PNG", doDownload, wait(<Download size={18} aria-hidden="true" />), !ready)}
      {opt("Copy Link", doCopy, <Link2 size={18} aria-hidden="true" />, false)}
    </CardShareView17>
  );
}


/* share-sheet (Alex, 18 Nov 21:56): the Share pop-up never scrolls. The page behind is blurred under a dark tint; the card sits
   at the top, scaled to fit what's left once the four buttons have their room; the buttons sit under it. Tap the blurred
   background or the X to close, Escape on a keyboard. Focus stays inside while it's open.
   The visible card is a scaled copy; the PNG is made from an unscaled copy kept off screen (holder), so cardToPng17 measures
   and lays out the card exactly as before. */
function CardShareView17({ name, onClose, holder, card, err, note, children }) {
  const dlg = useRef(null);
  const stage = useRef(null);
  const inner = useRef(null);
  const menu = useRef(null);
  const closeRef = useRef(onClose); closeRef.current = onClose;
  const [fit, setFit] = useState(null);
  React.useLayoutEffect(() => {
    const measure = () => {
      const d = dlg.current, st = stage.current, el = inner.current;
      if (!d || !st || !el) return;
      /* Room for the card: the pop-up's height less the X, the buttons (and any error line) and the gaps between them. */
      const cs = getComputedStyle(d), gap = parseFloat(cs.rowGap) || 0;
      const rest = [...d.children].filter((n) => n !== st && getComputedStyle(n).position !== "absolute");
      const used = rest.reduce((t, n) => t + n.offsetHeight, 0) + gap * rest.length;
      const cw = el.offsetWidth, ch = el.offsetHeight;
      const aw = d.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ah = d.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - used;
      if (!cw || !ch || !aw || !ah) return;
      const s = Math.max(0.3, Math.min(aw / cw, ah / ch, 1.5));
      setFit((f) => (f && Math.abs(f.s - s) < 0.002 && f.w === cw && f.h === ch && Math.abs(f.aw - aw) < 1) ? f : { s, w: cw, h: ch, aw });
      /* A label that doesn't fit its button shrinks; it never splits. */
      if (menu.current) menu.current.querySelectorAll(".ff-csm-opt > span").forEach((sp) => {
        sp.style.fontSize = "";
        let fs = parseFloat(getComputedStyle(sp).fontSize), n = 0;
        while (sp.scrollWidth > sp.clientWidth + 0.5 && fs > 10 && n++ < 30) { fs -= 0.5; sp.style.fontSize = fs + "px"; }
      });
    };
    measure();
    let ro = null;
    if (window.ResizeObserver) { ro = new ResizeObserver(measure); [dlg.current, inner.current, ...(dlg.current ? dlg.current.children : [])].forEach((n) => n && ro.observe(n)); }
    window.addEventListener("resize", measure);
    const imgs = inner.current ? [...inner.current.querySelectorAll("img")] : [];
    imgs.forEach((i) => i.addEventListener("load", measure));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure).catch(() => {});
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", measure); imgs.forEach((i) => i.removeEventListener("load", measure)); };
  }, [!!err]);
  useEffect(() => {
    /* Nothing behind scrolls while the pop-up is open. */
    const de = document.documentElement, b = document.body;
    const was = [de.style.overflow, b.style.overflow, de.style.overscrollBehavior];
    de.style.overflow = "hidden"; b.style.overflow = "hidden"; de.style.overscrollBehavior = "none";
    const prev = document.activeElement;
    const k = (e) => {
      if (e.key === "Escape") { e.preventDefault(); closeRef.current(); return; }
      if (e.key !== "Tab" || !dlg.current) return;
      const f = [...dlg.current.querySelectorAll('a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter((el) => el.offsetParent !== null && !el.closest("[inert]"));
      if (!f.length) { e.preventDefault(); return; }
      const first = f[0], last = f[f.length - 1], at = document.activeElement;
      if (e.shiftKey && (at === first || at === dlg.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && at === last) { e.preventDefault(); first.focus(); }
      else if (!dlg.current.contains(at)) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", k);
    if (dlg.current) dlg.current.focus({ preventScroll: true });
    return () => {
      window.removeEventListener("keydown", k);
      de.style.overflow = was[0]; b.style.overflow = was[1]; de.style.overscrollBehavior = was[2];
      if (prev && prev.focus && document.contains(prev)) { try { prev.focus({ preventScroll: true }); } catch (e) {} }
    };
  }, []);
  /* Taps on the card or the buttons stay; a tap anywhere else is a tap on the background. */
  const back = (e) => { if (!e.target.closest(".ff-csx-card, .ff-csm-opt, .ff-csx-err, .ff-csx-x")) onClose(); };
  const s = fit ? fit.s : 1;
  return (
    <div className="ff-scrim ff-csx" onClick={back} onTouchMove={(e) => { if (!e.target.closest(".ff-csx-card")) e.preventDefault(); }}>
      <div className="ff-csx-dlg" ref={dlg} tabIndex={-1} role="dialog" aria-modal="true" aria-label={name}>
        <button type="button" className="ff-csx-x" onClick={onClose} aria-label="Close" style={fit ? { marginRight: Math.max(0, Math.floor((fit.aw - fit.w * s) / 2)) } : null}><X size={18} aria-hidden="true" /></button>
        <div className="ff-csx-stage" ref={stage} style={fit ? { height: Math.ceil(fit.h * s) } : null}>
          <div className="ff-csx-card" style={fit ? { width: fit.w * s, height: fit.h * s } : { visibility: "hidden" }}>
            <div className="ff-csx-inner" ref={inner} style={{ transform: `scale(${s})` }}>{card}</div>
          </div>
        </div>
        {err}
        <div className="ff-csm-menu ff-csx-menu" ref={menu} role="group" aria-label="Share options" style={fit ? { width: `max(min(100%, 320px), ${Math.round(fit.w * s)}px)` } : null}>{children}</div>
        <div className="ff-csx-live" aria-live="polite">{note}</div>
      </div>
      <div className="ff-csx-export" ref={holder} aria-hidden="true" inert="">{card}</div>
    </div>
  );
}


/* A Share button that opens the menu over any card. render() returns the card exactly as it appears on the page.
   shareIcon: the square-with-arrow share icon in place of the WhatsApp mark (ported from the live page, v1.29). */
function CardShareBtn17({ title, url, fileName, render, label = "Share", className = "", shareIcon = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={"ff-csm-btn " + className} onClick={() => setOpen(true)} aria-label={`${label || "Share"} ${title}`}>{shareIcon ? <Share2 size={18} aria-hidden="true" /> : <WhatsAppIcon size={label ? 18 : 22} />}{label ? " " + label : null}</button>
      {open ? <CardShareSheet17 open onClose={() => setOpen(false)} title={title} url={url} fileName={fileName}>{render()}</CardShareSheet17> : null}
    </>
  );
}
