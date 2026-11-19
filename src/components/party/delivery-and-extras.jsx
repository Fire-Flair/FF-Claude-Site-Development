/* src/components/party/delivery-and-extras.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
const hirerOf11 = (state, ev) => (ev && ev.hirer) || (state.company && (state.company.name || state.company.title)) || "The host";


/* Where a booking came from (v17.4.6): the event record says so (event.source, or site "party" for
   FF Party bookings); older records without either are read from the hirer, as hirerCard11 does. */
function eventSource17(state, ev) {
  if (!ev) return "staff";
  if (ev.source === "party" || ev.source === "staff") return ev.source;
  if (ev.site === "party" || ev.hirerKind === "host") return "party";
  return hirerCard11(state, ev).party ? "party" : "staff";
}


const whenOf11 = (sh) => `${shortDay(sh.iso) || sh.date || ""}${sh.time ? ` · ${sh.time}` : ""}`;


const pending11 = (state) => !(state.auth && state.auth.status === "signedIn" && ["SAM42", "ALEXG"].includes(state.auth.tag) && state.role === "team") ? [] : (state.engagements || []).filter(e => e.staffId === "me" && ["requested", "discuss"].includes(e.state) && (e.auto || e.exclusive)).filter(e => { const sh = state.shifts.find(x => x.id === e.shiftId); const st = sh && startMs17(sh); return sh && !(st && st <= now17(state)) && !(e.expiresAt && e.expiresAt <= now17(state)); });


/* Who the shift is for: a Company Card for a business, a VIP Host Card for a person. */
function hirerCard11(state, ev) {
  const nm = (ev && ev.hirer) || "";
  if (/vooshka/i.test(nm)) return { party: false, c: coFromProfile17("vooshka") };
  const co = companyList(state).find(x => x.name === nm);
  if (co) { const { id, mine, tier, ...rest } = co; return { party: false, c: rest }; }
  const mineCo = state.company || {};
  if (nm && mineCo.name === nm) return { party: state.site === "party", c: mineCo };
  if (!nm || nm === "The host" || (ev && ev.hirerKind === "host") || /private|party|wedding/i.test((ev && ev.kind) || ""))
    return { party: true, c: { ...DEMO_HOST17, name: nm && nm !== "The host" ? nm : DEMO_HOST17.name, photo: (window.FF_IMG || {}).face_you || "" } };
  return { party: false, c: { name: nm, kind: (ev && ev.kind) || "", slug: slugify(nm) } };
}




/* Notifications (v17.4.3): only cards that are waiting for YOUR reply. A Shift Card you were sent, or an
   Availability Card you were asked. Each is a dropdown, closed by default; opened, it shows the card itself
   with its reply buttons. Answer it and it leaves the list (history lives in Bookings). Booking history,
   "card sent", "signed off" and similar are NOT notifications. Next steps sit underneath. */
function availWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const answers = (state.profile && state.profile.answers) || {};
  return availabilityAskedOfMe(state).filter(x => !isPast(x.iso) && !isAnswered(answers[`av_${x.iso}`]));
}


/* Team invitations sent TO you. The real ones are state.teamAsksIn17 (a join link brought you in; see src/state/invite17.js).
   Core supplies the rest in production. These two samples appear only for the DEV complete-profile login (state.devDone.team).
   netAdd: the person added you to their network; the card asks whether to add them to your team. */
const TEAM_ASKS_DEMO17 = [
  { id: "tia_gav", fromId: "stf_gav", name: "Alexandru Gavrilas", tag: "GAVRILAS", netAdd: true, at: Date.UTC(2026, 10, 8) },
  { id: "tia_vooshka", fromId: "co_vooshka", name: "Vooshka Cocktail Bar", company: true, note: "Wants you on their company team", at: Date.UTC(2026, 10, 9) },
];


function teamAsksWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const done = state.teamAsks17 || {};
  const real = (state.teamAsksIn17 || []).filter(x => !done[x.id] && !(state.connections || []).some(c => c.id === x.fromId));
  const sample = state.devDone && state.devDone.team ? TEAM_ASKS_DEMO17.filter(x => !done[x.id] && !(state.connections || []).some(c => c.id === x.fromId) && !(x.company && (state.netAdds17 || []).includes(x.fromId))) : [];
  return [...real, ...sample];
}


/* Reviews written about you that wait for your decision (FF Team). Real: state.reviews about "me" with status "pending".
   The sample appears only for the DEV complete-profile login (state.devDone.team) until it is decided. */
const REVIEW_ASKS_DEMO17 = [{ id: "rva_gav", aboutId: "me", byId: "stf_gav", byName: "Alexandru Gavrilas", worked: true, rating: 5, text: "Calm behind a busy bar and great with guests.", at: Date.UTC(2026, 10, 8) }];


