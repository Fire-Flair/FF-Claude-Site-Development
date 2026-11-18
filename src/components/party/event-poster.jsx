/* src/components/party/event-poster.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* --- FF Party ------------------------------------------------------------ */
const PARTY_OCCASIONS = ["Wedding", "Birthday", "Cocktail party", "Christmas party", "Summer party", "Brand launch", "Corporate event", "Hen or stag"];


const EC_BG = __ff_json("content/data/ec-bg.json");


const EVENT_THEMES = [
  { key: "onyx", name: "Onyx", dark: true, bg: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='58' height='42'><text x='0' y='30' font-family='Georgia,serif' font-style='italic' font-size='26' fill='%23C9A227' fill-opacity='0.045'>FF</text></svg>") 0 0 / 58px 42px repeat, radial-gradient(120% 80% at 50% 0%, #2B2A2E, #0A0A0B 72%)`, swatch: "#141416" },
  { key: "ivory", name: "Ivory", dark: false, bg: "linear-gradient(170deg,#FFFDF7,#F3EAD6)", swatch: "#F5EDDA" },
  { key: "burgundy", name: "Burgundy", dark: true, bg: `url(${EC_BG.monogram}) 0 0 / 64px 46px repeat, radial-gradient(120% 80% at 50% 0%, #7A1B30, #2A0710 72%)`, swatch: "#4E1220" },
  { key: "confetti", name: "Gold Confetti", dark: true, bg: `url(${EC_BG.confetti}) 0 0 / 200px 200px repeat, linear-gradient(170deg,#18181D,#08080A)`, swatch: "linear-gradient(135deg,#0B0B0C 45%,#E8C75E)" },
  { key: "champagne", name: "Champagne", dark: false, bg: `url(${EC_BG.bubbles}) 0 0 / 180px 180px repeat, linear-gradient(165deg,#FAEDC6,#E6CA7C 60%,#D2AE48)`, swatch: "linear-gradient(135deg,#FAEDC6,#D2AE48)" },
];


const eventThemeOf = (card) => EVENT_THEMES.find(t => t.key === (card && card.theme)) || EVENT_THEMES[0];



const emptyEventCard = () => ({ theme: "onyx", occasion: "Wedding", title: "", subtitle: "", note: "", guests: "", venue: "", area: "", iso: "", start: "", end: "", host: "", roles: ["Bartender"] });



/* One search text per person, shared by the Network search and the FF Party
   search: name, tag, professions, skills, interests, qualifications,
   languages and areas. */
function personSearchText(p) {
  return [p.name, p.tag, p.profession, ...(p.professions || []), ...(p.skills || []), ...(p.interests || []),
    ...(p.qualifications || []), ...(p.languages || []), ...(p.locations || [])].join(" ").toLowerCase();
}




/* ==========================================================================
   FF PARTY SITE (v16.13) — FF Party is its own site, at ffparty.uk. It is a
   copy of FF Staff for people planning events: the same hirer account,
   booking bar, Network, Bookings and Profile, with the FF Party Event Card
   (the ffme.uk-style card) on its home page instead of FF Staff's white one.
   In the prototype both sites are role "staff"; state.site ("staff" or
   "party") decides which site you're on.
   ========================================================================== */
const hireSiteOf = (state) => (state.role === "staff" && state.site === "party")
  ? { key: "party", name: "FF Party", party: true, anchor: "ff-party-event" }
  : { key: "staff", name: "FF Staff", party: false, anchor: "ff-staff-event" };
