/* src/components/staff/company-builder17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   THE COMPANY BUILDER (v17.7) — the builder is the page.

   In edit mode the owner sees the company page in the public order and types straight onto it:
     Photos, About, Contact, Areas covered, the company's own sections,
     then the groups Packages (Packages, Cocktails, Q&A, locked card builders), Reviews, Team,
     and Private (Company details, Documents, Terms and conditions, Favourites; never on the public page).
   A pop-up is used for one card at a time only, with the FF Team card tool (GenericAttributeCardCreator).
   Examples in placeholders do the guiding. Everything saves as you type; Cancel on the Live Action Bar restores it all.
   The stored shape is unchanged (docs/company-profile-format.md): company.info[], records["info_<id>"], records.contact, socials.
   ========================================================================== */
const CoIc17 = {
  Up: lucideIcon("ChevronUp"), Down: lucideIcon("ChevronDown"), Tags: lucideIcon("Tags"), List: lucideIcon("ListOrdered"),
  Images: lucideIcon("Images"), Sparkles: lucideIcon("Sparkles"), Plus: lucideIcon("Plus"), Award: lucideIcon("Award"),
  Trash: lucideIcon("Trash2"), X: lucideIcon("X"), Check: lucideIcon("Check"),
};


/* One short line made only of the company's own words, cut between words. */
function coQuiet17(text, max = 90) {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), 20)).replace(/[\s,;:.\-–—]+$/, "") + "…";
}


/* The first three card titles, joined. */
const coTitles17 = (list) => coQuiet17(rankedRecords(list || []).filter((r) => !r.hidden && !r.proposed).map((r) => String(r.name || "").trim()).filter(Boolean).slice(0, 3).join(" · "), 110);


/* What a closed own section shows under its title: its card titles, else its bold line, text or tags. */
function coSecQuiet17(c, sec) {
  const t = coTitles17(coSecAll17(c, sec));
  if (t) return t;
  const lead = String(sec.lead || "").trim();
  if (lead) return coQuiet17(lead);
  const line = String(sec.text || "").split("\n").map((x) => x.trim()).find(Boolean);
  if (line) return coQuiet17(line);
  return coQuiet17((sec.chips || []).filter(Boolean).slice(0, 3).join(" · "));
}


const coIsOpen17 = (state, key) => state.categoryVisibility["co_" + key] === true;


/* A closed row: its title, a count when there is one, one quiet line, a small "+" that opens it and starts adding, and the open/close control. */
function CoRow17({ id, icon, title, count, quiet, onPlus, children, head }) {
  const { state, dispatch } = useStore();
  const open = coIsOpen17(state, id);
  const plus = onPlus ? (
    <button type="button" className="ff-co17-plus" aria-label={`Add to ${typeof title === "string" ? title : "this section"}`}
      onClick={() => { dispatch({ type: "TOGGLE_CATEGORY", key: "co_" + id, visible: true }); onPlus(); }}><I11.Plus size={14} /></button>
  ) : null;
  return (
    <section id={"ff-co-" + id} className="ff-co17-row">
      {head ? head(open, plus) : <SectionHead icon={icon} title={title} count={count > 0 ? count : undefined}
        action={<span className="ff-co17-acts">{plus}<CategoryToggle sectionKey={"co_" + id} defaultOpen={false} /></span>} />}
      {quiet && !open ? <p className="ff-co17-quiet">{quiet}</p> : null}
      {open ? <div className="ff-co17-body">{children}</div> : null}
    </section>
  );
}


const coGroup17 = (label) => <h3 className="ff-co17-group">{label}</h3>;


const coHead17 = (Ic) => <Ic size={15} color="var(--gold-dk)" strokeWidth={1.6} />;


