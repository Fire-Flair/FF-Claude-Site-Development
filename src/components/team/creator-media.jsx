/* src/components/team/creator-media.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---- 5. Creator: Media (the carousel's pictures) ------------------------- */
const MEDIA_MAX_ITEMS = 12;


function CreatorMedia() {
  const { state, dispatch } = useStore();
  const items = state.profile.media || [];
  const addRef = useRef(null);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const room = MEDIA_MAX_ITEMS - items.length;
  /* Prototype helper: three plain, clearly marked pictures so the carousel can
     be tried without uploading. The live site replaces this with real uploads. */
  const addSamples = () => {
    const mk = (a, b, label) => {
      const c = document.createElement("canvas"); c.width = 1600; c.height = 900;
      const g = c.getContext("2d"), grad = g.createLinearGradient(0, 0, 1600, 900);
      grad.addColorStop(0, a); grad.addColorStop(1, b); g.fillStyle = grad; g.fillRect(0, 0, 1600, 900);
      g.fillStyle = "rgba(255,255,255,.16)"; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(200 + i * 170, 450 + Math.sin(i) * 160, 90 + (i % 3) * 30, 0, 7); g.fill(); }
      g.fillStyle = "rgba(255,255,255,.85)"; g.font = "600 56px Inter, sans-serif"; g.textAlign = "center"; g.fillText(label, 800, 470);
      return c.toDataURL("image/jpeg", 0.82);
    };
    [["#2C3E66", "#5B7DB8", "Sample picture 1"], ["#6B2A3E", "#B05A7E", "Sample picture 2"], ["#2D5A44", "#5FA883", "Sample picture 3"]].slice(0, Math.max(0, room)).forEach(([a, b, l]) =>
      dispatch({ type: "MEDIA_ADD", item: { id: uid("med"), name: l, dataUrl: mk(a, b, l) } }));
  };
  const read = async (f) => {
    if (!f.type || !f.type.startsWith("image/")) throw new Error(`${f.name}: only pictures can go in the carousel.`);
    if (f.size > MAX_MEDIA_BYTES) throw new Error(`${f.name} is ${prettyBytes(f.size)} — keep it under ${prettyBytes(MAX_MEDIA_BYTES)}.`);
    return { id: uid("med"), name: f.name, dataUrl: await shrinkPhoto(f, 1600) };
  };
  const addMany = async (files) => {
    const list = [...files]; setErr("");
    if (!list.length) return;
    const take = list.slice(0, Math.max(0, room));
    if (list.length > take.length) setErr(`The carousel holds ${MEDIA_MAX_ITEMS} pictures — ${list.length - take.length} not added.`);
    for (const f of take) {
      setBusy(b => b + 1);
      try { dispatch({ type: "MEDIA_ADD", item: await read(f) }); }
      catch (e) { setErr(e.message || "That picture couldn't be added."); }
      setBusy(b => b - 1);
    }
  };
  /* v17.21: the Media box — golden like Phone number and FF Tag, always open (no drop-down), with a line on why it matters;
     square squircle pictures in a row that scrolls across, a "+" box at the end. */
  return (
    <GoldBox21 id="ff-sec-media-up" className="ff-cmedia ff-gb21-media" icon={<Camera size={16} strokeWidth={1.8} />} title="Media" count={items.length} desc={ACCT_DESC21.media} line={false}>
      <style>{RANK_CSS17}</style>
      <div className={`ff-m19${drag ? " drop" : ""}`}
        onDragOver={(e) => { if (e.dataTransfer && [...(e.dataTransfer.types || [])].includes("Files")) { e.preventDefault(); setDrag(true); } }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); if (e.dataTransfer && e.dataTransfer.files) addMany(e.dataTransfer.files); }}>
        {/* pfa (Alex 03:29): the first box is the profile photo — gold edge and a person mark, then a thin line before the rest. */}
        {items.map((m, i) => (<React.Fragment key={m.id}>
          <div className={"ff-m19-t" + (i === 0 ? " pfa-lead" : "")}>
            {i === 0 && <span className="pfa-mark" aria-hidden="true"><PcBust17 size={12} color="currentColor" /></span>}
            <img decoding="async" src={m.dataUrl} alt={`Media ${i + 1}${m.name ? `: ${m.name}` : ""}`} draggable={false} />
            <button type="button" className="b x" aria-label={`Remove media ${i + 1}`} onClick={() => dispatch({ type: "MEDIA_DELETE", id: m.id })}><X size={12} strokeWidth={2.4} /></button>
            <button type="button" className="b l" aria-label={`Move media ${i + 1} earlier`} disabled={i === 0} onClick={() => dispatch({ type: "P1_MEDIA_MOVE", id: m.id, dir: -1 })}><ChevronLeft size={13} /></button>
            <button type="button" className="b r" aria-label={`Move media ${i + 1} later`} disabled={i === items.length - 1} onClick={() => dispatch({ type: "P1_MEDIA_MOVE", id: m.id, dir: 1 })}><ChevronRight size={13} /></button>
          </div>
          {i === 0 && <span className="pfa-sep" aria-hidden="true" />}
        </React.Fragment>))}
        {Array.from({ length: busy }).map((_, i) => <div key={"b" + i} className="ff-m19-t busy" role="status" aria-label="Uploading"><Loader2 size={20} className="ff-spin" /></div>)}
        {room - busy > 0 && (
          <label className={"ff-m19-t add" + (items.length ? "" : " pfa-lead")}>
            {!items.length && <span className="pfa-mark" aria-hidden="true"><PcBust17 size={12} color="currentColor" /></span>}
            <input ref={addRef} type="file" accept="image/*" multiple className="ff-sr" aria-label={items.length ? "Add more pictures" : "Add pictures"} onChange={(e) => { addMany(e.target.files); e.target.value = ""; }} />
            <Plus size={22} strokeWidth={1.8} aria-hidden="true" />
          </label>
        )}
      </div>
      {err && <p className="ff-wlbox-err" role="alert" style={{ marginTop: 8 }}>{err}</p>}
    </GoldBox21>
  );
}



