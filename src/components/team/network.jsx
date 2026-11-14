/* src/components/team/network.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   ADD TO TEAM (v16.11) — adding someone to your network is two-way.
   1. "Add to team" opens a sheet like the review box: have you worked with
      them, would you work with them again, how are they to work with, and a
      written review.
   2. Add → a confirmation: the team invitation goes to them on WhatsApp.
   3. They accept → you're connected, and the review goes on their profile.
   Until then the invitation is "pending". In this prototype nothing is sent;
   a "Preview: they accept" link shows what happens when they do.
   ========================================================================== */
const HOW_TO_WORK = [
  { key: "excellent", label: "Excellent", rating: 5 },
  { key: "great", label: "Great", rating: 4 },
  { key: "good", label: "Good", rating: 3 },
  { key: "improve", label: "Could improve", rating: 2 },
];


const YES_NO = [{ v: true, label: "Yes" }, { v: false, label: "No" }];



function TickChoice({ id, label, options, value, onChange }) {
  return (
    <div className="ff-tickq" role="group" aria-labelledby={id}>
      <div className="ff-tickq-label" id={id}>{label}</div>
      <div className="ff-tickq-opts">
        {options.map(o => {
          const on = value === o.v;
          return (
            <button key={String(o.v)} type="button" className={`ff-tick${on ? " on" : ""}`} aria-pressed={on} onClick={() => onChange(o.v)}>
              <span className="box" aria-hidden="true">{on && <Check size={13} strokeWidth={3} />}</span>{o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}



function AddToTeamSheet({ open, person, onClose }) {
  const { state, dispatch } = useStore();
  const [worked, setWorked] = useState(null);
  const [again, setAgain] = useState(null);
  const [howTo, setHowTo] = useState(null);
  const [text, setText] = useState("");
  const [confirming, setConfirming] = useState(false);
  useEffect(() => { if (open) { setWorked(null); setAgain(null); setHowTo(null); setText(""); setConfirming(false); } }, [open, person && person.id]);
  if (!open || !person) return null;
  const first = String(person.name || "").split(" ")[0] || "them";
  const ready = worked !== null && again !== null && (worked === false || howTo);
  const send = () => {
    const how = HOW_TO_WORK.find(h => h.key === howTo);
    dispatch({ type: "TEAM_INVITE", invite: {
      id: uid("tinv"), personId: person.id, name: person.name, tag: person.tag || null, note: person.profession || "",
      workedBefore: worked, workAgain: again, howTo: worked ? (how ? how.label : null) : null, rating: worked && how ? how.rating : null,
      review: text.trim(), at: Date.now(), status: "pending",
    } });
    dispatch({ type: "TOAST", toast: `Team invitation sent to ${first}` });
    onClose();
  };

  return (
    <Sheet open onClose={onClose} title={confirming ? "Send team invitation" : `Add ${first} to your team`}>
      <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
        <Portrait src={person.photo} name={person.name} size={44} tier={person.tier} />
        <div>
          <div className="ff-display" style={{ fontSize: 15 }}>{person.name}</div>
          <div className="ff-serif" style={{ fontSize: 12.5, color: "var(--gold-dk)", fontStyle: "normal" }}>{person.profession}</div>
        </div>
      </div>

      {!confirming ? (<>
        <div className="ff-tickqs">
          <TickChoice id="att-worked" label={`Have you worked with ${first} before?`} options={YES_NO} value={worked}
            onChange={(v) => { setWorked(v); if (!v) setHowTo(null); }} />
          <TickChoice id="att-again" label={worked === false ? `Would you like to work with ${first}?` : `Would you like to work with ${first} again?`}
            options={YES_NO} value={again} onChange={setAgain} />
          {worked && (
            <TickChoice id="att-how" label={`How is ${first} to work with?`} options={HOW_TO_WORK.map(h => ({ v: h.key, label: h.label }))}
              value={howTo} onChange={setHowTo} />
          )}
        </div>
        <Field label={worked === false ? `A note for ${first}` : "Your review"}
          hint={worked === false ? "Optional. Say why you'd like them on your team." : `Goes on ${first}'s profile once they accept your invitation.`}>
          <textarea id="att-review" className="ff-input" rows={4} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={worked === false ? "Loved your cocktail menu at the launch night…" : "Reliable, great with guests, always on time…"} />
        </Field>
        <Btn variant="primary wide" disabled={!ready} onClick={() => setConfirming(true)}><Plus size={14} /> Add {first}</Btn>
        {!ready && <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "8px 0 0", textAlign: "center" }}>Answer the questions above to continue.</p>}
      </>) : (
        <div className="ff-confirm">
          <span className="ff-confirm-ic"><WhatsAppIcon size={22} /></span>
          <p className="ff-confirm-main">Your team invitation{text.trim() || (worked && howTo) ? " and review" : ""} will be sent to <b>{person.name}</b> on WhatsApp.</p>
          <p className="ff-body" style={{ margin: 0 }}>
            {first} will be notified that you'd like to add them to your team. You're connected once {first} accepts{worked ? `, and your review goes on ${first}'s profile then` : ""}.
          </p>
          <div className="ff-confirm-acts">
            <Btn variant="primary wide" onClick={send}><Send size={14} /> Send invitation</Btn>
            <Btn variant="ghost wide" onClick={() => setConfirming(false)}>Back</Btn>
          </div>
          <ProtoNote />
        </div>
      )}
    </Sheet>
  );
}



function PersonProfile() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  /* Your own profile isn't in the directory until it's shared, so "view as a
     guest" builds it from the profile itself. */
  const person = all.find(p => p.id === state.viewing)
    || (state.viewing === "me" ? { ...meAsStaff(state.profile, state.session), group: "Your profile" } : null);
  const guestOfMe = !!state.viewingAsGuest && state.viewing === "me";
  const connected = state.connections.some(c => c.id === state.viewing);
  const invite = (state.teamInvites || []).filter(i => i.personId === state.viewing).slice(-1)[0];
  const pending = !connected && invite && invite.status === "pending";
  const [reviewing, setReviewing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [asking, setAsking] = useState(false);
  const [checking, setChecking] = useState(false);
  if (!person) return null;
  const first = String(person.name || "").split(" ")[0];
  const preview = (msg) => dispatch({ type: "TOAST", toast: msg || "This is how guests see your profile" });
  const acts = guestOfMe ? { onBook: () => preview(), onReview: () => preview(), onJoin: () => preview() } : {
    onBook: () => { if (!state.selection.includes(person.id)) dispatch({ type: "SELECT", id: person.id }); dispatch({ type: "TOAST", toast: `${first} added to your basket` }); },
    onReview: () => setReviewing(true),
    onJoin: () => {
      if (state.auth.status === "signedIn" || person.id === "me") { dispatch({ type: "TOAST", toast: "Share this card so they can join FireFlair" }); return; }
      dispatch({ type: "SESSION", patch: { invitedBy: person.id } });
      dispatch({ type: "VIEW", id: null });
      if (state.role !== "team") dispatch({ type: "ROLE", role: "team" });
      dispatch({ type: "TAB", tab: "profile" });
      dispatch({ type: "TOAST", toast: `Joining with ${first} — your first connection` });
      window.scrollTo(0, 0);
    },
  };
  const other = person.id !== "me";
  const publicView = other || guestOfMe;
  /* Prototype only: what happens when they accept on WhatsApp. */
  const acceptPreview = () => {
    dispatch({ type: "TEAM_INVITE_ACCEPT", id: invite.id });
    if (invite.workedBefore && (invite.review || invite.rating)) {
      dispatch({ type: "REVIEW_ADD", review: {
        id: uid("rev"), aboutId: person.id, byId: "me", shiftId: null,
        byName: (state.role === "staff" && state.site !== "party" && state.company?.name) || state.profile.name || "You", rating: invite.rating || 5,
        text: invite.review || `${invite.howTo} to work with.`, at: Date.now(),
      } });
    }
    dispatch({ type: "TOAST", toast: `${first} accepted · now on your team` });
  };

  const backBtn = (
    <button aria-label="Back" onClick={() => dispatch({ type: "VIEW", id: null })} className="ff-pback"
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", padding: "12px 4px", marginBottom: 12,
        color: "var(--gold-dk)", border: "1px solid var(--rule)", background: "var(--paper)",
      }}>
      <ChevronLeft size={22} strokeWidth={2} />
      <span style={{ fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>{guestOfMe ? "Back to my profile" : "Back"}</span>
    </button>
  );
  const guestNote = guestOfMe ? <div className="ff-guestnote"><Eye size={16} /> This is your profile as a guest sees it.</div> : null;
  const myTag = state.auth.status === "signedIn" ? (state.auth.tag || state.session.tag) : "";
  const shareTag = person.id === "me" ? myTag : String(person.tag || cx17Slug(person.name || person.id) || "");
  const shareBtn = shareTag ? (
      <CardShareBtn17 title={person.id === "me" ? "My FireFlair card" : `${person.name} on FireFlair`} url={`https://${CARD_DOMAIN}/${shareTag}`} fileName={"fireflair-" + cx17Slug(shareTag)} label="Share" className="wide"
        render={() => <PlayerCard person={person} format="full" nameAs="div" themeKey={person.id === "me" ? state.profile.theme : (person.theme || "ivory")} />} />) : null;
  const shareEl = shareBtn ? <div style={{ marginTop: 8, width: "calc(50% - 4px)", marginInline: "auto" }}>{shareBtn}</div> : null;
  const actionsEl = other ? (<div className="ff-pub-acts">
        {hireSiteOf(state).party ? <FavBtn11 person={person} wide /> : (<>
          {state.role === "staff" && <div style={{ marginBottom: 8 }}><FavBtn11 person={person} wide /></div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <NetBtn17 id={person.id} name={first} />
            {connected ? (
              <Btn variant="ghost" disabled><Check size={14} /> On your team</Btn>
            ) : pending ? (
              <Btn variant="ghost" onClick={() => setAdding(true)}><Clock size={14} /> Invitation sent</Btn>
            ) : (
              <Btn variant="gold" onClick={() => setAdding(true)}><Plus size={14} /> Add to team</Btn>
            )}
          </div>
        </>)}
        {pending && (
          <div className="ff-pendingnote">
            <span>Waiting for {first} to accept your team invitation on WhatsApp.</span>
            <button type="button" className="ff-linkbtn" onClick={acceptPreview}>Preview: {first} accepts</button>
          </div>
        )}
        <div style={{ marginTop: 8, display: "grid", gap: 8 }}>
          {state.role === "staff" && state.site === "party" && !person.isCompany && (
            <LockedBtn17 variant="primary wide" icon={<Users size={14} />}>Book this person</LockedBtn17>
          )}
          {state.role === "staff" && state.site !== "party" && (
            <Btn variant={state.selection.includes(person.id) ? "ghost wide" : "primary wide"} onClick={() => {
              dispatch({ type: "SELECT", id: person.id });
              dispatch({ type: "TOAST", toast: state.selection.includes(person.id) ? `${person.name} removed from your booking bar` : `${person.name} added to your booking bar` });
            }}>
              {state.selection.includes(person.id) ? <><Check size={14} /> In your booking bar</> : <><Users size={14} /> Add to booking</>}
            </Btn>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn onClick={() => setAsking(true)}><MessageSquare size={14} /> Ask a question</Btn>
            <Btn onClick={() => setChecking(true)}><I11.CalendarCheck size={14} /> Availability</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: shareBtn ? "1fr 1fr" : "1fr", gap: 8 }}>
            <Btn variant="wide" onClick={() => setReviewing(true)}><Award size={14} /> Review</Btn>
            {shareBtn}
          </div>
        </div>
      </div>) : null;
  const cardEl = <PlayerCard person={person} format="full" nameAs="div" themeKey={person.id === "me" ? state.profile.theme : (person.theme || "ivory")}  />;
  return (
    <div className={publicView ? "ff-pubpage" : undefined}>
      <PublicHero media={mediaOf(state, person)} card={cardEl} narrow below={<>{backBtn}{guestNote}{actionsEl}{other ? null : shareEl}</>} />
      <HireCards11 person={person} />
      <PublicProfileBody person={person} />
      <ReviewSheet open={reviewing} person={person} onClose={() => setReviewing(false)} />
      <AddToTeamSheet open={adding && !pending} person={person} onClose={() => setAdding(false)} />
      <AskQuestionSheet open={asking} person={person} onClose={() => setAsking(false)} />
      <CheckAvailabilitySheet open={checking} person={person} onClose={() => setChecking(false)} />
      {adding && pending && (
        <Sheet open onClose={() => setAdding(false)} title="Team invitation sent">
          <p className="ff-body" style={{ marginTop: 0 }}>
            Your team invitation went to {person.name} on WhatsApp at {timeOf(invite.at)}. You'll be connected as soon as {first} accepts.
          </p>
          <Btn variant="ghost wide" onClick={() => setAdding(false)}>Close</Btn>
        </Sheet>
      )}
    </div>
  );
}




function ShiftCard({ shift, event, footer }) {
  const row = (Icon, label, value) => value ? (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid var(--rule)" }}>
      <span style={{ width: 26, height: 26, borderRadius: "50%", background: "#5C1220", display: "grid", placeItems: "center", flex: "none" }}>
        <Icon size={13} color="#EAD79C" strokeWidth={1.6} />
      </span>
      <span style={{ flex: 1 }}>
        <span className="ff-label" style={{ display: "block" }}>{label}</span>
        <span className="ff-serif" style={{ fontSize: 16, color: "#1D1B18" }}>{value}</span>
      </span>
    </div>
  ) : null;

  return (
    <CardFrame tier="standard" theme={THEMES.paper} style={{ marginBottom: 12, paddingTop: 24 }}>
      <span className="ff-label" style={{ position: "absolute", top: 10, left: 14, fontSize: 7, letterSpacing: ".2em", zIndex: 4 }}>Shift</span>
      <span style={{ position: "absolute", top: 8, right: 8, zIndex: 4 }}><Coin size={24} /></span>
      <div style={{ padding: "6px 14px 0" }}>
        <div className="ff-display" style={{ fontSize: 21, lineHeight: 1.1 }}>{shift.role}</div>
        {event && <div className="ff-body ff-muted" style={{ marginTop: 4 }}>{event.title}</div>}
        <Divider />
        {row(Calendar, "Date", event?.date || shift.date)}
        {row(Clock, "Start — finish", shift.time)}
        {row(MapPin, "Venue", event?.venue || shift.venue)}
        {row(SlidersHorizontal, "Requirements", (shift.skills || []).join("  ·  "))}
        {row(Wallet, "Pay rate", shift.pay)}
        {row(PenLine, "Notes", shift.notes)}
        {row(User, "Dress code", shift.dress)}
      </div>
      {footer && <div style={{ padding: 14 }}>{footer}</div>}
      <div style={{ background: "#141416", padding: "9px 14px", display: "flex", alignItems: "center", gap: 9 }}>
        <Coin size={20} /><Wordmark size={11} />
        <span style={{ marginLeft: "auto", fontSize: 8.5, letterSpacing: ".14em", color: "rgba(234,215,156,.75)", textTransform: "uppercase" }}>FF Staff</span>
      </div>
    </CardFrame>
  );
}



/* ==========================================================================
   6. FF TEAM
   ========================================================================== */

/* INVITES. Every new FireFlair user starts with one Network connection: the
   person who brought them in. That's whoever's invite link they arrived on,
   or — if they were browsing — whoever's profile they tapped Join on.
   Prototype: everyone arrives on Don Gee's link (DONGE). Live, the tag comes
   from the link itself. */
const INVITE_LINK_TAG = "DONGE";


function inviterOf(state, people) {
  const id = state.session.invitedBy;
  if (id) return people.find(p => p.id === id) || null;
  const ref = String(state.session.refTag || "").toLowerCase();
  return ref ? people.find(p => String(p.tag || "").toLowerCase() === ref) || null : null;
}


/* My Network: the inviter first, then everyone I've connected with. */
/* Add to network: one tap, no confirmation from the other side. Works for people and companies. */
function NetBtn17({ id, name, wide }) {
  const { state, dispatch } = useStore();
  const on = (state.netAdds17 || []).includes(id) || (state.connections || []).some(c => c.id === id);
  const team = (state.connections || []).some(c => c.id === id);
  const go = () => {
    if (state.auth.status !== "signedIn") { window.dispatchEvent(new CustomEvent("ff-login")); return; }
    dispatch({ type: "NET_TOGGLE", id }); dispatch({ type: "TOAST", toast: on ? `${name} removed from your network` : `${name} added to your network` });
  };
  return <Btn variant={(on ? "ghost" : "net") + (wide ? " wide" : "")} disabled={team} onClick={go}>{on ? <><Check size={14} /> In your network</> : <><UserPlus size={14} /> Add to network</>}</Btn>;
}


function myNetwork(state, people) {
  const inv = inviterOf(state, people);
  const rest = state.connections.map(c => people.find(p => p.id === c.id)).filter(Boolean).filter(p => !inv || p.id !== inv.id);
  return { inviter: inv, list: inv ? [inv, ...rest] : rest };
}


function NetworkTile({ person, invited, onClick }) {
  if (!invited) return <PlayerTile person={person} onClick={onClick} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <PlayerTile person={person} onClick={onClick} />
      <span className="ff-invited"><Star size={11} fill="currentColor" /> Invited you</span>
    </div>
  );
}



const TAKEN_TAGS = ["SAM42", "DONGE", "AVA03", "LEO09", "MIAS1", "JAMEW", "ZARA7", "NIAOK", "TOMBE", "ADMIN"];



function ChipEdit({ values, onChange, placeholder, flags, ink, rule, leadFirst }) {
  const [t, setT] = useState("");
  const add = () => { const v = t.trim().replace(/,$/, ""); if (!v) return; if (!values.includes(v)) onChange([...values, v]); setT(""); };
  return (
    <div>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 6 }}>
          {values.map((v, i) => (
            <span key={v + i} className={`ff-tagchip${leadFirst && i === 0 ? " lead" : ""}`} style={{ color: ink }}>
              {flags && <LangFlag lang={v} />}{v}
              <button onClick={() => onChange(values.filter((_, j) => j !== i))} aria-label={`Remove ${v}`} style={{ color: ink }}><X size={11} /></button>
            </span>
          ))}
        </div>
      )}
      <input className="ff-cardin" value={t} placeholder={placeholder} style={{ color: ink, borderBottomColor: rule }}
        onChange={(e) => setT(e.target.value)} onBlur={add}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }} />
    </div>
  );
}