function reviewAsksWaiting17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  const asked = state.reviewAsks17 || {};
  const real = (state.reviews || []).filter(r => r.aboutId === "me" && r.status === "pending");
  const sample = state.devDone && state.devDone.team ? REVIEW_ASKS_DEMO17.filter(r => !asked[r.id] && !(state.reviews || []).some(x => x.id === r.id)) : [];
  return [...real, ...sample];
}


/* Questions people asked on your profile that you haven't answered (FF Team). */
function questionsWaiting17(state, people) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "team")) return [];
  return askedOfMe(state, people).filter(q => !isAnswered(answerOf(state, q)));
}


/* Booker side (v17.4.6.1): replies to the invitations you sent, read from the same engagement records that drive the
   Event Card. One update per invitation and state, so retries and reloads never duplicate. Scoped to the site the
   booking was made on. "available" is an action (choose them) until it lapses; the others are updates. */
function bookingUpdates17(state) {
  if (!(state.auth && state.auth.status === "signedIn" && state.role === "staff")) return [];
  const site = state.site === "party" ? "party" : "staff", now = now17(state), out = [];
  (state.engagements || []).forEach(e => {
    const sh = state.shifts.find(x => x.id === e.shiftId), ev = sh && state.events.find(x => x.id === sh.eventId);
    if (!sh || !ev || isPast(ev.iso) || eventSource17(state, ev) !== site) return;
    /* The signed-in FF Team user ("me") counts only on a shift from their own FF Staff company, so a decline there reaches this list too. */
    if (e.staffId === "me" && !(ev.hirer && ((state.company && ev.hirer === state.company.name) || (["SAM42", "ALEXG"].includes(state.auth.tag) && coIsVk17(state) && ev.hirer === "Vooshka Cocktail Bar")))) return;
    const chosen = !!e.exclusive && !e.auto;
    const h = e.history || [], last = h[h.length - 1] || {}, prev = h[h.length - 2] || {};
    let kind = null;
    if (e.state === "confirmed") kind = "confirmed";
    else if (e.state === "unavailable" && chosen) kind = "unavailable";
    else if (e.state === "available" && e.selectBy > now) kind = "available";
    else if (e.state === "expired" && chosen && !e.filled && !e.closed && !e.cancelled && ["requested", "discuss"].includes(prev.state)) kind = "noreply";
    if (kind) out.push({ id: `${e.id}:${kind}`, kind, e, sh, ev, at: last.at || e.sentAt || 0, action: kind === "available" });
  });
  return out.sort((a, b) => b.at - a.at);
}


/* Join requests to your company (FF Staff) and company invitations to you (FF Team). */
const coRequests17 = (state) => ctRequestsForMe17(state);
const coInvites17 = (state) => ctInvitesForMe17(state);


/* One list per site. FF Team: cards sent to you, team invitations, questions on your profile.
   FF Staff and FF Party: replies to your invitations, questions from the people you asked to work, join requests.
   The badge counts what the list shows as new: every action, plus updates since the list was last opened. */
const notifyCount17 = (state) => state.role !== "team" ? 0
  : pending11(state).length + availWaiting17(state).length + teamAsksWaiting17(state).length + reviewAsksWaiting17(state).length + coInvites17(state).length + questionsWaiting17(state, state.directory || []).length;
























/* ======================================================================================================
   v17.3.33 — Bookings (FF Team), FF events (FF Staff), personal terms (FF Team profile)
   ====================================================================================================== */
const E17I = { GraduationCap: lucideIcon("GraduationCap"), Plane: lucideIcon("Plane"), Gift: lucideIcon("Gift"), Layers: lucideIcon("Layers"), ChevronLeft: lucideIcon("ChevronLeft"), ChevronRight: lucideIcon("ChevronRight") };


/* What an FF Team member earns per package, and the shortest booking. */
const PAY17 = PKG_CAT17.filter(x => x.teamRegistration).reduce((m, x) => { m[x.id] = pkgPayPence17(x.id) / 100; return m; }, {});


const TIME17 = PKG_CAT17.reduce((m, x) => { m[x.id] = x.durationLabel; return m; }, {});


function PkgTile17({ sv, on, onClick }) {
  const pay = PAY17[sv.id];
  return (
    <button type="button" className={`ff-tp17 ${sv.tone}${on ? " on" : ""}`} onClick={onClick} aria-pressed={on}>
      <span className="lv">{sv.level}</span>
      <b className="tt">{sv.title}</b>
      <span className="in">{sv.includes}</span>
      <span className="tm"><S17I.Clock size={12} /> {TIME17[sv.id] || sv.time}</span>
      <span className="pay">{pay != null && <><small>You earn</small><strong>{pkgPayLabel17(sv.id)}</strong></>}</span>
      <em className="go">{on ? <><S17I.Check size={13} strokeWidth={2.6} /> Signed up</> : "Sign up"}</em>
    </button>
  );
}
