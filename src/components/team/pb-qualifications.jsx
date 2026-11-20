/* src/components/team/pb-qualifications.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json).
   pb-qualifications (Alex, 18 Nov 18:59): Qualifications stay in Attributes, as the left-hand card.
   - Builder: the card is typed onto directly (one line at the bottom of the card, up to QUAL_MAX_CHARS). An uploaded CV is
     an entry of its own ("CV", with a document mark). Tapping an entry opens its editor under the rail: details, up to
     4 pictures (record.media) and one document (record.document), the same per-entry upload the attribute editor
     already had. Empty cards show on the builder so people can type onto them.
   - Public profile: empty cards are never shown. The Qualifications card shows when it has at least one entry; the CV
     counts as one while SHOW_CV_PUBLIC is true, and visitors open it from the card (and from View all). Deleting the CV
     in the builder takes it off the public profile. Qualifications are not on the Profile Card.
   Back end: each entry is card-section data; see the "pb-qualifications" notes in frontend-export/ff-team-v1.1/CHANGELOG.md. */

const PBQ_CSS = __ff_css("styles/pb-qualifications.css");

/* The uploaded CV counts as a Qualification on the public profile, and anyone can open it there (Alex, 19:19) until the
   member deletes it in the builder. false: the CV stays on the builder only, and a profile whose only qualification is
   the CV shows no Qualifications card. */
const SHOW_CV_PUBLIC = true;

/* Qualifications are not on the Profile Card, so a name can be longer than the 16 characters card entries take. */
const QUAL_MAX_CHARS = 60;

/* Records the public profile may show (hidden, proposed and, with SHOW_CV_PUBLIC off, the CV are left out). */
const pubQualOk = (r) => !!r && !r.hidden && !r.proposed && (SHOW_CV_PUBLIC || !r.cv);
const qualHasDoc = (r) => !!(r && r.document && r.document.name);
const qualPhotos = (r) => ((r && r.media) || []).filter(m => m && (m.dataUrl || m.src)).length;

/* The small marks after an entry's name: a document, and the number of pictures. */
function QualMarks({ r }) {
  const n = qualPhotos(r);
  if (!qualHasDoc(r) && !n) return null;
  return (
    <span className="pbq-mk" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginLeft: 6, verticalAlign: -1, color: "var(--tc-acc, #8A6A1E)" }}>
      {qualHasDoc(r) && <FileText size={12} strokeWidth={2} aria-label="Document" />}
      {n > 0 && <span aria-label={`${n} picture${n === 1 ? "" : "s"}`}><Camera size={12} strokeWidth={2} aria-hidden="true" />{n > 1 ? n : ""}</span>}
    </span>
  );
}

/* The name with its marks held to the last word, so a mark never sits alone on a line. */
function QualNm({ r }) {
  const t = nbh21(String((r && r.name) || "").trim());
  if (!qualHasDoc(r) && !qualPhotos(r)) return t;
  const i = t.lastIndexOf(" ");
  return <>{i > 0 ? t.slice(0, i + 1) : ""}<span style={{ whiteSpace: "nowrap" }}>{i > 0 ? t.slice(i + 1) : t}<QualMarks r={r} /></span></>;
}

