/* src/components/team/profile-builder.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The card editor wired straight to the profile records: the card always
   shows what the profile holds, and every edit writes to it immediately, so
   the card and the sections below can never disagree. */
function CardBuilder() {
  const { state, dispatch } = useStore();
  const d = draftFromProfile(state);
  const CATS = ["professions", "skills", "interests", "locations", "languages"];
  const setD = (next) => {
    const nd = typeof next === "function" ? next(d) : next;
    const changed = CATS.filter(c => JSON.stringify(nd[c] || []) !== JSON.stringify(d[c] || []));
    if (changed.length) syncCardRecords(state, dispatch, nd, changed);
    if (nd.name !== d.name || nd.photo !== d.photo || (nd.headline || "") !== (d.headline || "")) dispatch({ type: "PROFILE", patch: { name: nd.name, photo: nd.photo, headline: nd.headline || "" } });
    if (String(nd.name || "").trim() && (nd.professions || []).length && !(state.profile.xpClaimed || []).includes("create_card")) {
      dispatch({ type: "CARD_CREATED_XP" });
      dispatch({ type: "TOAST", toast: `Profile Card created${xpNote(XP_VALUES.task)}` });
    }
  };
  return (
    <>
      <EditablePlayerCard draft={d} setDraft={setD} themeKey={state.profile.theme}
        tag={state.session.tag || state.session.tagDraft || "username"} level={state.profile.level}
        onPhoto={(url) => setD(x => ({ ...x, photo: url }))} />
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", margin: "16px 0 4px" }}>
        {Object.entries(THEMES).filter(([, x]) => !x.directoryOnly).map(([k, th]) => (
          <button key={k} className={th.locked ? "ff-swatch-lock" : undefined} onClick={() => { const ap = (v) => dispatch({ type: "PROFILE", patch: { theme: v } }); if (th.locked) previewTheme17(k, state.profile.theme, ap); else { clearPv17(); ap(k); } }} aria-label={`${th.name} card`} title={th.name}
            style={{ width: 30, height: 30, borderRadius: "50%", background: th.swatch, border: state.profile.theme === k ? "2px solid var(--gold)" : "1px solid var(--rule)" }}>{th.locked ? <I11.Lock size={13} /> : null}</button>
        ))}
      </div>
    </>
  );
}



/* CV upload, in place. The CV itself is kept as the first Qualification
   card (cv: true). FireFlair then reads it — every page — and its suggestions
   wait in the review below until the person adds them. */
const hasCV = (profile) => recsOf(profile, "qualifications").some(r => r.cv);


const dataUrlToFile = (u, name, type) => {
  const [head, body] = String(u || "").split(",");
  const bin = atob(body || "");
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], name || "CV", { type: type || ((head || "").match(/data:([^;]+)/) || [])[1] || "" });
};


function CVPanel({ inline = false } = {}) {
  const { state, dispatch } = useStore();
  const ref = useRef(null);
  const [st, setSt] = useState(null);
  const ex = useExtraction();
  useEffect(() => { getSample(); }, []);   // learn early whether FireFlair is available here
  const cvRec = recsOf(state.profile, "qualifications").find(r => r.cv);
  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    e.target.value = "";
    if (f.size > MAX_MEDIA_BYTES) { setSt({ msg: `That file is ${prettyBytes(f.size)} — keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.` }); return; }
    setSt({ busy: true, msg: `Saving ${f.name}…` });
    let dataUrl = null;
    try { dataUrl = await readFileAsDataUrl(f); } catch (err) { setSt({ msg: err.message }); return; }
    const cv = makeRecord("qualifications", "CV", {
      cv: true, description: `Uploaded ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`,
      document: { name: f.name, size: f.size, type: f.type, dataUrl },
    });
    dispatch({ type: "REC_BULK", category: "qualifications", list: [cv, ...recsOf(state.profile, "qualifications").filter(r => !r.cv)] });
    dispatch({ type: "TOAST", toast: cvRec ? "CV replaced" : "CV saved under Qualifications" });
    setSt(null);
    ex.start(f);
  };
  const readSaved = () => {
    const d = cvRec && cvRec.document;
    if (!d || !d.dataUrl) { setSt({ msg: "Upload your CV again so FireFlair can read it." }); return; }
    setSt(null);
    ex.start(dataUrlToFile(d.dataUrl, d.name, d.type));
  };
  const input = <input ref={ref} type="file" accept=".pdf,.doc,.docx,.txt,.md,image/*,application/msword" onChange={onFile} style={{ display: "none" }} />;
  const status = st && <span className="ff-body" style={{ fontSize: 12, display: "flex", gap: 6, alignItems: "center", marginTop: 6 }}>
    {st.busy && <Loader2 size={13} className="ff-spin" />}{st.msg}</span>;
  const below = (<>
    <ExtractionStatus ex={ex} />
    {ex.st.phase === "review" && (
      <ImportToEdit key={ex.st.result.report && ex.st.result.report.ms} result={ex.st.result} onDone={ex.reset} />
    )}
  </>);

  /* Inline: the compact form inside the one FF AI box at the top of Create a profile. */
  if (inline) return (
    <div className="ff-cvinl17">
      {input}
      {cvRec ? (
        <div className="row">
          <span className="ok"><Check size={16} strokeWidth={2.4} /></span>
          <span className="nm"><b>CV uploaded</b><small>{(cvRec.document && cvRec.document.name) || "Saved under Qualifications"}</small></span>
          {ex.st.phase === "idle" && <Btn variant="sm" disabled={st && st.busy} onClick={readSaved}><Sparkles size={13} /> Read my CV</Btn>}
          <Btn variant="sm ghost" disabled={(st && st.busy) || ex.busy} onClick={() => ref.current && ref.current.click()}><Upload size={13} /> Replace</Btn>
        </div>
      ) : (
        <Btn variant="gold ff-bigcv17" disabled={(st && st.busy) || ex.busy} onClick={() => ref.current && ref.current.click()}><Upload size={16} strokeWidth={2.2} /> Upload CV</Btn>
      )}
      {status}
      {below}
    </div>
  );

  /* Uploaded: stays on the page, calm — done, but still there to read or replace. */
  if (cvRec) return (
    <div id="ff-sec-cv">
      <div className="ff-cvdone" style={{ padding: "14px 18px", marginTop: 14, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ width: 40, height: 40, flex: "none", borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(255,255,255,.7)", border: "1px solid rgba(126,97,29,.25)" }}>
          <Check size={20} color="var(--ok)" strokeWidth={2.2} />
        </span>
        <span style={{ flex: 1, minWidth: 160 }}>
          <span style={{ fontSize: 16, fontWeight: 700, display: "block", color: "#16130F" }}>CV uploaded</span>
          <span className="ff-body ff-muted" style={{ fontSize: 12.5, display: "block", overflowWrap: "anywhere" }}>{(cvRec.document && cvRec.document.name) || "Saved under Qualifications"}</span>
          {status}
        </span>
        {input}
        <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {ex.st.phase === "idle" && <Btn variant="sm" disabled={st && st.busy} onClick={readSaved}><Sparkles size={13} /> Read my CV</Btn>}
          <Btn variant="sm ghost" disabled={(st && st.busy) || ex.busy} onClick={() => ref.current && ref.current.click()}><Upload size={13} /> Replace</Btn>
        </span>
      </div>
      {below}
    </div>
  );
  return (
    <div id="ff-sec-cv">
      <div className="ff-cvask" style={{ padding: "16px 18px", marginTop: 14, display: "flex", gap: 14, flexDirection: "column" }}>
        <span style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span aria-hidden="true" style={{ flex: "none", width: 58, height: 58, borderRadius: 18, cornerShape: "squircle", display: "grid", placeItems: "center", background: "#4A0F1C", color: "#F6E7B4" }}><Timer size={34} strokeWidth={2} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 17, fontWeight: 700, display: "block", color: "#4A0F1C", lineHeight: 1.25 }}>Create a complete profile in 1 minute</span>
            <span className="ff-body" style={{ fontSize: 12.5, color: "#5A474B", display: "block", marginTop: 2 }}>FireFlair puts it on your profile as cards — PDF, Word or a photo. You choose what stays.</span>
          </span>
        </span>
        {status}
        {input}
        <span style={{ display: "flex", justifyContent: "flex-end" }}>
          <Btn variant="wine" disabled={(st && st.busy) || ex.busy} onClick={() => ref.current && ref.current.click()}><Upload size={14} /> Upload CV</Btn>
        </span>
      </div>
      {below}
    </div>
  );
}



