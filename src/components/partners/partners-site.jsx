/* src/components/partners/partners-site.jsx — FF Partners (Phase 3): router, home, People, Bookings, Profile, the property editor,
   the guest page and the guest brief. Part of the FireFlair prototype script (classic script, shared global scope; files are joined
   in the order of src/manifest.json). Data and rules live in state/partners17.js; presentation reuses the shared shell, Discover hub,
   Business Support block, card share menu, media picker and FF Party booking flow. */

const ptnIcon = (n) => lucideIcon(n);

/* Any part of the site can ask the Partners shell to do something: "brief", "brief:<text>", "brief:pkg:<id>", "addProperty", "bookings", "people". */
const ptnDo = (what) => window.dispatchEvent(new CustomEvent("ff-ptn", { detail: what }));

function PtnShine({ onClick, children }) {
  return (
    <button type="button" className="ff-btn ff-shine" onClick={onClick}>
      <i className="sp s1" aria-hidden="true" /><i className="sp s2" aria-hidden="true" /><i className="sp s3" aria-hidden="true" />
      <span className="lab">{children}</span>
    </button>
  );
}

const ptnSignedIn = (state) => !!ptnOwner(state);
const ptnLogin = () => window.dispatchEvent(new Event("ff-login"));

/* ---- Hash route: #/ff-partners/p/<id> opens the guest page. In Phase 2 it takes the safe path (a note, then the FF Team home). ---- */
function PtnRoute() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  useEffect(() => {
    const sync = () => {
      const m = PTN_ROUTE_RE.exec(String(window.location.hash || ""));
      const cur = ref.current.ptnGuest;
      if (m) {
        if (ph17(ref.current) === 2) {
          try { window.history.replaceState(null, "", window.location.pathname + window.location.search); } catch (e) { /* ignore */ }
          dispatch({ type: "TOAST", toast: "FF Partners is part of Phase 3" });
          return;
        }
        const id = m[1];
        if (!cur || cur.id !== id) dispatch({ type: "V11_SET", patch: { ptnGuest: { id } } });
      } else if (cur) dispatch({ type: "V11_SET", patch: { ptnGuest: null } });
    };
    sync();
    window.addEventListener("popstate", sync); window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  return null;
}

function ptnOpenGuest(dispatch, id) {
  try { const u = "#/ff-partners/p/" + id; if (window.location.hash !== u) window.history.pushState({ ff: "ptn" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { ptnGuest: { id } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}

function ptnCloseGuest(dispatch) {
  try { window.history.pushState(null, "", window.location.pathname + window.location.search); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { ptnGuest: null } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}

/* ---- Router ---- */
function PartnersRouter() {
  const { state, dispatch } = useStore();
  const [brief, setBrief] = useState(null);
  const owner = ptnOwner(state);
  /* Switching to Phase 2 while on Partners: same safe path as a closed site. */
  useEffect(() => {
    if (ph17(state) === 2) { dispatch({ type: "TOAST", toast: "FF Partners is part of Phase 3" }); dispatch({ type: "ROLE", role: "team" }); }
  }, [state.phase17]);
  useEffect(() => {
    const h = (e) => {
      const w = String(e.detail || "");
      if (w === "brief" || w.indexOf("brief:") === 0) {
        const rest = w.slice(6);
        setBrief(rest.indexOf("pkg:") === 0 ? { pkg: rest.slice(4) } : { text: rest });
      } else if (w === "addProperty") { dispatch({ type: "V11_SET", patch: { ptnEdit: "new" } }); dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0); }
      else if (w === "bookings") { dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); }
      else if (w === "people") { dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); }
    };
    window.addEventListener("ff-ptn", h);
    return () => window.removeEventListener("ff-ptn", h);
  }, []);
  const { tab } = state;
  if (state.viewing) return <PersonProfile />;
  let body;
  if (tab === "network") body = <><PtnPeople /><V101.BusinessSupport19 /></>;
  else if (tab === "bookings") body = <><PtnBookings /><V101.BusinessSupport19 /></>;
  else if (tab === "profile") body = <PtnProfile />;
  else body = <PtnHome />;
  return <>{body}{brief && <PtnBriefSheet open onClose={() => setBrief(null)} preset={brief} />}</>;
}

/* ---- Home ---- */
function PtnHero() {
  const { state, dispatch } = useStore();
  const member = !!ptnMine(ptnGet(), ptnOwner(state)).partner;
  const User = ptnIcon("Handshake");
  const IM = window.FF_IMG || {};
  const become = () => { if (!ptnSignedIn(state)) { ptnLogin(); return; } dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0); };
  return (
    <section className="ff-hero18 ff-hero11 vip ff-ptn-hero" aria-labelledby="ff-ptn-h" id="ff-hero">
      <div className="ff-hero18-img">
        {IM.hero ? <img decoding="async" className="ff-hero18-photo" src={IM.hero} srcSet={IM.hero_sm ? `${IM.hero_sm} 900w, ${IM.hero} 1800w` : undefined} sizes="(min-width:900px) 760px, 100vw" alt="" /> : null}
        <div className="ff-hero18-fade" aria-hidden="true" />
        <span className="ff-hero18-shadow" aria-hidden="true" />
        <span className="ff-hero18-coin refl" aria-hidden="true"><SiteHeroCoin site="partners" /></span>
        <span className="ff-hero18-coin ff-hero17-coin"><SiteHeroCoin site="partners" /></span>
      </div>
      <div className="ff-hero18-in">
        <h1 id="ff-ptn-h" className="ff-hero17-h ff-hero-h101">Bring exceptional experiences to your guests.</h1>
        <p className="ff-hero-sub101">Offer private cocktail experiences at your property, or work with FireFlair to arrange something bespoke for your guests.</p>
        <div className="ff-hero17-cta two">
          <PtnShine onClick={become}><User size={15} /> {member ? "Open your partner profile" : "Become a partner"}</PtnShine>
          <button type="button" className="ff-btn" onClick={() => ptnDo("brief")}>Arrange an experience</button>
        </div>
      </div>
    </section>
  );
}

function PtnPropertiesPanel() {
  const data = usePtn();
  const list = ptnPublicList(data);
  const { dispatch } = useStore();
  return (
    <div className="ff-ptn-panel">
      <div className="ff-ptn-chips">{PTN_PROP_TYPES.map((t) => <span key={t} className="ff-ptn-chip">{t}</span>)}</div>
      <p>One operator can manage a whole collection, each property with its own place, offer, rules and guest link. Bars and restaurants can be listed as venues for private experiences.</p>
      <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => ptnDo("addProperty")}><Plus size={14} /> Add your property</Btn></div>
      {list.length === 0 ? null : (
        <ul className="ff-ptn-list" aria-label="Listed properties">
          {list.map((p) => <li key={p.id}><button type="button" onClick={() => ptnOpenGuest(dispatch, p.id)}><b>{p.name}</b><small>{[p.type, p.location].filter(Boolean).join(" · ")}</small></button></li>)}
        </ul>)}
    </div>
  );
}

function PtnPackageList() {
  return (
    <ul className="ff-ptn-pk" aria-label="FF Party packages">
      {ptnPackages().map((p) => (
        <li key={p.id}>
          <b>{p.name}</b>
          <small>{p.durationLabel} · {pkgPriceLabel17(p.id)}</small>
          <span>{p.includes}</span>
        </li>))}
    </ul>
  );
}

function PtnIdeas({ title, tag, list }) {
  return (
    <div className="ff-ptn-ideas">
      <h3>{title}</h3>
      <ul>{list.map(([t, d]) => <li key={t}><span><b>{t}</b><small>{d}</small></span><button type="button" className="ff-btn" onClick={() => ptnDo("brief:" + t)}>Enquire</button></li>)}</ul>
      <small className="ff-ptn-tag">{tag}</small>
    </div>
  );
}

function PtnExperiencesPanel() {
  return (
    <div className="ff-ptn-panel">
      <PtnPackageList />
      <PtnIdeas title="At the property" tag="Arranged with a partner" list={PTN_AT_PROPERTY} />
      <PtnIdeas title="Explore locally" tag="Arranged with a local specialist. Accommodation and transport tickets stay with the operator." list={PTN_LOCAL} />
    </div>
  );
}

function PtnEventsPanel() {
  return (
    <div className="ff-ptn-panel">
      <div className="ff-ptn-chips">{PTN_OCCASIONS.map((o) => <button key={o} type="button" className="ff-ptn-chip btn" onClick={() => ptnDo("brief:occ:" + o)}>{o}</button>)}</div>
      <p>Brief a celebration, a private dinner, a club evening, a retreat or a whole itinerary in one place: the occasion, where and when, and what your guest would like arranged.</p>
      <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => ptnDo("brief")}>Arrange an experience</Btn></div>
    </div>
  );
}

