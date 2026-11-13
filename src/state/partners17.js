/* src/state/partners17.js — FF Partners (Phase 3). Plain helpers and a small browser-local store; part of the FireFlair prototype script
   (classic script, shared global scope; files are joined in the order of src/manifest.json).

   What lives here
   - The partner record (one per signed-in account), its properties and its experience briefs, in a namespaced
     localStorage key ("ff.partners.v1"). The App's database handle is off in this preview, so this is the working
     preview persistence path. When storage is blocked the records live in memory only and say so (PTN.persisted).
   - ONE resolver for a property (guest route, discovery, sharing). It decides what a viewer may see and returns a
     public view that never carries private fields.
   - The FF Party handoff (ptnHandoff): creates or resumes ONE Event Card draft for a property and a package.

   Nothing here talks to Core, payments or messaging. A brief is an enquiry: it stays outside events, engagements and
   invoices, and is only ever "saved on this device" until a connected service exists. */

const PTN_STORE_KEY = "ff.partners.v1";

const PTN_PARTNER_TYPES = [
  ["host", "Independent host"], ["manager", "Property manager"], ["hotel", "Boutique hotel or resort"],
  ["club", "Private club"], ["concierge", "Concierge"], ["company", "Company"],
];

const PTN_PROP_TYPES = ["Holiday home", "Villa", "Chalet", "Boutique hotel", "Resort", "Private estate", "Club", "Bar or restaurant"];

const PTN_CONTACT_PREFS = ["WhatsApp", "Phone", "Email"];

const PTN_OCCASIONS = ["Birthday", "Anniversary", "Private dinner", "Wedding celebration", "Club evening", "Retreat or workshop", "Bespoke itinerary", "Something else"];

/* Capabilities partners can ask about (People & operations). Plain data: editorial, not a service promise. */
const PTN_CAPABILITIES = [
  ["Property launches and setup", "Getting a new property ready for its first guests."],
  ["Guest services and hospitality operations", "Service standards, handovers and guest relations."],
  ["Supplier coordination and project support", "Bringing local suppliers and teams together for a launch or an event."],
  ["Advisory", "Strategic planning, negotiation and supplier relationships."],
  ["Leadership development and mentoring", "Coaching for the people who lead your team."],
];

/* The questions every property can answer. Yes or No, then a type box for the detail. */
const PTN_QUESTIONS = [
  ["limit", "Is there a limit on the number of guests?"],
  ["visitors", "Can visitors who are not staying at the property join in?"],
  ["finish", "Is there a time the service has to finish?"],
  ["space", "Is there room to set up a bar?"],
  ["supply", "Do you supply the drinks, ice and glassware?"],
];

/* Ideas that need arranging. Always an enquiry, never a booking. */
const PTN_AT_PROPERTY = [
  ["Private chef dinner", "A chef cooks for your group at the property."],
  ["Sommelier-led tasting", "Wines chosen and introduced by a sommelier."],
  ["Celebration set-up", "Tables, flowers and finishing touches for an occasion."],
];
const PTN_LOCAL = [
  ["Vineyard visit", "A tasting at a nearby winery."],
  ["Private boat trip", "A relaxed trip on the water with a local operator."],
  ["Cultural workshop", "Cooking, craft or art with a local specialist."],
  ["Private tour and transfers", "A guided day out, with the transfers arranged by the operator."],
];

/* ---- Packages a property can offer: the FF Party catalogue is the only source of price, duration and inclusions ---- */
function ptnPackages() {
  const first = ["svc_mixology", "svc_masterclass"];
  const list = PKG_CAT17.filter((p) => p.visible && p.kind !== "standalone");
  const rank = (p) => { const i = first.indexOf(p.id); return i < 0 ? 10 + p.order : i; };
  return list.slice().sort((a, b) => rank(a) - rank(b));
}

/* ---- The store ---- */
const PTN = { data: null, subs: new Set(), persisted: null };

function ptnBlank() { return { v: 1, owners: {} }; }

function ptnLoad() {
  try {
    const raw = window.localStorage.getItem(PTN_STORE_KEY);
    const d = raw ? JSON.parse(raw) : null;
    PTN.data = d && d.v === 1 && d.owners ? d : ptnBlank();
    PTN.persisted = true;
  } catch (e) { PTN.data = ptnBlank(); PTN.persisted = false; }
}

function ptnGet() { if (!PTN.data) ptnLoad(); return PTN.data; }

