/* src/components/party/special-request17.jsx — package selection, and the FireFlair admin list of special requests. The Special Request card itself is Phase 3 and was removed from the site. */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* Choose a package for the booking: it joins the basket and the booking screen builds its Service card and People slot. */
function selectPkg17(state, dispatch, id, go) {
  const bk = bkOf17(state);
  if (!bk.pk.includes(id)) dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: pkFlip17(bk.pk, id) } } });
  if (go) { dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } }); dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); }
}