function PtnOpsPanel() {
  const goSite = useGoSite();
  return (
    <div className="ff-ptn-panel">
      <ul className="ff-ptn-cap" aria-label="Capabilities">{PTN_CAPABILITIES.map(([t, d]) => <li key={t}><b>{t}</b><small>{d}</small></li>)}</ul>
      <div className="ff-ptn-btns">
        <Btn variant="gold" onClick={() => ptnDo("brief:Introductions and operational support")}>Ask for an introduction</Btn>
        <Btn onClick={() => ptnDo("people")}>Find professionals</Btn>
        <Btn variant="ghost" onClick={() => goSite("staff")}>Hire shift staff on FF Staff</Btn>
      </div>
    </div>
  );
}

function ptnDx() {
  const I = lucideIcon;
  const part = (id, label, C) => ({ id, label, r: () => React.createElement(C, null) });
  return [
    { k: "properties", t: "Properties", s: "Add a property", img: "t17_p30", pool: ["p30", "p01", "v01", "p14", "vke02"], icon: I("House"),
      h: "Your properties, your guest link.",
      p: ["Add a holiday home, villa, chalet, boutique hotel, resort, private estate or club, one property or a whole collection.", "Choose the experiences you approve and share one guest link."],
      parts: [part("ff-ptn-props", "Properties", PtnPropertiesPanel)],
      jn: [{ t: "Add your property", b: "Add your property", go: "ev:addProperty", x: "A name, a place and a type is enough to start a draft." },
        { t: "Manage your collection", b: "Open your profile", go: "profile", x: "Every property has its own place, offer, rules and guest link." },
        { t: "Share the guest page", b: "Open your profile", go: "profile", x: "Share a co-branded FF Party page in your pre-arrival guide." }] },
    { k: "experiences", t: "Experiences", s: "What guests can book", img: "t17_p32", pool: ["p32", "aiMusic", "p24", "aiIntl", "p46"], icon: I("Martini"),
      h: "Private cocktail experiences.",
      p: ["Private mixologists and cocktail masterclasses come first, with every FF Party package and what it includes.", "Dinners, tastings and local outings are arranged on request."],
      parts: [part("ff-ptn-exp", "Experiences", PtnExperiencesPanel)],
      jn: [{ t: "See the packages", b: "Arrange an experience", go: "ev:brief", x: "Choose a package or describe something bespoke." },
        { t: "Offer them at your property", b: "Add your property", go: "ev:addProperty", x: "Select the experiences you approve for each property." },
        { t: "Explore locally", b: "Arrange an experience", go: "ev:brief", x: "Vineyards, boats, workshops and tours, arranged with local specialists." }] },
    { k: "events", t: "Events & itineraries", s: "Brief a guest experience", img: "t17_p31", pool: ["p31", "vke04", "p11", "p35", "p27"], icon: I("CalendarDays"),
      h: "Arrange something for a guest.",
      p: ["A birthday, an anniversary dinner, a wedding celebration, a club evening, a retreat or a bespoke itinerary.", "You do not need a listed property to send a brief."],
      parts: [part("ff-ptn-ev", "Events and itineraries", PtnEventsPanel)],
      jn: [{ t: "Brief an occasion", b: "Arrange an experience", go: "ev:brief", x: "The occasion, the place, the date and what your guest would like." },
        { t: "Follow your requests", b: "Open Bookings", go: "ev:bookings", x: "Every brief and linked booking, with its real state." },
        { t: "Start with a place", b: "Arrange an experience", go: "ev:brief", x: "Describe a day or an evening with several elements in one brief." }] },
    { k: "people", t: "People & operations", s: "Introductions and support", img: "t17_p12", pool: ["p12", "p18", "p20", "p15", "p08"], icon: I("Users"),
      h: "The right people behind your property.",
      p: ["Find hospitality professionals, or ask for introductions and operational support.", "Shift hiring happens on FF Staff."],
      parts: [part("ff-ptn-ops", "People and operations", PtnOpsPanel)],
      jn: [{ t: "Find professionals", b: "Open People", go: "network", x: "Browse hospitality profiles and relevant contacts." },
        { t: "Ask for an introduction", b: "Ask for an introduction", go: "ev:brief:Introductions and operational support", x: "Property launches, guest services, suppliers and advisory work." },
        { t: "Hire shift staff", b: "Go to FF Staff", go: "site:staff", x: "Create shifts and hire from the network on FF Staff." }] },
  ];
}

