/* src/components/staff/company-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COMPANY CARD (v1.1) — three layouts under the colours: Classic, Big logo
   and Centred. "What areas do you cover" replaces "Where you're based".
   ========================================================================== */
const CC_LAYOUTS = [
  { key: "classic", name: "Classic" },
  { key: "logo", name: "Big logo" },
  { key: "centre", name: "Centred" },
];


const coInitials = (n) => String(n || "").replace(/^the\s+/i, "").split(/\s+/).filter(Boolean).map(w => w[0]).slice(0, 2).join("").toUpperCase() || "FF";




/* ---- Social links on Company Cards ---- */
const SOC11 = [
  { k: "whatsapp", label: "WhatsApp", ph: "+44 7700 900000" },
  { k: "linkedin", label: "LinkedIn", ph: "company/yourname" },
  { k: "instagram", label: "Instagram", ph: "@yourname" },
  { k: "facebook", label: "Facebook", ph: "yourname" },
  { k: "tiktok", label: "TikTok", ph: "@yourname" },
];


function SocialIcon11({ k, size = 15 }) {
  const a = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true" };
  if (k === "whatsapp") return <WhatsAppIcon size={size} />;
  if (k === "linkedin") return <svg {...a}><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M8 10.5V16M8 7.8v.1M12 16v-5.5M12 13c0-1.5 1-2.5 2.3-2.5S16.5 11.4 16.5 13V16" /></svg>;
  if (k === "instagram") return <svg {...a}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.3 6.8v.1" /></svg>;
  if (k === "facebook") return <svg {...a}><circle cx="12" cy="12" r="9" /><path d="M13.6 20.9V13.5h2.3l.4-2.7h-2.7V9.2c0-.8.4-1.4 1.5-1.4h1.3V5.5c-.5-.1-1.2-.2-2-.2-2.2 0-3.5 1.3-3.5 3.5v2h-2.2v2.7h2.2v7.4" /></svg>;
  return <svg {...a}><path d="M14 3.5v10.2a3.6 3.6 0 1 1-3.6-3.6M14 3.5c.3 2.4 1.9 4 4.4 4.3" /></svg>;
}


/* Social links, each row named so nobody has to guess the icon. Used on the Company Card, the VIP Host Card and the FF Team profile. */
function SocialEdit11({ value, onChange }) {
  const v = value || {};
  return (
    <div className="ff-soc11-edit">
      {SOC11.map(x => (
        <label key={x.k} className="row"><span className="ic"><SocialIcon11 k={x.k} size={18} /></span>
          <span className="col"><b className="sn">{x.label}</b>
            <input className="ff-input" value={v[x.k] || ""} placeholder={x.ph} aria-label={x.label} autoCapitalize="none" spellCheck={false}
              onChange={(e) => onChange({ ...v, [x.k]: e.target.value.slice(0, 80) })} /></span></label>
      ))}
    </div>
  );
}


function SocialRow11({ value, named }) {
  const v = value || {};
  const have = SOC11.filter(x => String(v[x.k] || "").trim());
  if (!have.length) return null;
  return <div className="ff-soc11-pills">{have.map(x => <span key={x.k} className="pill"><SocialIcon11 k={x.k} size={14} />{named ? <b>{x.label}</b> : null}<small>{v[x.k]}</small></span>)}</div>;
}


