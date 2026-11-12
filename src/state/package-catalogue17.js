/* src/state/package-catalogue17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   PACKAGE CATALOGUE (v17.4.7) — the one authoritative table for FF Party packages.
   FF Party reads the customer price. FF Team reads the professional pay. Pay is DERIVED here
   (customer price minus the included FireFlair deposit) and nowhere else. All money is integer pennies.
   Stable ids never change when a display name changes: svc_mixology is shown as the Cocktail Package,
   svc_full is the Platinum Tasting Package.
   Everything that shows a package (FF Party home, booking catalogue, package pop-ups and pages, FF Team
   registration cards, invoices) builds from this list. Keep wording factual: no promises of glassware,
   alcohol, ingredients, ice, stock, garnishes, a mobile bar or unlimited drinks.
   ========================================================================== */
const PKG_DEPOSIT17 = 5000;


const PKG_CAT17 = [
  { id: "svc_full", order: 1, name: "Platinum Tasting Package", short: "Platinum Tasting", category: "bar", kind: "consultation", tone: "platinum",
    pricePence: 10000, startsFrom: false, durationLabel: "1 hour", durationMin: 60, role: "Event specialist", profession: null,
    headline: "Plan the experience before the event.", tagline: "Meet an experienced event specialist to plan your celebration.",
    points: ["Meet an experienced event specialist", "Discuss and develop a tailored menu or experience", "Plan the details of a larger celebration"],
    description: "A one-hour, consultation-led session with an event specialist, such as a bar company or another suitable provider, to plan your celebration.",
    includes: "A one-hour tasting or consultation with an event specialist", ideal: "Planning a larger celebration",
    conditions: "Arranged by FireFlair with a suitable provider. The consultation does not include the event's staff, supplies or delivery.",
    booking: "admin", registration: "business", teamRegistration: false, visible: true },
  { id: "svc_bartending", order: 2, name: "Bartending Package", short: "Bartending", category: "bar", kind: "base", tone: "bronze",
    pricePence: 15000, startsFrom: false, durationLabel: "3 hours", durationMin: 180, role: "Bartender", profession: "bartend",
    headline: "Your bartender. Your celebration.", tagline: "Choose the bartender you want for your event.",
    points: ["Choose the bartender you want", "Professional drinks service for your event", "Basic bartending equipment included"],
    description: "A professional bartender of your choice serves drinks at your event, with basic bartending equipment.",
    includes: "A bartender of your choice and basic bartending equipment", ideal: "House parties, birthdays and private events",
    conditions: "One professional. Glassware, drinks, ingredients and ice are agreed with your bartender and are not part of the package.",
    capability: "Professional service and basic bartending equipment.",
    booking: "choose", registration: "freelancer", teamRegistration: true, visible: true },
  { id: "svc_mixology", order: 3, name: "Cocktail Package", short: "Cocktail", category: "bar", kind: "base", tone: "silver",
    pricePence: 20000, startsFrom: false, durationLabel: "3 hours", durationMin: 180, role: "Cocktail Bartender", profession: "mixolog",
    headline: "Your favourite cocktails, expertly served.", tagline: "Choose the cocktails for your menu and book a cocktail bartender.",
    points: ["Choose the cocktails for your menu", "Receive a shopping list for your selections", "Book a cocktail bartender with basic cocktail equipment"],
    description: "A cocktail bartender prepares and serves the cocktails you choose, with basic cocktail equipment and a shopping list for your selections.",
    includes: "A cocktail bartender, your chosen cocktail menu and a shopping list", ideal: "Weddings, launches and celebrations",
    conditions: "One professional. Ingredients, glassware and ice are agreed with your bartender and are not part of the package.",
    capability: "Can prepare a selected cocktail menu, use appropriate cocktail equipment and help with the shopping list.",
    booking: "choose", registration: "freelancer", teamRegistration: true, visible: true },
  { id: "svc_flair", order: 4, name: "Flair Package", short: "Flair", category: "bar", kind: "base", tone: "gold",
    pricePence: 25000, startsFrom: false, durationLabel: "3 hours", durationMin: 180, role: "Flair Bartender", profession: "flair",
    headline: "Cocktails with a performance.", tagline: "Cocktail service with a flair performance.",
    points: ["Choose cocktails for your celebration", "Receive a shopping list for your menu", "Enjoy service from a flair-performing bartender"],
    description: "A bartender who performs flair prepares and serves the cocktails you choose, with a shopping list for your menu.",
    includes: "A flair-performing bartender, your chosen cocktails and a shopping list", ideal: "Launches, weddings and parties that want a show",
    conditions: "One professional. Any flair performance length is agreed with the bartender. Ingredients, glassware and ice are not part of the package.",
    capability: "Cocktail-service skills plus genuine flair performance ability.",
    booking: "choose", registration: "freelancer", teamRegistration: true, visible: true },
  { id: "svc_masterclass", order: 5, name: "Masterclass Package", short: "Masterclass", category: "bar", kind: "base", tone: "gold",
    pricePence: 30000, startsFrom: false, durationLabel: "2 hours", durationMin: 120, role: "Mixologist", profession: "mixolog",
    headline: "Create something extraordinary.", tagline: "Learn from an expert mixologist and create your own cocktails.",
    points: ["Learn from an expert mixologist", "Create and personalise your own cocktails with guidance", "Enjoy bespoke and off-menu drinks, with a tailored shopping list"],
    description: "An expert mixologist teaches, demonstrates and guides you through creating and personalising your own cocktails, using professional-grade cocktail equipment.",
    includes: "An expert mixologist, guided cocktail creation and a tailored shopping list", ideal: "Hen and stag parties, team socials and celebrations",
    conditions: "One professional. Ingredients and glassware are agreed with your mixologist and are not part of the package. The number of cocktails depends on your group.",
    capability: "Advanced cocktail knowledge, suitable equipment, off-menu creativity and confidence guiding or teaching guests.",
    booking: "choose", registration: "freelancer", teamRegistration: true, visible: true },
  { id: "svc_staffing", order: 6, name: "Staffing Package", short: "Staffing", category: "svc", kind: "standalone", tone: "white",
    pricePence: 10000, startsFrom: true, durationLabel: "From 2 hours", durationMin: 120, role: "Event Staff", profession: "waiter|host|barback|event|server|mc",
    headline: "The right team for your event.", tagline: "Skilled hospitality professionals who work solo.",
    points: ["One professional per package", "Able to work solo", "Looks after you and your guests"],
    description: "A skilled hospitality professional who works solo and looks after you and your guests.",
    includes: "Able to work solo and communicate with businesses and clients", ideal: "Business events (B2B) and private clients (B2C), venues and festivals",
    conditions: "One professional per package. The agreed role and hours are confirmed before booking.",
    booking: "choose", registration: "freelancer", teamRegistration: true, visible: true },
];


