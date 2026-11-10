/* src/components/staff/company-profile.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---------------------------------------------------------------------------
   COMPANY CARD — the business equivalent of the Profile Card. Landscape, full
   business name, a custom ffparty.uk URL, and the reusable source of T&Cs,
   documents and hiring questions for every Event Card.
   --------------------------------------------------------------------------- */
const slugify = (v) => String(v || "").toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);




/* FireFlair for the Company Card. HONEST STATUS: no language model is wired up;
   a simple local reader proposes fields from free text and the location
   lookup proposes service locations. Nothing is saved until approved. */
function companyFromText(text) {
  const lines = String(text || "").split(/\n|\.\s/).map(x => x.trim()).filter(Boolean);
  const name = lines[0] ? lines[0].replace(/^(we are|we're|i run|i own)\s+/i, "").split(/,| - | — /)[0].trim() : "";
  const known = Object.keys(LOCATION_NEIGHBOURS).find(k => text.toLowerCase().includes(k));
  const email = (text.match(/[\w.+-]+@[\w-]+\.[\w.]+/) || [""])[0];
  const phone = (text.match(/(\+?\d[\d\s]{8,}\d)/) || [""])[0];
  const kindMatch = text.match(/(cocktail bar|event (?:company|agency)|catering|bar hire|mobile bar|wedding|private events)[^.,\n]*/i);
  return {
    name, kind: kindMatch ? kindMatch[0].trim().replace(/^\w/, c => c.toUpperCase()) : "",
    location: known ? known.replace(/\b\w/g, c => c.toUpperCase()) : "", email, phone: phone.trim(),
    description: lines.slice(1).join(". ").replace(email, "").replace(phone, "").replace(/\s{2,}/g, " ").replace(/^[\s.,]+|[\s.,]+$/g, ""),
  };
}



/* ==========================================================================
   FF STAFF — COMPANY PROFILE (v16.12)
   Built like the FF Team Profile page and on the same card system:
   1 Join FF Staff (company name + phone, instead of an FF Tag),
   2 the Company Card (typed straight onto the card),
   3 FireFlair, 4 the company profile as card sections,
   then Save & Share and Section 5. Everything happens on this page; there is
   no separate "create your Company Card" screen any more.
   Company information is stored as the same records as an FF Team profile
   (company.records), edited with the same card editor (owner "company").
   ========================================================================== */
const COMPANY_CATEGORIES = {
  services: { label: "Services", singular: "Service", icon: "skills", fields: ["description", "media"], placeholder: "Mobile cocktail bar" },
  locations: { label: "Areas covered", singular: "Area", icon: "location", fields: ["description"], placeholder: "North London" },
  cocktails: { ...BASE_CATEGORIES.cocktails },
  venues: { ...BASE_CATEGORIES.venues },
  documents: { label: "Documents", singular: "Document", icon: "qualification", fields: ["description", "document"], placeholder: "Staff onboarding pack" },
  contact: { label: "Contact & social", singular: "Contact", icon: "languages", fields: ["description"], placeholder: "bookings@yourcompany.co.uk" },
};


const companyDocs = (c) => [...((c && c.documents) || []), ...recsOf(c || {}, "documents").filter(r => !r.hidden && !r.proposed)];


const companyLocations = (c) => [...new Set([...((c && c.serviceLocations) || []), ...recsOf(c || {}, "locations").filter(r => !r.hidden && !r.proposed).map(r => r.name)])];





/* SECTION 3 — FireFlair proposes the card and profile from a description.
   HONEST STATUS: a simple local reader stands in for FireFlair. */
function CompanyFFAI() {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const [proposal, setProposal] = useState(null);
  const approve = () => {
    const p = proposal;
    dispatch({ type: "COMPANY_SAVE", company: {
      ...(c.name ? {} : p.name ? { name: p.name } : {}),
      ...(p.kind ? { kind: p.kind } : {}), ...(p.location ? { location: p.location } : {}),
      ...(p.description ? { description: p.description } : {}),
    } });
    const have = recsOf(c, "contact").map(r => r.name.toLowerCase());
    [[p.email, "Email"], [p.phone, "Phone"]].filter(([v]) => v && !have.includes(v.toLowerCase()))
      .forEach(([v, kind]) => dispatch({ type: "REC_ADD", owner: "company", category: "contact", record: makeRecord("contact", v, { description: kind }) }));
    if (p.location && !companyLocations(c).some(l => l.toLowerCase() === p.location.toLowerCase())) {
      dispatch({ type: "REC_ADD", owner: "company", category: "locations", record: makeRecord("locations", p.location) });
    }
    dispatch({ type: "TOAST", toast: "Added to your Company Card and profile" });
    setProposal(null);
  };
  return (
    <FFAI title="Describe your business" context="FF Staff" multiline submitLabel="Propose my profile"
      purpose="Describe your business."
      placeholder="Your company, a cocktail bar in London"
      onSubmit={(v) => setProposal(companyFromText(v))}>
      {proposal && (
        <div className="ff-info" style={{ marginTop: 10 }}>
          <div className="ff-label" style={{ marginBottom: 6 }}>Proposed</div>
          {Object.entries(proposal).filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="ff-body" style={{ fontSize: 13 }}><b style={{ textTransform: "capitalize" }}>{k}:</b> {v}</div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <Btn variant="sm primary" onClick={approve}><Check size={12} /> Approve</Btn>
            <Btn variant="sm ghost" onClick={() => setProposal(null)}>Discard</Btn>
          </div>
        </div>
      )}
    </FFAI>
  );
}







/* SAVE & SHARE for the company, between Section 4 and Section 5. */
function CompanySaveShare({ onSaved }) {
  const { state, dispatch } = useStore();
  const c = state.company || {};
  const joined = !!(c.name && c.joinedAt);
  const save = () => {
    if (!joined) { scrollToSection("ff-co-join"); dispatch({ type: "TOAST", toast: "Add your company name and phone first" }); return; }
    const now = Date.now();
    dispatch({ type: "COMPANY_SAVE", company: { saved: true, savedAt: now, finishedAt: c.finishedAt || now } });
    dispatch({ type: "TOAST", toast: "Saved" });
    if (onSaved) onSaved();
  };
  const share = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`${c.name || "My company"} on FireFlair: ${CARD_DOMAIN}/${c.slug}`)}`, "_blank", "noopener,noreferrer");
    dispatch({ type: "TOAST", toast: "Your company link is ready to send on WhatsApp" });
  };
  useEffect(() => { const h = () => save(); window.addEventListener("ff-save", h); return () => window.removeEventListener("ff-save", h); });
  return (
    <div id="ff-co-share" className="ff-publishcard" style={{ marginTop: 26 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <Coin size={30} tier="gold" />
        <span className="ff-h2" style={{ fontSize: 19, color: "var(--gold-lt)", flex: 1 }}>Save &amp; Share</span>
      </div>
      <div className="ff-sharerow">
        <button className="ff-publish-btn" onClick={save}><Check size={17} /> Save</button>
        <button className="ff-wa-btn" disabled={!joined} onClick={share}><WhatsAppIcon size={20} /> Share</button>
      </div>
      {c.savedAt && <p style={{ margin: "10px 0 0", fontSize: 12, color: "rgba(244,239,228,.66)", display: "flex", gap: 5, alignItems: "center", justifyContent: "center" }}>
        <Check size={13} color="#8FDCAE" strokeWidth={2.4} /> Saved {timeOf(c.savedAt)}</p>}
    </div>
  );
}


function CompanyWelcome() {
  const { state, dispatch } = useStore();
  const site = hireSiteOf(state);
  const c = state.company || {};
  const toEvent = () => {
    dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } });
    dispatch({ type: "TAB", tab: "bookings", route: "staffHome" });
    window.scrollTo(0, 0);
  };
  return React.createElement("div", {
    className: "ff-s5open"
  }, React.createElement("div", {
    id: "ff-co-welcome",
    className: "ff-stephead ff-s5head"
  }, React.createElement("span", {
    className: "ff-stepnum",
    "data-done": "1",
    style: { cursor: "default" }
  }, React.createElement(Check, {
    size: 14
  })), React.createElement("h1", {
    className: "ff-h1",
    style: { margin: 0, minWidth: 0, fontSize: "clamp(20px, 5.6vw, 26px)" }
  }, "Welcome to ", site.name)), React.createElement(CompanyLandscape, {
    company: c
  }), React.createElement("div", {
    className: "ff-welcome-acts"
  }, React.createElement("button", {
    type: "button",
    className: "ff-publish-btn",
    onClick: toEvent
  }, React.createElement(Calendar, {
    size: 17
  }), " Create an Event Card"), React.createElement("button", {
    type: "button",
    className: "ff-addff",
    onClick: () => dispatch({ type: "TOAST", toast: `Link copied · ${CARD_DOMAIN}/${c.slug}` }),
    "aria-label": "Add FF — share your Company Card"
  }, "Add ", React.createElement(AddFireFlairMark, {
    size: 22,
    tone: "var(--gold-lt)"
  }))));
}
