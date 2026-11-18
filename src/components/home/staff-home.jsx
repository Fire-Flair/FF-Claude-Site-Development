/* src/components/home/staff-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
const FIRE17_STILL = __ff_json("content/data/fire17-still.json");

  const Repeat11 = lucideIcon("Repeat"), Contact11 = lucideIcon("Contact"), CalDays11 = lucideIcon("CalendarDays"), Clip11 = lucideIcon("ClipboardList"), Popper11 = lucideIcon("PartyPopper"), Badge11 = lucideIcon("BadgeCheck"), Bot11 = lucideIcon("Bot");

  function useHireNav() {
    const { state, dispatch } = useStore();
    const site = hireSiteOf(state);
    const tab = (t) => {
      dispatch({ type: "TAB", tab: t });
      window.scrollTo(0, 0);
    };
    return {
      site,
      toEvent: () => {
        if (site.party) {
          dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } });
          tab("bookings");
          return;
        }
        dispatch({ type: "V11_SET", patch: { bkView: { mode: "new", open: "event" } } });
        tab("bookings");
      },
      toBookings: (view) => {
        dispatch({ type: "V11_SET", patch: { bkView: view || { tab: "events" } } });
        tab("bookings");
      },
      toNetwork: (q) => {
        dispatch({ type: "NET_QUERY", q: q || "" });
        tab("network");
      },
      toProfile: () => tab("profile"),
      view: (id) => {
        dispatch({ type: "VIEW", id });
        window.scrollTo(0, 0);
      }
    };
  }
