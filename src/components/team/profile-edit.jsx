/* src/components/team/profile-edit.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FF TEAM PHASE 1 — v1.2 additions
   1. Card tiers: every profile card has a rank — primary (gold), secondary
      (silver) or tertiary (bronze); one Gold and one Silver at most since v17.18. Stored on the record as
      `rank`; profiles saved before v1.2 have no rank and keep their old
      look (first card gold, next two silver, the rest bronze).
   2. Edit Profile mode: tick the cards to keep, drag them into order and
      between tiers, one Save Changes. State lives in `profileEdit` (a draft
      of order / tier / keep, plus cards We found that aren't saved yet);
      the profile's records stay the one source of truth and only change on
      Save Changes.
   3. CV and FireFlair imports open Edit Profile with the found cards on the
      profile itself — no separate review screen.
   4. Profession symbols on the Profile Card, Q&A asked from Network,
      Save & Publish, and the Share / wallet stack.
   ========================================================================== */

/* ---- 1. Tiers ------------------------------------------------------------ */
const TIER_KEYS = ["primary", "secondary", "tertiary"];


const RANK_ORDER = { primary: 0, secondary: 1, tertiary: 2 };


/* v17.18: one Gold (Primary) and one Silver (Secondary); every other card is Bronze (Extra). */
const PRIMARY_MAX = 1;


const SECONDARY_MAX = 1;


const RANK_CAP = { primary: PRIMARY_MAX, secondary: SECONDARY_MAX };


const RANK_NAME = { primary: "Primary", secondary: "Secondary", tertiary: "Extra" };


/* Sections that Edit Profile manages (Reviews and Q&A aren't cards you rank). */
const EDIT_CATS = ["professions", "qualifications", "skills", "venues", "experience", "languages", "interests", "media"].filter(venuesOn17);



/* Each record with the rank it shows at, in display order: primary, then
   secondary, then tertiary; hidden and unsaved cards last. */
function withRanks(list) {
  const shown = (r) => !r.hidden && !r.proposed;
  const legacy = !list.some(r => shown(r) && r.rank);
  let i = 0, pri = 0, sec = 0;
  const eff = list.map((r, idx) => {
    let k = !shown(r) ? "tertiary" : legacy ? cardRank(i++) : (RANK_ORDER[r.rank] !== undefined ? r.rank : "tertiary");
    if (k === "primary" && shown(r) && ++pri > PRIMARY_MAX) k = "secondary";
    if (k === "secondary" && shown(r) && ++sec > SECONDARY_MAX) k = "tertiary";
    return { r, rank: k, idx, last: shown(r) ? 0 : 1 };
  });
  return eff.sort((a, b) => a.last - b.last || RANK_ORDER[a.rank] - RANK_ORDER[b.rank] || a.idx - b.idx);
}


const rankedRecords = (list) => withRanks(list || []).map(e => e.r);



/* ---- 2. Placing cards: tiers live on the records -------------------------
   Every change applies to the profile straight away (and saves with it);
   there is no separate draft. Edit Profile is just a mode: always on while
   the profile is being built, and switched on with "Edit profile" after the
   first Save. Save in Save & Publish ends it. */
/* The list with every record's rank written down, in display order. Old
   profiles without ranks get them from their positions first. */
function rankAll(list) {
  const shown = (r) => !r.hidden && !r.proposed;
  return withRanks(list || []).map(({ r, rank }) => ({ ...r, rank: shown(r) ? rank : (r.rank || "tertiary") }));
}


/* New cards take a guess: the first becomes Primary if there isn't one,
   the next fill Secondary's two places, the rest go to Tertiary. */
function addRanked(list, fresh) {
  const out = rankAll(list);
  const count = (k) => out.filter(r => !r.hidden && !r.proposed && r.rank === k).length;
  (fresh || []).forEach(r => {
    const rank = r.rank && RANK_ORDER[r.rank] !== undefined ? r.rank
      : count("primary") === 0 ? "primary" : count("secondary") < SECONDARY_MAX ? "secondary" : "tertiary";
    out.push({ ...r, rank });
  });
  return rankAll(out);
}


/* Move one card to a tier and a place in it. Primary and Secondary hold one card each: the card that was there
   moves down one box (Primary to Secondary, Secondary to the front of Extra), and the move says so. */
function moveRecord(list, id, toRank, toIndex) {
  const rows = rankAll(list);
  const me = rows.find(r => r.id === id);
  if (!me) return { list: rows };
  const rest = rows.filter(r => r.id !== id);
  const lanes = Object.fromEntries(TIER_KEYS.map(k => [k, rest.filter(r => r.rank === k)]));
  const lane = lanes[toRank];
  const at = Math.max(0, Math.min(toIndex === undefined ? lane.length : toIndex, lane.length));
  lane.splice(at, 0, { ...me, rank: toRank });
  let bumped = null;
  ["primary", "secondary"].forEach((k, ki) => {
    const next = TIER_KEYS[ki + 1];
    const shown = lanes[k].filter(r => !r.hidden && !r.proposed);
    while (shown.length > RANK_CAP[k]) {
      const out = shown.pop();
      lanes[k] = lanes[k].filter(r => r.id !== out.id);
      lanes[next] = [{ ...out, rank: next }, ...lanes[next]];
      if (out.id !== id) bumped = { ...out, rank: next };
    }
  });
  return { list: TIER_KEYS.flatMap(k => lanes[k]), bumped };
}



