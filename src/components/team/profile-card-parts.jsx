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


function PlayerCard({ person, format = "portrait", themeKey = "onyx", selected, onClick, actions, nameAs }) {
  const t = THEMES[themeKey] || THEMES.onyx;
  const tier = themeKey === "silver" || themeKey === "gold" ? themeKey : person.tier || "standard";
  const m = metalOf(tier);
  const { sub, ink } = t;
  const top3 = (v) => (Array.isArray(v) ? v : v ? [v] : []).filter(Boolean).slice(0, 3);
  const professions = top3(person.professions || person.profession);
  const skills = top3(person.skills);
  const interests = top3(person.interests);
  const locations = person.base ? [person.base] : top3(person.locations);
  const langs = (person.languages || []).slice(0, 5);
  const dot = "  ·  ";
  const address = `${CARD_DOMAIN}/${person.tag}`;
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
  const acc = t.accent || sub;
  const edge = t.edge || t.rule;
  const panelBg = t.dark ? "rgba(0,0,0,.30)" : "rgba(255,255,255,.55)";
  const years = person.years ? [`${person.years}+ years`] : [];
  const experience = [...years, ...person.experience || []].slice(0, 2);
  const full = format !== "portrait";
  const rowDefs = full ? [
    ["experience", "Experience", experience],
    ["roles", "Roles", professions.length > 1 ? professions : []],
    ["skills", "Skills", skills],
    ["interests", "Interests", interests],
    ["locations", person.base ? "Based in" : "Locations", locations]
  ] : [["skills", "Skills", skills], ["interests", "Interests", interests], ["locations", person.base ? "Based in" : "Locations", locations]];
  const rows = rowDefs.filter((r) => r[2].length);
  const PC_ICON = { experience: Briefcase, roles: Users, skills: Star, interests: Heart, locations: MapPin, languages: MessageSquare };
  const FILLED = { skills: true, interests: true };
  const sz = full ? { pad: 4, photo: 32, name: 7.4, title: 4.2, row: 9.2, ico: 4.3, icoW: 10.5, lbl: 2.45, lblW: 21.5, val: 3.95, flag: 4.4, url: 9.4, urlF: 3.5, coin: 12.5 } : { pad: 3, photo: 35, name: 8, title: 4.9, row: 10.6, ico: 5.2, icoW: 9.5, lbl: 0, val: 5.1, flag: 6.2, url: 10.8, urlF: 4.4, coin: 14 };
  const titleInk = t.dark ? acc : "#6A4F12";
  const cq = (n) => `${n}cqw`;
  const Ico = ({ kind }) => {
    const I = PC_ICON[kind];
    return React.createElement("span", {
      className: "ff-pc-ico",
      style: { width: cq(sz.icoW) }
    }, React.createElement("span", {
      style: { width: cq(sz.ico), height: cq(sz.ico), display: "block" }
    }, React.createElement(I, {
      size: "100%",
      color: "#D9B24A",
      strokeWidth: 1.8,
      fill: FILLED[kind] ? "#D9B24A" : "none"
    })));
  };
  const Vals = ({ items }) => React.createElement(FitList17, {
    items,
    accent: acc
  });
  const cols = full ? `${sz.icoW}cqw ${sz.lblW}cqw minmax(0,1fr)` : `${sz.icoW}cqw minmax(0,1fr)`;
  const Row = ({ kind, label, children }) => React.createElement("div", {
    className: "ff-pc-row",
    style: { gridTemplateColumns: cols, height: cq(sz.row), borderColor: t.rule }
  }, React.createElement(Ico, {
    kind
  }), full && React.createElement("span", {
    className: "ff-pc-lbl",
    style: { fontSize: cq(sz.lbl), color: t.dark ? sub : "#5C513F" }
  }, label), React.createElement("span", {
    className: "ff-pc-val",
    style: { fontSize: cq(sz.val), color: ink }
  }, children));
  const Flags = () => langs.slice(0, 5).map((l) => React.createElement("span", {
    key: l,
    className: "ff-pc-flag",
    style: { fontSize: cq(sz.flag), borderColor: edge, background: t.dark ? "rgba(255,255,255,.06)" : undefined }
  }, React.createElement(LangFlag, {
    lang: l
  })));
  const face = React.createElement(CardFrame, {
    premium: true,
    tier,
    theme: t,
    ratio: "5 / 7",
    onClick,
    selected,
    style: { width: "100%", padding: 0 }
  }, full && React.createElement("span", {
    className: "ff-pc-plate"
  }, "Profile Card"), React.createElement("span", {
    className: "ff-pc-coin",
    style: { width: cq(sz.coin), height: cq(sz.coin) }
  }, React.createElement(FFLogo, {
    size: "100%",
    tier
  })), React.createElement("div", {
    className: "ff-pc-in"
  }, React.createElement("div", {
    style: {
      marginTop: cq(full ? 5 : 4),
      width: cq(sz.photo),
      aspectRatio: "1",
      flex: "none",
      borderRadius: "50%",
      padding: cq(sz.photo * 0.04),
      background: metalEdge(tier, 145),
      boxShadow: "0 1.4cqw 3.6cqw rgba(0,0,0,.38), inset 0 0 0 1px rgba(255,255,255,.35)"
    }
  }, React.createElement("div", {
    style: {
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      overflow: "hidden",
      position: "relative",
      border: "1px solid rgba(8,8,10,.85)",
      display: "grid",
      placeItems: "center",
      background: person.photo ? `url("${person.photo}") center/cover` : "radial-gradient(circle at 38% 30%,#26262B,#0A0A0C)"
    }
  }, !person.photo && React.createElement("span", {
    style: { fontFamily: "var(--display)", color: m.ink, fontSize: cq(sz.photo * 0.3) }
  }, (person.name || "").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()), React.createElement("span", {
    style: { position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(64% 46% at 30% 16%, rgba(255,255,255,.18), transparent 62%)" }
  }))), React.createElement(FitText17, {
    as: nameAs || "div",
    size: sz.name,
    className: "ff-pc-name",
    style: { color: ink, marginTop: cq(full ? 3.4 : 3.2), ...nameAs ? { marginBottom: 0, marginInline: 0 } : {} }
  }, person.name), React.createElement(FitText17, {
    size: sz.title,
    className: "ff-pc-title",
    style: { color: titleInk, marginTop: cq(full ? 1.4 : 1.1) }
  }, professions[0] || "Professional"), React.createElement("div", {
    className: "ff-pc-rule",
    style: { margin: full ? "2.4cqw 0 3cqw" : "2.2cqw 0 2.6cqw" }
  }, React.createElement(ProfessionMarks, {
    professions,
    hasCar: person.hasCar,
    full,
    color: acc
  })), React.createElement("div", {
    className: "ff-pc-panel",
    style: { borderColor: edge, background: panelBg }
  }, rows.map(([k, label, vals]) => React.createElement(Row, {
    key: k,
    kind: k,
    label
  }, React.createElement(Vals, {
    items: vals
  }))), full && langs.length > 0 && React.createElement(Row, {
    kind: "languages",
    label: "Languages"
  }, React.createElement(Flags, null))), !full && langs.length > 0 && React.createElement("div", {
    style: { marginTop: "2.6cqw", display: "flex", justifyContent: "center" }
  }, React.createElement(Flags, null)), React.createElement("div", {
    className: "ff-pc-bar",
    style: { height: cq(sz.url), background: t.dark ? "rgba(0,0,0,.45)" : "#141416", borderTop: `1px solid ${t.rule}` }
  }, React.createElement("span", {
    style: { width: cq(sz.url - 3.4), height: cq(sz.url - 3.4), display: "block", flex: "none" }
  }, React.createElement(FFLogo, {
    size: "100%",
    tier
  })), full && React.createElement(Wordmark, {
    size: cq(3.5)
  }), React.createElement(FitText17, {
    as: "span",
    size: sz.urlF,
    className: "ff-pc-baru"
  }, address))), selected && React.createElement("span", {
    style: { position: "absolute", inset: 0, zIndex: 5, background: "rgba(201,162,39,.14)", display: "flex", alignItems: "center", justifyContent: "center" }
  }, React.createElement("span", {
    style: { background: metalEdge(tier, 140), color: "#0B0B0C", borderRadius: "50%", width: 40, height: 40, display: "grid", placeItems: "center", boxShadow: "0 3px 10px rgba(0,0,0,.5)" }
  }, React.createElement(Check, {
    size: 24
  }))));
  if (!full)
    return face;
  return React.createElement("div", {
    style: { maxWidth: 372, margin: "0 auto" }
  }, face, actions && React.createElement(ProfileActions, {
    actions
  }));
}



/* Book · Review · Join — under a card, or at the foot of a public profile. */
function ProfileActions({ actions }) {
  const { dispatch } = useStore();
  /* Phase 1: Book waits for FF Party / FF Staff; Review and Join work. */
  const book = PHASE1.bookingsLive
    ? { key: "book", label: "Book", Icon: Calendar, onClick: actions.onBook }
    : { key: "book", label: "Book · 2027", Icon: Lock, soon: true, onClick: () => dispatch({ type: "TOAST", toast: "Booking opens with FF Party and FF Staff — coming in 2027" }) };
  return (
    <div className="ff-pc-acts">
      {[
        book,
        { key: "review", label: "Review", Icon: Award, onClick: actions.onReview },
        { key: "join", label: "Join", Icon: Plus, onClick: actions.onJoin },
      ].map(a => (
        <button key={a.key} className="ff-pc-act" onClick={a.onClick} aria-disabled={a.soon || undefined} style={a.soon ? { opacity: .7 } : undefined}>
          <a.Icon size={16} strokeWidth={1.7} /><span>{a.label}</span>
        </button>
      ))}
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
  const media = (record.media || []).slice(0, MAX_MEDIA_PER_CARD);
  const desc = (record.description || "").trim();
  const det = record.details || null;
  const sub = detailsLine(det, record.proficiency, record.name);
  const isProf = def.icon === "profession";
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
          <span style={{ marginLeft: "auto", fontFamily: "var(--display)", fontSize: 8.5, letterSpacing: ".1em", color: t.sub }}>{CARD_DOMAIN}/{org.tag}</span>
        </span>
      </span>
    </CardFrame>
  );
}


const VenueCard = ({ venue, onClick, width }) => <OrgCard org={venue} kindLabel="Venue" onClick={onClick} width={width} />;




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
  /* Network grouping comes from each person's top profession (v1.6). */
  return adminPeople17(state, base).map(p => ({ ...p, group: personCategory(p) }));
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
    else if (a.go === "next") goHomeSection(ffDispatch, "ff-coming");
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
