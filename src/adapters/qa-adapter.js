/* src/adapters/qa-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — QA_ADAPTER (v17.4.6)
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs):
   async save({ questionId, optionIds, text, typed, visibility, account, subjectId, contact, submissionRef })
         -> { ok, answer, duplicate } | { ok: false, reason, field }
   async withdraw({ questionId, account, submissionRef })   -> { ok, answer } | { ok: false, reason }
   async list({ account })                                   -> { ok, answers }
   Every Register interest action, the FF Staff preferred hourly rates and the guest interest forms go
   through this one adapter, keyed by a stable question id and stable option ids (QA_Q17 below).
   Live API (ff-team-phase-1/AUDIT.md §4): GET /api/user/questions and PUT /api/user/questions/:id/answer.
   What the live API still needs is listed in docs/handoff-v17.4.6.md (multi-select option ids, typed
   answers, visibility, withdrawal, guest submissions with contact and a submission reference).
   HONEST STATUS: not connected. The prototype keeps answers in state.qa17 (saved with the rest of this
   preview's data); the store write happens only after save() resolves ok. */

/* Stable question ids. Option ids are the existing catalogue ids (courses, jobs, rewards, packages). */
const QA_Q17 = {
  "int.training":       { text: "Are you interested in these training events?", group: "interest", multi: true, own: true },
  "int.jobs":           { text: "Are you interested in these jobs?", group: "interest", multi: true, own: true },
  "int.rewards":        { text: "Are you interested in these FF Rewards?", group: "interest", multi: true, own: true },
  "int.vip":            { text: "Are you interested in FF VIP?", group: "interest", multi: true, own: true, guest: true, contactOptional: true },
  "int.party_package":  { text: "Are you interested in performing FF Party packages?", group: "interest", multi: true },
  "int.biz_training":   { text: "Are you interested in training for your staff?", group: "interest", multi: true },
  "int.biz_rewards":    { text: "Are you interested in rewards for your staff?", group: "interest", multi: true },
  "int.planning":       { text: "Are you interested in these planning options?", group: "interest", multi: true },
  "int.area_expansion": { text: "Are you interested in FireFlair opening in your area?", group: "interest", multi: true, guest: true },
};


/* The FF Staff preferred hourly rate is a typed answer per profession: rate.<profession id>. */
const qaRateQid17 = (profName) => `rate.${professionId(profName)}`;


const QA_LIMITS17 = { options: 60, text: 500, rateMaxP: 100000 };


const qaKey17 = (account, questionId, subjectId) => `${account || "guest"}|${questionId}${subjectId ? `|${subjectId}` : ""}`;


const qaRef17 = () => "QA-" + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();


function qaValidate17(p) {
  const qid = String(p.questionId || "");
  const q = QA_Q17[qid];
  const isRate = /^rate\.prof\.[a-z0-9-]+$/.test(qid);
  if (!q && !isRate) return { reason: "unknown-question", field: "questionId" };
  if (!p.account && !(q && q.guest)) return { reason: "sign-in-required", field: "account" };
  if (isRate) {
    const v = p.typed && p.typed.pence;
    if (!(p.typed && p.typed.kind === "rate_gbp_hour" && Number.isInteger(v) && v > 0 && v <= QA_LIMITS17.rateMaxP)) return { reason: "invalid-rate", field: "typed" };
    return null;
  }
  const ids = p.optionIds || [];
  if (!Array.isArray(ids) || ids.length > QA_LIMITS17.options || ids.some(x => typeof x !== "string" || x.length > 80)) return { reason: "invalid-options", field: "optionIds" };
  const own = p.own || [];
  if (!Array.isArray(own) || own.length > 20 || own.some(x => typeof x !== "string" || x.length > 60)) return { reason: "invalid-own", field: "own" };
  if (String(p.text || "").length > QA_LIMITS17.text) return { reason: "text-too-long", field: "text" };
  if (q.guest && !p.account && !q.contactOptional) {
    const c = p.contact || {};
    if (!String(c.email || "").trim() && !String(c.phone || "").trim()) return { reason: "contact-required", field: "contact" };
  }
  return null;
}