function ptnWrite() {
  try { window.localStorage.setItem(PTN_STORE_KEY, JSON.stringify(PTN.data)); PTN.persisted = true; }
  catch (e) { PTN.persisted = false; }
}

function ptnUpdate(fn) {
  PTN.data = fn(ptnGet());
  ptnWrite();
  PTN.subs.forEach((f) => f());
}

function usePtn() {
  const [, force] = useState(0);
  useEffect(() => { const f = () => force((x) => x + 1); PTN.subs.add(f); return () => { PTN.subs.delete(f); }; }, []);
  return ptnGet();
}

/* The signed-in account owns the records. Signed out means no owner (nothing is saved). */
function ptnOwner(state) {
  if (!state || !state.auth || state.auth.status !== "signedIn") return "";
  return String(state.auth.tag || (state.session && state.session.tag) || "").toLowerCase();
}

const ptnBlankOwner = () => ({ partner: null, properties: [], briefs: [] });
const ptnMine = (data, owner) => (owner && data.owners[owner]) || ptnBlankOwner();

function ptnPatchOwner(owner, fn) {
  if (!owner) return;
  ptnUpdate((d) => ({ ...d, owners: { ...d.owners, [owner]: fn({ ...ptnBlankOwner(), ...(d.owners[owner] || {}) }) } }));
}

const ptnId = (p) => (p || "p") + Math.random().toString(36).slice(2, 10);

/* A web address the operator typed: https or http only, a real host, no credentials. Returns "" when it is not usable. */
function ptnUrl(raw) {
  let s = String(raw || "").trim();
  if (!s) return "";
  if (!/^[a-z][a-z0-9+.-]*:/i.test(s)) s = "https://" + s;
  try {
    const u = new URL(s);
    if (u.protocol !== "https:" && u.protocol !== "http:") return "";
    if (u.username || u.password || !/\.[a-z]{2,}$/i.test(u.hostname)) return "";
    return u.href;
  } catch (e) { return ""; }
}

/* The property is ready for a visibility choice once it has a name, a type and a place. */
const ptnReady = (p) => !!(p && String(p.name || "").trim() && p.type && String(p.location || "").trim());

/* ---- One resolver: guest route, discovery and sharing ----
   Returns { status: "ok" | "missing" | "paused", view?, preview? }.
   Draft pages resolve only for the signed-in owner (as a preview). Link-only pages resolve for anyone holding the link and
   never appear in discovery. Paused pages say only that they are paused. */
function ptnResolve(data, id, viewerOwner) {
  const key = String(id || "");
  for (const owner of Object.keys(data.owners)) {
    const rec = data.owners[owner];
    const prop = (rec.properties || []).find((p) => p.id === key);
    if (!prop) continue;
    const mine = !!viewerOwner && viewerOwner === owner;
    if (prop.visibility === "draft" && !mine) return { status: "missing" };
    if (prop.paused && !mine) return { status: "paused" };
    return { status: "ok", preview: mine && (prop.visibility === "draft" || !!prop.paused), view: ptnPublicView(prop, rec.partner, owner) };
  }
  return { status: "missing" };
}

/* What a guest may see. Private fields (address, access, notes, contact) are never copied across. */
function ptnPublicView(prop, partner, owner) {
  return {
    id: prop.id, owner, name: String(prop.name || "").trim(), type: prop.type || "", location: String(prop.location || "").trim(), cc: prop.cc || "",
    description: String(prop.description || "").trim(), photos: (prop.photos || []).slice(0, 10), rules: String(prop.rules || "").trim(),
    experiences: (prop.experiences || []).filter((id) => PKG_BY17[id]), qa: ptnPublicQa(prop.qa),
    website: ptnUrl(prop.website), listing: ptnUrl(prop.listing), by: partner ? String(partner.org || "").trim() : "",
    visibility: prop.visibility,
  };
}

/* Every saved answer, in full: the question, Yes or No, and the whole explanation. A saved No stays visible. */
function ptnPublicQa(qa) {
  const m = qa || {};
  return PTN_QUESTIONS.map(([k, q]) => ({ k, q, a: m[k] && m[k].a, note: String((m[k] && m[k].note) || "").trim() })).filter((x) => x.a === "Yes" || x.a === "No");
}

/* Public properties for discovery: active, public, with a name. Link-only and drafts never appear. */
function ptnPublicList(data) {
  const out = [];
  Object.keys(data.owners).forEach((owner) => {
    const rec = data.owners[owner];
    (rec.properties || []).forEach((p) => { if (p.visibility === "public" && !p.paused && ptnReady(p)) out.push(ptnPublicView(p, rec.partner, owner)); });
  });
  return out;
}