/* ---- About ---------------------------------------------------------------- */
function CoAbout17() {
  const { state } = useStore();
  const c = state.company || {};
  const first = String(c.description || "").split("\n").map((x) => x.trim()).find(Boolean);
  return (
    <CoRow17 id="about" icon={coHead17(I11.Briefcase)} title="About" quiet={coQuiet17(first)}
      onPlus={() => setTimeout(() => { const t = document.querySelector("#ff-co-about textarea"); if (t) t.focus(); }, 60)}>
      <AboutBox11 />
    </CoRow17>
  );
}


/* ---- Contact: pick a kind, type the value in one box ----------------------- */
function CoKindIcon17({ kind, size = 17 }) {
  const k = coKindOf17(kind);
  if (k.soc) return <SocialIcon11 k={k.soc} size={size} />;
  const Ic = k.kind === "Email" ? I11.Mail : k.kind === "Phone" ? I11.Phone : I11.Globe;
  return <Ic size={size} />;
}


function CoContact17() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const cards = rankedRecords(coRecsOf17(c, "contact")).filter((r) => !r.hidden);
  const [kind, setKind] = useState("");
  const [val, setVal] = useState("");
  const k = CO_CONTACT_KINDS17.find((x) => x.kind === kind);
  const add = () => {
    const v = val.trim();
    if (!k || !v) return;
    dispatch({ type: "REC_ADD", owner: "company", category: "contact", record: makeRecord("contact", v, { description: k.kind }) });
    setKind(""); setVal("");
  };
  return (
    <CoRow17 id="contact" icon={coHead17(I11.MessageCircle)} title="Contact" count={cards.length}
      quiet={coQuiet17(cards.slice(0, 3).map((r) => r.name).join(" · "), 110)}
      onPlus={() => {}}>
      {cards.length > 0 && (
        <ul className="ff-co17-contacts">
          {cards.map((r) => (
            <li key={r.id}>
              <span className="ic" aria-hidden="true"><CoKindIcon17 kind={r.description} /></span>
              <label className="fld"><small>{r.description || "Contact"}</small>
                <input className="ff-input" value={r.name} aria-label={`${r.description || "Contact"} contact`} autoCapitalize="none" spellCheck={false}
                  placeholder={coKindOf17(r.description).ph}
                  onChange={(e) => dispatch({ type: "REC_PATCH", owner: "company", category: "contact", id: r.id, patch: { name: e.target.value.slice(0, 120) } })} /></label>
              <button type="button" className="rm" aria-label={`Remove ${r.description || "contact"} ${r.name}`}
                onClick={() => dispatch({ type: "REC_DELETE", owner: "company", category: "contact", id: r.id })}><CoIc17.X size={14} /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="ff-co17-kinds" role="group" aria-label="Kind of contact">
        {CO_CONTACT_KINDS17.map((x) => (
          <button key={x.kind} type="button" aria-label={x.kind} title={x.kind} aria-pressed={kind === x.kind}
            onClick={() => { setKind(kind === x.kind ? "" : x.kind); setVal(""); }}><CoKindIcon17 kind={x.kind} size={19} /></button>
        ))}
      </div>
      {k ? (
        <div className="ff-co17-addval">
          <input className="ff-input" value={val} autoFocus={FF_FINE_POINTER} aria-label={`Add ${k.kind}`} placeholder={k.ph} autoCapitalize="none" spellCheck={false}
            onChange={(e) => setVal(e.target.value.slice(0, 120))} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} />
          <button type="button" className="go" aria-label={`Add ${k.kind} contact`} disabled={!val.trim()} onClick={add}><CoIc17.Check size={17} /></button>
        </div>
      ) : null}
    </CoRow17>
  );
}


/* Anything on the Company Card's social links without a contact card of its kind becomes one, so each shows once. */
function useCoContactMerge17() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  useEffect(() => {
    const s = c.socials || {};
    const cards = coRecsOf17(c, "contact");
    SOC11.forEach((x) => {
      const v = String(s[x.k] || "").trim();
      if (v && !cards.some((r) => coKindOf17(r.description).soc === x.k && !r.hidden)) dispatch({ type: "REC_ADD", owner: "company", category: "contact", record: makeRecord("contact", v, { description: x.label }) });
    });
  }, [c.socials, coRecsOf17(c, "contact").length]);
}


/* ---- The company's own sections ------------------------------------------- */
let CO_FOCUS17 = null;


/* Many photos at once: one card each, titled with the file name without its extension. */
async function coBulkAdd17(state, dispatch, category, fileList) {
  const files = [...(fileList || [])].filter((f) => /^image\//.test(f.type));
  if (!files.length) return;
  const made = (await Promise.all(files.map(async (f) => {
    try {
      const dataUrl = await shrinkPhoto(f, 900);
      return makeRecord(category, coTitleOfFile17(f.name), { media: [{ id: uid("med"), name: f.name, dataUrl }] });
    } catch (err) { return null; }
  }))).filter(Boolean);
  if (!made.length) return;
  dispatch({ type: "REC_BULK", owner: "company", category, list: addRanked(coRecsOf17(state.company, category), made) });
}


function CoAddTile17({ label, onClick, icon: Ic = I11.Plus, children }) {
  return (
    <button type="button" className="ff-card ff-addtile" aria-label={label} onClick={onClick} style={{ width: CARD_W.info, aspectRatio: "1 / 1", borderRadius: 22 }}>
      <span style={{ textAlign: "center" }}>
        <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, margin: "0 auto", border: "1px solid var(--gold-dk)", borderRadius: 12 }}><Ic size={20} color="var(--gold-dk)" /></span>
        <span className="ff-label" style={{ display: "block", marginTop: 8 }}>{label}</span>
      </span>
      {children}
    </button>
  );
}


/* Tags as chips, with an inline "+" chip that takes the next one. */
function CoChips17({ value, onChange, placeholder }) {
  const [t, setT] = useState("");
  const list = value || [];
  const add = (raw) => {
    const v = String(raw == null ? t : raw).trim();
    if (!v) { setT(""); return; }
    if (!list.includes(v) && list.length < 30) onChange([...list, v]);
    setT("");
  };
  return (
    <div className="ff-co17-chips">
      {list.map((v) => <span key={v} className="chip">{v}<button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(list.filter((x) => x !== v))}><CoIc17.X size={10} /></button></span>)}
      <label className="chip add">
        <CoIc17.Plus size={12} />
        <input value={t} aria-label="Add a tag" placeholder={list.length ? "" : placeholder} size={Math.max(t.length + 1, list.length ? 2 : placeholder.length)} autoCapitalize="sentences" spellCheck={false}
          onChange={(e) => { const v = e.target.value; if (/[,\n]$/.test(v)) add(v.slice(0, -1)); else setT(v.slice(0, 40)); }}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} onBlur={() => add()} />
      </label>
    </div>
  );
}


