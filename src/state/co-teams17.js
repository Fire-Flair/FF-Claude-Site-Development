/* src/state/co-teams17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COMPANY TEAMS (v17.4.6.1) — accepted company membership, for hospitality businesses generally.

   state.coTeams17 = [{ id, companyKey, companyName, personId, tag, name, phone, dir, status, at, decidedAt, ref }]
     companyKey  "co:<slug>" — the same key for a business signed in on FF Staff and its card in the network
     dir         "invite"  the business invited the person (they accept on FF Team)
                 "request" the person asked to join from the business profile (the business accepts on FF Staff)
     status      "pending" | "accepted" | "declined"
   Membership exists only once the recipient (invite) or the business (request) accepts. Confirmed or past shifts
   never create membership. An invitation to someone not yet on FireFlair is kept against their phone number and
   reaches them once they join FF Team with that number. One pending record per company and person, one roster
   entry per person. Booking availability and shift acceptance stay separate from membership.
   Production: Core owns these records and sends the invitations and requests through the same notification
   service as team invitations (WhatsApp template "company_team_invite" / "company_team_request").
   ========================================================================== */
/* A directory entry (id "co_vooshka") and the business signed in as that company (slug "vooshka") share one key. */
const coKey17 = (c) => { const nm = c && (c.slug || (/^co_/.test(c.id || "") ? String(c.id).slice(3) : "") || c.name); return nm ? "co:" + slugify(nm) : ""; };


const phoneKey17 = (p) => String(p || "").replace(/[^\d]/g, "").replace(/^0/, "44").slice(-12);


/* The business signed in on FF Staff (not FF Party hosts). */
const myCoKey17 = (s) => {
  if (!(s && s.role === "staff" && s.site !== "party" && s.auth && s.auth.status === "signedIn")) return "";
  return s.company && (s.company.name || s.company.slug) ? coKey17(s.company) : (s.auth.tag ? "co:" + slugify(s.auth.tag) : "");
};


/* Every key the signed-in business answers to: its slug, its name and its FF Tag. */
const myCoKeys17 = (s) => {
  if (!(s && s.role === "staff" && s.site !== "party" && s.auth && s.auth.status === "signedIn")) return [];
  const c = s.company || {};
  return [...new Set([myCoKey17(s), c.name ? "co:" + slugify(c.name) : "", c.slug ? "co:" + slugify(c.slug) : "", s.auth.tag ? "co:" + slugify(s.auth.tag) : ""].filter(Boolean))];
};


const ctAll17 = (s) => (s && s.coTeams17) || [];


/* Is this record about the signed-in FF Team member? (by id, FF Tag or verified phone) */
function ctIsMe17(s, x) {
  if (!s || !s.auth || s.auth.status !== "signedIn") return false;
  if (x.personId === "me") return true;
  if (x.tag && s.auth.tag && String(x.tag).toLowerCase() === String(s.auth.tag).toLowerCase()) return true;
  const mine = phoneKey17(s.session && s.session.phone);
  return !!(mine && x.phone && phoneKey17(x.phone) === mine);
}


const ctSame17 = (s, a, b) => a.companyKey === b.companyKey && ((a.personId && b.personId && a.personId === b.personId) || (a.phone && b.phone && phoneKey17(a.phone) === phoneKey17(b.phone)) || (a.tag && b.tag && String(a.tag).toLowerCase() === String(b.tag).toLowerCase()));


/* Accepted members of a company: person ids (only people with a published Profile Card are shown). */
const ctMembers17 = (s, companyKey) => [...new Set(ctAll17(s).filter(x => x.companyKey === companyKey && x.status === "accepted" && x.personId).map(x => x.personId))];


const ctPending17 = (s, companyKey) => ctAll17(s).filter(x => x.companyKey === companyKey && x.status === "pending");


/* Invitations from businesses waiting for the signed-in member (FF Team). */
const ctInvitesForMe17 = (s) => (s && s.role === "team") ? ctAll17(s).filter(x => x.dir === "invite" && x.status === "pending" && ctIsMe17(s, x)) : [];


/* Join requests waiting for the signed-in business (FF Staff). */
const ctRequestsForMe17 = (s) => { const ks = myCoKeys17(s); return ks.length ? ctAll17(s).filter(x => x.dir === "request" && x.status === "pending" && ks.includes(x.companyKey)) : []; };


/* The signed-in member's relation to a company: "member" | "requested" | "invited" | "". */
function ctMyStatus17(s, companyKey) {
  const mine = ctAll17(s).filter(x => x.companyKey === companyKey && ctIsMe17(s, x));
  if (mine.some(x => x.status === "accepted")) return "member";
  if (mine.some(x => x.status === "pending" && x.dir === "request")) return "requested";
  if (mine.some(x => x.status === "pending" && x.dir === "invite")) return "invited";
  return "";
}


function ct17Reducer(s, a) {
  if (!/^CT_/.test(a.type)) return null;
  const list = ctAll17(s), now = Date.now();
  if (a.type === "CT_INVITE" || a.type === "CT_REQUEST") {
    const rec = { id: uid("ct"), companyKey: a.companyKey, companyName: a.companyName || "", personId: a.personId || null, tag: a.tag || "", name: String(a.name || "").trim().slice(0, 60), phone: String(a.phone || "").trim().slice(0, 20),
      dir: a.type === "CT_INVITE" ? "invite" : "request", status: "pending", at: now, decidedAt: null, ref: "CT-" + Math.random().toString(36).slice(2, 8).toUpperCase() };
    if (!rec.companyKey || (!rec.personId && !rec.phone && !rec.tag)) return s;
    /* No duplicates: an existing member, or a pending invitation or request between the same two, wins. */
    if (list.some(x => ctSame17(s, x, rec) && (x.status === "accepted" || x.status === "pending"))) return s;
    return { ...s, coTeams17: [...list, rec] };
  }
  if (a.type === "CT_DECIDE") {
    const x = list.find(y => y.id === a.id);
    if (!x || x.status !== "pending") return s;
    /* Only the recipient accepts an invitation; only the business accepts a request. */
    if (x.dir === "invite" && !ctIsMe17(s, x)) return s;
    if (x.dir === "request" && !myCoKeys17(s).includes(x.companyKey)) return s;
    const personId = x.personId || (a.accept && ctIsMe17(s, x) ? "me" : null);
    const dupe = a.accept && list.some(y => y.id !== x.id && y.companyKey === x.companyKey && y.status === "accepted" && y.personId && y.personId === personId);
    return { ...s, coTeams17: list.map(y => y.id === x.id ? { ...y, personId, status: a.accept && !dupe ? "accepted" : a.accept ? "accepted-dupe" : "declined", decidedAt: now } : y).filter(y => y.status !== "accepted-dupe") };
  }
  if (a.type === "CT_ACCEPTED") {
    /* An accepted invitation recorded elsewhere (the sample team invitation from a company). */
    if (list.some(y => y.companyKey === a.companyKey && y.status === "accepted" && y.personId === a.personId)) return s;
    return { ...s, coTeams17: [...list, { id: uid("ct"), companyKey: a.companyKey, companyName: a.companyName || "", personId: a.personId, tag: a.tag || "", name: a.name || "", phone: "", dir: "invite", status: "accepted", at: now, decidedAt: now, ref: a.ref || "" }] };
  }
  return s;
}