/* FF Team profile: social links as a drop-down on the profile (not on the Profile Card). */
function ProfileSocial11({ isMe, person }) {
  const { state, dispatch } = useStore();
  if (!isMe) {
    const s = person && person.socials;
    if (!s || !SOC11.some(x => String(s[x.k] || "").trim())) return null;
    return (
      <section style={{ marginTop: 22 }}>
        <SectionHead icon={<I11.Globe size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Social links" />
        <SocialRow11 value={s} named />
      </section>
    );
  }
  const open = state.categoryVisibility.pf_social === true;
  return (
    <section id="ff-sec-social" style={{ marginTop: 22 }}>
      <SectionHead icon={<I11.Globe size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Social links" action={<CategoryToggle sectionKey="pf_social" defaultOpen={false} />} />
      {open && <SocialEdit11 value={(state.profile || {}).socials} onChange={(socials) => dispatch({ type: "PROFILE", patch: { socials } })} />}
    </section>
  );
}


const socialsOf11 = (co) => {
  const s = { ...((co && co.socials) || {}) };
  ((co && co.contact) || []).forEach(([k, v]) => { const m = SOC11.find(x => new RegExp(x.label, "i").test(k)); if (m && !s[m.k]) s[m.k] = v; });
  return SOC11.filter(x => String(s[x.k] || "").trim()).map(x => x.k);
};



/* ---- Build your own Service Cards and Signature Cocktails, in the same card frame as
   FireFlair's own Service Cards. Saved on the company profile. ---- */
const SVC_TONES11 = [["bronze", "Bronze"], ["silver", "Silver"], ["gold", "Gold"], ["platinum", "Platinum"], ["dark", "Black"], ["white", "White"]];


const GlassIcon11 = lucideIcon("GlassWater"), ListIcon11 = lucideIcon("ListOrdered");


function CardBuildTile11({ label, onClick }) {
  return (
    <button type="button" className="ff-card ff-addtile ff-build-add" onClick={onClick} style={{ width: CARD_W.poster }} aria-label={label}>
      <span style={{ textAlign: "center" }}>
        <span style={{ display: "grid", placeItems: "center", width: 46, height: 46, margin: "0 auto", border: "1px solid var(--gold-dk)", borderRadius: 14 }}><I11.Plus size={22} color="var(--gold-dk)" /></span>
        <span className="ff-label" style={{ display: "block", marginTop: 10 }}>{label}</span>
      </span>
    </button>
  );
}


function svcPoster11(x, coName) {
  return (
    <V101.PosterCard tone={x.tone || "gold"} ribbon="Service Card" eyebrow={`${coName || "Your company"}`} title={x.title || "Service name"} tagline={x.tagline || ""} price={x.price || ""}
      rows={[
        { icon: <I11.Sparkles size={17} />, label: "Includes", value: x.includes || "What's included" },
        { icon: <I11.Users size={17} />, label: "Ideal for", value: x.ideal || "Who it's for" },
        { icon: <I11.Clock size={17} />, label: "Duration", value: x.time || "How long" },
      ]}
      footer={<span className="ff-poster-small m-0">{CARD_DOMAIN}</span>} />
  );
}


function ckPoster11(x, coName) {
  return (
    <V101.PosterCard tone={x.tone || "dark"} ribbon="Signature Cocktail" eyebrow={coName || "Your bar"} title={x.name || "Cocktail name"} tagline={x.desc || ""} price={x.price || ""}
      rows={[
        { icon: <I11.Martini size={17} />, label: "Ingredients", value: x.ingredients || "What goes in" },
        { icon: <ListIcon11 size={17} />, label: "Method", value: x.method || "How it's made" },
        { icon: <GlassIcon11 size={17} />, label: "Glass and garnish", value: x.glass || "Served in" },
      ]}
      footer={<span className="ff-poster-small m-0">{CARD_DOMAIN}</span>} />
  );
}


function CardBuilder11({ listKey, fields, poster, blank, addLabel, saveLabel, noun }) {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const list = c[listKey] || [];
  const [edit, setEdit] = useState(null);       // null | { ...card } (id set when editing an existing one)
  const save = () => {
    const x = { ...edit, id: edit.id || uid(listKey) };
    const next = edit.id ? list.map(y => y.id === edit.id ? x : y) : [...list, x];
    dispatch({ type: "COMPANY_SAVE", company: { [listKey]: next } });
    dispatch({ type: "TOAST", toast: `${noun} ${edit.id ? "saved" : "added"}` });
    setEdit(null);
  };
  const del = () => { dispatch({ type: "COMPANY_SAVE", company: { [listKey]: list.filter(y => y.id !== edit.id) } }); dispatch({ type: "TOAST", toast: `${noun} removed` }); setEdit(null); };
  const coName = c.name;
  if (edit) return (
    <div className="ff-build11">
      <div className="pv" style={{ width: CARD_W.poster }}>{poster(edit, coName)}</div>
      <div className="fm">
        {fields.map(([k, label, ph, long]) => (
          <label key={k} className="fl"><span className="ff-label">{label}</span>
            {long ? <textarea className="ff-input" rows={2} value={edit[k] || ""} placeholder={ph} maxLength={160} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
              : <input className="ff-input" value={edit[k] || ""} placeholder={ph} maxLength={60} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />}
          </label>
        ))}
        <div className="fl"><span className="ff-label">Colour</span>
          <div className="tones" role="group" aria-label="Card colour">
            {SVC_TONES11.map(([k, n]) => <button key={k} type="button" className={`t ${k}`} aria-pressed={(edit.tone || blank.tone) === k} onClick={() => setEdit({ ...edit, tone: k })}>{n}</button>)}
          </div>
        </div>
        <div className="acts">
          <Btn variant="primary" disabled={!String(edit[fields[0][0]] || "").trim()} onClick={save}><I11.Check size={14} /> {saveLabel}</Btn>
          <Btn variant="ghost" onClick={() => setEdit(null)}>Cancel</Btn>
          {edit.id && <button type="button" className="ff-binbtn" aria-label={`Delete this ${noun.toLowerCase()}`} title="Delete" onClick={del}><I11.Trash2 size={16} /></button>}
        </div>
      </div>
    </div>
  );
  return (
    <HScroll label={addLabel}>
      {list.map(x => <button key={x.id} type="button" className="ff-build-card" style={{ width: CARD_W.poster }} onClick={() => setEdit({ ...x })} aria-label={`Edit ${x[fields[0][0]]}`}>{poster(x, coName)}</button>)}
      <CardBuildTile11 label={addLabel} onClick={() => setEdit({ ...blank })} />
    </HScroll>
  );
}


function SvcBuilder11() {
  return <CardBuilder11 listKey="svcCards" noun="Service Card" addLabel="Create a Service Card" saveLabel="Save Service Card" poster={svcPoster11} blank={{ tone: "gold" }}
    fields={[["title", "Name", "Cocktail Bar Service"], ["tagline", "In a line", "What makes it special", true], ["includes", "Includes", "Bartenders, bar, glassware, ice", true],
      ["ideal", "Ideal for", "Weddings, birthdays, brand launches"], ["time", "Duration", "4 hours"], ["price", "Price", "Your price"]]} />;
}


function MenuBuilder11() {
  return <CardBuilder11 listKey="menu" noun="Cocktail" addLabel="Add a cocktail" saveLabel="Save cocktail" poster={ckPoster11} blank={{ tone: "dark" }}
    fields={[["name", "Name", "Smoked Old Fashioned"], ["desc", "In a line", "Our house twist on a classic", true], ["ingredients", "Ingredients", "Bourbon, demerara, bitters, orange", true],
      ["method", "Method", "Stirred, smoked with oak", true], ["glass", "Glass and garnish", "Rocks glass, orange twist"]]} />;
}




/* ---- Company Q&A: Yes or No, then a type box ---- */
const CO_QA_SEED = [
  { id: "qa_f1", group: "feedback", text: "Was it easy to set up your Company Card?" },
  { id: "qa_f2", group: "feedback", text: "Was anything confusing on the FF Staff site?" },
  { id: "qa_f3", group: "feedback", text: "Is the booking screen quick to use?" },
  { id: "qa_f4", group: "feedback", text: "Would you book your staff through FireFlair again?" },
  { id: "qa_f5", group: "feedback", text: "Is there a feature you'd like us to add?" },
  { id: "qa_b1", group: "business", text: "Do you run events all year round?" },
  { id: "qa_b2", group: "business", text: "Do you book staff at short notice?" },
  { id: "qa_b3", group: "business", text: "Do you have your own bar equipment?" },
  { id: "qa_b4", group: "business", text: "Do you provide uniforms for your staff?" },
  { id: "qa_b5", group: "business", text: "Do you offer regular repeat work?" },
].map(q => ({ answer: "", note: "", ...q }));


const coQa = (c) => (c && Array.isArray(c.qa) ? c.qa : CO_QA_SEED);


const qaShown = (q) => (q.answer ? (q.note ? `${q.answer} — ${q.note}` : q.answer) : "");


function CoQSheet11({ sheet, qa, save, onClose }) {
  const isNew = sheet === "new";
  const [text, setText] = useState(""), [ans, setAns] = useState(""), [note, setNote] = useState("");
  useEffect(() => {
    if (!sheet)
      return;
    setText(isNew ? "" : sheet.text);
    setAns(isNew ? "" : sheet.answer || "");
    setNote(isNew ? "" : sheet.note || "");
  }, [sheet === "new" ? "new" : sheet && sheet.id]);
  if (!sheet)
    return null;
  const done = () => {
    if (isNew)
      save([...qa, { id: uid("qa"), group: "business", text: text.trim(), answer: "", note: "", custom: true }]);
    else
      save(qa.map((x) => x.id === sheet.id ? { ...x, answer: ans, note: note.trim() } : x));
    onClose();
  };
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: isNew ? "Add a question" : sheet.group === "feedback" ? "Website feedback" : "Your business"
  }, isNew ? React.createElement(Field, {
    label: "Question"
  }, React.createElement("input", {
    className: "ff-input",
    value: text,
    autoFocus: FF_FINE_POINTER && (true),
    onChange: (e) => setText(e.target.value),
    placeholder: "Do you hold a premises licence?"
  })) : React.createElement("p", {
    className: "ff-serif",
    style: { fontSize: 19, lineHeight: 1.35, marginTop: 0 }
  }, sheet.text), React.createElement("div", {
    className: "ff-qa11-yn",
    role: "group",
    "aria-label": "Answer"
  }, ["Yes", "No"].map((o) => React.createElement("button", {
    key: o,
    type: "button",
    disabled: isNew,
    "aria-pressed": ans === o,
    onClick: () => setAns(ans === o ? "" : o)
  }, o))), React.createElement("textarea", {
    className: "ff-input",
    rows: 3,
    value: note,
    disabled: isNew,
    onChange: (e) => setNote(e.target.value),
    placeholder: "Type your answer",
    "aria-label": "Type your answer",
    style: { marginBottom: 14 }
  }), React.createElement(Btn, {
    variant: "primary wide",
    disabled: isNew ? !text.trim() : !ans && !note.trim(),
    onClick: done
  }, React.createElement(I11.Check, {
    size: 14
  }), " ", isNew ? "Add question" : "Save answer"), !isNew && sheet.custom && React.createElement("div", {
    style: { textAlign: "right", marginTop: 12 }
  }, React.createElement("button", {
    className: "ff-link",
    style: { fontSize: 11, color: "#5E574C", textDecoration: "underline", background: "none" },
    onClick: () => {
      save(qa.filter((x) => x.id !== sheet.id));
      onClose();
    }
  }, "Delete")));
}


