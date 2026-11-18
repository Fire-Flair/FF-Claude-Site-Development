/* src/components/admin/admin-ui.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
function Search17({ value, onChange, placeholder }) {
  return <label className="ff-adm-q"><A17I.Search size={15} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} /></label>;
}


function AdmChips17({ value, onChange, options }) {
  return <div className="ff-adm-chips" role="group">{options.map(([k, l, n]) => <button key={k} type="button" aria-pressed={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{l}{n != null && <em>{n}</em>}</button>)}</div>;
}


function Empty17({ children }) { return <p className="ff-adm-empty">{children}</p>; }


function fdCopy(siteKey, node, ctx) {
  const r = fdCopyBase20(siteKey, node, ctx), o = ctx && ctx.ov;
  if (!o) return r;
  const out = { ...r };
  ["title", "h1", "desc"].forEach((k) => { if (o[k]) out[k] = o[k]; });
  if (o.intro) out.intro = String(o.intro).split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
  return out;
}
