/* src/components/team/bookings.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* BOOKINGS (FF Team) — one page, three sections: booked shifts, FF Party
   service cards (coming in 2027), availability cards. Replies happen here. */
/* ==========================================================================
   BOOKINGS — full-size poster cards. One PosterCard frame for every kind
   (booking, FF Party service); the tone sets the surface and metal.
   ========================================================================== */
const POSTER_TONES = {
  dark:   { cls: "dark",   accent: "#D9B552", ribbon: "Booking Card" },
  ivory:  { cls: "ivory",  accent: "#9A7322" },
  bronze: { cls: "dark metal", accent: "#D49A62", edge: "bronze" },
  silver: { cls: "dark metal", accent: "#D6DAE0", edge: "silver" },
  gold:   { cls: "dark metal", accent: "#E8C75E", edge: "gold" },
  white:  { cls: "ivory white", accent: "#9A7322" },
};



function PosterCard({ tone = "dark", ribbon, eyebrow, title, subtitle, tagline, rows = [], footer, onClick }) {
  const t = POSTER_TONES[tone] || POSTER_TONES.dark;
  return (
    <article className={`ff-poster ${t.cls}`} style={{ "--pc-accent": t.accent, ...(t.edge ? { "--pc-edge": metalEdge(t.edge) } : {}) }}>
      <div className="ff-poster-ribbon"><Sparkles size={11} /> {ribbon}</div>
      <span className="ff-poster-coin"><Coin size={44} tier={t.edge || "gold"} /></span>
      <div className="ff-poster-head">
        {eyebrow && <div className="ff-poster-eyebrow">✦ {eyebrow} ✦</div>}
        <h3 className="ff-poster-title">{title}</h3>
        {subtitle && <div className="ff-poster-sub">{subtitle}</div>}
        {tagline && <p className="ff-poster-tag">{tagline}</p>}
      </div>
      <div className="ff-poster-rows">
        {rows.filter(Boolean).map((r, i) => (
          <div key={i} className="ff-poster-row">
            <span className="ff-poster-medal">{r.icon}</span>
            <span style={{ minWidth: 0 }}>
              <span className="ff-poster-label">{r.label}</span>
              <span className="ff-poster-value">{r.value}</span>
              {r.sub && <span className="ff-poster-small">{r.sub}</span>}
            </span>
          </div>
        ))}
      </div>
      {footer && <div className="ff-poster-foot">{footer}</div>}
      {onClick && <button type="button" className="ff-poster-hit" onClick={onClick} aria-label={`Open ${title}`} />}
    </article>
  );
}



const PAST_STATES = ["completed", "signed_off", "paid"];



/* Peak dates: the busiest nights of the year. Saying yes puts the person
   first in line for shifts on the dates they pick. */
const isoDays = (from, to) => { const out = []; for (let d = new Date(from + "T12:00:00"); d <= new Date(to + "T12:00:00"); d.setDate(d.getDate() + 1)) out.push(d.toISOString().slice(0, 10)); return out; };


const PEAK_DATES = [
  { key: "halloween", icon: "🎃", q: "Are you available for Halloween bookings?", dates: isoDays("2026-10-29", "2026-11-01") },
  { key: "christmas", icon: "🎄", q: "Are you available for Christmas bookings?", dates: isoDays("2026-12-01", "2026-12-24"), grid: true },
  { key: "nye", icon: "🥂", q: "Are you available on New Year's Eve?", dates: ["2026-12-31", "2027-01-01"] },
];


const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];


const chipDate = (iso) => { const d = new Date(iso + "T12:00:00"); return { wd: WEEKDAY[d.getDay()], day: d.getDate(), mon: MONTHS[d.getMonth()].slice(0, 3) }; };



function PeakAvailability() {
  const { state, dispatch } = useStore();
  const peak = state.profile.peak || {};
  const set = (key, patch) => dispatch({ type: "PROFILE", patch: { peak: { ...peak, [key]: { ...(peak[key] || {}), ...patch } } } });
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {PEAK_DATES.map(pk => {
        const cur = peak[pk.key] || {};
        const picked = cur.dates || [];
        const toggle = (iso) => set(pk.key, { dates: picked.includes(iso) ? picked.filter(x => x !== iso) : [...picked, iso].sort() });
        return (
          <div key={pk.key} className="ff-panel">
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 24 }} aria-hidden="true">{pk.icon}</span>
              <span style={{ flex: 1, minWidth: 200, fontWeight: 700, fontSize: 15.5, color: "#16130F" }}>{pk.q}</span>
              <span className="ff-seg" role="group" aria-label={pk.q}>
                <button type="button" aria-pressed={cur.answer === "yes"} onClick={() => set(pk.key, { answer: "yes", dates: picked.length ? picked : pk.dates.slice() })}>Yes</button>
                <button type="button" aria-pressed={cur.answer === "no"} onClick={() => set(pk.key, { answer: "no", dates: [] })}>No</button>
              </span>
            </div>
            {cur.answer === "yes" && (<>
              <p className="ff-body" style={{ margin: "12px 0 8px", fontSize: 13 }}>Tap the dates you're free — {picked.length} selected.</p>
              <div className={pk.grid ? "ff-dategrid" : ""} style={pk.grid ? undefined : { display: "flex", gap: 8, flexWrap: "wrap" }}>
                {pk.dates.map(iso => { const c = chipDate(iso); const on = picked.includes(iso); return (
                  <button key={iso} type="button" className={`ff-datechip${on ? " on" : ""}`} aria-pressed={on} onClick={() => toggle(iso)}>
                    <small>{c.wd}</small><b>{c.day}</b><small>{c.mon}</small>
                  </button>
                ); })}
              </div>
            </>)}
            {cur.answer === "yes" && picked.length > 0 && (
              <p className="ff-body" style={{ margin: "10px 0 0", fontSize: 12.5, color: "#5C1220", fontWeight: 600 }}><Star size={12} fill="currentColor" /> You're on the priority list for these dates.</p>
            )}
          </div>
        );
      })}
    </div>
  );
}




/* WhatsApp mark (lucide has no brand icons). */
function WhatsAppIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3Z" />
    </svg>
  );
}




/* The "Your bookings" panel on FF Team Bookings, as on ffteam.uk: requests arrive on WhatsApp, with the three things that open with FF Staff and FF Party. */
function BookingsSoon() {
  return (
    <div className="ff-soonpanel">
      <div className="ff-wa" style={{ marginBottom: 12 }}>
        <span className="ff-wa-ico"><WhatsAppIcon size={22} /></span>
        <span className="ff-body" style={{ color: "#0B3D22", fontSize: 13.5 }}>
          <b>Requests come to you on WhatsApp.</b> When companies and clients ask if you're free, each request is sent to you directly on WhatsApp and shows here. You reply in either place.
        </span>
      </div>
      <p className="ff-soonpanel-lede">Your booked shifts will be shown here.</p>
    </div>
  );
}



/* v17.3.80: the three interest drop-downs on the Bookings page are larger boxes:
   a photo, the title and a short description, opening to the cards inside. */
const BKD_CSS = __ff_css("styles/bkd.css");