/* ==========================================================================
   FF TEAM JOURNEY — one page, short headings, the UI does the explaining:
   1 JOIN THE TEAM   FF Tag + phone -> WhatsApp code -> account       TagSection
                     then an optional password                       PasswordSheet
   2 PROFILE CARD    the card itself — saves automatically            useAutoSave
   3 FF AI data entry      fill the profile from a description or a CV
   4 YOUR PROFILE    every section + Q&A, then Save & Share           SaveShareCard
   …                 marks that one more section exists
   5 WELCOME TO THE TEAM   revealed by Save: the finished Profile Card
   Creating a Tag or a card never makes anything public; sharing does.
   ========================================================================== */

const timeOf = (ms) => new Date(ms).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });



/* Auto-save. Once the account exists every change to the card or profile
   is saved with no button. The profile's parts are watched by reference, so
   recording the save time never triggers another save. */
function useAutoSave() {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const signedIn = state.auth.status === "signedIn";
  const prev = useRef(null);
  useEffect(() => {
    const was = prev.current;
    prev.current = { h: state._hydrated };
    if (!was || was.h !== state._hydrated) return;   // first look, or just loaded — nothing new
    if (!signedIn) return;
    const t = setTimeout(() => {
      PROFILE_ADAPTER.save(state.session.tag, p).then(r => dispatch({ type: "PROFILE", patch: { saved: true, savedAt: r.savedAt } }));
    }, 600);
    return () => clearTimeout(t);
  }, [p.name, p.photo, p.theme, p.records, p.answers, p.categories, p.aiQuestions, signedIn, state._hydrated]);
}



/* Share = send the Profile Card to the person on their verified WhatsApp
   number. It's the deliberate step that turns their card link on. */
function useShareCard() {
  const { state, dispatch } = useStore();
  const [busy, setBusy] = useState(false);
  const tag = state.auth.status === "signedIn" ? (state.auth.tag || state.session.tag) : null;
  const share = async () => {
    if (!tag || busy) return;
    /* v17.4.6.4: the Share menu (Share, WhatsApp, Download PNG, Copy Link) opens straight from the click. */
    window.dispatchEvent(new Event("ff-add"));
    setBusy(true);
    try {
      const r = await PROFILE_ADAPTER.share(tag, state.session.phone);
      const fresh = !(state.profile.xpClaimed || []).includes("publish_profile");
      const first = !state.profile.live;
      const now = Date.now();
      dispatch({ type: "PROFILE", patch: { live: true, saved: true, savedAt: now, sharedAt: now, publishedAt: state.profile.publishedAt || now } });
      dispatch({ type: "PUBLISH_XP" });
      dispatch({ type: "TOAST", toast: `Your profile link is ready to share${fresh ? xpNote(XP_VALUES.task) : ""}` });
      if (first) window.scrollTo(0, 0);
    } finally { setBusy(false); }
  };
  return { share, busy, tag };
}


/* v17.35 note for developers (FF Tag case): the availability check already ignores case: AUTH_ADAPTER.cleanTag
   lowercases before isAvailable compares, and _taken lowercases the taken list, so ALEXG = alexg = taken.
   But cleanTag also lowercases what is shown and saved, so capitals are not kept today. Mr G wants the tag saved
   as typed (ALEXG) with the check run on the lowercase form: that change belongs in auth-adapter.js (keep a
   display form beside the lowercase key); Core must store both and compare on the key. */
/* Optional (the company address uses them; FF Team leaves them out): cleanWith(value) makes the text, freeCheck(text) says whether it is available, minLength and maxLength set the bounds. */
function TagInput({ value, onChange, placeholder = "username", current, check, autoFocus, label = "FF Tag", cleanWith, freeCheck, minLength, maxLength, fit }) {
  const clean = cleanWith ? cleanWith(value) : AUTH_ADAPTER.cleanTag(value);
  const ok = freeCheck ? freeCheck(clean) : AUTH_ADAPTER.isAvailable(clean, current);
  const show = check && clean.length >= (minLength || AUTH_ADAPTER.TAG_MIN);
  return React.createElement("span", {
    className: "ff-userfield"
  }, React.createElement("span", {
    className: "pre"
  }, CARD_DOMAIN, "/"), React.createElement("input", {
    value: clean,
    maxLength: maxLength || AUTH_ADAPTER.TAG_MAX,
    style: fit ? { flex: "none", width: `${Math.max(9, clean.length + 2)}ch` } : undefined,
    onChange: (e) => onChange(e.target.value),
    placeholder,
    "aria-label": label,
    autoComplete: "username",
    autoCapitalize: "none",
    spellCheck: false,
    autoFocus
  }), show && React.createElement("span", {
    className: "st",
    title: ok ? "Available" : "Taken"
  }, ok ? React.createElement(Check, {
    size: 18,
    color: "var(--ok)",
    strokeWidth: 2.6
  }) : React.createElement(X, {
    size: 18,
    color: "var(--bad)",
    strokeWidth: 2.6
  })));
}


function TagNote({ clean, current }) {
  if (clean.length >= AUTH_ADAPTER.TAG_MIN && !AUTH_ADAPTER.isAvailable(clean, current))
    return <span className="ff-body" style={{ display: "block", fontSize: 12.5, color: "var(--bad)", fontWeight: 600, marginTop: 5 }}>{clean} is taken</span>;
  return null;
}


