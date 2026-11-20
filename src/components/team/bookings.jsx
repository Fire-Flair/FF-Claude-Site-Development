/* src/components/team/bookings.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* BOOKINGS (FF Team) — one page, three sections: booked shifts, FF Party
   service cards (coming in 2027), availability cards. Replies happen here. */
/* ==========================================================================
   BOOKINGS — full-size poster cards. One PosterCard frame for every kind
   (booking, FF Party service); the tone sets the surface and metal.
   ========================================================================== */
const POSTER_TONES = {
  dark:   { cls: "dark",   accent: "#D9B552", ribbon: "Booking Card" },
  ivory:  { cls: "ivory",  accent: "#9A7322" },
  bronze: { cls: "dark metal", accent: "#D49A62", edge: "bronze" },
  silver: { cls: "dark metal", accent: "#D6DAE0", edge: "silver" },
  gold:   { cls: "dark metal", accent: "#E8C75E", edge: "gold" },
  white:  { cls: "ivory white", accent: "#9A7322" },
};


function PosterCard({ tone = "dark", ribbon, eyebrow, title, subtitle, tagline, rows = [], footer, onClick }) {
  const t = POSTER_TONES[tone] || POSTER_TONES.dark;
  return (
    <article className={`ff-poster ${t.cls}`} style={{ "--pc-accent": t.accent, ...(t.edge ? { "--pc-edge": metalEdge(t.edge) } : {}) }}>
      <div className="ff-poster-ribbon"><Sparkles size={11} /> {ribbon}</div>
      <span className="ff-poster-coin"><FFLogo size={44} tier={t.edge || "gold"} /></span>
      <div className="ff-poster-head">
        {eyebrow && <div className="ff-poster-eyebrow">✦ {eyebrow} ✦</div>}
        <h3 className="ff-poster-title">{title}</h3>
        {subtitle && <div className="ff-poster-sub">{subtitle}</div>}
        {tagline && <p className="ff-poster-tag">{tagline}</p>}
      </div>
      <div className="ff-poster-rows">
        {rows.filter(Boolean).map((r, i) => (
          <div key={i} className="ff-poster-row">
            <span className="ff-poster-medal">{r.icon}</span>
            <span style={{ minWidth: 0 }}>
              <span className="ff-poster-label">{r.label}</span>
              <span className="ff-poster-value">{r.value}</span>
              {r.sub && <span className="ff-poster-small">{r.sub}</span>}
            </span>
          </div>
        ))}
      </div>
      {footer && <div className="ff-poster-foot">{footer}</div>}
      {onClick && <button type="button" className="ff-poster-hit" onClick={onClick} aria-label={`Open ${title}`} />}
    </article>
  );
}


const PAST_STATES = ["completed", "signed_off", "paid"];


/* Peak dates: the busiest nights of the year. Saying yes puts the person
   first in line for shifts on the dates they pick. */
const isoDays = (from, to) => { const out = []; for (let d = new Date(from + "T12:00:00"); d <= new Date(to + "T12:00:00"); d.setDate(d.getDate() + 1)) out.push(d.toISOString().slice(0, 10)); return out; };


const PEAK_DATES = [
  { key: "halloween", icon: "🎃", q: "Are you available for Halloween bookings?", dates: isoDays("2026-10-29", "2026-11-01") },
  { key: "christmas", icon: "🎄", q: "Are you available for Christmas bookings?", dates: isoDays("2026-12-01", "2026-12-24"), grid: true },
  { key: "nye", icon: "🥂", q: "Are you available on New Year's Eve?", dates: ["2026-12-31", "2027-01-01"] },
];


const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const chipDate = (iso) => { const d = new Date(iso + "T12:00:00"); return { wd: WEEKDAY[d.getDay()], day: d.getDate(), mon: MONTHS[d.getMonth()].slice(0, 3) }; };


