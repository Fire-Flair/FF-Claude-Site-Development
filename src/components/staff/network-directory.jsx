/* src/components/staff/network-directory.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Large page headings: black type with a gold underline (Network page). */
const BIG20_CSS = __ff_css("styles/big20.css");


function BigHead20({ tag, title, count, id }) {
  return React.createElement(React.Fragment, null, React.createElement("style", null, BIG20_CSS),
    React.createElement(tag || "h2", { className: "ff-h1 ff-big20", id: id }, React.createElement("span", { className: "t" }, title), count !== undefined ? React.createElement("span", { className: "ff-pill" }, count) : null));
}


/* v1.16 (Alex, 18 Nov 14:07): a short description under each Network page heading, in the page's body style. */
const NET_LEAD20 = {
  page: "Meet the event and hospitality professionals of FF\u00a0Team and discover the companies behind great events. Professionals sign up from all over the world, and bookings are focused on the UK.",
  pros: "The event and hospitality professionals of FF\u00a0Team, from bartenders and mixologists to managers and front of house, each with their own Profile Card.",
  dir: "The UK companies that make events happen, from mobile cocktail bars and DJs to caterers and event services. Each one has its own Company Card."
};
/* A Network page heading with its description beside the longer, fading gold line (Alex, 18 Nov 14:49). */
function LinedHead20({ tag, title, k }) {
  return React.createElement("div", { className: "ff-tl20" + (tag === "h1" ? " ff-tl20-pg" : "") },
    React.createElement(BigHead20, { tag: tag, title: title }), React.createElement(NetLead20, { k: k }));
}
function NetLead20({ k }) {
  return React.createElement("p", { className: "ff-body ff-netlead20", style: { margin: "-2px 0 14px", maxWidth: 680, overflowWrap: "normal", wordBreak: "normal", hyphens: "manual" } }, NET_LEAD20[k]);
}


function CompaniesSection({ title = "Companies", note, list: listIn, fold, icon, open }) {
  const { state, dispatch } = useStore();
  const list = listIn || companyList(state);
  const Wrap = fold ? ({ children }) => React.createElement(Fold17, { shut: !open, id: fold, icon: icon || React.createElement(I11.Briefcase, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.6 }), title, count: list.length }, children) : ({ children }) => React.createElement("section", { className: "ff-co11-sect", style: { marginTop: 22 } }, React.createElement(SectionHead, { icon: icon || React.createElement(I11.Briefcase, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.6 }), title, count: list.length }), children);
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
/* Netmap: muted FireFlair palette tints (black, burgundy, dark gold, burgundy tint, warm grey), no category rainbow. */
const NET_CAT_VIEW17 = { bar: ["Martini", "#16130F"], dj: ["Music", "#5C1220"], photo: ["PartyPopper", "#7E611D"], catering: ["UtensilsCrossed", "#8A4A55"], svc: ["Wine", "#4A443A"] };
function catIcon17(k) { const v = NET_CAT_VIEW17[k] || ["Briefcase", "var(--gold-dk)"]; return React.createElement(I11[v[0]] || I11.Briefcase, { size: 15, color: v[1], strokeWidth: 1.8 }); }


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
  /* FF Team has no package explorer, so no pillar filter applies to its Directory: every company type shows. */
  const open = state.role === "team" ? "" : (state.netPillar17 || "");
  const every = browseCompanies17(state);
  const all = every.filter(function (c) { return c.unclaimed; });
  /* On FF Staff the signed-in business sees its own Company Card once: the directory entry for the same company is left out. */
  const own = state.role === "staff" && every.find(function (c) { return c.mine; });
  const ownKey = own ? coKey17(own) : "";
  const top = every.filter(function (c) { return !c.unclaimed && !(ownKey && !c.mine && coKey17(c) === ownKey) && (!open || PILLAR_OF_CAT17[c.cat || "bar"] === open); });
  const secs = NET_CO_TYPES17.filter(function (t) { return !open || PILLAR_OF_CAT17[t[0]] === open; })
    .map(function (t) { return [t, all.filter(function (c) { return (c.cat || "bar") === t[0]; })]; })
    .filter(function (x) { return x[1].length; });
  return h("section", { id: "ff-directory", style: { marginTop: 30, scrollMarginTop: 70 } },
    h(BigHead20, { title: "FF Event Directory" }),
    top.length ? h(CompaniesSection, { title: "Featured companies", list: top, icon: React.createElement(I11.Star, { size: 15, color: "var(--gold-dk)", strokeWidth: 1.8 }) }) : null,
    /* Netmap: a category shows once it has a company; every Directory box is open by default (Alex's exception). */
    secs.map(function (x) {
      return h(CompaniesSection, { key: "dir" + x[0][0], title: x[0][1], list: x[1], fold: "ff-dir-" + x[0][0], icon: catIcon17(x[0][0]), open: true });
    }));
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


