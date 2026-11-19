/* src/App.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
function FireFlair() {
  const [state, baseDispatch] = useReducer(reducer, initialState, inv17Init);
  {
    const tr17 = state.profile && state.profile.tier;
    THEMES.silver.locked = !["silver", "gold"].includes(tr17);
    THEMES.gold.locked = tr17 !== "gold";
  }
  V101.useEdgeBounce();
  const dbDocRef = useRef(null);
  const saveTimer = useRef(null);
  const hydratedRef = useRef(false);
  const dispatch = React.useCallback((action) => {
    baseDispatch(action);
  }, []);
  const store = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  useAnalytics17(state);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const db = null;
        if (!db || cancelled) return;
        const user = await (window.claude.use ? window.claude.use("user") : Promise.resolve(null));
        const me = user ? await user.me() : null;
        if (!me || !me.id || cancelled) return;
        const ref = db.collection("data/users/" + me.id).doc("fireflair");
        dbDocRef.current = ref;
        const snap = await ref.get();
        if (!cancelled && snap.exists) {
          const saved = snap.data() || {};
          const stale = saved.profile && !saved.profile.records;
          if (stale) {
            hydratedRef.current = true;
            return;
          }
          const patch = {};
          PERSIST_KEYS.forEach((k) => {
            if (saved[k] !== void 0) patch[k] = saved[k];
          });
          if (Array.isArray(patch.joinedPeople) && patch.joinedPeople.length) patch.directory = [...DIRECTORY, ...patch.joinedPeople.filter((p) => !DIRECTORY.some((d) => d.id === p.id))];
          /* Saved state from before v17.6.1 carries a forced code and no kind: that code was never a real invitation. */
          if (patch.session) patch.session = patch.session.refKind ? patch.session : { ...patch.session, refTag: null, refKind: null };
          if (patch.profile) {
            patch.profile = { ...patch.profile, records: capRecords17({ ...emptyRecords(), ...patch.profile.records || {} }), media: patch.profile.media || [] };
            if (patch.profile.theme && !THEMES[patch.profile.theme]) patch.profile.theme = "burgundy";
          }
          if (Object.keys(patch).length) dispatch({ type: "HYDRATE", patch });
        }
      } catch (e) {
      } finally {
        hydratedRef.current = true;
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  useEffect(() => {
    if (!dbDocRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      dbDocRef.current.set(pickPersisted(state)).catch(() => {
      });
    }, 500);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state]);
  useEffect(() => {
    try {
      const seo = ffSeoApply(ffSeoFor(state, ffSeoPeople(state)));
      if (seo && FF_SEO.onView) FF_SEO.onView(seo);
    } catch (e) {
    }
  }, [state.role, state.tab, state.route, state.viewing, state.viewingCompany, !!(state.profile && state.profile.live), state.infoPage21 && state.infoPage21.slug, state.supportPage20, state.fd, state.fdPreview]);
  return React.createElement(Store.Provider, { value: store }, React.createElement("style", null, CSS + P1_CSS + V101_CSS + V11_CSS + FD_CSS + TRIAL_DESIGN_CSS + TITLES2_CSS), React.createElement("div", { className: "ff" }, React.createElement(Shell, null, state.supportPage20 ? React.createElement(V101.SupportBookPage20, null) : state.infoPage21 ? React.createElement(V101.TeamInfoPage21, null) : state.viewingCompany ? React.createElement(CompanyPublic, null) : state.viewing && state.role !== "team" ? React.createElement(PersonProfile, null) : state.role === "team" ? React.createElement(TeamRouter, null) : React.createElement(Landing, null)), React.createElement(V101.SupportRoute20, null), React.createElement(Routes17, null), React.createElement(InviteHost17, null), React.createElement(FitWords17, null)));
}
