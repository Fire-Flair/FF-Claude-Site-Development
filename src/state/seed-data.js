/* src/state/seed-data.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
                        // FireFlair connection fee, one credit per confirmed Service Card


/* Named service locations, not a radius. FireFlair suggests neighbours of the
   business's known location; the user approves each one before it's saved.
   HONEST STATUS: a local lookup stands in for the FireFlair location script. */
const LOCATION_NEIGHBOURS = {
  "enfield": ["North London", "Barnet", "Edmonton", "Cheshunt", "Potters Bar", "Hertfordshire"],
  "berkhamsted": ["Hertfordshire", "St Albans", "Watford", "Hemel Hempstead", "Tring", "London"],
  "hackney": ["East London", "Shoreditch", "Islington", "Stratford", "Central London"],
  "shoreditch": ["East London", "Hackney", "Islington", "City of London", "Central London"],
  "mayfair": ["Central London", "Westminster", "Marylebone", "Kensington", "Chelsea"],
  "london": ["Central London", "North London", "East London", "South London", "West London", "Hertfordshire"],
  "st albans": ["Hertfordshire", "Harpenden", "Watford", "Hatfield", "Hemel Hempstead"],
};


function suggestLocations(place) {
  const k = String(place || "").toLowerCase();
  const hit = Object.keys(LOCATION_NEIGHBOURS).find(key => k.includes(key));
  return hit ? LOCATION_NEIGHBOURS[hit] : (k.trim() ? ["London", "Central London", "Hertfordshire"] : []);
}






/* Coming Soon — every agreed future feature, locked, with its planned
   version. Target dates are added once agreed with the development team. */
const ROADMAP = [
  { id: "xp", title: "XP and community targets", version: "FF Team 1.1", note: "Personal and community targets that unlock new features." },
  { id: "svc_pro", title: "Professional Service Cards", version: "FF Team 1.2", note: "Packages and services professionals offer directly." },
  { id: "svc_co", title: "Company Service Cards", version: "FF Staff 1.1", note: "Your own services, listed on your Company Card." },
  { id: "gmaps", title: "Google Maps reviews", version: "FF Staff 1.1", note: "Post a company review to Google Maps in a tap." },
  { id: "party", title: "FF Party", version: "FF Party 1.0", note: "Service-led booking for people hosting events." },
  { id: "cocktails", title: "Cocktail Cards", version: "FF Team 1.3", note: "Signature and classic cocktails as cards." },
  { id: "vip", title: "FF VIP", version: "FF VIP 1.0", note: "A persistent customer profile." },
  { id: "menus", title: "Cocktail menus and shopping lists", version: "FF Party 1.1", note: "Pick cocktails for an event and get a shopping list." },
  { id: "auto", title: "Automatic staff assignment", version: "Later", note: "FireFlair fills a shift for you." },
  { id: "ch", title: "Companies House verification", version: "Later", note: "Verify your Company Card against the register." },
];


const roadmapItem = (id) => ROADMAP.find(r => r.id === id);


const DEMO_EVENTS = [
  { id: "evt_autumn", title: "Autumn Cocktail Party", iso: "2026-09-02", date: "2 September 2026", venue: "The Loft Lounge, Enfield", guests: "60", team: "2", notes: "Two-hour reception, then open bar." },
  { id: "evt_members", title: "Members' Night", iso: "2026-09-08", date: "8 September 2026", venue: "Mayfair Rooms", guests: "150", team: "1", notes: "" },
  { id: "evt_lunch", title: "Riverside Seated Lunch", iso: "2026-09-14", date: "14 September 2026", venue: "Riverside Pavilion", guests: "90", team: "1", notes: "" },
  { id: "evt_charl", title: "Charlotte House Reception", iso: "2026-09-21", date: "21 September 2026", venue: "Charlotte House", guests: "70", team: "1", notes: "" },
  { id: "evt_dryden", title: "Private Party — Enfield", iso: "2026-09-29", date: "29 September 2026", venue: "8 Dryden Road, Enfield", guests: "40", team: "2", notes: "" },
  { id: "evt_launch", title: "Brand Launch — Hackney", iso: "2026-10-11", date: "11 October 2026", venue: "Hackney Depot", guests: "180", team: "5", notes: "Press arrive at 18:00." },
  { id: "evt_wedding", title: "Rowntree Wedding", iso: "2026-11-15", date: "15 November 2026", venue: "Charlotte House", guests: "120", team: "3", notes: "Reception drinks then dinner service." },
  { id: "evt_xmas", title: "Loft Christmas Party", kind: "Christmas party", iso: "2026-12-12", date: "12 December 2026", start: "19:00", time: "19:00", venue: "The Loft Lounge, Enfield", guests: "90", team: "3", notes: "" },
  { id: "evt_nye", title: "New Year's Eve Gala", kind: "Private party", iso: "2026-12-31", date: "31 December 2026", start: "20:00", time: "20:00", venue: "Mayfair Rooms", guests: "200", team: "4", notes: "" },
  { id: "evt_vgala", title: "Vooshka Winter Gala", hirer: "Vooshka Cocktail Bar", kind: "Corporate event", iso: "2026-12-05", date: "5 December 2026", start: "18:00", time: "18:00", venue: "The Loft Lounge, Enfield", guests: "140", team: "1", notes: "Black tie. Champagne reception, then the signature menu." },
  { id: "evt_vdin", title: "Vooshka Private Dinner", hirer: "Vooshka Cocktail Bar", kind: "Private party", iso: "2026-12-19", date: "19 December 2026", start: "19:00", time: "19:00", venue: "Charlotte House, London", guests: "60", team: "1", notes: "Welcome cocktails, then a pairing menu." }
];