/* The types of professional on the FF Team network, each a closed drop-down, in CATEGORY_ORDER: Bar, Front of House,
   Management, Back of House, Entertainment, Services, Food, Other.
   net2: Management is its own type, out of Bar. cats: Front of House and Back of House are their own types too. */
const PRO_TYPES17 = [["bar", "Bar", "Bar"], ["foh", "Front of House", "Front of House"], ["mgmt", "Management", "Management"], ["boh", "Back of House", "Back of House"], ["ent", "Entertainment", "Entertainment"], ["svc", "Services", "Services"], ["food", "Food", "Chefs"], ["other", "Other", "Other"]];


function ProsByType17({ onPick }) {
  const { state, dispatch } = useStore();
  const everyone = useDirectory();
  /* v17.48: a person is listed once in every type their top 3 professions cover, the plate showing the best-ranked
     profession of that type; top-profession holders first, then 2nd, then 3rd, then the existing order. */
  const kindOf = (g) => (PRO_TYPES17.find(t => t[2] === g) || ["other"])[0];
  return (
    <>
      {PRO_TYPES17.map(([k, label, icon]) => {
        const list = everyone.map((p, i) => [p, (p.groups || [{ group: p.group, profession: p.profession, rank: 0 }]).find(x => kindOf(x.group) === k), i])
          .filter(([, x]) => x).sort((a, b) => a[1].rank - b[1].rank || a[2] - b[2]).map(([p, x]) => plateAs17(p, x.profession));
        if (!list.length) return null;
        return (
          <Fold17 key={k} id={"ff-pros-" + k} icon={<GroupIcon group={icon} />} title={label} count={list.length} shut>
            {list.length ? (
              <HScroll label={label} snap>
                {list.map(p => <PlayerTile key={p.id} person={p} onClick={() => onPick(p)} />)}
              </HScroll>
            ) : <p className="ff-body ff-muted" style={{ margin: 0 }}>No one yet.</p>}
          </Fold17>
        );
      })}
    </>
  );
}


