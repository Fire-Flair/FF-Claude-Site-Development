/* src/components/team/network.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   NETWORK → REVIEW → TEAM (v17.22). On someone else's profile a signed-in member sees ONE relationship slot that grows:
   Add to network (one tap) → the review form in place, once → Invite to your team (one tap) → Invitation sent → On your team.
   Removing, the prototype "they accept" preview and a skipped review (Write a review) live in the small ⋯ menu beside it.
   A signed-out visitor sees one row: Join team, with the green Share icon beside it. The review form is ReviewForm17 (profile-from-text.jsx).
   ========================================================================== */
/* A button label that wraps between words and, if one word still does not fit, gets a smaller font. Never splits a word. */
function FitLabel17({ children }) {
  const ref = React.useRef(null);
  const key = typeof children === "string" ? children : React.Children.toArray(children).join("");
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (el.scrollWidth > el.clientWidth + 0.5 && fs > 9 && n++ < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; }
    };
    fit();
    let ro = null;
    const host = el.parentElement;
    if (window.ResizeObserver && host) { let w = host.clientWidth; ro = new ResizeObserver(() => { const nw = host.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(host); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key]);
  return <span ref={ref} className="ff-fit17">{children}</span>;
}


/* The small ⋯ menu beside the relationship button. Closes on an outside tap and on Escape. */
const MoreDots17 = lucideIcon("MoreHorizontal");


