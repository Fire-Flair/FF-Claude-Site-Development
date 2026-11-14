/* src/components/staff/company-shape.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   THE COMPANY PAGE SHAPE (v17.6)

   One shape builds a company page. The builder writes it, the owner's page
   and every directory company read it, and the directory agent fills it.
   Field by field: docs/company-profile-format.md.

   company.info                 [{ id, title, lead, text, chips, numbered, quote }]   the "More information" sections (settings only)
   company.records["info_<id>"] the cards of that section (the shared card record)
   company.records.packages     the Packages cards
   company.records.cocktail_menu the Cocktails cards
   company.records.web_reviews  "Reviews from other sources" (title = who said it, description = what they said)
   company.media                [{ id, src, alt }]   gallery photos; alt is the caption; the array order is the display order

   A card is the shared card record (makeRecord): name, description, media (up to 5), document, hidden, rank.
   Old sections that still hold items (info[].items) are read as cards, and CO_INFO_MIGRATE writes them to records.
   ========================================================================== */
const CO_MAX_MEDIA17 = 5;


const coInfoKey17 = (id) => "info_" + id;


/* The records a card category is read from: info sections, packages, cocktails, website reviews. */
const coRecsOf17 = (c, key) => ((c && c.records && c.records[key]) || []);


/* Old items ({ title, text, photo }) read as cards. */
function coLegacyCards17(sec) {
  return (sec.items || []).filter((it) => String(it.title || it.text || it.photo || "").trim()).map((it, i) => makeRecord("info", it.title || "", {
    id: sec.id + "_" + i,
    description: it.text || "",
    media: it.photo ? [{ id: sec.id + "_" + i + "_p", name: it.title || "", dataUrl: it.photo }] : [],
  }));
}


/* Every card of a section (hidden ones too), in display order. */
function coSecAll17(c, sec) {
  const key = coInfoKey17(sec.id);
  if (c && c.records && Array.isArray(c.records[key])) return c.records[key];
  return rankAll(coLegacyCards17(sec));
}


/* Cards people see: not hidden, not proposed, in display order. */
const coShownCards17 = (list) => rankedRecords(list || []).filter((r) => !r.hidden && !r.proposed && (String(r.name || "").trim() || String(r.description || "").trim() || (r.media || []).length));


const coSections17 = (c) => ((c && c.info) || []).filter((s) => s && String(s.title || "").trim());


const coPackages17 = (c) => coShownCards17(coRecsOf17(c, "packages"));


const coCocktails17 = (c) => coShownCards17(coRecsOf17(c, "cocktail_menu"));


const coWebReviews17 = (c) => coShownCards17(coRecsOf17(c, "web_reviews"));


const coPhotos17 = (r) => ((r && r.media) || []).map((m) => m.dataUrl).filter(Boolean);


/* Build a card record for source data (Vooshka, Raise the Bar) in the builder's own shape. */
function coCard17(category, id, title, text, photos) {
  return makeRecord(category, title, {
    id,
    description: text || "",
    media: (photos || []).filter(Boolean).slice(0, CO_MAX_MEDIA17).map((p, i) => ({ id: id + "_p" + i, name: title, dataUrl: p })),
  });
}


const coCardList17 = (category, idBase, rows) => rankAll(rows.map(([title, text, photos], i) => coCard17(category, idBase + "_" + i, title, text, photos)));


/* Photos picked in bulk become one card each, titled with the file name without its extension. */
const coTitleOfFile17 = (name) => String(name || "").replace(/\.[A-Za-z0-9]{1,5}$/, "").trim();


/* The company address (slug). Made from the company name the first time the company is saved; the company can change it in Private, Company details. */
const CO_SLUG_RE17 = /^[a-z0-9]+(-[a-z0-9]+)*$/;


/* Every address already used by a company in the directory (claimed or not). */
const coDirSlugs17 = () => { try { return Object.values(rt17SlugMap().ids); } catch (e) { return []; } };


/* Free to use: the right shape, not a page name, not another company's. `current` is the company's own address. */
function coSlugFree17(slug, current) {
  const s = String(slug || "").toLowerCase();
  if (s.length < 3 || s.length > 40 || !CO_SLUG_RE17.test(s)) return false;
  if (current && s === String(current).toLowerCase()) return true;
  return !rt17Reserved(s) && !coDirSlugs17().includes(s);
}


/* The first free address for a company name: the plain name, then -co, then -2, -3. */
function coSlugFromName17(name, current) {
  const base = slugify(name);
  if (!base) return "";
  if (coSlugFree17(base, current)) return base;
  const alt = (base + "-co").slice(0, 40);
  if (coSlugFree17(alt, current)) return alt;
  for (let n = 2; n < 99; n++) { const k = (base.slice(0, 36) + "-" + n); if (coSlugFree17(k, current)) return k; }
  return base;
}


