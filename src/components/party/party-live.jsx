/* src/components/party/party-live.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const DEMO_HOST17 = { name: "Hannah Ellis", profession: "Event planner", interests: "Garden parties · Live music", cocktails: "Espresso Martini · Negroni", drinks: "Champagne",
  about: "I host two or three big nights a year, usually in the garden, and I like them to feel effortless.", partyStyle: "Relaxed garden parties that turn into dancing.",
  usualArea: "North London, at home", staffPrefs: "Smart casual, friendly, happy to chat with guests.", drinkNotes: "Always a great alcohol-free option. One guest has a nut allergy.",
  staffKnow: "Parking on the drive. The side gate is the easiest way in.", reviews: [{ id: "dr1", rating: 5, text: "Clear brief, lovely guests and a smooth night.", byName: "Sam, Cocktail Bartender" }] };


/* ---- The completed profile ---------------------------------------------------------------------- */
/* ---- v1.01: the Live Action Bar. A row inside the desktop header (top) and above the phone nav (bottom).
   The screen that owns the actions sets them with useLiveAction17; nothing shows when no screen has. */
const LA17 = { s: null, l: new Set() };


const laSet17 = (n) => { LA17.s = n; LA17.l.forEach(f => f()); };


function useLiveAction17(state, deps) {
  useEffect(() => { laSet17(state); return () => laSet17(null); }, deps);
}


function LiveActionBar17({ placement }) {
  const [, force] = useState(0);
  useEffect(() => { const f = () => force(x => x + 1); LA17.l.add(f); return () => { LA17.l.delete(f); }; }, []);
  const bar = LA17.s;
  if (!bar || (!bar.actions.length && !(bar.chips && bar.chips.length))) return null;
  return (
    <div className={`ff-livebar17 ${placement}`} role="toolbar" aria-label="Live Action Bar">
      <div className={`in${bar.chips && bar.chips.some(c => c.thumb || c.icon) ? " cmp" : ""}`}>
        <span className="status">{bar.status}</span>
        {bar.chips && bar.chips.length > 0 && <span className="chips" aria-label="In your basket">{bar.chips.map(c => (
          <span className={`chip${c.thumb || c.icon ? " mini" : ""}`} key={c.key}>
            {(c.thumb || c.icon) && <span className="th">{c.thumb ? <img decoding="async" src={c.thumb} alt="" draggable={false} /> : c.icon}</span>}
            <b>{c.label}</b>{c.onRemove && <button type="button" aria-label={`Remove ${c.label}`} onClick={c.onRemove}><S17I.X size={11} strokeWidth={2.6} /></button>}</span>))}</span>}
        <span className="acts">
          {bar.actions.map(a => (
            a.xc ? <button key={a.key} type="button" className="lb xc" onClick={a.onClick} aria-label={a.label} title={a.label}><S17I.X size={16} strokeWidth={2.4} /></button>
            : a.coin ? <button key={a.key} type="button" className="lb coin" disabled={a.disabled} onClick={a.onClick} aria-label={a.label} title={a.label}><S17I.ArrowRight size={20} strokeWidth={2.6} /></button>
            : <button key={a.key} type="button" className={`lb ${a.primary ? "pri" : "out"}`} onClick={a.onClick} aria-label={a.label}>
              {a.icon}<span className={a.primary ? undefined : "lab"}>{a.label}</span>
            </button>
          ))}
        </span>
      </div>
    </div>
  );
}


/* The completed profile is the public page, exactly as anyone else sees it from the network. */
function DoneProfile17({ kind }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  if (kind === "team") {
    const p = state.profile;
    const mine = String(p.name || "").trim() && recsOf(p, "professions").length;
    const person = mine ? { ...meAsStaff(p, state.session), group: "Your profile" } : (["stf_dany", "stf_simao", "stf_gav"].map(id => all.find(x => x.id === id)).find(Boolean) || meAsStaff(p, state.session));
    const card = <PlayerCard person={person} format="full" nameAs="h1" themeKey={mine ? p.theme : (person.theme || "ivory")} />;
    const dTag = state.auth.status === "signedIn" ? (state.auth.tag || state.session.tag) : "";
    const edit17 = () => { dispatch({ type: "V11_SET", patch: { ed17: "team" } }); dispatch({ type: "PE_START" }); window.scrollTo(0, 0); };
    const cardShare = dTag && mine ? <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, maxWidth: 440, marginInline: "auto" }}>
      <Btn variant="wide" onClick={edit17}><S17I.Pencil size={14} /> Edit</Btn>
      <MyShareBtn17 person={person} />
    </div> : null;
    return (
      <div className="ff-pubpage ff-done17 team">
        <PublicHero media={mediaOf(state, person)} card={<>{card}{cardShare}</>} below={null} />
        <PublicProfileBody person={person} packagesTail={<PersonalTerms17 />} />
        {mine ? <NeedHelp34 /> : null}
      </div>
    );
  }
  return null;
}