function p1EditReducer(s, a) {
  switch (a.type) {
    case "PE_START": return { ...s, profileEdit: { on: true, at: Date.now() } };
    case "P1_STAFF_NOTIFY": return { ...s, staffNotify: { at: a.at } };
    case "P1_REWARDS_INTEREST": return { ...s, rewardsInterest: a.interest };
    case "P1_MEDIA_MOVE": {
      const m = [...(s.profile.media || [])], i = m.findIndex(x => x.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= m.length) return s;
      [m[i], m[j]] = [m[j], m[i]];
      return { ...s, profile: { ...s.profile, media: m } };
    }
    case "P1_MEDIA_REPLACE": return { ...s, profile: { ...s.profile, media: (s.profile.media || []).map(x => x.id === a.id ? { ...a.item, id: a.id } : x) } };
    case "PE_DONE": return { ...s, profileEdit: null };
    case "PE_MOVE": {
      const { list, bumped } = moveRecord(recsOf(s.profile, a.category), a.id, a.rank, a.index);
      const next = withRecords(s, a.category, list);
      return bumped ? { ...next, toast: `${bumped.name} moved to ${RANK_NAME[bumped.rank]}` } : next;
    }
    default: return null;
  }
}



/* ---- 2b. The editor ------------------------------------------------------ */
/* Editing while the profile is being built (until the first Save), or after
   "Edit profile" on a saved profile. */
function useEditing(isMe) {
  const { state } = useStore();
  if (!isMe) return false;
  const p = state.profile;
  const saved = state.auth.status === "signedIn" && (!!p.finishedAt || !!p.live);
  return !saved || !!(state.profileEdit && state.profileEdit.on);
}



/* v17.19: the builder's lists (RankList17 in attribute-cards.jsx) replace the Primary / Secondary / Extra boxes and their introduction. */



/* ---- 3. CV / FireFlair → straight onto the profile ---------------------------
   The existing extraction and mapping (buildSuggestions → recordsFromSuggestions)
   with no review step: everything found is added, with a guess at each
   card's tier, and the profile opens for editing. Edit, hide or delete any
   card with a tap. */
const CONF_ORDER = { high: 0, medium: 1, low: 2 };


function ImportToEdit({ result, onDone }) {
  const { state, dispatch } = useStore();
  useEffect(() => {
    const isDup = (s) => s.existing && !s.fill;
    const live = (result.suggestions || []).filter(s => !isDup(s));
    const recs = live.filter(s => s.kind === "record" && !s.replaces)
      .sort((a, b) => (CONF_ORDER[a.confidence] ?? 1) - (CONF_ORDER[b.confidence] ?? 1));
    const { byCategory, fills } = recordsFromSuggestions(recs, result.src);
    Object.values(byCategory).forEach(list => list.forEach(r => { r.verified = false; }));
    if (Object.keys(byCategory).length) dispatch({ type: "RECORDS_MERGE", byCategory });
    if (fills.length) dispatch({ type: "RECORDS_FILL", fills });
    const p = state.profile, patch = {};
    live.forEach(s => {
      if (s.kind === "name" && String(s.title || "").trim() && !String(p.name || "").trim()) patch.name = s.title.trim();
      /* v1.4: the biography is the person's own — CV import never writes or changes it. */
    });
    if (result.photo && result.photo.src && !p.photo) patch.photo = result.photo.src;
    if (Object.keys(patch).length) dispatch({ type: "PROFILE", patch });
    live.filter(s => s.kind === "answer").forEach(({ p: a }) => a.ai
      ? dispatch({ type: "AI_QUESTION_ADD", q: { id: uid("aiq"), text: a.text, options: ["Yes", "No"], answer: a.value, source: "FireFlair" } })
      : dispatch({ type: "ANSWER", qid: a.qid, value: a.value }));
    const n = Object.values(byCategory).reduce((k, l) => k + l.length, 0);
    const from = result.what === "your CV" ? "your CV" : "what you wrote";
    dispatch({ type: "PE_START" });
    dispatch({ type: "TOAST", toast: n ? `${n} added from ${from}` : `Nothing new found in ${from}` });
    Object.keys(byCategory).forEach(cat => dispatch({ type: "TOGGLE_CATEGORY", key: `edit_attr_${cat}`, visible: true }));
    setTimeout(() => {
      const first = Object.keys(byCategory)[0];
      const el = document.getElementById(first ? `ff-sec-${first}` : "ff-sec-professions");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    onDone && onDone();
  }, []);
  return null;
}
