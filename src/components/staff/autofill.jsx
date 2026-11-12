/* src/components/staff/autofill.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==== Booking policy 2026.1: exclusive invitations, Autofill, selection, refunds, replacement =====
   PROTOTYPE. Everything here runs in the browser and is simulated: there is no server, no payment
   provider and no WhatsApp sending. The rules are the ones in the Booking specification, so the
   backend can be built from the same state names.

   Records (all on the app state):
     af17[shiftId]   one Autofill record per Service Card (a Service Card needing several people reopens
                     only the positions still open: open = qty - confirmed)
     engagements     one per professional invitation. New fields: auto, exclusive, batch, batchSize,
                     selectBy, thread, ref. New states: discuss, withdrawn, not_selected, cancelled_pro
     paid17          payment taken per Event Card, snap17 the terms and prices agreed at that moment
     refunds17       refunds issued, or held for FireFlair to decide (part-filled cases)
     notes17         messages, with the website and WhatsApp status kept apart from booking status
     audit17, revs17 who did what and when; manual changes to terms
     rules17         admin settings. warp17 moves the prototype clock so deadlines can be tried. */

const POLICY17 = { version: "2026.1", feeBusiness: 10, feeParty: 50, batch: 10, exclusiveH: 24, batchH: 24, selectDays: 7, distance: 0 };


const rules17 = (s) => ({ ...POLICY17, ...(s.rules17 || {}) });


const now17 = (s) => Date.now() + ((s && s.warp17) || 0);


const dt17 = (ms) => ms ? new Date(ms).toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";


const PEND17 = ["requested", "available", "discuss"];


const startMs17 = (sh) => {
  if (!sh || !sh.iso) return 0;
  const m = /^(\d{1,2}):(\d{2})/.exec(splitTime(sh.time || "")[0] || "");
  return new Date(`${sh.iso}T${m ? String(m[1]).padStart(2, "0") + ":" + m[2] : "12:00"}:00`).getTime();
};


const mins17 = (t) => { const m = /^(\d{1,2}):(\d{2})/.exec(t || ""); return m ? +m[1] * 60 + +m[2] : null; };


const span17 = (sh) => { const [a, b] = splitTime(sh.time || ""); let x = mins17(a), y = mins17(b); if (x == null || y == null) return null; if (y <= x) y += 1440; return [x, y]; };


/* Two confirmed bookings overlap when they are on the same day and the hours cross (or the hours are unknown). */
const clash17 = (a, b) => { if (!a.iso || a.iso !== b.iso) return false; const x = span17(a), y = span17(b); return !x || !y || (x[0] < y[1] && y[0] < x[1]); };


const conflict17 = (s, pid, sh, exceptId) => s.engagements.some(e => e.staffId === pid && e.id !== exceptId && e.shiftId !== sh.id && e.state === "confirmed" && clash17((s.shifts.find(x => x.id === e.shiftId) || {}), sh));


/* Payment is on record for an Event Card once its first invitations went out. */
const paid17 = (s, eventId) => !!(s.paid17 || {})[eventId] || s.engagements.some(e => (s.shifts.find(x => x.id === e.shiftId) || {}).eventId === eventId);


const got17 = (s, sh) => s.engagements.filter(e => e.shiftId === sh.id && DONE.includes(e.state)).length;


const open17 = (s, sh) => Math.max(0, qtyOf(sh) - got17(s, sh));


const selectBy17 = (s, sh, from) => Math.min(from + rules17(s).selectDays * 864e5, startMs17(sh) || Infinity);


const isParty17 = (s) => { try { return !!svcWords(s).party; } catch (x) { return false; } };


const ref17 = (e) => "FF-" + String(e.id).replace(/[\W_]/g, "").slice(-6).toUpperCase();


const note17 = (s, n) => ({ ...s, notes17: [...(s.notes17 || []), { id: uid("note"), at: now17(s), web: "delivered", wa: "queued", ...n }] });


const audit17 = (s, who, what) => ({ ...s, audit17: [...(s.audit17 || []), { at: now17(s), who, what }] });


/* Map that hands back the same array when nothing changed, so the clock can tick without causing re-renders. */
const keep17 = (arr, fn) => { const out = arr.map(fn); return out.every((x, i) => x === arr[i]) ? arr : out; };


const mark17 = (e, state, now, extra) => ({ ...e, ...extra, state, history: [...(e.history || []), { state, at: now }] });



/* Can the booker confirm this Available professional right now? Returns the reason it cannot, or "". */
function pickCheck17(s, e) {
  const sh = s.shifts.find(x => x.id === e.shiftId); const now = now17(s);
  if (!sh) return "This Service Card no longer exists";
  if (e.state !== "available") return "They are no longer available";
  if (!e.selectBy || e.selectBy <= now) return "The time to choose has ended";
  if (startMs17(sh) && startMs17(sh) <= now) return "The shift has already started";
  if (!paid17(s, sh.eventId)) return "Payment is needed first";
  if (open17(s, sh) < 1) return "This position is already filled";
  if (conflict17(s, e.staffId, sh, e.id)) return "They have been confirmed on another booking at that time";
  return "";
}



/* One confirmation, with every check made together. Closes the competing invitations once the position is full. */
function confirm17(s, e) {
  const sh = s.shifts.find(x => x.id === e.shiftId); const now = now17(s);
  let engs = s.engagements.map(x => x.id === e.id ? mark17(x, "confirmed", now, { ref: ref17(e), confirmedAt: now }) : x);
  const ids = [...new Set([...staffOf(sh), e.staffId])];
  const full = engs.filter(x => x.shiftId === sh.id && DONE.includes(x.state)).length >= qtyOf(sh);
  if (full) engs = engs.map(x => x.shiftId === sh.id && x.id !== e.id && PEND17.includes(x.state) ? mark17(x, "not_selected", now, { filled: true }) : x);
  /* Their other offers at the same time can no longer be accepted. */
  engs = engs.map(x => x.staffId === e.staffId && x.id !== e.id && PEND17.includes(x.state) && clash17(s.shifts.find(y => y.id === x.shiftId) || {}, sh) ? mark17(x, "withdrawn", now, { clash: true }) : x);
  let n = { ...s, engagements: engs, shifts: s.shifts.map(x => x.id === sh.id ? { ...x, staffIds: ids, staffId: ids[0] || "" } : x) };
  if (full && (n.af17 || {})[sh.id]) n = { ...n, af17: { ...n.af17, [sh.id]: { ...n.af17[sh.id], status: "filled", needBatch: false, endedAt: now } } };
  n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `Confirmed: ${sh.role}. Booking reference ${ref17(e)}. Invoice, shift details and contact are on your booking.` });
  n = note17(n, { to: "pro", staffId: e.staffId, eventId: sh.eventId, shiftId: sh.id, text: `You're confirmed for ${sh.role}. Booking reference ${ref17(e)}.` });
  n = goldClaim17(n, n.events.find(v => v.id === sh.eventId));
  return audit17(n, e.staffId === "me" ? "Professional" : "Booker", `Confirmed ${ref17(e)} for ${sh.role}`);
}


