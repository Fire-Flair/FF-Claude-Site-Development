/* src/components/team/profpick-preview.jsx — SCRATCH PREVIEW ONLY (branch p2/profpick, never merged).
   Design proposal pictures for Alex (18 Nov 2026, 01:10 brief):
   (A) three ways to "Pick your profession" — every category visible at once, Bar as a ranked ladder of five;
   (B) three ways the pencil editor looks on the public Overview (option 1 of the Aragorn report).
   Switched on only by localStorage.ffProfPick = "p1" | "p2" | "p3" | "e1" | "e2" | "e3";
   localStorage.ffProfPickOpen = "" | "about" | "profs" | "attrs" | "qa" picks the open editor.
   With the flag unset the site is unchanged. Reads and writes the same records as the real page. */

const PROFPICK_CSS = __ff_css("styles/profpick-preview.css");
const PPGrip = lucideIcon("GripVertical");

function profpickOpt() { try { return window.localStorage.getItem("ffProfPick") || ""; } catch (e) { return ""; } }
function profpickOpenKey() { try { return window.localStorage.getItem("ffProfPickOpen") || ""; } catch (e) { return ""; } }

/* The Bar ladder, entry to top (proposal: Barback 1 → Mixologist 5). */
const PP_LADDER = ["Barback", "Bartender", "Cocktail Bartender", "Flair Bartender", "Mixologist"];
/* A short line per category so people outside bars find themselves at a glance (a suggestion, not existing copy). */
const PP_LINE = {
  Bar: "From first shift to signature menus",
  "Front of House": "Hosts, waiters and sommeliers",
  Management: "Managers and planners",
  Entertainment: "DJs, musicians and performers",
  Services: "Photo, video and styling",
  Chefs: "Private, event and kitchen chefs",
  "Back of House": "Stock, kitchen and logistics",
  Other: "Your own profession",
};
const PP_CATS = PROFESSION_CATEGORIES.map(c => ({
  key: c.key, ranked: c.key === "Bar",
  list: c.key === "Bar" ? PP_LADDER : [...c.suggested].sort((a, b) => a.localeCompare(b)),
}));

/* The member's professions, their category, and add / remove. */
function usePPProfs() {
  const { state, dispatch } = useStore();
  const mine = rankedRecords(recsOf(state.profile, "professions")).filter(r => !r.hidden && !r.proposed);
  const find = (n) => mine.find(r => r.name.toLowerCase() === String(n).toLowerCase());
  const toggle = (n, category) => {
    const r = find(n);
    if (r) { dispatch({ type: "REC_DELETE", category: "professions", id: r.id }); return; }
    const approved = ALL_PROFESSIONS.some(p => p.name.toLowerCase() === n.toLowerCase());
    dispatch({ type: "RECORDS_MERGE", byCategory: { professions: [makeRecord("professions", n, { professionSource: approved ? "approved" : "user", ...(category ? { displayCategory: category } : {}) })] } });
  };
  const catOf = (r) => professionCategory(r.name, r.displayCategory) || "Other";
  /* typed professions (not on the FireFlair list) show inside their category, after the list */
  const ownIn = (key) => mine.filter(r => !ALL_PROFESSIONS.some(p => p.name.toLowerCase() === r.name.toLowerCase()) && catOf(r) === key);
  return { mine, has: (n) => !!find(n), toggle, catOf, ownIn, dispatch };
}

/* One profession as a squircle row or chip: plus when free, tick when yours. */
function PPItem({ name, on, onClick, kind = "row", step }) {
  return (
    <button type="button" className={`pp-${kind}${on ? " on" : ""}`} aria-pressed={on} onClick={onClick}>
      {step ? <span className="pp-step">{step}</span> : null}
      <span className="pp-nm">{name}</span>
      <span className="pp-mk" aria-hidden="true">{on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} strokeWidth={2.4} />}</span>
    </button>
  );
}