const PTN_FAQ = [
  ["Who is FF Partners for?", "Holiday-let hosts, property managers, boutique hotels, private clubs and concierges. Independent hosts and companies are both welcome."],
  ["Do I need a property to work with you?", "No. A concierge can send a brief for a guest without listing a property."],
  ["What does the guest see?", "A co-branded FF Party page with your property, your rules, your published answers and the experiences you approve. Accommodation, availability and payment stay on your own site."],
  ["Who takes the booking?", "Guests book an FF Party package through the usual FF Party flow, with the normal deposit and terms. Anything that needs arranging is an enquiry first."],
  ["Which places do you cover?", "The UK is the pilot. Other places, including Italy, are welcome as enquiries until availability is confirmed."],
];

function PtnCases() {
  return (
    <section className="ff-sect ff-ptn-sect" aria-labelledby="ff-ptn-ch">
      <h2 id="ff-ptn-ch" className="ff-h1">How partners use it</h2>
      <div className="ff-ptn-cases">
        <article><b>A host</b><p>Shares a private cocktail masterclass link in the pre-arrival guest guide.</p></article>
        <article><b>A concierge</b><p>Asks FireFlair to arrange an anniversary dinner, a sommelier-led tasting and a local outing for the same guest.</p></article>
      </div>
    </section>
  );
}

function PtnHow() {
  return (
    <section className="ff-sect ff-ptn-sect" aria-labelledby="ff-ptn-hh">
      <h2 id="ff-ptn-hh" className="ff-h1">How it works</h2>
      <ol className="ff-ptn-steps">
        <li><b>1</b><span>Add a property, or send a brief</span></li>
        <li><b>2</b><span>Choose what to offer</span></li>
        <li><b>3</b><span>Share the guest page, or follow the request</span></li>
      </ol>
    </section>
  );
}

function PtnPropsHome() {
  return (
    <section className="ff-sect ff-ptn-sect" aria-labelledby="ff-ptn-ph">
      <h2 id="ff-ptn-ph" className="ff-h1">Properties</h2>
      <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => ptnDo("addProperty")}><Plus size={14} /> Add your property</Btn></div>
    </section>
  );
}

function PtnFaq() {
  return (
    <section className="ff-sect ff-ptn-sect" aria-labelledby="ff-ptn-fh">
      <h2 id="ff-ptn-fh" className="ff-h1">Questions</h2>
      <div className="ff-ptn-faq">{PTN_FAQ.map((q) => <details key={q[0]}><summary>{q[0]}</summary><p>{q[1]}</p></details>)}</div>
    </section>
  );
}