const QA_ADAPTER = {
  available: false,
  async save(p) {
    await new Promise(r => setTimeout(r, 120));
    const bad = qaValidate17(p);
    if (bad) return { ok: false, ...bad };
    const at = new Date().toISOString();
    const answer = {
      id: p.answerId || uid("qa"), questionId: p.questionId, subjectId: p.subjectId || null,
      optionIds: (p.optionIds || []).slice(), own: (p.own || []).map(s => String(s).trim()).filter(Boolean),
      text: String(p.text || "").trim(), typed: p.typed || null,
      visibility: p.visibility || "private", account: p.account || null,
      contact: p.contact || null, submissionRef: p.submissionRef || qaRef17(),
      source: p.source || "", createdAt: p.createdAt || at, updatedAt: at, withdrawnAt: null,
    };
    return { ok: true, answer };
  },
  async withdraw(p) {
    await new Promise(r => setTimeout(r, 80));
    if (!p.questionId) return { ok: false, reason: "unknown-question" };
    return { ok: true, at: new Date().toISOString() };
  },
  async list() { return { ok: false, reason: "not-connected" }; },
};


/* ---- Store side: one reducer case for every Q&A write ---------------------------------------------
   QA_SAVE upserts by (account, questionId, subjectId). A repeated submissionRef is a retry and changes
   nothing. Older answers are kept in history, never overwritten in place. */
function qa17Reducer(s, a) {
  if (a.type !== "QA_SAVE" && a.type !== "QA_WITHDRAW") return null;
  const qa = s.qa17 || { v: 1, answers: {}, refs: {} };
  if (a.type === "QA_SAVE") {
    const x = a.answer, k = x.account ? qaKey17(x.account, x.questionId, x.subjectId) : `guest:${x.submissionRef}|${x.questionId}`;
    if (qa.refs[x.submissionRef]) return s;
    const prev = qa.answers[k];
    const next = prev ? { ...x, id: prev.id, createdAt: prev.createdAt, history: [...(prev.history || []), { ...prev, history: undefined }].slice(-20) } : { ...x, history: [] };
    return { ...s, qa17: { v: 1, answers: { ...qa.answers, [k]: next }, refs: { ...qa.refs, [x.submissionRef]: next.id } } };
  }
  const k = qaKey17(a.account, a.questionId, a.subjectId), prev = qa.answers[k];
  if (!prev || prev.withdrawnAt) return s;
  return { ...s, qa17: { ...qa, answers: { ...qa.answers, [k]: { ...prev, withdrawnAt: a.at, history: [...(prev.history || []), { ...prev, history: undefined }].slice(-20) } } } };
}


/* Read one live answer (withdrawn answers read as none). */
function qaAnswer17(state, account, questionId, subjectId) {
  const x = ((state.qa17 || {}).answers || {})[qaKey17(account, questionId, subjectId)];
  return x && !x.withdrawnAt ? x : null;
}


/* The account id answers are filed under: the FF Tag, or the company slug on FF Staff. */
const qaAccount17 = (state) => state && state.auth && state.auth.status === "signedIn" ? (state.auth.tag || state.session.tag || "me") : null;


/* Save through the adapter, then write the store, then report. Returns the adapter result.
   `mirror` is the legacy store action that older screens still read (kept in step, same data). */
async function qaSubmit17(dispatch, payload, mirror) {
  const r = await QA_ADAPTER.save(payload);
  if (!r.ok) return r;
  dispatch({ type: "QA_SAVE", answer: r.answer });
  if (mirror) dispatch(typeof mirror === "function" ? mirror(r.answer) : mirror);
  return r;
}


async function qaWithdraw17(dispatch, payload, mirror) {
  const r = await QA_ADAPTER.withdraw(payload);
  if (!r.ok) return r;
  dispatch({ type: "QA_WITHDRAW", account: payload.account, questionId: payload.questionId, subjectId: payload.subjectId, at: r.at });
  if (mirror) dispatch(mirror);
  return r;
}


/* Preferred hourly rate (pence) for one profession, read for the FF Staff view only. */
function prefRateP17(state, account, profName) {
  const x = qaAnswer17(state, account, qaRateQid17(profName));
  return x && x.typed ? x.typed.pence : null;
}


/* Migration: answers saved before v17.4.6 (trainingInterest, jobsInterest, rewardsInterest, vipInterest,
   profile.serviceInterest) become Q&A answers once, keeping their dates. Nothing is removed. */