/* v17.3.25: text that shrinks to fit (name, profession, tag) and lists that keep only the items that fit. */
function FitText17({ as: As = "div", size, min = 0.4, className, style, children }) {
  const ref = React.useRef(null);
  const key = typeof children === "string" ? children : "";
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      el.style.fontSize = size + "cqw";
      let k = 1, g = 0;
      while (el.scrollWidth > el.clientWidth && k > min && g++ < 50) { k = Math.max(min, k - 0.03); el.style.fontSize = (size * k).toFixed(3) + "cqw"; }
    };
    fit();
    let ro = null;
    const host = el.parentElement;
    if (window.ResizeObserver && host) { let w = host.clientWidth; ro = new ResizeObserver(() => { const nw = host.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(host); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key, size, min]);
  return <As ref={ref} className={className} style={{ ...style, fontSize: size + "cqw" }}>{children}</As>;
}


function FitList17({ items, accent }) {
  const ref = React.useRef(null);
  const key = items.join("\u0001");
  React.useLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const fit = () => {
      const kids = Array.from(el.children);
      kids.forEach(k => { k.style.display = ""; });
      let n = kids.length;
      while (n > 1 && el.scrollWidth > el.clientWidth) { n--; kids[n].style.display = "none"; }
    };
    fit();
    let ro = null;
    const host = el.parentElement;
    if (window.ResizeObserver && host) { let w = host.clientWidth; ro = new ResizeObserver(() => { const nw = host.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fit(); } }); ro.observe(host); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, [key]);
  return <span ref={ref} className="ff-pc-fit">{items.map((v, i) => <span key={v + i} className="ff-pc-fi">{i > 0 && <b style={{ color: accent }}>•</b>}{v}</span>)}</span>;
}



