/* src/state/store.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const initialState = {
  role: null,
  route: "entry",
  tab: "home",
  session: { refTag: null, channel: "web", phone: "", verified: false, tag: "" },
  /* Authentication — real app state, written only by AUTH_ADAPTER results.
     The nav reads auth.status and nothing else. */
  auth: { status: "signedOut", tag: null, method: null },
  vipClaims: [],
  profile: {
    name: "", photo: null, theme: "ivory", tier: "standard", level: 3,
    hasCar: false, live: false, cardShade: "slate",
    xp: 0, xpClaimed: [], xpLog: [], answers: {}, media: [],
    /* Quarterly XP: xpPeriod is the CURRENT quarter's running total — what
       resets. xpPeriodKey remembers which quarter that total belongs to, so
       a new quarter is detected automatically. xpHistory archives every
       past quarter's final total; nothing here ever deletes xp/xpLog, the
       all-time record. */
    xpPeriod: 0, xpPeriodKey: xpPeriodKey(XP_CURRENT_PERIOD), xpHistory: [],
    records: emptyRecords(), categories: {}, extraction: null, aiQuestions: [],
    about: "",          // personal summary — from FireFlair / CV, or written by hand
  },
  /* Feedback Question Card answers — product research, not profile data. */
  feedback: {},
  connections: [], invitations: [], reviews: [], reviewRequests: [],
  /* Questions visitors ask on a profile ("Ask a question") — one Question
     Card each, tied to that person: { id, personId, text, askedAt, by, answer }. */
  profileQuestions: [],
  /* Section show/hide state — one map, reused by every horizontal card
     section (profession groups, feed sections, rankings, etc). A key that
     isn't present defaults to visible; FF Staff seeds a few keys hidden here
     rather than deleting those categories anywhere. */
  categoryVisibility: {
    staff_Chefs: false, staff_Services: false, "staff_Back of House": false,
  },
  directory: DIRECTORY,
  selection: [],
  events: DEMO_EVENTS, shifts: DEMO_SHIFTS, engagements: DEMO_ENGAGEMENTS, af17: { shf_v2: { id: "af_v2", shiftId: "shf_v2", eventId: "evt_vdin", status: "matching", replacement: false, needBatch: false, exhausted: false, startedAt: Date.now() - 6 * 3600000, batches: [{ n: 1, at: Date.now() - 6 * 3600000, size: 10, respondBy: Date.now() + 18 * 3600000, selectBy: Date.now() + 7 * 86400000 - 6 * 3600000 }] }, shf_9: { id: "af_demo", shiftId: "shf_9", eventId: "evt_wedding", status: "matching", replacement: false, needBatch: false, exhausted: false, startedAt: Date.now() - 6 * 36e5, batches: [{ n: 1, at: Date.now() - 6 * 36e5, size: 10, respondBy: Date.now() + 18 * 36e5, selectBy: Date.now() + 7 * 864e5 - 6 * 36e5 }] } },
  /* FireFlair credits — bought before availability is sent, used only when a
     Service Card is confirmed. balance never includes money for anyone's pay. */
  credits: { balance: 0, log: [] },
  company: null,
  activeEventId: null,
  site: "staff",          // v16.13: which hirer site, "staff" (FF Staff) or "party" (FF Party)
  viewing: null,
  toast: null,
  /* Where the FF sheet just sent the person — { target } — consumed once by
     the Profile screen that owns that section. UI only; never persisted. */
  focus: null,
  /* Network search text — shared so Home's FireFlair can hand a search over. */
  netQuery: "",
  /* Home early access (v16.8): FF Party Event Cards saved as leads, and the
     training events someone registered interest in. Contact numbers are
     stored masked here; Core holds the real number. */
  partyEvents: [],
  trainingInterest: null,
  /* FF VIP list (v16.9) — same shape as trainingInterest. */
  vipInterest: null,
  jobsInterest: null,
  cocktailMenu: null,
  partyDraft: null,       // v16.15: the quick Event Card builder's draft (not persisted)     // v16.15: cocktails chosen before an Event Card is saved — { picks, mode, count }     // v16.14: Dream jobs — { jobs: [ids], dream: [text], contact, at }
  /* Team invitations (v16.11) — "Add to team" is two-way. Each invitation
     carries the sender's answers and review, and stays "pending" until the
     other person accepts on WhatsApp; only then are they connected and the
     review goes on their profile.
     { id, personId, name, tag, note, workedBefore, workAgain, howTo, review, at, status, acceptedAt } */
  teamInvites: [],
  /* Viewing your own profile the way a guest sees it (after publishing). */
  viewingAsGuest: false,
  _hydrated: false,
};



