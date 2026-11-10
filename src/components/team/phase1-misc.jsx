/* src/components/team/phase1-misc.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
function InvitedByBanner({ person, onReview }) {
  const { dispatch } = useStore();
  if (!person) return null;
  const first = String(person.name || "").split(" ")[0];
  const view = () => { dispatch({ type: "VIEW", id: person.id }); window.scrollTo(0, 0); };
  return (
    <div className="ff-invitedby">
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <button type="button" onClick={view} aria-label={`Open ${person.name}'s profile`} style={{ flex: "none" }}>
          <Portrait src={person.photo} name={person.name} size={56} tier={person.tier} />
        </button>
        <div style={{ minWidth: 0 }}>
          <span className="ff-invited"><Star size={11} fill="currentColor" /> Invited you</span>
          <div className="ff-display" style={{ fontSize: 15, marginTop: 6 }}>{person.name}</div>
          <div className="ff-serif" style={{ fontSize: 13, color: "var(--gold-dk)", fontStyle: "normal" }}>{person.profession}</div>
        </div>
      </div>
      <p className="ff-body" style={{ margin: "12px 0 6px" }}>{person.name} invited you to FireFlair, so {first} is in your network automatically. You don't need to search for {first} or connect again.</p>
      <p className="ff-body ff-muted" style={{ fontSize: 12.5, margin: "0 0 10px" }}>Worked with {first}? Leave a review.</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <Btn variant="sm primary" onClick={onReview}><Award size={12} /> Review {first}</Btn>
        <Btn variant="sm" onClick={view}><Eye size={12} /> View profile</Btn>
      </div>
    </div>
  );
}



/* Invitations you've sent: people not on FireFlair yet (INVITE) and team
   invitations to people who are (TEAM_INVITE). The preview buttons show what
   happens when they act; in production that comes from Core. */
function SentInvitations() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const teams = (state.teamInvites || []).filter(i => i.status === "pending");
  const teamTags = new Set(teams.map(i => String(i.tag || "").toLowerCase()));
  /* Contacts invited from the contact list: not on FireFlair yet (they join),
     or on FireFlair but not in this demo directory (they accept). */
  const joins = (state.invitations || []).filter(c => !c.joined && !(c.tag && teamTags.has(String(c.tag).toLowerCase()))
    && !(state.connections || []).some(x => x.id === `inv_${c.id}` || (c.tag && x.tag === c.tag)));
  if (!joins.length && !teams.length) return null;
  const preview = (c) => {
    const id = `inv_${c.id}`;
    dispatch({ type: "INVITE_JOINED", person: staff({ id, name: c.name, tag: c.tag || (c.name.replace(/[^A-Za-z]/g, "").slice(0, 4) + "1").toUpperCase(), profession: c.note && !/worked|together/i.test(c.note) ? c.note : "Bartender", group: "Bartenders", tier: "standard", level: 1, years: 1, rating: null, reviews: 0, skills: [], interests: [], languages: ["English"], locations: [] }) });
    dispatch({ type: "TOAST", toast: c.onFF ? `${c.name.split(" ")[0]} accepted · now in your network` : `${c.name.split(" ")[0]} joined · added to your network automatically` });
  };
  return (
    <section style={{ marginTop: 22 }}>
      <SectionHead icon={<Send size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Invitations you've sent" count={joins.length + teams.length} />
      <div className="ff-sentlist">
        {teams.map(i => {
          const p = directory.find(x => x.id === i.personId);
          const first = String(i.name || "").split(" ")[0];
          return (
            <div key={i.id} className="ff-sentrow">
              <Portrait src={p && p.photo} name={i.name} size={34} tier={p && p.tier} />
              <span style={{ flex: 1, minWidth: 0 }}><b>{i.name}</b><small>Team invitation · waiting for {first} to accept</small></span>
              <button type="button" className="ff-linkbtn" onClick={() => {
                dispatch({ type: "TEAM_INVITE_ACCEPT", id: i.id });
                if (i.workedBefore && (i.review || i.rating)) dispatch({ type: "REVIEW_ADD", review: { id: uid("rev"), aboutId: i.personId, byId: "me", shiftId: null, byName: state.profile.name || "You", rating: i.rating || 5, text: i.review || `${i.howTo} to work with.`, at: Date.now() } });
                dispatch({ type: "TOAST", toast: `${first} accepted · now in your network` });
              }}>Preview: {first} accepts</button>
            </div>
          );
        })}
        {joins.map(c => (
          <div key={c.id} className="ff-sentrow">
            <Portrait name={c.name} size={34} ring="#B9B1A2" />
            <span style={{ flex: 1, minWidth: 0 }}><b>{c.name}</b><small>{c.onFF ? `On FireFlair · waiting for ${c.name.split(" ")[0]} to accept` : "Invited on WhatsApp · not on FireFlair yet"}</small></span>
            <button type="button" className="ff-linkbtn" onClick={() => preview(c)}>Preview: {c.name.split(" ")[0]} {c.onFF ? "accepts" : "joins"}</button>
          </div>
        ))}
      </div>
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "8px 0 0" }}>{NETWORK_ADAPTER.note} The preview links show what happens when they act.</p>
    </section>
  );
}



/* A small note under prototype-only actions, so a mock is never mistaken for
   a live connection. */
function ProtoNote({ children }) {
  return <p className="ff-protonote"><Lock size={10} /> {children || NETWORK_ADAPTER.note}</p>;
}