/* ---- 6. Creator: About Me (500), with optional FireFlair help ----------------- */
async function aboutAssist({ mode, note, current, facts }) {
  const sample = await getSample();
  if (!sample) { const e = new Error("unavailable"); e.code = "unavailable"; throw e; }
  const ask = async (m, cur) => {
    const input = `You help a hospitality professional write the "About Me" introduction on their public FireFlair profile.
Rules: first person, warm and professional, plain English, no emojis or hashtags. Use ONLY the facts in FACTS, the person's NOTE and CURRENT TEXT. Never invent qualifications, employers, years of experience, awards, numbers or credentials. At most ${BIO_MAX} characters including spaces; aim for ${BIO_MAX - 80} or fewer.
Task: ${m === "improve" ? "Improve and tidy CURRENT TEXT, keeping its meaning and facts." : m === "shorten" ? "Shorten CURRENT TEXT, keeping the key points." : "Write a new introduction."}
FACTS: ${JSON.stringify(facts)}
NOTE: ${note || "(none)"}
CURRENT TEXT: ${cur || "(none)"}
Return JSON only: {"intro": "<the introduction>"}`;
    let raw = await sample.json(input, {});
    if (typeof raw === "string") { try { raw = JSON.parse(raw); } catch (e) { raw = { intro: raw }; } }
    return String((raw && raw.intro) || "").trim().replace(/\s+/g, " ");
  };
  let text = await ask(mode, current);
  if (!text) { const e = new Error("empty"); e.code = "empty"; throw e; }
  if (text.length > BIO_MAX) { const t2 = await ask("shorten", text); if (t2) text = t2; }
  return { text, over: text.length > BIO_MAX };
}


function aboutFacts(state) {
  const p = state.profile, names = (cat, n) => withRanks(recsOf(p, cat).filter(r => !r.proposed && !r.hidden)).slice(0, n).map(e => e.r.name);
  const exp = withRanks(recsOf(p, "experience").filter(r => !r.proposed && !r.hidden)).slice(0, 4).map(e => [e.r.name, e.r.details && e.r.details.employer].filter(Boolean).join(" at "));
  return { firstName: String(p.name || "").split(" ")[0] || undefined, professions: names("professions", 5), skills: names("skills", 6), qualifications: names("qualifications", 5), experience: exp, languages: names("languages", 5), workLocations: covPlaces17(p).slice(0, 4).map(x => x.name), interests: names("interests", 4) };
}



