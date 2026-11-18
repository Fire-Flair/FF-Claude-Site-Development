/* src/components/team/teams-preview.jsx — SCRATCH PREVIEW ONLY (branch p2/teams, never merged).
   Three ways to show the Team tab split into My team / Company teams / Network, with a seeded 30-person team.
   Switched on only by localStorage.ffTeamsOpt = "1" | "2" | "3"; unset, the Team tab is unchanged.
   The 30 team members, 46 network entries and crews below are SAMPLE data made up for the pictures (initials only,
   no photos). Nothing here writes to the store. */

const TEAMS_PREVIEW_CSS = __ff_css("styles/teams-preview.css");
const TpLock = lucideIcon("Lock");
const TpStar = lucideIcon("Star");
const TpSearch = lucideIcon("Search");
const TpPlus = lucideIcon("Plus");
const TpChevron = lucideIcon("ChevronDown");
const TpUsers = lucideIcon("Users");
const TpBriefcase = lucideIcon("Briefcase");
const TpNetwork = lucideIcon("Share2");

function teamsOpt17() {
  try { const v = +(window.localStorage.getItem("ffTeamsOpt") || 0); return v >= 1 && v <= 3 ? v : 0; } catch (e) { return 0; }
}

/* Crews: named groups the owner makes inside their own team. "public" crews show to visitors. */
const TP_CREWS = [
  { key: "festival", name: "Festival bar", vis: "public" },
  { key: "weddings", name: "Weddings", vis: "public" },
  { key: "masterclass", name: "Cocktail masterclass", vis: "public" },
  { key: "glasgow", name: "Glasgow", vis: "private" },
];

/* [name, profession, area, crews, joined through the owner's link] */
const TP_SEED = [
  ["Ellie Harper", "Bartender", "London", ["festival", "weddings"], 1], ["Marcus Reid", "Cocktail Bartender", "London", ["festival", "masterclass"], 1],
  ["Priya Nair", "Mixologist", "London", ["masterclass", "weddings"], 1], ["Tomás Ferreira", "Flair Bartender", "Brighton", ["festival"], 1],
  ["Hannah Walsh", "Bartender", "Glasgow", ["glasgow", "festival"], 1], ["Callum Fraser", "Barback", "Glasgow", ["glasgow", "festival"], 1],
  ["Sofia Romano", "Mixologist", "Manchester", ["masterclass"], 0], ["Jake Thornton", "Bartender", "Leeds", ["festival"], 1],
  ["Amara Okafor", "Cocktail Bartender", "London", ["weddings"], 1], ["Lewis Grant", "Bartender", "Edinburgh", ["glasgow"], 0],
  ["Chloe Bennett", "Bartender", "London", ["festival", "weddings"], 1], ["Ryan Doyle", "Barback", "London", ["festival"], 1],
  ["Isla McKenzie", "Mixologist", "Glasgow", ["glasgow", "masterclass"], 1], ["Daniel Cho", "Flair Bartender", "London", ["festival"], 0],
  ["Grace Whitfield", "Waiter", "London", ["weddings"], 1], ["Oliver Price", "Event Host", "Bristol", [], 1],
  ["Maya Patel", "Sommelier", "London", ["weddings"], 0], ["Ben Hughes", "Front of House", "London", ["festival"], 1],
  ["Lucy Sinclair", "Host", "Glasgow", ["glasgow"], 1], ["Nathan Cole", "Event Manager", "London", ["festival", "weddings"], 0],
  ["Rachel Moss", "Bar Manager", "Manchester", [], 1], ["Kieran Boyle", "Floor Manager", "London", [], 1],
  ["Zara Ahmed", "Event Planner", "London", ["weddings"], 0], ["Sam Ellison", "DJ", "London", ["weddings"], 1],
  ["Leo Martins", "Saxophonist", "London", [], 1], ["Jade Turner", "Photographer", "London", ["weddings"], 1],
  ["Finn Gallagher", "Chef", "London", [], 0], ["Ruby Clarke", "Event Chef", "Brighton", [], 1],
  ["Owen Pryce", "Stock Controller", "London", ["festival"], 1], ["Megan Lloyd", "Catering Assistant", "Cardiff", [], 1],
];

