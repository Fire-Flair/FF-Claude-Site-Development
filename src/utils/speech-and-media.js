/* src/utils/speech-and-media.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const SPEECH_ERRORS = {
  unsupported: "Voice input isn't available in this browser — type instead.",
  "not-allowed": "Microphone access is blocked. Allow it in your browser settings, or type instead.",
  "service-not-allowed": "Microphone access is blocked. Allow it in your browser settings, or type instead.",
  "no-speech": "Didn't catch that — tap the microphone and try again.",
  "audio-capture": "No microphone was found on this device.",
  network: "Voice input needs a connection. Try again, or type instead.",
};



/* ==========================================================================
   PROFILE AI — free text -> proposed Question Card answers.
   No language model is wired up: this is a keyword/phrase matcher against
   the QUESTIONS library, honestly labelled as such. A live adapter would
   swap this function's body for a real model call and keep the same
   { qid, value, matchedOn } output shape, so nothing downstream changes.
   The caller is always responsible for confirming proposals before they
   touch the profile — this function only ever proposes, never writes.
   ========================================================================== */
function proposeAnswersFromText(text) {
  const t = (text || "").toLowerCase();
  const out = [];
  const add = (qid, value) => { if (!out.some(p => p.qid === qid)) out.push({ qid, value }); };
  if (/\b(i drive|own car|have a car|my car|driving licen[cs]e|drive myself)\b/.test(t)) add("g_travel", "I drive");
  else if (/\b(public transport|tube|train|bus|underground|overground)\b/.test(t)) add("g_travel", "Public transport");
  if (/\bfreelanc/.test(t)) add("g_freelance", "Yes");
  if (/\b(own (kit|equipment|tools|bar tools|shaker)|cocktail equipment|bar equipment|my (kit|equipment|tools))\b/.test(t)) add("g_equipment", "Yes");
  if (/\b(last[- ]minute|short notice)\b/.test(t)) add("g_notice", "Yes");
  if (/\b(weddings?|corporate|festivals?|private (parties|party|events?)|events?)\b/.test(t)) add("g_events", "Yes");

  /* Information that fits no profile category becomes a NEW Question Card
     (v1.6 §7), answered from what was given and confirmed by the person. */
  const AI_RULES = [
    [/\b(trained|training|train) (new |junior )?(staff|bartenders|teams?|people|others|waiters)\b|\btrainer\b/, "Have you trained other hospitality staff?"],
    [/\b(managed|managing|led|leading|ran|running) (a |the |my )?(team|bar team|staff|crew)\b/, "Have you managed a team?"],
    [/\bcompetitions?\b/, "Have you competed in cocktail competitions?"],
  ];
  AI_RULES.forEach(([re, q]) => { if (re.test(t)) out.push({ ai: true, qid: "new_" + q.toLowerCase().replace(/[^a-z]+/g, "_"), text: q, value: "Yes" }); });
  return out;
}



/* ---- media helpers ------------------------------------------------------
   Files are held as data URLs so they survive a reload alongside the rest of
   the saved profile. Kept modest on purpose — this is prototype storage. */
const MAX_MEDIA_BYTES = 10 * 1024 * 1024;


const MAX_MEDIA_PER_CARD = 4;

   // v16.12: up to four images, shown under the card title

function readFileAsDataUrl(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(String(r.result));
    r.onerror = () => rej(new Error("Could not read that file."));
    r.readAsDataURL(file);
  });
}



const prettyBytes = (n) => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
