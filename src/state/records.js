/* src/state/records.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   3. DATA MODEL — records, not value-blobs.
   A profile is a set of Information Records grouped by category. Each record
   has its own identity, so the Profile Card can REFERENCE the primaries
   rather than duplicating their content. Categories live in a registry so
   new ones can be added later without redesigning the profile.
   ========================================================================== */

const uid = (p = "id") => `${p}_${Math.random().toString(36).slice(2, 8)}`;



/* Field capabilities per category. A category declares what it needs;
   nothing gets fields it has no use for. */
const BASE_CATEGORIES = {
  professions: {
    label: "Professions", singular: "Profession", icon: "profession",
    onCard: true, cardLimit: 3, fields: ["description", "media"],
    placeholder: "Cocktail Bartender",
  },
  qualifications: {
    label: "Qualifications", singular: "Qualification", icon: "qualification",
    onCard: false, fields: ["description", "document", "media"],
    placeholder: "Personal Licence",
  },
  skills: {
    label: "Skills", singular: "Skill", icon: "skills",
    onCard: true, cardLimit: 3, fields: ["description", "media"],
    placeholder: "Cocktail Mixology",
  },
  cocktails: {
    label: "Signature cocktails", singular: "Signature cocktail", cardLabel: "Signature", icon: "cocktails",
    onCard: false, fields: ["ingredients", "glass", "description", "media"],
    placeholder: "Smoked Maple Old Fashioned",
  },
  interests: {
    label: "Interests", singular: "Interest", icon: "interests",
    onCard: true, cardLimit: 3, fields: ["description", "media"],
    placeholder: "Music",
  },
  locations: {
    label: "Work locations", singular: "Location", icon: "location",
    onCard: true, cardLimit: 3, fields: ["description"],
    placeholder: "Central London",
  },
  languages: {
    label: "Languages", singular: "Language", icon: "languages",
    onCard: true, cardLimit: 5, fields: ["proficiency", "description", "media"],
    placeholder: "Spanish",
  },
  reviews: {
    label: "Reviews & References", singular: "Review", icon: "review",
    onCard: false, fields: ["rating", "description"], system: true,
    placeholder: "Reliable, great with guests",
  },
  experience: {
    label: "Experience", singular: "Experience", icon: "experience",
    onCard: false, fields: ["description", "media"],
    placeholder: "Your venue — Head Bartender",
  },
  media: {
    label: "Media", singular: "Media", icon: "media", mediaCard: true,
    onCard: false, fields: ["media", "document"], system: true,
    placeholder: "Summer launch, Hackney Depot",
  },
  venues: {
    label: "Venues", singular: "Venue", icon: "venue", landscape: true,
    onCard: false, fields: ["address", "description", "media"],
    placeholder: "Your venue",
  },
};



const REVIEW_MAX = 5;



/* PROFESSION LEVEL — each Profession Card carries its own level, 1–5, as
   record.level (null until chosen). It belongs to the profession, not the
   person: someone can be a Level 4 Cocktail Bartender and a Level 2 Flair
   Bartender. v16.11: shown as five diamonds in the top right of each
   Profession Card (grey until filled); never on the Profile Card. FireFlair
   will use it to pair Masters with Apprentices for training and mentorship. */
const PROFESSION_LEVELS = [
  { n: 1, title: "Apprentice" },
  { n: 2, title: "Developing" },
  { n: 3, title: "Professional" },
  { n: 4, title: "Expert" },
  { n: 5, title: "Master" },
];


const professionLevelTitle = (n) => (PROFESSION_LEVELS.find(l => l.n === n) || {}).title || null;



/* Categories shown on the Profile Card, in card order. */
const CARD_CATEGORIES = ["professions", "skills", "interests", "locations", "languages"];



const PROFICIENCY = ["Native", "Fluent", "Professional", "Conversational", "Basic"];



/* V1: FireFlair fixes the attribute order; people order the cards inside each. */
/* Phase 1: Qualifications above Skills, Venues straight after Experience,
   Work locations on their own; Signature cocktails held back (PHASE1). */
const categoryOrder = () => PHASE1.profileOrder.filter(k => BASE_CATEGORIES[k]);


const catHas = (def, field) => (def.fields || []).includes(field);



