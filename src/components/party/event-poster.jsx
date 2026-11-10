/* src/components/party/event-poster.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* --- FF Party ------------------------------------------------------------ */
const PARTY_OCCASIONS = ["Wedding", "Birthday", "Cocktail party", "Christmas party", "Summer party", "Brand launch", "Corporate event", "Hen or stag"];


const EC_BG = __ff_json("content/data/ec-bg.json");


const EVENT_THEMES = [
  { key: "onyx", name: "Onyx", dark: true, bg: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='58' height='42'><text x='0' y='30' font-family='Georgia,serif' font-style='italic' font-size='26' fill='%23C9A227' fill-opacity='0.045'>FF</text></svg>") 0 0 / 58px 42px repeat, radial-gradient(120% 80% at 50% 0%, #2B2A2E, #0A0A0B 72%)`, swatch: "#141416" },
  { key: "ivory", name: "Ivory", dark: false, bg: "linear-gradient(170deg,#FFFDF7,#F3EAD6)", swatch: "#F5EDDA" },
  { key: "burgundy", name: "Burgundy", dark: true, bg: `url(${EC_BG.monogram}) 0 0 / 64px 46px repeat, radial-gradient(120% 80% at 50% 0%, #7A1B30, #2A0710 72%)`, swatch: "#4E1220" },
  { key: "confetti", name: "Gold Confetti", dark: true, bg: `url(${EC_BG.confetti}) 0 0 / 200px 200px repeat, linear-gradient(170deg,#18181D,#08080A)`, swatch: "linear-gradient(135deg,#0B0B0C 45%,#E8C75E)" },
  { key: "champagne", name: "Champagne", dark: false, bg: `url(${EC_BG.bubbles}) 0 0 / 180px 180px repeat, linear-gradient(165deg,#FAEDC6,#E6CA7C 60%,#D2AE48)`, swatch: "linear-gradient(135deg,#FAEDC6,#D2AE48)" },
];


const eventThemeOf = (card) => EVENT_THEMES.find(t => t.key === (card && card.theme)) || EVENT_THEMES[0];


function eventThemeVars(t) {
  return t.dark ? {
    "--ec-ink": "#F8F0DE", "--ec-accent": "#E9CB7A", "--ec-soft": "rgba(248,240,222,.88)",
    "--ec-panel": "rgba(12,10,11,.74)", "--ec-panel-ink": "#F8F0DE", "--ec-panel-sub": "#CFC2A2",
    "--ec-plabel": "#E9CB7A", "--ec-rule": "rgba(233,203,122,.22)", "--ec-frame": "rgba(233,203,122,.6)",
    "--ec-title2": "#E9CB7A", "--ec-suit": "#F8F0DE", "--ec-rule-strong": "rgba(233,203,122,.42)",
  } : {
    "--ec-ink": "#15130F", "--ec-accent": "#7E611D", "--ec-soft": "#4F483C",
    "--ec-panel": "rgba(255,255,255,.86)", "--ec-panel-ink": "#15130F", "--ec-panel-sub": "#6E675A",
    "--ec-plabel": "#7E611D", "--ec-rule": "rgba(126,97,29,.2)", "--ec-frame": "rgba(176,141,42,.6)",
    "--ec-title2": "#5C1220", "--ec-suit": "#15130F", "--ec-rule-strong": "rgba(126,97,29,.38)",
  };
}



const ecDay = (iso) => {
  if (!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};


const ecTimes = (a, b) => (a && b ? `${a} – ${b}` : a || b || "");


/* Splits a title over two lines of roughly equal length: line one in ink,
   line two in burgundy (gold on dark cards), as on the poster references. */
function ecTitleLines(text) {
  const w = String(text || "").trim().split(/\s+/).filter(Boolean);
  if (w.length < 2) return [w.join(" "), ""];
  const total = w.join(" ").length;
  let best = 1, diff = Infinity;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(" ").length;
    const d = Math.abs(a - (total - a - 1));
    if (d < diff) { diff = d; best = i; }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
}


const ecTitleSize = (len) => (len <= 8 ? 12.5 : len <= 11 ? 10.8 : len <= 15 ? 8.8 : len <= 20 ? 7.2 : 6);



/* The day, in the card's own words. The browser's date picker sits invisibly
   on top, so tapping opens it, but its own label never shows on the card. */
function EcDayField({ value, onChange }) {
  return (
    <div style={{ position: "relative", borderBottom: "1px dashed var(--ec-rule-strong)", padding: ".6cqw 0" }}>
      <span style={{ opacity: value ? 1 : .45, display: "block" }}>{value ? ecDay(value) : "Choose a date"}</span>
      <input type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} aria-label="Event date"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", border: 0, padding: 0, fontSize: 16 }} />
    </div>
  );
}



function EventPoster({ card, edit, onPatch, people = [], saved }) {
  const { state } = useStore();
  const directory = useDirectory();
  const patch = (p) => onPatch && onPatch(p);
  const cm = card.cocktails && card.cocktails.picks && card.cocktails.picks.length ? card.cocktails : null;
  const cNames = cm ? cm.picks.map(id => cocktailById(state, id, directory)).filter(Boolean).map(x => x.name) : [];
  const t = eventThemeOf(card);
  const occasion = card.occasion || "Your event";
  const title = card.title || (edit ? "" : occasion);
  const [l1, l2] = ecTitleLines(title);
  const tSize = ecTitleSize(Math.max(l1.length, l2.length));
  const roles = card.roles || [];
  const host = String(card.host || "").trim();
  /* A role counts as covered once someone on the card does that job; the rest
     show as open places in "Your team". */
  const covers = (p, r) => String(p.profession || "").toLowerCase().includes(r.toLowerCase());
  const open = roles.filter(r => !people.some(p => covers(p, r)));
  const teamSize = people.length + open.length;
  /* Called as plain functions (never as <Components/>) so typing keeps focus. */
  const field = (k, ph, extra = {}) => (
    <input className="ff-ec-input" value={card[k] || ""} placeholder={ph} aria-label={extra["aria-label"] || ph}
      onChange={(e) => patch({ [k]: e.target.value })} {...extra} />
  );
  const area = (k, ph, per = 30) => {
    const v = card[k] || "";
    return (
      <textarea className="ff-ec-input ff-ec-area" value={v} placeholder={ph} aria-label={ph}
        rows={Math.max(1, Math.ceil(Math.max(v.length, ph.length * .8) / per))}
        onChange={(e) => patch({ [k]: e.target.value.replace(/\n/g, " ").slice(0, 160) })} />
    );
  };
  const hl = [
    { Icon: Users, text: edit
      ? <input className="ff-ec-input" inputMode="numeric" value={card.guests || ""} placeholder="Guests" aria-label="Number of guests"
          onChange={(e) => patch({ guests: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
      : (card.guests ? `${card.guests} guests` : "Guests to confirm") },
    { Icon: Sparkles, text: occasion },
    { Icon: Martini, text: teamSize ? `Team of ${teamSize}` : "Your team" },
  ];
  const rows = [
    { key: "where", Icon: MapPin, label: "Venue",
      val: edit ? field("venue", "Venue name") : (card.venue || "Venue to confirm"),
      sub: edit ? field("area", "Area or postcode") : (card.area || null) },
    { key: "when", Icon: Calendar, Art: Clock, label: "When",
      val: edit ? <EcDayField value={card.iso} onChange={(v) => patch({ iso: v })} /> : (card.iso ? ecDay(card.iso) : "Date to confirm"),
      sub: edit ? (
        <span className="ff-ec-times">
          {field("start", "Start", { type: "time", "aria-label": "Start time" })}
          {field("end", "Finish", { type: "time", "aria-label": "Finish time" })}
        </span>
      ) : (ecTimes(card.start, card.end) || null) },
    { key: "who", Icon: Users, label: "Who you need",
      val: roles.length ? roles.join(" · ") : (edit ? "Choose below the card" : "Team to confirm"),
      sub: edit ? "Tap the roles under your card" : null },
    ...(cNames.length ? [{ key: "cocktails", Icon: Martini, Art: Wine, label: "Cocktails",
      val: cNames.slice(0, 3).join(" · ") + (cNames.length > 3 ? ` +${cNames.length - 3}` : ""), sub: menuLine(cm) }] : []),
    { key: "host", Icon: User, Art: PenLine, label: "Planned by",
      val: edit ? field("host", "Your name") : (host || "You"),
      sub: <i>Saved on FF Party. Shared on WhatsApp.</i> },
  ];
  const slots = open.slice(0, 4);

  return (
    <div className="ff-ec" style={eventThemeVars(t)}>
      <div className="ff-ec-bg" style={{ background: t.bg }} />
      <span className="ff-ec-edge" />
      <span className="ff-ec-orn tl" /><span className="ff-ec-orn tr" />
      <div className="ff-ec-ribbon"><Calendar size={11} /> Event Card</div>
      <span className="ff-ec-coin"><Coin size="100%" tier="gold" /></span>

      <div className="ff-ec-in">
        <header className="ff-ec-head">
          <div className="ff-ec-mark">FF<span className="suit">♠</span></div>
          <div className="ff-ec-brand"><i /><span className="ff-ec-dia" /><span>ffparty.uk</span><span className="ff-ec-dia" /><i /></div>
          <div className="ff-ec-kicker"><i /> {occasion} <i /></div>
          <h3 className="ff-ec-title" style={{ fontSize: `${tSize}cqw` }}>
            {edit
              ? <textarea className="ff-ec-input ff-ec-area" value={card.title || ""} placeholder="Name your event"
                  rows={(card.title || "").length > 13 ? 2 : 1} aria-label="Event name"
                  onChange={(e) => patch({ title: e.target.value.replace(/\n/g, " ").slice(0, 60) })}
                  style={{ color: "var(--ec-title2)", fontSize: `${(card.title || "").length > 22 ? 7 : (card.title || "").length > 13 ? 8.4 : 9.5}cqw`, lineHeight: 1.05 }} />
              : (<><span className="l1">{l1}</span>{l2 && <span className="l2">{l2}</span>}</>)}
          </h3>
          {(edit || card.subtitle) && (
            <div className="ff-ec-sub">
              <span className="ff-ec-dia" />
              {edit ? <span style={{ flex: 1, minWidth: 0 }}>{area("subtitle", "A line under the title", 22)}</span> : <span>{card.subtitle}</span>}
              <span className="ff-ec-dia" />
            </div>
          )}
          {edit
            ? <div className="ff-ec-tag">{area("note", "Tell your team about the event…", 32)}</div>
            : card.note && <p className="ff-ec-tag">{card.note}</p>}
        </header>

        <div className="ff-ec-hl">
          {hl.map((h, i) => (
            <div key={i}>
              <span className="ring"><h.Icon size={15} strokeWidth={1.5} /></span>
              <span className="t">{h.text}</span>
            </div>
          ))}
        </div>

        <div className="ff-ec-rows">
          {rows.map(r => {
            const Art = r.Art || r.Icon;
            return (
              <div key={r.key} className="ff-ec-row">
                <span className="mc"><span className="ff-ec-medal"><r.Icon size={18} strokeWidth={1.7} /></span></span>
                <span className="tx">
                  <span className="lbl">{r.label}</span>
                  <span className="val">{r.val}</span>
                  {r.sub && <span className="sub">{r.sub}</span>}
                </span>
                <span className="art" aria-hidden="true"><Art size={34} strokeWidth={1} /></span>
              </div>
            );
          })}
        </div>

        <div className="ff-ec-team">
          <div className="ff-ec-capt"><i /><span className="ff-ec-dia" /> Your team <span className="ff-ec-dia" /><i /></div>
          {people.length || slots.length ? (
            <div className="ff-ec-people">
              {people.slice(0, 8).map(p => (
                <div key={p.id} className="ff-ec-person">
                  <Portrait src={p.photo} name={p.name} size={44} tier={p.tier} />
                  <b>{String(p.name || "").split(" ")[0]}</b>
                  <span>{p.profession}</span>
                </div>
              ))}
              {slots.map(r => (
                <div key={`slot-${r}`} className="ff-ec-person">
                  <div className="ff-ec-slot" aria-hidden="true">+</div>
                  <b>{r}</b>
                  <span>To find</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="ff-ec-note">{edit ? "Tap people below to add them to your booking bar. They join your card here." : "Add people from your booking bar and they join your card here."}</p>
          )}
        </div>
      </div>

      <footer className="ff-ec-foot">
        <span className="qr"><Share2 size={26} /></span>
        <span className="msg">
          <b>{saved ? "Saved on FF Party" : "Share it on WhatsApp"}</b>
          <span>Your team sees the same card.</span>
        </span>
        <span className="cn"><Coin size="100%" tier="gold" /></span>
        <span className="slogan">People.<br /><em>Events.</em><br />Experiences.</span>
      </footer>
      <div className="ff-ec-strap">Plan · Book · Celebrate</div>
      <span className="ff-ec-orn bl" /><span className="ff-ec-orn br" />
    </div>
  );
}



const emptyEventCard = () => ({ theme: "onyx", occasion: "Wedding", title: "", subtitle: "", note: "", guests: "", venue: "", area: "", iso: "", start: "", end: "", host: "", roles: ["Bartender"] });



/* One search text per person, shared by the Network search and the FF Party
   search: name, tag, professions, skills, interests, qualifications,
   languages and areas. */
function personSearchText(p) {
  return [p.name, p.tag, p.profession, ...(p.professions || []), ...(p.skills || []), ...(p.interests || []),
    ...(p.qualifications || []), ...(p.languages || []), ...(p.locations || [])].join(" ").toLowerCase();
}




/* ==========================================================================
   FF PARTY SITE (v16.13) — FF Party is its own site, at ffparty.uk. It is a
   copy of FF Staff for people planning events: the same hirer account,
   booking bar, Network, Bookings and Profile, with the FF Party Event Card
   (the ffme.uk-style card) on its home page instead of FF Staff's white one.
   In the prototype both sites are role "staff"; state.site ("staff" or
   "party") decides which site you're on.
   ========================================================================== */
const hireSiteOf = (state) => (state.role === "staff" && state.site === "party")
  ? { key: "party", name: "FF Party", party: true, anchor: "ff-party-event" }
  : { key: "staff", name: "FF Staff", party: false, anchor: "ff-staff-event" };



const posterFromEvent = (ev) => ev.poster ? { ...emptyEventCard(), ...ev.poster, cocktails: ev.cocktails || null } : {
  ...emptyEventCard(), occasion: "Event", roles: [], title: ev.title || "", iso: ev.iso || "",
  start: ev.start || splitTime(ev.time)[0] || "", end: ev.end || splitTime(ev.time)[1] || "",
  venue: ev.venue || "", area: ev.address || "", host: ev.client || "", guests: ev.guests || "", note: ev.notes || "",
  cocktails: ev.cocktails || null,
};