function BkDrop17({ id, title, desc, icon: Icon, photo, children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if (e.detail === id) setOpen(true);
    };
    window.addEventListener("ff-opendrop", h);
    return () => window.removeEventListener("ff-opendrop", h);
  }, [id]);
  const src = (window.FF_IMG || {})[photo] || "";
  return /* @__PURE__ */ React.createElement("section", { className: `ff-bkd${open ? " open" : ""}`, id }, /* @__PURE__ */ React.createElement("button", { type: "button", className: "bkd-hd", "aria-expanded": open, onClick: () => setOpen((o) => !o) }, src ? /* @__PURE__ */ React.createElement("span", { className: "bkd-ph" }, /* @__PURE__ */ React.createElement("img", { decoding: "async", src, style: fp17(photo), alt: "", loading: "lazy" })) : null, /* @__PURE__ */ React.createElement("span", { className: "bkd-tx" }, /* @__PURE__ */ React.createElement("span", { className: "bkd-ic" }, /* @__PURE__ */ React.createElement(Icon, { size: 16 })), /* @__PURE__ */ React.createElement("b", null, title), /* @__PURE__ */ React.createElement("span", { className: "bkd-ds" }, desc), /* @__PURE__ */ React.createElement(I11.ChevronRight, { size: 18, className: "bkd-chev" }))), open && /* @__PURE__ */ React.createElement("div", { className: "bkd-bd" }, children));
}



/* ---- FF Staff Shifts (v17.4.6): one card per profession, from the Pick your professions catalogue ----
   Matte forest-green version of the FF Party package card (green is the FF Staff accent within FF Team). The card asks the availability question (answers kept
   in profile.staffAvail, as before) and takes an optional preferred hourly rate: a typed Q&A answer
   rate.<profession id> in pence, visibility "ff-staff" (shown on the member's FF Staff profile only).
   Businesses set the actual shift rate on each Shift Card. */
/* Terms shown after signing in, before packages or rates are saved. kind "pkg": FF Party packages. kind "shift": FF Staff shifts. */
function PkgTerms17({ kind = "pkg", onClose, onAccept }) {
  const list = kind === "shift" ? STAFF_SHIFT_TERMS17 : PARTY_PKG_TERMS17;
  return (
    <Sheet open onClose={onClose} title={kind === "shift" ? "FF Staff shift terms" : "FF Party package terms"}>
      <div className="ff-tc5">
        {list.map((t, i) => <div key={t.k} className="ff-tc5-read"><span><b>{i + 1}</b>{t.label}</span><p>{t.text}</p></div>)}
      </div>
      <div className="ff-bsec-acts" style={{ marginTop: 10 }}><Btn variant="primary wide" onClick={onAccept}><Check size={14} /> Accept and confirm</Btn></div>
    </Sheet>
  );
}


function ProfRateTile17({ name, cat, guest, val, onVal, err }) {
  const { state, dispatch } = useStore();
  const account = qaAccount17(state);
  const saved = account ? prefRateP17(state, account, name) : null;
  const v = val != null ? val : saved != null ? String(saved / 100) : "";
  const staffAvail = state.profile.staffAvail || {};
  const ans = staffAvail[name] || "";
  const q = `Are you available for bookings as ${/^[aeiou]/i.test(name) ? "an" : "a"} ${name.toLowerCase()}?`;
  const login = () => window.dispatchEvent(new Event("ff-login"));
  const setAvail = (o) => { if (!account) { login(); return; } dispatch({ type: "PROFILE", patch: { staffAvail: { ...staffAvail, [name]: o } } }); };
  return (
    <div className="ff-tp17 grn prof" role="group" aria-label={name}>
      <span className="lv">{cat}</span>
      <b className="tt">{name}</b>
      <span className="in">{q}</span>
      <span className="yn" role="group" aria-label={q}>
        {["Yes", "No"].map(o => <button key={o} type="button" className={ans === o ? "on" : ""} aria-pressed={ans === o} onClick={() => setAvail(o)}>{o}</button>)}
      </span>
      <span className="pay">
        <small>Your preferred hourly rate</small>
        <span className="rt">
          <span aria-hidden="true">£</span>
          <input type="text" inputMode="decimal" value={v} aria-label={`Your preferred hourly rate as ${name}, pounds per hour`}
            onChange={(e) => onVal(name, e.target.value.replace(/[^\d.]/g, "").slice(0, 7))} />
          <span>/hour</span>
        </span>
        {err ? <span className="er" role="alert">{err}</span> : <span className="vis">Shown to businesses on FF Staff only</span>}
      </span>
    </div>
  );
}


function ProfRates17({ guest }) {
  const { state, dispatch } = useStore();
  const account = qaAccount17(state);
  const mine = recsOf(state.profile, "professions").filter(r => !r.proposed).map(r => r.name);
  const answered = [...Object.keys(state.profile.staffAvail || {}), ...ALL_PROFESSIONS.map(p => p.name).filter(n => account && prefRateP17(state, account, n) != null)];
  const yours = [...new Set([...mine, ...answered])];
  const [cat, setCat] = useState(() => (!guest && yours.length ? "Yours" : PROFESSION_CATEGORIES[0].key));
  const [vals, setVals] = useState({});
  const [errs, setErrs] = useState({});
  const [busy, setBusy] = useState(false);
  const list = cat === "Yours" ? yours.map(n => ({ name: n, cat: professionCategory(n) || "Other" })) : ALL_PROFESSIONS.filter(p => p.cat === cat).map(p => ({ name: p.name, cat: p.cat }));
  const chips = [...(!guest && yours.length ? ["Yours"] : []), ...PROFESSION_CATEGORIES.map(c => c.key)];
  const onVal = (n, v) => { setVals(x => ({ ...x, [n]: v })); setErrs(x => ({ ...x, [n]: "" })); };
  const dirty = Object.keys(vals).length > 0;
  const [terms, setTerms] = useState(false);
  const confirm = () => {
    if (busy || !dirty) return;
    const bad = {};
    Object.entries(vals).forEach(([n, t0]) => { const t = String(t0).trim(); if (t && (!isFinite(Number(t)) || Number(t) <= 0 || !/^\d+(\.\d{1,2})?$/.test(t))) bad[n] = "Enter an amount in pounds, like 18 or 18.50."; });
    if (Object.keys(bad).length) { setErrs(bad); return; }
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    setTerms(true);
  };
  const save = async () => {
    setTerms(false);
    setBusy(true);
    let okAll = true;
    for (const [n, t0] of Object.entries(vals)) {
      const t = String(t0).trim();
      const saved = prefRateP17(state, account, n);
      if (!t) {
        if (saved != null) { const r2 = await qaWithdraw17(dispatch, { account, questionId: qaRateQid17(n) }); if (!r2.ok) okAll = false; }
        continue;
      }
      const pence = Math.round(Number(t) * 100);
      if (pence === saved) continue;
      const r = await qaSubmit17(dispatch, { questionId: qaRateQid17(n), account, typed: { kind: "rate_gbp_hour", pence, profession: n }, visibility: "ff-staff", source: "FF Team Bookings · FF Staff Shifts" });
      if (!r.ok) { okAll = false; setErrs(x => ({ ...x, [n]: "That couldn't be saved." })); }
    }
    setBusy(false);
    if (okAll) { setVals({}); dispatch({ type: "TOAST", toast: "Your rates are saved" }); }
  };
  return (
    <>
      <div className="ff-pr17-chips" role="tablist" aria-label="Profession categories">
        {chips.map(k => <button key={k} type="button" role="tab" className="ff-chip ff-pr17-tab" aria-selected={k === cat} aria-pressed={k === cat} onClick={() => setCat(k)}>{k === "Yours" ? "Your professions" : k}</button>)}
      </div>
      <div className="ff-pr17-panel" role="tabpanel">
        <div className="ff-pr17-ph"><I11.ChevronDown size={16} aria-hidden="true" /> <b>{cat === "Yours" ? "Your professions" : cat}</b> shifts</div>
        <HScroll label="FF Staff Shifts" snap>
          {list.map(p => <div key={p.name} className="ff-tp17-cell"><ProfRateTile17 name={p.name} cat={p.cat} guest={guest} val={vals[p.name]} onVal={onVal} err={errs[p.name]} /></div>)}
        </HScroll>
      </div>
      <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={busy || !dirty} onClick={confirm}><Check size={15} /> Save your rates</button>
      {terms && <PkgTerms17 kind="shift" onClose={() => setTerms(false)} onAccept={save} />}
    </>
  );
}