function RelMenu17({ items }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const out = (e) => { if (wrap.current && !wrap.current.contains(e.target)) setOpen(false); };
    const key = (e) => { if (e.key === "Escape") { setOpen(false); if (btn.current) btn.current.focus(); } };
    document.addEventListener("pointerdown", out);
    document.addEventListener("keydown", key);
    const first = wrap.current && wrap.current.querySelector("[role=menuitem]");
    if (first) first.focus();
    return () => { document.removeEventListener("pointerdown", out); document.removeEventListener("keydown", key); };
  }, [open]);
  if (!items.length) return null;
  return (
    <div className="ff-rs17-more" ref={wrap}>
      <button ref={btn} type="button" className="ff-rs17-dots" aria-label="More" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <MoreDots17 size={20} aria-hidden="true" />
      </button>
      {open && (
        <div className="ff-rs17-menu" role="menu">
          {items.map(it => (
            <button key={it.label} type="button" role="menuitem" onClick={() => { setOpen(false); it.go(); }}>{it.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}


/* The one relationship slot on someone else's profile, for a signed-in member: Join team (you ask to join their team; it
   needs their acceptance). There is no Add to network for people. The review form (ReviewForm17) is offered once, in place. */
function RelSlot17({ person }) {
  const { state, dispatch } = useStore();
  const [offer, setOffer] = useState(false);
  useEffect(() => { setOffer(false); }, [person.id]);
  const first = reviewName17(person);
  const status = connStatus17(state, person.id);
  const reviewed = (state.reviews || []).some(r => r && r.byId === "me" && r.aboutId === person.id);
  const askIn = teamAsksWaiting17(state).find(x => x.fromId === person.id);
  const invite = (state.teamInvites || []).filter(i => i.personId === person.id && i.status === "pending").slice(-1)[0];
  const toast = (t) => dispatch({ type: "TOAST", toast: t });
  if (offer) {
    return (
      <div className="ff-rs17-card">
        <button type="button" className="x" aria-label="Skip" onClick={() => setOffer(false)}><X size={18} aria-hidden="true" /></button>
        <ReviewForm17 person={person} onDone={() => setOffer(false)} />
      </div>
    );
  }
  let main;
  if (status === "none" && askIn) {
    main = <Btn variant="gold wide" onClick={() => { dispatch({ type: "TEAM_ASK_REPLY", ask: askIn, accept: true }); toast(`You and ${first} are on each other's team`); if (!reviewed) setOffer(true); }}><Check size={15} aria-hidden="true" /><FitLabel17>Accept invitation</FitLabel17></Btn>;
  } else if (status === "none") {
    main = <Btn variant="gold wide" onClick={() => {
      dispatch({ type: "TEAM_INVITE", invite: { id: uid("tinv"), personId: person.id, name: person.name, tag: person.tag || null, note: person.profession || "", at: Date.now(), status: "pending", kind: "join" } });
      toast(`Request sent to ${first}`);
    }}><Users size={15} aria-hidden="true" /><FitLabel17>Join team</FitLabel17></Btn>;
  } else if (status === "pending") {
    main = <div className="ff-rs17-quiet"><Clock size={15} aria-hidden="true" /><FitLabel17>Request sent</FitLabel17></div>;
  } else {
    main = <div className="ff-rs17-quiet"><FitLabel17>On your team</FitLabel17><Check size={15} aria-hidden="true" /></div>;
  }
  /* A skipped review stays reachable from the ⋯ menu until it is written. */
  const items = [
    ...(status !== "none" && !reviewed ? [{ label: "Write a review", go: () => setOffer(true) }] : []),
    ...(status === "pending" ? [{ label: "Cancel request", go: () => { dispatch({ type: "CONN_REMOVE", id: person.id, from: "pending" }); toast("Request cancelled"); } }] : []),
    ...(status === "team" ? [{ label: "Remove from team", go: () => { dispatch({ type: "CONN_REMOVE", id: person.id, from: "team" }); toast(`${first} removed from your team`); } }] : []),
    ...(status === "pending" && invite ? [{ label: `Preview: ${first} accepts`, go: () => { dispatch({ type: "TEAM_INVITE_ACCEPT", id: invite.id }); toast(`${first} accepted · now on your team`); if (!reviewed) setOffer(true); } }] : []),
  ];
  return <div className="ff-rs17">{main}<RelMenu17 items={items} /></div>;
}


/* Your own card's Share: once the profile is complete it sends your join link (no ?r=, the code is in it). */
function MyShareBtn17({ person, onTap, icon }) {
  const { state } = useStore();
  const [open, setOpen] = useState(false);
  const tag = String((state.auth.status === "signedIn" && (state.auth.tag || state.session.tag)) || "");
  const join = !!tag && profileBasics17(state);
  return (
    <>
      <button type="button" className={"ff-csm-btn " + (icon ? "ff-pub-shico ff-pub-wa11" : "wide")} onClick={() => onTap ? onTap() : setOpen(true)} aria-label="Share my card"><WhatsAppIcon size={18} aria-hidden="true" />{" Share"}</button>
      {open ? (
        <CardShareSheet17 open onClose={() => setOpen(false)} title={SHARE_TITLE17} message={SHARE_MSG17} url={join ? inv17Link(tag) : `https://${CARD_DOMAIN}/${pc17Tag(tag)}`} noRef={join}
          fileName={(join ? "fireflair-join-" : "fireflair-") + cx17Slug(tag)}>
          <PlayerCard person={person} format="full" nameAs="div" themeKey={state.profile.theme} />
        </CardShareSheet17>
      ) : null}
    </>
  );
}


function PersonProfile() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  /* Your own profile isn't in the directory until it's shared, so "view as a
     guest" builds it from the profile itself. */
  const person = all.find(p => p.id === state.viewing)
    || (state.viewing === "me" ? { ...meAsStaff(state.profile, state.session), group: "Your profile" } : null);
  const guestOfMe = !!state.viewingAsGuest && state.viewing === "me";
  const [reviewing, setReviewing] = useState(false);
  const [asking, setAsking] = useState(false);
  const [checking, setChecking] = useState(false);
  if (!person) return null;
  const first = String(person.name || "").split(" ")[0];
  const preview = (msg) => dispatch({ type: "TOAST", toast: msg || "This is how guests see your profile" });
  const other = person.id !== "me";
  const publicView = other || guestOfMe;
  const signedIn = state.auth.status === "signedIn";
  const party = !!hireSiteOf(state).party;
  /* Join from someone's profile: they are the one who brought you in (their team invitation waits after sign-up), unless a code was already recorded. */
  const join = () => {
    dispatch({ type: "INV_REF", code: person.tag, kind: "team" });
    dispatch({ type: "VIEW", id: null });
    if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab: "profile" });
    window.scrollTo(0, 0);
  };

  /* v1.166: on FFTeam the floating Back (bottom left) is the only one; the in-page Back stays for the other sites and for your own guest preview. */
  const backBtn = true ? null : (
    <button aria-label="Back" onClick={() => rt17Back(() => dispatch({ type: "VIEW", id: null }))} className="ff-pback"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", padding: "12px 4px", marginBottom: 12,
        color: "var(--gold-dk)", border: "1px solid var(--rule)", background: "var(--paper)",
      }}>
      <ChevronLeft size={22} strokeWidth={2} />
      <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>{guestOfMe ? "Back to my profile" : "Back"}</span>
    </button>
  );
  const guestNote = guestOfMe ? <div className="ff-guestnote"><Eye size={16} /> This is your profile as a guest sees it.</div> : null;
  const shareTag = String(person.tag || cx17Slug(person.name || person.id) || "");
  const shareBtn = other && shareTag ? (
      <CardShareBtn17 title={`${person.name} on FireFlair`} url={`https://${CARD_DOMAIN}/${pc17Tag(shareTag)}`} fileName={"fireflair-" + cx17Slug(shareTag)} label="Share" className="wide" native
        render={() => <PlayerCard person={person} format="full" nameAs="div" themeKey={person.theme || "ivory"} />} />) : null;
  const myTag = signedIn ? (state.auth.tag || state.session.tag) : "";
  const shareEl = !other && !guestOfMe && myTag ? <div style={{ marginTop: 8, width: "calc(50% - 4px)", marginInline: "auto" }}><MyShareBtn17 person={person} /></div> : null;
  const askRow = (
    <div className="ff-pub-two">
      <Btn variant={party ? "" : "ghost"} onClick={() => setAsking(true)}><MessageSquare size={14} aria-hidden="true" /><FitLabel17>{party ? "Ask a question" : "Ask"}</FitLabel17></Btn>
      <Btn variant={party ? "" : "ghost"} onClick={() => setChecking(true)}><I11.CalendarCheck size={14} aria-hidden="true" /><FitLabel17>Availability</FitLabel17></Btn>
    </div>
  );
  /* All three sites: Share sits below the other buttons, centred, half the row wide. */
  const halfShare = (el) => el ? <div className="ff-share-half">{el}</div> : null;
  let actionsEl = null;
  if (guestOfMe || (other && !signedIn && !party)) {
    /* A signed-out visitor (and you, previewing your profile as a guest): full-width Back above (as before v1.6x),
       then Join team | Share (olive, WhatsApp logo), equal halves, the Profile Card's width (v1.70, Alex 18 Nov 21:56). */
    const shareIco = guestOfMe ? <MyShareBtn17 person={person} icon onTap={() => preview()} />
      : other && shareTag ? <CardShareBtn17 title={`${person.name} on FireFlair`} url={`https://${CARD_DOMAIN}/${pc17Tag(shareTag)}`} fileName={"fireflair-" + cx17Slug(shareTag)} label="Share" className="ff-pub-shico ff-pub-wa11" native
          render={() => <PlayerCard person={person} format="full" nameAs="div" themeKey={person.theme || "ivory"} />} /> : null;
    actionsEl = (<div className="ff-pub-acts ff-pub-stack">
      <div className={"ff-pub-joinrow" + (shareIco ? "" : " solo")}>
        {shareIco}
        <Btn variant="wide ff-join-mut" onClick={guestOfMe ? () => preview() : join}><FitLabel17>Join team</FitLabel17></Btn>
      </div>
    </div>);
  } else if (other && party) {
    actionsEl = (<div className="ff-pub-acts ff-pub-stack">
      <FavBtn11 person={person} wide />
      {state.role === "staff" && !person.isCompany && <LockedBtn17 variant="primary wide" icon={<Users size={14} />}>Book this person</LockedBtn17>}
      {askRow}
      <Btn variant="wide" onClick={() => setReviewing(true)}><Award size={14} aria-hidden="true" /><FitLabel17>Review</FitLabel17></Btn>
      {halfShare(shareBtn)}
    </div>);
  } else if (other) {
    /* v1.35/1.36 live patch (another chat, recovered into source): signed-in member view of someone else's profile =
       Back on top, then four equal buttons in a 2-column grid (relationship button, Share, Ask, Availability). */
    const staff11 = state.role === "staff";
    const share11 = other && shareTag ? (
      <CardShareBtn17 title={`${person.name} on FireFlair`} url={`https://${CARD_DOMAIN}/${pc17Tag(shareTag)}`}
        fileName={"fireflair-" + cx17Slug(shareTag)} label="Share" className="ff-pub-shico ff-pub-wa11 ff-g11-btn" native
        render={() => <PlayerCard person={person} format="full" nameAs="div" themeKey={person.theme || "ivory"} />} />
    ) : null;
    /* createElement so the Ask/Availability buttons are spread in as separate grid cells (as on the live page). */
    const grid11 = staff11 ? null : React.createElement("div", { className: "ff-pub-grid11" },
      <div className="ff-g11-rel"><RelSlot17 person={person} /></div>, share11, ...[].concat(askRow.props.children));
    actionsEl = (<div className="ff-pub-acts ff-pub-stack">
      {state.role === "staff" && <FavBtn11 person={person} wide />}
      {staff11 ? <RelSlot17 person={person} /> : null}
      {state.role === "staff" && (
        <Btn variant={state.selection.includes(person.id) ? "ghost wide" : "primary wide"} onClick={() => {
          dispatch({ type: "SELECT", id: person.id });
          dispatch({ type: "TOAST", toast: state.selection.includes(person.id) ? `${person.name} removed from your booking bar` : `${person.name} added to your booking bar` });
        }}>
          {state.selection.includes(person.id) ? <><Check size={14} /> In your booking bar</> : <><Users size={14} /> Add to booking</>}
        </Btn>
      )}
      {staff11 ? askRow : null}
      {state.role === "staff" && <Btn variant="wide" onClick={() => setReviewing(true)}><Award size={14} aria-hidden="true" /><FitLabel17>Review</FitLabel17></Btn>}
      {staff11 ? halfShare(shareBtn) : grid11}
    </div>);
  }
  const cardEl = <PlayerCard person={person} format="full" nameAs="div" themeKey={person.id === "me" ? state.profile.theme : (person.theme || "ivory")}  />;
  return (
    <div className={publicView ? "ff-pubpage ff-pp-other" : undefined}>
      <PublicHero media={mediaOf(state, person)} card={cardEl} narrow below={<>{backBtn}{guestNote}{actionsEl}{shareEl}</>} />
      <HireCards11 person={person} />
      <PublicProfileBody person={person} aboutFirst={publicView} />
      <ReviewSheet open={reviewing} person={person} onClose={() => setReviewing(false)} />
      <AskQuestionSheet open={asking} person={person} onClose={() => setAsking(false)} />
      <CheckAvailabilitySheet open={checking} person={person} onClose={() => setChecking(false)} />
    </div>
  );
}


/* ==========================================================================
   6. FF TEAM
   ========================================================================== */

/* INVITES. Who brought you in is a real record (src/state/invite17.js): the code from the link you arrived on, kept in
   session.refTag before sign-up and in profile.referredBy after it. Nobody is the inviter unless that record says so. */
function inviterOf(state, people) {
  if (state.auth && state.auth.status === "signedIn") {
    const r = state.profile && state.profile.referredBy;
    return r ? people.find(p => p.id === r.personId) || null : null;
  }
  const s = inv17Sender(state, state.session.refTag);
  return s ? people.find(p => p.id === s.id) || null : null;
}


/* My Network: the inviter first, then everyone I've connected with. */
/* Add to network: one tap, no confirmation from the other side. Works for people and companies. */
function NetBtn17({ id, name, wide }) {
  const { state, dispatch } = useStore();
  const on = (state.netAdds17 || []).includes(id) || (state.connections || []).some(c => c.id === id);
  const team = (state.connections || []).some(c => c.id === id);
  const go = () => {
    if (state.auth.status !== "signedIn") { window.dispatchEvent(new CustomEvent("ff-login")); return; }
    dispatch({ type: "NET_TOGGLE", id }); dispatch({ type: "TOAST", toast: on ? `${name} removed from your network` : `${name} added to your network` });
  };
  return <Btn variant={(on ? "ghost" : "net") + (wide ? " wide" : "")} disabled={team} onClick={go}>{on ? <><Check size={14} /> In your network</> : <><UserPlus size={14} /> Add to network</>}</Btn>;
}


function myNetwork(state, people) {
  const inv = state.auth && state.auth.status === "signedIn" ? inviterOf(state, people) : null;
  const rest = state.connections.map(c => people.find(p => p.id === c.id)).filter(Boolean).filter(p => !inv || p.id !== inv.id);
  return { inviter: inv, list: inv ? [inv, ...rest] : rest };
}




const TAKEN_TAGS = ["SAM42", "ALEX424", "GAVRILAS", "CUARTERO", "SIMAO", "DANYG", "JAMESALL", "ADMIN"];


function ChipEdit({ values, onChange, placeholder, flags, ink, rule, leadFirst, max }) {
  const [t, setT] = useState("");
  /* pb-typecards: with max (Skills, Interests) an entry is at most max characters, cut while typing, and saved in Title Case. */
  const add = () => { const v0 = t.trim().replace(/,$/, "").trim(); if (!v0) return; const v = max ? capWords17(v0) : v0; if (!values.some(x => x.toLowerCase() === v.toLowerCase())) onChange([...values, v]); setT(""); };
  return (
    <div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
          {values.map((v, i) => (
            <span key={v + i} className={`ff-tagchip${leadFirst && i === 0 ? " lead" : ""}`} style={{ color: ink }}>
              {flags && <LangFlag lang={v} />}{v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`Remove ${v}`} style={{ color: ink }}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <input className="ff-cardin ff-cardin-row" value={t} placeholder={placeholder} style={{ color: ink }} maxLength={max || undefined}
        onChange={(e) => setT(max ? e.target.value.slice(0, max) : e.target.value)} onBlur={add}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} />
    </div>
  );
}


/* v17.3.25: text that shrinks to fit (name, profession, tag) and lists that keep only the items that fit. */
function FitText17({ as: As = "div", size, min = 0.4, className, style, children }) {
  const ref = React.useRef(null);
  const key = typeof children === "string" ? children : "";
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      el.style.fontSize = size + "cqw";
      let k = 1, g = 0;
      while (el.scrollWidth > el.clientWidth && k > min && g++ < 50) { k = Math.max(min, k - 0.03); el.style.fontSize = (size * k).toFixed(3) + "cqw"; }
    };
    fit();
    let ro = null;
    const host = el.parentElement;
    if (window.ResizeObserver && host) { let w = host.clientWidth; ro = new ResizeObserver(() => { const nw = host.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(host); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key, size, min]);
  return <As ref={ref} className={className} style={{ ...style, fontSize: size + "cqw" }}>{children}</As>;
}


function FitList17({ items, accent }) {
  const ref = React.useRef(null);
  const key = items.join("\u0001");
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      const kids = Array.from(el.children);
      kids.forEach(k => { k.style.display = ""; });
      let n = kids.length;
      while (n > 1 && el.scrollWidth > el.clientWidth) { n--; kids[n].style.display = "none"; }
    };
    fit();
    let ro = null;
    const host = el.parentElement;
    if (window.ResizeObserver && host) { let w = host.clientWidth; ro = new ResizeObserver(() => { const nw = host.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(host); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key]);
  return <span ref={ref} className="ff-pc-fit">{items.map((v, i) => <span key={v + i} className="ff-pc-fi">{i > 0 && <b style={{ color: accent }}>•</b>}{v}</span>)}</span>;
}


/* v17.3.77: type a profession straight into the card (as on the live ffteam.uk site):
   search the 35 known professions as you type, or add your own. */
function ProfTypeIn({ profs, set, ink, rule, onAdd }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(null);
  const n = q.trim().toLowerCase();
  const has = (x) => profs.some(p => String(p).toLowerCase() === String(x).toLowerCase());
  const hits = n ? [
    ...ALL_PROFESSIONS.filter(p => p.name.toLowerCase().startsWith(n)),
    ...ALL_PROFESSIONS.filter(p => !p.name.toLowerCase().startsWith(n) && p.name.toLowerCase().includes(n)),
  ].filter(p => !has(p.name)).slice(0, 5) : [];
  const typed = q.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const custom = n && !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n) && !has(typed) ? typed : null;
  /* v17.111111: a profession outside the FireFlair list that the rules can't place asks for its category first (or Other). */
  const customCat = custom ? professionCategory(custom) : null;
  const add = (name, category) => { if (!has(name)) { if (onAdd) onAdd(name, category); else set("professions")([...profs, name]); } setQ(""); setCat(null); };
  return (
    <div>
      <input className="ff-cardin" type="text" value={q} autoComplete="off" spellCheck={false}
        placeholder={profs.length ? "Add another profession" : "Search or type a profession"} aria-label="Search or type a profession"
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && n) { e.preventDefault(); if (hits[0]) add(hits[0].name); else if (!custom) return; else if (customCat) add(custom); else if (cat) add(custom, cat); } }}
        style={{ color: ink, borderBottomColor: rule, textAlign: "left", fontSize: 13.5 }} />
      {n && (hits.length > 0 || custom) && (
        <div role="list" aria-label="Matching professions" style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "flex-start", marginTop: 8 }}>
          {hits.map(p => (
            <button key={p.name} type="button" role="listitem" className="ff-tagchip" onClick={() => add(p.name)} style={{ color: ink, cursor: "pointer" }}>+ {p.name}</button>
          ))}
          {custom && customCat && <button type="button" role="listitem" className="ff-tagchip" onClick={() => add(custom)} style={{ color: ink, cursor: "pointer" }}>+ Add “{custom}”</button>}
        </div>
      )}
      {n && custom && !customCat && (
        <div className="ff-profcat" style={{ marginTop: 8, textAlign: "left" }}>
          <div style={{ color: ink, fontSize: 12.5, fontWeight: 600, marginBottom: 6 }}>Which category is “{custom}” in?</div>
          <div role="list" aria-label="Categories" style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "flex-start" }}>
            {CATEGORY_ORDER.map(k => (
              <button key={k} type="button" role="listitem" className="ff-tagchip" aria-pressed={cat === k} onClick={() => setCat(k)}
                style={cat === k ? { background: "#141416", color: "#EAD79C", borderColor: "#141416", cursor: "pointer" } : { color: ink, cursor: "pointer" }}>{k === "Other" ? "Specialist" : k}</button>
            ))}
          </div>
          <button type="button" className="ff-tagchip" disabled={!cat} onClick={() => cat && add(custom, cat)}
            style={{ marginTop: 8, color: ink, opacity: cat ? 1 : 0.45, cursor: cat ? "pointer" : "default", fontWeight: 600 }}>+ Add “{custom}”{cat ? ` · ${cat}` : ""}</button>
        </div>
      )}
    </div>
  );
}


