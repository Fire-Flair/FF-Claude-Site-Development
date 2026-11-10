/* src/components/home/nav-and-feedback.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  const { useCallback, useLayoutEffect, Children, Suspense, lazy } = React;

  const BETA_VERSION = "1.1";

  let DIR = [];

  const ID_MAP = { dir_maya: "stf_ava", dir_theo: "stf_tom", dir_priya: "stf_pri", dir_sam: "stf_sam", dir_ines: "stf_mia", dir_kofi: "stf_leo", dir_elena: "stf_nia" };

  const dirFind = (id) => DIR.find((p) => p.id === (ID_MAP[id] || id));

  function useHomeNav() {
    const { state, dispatch } = useStore();
    const go = (tab, sectionId) => {
      if (tab === "profile" && state.role !== "team")
        dispatch({ type: "ROLE", role: "team" });
      dispatch(tab === "profile" ? { type: "TAB", tab, route: "home" } : { type: "TAB", tab });
      window.scrollTo(0, 0);
      if (sectionId)
        scrollToSection(sectionId);
    };
    return {
      goProfile: () => go("profile"),
      goNetwork: () => go("network"),
      goBookings: (sectionId) => go("bookings", sectionId),
      show: (sectionId, toast) => {
        scrollToSection(sectionId);
        if (toast)
          dispatch({ type: "TOAST", message: toast });
      }
    };
  }

  function Button({ children, variant = "", className = "", type = "button", ...rest }) {
    return React.createElement("button", {
      type,
      className: `ff-btn ${variant} ${className}`.trim(),
      ...rest
    }, children);
  }


  class QuietBoundary extends React.Component {
    constructor(p) {
      super(p);
      this.state = { bad: false };
    }
    static getDerivedStateFromError() {
      return { bad: true };
    }
    componentDidCatch() {}
    render() {
      return this.state.bad ? null : this.props.children;
    }
  }

  const BetaFeedbackSheet = (p) => React.createElement(FeedbackSheet, {
    ...p
  });
