/* src/components/home/images-and-scenes.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  const IMGS = window.FF_IMG || {};

  const Sparkles = lucideIcon("Sparkles"), Clock = lucideIcon("Clock"), Lock = lucideIcon("Lock"), Users = lucideIcon("Users"), ChevronLeft = lucideIcon("ChevronLeft"), ChevronRight = lucideIcon("ChevronRight"), ArrowRight = lucideIcon("ArrowRight"), Briefcase = lucideIcon("Briefcase"), CalendarDays = lucideIcon("CalendarDays"), Check = lucideIcon("Check"), Eye = lucideIcon("Eye"), FileText = lucideIcon("FileText"), Gift = lucideIcon("Gift"), HandCoins = lucideIcon("HandCoins"), Heart = lucideIcon("Heart"), IdCard = lucideIcon("IdCard"), MapPin = lucideIcon("MapPin"), Martini = lucideIcon("Martini"), Repeat = lucideIcon("Repeat"), ScrollText = lucideIcon("ScrollText"), Search = lucideIcon("Search"), Send = lucideIcon("Send"), Star = lucideIcon("Star"), User = lucideIcon("User"), UserRound = lucideIcon("UserRound"), UsersRound = lucideIcon("UsersRound"), Vote = lucideIcon("Vote"), Award = lucideIcon("Award"), MoveHorizontal = lucideIcon("MoveHorizontal"), Plane = lucideIcon("Plane"), Plus = lucideIcon("Plus"), RotateCcw = lucideIcon("RotateCcw");

  function useScroller(step) {
    const ref = useRef(null);
    const [edge, setEdge] = useState({ start: true, end: false });
    const [active, setActive] = useState(0);
    const [moved, setMoved] = useState(false);
    useDragScroll(ref);
    const update = useCallback(() => {
      const el = ref.current;
      if (!el)
        return;
      let best = 0;
      let d = 1 / 0;
      Array.from(el.children).forEach((k, i) => {
        const x = Math.abs(k.offsetLeft - el.offsetLeft - el.scrollLeft - 4);
        if (x < d) {
          d = x;
          best = i;
        }
      });
      setActive(best);
      setEdge({ start: el.scrollLeft < 12, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 12 });
      if (el.scrollLeft > 20)
        setMoved(true);
    }, []);
    useEffect(() => {
      update();
      const el = ref.current;
      if (!el)
        return;
      el.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        el.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    }, [update]);
    const by = (dir) => {
      const el = ref.current;
      if (el)
        el.scrollBy({ left: dir * Math.max(step, el.clientWidth * 0.8), behavior: "smooth" });
    };
    return { ref, edge, active, moved, by };
  }

  function useEdgeBounce(selector = "main") {
    useEffect(() => {
      let el = null;
      const root = document.documentElement;
      let startY = 0;
      let edge = null;
      let pull = 0;
      const atTop = () => window.scrollY <= 0;
      const atBottom = () => window.innerHeight + window.scrollY >= root.scrollHeight - 1;
      const set = (v, spring) => {
        el = el ?? document.querySelector(selector);
        if (!el)
          return;
        pull = v;
        el.style.transition = spring ? "transform .5s cubic-bezier(.34,1.56,.64,1)" : "none";
        el.style.transform = v ? `translateY(${v.toFixed(1)}px)` : "";
      };
      const onStart = (e) => {
        startY = e.touches[0].clientY;
        edge = null;
        if (el?.style.transform)
          set(0, false);
      };
      const onMove = (e) => {
        const dy = e.touches[0].clientY - startY;
        if (!edge) {
          if (dy > 4 && atTop())
            edge = "top";
          else if (dy < -4 && atBottom() && !document.querySelector(".ff-drop"))
            edge = "bottom";
          if (edge)
            startY = e.touches[0].clientY;
          return;
        }
        const d = e.touches[0].clientY - startY;
        if (edge === "top" && d <= 0 || edge === "bottom" && d >= 0)
          return set(0, false);
        set(Math.sign(d) * Math.min(70, Math.abs(d) * 0.35), false);
      };
      const onEnd = () => {
        if (pull)
          set(0, true);
        edge = null;
      };
      window.addEventListener("touchstart", onStart, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd, { passive: true });
      window.addEventListener("touchcancel", onEnd, { passive: true });
      return () => {
        window.removeEventListener("touchstart", onStart);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
        if (el)
          el.style.transform = "";
      };
    }, [selector]);
  }

  const img = (name) => (window.FF_IMG || {})[name] || "";

  const FACE = {
    you: img("face_you"),
    maya: img("face_maya"),
    theo: img("face_theo"),
    priya: img("face_priya"),
    sam: img("face_sam"),
    ines: img("face_ines"),
    kofi: img("face_kofi"),
    elena: img("face_elena")
  };

  const HOME_IMG = {
    hero: img("hero"),
    heroSm: img("hero_sm"),
    teams: img("teams")
  };

  const TRAINING_COURSES = [
    { id: "intro_cocktails", kind: "Course", title: "Introduction to Cocktails", img: img("training_cocktail_basics") },
    { id: "mixology", kind: "Course", title: "Mixology", img: img("training_mixology") },
    { id: "wset_spirits", kind: "Qualification", title: "WSET Spirits", img: img("training_spirits_qualification") },
    { id: "wset_wine", kind: "Qualification", title: "WSET Wine", img: img("training_wine_qualification") },
    { id: "brand_training", kind: "Brand event", title: "Spirit brand training", img: img("training_brand_training") },
    { id: "ff_open_class", kind: "FireFlair event", title: "FireFlair Open Class", img: img("training_ff_open_class") },
    { id: "ff_open_bar", kind: "FireFlair event", title: "FireFlair Open Bar", img: img("training_ff_open_bar") },
    { id: "ff_masterclass", kind: "FireFlair event", title: "FireFlair Masterclass", img: img("training_masterclass") }
  ];

  const DREAM_JOBS = [
    { id: "music_festivals", kind: "Festivals", title: "Music festivals", img: img("dream_music_festivals") },
    { id: "motorsport", kind: "Events", title: "Motorsport", img: img("dream_motorsport") },
    { id: "yachts", kind: "Travel", title: "Yacht jobs", img: img("dream_yacht_jobs") },
    { id: "sports", kind: "Events", title: "Sports events", img: img("dream_sports_events") },
    { id: "food_festivals", kind: "Festivals", title: "Food festivals & markets", img: img("dream_food_festivals_markets") },
    { id: "international", kind: "Travel", title: "International jobs", img: img("dream_international_events") },
    { id: "after_dark", kind: "18+ only", title: "After Dark", img: img("dream_after_dark") },
    { id: "flair", kind: "Showtime", title: "Flair jobs", img: img("dream_flair_jobs") }
  ];

  const XP_REWARDS = [
    { id: "bar_shows", kind: "Travel", title: "International bar shows", img: img("reward_bar_shows") },
    { id: "training", kind: "Training", title: "Free training tickets", img: img("reward_training_tickets") },
    { id: "amex", kind: "Business", title: "American Express Gold Expense Card", img: img("reward_amex_card") },
    { id: "nfc", kind: "Your card", title: "FF NFC business card", img: img("reward_nfc_card") },
    { id: "kit", kind: "Kit", title: "Barfly cocktail equipment", img: img("reward_bar_kit") },
    { id: "car", kind: "Travel", title: "Car rental", img: img("reward_car_rental") },
    { id: "party", kind: "FF party", title: "FF January Christmas party", img: img("reward_ff_party") },
    { id: "shoot", kind: "Profile", title: "Professional photoshoot", img: img("reward_photoshoot") }
  ];

  const COCKTAIL_IMGS = [img("cocktail_0"), img("cocktail_1"), img("cocktail_2")];

  const COCKTAIL_CARDS = [
    { name: "Old Fashioned", img: img("cocktail_0") },
    { name: "French Martini", img: img("cocktail_1") },
    { name: "Piña Colada", img: img("cocktail_2") }
  ];

  const NEXT_IMG = {
    staff: img("training_ff_open_bar"),
    party: img("reward_ff_party"),
    vip: img("dream_after_dark"),
    liveEvent: img("tm_live") || img("dream_music_festivals")
  };

  const VERIFICATION_LEVELS = [
    { tier: "base", name: "Base", connections: 0, note: "Where everyone starts" },
    { tier: "bronze", name: "Bronze", connections: 5, note: "5 network connections" },
    { tier: "silver", name: "Silver", connections: 20, note: "20 network connections" },
    { tier: "gold", name: "Gold", connections: null, note: "Locked for now" }
  ];

  function verificationLevel(connections, server) {
    const fromServer = server && VERIFICATION_LEVELS.find((l) => l.tier === server.value.toLowerCase());
    if (fromServer) {
      const at = VERIFICATION_LEVELS.indexOf(fromServer);
      const next = VERIFICATION_LEVELS.slice(at + 1).find((l) => l.connections !== null) ?? null;
      return { ...fromServer, name: server.label || fromServer.name, next };
    }
    const reached = VERIFICATION_LEVELS.filter((l) => l.connections !== null && connections >= l.connections);
    const cur = reached[reached.length - 1] ?? VERIFICATION_LEVELS[0];
    const next = VERIFICATION_LEVELS.find((l) => l.connections !== null && l.connections > connections) ?? null;
    return { ...cur, next };
  }

  /* v17.4.7: built from the package catalogue (state/package-catalogue17.js), in price order. */
  const PARTY_SERVICES = pkgServices17({ all: true });

  const POSTER_TONES = {
    dark: { cls: "dark", accent: "#D9B552" },
    ivory: { cls: "ivory", accent: "#9A7322" },
    bronze: { cls: "dark metal", accent: "#D49A62", edge: "bronze" },
    silver: { cls: "dark metal", accent: "#D6DAE0", edge: "silver" },
    gold: { cls: "dark metal", accent: "#E4C36A", edge: "gold" },
    platinum: { cls: "dark metal platinum", accent: "#E9EDF2" },
    white: { cls: "ivory white", accent: "#9A7322" }
  };

  const PLATINUM_EDGE = "linear-gradient(150deg, #FFFFFF, #E5E4E2 24%, #8E949C 50%, #D9DCE1 74%, #F7F8FA)";

  function PosterCard({ tone = "dark", ribbon, eyebrow, title, subtitle, tagline, price, rows, footer }) {
    const t = POSTER_TONES[tone];
    const style = {
      "--pc-accent": t.accent,
      ...t.edge ? { "--pc-edge": metalEdge(t.edge) } : {},
      ...tone === "platinum" ? { "--pc-edge": PLATINUM_EDGE } : {}
    };
    return React.createElement("article", {
      className: `ff-poster ${t.cls}`,
      style
    }, React.createElement("div", {
      className: "ff-poster-ribbon"
    }, React.createElement(Sparkles, {
      size: 11
    }), " ", ribbon), React.createElement("span", {
      className: "ff-poster-coin"
    }, tone === "platinum" ? React.createElement("img", { decoding: "async",
      src: FF_VIP_LOGO,
      alt: "",
      width: 44,
      height: 44,
      className: "block rounded-full"
    }) : React.createElement(FFLogo, {
      size: 44,
      tier: t.edge ?? "gold"
    })), React.createElement("div", {
      className: "ff-poster-head"
    }, eyebrow && React.createElement("div", {
      className: "ff-poster-eyebrow"
    }, "✦ ", eyebrow, " ✦"), React.createElement("h3", {
      className: "ff-poster-title"
    }, title), subtitle && React.createElement("div", {
      className: "ff-poster-sub"
    }, subtitle), tagline && React.createElement("p", {
      className: "ff-poster-tag"
    }, tagline), price && React.createElement("div", {
      className: "ff-poster-price"
    }, price)), React.createElement("div", {
      className: "ff-poster-rows"
    }, rows.map((r) => React.createElement("div", {
      key: r.label,
      className: "ff-poster-row"
    }, React.createElement("span", {
      className: "ff-poster-medal"
    }, r.icon), React.createElement("span", {
      className: "min-w-0"
    }, React.createElement("span", {
      className: "ff-poster-label"
    }, r.label), React.createElement("span", {
      className: "ff-poster-value"
    }, r.value), r.sub && React.createElement("span", {
      className: "ff-poster-small"
    }, r.sub))))), footer && React.createElement("div", {
      className: "ff-poster-foot"
    }, footer));
  }

  function ServicePoster({ svc, cta }) {
    const { state } = useStore();
    const shown = state.role === "staff" || state.site === "party" ? svc.price : String(svc.price).replace(/£(\d+)/, (m, n) => "£" + Math.max(0, +n - 50));
    return React.createElement(PosterCard, {
      tone: svc.tone,
      ribbon: (svc.kind === "package" || svc.id !== "svc_staffing" ? "Package Card" : "Service Card"),
      eyebrow: `${svc.level} · FF Party`,
      title: svc.title,
      tagline: svc.tagline,
      price: shown,
      rows: [
        { icon: React.createElement(Sparkles, {
          size: 17
        }), label: "Includes", value: svc.includes },
        { icon: React.createElement(Users, {
          size: 17
        }), label: "Ideal for", value: svc.ideal },
        { icon: React.createElement(Clock, {
          size: 17
        }), label: "Duration", value: svc.time }
      ],
      footer: React.createElement(React.Fragment, null, React.createElement("span", {
        className: "ff-poster-small m-0"
      }, "FFParty.uk"), cta || React.createElement(Pill, {
        tone: "warn"
      }, React.createElement(Lock, {
        size: 10
      }), " Coming 2027"))
    });
  }

  const sceneRnd = (seed, i) => {
    const x = Math.sin((i + 1) * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };

  const Coupe = ({ x, y, s = 1 }) => React.createElement("g", {
    transform: `translate(${x} ${y}) scale(${s})`
  }, React.createElement("path", {
    d: "M0 0h44c0 17-10 27-22 27S0 17 0 0z M22 27v28 M8 55h28"
  }));

  const High = ({ x, y, s = 1 }) => React.createElement("g", {
    transform: `translate(${x} ${y}) scale(${s})`
  }, React.createElement("path", {
    d: "M0 0h28l-3 56H3z M4 14h20"
  }));

  const Shaker = ({ x, y, s = 1 }) => React.createElement("g", {
    transform: `translate(${x} ${y}) scale(${s})`
  }, React.createElement("path", {
    d: "M7 0h14l-1 12H8z M3 12h22l-3 46H6z"
  }));

  const Bottle = ({ x, y, h = 70, s = 1 }) => React.createElement("g", {
    transform: `translate(${x} ${y}) scale(${s})`
  }, React.createElement("path", {
    d: `M8 0h8v${h * 0.32}l5 8v${h * 0.6}H3V${h * 0.32 + 8}l5-8z`
  }));

  function HomeScene({ kind = "bar" }) {
    const seed = kind.length * 7 + kind.charCodeAt(0);
    const dots = Array.from({ length: 24 }, (_, i) => ({
      x: sceneRnd(seed, i) * 400,
      y: sceneRnd(seed, i + 40) * 190 + 6,
      r: 5 + sceneRnd(seed, i + 80) * 20,
      o: 0.06 + sceneRnd(seed, i + 120) * 0.2,
      c: i % 3 ? "#E4C36A" : "#F4EBD6"
    }));
    return React.createElement("svg", {
      className: "ff-scene",
      viewBox: "0 0 400 300",
      preserveAspectRatio: "xMidYMid slice",
      "aria-hidden": "true",
      focusable: "false"
    }, dots.map((d, i) => React.createElement("circle", {
      key: i,
      cx: d.x,
      cy: d.y,
      r: d.r,
      fill: d.c,
      opacity: d.o
    })), kind === "festival" ? React.createElement("g", null, React.createElement("path", {
      d: "M-10 40 Q100 110 200 56 T410 50",
      fill: "none",
      stroke: "#C9A227",
      strokeOpacity: ".55",
      strokeWidth: "1.4"
    }), [18, 62, 108, 154, 200, 246, 292, 338, 382].map((x, i) => React.createElement("circle", {
      key: i,
      cx: x,
      cy: 52 + Math.sin(i * 1.1) * 22 + 22,
      r: "5",
      fill: "#F7E3A0",
      opacity: ".9"
    })), React.createElement("g", {
      fill: "rgba(244,235,214,.07)",
      stroke: "#C9A227",
      strokeOpacity: ".5",
      strokeWidth: "1.2"
    }, React.createElement("path", {
      d: "M20 250 L110 168 L200 250z"
    }), React.createElement("path", {
      d: "M170 250 L270 150 L370 250z"
    })), React.createElement("rect", {
      x: "0",
      y: "244",
      width: "400",
      height: "56",
      fill: "#0E0809"
    }), React.createElement("rect", {
      x: "0",
      y: "244",
      width: "400",
      height: "3",
      fill: "#C9A227",
      opacity: ".7"
    }), React.createElement("g", {
      fill: "rgba(244,235,214,.08)",
      stroke: "#E4C36A",
      strokeWidth: "1.4",
      strokeLinejoin: "round"
    }, React.createElement(Coupe, {
      x: 120,
      y: 196,
      s: 0.7
    }), React.createElement(High, {
      x: 186,
      y: 200,
      s: 0.75
    }), React.createElement(Shaker, {
      x: 238,
      y: 190,
      s: 0.75
    }), React.createElement(High, {
      x: 290,
      y: 200,
      s: 0.75
    }))) : React.createElement("g", null, React.createElement("rect", {
      x: "0",
      y: "238",
      width: "400",
      height: "62",
      fill: "#0E0809"
    }), React.createElement("rect", {
      x: "0",
      y: "238",
      width: "400",
      height: "3",
      fill: "#C9A227",
      opacity: ".7"
    }), React.createElement("g", {
      fill: "rgba(244,235,214,.07)",
      stroke: "#E4C36A",
      strokeWidth: "1.4",
      strokeLinejoin: "round",
      strokeLinecap: "round"
    }, React.createElement(Bottle, {
      x: 26,
      y: 150,
      h: 80
    }), React.createElement(Bottle, {
      x: 58,
      y: 162,
      h: 68,
      s: 0.95
    }), React.createElement(Bottle, {
      x: 92,
      y: 146,
      h: 86
    }), React.createElement(Coupe, {
      x: 158,
      y: 186
    }), React.createElement(Shaker, {
      x: 232,
      y: 176,
      s: 1.1
    }), React.createElement(High, {
      x: 290,
      y: 180,
      s: 1.05
    }), React.createElement(Bottle, {
      x: 346,
      y: 156,
      h: 78
    }))));
  }

  function HomeCarousel({ label, children }) {
    const { ref, edge, by } = useScroller(220);
    const items = Children.toArray(children).filter(Boolean);
    return React.createElement("div", {
      className: "ff-hc",
      role: "region",
      "aria-roledescription": "carousel",
      "aria-label": label
    }, React.createElement("button", {
      type: "button",
      className: "ff-hc-btn prev",
      "aria-label": "Previous",
      disabled: edge.start,
      onClick: () => by(-1)
    }, React.createElement(ChevronLeft, {
      size: 18
    })), React.createElement("div", {
      className: "ff-hc-track",
      ref,
      tabIndex: 0
    }, items.map((c, i) => React.createElement("div", {
      className: "ff-hc-item",
      key: i
    }, c))), React.createElement("button", {
      type: "button",
      className: "ff-hc-btn next",
      "aria-label": "Next",
      disabled: edge.end,
      onClick: () => by(1)
    }, React.createElement(ChevronRight, {
      size: 18
    })));
  }