const TP_NET_NAMES = ["Aisha Khan", "Ben Carter", "Cara Dunn", "Dev Malik", "Erin Shaw", "Fraser Bell", "Gemma Rowe", "Harry Lane", "Iris Quinn", "Jon Vega",
  "Kara Mills", "Liam Ford", "Mia Rossi", "Noah Pike", "Orla Byrne", "Pete Hale", "Quinn Ash", "Rosa Vale", "Seb Moore", "Tara Holt",
  "Umar Rafiq", "Vic Lowe", "Will Snow", "Xena Ray", "Yara Bloom", "Zak Wilde", "Abi Stone", "Cal Webb", "Dina Frost", "Eli Hart",
  "Faye Moon", "Gus Hale", "Hope Kerr", "Ivan Rook", "Jess Lane", "Kit Marsh", "Lola Penn", "Max Doyle", "Nell Crane", "Otto Ruiz"];

function tpPeople17() {
  if (tpPeople17.c) return tpPeople17.c;
  const team = TP_SEED.map(([name, profession, area, crews, rec], i) => {
    const p = staff({ id: "tp_" + i, name, profession, professions: [profession], skills: [], locations: [area], photo: "", tier: "standard" });
    return { ...p, group: personCategory(p), crews, recruited: !!rec, area };
  });
  const net = TP_NET_NAMES.map((name, i) => { const prof = ["Bartender", "Mixologist", "Waiter", "Event Manager", "DJ"][i % 5]; const p = staff({ id: "tpn_" + i, name, profession: prof, professions: [prof], skills: [], locations: ["London"], photo: "", tier: "standard" }); return { ...p, group: personCategory(p) }; });
  tpPeople17.c = { team, net };
  return tpPeople17.c;
}

/* Company teams the profile's owner is a member of (accepted coTeams17), with the role inside each company. */
const TP_COMPANIES = [
  { id: "co_vooshka", role: "Head bartender", size: 14, from: [0, 2, 8, 12] },
  { id: "co_raise-the-bar", role: "Member", size: 22, from: [4, 5, 9, 18] },
  { id: "co_ministry-of-cocktails", role: "Member", size: 9, from: [1, 6, 13] },
];
const TP_NET_COS = ["co_bar-brothers-events", "co_mix-and-twist", "co_the-cocktail-house", "co_purple-fizz", "co_blue-blazer-events", "co_barworx"];

const tpTeamCount17 = () => TP_SEED.length;

/* A small person tile: portrait, name (wraps between words, shrinks if one word is too long), profession. */
function TpTile({ p, own, row }) {
  const { dispatch } = useStore();
  const tap = () => dispatch({ type: "TOAST", toast: `${p.name}: sample member` });
  if (row) {
    return (
      <button type="button" className="tp-row" onClick={tap}>
        <Portrait src={p.photo} name={p.name} size={44} />
        <span className="tx"><b>{p.name}</b><small>{p.profession} · {p.area}</small></span>
        <span className="cr">{p.crews.map(k => TP_CREWS.find(c => c.key === k)).filter(c => c && (own || c.vis === "public")).slice(0, 2).map(c => <i key={c.key}>{c.name}</i>)}</span>
        {own && p.recruited ? <span className="rec" title="Joined through your link" aria-label="Joined through your link"><TpStar size={11} fill="currentColor" aria-hidden="true" /></span> : <span className="rec0" />}
      </button>
    );
  }
  return (
    <button type="button" className="tp-tile" onClick={tap}>
      {own && p.recruited ? <span className="rec" title="Joined through your link" aria-label="Joined through your link"><TpStar size={10} fill="currentColor" aria-hidden="true" /></span> : null}
      <Portrait src={p.photo} name={p.name} size={58} />
      <b><FitLabel17>{p.name}</FitLabel17></b>
      <small><FitLabel17>{p.profession}</FitLabel17></small>
    </button>
  );
}

