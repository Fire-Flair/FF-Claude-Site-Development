/* src/components/team/work-location-guide.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const P12_CSS = __ff_css("styles/p12.css");





/* ==========================================================================
   FF TEAM PHASE 1 — screens and parts added for Phase 1.
   Everything below reuses the prototype's own components (Sect, Sheet, Btn,
   Pill, CardFrame, Coin, PlayerTile, ComingSoonTile …) and its store.
   ========================================================================== */

/* --- Work locations ------------------------------------------------------- */
const WORK_LOCATION_GUIDE = [
  "Why list more than one work location?",
  "Listing the towns you work in helps people find you when they search there.",
  "Your primary location comes from your postcode and is used for travel distances.",
];


const WORK_LOCATION_TARGET = 5;


/* Type-ahead suggestions. On the real site this is Griffy's Google Places
   search (src/api/places.ts, "(regions)" only, so areas rather than single
   venues); the prototype can't load Google's script, so it suggests from
   this list and accepts anything typed. No limit on how many are added. */
const UK_PLACES = [
  "Central London", "North London", "East London", "South London", "West London", "City of London",
  "Shoreditch", "Hackney", "Islington", "Camden", "Westminster", "Mayfair", "Soho", "Marylebone", "Chelsea",
  "Kensington", "Notting Hill", "Canary Wharf", "Greenwich", "Clapham", "Brixton", "Battersea", "Fulham",
  "Richmond", "Wimbledon", "Stratford", "Enfield", "Barnet", "Croydon", "Kingston upon Thames", "Harrow",
  "Hertfordshire", "St Albans", "Watford", "Harpenden", "Hatfield", "Cheshunt", "Potters Bar", "Berkhamsted",
  "Essex", "Chelmsford", "Colchester", "Southend-on-Sea", "Kent", "Canterbury", "Tunbridge Wells", "Surrey",
  "Guildford", "Epsom", "Berkshire", "Reading", "Windsor", "Ascot", "Oxford", "Cambridge", "Brighton",
  "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Bath", "Nottingham", "Leicester",
  "Newcastle upon Tyne", "York", "Harrogate", "Chester", "Cheltenham", "The Cotswolds", "Cardiff", "Swansea",
  "Edinburgh", "Glasgow", "Aberdeen", "Belfast", "Southampton", "Portsmouth", "Bournemouth", "Exeter",
  "Plymouth", "Norwich", "Milton Keynes", "Coventry", "Derby", "Northampton", "Ipswich",
];


function placeSuggestions(query, have) {
  const n = String(query || "").trim().toLowerCase();
  const taken = new Set(have.map(h => h.toLowerCase()));
  if (!n) {
    /* Nothing typed yet: areas near the ones already chosen, else the big ones. */
    const near = [...new Set(have.flatMap(h => suggestLocations(h)))];
    const base = near.length ? near : ["Central London", "Manchester", "Birmingham", "Bristol", "Edinburgh", "Hertfordshire"];
    return base.filter(p => !taken.has(p.toLowerCase())).slice(0, 6);
  }
  const starts = UK_PLACES.filter(p => p.toLowerCase().startsWith(n));
  const inside = UK_PLACES.filter(p => !p.toLowerCase().startsWith(n) && p.toLowerCase().includes(n));
  return [...starts, ...inside].filter(p => !taken.has(p.toLowerCase())).slice(0, 8);
}



function WorkLocationsGuide({ count, bare }) {
  const met = count >= WORK_LOCATION_TARGET;
  return (
    <div className={`ff-wlguide${bare ? " bare" : ""}`} role="note">
      <div className="ff-wlguide-h"><MapPin size={15} strokeWidth={1.8} /> {WORK_LOCATION_GUIDE[0]}</div>
      {WORK_LOCATION_GUIDE.slice(1).map((t, i) => <p key={i}>{t}</p>)}
      <div className="ff-wlguide-meter" aria-label={`${count} work locations added`}>
        {Array.from({ length: WORK_LOCATION_TARGET }).map((_, i) => <i key={i} className={i < count ? "on" : ""} />)}
        <span>{met ? `${count} added — add more any time` : `${count} of ${WORK_LOCATION_TARGET} recommended`}</span>
      </div>
      
    </div>
  );
}


function WorkLocationsSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  useEffect(() => {
    if (open) {
      setQ("");
      setEditing(null);
    }
  }, [open]);
  if (!open)
    return null;
  const list = recsOf(state.profile, "locations").filter((r) => !r.proposed);
  const names = list.map((r) => r.name);
  const add = (name) => {
    const v = String(name || "").trim().replace(/\s+/g, " ");
    if (!v)
      return;
    if (names.some((n) => n.toLowerCase() === v.toLowerCase())) {
      dispatch({ type: "TOAST", toast: `${v} is already one of your work locations` });
      setQ("");
      return;
    }
    dispatch({ type: "REC_ADD", category: "locations", record: makeRecord("locations", v) });
    dispatch({ type: "TOAST", toast: `${v} added` });
    setQ("");
  };
  const rename = (r) => {
    const v = editText.trim();
    if (v && v !== r.name) {
      dispatch({ type: "REC_PATCH", category: "locations", id: r.id, patch: { name: v } });
      dispatch({ type: "TOAST", toast: `Renamed to ${v}` });
    }
    setEditing(null);
  };
  const sugg = placeSuggestions(q, names);
  const typed = q.trim();
  const exact = typed && UK_PLACES.some((p) => p.toLowerCase() === typed.toLowerCase());
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: "Add work locations"
  }, React.createElement(WorkLocationsGuide, {
    count: list.length
  }), React.createElement(Field, {
    label: "Add a town or area"
  }, React.createElement("div", {
    style: { position: "relative" }
  }, React.createElement(Search, {
    size: 16,
    color: "#7A7366",
    style: { position: "absolute", left: 12, top: 14 }
  }), React.createElement("input", {
    className: "ff-input",
    style: { paddingLeft: 36 },
    value: q,
    autoFocus: FF_FINE_POINTER && (true),
    placeholder: "e.g. Manchester, Shoreditch, Hertfordshire",
    "aria-label": "Search for a town or area",
    onChange: (e) => setQ(e.target.value),
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        add(sugg[0] && !exact && typed && sugg[0].toLowerCase().startsWith(typed.toLowerCase()) ? sugg[0] : typed);
      }
    }
  }))), React.createElement("div", {
    className: "ff-wlsugg",
    role: "list",
    "aria-label": typed ? "Matching places" : "Suggested places"
  }, sugg.map((p) => React.createElement("button", {
    key: p,
    type: "button",
    role: "listitem",
    className: "ff-chip",
    onClick: () => add(p)
  }, React.createElement(Plus, {
    size: 11
  }), " ", p)), typed && !exact && !names.some((n) => n.toLowerCase() === typed.toLowerCase()) && React.createElement("button", {
    type: "button",
    className: "ff-chip ff-chip-custom",
    onClick: () => add(typed)
  }, React.createElement(Plus, {
    size: 11
  }), " Add “", typed, "”")), React.createElement("div", {
    className: "ff-label",
    style: { margin: "18px 0 8px" }
  }, "Your work locations · ", list.length), list.length === 0 && React.createElement("p", {
    className: "ff-body ff-muted",
    style: { marginTop: 0 }
  }, "None yet. Add the towns and areas where you want to be found."), React.createElement("div", {
    className: "ff-wllist"
  }, list.map((r) => React.createElement("div", {
    key: r.id,
    className: `ff-wlrow${r.hidden ? " hidden" : ""}`
  }, React.createElement(MapPin, {
    size: 14,
    color: "var(--gold-dk)",
    strokeWidth: 1.8
  }), editing === r.id ? React.createElement("input", {
    className: "ff-input",
    autoFocus: FF_FINE_POINTER && (true),
    value: editText,
    "aria-label": `Rename ${r.name}`,
    onChange: (e) => setEditText(e.target.value),
    onBlur: () => rename(r),
    onKeyDown: (e) => {
      if (e.key === "Enter")
        rename(r);
      if (e.key === "Escape")
        setEditing(null);
    }
  }) : React.createElement("span", {
    className: "nm"
  }, r.name, r.hidden ? " · hidden" : ""), editing !== r.id && React.createElement("button", {
    type: "button",
    className: "ff-btn sm ghost",
    "aria-label": `Edit ${r.name}`,
    onClick: () => {
      setEditing(r.id);
      setEditText(r.name);
    }
  }, React.createElement(Pencil, {
    size: 12
  })), React.createElement("button", {
    type: "button",
    className: "ff-btn sm ghost",
    "aria-label": `Remove ${r.name}`,
    onClick: () => {
      dispatch({ type: "REC_DELETE", category: "locations", id: r.id });
      dispatch({ type: "TOAST", toast: `${r.name} removed` });
    }
  }, React.createElement(X, {
    size: 12
  }))))), React.createElement("p", {
    className: "ff-body ff-muted",
    style: { fontSize: 12, margin: "10px 0 14px" }
  }, "Your first three show on your Profile Card. Reorder them with the arrows on the cards in your profile."), React.createElement(Btn, {
    variant: "primary wide",
    onClick: onClose
  }, React.createElement(Check, {
    size: 14
  }), " Done"));
}