function CompanyQA11({ c }) {
  const { dispatch } = useStore();
  const [view, setView] = useState("todo");
  const [sheet, setSheet] = useState(null);
  const qa = coQa(c);
  const isDone = (q) => !!(q.answer || q.note);
  const todo = qa.filter(q => !isDone(q)), done = qa.filter(isDone);
  const list = view === "todo" ? todo : done;
  const save = (next) => dispatch({ type: "COMPANY_SAVE", company: { qa: next } });
  return (
    <>
      <div className="ff-qa11-pills" role="tablist" aria-label="Q&A">
        {[["todo", "To answer", todo.length], ["done", "Answered", done.length]].map(([k, l, n]) => <button key={k} type="button" role="tab" aria-selected={view === k} className={view === k ? "on" : ""} onClick={() => setView(k)}>{l} ({n})</button>)}
      </div>
      <HScroll label="Q&A" snap>
        {list.map(q => <QuestionCard key={q.id} q={{ text: q.text, group: q.group === "feedback" ? "feedback" : "hiring" }} label={q.group === "feedback" ? "Website" : "Business"} answer={qaShown(q)} onClick={() => setSheet(q)} />)}
        {view === "todo" && (
          <button className="ff-card ff-addtile" aria-label="Add a question" onClick={() => setSheet("new")} style={{ width: CARD_W.question, aspectRatio: "5 / 7" }}>
            <span style={{ textAlign: "center" }}>
              <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, margin: "0 auto", border: "1px solid var(--gold-dk)", borderRadius: 12 }}><I11.Plus size={20} color="var(--gold-dk)" /></span>
              <span className="ff-label" style={{ display: "block", marginTop: 8 }}>Add a question</span>
            </span>
          </button>
        )}
      </HScroll>
      <CoQSheet11 sheet={sheet} qa={qa} save={save} onClose={() => setSheet(null)} />
    </>
  );
}