/* Overlapping faces + "+N". */
function TpStack({ people, total }) {
  const shown = people.slice(0, 5);
  return (
    <span className="tp-stack" aria-hidden="true">
      {shown.map(p => <span key={p.id} className="f"><Portrait src={p.photo} name={p.name} size={30} /></span>)}
      {total > shown.length ? <span className="more">+{total - shown.length}</span> : null}
    </span>
  );
}

/* Section heading for the three tiers. */
function TpHead({ icon, title, count, sub }) {
  return (
    <div className="tp-head">
      <span className="ic">{icon}</span>
      <h3>{title}</h3>
      <span className="n">{count}</span>
      <span className="line" />
      {sub ? <span className="sub">{sub}</span> : null}
    </div>
  );
}

/* The collapsed box used for crews, companies and Network. */
function TpBox({ title, count, extra, startOpen, lock, children, logo }) {
  const [open, setOpen] = useState(!!startOpen);
  return (
    <div className={"tp-box" + (open ? " open" : "")}>
      <button type="button" className="hd" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        {logo || null}
        <span className="t"><b>{title}{lock ? <TpLock size={12} aria-label="Only you see this crew" /> : null}</b>{extra ? <small>{extra}</small> : null}</span>
        <span className="n">{count}</span>
        <TpChevron size={16} aria-hidden="true" />
      </button>
      {open && <div className="bd">{children}</div>}
    </div>
  );
}

function TpCoLogo({ co }) {
  const ini = String(co.name || "").split(/\s+/).filter(w => /^[A-Za-z]/.test(w)).map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const [bad, setBad] = useState(false);
  return <span className="tp-logo" aria-hidden="true">{co.logo && !bad ? <img src={co.logo} alt="" onError={() => setBad(true)} /> : ini}</span>;
}

/* Crew tabs: All, then each crew (private ones only for the owner), then + New crew (a type box) for the owner. */
function TpCrewTabs({ own, crew, setCrew, team }) {
  const [adding, setAdding] = useState(false);
  const crews = TP_CREWS.filter(c => own || c.vis === "public");
  return (
    <div className="tp-crews" role="tablist" aria-label="Crews">
      <button type="button" role="tab" aria-selected={crew === ""} className={crew === "" ? "on" : ""} onClick={() => setCrew("")}>All <i>{team.length}</i></button>
      {crews.map(c => (
        <button key={c.key} type="button" role="tab" aria-selected={crew === c.key} className={crew === c.key ? "on" : ""} onClick={() => setCrew(c.key)}>
          {c.vis === "private" ? <TpLock size={11} aria-label="Only you see this crew" /> : null}{c.name} <i>{team.filter(p => p.crews.includes(c.key)).length}</i>
        </button>
      ))}
      {own ? (adding
        ? <input className="tp-newcrew" autoFocus placeholder="New crew" aria-label="New crew" onBlur={() => setAdding(false)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setAdding(false); }} />
        : <button type="button" className="tp-plus" aria-label="New crew" onClick={() => setAdding(true)}><TpPlus size={15} aria-hidden="true" /></button>) : null}
    </div>
  );
}

