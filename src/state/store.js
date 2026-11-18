/* src/state/store.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const initialState = {
  role: null,
  route: "entry",
  tab: "home",
  session: { refTag: null, refKind: null, channel: "web", phone: "", verified: false, tag: "" },
  /* Authentication — real app state, written only by AUTH_ADAPTER results.
     The nav reads auth.status and nothing else. */
  auth: { status: "signedOut", tag: null, method: null },
  profile: {
    name: "", photo: null, theme: "ivory", tier: "standard", level: 3,
    hasCar: false, live: false, cardShade: "slate",
    xpClaimed: [], answers: {}, media: [],
    records: emptyRecords(), categories: {}, extraction: null, aiQuestions: [],
    about: "",          // personal summary — from FireFlair / CV, or written by hand
  },
  /* Feedback Question Card answers — product research, not profile data. */
  feedback: {},
  teamAsksIn17: [],
  /* What I typed when answering a team invitation sent to me: { [ask id]: text }. */
  teamAskNotes17: {},
  /* My decision on a review written about me: { [review id]: { show, text, at } }. */
  reviewAsks17: {},
  /* Reviews: { id, aboutId, byId, byName, worked, rating, text, status, at, shiftId }
     worked true | false; rating 1..5, or null when worked is false; status "pending" | "accepted" | "declined".
     A saved review with no status counts as accepted. A review I write about someone waits for them ("pending"). */
  connections: [], invitations: [], reviews: DEMO_REVIEWS_SIMAO.slice(), reviewRequests: [],
  /* Questions visitors ask on a profile ("Ask a question") — one Question
     Card each, tied to that person: { id, personId, text, askedAt, by, answer }. */
  profileQuestions: [],
  /* Section show/hide state — one map, reused by every horizontal card
     section (profession groups, feed sections, rankings, etc). A key that
     isn't present defaults to visible. */
  categoryVisibility: {},
  directory: DIRECTORY,
  selection: [],
  /* v1.1: FF Staff bookings are not in FF Team. The lists stay (empty) because FF Team code still reads them. */
  events: [], shifts: [], engagements: [],
  company: null,
  viewing: null,
  toast: null,
  /* Where the FF sheet just sent the person — { target } — consumed once by
     the Profile screen that owns that section. UI only; never persisted. */
  focus: null,
  /* Network search text — shared so Home's FireFlair can hand a search over. */
  netQuery: "",
  /* Training and Dream jobs interest (Grow with FireFlair). */
  trainingInterest: null,
  jobsInterest: null,
  /* Team invitations (v16.11) — "Add to team" is two-way. Each invitation
     stays "pending" until the other person accepts; only then are they connected and
     my pending reviews of them are accepted. Sending one also adds them to my network.
     { id, personId, name, tag, note, at, status, acceptedAt } (older saved ones may carry workedBefore, workAgain, howTo, rating, review) */
  teamInvites: [],
  /* Viewing your own profile the way a guest sees it (after publishing). */
  viewingAsGuest: false,
  _hydrated: false,
};



/* Where a Question Card answer's Public / Private lives: on the person's own question, otherwise in profile.qaVis17. */
function setQaVis17(s, qid, vis) {
  const v = vis === "public" ? "public" : "private";
  const ai = s.profile.aiQuestions || [];
  if (ai.some(x => x.id === qid && x.mine)) return { ...s, profile: { ...s.profile, aiQuestions: ai.map(x => x.id === qid ? { ...x, visibility: v } : x) } };
  return { ...s, profile: { ...s.profile, qaVis17: { ...(s.profile.qaVis17 || {}), [qid]: v } } };
}


/* Public or private. Default private; the Interests cards ("int.…") default to public. */
function qaVisOf17(state, q) {
  if (!q || q.group === "feedback") return "private";
  const id = String(q.id || "");
  if (q.mine) { const x = (state.profile.aiQuestions || []).find(y => y.id === id); return x && x.visibility === "public" ? "public" : "private"; }
  const v = (state.profile.qaVis17 || {})[id];
  return v || (id.startsWith("int.") ? "public" : "private");
}


const withRecords = (s, cat, list) => ({
  ...s, profile: { ...s.profile, records: { ...s.profile.records, [cat]: list } },
});



/* v1.1: no XP points. A task is still recorded once in profile.xpClaimed: the profile builder reads it to know
   whether this is the first Profile Card, first publish or first record of a kind (its toasts and first-time steps). */
