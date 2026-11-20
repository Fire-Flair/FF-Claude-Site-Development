/* src/components/team/team-router.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* The FF Team router: which page the tab shows (moved out of components/vip/vip-site.jsx in v1.1). */
/* v1.115 (Alex 19 Nov 22:44): on desktop a profile (person or company) opens as a dimmed, wide, centred card over the Network page,
   which stays mounted behind it, so Back and the X return to the same place, category and pill. Phone and iPad keep the full page. */
function ffPopMq() { return typeof matchMedia !== "undefined" && matchMedia("(min-width:1100px) and (hover:hover) and (pointer:fine)").matches; }
function ffPopOn(state) { return !!(state && state.role === "team" && state.tab === "network" && ffPopMq()); }
/* v1.125 (Alex 20 Nov 00:29): option 1 back button (squircle, chevron, grey glass), fixed to the edge of the page, not to the photo box. */
function ProfBack1() {
  const { state, dispatch } = useStore();
  const company = !!state.viewingCompany;
  if (!(state.viewing || state.viewingCompany)) return null;
  const back = () => rt17Back(() => dispatch({ type: company ? "VIEW_COMPANY" : "VIEW", id: null }));
  return <button type="button" className="ff-pb1" aria-label="Back" onClick={back}><ChevronLeft size={22} /></button>;
}
function ProfilePop17({ children }) {
  const { state, dispatch } = useStore();
  const ref = React.useRef(null);
  const company = !!state.viewingCompany;
  const id = company ? state.viewingCompany : state.viewing;
  const close = () => rt17Back(() => dispatch({ type: company ? "VIEW_COMPANY" : "VIEW", id: null }));
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const k = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", k);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", k); };
  }, []);
  React.useEffect(() => { const c = ref.current && ref.current.querySelector(".ff-pop17-card"); if (c) c.scrollTop = 0; }, [id]);
  /* The X sits in line with the tab bar wherever the tab bar is (below the photos when there are some). */
  React.useEffect(() => {
    const c = ref.current && ref.current.querySelector(".ff-pop17-card"), x = c && c.querySelector(".ff-pop17-x");
    if (!c || !x) return;
    const place = () => {
      const t = c.querySelector("[role=tablist]");
      if (!t) { x.style.top = ""; return; }
      x.style.top = Math.max(0, Math.round(t.getBoundingClientRect().top - c.getBoundingClientRect().top + c.scrollTop)) + "px";
    };
    place();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(place) : null;
    if (ro) { ro.observe(c); Array.from(c.children).forEach(k => ro.observe(k)); }
    const mo = new MutationObserver(place); mo.observe(c, { childList: true, subtree: true });
    const t0 = setTimeout(place, 400), t1 = setTimeout(place, 1200);
    return () => { if (ro) ro.disconnect(); mo.disconnect(); clearTimeout(t0); clearTimeout(t1); };
  }, [id]);
  return (
    <div className="ff-pop17" ref={ref} onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="ff-pop17-card" role="dialog" aria-modal="true" aria-label="Profile">
        <button type="button" className="ff-pop17-x" aria-label="Close" onClick={close}><I11.X size={20} strokeWidth={2.2} /></button>
        {children}
      </div>
    </div>
  );
}

function TeamRouter() {
  const { state } = useStore();
  const { tab } = state;
  /* pfa (Alex 03:29, reverses v17.8.2 for FF Team): Business & Support at the bottom of the FF Team pages, the same box as home.
     v1.47 (Alex 18 Nov 20:06): not on someone else's profile page.
     v1.96 (Alex 18 Nov 22:22): not on the create-a-profile page either; the finished "Your profile" page keeps it (ProfileGate17). */
  const biz = (page, cls) => <>{page}<div className={"ff-biz-pfa" + (cls ? " " + cls : "")}><V101.BusinessSupport19 /></div></>;
  if ((state.viewing || state.viewingCompany) && ffPopOn(state)) return <><NetworkScreen /><ProfilePop17>{state.viewingCompany ? <CompanyPublic /> : <PersonProfile />}</ProfilePop17><ProfBack1 /></>;
  if (state.viewing) return <><PersonProfile /><ProfBack1 /></>;
  if (tab === "network") return <NetworkScreen />;
  if (tab === "bookings") return biz(<TeamBookings />);
  if (tab === "profile") return <ProfileGate17 kind="team" />;
  return <TeamHomeV17 />;
}
