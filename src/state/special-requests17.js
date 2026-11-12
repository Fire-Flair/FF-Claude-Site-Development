/* src/state/special-requests17.js — Special Requests (v17.4.8). Plain helpers; the list lives in state.specialReq17 (persisted).
   A request is free to submit and sits OUTSIDE events / engagements, so it never counts as a booking (paid17 stays false)
   until a person and FireFlair have agreed the arrangement. Stages are moved by FireFlair admin, except the customer's own
   agree / withdraw steps. Every move is recorded in history. No payment is taken here; the deposit stage only records
   that a deposit is now due. */
const SR17_STAGES = [
  ["review", "Pending review"], ["proposed", "Proposal ready"], ["approval", "Awaiting your approval"],
  ["deposit", "Awaiting deposit"], ["confirmed", "Confirmed"], ["completed", "Completed"], ["closed", "Closed"],
];
const SR17_NEXT = {
  review: { admin: ["proposed", "closed"] },
  proposed: { admin: ["approval", "closed"] },
  approval: { customer: ["deposit", "closed"], admin: ["closed"] },
  deposit: { admin: ["confirmed", "closed"], customer: ["closed"] },
  confirmed: { admin: ["completed", "closed"] },
  completed: {}, closed: {},
};
const SR17_CATS = [["bar", "Bar"], ["ent", "Entertainment"], ["svc", "Services"], ["food", "Food"]];

function sr17Label(stage) { const f = SR17_STAGES.find(function (x) { return x[0] === stage; }); return f ? f[1] : stage; }
function sr17List(state) { return Array.isArray(state.specialReq17) ? state.specialReq17 : []; }
function sr17Open(r) { return r.stage !== "closed" && r.stage !== "completed"; }
function sr17Sig(r) { return [r.cat, String(r.what || "").trim().toLowerCase(), r.iso || "", String(r.contact || "").trim().toLowerCase()].join("|"); }

/* Add a request. Returns { list, added, dup }. The same request sent twice (double click, changed category and back) is kept once. */
function sr17Add(state, draft, now) {
  const list = sr17List(state);
  const sig = sr17Sig(draft);
  const dup = list.find(function (x) { return sr17Open(x) && sr17Sig(x) === sig; });
  if (dup) return { list: list, added: null, dup: dup };
  const id = "sr_" + now.toString(36) + "_" + (list.length + 1);
  const rec = Object.assign({}, draft, { id: id, stage: "review", at: now, history: [{ stage: "review", at: now, by: "customer", note: "Request sent" }] });
  return { list: list.concat([rec]), added: rec, dup: null };
}

/* Move one request to a new stage as "admin" or "customer". Refused moves leave the list unchanged. */
function sr17Move(state, id, to, by, note, now) {
  const list = sr17List(state);
  let ok = false;
  const out = list.map(function (r) {
    if (r.id !== id) return r;
    const allow = (SR17_NEXT[r.stage] || {})[by] || [];
    if (allow.indexOf(to) < 0) return r;
    ok = true;
    return Object.assign({}, r, { stage: to, history: (r.history || []).concat([{ stage: to, at: now, by: by, note: note || "" }]) });
  });
  return { list: out, ok: ok };
}
