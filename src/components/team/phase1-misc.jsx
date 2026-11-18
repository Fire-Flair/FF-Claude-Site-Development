/* src/components/team/phase1-misc.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Team invitations you have sent to people already on FireFlair (TEAM_INVITE). The preview link shows what happens when
   they accept; in production that comes from Core. */
function SentInvitations() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const teams = (state.teamInvites || []).filter(i => i.status === "pending");
  if (!teams.length) return null;
  return (
    <section style={{ marginTop: 22 }}>
      <SectionHead icon={<Send size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Invitations you've sent" count={teams.length} />
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
                dispatch({ type: "TOAST", toast: `${first} accepted · now on your team` });
              }}>Preview: {first} accepts</button>
            </div>
          );
        })}
      </div>
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, margin: "8px 0 0" }}>{NETWORK_ADAPTER.note} The preview links show what happens when they act.</p>
    </section>
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
.ff .ff-chip .ff-langflag { height:13px; margin-right:4px; vertical-align:-2px; }
.ff .ff-chip-custom { border-style:dashed; border-color:var(--gold-dk); color:var(--ox,#5C1220); font-weight:600; }
.ff .ff-soonbadge { display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:999px; background:var(--onyx,#141416); color:#EAD79C; border:1px solid var(--gold-dk); font-size:12px; font-weight:700; letter-spacing:.14em; text-transform:uppercase; white-space:nowrap; }
.ff .ff-soonbadge.sm { padding:3px 8px; font-size:11px; letter-spacing:.12em; gap:4px; }
.ff .ff-sentlist { display:grid; gap:6px; }
.ff .ff-sentrow { display:flex; align-items:center; gap:10px; padding:9px 12px; border:1px solid var(--rule); border-radius:12px; background:#fff; flex-wrap:wrap; }
.ff .ff-sentrow b { display:block; font-size:14px; color:#1D1B18; }
.ff .ff-sentrow small { display:block; font-size:12px; color:#6A6253; }
.ff .ff-pill.ff-pillbtn { cursor:pointer; }

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
.ff .ff-medal.sm { width:46px; height:46px; box-shadow:0 0 0 3px #FFFDF8, 0 0 0 4px rgba(201,162,39,.45), 0 6px 12px rgba(74,13,24,.2); }

/* v1.8 What is FireFlair? / How FF Team works */
.ff .ff-wf18 { position:relative; isolation:isolate; overflow:hidden; text-align:center; border-radius:30px; padding:clamp(30px,6vw,56px) clamp(18px,5vw,48px) clamp(26px,5vw,44px); color:#F4EBD6;
  background:radial-gradient(90% 55% at 50% 0%,rgba(201,162,39,.17),transparent 62%),linear-gradient(180deg,#151417 0%,var(--ink,#0B0B0C) 100%);
  border:1px solid rgba(201,162,39,.38); box-shadow:0 26px 60px -26px rgba(0,0,0,.55); }
.ff .ff-wf18::before { content:""; position:absolute; inset:8px; z-index:-1; border-radius:23px; border:1px solid rgba(201,162,39,.2); pointer-events:none; }
.ff .ff-wf18-coin { display:flex; justify-content:center; margin-bottom:14px; filter:drop-shadow(0 6px 18px rgba(201,162,39,.35)); }
.ff .ff-wf18-eye { display:block; font-size:11px; font-weight:600; letter-spacing:.32em; text-transform:uppercase; color:rgba(234,215,156,.82); }
.ff .ff-wf18-eye .ai { color:#FFF4CC; text-shadow:0 0 10px rgba(246,226,161,.6); }
.ff .ff-wf18-h { margin:12px 0 0; font-family:var(--display); font-weight:600; font-size:clamp(28px,7.4vw,48px); line-height:1.1; letter-spacing:.02em; color:#F7EED8; text-wrap:balance; }
.ff .ff-orn { display:flex; align-items:center; justify-content:center; gap:12px; max-width:240px; margin:20px auto; color:var(--gold,#C9A227); font-size:11px; }
.ff .ff-orn i { flex:1; height:1px; background:linear-gradient(90deg,transparent,rgba(201,162,39,.75)); }
.ff .ff-orn i:last-child { background:linear-gradient(90deg,rgba(201,162,39,.75),transparent); }
.ff .ff-wf18-q { margin:26px auto 0; max-width:28ch; font-family:var(--serif); font-style: normal; font-size:clamp(21px,5.4vw,28px); line-height:1.3; color:#EAD79C; text-wrap:balance; }
@keyframes ffgold { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
.ff .ff-hw18-top { padding:clamp(26px,5vw,44px) clamp(16px,4vw,36px) clamp(14px,3vw,22px); text-align:center; }
.ff .ff-hw18-h { margin:10px 0 0; font-family:var(--display); font-weight:600; font-size:clamp(32px,8.6vw,54px); line-height:1.05; letter-spacing:.04em; color:#16130F; }

/* v1.9: shorter intro, visual FF Team steps, community verification, map box, previews */
.ff .ff-wf18 { padding:clamp(26px,5vw,44px) clamp(18px,5vw,40px) clamp(22px,4vw,32px); }
.ff .ff-wf18-h { font-size:clamp(26px,6.6vw,42px); }
.ff .ff-wf18 .ff-orn { margin:16px auto; }
.ff .ff-hw18-top { padding-bottom:clamp(12px,3vw,20px); }
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
.ff .ff-mb-vis .pins circle { fill:#F6E2A1; animation:ffpin 2.6s ease-in-out infinite; transform-box:fill-box; transform-origin:center; }
@keyframes ffpin { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.65; transform:scale(1.35); } }
.ff .ff-mb-foot { display:flex; align-items:center; justify-content:center; gap:6px; font-size:13px; font-style: normal; font-family:var(--serif); font-size:16px; color:#EAD79C; }
@media (prefers-reduced-motion: reduce) { .ff .ff-mb-vis .pins circle { animation:none; } }

/* ---- v1.1: the FF XP pop-up ----------------------------------------------- */
.ff .ff-xpsec { padding:16px 0; border-top:1px solid var(--rule); }
.ff .ff-xpsec:first-of-type { border-top:none; padding-top:0; }
`;