/* An address made by the old sign-up rule from the phone number (ff-123456): replaced by the name's address at the next save. */
const coSlugIsPhone17 = (slug) => /^ff-[a-z0-9]+$/.test(String(slug || ""));


/* Contact kinds, in the order of the picker. `soc` is the Company Card icon the kind feeds (SOC11 key). */
const CO_CONTACT_KINDS17 = [
  { kind: "WhatsApp", soc: "whatsapp", ph: "+44 7700 900000" },
  { kind: "Phone", ph: "020 7946 0000" },
  { kind: "Email", ph: "bookings@yourcompany.co.uk" },
  { kind: "Website", ph: "yourcompany.co.uk" },
  { kind: "Instagram", soc: "instagram", ph: "@yourcompany" },
  { kind: "Facebook", soc: "facebook", ph: "yourcompany" },
  { kind: "TikTok", soc: "tiktok", ph: "@yourcompany" },
  { kind: "LinkedIn", soc: "linkedin", ph: "company/yourcompany" },
];


const coKindOf17 = (label) => { const t = String(label || ""); return (CO_CONTACT_KINDS17.find((x) => new RegExp(x.kind, "i").test(t)) || (/tel|mobile/i.test(t) ? CO_CONTACT_KINDS17[1] : /site|web/i.test(t) ? CO_CONTACT_KINDS17[3] : null) || {}); };


