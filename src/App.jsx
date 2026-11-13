/* src/App.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
function FireFlair() {
  const [state, baseDispatch] = useReducer(reducer, initialState);
  {
    const tr17 = state.role === "team" ? state.profile && state.profile.tier : state.company && state.company.tier;
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
  applyAdmin17(state);
  useAnalytics17(state);
  useEffect(() => {
    dispatch({ type: "SESSION", patch: { refTag: INVITE_LINK_TAG } });
  }, []);
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
          const stale = saved.profile && (!saved.profile.records || typeof saved.profile.xp === "undefined");
          if (stale) {
            hydratedRef.current = true;
            return;
          }
          const patch = {};
          PERSIST_KEYS.forEach((k) => {
            if (saved[k] !== void 0) patch[k] = saved[k];
          });
          if (Array.isArray(patch.joinedPeople) && patch.joinedPeople.length) patch.directory = [...DIRECTORY, ...patch.joinedPeople.filter((p) => !DIRECTORY.some((d) => d.id === p.id))];
          if (Array.isArray(saved.shifts) && saved.shifts.length && !saved.shifts.some((x) => x && "staffId" in x)) {
            delete patch.events;
            delete patch.shifts;
            delete patch.engagements;
            if (patch.route === "shiftNew" || patch.route === "shiftSend") patch.route = "staffHome";
          }
          if (patch.session) patch.session = { ...patch.session, refTag: INVITE_LINK_TAG };
          if (patch.profile) {
            patch.profile = { ...patch.profile, records: { ...emptyRecords(), ...patch.profile.records || {} }, xp: patch.profile.xp || 0, media: patch.profile.media || [] };
            if (PHASE1.xpLive && Array.isArray(patch.profile.xpLog) && patch.profile.xpLog.some((e) => e && e.xp === 0 && e.planned)) {
              const owed = patch.profile.xpLog.reduce((n, e) => n + (e && e.xp === 0 && e.planned ? e.planned : 0), 0);
              patch.profile = {
                ...patch.profile,
                xp: (patch.profile.xp || 0) + owed,
                xpPeriod: (patch.profile.xpPeriod || 0) + owed,
                xpLog: patch.profile.xpLog.map((e) => e && e.xp === 0 && e.planned ? { ...e, xp: e.planned, credited: "v1.1" } : e)
              };
            }
            patch.profile = rollXPPeriodIfNeeded(patch.profile);
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
  }, [state.role, state.tab, state.route, state.viewing, !!(state.profile && state.profile.live), state.fdArea && state.fdArea.path, state.fdArea && state.fdArea.site, state.pkgPage && state.pkgPage.slug, state.supportPage20, state.fd, state.fdPreview]);
  return React.createElement(Store.Provider, { value: store }, React.createElement("style", null, CSS + P1_CSS + V101_CSS + V11_CSS + FD_CSS + TRIAL_DESIGN_CSS), React.createElement("div", { className: "ff" }, React.createElement(Shell, null, state.adminOpen17 ? React.createElement(Admin17, null) : state.ptnGuest ? React.createElement(PtnGuestPage, null) : state.supportPage20 ? React.createElement(V101.SupportBookPage20, null) : state.pkgPage ? React.createElement(V101.PackagePage18, null) : state.fdArea ? React.createElement(AreaPage11, null) : state.viewingCompany ? React.createElement(CompanyPublic, null) : state.viewing ? React.createElement(PersonProfile, null) : state.role === "team" ? React.createElement(TeamRouter, null) : state.role === "staff" ? React.createElement(StaffRouter, null) : state.role === "vip" ? React.createElement(VipRouter21, null) : state.role === "partners" ? React.createElement(PartnersRouter, null) : React.createElement(Landing, null)), React.createElement(CardPeek, null), React.createElement(FdRoute11, null), React.createElement(V101.PkgRoute18, null), React.createElement(PtnRoute, null), React.createElement(V101.SupportRoute20, null), React.createElement(AutofillEngine17, null), React.createElement(FitWords17, null), React.createElement(LongPress17, null)));
}
