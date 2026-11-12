/* src/state/professions.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* PROFESSIONS — FF Team Profession & Question Reference v1.6.
   People choose professions, never categories. The system assigns each
   profession to one of seven display categories; the person's top (first)
   profession decides where they appear on Network. Five suggestions per
   category for quick picking; any profession can be typed in. */
const PROFESSION_CATEGORIES = [
  { key: "Bar",            suggested: ["Barback", "Bartender", "Cocktail Bartender", "Flair Bartender", "Mixologist"] },
  { key: "Front of House", suggested: ["Waiter", "Host", "Front of House", "Event Host", "Catering Assistant"] },
  { key: "Management",     suggested: ["Event Manager", "Event Planner", "Bar Manager", "Floor Manager", "Kitchen Manager"] },
  { key: "Entertainment",  suggested: ["DJ", "Saxophonist", "Violinist", "Singer", "Magician"] },
  { key: "Services",       suggested: ["Photographer", "Videographer", "Content Creator", "Influencer", "Event Stylist"] },
  { key: "Chefs",          suggested: ["Chef", "Private Chef", "Event Chef", "Sous Chef", "Caterer"] },
  { key: "Back of House",  suggested: ["Stock Manager", "Stock Controller", "Kitchen Porter", "Kitchen Assistant", "Logistics Assistant"] },
];


const CATEGORY_ORDER = [...PROFESSION_CATEGORIES.map(c => c.key), "Other"];


/* Assignment for professions outside the suggestion lists. Checked in this
   order, so "Bar Manager" is Management and "Kitchen Porter" Back of House. */
const PROFESSION_RULES = [
  ["Management", /\b(manager|planner|coordinator|director|supervisor)\b/],
  ["Back of House", /\b(stock|porter|kitchen assistant|logistics|cellar)\b/],
  ["Bar", /\b(bar|bartend\w*|mixolog\w*|barback|barista|sommelier)\b/],
  ["Chefs", /\b(chef|cook|caterer|pastry|baker)\b/],
  ["Front of House", /\b(waiter|waitress|host|hostess|front of house|server|catering assistant|usher|runner)\b/],
  ["Entertainment", /\b(dj|music\w*|singer|sax\w*|violin\w*|magician|mc|band|performer|dancer|entertainer)\b/],
  ["Services", /\b(photo\w*|video\w*|content|influencer|stylist|florist|make-?up|decor\w*)\b/],
];


/* Category for one profession; null when it can't be determined (FireFlair then
   asks the person to confirm). An explicit override always wins. */
function professionCategory(name, override) {
  if (override) return override;
  const n = String(name || "").trim().toLowerCase();
  if (!n) return null;
  const exact = PROFESSION_CATEGORIES.find(c => c.suggested.some(x => x.toLowerCase() === n));
  if (exact) return exact.key;
  const rule = PROFESSION_RULES.find(([, re]) => re.test(n));
  return rule ? rule[0] : null;
}


/* Stable profession id (v17.4.6): "prof." + the name in lower case with dashes, the same for the catalogue
   and for typed professions. Q&A answers (preferred rates) are keyed by it. */
const professionId = (name) => "prof." + String(name || "").trim().toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");


const personCategory = (p) => professionCategory(p.profession, p.categoryOverride) || "Other";



const GROUP_ICON = {
  Bar: Martini, "Front of House": Users, Chefs: ChefHat, Management: Briefcase,
  Entertainment: Music, Services: Camera, "Back of House": Bookmark, Other: Users,
};


function GroupIcon({ group, size = 15, color = "var(--gold-dk)" }) {
  const I = GROUP_ICON[group] || Users;
  return <I size={size} color={color} strokeWidth={1.6} />;
}



const CAT_ICON = {
  profession: Briefcase, professions: Briefcase, skills: SlidersHorizontal, interests: Heart,
  location: MapPin, locations: MapPin, languages: MessageSquare, tag: Hash, level: Award,
  experience: Clock, qualification: ShieldCheck, qualifications: ShieldCheck, employer: Briefcase,
  review: Award, reviews: Award, media: Camera, venue: MapPin, venues: MapPin,
  cocktails: Martini, cocktail: Martini,
};