function EditablePlayerCard({ draft, setDraft, themeKey = "onyx", tag = "username", level = 3, onPhoto }) {
  const t = THEMES[themeKey] || THEMES.onyx;
  const tier = cardMetal17({ name: draft.name, tag }, themeKey);
  const tr = TIERS[tier] || TIERS.standard;
  const { ink, sub, rule } = t;
  const set = (k) => (v) => setDraft({ ...draft, [k]: v });
  const photoRef = useRef(null);
  const [pickOpen, setPickOpen] = useState(false);
  const profRef = useRef(null);
  useEffect(() => {
    if (!pickOpen)
      return;
    const away = (e) => {
      if (profRef.current && !profRef.current.contains(e.target))
        setPickOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [pickOpen]);
  const profs = draft.professions || [];
  const togglePick = (n) => {
    const low = String(n).toLowerCase();
    set("professions")(profs.some((x) => String(x).toLowerCase() === low) ? profs.filter((x) => String(x).toLowerCase() !== low) : [...profs, n]);
  };
  const lbl = t.dark ? sub : "#5C513F";
  const Row = ({ kind, label, children }) => React.createElement("div", {
    style: { padding: "10px 0", borderBottom: `1px solid ${rule}` }
  }, React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }
  }, React.createElement(CatIcon, {
    kind,
    size: 13,
    color: lbl
  }), React.createElement("span", {
    className: "ff-cardlbl",
    style: { color: lbl }
  }, label)), children);
  return React.createElement(CardFrame, {
    premium: true,
    tier,
    theme: t,
    style: { maxWidth: 340, margin: "0 auto", padding: "40px 16px 0" }
  }, React.createElement("span", {
    className: "pc17-plate",
    style: { color: "#E4C36A", borderColor: (METAL[tier] || METAL.bronze).edge[1], fontFamily: "Inter,ui-sans-serif,-apple-system,sans-serif" }
  }, React.createElement("span", {
    style: { width: "3.4cqw", height: "3.4cqw", display: "block", flex: "none" }
  }, React.createElement(PcBust17, { size: "100%", color: "#E4C36A" })), React.createElement("span", { className: "t" }, "Profile Card")), React.createElement("span", {
    className: "pc17-logo"
  }, React.createElement(FFLogo, {
    size: "100%",
    tier
  })), React.createElement("div", {
    style: { display: "flex", justifyContent: "center", marginTop: 4 }
  }, React.createElement("input", {
    ref: photoRef,
    type: "file",
    accept: "image/*",
    style: { display: "none" },
    onChange: (e) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      /* photo-frame: line the photo up in the card's circle first. */
      if (f)
        ffFramePhoto17(f).then((v) => { if (v) onPhoto(v); });
    }
  }), React.createElement("button", {
    onClick: () => photoRef.current?.click(),
    className: "ff-photobtn",
    "aria-label": draft.photo ? "Change your profile photo" : "Add your profile photo",
    title: draft.photo ? "Change photo" : "Add photo"
  }, React.createElement(Portrait, {
    src: draft.photo,
    name: draft.name,
    size: 108,
    ring: tr.ring[0],
    ink: tr.ink
  }, draft.photo ? null : React.createElement("span", {
    className: "ff-photoempty",
    style: { color: tr.ring[0] },
    "aria-hidden": "true"
  })), draft.photo ? React.createElement("span", {
    className: "ff-photoadd",
    style: { background: tr.ring[0] }
  }, React.createElement(CameraPlusGlyph, {
    size: 17
  })) : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "ff-photoplus",
    style: { background: tr.ring[0] },
    "aria-hidden": "true"
  }, React.createElement(Plus, {
    size: 17,
    strokeWidth: 3
  }))))), React.createElement("input", {
    className: "ff-cardin name",
    value: draft.name,
    placeholder: "Your name",
    onChange: (e) => setDraft({ ...draft, name: e.target.value }),
    style: { color: ink, borderBottomColor: rule, marginTop: 12 }
  }), React.createElement("input", {
    className: "ff-cardin headline",
    value: draft.headline || "",
    placeholder: "Headline",
    "aria-label": "Headline",
    maxLength: 28,
    onChange: (e) => setDraft({ ...draft, headline: e.target.value }),
    style: { color: t.dark ? t.accent : "#6A4F12", borderBottomColor: rule, marginTop: 8, textAlign: "center", fontSize: 13.5, textTransform: "uppercase", letterSpacing: ".14em" }
  }), React.createElement("div", {
    style: { marginTop: 8 }
  }, React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-start", marginBottom: 4 }
  }, React.createElement(CatIcon, {
    kind: "profession",
    size: 12,
    color: lbl
  }), React.createElement("span", {
    className: "ff-cardlbl",
    style: { color: lbl }
  }, "Professions")), React.createElement("div", {
    ref: profRef
  }, React.createElement("div", {
    style: { display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "flex-start", marginBottom: 6 }
  }, profs.map((v, i) => React.createElement("span", {
    key: v + i,
    className: `ff-tagchip${i === 0 ? " lead" : ""}`,
    style: { color: ink }
  }, v, React.createElement("button", {
    type: "button",
    onClick: () => set("professions")(profs.filter((_, j) => j !== i)),
    "aria-label": `Remove ${v}`,
    style: { color: ink }
  }, React.createElement(X, {
    size: 11
  }))))), React.createElement(ProfTypeIn, {
    profs,
    set,
    ink,
    rule,
    onAdd: (name, category) => setDraft({ ...draft, professions: [...profs, name], ...(category ? { professionCats: { ...(draft.professionCats || {}), [name]: category } } : {}) })
  }))), React.createElement("div", {
    style: { height: 8 }
  }), React.createElement(Row, {
    kind: "skills",
    label: "Skills"
  }, React.createElement(ChipEdit, {
    values: draft.skills,
    onChange: set("skills"),
    placeholder: "Skill",
    max: TYPECARD_CHARS,
    ink,
    rule
  })), React.createElement(Row, {
    kind: "interests",
    label: "Interests"
  }, React.createElement(ChipEdit, {
    values: draft.interests,
    onChange: set("interests"),
    placeholder: "Interest",
    max: TYPECARD_CHARS,
    ink,
    rule
  })), React.createElement(Row, {
    kind: "location",
    label: "Where are you based?"
  }, React.createElement(BaseField17, { ink })), React.createElement(Row, {
    kind: "languages",
    label: "Languages"
  }, React.createElement(ChipEdit, {
    values: draft.languages,
    onChange: set("languages"),
    placeholder: "Add a language",
    flags: true,
    ink,
    rule
  })), React.createElement("div", {
    style: { margin: "0 -16px", background: t.dark ? "rgba(0,0,0,.45)" : "#141416", borderTop: `1px solid ${rule}`, padding: "9px 16px", display: "flex", alignItems: "center", gap: 9 }
  }, React.createElement("span", {
    style: { fontFamily: "Inter,ui-sans-serif,-apple-system,sans-serif", fontSize: "4.3cqw", letterSpacing: ".03em", fontWeight: 400, color: "#EAD79C", whiteSpace: "nowrap" }
  }, CARD_DOMAIN, "/", pc17Tag(tag)), React.createElement("span", {
    className: "pc17-brand",
    style: { fontFamily: "'Cinzel','Optima',Georgia,serif" }
  }, React.createElement("span", { className: "pc17-mark" }, React.createElement(FFLogo, { size: "100%", tier })), "FIREFLAIR")));
}




