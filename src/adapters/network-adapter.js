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
  /* Core (v17.6.1): the code in a join link (https://ffteam.uk/join/<code>) or a shared card link (?r=<code>) is stored as referred_by
     on the new member (first valid code wins; an unknown code or the member's own tag is ignored). The Network connection is made at
     sign-up; the Team connection waits for the newcomer's Accept. When the profile is first complete Core sends message 10.5 to the
     sender, and message 10.6 when the Team invitation is accepted. Each invitation stores the code, sender, channel, created, opened,
     joined time and the new member's id.
     Reviews: the newcomer may review the sender straight after Accept (the prototype builds this). The sender may review the newcomer
     when told they joined or accepted (10.5 / 10.6): that is the sender's own notification and is not built in the prototype, which
     has one user. A review is published only when its subject accepts it. */
  /* Core: GET /network  — the signed-in user's connections, inviter first */
  /* Core: POST /reviews { aboutTag, workedBefore, workAgain, howTo, rating, text } → pending until accepted */
};