/* --- Phase 1 footer ------------------------------------------------------ */
function Phase1Footer() {
  return (
    <footer className="ff-p1foot">
      <Coin size={22} tier="gold" />
      <span><b>{PHASE1.name}</b> · v{PHASE1.version} · {PHASE1.status.toLowerCase()}. Anything marked Coming 2027 isn't live yet. Sign-up codes, saving and FireFlair run inside this preview; notes for developers are on GitHub.</span>
    </footer>
  );
}



/* --- Legacy Word (.doc) CVs ------------------------------------------------
   Neither the prototype nor the backend could read .doc (Word 97–2003)
   files before: the backend's documentReader takes PDF, .docx, text and
   images. This reads the text straight out of the file: the OLE compound
   file, then the WordDocument stream's piece table (FIB → CLX → PlcPcd).
   Encrypted files and Word 6/95 files are refused with a clear message. */
function cfbStreams(buf) {
  const v = new DataView(buf), u8 = new Uint8Array(buf);
  const sig = [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1];
  if (u8.length < 512 || sig.some((b, i) => u8[i] !== b)) throw cvxError("unreadable", "This doesn't look like a Word (.doc) file. Upload a PDF or .docx instead.");
  const secSize = 1 << v.getUint16(0x1E, true), miniSize = 1 << v.getUint16(0x20, true);
  const dirStart = v.getInt32(0x30, true), miniCutoff = v.getUint32(0x38, true);
  const miniFatStart = v.getInt32(0x3C, true), difatStart = v.getInt32(0x44, true);
  const off = (s) => (s + 1) * secSize;
  const fatSecs = [];
  for (let i = 0; i < 109; i++) { const s = v.getInt32(0x4C + i * 4, true); if (s >= 0) fatSecs.push(s); }
  for (let d = difatStart, guard = 0; d >= 0 && guard < 4096; guard++) {
    const per = secSize / 4 - 1;
    for (let i = 0; i < per; i++) { const s = v.getInt32(off(d) + i * 4, true); if (s >= 0) fatSecs.push(s); }
    d = v.getInt32(off(d) + per * 4, true);
  }
  const fat = [];
  fatSecs.forEach(s => { for (let i = 0; i < secSize / 4; i++) fat.push(v.getInt32(off(s) + i * 4, true)); });
  const chain = (start, table) => { const out = []; for (let s = start, g = 0; s >= 0 && g < table.length + 1; g++) { out.push(s); s = table[s]; } return out; };
  const readChain = (start, size) => {
    const out = new Uint8Array(size); let pos = 0;
    for (const s of chain(start, fat)) { const n = Math.min(secSize, size - pos); if (n <= 0) break; out.set(u8.subarray(off(s), off(s) + n), pos); pos += n; }
    return out;
  };
  /* Directory */
  const dirBytes = (() => { const secs = chain(dirStart, fat); const out = new Uint8Array(secs.length * secSize); secs.forEach((s, i) => out.set(u8.subarray(off(s), off(s) + secSize), i * secSize)); return out; })();
  const dv = new DataView(dirBytes.buffer);
  const entries = [];
  for (let p = 0; p + 128 <= dirBytes.length; p += 128) {
    const nlen = dv.getUint16(p + 0x40, true);
    const name = String.fromCharCode(...new Uint16Array(dirBytes.buffer.slice(p, p + Math.max(0, nlen - 2))));
    entries.push({ name, type: dirBytes[p + 0x42], start: dv.getInt32(p + 0x74, true), size: dv.getUint32(p + 0x78, true) });
  }
  const root = entries[0];
  const miniFat = miniFatStart >= 0 ? (() => { const b = readChain(miniFatStart, chain(miniFatStart, fat).length * secSize); const d2 = new DataView(b.buffer); const t = []; for (let i = 0; i < b.length / 4; i++) t.push(d2.getInt32(i * 4, true)); return t; })() : [];
  const miniStream = root && root.start >= 0 ? readChain(root.start, root.size) : new Uint8Array(0);
  const get = (name) => {
    const e = entries.find(x => x.type === 2 && x.name === name);
    if (!e) return null;
    if (e.size < miniCutoff) {
      const out = new Uint8Array(e.size); let pos = 0;
      for (const s of chain(e.start, miniFat)) { const n = Math.min(miniSize, e.size - pos); if (n <= 0) break; out.set(miniStream.subarray(s * miniSize, s * miniSize + n), pos); pos += n; }
      return out;
    }
    return readChain(e.start, e.size);
  };
  return { get };
}


const CP1252_HI = { 0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178 };