/* Staffing Add-on: adds one more professional to an existing Event Card. No second deposit; the amount goes to that professional. */
const PKG_ADDON17 = { id: "svc_addon", name: "Staffing Add-on", pricePence: 5000, startsFrom: true, depositPence: 0,
  roles: ["Bartender", "Bar Support", "Event Staff"] };


const PKG_BY17 = PKG_CAT17.reduce((m, p) => { m[p.id] = p; return m; }, {});


const pkgGBP17 = (pence) => "£" + (Number(pence || 0) / 100).toLocaleString("en-GB", { minimumFractionDigits: Number(pence || 0) % 100 ? 2 : 0, maximumFractionDigits: 2 });


/* The deposit a package carries inside its price (the whole price for nothing under the deposit). */
const pkgDeposit17 = (id) => { const p = PKG_BY17[id]; return p ? Math.min(PKG_DEPOSIT17, p.pricePence) : 0; };


/* Professional pay, in pennies: customer price minus the included deposit. */
const pkgPayPence17 = (id) => { const p = PKG_BY17[id]; return p ? Math.max(0, p.pricePence - pkgDeposit17(id)) : 0; };


const pkgPriceLabel17 = (id) => { const p = PKG_BY17[id]; return p ? (p.startsFrom ? "From " : "") + pkgGBP17(p.pricePence) : ""; };


const pkgPayLabel17 = (id) => { const p = PKG_BY17[id]; return p ? pkgGBP17(pkgPayPence17(id)) + (p.startsFrom ? "+" : "") : ""; };


/* Packages in ascending customer-price order (the order every comparable list uses). */
const pkgSorted17 = (list) => (list || PKG_CAT17).slice().sort((a, b) => (a.pricePence - b.pricePence) || (a.order - b.order));


/* A fresh service-card array in the shape the site screens already read. Each caller gets its own copy,
   so an admin hide or edit on one list never leaks into another. */
function pkgServices17(opts) {
  const o = opts || {};
  const pool = PKG_CAT17.filter(p => p.visible && (o.all ? true : o.baseOnly ? p.kind === "base" : p.kind !== "standalone"));
  return [...pkgSorted17(pool.filter(p => p.kind !== "standalone")), ...pool.filter(p => p.kind === "standalone")].map(p => ({
    id: p.id, tone: p.tone, level: p.kind === "consultation" ? "Platinum" : p.kind === "standalone" ? "Staffing" : "Bar", title: o.short ? p.short : p.name,
    tagline: p.tagline, includes: p.includes, ideal: p.ideal, time: p.durationLabel, price: pkgPriceLabel17(p.id), from: pkgGBP17(p.pricePence),
    points: p.points.slice(), description: p.description, conditions: p.conditions, pay: pkgPayLabel17(p.id), role: p.role,
  }));
}


/* ---- The FF Party booking deposit ------------------------------------------------------------------------
   One deposit per BASE package, collected in one checkout. A Staffing Add-on position (shift.addOn) never adds one.
   Phase 2 allows one base package per Event Card, so the count is capped at PKG_MAX_BASE17; lifting the cap later
   (a bar company's package plus a caterer's, say) is one number. Returns whole pounds, like the rest of the booking code. */
const PKG_MAX_BASE17 = 1;


const partyBaseCount17 = (shifts) => Math.min(PKG_MAX_BASE17, Math.max(1, (shifts || []).filter(x => x && x.svcId && !x.addOn && !x.special).length));


function partyDeposit17(state, shifts) {
  /* A Special Request carries no deposit until the customer has agreed the arrangement. */
  if ((shifts || []).length && (shifts || []).every(x => x && x.special)) return 0;
  const per = (typeof rules17 === "function" ? rules17(state).feeParty : 50);
  return per * partyBaseCount17(shifts);
}
