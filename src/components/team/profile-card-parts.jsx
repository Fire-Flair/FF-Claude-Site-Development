/* src/components/team/profile-card-parts.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   5. CARD COMPONENTS
   ========================================================================== */


function IconRow({ kinds, color }) {
  return (
    <span style={{ display: "inline-flex", gap: 9, alignItems: "center", opacity: .9 }}>
      {kinds.map(k => <CatIcon key={k} kind={k} size={13} color={color} />)}
    </span>
  );
}


const PC17_CSS = __ff_css("styles/pc1716.css");


if (typeof document !== "undefined" && !document.getElementById("ff-pc17-css")) {
  const st = document.createElement("style");
  st.id = "ff-pc17-css";
  st.textContent = PC17_CSS;
  document.head.appendChild(st);
}


/* "SIMAO" is stored upper case; the address shows Simao. */
/* FF Tags are always shown in lower case (the FFTeam.uk part keeps its capitals). */
function pc17Tag(tag) { return String(tag || "").toLowerCase(); }


/* Fits every row of a Profile Card into its box without ever splitting a word or showing "…":
   entries that do not fit are dropped whole (the last first); if none fit, the shortest entry stands alone;
   if that does not fit either, the row is hidden. The large card lets entries wrap onto a second line
   (between whole entries) and drops entries from the longest row if the panel would run into the footer. */
function pc17Fit(root) {
  /* v17.24: on the home hero easel the card sits under a perspective transform, which skews every measured box.
     Measure with the transform off (same frame, nothing is painted in between), then put it back. */
  const host = root.closest ? root.closest(".ff-easel24-card") : null;
  if (host && host.style.transform && host.style.transform !== "none") {
    const t = host.style.transform;
    host.style.transform = "none";
    try { pc17FitRun(root); } finally { host.style.transform = t; }
    return;
  }
  pc17FitRun(root);
}
function pc17FitRun(root) {
  const px = root.getBoundingClientRect().width / 100;
  if (!px) return;
  const rows = Array.from(root.querySelectorAll(".pc17-row"));
  rows.forEach((r) => { r.style.display = ""; r.style.borderBottomWidth = ""; r.style.paddingTop = ""; r.style.paddingBottom = ""; });
  const prep = (el) => {
    const kids = Array.from(el.children).filter((k) => k.classList.contains("en"));
    kids.forEach((k) => { k.style.display = ""; Array.from(k.querySelectorAll(".bl,.bu")).forEach((b) => { b.style.display = ""; }); });
    return kids;
  };
  const trail = (kids, n) => kids.forEach((k, i) => { const b = k.querySelector(".bl"); if (b) b.style.display = i === n - 1 ? "none" : ""; });
  const shortest = (el, kids, over) => {
    kids.forEach((k) => { k.style.display = "none"; });
    const s = kids.slice().sort((a, b) => a.textContent.length - b.textContent.length)[0];
    if (s) { s.style.display = ""; Array.from(s.querySelectorAll(".bl,.bu")).forEach((b) => { b.style.display = "none"; }); }
    if (!s || over()) { const r = el.closest(".pc17-row"); if (r) r.style.display = "none"; }
  };
  root.querySelectorAll(".pc17-fit").forEach((el) => {
    const kids = prep(el);
    const over = () => el.scrollWidth > el.clientWidth + 0.5;
    if (el.classList.contains("wr")) {
      const lh = parseFloat(getComputedStyle(el).lineHeight) || 1;
      const bad = () => Math.round(el.getBoundingClientRect().height / lh) > 2 || over();
      let n = kids.length;
      trail(kids, n);
      while (n > 1 && bad()) { n--; kids[n].style.display = "none"; trail(kids, n); }
      if (bad()) shortest(el, kids, bad);
    } else {
      let n = kids.length;
      while (n > 1 && over()) { n--; kids[n].style.display = "none"; }
      if (over()) shortest(el, kids, over);
    }
  });
  const bar = root.querySelector(".pc17-bar"), panel = root.querySelector(".pc17-panel");
  if (bar && panel && root.classList.contains("lg")) {
    for (let g = 0; g < 40; g++) {
      if (panel.getBoundingClientRect().bottom <= bar.getBoundingClientRect().top - 1.6 * px) break;
      const cand = Array.from(root.querySelectorAll(".pc17-fit.wr")).filter((el) => { const r = el.closest(".pc17-row"); return !r || r.style.display !== "none"; }).map((el) => {
        const kids = Array.from(el.children).filter((k) => k.classList.contains("en") && k.style.display !== "none");
        return { el, kids, lines: Math.round(el.getBoundingClientRect().height / (parseFloat(getComputedStyle(el).lineHeight) || 1)) };
      }).filter((c) => c.lines > 1 && c.kids.length > 1);
      if (!cand.length) break;
      cand.sort((a, b) => b.kids.length - a.kids.length);
      const c = cand[0];
      c.kids[c.kids.length - 1].style.display = "none";
      const v = c.kids.slice(0, -1);
      v.forEach((k, i) => { const b = k.querySelector(".bl"); if (b) b.style.display = i === v.length - 1 ? "none" : ""; });
    }
  }
  const shown = rows.filter((r) => r.style.display !== "none");
  if (shown.length) shown[shown.length - 1].style.borderBottomWidth = "0";
  /* Large card: the rows share the free height evenly, so the box runs down to the footer and the gap from the last
     row (the flags) to the footer equals the gap from the top of the box to the first row's icon. Padding in cqw. */
  if (bar && panel && shown.length && root.classList.contains("lg")) {
    const ico = shown[0].querySelector(".pc17-lico > span") || shown[0];
    const lastRow = shown[shown.length - 1];
    const lastC = Array.from(lastRow.querySelectorAll(".pc17-flag")).concat(Array.from(lastRow.querySelectorAll(".pc17-fit")));
    const pr = panel.getBoundingClientRect();
    const low = lastC.length ? Math.max(...lastC.map((el) => el.getBoundingClientRect().bottom)) : lastRow.getBoundingClientRect().bottom;
    const a = ico.getBoundingClientRect().top - pr.top;
    const b = pr.bottom - low;
    const free = bar.getBoundingClientRect().top - pr.bottom;
    const add = Math.min(free, Math.max(0, free - (a - b)));
    if (add > 0.5) {
      const s = pr.width / (panel.offsetWidth || pr.width); /* screen px per layout px (1 unless scaled) */
      const cq = root.clientWidth / 100; /* layout px per cqw */
      const e = add / (2 * shown.length) / s;
      shown.forEach((r) => {
        const cs = getComputedStyle(r);
        r.style.paddingTop = ((parseFloat(cs.paddingTop) + e) / cq).toFixed(3) + "cqw";
        r.style.paddingBottom = ((parseFloat(cs.paddingBottom) + e) / cq).toFixed(3) + "cqw";
      });
    }
  }
}


