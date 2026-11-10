/* src/adapters/speech-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — SPEECH_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   supported()
   start({ onText, onEnd, onError })
   Nothing outside this file talks to a backend: the rest of the app calls SPEECH_ADAPTER only. */
/* ==========================================================================
   SPEECH adapter — browser speech recognition today. A hosted speech-to-text
   service later replaces start() and the FFAI input doesn't change: it only
   ever puts text into the field, where the person reviews it before sending.
   ========================================================================== */
const SPEECH_ADAPTER = {
  supported: () => typeof window !== "undefined" && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
  start({ onText, onEnd, onError }) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { onError("unsupported"); return null; }
    const r = new SR();
    r.lang = "en-GB"; r.interimResults = false; r.continuous = false;
    r.onresult = (e) => {
      const t = Array.from(e.results).map(x => x[0].transcript).join(" ").trim();
      if (t) onText(t);
    };
    r.onerror = (e) => onError((e && e.error) || "error");
    r.onend = () => onEnd();
    try { r.start(); } catch (e) { onError("busy"); return null; }
    return { stop: () => { try { r.stop(); } catch (e) { /* already stopped */ } } };
  },
};