function TeamBookings({ guest = false }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(null);
  const [showPast, setShowPast] = useState(false);
  const signedIn = state.auth.status === "signedIn";
  /* Only the demo profile (SAM42) carries sample bookings. Everyone else starts clean. */
  const demo = !guest && signedIn && ["SAM42", "ALEXG"].includes(state.auth.tag);
  const all = !demo ? [] : state.engagements.filter(e => e.staffId === "me")
    .map(e => { const shift = state.shifts.find(s2 => s2.id === e.shiftId); return { e, shift, event: shift && state.events.find(v => v.id === shift.eventId) }; })
    .filter(x => x.shift).map(x => ({ ...x, iso: x.shift.iso }));
  const byIso = (a, b) => String(a.iso).localeCompare(String(b.iso));
  const requests = all.filter(x => ["requested", "discuss", "available"].includes(x.e.state)).filter(x => { const t = startMs17(x.shift); return !(t && t <= now17(state)); }).sort(byIso);
  const upcoming = all.filter(x => ["confirmed"].includes(x.e.state)).sort(byIso);
  const cancelledByBiz = all.filter(x => x.e.state === "cancelled_biz").sort(byIso);
  const previous = all.filter(x => PAST_STATES.includes(x.e.state)).sort((a, b) => byIso(b, a));
  const goProfile = () => { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };
  const respond = (x, st) => {
    dispatch({ type: "ENG_STATE", id: x.e.id, state: st });
    dispatch({ type: "TOAST", toast: st === "confirmed" ? `Confirmed: ${x.shift.role}, ${x.shift.date}. It's now in your bookings.` : "Declined. The company has been told." });
  };
  const svcInterest = state.profile.serviceInterest || [];
  const [sel, setSel] = useState(null);
  const [pkgTerms, setPkgTerms] = useState(false);
  const picked = sel || svcInterest;
  const tick = (sv) => setSel(picked.includes(sv.id) ? picked.filter(x => x !== sv.id) : [...picked, sv.id]);
  /* v17.4.6: package sign-ups are one Q&A answer (int.party_package, option ids = package ids). */
  const confirmPkgs = async () => {
    setPkgTerms(false);
    const account = qaAccount17(state);
    if (!account) { window.dispatchEvent(new Event("ff-login")); return; }
    const next = picked;
    const sv = { title: next.length === 1 ? (pkgs.find(x => x.id === next[0]) || {}).title || "the package" : "your packages" };
    const mirror = { type: "PROFILE", patch: { serviceInterest: next } };
    const r = next.length
      ? await qaSubmit17(dispatch, { questionId: "int.party_package", account, optionIds: next, visibility: "public", source: "FF Team Bookings · FF Party packages" }, mirror)
      : await qaWithdraw17(dispatch, { questionId: "int.party_package", account }, mirror);
    dispatch({ type: "TOAST", toast: r.ok ? (next.length ? `Signed up for ${sv.title}` : "Withdrawn from your packages") : "That couldn't be saved. Try again." });
    if (r.ok) setSel(null);
  };
  const ownPackage = () => { dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); let n = 0; const go = () => { const el = document.getElementById("ff-cr17-service"); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); else if (++n < 20) setTimeout(go, 60); }; setTimeout(go, 120); };
  const pkgs = [...(hid17(state, "packages", "svc_staffing") ? [] : [STAFFING_SERVICE]), ...PARTY_SERVICES.filter(sv => sv.id !== "svc_full")];

  const Row = ({ x, tag, onClick }) => (
    <button type="button" className="ff-bk-row" onClick={onClick}>
      <span className="ff-bk-date"><b>{Number(x.iso.slice(8, 10))}</b><small>{MONTHS[Number(x.iso.slice(5, 7)) - 1].slice(0, 3)}</small></span>
      <span className="ff-bk-main">
        <b>{x.event ? x.event.title : x.shift.role}</b>
        <small>{x.shift.role} · {x.shift.time}</small>
        <small>{x.shift.venue}</small>
      </span>
      {tag}
    </button>
  );

  return (
    <div className="ff-bk">
      <BigHead20 title="FF Bookings" />

      {demo && requests.length > 0 && (
        <section className="ff-bk-sec">
          <h2 className="ff-bk-h"><span className="ff-bk-wa"><WhatsAppIcon size={14} /></span> Invitations <i>{requests.length}</i></h2>
          <div className="ff-sdrail11"><HScroll label="Invitations">{requests.map(x => <ShiftDelivery11 key={x.e.id} e={x.e} shift={x.shift} event={x.event} />)}</HScroll></div>
        </section>
      )}

      {signedIn && <section className="ff-bk-sec ff-bk-conf17">
        <div className="ff-bk-hrow"><BigHead20 title="Confirmed" count={demo && upcoming.length > 0 ? upcoming.length : undefined} /><button type="button" className="ff-bk-hist" aria-pressed={showPast} onClick={() => setShowPast(v => !v)}><Clock size={12} /> History</button></div>
        {upcoming.length ? <div className="ff-sdrail11"><HScroll label="Confirmed bookings">{upcoming.map(x => <ShiftDelivery11 key={x.e.id} e={x.e} shift={x.shift} event={x.event} />)}</HScroll></div>
          : cancelledByBiz.length ? null : <p className="ff-bk-none ff-bk-none17">Your booked shifts will be shown here.</p>}
        {cancelledByBiz.map(x => <Row key={x.e.id} x={x} onClick={() => setOpen(x.e)} tag={<span className="ff-bk-done">Cancelled by the business</span>} />)}
        {showPast && (previous.length ? previous.map(x => <Row key={x.e.id} x={x} onClick={() => setOpen(x.e)} tag={<span className="ff-bk-done">Worked</span>} />)
          : <p className="ff-bk-none">No past bookings yet.</p>)}
      </section>}

      <section className="ff-bk-sec ff-fb21" id="ff-bk-fireflair">
        <style>{BKD_CSS}</style>
        <div className="ff-bk-sell ff-bkpc ff-fb21-box" id="ff-bk-party">
          <h3>FF Party packages</h3>
          <p>You are your own boss. FireFlair sets the pay rate for each package. You deal directly with the client, and FireFlair is here to support you. Packages are advertised at a set rate, and by signing up to one you agree to that rate. The rates are strong, so we expect strong work in return.</p>
          <HScroll label="FF Party packages" snap>
            {pkgs.map(sv => <div key={sv.id} className="ff-tp17-cell"><PkgTile17 sv={sv} on={picked.includes(sv.id)} onClick={() => tick(sv)} /></div>)}
            <div className="ff-tp17-cell"><button type="button" className="ff-tp17 own" onClick={ownPackage}><span className="pl"><Plus size={22} /></span><b className="tt">Create your own package</b></button></div>
          </HScroll>
          <button type="button" className="ff-btn primary wide ff-bkconfirm17" disabled={!sel} onClick={() => { if (!qaAccount17(state)) { window.dispatchEvent(new Event("ff-login")); return; } setPkgTerms(true); }}><Check size={15} /> Confirm</button>
          {pkgTerms && <PkgTerms17 kind="pkg" onClose={() => setPkgTerms(false)} onAccept={confirmPkgs} />}
        </div>

        <div className="ff-bk-sell ff-bkpc ff-fb21-box" id="ff-bk-staff">
          <h3>FF Staff Shifts</h3>
          <p>Businesses create shift cards and set their pay rates.</p>
          <ProfRates17 guest={guest || !signedIn} />
        </div>
      </section>

      <section className="ff-bk-sec ff-bkgrow" id="ff-bk-grow">
        <BigHead20 title="Build your career" />
        <p className="ff-bk-sub">Training, dream jobs and rewards.</p>
        <BkDrop17 id="ff-bk-training" title="Training" icon={E17I.GraduationCap} photo="bk_training" desc="Courses, qualifications and masterclasses to sharpen your craft. Register your interest and we will tell you when places open."><InterestSection kind="training" inner /></BkDrop17>
        <BkDrop17 id="ff-bk-jobs" title="Dream jobs" icon={E17I.Plane} photo="bk_jobs" desc="Tell us where you dream of working, from festivals to yachts, and we will keep you in mind when it comes up."><InterestSection kind="jobs" inner /></BkDrop17>
        <BkDrop17 id="ff-bk-rewards" title="FireFlair rewards" icon={E17I.Gift} photo="bk_rewards" desc="Perks for people who work with FireFlair: kit, tickets and experiences. Register your interest in the ones you want."><InterestSection kind="rewards" inner /></BkDrop17>
      </section>

      <V101.BusinessSupport19 />

      <BookingSheet engagement={open} onClose={() => setOpen(null)} />
    </div>
  );
}