function PcBust17({ size, color }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} fill={color} aria-hidden="true"><circle cx="12" cy="7.6" r="4.1" /><path d="M3.2 21 V18.6 C3.2 15.6 6.2 13.9 12 13.9 C17.8 13.9 20.8 15.6 20.8 18.6 V21 Z" /></svg>;
}


/* The Profile Card face. large = the share card (Profile Card, five boxes, each row led by its icon; the word is for screen readers only);
   otherwise the small web card (Profile, icon-only rows, flags below the box). Footer: the address only (the FF logo sits top right). 5 x 7, all sizes in cqw. */
function PlayerFace17({ person, large, themeKey, tier, onClick, selected, nameAs }) {
  const t = THEMES[themeKey] || THEMES.onyx;
  const m = metalOf(tier);
  const dark = t.dark;
  const acc = t.accent || t.sub;
  const sid = useSimpleId();
  const rootRef = useRef(null);
  const list = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean).map(capWords17).filter(Boolean);
  const pros = list(person.professions || person.profession);
  const headline = String(person.headline || "").trim() || pros[0] || "";
  const name = String(person.name || "").trim() || person.tag || "";
  let locs = list(person.base ? [person.base] : person.locations);
  const countries = locs.map((l) => (l.match(/,\s*([^,]+)$/) || [])[1]);
  if (locs.length && countries.every((c) => c && c === countries[0])) locs = locs.map((l) => l.replace(/,\s*[^,]+$/, ""));
  const cap = large ? 6 : 3;
  const langs = (person.languages || []).filter(Boolean).slice(0, 5);
  const rows = [["Professions", Users, pros], ["Skills", Star, list(person.skills)], ["Interests", Heart, list(person.interests)], ["Locations", MapPin, locs]]
    .filter((r) => r[2].length).map((r) => [r[0], r[1], r[2].slice(0, cap)]);
  const sig = [large, themeKey, tier, name, headline, rows.map((r) => r[2].join("|")).join("/"), langs.join(","), person.hasCar, person.tag].join("~");
  React.useLayoutEffect(() => {
    const el = rootRef.current && rootRef.current.parentElement;
    if (!el) return undefined;
    const fit = () => pc17Fit(el);
    fit();
    let ro = null, w = el.clientWidth;
    if (window.ResizeObserver) { ro = new ResizeObserver(() => { const nw = el.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(el); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    /* A font that arrives after the first fit (the card is drawn before Inter is ready) changes every width: fit again. */
    if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener("loadingdone", fit);
    const late = [setTimeout(fit, 350), setTimeout(fit, 1500)];
    return () => { if (ro) ro.disconnect(); if (document.fonts && document.fonts.removeEventListener) document.fonts.removeEventListener("loadingdone", fit); late.forEach(clearTimeout); };
  }, [sig]);
  const ink = t.ink;
  const flags = () => langs.map((l) => <span key={l} className="pc17-flag"><LangFlag lang={l} /></span>);
  const entries = (items) => large
    ? <span className="pc17-fit wr">{items.map((v, i) => <React.Fragment key={v + i}><span className="en">{v}<b className="bl" style={{ color: ink }}>,</b></span>{" "}</React.Fragment>)}</span>
    : <span className="pc17-fit">{items.map((v, i) => <span className="en" key={v + i}>{i > 0 && <b className="bu" style={{ color: acc }}>•</b>}{v}</span>)}</span>;
  return (
    <CardFrame premium fixed tier={tier} theme={t} ratio="5 / 7" className={"pc17 " + (large ? "lg" : "sm")} onClick={onClick} selected={selected}
      style={{ width: "100%", padding: 0, "--pc17-hair": m.hair }}>
      <span className="pc17-plate" style={{ color: "#E4C36A", borderColor: m.edge[1] }}>
        <span style={{ width: "3.4cqw", height: "3.4cqw", display: "block", flex: "none" }}><PcBust17 size="100%" color="#E4C36A" /></span>
        <span className="t">{large ? "Profile Card" : "Profile"}</span>
      </span>
      <span className="pc17-logo"><FFLogo size="100%" tier={tier} /></span>
      <div className="pc17-in" ref={rootRef}>
        <div className="pc17-photo" style={{ width: large ? "32cqw" : "35cqw", height: large ? "32cqw" : "35cqw", background: metalEdge(tier, 145) }}>
          <div className="pc17-photo-in" style={{ background: person.photo ? `url("${person.photo}") center/cover` : "radial-gradient(circle at 38% 30%,#2A2A2F,#0A0A0C)" }}>
            {!person.photo && (
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", display: "block" }} aria-hidden="true">
                <defs><linearGradient id={sid + "s"} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={m.edge[0]} /><stop offset="1" stopColor={m.edge[2] || m.edge[1]} /></linearGradient></defs>
                <circle cx="50" cy="38" r="17" fill={`url(#${sid}s)`} />
                <path d="M12 100 V82 C12 68 28 62 50 62 C72 62 88 68 88 82 V100 Z" fill={`url(#${sid}s)`} />
              </svg>
            )}
          </div>
        </div>
        <FitText17 as={nameAs || "div"} size={7.8} className="pc17-name" style={{ color: ink, marginTop: large ? "2.2cqw" : "3cqw", ...(nameAs ? { marginBottom: 0, marginInline: 0 } : {}) }}>{name}</FitText17>
        <FitText17 size={4.4} className="pc17-title" style={{ color: dark ? t.accent : "#6A4F12" }}>{headline || " "}</FitText17>
        <div className="ff-pc-rule">
          <i style={{ background: `linear-gradient(90deg, transparent, ${t.accent})` }} />
          <ProfessionMarks professions={pros.slice(0, 3)} hasCar={person.hasCar} full={false} color={t.accent} />
          <i style={{ background: `linear-gradient(270deg, transparent, ${t.accent})` }} />
        </div>
        {rows.length > 0 && (
          <div className="pc17-panel" style={{ borderColor: m.hair, background: dark ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.6)" }}>
            {rows.map(([k, I, items]) => (
              <div key={k} className="pc17-row" style={{ borderColor: t.rule }}>
                {large
                  ? <span className="pc17-lico"><span style={{ width: "3.5cqw", height: "3.5cqw", display: "block", flex: "none" }}><I size="100%" color="#E4C36A" strokeWidth={2.25} fill="none" /></span><span className="ff-sr">{k}</span></span>
                  : <span className="pc17-ico"><span style={{ width: "4.6cqw", height: "4.6cqw", display: "block" }}><I size="100%" color="#E4C36A" strokeWidth={2.25} fill={k === "Skills" || k === "Interests" ? "#E4C36A" : "none"} /></span></span>}
                <div className="pc17-val" style={{ color: ink }}>{entries(items)}</div>
              </div>
            ))}
            {large && langs.length > 0 && (
              <div className={"pc17-row" + (langs.length === 1 ? " one" : "")} style={{ borderColor: t.rule }}>
                <span className="pc17-lico"><span style={{ width: "3.5cqw", height: "3.5cqw", display: "block", flex: "none" }}><MessageSquare size="100%" color="#E4C36A" strokeWidth={2.25} fill="none" /></span><span className="ff-sr">Languages</span></span>
                <div className="pc17-flags">{flags()}</div>
              </div>
            )}
          </div>
        )}
        {!large && langs.length > 0 && <div className="pc17-flagzone"><div className="pc17-flags">{flags()}</div></div>}
      </div>
      <div className="pc17-bar" style={{ borderColor: t.rule, background: dark ? "rgba(0,0,0,.45)" : "#141416" }}>
        <FitText17 as="span" size={4} className="pc17-url" style={{ color: "#EAD79C" }}>{`${CARD_DOMAIN}/${pc17Tag(person.tag)}`}</FitText17>
      </div>
      {selected && (
        <span style={{ position: "absolute", inset: 0, zIndex: 5, background: "rgba(201,162,39,.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ background: metalEdge(tier, 140), color: "#0B0B0C", borderRadius: "50%", width: 40, height: 40, display: "grid", placeItems: "center", boxShadow: "0 3px 10px rgba(0,0,0,.5)" }}><Check size={24} /></span>
        </span>
      )}
    </CardFrame>
  );
}



function PlayerCard({ person, format = "portrait", themeKey = "onyx", selected, onClick, actions, nameAs }) {
  const t = THEMES[themeKey] || THEMES.onyx;
  /* v17.16: the metal comes from the person (Alexander Gold, Bruno Silver, everyone else Bronze), never from the card theme. */
  const tier = cardMetal17(person, themeKey);
  const m = metalOf(tier);
  const { sub, ink } = t;
  const top3 = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean).slice(0, 3).map(capWords17);
  const professions = top3(person.professions || person.profession);
  const langs = (person.languages || []).slice(0, 5);
  const dot = "  ·  ";
  const address = `${CARD_DOMAIN}/${pc17Tag(person.tag)}`;
  const Emblem = ({ size }) => React.createElement("span", {
    style: { position: "absolute", top: size > 26 ? 9 : 7, right: size > 26 ? 9 : 7, zIndex: 4 }
  }, React.createElement(FFLogo, {
    size,
    tier
  }));
  if (format === "mini") {
    return React.createElement(CardFrame, {
      tier,
      theme: t,
      onClick,
      selected,
      hair: false,
      style: { padding: "11px 12px", display: "flex", gap: 11, alignItems: "center" }
    }, React.createElement(Emblem, {
      size: 20
    }), React.createElement(Portrait, {
      src: person.photo,
      name: person.name,
      size: 42,
      tier,
      ink: m.ink
    }), React.createElement("div", {
      style: { minWidth: 0, flex: 1, paddingRight: 22 }
    }, React.createElement("div", {
      className: "ff-display",
      style: { color: ink, fontSize: 12.5, letterSpacing: ".1em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
    }, person.name), React.createElement("div", {
      style: { fontFamily: "var(--sans)", fontWeight: 600, color: t.dark ? sub : "#4A4134", fontSize: 12.5, lineHeight: 1.3 }
    }, professions[0]), React.createElement("div", {
      style: { fontFamily: "var(--sans)", fontSize: 10, fontWeight: 600, color: sub, marginTop: 3 }
    }, address)));
  }
  if (format === "landscape") {
    return React.createElement(CardFrame, {
      tier,
      theme: t,
      onClick,
      selected,
      style: { padding: "13px 12px", display: "flex", gap: 12, alignItems: "center" }
    }, React.createElement(Emblem, {
      size: 22
    }), React.createElement(Portrait, {
      src: person.photo,
      name: person.name,
      size: 52,
      tier,
      ink: m.ink
    }), React.createElement("div", {
      style: { minWidth: 0, flex: 1, paddingRight: 20 }
    }, React.createElement("div", {
      className: "ff-display",
      style: { color: ink, fontSize: 14, letterSpacing: ".11em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }
    }, person.name), React.createElement("div", {
      style: { fontFamily: "var(--sans)", fontWeight: 600, color: t.dark ? sub : "#4A4134", fontSize: 13, lineHeight: 1.35 }
    }, professions.join(dot)), React.createElement("div", {
      style: { display: "flex", alignItems: "center", gap: 9, marginTop: 6 }
    }, React.createElement(IconRow, {
      kinds: ["profession", "skills", "interests", "location"],
      color: sub
    }), React.createElement("span", {
      style: { width: 1, height: 11, background: t.rule }
    }), React.createElement("span", {
      style: { fontSize: 12 }
    }, langs.slice(0, 3).map((l) => React.createElement("span", {
      key: l,
      style: { marginRight: 3 }
    }, React.createElement(LangFlag, {
      lang: l
    })))), React.createElement("span", {
      style: { marginLeft: "auto", fontFamily: "var(--sans)", fontSize: 10, fontWeight: 600, color: sub }
    }, address))));
  }
  const large = format !== "portrait";
  const face = <PlayerFace17 person={person} large={large} themeKey={themeKey} tier={tier} onClick={onClick} selected={selected} nameAs={nameAs} />;
  if (!large)
    return face;
  return React.createElement("div", {
    style: { maxWidth: 372, margin: "0 auto" }
  }, face, actions && React.createElement(ProfileActions, {
    actions
  }));
}



/* Book · Review · Join — under a card, or at the foot of a public profile. */
function ProfileActions({ actions }) {
  const { state, dispatch } = useStore();
  /* Phase 1: Book waits for FF Party / FF Staff; Review and Join work. */
  const book = PHASE1.bookingsLive
    ? { key: "book", label: "Book", Icon: Calendar, onClick: actions.onBook }
    : { key: "book", label: "Book · 2027", Icon: Lock, soon: true, onClick: () => dispatch({ type: "TOAST", toast: "Booking opens with FF Party and FF Staff — coming in 2027" }) };
  const review = { key: "review", label: "Review", Icon: Award, onClick: actions.onReview };
  const join = { key: "join", label: "Join FireFlair", Icon: Plus, onClick: actions.onJoin };
  const btn = (a, cls) => (
    <button key={a.key} className={"ff-pc-act" + (cls ? " " + cls : "")} onClick={a.onClick} aria-disabled={a.soon || undefined} style={a.soon ? { opacity: .7 } : undefined}>
      <a.Icon size={cls ? 20 : 16} strokeWidth={1.7} /><span>{a.label}</span>
    </button>
  );
  /* Someone who is not signed in sees Join FireFlair first and largest, then Book and Review. */
  if (!(state.auth && state.auth.status === "signedIn")) {
    return (
      <div className="ff-pc-acts ff-pc-acts17">
        {btn(join, "big")}
        {btn(book)}
        {btn(review)}
      </div>
    );
  }
  return (
    <div className="ff-pc-acts">
      {[book, review, { ...join, label: "Join" }].map(a => btn(a))}
    </div>
  );
}



/* ---- INFORMATION CARD ---------------------------------------------------
   One reusable component for every category — skill, interest, language,
   qualification, experience, and whatever gets added later. It renders the
   fields a category declares and nothing more. Substantial in scale, close
   to the Profile Card, because the deeper content lives HERE. */
/* Attribute info cards take their metal from their place in the row:
   primary = gold, secondary = silver, tertiary (profile only) = bronze. */
const RANK_TIER = { primary: "gold", secondary: "silver", tertiary: "bronze" };


const RANK_THEMES = {
  gold:   { ...THEMES.onyx, bg: "linear-gradient(168deg,#3A3018,#14110A)", sub: "#E6D39C", rule: "rgba(232,199,94,.30)", accent: "#E8C75E" },
  silver: { ...THEMES.onyx, bg: "linear-gradient(168deg,#34373D,#121316)", sub: "#D3D7DD", rule: "rgba(214,219,226,.26)", accent: "#D4D8DE" },
  bronze: { ...THEMES.onyx, bg: "linear-gradient(168deg,#33200F,#130B05)", sub: "#E4BC93", rule: "rgba(200,126,62,.32)", accent: "#C98A4F" },
};


/* v16.12 — Information Cards are square with rounded corners, cleaner and
   closer to Apple's style: label at the top, the title, then either the
   description or up to four images (no icons to draw). The rank metal
   (gold, silver, bronze) stays. Profession Cards keep their level top right. */
function InformationCard({ record, def, themeKey = "onyx", onClick, width, compact, highlight, rank, editable, pub }) {
  const tier = !record.proposed && RANK_TIER[rank] || "standard";
  const t = tier !== "standard" ? RANK_THEMES[tier] : (THEMES[themeKey === "slate" ? "onyx" : themeKey] || THEMES.onyx);
  const hasDoc = !!(record.document && record.document.name);
  const media = (record.media || []).slice(0, def.maxMedia || MAX_MEDIA_PER_CARD);
  const isProf = def.icon === "profession";
  /* A visitor never sees an empty profession box: a blank description shows the profession's default one (v17.9.5). */
  const desc = (record.description || "").trim() || (isProf && !editable && !record.proposed ? professionDefaultDesc(record.name, record.displayCategory) : "");
  const det = record.details || null;
  const sub = detailsLine(det, record.proficiency, record.name);
  const isCocktail = catHas(def, "ingredients");
  const body = isCocktail ? (keyIngredients(record, 5).join(" · ") || desc) : desc;
  const verified = pub === "d" && record.verified === true;   // only from real verification data
  const isLang = def.icon === "languages";

  return (
    <CardFrame as={onClick ? "button" : "div"} tier={tier} theme={t} ratio={compact || (pub && pub !== "c") ? undefined : "1 / 1"} className={`sq${pub ? ` pub pub-${pub}` : ""}`} onClick={onClick}
      style={{ width: pub ? "100%" : (width || CARD_W.info), padding: pub ? undefined : "11px 11px 11px", display: "flex", flexDirection: "column", textAlign: "center" }}>
      <div className="ff-ic2-top">
        <span className="side" style={{ color: t.accent }}>
          {!record.proposed && highlight && (rank === "primary" ? <Star size={13} fill="currentColor" /> : <Check size={13} strokeWidth={2.4} />)}
        </span>
        <span className="lbl" style={{ color: t.sub }}>{def.cardLabel || def.singular}</span>
        <span className="side r">
          {record.proposed ? <Pill tone="warn">New</Pill>
            : isProf ? (
              <span className="ff-proflevel inline" title={record.level ? `Level ${record.level} of 5 · ${professionLevelTitle(record.level)}` : "Level not set yet"}
                aria-label={record.level ? `Level ${record.level} of 5` : "Level not set"} style={{ "--lv-on": t.accent }}>
                {[1, 2, 3, 4, 5].map(i => <i key={i} className={i <= (record.level || 0) ? "on" : ""} />)}
              </span>
            ) : editable ? <Pencil size={12} color={t.sub} /> : null}
        </span>
      </div>

      <div className="ff-ic2-title" style={{ color: t.ink }}>{isLang && pub && <LangFlag lang={record.name} />}{record.name}</div>
      {pub === "r" && record.rating > 0 && <div className="ff-ic2-stars" role="img" aria-label={`${record.rating} out of 5`} style={{ color: t.accent }}>{"★".repeat(record.rating)}<span style={{ opacity: .3 }}>{"★".repeat(Math.max(0, 5 - record.rating))}</span></div>}
      {record.subline && <div className="ff-ic2-sub ff-ic2-when" style={{ color: t.sub }}>{record.subline}</div>}
      {sub && <div className="ff-ic2-sub" style={{ color: t.sub }}>{sub}</div>}
      {isCocktail && record.glass && <div className="ff-ic2-sub ff-ic2-glass" style={{ color: t.sub }}><GlassIcon glass={record.glass} size={14} /> {glassLabel(record.glass)}</div>}

      {media.length > 0 ? (
        <div className={`ff-ic2-media n${media.length}`} style={{ "--ic-rule": t.rule }}>
          {media.map(m => <span key={m.id} style={{ backgroundImage: `url("${m.dataUrl}")` }} />)}
        </div>
      ) : (
        pub && !body ? null : <div className="ff-ic2-desc" style={{ color: t.ink }}>{body || <span style={{ opacity: .62 }}>{isCocktail ? "No ingredients yet." : "No description yet."}</span>}</div>
      )}
      {!pub && !record.proposed && record.source && record.source.by === "agent" && <span className="ff-way17">From your website</span>}
      {(hasDoc || verified || (isProf && record.remote)) && (
        <span className="ff-ic2-badges">
          {isProf && record.remote && <span className="ff-ic2-doc" style={{ color: t.accent, borderColor: t.rule }}><Globe size={11} strokeWidth={1.8} /> Remote</span>}
          {verified && <span className="ff-ic2-doc" style={{ color: t.accent, borderColor: t.rule }}><ShieldCheck size={11} strokeWidth={1.9} /> Verified</span>}
          {hasDoc && <span className="ff-ic2-doc" style={{ color: t.sub, borderColor: t.rule }}><FileText size={11} strokeWidth={1.7} /> Doc</span>}
        </span>
      )}
    </CardFrame>
  );
}



function HScroll({ children, label, snap }) {
  const items = React.Children.toArray(children).filter(Boolean);
  return (
    <div className={`ff-hscroll${snap ? " snapmand" : ""}`} aria-label={label}>
      {items.map((c, i) => <div className="ff-hitem" key={i}>{c}</div>)}
    </div>
  );
}



function SectionHead({ icon, title, count, action }) {
  return (
    <div className="ff-secthead">
      {icon}
      <span className="ff-h2">{title}</span>
      {count !== undefined && <span className="ff-pill">{count}</span>}
      <span className="line" />
      {action}
    </div>
  );
}



/* Section show/hide control — one component, one state map, reused by every
   horizontal card section in the app. Hides the whole category, never
   individual cards; nothing it hides is ever deleted from state. */
/* Section show/hide control — one component, one state map, reused by every
   horizontal card section in the app. Hides the whole category, never
   individual cards; nothing it hides is ever deleted from state. A small
   square containing a triangle: ▼ expanded, ▶ collapsed. */
function CategoryToggle({ sectionKey, defaultOpen = true }) {
  const { state, dispatch } = useStore();
  const v = state.categoryVisibility[sectionKey];
  const visible = v === undefined ? (defaultOpen && state.role !== "staff") : v !== false;
  return (
    <button
      onClick={() => dispatch({ type: "TOGGLE_CATEGORY", key: sectionKey, visible: !visible })}
      aria-label={visible ? "Hide this section" : "Show this section"}
      title={visible ? "Hide" : "Show"}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        width: 26, height: 26, flex: "none",
        border: "1px solid var(--gold-dk)", borderRadius: 8, background: visible ? "rgba(201,162,39,.08)" : "transparent",
        color: "var(--gold-dk)",
      }}>
      <svg width="9" height="9" viewBox="0 0 10 10" style={{ transform: visible ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s ease" }}>
        <path d="M0 2 L10 2 L5 9 Z" fill="currentColor" />
      </svg>
    </button>
  );
}




const CARD_W = {
  player: "clamp(208px, 62vw, 240px)",
  tile: "clamp(120px, 34vw, 142px)",
  booking: "clamp(230px, 74vw, 272px)",
  org: "clamp(252px, 80vw, 300px)",
  info: "clamp(156px, 45vw, 186px)",
  svcsq: "clamp(218px, 62vw, 248px)",
  question: "clamp(176px, 52vw, 204px)",
  venue: "clamp(260px, 82vw, 320px)",
  poster: "clamp(282px, 84vw, 330px)",
};



function PlayerTile({ person, onClick, selected }) {
  return (
    <div style={{ width: CARD_W.player, position: "relative" }} data-pr17={person.id}>
      <PlayerCard person={person} format="portrait" themeKey={person.theme || "paper"} onClick={onClick} selected={selected} />
    </div>
  );
}




/* ---- ORGANISATIONS ------------------------------------------------------
   Companies and venues are NOT playing cards. They use a landscape
   composition everywhere they appear, so an organisation never reads as a
   person. Same family — coin, tag, tier metal, rules — different shape. */
function OrgCard({ org, kindLabel, onClick, width }) {
  const t = THEMES.onyx;
  const m = metalOf(org.tier);
  const Mark = kindLabel === "Company" ? Briefcase : kindLabel === "Team" ? Users : MapPin;
  return (
    <CardFrame as={onClick ? "button" : "div"} tier={org.tier} theme={t} onClick={onClick}
      style={{ width: width || CARD_W.org, padding: "12px 13px", display: "flex", gap: 12, alignItems: "center", textAlign: "left", minHeight: 96 }}>
      <span className="ff-label" style={{ position: "absolute", top: 8, left: 13, fontSize: 6.5, letterSpacing: ".22em", color: t.sub, zIndex: 4 }}>{kindLabel}</span>
      <span style={{ position: "absolute", top: 7, right: 9, zIndex: 4 }}><FFLogo size={19} tier={org.tier} /></span>

      <span style={{
        width: 46, height: 46, flex: "none", borderRadius: 3, display: "grid", placeItems: "center",
        background: "rgba(255,255,255,.05)", border: `1px solid ${m.hair}`, marginTop: 8,
      }}>
        <Mark size={21} color={t.sub} strokeWidth={1.4} />
      </span>

      <span style={{ minWidth: 0, flex: 1, marginTop: 8 }}>
        <span className="ff-display" style={{ display: "block", color: t.ink, fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{org.name}</span>
        <span className="ff-serif" style={{ display: "block", color: t.sub, fontStyle: "normal", fontSize: 12.5, marginTop: 2, lineHeight: 1.25 }}>{org.kind}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 7, paddingTop: 6, borderTop: `1px solid ${t.rule}` }}>
          <MapPin size={10} color={t.sub} strokeWidth={1.6} />
          <span style={{ fontSize: 9, color: t.sub, letterSpacing: ".06em" }}>{org.area}</span>
          {org.staffCount && <span style={{ fontSize: 9, color: t.sub, letterSpacing: ".06em" }}>· {org.staffCount} staff</span>}
          <span style={{ marginLeft: "auto", fontFamily: "var(--display)", fontSize: 8.5, letterSpacing: ".1em", color: t.sub }}>{CARD_DOMAIN}/{pc17Tag(org.tag)}</span>
        </span>
      </span>
    </CardFrame>
  );
}






const ENG_LABEL = {
  requested: "Availability requested", available: "Available", unavailable: "Declined", discuss: "Discuss first", withdrawn: "Withdrawn", not_selected: "Not selected", cancelled_pro: "Cancelled by professional", cancelled_biz: "Cancelled by the business",
  expired: "No reply — expired", confirmed: "Confirmed", completed: "Work completed",
  signed_off: "Signed off", paid: "Closed",
};


const ENG_TONE = {
  requested: "warn", available: "ok", unavailable: "bad", expired: "bad", discuss: "warn", withdrawn: "bad", not_selected: "bad", cancelled_pro: "bad", cancelled_biz: "bad",
  confirmed: "gold", completed: "gold", signed_off: "ok", paid: "ok",
};


/* Time left on a request's response window, e.g. "47h 12m left". */
function timeLeft(expiresAt) {
  const ms = (expiresAt || 0) - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / 36e5), m = Math.floor((ms % 36e5) / 6e4);
  return `${h}h ${String(m).padStart(2, "0")}m left`;
}





function useDirectory() {
  const { state } = useStore();
  const base = state.profile.live ? [meAsStaff(state.profile, state.session), ...state.directory] : state.directory;
  /* Network grouping comes from each person's top profession (v1.6). v17.48: groups = every category of their top 3
     public professions (best first, each with the profession that put them there); group stays the top one. */
  const myCats = {};
  recsOf(state.profile, "professions").filter(r => !r.proposed && r.displayCategory).forEach(r => { myCats[String(r.name).toLowerCase()] = r.displayCategory; });
  return adminPeople17(state, base).map(p => {
    const cats = p.id === "me" ? myCats : null;
    return { ...p, group: personCategory(p), groups: personGroups(p, cats), profs17: personProfs17(p, cats) };
  });
}



/* ==========================================================================
   INFORMATION CARD EDITOR
   Opens the full record behind a Profile Card entry. Renders only the fields
   the category declares, so qualifications get documents, languages get
   proficiency, and nothing carries fields it has no use for.
   ========================================================================== */
/* ==========================================================================
   REVIEW SHEET
   Written about a connection, stored centrally against their id, and surfaced
   on their profile as a Review information record.
   ========================================================================== */
/* Add-to-Apple-Wallet button — same shape wherever it appears, on a profile
   card or a booking card. Honest about the adapter status rather than
   pretending a pass downloads. */
/* ==========================================================================
   FFAI — one shared chat-style entry point.
   Reused wherever the app needs "tell us what you're looking for": FF Staff
   today, FF Team/FF Party/FF VIP later. It wraps the EXISTING search logic
   (directory filtering by name/skill/area) rather than replacing it, and
   offers the existing event/shift creation as quick actions for anyone who'd
   rather describe a booking than search. No real language model is wired up
   here — a typed line either matches people directly (search) or is handed
   to the person as a prompt to create an event/service card, honestly, same
   pattern as the CV and Wallet adapters elsewhere in the app.
   ========================================================================== */
/* One FFAI component for every page; each page passes its own title and
   purpose (Home: Welcome to FireFlair, Profile: Tell us about yourself…).
   The microphone is always part of the input: speech becomes text in the
   field, the person checks or edits it, then sends it. `multiline` gives a
   longer guided entry with a submit button; `children` renders the page's
   own result (e.g. Profile's proposed information) under the input. */
function FFAI({ query, onQuery, onSubmit, onEvent, onShift, placeholder, context = "FireFlair", title, titleAs, purpose, actions, hero = false, multiline = false, submitLabel = "Go", note, children, tint = true, coinSize, compact = false, bare, chat, noMicStatus, plain, tagIcon }) {
  const [val, setVal] = useState(query || "");
  const [listening, setListening] = useState(false);
  const [micMsg, setMicMsg] = useState(null);
  const recRef = useRef(null);
  const valRef = useRef(val);
  valRef.current = val;
  useEffect(() => setVal(query || ""), [query]);
  useEffect(() => () => { if (recRef.current) recRef.current.stop(); }, []);
  const looksLikeBooking = /\b(need|looking for|wedding|event|shift|hire|staff|party|corporate)\b/i.test(val) && val.trim().split(/\s+/).length > 3;

  const change = (v) => { setVal(v); if (onQuery) onQuery(v); };
  const { state: ffState, dispatch: ffDispatch } = useStore();
  const isBare = bare === undefined ? (!multiline && !compact) : bare;
  const chatOn = chat === undefined ? (!multiline && !compact) : chat;
  const [chatMsgs, setChatMsgs] = useState([]);
  const converse = (text, it) => setChatMsgs(m => [...m, { role: "user", text }, { role: "ai", ...ffaiReply(it, text) }]);
  const chatAct = (a) => {
    if (a.ask) { converse(a.ask, ffaiIntent(a.ask) || "unknown"); return; }
    if (a.go === "network") { if (onQuery && a.q) onQuery(a.q); ffDispatch({ type: "NET_QUERY", q: a.q || "" }); ffDispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); }
    else if (a.go === "booking") goBookingSection(ffDispatch, a.id);
    else if (a.go === "profile") { if (ffState.role !== "team") ffDispatch({ type: "ROLE", role: "team" }); ffDispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); }
    else if (a.go === "next") goHomeSection(ffDispatch, "ff-pl-own");
  };
  const submit = () => {
    const v = val.trim();
    if (!v) return;
    if (chatOn) {
      const it = ffaiIntent(v);
      if (it) {
        converse(v, it);
        if (it !== "find") { setVal(""); if (onQuery) onQuery(""); }
        return;
      }
    }
    if (onSubmit) onSubmit(v); else if (onQuery) onQuery(v);
  };
  const toggleMic = () => {
    if (listening) { if (recRef.current) recRef.current.stop(); return; }
    if (!SPEECH_ADAPTER.supported()) { setMicMsg(SPEECH_ERRORS.unsupported); return; }
    recRef.current = SPEECH_ADAPTER.start({
      onText: (t) => change((valRef.current ? valRef.current.trim() + " " : "") + t),
      onEnd: () => { setListening(false); setMicMsg(m => (m && m.startsWith("Listening") ? "Check the text, edit anything, then send it." : m)); },
      onError: (code) => { setListening(false); setMicMsg(SPEECH_ERRORS[code] || "Voice input stopped. Try again, or type instead."); },
    });
    if (recRef.current) { setListening(true); setMicMsg("Listening… speak now."); }
  };

  const mic = (style) => (
    <button type="button" className={`ff-mic${listening ? " on" : ""}`} onClick={toggleMic} style={style}
      aria-pressed={listening} aria-label={listening ? "Stop listening" : "Speak instead of typing"} title={listening ? "Stop" : "Speak"}>
      <MicGlyph size={18} />
    </button>
  );

  const canSend = !!val.trim() && !listening;
  const sendLabel = submitLabel === "Go" ? "Send" : submitLabel;
  const taRef = useRef(null);
  useEffect(() => { const el = taRef.current; if (!el) return; if (!val) { el.style.height = ""; return; } el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 140) + "px"; }, [val]);
  return (
    <div className={`ff-frame ff-ai ${tint ? "ff-ffai-tint" : "ff-lattice"}${hero ? " hero" : ""}${compact ? " compact" : ""}${isBare ? " bare" : ""}${plain ? " plain" : ""}${chatMsgs.length ? " chatting" : ""}`}>
      {!plain && <Corners />}
      {!isBare && <div className="ff-ai-head">
        <Coin size={compact ? 22 : 26} tier="gold" />
        {React.createElement(titleAs || "span", { className: "ff-display ff-ai-title" }, title || `Welcome to ${context}`)}
        <span className="ff-body ff-muted ff-ai-purpose" title={purpose || undefined}>{purpose || "Tell us what you're looking for."}</span>
      </div>}
      <div className="ff-ai-row">
        {mic({})}
        {isBare && !tagIcon && <span className="ff-ai-tag" aria-hidden="true"><Coin size={20} tier="gold" /></span>}
        <textarea ref={taRef} className={`ff-input ff-ai-in${(placeholder || "").length > 36 ? " tall" : ""}`} rows={1} value={val} aria-label={title || "FireFlair"}
          placeholder={placeholder || "Name, skill, area, or describe your event…"}
          onChange={(e) => change(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && (!multiline || e.metaKey || e.ctrlKey)) { e.preventDefault(); submit(); } }} />
        <button type="button" className="ff-ai-send" disabled={!canSend} onClick={submit} aria-label={sendLabel} title={sendLabel}>
          <Send size={16} strokeWidth={2} /><span className="ff-sr">{sendLabel}</span>
        </button>
      </div>
      {micMsg && !noMicStatus && <p className="ff-body" role="status" style={{ fontSize: 11.5, margin: "6px 0 0", color: listening ? "var(--ox)" : "#6A6253" }}>{micMsg}</p>}
      {chatMsgs.length > 0 && <FFAIChat msgs={chatMsgs} onAct={chatAct} onClose={() => setChatMsgs([])} />}
      {looksLikeBooking && (onEvent || onShift) && (
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>Sounds like a booking —</span>
          {onEvent && <Btn variant="sm" onClick={onEvent}><Calendar size={12} /> Create event</Btn>}
          {onShift && <Btn variant="sm" onClick={onShift}><Clock size={12} /> Create shift</Btn>}
        </div>
      )}
      {!val && !chatMsgs.length && actions && actions.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {actions.map(a => <Btn key={a.label} variant={a.primary ? "sm primary" : "sm"} onClick={a.onClick}>{a.label}</Btn>)}
        </div>
      )}
      {!val && !chatMsgs.length && (onEvent || onShift) && (
        <div style={{ display: "grid", gridTemplateColumns: onEvent && onShift ? "1fr 1fr" : "1fr", gap: 8, marginTop: 8 }}>
          {onEvent && <Btn variant="primary" onClick={onEvent}><Calendar size={14} /> Tell us about an event</Btn>}
          {onShift && <Btn onClick={onShift}><Clock size={14} /> Describe a shift</Btn>}
        </div>
      )}
      {children}
      {note && !isBare && <p className="ff-body ff-muted ff-ai-note">{note}</p>}
    </div>
  );
}
