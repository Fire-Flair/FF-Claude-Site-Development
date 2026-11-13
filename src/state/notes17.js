/* src/state/notes17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   NOTIFICATIONS THAT STAY (Phase 2 Final, stage 3B)
   A notification that is dealt with does not vanish: it moves to state.notesDone17 and shows greyed under the
   active ones, with its outcome ("Accepted", "Declined", "Answered: Yes"), until the person taps Clear or seven
   days pass. The badge counts active ones only.

   state.notesDone17 = [{ id, acct, kind, title, sub, outcome, at }]
     acct   "<role>:<FF Tag>"  one list per account and site
     kind   shift | avail | team | coinvite | corequest | question | coquestion | netadd
   Production: Core keeps the same record on the notification row (status, outcome, decided_at) and drops rows 7 days
   after they were decided.

   state.coNetNotes17 = [{ id, companyKey, fromName, at, seen }] — "<Name> added you to their network" for a company.
   state.profileQuestions[].companyKey — a profile question asked on a Company page, answered by that company.
   ========================================================================== */
const NOTES_KEEP_MS17 = 7 * 24 * 3600 * 1000;


const notesAcct17 = (s) => `${s.role || "none"}:${(s.auth && s.auth.tag) || "me"}`;


/* Profile questions asked on a Company page that the signed-in business has not answered. */
function coQuestionsWaiting17(s) {
  const ks = myCoKeys17(s);
  return ks.length ? (s.profileQuestions || []).filter(q => q.companyKey && ks.includes(q.companyKey) && !isAnswered(q.answer)) : [];
}


/* "<Name> added you to their network" rows that have not been opened yet. */
function coNetUnseen17(s) {
  const ks = myCoKeys17(s);
  return ks.length ? (s.coNetNotes17 || []).filter(x => ks.includes(x.companyKey) && !x.seen) : [];
}


/* The notifications that wait for a reply, in one plain shape. NotifySheet17 draws these rows and notesWatch17 compares them
   before and after every action to see which ones were dealt with. */
function notesBrief17(s, people) {
  const out = [];
  if (!(s.auth && s.auth.status === "signedIn")) return out;
  if (s.role === "team") {
    pending11(s).forEach(e => {
      const sh = s.shifts.find(x => x.id === e.shiftId), ev = sh && s.events.find(x => x.id === sh.eventId);
      if (sh) out.push({ id: e.id, kind: "shift", title: `${e.auto ? "Open shift" : "You've been selected"} · ${sh.role}`, sub: `${hirerOf11(s, ev)} · ${whenOf11(sh)}`, e });
    });
    availWaiting17(s).forEach(x => out.push({ id: x.id, kind: "avail", qid: `av_${x.iso}`, title: "Are you available?", sub: `${x.byName} · ${shortDay(x.iso)}`, x }));
    teamAsksWaiting17(s).forEach(x => out.push({ id: x.id, kind: "team", title: "Team invitation", sub: x.name, x }));
    coInvites17(s).forEach(x => out.push({ id: x.id, kind: "coinvite", title: "Company team invitation", sub: x.companyName, x }));
    questionsWaiting17(s, people).forEach(q => out.push({ id: q.id, kind: "question", qid: q.id, title: "Question for you", sub: `${askerName(q, people)} · ${q.text}`, q }));
  } else if (s.role === "staff") {
    coRequests17(s).forEach(x => out.push({ id: x.id, kind: "corequest", title: "Asks to join your team", sub: x.name || (findPerson(people, s, x.personId) || {}).name || "", x }));
    coQuestionsWaiting17(s).forEach(q => out.push({ id: q.id, kind: "coquestion", title: "Question for your company", sub: `${q.byName || "Someone"} · ${q.text}`, q }));
  }
  return out;
}