function PeakAvailability() {
  const { state, dispatch } = useStore();
  const peak = state.profile.peak || {};
  const set = (key, patch) => dispatch({ type: "PROFILE", patch: { peak: { ...peak, [key]: { ...(peak[key] || {}), ...patch } } } });
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {PEAK_DATES.map(pk => {
        const cur = peak[pk.key] || {};
        const picked = cur.dates || [];
        const toggle = (iso) => set(pk.key, { dates: picked.includes(iso) ? picked.filter(x => x !== iso) : [...picked, iso].sort() });
        return (
          <div key={pk.key} className="ff-panel">
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 24 }} aria-hidden="true">{pk.icon}</span>
              <span style={{ flex: 1, minWidth: 200, fontWeight: 700, fontSize: 15.5, color: "#16130F" }}>{pk.q}</span>
              <span className="ff-seg" role="group" aria-label={pk.q}>
                <button type="button" aria-pressed={cur.answer === "yes"} onClick={() => set(pk.key, { answer: "yes", dates: picked.length ? picked : pk.dates.slice() })}>Yes</button>
                <button type="button" aria-pressed={cur.answer === "no"} onClick={() => set(pk.key, { answer: "no", dates: [] })}>No</button>
              </span>
            </div>
            {cur.answer === "yes" && (<>
              <p className="ff-body" style={{ margin: "12px 0 8px", fontSize: 13 }}>Tap the dates you're free — {picked.length} selected.</p>
              <div className={pk.grid ? "ff-dategrid" : ""} style={pk.grid ? undefined : { display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pk.dates.map(iso => { const c = chipDate(iso); const on = picked.includes(iso); return (
                  <button key={iso} type="button" className={`ff-datechip${on ? " on" : ""}`} aria-pressed={on} onClick={() => toggle(iso)}>
                    <small>{c.wd}</small><b>{c.day}</b><small>{c.mon}</small>
                  </button>
                ); })}
              </div>
            </>)}
            {cur.answer === "yes" && picked.length > 0 && (
              <p className="ff-body" style={{ margin: "10px 0 0", fontSize: 12.5, color: "#5C1220", fontWeight: 600 }}><Star size={12} fill="currentColor" /> You're on the priority list for these dates.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}


/* WhatsApp mark (lucide has no brand icons). */
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}




/* The three interest drop-downs on the Bookings page. Each is a card: the photo is the top half with only the title on it;
   the icon, the description and the chevron sit below on the solid card. On wide screens the three cards share one row
   (.ff-bkd-row) and an opened card's contents span the full width underneath (the box then carries its own title). */
const BKD_CSS = __ff_css("styles/bkd.css");


/* open / onOpen come from TeamBookings so only one of the three boxes is open at a time (onOpen(null) closes). */
function BkDrop17({ id, title, desc, icon: Icon, photo, children, open: openP, onOpen, headOnly }) {
  const [openS, setOpenS] = useState(false);
  const open = onOpen ? !!openP : openS;
  const setOpen = onOpen ? (f) => onOpen((typeof f === "function" ? f(open) : f) ? id : null) : setOpenS;
  useEffect(() => {
    const h = (e) => {
      if (e.detail === id) setOpen(true);
    };
    window.addEventListener("ff-opendrop", h);
    return () => window.removeEventListener("ff-opendrop", h);
  }, [id, onOpen]);
  const src = (window.FF_IMG || {})[photo] || "";
  return (
    <section className={`ff-bkd${open ? " open" : ""}`}>
      <button type="button" className="bkd-hd" id={id} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className={`bkd-ph${src ? "" : " none"}`}>
          {src ? <img decoding="async" src={src} style={fp17(photo)} alt="" loading="lazy" /> : null}
          <b>{title}</b>
        </span>
        <span className="bkd-tx">
          <span className="bkd-ic"><Icon size={16} /></span>
          <span className="bkd-ds">{desc}</span>
          <I11.ChevronDown size={18} className="bkd-chev" />
        </span>
      </button>
      {open && !headOnly && <div className="bkd-bd"><h3 className="bkd-bt">{title}</h3><p className="bkd-bds">{desc}</p>{children}</div>}
    </section>
  );
}



/* bkpop (v1.57, Alex 18 Nov 20:51): the package pop-ups (Event brief and invoice, package terms) render at the app
   root, not inside the package slider. On iPad Safari a fixed pop-up inside the slider's scroll box was clipped to the
   slider, so it sat under the tab row with the page and the Confirm bar showing through. While a pop-up is open the
   page behind it does not scroll: touch moves outside the pop-up are held, and the page keeps its scroll position. */
let PKPOP_N17 = 0;
let PKPOP_PREV17 = null;
const pkPopHold17 = (e) => { const t = e.target; if (!(t && t.closest && t.closest(".ff-sheet"))) e.preventDefault(); };
function usePkPopLock17() {
  React.useLayoutEffect(() => {
    const h = document.documentElement, b = document.body;
    if (PKPOP_N17++ === 0) {
      PKPOP_PREV17 = [h.style.overflow, b.style.overflow, h.style.scrollbarGutter];
      if (window.innerWidth - h.clientWidth > 0) h.style.scrollbarGutter = "stable";
      h.style.overflow = "hidden"; b.style.overflow = "hidden";
      document.addEventListener("touchmove", pkPopHold17, { passive: false });
    }
    return () => {
      if (--PKPOP_N17 > 0) return;
      const pv = PKPOP_PREV17 || ["", "", ""];
      h.style.overflow = pv[0]; b.style.overflow = pv[1]; h.style.scrollbarGutter = pv[2];
      document.removeEventListener("touchmove", pkPopHold17, { passive: false });
    };
  }, []);
}
function PkPop17({ children }) {
  usePkPopLock17();
  const host = document.querySelector("#root > .ff") || document.querySelector(".ff") || document.body;
  return ReactDOM.createPortal(children, host);
}

/* FF Party package terms, shown after signing in, before packages are saved. */
function PkgTerms17({ onClose, onAccept }) {
  return (
    <PkPop17><Sheet open onClose={onClose} title="FF Party package terms">
      <div className="ff-tc5 ff-bkterms17">
        {PARTY_PKG_TERMS17.map((t, i) => <div key={t.k} className="ff-tc5-read"><span><b>{i + 1}</b>{t.label}</span><p>{t.text}</p></div>)}
      </div>
      <div className="ff-bsec-acts" style={{ marginTop: 10 }}><Btn variant="primary wide" onClick={onAccept}><Check size={14} /> Accept and confirm</Btn></div>
    </Sheet></PkPop17>
  );
}


/* bk5 (Mr G 03:03): FF Staff redesigned. Choose your professions (signed in: only your own, all chosen; a type box adds
   another), then Your preferred hourly rate for each chosen profession, typed by the member (no default value), then Save.
   No terms step. Signed out: same layout, Save opens sign-in. Rates stay the typed Q&A answer rate.<profession id>
   (pence, visibility "ff-staff"); a profession taken off the list has its saved rate withdrawn on Save. */
/* v1.46 bookings (Alex, 18 Nov 20:06): signed out, FF Staff shifts show what a member does here in three steps, with no
   example professions and no confirm step. Get started opens sign-in; once signed in ProfRates17 shows their own
   professions. "Preferred terms" is a placeholder step for now: the terms screen is still to be built (developers). */
const FS_STEPS17 = [[lucideIcon("Briefcase"), "Choose your profession"], [lucideIcon("PoundSterling"), "Set your preferred rates"], [lucideIcon("FileText"), "Set your preferred terms"]];
function FsSteps17() {
  return (
    <div className="ff-fs6">
      <ol className="ff-fs6-steps">
        {FS_STEPS17.map(([Ic, t], i) => (
          <li key={t}>
            <span className="n" aria-hidden="true">{i + 1}</span>
            <span className="ic" aria-hidden="true"><Ic size={20} strokeWidth={1.7} /></span>
            <span className="t">{t}</span>
          </li>
        ))}
      </ol>
      <button type="button" className="ff-btn primary wide ff-bkconfirm17" onClick={() => window.dispatchEvent(new Event("ff-login"))}>Get started</button>
    </div>
  );
}

function ProfRates17({ guest }) {
  const { state, dispatch } = useStore();
  const account = guest ? null : qaAccount17(state);
  const mine = guest ? [] : recsOf(state.profile, "professions").filter(r => !r.proposed && !r.hidden).map(r => r.name);
  const rated = account ? ALL_PROFESSIONS.map(p => p.name).filter(n => prefRateP17(state, account, n) != null) : [];
  /* v1.140 (Alex 20 Nov 02:46): the profession boxes from the profile, then a rate for each profession chosen, then Save. */
  const [chosen, setChosen] = useState(() => [...new Set([...mine, ...rated])]);
  const [cats, setCats] = useState({});
  const [vals, setVals] = useState({});
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const has = (n) => chosen.some(x => x.toLowerCase() === String(n).toLowerCase());
  const catOf = (n) => professionCategory(n, cats[n]) || "Other";
  const P = {
    mine: chosen.map(n => ({ id: n, name: n, displayCategory: cats[n] })),
    has,
    toggle: (n, category) => { if (has(n)) setChosen(c => c.filter(x => x.toLowerCase() !== String(n).toLowerCase())); else { setChosen(c => [...c, n]); if (category) setCats(x => ({ ...x, [n]: category })); } },
    remove: (r) => setChosen(c => c.filter(x => x !== r.name)),
    catOf: (r) => catOf(r.name),
    ownIn: (key) => chosen.filter(n => !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n.toLowerCase()) && catOf(n) === key).map(n => ({ id: n, name: n })),
    dispatch: (a) => { if (a && a.type === "REC_PATCH" && a.patch && a.patch.displayCategory) setCats(x => ({ ...x, [a.id]: a.patch.displayCategory })); },
  };
  const savedOf = (n) => account ? prefRateP17(state, account, n) : null;
  const onVal = (n, v) => { setVals(x => ({ ...x, [n]: v })); setErrs(x => ({ ...x, [n]: "" })); };
  const save = async () => {
    if (busy) return;
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    const bad = {};
    chosen.forEach(n => { const t = String(vals[n] != null ? vals[n] : "").trim(); if (t && (!isFinite(Number(t)) || Number(t) <= 0 || !/^\d+(\.\d{1,2})?$/.test(t))) bad[n] = "Enter an amount in pounds, like 18 or 18.50."; });
    if (Object.keys(bad).length) { setErrs(bad); return; }
    setBusy(true);
    let okAll = true;
    const all = [...new Set([...chosen, ...rated])];
    for (const n of all) {
      const saved = savedOf(n);
      const t = has(n) ? String(vals[n] != null ? vals[n] : (saved != null ? saved / 100 : "")).trim() : "";
      if (!t) {
        if (saved != null) { const r2 = await qaWithdraw17(dispatch, { account, questionId: qaRateQid17(n) }); if (!r2.ok) okAll = false; }
        continue;
      }
      const pence = Math.round(Number(t) * 100);
      if (pence === saved) continue;
      const r = await qaSubmit17(dispatch, { questionId: qaRateQid17(n), account, typed: { kind: "rate_gbp_hour", pence, profession: n }, visibility: "ff-staff", source: "FF Team Bookings · FF Staff Shifts" });
      if (!r.ok) { okAll = false; setErrs(x => ({ ...x, [n]: "That couldn't be saved." })); }
    }
    setBusy(false);
    if (okAll) { setVals({}); dispatch({ type: "TOAST", toast: "Your rates are saved" }); }
  };
  return (
    <div className="ff-fs5">
      <style>{PE2_CSS}</style>
      <PE2ProfCats P={P} noType />
      {chosen.length > 0 && (
        <div className="ff-fs5-rates">
          {chosen.map(n => {
            const saved = savedOf(n);
            const v = vals[n] != null ? vals[n] : saved != null ? String(saved / 100) : "";
            return (
              <label key={n} className="ff-fs5-rate">
                <span className="nm">{n}</span>
                <span className="rt">
                  <span className="pr">Preferred rate</span>
                  <span aria-hidden="true">£</span>
                  <input type="text" inputMode="decimal" value={v} aria-label={`Your preferred hourly rate as ${n}, pounds per hour`}
                    onChange={(e) => onVal(n, e.target.value.replace(/[^\d.]/g, "").slice(0, 7))} />
                  <span aria-hidden="true">/hour</span>
                </span>
                {errs[n] && <span className="er" role="alert">{errs[n]}</span>}
              </label>
            );
          })}
        </div>
      )}
      <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={busy} onClick={save}><Check size={15} /> Save</button>
    </div>
  );
}


/* A bar package on FF Team Bookings: the package card (Alex's option 3, pkgbuild). Written for the bartender who signs up:
   one design for every package (no tier colours), copy straight from the catalogue (PKG_BY17), Details closed by default,
   the burgundy footer carries "You earn" and FF Team's Sign up. A long word shrinks its line instead of splitting. */
/* Fixes2: a hyphenated word ("flair-performing") never breaks at its hyphen on a package card. */
function pkcNoBreak17(v) {
  if (typeof v !== "string" || !/\w-\w/.test(v)) return v;
  return v.split(/(\S*\w-\w\S*)/).map((t, i) => i % 2 ? <span key={i} style={{ whiteSpace: "nowrap" }}>{t}</span> : t);
}
/* pkc-tone (Alex, 18 Nov 18:12): every package card in the Bookings rail is as tall as the tallest one, measured with
   Details closed, so the footers line up. Opening Details grows only that card. */
let PKC_H17 = 0;
function usePkcEven17(key) {
  React.useLayoutEffect(() => {
    const box = document.getElementById("ff-bk-party"); if (!box) return;
    const even = () => {
      const cards = [...box.querySelectorAll(".ff-pkc")];
      cards.forEach(c => { c.style.minHeight = ""; });
      const shut = cards.filter(c => !c.querySelector("details[open]"));
      let h = Math.max(0, ...shut.map(c => c.getBoundingClientRect().height));
      /* Entertainment and Services cards take the Bar cards' height, so every tab's cards are one size and shape. */
      if (box.querySelector(".ff-pkc[data-pk17^='svc_']")) PKC_H17 = h; else h = Math.max(h, PKC_H17);
      if (h) cards.forEach(c => { c.style.minHeight = h + "px"; });
    };
    even();
    const tg = () => even(); box.addEventListener("toggle", tg, true);
    let ro = null; if (window.ResizeObserver) { ro = new ResizeObserver(() => requestAnimationFrame(even)); ro.observe(box); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(even).catch(() => {});
    return () => { box.removeEventListener("toggle", tg, true); if (ro) ro.disconnect(); };
  }, [key]);
}

/* pkc-team (Alex, 18 Nov 18:21): on FF Team every package is written to the bartender who signs up ("you", the
   professional; "the client", the host). FF Party keeps the client-facing catalogue wording in PKG_CAT17. The face
   carries no shopping list; it sits in the Event brief and invoice inside Details, with the five package terms. */
const PKC_TEAM17 = {
  svc_masterclass: {
    line: "Teach guests something extraordinary.",
    provide: "Your cocktail expertise, professional-grade equipment and the confidence to teach a group",
    ideal: "Hen and stag parties, team socials and celebrations",
    brief: "As an expert mixologist, you teach, demonstrate and guide guests as they create and personalise their own cocktails, using your professional-grade cocktail equipment.",
    points: ["Teach and demonstrate as the expert mixologist", "Guide guests to create and personalise their own cocktails", "Make bespoke and off-menu drinks when guests ask"],
    shop: "You give the client a shopping list for their menu, and the client buys everything on it.",
    cond: "One professional: you. Ingredients and glassware are agreed with the client and are not part of the package. The number of cocktails depends on the group." },
  svc_flair: {
    line: "Serve cocktails with your performance.",
    provide: "Cocktail service skills and a genuine flair performance",
    ideal: "Launches, weddings and parties that want a show",
    brief: "You prepare and serve the cocktails the client chooses, and perform flair for their guests while you serve.",
    points: ["Serve the client's chosen cocktails", "Perform flair for their guests", "Agree the length of your performance with the client"],
    shop: "You give the client a shopping list for their menu, and the client buys everything on it.",
    cond: "One professional: you. Ingredients, glassware and ice are agreed with the client and are not part of the package." },
  svc_mixology: {
    line: "Serve their favourite cocktails, expertly.",
    provide: "Cocktail skills and basic cocktail equipment",
    ideal: "Weddings, launches and celebrations",
    brief: "You prepare and serve the cocktails the client chooses for their menu, using your basic cocktail equipment.",
    points: ["Prepare the client's chosen cocktail menu", "Serve their guests with care and skill", "Bring and use your basic cocktail equipment"],
    shop: "You give the client a shopping list for their menu, and the client buys everything on it.",
    cond: "One professional: you. Ingredients, glassware and ice are agreed with the client and are not part of the package." },
  svc_bartending: {
    line: "Be the bartender they chose.",
    provide: "Professional service and basic bartending equipment",
    ideal: "House parties, birthdays and private events",
    brief: "The client chooses you as their bartender. You serve drinks at their event, using your basic bartending equipment.",
    points: ["Serve drinks professionally at the event", "Bring your basic bartending equipment", "Look after the client and their guests"],
    shop: "",
    cond: "One professional: you. Drinks, glassware and ice are agreed with the client and are not part of the package." },
  svc_staffing: {
    line: "Join the event as a skilled professional.",
    provide: "Hospitality skills and the confidence to work solo",
    ideal: "Business and private events, venues and festivals",
    brief: "You work solo as a hospitality professional and look after the client and their guests.",
    points: ["One professional per package: you", "Work solo and confidently", "Look after the client and their guests"],
    shop: "",
    cond: "Your role and hours are agreed and confirmed before the booking." },
};
/* The ribbon icon follows the tab: a cocktail glass for Bar, music for Entertainment, a concierge bell for Services. */
const BKH_CAL17 = lucideIcon("CalendarDays");
const PKC_ICO17 = { bar: lucideIcon("Martini"), ent: lucideIcon("Music"), svc: lucideIcon("ConciergeBell") };

/* The face's text never splits a word: a line that doesn't fit shrinks. */
function usePkcFitAll17(ref, key) {
  React.useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const fit = () => root.querySelectorAll(".fit").forEach(el => {
      if (!el.offsetParent) return;
      el.style.fontSize = ""; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 0.5 && fs > 9 && n++ < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; }
    });
    fit();
    const tg = () => fit(); root.addEventListener("toggle", tg, true);
    let ro = null; if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(root); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { root.removeEventListener("toggle", tg, true); if (ro) ro.disconnect(); };
  }, [key]);
}

/* pkc-tabs (Alex, 18 Nov 18:48): Entertainment and Services each list three FireFlair packages (made up for now, all to
   be confirmed) each at the same "You earn" amount Alex set. Bar keeps the catalogue amounts.
   Every tab ends with Create your own, the same card with every line a type box. */
const PKC_EXTRA17 = {
  ent: [
    { id: "ent_music", earn: "£250+", name: "Live Music Package", role: "Musician", duration: "2 hours",
      line: "Play live and set the mood.", provide: "Your live act, your instruments and your sound system", ideal: "Weddings, receptions and drinks parties",
      brief: "You perform live music at the client's event with your own instruments and sound system, and agree your set list with the client.",
      points: ["Perform live for the client and their guests", "Agree your set list with the client", "Bring and set up your own equipment"],
      cond: "One act: you, solo or with your band. Power and space for your setup are agreed with the client." },
    { id: "ent_dj", earn: "£250+", name: "DJ Package", role: "DJ", duration: "3 hours",
      line: "Play the night they'll remember.", provide: "Your DJ equipment, your music and the energy to fill a dance floor", ideal: "Birthdays, weddings and late-night parties",
      brief: "You DJ at the client's event with your own equipment, and agree the music and any must-play requests with the client.",
      points: ["DJ the event with your own equipment", "Agree the music and requests with the client", "Keep the dance floor going"],
      cond: "One professional: you. Power and space for your setup are agreed with the client." },
    { id: "ent_act", earn: "£150+", name: "Entertainer Package", role: "Entertainer", duration: "1 hour",
      line: "Bring a show of your own.", provide: "Your act: magic, caricatures or a performance of your own", ideal: "Family parties, corporate events and receptions",
      brief: "You entertain the client's guests with your own act, moving between groups or performing a set piece, as agreed with the client.",
      points: ["Perform your act for the client's guests", "Agree the format and timings with the client", "Bring everything your act needs"],
      cond: "One professional: you. Any space your act needs is agreed with the client." },
  ],
  svc: [
    /* v1.46 bookings (Alex, 18 Nov 20:06): Event Host first, at the amount Alex gave (written "+" like the other cards, so Sign up keeps its size); Photography stays second; "Event
       Services" is now "Event Management" (same id, svc_events, so saved sign-ups still match). */
    { id: "svc_host", earn: "£150+", name: "Event Host Package", role: "Event Host", duration: "3 hours",
      line: "Welcome every guest.", provide: "A warm welcome, confidence and a way with a crowd", ideal: "Corporate events, awards nights and parties",
      brief: "You welcome the client's guests, keep the event on time and make announcements, as agreed with the client.",
      points: ["Welcome guests as they arrive", "Keep the event on time", "Make the announcements"],
      cond: "One professional: you. The running order is agreed with the client before the event." },
    { id: "svc_photo", earn: "£250+", name: "Photography Package", role: "Photographer", duration: "3 hours",
      line: "Capture the moments they'll keep.", provide: "Your camera, your eye and your editing", ideal: "Weddings, birthdays and brand events",
      brief: "You photograph the client's event and deliver edited photos afterwards, as agreed with the client.",
      points: ["Photograph the event and its guests", "Edit your best shots", "Deliver the photos to the client"],
      cond: "One professional: you. The number of photos and the delivery date are agreed with the client." },
    { id: "svc_video", earn: "£250+", name: "Videography Package", role: "Videographer", duration: "3 hours",
      line: "Film the moments they'll rewatch.", provide: "Your camera, your eye and your editing", ideal: "Weddings, launches and brand events",
      brief: "You film the client's event and deliver an edited film afterwards, as agreed with the client.",
      points: ["Film the event and its guests", "Edit your best footage", "Deliver the film to the client"],
      cond: "One professional: you. The length of the film and the delivery date are agreed with the client." },
    { id: "svc_events", earn: "£250+", name: "Event Management Package", role: "Event Manager", duration: "From 4 hours",
      line: "Keep the whole event running smoothly.", provide: "Event experience, organisation and a calm head on the day", ideal: "Larger parties, launches and corporate events",
      brief: "You look after the running of the client's event on the day, from timings and suppliers to guests, so the client can enjoy it.",
      points: ["Run the event to the agreed plan", "Be the contact for suppliers on the day", "Look after the client and their guests"],
      cond: "One professional: you. The plan and your hours are agreed with the client before the event." },
  ],
};
const PKC_EXTRA_BY17 = Object.fromEntries([...PKC_EXTRA17.ent, ...PKC_EXTRA17.svc].map(x => [x.id, x]));
const PKC_TBC17 = "Entertainment and services packages are to be confirmed.";

/* One shape for every card and its Event brief and invoice. */
function pkcData17(sv, tab) {
  const x = PKC_EXTRA_BY17[sv.id];
  if (x) return { ...x, tab, site: "FF Party", tbc: true };
  const p = PKG_BY17[sv.id] || {}, t = PKC_TEAM17[sv.id] || {};
  return { id: sv.id, tab: sv.id === "svc_staffing" ? "svc" : "bar", site: sv.site || "FF Party", name: p.name || sv.title, role: p.role, duration: p.durationLabel,
    line: t.line || p.headline, provide: t.provide || p.capability || p.includes, ideal: t.ideal || p.ideal, brief: t.brief || p.description,
    shop: t.shop, points: t.points || [], cond: t.cond || p.conditions, earn: PAY17[sv.id] != null ? pkgPayLabel17(sv.id) : "" };
}

/* Create your own: every line is a type box; saved as one typed Q&A answer per tab. */
const pkcOwnQid17 = (tab) => `int.party_package_own_${tab}`;
["bar", "ent", "svc"].forEach(tab => { if (!QA_Q17[pkcOwnQid17(tab)]) QA_Q17[pkcOwnQid17(tab)] = { text: "Your own FF Party package", group: "interest" }; });
const pkcAmtOk17 = (v) => /^\d+(\.\d{1,2})?$/.test(String(v || "").trim()) && Number(v) > 0;
const pkcGBP17 = (v) => pkcAmtOk17(v) ? "£" + Number(v).toLocaleString("en-GB", { minimumFractionDigits: Number(v) % 1 ? 2 : 0, maximumFractionDigits: 2 }) : "";

/* The Details button opens the package's Event brief and invoice: laid out like the real document, with the client,
   event, package, what you earn and the five package terms. Event fields are filled in when a client books. */
function PkgDoc17({ d, onClose }) {
  const { state } = useStore();
  const me = (qaAccount17(state) && state.profile && state.profile.name) || "";
  const nil = (s) => <dd className="nil">{s}</dd>;
  const pk = [["Package", d.name], ["Your role", d.role], ["Duration", d.duration]].filter(r => r[1] || r[0] !== "Your role");
  const long = [["What you do", d.brief], ["Shopping list", d.shop]].filter(r => r[1]);
  return (
    <PkPop17><Sheet open onClose={onClose} title={d.name || "Your package"}>
      <article className="ff-doc17" aria-label="Event brief and invoice">
        <header className="lh">
          <span className="mk"><FFLogo size={40} tier="gold" /></span>
          <span className="co"><b>FireFlair Ltd</b><span>FFParty.uk</span></span>
          <span className="ti"><b>Event brief and invoice</b><span>No. issued when booked</span></span>
        </header>
        <div className="pt">
          <div><i>Client</i><b className="nil">Client name</b></div>
          <div><i>Professional</i>{me ? <b>{me}</b> : <b className="nil">Your name</b>}</div>
        </div>
        <section><h4>Event</h4><dl>{["Event", "Date", "Venue", "Arrive"].map(k => <div key={k}><dt>{k}</dt>{nil("Added when booked")}</div>)}</dl></section>
        <section><h4>Package</h4>
          <dl>{pk.map(([k, v]) => <div key={k}><dt>{k}</dt>{v ? <dd>{v}</dd> : nil("—")}</div>)}</dl>
          {long.map(([k, v]) => <div key={k} className="lg"><i>{k}</i><p>{pkcNoBreak17(v)}</p></div>)}
          {(d.points || []).length > 0 && <ul>{d.points.map(x => <li key={x}>{pkcNoBreak17(x)}</li>)}</ul>}
          {d.cond && <p className="cond">{pkcNoBreak17(d.cond)}</p>}
        </section>
        <div className="tot"><span>You earn</span>{d.earn ? <b>{d.earn}</b> : <b className="nil">Your amount</b>}</div>
        <section className="tc"><h4>Terms and conditions</h4>
          <ol>{PARTY_PKG_TERMS17.map((x, i) => <li key={x.k}><span><b>{i + 1}</b>{x.label}</span><p>{x.text}</p></li>)}</ol>
        </section>
        <footer>FireFlair Ltd · FFParty.uk</footer>
      </article>
    </Sheet></PkPop17>
  );
}

/* The card face shared by every package: ribbon with the tab's icon, title, line, the three rows, Details, footer. */
function PkgFace17({ d, rows, title, line, foot, refEl, cls = "", dataId }) {
  const [doc, setDoc] = useState(false);
  const Ico = PKC_ICO17[d.tab] || PKC_ICO17.bar;
  return (
    <div ref={refEl} className={`ff-pkc cmp${cls}`} data-pk17={dataId || d.id}>
      <span className="ff-pkc-rb"><Ico size={13} strokeWidth={1.8} /> {d.site || "FF Party"}</span>
      <span className="ff-pkc-logo"><FFLogo size={34} tier="gold" /></span>
      <div className="ff-pkc-hd">{title}{line}</div>
      <div className="ff-pkc-rows">
        {rows.map(([Ic, l, v]) => (
          <div key={l} className="ff-pkc-row">
            <span className="ff-pkc-ico"><Ic size={15} strokeWidth={1.6} /></span>
            <span className="v"><i>{l}</i>{v}</span>
          </div>
        ))}
      </div>
      <button type="button" className="ff-pkc-dbtn" onClick={() => setDoc(true)} aria-haspopup="dialog">
        <S17I.FileText size={17} strokeWidth={1.8} /><span>Details</span><S17I.ArrowRight size={17} strokeWidth={2} />
      </button>
      <div className="ff-pkc-ft">{foot}</div>
      {doc && <PkgDoc17 d={d} onClose={() => setDoc(false)} />}
    </div>
  );
}

function BkPkgCard17({ sv, tab = "bar", on, onClick }) {
  const d = pkcData17(sv, tab);
  const ref = useRef(null);
  usePkcFitAll17(ref, sv.id + (on ? "1" : "0"));
  const rows = [[S17I.Sparkles, "You provide", d.provide], [S17I.Users, "Ideal for", d.ideal], [S17I.Clock, "Duration", d.duration]]
    .filter(r => r[2]).map(([a, b, c]) => [a, b, <b>{pkcNoBreak17(c)}</b>]);
  return (
    <PkgFace17 d={d} refEl={ref} cls={on ? " sel" : ""} rows={rows}
      title={<h5 className="ff-pkc-ti fit">{d.name}</h5>}
      line={d.line ? <p className="ff-pkc-tg fit">{d.line}</p> : null}
      foot={<>
        {d.earn && <span className="ff-pkc-earn"><i>You earn</i><b>{d.earn}</b></span>}
        <button type="button" className="ff-pkc-go fit" onClick={onClick} aria-pressed={!!on} aria-label={`${d.name}: ${on ? "Signed up" : "Sign up"}`}>
          {on ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}
        </button>
      </>} />
  );
}

/* v1.138 (Alex 20 Nov 02:10): "You provide" and "Ideal for" on Create your own are keywords: type one, press Enter, it becomes a chip; stored comma-separated. */
function PkcKw17({ value, onChange, placeholder, disabled, label }) {
  const items = String(value || "").split(",").map(x => x.trim()).filter(Boolean);
  const [t, setT] = useState("");
  const add = () => {
    const v = t.trim().replace(/,+$/, "").trim();
    setT("");
    if (!v || items.some(x => x.toLowerCase() === v.toLowerCase())) return;
    onChange([...items, v].join(", "));
  };
  return (
    <span className="ff-pkc-kw">
      {items.map(k => <span key={k} className="kw">{k}{!disabled && <button type="button" aria-label={`Remove ${k}`} onClick={() => onChange(items.filter(x => x !== k).join(", "))}>×</button>}</span>)}
      {!disabled && <input type="text" value={t} onChange={(e) => setT(e.target.value)} placeholder={items.length ? "" : placeholder} aria-label={label}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} onBlur={add} />}
    </span>
  );
}

/* Create your own: the same card, every line typed by the professional, including You earn. */
function BkPkgOwn17({ tab }) {
  const { state, dispatch } = useStore();
  const ref = useRef(null);
  const qid = pkcOwnQid17(tab);
  const account = qaAccount17(state);
  const saved = account ? qaAnswer17(state, account, qid) : null;
  const sv0 = saved && !saved.withdrawnAt && saved.typed ? saved.typed : null;
  const [f, setF] = useState(() => sv0 ? { name: sv0.name || "", line: sv0.line || "", provide: sv0.provide || "", ideal: sv0.ideal || "", duration: sv0.duration || "", earn: sv0.pence ? String(sv0.pence / 100) : "" } : { name: "", line: "", provide: "", ideal: "", duration: "", earn: "" });
  const [bad, setBad] = useState({});
  const [busy, setBusy] = useState(false);
  const on = !!sv0;
  const nameRef = useRef(null), earnRef = useRef(null);
  const set = (k) => (e) => { const v = k === "earn" ? e.target.value.replace(/[^\d.]/g, "").slice(0, 7) : e.target.value.slice(0, k === "name" ? 40 : 120); setF(x => ({ ...x, [k]: v })); setBad(b => ({ ...b, [k]: false })); };
  const go = async () => {
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    if (busy) return;
    if (on) {
      setBusy(true); const r = await qaWithdraw17(dispatch, { questionId: qid, account }); setBusy(false);
      dispatch({ type: "TOAST", toast: r.ok ? "Your package is withdrawn" : "That couldn't be saved. Try again." }); return;
    }
    const miss = { name: !f.name.trim(), earn: !pkcAmtOk17(f.earn) };
    if (miss.name || miss.earn) { setBad(miss); (miss.name ? nameRef : earnRef).current?.focus(); return; }
    setBusy(true);
    const r = await qaSubmit17(dispatch, { questionId: qid, account, typed: { kind: "own_package", tab, name: f.name.trim(), line: "Your custom package", provide: f.provide.trim(), ideal: f.ideal.trim(), duration: f.duration.trim(), pence: Math.round(Number(f.earn) * 100) }, visibility: "public", source: "FF Team Bookings · FF Party packages" });
    setBusy(false);
    dispatch({ type: "TOAST", toast: r.ok ? `Signed up: ${f.name.trim()}` : "That couldn't be saved. Try again." });
  };
  const d = { id: "own-" + tab, tab, site: "FF Party", name: f.name.trim(), line: f.line.trim(), provide: f.provide.trim(), ideal: f.ideal.trim(), duration: f.duration.trim(), earn: pkcGBP17(f.earn), points: [], brief: f.provide.trim() };
  const inp = (k, ph, el = "input") => React.createElement(el === "area" ? "textarea" : "input", {
    className: `ff-pkc-tin${bad[k] ? " bad" : ""}`, value: f[k], onChange: set(k), placeholder: ph, disabled: on, "aria-label": ph, rows: el === "area" ? 2 : undefined, type: el === "area" ? undefined : "text" });
  /* Every type box grows with its text, so a word is never cut or split. */
  React.useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const fit = () => root.querySelectorAll("textarea.ff-pkc-tin").forEach(el => { el.style.height = "auto"; el.style.height = el.scrollHeight + "px"; });
    fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
  });
  const kw = (k, ph) => <PkcKw17 value={f[k]} onChange={(v) => setF(x => ({ ...x, [k]: v.slice(0, 160) }))} placeholder={ph} disabled={on} label={ph} />;
  const rows = [[S17I.Sparkles, "You provide", kw("provide", "What you bring")], [S17I.Users, "Ideal for", kw("ideal", "The events it suits")], [S17I.Clock, "Duration", inp("duration", "How long")]];
  return (
    <PkgFace17 d={d} refEl={ref} cls={` ff-pkc-own2${on ? " sel" : ""}`} dataId={"create-" + tab} rows={rows}
      title={<textarea ref={nameRef} rows={1} className={`ff-pkc-tin ti${bad.name ? " bad" : ""}`} value={f.name} onChange={set("name")} onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }} placeholder="Create your own" aria-label="Package name" disabled={on} />}
      line={<p className="ff-pkc-tg fit">Your custom package</p>}
      foot={<>
        <label className={`ff-pkc-earn in${bad.earn ? " bad" : ""}`}>
          <span className="cur">£</span>
          <input ref={earnRef} type="text" inputMode="decimal" autoComplete="off" value={f.earn} onChange={set("earn")} disabled={on} aria-invalid={!!bad.earn} aria-label="What you want to earn, in pounds" onKeyDown={e => { if (e.key === "Enter") go(); }} />
        </label>
        <button type="button" className="ff-pkc-go fit" onClick={go} disabled={busy} aria-pressed={on} aria-label={`Your package: ${on ? "Signed up" : "Sign up"}`}>
          {on ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}
        </button>
      </>} />
  );
}

