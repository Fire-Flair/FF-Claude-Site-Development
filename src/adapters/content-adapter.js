/* src/adapters/content-adapter.js
   CONTENT_ADAPTER — contract for the future Content API (Content Manager).
   Everything an editor or an AI tool may change WITHOUT touching product code lives behind this object:
   Stories, package cards, homepage copy and company profiles.

   Today every method returns plain JSON read from files in src/content/ (inlined at build time by
   scripts/build.mjs). The real service replaces each method body with a call (fetch + cache) that returns
   the SAME JSON shape. No method has side effects; every method is synchronous in the prototype and may
   become async (return a Promise) in the real service, so callers should treat results as data only.

   Methods (inputs: none; outputs: JSON, see each comment). Editing data = edit the JSON file (or the
   Markdown under stories/ and run `npm run stories`); no .jsx file needs to change. */
const CONTENT_ADAPTER = {
  /** Company profile pages shown on Network (FF Team and FF Staff) and each company page. Returns an array of profile objects (slug, name, about, services, events, contact, areas, packages, questions).
   *  Prototype source: src/content/companies/real-companies.json. Replace the body with a Content API call. */
  companyProfiles() { return __ff_json("content/companies/real-companies.json"); },
  /** Directory of supplier companies (bar, DJ, entertainment, services, caterers). Returns an array of supplier objects (slug, tag, name, kind, cat, base, areas, ...).
   *  Prototype source: src/content/companies/suppliers.json. Replace the body with a Content API call. */
  supplierProfiles() { return __ff_json("content/companies/suppliers.json"); },
  /** Raise the Bar cocktail menu source data (name, size options, ingredients).
   *  Prototype source: src/content/packages/raise-the-bar-menu.json. Replace the body with a Content API call. */
  raiseTheBarMenu() { return __ff_json("content/packages/raise-the-bar-menu.json"); },
  /** DJ package cards (Storm DJs) shown on FF Party.
   *  Prototype source: src/content/packages/dj-packages.json. Replace the body with a Content API call. */
  djPackages() { return __ff_json("content/packages/dj-packages.json"); },
  /** Serving sizes for the Raise the Bar cocktail add-ons.
   *  Prototype source: src/content/packages/raise-the-bar-sizes.json. Replace the body with a Content API call. */
  raiseTheBarSizes() { return __ff_json("content/packages/raise-the-bar-sizes.json"); },
  /** Homepage "discover" copy for FF Team (cards with title, text, image key).
   *  Prototype source: src/content/homepage/discover-team.json. Replace the body with a Content API call. */
  homepageDiscoverTeam() { return __ff_json("content/homepage/discover-team.json"); },
  /** Homepage "discover" copy for FF Staff.
   *  Prototype source: src/content/homepage/discover-staff.json. Replace the body with a Content API call. */
  homepageDiscoverStaff() { return __ff_json("content/homepage/discover-staff.json"); },
  /** Homepage "discover" copy for FF Party.
   *  Prototype source: src/content/homepage/discover-party.json. Replace the body with a Content API call. */
  homepageDiscoverParty() { return __ff_json("content/homepage/discover-party.json"); },
  /** Order in which package pages are listed on FF Party.
   *  Prototype source: src/content/packages/package-page-order.json. Replace the body with a Content API call. */
  packagePageOrder() { return __ff_json("content/packages/package-page-order.json"); },
  /** Every FireFlair Story as an object keyed by id: title, slug, site, category, dates, body blocks, attribution (author, posted by, featured), reader questions.
   *  Prototype source: src/content/stories/articles.json, written by scripts/build-stories.py from stories/<site>/<slug>.md. */
  storyArticles() { return __ff_json("content/stories/articles.json"); },
  /** Display order of Story ids per site: { team: [...], staff: [...], party: [...] }.
   *  Prototype source: src/content/stories/order.json, written by scripts/build-stories.py from stories/<site>/<slug>.md. */
  storyOrder() { return __ff_json("content/stories/order.json"); },
  /** Profile resolver registry for featured people in Stories (verified public profiles only).
   *  Prototype source: src/content/stories/profiles.json, written by scripts/build-stories.py from stories/<site>/<slug>.md. */
  storyProfiles() { return __ff_json("content/stories/profiles.json"); },
  /** Story hero images keyed by "s18_<slug>": { src, pos }.
   *  Prototype source: src/content/stories/images.json, written by scripts/build-stories.py from stories/<site>/<slug>.md. */
  storyImages() { return __ff_json("content/stories/images.json"); },
};
