/* src/components/team/public-profile.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- v1.4: Biography / Introduction, and the public profile ---------------
   The biography is the profile's existing `about` text (one source of truth:
   state.profile.about, saved and shared like the rest of the profile). */
const BIO_MAX = 500;

   // About Me
const bioCount = (n) => `${Number(n).toLocaleString("en-GB")} / ${BIO_MAX.toLocaleString("en-GB")}`;


const prefersReducedMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };





/* v17.18: the Profile Card's order (Skills, Interests, Locations, Languages), then Venues, Qualifications and the rest. */
const PUB_ORDER = ["professions", "media", "skills", "interests", "locations", "languages", "venues", "qualifications", "experience"].filter(venuesOn17);






/* ==========================================================================
   v1.5 — the visitor's profile: media carousel, the Profile Card, actions,
   four tabs (Overview · Services · Teams · Reviews). Everything reads the
   existing records: profile.media, the Profile Card, attribute records,
   serviceInterest / own Service Cards, team memberships, reviews.
   ========================================================================== */

const useLayoutEffect = React.useLayoutEffect;



/* Pointer-drag for mouse and pen, on top of native touch scrolling and
   scroll-snap. A drag never counts as a click. */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let down = null, moved = false;
    const onDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest("[data-nodrag], .ff-pt21-grip")) return;
      down = { x: e.clientX, left: el.scrollLeft }; moved = false;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 6) { moved = true; el.classList.add("dragging"); try { el.setPointerCapture(e.pointerId); } catch (x) {} }
      if (moved) el.scrollLeft = down.left - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = null;
      if (moved) { el.classList.remove("dragging"); setTimeout(() => { moved = false; }, 0); }
    };
    const onClickCap = (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); } };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("click", onClickCap, true);
    return () => {
      el.removeEventListener("pointerdown", onDown); el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp); el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("click", onClickCap, true);
    };
  }, []);
}



/* ---- 1. Media carousel: the professional's own uploads ------------------- */
function mediaOf(state, person) {
  const recs = recordsForPerson(state, person);
  const own = person.id === "me" ? (state.profile.media || []) : (person.media || []);
  const order = [...PUB_ORDER, ...Object.keys(recs).filter(k => !PUB_ORDER.includes(k) && venuesOn17(k))];
  const onCards = order.flatMap(k => (recs[k] || []).filter(r => !r.hidden && !r.proposed).flatMap(r => r.media || []));
  const seen = new Set();
  return [...own, ...onCards]
    .map(m => ({ id: m && m.id, src: m && (m.dataUrl || m.src), name: (m && m.name) || "" }))
    .filter(m => m.src && !seen.has(m.src) && seen.add(m.src));
}



function useWide(min = 900, q0) {
  const q = q0 || `(min-width:${min}px)`;
  const [w, setW] = useState(() => typeof matchMedia !== "undefined" && matchMedia(q).matches);
  useEffect(() => {
    if (typeof matchMedia === "undefined") return;
    const m = matchMedia(q), f = () => setW(m.matches);
    if (m.addEventListener) m.addEventListener("change", f); else m.addListener(f);
    f();
    return () => { if (m.removeEventListener) m.removeEventListener("change", f); else m.removeListener(f); };
  }, []);
  return w;
}


/* Photo browser (photo-browsing chat, 18 Nov 16:00-17:50). It was published straight onto the live artifact without
   its source; ported back here from the live page (v1.29, 1795025052-bb9f) by Legolas, same behaviour.
   Phone: a strip of photos at the top; the Profile Card covers its foot. Pull the card down (or tap the photos, the
   card or the grip) to open the strip to a taller size; push up to close. Desktop: a mosaic beside the card; a tap
   opens that photo full size in the same space (PhotoStrip11 with fill), with X back to the mosaic.
   profile-photos (18 Nov 20:10): desktop is now DeskGallery11 (big photo, row of all photos below); phone and iPad keep the strip.
   Styles: .ff-ps* in src/shell/index.html (head <style>). */
function ffPvScroller11(n) {
  while (n && n !== document.body) {
    const o = getComputedStyle(n).overflowY;
    if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight) return n;
    n = n.parentElement;
  }
  return document.scrollingElement || document.documentElement;
}

