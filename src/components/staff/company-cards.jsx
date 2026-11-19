/* src/components/staff/company-cards.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COMPANY CARD (v1.1) — three layouts under the colours: Classic, Big logo
   and Centred. "What areas do you cover" replaces "Where you're based".
   ========================================================================== */
const CC_LAYOUTS = [
  { key: "classic", name: "Classic" },
  { key: "logo", name: "Big logo" },
  { key: "centre", name: "Centred" },
  { key: "banner", name: "Banner" },
];


/* v17.20: the text block shrinks (never wraps inside a word, never cut with "…") until it fits the card. The tagline keeps to
   one line in the Banner layout and only wraps, between words, when it still does not fit at the smallest size. */
function useCardFit20(ref, sig, off) {
  useLayoutEffect(() => {
    const body = ref.current, tx = body && body.querySelector(".ff-cc11-tx");
    if (!body || !tx || off) return;
    let raf = 0;
    const over = () => body.scrollHeight > body.clientHeight + 1 || tx.scrollWidth > tx.clientWidth + 1;
    const fit = () => {
      tx.classList.remove("wr"); tx.style.zoom = "";
      for (let pass = 0; pass < 2; pass++) {
        let z = 1;
        while (over() && z > 0.55) { z = Math.round((z - 0.04) * 100) / 100; tx.style.zoom = z; }
        if (!over()) return;
        tx.classList.add("wr"); tx.style.zoom = "";
      }
    };
    fit();
    const ro = window.ResizeObserver ? new ResizeObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(fit); }) : null;
    if (ro) ro.observe(body);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    const late = setTimeout(fit, 600);
    return () => { if (ro) ro.disconnect(); clearTimeout(late); cancelAnimationFrame(raf); };
  }, [sig, off]);
}


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
function SocialEdit11({ value, onChange, noPhone }) {
  const v = value || {};
  return (
    <div className="ff-soc11-edit">
      {SOC11.filter(x => !(noPhone && x.k === "whatsapp")).map(x => (
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
    /* v17.18: the WhatsApp number is not asked for or shown here (it comes from the account); a stored value is kept. */
    const s = person && person.socials ? { ...person.socials, whatsapp: undefined } : null;
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
      {open && <SocialEdit11 noPhone value={(state.profile || {}).socials} onChange={(socials) => dispatch({ type: "PROFILE", patch: { socials } })} />}
    </section>
  );
}


const socialValues11 = (co) => {
  const s = { ...((co && co.socials) || {}) };
  ((co && co.contact) || []).forEach(([k, v]) => { const m = SOC11.find(x => new RegExp(x.label, "i").test(k)); if (m && !s[m.k]) s[m.k] = v; });
  coRecsOf17(co, "contact").forEach((r) => { const m = coKindOf17(r.description).soc; if (m && !r.hidden && !s[m] && String(r.name || "").trim()) s[m] = r.name; });
  return s;
};
const socialsOf11 = (co) => { const s = socialValues11(co); return SOC11.filter(x => String(s[x.k] || "").trim()).map(x => x.k); };



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


const qaShown = (q) => (q.answer ? (q.note ? `${q.answer} — ${q.note}` : q.answer) : String(q.note || "").trim());







function CompanyCardFace({ c, edit, set, onLogo, size = "", party, links }) {
  const co = c || {};
  const t = THEMES[co.theme] || THEMES.onyx;
  const layout = (!co.layout || co.layout === "crest") ? "logo" : co.layout;
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
    : (String(co.kind || "").trim() ? <span className="kd kd2"><I11.Briefcase size={12} /><span>{co.kind}</span></span> : null);
  const area = (edit || String(areas || "").trim()) ? (
    <span className="ar"><I11.MapPin size={12} /><span>{areas || "Where you're based"}</span></span>
  ) : null;
  const sv = socialValues11(co);
  const bodyRef = useRef(null);
  useCardFit20(bodyRef, [co.name, co.kind, areas, layout, size, co.logoWide, socialsOf11(co).join(), edit].join("|"), !!edit);
  /* v17.20: a claimed company has no plate; the FIREFLAIR logo sits top right instead (the VIP Host Card keeps its plate). v17.34: no FIREFLAIR word in the footer. */
  /* v1.45 (Alex, 18 Nov 20:12): a company whose card data sets plate (Vooshka for now) shows the Company Card plate and no FF logo, like the directory. */
  const claimed = !co.unclaimed && !co.plate;
  const urlText = `${CARD_DOMAIN}/${slug}`;
  const urlFs = `min(3.3cqw, ${((claimed ? 56 : 86) / Math.max(12, urlText.length * 0.62)).toFixed(2)}cqw)`;
  return (
    <CardFrame tier={(co.theme === "silver" || co.theme === "gold") ? co.theme : (co.tier || "gold")} theme={t} premium ratio="8 / 5" className={`ff-cocard ff-cc11 l-${layout} ${size}${co.logoWide ? " lw" : ""}`} style={{ ...vars, maxWidth: 460, margin: size ? 0 : "0 auto" }}>
      {(!claimed || party) && <span className="ff-pc-plate ff-cc11-plate">{party ? "VIP Host Card" : <>{React.createElement((typeof NET_CAT_VIEW17 !== "undefined" && I11[(NET_CAT_VIEW17[co.cat || "bar"] || [])[0]]) || I11.Briefcase, { size: 12, color: "currentColor", "aria-hidden": "true" })}Company</>}</span>}
      {claimed && <span className="ff-cc11-coin"><FFLogo size="100%" tier={co.theme === "silver" ? "silver" : "gold"} /></span>}
      <div className="ff-cc11-body" ref={bodyRef}>
        {logo}
        <span className="ff-cc11-tx">{name}{kind}{area}{socialsOf11(co).length > 0 && <span className="soc">{socialsOf11(co).map(k => { const lb = (SOC11.find(x => x.k === k) || {}).label, ic = <SocialIcon11 k={k} size={size ? 11 : 15} />; return links ? <a key={k} className="si" title={lb} aria-label={lb} href={coContactHref17(lb, sv[k])} target="_blank" rel="noopener noreferrer">{ic}</a> : <span key={k} className="si" title={lb}>{ic}</span>; })}</span>}</span>
      </div>
      <div className="ff-cc11-foot" style={{ background: t.dark ? "rgba(0,0,0,.45)" : "#141416" }}>
        <span className="url" style={{ fontSize: urlFs }}>{urlText}</span>
      </div>
    </CardFrame>
  );
}



function EditableCompanyCard({ plain, noType }) {
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
      {!party && !noType && <div className="ff-cotype17" role="group" aria-label="Company type">
        {[["limited", "Limited company"], ["sole", "Sole trader"]].map(([k, l]) => (
          <button key={k} type="button" aria-pressed={c.companyType === k} onClick={() => set({ companyType: k })}>{l}</button>
        ))}
      </div>}
      {!plain && <>
      <div className="ff-swatches" role="group" aria-label="Card colour">
        {Object.entries(THEMES).map(([k, th]) => (
          <button key={k} type="button" className="ff-swatch" aria-pressed={(c.theme || "onyx") === k} aria-label={`${th.name} card`} title={th.name}
            style={{ background: th.swatch }} className={`ff-swatch${th.locked ? " ff-swatch-lock" : ""}`} onClick={() => { if (th.locked) previewTheme17(k, c.theme || "onyx", (v) => set({ theme: v })); else { clearPv17(); set({ theme: k }); } }}>{th.locked ? <I11.Lock size={13} /> : null}</button>
        ))}
      </div>
      <div className="ff-cc11-layouts" role="group" aria-label="Card layout">
        {CC_LAYOUTS.map(l => (
          <button key={l.key} type="button" aria-label={`${l.name} layout`} title={`${l.name} layout`} aria-pressed={((!c.layout || c.layout === "crest") ? "logo" : c.layout) === l.key} onClick={() => set({ layout: l.key })}>
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
    /* Back with the phone number of an earlier claim: the page comes back as it was left, with its status. */
    const prior = !signedIn && (state.coClaims17 || []).find((x) => phoneOk && CLAIM_DIG17(x.phone) === CLAIM_DIG17(phone));
    if (prior) {
      dispatch({ type: "CLAIM17_RESTORE", id: prior.id });
      dispatch({ type: "COMPANY_SIGNED_IN", slug: prior.slug });
      dispatch({ type: "TOAST", toast: `Welcome back to ${site.name}` });
      setStage("details"); setCode("");
      return;
    }
    /* Claim this profile: the company starts as the directory page, the way the agent left it. */
    const claimSlug = state.session && state.session.claimSlug;
    if (claimSlug && !signedIn) {
      dispatch({ type: "CLAIM17_NEW", slug: claimSlug, phone: phoneOk ? String(phone).trim() : "" });
      dispatch({ type: "COMPANY_SAVE", company: { email: emailOk ? String(email).trim() : "", tcMode: "template", questions: CO_QA_SEED.map((q) => ({ ...q })) } });
      dispatch({ type: "COMPANY_SIGNED_IN", slug: claimSlug });
      dispatch({ type: "TOAST", toast: `Welcome to ${site.name}` });
      setStage("details"); setCode("");
      return;
    }
    dispatch({ type: "COMPANY_SAVE", company: {
      slug,
      theme: c.theme || "onyx",
      layout: (!c.layout || c.layout === "crest") ? "logo" : c.layout,
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



/* Find your company: part of its name shows its Company Card; choosing it opens its page, where Claim this profile is. Closed until opened. */
function CoFind17() {
  const { state, dispatch } = useStore();
  const [q, setQ] = useState("");
  const t = q.trim().toLowerCase();
  const hits = t.length < 2 ? [] : [...REAL_COMPANIES11, ...REAL_SUPPLIERS17].filter((r) => r.slug !== "vooshka" && String(r.name || "").toLowerCase().includes(t)).slice(0, 6)
    .map((r) => companyById(state, "co_" + r.slug)).filter((c) => c && c.unclaimed);
  return (
    <VkFold17 title="Find your company">
      <div className="ff-cofind17">
        <label className="ff-cofind17-q"><I11.Search size={15} /><input value={q} onChange={(e) => setQ(e.target.value.slice(0, 60))} aria-label="Find your company" autoComplete="off" /></label>
        <div className="ff-cofind17-res">
          {hits.map((c) => <button key={c.id} type="button" className="ff-co11-tile" aria-label={c.name} onClick={() => { dispatch({ type: "VIEW_COMPANY", id: c.id }); window.scrollTo(0, 0); }}><CompanyCardFace c={c} size="sm" /></button>)}
        </div>
      </div>
    </VkFold17>
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



/* A text box that grows with its content, so nothing scrolls inside it. */
function AutoText17({ value, onChange, onBlur, rows = 3, className = "ff-input", ...rest }) {
  const ref = useRef(null);
  const fit = () => { const el = ref.current; if (!el) return; el.style.height = "auto"; el.style.height = el.scrollHeight + 2 + "px"; };
  React.useLayoutEffect(fit, [value]);
  useEffect(() => { window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit); }, []);
  return <textarea ref={ref} className={className + " ff-autotext"} rows={rows} value={value} onChange={onChange} onBlur={onBlur} {...rest} />;
}


/* About: just a box you type in. It saves as you leave it. */
function AboutBox11() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [t, setT] = useState(c.description || "");
  useEffect(() => { setT(c.description || ""); }, [c.description]);
  return <AutoText17 className="ff-input ff-aboutbox" rows={4} value={t} aria-label="About" placeholder="A mobile cocktail bar bringing exquisite drinks and a warm welcome to weddings and parties across the UK."
    onChange={(e) => setT(e.target.value)} onBlur={() => { if (t.trim() !== (c.description || "")) dispatch({ type: "COMPANY_SAVE", company: { description: t.trim() } }); }} />;
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