function NetBrowse17(props) {
  const query = props.query || "";
  const st = useStore(), state = st.state, dispatch = st.dispatch;
  const open = state.netPillar17 || "";
  /* v17.20 FF Team: map, then the search box, then the Directory and Venues. No Our professionals banner, no Explore by area. */
  const team20 = !!props.search && !props.noPackages;
  if (query.trim()) {
    const found = netSearch17(state, query);
    const anyCo = found.cos.length + found.dir.length > 0;
    /* Netmap: the search sits at the top of the Network page, above the map (FF Team: under the page heading). */
    return React.createElement(NetQ17.Provider, { value: query },
      team20 ? netMapWithSearch20(props) : React.createElement(React.Fragment, null,
        props.search ? React.createElement("section", { id: "ff-net-search", style: { marginTop: 4, scrollMarginTop: 70 } }, props.search) : null,
        props.after || null),
      React.createElement(GroupedPeople, { query: query, onPick: props.onPick, scope: props.scope, quietEmpty: anyCo }),
      found.cos.length ? React.createElement(CompaniesSection, { title: "Companies", list: found.cos }) : null,
      found.dir.length ? React.createElement(CompaniesSection, { title: "FF Event Directory", list: found.dir }) : null);
  }
  const groups = open ? Object.keys(PILLAR_OF_GROUP17).filter(function (g) { return PILLAR_OF_GROUP17[g] === open; }) : "";
  const items = BCATS17.map(function (c) { return { k: c.k, t: c.label, s: NET_PILLAR_TEXT17[c.k], img: (window.FF_IMG || {})[BIMG17[c.k]] }; });
  /* FF Team (search passed in): no package explorer; the search sits under the Our professionals banner, then the five type drop-downs. */
  const teamSite = !!props.search && !props.noPackages;
  /* FF Staff (noPackages): no package explorer either; the map comes first and the search sits under Our professionals. */
  const noPkg = teamSite || !!props.noPackages;
  if (team20) {
    return React.createElement(React.Fragment, null,
      /* Netmap: search at the top (under the page heading, above the map), then the map, Our professionals and the Directory. */
      netMapWithSearch20(props),
      React.createElement("section", { id: "ff-our-pros", style: { marginTop: 18, scrollMarginTop: 70 } },
        React.createElement(LinedHead20, { title: "Our professionals", k: "pros" }),
        React.createElement(TopStaff11, null),
        React.createElement(ProsByType17, { onPick: props.onPick })),
      React.createElement(NetDirectory20, null));
  }
  return React.createElement(React.Fragment, null,
    noPkg ? null : React.createElement(BigHead20, { title: "Explore our packages" }),
    noPkg ? null : React.createElement(PillarBox17, { label: "Explore our packages", open: open, items: items, onPick: function (k) { dispatch({ type: "V11_SET", patch: { netPillar17: k } }); } }, open ? React.createElement(NetPackages20, { pillar: open }) : null),
    /* Netmap: the search sits at the top, above the map. */
    !teamSite && props.search ? React.createElement("section", { id: "ff-net-search", style: { marginTop: 4, scrollMarginTop: 70 } }, props.search) : null,
    teamSite ? null : (props.after || null),
    React.createElement("section", { id: "ff-our-pros", style: { marginTop: noPkg ? 18 : 30, scrollMarginTop: 70 } },
      React.createElement(BigHead20, { title: "Our professionals" }),
      teamSite ? (props.search || null) : null,
      teamSite ? (props.after || null) : null,
      React.createElement(TopStaff11, null),
      teamSite
        ? React.createElement(ProsByType17, { onPick: props.onPick })
        : React.createElement(GroupedPeople, { query: "", onPick: props.onPick, scope: props.scope, only: groups, shut: true, insertAfter: props.teamSlot ? "Chefs" : "", insert: props.teamSlot || null })),
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

/* p2/copage (Alex 03:18): the company page in the same format as a person's page. Sections are Cinzel small-caps heads
   (ff-pp21), cards are the person page's theme cards (ff-agrp t-card, coloured by the company's card theme through cardTone17)
   in rails. Tapping a card opens its photos, full text and PDF (CoCardPop17), as before. */
const CO_PAGE_CSS21 = `
/* ---- p2/copage: company page in the person-page format ---- */
.ff .ff-copub .ff-co21 + .ff-co21 { margin-top: 26px; }
.ff .ff-copub .ff-co21.ff-about + .ff-co21 { margin-top: 26px; }
.ff .ff-copub .ff-tabpanel > .ff-co21:first-child { margin-top: 4px; }
.ff .ff-co21-n { font: 600 13px var(--font-sans, Inter, sans-serif); color: var(--color-gold-dk, #7E611D); font-variant-numeric: tabular-nums; }
.ff .ff-co21-lead { margin: 0 0 8px; font: 600 16px/1.4 var(--font-sans, Inter, sans-serif); color: #1E1A12; overflow-wrap: normal; word-break: normal; hyphens: none; }
.ff .ff-co21-p { margin: 0 0 10px; font-size: 15px; line-height: 1.6; color: #2A2620; overflow-wrap: normal; word-break: normal; hyphens: none; }
.ff .ff-co21-quote { margin: 12px 0 0; padding: 14px 16px; border-radius: 18px; corner-shape: squircle; border: 1px solid var(--tc-line, rgba(176,141,42,.7));
  background: var(--tc-bg, #FBF7EE); color: var(--tc-ink, #1E1A12); font-size: 15px; line-height: 1.55; }
.ff .ff-agrp.t-card.ff-co21-card { aspect-ratio: auto; min-height: clamp(220px, 60vw, 270px); gap: 8px; padding: 14px 14px 16px; }
.ff .ff-agrp.t-card.ff-co21-card.ph { width: clamp(196px, 56vw, 236px); }
.ff .ff-co21-card .im { display: block; width: 100%; aspect-ratio: 4 / 3; border-radius: 14px; corner-shape: squircle; overflow: hidden; background: rgba(0,0,0,.08); flex: none; }
.ff .ff-co21-card .im img { width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block; }
.ff .ff-co21-card .ff-agrp-top { padding-bottom: 8px; }
.ff .ff-co21-card .ff-agrp-h { font-size: 16.5px; overflow-wrap: normal; word-break: normal; hyphens: none; }
.ff .ff-co21-card .ff-agrp-d { display: block; overflow: visible; -webkit-line-clamp: none; font-size: 14px; line-height: 1.45; white-space: pre-line; overflow-wrap: normal; word-break: normal; hyphens: none; }
.ff .ff-co21-card .ff-co21-more { margin-top: auto; display: inline-flex; align-items: center; gap: 4px; font-size: 12.5px; font-weight: 600; color: var(--tc-acc, #8A6A1E); }
.ff .ff-co21 .ff-copub-chips { margin-top: 2px; }
.ff .ff-co21-team .ff-ct17-m { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.ff .ff-co21-team .ff-ct17-m .ff-btn { width: 100%; }
`;


/* The company's About: the person page's About box, headed "About". */
function CoAbout21({ text }) {
  const [more, setMore] = useState(false);
  const ref = useRef(null);
  const [over, setOver] = useState(false);
  useLayoutEffect(() => { const el = ref.current; if (el) setOver(more || el.scrollHeight > el.clientHeight + 2); }, [text, more]);
  if (!String(text || "").trim()) return null;
  return (
    <section className="ff-about ff-pp21 ff-about-big ff-co21" aria-labelledby="ff-co21-about-h">
      <div className="ff-pp-head"><h2 id="ff-co21-about-h" className="ff-about-h">About</h2></div>
      <p ref={ref} id="ff-co21-about-text" className={more ? "" : "clamp"}>{text}</p>
      {(over || more) && <button type="button" className="ff-pub-more" aria-expanded={more} aria-controls="ff-co21-about-text" onClick={() => setMore(!more)}>{more ? "Read less" : "Read more"}</button>}
    </section>
  );
}


/* A heading in the person-page style, then the section's content. */
function CoSec21({ id, title, count, children }) {
  return (
    <section className="ff-pp ff-pp21 ff-co21" aria-labelledby={id}>
      <div className="ff-pp-head"><h2 id={id} className="ff-about-h">{title}</h2>{count ? <span className="ff-co21-n">{count}</span> : null}</div>
      {children}
    </section>
  );
}


/* A section's cards as theme cards in a rail; a tap opens the card. */
function CoRail21({ cards, label, numbered, mem, k }) {
  const [pop, setPop] = useState(null);
  const local = useRef({});
  const m = mem || local;
  if (!cards.length) return null;
  const anyPh = cards.some(r => coPhotos17(r).length);
  return (
    <>
      <MemScroll mem={m} k={k || label} label={`${label}, ${cards.length} card${cards.length === 1 ? "" : "s"}`} className="ff-acar">
        {cards.map((r, i) => {
          const ph = coPhotos17(r);
          const extra = ph.length > 1 || (r.document && r.document.name);
          return (
            <button key={r.id} type="button" className={"ff-agrp t-card ff-co21-card" + (anyPh ? " ph" : "")} onClick={() => setPop(r)} aria-label={`Open ${r.name || label}`}>
              {ph[0] ? <span className="im"><img decoding="async" src={ph[0]} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} /></span> : null}
              {(r.name || numbered) ? <span className="ff-agrp-top"><span className="ff-agrp-h">{r.name}</span>{numbered ? <span className="ff-agrp-n">{String(i + 1).padStart(2, "0")}</span> : null}</span> : null}
              {String(r.description || "").trim() ? <span className="ff-agrp-d">{r.description}</span> : null}
              {extra ? <span className="ff-co21-more">{ph.length > 1 ? <><I11.Images size={13} aria-hidden="true" /> {ph.length}</> : <><I11.FileText size={13} aria-hidden="true" /> PDF</>}</span> : null}
            </button>
          );
        })}
      </MemScroll>
      <CoCardPop17 card={pop} onClose={() => setPop(null)} />
    </>
  );
}


/* The company's own "More information" sections (the one company shape), each a headed section with its cards in a rail. */
function CoInfo21({ co, mem }) {
  return coSections17(co).map((sec, si) => {
    const cards = coShownCards17(coSecAll17(co, sec));
    const paras = String(sec.text || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
    const chips = (sec.chips || []).filter(Boolean);
    if (!cards.length && !paras.length && !sec.lead && !sec.quote && !chips.length) return null;
    return (
      <CoSec21 key={sec.id || si} id={"ff-co21-s" + si} title={sec.title}>
        {sec.lead ? <p className="ff-co21-lead">{sec.lead}</p> : null}
        {paras.map((p, i) => <p key={"p" + i} className="ff-co21-p">{p}</p>)}
        {chips.length ? <div className="ff-copub-chips">{chips.map((x) => <span key={x}>{x}</span>)}</div> : null}
        <CoRail21 cards={cards} label={sec.title} numbered={!!sec.numbered} mem={mem} k={"s" + si} />
        {sec.quote ? <p className="ff-co21-quote">{sec.quote}</p> : null}
      </CoSec21>
    );
  });
}


/* The company's Team tab, laid out like a person's: the team grouped by profession, then Companies, then Network. */
function CoTeamTab21({ co, team, companies, network, renderTeam }) {
  const { dispatch } = useStore();
  const view = (p) => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); };
  const none = (t) => <p className="ff-body ff-muted" style={{ margin: 0 }}>{t}</p>;
  const groups = CATEGORY_ORDER.map(g => [g, team.filter(p => (p.group || "Other") === g)]).filter(([, l]) => l.length);
  const rest = team.filter(p => !CATEGORY_ORDER.includes(p.group || "Other"));
  if (rest.length) groups.push(["Other", rest]);
  const key = coKey17(co) || co.id;
  return (
    <div className="ff-tt17 ff-co21-team">
      <style>{TEAM_TAB_CSS17}</style>
      <Fold17 id={"co21_team_" + key} icon={<I11.Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={`${co.name || "Company"} team`} count={team.length}>
        {!team.length ? none("No team yet.") : groups.map(([g, l]) => (
          <div key={g} className="ff-tt17-group">
            <div className="ff-tt17-gh">{g} <i>{l.length}</i></div>
            <div className="ff-tt17-grid">{l.map(p => renderTeam(p, () => view(p)))}</div>
          </div>
        ))}
      </Fold17>
      <Fold17 id={"co21_cos_" + key} icon={<I11.Briefcase size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Companies" count={companies.length}>
        {companies.length ? <CoTiles17 list={companies} label="Companies" /> : none("No companies yet.")}
      </Fold17>
      {co.mine ? (
        <Fold17 id={"co21_net_" + key} icon={<TtNet17 size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Network" count={network.length} shut>
          {network.length ? <div className="ff-tt17-grid">{network.map(p => <TeamTile17 key={p.id} p={p} onClick={() => view(p)} />)}</div> : none("No one yet.")}
        </Fold17>
      ) : null}
    </div>
  );
}


/* A company's page, as anyone sees it. */
function CompanyPublic({ co: coIn, done, onEdit, slot } = {}) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const co = coIn || companyById(state, state.viewingCompany);
  const [asking, setAsking] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [revOpen, setRevOpen] = useState(null);
  const railMem = useRef({});
  /* On a public company page the tab is kept in the store so it is part of the address; the owner's preview keeps its own. */
  const [ltab, setLtab] = useState("overview");
  const inStore = !coIn && !!state.viewingCompany;
  const tab = !inStore ? ltab : (co && state.ptab17 && state.ptab17.key === "c:" + co.id ? state.ptab17.tab : "overview");
  const setTab = (t) => !inStore ? setLtab(t) : dispatch({ type: "V11_SET", patch: { ptab17: t === "overview" || !co ? null : { key: "c:" + co.id, tab: t } } });
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
  const contact = coContacts17(co).map(x => [x.kind, x.value]);
  /* One rule for every company: the areas come from the location records when the page has them; the free-text areas line is only for directory drafts without records. */
  const recAreas = companyLocations(co);
  const areas = co.mine || recAreas.length ? recAreas : String(co.areas || "").split("·").map(x => x.trim()).filter(Boolean);
  const venues = !SHOW_VENUES17 ? [] : co.mine ? recsOf(co, "venues").filter(r => !r.hidden).map(r => r.name) : (co.venues || []);
  /* Reviews posted on this company's page (state.reviews, newest first) come before its own. Declined ones never show; a waiting one only to its writer (as reviewRecordsFor). */
  const hiddenRv = (state.admin17 && state.admin17.hidden && state.admin17.hidden.reviews) || {};
  const posted = (state.reviews || []).filter(r => !hiddenRv[r.id] && r.status !== "declined" && (r.status !== "pending" || r.byId === "me")).filter(r => r.aboutId === co.id || ck &&  (r.aboutId && r.aboutId !== "me" && coKey17(companyById(state, r.aboutId)) === ck)).slice().reverse().map(r => [null, r.rating, r.text, r.byName, r.status === "pending"]);
  /* p2/copage: the same reviews as Review Cards (posted ones keep their own record: date, writer, worked together). */
  const revCards = [
    ...(state.reviews || []).filter(r => !hiddenRv[r.id] && r.status !== "declined" && (r.status !== "pending" || r.byId === "me")).filter(r => r.aboutId === co.id || ck && (r.aboutId && r.aboutId !== "me" && coKey17(companyById(state, r.aboutId)) === ck)).slice().reverse()
      .map(r => ({ rec: { id: r.id, rating: r.rating, description: r.text, pending: r.status === "pending" }, raw: r })),
    ...(co.mine ? (co.reviews || []).map(r => [null, r.rating, r.text, r.byName, false, r.at]) : (co.reviews || [])).map((r, i) => ({ rec: { id: "cor" + i, rating: r[1] || null, description: r[2] }, raw: { rating: r[1] || null, text: r[2], byName: r[3], at: r[5] } })),
    ...coWebReviews17(co).map((r, i) => ({ rec: { id: "cow" + i, rating: null, description: r.description }, raw: { rating: null, text: r.description, byName: r.name } })),
  ];
  const reviews = [...posted, ...(co.mine ? (co.reviews || []).map(r => [null, r.rating, r.text, r.byName]) : (co.reviews || [])), ...coWebReviews17(co).map(r => [null, 0, r.description, r.name])];
  const ownQa = co.mine || co.qa ? coQa(co).filter(q => q.group !== "feedback" && (q.answer || String(q.note || "").trim())) : [];
  /* Questions asked on this page that the company answered and made public sit next to its own Q&A, newest first. */
  const askedQa = (state.profileQuestions || []).filter(q => q.companyKey && q.companyKey === ck && q.visibility === "public" && isAnswered(q.answer)).slice().reverse().map(q => ({ id: q.id, text: q.text, answer: q.answer, note: "", group: "business" }));
  const pubQa = [...askedQa, ...ownQa];
  const services = coPackages17(co), cocktails = coCocktails17(co);
  const pkgBlock = (services.length > 0 || cocktails.length > 0 || pubQa.length > 0) ? <>
    {services.length > 0 && <CoSec21 id="ff-co21-pk" title="Packages" count={services.length}><CoRail21 cards={services} label="Packages" mem={railMem} k="pk" /></CoSec21>}
    {cocktails.length > 0 && <CoSec21 id="ff-co21-ck" title="Cocktails" count={cocktails.length}><CoRail21 cards={cocktails} label="Cocktails" mem={railMem} k="ck" /></CoSec21>}
    {pubQa.length > 0 && <CoSec21 id="ff-co21-qa" title="Q&A" count={pubQa.length}><CoQA17 list={pubQa} name={co.name} /></CoSec21>}
  </> : <TabEmpty17 icon={<I11.Sparkles size={20} />}>No packages yet.</TabEmpty17>;
  const isParty = isStaff && hireSiteOf(state).party;
  /* Claim this profile: a directory company nobody has claimed, on FF Staff, for a visitor who is not already claiming one. */
  const mineClaim = coClaimMine17(state);
  const canClaim = !done && isStaff && !isParty && !co.mine && co.unclaimed && !co.claimPending && !isAdmin17(state) && !coClaimOn17(state, co.slug) && !(mineClaim && mineClaim.status !== "rejected");
  const claimIt = () => {
    dispatch({ type: "SESSION", patch: { claimSlug: co.slug } });
    dispatch({ type: "VIEW_COMPANY", id: null });
    dispatch({ type: "TAB", tab: "profile" });
    window.scrollTo(0, 0);
  };
  const tabs = [{ key: "overview", label: "Overview" }, { key: "qa", label: "Packages", count: services.length + cocktails.length }, { key: "team", label: "Team", count: team.length }, { key: "reviews", label: "Reviews", count: reviews.filter(x => !x[4]).length }];
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
  const tag = rt17Slug(co) || cx17Slug(co.name || "");
  const shareBtn = (co.slug || co.name) ? <CardShareBtn17 title={`${co.name || "Company"} on FireFlair`} url={`https://${CARD_DOMAIN}/${tag}`} fileName={"fireflair-" + cx17Slug(co.slug || co.name)} render={() => <CompanyCardFace c={co} />} label="Share" className="wide" /> : null;
  const acts = done ? [] : [
    !co.unclaimed && !co.mine && ["ask", <Btn variant="wide" onClick={() => setAsking(true)}><I11.MessageSquare size={14} /> Ask a question</Btn>],
    !co.mine && !isParty && ["net", <NetBtn17 id={co.id} name={co.name} wide />],
    !co.unclaimed && !co.mine && ["rev", <Btn variant="wide" onClick={() => setReviewing(true)}><I11.Award size={14} /> Review</Btn>],
    canClaim && ["claim", <Btn variant="wide primary" onClick={claimIt}><I11.BadgeCheck size={14} /> Claim this profile</Btn>],
    shareBtn && ["share", shareBtn],
  ].filter(Boolean);
  const about = String(co.description || "").split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
  return (
    <div className="ff-copub">
      <PublicHero media={(co.mediaList || []).map(m => ({ id: m.id, src: m.src, name: m.alt || "" }))} card={<><CompanyCardFace c={co} links />{done && shareBtn ? <div style={{ marginTop: 10, textAlign: "center" }}><CardShareBtn17 title={`${co.name || "Company"} on FireFlair`} url={`https://${CARD_DOMAIN}/${tag}`} fileName={"fireflair-" + cx17Slug(co.slug || co.name)} render={() => <CompanyCardFace c={co} />} label="Share Company Card" /></div> : null}</>} below={<>
      {!done && <BackBtn17 fallback={back} />}
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
      {!done && (co.claimPending || co.claimRejected) && <div className="ff-copub-acts"><span style={{ display: "flex", justifyContent: "center" }}><Pill tone="warn">{co.claimRejected ? "Claim not approved" : "Claim being checked"}</Pill></span></div>}
      {acts.length > 0 && <div className="ff-copub-grid">{acts.map(([k, el], i) => { const last = acts.length % 2 && i === acts.length - 1; /* A Share left alone on the last row: centred, half the row wide. */ return <div key={k} className={"c-" + k + (last ? " span" : "") + (last && k === "share" ? " ff-share-half" : "")}>{el}</div>; })}</div>}
      </>} />

      <div className="ff-ptabs-wrap" style={cardTone17(co.theme || "onyx")}>
        <ProfileCoin17 />
        <style>{CO_PAGE_CSS21}</style>
        <ProfileH117 person={{ name: co.name, profession: [].concat(co.kind || [])[0], locations: [co.area || areas[0]].filter(Boolean) }} />
        {!co.unclaimed && <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />}
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
          {tab === "overview" && (<>
            <style>{RANK_CSS17}</style>
            {about.length > 0 && <CoAbout21 text={about.join("\n\n")} />}
            {contact.length > 0 && <CoSec21 id="ff-co21-contact" title="Contact">
              <ul className="ff-copub-contact">{contact.map(([k, v]) => { const href = coContactHref17(k, v); return <li key={k + v}><a href={href} target={/^https?:/.test(href) ? "_blank" : undefined} rel="noopener noreferrer"><span className="ic"><CoKindIcon17 kind={k} size={15} /></span><span><small>{k}</small><b>{v}</b></span></a></li>; })}</ul></CoSec21>}
            {(areas.length > 0 || venues.length > 0) && <CoSec21 id="ff-co21-areas" title="Areas covered">
              <div className="ff-copub-chips">{areas.map(a => <span key={a}><I11.MapPin size={12} /> {a}</span>)}{venues.map(v => <span key={v} className="ven"><I11.Star size={12} /> {v}</span>)}</div></CoSec21>}
            {co.info && co.info.length > 0 && <CoInfo21 co={co} mem={railMem} />}
            {co.unclaimed && (services.length > 0 || cocktails.length > 0 || pubQa.length > 0) && pkgBlock}
          </>)}
          {tab === "qa" && <><style>{RANK_CSS17}</style>{pkgBlock}</>}
          {tab === "team" && <CoTeamTab21 co={co} team={team} companies={coCos} network={coNet} renderTeam={(p, open) => { const on = state.selection.includes(p.id); return (
            <div key={p.id} className="ff-ct17-m"><TeamTile17 p={p} onClick={open} />
              {isStaff && !isParty && !co.mine && <Btn variant={on ? "sm" : "sm primary"} onClick={() => { dispatch({ type: on ? "SELECT" : "SELECT_ADD", id: p.id }); dispatch({ type: "TOAST", toast: on ? `${firstName(p.name)} removed from your booking bar` : `${firstName(p.name)} added to your booking bar` }); }}>{on ? <><I11.Check size={13} /> In your booking</> : <><I11.Plus size={13} /> Add to booking</>}</Btn>}
            </div>); }} />}
          {tab === "reviews" && (revCards.length
            ? <div className="ff-rc35-list"><style>{RANK_CSS17}</style>{revCards.map(x => <ReviewCard35 key={x.rec.id} rec={x.rec} raw={x.raw} writer={reviewWriter35(state, all, x.raw)} about={asPerson} onOpen={() => setRevOpen(x)} />)}</div>
            : <TabEmpty17 icon={<I11.Award size={20} />}>No reviews yet.</TabEmpty17>)}
        </div>
      </div>
      <Sheet open={!!revOpen} onClose={() => setRevOpen(null)} title="Review">
        {revOpen && <div className="ff-rc35-full"><ReviewCard35 rec={revOpen.rec} raw={revOpen.raw} writer={reviewWriter35(state, all, revOpen.raw)} about={asPerson} /></div>}
      </Sheet>
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


/* Network pages (FF Team, FF Staff, FF Party): Top staff, then the map. */
const TOP_STAFF11 = ["stf_alex", "stf_gav", "stf_bruno", "stf_simao", "stf_dany", "stf_james"];


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