function draftFromProfile(state) {
  const names = (cat) => recsOf(state.profile, cat).filter(r => !r.proposed).map(r => r.name);
  return {
    name: state.profile.name, professions: names("professions"), photo: state.profile.photo,
    skills: names("skills"), interests: names("interests"),
    locations: names("locations"), languages: names("languages"),
  };
}



function TeamProfile() {
  const { state, dispatch } = useStore();
  const [editing0, setEditing] = useState(false);
  const barEdit = !!(state.profileEdit && state.profileEdit.on);
  const editing = editing0 || barEdit;
  const [d, setD] = useState(() => draftFromProfile(state));
  const [th, setTh] = useState(state.profile.theme);
  const { share: shareCard, busy: sharing } = useShareCard();
  /* The booking bar's Edit opens the card editor straight away; its Save applies the card. */
  useEffect(() => { if (barEdit) { setD(draftFromProfile(state)); setTh(state.profile.theme); } }, [barEdit]);
  useEffect(() => {
    if (!barEdit) return;
    const h = () => {
      syncCardRecords(state, dispatch, d, ["professions", "skills", "interests", "languages"]);
      dispatch({ type: "PROFILE", patch: { name: d.name.trim() || state.profile.name, photo: d.photo, theme: pvBase17(th) } });
    };
    window.addEventListener("ff-save", h);
    return () => window.removeEventListener("ff-save", h);
  });

  if (!state.profile.live) return <Empty icon={<User size={26} />} title="Finish creating your profile and your card appears here."
    action={<Btn variant="primary" onClick={() => dispatch({ type: "TAB", tab: "home" })}>Continue setting up</Btn>} />;

  const me = meAsStaff(state.profile, state.session);
  const startEdit = () => { setD(draftFromProfile(state)); setEditing(true); };

  /* Editing the card edits NAMES only. Descriptions, media and documents
     live on the records and are never clobbered by a card edit: existing
     records are matched by name and kept whole. */
  const save = () => {
    syncCardRecords(state, dispatch, d, ["professions", "skills", "interests", "languages"]);
    dispatch({ type: "PROFILE", patch: { name: d.name.trim() || state.profile.name, photo: d.photo, theme: pvBase17(th) } });
    setEditing(false);
    dispatch({ type: "TOAST", toast: "Card updated" });
  };

  return (
    <div>
      <div className="ff-eyebrow">FF Team · Profile</div>
      <h1 className="ff-h1" style={{ marginTop: 4, marginBottom: 14 }}>{editing ? "Edit your Profile Card" : `Welcome back${String(state.profile.name || "").trim() ? `, ${String(state.profile.name).trim().split(" ")[0]}` : ""}`}</h1>

      <div id="ff-sec-card" />
      {editing ? (
        <>
          <EditablePlayerCard draft={d} setDraft={setD} themeKey={th}
            tag={state.session.tag} tier={state.profile.tier} level={state.profile.level}
            onPhoto={(url) => setD(x => ({ ...x, photo: url }))} />
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", margin: "16px 0 4px" }}>
            {Object.entries(THEMES).map(([k, t]) => (
              <button key={k} type="button" className={t.locked ? "ff-swatch-lock" : undefined} onClick={() => { if (t.locked) previewTheme17(k, th, setTh); else { clearPv17(); setTh(k); } }} aria-label={`${t.name} card`} title={t.name}
                style={{ width: 30, height: 30, borderRadius: "50%", background: t.swatch, border: th === k ? "2px solid var(--gold)" : "1px solid var(--rule)" }}>{t.locked ? <I11.Lock size={13} /> : null}</button>
            ))}
          </div>
          {!barEdit && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 14 }}>
            <Btn variant="primary" onClick={() => { save(); }}><Check size={14} /> Save card</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}>Cancel</Btn>
          </div>}
        </>
      ) : (
        <>
          {/* v1.2: Book · Review · Join are for visitors, not on your own page.
              Edit card sits under the card; Share is with the wallets below. */}
          <PlayerCard person={me} format="full" themeKey={state.profile.theme} />
          <div style={{ maxWidth: 372, margin: "14px auto 0" }}>
            <Btn variant="primary wide" onClick={startEdit}><Pencil size={13} /> Edit card</Btn>
          </div>
        </>
      )}

      <OwnEditTools />

      <ProfileSections person={me} isMe />
        <IntroEditor17 />
      <P1SaveWhileEditing />

      <div className="ff-frame" style={{ padding: 12, marginTop: 22, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
        <Pill tone="gold"><Hash size={11} /> {state.session.tag}</Pill>
        <Pill tone="ok"><ShieldCheck size={11} /> Verified</Pill>
        <MyVerificationPill />
      </div>
    </div>
  );
}



/* ==========================================================================
   7. FF STAFF
   ========================================================================== */

/* ---------------------------------------------------------------------------
   COMING 2027 — one locked component used across FF Team, FF Staff, FF Party
   and FF VIP. Lock icon like a locked item in a game, planned version, and a
   target date once one is agreed with the development team.
   --------------------------------------------------------------------------- */