/* ---- Examples, so the completed profile can be reviewed straight away ---------------------------- */
function seedDemo17(state, dispatch, kind) {
  const patch = {};
  if (kind === "team" && String(state.profile.name || "").trim() && !state.profile.live) dispatch({ type: "PROFILE", patch: { live: true } });
  if (kind === "team" && !String(state.profile.name || "").trim()) {
    dispatch({ type: "PROFILE", patch: { name: "Alexander Gagnon", live: true, saved: true, savedAt: Date.now(), theme: "gold", tier: "gold", level: 5, hasCar: true, photo: avatarFor("Alexander Gagnon"), records: DEMO_RECORDS(), about: state.profile.about || "Bartender for fifteen years, building FireFlair." } });
    dispatch({ type: "SESSION", patch: { tag: "ALEXG", phone: "+44 7700 900412", verified: true } });
  }
  /* No default cocktails or Service Cards: they stay empty until the person adds or signs up. */
  if (false) patch.myCocktails = [{
    id: uid("ck"), kind: "cocktail", spirit: "Vodka", glassOther: "", price: "", name: "Espresso Martini", note: "Rich coffee, a little sweetness and a silky crema on top.", photo: "", glass: "martini", keywords: ["coffee", "vodka", "after dinner", "sweet"],
    ings: [{ id: uid("ing"), amt: "50", unit: "ml", name: "Vodka", buy: "" }, { id: uid("ing"), amt: "25", unit: "ml", name: "Coffee liqueur", buy: "" },
      { id: uid("ing"), amt: "25", unit: "ml", name: "Fresh espresso", buy: "" }, { id: uid("ing"), amt: "10", unit: "ml", name: "Sugar syrup", buy: "" }],
  }];
  if (false) patch.myServices = [{
    ...NEW_SERVICE17(), tone: "silver", title: "Cocktail Bartender", tagline: "A signature cocktail menu, made in front of your guests.",
    includes: "Bartender, cocktail menu, bar tools and garnishes", ideal: "Birthdays, garden parties and launches", time: "4 hours",
    base: "North London", areas: ["London", "Hertfordshire", "Essex"], equipment: "Portable bar, glassware, ice, garnishes", extras: ["Extra bartender", "Cocktail masterclass"], events: ["Birthdays", "Weddings", "Launches"],
    guests: "20 to 80", bands: ["s", "m"], cat: "bar", staff: "1 bartender", setup: "45 minutes before", provides: "A table near power and water", days: ["Thu", "Fri", "Sat", "Sun"], keywords: ["Cocktail bartender", "Mixologist"] },
    { ...NEW_SERVICE17(), type: "addon", tone: "bronze", title: "Extra bartender", tagline: "A second pair of hands behind the bar.", includes: "One more bartender for the night", ideal: "Larger guest lists", time: "4 hours", base: "North London", areas: ["London"], staff: "1 bartender", keywords: ["Extra bartender"] }];
  if (Object.keys(patch).length) dispatch({ type: "V11_SET", patch });
}


/* ---- The Profile tab: building screen or completed profile -------------------------------------
   TEMPORARY: the "DEV" button shows the completed profile without signing in, for review. */
/* Silver and Gold are locked, but can be previewed: the card shows the colour for three seconds, then goes back. */
let PV17 = null;


function clearPv17() { if (PV17) { clearTimeout(PV17.t); PV17 = null; } }


function flushPv17() { if (PV17) { const p = PV17; clearTimeout(p.t); PV17 = null; p.apply(p.base); } }


function pvBase17(cur) { return PV17 ? PV17.base : cur; }


function previewTheme17(k, cur, apply) {
  const base = PV17 ? PV17.base : cur;
  if (PV17) clearTimeout(PV17.t);
  PV17 = { base, apply, t: setTimeout(() => { PV17 = null; apply(base); }, 3000) };
  apply(k);
}