function CompanyCardFace({ c, edit, set, onLogo, size = "", party }) {
  const co = c || {};
  const t = THEMES[co.theme] || THEMES.onyx;
  const layout = co.layout || "logo";
  const slug = (co.id && !co.mine ? rt17Slug(co) : (co.slug || slugify(co.name))) || (party ? "your-name" : "your-company");
  const baseN = baseNodeOfCo17(co);
  const areas = baseN ? baseLabelOf17(baseN) : (co.areas !== undefined ? co.areas : (co.location || co.area || ""));
  const logoRef = useRef(null);
  const pick = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f || !set) return; const r = new FileReader(); r.onload = () => {
    const src = r.result, im = new Image();
    im.onload = () => {
      const k = im.naturalWidth / Math.max(1, im.naturalHeight), wide = k >= 1.8;
      set({ logo: src, logoWide: wide, logoRatio: wide ? Math.min(5, Math.round(k * 100) / 100) : null });
    };
    im.onerror = () => set({ logo: src, logoWide: false, logoRatio: null });
    im.src = src;
  }; r.readAsDataURL(f); };
  const lr = co.logoWide && co.logoRatio ? { "--lr": co.logoRatio } : undefined;
  const vars = { "--ink": t.ink, "--sub": t.sub, "--rule": t.rule, "--acc": t.accent || "#D9BE68" };
  const logo = edit ? (
    <button type="button" className={"ff-cc11-logo" + (co.logoWide ? " w" : "")} style={lr} onClick={() => logoRef.current && logoRef.current.click()} aria-label={co.logo ? "Change your logo" : "Add your logo"}>
      {co.logo ? <img decoding="async" src={co.logo} referrerPolicy="no-referrer" alt="" /> : <><CameraPlusGlyph size={layout === "logo" ? 26 : 20} /><span>Logo</span></>}
      <input ref={logoRef} type="file" accept="image/*" hidden onChange={pick} />
    </button>
  ) : (
    <span style={lr} className={"ff-cc11-logo" + (co.logoWide ? " w" : "") + (co.unclaimed && co.logo ? (co.logoBg === "light" ? " ul lt" : " ul") : "")}>{co.unclaimed && co.logo ? <><span className="mono">{coInitials(co.name)}</span><img decoding="async" src={co.logo} referrerPolicy="no-referrer" alt="" onError={(e) => { e.currentTarget.style.display = "none"; }} /></> : co.logo ? <img decoding="async" src={co.logo} referrerPolicy="no-referrer" alt="" /> : <span className="mono">{coInitials(co.name)}</span>}</span>
  );
  const name = edit ? <input className="ff-cardin nm" value={co.name || ""} placeholder={party ? "Your name" : "Company name"} aria-label={party ? "Your name" : "Company name"} maxLength={60} onChange={(e) => set({ name: e.target.value })} />
    : <span className="nm">{co.name || (party ? "Your name" : "Your company")}</span>;
  const kind = edit ? <span className="kd2"><I11.Briefcase size={12} /><input className="ff-cardin kd" value={co.kind || ""} placeholder="What do you do?" aria-label="What do you do?" maxLength={70} onChange={(e) => set({ kind: e.target.value })} /></span>
    : <span className="kd kd2"><I11.Briefcase size={12} /><span>{co.kind || "What you do"}</span></span>;
  const area = (
    <span className="ar"><I11.MapPin size={12} /><span>{areas || "Where you're based"}</span></span>
  );
  return (
    <CardFrame tier={(co.theme === "silver" || co.theme === "gold") ? co.theme : (co.tier || "gold")} theme={t} premium ratio="8 / 5" className={`ff-cocard ff-cc11 l-${layout} ${size}${co.logoWide ? " lw" : ""}`} style={{ ...vars, maxWidth: 460, margin: size ? 0 : "0 auto" }}>
      <span className="ff-pc-plate ff-cc11-plate">{co.unclaimed ? "Company card" : party ? "VIP Host Card" : "Company Card"}</span>
      {!co.unclaimed && <span className="ff-cc11-coin"><Coin size={size ? 24 : 30} tier={co.theme === "silver" ? "silver" : "gold"} /></span>}
      <div className="ff-cc11-body">
        {logo}
        <span className="ff-cc11-tx">{name}{kind}{area}{socialsOf11(co).length > 0 && <span className="soc">{socialsOf11(co).map(k => <span key={k} className="si" title={(SOC11.find(x => x.k === k) || {}).label}><SocialIcon11 k={k} size={size ? 11 : 15} /></span>)}</span>}</span>
      </div>
      <div className="ff-cc11-foot" style={{ background: t.dark ? "rgba(0,0,0,.45)" : "#141416" }}>
        {!co.unclaimed && <><Coin size={size ? 15 : 18} /><Wordmark size={size ? 9 : 11} /></>}
        <span className="url">{CARD_DOMAIN}/{slug}</span>
      </div>
    </CardFrame>
  );
}



function EditableCompanyCard({ plain }) {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const set = (p) => dispatch({ type: "COMPANY_SAVE", company: p });
  const party = hireSiteOf(state).party;
  return (
    <>
      <CompanyCardFace c={c} edit set={set} party={party} />
      <div className="ff-cc11-base">
        <span className="ff-cc11-baseh">Where are you based?</span>
        <BaseField17 ink="#16130F" owner="company" />
      </div>
      {!plain && <>
      <div className="ff-swatches" role="group" aria-label="Card colour">
        {Object.entries(THEMES).map(([k, th]) => (
          <button key={k} type="button" className="ff-swatch" aria-pressed={(c.theme || "onyx") === k} aria-label={`${th.name} card`} title={th.name}
            style={{ background: th.swatch }} className={`ff-swatch${th.locked ? " ff-swatch-lock" : ""}`} onClick={() => { if (th.locked) previewTheme17(k, c.theme || "onyx", (v) => set({ theme: v })); else { clearPv17(); set({ theme: k }); } }}>{th.locked ? <I11.Lock size={13} /> : null}</button>
        ))}
      </div>
      <div className="ff-cc11-layouts" role="group" aria-label="Card layout">
        {CC_LAYOUTS.map(l => (
          <button key={l.key} type="button" aria-label={`${l.name} layout`} title={`${l.name} layout`} aria-pressed={(c.layout || "logo") === l.key} onClick={() => set({ layout: l.key })}>
            <span className={`thumb t-${l.key}`} aria-hidden="true"><i className="lg" /><i className="a" /><i className="b" /><i className="c" /></span>
          </button>
        ))}
      </div>
      </>}
    </>
  );
}



function CompanyLandscape({ company }) { return <CompanyCardFace c={company || {}} />; }