/* A contact as a real link: wa.me, tel:, mailto: or https. */
function coContactHref17(kind, value) {
  const v = String(value || "").trim();
  if (!v) return "";
  const k = coKindOf17(kind).kind;
  const handle = (x) => x.replace(/^@+/, "").replace(/^https?:\/\/(www\.)?[^/]+\//i, "").replace(/\/+$/, "");
  if (/^https?:\/\//i.test(v) && k !== "Email" && k !== "Phone" && k !== "WhatsApp") return v;
  if (k === "WhatsApp") return "https://wa.me/" + v.replace(/[^\d]/g, "").replace(/^0(?=7)/, "44");
  if (k === "Phone") return "tel:" + v.replace(/[^\d+]/g, "");
  if (k === "Email") return "mailto:" + v;
  if (k === "Instagram") return "https://instagram.com/" + handle(v);
  if (k === "Facebook") return "https://facebook.com/" + handle(v);
  if (k === "TikTok") return "https://tiktok.com/@" + handle(v);
  if (k === "LinkedIn") return "https://linkedin.com/" + (/^(company|in|school)\//i.test(handle(v)) ? handle(v) : "company/" + handle(v));
  return "https://" + v.replace(/^\/+/, "");
}


/* Everything a company has as contacts, once each: its contact cards, then any Company Card social that has no card of its kind. */
function coContacts17(co) {
  const cards = coRecsOf17(co, "contact").filter((r) => !r.hidden && String(r.name || "").trim()).map((r) => ({ id: r.id, kind: r.description || "Contact", value: String(r.name).trim() }));
  const legacy = !cards.length && Array.isArray(co && co.contact) ? co.contact.map(([k, v], i) => ({ id: "lc" + i, kind: k, value: v })) : [];
  const out = [...cards, ...legacy];
  const s = (co && co.socials) || {};
  SOC11.forEach((x) => {
    const v = String(s[x.k] || "").trim();
    if (v && !out.some((o) => coKindOf17(o.kind).soc === x.k)) out.push({ id: "so_" + x.k, kind: x.label, value: v });
  });
  return out;
}


/* The Company Card icons follow the contact cards (WhatsApp, Instagram, Facebook, TikTok, LinkedIn). */
function coSocialsFromContacts17(c, cards) {
  const socials = { ...((c && c.socials) || {}) };
  CO_CONTACT_KINDS17.filter((x) => x.soc).forEach((x) => {
    const r = (cards || []).find((y) => !y.hidden && coKindOf17(y.description).soc === x.soc && String(y.name || "").trim());
    if (r) socials[x.soc] = String(r.name).trim(); else delete socials[x.soc];
  });
  return socials;
}


/* The starters offered by "Add a section". They set the title and whether the cards are numbered; `ph` holds the examples shown as placeholders (never saved).
   The developers and the directory agent read this one list. */
const CO_STARTERS17 = [
  { key: "why", name: "Why choose us", title: "Why choose us", numbered: false, icon: "Sparkles",
    ph: { title: "Why choose us", lead: "A little theatre. A lot of elegance.", text: "You bring the people and the reason to celebrate; we'll take care of the bar.", chip: "Bespoke bars", quote: "Not just a bar. A beautiful part of your celebration.", cardTitle: "Expert team", cardText: "Skilled bartenders and creative mixologists who look after every guest." } },
  { key: "how", name: "How it works", title: "How it works", numbered: true, icon: "ListOrdered",
    ph: { title: "How it works", lead: "Four simple steps from first message to last drink.", text: "We keep it simple, so you can enjoy the build-up as much as the night.", chip: "Free tasting", quote: "Not just a bar. A beautiful part of your celebration.", cardTitle: "It begins with you", cardText: "We talk through your event, your venue and the atmosphere you want." } },
  { key: "gallery", name: "Gallery", title: "Gallery", numbered: false, bulk: true, icon: "Images",
    ph: { title: "Gallery", lead: "Behind every memorable occasion", text: "A few of our favourite nights.", chip: "Weddings", quote: "", cardTitle: "Oak bar, evening reception", cardText: "" } },
  { key: "offer", name: "What we offer", title: "What we offer", numbered: false, icon: "Tags",
    ph: { title: "What we offer", lead: "Everything your bar needs, in one place.", text: "", chip: "Bespoke bars", quote: "", cardTitle: "Cocktail masterclass", cardText: "A hands-on class for teams and private groups." } },
  { key: "awards", name: "Awards and accreditations", title: "Awards and accreditations", numbered: false, doc: true, icon: "Award",
    ph: { title: "Awards and accreditations", lead: "Recognised for the way we work.", text: "", chip: "Fully insured", quote: "", cardTitle: "Public liability insurance", cardText: "Cover in place for every event. Certificate on request." } },
  { key: "own", name: "Your own", title: "", numbered: false, icon: "Plus",
    ph: { title: "Our story", lead: "A bar built around your occasion.", text: "Tell people what makes your company different.", chip: "Family run", quote: "Thank you for considering us.", cardTitle: "Our beginnings", cardText: "How the company started and what we care about." } },
];


/* The starter a section was made from (kept for this visit), else the one its title matches, else Your own. */
const CO_STARTER_OF17 = {};


const coStarterOf17 = (sec) => CO_STARTERS17.find((x) => x.key === CO_STARTER_OF17[sec && sec.id]) || CO_STARTERS17.find((x) => x.title && sec && String(sec.title || "").trim().toLowerCase() === x.title.toLowerCase()) || CO_STARTERS17[CO_STARTERS17.length - 1];


/* Reducer cases for the company page shape (run from v11Reducer). */
function coShapeReducer17(s, a) {
  const c = s.company || {};
  switch (a.type) {
    case "COMPANY_MEDIA_PATCH": return { ...s, company: { ...c, media: (c.media || []).map((m) => m.id === a.id ? { ...m, ...a.patch } : m) } };
    case "COMPANY_MEDIA_MOVE": {
      const list = [...(c.media || [])];
      const i = list.findIndex((m) => m.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...s, company: { ...c, media: list } };
    }
    /* A section and all of its cards go together. */
    case "CO_SECTION_DELETE": {
      const records = { ...(c.records || {}) };
      delete records[coInfoKey17(a.id)];
      return { ...s, company: { ...c, info: (c.info || []).filter((x) => x.id !== a.id), records } };
    }
    /* A section's own settings, typed straight onto the page. */
    case "CO_SEC_ADD": return { ...s, company: { ...c, info: [...(c.info || []), a.sec], records: { ...(c.records || {}), [coInfoKey17(a.sec.id)]: (c.records || {})[coInfoKey17(a.sec.id)] || [] } } };
    case "CO_SEC_PATCH": return { ...s, company: { ...c, info: (c.info || []).map((x) => x.id === a.id ? { ...x, ...a.patch } : x) } };
    case "CO_SEC_MOVE": {
      const list = [...(c.info || [])];
      const i = list.findIndex((x) => x.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...s, company: { ...c, info: list } };
    }
    /* The company address changes: its team records and questions follow it. */
    case "CO_SLUG_SET": {
      const next = String(a.slug || ""), old = c.slug;
      if (!next || next === old) return s;
      const oldKey = old ? "co:" + slugify(old) : "", newKey = "co:" + slugify(next);
      const rekey = (x) => oldKey && x && x.companyKey === oldKey ? { ...x, companyKey: newKey } : x;
      return { ...s, company: { ...c, slug: next }, coTeams17: (s.coTeams17 || []).map(rekey), profileQuestions: (s.profileQuestions || []).map(rekey),
        auth: s.auth && s.auth.method === "company" ? { ...s.auth, tag: next } : s.auth };
    }
    /* Old sections with items: the items become cards (once), and the section keeps its settings only. */
    case "CO_INFO_MIGRATE": {
      const info = c.info || [];
      if (!info.some((x) => x && x.items && x.items.length)) return s;
      const records = { ...(c.records || {}) };
      const next = info.map((sec) => {
        if (!sec || !sec.items) return sec;
        const key = coInfoKey17(sec.id);
        if (!Array.isArray(records[key])) records[key] = rankAll(coLegacyCards17(sec));
        const { items, ...rest } = sec;
        return rest;
      });
      return { ...s, company: { ...c, info: next, records } };
    }
    default: return null;
  }
}