const DEMO_SHIFTS = __ff_json("content/data/demo-shifts.json");


const DEMO_ENGAGEMENTS = [
  { id: "eng_1", shiftId: "shf_1", staffId: "me", state: "paid" },
  { id: "eng_2", shiftId: "shf_2", staffId: "stf_tom", state: "paid" },
  { id: "eng_3", shiftId: "shf_3", staffId: "stf_mia", state: "signed_off" },
  { id: "eng_4", shiftId: "shf_4", staffId: "me", state: "completed" },
  { id: "eng_5", shiftId: "shf_5", staffId: "me", state: "confirmed" },
  { id: "eng_6", shiftId: "shf_5b", staffId: "stf_don", state: "confirmed" },
  { id: "eng_x1", shiftId: "shf_x1", staffId: "stf_sam", state: "confirmed" },
  { id: "eng_x2", shiftId: "shf_x2", staffId: "stf_fre", state: "requested", credit: true, sentAt: Date.now() - 6 * 3600000, expiresAt: Date.now() + 42 * 3600000 },
  { id: "eng_n1", shiftId: "shf_n1", staffId: "stf_pri", state: "confirmed" },
  { id: "eng_7", shiftId: "shf_6", staffId: "me", state: "requested", exclusive: true },
  { id: "eng_8", shiftId: "shf_6b", staffId: "stf_ava", state: "confirmed" },
  { id: "eng_9", shiftId: "shf_7", staffId: "stf_nia", state: "confirmed" },
  { id: "eng_10", shiftId: "shf_9", staffId: "me", state: "requested", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v1", shiftId: "shf_v1", staffId: "me", state: "requested", exclusive: true },
  { id: "eng_v2", shiftId: "shf_v2", staffId: "me", state: "requested", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v3", shiftId: "shf_v2", staffId: "stf_sam", state: "available", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v4", shiftId: "shf_v2", staffId: "stf_don", state: "available", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v5", shiftId: "shf_v2", staffId: "stf_ava", state: "available", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v6", shiftId: "shf_v2", staffId: "stf_fre", state: "available", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v7", shiftId: "shf_v2", staffId: "stf_leo", state: "requested", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v8", shiftId: "shf_v2", staffId: "stf_zar", state: "requested", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v9", shiftId: "shf_v2", staffId: "stf_jam", state: "unavailable", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v10", shiftId: "shf_v2", staffId: "stf_osc", state: "requested", auto: true, batch: 1, batchSize: 10 },
  { id: "eng_v11", shiftId: "shf_v2", staffId: "stf_mia", state: "requested", auto: true, batch: 1, batchSize: 10 }
].map((e) => ({ ...e, sentAt: Date.now() - 6 * 3600000, expiresAt: Date.now() + RESPONSE_MS - 6 * 3600000, ...e.auto ? { selectBy: Date.now() + 7 * 86400000 - 6 * 3600000, thread: [] } : { thread: [] }, history: [{ state: e.state, at: Date.now() }] }));



const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];




/* A worked demo profile: multiple professions (more than the three the card
   shows), skills with written content, a qualification carrying a document. */