/* v17.3.77: type a profession straight into the card (as on the live ffteam.uk site):
   search the 35 known professions as you type, or add your own. */
function ProfTypeIn({ profs, set, ink, rule }) {
  const [q, setQ] = useState("");
  const n = q.trim().toLowerCase();
  const has = (x) => profs.some(p => String(p).toLowerCase() === String(x).toLowerCase());
  const hits = n ? [
    ...ALL_PROFESSIONS.filter(p => p.name.toLowerCase().startsWith(n)),
    ...ALL_PROFESSIONS.filter(p => !p.name.toLowerCase().startsWith(n) && p.name.toLowerCase().includes(n)),
  ].filter(p => !has(p.name)).slice(0, 5) : [];
  const typed = q.trim().replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const custom = n && !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n) && !has(typed) ? typed : null;
  const add = (name) => { if (!has(name)) set("professions")([...profs, name]); setQ(""); };
  return (
    <div>
      <input className="ff-cardin" type="text" value={q} autoComplete="off" spellCheck={false}
        placeholder={profs.length ? "Add another profession" : "Search or type a profession"} aria-label="Search or type a profession"
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && n) { e.preventDefault(); add(hits[0] ? hits[0].name : typed); } }}
        style={{ color: ink, borderBottomColor: rule, textAlign: "center", fontSize: 13.5 }} />
      {n && (hits.length > 0 || custom) && (
        <div role="list" aria-label="Matching professions" style={{ display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginTop: 8 }}>
          {hits.map(p => (
            <button key={p.name} type="button" role="listitem" className="ff-tagchip" onClick={() => add(p.name)} style={{ color: ink, cursor: "pointer" }}>+ {p.name}</button>
          ))}
          {custom && <button type="button" role="listitem" className="ff-tagchip" onClick={() => add(custom)} style={{ color: ink, cursor: "pointer" }}>+ Add “{custom}”</button>}
        </div>
      )}
    </div>
  );
}


