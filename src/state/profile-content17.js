/* src/state/profile-content17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   PROFILE CONTENT (v17.4.6) — the cocktails, Service Cards and FireFlair
   Stories a member builds under "Build your packages".
   One profile-owned, versioned field:
     profile.content = { v: 1, rev, updatedAt, cocktails: [], services: [], stories: [] }
   Entries keep their ids for life (cocktails "ck_…", services "sv_…", stories "bp_…").
   Save is the only publication step: a saved entry shows on the member's
   published profile straight away; on an unpublished profile it is kept and
   shows once the profile is published (the public projection reads
   profile.live). Unsaved edits stay in the editor and never reach the store.
   Writes go through PROFILE_ADAPTER.saveContent(), which validates structure,
   ownership and limits (pcValidate17) before the store changes.
   Older data (state.myCocktails, state.myServices, state.myPosts) is moved in
   once by migrate1746 with the same ids; the old keys are left untouched.
   ========================================================================== */
const PC17_KINDS = { cocktail: "cocktails", service: "services", post: "stories" };


const PC17_LIMITS = { cocktails: 60, services: 30, stories: 40, field: 4000, list: 40, photos: 10 };


const PC17_EMPTY = { v: 1, rev: 0, updatedAt: null, cocktails: [], services: [], stories: [] };


const pcOf17 = (profile) => ({ ...PC17_EMPTY, ...((profile && profile.content) || {}) });


/* The member's own entries of one kind ("cocktails" | "services" | "stories"). */
const myContent17 = (state, kind) => pcOf17(state && state.profile)[kind] || [];


/* What visitors see: saved entries, only once the profile is published. */
const publicContent17 = (state, kind) => (state && state.profile && state.profile.live ? myContent17(state, kind) : []);


/* Strip control characters and cap every string; keep numbers and booleans; recurse into lists and objects. */
function pcClean17(v, depth) {
  if (depth > 5) return undefined;
  if (typeof v === "string") return v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").slice(0, PC17_LIMITS.field);
  if (typeof v === "number") return isFinite(v) ? v : undefined;
  if (typeof v === "boolean" || v === null) return v;
  if (Array.isArray(v)) return v.slice(0, PC17_LIMITS.list).map(x => pcClean17(x, depth + 1)).filter(x => x !== undefined);
  if (v && typeof v === "object") { const o = {}; Object.keys(v).slice(0, 80).forEach(k => { if (/^[A-Za-z0-9_]{1,40}$/.test(k)) { const c = pcClean17(v[k], depth + 1); if (c !== undefined) o[k] = c; } }); return o; }
  return undefined;
}


/* Image references allowed in content: an uploaded image (data:image/…), a packaged asset, a photo-library key, or https. */
const pcImgOk17 = (s) => !s || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(s) || /^https:\/\//i.test(s) || /^ffasset:/.test(s) || /^[a-z0-9_]{1,40}$/.test(s);


/* Returns null when valid, otherwise { reason, kind, id }. */
function pcValidate17(content, owner, account) {
  if (!content || content.v !== 1) return { reason: "bad-version" };
  if (!account || owner !== account) return { reason: "not-owner" };
  for (const kind of ["cocktails", "services", "stories"]) {
    const list = content[kind];
    if (!Array.isArray(list)) return { reason: "bad-structure", kind };
    if (list.length > PC17_LIMITS[kind]) return { reason: "too-many", kind };
    const ids = new Set();
    for (const x of list) {
      if (!x || typeof x.id !== "string" || !/^[a-z]{2,4}[_-][A-Za-z0-9_-]{2,40}$/.test(x.id) || ids.has(x.id)) return { reason: "bad-id", kind, id: x && x.id };
      ids.add(x.id);
      const name = kind === "cocktails" ? x.name : x.title;
      if (!String(name || "").trim()) return { reason: "name-required", kind, id: x.id };
      const pics = [x.photo, ...(x.media || [])];
      if (pics.length > PC17_LIMITS.photos + 1 || !pics.every(pcImgOk17)) return { reason: "bad-image", kind, id: x.id };
    }
  }
  return null;
}


/* Put one saved entry into the content, keeping its id and position (new entries go first). */
function pcWith17(content, kind, entry, remove) {
  const list = content[kind] || [];
  const at = list.findIndex(x => x.id === entry.id);
  const next = remove ? list.filter(x => x.id !== entry.id) : at >= 0 ? list.map(x => x.id === entry.id ? entry : x) : [entry, ...list];
  return { ...content, [kind]: next };
}


function pc17Reducer(s, a) {
  if (a.type !== "PC_SAVE") return null;
  return { ...s, profile: { ...s.profile, content: a.content } };
}


/* User-written story text for the article preview: only https and /stories/ links stay links. */
const pcSafeMd17 = (t) => String(t || "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, l, u) => /^(https:\/\/|\/stories\/)/i.test(u.trim()) ? `[${l}](${u.trim()})` : l);


/* One-time moves for v17.4.6: profile content, Q&A answers and coverage. Idempotent. */
function migrate1746(s) {
  let n = s;
  if (n.profile && !n.profile.content && ((n.myCocktails || []).length || (n.myServices || []).length || (n.myPosts || []).length)) {
    n = { ...n, profile: { ...n.profile, content: { ...PC17_EMPTY, rev: 1, updatedAt: new Date().toISOString(), cocktails: (n.myCocktails || []).slice(), services: (n.myServices || []).slice(), stories: (n.myPosts || []).slice(), migratedFrom: "state.myCocktails/myServices/myPosts" } } };
  }
  n = qaMigrate17(n);
  n = covMigrate17(n);
  return n;
}
