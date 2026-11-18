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

function ProfilePackages17({ person, own }) {
  const { state, dispatch } = useStore();
  const mem = useRef({});
  const box = useRef(null);
  const [at, setAt] = useState(0);
  const [tcOpen, setTcOpen] = useState(false);
  const signed = state.profile.serviceInterest || [];
  const items = [...profPkgItems17(state, person), { id: "pp-create", kind: "create" }];
  const toBk = () => goPkgBookings17(dispatch);
  const signUp = (id) => (
    <button type="button" className="ff-pkc-go fit" onClick={toBk} aria-pressed={signed.includes(id)}>
      {signed.includes(id) ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}
    </button>
  );
  const card = (it) => {
    if (it.kind === "std") return <BkPkgCard17 sv={it.svc} on={own && signed.includes(it.svc.id)} onClick={toBk} />;
    if (it.kind === "extra") return <BkPkgCard17 sv={{ id: it.x.id, title: it.x.name }} tab={it.tab} on={own && signed.includes(it.x.id)} onClick={toBk} />;
    if (it.kind === "own") {
      const x = it.item, tab = /dj|music|act/i.test(x.kind || "") ? "ent" : "svc";
      return <ProfPkgFace17 dataId={"pp-" + x.id} d={{ id: x.id, tab, site: "FF Party", name: x.title, line: x.kind, brief: x.text, provide: x.text, points: [] }}
        rows={[[S17I.Sparkles, "Includes", x.text]]} foot={null} />;
    }
    if (own) return <BkPkgOwn17 tab="bar" />;
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
        <CoverFlow items={items} label="Packages" mem={mem} k="pkt17" half={140} onIndex={setAt} onOpen={() => {}}
          render={(it) => <div className="ff-svslide std ff-pkt17-cell">{card(it)}</div>} />
      </div>
      {t && (
        <StaffBox id="ff-pkt17-tc" icon={E17I.Layers} title="Terms and conditions" open={tcOpen} onToggle={() => setTcOpen(o => !o)}>
          <div className="ff-pkt17-tc" aria-live="polite">
            <h4 className="ff-pkt17-tcn">{t.name}</h4>
            {t.cond && <p className="ff-pkt17-cond">{pkcNoBreak17(t.cond)}</p>}
            <div className="ff-tc5">
              {PARTY_PKG_TERMS17.map((x, i) => <div key={x.k} className="ff-tc5-read"><span><b>{i + 1}</b>{x.label}</span><p>{x.text}</p></div>)}
            </div>
          </div>
        </StaffBox>
      )}
      {own && <ProfStaffCards17 />}
    </div>
  );
}

/* FF Staff on your own Packages tab: a card per profession, each with your preferred hourly rate and your preferred
   terms. One Save for all of them. Signed out, Save opens sign-in. */
function ProfStaffCards17() {
  const { state, dispatch } = useStore();
  const account = qaAccount17(state);
  const mine = recsOf(state.profile, "professions").filter(r => !r.proposed).map(r => r.name);
  const rated = account ? ALL_PROFESSIONS.map(p => p.name).filter(n => prefRateP17(state, account, n) != null) : [];
  const profs = [...new Set([...mine, ...rated])];
  const [vals, setVals] = useState({});
  const [terms, setTerms] = useState({});
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const savedRate = (n) => account ? prefRateP17(state, account, n) : null;
  const rateOf = (n) => vals[n] != null ? vals[n] : savedRate(n) != null ? String(savedRate(n) / 100) : "";
  const termsOf = (n) => terms[n] != null ? terms[n] : staffTermsOf17(state, account, n);
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
      const tx = String(termsOf(n)).trim(), tSaved = staffTermsOf17(state, account, n);
      if (tx !== tSaved) {
        const r = tx
          ? await qaSubmit17(dispatch, { questionId: "staff.terms", subjectId: professionId(n), account, text: tx, visibility: "ff-staff", source: "FF Team Profile · Packages · FF Staff" })
          : await qaWithdraw17(dispatch, { questionId: "staff.terms", subjectId: professionId(n), account });
        if (!r.ok) { ok = false; setErrs(x => ({ ...x, [n]: "That couldn't be saved." })); }
      }
    }
    setBusy(false);
    if (ok) { setVals({}); setTerms({}); dispatch({ type: "TOAST", toast: "Your rates and terms are saved" }); }
  };
  return (
    <section className="ff-pp ff-pp21 ff-pkt17-staff" aria-labelledby="ff-pkt17-staff-h">
      <div className="ff-pp-head"><h2 id="ff-pkt17-staff-h" className="ff-about-h">FF Staff</h2></div>
      <p className="ff-pkt17-sub">Your preferred hourly rate and terms for each profession, shown to businesses on FF Staff only.</p>
      {profs.length === 0 ? (
        <div className="ff-pkt17-none"><span className="ic" aria-hidden="true"><S17I.Briefcase size={20} strokeWidth={1.7} /></span><p>Your professions show here, each with its own rate and terms.</p></div>
      ) : (<>
        <div className="ff-pkt17-profs">
          {profs.map(n => (
            <article key={n} className="ff-pkt17-prof" aria-label={n}>
              <h3 className="nm">{n}</h3>
              <label className="ff-pkt17-rate">
                <span className="l">Preferred hourly rate</span>
                <span className="rt">
                  <span aria-hidden="true">£</span>
                  <input type="text" inputMode="decimal" autoComplete="off" value={rateOf(n)} aria-label={`Your preferred hourly rate as ${n}, pounds per hour`}
                    onChange={(e) => { const v = e.target.value.replace(/[^\d.]/g, "").slice(0, 7); setVals(x => ({ ...x, [n]: v })); setErrs(x => ({ ...x, [n]: "" })); }} />
                  <span aria-hidden="true">/hour</span>
                </span>
              </label>
              <label className="ff-pkt17-terms">
                <span className="l">Preferred terms</span>
                <textarea rows={3} maxLength={500} value={termsOf(n)} aria-label={`Your preferred terms as ${n}`}
                  onChange={(e) => { const v = e.target.value; setTerms(x => ({ ...x, [n]: v })); setErrs(x => ({ ...x, [n]: "" })); }} />
              </label>
              {errs[n] && <span className="er" role="alert">{errs[n]}</span>}
            </article>
          ))}
        </div>
        <button type="button" className="ff-btn primary wide ff-pkt17-save" disabled={busy} onClick={save}><S17I.Check size={15} /> Save</button>
      </>)}
    </section>
  );
}
