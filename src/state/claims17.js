/* src/state/claims17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   Claiming a directory company, and FireFlair editing a directory page.
   One company page, one format, three writers (the agent, FireFlair, the owner).
   Nothing a person wrote is lost or silently replaced; nothing shows as claimed
   until FireFlair has approved it.

   state.coClaims17   [{ id, slug, phone, at, status: "pending" | "approved" | "rejected", company }]
                      company is the owner's copy of the page in the builder's own shape. It is kept for every claim, so a
                      rejected claim is never lost and the owner can come back to it with the same phone number.
   state.dirEdits17   { [slug]: company }   FireFlair's own edits of a directory page (the builder's shape).
   company.claimSlug / company.claimId      set on the owner's company while it is a claim.
   company.dirEditSlug                      set while FireFlair edits a directory page in the builder.
   session.claimSlug                        the page the visitor pressed Claim this profile on.
   ========================================================================== */

const CLAIM_DIG17 = (x) => String(x || "").replace(/\D/g, "").slice(-9);

const coClaims17 = (s) => (s && s.coClaims17) || [];

/* The claim that is live on a directory page (pending or approved). A rejected claim leaves the directory version showing. */
const coClaimOn17 = (s, slug) => coClaims17(s).find((x) => x.slug === slug && x.status !== "rejected") || null;

/* The signed-in owner's own claim, whatever its status. */
const coClaimMine17 = (s) => { const c = (s && s.company) || {}; return c.claimId ? coClaims17(s).find((x) => x.id === c.claimId) || null : null; };

const claimStatusMeta17 = (st) => (st === "approved" ? "claimed" : st === "pending" ? "claim-pending" : "directory");

const claimLabel17 = (st) => (st === "pending" ? "Claim being checked" : st === "rejected" ? "Claim not approved" : "");

/* FireFlair's admin session (set by the DEV · FireFlair admin button). */
const isAdmin17 = (s) => !!(s && s.adminMode17 && s.auth && s.auth.status === "signedIn");

/* What the builder starts from for a directory page: FireFlair's edits, else a live claim, else the profile file. */
function dirSource17(s, slug) {
  const e = (s.dirEdits17 || {})[slug], cl = coClaimOn17(s, slug);
  return e || (cl && cl.company) || coFromProfile17(slug);
}

/* Fields of the builder's copy that show on the public page. */
const DIR_PUBLIC_KEYS17 = ["name", "kind", "areas", "description", "logo", "logoWide", "theme", "layout", "socials", "info", "records", "qa"];

/* The public page of a directory company, from FireFlair's edits or a live claim over the profile file. null = the plain directory page. */
function dirOverlay17(s, id) {
  const slug = String(id || "").replace(/^co_/, "");
  const cl = coClaimOn17(s, slug), e = (s.dirEdits17 || {})[slug];
  if (!cl && !e) return null;
  const src = e || cl.company;
  const out = {};
  DIR_PUBLIC_KEYS17.forEach((k) => { if (src[k] !== undefined) out[k] = src[k]; });
  out.media = (src.media || []).map((m) => ({ id: m.id, src: m.src || m.dataUrl, alt: m.alt || m.name || src.name })).filter((m) => m.src);
  if (cl && cl.status === "approved") { out.unclaimed = false; out.claimed = true; }
  else if (cl) out.claimPending = true;
  return out;
}

/* ---- stamping: who wrote what -------------------------------------------------------------------------------------- */
const coSame17 = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const coSrc17 = (by) => ({ by, at: TODAY_ISO });

function coStampList17(prev, next, by, fields) {
  const was = {}; (prev || []).forEach((r) => { if (r && r.id) was[r.id] = r; });
  let changed = false;
  const out = (next || []).map((r) => {
    if (!r) return r;
    const p = was[r.id];
    const edited = p ? !fields.every((f) => coSame17(p[f], r[f])) : false;
    const needs = p ? edited && !(r.source && r.source.by === by) : !(r.source && r.source.by);
    if (!needs) return r;
    changed = true;
    const { url, ...rest } = r.source || {};
    return { ...r, source: { ...rest, ...coSrc17(by) } };
  });
  return changed ? out : next;
}