function claimXP(s, taskId) {
  const claimed = s.profile.xpClaimed || [];
  if (claimed.includes(taskId)) return s;
  return { ...s, profile: { ...s.profile, xpClaimed: [...claimed, taskId] } };
}



/* Claim the matching "Add …" task once a category holds real (non-proposed)
   records, however they were added — card editor, review screen or CV. Uses
   the existing claim-once record. */
function claimListXP(s, cat, list) {
  const id = xpTaskFor(cat);
  if (!XP_TASKS.some(t => t.id === id)) return s;
  if (!(list || []).some(r => r && !r.proposed && String(r.name || "").trim())) return s;
  return claimXP(s, id);
}



function reducer(s, a) {
  return claim17Post(s, notesWatch17(s, inv17Post(pkgGuard17(reducerCore17(s, a))), a), a);
}


function reducerCore17(s0, a) {
  const smp = sample17Pre(s0, a);
  if (smp.done) return smp.done;
  const s = smp.s;
  if (a.type === "PROFILE" && a.patch && typeof a.patch.about === "string") a = { ...a, patch: { ...a.patch, about: a.patch.about.slice(0, BIO_MAX) } };
  /* v1.2: Edit Profile actions (PE_*) */
  if (a.type && (a.type.startsWith("PE_") || a.type.startsWith("P1_"))) { const r = p1EditReducer(s, a); if (r) return r; }
  { const r11 = v11Reducer(s, a); if (r11) return r11; }
  { const rq = claim17Reducer(s, a) || inv17Reducer(s, a) || qa17Reducer(s, a) || pc17Reducer(s, a) || cov17Reducer(s, a) || ct17Reducer(s, a) || base17Reducer(s, a) || notes17Reducer(s, a); if (rq) return rq; }
  switch (a.type) {
    case "FOCUS":     return { ...s, focus: a.focus };
    case "NET_QUERY": return { ...s, netQuery: a.q || "" };
    /* v1.1: FF Team is the only role. */
    case "ROLE":      return a.role === "team" ? { ...s, viewing: null, role: "team", tab: "home", route: s.profile.live ? "live" : "entry" } : s;
    case "GO":        return { ...s, route: a.route };
    case "TAB":       return { ...s, viewing: null, tab: a.tab, route: a.route ?? s.route };
    case "SESSION":   return { ...s, session: { ...s.session, ...a.patch } };
    case "PROFILE":   return { ...s, profile: { ...s.profile, ...a.patch } };

    case "REC_ADD":   return claimXP(withRecords(s, a.category, addRanked(recsOf(s.profile, a.category), [capRec17(a.category, a.record)])), xpTaskFor(a.category));
    case "REC_PATCH":
      return withRecords(s, a.category, recsOf(s.profile, a.category).map(r => r.id === a.id ? (a.patch && a.patch.name ? capRec17(a.category, { ...r, ...a.patch }) : { ...r, ...a.patch }) : r));
    case "REC_DELETE":
      return withRecords(s, a.category, recsOf(s.profile, a.category).filter(r => r.id !== a.id));
    case "REC_ACCEPT": {
      const list = recsOf(s.profile, a.category).map(r => r.id === a.id ? { ...r, proposed: false } : r);
      return claimListXP(withRecords(s, a.category, list), a.category, list);
    }
    case "REC_MOVE": {
      /* v17.19: { id, to } puts one entry at a place in the list the member sees. The order is the rank: the entries take their ranks from their new places. */
      if (a.to !== undefined) {
        const seen = withRanks(recsOf(s.profile, a.category)).map(e => e.r);
        const at = seen.findIndex(r => r.id === a.id);
        if (at < 0) return s;
        const [one] = seen.splice(at, 1);
        seen.splice(Math.max(0, Math.min(a.to, seen.length)), 0, one);
        let k = 0;
        return withRecords(s, a.category, seen.map(r => (r.hidden || r.proposed) ? r : { ...r, rank: cardRank(k++) }));
      }
      const list = [...recsOf(s.profile, a.category)];
      const i = list.findIndex(r => r.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return withRecords(s, a.category, list);
    }
    /* One place left or right in the order people see (a company's card sections). The cards take their tiers from their new places. */
    case "REC_SHIFT": {
      const list = withRanks(recsOf(s.profile, a.category)).map(e => e.r);
      const i = list.findIndex(r => r.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length || list[i].hidden || list[j].hidden) return s;
      [list[i], list[j]] = [list[j], list[i]];
      let k = 0;
      return withRecords(s, a.category, list.map(r => (r.hidden || r.proposed) ? r : { ...r, rank: cardRank(k++) }));
    }
    case "REC_BULK":  { const capped = (a.list || []).map(r => capRec17(a.category, r)); return claimListXP(withRecords(s, a.category, capped), a.category, capped); }
    /* New information joins the ONE profile — from FireFlair, a CV or a card.
       A name the profile already holds is never duplicated (the existing
       record keeps its description, media and documents). New items join
       the end of the row; the person moves them left to feature them. */
    case "RECORDS_MERGE": {
      const next = { ...s.profile.records };
      Object.entries(a.byCategory).forEach(([cat, list]) => {
        const cur = [...(next[cat] || [])];
        const fresh = [];
        (list || []).forEach(r => {
          const name = String((r && r.name) || "").trim();
          if (!name || [...cur, ...fresh].some(x => x.name.toLowerCase() === name.toLowerCase() || sameAttr(x.name, name))) return;
          fresh.push(capRec17(cat, { ...r, name }));
        });
        /* v1.2: new cards get a guessed tier (Primary, then Secondary, then Tertiary). */
        next[cat] = fresh.length ? addRanked(cur, fresh) : cur;
      });
      let out = { ...s, profile: { ...s.profile, records: next } };
      Object.keys(a.byCategory).forEach(cat => { out = claimListXP(out, cat, next[cat]); });
      return out;
    }
    /* We found more about a card the profile already holds: fill only
       the fields that are EMPTY. Nothing the person wrote is overwritten. */
    case "RECORDS_FILL": {
      const next = { ...s.profile.records };
      const empty = (v) => v === undefined || v === null || (Array.isArray(v) ? !v.length : String(v).trim() === "");
      (a.fills || []).forEach(({ category, id, patch }) => {
        next[category] = (next[category] || []).map(r => {
          if (r.id !== id) return r;
          const out = { ...r };
          Object.entries(patch || {}).forEach(([k, v]) => {
            if (k === "details") {
              const cur = r.details || {}, add = {};
              Object.entries(v || {}).forEach(([dk, dv]) => { if (empty(cur[dk]) && !empty(dv)) add[dk] = dv; });
              out.details = { ...cur, ...add };
            } else if (empty(r[k]) && !empty(v)) out[k] = k === "name" ? capWords17(v) : v;
          });
          return out;
        });
      });
      return { ...s, profile: { ...s.profile, records: next } };
    }

    case "SELECT": {
      const on = s.selection.includes(a.id);
      return { ...s, selection: on ? s.selection.filter(x => x !== a.id) : [...s.selection, a.id] };
    }
    case "CLEAR_SELECTION": return { ...s, selection: [] };
    case "SELECT_ADD": return s.selection.includes(a.id) ? s : { ...s, selection: [...s.selection, a.id] };
    case "TOGGLE_CATEGORY":
      return { ...s, categoryVisibility: { ...s.categoryVisibility, [a.key]: a.visible ?? !(s.categoryVisibility[a.key] !== false) } };
    case "MEDIA_ADD":    return { ...s, profile: { ...s.profile, media: [...(s.profile.media || []), a.item] } };
    case "MEDIA_DELETE": return { ...s, profile: { ...s.profile, media: (s.profile.media || []).filter(m => m.id !== a.id) } };

    case "COMPANY_SAVE": return V101.vipClaim20({ ...s, company: { ...(s.company || {}), ...a.company } }, a.company);
    /* A business signs in with its company name (its page address) and a
       verified phone number: the business equivalent of an FF Tag. */
    case "COMPANY_SIGNED_IN": return { ...s, auth: { status: "signedIn", tag: a.slug, method: "company" }, company: { ...(s.company || {}), verified: true } };

    case "PUBLISH_XP": return claimXP(s.profile.name ? claimXP(s, "create_card") : s, "publish_profile");
    case "CARD_CREATED_XP": return claimXP(s, "create_card");
    case "ASK_QUESTION": return { ...s, profileQuestions: [...(s.profileQuestions || []), a.q] };
    case "MY_QUESTION_ADD": {
      const list = s.profile.aiQuestions || [];
      if (list.filter(x => x.mine).length >= 10) return s;
      const nq = { id: a.question.id, text: a.question.text, type: a.question.type === "yesno" ? "choice" : "text", mine: true, answer: a.value, visibility: a.visibility === "public" ? "public" : "private" };
      return { ...s, profile: { ...s.profile, aiQuestions: [...list, nq] } };
    }
    /* Edit your own question's text (the answer is changed the usual way, with ANSWER). */
    case "MY_QUESTION_EDIT": {
      const text = String(a.text || "").trim().slice(0, CUSTOM_QUESTION_MAX);
      if (!text) return s;
      return { ...s, profile: { ...s.profile, aiQuestions: (s.profile.aiQuestions || []).map(x => x.id === a.id && x.mine ? { ...x, text } : x) } };
    }
    /* Public / Private on one Question Card answer (or on one Interests card, id "int.<question>:<option>"). */
    case "QA_VIS": return setQaVis17(s, a.qid, a.visibility);
    /* A business answers a question asked on its Company page; the answer is public only when the business says so. */
    case "COQ_ANSWER": return { ...s, profileQuestions: (s.profileQuestions || []).map(q => q.id === a.id ? { ...q, answer: a.value, answeredAt: Date.now(), visibility: a.visibility === "public" ? "public" : "private" } : q) };
    case "MY_QUESTION_DELETE": return { ...s, profile: { ...s.profile, aiQuestions: (s.profile.aiQuestions || []).filter(x => x.id !== a.id) } };
    case "ANSWER": {
      const q = QUESTIONS.find(x => x.id === a.qid);
      const aiList = s.profile.aiQuestions || [];
      let prevVal, next;
      if (q && q.group === "feedback") {
        /* Feedback is product research — kept apart from the profile. */
        prevVal = (s.feedback || {})[a.qid];
        next = { ...s, feedback: { ...(s.feedback || {}), [a.qid]: a.value } };
      } else if (!q && aiList.some(x => x.id === a.qid)) {
        prevVal = aiList.find(x => x.id === a.qid).answer;
        next = { ...s, profile: { ...s.profile, aiQuestions: aiList.map(x => x.id === a.qid ? { ...x, answer: a.value } : x) } };
      } else {
        const prev = s.profile.answers || {};
        prevVal = prev[a.qid];
        const patch = { answers: { ...prev, [a.qid]: a.value } };
        /* The travel answer drives the card's car glyph. */
        if (a.qid === "g_travel") patch.hasCar = a.value === "I drive";
        next = { ...s, profile: { ...s.profile, ...patch } };
      }
      if (a.visibility && !(q && q.group === "feedback")) next = setQaVis17(next, a.qid, a.visibility);
      /* Recorded once, the first time a question is answered, never on edits. */
      return isAnswered(prevVal) ? next : claimXP(next, `question_${a.qid}`);
    }
    case "AI_QUESTION_ADD": {
      const list = s.profile.aiQuestions || [];
      if (list.some(x => x.text.toLowerCase() === a.q.text.toLowerCase())) return s;
      const next = { ...s, profile: { ...s.profile, aiQuestions: [...list, a.q] } };
      return isAnswered(a.q.answer) ? claimXP(next, `question_${a.q.id}`) : next;
    }
    case "CONNECT":   return { ...s, connections: [...s.connections, ...a.people] };
    case "REVIEW_ADD": {
      if (!inv17SignedIn(s) || !a.review) return s;
      const r0 = a.review;
      const rv = r0.status ? r0 : { ...r0, status: r0.byId === "me" && r0.aboutId !== "me" ? "pending" : "accepted" };
      /* One no-shift review per person from me: a new one replaces my earlier one. Reviews of a shift are untouched. */
      const keep = (s.reviews || []).filter(x => !(rv.byId === "me" && !rv.shiftId && x.byId === "me" && !x.shiftId && x.aboutId === rv.aboutId));
      const next = { ...s, reviews: [...keep, rv] };
      return rv.aboutId === "me" ? claimXP(next, "first_review") : next;
    }
    /* A review written while signed out is kept as a draft and posted at sign-in (rev17AtSignIn). */
    case "REVIEW_DRAFT": return inv17SignedIn(s) || !a.draft ? s : { ...s, session: { ...s.session, reviewDraft17: a.draft } };
    /* Show (accepted) or do not show (declined) a review written about me. Nothing is deleted. */
    case "REVIEW_DECIDE": {
      let next = { ...s, reviewAsks17: { ...(s.reviewAsks17 || {}), [a.id]: { show: !!a.show, text: a.text || "", at: Date.now() } } };
      if ((s.reviews || []).some(r => r.id === a.id)) next = { ...next, reviews: s.reviews.map(r => r.id === a.id ? { ...r, status: a.show ? "accepted" : "declined" } : r) };
      else if (a.show && a.review) next = claimXP({ ...next, reviews: [...(s.reviews || []), { ...a.review, status: "accepted" }] }, "first_review");
      return next;
    }
    case "REVIEW_REQUEST": return { ...s, reviewRequests: [...s.reviewRequests, a.request] };
    case "VIEW":      return { ...s, viewing: a.id, viewingAsGuest: !!(a.id && a.guest) };
    case "TEAM_INVITE": {
      if (!inv17SignedIn(s) || !a.invite) return s;
      const pid = a.invite.personId, n = s.netAdds17 || [];
      return { ...s, teamInvites: [...(s.teamInvites || []).filter(i => i.personId !== pid || i.status === "accepted"), a.invite], netAdds17: n.includes(pid) ? n : [...n, pid] };
    }
    case "TEAM_INVITE_ACCEPT": {
      const inv = (s.teamInvites || []).find(i => i.id === a.id);
      if (!inv || inv.status === "accepted") return s;
      const invites = s.teamInvites.map(i => i.id === a.id ? { ...i, status: "accepted", acceptedAt: Date.now() } : i);
      const connections = s.connections.some(c => c.id === inv.personId) ? s.connections
        : [...s.connections, { id: inv.personId, name: inv.name, note: inv.note, onFF: true, tag: inv.tag }];
      const reviews = (s.reviews || []).map(r => r.byId === "me" && r.aboutId === inv.personId && r.status === "pending" ? { ...r, status: "accepted" } : r);
      return { ...s, teamInvites: invites, connections, reviews };
    }
    /* Take someone out of one place: "network" (and any pending invitation), "pending" (they stay in my network),
       or "team" (both sides leave the team; they stay in my network). */
    case "CONN_REMOVE": {
      const n = s.netAdds17 || [], inv = s.teamInvites || [];
      if (a.from === "network") return { ...s, netAdds17: n.filter(x => x !== a.id), teamInvites: inv.filter(i => !(i.personId === a.id && i.status === "pending")) };
      if (a.from === "pending") return { ...s, teamInvites: inv.filter(i => !(i.personId === a.id && i.status === "pending")) };
      if (a.from === "team") return { ...s, connections: (s.connections || []).filter(c => c.id !== a.id), teamInvites: inv.filter(i => i.personId !== a.id), netAdds17: n.includes(a.id) ? n : [...n, a.id] };
      return s;
    }
    case "SEED_DEMO": {
      /* The demo profile is complete, so its first-time tasks are recorded as done. */
      let n = {
      ...s, role: "team", tab: "home", route: "home", viewing: null,
      session: { ...s.session, tag: "SAM42", phone: "+44 7700 900412", verified: true },
      auth: { status: "signedIn", tag: "SAM42", method: "demo" },
      profile: { ...s.profile, media: (s.profile.media || []).length ? s.profile.media : DEMO_GALLERY.Bartenders.filter(k => (window.FF_IMG || {})[k]).map(k => ({ id: "dm_me_" + k, name: "", dataUrl: window.FF_IMG[k] })), about: s.profile.about || "Freelance bartender for events across London. Cocktails, big bars and a good crowd.", name: "Sam Morgan", live: true, theme: "ivory", tier: "gold", level: 5, hasCar: true, photo: FACE_PHOTOS.demo, records: DEMO_RECORDS(), categories: {} },
      connections: [
        { id: "stf_gav", name: "Alexandru Gavrilas", note: "Bartender", onFF: true, tag: "GAVRILAS" },
        { id: "stf_bruno", name: "Bruno Cuartero", note: "Beverage / Bar Manager / Events", onFF: true, tag: "CUARTERO" },
        { id: "stf_simao", name: "Simao", note: "Mixologist", onFF: true, tag: "SIMAO" },
        { id: "stf_james", name: "James Allcott", note: "Cocktail Bartender", onFF: true, tag: "JAMESALL" },
      ],
      reviews: [
        { id: "rev_1", aboutId: "me", byId: "demo_rv_1", byName: "Ava Clarke", rating: 5, text: "Ran the bar for our launch night without a single hiccup — fast, clean, and great with the guests.", at: Date.now() - 12 * 864e5 },
        { id: "rev_2", aboutId: "me", byId: "demo_rv_2", byName: "Priya Raman", rating: 5, text: "One of the most reliable bartenders I've worked events with. Always early, always prepped.", at: Date.now() - 40 * 864e5 },
        ...DEMO_REVIEWS_SIMAO,
      ],
      };
      ["create_card", "publish_profile", "first_review"].forEach(id => { n = claimXP(n, id); });
      Object.keys(n.profile.records).forEach(cat => { n = claimListXP(n, cat, n.profile.records[cat]); });
      return n;
    }
    case "AUTH_SIGNED_IN": {
      const next = { ...s, auth: { status: "signedIn", tag: a.tag, method: a.method }, session: { ...s.session, tag: s.session.tag || a.tag } };
      return rev17AtSignIn(s, inv17AtSignIn(s, next, a), a);
    }
    case "TOAST":     return { ...s, toast: a.toast };
    case "TRAINING_INTEREST": return { ...s, trainingInterest: a.interest };
    case "JOBS_INTEREST": return { ...s, jobsInterest: a.interest };
    /* The cocktail menu: on the open Event Card, or a draft until one is saved. */
    /* Sign out: back to the signed-out home page with no role, no profile and
       no demo data, so the full sign-up flow can be walked through again.
       The invitation code from a link is cleared too: it belongs to the visit that used it. */
    case "SIGN_OUT":  return { ...initialState, toast: "Signed out", coClaims17: s.coClaims17, dirEdits17: s.dirEdits17, venueReview17: venueReviewKeep17(s) };
    /* v17.56: demo reviews of Simao missing from a saved state are added back by id (demo data). */
    case "HYDRATE":   { const h = { ...s, ...a.patch, _hydrated: true }; const have = new Set((h.reviews || []).map(r => r.id)); return migrate1746({ ...h, reviews: [...(h.reviews || []), ...DEMO_REVIEWS_SIMAO.filter(r => !have.has(r.id))] }); }
    default:          return s;
  }
}



const Store = createContext(null);


const useStore = () => useContext(Store);



/* The signed-in professional, presented in the same shape as a directory
   person, so one PlayerCard renderer serves both. Card values are READ from
   the primary records — never a second copy of them. */
function meAsStaff(profile, session) {
  return {
    id: "me", name: profile.name || session.tag || "Your profile", tag: session.tag || "username", headline: profile.headline || "",
    professions: primaryNames(profile, "professions", 3),
    profession: primaryNames(profile, "professions", 1)[0] || "Professional",
    group: "Your profile",
    tier: cardTier17({ name: profile.name, tag: session.tag }), level: profile.level, years: null, rating: null, reviews: 0,
    skills: primaryNames(profile, "skills", 3),
    interests: primaryNames(profile, "interests", 3),
    languages: primaryNames(profile, "languages", 5).length ? primaryNames(profile, "languages", 5) : ["English"],
    /* v17.6.1: no ranked "primary location". The base town (public label) stands in; with no base, the first ticked place in the tree's order; with neither, London as before. */
    locations: baseLabelOfOwner17(profile) ? [baseLabelOfOwner17(profile)] : (covPlaces17(profile)[0] ? [covPlaces17(profile)[0].name] : ["London"]),
    base: baseLabelOfOwner17(profile),
    /* v17.6: the public map point (centre of the public place, never the postcode point). */
    basePin: basePublicPoint17(profile),
    coverage: covForFd17(profile), coverageText: covText17(profile, 3),
    hasCar: profile.hasCar, availability: "open", photo: profile.photo, theme: profile.theme, about: profile.about || "",
    intro: profile.introduction || null,
    /* Top profession's confirmed display category, if the person set one. */
    categoryOverride: (recsOf(profile, "professions").filter(r => !r.proposed)[0] || {}).displayCategory,
    /* Display-only: where they've worked, read from Experience records. */
    experience: recsOf(profile, "experience").filter(r => !r.proposed).map(r => String(r.name).split(" — ")[0]).slice(0, 2),
  };
}
