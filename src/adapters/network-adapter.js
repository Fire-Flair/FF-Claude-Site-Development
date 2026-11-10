/* src/adapters/network-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — NETWORK_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   connected  (value)
   note  (value)
   Nothing outside this file talks to a backend: the rest of the app calls NETWORK_ADAPTER only. */
/* --- Networking (Phase 1) -------------------------------------------------- */
/* What FireFlair Core has to provide for networking. None of it exists in the
   backend yet (FireFlair-Backend dev has no network, invitation or review
   endpoints), so the prototype keeps everything in this viewer's own store
   and says so on screen. Function bodies are what Core replaces. */
const NETWORK_ADAPTER = {
  connected: false,
  note: "Prototype: invitations, connections and reviews are kept in this preview only. Nothing is sent.",
  /* Core: POST /network/invitations { toPhone | toTag, review? }  → WhatsApp link */
  /* Core: on sign-up from an invitation link, connect inviter ⇄ invitee automatically */
  /* Core: GET /network  — the signed-in user's connections, inviter first */
  /* Core: POST /reviews { aboutTag, workedBefore, workAgain, howTo, rating, text } → pending until accepted */
};