function EditablePlayerCard({ draft, setDraft, themeKey = "onyx", tag = "username", tier = "standard", level = 3, onPhoto }) {
  const t = THEMES[themeKey] || THEMES.onyx;
  const tr = TIERS[tier] || TIERS.standard;
  const { ink, sub, rule } = t;
  const set = (k) => (v) => setDraft({ ...draft, [k]: v });
  const photoRef = useRef(null);
  const [pickOpen, setPickOpen] = useState(false);
  const profRef = useRef(null);
  useEffect(() => {
    if (!pickOpen)
      return;
    const away = (e) => {
      if (profRef.current && !profRef.current.contains(e.target))
        setPickOpen(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [pickOpen]);
  const profs = draft.professions || [];
  const togglePick = (n) => {
    const low = String(n).toLowerCase();
    set("professions")(profs.some((x) => String(x).toLowerCase() === low) ? profs.filter((x) => String(x).toLowerCase() !== low) : [...profs, n]);
  };
  const lbl = t.dark ? sub : "#5C513F";
  const Row = ({ kind, label, children }) => React.createElement("div", {
    style: { padding: "10px 0", borderBottom: `1px solid ${rule}` }
  }, React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }
  }, React.createElement(CatIcon, {
    kind,
    size: 13,
    color: lbl
  }), React.createElement("span", {
    className: "ff-cardlbl",
    style: { color: lbl }
  }, label)), children);
  return React.createElement(CardFrame, {
    premium: true,
    tier,
    theme: t,
    style: { maxWidth: 340, margin: "0 auto", padding: "40px 16px 0" }
  }, React.createElement("span", {
    className: "ff-pc-plate"
  }, "Profile Card"), React.createElement("span", {
    style: { position: "absolute", top: 9, right: 9, zIndex: 4 }
  }, React.createElement(Coin, {
    size: 32,
    tier
  })), React.createElement("div", {
    style: { display: "flex", justifyContent: "center", marginTop: 4 }
  }, React.createElement("input", {
    ref: photoRef,
    type: "file",
    accept: "image/*",
    style: { display: "none" },
    onChange: (e) => {
      const f = e.target.files?.[0];
      if (f)
        onPhoto(URL.createObjectURL(f));
    }
  }), React.createElement("button", {
    onClick: () => photoRef.current?.click(),
    className: "ff-photobtn",
    "aria-label": draft.photo ? "Change your profile photo" : "Add your profile photo",
    title: draft.photo ? "Change photo" : "Add photo"
  }, React.createElement(Portrait, {
    src: draft.photo,
    name: draft.name,
    size: 92,
    ring: tr.ring[0],
    ink: tr.ink
  }), draft.photo ? React.createElement("span", {
    className: "ff-photoadd",
    style: { background: tr.ring[0] }
  }, React.createElement(CameraPlusGlyph, {
    size: 17
  })) : React.createElement(React.Fragment, null, React.createElement("span", {
    className: "ff-photoempty",
    style: { color: tr.ring[0] },
    "aria-hidden": "true"
  }, React.createElement(CameraPlusGlyph, {
    size: 34
  })), React.createElement("span", {
    className: "ff-photoplus",
    style: { background: tr.ring[0] },
    "aria-hidden": "true"
  }, React.createElement(Plus, {
    size: 17,
    strokeWidth: 3
  }))))), React.createElement("input", {
    className: "ff-cardin name",
    value: draft.name,
    placeholder: "Your name",
    onChange: (e) => setDraft({ ...draft, name: e.target.value }),
    style: { color: ink, borderBottomColor: rule, marginTop: 12 }
  }), React.createElement("div", {
    style: { marginTop: 8 }
  }, React.createElement("div", {
    style: { display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 4 }
  }, React.createElement(CatIcon, {
    kind: "profession",
    size: 12,
    color: lbl
  }), React.createElement("span", {
    className: "ff-cardlbl",
    style: { color: lbl }
  }, "Professions")), React.createElement("div", {
    ref: profRef
  }, React.createElement("div", {
    style: { display: "flex", flexWrap: "wrap", gap: 5, justifyContent: "center", marginBottom: 6 }
  }, profs.map((v, i) => React.createElement("span", {
    key: v + i,
    className: `ff-tagchip${i === 0 ? " lead" : ""}`,
    style: { color: ink }
  }, v, React.createElement("button", {
    type: "button",
    onClick: () => set("professions")(profs.filter((_, j) => j !== i)),
    "aria-label": `Remove ${v}`,
    style: { color: ink }
  }, React.createElement(X, {
    size: 11
  }))))), React.createElement(ProfTypeIn, {
    profs,
    set,
    ink,
    rule
  }))), React.createElement("div", {
    style: { height: 8 }
  }), React.createElement(Row, {
    kind: "skills",
    label: "Skills"
  }, React.createElement(ChipEdit, {
    values: draft.skills,
    onChange: set("skills"),
    placeholder: "Add a skill, then Enter",
    ink,
    rule
  })), React.createElement(Row, {
    kind: "interests",
    label: "Interests"
  }, React.createElement(ChipEdit, {
    values: draft.interests,
    onChange: set("interests"),
    placeholder: "Add an interest",
    ink,
    rule
  })), React.createElement(Row, {
    kind: "location",
    label: "Where are you based?"
  }, React.createElement(BaseField17, { ink })), React.createElement(Row, {
    kind: "languages",
    label: "Languages"
  }, React.createElement(ChipEdit, {
    values: draft.languages,
    onChange: set("languages"),
    placeholder: "Add a language",
    flags: true,
    ink,
    rule
  })), React.createElement("div", {
    style: { margin: "0 -16px", background: t.dark ? "rgba(0,0,0,.45)" : "#141416", borderTop: `1px solid ${rule}`, padding: "9px 16px", display: "flex", alignItems: "center", gap: 9 }
  }, React.createElement(Coin, {
    size: 20,
    tier
  }), React.createElement(Wordmark, {
    size: 12
  }), React.createElement("span", {
    style: { marginLeft: "auto", fontFamily: "var(--sans)", fontSize: 12, fontWeight: 600, color: "#EAD79C" }
  }, CARD_DOMAIN, "/", tag)));
}