/* --- Languages: type-ahead from the master list -------------------------- */
function LanguagePicker({ selected = [], onPick }) {
  const [q, setQ] = useState("");
  const has = (n) => selected.some(x => String(x).toLowerCase() === n.toLowerCase());
  const n = q.trim().toLowerCase();
  const hits = n
    ? LANGUAGE_MASTER.filter(l => l.name.toLowerCase().includes(n) || l.iso === n || LANGUAGE_ALIASES[n] === l.iso)
    : LANGUAGE_MASTER.slice(0, 8);
  const custom = n && !hits.some(l => l.name.toLowerCase() === n) ? q.trim().replace(/\b\w/g, c => c.toUpperCase()) : null;
  return (
    <div className="ff-frame ff-goldpick" style={{ padding: 14, marginTop: 4, marginBottom: 14 }}>
      <div className="ff-label" style={{ marginBottom: 8 }}>{n ? "Matching languages" : "Pick a language"}</div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={15} color="#7A7366" style={{ position: "absolute", left: 11, top: 13 }} />
        <input className="ff-input" style={{ paddingLeft: 34 }} value={q} onChange={(e) => setQ(e.target.value)}
          placeholder="Search 52 languages, or type your own" aria-label="Search languages" />
      </div>
      <div>
        {hits.map(l => (
          <button key={l.iso} type="button" className="ff-chip" onClick={() => { onPick(l.name); setQ(""); }}
            style={has(l.name) ? { background: "#5C1220", borderColor: "#5C1220", color: "#F6E7B4" } : undefined}>
            <LangFlag lang={l.name} /> {l.name}
          </button>
        ))}
        {custom && <button type="button" className="ff-chip ff-chip-custom" onClick={() => { onPick(custom); setQ(""); }}><LangFlag lang="" /> Add “{custom}”</button>}
      </div>
    </div>
  );
}





/* --- Coming Soon card: one design for every future feature ---------------
   A calm white card with the feature's icon, what it will do, and a small
   locked label built into the card, so future features read as planned,
   not unfinished. */
/* WhatsApp's mark in its own green, for a Coming Soon card. */
function WaGlyph({ size = 18 }) { return <span style={{ color: "#1FA855", display: "flex" }}><WhatsAppIcon size={size} /></span>; }



function SoonCard({ icon: Icon, title, note, when = "Coming 2027", next }) {
  return (
    <article className={`ff-soon${next ? " next" : ""}`}>
      <span className="ff-soon-ic" aria-hidden="true">{Icon ? <Icon size={18} strokeWidth={1.7} /> : <Coin size={22} tier="gold" />}<i><Lock size={9} strokeWidth={2.4} /></i></span>
      <div style={{ minWidth: 0 }}>
        <b>{title}</b>
        <p>{note}</p>
        <span className="ff-soon-badge">{next ? <Sparkles size={10} strokeWidth={2.2} /> : <Lock size={10} strokeWidth={2.2} />} {when}</span>
      </div>
    </article>
  );
}




/* Beneath Save & Share, before the profile is saved: where the finished card
   will appear (it does, in Welcome to the Team, once saved). */
