/* src/components/team/public-profile.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- v1.4: Biography / Introduction, and the public profile ---------------
   The biography is the profile's existing `about` text (one source of truth:
   state.profile.about, saved and shared like the rest of the profile). */
const BIO_MAX = 500;

   // About Me
const bioCount = (n) => `${Number(n).toLocaleString("en-GB")} / ${BIO_MAX.toLocaleString("en-GB")}`;


const prefersReducedMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };



/* ---- The public profile: what a visitor sees after opening someone from
   Network (and "view as guest" on your own). Intro first, then cards in a
   hybrid layout. No editing controls. ----------------------------------- */
const PUB_KIND = { professions: "m", experience: "x", qualifications: "d", skills: "s", interests: "s", languages: "s", locations: "s" };


/* v17.18: the Profile Card's order (Skills, Interests, Locations, Languages), then Venues, Qualifications and the rest. */
const PUB_ORDER = ["professions", "media", "skills", "interests", "locations", "languages", "venues", "qualifications", "experience"].filter(venuesOn17);



function PubGrid({ catKey, def, items, shade, onOpen }) {
  const kind = PUB_KIND[catKey] || "other";
  return (
    <div className={`ff-pubgrid k-${kind}`} role="list" aria-label={def.label}>
      {withRanks(items).map(({ r, rank }) => (
        <div role="listitem" key={r.id}>
          <GenericAttributeCard record={r} def={def} themeKey={shade} rank={rank} editable={false} pub={PUB_KIND[catKey]} onClick={() => onOpen(r)} />
        </div>
      ))}
    </div>
  );
}



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