function ComingSoonTile({ item, width }) {
  if (!item) return null;
  return (
    <div className="ff-tile dark ff-locked" style={{ width: width || CARD_W.booking, minHeight: 118, gap: 7 }}>
      <Corners />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="ff-lock"><Lock size={13} color="#EAD79C" strokeWidth={1.8} /></span>
        <span className="ff-label" style={{ color: "#D9BE68" }}>{item.version}</span>
      </div>
      <span className="ff-display" style={{ fontSize: 13.5, color: "#F2ECE0", lineHeight: 1.25 }}>{item.title}</span>
      <span className="ff-serif" style={{ fontSize: 13, color: "rgba(242,236,224,.66)", lineHeight: 1.3 }}>{item.note}</span>
      <span style={{ marginTop: "auto", fontSize: 9, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(234,215,156,.6)" }}>
        {item.date ? `Target ${item.date}` : "Coming 2027 · date to be agreed"}
      </span>
    </div>
  );
}



function ComingSoonRow({ ids, title = "Coming 2027" }) {
  const items = (ids ? ids.map(roadmapItem) : ROADMAP).filter(Boolean);
  return (
    <section style={{ marginTop: 26 }}>
      <SectionHead icon={<Lock size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={title} count={items.length} />
      <HScroll label={title}>
        {items.map(it => <ComingSoonTile key={it.id} item={it} />)}
      </HScroll>
    </section>
  );
}



/* Numbered step heading for the vertical Event Card journey. */
function StepHead({ n, title, note, done }) {
  const go = () => { const el = document.getElementById(`ff-step-${n}`); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); };
  return (
    <div id={`ff-step-${n}`} className="ff-stephead" style={{ display: "flex", gap: 12, alignItems: "flex-start", margin: "34px 0 14px", scrollMarginTop: 80 }}>
      <button type="button" className="ff-stepnum" data-done={done ? "1" : "0"} onClick={go} aria-label={`Step ${n}: ${title}`}>{done ? <Check size={14} /> : String(n).padStart(2, "0")}</button>
      <span style={{ flex: 1, minWidth: 0, paddingTop: 5 }}>
        <span className="ff-h2" style={{ display: "block" }}>{title}</span>
        {note && <span className="ff-body ff-muted" style={{ fontSize: 13.5 }}>{note}</span>}
      </span>
    </div>
  );
}



/* Helpers shared by the FF Staff screens. */
/* Find a person on a Service Card. "me" is the signed-in professional, who
   isn't in the directory until their FF Team profile is live. */
const findPerson = (all, state, id) => all.find(p => p.id === id) || (id === "me" ? meAsStaff(state.profile, state.session) : undefined);


const latestEng = (state, shiftId) => {
  const list = state.engagements.filter(e => e.shiftId === shiftId);
  return list[list.length - 1] || null;
};


const reservedCredits = (state) => state.engagements.filter(e => e.credit && e.state === "requested").length;


const freeCredits = (state) => Math.max(0, (state.credits?.balance || 0) - reservedCredits(state));


/* A shift can be sent when someone is assigned and they haven't already been
   asked (or the last person asked declined/expired and has been replaced). */
function canSend(state, shift) {
  if (!shift.staffId) return false;
  const e = latestEng(state, shift.id);
  if (!e) return true;
  return ["unavailable", "expired"].includes(e.state) && e.staffId !== shift.staffId;
}


const splitTime = (t) => { const [a = "", b = ""] = String(t || "").split(/\s*[—–-]\s*/); return [a.trim(), b.trim()]; };





const secDay = (iso) => {
  if (!iso) return null;
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? null : { date: d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), day: d.toLocaleDateString("en-GB", { weekday: "long" }) };
};









/* ---------------------------------------------------------------------------
   BOOKING BAR (v16.12) — works like the XP bar: a bottom bar on phones and a
   row under the menu bar on desktop. It shows the Event Card (or a blank
   card where it will go) and a small card for each person in the basket.
   Cards can be dragged onto it on desktop.
   --------------------------------------------------------------------------- */
function BookingBar({ placement = "bottom", dragging = false, style }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const ev = state.events.find(e => e.id === state.activeEventId);
  const people = state.selection.map(id => all.find(p => p.id === id)).filter(Boolean);
  const [over, setOver] = useState(false);
  const site = hireSiteOf(state);
  const go = () => {
    if (state.role !== "staff") dispatch({ type: "ROLE", role: "staff" });
    dispatch({ type: "V11_SET", patch: { bkView: ev ? { eventId: ev.id } : { mode: "new" } } });
    dispatch({ type: "TAB", tab: "bookings", route: "staffHome" });
    window.scrollTo(0, 0);
  };
  const drop = (e) => {
    e.preventDefault(); setOver(false);
    let v = "";
    try { v = e.dataTransfer.getData("text/plain") || ""; } catch (x) { /* ignore */ }
    const id = v.startsWith("ff-person:") ? v.slice(10) : null;
    const p = id && all.find(x => x.id === id);
    if (!p) return;
    if (state.selection.includes(id)) { dispatch({ type: "TOAST", toast: `${p.name.split(" ")[0]} is already in your booking bar` }); return; }
    dispatch({ type: "SELECT_ADD", id });
    dispatch({ type: "TOAST", toast: `${p.name.split(" ")[0]} added${ev ? ` to ${ev.title}` : ""}` });
  };
  const evDay = ev && secDay(ev.iso);
  const evTheme = ev && ev.poster ? eventThemeOf(ev.poster) : null;   // an FF Party Event Card keeps its colours
  return (
    <div className={`ff-bookbar ${placement}${over ? " over" : ""}${dragging ? " dragging" : ""}`} style={style}
      onDragOver={(e) => { e.preventDefault(); try { e.dataTransfer.dropEffect = "copy"; } catch (x) { /* ignore */ } if (!over) setOver(true); }}
      onDragLeave={() => setOver(false)} onDrop={drop} aria-label="Booking bar">
      <div className="ff-bookbar-in">
        <button type="button" className={`ff-mini ev${ev ? "" : " blank"}${evTheme ? " poster" : ""}`} onClick={go}
          style={evTheme ? { background: evTheme.swatch, color: evTheme.dark ? "#F3DE9C" : "#15130F" } : undefined}
          aria-label={ev ? `Open Event Card: ${ev.title}` : "Create your Event Card"} title={ev ? ev.title : "Your Event Card goes here"}>
          {ev ? (<>
            <span className="tab" />
            <span className="t">{ev.title}</span>
            <span className="d">{evDay ? evDay.date.replace(/ \d{4}$/, "") : (ev.date || "")}</span>
          </>) : (<><Plus size={12} /><span className="d">Event</span></>)}
        </button>
        <span className="ff-bookbar-plus" aria-hidden="true">+</span>
        <div className="ff-bookbar-cards">
          {people.map(p => (
            <button key={p.id} type="button" className="ff-mini person" title={`${p.name} · ${p.profession}`}
              aria-label={`${p.name}, in your booking bar`} onClick={() => dispatch({ type: "VIEW", id: p.id })}
              style={{ backgroundImage: p.photo ? `url("${p.photo}")` : undefined }}>
              {!p.photo && <span className="ini">{p.name.split(" ").map(w => w[0]).slice(0, 2).join("")}</span>}
              <span className="nm">{p.name.split(" ")[0]}</span>
            </button>
          ))}
          {(dragging || over) && <span className="ff-mini drop">Drop</span>}
          {!people.length && !dragging && !over && <span className="ff-bookbar-hint">{ev ? "Add people: tap or drag their cards here" : "Tap or drag people here"}</span>}
        </div>
        {people.length > 0 && (
          <button type="button" className="ff-bookbar-clear" onClick={() => dispatch({ type: "CLEAR_SELECTION" })} aria-label="Clear the people from your booking bar"><X size={14} /></button>
        )}
        <button type="button" className="ff-bookbar-go" onClick={go}>
          {ev ? (people.length ? "Add to booking" : "Open booking") : "Create Event Card"}
        </button>
      </div>
    </div>
  );
}




/* ---------------------------------------------------------------------------
   PICK PERSON — fill or replace the person on a Service Card. The basket comes
   first; suggestions follow. The hirer always chooses.
   --------------------------------------------------------------------------- */
function PickPersonSheet({ open, shift, event, onClose }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  if (!open || !shift) return null;
  const taken = state.shifts.filter(x => x.eventId === event.id && x.id !== shift.id).map(x => x.staffId);
  const asked = state.engagements.filter(e => e.shiftId === shift.id).map(e => e.staffId);
  const basket = state.selection.map(id => all.find(p => p.id === id)).filter(p => p && !taken.includes(p.id));
  const role = (shift.role || "").toLowerCase();
  const suggestions = all.filter(p => !taken.includes(p.id) && !asked.includes(p.id) && !state.selection.includes(p.id))
    .filter(p => role && (p.profession.toLowerCase().includes(role.split(" ").pop()) || role.includes(p.profession.toLowerCase().split(" ").pop())))
    .sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 6);
  const pick = (p) => {
    dispatch({ type: "SHIFT_PATCH", id: shift.id, patch: { staffId: p.id } });
    dispatch({ type: "TOAST", toast: `${p.name.split(" ")[0]} assigned to this Service Card` });
    onClose();
  };
  const Row = ({ p, tag }) => (
    <button className="ff-info" onClick={() => pick(p)} style={{ width: "100%", display: "flex", gap: 11, alignItems: "center", textAlign: "left" }}>
      <Portrait src={p.photo} name={p.name} size={38} tier={p.tier} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="ff-display" style={{ fontSize: 13, display: "block" }}>{p.name}</span>
        <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{p.profession}{p.rating ? ` · ${p.rating}★` : ""}</span>
      </span>
      {(() => { const av = availabilityFor(state, p.id, event.iso); return av ? <Pill tone={availTone(av.answer)}>{av.answer === "Yes" ? "Available" : av.answer === "No" ? "Not free" : "Maybe"}</Pill> : null; })()}{tag && <Pill tone="gold">{tag}</Pill>}
    </button>
  );

  return (
    <Sheet open onClose={onClose} title={`Who for ${shift.role || "this shift"}?`}>
      <div className="ff-label" style={{ marginBottom: 8 }}>Your basket</div>
      {basket.length ? basket.map(p => <Row key={p.id} p={p} tag="Basket" />)
        : <p className="ff-body ff-muted" style={{ marginTop: 0, fontSize: 12.5 }}>Your basket is empty. Add people from any profile or the FF Staff home page.</p>}
      <div className="ff-label" style={{ margin: "16px 0 8px" }}>Suggestions</div>
      {suggestions.length ? suggestions.map(p => <Row key={p.id} p={p} tag="Suggested" />)
        : <p className="ff-body ff-muted" style={{ marginTop: 0, fontSize: 12.5 }}>No close matches for this role yet.</p>}
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, marginBottom: 0 }}>Suggestions only. Nobody is assigned until you choose them.</p>
    </Sheet>
  );
}