/* Write the card editor's draft into the real profile records — the one
   profile, never a copy. Names are matched to existing records so their
   descriptions, media and documents are kept. */
function syncCardRecords(state, dispatch, d, cats = ["professions", "skills", "interests", "locations", "languages"]) {
  cats.forEach(cat => {
    const existing = recsOf(state.profile, cat);
    const wasOnCard = primaryNames(state.profile, cat, FEATURE_LIMIT).map(n => n.toLowerCase());
    const want = (d[cat] || []).filter(Boolean);
    const has = (n) => want.some(v => v.toLowerCase() === n.toLowerCase());
    const front = want.map(v => {
      const match = existing.find(r => r.name.toLowerCase() === v.toLowerCase());
      if (cat !== "professions") return match ? { ...match, name: v, hidden: false } : makeRecord(cat, v);
      /* Professions keep where they came from: "approved" (the FireFlair list) or "user" (typed by the member), with any category the member chose. */
      const chosen = (d.professionCats || {})[v];
      const extra = { professionSource: ALL_PROFESSIONS.some(p => p.name.toLowerCase() === v.toLowerCase()) ? "approved" : "user", ...(chosen ? { displayCategory: chosen } : {}) };
      return match ? { ...match, ...extra, ...(match.displayCategory && !chosen ? { displayCategory: match.displayCategory } : {}), name: v, hidden: false } : makeRecord(cat, v, extra);
    });
    /* The card lists every record, so one that is no longer wanted was removed
       with its X: delete it (only suggestions FireFlair proposed are kept). */
    const rest = existing.filter(r => has(r.name) ? false : !!r.proposed);
    dispatch({ type: "REC_BULK", category: cat, list: [...front, ...rest] });
  });
}