function PhotoStrip11({ items, onBad, open, onTap, atRef, fill, onClose, start, stick }) {
  const ref = useRef(null), boxRef = useRef(null);
  const [at, setAt] = useState(start || 0);
  const [w, setW] = useState(0);
  useDragScroll(ref);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && start) el.scrollLeft = start * el.clientWidth;
  }, []);
  /* Keep the photo in view when the strip changes size (opening, closing, rotating). */
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const f = () => {
      setW(box.clientWidth);
      const el = ref.current;
      if (el) el.scrollLeft = (atRef.current || 0) * el.clientWidth;
    };
    f();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(f) : null;
    if (ro) ro.observe(box); else window.addEventListener("resize", f);
    return () => { if (ro) ro.disconnect(); else window.removeEventListener("resize", f); };
  }, []);
  const go = (i) => {
    const el = ref.current;
    if (!el) return;
    const k = Math.max(0, Math.min(items.length - 1, i));
    el.scrollTo({ left: k * el.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
  const n = items.length;
  const shown = open || stick;
  return (
    <section ref={boxRef} className={`ff-ps${open ? " open" : ""}${fill ? " fill" : ""}${stick ? " stick" : ""}`} aria-label={`Photos, ${n}`}>
      <div className="ff-ps-track" ref={ref} onScroll={(e) => {
        const el = e.currentTarget;
        const k = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        atRef.current = k;
        if (k !== at) setAt(k);
      }}>
        {items.map((m, i) => (
          <button key={m.src.slice(-40) + i} type="button" className="ff-ps-slide" aria-label={shown ? `Photo ${i + 1} of ${n}` : `Show photo ${i + 1} of ${n}`} onClick={() => onTap(i)}>
            {stick && Math.abs(i - at) <= 1 && <img className="ff-ps-fill" src={m.src} alt="" aria-hidden="true" draggable={false} decoding="async" />}
            <img className="ff-ps-img" src={m.src} alt={shown ? (m.name ? `Photo: ${m.name}` : `Photo ${i + 1}`) : ""} draggable={false} decoding="async" loading={i ? "lazy" : "eager"} onError={() => onBad && onBad(m.src)} />
          </button>
        ))}
      </div>
      {fill && onClose && <button type="button" className="ff-ps-x" aria-label="Back to all photos" onClick={onClose}><X size={18} /></button>}
      {n > 1 && (
        <>
          {shown && <span className="ff-ps-n" aria-live="polite">{`${at + 1} / ${n}`}</span>}
          <button type="button" className="ff-ps-arrow l" aria-label="Previous photo" disabled={at === 0} onClick={() => go(at - 1)}><ChevronLeft size={18} /></button>
          <button type="button" className="ff-ps-arrow r" aria-label="Next photo" disabled={at >= n - 1} onClick={() => go(at + 1)}><ChevronRight size={18} /></button>
          <div className="ff-ps-dots" aria-hidden="true">{items.map((m, i) => <span key={i} className={i === at ? "on" : ""} />)}</div>
        </>
      )}
    </section>
  );
}



/* profile-photos (Alex, 18 Nov 20:10): desktop shows one big photo with every photo in a row below it; with more than
   five the row scrolls left and right. A tap on a thumbnail shows it big; arrows step through them. */
function DeskGallery11({ items, onBad }) {
  const [at, setAt] = useState(0);
  const rowRef = useRef(null);
  useDragScroll(rowRef);
  const n = items.length, k = Math.min(at, n - 1), m = items[k];
  const go = (i) => setAt(Math.max(0, Math.min(n - 1, i)));
  useEffect(() => {
    const row = rowRef.current, t = row && row.children[k];
    if (!row || !t) return;
    const l = t.offsetLeft, r = l + t.offsetWidth;
    if (l < row.scrollLeft) row.scrollTo({ left: l, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    else if (r > row.scrollLeft + row.clientWidth) row.scrollTo({ left: r - row.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [k]);
  if (!m) return null;
  return (
    <section className={"ff-pgal" + (n > 1 ? " multi" : "") + (n > 5 ? " many" : "")} aria-label={`Photos, ${n}`}>
      <div className="ff-pgal-big" onKeyDown={(e) => { if (e.key === "ArrowLeft") go(k - 1); else if (e.key === "ArrowRight") go(k + 1); }}>
        <img decoding="async" className="ff-pm-fill" src={m.src} alt="" aria-hidden="true" draggable={false} />
        <img decoding="async" className="ff-pm-img" src={m.src} alt={m.name ? `Photo: ${m.name}` : `Photo ${k + 1}`} draggable={false} onError={() => onBad && onBad(m.src)} />
        {n > 1 && <>
          <span className="ff-ps-n" aria-live="polite">{`${k + 1} / ${n}`}</span>
          <button type="button" className="ff-ps-arrow l" aria-label="Previous photo" disabled={k === 0} onClick={() => go(k - 1)}><ChevronLeft size={18} /></button>
          <button type="button" className="ff-ps-arrow r" aria-label="Next photo" disabled={k >= n - 1} onClick={() => go(k + 1)}><ChevronRight size={18} /></button>
        </>}
      </div>
      {n > 1 && (
        <div className="ff-pgal-row" ref={rowRef}>
          {items.map((x, i) => (
            <button key={x.src.slice(-40) + i} type="button" className={"ff-pgal-t" + (i === k ? " on" : "")} aria-label={`Show photo ${i + 1} of ${n}`} aria-current={i === k ? "true" : undefined} onClick={() => go(i)}>
              <img decoding="async" src={x.src} alt="" draggable={false} loading={i > 5 ? "lazy" : "eager"} />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}



/* The top of a visitor's page: the pictures, then the Profile Card, then
   Back and the actions. Phone: the photo strip, with the card over its foot (pull down to open the strip).
   Desktop: card on the left, the mosaic taking the rest; a tap opens one photo full size there. */
function PublicHero({ media, card, below, narrow }) {
  /* profile-photos: iPads and other touch screens get the phone layout at every width. */
  const wide = useWide(900, "(min-width:900px) and (hover:hover) and (pointer:fine)");
  const [seen, setSeen] = useState({});
  const key = media.map(m => m.src).join("|");
  useEffect(() => {
    let live = true;
    media.forEach(m => {
      if (!m.src || seen[m.src] !== undefined) return;
      if (/^data:/.test(m.src)) { setSeen(v => ({ ...v, [m.src]: true })); return; }
      const im = new Image();
      im.onload = () => live && setSeen(v => ({ ...v, [m.src]: im.naturalWidth > 0 }));
      im.onerror = () => live && setSeen(v => ({ ...v, [m.src]: false }));
      im.src = m.src;
    });
    return () => { live = false; };
  }, [key]);
  /* A picture counts only once it has really loaded; a blocked or missing one leaves no slide, no dot and no black box. */
  /* v1.149 (Alex 20 Nov 04:22): a picture still loading counts as on the page, so the card opens in its lower place and does not click down when the picture arrives. */
  const list = media.filter(m => m.src && seen[m.src] !== false);
  const onBad = (src) => setSeen(v => (v[src] === false ? v : { ...v, [src]: false }));
  const has = list.length > 0;
  const atRef = useRef(0);
  const colRef = useRef(null), heroRef = useRef(null), cardRef = useRef(null), wrapRef = useRef(null), gripRef = useRef(null);
  const strip = has && !wide;
  /* The column under the card (Back, actions) is as wide as the card itself: --ff-cardw. */
  useEffect(() => {
    const c = cardRef.current, h = heroRef.current;
    if (!c || !h) return;
    let obs = null;
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => f()) : null;
    const f = () => {
      const el = c.querySelector(".ff-deck") || c.firstElementChild;
      if (!el) return;
      if (ro && obs !== el) { if (obs) ro.unobserve(obs); ro.observe(el); obs = el; }
      const cw = el.getBoundingClientRect().width;
      if (cw) h.style.setProperty("--ff-cardw", Math.round(cw) + "px");
    };
    const mo = typeof MutationObserver !== "undefined" ? new MutationObserver(f) : null;
    if (mo) mo.observe(c, { childList: true, subtree: true });
    f();
    window.addEventListener("resize", f);
    return () => { if (ro) ro.disconnect(); if (mo) mo.disconnect(); window.removeEventListener("resize", f); };
  }, []);
  /* photo-scroll (Aragorn and Gandalf, 18 Nov): phone and iPad use the browser's own scrolling, no gesture code.
     The photos sit at the top at one size (they never switch size or fit, so nothing jumps or flashes) and stick under
     the top bar while the card slides over them. The page opens scrolled down to "closed": the card's icon line on the
     photos' bottom edge. Scrolling up slides the card down to show the whole photo ("open"); scrolling down slides it
     back up to the line and the same swipe carries on down the page, because the photos stop sticking exactly there.
     --ov is the distance from the card's top to its icon line (.ff-pc-rule; 128px on a Company Card, which has none).
     The release point is CSS: the strip's box is (photo height + --ov + 14px) tall and the card column starts -(--ov)
     below it. Nothing here sets React state while scrolling. */
  /* The photos stick just under the menu bar when it stays on screen (900px and wider), else at the very top: on
     phones the menu bar scrolls away (v16.10). */
  const stickTop = () => {
    const tb = document.querySelector(".ff-topbar");
    return tb && getComputedStyle(tb).position === "sticky" ? Math.round(tb.getBoundingClientRect().height) : 0;
  };
  const [ov, setOv] = useState(false);
  const pinned = useRef(null);
  const closedY = () => {
    const w = wrapRef.current, h = heroRef.current;
    if (!w || !h) return 0;
    const o = parseFloat(getComputedStyle(h).getPropertyValue("--ov")) || 0;
    return Math.max(0, Math.round(w.getBoundingClientRect().top + window.scrollY + o + 14 - stickTop()));
  };
  const openY = () => {
    const w = wrapRef.current;
    if (!w) return 0;
    const top = w.getBoundingClientRect().top + window.scrollY;
    return top <= 160 ? 0 : Math.max(0, Math.round(top - stickTop() - 16));
  };
  /* Keep "closed" reachable on a short page, and keep the card on the line when the card or window changes size. */
  const pin = (first) => {
    const y = closedY();
    if (!y) return;
    document.body.style.minHeight = `calc(${y}px + 100vh)`;
    const cur = window.scrollY || 0;
    if (first) { if (cur < y) window.scrollTo(0, y); }
    else if (pinned.current !== null && Math.abs(cur - pinned.current) <= 2 && Math.abs(y - cur) > 1) window.scrollTo(0, y);
    pinned.current = y;
  };
  useLayoutEffect(() => {
    const c = cardRef.current, h = heroRef.current;
    if (!strip || !c || !h) { setOv(false); return; }
    let first = true, raf = 0;
    const f = () => {
      const line = c.querySelector(".ff-pc-rule"), t = c.getBoundingClientRect();
      if (!t.height) return;
      const r = line && line.getBoundingClientRect();
      const y = r && r.height ? r.top + r.height / 2 - t.top : Math.min(128, t.height * 0.6);
      h.style.setProperty("--ov", Math.round(y) + "px");
      h.style.setProperty("--psTop", stickTop() + "px");
      setOv(true);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => { pin(first); first = false; });
    };
    f();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(f) : null;
    if (ro) ro.observe(c);
    window.addEventListener("resize", f);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", f); cancelAnimationFrame(raf); document.body.style.minHeight = ""; pinned.current = null; };
  }, [strip]);
  /* aria-expanded on the grip follows the scroll, written straight to the button (no re-render). */
  useEffect(() => {
    if (!strip) return;
    let raf = 0;
    const f = () => {
      raf = 0;
      const g = gripRef.current;
      if (!g) return;
      const isOpen = (window.scrollY || 0) < closedY() - 24;
      const v = isOpen ? "true" : "false";
      if (g.getAttribute("aria-expanded") !== v) {
        g.setAttribute("aria-expanded", v);
        g.setAttribute("aria-label", isOpen ? "Cover the photos" : "Show the photos");
      }
    };
    const sc = () => { if (!raf) raf = requestAnimationFrame(f); };
    window.addEventListener("scroll", sc, { passive: true });
    f();
    return () => { window.removeEventListener("scroll", sc); cancelAnimationFrame(raf); };
  }, [strip, ov]);
  const smooth = prefersReducedMotion() ? "auto" : "smooth";
  const isOpenNow = () => (window.scrollY || 0) < closedY() - 24;
  const showPhotos = () => window.scrollTo({ top: openY(), behavior: smooth });
  const coverPhotos = () => window.scrollTo({ top: closedY(), behavior: smooth });
  /* A tap on the photos or on the card (not on one of its buttons or links) shows the photos; a second tap does nothing. */
  const cardTap = (e) => {
    if (!strip || isOpenNow()) return;
    const t = e.target;
    if (t && t.closest && t.closest('button,a,input,textarea,select,label,summary,[contenteditable="true"],[role="button"],[role="link"]')) return;
    showPhotos();
  };
  const media2 = !has ? null
    : wide ? <DeskGallery11 items={list} onBad={onBad} />
    : <div className="ff-ps-wrap" ref={wrapRef}><PhotoStrip11 items={list} onBad={onBad} stick atRef={atRef} onTap={() => { if (!isOpenNow()) showPhotos(); }} /></div>;
  return (
    <div ref={heroRef} className={`ff-phero${has ? " has-media" : ""}${wide ? " wide" : ""}${strip && ov ? " ov ns" : ""}`}>
      {media2}
      <div className="ff-pcol" ref={colRef}>
        {strip && <button type="button" ref={gripRef} className="ff-ph-grip" aria-label="Show the photos" aria-expanded="false" onClick={() => (isOpenNow() ? coverPhotos() : showPhotos())}><span aria-hidden="true" /></button>}
        <div ref={cardRef} className={"ff-ph-card" + (strip ? " tap" : "")} onClick={cardTap}>{card}</div>
        <div className={"ff-prest" + (narrow ? " narrow" : "")}>{below}</div>
      </div>
    </div>
  );
}



/* On your own saved profile: the editing tools only while editing; otherwise a
   way to see the page as a visitor does. */
function OwnEditTools() {
  const { dispatch } = useStore();
  const editing = useEditing(true);
  if (!editing) return (
    <section className="ff-guestprompt" aria-labelledby="ff-gp-h">
      <span className="ic" aria-hidden="true"><Eye size={20} /></span>
      <div className="tx">
        <h2 id="ff-gp-h">View your profile as a guest</h2>
        <p>See your pictures, About Me and tabs exactly as visitors do.</p>
      </div>
      <Btn variant="primary" onClick={() => { dispatch({ type: "VIEW", id: "me", guest: true }); window.scrollTo(0, 0); }}><Eye size={14} /> View as guest</Btn>
    </section>
  );
  return (<><ProfileFFAI /><CVPanel /><CreatorMedia /></>);
}



/* ---- 2. Tabs ------------------------------------------------------------- */
function ProfileTabs({ tabs, active, onChange }) {
  const refs = useRef({});
  const key = (e, i) => {
    let n = null;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    else if (e.key === "ArrowLeft") n = (i + tabs.length - 1) % tabs.length;
    else if (e.key === "Home") n = 0;
    else if (e.key === "End") n = tabs.length - 1;
    if (n === null) return;
    e.preventDefault(); onChange(tabs[n].key);
    setTimeout(() => refs.current[tabs[n].key] && refs.current[tabs[n].key].focus(), 0);
  };
  return (
    <div className="ff-ptabs" role="tablist" aria-label="Profile sections">
      {tabs.map((t, i) => (
        <button key={t.key} ref={(el) => { refs.current[t.key] = el; }} type="button" role="tab" id={`ff-tab-${t.key}`} aria-selected={active === t.key} aria-controls="ff-tabpanel"
          tabIndex={active === t.key ? 0 : -1} className={active === t.key ? "on" : ""} onClick={() => onChange(t.key)} onKeyDown={(e) => key(e, i)}>
          <span className="lb">{t.label}</span>{t.count !== undefined && <span className="ct">({t.count})</span>}
        </button>
      ))}
    </div>
  );
}



/* A horizontal row that remembers where it was scrolled to (per tab). */
function MemScroll({ mem, k, className, children, label, snap = true }) {
  const ref = useRef(null);
  useDragScroll(ref);
  useLayoutEffect(() => { if (ref.current && mem.current[k]) ref.current.scrollLeft = mem.current[k]; }, []);
  return (
    <div ref={ref} className={`ff-mrow${snap ? " snap" : ""} ${className || ""}`} aria-label={label} tabIndex={0}
      onScroll={(e) => { mem.current[k] = e.currentTarget.scrollLeft; }}>
      {children}
    </div>
  );
}



/* ---- 3. Cover Flow: a prominent centre card, neighbours showing ---------- */
/* v1.57 (Alex, 18 Nov 20:51, "I can't swipe left on it unless it's clean"): on touch screens the slider moves itself.
   The track has touch-action: pan-y, so the browser only ever scrolls the page up and down from it; a swipe that is
   more sideways than up-and-down (up to about 50 degrees) holds the page still and moves the slider instead, and on
   release it settles on the next card (or the previous one) once it has moved 30px or was flicked. Before, a swipe
   that wasn't almost level was taken by the page (which moved slightly) and the slider stayed put, and a short swipe
   snapped back. onIndex (optional) hears which card is in the centre. */
function useCoverSwipe17(ref, idxRef, to) {
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let a = null, axis = null, moved = false, settle = 0;
    /* the card nearest the centre right now (the state can lag behind a scroll still settling) */
    const near = () => { const mid = el.scrollLeft + el.clientWidth / 2; let best = idxRef.current, bd = 1e9; [...el.children].forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = i; } }); return best; };
    const ts = (e) => {
      if (e.touches.length !== 1) { a = null; return; }
      const t = e.touches[0];
      a = { x: t.clientX, y: t.clientY, left: el.scrollLeft, i: near(), t: Date.now(), lx: t.clientX, lt: Date.now(), v: 0 };
      axis = null; moved = false;
    };
    const tm = (e) => {
      if (!a) return;
      if (e.touches.length !== 1) { a = null; return; }
      const t = e.touches[0], dx = t.clientX - a.x, dy = t.clientY - a.y;
      if (!axis) {
        if (Math.abs(dx) >= Math.abs(dy) && e.cancelable) e.preventDefault();
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 8) return;
        axis = Math.abs(dx) * 1.2 >= Math.abs(dy) ? "x" : "y";
        if (axis === "y") { a = null; return; }
        clearTimeout(settle); el.classList.add("dragging"); moved = true;
      }
      if (e.cancelable) e.preventDefault();
      const now = Date.now();
      if (now > a.lt) { a.v = (t.clientX - a.lx) / (now - a.lt); a.lx = t.clientX; a.lt = now; }
      el.scrollLeft = a.left - dx;
    };
    const te = (e) => {
      if (!a || axis !== "x") { a = null; return; }
      const dx = (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : a.lx) - a.x;
      const dir = dx <= -30 || a.v < -0.3 ? 1 : dx >= 30 || a.v > 0.3 ? -1 : 0;
      const n = el.children.length;
      to(Math.max(0, Math.min(n - 1, a.i + dir)));
      a = null;
      settle = setTimeout(() => el.classList.remove("dragging"), 420);
    };
    const clickCap = (e) => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } };
    const np = { passive: false }, pa = { passive: true };
    el.addEventListener("touchstart", ts, pa);
    el.addEventListener("touchmove", tm, np);
    el.addEventListener("touchend", te, pa);
    el.addEventListener("touchcancel", te, pa);
    el.addEventListener("click", clickCap, true);
    return () => {
      el.removeEventListener("touchstart", ts, pa); el.removeEventListener("touchmove", tm, np);
      el.removeEventListener("touchend", te, pa); el.removeEventListener("touchcancel", te, pa);
      el.removeEventListener("click", clickCap, true); clearTimeout(settle);
    };
  }, []);
}

function CoverFlow({ items, label, mem, k, half = 150, onOpen, onIndex, render }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const [idx, setIdx] = useState(Math.min(mem.current[k] || 0, Math.max(0, items.length - 1)));
  const idxRef = useRef(idx); idxRef.current = idx;
  useEffect(() => { if (onIndex) onIndex(idx); }, [idx]);
  useDragScroll(ref);
  const measure = () => {
    const el = ref.current; if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bd = 1e9;
    [...el.children].forEach((c, i) => {
      const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
      if (d < bd) { bd = d; best = i; }
      const t = Math.min(1, d / (c.offsetWidth * 0.95));
      c.style.setProperty("--cf-s", (1 - t * 0.14).toFixed(3));
      c.style.setProperty("--cf-o", (1 - t * 0.4).toFixed(3));
    });
    setIdx(best); mem.current[k] = best;
  };
  const to = (i, instant) => {
    const el = ref.current, c = el && el.children[i]; if (!c) return;
    el.scrollTo({ left: c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2, behavior: instant || prefersReducedMotion() ? "auto" : "smooth" });
  };
  const toRef = useRef(to); toRef.current = to;
  useCoverSwipe17(ref, idxRef, (i) => toRef.current(i));
  useLayoutEffect(() => { to(idx, true); measure(); }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const pick = (i) => { if (i === idx) onOpen(items[i]); else to(i); };
  return (
    <div className="ff-cf" style={{ "--cf-half": `${half}px` }} role="group" aria-roledescription="carousel" aria-label={label}>
      <div className="ff-cf-track" ref={ref} tabIndex={0} aria-label={`${label}. Use the left and right arrow keys; Enter opens the centre card.`}
        onScroll={() => { cancelAnimationFrame(raf.current); raf.current = requestAnimationFrame(measure); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") { e.preventDefault(); to(Math.min(items.length - 1, idx + 1)); }
          else if (e.key === "ArrowLeft") { e.preventDefault(); to(Math.max(0, idx - 1)); }
          else if (e.key === "Enter" || e.key === " ") { if (e.target === e.currentTarget) { e.preventDefault(); onOpen(items[idx]); } }
        }}>
        {items.map((it, i) => (
          <div key={it.id} className={`ff-cf-item${i === idx ? " on" : ""}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}
            aria-current={i === idx ? "true" : undefined} onClick={() => pick(i)}>
            {render(it, i === idx)}
          </div>
        ))}
      </div>
      {items.length > 1 && (<>
        <button type="button" className="ff-cf-arrow l" aria-label={`Previous in ${label}`} disabled={idx === 0} onClick={() => to(idx - 1)}><ChevronLeft size={20} /></button>
        <button type="button" className="ff-cf-arrow r" aria-label={`Next in ${label}`} disabled={idx >= items.length - 1} onClick={() => to(idx + 1)}><ChevronRight size={20} /></button>
        <div className="ff-cf-count" aria-live="polite">{idx + 1} / {items.length}</div>
      </>)}
    </div>
  );
}



/* ---- 4. What each tab shows, from the real records ----------------------- */
function servicesOf(state, person) {
  const ids0 = person.id === "me" ? (state.profile.serviceInterest || []) : (person.serviceInterest || []);
  /* FireFlair's own packages follow the profession: bartending, mixology (and cocktail bartender), flair. */
  const pt = [person.profession, person.group, ...((recordsForPerson(state, person).professions || []).filter(r => !r.hidden && !r.proposed).map(r => r.name))].join(" ");
  const bar = /bartend/i.test(pt), mix = /mixolog|cocktail/i.test(pt), flair = /flair/i.test(pt);
  /* Your own profile lists only the packages you have signed up for on Bookings. Other people also get the ones their profession fits (sample data). */
  const ids = person.id === "me" ? ids0 : [...ids0, ...(bar ? ["svc_bartending"] : []), ...(mix ? ["svc_mixology", "svc_masterclass"] : []), ...(flair ? ["svc_flair"] : [])];
  return [
    ...[...PARTY_SERVICES, ...(PARTY_SERVICES.some(s => s.id === "svc_staffing") ? [] : [STAFFING_SERVICE])].filter(s => ids.includes(s.id)).map(s => ({ id: s.id, kind: "std", svc: s })),
    ...OWN_SERVICE_EXAMPLES.filter(x => x.personId === person.id).map(x => ({ id: x.id, kind: "own", item: { ...x, person } })),
  ];
}


function reviewsOf(state, person) {
  const dt = (t) => { try { return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; } };
  const raw = (state.reviews || []).filter(r => r.aboutId === person.id);
  return reviewRecordsFor(state, person.id).map(rec => {
    const r = raw.find(x => x.id === rec.id) || {};
    const shift = r.shiftId ? (state.shifts || []).find(s => s.id === r.shiftId) : null;
    /* v17.22: my review that waits for them to accept reads "Waiting for <First>" in place of the date. */
    const when = rec.pending ? `Waiting for ${person.isCompany ? person.name : String(person.name || "").split(" ")[0]}` : dt(r.at);
    return { ...rec, subline: [when, shift ? [shift.role, shift.venue].filter(Boolean).join(" · ") : ""].filter(Boolean).join(" · ") };
  });
}


/* Attributes as one collection: every category in reading order, each in tier order. */
const completeness = (r) => {
  const d = r.details ? Object.values(r.details).filter(v => String(v == null ? "" : v).trim()).length : 0;
  return (String(r.description || "").trim() ? 2 + Math.min(2, String(r.description).length / 80) : 0) + d + (r.media || []).length * 1.5 + (r.document && r.document.name ? 1 : 0) + (r.verified === true ? 1 : 0);
};


function attributesOf(state, person, cats) {
  const recs = recordsForPerson(state, person);
  const order = categoryOrder().filter(k => !cats[k].system && k !== "professions");
  const keys0 = [...PUB_ORDER.filter(k => order.includes(k)), ...order.filter(k => !PUB_ORDER.includes(k))];
  /* pb-qualifications: Qualifications are the left-hand Attributes card; the CV counts as one while SHOW_CV_PUBLIC is on. */
  const keys = [...keys0.filter(k => k === "qualifications"), ...keys0.filter(k => k !== "qualifications")];
  const flat = keys.flatMap((k, ki) => (k === "locations" ? covRecsFor17(state, person, (recs[k] || []).filter(r => !r.hidden && !r.proposed)).map(r => ({ r, rank: "tertiary" })) : withRanks((recs[k] || []).filter(k === "qualifications" ? pubQualOk : (r => !r.hidden && !r.proposed)))).map(({ r, rank }, i) => ({ id: `${k}:${r.id}`, record: r, def: cats[k], category: k, rank, score: completeness(r), at: ki * 1000 + i })));
  return flat.sort((a, b) => b.score - a.score || a.at - b.at);
}




/* One card per attribute category (Skills, Interests, Languages…), listing the
   titles. A tap opens View all attributes for the full details. */
/* Every record of one category at full size: all of its text, details and pictures. */
function ExpandedAttrs({ list }) {
  const cap = (k) => String(k).replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase());
  return (
    <div className="ff-xatt">
      {list.map(r => {
        const det = r.details ? Object.entries(r.details).filter(([, v]) => String(v == null ? "" : v).trim()) : [];
        const media = (r.media || []).filter(m => m && (m.dataUrl || m.src));
        return (
          <article key={r.id} className={"ff-xatt-box cat-" + r.category}>
            <h3>{r.name}</h3>
            {r.category === "venues" && r.address && <div className="ff-xatt-note">{r.address}{r.place ? <> · <a href={venueMapsUrl17(r)} target="_blank" rel="noopener noreferrer">View on Google Maps</a></> : null}</div>}
            {!/^Uploaded \d/.test(String(r.description || "")) && String(r.description || "").trim() && <p>{r.description}</p>}
            {det.length > 0 && <dl>{det.map(([k, v]) => <div key={k}><dt>{cap(k)}</dt><dd>{String(v)}</dd></div>)}</dl>}
            {media.length > 0 && <div className="ff-xatt-media">{media.map((m, i) => <img decoding="async" key={i} src={m.dataUrl || m.src} alt={m.name || ""} loading="eager" />)}</div>}
            {r.document && r.document.name && (pubCvHref(r)
              ? <div className="ff-xatt-note"><a href={pubCvHref(r)} target="_blank" rel="noopener noreferrer" download={r.document.name} style={{ color: "inherit" }}><FileText size={12} aria-hidden="true" /> Open CV</a></div>
              : <div className="ff-xatt-note">Document: {r.document.name}</div>)}
            {r.verified === true && <div className="ff-xatt-note">Verified</div>}
          </article>
        );
      })}
    </div>
  );
}



/* v1.188 (Alex 21 Nov): an attribute card is one fixed size (5:7) everywhere; its entries carry on in the next card of the same category by the MEASURED height of what the card shows (names and the descriptions people write), and nothing else. Shared by the builder (PE2AttrCat185) and the profile page (PubAttrCat188). */
const attrSd188 = (r) => (!r.cv && !/^Uploaded /.test(String(r.description || "")) && String(r.description || "").trim()) ? wholeSentences21(r.description, 70) : "";
function useAttrMeasure188(sig) {
  const meas = useRef(null);
  const [m, setM] = useState(null);
  React.useLayoutEffect(() => {
    const run = () => {
      const el = meas.current; if (!el) return;
      const head = el.querySelector("[data-m=head]"), la = el.querySelector("[data-m=a]"), lb = el.querySelector("[data-m=b]");
      if (!head || !la || !lb) return;
      const cs = getComputedStyle(head), top = head.querySelector(".ff-agrp-top");
      const gap = parseFloat(cs.rowGap) || 10;
      const avail = head.getBoundingClientRect().height - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - top.getBoundingClientRect().height - gap - 3;
      const hs = (l) => [...l.children].map(c => Math.ceil(c.getBoundingClientRect().height) + 1);
      const next = { avail, a: hs(la), b: hs(lb) };
      setM(cur => cur && JSON.stringify(cur) === JSON.stringify(next) ? cur : next);
    };
    run();
    window.addEventListener("resize", run);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
    return () => window.removeEventListener("resize", run);
  }, [sig]);
  return [meas, m];
}
function attrChunks188(list, m) {
  const chunks = []; const withSd = {};
  if (list.length) {
    let cur = [], used = 0;
    list.forEach((r, i) => {
      let h = m && m.a[i] != null ? m.a[i] : 0, sd = true;
      /* An entry too long for a box on its own keeps its description, cut to the whole lines that fit and ended with "…" (the full text is in the pop-up). It takes a box to itself. */
      if (m && h > m.avail) { const nameH = m.b[i] != null ? m.b[i] : 0; const lines = Math.floor((m.avail - nameH - 4) / 14.3); sd = lines >= 1 ? lines : false; h = lines >= 1 ? m.avail : nameH; }
      withSd[r.id] = sd;
      if (m && cur.length && used + h > m.avail) { chunks.push(cur); cur = []; used = 0; }
      cur.push(r); used += h;
    });
    if (cur.length) chunks.push(cur);
  }
  return { chunks, withSd };
}
/* One category of the profile page's Attributes row: a hidden measuring copy, then one fixed-size card per chunk. */
function PubAttrCat188({ g, ci, onOpen }) {
  const label = (g.def && g.def.label) || g.key;
  const isQ = g.key === "qualifications";
  const list = g.list;
  const sdOf = (it) => isQ ? "" : attrSd188(it.record);
  const sig = g.key + "§" + label + "§" + list.map(it => it.id + "|" + it.record.name + "|" + sdOf(it)).join("§");
  const [meas, m] = useAttrMeasure188(sig);
  const { chunks, withSd } = attrChunks188(list, m);
  const entry = (it, sd) => {
    if (isQ) {
      const href = pubCvHref(it.record);
      return <span key={it.id}>{href
        ? <a className="pbq-cvlink" href={href} target="_blank" rel="noopener noreferrer" download={(it.record.document && it.record.document.name) || "CV"} aria-label="Open CV"><QualNm r={it.record} /></a>
        : <QualNm r={it.record} />}</span>;
    }
    const d = sdOf(it);
    return <span key={it.id}>{nbh21(it.record.name)}{sd && d && <small className={"ff-agrp-sd" + (typeof sd === "number" ? " clamp185" : "")} style={typeof sd === "number" ? { WebkitLineClamp: sd } : undefined}>{nbh21(d)}</small>}</span>;
  };
  const top = <span className="ff-agrp-top"><span className="ff-agrp-h">{label}</span><span className="ff-agrp-n" aria-hidden="true"><ChevronDown size={16} strokeWidth={2.2} /></span></span>;
  /* Work locations keep their own rule: the areas as they were ticked, three on the card and "+N" for the rest. */
  const cards = g.key === "locations" ? [{ key: g.key, part: list.slice(0, 3), more: Math.max(0, list.length - 3) }] : chunks.map((c, i) => ({ key: g.key + "-" + i, part: c, more: 0 }));
  const mcls = "ff-agrp cat-" + g.key + " " + tierCls17(ci) + (isQ ? " pbq-pub" : "");
  return (
    <>
      {g.key !== "locations" && (
        <div className="pe2-meas" aria-hidden="true" ref={meas}>
          <div className={mcls} data-m="head">{top}</div>
          <div className={mcls}>{top}<span className="ff-agrp-l" data-m="a">{list.map(it => entry(it, true))}</span></div>
          <div className={mcls}>{top}<span className="ff-agrp-l" data-m="b">{list.map(it => entry(it, false))}</span></div>
        </div>
      )}
      {cards.map(c => isQ
        ? <PubQualCard key={c.key} label={label} part={c.part} more={c.more} total={c.part.length + c.more} cls={"cat-qualifications " + tierCls17(ci)} onOpen={() => onOpen(g.key)} />
        : (
          <button key={c.key} type="button" className={"ff-agrp cat-" + g.key + " " + tierCls17(ci)} onClick={() => onOpen(g.key)}
            aria-label={`${label}: ${list.map(it => it.record.name).join(", ")}. View all attributes`}>
            {top}
            <span className="ff-agrp-l">{c.part.map(it => entry(it, g.key === "locations" ? true : withSd[it.id]))}</span>
            {c.more > 0 && <span className="ff-agrp-more">{`+${c.more}`}</span>}
          </button>
        ))}
    </>
  );
}
function AttrGroups({ items, mem, onOpen }) {
  const groups = [];
  items.forEach(it => {
    let g = groups.find(x => x.key === it.category);
    if (!g) groups.push(g = { key: it.category, def: it.def, ord: it.at, list: [] });
    g.ord = Math.min(g.ord, it.at); g.list.push(it);
  });
  groups.sort((a, b) => a.ord - b.ord);
  groups.forEach(g => g.list.sort((a, b) => a.at - b.at));
  return (
    <MemScroll mem={mem} k="overview" label="Attributes" className="ff-acar ff-acar188">
      {groups.map((g, i) => <PubAttrCat188 key={g.key} g={g} ci={i} onOpen={onOpen} />)}
    </MemScroll>
  );
}



/* p2/pubprof: no more Gold / Silver / Bronze. Every profession and attribute card takes the person's Profile Card
   theme, muted (a quiet tint of that theme, a gold hairline, cream text on the dark ones). The colours are CSS
   variables set by cardTone17 on the profile's wrapper; .t-card in prof21.css reads them. */
const tierCls17 = () => "t-card";
const CARD_TONES17 = {
  ivory:    { bg: "linear-gradient(165deg,#FBF7EE 0%,#EFE6D3 100%)", ink: "#1E1A12", sub: "#5E5646", dark: false },
  paper:    { bg: "linear-gradient(165deg,#F8F7F3 0%,#E8E6E0 100%)", ink: "#1A1A1C", sub: "#55544F", dark: false },
  grey:     { bg: "linear-gradient(165deg,#F4EFE4 0%,#E2D7C2 100%)", ink: "#1A1712", sub: "#4A443A", dark: false },
  silver:   { bg: "linear-gradient(165deg,#EEEFF1 0%,#D2D5DA 100%)", ink: "#16181C", sub: "#3E434A", dark: false },
  gold:     { bg: "linear-gradient(165deg,#F3EAD0 0%,#DCC896 100%)", ink: "#221A06", sub: "#4A3C16", dark: false },
  onyx:     { bg: "linear-gradient(165deg,#2A292D 0%,#161518 100%)", ink: "#F4EFE4", sub: "#C9C3B6", dark: true },
  burgundy: { bg: "linear-gradient(165deg,#5A2A33 0%,#33161C 100%)", ink: "#F4EFE4", sub: "#DCC6BC", dark: true },
  slate:    { bg: "linear-gradient(165deg,#2E3F37 0%,#19251F 100%)", ink: "#F4EFE4", sub: "#C3D0C7", dark: true },
  magenta:  { bg: "linear-gradient(165deg,#5A3442 0%,#301A22 100%)", ink: "#F4EFE4", sub: "#DCC6CA", dark: true },
  cobalt:   { bg: "linear-gradient(165deg,#544a30 0%,#2C2616 100%)", ink: "#F4EFE4", sub: "#DACFB0", dark: true },
  saffron:  { bg: "linear-gradient(165deg,#6A4740 0%,#36211B 100%)", ink: "#F4EFE4", sub: "#DFC9BA", dark: true },
};
function cardTone17(themeKey) {
  const t = CARD_TONES17[themeKey] || CARD_TONES17.ivory;
  return { "--tc-bg": t.bg, "--tc-ink": t.ink, "--tc-sub": t.sub, "--tc-line": t.dark ? "rgba(201,162,39,.6)" : "rgba(176,141,42,.7)",
    "--tc-rule": t.dark ? "rgba(244,239,228,.14)" : "rgba(30,26,18,.12)", "--tc-acc": t.dark ? "#D9BE68" : "#8A6A1E" };
}
/* The theme a profile's cards follow: yours from your Profile Card, anyone else's as their card shows it. */
const cardThemeOf17 = (state, person) => person.id === "me" ? (state.profile.theme || "onyx") : (person.theme || "ivory");



function AboutMeBlock({ text, big }) {
  const [more, setMore] = useState(false);
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  useLayoutEffect(() => { const el = ref.current; if (el) setOver(more || el.scrollHeight > el.clientHeight + 2); }, [text, more]);
  if (!String(text || "").trim()) return null;
  return (
    <section className={"ff-about ff-pp21" + (big ? " ff-about-big" : "")} aria-labelledby="ff-about-h">
      <div className="ff-pp-head"><h2 id="ff-about-h" className="ff-about-h">About Me</h2></div>
      <p ref={ref} id="ff-about-text" className={more ? "" : "clamp"}>{text}</p>
      {(over || more) && <button type="button" className="ff-pub-more" aria-expanded={more} aria-controls="ff-about-text" onClick={() => setMore(!more)}>{more ? "Read less" : "Read more"}</button>}
    </section>
  );
}