function CompanyJoin({ inBooking }) {
  const { state, dispatch } = useStore();
  const site = hireSiteOf(state);
  const c = state.company || {};
  const signedIn = state.auth.status === "signedIn";
  const joined = !!((c.verified || signedIn) && c.joinedAt && c.slug);
  const [phone, setPhone] = useState(c.phone || state.session.phone || state.bookPhone || "");
  const [email, setEmail] = useState(c.email || state.bookEmail || "");
  const [stage, setStage] = useState("details");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const digits = String(phone).replace(/\D/g, "");
  const phoneOk = digits.length >= 9;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email).trim());
  const ready = signedIn || phoneOk;
  const via = "phone";
  const slug0 = c.slug || slugify(c.name) || slugify(String(email).split("@")[0]) || `ff-${digits.slice(-6) || Date.now().toString(36)}`;
  /* Reserved words (network, profile, stories ...) are page names, so a company address never uses one. */
  const slug = rt17Reserved(slug0) || rt17DirSlugTaken(slug0) ? slug0 + "-co" : slug0;
  const create = () => {
    if (!signedIn) dispatch({ type: "SAMPLE_OFF" });   /* a new company starts empty: the sample bookings belong to the demo accounts */
    dispatch({ type: "COMPANY_SAVE", company: {
      slug,
      theme: c.theme || "onyx",
      layout: c.layout || "logo",
      phone: phoneOk ? String(phone).trim() : c.phone || "",
      email: emailOk ? String(email).trim() : c.email || "",
      joinedAt: Date.now(),
      questions: c.questions || CO_QA_SEED.map((q) => ({ ...q })),
      tcMode: c.tcMode || "template",
      records: c.records || {},
      reviews: c.reviews || []
    } });
    if (signedIn)
      dispatch({ type: "COMPANY_SAVE", company: { verified: true } });
    else
      dispatch({ type: "COMPANY_SIGNED_IN", slug });
    dispatch({ type: "TOAST", toast: `Welcome to ${site.name}` });
    setStage("details");
    setCode("");
  };
  const send = async () => {
    setErr(null);
    if (!phoneOk) {
      setErr("Enter your mobile number, with the country code if you're outside the UK.");
      return;
    }
    const dg = (x) => String(x || "").replace(/\D/g, "").slice(-9);
    const known = phoneOk && [c.phone, state.session && state.session.phone, "+44 7700 900000"].some((x) => x && dg(x) === dg(phone));
    if (known) {
      window.dispatchEvent(new Event("ff-login"));
      return;
    }
    setBusy(true);
    await new Promise((r) => setTimeout(r, 400));
    setBusy(false);
    setStage("code");
    setCode("");
  };
  if (joined) {
    const line = [c.phone && maskNumber(c.phone), c.email].filter(Boolean).join(" · ");
    if (inBooking)
      return React.createElement("div", {
        id: "ff-co-join",
        className: "ff-tagsection ff-join11 done"
      }, React.createElement("span", {
        className: "ok"
      }, React.createElement(I11.Check, {
        size: 15,
        strokeWidth: 3
      })), React.createElement("span", {
        className: "tx"
      }, React.createElement("b", null, c.name || (site.party ? "You" : "Your company")), React.createElement("small", null, line || "Signed in")));
    return React.createElement("div", {
      id: "ff-co-join",
      className: "ff-tagsection ff-join11 done"
    }, React.createElement("span", {
      className: "ok"
    }, React.createElement(I11.Check, {
      size: 15,
      strokeWidth: 3
    })), React.createElement("span", {
      className: "tx"
    }, React.createElement("b", null, c.name || (site.party ? "Your FF Party account" : "Your company")), React.createElement("small", null, line ? `${line} · verified` : "Verified")));
  }
  return React.createElement("div", {
    id: "ff-co-join",
    className: "ff-tagsection ff-join11"
  }, stage === "details" ? React.createElement(React.Fragment, null, signedIn ? React.createElement("div", {
    className: "ff-signedin",
    style: { marginBottom: 12 }
  }, React.createElement(ShieldCheck, {
    size: 18,
    color: "var(--ok)",
    style: { flex: "none", marginTop: 1 }
  }), React.createElement("span", null, "Signed in", state.auth.tag ? ` as ${state.auth.tag}` : "", ".")) : React.createElement(React.Fragment, null, React.createElement(Field, {
    label: "Phone number"
  }, React.createElement("input", {
    id: "co-phone",
    className: "ff-input",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    placeholder: "+44 7700 900000",
    value: phone,
    onChange: (e) => setPhone(e.target.value.slice(0, 24)),
    onKeyDown: (e) => e.key === "Enter" && ready && !busy && send()
  }))), React.createElement(Btn, {
    variant: "primary wide",
    disabled: busy || !ready,
    onClick: signedIn ? create : send
  }, busy ? React.createElement(Loader2, {
    size: 14,
    className: "ff-spin"
  }) : signedIn ? React.createElement(I11.Check, {
    size: 14
  }) : React.createElement("span", {
    className: "wa11"
  }, React.createElement(WhatsAppIcon, {
    size: 17
  })), " ", signedIn ? `Join ${site.name}` : "Continue")) : React.createElement(React.Fragment, null, React.createElement(Field, {
    label: via === "phone" ? "WhatsApp code" : "Email code",
    hint: `Sent to ${via === "phone" ? phone : email} · any six digits in this preview`
  }, React.createElement("input", {
    className: "ff-input ff-tagin",
    inputMode: "numeric",
    autoComplete: "one-time-code",
    maxLength: 6,
    value: code,
    autoFocus: FF_FINE_POINTER && (true),
    onChange: (e) => setCode(e.target.value.replace(/\D/g, "")),
    placeholder: "000000",
    "aria-label": via === "phone" ? "Code from WhatsApp" : "Code from your email",
    onKeyDown: (e) => e.key === "Enter" && code.length === 6 && create()
  })), React.createElement(Btn, {
    variant: "primary wide",
    disabled: code.length < 6,
    onClick: create
  }, React.createElement(I11.Check, {
    size: 14
  }), " ", inBooking ? "Continue" : `Join ${site.name}`), React.createElement("div", {
    style: { display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10, flexWrap: "wrap" }
  }, React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => {
      setStage("details");
      setCode("");
    }
  }, "Change"), React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: send
  }, "Resend code"))), err && React.createElement("p", {
    className: "ff-body",
    role: "alert",
    style: { color: "var(--bad)", fontSize: 13, margin: "10px 0 0", fontWeight: 600 }
  }, err));
}



/* ==========================================================================
   COMPANY PROFILE (v1.1) — what a hiring business needs now: About, Media,
   Contact & social, Areas covered, Venues, Documents, T&Cs, hiring
   questions, your team and reviews. Services and Signature Cocktails are for
   advertising on FF Party, so they're shown as coming in 2027.
   ========================================================================== */
function CompanyMedia({ list, editable }) {
  const { dispatch } = useStore();
  const ref = useRef(null);
  const add = (e) => {
    const files = [...(e.target.files || [])].slice(0, 6); e.target.value = "";
    files.forEach(f => { const r = new FileReader(); r.onload = () => dispatch({ type: "COMPANY_MEDIA_ADD", item: { id: uid("cm"), src: r.result } }); r.readAsDataURL(f); });
  };
  return (
    <div className="ff-cmedia">
      {list.map((m, mi) => (
        <figure key={m.id || m.src} className="ff-cmedia-it">
          <img decoding="async" src={m.src} alt={m.alt || ""} loading={mi < 8 ? "eager" : "lazy"} referrerPolicy="no-referrer" onError={(e) => { if (/^https?:/.test(m.src)) e.currentTarget.style.visibility = "hidden"; }} />
          {editable && <button type="button" aria-label="Remove photo" onClick={() => dispatch({ type: "COMPANY_MEDIA_DELETE", id: m.id })}><I11.X size={13} /></button>}
        </figure>
      ))}
      {editable && (
        <button type="button" className="ff-cmedia-add" onClick={() => ref.current && ref.current.click()}>
          <I11.ImagePlus size={22} /><b>Add photos</b><small>Your bar, your events, your team</small>
          <input ref={ref} type="file" accept="image/*" multiple hidden onChange={add} />
        </button>
      )}
    </div>
  );
}




