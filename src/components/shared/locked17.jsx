/* src/components/shared/locked17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* Phase 2: FF Party is display only. Every FF Party action that would start a booking or the host profile uses this one
   locked control: the same look as the button it replaces, dimmed, with a small lock, not clickable, no shine. */
const LOCKED_LABEL17 = "Coming soon";

const isPartySite17 = (state) => !!state && state.role === "staff" && state.site === "party";

/* Tabs and routes of FF Party that are not available in Phase 2 (Book and Party). */
const PARTY_LOCKED_TABS17 = ["bookings", "profile"];

const PARTY_LOCKED_ROUTES17 = ["cocktails", "eventNew", "eventPage", "shiftNew", "shiftSend", "companyEdit"];

function lockedName17(children, label) {
  const t = label || (typeof children === "string" ? children : "");
  return (t ? t + ". " : "") + LOCKED_LABEL17;
}

function LockedBtn17({ children, label, variant, className, style, shine, icon, bare }) {
  const cls = [bare ? "" : "ff-btn", variant || "", className || "", shine ? "ff-shine" : "", "ff-locked17"].filter(Boolean).join(" ");
  return (
    <button type="button" className={cls} style={style} aria-disabled="true" aria-label={lockedName17(children, label)} title={LOCKED_LABEL17}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
      {icon}<Lock size={11} className="ff-locked17-ic" aria-hidden="true" /> <span className="lab">{children}</span>
    </button>
  );
}