function PtnHome() {
  const X = window.__ffVipX || {};
  const Hub = X.DiscoverHub11;
  return (
    <div className="ff-home ff-home11 ff-ptn">
      <div className="ff-home17">
        <PtnHero />
        {Hub ? <Hub cats={ptnDx()} kind="partners" /> : null}
        <PtnPropsHome />
        <PtnCases />
        <PtnHow />
        <V101.BusinessSupport19 />
        <PtnFaq />
      </div>
    </div>
  );
}

/* ---- People: the existing discovery pattern, with an introductions action ---- */
function PtnPeople() {
  return (
    <div className="ff-ptn">
      <div className="ff-ptn-bar"><Btn variant="gold" onClick={() => ptnDo("brief:Introductions and operational support")}>Ask for an introduction</Btn></div>
      <StaffRosterStaff11 />
    </div>
  );
}

/* ---- Bookings: briefs and linked experience bookings ---- */
function PtnBookings() {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const owner = ptnOwner(state);
  const mine = ptnMine(data, owner);
  const linked = ptnLinkedBookings(state, owner);
  const propName = (id) => { const p = (mine.properties || []).find((x) => x.id === id); return p ? p.name : ""; };
  return (
    <div className="ff-ptn ff-ptn-bk">
      <div className="ff-eyebrow">FF Partners</div>
      <h1 className="ff-h1" style={{ marginTop: 4 }}>Bookings</h1>
      <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => ptnDo("brief")}>Arrange an experience</Btn></div>
      {!owner ? <div className="ff-ptn-card"><p>Sign in to see your requests and bookings.</p><Btn onClick={ptnLogin}>Sign in</Btn></div> : (
        <>
          <section className="ff-ptn-sec" aria-labelledby="ff-ptn-br"><h2 id="ff-ptn-br" className="ff-h2">Requests <i>{(mine.briefs || []).length}</i></h2>
            {(mine.briefs || []).length === 0 ? <p className="ff-ptn-none">No requests yet.</p> : (
              <ul className="ff-ptn-rows">{mine.briefs.map((b) => (
                <li key={b.id}>
                  <b>{b.occasion}{b.propertyId && propName(b.propertyId) ? ` · ${propName(b.propertyId)}` : ""}</b>
                  <small>{[b.iso ? longDate(b.iso) : "Flexible dates", b.location, b.guests ? b.guests + " guests" : ""].filter(Boolean).join(" · ")}</small>
                  <span>{b.requested}</span>
                  <em className="ff-ptn-state">{b.local && b.stage === "review" ? "Saved on this device. Not yet with FireFlair" : sr17Label(b.stage)}</em>
                  {b.pkg && PKG_BY17[b.pkg] && b.propertyId ? <Btn variant="ghost" onClick={() => { const r = ptnResolve(ptnGet(), b.propertyId, owner); if (r.view) ptnHandoff(state, dispatch, r.view, b.pkg); }}>Continue with FF Party</Btn> : null}
                </li>))}</ul>)}
          </section>
          <section className="ff-ptn-sec" aria-labelledby="ff-ptn-bl"><h2 id="ff-ptn-bl" className="ff-h2">Experience bookings <i>{linked.length}</i></h2>
            {linked.length === 0 ? <p className="ff-ptn-none">No bookings yet.</p> : (
              <ul className="ff-ptn-rows">{linked.map((x) => (
                <li key={x.id}><b>{x.title}{x.property ? ` · ${x.property}` : ""}</b><small>{[x.date, x.guests ? x.guests + " guests" : ""].filter(Boolean).join(" · ")}</small>
                  <span>{x.packages.join(", ")}</span><em className="ff-ptn-state">{x.status}</em></li>))}</ul>)}
          </section>
        </>)}
    </div>
  );
}

