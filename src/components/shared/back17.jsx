/* src/components/shared/back17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The Back button of a detail screen, in the style used on profiles and company pages.
   One step back when the app has history, otherwise `fallback` (the parent list or the home page). */
function BackBtn17({ fallback, label }) {
  return (
    <button type="button" className="ff-pback ff-copub-back" onClick={() => rt17Back(fallback)}>
      <I11.ChevronLeft size={20} /> <span>{label || "Back"}</span>
    </button>
  );
}
