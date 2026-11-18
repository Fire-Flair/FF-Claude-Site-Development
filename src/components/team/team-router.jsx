/* src/components/team/team-router.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The FF Team router: which page the tab shows (moved out of components/vip/vip-site.jsx in v1.1). */
function TeamRouter() {
  const { state } = useStore();
  const { tab } = state;
  /* pfa (Alex 03:29, reverses v17.8.2 for FF Team): Business & Support at the bottom of the FF Team pages, the same box as home.
     v1.47 (Alex 18 Nov 20:06): not on someone else's profile page. */
  const biz = (page) => <>{page}<div className="ff-biz-pfa"><V101.BusinessSupport19 /></div></>;
  if (state.viewing) return <PersonProfile />;
  if (tab === "network") return biz(<NetworkScreen />);
  if (tab === "bookings") return biz(<TeamBookings />);
  if (tab === "profile") return biz(<ProfileGate17 kind="team" />);
  return <TeamHomeV17 />;
}
