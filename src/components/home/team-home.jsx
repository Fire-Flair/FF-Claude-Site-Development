/* src/components/home/team-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* homefix: FF Team home layout fixes (pillar rows, Launch Challenge, spacing, equal boxes). Styles scoped under .ff-hf22. */
const HF22_CSS = __ff_css("styles/home-fix22.css", "styles/home-colours.css", "styles/home-text.css", "styles/home-wide.css", "styles/home-slides175.css");
/* home-colours (Alex, 18 Nov 14:53): 4 = ivory and burgundy (ivory pillars with a burgundy border, gold-leaf bookings box,
   champagne hero lighting, hero line "Get seen, get booked, get paid."), the applied look; 0 = the v1.18 look. */
const FF_HOME_COLOUR = 4;

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

/* v1.177 (Alex, 20 Nov 21:49): the FFTeam home hero is a slideshow of photos by category. One state change moves the burgundy slider and
   fades the photo, so they always change together; every 5 seconds it moves to the next category. Tapping a category holds it (tap again to
   release); swiping left or right on the photo steps through that category's photos. No member Profile card yet (the photos belong to no one). */
const HS175 = __ff_json("content/data/home-slides.json").cats;
const HS175_IC = { Martini: lucideIcon("Martini"), Headphones: lucideIcon("Headphones"), Camera: lucideIcon("Camera") };
/* v1.178 (Alex, 20 Nov 22:05): the photo and the slider both slide (same 650 ms, same easing) and the show runs on its own on every device, including
   phones set to Reduce Motion (v1.177 stopped there). Moving to a category on the right slides left, a category on the left slides right. */
const HS175_MS = 650;

function HomeSlides175() {
  const { state } = useStore();
  const nav = useHomeNav();
  const mine = state.role === "team" && state.profile.live;
  const [cat, setCat] = useState(0);
  const [pics, setPics] = useState([0, 0, 0]);
  const [held, setHeld] = useState(false);
  const seen = useRef([true, false, false]);
  const drag = useRef(null);
  const dir = useRef(1);
  const els = useRef({});
  const cur = useRef(null);
  React.useLayoutEffect(() => {
    const key = cat + "-" + pics[cat];
    const nx = els.current[key];
    if (!nx) return;
    if (cur.current == null) { nx.style.visibility = "visible"; cur.current = key; return; }
    if (cur.current === key) return;
    const old = els.current[cur.current];
    Object.keys(els.current).forEach((k) => {
      const e = els.current[k];
      if (e !== nx && e !== old) { e.getAnimations().forEach((x) => x.cancel()); e.style.visibility = "hidden"; }
    });
    [nx, old].forEach((e) => e && e.getAnimations().forEach((x) => x.cancel()));
    const d = dir.current;
    const o = { duration: HS175_MS, easing: "ease-in-out" };
    nx.style.visibility = "visible";
    if (nx.animate) nx.animate([{ transform: "translateX(" + d * 100 + "%)" }, { transform: "translateX(0)" }], o);
    if (old) {
      if (old.animate) {
        const an = old.animate([{ transform: "translateX(0)" }, { transform: "translateX(" + -d * 100 + "%)" }], o);
        an.onfinish = () => { if (cur.current !== old.dataset.k) old.style.visibility = "hidden"; };
      } else old.style.visibility = "hidden";
    }
    cur.current = key;
  }, [cat, pics]);
  useEffect(() => {
    if (held) return;
    const t = setTimeout(() => {
      const n = (cat + 1) % HS175.length;
      dir.current = 1;
      if (seen.current[n]) setPics((p) => p.map((v, i) => (i === n ? (v + 1) % HS175[n].slides.length : v)));
      seen.current[n] = true;
      setCat(n);
    }, 5000);
    return () => clearTimeout(t);
  }, [cat, pics, held]);
  const pick = (i) => {
    if (i === cat) { setHeld((h) => !h); return; }
    dir.current = i > cat ? 1 : -1;
    seen.current[i] = true;
    setCat(i);
    setHeld(true);
  };
  const step = (d) => {
    const len = HS175[cat].slides.length;
    dir.current = d;
    setPics((p) => p.map((v, i) => (i === cat ? (v + d + len) % len : v)));
    setHeld(true);
  };
  const down = (e) => { drag.current = e.clientX; };
  const up = (e) => {
    if (drag.current == null) return;
    const dx = e.clientX - drag.current;
    drag.current = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  };
  const keys = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); pick((cat + 1) % HS175.length); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pick((cat + HS175.length - 1) % HS175.length); }
  };
  return React.createElement("section", { className: "ff-hs175", id: "ff-hero", "aria-labelledby": "ff-hs175-h" },
    React.createElement("div", { className: "ff-hs175-ph", onPointerDown: down, onPointerUp: up, onPointerCancel: () => { drag.current = null; } },
      HS175.map((c, ci) => c.slides.map((s, si) => React.createElement("img", {
        key: ci + "-" + si, src: s.src, alt: "", decoding: "async", draggable: false, "data-k": ci + "-" + si,
        ref: (e) => { if (e) els.current[ci + "-" + si] = e; else delete els.current[ci + "-" + si]; },
        style: { objectPosition: s.x + "% " + s.y + "%" }
      })))),
    React.createElement("div", { className: "ff-hs175-fade", "aria-hidden": "true" }),
    React.createElement("div", { className: "ff-hs175-in" },
      React.createElement("h1", { id: "ff-hs175-h", className: "ff-hs175-h" }, "Welcome to ", React.createElement("span", { className: "br" }, "FFTeam")),
      React.createElement("p", { className: "ff-hs175-s" }, "Get seen, get booked, get paid"),
      mine ? React.createElement(ShineButton, { onClick: nav.goNetwork }, React.createElement(Users, { size: 15 }), " Build your network") : React.createElement(ShineButton, { onClick: nav.goProfile }, React.createElement(User, { size: 15 }), " Create your Profile Card")),
    React.createElement("div", { className: "ff-hs175-seg", role: "tablist", "aria-label": "Categories", onKeyDown: keys },
      React.createElement("span", { className: "ff-hs175-thumb" + (held ? " held" : ""), style: { left: "calc(5px + " + cat + " * (100% - 10px) / 3)" }, "aria-hidden": "true" },
        React.createElement("i", { key: cat + "-" + pics[cat] })),
      HS175.map((c, i) => {
        const Ic = HS175_IC[c.icon];
        return React.createElement("button", { key: c.k, type: "button", role: "tab", "aria-selected": i === cat, className: "ff-hs175-tab", onClick: () => pick(i) },
          React.createElement(Ic, { size: 16, strokeWidth: 2, "aria-hidden": "true" }), c.label);
      })));
}

