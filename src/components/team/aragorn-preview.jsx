/* src/components/team/aragorn-preview.jsx — SCRATCH PREVIEW ONLY (branch p2/aragorn, never merged).
   Aragorn's three options for the builder's tab area made to look like the finished public page.
   Switched on only by localStorage.ffAragornOpt = "1" | "2" | "3"; with it unset the builder is unchanged.
   Everything here reuses the real components and reads/writes the same records the public page reads:
   PublicProfileBody's layout (introductions.jsx) with an editable flag, and the builder's own editors
   (ProfessionPicker, ProfTiles21, TypeBox21, VenuesEditor19, CoverageTree17, QuestionCardsCollection, SocialEdit11). */

const ARAGORN_CSS = __ff_css("styles/aragorn-preview.css");

function aragornOpt() {
  try { const v = +(window.localStorage.getItem("ffAragornOpt") || 0); return v >= 1 && v <= 3 ? v : 1; } catch (e) { return 1; }
}

/* The attribute categories edited as lists (the builder's RANK_CATS19 minus professions). */
const ARA_ATTR_CATS = ["skills", "interests", "languages", "qualifications", "experience"];   /* public order (PUB_ORDER) */

/* The small squircle pencil beside a public section heading (option 1). */
function AraPencil({ label, onClick }) {
  return <button type="button" className="ara-pen" aria-label={`Edit ${label}`} title={`Edit ${label}`} onClick={onClick}><Pencil size={15} strokeWidth={2} aria-hidden="true" /></button>;
}

/* The small squircle plus beside a public section heading (option 3: add in place). */
function AraPlus({ label, on, onClick }) {
  return <button type="button" className={"ara-pen" + (on ? " on" : "")} aria-label={`Add to ${label}`} aria-expanded={!!on} title={`Add to ${label}`} onClick={onClick}>{on ? <X size={15} strokeWidth={2.2} aria-hidden="true" /> : <Plus size={16} strokeWidth={2.2} aria-hidden="true" />}</button>;
}

/* A public-style heading: Cinzel small caps on the left, an optional control on the right. */
function AraHead({ id, title, action }) {
  return <div className="ff-pp-head"><h2 id={id} className="ff-about-h">{title}</h2>{action || null}</div>;
}

/* Professions editor (the builder's picker + its tiles), the same writes as ProfileAttributeSection. */
function AraProfPicker({ items }) {
  const { dispatch } = useStore();
  return (
    <ProfessionPicker selected={items.map(r => r.name)} onPick={(n, category) => {
      if (items.some(r => r.name.toLowerCase() === n.toLowerCase())) { dispatch({ type: "TOAST", toast: `${n} is already on your profile` }); return; }
      const approved = ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n.toLowerCase());
      const fresh = makeRecord("professions", n, { professionSource: approved ? "approved" : "user", ...(category ? { displayCategory: category } : {}) });
      dispatch({ type: "RECORDS_MERGE", byCategory: { professions: [fresh] } });
      dispatch({ type: "TOAST", toast: `${n} added` });
    }} />
  );
}

/* One attribute category's editor: the type box, then its entries as compact tiles (the v17.40 builder look). */
function AraCatEditor({ catKey, records, title }) {
  const def = BASE_CATEGORIES[catKey];
  if (!def) return null;
  const items = records[catKey] || [];
  return (
    <div className="ara-cated">
      {title && <h3 className="ara-cated-h">{def.label}<span className="n">{items.filter(r => !r.hidden && !r.proposed).length}</span></h3>}
      <div className="ff-pa40-cat">
        <TypeBox21 catKey={catKey} def={def} rows={rankedRecords(items)} />
        <ProfTiles21 items={items} editable def={def} catKey={catKey} label={def.label} compact />
      </div>
    </div>
  );
}

