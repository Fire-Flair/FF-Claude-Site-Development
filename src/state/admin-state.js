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


const allPackages17 = () => {
  const base = PARTY_SERVICES;
  return [...(base.some(x => x.id === "svc_staffing") ? base : [...base, STAFFING_SERVICE])];
};


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


