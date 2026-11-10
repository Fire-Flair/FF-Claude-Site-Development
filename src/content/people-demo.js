/* src/content/people-demo.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const FACE_PHOTOS = __ff_json("content/data/face-photos.json");



const staff = (o) => ({
  id: uid("stf"), tier: "standard", level: 3, rating: null, reviews: 0, hasCar: false,
  interests: [], qualifications: [], languages: ["English"], locations: ["London"], availability: "open",
  photo: FACE_PHOTOS[o.id] || avatarFor(o.name), theme: themeFor(o.name), ...o,
});



const DIRECTORY = [
  staff({ id: "stf_sam", qualifications: ["WSET Level 2 Spirits", "Personal Licence"], name: "Sammy Mridha", tag: "SAMMY", profession: "Cocktail Bartender", group: "Bartenders", tier: "gold", level: 5, years: 8, rating: 4.9, reviews: 47, skills: ["Cocktail Mixology", "Flair Bartending", "Service"], interests: ["Cocktails", "Music", "Travel"], languages: ["English", "Spanish"], locations: ["Central London", "North London"], hasCar: true }),
  staff({ id: "stf_don", qualifications: ["WSET Level 2 Spirits"], name: "Don Gee", tag: "DONGE", profession: "Cocktail Bartender", group: "Bartenders", tier: "silver", level: 4, years: 5, rating: 4.7, reviews: 28, skills: ["Classic Cocktails", "Spirits Knowledge"], interests: ["Whisky", "Food"], languages: ["English", "Italian"], locations: ["East London"] }),
  staff({ id: "stf_ava", qualifications: ["WSET Level 2 Wine"], name: "Ava Clarke", tag: "AVA03", profession: "Senior Bartender", group: "Bartenders", tier: "silver", level: 4, years: 6, rating: 4.8, reviews: 31, skills: ["Craft Beer", "Cocktails"], interests: ["Brewing", "Cycling"], languages: ["English", "French"], locations: ["Central London"], hasCar: true }),
  staff({ id: "stf_leo", name: "Leo Patel", tag: "LEO09", profession: "Bartender", group: "Bartenders", tier: "bronze", level: 3, years: 3, rating: 4.5, reviews: 14, skills: ["Cocktails", "Wine"], interests: ["Football", "Music"], languages: ["English", "Hindi"], locations: ["West London"], availability: "tentative" }),
  staff({ id: "stf_mia", qualifications: ["WSET Level 1 Wine"], name: "Mia Santos", tag: "MIAS1", profession: "Silver Service Waiter", group: "Waiters", tier: "gold", level: 5, years: 7, rating: 4.9, reviews: 39, skills: ["Silver Service", "Fine Dining"], interests: ["Food", "Art"], languages: ["English", "Portuguese"], locations: ["Central London"] }),
  staff({ id: "stf_jam", name: "James Wright", tag: "JAMEW", profession: "Waiter", group: "Waiters", tier: "silver", level: 3, years: 4, rating: 4.6, reviews: 21, skills: ["Banqueting", "Service"], interests: ["Running"], languages: ["English"], locations: ["South London"] }),
  staff({ id: "stf_zar", name: "Zara Ahmed", tag: "ZARA7", profession: "Waiter", group: "Waiters", tier: "silver", level: 3, years: 2, rating: 4.4, reviews: 9, skills: ["Canapé Service"], interests: ["Photography"], languages: ["English", "Arabic"], locations: ["North London"] }),
  staff({ id: "stf_fre", name: "Freya Lind", tag: "FREYA", profession: "Cocktail Bartender", group: "Bartenders", tier: "standard", level: 3, years: 2, rating: 4.6, reviews: 11, skills: ["Batch Cocktails", "Prep"], interests: ["Cycling", "Coffee"], languages: ["English", "Swedish"], locations: ["North London"] }),
  staff({ id: "stf_osc", qualifications: ["WSET Level 2 Wine", "Personal Licence"], name: "Oscar Nunes", tag: "OSCAR", profession: "Silver Service Waiter", group: "Waiters", tier: "bronze", level: 4, years: 6, rating: 4.7, reviews: 24, skills: ["Silver Service", "Wine Service"], interests: ["Football", "Food"], languages: ["English", "Portuguese"], locations: ["East London"], hasCar: true }),
  staff({ id: "stf_nia", name: "Nia Okafor", tag: "NIAOK", profession: "Event Host", group: "Hosts", tier: "bronze", level: 4, years: 5, rating: 4.8, reviews: 18, skills: ["Guest Relations", "Registration"], interests: ["Theatre"], languages: ["English", "French"], locations: ["Central London"], hasCar: true }),
  staff({ id: "stf_pri", name: "Priya Raman", tag: "PRIYA", profession: "MC & Event Host", group: "Hosts", tier: "gold", level: 5, years: 8, rating: 4.9, reviews: 44, skills: ["Hosting", "Public Speaking"], interests: ["Events", "People"], languages: ["English", "Hindi"], locations: ["Central London", "West London"] }),
  staff({ id: "stf_tom", name: "Tom Beatson", tag: "TOMBE", profession: "DJ & Music Producer", group: "DJs & music", tier: "gold", level: 5, years: 9, rating: 4.9, reviews: 52, skills: ["Mixing", "Beatmatching"], interests: ["Music", "Technology"], languages: ["English", "Spanish"], locations: ["Central London"], hasCar: true }),
  staff({ id: "stf_mar", name: "Marco Ruiz", tag: "MARCO", profession: "DJ", group: "DJs & music", tier: "silver", level: 4, years: 6, rating: 4.7, reviews: 30, skills: ["House", "Open Format"], interests: ["Vinyl", "Travel"], languages: ["English", "Spanish"], locations: ["East London"] }),
  staff({ id: "stf_ell", name: "Elle Fontaine", tag: "ELLEF", profession: "DJ & Saxophonist", group: "DJs & music", tier: "bronze", level: 4, years: 4, rating: 4.8, reviews: 16, skills: ["Live Sax", "Deep House"], interests: ["Jazz", "Fashion"], languages: ["English", "French"], locations: ["West London"], hasCar: true }),
  staff({ id: "stf_idr", qualifications: ["Food Hygiene Level 3"], name: "Idris Bello", tag: "IDRIS", profession: "Head Chef", group: "Chefs", tier: "gold", level: 5, years: 12, rating: 4.9, reviews: 61, skills: ["Menu Design", "Live Cooking"], interests: ["Markets", "Travel"], languages: ["English", "French"], locations: ["South London"], hasCar: true }),
  staff({ id: "stf_han", name: "Hana Kim", tag: "HANAK", profession: "Pastry Chef", group: "Chefs", tier: "silver", level: 4, years: 7, rating: 4.8, reviews: 27, skills: ["Desserts", "Canapés"], interests: ["Baking", "Design"], languages: ["English", "Korean"], locations: ["Central London"] }),
  staff({ id: "stf_jon", name: "Jonah Reed", tag: "JONAH", profession: "Event Photographer", group: "Photographers", tier: "silver", level: 4, years: 5, rating: 4.7, reviews: 22, skills: ["Reportage", "Portraits"], interests: ["Film", "Cities"], languages: ["English"], locations: ["North London"], hasCar: true }),
  staff({ id: "stf_ama", name: "Amara Diallo", tag: "AMARA", profession: "Photographer & Content", group: "Photographers", tier: "bronze", level: 3, years: 3, rating: 4.6, reviews: 13, skills: ["Social Content", "Editing"], interests: ["Art", "Music"], languages: ["English", "French"], locations: ["East London"] }),
];



/* Demo fill-out: About text and a few gallery photos per dummy profile. */
const DEMO_ABOUT = {
  stf_sam: "Eight years behind the bar, from Soho cocktail dens to festival main stages. I love a busy night, a good flair routine and a guest who lets me pick their drink.",
  stf_don: "Classic cocktails and whisky are my thing. Calm under pressure, tidy station, and I'll talk you through the back bar if you let me.",
  stf_ava: "Senior bartender who came up through craft beer bars. I run a clean, fast bar and look after the team as much as the guests.",
  stf_leo: "Three years bartending across West London venues and private parties. Friendly, quick to learn and always up for a late finish.",
  stf_mia: "Silver service waiter with seven years in fine dining and high-end weddings. Detail-obsessed, warm with guests and happiest on a big formal night.",
  stf_jam: "Banqueting and event waiter based in South London. Reliable, punctual and used to working big rooms with tight timings.",
  stf_zar: "Canapé and floor service for launches and private events. Outside of shifts you'll find me with a camera somewhere in London.",
  stf_fre: "Batch cocktails, prep and keeping the bar stocked so the night runs smoothly. Coffee nerd, keen cyclist.",
  stf_osc: "Silver service and wine service, with my Personal Licence and WSET 2. I drive, so early starts and out-of-town jobs are no problem.",
  stf_nia: "Event host and registration lead. First face your guests see, and I make sure it's a good one.",
  stf_pri: "MC and event host for awards nights, corporate dinners and weddings. Eight years on the mic and still love every minute.",
  stf_tom: "DJ and producer with nine years playing private events, brand launches and clubs. I read the room and keep the floor full.",
  stf_mar: "House and open-format DJ from East London. Vinyl collector, happiest playing the last two hours of a long night.",
  stf_ell: "DJ and live saxophonist. Deep house with live sax over the top, made for rooftop parties and late receptions.",
  stf_idr: "Head chef with twelve years in restaurants and event kitchens. Menu design, live cooking stations and feeding a few hundred without breaking a sweat.",
  stf_han: "Pastry chef specialising in desserts and sweet canapés for weddings and launches. Design-minded and a bit of a perfectionist.",
  stf_jon: "Reportage and portrait photographer for events across London. Candid shots, quick turnaround, and I stay out of the way.",
  stf_ama: "Photographer and content creator. I shoot and edit social-ready content on the night so brands can post before the party ends.",
};