function CardPreviewSoon() {
  return (
    <div className="ff-cardpreview-wrap">
      <div className="ff-cardpreview">
        <div className="ff-cardghost" aria-hidden="true">
          <span className="coin"><Coin size={22} tier="gold" /></span>
          <span className="av" /><span className="l1" /><span className="l2" /><span className="l3" /><span className="l4" />
        </div>
        <div className="ff-cardpreview-tx">
          <b>Your complete card will display here</b>
          <p>Save or publish your profile and your finished Profile Card appears here. Share it, and soon add it to your phone's wallet.</p>
        </div>
        <ShareStack />
      </div>
    </div>
  );
}



/* --- FF XP · 2027: the FF coin pop-up ---------------------------------
   The only way into XP. Next steps, then your tier and level, then how FF XP
   works. Uses the prototype's own XP logic (XP_TASKS, XP_VALUES, XP_LEVELS,
   xpProgress, quarterly periods) unchanged. */
function XPPopup({ open, onClose }) {
  const { state, dispatch } = useStore();
  const people = useDirectory();
  if (!open) return null;
  const p = state.profile;
  const live = !!p.live;
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const net = myNetwork(state, people).list.length;
  const lv = verificationLevel(net);
  const go = (tab, focus) => {
    onClose();
    if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab, route: "home" });
    if (focus) dispatch({ type: "FOCUS", focus: { target: focus } }); else window.scrollTo(0, 0);
  };
  const steps = [
    { id: "build", label: "Build your profile", hint: "Your Profile Card, professions and experience", done: cardReady, onClick: () => go("profile", "card") },
    { id: "share", label: "Share your Profile Card", hint: "Publish and send it on WhatsApp", done: live, onClick: () => go("profile", live ? "card" : "share") },
    { id: "grow", label: "Grow your network", hint: `${net} connection${net === 1 ? "" : "s"} so far`, done: net >= VERIFICATION_LEVELS[1].connections, onClick: () => go("network") },
  ];
  return (
    <Sheet open onClose={onClose} title="Next steps">
      <div className="ff-xpsec">
        {steps.map(t => (
          <button key={t.id} type="button" className={`ff-task${t.done ? " done" : ""}`} onClick={t.onClick}>
            <span className="dot">{t.done && <Check size={13} strokeWidth={2.6} />}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span className="ff-serif" style={{ fontSize: 15.5, display: "block", color: "#1D1B18", lineHeight: 1.2 }}>{t.label}</span>
              <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{t.hint}</span>
            </span>
            {t.done ? <Pill tone="ok">Done</Pill> : <ChevronRight size={16} color="var(--gold-dk)" style={{ flex: "none" }} />}
          </button>
        ))}
      </div>
    </Sheet>
  );
}



/* --- Bookings (Phase 1) ---------------------------------------------------
   What works now first in each part, futures as Coming Soon cards: booked
   shifts (Coming 2027), FF Party Service Cards (register interest),
   Availability (peak dates), Training and Dream jobs (register interest). */
