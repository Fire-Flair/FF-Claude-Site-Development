/* src/utils/seo.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   SEO — one configuration, one metadata builder, one head updater.

   What this does: whenever the view changes (signed-out Home, a guest screen,
   a signed-in tab, or a person's Profile Card) it works out the title,
   description, canonical URL, robots rule, social tags and JSON-LD for that
   view from the data on screen, and writes them to the page head.

   Rules it enforces (see ffSeoSelfTest):
   - Only the signed-out Home page is offered to search engines.
   - Signed-in screens and guest screens are noindex.
   - A Profile Card is offered only when the card is published (person.public
     === true), has a tag, and FF_SEO.demoData is false. The sample people in
     this prototype are fictional, so demoData is true here.
   - Structured data is built from the same fields the card shows, never from
     phone numbers or e-mail addresses, and only for indexable pages.

   Limits of the artifact runtime (documented, not hidden):
   - There is one URL ("/"). Profile Cards are not separately addressable until
     the real site gives them /TAG routes (the canonical here is the intended
     production URL). Search engines also read the HTML before scripts run, and
     Google may not honour a noindex that is only added by script, so the
     production site must send these tags in the server-rendered HTML.
   - This file only changes <head> tags and one JSON-LD script. It does not
     touch state, routing, authentication, XP or any card.
   ========================================================================== */
const FF_SEO = {
  siteName: "FireFlair",
  origin: "https://ffparty.uk", profileOrigin: "https://ffteam.uk",
  locale: "en_GB",
  demoData: true,                       // sample people are fictional: never offered to search engines
  title: { min: 10, max: 60 },
  description: { min: 70, max: 160 },
  onView: null,                         // optional: (seo) => void — the hook point for analytics; nothing is sent from here
};


const FF_SEO_HOME = {
  title: "FF Team — Profile Cards for event professionals | FireFlair",
  description: "FireFlair is here to get you bookings. Freelance hospitality and event staff build a Profile Card, grow their network and take reviews.",
};


const FF_SEO_TAB_LABEL = { home: "Home", network: "Network", bookings: "Bookings", profile: "Profile" };



const ffSeoClean = (s) => String(s == null ? "" : s).replace(/\s+/g, " ").trim();


const ffSeoClip = (s, max) => {
  s = ffSeoClean(s);
  if (s.length <= max) return s;
  return s.slice(0, max - 1).replace(/[\s,;:·—–-]+\S*$/, "").replace(/[\s,;:·—–-]+$/, "") + "…";
};


const ffSeoList = (v) => (Array.isArray(v) ? v : v ? [v] : [])
  .map(x => (typeof x === "string" ? x : x && (x.name || x.label)))
  .map(ffSeoClean).filter(Boolean);


const ffSeoUrl = (path) => FF_SEO.origin + "/" + (path ? String(path).replace(/^\/+/, "") : "");


const ffSeoJoin = (a) => (a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1]);


const ffSeoA = (w) => (/^[aeiou]/i.test(w) ? "an " : "a ") + w;



/* Everyone who can be opened as a Profile Card — the same list useDirectory() shows. */
function ffSeoPeople(state) {
  const dir = adminPeople17(state, state.directory || []);
  return state.profile && state.profile.live ? [meAsStaff(state.profile, state.session), ...dir] : dir;
}