/* pkg3 / v17.46: Coming soon package cards. The Bar rail ends with the custom-package card; the Entertainment and
   Services tabs each preview three packages to come. Copy speaks to the professional who will create them. */
const PK_SOON17 = {
  bar: [{ id: "custom", eb: "FF Party", ti: "FF Party packages", tg: "Create custom packages.",
    inc: "Your signature serves, your kit, your style", ideal: "The events you love working" }],
  ent: [
    { id: "dj", eb: "Entertainment · FF Party", ti: "DJ Package", tg: "Your sound, your package, your price.",
      inc: "Your sets, your kit, your sound", ideal: "Weddings, birthdays and late-night parties" },
    { id: "music", eb: "Entertainment · FF Party", ti: "Live Music Package", tg: "Your music, your package, your price.",
      inc: "Your act, your repertoire, your setup", ideal: "Ceremonies, receptions and drinks receptions" },
    { id: "act", eb: "Entertainment · FF Party", ti: "Entertainer Package", tg: "Your act, your package, your price.",
      inc: "Magic, caricatures or a show of your own", ideal: "Family parties, corporate events and receptions" },
  ],
  svc: [
    { id: "photo", eb: "Services · FF Party", ti: "Photographer Package", tg: "Your eye, your package, your price.",
      inc: "Your camera, your style, your edit", ideal: "Weddings, parties and brand events" },
    { id: "video", eb: "Services · FF Party", ti: "Videographer Package", tg: "Your story, your package, your price.",
      inc: "Your filming, your edit, your highlights reel", ideal: "Weddings, launches and celebrations" },
    { id: "host", eb: "Services · FF Party", ti: "Event Host Package", tg: "Your welcome, your package, your price.",
      inc: "Your welcome, your timing, your way with a crowd", ideal: "Corporate events, awards nights and parties" },
  ],
};
/* bk5 (Mr G 03:03): no "Coming soon". The Bar rail always ends with "Create your own"; the Entertainment and Services
   previews keep their cards. Each has "Register interest": one Q&A answer (int.party_package_new, option ids = the ids
   above). Signed out, the button opens sign-in. The question is registered here because the Q&A catalogue has no
   entry for packages still to come (QA_Q17 is a shared object, defined earlier in the manifest). */