function CoSection17({ sec, index, count, onOpenCard, onAddCard }) {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const id = coInfoKey17(sec.id);
  const open = coIsOpen17(state, id);
  const st = coStarterOf17(sec);
  const ph = st.ph;
  const cards = coSecAll17(c, sec);
  const shown = cards.filter((r) => !r.hidden && !r.proposed).length;
  const def = coInfoDef17(sec);
  const [sure, setSure] = useState(false);
  const titleRef = useRef(null);
  const patch = (p) => dispatch({ type: "CO_SEC_PATCH", id: sec.id, patch: p });
  useEffect(() => { if (open && CO_FOCUS17 === sec.id) { CO_FOCUS17 = null; if (titleRef.current) titleRef.current.focus(); } }, [open]);
  useEffect(() => { if (!sure) return; const t = setTimeout(() => setSure(false), 3500); return () => clearTimeout(t); }, [sure]);
  const head = (isOpen, plus) => (
    <div className="ff-secthead ff-co17-head">
      <CatIcon kind="qualification" size={15} color="var(--gold-dk)" />
      {isOpen
        ? <input ref={titleRef} className="ff-h2 ff-co17-title" value={sec.title || ""} placeholder={ph.title} aria-label="Section title" maxLength={60} onChange={(e) => patch({ title: e.target.value })} />
        : <span className="ff-h2">{sec.title || ph.title}</span>}
      {shown > 0 ? <span className="ff-pill">{shown}</span> : null}
      {isOpen ? null : <span className="line" />}
      <span className="ff-co17-acts">{plus}<CategoryToggle sectionKey={"co_" + id} defaultOpen={false} /></span>
    </div>
  );
  return (
    <CoRow17 id={id} head={head} quiet={coSecQuiet17(c, sec)} onPlus={() => onAddCard({ key: id, def })}>
      <div className="ff-co17-panel">
        <div className="ff-co17-tools" role="group" aria-label="Section tools">
          <button type="button" role="switch" aria-checked={!!sec.numbered} className={"sw" + (sec.numbered ? " on" : "")} onClick={() => patch({ numbered: !sec.numbered })}><i aria-hidden="true" /><span>Numbered</span></button>
          <button type="button" aria-label="Move section up" disabled={index <= 0} onClick={() => dispatch({ type: "CO_SEC_MOVE", id: sec.id, dir: -1 })}><CoIc17.Up size={16} /></button>
          <button type="button" aria-label="Move section down" disabled={index >= count - 1} onClick={() => dispatch({ type: "CO_SEC_MOVE", id: sec.id, dir: 1 })}><CoIc17.Down size={16} /></button>
          <button type="button" className={"del" + (sure ? " sure" : "")} aria-label="Delete section" onClick={() => { if (!sure) { setSure(true); return; } dispatch({ type: "CO_SECTION_DELETE", id: sec.id }); }}><CoIc17.Trash size={15} />{sure ? <span>Delete</span> : null}</button>
        </div>
        <input className="ff-co17-lead" value={sec.lead || ""} placeholder={ph.lead} aria-label="Bold line" maxLength={120} onChange={(e) => patch({ lead: e.target.value })} />
        <AutoText17 className="ff-input ff-co17-text" rows={2} value={sec.text || ""} placeholder={ph.text} aria-label="Text" onChange={(e) => patch({ text: e.target.value })} />
        <CoChips17 value={sec.chips || []} onChange={(chips) => patch({ chips })} placeholder={ph.chip} />
        <HorizontalCardRanker items={cards} label={sec.title || ph.title}
          renderCard={(r, rank) => <GenericAttributeCard record={r} def={def} themeKey="onyx" rank={rank} editable onClick={() => onOpenCard({ record: r, def, category: id })} />}
          tail={[<CoAddTile17 key="add" label="Add card" onClick={() => onAddCard({ key: id, def })} />, <CoBulk17 key="more" category={id} />]} />
        <input className="ff-co17-quote" value={sec.quote || ""} placeholder={ph.quote} aria-label="Closing line" maxLength={160} onChange={(e) => patch({ quote: e.target.value })} />
      </div>
    </CoRow17>
  );
}