const DEMO_RECORDS = () => {
  const R = emptyRecords();
  const add = (cat, name, extra) => R[cat].push({ ...makeRecord(cat, name), ...extra });

  add("professions", "Cocktail Bartender", { primary: true, description: "Eight years behind high-volume and premium bars across London." });
  add("professions", "Bar Manager", { primary: true, description: "Stock, rotas and compliance for a 14-person bar team." });
  add("professions", "Flair Bartender", { primary: true, description: "Performance bartending for launches and private events." });
  add("professions", "Bar Consultant", { description: "Menu builds and opening support for new sites." });
  add("professions", "Trainer", { description: "Cocktail and service training for new starters." });

  add("skills", "Cocktail Mixology", { primary: true, description: "Classic and modern cocktail service to a signature list, built around speed without losing accuracy. Comfortable designing a four-to-six drink menu for an event and batching it for volume." });
  add("skills", "Flair Bartending", { primary: true, description: "Working flair for live audiences — bottle and tin work built into normal service rather than a separate show." });
  add("skills", "Bar Management", { primary: true, description: "Ordering, stock control, cellar management, rotas and licensing compliance." });
  add("skills", "Classic Drinks", { description: "Full classic repertoire, spec-accurate and consistent." });
  add("skills", "Batch & Prep", { description: "Pre-batching for events of 150+ with consistent dilution and hold times." });

  add("cocktails", "Hackney Negroni", { primary: true, glass: "rocks", description: "A Negroni with a shot of cold brew. The house pour at our launch nights.",
    ingredients: "25ml gin\n25ml Campari\n25ml sweet vermouth\n10ml cold brew coffee\nGarnish: orange zest" });
  add("interests", "Cocktails", { primary: true, description: "Collecting and rebuilding pre-Prohibition specs — mostly for the reading rather than the drinking." });
  add("interests", "Music", { primary: true, description: "I play bass in a covers band and we play four or five live dates a year. Most of my event contacts started as people I met through gigs." });
  add("interests", "Travel", { primary: true, description: "Bar-hopping research trips. Barcelona and Mexico City are the two that changed how I build a menu." });
  add("interests", "Food", { description: "Pairing drinks to menus with the kitchen rather than around it." });

  add("locations", "Central London", { primary: true });
  add("locations", "North London", { primary: true });
  add("locations", "Enfield", { primary: true });
  add("locations", "East London", {});

  add("languages", "English", { primary: true, proficiency: "Native" });
  add("languages", "Spanish", { primary: true, proficiency: "Conversational", description: "Learned working a season in Barcelona. Good enough for service and for a kitchen handover." });

  add("qualifications", "Personal Licence", { description: "Issued by Enfield Council. Valid and current.", document: { name: "personal-licence.pdf", size: 184320, type: "application/pdf", dataUrl: null } });
  add("qualifications", "WSET Level 2", { description: "Wines and spirits, merit pass." });

  add("experience", "The Loft Lounge — Head Bartender", { description: "2022–2025. Ran the bar team, built the seasonal cocktail menus and managed supplier relationships." });
  add("venues", "The Loft Lounge", { address: "Enfield, London", description: "Head bartender 2022–2025." });
  add("venues", "Mayfair Rooms", { address: "Mayfair, London W1", description: "Members' club bar." });
  add("venues", "Hackney Depot", { address: "Hackney, London E8", description: "Launch events and festival bars." });

  add("experience", "Mayfair Rooms — Bartender", { description: "2019–2022. Members' club service, high-spec classics." });
  return R;
};



/* ==========================================================================
   XP — configurable, not hardcoded behaviour.
   Every standard task is worth XP_VALUES.task; answering a Question Card is
   worth XP_VALUES.question. Values live in data so Core can serve them later.
   Each task is claimable ONCE: claims are recorded in profile.xpClaimed and
   every award is written to profile.xpLog, so nothing can be claimed twice.
   ========================================================================== */
const XP_VALUES = { task: 10, question: 1 };



const XP_TASKS = [
  { id: "create_card",        label: "Create your profile card", hint: "Build your card in Profile" },
  { id: "publish_profile",    label: "Share your Profile Card",  hint: "Send it to yourself on WhatsApp" },
  { id: "add_professions",    label: "Add a profession",         hint: "Tell people what you do" },
  { id: "add_skills",         label: "Add skills",               hint: "What you're good at" },
  { id: "add_interests",      label: "Add interests",            hint: "What you're into" },
  { id: "add_languages",      label: "Add languages",            hint: "What you speak" },
  { id: "add_locations",      label: "Add work locations",       hint: "Where you work" },
  { id: "add_qualifications", label: "Add a qualification",      hint: "Licences and certificates" },
  { id: "add_experience",     label: "Add experience",           hint: "Where you've worked" },
  { id: "first_review",       label: "Receive a review",         hint: "Ask someone you've worked with" },
].map(t => ({ ...t, xp: XP_VALUES.task }));



const xpTaskFor = (category) => `add_${category}`;



/* ==========================================================================
   QUESTION CARDS — internal profile data, not the public card.
   Expandable: add an entry and the card, the sheet and the XP all follow.
   `public: false` means the answer informs FireFlair (matching, staffing,
   search) without being published on the person's card.
   ========================================================================== */
