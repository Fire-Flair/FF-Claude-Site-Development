/* src/components/team/profile-packages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   v1.57 (Alex, 18 Nov 20:51): the Packages tab of a profile (the profile builder and the public page).
   - The packages slider stays (CoverFlow). Its cards are the Bookings page's FF Party package cards (BkPkgCard17,
     BkPkgOwn17 and PkgFace17 from bookings.jsx, used as they are) inside an #ff-bk-party.pkg3 box, so they take the
     Bookings styles too. The profile and Bookings are never on screen together, so the id is never doubled.
   - Every card in the slider is one size (as tall as the tallest, measured with nothing open), and Create your own has
     the Staffing card's platinum face (profile-packages.css).
   - Under the slider: one Terms and conditions box, closed to start with, for the card in the centre.
   - Your own profile only: FF Staff, one card per profession with your preferred hourly rate and your preferred terms.
     Rates are the same Q&A answers Bookings saves (rate.<profession id>), so the two stay in step. Terms are a typed
     Q&A answer per profession (staff.terms, subject = profession id). Nobody else sees this part.
   - On someone else's page (or yours viewed as a guest) the cards leave out "You earn": it is the member's own business. */

const PROFILE_PACKAGES_CSS = __ff_css("styles/profile-packages.css");

if (!QA_Q17["staff.terms"]) QA_Q17["staff.terms"] = { text: "Your preferred terms for this profession", group: "staff" };
const staffTermsOf17 = (state, account, prof) => {
  const a = account ? qaAnswer17(state, account, "staff.terms", professionId(prof)) : null;
  return a && !a.withdrawnAt ? (a.text || "") : "";
};

/* The packages in the slider: FF Party bar packages and Staffing (servicesOf), then any Entertainment and Services
   packages you signed up for on Bookings, then the demo own-service cards. */
function profPkgItems17(state, person) {
  const base = servicesOf(state, person);
  const ids = person.id === "me" ? (state.profile.serviceInterest || []) : (person.serviceInterest || []);
  const extra = ["ent", "svc"].flatMap(tab => (PKC_EXTRA17[tab] || []).filter(x => ids.includes(x.id)).map(x => ({ id: x.id, kind: "extra", tab, x })));
  return [...base.filter(it => it.kind === "std"), ...extra, ...base.filter(it => it.kind === "own")];
}

/* Bookings is where packages are signed up for: a card's Sign up opens Bookings at FF Party – Our packages. */
function goPkgBookings17(dispatch) {
  dispatch({ type: "VIEW", id: null });
  dispatch({ type: "ROLE", role: "team" });
  dispatch({ type: "TAB", tab: "bookings", route: "home" });
  let n = 0;
  const go = () => { const el = document.getElementById("ff-bk-party"); if (el && !el.closest(".ff-pkt17")) { el.scrollIntoView({ behavior: "auto", block: "start" }); return; } if (++n < 30) setTimeout(go, 60); };
  setTimeout(go, 80);
}