function CoBulk17({ category }) {
  const { state, dispatch } = useStore();
  const ref = useRef(null);
  return (
    <CoAddTile17 label="Add photos" icon={I11.ImagePlus} onClick={() => ref.current && ref.current.click()}>
      <input ref={ref} type="file" accept="image/*" multiple hidden onClick={(e) => e.stopPropagation()} onChange={(e) => { const f = e.target.files; coBulkAdd17(state, dispatch, category, f); e.target.value = ""; }} />
    </CoAddTile17>
  );
}


/* "Add a section": a row of starter tiles. Each makes a section already set up, with examples as placeholders. */
function CoStarters17({ onMade }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const made = useRef(null);
  const Ic = { Sparkles: CoIc17.Sparkles, ListOrdered: CoIc17.List, Images: CoIc17.Images, Tags: CoIc17.Tags, Award: CoIc17.Award, Plus: CoIc17.Plus };
  const make = (st) => {
    const sec = { id: uid("info"), title: st.title, ...(st.numbered ? { numbered: true } : {}) };
    CO_STARTER_OF17[sec.id] = st.key;
    dispatch({ type: "CO_SEC_ADD", sec });
    dispatch({ type: "TOGGLE_CATEGORY", key: "co_" + coInfoKey17(sec.id), visible: true });
    setOpen(false);
    if (st.key === "own") CO_FOCUS17 = sec.id;
    if (st.bulk) { made.current = coInfoKey17(sec.id); if (ref.current) ref.current.click(); }
    if (onMade) onMade(sec);
    setTimeout(() => { const el = document.getElementById("ff-co-" + coInfoKey17(sec.id)); if (el && el.scrollIntoView) el.scrollIntoView({ block: "start", behavior: "smooth" }); }, 120);
  };
  return (
    <div className="ff-co17-starters">
      <button type="button" className="ff-co17-addsec" aria-expanded={open} onClick={() => setOpen(!open)}><CoIc17.Plus size={15} /> Add a section</button>
      {open ? (
        <HScroll label="Section starters">
          {CO_STARTERS17.map((st) => { const I = Ic[st.icon] || CoIc17.Plus; return (
            <button key={st.key} type="button" className="ff-co17-tile" onClick={() => make(st)}>
              <span className="ic" aria-hidden="true"><I size={22} /></span><b>{st.name}</b>
            </button>); })}
        </HScroll>
      ) : null}
      <input ref={ref} type="file" accept="image/*" multiple hidden aria-label="Gallery photos" onChange={(e) => { const f = e.target.files; if (made.current) coBulkAdd17(state, dispatch, made.current, f); e.target.value = ""; }} />
    </div>
  );
}


