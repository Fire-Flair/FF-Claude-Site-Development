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
    if (nd.name !== d.name || nd.photo !== d.photo) dispatch({ type: "PROFILE", patch: { name: nd.name, photo: nd.photo } });
    if (String(nd.name || "").trim() && (nd.professions || []).length && !(state.profile.xpClaimed || []).includes("create_card")) {
      dispatch({ type: "CARD_CREATED_XP" });
      dispatch({ type: "TOAST", toast: `Profile Card created${xpNote(XP_VALUES.task)}` });
    }
  };
  return (
    <>
      <EditablePlayerCard draft={d} setDraft={setD} themeKey={state.profile.theme}
        tag={state.session.tag || "username"} tier={state.profile.tier} level={state.profile.level}
        onPhoto={(url) => setD(x => ({ ...x, photo: url }))} />
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", margin: "16px 0 4px" }}>
        {Object.entries(THEMES).map(([k, th]) => (
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


function CVPanel() {
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
    /* v1.01: straight from the click, so the new tab isn't blocked as a popup. */
    window.open(`https://wa.me/?text=${encodeURIComponent(`${String(state.profile.name || "").trim() ? String(state.profile.name).trim() + " on FireFlair" : "My FireFlair Profile Card"}: ${CARD_DOMAIN}/${tag}`)}`, "_blank", "noopener,noreferrer");
    setBusy(true);
    try {
      const r = await PROFILE_ADAPTER.share(tag, state.session.phone);
      const fresh = !(state.profile.xpClaimed || []).includes("publish_profile");
      const first = !state.profile.live;
      const now = Date.now();
      dispatch({ type: "PROFILE", patch: { live: true, saved: true, savedAt: now, sharedAt: now, publishedAt: state.profile.publishedAt || now } });
      dispatch({ type: "PUBLISH_XP" });
      dispatch({ type: "TOAST", toast: `Your profile link is ready to send on WhatsApp${fresh ? xpNote(XP_VALUES.task) : ""}` });
      if (first) window.scrollTo(0, 0);
    } finally { setBusy(false); }
  };
  return { share, busy, tag };
}


function TagInput({ value, onChange, placeholder = "username", current, check, autoFocus, label = "FF Tag" }) {
  const clean = AUTH_ADAPTER.cleanTag(value);
  const ok = AUTH_ADAPTER.isAvailable(clean, current);
  const show = check && clean.length >= AUTH_ADAPTER.TAG_MIN;
  return React.createElement("span", {
    className: "ff-userfield"
  }, React.createElement("span", {
    className: "pre"
  }, CARD_DOMAIN, "/"), React.createElement("input", {
    value: clean,
    maxLength: AUTH_ADAPTER.TAG_MAX,
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


function AccountSettings() {
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
      dispatch({ type: "TOAST", toast: `Your FF Tag is now ${r.tag} · ${CARD_DOMAIN}/${r.tag}` });
      setEditing(false);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };
  return React.createElement("div", null, React.createElement("div", {
    style: { display: "flex", gap: 14, alignItems: "center" }
  }, React.createElement("span", {
    className: "ff-tagbadge"
  }, tag), React.createElement("span", {
    style: { minWidth: 0, display: "flex", flexDirection: "column", gap: 3 }
  }, React.createElement("span", {
    className: "ff-body",
    style: { fontWeight: 700, color: "var(--ink)", overflowWrap: "anywhere" }
  }, CARD_DOMAIN, "/", tag), React.createElement("span", {
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


function TagSection() {
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
  const phoneOk = phone.replace(/\D/g, "").length >= 9;
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
  const send = () => run(() => AUTH_ADAPTER.sendSignupCode(clean, phone)).then((r) => {
    if (r) {
      setStage("code");
      setCode("");
    }
  });
  const verify = () => run(() => AUTH_ADAPTER.verifySignupCode(clean, phone, code)).then((r) => {
    if (!r)
      return;
    dispatch({ type: "SESSION", patch: { tag: r.tag, phone: r.phone, verified: true } });
    dispatch({ type: "AUTH_SIGNED_IN", tag: r.tag, method: r.method });
    dispatch({ type: "TOAST", toast: `${CARD_DOMAIN}/${r.tag} is yours` });
    setStage("details");
    setCode("");
    setPwOpen(true);
  });
  return React.createElement("div", {
    id: "ff-sec-tag",
    className: "ff-tagsection"
  }, signedIn ? React.createElement(AccountSettings, null) : stage === "details" ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: "ff-tagrow"
  }, React.createElement(Field, {
    label: "FF Tag"
  }, React.createElement(TagInput, {
    value: clean,
    onChange: setTyped,
    check: true
  }), React.createElement(TagNote, {
    clean
  })), React.createElement(Field, {
    label: "Phone number"
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
  }) : React.createElement(WhatsAppIcon, {
    size: 15
  }), " Continue"), React.createElement("p", {
    className: "ff-body",
    style: { fontSize: 13, margin: "10px 0 0", textAlign: "center" }
  }, React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => window.dispatchEvent(new Event("ff-login"))
  }, "I already have a Tag"))) : React.createElement(React.Fragment, null, React.createElement(Field, {
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
  }), " Create"), React.createElement("div", {
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



/* SAVE & SHARE — at the foot of the profile. The profile already saves
   itself; Save is the explicit "done" that opens Section 5. Share sends
   the finished card to the person on WhatsApp. */
function SaveShareCard({ onSaved }) {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const signedIn = state.auth.status === "signedIn";
  const { share, busy, tag } = useShareCard();
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const save = () => {
    if (!signedIn) {
      const el = document.getElementById("ff-sec-tag");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => { const i = document.querySelector('#ff-sec-tag input'); if (i) i.focus({ preventScroll: true }); }, 400);
      dispatch({ type: "TOAST", toast: "Create your FF Tag first" });
      return;
    }
    PROFILE_ADAPTER.save(tag, p).then(r => {
      dispatch({ type: "PROFILE", patch: { saved: true, savedAt: r.savedAt, finishedAt: p.finishedAt || r.savedAt } });
      dispatch({ type: "TOAST", toast: "Saved" });
      dispatch({ type: "PE_DONE" });
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
      if (!p.publishedAt) {
        dispatch({ type: "PUBLISH_XP" });
        P1_JUST_PUBLISHED.v = true;
        setTimeout(() => window.dispatchEvent(new Event("ff-published")), 0);
      } else dispatch({ type: "TOAST", toast: "Saved" });
      if (onSaved) onSaved();
    });
  };
  useEffect(() => { const h = () => publish(); window.addEventListener("ff-save", h); return () => window.removeEventListener("ff-save", h); });

  return (
    <div id="ff-sec-share" className="ff-publishcard" style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Coin size={30} tier="gold" />
        <span className="ff-h2" style={{ fontSize: 19, color: "var(--gold-lt)", flex: 1 }}>Save</span>
      </div>
      <button type="button" className="ff-publish-btn" onClick={publish}><Check size={17} /> Save</button>
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



function ProfileBuilder() {
  const { state, dispatch } = useStore();
  const p = state.profile;
  const me = meAsStaff(p, state.session);
  const cardReady = recsOf(p, "professions").some(r => !r.proposed);
  const signedIn = state.auth.status === "signedIn";
  const finished = signedIn && !!p.finishedAt;
  const toWelcome = () => setTimeout(() => {
    const el = document.getElementById("ff-sec-welcome");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 80);
  return (
    <div>
      <div className="ff-eyebrow">FF Team · Profile</div>

      <div className="ff-journey">
        <BigStepHead n={1} title="Join the Team" done={signedIn} />
        <TagSection />

        <StepHead n={2} title="Profile Card" done={cardReady} />
        <div id="ff-sec-card"><CardBuilder /></div>

        <StepHead n={3} title="FF AI and CV upload" done={hasCV(p)} />
        <ProfileFFAI />
        <CVPanel />

        <StepHead n={4} title="Your profile" done={false} />
        <CreatorMedia />
        <CreatorAboutMe />
        <ProfileSections person={me} isMe />
        <IntroEditor17 />
      </div>

      {/* Section 4 → Save & Share → Section 5. v16.11: everything stays on the
          left-hand line. Section 5 sits level with the middle of Save & Share,
          with the line and dashes running down beneath it until you save;
          then the page extends and Section 5 opens below. */}
      <div className={`ff-finale${finished ? " open" : ""}`}>
        <div className="ff-s5row">
          {!finished && (
            <div className="ff-s5mark" title="Section 5 opens when you save" aria-label="Section 5 — opens when you save">
              <span className="ff-stepnum closed" aria-hidden="true">05</span>
            </div>
          )}
          <SaveShareCard onSaved={toWelcome} />
        </div>
        {!finished && <CardPreviewSoon />}
        {finished && <WelcomeSection me={me} />}
      </div>
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
