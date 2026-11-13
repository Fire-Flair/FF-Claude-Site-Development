/* src/components/admin/admin-ui.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- Small parts ------------------------------------------------------------------------------------ */
function Sw17({ on, onChange, disabled, label }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} aria-label={label} disabled={disabled} className={`ff-adm-sw${on ? " on" : ""}`} onClick={() => !disabled && onChange(!on)}>
      <i aria-hidden="true" />
    </button>
  );
}


function Vis17({ hidden, onToggle, can }) {
  return (
    <button type="button" className={`ff-adm-vis${hidden ? " off" : ""}`} disabled={!can} onClick={onToggle} aria-pressed={!hidden}>
      {hidden ? <><A17I.EyeOff size={13} /> Hidden</> : <><A17I.Eye size={13} /> Live</>}
    </button>
  );
}


function Search17({ value, onChange, placeholder }) {
  return <label className="ff-adm-q"><A17I.Search size={15} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>;
}


function AdmChips17({ value, onChange, options }) {
  return <div className="ff-adm-chips" role="group">{options.map(([k, l, n]) => <button key={k} type="button" aria-pressed={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{l}{n != null && <em>{n}</em>}</button>)}</div>;
}


const match17 = (q, ...parts) => { const n = String(q || "").trim().toLowerCase(); return !n || parts.join(" ").toLowerCase().includes(n); };


function Empty17({ children }) { return <p className="ff-adm-empty">{children}</p>; }



/* ---- Sections --------------------------------------------------------------------------------------- */
function AdmOverview17({ d, go }) {
  const tiles = [
    ["people", "People", d.people.length, A17I.Users], ["companies", "Companies", d.companies.length, A17I.Brief],
    ["cards", "Packages and cards", d.packages.length + d.cards.length, A17I.Layers], ["guests", "Guests", d.guests.length, A17I.Party],
    ["bookings", "Booking requests", d.engagements.length, A17I.Cal], ["reviews", "Reviews", d.reviews.length, A17I.Star],
    ["qa", "Answers and sign-ups", d.qa.length, A17I.Msg], ["admins", "Admins", d.admins.filter(x => x.active).length + d.gold.length, A17I.Shield],
  ];
  return (
    <>
      <div className="ff-adm-tiles">
        {tiles.map(([k, l, n, Ic], i) => <button key={i} type="button" className="ff-adm-tile" onClick={() => go(k)}><Ic size={16} /><b>{n}</b><span>{l}</span></button>)}
      </div>
      <h3 className="ff-adm-h3">Sites</h3>
      <div className="ff-adm-sitesum">
        {FF_SITES.map(s => { const live = PHASE1.sitesOpen.includes(s.key); return <span key={s.key} className={live ? "on" : ""}><SiteMark site={s} size={22} /> {s.name}<em>{live ? "Live" : "Offline"}</em></span>; })}
      </div>
      <h3 className="ff-adm-h3">Hidden</h3>
      <div className="ff-adm-hidsum">
        {[["people", "People"], ["companies", "Companies"], ["packages", "Packages"], ["cards", "Cards"], ["reviews", "Reviews"], ["events", "Events"], ["questions", "Questions"]].map(([k, l]) =>
          <span key={k}><b>{Object.values(d.A.hidden[k] || {}).filter(Boolean).length}</b> {l}</span>)}
      </div>
      <h3 className="ff-adm-h3">Recent activity</h3>
      {d.A.log.length ? <AdmLogList17 log={d.A.log.slice(0, 6)} /> : <Empty17>No admin changes yet.</Empty17>}
    </>
  );
}



function AdmSites17({ d, act, can }) {
  const f = { ...(P1_DEF17 || {}), ...(d.A.flags || {}) };
  const feats = [
    ["bookingsLive", "Bookings", "FF Team Bookings, FF Staff and FF Party booking flows"],
    ["xpLive", "FF XP", "Points and levels on profiles"],
    ["leaderboards", "Leaderboards", "Top performer rankings"],
    ["desktopAdd", "Add button", "The Add FireFlair button in the desktop top bar"],
  ];
  return (
    <>
      <div className="ff-adm-list">
        {FF_SITES.map(s => {
          const live = (f.sitesOpen || []).includes(s.key), vip = s.key === "vip";
          return (
            <div key={s.key} className="ff-adm-row">
              <SiteMark site={s} size={34} />
              <span className="mn"><b>{s.name}</b><small>{s.domain}</small></span>
              <span className={`ff-adm-pill${live ? " ok" : ""}`}>{live ? "Live" : "Offline"}</span>
              <Sw17 on={live} disabled={!can("sites")} label={`${s.name} live`} onChange={(v) => act({ op: "site", key: s.key, value: v, label: s.name })} />
            </div>
          );
        })}
      </div>
      <h3 className="ff-adm-h3">Features</h3>
      <div className="ff-adm-list">
        {feats.map(([k, l, sub]) => (
          <div key={k} className="ff-adm-row">
            <span className="mn"><b>{l}</b><small>{sub}</small></span>
            <span className={`ff-adm-pill${f[k] ? " ok" : ""}`}>{f[k] ? "On" : "Off"}</span>
            <Sw17 on={!!f[k]} disabled={!can("sites")} label={l} onChange={(v) => act({ op: "flag", key: k, value: v, label: l })} />
          </div>
        ))}
      </div>
    </>
  );
}



function AdmPeople17({ d, act, can, dispatch }) {
  const [q, setQ] = useState(""), [f, setF] = useState("all"), [open, setOpen] = useState(null);
  const H = d.A.hidden.people, T = d.A.tier.people;
  const tierOf = (p) => T[p.id] || p.tier || "standard";
  const list = d.people.filter(p => match17(q, p.name, p.tag, p.profession, (p.locations || []).join(" ")))
    .filter(p => f === "all" || (f === "hidden" ? H[p.id] : f === "live" ? !H[p.id] : tierOf(p) === f));
  const n = (fn) => d.people.filter(fn).length;
  return (
    <>
      <div className="ff-adm-tools">
        <Search17 value={q} onChange={setQ} placeholder="Search name, tag, profession or area" />
        <AdmChips17 value={f} onChange={setF} options={[["all", "All", d.people.length], ["live", "Live", n(p => !H[p.id])], ["hidden", "Hidden", n(p => H[p.id])], ["gold", "Gold", n(p => tierOf(p) === "gold")]]} />
      </div>
      <div className="ff-adm-list">
        {list.map(p => (
          <div key={p.id} className={`ff-adm-row tall${H[p.id] ? " is-hid" : ""}`}>
            <button type="button" className="ff-adm-who" onClick={() => setOpen(open === p.id ? null : p.id)} aria-expanded={open === p.id}>
              <Portrait src={p.photo} name={p.name} size={40} tier={tierOf(p)} />
              <span className="mn"><b>{p.name}</b><small>{[p.tag && `@${p.tag}`, p.profession, (p.locations || [])[0]].filter(Boolean).join(" · ")}</small></span>
            </button>
            <select className="ff-adm-sel" value={tierOf(p)} disabled={!can("verify")} aria-label={`Verification for ${p.name}`}
              onChange={(e) => act({ op: "tier", kind: "people", id: p.id, value: e.target.value, label: p.name })}>
              {TIERS17.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <Vis17 hidden={H[p.id]} can={can("hide")} onToggle={() => act({ op: H[p.id] ? "show" : "hide", kind: "people", id: p.id, label: p.name })} />
            {open === p.id && (
              <div className="ff-adm-more">
                <dl>
                  <div><dt>Source</dt><dd>{p.src}</dd></div>
                  {p.tag && <div><dt>Profile</dt><dd>{CARD_DOMAIN}/{p.tag}</dd></div>}
                  {[["Skills", p.skills], ["Qualifications", p.qualifications], ["Languages", p.languages], ["Work locations", p.locations], ["Interests", p.interests]].filter(([, v]) => v && v.length).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{fmt17(v)}</dd></div>)}
                  {p.rating ? <div><dt>Rating</dt><dd>{p.rating} from {p.reviews || 0} reviews</dd></div> : null}
                  {p.years ? <div><dt>Experience</dt><dd>{p.years} years</dd></div> : null}
                </dl>
                {can("data") && (() => { const mine = d.qa.filter(r => (p.id === "me" && r.area !== "Asked on profiles") || (r.about && r.about === p.name)); return (
                  <div className="ff-adm-ans"><b>Answers and sign-ups</b>
                    {mine.length ? <ul>{mine.slice(0, 40).map((r, i) => <li key={i}><small>{r.area}</small><span>{r.q}</span><em>{r.a}</em></li>)}</ul> : <Empty17>None recorded.</Empty17>}
                  </div>); })()}
                <Btn variant="sm" onClick={() => { dispatch({ type: "VIEW", id: p.id, direct: true }); window.scrollTo(0, 0); }}><A17I.Eye size={13} /> Open profile</Btn>
              </div>
            )}
          </div>
        ))}
        {!list.length && <Empty17>No one matches.</Empty17>}
      </div>
    </>
  );
}



function AdmCompanies17({ d, act, can, dispatch }) {
  const [q, setQ] = useState("");
  const H = d.A.hidden.companies, T = d.A.tier.companies;
  const list = d.companies.filter(c => match17(q, c.name, c.tag, c.kind, c.area));
  return (
    <>
      <div className="ff-adm-tools"><Search17 value={q} onChange={setQ} placeholder="Search companies" /></div>
      <div className="ff-adm-list">
        {list.map(c => (
          <div key={c.id} className={`ff-adm-row tall${H[c.id] ? " is-hid" : ""}`}>
            <button type="button" className="ff-adm-who" onClick={() => { dispatch({ type: "VIEW_COMPANY", id: c.id }); window.scrollTo(0, 0); }}>
              <span className="ff-adm-logo">{c.logo ? <img decoding="async" src={c.logo} alt="" /> : <Coin size={30} tier={T[c.id] || c.tier || "standard"} />}</span>
              <span className="mn"><b>{c.name}</b><small>{[c.kind, c.area, c.staffCount ? `${c.staffCount} staff` : "", c.src].filter(Boolean).join(" · ")}</small></span>
            </button>
            <select className="ff-adm-sel" value={T[c.id] || c.tier || "standard"} disabled={!can("verify")} aria-label={`Verification for ${c.name}`}
              onChange={(e) => act({ op: "tier", kind: "companies", id: c.id, value: e.target.value, label: c.name })}>
              {TIERS17.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <Vis17 hidden={H[c.id]} can={can("hide")} onToggle={() => act({ op: H[c.id] ? "show" : "hide", kind: "companies", id: c.id, label: c.name })} />
          </div>
        ))}
        {!list.length && <Empty17>No companies match.</Empty17>}
      </div>
    </>
  );
}



function AdmCards17({ d, act, can }) {
  const [t, setT] = useState("packages");
  const HP = d.A.hidden.packages, HC = d.A.hidden.cards;
  const types = [["packages", "FireFlair packages", d.packages.length], ["Service card", "Service cards", d.cards.filter(c => c.type === "Service card").length],
    ["Cocktail", "Cocktails", d.cards.filter(c => /cocktail$/.test(c.type)).length], ["Story", "Stories", d.cards.filter(c => c.type === "Story").length]];
  return (
    <>
      <div className="ff-adm-tools"><AdmChips17 value={t} onChange={setT} options={types} /></div>
      <div className="ff-adm-list">
        {t === "packages" ? d.packages.map(sv => (
          <div key={sv.id} className={`ff-adm-row${HP[sv.id] ? " is-hid" : ""}`}>
            <span className={`ff-adm-dot ${sv.tone || ""}`} aria-hidden="true" />
            <span className="mn"><b>{sv.title}</b><small>{[sv.level, sv.time].filter(Boolean).join(" · ")}</small></span>
            <Vis17 hidden={HP[sv.id]} can={can("hide")} onToggle={() => act({ op: HP[sv.id] ? "show" : "hide", kind: "packages", id: sv.id, label: sv.title })} />
          </div>
        )) : d.cards.filter(c => t === "Cocktail" ? /cocktail$/.test(c.type) : c.type === t).map(c => (
          <div key={c.id} className={`ff-adm-row${HC[c.id] ? " is-hid" : ""}`}>
            <span className="mn"><b>{c.title}</b><small>{[c.sub, c.by].filter(Boolean).join(" · ")}</small></span>
            <Vis17 hidden={HC[c.id]} can={can("hide")} onToggle={() => act({ op: HC[c.id] ? "show" : "hide", kind: "cards", id: c.id, label: c.title })} />
          </div>
        ))}
        {t !== "packages" && !d.cards.some(c => t === "Cocktail" ? /cocktail$/.test(c.type) : c.type === t) && <Empty17>None yet.</Empty17>}
      </div>
    </>
  );
}



function AdmGuests17({ d, act, can }) {
  const [q, setQ] = useState(""), [open, setOpen] = useState(null);
  const H = d.A.hidden.guests, T = d.A.tier.guests;
  const list = d.guests.filter(g => match17(q, g.name, g.usualArea, g.profession));
  const evs = (g) => g.id === "mine" ? d.events.filter(e => e.site === "party").length : 0;
  return (
    <>
      <div className="ff-adm-tools"><Search17 value={q} onChange={setQ} placeholder="Search guests" /></div>
      <div className="ff-adm-list">
        {list.map(g => (
          <div key={g.id} className={`ff-adm-row tall${H[g.id] ? " is-hid" : ""}`}>
            <button type="button" className="ff-adm-who" onClick={() => setOpen(open === g.id ? null : g.id)} aria-expanded={open === g.id}>
              <Portrait src={g.photo} name={g.name} size={40} tier={T[g.id] || "standard"} />
              <span className="mn"><b>{g.name}</b><small>{[g.usualArea, `${evs(g)} FF Party events`, g.src].filter(Boolean).join(" · ")}</small></span>
            </button>
            <select className="ff-adm-sel" value={T[g.id] || "standard"} disabled={!can("verify")} aria-label={`Verification for ${g.name}`}
              onChange={(e) => act({ op: "tier", kind: "guests", id: g.id, value: e.target.value, label: g.name })}>
              {TIERS17.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
            </select>
            <Vis17 hidden={H[g.id]} can={can("hide")} onToggle={() => act({ op: H[g.id] ? "show" : "hide", kind: "guests", id: g.id, label: g.name })} />
            {open === g.id && (
              <div className="ff-adm-more"><dl>
                {[["Party style", g.partyStyle], ["Usual area", g.usualArea], ["Drinks", g.drinks], ["Favourite cocktails", g.cocktails], ["For the staff", g.staffPrefs], ["Drink notes", g.drinkNotes], ["Good to know", g.staffKnow]].filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
              </dl></div>
            )}
          </div>
        ))}
        {!list.length && <Empty17>No guests match.</Empty17>}
      </div>
    </>
  );
}



function AdmInvites17({ d, act, can }) {
  const [name, setName] = useState(""), [contact, setContact] = useState(""), [site, setSite] = useState("team");
  const send = () => { if (!contact.trim()) return; act({ op: "invite", name, contact, site }); setName(""); setContact(""); };
  const joined = (x) => d.people.some(p => p.phone && String(p.phone).replace(/\D/g, "").endsWith(String(x.contact).replace(/\D/g, "").slice(-9)));
  return (
    <>
      {can("hide") && (
        <div className="ff-adm-inv">
          <label className="ff-adm-q"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Name" /></label>
          <label className="ff-adm-q"><input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Mobile number or email" aria-label="Mobile number or email" onKeyDown={(e) => e.key === "Enter" && send()} /></label>
          <select className="ff-adm-sel" value={site} onChange={(e) => setSite(e.target.value)} aria-label="Site">{Object.entries(SITE_NAME17).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
          <Btn variant="sm primary" onClick={send}><A17I.Send size={13} /> Send invitation</Btn>
        </div>
      )}
      <div className="ff-adm-list">
        {d.A.invites.map(x => (
          <div key={x.id} className="ff-adm-row">
            <span className="mn"><b>{x.name || x.contact}</b><small>{[x.name ? x.contact : "", SITE_NAME17[x.site], `sent ${when17(x.at)}`, x.sends > 1 ? `${x.sends} sends` : "", `by @${x.by}`].filter(Boolean).join(" · ")}</small></span>
            <span className={`ff-adm-pill${joined(x) ? " ok" : ""}`}>{joined(x) ? "Joined" : "Waiting"}</span>
            {!joined(x) && <button type="button" className="ff-adm-ghost" disabled={!can("hide")} onClick={() => act({ op: "invite_resend", id: x.id, label: x.name || x.contact })}>Resend</button>}
          </div>
        ))}
        {!d.A.invites.length && <Empty17>No invitations yet.</Empty17>}
      </div>
    </>
  );
}



/* Response time: from the request being sent to the first reply in its history. */
const dur17 = (ms) => { if (ms == null || ms < 0) return ""; if (ms < 6e4) return `${Math.round(ms / 1000)}s`; const m = Math.round(ms / 6e4); return m < 60 ? `${m}m` : m < 2880 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${Math.round(m / 1440)} days`; };


const replyAt17 = (e) => { const h = (e.history || []).find(x => x.state !== "requested" && x.by !== "admin" && (!e.sentAt || x.at >= e.sentAt)); return h ? h.at : null; };


const OVERRIDE17 = ["requested", "available", "unavailable", "confirmed", "completed", "expired"];


function AdmBookings17({ d, act, can, state, dispatch }) {
  const [f, setF] = useState("all"), [q, setQ] = useState("");
  const H = d.A.hidden.events;
  const people = d.people.filter(p => p.id !== "me" || true);
  const nameOf = (id) => ((people.find(p => p.id === id) || {}).name) || id || "";
  const engOf = (sh) => d.engagements.filter(e => e.shiftId === sh.id);
  const fit = (e) => f === "all" || (f === "waiting" ? e.state === "requested" : f === "declined" ? e.state === "unavailable" : e.state === f);
  const replied = d.engagements.map(e => { const r = replyAt17(e); return r && e.sentAt ? r - e.sentAt : null; }).filter(x => x != null);
  const avg = replied.length ? replied.reduce((a, b) => a + b, 0) / replied.length : null;
  const n = (st) => d.engagements.filter(e => e.state === st).length;
  const evs = d.events.filter(e => match17(q, eventTitle(e), e.venue, ...(state.shifts || []).filter(x => x.eventId === e.id).flatMap(x => [x.role, ...staffOf(x).map(nameOf)])));
  return (
    <>
      <AdmAutofill17 state={state} dispatch={dispatch} can={can} />
      <AdmSpecial17 state={state} dispatch={dispatch} />
      <div className="ff-adm-kpis">
        <span><b>{d.engagements.length}</b> requests</span><span><b>{n("requested")}</b> waiting</span><span><b>{n("confirmed")}</b> confirmed</span>
        <span><b>{avg != null ? dur17(avg) : "–"}</b> average reply</span>
      </div>
      <div className="ff-adm-tools">
        <Search17 value={q} onChange={setQ} placeholder="Search events, roles or people" />
        <AdmChips17 value={f} onChange={setF} options={[["all", "All"], ["waiting", "Waiting", n("requested")], ["confirmed", "Confirmed", n("confirmed")], ["declined", "Declined", n("unavailable")], ["expired", "Expired", n("expired")]]} />
      </div>
      <div className="ff-adm-list">
        {evs.map(ev => { const shs = (state.shifts || []).filter(x => x.eventId === ev.id); const rows = shs.flatMap(sh => { const es = engOf(sh); return es.length ? es.filter(fit).map(e => ({ sh, e })) : (f === "all" ? [{ sh, e: null }] : []); });
          if (!rows.length && f !== "all") return null; return (
          <div key={ev.id} className={`ff-adm-bk${H[ev.id] ? " is-hid" : ""}`}>
            <div className="hd">
              <span className="ff-adm-date">{ev.iso ? <><b>{Number(ev.iso.slice(8, 10))}</b><small>{MONTHS[Number(ev.iso.slice(5, 7)) - 1].slice(0, 3)}</small></> : <small>No date</small>}</span>
              <span className="mn"><b>{eventTitle(ev)}</b><small>{[ev.site === "party" ? "FF Party" : "FF Staff", ev.venue, ev.quality ? `${ev.quality} preferred` : ""].filter(Boolean).join(" · ")}</small></span>
              <Vis17 hidden={H[ev.id]} can={can("hide")} onToggle={() => act({ op: H[ev.id] ? "show" : "hide", kind: "events", id: ev.id, label: eventTitle(ev) })} />
            </div>
            {rows.map(({ sh, e }) => { const r = e && replyAt17(e); const label = `${sh.role || "Role"} · ${eventTitle(ev)}`; return (
              <div key={e ? e.id : sh.id} className="ln">
                <span className="mn"><b>{sh.role || "Role"}</b><small>{e ? nameOf(e.staffId) : (staffOf(sh).map(nameOf).join(", ") || "Nobody assigned")}{sh.time ? ` · ${sh.time}` : ""}</small></span>
                <span className="tm">{!e ? "Not sent" : r ? `Replied in ${dur17(r - e.sentAt)}` : e.state === "requested" ? `Waiting · ${timeLeft(e.expiresAt)}` : e.sentAt ? `Sent ${when17(e.sentAt)}` : ""}</span>
                {e && <>
                  <select className="ff-adm-sel" value={e.state} disabled={!can("hide")} aria-label={`Status of ${label}`} onChange={(x) => act({ op: "eng_state", id: e.id, value: x.target.value, label })}>
                    {[...new Set([e.state, ...OVERRIDE17])].map(k => <option key={k} value={k}>{ENG_LABEL[k] || k}</option>)}
                  </select>
                  {["requested", "expired"].includes(e.state) && <button type="button" className="ff-adm-ghost" disabled={!can("hide")} onClick={() => act({ op: "eng_extend", id: e.id, label })}>+24h</button>}
                  <select className="ff-adm-sel" value="" disabled={!can("hide")} aria-label={`Reassign ${label}`} onChange={(x) => x.target.value && act({ op: "eng_reassign", id: e.id, to: x.target.value, label })}>
                    <option value="">Reassign…</option>
                    {people.filter(p => p.id !== e.staffId).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </>}
              </div>); })}
          </div>); })}
        {!evs.length && <Empty17>No bookings yet.</Empty17>}
      </div>
    </>
  );
}



function AdmAnalytics17({ can, dispatch }) {
  useAn17(); const [t, setT] = useState("screens");
  const ev = AN17.events;
  const sessions = new Set(ev.map(e => e.sid)).size;
  const views = ev.filter(e => e.type === "view"), clicks = ev.filter(e => e.type === "click");
  const by = (list, key) => { const m = new Map(); list.forEach(e => { const k = key(e); m.set(k, (m.get(k) || 0) + 1); }); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
  const time = new Map(); ev.filter(e => e.type === "view_end").forEach(e => { const x = time.get(e.screen) || { ms: 0, n: 0, sc: 0 }; x.ms += e.ms; x.sc += e.scroll || 0; x.n++; time.set(e.screen, x); });
  const screens = by(views, e => e.screen).map(([k, n]) => ({ k, n, avg: time.get(k) ? time.get(k).ms / time.get(k).n : null, total: time.get(k) ? time.get(k).ms : 0, scroll: time.get(k) ? Math.round(time.get(k).sc / time.get(k).n) : null }));
  const fieldRows = (() => { const m = new Map(); ev.filter(e => e.type === "field").forEach(e => { const k = `${e.screen}|${e.label}`; const x = m.get(k) || { screen: e.screen, label: e.label, start: 0, empty: 0 }; if (e.action === "empty") x.empty++; else x.start++; m.set(k, x); }); return [...m.values()].sort((a, b) => b.empty - a.empty || b.start - a.start); })();
  const visitors = ev.filter(e => e.type === "session_start");
  const clicked = new Set(clicks.map(e => `${e.screen}|${e.label}`));
  const unclicked = []; const seenPairs = new Map();
  ev.filter(e => e.type === "shown").forEach(e => (e.labels || []).forEach(l => { const k = `${e.screen}|${l}`; seenPairs.set(k, (seenPairs.get(k) || 0) + 1); }));
  seenPairs.forEach((n, k) => { if (!clicked.has(k)) { const [sc, l] = k.split("|"); unclicked.push({ sc, l, n }); } });
  unclicked.sort((a, b) => b.n - a.n);
  const funnel = ["view", "sign_in", "profile_live", "event_created", "booking_request"].map(k => [k, new Set(ev.filter(e => e.type === k).map(e => e.sid)).size]);
  const FUN = { view: "Landed", sign_in: "Signed in", profile_live: "Profile live", event_created: "Created an event", booking_request: "Sent a booking request" };
  const copy = () => {
    const esc = (x) => `"${String(x == null ? "" : x).replace(/"/g, '""')}"`;
    const csv = [["Time", "Session", "Type", "Screen", "Label", "Time on screen (s)", "Width"], ...ev.map(e => [new Date(e.at).toISOString(), e.sid, e.type, e.screen, e.label || (e.labels || []).join(" | "), e.ms ? Math.round(e.ms / 1000) : "", e.w])].map(r => r.map(esc).join(",")).join("\n");
    try { navigator.clipboard.writeText(csv).then(() => dispatch({ type: "TOAST", toast: `${ev.length} events copied` }), () => dispatch({ type: "TOAST", toast: "Copying isn't allowed in this view" })); }
    catch (e) { dispatch({ type: "TOAST", toast: "Copying isn't allowed in this view" }); }
  };
  return (
    <>
      <dl className="ff-adm-setup">
        <div><dt>Tracking</dt><dd>On for every visitor from landing {ev.length > 0 && can("export") && <button type="button" className="ff-adm-ghost" onClick={clearAnalytics17}>Clear this device's events</button>}</dd></div>
        <div><dt>Platform</dt><dd>{ANALYTICS_ADAPTER.platform}</dd></div>
        <div><dt>IP address and location</dt><dd>Recorded by FireFlair Core after consent</dd></div>
      </dl>
      <div className="ff-adm-kpis">
        <span><b>{sessions}</b> sessions</span><span><b>{views.length}</b> screens viewed</span><span><b>{clicks.length}</b> clicks</span>
        <span><b>{dur17(screens.reduce((a, x) => a + x.total, 0))}</b> time on site</span>
      </div>
      <div className="ff-adm-tools">
        <AdmChips17 value={t} onChange={setT} options={[["screens", "Screens"], ["clicks", "Clicks"], ["unclicked", "Seen, not clicked"], ["fields", "Fields skipped"], ["visitors", "Visitors"], ["funnel", "Funnel"], ["events", "All events", ev.length]]} />
        {can("export") && ev.length > 0 && <button type="button" className="ff-adm-ghost" onClick={copy}><A17I.Copy size={13} /> Copy as CSV</button>}
      </div>
      {!ev.length ? <Empty17>No events yet.</Empty17> :
      <div className="ff-adm-table an" role="table" aria-label="Analytics">
        {t === "screens" && <><div className="tr th" role="row"><span role="columnheader">Screen</span><span role="columnheader">Views</span><span role="columnheader">Average time</span><span role="columnheader">Scrolled</span></div>
          {screens.map(x => <div key={x.k} className="tr" role="row"><span role="cell" className="qq">{x.k}</span><span role="cell">{x.n}</span><span role="cell">{x.avg != null ? dur17(x.avg) : "–"}</span><span role="cell">{x.scroll != null ? `${x.scroll}%` : "–"}</span></div>)}</>}
        {t === "clicks" && <><div className="tr th" role="row"><span role="columnheader">Clicked</span><span role="columnheader">Screen</span><span role="columnheader">Clicks</span></div>
          {by(clicks, e => `${e.label}|${e.screen}`).slice(0, 200).map(([k, n]) => { const [l, sc] = k.split("|"); return <div key={k} className="tr" role="row"><span role="cell" className="qq">{l}</span><span role="cell" className="ar">{sc}</span><span role="cell">{n}</span></div>; })}</>}
        {t === "unclicked" && <><div className="tr th" role="row"><span role="columnheader">Shown, never clicked</span><span role="columnheader">Screen</span><span role="columnheader">Times shown</span></div>
          {unclicked.slice(0, 200).map(x => <div key={x.sc + x.l} className="tr" role="row"><span role="cell" className="qq">{x.l}</span><span role="cell" className="ar">{x.sc}</span><span role="cell">{x.n}</span></div>)}</>}
        {t === "fields" && <><div className="tr th" role="row"><span role="columnheader">Field</span><span role="columnheader">Screen</span><span role="columnheader">Started</span><span role="columnheader">Left empty</span></div>
          {fieldRows.slice(0, 200).map(x => <div key={x.screen + x.label} className="tr" role="row"><span role="cell" className="qq">{x.label}</span><span role="cell" className="ar">{x.screen}</span><span role="cell">{x.start}</span><span role="cell">{x.empty}</span></div>)}</>}
        {t === "visitors" && <><div className="tr th" role="row"><span role="columnheader">Came from</span><span role="columnheader">Device</span><span role="columnheader">Language and time zone</span><span role="columnheader">Window</span></div>
          {visitors.slice(-100).reverse().map((e, i) => <div key={i} className="tr" role="row"><span role="cell" className="qq">{e.referrer ? e.referrer.replace(/^https?:\/\//, "").slice(0, 60) : "Direct"}{e.utm && e.utm.utm_source ? ` · ${e.utm.utm_source}` : ""}<small>{when17(e.at)}</small></span><span role="cell">{e.device} · {e.browser}</span><span role="cell">{[e.lang, e.tz].filter(Boolean).join(" · ")}</span><span role="cell">{e.winW} × {e.winH}</span></div>)}</>}
        {t === "funnel" && <><div className="tr th" role="row"><span role="columnheader">Step</span><span role="columnheader">Sessions</span><span role="columnheader">Of landed</span></div>
          {funnel.map(([k, n]) => <div key={k} className="tr" role="row"><span role="cell" className="qq">{FUN[k]}</span><span role="cell">{n}</span><span role="cell">{funnel[0][1] ? `${Math.round(n / funnel[0][1] * 100)}%` : "–"}</span></div>)}</>}
        {t === "events" && <><div className="tr th" role="row"><span role="columnheader">When</span><span role="columnheader">Event</span><span role="columnheader">Screen</span><span role="columnheader">Detail</span></div>
          {ev.slice(-200).reverse().map((e, i) => <div key={i} className="tr" role="row"><span role="cell" className="ar">{when17(e.at)}</span><span role="cell">{e.type}</span><span role="cell" className="ar">{e.screen}</span><span role="cell" className="aa">{e.label || (e.ms ? `${Math.round(e.ms / 1000)}s` : e.labels ? `${e.labels.length} shown` : e.to || "")}</span></div>)}</>}
      </div>}
    </>
  );
}




function AdmQA17({ d, act, can, dispatch }) {
  const [q, setQ] = useState(""), [area, setArea] = useState("all"), [view, setView] = useState("answers");
  const H = d.A.hidden.questions;
  const areas = [...new Set(d.qa.map(r => r.area))];
  const rows = d.qa.filter(r => (area === "all" || r.area === area) && match17(q, r.area, r.q, r.a, r.account, r.about));
  const copy = () => {
    const esc = (x) => `"${String(x || "").replace(/"/g, '""')}"`;
    const csv = [["Area", "Account", "About", "Question", "Core key", "Answer"], ...rows.map(r => [r.area, r.account, r.about || "", r.q, r.key || "", r.a])].map(r => r.map(esc).join(",")).join("\n");
    try { navigator.clipboard.writeText(csv).then(() => dispatch({ type: "TOAST", toast: `${rows.length} rows copied` }), () => dispatch({ type: "TOAST", toast: "Copying isn't allowed in this view" })); }
    catch (e) { dispatch({ type: "TOAST", toast: "Copying isn't allowed in this view" }); }
  };
  return (
    <>
      <div className="ff-adm-tools">
        <Search17 value={q} onChange={setQ} placeholder="Search questions and answers" />
        <AdmChips17 value={area} onChange={setArea} options={[["all", "All", d.qa.length], ...areas.map(a => [a, a, d.qa.filter(r => r.area === a).length])]} />
        {can("export") && <button type="button" className="ff-adm-ghost" onClick={copy}><A17I.Copy size={13} /> Copy as CSV</button>}
      </div>
      <div className="ff-adm-tools"><AdmChips17 value={view} onChange={setView} options={[["answers", "Every answer"], ["questions", "By question"]]} /></div>
      {view === "questions" ? (() => {
        const g = new Map(); rows.forEach(r => { const k = `${r.area}|${r.q}`; const x = g.get(k) || { area: r.area, q: r.q, key: r.key, n: 0, a: new Map() }; x.n++; String(r.a).split(", ").forEach(v => x.a.set(v, (x.a.get(v) || 0) + 1)); g.set(k, x); });
        return (
          <div className="ff-adm-table byq" role="table" aria-label="Answers by question">
            <div className="tr th" role="row"><span role="columnheader">Question</span><span role="columnheader">Core key</span><span role="columnheader">Answers</span><span role="columnheader">Breakdown</span></div>
            {[...g.values()].map(x => (
              <div key={x.area + x.q} className="tr" role="row">
                <span role="cell" className="qq">{x.q}<small>{x.area}</small></span><span role="cell" className="ar">{x.key || "–"}</span><span role="cell">{x.n}</span>
                <span role="cell" className="aa">{[...x.a.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([v, n]) => <em key={v} className="ff-adm-pill">{v.length > 40 ? v.slice(0, 40) + "…" : v} · {n}</em>)}</span>
              </div>
            ))}
          </div>);
      })() :
      <div className="ff-adm-table" role="table" aria-label="Answers">
        <div className="tr th" role="row"><span role="columnheader">Area</span><span role="columnheader">Account</span><span role="columnheader">Question</span><span role="columnheader">Answer</span><span role="columnheader" /></div>
        {rows.map((r, i) => (
          <div key={i} className={`tr${r.hideId && H[r.hideId] ? " is-hid" : ""}`} role="row">
            <span role="cell" className="ar">{r.area}</span>
            <span role="cell" className="ac">{r.account}{r.about ? <small>to {r.about}</small> : null}</span>
            <span role="cell" className="qq">{r.q}</span>
            <span role="cell" className="aa">{r.a}</span>
            <span role="cell" className="vv">{r.hideId ? <Vis17 hidden={H[r.hideId]} can={can("hide")} onToggle={() => act({ op: H[r.hideId] ? "show" : "hide", kind: "questions", id: r.hideId, label: r.q })} /> : null}</span>
          </div>
        ))}
      </div>}
      {!rows.length && <Empty17>No answers yet.</Empty17>}
    </>
  );
}



function AdmReviews17({ d, act, can }) {
  const H = d.A.hidden.reviews;
  return (
    <div className="ff-adm-list">
      {d.reviews.map(r => (
        <div key={r.id} className={`ff-adm-row tall${H[r.id] ? " is-hid" : ""}`}>
          <span className="mn"><b>{r.about}{r.rating ? <i className="st"> {"★".repeat(Math.round(r.rating))}</i> : null}</b><small>{[r.by && `From ${r.by}`, r.status, when17(r.at)].filter(Boolean).join(" · ")}</small><p>{r.text}</p></span>
          <Vis17 hidden={H[r.id]} can={can("hide")} onToggle={() => act({ op: H[r.id] ? "show" : "hide", kind: "reviews", id: r.id, label: `Review of ${r.about}` })} />
        </div>
      ))}
      {!d.reviews.length && <Empty17>No reviews yet.</Empty17>}
    </div>
  );
}



function AdmAdmins17({ d, act, can }) {
  const [tag, setTag] = useState(""), [role, setRole] = useState("admin");
  const add = () => { if (!tag.trim()) return; act({ op: "admin_add", tag, role }); setTag(""); };
  return (
    <>
      <div className="ff-adm-list">
        {d.admins.map(x => (
          <div key={x.tag} className={`ff-adm-row${x.active ? "" : " is-hid"}`}>
            <span className="ff-adm-av"><A17I.Shield size={16} /></span>
            <span className="mn"><b>{x.name || x.tag}</b><small>@{x.tag} · since {x.since ? shortDay(x.since) : "launch"}{x.active ? "" : " · Deactivated"}</small></span>
            <select className="ff-adm-sel" value={x.role} disabled={!can("admins") || x.role === "owner"} aria-label={`Role for ${x.tag}`} onChange={(e) => act({ op: "admin_set", tag: x.tag, patch: { role: e.target.value } })}>
              {Object.entries(ADM17_ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            {x.role !== "owner" && <button type="button" className="ff-adm-ghost" disabled={!can("admins")} onClick={() => act({ op: "admin_set", tag: x.tag, patch: { active: !x.active } })}>{x.active ? "Deactivate" : "Reactivate"}</button>}
          </div>
        ))}
      </div>
      {can("admins") && (
        <div className="ff-adm-add">
          <label className="ff-adm-q"><span className="at">@</span><input value={tag} onChange={(e) => setTag(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8))} placeholder="FF Tag" aria-label="FF Tag" onKeyDown={(e) => e.key === "Enter" && add()} /></label>
          <select className="ff-adm-sel" value={role} onChange={(e) => setRole(e.target.value)} aria-label="Role">{Object.entries(ADM17_ROLES).filter(([k]) => k !== "owner").map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          <Btn variant="sm primary" onClick={add}><A17I.Plus size={13} /> Add admin</Btn>
        </div>
      )}
      <h3 className="ff-adm-h3">Gold package</h3>
      <div className="ff-adm-list">
        {d.gold.map(g => (
          <div key={g.id} className="ff-adm-row">
            <Coin size={28} tier="gold" />
            <span className="mn"><b>{g.name}</b><small>{g.kind} · admin tools while on a Gold package</small></span>
          </div>
        ))}
        {!d.gold.length && <Empty17>No one is on a Gold package.</Empty17>}
      </div>
      <h3 className="ff-adm-h3">What each role can do</h3>
      <div className="ff-adm-perm" role="table" aria-label="Permissions">
        <div className="tr th" role="row"><span role="columnheader" />{Object.values(ADM17_ROLES).map(r => <span key={r.label} role="columnheader">{r.label}</span>)}</div>
        {ADM17_PERMS.map(([k, l]) => (
          <div key={k} className="tr" role="row"><span role="cell">{l}</span>{Object.values(ADM17_ROLES).map(r => <span key={r.label} role="cell" className={r.can.includes(k) ? "y" : "n"}>{r.can.includes(k) ? "✓" : "–"}</span>)}</div>
        ))}
        <div className="tr" role="row"><span role="cell">Delete anything</span>{Object.values(ADM17_ROLES).map(r => <span key={r.label} role="cell" className="n">–</span>)}</div>
      </div>
    </>
  );
}



function AdmLogList17({ log }) {
  return (
    <div className="ff-adm-list">
      {log.map(e => (
        <div key={e.id} className="ff-adm-row">
          <span className="mn"><b>{e.action} · {e.label || e.ref}</b><small>{[e.kind, `@${e.by}`, when17(e.at)].join(" · ")}</small></span>
        </div>
      ))}
    </div>
  );
}



function AdmDatabase17({ state }) {
  const [saved, setSaved] = useState(null);
  const [busy, setBusy] = useState(false);
  const load = async () => {
    setBusy(true);
    try {
      const db = await (window.claude && window.claude.use ? window.claude.use("db") : Promise.resolve(null));
      if (!db) { setSaved({ err: "The saved database isn't reachable in this view." }); return; }
      const user = await (window.claude && window.claude.use ? window.claude.use("user") : Promise.resolve(null));
      const me = user ? await user.me() : null;
      if (!me || !me.id) { setSaved({ err: "Sign in to claude.ai to see the saved copy." }); return; }
      const snap = await db.collection("data/users/" + me.id).doc("fireflair").get();
      setSaved(snap.exists ? { data: snap.data() || {} } : { err: "Nothing has been saved yet." });
    } catch (e) { setSaved({ err: "The saved database couldn't be read." }); }
    finally { setBusy(false); }
  };
  const count = (v) => Array.isArray(v) ? `${v.length} items` : v && typeof v === "object" ? `${Object.keys(v).length} fields` : v === null || v === undefined ? "empty" : typeof v;
  const keys = [...PERSIST_KEYS, "admin17", "myTerms17", "svcTerms17", "directory"].filter((k, i, a) => a.indexOf(k) === i);
  const extra = [["companies", COMPANIES], ["packages", allPackages17()], ["questions", QUESTIONS], ["training", TRAINING_COURSES], ["dreamJobs", DREAM_JOBS], ["rewards", XP_REWARDS]];
  const Node = ({ k, v }) => (
    <details className="ff-adm-node">
      <summary><b>{k}</b><em>{count(v)}</em><A17I.ChevronDown size={14} /></summary>
      <pre>{(() => { try { const s = JSON.stringify(v, (key, x) => typeof x === "string" && x.startsWith("data:") ? `[image ${Math.round(x.length / 1024)} KB]` : x, 2) || "null"; return s.length > 30000 ? s.slice(0, 30000) + "\n…" : s; } catch (e) { return "Can't show this value."; } })()}</pre>
    </details>
  );
  return (
    <>
      <h3 className="ff-adm-h3">Live store</h3>
      <div className="ff-adm-db">{keys.map(k => <Node key={k} k={k} v={state[k]} />)}</div>
      <h3 className="ff-adm-h3">Reference data</h3>
      <div className="ff-adm-db">{extra.map(([k, v]) => <Node key={k} k={k} v={v} />)}</div>
      <h3 className="ff-adm-h3">Saved copy</h3>
      <div className="ff-adm-tools"><button type="button" className="ff-adm-ghost" onClick={load} disabled={busy}><A17I.Refresh size={13} /> {saved ? "Reload" : "Load"} saved copy</button></div>
      {saved && (saved.err ? <Empty17>{saved.err}</Empty17> : <div className="ff-adm-db">{Object.keys(saved.data).sort().map(k => <Node key={k} k={k} v={saved.data[k]} />)}</div>)}
    </>
  );
}



/* ---- The admin site --------------------------------------------------------------------------------- */
const ADM17_SECTIONS = [
  ["overview", "Overview", A17I.Dash], ["people", "People", A17I.Users], ["companies", "Companies", A17I.Brief], ["guests", "Guests", A17I.Party],
  ["invites", "Invitations", A17I.Send], ["bookings", "Bookings", A17I.Cal], ["qa", "Q&A and sign-ups", A17I.Msg], ["analytics", "Analytics", A17I.Chart],
  ["reviews", "Reviews", A17I.Star], ["cards", "Packages and cards", A17I.Layers], ["sites", "Sites", A17I.Globe], ["areas", "Areas and requests", A17I.Globe],
  ["admins", "Admins", A17I.Shield], ["log", "Activity", A17I.Hist], ["db", "Database", A17I.Db], ["doors", "Front doors", A17I.Globe], ["photos", "Photos", A17I.Layers],
];


/* ==== Photo album + front-door editor + site-first admin (v17.3.119) ====================================
   PHOTO_LIB20: every photo in photo-library/ (small thumbnails) plus the coin and logo files; photoSources20 adds the images already inside the pages.
   Remove / Restore uses the existing admin hide switch (kind "photos"); the removed list is for the developers to delete from the real library.
   Front-door content: admin17.copy["site:areaId"] overrides the title, heading, description and intro of an area page (applied in fdCopy). */
const PHOTO_LIB20 = __ff_json("content/data/photo-lib20.json");


function photoSources20() {
  const seen = {}, out = [];
  const add = (id, title, group, src) => { if (src && !seen[src]) { seen[src] = 1; out.push({ id: id, title: title, group: group, src: src }); } };
  PHOTO_LIB20.forEach((p) => add(p[0], p[1], p[2], p[3]));
  const im = window.FF_IMG || {};
  Object.keys(im).forEach((k) => add("img_" + k, k.replace(/_/g, " "), "In the pages", im[k]));
  const st = window.FF_ST18 || {};
  Object.keys(st).forEach((k) => add("st_" + k, k.replace(/^s18_/, "").replace(/-/g, " "), "Stories", st[k] && st[k].src));
  return out;
}


const PHOTO_DUPS20 = [["vkg08","vke08"],["vke13","img_face_vooshka"],["img_hero","img_hero_sm"],["st_s18_how-much-does-it-cost-to-hire-a-bartender","st_s18_repeat-bookings-event-bar-business"],["st_s18_bartender-hire-vs-mobile-bar-hire","st_s18_staffing-a-product-launch-or-drinks-reception"],["st_s18_how-to-compare-mobile-bar-companies","st_s18_add-to-event-and-bark-alternatives-bar-companies"],["st_s18_how-to-hire-a-bartender-for-a-house-party","st_s18_how-to-rebook-bartenders","st_s18_how-to-find-freelance-bartending-work-uk"],["st_s18_how-to-plan-a-wedding-bar","st_s18_how-to-write-a-mobile-bar-package","st_s18_first-event-bar-shift-checklist"],["st_s18_how-to-plan-a-cocktail-menu-for-a-party","st_s18_ff-team-vs-indeed-flex-for-bartenders"],["st_s18_how-many-cocktails-for-a-party","st_s18_christmas-party-bar-staffing"],["st_s18_cocktail-party-ice-and-glassware","st_s18_temporary-bar-staff-hertfordshire-guide"],["st_s18_dry-bar-hire-staffed-bar-full-bar-service","st_s18_how-to-get-mobile-bar-bookings","st_s18_freelance-bartending-or-agency-bar-work"],["st_s18_supply-own-alcohol-hire-bartender","st_s18_signature-cocktail-services-on-ff-party","st_s18_how-to-set-freelance-bartender-rates"],["st_s18_bartender-mixologist-flair-bartender-difference","st_s18_barback-bartender-or-bar-manager"],["st_s18_add-to-event-alternatives-party-bar-hire","st_s18_temporary-bar-staff-brief-template","st_s18_coople-alternatives-uk-bar-staff"],["st_s18_ff-party-vs-add-to-event","st_s18_indeed-flex-alternatives-for-hiring-bar-staff"],["st_s18_ff-party-vs-poptop","st_s18_ff-staff-vs-indeed-flex-bar-staffing"],["st_s18_how-to-hire-a-bartender-in-hertfordshire","st_s18_weekend-bar-work-alongside-another-job"],["st_s18_how-to-hire-a-cocktail-bartender-in-london","st_s18_what-to-check-before-accepting-a-bar-shift"],["st_s18_dj-or-live-musician-house-party","st_s18_what-to-do-when-an-event-bartender-cancels","st_s18_indeed-flex-alternatives-for-bartenders"],["st_s18_how-many-waiters-for-a-private-party","st_s18_how-to-build-a-bartender-profile"],["st_s18_bar-staffing-agency-or-freelance-platform","st_s18_how-to-accept-bookings-on-ff-team"],["st_s18_ff-staff-booking-fees-refunds-replacements","st_s18_repeat-bookings-freelance-bartender"],["p21","p22"],["p46","p47"]];


function PhotoAlbum20(props) {
  const h = React.createElement;
  const { state, dispatch } = useStore();
  const all = useMemo(photoSources20, []);
  const [g, setG] = useState("All");
  const [edit, setEdit] = useState(null), [draft, setDraft] = useState("");
  const names = adm17(state).names || {};
  const label = (p) => names[p.id] || p.title;
  const gone = (p) => hid17(state, "photos", p.id);
  const byId = {}; all.forEach((p) => { byId[p.id] = p; });
  const groups = PHOTO_DUPS20.map((x) => x.filter((i) => byId[i])).filter((x) => x.length > 1);
  const dupIds = []; groups.forEach((x, gi) => x.forEach((i) => dupIds.push([i, gi])));
  const gOf = {}; dupIds.forEach((d) => { gOf[d[0]] = d[1] + 1; });
  const chips = ["All"].concat(Array.from(new Set(all.map((p) => p.group))));
  const nGone = all.filter(gone).length;
  const shown = g === "Removed" ? all.filter(gone)
    : g === "Duplicates" ? dupIds.map((d) => byId[d[0]])
    : all.filter((p) => !gone(p) && (g === "All" || p.group === g));
  const act = (p) => dispatch({ type: "ADMIN17", op: gone(p) ? "show" : "hide", kind: "photos", id: p.id, label: label(p) });
  const save = (p) => { const v = draft.trim(); dispatch({ type: "ADMIN17", op: "rename", id: p.id, name: v === p.title ? "" : v }); setEdit(null); };
  const copy = () => { try { navigator.clipboard.writeText(all.filter(gone).map((p) => p.id + "\t" + label(p)).join("\n")); dispatch({ type: "TOAST", toast: "Removed list copied" }); } catch (e) { /* ignore */ } };
  const rank = (id) => (/^(img_|st_)/.test(id) ? 1 : 0);
  const dedupe = () => { groups.forEach((x) => { const keep = x.slice().sort((a, b) => rank(a) - rank(b))[0]; x.forEach((i) => { if (i !== keep && !gone(byId[i])) dispatch({ type: "ADMIN17", op: "hide", kind: "photos", id: i, label: label(byId[i]) }); }); }); dispatch({ type: "TOAST", toast: "Extra copies removed" }); };
  const css = ".ff-pa20-chips{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 12px}.ff-pa20-chips button{padding:6px 12px;border-radius:14px;border:1px solid var(--gold-dk);background:transparent;font-size:12.5px;cursor:pointer}.ff-pa20-chips button.on{background:var(--gold-dk);color:#fff}"
    + ".ff-pa20-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(104px,1fr));gap:10px}.ff-pa20-t{display:flex;flex-direction:column;gap:4px;font-size:12px}.ff-pa20-t img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:16px;background:#e9e1cf}.ff-pa20-t.gone img{opacity:.35}.ff-pa20-t span{line-height:1.25;overflow-wrap:anywhere}.ff-pa20-t em{font-style:normal;color:var(--gold-dk);font-weight:600}.ff-pa20-t input{width:100%;padding:5px 8px;border-radius:12px;border:1px solid var(--gold-dk);font:inherit}.ff-pa20-row{display:flex;gap:4px}.ff-pa20-row button{flex:1;padding:5px 6px;border-radius:12px;border:1px solid var(--gold-dk);background:transparent;font-size:12px;cursor:pointer}";
  return h("div", { className: "ff-pa20" },
    h("style", null, css),
    h("div", { className: "ff-pa20-chips" },
      chips.map((x) => h("button", { key: x, type: "button", className: g === x ? "on" : "", onClick: () => setG(x) }, x)),
      groups.length ? h("button", { type: "button", className: g === "Duplicates" ? "on" : "", onClick: () => setG("Duplicates") }, "Duplicates (" + groups.length + ")") : null,
      nGone ? h("button", { type: "button", className: g === "Removed" ? "on" : "", onClick: () => setG("Removed") }, "Removed (" + nGone + ")") : null,
      nGone ? h("button", { type: "button", onClick: copy }, "Copy removed list") : null,
      g === "Duplicates" ? h("button", { type: "button", onClick: dedupe }, "Remove extra copies") : null),
    h("div", { className: "ff-pa20-grid" }, shown.map((p) => h("div", { key: p.id, className: "ff-pa20-t" + (gone(p) ? " gone" : "") },
      h("img", { src: p.src, alt: label(p), loading: "lazy", decoding: "async" }),
      edit === p.id
        ? h("input", { value: draft, autoFocus: FF_FINE_POINTER && (true), "aria-label": "Photo name", onChange: (e) => setDraft(e.target.value), onKeyDown: (e) => { if (e.key === "Enter") save(p); if (e.key === "Escape") setEdit(null); } })
        : h("span", null, label(p)),
      g === "Duplicates" && gOf[p.id] ? h("em", null, "Match " + gOf[p.id]) : null,
      h("div", { className: "ff-pa20-row" },
        edit === p.id ? h("button", { type: "button", onClick: () => save(p) }, "Save") : h("button", { type: "button", onClick: () => { setEdit(p.id); setDraft(label(p)); } }, "Rename"),
        h("button", { type: "button", onClick: () => act(p) }, gone(p) ? "Restore" : "Remove"))))));
}


function PhotoAlbumFold20() {
  return React.createElement(Fold17, { id: "album20", icon: A17I.Layers, title: "Photo album", shut: true }, React.createElement(PhotoAlbum20, null));
}


function AdmDoors20(props) {
  const h = React.createElement;
  const siteKey = props.site === "all" ? "team" : props.site;
  const { state, dispatch } = useStore();
  const [q, setQ] = useState(""), [pick, setPick] = useState("country:GB");
  const ov = (adm17(state).copy || {});
  const list = FD_NODES.filter((n) => q.trim() ? fdLabel(n).toLowerCase().indexOf(q.trim().toLowerCase()) >= 0 : (fdAnc(n).length <= 2 || n.id === FD_LONDON)).slice(0, 40);
  const node = FD_BY_ID[pick] || FD_NODES[0];
  const key = siteKey + ":" + node.id;
  const base = fdCopyBase20(siteKey, node, { mode: "operational", sourcing: false, nExact: 0, hasUnclaimed: false });
  const cur = ov[key] || {};
  const [f, setF] = useState({});
  useEffect(() => { setF({}); }, [key]);
  const val = (k) => (f[k] !== undefined ? f[k] : cur[k] !== undefined ? cur[k] : (k === "intro" ? (base.intro || []).join("\n\n") : base[k] || ""));
  const set = (k, v) => setF({ ...f, [k]: v });
  const save = () => { const p = {}; ["title", "h1", "desc", "intro"].forEach((k) => { p[k] = val(k); }); props.act({ op: "copy", key: key, patch: p, label: fdLabel(node) + " (" + siteKey + ")" }); dispatch({ type: "TOAST", toast: "Front door saved" }); };
  const reset = () => { props.act({ op: "copy", key: key, clear: true, label: fdLabel(node) + " (" + siteKey + ")" }); setF({}); };
  const open = () => { dispatch({ type: "V11_SET", patch: { adminOpen17: false, fdPreview: true } }); fdNav(dispatch, siteKey, node.path); };
  const field = (k, label, multi) => h("label", { key: k, className: "ff-adm20-f" }, h("span", null, label),
    multi ? h("textarea", { rows: 7, value: val(k), onChange: (e) => set(k, e.target.value) }) : h("input", { value: val(k), onChange: (e) => set(k, e.target.value) }));
  const css = ".ff-adm20-f{display:flex;flex-direction:column;gap:4px;margin-bottom:10px;font-size:13px}.ff-adm20-f input,.ff-adm20-f textarea{padding:9px 12px;border-radius:14px;border:1px solid var(--line,#d9cfb8);font:inherit;background:#fff}.ff-adm20-pick{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0}.ff-adm20-pick button{padding:6px 12px;border-radius:14px;border:1px solid var(--gold-dk);background:transparent;font-size:12.5px;cursor:pointer}.ff-adm20-pick button.on{background:var(--gold-dk);color:#fff}";
  return h("div", null, h("style", null, css),
    h(Search17, { value: q, onChange: setQ, placeholder: "Search for an area page" }),
    h("div", { className: "ff-adm20-pick" }, list.map((n) => h("button", { key: n.id, type: "button", className: n.id === node.id ? "on" : "", onClick: () => setPick(n.id) }, fdLabel(n) + (ov[siteKey + ":" + n.id] ? " •" : "")))),
    h("h3", { className: "ff-label" }, fdLabel(node) + " · " + SITE_NAME17[siteKey]),
    field("title", "Browser title"), field("h1", "Heading"), field("desc", "Description"), field("intro", "Introduction (blank line between paragraphs)", true),
    h("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } },
      h(Btn, { variant: "primary", onClick: save }, "Save"), h(Btn, { onClick: reset }, "Reset to default"), h(Btn, { onClick: open }, "Open page")));
}


const ADM_TOOLS20 = {
  team: ["people", "doors", "reviews", "qa", "invites", "photos"],
  staff: ["companies", "bookings", "doors", "cards", "photos"],
  party: ["guests", "bookings", "doors", "cards", "photos"],
  all: ["overview", "photos", "areas", "sites", "analytics", "admins", "log", "db"],
};


function AdmSiteRow20(props) {
  const h = React.createElement;
  const css = ".ff-adm20-sites{display:flex;flex-wrap:wrap;gap:6px;flex:none;margin:0 8px 8px 0}.ff-adm20-sites button{flex:1 1 auto;padding:10px 14px;border-radius:16px;border:1px solid var(--gold-dk);background:transparent;font-weight:700;font-size:13.5px;cursor:pointer;white-space:nowrap}.ff-adm20-sites button.on{background:var(--gold-dk);color:#fff}";
  return h("div", { className: "ff-adm20-sites", role: "group", "aria-label": "Site" }, h("style", null, css),
    [["team", "FF Team"], ["staff", "FF Staff"], ["party", "FF Party"], ["all", "All sites"]].map((x) => h("button", { key: x[0], type: "button", className: props.site === x[0] ? "on" : "", "aria-pressed": props.site === x[0], onClick: () => props.setSite(x[0]) }, x[1])));
}


function fdCopy(siteKey, node, ctx) {
  const r = fdCopyBase20(siteKey, node, ctx), o = ctx && ctx.ov;
  if (!o) return r;
  const out = { ...r };
  ["title", "h1", "desc"].forEach((k) => { if (o[k]) out[k] = o[k]; });
  if (o.intro) out.intro = String(o.intro).split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  return out;
}


function Admin17() {
  const { state, dispatch } = useStore();
  const [sec, setSec] = useState(() => state.adminSec17 || "overview");
  const go = (k) => { setSec(k); dispatch({ type: "V11_SET", patch: { adminSec17: k } }); window.scrollTo(0, 0); };
  const A = adm17(state);
  const act = (x) => dispatch({ type: "ADMIN17", ...x });
  const myTag = String(state.auth.tag || "").toUpperCase();
  const mine = A.admins.find(x => x.tag === myTag && x.active);
  const role = A.viewAs || (mine ? mine.role : "owner");
  const can = (perm) => ((ADM17_ROLES[role] || ADM17_ROLES.gold).can).includes(perm);
  const d = useMemo(() => {
    const people = peopleAll17(state);
    const companies = companiesAll17(state);
    const tierP = (p) => A.tier.people[p.id] || p.tier, tierC = (c) => A.tier.companies[c.id] || c.tier;
    return {
      A, people, companies, guests: guestsAll17(state), packages: allPackages17(), cards: cardsAll17(state),
      events: (state.events || []).filter(e => e.iso || e.venue || e.title || (state.shifts || []).some(x => x.eventId === e.id)),
      engagements: state.engagements || [], reviews: reviewsAll17(state, people), qa: qaRows17(state, people), admins: A.admins,
      gold: [...people.filter(p => tierP(p) === "gold").map(p => ({ id: p.id, name: p.name, kind: "FF Team" })), ...companies.filter(c => tierC(c) === "gold").map(c => ({ id: c.id, name: c.name, kind: "FF Staff" }))],
    };
  }, [state]);
  const counts = { areas: fdOf(state).requests.filter(r => r.status === "new").length || null, people: d.people.length, companies: d.companies.length, guests: d.guests.length, invites: A.invites.length, bookings: d.engagements.length, cards: d.packages.length + d.cards.length, qa: d.qa.length, reviews: d.reviews.length, admins: d.admins.length, log: A.log.length };
  const NEEDS = { qa: "data", db: "data", log: "data", analytics: "data", invites: "hide", bookings: "data" };
  const [site, setSite0] = useState(() => state.adminSite20 || "all");
  const setSite = (k) => { setSite0(k); setSec(ADM_TOOLS20[k][0]); dispatch({ type: "V11_SET", patch: { adminSite20: k, adminSec17: ADM_TOOLS20[k][0] } }); window.scrollTo(0, 0); };
  const secs = (ADM_TOOLS20[site] || ADM_TOOLS20.all).map((k) => ADM17_SECTIONS.find((x) => x[0] === k)).filter(Boolean).filter(([k]) => !NEEDS[k] || can(NEEDS[k]));
  const cur = secs.find(x => x[0] === sec) || secs[0];
  const sk = cur[0];
  const P = { d, act, can, state, dispatch, go };
  return (
    <div className="ff-adm">
      <header className="ff-adm-top">
        <div className="l">
          <span className="ff-adm-mark"><Coin size={34} tier="gold" /></span>
          <span><b>FF Admin</b><small>{ADMIN_ADAPTER.connected ? "All accounts" : "This preview's data"}</small></span>
        </div>
        <div className="r">
          <span className="ff-dev17 tag">DEV · admin preview</span>
          <label className="ff-adm-as"><span>@{myTag || "DEV"} as</span>
            <select value={role} onChange={(e) => act({ op: "viewAs", value: e.target.value })} aria-label="Role">{Object.entries(ADM17_ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
          </label>
          <button type="button" className="ff-adm-x" aria-label="Close FF Admin" onClick={() => dispatch({ type: "V11_SET", patch: { adminOpen17: false } })}><A17I.X size={18} /></button>
        </div>
      </header>
      <div className="ff-adm-body">
        <nav className="ff-adm-nav" aria-label="FF Admin">
          <AdmSiteRow20 site={site} setSite={setSite} />
          {secs.map(([k, l, Ic]) => (
            <button key={k} type="button" className={sk === k ? "on" : ""} aria-current={sk === k ? "page" : undefined} onClick={() => go(k)}>
              <Ic size={15} /><span>{l}</span>{counts[k] != null && <em>{counts[k]}</em>}
            </button>
          ))}
        </nav>
        <main className="ff-adm-main">
          <h2 className="ff-adm-h2">{cur[1]}</h2>
          {sk === "overview" && <AdmOverview17 {...P} />}
          {sk === "doors" && <AdmDoors20 site={site} {...P} />}
          {sk === "photos" && <PhotoAlbum20 />}
          {sk === "sites" && <AdmSites17 {...P} />}
          {sk === "areas" && <AdmAreas11 {...P} />}
          {sk === "people" && <AdmPeople17 {...P} />}
          {sk === "companies" && <AdmCompanies17 {...P} />}
          {sk === "cards" && <AdmCards17 {...P} />}
          {sk === "guests" && <AdmGuests17 {...P} />}
          {sk === "invites" && <AdmInvites17 {...P} />}
          {sk === "bookings" && <AdmBookings17 {...P} />}
          {sk === "analytics" && <AdmAnalytics17 {...P} />}
          {sk === "qa" && <AdmQA17 {...P} />}
          {sk === "reviews" && <AdmReviews17 {...P} />}
          {sk === "admins" && <AdmAdmins17 {...P} />}
          {sk === "log" && (A.log.length ? <AdmLogList17 log={A.log} /> : <Empty17>No admin changes yet.</Empty17>)}
          {sk === "db" && <AdmDatabase17 {...P} />}
        </main>
      </div>
    </div>
  );
}