/* ---- Reviews from bookings (read only) ------------------------------------- */
function CoBookingReviews17({ c }) {
  const reviews = (c.reviews || []).map((r) => ({ ...makeRecord("reviews", r.byName), id: r.id, description: r.text, rating: r.rating, readOnly: true }));
  return (
    <CoRow17 id="booking_reviews" icon={<CatIcon kind="reviews" size={15} color="var(--gold-dk)" />} title="Reviews from bookings" count={reviews.length} quiet={coQuiet17(reviews.slice(0, 3).map((r) => r.name).join(" · "), 110)}>
      {reviews.length ? (
        <HScroll label="Reviews from bookings">
          {reviews.map((r, i) => <InformationCard key={r.id} record={r} def={BASE_CATEGORIES.reviews} themeKey="onyx" highlight={i < 3} rank={cardRank(i)} />)}
        </HScroll>
      ) : null}
    </CoRow17>
  );
}


/* ---- Team: the people who joined ------------------------------------------ */
function coMembers17(state, co, all) {
  const ck = coKey17(co);
  return [...new Set([...(co.team || []), ...(ck ? ctMembers17(state, ck) : [])])].map((id) => findPerson(all, state, id)).filter((p) => p && !p.isCompany);
}


function CoTeam17() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [inviting, setInviting] = useState(false);
  const [picking, setPicking] = useState(false);
  const c = state.company || {};
  const key = myCoKey17(state);
  const members = coMembers17(state, c, all);
  const pending = key ? ctPending17(state, key) : [];
  const partners = coPartners17(state, { mine: true });
  const sel = state.selection || [];
  return (
    <>
      <CoRow17 id="team" icon={coHead17(I11.Users)} title="Team" count={members.length} quiet={coQuiet17(members.slice(0, 3).map((p) => p.name).join(" · "), 110)} onPlus={key ? () => setInviting(true) : undefined}>
        <style>{CT17_CSS}</style>
        <HScroll label="Your team">
          {members.map((p) => <PlayerTile key={p.id} person={p} selected={sel.includes(p.id)} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
          {key ? <button type="button" className="ff-card ff-portrait ff-addtile" style={{ width: CARD_W.player }} onClick={() => setInviting(true)}>
            <span style={{ textAlign: "center" }}><I11.UserPlus size={20} color="var(--gold-dk)" /><span className="ff-label" style={{ display: "block", marginTop: 6 }}>Invite your team</span></span>
          </button> : null}
        </HScroll>
        {pending.length > 0 && <ul className="ff-ct17-pend" aria-label="Waiting for a reply">{pending.map((x) => <li key={x.id}><b>{x.name || (findPerson(all, state, x.personId) || {}).name || x.phone}</b><small>{x.dir === "invite" ? "Invited" : "Asked to join"}</small></li>)}</ul>}
      </CoRow17>
      <CoRow17 id="partners" icon={coHead17(I11.Briefcase)} title="Companies" count={partners.length} quiet={coQuiet17(partners.slice(0, 3).map((p) => p.name).join(" · "), 110)} onPlus={() => setPicking(true)}>
        {partners.length > 0 ? <CoTiles17 list={partners} /> : null}
        <div style={{ marginTop: 10 }}><Btn variant="sm ghost" onClick={() => setPicking(true)}><I11.Plus size={13} /> Add companies</Btn></div>
      </CoRow17>
      <PartnerPick17 open={picking} onClose={() => setPicking(false)} />
      {key ? <InviteTeamSheet17 open={inviting} onClose={() => setInviting(false)} companyKey={key} /> : null}
    </>
  );
}


/* ---- Private: Company details --------------------------------------------- */
function CoDetails17() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [draft, setDraft] = useState(c.slug || "");
  useEffect(() => { setDraft(c.slug || ""); }, [c.slug]);
  const clean = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
  const change = (v) => {
    const s = clean(v);
    setDraft(s);
    if (coSlugFree17(s, c.slug) && s !== c.slug) dispatch({ type: "CO_SLUG_SET", slug: s });
  };
  const type = c.companyType === "limited" ? "Limited company" : c.companyType === "sole" ? "Sole trader" : "";
  return (
    <CoRow17 id="details" icon={coHead17(I11.Briefcase)} title="Company details" quiet={coQuiet17([type, c.slug && `${CARD_DOMAIN}/${c.slug}`].filter(Boolean).join(" · "), 110)}>
      <div className="ff-cotype17" role="group" aria-label="Company type">
        {[["limited", "Limited company"], ["sole", "Sole trader"]].map(([k, l]) => (
          <button key={k} type="button" aria-pressed={c.companyType === k} onClick={() => dispatch({ type: "COMPANY_SAVE", company: { companyType: k } })}>{l}</button>
        ))}
      </div>
      <div className="ff-co17-addr">
        <TagInput value={draft} onChange={change} check label="Company address" placeholder="yourcompany" cleanWith={clean} freeCheck={(s) => coSlugFree17(s, c.slug)} minLength={3} maxLength={40} />
      </div>
    </CoRow17>
  );
}