function ffSeoPersonPage(person) {
  const name = ffSeoClean(person.name);
  const prof = ffSeoList(person.professions || person.profession)[0] || "";
  const locs = ffSeoList(person.locations).slice(0, 3);
  const langs = ffSeoList(person.languages).slice(0, 5);
  const tag = ffSeoClean(person.tag).replace(/[^A-Za-z0-9_-]/g, "");
  const url = ffSeoProfileUrl17(tag);
  const indexable = !FF_SEO.demoData && person.public === true && !!tag;
  const title = ffSeoClip(prof ? `${name} — ${prof} | ${FF_SEO.siteName}` : `${name} | ${FF_SEO.siteName}`, FF_SEO.title.max);
  const description = ffSeoClip(
    `${prof ? `${name} is ${ffSeoA(prof)} on FireFlair` : `${name} on FireFlair`}` +
    `${locs.length ? `, working in ${ffSeoJoin(locs)}` : ""}.` +
    `${langs.length ? ` Speaks ${ffSeoJoin(langs)}.` : ""} See the full Profile Card.`,
    FF_SEO.description.max);
  let jsonLd = null;
  if (indexable) {
    const entity = { "@type": "Person", "@id": url + "#person", name, url };
    entity.identifier = tag;
    if (prof) entity.jobTitle = prof;
    if (langs.length) entity.knowsLanguage = langs;
    const about = ffSeoClean(person.about);
    if (about) entity.description = ffSeoClip(about, 300);
    if (/^https:\/\//.test(person.photo || "")) entity.image = person.photo;
    jsonLd = { "@context": "https://schema.org", "@type": "ProfilePage", "@id": url + "#profile", url, mainEntity: entity };
    if (/^\d{4}-\d\d-\d\dT/.test(person.createdAt || "")) jsonLd.dateCreated = person.createdAt;
    if (/^\d{4}-\d\d-\d\dT/.test(person.updatedAt || "")) jsonLd.dateModified = person.updatedAt;
  }
  return {
    page: "person", ...ffIntroSeo17(person, title, description), canonical: indexable ? url : ffSeoUrl(""),
    robots: indexable ? "index, follow" : "noindex, nofollow", type: "profile", jsonLd,
  };
}



function ffSeoFor(state, people) {
  if (state.ptnGuest) return { page: "partners-guest", title: "Guest page — FireFlair Partners", description: "A property guest page in the FF Partners preview.", canonical: ffSeoUrl(""), robots: "noindex, nofollow", type: "website", jsonLd: null };
  if (state.supportPage20) { const sS = V101.support20Seo(state); if (sS) return sS; }
  if (state.pkgPage) { const pkS = V101.pkgSeo18(state); if (pkS) return pkS; }
  if (state.fdArea) { const fdS = fdSeo(state, people); if (fdS) return fdS; }
  if (state.viewing) {
    const person = (people || []).find(p => p && p.id === state.viewing);
    if (person && ffSeoClean(person.name)) return ffSeoPersonPage(person);
  }
  const tab = state.tab || "home";
  const area = FF_SEO_TAB_LABEL[tab] || "Home";
  if (!state.role && tab === "home") {
    return { page: "home", title: FF_SEO_HOME.title, description: FF_SEO_HOME.description,
      canonical: ffSeoUrl(""), robots: "index, follow", type: "website", jsonLd: null };
  }
  const who = state.role === "partners" ? "FF Partners" : state.role === "team" ? "FF Team" : state.role === "staff" ? (state.site === "party" ? "FF Party" : "FF Staff") : "";
  return {
    page: (who ? who.replace(/\s/g, "-").toLowerCase() : "guest") + "-" + tab,
    title: `${who ? who + " · " : ""}${area} — ${FF_SEO.siteName}`,
    description: who ? `${area} in ${who} on FireFlair — your account area, not for search results.`
      : `${area} on FireFlair, shown with demonstration data.`,
    canonical: ffSeoUrl(""), robots: "noindex, nofollow", type: "website", jsonLd: null,
  };
}



/* Writes the head. Updates a tag where one already exists (so there is never a
   second canonical or description), creates it otherwise. */
function ffSeoApply(seo, doc) {
  doc = doc || (typeof document !== "undefined" ? document : null);
  if (!doc || !seo) return null;
  const head = doc.head || doc.documentElement;
  const upsert = (selector, tag, attrs) => {
    let el = doc.querySelector(selector);
    if (!el) { el = doc.createElement(tag); head.appendChild(el); }
    Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  };
  doc.title = seo.title;
  upsert('meta[name="description"]', "meta", { name: "description", content: seo.description });
  upsert('meta[name="robots"]', "meta", { name: "robots", content: seo.robots });
  upsert('link[rel="canonical"]', "link", { rel: "canonical", href: seo.canonical });
  upsert('meta[property="og:type"]', "meta", { property: "og:type", content: seo.type });
  upsert('meta[property="og:site_name"]', "meta", { property: "og:site_name", content: FF_SEO.siteName });
  upsert('meta[property="og:locale"]', "meta", { property: "og:locale", content: FF_SEO.locale });
  upsert('meta[property="og:title"]', "meta", { property: "og:title", content: seo.title });
  upsert('meta[property="og:description"]', "meta", { property: "og:description", content: seo.description });
  upsert('meta[property="og:url"]', "meta", { property: "og:url", content: seo.canonical });
  upsert('meta[name="twitter:title"]', "meta", { name: "twitter:title", content: seo.title });
  upsert('meta[name="twitter:description"]', "meta", { name: "twitter:description", content: seo.description });
  const old = doc.getElementById("ff-jsonld-page");
  if (seo.jsonLd) {
    const s = old || doc.createElement("script");
    s.id = "ff-jsonld-page"; s.type = "application/ld+json";
    s.textContent = JSON.stringify(seo.jsonLd).replace(/</g, "\\u003c");
    if (!old) head.appendChild(s);
  } else if (old && old.parentNode) {
    old.parentNode.removeChild(old);
  }
  return seo;
}



/* Returns a list of problems (empty = fine). Indexable pages are held to the
   full rules; noindex pages only need a sensible title and a valid canonical. */
function ffSeoValidate(seo) {
  const out = [];
  if (!seo) return ["no metadata"];
  const idx = /^index/.test(seo.robots || "");
  if (!["index, follow", "noindex, nofollow"].includes(seo.robots)) out.push("unknown robots value: " + seo.robots);
  if (!ffSeoClean(seo.title)) out.push("missing title");
  else if (seo.title.length > FF_SEO.title.max) out.push(`title longer than ${FF_SEO.title.max}: ${seo.title.length}`);
  else if (idx && seo.title.length < FF_SEO.title.min) out.push("title too short");
  if (idx) {
    const d = ffSeoClean(seo.description).length;
    if (d < FF_SEO.description.min || d > FF_SEO.description.max) out.push(`description length ${d} outside ${FF_SEO.description.min}-${FF_SEO.description.max}`);
  }
  try {
    const u = new URL(seo.canonical);
    if (u.protocol !== "https:") out.push("canonical is not https");
    if (u.origin !== FF_SEO.origin && u.origin !== FF_SEO.profileOrigin) out.push("canonical is on another host: " + u.origin);
    if (u.search || u.hash) out.push("canonical carries a query or fragment");
  } catch (e) { out.push("canonical is not a valid absolute URL"); }
  // ISO dates are digits too; take them out before looking for phone-number-like strings.
  const blob = [seo.title, seo.description, seo.jsonLd ? JSON.stringify(seo.jsonLd) : ""].join(" ").replace(/\d{4}-\d\d-\d\d(T[\d:.]+Z?)?/g, "");
  if (/[\w.+-]+@[\w-]+\.[\w.]+/.test(blob)) out.push("an e-mail address appears in metadata");
  if (/\+?\d[\d\s().-]{8,}\d/.test(blob)) out.push("a phone-number-like string appears in metadata");
  if (seo.jsonLd) {
    let back = null;
    try { back = JSON.parse(JSON.stringify(seo.jsonLd)); } catch (e) { out.push("JSON-LD does not serialise"); }
    if (back) {
      if (back["@context"] !== "https://schema.org") out.push("JSON-LD @context missing");
      if (!back["@type"]) out.push("JSON-LD @type missing");
      if (!idx) out.push("JSON-LD on a noindex page");
      if (back["@type"] === "ProfilePage") {
        const m = back.mainEntity;
        if (!m || !["Person", "Organization"].includes(m["@type"])) out.push("ProfilePage needs a Person or Organization mainEntity");
        else if (!ffSeoClean(m.name)) out.push("ProfilePage mainEntity has no name");
        else if (seo.title.indexOf(m.name) !== 0 && seo.title.indexOf(m.name.slice(0, 20)) !== 0) out.push("ProfilePage name is not the name shown in the title");
        if (back.url !== seo.canonical) out.push("ProfilePage url differs from canonical");
      }
    }
  }
  return out;
}



/* Builds the metadata for every screen the app can show, plus production-mode
   cases, and checks the rules above. Callable from the console (window.__ffSeo.selfTest())
   and from a test runner. Changes nothing but restores FF_SEO.demoData afterwards. */
function ffSeoSelfTest() {
  const failures = [];
  const fail = (m) => failures.push(m);
  const seenTitles = new Map(), seenCanon = new Map();
  let checked = 0;
  const wasDemo = FF_SEO.demoData;
  try {
    const base = initialState;
    const states = [];
    const add = (label, st) => states.push({ label, st });
    ["home", "network", "bookings", "profile"].forEach(t => add("guest/" + t, { ...base, role: null, tab: t, viewing: null }));
    ["team", "staff"].filter(r => r === "team" || p1SiteOpen(r)).forEach(r => {
      const entered = reducer(base, { type: "ROLE", role: r });
      ["home", "network", "bookings", "profile"].forEach(t => add(r + "/" + t, { ...entered, tab: t, viewing: null }));
    });
    (base.directory || []).forEach(p => add("person/" + p.id, { ...base, role: null, tab: "network", viewing: p.id }));
    const people = ffSeoPeople(base);

    // 1. Prototype mode: every screen validates; only signed-out Home is indexable.
    FF_SEO.demoData = true;
    states.forEach(({ label, st }) => {
      const seo = ffSeoFor(st, people);
      checked++;
      ffSeoValidate(seo).forEach(i => fail(`[${label}] ${i}`));
      const idx = /^index/.test(seo.robots);
      if (idx && label !== "guest/home") fail(`[${label}] is indexable in prototype mode`);
      if (label === "guest/home" && !idx) fail("[guest/home] should be indexable");
      if (seo.jsonLd) fail(`[${label}] has JSON-LD in prototype mode`);
      if (seenTitles.has(seo.title)) fail(`[${label}] duplicate title with [${seenTitles.get(seo.title)}]: ${seo.title}`);
      else seenTitles.set(seo.title, label);
      if (idx) { if (seenCanon.has(seo.canonical)) fail(`[${label}] duplicate canonical with [${seenCanon.get(seo.canonical)}]`); else seenCanon.set(seo.canonical, label); }
    });

    // 2. Production mode: a published card is indexable with valid ProfilePage data; others are not.
    FF_SEO.demoData = false;
    const pub = { id: "t1", name: "Test Person", tag: "TESTP", profession: "Cocktail Bartender", locations: ["East London"],
      languages: ["English", "Italian"], about: "Ten years behind bars.", photo: "https://ffparty.uk/img/t1.jpg",
      phone: "+44 7700 900123", email: "test@example.com", public: true, createdAt: "2026-01-02T10:00:00Z" };
    const view = (p) => ffSeoFor({ ...base, role: null, tab: "network", viewing: p.id }, [p]);
    let seo = view(pub); checked++;
    ffSeoValidate(seo).forEach(i => fail("[published card] " + i));
    if (seo.robots !== "index, follow") fail("[published card] should be indexable");
    if (seo.canonical !== FF_SEO.profileOrigin + "/TESTP") fail("[published card] canonical is " + seo.canonical);
    if (!seo.jsonLd || seo.jsonLd["@type"] !== "ProfilePage") fail("[published card] missing ProfilePage JSON-LD");
    if (/7700|example\.com/.test(JSON.stringify(seo) )) fail("[published card] private contact details leaked into metadata");
    if (seo.jsonLd && seo.jsonLd.dateModified) fail("[published card] dateModified invented");
    [["unpublished card", { ...pub, public: false }], ["card without public flag", { ...pub, public: undefined }], ["card without tag", { ...pub, tag: "" }]].forEach(([label, p]) => {
      const s = view(p); checked++;
      if (/^index/.test(s.robots) || s.jsonLd) fail(`[${label}] must be noindex with no JSON-LD`);
      ffSeoValidate(s).forEach(i => fail(`[${label}] ${i}`));
    });
    seo = view({ ...pub, name: "A".repeat(80) }); checked++;
    if (seo.title.length > FF_SEO.title.max) fail("[long name] title not clipped: " + seo.title.length);
    seo = ffSeoFor({ ...base, role: null, tab: "network", viewing: "t2" }, [{ id: "t2", name: "  " }]); checked++;
    if (seo.page === "person") fail("[nameless card] should fall back to a non-person page");
  } catch (e) {
    fail("self-test crashed: " + (e && e.message));
  } finally {
    FF_SEO.demoData = wasDemo;
  }
  return { ok: failures.length === 0, checked, failures };
}


try {
  if (typeof window !== "undefined")
    window.__ffSeo = { config: FF_SEO, build: ffSeoFor, apply: ffSeoApply, validate: ffSeoValidate, selfTest: ffSeoSelfTest, people: ffSeoPeople };
} catch (e) {}