function Home101() {
    const { state } = useStore();
    DIR = useDirectory();
    const guest = !(state.auth && state.auth.status === "signedIn");
    const root = useRef(null);
    useCoinSpin(root);
    /* v1.109 (Alex, 19 Nov 21:50): on a desktop Join FF Team is a plain box (no coin game). */
    const [deskJoin, setDeskJoin] = useState(() => typeof matchMedia !== "undefined" && matchMedia("(min-width:1100px)").matches);
    useEffect(() => {
      if (typeof matchMedia === "undefined") return;
      const m = matchMedia("(min-width:1100px)"), f = () => setDeskJoin(m.matches);
      if (m.addEventListener) m.addEventListener("change", f); else m.addListener(f);
      f();
      return () => { if (m.removeEventListener) m.removeEventListener("change", f); else m.removeListener(f); };
    }, []);
    /* homefix: coin dividers between sections. home2: the coin game (Join) comes after Business & Support. */
    const coin = (k) => React.createElement(CoinDivider, { key: `coin-${k}` });
    /* home5 (Alex, 18 Nov 03:06 and 03:13): hero (+ Welcome back), Discover, bookings 1-2-3-4, Launch Challenge,
       FF Stories, the door video, the questions, Join / Your FireFlair, Business & Support, and the coin game last.
       Coins above Discover, before the Challenge, before Stories, before Join and before the game. */
    /* v11-a (Alex, 18 Nov 10:20): no coin between the welcome and "What is FF Team?"; no "Life at FF Team" heading,
       the door video full size again; Join FF Team and the coin game one box again (as before v17.57), last on the page. */
    const sections = [
      React.createElement(DiscoverHub11, {
        key: "discover"
      }),
      /* v1.40 (Alex, 18 Nov 19:42): the bookings box now lives inside the Your bookings pillar (discover-hub.jsx). */
      coin("a"),
      React.createElement(TeamCompetition20, { key: "competition" }),
      coin("s"),
      React.createElement(Journal17, {
        key: "journal",
        kind: "team"
      }),
      /* home-update (Alex, 18 Nov 14:18): a coin between FFStories and the door video, another below the door video;
         no coin below "Can FF Team help you?". */
      coin("v"),
      /* v1.104 (Alex, 19 Nov 21:26): the launch event, its video and the questions share one row on desktop (home-wide.css); a plain block elsewhere. */
      React.createElement("div", { key: "lgrow", className: "ff-lg-row" },
        React.createElement(TwoMinutes20, { key: "twomin" }),
        coin("w"),
        React.createElement(GuideQuestions11, {
          key: "guide",
          kind: "team"
        })),
      /* v1.107 (Alex, 19 Nov 21:44): Join FF Team and Business and Support share a row on desktop, Join on the left (home-wide.css); plain block elsewhere. */
      React.createElement(CoinDivider, { key: "coin-bj", className: "ff-coin-desk" }),
      React.createElement("div", { key: "bjrow", className: "ff-bj-row" },
        React.createElement(BusinessSupport19, {
          key: "business"
        }),
        coin("j"),
        React.createElement(HomeJoin, {
          key: "join",
          withGame: !deskJoin
        }))
    ];
    return React.createElement("div", {
      className: `ff-home ff-hf22${FF_HOME_COLOUR ? ` ff-home-c${FF_HOME_COLOUR}` : ""}`,
      ref: root
    }, React.createElement("style", null, HF22_CSS), React.createElement("div", {
      className: `ff-home17${guest ? " ff-landing" : ""}`
    }, React.createElement(HomeSlides175, null), state.profile.live && React.createElement(WelcomeBack101, null), sections));
  }
