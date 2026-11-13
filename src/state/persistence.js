/* src/state/persistence.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   ROOT — persistence via the `db` capability.
   Each viewer's own state (role, session, profile, connections, invitations,
   events, shifts, engagements, selection) lives under their private
   data/users/{self} subtree, so a reload or a later visit picks up where
   they left off. Demo directory/venues/services stay static — not persisted.
   ========================================================================== */

const PERSIST_KEYS = ["admin17", "vip21", "vipClaims", "feedback", "profileQuestions", "auth", "role", "route", "tab", "session", "profile", "connections", "invitations", "reviews", "reviewRequests", "events", "shifts", "engagements", "categoryVisibility", "credits", "company", "activeEventId", "site", "partyEvents", "trainingInterest", "jobsInterest", "cocktailMenu", "vipInterest", "teamInvites", "joinedPeople", "profileEdit", "staffNotify", "rewardsInterest", "workPostcode", "availabilityAsks", "notesSeenAt", "favs", "netAdds17", "teamAsks17", "myCocktails", "myServices", "myPosts", "devDone", "admin17", "myTerms17", "svcTerms17", "fd", "qa17", "goldClaims17", "coTeams17", "specialReq17", "notesDone17", "coNetNotes17"];



function pickPersisted(state) {
  const out = {};
  PERSIST_KEYS.forEach(k => { out[k] = state[k]; });
  return out;
}
