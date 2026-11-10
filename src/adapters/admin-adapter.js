/* src/adapters/admin-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ======================================================================================================
   v17.4 — FF Admin
   One place to see and manage everything FireFlair holds, across FF Team, FF Staff, FF Party and
   FF VIP. Admins never delete: they hide and show, set verification, and switch sites and features on
   and off. Every change is written to the activity log.

   In this prototype the admin reads this preview's own store (the same data the page saves through the
   `db` capability) plus the demo directory, companies and packages. On the live site every list below
   comes from FireFlair Core through ADMIN_ADAPTER, across every account.
   ====================================================================================================== */

/* What FireFlair Core has to provide for FF Admin. None of it exists yet (FireFlair-Backend has user
   routes only). Every route needs an admin role check; nothing here deletes a record.
   Core: GET   /api/admin/me                         → { tag, role, permissions[] }
   Core: GET   /api/admin/stats                      → counts per collection, hidden counts
   Core: GET   /api/admin/:collection?q=&status=&cursor=   collections: users, cards, companies, packages,
                                                      service-cards, cocktails, stories, events, shifts,
                                                      engagements, reviews, questions, answers, interest,
                                                      availability, terms, invitations, connections
   Core: PATCH /api/admin/:collection/:id/visibility { hidden: true|false, reason? }
   Core: PATCH /api/admin/:collection/:id/verification { tier: "standard"|"bronze"|"silver"|"gold" }
   Core: GET   /api/admin/settings  ·  PATCH /api/admin/settings { sitesOpen[], bookingsLive, xpLive, ... }
   Core: GET   /api/admin/admins    ·  POST /api/admin/admins { tag, role }  ·  PATCH /api/admin/admins/:tag { role?, active? }
   Core: GET   /api/admin/log?cursor=  (append-only: who, what, which record, when)
   Core: GET   /api/admin/export/:collection.csv
   Core: POST  /api/admin/invitations { name, contact, site }  → sends the WhatsApp (or email) invite with a sign-up link
   Core: GET   /api/admin/invitations  ·  POST /api/admin/invitations/:id/resend   (status: sent | joined, joined when the
                                                      contact signs up; match on phone or email)
   Core: GET   /api/admin/bookings?state=&cursor=   events with their shifts and engagements, plus response time
                                                      (first reply in engagement history minus sentAt)
   Core: PATCH /api/admin/engagements/:id { state?, expiresAt?, staffId?, note? }  manual override of any step. Writes
                                                      a history entry { state, at, by: "admin", note } and the admin log;
                                                      a reassign sends a fresh request to the new person
   Core: GET   /api/admin/answers?question_key=&cursor=   every answer as a flat view: account, site, area, question,
                                                      question_key, answer, answered_at
   Public read routes (GET /api/user/card/public/:ffTag, lists, search) must leave out hidden records. */
/* ======================================================================================================
   ADMIN_ADAPTER — contract for the future Admin API.
   The admin UI (src/components/admin/) and the activity log call ONLY these methods. In the prototype none of
   them is connected: each resolves { ok: false, reason: "not-connected" } and FF Admin keeps reading and
   changing this preview's own store. The real service implements each method with the route named above it
   and returns the shape written beside it; the UI then needs no change.

   Conventions: every method returns a Promise. Success is { ok: true, ...data }, failure is
   { ok: false, reason: "<code>", message? }. Collections: users, cards, companies, packages, service-cards,
   cocktails, stories, events, shifts, engagements, reviews, questions, answers, interest, availability,
   terms, invitations, connections. Admins never delete: they hide/show, set verification and change settings.
   Every write appends to the activity log (who, what, which record, when). All routes need an admin role.
   ====================================================================================================== */
const ADMIN_NOT_CONNECTED = () => Promise.resolve({ ok: false, reason: "not-connected" });
const ADMIN_ADAPTER = {
  connected: false,
  note: "Prototype: FF Admin reads and changes this preview's data only.",
  /* GET /api/admin/me -> { ok, tag, role, permissions: string[] } */
  me: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/stats -> { ok, counts: { [collection]: number }, hidden: { [collection]: number } } */
  stats: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/:collection?q=&status=&cursor=  input { collection, q?, status?, cursor? }
     -> { ok, items: object[], nextCursor?: string } (hidden records are included, flagged hidden:true) */
  list: ADMIN_NOT_CONNECTED,
  /* PATCH /api/admin/:collection/:id/visibility  input { collection, id, hidden: boolean, reason? } -> { ok, record } */
  setVisibility: ADMIN_NOT_CONNECTED,
  /* PATCH /api/admin/:collection/:id/verification  input { collection, id, tier: "standard"|"bronze"|"silver"|"gold" } -> { ok, record } */
  setVerification: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/settings -> { ok, settings: { sitesOpen: string[], bookingsLive: boolean, xpLive: boolean, ... } }
     PATCH /api/admin/settings  input partial settings -> { ok, settings } */
  getSettings: ADMIN_NOT_CONNECTED,
  updateSettings: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/admins -> { ok, admins: [{ tag, role, active }] }
     POST /api/admin/admins  input { tag, role } -> { ok, admin }
     PATCH /api/admin/admins/:tag  input { tag, role?, active? } -> { ok, admin } */
  listAdmins: ADMIN_NOT_CONNECTED,
  addAdmin: ADMIN_NOT_CONNECTED,
  updateAdmin: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/log?cursor= (append-only) -> { ok, entries: [{ who, what, collection, id, at }], nextCursor? } */
  activityLog: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/export/:collection.csv  input { collection } -> { ok, url } */
  exportCsv: ADMIN_NOT_CONNECTED,
  /* POST /api/admin/invitations  input { name, contact, site } -> { ok, invitation } (sends the WhatsApp or email invite)
     GET /api/admin/invitations -> { ok, items: [{ id, name, contact, site, status: "sent"|"joined" }] }
     POST /api/admin/invitations/:id/resend  input { id } -> { ok } */
  createInvitation: ADMIN_NOT_CONNECTED,
  listInvitations: ADMIN_NOT_CONNECTED,
  resendInvitation: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/bookings?state=&cursor=  -> { ok, events: [{ event, shifts, engagements, responseMs }], nextCursor? } */
  listBookings: ADMIN_NOT_CONNECTED,
  /* PATCH /api/admin/engagements/:id  input { id, state?, expiresAt?, staffId?, note? }
     -> { ok, engagement } (adds a history entry { state, at, by: "admin", note }; a reassign sends a fresh request) */
  overrideEngagement: ADMIN_NOT_CONNECTED,
  /* GET /api/admin/answers?question_key=&cursor= -> { ok, rows: [{ account, site, area, question, question_key, answer, answered_at }], nextCursor? } */
  listAnswers: ADMIN_NOT_CONNECTED,
};
