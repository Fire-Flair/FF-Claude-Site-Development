/* src/components/party/hire.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==== v16.64 FF Party: its own booking journey, Network and hire cards ==================
   The booking page is where an event is planned. It opens with the phone number and FireFlair
   side by side (easy to skip), then says how it works, then:
     1 Your event      name, type, date, time, place, private or corporate, and the guest
                       numbers as three buttons. The guest buttons drive everything below.
     2 Your service    the FireFlair Service Cards that suit that many guests, or a custom one.
     3 Your team       people who have signed up to the card, or companies. Corporate events
                       and 100+ guests are booked through a company (public liability insurance).
     Review & Confirm  the same coin as FF Staff.                                               */

const OCC_PARTY11 = ["Hen parties", "Stag dos", "Weddings", "Birthdays", "House parties", "Garden parties", "Engagement parties", "Anniversaries",
  "Christmas parties", "New Year's Eve", "Baby showers", "Graduations", "Corporate events", "Brand launches", "Private dinners", "Summer parties"];


const PARTY_BANDS11 = [
  { k: "s", label: "Up to 30", sub: "One or two staff, booked directly", guests: "Up to 30" },
  { k: "m", label: "31 to 100", sub: "Book people or a company", guests: "31 to 100" },
  { k: "l", label: "100+", sub: "Booked through a company", guests: "100+" },
];


const bandOf11 = (ev) => (ev && ev.band) || "";


/* Which FireFlair Service Cards suit which party size. */
const SVC_BANDS11 = { svc_bartending: ["s", "m"], svc_mixology: ["s", "m", "l"], svc_masterclass: ["s"], svc_flair: ["s", "m", "l"], svc_full: ["m", "l"], svc_staffing: ["s", "m", "l"] };


const svcFits11 = (svc, band) => !band || (SVC_BANDS11[svc.id] || ["s", "m", "l"]).includes(band);


const whyCompany11 = (ev) => ev && ev.audience === "corporate"
  ? "Corporate events are booked through a company, which carries the public liability insurance."
  : "Events of 100 guests or more are booked through a company.";


/* Who has signed up to a Service Card (sample data in the prototype): people whose profession fits the card. */
const SVC_PROF11 = { svc_bartending: "bartend", svc_mixology: "mixolog", svc_masterclass: "mixolog", svc_flair: "flair", svc_full: "bartend", svc_staffing: "waiter|host|barback|event|server|mc" };


const signedUp11 = (p, svcId) => {
  const rx = new RegExp(SVC_PROF11[svcId] || "bartend", "i");
  return !p.isCompany && rx.test(String(p.profession || "") + " " + String(p.group || "") + " " + (Array.isArray(p.skills) ? p.skills.join(" ") : "") + " " + (Array.isArray(p.professions) ? p.professions.join(" ") : ""));
};


const svcsOf11 = (p) => (V101.PARTY_SERVICES || []).filter(sv => signedUp11(p, sv.id));






/* ---- FF Party Network: a place to hire. Companies lead, every person says they can be hired. ---- */
const avgRating11 = (co) => { const r = (co.reviews || []).map(x => x[1]).filter(Boolean); return r.length ? (r.reduce((a, b) => a + b, 0) / r.length) : 0; };


function CompanyListing11({ co }) {
  const { dispatch } = useStore();
  const all = useDirectory();
  const rt = avgRating11(co), n = (co.reviews || []).length;
  const team = (co.team || []).map(id => all.find(p => p.id === id)).filter(Boolean);
  const img = co.mediaList && co.mediaList[0] && co.mediaList[0].src;
  return (
    <button type="button" className="ff-lst" data-co17={co.id} onClick={() => { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); }} aria-label={`${co.name}: view their page`}>
      <span className="ph" style={img ? { backgroundImage: `url("${img}")` } : undefined}>
        {co.tier === "gold" && <span className="fc"><I11.Star size={11} /> FireFlair choice</span>}
      </span>
      <span className="tx">
        <b>{co.name}</b>
        <small>{co.kind}</small>
        <span className="rt">{n ? <><I11.Star size={13} /> <b>{rt.toFixed(1)}</b> <em>({n} {n === 1 ? "review" : "reviews"})</em></> : <em>New to FireFlair</em>}</span>
        <span className="ft"><I11.MapPin size={12} /> {co.areas || co.area}</span>
        <span className="tm">{team.slice(0, 4).map(p => <Portrait key={p.id} src={p.photo} name={p.name} size={26} tier={p.tier} />)}<small>{team.length ? `${team.length} on the team` : ""}</small></span>
        <span className="go">View company <I11.ArrowRight size={13} /></span>
      </span>
      {!co.unclaimed && <span className="bar17"><Coin size={20} tier="gold" /><em>{CARD_DOMAIN}/{String(co.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "")}</em></span>}
    </button>
  );
}



/* ---- On a person's page: what you can hire them for ---- */
function HireCards11({ person }) {
  const { state, dispatch } = useStore();
  if (!person || person.id === "me" || person.isCompany || !hireSiteOf(state).party || state.role !== "staff") return null;
  const svcs = svcsOf11(person), first = firstName(person.name);
  return (
    <section className="ff-hire11" aria-label={`Hire ${first}`}>
      <div className="ff-hire11-h"><h2>Hire {first}</h2></div>
      {svcs.length > 0 && <>
        <div className="ff-hire11-k">Services</div>
        {svcs.length > 0 && <HScroll label="FireFlair Service Cards">
          {svcs.map(sv => <div key={sv.id} style={{ width: CARD_W.poster, flex: "none" }}><V101.ServicePoster svc={sv} /></div>)}
        </HScroll>}
      </>}
    </section>
  );
}



/* In the quick card pop-up on FF Party: they can be hired, and for what. */
function PeekHire11({ p }) {
  if (!p || p.isCompany || p.id === "me") return null;
  const svcs = svcsOf11(p);
  return (
    <div className="ff-peekhire">
      {svcs.length > 0 && <ul className="sv">{svcs.map(sv => <li key={sv.id} className={sv.tone}><b>{sv.level}</b>{sv.title}</li>)}</ul>}
    </div>
  );
}



/* A person's team is everyone they have added to their network (teams as groups belong to Company Cards). */
function networkOf11(state, all, person) {
  if (!person) return [];
  if (person.id === "me") return (state.connections || []).map(c => all.find(x => x.id === c.id)).filter(Boolean);
  const hash = (t) => { let h = 7; for (const ch of t) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };
  const mine = (state.connections || []).some(c => c.id === person.id);
  const pool = all.filter(x => x.id !== person.id && x.id !== "me" && !x.isCompany);
  const near = pool.filter(x => x.group === person.group);
  const rest = pool.filter(x => x.group !== person.group);
  const pick = [...near, ...rest].sort((a, b) => hash(person.id + a.id) - hash(person.id + b.id)).slice(0, 6);
  return mine ? [...pick] : pick;
}
