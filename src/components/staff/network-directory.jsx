/* src/components/staff/network-directory.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Large page headings: black type with a gold underline (Network page). */
const BIG20_CSS = __ff_css("styles/big20.css");


function BigHead20({ tag, title, count, id }) {
  return React.createElement(React.Fragment, null, React.createElement("style", null, BIG20_CSS),
    React.createElement(tag || "h2", { className: "ff-h1 ff-big20", id: id }, React.createElement("span", { className: "t" }, title), count !== undefined ? React.createElement("span", { className: "ff-pill" }, count) : null));
}


function CompaniesSection({ title = "Companies", note, list: listIn, fold }) {
  const { state, dispatch } = useStore();
  const list = listIn || companyList(state);
  const Wrap = fold ? ({ children }) => React.createElement(Fold17, { shut: true, id: fold, icon: React.createElement(I11.Briefcase, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.6 }), title, count: list.length }, children) : ({ children }) => React.createElement("section", { className: "ff-co11-sect", style: { marginTop: 22 } }, React.createElement(SectionHead, { icon: React.createElement(I11.Briefcase, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.6 }), title, count: list.length }), children);
  return React.createElement(Wrap, null, note && React.createElement("p", { className: "ff-body", style: { margin: "-2px 0 8px", fontSize: 13.5 } }, note), React.createElement(HScroll, { label: title }, list.map((co) => React.createElement(
    "button",
    {
      key: co.id,
      type: "button",
      className: "ff-co11-tile",
      onClick: () => {
        dispatch({ type: "VIEW_COMPANY", id: co.id });
        window.scrollTo(0, 0);
      },
      "aria-label": `${co.name || "Your company"}: open their page`
    },
    React.createElement(CompanyCardFace, { c: co, size: "sm" }),
    co.team && co.team.length > 0 && React.createElement("span", { className: "ff-co11-team" }, co.team.slice(0, 4).map((id) => {
      const p = (state.directory || []).find((x) => x.id === id);
      return p ? React.createElement(Portrait, { key: id, src: p.photo, name: p.name, size: 24, tier: p.tier }) : null;
    }), React.createElement("small", null, co.team.length, " on the team")),
    co.mine && React.createElement("span", { className: "ff-co11-team" }, React.createElement("small", null, "Your Company Card"))
  ))));
}



/* Browse under the map: the four pillars sort the people and companies, and the map follows. */
const NET_CO_TYPES17 = [["bar", "Bar companies"], ["dj", "Entertainment"], ["photo", "Event services"], ["catering", "Caterers"], ["svc", "Bar services"]];


const PILLAR_OF_GROUP17 = { "Bar": "bar", "Front of House": "bar", "Management": "bar", "Back of House": "bar", "Entertainment": "ent", "Services": "svc", "Chefs": "food" };


const PILLAR_OF_CAT17 = { bar: "bar", dj: "ent", photo: "svc", svc: "svc", catering: "food" };


const NET_PILLAR_TEXT17 = { bar: "Bartenders and bar companies", ent: "DJs and performers", svc: "Photo and more", food: "Chefs and caterers" };


function browseCompanies17(state) {
  const sup = REAL_SUPPLIERS17.map(function (c) { return companyById(state, "co_" + c.slug); }).filter(Boolean);
  return companyList(state).concat(adminCompanies17(state, sup));
}


function NetDirectory19(props) {
  const h = React.createElement;
  const st = useStore(), state = st.state;
  const open = state.netPillar17 || "";
  const every = browseCompanies17(state);
  const all = every.filter(function (c) { return c.unclaimed; });
  const top = every.filter(function (c) { return !c.unclaimed && (!open || PILLAR_OF_CAT17[c.cat || "bar"] === open); });
  const secs = NET_CO_TYPES17.filter(function (t) { return !open || PILLAR_OF_CAT17[t[0]] === open; })
    .map(function (t) { return [t, all.filter(function (c) { return (c.cat || "bar") === t[0]; })]; })
    .filter(function (x) { return x[1].length; });
  return h("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } },
    h(BigHead20, { title: "FF Event Directory" }),
    top.length ? h(CompaniesSection, { title: "Top companies", list: top }) : null,
    secs.map(function (x) { return h(CompaniesSection, { key: "dir" + x[0][0], title: x[0][1], list: x[1], fold: "ff-dir-" + x[0][0] }); }));
}