function PasswordSheet({ open, onClose, change }) {
  const { state, dispatch } = useStore();
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (open) {
      setPw("");
      setShow(false);
      setBusy(false);
      setErr(null);
    }
  }, [open]);
  if (!open)
    return null;
  const tag = state.auth.tag || state.session.tag;
  const create = async () => {
    setBusy(true);
    setErr(null);
    try {
      await AUTH_ADAPTER.setPassword(tag, pw);
      dispatch({ type: "SESSION", patch: { passwordSet: true } });
      dispatch({ type: "TOAST", toast: change ? "Password changed" : `Password created — sign in with ${tag} and your password` });
      onClose();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  const skip = () => {
    if (!change)
      dispatch({ type: "TOAST", toast: "No password — you'll sign in with a WhatsApp code" });
    onClose();
  };
  return React.createElement(Sheet, {
    open: true,
    onClose: skip,
    title: change ? "Change your password" : "Create a password?"
  }, React.createElement("p", {
    className: "ff-body",
    style: { marginTop: 0, fontSize: 15 }
  }, "Create a password to sign in with your FF Tag and password on your next visit."), React.createElement(Field, {
    label: "Password"
  }, React.createElement("span", {
    style: { position: "relative", display: "block" }
  }, React.createElement("input", {
    className: "ff-input",
    type: show ? "text" : "password",
    autoComplete: "new-password",
    value: pw,
    autoFocus: FF_FINE_POINTER && (true),
    onChange: (e) => setPw(e.target.value),
    placeholder: "At least 5 characters",
    style: { paddingRight: 50 },
    onKeyDown: (e) => e.key === "Enter" && pw.length >= 5 && !busy && create()
  }), React.createElement("button", {
    type: "button",
    onClick: (e) => {
      e.preventDefault();
      setShow((v) => !v);
    },
    "aria-label": show ? "Hide password" : "Show password",
    style: { position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gold-dk)", display: "flex", padding: 4 }
  }, show ? React.createElement(EyeOff, {
    size: 17
  }) : React.createElement(Eye, {
    size: 17
  })))), React.createElement(Btn, {
    variant: "primary wide",
    disabled: busy || pw.length < 5,
    onClick: create
  }, busy ? React.createElement(Loader2, {
    size: 14,
    className: "ff-spin"
  }) : React.createElement(Lock, {
    size: 14
  }), " ", change ? "Change password" : "Create Password"), React.createElement("div", {
    style: { height: 8 }
  }), React.createElement(Btn, {
    variant: "ghost wide",
    onClick: skip
  }, change ? "Cancel" : "Skip for now"), err && React.createElement("p", {
    className: "ff-body",
    role: "alert",
    style: { color: "var(--bad)", fontSize: 12.5, margin: "10px 0 0" }
  }, err));
}


/* only (v17.34, with boxes): "phone" or "tag" shows just that box — Phone number now sits in Let's get started. */
function AccountSettings({ boxes = false, only } = {}) {
  const { state, dispatch } = useStore();
  const tag = state.auth.tag || state.session.tag;
  const [editing, setEditing] = useState(false);
  const [next, setNext] = useState(tag || "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [pwOpen, setPwOpen] = useState(false);
  const clean = AUTH_ADAPTER.cleanTag(next);
  const ok = AUTH_ADAPTER.isAvailable(clean, tag) && clean !== String(tag || "").toLowerCase();
  const phone = state.session.phone;
  const hasPw = !!state.session.passwordSet;
  const save = async () => {
    setBusy(true);
    setErr(null);
    try {
      const r = await AUTH_ADAPTER.changeTag(tag, clean);
      dispatch({ type: "SESSION", patch: { tag: r.tag } });
      dispatch({ type: "AUTH_SIGNED_IN", tag: r.tag, method: state.auth.method });
      dispatch({ type: "TOAST", toast: `Your FF Tag is now ${pc17Tag(r.tag)} · ${CARD_DOMAIN}/${pc17Tag(r.tag)}` });
      setEditing(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  if (boxes && !editing) return (<>
    {only !== "tag" && <GoldBox21 icon={<WhatsAppIcon size={17} />} title="Phone number" desc={ACCT_DESC21.phone} className="shine ff-wa-pfa">
      <span className="ff-gb21-val"><Check size={15} color="var(--ok)" strokeWidth={2.6} /> {phone || "Number verified"}</span>
    </GoldBox21>}
    {only !== "phone" && <GoldBox21 icon={<Hash size={16} strokeWidth={1.8} />} title="FF Tag" desc={ACCT_DESC21.tag}
      note={<span className="ff-gb21-links">
        <button type="button" className="ff-linkbtn" onClick={() => { setNext(tag); setErr(null); setEditing(true); }}>Change Tag</button>
        <button type="button" className="ff-linkbtn" onClick={() => setPwOpen(true)}>{hasPw ? "Change password" : "Add a password"}</button>
      </span>}>
      <span className="ff-gb21-val">{CARD_DOMAIN}/{String(tag || "").toLowerCase()}</span>
      <PasswordSheet open={pwOpen} change={hasPw} onClose={() => setPwOpen(false)} />
    </GoldBox21>}
  </>);
  return React.createElement("div", null, React.createElement("div", {
    style: { display: "flex", gap: 14, alignItems: "center" }
  }, React.createElement("span", {
    className: "ff-tagbadge"
  }, tag), React.createElement("span", {
    style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }
  }, React.createElement("span", {
    className: "ff-body",
    style: { fontWeight: 700, color: "var(--ink)", overflowWrap: "anywhere" }
  }, CARD_DOMAIN, "/", pc17Tag(tag)), React.createElement("span", {
    className: "ff-body ff-muted",
    style: { fontSize: 12.5, display: "flex", gap: 5, alignItems: "center" }
  }, React.createElement(Check, {
    size: 13,
    color: "var(--ok)",
    strokeWidth: 2.6
  }), " ", phone || "Number verified", hasPw ? " · password set" : ""))), editing ? React.createElement("div", {
    style: { marginTop: 16 }
  }, React.createElement(Field, {
    label: "New FF Tag",
    hint: "3 to 8 letters or numbers."
  }, React.createElement(TagInput, {
    value: next,
    onChange: setNext,
    current: tag,
    check: true,
    autoFocus: FF_FINE_POINTER && (true),
    label: "New FF Tag"
  }), React.createElement(TagNote, {
    clean,
    current: tag
  })), React.createElement("div", {
    style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }
  }, React.createElement(Btn, {
    variant: "primary",
    disabled: busy || !ok,
    onClick: save
  }, busy ? React.createElement(Loader2, {
    size: 13,
    className: "ff-spin"
  }) : React.createElement(Check, {
    size: 13
  }), " Save new Tag"), React.createElement(Btn, {
    variant: "ghost",
    onClick: () => {
      setEditing(false);
      setNext(tag);
      setErr(null);
    }
  }, "Cancel"))) : React.createElement("div", {
    style: { display: "flex", gap: 18, flexWrap: "wrap", marginTop: 12 }
  }, React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => {
      setNext(tag);
      setErr(null);
      setEditing(true);
    }
  }, "Change Tag"), React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => setPwOpen(true)
  }, hasPw ? "Change password" : "Add a password")), err && React.createElement("p", {
    className: "ff-body",
    role: "alert",
    style: { color: "var(--bad)", fontSize: 12.5, margin: "10px 0 0", fontWeight: 600 }
  }, err), React.createElement(PasswordSheet, {
    open: pwOpen,
    change: hasPw,
    onClose: () => setPwOpen(false)
  }));
}


/* v17.21: the descriptions Alex asked to keep (from v17.15), and one for Media. */
const ACCT_DESC21 = {
  phone: "Used to send you bookings via WhatsApp.",
  tag: "Your personal web page, displaying all your profile information.",
  media: "Your first picture is your profile photo. The rest play across the top of your public profile, the best way to show your work.",
};


/* v17.21: a golden account box. The name, the entry box and its button on one line, the description under them. */
/* v17.27: country (dialling) code for the phone number. The closed control shows only the code ("+44"); the list shows
   the country beside it. A native select sits invisibly over the label so phones use their own picker. */
