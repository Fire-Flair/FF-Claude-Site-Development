/* src/adapters/network-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — NETWORK_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   connected  (value)
   note  (value)
   Nothing outside this file talks to a backend: the rest of the app calls NETWORK_ADAPTER only. */
/* --- Networking (Phase 1) -------------------------------------------------- */
/* What FireFlair Core has to provide for networking, team invitations and reviews.
   None of it exists in the backend yet (FireFlair-Backend dev has no network,
   invitation or review endpoints), so the prototype keeps everything in this
   viewer's own store and says so on screen. A network add sends a site
   notification only, never a WhatsApp message. Function bodies are what Core replaces. */
const NETWORK_ADAPTER = {
  connected: false,
  note: "Prototype: connections, invitations and reviews are kept in this preview only. Nothing is sent.",
  /* Core keeps ONE connection per pair (v17.22):
       connection = { id, fromId, toId, status, createdAt, invitedAt, decidedAt, message }
       status "network" (one way, from added to) | "pending" (from has invited to onto their team) | "team" (two way).
     The prototype reads one status per person with connStatus17(state, id) (src/state/invite17.js).
     docs/invitations-phase2.md maps the prototype's stores to this record. */
  /* Core: POST /network/connections { toId | toTag }                    -> connection, status "network"; site notification to the person added */
  /* Core: POST /network/connections/{id}/invite                        -> status "pending" */
  /* Core: POST /network/connections/{id}/reply { accept, message? }    -> status "team" or back to "network" */
  /* Core: DELETE /network/connections/{id}                              (remove from network); POST /network/connections/{id}/leave-team -> status "network" */
  /* Core: GET  /network                                                 -> the signed-in member's connections with status, inviter first */
  /* Core: the code in a join link (https://ffteam.uk/join/<code>) or a shared card, profile or shift link (?r=<code>) is stored as
     referred_by on the new member (first valid code wins; an unknown code or the member's own tag is ignored). At sign-up the
     connection is made, and a shared-card code (?r=) creates the pending team invitation from the sender, as a join link does;
     referred_by keeps which kind of link it was. Team waits for the newcomer's Accept. When the profile is first complete Core sends
     message 10.5 to the sender, and message 10.6 when the team invitation is accepted. Each invitation stores the code, sender,
     channel, created, opened, joined time and the new member's id. */
  /* Core: POST /reviews { aboutId | aboutTag, worked, rating, text, shiftId? }   -> status "pending"
       review = { id, aboutId, byId, byName, worked, rating, text, status, at, shiftId }; rating 1 to 5, or null when worked is false.
       A review is offered after Add to network, after accepting a team invitation and from the profile menu. Signed out, the
       prototype keeps a draft (session.reviewDraft17) and posts it, pending, at sign-up or log in. */
  /* Core: POST /reviews/{id}/decision { show, message? }                -> "accepted" or "declined"; published only when accepted.
       The subject is asked with a site notification; the writer is told on accept. Declined reviews are hidden, never deleted. */
};