function docText(buf) {
  const cfb = cfbStreams(buf);
  const wd = cfb.get("WordDocument");
  if (!wd) throw cvxError("unreadable", "This file has no Word document inside. Upload a PDF or .docx instead.");
  const w = new DataView(wd.buffer, wd.byteOffset, wd.byteLength);
  if (w.getUint16(0, true) !== 0xA5EC) throw cvxError("unreadable", "This Word file is too old to read here (Word 6/95). Save it as .docx or PDF and upload that.");
  const flags = w.getUint16(0x0A, true);
  if (flags & 0x0100) throw cvxError("unreadable", "This Word file is password-protected. Remove the password, or upload a PDF.");
  const table = cfb.get(flags & 0x0200 ? "1Table" : "0Table");
  if (!table) throw cvxError("unreadable", "This Word file couldn't be read. Save it as .docx or PDF and upload that.");
  const csw = w.getUint16(32, true);
  const cslwAt = 34 + csw * 2, cslw = w.getUint16(cslwAt, true);
  const fcAt = cslwAt + 2 + cslw * 4 + 2;
  const fcClx = w.getUint32(fcAt + 33 * 8, true), lcbClx = w.getUint32(fcAt + 33 * 8 + 4, true);
  const t = new DataView(table.buffer, table.byteOffset, table.byteLength);
  let p = fcClx;
  while (p < fcClx + lcbClx && table[p] === 0x01) p += 3 + t.getUint16(p + 1, true);   // skip Prc
  if (table[p] !== 0x02) throw cvxError("unreadable", "This Word file couldn't be read. Save it as .docx or PDF and upload that.");
  const lcb = t.getUint32(p + 1, true), plc = p + 5, n = (lcb - 4) / 12;
  let text = "";
  for (let i = 0; i < n; i++) {
    const cp0 = t.getUint32(plc + i * 4, true), cp1 = t.getUint32(plc + (i + 1) * 4, true);
    const fcRaw = t.getUint32(plc + (n + 1) * 4 + i * 8 + 2, true);
    const compressed = (fcRaw & 0x40000000) !== 0, fc = fcRaw & 0x3FFFFFFF, count = cp1 - cp0;
    if (compressed) {
      const start = fc / 2;
      for (let k = 0; k < count && start + k < wd.length; k++) { const b = wd[start + k]; text += String.fromCharCode(CP1252_HI[b] || b); }
    } else {
      for (let k = 0; k < count && fc + k * 2 + 1 < wd.length; k++) text += String.fromCharCode(w.getUint16(fc + k * 2, true));
    }
  }
  /* Table rows end with a second cell mark: make that a line break. */
  text = text.replace(/\x07\x07/g, "\x07\r");
  /* Fields: keep the result, drop the instruction. Then tidy control marks. */
  let out = "", hide = [];
  for (const ch of text) {
    const c = ch.charCodeAt(0);
    if (c === 0x13) { hide.push(true); continue; }
    if (c === 0x14) { if (hide.length) hide[hide.length - 1] = false; continue; }
    if (c === 0x15) { hide.pop(); continue; }
    if (hide.some(Boolean)) continue;
    out += c === 0x0D || c === 0x0B || c === 0x0C ? "\n" : c === 0x07 ? "\t" : c === 0x09 || c === 0x0A || c >= 0x20 ? ch : "";
  }
  return out.replace(/\t+\n/g, "\n").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
}


async function readDoc(file, onStage) {
  onStage && onStage("Opening your Word file…");
  const text = docText(await file.arrayBuffer());
  if (text.replace(/\s/g, "").length < 20) throw cvxError("unreadable", "No text was found in this Word file. Save it as PDF and upload that.");
  const doc = newDoc("doc", file);
  doc.pageTexts = [text];
  doc.pageCount = doc.pagesRead = 1;
  return doc;
}