function PhotoStrip11({ items, onBad, open, onTap, atRef, fill, onClose, start }) {
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
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  let openH = w ? Math.round(Math.max(280, Math.min(w * 1.25, vh * 0.7))) : undefined;
  /* profile-photos: on an upright iPad the open photos stop where the card still shows down to just past its icon line */
  if (openH && w >= 700 && vh > (typeof window !== "undefined" ? window.innerWidth : 0)) {
    const box = boxRef.current, hero = box && box.closest(".ff-phero");
    const ov = hero ? parseFloat(getComputedStyle(hero).getPropertyValue("--ov")) || 0 : 0;
    const nav = document.querySelector(".ff-bottomnav");
    const navH = nav ? nav.getBoundingClientRect().height : 70;
    const top = box ? box.getBoundingClientRect().top + (window.scrollY || 0) : 83;
    openH = Math.round(Math.max(280, Math.min(openH, vh - Math.max(56, top) - 14 - ov - navH - 48)));
  }
  const style = open && !fill && openH ? { height: openH + "px" } : undefined;
  return (
    <section ref={boxRef} className={`ff-ps${open ? " open" : ""}${fill ? " fill" : ""}`} style={style} aria-label={`Photos, ${n}`}>
      <div className="ff-ps-track" ref={ref} onScroll={(e) => {
        const el = e.currentTarget;
        const k = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        atRef.current = k;
        if (k !== at) setAt(k);
      }}>
        {items.map((m, i) => (
          <button key={m.src.slice(-40) + i} type="button" className="ff-ps-slide" aria-label={open ? `Photo ${i + 1} of ${n}` : `Show photo ${i + 1} of ${n}`} aria-expanded={!!open} onClick={() => onTap(i)}>
            <img className="ff-ps-img" src={m.src} alt={open ? (m.name ? `Photo: ${m.name}` : `Photo ${i + 1}`) : ""} draggable={false} decoding="async" loading={i ? "lazy" : "eager"} onError={() => onBad && onBad(m.src)} />
          </button>
        ))}
      </div>
      {fill && onClose && <button type="button" className="ff-ps-x" aria-label="Back to all photos" onClick={onClose}><X size={18} /></button>}
      {n > 1 && (
        <>
          {open && <span className="ff-ps-n" aria-live="polite">{`${at + 1} / ${n}`}</span>}
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
  const list = media.filter(m => seen[m.src] === true);
  const onBad = (src) => setSeen(v => (v[src] === false ? v : { ...v, [src]: false }));
  const has = list.length > 0;
  const [open, setOpen] = useState(false);
  const atRef = useRef(0);
  const colRef = useRef(null), heroRef = useRef(null), cardRef = useRef(null);
  const strip = has && !wide;
  useEffect(() => { setOpen(false); }, [wide]);
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
  /* profile-photos: the photos end exactly on the card's icon line, and the page scrolls as one from there
     (no sticky photos): --ov is the distance from the card's top to the middle of that line. */
  const [ov, setOv] = useState(false);
  useLayoutEffect(() => {
    const c = cardRef.current, h = heroRef.current;
    if (!strip || !c || !h) { setOv(false); return; }
    const f = () => {
      const line = c.querySelector(".ff-pc-rule"), t = c.getBoundingClientRect();
      if (!t.height) return;
      /* A Company Card has no icon line: the photos end 128px down it (where they always met the card). */
      const r = line && line.getBoundingClientRect();
      const y = r && r.height ? r.top + r.height / 2 - t.top : Math.min(128, t.height * 0.6);
      h.style.setProperty("--ov", Math.round(y) + "px");
      setOv(true);
    };
    f();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(f) : null;
    if (ro) ro.observe(c);
    window.addEventListener("resize", f);
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", f); };
  }, [strip]);
  /* Phone: pull the card down to open the strip, push up to close; the wheel does the same on a narrow desktop window. */
  useEffect(() => {
    const zone = colRef.current, hero = heroRef.current;
    if (!strip || !zone || !hero) return;
    const atTop = () => (ffPvScroller11(zone).scrollTop || 0) <= 2;
    const setPull = (v) => hero.style.setProperty("--pull", v + "px");
    let a = null, mode = null, d = 0, moved = 0;
    const ts = (e) => {
      if (e.touches.length !== 1) { a = null; return; }
      const t = e.target;
      if (!open && !(t && zone.contains(t))) { a = null; return; }
      a = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      mode = null;
      d = 0;
      moved = 0;
    };
    const tm = (e) => {
      if (!a) return;
      const dx = e.touches[0].clientX - a.x, dy = e.touches[0].clientY - a.y;
      if (!mode) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        if (Math.abs(dx) > Math.abs(dy)) { a = null; return; }
        if (!open && dy > 0 && atTop()) mode = "open";
        /* profile-photos: while the photos are open, a scroll anywhere, either way, brings the card back up */
        else if (open) mode = "close";
        else { a = null; return; }
        hero.classList.add("dragging");
      }
      if (e.cancelable) e.preventDefault();
      d = mode === "open" ? Math.max(0, Math.min(170, dy)) : Math.max(-170, Math.min(0, dy));
      if (mode === "close") moved = Math.max(moved, Math.abs(dy));
      setPull(d);
    };
    const te = () => {
      if (mode) {
        const go = mode === "close" ? moved > 12 : Math.abs(d) > 45;
        hero.classList.remove("dragging");
        setPull(0);
        if (go) setOpen(mode === "open");
      }
      a = null;
      mode = null;
      d = 0;
    };
    let wt = 0;
    const wh = (e) => {
      const now = Date.now();
      if (now < wt) return;
      if (open && Math.abs(e.deltaY) > 4) { if (e.cancelable) e.preventDefault(); wt = now + 500; setOpen(false); }
      else if (!open && e.deltaY < -12 && atTop() && hero.contains(e.target)) { wt = now + 500; setOpen(true); }
    };
    /* any other scroll (keys, scroll bar, a fling already under way) also closes the open photos */
    const sc = ffPvScroller11(zone);
    const sTarget = sc === document.scrollingElement || sc === document.documentElement ? window : sc;
    const pos = () => (sTarget === window ? window.scrollY : sc.scrollTop) || 0;
    let base = pos(), armed = !open;
    const arm = open ? setTimeout(() => { base = pos(); armed = true; }, 450) : 0;
    const onScroll = () => { if (open && armed && Math.abs(pos() - base) > 8) { armed = false; setOpen(false); } };
    const pa = { passive: true }, np = { passive: false };
    sTarget.addEventListener("scroll", onScroll, pa);
    document.addEventListener("touchstart", ts, pa);
    document.addEventListener("touchmove", tm, np);
    document.addEventListener("touchend", te, pa);
    document.addEventListener("touchcancel", te, pa);
    window.addEventListener("wheel", wh, np);
    return () => {
      document.removeEventListener("touchstart", ts, pa);
      document.removeEventListener("touchmove", tm, np);
      document.removeEventListener("touchend", te, pa);
      document.removeEventListener("touchcancel", te, pa);
      window.removeEventListener("wheel", wh, np);
      sTarget.removeEventListener("scroll", onScroll, pa);
      clearTimeout(arm);
      hero.classList.remove("dragging");
      setPull(0);
    };
  }, [strip, open]);
  /* profile-photos: opening while scrolled down brings the photos into view first */
  useEffect(() => {
    if (!open || !strip) return;
    const h = heroRef.current;
    if (!h) return;
    const top = h.getBoundingClientRect().top;
    /* back to the very top when the photos start the page, as when it opens */
    if (top < 0) { const abs = top + window.scrollY; window.scrollTo({ top: abs <= 160 ? 0 : abs - 64, behavior: "auto" }); }
  }, [open]);
  /* A tap on the card (not on one of its buttons or links) opens the strip. */
  const cardTap = (e) => {
    if (!strip || open) return;
    const t = e.target;
    if (t && t.closest && t.closest('button,a,input,textarea,select,label,summary,[contenteditable="true"],[role="button"],[role="link"]')) return;
    setOpen(true);
  };
  const media2 = !has ? null
    : wide ? <DeskGallery11 items={list} onBad={onBad} />
    : <PhotoStrip11 items={list} onBad={onBad} open={open} atRef={atRef} onTap={() => { if (!open) setOpen(true); }} />;
  return (
    <div ref={heroRef} className={`ff-phero${has ? " has-media" : ""}${wide ? " wide" : ""}${strip && open ? " ps-open" : ""}${strip && ov ? " ov" : ""}`}>
      {media2}
      <div className="ff-pcol" ref={colRef}>
        {strip && <button type="button" className="ff-ph-grip" aria-label={open ? "Cover the photos" : "Show the photos"} aria-expanded={open} onClick={() => setOpen(!open)}><span aria-hidden="true" /></button>}
        <div ref={cardRef} className={"ff-ph-card" + (strip && !open ? " tap" : "")} onClick={cardTap}>{card}</div>
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
          <article key={r.id} className="ff-xatt-box">
            <h3>{r.name}</h3>
            {r.category === "venues" && r.address && <div className="ff-xatt-note">{r.address}{r.place ? <> · <a href={venueMapsUrl17(r)} target="_blank" rel="noopener noreferrer">View on Google Maps</a></> : null}</div>}
            {String(r.description || "").trim() && <p>{r.description}</p>}
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



function AttrGroups({ items, mem, onOpen }) {
  const groups = [];
  items.forEach(it => {
    let g = groups.find(x => x.key === it.category);
    if (!g) groups.push(g = { key: it.category, def: it.def, ord: it.at, list: [] });
    g.ord = Math.min(g.ord, it.at); g.list.push(it);
  });
  groups.sort((a, b) => a.ord - b.ord);
  groups.forEach(g => g.list.sort((a, b) => a.at - b.at));
  /* v17.18: a summary card lists five entries at most; with more, a second card of the same category follows with the next five, and so on.
     Work locations are the exception: the areas as they were ticked, three on the card and "+N" for the rest. */
  const cards = [];
  groups.forEach(g => {
    if (g.key === "locations") { cards.push({ g, key: g.key, part: g.list.slice(0, 3), more: Math.max(0, g.list.length - 3) }); return; }
    for (let i = 0; i < g.list.length; i += 5) cards.push({ g, key: `${g.key}-${i}`, part: g.list.slice(i, i + 5), more: 0 });
  });
  return (
    <MemScroll mem={mem} k="overview" label={`Attributes, ${cards.length} card${cards.length === 1 ? "" : "s"}`} className="ff-acar">
      {cards.map((c, ci) => {
        const label = (c.g.def && c.g.def.label) || c.g.key;
        if (c.g.key === "qualifications") return <PubQualCard key={c.key} label={label} part={c.part} more={c.more} total={c.part.length + c.more} cls={tierCls17(ci)} onOpen={() => onOpen(c.g.key)} />;
        return (
          <button key={c.key} type="button" className={"ff-agrp " + tierCls17(ci)} onClick={() => onOpen(c.g.key)}
            aria-label={`${label}: ${c.g.list.map(it => it.record.name).join(", ")}. View all attributes`}>
            <span className="ff-agrp-top"><span className="ff-agrp-h">{label}</span><span className="ff-agrp-n">{c.part.length + c.more}</span></span>
            <span className="ff-agrp-l">{c.part.map(it => <span key={it.id}>{it.category === "qualifications" ? <QualNm r={it.record} /> : nbh21(it.record.name)}</span>)}</span>
            {c.more > 0 && <span className="ff-agrp-more">{`+${c.more}`}</span>}
          </button>
        );
      })}
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