/* Packages under the pillars: FireFlair packages (Bar only), then professional and company packages. */
function NetPackages20({ pillar }) {
  const st = useStore(), state = st.state;
  const [pop, setPop] = useState(null);
  const pkgs = pkgsOf17(state).filter(function (x) { return (x.cat || "bar") === pillar; });
  const co = pkgs.filter(function (x) { return x.by || x.id === "svc_supplier"; });
  const pro = pkgs.filter(function (x) { return !x.ff; });
  const secs = pillar === "bar" ? [["Professional packages", pro], ["Company packages", co]] : [["Company packages", co], ["Professional packages", pro]];
  return React.createElement(React.Fragment, null,
    pillar === "bar" && window.PartyPackages18 ? React.createElement(window.PartyPackages18, null) : null,
    secs.filter(function (x) { return x[1].length; }).map(function (x) {
      return React.createElement("div", { className: "ff-br17-row", key: x[0] }, React.createElement("h3", { className: "ff-br17-h3" }, x[0]),
        React.createElement(HScroll, { label: x[0] }, x[1].map(function (svc) { return React.createElement("div", { className: "ff-br17-co", key: svc.id }, React.createElement(PkgCard17, { svc: svc, n: 0, noun: "person", on: false, match: false, onToggle: function () { setPop(svc); }, onInfo: function () { setPop(svc); } })); })));
    }),
    pop ? React.createElement(PkgSheet17, { svc: pop, qual: "", onClose: function () { setPop(null); } }) : null);
}


function NetBrowse17(props) {
  const query = props.query || "";
  const st = useStore(), state = st.state, dispatch = st.dispatch;
  const open = state.netPillar17 || "";
  if (query.trim()) return React.createElement(React.Fragment, null, props.after || null, React.createElement(GroupedPeople, { query: query, onPick: props.onPick, scope: props.scope }));
  const groups = open ? Object.keys(PILLAR_OF_GROUP17).filter(function (g) { return PILLAR_OF_GROUP17[g] === open; }) : "";
  const items = BCATS17.map(function (c) { return { k: c.k, t: c.label, s: NET_PILLAR_TEXT17[c.k], img: (window.FF_IMG || {})[BIMG17[c.k]] }; });
  return React.createElement(React.Fragment, null,
    React.createElement(BigHead20, { title: "Explore our packages" }),
    React.createElement(PillarBox17, { label: "Explore our packages", open: open, items: items, onPick: function (k) { dispatch({ type: "V11_SET", patch: { netPillar17: k } }); } }, open ? React.createElement(NetPackages20, { pillar: open }) : null),
    props.after || null,
    React.createElement("section", { id: "ff-our-pros", style: { marginTop: 30, scrollMarginTop: 70 } },
      React.createElement(BigHead20, { title: "Our professionals" }),
      React.createElement(TopStaff11, null),
      React.createElement(GroupedPeople, { query: "", onPick: props.onPick, scope: props.scope, only: groups, shut: true })),
    React.createElement(NetDirectory19, null));
}



