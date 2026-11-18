/* src/components/staff/company-builder17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* ---- Contact: pick a kind, type the value in one box ----------------------- */
function CoKindIcon17({ kind, size = 17 }) {
  const k = coKindOf17(kind);
  if (k.soc) return <SocialIcon11 k={k.soc} size={size} />;
  const Ic = k.kind === "Email" ? I11.Mail : k.kind === "Phone" ? I11.Phone : I11.Globe;
  return <Ic size={size} />;
}