function TpCompanies({ variant, own }) {
  const { state, dispatch } = useStore();
  const { team } = tpPeople17();
  const list = TP_COMPANIES.map(x => ({ ...x, co: companyById(state, x.id) })).filter(x => x.co);
  const open = (co) => { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); };
  if (variant === 1) {
    return (
      <div className="tp-cos1">
        {list.map(x => (
          <button key={x.id} type="button" className="tp-co" onClick={() => open(x.co)}>
            <TpCoLogo co={x.co} />
            <span className="tx"><b>{x.co.name}</b><small>{x.role}</small></span>
            <span className="ft"><TpStack people={x.from.map(i => team[i])} total={x.size} /></span>
          </button>
        ))}
      </div>
    );
  }
  if (variant === 2) {
    return list.map(x => (
      <TpBox key={x.id} title={x.co.name} count={x.size} extra={x.role} logo={<TpCoLogo co={x.co} />}>
        <div className="tp-grid">{x.from.map(i => <TpTile key={i} p={team[i]} own={own} />)}</div>
      </TpBox>
    ));
  }
  return (
    <div className="tp-list">
      {list.map(x => (
        <button key={x.id} type="button" className="tp-row" onClick={() => open(x.co)}>
          <TpCoLogo co={x.co} />
          <span className="tx"><b>{x.co.name}</b><small>{x.role} · {x.size} on the team</small></span>
          <span className="cr" />
          <span className="rec0" />
        </button>
      ))}
    </div>
  );
}

function TpNetworkBox({ own }) {
  const { state } = useStore();
  const { net } = tpPeople17();
  const cos = TP_NET_COS.map(id => companyById(state, id)).filter(Boolean);
  const total = net.length + cos.length;
  return (
    <div className="tp-tier tp-net">
      <TpBox title="Network" count={total} extra={own ? `${net.length} people · ${cos.length} companies` : null} logo={<span className="tp-ic"><TpNetwork size={15} aria-hidden="true" /></span>}>
        {own ? (<>
          <div className="tp-sub">People</div>
          <div className="tp-rowscroll">{net.slice(0, 12).map(p => <TpTile key={p.id} p={{ ...p, area: "London", crews: [] }} own={false} />)}</div>
          <div className="tp-sub">Companies</div>
          <div className="tp-list">{cos.map(c => <div key={c.id} className="tp-row"><TpCoLogo co={c} /><span className="tx"><b>{c.name}</b><small>{c.kind}</small></span><span className="cr" /><span className="rec0" /></div>)}</div>
        </>) : <div className="tp-grid">{net.slice(0, 8).map(p => <TpTile key={p.id} p={{ ...p, area: "London", crews: [] }} own={false} />)}</div>}
      </TpBox>
    </div>
  );
}

/* OPTION 1 — SIMPLE DEFAULT: one personal team, added like a friend, no naming. Grouped automatically by profession; search once it passes 12. */
function TpOption1({ own, first }) {
  const { team } = tpPeople17();
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const shown = team.filter(p => !n || (p.name + " " + p.profession + " " + p.area).toLowerCase().includes(n));
  const groups = CATEGORY_ORDER.map(g => [g, shown.filter(p => p.group === g)]).filter(([, l]) => l.length);
  const rec = team.filter(p => p.recruited).length;
  return (<>
    <section className="tp-tier">
      <TpHead icon={<TpUsers size={15} />} title={own ? "My team" : `${first}'s team`} count={team.length} sub={own ? `${rec} joined through you` : null} />
      {team.length > 12 ? <div className="tp-tools"><label className="tp-search"><TpSearch size={15} aria-hidden="true" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={own ? "Search your team" : "Search the team"} aria-label="Search the team" /></label></div> : null}
      {groups.map(([g, l]) => (
        <div key={g} className="tp-group">
          <div className="tp-sub">{g} <i>{l.length}</i></div>
          <div className="tp-rowscroll">{l.map(p => <TpTile key={p.id} p={p} own={own} />)}</div>
        </div>
      ))}
    </section>
    <section className="tp-tier">
      <TpHead icon={<TpBriefcase size={15} />} title="Company teams" count={TP_COMPANIES.length} />
      <TpCompanies variant={1} own={own} />
    </section>
    <TpNetworkBox own={own} />
  </>);
}

