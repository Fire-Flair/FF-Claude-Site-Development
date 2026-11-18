/* src/content/people-demo.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const FACE_PHOTOS = __ff_json("content/data/face-photos.json");



const staff = (o) => {
  const base = {
    id: uid("stf"), tier: cardTier17(o), level: 3, rating: null, reviews: 0, hasCar: false,
    interests: [], qualifications: [], languages: ["English"], locations: ["London"], availability: "open",
    photo: FACE_PHOTOS[o.id] || avatarFor(o.name), theme: themeFor(o.name), ...o,
  };
  /* v17.16: every entry shows with a capital on each word, whatever was saved. */
  ["professions", "skills", "interests", "locations", "languages", "qualifications"].forEach((k) => { if (Array.isArray(base[k])) base[k] = capList17(base[k]); });
  if (typeof base.profession === "string") base.profession = capWords17(base.profession);
  return base;
};



/* v17.12: the directory is the real FF Team members, from the live database (published FF Team profiles on FFTeam.uk).
   No ratings, reviews, levels or tiers are invented for them; photos come later (until then the card shows initials;
   Simao's supplied photo is used). The made-up demo profiles are gone. */
const REAL_MEMBERS = [
 {
  "id": "stf_alex",
  "real": true,
  "name": "Alexander Gagnon",
  "tag": "ALEX424",
  "profession": "Mixologist",
  "professions": [
   "Mixologist",
   "Bar Manager",
   "Bar Supervisor",
   "Bartender",
   "Sales Consultant",
   "Chef"
  ],
  "group": "Bartenders",
  "theme": "burgundy",
  "skills": [
   "Sales",
   "Compliance",
   "Management",
   "Business Development",
   "IT Skills",
   "Cocktail & Spirit Development"
  ],
  "interests": [
   "Travel",
   "Martial Arts",
   "Ancient History",
   "Technology",
   "Sustainability",
   "Mountain Biking",
   "Hiking",
   "Skiing"
  ],
  "languages": [
   "English",
   "French",
   "Spanish",
   "Greek"
  ],
  "locations": [
   "London",
   "Berkhamsted",
   "N15"
  ],
  "qualifications": [
   "WSET Levels; 2/3 in Spirits, 1 in Wine",
   "A-Levels Mathematics, Physics, Chemistry & Computing",
   "Bar Management Graduate Diageo Bar & Ananas Academies",
   "First Aid & Fire Marshal Certified",
   "Monkey Shoulder – Ultimate Bartender competition runner up",
   "Amsterdam Perfect Serve – Peroni Advanced Cocktail Competitor",
   "Asahi – Perfect Pint Award Winner"
  ],
  "workHistory": [
   {
    "title": "Freelance Event Mixologist",
    "start": "2017",
    "end": "2022"
   },
   {
    "title": "Hotel Bar Manager",
    "employer": "Oakman Inns",
    "start": "June",
    "end": "Nov of 2020"
   },
   {
    "title": "Bar Manager",
    "employer": "District Brasserie",
    "end": "2019"
   },
   {
    "title": "Cocktail Bar Supervisor",
    "employer": "Tobacco Docks",
    "location": "London, UK",
    "start": "2017",
    "end": "2019"
   },
   {
    "title": "Head Bartender",
    "employer": "Diamond Club at Emirates Stadium",
    "location": "London, UK",
    "end": "2018/19 Seasons"
   },
   {
    "title": "Bar Manager",
    "employer": "Twickenham Stadium",
    "location": "Twickenham, UK",
    "end": "2017/18 Seasons"
   },
   {
    "title": "Bar Supervisor",
    "employer": "The White Brasserie Company",
    "end": "2016/17"
   },
   {
    "title": "Bartender",
    "employer": "The Rising Sun Pub",
    "end": "2015"
   },
   {
    "title": "Sales Consultant",
    "employer": "Carphone Warehouse",
    "end": "2014"
   },
   {
    "title": "Chef",
    "employer": "Café Rouge",
    "end": "2013"
   }
  ],
  "about": "I strive for excellence; to be challenged and to achieve the highest standards possible. Every task I take on, I do so proudly with initiative, forethought & assertiveness. Teamwork makes the Dream Work; Staff welfare & development is essential to achieving a happy, driven & successful team. Ingenuity & Passion for creating an exceptional guest experience though genuine concerns, seasonal specials and prompt solutions."
 },
 {
  "id": "stf_gav",
  "real": true,
  "name": "Alexandru Gavrilas",
  "tag": "GAVRILAS",
  "profession": "Bartender",
  "professions": [
   "Bartender",
   "Head Bartender",
   "Assistant General Manager",
   "Floor Manager",
   "Barback",
   "Waiter",
   "Chef de Rang"
  ],
  "group": "Bartenders",
  "theme": "ivory",
  "skills": [
   "Leadership",
   "Guest-focused Customer Service",
   "Attention to Detail",
   "Compliance and Health & Safety",
   "Drink and Spirits Knowledge",
   "Problem Solving",
   "Team Awareness"
  ],
  "interests": [
   "Cooking",
   "Running",
   "Swimming",
   "Distance Racing / Triathlon Goal"
  ],
  "languages": [
   "Romanian",
   "English"
  ],
  "locations": [
   "London, UK",
   "Romania"
  ],
  "qualifications": [
   "WSET Wine & Spirits Level 2",
   "\"Tudor Vianu\" Theoretical High School, Giurgiu – Natural Sciences Profile",
   "Flair and bartending courses; regular seminars and masterclasses"
  ],
  "workHistory": [
   {
    "title": "Bartender",
    "employer": "Disrepute",
    "location": "London, UK",
    "start": "Oct 2025",
    "end": "Present"
   },
   {
    "title": "Head Bartender / Assistant General Manager",
    "employer": "Opium Cocktail & Dim Sum",
    "location": "London, UK",
    "start": "Jun 2022",
    "end": "Apr 2025"
   },
   {
    "title": "Bartender",
    "employer": "The Grove Hotel",
    "location": "London, UK",
    "start": "Jan 2022",
    "end": "Apr 2022"
   },
   {
    "title": "Bar Supervisor",
    "employer": "Embassy One",
    "location": "Bucharest, Romania",
    "start": "Sep 2020",
    "end": "Nov 2021"
   },
   {
    "title": "Bartender",
    "employer": "Beaverbrook Hotel",
    "location": "Epsom, UK",
    "start": "Aug 2019",
    "end": "Mar 2020"
   },
   {
    "title": "Bartender / Bar Supervisor / Chef de Rang",
    "employer": "Hotel Tresanton",
    "location": "St Mawes, UK",
    "start": "Mar 2018",
    "end": "Aug 2019"
   },
   {
    "title": "Waiter / Barback / Bartender",
    "employer": "Hanu' Berarilor Casa Oprea Soare",
    "location": "Bucharest, Romania",
    "start": "Jun 2014",
    "end": "Dec 2017"
   },
   {
    "title": "Freelance Bartender",
    "employer": "Freelance (various London venues)",
    "location": "London, UK"
   }
  ],
  "about": "Hospitality professional with experience across cocktail bars, luxury hotels and high-volume venues in the UK and Romania. Known for strong ownership, guest-focused service and the ability to adapt quickly while maintaining high standards behind the bar. Passionate about drinks, team development and creating memorable guest experiences."
 },
 {
  "id": "stf_bruno",
  "real": true,
  "name": "Bruno Cuartero",
  "tag": "CUARTERO",
  "profession": "Beverage / Bar Manager / Events",
  "professions": [
   "Beverage / Bar Manager / Events",
   "Mixologist",
   "Digital Marketing Specialist"
  ],
  "group": "Bartenders",
  "theme": "onyx",
  "skills": [
   "Manage Operations",
   "Customer Service",
   "Mixology",
   "Marketing",
   "Advanced Mixology",
   "Cocktail Production",
   "Large-scale Bar Operations",
   "Team Leadership",
   "Operational Planning",
   "Stock Control",
   "Digital Marketing"
  ],
  "interests": [
   "Music",
   "Films",
   "Travel",
   "Technology",
   "Sustainability",
   "Wine"
  ],
  "languages": [
   "English",
   "Spanish"
  ],
  "locations": [
   "London, UK"
  ],
  "qualifications": [
   "MSc Digital Marketing",
   "BA/BSc Joint Honours Business & Digital Media",
   "Personal Licence",
   "Driving licence"
  ],
  "workHistory": [
   {
    "title": "Hospitality, Beverage/Bar Manager",
    "employer": "Freelance",
    "location": "London, UK",
    "start": "October 2014",
    "end": "Present"
   },
   {
    "title": "Cocktail bartender / Supervisor / Assistant Manager",
    "location": "London, UK",
    "start": "2004",
    "end": "2014"
   },
   {
    "title": "Digital Marketing Specialist",
    "employer": "Freelance",
    "location": "London, UK",
    "start": "August 2020",
    "end": "Present"
   }
  ],
  "about": "Beverage/Bar Manager with 10+ years’ experience delivering high-end, large-scale events across London. Proven track record of leading teams, managing complex operations, and delivering premium service under pressure. Personal Licence holder, with a strong focus on building long-term client relationships and seeking to expand my client portfolio within unique and creative event environments while delivering exceptional hospitality experiences."
 },
 {
  "id": "stf_simao",
  "real": true,
  "name": "Simao",
  "tag": "SIMAO",
  "headline": "Award-Winning Mixologist",
  "profession": "Mixologist",
  "professions": [
   "Mixologist",
   "Cocktail Bartender",
   "Bar Manager",
   "Event Manager",
   "Bartender",
   "Barback"
  ],
  "group": "Bartenders",
  "theme": "ivory",
  "skills": [
   "Cocktails creation"
  ],
  "interests": [
   "Spirits",
   "Flavours"
  ],
  "languages": [
   "Italian",
   "Spanish",
   "Portuguese",
   "English"
  ],
  "locations": [
   "Milan",
   "London",
   "Lugano"
  ],
  "qualifications": [],
  "workHistory": [],
  "about": ""
 },
 {
  "id": "stf_dany",
  "real": true,
  "name": "Dany Gagnon",
  "tag": "DANYG",
  "profession": "Sommelier",
  "professions": [
   "Sommelier"
  ],
  "group": "Sommeliers",
  "theme": "ivory",
  "skills": [
   "Wine Expert",
   "Wine Education",
   "Food Pairing",
   "Wine Selection",
   "Winery Marketing"
  ],
  "interests": [
   "Wine & Life",
   "Wine Regions",
   "Vineyard Stories",
   "Food Pairing",
   "Wine Education",
   "French Wines",
   "Wine Travel",
   "Natural Wine"
  ],
  "languages": [
   "French",
   "English"
  ],
  "locations": [
   "Montreal, Quebec, Canada",
   "Toronto, Ontario, Canada",
   "Montreal",
   "Québec City",
   "Ontario"
  ],
  "qualifications": [],
  "workHistory": [
   {
    "title": "Founder & Sommelier",
    "employer": "Vin & Wine Inc.",
    "location": "Montreal, Quebec, Canada",
    "start": "2011",
    "end": "Present"
   },
   {
    "title": "Winery DtC Expert",
    "employer": "WINE A BEE™",
    "location": "Toronto, Ontario, Canada",
    "end": "Present"
   }
  ],
  "about": "Hi, I'm Dany Gagnon, a sommelier, wine professional and founder of Vin & Wine. My first wine tasting was in 1981, and my wine journey has taken me to 88 countries across five continents, including six years in France. I bring together experience in wine tasting, winegrowing, oenology, wine retail and teaching. Through Vin & Wine, I lead private and corporate tastings, workshops and events across Quebec and Ontario. I also work with wineries on direct-to-consumer marketing, including email, social media and content, through WINE A BEE. My aim is to make wine approachable, engaging and useful in everyday life."
 },
 {
  "id": "stf_james",
  "real": true,
  "name": "James Allcott",
  "tag": "JAMESALL",
  "headline": "Cocktail & Flair Specialist",
  "profession": "Cocktail Bartender",
  "professions": [
   "Cocktail Bartender",
   "Event Host",
   "Flair Bartender",
   "Bartender",
   "Mixologist",
   "Wedding & Events Coordinator"
  ],
  "group": "Bartenders",
  "theme": "slate",
  "skills": [
   "Flair",
   "Speed",
   "Efficiency",
   "Conversation & drink knowledge",
   "Cocktail Preparation & Mixology",
   "High-Volume Bar Operations",
   "Premium Food & Beverage Service",
   "Wedding & Event Coordination",
   "Supplier & Contractor Management",
   "Event Logistics & Scheduling",
   "Guest Experience & Client Relations",
   "Wine, Spirits & Beverage Knowledge",
   "Upselling & Sales",
   "Stock Control & Inventory Management",
   "Team Coordination & Staff Support",
   "Event Setup, Execution & Breakdown"
  ],
  "interests": [
   "Surfing",
   "Golf",
   "Travel",
   "Flavours",
   "Hiking"
  ],
  "languages": [
   "English"
  ],
  "locations": [
   "St Albans, UK",
   "London, UK"
  ],
  "qualifications": [],
  "workHistory": [
   {
    "title": "Bartender",
    "employer": "BANG BANG – NOOSA & BYRON BAY, AUSTRALIA",
    "location": "Noosa & Byron Bay, Australia",
    "start": "May 2025",
    "end": "June 2026"
   },
   {
    "title": "Bartender / Mixologist",
    "employer": "THREE BLUE DUCKS – BYRON BAY, AUSTRALIA",
    "location": "Byron Bay, Australia",
    "start": "July 2024",
    "end": "June 2026"
   },
   {
    "title": "Wedding & Events Coordinator",
    "employer": "SHOWTIME EVENT GROUP – MELBOURNE, AUSTRALIA",
    "location": "Melbourne, Australia",
    "start": "January 2024",
    "end": "March 2024"
   }
  ],
  "about": "Versatile hospitality and events professional with over two years of Australian experience across high-volume bars, restaurants and wedding events. Strong background in cocktail preparation, premium guest service and fast-paced hospitality operations, complemented by hands-on experience coordinating weddings, managing suppliers and overseeing event-day logistics."
 }
];

const DIRECTORY = REAL_MEMBERS.map((o) => staff({ ...o, tier: cardTier17(o), level: null, rating: null, reviews: 0, hasCar: false,
  photo: o.id === "stf_simao" ? ((window.FF_IMG || {}).simao_face || "") : "", media: [] }));


/* Gallery photos for the signed-in demo "me" profile (SEED_DEMO). Real members get none of these. */
const DEMO_GALLERY = {
  Bartenders: ["training_mixology", "dream_after_dark", "training_cocktail_basics", "dream_flair_jobs", "training_ff_open_bar", "reward_bar_shows"],
};