const DEMO_GALLERY = {
  Bartenders: ["training_mixology", "dream_after_dark", "training_cocktail_basics", "dream_flair_jobs", "training_ff_open_bar", "reward_bar_shows"],
  Waiters: ["dream_international_events", "training_wine_qualification", "dream_food_festivals_markets"],
  Hosts: ["dream_international_events", "teams", "dream_sports_events"],
  "DJs & music": ["dream_music_festivals", "dream_after_dark", "dream_yacht_jobs", "reward_ff_party", "dream_flair_jobs"],
  Chefs: ["dream_food_festivals_markets", "training_masterclass", "dream_international_events"],
  Photographers: ["reward_photoshoot", "dream_motorsport", "dream_music_festivals"],
};


DIRECTORY.forEach((p) => {
  if (!p.about)
    p.about = DEMO_ABOUT[p.id] || "";
  if (!(p.media || []).length)
    p.media = (DEMO_GALLERY[p.group] || []).map((k) => (window.FF_IMG || {})[k] ? { id: "dm_" + p.id + "_" + k, name: "", dataUrl: window.FF_IMG[k] } : null).filter(Boolean);
});



/* Venues and companies are organisations — landscape cards, never 5:7. */
const VENUES = [
  { id: "ven_loft", name: "The Loft Lounge", kind: "Cocktail bar", area: "Enfield", tag: "LOFTL", tier: "gold" },
  { id: "ven_hack", name: "Hackney Depot", kind: "Warehouse venue", area: "East London", tag: "HACKD", tier: "silver" },
  { id: "ven_mayf", name: "Mayfair Rooms", kind: "Private members", area: "Central London", tag: "MAYFR", tier: "gold" },
  { id: "ven_river", name: "Riverside Pavilion", kind: "Marquee & garden", area: "South London", tag: "RIVER", tier: "bronze" },
  { id: "ven_char", name: "Charlotte House", kind: "Townhouse", area: "West London", tag: "CHARH", tier: "silver" },
  { id: "ven_north", name: "Northbank Studio", kind: "Production space", area: "North London", tag: "NRTHS", tier: "standard" },
];