/* Consume a FF-sheet focus request: scroll to #ff-sec-<target> and run the
   matching handler (e.g. open the Add sheet). One consumer is mounted at a
   time — whichever Profile screen is showing. */
function useProfileFocus(handlers, enabled = true) {
  const { state, dispatch } = useStore();
  useEffect(() => {
    const f = state.focus;
    if (!enabled || !f) return;
    const el = document.getElementById(`ff-sec-${f.target}`);
    setTimeout(() => {
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 60);
    const h = handlers[f.target] || handlers._any;
    if (h) h(f.target);
    dispatch({ type: "FOCUS", focus: null });
  }, [state.focus, enabled]);
}



/* Write the card editor's draft into the real profile records — the one
   profile, never a copy. Names are matched to existing records so their
   descriptions, media and documents are kept. */
function syncCardRecords(state, dispatch, d, cats = ["professions", "skills", "interests", "locations", "languages"]) {
  cats.forEach(cat => {
    const existing = recsOf(state.profile, cat);
    const wasOnCard = primaryNames(state.profile, cat, FEATURE_LIMIT).map(n => n.toLowerCase());
    const want = (d[cat] || []).filter(Boolean);
    const has = (n) => want.some(v => v.toLowerCase() === n.toLowerCase());
    const front = want.map(v => {
      const match = existing.find(r => r.name.toLowerCase() === v.toLowerCase());
      return match ? { ...match, name: v, hidden: false } : makeRecord(cat, v);
    });
    /* The card lists every record, so one that is no longer wanted was removed
       with its X: delete it (only suggestions FireFlair proposed are kept). */
    const rest = existing.filter(r => has(r.name) ? false : !!r.proposed);
    dispatch({ type: "REC_BULK", category: cat, list: [...front, ...rest] });
  });
}



function InviteSheet({ open, onClose }) {
  const { state, dispatch } = useStore();
  const [granted, setGranted] = useState(false);
  const [picked, setPicked] = useState([]);
  const invitedIds = state.invitations.map(i => i.id);

  return (
    <Sheet open={open} onClose={onClose} title="Invite people you work with">
      {!granted ? (
        <>
          <p className="ff-body">FireFlair can check your contacts for people already here. We only read them when you allow it, and we never invite anyone on your behalf.</p>
          <div style={{ height: 12 }} />
          <Btn variant="primary wide" onClick={() => setGranted(true)}>Allow contact access</Btn>
          <div style={{ height: 8 }} />
          <Btn variant="ghost wide" onClick={onClose}>Not now — share my link</Btn>
        </>
      ) : (
        <>
          {CONTACTS.map(c => {
            const on = picked.includes(c.id), done = invitedIds.includes(c.id);
            return (
              <button key={c.id} disabled={done} onClick={() => setPicked(p => on ? p.filter(x => x !== c.id) : [...p, c.id])}
                className="ff-frame" style={{ width: "100%", textAlign: "left", padding: 11, marginBottom: 8, display: "flex", gap: 11, alignItems: "center", opacity: done ? .55 : 1, background: on ? "rgba(201,162,39,.10)" : "var(--paper)" }}>
                <Portrait name={c.name} size={36} ring={c.onFF ? "#C9A227" : "#B9B1A2"} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span className="ff-display" style={{ fontSize: 13, display: "block" }}>{c.name}</span>
                  <span className="ff-body ff-muted" style={{ fontSize: 12 }}>{c.note}{c.onFF ? ` · ${c.tag}` : ""}</span>
                </span>
                {done ? <Pill tone="ok">Invited</Pill> : on ? <Check size={17} color="var(--gold-dk)" /> : <Plus size={15} color="#B0A895" />}
              </button>
            );
          })}
          <Btn variant="primary wide" disabled={!picked.length}
            onClick={() => {
              const people = CONTACTS.filter(c => picked.includes(c.id));
              dispatch({ type: "INVITE", people });
              /* Phase 1: people already on FireFlair get a team invitation —
                 connected once they accept, never assumed. */
              people.filter(p => p.onFF).forEach(p => {
                const d = state.directory.find(x => x.tag === p.tag);
                if (d) dispatch({ type: "TEAM_INVITE", invite: { id: uid("tinv"), personId: d.id, name: d.name, tag: d.tag, note: d.profession || "",
                  workedBefore: null, workAgain: null, howTo: null, rating: null, review: "", at: Date.now(), status: "pending" } });
              });
              setPicked([]); onClose();
              dispatch({ type: "TOAST", toast: `${people.length} invitation${people.length > 1 ? "s" : ""} sent` });
            }}>
            <Send size={15} /> Invite {picked.length || ""}
          </Btn>
          <p className="ff-body ff-muted" style={{ fontSize: 12, marginTop: 12, marginBottom: 0 }}>
            An invitation is not a connection. They accept first. When someone joins from your invitation, you're in each other's network automatically.
          </p>
          <ProtoNote />
        </>
      )}
    </Sheet>
  );
}



function GroupedPeople({ onPick, selectable, scope = "", query = "", only = "", shut = false, insertAfter = "", insert = null, quietEmpty = false }) {
  const { state, dispatch } = useStore();
  const everyone = useDirectory();
  const n = query.trim().toLowerCase();
  const all0 = n ? everyone.filter(p => personSearchText(p).includes(n)) : everyone;
  const all = only && only.length ? all0.filter(p => [].concat(only).includes(p.group)) : all0;
  if (n && !all.length && quietEmpty) return null;
  if (n && !all.length) return <div style={{ marginTop: 18 }}><Empty icon={<Search size={26} />} title={`Nobody matches “${query}” yet. Try a different name, skill or area.`} /></div>;
  const order = CATEGORY_ORDER;
  const groups = all.reduce((m, p) => { (m[p.group] = m[p.group] || []).push(p); return m; }, {});
  const keys = Object.keys(groups).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  /* Something placed straight after one group (FF Staff: Your team after Chefs); at the end if that group isn't shown. */
  const slotAt = insert ? (keys.includes(insertAfter) ? insertAfter : null) : null;

  return (
    <>
      {keys.map(g => {
        const key = `${scope}${g}`;
        const visible = state.categoryVisibility[key] === undefined ? (!shut && state.role !== "staff") : state.categoryVisibility[key] !== false;
        return (<React.Fragment key={g}>
          <section style={{ marginTop: 20 }}>
            <SectionHead icon={<GroupIcon group={g} />} title={g} count={groups[g].length}
              action={<CategoryToggle sectionKey={key} defaultOpen={!shut} />} />
            {visible && (
              <HScroll label={g} snap>
                {groups[g].map(p => (
                  <PlayerTile key={p.id} person={p} selected={selectable && state.selection.includes(p.id)}
                    onClick={() => onPick(p)} />
                ))}
                {<button className="ff-card ff-portrait ff-addtile" style={{ width: CARD_W.player }}
                  onClick={() => state.role === "team" ? window.dispatchEvent(new Event("ff-invite")) : dispatch({ type: "TOAST", toast: "Join FF Team to invite the people you work with." })}>
                  <span style={{ textAlign: "center" }}><Plus size={20} color="var(--gold-dk)" />
                    <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Invite</span></span>
                </button>}
              </HScroll>
            )}
          </section>
          {slotAt === g ? insert : null}
        </React.Fragment>);
      })}
      {insert && !slotAt ? insert : null}
    </>
  );
}



/* Ranking categories — a config array, not one component per ranking, so a
   new category is a data entry. Each sorts the SAME directory using data
   that already exists on people; nothing here is invented. */
const RANKINGS = [
  { key: "top", label: "Top Performers This Week", sort: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.reviews || 0) - (a.reviews || 0) },
  { key: "reviewed", label: "Most Reviewed", sort: (a, b) => (b.reviews || 0) - (a.reviews || 0) },
  { key: "level", label: "Rising Star", sort: (a, b) => (b.level || 0) - (a.level || 0) },
];