/* The guest link for a property. The hash route is the in-artifact route until a production domain exists. */
function ptnLink(id) {
  let base = "";
  try { base = window.location.origin + window.location.pathname; } catch (e) { base = ""; }
  return base + "#/ff-partners/p/" + id;
}

const PTN_ROUTE_RE = /^#\/ff-partners\/p\/([a-z0-9]{4,20})\/?$/i;

/* ---- Briefs: enquiries saved on this device. They never create an event, a shift or an invoice. ---- */
function ptnAddBrief(owner, draft) {
  let added = null, dup = null;
  ptnPatchOwner(owner, (rec) => {
    const sig = sr17Sig({ cat: "svc", what: draft.requested + "|" + draft.occasion + "|" + (draft.propertyId || ""), iso: draft.iso, contact: draft.replyContact });
    dup = (rec.briefs || []).find((b) => b.sig === sig && b.stage !== "closed");
    if (dup) return rec;
    const now = Date.now();
    added = { ...draft, id: ptnId("b"), sig, stage: "review", at: now, local: true, history: [{ stage: "review", at: now, by: "partner", note: "Saved on this device" }] };
    return { ...rec, briefs: [added, ...(rec.briefs || [])] };
  });
  return { added, dup };
}

/* ---- FF Party handoff ----
   Creates or resumes ONE Event Card draft for this property and package, and binds the FF Party basket to it
   (bk17.evId), so the booking screen builds the Service Card on that draft and never on an unrelated active event.
   Returns the event id, or "" when the package cannot be booked. */
function ptnDraftFor(state, propertyId, pkgId) {
  return state.events.find((e) => e.partnerRef && e.partnerRef.propertyId === propertyId && e.partnerRef.pkg === pkgId && !paid17(state, e.id) && !flowInfo(state, e).sent) || null;
}

function ptnHandoff(state, dispatch, view, pkgId) {
  const svc = (pkgsOf17(state) || []).find((x) => x.id === pkgId);
  if (!view || !svc) return "";
  let ev = ptnDraftFor(state, view.id, pkgId);
  let evId = ev && ev.id;
  if (!evId) {
    evId = uid("evt");
    dispatch({ type: "EVENT_ADD", event: { id: evId, ...eventData11({ ...eventDraft11(null), venue: view.location }), band: "", audience: "", site: "party", phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [],
      partnerRef: { owner: view.owner, propertyId: view.id, pkg: pkgId, name: view.name } } });
  } else {
    dispatch({ type: "ACTIVE_EVENT", id: evId });
  }
  const bk = bkOf17(state);
  dispatch({ type: "V11_SET", patch: { bk17: { ...bk, pk: [pkgId], ex: [], ck: [], pp: [], evId }, bkView: { eventId: evId }, ptnGuest: null } });
  try { window.history.pushState(null, "", window.location.pathname + window.location.search); } catch (e) { /* ignore */ }
  dispatch({ type: "ROLE", role: "staff", site: "party" });
  dispatch({ type: "V11_SET", patch: { bkView: { eventId: evId } } });
  dispatch({ type: "TAB", tab: "bookings" });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  return evId;
}

/* The event the FF Party basket is bound to, if that draft still exists and has not been sent or paid. Otherwise "". */
function ptnBasketEvent(state, bk) {
  const ev = bk && bk.evId ? state.events.find((e) => e.id === bk.evId) : null;
  return ev && !paid17(state, ev.id) && !flowInfo(state, ev).sent ? ev : null;
}

/* A concise, private-safe summary of a booking started from one of this partner's properties.
   Derived from the same event: no phone, email, payment or guest notes. */
function ptnLinkedBookings(state, owner) {
  if (!owner) return [];
  return state.events.filter((e) => e.partnerRef && e.partnerRef.owner === owner).map((e) => {
    const shifts = state.shifts.filter((x) => x.eventId === e.id);
    const info = flowInfo(state, e);
    const paid = paid17(state, e.id);
    return { id: e.id, property: e.partnerRef.name, title: e.title || "Event Card", date: e.date || "", guests: e.guests || "", packages: shifts.map((s) => s.role).filter(Boolean),
      status: paid ? "Booked and paid" : info.sent ? "Request sent" : info.hasShifts ? "Event Card in progress" : "Draft started" };
  });
}
