/* src/components/home/site-pillar-visuals.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   v17.10: the visuals for the FF Party and FF Staff home pillars (copy: party-pillars.json, staff-pillars.json). They sit in the right-hand column of a pillar
   section, exactly like the FF Team visuals in team-pillars.jsx, and are built from the prototype's own cards and components in a compact form.
   Anything live on the old pillars stays live: packages open their pop-up, profile tiles open the profile, company cards open the company page. */

  const SV21_PKG_SLUG = { svc_masterclass: "masterclass", svc_flair: "flair", svc_mixology: "mixology", svc_bartending: "bartending", svc_staffing: "staffing" };

  /* A ticked box that leads nowhere (an example, like the FF Team ticks). */
  function SvTicks21({ items }) {
    const [on, tog] = useTog21();
    return (
      <ul className="pv-ticks one">
        {items.map((t) => <li key={t}><button type="button" className={on[t] ? "on" : ""} aria-pressed={!!on[t]} onClick={() => tog(t)}><span className="bx" aria-hidden="true">{on[t] ? <P21I.Check size={13} strokeWidth={3} /> : null}</span>{t}</button></li>)}
      </ul>
    );
  }

  /* Numbered rows (booking steps). */
  function SvSteps21({ steps, last }) {
    return (
      <ol className="pv-steps">
        {steps.map(([t, d], i) => (
          <li key={t} className={last && i === steps.length - 1 ? "ok" : ""}><span className="n" aria-hidden="true">{i + 1}</span><span className="tx"><b>{t}</b>{d ? <small>{d}</small> : null}</span></li>
        ))}
      </ol>
    );
  }

  /* A card face from the card family, at the width of the right-hand column. */
  function SvFace21({ children, w = 210 }) {
    return <div className="pv-face"><div className="ff-cj-card" style={{ width: w }} aria-hidden="true">{children}</div></div>;
  }

  /* Profile Cards of the live FF Team examples (SIMAO first). */
  function SvPeople21({ n = 3, fav }) {
    const list = [P21_CARD].concat(P21_TEAM).slice(0, n);
    const [on, tog] = useTog21();
    return (
      <div className="pv pv-people">
        <InertBox className="pv-row3">{list.map((p) => <div key={p.id} className="pv-c3"><PlayerCard person={p} />{fav ? null : null}</div>)}</InertBox>
        {fav ? (
          <div className="pv-favs">{list.map((p) => <button key={p.id} type="button" className={on[p.id] ? "on" : ""} aria-pressed={!!on[p.id]} onClick={() => tog(p.id)}>Favourite</button>)}</div>
        ) : null}
      </div>
    );
  }

  /* Directory profiles that open when pressed (featured people and staff). */
  function SvFeatured21({ ids }) {
    const nav = useHireNav();
    const list = ids.map(dirFind).filter(Boolean);
    return (
      <div className="pv pv-pk pv-ft">
        <div className="pv-scroll">{list.map((p) => <div key={p.id} className="pv-tile"><PlayerCard person={p} format="portrait" themeKey={p.theme || "paper"} onClick={() => nav.view(p.id)} /></div>)}</div>
      </div>
    );
  }

  function SvPackages21() {
    const st = useStore();
    const hire = useHireNav();
    const [open, setOpen] = useState(null);
    const all = pkgServices17({ all: true, short: true });
    const order = ["svc_masterclass", "svc_flair", "svc_mixology", "svc_bartending", "svc_staffing"];
    const list = order.map((id) => all.find((x) => x.id === id)).filter(Boolean);
    const cur = open ? pkg18(open) : null;
    return (
      <div className="pv pv-pk pv-pkc">
        <div className="pv-scroll">
          {list.map((sv) => (
            <div key={sv.id} className="pv-tile">
              <button type="button" className={`ff-tp17 ${sv.tone}`} onClick={() => setOpen(SV21_PKG_SLUG[sv.id])}>
                <span className="lv">{sv.level}</span>
                <b className="tt">{sv.title}</b>
                <span className="in">{sv.includes}</span>
                <span className="tm"><S17I.Clock size={12} /> {TIME17[sv.id] || sv.time}</span>
                <em className="go">See package</em>
              </button>
            </div>
          ))}
        </div>
        {cur ? (
          <Sheet open={true} onClose={() => setOpen(null)} title={cur.sv.title} center>
            <PkgFull18 m={cur} st={st} hire={hire} onClose={() => setOpen(null)} />
          </Sheet>
        ) : null}
      </div>
    );
  }

  function SvGuarantee21() {
    return (
      <div className="pv pv-gr">
        <div className="gb"><Coin size={64} tier="gold" /><b>The FireFlair Booking Guarantee</b><span>Confirmed, or refunded in full.</span></div>
        <SvSteps21 last steps={[["Choose your package"], ["Choose your people"], ["Choose your add‑ons"], ["Your booking is secured"]]} />
      </div>
    );
  }

  function SvReview21({ kind }) {
    const to = dirFind("dir_sam");
    const from = kind === "party" ? { id: "smp_host", name: "Sophie Turner", profession: "Birthday party host", photo: FACE.you, tier: "standard" } : { id: "co_vooshka", name: "Vooshka Cocktail Bar", profession: "Luxury mobile cocktail bar", photo: null, tier: "gold", isCompany: true };
    if (!to) return null;
    return (
      <div className="pv pv-rvp">
        <InertBox className="pv-rvc"><ReviewCard11 from={from} to={to} how="Excellent" status={`Accepted · on ${to.name.split(" ")[0]}'s profile`} text={kind === "party" ? "Made our garden party. Amazing cocktails and the guests loved him." : "Ran the bar at our launch night without a single hiccup. Fast, clean and great with the guests."} /></InertBox>
      </div>
    );
  }

  function SvCompanies21() {
    const { state, dispatch } = useStore();
    const list = companyList(state).filter((c) => !c.mine && !c.unclaimed).sort((a, b) => (/vooshka/i.test(b.name) ? 1 : 0) - (/vooshka/i.test(a.name) ? 1 : 0)).slice(0, 6);
    return (
      <div className="pv pv-pk pv-co">
        <div className="pv-scroll">
          {list.map((co) => (
            <button key={co.id} type="button" className="pv-tile pv-cob ff-co11-tile" aria-label={`${co.name}: open their page`} onClick={() => { dispatch({ type: "VIEW_COMPANY", id: co.id }); window.scrollTo(0, 0); }}>
              <CompanyCardFace c={co} size="sm" />
              {(co.team || []).length ? <span className="tm">{(co.team || []).slice(0, 4).map((id) => { const p = dirFind(id); return p ? <Portrait key={id} src={p.photo} name={p.name} size={26} tier={p.tier} /> : null; })}<small>{(co.team || []).length} on the team</small></span> : null}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function SvOccasions21() {
    return (
      <div className="pv pv-occ">
        {PARTY_OCCASIONS.map((o) => (
          <button key={o} type="button" className="ff-locked17" aria-disabled="true" aria-label={o + ". " + LOCKED_LABEL17} title={LOCKED_LABEL17} onClick={(e) => e.preventDefault()}>{o}</button>
        ))}
      </div>
    );
  }

  function SvEvent21({ title, when, where, photo }) {
    return <div className="pv pv-ev1"><SvFace21 w={230}><CfEvent11 photo={CfImg11(photo)} title={title} when={when} where={where} /></SvFace21></div>;
  }

  function SvAgain21() {
    const [on, setOn] = useState(false);
    return (
      <div className="pv pv-again">
        <SvFace21 w={230}><CfEvent11 photo={CfImg11("dream_food_festivals_markets")} title="Birthday cocktail party" when="Sat 20 Mar" where="Islington, London" /></SvFace21>
        <div className="pv-3b one"><button type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => setOn(!on)}>Book again</button></div>
      </div>
    );
  }

  function SvTeams21() {
    const crew = ["dir_sam", "dir_maya", "dir_kofi", "dir_elena"].map(dirFind).filter(Boolean);
    const trio = ["dir_sam", "dir_ines", "dir_theo"].map(dirFind).filter(Boolean);
    return (
      <div className="pv pv-tms">
        <div className="pv-tc"><TeamCard name="Vooshka Cocktail Bar" skills={["Cocktails", "Fast service"]} interests={["Weddings", "Brand nights"]} url={`${CARD_DOMAIN}/vooshka`} members={crew} more={6} /></div>
        <InertBox className="pv-row3">{trio.map((p) => <div key={p.id} className="pv-c3"><PlayerCard person={p} /></div>)}</InertBox>
      </div>
    );
  }

  function SvModern21() {
    return (
      <div className="pv pv-mod">
        <div className="st"><b>Your event</b><span>The start time and location. That's it.</span></div>
        <span className="pv-ar dn" aria-hidden="true"><P21I.ChevronDown size={26} strokeWidth={2.2} /></span>
        <div className="st big"><SiteMark site={site("staff")} size={44} /><b>FF Staff</b>
          <ul>{["Profiles with skills, experience and reviews", "Shift details for every person you book", "Requests and replies on WhatsApp", "Your own team, ready to rebook"].map((x) => <li key={x}>{x}</li>)}</ul></div>
        <span className="pv-ar dn" aria-hidden="true"><P21I.ChevronDown size={26} strokeWidth={2.2} /></span>
        <div className="st"><b>Your team, booked</b><span>Confirmed on WhatsApp</span></div>
      </div>
    );
  }

  function SvFollow21() {
    const sv = (typeof PARTY_SERVICES !== "undefined" && PARTY_SERVICES[1]) || null;
    const faces = [
      <CfEvent11 photo={CfImg11("dream_food_festivals_markets")} title="Summer Festival Bar" when="Sat 12 Jun" where="Victoria Park" />,
      <CfProfile11 photo={CfImg11("simao_face")} name="SIMAO" role="Mixologist" tier="gold" />,
      <CfConfirm17 />,
      <CfReview11 text="Ran the bar at our launch night without a single hiccup." from="Ava" to="Sophie" />
    ];
    return (
      <div className="pv pv-pk pv-fl">
        <div className="pv-scroll">{faces.map((f, i) => <div key={i} className="pv-tile pv-flc"><span className="n" aria-hidden="true">{i + 1}</span><div className="ff-cj-card" aria-hidden="true">{f}</div></div>)}</div>
      </div>
    );
  }

  function SvPartyFlow21() {
    const co = (COMPANY_PAGES && COMPANY_PAGES.co_vooshka) || null;
    return (
      <div className="pv pv-mod">
        <div className="st"><b>Hosts</b><span>Book bar companies for their events</span></div>
        <span className="pv-ar dn" aria-hidden="true"><P21I.ChevronDown size={26} strokeWidth={2.2} /></span>
        <div className="st big"><SiteMark site={site("party")} size={54} /><b>FF Party</b></div>
        <span className="pv-ar dn" aria-hidden="true"><P21I.ChevronDown size={26} strokeWidth={2.2} /></span>
        {co ? <InertBox className="pv-coface"><CompanyCardFace c={co} size="sm" /></InertBox> : <div className="st"><b>Your company</b></div>}
      </div>
    );
  }

  function SvServices21({ dir }) {
    const jon = { id: "you", name: "Your name", tag: "you", tier: "standard", photo: null, profession: "Photographer", group: "Photographers" }; /* v17.12: an example service card, made by "you" */
    const ex = OWN_SERVICE_EXAMPLES.find((x) => x.id === "own_photo");
    return <div className="pv pv-own" aria-hidden="true"><InertBox className="pv-sq">{jon && ex ? <OwnServiceCard item={{ ...ex, person: jon }} /> : null}</InertBox></div>;
  }

  function SvCompanyCard21() {
    const [layout, setLayout] = useState("classic");
    const sample = { ...COMPANY_PAGES.co_vooshka, layout };
    return (
      <div className="pv pv-cc">
        <InertBox className="pv-coface"><CompanyCardFace c={sample} size="sm" /></InertBox>
        <div className="ff-cc11-layouts mini" role="group" aria-label="Example layouts">
          {CC_LAYOUTS.map((l) => (
            <button key={l.key} type="button" aria-pressed={layout === l.key} onClick={() => setLayout(l.key)}>
              <span className={`thumb t-${l.key}`} aria-hidden="true"><i className="lg" /><i className="a" /><i className="b" /><i className="c" /></span>{l.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function SiteVisual21({ k, dir }) {
    switch (k) {
      case "party-pkgs": return <SvPackages21 />;
      case "party-guarantee": return <SvGuarantee21 />;
      case "party-people": return <SvPeople21 />;
      case "party-featured": return <SvFeatured21 ids={["stf_alex", "stf_gav", "stf_bruno", "stf_simao", "stf_dany", "stf_james"]} />;
      case "party-review": return <SvReview21 kind="party" />;
      case "party-companies": return <SvCompanies21 />;
      case "party-event": return <SvEvent21 title="Birthday cocktail party" when="Sat 20 Mar" where="Islington, London" photo="dream_after_dark" />;
      case "party-occasions": return <SvOccasions21 />;
      case "party-steps": return <div className="pv"><SvSteps21 last steps={[["Choose your package"], ["Choose your people"], ["Choose your add‑ons"], ["Your booking is secured"]]} /></div>;
      case "party-prefs": return <div className="pv"><SvTicks21 items={["Your preferences", "Your favourites", "Your bookings", "Shared with your staff"]} /></div>;
      case "party-favourites": return <SvPeople21 fav />;
      case "party-again": return <SvAgain21 />;
      case "staff-featured": return <SvFeatured21 ids={["stf_alex", "stf_gav", "stf_bruno", "stf_simao", "stf_dany", "stf_james"]} />;
      case "staff-teams": return <SvTeams21 />;
      case "staff-review": return <SvReview21 kind="staff" />;
      case "staff-event": return <SvEvent21 title="Summer Festival Bar" when="Sat 12 Jun" where="Victoria Park" photo="dream_after_dark" />;
      case "staff-steps": return <div className="pv"><SvSteps21 steps={[["Event Card", "Date, time and place"], ["Shift details", "Role, hours and pay"], ["Staff", "Choose who you want"], ["Review", "Send and confirm"]]} /></div>;
      case "staff-modern": return <SvModern21 />;
      case "staff-follow": return <SvFollow21 />;
      case "staff-party": return <SvPartyFlow21 />;
      case "staff-services": return <SvServices21 dir={dir} />;
      case "staff-company": return <SvCompanyCard21 />;
      case "staff-profile": return <div className="pv"><SvTicks21 items={["Terms and conditions", "Documents", "Q&A", "Media", "Areas covered", "Your team"]} /></div>;
      case "staff-find": return <SvPeople21 />;
      default: return null;
    }
  }