function P1Bookings({ guest = false }) {
  const { state, dispatch } = useStore();
  const svcInterest = state.profile.serviceInterest || [];
  const goProfile = () => { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };
  const toggleService = (sv) => {
    if (guest) { goProfile(); dispatch({ type: "TOAST", toast: "Create your Profile Card first, then register for Service Cards" }); return; }
    const on = svcInterest.includes(sv.id);
    dispatch({ type: "PROFILE", patch: { serviceInterest: on ? svcInterest.filter(x => x !== sv.id) : [...svcInterest, sv.id] } });
    dispatch({ type: "TOAST", toast: on ? `Withdrawn from ${sv.title}` : `Registered for ${sv.title}. We'll review your profile.` });
  };
  const jump = (id) => scrollToSection(id);
  const onSubmit = (v) => {
    const t = v.toLowerCase();
    if (/\b(rewards?|perks|gifts?|xp)\b/.test(t)) return jump("ff-rewards");
    if (/\b(train|training|course|wset|masterclass|learn|qualif)/.test(t)) return jump("ff-training");
    if (/\b(festival|yacht|motorsport|abroad|international|cruise|ski|dream|job)/.test(t)) return jump("ff-jobs");
    if (/\b(christmas|halloween|new year|nye|available|availability|dates?|free)\b/.test(t)) return jump("ff-bk-avail");
    if (/\b(service|party|mixology|masterclass|bartending)\b/.test(t)) return jump("ff-bk-party");
    return jump("ff-bk-booked");
  };
  return (
    <div>
      <div className="ff-eyebrow">{guest ? "FireFlair" : "FF Team"}</div>
      <h1 className="ff-h1" style={{ marginTop: 4 }}>Bookings</h1>

      <FFAI title="Search your bookings" onSubmit={onSubmit}
        purpose="Get ready for bookings: tell FireFlair when you're free, which Service Cards you can perform, and the training and jobs you want."
        placeholder="Christmas, mixology, festivals…"
        actions={[
          { label: "Availability", onClick: () => jump("ff-bk-avail") },
          { label: "Service Cards", onClick: () => jump("ff-bk-party") },
          { label: "Training", onClick: () => jump("ff-training") },
          { label: "Dream jobs", onClick: () => jump("ff-jobs") },
          { label: "Rewards", onClick: () => jump("ff-rewards") },
        ]} />

      <section id="ff-bk-booked" className="ff-bkpart">
        <SectionHead icon={<Calendar size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Your bookings" />
        <div className="ff-soonpanel">
          <div className="ff-wa" style={{ marginBottom: 12 }}>
            <span className="ff-wa-ico"><WhatsAppIcon size={22} /></span>
            <span className="ff-body" style={{ color: "#0B3D22", fontSize: 13.5 }}>
              <b>Requests come to you on WhatsApp.</b> When companies and clients ask if you're free, each request is sent to you directly on WhatsApp and shows here. You reply in either place.
            </span>
          </div>
          <p className="ff-soonpanel-lede">Your booked shifts will be shown here. Bookings open with FF Staff and FF Party.</p>
          <div className="ff-soongrid">
            <SoonCard icon={WaGlyph} title="Requests from companies" note="Businesses ask if you're free, on WhatsApp. You reply there or here." when="Coming with FF Staff" />
            <SoonCard icon={Calendar} title="Booked shifts" note="Confirmed shifts with the venue, times and directions, in one place." when="Coming with FF Staff and FF Party" />
            <SoonCard icon={Wallet} title="Booking passes" note="Each confirmed booking as a pass in Apple Wallet or Google Wallet." when="Coming 2027" />
          </div>
        </div>
      </section>

      <div className="ff-bkgroup-h">
        <span className="ff-eyebrow">Available now</span>
        <h2 className="ff-h2">Get ready for bookings</h2>
      </div>

      <section id="ff-bk-party" className="ff-bkpart">
        <SectionHead icon={<Martini size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="FF Party Service Cards"
          action={<Pill tone="gold">{svcInterest.length ? `${svcInterest.length} registered` : "Register interest"}</Pill>} />
        <p className="ff-body" style={{ marginTop: -2, fontSize: 13.5 }}>
          Register for the Service Cards you can perform. We'll review your profile, and once FF Party launches, your profile will be advertised alongside those Service Cards.
        </p>
        <HScroll label="FF Party Service Cards" snap>
          {PARTY_SERVICES.map(sv => {
            const on = svcInterest.includes(sv.id);
            return (
              <div key={sv.id} style={{ width: CARD_W.poster }}>
                <ServicePoster svc={sv} />
                <div className="ff-svcreg">
                  {on ? (<>
                    <span className="ff-svcreg-on"><Check size={14} strokeWidth={2.6} /> Registered · we'll review your profile</span>
                    <button type="button" className="ff-linkbtn" onClick={() => toggleService(sv)}>Withdraw</button>
                  </>) : (
                    <Btn variant="primary wide" onClick={() => toggleService(sv)}><Star size={14} /> Register interest</Btn>
                  )}
                </div>
              </div>
            );
          })}
        </HScroll>
      </section>

      <section id="ff-bk-avail" className="ff-bkpart">
        <SectionHead icon={<Clock size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Availability" />
        <p className="ff-body" style={{ marginTop: -2, fontSize: 13.5 }}>
          Answer once and it's saved. Businesses see your answer when they ask about a date, and you're first in line on the busiest dates of the year.
        </p>
        <AvailabilityCards />
        <div className="ff-bkgroup-h" style={{ margin: "18px 0 8px" }}><span className="ff-eyebrow">Busy dates</span></div>
        <PeakAvailability />
      </section>

      <TrainingSection />
      <JobsSection />
      <P1RewardsSection />
    </div>
  );
}