function GroupedPeople({ onPick, selectable, scope = "", query = "", only = "", shut = false, insertAfter = "", insert = null, quietEmpty = false }) {
  const { state, dispatch } = useStore();
  const everyone = useDirectory();
  const n = query.trim().toLowerCase();
  /* v17.48: one entry per category a person's top 3 professions cover, the plate showing the profession that put them
     there, top-profession holders first. A search lists each person once, in the category of the profession that matched. */
  const entries = [];
  everyone.forEach(p => {
    if (n) { const h = netSearchHit17(p, n); if (h) entries.push({ p: plateAs17(p, h.profession), g: h.group, r: h.rank }); return; }
    (p.groups || [{ group: p.group, profession: p.profession, rank: 0 }]).forEach(x => entries.push({ p: plateAs17(p, x.profession), g: x.group, r: x.rank }));
  });
  const all = only && only.length ? entries.filter(e => [].concat(only).includes(e.g)) : entries;
  if (n && !all.length && quietEmpty) return null;
  if (n && !all.length) return <div style={{ marginTop: 18 }}><Empty icon={<Search size={26} />} title={`Nobody matches “${query}” yet. Try a different name, skill or area.`} /></div>;
  const order = CATEGORY_ORDER;
  const groups = all.reduce((m, e) => { (m[e.g] = m[e.g] || []).push(e); return m; }, {});
  Object.keys(groups).forEach(g => { groups[g] = groups[g].map((e, i) => [e, i]).sort((a, b) => a[0].r - b[0].r || a[1] - b[1]).map(([e]) => e.p); });
  const keys = Object.keys(groups).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  /* Something placed straight after one group (FF Staff: Your team after Chefs); at the end if that group isn't shown. */
  const slotAt = insert ? (keys.includes(insertAfter) ? insertAfter : null) : null;

  return (
    <>
      {keys.map(g => {
        const key = `${scope}${g}`;
        const visible = state.categoryVisibility[key] === undefined ? (!shut && state.role !== "staff") : state.categoryVisibility[key] !== false;
        return (<React.Fragment key={g}>
          <section style={{ marginTop: 20 }}>
            <SectionHead icon={<GroupIcon group={g} />} title={g === "Other" ? "Specialist" : g} count={groups[g].length}
              action={<CategoryToggle sectionKey={key} defaultOpen={!shut} />} />
            {visible && (
              <HScroll label={g === "Other" ? "Specialist" : g} snap>
                {groups[g].map(p => (
                  <PlayerTile key={p.id} person={p} selected={selectable && state.selection.includes(p.id)}
                    onClick={() => onPick(p)} />
                ))}
                {/* No Invite tile: inviting is part of Share (your own card sends your join link). */}
              </HScroll>
            )}
          </section>
          {slotAt === g ? insert : null}
        </React.Fragment>);
      })}
      {insert && !slotAt ? insert : null}
    </>
  );
}



