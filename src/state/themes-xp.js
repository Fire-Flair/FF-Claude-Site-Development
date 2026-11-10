/* src/state/themes-xp.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   2. PRIMITIVES
   ========================================================================== */

const THEMES = {
  /* accent = gold used for labels and ornaments on that face; edge = the
     gold hairline around information panels. Both optional for older code. */
  ivory: { name: "Ivory", bg: "linear-gradient(168deg,#FCF8EE,#F1E8D4)", ink: "#15130F", sub: "#6E6556", rule: "rgba(126,97,29,.24)", accent: "#8A6A1E", edge: "rgba(176,141,42,.75)", dark: false, swatch: "#F5EDDA" },
  onyx:  { name: "Onyx",  bg: "linear-gradient(168deg,#1A1A1D,#0C0C0E)", ink: "#F2F0EA", sub: "#B9B6AE", rule: "rgba(240,238,232,.22)", accent: "#D9BE68", edge: "rgba(201,162,39,.55)", dark: true,  swatch: "#141416" },
  burgundy: { name: "Burgundy", bg: "linear-gradient(168deg,#4E1220,#230710)", ink: "#F6EDE4", sub: "#D9BFB1", rule: "rgba(226,194,122,.26)", accent: "#E2C27A", edge: "rgba(226,194,122,.55)", dark: true, swatch: "#4E1220" },
  slate: { name: "Forest", bg: "linear-gradient(168deg,#173028,#0A1712)", ink: "#F1F4F0", sub: "#B7CDBF", rule: "rgba(201,162,39,.28)", accent: "#D9BE68", edge: "rgba(201,162,39,.5)", dark: true,  swatch: "#12241D" },
  paper: { name: "Paper", bg: "linear-gradient(168deg,#FAFAF8,#ECEBE6)", ink: "#1A1A1C", sub: "#5E5D58", rule: "rgba(26,26,28,.18)", accent: "#8A6A1E", edge: "rgba(176,141,42,.6)", dark: false, swatch: "#F2F1EC" },
  silver: { name: "Silver", bg: "radial-gradient(120% 55% at 18% 0%,rgba(255,255,255,.95),rgba(255,255,255,0) 62%), linear-gradient(160deg,#FFFFFF 0%,#D3D8DF 16%,#9AA2AE 36%,#F2F4F7 52%,#AAB2BD 72%,#E6E9EE 88%,#B7BEC8 100%)", ink: "#0E0F12", sub: "#262A30", rule: "rgba(18,19,22,.22)", accent: "#3C4048", edge: "rgba(110,116,126,.8)", dark: false, swatch: "linear-gradient(135deg,#F6F7F9,#A9AFB9)", locked: true },
  gold: { name: "Gold", bg: "radial-gradient(120% 55% at 18% 0%,rgba(255,248,214,.9),rgba(255,248,214,0) 62%), linear-gradient(160deg,#FBEDB4 0%,#E7C060 22%,#B98A2B 48%,#F3D98A 62%,#C99A38 82%,#EBCB71 100%)", ink: "#14110A", sub: "#3A2D0F", rule: "rgba(20,17,10,.3)", accent: "#14110A", edge: "rgba(20,17,10,.55)", dark: false, swatch: "linear-gradient(135deg,#F7E3A0,#B98A2B)", locked: true },
};



const TIERS = {
  base:     { name: "Base",     ring: ["#B9B6AF", "#6E6B66"], face: "#1A1A1C", ink: "#CFCBC3" },
  standard: { name: "Standard", ring: ["#C9A227", "#7E611D"], face: "#111113", ink: "#E6CC80" },
  bronze:   { name: "Bronze",   ring: ["#D89A5C", "#7A4A20"], face: "#1A0F08", ink: "#F0C08A" },
  silver:   { name: "Silver",   ring: ["#E6E8EC", "#8D9298"], face: "#141416", ink: "#EFF1F4" },
  gold:     { name: "Gold",     ring: ["#F0D68A", "#9A7717"], face: "#131108", ink: "#F7E4A6" },
};



/* XP ladder — each rung names the tier metal it unlocks, so the reward badge
   is always drawn from the same Coin/FFEmblem art used everywhere else in
   the card system, never a separate gamification graphic. Extensible: add a
   rung here and the XP bar, profile badge and level-up state all follow. */
/* XP ladder. Bronze and Silver are fixed thresholds; Gold is NOT a number —
   it's awarded to the current quarter's top performers, so it can never be
   invented as a fixed XP figure. xpProgress() treats Gold as "reached" only
   when the caller says so (goldEligible), never from the xp value alone. */
const XP_LEVELS = [
  { tier: "bronze", xp: 100, label: "Bronze", unlocks: "First level of profile customisation" },
  { tier: "silver", xp: 500, label: "Silver", unlocks: "Additional profile customisation" },
  { tier: "gold",   xp: null, label: "Gold",   unlocks: "Premium profile customisation", earnedBy: "quarter-top-performers" },
];


const XP_NUMERIC_LEVELS = XP_LEVELS.filter(l => typeof l.xp === "number");




function quarterAfter(year, q) { return q === 4 ? { year: year + 1, q: 1 } : { year, q: q + 1 }; }


function quarterLabel(p) { return `${p.year} Q${p.q}`; }


function quarterMonths(p) { return QUARTER_MONTHS[p.q - 1]; }



function generateQuarters(startYear, startQ, count) {
  const out = [];
  let cur = { year: startYear, q: startQ };
  for (let i = 0; i < count; i++) { out.push(cur); cur = quarterAfter(cur.year, cur.q); }
  return out;
}



/* The single source of truth for "what quarter is it": change these two
   numbers and the whole XP Beta timeline, labels and reset behaviour move
   with it — nothing else in the app hardcodes a quarter. */
const XP_BETA_START = { year: 2026, q: 4 };


const XP_CURRENT_PERIOD = { year: 2026, q: 4 };


const XP_TIMELINE = generateQuarters(XP_BETA_START.year, XP_BETA_START.q, 5);


const xpPeriodKey = (p) => `${p.year}Q${p.q}`;



function xpProgress(xp) {
  const cur = xp || 0;
  const next = XP_NUMERIC_LEVELS.find(l => cur < l.xp);
  const prevXp = (() => {
    const i = next ? XP_NUMERIC_LEVELS.indexOf(next) : XP_NUMERIC_LEVELS.length;
    return i > 0 ? XP_NUMERIC_LEVELS[i - 1].xp : 0;
  })();
  const reached = XP_NUMERIC_LEVELS.filter(l => cur >= l.xp);
  const currentTier = reached.length ? reached[reached.length - 1].tier : "standard";
  if (!next) return { xp: cur, next: null, pct: 100, currentTier, prevXp, nextXp: cur || 1 };
  const span = next.xp - prevXp;
  const pct = span > 0 ? Math.min(100, Math.max(0, ((cur - prevXp) / span) * 100)) : 0;
  return { xp: cur, next, pct, currentTier, prevXp, nextXp: next.xp };
}