/* ---- Terms and conditions: five standard terms you can read, edit and save to your profile ---- */
const TERMS5 = [
  { k: "shift", label: "The shift", text: "The date, location and start and finish times are as shown on the Service Card." },
  { k: "role", label: "The role", text: "The job role and what is expected are as shown on the Service Card. Our standard work uniform applies." },
  { k: "pay", label: "Pay", text: "Pay is the amount shown on the Service Card, agreed between us and the staff member. We pay the staff member directly. Add here when and how you pay." },
  { k: "changes", label: "Changes and cancellation", text: "If either side needs to change or cancel, tell the other as early as possible through FireFlair so the shift can be filled." },
  { k: "conduct", label: "Conduct and dress code", text: "Everyone acts professionally, follows the dress code and respects clients and guests. Breaking these terms can mean removal from the booking." },
];


const termsOf = (c) => (c && Array.isArray(c.tcTerms) && c.tcTerms.length ? c.tcTerms : TERMS5);


function TermsSheet11({ open, onClose }) {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [terms, setTerms] = useState(TERMS5);
  const [docs, setDocs] = useState([]);
  const ref = useRef(null);
  useEffect(() => { if (open) { setTerms(termsOf(c).map(t => ({ ...t }))); setDocs(c.tcDocs || []); } }, [open]);
  if (!open) return null;
  const addDoc = (e) => { const fs = [...(e.target.files || [])]; e.target.value = ""; if (fs.length) setDocs(d => [...d, ...fs.map(f => ({ id: uid("tcd"), name: f.name }))]); };
  const save = () => {
    dispatch({ type: "COMPANY_SAVE", company: { tcTerms: terms, tcDocs: docs, tcMode: "own", tcOwn: terms.map(t => `${t.label}: ${t.text}`).join("\n") } });
    dispatch({ type: "TOAST", toast: "Terms saved to your profile" }); onClose();
  };
  return (
    <Sheet open onClose={onClose} title="Terms and conditions">
      <p className="ff-fp" style={{ margin: "0 0 10px" }}>These five terms go with every Service Card. Edit them, then save to your profile.</p>
      <div className="ff-tc5">
        {terms.map((t, i) => (
          <label key={t.k}><span><b>{i + 1}</b>{t.label}</span>
            <textarea rows={3} value={t.text} aria-label={t.label} onChange={(e) => setTerms(terms.map((x, j) => j === i ? { ...x, text: e.target.value } : x))} /></label>
        ))}
      </div>
      {docs.length > 0 && <ul className="ff-tc5-docs">{docs.map(d => <li key={d.id}><I11.FileText size={14} /><span>{d.name}</span><button type="button" aria-label={`Remove ${d.name}`} onClick={() => setDocs(docs.filter(x => x.id !== d.id))}><I11.X size={13} /></button></li>)}</ul>}
      <div className="ff-bsec-acts" style={{ marginTop: 8 }}>
        <Btn variant="primary" onClick={save}><I11.Check size={14} /> Save to my profile</Btn>
        <Btn variant="sm" onClick={() => ref.current && ref.current.click()}><I11.Plus size={12} /> Add a document</Btn>
        <Btn variant="sm ghost" onClick={() => setTerms(TERMS5.map(t => ({ ...t })))}>Reset</Btn>
        <input ref={ref} type="file" hidden multiple onChange={addDoc} />
      </div>
    </Sheet>
  );
}



/* A microphone for any search box: the same speech adapter FireFlair uses. */
function useMic11(onText) {
  const [listening, setListening] = useState(false);
  const [msg, setMsg] = useState("");
  const rec = useRef(null);
  const toggle = () => {
    if (listening) { if (rec.current) rec.current.stop(); return; }
    if (!SPEECH_ADAPTER.supported()) { setMsg(SPEECH_ERRORS.unsupported); return; }
    rec.current = SPEECH_ADAPTER.start({
      onText: (t) => { setMsg(""); onText(t); },
      onEnd: () => setListening(false),
      onError: (code) => { setListening(false); setMsg(SPEECH_ERRORS[code] || "Voice input stopped. Try again, or type instead."); },
    });
    if (rec.current) { setListening(true); setMsg("Listening… speak now."); }
  };
  return { listening, toggle, msg };
}


function SearchBox11({ value, onChange, placeholder, label }) {
  const mic = useMic11(onChange);
  return (
    <div className="ff-sbx">
      <div className="row">
        <span className="tag" aria-hidden="true"><Coin size={20} tier="gold" /></span>
        <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={label} />
        <button type="button" className={`ff-mic${mic.listening ? " on" : ""}`} onClick={mic.toggle} aria-pressed={mic.listening} aria-label={mic.listening ? "Stop listening" : "Speak instead of typing"} title={mic.listening ? "Stop" : "Speak"}><MicGlyph size={18} /></button>
      </div>
      {mic.msg && <p className="msg" role="status">{mic.msg}</p>}
    </div>
  );
}



/* About: just a box you type in. It saves as you leave it. */
function AboutBox11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [t, setT] = useState(c.description || "");
  useEffect(() => { setT(c.description || ""); }, [c.description]);
  return <textarea className="ff-input ff-aboutbox" rows={4} value={t} aria-label="About" placeholder="Tell people what your business does"
    onChange={(e) => setT(e.target.value)} onBlur={() => { if (t.trim() !== (c.description || "")) dispatch({ type: "COMPANY_SAVE", company: { description: t.trim() } }); }} />;
}



/* FF Staff: More information. Sections a company writes for its public page (a title, a text, and items with an optional photo). */
function InfoBuilder17() {
  const { state, dispatch } = useStore();
  const list = (state.company || {}).info || [];
  const [ed, setEd] = useState(null);
  const save = (next) => dispatch({ type: "COMPANY_SAVE", company: { info: next } });
  return (
    <div className="ff-info17">
      {list.map(sec => (
        <button key={sec.id} type="button" className="ff-info17-row" onClick={() => setEd(sec)}>
          <span><b>{sec.title || "Untitled"}</b><small>{(sec.items || []).length} {(sec.items || []).length === 1 ? "item" : "items"}</small></span>
          <I11.Pencil size={15} aria-hidden="true" />
        </button>
      ))}
      <button type="button" className="ff-info17-add" onClick={() => setEd({ id: uid("info"), title: "", text: "", items: [], fresh: true })}><I11.Plus size={15} /> Add a section</button>
      {ed && <InfoSheet17 sec={ed} onClose={() => setEd(null)}
        onSave={(x) => { const { fresh, ...clean } = x; save(list.some(y => y.id === x.id) ? list.map(y => y.id === x.id ? clean : y) : [...list, clean]); setEd(null); }}
        onDelete={() => { save(list.filter(y => y.id !== ed.id)); setEd(null); }} />}
    </div>
  );
}