/* FF Staff launch (Be first in line for Gold): a company is recorded once, at its first confirmed hire on an FF Staff
   booking. The list is the prototype's stand-in for the server-side count; nothing is enrolled automatically. */
const goldKey17 = (s) => {
  const c = (s && s.company) || {};
  const nm = c.slug || c.name;
  if (nm) return "co:" + slugify(nm);
  return s && s.auth && s.auth.status === "signedIn" && s.role === "staff" && s.site !== "party" && s.auth.tag ? "tag:" + String(s.auth.tag).toLowerCase() : "";
};


function goldClaim17(s, ev) {
  if (!ev || eventSource17(s, ev) !== "staff") return s;
  const key = ev.hirer ? "co:" + slugify(ev.hirer) : goldKey17(s);
  const list = s.goldClaims17 || [];
  if (!key || list.some(x => x.key === key)) return s;
  return { ...s, goldClaims17: [...list, { key, n: list.length + 1, at: now17(s), eventId: ev.id }] };
}



/* Refunds are money back only. A Service Card nobody confirmed is refunded in full; a part-filled one goes to FireFlair. */
function settle17(s, sh, reason) {
  const ev = s.events.find(e => e.id === sh.eventId); if (!ev || !paid17(s, ev.id)) return s;
  const R = s.refunds17 || [], now = now17(s);
  const has = (f) => R.some(r => f(r) && r.status !== "void");
  if (!isParty17(s)) {
    if (has(r => r.shiftId === sh.id && r.kind === "business")) return s;
    const c = got17(s, sh);
    if (c >= qtyOf(sh)) return s;
    const row = c === 0 ? { amount: rules17(s).feeBusiness, status: "issued", reason } : { amount: 0, status: "review", reason: "Part-filled Service Card. FireFlair decides the refund." };
    return audit17({ ...s, refunds17: [...R, { id: uid("rf"), eventId: ev.id, shiftId: sh.id, kind: "business", at: now, ...row }] }, "System", `${row.status === "issued" ? "Refunded" : "Held for review"}: ${sh.role}`);
  }
  /* FF Party: one booking charge for the Event Card. Decide only when every Service Card has finished. */
  const shs = s.shifts.filter(x => x.eventId === ev.id);
  if (shs.some(x => (s.af17 || {})[x.id] && (s.af17[x.id].status === "matching")) || has(r => r.eventId === ev.id && r.kind === "party")) return s;
  const confirmed = shs.reduce((n, x) => n + got17(s, x), 0), unfilled = shs.some(x => open17(s, x) > 0);
  if (!unfilled) return s;
  const row = confirmed === 0 ? { amount: rules17(s).feeParty, status: "issued", reason } : { amount: 0, status: "review", reason: "Part-staffed event. FireFlair decides case by case." };
  return audit17({ ...s, refunds17: [...R, { id: uid("rf"), eventId: ev.id, shiftId: "", kind: "party", at: now, ...row }] }, "System", `${row.status === "issued" ? "Refunded" : "Held for review"}: ${eventTitle(ev)}`);
}


const end17 = (s, shiftId, status, reason) => {
  const a = (s.af17 || {})[shiftId], sh = s.shifts.find(x => x.id === shiftId); if (!a || a.status !== "matching") return s;
  const now = now17(s);
  let n = { ...s, af17: { ...s.af17, [shiftId]: { ...a, status, needBatch: false, endedAt: now, reason } },
    engagements: s.engagements.map(e => e.shiftId === shiftId && e.auto && PEND17.includes(e.state) ? mark17(e, "expired", now, { closed: true }) : e) };
  if (sh && status !== "filled") {
    n = settle17(n, sh, reason);
    const rf = (n.refunds17 || []).find(r => (r.shiftId === shiftId || (r.kind === "party" && r.eventId === sh.eventId)) && r.at === now);
    n = note17(n, { to: "booker", eventId: sh.eventId, shiftId, text: rf && rf.status === "issued" ? `We couldn't fill ${sh.role}. £${rf.amount} is being refunded to your original payment method.` : `We couldn't fully staff ${sh.role}. FireFlair will be in touch about the booking.` });
  }
  return n;
};