/* Option 3: the Attributes rail with every attribute category, empty ones as a dashed card, and the tapped one marked. */
function AraAttrRail({ records, open, onOpen }) {
  const cats = ARA_ATTR_CATS.filter(k => BASE_CATEGORIES[k] && (k !== "experience" || (records.experience || []).length));
  return (
    <div className="ff-mrow ff-acar ara-rail" role="list" aria-label="Attributes">
      {cats.map((k, ci) => {
        const def = BASE_CATEGORIES[k];
        const all = rankedRecords(records[k] || []);
        const shown = all.filter(r => !r.hidden && !r.proposed);
        const empty = !shown.length;
        return (
          <button key={k} type="button" role="listitem" className={"ff-agrp " + (empty ? "ara-empty" : tierCls17(ci)) + (open === k ? " ara-on" : "")}
            aria-expanded={open === k} aria-label={`${def.label}. Edit`} onClick={() => onOpen(open === k ? null : k)}>
            <span className="ff-agrp-top"><span className="ff-agrp-h">{def.label}</span><span className="ff-agrp-n">{shown.length}</span></span>
            {empty
              ? <span className="ara-empty-plus" aria-hidden="true"><Plus size={22} strokeWidth={1.8} /></span>
              : <span className="ff-agrp-l">{shown.slice(0, 5).map(r => <span key={r.id}>{nbh21(r.name)}</span>)}</span>}
            {shown.length > 5 && <span className="ff-agrp-more">{`+${shown.length - 5}`}</span>}
            {all.length > shown.length && <span className="ara-hidn"><EyeOff size={11} aria-hidden="true" /> {all.length - shown.length}</span>}
          </button>
        );
      })}
      <span className="ff-acar-end" aria-hidden="true" />
    </div>
  );
}

/* The builder's tab area, laid out as the finished public page (PublicProfileBody), with an editable flag.
   opt 1: the public page exactly, a pencil per section opens that section's editor in a sheet.
   opt 2: an Edit / Preview switch above the tabs: Preview is the public page exactly, Edit puts the editors in its place.
   opt 3: the public page whose sections edit in place: tap a tile or card and its editor opens under it; + adds. */