function Rankings() {
  const { state, dispatch } = useStore();
  const all = adminPeople17(state, state.directory);
  return (
    <>
      {RANKINGS.map(r => {
        const ranked = [...all].sort(r.sort).slice(0, 8);
        const key = `rank_${r.key}`;
        const visible = state.categoryVisibility[key] === undefined ? state.role !== "staff" : state.categoryVisibility[key] !== false;
        return (
          <section key={r.key} style={{ marginTop: 22 }}>
            <SectionHead icon={<Award size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={r.label} count={ranked.length}
              action={<CategoryToggle sectionKey={key} />} />
            {visible && (
              <HScroll label={r.label} snap>
                {ranked.map(p => <PlayerTile key={p.id} person={p} onClick={() => dispatch({ type: "VIEW", id: p.id })} />)}
              </HScroll>
            )}
          </section>
        );
      })}
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, marginTop: 4 }}>
        More rankings — Largest Network, Most Booked, Most Active — arrive as that activity data builds up.
      </p>
    </>
  );
}



/* A collapsed drop-down under Your team: Companies, Network. Both count towards the team number. */
function NetDrop17({ title, count, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={"ff-netdrop17" + (open ? " open" : "")}>
      <button type="button" className="hd" aria-expanded={open} onClick={() => setOpen(o => !o)}>
        <b>{title}</b><i>{count}</i><I11.ChevronDown size={16} />
      </button>
      {open && <div className="bd">{children}</div>}
    </div>
  );
}