/* A collapsed drop-down under Your team: Companies, Network. Both count towards the team number. */
function NetDrop17({ title, count, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"ff-netdrop17" + (open ? " open" : "")}>
      <button type="button" className="hd" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <b>{title}</b><i>{count}</i><I11.ChevronDown size={16} />
      </button>
      {open && <div className="bd">{children}</div>}
    </div>
  );
}

/* The companies a person works with: accepted team links first, then (for your own profile) companies you added to your network.
   withNet false (v17.48 Team tab): company teams only, without the network adds. */
function personCompanies17(state, person, withNet = true) {
  if (!person) return [];
  const me = person.id === "me";
  const tag = String(person.tag || "").toLowerCase();
  const keys = new Set(ctAll17(state).filter(x => x.status === "accepted" && (me ? ctIsMe17(state, x) : (x.personId === person.id || (tag && String(x.tag || "").toLowerCase() === tag)))).map(x => x.companyKey));
  const out = browseCompanies17(state).filter(c => c && c.id !== "mine" && (keys.has(coKey17(c)) || (c.team || []).includes(person.id)));
  if (me && withNet) (state.netAdds17 || []).filter(id => String(id).startsWith("co_")).forEach(id => {
    const c = companyById(state, id);
    if (c && !out.some(x => x.id === c.id)) out.push(c);
  });
  return out;
}