/* ---- The brief (enquiry) ---- */
function PtnBriefSheet({ open, onClose, preset, propertyId }) {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const owner = ptnOwner(state);
  const mine = ptnMine(data, owner);
  const p0 = preset || {};
  const occ0 = p0.text && p0.text.indexOf("occ:") === 0 ? p0.text.slice(4) : "";
  const req0 = p0.pkg && PKG_BY17[p0.pkg] ? PKG_BY17[p0.pkg].name : (p0.text && p0.text.indexOf("occ:") !== 0 ? p0.text : "");
  const [f, setF] = useState(() => ({ occasion: occ0 || (req0 ? "Something else" : ""), location: "", iso: "", flex: false, guests: "", requested: req0, timing: "", prefs: "", language: "",
    replyName: (mine.partner && mine.partner.name) || "", replyContact: (mine.partner && mine.partner.contactValue) || "", guestContact: "", forGuest: false, propertyId: propertyId || "" }));
  const [err, setErr] = useState("");
  const [done, setDone] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const send = () => {
    const ci = cleanIso11(f.iso);
    if (!f.occasion) { setErr("Choose the occasion"); return; }
    if (!f.requested.trim()) { setErr("Say what you would like arranged"); return; }
    if (!f.flex && !f.iso) { setErr("Add a date, or choose flexible dates"); return; }
    if (!f.flex && ci.past) { setErr("That date has already passed. Choose today or a later date"); return; }
    if (!f.replyContact.trim()) { setErr("Add the best way to reply to you"); return; }
    if (!owner) { ptnLogin(); setErr("Sign in to save this request"); return; }
    setErr("");
    const r = ptnAddBrief(owner, { occasion: f.occasion, location: f.location.trim(), iso: f.flex ? "" : ci.iso, flex: f.flex, guests: String(f.guests || "").trim(), requested: f.requested.trim(),
      timing: f.timing.trim(), prefs: f.prefs.trim(), language: f.language, replyName: f.replyName.trim(), replyContact: f.replyContact.trim(), guestContact: f.forGuest ? f.guestContact.trim() : "",
      propertyId: f.propertyId || "", pkg: p0.pkg || "" });
    track17("partners_brief_saved", { local: true });
    setDone(r.dup ? "This request is already saved." : "Saved on this device.");
  };
  if (!open) return null;
  const props = mine.properties || [];
  return (
    <Sheet open onClose={onClose} title="Arrange an experience">
      {done ? (
        <div className="ff-ptn-done" role="status">
          <b>{done}</b>
          <p>It has not been sent to FireFlair yet. It appears in Bookings with its real state, and will go to FireFlair once this preview is connected.</p>
          <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => { onClose(); ptnDo("bookings"); }}>Open Bookings</Btn><Btn variant="ghost" onClick={onClose}>Close</Btn></div>
        </div>
      ) : (
        <div className="ff-ptn-form">
          <Field label="Occasion or experience"><select className="ff-input" value={f.occasion} onChange={set("occasion")}><option value="">Choose</option>{PTN_OCCASIONS.map((o) => <option key={o}>{o}</option>)}</select></Field>
          <Field label="What would you like arranged?"><textarea className="ff-input" rows={3} value={f.requested} onChange={set("requested")} /></Field>
          <Field label="Location"><input className="ff-input" value={f.location} onChange={set("location")} /></Field>
          <div className="ff-ptn-two">
            <Field label="Date"><input className="ff-input" type="date" value={f.iso} disabled={f.flex} onChange={set("iso")} /></Field>
            <Field label="Guests"><input className="ff-input" inputMode="numeric" value={f.guests} onChange={(e) => setF((x) => ({ ...x, guests: e.target.value.replace(/[^\d]/g, "").slice(0, 4) }))} /></Field>
          </div>
          <label className="ff-ptn-check"><input type="checkbox" checked={f.flex} onChange={set("flex")} /> Flexible dates</label>
          <Field label="Timing"><input className="ff-input" value={f.timing} onChange={set("timing")} /></Field>
          <Field label="Preferences"><textarea className="ff-input" rows={2} value={f.prefs} onChange={set("prefs")} /></Field>
          <Field label="Language"><select className="ff-input" value={f.language} onChange={set("language")}><option value="">Any</option>{LANGUAGE_MASTER.slice(0, 14).map((l) => <option key={l.iso}>{l.name}</option>)}</select></Field>
          {props.length > 0 && <Field label="Property"><select className="ff-input" value={f.propertyId} onChange={set("propertyId")}><option value="">None</option>{props.map((p) => <option key={p.id} value={p.id}>{p.name || "Untitled property"}</option>)}</select></Field>}
          <div className="ff-ptn-two">
            <Field label="Your name"><input className="ff-input" value={f.replyName} onChange={set("replyName")} /></Field>
            <Field label="Best way to reply"><input className="ff-input" value={f.replyContact} onChange={set("replyContact")} /></Field>
          </div>
          <label className="ff-ptn-check"><input type="checkbox" checked={f.forGuest} onChange={set("forGuest")} /> I have my guest's contact</label>
          {f.forGuest && <Field label="Guest contact"><input className="ff-input" value={f.guestContact} onChange={set("guestContact")} /></Field>}
          {err && <p className="ff-ptn-err" role="alert">{err}</p>}
          <div className="ff-ptn-btns"><Btn variant="gold" onClick={send}>Save request</Btn></div>
        </div>)}
    </Sheet>
  );
}

/* ---- Profile: partner details, the card, Your properties ---- */
function PtnProfile() {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const owner = ptnOwner(state);
  const mine = ptnMine(data, owner);
  const edit = state.ptnEdit;
  if (!owner) {
    return (
      <div className="ff-ptn">
        <div className="ff-eyebrow">FF Partners</div>
        <h1 className="ff-h1" style={{ marginTop: 4 }}>Profile</h1>
        <div className="ff-ptn-card"><p>Sign in to set up your partner profile and add your properties.</p><Btn variant="gold" onClick={ptnLogin}>Sign in</Btn></div>
      </div>);
  }
  if (!mine.partner) return <PtnPartnerForm owner={owner} first />;
  const pr = mine.partner;
  return (
    <div className="ff-ptn">
      <div className="ff-eyebrow">FF Partners</div>
      <h1 className="ff-h1" style={{ marginTop: 4 }}>Profile</h1>
      <div className="ff-ptn-cardwrap"><CompanyCardFace c={{ name: pr.org, slug: slugify(pr.org), theme: "onyx", layout: "logo", areas: (PTN_PARTNER_TYPES.find((t) => t[0] === pr.type) || [])[1] || "" }} /></div>
      {state.ptnPartnerEdit ? <PtnPartnerForm owner={owner} onDone={() => dispatch({ type: "V11_SET", patch: { ptnPartnerEdit: false } })} /> : (
        <div className="ff-ptn-btns"><Btn variant="ghost" onClick={() => dispatch({ type: "V11_SET", patch: { ptnPartnerEdit: true } })}>Edit details</Btn></div>)}
      <section className="ff-ptn-sec" aria-labelledby="ff-ptn-yp">
        <h2 id="ff-ptn-yp" className="ff-h2">Your properties <i>{(mine.properties || []).length}</i></h2>
        <div className="ff-ptn-btns"><Btn variant="gold" onClick={() => dispatch({ type: "V11_SET", patch: { ptnEdit: "new" } })}><Plus size={14} /> Add your property</Btn></div>
        <ul className="ff-ptn-rows">{(mine.properties || []).map((p) => (
          <li key={p.id}><b>{p.name || "Untitled property"}</b><small>{[p.type, p.location].filter(Boolean).join(" · ")}</small>
            <em className="ff-ptn-state">{p.paused ? "Paused" : p.visibility === "public" ? "Public" : p.visibility === "link" ? "Link only" : "Draft"}</em>
            <Btn variant="ghost" onClick={() => dispatch({ type: "V11_SET", patch: { ptnEdit: p.id } })}>Edit</Btn></li>))}</ul>
      </section>
      <section className="ff-ptn-sec" aria-labelledby="ff-ptn-yq">
        <h2 id="ff-ptn-yq" className="ff-h2">Questions and answers</h2>
        <p className="ff-ptn-none">Each property has its own answers. Open a property to edit them.</p>
      </section>
      {edit && <PtnPropertySheet key={edit} id={edit} owner={owner} onClose={() => dispatch({ type: "V11_SET", patch: { ptnEdit: null } })} />}
    </div>
  );
}

