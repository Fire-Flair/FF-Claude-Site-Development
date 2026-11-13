/* src/styles/css-registry.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const FF_FINE_POINTER = typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(pointer: fine)").matches;


const TRIAL_DESIGN_CSS = __ff_css("styles/trial-design.css");


const V101_CSS = __ff_css("styles/tokens.css", "styles/v101.css");


const V11_CSS = __ff_css("styles/v11.css", "styles/partners.css");