/* v17.34: in the builder About Me sits above the tabs (top); the Overview tab's copy then steps aside, so it shows once. */
function CreatorAboutMe({ top = false } = {}) {
  if (useContext(ABOUT_TOP34) && !top) return null;
  return <CreatorAboutMe34 />;
}
function CreatorAboutMe34() {
  const { state, dispatch } = useStore();
  /* v17.21: no drop-down — About Me is a type box like the lists. */
  const aOpen = true;
  const saved = state.profile.about || "";
  const [text, setText] = useState(saved);
  const last = useRef(saved);
  const [ai, setAi] = useState(false);
  const [note, setNote] = useState("");
  const [st, setSt] = useState({ phase: "idle" });     // idle | busy | ready | error
  const [draft, setDraft] = useState("");
  useEffect(() => { if (saved !== last.current) { last.current = saved; setText(saved); } }, [saved]);
  const commit = (v) => { last.current = v; dispatch({ type: "PROFILE", patch: { about: v } }); };
  const n = text.length, full = n >= BIO_MAX, tooLong = n > BIO_MAX;
  const run = async (mode) => {
    setSt({ phase: "busy" });
    try {
      const r = await aboutAssist({ mode, note: note.trim(), current: mode === "write" ? "" : (mode === "shorten" && draft ? draft : text), facts: aboutFacts(state) });
      setDraft(r.text); setSt({ phase: "ready", over: r.over });
    } catch (e) {
      setSt({ phase: "error", msg: e && (e.code === "unavailable")
        ? "FireFlair isn't available in this view right now. Your introduction is still yours to write, and nothing has changed."
        : "FireFlair couldn't write that just now. Try again, or write it yourself." });
    }
  };
  const mode0 = text.trim() ? "improve" : "write";
  return (
    <section id="ff-sec-aboutme" className="ff-cabout" style={{ marginTop: 22 }} aria-label="About Me">
      <SectionHead icon={<User size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="About Me" />
      {aOpen && (<>
      <textarea id="ff-am" className="ff-input ff-am-ta" rows={4} value={text} aria-describedby="ff-am-count" aria-label="About Me"
        placeholder="Introduce yourself, describe your professional experience, and tell people what makes you stand out."
        onChange={(e) => { const v = e.target.value.replace(/^\s+/, "").slice(0, BIO_MAX); setText(v); commit(v); }}
        onBlur={() => { const v = text.trim(); if (v !== text) setText(v); if (v !== last.current) commit(v); }} />
      <div className="ff-am-foot">
        <span id="ff-am-count" className={`ff-bio-count${n >= BIO_MAX - 40 ? " near" : ""}`} aria-live="polite">
          {bioCount(n)}{full ? " — that's the limit" : ""}
        </span>
      </div>
      {tooLong && <p className="ff-wlbox-err" role="alert">Your saved introduction is over {BIO_MAX} characters. Shorten it to keep editing.</p>}
      <div className="ff-am-aibar">
      </div>
      {ai && (
        <FFAI compact title="About you" purpose={text.trim() ? "Tell me what to change, or just ask me to improve it." : "Tell me what to mention, or just ask me to write it."}
          placeholder="e.g. mention my event work and that I'm great under pressure" query={note} onQuery={setNote}
          onSubmit={() => run(mode0)} submitLabel={text.trim() ? "Improve" : "Write it"}
          note="FireFlair only uses what's on your profile and what you tell it, and never invents experience.">
          {st.phase === "busy" && <p className="ff-body ff-muted" role="status" style={{ fontSize: 12, margin: "8px 0 0", display: "flex", gap: 6, alignItems: "center" }}><Loader2 size={13} className="ff-spin" /> Writing…</p>}
          {st.phase === "error" && <p className="ff-body" role="alert" style={{ fontSize: 12.5, margin: "8px 0 0", color: "#7A1424" }}>{st.msg}</p>}
          {st.phase === "ready" && (
            <div className="ff-am-sugg">
              <label htmlFor="ff-am-draft" className="ff-label" style={{ fontSize: 10 }}>Suggestion — edit it if you like</label>
              <textarea id="ff-am-draft" className="ff-input" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
              <div className={`ff-bio-count${draft.length > BIO_MAX ? " near" : ""}`} aria-live="polite">{bioCount(draft.length)}{draft.length > BIO_MAX ? " — too long to apply" : ""}</div>
              <div className="ff-am-actions">
                <button type="button" className="ff-btn sm primary" disabled={!draft.trim() || draft.length > BIO_MAX}
                  onClick={() => { const v = draft.trim(); setText(v); commit(v); setSt({ phase: "idle" }); setDraft(""); setNote(""); dispatch({ type: "TOAST", toast: "Applied to About Me — it saves with your profile" }); }}><Check size={12} /> Apply</button>
                <button type="button" className="ff-btn sm" onClick={() => run("shorten")}>Make it shorter</button>
                <button type="button" className="ff-btn sm ghost" onClick={() => { setSt({ phase: "idle" }); setDraft(""); }}>Reject</button>
              </div>
            </div>
          )}
        </FFAI>
      )}
      </>)}
    </section>
  );
}





/* The Booking screen's sections are reached from Home through this one helper. */
function goBookingSection(dispatch, id) {
  dispatch({ type: "TAB", tab: "bookings", route: "home" });
  window.scrollTo(0, 0);
  let tries = 0;
  const go = () => { window.dispatchEvent(new CustomEvent("ff-opendrop", { detail: id })); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); else if (++tries < 20) setTimeout(go, 50); };
  setTimeout(go, 60);
}