const DIAL_CODES26 = [["+44", "United Kingdom"], ["+353", "Ireland"], ["+33", "France"], ["+34", "Spain"], ["+39", "Italy"], ["+351", "Portugal"], ["+49", "Germany"], ["+31", "Netherlands"], ["+32", "Belgium"], ["+41", "Switzerland"], ["+30", "Greece"], ["+40", "Romania"], ["+48", "Poland"], ["+46", "Sweden"], ["+45", "Denmark"], ["+47", "Norway"], ["+1", "United States / Canada"], ["+61", "Australia"], ["+64", "New Zealand"], ["+27", "South Africa"], ["+971", "United Arab Emirates"], ["+91", "India"], ["+55", "Brazil"], ["+52", "Mexico"]];
function DialCode26({ value, onChange }) {
  return (
    <span className="ff-dial26">
      <span className="v" aria-hidden="true">{value}</span>
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <select aria-label="Country code" autoComplete="tel-country-code" value={value} onChange={(e) => onChange(e.target.value)}>
        {DIAL_CODES26.map(([c, n]) => <option key={c + n} value={c}>{n} ({c})</option>)}
      </select>
    </span>
  );
}

function GoldBox21({ icon, title, count, desc, note, children, line = true, id, className }) {
  return (
    <section className={"ff-gb21" + (className ? " " + className : "")} id={id} aria-label={title}>
      <div className={line ? "ff-gb21-line" : "ff-gb21-head"}>
        <span className="ff-gb21-lb">{icon}<span>{title}</span>{count !== undefined && <span className="ff-gb21-ct">{count}</span>}</span>
        {line ? children : null}
      </div>
      {desc && <p className="ff-gb21-ds">{desc}</p>}
      {!line && children}
      {note}
    </section>
  );
}


/* v17.34: the sign-up state (FF Tag, phone number, country code, WhatsApp code) in one hook, so the Phone number box
   (third in Let's get started) and the FF Tag box (Your Profile Page) share one entry, one Verify and one code step. */
function useJoin21({ inSave = false, top = false, onSignedIn } = {}) {
  const { state, dispatch } = useStore();
  const signedIn = state.auth.status === "signedIn" && !!(state.auth.tag || state.session.tag);
  const suggestion = useMemo(() => AUTH_ADAPTER.suggestTag(state.profile.name), [state.profile.name]);
  const [typed, setTyped] = useState(null);
  const [phone, setPhone] = useState(state.session.phone || "");
  const [stage, setStage] = useState("details");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const [pwOpen, setPwOpen] = useState(false);
  const clean = AUTH_ADAPTER.cleanTag(typed === null ? suggestion : typed);
  const available = AUTH_ADAPTER.isAvailable(clean);
  /* v17.27: country code drop-down in front of the number, +44 by default (as on the live FFTeam.uk). The number sent
     to the adapter is the code plus the national number with its leading 0 dropped: +44 7700 900000. */
  const [dial, setDial] = useState("+44");
  const natDigits = phone.replace(/\D/g, "").replace(/^0+/, "");
  const typedCode = /^\s*(\+|00)/.test(phone);
  const fullPhone = typedCode ? phone.trim() : (natDigits ? `${dial} ${natDigits}` : "");
  const phoneOk = natDigits.length >= (dial === "+44" && !typedCode ? 9 : 6);
  const run = async (fn) => {
    setBusy(true);
    setErr(null);
    try {
      return await fn();
    } catch (e) {
      setErr(e.message);
      return null;
    } finally {
      setBusy(false);
    }
  };
  const send = () => run(() => AUTH_ADAPTER.sendSignupCode(clean, fullPhone)).then((r) => {
    if (r) {
      setStage("code");
      setCode("");
    }
  });
  const verify = () => run(() => AUTH_ADAPTER.verifySignupCode(clean, fullPhone, code)).then((r) => {
    if (!r)
      return;
    dispatch({ type: "SESSION", patch: { tag: r.tag, phone: r.phone, verified: true } });
    /* A review written while signed out posts at sign-up with its own "Review sent to …" toast; keep that one. */
    const draft = !!(state.session && state.session.reviewDraft17);
    dispatch({ type: "AUTH_SIGNED_IN", tag: r.tag, method: r.method });
    if (!draft) dispatch({ type: "TOAST", toast: `${CARD_DOMAIN}/${pc17Tag(r.tag)} is yours` });
    setStage("details");
    setCode("");
    if (inSave || top) {
      if (onSignedIn) onSignedIn();
    } else setPwOpen(true);
  });
  const setTag = (v) => {
    setTyped(v);
    /* Display only: lets the Profile Card address follow the field. Never a real tag. */
    dispatch({ type: "SESSION", patch: { tagDraft: AUTH_ADAPTER.cleanTag(v) } });
  };
  return { signedIn, phone, setPhone, stage, setStage, code, setCode, busy, err, setErr, pwOpen, setPwOpen, clean, available, dial, setDial, fullPhone, phoneOk, send, verify, setTag };
}


/* v17.34: the Phone number entry — third in Let's get started. The same gold box, country code, Verify and WhatsApp
   code step as before; a signed-in member sees the verified number, as in AccountSettings. */
function PhoneBox21({ join: j }) {
  if (j.signedIn) return <AccountSettings boxes only="phone" />;
  return (<>
    {j.stage === "details" ? (
      <GoldBox21 icon={<WhatsAppIcon size={17} />} title="Phone number" desc={ACCT_DESC21.phone} className="shine ff-wa-pfa">
        <DialCode26 value={j.dial} onChange={j.setDial} />
        <input className="ff-gb21-in" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="7700 900000" aria-label="Phone number"
          value={j.phone} onChange={(e) => j.setPhone(e.target.value)} enterKeyHint="send"
          onKeyDown={(e) => e.key === "Enter" && j.available && j.phoneOk && !j.busy && j.send()} />
        <button type="button" className="ff-gb21-btn" disabled={j.busy || !j.available || !j.phoneOk} onClick={j.send}>{j.busy ? <Loader2 size={14} className="ff-spin" /> : null}Verify</button>
      </GoldBox21>
    ) : (
      <GoldBox21 className="shine ff-wa-pfa" icon={<WhatsAppIcon size={17} />} title="WhatsApp code" desc={`Sent to ${j.fullPhone} · any six digits in this preview`}
        note={<span className="ff-gb21-links">
          <button type="button" className="ff-linkbtn" onClick={() => { j.setStage("details"); j.setCode(""); j.setErr(null); }}>Change number</button>
          <button type="button" className="ff-linkbtn" disabled={j.busy} onClick={j.send}>Resend code</button>
        </span>}>
        <input className="ff-gb21-in code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={j.code}
          autoFocus={FF_FINE_POINTER} onChange={(e) => j.setCode(e.target.value.replace(/\D/g, ""))} placeholder="000000" aria-label="Code from WhatsApp"
          onKeyDown={(e) => e.key === "Enter" && j.code.length === 6 && !j.busy && j.verify()} />
        <button type="button" className="ff-gb21-btn" disabled={j.busy || j.code.length < 6} onClick={j.verify}>{j.busy ? <Loader2 size={14} className="ff-spin" /> : <Check size={14} />} Create</button>
      </GoldBox21>
    )}
    {j.err && <p className="ff-body" role="alert" style={{ color: "var(--bad)", fontSize: 13, margin: "10px 0 0", fontWeight: 600 }}>{j.err}</p>}
  </>);
}


