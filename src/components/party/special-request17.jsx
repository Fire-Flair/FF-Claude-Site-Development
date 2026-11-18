/* src/components/party/special-request17.jsx — package selection, and the FireFlair admin list of special requests. The Special Request card itself is Phase 3 and was removed from the site. */
/* Choose a package for the booking: it joins the basket and the booking screen builds its Service card and People slot. */
function selectPkg17(state, dispatch, id, go) {
  const bk = bkOf17(state);
  if (!bk.pk.includes(id)) dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: pkFlip17(bk.pk, id) } } });
  if (go) { dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } }); dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); }
}

/* FireFlair admin: every special request with its stage, history and the moves FireFlair may make. */
function AdmSpecial17({ state, dispatch }) {
  const list = sr17List(state).slice().reverse();
  if (!list.length) return null;
  const move = function (id, to) {
    const r = sr17Move(state, id, to, "admin", "", Date.now());
    if (r.ok) dispatch({ type: "V11_SET", patch: { specialReq17: r.list } });
  };
  const catName = function (k) { const f = SR17_CATS.find(function (x) { return x[0] === k; }); return f ? f[1] : k; };
  return (
    <div className="ff-adm-bk ff-sr17-adm">
      <div className="hd"><span className="mn"><b>Special requests</b><small>{list.filter(sr17Open).length} open</small></span></div>
      {list.map(function (r) {
        const next = ((SR17_NEXT[r.stage] || {}).admin) || [];
        return (
          <div className="ff-sr17-item" key={r.id}>
            <b>{catName(r.cat)} · {r.kind || "Request"}</b>
            <span className={"ff-sr17-st st-" + r.stage}>{sr17Label(r.stage)}</span>
            <p className="ff-body">{r.what}</p>
            <small className="ff-muted">{[r.name, r.contact, r.iso ? r.iso + (r.flex ? " (flexible)" : "") : "", r.where, r.guests ? r.guests + " guests" : "", r.budget ? "Budget: " + r.budget : ""].filter(Boolean).join(" · ")}</small>
            <ol className="ff-sr17-hist">{(r.history || []).map(function (h, i) { return <li key={i}>{sr17Label(h.stage)} · {h.by} · {new Date(h.at).toLocaleString("en-GB")}{h.note ? " · " + h.note : ""}</li>; })}</ol>
            {next.length ? <div className="ff-sr17-act">{next.map(function (to) { return <Btn key={to} onClick={function () { move(r.id, to); }}>{to === "closed" ? "Close request" : "Move to: " + sr17Label(to)}</Btn>; })}</div> : null}
          </div>);
      })}
    </div>);
}