/* Every card in the slider is as tall as the tallest one with nothing open; opening one grows only that card. */
function usePkcEvenIn17(ref, key) {
  React.useLayoutEffect(() => {
    const box = ref.current; if (!box) return;
    const even = () => {
      const cards = [...box.querySelectorAll(".ff-pkc")];
      cards.forEach(c => { c.style.minHeight = ""; });
      const h = Math.max(0, ...cards.filter(c => !c.querySelector("details[open]")).map(c => c.offsetHeight));
      if (h) cards.forEach(c => { c.style.minHeight = h + "px"; });
    };
    even();
    const tg = () => even(); box.addEventListener("toggle", tg, true);
    let ro = null; if (window.ResizeObserver) { ro = new ResizeObserver(() => requestAnimationFrame(even)); box.querySelectorAll(".ff-cf-item").forEach(c => ro.observe(c)); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(even).catch(() => {});
    return () => { box.removeEventListener("toggle", tg, true); if (ro) ro.disconnect(); };
  }, [key]);
}

/* Someone else's own-service card and Create your own, on the same face (no type boxes: they are not yours). */
function ProfPkgFace17({ d, rows, foot, dataId }) {
  const ref = useRef(null);
  usePkcFitAll17(ref, dataId);
  return (
    <PkgFace17 d={d} refEl={ref} dataId={dataId} rows={rows.filter(r => r[2]).map(([a, b, c]) => [a, b, <b>{pkcNoBreak17(c)}</b>])}
      title={<h5 className="ff-pkc-ti fit">{d.name}</h5>}
      line={d.line ? <p className="ff-pkc-tg fit">{d.line}</p> : null}
      foot={foot} />
  );
}

/* The package the centre card stands for, for the Terms and conditions box. */
function pkgTermsOf17(it) {
  if (!it) return null;
  if (it.kind === "std") { const d = pkcData17(it.svc, "bar"); return { name: d.name, cond: d.cond }; }
  if (it.kind === "extra") return { name: it.x.name, cond: it.x.cond };
  if (it.kind === "own") return { name: it.item.title, cond: "" };
  return { name: "Create your own", cond: "" };
}

/* v1.185 (Alex 20 Nov 23:05): on your own Packages tab the row is Create your own first, then only the FFParty packages that
   match your professions. A profession's group is professionCategory (the Get booked rule): Bar professions get the Bar
   packages, Entertainment the Entertainment packages, Services the Services packages; two groups give both. Sign up works as on
   Bookings: tick the card, Confirm, accept the package terms (one int.party_package answer, mirrored to profile.serviceInterest). */
function ownPkgGroups185(state) {
  const groups = [];
  recsOf(state.profile, "professions").filter(r => !r.proposed && !r.hidden).forEach(r => {
    const c = professionCategory(r.name, r.displayCategory);
    const k = c === "Bar" ? "bar" : c === "Entertainment" ? "ent" : c === "Services" ? "svc" : null;
    if (k && !groups.includes(k)) groups.push(k);
  });
  return ["bar", "ent", "svc"].filter(k => groups.includes(k));
}

function ownPkgItems185(state) {
  const groups = ownPkgGroups185(state);
  const out = [{ id: "pp-create", kind: "create", tab: groups[0] || "bar" }];
  groups.forEach(k => {
    if (k === "bar") [...PARTY_SERVICES.filter(sv => sv.id !== "svc_full").reverse(), ...(hid17(state, "packages", "svc_staffing") ? [] : [STAFFING_SERVICE])].forEach(sv => out.push({ id: sv.id, kind: "std", svc: sv }));
    else (PKC_EXTRA17[k] || []).forEach(x => out.push({ id: x.id, kind: "extra", tab: k, x }));
  });
  return out;
}

function ProfilePackages17({ person, own }) {
  const { state, dispatch } = useStore();
  const mem = useRef({});
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [tcOpen, setTcOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [pkgTerms, setPkgTerms] = useState(false);
  const signed = state.profile.serviceInterest || [];
  const picked = sel || signed;
  const items = own ? ownPkgItems185(state) : [...profPkgItems17(state, person), { id: "pp-create", kind: "create" }];
  const toBk = () => goPkgBookings17(dispatch);
  const tick = (id) => setSel(picked.includes(id) ? picked.filter(x => x !== id) : [...picked, id]);
  const confirmPkgs = async () => {
    setPkgTerms(false);
    const account = qaAccount17(state);
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    const next = picked;
    const nm = (id) => { const it = items.find(x => x.id === id); return it ? (it.svc ? it.svc.title : it.x ? it.x.name : "") : ""; };
    const title = next.length === 1 ? (nm(next[0]) || "the package") : "your packages";
    const mirror = { type: "PROFILE", patch: { serviceInterest: next } };
    const r = next.length
      ? await qaSubmit17(dispatch, { questionId: "int.party_package", account, optionIds: next, visibility: "public", source: "FF Team Profile · Packages" }, mirror)
      : await qaWithdraw17(dispatch, { questionId: "int.party_package", account }, mirror);
    dispatch({ type: "TOAST", toast: r.ok ? (next.length ? `Signed up for ${title}` : "Withdrawn from your packages") : "That couldn't be saved. Try again." });
    if (r.ok) setSel(null);
  };
  const signUp = (id) => (
    <button type="button" className="ff-pkc-go fit" onClick={toBk} aria-pressed={signed.includes(id)}>
      {signed.includes(id) ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}
    </button>
  );
  const card = (it) => {
    if (own) {
      if (it.kind === "std") return <BkPkgCard17 sv={it.svc} on={picked.includes(it.svc.id)} onClick={() => tick(it.svc.id)} />;
      if (it.kind === "extra") return <BkPkgCard17 sv={{ id: it.x.id, title: it.x.name }} tab={it.tab} on={picked.includes(it.x.id)} onClick={() => tick(it.x.id)} />;
      return <BkPkgOwn17 tab={it.tab || "bar"} />;
    }
    if (it.kind === "std") return <BkPkgCard17 sv={it.svc} on={false} onClick={toBk} />;
    if (it.kind === "extra") return <BkPkgCard17 sv={{ id: it.x.id, title: it.x.name }} tab={it.tab} on={false} onClick={toBk} />;
    if (it.kind === "own") {
      const x = it.item, tab = /dj|music|act/i.test(x.kind || "") ? "ent" : "svc";
      return <ProfPkgFace17 dataId={"pp-" + x.id} d={{ id: x.id, tab, site: "FF Party", name: x.title, line: x.kind, brief: x.text, provide: x.text, points: [] }}
        rows={[[S17I.Sparkles, "Includes", x.text]]} foot={null} />;
    }
    const pk = PK_SOON17.bar[0];
    return <ProfPkgFace17 dataId="create-bar" d={{ id: "create-bar", tab: "bar", site: "FF Party", name: "Create your own", line: "Your skills, your package, your price.", points: [] }}
      rows={[[S17I.Sparkles, "You provide", pk.inc], [S17I.Users, "Ideal for", pk.ideal], [S17I.Clock, "Duration", "As long as you choose"]]} foot={signUp("pp-create-none")} />;
  };
  usePkcEvenIn17(box, items.map(it => it.id).join(",") + (own ? "1" : "0"));
  const t = pkgTermsOf17(items[Math.min(at, items.length - 1)]);
  return (
    <div className="ff-pkt17">
      <style>{BKD_CSS}</style>
      <style>{PROFILE_PACKAGES_CSS}</style>
      <div id="ff-bk-party" className={`pkg3 ff-pkt17-rail${own ? "" : " pub"}`} ref={box}>
        {/* v1.162 (Alex 20 Nov 05:17): the same hero scroll as the other rows (HeroFlow20), instead of the old cover flow. */}
        <style>{NET20_CSS}</style>
        <HeroFlow20 label="Packages" onIndex={setAt}>
          {items.map(it => <div key={it.id} className="ff-svslide std ff-pkt17-cell ff-bkpk-cell">{card(it)}</div>)}
        </HeroFlow20>
      </div>
      {own && items.length > 1 && <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={!sel} onClick={() => { if (!qaAccount17(state)) { window.dispatchEvent(new Event("ff-login")); return; } setPkgTerms(true); }}><S17I.Check size={15} /> Confirm</button>}
      {own && pkgTerms && <PkgTerms17 onClose={() => setPkgTerms(false)} onAccept={confirmPkgs} />}
      {/* v1.162 (Alex 20 Nov 05:19): no Terms and conditions box here; the terms are part of each card's Details. */}
      {own && <ProfStaffCards17 />}
    </div>
  );
}

/* FF Staff on your own Packages tab: one box listing each profession with your preferred hourly rate. One Save for all of them. Signed out, Save opens sign-in. */
function ProfStaffCards17() {
  const { state, dispatch } = useStore();
  const account = qaAccount17(state);
  const mine = recsOf(state.profile, "professions").filter(r => !r.proposed).map(r => r.name);
  const rated = account ? ALL_PROFESSIONS.map(p => p.name).filter(n => prefRateP17(state, account, n) != null) : [];
  const profs = [...new Set([...mine, ...rated])];
  const [vals, setVals] = useState({});
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const savedRate = (n) => account ? prefRateP17(state, account, n) : null;
  const rateOf = (n) => vals[n] != null ? vals[n] : savedRate(n) != null ? String(savedRate(n) / 100) : "";
  const save = async () => {
    if (busy) return;
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    const bad = {};
    profs.forEach(n => { const v = String(rateOf(n)).trim(); if (v && (!/^\d+(\.\d{1,2})?$/.test(v) || Number(v) <= 0)) bad[n] = "Enter an amount in pounds, like 18 or 18.50."; });
    if (Object.keys(bad).length) { setErrs(bad); return; }
    setBusy(true);
    let ok = true;
    for (const n of profs) {
      const v = String(rateOf(n)).trim(), saved = savedRate(n);
      if (!v) { if (saved != null) { const r = await qaWithdraw17(dispatch, { account, questionId: qaRateQid17(n) }); if (!r.ok) ok = false; } }
      else if (Math.round(Number(v) * 100) !== saved) {
        const r = await qaSubmit17(dispatch, { questionId: qaRateQid17(n), account, typed: { kind: "rate_gbp_hour", pence: Math.round(Number(v) * 100), profession: n }, visibility: "ff-staff", source: "FF Team Profile · Packages · FF Staff" });
        if (!r.ok) { ok = false; setErrs(x => ({ ...x, [n]: "That couldn't be saved." })); }
      }
    }
    setBusy(false);
    if (ok) { setVals({}); dispatch({ type: "TOAST", toast: "Your rates are saved" }); }
  };
  return (
    <section className="ff-pp ff-pp21 ff-pkt17-staff" aria-labelledby="ff-pkt17-staff-h">
      <div className="ff-pp-head"><h2 id="ff-pkt17-staff-h" className="ff-about-h">FF Staff</h2></div>
      <p className="ff-pkt17-sub">Your preferred hourly rate for each profession, shown to businesses on FF Staff only.</p>
      {profs.length === 0 ? (
        <div className="ff-pkt17-none"><span className="ic" aria-hidden="true"><S17I.Briefcase size={20} strokeWidth={1.7} /></span><p>Your professions show here, each with its own rate.</p></div>
      ) : (<>
        <StaffRatesBox185 names={profs} valueOf={rateOf} onVal={(n, v) => { setVals(x => ({ ...x, [n]: v })); setErrs(x => ({ ...x, [n]: "" })); }} errs={errs} />
        <button type="button" className="ff-btn primary wide ff-pkt17-save" disabled={busy} onClick={save}><S17I.Check size={15} /> Save</button>
      </>)}
    </section>
  );
}
