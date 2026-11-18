/* src/components/team/team-router.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The FF Team router: which page the tab shows (moved out of components/vip/vip-site.jsx in v1.1). */
function TeamRouter() {
  const { state } = useStore();
  const { tab } = state;
  /* pfa (Alex 03:29, reverses v17.8.2 for FF Team): Business & Support at the bottom of every FF Team page, the same box as home. */
  const biz = (page) => <>{page}<div className="ff-biz-pfa"><V101.BusinessSupport19 /></div></>;
  if (state.viewing) return biz(<PersonProfile />);
  if (tab === "network") return biz(<NetworkScreen />);
  if (tab === "bookings") return biz(PHASE1.bookingsLive ? <TeamBookings /> : <P1Bookings />);
  if (tab === "profile") return biz(<ProfileGate17 kind="team" />);
  return <TeamHomeV17 />;
}