function TagSection({ inSave = false, top = false, onSignedIn, join } = {}) {
  const own = useJoin21({ inSave, top, onSignedIn });
  const { signedIn, phone, setPhone, stage, setStage, code, setCode, busy, err, setErr, pwOpen, setPwOpen, clean, available, send, verify } = join || own;
  /* v17.34: the FF Tag box only — the Phone number entry is now third in Let's get started (PhoneBox21). FF Tag sits
     left of Media on desktop, above it on a phone. */
  if (top) {
    const jt = join || own;
    return (
      <div id="ff-sec-tag" className="ff-tagsection ff-acct19 ff-acct21">
        {signedIn ? <AccountSettings boxes only="tag" /> : stage === "details" ? (
          <GoldBox21 icon={<Hash size={16} strokeWidth={1.8} />} title="FF Tag" desc={ACCT_DESC21.tag} note={<TagNote clean={clean} />}>
            <TagInput value={clean} check onChange={jt.setTag} />
          </GoldBox21>
        ) : (
          <GoldBox21 icon={<Hash size={16} strokeWidth={1.8} />} title="FF Tag" desc={ACCT_DESC21.tag}>
            <span className="ff-gb21-val">{CARD_DOMAIN}/{clean}</span>
          </GoldBox21>
        )}
        <PasswordSheet open={pwOpen} onClose={() => setPwOpen(false)} />
      </div>
    );
  }
  return React.createElement("div", {
    id: "ff-sec-tag",
    className: "ff-tagsection"
  }, signedIn ? React.createElement(AccountSettings, null) : stage === "details" ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "ff-tagrow"
  }, React.createElement(Field, {
    label: "FF Tag",
    hint: top ? "Your personal web page, displaying all your profile information." : undefined
  }, React.createElement(TagInput, {
    value: clean,
    onChange: (join || own).setTag,
    check: true
  }), React.createElement(TagNote, {
    clean
  })), React.createElement(Field, {
    label: "Phone number",
    hint: top ? "Used to send you bookings via WhatsApp." : undefined
  }, React.createElement("input", {
    className: "ff-input",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "+44 7700 900000",
    value: phone,
    onChange: (e) => setPhone(e.target.value),
    onKeyDown: (e) => e.key === "Enter" && available && phoneOk && !busy && send()
  }))), React.createElement(Btn, {
    variant: "primary wide",
    disabled: busy || !available || !phoneOk,
    onClick: send
  }, busy ? React.createElement(Loader2, {
    size: 14,
    className: "ff-spin"
  }) : null, inSave ? "Save" : "Continue")) : React.createElement(React.Fragment, null, React.createElement(Field, {
    label: "WhatsApp code",
    hint: `Sent to ${phone} · any six digits in this preview`
  }, React.createElement("input", {
    className: "ff-input ff-tagin",
    inputMode: "numeric",
    autoComplete: "one-time-code",
    maxLength: 6,
    value: code,
    autoFocus: FF_FINE_POINTER && (true),
    onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
    placeholder: "000000",
    "aria-label": "Code from WhatsApp",
    onKeyDown: (e) => e.key === "Enter" && code.length === 6 && !busy && verify()
  })), React.createElement(Btn, {
    variant: "primary wide",
    disabled: busy || code.length < 6,
    onClick: verify
  }, busy ? React.createElement(Loader2, {
    size: 14,
    className: "ff-spin"
  }) : React.createElement(Check, {
    size: 14
  }), inSave ? " Save" : " Create"), React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10, flexWrap: "wrap" }
  }, React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => {
      setStage("details");
      setCode("");
      setErr(null);
    }
  }, "Change"), React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    disabled: busy,
    onClick: send
  }, "Resend code"))), err && React.createElement("p", {
    className: "ff-body",
    role: "alert",
    style: { color: "var(--bad)", fontSize: 13, margin: "10px 0 0", fontWeight: 600 }
  }, err), React.createElement(PasswordSheet, {
    open: pwOpen,
    onClose: () => setPwOpen(false)
  }));
}



/* "Available for hire?" uses the one rule for a complete profile, profileBasics17 (src/state/invite17.js):
   signed in, saved once, a name, a photo and one confirmed profession. The same rule decides when an inviter is rewarded. */
const hireReady17 = (state) => profileBasics17(state);


/* SAVE & SHARE — at the foot of the profile. The profile already saves
   itself; Save is the explicit "done" that opens Section 5. Share sends
   the finished card to the person on WhatsApp. */
function SaveShareCard({ onSaved }) {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const signedIn = state.auth.status === "signedIn";
  const { share, busy, tag } = useShareCard();
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  /* v17.40: an existing member edits on this same page; Save takes them back to their finished profile, as the bar's Save does. */
  const leaveLive = () => { if (p.live && state.ed17 === "team") { dispatch({ type: "V11_SET", patch: { ed17: null } }); window.scrollTo(0, 0); } };
  const save = () => {
    if (!signedIn) {
      const el = document.getElementById("ff-sec-phone") || document.getElementById("ff-sec-tag");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => { const i = document.querySelector('#ff-sec-phone input[type="tel"], #ff-sec-phone input, #ff-sec-tag input'); if (i) i.focus({ preventScroll: true }); }, 400);
      dispatch({ type: "TOAST", toast: "Create your FF Tag first" });
      return;
    }
    PROFILE_ADAPTER.save(tag, p).then(r => {
      dispatch({ type: "PROFILE", patch: { saved: true, savedAt: r.savedAt, finishedAt: p.finishedAt || r.savedAt } });
      dispatch({ type: "TOAST", toast: "Saved" });
      dispatch({ type: "PE_DONE" });
      leaveLive();
      if (onSaved) onSaved();
    });
  };
  const blocker = !signedIn ? "Create your FF Tag first."
    : !cardReady ? "Add a profession to publish." : null;
  /* v1.2: Publish saves and publishes on FF Team in one step; Welcome to the
     Team then opens with the confirmation. */
  const publish = () => {
    if (!signedIn) { save(); return; }
    if (!cardReady) { dispatch({ type: "TOAST", toast: "Add a profession to publish" }); return; }
    saveWithIntro17(tag, p, state).then(r => {
      const now = Date.now();
      dispatch({ type: "PROFILE", patch: { saved: true, savedAt: r.savedAt, finishedAt: p.finishedAt || r.savedAt, published: true, publishedAt: p.publishedAt || now, introduction: r.intro || null } });
      dispatch({ type: "PE_DONE" });
      leaveLive();
      if (!p.publishedAt) {
        dispatch({ type: "PUBLISH_XP" });
        P1_JUST_PUBLISHED.v = true;
        setTimeout(() => window.dispatchEvent(new Event("ff-published")), 0);
      } else dispatch({ type: "TOAST", toast: "Saved" });
      if (onSaved) onSaved();
    });
  };
  useEffect(() => { const h = () => publish(); window.addEventListener("ff-save", h); return () => window.removeEventListener("ff-save", h); });
  const hireOk = hireReady17(state);
  const hire = () => {
    if (!hireOk) return;
    dispatch({ type: "ROLE", role: "team" });
    dispatch({ type: "TAB", tab: "bookings" });
    window.scrollTo(0, 0);
  };

  return (
    <div id="ff-sec-share" className="ff-publishcard" style={{ marginTop: 26 }}>
      <div className="ff-save17-row">
        <button type="button" className="ff-btn gold ff-save17" onClick={save}>Save</button>
        <button type="button" className="ff-btn ff-save17 hire17" onClick={hire} disabled={!hireOk} aria-disabled={!hireOk}>Available for hire?</button>
      </div>
      {blocker && signedIn && <p style={{ margin: "10px 0 0", fontSize: 12.5, color: "rgba(244,239,228,.72)", textAlign: "center" }}>{blocker}</p>}
      {signedIn && p.savedAt && <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(244,239,228,.66)", display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }}>
        <Check size={13} color="#8FDCAE" strokeWidth={2.4} /> Saved {timeOf(p.savedAt)}{p.publishedAt && <> · <button type="button" className="ff-livelink17" onClick={() => { dispatch({ type: "VIEW", id: "me", guest: true }); window.scrollTo(0, 0); }}><Eye size={13} /> Live · view</button></>}</p>}
    </div>
  );
}



