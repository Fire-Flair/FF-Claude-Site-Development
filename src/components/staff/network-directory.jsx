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
  const isParty = state.role === "staff" && !!(hireSiteOf(state) || {}).party;
  const all = pkgsOf17(state).filter(function (x) { return (x.cat || "bar") === pillar; });
  const pkgs = all.filter(function (x) { return !x.special; });
  const co = pkgs.filter(function (x) { return x.by || x.id === "svc_supplier"; });
  const pro = pkgs.filter(function (x) { return !x.ff; });
  const secs = pillar === "bar" ? [["Professional packages", pro], ["Company packages", co]] : [["Company packages", co], ["Professional packages", pro]];
  const shown = secs.filter(function (x) { return x[1].length; });
  const picked = bkOf17(state).pk;
  const pick = function (svc) {
    /* FF Team: Sign up. FF Staff: Create your own. Both go to the profile where that is done. */
    if (!isParty) { dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0); return; }
    if (picked.includes(svc.id)) { dispatch({ type: "V11_SET", patch: { bk17: { ...bkOf17(state), pk: picked.filter(function (x) { return x !== svc.id; }) } } }); return; }
    selectPkg17(state, dispatch, svc.id, true);
  };
  return React.createElement(React.Fragment, null,
    pillar === "bar" && window.PartyPackages18 ? React.createElement(window.PartyPackages18, null) : null,
    shown.map(function (x) {
      return React.createElement("div", { className: "ff-br17-row", key: x[0] }, React.createElement("h3", { className: "ff-br17-h3" }, x[0]),
        React.createElement(HScroll, { label: x[0] }, x[1].map(function (svc) { return React.createElement("div", { className: "ff-br17-co", key: svc.id }, React.createElement(state.role === "team" ? PkgCardOld17 : PkgCard17, { svc: svc, n: 0, noun: "person", on: picked.includes(svc.id), match: false, onToggle: function () { pick(svc); }, onInfo: function () { setPop(svc); } })); })));
    }),
    pop ? React.createElement(PkgSheet17, { svc: pop, qual: "", onClose: function () { setPop(null); } }) : null);
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


/* The search text now being used by the network pages, read by the map so its pins follow the results. */
const NetQ17 = React.createContext("");


/* Search text for a company or Directory entry: name, kind and what they do, areas and location, category. */
function coSearchText17(c) {
  const cat = (NET_CO_TYPES17.find(function (x) { return x[0] === (c.cat || "bar"); }) || [])[1] || "";
  const places = [].concat(c.area || [], c.areas || [], c.location || [], c.serviceLocations || [], (c.locations || []).map(function (l) { return (l && l.label) || l; }));
  const what = [].concat(c.kind || [], (c.seed && c.seed.services) || [], (c.seed && c.seed.base) || []);
  return [c.name, c.tag].concat(what, places, [cat]).filter(Boolean).join(" ").toLowerCase();
}


/* Companies and FF Event Directory entries that match a network search. cos: claimed companies, dir: unclaimed Directory entries. */
function netSearch17(state, query) {
  const n = String(query || "").trim().toLowerCase();
  if (!n) return null;
  const hit = browseCompanies17(state).filter(function (c) { return coSearchText17(c).includes(n); });
  return { cos: hit.filter(function (c) { return !c.unclaimed; }), dir: hit.filter(function (c) { return c.unclaimed; }) };
}