function InfoSheet17({ sec, onSave, onDelete, onClose }) {
  const [x, setX] = useState(() => JSON.parse(JSON.stringify(sec)));
  const items = x.items || [];
  const setItem = (i, p) => setX({ ...x, items: items.map((it, j) => j === i ? { ...it, ...p } : it) });
  const photo = (i, e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setItem(i, { photo: r.result });
    r.readAsDataURL(f);
  };
  return (
    <Sheet open onClose={onClose} title={sec.fresh ? "Add a section" : "Edit section"}>
      <div className="ff-info17-ed">
        <Field label="Title"><input className="ff-input" value={x.title || ""} maxLength={60} onChange={(e) => setX({ ...x, title: e.target.value })} placeholder="Why choose us" /></Field>
        <Field label="Text"><textarea className="ff-input" rows={3} value={x.text || ""} onChange={(e) => setX({ ...x, text: e.target.value })} placeholder="A few lines about this" /></Field>
        <div className="ff-label" style={{ margin: "4px 0 8px" }}>Items</div>
        {items.map((it, i) => (
          <div key={i} className="ff-info17-it">
            <label className="ph" aria-label={it.photo ? "Change the photo" : "Add a photo"}>
              {it.photo ? <img src={it.photo} alt="" /> : <I11.ImagePlus size={18} />}
              <input type="file" accept="image/*" hidden onChange={(e) => photo(i, e)} />
            </label>
            <div className="tx">
              <input className="ff-input" value={it.title || ""} maxLength={60} onChange={(e) => setItem(i, { title: e.target.value })} placeholder="Item" aria-label="Item title" />
              <input className="ff-input" value={it.text || ""} maxLength={240} onChange={(e) => setItem(i, { text: e.target.value })} placeholder="One line about it" aria-label="Item line" />
            </div>
            <button type="button" className="del" aria-label="Remove this item" onClick={() => setX({ ...x, items: items.filter((_, j) => j !== i) })}><I11.Trash2 size={15} /></button>
          </div>
        ))}
        <Btn variant="sm ghost" onClick={() => setX({ ...x, items: [...items, { title: "", text: "" }] })}><I11.Plus size={13} /> Add an item</Btn>
        <div className="acts">
          <Btn variant="primary wide" disabled={!String(x.title || "").trim()} onClick={() => onSave({ ...x, title: x.title.trim(), items: items.filter(it => String(it.title || it.text || it.photo || "").trim()) })}><I11.Check size={14} /> Save section</Btn>
          {!sec.fresh && <button type="button" className="ff-info17-del" onClick={onDelete}><I11.Trash2 size={14} /> Delete section</button>}
        </div>
      </div>
    </Sheet>
  );
}