function AragornTabs({ person, opt }) {
  const { state, dispatch } = useStore();
  useEffect(() => { window.__ffAragorn = { dispatch }; }, []);
  const [tab, setTab] = useState(() => { try { return window.localStorage.getItem("ffAragornTab") || "overview"; } catch (e) { return "overview"; } });
  const [mode, setMode] = useState(() => { try { return window.localStorage.getItem("ffAragornMode") || "edit"; } catch (e) { return "edit"; } });
  const [sheet, setSheet] = useState(() => { try { return window.localStorage.getItem("ffAragornSheet") || null; } catch (e) { return null; } });
  const [openCat, setOpenCat] = useState(() => { try { return window.localStorage.getItem("ffAragornCat") || null; } catch (e) { return null; } });
  const [adding, setAdding] = useState(null);
  const [openRec, setOpenRec] = useState(null);
  const [attrCat, setAttrCat] = useState(null);
  const [asking, setAsking] = useState(false);
  const mem = useRef({});
  const cats = BASE_CATEGORIES;
  const all = useDirectory();
  const records = recordsForPerson(state, person);
  const services = servicesOf(state, person);
  const { teams, tCos, tNet } = teamTabData17(state, all, person);
  const reviews = reviewsOf(state, person);
  const profsAll = rankedRecords(records.professions || []);
  const profs = profsAll.filter(r => !r.hidden && !r.proposed);
  const venuesAll = records.venues || [];
  const venues = venuesAll.filter(r => !r.hidden && !r.proposed);
  const attrs = attributesOf(state, person, cats).filter(it => it.category !== "locations" && it.category !== "venues");
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "services", label: "Bookings", count: services.length },
    { key: "teams", label: "Team", count: teams.length + tCos.length + tNet.length },
    { key: "reviews", label: "Reviews", count: reviews.length },
  ];
  /* What a section looks like to a visitor, or its editor. */
  const editing = opt === 2 ? mode === "edit" : false;
  const pen = (k, label) => opt === 1 ? <AraPencil label={label} onClick={() => setSheet(k)} /> : null;
  const plus = (k, label) => opt === 3 ? <AraPlus label={label} on={adding === k} onClick={() => setAdding(adding === k ? null : k)} /> : null;
  const svcCard = (it) => it.kind === "std"
    ? <div className="ff-svslide std"><ServicePoster svc={it.svc} price /></div>
    : <div className="ff-svslide own"><OwnServiceCard item={it.item} /></div>;
  const locSection = (edit) => edit
    ? <section className="ff-pp ff-pp21"><AraHead title="Work locations" action={pen("locations", "Work locations")} /><CoverageTree17 /></section>
    : (records.locations && records.locations.length > 0 && cats.locations
      ? <section className="ff-pp ff-pp21"><AraHead title="Work locations" action={pen("locations", "Work locations") || plus("locations", "Work locations")} />
        {adding === "locations" ? <CoverageTree17 /> : <AreasChips17 owner={{ records: { locations: (records.locations || []).filter(r => !r.hidden && !r.proposed) }, coverage17: state.profile.coverage17 }} />}</section>
      : null);

  /* ---- Overview ---- */
  const overviewPublic = (<>
    {profs.length > 0 && (
      <section className="ff-pp ff-pp21" aria-labelledby="ara-profs-h">
        <AraHead id="ara-profs-h" title="Professions" action={pen("professions", "Professions") || plus("professions", "Professions")} />
        {opt === 3 && adding === "professions" && <AraProfPicker items={profsAll} />}
        {opt === 3
          ? <ProfTiles21 items={profsAll} editable def={cats.professions} />
          : <ProfTiles21 items={profs} def={cats.professions} onOpen={(r) => setOpenRec({ record: r, def: cats.professions, category: "professions" })} />}
      </section>
    )}
    {(attrs.length > 0 || opt === 3) && (
      <section className="ff-pp ff-pp21" aria-labelledby="ara-attr-h">
        <AraHead id="ara-attr-h" title="Attributes" action={pen("attributes", "Attributes") || (opt === 3 ? null : <button type="button" className="ff-pp-all" onClick={() => setAttrCat("__all")}>View all <ChevronRight size={13} /></button>)} />
        {opt === 3
          ? <><AraAttrRail records={records} open={openCat} onOpen={setOpenCat} />{openCat && <div className="ara-inplace"><AraCatEditor catKey={openCat} records={records} title /></div>}</>
          : <AttrGroups items={attrs} mem={mem} onOpen={(k) => setAttrCat(k)} />}
      </section>
    )}
    {SHOW_VENUES17 && (venues.length > 0 || opt === 3) && (
      <section className="ff-pp ff-pp21" aria-labelledby="ara-ven-h">
        <AraHead id="ara-ven-h" title="Venues" action={pen("venues", "Venues") || plus("venues", "Venues")} />
        {opt === 3 && adding === "venues"
          ? <div className="ara-inplace"><VenuesEditor19 items={venuesAll} onOpen={(r) => setOpenRec({ record: r, def: cats.venues, category: "venues" })} /></div>
          : <div className="ff-ven19"><VenueRows19 items={venues} onOpen={opt === 3 ? (r) => setOpenRec({ record: r, def: cats.venues, category: "venues" }) : undefined} /></div>}
      </section>
    )}
    {opt === 1 && state.profile.introduction ? (
      <div className="ara-introwrap"><span className="ara-introPen">{pen("intro", "FireFlair Introductions")}</span><FireFlairIntroductions17 person={person} /></div>
    ) : opt === 3 ? <IntroEditor17 /> : <FireFlairIntroductions17 person={person} />}
  </>);
  const overviewEdit = (<>
    <section className="ff-pp ff-pp21"><AraHead title="Professions" /><AraProfPicker items={profsAll} /><ProfTiles21 items={profsAll} editable def={cats.professions} compact /></section>
    <section className="ff-pp ff-pp21"><AraHead title="Attributes" />{ARA_ATTR_CATS.filter(k => k !== "experience" || (records.experience || []).length).map(k => <AraCatEditor key={k} catKey={k} records={records} title />)}</section>
    <section className="ff-pp ff-pp21"><AraHead title="Venues" /><VenuesEditor19 items={venuesAll} onOpen={(r) => setOpenRec({ record: r, def: cats.venues, category: "venues" })} /></section>
    <IntroEditor17 />
  </>);

  /* ---- Bookings ---- */
  const bookings = (edit) => (<>
    {locSection(edit)}
    {services.length > 0 && <CoverFlow items={services} label="Packages" mem={mem} k="services" half={150} onOpen={() => {}} render={(it) => svcCard(it)} />}
    {opt === 1 ? null : edit
      ? <section className="ff-pp ff-pp21"><AraHead title="Q&A" /><QuestionCardsCollection /></section>
      : <div className="ara-qawrap">{opt === 1 && <span className="ara-qaPen">{pen("qa", "Q&A")}</span>}{opt === 3 && <span className="ara-qaPen">{plus("qa", "Q&A")}</span>}
          {opt === 3 && adding === "qa" ? <section className="ff-pp ff-pp21"><AraHead title="Q&A" /><QuestionCardsCollection /></section> : <PublicQA person={person} />}</div>}
    <Creators17 kind="team" by={person.name} />
    <PersonalTerms17 />
  </>);

  /* ---- Team ---- */
  const socialsMe = { ...person, socials: state.profile.socials };
  const team = (edit) => (<>
    {edit || (opt === 3 && adding === "social")
      ? <section className="ff-pp ff-pp21"><AraHead title="Social links" action={plus("social", "Social links")} /><SocialEdit11 noPhone value={state.profile.socials} onChange={(socials) => dispatch({ type: "PROFILE", patch: { socials } })} /></section>
      : (opt === 1 || opt === 3)
        ? <section className="ff-pp ff-pp21"><AraHead title="Social links" action={pen("social", "Social links") || plus("social", "Social links")} />
            {SOC11.some(x => String((state.profile.socials || {})[x.k] || "").trim()) ? <SocialRow11 value={state.profile.socials} named /> : null}</section>
        : <ProfileSocial11 person={socialsMe} />}
    <div style={{ marginTop: 22 }}><TeamTab17 person={person} /></div>
  </>);

  /* ---- Reviews ---- */
  const waiting = reviewAsksWaiting17(state);
  const reviewsTab = (edit) => (<>
    {(edit || opt !== 2) && waiting.length > 0 && (
      <section className="ff-pp ff-pp21 ara-wait">
        <AraHead title={`Waiting for you · ${waiting.length}`} />
        <div className="ff-rc35-list">
          {waiting.map(r => (
            <div key={r.id} className="ara-waitcard">
              <ReviewCard35 rec={{ id: r.id, rating: r.rating, description: r.text }} raw={r} writer={reviewWriter35(state, all, r)} about={person} />
              <div className="ara-waitacts">
                <button type="button" className="ff-btn gold" onClick={() => dispatch({ type: "REVIEW_DECIDE", id: r.id, show: true, review: r })}><Check size={14} /> Accept</button>
                <button type="button" className="ff-btn ghost" onClick={() => dispatch({ type: "REVIEW_DECIDE", id: r.id, show: false, review: r })}>Decline</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    )}
    <ReviewsTab35 person={person} />
    {(edit || opt !== 2) && (
      <div className="ara-ask"><button type="button" className="ff-btn ghost wide" onClick={() => setAsking(true)}><Plus size={14} /> Ask for a review</button></div>
    )}
  </>);

  const pub = opt !== 2 || mode === "preview";
  return (
    <div className="ara-wrap">
      <style>{ARAGORN_CSS}</style>
      <style>{RANK_CSS17}</style>
      {opt === 2 && (
        <div className="ara-seg" role="radiogroup" aria-label="Edit or preview">
          {[["edit", "Edit", Pencil], ["preview", "Preview", Eye]].map(([k, l, Ic]) => (
            <button key={k} type="button" role="radio" aria-checked={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}><Ic size={15} strokeWidth={2} aria-hidden="true" />{l}</button>
          ))}
        </div>
      )}
      <div className="ff-ptabs-wrap">
        <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className={"ff-tabpanel" + (opt === 2 && mode === "edit" ? " ara-editpanel" : "")} tabIndex={0}>
          {tab === "overview" && (opt === 1 ? <><PE2Overview records={records} />{state.profile.introduction
            ? <div className="ara-introwrap"><span className="ara-introPen">{pen("intro", "FireFlair Introductions")}</span><FireFlairIntroductions17 person={person} /></div>
            : <FireFlairIntroductions17 person={person} />}</> : pub ? overviewPublic : overviewEdit)}
          {tab === "services" && bookings(editing)}
          {tab === "teams" && team(editing)}
          {tab === "reviews" && reviewsTab(editing)}
        </div>
      </div>

      {/* Option 1: one sheet per section, holding the builder's existing editor for it. */}
      <Sheet open={!!sheet} onClose={() => setSheet(null)} title={({ professions: "Professions", attributes: "Attributes", venues: "Venues", locations: "Work locations", qa: "Q&A", social: "Social links", intro: "FireFlair Introductions" })[sheet] || ""}>
        {sheet === "professions" && <div className="ara-sheet"><AraProfPicker items={profsAll} /><ProfTiles21 items={profsAll} editable def={cats.professions} compact /></div>}
        {sheet === "attributes" && <div className="ara-sheet">{ARA_ATTR_CATS.filter(k => k !== "experience" || (records.experience || []).length).map(k => <AraCatEditor key={k} catKey={k} records={records} title />)}</div>}
        {sheet === "venues" && <div className="ara-sheet"><VenuesEditor19 items={venuesAll} onOpen={(r) => setOpenRec({ record: r, def: cats.venues, category: "venues" })} /></div>}
        {sheet === "locations" && <div className="ara-sheet"><CoverageTree17 /></div>}
        {sheet === "qa" && <div className="ara-sheet"><QuestionCardsCollection /></div>}
        {sheet === "social" && <div className="ara-sheet"><SocialEdit11 noPhone value={state.profile.socials} onChange={(socials) => dispatch({ type: "PROFILE", patch: { socials } })} /></div>}
        {sheet === "intro" && <div className="ara-sheet"><IntroEditor17 /></div>}
      </Sheet>
      <GenericAttributeCardCreator open={!!openRec} record={openRec && openRec.record} def={openRec && openRec.def} category={openRec && openRec.category}
        readOnly={opt !== 3} onClose={() => setOpenRec(null)} />
      <Sheet center open={!!attrCat} onClose={() => setAttrCat(null)} title={attrCat === "__all" ? "All attributes" : attrCat && cats[attrCat] ? cats[attrCat].label : ""}>
        {attrCat && attrCat !== "__all" && cats[attrCat] && <ExpandedAttrs list={rankedRecords((records[attrCat] || []).filter(r => !r.hidden && !r.proposed))} />}
        {attrCat === "__all" && [...new Set(attrs.map(it => it.category))].map(k => (
          <section key={k} className="ff-xatt-sec"><h3 className="ff-about-h">{cats[k] ? cats[k].label : k}</h3>
            <ExpandedAttrs list={rankedRecords((records[k] || []).filter(r => !r.hidden && !r.proposed))} /></section>
        ))}
      </Sheet>
      <AskForReviewSheet open={asking} onClose={() => setAsking(false)} />
    </div>
  );
}