/* QUESTION CARDS — Version 1 (FF Team Reference v1.6 §4–7).
   10 launch questions: 5 Freelancer (key "generic"), 5 Feedback. Structured answers wherever
   possible; each category has its own colour. Feedback is product research
   and is stored apart from the professional profile (state.feedback).
   FireFlair can add further cards ("ai") from CV or free-text information that
   fits no existing profile category — stored on the profile (aiQuestions).
   Extensible: profession-specific, user-created and FF Staff / FF Party
   questions are later additions of new groups, not a new system. */
const QUESTION_GROUPS = [
  { key: "generic",  label: "Freelancer" },
  { key: "feedback", label: "Feedback" },
  { key: "ai",       label: "FireFlair" },
];



const QUESTION_GROUP_COLOR = {
  generic:  { bg: "linear-gradient(165deg,#132435,#080F18)", ink: "#EAF2FA", sub: "#8FB9DE", rule: "rgba(143,185,222,.32)" }, // cool blue
  feedback: { bg: "linear-gradient(165deg,#241533,#0F0919)", ink: "#F3EDFA", sub: "#C4A3E8", rule: "rgba(196,163,232,.32)" }, // purple
  ai:       { bg: "linear-gradient(165deg,#3A2712,#1B1108)", ink: "#FBF0DE", sub: "#E0B274", rule: "rgba(224,178,116,.34)" }, // amber
  personal: { bg: "linear-gradient(165deg,#232323,#101010)", ink: "#F0EFEC", sub: "#C6C2BA", rule: "rgba(198,194,186,.28)" },
  asked:    { bg: "linear-gradient(165deg,#3E1424,#18070C)", ink: "#FBEFF2", sub: "#E9BAC5", rule: "rgba(233,186,197,.30)" }, // burgundy: asked on a profile
  hiring:   { bg: "linear-gradient(165deg,#2E2614,#110D06)", ink: "#FBF3DF", sub: "#E5C77A", rule: "rgba(229,199,122,.32)" }, // gold: a company's hiring questions
};


const questionGroupColor = (key) => QUESTION_GROUP_COLOR[key] || QUESTION_GROUP_COLOR.personal;



const QUESTIONS = [
  { id: "g_travel",    group: "generic", type: "choice", text: "How do you normally travel to events?", options: ["I drive", "Public transport", "Other"] },
  { id: "g_freelance", group: "generic", type: "choice", text: "Are you available for freelance work?", options: ["Yes", "No", "Sometimes"] },
  { id: "g_equipment", group: "generic", type: "choice", text: "Do you have your own professional equipment?", options: ["Yes", "Some", "No", "Not applicable"] },
  { id: "g_notice",    group: "generic", type: "choice", text: "Are you available for short-notice work?", options: ["Yes", "No", "I require notice"],
    detail: { option: "I require notice", label: "How much notice do you need?", placeholder: "e.g. 48 hours" } },
  { id: "g_events",    group: "generic", type: "choice", text: "Do you have event experience?", options: ["Yes", "No"] },

  { id: "f_ease",      group: "feedback", type: "choice", text: "How easy was it to create your FF Team profile?", options: ["Very easy", "Easy", "Okay", "Difficult", "Very difficult"] },
  { id: "f_confusing", group: "feedback", type: "choice", text: "Was anything confusing when creating your profile?", options: ["Yes", "No"],
    detail: { option: "Yes", label: "What was confusing? (optional)", placeholder: "Tell us what tripped you up", optional: true } },
  { id: "f_useful",    group: "feedback", type: "choice", text: "How useful do you think your FF Team profile will be?", options: ["Very useful", "Useful", "Not sure", "Not very useful", "Not useful"] },
  { id: "f_cv",        group: "feedback", type: "choice", text: "Would you use your FF Team profile as your professional CV?", options: ["Yes", "Maybe", "No"] },
  { id: "f_improve",   group: "feedback", type: "text", text: "What could FireFlair do to make your FF Team profile more useful?", placeholder: "Anything at all" },
].map(q => ({ ...q, public: false, xp: XP_VALUES.question }));



/* Every Question Card this person has: the launch set plus FireFlair's. */
function allQuestions(state) {
  const ai = (state.profile.aiQuestions || []).map(q => ({ type: "choice", options: ["Yes", "No"], ...q, group: "ai", public: false, xp: q.mine ? 0 : XP_VALUES.question }));
  return [...QUESTIONS, ...ai];
}


function answerOf(state, q) {
  if (!q) return undefined;
  if (q.group === "feedback") return (state.feedback || {})[q.id];
  if (q.group === "ai") { const a = (state.profile.aiQuestions || []).find(x => x.id === q.id); return a ? a.answer : undefined; }
  return (state.profile.answers || {})[q.id];
}


const isAnswered = (v) => v !== undefined && v !== null && v !== "";