/* After sharing: the card is on their WhatsApp, and can go into their wallet. */
function PublishedPanel() {
  const { state } = useStore();
  const t = state.session.tag;
  return (
    <div className="ff-savecard" style={{ marginTop: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span className="ff-savecard-icon"><Check size={18} /></span>
        <span className="ff-h2" style={{ fontSize: 19, color: "#241B07" }}>Your Profile Card is shared</span>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 14.5, lineHeight: 1.5, color: "#3A2E10" }}>
        We've sent your Profile Card to you on WhatsApp{state.session.phone ? ` (${state.session.phone})` : ""}, so you can share it with customers and contacts and use it to take bookings. Share it again any time.
      </p>
      <ShareStack />
    </div>
  );
}



/* A section heading set large — Section 1 (Join the Team) and Section 5
   (Welcome to the Team) bookend the page. */
function BigStepHead({ n, title, done, id }) {
  return (
    <div id={id || `ff-step-${n}`} className="ff-stephead" style={{ display: "flex", gap: 12, alignItems: "center", margin: "22px 0 14px", scrollMarginTop: 80 }}>
      <span className="ff-stepnum" data-done={done ? "1" : "0"} style={{ cursor: "default" }}>{done ? <Check size={14} /> : String(n).padStart(2, "0")}</span>
      <h1 className="ff-h1" style={{ margin: 0, minWidth: 0 }}>{title}</h1>
    </div>
  );
}



/* The GPT mark, beside "Talk or type to GPT". */
function GptLogo17({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" aria-hidden="true" focusable="false">
      <path d="M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z" />
    </svg>
  );
}


/* Book an interview: a short call where FireFlair fills the profile out with you. Opens the booking page with your details filled in. */
function InterviewBook17({ notes, onClose, name, title = "Book an interview" }) {
  const { state, dispatch } = useStore();
  const [phone, setPhone] = useState(state.session.phone || "");
  const ok = phone.replace(/\D/g, "").length >= 9;
  const cal = V101.support20Url();
  let href = cal;
  try {
    const u = new URL(cal);
    if (name || state.profile.name) u.searchParams.set("name", name || state.profile.name);
    if (ok) u.searchParams.set("attendeePhoneNumber", phone.replace(/[^\d+]/g, ""));
    if (notes && notes.trim()) u.searchParams.set("notes", notes.trim().slice(0, 500));
    href = u.toString();
  } catch (e) { /* keep the plain link */ }
  const go = (e) => {
    if (!ok) { e.preventDefault(); return; }
    dispatch({ type: "SESSION", patch: { phone: phone.trim() } });
    setTimeout(onClose, 150);
  };
  return (
    <Sheet open center onClose={onClose} title={title}>
      <div className="ff-ib17">
        <Field label="Phone number"><input className="ff-input" type="tel" inputMode="tel" autoComplete="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <a className={"ff-btn gold ff-bigcv17" + (ok ? "" : " off")} href={ok ? href : undefined} aria-disabled={!ok} target="_blank" rel="noopener noreferrer" onClick={go}><Calendar size={16} /> Choose a time</a>
      </div>
    </Sheet>
  );
}


/* Create a profile: one box. v1.16 (Alex, 18 Nov 13:58): Phone number first, Talk or type to GPT second, the CV third.
   (v17.34: the Phone number took Book an interview's place; InterviewBook17 stays for FF Staff's Book a meeting.) */
function StartBox17({ join }) {
  const [text, setText] = useState("");
  const ex = useExtraction({ withAnswers: true });
  const run = (v) => { if (String(v || "").trim().length < 3 || ex.busy) return; ex.start({ text: v }); };
  return (
    <div id="ff-sec-ffai" className="ff-start17">
      {join && (
        <section id="ff-sec-phone" className="ff-way17 ff-way17-phone">
          <div className="ff-way17-wide"><PhoneBox21 join={join} /></div>
        </section>
      )}
      <section className="ff-way17 ff-way17-gpt">
        <h3 className="ff-way17-ctl"><GptLogo17 size={18} /> Talk or type to GPT</h3>
        <p className="ff-way17-line"><span>Tell us about yourself and we'll build the profile for you.</span></p>
        <div className="ff-way17-wide">
          <FFAI bare plain multiline tint={false} tagIcon title="Tell us who you are" noMicStatus placeholder="I'm a bartender…" query={text} onQuery={setText} onSubmit={run} submitLabel="Fill out my profile">
            <ExtractionStatus ex={ex} />
            {ex.st.phase === "review" && <ImportToEdit key={ex.st.result.report && ex.st.result.report.ms} result={ex.st.result} onDone={() => { ex.reset(); setText(""); }} />}
          </FFAI>
        </div>
      </section>
      <CVUpload17 />
    </div>
  );
}


/* v1.16 CV upload, built from the live FF Team flow (CVPanel.tsx -> useFfai -> FfaiReview.tsx; the backend's
   ffai prompt and suggestions, ported in src/utils/ffai-cv.js). Choose a file -> a progress bar while it is read
   and extracted -> the box extends with what was found, by section, each item Yes / No -> Add to my profile.
   The CV itself is never stored: the file is read in the browser and dropped (the live site keeps a signed-in
   member's CV privately; that is the backend's job, through CV_ADAPTER). */
const FFAI_GROUPS17 = [
  ["profession", "professions"], ["qualification", "qualifications"], ["skill", "skills"], ["interest", "interests"],
  ["location", "locations"], ["language", "languages"], ["experience", "experience"],
];


function ffaiSubLine17(s) {
  const d = s.details || {};
  if (s.section === "experience") return [d.employer, d.location, [d.start, d.end].filter(Boolean).join(" – ")].filter(Boolean).join(" · ");
  if (s.section === "qualification") return [d.issuer, d.year].filter(Boolean).join(" · ");
  if (s.section === "language") return s.proficiency || "";
  if (s.section === "profession") return [s.level ? professionLevelTitle(s.level) : "", s.description].filter(Boolean).join(" · ");
  return "";
}