function CatIcon({ kind, size = 14, color }) {
  const I = CAT_ICON[kind] || Briefcase;
  return <I size={size} strokeWidth={1.6} color={color} style={{ flex: "none" }} />;
}




/* ---- Bottom-navigation marks -------------------------------------------
   Small drawn FireFlair pieces, not generic app glyphs. Stroked in the
   restrained palette (white / gold / silver), no coloured disc behind. */
function NavMark({ shape, size = 23, tone = "#F2F0EA" }) {
  const p = { fill: "none", stroke: tone, strokeWidth: 1.5, strokeLinejoin: "round", strokeLinecap: "round" };
  const inner = { fill: "none", stroke: tone, strokeWidth: 1.2, opacity: .75, strokeLinecap: "round" };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      {shape === "home" && (<>
        <path d="M3.4 10.6 12 3.6l8.6 7v9.2a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1z" {...p} />
        <path d="M9.4 20.8v-6.2h5.2v6.2" {...p} />
        <path d="M12 3.6v1.2" {...inner} />
      </>)}
      {shape === "network" && (<>
        <circle cx="12" cy="8.1" r="2.5" {...p} />
        <path d="M7.4 18.8c.7-2.9 2.3-4.4 4.6-4.4s3.9 1.5 4.6 4.4" {...p} />
        <circle cx="4.6" cy="10.3" r="1.9" {...inner} />
        <path d="M1.6 18.2c.5-2.2 1.6-3.3 3-3.4" {...inner} />
        <circle cx="19.4" cy="10.3" r="1.9" {...inner} />
        <path d="M22.4 18.2c-.5-2.2-1.6-3.3-3-3.4" {...inner} />
      </>)}
      {shape === "bookings" && (<>
        <rect x="3.6" y="5.2" width="16.8" height="14.6" rx="1.4" {...p} />
        <path d="M3.6 9.4h16.8" {...p} />
        <path d="M7.8 3.4v3.4M16.2 3.4v3.4" {...p} />
        <path d="M12 12.4l1.5 1.5-1.5 1.5-1.5-1.5z" {...inner} />
      </>)}
      {shape === "profile" && (<>
        <rect x="5" y="3.2" width="14" height="17.6" rx="1.4" {...p} />
        <circle cx="12" cy="9.6" r="2.6" {...p} />
        <path d="M8.1 16.6c.7-1.9 2.1-2.9 3.9-2.9s3.2 1 3.9 2.9" {...p} />
        <path d="M6.6 5v1M17.4 19v-1" {...inner} />
      </>)}
    </svg>
  );
}



/* "Add FireFlair" — a distinct mark from the central FireFlair coin. A gold
   outline chat-bubble (WhatsApp-shaped silhouette) carrying "FF", used ONLY
   for the Add FireFlair action. The circular coin/emblem is never touched or
   reused here — the two must stay visually unmistakable from each other. */
/* Drawn in place rather than taken from the icon library, so these two
   controls can never show up blank. */
function MicGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      <rect x="9" y="2.5" width="6" height="12" rx="3" />
      <path d="M19 10.5v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18.5V22M8.5 22h7" />
    </svg>
  );
}


function CameraPlusGlyph({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 1 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block" }}>
      <path d="M4 8.5h2.6L8.3 6h7.4l1.7 2.5H20a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 20 20H4a1.5 1.5 0 0 1-1.5-1.5V10A1.5 1.5 0 0 1 4 8.5Z" />
      <circle cx="12" cy="14" r="3.4" />
    </svg>
  );
}



function AddFireFlairMark({ size = 22, tone = "var(--gold)" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
      <path d="M12 3.4c5 0 9 3.4 9 7.6 0 4.2-4 7.6-9 7.6-1 0-2-.13-2.9-.4L4.8 20l1-3.5C4.7 15 3 13.1 3 11c0-4.2 4-7.6 9-7.6z"
        fill="none" stroke={tone} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <text x="12" y="13.6" textAnchor="middle" fontFamily="var(--display)" fontSize="8" fontWeight="600" fill={tone} letterSpacing=".01em">FF</text>
      <path d="M9 8.6h6M9 15.6h3.4" stroke={tone} strokeWidth="1" opacity=".5" strokeLinecap="round" />
    </svg>
  );
}