/* The companies a person works with: accepted team links first, then (for your own profile) companies you added to your network. */
function personCompanies17(state, person) {
  if (!person) return [];
  const me = person.id === "me";
  const tag = String(person.tag || "").toLowerCase();
  const keys = new Set(ctAll17(state).filter(x => x.status === "accepted" && (me ? ctIsMe17(state, x) : (x.personId === person.id || (tag && String(x.tag || "").toLowerCase() === tag)))).map(x => x.companyKey));
  const out = browseCompanies17(state).filter(c => c && c.id !== "mine" && (keys.has(coKey17(c)) || (c.team || []).includes(person.id)));
  if (me) (state.netAdds17 || []).filter(id => String(id).startsWith("co_")).forEach(id => {
    const c = companyById(state, id);
    if (c && !out.some(x => x.id === c.id)) out.push(c);
  });
  return out;
}

/* Team tab of a profile: the team, then Companies and Network drop-downs. */
function TeamParts17({ team, companies, network, teamEmpty, renderTeam }) {
  const { dispatch } = useStore();
  const view = (p) => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); };
  const none = (t) => <p className="ff-body ff-muted" style={{ margin: 0 }}>{t}</p>;
  return (
    <div className="ff-tparts17">
      <SectionHead icon={<I11.Users size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Team" count={team.length} />
      {team.length ? <HScroll label="Team">{team.map(p => renderTeam ? renderTeam(p) : <PlayerTile key={p.id} person={p} onClick={() => view(p)} />)}</HScroll> : none(teamEmpty || "No one yet.")}
      <NetDrop17 title="Companies" count={companies.length}>
        {companies.length ? <CoTiles17 list={companies} label="Companies" /> : none("No companies yet.")}
      </NetDrop17>
      <NetDrop17 title="Network" count={network.length}>
        {network.length ? <HScroll label="Network">{network.map(p => <PlayerTile key={p.id} person={p} onClick={() => view(p)} />)}</HScroll> : none("No one yet.")}
      </NetDrop17>
    </div>
  );
}



/* NETWORK — the bartending network, for everyone. Signed-out visitors see
   the same people a member does; joining happens on Home and Profile. */