/* --- Phase 1 styles (added to the prototype's CSS) ------------------------ */
const P1_CSS = P12_CSS + `
.ff .ff-langflag { display:inline-block; height:.95em; width:auto; vertical-align:-.12em; margin-right:.12em; }
.ff .ff-pc-flag .ff-langflag { height:1.05em; margin:0; vertical-align:middle; }
.ff .ff-chip .ff-langflag { height:13px; margin-right:4px; vertical-align:-2px; }
.ff .ff-chip-custom { border-style:dashed; border-color:var(--gold-dk); color:var(--ox,#5C1220); font-weight:600; }
.ff .ff-chipcat { margin-left:6px; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--gold-dk); opacity:.85; }
.ff .ff-wlguide { margin:4px 0 14px; padding:14px 16px; border-radius:14px; background:linear-gradient(170deg,#FFFDF7,#F7EFDC); border:1px solid rgba(176,141,42,.45); }
.ff .ff-wlguide-h { display:flex; gap:8px; align-items:center; font-weight:700; font-size:15px; color:#2A2116; margin-bottom:6px; }
.ff .ff-wlguide p { margin:0 0 8px; font-size:13.5px; line-height:1.5; color:#3A3226; }
.ff .ff-wlguide-meter { display:flex; align-items:center; gap:5px; margin:10px 0 6px; flex-wrap:wrap; }
.ff .ff-wlguide-meter i { width:22px; height:6px; border-radius:3px; background:rgba(126,97,29,.18); display:block; }
.ff .ff-wlguide-meter i.on { background:linear-gradient(90deg,var(--gold-mid,#B08D2A),#E8C75E); }
.ff .ff-wlguide-meter span { margin-left:6px; font-size:12px; font-weight:600; color:var(--gold-dk); }
.ff .ff-wlguide-small { font-size:12px !important; color:#6A6253 !important; margin:0 !important; }
.ff .ff-wlsugg { margin:-4px 0 4px; }
.ff .ff-wllist { display:grid; gap:6px; }
.ff .ff-wlrow { display:flex; align-items:center; gap:8px; padding:7px 8px 7px 12px; border:1px solid var(--rule); border-radius:12px; background:#fff; }
.ff .ff-wlrow .nm { flex:1; min-width:0; font-size:14.5px; font-weight:600; color:#1D1B18; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.ff .ff-wlrow.hidden { opacity:.6; border-style:dashed; }
.ff .ff-wlrow .ff-input { flex:1; padding:6px 10px; }
.ff .ff-soonbadge { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; background:var(--onyx,#141416); color:#EAD79C; border:1px solid var(--gold-dk); font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; white-space:nowrap; }
.ff .ff-soonbadge.sm { padding:3px 8px; font-size:11px; letter-spacing:.12em; gap:4px; }
.ff .ff-invitedby { margin-top:18px; padding:14px 16px; border-radius:16px; background:#FFF8E8; border:1px solid rgba(176,141,42,.45); }
.ff .ff-invitedby .ff-invited { align-self:flex-start; }
.ff .ff-nettile { display:flex; flex-direction:column; align-items:center; gap:6px; }
.ff .ff-sentlist { display:grid; gap:6px; }
.ff .ff-sentrow { display:flex; align-items:center; gap:10px; padding:9px 12px; border:1px solid var(--rule); border-radius:12px; background:#fff; flex-wrap:wrap; }
.ff .ff-sentrow b { display:block; font-size:14px; color:#1D1B18; }
.ff .ff-sentrow small { display:block; font-size:12px; color:#6A6253; }
.ff .ff-protonote { display:flex; gap:6px; align-items:center; justify-content:center; margin:10px 0 0; font-size:12px; color:#6A6253; text-align:center; }
.ff .ff-p1foot { display:flex; gap:10px; align-items:center; max-width:760px; margin:40px auto 0; padding:14px 0 0; border-top:1px solid var(--rule); font-size:12px; line-height:1.45; color:#6A6253; }
.ff .ff-p1foot b { color:#3A3226; }
.ff .ff-pill.ff-pillbtn { cursor:pointer; }

/* ---- v1.1: Coming Soon cards ------------------------------------------- */
.ff .ff-soonpanel { border-radius:26px; padding:clamp(14px,3.5vw,22px); background:#F6F0E2; border:1px solid rgba(126,97,29,.16); }
.ff .ff-soonpanel-lede { margin:0 0 12px; font-size:14px; line-height:1.5; color:#3A3226; }
/* at most three columns, and every column filled */
.ff .ff-soongrid { display:grid; gap:10px; grid-template-columns:repeat(auto-fit,minmax(max(min(100%,230px),calc((100% - 20px) / 3)),1fr)); }
.ff .ff-soon { display:flex; gap:12px; align-items:flex-start; padding:14px 15px; border-radius:18px; background:#fff; border:1px solid rgba(126,97,29,.16); box-shadow:var(--lift-1); min-width:0; }
.ff .ff-soon.next { border-color:rgba(176,141,42,.55); box-shadow:0 0 0 1px rgba(201,162,39,.25), var(--lift-1); }
.ff .ff-soon-ic { position:relative; flex:none; width:40px; height:40px; border-radius:12px; display:grid; place-items:center; background:#F7F1E3; color:var(--gold-dk); border:1px solid rgba(126,97,29,.16); }
.ff .ff-soon-ic i { position:absolute; right:-5px; bottom:-5px; width:17px; height:17px; border-radius:50%; display:grid; place-items:center; background:#2A2622; color:#EAD79C; border:2px solid #fff; }
.ff .ff-soon b { display:block; font-size:15px; font-weight:700; line-height:1.3; color:#1D1B18; }
.ff .ff-soon p { margin:4px 0 0; font-size:13px; line-height:1.45; color:#5A5246; }
.ff .ff-soon-badge { display:inline-flex; align-items:center; gap:5px; margin-top:9px; font-size:11px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:#8A7442; }
.ff .ff-soon.next .ff-soon-badge { color:var(--ox,#5C1220); }

/* ---- v1.1: wallet passes, locked ----------------------------------------- */
.ff .ff-walletsoon { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,200px),1fr)); gap:10px; width:100%; }
.ff .ff-wsoon { display:flex; align-items:center; gap:10px; padding:11px 13px; border-radius:14px; background:#fff; border:1px solid rgba(126,97,29,.16); min-width:0; text-align:left; }
.ff .ff-wsoon .mk { flex:none; display:flex; filter:grayscale(.35); opacity:.8; }
.ff .ff-wsoon .tx { flex:1; min-width:0; line-height:1.15; }
.ff .ff-wsoon .tx small { display:block; font-size:11px; color:#6A6253; }
.ff .ff-wsoon .tx b { display:block; font-size:14px; font-weight:700; color:#1D1B18; }
.ff .ff-wsoon .ff-soon-badge { margin-top:0; }
.ff .ff-welcome-acts .ff-walletsoon { margin-top:2px; }

/* ---- v1.1: Save & Share line and the card preview ------------------------ */
.ff .ff-s5row::before { bottom:calc(50% + 23px); }
.ff .ff-finale:not(.open) .ff-s5row::after { content:''; position:absolute; left:-30px; top:calc(50% + 23px); bottom:0; width:2px; border-radius:2px;
  background:linear-gradient(180deg, rgba(176,141,42,.6), rgba(176,141,42,.45)); }
.ff .ff-s5mark .stem, .ff .ff-s5mark .ff-vdashes { display:none; }
.ff .ff-finale:not(.open) { padding-bottom:8px; }
.ff .ff-cardpreview-wrap { position:relative; padding-top:18px; padding-bottom:40px; }
.ff .ff-cardpreview-wrap::before { content:''; position:absolute; left:-30px; top:0; bottom:0; width:2px; border-radius:2px;
  background:linear-gradient(180deg, rgba(176,141,42,.45), rgba(176,141,42,.25) 60%, rgba(176,141,42,0)); }
@media (max-width:520px) { .ff .ff-finale:not(.open) .ff-s5row::after, .ff .ff-cardpreview-wrap::before { left:-19px; } }
.ff .ff-cardpreview { display:flex; flex-direction:column; align-items:center; gap:16px; padding:clamp(18px,4vw,28px); border-radius:26px; background:#F6F0E2; border:1px solid rgba(126,97,29,.16); text-align:center; }
.ff .ff-cardghost { position:relative; width:150px; max-width:100%; aspect-ratio:5 / 7; border-radius:18px; border:1.5px dashed rgba(126,97,29,.4); background:linear-gradient(170deg,#FFFDF8,#F3EAD5); display:flex; flex-direction:column; align-items:center; padding:30px 18px 0; gap:8px; }
.ff .ff-cardghost .coin { position:absolute; top:9px; right:9px; opacity:.85; }
.ff .ff-cardghost .av { width:52px; height:52px; border-radius:50%; background:rgba(126,97,29,.12); border:1.5px solid rgba(176,141,42,.35); margin-bottom:6px; }
.ff .ff-cardghost span[class^="l"] { display:block; height:6px; border-radius:3px; background:rgba(126,97,29,.14); }
.ff .ff-cardghost .l1 { width:70%; height:8px; } .ff .ff-cardghost .l2 { width:50%; } .ff .ff-cardghost .l3 { width:84%; margin-top:8px; } .ff .ff-cardghost .l4 { width:84%; }
.ff .ff-cardpreview-tx b { display:block; font-family:var(--display); font-size:18px; letter-spacing:.04em; color:#1D1B18; text-wrap:balance; }
.ff .ff-cardpreview-tx p { margin:6px auto 0; max-width:420px; font-size:13.5px; line-height:1.5; color:#5A5246; }

/* ---- v1.1: What is FireFlair? -------------------------------------------- */
.ff .ff-wif { border-radius:30px; overflow:hidden; background:#FFFDF8; border:1px solid rgba(126,97,29,.2); box-shadow:var(--lift-2); }
.ff .ff-wif-top { padding:clamp(24px,5vw,40px) clamp(16px,4vw,36px) clamp(10px,3vw,20px); text-align:center; }
.ff .ff-wif-h { margin:0; font-family:var(--display); font-weight:600; font-size:clamp(30px,8vw,46px); line-height:1.08; letter-spacing:.01em; color:#16130F; text-wrap:balance; }
.ff .ff-wif-sub { margin:8px auto 0; max-width:560px; font-family:var(--serif); font-style: normal; font-size:clamp(17px,4.4vw,20px); line-height:1.4; color:#4A443A; }
.ff .ff-wif-label { display:block; margin:24px 0 10px; font-size:11px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--gold-dk); }
.ff .ff-wif-label.dark { margin:0 0 8px; color:#D9BE68; }
.ff .ff-wif-steps { list-style:none; margin:0; padding:0; display:grid; text-align:left; }
.ff .ff-wif-step { display:flex; gap:14px; align-items:center; padding:14px 2px; border-top:1px solid rgba(126,97,29,.14); }
.ff .ff-wif-step .n { display:block; font-size:11px; letter-spacing:.2em; text-transform:uppercase; font-weight:700; color:var(--gold-dk); margin-bottom:3px; }
.ff .ff-wif-step b { display:block; font-family:var(--display); font-weight:600; font-size:15px; letter-spacing:.05em; color:#16130F; }
.ff .ff-wif-step .t { display:block; margin-top:3px; font-size:13.5px; line-height:1.45; color:#3A3226; }
@media (min-width:700px) {
  .ff .ff-wif-steps { grid-template-columns:repeat(3,minmax(0,1fr)); gap:0; }
  .ff .ff-wif-step { flex-direction:column; text-align:center; align-items:center; padding:18px 18px 22px; border-top:none; }
  .ff .ff-wif-step + .ff-wif-step { border-left:1px solid rgba(126,97,29,.14); }
}
.ff .ff-medal.sm { width:46px; height:46px; box-shadow:0 0 0 3px #FFFDF8, 0 0 0 4px rgba(201,162,39,.45), 0 6px 12px rgba(74,13,24,.2); }
.ff .ff-wif-book { display:grid; gap:20px; align-items:center; padding:clamp(22px,5vw,36px) clamp(16px,4vw,36px); background:linear-gradient(170deg,#1C1A18,#0B0A09); color:#F4EBD6; }
@media (min-width:760px) { .ff .ff-wif-book { grid-template-columns:minmax(0,1fr) auto; gap:32px; } }
.ff .ff-wif-bh { margin:0; font-family:var(--display); font-weight:600; font-size:clamp(23px,5.6vw,30px); line-height:1.15; color:#F7EED8; text-wrap:balance; }
.ff .ff-wif-booktx p { margin:12px 0 0; font-size:15px; line-height:1.6; color:rgba(244,235,214,.86); max-width:62ch; }
.ff .ff-wif-party { display:flex; gap:12px; align-items:flex-start; margin-top:14px; padding:12px 14px; border-radius:14px; background:rgba(255,255,255,.05); border:1px solid rgba(234,215,156,.2); }
.ff .ff-wif-party p { margin:0; }
.ff .ff-wif-party b { color:#F2D88C; }
.ff .ff-wif-card { display:flex; flex-direction:column; align-items:center; gap:8px; justify-self:center; }
/* v1.8 What is FireFlair? / How FF Team works */
.ff .ff-wf18 { position:relative; isolation:isolate; overflow:hidden; text-align:center; border-radius:30px; padding:clamp(30px,6vw,56px) clamp(18px,5vw,48px) clamp(26px,5vw,44px); color:#F4EBD6;
  background:radial-gradient(90% 55% at 50% 0%,rgba(201,162,39,.17),transparent 62%),linear-gradient(180deg,#151417 0%,var(--ink,#0B0B0C) 100%);
  border:1px solid rgba(201,162,39,.38); box-shadow:0 26px 60px -26px rgba(0,0,0,.55); }
.ff .ff-wf18::before { content:""; position:absolute; inset:8px; z-index:-1; border-radius:23px; border:1px solid rgba(201,162,39,.2); pointer-events:none; }
.ff .ff-wf18-coin { display:flex; justify-content:center; margin-bottom:14px; filter:drop-shadow(0 6px 18px rgba(201,162,39,.35)); }
.ff .ff-wf18-eye, .ff .ff-hw18-eye { display:block; font-size:11px; font-weight:600; letter-spacing:.32em; text-transform:uppercase; color:rgba(234,215,156,.82); }
.ff .ff-wf18-eye .ai { color:#FFF4CC; text-shadow:0 0 10px rgba(246,226,161,.6); }
.ff .ff-wf18-h { margin:12px 0 0; font-family:var(--display); font-weight:600; font-size:clamp(28px,7.4vw,48px); line-height:1.1; letter-spacing:.02em; color:#F7EED8; text-wrap:balance; }
.ff .ff-orn { display:flex; align-items:center; justify-content:center; gap:12px; max-width:240px; margin:20px auto; color:var(--gold,#C9A227); font-size:11px; }
.ff .ff-orn i { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(201,162,39,.75)); }
.ff .ff-orn i:last-child { background:linear-gradient(90deg,rgba(201,162,39,.75),transparent); }
.ff .ff-wf18-name { display:grid; grid-template-columns:1fr 1fr; max-width:560px; margin:0 auto; }
.ff .ff-wf18-name > div { padding:2px 10px; }
.ff .ff-wf18-name > div + div { border-left:1px solid rgba(201,162,39,.32); }
.ff .ff-wf18-name b, .ff .ff-hw18-steps .n { font-family:var(--display); font-weight:600; background:linear-gradient(100deg,var(--gold-mid,#B08D2A) 0%,#F6E2A1 42%,var(--gold,#C9A227) 58%,#8C6B1F 100%); background-size:220% 100%;
  -webkit-background-clip:text; background-clip:text; color:transparent; animation:ffgold 8s ease-in-out infinite; }
.ff .ff-wf18-name b { display:block; font-size:clamp(22px,6vw,34px); letter-spacing:.28em; padding-left:.28em; line-height:1.15; }
.ff .ff-wf18-name em { display:block; margin-top:4px; font-family:var(--serif); font-style: normal; font-size:clamp(19px,4.6vw,24px); color:#F7EED8; }
.ff .ff-wf18-name small { display:block; margin-top:2px; font-size:12.5px; line-height:1.4; color:rgba(244,235,214,.62); }
.ff .ff-wf18-q { margin:26px auto 0; max-width:28ch; font-family:var(--serif); font-style: normal; font-size:clamp(21px,5.4vw,28px); line-height:1.3; color:#EAD79C; text-wrap:balance; }
.ff .ff-wf18-vals { list-style:none; margin:26px auto 0; padding:20px 0 0; max-width:640px; border-top:1px solid rgba(201,162,39,.22); display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; }
.ff .ff-wf18-vals li { display:flex; flex-direction:column; gap:6px; }
.ff .ff-wf18-vals b { font-family:var(--display); font-size:12px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:#E4C36A; }
.ff .ff-wf18-vals span { font-size:12.5px; line-height:1.4; color:rgba(244,235,214,.78); }
.ff .ff-wf18-m { margin:24px 0 0; font-size:11px; letter-spacing:.26em; text-transform:uppercase; color:rgba(244,235,214,.48); }
@keyframes ffgold { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
.ff .ff-hw18-top { padding:clamp(26px,5vw,44px) clamp(16px,4vw,36px) clamp(14px,3vw,22px); text-align:center; }
.ff .ff-hw18-eye { color:var(--gold-dk); }
.ff .ff-hw18-h { margin:10px 0 0; font-family:var(--display); font-weight:600; font-size:clamp(32px,8.6vw,54px); line-height:1.05; letter-spacing:.04em; color:#16130F; }
.ff .ff-hw18-sub { margin:8px 0 0; font-family:var(--serif); font-style: normal; font-size:clamp(18px,4.6vw,21px); color:#4A443A; }
.ff .ff-hw18-steps { list-style:none; margin:22px 0 0; padding:0; display:grid; text-align:left; }
.ff .ff-hw18-steps li { display:flex; gap:16px; align-items:flex-start; padding:16px 2px; border-top:1px solid rgba(126,97,29,.14); }
.ff .ff-hw18-steps .n { flex:none; width:44px; font-size:24px; line-height:1.1; text-align:center; background-image:linear-gradient(100deg,#7E611D 0%,#C9A227 45%,#E4C36A 55%,#7E611D 100%); }
.ff .ff-hw18-steps b { display:block; font-family:var(--display); font-weight:600; font-size:16px; letter-spacing:.16em; text-transform:uppercase; color:#16130F; }
.ff .ff-hw18-steps li > div > span { display:block; margin-top:4px; font-size:14px; line-height:1.5; color:#3A3226; }
@media (min-width:760px) {
  .ff .ff-hw18-steps { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .ff .ff-hw18-steps li { flex-direction:column; align-items:center; text-align:center; padding:18px 20px 22px; border-top:none; }
  .ff .ff-hw18-steps li + li { border-left:1px solid rgba(126,97,29,.14); }
}
.ff .ff-hw18-src { display:grid; gap:8px; margin-top:16px; }
.ff .ff-hw18-src > div { display:flex; gap:12px; align-items:baseline; padding:12px 14px; border-radius:14px; background:rgba(255,255,255,.04); border:1px solid rgba(234,215,156,.18); }
.ff .ff-hw18-src b { flex:none; min-width:74px; font-family:var(--display); font-weight:600; font-size:12.5px; letter-spacing:.12em; color:#F2D88C; }
.ff .ff-hw18-src span { font-size:14px; line-height:1.45; color:rgba(244,235,214,.86); }
.ff .ff-hw18-q { margin:16px 0 0; font-family:var(--serif); font-style: normal; font-size:clamp(17px,4.2vw,20px); color:#EAD79C; }
@media (prefers-reduced-motion: reduce) { .ff .ff-wf18-name b, .ff .ff-hw18-steps .n { animation:none; } }

/* v1.9: shorter intro, visual FF Team steps, community verification, map box, previews */
.ff .ff-wf18 { padding:clamp(26px,5vw,44px) clamp(18px,5vw,40px) clamp(22px,4vw,32px); }
.ff .ff-wf18-h { font-size:clamp(26px,6.6vw,42px); }
.ff .ff-wf18 .ff-orn { margin:16px auto; }
.ff .ff-wf18-vals { display:flex; align-items:center; justify-content:center; gap:12px; flex-wrap:wrap; margin:0; padding:0; border:0; max-width:none; }
.ff .ff-wf18-vals b { font-family:var(--display); font-size:12px; font-weight:600; letter-spacing:.22em; text-transform:uppercase; color:#E4C36A; }
.ff .ff-wf18-vals span { color:var(--gold,#C9A227); font-size:11px; }
.ff #ff-what .ff-who17 { margin-top:16px; }
.ff .ff-profadd { border-style:dashed !important; background:transparent !important; cursor:pointer; display:inline-flex; align-items:center; gap:4px; }
.ff .ff-cardpick { text-align:left; margin:0 -4px 4px; }
.ff .ff-cardpick .ff-goldpick { margin-top:4px !important; padding:12px !important; }
.ff .ff-cardpick-done { display:block; margin:8px auto 2px; }
.ff .ff-hw18-top { padding-bottom:clamp(12px,3vw,20px); }
.ff .ff-hw18-steps { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:4px; margin:22px 0 0; text-align:center; }
.ff .ff-hw18-steps li { position:relative; display:flex; flex-direction:column; align-items:center; gap:4px; padding:0 4px; border:0 !important; }
.ff .ff-hw18-steps li + li { border:0 !important; }
.ff .ff-hw18-steps .ff-medal { width:58px; height:58px; display:grid; place-items:center; }
.ff .ff-hw18-steps b { margin-top:8px; font-size:15px; letter-spacing:.2em; text-transform:uppercase; }
.ff .ff-hw18-steps li > span { margin:0; font-size:13px; line-height:1.35; color:#4A443A; }
.ff .ff-hw18-steps .arr { position:absolute; top:20px; right:-10px; color:var(--gold-dk); display:grid; place-items:center; opacity:.8; }
.ff .ff-hw18-flow { display:flex; align-items:flex-start; justify-content:center; gap:12px; margin-top:20px; }
.ff .ff-hw18-flow .src { display:flex; flex-direction:column; align-items:center; gap:6px; min-width:0; text-align:center; }
.ff .ff-hw18-flow .src b { font-family:var(--display); font-weight:600; font-size:12.5px; letter-spacing:.1em; color:#F2D88C; }
.ff .ff-hw18-flow .src small { margin-top:-4px; font-size:12px; color:rgba(244,235,214,.68); }
.ff .ff-hw18-flow .ar { margin-top:19px; color:#E4C36A; display:grid; place-items:center; }
.ff .ff-cv18-box { text-align:center; padding:clamp(24px,5vw,36px) clamp(16px,4vw,32px); border-radius:28px; color:#F4EBD6; border:1px solid rgba(201,162,39,.4);
  background:radial-gradient(90% 60% at 50% 0%,rgba(201,162,39,.14),transparent 62%),linear-gradient(180deg,#171618,var(--ink,#0B0B0C)); box-shadow:0 20px 44px -22px rgba(0,0,0,.5); }
.ff .ff-cv18-eye { display:block; font-size:11px; font-weight:600; letter-spacing:.3em; text-transform:uppercase; color:rgba(234,215,156,.82); }
.ff .ff-cv18-h { margin:10px auto 0; max-width:20ch; font-family:var(--display); font-weight:600; font-size:clamp(22px,5.6vw,32px); line-height:1.15; color:#F7EED8; text-wrap:balance; }
.ff .ff-cv18-vis { margin:22px auto 0; display:grid; gap:14px; justify-items:center; }
.ff .ff-cv18-vis .ppl { display:flex; }
.ff .ff-cv18-vis .ppl span + span { margin-left:-12px; }
.ff .ff-cv18-vis .ppl span { display:inline-flex; filter:drop-shadow(0 4px 10px rgba(0,0,0,.45)); }
.ff .ff-cv18-vis .rec { display:inline-flex; align-items:center; gap:6px; padding:5px 12px; border-radius:99px; font-size:12px; letter-spacing:.14em; text-transform:uppercase; font-weight:600; color:#E4C36A; border:1px solid rgba(201,162,39,.45); background:rgba(201,162,39,.08); }
.ff .ff-cv18-vis .lvl { display:flex; align-items:center; justify-content:center; gap:clamp(8px,3vw,20px); }
.ff .ff-cv18-vis .lvl > div { display:flex; flex-direction:column; align-items:center; gap:4px; }
.ff .ff-cv18-vis .lvl small { font-size:12px; letter-spacing:.12em; text-transform:uppercase; color:rgba(244,235,214,.7); }
.ff .ff-cv18-vis .lvl i { color:var(--gold,#C9A227); margin-bottom:16px; display:grid; }
.ff .ff-cv18-t { margin:18px auto 16px; max-width:34ch; font-size:14px; line-height:1.5; color:rgba(244,235,214,.82); }
.ff .ff-mapbox { padding-top:22px; padding-bottom:6px; }
.ff .ff-mapbox-btn { display:flex; flex-direction:column; align-items:stretch; gap:16px; max-width:640px; padding:clamp(18px,4vw,26px); border-radius:26px; }
.ff .ff-mb-head { display:flex; flex-direction:column; gap:6px; text-align:center; }
.ff .ff-mapbox-btn .ff-mb-head b { font-family:var(--display); font-weight:600; font-size:clamp(20px,5.2vw,26px); letter-spacing:.02em; color:#F7EED8; }
.ff .ff-mapbox-btn .ff-mb-head small { font-size:13.5px; line-height:1.45; color:rgba(244,235,214,.78); }
.ff .ff-mb-vis { display:grid; grid-template-columns:1fr 1fr; gap:14px; align-items:end; }
.ff .ff-mb-vis > span { display:flex; flex-direction:column; align-items:center; gap:8px; padding:14px 10px 10px; border-radius:18px; background:rgba(255,255,255,.035); border:1px solid rgba(201,162,39,.25); }
.ff .ff-mb-vis svg { width:100%; max-width:150px; height:auto; display:block; }
.ff .ff-mb-vis .uk svg { max-height:190px; }
.ff .ff-mb-vis em { font-style:normal; font-size:11px; letter-spacing:.16em; text-transform:uppercase; font-weight:600; color:#E4C36A; text-align:center; }
.ff .ff-mb-vis .land { fill:rgba(201,162,39,.14); stroke:var(--gold,#C9A227); stroke-width:1.4; stroke-linejoin:round; }
.ff .ff-mb-vis .pin { fill:#F6E2A1; stroke:rgba(201,162,39,.6); stroke-width:1.5; animation:ffpin 2.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
.ff .ff-mb-vis .pins circle { fill:#F6E2A1; animation:ffpin 2.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
@keyframes ffpin { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.65; transform:scale(1.35); } }
.ff .ff-mb-foot { display:flex; align-items:center; justify-content:center; gap:6px; font-size:13px; font-style: normal; font-family:var(--serif); font-size:16px; color:#EAD79C; }
@media (prefers-reduced-motion: reduce) { .ff .ff-mb-vis .pin, .ff .ff-mb-vis .pins circle { animation:none; } }
.ff .ff-pv-ck .cc { width:112px; }
.ff .ff-pv-ck .cc img { display:block; width:100%; height:auto; border-radius:9px; box-shadow:0 8px 18px rgba(0,0,0,.5); }
.ff .ff-pv-wl .pair { position:absolute; left:0; right:0; top:16px; display:flex; justify-content:center; align-items:flex-start; }
.ff .ff-pv-wl .pair .phone { position:relative; left:auto; top:auto; margin:0; width:96px; height:188px; border-radius:20px; flex:none; }
.ff .ff-pv-wl .pair .phone.l { transform:rotate(-5deg); } .ff .ff-pv-wl .pair .phone.r { transform:rotate(5deg); }
.ff .ff-pv-wl .pair .phone .scr { top:18px; transform:scale(.37); }
.ff .ff-pv-wl .pair .share { align-self:center; z-index:3; margin:0 -9px; width:40px; height:40px; border-radius:50%; display:grid; place-items:center; color:#1A1408;
  background:linear-gradient(180deg,#F6E2A1,var(--gold,#C9A227)); box-shadow:0 6px 16px rgba(0,0,0,.5),0 0 0 3px rgba(8,5,5,.55); }
.ff .ff-wif-card .cap { font-size:12px; letter-spacing:.06em; color:rgba(244,235,214,.6); }
.ff .ff-p1jump { margin-top:16px; }
.ff .ff-p1jump button { background:#fff; border-color:rgba(126,97,29,.28); color:#2A1F08; font-weight:600; }
.ff .ff-p1jump button:hover { background:#FFFDF6; border-color:var(--gold-dk); }

/* ---- v1.1: the FF XP pop-up ----------------------------------------------- */
.ff .ff-xpsec { padding:16px 0; border-top:1px solid var(--rule); }
.ff .ff-xpsec:first-of-type { border-top:none; padding-top:0; }
.ff .ff-xptier { display:flex; gap:14px; align-items:center; padding:14px; border-radius:16px; background:#FFFDF8; border:1px solid rgba(126,97,29,.2); }
.ff .ff-xplevels { display:grid; gap:6px; margin-top:10px; }
.ff .ff-xplevel { display:flex; gap:10px; align-items:center; padding:9px 11px; border-radius:12px; border:1px solid rgba(126,97,29,.14); background:#fff; opacity:.72; }
.ff .ff-xplevel.on { opacity:1; }
.ff .ff-xplevel b { display:block; font-size:13px; font-weight:700; color:#1D1B18; }
.ff .ff-xplevel small { display:block; font-size:12px; color:#6A6253; }
.ff .ff-xphow { margin:0 0 14px; padding-left:18px; display:grid; gap:8px; }
.ff .ff-xphow li { font-size:13.5px; line-height:1.5; color:#2E2A24; }

/* ---- v1.1: Bookings --------------------------------------------------------- */
.ff .ff-bkpart { margin-top:26px; }
.ff .ff-bkgroup-h { margin:34px 0 0; padding-top:18px; border-top:1px solid var(--rule); }
.ff .ff-bkgroup-h .ff-h2 { margin-top:4px; font-size:20px; }

`;