/* Team tab of a profile: the team, then Companies and Network drop-downs. */
function TeamParts17({ team, companies, network, teamEmpty, renderTeam }) {
  const { dispatch } = useStore();
  const view = (p) => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); };
  const none = (t) => <p className="ff-body ff-muted" style={{ margin: 0 }}>{t}</p>;
  return (
    <div className="ff-tparts17">
      <SectionHead icon={<I11.Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Team" count={team.length} />
      {team.length ? <HScroll label="Team">{team.map(p => renderTeam ? renderTeam(p) : <PlayerTile key={p.id} person={p} onClick={() => view(p)} />)}</HScroll> : none(teamEmpty || "No one yet.")}
      <NetDrop17 title="Companies" count={companies.length}>
        {companies.length ? <CoTiles17 list={companies} label="Companies" /> : none("No companies yet.")}
      </NetDrop17>
      <NetDrop17 title="Network" count={network.length}>
        {network.length ? <HScroll label="Network">{network.map(p => <PlayerTile key={p.id} person={p} onClick={() => view(p)} />)}</HScroll> : none("No one yet.")}
      </NetDrop17>
    </div>
  );
}


/* ==========================================================================
   NETWORK PAGE NOTIFICATIONS (v1.82)
   Team invitations look like the WhatsApp message: the inviter's Profile Card, "<Name> has invited you to join their team on
   FireFlair.", "Accept to appear on <Name>'s team and show their Profile Card on yours.", then Accept, Not now, Leave a review.
   After Accept the inviter gets "<Name> is now on your team." (View profile) in their notifications (state.teamJoined18).
   ========================================================================== */
const NetIco18 = { Check: lucideIcon("Check"), X: lucideIcon("X"), Out: lucideIcon("ArrowUpRight"), Gear: lucideIcon("Settings"), Users: lucideIcon("Users"), Briefcase: lucideIcon("Briefcase"), Bell: lucideIcon("Bell") };


/* One team invitation. A person's shows their Profile Card; a company's shows its Company Card (Accept and Not now only). */
function TeamInvite18({ x, onReview }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const person = x.company ? null : all.find(p => p.id === x.fromId);
  const co = x.company ? companyById(state, x.fromId) : null;
  if (!person && !co) return null;
  const first = x.company ? x.name : firstName(x.name);
  const reply = (accept) => {
    dispatch({ type: "TEAM_ASK_REPLY", ask: x, accept });
    if (accept) {
      dispatch({ type: "TOAST", toast: `You and ${first} are on each other's team` });
      if (x.viaLink) dispatch({ type: "INV_PATCH", patch: { reviewOfferedAt: Date.now() } });
    }
  };
  return (
    <li className="ff-inv18 side" aria-label={`Team invitation from ${x.name}`}>
      <div className="ff-inv18-card">
        {co ? <CompanyCardFace c={co} size="sm" /> : <PlayerCard person={person} format="portrait" nameAs="div" themeKey={person.theme || "paper"} />}
      </div>
      <div className="ff-inv18-r">
        <p className="ff-inv18-t">{first} has invited you to join their team on FireFlair.</p>
        <div className="ff-inv18-btns">
          <button type="button" className="ff-inv18-b ok" onClick={() => reply(true)}><NetIco18.Check size={16} aria-hidden="true" /><FitLabel17>Accept</FitLabel17></button>
          <button type="button" className="ff-inv18-b" onClick={() => reply(false)}><NetIco18.X size={16} aria-hidden="true" /><FitLabel17>Not now</FitLabel17></button>
          {person ? <button type="button" className="ff-inv18-b" onClick={() => onReview(person)}><NetIco18.Out size={16} aria-hidden="true" /><FitLabel17>Leave a review</FitLabel17></button> : null}
        </div>
      </div>
    </li>
  );
}


/* A review someone wrote about you, waiting for you to accept it onto your profile (v1.165). Same side-by-side layout as an invitation. */
function ReviewNote165({ r }) {
  const { dispatch } = useStore();
  const all = useDirectory();
  const person = all.find(p => p.id === r.byId);
  const first = firstName(r.byName);
  const decide = (show) => {
    dispatch({ type: "REVIEW_DECIDE", id: r.id, show, review: r });
    if (show) dispatch({ type: "TOAST", toast: `${first}'s review is on your profile` });
  };
  return (
    <li className="ff-inv18 side" aria-label={`Review from ${r.byName}`}>
      <div className="ff-inv18-card">
        {person ? <PlayerCard person={person} format="portrait" nameAs="div" themeKey={person.theme || "paper"} /> : <Portrait src={null} name={r.byName} size={90} />}
      </div>
      <div className="ff-inv18-r">
        <p className="ff-inv18-t">{first} reviewed you.</p>
        {r.rating ? <p className="ff-inv18-st" role="img" aria-label={`${r.rating} out of 5`}>{"\u2605".repeat(r.rating)}</p> : null}
        {r.text ? <p className="ff-inv18-q">{r.text}</p> : null}
        <div className="ff-inv18-btns">
          <button type="button" className="ff-inv18-b ok" onClick={() => decide(true)}><NetIco18.Check size={16} aria-hidden="true" /><FitLabel17>Accept</FitLabel17></button>
          <button type="button" className="ff-inv18-b" onClick={() => decide(false)}><NetIco18.X size={16} aria-hidden="true" /><FitLabel17>Decline</FitLabel17></button>
        </div>
      </div>
    </li>
  );
}


