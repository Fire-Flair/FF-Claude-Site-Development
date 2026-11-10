/* src/components/team/profile-edit.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FF TEAM PHASE 1 — v1.2 additions
   1. Card tiers: every profile card has a rank — primary (gold), secondary
      (silver, two at most) or tertiary (bronze). Stored on the record as
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


const SECONDARY_MAX = 2;


const RANK_NAME = { primary: "Primary", secondary: "Secondary", tertiary: "Extra" };


/* Sections that Edit Profile manages (Reviews and Q&A aren't cards you rank). */
const EDIT_CATS = ["professions", "qualifications", "skills", "experience", "venues", "locations", "languages", "interests", "media"];



/* Each record with the rank it shows at, in display order: primary, then
   secondary, then tertiary; hidden and unsaved cards last. */
function withRanks(list) {
  const shown = (r) => !r.hidden && !r.proposed;
  const legacy = !list.some(r => shown(r) && r.rank);
  let i = 0, sec = 0;
  const eff = list.map((r, idx) => {
    let k = !shown(r) ? "tertiary" : legacy ? cardRank(i++) : (RANK_ORDER[r.rank] !== undefined ? r.rank : "tertiary");
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


/* Rows for the editor: every card, its tier, in order. */
function editRows(profile, cat) {
  return rankAll(recsOf(profile, cat)).map(r => ({ id: r.id, rank: r.rank, rec: r }));
}


/* Move one card to a tier and a place in it. A third Secondary card sends
   the last of the other two to the front of Tertiary (and says so). */
function moveRecord(list, id, toRank, toIndex) {
  const rows = rankAll(list);
  const me = rows.find(r => r.id === id);
  if (!me) return { list: rows };
  const rest = rows.filter(r => r.id !== id);
  const lanes = Object.fromEntries(TIER_KEYS.map(k => [k, rest.filter(r => r.rank === k)]));
  let bumped = null;
  if (toRank === "secondary" && me.rank !== "secondary") {
    const sec = lanes.secondary.filter(r => !r.hidden);
    if (sec.length >= SECONDARY_MAX) {
      bumped = sec[sec.length - 1];
      lanes.secondary = lanes.secondary.filter(r => r.id !== bumped.id);
      lanes.tertiary = [{ ...bumped, rank: "tertiary" }, ...lanes.tertiary];
    }
  }
  const lane = lanes[toRank];
  const at = Math.max(0, Math.min(toIndex === undefined ? lane.length : toIndex, lane.length));
  lane.splice(at, 0, { ...me, rank: toRank });
  return { list: TIER_KEYS.flatMap(k => lanes[k]), bumped };
}



function p1EditReducer(s, a) {
  switch (a.type) {
    case "PE_START": return { ...s, profileEdit: { on: true, at: Date.now() } };
    case "P1_STAFF_NOTIFY": return { ...s, staffNotify: { at: a.at } };
    case "P1_REWARDS_INTEREST": return { ...s, rewardsInterest: a.interest };
    case "P1_SET_PRIMARY_LOC": return p1PrimaryLocationReducer(s, a);
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
      return bumped ? { ...next, toast: `${bumped.name} moved to Extra` } : next;
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



function ProfileEditHead() {
  const { state, dispatch } = useStore();
  const editing = useEditing(true);
  const p = state.profile;
  const saved = state.auth.status === "signedIn" && (!!p.finishedAt || !!p.live);
  if (!editing) return null;
  return (
    <div className="ff-pe-head" id="ff-pe-head" role="note">
      {saved && <span className="ff-pe-badge"><Pencil size={12} /> Editing</span>}
      <p>
        <b>Drag and drop cards to place them.</b> <span className="dot primary" /> Primary attributes always show on your Profile Card,
        followed by <span className="dot secondary" /> secondary where possible. <span className="dot tertiary" /> Extra stay on your profile page.
        Tap a card to edit, hide or delete it.
      </p>
    </div>
  );
}



/* One section while editing: three lanes in one row. Drag a whole card —
   with a mouse, just drag; on a touchscreen, press and hold, then drag. A
   quick tap opens the card. Arrow keys on a focused card: ← → reorder,
   ↑ ↓ change tier. */
const DRAG_START_PX = 6;


const HOLD_MS = 240;


function TierEditor({ catKey, def, rows, onOpen, tail }) {
  const { dispatch } = useStore();
  const scrollRef = useRef(null);
  const [drag, setDrag] = useState(null);      // { id, x, y, w, dx, dy, over }
  const press = useRef(null);                  // pending press before a drag starts
  const dragRef = useRef(null); dragRef.current = drag;
  const suppressClick = useRef(false);
  const ptr = useRef(null);
  const lanes = Object.fromEntries(TIER_KEYS.map(k => [k, rows.filter(r => r.rank === k)]));

  const move = (id, rank, index) => dispatch({ type: "PE_MOVE", category: catKey, id, rank, index });

  const targetAt = (x, y, id) => {
    const el = document.elementFromPoint(x, y);
    const lane = el && el.closest && el.closest(`[data-pe-lane][data-pe-cat="${catKey}"]`);
    if (!lane) return null;
    const rank = lane.getAttribute("data-pe-lane");
    const cards = [...lane.querySelectorAll("[data-pe-card]")].filter(c => c.getAttribute("data-pe-card") !== id);
    let index = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (x < r.left + r.width / 2) { index = i; break; }
    }
    return { rank, index };
  };
  const begin = (pr) => {
    const r = pr.el.getBoundingClientRect();
    const row = rows.find(x => x.id === pr.id);
    try { pr.el.setPointerCapture(pr.pointerId); } catch (e) { /* older browsers */ }
    if (navigator.vibrate && pr.type === "touch") { try { navigator.vibrate(12); } catch (e) { /* not allowed */ } }
    setDrag({ id: pr.id, x: pr.x, y: pr.y, w: r.width, dx: pr.sx - r.left, dy: pr.sy - r.top,
      over: { rank: row.rank, index: lanes[row.rank].findIndex(x => x.id === pr.id) } });
  };
  const onDown = (ev, row) => {
    if (ev.button !== undefined && ev.button !== 0) return;
    const pr = { id: row.id, el: ev.currentTarget, pointerId: ev.pointerId, type: ev.pointerType, sx: ev.clientX, sy: ev.clientY, x: ev.clientX, y: ev.clientY, timer: null };
    if (ev.pointerType === "touch") pr.timer = setTimeout(() => { if (press.current === pr) begin(pr); }, HOLD_MS);
    press.current = pr;
  };
  const onMove = (ev) => {
    const pr = press.current;
    const d = dragRef.current;
    if (!d && pr) {
      const far = Math.hypot(ev.clientX - pr.sx, ev.clientY - pr.sy) > DRAG_START_PX;
      pr.x = ev.clientX; pr.y = ev.clientY;
      if (far && pr.type !== "touch") begin(pr);           // mouse / pen: drag at once
      else if (far && pr.type === "touch") { clearTimeout(pr.timer); press.current = null; }   // a swipe: let the row scroll
      return;
    }
    if (!d) return;
    ptr.current = { x: ev.clientX, y: ev.clientY };
    const over = targetAt(ev.clientX, ev.clientY, d.id) || d.over;
    setDrag(x => x && ({ ...x, x: ev.clientX, y: ev.clientY, over }));
  };
  const finish = (ev, cancel) => {
    const pr = press.current;
    if (pr) clearTimeout(pr.timer);
    press.current = null;
    const d = dragRef.current;
    if (!d) return;
    const over = (!cancel && ev && targetAt(ev.clientX, ev.clientY, d.id)) || d.over;
    setDrag(null);
    suppressClick.current = true;
    setTimeout(() => { suppressClick.current = false; }, 50);
    if (!cancel && over && over.rank) move(d.id, over.rank, over.index);
  };
  /* Once a touch drag has started, stop the page and the row from scrolling. */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const stop = (e) => { if (dragRef.current) e.preventDefault(); };
    el.addEventListener("touchmove", stop, { passive: false });
    return () => el.removeEventListener("touchmove", stop);
  }, []);
  /* Near either end of the row, keep scrolling it while dragging. */
  useEffect(() => {
    if (!drag) return;
    const t = setInterval(() => {
      const sc = scrollRef.current, p0 = ptr.current;
      if (!sc || !p0) return;
      const b = sc.getBoundingClientRect();
      const step = p0.x > b.right - 44 ? 16 : p0.x < b.left + 44 ? -16 : 0;
      if (!step) return;
      const before = sc.scrollLeft;
      sc.scrollLeft += step;
      if (sc.scrollLeft !== before) setDrag(d => d && ({ ...d, over: targetAt(p0.x, p0.y, d.id) || d.over }));
    }, 30);
    return () => clearInterval(t);
  }, [!!drag]);
  const onKey = (ev, row) => {
    const lane = lanes[row.rank];
    const i = lane.findIndex(x => x.id === row.id);
    const up = { secondary: "primary", tertiary: "secondary" }, down = { primary: "secondary", secondary: "tertiary" };
    if (ev.key === "ArrowLeft" && i > 0) { ev.preventDefault(); move(row.id, row.rank, i - 1); }
    else if (ev.key === "ArrowRight" && i < lane.length - 1) { ev.preventDefault(); move(row.id, row.rank, i + 1); }
    else if (ev.key === "ArrowUp" && up[row.rank]) { ev.preventDefault(); move(row.id, up[row.rank]); }
    else if (ev.key === "ArrowDown" && down[row.rank]) { ev.preventDefault(); move(row.id, down[row.rank], 0); }
  };

  const cardFor = (row, rank) => <GenericAttributeCard record={row.rec} def={def} themeKey="onyx" rank={row.rec.hidden ? "tertiary" : rank} editable onClick={() => onOpen(row.rec)} />;
  const indicator = (rank, index) => drag && drag.over && drag.over.rank === rank && drag.over.index === index
    ? <span className="ff-pe-drop" aria-hidden="true" key={`drop-${rank}-${index}`} /> : null;

  return (
    <div className={`ff-pe-row${drag ? " dragging" : ""}`} ref={scrollRef}>
      {TIER_KEYS.map(rank => {
        const lane = lanes[rank];
        const others = lane.filter(r => !drag || r.id !== drag.id).length;
        let j = 0;
        const target = drag && drag.over && drag.over.rank === rank;
        return (
          <div key={rank} className={`ff-pe-lane ${rank}${target ? " over" : ""}`} data-pe-lane={rank} data-pe-cat={catKey} aria-label={`${RANK_NAME[rank]} ${def.label.toLowerCase()}`}>
            <div className="ff-pe-lane-h"><span className={`dot ${rank}`} /><b>{RANK_NAME[rank]}</b></div>
            <div className="ff-pe-cards">
              {lane.map((row) => {
                const lifted = drag && drag.id === row.id;
                const at = lifted ? null : j++;
                return (
                  <React.Fragment key={row.id}>
                    {!lifted && indicator(rank, at)}
                    <div className={`ff-pe-card${lifted ? " lifted" : ""}`} data-pe-card={row.id}
                      onPointerDown={(ev) => onDown(ev, row)} onPointerMove={onMove}
                      onPointerUp={(ev) => finish(ev, false)} onPointerCancel={() => finish(null, true)}
                      onClickCapture={(ev) => { if (suppressClick.current) { ev.stopPropagation(); ev.preventDefault(); } }}
                      onContextMenu={(ev) => ev.preventDefault()}
                      onKeyDown={(ev) => onKey(ev, row)}
                      aria-roledescription="draggable card" title="Drag to place · tap to edit">
                      {cardFor(row, rank)}
                    </div>
                  </React.Fragment>
                );
              })}
              {indicator(rank, others)}
              {!lane.length && <div className="ff-pe-empty" aria-hidden="true">{drag ? "Drop here" : ""}</div>}
            </div>
          </div>
        );
      })}
      {tail && <div className="ff-pe-tail">{tail}</div>}
      {drag && (() => {
        const row = rows.find(r => r.id === drag.id);
        return row ? (
          <div className="ff-pe-ghost" style={{ left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.w }} aria-hidden="true">
            {cardFor(row, drag.over && drag.over.rank ? drag.over.rank : row.rank)}
          </div>
        ) : null;
      })()}
    </div>
  );
}



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
    dispatch({ type: "TOAST", toast: n ? `${n} card${n === 1 ? "" : "s"} added from ${from} — drag to place, tap to edit` : `Nothing new found in ${from}` });
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
