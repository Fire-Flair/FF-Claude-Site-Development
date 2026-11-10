/* src/components/party/party-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FF Party profile: a person, not a company. A 5:7 FF Party Card that's
   mostly their photo, and how they like their parties.
   ========================================================================== */
const Wine11 = lucideIcon("Wine"), Heart11 = lucideIcon("Heart"), Brief11 = lucideIcon("Briefcase"), Martini11 = lucideIcon("Martini");


function PartyCard11({ edit, demo }) {
  const { state, dispatch } = useStore();
  const c = demo || state.company || {};
  const set = (p) => dispatch({ type: "COMPANY_SAVE", company: p });
  const ref = useRef(null);
  const favTxt = demo ? demo.cocktails : (state.favCocktails || []).map(id => (cocktailById(state, id) || {}).name).filter(Boolean).slice(0, 2).join(" · ");
  const pick = (e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (!f) return; const r = new FileReader(); r.onload = () => set({ photo: r.result }); r.readAsDataURL(f); };
  const row = (Icon, k, label, ph) => (
    <label className="r"><span className="ic"><Icon size={13} /></span>
      {edit ? <input className="ff-cardin" value={c[k] || ""} placeholder={ph} aria-label={label} maxLength={60} onChange={(e) => set({ [k]: e.target.value })} />
        : <span>{c[k] || label}</span>}</label>
  );
  return (
    <div className="ff-pcard11">
      <span className="plate">VIP Host Card</span>
      {c.vip && c.vip.status === "founding" && <span className="fnd" style={{ position: "absolute", left: 10, bottom: 10, padding: "3px 10px", borderRadius: 12, background: "linear-gradient(135deg,#E6C877,#B8912F)", color: "#1A1408", fontSize: 10.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", zIndex: 2 }}>Founding VIP</span>}
      <span className="coin"><Coin size={28} tier="gold" /></span>
      <button type="button" className="ph" onClick={() => edit && ref.current && ref.current.click()} aria-label={c.photo ? "Change your photo" : "Add your photo"} disabled={!edit}>
        {c.photo ? <img decoding="async" src={c.photo} alt="" /> : <span className="add"><CameraPlusGlyph size={28} /><span>Add your photo</span></span>}
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
      </button>
      <div className="body">
        {edit ? <input className="ff-cardin nm" value={c.name || ""} placeholder="Your name" aria-label="Your name" maxLength={60} onChange={(e) => set({ name: e.target.value })} />
          : <b className="nm">{c.name || "Your name"}</b>}
        {row(Brief11, "profession", "Profession", "What do you do?")}
        {row(Heart11, "interests", "Interests", "Your interests")}
        {row(Wine11, "drinks", "Favourite drinks", "Favourite drinks")}
        <div className="soc" aria-label="Social links">{SOC11.map(x => <span key={x.k} className={`si${String((c.socials || {})[x.k] || "").trim() ? " on" : ""}`} title={x.label}><SocialIcon11 k={x.k} size={17} /></span>)}</div>
      </div>
    </div>
  );
}


function PartySections11() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const c = state.company || {};
  const [tab, setTab] = useState("overview");
  const [rvPick, setRvPick] = useState(false);
  const [rvPerson, setRvPerson] = useState(null);
  const favs = favsOf(state, all);
  const reviews = (c.reviews || []).map(r => ({ ...makeRecord("reviews", r.byName), id: r.id, description: r.text, rating: r.rating, readOnly: true }));
  const vis = (k) => state.categoryVisibility[k] !== false;
  const past = (state.events || []).filter(e => e.iso && isPast(e.iso)).sort((x, y) => String(y.iso).localeCompare(String(x.iso)));
  const again = (e) => {
    const id = uid("evt");
    dispatch({ type: "EVENT_ADD", event: { id, title: e.title || "", kind: e.kind || "", iso: "", start: "", venue: e.venue || "", guests: e.guests || "", band: e.band || "", audience: e.audience || "", date: "", time: "", questionIds: [] } });
    dispatch({ type: "ACTIVE_EVENT", id });
    dispatch({ type: "V11_SET", patch: { bkView: { mode: "new", open: "event" } } });
    dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0);
  };
  const signedIn17 = state.auth && state.auth.status === "signedIn";
  const [invOpen, setInvOpen] = useState(null);
  const invs = state.inv17 || [];
  const myEvents = !signedIn17 ? [] : (state.events || []).filter(e => (e.iso || e.venue || state.shifts.some(x => x.eventId === e.id)) && !hid17(state, "events", e.id)).sort((a, b) => String(a.iso || "9").localeCompare(String(b.iso || "9")));
  const tabs = [{ key: "overview", label: "Preferences" }, { key: "events", label: "Events", count: myEvents.length }, { key: "favs", label: "Favourites", count: favs.length }, { key: "reviews", label: "Reviews", count: reviews.length }];
  const text = (k, label, ph, Icon) => (
    <section style={{ marginTop: 22 }}>
      <SectionHead icon={<Icon size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={label} action={<CategoryToggle sectionKey={`pp_${k}`} defaultOpen />} />
      {vis(`pp_${k}`) && <textarea className="ff-input" rows={3} value={c[k] || ""} placeholder={ph} aria-label={label} style={{ width: "100%", resize: "vertical" }}
        onChange={(e) => dispatch({ type: "COMPANY_SAVE", company: { [k]: e.target.value.slice(0, 400) } })} />}
    </section>
  );
  return (
    <div className="ff-ptabs-wrap">
      <ProfileTabs tabs={tabs} active={tab} onChange={setTab} />
      <div role="tabpanel" id="ff-tabpanel" aria-labelledby={`ff-tab-${tab}`} className="ff-tabpanel" tabIndex={0}>
        {tab === "overview" && (<>
          <section id="ff-pp-social" style={{ marginTop: 22 }}>
            <SectionHead icon={<I11.Globe size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Social links" action={<CategoryToggle sectionKey="pp_social" defaultOpen />} />
            {vis("pp_social") && <SocialEdit11 value={c.socials} onChange={(socials) => dispatch({ type: "COMPANY_SAVE", company: { socials } })} />}
          </section>
          <section id="ff-pp-media" style={{ marginTop: 22 }}><CompanyMedia list={c.media || []} editable /></section>
          {text("about", "About me", "A little about you and the events you love", I11.User || Heart11)}
          {text("partyStyle", "My kind of event", "Big nights, garden parties, cocktail evenings…", I11.PartyPopper)}
          {text("usualArea", "Where I usually host", "Your usual area, venue or type of space", I11.MapPin || Heart11)}
          {text("staffPrefs", "How I like my staff", "Dress code, style, experience, the vibe you want behind the bar", I11.Users || Heart11)}
          {text("drinkNotes", "Drinks and dietary notes", "Alcohol-free options, allergies, drinks to always have", Wine11)}
          {text("staffKnow", "Anything my staff should know", "Parking, access, house details", I11.Info || Heart11)}
          {text("drinks", "Favourite drinks", "Champagne, gin, craft beer…", Wine11)}
          {text("interests", "Interests", "Music, food, travel…", Heart11)}
        </>)}
        {tab === "events" && (
          <div style={{ marginTop: 14 }}>
            {myEvents.length ? (
              <div className="ff-pev17">{myEvents.map(e => (
                <div key={e.id} className="ff-pev17-c">
                  <EventCard11 ev={e} onClick={() => { dispatch({ type: "ACTIVE_EVENT", id: e.id }); dispatch({ type: "V11_SET", patch: { bkView: { eventId: e.id } } }); dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0); }} />
                  {isPast(e.iso) && <button type="button" className="ff-pev17-again" onClick={() => again(e)}><I11.CalendarDays size={14} /> Book again</button>}
                </div>))}</div>
            ) : (
              <div className="ff-pev17"><div className="ff-pev17-c"><EventCard11 ev={{ id: "blank", title: "", kind: "", iso: "", venue: "", guests: "" }} onClick={() => { dispatch({ type: "TAB", tab: "network" }); window.scrollTo(0, 0); }} /></div></div>
            )}
            <section className="ff-inv17-sec" aria-label="Invitations">
              <SectionHead icon={<I11.Mail size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Invitations" count={invs.length} />
              {invs.length > 0 && <div className="ff-inv17-list">{invs.map(iv => (
                <div key={iv.id} className="ff-inv17-it">
                  <InviteCard17 iv={iv} host={c.name || state.profile.name || ""} />
                  <div className="acts">
                    <a className="ff-pev17-again" target="_blank" rel="noopener noreferrer" href={inviteShare17(iv, c.name || "")}><I11.Send size={14} /> Share</a>
                    <button type="button" className="ff-pev17-again" onClick={() => setInvOpen(iv)}><I11.Pencil size={14} /> Edit</button>
                    <button type="button" className="ff-pev17-again" onClick={() => dispatch({ type: "V11_SET", patch: { inv17: invs.filter(x => x.id !== iv.id) } })}><I11.X size={14} /> Remove</button>
                  </div>
                </div>))}</div>}
              <button type="button" className="ff-inv17-new" onClick={() => setInvOpen({})}><span className="ic"><I11.Mail size={18} strokeWidth={1.7} /></span><span className="tx"><b>Create an invitation</b><small>Turn an Event Card into an invite</small></span><I11.Plus size={18} /></button>
            </section>
          </div>
        )}
        {tab === "favs" && (
          <section style={{ marginTop: 18 }}>
            {favs.length ? <HScroll label="Favourites">{favs.map(p => <PlayerTile key={p.id} person={p} onClick={() => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); }} />)}</HScroll>
              : <p className="ff-body ff-muted" style={{ margin: 0 }}>Tap the heart on anyone's card to keep them here.</p>}
          </section>
        )}
        {tab === "reviews" && (
          <section style={{ marginTop: 18 }}>
            {reviews.length ? <HScroll label="Reviews">{reviews.map((r, i) => <InformationCard key={r.id} record={r} def={BASE_CATEGORIES.reviews} themeKey="onyx" highlight={i < 3} rank={cardRank(i)} />)}</HScroll>
              : null}
            <div className="ff-pev17"><div className="ff-pev17-c">
              <EventCard11 ev={{ id: "blank", title: "", kind: "", iso: "", venue: "", guests: "" }} onClick={() => setRvPick(true)} />
              <button type="button" className="ff-pev17-again" onClick={() => setRvPick(true)}><I11.Star size={14} /> Review someone</button>
            </div></div>
          </section>
        )}
      </div>
      {invOpen && <InviteBuilder17 init={invOpen} events={myEvents} host={c.name || state.profile.name || ""} onClose={() => setInvOpen(null)} />}
      {rvPick && <ReviewPicker17 onPick={(p) => { setRvPick(false); setRvPerson(p); }} onClose={() => setRvPick(false)} />}
      {rvPerson && <ReviewSheet open person={rvPerson} shiftId={null} onClose={() => setRvPerson(null)} />}
    </div>
  );
}


/* Invitations: an Event Card dressed up with a theme, ready to share. */
const INV_THEMES17 = [["gold", "Gold gala"], ["midnight", "Midnight"], ["garden", "Garden"], ["blush", "Blush"]];


const inviteShare17 = (iv, host) => "https://wa.me/?text=" + encodeURIComponent([`You are invited: ${iv.title || "our event"}`, [iv.date, iv.venue].filter(Boolean).join(" · "), iv.msg, host ? `From ${host}` : ""].filter(Boolean).join("\n"));


function InviteCard17({ iv, host }) {
  return (
    <article className={`ff-ivc17 t-${iv.theme || "gold"}`} aria-label={`Invitation: ${iv.title || "your event"}`}>
      <span className="fr" aria-hidden="true" />
      <span className="eye">You are invited</span>
      <h3 className="nm">{iv.title || "Your event"}</h3>
      <span className="rule" aria-hidden="true"><i /><em>◆</em><i /></span>
      {iv.date && <span className="dt"><I11.CalendarDays size={14} /> {iv.date}</span>}
      {iv.venue && <span className="dt"><I11.MapPin size={14} /> {iv.venue}</span>}
      {iv.msg && <p className="ms">{iv.msg}</p>}
      <span className="ho">{host ? `Hosted by ${host}` : "FF Party"}</span>
      <span className="cn" aria-hidden="true"><Coin size={26} tier="gold" /></span>
    </article>);
}


function InviteBuilder17({ init, events, host, onClose }) {
  const { state, dispatch } = useStore();
  const [iv, setIv] = useState(() => ({ id: init.id || uid("inv"), theme: "gold", title: "", date: "", venue: "", msg: "We would love you to join us.", ...init }));
  const set = (p) => setIv(x => ({ ...x, ...p }));
  const fromEvent = (id) => { const e = events.find(x => x.id === id); if (e) set({ evId: id, title: eventTitle(e), date: e.iso ? longDay(e.iso) : (e.date || ""), venue: e.venue || "" }); else set({ evId: "" }); };
  const list = state.inv17 || [];
  const save = () => { dispatch({ type: "V11_SET", patch: { inv17: list.some(x => x.id === iv.id) ? list.map(x => x.id === iv.id ? iv : x) : [iv, ...list] } }); dispatch({ type: "TOAST", toast: "Invitation saved" }); onClose(); };
  return (
    <Sheet open onClose={onClose} title="Create an invitation">
      <div className="ff-ivb17">
        <InviteCard17 iv={iv} host={host} />
        {events.length > 0 && <Field label="From an Event Card"><select className="ff-input" value={iv.evId || ""} onChange={(e) => fromEvent(e.target.value)} aria-label="Event Card"><option value="">Start from scratch</option>{events.map(e => <option key={e.id} value={e.id}>{eventTitle(e)}</option>)}</select></Field>}
        <Field label="Event name"><input className="ff-input" value={iv.title} maxLength={60} onChange={(e) => set({ title: e.target.value })} /></Field>
        <Field label="Date"><input className="ff-input" value={iv.date} maxLength={40} placeholder="Saturday 12 December, 7pm" onChange={(e) => set({ date: e.target.value })} /></Field>
        <Field label="Place"><input className="ff-input" value={iv.venue} maxLength={80} onChange={(e) => set({ venue: e.target.value })} /></Field>
        <Field label="Message"><textarea className="ff-input" rows={3} value={iv.msg} maxLength={200} onChange={(e) => set({ msg: e.target.value })} /></Field>
        <div className="ff-ivb17-th" role="radiogroup" aria-label="Theme">{INV_THEMES17.map(([k, l]) => <button key={k} type="button" role="radio" aria-checked={iv.theme === k} className={`t-${k}${iv.theme === k ? " on" : ""}`} onClick={() => set({ theme: k })}>{l}</button>)}</div>
        <Btn variant="primary wide" disabled={!iv.title.trim()} onClick={save}><I11.Check size={15} /> Save invitation</Btn>
      </div>
    </Sheet>);
}


function ReviewPicker17({ onPick, onClose }) {
  const all = useDirectory();
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const list = (n ? all.filter((p) => personSearchText(p).includes(n)) : all).slice(0, 30);
  return React.createElement(Sheet, {
    open: true,
    onClose,
    title: "Review someone"
  }, React.createElement("input", {
    className: "ff-input",
    value: q,
    onChange: (e) => setQ(e.target.value),
    placeholder: "Name, profession or skill",
    "aria-label": "Search people",
    autoFocus: FF_FINE_POINTER && (true)
  }), React.createElement("ul", {
    className: "ff-rvp17"
  }, list.map((p) => React.createElement("li", {
    key: p.id
  }, React.createElement("button", {
    type: "button",
    onClick: () => onPick(p)
  }, React.createElement(Portrait, {
    src: p.photo,
    name: p.name,
    size: 38,
    tier: p.tier
  }), React.createElement("span", null, React.createElement("b", null, p.name), React.createElement("small", null, p.profession || p.group || ""))))), !list.length && React.createElement("li", {
    className: "none"
  }, "Nobody matches yet.")));
}


function devHostLogin11(state, dispatch, onClose) {
  ["team", "biz", "party"].forEach((k) => seedDemo17(state, dispatch, k));
  dispatch({ type: "V11_SET", patch: { devDone: { team: true, biz: true, party: true } } });
  dispatch({ type: "SESSION", patch: { tag: "HOSTJENN", phone: "+44 7700 900777", verified: true } });
  dispatch({ type: "AUTH_SIGNED_IN", tag: "HOSTJENN", method: "dev" });
  dispatch({ type: "COMPANY_SAVE", company: { name: "Jennifer Aniston", kind: "Host", location: "London", photo: avatarFor("Jennifer Aniston"), profession: "Host and event planner", interests: "Dinner parties, live music, travel", drinks: "Espresso Martini, Champagne", socials: { whatsapp: "+44 7700 900777", instagram: "@jenniferhosts", linkedin: "jennifer-hosts" }, description: "Hosts private dinners, birthdays and garden parties across London.", saved: true, cardSavedAt: Date.now(), finishedAt: Date.now(), joinedAt: Date.now() } });
  dispatch({ type: "COMPANY_SIGNED_IN", slug: "jenniferaniston" });
  dispatch({ type: "TOAST", toast: "Complete host profile loaded" });
  onClose();
}


function PartyLoginSheet17({ onClose }) {
  const { state, dispatch } = useStore();
  const [phone, setPhone] = useState("");
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const ok = phone.replace(/\D/g, "").length >= 9 && pw.length > 0;
  const go = async () => {
    setBusy(true); setErr(null);
    try {
      const tag = "HOST" + phone.replace(/\D/g, "").slice(-4);
      const res = await AUTH_ADAPTER.loginWithPassword(tag, pw);
      dispatch({ type: "SESSION", patch: { tag: res.tag, phone, verified: true } });
      dispatch({ type: "AUTH_SIGNED_IN", tag: res.tag, method: res.method });
      dispatch({ type: "TOAST", toast: "Logged in" }); onClose();
    } catch (e) { setErr("That phone number and password do not match."); } finally { setBusy(false); }
  };
  return (
    <Sheet open onClose={onClose} title="Log in">
      <Field label="Phone number"><input className="ff-input" type="tel" autoComplete="tel" placeholder="+44 7700 900000" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
      <Field label="Password"><input className="ff-input" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ok && !busy && go()} /></Field>
      <Btn variant="primary wide" disabled={busy || !ok} onClick={go}>{busy ? <Loader2 size={14} className="ff-spin" /> : <ShieldCheck size={14} />} Log in</Btn>
      {err && <p className="ff-body" role="alert" style={{ color: "var(--bad)", fontSize: 12.5, margin: "12px 0 0" }}>{err}</p>}
      <button type="button" className="ff-dev17 login" onClick={() => devHostLogin11(state, dispatch, onClose)}>DEV · complete host profile</button>
    </Sheet>);
}


function StaffProfile() {
  const { state } = useStore();
  const site = hireSiteOf(state);
  const c = state.company || {};
  const joined = !!(c.name && c.joinedAt);
  const cardReady = joined && !!String(site.party ? (c.photo || c.profession || c.cocktails) : c.kind || "").trim();
  const finished = joined && !!c.finishedAt;
  const toWelcome = () => setTimeout(() => scrollToSection("ff-co-welcome"), 80);
  if (site.party) return <HostPage17 />;
  return (
    <div>
      <div className="ff-eyebrow">{site.name} · {site.party ? "Your Party" : "Your Business"}</div>
      <div className="ff-journey">
        <BigStepHead n={1} title={`Join ${site.name}`} done={joined} id="ff-co-step-1" />
        <CompanyJoin />
        {site.party ? (<>
          <StepHead n={2} title="Your FF Party Card" done={cardReady} note="Shared with the people you book, so they know who you are and how you like your parties." />
          <div id="ff-co-card"><PartyCard11 edit /></div>
          <StepHead n={3} title="Your profile" done={false} />
          <PartySections11 />
        </>) : (<>
          <StepHead n={2} title="Company Card" done={cardReady} note="Sent to anyone you hire, to show them who you are. It can also be added to FF Party to advertise your services." />
          <div id="ff-co-card"><EditableCompanyCard /></div>
          <StepHead n={3} title="Describe your business" done={!!c.description} />
          <CompanyFFAI />
          <StepHead n={4} title="Your company profile" done={false} />
          <CompanySections />
        </>)}
      </div>
      <div className={`ff-finale${finished ? " open" : ""}`}>
        <div className="ff-s5row">
          {!finished && (
            <div className="ff-s5mark" title="The last step opens when you save" aria-label="The last step opens when you save">
              <span className="ff-stepnum closed" aria-hidden="true">{site.party ? "04" : "05"}</span>
              <span className="stem" aria-hidden="true" />
              <span className="ff-vdashes" aria-hidden="true"><i /><i /><i /></span>
            </div>
          )}
          <CompanySaveShare onSaved={toWelcome} />
        </div>
        {finished && <CompanyWelcome />}
      </div>
    </div>
  );
}



/* The host page: the same top as a public FF Team page, with the VIP Host Card beside the photos. It saves as you type. */
function HostPage17() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const img = window.FF_IMG || {};
  const own = (c.media || []).map(m => ({ id: m.id, src: m.dataUrl || m.src, name: m.name || "" })).filter(m => m.src);
  const stock = ["dream_music_festivals", "training_ff_open_bar", "reward_photoshoot"].map(k => ({ id: "stock_" + k, src: img[k], name: "" })).filter(m => m.src);
  const save = () => { dispatch({ type: "COMPANY_SAVE", company: { cardSavedAt: Date.now(), finishedAt: Date.now(), joinedAt: c.joinedAt || Date.now() } }); dispatch({ type: "TOAST", toast: "VIP Host Card saved" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <div className="ff-host17">
      <div className="ff-eyebrow">FF Party · VIP Host Card</div>
      <PublicHero media={own.length ? own : stock} card={<PartyCard11 edit />} below={<PartySections11 />} />
      <ConfirmSpin17 lines={["Save"]} label="Save VIP Host Card" onClick={save} />
    </div>);
}
