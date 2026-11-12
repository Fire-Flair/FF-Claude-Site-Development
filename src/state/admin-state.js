/* src/state/admin-state.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const A17I = {
  Dash: lucideIcon("LayoutDashboard"), Globe: lucideIcon("Globe"), Users: lucideIcon("Users"), Brief: lucideIcon("Briefcase"),
  Layers: lucideIcon("Layers"), Cal: lucideIcon("CalendarDays"), Msg: lucideIcon("MessageSquare"), Star: lucideIcon("Star"),
  Shield: lucideIcon("ShieldCheck"), Hist: lucideIcon("History"), Db: lucideIcon("Database"), Eye: lucideIcon("Eye"),
  EyeOff: lucideIcon("EyeOff"), X: lucideIcon("X"), Search: lucideIcon("Search"), Copy: lucideIcon("Copy"),
  Refresh: lucideIcon("RefreshCw"), Plus: lucideIcon("Plus"), ChevronDown: lucideIcon("ChevronDown"), Lock: lucideIcon("Lock"),
  Party: lucideIcon("PartyPopper"), Send: lucideIcon("Send"), Chart: lucideIcon("BarChart3"),
};



const ADM17_KINDS = ["people", "companies", "guests", "packages", "cards", "reviews", "events", "questions"];


const ADM17_DEFAULT = {
  hidden: Object.fromEntries(ADM17_KINDS.map(k => [k, {}])),
  tier: { people: {}, companies: {}, guests: {} },
  flags: null,
  invites: [],
  admins: [{ tag: "ALEXG", name: "Alex Gagnon", role: "owner", active: true, since: "2026-10-31" }],
  log: [],
  viewAs: "owner",
};


const adm17 = (s) => {
  const a = (s && s.admin17) || {};
  return { ...ADM17_DEFAULT, ...a, hidden: { ...ADM17_DEFAULT.hidden, ...(a.hidden || {}) }, tier: { ...ADM17_DEFAULT.tier, ...(a.tier || {}) },
    admins: a.admins || ADM17_DEFAULT.admins, log: a.log || [], invites: a.invites || [] };
};


const hid17 = (state, kind, id) => !!(state && state.admin17 && state.admin17.hidden && state.admin17.hidden[kind] && state.admin17.hidden[kind][id]);



const ADM17_ROLES = {
  owner: { label: "Owner", can: ["hide", "verify", "sites", "data", "admins", "export"] },
  admin: { label: "Admin", can: ["hide", "verify", "sites", "data", "export"] },
  gold: { label: "Gold package", can: ["hide", "verify"] },
};


const ADM17_PERMS = [["hide", "Hide and show content"], ["verify", "Set verification"], ["sites", "Switch sites and features"], ["data", "See answers, sign-ups and the database"], ["admins", "Manage admins"], ["export", "Copy data out"]];


/* Verification. The prototype's "standard" is Core's "base" (users.verification_level: base | bronze | silver | gold). */
const TIERS17 = [["standard", "Base"], ["bronze", "Bronze"], ["silver", "Silver"], ["gold", "Gold"]];


/* Question Cards: prototype id → Core question_master.question_key (scripts/seedQuestions.js). */
const CORE_QUESTION_KEYS = {
  g_travel: "generic_travel_to_events", g_freelance: "generic_freelance_availability", g_equipment: "generic_own_equipment",
  g_notice: "generic_short_notice_availability", g_events: "generic_event_experience",
  f_ease: "feedback_profile_creation_ease", f_confusing: "feedback_profile_confusion", f_useful: "feedback_profile_usefulness",
  f_cv: "feedback_use_as_cv", f_improve: "feedback_improvement_suggestions",
};