/* Search or type at the top; Enter adds the first match or the typed profession. */
function PPSearch({ q, setQ, onEnter }) {
  return (
    <label className="pp-q">
      <Search size={17} aria-hidden="true" />
      <input type="search" value={q} autoComplete="off" spellCheck={false} enterKeyHint="enter" placeholder="Search or type a profession"
        aria-label="Search or type a profession" onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onEnter(); } }} />
    </label>
  );
}

/* Your professions, in your order: the first is your headline and decides your Network category. */
function PPYours({ P }) {
  if (!P.mine.length) return null;
  return (
    <div className="pp-yours">
      <div className="pp-yours-h">Your professions</div>
      <div className="pp-yours-row" role="list">
        {P.mine.map((r, i) => (
          <span key={r.id} role="listitem" className={"pp-y" + (i === 0 ? " first" : i < 3 ? " card" : "")}>
            <span className="pp-y-n">{i === 0 ? <Star size={12} fill="currentColor" strokeWidth={0} /> : i + 1}</span>{nbh21(r.name)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* FireFlair's own question for a typed profession it can't place (kept from today's builder). */
function PPWhich({ P }) {
  const r = P.mine.find(x => !professionCategory(x.name, x.displayCategory));
  if (!r) return null;
  return (
    <div className="pp-which">
      <div className="pp-which-q"><Coin size={20} tier="gold" /><span>Which category is {"“"}{r.name}{"”"}?</span></div>
      <div className="pp-which-row">
        {PROFESSION_CATEGORIES.map(c => (
          <button key={c.key} type="button" className="pp-cat-b" onClick={() => P.dispatch({ type: "REC_PATCH", category: "professions", id: r.id, patch: { displayCategory: c.key } })}>{c.key}</button>
        ))}
      </div>
    </div>
  );
}

/* Shrink, never split: the longest word decides the size (Cinzel capitals are wide). */
const ppFit = (t, wide) => { const L = Math.max(...String(t).split(/\s+/).map(w => w.length)); return wide ? "15px" : L >= 13 ? "12px" : L >= 11 ? "13px" : "15px"; };
const ppMatch = (q) => { const n = q.trim().toLowerCase(); return (name) => !n || name.toLowerCase().includes(n); };

/* Small staircase mark for the Bar tile (option 2). */
function PPStairMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true">
      {[0, 1, 2, 3, 4].map(i => <rect key={i} x={1 + i * 5.8} y={24 - i * 5} width={4.6} height={5 + i * 5} rx={1.4} fill="currentColor" opacity={0.45 + i * 0.13} />)}
    </svg>
  );
}

/* ---------- (A) THE PICKER: three options ---------- */
function PPPicker({ opt, embedded }) {
  const P = usePPProfs();
  const [q, setQ] = useState("");
  const wide = typeof window !== "undefined" && window.innerWidth >= 900;
  const [open, setOpen] = useState(() => { try { return window.localStorage.getItem("ffProfPickCat") || ""; } catch (e) { return ""; } });
  const ok = ppMatch(q);
  const enter = () => {
    const n = q.trim(); if (!n) return;
    const hit = ALL_PROFESSIONS.find(p => p.name.toLowerCase().startsWith(n.toLowerCase()));
    P.toggle(hit ? hit.name : n.replace(/\s+/g, " ").replace(/\b\w/g, c => c.toUpperCase()));
    setQ("");
  };
  const cats = [...PP_CATS, ...(P.ownIn("Other").length ? [{ key: "Other", list: [] }] : [])];
  const items = (c) => [...c.list.filter(ok).map(n => ({ n, on: P.has(n) })), ...P.ownIn(c.key).filter(r => ok(r.name)).map(r => ({ n: r.name, on: true, own: true }))];
  const chosen = (c) => items(c).filter(x => x.on).length;

  const head = (
    <>
      {!embedded && <h2 className="pp-title">Pick your professions</h2>}
      <PPSearch q={q} setQ={setQ} onEnter={enter} />
      <PPYours P={P} />
      <PPWhich P={P} />
    </>
  );

  if (opt === "p1") return (
    <div className="pp-pick pp1">
      {head}
      <div className="pp1-grid">
        {cats.map(c => (
          <section key={c.key} className={"pp1-cat" + (c.ranked ? " ladder" : "")} aria-label={c.key}>
            <header className="pp1-h">
              <span className="pp-ic">{c.ranked ? <PPStairMark size={22} /> : <GroupIcon group={c.key} size={19} color="currentColor" />}</span>
              <h3>{c.key}</h3>
              {chosen(c) > 0 && <span className="pp-cnt"><Check size={11} strokeWidth={3} />{chosen(c)}</span>}
            </header>
            {c.ranked ? (
              <ol className="pp1-ladder">
                {[...c.list].map((n, i) => ({ n, i })).reverse().filter(x => ok(x.n)).map(({ n, i }) => (
                  <li key={n}><span className="pp1-rung" aria-hidden="true">{i + 1}</span><PPItem name={n} on={P.has(n)} onClick={() => P.toggle(n)} /></li>
                ))}
                {P.ownIn(c.key).filter(r => ok(r.name)).map(r => <li key={r.id} className="own"><span className="pp1-rung off" aria-hidden="true" /><PPItem name={r.name} on onClick={() => P.toggle(r.name)} /></li>)}
              </ol>
            ) : (
              <div className="pp1-list">{items(c).map(x => <PPItem key={x.n} name={x.n} on={x.on} onClick={() => P.toggle(x.n, c.key === "Other" ? undefined : c.key)} />)}</div>
            )}
          </section>
        ))}
      </div>
    </div>
  );

  if (opt === "p2") {
    const cols = wide ? 4 : 2;
    const tiles = cats;
    const openIdx = tiles.findIndex(c => c.key === open);
    const rowEnd = openIdx < 0 ? -1 : Math.min(tiles.length - 1, Math.floor(openIdx / cols) * cols + cols - 1);
    const panel = (c) => (
      <div key="panel" className={"pp2-panel" + (c.ranked ? " ladder" : "")} role="region" aria-label={c.key}>
        {c.ranked ? (
          <div className="pp2-stairs">
            {[...c.list].map((n, i) => ({ n, i })).reverse().filter(x => ok(x.n)).map(({ n, i }) => (
              <div key={n} className="pp2-stair" style={{ "--s": i }}><PPItem name={n} on={P.has(n)} onClick={() => P.toggle(n)} step={i + 1} /></div>
            ))}
            {P.ownIn(c.key).map(r => <div key={r.id} className="pp2-own"><PPItem kind="chip" name={r.name} on onClick={() => P.toggle(r.name)} /></div>)}
          </div>
        ) : (
          <div className="pp2-list">{items(c).map(x => <PPItem key={x.n} name={x.n} on={x.on} onClick={() => P.toggle(x.n, c.key)} />)}</div>
        )}
      </div>
    );
    return (
      <div className="pp-pick pp2">
        {head}
        <div className="pp2-grid" style={{ "--cols": cols }}>
          {tiles.map((c, i) => (
            <React.Fragment key={c.key}>
              <button type="button" className={"pp2-tile" + (c.key === open ? " on" : "") + (c.ranked ? " bar" : "")} aria-expanded={c.key === open} onClick={() => setOpen(c.key === open ? "" : c.key)}>
                <span className="pp2-ic">{c.ranked ? <PPStairMark size={30} /> : <GroupIcon group={c.key} size={28} color="currentColor" />}</span>
                <span className="pp2-nm" style={{ "--fs": ppFit(c.key, wide) }}>{c.key}</span>
                <span className="pp2-sub">{PP_LINE[c.key]}</span>
                {chosen(c) > 0 && <span className="pp-cnt"><Check size={11} strokeWidth={3} />{chosen(c)}</span>}
              </button>
              {i === rowEnd && panel(tiles[openIdx])}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  /* p3: one compact list — every category a heading with its professions as chips beneath */
  return (
    <div className="pp-pick pp3">
      {head}
      <div className="pp3-grid">
        {cats.map(c => (
          <section key={c.key} className={"pp3-cat" + (c.ranked ? " ladder" : "")} aria-label={c.key}>
            <h3 className="pp3-h"><span className="pp-ic sm">{c.ranked ? <PPStairMark size={18} /> : <GroupIcon group={c.key} size={16} color="currentColor" />}</span>{c.key}
              {chosen(c) > 0 && <span className="pp-cnt"><Check size={11} strokeWidth={3} />{chosen(c)}</span>}</h3>
            {c.ranked ? (
              <div className="pp3-steps" role="list">
                {c.list.map((n, i) => ok(n) && (
                  <div key={n} role="listitem" className="pp3-stepw" style={{ "--s": i }}>
                    <PPItem kind="chip" name={n} on={P.has(n)} onClick={() => P.toggle(n)} step={i + 1} />
                  </div>
                ))}
              </div>
            ) : null}
            {(!c.ranked || P.ownIn(c.key).length > 0) && (
              <div className="pp3-wrap">
                {(c.ranked ? P.ownIn(c.key).map(r => ({ n: r.name, on: true })) : items(c)).map(x => <PPItem key={x.n} kind="chip" name={x.n} on={x.on} onClick={() => P.toggle(x.n, c.key === "Other" ? undefined : c.key)} />)}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}

/* ---------- (B) THE OVERVIEW WITH PENCILS, and three editor options ---------- */
function PPPencil({ label, on, onClick }) {
  return (
    <button type="button" className={"pp-pen" + (on ? " on" : "")} aria-label={on ? `Done with ${label}` : `Edit ${label}`} aria-expanded={!!on} onClick={onClick}>
      {on ? <Check size={16} strokeWidth={2.6} aria-hidden="true" /> : <Pencil size={15} strokeWidth={2} aria-hidden="true" />}
    </button>
  );
}

function PPSec({ id, title, k, open, setOpen, opt, children, editor }) {
  const on = open === k;
  return (
    <section className={"ff-pp ff-pp21 pp-sec" + (on && opt === "e3" ? " pe3-on" : "")} aria-labelledby={`pp-h-${k}`} id={`pp-sec-${k}`}>
      <div className="ff-pp-head"><h2 id={`pp-h-${k}`} className="ff-about-h">{title}</h2><PPPencil label={title} on={on && opt === "e3"} onClick={() => setOpen(on ? "" : k)} /></div>
      {on && opt === "e3" ? <div className="pe3-body">{editor}</div> : children}
    </section>
  );
}

/* Editors — names only (no per-item details): About Me does the heavy lifting. */
function PPAboutEd() {
  const { state, dispatch } = useStore();
  return <textarea className="pp-ta" rows={7} value={state.profile.about || ""} aria-label="About Me" onChange={(e) => dispatch({ type: "PROFILE", patch: { about: e.target.value } })} />;
}

function PPAttrEd() {
  const { state, dispatch } = useStore();
  const keys = ["skills", "interests", "languages", "qualifications"].filter(k => BASE_CATEGORIES[k]);
  const [k, setK] = useState(keys[0]);
  const def = BASE_CATEGORIES[k];
  const rows = rankedRecords(recsOf(state.profile, k)).filter(r => !r.hidden && !r.proposed);
  return (
    <div className="pp-attr">
      <div className="pp-seg" role="tablist" aria-label="Attributes">
        {keys.map(x => {
          const n = recsOf(state.profile, x).filter(r => !r.hidden && !r.proposed).length;
          return <button key={x} type="button" role="tab" aria-selected={x === k} className={"pp-seg-b" + (x === k ? " on" : "")} onClick={() => setK(x)}>{BASE_CATEGORIES[x].label}<span className="n">{n}</span></button>;
        })}
      </div>
      <div className="pp-chips">
        {rows.map((r, i) => (
          <span key={r.id} className={"pp-chip" + (i < 3 ? " top" : "")}>
            <PPGrip size={14} className="grip" aria-hidden="true" />{nbh21(r.name)}
            <button type="button" className="rm" aria-label={`Remove ${r.name}`} onClick={() => dispatch({ type: "REC_DELETE", category: k, id: r.id })}><Trash2 size={13} /></button>
          </span>
        ))}
      </div>
      <TypeBox21 catKey={k} def={def} rows={rows} />
    </div>
  );
}

function PPProfEd({ opt }) {
  const P = usePPProfs();
  return (
    <div className="pp-profed">
      <div className="pp-rank" role="list">
        {P.mine.map((r, i) => (
          <div key={r.id} role="listitem" className={"pp-rank-r" + (i === 0 ? " first" : "")}>
            <PPGrip size={16} className="grip" aria-hidden="true" />
            <span className="pp-rank-n">{i === 0 ? <Star size={12} fill="currentColor" strokeWidth={0} /> : i + 1}</span>
            <span className="pp-rank-nm">{r.name}</span>
            <span className="pp-rank-c">{P.catOf(r)}</span>
            <button type="button" className="rm" aria-label={`Remove ${r.name}`} onClick={() => P.toggle(r.name)}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
      <PPPicker opt={opt} embedded />
    </div>
  );
}

const PP_QA = ["g_freelance", "g_notice", "g_events", "g_equipment", "g_travel"];
function PPQAList() {
  const { state } = useStore();
  const qs = PP_QA.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
  const ans = (q) => (state.profile.answers || {})[q.id];
  return (
    <div className="pp-qa">
      {qs.filter(q => ans(q)).map(q => (
        <div key={q.id} className="pp-qa-r"><span className="q">{q.text}</span><span className="a">{String(ans(q))}</span></div>
      ))}
    </div>
  );
}
function PPQAEd() {
  const { state, dispatch } = useStore();
  const qs = PP_QA.map(id => QUESTIONS.find(q => q.id === id)).filter(Boolean);
  const [own, setOwn] = useState("");
  const [yn, setYn] = useState("Yes");
  return (
    <div className="pp-qaed">
      {qs.map(q => {
        const v = (state.profile.answers || {})[q.id];
        return (
          <div key={q.id} className="pp-qaed-r">
            <div className="q">{q.text}</div>
            <div className="opts">{q.options.map(o => <button key={o} type="button" className={"pp-opt" + (v === o ? " on" : "")} aria-pressed={v === o} onClick={() => dispatch({ type: "ANSWER", qid: q.id, value: o })}>{o}</button>)}</div>
          </div>
        );
      })}
      <div className="pp-qaed-r own">
        <div className="opts">{["Yes", "No"].map(o => <button key={o} type="button" className={"pp-opt" + (yn === o ? " on" : "")} aria-pressed={yn === o} onClick={() => setYn(o)}>{o}</button>)}</div>
        <form className="ff-type21" onSubmit={(e) => { e.preventDefault(); setOwn(""); }}>
          <input type="text" value={own} placeholder="Type your own question" aria-label="Your own question" onChange={(e) => setOwn(e.target.value)} />
          <button type="submit" className="ff-type21-key" aria-label="Add question" tabIndex={-1}><span>Enter</span><CornerDownLeft21 size={15} strokeWidth={2.2} aria-hidden="true" /></button>
        </form>
      </div>
    </div>
  );
}

const PP_TITLES = { profs: "Professions", about: "About Me", attrs: "Attributes", qa: "Q&A" };

function PPEditorBody({ k, opt, pickOpt }) {
  if (k === "about") return <PPAboutEd />;
  if (k === "profs") return <PPProfEd opt={pickOpt} />;
  if (k === "attrs") return <PPAttrEd />;
  if (k === "qa") return <PPQAEd />;
  return null;
}

/* What visitors see for one section — used as the live preview in option 2. */
function PPPublicOf({ k, me, records, attrs }) {
  const { state } = useStore();
  const mem = useRef({});
  const profs = (records.professions || []).filter(r => !r.hidden && !r.proposed);
  if (k === "profs") return <ProfTiles21 items={profs} def={BASE_CATEGORIES.professions} onOpen={() => {}} />;
  if (k === "about") return <p className="pp-about">{state.profile.about}</p>;
  if (k === "attrs") return <AttrGroups items={attrs} mem={mem} onOpen={() => {}} />;
  if (k === "qa") return <PPQAList />;
  return null;
}

function ProfPickPreview() {
  const { state } = useStore();
  const opt = profpickOpt();
  const [open, setOpen] = useState(profpickOpenKey());
  const me = meAsStaff(state.profile, state.session);
  const records = recordsForPerson(state, me);
  const attrs = attributesOf(state, me, BASE_CATEGORIES).filter(it => it.category !== "locations" && it.category !== "venues");
  const mem = useRef({});
  const pickOpt = "p2";   /* the picker inside the Professions editor: the recommended option */
  if (/^p[123]$/.test(opt)) return (
    <div className="pp-root"><style>{PROFPICK_CSS}</style><style>{RANK_CSS17}</style><PPPicker opt={opt} /></div>
  );
  const profs = (records.professions || []).filter(r => !r.hidden && !r.proposed);
  const card = <PlayerCard person={{ ...me, group: "Your profile" }} format="full" nameAs="h1" themeKey={state.profile.theme} />;
  const tabs = [{ key: "overview", label: "Overview" }, { key: "services", label: "Bookings", count: 0 }, { key: "teams", label: "Team", count: 0 }, { key: "reviews", label: "Reviews", count: 0 }];
  const ed = (k) => <PPEditorBody k={k} opt={opt} pickOpt={pickOpt} />;
  const S = (k, children) => <PPSec k={k} title={PP_TITLES[k]} open={open} setOpen={setOpen} opt={opt} editor={ed(k)}>{children}</PPSec>;
  return (
    <div className="pp-root">
      <style>{PROFPICK_CSS}</style><style>{RANK_CSS17}</style>
      <div className="ff-pubpage ff-done17 team">
        <PublicHero media={mediaOf(state, me)} card={card} below={null} />
        <div className="ff-ptabs-wrap">
          <ProfileTabs tabs={tabs} active="overview" onChange={() => {}} />
          <div role="tabpanel" className="ff-tabpanel">
            {S("profs", <ProfTiles21 items={profs} def={BASE_CATEGORIES.professions} onOpen={() => {}} />)}
            {S("about", <p className="pp-about">{state.profile.about}</p>)}
            {S("attrs", <AttrGroups items={attrs} mem={mem} onOpen={() => {}} />)}
            <FireFlairIntroductions17 person={me} />
            {S("qa", <PPQAList />)}
          </div>
        </div>
      </div>

      {opt === "e1" && open && (
        <div className="pe1-scrim" onClick={() => setOpen("")}>
          <div className={"pe1-sheet" + (open === "profs" ? " wide" : "")} role="dialog" aria-modal="true" aria-label={PP_TITLES[open]} onClick={(e) => e.stopPropagation()}>
            <div className="pe1-grab" aria-hidden="true" />
            <h2 className="pe1-h">{PP_TITLES[open]}</h2>
            <div className="pe1-body">{ed(open)}</div>
            <div className="pe1-foot"><button type="button" className="pp-done" onClick={() => setOpen("")}><Check size={16} strokeWidth={2.6} /> Done</button></div>
          </div>
        </div>
      )}

      {opt === "e2" && open && (
        <div className="pe2-page" role="dialog" aria-modal="true" aria-label={PP_TITLES[open]}>
          <div className="pe2-bar">
            <button type="button" className="pe2-back" aria-label="Back" onClick={() => setOpen("")}><ChevronLeft size={22} /></button>
            <h2>{PP_TITLES[open]}</h2>
            <button type="button" className="pp-done sm" onClick={() => setOpen("")}>Save</button>
          </div>
          <div className={"pe2-cols" + (open === "profs" ? " profs" : "")}>
            <div className="pe2-live">
              <div className="pe2-live-h"><Eye size={14} aria-hidden="true" /> Visitors see</div>
              <div className="pe2-live-b"><PPPublicOf k={open} me={me} records={records} attrs={attrs} /></div>
            </div>
            <div className="pe2-ed">{ed(open)}</div>
          </div>
        </div>
      )}
    </div>
  );
}