/* ---- The builder ----------------------------------------------------------- */
function CompanySections() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const c = state.company || {};
  const [openRec, setOpenRec] = useState(null);
  const [addingTo, setAddingTo] = useState(null);
  const [termsOpen, setTermsOpen] = useState(false);
  const [qaAdd, setQaAdd] = useState(0);
  const info = c.info || [];
  useEffect(() => { if (info.some((x) => x && x.items && x.items.length)) dispatch({ type: "CO_INFO_MIGRATE" }); }, [info]);
  useCoContactMerge17();
  const cards = coCards17(state, { mine: true });
  const seeds = coSeeds17(state);
  const vis = (k) => state.categoryVisibility[k] === true;
  const signedIn = state.auth && state.auth.status === "signedIn";
  const termsRecs = [{ ...makeRecord("terms", "T&Cs"), id: "co_tcs", description: "Your five terms, sent with every Service Card. Tap to view or edit." }];
  const termsDef = { label: "Terms and conditions", singular: "Terms", icon: "qualification", fields: ["description"] };
  const qa = coQa(c).filter((q) => q.group !== "feedback" && (q.answer || String(q.note || "").trim()));
  const hasVenues = coRecsOf17(c, "venues").length > 0;
  const recSection = (k) => (
    <ProfileAttributeSection key={k} catKey={k} def={COMPANY_CATEGORIES[k]} list={recsOf(c, k)} isMe shade="onyx" owner="company" hideZero
      quiet={k === "locations" ? coQuiet17(companyLocations(c).join(" · "), 110) : coTitles17(recsOf(c, k))}
      plus={() => { if (k !== "locations") setAddingTo(k); }}
      onOpen={(r) => setOpenRec({ record: r, def: COMPANY_CATEGORIES[k], category: k })} onAdd={() => setAddingTo(k)} />
  );
  const docs = companyDocs(c);
  return (
    <div className="ff-co17">
      <section id="ff-co-media" style={{ marginTop: 22 }}>
        <CompanyMedia list={c.media || []} editable />
      </section>

      <CoAbout17 />
      <CoContact17 />
      {recSection("locations")}
      {hasVenues && recSection("venues")}

      {info.map((sec, i) => <CoSection17 key={sec.id} sec={sec} index={i} count={info.length}
        onOpenCard={setOpenRec} onAddCard={(x) => setAddingTo(x)} />)}
      <CoStarters17 />

      {coGroup17("Packages")}
      {recSection("packages")}
      {recSection("cocktail_menu")}
      <CoRow17 id="questions" icon={coHead17(I11.MessageSquare)} title="Q&A" count={qa.length} quiet={coQuiet17(qa.slice(0, 3).map((q) => q.text).join(" · "), 110)} onPlus={() => setQaAdd(qaAdd + 1)}>
        <CompanyQA11 c={c} addSignal={qaAdd} />
      </CoRow17>
      <CoRow17 id="svc" icon={coHead17(I11.Sparkles)} title={<SoonTitle17>Service Cards</SoonTitle17>} count={cards.services.length}>
        <Studio17 type="service" site="FF Staff" by={String(c.name || "").trim() || "You"} tag={c.slug || "yourbusiness"} k="coServices17" seed={seeds.service} />
      </CoRow17>
      <CoRow17 id="ck" icon={coHead17(I11.Martini)} title={<SoonTitle17>Cocktail Cards</SoonTitle17>} count={cards.cocktails.length}>
        <Studio17 type="cocktail" site="FF Staff" by={String(c.name || "").trim() || "You"} tag={c.slug || "yourbusiness"} k="coCocktails17" seed={seeds.cocktail} />
      </CoRow17>

      {coGroup17("Reviews")}
      <CoBookingReviews17 c={c} />
      {recSection("web_reviews")}

      {coGroup17("Team")}
      <CoTeam17 />

      {coGroup17("Private")}
      <CoDetails17 />
      {recSection("documents")}
      <CoRow17 id="terms" icon={coHead17(I11.FileText)} title="Terms and conditions" count={1 + docs.length + (c.tcDocs || []).length}>
        <HScroll label="Terms and conditions">
          {termsRecs.map((r) => <InformationCard key={r.id} record={r} def={termsDef} themeKey="onyx" editable onClick={() => setTermsOpen(true)} />)}
        </HScroll>
      </CoRow17>
      {signedIn && <CompanyFavs17 />}

      <GenericAttributeCardCreator owner="company" open={!!openRec} record={openRec && openRec.record} def={openRec && openRec.def} category={openRec && openRec.category}
        readOnly={!!(openRec && openRec.record && openRec.record.readOnly)} onClose={() => setOpenRec(null)} />
      <GenericAttributeCardCreator owner="company" open={!!addingTo} record={null} category={addingTo && (addingTo.key || addingTo)} def={addingTo ? (addingTo.def || COMPANY_CATEGORIES[addingTo]) : null}
        onClose={() => setAddingTo(null)} />
      <TermsSheet11 open={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