/* ---- State ---------------------------------------------------------------------------------------- */
function admin17Reduce(s, a) {
  const A = adm17(s);
  const by = String((s.auth && s.auth.tag) || "DEV").toUpperCase();
  const entry = (action, kind, ref, label) => [{ id: `log_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, at: Date.now(), by, action, kind, ref, label }, ...A.log].slice(0, 1000);
  switch (a.op) {
    case "hide": case "show": {
      const on = a.op === "hide";
      return { ...s, admin17: { ...A, hidden: { ...A.hidden, [a.kind]: { ...A.hidden[a.kind], [a.id]: on } }, log: entry(on ? "Hid" : "Showed", a.kind, a.id, a.label) } };
    }
    case "tier":
      return { ...s, admin17: { ...A, tier: { ...A.tier, [a.kind]: { ...A.tier[a.kind], [a.id]: a.value } }, log: entry(`Set verification to ${a.value}`, a.kind, a.id, a.label) } };
    case "flag": {
      const f = { ...(A.flags || {}), [a.key]: a.value };
      return { ...s, admin17: { ...A, flags: f, log: entry(`${a.value ? "Turned on" : "Turned off"}`, "settings", a.key, a.label) } };
    }
    case "site": {
      const cur = (A.flags && A.flags.sitesOpen) || (P1_DEF17 ? P1_DEF17.sitesOpen : PHASE1.sitesOpen);
      const next = a.value ? [...new Set([...cur, a.key])] : cur.filter(k => k !== a.key);
      return { ...s, admin17: { ...A, flags: { ...(A.flags || {}), sitesOpen: next }, log: entry(a.value ? "Made live" : "Took offline", "sites", a.key, a.label) } };
    }
    case "admin_add": {
      const tag = String(a.tag || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
      if (!tag || A.admins.some(x => x.tag === tag)) return s;
      return { ...s, admin17: { ...A, admins: [...A.admins, { tag, name: a.name || "", role: a.role || "admin", active: true, since: TODAY_ISO }], log: entry(`Added as ${(ADM17_ROLES[a.role] || {}).label || "Admin"}`, "admins", tag, tag) } };
    }
    case "admin_set":
      return { ...s, admin17: { ...A, admins: A.admins.map(x => x.tag === a.tag ? { ...x, ...a.patch } : x),
        log: entry(a.patch.active === false ? "Deactivated" : a.patch.active === true ? "Reactivated" : `Role set to ${(ADM17_ROLES[a.patch.role] || {}).label}`, "admins", a.tag, a.tag) } };
    case "rename": return { ...s, admin17: { ...A, names: { ...(A.names || {}), [a.id]: a.name }, log: entry("Renamed a photo", "photos", a.id, a.name) } };
    case "copy": { const c = { ...(A.copy || {}) }; if (a.clear) delete c[a.key]; else c[a.key] = { ...(c[a.key] || {}), ...a.patch }; return { ...s, admin17: { ...A, copy: c, log: entry(a.clear ? "Reset front door content" : "Edited front door content", "doors", a.key, a.label) } }; }
    case "viewAs": return { ...s, admin17: { ...A, viewAs: a.value } };
    /* Invitations to join. Core sends them on WhatsApp (or email) with a sign-up link; the prototype records them. */
    case "invite": {
      const inv = { id: uid("inv"), name: String(a.name || "").trim(), contact: String(a.contact || "").trim(), site: a.site || "team", at: Date.now(), by, status: "sent", sends: 1 };
      if (!inv.contact) return s;
      return { ...s, admin17: { ...A, invites: [inv, ...A.invites], log: entry(`Invited to ${SITE_NAME17[inv.site]}`, "invites", inv.id, inv.name || inv.contact) } };
    }
    case "invite_resend":
      return { ...s, admin17: { ...A, invites: A.invites.map(x => x.id === a.id ? { ...x, at: Date.now(), sends: (x.sends || 1) + 1 } : x), log: entry("Resent invitation", "invites", a.id, a.label) } };
    /* Manual override of a booking request. Every change is added to the request's own history and the admin log. */
    case "eng_state":
      return { ...s, engagements: s.engagements.map(e => e.id === a.id ? { ...e, state: a.value, history: [...(e.history || []), { state: a.value, at: Date.now(), by: "admin" }] } : e),
        admin17: { ...A, log: entry(`Booking set to ${ENG_LABEL[a.value] || a.value}`, "bookings", a.id, a.label) } };
    case "eng_extend":
      return { ...s, engagements: s.engagements.map(e => e.id === a.id ? { ...e, state: e.state === "expired" ? "requested" : e.state, expiresAt: Math.max(Date.now(), e.expiresAt || 0) + 864e5,
        history: [...(e.history || []), { state: e.state === "expired" ? "requested" : e.state, at: Date.now(), by: "admin", note: "extended 24h" }] } : e),
        admin17: { ...A, log: entry("Extended the reply window by 24 hours", "bookings", a.id, a.label) } };
    case "eng_reassign": {
      const eng = s.engagements.find(e => e.id === a.id); if (!eng || !a.to) return s;
      return { ...s,
        engagements: s.engagements.map(e => e.id === a.id ? { ...e, staffId: a.to, state: "requested", sentAt: Date.now(), expiresAt: Date.now() + RESPONSE_MS, history: [...(e.history || []), { state: "requested", at: Date.now(), by: "admin", note: `reassigned from ${eng.staffId}` }] } : e),
        shifts: s.shifts.map(x => x.id === eng.shiftId ? { ...x, staffIds: staffOf(x).map(id => id === eng.staffId ? a.to : id), staffId: x.staffId === eng.staffId ? a.to : x.staffId } : x),
        admin17: { ...A, log: entry("Reassigned a booking request", "bookings", a.id, a.label) } };
    }
    default: return s;
  }
}



/* ---- Applying admin choices to the three sites ----------------------------------------------------- */
let PS_ALL17 = null, P1_DEF17 = null;


const allPackages17 = () => {
  const base = PS_ALL17 || PARTY_SERVICES;
  return [...(base.some(x => x.id === "svc_staffing") ? base : [...base, STAFFING_SERVICE]), ...DJ_PKGS17];
};


function applyAdmin17(state) {
  if (!PS_ALL17) PS_ALL17 = PARTY_SERVICES.slice();
  if (!P1_DEF17) P1_DEF17 = { sitesOpen: PHASE1.sitesOpen.slice(), bookingsLive: PHASE1.bookingsLive, xpLive: PHASE1.xpLive, leaderboards: PHASE1.leaderboards, desktopAdd: PHASE1.desktopAdd };
  const A = state.admin17;
  const hp = (A && A.hidden && A.hidden.packages) || {};
  const want = PS_ALL17.filter(x => !hp[x.id]);
  if (want.length !== PARTY_SERVICES.length || want.some((x, i) => PARTY_SERVICES[i] !== x)) PARTY_SERVICES.splice(0, PARTY_SERVICES.length, ...want);
  const f = { ...P1_DEF17, ...((A && A.flags) || {}) };
  PHASE1.sitesOpen = f.sitesOpen; PHASE1.bookingsLive = f.bookingsLive; PHASE1.xpLive = f.xpLive; PHASE1.leaderboards = f.leaderboards; PHASE1.desktopAdd = f.desktopAdd;
}


/* People and companies as the public sees them: hidden ones left out, verification as set by an admin. */
function adminPeople17(state, list) {
  const A = state && state.admin17;
  if (!A) return list;
  const h = (A.hidden && A.hidden.people) || {}, t = (A.tier && A.tier.people) || {};
  return list.filter(p => !h[p.id]).map(p => t[p.id] ? { ...p, tier: t[p.id] } : p);
}


function adminCompanies17(state, list) {
  const A = state && state.admin17;
  if (!A) return list;
  const h = (A.hidden && A.hidden.companies) || {}, t = (A.tier && A.tier.companies) || {};
  return list.filter(c => c && !h[c.id]).map(c => t[c.id] ? { ...c, tier: t[c.id] } : c);
}



/* ---- Reading everything ---------------------------------------------------------------------------- */
const fmt17 = (v) => {
  if (v === undefined || v === null || v === "") return "";
  if (Array.isArray(v)) return v.map(fmt17).filter(Boolean).join(", ");
  if (typeof v === "object") return Object.entries(v).filter(([k]) => !["account", "at"].includes(k)).map(([k, x]) => `${k}: ${fmt17(x)}`).filter(x => !/: $/.test(x)).join(" · ");
  return String(v);
};


const when17 = (t) => { if (!t) return ""; const d = new Date(t); return isNaN(d) ? "" : d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); };


const acct17 = (state) => String(state.auth.tag || state.session.tag || "").toUpperCase() || String(state.profile.name || "").trim() || "This browser";



function peopleAll17(state) {
  const me = String(state.profile.name || "").trim() ? [{ ...meAsStaff(state.profile, state.session), id: "me", src: "This account" }] : [];
  return [...me, ...(state.directory || []).map(p => ({ ...p, src: (state.joinedPeople || []).some(j => j.id === p.id) ? "Joined" : "Directory" }))];
}


function companiesAll17(state) {
  return [
    ...(state.company && String(state.company.name || "").trim() ? [{ ...companyById(state, "mine"), src: "This account" }] : []),
    ...COMPANIES.map(x => companyById(state, x.id)).filter(Boolean).map(c => ({ ...c, src: "Directory" })),
  ];
}


const SITE_NAME17 = { team: "FF Team", staff: "FF Staff", party: "FF Party" };


/* FF Party guests (customers). The prototype keeps a host's details on the same account record as a business. */
function guestsAll17(state) {
  const c = state.company || {};
  const mine = String(c.name || "").trim() && (c.partyStyle || c.usualArea || state.site === "party") ? [{ ...c, id: "mine", src: "This account" }] : [];
  return [...mine, { ...DEMO_HOST17, id: "guest_demo", src: "Demo host" }];
}


function cardsAll17(state) {
  return [
    ...myContent17(state, "services").filter(x => String(x.title || "").trim()).map(x => ({ id: x.id, type: "Service card", title: x.title, sub: x.type === "addon" ? "Add-on" : "Package", by: acct17(state) })),
    ...myContent17(state, "cocktails").filter(x => String(x.name || "").trim()).map(x => ({ id: x.id, type: x.style === "classic" ? "Classic cocktail" : "Signature cocktail", title: x.name, sub: x.base || x.glass || "", by: acct17(state) })),
    ...myContent17(state, "stories").filter(x => String(x.title || "").trim()).map(x => ({ id: x.id, type: "Story", title: x.title, sub: x.place || "", by: acct17(state) })),
  ];
}


function reviewsAll17(state, people) {
  const name = (id) => ((people.find(p => p.id === id) || {}).name) || id || "";
  const recs = (((state.profile || {}).records || {}).reviews || []).map(r => ({ id: r.id, about: String(state.profile.name || "This account"), by: r.byName || r.from || (r.details && r.details.employer) || "", text: r.description || r.text || r.name || "", rating: r.rating, at: r.at || r.createdAt }));
  const given = (state.reviews || []).map(r => ({ id: r.id, about: name(r.personId || r.aboutId || r.to), by: acct17(state), text: r.text || r.review || "", rating: r.rating, at: r.at }));
  const invites = (state.teamInvites || []).filter(x => String(x.review || "").trim()).map(x => ({ id: x.id, about: x.name || name(x.personId), by: acct17(state), text: x.review, rating: x.rating, at: x.at, status: x.status }));
  const companies = ((state.company && state.company.reviews) || []).map(r => ({ id: r.id, about: state.company.name || "Your business", by: r.byName || r.by || "", text: r.text || "", rating: r.rating, at: r.at }));
  return [...recs, ...given, ...invites, ...companies].filter(r => r.id);
}


function qaRows17(state, people) {
  const rows = [], me = acct17(state);
  const add = (area, q, a, extra = {}) => {
    const s = fmt17(a);
    if (s)
      rows.push({ area, q, a: s, account: me, ...extra });
  };
  const answers = state.profile.answers || {};
  Object.entries(answers).forEach(([k, v]) => {
    if (k.startsWith("av_"))
      add("Availability", `Available on ${shortDay(k.slice(3))}`, v);
    else {
      const q = QUESTIONS.find((x) => x.id === k);
      add(q && q.group === "hiring" ? "Hiring questions" : "Question cards", q ? q.text : k, v, { key: CORE_QUESTION_KEYS[k] || "" });
    }
  });
  Object.entries(state.feedback || {}).forEach(([k, v]) => {
    const q = QUESTIONS.find((x) => x.id === k);
    add("Feedback", q ? q.text : k, v, { key: CORE_QUESTION_KEYS[k] || "" });
  });
  (state.profile.aiQuestions || []).forEach((q) => add("Suggested questions", q.text, q.answer));
  (state.profileQuestions || []).forEach((q) => rows.push({
    area: "Asked on profiles",
    q: q.text,
    a: fmt17(q.answer) || "Not answered yet",
    account: q.by || "Visitor",
    about: (people.find((p) => p.id === q.personId) || {}).name || q.personId,
    hideId: q.id,
    at: q.askedAt
  }));
  /* v17.4.6: Training, Dream jobs, FF Rewards, FF VIP, package sign-ups, plan interest, area interest and
     preferred rates all come from the one Q&A store. */
  qaAdminRows17(state).forEach((r) => rows.push(r));
  if ((state.profile.unavail17 || []).length)
    add("Availability", "Not available", [...state.profile.unavail17].sort().map(shortDay));
  (state.availabilityAsks || []).forEach((x) => add("Availability requests", x.text || x.role || "Availability request", x));
  if (state.myTerms17)
    MY_TERMS17.forEach((t) => add("Personal terms", t.label, state.myTerms17[t.k]));
  if (state.svcTerms17)
    TERMS17.forEach((t) => add("Service card terms", t.label, state.svcTerms17[t.k]));
  (state.partyEvents || []).forEach((x) => add("Party leads", x.title || x.kind || "Event Card", x));
  return rows;
}