const makeRecord = (category, name, extra = {}) => ({
  id: uid("rec"),
  category,
  name: String(name || "").trim(),
  description: "",
  media: [],          // [{ id, name, dataUrl }]
  document: null,     // { name, size, type, dataUrl }
  proficiency: "",
  primary: false,
  proposed: false,    // true while awaiting user review (CV adapter)
  source: { origin: "manual", location: null, confidence: "confirmed" },
  ...extra,
});



const recsOf = (profile, cat) => (profile.records && profile.records[cat]) || [];



/* PROFILE FIRST. The profile holds everything the person has told
   FireFlair; the Profile Card shows the first cards in each attribute, in
   the order the person arranges them left to right. Hidden cards stay on
   the private profile but never take a place. Positions map to rank:
   1 = primary, 2-3 = secondary, 4+ = tertiary (profile only). */
const FEATURE_LIMIT = 3;


const cardRank = (i) => i === 0 ? "primary" : i < FEATURE_LIMIT ? "secondary" : "tertiary";


const visibleRecs = (profile, cat) => rankedRecords(recsOf(profile, cat)).filter(r => !r.proposed && !r.hidden);


function primaryNames(profile, cat, limit) {
  return visibleRecs(profile, cat).slice(0, Math.min(limit, FEATURE_LIMIT)).map(r => r.name).filter(Boolean);
}


const featuredCount = (profile, cat) => Math.min(FEATURE_LIMIT, visibleRecs(profile, cat).length);



const emptyRecords = () => Object.keys(BASE_CATEGORIES).reduce((m, k) => { m[k] = []; return m; }, {});



/* Read-only records synthesised for directory people, so that opening
   someone else's profile uses the same Information Card components. */
/* Reviews written ABOUT a person, newest first, shaped as records so they
   render through the same Information Card as everything else. */
function reviewRecordsFor(state, personId) {
  return (state.reviews || [])
    .filter(r => r.aboutId === personId)
    .sort((a, b) => b.at - a.at)
    .map(r => ({
      ...makeRecord("reviews", `${r.rating}★ from ${r.byName}`),
      id: r.id, description: r.text, rating: r.rating, primary: true, readOnly: true,
    }));
}



/* Demo only: filler text so dummy attribute cards show what a description looks like. */
const DEMO_ATTR_FILLER = [
  "Comfortable with this on busy shifts and private events.", "Picked up over years of event work across London.",
  "Something I bring to most bookings, big or small.", "Happy to talk this through before an event.",
  "Learned on the job and refined with every service.", "Clients often mention this in reviews.",
  "Still improving, and always keen to do more of it.", "Used at weddings, launches and corporate nights.",
];


const demoFiller = (seed) => { let h = 0; for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0; const F = DEMO_ATTR_FILLER; return F[h % F.length] + " " + F[(h + 3) % F.length]; };


function recordsForPerson(state, person) {
  if (person.id === "me") return { ...state.profile.records, reviews: reviewRecordsFor(state, "me") };
  const mk = (cat, arr) => (arr || []).filter(Boolean).map(n => ({
    ...makeRecord(cat, n), id: `${person.id}_${cat}_${String(n).replace(/\W+/g, "")}`,
    description: demoFiller(person.id + cat + n), primary: true, readOnly: true,
  }));
  return {
    professions: mk("professions", [person.profession]).map((r, i) => (i === 0 && person.level ? { ...r, level: person.level } : r)),
    skills: mk("skills", person.skills),
    interests: mk("interests", person.interests),
    locations: mk("locations", person.locations),
    languages: mk("languages", person.languages),
    qualifications: mk("qualifications", person.qualifications), reviews: reviewRecordsFor(state, person.id), experience: [],
    cocktails: DEMO_SIGNATURES.filter(x => x.by === person.id).map(x => ({ ...makeRecord("cocktails", x.name), id: x.id,
      ingredients: x.ingredients.join("\n"), glass: x.glass, description: x.description, primary: true, readOnly: true })),
  };
}



const THEME_KEYS = ["ivory", "onyx", "burgundy", "ivory"];


const themeFor = (seed) => {
  let h = 0; for (let i = 0; i < String(seed).length; i++) h = (h * 31 + String(seed).charCodeAt(i)) >>> 0;
  return THEME_KEYS[h % THEME_KEYS.length];
};