function PtnPartnerForm({ owner, first, onDone }) {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const cur = ptnMine(data, owner).partner || {};
  const [f, setF] = useState(() => ({ name: cur.name || "", org: cur.org || "", type: cur.type || "host", contactPref: cur.contactPref || "WhatsApp", contactValue: cur.contactValue || "", website: cur.website || "" }));
  const [err, setErr] = useState("");
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const save = () => {
    if (!f.name.trim() || !f.org.trim()) { setErr("Add your name and your organisation or trading name"); return; }
    if (f.website.trim() && !ptnUrl(f.website)) { setErr("That web address is not valid"); return; }
    ptnPatchOwner(owner, (rec) => ({ ...rec, partner: { ...f, name: f.name.trim(), org: f.org.trim(), website: f.website.trim(), contactValue: f.contactValue.trim() } }));
    dispatch({ type: "TOAST", toast: "Saved on this device" });
    if (onDone) onDone();
  };
  return (
    <div className={first ? "ff-ptn" : ""}>
      {first && <><div className="ff-eyebrow">FF Partners</div><h1 className="ff-h1" style={{ marginTop: 4 }}>Become a partner</h1></>}
      <div className="ff-ptn-form ff-ptn-card">
        <Field label="Contact name"><input className="ff-input" value={f.name} onChange={set("name")} /></Field>
        <Field label="Organisation or trading name"><input className="ff-input" value={f.org} onChange={set("org")} /></Field>
        <Field label="Partner type"><select className="ff-input" value={f.type} onChange={set("type")}>{PTN_PARTNER_TYPES.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></Field>
        <div className="ff-ptn-two">
          <Field label="Preferred contact"><select className="ff-input" value={f.contactPref} onChange={set("contactPref")}>{PTN_CONTACT_PREFS.map((c) => <option key={c}>{c}</option>)}</select></Field>
          <Field label={f.contactPref === "Email" ? "Email" : "Number"}><input className="ff-input" value={f.contactValue} onChange={set("contactValue")} /></Field>
        </div>
        <Field label="Website or portfolio"><input className="ff-input" value={f.website} onChange={set("website")} /></Field>
        {err && <p className="ff-ptn-err" role="alert">{err}</p>}
        <div className="ff-ptn-btns"><Btn variant="gold" onClick={save}>{first ? "Create partner profile" : "Save"}</Btn></div>
        {PTN.persisted === false && <p className="ff-ptn-none">This browser is blocking storage, so this is kept only while the page is open.</p>}
      </div>
    </div>
  );
}

/* The property card: the shareable, guest-facing card. No private fields. */
function PtnPropCard({ view }) {
  return (
    <div className="ff-ptn-pcard">
      {view.photos[0] ? <img decoding="async" src={view.photos[0]} alt="" draggable={false} /> : <span className="ph"><SiteHeroCoin site="partners" /></span>}
      <div className="tx"><small>{view.type}</small><b>{view.name}</b><span>{view.location}</span><em>Book a private cocktail experience</em></div>
    </div>
  );
}

function PtnPropertySheet({ id, owner, onClose }) {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const mine = ptnMine(data, owner);
  const existing = id === "new" ? null : (mine.properties || []).find((p) => p.id === id);
  const [pid] = useState(() => existing ? existing.id : ptnId("p"));
  const [d, setD] = useState(() => existing ? { ...existing, qa: { ...(existing.qa || {}) }, priv: { ...(existing.priv || {}) } }
    : { id: pid, name: "", type: "", location: "", cc: "", website: "", listing: "", description: "", photos: [], experiences: [], rules: "", qa: {}, priv: { address: "", access: "", notes: "" }, visibility: "draft", paused: false });
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [saved, setSaved] = useState(!!existing);
  const set = (k, v) => { setD((x) => ({ ...x, [k]: v })); setSaved(false); };
  const hits = q.trim().length < 2 ? [] : fdSearch(q).filter((n) => n.cc);
  const ready = ptnReady(d);
  const toggleExp = (xid) => set("experiences", d.experiences.includes(xid) ? d.experiences.filter((x) => x !== xid) : [...d.experiences, xid]);
  const setQa = (k, patch) => set("qa", { ...d.qa, [k]: { ...(d.qa[k] || {}), ...patch } });
  const save = (vis) => {
    if (!String(d.name).trim()) { setErr("Add the property name"); return false; }
    if (d.website.trim() && !ptnUrl(d.website)) { setErr("The website address is not valid"); return false; }
    if (d.listing.trim() && !ptnUrl(d.listing)) { setErr("The listing address is not valid"); return false; }
    if (vis && vis !== "draft" && !ready) { setErr("Add the property name, type and place first"); return false; }
    setErr("");
    const rec = { ...d, name: d.name.trim(), visibility: vis || d.visibility, updatedAt: Date.now(), createdAt: d.createdAt || Date.now() };
    ptnPatchOwner(owner, (r) => ({ ...r, properties: (r.properties || []).some((p) => p.id === rec.id) ? r.properties.map((p) => p.id === rec.id ? rec : p) : [...(r.properties || []), rec] }));
    setD(rec); setSaved(true);
    dispatch({ type: "TOAST", toast: "Saved on this device" });
    return true;
  };
  const view = ptnPublicView(d, mine.partner, owner);
  const shareable = saved && d.visibility !== "draft" && !d.paused;
  return (
    <Sheet open onClose={onClose} title={existing ? "Edit property" : "Add your property"}>
      <div className="ff-ptn-form">
        <Field label="Property name"><input className="ff-input" value={d.name} onChange={(e) => set("name", e.target.value)} /></Field>
        <Field label="Type"><select className="ff-input" value={d.type} onChange={(e) => set("type", e.target.value)}><option value="">Choose</option>{PTN_PROP_TYPES.map((t) => <option key={t}>{t}</option>)}</select></Field>
        <Field label="Location">
          <input className="ff-input" value={d.location || q} onChange={(e) => { setQ(e.target.value); set("location", e.target.value); set("cc", ""); }} />
        </Field>
        {hits.length > 0 && !d.cc && <ul className="ff-ptn-hits" role="listbox" aria-label="Places">{hits.map((n) => <li key={n.id}><button type="button" onClick={() => { setD((x) => ({ ...x, location: n.name + (fdChain(n) ? ", " + fdChain(n) : ""), cc: n.cc })); setQ(""); setSaved(false); }}>{n.name}<small>{fdChain(n)}</small></button></li>)}</ul>}
        {String(d.location).trim() && d.cc !== "GB" && <p className="ff-ptn-tag">Outside the UK pilot, or not matched to the location list. Guests send an enquiry and availability is confirmed first.</p>}
        <div className="ff-ptn-two">
          <Field label="Website"><input className="ff-input" value={d.website} onChange={(e) => set("website", e.target.value)} /></Field>
          <Field label="Listing link"><input className="ff-input" value={d.listing} onChange={(e) => set("listing", e.target.value)} /></Field>
        </div>
        <Field label="Description"><textarea className="ff-input" rows={3} value={d.description} onChange={(e) => set("description", e.target.value)} /></Field>
        <div className="ff-ptn-photos"><Media17 edit value={d.photos} onChange={(v) => set("photos", v)} max={6} /></div>
        <fieldset className="ff-ptn-exp"><legend>Approved experiences</legend>
          {ptnPackages().map((p) => <label key={p.id} className="ff-ptn-check"><input type="checkbox" checked={d.experiences.includes(p.id)} onChange={() => toggleExp(p.id)} /> {p.name}</label>)}
        </fieldset>
        <Field label="Property rules"><textarea className="ff-input" rows={2} value={d.rules} onChange={(e) => set("rules", e.target.value)} /></Field>
        <div className="ff-ptn-qa">
          <h3>Questions and answers</h3>
          {PTN_QUESTIONS.map(([k, qq]) => {
            const cur = d.qa[k] || {};
            return (
              <div key={k} className="q">
                <b>{qq}</b>
                <span className="yn" role="group" aria-label={qq}>{["Yes", "No"].map((o) => <button key={o} type="button" className={cur.a === o ? "on" : ""} aria-pressed={cur.a === o} onClick={() => setQa(k, { a: cur.a === o ? "" : o })}>{o}</button>)}</span>
                <textarea className="ff-input" rows={2} value={cur.note || ""} aria-label={qq + " details"} onChange={(e) => setQa(k, { note: e.target.value })} />
              </div>);
          })}
        </div>
        <div className="ff-ptn-priv">
          <h3>Private details</h3>
          <Field label="Exact address"><input className="ff-input" value={d.priv.address} onChange={(e) => set("priv", { ...d.priv, address: e.target.value })} /></Field>
          <Field label="Access instructions"><textarea className="ff-input" rows={2} value={d.priv.access} onChange={(e) => set("priv", { ...d.priv, access: e.target.value })} /></Field>
          <Field label="Notes for the team"><textarea className="ff-input" rows={2} value={d.priv.notes} onChange={(e) => set("priv", { ...d.priv, notes: e.target.value })} /></Field>
        </div>
        <div className="ff-ptn-vis" role="group" aria-label="Visibility">
          {[["draft", "Draft"], ["public", "Public"], ["link", "Link only"]].map(([k, l]) => (
            <button key={k} type="button" className={d.visibility === k ? "on" : ""} aria-pressed={d.visibility === k} disabled={k !== "draft" && !ready} onClick={() => set("visibility", k)}>{l}</button>))}
        </div>
        <label className="ff-ptn-check"><input type="checkbox" checked={!!d.paused} onChange={(e) => set("paused", e.target.checked)} /> Pause this page</label>
        {err && <p className="ff-ptn-err" role="alert">{err}</p>}
        <div className="ff-ptn-btns">
          <Btn variant="gold" onClick={() => save()}>Save</Btn>
          <Btn variant="ghost" onClick={() => { if (save()) { onClose(); ptnOpenGuest(dispatch, d.id); } }}>Open guest preview</Btn>
          {shareable && <CardShareBtn17 title={`${view.name} on FF Partners`} url={ptnLink(d.id)} fileName={`${slugify(view.name) || "property"}.png`} render={() => <PtnPropCard view={view} />} />}
        </div>
        <p className="ff-ptn-none">{saved ? "Saved on this device only. The link opens here until FireFlair is connected." : "Not saved yet."}</p>
      </div>
    </Sheet>
  );
}

/* ---- Guest page: co-branded FF Party ---- */
function PtnGuestPage() {
  const { state, dispatch } = useStore();
  const data = usePtn();
  const [brief, setBrief] = useState(null);
  const id = state.ptnGuest && state.ptnGuest.id;
  const res = ptnResolve(data, id, ptnOwner(state));
  const goParty = () => { ptnCloseGuest(dispatch); dispatch({ type: "ROLE", role: "staff", site: "party" }); };
  if (res.status !== "ok") {
    return (
      <div className="ff-ptn ff-ptn-guest"><div className="ff-ptn-card">
        <h1 className="ff-h1">{res.status === "paused" ? "This page is paused" : "This page isn't available"}</h1>
        <div className="ff-ptn-btns"><Btn variant="gold" onClick={goParty}>Go to FF Party</Btn></div>
      </div></div>);
  }
  const v = res.view;
  const uk = v.cc === "GB";
  const IM = window.FF_IMG || {};
  return (
    <div className="ff-ptn ff-ptn-guest">
      {res.preview && <p className="ff-ptn-preview" role="status">Preview. Only you can see this page.</p>}
      <header className="ff-ptn-gh">
        <button type="button" className="ff-ptn-back" onClick={() => ptnCloseGuest(dispatch)} aria-label="Close"><ChevronLeft size={16} /> Back</button>
        <small>FF Party{v.by ? ` with ${v.by}` : ""}</small>
        <h1 className="ff-h1">{v.name}</h1>
        <p className="ff-ptn-sub">{[v.type, v.location].filter(Boolean).join(" · ")}</p>
      </header>
      {v.photos.length > 0 && <div className="ff-ptn-gal">{v.photos.map((s, i) => <img key={i} decoding="async" src={s} alt="" draggable={false} />)}</div>}
      {v.description && <p className="ff-ptn-desc">{v.description}</p>}
      {(v.website || v.listing) && <div className="ff-ptn-btns">
        {v.listing && <a className="ff-btn ghost" href={v.listing} target="_blank" rel="noopener noreferrer nofollow">View accommodation</a>}
        {v.website && <a className="ff-btn ghost" href={v.website} target="_blank" rel="noopener noreferrer nofollow">Visit venue website</a>}
      </div>}
      {v.experiences.length > 0 && (
        <section className="ff-ptn-sec" aria-labelledby="ff-ptn-gx"><h2 id="ff-ptn-gx" className="ff-h2">Experiences</h2>
          <ul className="ff-ptn-pk">{v.experiences.map((xid) => { const p = PKG_BY17[xid]; return (
            <li key={xid}><b>{p.name}</b><small>{p.durationLabel} · {pkgPriceLabel17(xid)} · {pkgGBP17(pkgDeposit17(xid))} deposit</small><span>{p.includes}</span>
              {uk ? <Btn variant="gold" onClick={() => ptnHandoff(state, dispatch, v, xid)}>Book this experience</Btn>
                : <Btn variant="gold" onClick={() => setBrief({ pkg: xid })}>Request an experience</Btn>}</li>); })}</ul>
        </section>)}
      <div className="ff-ptn-btns"><Btn variant={v.experiences.length ? "ghost" : "gold"} onClick={() => setBrief({ text: "" })}>Request an experience</Btn></div>
      {v.rules && <section className="ff-ptn-sec" aria-labelledby="ff-ptn-gr"><h2 id="ff-ptn-gr" className="ff-h2">House rules</h2><p>{v.rules}</p></section>}
      {v.qa.length > 0 && (
        <section className="ff-ptn-sec" aria-labelledby="ff-ptn-gq"><h2 id="ff-ptn-gq" className="ff-h2">Questions and answers</h2>
          <dl className="ff-ptn-qad">{v.qa.map((x) => <div key={x.k}><dt>{x.q}</dt><dd><b>{x.a}</b>{x.note ? <span> {x.note}</span> : null}</dd></div>)}</dl>
        </section>)}
      {brief && <PtnBriefSheet open onClose={() => setBrief(null)} preset={brief} propertyId={v.id} />}
    </div>
  );
}

/* A small note on the FF Party booking screens when the Event Card started from a partner property. */
function PtnEventNote({ ev }) {
  if (!ev || !ev.partnerRef) return null;
  return <p className="ff-ptn-note">Booking an experience at {ev.partnerRef.name}</p>;
}
