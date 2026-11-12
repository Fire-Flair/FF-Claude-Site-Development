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
  const st = useStore(), state = st.state, dispatch = st.dispatch;
  const [pop, setPop] = useState(null);
  const [req, setReq] = useState(null);
  const all = pkgsOf17(state).filter(function (x) { return (x.cat || "bar") === pillar; });
  const sr = all.filter(function (x) { return x.special; });
  const pkgs = all.filter(function (x) { return !x.special; });
  const co = pkgs.filter(function (x) { return x.by || x.id === "svc_supplier"; });
  const pro = pkgs.filter(function (x) { return !x.ff; });
  const secs = pillar === "bar" ? [["Professional packages", pro], ["Company packages", co]] : [["Company packages", co], ["Professional packages", pro]];
  const shown = secs.filter(function (x) { return x[1].length; });
  /* The Special Request card leads the first row, the same size as every package card. */
  if (shown.length) shown[0] = [shown[0][0], sr.concat(shown[0][1])]; else if (sr.length) shown.push(["FireFlair packages", sr]);
  const picked = bkOf17(state).pk;
  const pick = function (svc) {
    if (svc.special) { if (picked.includes(svc.id)) { dispatch({ type: "V11_SET", patch: { bk17: { ...bkOf17(state), pk: picked.filter(function (x) { return x !== svc.id; }) } } }); return; } setReq(svc); return; }
    if (picked.includes(svc.id)) { dispatch({ type: "V11_SET", patch: { bk17: { ...bkOf17(state), pk: picked.filter(function (x) { return x !== svc.id; }) } } }); return; }
    selectPkg17(state, dispatch, svc.id, true);
    dispatch({ type: "TOAST", toast: svc.title + " added to your booking" });
  };
  return React.createElement(React.Fragment, null,
    pillar === "bar" && window.PartyPackages18 ? React.createElement(window.PartyPackages18, null) : null,
    shown.map(function (x) {
      return React.createElement("div", { className: "ff-br17-row", key: x[0] }, React.createElement("h3", { className: "ff-br17-h3" }, x[0]),
        React.createElement(HScroll, { label: x[0] }, x[1].map(function (svc) { return React.createElement("div", { className: "ff-br17-co", key: svc.id }, React.createElement(PkgCard17, { svc: svc, n: 0, noun: "person", on: picked.includes(svc.id), match: false, onToggle: function () { pick(svc); }, onInfo: function () { svc.special ? setReq(svc) : setPop(svc); } })); })));
    }),
    pop ? React.createElement(PkgSheet17, { svc: pop, qual: "", onClose: function () { setPop(null); } }) : null,
    req ? React.createElement(SpecialRequestSheet17, { cat: req.cat, onClose: function () { setReq(null); }, onDone: function () { setReq(null); selectPkg17(state, dispatch, req.id, true); } }) : null);
}