function NetworkScreen({ guest = false }) {
  const { state, dispatch } = useStore();
  const [inviting, setInviting] = useState(false);
  const [reviewing, setReviewing] = useState(null);
  useEffect(() => { const h = () => setInviting(true); window.addEventListener("ff-invite", h); return () => window.removeEventListener("ff-invite", h); }, []);
  const q = state.netQuery || "";
  const setQ = (v) => dispatch({ type: "NET_QUERY", q: v });
  const mine = guest ? { inviter: null, list: [] } : myNetwork(state, adminPeople17(state, state.directory));
  const connected = mine.list;
  const adds = guest ? [] : (state.netAdds17 || []);
  const netPeople = adds.map(id => state.directory.find(p => p.id === id)).filter(p => p && !connected.some(c => c.id === p.id));
  const netCos = adds.filter(id => String(id).startsWith("co_")).map(id => companyById(state, id)).filter(Boolean);
  const view = (p) => { dispatch({ type: "VIEW", id: p.id }); window.scrollTo(0, 0); };
  const join = () => { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginTop: 4 }}>
        <div style={{ flex: 1 }}><BigHead20 tag="h1" title="Our network" /></div>
        {!guest && <Btn variant="sm" onClick={() => setInviting(true)}><Send size={12} /> Invite</Btn>}
      </div>

      <FFAI query={q} onQuery={setQ} title="Search the network"
        placeholder="Search the network. Describe who you're looking for." />

      {guest && !q && (
        <div className="ff-pendingnote" style={{ marginTop: 6 }}>
          <span>Join FF Team to build your own network. Whoever invites you is added to it automatically.</span>
          <Btn variant="sm gold" onClick={join}><User size={12} /> Create your Profile Card</Btn>
        </div>
      )}

      {!q && mine.inviter && <InvitedByBanner person={mine.inviter} onReview={() => setReviewing(mine.inviter)} />}

      {!q && !guest && (
        <section style={{ marginTop: 20 }}>
          <SectionHead icon={<Check size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Your team" count={connected.length + netPeople.length + netCos.length} />
          <HScroll label="Your team">
            {connected.map(p => (
              <div key={p.id} className="ff-nettile">
                <NetworkTile person={p} invited={!!(mine.inviter && mine.inviter.id === p.id)} onClick={() => view(p)} />
                <span className="ff-invited"><Check size={11} /> On your team</span>
                <button type="button" className="ff-btn sm ghost" onClick={() => setReviewing(p)}><Award size={12} /> Review</button>
              </div>
            ))}
            <button className="ff-card ff-portrait ff-addtile" style={{ width: CARD_W.player }} onClick={() => setInviting(true)}>
              <span style={{ textAlign: "center" }}><UserPlus size={20} color="var(--gold-dk)" />
                <span className="ff-label" style={{ display: "block", marginTop: 6 }}>Invite</span></span>
            </button>
          </HScroll>
          <NetDrop17 title="Companies" count={netCos.length}>
            {netCos.length ? (
              <HScroll label="Companies">
                {netCos.map(c => (
                  <button key={c.id} type="button" className="ff-co11-tile ff-netco17" aria-label={`${c.name}: open their page`} onClick={() => { dispatch({ type: "VIEW_COMPANY", id: c.id }); window.scrollTo(0, 0); }}>
                    <CompanyCardFace c={c} size="sm" />
                  </button>
                ))}
              </HScroll>
            ) : <p className="ff-body ff-muted" style={{ margin: 0 }}>No companies yet.</p>}
          </NetDrop17>
          <NetDrop17 title="Network" count={netPeople.length}>
            {netPeople.length ? (
              <HScroll label="Network">
                {netPeople.map(p => (
                  <div key={p.id} className="ff-nettile">
                    <PlayerTile person={p} onClick={() => view(p)} />
                    <button type="button" className="ff-btn sm ghost" onClick={() => setReviewing(p)}><Award size={12} /> Review</button>
                  </div>
                ))}
              </HScroll>
            ) : <p className="ff-body ff-muted" style={{ margin: 0 }}>No one yet.</p>}
          </NetDrop17>
        </section>
      )}
      {!q && !guest && <SentInvitations />}

      <NetBrowse17 query={q} onPick={view} after={<NetMap11 />} />
      {!q && (<>
        {PHASE1.leaderboards && <Rankings />}
        <Divider />
      </>)}
      <V101.BusinessSupport19 />
      {!guest && <InviteSheet open={inviting} onClose={() => setInviting(false)} />}
      <ReviewSheet open={!!reviewing} person={reviewing} onClose={() => setReviewing(null)} />
    </div>
  );
}



/* --- FF Team: home, bookings, profile ------------------------------------ */




function BookingSheet({ engagement, onClose }) {
  const { state, dispatch } = useStore();
  if (!engagement) return null;
  const shift = state.shifts.find(s2 => s2.id === engagement.shiftId);
  const event = state.events.find(v => v.id === shift?.eventId);
  const e = engagement;
  if (!shift) return null;
  const act = (st) => { dispatch({ type: "ENG_STATE", id: e.id, state: st }); onClose(); };

  return (
    <Sheet open onClose={onClose} title={shift.role}>
      <ShiftCard shift={shift} event={event} footer={
        <div>
          <div style={{ marginBottom: 10 }}><Pill tone={ENG_TONE[e.state]}><span className="ff-dot" /> {ENG_LABEL[e.state]}</Pill></div>
          {["requested", "discuss", "available", "withdrawn", "not_selected", "cancelled_pro"].includes(e.state) && <ProOffer17 e={e} shift={shift} onDone={onClose} />}
          {e.state === "requested" && e.expiresAt && <p className="ff-body ff-muted" style={{ margin: "8px 0 0", fontSize: 12 }}>{timeLeft(e.expiresAt)}</p>}
          {e.state === "expired" && <p className="ff-body ff-muted" style={{ margin: 0 }}>This request expired without a reply.</p>}
          {e.state === "confirmed" && (
            <div>
              <p className="ff-body" style={{ margin: "0 0 10px" }}>You are booked.</p>
              <ProOffer17 e={e} shift={shift} onDone={onClose} />
              <WalletButton kind="booking" wide dark={false} payload={{ shiftId: shift.id, role: shift.role, date: shift.date, venue: shift.venue }} />
            </div>
          )}
          {e.state === "completed" && <Btn variant="primary wide" onClick={() => act("signed_off")}><PenLine size={14} /> Sign off this shift</Btn>}
          {e.state === "signed_off" && <p className="ff-body ff-muted" style={{ margin: 0 }}>Signed off. The hirer pays you directly, as agreed on the Service Card.</p>}
          {e.state === "paid" && <p className="ff-body" style={{ margin: 0 }}>This shift is closed.</p>}
        </div>
      } />
    </Sheet>
  );
}