/* ---------------------------------------------------------------------------
   INVOICE — confirmed Service Cards for one event, one professional document.
   --------------------------------------------------------------------------- */
function InvoiceCard({ event, rows, company }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const cm = event.cocktails;
  const citems = cm && cm.picks ? cm.picks.map(id => cocktailById(state, id, directory)).filter(Boolean) : [];
  const recipesText = citems.length ? ` Cocktails, ${menuLine(cm)}: ${citems.map(x => `${x.name} (${ingredientsOf(x).join(", ")})`).join("; ")}.` : "";
  const text = `FireFlair booking — ${event.title}, ${event.date || "date TBC"}, ${event.venue || ""}. Confirmed: ${rows.map(r => `${r.person?.name || "Staff"} (${r.shift.role}, ${r.shift.time || "times TBC"})`).join("; ")}.` + recipesText;
  return (
    <div className="ff-invoice">
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 14px 10px" }}>
        <Coin size={30} tier="gold" />
        <span style={{ flex: 1, minWidth: 0 }}>
          <span className="ff-label" style={{ display: "block" }}>FireFlair invoice</span>
          <span className="ff-display" style={{ fontSize: 15 }}>{event.title}</span>
        </span>
        <Receipt size={18} color="var(--gold-dk)" strokeWidth={1.5} />
      </div>
      <div style={{ padding: "0 14px" }}>
        <div className="ff-body ff-muted" style={{ fontSize: 12 }}>
          {event.date || "Date to confirm"} · {event.venue || "Venue to confirm"}{company?.name ? ` · Booked by ${company.name}` : ""}
        </div>
        <table className="ff-invtable">
          <thead><tr><th>Professional</th><th>Shift</th><th>Pay rate</th><th>FireFlair</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.shift.id}>
                <td>{r.person?.name || "Staff"}</td>
                <td>{r.shift.role}<br /><span className="ff-muted">{r.shift.time || "Times TBC"}</span></td>
                <td>{r.shift.pay || "As agreed"}</td>
                <td>1 credit</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "8px 0 12px" }}>
          {rows.length} confirmed Service Card{rows.length === 1 ? "" : "s"} · {rows.length} FireFlair credit{rows.length === 1 ? "" : "s"} used ({CREDIT_FEE} connection fee each).
          Pay rates are paid by the hirer directly to each professional — FireFlair does not hold or move that money.
        </p>
        {citems.length > 0 && (
          <div className="ff-invrecipes">
            <div className="ff-label" style={{ marginBottom: 8 }}>Cocktail recipes · {menuLine(cm)}</div>
            <RecipeList items={citems} />
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "0 14px 14px" }}>
        <Btn variant="sm" onClick={async () => {
          try { await navigator.clipboard.writeText(text); dispatch({ type: "TOAST", toast: "Invoice copied" }); }
          catch (e) { dispatch({ type: "TOAST", toast: "Couldn't copy here — use Share on WhatsApp" }); }
        }}><Copy size={13} /> Copy invoice</Btn>
        <a className="ff-btn sm" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={13} /> Share on WhatsApp</a>
      </div>
    </div>
  );
}



/* ---------------------------------------------------------------------------
   EVENT CARD PAGE — the control page for a booking. One vertical, guided
   journey: event → team and Service Cards → questions and T&Cs → credits and
   send → responses → invoice → reviews.
   --------------------------------------------------------------------------- */
