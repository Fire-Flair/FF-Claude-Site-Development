/* src/state/invite17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   INVITATIONS (v17.6.1) — a real record of who brought you in.
   Nothing on the site may say or imply that someone invited you unless one of these records says so.

   state.session.refTag   the sender's code (their FF Tag, upper case). No default.
   state.session.refKind  "team" (a join link) or "share" (a shared card or shift link).
   state.profile.referredBy = { code, personId, kind, at, completedAt?, notNowAt?, reviewOfferedAt? }
       written once, at sign-up, from a valid refTag. code, personId, kind and at never change afterwards.
       completedAt: the first time the profile is complete (the sender is "rewarded": Core sends 10.5, the prototype records the time).
       notNowAt / reviewOfferedAt: what the newcomer has done with the banner.
   state.teamAsksIn17 = [{ id, fromId, name, tag, note, at, viaLink: true }]
       a team invitation that came through a join link or a shared link. Decided through TEAM_ASK_REPLY (state.teamAsks17 holds the answer).

   First valid code wins. Valid = a member in the directory with that tag, and not the visitor's own tag.
   An unknown code is ignored without a message: sign-up works and nobody is credited.
   docs/invitations-phase2.md has the full rules.
   ========================================================================== */

const inv17Code = (c) => { const t = String(c || "").trim(); return /^[a-z0-9]{3,8}$/i.test(t) ? t.toUpperCase() : ""; };


const inv17SignedIn = (s) => !!(s && s.auth && s.auth.status === "signedIn");


/* The member a code belongs to (a person in the directory with that tag), or null. Never the visitor themself. */
function inv17Sender(s, code) {
  const c = inv17Code(code);
  if (!c) return null;
  const mine = String((inv17SignedIn(s) && ((s.auth && s.auth.tag) || (s.session && s.session.tag))) || (s.session && s.session.tag) || "").toUpperCase();
  if (mine && mine === c) return null;
  return adminPeople17(s, s.directory || []).find(p => p && p.id !== "me" && !p.isCompany && String(p.tag || "").toUpperCase() === c) || null;
}


/* One definition of "complete": signed in, saved, a name, a profile picture and at least one confirmed profession. */
function profileBasics17(s) {
  if (!inv17SignedIn(s) || !s.profile) return false;
  const p = s.profile;
  return !!(p.savedAt && String(p.name || "").trim() && p.photo && recsOf(p, "professions").some(r => r && !r.proposed));
}


/* The address a member's join link has: https://ffteam.uk/join/<tag in lower case>. */
const inv17Link = (tag) => "https://FFTeam.uk/join/" + String(tag || "").toLowerCase();


/* Read once when the app starts: a shared link carries the sharer's code as ?r=<code>. */
function inv17Init(s) {
  try {
    const r = new URLSearchParams(window.location.search).get("r");
    if (r) return inv17Reducer(s, { type: "INV_REF", code: r, kind: "share" }) || s;
  } catch (e) { /* ignore */ }
  return s;
}


/* A link was opened: remember who it came from. First valid code wins; the same sender's join link upgrades "share" to "team". */
function inv17Ref(s, a) {
  if (inv17SignedIn(s)) return s;
  const code = inv17Code(a.code), kind = a.kind === "team" ? "team" : "share";
  if (!inv17Sender(s, code)) return s;
  const cur = s.session.refTag;
  if (cur) {
    if (String(cur).toUpperCase() === code && kind === "team" && s.session.refKind !== "team") return { ...s, session: { ...s.session, refKind: "team" } };
    return s;
  }
  return { ...s, session: { ...s.session, refTag: code, refKind: kind } };
}


/* Where a person stands with me, in one word. Team is two way (s.connections); pending = a team invitation I sent that is
   not answered yet (s.teamInvites); network = a one-way add (s.netAdds17); otherwise none. */
function connStatus17(s, id) {
  if ((s.connections || []).some(c => c.id === id)) return "team";
  if ((s.teamInvites || []).some(i => i.personId === id && i.status === "pending")) return "pending";
  if ((s.netAdds17 || []).includes(id)) return "network";
  return "none";
}


/* Called by AUTH_SIGNED_IN with the state before and after. A new account on FF Team with a valid code records who brought it in,
   puts the sender in the newcomer's network (one way) and creates one pending team invitation (join link or shared link). */
function inv17AtSignIn(prev, next, a) {
  if (inv17SignedIn(prev) || a.login || a.method === "dev" || next.role !== "team" || (next.profile && next.profile.referredBy)) return next;
  const sender = inv17Sender(next, next.session.refTag);
  if (!sender) return next;
  const kind = next.session.refKind === "team" ? "team" : "share";
  const now = Date.now();
  const out = {
    ...next,
    profile: { ...next.profile, referredBy: { code: inv17Code(next.session.refTag), personId: sender.id, kind, at: now } },
    netAdds17: (next.netAdds17 || []).includes(sender.id) ? next.netAdds17 : [...(next.netAdds17 || []), sender.id],
  };
  if (!(next.teamAsksIn17 || []).some(x => x.fromId === sender.id))
    out.teamAsksIn17 = [...(next.teamAsksIn17 || []), { id: "tia_" + sender.id, fromId: sender.id, name: sender.name, tag: sender.tag, note: `You have been invited to join ${sender.name}'s team`, at: now, viaLink: true }];
  return out;
}


/* Called by AUTH_SIGNED_IN after inv17AtSignIn. A review written while signed out (session.reviewDraft17) is posted once the
   visitor signs up or logs in, as a pending review by "me". The DEV login clears it without posting. Nobody is credited for it. */
function rev17AtSignIn(prev, next, a) {
  const d = next.session && next.session.reviewDraft17;
  if (!d) return next;
  const session = { ...next.session, reviewDraft17: null };
  if (a.method === "dev" || inv17SignedIn(prev)) return { ...next, session };
  const worked = d.worked !== false;
  const review = { id: uid("rev"), aboutId: d.aboutId, byId: "me", byName: (next.profile && String(next.profile.name || "").trim()) || "You", worked, rating: worked ? (d.rating || null) : null, text: String(d.text || ""), status: "pending", at: Date.now(), shiftId: null };
  const out = reducerCore17({ ...next, session }, { type: "REVIEW_ADD", review });
  const who = adminPeople17(next, next.directory || []).find(p => p && p.id === d.aboutId) || companyById(next, d.aboutId) || {};
  return { ...out, toast: `Review sent to ${firstName(who.name)}` };
}


/* After every action: the first time the profile is complete, record when. */
function inv17Post(s) {
  const r = s && s.profile && s.profile.referredBy;
  if (!r || r.completedAt || !profileBasics17(s)) return s;
  return { ...s, profile: { ...s.profile, referredBy: { ...r, completedAt: Date.now() } } };
}


function inv17Reducer(s, a) {
  switch (a.type) {
    case "INV_REF": return inv17Ref(s, a);
    /* What the newcomer has done with the banner: { notNowAt } or { reviewOfferedAt }. Fields are only ever added, never changed. */
    case "INV_PATCH": {
      const r = s.profile && s.profile.referredBy;
      if (!r) return s;
      const add = {};
      Object.keys(a.patch || {}).forEach(k => { if (!r[k]) add[k] = a.patch[k]; });
      return Object.keys(add).length ? { ...s, profile: { ...s.profile, referredBy: { ...r, ...add } } } : s;
    }
    default: return null;
  }
}
