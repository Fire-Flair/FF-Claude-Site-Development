/* src/state/persistence.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   ROOT — persistence via the `db` capability.
   Each viewer's own state (role, session, profile, connections, invitations,
   selection) lives under their private
   data/users/{self} subtree, so a reload or a later visit picks up where
   they left off. Demo directory/venues/services stay static — not persisted.
   v1.1: FF Team only. FF Staff, FF Party, VIP and admin keys are no longer saved.
   ========================================================================== */

const PERSIST_KEYS = ["coClaims17", "venueReview17", "feedback", "profileQuestions", "auth", "role", "route", "tab", "session", "profile", "connections", "invitations", "reviews", "reviewRequests", "categoryVisibility", "trainingInterest", "jobsInterest", "teamInvites", "joinedPeople", "profileEdit", "staffNotify", "rewardsInterest", "workPostcode", "availabilityAsks", "notesSeenAt", "netAdds17", "teamAsks17", "myCocktails", "myServices", "myPosts", "devDone", "myTerms17", "svcTerms17", "qa17", "goldClaims17", "coTeams17", "notesDone17", "coNetNotes17", "sampleOff17", "teamAsksIn17", "teamAskNotes17", "reviewAsks17"];



function pickPersisted(state) {
  const out = {};
  PERSIST_KEYS.forEach(k => { out[k] = state[k]; });
  return out;
}