function EventPage() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const event = state.events.find(e => e.id === state.activeEventId);
  const [editing, setEditing] = useState(null);      // shift object or {} for new
  const [picking, setPicking] = useState(null);
  const [reviewing, setReviewing] = useState(null);  // { person, shiftId }
  const [offerCompany, setOfferCompany] = useState(false);
  const [buying, setBuying] = useState(false);
  const [, tick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => { dispatch({ type: "EXPIRE_DUE" }); tick(n => n + 1); }, 30000);
    dispatch({ type: "EXPIRE_DUE" });
    return () => clearInterval(t);
  }, []);

  if (!event) return <Empty icon={<Calendar size={26} />} title="No Event Card open. Create one to start a booking."
    action={<Btn variant="primary" onClick={() => dispatch({ type: "GO", route: "staffHome" })}>Create Event Card</Btn>} />;

  const person = (id) => findPerson(all, state, id);
  const shifts = state.shifts.filter(s2 => s2.eventId === event.id);
  const assigned = shifts.filter(x => x.staffId);
  const assignedIds = assigned.map(x => x.staffId);
  const unassignedBasket = state.selection.filter(id => !assignedIds.includes(id)).map(person).filter(Boolean);
  const ready = shifts.filter(x => canSend(state, x));
  const free = freeCredits(state);
  const short = Math.max(0, ready.length - free);
  const company = state.company;
  const questions = (company?.questions || []).filter(q2 => (event.questionIds || []).includes(q2.id));
  const engs = shifts.map(sh => ({ sh, e: latestEng(state, sh.id) })).filter(x => x.e);
  const confirmedRows = engs.filter(x => ["confirmed", "completed", "signed_off", "paid"].includes(x.e.state))
    .map(x => ({ shift: x.sh, person: person(x.e.staffId) }));
  const reviewable = engs.filter(x => ["completed", "signed_off", "paid"].includes(x.e.state));
  const teamTarget = Number(event.team) || 0;

  const giveShift = (p) => {
    const last = shifts[shifts.length - 1];
    const sh = {
      id: uid("shf"), eventId: event.id, staffId: p ? p.id : "",
      role: p ? p.profession : (last?.role || ""), time: last?.time || "",
      skills: last ? [...(last.skills || [])] : [], pay: last?.pay || "", dress: last?.dress || "", notes: "",
      date: event.date || "", iso: event.iso || "", venue: event.venue || "",
    };
    setEditing(sh);
  };
  const toggleQ = (id) => {
    const cur = event.questionIds || [];
    dispatch({ type: "EVENT_PATCH", id: event.id, patch: { questionIds: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] } });
  };
  const send = () => {
    dispatch({ type: "SEND_REQUESTS", shiftIds: ready.map(x => x.id), questions: questions.map(q2 => q2.id) });
    dispatch({ type: "TOAST", toast: `${ready.length} Availability Card${ready.length === 1 ? "" : "s"} sent on WhatsApp` });
  };

  return (
    <div>
      <button className="ff-btn sm ghost" style={{ marginBottom: 14 }} onClick={() => dispatch({ type: "TAB", tab: "bookings", route: "staffHome" })}><ChevronLeft size={13} /> All bookings</button>
      <div className="ff-eyebrow">{hireSiteOf(state).name} · Event Card</div>

      {/* 1 — the event */}
      <StepHead n={1} title="The event" note="Shared by every Service Card on this event." done />
      <div style={{ maxWidth: 460, margin: "0 auto" }}>
        {event.poster
          ? <EventPoster card={posterFromEvent(event)} people={assigned.map(x => all.find(p => p.id === x.staffId)).filter(Boolean)} saved />
          : <EventCard11 ev={event} people={eventPeople(state, all, event)} />}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 10 }}>
          <Pill tone="gold"><Users size={11} /> {assigned.length}{teamTarget ? ` of ${teamTarget}` : ""} assigned</Pill>
          {company && company.name && <Pill tone="gold"><Briefcase size={11} /> {company.name}</Pill>}
          <button className="ff-btn sm ghost" style={{ marginLeft: "auto" }} onClick={() => { dispatch({ type: "GO", route: "staffHome" }); setTimeout(() => scrollToSection(hireSiteOf(state).anchor), 140); }}><Pencil size={12} /> Edit</button>
        </div>
        {(event.site === "party" || (event.cocktails && event.cocktails.picks && event.cocktails.picks.length > 0)) && <EventCocktails event={event} />}
      </div>

      {/* 2 — team and Service Cards */}
      <StepHead n={2} title="Team and Service Cards" done={teamTarget ? assigned.length >= teamTarget : assigned.length > 0}
        note="One Service Card per person. Duplicate a card to set up similar shifts quickly." />
      {shifts.map(sh => {
        const p = person(sh.staffId);
        const e = latestEng(state, sh.id);
        const locked = e && e.staffId === sh.staffId && !["unavailable", "expired"].includes(e.state);
        return (
          <div key={sh.id} className="ff-shiftrow">
            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
              {p ? <Portrait src={p.photo} name={p.name} size={40} tier={p.tier} />
                : <span className="ff-emptyface"><User size={18} color="var(--gold-dk)" strokeWidth={1.4} /></span>}
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="ff-display" style={{ fontSize: 13.5, display: "block" }}>{p ? p.name : "Not assigned yet"}</span>
                <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{sh.role || "Role to set"} · {sh.time || "Times to set"}</span>
                <span className="ff-body" style={{ fontSize: 12, display: "block", color: "#6A6253" }}>Uniform: {sh.dress || <i>not set</i>}</span>
              </span>
              {e && e.staffId === sh.staffId ? <Pill tone={ENG_TONE[e.state]}>{ENG_LABEL[e.state]}</Pill>
                : sh.staffId ? <Pill>Not sent</Pill> : null}
            </div>
            <div className="ff-shiftacts">
              <button onClick={() => setEditing(sh)} disabled={locked}><Pencil size={12} /> Edit</button>
              <button onClick={() => dispatch({ type: "SHIFT_DUPLICATE", id: sh.id })}><Copy size={12} /> Duplicate</button>
              <button onClick={() => setPicking(sh)} disabled={locked}><Users size={12} /> {p ? "Change" : "Assign"}</button>
              {!e && <button onClick={() => dispatch({ type: "SHIFT_DELETE", id: sh.id })}><Trash2 size={12} /> Remove</button>}
            </div>
          </div>
        );
      })}
      {unassignedBasket.length > 0 && (
        <div className="ff-frame" style={{ padding: 12, marginTop: 6 }}>
          <div className="ff-label" style={{ marginBottom: 8 }}>In your basket — give each a Service Card</div>
          {unassignedBasket.map(p => (
            <div key={p.id} style={{ display: "flex", gap: 10, alignItems: "center", padding: "6px 0" }}>
              <Portrait src={p.photo} name={p.name} size={30} tier={p.tier} />
              <span style={{ flex: 1, minWidth: 0 }} className="ff-body">{p.name} <span className="ff-muted">· {p.profession}</span></span>
              <Btn variant="sm" onClick={() => giveShift(p)}><Plus size={12} /> Service Card</Btn>
            </div>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
        <Btn onClick={() => giveShift(null)}><Plus size={14} /> Add Service Card</Btn>
        <Btn variant="ghost" onClick={() => dispatch({ type: "GO", route: "staffHome" })}><Search size={14} /> Find people</Btn>
      </div>

      {/* 3 — questions, T&Cs and documents */}
      <StepHead n={3} title="Questions, T&Cs and documents" note="Sent with each Availability Card, from your Company Card." done={!!company} />
      {company ? (
        <div className="ff-frame" style={{ padding: 14 }}>
          <div className="ff-label" style={{ marginBottom: 6 }}>Hiring questions</div>
          {(company.questions || []).length ? company.questions.map(q2 => (
            <label key={q2.id} className="ff-check">
              <input type="checkbox" checked={(event.questionIds || []).includes(q2.id)} onChange={() => toggleQ(q2.id)} />
              <span><span className="ff-body" style={{ display: "block" }}>{q2.text}</span>
                <span className="ff-body ff-muted" style={{ fontSize: 11.5 }}>{q2.options.join(" · ")}</span></span>
            </label>
          )) : <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 12.5 }}>No hiring questions yet.</p>}
          <hr className="ff-rule" style={{ margin: "12px 0" }} />
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <Pill tone="ok"><FileText size={11} /> T&Cs · 5 terms</Pill>
            <Pill><FileText size={11} /> {companyDocs(company).length} document{companyDocs(company).length === 1 ? "" : "s"}</Pill>
            <button className="ff-btn sm ghost" style={{ marginLeft: "auto" }} onClick={() => dispatch({ type: "TAB", tab: "profile", route: "staffHome" })}>Edit</button>
          </div>
        </div>
      ) : (
        <div className="ff-sell dark" style={{ marginBottom: 0 }}>
          <Corners />
          <span className="ff-label">Company Card</span>
          <h3 className="ff-h2" style={{ margin: "6px 0" }}>Save your T&Cs, documents and questions once.</h3>
          <p className="ff-body" style={{ marginTop: 0 }}>Until then, the FireFlair five-section T&Cs template goes with each Availability Card.</p>
          <Btn variant="onDark" onClick={() => dispatch({ type: "TAB", tab: "profile", route: "staffHome" })}><Briefcase size={14} /> Create Company Card</Btn>
        </div>
      )}

      {/* 4 — credits and send */}
      <StepHead n={4} title="Credits and availability" done={ready.length === 0 && engs.length > 0}
        note={`One FireFlair credit (${CREDIT_FEE}) per Service Card sent. A credit is only used when that person confirms.`} />
      <div className="ff-frame" style={{ padding: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          {[["Ready to send", ready.length], ["Credits free", free], ["Reserved", reservedCredits(state)]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div className="ff-display" style={{ fontSize: 20 }}>{v}</div>
              <div className="ff-label" style={{ fontSize: 8.5 }}>{l}</div>
            </div>
          ))}
        </div>
        {ready.length === 0 ? (
          <p className="ff-body ff-muted" style={{ margin: 0, fontSize: 12.5, textAlign: "center" }}>
            {shifts.length ? "Every assigned Service Card has been sent." : "Add a Service Card and assign someone to send availability."}
          </p>
        ) : short > 0 ? (
          <Btn variant="primary wide" onClick={() => setBuying(true)}><CreditCard size={15} /> Buy {short} credit{short === 1 ? "" : "s"}</Btn>
        ) : (
          <Btn variant="primary wide" onClick={send}><Send size={15} /> Send {ready.length} Availability Card{ready.length === 1 ? "" : "s"} on WhatsApp</Btn>
        )}
        <p className="ff-body ff-muted" style={{ fontSize: 11, margin: "10px 0 0", textAlign: "center" }}>
          No reply or a decline? The credit isn't used. Unused credits are non-refundable but stay yours for future bookings.
        </p>
      </div>

      {/* 5 — responses */}
      {engs.length > 0 && <>
        <StepHead n={5} title="Responses" note={`Each person has ${RESPONSE_HOURS} hours to confirm.`}
          done={engs.every(x => !["requested", "unavailable", "expired"].includes(x.e.state))} />
        {engs.map(({ sh, e }) => {
          const p = person(e.staffId);
          const first = (p?.name || "They").split(" ")[0];
          return (
            <div key={e.id} className="ff-shiftrow">
              <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                <Portrait src={p?.photo} name={p?.name || "Staff"} size={34} tier={p?.tier} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="ff-display" style={{ fontSize: 13, display: "block" }}>{p?.name || "Staff"}</span>
                  <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{sh.role}{e.state === "requested" && e.expiresAt ? ` · ${timeLeft(e.expiresAt)}` : ""}</span>
                </span>
                <Pill tone={ENG_TONE[e.state]}><span className="ff-dot" /> {ENG_LABEL[e.state]}</Pill>
              </div>
              {e.state === "requested" && (
                <div className="ff-preview">
                  <span className="ff-label" style={{ fontSize: 8.5 }}>Prototype preview</span>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    <button onClick={() => { dispatch({ type: "ENG_STATE", id: e.id, state: "confirmed" }); dispatch({ type: "TOAST", toast: `${first} confirmed${e.credit ? " · 1 credit used" : ""}` }); }}>{first} confirms</button>
                    <button onClick={() => dispatch({ type: "ENG_STATE", id: e.id, state: "unavailable" })}>{first} declines</button>
                    <button onClick={() => dispatch({ type: "ENG_STATE", id: e.id, state: "expired" })}>No reply in {RESPONSE_HOURS}h</button>
                  </div>
                </div>
              )}
              {["unavailable", "expired"].includes(e.state) && e.staffId === sh.staffId && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <Btn variant="sm" onClick={() => setPicking(sh)}><RotateCcw size={12} /> Replace</Btn>
                  <Btn variant="sm ghost" onClick={() => setPicking(sh)}><Sparkles size={12} /> Take a suggestion</Btn>
                </div>
              )}
              {["unavailable", "expired"].includes(e.state) && e.staffId !== sh.staffId && (
                <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "8px 0 0" }}>Replaced by {person(sh.staffId)?.name || "someone new"} — send their Availability Card in step 4.</p>
              )}
              {e.state === "confirmed" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <WalletButton kind="booking" dark={false} payload={{ shiftId: sh.id, role: sh.role, date: event.date, venue: event.venue }} />
                  <Btn variant="sm" onClick={() => dispatch({ type: "ENG_STATE", id: e.id, state: "completed" })}><Check size={12} /> Shift worked</Btn>
                </div>
              )}
            </div>
          );
        })}
      </>}

      {/* 6 — invoice */}
      {confirmedRows.length > 0 && <>
        <StepHead n={6} title="Invoice" note="Generated from the confirmed Service Cards." done />
        <InvoiceCard event={event} rows={confirmedRows} company={company} />
      </>}

      {/* 7 — reviews, one per Service Card */}
      {reviewable.length > 0 && <>
        <StepHead n={7} title="Reviews" note="One review per Service Card." done={reviewable.every(x => state.reviews.some(r => r.shiftId === x.sh.id))} />
        {reviewable.map(({ sh, e }) => {
          const p = person(e.staffId);
          const done = state.reviews.some(r => r.shiftId === sh.id);
          return (
            <div key={sh.id} className="ff-shiftrow" style={{ display: "flex", gap: 11, alignItems: "center" }}>
              <Portrait src={p?.photo} name={p?.name || "Staff"} size={34} tier={p?.tier} />
              <span style={{ flex: 1, minWidth: 0 }} className="ff-body">{p?.name || "Staff"} <span className="ff-muted">· {sh.role}</span></span>
              {done ? <Pill tone="ok"><Check size={10} /> Reviewed</Pill>
                : <Btn variant="sm" onClick={() => p && setReviewing({ person: p, shiftId: sh.id })}><Award size={12} /> Review</Btn>}
            </div>
          );
        })}
      </>}

      <ComingSoonRow ids={["auto", "gmaps", "party"]} title="Coming to Event Cards" />

      <ShiftSheet open={!!editing} shift={editing} event={event} onClose={() => setEditing(null)} onSaved={() => { if (!company) setOfferCompany(true); }} />
      <PickPersonSheet open={!!picking} shift={picking} event={event} onClose={() => setPicking(null)} />
      <ReviewSheet open={!!reviewing} person={reviewing?.person} shiftId={reviewing?.shiftId} onClose={() => setReviewing(null)} />
      <BuyCreditsSheet open={buying} need={short} onClose={() => setBuying(false)} />
      <Sheet open={offerCompany} onClose={() => setOfferCompany(false)} title="Create your Company Card?">
        <p className="ff-body" style={{ marginTop: 0 }}>
          Your Company Card keeps your business details, T&Cs, documents and hiring questions, and sends them with every Event Card — so you only set them up once.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Btn variant="primary" onClick={() => { setOfferCompany(false); dispatch({ type: "TAB", tab: "profile", route: "staffHome" }); }}><Briefcase size={14} /> Create it</Btn>
          <Btn variant="ghost" onClick={() => setOfferCompany(false)}>Later</Btn>
        </div>
      </Sheet>
    </div>
  );
}