/* ---- The reducer. Called from v11BookReducer; returns null for anything else. ---- */
function auto17Reduce(s, a) {
  const r11 = ship11Reduce(s, a); if (r11) return r11;
  const now = now17(s);
  switch (a.type) {
    /* After payment: use Autofill if the chosen people don't reply in time. Nothing is sent or charged here. */
    case "AF_BACKUP": return audit17({ ...s, shifts: s.shifts.map(x => a.shiftIds.includes(x.id) ? { ...x, afBackup: !!a.on } : x) }, "Booker", `Autofill ${a.on ? "on" : "off"} if no reply: ${a.shiftIds.length} Service Card${a.shiftIds.length === 1 ? "" : "s"}`);
    case "AF_ROUTE": {
      const ids = a.shiftIds;
      return { ...s, shifts: s.shifts.map(x => ids.includes(x.id) ? { ...x, route: a.on ? "auto" : "", ...(a.on ? { staffIds: staffOf(x).filter(pid => engFor(s, x.id, pid)), staffId: staffOf(x).filter(pid => engFor(s, x.id, pid))[0] || "" } : {}) } : x) };
    }
    case "AF_START": {
      const sh = s.shifts.find(x => x.id === a.shiftId); if (!sh || !paid17(s, sh.eventId)) return s;
      const old = (s.af17 || {})[sh.id];
      if (old && old.status === "matching") return s;
      if (open17(s, sh) < 1 || (startMs17(sh) && startMs17(sh) <= now)) return s;
      const af = { id: uid("af"), shiftId: sh.id, eventId: sh.eventId, status: "matching", replacement: !!a.replacement, batches: old ? old.batches : [], needBatch: true, exhausted: false, startedAt: now };
      return audit17({ ...s, af17: { ...(s.af17 || {}), [sh.id]: af } }, "System", `${a.replacement ? "Replacement matching" : "Autofill"} started: ${sh.role}`);
    }
    /* The next batch. ids are chosen by the matching rule (role, location, nearest first); the reducer enforces size and time limits. */
    case "AF_BATCH": {
      const af = (s.af17 || {})[a.shiftId]; const sh = s.shifts.find(x => x.id === a.shiftId);
      if (!af || af.status !== "matching" || !af.needBatch || !sh) return s;
      const R = rules17(s);
      if (startMs17(sh) && startMs17(sh) <= now) return end17(s, sh.id, "unfilled", "The shift started before it was filled");
      const ids = (a.ids || []).filter(pid => !s.engagements.some(e => e.shiftId === sh.id && e.staffId === pid)).slice(0, R.batch);
      if (!ids.length) {
        const live = s.engagements.some(e => e.shiftId === sh.id && PEND17.includes(e.state));
        const n = { ...s, af17: { ...s.af17, [sh.id]: { ...af, needBatch: false, exhausted: true } } };
        return live ? n : end17(n, sh.id, "unfilled", "Nobody else matched");
      }
      const k = af.batches.length + 1, respondBy = Math.min(now + R.batchH * 36e5, startMs17(sh) || Infinity), sel = selectBy17(s, sh, now);
      const made = ids.map(pid => ({ id: uid("eng"), shiftId: sh.id, staffId: pid, state: "requested", auto: true, batch: k, batchSize: ids.length, offer: true, credit: false, sentAt: now, expiresAt: respondBy, selectBy: sel, thread: [], questions: [], history: [{ state: "requested", at: now }] }));
      let n = { ...s, engagements: [...s.engagements, ...made], af17: { ...s.af17, [sh.id]: { ...af, needBatch: false, batches: [...af.batches, { n: k, at: now, size: ids.length, respondBy, selectBy: sel }] } } };
      n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `Autofill invited ${ids.length} professionals for ${sh.role}. You can choose from those who are available.` });
      return audit17(n, "System", `Batch ${k}: invited ${ids.length} for ${sh.role}`);
    }
    case "AF_RESPOND": {
      const e = s.engagements.find(x => x.id === a.id); if (!e) return s;
      const sh = s.shifts.find(x => x.id === e.shiftId); if (!sh) return s;
      const over = (startMs17(sh) && startMs17(sh) <= now) || (e.expiresAt && e.state === "requested" && e.expiresAt <= now && (e.auto || e.exclusive));
      if (a.as === "accept") {
        if (over || !PEND17.includes(e.state) || e.auto || open17(s, sh) < 1 || !paid17(s, sh.eventId) || conflict17(s, e.staffId, sh, e.id)) return s;
        return confirm17(s, e);
      }
      if (a.as === "unavailable") return PEND17.includes(e.state) ? { ...s, engagements: s.engagements.map(x => x.id === e.id ? mark17(x, "unavailable", now) : x) } : s;
      if (a.as === "discuss") {
        if (over || !["requested", "discuss", "available", "confirmed"].includes(e.state)) return s;
        const th = [...(e.thread || []), { from: "pro", text: String(a.text || "").slice(0, 300), at: now }];
        let n = { ...s, engagements: s.engagements.map(x => x.id === e.id ? (x.state === "requested" ? mark17(x, "discuss", now, { thread: th }) : { ...x, thread: th }) : x) };
        n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `A question about ${sh.role}: "${String(a.text || "").slice(0, 120)}". This doesn't confirm the shift.` });
        return n;
      }
      if (a.as === "available") {
        if (over || !e.auto || !["requested", "discuss"].includes(e.state) || !e.selectBy || e.selectBy <= now || open17(s, sh) < 1) return s;
        return { ...s, engagements: s.engagements.map(x => x.id === e.id ? mark17(x, "available", now, { availableAt: now }) : x) };
      }
      if (a.as === "withdraw") return e.state === "available" ? { ...s, engagements: s.engagements.map(x => x.id === e.id ? mark17(x, "withdrawn", now) : x) } : s;
      return s;
    }
    case "AF_PICK": {
      const e = s.engagements.find(x => x.id === a.id); if (!e || pickCheck17(s, e)) return s;
      return confirm17(s, e);
    }
    case "AF_REPLY": {
      const e = s.engagements.find(x => x.id === a.id); if (!e || !String(a.text || "").trim()) return s;
      return { ...s, engagements: s.engagements.map(x => x.id === e.id ? { ...x, thread: [...(x.thread || []), { from: "booker", text: String(a.text).slice(0, 300), at: now }] } : x) };
    }
    /* Cancel request & refund, before anything is confirmed. */
    case "AF_CANCEL": {
      const shs = s.shifts.filter(x => x.eventId === a.eventId && (!a.shiftId || x.id === a.shiftId) && open17(s, x) > 0);
      let n = s;
      shs.forEach(sh => {
        n = { ...n, engagements: n.engagements.map(e => e.shiftId === sh.id && PEND17.includes(e.state) ? mark17(e, "expired", now, { closed: true, cancelled: true }) : e) };
        const af = (n.af17 || {})[sh.id];
        n = { ...n, af17: { ...(n.af17 || {}), [sh.id]: { ...(af || { id: uid("af"), shiftId: sh.id, eventId: sh.eventId, batches: [], startedAt: now }), status: "cancelled", needBatch: false, endedAt: now, reason: "Cancelled by the booker before confirmation" } } };
      });
      shs.forEach(sh => { n = settle17(n, sh, "Cancelled before confirmation"); });
      return audit17(n, "Booker", `Cancel request & refund: ${shs.map(x => x.role).join(", ")}`);
    }
    /* A confirmed professional cancels: only that position reopens and replacement matching starts at once. No new fee. */
    case "PRO_CANCEL": {
      const e = s.engagements.find(x => x.id === a.id); if (!e || e.state !== "confirmed") return s;
      const sh = s.shifts.find(x => x.id === e.shiftId); if (!sh) return s;
      const ids = staffOf(sh).filter(x => x !== e.staffId);
      let n = { ...s, engagements: s.engagements.map(x => x.id === e.id ? mark17(x, "cancelled_pro", now, { cancelledAt: now }) : x), shifts: s.shifts.map(x => x.id === sh.id ? { ...x, staffIds: ids, staffId: ids[0] || "" } : x) };
      n = note17(n, { to: "admin", eventId: sh.eventId, shiftId: sh.id, text: `A professional cancelled ${sh.role} (${ref17(e)}). Replacement matching has started.` });
      n = note17(n, { to: "booker", eventId: sh.eventId, shiftId: sh.id, text: `Your ${sh.role} has cancelled. FireFlair is sourcing a replacement. There is no new booking charge, and you are refunded if we can't fulfil the booking.` });
      n = audit17(n, "Professional", `Cancelled ${ref17(e)} (${sh.role})`);
      const old = (n.af17 || {})[sh.id];
      return { ...n, af17: { ...(n.af17 || {}), [sh.id]: { id: uid("af"), shiftId: sh.id, eventId: sh.eventId, status: "matching", replacement: true, replacing: e.staffId, batches: old ? old.batches : [], needBatch: true, exhausted: false, startedAt: now } } };
    }
    case "AF_LEAD": { const x = s.engagements.find(e => e.id === a.id); if (!x) return s; return { ...s, engagements: s.engagements.map(e => e.id === x.id ? { ...e, leader: !e.leader } : e.shiftId === x.shiftId ? { ...e, leader: false } : e) }; }
    case "AF_WARP": return { ...s, warp17: (s.warp17 || 0) + a.ms };
    /* Prototype only: stand in for replies from professionals so the whole flow can be tried. */
    case "AF_SIM": {
      const mine = s.engagements.filter(e => e.shiftId === a.shiftId && e.auto && e.state === "requested");
      if (a.kind === "decline") return { ...s, engagements: s.engagements.map(e => mine.some(m => m.id === e.id) ? mark17(e, "unavailable", now) : e) };
      const one = mine[a.index || 0]; if (!one) return s;
      return auto17Reduce(s, { type: "AF_RESPOND", id: one.id, as: a.kind, text: a.kind === "discuss" ? "Can you provide transport?" : "" });
    }
    case "RULES_SET": return audit17({ ...s, rules17: { ...(s.rules17 || {}), ...a.patch } }, a.by || "Admin", `Booking rules changed: ${Object.keys(a.patch).join(", ")}`);
    case "RF_ISSUE": return audit17({ ...s, refunds17: (s.refunds17 || []).map(r => r.id === a.id ? { ...r, status: "issued", amount: Math.max(0, +a.amount || 0), by: a.by || "Admin", decidedAt: now } : r) }, a.by || "Admin", `Refund £${+a.amount || 0} issued`);
    case "AF_ADMIN_CONTINUE": {
      const af = (s.af17 || {})[a.shiftId]; const sh = s.shifts.find(x => x.id === a.shiftId); if (!sh || open17(s, sh) < 1) return s;
      return audit17({ ...s, refunds17: (s.refunds17 || []).map(r => r.shiftId === sh.id || (r.kind === "party" && r.eventId === sh.eventId) ? { ...r, status: r.status === "review" ? "void" : r.status } : r), af17: { ...(s.af17 || {}), [sh.id]: { ...(af || { id: uid("af"), shiftId: sh.id, eventId: sh.eventId, batches: [], startedAt: now }), status: "matching", needBatch: true, exhausted: false, replacement: !!(af && af.replacement), endedAt: 0 } } }, "Admin", `Matching continued: ${sh.role}`);
    }
    /* Manual change of terms. Anyone already confirmed or pending has to accept before it counts as agreed. */
    case "TERMS_REVISE": {
      const sh = s.shifts.find(x => x.id === a.shiftId); if (!sh) return s;
      const patch = {}; if (a.total !== "" && a.total != null) patch.total = String(a.total).replace(/[^\d.]/g, ""); if (a.notes) patch.notes = a.notes;
      const was = { total: sh.total || "", notes: sh.notes || "" };
      let n = { ...s, shifts: s.shifts.map(x => x.id === sh.id ? { ...x, ...patch } : x), engagements: s.engagements.map(e => e.shiftId === sh.id && ["requested", "available", "discuss", "confirmed"].includes(e.state) ? { ...e, revised: true, revisedAt: now } : e),
        revs17: [...(s.revs17 || []), { id: uid("rev"), shiftId: sh.id, by: a.by || "Admin", at: now, what: a.reason || "Terms changed", from: was, to: patch }] };
      return audit17(n, a.by || "Admin", `Terms revised: ${sh.role}${a.reason ? " (" + a.reason + ")" : ""}`);
    }
    case "TERMS_ACCEPT": return { ...s, engagements: s.engagements.map(e => e.id === a.id ? { ...e, revised: false, revisionAcceptedAt: now } : e) };
    case "AF_TICK": {
      let n = s;
      const stale = n.engagements.some(e => (e.auto || e.exclusive) && PEND17.includes(e.state) && ((e.state === "requested" && e.expiresAt && e.expiresAt <= now) || (e.state !== "requested" && e.auto && e.selectBy && e.selectBy <= now) || (e.state === "discuss" && e.exclusive && e.expiresAt && e.expiresAt <= now)));
      if (stale) n = { ...n, engagements: n.engagements.map(e => (e.auto || e.exclusive) && PEND17.includes(e.state) && ((e.state === "requested" && e.expiresAt && e.expiresAt <= now) || (e.state !== "requested" && e.auto && e.selectBy && e.selectBy <= now) || (e.state === "discuss" && e.exclusive && e.expiresAt && e.expiresAt <= now)) ? mark17(e, "expired", now) : e) };
      /* Nothing stays actionable once the shift has started. */
      { const es = keep17(n.engagements, e => { const sh = n.shifts.find(x => x.id === e.shiftId); return sh && PEND17.includes(e.state) && (e.auto || e.exclusive) && startMs17(sh) && startMs17(sh) <= now ? mark17(e, "expired", now, { closed: true }) : e; }); if (es !== n.engagements) n = { ...n, engagements: es }; }
      Object.values(n.af17 || {}).forEach(af => {
        if (af.status !== "matching") return;
        const sh = n.shifts.find(x => x.id === af.shiftId);
        if (!sh || !n.events.some(v => v.id === sh.eventId)) { n = end17(n, af.shiftId, "cancelled", "The booking was removed"); return; }
        if (open17(n, sh) < 1) { n = { ...n, af17: { ...n.af17, [sh.id]: { ...af, status: "filled", needBatch: false, endedAt: now } } }; return; }
        if (startMs17(sh) && startMs17(sh) <= now) { n = end17(n, sh.id, "unfilled", "The shift started before it was filled"); return; }
        const mine = n.engagements.filter(e => e.shiftId === sh.id && e.auto);
        const last = af.batches[af.batches.length - 1];
        const waiting = mine.some(e => e.batch === (last && last.n) && e.state === "requested"), avail = mine.some(e => e.state === "available");
        const pending = mine.some(e => PEND17.includes(e.state));
        if (af.exhausted && !pending) { n = end17(n, sh.id, "unfilled", "Nobody else matched"); return; }
        if (!af.needBatch && !af.exhausted && !waiting && !avail) n = { ...n, af17: { ...n.af17, [sh.id]: { ...af, needBatch: true } } };
      });
      /* A paid booking whose shift has started with nobody confirmed and no Autofill running is refunded. */
      Object.keys(n.paid17 || {}).forEach(eid => n.shifts.filter(x => x.eventId === eid && startMs17(x) && startMs17(x) <= now && open17(n, x) > 0 && !(n.af17 || {})[x.id] && n.engagements.some(e => e.shiftId === x.id) && !n.engagements.some(e => e.shiftId === x.id && PEND17.includes(e.state))).forEach(x => { n = settle17(n, x, "The shift started before it was confirmed"); }));
      /* Reminder 30 days out, only for bookings made further ahead than that. */
      { const es = keep17(n.engagements, e => {
        if (e.state !== "confirmed" || e.remind30 || !e.confirmedAt) return e;
        const sh = n.shifts.find(x => x.id === e.shiftId), st = startMs17(sh);
        if (!st || st - now > 30 * 864e5 || st - e.confirmedAt < 30 * 864e5) return e;
        return { ...e, remind30: now };
      }); if (es !== n.engagements) n = { ...n, engagements: es }; }
      return n === s ? s : n;
    }
    default: return null;
  }
}