if (!QA_Q17["int.party_package_new"]) QA_Q17["int.party_package_new"] = { text: "Are you interested in creating these FF Party packages?", group: "interest", multi: true };
function BkPkgSoon17({ pk = PK_SOON17.bar[0], own = false }) {
  const { state, dispatch } = useStore();
  const ref = useRef(null);
  usePkcFit17(ref, pk.id);
  const [busy, setBusy] = useState(false);
  const account = qaAccount17(state);
  const qid = "int.party_package_new";
  const ans = account ? qaAnswer17(state, account, qid) : null;
  const ids = ans && !ans.withdrawnAt ? (ans.optionIds || []) : [];
  const on = ids.includes(pk.id);
  const title = own ? "Create your own" : pk.ti;
  const rows = [[S17I.Sparkles, "You provide", pk.inc], [S17I.Users, "Ideal for", pk.ideal], [S17I.Clock, "Duration", "As long as you choose"]];
  const go = async () => {
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    if (busy) return;
    setBusy(true);
    const next = on ? ids.filter(x => x !== pk.id) : [...ids, pk.id];
    const r = next.length
      ? await qaSubmit17(dispatch, { questionId: qid, account, optionIds: next, visibility: "public", source: "FF Team Bookings · FF Party packages" })
      : await qaWithdraw17(dispatch, { questionId: qid, account });
    setBusy(false);
    dispatch({ type: "TOAST", toast: r.ok ? (on ? "Interest withdrawn" : `Interest registered: ${title}`) : "That couldn't be saved. Try again." });
  };
  return (
    <div ref={ref} className={`ff-pkc cmp ff-pkc-new${on ? " sel" : ""}`} data-pk17={(own ? "create-" : "new-") + pk.id}>
      <span className="ff-pkc-rb">{React.createElement(PKC_ICO17[own ? "bar" : (PK_SOON17.ent.includes(pk) ? "ent" : PK_SOON17.svc.includes(pk) ? "svc" : "bar")], { size: 13, strokeWidth: 1.8 })} FF Party</span>
      <span className="ff-pkc-logo"><FFLogo size={34} tier="gold" /></span>
      <div className="ff-pkc-hd">
        <h5 className="ff-pkc-ti fit">{title}</h5>
        <p className="ff-pkc-tg fit">{own ? "Your custom package" : pk.tg}</p>
      </div>
      <div className="ff-pkc-rows">
        {rows.map(([Ic, l, v]) => (
          <div key={l} className="ff-pkc-row">
            <span className="ff-pkc-ico"><Ic size={15} strokeWidth={1.6} /></span>
            <span className="v"><i>{l}</i><b>{pkcNoBreak17(v)}</b></span>
          </div>
        ))}
      </div>
      <div className="ff-pkc-ft">
        <button type="button" className="ff-pkc-go ff-pkc-ri" onClick={go} disabled={busy} aria-pressed={on} aria-label={`${title}: ${on ? "Interest registered" : "Register interest"}`}>
          {on ? <><S17I.Check size={13} strokeWidth={2.6} /> Interest registered</> : "Register interest"}
        </button>
      </div>
    </div>
  );
}