/* The one document of an entry (certificate, licence, CV). The CV's own file is replaced from the CV upload at the top. */
function EntryDocBox({ r, patch }) {
  const ref = useRef(null);
  const [msg, setMsg] = useState(null);
  const doc = qualHasDoc(r) ? r.document : null;
  const add = async (f) => {
    if (!f) return;
    setMsg("busy");
    try {
      const big = f.size > MAX_MEDIA_BYTES;
      const dataUrl = big ? null : await readFileAsDataUrl(f);
      patch({ document: { name: f.name, size: f.size, type: f.type || "application/pdf", dataUrl } });
      setMsg(big ? `That file is ${prettyBytes(f.size)} — keep it under ${prettyBytes(MAX_MEDIA_BYTES)} to open it here.` : null);
    } catch (e) { setMsg(e.message); }
  };
  return (
    <div className="pbq-doc">
      <style>{PBQ_CSS}</style>
      {doc ? (
        <div className="pbq-doc-row">
          <span className="ic" aria-hidden="true"><FileText size={17} strokeWidth={1.8} /></span>
          <span className="nm"><b>{doc.name}</b><small>{doc.size ? prettyBytes(doc.size) : "Document"}</small></span>
          {doc.dataUrl && <a className="pbq-doc-b" href={doc.dataUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${doc.name}`}><Eye size={16} strokeWidth={1.8} /></a>}
          {!r.cv && <button type="button" className="pbq-doc-b" aria-label={`Replace ${doc.name}`} onClick={() => ref.current && ref.current.click()}><Upload size={16} strokeWidth={1.8} /></button>}
          {!r.cv && <button type="button" className="pbq-doc-b" aria-label={`Remove ${doc.name}`} onClick={() => patch({ document: null })}><X size={16} strokeWidth={1.8} /></button>}
        </div>
      ) : (
        <button type="button" className="ff-rl19-ph add pbq-doc-add" aria-label="Add a document" disabled={msg === "busy"} onClick={() => ref.current && ref.current.click()}>
          {msg === "busy" ? <Loader2 size={18} className="ff-spin" /> : <FileText size={20} strokeWidth={1.7} />}
        </button>
      )}
      <input ref={ref} type="file" accept=".pdf,.doc,.docx,.txt,application/pdf" className="ff-sr" tabIndex={-1} aria-label="Add a document"
        onChange={(e) => { add(e.target.files && e.target.files[0]); e.target.value = ""; }} />
      {msg && msg !== "busy" && <p className="ff-wlbox-err" role="alert">{msg}</p>}
    </div>
  );
}

/* Builder: the Qualifications card in the Attributes rail, typed onto. */
function PE2QualCard({ records, openId, onOpen }) {
  const { state, dispatch } = useStore();
  const [typed, setTyped] = useState("");
  const [all, setAll] = useState(false);
  const def = BASE_CATEGORIES.qualifications;
  const rows = rankedRecords(records || []).filter(r => !r.proposed);
  const empty = !rows.length;
  const list = all ? rows : rows.slice(0, 5);
  const add = (e) => {
    e && e.preventDefault();
    const nm = typed.replace(/\s+/g, " ").trim().slice(0, QUAL_MAX_CHARS);
    if (!nm) return;
    if (rows.some(r => String(r.name).toLowerCase() === nm.toLowerCase())) { dispatch({ type: "TOAST", toast: `${nm} is already on your profile` }); return; }
    const taskId = xpTaskFor("qualifications");
    const fresh = XP_TASKS.some(t => t.id === taskId) && !(state.profile.xpClaimed || []).includes(taskId);
    dispatch({ type: "REC_ADD", category: "qualifications", record: makeRecord("qualifications", nm) });
    dispatch({ type: "TOAST", toast: `${def.singular} added${fresh ? xpNote(XP_VALUES.task) : ""}` });
    setTyped("");
  };
  return (
    <div role="listitem" className={"ff-agrp pbq-card " + (empty ? "pe2-agrp-empty" : "cat-qualifications " + tierCls17(0)) + (openId ? " pe2-agrp-on" : "")} aria-label={def.label}>
      <style>{PBQ_CSS}</style>
      <span className="ff-agrp-top"><span className="ff-agrp-h">{def.label}</span>{!empty && <span className="ff-agrp-n">{rows.length}</span>}</span>
      {!empty && (
        <span className="ff-agrp-l pbq-list">
          {list.map(r => (
            <button key={r.id} type="button" className={"pbq-it" + (openId === r.id ? " on" : "") + (r.hidden ? " hid" : "")} aria-expanded={openId === r.id} aria-controls="pbq-ed"
              aria-label={`${r.name}. Edit`} onClick={() => onOpen(openId === r.id ? null : r.id)}>
              <span className="nm"><QualNm r={r} /></span>
              {r.hidden && <EyeOff size={11} aria-label="Hidden" />}
            </button>
          ))}
        </span>
      )}
      {rows.length > 5 && <button type="button" className="ff-agrp-more pbq-more" aria-expanded={all} onClick={() => setAll(!all)}>{all ? "Fewer" : `+${rows.length - 5}`}</button>}
      <form className={"pbq-type" + (typed.trim() ? " has" : "")} onSubmit={add}>
        <input type="text" name="add-qualifications" value={typed} maxLength={QUAL_MAX_CHARS} autoComplete="off" spellCheck={false} enterKeyHint="enter"
          placeholder="Qualification" aria-label="Add a qualification" onChange={(e) => setTyped(e.target.value)} />
        <button type="submit" className="pbq-key" aria-label="Add a qualification" tabIndex={-1}><CornerDownLeft21 size={14} strokeWidth={2.2} aria-hidden="true" /></button>
      </form>
    </div>
  );
}

/* Builder: the open entry's editor, under the rail (no pop-up). */
function PE2QualEditor({ records, id, onDone }) {
  const r = (records || []).find(x => x.id === id);
  if (!r) return null;
  return (
    <div id="pbq-ed" className="ff-pa40-cat pe2-attr-ed pbq-ed" role="region" aria-label={r.name}>
      <style>{RANK_CSS17}</style>
      <div className="pe2-attr-edh">{BASE_CATEGORIES.qualifications.label}</div>
      <div className="pbq-ed-nm"><span><QualNm r={r} /></span></div>
      <EntryEditor21 r={r} catKey="qualifications" def={BASE_CATEGORIES.qualifications} onDone={onDone} />
    </div>
  );
}

/* The uploaded CV is kept as a Qualification entry (cv: true), the same record CVPanel makes; a new upload replaces it.
   Called by CVUpload17 (Let's get started), next to the FF AI read. */
async function pbqSaveCV(f, profile, dispatch) {
  if (!f) return;
  let dataUrl = null;
  try { dataUrl = f.size > MAX_MEDIA_BYTES ? null : await readFileAsDataUrl(f); } catch (e) { dataUrl = null; }
  const cv = makeRecord("qualifications", "CV", {
    cv: true, description: `Uploaded ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`,
    document: { name: f.name, size: f.size, type: f.type, dataUrl },
  });
  dispatch({ type: "REC_BULK", category: "qualifications", list: [cv, ...recsOf(profile, "qualifications").filter(r => !r.cv)] });
}

/* The CV's address for visitors (the prototype keeps the file as a data URL; the live site serves the stored file). */
const pubCvHref = (r) => (SHOW_CV_PUBLIC && r && r.cv && r.document && (r.document.url || r.document.dataUrl)) || "";

/* Public profile: the Qualifications card. The whole card opens View all, as every Attributes card does; the CV entry
   opens the CV itself. A cover button sits under the CV link, so no link is nested in a button. */
function PubQualCard({ label, part, more, total, cls, onOpen }) {
  return (
    <div className={"ff-agrp pbq-pub " + cls}>
      <style>{PBQ_CSS}</style>
      <button type="button" className="pbq-cover" onClick={onOpen} aria-label={`${label}: ${part.map(it => it.record.name).join(", ")}. View all attributes`} />
      <span className="ff-agrp-top"><span className="ff-agrp-h">{label}</span><span className="ff-agrp-n">{total}</span></span>
      <span className="ff-agrp-l">
        {part.map(it => {
          const href = pubCvHref(it.record);
          return <span key={it.id}>{href
            ? <a className="pbq-cvlink" href={href} target="_blank" rel="noopener noreferrer" download={(it.record.document && it.record.document.name) || "CV"} aria-label="Open CV"><QualNm r={it.record} /></a>
            : <QualNm r={it.record} />}</span>;
        })}
      </span>
      {more > 0 && <span className="ff-agrp-more">{`+${more}`}</span>}
    </div>
  );
}