/* ---- Matching: role, location preference, nearest first ---- */
function candidates17(state, all, sh, ev) {
  const R = rules17(state), key = roleKey11(sh.role);
  const home = areaKey11((ev && ev.venue) || sh.venue) || "Central London";
  const dist = (p) => { const a = personArea11(p); if (!a) return null; const [x1, y1] = MAP_AREAS[a], [x2, y2] = MAP_AREAS[home]; return Math.hypot(x1 - x2, y1 - y2); };
  const tried = new Set(state.engagements.filter(e => e.shiftId === sh.id).map(e => e.staffId));
  return all.filter(p => p.id !== "me" && !p.isCompany && !p.business && !p.inactive && p.status !== "inactive" && !tried.has(p.id) && (!key || personSearchText(p).toLowerCase().includes(key)) && dist(p) != null && (!R.distance || dist(p) * 0.4 <= R.distance) && !conflict17(state, p.id, sh, ""))
    .sort((a, b) => dist(a) - dist(b) || String(a.name).localeCompare(String(b.name))).slice(0, R.batch).map(p => p.id);
}



/* Runs in the background of the whole app: starts Autofill after a declined or lapsed exclusive invitation,
   sends the next batch at the agreed decision points, and keeps the clock moving. */
function AutofillEngine17() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  useEffect(() => { dispatch({ type: "AF_TICK" }); const t = setInterval(() => dispatch({ type: "AF_TICK" }), 15000); return () => clearInterval(t); }, []);
  useEffect(() => {
    dispatch({ type: "AF_TICK" });
    state.shifts.forEach(sh => {
      const af = (state.af17 || {})[sh.id];
      if (af) return;
      const ex = state.engagements.filter(e => e.shiftId === sh.id && e.exclusive);
      /* v17.4.6.1: only when Autofill is on for this shift (chosen at booking, or turned on afterwards). */
      if ((sh.route === "auto" || sh.afBackup) && ex.length && !ex.some(e => PEND17.includes(e.state) || DONE.includes(e.state)) && open17(state, sh) > 0) dispatch({ type: "AF_START", shiftId: sh.id });
    });
    Object.values(state.af17 || {}).forEach(af => {
      if (af.status !== "matching" || !af.needBatch || af.exhausted) return;
      const sh = state.shifts.find(x => x.id === af.shiftId); if (!sh) return;
      dispatch({ type: "AF_BATCH", shiftId: sh.id, ids: candidates17(state, all, sh, state.events.find(v => v.id === sh.eventId)) });
    });
  }, [state.af17, state.engagements, state.shifts, state.paid17, state.warp17]);
  return null;
}