function CVUpload17() {
  const { state, dispatch } = useStore();
  const fileRef = useRef(null);
  const ctl = useRef(null);
  const last = useRef(null);
  const sref = useRef(state); sref.current = state;
  const [st, setSt] = useState({ phase: "idle" });
  const [pct, setPct] = useState(0);
  const [pick, setPick] = useState({});
  useEffect(() => { getSample(); return () => { if (ctl.current) ctl.current.abort(); }; }, []);
  /* The bar keeps moving while FireFlair reads: towards 92% until the answer is in. */
  useEffect(() => {
    if (st.phase !== "reading" && st.phase !== "thinking") return;
    const t = setInterval(() => setPct(p => Math.min(st.phase === "reading" ? 28 : 92, p + Math.max(0.4, ((st.phase === "reading" ? 30 : 94) - p) * 0.035))), 300);
    return () => clearInterval(t);
  }, [st.phase]);

  const run = async (file) => {
    if (ctl.current) ctl.current.abort();
    const c = ctl.current = new AbortController();
    last.current = file;
    const problem = ffaiFileError17(file);
    if (problem) { setSt({ phase: "error", msg: problem, canRetry: false }); return; }
    setPct(4);
    setSt({ phase: "reading", file: file.name });
    let doc;
    try { doc = await CV_READER.read(file); }
    catch (e) {
      if (c.signal.aborted) return;
      setSt({ phase: "error", msg: e.code ? e.message : "This file couldn't be read. Save it again as a PDF or Word file and upload that.", canRetry: false });
      return;
    }
    if (c.signal.aborted) return;
    setPct(p => Math.max(p, 30));
    setSt({ phase: "thinking", file: file.name });
    try {
      const x = await CV_ADAPTER.ffaiExtract(doc, {
        profile: sref.current.profile, signal: c.signal,
        onProgress: (chars) => { if (!c.signal.aborted) setPct(p => Math.max(p, Math.min(92, 30 + 62 * (1 - Math.exp(-chars / 5000))))); },
      });
      if (c.signal.aborted) return;
      try { console.info("[FireFlair] FF AI CV extraction", x); } catch (e) { /* no console */ }
      const ids = [
        ...(x.name ? ["name"] : []), ...(x.about_me ? ["about_me"] : []),
        ...Object.values(x.sections).flat().filter(s => !s.already_on_profile).map(s => s.id),
        ...x.answers.map(a => a.id),
      ];
      if (!ids.length) {
        setSt({ phase: "idle" });
        dispatch({ type: "TOAST", toast: "Nothing new found in your CV" });
        return;
      }
      /* As on the live review: everything new starts ticked (Yes). */
      setPick(Object.fromEntries(ids.map(id => [id, true])));
      setPct(100);
      setTimeout(() => { if (!c.signal.aborted) setSt({ phase: "review", file: file.name, x }); }, 280);
    } catch (e) {
      if (c.signal.aborted || e.code === "cancelled") return;
      const retry = !["unreadable", "unavailable", "refused", "not_granted", "prompt_too_large"].includes(e.code);
      setSt({ phase: "error", msg: e.message || cvxCopy(e.code), canRetry: retry });
    }
  };

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (f) run(f);
  };

  const add = () => {
    const x = st.x;
    const ids = Object.keys(pick).filter(id => pick[id]);
    const p = sref.current.profile;
    const out = ffaiApplyLocal17(x, ids, p, { origin: "CV", location: st.file || "CV" });
    Object.values(out.byCategory).forEach(list => list.forEach(r => { r.verified = false; }));
    if (Object.keys(out.byCategory).length) dispatch({ type: "RECORDS_MERGE", byCategory: out.byCategory });
    if (Object.keys(out.patch).length) dispatch({ type: "PROFILE", patch: out.patch });
    out.answers.forEach(a => dispatch({ type: "ANSWER", qid: a.qid, value: a.value }));
    /* Then as the Talk or type import does (ImportToEdit): the sections open with the new cards in them. */
    dispatch({ type: "PE_START" });
    Object.keys(out.byCategory).forEach(cat => dispatch({ type: "TOGGLE_CATEGORY", key: `edit_attr_${cat}`, visible: true }));
    const n = out.summary.saved;
    dispatch({ type: "TOAST", toast: n ? `${n} added to your profile` : "Nothing added" });
    setSt({ phase: "idle" });
    setPick({});
    setTimeout(() => {
      const first = Object.keys(out.byCategory)[0];
      const el = document.getElementById(first ? `ff-sec-${first}` : "ff-sec-card");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
  };

  const yn = (id, label) => (
    <span className="yn" role="group" aria-label={label}>
      <button type="button" className={pick[id] ? "on" : ""} aria-pressed={!!pick[id]} onClick={() => setPick(k => ({ ...k, [id]: true }))}>Yes</button>
      <button type="button" className={!pick[id] ? "on" : ""} aria-pressed={!pick[id]} onClick={() => setPick(k => ({ ...k, [id]: false }))}>No</button>
    </span>
  );
  const row = (id, title, sub, opts = {}) => (
    <div key={id} className={"it" + (opts.wide ? " wide" : "") + (opts.have ? " have" : "")}>
      <span className="tx"><b>{title}</b>{sub ? <small>{sub}</small> : null}</span>
      {opts.have ? <span className="hv"><Check size={14} strokeWidth={2.4} /> On your profile</span> : yn(id, title)}
    </div>
  );

  const x = st.phase === "review" ? st.x : null;
  const chosen = x ? Object.values(pick).filter(Boolean).length : 0;
  const busy = st.phase === "reading" || st.phase === "thinking";
  return (
    <section className={"ff-way17 ff-way17-cv" + (x ? " open" : "")}>
      <input ref={fileRef} type="file" accept={FFAI_FILE_ACCEPT17} onChange={onFile} style={{ display: "none" }} />
      <div className="ff-way17-ctl">
        <div className="ff-cvinl17">
          {busy ? (
            <div className="ff-cvbar17" role="progressbar" aria-label={`Reading ${st.file}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct)}>
              <span className="hd"><FileText size={15} aria-hidden="true" /><span className="nm">{st.file}</span><span className="pc">{Math.round(pct)}%</span></span>
              <span className="tr"><i style={{ width: `${pct}%` }} /></span>
            </div>
          ) : x ? (
            <div className="ff-cvbar17 done">
              <span className="hd"><FileText size={15} aria-hidden="true" /><span className="nm">{st.file}</span><span className="pc"><Check size={14} strokeWidth={2.4} /></span></span>
              <span className="tr"><i style={{ width: "100%" }} /></span>
            </div>
          ) : (
            <Btn variant="gold ff-bigcv17" onClick={() => fileRef.current && fileRef.current.click()}><Upload size={16} strokeWidth={2.2} /> Upload CV</Btn>
          )}
        </div>
      </div>
      <p className="ff-way17-line"><Timer size={16} strokeWidth={2.2} aria-hidden="true" /><span>Create your profile in &lt;1 minute</span></p>
      {st.phase === "error" && (
        <div className="ff-way17-wide">
          <div className="ff-cverr" role="alert">
            <AlertCircle size={17} style={{ flex: "none", marginTop: 1 }} />
            <span style={{ flex: 1, minWidth: 0 }}>{st.msg}</span>
            {st.canRetry && last.current && <Btn variant="sm ghost" onClick={() => run(last.current)}><RotateCcw size={12} /> Try again</Btn>}
            <button className="ff-cverr-x" aria-label="Dismiss" onClick={() => setSt({ phase: "idle" })}><X size={15} /></button>
          </div>
        </div>
      )}
      {x && (
        <div className="ff-way17-wide">
          <div className="ff-cvok17">
            {(x.name || x.about_me) && (
              <section className="grp">
                {x.name && (<><h4>Name</h4>{row("name", x.name.value, x.name.current ? `Now: ${x.name.current}` : "")}</>)}
                {x.about_me && (<><h4>About</h4>{row("about_me", "About me", x.about_me.value, { wide: true })}</>)}
              </section>
            )}
            {FFAI_GROUPS17.map(([sec, cat]) => {
              const list = x.sections[sec] || [];
              if (!list.length) return null;
              return (
                <section key={sec} className="grp">
                  <h4>{BASE_CATEGORIES[cat].label}</h4>
                  {list.map(s => row(s.id, s.title, ffaiSubLine17(s), { have: s.already_on_profile }))}
                </section>
              );
            })}
            {x.answers.length > 0 && (
              <section className="grp">
                <h4>Questions</h4>
                {x.answers.map(a => row(a.id, a.question_text, a.changes_existing ? `${a.answer} (now: ${a.current_answer})` : a.answer))}
              </section>
            )}
            {(x.unreadable.length > 0 || (x.input && x.input.truncated)) && (
              <ul className="nt">
                {x.input && x.input.truncated && <li>Only the first part of this CV was read.</li>}
                {x.unreadable.map(u => <li key={u}>{u}</li>)}
              </ul>
            )}
            <Btn variant="gold wide" disabled={!chosen} onClick={add}><Check size={15} strokeWidth={2.4} /> Add to my profile{chosen ? ` (${chosen})` : ""}</Btn>
          </div>
        </div>
      )}
    </section>
  );
}


/* v17.34: true where the page shows About Me above the tabs (the builder), so the Overview tab leaves its copy out. */
const ABOUT_TOP34 = createContext(false);


function ProfileBuilder() {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const me = meAsStaff(p, state.session);
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const signedIn = state.auth.status === "signedIn";
  const finished = signedIn && !!p.finishedAt;
  /* v17.40: an existing member editing a live profile sees the same page; Welcome to the Team is only for the first save. */
  const editingLive = !!p.live && !!(state.profileEdit && state.profileEdit.on);
  const join = useJoin21({ top: true });
  const toWelcome = () => setTimeout(() => {
    const el = document.getElementById("ff-sec-welcome");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
  return (
    <div>
      <InviteBanner17 />
      <div className="ff-eyebrow">FF Team · Profile</div>

      <div className="ff-journey">
        <BigStepHead n={1} title="Let's get started" done={hasCV(p) || cardReady} />
        <StartBox17 join={join} />

        <BigStepHead n={2} title="Your Profile Card" done={cardReady} />
        <div id="ff-sec-card"><CardBuilder /></div>

        <BigStepHead n={3} title="Your Profile Page" done={false} />
        {/* v17.34: FF Tag | Media (stacked on a phone), then About Me, then the tabs. */}
        <div className="ff-tm34">
          <TagSection top join={join} />
          <CreatorMedia />
        </div>
        <ABOUT_TOP34.Provider value={true}>
          <CreatorAboutMe top />
          <ProfileEditTabs person={me} />
        </ABOUT_TOP34.Provider>
        <PE2QA />
      </div>

      {/* Section 4 → Save & Share → Section 5. v16.11: everything stays on the
          left-hand line. Section 5 sits level with the middle of Save & Share,
          with the line and dashes running down beneath it until you save;
          then the page extends and Section 5 opens below. */}
      <div className={`ff-finale${finished ? " open" : ""}`}>
        <div className="ff-s5row">
          {!finished && (
            <div className="ff-s5mark" aria-hidden="true">
              <span className="ff-stepnum closed" aria-hidden="true">04</span>
            </div>
          )}
          <SaveShareCard onSaved={toWelcome} />
        </div>
        {/* v17.40: no card preview here (its Share and wallet buttons went past three buttons); the finished card shows in Welcome to the Team. */}
        {finished && !editingLive && <WelcomeSection me={me} />}
      </div>
      <NeedHelp34 />
    </div>
  );
}


/* v17.35: Need help? Book a meeting — the old Book an interview box (same burgundy button, same booking sheet),
   now at the very bottom of the profile page. Self-contained so the complete-profile page can render it too. */
function NeedHelp34() {
  const [book, setBook] = useState(false);
  if (!V101.support20Url()) return null;
  return (
    <div className="ff-start17 ff-help34">
      <section className="ff-way17 ff-way17-int">
        <div className="ff-way17-ctl"><Btn variant="ghost ff-bigcv17" onClick={() => setBook(true)}><Calendar size={16} /> Book a meeting</Btn></div>
        {/* pfa (Alex 03:29): the earlier Book an interview wording, under the heading Need help? */}
        <div className="ff-help34-t"><h3 className="ff-help34-h">Need help?</h3><p className="ff-way17-line"><span>Meet the FireFlair team and ask us anything.</span></p></div>
      </section>
      {book && <InterviewBook17 title="Book a meeting" onClose={() => setBook(false)} />}
    </div>
  );
}



/* SECTION 5 — Welcome to the Team. The finished card, then the main action
   (Publish on FF Party), then Add FF and the wallet passes. */
function WelcomeSection({ me }) {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const t = state.session.tag;
  const [published, setPublished] = useState(() => P1_JUST_PUBLISHED.v);
  useEffect(() => { P1_JUST_PUBLISHED.v = false; const h = () => setPublished(true); window.addEventListener("ff-published", h); return () => window.removeEventListener("ff-published", h); }, []);
  const publish = () => {
    const first = !p.publishedAt;
    dispatch({ type: "PROFILE", patch: { published: true, publishedAt: p.publishedAt || Date.now() } });
    if (first) dispatch({ type: "PUBLISH_XP" });
    setPublished(true);
  };
  const viewAsGuest = () => { setPublished(false); dispatch({ type: "VIEW", id: "me", guest: true }); window.scrollTo(0, 0); };
  return (
    <div className="ff-s5open">
      <div id="ff-sec-welcome" className="ff-stephead ff-s5head">
        <span className="ff-stepnum" data-done="1" style={{ cursor: "default" }}><Check size={14} /></span>
        <h1 className="ff-h1" style={{ margin: 0, minWidth: 0, fontSize: "clamp(20px, 5.6vw, 26px)" }}>Welcome to the Team</h1>
      </div>
      <PlayerCard person={me} format="full" themeKey={p.theme} />
      {/* v1.3.2: Publish lives beside Save; here only the photo prompt (if
          needed), then Share and the two wallets. */}
      <div className="ff-welcome-acts">
        <P1PhotoPrompt />
        <ShareStack />
      </div>
      {published && (
        <Sheet open onClose={() => setPublished(false)} title="Your profile is published">
          <div className="ff-confirm">
            <span className="ff-confirm-ic ok"><Globe size={22} /></span>
            <p className="ff-confirm-main">We've published your profile as a website.</p>
            <p className="ff-body" style={{ margin: 0 }}>See it the way a guest does: your Profile Card first, then your work, network, reviews and the rest of your profile.</p>
            <div className="ff-confirm-acts">
              <Btn variant="primary wide" onClick={viewAsGuest}><Eye size={14} /> Click here to view it as a guest</Btn>
            </div>
            <p className="ff-publishnote">
              For now we're publishing on FF Team, to help build the network. Once FF Party goes live, your profile will be ready for B2C bookings.
            </p>
          </div>
        </Sheet>
      )}
    </div>
  );
}


/* FF Staff company profile, step 3: a meeting instead of typing a description. Opens the same booking page as the FF Team interview. */
function CompanyMeeting17() {
  const { state } = useStore();
  const [book, setBook] = useState(false);
  if (!V101.support20Url()) return null;
  return (
    <div className="ff-start17 ff-comeet17">
      <Btn variant="sm" onClick={() => setBook(true)}><Calendar size={14} /> Book a meeting</Btn>
      {book && <InterviewBook17 name={(state.company || {}).name} title="Book a meeting" onClose={() => setBook(false)} />}
    </div>
  );
}