function qaMigrate17(s) {
  if (!s || (s.qa17 && s.qa17.migrated)) return s;
  const qa = { v: 1, answers: { ...((s.qa17 || {}).answers || {}) }, refs: { ...((s.qa17 || {}).refs || {}) }, migrated: true };
  const put = (account, questionId, optionIds, own, at, source) => {
    if (!account || (!optionIds.length && !own.length)) return;
    const k = qaKey17(account, questionId);
    if (qa.answers[k]) return;
    const ref = `MIG-${questionId}-${account}`;
    const iso = new Date(at || Date.now()).toISOString();
    qa.answers[k] = { id: `qa_mig_${questionId}_${account}`, questionId, subjectId: null, optionIds, own, text: "", typed: null, visibility: "private", account, contact: null, submissionRef: ref, source, createdAt: iso, updatedAt: iso, withdrawnAt: null, history: [], migrated: true };
    qa.refs[ref] = qa.answers[k].id;
  };
  const me = (s.auth && s.auth.tag) || (s.session && s.session.tag) || null;
  const ti = s.trainingInterest, ji = s.jobsInterest, ri = s.rewardsInterest, vi = s.vipInterest;
  if (ti) put(ti.account || me, "int.training", ti.courses || [], ti.own || [], ti.at, "Bookings · Training");
  if (ji) put(ji.account || me, "int.jobs", ji.jobs || [], ji.dream || [], ji.at, "Bookings · Dream jobs");
  if (ri) put(ri.account || me, "int.rewards", ri.rewards || [], ri.own || [], ri.at, "Bookings · FF Rewards");
  if (vi) put(vi.account || me, "int.vip", vi.ids || vi.picks || [], vi.own || [], vi.at, "FF VIP");
  const si = (s.profile && s.profile.serviceInterest) || [];
  if (si.length) put(me, "int.party_package", si.slice(), [], null, "Bookings · FF Party packages");
  return { ...s, qa17: qa };
}


/* What one site may show of an account's answers. FF Staff sees public and "ff-staff" answers (the
   preferred hourly rates); FF Party and every other public payload see public answers only. */
function publicAnswers17(state, account, site) {
  const ok = site === "staff" ? ["public", "ff-staff"] : ["public"];
  return Object.values(((state.qa17 || {}).answers) || {}).filter(x => x.account === account && !x.withdrawnAt && ok.includes(x.visibility));
}


/* Preferred rate for the FF Staff view only (null anywhere else). */
function staffRateP17(state, account, profName) {
  const qid = qaRateQid17(profName);
  const x = publicAnswers17(state, account, "staff").find(a => a.questionId === qid);
  return x && x.typed ? x.typed.pence : null;
}


/* Readable option labels for admin and the handoff (catalogue ids -> titles). */
function qaOptionLabel17(qid, id) {
  const from = (list) => ((list || []).find(x => x.id === id) || {}).title;
  const t = qid === "int.training" || qid === "int.biz_training" ? from(TRAINING_COURSES)
    : qid === "int.jobs" ? from(DREAM_JOBS)
    : qid === "int.rewards" || qid === "int.biz_rewards" ? from(XP_REWARDS)
    : qid === "int.party_package" ? from(allPackages17())
    : qid === "int.planning" ? ({ bronze: "Bronze", silver: "Silver", gold: "Gold" })[id]
    : qid === "int.area_expansion" ? FD_ROLE_LABEL[id]
    : qid === "int.vip" ? ({ launch_party_guest_list: "Launch party guest list" })[id] : null;
  return t || id;
}


/* Every live Q&A answer as admin rows. */
function qaAdminRows17(state) {
  return Object.values(((state.qa17 || {}).answers) || {}).filter(x => !x.withdrawnAt).map(x => {
    const q = QA_Q17[x.questionId];
    const a = x.typed && x.typed.kind === "rate_gbp_hour" ? `${gbp17(x.typed.pence)}/hour · ${x.typed.profession || ""} · FF Staff only`
      : [...(x.optionIds || []).map(id => qaOptionLabel17(x.questionId, id)), ...(x.own || [])].join(", ") + (x.text ? ` · ${x.text}` : "");
    return { area: x.questionId.startsWith("rate.") ? "Preferred rates" : "Register interest", q: q ? q.text : x.questionId, a, account: x.account || (x.contact && (x.contact.email || x.contact.phone || x.contact.name)) || "Guest", at: Date.parse(x.updatedAt) || Date.now() };
  });
}