/* The companies a company works with, picked from the directory. */
function PartnerPick17({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [q, setQ] = useState("");
  if (!open) return null;
  const mine = (state.company || {}).partners || [];
  const t = q.trim().toLowerCase();
  const pool = browseCompanies17(state).filter(co => co && co.id !== "mine" && (!t || `${co.name} ${co.kind || ""} ${co.area || ""}`.toLowerCase().includes(t))).slice(0, 60);
  const toggle = (id) => dispatch({ type: "COMPANY_SAVE", company: { partners: mine.includes(id) ? mine.filter(x => x !== id) : [...mine, id] } });
  return (
    <Sheet open onClose={onClose} title="Companies" center>
      <div className="ff-fav17-pick">
        <label className="srch"><I11.Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search companies" aria-label="Search companies" /></label>
        <ul>
          {pool.map(co => {
            const on = mine.includes(co.id);
            return (
              <li key={co.id}>
                <button type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => toggle(co.id)}>
                  <I11.Briefcase size={20} /><span><b>{co.name}</b><small>{co.kind || ""}</small></span>{on ? <I11.Check size={17} /> : <I11.Plus size={17} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </Sheet>
  );
}

/* FF Staff, "Your business", owner only: the people you added with "Add to favourites". Collapsed by default; never part of the public company page. */
function CompanyFavs17() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const favs = favsOf(state, all);
  const open = state.categoryVisibility.co_favs === true;
  return (
    <section id="ff-co-favs" style={{ marginTop: 22 }}>
      <SectionHead icon={<I11.Heart size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Favourites" count={favs.length} action={<CategoryToggle sectionKey="co_favs" defaultOpen={false} />} />
      {open && favs.length > 0 && (
        <HScroll label="Favourites">
          {favs.map(p => (
            <div key={p.id} className="ff-favtile17">
              <PlayerTile person={p} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />
              <button type="button" className="fav on" aria-pressed="true" aria-label={`Remove ${firstName(p.name)} from favourites`}
                onClick={() => { dispatch({ type: "FAV_TOGGLE", id: p.id }); dispatch({ type: "TOAST", toast: `${firstName(p.name)} removed from your favourites` }); }}><I11.Heart size={14} /></button>
            </div>
          ))}
        </HScroll>
      )}
    </section>
  );
}


function CompanySections() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const c = state.company || {};
  const [openRec, setOpenRec] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const [picking, setPicking] = useState(false);
  const partners = coPartners17(state, { mine: true });
  const cards = coCards17(state, { mine: true });
  const seeds = coSeeds17(state);
  const engs = state.auth && state.auth.status === "signedIn" ? state.engagements : [];
  const stat = (st) => engs.filter(e => e.state === st).length;
  const teamIds = [...new Set(engs.filter(e => ["confirmed", "completed", "signed_off", "paid"].includes(e.state)).map(e => e.staffId))];
  const team = teamIds.filter(id => id !== "me").map(id => findPerson(all, state, id)).filter(Boolean);
  const reviews = (c.reviews || []).map(r => ({ ...makeRecord("reviews", r.byName), id: r.id, description: r.text, rating: r.rating, readOnly: true }));
  const termsRecs = [
    { ...makeRecord("terms", "T&Cs"), id: "co_tcs", description: "Your five terms, sent with every Service Card. Tap to view or edit." },
  ];
  const vis = (k) => state.categoryVisibility[k] === true;
  const termsDef = { label: "Terms and conditions", singular: "Terms", icon: "qualification", fields: ["description"] };
  const soc = c.socials || {};
  const recSection = (k) => (
    <ProfileAttributeSection key={k} catKey={k} def={COMPANY_CATEGORIES[k]} list={recsOf(c, k)} isMe shade="onyx" owner="company"
      onOpen={(r) => setOpenRec({ record: r, def: COMPANY_CATEGORIES[k], category: k })} onAdd={() => setAddingTo(k)} />
  );
  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "services", label: "Packages" },
    { key: "team", label: "Team", count: team.length },
    { key: "reviews", label: "Reviews", count: reviews.length },
  ];
  return (
    <>
      <section id="ff-co-media" style={{ marginTop: 22 }}>
        <CompanyMedia list={c.media || []} editable />
      </section>

      {c.joinedAt && (
        <div className="ff-costats">
          {[["Confirmed", stat("confirmed")], ["Awaiting", stat("requested")], ["Team", team.length]].map(([l, v]) => (
            <div key={l} className="ff-frame" style={{ padding: 11 }}>
              <div className="ff-display" style={{ fontSize: 22 }}>{v}</div>
              <div className="ff-label">{l}</div>
            </div>
          ))}
        </div>
      )}

      <div className="ff-ptabs-wrap">
        <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />
        <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
          {tab === "overview" && (<>
            <section id="ff-co-about" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.Briefcase size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="About" action={<CategoryToggle sectionKey="co_about" defaultOpen={false} />} />
              {vis("co_about") && <AboutBox11 />}
            </section>

            <section id="ff-co-social" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.Globe size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Social links" action={<CategoryToggle sectionKey="co_social" defaultOpen={false} />} />
              {vis("co_social") && (
                <SocialEdit11 value={soc} onChange={(socials) => dispatch({ type: "COMPANY_SAVE", company: { socials } })} />
              )}
            </section>

            <section id="ff-co-info" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.FileText size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="More information" count={(c.info || []).length} action={<CategoryToggle sectionKey="co_info" defaultOpen={false} />} />
              {vis("co_info") && <InfoBuilder17 />}
            </section>

            {recSection("contact")}
            {recSection("locations")}
            {recSection("venues")}
            {recSection("documents")}

            <section id="ff-co-terms" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.FileText size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Terms and conditions" count={1 + companyDocs(c).length + (c.tcDocs || []).length}
                action={<CategoryToggle sectionKey="co_terms" defaultOpen={false} />} />
              {vis("co_terms") && (
                <HScroll label="Terms and conditions">
                  {termsRecs.map(r => <InformationCard key={r.id} record={r} def={termsDef} themeKey="onyx" editable onClick={() => setTermsOpen(true)} />)}
                </HScroll>
              )}
            </section>

            {state.auth && state.auth.status === "signedIn" && <CompanyFavs17 />}

          </>)}

          {tab === "services" && (<>
            <section id="ff-co-svc" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.Sparkles size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={<SoonTitle17>Packages</SoonTitle17>} count={cards.services.length} action={<CategoryToggle sectionKey="co_svc" defaultOpen={false} />} />
              {vis("co_svc") && <Studio17 type="service" site="FF Staff" by={String(c.name || "").trim() || "You"} tag={c.slug || "yourbusiness"} k="coServices17" seed={seeds.service} />}
            </section>
            <section id="ff-co-ck" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.Martini size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={<SoonTitle17>Cocktails</SoonTitle17>} count={cards.cocktails.length} action={<CategoryToggle sectionKey="co_ck" defaultOpen={false} />} />
              {vis("co_ck") && <Studio17 type="cocktail" site="FF Staff" by={String(c.name || "").trim() || "You"} tag={c.slug || "yourbusiness"} k="coCocktails17" seed={seeds.cocktail} />}
            </section>
            <section id="ff-co-questions" style={{ marginTop: 22 }}>
              <SectionHead icon={<I11.MessageSquare size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Q&A" count={coQa(c).length} action={<CategoryToggle sectionKey="co_qa" defaultOpen={false} />} />
              {vis("co_qa") && <CompanyQA11 c={c} />}
            </section>
          </>)}

          {tab === "team" && (
            <section style={{ marginTop: 18 }}>
              {team.length ? (
                <HScroll label="Your team">
                  {team.map(p => <PlayerTile key={p.id} person={p} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
                </HScroll>
              ) : <p className="ff-body ff-muted" style={{ margin: 0 }}>Everyone you book joins your team, so you can rebook them in a tap.</p>}
              <div style={{ marginTop: 12 }}><Btn variant="sm ghost" onClick={() => dispatch({ type: "TAB", tab: "network" })}>Find more</Btn></div>
              <div style={{ marginTop: 22 }}>
                <SectionHead icon={<I11.Briefcase size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Companies" count={partners.length} />
                {partners.length > 0 && <CoTiles17 list={partners} />}
                <div style={{ marginTop: 12 }}><Btn variant="sm ghost" onClick={() => setPicking(true)}><I11.Plus size={13} /> Add companies</Btn></div>
              </div>
              <PartnerPick17 open={picking} onClose={() => setPicking(false)} />
            </section>
          )}

          {tab === "reviews" && (
            <section id="ff-co-reviews" style={{ marginTop: 18 }}>
              {reviews.length ? (
                <HScroll label="Reviews">
                  {reviews.map((r, i) => <InformationCard key={r.id} record={r} def={BASE_CATEGORIES.reviews} themeKey="onyx" highlight={i < 3} rank={cardRank(i)} />)}
                </HScroll>
              ) : <p className="ff-body ff-muted" style={{ margin: 0 }}>No reviews yet. Staff review you after each booking.</p>}
            </section>
          )}
        </div>
      </div>

      <GenericAttributeCardCreator owner="company" open={!!openRec} record={openRec && openRec.record} def={openRec && openRec.def} category={openRec && openRec.category}
        readOnly={!!(openRec && openRec.record && openRec.record.readOnly)} onClose={() => setOpenRec(null)} />
      <GenericAttributeCardCreator owner="company" open={!!addingTo} record={null} category={addingTo} def={addingTo ? COMPANY_CATEGORIES[addingTo] : null}
        onClose={() => setAddingTo(null)} />

      <TermsSheet11 open={termsOpen} onClose={() => setTermsOpen(false)} />
    </>
  );
}
