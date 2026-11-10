/* src/components/home/team-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
function Home101() {
    const { state } = useStore();
    DIR = useDirectory();
    const guest = !(state.auth && state.auth.status === "signedIn");
    const root = useRef(null);
    useCoinSpin(root);
    const sections = [
      React.createElement(DiscoverHub11, {
        key: "discover"
      }),
      React.createElement(TeamCompetition20, { key: "competition" }),
      React.createElement(TwoMinutes20, { key: "twomin" }),
      React.createElement(HowBooking17, {
        key: "how",
        kind: "team"
      }),
      React.createElement(GuideQuestions11, {
        key: "guide",
        kind: "team"
      }),
      React.createElement(Journal17, {
        key: "journal",
        kind: "team"
      }), React.createElement(PhotoAlbumFold20, { key: "album" }),
      React.createElement(BusinessSupport19, {
        key: "business"
      }),
      React.createElement(HomeJoin, {
        key: "join"
      })
    ];
    return React.createElement("div", {
      className: "ff-home",
      ref: root
    }, React.createElement("div", {
      className: `ff-home17${guest ? " ff-landing" : ""}`
    }, React.createElement(HomeHero101, null), state.profile.live && React.createElement(WelcomeBack101, null), sections.flatMap((s, i) => i ? [React.createElement(CoinDivider, {
      key: `coin-${i}`
    }), s] : [s])));
  }