/* ---- The Autofill card, last in the row after Search ---- */
function AutofillCard17({ shifts }) {
  const { state, dispatch } = useStore();
  const R = rules17(state);
  const ids = shifts.filter(sh => !(state.af17 || {})[sh.id] && open17(state, sh) > 0).map(sh => sh.id);
  const on = ids.length > 0 && shifts.filter(sh => ids.includes(sh.id)).every(sh => sh.route === "auto");
  const text = `Invite ${R.batch === 10 ? "ten" : R.batch} matching professionals near your event, then choose from those available.`;
  if (!ids.length) return null;
  return (
    <button type="button" className={`ff-pick11-t ff-pick11-more ff-pick11-auto${on ? " on" : ""}`} aria-pressed={on} aria-label={`Autofill. ${text}`} onClick={() => dispatch({ type: "AF_ROUTE", shiftIds: ids, on: !on })}>
      <span className="card"><I11.Sparkles size={34} strokeWidth={2} /></span>
      {on && <span className="tick" aria-hidden="true"><I11.Check size={16} strokeWidth={3} /></span>}
      <i>Autofill</i><small>{text}</small>
    </button>
  );
}


function AutoPanel17({ sh, ev }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [sure, setSure] = useState(false), [reply, setReply] = useState({});
  const af = (state.af17 || {})[sh.id], now = now17(state);
  const mine = state.engagements.filter((e) => e.shiftId === sh.id);
  const auto = mine.filter((e) => e.auto), ex = mine.filter((e) => e.exclusive && !e.auto);
  const rf = (state.refunds17 || []).filter((r) => r.status !== "void" && (r.shiftId === sh.id || r.kind === "party" && r.eventId === sh.eventId));
  if (!af && !ex.length && !auto.length && sh.route !== "auto")
    return null;
  const who = (pid) => findPerson(all, state, pid) || { name: "Someone" };
  const avail = auto.filter((e) => e.state === "available" && e.selectBy > now), talk = auto.filter((e) => e.state === "discuss");
  const waitN = auto.filter((e) => e.state === "requested").length, noN = auto.filter((e) => e.state === "unavailable" || e.state === "withdrawn").length;
  const last = af && af.batches[af.batches.length - 1];
  const exPend = ex.find((e) => ["requested", "discuss"].includes(e.state) && e.expiresAt > now);
  const done = af && af.status !== "matching";
  const lead = mine.filter((e) => DONE.includes(e.state));
  const wa = (p) => `https://wa.me/${String(p.phone || "447700900123").replace(/\D/g, "")}`;
  return React.createElement("div", {
    className: "ff-af17",
    role: "group",
    "aria-label": `Autofill for ${sh.role}`
  }, exPend && React.createElement("p", {
    className: "ln"
  }, React.createElement("b", null, "Held for ", firstName(who(exPend.staffId).name)), " until ", dt17(exPend.expiresAt), ". If they decline or don't reply, Autofill starts."), af && af.replacement && af.status === "matching" && React.createElement("p", {
    className: "ln warn"
  }, React.createElement("b", null, "Replacement being sourced."), " Your professional cancelled. There is no new booking charge, and you are refunded if FireFlair can't fulfil the booking."), sh.route === "auto" && !af && React.createElement("p", {
    className: "ln"
  }, "Autofill starts as soon as your booking is paid."), af && af.status === "matching" && last && React.createElement("p", {
    className: "ln"
  }, React.createElement("b", null, "Autofill · batch ", last.n), " ", last.size, " professionals invited. They reply by ", dt17(last.respondBy), ". Choose by ", dt17(last.selectBy), ".", waitN ? ` ${waitN} waiting.` : "", noN ? ` ${noN} unavailable.` : "", talk.length ? ` ${talk.length} want to talk first.` : ""), af && af.status === "matching" && !last && React.createElement("p", {
    className: "ln"
  }, "Finding professionals near your event…"), af && af.status === "matching" && af.exhausted && React.createElement("p", {
    className: "ln"
  }, "Everyone who matches has been invited."), avail.length > 0 && React.createElement(React.Fragment, null, React.createElement("h4", {
    className: "h"
  }, avail.length, " available. Choose one to confirm"), React.createElement(HScroll, { label: "Available professionals" }, avail.map((e) => {
  const p = who(e.staffId), why = pickCheck17(state, e);
  return React.createElement(AvailCard11, { key: e.id, e, who: p, disabledWhy: why, onChoose: () => {
    dispatch({ type: "AF_PICK", id: e.id });
    dispatch({ type: "TOAST", toast: `${firstName(p.name)} confirmed for ${sh.role}` });
  }, onProfile: () => dispatch({ type: "PEEK", id: p.id }) });
}))), talk.length > 0 && React.createElement(React.Fragment, null, React.createElement("h4", {
    className: "h"
  }, "Questions before they commit"), talk.map((e) => {
    const p = who(e.staffId);
    return React.createElement("div", {
      key: e.id,
      className: "q"
    }, React.createElement("b", null, p.name), (e.thread || []).map((m, i) => React.createElement("p", {
      key: i,
      className: m.from
    }, m.from === "pro" ? "" : "You: ", m.text)), React.createElement("span", {
      className: "in"
    }, React.createElement("input", {
      className: "ff-input",
      "aria-label": `Reply to ${p.name}`,
      value: reply[e.id] || "",
      onChange: (x) => setReply({ ...reply, [e.id]: x.target.value }),
      placeholder: "Your answer"
    }), React.createElement("button", {
      type: "button",
      className: "ff-acc",
      disabled: !(reply[e.id] || "").trim(),
      onClick: () => {
        dispatch({ type: "AF_REPLY", id: e.id, text: reply[e.id] });
        setReply({ ...reply, [e.id]: "" });
      }
    }, "Reply")));
  })), lead.length > 1 && React.createElement("ul", {
    className: "ff-replies lead"
  }, lead.map((e) => React.createElement("li", {
    key: e.id
  }, React.createElement(Portrait, {
    src: who(e.staffId).photo,
    name: who(e.staffId).name,
    size: 22
  }), React.createElement("span", null, React.createElement("b", null, who(e.staffId).name), e.leader ? React.createElement("small", null, "Team leader") : null), React.createElement("button", {
    type: "button",
    className: "ff-acc",
    onClick: () => dispatch({ type: "AF_LEAD", id: e.id })
  }, e.leader ? "Remove team leader" : "Make team leader")))), lead.length > 0 && React.createElement("ul", {
    className: "ff-replies hand"
  }, lead.map((e) => {
    const p = who(e.staffId);
    return React.createElement("li", {
      key: e.id
    }, React.createElement("span", null, React.createElement("b", null, p.name, " · ", e.ref || ref17(e)), React.createElement("small", null, "Phone ", p.phone || "+44 7700 900123")), React.createElement("a", {
      className: "ff-acc",
      href: wa(p),
      target: "_blank",
      rel: "noopener noreferrer"
    }, React.createElement(WhatsAppIcon, {
      size: 12
    }), " Message on WhatsApp"), React.createElement("button", {
      type: "button",
      className: "ff-acc",
      onClick: () => dispatch({ type: "PEEK", id: p.id })
    }, "Profile"));
  })), done && af.status === "filled" && React.createElement("p", {
    className: "ln ok"
  }, React.createElement("b", null, "Filled."), " Competing invitations are closed."), done && af.status === "unfilled" && React.createElement("p", {
    className: "ln warn"
  }, React.createElement("b", null, "Not filled."), " ", af.reason, "."), done && af.status === "cancelled" && React.createElement("p", {
    className: "ln"
  }, React.createElement("b", null, "Request cancelled.")), rf.map((r) => React.createElement("p", {
    key: r.id,
    className: "ln ok"
  }, r.status === "issued" ? React.createElement(React.Fragment, null, React.createElement("b", null, "Refunded £", r.amount), " to your original payment method.") : React.createElement(React.Fragment, null, React.createElement("b", null, "Held for FireFlair."), " ", r.reason))), (!done || af && af.status === "unfilled") && open17(state, sh) > 0 && !rf.length && !!(af || ex.length) && (sure ? React.createElement("p", {
    className: "ln"
  }, React.createElement("b", null, "Cancel this request?"), " ", React.createElement("button", {
    type: "button",
    className: "ff-acc",
    onClick: () => {
      dispatch({ type: "AF_CANCEL", eventId: ev.id, shiftId: sh.id });
      setSure(false);
    }
  }, "Yes, cancel & refund"), " ", React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => setSure(false)
  }, "Keep waiting")) : React.createElement("button", {
    type: "button",
    className: "ff-linkbtn",
    onClick: () => setSure(true)
  }, "Cancel request & refund")), af && af.status === "matching" && React.createElement("details", {
    className: "ff-af17-dev"
  }, React.createElement("summary", null, "Prototype controls"), React.createElement("div", {
    className: "row"
  }, React.createElement("button", {
    type: "button",
    onClick: () => dispatch({ type: "AF_SIM", shiftId: sh.id, kind: "available", index: 0 })
  }, "One says available"), React.createElement("button", {
    type: "button",
    onClick: () => dispatch({ type: "AF_SIM", shiftId: sh.id, kind: "discuss", index: 0 })
  }, "One wants to discuss"), React.createElement("button", {
    type: "button",
    onClick: () => dispatch({ type: "AF_SIM", shiftId: sh.id, kind: "decline" })
  }, "Everyone declines"), React.createElement("button", {
    type: "button",
    onClick: () => dispatch({ type: "AF_WARP", ms: 86400000 })
  }, "+24 hours"))));
}