function coStamp17(prev, next, by) {
  if (!prev || !next) return next;
  let c = next, moved = false;
  const set = (patch) => { c = { ...c, ...patch }; moved = true; };
  if (prev.description !== next.description && !(next.aboutSource && next.aboutSource.by === by)) set({ aboutSource: coSrc17(by) });
  const info = coStampList17(prev.info, next.info, by, ["title", "lead", "text", "chips", "numbered", "quote"]);
  if (info !== next.info) set({ info });
  const qa = coStampList17(prev.qa, next.qa, by, ["text", "answer", "note"]);
  if (qa !== next.qa) set({ qa });
  if (next.records && next.records !== prev.records) {
    let recs = next.records, rmoved = false;
    Object.keys(next.records).forEach((k) => {
      const list = coStampList17((prev.records || {})[k], next.records[k], by, ["name", "description", "media", "hidden", "proposed", "document"]);
      if (list !== next.records[k]) { recs = { ...recs, [k]: list }; rmoved = true; }
    });
    if (rmoved) set({ records: recs });
  }
  return moved ? c : next;
}

/* The agent's words show a plate until a person has touched them. */
const coFromAgent17 = (src) => !!(src && src.by === "agent");

/* ---- actions ------------------------------------------------------------------------------------------------------- */
function claim17Reducer(s, a) {
  switch (a.type) {
    /* A new claim: the owner's copy starts as the page as it is now (FireFlair's edits, or the profile file). */
    case "CLAIM17_NEW": {
      const base = dirSource17(s, a.slug);
      const id = "cl_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
      const company = { ...(s.company || {}), ...base, slug: a.slug, phone: a.phone || "", claimSlug: a.slug, claimId: id, joinedAt: Date.now(), meta: { ...(base.meta || {}), status: "claim-pending", statusAt: TODAY_ISO } };
      const claim = { id, slug: a.slug, phone: a.phone || "", at: Date.now(), status: "pending", company };
      return { ...s, company, coClaims17: [...coClaims17(s), claim], session: { ...s.session, claimSlug: null } };
    }
    /* The owner is back with the same phone number: the claim's copy of the page comes back, with its status. */
    case "CLAIM17_RESTORE": {
      const cl = coClaims17(s).find((x) => x.id === a.id); if (!cl) return s;
      return { ...s, company: { ...cl.company, ...(s.company && s.company.phone ? {} : {}), claimId: cl.id, claimSlug: cl.slug, meta: { ...(cl.company.meta || {}), status: claimStatusMeta17(cl.status), statusAt: TODAY_ISO } }, session: { ...s.session, claimSlug: null } };
    }
    /* FireFlair opens a directory page in the builder. The signed-in company (if any) waits in dirStash17. */
    case "DIR_EDIT17_START": {
      const src = dirSource17(s, a.slug);
      const stash = s.company && s.company.dirEditSlug ? s.dirStash17 : { company: s.company || {}, ed17: s.ed17 || null };
      return { ...s, dirStash17: stash, ed17: "biz", company: { ...src, slug: a.slug, dirEditSlug: a.slug, claimId: undefined, claimSlug: undefined, joinedAt: Date.now(), finishedAt: Date.now(), saved: true, cardSavedAt: Date.now() } };
    }
    case "DIR_EDIT17_END": {
      const c = s.company || {}, slug = c.dirEditSlug; if (!slug) return s;
      const st = s.dirStash17 || {};
      const { dirEditSlug, joinedAt, finishedAt, saved, cardSavedAt, ...keep } = c;
      return { ...s, dirStash17: null, ed17: null, company: st.company || {},
        ...(a.commit ? { dirEdits17: { ...(s.dirEdits17 || {}), [slug]: keep } } : {}) };
    }
    default: return null;
  }
}

/* After every action: what a person changed is stamped as theirs, and the claim keeps its copy of the owner's page. */
function claim17Post(prev, next, a) {
  const nc = next.company, pc = prev.company;
  if (!nc || nc === pc || !(nc.claimId || nc.dirEditSlug)) return next;
  const t = a && a.type;
  if (/^(CLAIM17_|DIR_EDIT17_)/.test(t) || t === "COMPANY_SIGNED_IN") return next;
  let out = next;
  const whole = t === "COMPANY_SAVE" && a.company && Object.prototype.hasOwnProperty.call(a.company, "records");
  if (!whole && pc && (pc.claimId === nc.claimId) && pc.dirEditSlug === nc.dirEditSlug) {
    const c2 = coStamp17(pc, nc, nc.dirEditSlug ? "fireflair" : "owner");
    if (c2 !== nc) out = { ...out, company: c2 };
  }
  const co = out.company;
  if (co.claimId && coClaims17(out).some((x) => x.id === co.claimId)) {
    const { dirEditSlug, ...snap } = co;
    out = { ...out, coClaims17: coClaims17(out).map((x) => (x.id === co.claimId ? { ...x, company: snap } : x)) };
  }
  return out;
}