/* pubbtn (Mr G, 02:51): the Packages tab on a profile shows a compact option-3 card: FF Party ribbon, title, the short
   one-line headline, the key rows, Details closed. No footer. The rail ends with "Create your own" (no button).
   A line that doesn't fit shrinks (never splits a word); a tap on Details opens it in place instead of the sheet. */
function usePkcFit17(ref, key) {
  React.useLayoutEffect(() => {
    const root = ref.current; if (!root) return;
    const fit = () => root.querySelectorAll(".fit").forEach(el => {
      if (!el.offsetParent) return;
      el.style.fontSize = ""; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 0.5 && fs > 9 && n++ < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; }
    });
    fit();
    let ro = null; if (window.ResizeObserver) { ro = new ResizeObserver(fit); ro.observe(root); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key]);
}
function ProfPkgCard17({ svc }) {
  const p = PKG_BY17[svc.id] || {};
  const ref = useRef(null);
  usePkcFit17(ref, svc.id);
  const eb = [svc.level === "Bar" ? "" : svc.level, svc.site || "FF Party"].filter(Boolean).join(" · ");
  const line = p.headline || svc.tagline;
  const rows = [[S17I.Sparkles, "Includes", p.includes || svc.includes], [S17I.Users, "Ideal for", p.ideal || svc.ideal], [S17I.Clock, "Duration", p.durationLabel || svc.time]].filter(r => r[2]);
  return (
    <div ref={ref} className="ff-pkc cmp" data-pk17={"pp-" + svc.id}>
      <span className="ff-pkc-rb"><S17I.Sparkles size={12} /> {svc.site || "FF Party"}</span>
      <span className="ff-pkc-logo"><FFLogo size={34} tier="gold" /></span>
      <div className="ff-pkc-hd">
        <div className="ff-pkc-eb fit">+ {eb} +</div>
        <h5 className="ff-pkc-ti fit">{p.name || svc.title}</h5>
        {line && <p className="ff-pkc-tg fit">{line}</p>}
      </div>
      <div className="ff-pkc-rows">
        {rows.map(([Ic, l, v]) => (
          <div key={l} className="ff-pkc-row">
            <span className="ff-pkc-ico"><Ic size={15} strokeWidth={1.6} /></span>
            <span className="v"><i>{l}</i><b>{pkcNoBreak17(v)}</b></span>
          </div>
        ))}
      </div>
      <details className="ff-pkc-dt" onClick={(e) => e.stopPropagation()}>
        <summary><span>Details</span><S17I.ChevronDown size={18} strokeWidth={2} /></summary>
        <div className="in">
          {p.description && <p>{pkcNoBreak17(p.description)}</p>}
          {(p.points || []).length > 0 && <ul>{p.points.map(x => <li key={x}>{pkcNoBreak17(x)}</li>)}</ul>}
          {p.conditions && <p className="cond">{pkcNoBreak17(p.conditions)}</p>}
        </div>
      </details>
    </div>
  );
}
function ProfPkgCreate17() {
  const pk = PK_SOON17.bar[0];
  const ref = useRef(null);
  usePkcFit17(ref, "create");
  const rows = [[S17I.Sparkles, "Includes", pk.inc], [S17I.Users, "Ideal for", pk.ideal], [S17I.Clock, "Duration", "As long as you choose"]];
  return (
    <div ref={ref} className="ff-pkc cmp ff-pkc-own" data-pk17="pp-create">
      <span className="ff-pkc-rb"><S17I.Sparkles size={12} /> FF Party</span>
      <span className="ff-pkc-logo"><FFLogo size={34} tier="gold" /></span>
      <div className="ff-pkc-hd">
        <div className="ff-pkc-eb fit">+ FF Party +</div>
        <h5 className="ff-pkc-ti fit">Create your own</h5>
        <p className="ff-pkc-tg fit">Your custom package</p>
      </div>
      <div className="ff-pkc-rows">
        {rows.map(([Ic, l, v]) => (
          <div key={l} className="ff-pkc-row">
            <span className="ff-pkc-ico"><Ic size={15} strokeWidth={1.6} /></span>
            <span className="v"><i>{l}</i><b>{v}</b></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamBookings({ guest = false }) {
  const { state, dispatch } = useStore();
  const [drop, setDrop] = useState(null);
  const signedIn = state.auth.status === "signedIn";
  const svcInterest = state.profile.serviceInterest || [];
  const [sel, setSel] = useState(null);
  const [pkgTerms, setPkgTerms] = useState(false);
  const picked = sel || svcInterest;
  const tick = (sv) => setSel(picked.includes(sv.id) ? picked.filter(x => x !== sv.id) : [...picked, sv.id]);

  /* v17.4.6: package sign-ups are one Q&A answer (int.party_package, option ids = package ids). */
  const confirmPkgs = async () => {
    setPkgTerms(false);
    const account = qaAccount17(state);
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    const next = picked;
    const sv = { title: next.length === 1 ? ((pkgs.find(x => x.id === next[0]) || {}).title || (PKC_EXTRA_BY17[next[0]] || {}).name || "the package") : "your packages" };
    const mirror = { type: "PROFILE", patch: { serviceInterest: next } };
    const r = next.length
      ? await qaSubmit17(dispatch, { questionId: "int.party_package", account, optionIds: next, visibility: "public", source: "FF Team Bookings · FF Party packages" }, mirror)
      : await qaWithdraw17(dispatch, { questionId: "int.party_package", account }, mirror);
    dispatch({ type: "TOAST", toast: r.ok ? (next.length ? `Signed up for ${sv.title}` : "Withdrawn from your packages") : "That couldn't be saved. Try again." });
    if (r.ok) setSel(null);
  };
  /* Bar packages: Masterclass first, then down the catalogue's own order to Staffing. */
  const pkgs = [...PARTY_SERVICES.filter(sv => sv.id !== "svc_full").reverse(), ...(hid17(state, "packages", "svc_staffing") ? [] : [STAFFING_SERVICE])];
  const [pkTab, setPkTab] = useState("bar");
  usePkcEven17(pkTab);
  const PK_TABS = [["bar", "Bar"], ["ent", "Entertainment"], ["svc", "Services"]];
  /* bk5: section headings stay on one line (shrink, never split). */
  const partyRef = useRef(null);
  usePkcFit17(partyRef, "party");

  return (
    <div className="ff-bk" ref={partyRef}>
      <style>{BKD_CSS}</style>

      <section className="ff-bk-sec ff-bk-yours" id="ff-bk-yours" aria-labelledby="ff-bk-yours-h">
        <h1 className="ff-h1 ff-big20 ff-bk-yh" id="ff-bk-yours-h"><span className="t">Your bookings</span></h1>
        {/* bk-hybrid (Alex, 18 Nov 21:33): a hybrid of live FFTeam.uk and v1.66. The live site's design (one cream panel,
            the WhatsApp banner, then white cards with an icon tile, a lock badge and a gold status line) holding the
            v1.52 content (requests on WhatsApp, selected bookings shown here, notifications shown here). */}
        <div className="ff-bkh-panel">
          <div className="ff-wa ff-bkh-wa">
            <span className="ff-wa-ico"><WhatsAppIcon size={26} /></span>
            <span className="ff-body ff-bkh-watx">
              <b>Requests come to you on WhatsApp.</b> When companies and clients ask if you're free, each request is sent to you directly on WhatsApp and shows here. You reply in either place.
            </span>
          </div>
          <ul className="ff-bkh-list">
            <li className="ff-bkh-card">
              <span className="ff-bkh-tile"><BKH_CAL17 size={24} strokeWidth={1.6} /><span className="ff-bkh-lock" aria-hidden="true"><Lock size={11} strokeWidth={2.2} /></span></span>
              <span className="ff-bkh-tx">
                <b className="ff-bkh-ti">Confirmed bookings</b>
                <span className="ff-bkh-ds">When you're selected for a booking, it will be shown here.</span>
                <span className="ff-bkh-st"><Lock size={13} strokeWidth={2} /> Coming soon</span>
              </span>
            </li>
            <BkNotes11 empty={<li className="ff-bkh-card">
              <span className="ff-bkh-tile ff-bkh-tile-ff"><AddFireFlairMark size={30} /></span>
              <span className="ff-bkh-tx">
                <b className="ff-bkh-ti">Notifications</b>
                <span className="ff-bkh-ds">Notifications will also be shown here.</span>
              </span>
            </li>} />
          </ul>
        </div>
      </section>

      <section className="ff-bk-sec ff-fb21" id="ff-bk-fireflair">
        {/* bk-titles: the FF Party and FF Staff boxes sit under one page title, like Your bookings. */}
        <h1 className="ff-h1 ff-big20 ff-bk-yh" id="ff-bk-get-h"><span className="t">Get booked</span></h1>
        <div className="ff-bk-sell ff-bkpc ff-fb21-box pkg3" id="ff-bk-party">
          {/* title-bars (Alex, 18 Nov 17:00): the title and its text share one gold line (titles2.css, .ff-tlx). */}
          <div className="ff-tlx">
          {/* pkc-copy (Alex, 18 Nov 19:20): one title for all three tabs (the tab names the kind), so it stays one size on phones. */}
          <h2 className="ff-bk-bh ff-bk-bhc fit"><img className="ff-bk-bhlogo" decoding="async" src={FF_SITE_BRAND.party.icon} width={30} height={30} alt="" draggable={false} /><span>FFParty</span></h2>
          <p>Be your own boss. Sign up to the packages you want to deliver, or create your own, and we find you work close to home. Every package shows what you earn before you sign up, and you deal directly with the client, with FireFlair here to support you. The rates are strong, so we expect strong work in return.</p>
          </div>
          <div className="ff-pr17-chips" role="tablist" aria-label="Package types">
            {PK_TABS.map(([k, l], i) => <button key={k} id={`ff-pktab-${k}`} type="button" role="tab" className="ff-chip ff-pr17-tab" aria-selected={k === pkTab} aria-controls={`ff-pkpanel-${k}`} tabIndex={k === pkTab ? 0 : -1} onClick={() => setPkTab(k)}
              onKeyDown={e => { const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "Home" ? -i : e.key === "End" ? PK_TABS.length - 1 - i : 0; if (!d) return; e.preventDefault(); const nk = PK_TABS[(i + d + PK_TABS.length) % PK_TABS.length][0]; setPkTab(nk); const b = document.getElementById(`ff-pktab-${nk}`); if (b) b.focus(); }}>{l}</button>)}
          </div>
          {pkTab === "bar" ? (<div role="tabpanel" id="ff-pkpanel-bar" aria-labelledby="ff-pktab-bar">
            <HeroFlow20 label="Our bar packages">
              {pkgs.map(sv => <div key={sv.id} className="ff-bkpk-cell"><BkPkgCard17 sv={sv} on={picked.includes(sv.id)} onClick={() => tick(sv)} /></div>)}
              <div className="ff-bkpk-cell"><BkPkgOwn17 tab="bar" /></div>
            </HeroFlow20>
            <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={!sel} onClick={() => { if (!qaAccount17(state)) { window.dispatchEvent(new Event("ff-login")); return; } setPkgTerms(true); }}><Check size={15} /> Confirm</button>
          </div>) : (
            <div role="tabpanel" id={`ff-pkpanel-${pkTab}`} aria-labelledby={`ff-pktab-${pkTab}`}>
              <HeroFlow20 label={pkTab === "ent" ? "Entertainment packages" : "Services packages"} key={pkTab}>
                <div className="ff-bkpk-cell"><BkPkgOwn17 key={pkTab} tab={pkTab} /></div>
                {(PKC_EXTRA17[pkTab] || []).map(x => <div key={x.id} className="ff-bkpk-cell"><BkPkgCard17 sv={{ id: x.id, title: x.name }} tab={pkTab} on={picked.includes(x.id)} onClick={() => tick({ id: x.id })} /></div>)}
              </HeroFlow20>
              <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={!sel} onClick={() => { if (!qaAccount17(state)) { window.dispatchEvent(new Event("ff-login")); return; } setPkgTerms(true); }}><Check size={15} /> Confirm</button>
            </div>
          )}
          {pkgTerms && <PkgTerms17 onClose={() => setPkgTerms(false)} onAccept={confirmPkgs} />}
        </div>

        <div className="ff-bk-sell ff-bkpc ff-fb21-box" id="ff-bk-staff">
          <div className="ff-tlx">
          <h2 className="ff-bk-bh ff-bk-bhc fit"><img className="ff-bk-bhlogo" decoding="async" src={FF_SITE_BRAND.staff.icon} width={30} height={30} alt="" draggable={false} /><span>FFStaff</span></h2>
          <p>Businesses on FF Staff hire people for shifts. They see your preferred hourly rate for each of your professions before they hire you, and set the pay on each shift card.</p>
          </div>
          {/* v1.46 bookings (Alex, 18 Nov 20:06): signed out, the three steps; signed in, their own professions and rates. */}
          <ProfRates17 guest={guest || !signedIn} />
        </div>
      </section>

      <section className="ff-bk-sec ff-bkgrow" id="ff-bk-grow">
        {/* bk-titles (Alex, 18 Nov 20:25): a page title like Your bookings (gold underline); the cards below already say Training, Dream jobs and Rewards. */}
        <h1 className="ff-h1 ff-big20 ff-bk-yh" id="ff-bk-grow-h"><span className="t">Grow with FireFlair</span></h1>
        {/* v1.162 (Alex 20 Nov 05:21): back to three boxes; the hero scroll is inside each opened box (the choices). */}
        <div className="ff-bkd-row">
          <BkDrop17 id="ff-bk-training" open={drop === "ff-bk-training"} onOpen={setDrop} title="Training" icon={E17I.GraduationCap} photo="bk_training" desc="Register your interest and we will notify you with available dates."><InterestSection kind="training" inner /></BkDrop17>
          <BkDrop17 id="ff-bk-jobs" open={drop === "ff-bk-jobs"} onOpen={setDrop} title="Dream jobs" icon={E17I.Plane} photo="bk_jobs" desc="Tell us your dream jobs and we will help make them happen."><InterestSection kind="jobs" inner /></BkDrop17>
          <BkDrop17 id="ff-bk-rewards" open={drop === "ff-bk-rewards"} onOpen={setDrop} title="FireFlair rewards" icon={E17I.Gift} photo="in_rw_bar_shows" desc="Perks for people who work with FireFlair: kit, tickets and experiences. Register your interest in the ones you want."><InterestSection kind="rewards" inner /></BkDrop17>
        </div>
      </section>

    </div>
  );
}


function draftFromProfile(state) {
  const names = (cat) => recsOf(state.profile, cat).filter(r => !r.proposed).map(r => r.name);
  return {
    name: state.profile.name, headline: state.profile.headline || "", professions: names("professions"), photo: state.profile.photo,
    skills: names("skills"), interests: names("interests"),
    locations: names("locations"), languages: names("languages"),
  };
}



/* ==========================================================================
   7. FF STAFF
   ========================================================================== */

/* ---------------------------------------------------------------------------
   COMING 2027 — one locked component used across FF Team, FF Staff, FF Party
   and FF VIP. Lock icon like a locked item in a game, planned version, and a
   target date once one is agreed with the development team.
   --------------------------------------------------------------------------- */
function ComingSoonTile({ item, width }) {
  if (!item) return null;
  return (
    <div className="ff-tile dark ff-locked" style={{ width: width || CARD_W.booking, minHeight: 118, gap: 7 }}>
      <Corners />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ff-lock"><Lock size={13} color="#EAD79C" strokeWidth={1.8} /></span>
        <span className="ff-label" style={{ color: "#D9BE68" }}>{item.version}</span>
      </div>
      <span className="ff-display" style={{ fontSize: 13.5, color: "#F2ECE0", lineHeight: 1.25 }}>{item.title}</span>
      <span className="ff-serif" style={{ fontSize: 13, color: "rgba(242,236,224,.66)", lineHeight: 1.3 }}>{item.note}</span>
      <span style={{ marginTop: "auto", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(234,215,156,.6)" }}>
        {item.date ? `Target ${item.date}` : "Coming 2027 · date to be agreed"}
      </span>
    </div>
  );
}


function ComingSoonRow({ ids, title = "Coming 2027" }) {
  const items = (ids ? ids.map(roadmapItem) : ROADMAP).filter(Boolean);
  return (
    <section style={{ marginTop: 26 }}>
      <SectionHead icon={<Lock size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={title} count={items.length} />
      <HScroll label={title}>
        {items.map(it => <ComingSoonTile key={it.id} item={it} />)}
      </HScroll>
    </section>
  );
}


/* Numbered step heading for the vertical Event Card journey. */
function StepHead({ n, title, note, done }) {
  const go = () => { const el = document.getElementById(`ff-step-${n}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <div id={`ff-step-${n}`} className="ff-stephead" style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: "34px 0 14px", scrollMarginTop: 80 }}>
      <button type="button" className="ff-stepnum" data-done={done ? "1" : "0"} onClick={go} aria-label={`Step ${n}: ${title}`}>{done ? <Check size={14} /> : String(n).padStart(2, "0")}</button>
      <span style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
        <span className="ff-h2" style={{ display: "block" }}>{title}</span>
        {note && <span className="ff-body ff-muted" style={{ fontSize: 13.5 }}>{note}</span>}
      </span>
    </div>
  );
}


/* Helpers shared by the FF Staff screens. */
/* Find a person on a Service Card. "me" is the signed-in professional, who
   isn't in the directory until their FF Team profile is live. */
const findPerson = (all, state, id) => all.find(p => p.id === id) || (id === "me" ? meAsStaff(state.profile, state.session) : undefined);


const latestEng = (state, shiftId) => {
  const list = state.engagements.filter(e => e.shiftId === shiftId);
  return list[list.length - 1] || null;
};


const reservedCredits = (state) => state.engagements.filter(e => e.credit && e.state === "requested").length;


const freeCredits = (state) => Math.max(0, (state.credits?.balance || 0) - reservedCredits(state));


/* A shift can be sent when someone is assigned and they haven't already been
   asked (or the last person asked declined/expired and has been replaced). */
function canSend(state, shift) {
  if (!shift.staffId) return false;
  const e = latestEng(state, shift.id);
  if (!e) return true;
  return ["unavailable", "expired"].includes(e.state) && e.staffId !== shift.staffId;
}


const splitTime = (t) => { const [a = "", b = ""] = String(t || "").split(/\s*[—–-]\s*/); return [a.trim(), b.trim()]; };


const secDay = (iso) => {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? null : { date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), day: d.toLocaleDateString("en-GB", { weekday: "long" }) };
};


/* ---------------------------------------------------------------------------
   BOOKING BAR (v16.12) — works like the XP bar: a bottom bar on phones and a
   row under the menu bar on desktop. It shows the Event Card (or a blank
   card where it will go) and a small card for each person in the basket.
   Cards can be dragged onto it on desktop.
   --------------------------------------------------------------------------- */
function BookingBar({ placement = "bottom", dragging = false, style }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const ev = state.events.find(e => e.id === state.activeEventId);
  const people = state.selection.map(id => all.find(p => p.id === id)).filter(Boolean);
  const [over, setOver] = useState(false);
  const site = hireSiteOf(state);
  const go = () => {
    if (state.role !== "staff") dispatch({ type: "ROLE", role: "staff" });
    dispatch({ type: "V11_SET", patch: { bkView: ev ? { eventId: ev.id } : { mode: "new" } } });
    dispatch({ type: "TAB", tab: "bookings", route: "staffHome" });
    window.scrollTo(0, 0);
  };
  const drop = (e) => {
    e.preventDefault(); setOver(false);
    let v = "";
    try { v = e.dataTransfer.getData("text/plain") || ""; } catch (x) { /* ignore */ }
    const id = v.startsWith("ff-person:") ? v.slice(10) : null;
    const p = id && all.find(x => x.id === id);
    if (!p) return;
    if (state.selection.includes(id)) { dispatch({ type: "TOAST", toast: `${p.name.split(" ")[0]} is already in your booking bar` }); return; }
    dispatch({ type: "SELECT_ADD", id });
    dispatch({ type: "TOAST", toast: `${p.name.split(" ")[0]} added${ev ? ` to ${ev.title}` : ""}` });
  };
  const evDay = ev && secDay(ev.iso);
  const evTheme = ev && ev.poster ? eventThemeOf(ev.poster) : null;   // an FF Party Event Card keeps its colours
  return (
    <div className={`ff-bookbar ${placement}${over ? " over" : ""}${dragging ? " dragging" : ""}`} style={style}
      onDragOver={(e) => { e.preventDefault(); try { e.dataTransfer.dropEffect = "copy"; } catch (x) { /* ignore */ } if (!over) setOver(true); }}
      onDragLeave={() => setOver(false)} onDrop={drop} aria-label="Booking bar">
      <div className="ff-bookbar-in">
        <button type="button" className={`ff-mini ev${ev ? "" : " blank"}${evTheme ? " poster" : ""}`} onClick={go}
          style={evTheme ? { background: evTheme.swatch, color: evTheme.dark ? "#F3DE9C" : "#15130F" } : undefined}
          aria-label={ev ? `Open Event Card: ${ev.title}` : "Create your Event Card"} title={ev ? ev.title : "Your Event Card goes here"}>
          {ev ? (<>
            <span className="tab" />
            <span className="t">{ev.title}</span>
            <span className="d">{evDay ? evDay.date.replace(/ \d{4}$/, "") : (ev.date || "")}</span>
          </>) : (<><Plus size={12} /><span className="d">Event</span></>)}
        </button>
        <span className="ff-bookbar-plus" aria-hidden="true">+</span>
        <div className="ff-bookbar-cards">
          {people.map(p => (
            <button key={p.id} type="button" className="ff-mini person" title={`${p.name} · ${p.profession}`}
              aria-label={`${p.name}, in your booking bar`} onClick={() => dispatch({ type: "VIEW", id: p.id })}
              style={{ backgroundImage: p.photo ? `url("${p.photo}")` : undefined }}>
              {!p.photo && <span className="ini">{p.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>}
              <span className="nm">{p.name.split(" ")[0]}</span>
            </button>
          ))}
          {(dragging || over) && <span className="ff-mini drop">Drop</span>}
          {!people.length && !dragging && !over && <span className="ff-bookbar-hint">{ev ? "Add people: tap or drag their cards here" : "Tap or drag people here"}</span>}
        </div>
        {people.length > 0 && (
          <button type="button" className="ff-bookbar-clear" onClick={() => dispatch({ type: "CLEAR_SELECTION" })} aria-label="Clear the people from your booking bar"><X size={14} /></button>
        )}
        <button type="button" className="ff-bookbar-go" onClick={go}>
          {ev ? (people.length ? "Add to booking" : "Open booking") : "Create Event Card"}
        </button>
      </div>
    </div>
  );
}




/* ---------------------------------------------------------------------------
   INVOICE — confirmed Service Cards for one event, one professional document.
   --------------------------------------------------------------------------- */
function InvoiceCard({ event, rows, company }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const cm = event.cocktails;
  const citems = cm && cm.picks ? cm.picks.map(id => cocktailById(state, id, directory)).filter(Boolean) : [];
  const recipesText = citems.length ? ` Cocktails, ${menuLine(cm)}: ${citems.map(x => `${x.name} (${ingredientsOf(x).join(", ")})`).join("; ")}.` : "";
  const text = `FireFlair booking — ${event.title}, ${event.date || "date TBC"}, ${event.venue || ""}. Confirmed: ${rows.map(r => `${r.person?.name || "Staff"} (${r.shift.role}, ${r.shift.time || "times TBC"})`).join("; ")}.` + recipesText;
  return (
    <div className="ff-invoice">
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px" }}>
        <Coin size={30} tier="gold" />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="ff-label" style={{ display: "block" }}>FireFlair invoice</span>
          <span className="ff-display" style={{ fontSize: 15 }}>{event.title}</span>
        </span>
        <Receipt size={18} color="var(--gold-dk)" strokeWidth={1.5} />
      </div>
      <div style={{ padding: "0 14px" }}>
        <div className="ff-body ff-muted" style={{ fontSize: 12 }}>
          {event.date || "Date to confirm"} · {event.venue || "Venue to confirm"}{company?.name ? ` · Booked by ${company.name}` : ""}
        </div>
        <table className="ff-invtable">
          <thead><tr><th>Professional</th><th>Shift</th><th>Pay rate</th><th>FireFlair</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.shift.id}>
                <td>{r.person?.name || "Staff"}</td>
                <td>{r.shift.role}<br /><span className="ff-muted">{r.shift.time || "Times TBC"}</span></td>
                <td>{r.shift.pay || "As agreed"}</td>
                <td>1 credit</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "8px 0 12px" }}>
          {rows.length} confirmed Service Card{rows.length === 1 ? "" : "s"} · {rows.length} FireFlair credit{rows.length === 1 ? "" : "s"} used ({CREDIT_FEE} connection fee each).
          Pay rates are paid by the hirer directly to each professional — FireFlair does not hold or move that money.
        </p>
        {citems.length > 0 && (
          <div className="ff-invrecipes">
            <div className="ff-label" style={{ marginBottom: 8 }}>Cocktail recipes · {menuLine(cm)}</div>
            <RecipeList items={citems} />
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 14px 14px" }}>
        <Btn variant="sm" onClick={async () => {
          try { await navigator.clipboard.writeText(text); dispatch({ type: "TOAST", toast: "Invoice copied" }); }
          catch (e) { dispatch({ type: "TOAST", toast: "Couldn't copy here — use Share on WhatsApp" }); }
        }}><Copy size={13} /> Copy invoice</Btn>
        <a className="ff-btn sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Share on WhatsApp</a>
      </div>
    </div>
  );
}