/* What happened to a notification that has just left the active list (null: it only expired or moved, so nothing is kept). */
function notesOutcome17(it, n) {
  const short = (v) => { const t = Array.isArray(v) ? v.join(", ") : String(v); return t.length > 60 ? t.slice(0, 57) + "…" : t; };
  if (it.kind === "shift") {
    const st = ((n.engagements || []).find(x => x.id === it.id) || {}).state;
    return st === "confirmed" ? "Accepted" : st === "unavailable" ? "Declined" : st === "available" ? "Marked available" : null;
  }
  if (it.kind === "avail") { const v = ((n.profile && n.profile.answers) || {})[it.qid]; return isAnswered(v) ? `Answered: ${short(v)}` : null; }
  if (it.kind === "question") { const v = ((n.profile && n.profile.answers) || {})[it.qid]; return isAnswered(v) ? `Answered: ${short(v)}` : null; }
  if (it.kind === "coquestion") { const q = (n.profileQuestions || []).find(x => x.id === it.id); return q && isAnswered(q.answer) ? `Answered: ${short(q.answer)}` : null; }
  if (it.kind === "team") {
    const v = (n.teamAsks17 || {})[it.id];
    return v === "accepted" ? "Accepted" : v === "declined" ? "Declined" : (n.connections || []).some(c => c.id === it.x.fromId) ? "Accepted" : null;
  }
  if (it.kind === "coinvite" || it.kind === "corequest") {
    const y = (n.coTeams17 || []).find(r => r.id === it.id);
    return y && y.status === "accepted" ? "Accepted" : y && y.status === "declined" ? "Declined" : null;
  }
  return null;
}


/* Wrapped round the main reducer: any notification that was active before an action and is not after it is kept, greyed. */
function notesWatch17(prev, next, a) {
  if (prev === next || !prev.auth || !next.auth || next.auth.status !== "signedIn") return next;
  if (prev.role !== next.role || prev.site !== next.site || prev.auth.status !== next.auth.status || prev.auth.tag !== next.auth.tag) return next;
  const was = notesBrief17(prev, prev.directory || []);
  if (!was.length) return next;
  const still = new Set(notesBrief17(next, next.directory || []).map(x => x.id));
  const gone = was.filter(x => !still.has(x.id));
  if (!gone.length) return next;
  const t = Date.now(), acct = notesAcct17(next);
  const add = gone.map(x => ({ id: x.id, acct, kind: x.kind, title: x.title, sub: x.sub, outcome: notesOutcome17(x, next), at: t })).filter(x => x.outcome);
  if (!add.length) return next;
  return { ...next, notesDone17: [...(next.notesDone17 || []).filter(d => t - d.at < NOTES_KEEP_MS17 && !add.some(n => n.id === d.id && n.acct === d.acct)), ...add] };
}


/* Greyed rows for this account, newest first, with anything older than seven days dropped. */
const notesDoneFor17 = (s) => {
  const t = Date.now(), acct = notesAcct17(s);
  return (s.notesDone17 || []).filter(d => d.acct === acct && t - d.at < NOTES_KEEP_MS17).sort((a, b) => b.at - a.at);
};


/* The list was opened: stamp it, drop old greyed rows, and grey the informational rows. */
function notesSeen17(s) {
  const t = Date.now(), acct = notesAcct17(s);
  const kept = (s.notesDone17 || []).filter(d => t - d.at < NOTES_KEEP_MS17);
  const un = coNetUnseen17(s);
  let out = { ...s, notesSeenAt: t };
  if (un.length) {
    out.coNetNotes17 = (s.coNetNotes17 || []).map(x => un.includes(x) ? { ...x, seen: true } : x);
    un.forEach(x => kept.push({ id: x.id, acct, kind: "netadd", title: `${x.fromName} added you to their network`, sub: "Network", outcome: "Seen", at: t }));
  }
  out.notesDone17 = kept;
  return out;
}


function notes17Reducer(s, a) {
  if (a.type === "NOTES_CLEAR") { const acct = notesAcct17(s); return { ...s, notesDone17: (s.notesDone17 || []).filter(d => d.acct !== acct) }; }
  return null;
}
