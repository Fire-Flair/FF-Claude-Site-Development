/* src/components/home/discover-hub.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const DX_PARTY = [
  { k: "services", t: "Our Packages", s: "Your celebration, beautifully looked after", img: "t17_p30", pool: ["p30", "p01", "v01", "p14", "vke02"], icon: DX_I.Sparkles,
    h: "Everything for a celebration to remember.",
    p: ["Looking for wonderful people with great personalities, quickly and easily? FireFlair Packages are made for you.",
      "Already have your drinks? The Mixology Package brings a bartender with the equipment, a cocktail menu and a shopping list.",
      "Planning a hen party or birthday to remember? The Masterclass Package is the Open Bar Masterclass: shake, stir and create your own recipes."],
    parts: [
      { id: "ff-offer", label: "FireFlair Packages", r: () => h18(PartyPackages18, null) },
      { id: "ff-guarantee", label: "The FireFlair Booking Guarantee", r: () => h18(Guarantee18, null) },
    ],
    jn: [
      { ic: "Sparkles", t: "Find your package", d: "From a classic bartender to a hands-on masterclass.", b: "See the packages", go: "#ff-offer", x: "Each FireFlair Package brings the people, the shopping list and the equipment. Choose the one that suits your celebration." },
      { ic: "ShieldCheck", t: "The FireFlair Booking Guarantee", d: "Confirmed, or refunded in full.", b: "See the guarantee", go: "#ff-guarantee", x: "Book with nothing to lose. Your booking is confirmed, or you are refunded in full." },
      { ic: "Users", t: "Your people, your way", d: "Choose a professional you love.", b: "Meet them", go: "network", x: "Browse bartenders and choose the person you would love behind your bar." },
    ] },
  { k: "community", t: "Our Network", s: "The people behind your celebration", img: "t17_p31", pool: ["p31", "vke04", "p11", "p35", "p27"], icon: DX_I.Users,
    h: "Meet the people who make it happen.",
    p: ["Looking for a bartender whose style suits your celebration? Browse professionals with real reviews from hosts.",
      "Want a name you can trust? Look for the Verified by FireFlair badges and the people who vouch for each professional.",
      "Prefer a company that brings the bar? Browse bar companies and their teams."],
    parts: [
      { id: "ff-trust", label: "Verified by the community", r: () => h18(TrustSection17, null) },
      { id: "ff-team", label: "Featured people", r: () => h18(HireFeatured, { title: "Featured people", ids: ["dir_sam", "stf_don", "stf_fre", "dir_kofi", "dir_maya", "dir_theo"] }) },
      { id: "ff-relationships", label: "Reviews", r: () => h18(HireReviews, { kind: "party" }) },
      { id: "ff-companies", label: "Bar companies", r: () => h18(PartyCompanies, null) },
    ],
    jn: [
      { ic: "Users", t: "Meet your bartenders", d: "Hosts have booked them and said so.", b: "Meet them", go: "#ff-team", x: "Featured professionals, with their reviews and the people who vouch for them." },
      { ic: "Star", t: "Read real reviews", d: "From hosts who have booked them.", b: "Read reviews", go: "#ff-relationships", x: "Reviews are written by hosts who have booked the same people, so you can read what a night with them was really like." },
      { ic: "Store", t: "Bar companies", d: "Companies with their own teams.", b: "Browse companies", go: "#ff-companies", x: "Bar companies bring their own bar and team. Browse them, read their reviews and book for your event." },
    ] },
  { k: "events", t: "Your Booking", s: "Secure your booking", img: "t17_p32", pool: ["p32", "aiMusic", "p24", "aiIntl", "p46"], icon: DX_I.PartyPopper,
    h: "Book your celebration.",
    p: ["Choose your package, choose your people, choose your add-ons, and your booking is secured.",
      "Hen parties, birthdays, house parties, intimate weddings: whatever you are celebrating, the right packages appear after a few simple details.",
      "Your first choice is asked first, so your favourite person gets the first chance to say yes."],
    parts: [
      { id: "ff-how", label: "How booking works", r: () => h18(HowBooking17, { kind: "party" }) },
      { id: "ff-occasions", label: "Every kind of party", r: () => h18(PartyOccasions17, null) },
    ],
    jn: [
      { ic: "CalendarDays", t: "Plan your event", d: "Your date, your place, your guests.", b: "Plan your event", go: "book", x: "Your Event Card holds your date, place and guests. FireFlair uses it to show the packages that suit your celebration." },
      { ic: "PartyPopper", t: "Every kind of party", d: "From hen parties to intimate weddings.", b: "See occasions", go: "#ff-occasions", x: "Hen parties, birthdays, house parties, intimate weddings and more: there is a package that suits it." },
      { ic: "ListChecks", t: "How booking works", d: "Four simple steps.", b: "See the steps", go: "#ff-how", x: "Choose your package, choose your people, choose your add-ons, and your booking is secured." },
    ] },
  { k: "profiles", t: "Your Party", s: "Just the way you like it", img: "t17_p12", pool: ["p12", "p18", "p20", "p15", "p08"], icon: DX_I.Contact,
    h: "Your party, your way, every time.",
    p: ["Save your tastes once and every booking begins with them in place: your drinks, your style and your favourite people.",
      "Keep your favourite bartenders, book your best nights again and share your VIP Host Card with the people you hire.",
      "Your Party is your own space on FireFlair, so every future celebration starts exactly how you like it."],
    parts: [
      { id: "ff-yourparty", label: "Your Party", r: () => h18(YourParty17, null) },
    ],
    jn: [
      { ic: "SlidersHorizontal", t: "Set your preferences", d: "Once, for every booking.", b: "Create your Party profile", go: "profile", x: "Your preferences are saved once and travel with every booking: your kind of party, your drinks and anything your staff should know." },
      { ic: "Heart", t: "Keep your favourites", d: "The people you want again.", b: "Find your favourites", go: "network", x: "Favourites keep the bartenders you loved at the top of your list, ready for your next party." },
      { ic: "History", t: "Book your best nights again", d: "Every party, ready to repeat.", b: "Open Bookings", go: "bookings", x: "Past bookings stay in Your Party, so your best nights can be booked again in a few taps." },
    ] },
];

const DX_ALIAS = { "ff-career": "ff-booktiles", "ff-training": "ff-booktiles", "ff-nx-svc-h": "ff-coming", "ff-nx-ck-h": "ff-coming", "ff-nx-svc": "ff-coming", "ff-nx-ck": "ff-coming" };

  function DiscoverHub11({ cats = DX_TEAM, kind = "team" }) {
    const hire = useHireNav();
    const home = useHomeNav();
    const goSite = useGoSite();
    const base = kind === "staff" ? "ff-staff" : kind === "party" ? "ff-party" : "ff-team";
    const slugs = (() => {
      const raw = cats.map((c) => c.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
      const short = raw.map((x) => x.replace(/^(our|your)-/, ""));
      return raw.map((x, i) => short.filter((y) => y === short[i]).length > 1 ? x : short[i]);
    })();
    const fromUrl = () => {
      const parts = String(window.location.hash || "").replace(/^#\/?/, "").split("/");
      if (parts[0] !== base || parts[1] !== "home")
        return null;
      const i = slugs.indexOf(parts[2]);
      return i < 0 ? null : cats[i].k;
    };
    const [open, setOpen] = useState(() => {
      if (window.__ffUrlRead)
        return null;
      window.__ffUrlRead = true;
      return fromUrl();
    });
    const [shape, setShape] = useState(null);
    const well = useRef(null), root = useRef(null), bar = useRef(null), sent = useRef(null), panel = useRef(null);
    const [leaving, setLeaving] = useState(null);
    const openRef = useRef(open);
    openRef.current = open;
    const hRef = useRef(0);
    const shownK = open || leaving;
    const cur = cats.find((c) => c.k === shownK) || null;
    const idx = cur ? cats.indexOf(cur) : -1;
    const next = cur ? cats[(idx + 1) % cats.length] : null;
  /* v17.3.81: each pillar has five photos (pool). The tile shows one and the pillar's cards show
     three others, so nothing repeats. Every visit starts one photo further on, and while no pillar
     is open the tiles crossfade to their next photo, one tile at a time. */
  const [rot17, setRot17] = useState(() => { const v = dxVisit17(); return cats.map(() => v); });
  const rotOf = (c) => { const i = cats.indexOf(c); return rot17[i] == null ? 0 : rot17[i]; };
  useEffect(() => {
    if (cur || prefersReducedMotion()) return;
    let n = 0;
    const t = setInterval(() => {
      if (document.hidden) return;
      const i = n++ % cats.length;
      setRot17(r => cats.map((c, j) => (r[j] == null ? 0 : r[j]) + (j === i ? 1 : 0)));
    }, 4500);
    return () => clearInterval(t);
  }, [cur, cats]);
    const topOf = () => {
      const tb = document.querySelector(".ff-topbar");
      if (!tb)
        return 0;
      const p = getComputedStyle(tb).position;
      return p === "sticky" || p === "fixed" ? Math.round(tb.getBoundingClientRect().height) : 0;
    };
    const toTop = () => requestAnimationFrame(() => requestAnimationFrame(() => {
      const s = sent.current;
      if (!s)
        return;
      const y = s.getBoundingClientRect().top + window.scrollY - topOf() - 6;
      window.scrollTo({ top: Math.max(0, y), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }));
    const showTile = (k) => {
      const b = bar.current;
      if (!b || b.scrollWidth <= b.clientWidth + 2)
        return;
      const tl = b.querySelector(`[data-k="${k}"]`);
      if (!tl)
        return;
      const br = b.getBoundingClientRect(), tr = tl.getBoundingClientRect();
      const want = b.scrollLeft + (tr.left - br.left) - (b.clientWidth - tr.width) / 2;
      b.scrollTo({ left: Math.max(0, Math.min(b.scrollWidth - b.clientWidth, want)), behavior: prefersReducedMotion() ? "auto" : "smooth" });
    };
    const wantTop = useRef(false);
    const grab = () => {
      hRef.current = panel.current ? panel.current.offsetHeight : 0;
    };
    const collapse = () => {
      const o = openRef.current;
      if (!o)
        return;
      grab();
      setLeaving(o);
      setOpen(null);
    };
    const pick = (k) => {
      if (open === k) {
        collapse();
        return;
      }
      grab();
      setLeaving(null);
      setOpen(k);
      showTile(k);
    };
    const api = useRef({});
    api.current = { collapse, grab };
    const goNext = (k) => {
      wantTop.current = true;
      pick(k);
    };
    const close = () => {
      collapse();
    };
    const jump = (id) => {
      const el = document.getElementById(id);
      if (el)
        el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    };
    const run = (go) => {
      if (go[0] === "#") {
        jump(go.slice(1));
        return;
      }
      if (go.indexOf("site:") === 0) {
        goSite(go.slice(5));
        return;
      }
      if (go === "profile") {
        if (kind === "team")
          home.goProfile();
        else
          hire.toProfile();
        return;
      }
      if (go === "network") {
        hire.toNetwork("");
        return;
      }
      if (go === "bookings") {
        hire.toBookings();
        return;
      }
      if (go === "book") {
        hire.toEvent();
      }
    };
    React.useLayoutEffect(() => {
      if (!cur) {
        setShape(null);
        return;
      }
      const calc = () => {
        const w = well.current, b = bar.current, p = panel.current;
        if (!w || !b || !p)
          return;
        const t = b.querySelector(`[data-k="${cur.k}"]`);
        if (!t)
          return;
        const wr = w.getBoundingClientRect(), pr = p.getBoundingClientRect(), tr = t.getBoundingClientRect();
        const px0 = pr.left - wr.left, px1 = pr.right - wr.left, py0 = pr.top - wr.top, py1 = pr.bottom - wr.top;
        const tx0 = Math.max(tr.left - wr.left, px0), tx1 = Math.min(tr.right - wr.left, px1), ty0 = tr.top - wr.top;
        const mob = window.innerWidth < 760;
        const R = mob ? 12 : 18, rt = mob ? 18 : 22, rc = mob ? 22 : 30, rp = 8;
        const gl = tx0 - px0, gr = px1 - tx1;
        const fL = gl < 3, fR = gr < 3, Rl = gl < 7 ? 0 : Math.min(R, gl), Rr = gr < 7 ? 0 : Math.min(R, gr);
        let d = `M${px0},${py1 - rc} `;
        if (fL)
          d += `L${px0},${ty0 + rt} A${rt},${rt} 0 0 1 ${px0 + rt},${ty0} `;
        else
          d += `L${px0},${py0 + rp} A${rp},${rp} 0 0 1 ${px0 + rp},${py0} L${tx0 - Rl},${py0} A${Rl},${Rl} 0 0 0 ${tx0},${py0 - Rl} L${tx0},${ty0 + rt} A${rt},${rt} 0 0 1 ${tx0 + rt},${ty0} `;
        d += `L${tx1 - rt},${ty0} `;
        if (fR)
          d += `A${rt},${rt} 0 0 1 ${px1},${ty0 + rt} L${px1},${py1 - rc} `;
        else
          d += `A${rt},${rt} 0 0 1 ${tx1},${ty0 + rt} L${tx1},${py0 - Rr} A${Rr},${Rr} 0 0 0 ${tx1 + Rr},${py0} L${px1 - rp},${py0} A${rp},${rp} 0 0 1 ${px1},${py0 + rp} L${px1},${py1 - rc} `;
        d += `A${rc},${rc} 0 0 1 ${px1 - rc},${py1} L${px0 + rc},${py1} A${rc},${rc} 0 0 1 ${px0},${py1 - rc} Z`;
        const fills = [];
        if (!fL && Rl > 5)
          fills.push(`M${tx0 - Rl},${py0} A${Rl},${Rl} 0 0 0 ${tx0},${py0 - Rl} L${tx0},${py0} Z`);
        if (!fR && Rr > 5)
          fills.push(`M${tx1},${py0 - Rr} A${Rr},${Rr} 0 0 0 ${tx1 + Rr},${py0} L${tx1},${py0} Z`);
        setShape({ w: Math.round(wr.width), h: Math.round(wr.height), d, fills, tx: Math.round(tx0 - px0), tw: Math.round(tx1 - tx0), tr: Math.round(Math.max(0, gr)) });
      };
      calc();
      const b = bar.current, ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(calc) : null;
      if (ro) {
        ro.observe(panel.current);
        ro.observe(well.current);
      }
      window.addEventListener("resize", calc);
      if (b)
        b.addEventListener("scroll", calc, { passive: true });
      return () => {
        if (ro)
          ro.disconnect();
        window.removeEventListener("resize", calc);
        if (b)
          b.removeEventListener("scroll", calc);
      };
    }, [shownK]);
    React.useLayoutEffect(() => {
      const p = panel.current;
      if (!p)
        return;
      const clear = () => {
        p.style.height = "";
        p.style.overflow = "";
        p.style.transition = "";
        p.style.paddingTop = "";
        p.style.paddingBottom = "";
      };
      if (open) {
        const natural = p.offsetHeight, from = hRef.current;
        hRef.current = 0;
        if (prefersReducedMotion() || Math.abs(from - natural) < 2) {
          clear();
          return;
        }
        p.style.overflow = "hidden";
        p.style.height = from + "px";
        if (!from) {
          p.style.paddingTop = "0px";
          p.style.paddingBottom = "0px";
        }
        p.offsetHeight;
        p.style.transition = "height .55s cubic-bezier(.22,.8,.24,1), padding .55s cubic-bezier(.22,.8,.24,1)";
        p.style.height = natural + "px";
        p.style.paddingTop = "";
        p.style.paddingBottom = "";
        const t = setTimeout(clear, 600);
        return () => clearTimeout(t);
      }
      if (leaving) {
        if (prefersReducedMotion()) {
          setLeaving(null);
          return;
        }
        const from = p.offsetHeight;
        p.style.overflow = "hidden";
        p.style.height = from + "px";
        p.offsetHeight;
        p.style.transition = "height .45s cubic-bezier(.4,0,.2,1), padding .45s cubic-bezier(.4,0,.2,1)";
        p.style.height = "0px";
        p.style.paddingTop = "0px";
        p.style.paddingBottom = "0px";
        const t = setTimeout(() => setLeaving(null), 480);
        return () => clearTimeout(t);
      }
    }, [open, leaving]);
    React.useLayoutEffect(() => {
      if (!wantTop.current)
        return;
      wantTop.current = false;
      const go = () => {
        const r = root.current;
        if (!r)
          return;
        window.scrollTo({ top: Math.max(0, r.getBoundingClientRect().top + window.scrollY - topOf() - 8), behavior: "auto" });
      };
      go();
      requestAnimationFrame(go);
      setTimeout(go, 120);
    }, [open]);
    const seen = useRef(false);
    useEffect(() => {
      if (!seen.current) {
        seen.current = true;
        if (!open)
          return;
      }
      const path = open ? `${base}/home/${slugs[cats.findIndex((c) => c.k === open)]}` : base;
      try {
        const u = "#/" + path;
        if (window.location.hash !== u)
          window.history.pushState({ ff: path }, "", u);
      } catch (e) {
        try {
          window.location.hash = "/" + path;
        } catch (_) {}
      }
    }, [open]);
    useEffect(() => {
      const sync = () => {
        const k = fromUrl();
        if (k === openRef.current)
          return;
        if (!k) {
          api.current.collapse();
          return;
        }
        api.current.grab();
        setLeaving(null);
        setOpen(k);
      };
      window.addEventListener("popstate", sync);
      window.addEventListener("hashchange", sync);
      const home = (e) => {
        const b = e.target && e.target.closest ? e.target.closest(".ff-bottomnav button, .ff-desknav button") : null;
        if (!b)
          return;
        if ((b.getAttribute("aria-label") || b.textContent || "").trim() !== "Home")
          return;
        api.current.collapse();
        window.scrollTo({ top: 0, behavior: "auto" });
      };
      document.addEventListener("click", home, true);
      return () => {
        window.removeEventListener("popstate", sync);
        window.removeEventListener("hashchange", sync);
        document.removeEventListener("click", home, true);
        try {
          if (String(window.location.hash).indexOf("#/" + base + "/home/") === 0)
            window.history.replaceState(null, "", "#/" + base);
        } catch (_) {}
      };
    }, []);
    useEffect(() => {
      if (root.current)
        root.current.style.setProperty("--dx-top", topOf() + "px");
    }, [open]);
    useEffect(() => {
      window.__ffDxReveal = (id) => {
        const pid = DX_ALIAS[id] || id;
        const c = cats.find((x) => x.parts.some((p) => p.id === pid));
        if (!c)
          return false;
        if (open === c.k && document.getElementById(id))
          return false;
        grab();
        setLeaving(null);
        setOpen(c.k);
        setTimeout(() => {
          const el = document.getElementById(id) || document.getElementById(pid);
          if (el)
            el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
        }, 420);
        return true;
      };
      return () => {
        delete window.__ffDxReveal;
      };
    }, [open, cats]);
    const Ic = cur ? cur.icon : null;
    return React.createElement("section", {
      className: `ff-sect ff-dx${cur ? " is-open" : ""}`,
      id: "ff-discover",
      "aria-labelledby": "ff-dx-h",
      ref: root
    }, React.createElement("style", null, ROT17_CSS), React.createElement("h2", {
      id: "ff-dx-h",
      className: "ff-h1 ff-dx-h"
    }, "Discover FireFlair"), React.createElement("span", {
      className: "ff-dx-sent",
      ref: sent,
      "aria-hidden": "true"
    }), React.createElement("div", {
      className: "ff-dx-well",
      ref: well
    }, React.createElement("div", {
      className: "ff-dx-bar",
      ref: bar
    }, cats.map((c) => {
      const on = shownK === c.k;
      return React.createElement("button", {
        key: c.k,
        type: "button",
        "data-k": c.k,
        className: `ff-dx-tile${on ? " on" : ""}`,
        "aria-expanded": on,
        "aria-controls": "ff-dx-panel",
        onClick: () => pick(c.k)
      }, React.createElement(DxPh17, { c, n: rotOf(c) }), React.createElement("span", {
        className: "chev",
        "aria-hidden": "true"
      }, React.createElement(DX_I.ChevronDown, {
        size: 14,
        strokeWidth: 2.4
      })), React.createElement("span", {
        className: "tx"
      }, React.createElement("b", null, c.t), React.createElement("small", null, c.s)));
    })), cur && React.createElement("div", {
      id: "ff-dx-panel",
      ref: panel,
      className: "ff-dx-panel",
      role: "region",
      "aria-label": cur.t,
      style: shape ? { "--tx": `${shape.tx}px`, "--tw": `${shape.tw}px`, "--tr": `${shape.tr}px` } : undefined
    }, React.createElement("div", {
      className: "ff-dx-intro",
      key: "b" + cur.k
    }, React.createElement("h3", null, cur.h), cur.p.map((t, n) => React.createElement("p", {
      key: n
    }, t))), cur.jn && React.createElement(React.Fragment, null, React.createElement("ol", {
      className: "ff-cta17",
      "aria-label": `${cur.t}: three ways in`
    }, cur.jn.map((j, i) => {
      const ik = cur.pool ? dxCard17(cur, rotOf(cur), i) : [cur.img, ...cats.filter((c) => c !== cur).map((c) => c.img)][i];
      return React.createElement("li", {
        key: j.t
      }, React.createElement("span", {
        className: "ph"
      }, IMGS[ik] ? React.createElement("img", { decoding: "async",
        src: IMGS[ik],
        style: fp17(ik),
        alt: "",
        draggable: false
      }) : null, React.createElement("i", null, i + 1)), React.createElement("b", null, j.t), React.createElement("span", {
        className: "t"
      }, j.x), kind === "party" && ["book", "profile", "bookings"].includes(j.go) ? React.createElement(LockedBtn17, {
        bare: true
      }, j.b) : React.createElement("button", {
        type: "button",
        onClick: () => run(j.go)
      }, j.b));
    })), React.createElement(CoinDivider, null)), React.createElement("div", {
      className: "ff-dx-body",
      key: cur.k
    }, cur.parts.map((p, i) => React.createElement(React.Fragment, {
      key: p.id
    }, i > 0 && React.createElement(CoinDivider, null), p.r()))), React.createElement("div", {
      className: "ff-dx-foot"
    }, React.createElement("button", {
      type: "button",
      className: "ff-dx-next",
      onClick: () => goNext(next.k)
    }, React.createElement("span", {
      className: "ph"
    }, IMGS[dxCard17(next, rotOf(next), 0)] ? React.createElement("img", { decoding: "async",
      src: IMGS[dxCard17(next, rotOf(next), 0)],
      style: fp17(dxCard17(next, rotOf(next), 0)),
      alt: "",
      draggable: false
    }) : null), React.createElement("span", {
      className: "tx"
    }, React.createElement("small", null, "Next"), React.createElement("b", null, next.t)), React.createElement(DX_I.ArrowRight, {
      size: 20
    })), React.createElement("button", {
      type: "button",
      className: "ff-dx-close",
      onClick: close
    }, React.createElement(DX_I.ChevronUp, {
      size: 16
    }), " Close ", cur.t))), cur && shape && React.createElement("svg", {
      className: "ff-dx-svg",
      width: shape.w,
      height: shape.h,
      viewBox: `0 0 ${shape.w} ${shape.h}`,
      "aria-hidden": "true",
      focusable: "false"
    }, shape.fills.map((p, n) => React.createElement("path", {
      key: n,
      d: p,
      className: "fl"
    })), React.createElement("path", {
      d: shape.d,
      className: "ln"
    }))));
  }

  const TEAM_STEPS11 = [
    { icon: User, title: "Create your Profile Card", text: "Who you are, your professions, skills and experience." },
    { icon: Send, title: "Share it", text: "Your own link, ready to send on WhatsApp or anywhere else." },
    { icon: CalDays11, title: "Get booked", text: "Businesses send requests on WhatsApp. They appear in your Bookings." },
    { icon: Star, title: "Grow", text: "Reviews and your team raise your level." }
  ];

  function TeamHow11() {
    const nav = useHomeNav();
    const sam = dirFind("dir_sam");
    return React.createElement("section", {
      className: "ff-sect ff-hw11",
      id: "ff-how-team",
      "aria-labelledby": "ff-thw11-h"
    }, React.createElement("div", {
      className: "ff-hw11-box"
    }, React.createElement("span", {
      className: "ff-hw11-eye"
    }, "How FF Team works"), React.createElement("h2", {
      id: "ff-thw11-h",
      className: "ff-hw11-h"
    }, "Get seen. Get booked."), React.createElement("ol", {
      className: "ff-hw11-steps"
    }, TEAM_STEPS11.map((s, i) => React.createElement("li", {
      key: s.title
    }, React.createElement("span", {
      className: "n"
    }, i + 1), React.createElement("span", {
      className: "ic"
    }, React.createElement(s.icon, {
      size: 18,
      strokeWidth: 1.7
    })), React.createElement("b", null, s.title), React.createElement("span", null, s.text)))), React.createElement(InertBox, {
      className: "ff-hw11-flow"
    }, sam && React.createElement("div", {
      className: "it ev ff-thw11-card"
    }, React.createElement(PlayerCard, {
      person: withFace(sam)
    })), React.createElement("span", {
      className: "ar"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("div", {
      className: "it wa"
    }, React.createElement(WhatsAppPreview, {
      lines: ["FireFlair · Vooshka Cocktail Bar would like to book you:", "Cocktail Bartender · Sat 20 Mar · 17:00 · Hackney Depot"],
      buttons: ["Accept shift", "Unavailable"]
    }), React.createElement("div", {
      className: "ff-hw11-ok"
    }, React.createElement(Check, {
      size: 14,
      strokeWidth: 2.6
    }), " Accepted · in your FF Team bookings"))), React.createElement("div", {
      className: "ff-hw11-cta"
    }, React.createElement(Button, {
      variant: "gold",
      onClick: nav.goProfile
    }, React.createElement(User, {
      size: 14
    }), " Create your Profile Card"), React.createElement(Button, {
      variant: "ghost",
      onClick: () => nav.goBookings()
    }, "Go to Bookings ", React.createElement(ArrowRight, {
      size: 13
    })))));
  }

  function Campfire17() {
    return React.createElement("div", {
      className: "ff-fire17 on",
      role: "img",
      "aria-label": "A campfire burning on a stack of logs"
    }, React.createElement("span", {
      className: "glow",
      "aria-hidden": "true"
    }), React.createElement("img", { decoding: "async",
      className: "still",
      src: FIRE17_STILL,
      alt: "",
      width: "640",
      height: "596",
      decoding: "async",
      draggable: false
    }));
  }

  const WHY17 = {
    team: "As a company we encourage our team to be who they are. Your face, your skills and the things people say about you show it before you walk into the room.",
    staff: "We encourage our team to be who they are, and that is who you want working your events: people with character, whose face, story and reviews you can see before the day.",
    party: "For an intimate gathering you want hospitality staff who are themselves, people who lift the room rather than just serve it. See exactly who you are inviting before the night."
  };

  function WhyFlair17({ kind = "team" }) {
    return React.createElement("section", {
      className: "ff-sect ff-why17",
      id: "ff-why",
      "aria-labelledby": "ff-why-h"
    }, React.createElement("h2", {
      id: "ff-why-h",
      className: "ff-h1 ff-why17-h"
    }, "Our philosophy"), React.createElement("div", {
      className: "ff-why17-hearth"
    }, React.createElement("div", {
      className: "ph fire"
    }, React.createElement("h3", null, "Fire"), React.createElement("small", null, "The gathering"), React.createElement("p", null, "People have always gathered around a fire. It is where stories get told, where strangers turn into friends, and where an ordinary night becomes the one everyone remembers."), React.createElement("p", null, "The best events work the same way: warm, bright, and hard to leave.")), React.createElement(Campfire17, null), React.createElement("div", {
      className: "ph flair"
    }, React.createElement("h3", null, "Flair"), React.createElement("small", null, "The personality"), React.createElement("p", null, WHY17[kind] || WHY17.team)), React.createElement("p", {
      className: "close"
    }, "FireFlair brings people together through events.")));
  }

  const DREAM17 = {
    team: "Our dream is an enjoyable, trustworthy booking experience for every event.",
    staff: "Our dream is an enjoyable, trustworthy booking experience for every event.",
    party: "Our dream is an enjoyable, trustworthy booking experience for every event."
  };

  function DreamCoin17() {
    const box = useRef(null), inn = useRef(null);
    const z = useRef({ a: 0, w: 0.009, down: false, moved: false, x: 0, t: 0, id: null, last: 0, vis: true, raf: 0 });
    const EDGES = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const AUTO = 0.009;
    useEffect(() => {
      const m = z.current;
      const put = () => {
        if (inn.current)
          inn.current.style.transform = `rotateY(${m.a}deg)`;
      };
      const tick = (now) => {
        m.raf = requestAnimationFrame(tick);
        const dt = Math.min(60, now - (m.last || now));
        m.last = now;
        if (!m.vis || m.down)
          return;
        m.w += (AUTO - m.w) * (1 - Math.exp(-dt / 1400));
        m.a = (m.a + m.w * dt) % 36000;
        put();
      };
      m.raf = requestAnimationFrame(tick);
      let io = null;
      if (typeof IntersectionObserver !== "undefined" && box.current) {
        io = new IntersectionObserver((es) => {
          m.vis = es.some((e) => e.isIntersecting);
          m.last = 0;
        });
        io.observe(box.current);
      }
      return () => {
        cancelAnimationFrame(m.raf);
        if (io)
          io.disconnect();
      };
    }, []);
    const down = (e) => {
      const m = z.current;
      m.down = true;
      m.moved = false;
      m.x = e.clientX;
      m.t = performance.now();
      m.id = e.pointerId;
    };
    const move = (e) => {
      const m = z.current;
      if (!m.down)
        return;
      const dx = e.clientX - m.x;
      if (!m.moved && Math.abs(dx) < 6)
        return;
      if (!m.moved) {
        m.moved = true;
        try {
          e.currentTarget.setPointerCapture(m.id);
        } catch (_) {}
      }
      const now = performance.now(), dt = Math.max(1, now - m.t);
      m.w = Math.max(-1.4, Math.min(1.4, 0.7 * m.w + 0.3 * (dx * 1.1 / dt)));
      m.a += dx * 1.1;
      m.x = e.clientX;
      m.t = now;
      if (inn.current)
        inn.current.style.transform = `rotateY(${m.a}deg)`;
    };
    const up = () => {
      const m = z.current;
      m.down = false;
      m.last = 0;
    };
    return React.createElement("div", {
      className: "ff-dcoin",
      ref: box,
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: up,
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "sp",
      ref: inn
    }, EDGES.map((zz) => React.createElement("span", {
      key: zz,
      className: "edge",
      style: { transform: `translateZ(${zz}px)` }
    })), React.createElement("img", { decoding: "async",
      className: "face front",
      src: COIN_SRC,
      alt: "",
      draggable: false,
      decoding: "async"
    }), React.createElement("img", { decoding: "async",
      className: "face back",
      src: COIN_SRC,
      alt: "",
      draggable: false,
      decoding: "async"
    })));
  }

  const FOUNDERS17 = [
    { id: "fnd_alex", name: "Alexander Gagnon", tag: "ALEXG", profession: "Cocktail Bartender", tier: "gold", level: 5, years: 15, skills: ["Cocktail Mixology", "Event Bars", "Team Leadership"], interests: ["Cocktails", "Hospitality"], languages: ["English"], locations: ["London"], theme: "gold" }
  ];

  function FoundingRow17() {
    return React.createElement("div", {
      className: "ff-found17",
      role: "group",
      "aria-label": "Founding members, gold verified"
    }, React.createElement("span", {
      className: "ff-found17-lab"
    }, "Founding members"), React.createElement("div", {
      className: "ff-found17-row",
      tabIndex: 0
    }, FOUNDERS17.map((p) => React.createElement("div", {
      key: p.id,
      className: "ff-found17-it"
    }, React.createElement(PlayerCard, {
      person: { ...p, photo: avatarFor(p.name) },
      format: "portrait",
      themeKey: "gold"
    })))));
  }

  function OurDream17({ kind = "team" }) {
    return React.createElement("section", {
      className: "ff-sect ff-dream17",
      id: "ff-dream",
      "aria-labelledby": "ff-dream-h"
    }, React.createElement("div", {
      className: "ff-dream17-box"
    }, React.createElement("span", {
      className: "eb"
    }, "Our promise"), React.createElement("h2", {
      id: "ff-dream-h",
      className: "ff-dream17-h"
    }, "Built on trust"), React.createElement(DreamCoin17, null), React.createElement("p", {
      className: "ff-dream17-t"
    }, DREAM17[kind] || DREAM17.team), React.createElement("p", {
      className: "ff-dream17-trust"
    }, React.createElement("b", null, "Why a coin?"), " Through history, gold and coins have been at the centre of trade, because they stood for trust. The FireFlair coin stands for the same thing: real people, honest reviews, and a name you can rely on."), React.createElement("p", {
      className: "ff-dream17-trust ff-dream17-found"
    }, React.createElement("b", null, "Our founding team."), " Founding members offer support across all FireFlair events."), React.createElement(FoundingRow17, null)));
  }

  const HB17 = {
    team: [[User, "Profile Card and personal web page", "Show who you are and what you do on your Profile Card, which links to your free personal website."], [MessageSquare, "Booking request", "Receive all the details via WhatsApp. Instantly."], [Check, "Confirm via WhatsApp", "Say yes in a tap, and your shift is confirmed."], [Star, "Review Card", "Every good night builds your reputation."]],
    staff: [[CalDays11, "Event Card", "Your date, venue and the roles you need."], [Sparkles, "Service Card", "The shift details for each role."], [Users, "Profile Cards", "Choose your staff from the network."], [MessageSquare, "Confirmed on WhatsApp", "Everyone is asked, and answers, in a tap."]],
    party: [[Sparkles, "Service Card", "Choose the type of service that suits your event."], [Users, "Profile Cards", "Choose the people you want at your event."], [CalDays11, "Create your Event Card", "The date, the place and how many guests."], [MessageSquare, "Confirmation", "Confirmed within 24 hours."]]
  };

  const HBM17 = {
    team: ["profile", "shift", "answer", "review"],
    staff: ["event", "service", "profiles", "chat"],
    party: ["service", "profiles", "event", "chat"]
  };

  HB17.party = [[Sparkles, "Choose your package", "The celebration you have in mind, ready to go."], [Users, "Choose your people", "Your first choice has 24 hours to say yes."], [Sparkles, "Choose your add-ons", "Extra staff and finishing touches."], [Check, "Your booking is secured", "We confirm your people and every detail within 7 days."]];

HBM17.party = ["package", "profiles", "service", "chat"];

function HBMini17({ k }) {
if (k === "package") return React.createElement("div", { className: "mc sv" }, React.createElement("span", { className: "lab" }, "Package Card"), React.createElement("span", { className: "sp" }, React.createElement(Sparkles, { size: 22, strokeWidth: 1.5 })), React.createElement("span", { className: "ln w1" }), React.createElement("span", { className: "tiers" }, React.createElement("i", { className: "b" }), React.createElement("i", { className: "s" }), React.createElement("i", { className: "g" })));
    const stars = React.createElement("span", {
      className: "st",
      "aria-hidden": "true"
    }, "★★★★★");
    if (k === "profile")
      return React.createElement("div", {
        className: "mc prof"
      }, React.createElement("span", {
        className: "lab"
      }, "Profile Card"), React.createElement("span", {
        className: "av"
      }, React.createElement(User, {
        size: 26,
        strokeWidth: 1.5
      })), React.createElement("b", {
        className: "nm"
      }), React.createElement("span", {
        className: "chips"
      }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)));
    if (k === "shift")
      return React.createElement("div", {
        className: "mc shift"
      }, React.createElement("span", {
        className: "lab"
      }, "Shift", " Card"), React.createElement("span", {
        className: "dt"
      }, React.createElement("b", null, "14"), React.createElement("small", null, "Nov")), React.createElement("span", {
        className: "ln w1"
      }), React.createElement("span", {
        className: "ln w2"
      }), React.createElement("span", {
        className: "btns"
      }, React.createElement("i", {
        className: "y"
      }, "Yes"), React.createElement("i", {
        className: "no"
      }, "No")));
    if (k === "answer")
      return React.createElement("div", {
        className: "mc wa"
      }, React.createElement("span", {
        className: "bub me"
      }, "Yes, I'm in"), React.createElement("span", {
        className: "tick"
      }, "✓✓"));
    if (k === "review")
      return React.createElement("div", {
        className: "mc rev"
      }, React.createElement("span", {
        className: "lab"
      }, "Review Card"), stars, React.createElement("span", {
        className: "ln w1"
      }), React.createElement("span", {
        className: "ln w2"
      }));
    if (k === "event")
      return React.createElement("div", {
        className: "mc ev"
      }, React.createElement("span", {
        className: "lab"
      }, "Event Card"), React.createElement("span", {
        className: "dt"
      }, React.createElement("b", null, "21"), React.createElement("small", null, "Jun")), React.createElement("span", {
        className: "ln w1"
      }), React.createElement("span", {
        className: "roles"
      }, React.createElement("i", null), React.createElement("i", null), React.createElement("i", null)));
    if (k === "service")
      return React.createElement("div", {
        className: "mc sv"
      }, React.createElement("span", {
        className: "lab"
      }, "Service Card"), React.createElement("span", {
        className: "sp"
      }, React.createElement(Sparkles, {
        size: 22,
        strokeWidth: 1.5
      })), React.createElement("span", {
        className: "ln w1"
      }), React.createElement("span", {
        className: "tiers"
      }, React.createElement("i", {
        className: "b"
      }), React.createElement("i", {
        className: "s"
      }), React.createElement("i", {
        className: "g"
      })));
    if (k === "profiles")
      return React.createElement("div", {
        className: "mc pf"
      }, React.createElement("span", {
        className: "mm a"
      }, React.createElement(User, {
        size: 16,
        strokeWidth: 1.6
      })), React.createElement("span", {
        className: "mm b"
      }, React.createElement(User, {
        size: 16,
        strokeWidth: 1.6
      })), React.createElement("span", {
        className: "mm c"
      }, React.createElement(User, {
        size: 16,
        strokeWidth: 1.6
      }), React.createElement("em", null, React.createElement(Check, {
        size: 10,
        strokeWidth: 3
      }))));
    return React.createElement("div", {
      className: "mc wa"
    }, React.createElement("span", {
      className: "bub"
    }, "Confirmed for 21 June"), React.createElement("span", {
      className: "bub me"
    }, "Yes, I'm in"), React.createElement("span", {
      className: "tick"
    }, "✓✓"));
  }

  function HowBooking17({ kind = "team" }) {
    const hire = useHireNav();
    const home = useHomeNav();
    const list = HB17[kind] || HB17.team;
    const pics = HBM17[kind] || HBM17.team;
    return React.createElement("section", {
      className: "ff-sect ff-hb17",
      id: "ff-how",
      "aria-labelledby": "ff-hb17-h"
    }, React.createElement("h2", {
      id: "ff-hb17-h",
      className: "ff-h1"
    }, kind === "team" ? "How FireFlair is built for getting you bookings" : "How a booking works"), kind === "team" && React.createElement("h3", {
      className: "ff-label",
      style: { margin: "0 0 10px" }
    }, "How bookings work"), React.createElement("ol", {
      className: "ff-hb17-row"
    }, list.map(([Ic, t, x], i) => React.createElement(React.Fragment, {
      key: t
    }, i > 0 && React.createElement("li", {
      className: "arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 22,
      strokeWidth: 2.2
    })), React.createElement("li", {
      className: "card" + (i % 2 ? " flip" : "")
    }, React.createElement("span", {
      className: "n"
    }, i + 1), React.createElement("span", {
      className: "pic",
      "aria-hidden": "true"
    }, React.createElement(HBMini17, {
      k: pics[i]
    })), React.createElement("span", {
      className: "tx"
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(Ic, {
      size: 18,
      strokeWidth: 1.7
    })), React.createElement("b", null, t), React.createElement("span", {
      className: "t"
    }, x)))))), React.createElement("div", {
      className: "ff-hb17-cta"
    }, kind === "team" ? React.createElement(Button, {
      variant: "gold",
      onClick: home.goProfile
    }, React.createElement(User, {
      size: 14
    }), " Create your Profile Card") : kind === "party" ? React.createElement(LockedBtn17, {
      shine: true,
      icon: React.createElement(Popper11, { size: 15 })
    }, "Plan your event") : React.createElement(ShineButton, {
      onClick: hire.toEvent
    }, React.createElement(Popper11, {
      size: 15
    }), " Plan your event")));
  }

  function withCoins(list) {
    return list.flatMap((s, i) => i ? [React.createElement(CoinDivider, {
      key: `coin-${i}`
    }), s] : [s]);
  }