/* Your team (FF Staff, signed in): the business's accepted company members. Open, after Chefs, above FF Event Directory. */
function CompanyTeam17() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [inviting, setInviting] = useState(false);
  const key = myCoKey17(state);
  if (!key) return null;
  const members = ctMembers17(state, key).map(id => findPerson(all, state, id)).filter(Boolean);
  const pending = ctPending17(state, key);
  const sel = state.selection || [];
  return (
    <section id="ff-coteam" style={{ marginTop: 20, scrollMarginTop: 70 }} aria-labelledby="ff-coteam-h">
      <style>{CT17_CSS}</style>
      <SectionHead icon={<I11.Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={<span id="ff-coteam-h">Your team</span>} count={members.length} />
      {members.length ? (
        <HScroll label="Your team">
          {members.map(p => <PlayerTile key={p.id} person={p} selected={sel.includes(p.id)} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
          <button type="button" className="ff-card ff-portrait ff-addtile" style={{ width: CARD_W.player }} onClick={() => setInviting(true)}>
            <span style={{ textAlign: "center" }}><I11.UserPlus size={20} color="var(--gold-dk)" /><span className="ff-label" style={{ display: "block", marginTop: 6 }}>Invite your team</span></span>
          </button>
        </HScroll>
      ) : (
        <div className="ff-ct17-empty">
          <span className="ic" aria-hidden="true"><I11.Users size={26} /></span>
          <b>Build your company team</b>
          <p>The people you invite join your team once they accept. You can book them by name through your company.</p>
          <Btn variant="primary" onClick={() => setInviting(true)}><I11.UserPlus size={14} /> Invite your team</Btn>
        </div>
      )}
      {pending.length > 0 && <ul className="ff-ct17-pend" aria-label="Waiting for a reply">{pending.map(x => <li key={x.id}><b>{x.name || (findPerson(all, state, x.personId) || {}).name || x.phone}</b><small>{x.dir === "invite" ? "Invited" : "Asked to join"}</small></li>)}</ul>}
      <InviteTeamSheet17 open={inviting} onClose={() => setInviting(false)} companyKey={key} />
    </section>
  );
}


const CT17_CSS = ".ff .ff-ct17-empty{display:grid;justify-items:start;gap:8px;padding:18px;border:1.5px dashed rgba(126,97,29,.5);border-radius:20px;corner-shape:squircle;background:#FFFDF8}.ff .ff-ct17-empty .ic{color:var(--gold-dk)}.ff .ff-ct17-empty b{font-size:16px}.ff .ff-ct17-empty p{margin:0;font-size:14px;line-height:1.45;color:#3A342B}"
  + ".ff .ff-ct17-pend{list-style:none;margin:10px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:6px}.ff .ff-ct17-pend li{display:flex;gap:6px;align-items:baseline;padding:6px 10px;border:1px solid rgba(126,97,29,.35);border-radius:14px;corner-shape:squircle;font-size:13px}.ff .ff-ct17-pend small{color:#6A6253}"
  + ".ff .ff-ct17-sheet .row{display:flex;align-items:center;gap:10px;width:100%;padding:8px;border:1px solid rgba(126,97,29,.3);border-radius:14px;corner-shape:squircle;background:#fff;font:inherit;text-align:left;margin-bottom:6px;cursor:pointer}.ff .ff-ct17-sheet .row[aria-pressed=true]{border-color:#5C1220;background:#FBF1F3}.ff .ff-ct17-sheet .row span{flex:1;min-width:0}.ff .ff-ct17-sheet .row small{display:block;color:#6A6253}.ff .ff-ct17-sheet .new{display:grid;gap:8px;margin-top:12px}.ff .ff-ct17-sheet .new input{font-size:16px;padding:10px 12px;border:1px solid var(--rule,#d8ccb0);border-radius:12px;corner-shape:squircle}";


/* Invite people to the company team: someone already on FireFlair, or anyone by name and mobile number (they join
   FF Team first, then accept; the invitation waits for them against that number). */
function InviteTeamSheet17({ open, onClose, companyKey }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [picked, setPicked] = useState([]);
  const [nm, setNm] = useState(""), [ph, setPh] = useState("");
  const [q, setQ] = useState("");
  const coName = (state.company && state.company.name) || "Your company";
  const taken = new Set(ctAll17(state).filter(x => x.companyKey === companyKey && (x.status === "accepted" || x.status === "pending")).map(x => x.personId).filter(Boolean));
  const pool = all.filter(p => !p.isCompany && !taken.has(p.id) && (!q.trim() || personSearchText(p).includes(q.trim().toLowerCase()))).slice(0, 30);
  const send = () => {
    let n = 0;
    picked.forEach(id => { const p = all.find(x => x.id === id); if (!p) return; dispatch({ type: "CT_INVITE", companyKey, companyName: coName, personId: p.id, tag: p.tag, name: p.name }); n++; });
    if (nm.trim() && ph.replace(/\D/g, "").length >= 7) { dispatch({ type: "CT_INVITE", companyKey, companyName: coName, name: nm.trim(), phone: ph.trim() }); n++; }
    dispatch({ type: "TOAST", toast: n ? `${n} invitation${n === 1 ? "" : "s"} sent on WhatsApp` : "Choose someone to invite" });
    if (n) { setPicked([]); setNm(""); setPh(""); onClose(); }
  };
  return (
    <Sheet open={open} onClose={onClose} title="Invite your team">
      <div className="ff-ct17-sheet">
        <label className="ff-fd-search"><A17I.Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the network" aria-label="Search the network" /></label>
        {pool.map(p => { const on = picked.includes(p.id); return (
          <button key={p.id} type="button" className="row" aria-pressed={on} onClick={() => setPicked(on ? picked.filter(x => x !== p.id) : [...picked, p.id])}>
            <Portrait src={p.photo} name={p.name} size={34} tier={p.tier} /><span><b>{p.name}</b><small>{p.profession}</small></span>{on && <I11.Check size={16} />}
          </button>); })}
        <div className="new">
          <b>Someone not on FireFlair yet</b>
          <input value={nm} onChange={(e) => setNm(e.target.value)} placeholder="Their name" aria-label="Their name" autoComplete="off" />
          <input value={ph} onChange={(e) => setPh(e.target.value)} placeholder="Mobile number" aria-label="Their mobile number" inputMode="tel" autoComplete="off" />
        </div>
        <div style={{ marginTop: 12 }}><Btn variant="primary wide" onClick={send}><WhatsAppIcon size={15} /> Send invitations</Btn></div>
      </div>
    </Sheet>
  );
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
      React.createElement(GroupedPeople, { query: "", onPick: props.onPick, scope: props.scope, only: groups, shut: true, insertAfter: props.teamSlot ? "Chefs" : "", insert: props.teamSlot || null })),
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
  /* v17.4.6.1: the roster is the company's accepted members (plus any listed roster), people with a published Profile Card only. */
  const ck = coKey17(co);
  const team = [...new Set([...(co.team || []), ...ctMembers17(state, ck)])].map(id => findPerson(all, state, id)).filter(p => p && !p.isCompany);
  const teamSite = state.role === "team" && state.auth && state.auth.status === "signedIn";
  const myRel = teamSite && ck ? ctMyStatus17(state, ck) : "";
  const joinTeam = () => {
    dispatch({ type: "CT_REQUEST", companyKey: ck, companyName: co.name || "", personId: "me", tag: state.auth.tag || "", name: state.profile.name || "" });
    dispatch({ type: "TOAST", toast: `Request sent to ${co.name || "the company"}` });
  };
  const inv = myRel === "invited" && ctInvitesForMe17(state).find(x => x.companyKey === ck);
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
      <PublicHero media={(co.mediaList || []).map(m => ({ id: m.id, src: m.src, name: m.alt || "" }))} card={<><CompanyCardFace c={co} />{(co.slug || co.name) ? <div style={{ marginTop: 10, textAlign: "center" }}><CardShareBtn17 title={`${co.name || "Company"} on FireFlair`} url={`https://${CARD_DOMAIN}/${co.slug || cx17Slug(co.name)}`} fileName={"fireflair-" + cx17Slug(co.slug || co.name)} render={() => <CompanyCardFace c={co} />} label="Share Company Card" /></div> : null}</>} below={<>
      {!done && <button type="button" className="ff-pback ff-copub-back" onClick={back}><I11.ChevronLeft size={20} /> <span>Back</span></button>}
      {!done && !co.mine && !isParty && <div className="ff-copub-acts"><NetBtn17 id={co.id} name={co.name} wide /></div>}
      {!done && !co.mine && !co.unclaimed && teamSite && ck && <div className="ff-copub-acts">
        {myRel === "member" ? <Btn variant="wide" disabled><I11.Check size={14} /> On their team</Btn>
          : myRel === "requested" ? <Btn variant="wide" disabled><I11.Clock size={14} /> Request sent</Btn>
          : inv ? <div className="two"><Btn variant="primary" onClick={() => { dispatch({ type: "CT_DECIDE", id: inv.id, accept: true }); dispatch({ type: "TOAST", toast: `You're on ${co.name}'s team` }); }}><I11.Check size={14} /> Accept invitation</Btn><Btn onClick={() => dispatch({ type: "CT_DECIDE", id: inv.id, accept: false })}>Decline</Btn></div>
          : <Btn variant="primary wide" onClick={joinTeam}><I11.UserPlus size={14} /> Join team</Btn>}
      </div>}
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
            {team.length ? <HScroll label="Their team">{team.map(p => { const on = state.selection.includes(p.id); return (
              <div key={p.id} className="ff-ct17-m"><PlayerTile person={p} selected={on} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />
                {isStaff && !isParty && !co.mine && <Btn variant={on ? "sm" : "sm primary"} onClick={() => { dispatch({ type: on ? "SELECT" : "SELECT_ADD", id: p.id }); dispatch({ type: "TOAST", toast: on ? `${firstName(p.name)} removed from your booking bar` : `${firstName(p.name)} added to your booking bar` }); }}>{on ? <><I11.Check size={13} /> In your booking</> : <><I11.Plus size={13} /> Add to booking</>}</Btn>}
              </div>); })}</HScroll>
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
  return (
    <div>
      <BigHead20 tag="h1" title="Our network" />
      <p className="ff-body ff-muted" style={{ marginBottom: 4 }}>Find the people to book, and the companies they work with.</p>
      {state.netBrief && <BookingBrief brief={state.netBrief} />}
      <FFAI query={q} onQuery={setQ} title="Search the network" context="FF Staff"
        purpose="Find people to hire — search by name, profession, skill or area. Tap a card to see their profile."
        placeholder="Name, profession, skill or area…" />
      <NetBrowse17 query={q} onPick={(p) => dispatch({ type: "VIEW", id: p.id })} scope="staff_" after={!q && !state.netBrief ? <NetMap11 /> : null} teamSlot={myCoKey17(state) ? <CompanyTeam17 /> : null} />
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