/* "<Name> is now on your team." for the inviter, with a View profile button. */
function TeamJoined18({ n }) {
  const { dispatch } = useStore();
  const all = useDirectory();
  const p = all.find(x => x.id === n.personId);
  const first = firstName(n.name);
  return (
    <li className="ff-inv18-joined" aria-label={`${n.name} is now on your team`}>
      <Portrait src={p && p.photo} name={n.name} size={40} tier={p && p.tier} />
      <span className="tx"><FitLabel17>{`${first} is now on your team.`}</FitLabel17></span>
      <button type="button" className="ff-inv18-b view" onClick={() => { dispatch({ type: "TEAM_JOINED_SEEN", id: n.id }); dispatch({ type: "VIEW", id: n.personId }); window.scrollTo(0, 0); }}><FitLabel17>View profile</FitLabel17></button>
    </li>
  );
}


/* Invitations, then "is now on your team" notes, at the top of the Network page. */
function NetNotes18({ onReview }) {
  const { state } = useStore();
  const people = useDirectory();
  const brief = notesBrief17(state, people);
  const invites = brief.filter(it => it.kind === "team");
  const reviews = brief.filter(it => it.kind === "review");
  const joined = joinedNotes18(state);
  if (!invites.length && !joined.length && !reviews.length) return null;
  return (
    <section className="ff-netn18" aria-label="Notifications">
      <SectionHead icon={<NetIco18.Bell size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Notifications" />
      <ul className="ff-inv18-list">
        {invites.map(it => <TeamInvite18 key={it.id} x={it.x} onReview={onReview} />)}
        {reviews.map(it => <ReviewNote165 key={it.id} r={it.r} />)}
        {joined.map(n => <TeamJoined18 key={n.id} n={n} />)}
      </ul>
    </section>
  );
}


/* Notification channels. A channel with always:true is on and has no switch. Add email (or anything else) here and it
   appears in the pop-up; state.notifyPrefs18[key] holds the switch (on unless it is false, so new members start with it on). */
const NOTIFY_CHANNELS18 = [
  { key: "site", label: "Site", always: true, icon: () => <NetIco18.Users size={18} aria-hidden="true" /> },
  { key: "whatsapp", label: "WhatsApp", icon: () => <WhatsAppIcon size={20} aria-hidden="true" /> },
];
const notifyOn18 = (state, ch) => ch.always || !(state.notifyPrefs18 && state.notifyPrefs18[ch.key] === false);


function NotifySettings18({ open, onClose }) {
  const { state, dispatch } = useStore();
  const set = (key, on) => dispatch({ type: "V11_SET", patch: { notifyPrefs18: { ...(state.notifyPrefs18 || {}), [key]: on } } });
  return (
    <Sheet open={open} onClose={onClose} title="Notifications">
      <ul className="ff-nset18">
        {NOTIFY_CHANNELS18.map(ch => {
          const on = notifyOn18(state, ch);
          return (
            <li key={ch.key} className="ff-nset18-row">
              <span className="ico">{ch.icon()}</span>
              <b className="nm">{ch.label}</b>
              {ch.always
                ? <span className="ff-nset18-on" aria-label={`${ch.label} is on`}>On</span>
                : <button type="button" role="switch" aria-checked={on} aria-label={ch.label} className={"ff-nset18-sw" + (on ? " on" : "")} onClick={() => set(ch.key, !on)}><i /></button>}
            </li>
          );
        })}
      </ul>
    </Sheet>
  );
}


/* NETWORK — the bartending network, for everyone. Signed-out visitors see
   the same people a member does; joining happens on Home and Profile. */
function NetworkScreen({ guest = false }) {
  const { state, dispatch } = useStore();
  const [reviewing, setReviewing] = useState(null);
  const [settings, setSettings] = useState(false);
  const q = state.netQuery || "";
  const setQ = (v) => dispatch({ type: "NET_QUERY", q: v });
  const mine = guest ? { inviter: null, list: [] } : myNetwork(state, adminPeople17(state, state.directory));
  const connected = mine.list;
  const adds = guest ? [] : (state.netAdds17 || []);
  const netPeople = adds.map(id => state.directory.find(p => p.id === id)).filter(p => p && !connected.some(c => c.id === p.id));
  const netCos = adds.filter(id => String(id).startsWith("co_")).map(id => companyById(state, id)).filter(Boolean);
  const view = (p) => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); };
  /* v1.115: coming back from a profile on a phone or iPad (the page was replaced) puts you at the card you were on. */
  useEffect(() => {
    const b = window.__ffBack;
    if (!b || Date.now() - b.t > 600000 || !b.y) return;
    window.__ffBack = null;
    let n = 0;
    const go = () => { window.scrollTo(0, b.y); if (n++ < 12 && Math.abs(window.scrollY - b.y) > 4) setTimeout(go, 80); };
    setTimeout(go, 60);
  }, []);

  return (
    <div>

      {!q && !guest && <NetNotes18 onReview={setReviewing} />}
      {!q && !guest && (netCos.length > 0 || (state.teamInvites || []).some(i => i.status === "pending")) && (
        <section className="ff-netco18" aria-label="Your network">
          <SectionHead icon={<NetIco18.Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Your network" />
        </section>
      )}
      {!q && !guest && netCos.length > 0 && (
        <section className="ff-netco18" aria-label="Companies in your network">
          <CoTiles17 list={netCos} label="Companies in your network" />
        </section>
      )}
      {!q && !guest && <SentInvitations />}

      <NetBrowse17 query={q} onPick={view} after={<NetMap20 />} search={<FFAI query={q} onQuery={setQ} title="Search companies, people or skills" searchBox
        placeholder="Search companies, people or skills" />} />
      {!q && (<>
        <Divider />
      </>)}
      <ReviewSheet open={!!reviewing} person={reviewing} onClose={() => setReviewing(null)} />
      <NotifySettings18 open={settings} onClose={() => setSettings(false)} />
    </div>
  );
}

