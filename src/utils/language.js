/* src/utils/language.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* --------------------------------------------------------------------------
   LANGUAGES — the master list from the backend
   (FireFlair-Backend scripts/seedLanguages.js: "FireFlair Profile Language
   Flags Specification" v1.1, 52 languages, in the spec's order), with real
   flag images instead of flag emoji. Windows shows flag emoji as two bare
   letters ("FR"), which Griffy's frontend already fixed with SVG flags; this
   is the same fix for the prototype. [iso639, name, flag key]
   -------------------------------------------------------------------------- */
const LANGUAGE_MASTER = [
  ["fr", "French", "FR"], ["it", "Italian", "IT"], ["es", "Spanish", "ES"], ["en", "English", "GB"],
  ["de", "German", "DE"], ["pt", "Portuguese", "PT"], ["nl", "Dutch", "NL"], ["el", "Greek", "GR"],
  ["cy", "Welsh", "gbwls"], ["gd", "Scottish Gaelic", "gbsct"], ["sco", "Scots", "gbsct"], ["ga", "Irish", "IE"],
  ["kw", "Cornish", "GB"], ["bfi", "British Sign Language", "sign_language"],
  ["pl", "Polish", "PL"], ["ro", "Romanian", "RO"], ["lt", "Lithuanian", "LT"], ["bg", "Bulgarian", "BG"],
  ["hu", "Hungarian", "HU"], ["cs", "Czech", "CZ"], ["sk", "Slovak", "SK"], ["ru", "Russian", "RU"],
  ["uk", "Ukrainian", "UA"], ["sq", "Albanian", "AL"], ["hr", "Croatian", "HR"],
  ["ar", "Arabic", "SA"], ["tr", "Turkish", "TR"], ["fa", "Persian (Farsi)", "IR"], ["ps", "Pashto", "AF"], ["ku", "Kurdish", "globe"],
  ["hi", "Hindi", "IN"], ["pa", "Punjabi", "IN"], ["gu", "Gujarati", "IN"], ["ta", "Tamil", "IN"], ["te", "Telugu", "IN"],
  ["ml", "Malayalam", "IN"], ["mr", "Marathi", "IN"], ["bn", "Bengali", "BD"], ["ur", "Urdu", "PK"], ["ne", "Nepali", "NP"], ["si", "Sinhala", "LK"],
  ["zh", "Mandarin Chinese", "CN"], ["yue", "Cantonese", "HK"], ["ja", "Japanese", "JP"], ["ko", "Korean", "KR"],
  ["vi", "Vietnamese", "VN"], ["tl", "Tagalog (Filipino)", "PH"],
  ["so", "Somali", "SO"], ["sw", "Swahili", "KE"], ["yo", "Yoruba", "NG"], ["am", "Amharic", "ET"], ["ti", "Tigrinya", "ER"],
].map(([iso, name, flag]) => ({ iso, name, flag }));


/* Other ways people write the same language (CVs, typing). */
const LANGUAGE_ALIASES = {
  mandarin: "zh", chinese: "zh", farsi: "fa", persian: "fa", filipino: "tl", tagalog: "tl",
  bsl: "bfi", "sign language": "bfi", gaelic: "gd", "scots gaelic": "gd", castilian: "es",
  "brazilian portuguese": "pt", flemish: "nl", "english (uk)": "en", "british english": "en",
};


const LANG_FLAG_IMG = __ff_json("content/data/lang-flag-img.json");


function languageInfo(name) {
  const k = String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  if (!k) return null;
  const iso = LANGUAGE_ALIASES[k];
  return LANGUAGE_MASTER.find(l => l.name.toLowerCase() === k || l.iso === k || (iso && l.iso === iso)
    || l.name.toLowerCase().replace(/\s*\(.*\)$/, "") === k) || null;
}


/* A language's flag, sized to the text around it. A language that isn't on
   the master list gets the globe (spec §4.3). */
function LangFlag({ lang, style }) {
  const info = languageInfo(lang);
  const src = LANG_FLAG_IMG[info ? info.flag : "globe"] || LANG_FLAG_IMG.globe;
  return <img decoding="async" className="ff-langflag" src={src} alt="" aria-hidden="true" style={style} />;
}