function ProfileGate17({ kind }) {
  const { state, dispatch } = useStore();
  const live = kind === "team" && !!state.profile.live;
  /* A company that has joined and saved once gets its finished page, like the DEV login. */
  const co = state.company || {};
  const coSaved = kind === "biz" && state.auth.status === "signedIn" && !!co.joinedAt && !!co.finishedAt;
  const done = live || coSaved || !!(state.devDone || {})[kind];
  /* "Welcome to FF Staff" shows once, straight after the first save, above the finished page. */
  const [welcome, setWelcome] = useState(false);
  useEffect(() => {
    if (coSaved && co.welcomeAt && !co.welcomeShown) { setWelcome(true); dispatch({ type: "COMPANY_SAVE", company: { welcomeShown: true } }); }
  }, [coSaved, co.welcomeAt]);
  const editing = done && state.ed17 === kind;
  const claim = kind === "biz" ? coClaimMine17(state) : null;
  const dirSlug = kind === "biz" ? co.dirEditSlug : null;
  const snap = useRef(null);
  const [justShared, setJustShared] = useState(false);
  const was = useRef(live);
  useEffect(() => {
    if (live && !was.current && !["dev", "demo"].includes(state.auth.method))
      setJustShared(true);
    was.current = live;
  }, [live]);
  const edit = () => {
    snap.current = state.company || {};
    /* Edit opens with every company section closed. */
    if (kind === "biz") Object.keys(state.categoryVisibility || {}).filter((k) => /^co_/.test(k) && state.categoryVisibility[k] === true).forEach((k) => dispatch({ type: "TOGGLE_CATEGORY", key: k, visible: false }));
    if (kind !== "team" && !String((state.company || {}).name || "").trim()) {
      const demo = kind === "party" ? { ...DEMO_HOST17, tier: undefined, photo: (window.FF_IMG || {}).face_you || "" } : (() => {
        const demoCo = companyList(state).find((x) => !x.mine) || {};
        if (demoCo.id === "co_vooshka")
          return coFromProfile17("vooshka");
        const { id, mine, tier, ...rest } = demoCo;
        return rest;
      })();
      dispatch({ type: "COMPANY_SAVE", company: { ...demo, joinedAt: Date.now() } });
      snap.current = { ...snap.current, ...demo };
    }
    dispatch({ type: "V11_SET", patch: { ed17: kind } });
    if (kind === "team")
      dispatch({ type: "PE_START" });
    window.scrollTo(0, 0);
  };
  const close = () => {
    flushPv17();
    dispatch({ type: "V11_SET", patch: { ed17: null } });
    dispatch({ type: "PE_DONE" });
    window.scrollTo(0, 0);
  };
  const cancel = () => {
    if (kind !== "team" && snap.current) {
      /* Back to how it was when Edit was pressed: the address (and what follows it), and every key added since (sections, cards, contacts). */
      const cur = state.company || {};
      if (kind === "biz" && snap.current.slug && cur.slug !== snap.current.slug) dispatch({ type: "CO_SLUG_SET", slug: snap.current.slug });
      const gone = {};
      Object.keys(cur).forEach((k) => { if (!(k in snap.current)) gone[k] = undefined; });
      dispatch({ type: "COMPANY_SAVE", company: { ...gone, ...snap.current } });
    }
    close();
    if (dirSlug) endDir(false);
  };
  /* FireFlair editing a directory page: Save keeps the edits, Cancel drops them; either way back to the page. */
  const endDir = (commit) => {
    dispatch({ type: "DIR_EDIT17_END", commit });
    dispatch({ type: "VIEW_COMPANY", id: "co_" + dirSlug });
    window.scrollTo(0, 0);
  };
  const save = () => {
    if (kind === "team")
      window.dispatchEvent(new Event("ff-save"));
    dispatch({ type: "TOAST", toast: "Saved" });
    close();
    if (dirSlug) endDir(true);
  };
  useLiveAction17({
    status: kind === "party" ? "" : done ? editing ? (dirSlug ? "Editing for FireFlair" : "Editing your profile") : claim && claim.status === "pending" ? "Claim being checked" : claim && claim.status === "rejected" ? "Claim not approved" : "Your profile is live" : claim && claim.status === "rejected" ? "Claim not approved" : "Building your profile",
    actions: kind === "party" ? [] : done ? editing ? kind === "team" && !dirSlug ? [{ key: "save", label: "Save", icon: React.createElement(S17I.Check, {
      size: 14
    }), onClick: save, primary: true }, { key: "close", label: "Close", xc: true, onClick: close }] : [{ key: "cancel", label: "Cancel", icon: React.createElement(S17I.X, {
      size: 14
    }), onClick: cancel }, { key: "save", label: "Save", icon: React.createElement(S17I.Check, {
      size: 14
    }), onClick: save, primary: true }] : [{ key: "edit", label: "Edit", icon: React.createElement(S17I.Pencil, {
      size: 14
    }), onClick: edit, primary: true }] : [{ key: "save", label: "Save", icon: React.createElement(S17I.Check, {
      size: 14
    }), onClick: () => window.dispatchEvent(new Event("ff-save")), primary: true }]
  }, [done, editing, kind, claim && claim.status, dirSlug]);
  return React.createElement("div", {
    className: `ff-pg17${done ? " done" : ""}`
  }, /* v11-a (Alex, 18 Nov 10:20): the FF Team profile page has a page title in the Explore our network style. */
  kind === "team" && done && React.createElement("h1", {
    className: "ff-h1 ff-big20 ff-pg17-h"
  }, React.createElement("span", { className: "t" }, "Your profile")), done && !editing ? React.createElement(React.Fragment, null, kind === "biz" && welcome && React.createElement(CompanyWelcome, null), React.createElement(DoneProfile17, {
    kind
  }), justShared && kind === "team" && React.createElement("div", {
    className: "ff-pg17-shared"
  }, React.createElement(PublishedPanel, null))) : React.createElement(ProfilePage, null));
}


/* ==== FF Party: Browse ===========================================================================
   Packages first. The guest count and what the person is after narrow the packages; FireFlair's own
   come first. Booking a package starts the event with what was entered and adds the package to it. */