/* A company's page, as anyone sees it. */
function CompanyPublic({ co: coIn, done, onEdit, slot } = {}) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const co = coIn || companyById(state, state.viewingCompany);
  const [asking, setAsking] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [tab, setTab] = useState("overview");
  if (!co) return null;
  const isStaff = state.role === "staff";
  const team = (co.team || []).map(id => all.find(p => p.id === id)).filter(Boolean);
  const back = () => { dispatch({ type: "VIEW_COMPANY", id: null }); window.scrollTo(0, 0); };
  const asPerson = { id: co.id, name: co.name || "this company", tag: co.slug, profession: co.kind, isCompany: true, photo: co.logo || null, tier: co.tier };
  const contact = co.mine ? recsOf(co, "contact").filter(r => !r.hidden).map(r => [r.description || "Contact", r.name]) : (co.contact || []);
  const areas = co.mine ? companyLocations(co) : String(co.areas || "").split("·").map(x => x.trim()).filter(Boolean);
  const venues = co.mine ? recsOf(co, "venues").filter(r => !r.hidden).map(r => r.name) : (co.venues || []);
  const reviews = co.mine ? (co.reviews || []).map(r => [null, r.rating, r.text, r.byName]) : (co.reviews || []);
  const pubQa = co.mine || co.qa ? coQa(co).filter(q => q.group !== "feedback" && q.answer) : coQa({}).filter(q => q.group !== "feedback").map((q, i) => ({ ...q, answer: (i + String(co.id).length) % 3 ? "Yes" : "No" }));
  const isParty = isStaff && hireSiteOf(state).party;
  const pkgs = isParty ? ((typeof PARTY_SERVICES !== "undefined" && PARTY_SERVICES) || []) : [];
  const tabs = [{ key: "overview", label: "Overview" }, { key: "qa", label: "Packages", count: isParty ? pkgs.length : pubQa.length }, ...(ph17(state) >= 2 ? [{ key: "team", label: "Team", count: team.length }] : []), { key: "reviews", label: "Reviews", count: reviews.length }];
  const cIcon = (k) => /mail/i.test(k) ? I11.Mail : /phone/i.test(k) ? I11.Phone : /web/i.test(k) ? I11.Globe : I11.MessageCircle;
  const addTeam = () => {
    const ids = team.map(p => p.id).filter(id => !state.selection.includes(id));
    ids.forEach(id => dispatch({ type: "SELECT_ADD", id }));
    dispatch({ type: "TOAST", toast: ids.length ? `${ids.length} added to your booking bar` : "They're already in your booking bar" });
  };
  const bookForEvent = () => {
    team.map(p => p.id).filter(id => !state.selection.includes(id)).forEach(id => dispatch({ type: "SELECT_ADD", id }));
    dispatch({ type: "ACTIVE_EVENT", id: null });
    dispatch({ type: "V11_SET", patch: { bkView: { n: Date.now(), mode: "new" } } });
    dispatch({ type: "VIEW_COMPANY", id: null });
    dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0);
  };
  return (
    <div className="ff-copub">
      <PublicHero media={(co.mediaList || []).map(m => ({ id: m.id, src: m.src, name: m.alt || "" }))} card={<CompanyCardFace c={co} />} below={<>
      {!done && <button type="button" className="ff-pback ff-copub-back" onClick={back}><I11.ChevronLeft size={20} /> <span>Back</span></button>}
      {!done && !co.mine && !isParty && <div className="ff-copub-acts"><NetBtn17 id={co.id} name={co.name} wide /></div>}
      {co.unclaimed || done ? null : (
      <div className="ff-copub-acts">
        {isStaff && team.length > 0 && (isParty
          ? <Btn variant="primary wide" onClick={bookForEvent}><I11.PartyPopper size={14} /> Book for your event</Btn>
          : <Btn variant="primary wide" onClick={addTeam}><I11.Users size={14} /> Book from their team</Btn>)}
        <div className="two">
          <Btn onClick={() => setAsking(true)}><I11.MessageSquare size={14} /> Ask a question</Btn>
          <Btn onClick={() => setReviewing(true)}><I11.Award size={14} /> Review</Btn>
        </div>
      </div>
      )}
      </>} />

      <div className="ff-ptabs-wrap">
        {!co.unclaimed && <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />}
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
          {tab === "overview" && (<>
            {co.description && <section className="ff-copub-sec"><SectionHead icon={<I11.Briefcase size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="About" />
              <p className="ff-body" style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#2A2620" }}>{co.description}</p></section>}
            {contact.length > 0 && <section className="ff-copub-sec"><SectionHead icon={<I11.MessageCircle size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Contact" />
              <ul className="ff-copub-contact">{contact.map(([k, v]) => { const Ic = cIcon(k); return <li key={k + v}><span className="ic"><Ic size={15} /></span><span><small>{k}</small><b>{v}</b></span></li>; })}</ul></section>}
            {(areas.length > 0 || venues.length > 0) && <section className="ff-copub-sec"><SectionHead icon={<I11.MapPinned size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Areas covered" />
              <div className="ff-copub-chips">{areas.map(a => <span key={a}><I11.MapPin size={12} /> {a}</span>)}{venues.map(v => <span key={v} className="ven"><I11.Star size={12} /> {v}</span>)}</div></section>}
            {co.seed && [["Services", co.seed.services], ["Events", co.seed.eventTypes], ["Scale", co.seed.scale], ["Good to know", co.seed.facts]].filter(([, v]) => v && v.length > 0).map(([h, v]) => (
              <section key={h} className="ff-copub-sec"><SectionHead icon={<I11.Star size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={h} />
                <div className="ff-copub-chips">{v.map(x => <span key={x}>{x}</span>)}</div></section>))}
            {co.extras && <VkExtras17 x={co.extras} />}
          </>)}
          {tab === "qa" && isParty && <section className="ff-copub-sec">
            <HScroll label="Packages">{pkgs.map(sv => <div key={sv.id} style={{ width: CARD_W.poster, flex: "none" }}><ServicePoster svc={sv} /></div>)}</HScroll>
            {pubQa.length > 0 && <><SectionHead icon={<I11.MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Questions and answers" />
              <ul className="ff-copub-qa">{pubQa.map(q => <li key={q.id}><b>{q.text}</b><span>{qaShown(q)}</span></li>)}</ul></>}
          </section>}
          {tab === "qa" && !isParty && <section className="ff-copub-sec">
            {pubQa.length > 0 && <SectionHead icon={<I11.MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Questions and answers" />}
            {pubQa.length ? <ul className="ff-copub-qa">{pubQa.map(q => <li key={q.id}><b>{q.text}</b><span>{qaShown(q)}</span></li>)}</ul>
              : <p className="ff-body ff-muted" style={{ margin: 0 }}>No answers yet.</p>}</section>}
          {tab === "team" && <section className="ff-copub-sec">
            {team.length ? <HScroll label="Their team">{team.map(p => <PlayerTile key={p.id} person={p} selected={state.selection.includes(p.id)} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />)}</HScroll>
              : <p className="ff-body ff-muted" style={{ margin: 0 }}>No team yet.</p>}</section>}
          {tab === "reviews" && <section className="ff-copub-sec">
            {reviews.length ? <div className="ff-copub-revs">{reviews.map(([by, rating, text, byName], i) => { const p = by && all.find(x => x.id === by); return (
              <figure key={i} className="ff-copub-rev">{rating > 0 && <span className="st" aria-label={`${rating} out of 5`}>{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>}<blockquote>"{text}"</blockquote>
                <figcaption>{p && <Portrait src={p.photo} name={p.name} size={26} tier={p.tier} />}{p ? p.name : byName}{p ? ` · ${p.profession}` : ""}</figcaption></figure>); })}</div>
              : <p className="ff-body ff-muted" style={{ margin: 0 }}>No reviews yet.</p>}</section>}
        </div>
      </div>
      {slot}
      <AskQuestionSheet open={asking} person={asPerson} onClose={() => setAsking(false)} />
      <ReviewSheet open={reviewing} person={asPerson} onClose={() => setReviewing(false)} />
    </div>
  );
}



/* FF Staff Network (v1.1): search, the people you rebook, Companies, then
   everyone by profession. */
function StaffRoster() {
  const { state } = useStore();
  return hireSiteOf(state).party ? <PartyBrowse17 /> : <StaffRosterStaff11 />;
}


function StaffRosterStaff11() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [q, setQ] = useState(() => state.netQuery || "");
  useEffect(() => { if (state.netQuery) dispatch({ type: "NET_QUERY", q: "" }); }, []);
  const worked = state.engagements.filter(e => ["confirmed", "completed", "signed_off", "paid"].includes(e.state));
  const regulars = [...new Set(worked.map(e => e.staffId))].filter(id => id !== "me").map(id => all.find(p => p.id === id)).filter(Boolean);
  return (
    <div>
      <BigHead20 tag="h1" title="Our network" />
      <p className="ff-body ff-muted" style={{ marginBottom: 4 }}>Find the people to book, and the companies they work with.</p>
      {state.netBrief && <BookingBrief brief={state.netBrief} />}
      <FFAI query={q} onQuery={setQ} title="Search the network" context="FF Staff"
        purpose="Find people to hire — search by name, profession, skill or area. Tap a card to see their profile."
        placeholder="Name, profession, skill or area…" />
      <NetBrowse17 query={q} onPick={(p) => dispatch({ type: "VIEW", id: p.id })} scope="staff_" after={!q && !state.netBrief ? <NetMap11 /> : null} />
      {!q && regulars.length > 0 && (
        <section style={{ marginTop: 18 }}>
          <SectionHead icon={<I11.Check size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Your team" count={regulars.length} />
          <HScroll label="Your team">
            {regulars.map(p => <PlayerTile key={p.id} person={p} selected={state.selection.includes(p.id)} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
          </HScroll>
        </section>
      )}
    </div>
  );
}



/* Network pages (FF Team, FF Staff, FF Party): Top staff, then the map. */
const TOP_STAFF11 = ["stf_sam", "stf_pri", "stf_mia", "stf_tom", "stf_don", "stf_ava", "stf_leo", "stf_jam"];


function TopStaff11() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const top = TOP_STAFF11.map(id => all.find(p => p.id === id)).filter(Boolean);
  if (!top.length) return null;
  return (
    <section style={{ marginTop: 18 }}>
      <SectionHead icon={<I11.Star size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Top staff" count={top.length} />
      <HScroll label="Top staff">
        {top.map(p => <PlayerTile key={p.id} person={p} selected={state.role === "staff" && state.selection.includes(p.id)} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />)}
      </HScroll>
    </section>
  );
}