function NetBrowse17(props) {
  const query = props.query || "";
  const st = useStore(), state = st.state, dispatch = st.dispatch;
  const open = state.netPillar17 || "";
  if (query.trim()) {
    const found = netSearch17(state, query);
    const anyCo = found.cos.length + found.dir.length > 0;
    return React.createElement(NetQ17.Provider, { value: query }, props.after || null,
      React.createElement(GroupedPeople, { query: query, onPick: props.onPick, scope: props.scope, quietEmpty: anyCo }),
      found.cos.length ? React.createElement(CompaniesSection, { title: "Companies", list: found.cos }) : null,
      found.dir.length ? React.createElement(CompaniesSection, { title: "FF Event Directory", list: found.dir }) : null);
  }
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



/* A company's public Q&A: a search, then Question Cards that open in a pop-up. */
function CoQA17({ list, name }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const t = q.trim().toLowerCase();
  const shown = t ? list.filter(x => `${x.text} ${x.answer || ""} ${x.note || ""}`.toLowerCase().includes(t)) : list;
  return (
    <div className="ff-coqa17">
      <label className="ff-coqa17-srch">
        <I11.Search size={15} aria-hidden="true" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions" aria-label={`Search ${name || "the company"}'s questions and answers`} />
        {q ? <button type="button" aria-label="Clear the search" onClick={() => setQ("")}><I11.X size={14} /></button> : null}
      </label>
      {shown.length
        ? <HScroll label="Q&A" snap>{shown.map(x => <QuestionCard key={x.id} q={{ text: x.text, group: "hiring" }} label="Q&A" answer={qaShown(x)} onClick={() => setOpen(x)} />)}</HScroll>
        : <p className="ff-body ff-muted" style={{ margin: "6px 2px 0" }} role="status">No questions match.</p>}
      <Sheet open={!!open} onClose={() => setOpen(null)} title={name || "Q&A"} center>
        {open ? <div className="ff-coqa17-pop"><p className="q">{open.text}</p>{open.answer ? <p className="a">{open.answer}</p> : null}{open.note ? <p className="n">{open.note}</p> : null}</div> : null}
      </Sheet>
    </div>
  );
}

/* A company's Service Cards or Cocktail Cards, as people see them: tap one to open it. */
function CoCardRow17({ type, list, by, tag }) {
  const [view, setView] = useState(null);
  const T = STUDIO17[type];
  return (
    <>
      <HScroll label={type === "service" ? "Packages" : "Cocktails"}>
        {list.map(x => (
          <div key={x.id} className="ff-st17-item">
            <div className="ff-st17-tap" role="button" tabIndex={0} aria-label={`Open ${T.name(x) || T.plate}`} onClick={() => setView(x)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setView(x); } }}>
              <StudioPair17 type={type} x={x} site="FF Staff" by={by} tag={tag} size="sm" only />
            </div>
          </div>
        ))}
      </HScroll>
      {view ? <CardPop17 type={type} x={view} site="FF Staff" by={by} tag={tag} onClose={() => setView(null)} /> : null}
    </>
  );
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
  const partners = coPartners17(state, co);
  const coNet = co.mine ? (state.netAdds17 || []).filter(id => !String(id).startsWith("co_")).map(id => findPerson(all, state, id)).filter(p => p && !p.isCompany && !team.some(t => t.id === p.id)) : [];
  const coCos = co.mine ? [...partners, ...(state.netAdds17 || []).filter(id => String(id).startsWith("co_") && !partners.some(x => x.id === id)).map(id => companyById(state, id)).filter(Boolean)] : partners;
  const teamSite = state.role === "team" && state.auth && state.auth.status === "signedIn";
  const myRel = teamSite && ck ? ctMyStatus17(state, ck) : "";
  const joinTeam = () => {
    dispatch({ type: "CT_REQUEST", companyKey: ck, companyName: co.name || "", personId: "me", tag: state.auth.tag || "", name: state.profile.name || "" });
    dispatch({ type: "TOAST", toast: `Request sent to ${co.name || "the company"}` });
  };
  const inv = myRel === "invited" && ctInvitesForMe17(state).find(x => x.companyKey === ck);
  const back = () => { dispatch({ type: "VIEW_COMPANY", id: null }); window.scrollTo(0, 0); };
  const asPerson = { id: co.id, name: co.name || "this company", tag: co.slug, profession: co.kind, isCompany: true, photo: co.logo || null, tier: co.tier, companyKey: ck };
  const contact = co.mine ? recsOf(co, "contact").filter(r => !r.hidden).map(r => [r.description || "Contact", r.name]) : (co.contact || []);
  const areas = co.mine ? companyLocations(co) : String(co.areas || "").split("·").map(x => x.trim()).filter(Boolean);
  const venues = co.mine ? recsOf(co, "venues").filter(r => !r.hidden).map(r => r.name) : (co.venues || []);
  /* Reviews posted on this company's page (state.reviews, newest first) come before its own. */
  const posted = (state.reviews || []).filter(r => r.aboutId === co.id || ck &&  (r.aboutId && r.aboutId !== "me" && coKey17(companyById(state, r.aboutId)) === ck)).slice().reverse().map(r => [null, r.rating, r.text, r.byName]);
  const reviews = [...posted, ...(co.mine ? (co.reviews || []).map(r => [null, r.rating, r.text, r.byName]) : (co.reviews || []))];
  const ownQa = co.mine || co.qa ? coQa(co).filter(q => q.group !== "feedback" && q.answer) : [];
  /* Questions asked on this page that the company answered and made public sit next to its own Q&A, newest first. */
  const askedQa = (state.profileQuestions || []).filter(q => q.companyKey && q.companyKey === ck && q.visibility === "public" && isAnswered(q.answer)).slice().reverse().map(q => ({ id: q.id, text: q.text, answer: q.answer, note: "", group: "business" }));
  const pubQa = [...askedQa, ...ownQa];
  const { services, cocktails } = coCards17(state, co, true);
  const isParty = isStaff && hireSiteOf(state).party;
  const tabs = [{ key: "overview", label: "Overview" }, { key: "qa", label: "Packages", count: services.length + cocktails.length }, { key: "team", label: "Team", count: team.length + coCos.length + coNet.length }, { key: "reviews", label: "Reviews", count: reviews.length }];
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
  const tag = co.slug || cx17Slug(co.name || "");
  const shareBtn = (co.slug || co.name) ? <CardShareBtn17 title={`${co.name || "Company"} on FireFlair`} url={`https://${CARD_DOMAIN}/${tag}`} fileName={"fireflair-" + cx17Slug(co.slug || co.name)} render={() => <CompanyCardFace c={co} />} label="Share" className="wide" /> : null;
  const acts = done ? [] : [
    !co.unclaimed && ["ask", <Btn variant="wide" onClick={() => setAsking(true)}><I11.MessageSquare size={14} /> Ask a question</Btn>],
    !co.mine && !isParty && ["net", <NetBtn17 id={co.id} name={co.name} wide />],
    !co.unclaimed && ["rev", <Btn variant="wide" onClick={() => setReviewing(true)}><I11.Award size={14} /> Review</Btn>],
    shareBtn && ["share", shareBtn],
  ].filter(Boolean);
  const about = String(co.description || "").split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  return (
    <div className="ff-copub">
      <PublicHero media={(co.mediaList || []).map(m => ({ id: m.id, src: m.src, name: m.alt || "" }))} card={<><CompanyCardFace c={co} />{done && shareBtn ? <div style={{ marginTop: 10, textAlign: "center" }}><CardShareBtn17 title={`${co.name || "Company"} on FireFlair`} url={`https://${CARD_DOMAIN}/${tag}`} fileName={"fireflair-" + cx17Slug(co.slug || co.name)} render={() => <CompanyCardFace c={co} />} label="Share Company Card" /></div> : null}</>} below={<>
      {!done && <button type="button" className="ff-pback ff-copub-back" onClick={back}><I11.ChevronLeft size={20} /> <span>Back</span></button>}
      {!done && !co.mine && !co.unclaimed && teamSite && ck && <div className="ff-copub-acts">
        {myRel === "member" ? <Btn variant="wide" disabled><I11.Check size={14} /> On their team</Btn>
          : myRel === "requested" ? <Btn variant="wide" disabled><I11.Clock size={14} /> Request sent</Btn>
          : inv ? <div className="two"><Btn variant="primary" onClick={() => { dispatch({ type: "CT_DECIDE", id: inv.id, accept: true }); dispatch({ type: "TOAST", toast: `You're on ${co.name}'s team` }); }}><I11.Check size={14} /> Accept invitation</Btn><Btn onClick={() => dispatch({ type: "CT_DECIDE", id: inv.id, accept: false })}>Decline</Btn></div>
          : <Btn variant="primary wide" onClick={joinTeam}><I11.UserPlus size={14} /> Join team</Btn>}
      </div>}
      {!done && !co.unclaimed && isStaff && team.length > 0 && <div className="ff-copub-acts">
        {isParty
          ? <LockedBtn17 variant="primary wide" icon={<I11.PartyPopper size={14} />}>Book for your event</LockedBtn17>
          : <Btn variant="primary wide" onClick={addTeam}><I11.Users size={14} /> Book from their team</Btn>}
      </div>}
      {acts.length > 0 && <div className="ff-copub-grid">{acts.map(([k, el], i) => <div key={k} className={"c-" + k + (acts.length % 2 && i === acts.length - 1 ? " span" : "")}>{el}</div>)}</div>}
      </>} />

      <div className="ff-ptabs-wrap">
        {!co.unclaimed && <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />}
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
          {tab === "overview" && (<>
            {about.length > 0 && <section className="ff-copub-sec"><SectionHead icon={<I11.Briefcase size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="About" />
              {about.map((p, i) => <p key={i} className="ff-body" style={{ margin: i ? "12px 0 0" : 0, fontSize: 15, lineHeight: 1.55, color: "#2A2620" }}>{p}</p>)}</section>}
            {contact.length > 0 && <section className="ff-copub-sec"><SectionHead icon={<I11.MessageCircle size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Contact" />
              <ul className="ff-copub-contact">{contact.map(([k, v]) => { const Ic = cIcon(k); return <li key={k + v}><span className="ic"><Ic size={15} /></span><span><small>{k}</small><b>{v}</b></span></li>; })}</ul></section>}
            {(areas.length > 0 || venues.length > 0) && <section className="ff-copub-sec"><SectionHead icon={<I11.MapPinned size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Areas covered" />
              <div className="ff-copub-chips">{areas.map(a => <span key={a}><I11.MapPin size={12} /> {a}</span>)}{venues.map(v => <span key={v} className="ven"><I11.Star size={12} /> {v}</span>)}</div></section>}
            {co.seed && [["Services", co.seed.services], ["Events", co.seed.eventTypes], ["Scale", co.seed.scale], ["Good to know", co.seed.facts]].filter(([, v]) => v && v.length > 0).map(([h, v]) => (
              <section key={h} className="ff-copub-sec"><SectionHead icon={<I11.Star size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={h} />
                <div className="ff-copub-chips">{v.map(x => <span key={x}>{x}</span>)}</div></section>))}
            {co.info && co.info.length > 0 && <CoInfo17 list={co.info} />}
            {co.extras && <VkExtras17 x={co.extras} />}
          </>)}
          {tab === "qa" && <section className="ff-copub-sec ff-copub-pk">
            {services.length > 0 && <VkFold17 title="Packages" count={services.length}><CoCardRow17 type="service" list={services} by={co.name} tag={tag} /></VkFold17>}
            {cocktails.length > 0 && <VkFold17 title="Cocktails" count={cocktails.length}><CoCardRow17 type="cocktail" list={cocktails} by={co.name} tag={tag} /></VkFold17>}
            {pubQa.length > 0 && <VkFold17 title="Q&A" count={pubQa.length}><CoQA17 list={pubQa} name={co.name} /></VkFold17>}
            {!services.length && !cocktails.length && !pubQa.length && <p className="ff-body ff-muted" style={{ margin: 0 }}>No packages yet.</p>}
          </section>}
          {tab === "team" && <section className="ff-copub-sec">
            <TeamParts17 team={team} companies={coCos} network={coNet} teamEmpty="No team yet." renderTeam={(p) => { const on = state.selection.includes(p.id); return (
              <div key={p.id} className="ff-ct17-m"><PlayerTile person={p} selected={on} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />
                {isStaff && !isParty && !co.mine && <Btn variant={on ? "sm" : "sm primary"} onClick={() => { dispatch({ type: on ? "SELECT" : "SELECT_ADD", id: p.id }); dispatch({ type: "TOAST", toast: on ? `${firstName(p.name)} removed from your booking bar` : `${firstName(p.name)} added to your booking bar` }); }}>{on ? <><I11.Check size={13} /> In your booking</> : <><I11.Plus size={13} /> Add to booking</>}</Btn>}
              </div>); }} />
          </section>}
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

/* A row of company tiles (opens the company's page). */
function CoTiles17({ list, label = "Companies" }) {
  const { dispatch } = useStore();
  return (
    <HScroll label={label}>
      {list.map(co => (
        <button key={co.id} type="button" className="ff-co11-tile" onClick={() => { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); }} aria-label={`${co.name}: open their page`}>
          <CompanyCardFace c={co} size="sm" />
        </button>
      ))}
    </HScroll>
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
      <NetBrowse17 query={q} onPick={(p) => dispatch({ type: "VIEW", id: p.id })} scope="staff_" after={!state.netBrief ? <NetMap11 /> : null} teamSlot={myCoKey17(state) ? <CompanyTeam17 /> : null} />
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