const withRecords = (s, cat, list) => ({
  ...s, profile: { ...s.profile, records: { ...s.profile.records, [cat]: list } },
});



/* Claim a task once. Re-claiming is a no-op, so XP can never be farmed by
   repeating the same action. Every award lands in xpLog for Core to read. */
/* Quarter rollover — if the profile's stored xpPeriodKey no longer matches
   the live current quarter, archive that period's final total into history
   and start the new quarter at 0. All-time xp/xpLog are untouched: this
   only ever resets the CURRENT-period counter. */
function rollXPPeriodIfNeeded(profile) {
  const liveKey = xpPeriodKey(XP_CURRENT_PERIOD);
  if (profile.xpPeriodKey === liveKey) return profile;
  const closed = { period: profile.xpPeriodKey, xp: profile.xpPeriod || 0 };
  return {
    ...profile,
    xpPeriod: 0,
    xpPeriodKey: liveKey,
    xpHistory: [...(profile.xpHistory || []), closed],
  };
}



function claimXP(s, taskId, amount) {
  const claimed = s.profile.xpClaimed || [];
  if (claimed.includes(taskId)) return s;
  const planned = amount === undefined ? XP_VALUES.task : amount;
  /* FF XP Beta: points as before. Each award is logged with its date;
     PHASE1.xpLive false would record the activity without points. */
  const xp = PHASE1.xpLive ? planned : 0;
  return {
    ...s,
    profile: {
      ...s.profile,
      xp: (s.profile.xp || 0) + xp,
      xpPeriod: (s.profile.xpPeriod || 0) + xp,
      xpClaimed: [...claimed, taskId],
      xpLog: [...(s.profile.xpLog || []), { id: taskId, xp, planned, at: Date.now() }],
    },
  };
}



/* Claim the matching "Add …" task once a category holds real (non-proposed)
   records, however they were added — card editor, review screen or CV. Uses
   the existing claim-once system, so XP can never be awarded twice. */
function claimListXP(s, cat, list) {
  const id = xpTaskFor(cat);
  if (!XP_TASKS.some(t => t.id === id)) return s;
  if (!(list || []).some(r => r && !r.proposed && String(r.name || "").trim())) return s;
  return claimXP(s, id);
}



