/* src/components/team/profile-edit-tabs.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   Your own profile's edit page, below Media: the tab area (Overview, Packages, Team, Reviews) laid out as the finished
   public page (PublicProfileBody in introductions.jsx). Overview is PE2Overview (profile-edit-p2.jsx); a small pencil
   beside Social links and FireFlair Introductions opens that section's existing editor in a sheet.
   Everything reads and writes the same records the public page reads.
   v1.1: was aragorn-preview.jsx (approved option 1); options 2 and 3 and their localStorage switch are removed. */

const PROFILE_EDIT_TABS_CSS = __ff_css("styles/profile-edit-tabs.css");

/* The small squircle pencil beside a section heading. */
function EditTabPencil({ label, onClick }) {
  return <button type="button" className="ara-pen" aria-label={`Edit ${label}`} title={`Edit ${label}`} onClick={onClick}><Pencil size={15} strokeWidth={2} aria-hidden="true" /></button>;
}

/* A public-style heading: Cinzel small caps on the left, an optional control on the right. */
function EditTabHead({ id, title, action }) {
  return <div className="ff-pp-head"><h2 id={id} className="ff-about-h">{title}</h2>{action || null}</div>;
}

function ProfileEditTabs({ person }) {
  const { state, dispatch } = useStore();
  const [tab, setTab] = useState("overview");
  const [sheet, setSheet] = useState(null);
  const [asking, setAsking] = useState(false);
  const mem = useRef({});
  const all = useDirectory();
  const records = recordsForPerson(state, person);
  const { teams, tCos, tNet } = teamTabData17(state, all, person);
  const reviews = reviewsOf(state, person);
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "services", label: "Packages", count: profPkgItems17(state, person).length },
    { key: "teams", label: "Team", count: teams.length + tCos.length + tNet.length },
    { key: "reviews", label: "Reviews", count: reviews.length },
  ];
  const pen = (k, label) => <EditTabPencil label={label} onClick={() => setSheet(k)} />;

  /* ---- Overview ---- */
  const overview = (<>
    <PE2Overview records={records} />
    {state.profile.introduction
      ? <div className="ara-introwrap"><span className="ara-introPen">{pen("intro", "FireFlair Introductions")}</span><FireFlairIntroductions17 person={person} /></div>
      : <FireFlairIntroductions17 person={person} />}
  </>);

  /* ---- Packages ---- */
  /* v1.57 (Alex, 18 Nov 20:51): Work locations are off this tab for now (their data and editor stay); the slider uses
     the Bookings package cards, then the terms for the centre card and FF Staff (profile-packages.jsx). */
  const bookings = (<>
    <ProfilePackages17 person={person} own />
    <PersonalTerms17 />
  </>);

  /* ---- Team ---- */
  const team = (<>
    <section className="ff-pp ff-pp21"><EditTabHead title="Social links" action={pen("social", "Social links")} />
      {SOC11.some(x => String((state.profile.socials || {})[x.k] || "").trim()) ? <SocialRow11 value={state.profile.socials} named /> : null}</section>
    <div style={{ marginTop: 22 }}><TeamTab17 person={person} /></div>
  </>);

  /* ---- Reviews ---- */
  const waiting = reviewAsksWaiting17(state);
  const reviewsTab = (<>
    {waiting.length > 0 && (
      <section className="ff-pp ff-pp21 ara-wait">
        <EditTabHead title={`Waiting for you · ${waiting.length}`} />
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
    <div className="ara-ask"><button type="button" className="ff-btn ghost wide" onClick={() => setAsking(true)}><Plus size={14} /> Ask for a review</button></div>
  </>);

  return (
    <div className="ara-wrap" style={cardTone17(cardThemeOf17(state, person))}>
      <style>{PROFILE_EDIT_TABS_CSS}</style>
      <style>{RANK_CSS17}</style>
      <div className="ff-ptabs-wrap">
        <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
          {tab === "overview" && overview}
          {tab === "services" && bookings}
          {tab === "teams" && team}
          {tab === "reviews" && reviewsTab}
        </div>
      </div>

      {/* One sheet per section, holding the existing editor for it. */}
      <Sheet open={!!sheet} onClose={() => setSheet(null)} title={({ social: "Social links", intro: "FireFlair Introductions" })[sheet] || ""}>
        {sheet === "social" && <div className="ara-sheet"><SocialEdit11 noPhone value={state.profile.socials} onChange={(socials) => dispatch({ type: "PROFILE", patch: { socials } })} /></div>}
        {sheet === "intro" && <div className="ara-sheet"><IntroEditor17 /></div>}
      </Sheet>
      <AskForReviewSheet open={asking} onClose={() => setAsking(false)} />
    </div>
  );
}