/* OPTION 2 — OPTIONAL EXTRA: the same team plus named crews (for company owners and big recruiters). Every crew and company is a collapsed box with faces. */
function TpOption2({ own, first }) {
  const { team } = tpPeople17();
  const crews = TP_CREWS.filter(c => own || c.vis === "public");
  const loose = team.filter(p => !p.crews.some(k => crews.some(c => c.key === k)));
  const rec = team.filter(p => p.recruited).length;
  const box = (key, title, list, lock, startOpen) => (
    <TpBox key={key} title={title} count={list.length} lock={lock} startOpen={startOpen} logo={<TpStack people={list} total={list.length} />}>
      <div className="tp-grid">{list.map(p => <TpTile key={p.id} p={p} own={own} />)}</div>
    </TpBox>
  );
  return (<>
    <section className="tp-tier">
      <TpHead icon={<TpUsers size={15} />} title={own ? "My team" : `${first}'s team`} count={team.length} sub={own ? `${rec} joined through you` : null} />
      {crews.map((c, i) => box(c.key, c.name, team.filter(p => p.crews.includes(c.key)), c.vis === "private", i === 1))}
      {box("loose", own ? "Not in a crew" : "More of the team", loose, false, false)}
      {own ? <input className="tp-newcrew wide" placeholder="New crew" aria-label="New crew" /> : null}
    </section>
    <section className="tp-tier">
      <TpHead icon={<TpBriefcase size={15} />} title="Company teams" count={TP_COMPANIES.length} />
      <TpCompanies variant={2} own={own} />
    </section>
    <TpNetworkBox own={own} />
  </>);
}

/* OPTION 3 — SIMPLE ROSTER: one personal team as a list with search and order (two columns on wide screens). No naming. */
function TpOption3({ own, first }) {
  const { team } = tpPeople17();
  const crew = "";
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("recent");
  const [all, setAll] = useState(false);
  const n = q.trim().toLowerCase();
  let shown = (crew ? team.filter(p => p.crews.includes(crew)) : team).filter(p => !n || (p.name + " " + p.profession + " " + p.area).toLowerCase().includes(n));
  if (sort === "az") shown = [...shown].sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "prof") shown = [...shown].sort((a, b) => CATEGORY_ORDER.indexOf(a.group) - CATEGORY_ORDER.indexOf(b.group) || a.name.localeCompare(b.name));
  const cut = all || n ? shown : shown.slice(0, 10);
  const rec = team.filter(p => p.recruited).length;
  return (<>
    <section className="tp-tier">
      <TpHead icon={<TpUsers size={15} />} title={own ? "My team" : `${first}'s team`} count={team.length} sub={own ? `${rec} joined through you` : null} />
      <div className="tp-tools">
        <label className="tp-search"><TpSearch size={15} aria-hidden="true" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={own ? "Search your team" : "Search the team"} aria-label="Search the team" /></label>
        <div className="tp-seg" role="group" aria-label="Order">
          {[["recent", "Recent"], ["az", "A–Z"], ["prof", "Profession"]].map(([k, l]) => <button key={k} type="button" aria-pressed={sort === k} className={sort === k ? "on" : ""} onClick={() => setSort(k)}>{l}</button>)}
        </div>
      </div>
      <div className="tp-list two">{cut.map(p => <TpTile key={p.id} p={{ ...p, crews: [] }} own={own} row />)}</div>
      {cut.length < shown.length ? <button type="button" className="tp-all" onClick={() => setAll(true)}>All {shown.length}</button> : null}
    </section>
    <section className="tp-tier">
      <TpHead icon={<TpBriefcase size={15} />} title="Company teams" count={TP_COMPANIES.length} />
      <TpCompanies variant={3} own={own} />
    </section>
    <TpNetworkBox own={own} />
  </>);
}

function TeamsPreview17({ person, opt }) {
  const own = person.id === "me";
  const first = String(person.name || "").split(" ")[0] || "Their";
  const O = opt === 1 ? TpOption1 : opt === 2 ? TpOption2 : TpOption3;
  return (
    <div className={"tp-wrap tp-o" + opt}>
      <style>{TEAMS_PREVIEW_CSS}</style>
      <O own={own} first={first} />
    </div>
  );
}