function reducer(s, a) {
  if (a.type === "PROFILE" && a.patch && typeof a.patch.about === "string") a = { ...a, patch: { ...a.patch, about: a.patch.about.slice(0, BIO_MAX) } };
  /* v1.2: Edit Profile actions (PE_*) */
  if (a.type && (a.type.startsWith("PE_") || a.type.startsWith("P1_"))) { const r = p1EditReducer(s, a); if (r) return r; }
  /* v16.12: a Company Card's information uses the same card records as an
     FF Team profile. REC_* actions with owner "company" run the normal
     record logic against company.records (no FF Team XP is awarded). */
  if (a && a.owner === "company" && /^REC_/.test(a.type)) {
    const c = s.company || {};
    const out = reducer({ ...s, profile: { ...s.profile, records: c.records || {} } }, { ...a, owner: undefined });
    return { ...s, company: { ...c, records: out.profile.records } };
  }
  { const r11 = v11Reducer(s, a); if (r11) return r11; }
  { const rq = qa17Reducer(s, a) || pc17Reducer(s, a) || cov17Reducer(s, a) || ct17Reducer(s, a) || base17Reducer(s, a); if (rq) return rq; }
  switch (a.type) {
    case "FOCUS":     return { ...s, focus: a.focus };
    case "NET_QUERY": return { ...s, netQuery: a.q || "" };
    case "ROLE":      if (a.role === "staff" && !p1SiteOpen(a.site || "staff")) return { ...s, toast: `${p1SiteName(a.site || "staff")} is coming in 2027` };
                      return { ...s, viewing: null, role: a.role, site: a.role === "staff" ? (a.site || "staff") : s.site, tab: "home", route: a.role === "team" ? (s.profile.live ? "live" : "entry") : "staffHome" };
    case "GO":        return { ...s, route: a.route };
    case "TAB":       return { ...s, viewing: null, tab: a.tab, route: a.route ?? s.route };
    case "SESSION":   return { ...s, session: { ...s.session, ...a.patch } };
    case "PROFILE":   return { ...s, profile: { ...s.profile, ...a.patch } };

    case "REC_ADD":   return claimXP(withRecords(s, a.category, addRanked(recsOf(s.profile, a.category), [a.record])), xpTaskFor(a.category));
    case "REC_PATCH":
      return withRecords(s, a.category, recsOf(s.profile, a.category).map(r => r.id === a.id ? { ...r, ...a.patch } : r));
    case "REC_DELETE":
      return withRecords(s, a.category, recsOf(s.profile, a.category).filter(r => r.id !== a.id));
    case "REC_ACCEPT": {
      const list = recsOf(s.profile, a.category).map(r => r.id === a.id ? { ...r, proposed: false } : r);
      return claimListXP(withRecords(s, a.category, list), a.category, list);
    }
    case "REC_MOVE": {
      const list = [...recsOf(s.profile, a.category)];
      const i = list.findIndex(r => r.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return withRecords(s, a.category, list);
    }
    case "REC_BULK":  return claimListXP(withRecords(s, a.category, a.list), a.category, a.list);
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
          fresh.push({ ...r, name });
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
            } else if (empty(r[k]) && !empty(v)) out[k] = v;
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

    case "EVENT_ADD":  return { ...s, events: [...s.events, a.event], activeEventId: a.event.id };
    case "EVENT_PATCH": return { ...s, events: s.events.map(e => e.id === a.id ? { ...e, ...a.patch } : e) };
    case "ACTIVE_EVENT": return { ...s, activeEventId: a.id, viewing: null };
    case "SHIFT_ADD":  return { ...s, shifts: [...s.shifts, a.shift] };
    case "SHIFT_PATCH": return { ...s, shifts: s.shifts.map(x => x.id === a.id ? { ...x, ...a.patch } : x) };
    case "SHIFT_DELETE": return { ...s, shifts: s.shifts.filter(x => x.id !== a.id) };
    case "SHIFT_DUPLICATE": {
      const src = s.shifts.find(x => x.id === a.id);
      if (!src) return s;
      const copy = { ...src, id: uid("shf"), staffId: a.staffId || "", skills: [...(src.skills || [])] };
      const i = s.shifts.findIndex(x => x.id === a.id);
      const shifts = [...s.shifts]; shifts.splice(i + 1, 0, copy);
      return { ...s, shifts, toast: "Service Card duplicated — amend it and assign someone" };
    }

    case "CREDITS_BUY": return {
      ...s, credits: {
        balance: (s.credits?.balance || 0) + a.n,
        log: [...(s.credits?.log || []), { kind: "bought", n: a.n, at: Date.now() }],
      },
    };

    /* Send one Availability Card per Service Card, each to the person assigned
       to it. Each request reserves a credit; nothing is used until they confirm. */
    case "SEND_REQUESTS": {
      const now = Date.now();
      const made = a.shiftIds.map(id => {
        const sh = s.shifts.find(x => x.id === id);
        return {
          id: uid("eng"), shiftId: id, staffId: sh.staffId, state: "requested", credit: true,
          sentAt: now, expiresAt: now + RESPONSE_MS, questions: a.questions || [],
          history: [{ state: "requested", at: now }],
        };
      });
      const sentStaff = made.map(m => m.staffId);
      return { ...s, engagements: [...s.engagements, ...made], selection: s.selection.filter(x => !sentStaff.includes(x)) };
    }
    case "REQUESTS": {
      const made = a.staffIds.map(sid => ({
        id: uid("eng"), shiftId: a.shiftId, staffId: sid,
        state: "requested", history: [{ state: "requested", at: Date.now() }],
      }));
      return { ...s, engagements: [...s.engagements, ...made], selection: [] };
    }
    case "ENG_STATE": {
      let credits = s.credits || { balance: 0, log: [] };
      const engagements = s.engagements.map(e => {
        if (e.id !== a.id) return e;
        let next = { ...e, state: a.state, history: [...e.history, { state: a.state, at: Date.now() }] };
        /* A credit is used only on a confirmed response, and only once. */
        if (a.state === "confirmed" && e.credit && !e.creditUsed) {
          next.creditUsed = true;
          credits = { balance: Math.max(0, credits.balance - 1), log: [...credits.log, { kind: "used", n: 1, shiftId: e.shiftId, at: Date.now() }] };
        }
        return next;
      });
      return { ...s, engagements, credits };
    }
    /* Requests with no reply inside the response window expire; their
       credit is released back for a replacement or a future booking. */
    case "EXPIRE_DUE": {
      const now = Date.now();
      const due = s.engagements.some(e => e.state === "requested" && e.credit && e.expiresAt && e.expiresAt <= now);
      if (!due) return s;
      return {
        ...s, engagements: s.engagements.map(e => e.state === "requested" && e.credit && e.expiresAt && e.expiresAt <= now
          ? { ...e, state: "expired", history: [...e.history, { state: "expired", at: now }] } : e),
      };
    }
    case "COMPANY_SAVE": return V101.vipClaim20({ ...s, company: { ...(s.company || {}), ...a.company } }, a.company);
    /* A business signs in with its company name (its page address) and a
       verified phone number: the business equivalent of an FF Tag. */
    case "COMPANY_SIGNED_IN": return { ...s, auth: { status: "signedIn", tag: a.slug, method: "company" }, company: { ...(s.company || {}), verified: true } };
    case "COMPANY_REVIEW_ADD": return { ...s, company: { ...s.company, reviews: [a.review, ...((s.company && s.company.reviews) || [])] } };

    case "PUBLISH_XP": return claimXP(s.profile.name ? claimXP(s, "create_card") : s, "publish_profile");
    case "CARD_CREATED_XP": return claimXP(s, "create_card");
    case "ASK_QUESTION": return { ...s, profileQuestions: [...(s.profileQuestions || []), a.q] };
    case "MY_QUESTION_ADD": {
      const list = s.profile.aiQuestions || [];
      if (list.filter(x => x.mine).length >= 10) return s;
      const nq = { id: a.question.id, text: a.question.text, type: a.question.type === "yesno" ? "choice" : "text", mine: true, answer: a.value };
      return { ...s, profile: { ...s.profile, aiQuestions: [...list, nq] } };
    }
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
      /* +1 XP the first time a question is answered, never on edits. */
      return isAnswered(prevVal) ? next : claimXP(next, `question_${a.qid}`, XP_VALUES.question);
    }
    case "AI_QUESTION_ADD": {
      const list = s.profile.aiQuestions || [];
      if (list.some(x => x.text.toLowerCase() === a.q.text.toLowerCase())) return s;
      const next = { ...s, profile: { ...s.profile, aiQuestions: [...list, a.q] } };
      return isAnswered(a.q.answer) ? claimXP(next, `question_${a.q.id}`, XP_VALUES.question) : next;
    }
    case "CONNECT":   return { ...s, connections: [...s.connections, ...a.people] };
    case "REVIEW_ADD": {
      const next = { ...s, reviews: [...s.reviews, a.review] };
      return a.review.aboutId === "me" ? claimXP(next, "first_review") : next;
    }
    case "REVIEW_REQUEST": return { ...s, reviewRequests: [...s.reviewRequests, a.request] };
    case "INVITE":    return { ...s, invitations: [...s.invitations, ...a.people] };
    /* Phase 1 preview: someone you invited joins. They are added to your
       network automatically (and you to theirs) — no search, no second request. */
    case "INVITE_JOINED": {
      const p = a.person;
      return { ...s,
        directory: s.directory.some(x => x.id === p.id) ? s.directory : [...s.directory, p],
        joinedPeople: [...(s.joinedPeople || []).filter(x => x.id !== p.id), p],
        connections: s.connections.some(c => c.id === p.id) ? s.connections : [...s.connections, { id: p.id, name: p.name, onFF: true, tag: p.tag, viaInvite: true }],
        invitations: s.invitations.map(c => `inv_${c.id}` === p.id ? { ...c, onFF: true, joined: true } : c) };
    }
    case "VIEW":      return { ...s, viewing: a.id, viewingAsGuest: !!(a.id && a.guest) };
    case "TEAM_INVITE": return { ...s, teamInvites: [...(s.teamInvites || []).filter(i => i.personId !== a.invite.personId || i.status === "accepted"), a.invite] };
    case "TEAM_INVITE_ACCEPT": {
      const inv = (s.teamInvites || []).find(i => i.id === a.id);
      if (!inv || inv.status === "accepted") return s;
      const invites = s.teamInvites.map(i => i.id === a.id ? { ...i, status: "accepted", acceptedAt: Date.now() } : i);
      const connections = s.connections.some(c => c.id === inv.personId) ? s.connections
        : [...s.connections, { id: inv.personId, name: inv.name, note: inv.note, onFF: true, tag: inv.tag }];
      return { ...s, teamInvites: invites, connections };
    }
    case "SEED_DEMO": {
      /* The demo profile is complete, so it carries the XP its data has earned. */
      let n = {
      ...s, role: "team", tab: "home", route: "home", viewing: null,
      session: { ...s.session, tag: "SAM42", phone: "+44 7700 900412", verified: true },
      auth: { status: "signedIn", tag: "SAM42", method: "demo" },
      profile: { ...s.profile, media: (s.profile.media || []).length ? s.profile.media : DEMO_GALLERY.Bartenders.filter(k => (window.FF_IMG || {})[k]).map(k => ({ id: "dm_me_" + k, name: "", dataUrl: window.FF_IMG[k] })), about: s.profile.about || "Freelance bartender for events across London. Cocktails, big bars and a good crowd.", name: "Sam Morgan", live: true, theme: "ivory", tier: "gold", level: 5, hasCar: true, photo: FACE_PHOTOS.demo, records: DEMO_RECORDS(), categories: {} },
      connections: [
        { id: "stf_ava", name: "Ava Clarke", note: "Senior Bartender", onFF: true, tag: "AVA03" },
        { id: "stf_tom", name: "Tom Beatson", note: "DJ & Music Producer", onFF: true, tag: "TOMBE" },
        { id: "stf_mia", name: "Mia Santos", note: "Silver Service Waiter", onFF: true, tag: "MIAS1" },
        { id: "stf_pri", name: "Priya Raman", note: "MC & Event Host", onFF: true, tag: "PRIYA" },
        { id: "stf_idr", name: "Idris Bello", note: "Head Chef", onFF: true, tag: "IDRIS" },
      ],
      reviews: [
        { id: "rev_1", aboutId: "me", byId: "stf_ava", byName: "Ava Clarke", rating: 5, text: "Ran the bar for our launch night without a single hiccup — fast, clean, and great with the guests.", at: Date.now() - 12 * 864e5 },
        { id: "rev_2", aboutId: "me", byId: "stf_pri", byName: "Priya Raman", rating: 5, text: "One of the most reliable bartenders I've worked events with. Always early, always prepped.", at: Date.now() - 40 * 864e5 },
      ],
      };
      ["create_card", "publish_profile", "first_review"].forEach(id => { n = claimXP(n, id); });
      Object.keys(n.profile.records).forEach(cat => { n = claimListXP(n, cat, n.profile.records[cat]); });
      return n;
    }
    case "AUTH_SIGNED_IN": return { ...s, auth: { status: "signedIn", tag: a.tag, method: a.method }, session: { ...s.session, tag: s.session.tag || a.tag } };
    case "TOAST":     return { ...s, toast: a.toast };
    case "PARTY_EVENT_SAVE": return { ...s, partyEvents: [a.event, ...(s.partyEvents || [])] };
    case "TRAINING_INTEREST": return { ...s, trainingInterest: a.interest };
    case "VIP_INTEREST": return { ...s, vipInterest: a.interest };
    case "JOBS_INTEREST": return { ...s, jobsInterest: a.interest };
    case "COCKTAIL_MENU": return { ...s, cocktailMenu: a.menu };
    /* The cocktail menu: on the open Event Card, or a draft until one is saved. */
    case "COCKTAILS_PATCH": {
      const ev = s.events.find(e => e.id === s.activeEventId);
      if (ev) return { ...s, events: s.events.map(e => e.id === ev.id ? { ...e, cocktails: { ...emptyMenu(), ...(e.cocktails || {}), ...a.patch } } : e) };
      return { ...s, cocktailMenu: { ...emptyMenu(), ...(s.cocktailMenu || {}), ...a.patch } };
    }
    /* The quick Event Card builder's draft lives in the store, so leaving
       for the Cocktails page and coming back keeps everything. */
    case "PARTY_DRAFT": return { ...s, partyDraft: a.draft };
    case "PARTY_DRAFT_PATCH": {
      const cur = s.partyDraft || { mode: "new", card: { ...emptyEventCard(), occasion: "", host: (s.company && s.company.name) || "" } };
      return { ...s, partyDraft: { ...cur, card: { ...cur.card, ...a.patch } } };
    }
    case "RESET":     return { ...initialState, role: s.role, route: s.role === "team" ? "entry" : "staffHome" };
    /* Sign out: back to the signed-out home page with no role, no profile and
       no demo data, so the full sign-up flow can be walked through again.
       The referral tag from the link is kept. */
    case "SIGN_OUT":  return { ...initialState, session: { ...initialState.session, refTag: s.session.refTag }, toast: "Signed out" };
    case "HYDRATE":   return migrate1746({ ...s, ...a.patch, _hydrated: true });
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
    id: "me", name: profile.name || session.tag || "Your profile", tag: session.tag || "username",
    professions: primaryNames(profile, "professions", 3),
    profession: primaryNames(profile, "professions", 1)[0] || "Professional",
    group: "Your profile",
    tier: profile.tier, level: profile.level, years: null, rating: null, reviews: 0,
    skills: primaryNames(profile, "skills", 3),
    interests: primaryNames(profile, "interests", 3),
    languages: primaryNames(profile, "languages", 5).length ? primaryNames(profile, "languages", 5) : ["English"],
    locations: primaryNames(profile, "locations", 3).length ? primaryNames(profile, "locations", 3) : ["London"],
    base: baseLabelOf17(profile.base17 && FD_BY_ID[profile.base17.locId]),
    coverage: covForFd17(profile), coverageText: covText17(profile, 3),
    hasCar: profile.hasCar, availability: "open", photo: profile.photo, theme: profile.theme, about: profile.about || "",
    intro: profile.introduction || null,
    /* Top profession's confirmed display category, if the person set one. */
    categoryOverride: (recsOf(profile, "professions").filter(r => !r.proposed)[0] || {}).displayCategory,
    /* Display-only: where they've worked, read from Experience records. */
    experience: recsOf(profile, "experience").filter(r => !r.proposed).map(r => String(r.name).split(" — ")[0]).slice(0, 2),
  };
}
