/* src/adapters/cv-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — CV_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   provider  (value)
   async available()
   async extract(doc, { signal, onProgress } = {})
   Nothing outside this file talks to a backend: the rest of the app calls CV_ADAPTER only. */
const CV_ADAPTER = {
  provider: "Claude, through this page's FireFlair connection",
  async available() { return !!(await getSample()); },

  /* doc (from CV_READER) -> validated extraction:
     { name, summary, photo, unreadable[], items[], rejected[], calls[], sent } */
  async extract(doc, { signal, onProgress } = {}) {
    const sample = await getSample();
    if (!sample) throw cvxError("unavailable", "FireFlair isn't available in this view.");
    const lim = await sample.limits().catch(() => null);
    const imgCap = lim && lim.images;
    const isCV = doc.kind !== "text";
    const noText = !String(doc.text || "").replace(/\s/g, "").length;
    if (noText && !(imgCap && doc.pageImages.length)) {
      throw cvxError("unreadable", doc.pageImages.length
        ? "This CV is a picture (a scan or photo) and FireFlair can't see pictures here. Upload a PDF or Word version with selectable text."
        : "No text could be found in this document.");
    }
    /* Pictures: pages first (layout, scans, photo), then candidates. */
    const types = (imgCap && imgCap.mediaTypes) || [];
    const fits = (b) => b && (!types.length || types.includes(b.type)) && (!imgCap.maxInputBytes || b.size <= imgCap.maxInputBytes);
    let pagePics = [], cands = [];
    if (imgCap) {
      const max = Math.max(0, imgCap.maxCount || 0);
      cands = doc.candidates.filter(c => fits(c.blob)).slice(0, Math.min(CVX.MAX_CANDIDATES, Math.max(0, max - 1)));
      pagePics = doc.pageImages.filter(p => fits(p.blob)).slice(0, Math.max(0, max - cands.length));
    }
    const needPics = doc.scannedPages.length > 0;
    const parts = isCV ? ["history", "profile"] : ["all"];
    const tier = isCV ? CVX.MODEL_TIER.cv : CVX.MODEL_TIER.text;
    const seen = {};
    const sent = { pagePictures: pagePics.length, candidates: cands.length, textBytes: 0, truncated: false, parts: parts.length };

    const call = async (part, usePics) => {
      const cats = part === "all" ? [...CVX_PARTS.profile, ...CVX_PARTS.history] : CVX_PARTS[part];
      const withHeader = part !== "profile";
      const pp = usePics ? pagePics : [];
      const cc = usePics && withHeader ? cands : [];
      const shell = cvPrompt({ cats, doc, withHeader, pagePics: pp, candidates: cc, docText: "", truncatedNote: "" });
      const dt = promptDocText(doc, CVX.PROMPT_BYTES - utf8Bytes(shell) - 400);
      if (dt.truncated) sent.truncated = true;
      sent.textBytes = Math.max(sent.textBytes, utf8Bytes(dt.text));
      const input = cvPrompt({ cats, doc, withHeader, pagePics: pp, candidates: cc, docText: dt.text,
        truncatedNote: dt.truncated ? "The document was too long to include in full; its end is missing. List what is there and say so in unreadable." : "" });
      const images = [...pp.map(p => p.blob), ...cc.map(c => c.blob)];
      const t0 = performance.now();
      try {
        const raw = await sample.json(input, {
          modelTier: tier, signal, ...(images.length ? { images } : {}),
          onText: ({ text }) => {
            seen[part] = (String(text).match(/"category"\s*:/g) || []).length;
            onProgress && onProgress(Object.values(seen).reduce((a, b) => a + b, 0));
          },
        });
        return { part, ok: true, ms: Math.round(performance.now() - t0), raw, pictures: images.length, candidates: cc };
      } catch (e) {
        const code = (e && e.code) || "upstream_error";
        /* One text-only retry when a picture is refused — a different request, never a loop. */
        if (code === "image_rejected" && images.length && !noText) {
          const r = await call(part, false);
          return { ...r, note: "Pictures were refused, so FireFlair read the text only." };
        }
        return { part, ok: false, ms: Math.round(performance.now() - t0), code, partial: e && e.text };
      }
    };

    const calls = await Promise.all(parts.map(p => call(p, !!imgCap && (p !== "profile" || needPics))));
    if (calls.some(c => !c.ok && c.code === "cancelled")) throw cvxError("cancelled", "Stopped.");
    const gone = calls.find(c => !c.ok && CVX_UNAVAILABLE.includes(c.code));
    if (gone && !calls.some(c => c.ok)) throw cvxError("unavailable", "FireFlair isn't available in this view.", { cause: gone.code });
    if (!calls.some(c => c.ok)) throw cvxError(calls[0].code, cvxCopy(calls[0].code), { calls });

    const out = { name: "", summary: "", photo: null, unreadable: [], items: [], rejected: [], calls: [], sent, photoFrom: null };
    for (const c of calls) {
      if (!c.ok) { out.calls.push({ part: c.part, ok: false, ms: c.ms, code: c.code }); continue; }
      const v = validateExtraction(c.raw);
      out.items.push(...v.items);
      out.rejected.push(...v.rejected.map(r => ({ ...r, part: c.part })));
      if (c.part !== "profile") {
        out.name = v.name; out.summary = v.summary; out.unreadable = v.unreadable;
        out.photo = v.photo; out.photoFrom = c.candidates;
      }
      out.calls.push({ part: c.part, ok: true, ms: c.ms, items: v.items.length, rejected: v.rejected.length, pictures: c.pictures, note: c.note });
    }
    return out;
  },
};