/* ---- The professional's side of an invitation: Service Card actions ---- */
const QUICK17 = ["Can you provide transport?", "Can you increase the pay?", "Can you clarify the duties?"];


function ProOffer17({ e, shift, onDone }) {
  const { state, dispatch } = useStore();
  const [ask, setAsk] = useState(false), [txt, setTxt] = useState(""), [sure, setSure] = useState(false);
  const now = now17(state);
  const st = startMs17(shift), ended = st && st <= now;
  const go = (as, text) => { dispatch({ type: "AF_RESPOND", id: e.id, as, text }); if (as !== "discuss" && onDone) onDone(); };
  const share = <p className="ff-body ff-muted ff-pro17-note">If you're confirmed, your phone number and a Message on WhatsApp link are shared with the booker, and theirs with you.</p>;
  const thread = (e.thread || []).length > 0 && <div className="ff-pro17-thread">{e.thread.map((m, i) => <p key={i} className={m.from}>{m.from === "pro" ? "You: " : "Booker: "}{m.text}</p>)}</div>;
  const askBox = ask && (
    <div className="ff-pro17-ask">
      <div className="chips">{QUICK17.map(q => <button key={q} type="button" onClick={() => setTxt(q)}>{q}</button>)}</div>
      <input className="ff-input" aria-label="Your question" value={txt} onChange={(x) => setTxt(x.target.value.slice(0, 200))} placeholder="Your question" />
      <Btn variant="sm primary" disabled={!txt.trim()} onClick={() => { go("discuss", txt.trim()); setTxt(""); setAsk(false); }}>Send question</Btn>
    </div>
  );
  if (["requested", "discuss", "available"].includes(e.state) && ended) return <p className="ff-body ff-muted">This invitation has ended because the shift has started.</p>;
  if (e.state === "requested" || e.state === "discuss") {
    if (e.expiresAt && e.expiresAt <= now && (e.auto || e.exclusive)) return <p className="ff-body ff-muted">This invitation has ended.</p>;
    if (e.auto) return (<div className="ff-pro17">
      <p className="ff-body">Respond within 24 hours. If you're available, the host or business can confirm your shift by <b>{dt17(e.selectBy)}</b>.</p>
      <p className="ff-body ff-muted ff-pro17-note">This invitation has been shared with {Math.max(0, (e.batchSize || 1) - 1)} other professional{(e.batchSize || 1) - 1 === 1 ? "" : "s"}. Saying you're available doesn't guarantee the work. You aren't held exclusively and can withdraw before you're confirmed.</p>
      {share}{thread}
      <div className="ff-pro17-btns">
        <Btn variant="sm primary" onClick={() => go("available")}><Check size={12} /> I’m available</Btn>
        <Btn variant="sm ghost" onClick={() => setAsk(!ask)}>Discuss first</Btn>
        <Btn variant="sm ghost" onClick={() => go("unavailable")}>Unavailable</Btn>
      </div>{askBox}
    </div>);
    return (<div className="ff-pro17">
      {e.exclusive ? <p className="ff-body">This invitation is held for you until <b>{dt17(e.expiresAt)}</b>. Accept shift books you straight away on these terms.</p> : <p className="ff-body">Reply by <b>{dt17(e.expiresAt)}</b>. The first to accept gets the shift.</p>}
      {share}{thread}
      <div className="ff-pro17-btns">
        <Btn variant="sm primary" onClick={() => go("accept")}><Check size={12} /> Accept shift</Btn>
        <Btn variant="sm ghost" onClick={() => setAsk(!ask)}>Discuss first</Btn>
        <Btn variant="sm ghost" onClick={() => go("unavailable")}>Unavailable</Btn>
      </div>{askBox}
    </div>);
  }
  if (e.state === "available") return (<div className="ff-pro17">
    <p className="ff-body">You're marked available. The booker can confirm you until <b>{dt17(e.selectBy)}</b>. You aren't held exclusively.</p>{thread}
    <div className="ff-pro17-btns"><Btn variant="sm ghost" onClick={() => go("withdraw")}>Withdraw availability</Btn><Btn variant="sm ghost" onClick={() => setAsk(!ask)}>Ask a question</Btn></div>{askBox}
  </div>);
  if (e.state === "confirmed") return (<div className="ff-pro17">
    {e.revised && <div className="ff-pro17-rev"><p className="ff-body"><b>The terms of this shift have changed.</b> Please accept the new terms to keep the booking agreed.</p><Btn variant="sm primary" onClick={() => dispatch({ type: "TERMS_ACCEPT", id: e.id })}>Accept new terms</Btn></div>}
    {e.ref && <p className="ff-body ff-muted">Booking reference {e.ref}</p>}
    {e.remind30 && <p className="ff-body ff-muted">It's 30 days to go. Please check you can still make it. If not, use Cancel shift.</p>}
    {sure ? <p className="ff-body"><b>Cancel this shift?</b> FireFlair is told and finds a replacement. <button type="button" className="ff-acc" onClick={() => { dispatch({ type: "PRO_CANCEL", id: e.id }); dispatch({ type: "TOAST", toast: "Shift cancelled. FireFlair has been told" }); if (onDone) onDone(); }}>Yes, cancel shift</button> <button type="button" className="ff-linkbtn" onClick={() => setSure(false)}>Keep it</button></p>
      : !ended && <button type="button" className="ff-linkbtn" onClick={() => setSure(true)}>Cancel shift</button>}
  </div>);
  if (e.state === "withdrawn") return <p className="ff-body ff-muted">You withdrew your availability.</p>;
  if (e.state === "not_selected") return <p className="ff-body ff-muted">{e.filled ? "This position has been filled." : "You weren't chosen for this one."}</p>;
  if (e.state === "cancelled_pro") return <p className="ff-body ff-muted">You cancelled this shift. FireFlair has been told.</p>;
  return null;
}



/* ---- Admin: the rules, refunds waiting for a decision, matching cases, terms changes, messages and history ---- */
function AdmAutofill17({ state, dispatch, can }) {
  const R = rules17(state), ok = can("hide");
  const [rev, setRev] = useState({ shiftId: "", total: "", reason: "" }), [amt, setAmt] = useState({});
  const set = (k, v) => dispatch({ type: "RULES_SET", patch: { [k]: Math.max(0, +v || 0) }, by: "Admin" });
  const shName = (id) => { const sh = (state.shifts || []).find(x => x.id === id); return sh ? `${sh.role} · ${(state.events.find(v => v.id === sh.eventId) || {}).title || ""}` : "Event"; };
  const rf = state.refunds17 || [], review = rf.filter(r => r.status === "review");
  const afs = Object.values(state.af17 || {});
  const fails = (state.notes17 || []).filter(n => n.wa === "failed");
  const fields = [["batch", "Invitations per batch"], ["exclusiveH", "Exclusive invitation, hours"], ["batchH", "Batch reply period, hours"], ["selectDays", "Longest selection period, days"], ["distance", "Search distance, miles (0 = any)"]];
  return (
    <div className="ff-adm-af17">
      <h3 className="ff-adm-h3">Booking rules <small>Policy {POLICY17.version}</small></h3>
      <div className="ff-adm-rules">{fields.map(([k, l]) => <label key={k}><span>{l}</span><input className="ff-input" type="number" min="0" disabled={!ok} value={R[k]} onChange={(x) => set(k, x.target.value)} aria-label={l} /></label>)}</div>
      <h3 className="ff-adm-h3">Needs a decision {review.length ? <i>{review.length}</i> : null}</h3>
      {review.map(r => (<div key={r.id} className="ln"><span className="mn"><b>{r.shiftId ? shName(r.shiftId) : shName((state.shifts.find(x => x.eventId === r.eventId) || {}).id)}</b><small>{r.reason}</small></span>
        <input className="ff-input" type="number" min="0" placeholder="Refund £" aria-label="Refund amount" value={amt[r.id] || ""} onChange={(x) => setAmt({ ...amt, [r.id]: x.target.value })} />
        <button type="button" className="ff-adm-ghost" disabled={!ok} onClick={() => dispatch({ type: "RF_ISSUE", id: r.id, amount: amt[r.id] || 0, by: "Admin" })}>Issue refund</button>
        <button type="button" className="ff-adm-ghost" disabled={!ok} onClick={() => dispatch({ type: "AF_ADMIN_CONTINUE", shiftId: r.shiftId || (state.shifts.find(x => x.eventId === r.eventId && open17(state, x) > 0) || {}).id })}>Continue matching</button></div>))}
      {!review.length && <Empty17>No part-filled bookings waiting.</Empty17>}
      <h3 className="ff-adm-h3">Autofill</h3>
      {afs.map(a => (<div key={a.id} className="ln"><span className="mn"><b>{shName(a.shiftId)}</b><small>{a.status}{a.replacement ? " · replacement" : ""} · {a.batches.length} batch{a.batches.length === 1 ? "" : "es"}{a.reason ? ` · ${a.reason}` : ""}</small></span>
        {a.status !== "matching" && <button type="button" className="ff-adm-ghost" disabled={!ok} onClick={() => dispatch({ type: "AF_ADMIN_CONTINUE", shiftId: a.shiftId })}>Continue matching</button>}</div>))}
      {!afs.length && <Empty17>No Autofill requests yet.</Empty17>}
      <h3 className="ff-adm-h3">Refunds</h3>
      {rf.filter(r => r.status === "issued").map(r => <div key={r.id} className="ln"><span className="mn"><b>£{r.amount} · {r.kind === "party" ? "FF Party" : "FF Staff"}</b><small>{r.reason} · {dt17(r.at)}</small></span></div>)}
      {!rf.some(r => r.status === "issued") && <Empty17>No refunds issued.</Empty17>}
      <h3 className="ff-adm-h3">Change the terms of a booking</h3>
      <div className="ln"><select className="ff-adm-sel" aria-label="Service Card" value={rev.shiftId} onChange={(x) => setRev({ ...rev, shiftId: x.target.value })}><option value="">Choose a Service Card</option>{(state.shifts || []).map(x => <option key={x.id} value={x.id}>{shName(x.id)}</option>)}</select>
        <input className="ff-input" placeholder="New pay, £" aria-label="New pay" value={rev.total} onChange={(x) => setRev({ ...rev, total: x.target.value })} />
        <input className="ff-input" placeholder="Reason" aria-label="Reason" value={rev.reason} onChange={(x) => setRev({ ...rev, reason: x.target.value })} />
        <button type="button" className="ff-adm-ghost" disabled={!ok || !rev.shiftId || !rev.reason.trim()} onClick={() => { dispatch({ type: "TERMS_REVISE", shiftId: rev.shiftId, total: rev.total, reason: rev.reason, by: "Admin" }); setRev({ shiftId: "", total: "", reason: "" }); }}>Save and ask them to accept</button></div>
      {(state.revs17 || []).slice(-5).reverse().map(r => <div key={r.id} className="ln"><span className="mn"><b>{shName(r.shiftId)}</b><small>{r.by} · {dt17(r.at)} · {r.what}{r.to && r.to.total ? ` · pay £${r.from.total || "–"} to £${r.to.total}` : ""}</small></span></div>)}
      <h3 className="ff-adm-h3">Messages that failed</h3>
      {fails.map(n => <div key={n.id} className="ln"><span className="mn"><b>{n.text}</b><small>WhatsApp failed · website notice delivered · {dt17(n.at)}</small></span></div>)}
      {!fails.length && <Empty17>No failed WhatsApp messages. In the prototype nothing is sent.</Empty17>}
      <h3 className="ff-adm-h3">History</h3>
      {(state.audit17 || []).slice(-12).reverse().map((a, i) => <div key={i} className="ln"><span className="mn"><b>{a.what}</b><small>{a.who} · {dt17(a.at)}</small></span></div>)}
      {!(state.audit17 || []).length && <Empty17>Nothing recorded yet.</Empty17>}
    </div>
  );
}



/* Words are never split across lines: a long word makes its text smaller instead. Several words may wrap. */
function FitWords17() {
  useEffect(() => {
    const SEL = ".ff-dx-tile .tx b, .ff-br17-opts b, .ff-br17-qual b";
    let raf = 0;
    const run = () => { raf = 0;
      document.querySelectorAll(SEL).forEach(el => {
        if (!el.offsetParent) return;
        el.style.fontSize = "";
        let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
        while (el.scrollWidth > el.clientWidth + 0.5 && fs > 8 && n++ < 40) { fs -= 0.5; el.style.fontSize = fs + "px"; }
      }); };
    const q = () => { if (!raf) raf = requestAnimationFrame(run); };
    const mo = new MutationObserver(q); mo.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", q); q();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(q);
    return () => { mo.disconnect(); window.removeEventListener("resize", q); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return null;
}



/* Hold a card for half a second and it pops up, anywhere on FF Party: people, packages, drinks and companies. */
function LongPress17() {
  const { state, dispatch } = useStore();
  const [pop, setPop] = useState(null);
  const on = state.role === "staff" && state.site === "party";
  const ref = useRef({ on, state });
  ref.current = { on, state };
  useEffect(() => {
    let tm = 0, sx = 0, sy = 0, hold = 0;
    const SEL = "[data-pk17],[data-ck17],[data-co17],[data-pr17]";
    const stop = () => { clearTimeout(tm); tm = 0; };
    const onDown = (e) => {
      if (!ref.current.on || (e.pointerType === "mouse" && e.button !== 0)) return;
      const el = e.target.closest && e.target.closest(SEL); if (!el) return;
      if (el.closest(".inf")) return;
      sx = e.clientX; sy = e.clientY; stop();
      tm = setTimeout(() => {
        tm = 0; hold = Date.now();
        try { navigator.vibrate && navigator.vibrate(15); } catch (_) {}
        if (el.dataset.pk17) setPop({ k: "pk", id: el.dataset.pk17, alt: el.dataset.pk17Alt });
        else if (el.dataset.ck17) setPop({ k: "ck", id: el.dataset.ck17 });
        else if (el.dataset.co17) dispatch({ type: "VIEW_COMPANY", id: el.dataset.co17 });
        else if (el.dataset.pr17) dispatch({ type: "VIEW", id: el.dataset.pr17 });
      }, 480);
    };
    const onMove = (e) => { if (tm && Math.hypot(e.clientX - sx, e.clientY - sy) > 10) stop(); };
    const onClick = (e) => { if (hold && Date.now() - hold < 900) { e.preventDefault(); e.stopPropagation(); hold = 0; } };
    const onCtx = (e) => { if (ref.current.on && e.target.closest && e.target.closest(SEL)) e.preventDefault(); };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("pointermove", onMove, true);
    document.addEventListener("pointerup", stop, true);
    document.addEventListener("pointercancel", stop, true);
    document.addEventListener("scroll", stop, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("contextmenu", onCtx, true);
    return () => { stop(); document.removeEventListener("pointerdown", onDown, true); document.removeEventListener("pointermove", onMove, true); document.removeEventListener("pointerup", stop, true); document.removeEventListener("pointercancel", stop, true); document.removeEventListener("scroll", stop, true); document.removeEventListener("click", onClick, true); document.removeEventListener("contextmenu", onCtx, true); };
  }, []);
  if (!pop) return null;
  const close = () => setPop(null);
  if (pop.k === "ck") { const c = ALLCK17.find(x => x.id === pop.id); return c ? <ClassicPop17 c={c} onClose={close} /> : null; }
  const svc = pop.alt === "byob" ? byobOf17(state) : pkgsOf17(state).find(x => x.id === pop.id);
  return svc ? <PkgSheet17 svc={svc} qual={(state.br17 || {}).q || ""} onClose={close} /> : null;
}
