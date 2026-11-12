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


const PUB_ORDER = ["professions", "media", "qualifications", "skills", "experience", "locations", "languages", "interests"];



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
  const order = [...PUB_ORDER, ...Object.keys(recs).filter(k => !PUB_ORDER.includes(k))];
  const onCards = order.flatMap(k => (recs[k] || []).filter(r => !r.hidden && !r.proposed).flatMap(r => r.media || []));
  const seen = new Set();
  return [...own, ...onCards]
    .map(m => ({ id: m && m.id, src: m && (m.dataUrl || m.src), name: (m && m.name) || "" }))
    .filter(m => m.src && !seen.has(m.src) && seen.add(m.src));
}



function useWide(min = 900) {
  const q = `(min-width:${min}px)`;
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


function MediaCarousel({ items, onBad, start = 0, flat = false, pull = false }) {
  const [open, setOpen] = useState(false);
  const [at, setAt] = useState(start);
  const ref = useRef(null);
  useDragScroll(ref);
  useEffect(() => {
    if (!pull || flat)
      return;
    const hero = ref.current && ref.current.closest(".ff-phero");
    if (!hero)
      return;
    const scroller = () => {
      let n = hero.parentElement;
      while (n && n !== document.body) {
        const o = getComputedStyle(n).overflowY;
        if ((o === "auto" || o === "scroll") && n.scrollHeight > n.clientHeight)
          return n;
        n = n.parentElement;
      }
      return document.scrollingElement || document.documentElement;
    };
    const atTop = () => (scroller().scrollTop || 0) <= 2;
    const TRAVEL = 142;
    const setPull = (v) => hero.style.setProperty("--pull", v + "px");
    let x0 = null, y0 = null, mode = null, was = false, d = 0;
    const ts = (e) => {
      if (e.touches.length !== 1) {
        y0 = null;
        return;
      }
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
      mode = null;
      d = 0;
      was = !!(ref.current && ref.current.classList.contains("open"));
    };
    const tm = (e) => {
      if (y0 == null)
        return;
      const dx = e.touches[0].clientX - x0, dy = e.touches[0].clientY - y0;
      if (!mode) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6)
          return;
        if (Math.abs(dx) > Math.abs(dy) || !atTop()) {
          y0 = null;
          return;
        }
        if (!was && dy > 0)
          mode = "open";
        else if (was && dy < 0)
          mode = "close";
        else {
          y0 = null;
          return;
        }
        hero.classList.add("dragging");
      }
      if (e.cancelable)
        e.preventDefault();
      d = mode === "open" ? Math.max(0, Math.min(TRAVEL, dy)) : Math.max(-TRAVEL, Math.min(0, dy));
      setPull(d);
    };
    const te = () => {
      if (mode) {
        const go = Math.abs(d) > TRAVEL * 0.3;
        const next = go ? mode === "open" : was;
        if (ref.current)
          ref.current.classList.toggle("open", next);
        hero.classList.remove("dragging");
        setPull(0);
        setOpen(next);
      }
      y0 = null;
      mode = null;
      d = 0;
    };
    const wh = (e) => {
      if (e.deltaY < -12 && atTop())
        setOpen(true);
      else if (e.deltaY > 12)
        setOpen(false);
    };
    const sc = () => {
      if (!atTop() && !hero.classList.contains("dragging"))
        setOpen(false);
    };
    const { documentElement: root, body } = document;
    const prev = [root.style.overscrollBehaviorY, body.style.overscrollBehaviorY];
    root.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    const pa = { passive: true }, np = { passive: false }, cap = { passive: true, capture: true };
    hero.addEventListener("touchstart", ts, pa);
    hero.addEventListener("touchmove", tm, np);
    hero.addEventListener("touchend", te, pa);
    hero.addEventListener("touchcancel", te, pa);
    window.addEventListener("wheel", wh, pa);
    window.addEventListener("scroll", sc, cap);
    return () => {
      hero.removeEventListener("touchstart", ts, pa);
      hero.removeEventListener("touchmove", tm, np);
      hero.removeEventListener("touchend", te, pa);
      hero.removeEventListener("touchcancel", te, pa);
      window.removeEventListener("wheel", wh, pa);
      window.removeEventListener("scroll", sc, cap);
      root.style.overscrollBehaviorY = prev[0];
      body.style.overscrollBehaviorY = prev[1];
    };
  }, [pull, flat]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && start)
      el.scrollLeft = start * el.clientWidth;
  }, []);
  const list = items;
  if (!list.length)
    return null;
  const go = (i) => {
    const el = ref.current;
    if (!el)
      return;
    const k = Math.max(0, Math.min(list.length - 1, i));
    el.scrollTo({ left: k * el.clientWidth, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };
  return React.createElement("section", {
    className: `ff-pm${open ? " open" : ""}${flat ? " flat" : ""}`,
    "aria-roledescription": "carousel",
    "aria-label": "Media"
  }, React.createElement("div", {
    className: "ff-pm-track",
    ref,
    tabIndex: 0,
    "aria-label": `Media, ${list.length} item${list.length === 1 ? "" : "s"}. Use the left and right arrow keys.`,
    onScroll: (e) => {
      const el = e.currentTarget;
      setAt(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
    },
    onKeyDown: (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(at + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(at - 1);
      }
    }
  }, list.map((m, i) => React.createElement("div", {
    key: m.src.slice(-40) + i,
    className: "ff-pm-slide",
    role: "group",
    "aria-roledescription": "slide",
    "aria-label": `${i + 1} of ${list.length}`
  }, React.createElement("img", { decoding: "async",
    src: m.src,
    alt: m.name ? `Media: ${m.name}` : `Media ${i + 1}`,
    draggable: false,
    loading: i ? "lazy" : "eager",
    onError: () => onBad && onBad(m.src)
  })))), React.createElement("span", {
    className: "ff-pm-shade",
    "aria-hidden": "true"
  }), list.length > 1 && React.createElement(React.Fragment, null, React.createElement("button", {
    type: "button",
    className: "ff-pm-arrow l",
    "aria-label": "Previous media",
    disabled: at === 0,
    onClick: () => go(at - 1)
  }, React.createElement(ChevronLeft, {
    size: 18
  })), React.createElement("button", {
    type: "button",
    className: "ff-pm-arrow r",
    "aria-label": "Next media",
    disabled: at >= list.length - 1,
    onClick: () => go(at + 1)
  }, React.createElement(ChevronRight, {
    size: 18
  })), React.createElement("div", {
    className: "ff-pm-dots"
  }, list.map((m, i) => React.createElement("button", {
    key: i,
    type: "button",
    className: i === at ? "on" : "",
    "aria-label": `Show media ${i + 1} of ${list.length}`,
    "aria-current": i === at,
    onClick: () => go(i)
  })))));
}



/* Desktop: every picture at once, filling the space beside the card. */
function MediaMosaic({ items, onBad }) {
  const [view, setView] = useState(null);
  const show = items.slice(0, 5), more = items.length - show.length;
  return (
    <section className={`ff-pmos n${show.length}`} aria-label={`Media, ${items.length} picture${items.length === 1 ? "" : "s"}`}>
      {show.map((m, i) => (
        <button key={m.src.slice(-40) + i} type="button" className="ff-pmos-t" aria-label={`Open picture ${i + 1} of ${items.length}`} onClick={() => setView(i)}>
          <img decoding="async" src={m.src} alt="" draggable={false} loading={i ? "lazy" : "eager"} onError={() => onBad && onBad(m.src)} />
          {i === show.length - 1 && more > 0 && <span className="more" aria-hidden="true">+{more}</span>}
        </button>
      ))}
      <Sheet open={view !== null} onClose={() => setView(null)} title="Media">
        {view !== null && <MediaCarousel items={items} start={view} flat />}
      </Sheet>
    </section>
  );
}



/* The top of a visitor's page: the pictures, then the Profile Card, then
   Back and the actions. Phone: pictures stay in place and the card slides over
   them. Desktop: card on the left, pictures taking the rest. */
function PublicHero({ media, card, below, narrow }) {
  const wide = useWide();
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
  return (
    <div className={`ff-phero${has ? " has-media" : ""}${wide ? " wide" : ""}`}>
      {has && (wide && list.length <= 4 ? <MediaMosaic items={list} onBad={onBad} /> : <MediaCarousel items={list} onBad={onBad} pull={!wide} />)}
      <div className="ff-pcol">
        <div className="ff-ph-card">{card}</div>
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
  return (<><ProfileFFAI /><CVPanel /><CreatorMedia /><CreatorAboutMe /></>);
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
function CoverFlow({ items, label, mem, k, half = 150, onOpen, render }) {
  const ref = useRef(null);
  const raf = useRef(0);
  const [idx, setIdx] = useState(Math.min(mem.current[k] || 0, Math.max(0, items.length - 1)));
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
    return { ...rec, subline: [dt(r.at), shift ? [shift.role, shift.venue].filter(Boolean).join(" · ") : ""].filter(Boolean).join(" · ") };
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
  const keys = [...PUB_ORDER.filter(k => order.includes(k)), ...order.filter(k => !PUB_ORDER.includes(k))];
  const flat = keys.flatMap((k, ki) => withRanks((recs[k] || []).filter(r => !r.hidden && !r.proposed)).map(({ r, rank }, i) => ({ id: `${k}:${r.id}`, record: r, def: cats[k], category: k, rank, score: completeness(r), at: ki * 1000 + i })));
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
            {String(r.description || "").trim() && <p>{r.description}</p>}
            {det.length > 0 && <dl>{det.map(([k, v]) => <div key={k}><dt>{cap(k)}</dt><dd>{String(v)}</dd></div>)}</dl>}
            {media.length > 0 && <div className="ff-xatt-media">{media.map((m, i) => <img decoding="async" key={i} src={m.dataUrl || m.src} alt={m.name || ""} loading="eager" />)}</div>}
            {r.document && r.document.name && <div className="ff-xatt-note">Document: {r.document.name}</div>}
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
  return (
    <MemScroll mem={mem} k="overview" label={`Attributes, ${groups.length} card${groups.length === 1 ? "" : "s"}`} className="ff-acar">
      {groups.map((g, gi) => {
        const show = g.list.slice(0, 9), more = g.list.length - show.length;
        const label = (g.def && g.def.label) || g.key;
        return (
          <button key={g.key} type="button" className={"ff-agrp " + ["t-gold", "t-silver", "t-bronze"][gi % 3]} onClick={() => onOpen(g.key)}
            aria-label={`${label}: ${g.list.map(it => it.record.name).join(", ")}. View all attributes`}>
            <span className="ff-agrp-top"><span className="ff-agrp-h">{label}</span><span className="ff-agrp-n">{g.list.length}</span></span>
            <span className="ff-agrp-l">{show.map(it => <span key={it.id}>{it.record.name}</span>)}</span>
            {more > 0 && <span className="ff-agrp-more">+{more} more</span>}
          </button>
        );
      })}
    </MemScroll>
  );
}



function AboutMeBlock({ text }) {
  const [more, setMore] = useState(false);
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  useLayoutEffect(() => { const el = ref.current; if (el) setOver(more || el.scrollHeight > el.clientHeight + 2); }, [text, more]);
  if (!String(text || "").trim()) return null;
  return (
    <section className="ff-about" aria-labelledby="ff-about-h">
      <h2 id="ff-about-h" className="ff-about-h">About Me</h2>
      <p ref={ref} id="ff-about-text" className={more ? "" : "clamp"}>{text}</p>
      {(over || more) && <button type="button" className="ff-pub-more" aria-expanded={more} aria-controls="ff-about-text" onClick={() => setMore(!more)}>{more ? "Read less" : "Read more"}</button>}
    </section>
  );
}
