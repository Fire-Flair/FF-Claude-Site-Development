/* src/components/home/team-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* homefix: FF Team home layout fixes (pillar rows, Launch Challenge, spacing, equal boxes). Styles scoped under .ff-hf22. */
const HF22_CSS = __ff_css("styles/home-fix22.css");

/* Pillars per row on the FF Team home: 1 on a phone (full-width rows), 2 on a tablet, 4 on a desktop. 0 = not split. */
function useDxPerRow22(on) {
  const get = () => !on ? 0 : window.innerWidth < 760 ? 1 : window.innerWidth < 1024 ? 2 : 4;
  const [n, setN] = useState(get);
  useEffect(() => {
    if (!on) return;
    const f = () => setN(get());
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, [on]);
  return n;
}

/* Watches the width of root and calls fn when it changes (and once the fonts are in). */
function useWidthWatch22(ref, fn, deps) {
  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    fn(root);
    let ro = null;
    if (window.ResizeObserver) {
      let w = root.clientWidth;
      ro = new ResizeObserver(() => { const nw = root.clientWidth; if (Math.abs(nw - w) > 1) { w = nw; fn(root); } });
      ro.observe(root);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fn(root)).catch(() => {});
    return () => { if (ro) ro.disconnect(); };
  }, deps);
}

/* Never split a word: text that is wider than its box (a long word, or a line kept on one line) shrinks until it fits. */
function useFitLine22(ref, sel, deps) {
  useWidthWatch22(ref, (root) => {
    root.querySelectorAll(sel).forEach((el) => {
      el.style.fontSize = "";
      const base = parseFloat(getComputedStyle(el).fontSize);
      let k = 1, g = 0;
      while (el.scrollWidth > el.clientWidth + 1 && k > 0.55 && g++ < 60) { k -= 0.03; el.style.fontSize = (base * k).toFixed(2) + "px"; }
    });
  }, deps);
}

/* home3: text kept on one line and sized to fill its parent's width exactly (grows or shrinks). The span carries
   margin-right:-.12em so its trailing letter-spacing is not counted. */
function useFitWidth22(ref, sel, deps) {
  useWidthWatch22(ref, (root) => {
    root.querySelectorAll(sel).forEach((el) => {
      const box = el.parentElement;
      if (!box) return;
      el.style.fontSize = "";
      const bs = getComputedStyle(box);
      const avail = box.clientWidth - (parseFloat(bs.paddingLeft) || 0) - (parseFloat(bs.paddingRight) || 0);
      const foot = () => el.getBoundingClientRect().width - (parseFloat(getComputedStyle(el).letterSpacing) || 0);
      for (let i = 0; i < 2; i++) {
        const fs = parseFloat(getComputedStyle(el).fontSize), w = foot();
        if (!(w > 0) || !(avail > 0)) return;
        el.style.fontSize = (Math.floor(fs * avail / w * 100) / 100) + "px";
      }
      let g = 0;
      while (foot() > avail + 0.5 && g++ < 40) el.style.fontSize = (parseFloat(el.style.fontSize) - 0.25) + "px";
    });
  }, deps);
}

/* Equal heights for a set of boxes. An optional part (an answer shown under a question) is left out of the measure,
   so only the box that shows it grows. */
function useEqualH22(ref, sel, exclude, deps) {
  useWidthWatch22(ref, (root) => {
    const els = Array.from(root.querySelectorAll(sel));
    if (els.length < 2) return;
    els.forEach((e) => { e.style.minHeight = ""; });
    const hs = els.map((e) => {
      let h = e.getBoundingClientRect().height;
      const x = exclude ? e.querySelector(exclude) : null;
      if (x) h -= x.getBoundingClientRect().height + (parseFloat(getComputedStyle(e).rowGap) || 0);
      return h;
    });
    const m = Math.ceil(Math.max.apply(null, hs));
    els.forEach((e) => { e.style.minHeight = m + "px"; });
  }, deps);
}

function Home101() {
    const { state } = useStore();
    DIR = useDirectory();
    const guest = !(state.auth && state.auth.status === "signedIn");
    const root = useRef(null);
    useCoinSpin(root);
    /* homefix: coin dividers between sections. home2: the coin game (Join) comes after Business & Support. */
    const coin = (k) => React.createElement(CoinDivider, { key: `coin-${k}` });
    const sections = [
      /* Alex (18 Nov): the Launch Challenge comes first, the Discover FireFlair pillars below it. */
      React.createElement(TeamCompetition20, { key: "competition" }),
      /* home3 (Alex, 18 Nov): a spinning coin above Discover FireFlair. */
      coin("d"),
      React.createElement(DiscoverHub11, {
        key: "discover"
      }),
      coin("a"),
      React.createElement(TwoMinutes20, { key: "twomin" }),
      /* home2 (Alex, 18 Nov): a spinning coin between the video and the bookings box. */
      coin("v"),
      React.createElement(HowBooking17, {
        key: "how",
        kind: "team"
      }),
      coin("b"),
      React.createElement(Journal17, {
        key: "journal",
        kind: "team"
      }),
      /* home3 (Alex, 18 Nov): a spinning coin below FF Stories (and the one below the questions, coin c). */
      coin("s"),
      React.createElement(GuideQuestions11, {
        key: "guide",
        kind: "team"
      }),
      coin("c"),
      React.createElement(BusinessSupport19, {
        key: "business"
      }),
      /* home2 (Alex, 18 Nov): the coin game sits below Business & Support. home3: a spinning coin between them. */
      coin("j"),
      React.createElement(HomeJoin, {
        key: "join"
      })
    ];
    return React.createElement("div", {
      className: "ff-home ff-hf22",
      ref: root
    }, React.createElement("style", null, HF22_CSS), React.createElement("div", {
      className: `ff-home17${guest ? " ff-landing" : ""}`
    }, React.createElement(HomeHero101, null), state.profile.live && React.createElement(WelcomeBack101, null), sections));
  }
