/* src/components/home/discover-and-support.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  const DI = {
    Users: lucideIcon("Users"),
    Sparkles: lucideIcon("Sparkles"),
    GraduationCap: lucideIcon("GraduationCap"),
    Briefcase: lucideIcon("Briefcase"),
    PartyPopper: lucideIcon("PartyPopper"),
    Handshake: lucideIcon("Handshake"),
    ConciergeBell: lucideIcon("ConciergeBell"),
    Building2: lucideIcon("Building2"),
    ChevronLeft: lucideIcon("ChevronLeft"),
    ChevronRight: lucideIcon("ChevronRight")
  };

  const DISCOVER = CONTENT_ADAPTER.homepageDiscoverTeam();

  const DISCOVER_STAFF = CONTENT_ADAPTER.homepageDiscoverStaff();

  const DISCOVER_PARTY = CONTENT_ADAPTER.homepageDiscoverParty();

  function DiscoverFireFlair({ kind = "team" }) {
    const nav = useHomeNav();
    const hire = useHireNav();
    const set = kind === "staff" ? DISCOVER_STAFF : kind === "party" ? DISCOVER_PARTY : DISCOVER;
    const [open, setOpen] = useState(null);
    const row = useRef(null);
    const go = (to) => {
      setOpen(null);
      setTimeout(() => {
        if (to === "profile")
          kind === "team" ? nav.goProfile() : hire.toProfile();
        else if (to === "network")
          kind === "team" ? nav.goNetwork() : hire.toNetwork("");
        else if (to === "event")
          hire.toEvent();
        else
          scrollToSection(to.slice(1));
      }, 60);
    };
    const by = (dx) => {
      const el = row.current;
      if (el)
        el.scrollBy({ left: dx * Math.max(160, el.clientWidth * 0.8), behavior: "smooth" });
    };
    const c = set.find((x) => x.k === open);
    return React.createElement("section", {
      className: "ff-sect ff-disc",
      id: "ff-discover",
      "aria-labelledby": "ff-disc-h"
    }, React.createElement("div", {
      className: "ff-disc-head"
    }, React.createElement("h2", {
      id: "ff-disc-h",
      className: "ff-h1"
    }, "Discover FireFlair"), React.createElement("span", {
      className: "ff-disc-arrows"
    }, React.createElement("button", {
      type: "button",
      onClick: () => by(-1),
      "aria-label": "Scroll back"
    }, React.createElement(DI.ChevronLeft, {
      size: 18
    })), React.createElement("button", {
      type: "button",
      onClick: () => by(1),
      "aria-label": "Scroll on"
    }, React.createElement(DI.ChevronRight, {
      size: 18
    })))), React.createElement("div", {
      className: "ff-disc-row",
      ref: row,
      role: "list"
    }, set.map((x) => React.createElement("button", {
      key: x.k,
      type: "button",
      role: "listitem",
      className: "ff-disc-card",
      onClick: () => setOpen(x.k),
      "aria-haspopup": "dialog",
      "aria-label": `${x.t}: ${x.s}`
    }, React.createElement("span", {
      className: "ph"
    }, IMGS[x.img] ? React.createElement("img", { decoding: "async",
      src: IMGS[x.img],
      alt: "",
      loading: "eager",
      draggable: false
    }) : null), React.createElement("span", {
      className: "tx"
    }, React.createElement("b", null, x.t), React.createElement("small", null, x.s))))), React.createElement(Sheet, {
      open: !!c,
      onClose: () => setOpen(null),
      title: c ? c.h : "",
      center: true
    }, c && React.createElement("div", {
      className: "ff-disc-modal"
    }, IMGS[c.img] && React.createElement("span", {
      className: "ph"
    }, React.createElement("img", { decoding: "async",
      src: IMGS[c.img],
      alt: ""
    })), React.createElement("p", {
      className: "lead"
    }, c.lead), c.body.map((t, i) => React.createElement("p", {
      key: i
    }, t)), React.createElement("div", {
      className: "acts"
    }, React.createElement("button", {
      type: "button",
      className: "ff-btn primary wide",
      onClick: () => go(c.cta[1])
    }, c.cta[0]), c.cta2 && React.createElement("button", {
      type: "button",
      className: "ff-btn ghost wide",
      onClick: () => go(c.cta2[1])
    }, c.cta2[0])))));
  }

  const CORE_SETS = {
    staff: { lede: "The right people for every event.", nodes: [
      { t: "Event staffing", i: DI.Users },
      { t: "Company profiles", i: DI.Building2 },
      { t: "Shift cards", i: DI.Briefcase },
      { t: "Professional network", i: DI.Handshake },
      { t: "Reviews & trust", i: DI.Sparkles },
      { t: "Hospitality services", i: DI.ConciergeBell }
    ], foot: "FF Staff connects businesses with the hospitality professionals who make their events happen." },
    party: { lede: "Every party starts with people.", nodes: [
      { t: "Parties & celebrations", i: DI.PartyPopper },
      { t: "Cocktails & bars", i: DI.Sparkles },
      { t: "Hospitality staff", i: DI.Users },
      { t: "Venues & homes", i: DI.Building2 },
      { t: "Service Cards", i: DI.ConciergeBell },
      { t: "Favourites & reviews", i: DI.Handshake }
    ], foot: "FF Party connects hosts with the bartenders, staff and services that make a party." }
  };

  const CORE_NODES = [
    { t: "Parties & celebrations", i: DI.PartyPopper },
    { t: "Hospitality services", i: DI.ConciergeBell },
    { t: "Professional networking", i: DI.Handshake },
    { t: "Training & learning", i: DI.GraduationCap },
    { t: "Jobs & careers", i: DI.Briefcase },
    { t: "Business & team events", i: DI.Building2 }
  ];

  function CoreValues({ kind = "team" }) {
    const cs = CORE_SETS[kind] || { lede: "FireFlair is a community built around events.", nodes: CORE_NODES, foot: "FireFlair connects hospitality professionals, services, businesses and customers through events and the opportunities they create." };
    const NODES = cs.nodes;
    const n = NODES.length;
    const pos = NODES.map((_, i) => {
      const a = (-90 + i * 360 / n) * Math.PI / 180;
      return [50 + 34.5 * Math.cos(a), 50 + 33.5 * Math.sin(a)];
    });
    return React.createElement("section", {
      className: "ff-sect ff-core",
      id: "ff-core",
      "aria-labelledby": "ff-core-h"
    }, React.createElement("h2", {
      id: "ff-core-h",
      className: "ff-h1"
    }, "What is FireFlair?"), React.createElement("p", {
      className: "ff-core-lede"
    }, "The card-based event connection platform."), React.createElement(Spin3D11, {
      half: 12,
      className: "core",
      back: React.createElement("div", {
        className: "ff-ring-back big"
      }, React.createElement("span", {
        className: "lg"
      }, React.createElement(Coin, {
        size: 230,
        tier: "gold"
      })))
    }, React.createElement("div", {
      className: "ff-core-ring",
      role: "img",
      "aria-label": `What is FireFlair: community at the centre, connected through ${NODES.map((x) => x.t.toLowerCase()).join(", ")}.`
    }, React.createElement("svg", {
      viewBox: "0 0 100 100",
      "aria-hidden": "true"
    }, pos.map(([x, y], i) => React.createElement("line", {
      key: i,
      x1: "50",
      y1: "50",
      x2: x,
      y2: y,
      stroke: "#C9A227",
      strokeOpacity: ".5",
      strokeWidth: ".45"
    }))), React.createElement("div", {
      className: "mid"
    }, React.createElement("b", null, "COMMUNITY"), React.createElement("small", null, "Connecting people", React.createElement("br", null), "through events.")), NODES.map((x, i) => React.createElement("div", {
      key: x.t,
      className: "node",
      style: { left: `${pos[i][0]}%`, top: `${pos[i][1]}%` },
      "aria-hidden": "true"
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(x.i, {
      size: 18,
      strokeWidth: 1.8
    })), React.createElement("span", {
      className: "lb"
    }, x.t))))), React.createElement("p", {
      className: "ff-core-foot"
    }, cs.foot));
  }

  function CareerSupport() {
    return React.createElement("section", {
      className: "ff-career",
      id: "ff-career",
      "aria-labelledby": "ff-career-h"
    }, React.createElement("h2", {
      id: "ff-career-h",
      className: "ff-h1 ff-career-h"
    }, "Career Support"), React.createElement("p", {
      className: "ff-career-lede"
    }, "Training, Dream Jobs and Rewards, in one place."), React.createElement("div", {
      className: "ff-bt-group"
    }, React.createElement(HomeBookingTiles, {
      only: "training"
    }), React.createElement(HomeBookingTiles, {
      only: "jobs"
    }), React.createElement(HomeBookingTiles, {
      only: "rewards"
    })));
  }

  const Mail19 = lucideIcon("Mail"), Phone19 = lucideIcon("Phone"), Video19 = lucideIcon("Video");

  /* One instance per page: second from bottom on every home page, and nowhere else (v17.8.2). */
  function BusinessSupport19() {
    const { state, dispatch } = useStore();
    const dom = state.role === "team" || !state.role ? "FFTeam.uk" : state.site === "party" ? "FFParty.uk" : state.role === "vip" || state.site === "vip" ? "FFVIP.uk" : "FFStaff.uk";
    const row = (k, label, value) => React.createElement("div", { key: k, className: "ff-biz19-row" }, React.createElement("dt", null, label), React.createElement("dd", null, value));
    return React.createElement("section", {
      className: "ff-sect ff-biz19",
      id: "ff-staff",
      "aria-labelledby": "ff-biz19-h"
    }, React.createElement("div", {
      className: "ff-biz19-box"
    }, React.createElement("h2", {
      id: "ff-biz19-h",
      className: "ff-biz19-h"
    }, "Business & Support"), React.createElement("div", {
      className: "ff-biz19-grid"
    }, React.createElement("div", null, React.createElement("p", {
      className: "ff-biz19-lead"
    }, dom, " is operated by FIREFLAIR LTD."), React.createElement("dl", {
      className: "ff-biz19-dl"
    }, row("num", "Company no.", "17240998, incorporated 25 May 2026"), row("reg", "Registered in", "England and Wales"), row("off", "Office", React.createElement(React.Fragment, null, "71\u201375 Shelton Street, Covent Garden, London, ", React.createElement("span", { className: "ff-biz19-nb" }, "WC2H 9JQ"))))), React.createElement("div", {
      className: "ff-biz19-sup"
    }, React.createElement("h3", null, "Customer support"), React.createElement("a", {
      className: "ff-biz19-link",
      href: "mailto:mrg@ffvip.uk"
    }, React.createElement(Mail19, { size: 16, strokeWidth: 1.8, "aria-hidden": "true" }), "MrG@FFVip.uk"), React.createElement("a", {
      className: "ff-biz19-link",
      href: "tel:+442045020424"
    }, React.createElement(Phone19, { size: 16, strokeWidth: 1.8, "aria-hidden": "true" }), "+442045 020424"), React.createElement("button", {
      type: "button",
      className: "ff-biz19-link ff-biz19-call",
      onClick: () => V101.support20Open(dispatch)
    }, React.createElement(Video19, { size: 16, strokeWidth: 1.8, "aria-hidden": "true" }), "Book a meeting"))), React.createElement("p", {
      className: "ff-biz19-legal"
    }, "\u00A9 2026 FIREFLAIR LTD. All rights reserved.")));
  }

  /* FF Team Launch Competition (working title) — a small promotional feature on the FF Team homepage, between the Discover pillars and How a booking works.
   Join goes to the existing profile journey (useHomeNav.goProfile). The rules open in the shared Sheet. No scoring, leaderboard or sign-up form is built here. */
const COMP_RULES20 = [
  ["Challenge dates", "The challenge runs for 90 days, from 1 December 2026 to 28 February 2027."],
  ["Eligibility", "Open to any hospitality professional, and anyone who wants to get into hospitality and is willing and available to undertake suitable freelance hospitality work. Previous hospitality experience is not mandatory. Hospitality professionals can sign up from anywhere in the world."],
  ["Entry", "Everyone who creates a profile during the challenge is entered automatically."],
  ["Winning", "At the end of the challenge, the ten members with the largest and best Teams become FireFlair Gold members. The overall winner receives the Athens Bar Show trip. Runners-up choose from rewards suggested by members."]
];

const COMP_TBC20 = ["Scoring calculation", "Tie-break procedure", "Prize values", "Winner verification", "Fulfilment conditions", "Promoter details"];

const PROMO_CSS20 = ".ff-cp20{position:relative;margin:22px 0;border-radius:26px;overflow:hidden;color:#F4EBD6;background:linear-gradient(135deg,#0B0A09 0%,#1C0E12 55%,#4A1220 100%);border:1px solid rgba(201,162,75,.45);isolation:isolate}"
    + ".ff-cp20:before{content:'';position:absolute;inset:0;z-index:-1;background:linear-gradient(115deg,transparent 58%,rgba(201,162,75,.16) 58.2%,rgba(201,162,75,.16) 60%,transparent 60.2%)}"
    + ".ff-cp20-in{display:grid;grid-template-columns:1.25fr 1fr;gap:18px;align-items:center;padding:22px}"
    + ".ff-cp20-eye{display:flex;align-items:center;gap:10px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#D9B968;font-weight:600}"
    + ".ff-cp20 h2{margin:8px 0 6px;font-size:clamp(22px,4.6vw,32px);line-height:1.12;color:#F4EBD6}"
    + ".ff-cp20 p{margin:0 0 6px;font-size:14.5px;line-height:1.45;color:rgba(244,235,214,.88)}"
    + ".ff-cp20-date{display:inline-block;margin:4px 0 10px;padding:5px 12px;border-radius:14px;border:1px solid rgba(201,162,75,.6);color:#D9B968;font-weight:600;font-size:13px}"
    + ".ff-cp20-btns{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}"
    + ".ff-cp20-pics{display:grid;grid-template-columns:1fr 1fr;gap:8px}"
    + ".ff-cp20-pics span{display:block;aspect-ratio:1/1;border-radius:16px;background-size:cover;background-position:center;border:1px solid rgba(201,162,75,.35)}"
    + ".ff-cp20-url{margin-top:8px;font-size:12px;letter-spacing:.08em;color:#D9B968;text-align:center}"
    + "@media(max-width:640px){.ff-cp20-in{grid-template-columns:1fr;padding:18px}.ff-cp20-pics{grid-template-columns:repeat(4,1fr)}}"
    + ".ff-cp20r h3{margin:16px 0 4px;font-size:15px}.ff-cp20r p,.ff-cp20r li{font-size:14px;line-height:1.5;margin:0 0 6px}.ff-cp20r ul,.ff-cp20r ol{margin:0;padding-left:20px}"
    + ".ff-cp20r .tbc{display:inline-block;margin:0 6px 6px 0;padding:4px 10px;border-radius:12px;border:1px dashed var(--gold-dk,#A5802F);font-size:12.5px}"
    + ".ff-vip20-ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px}.ff-vip20-ul li{padding:7px 10px;border-radius:14px;border:1px solid rgba(201,162,75,.4);font-size:12px;line-height:1.3;color:#F4EBD6}";

/* v17.9: a little more contrast, spacing and size for the FF Team Launch Challenge box (FF Staff and VIP boxes keep the shared look). */
const TEAM_CP21_CSS = ".ff-cp20.t21 p{font-size:16px;line-height:1.55;color:rgba(244,235,214,.96)}.ff-cp20.t21 .ff-cp20-boxes{gap:12px}.ff-cp20.t21 .ff-cp20-box b{font-size:16px;line-height:1.25;color:#FFF6DC}.ff-cp20.t21 .ff-cp20-box span{font-size:14.5px;line-height:1.4;color:rgba(244,235,214,.94)}.ff-cp20.t21 .ff-cp20-date{font-size:14px}.ff-cp20.t21 .ff-cp20-rules{padding:10px 16px;min-height:44px;border-radius:99px;corner-shape:squircle;border:1px solid rgba(201,162,75,.6);background:transparent;color:#F4DC8E;font-weight:700;font-size:14px;font-family:inherit;cursor:pointer}@media(max-width:640px){.ff-cp20.t21 p{font-size:17px}.ff-cp20.t21 .ff-cp20-box span{font-size:15px}.ff-cp20.t21 .ff-cp20-in{gap:22px}}";

const PROMO_BOX_CSS20 = __ff_css("styles/promo-box-20.css");

const FF_CHALLENGE20 = { start: Date.UTC(2026, 11, 1), days: 90, staffAt: 100, partyAt: 1e3 };

function Countdown20() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 3e4);
    return () => clearInterval(id);
  }, []);
  const c = FF_CHALLENGE20, end = c.start + c.days * 864e5;
  const before = now < c.start, done = now >= end;
  const ms = Math.max(0, (before ? c.start : end) - now);
  const d = Math.floor(ms / 864e5), hr = Math.floor(ms % 864e5 / 36e5), mn = Math.floor(ms % 36e5 / 6e4);
  const cell = (n, l) => React.createElement("span", { className: "ff-cd20-c", key: l }, React.createElement("b", null, String(n).padStart(2, "0")), React.createElement("small", null, l));
  return React.createElement(
    "div",
    { className: "ff-cd20", role: "timer", "aria-label": before ? "Time until the challenge starts" : "Time left in the challenge" },
    React.createElement("span", { className: "ff-cd20-l" }, done ? "Challenge complete" : before ? "Starts in" : "Ends in"),
    done ? null : [cell(d, "days"), cell(hr, "hours"), cell(mn, "mins")]
  );
}

function LaunchBar20() {
  const people = useDirectory();
  const c = FF_CHALLENGE20, n = people.length;
  const pct = n <= c.staffAt ? n / c.staffAt * 50 : 50 + (Math.min(n, c.partyAt) - c.staffAt) / (c.partyAt - c.staffAt) * 50;
  const stops = [["FF Team", "Launch", "Professionals build their profile and network", 0], ["FF Staff", "At " + c.staffAt.toLocaleString("en-GB") + " professionals", "Allows companies to hire you", 50], ["FF Party", "At " + c.partyAt.toLocaleString("en-GB") + " professionals", "Direct to client bookings", 100]];
  return React.createElement(
    "div",
    { className: "ff-lb20" },
    React.createElement(
      "div",
      { className: "ff-lb20-t", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": c.partyAt, "aria-valuenow": n, "aria-label": "Professionals joined" },
      React.createElement("span", { className: "ff-lb20-f", style: { width: pct + "%" } }),
      stops.map((s) => React.createElement("i", { key: s[0], className: "ff-lb20-d" + (pct >= s[3] ? " on" : ""), style: { left: s[3] + "%" } }))
    ),
    React.createElement("div", { className: "ff-lb20-n" }, n.toLocaleString("en-GB") + " professionals so far"),
    React.createElement("div", { className: "ff-lb20-s" }, stops.map((s, i) => React.createElement("div", { key: s[0], className: "ff-lb20-x p" + i }, React.createElement("b", null, s[0]), React.createElement("em", null, s[1]), React.createElement("span", null, s[2]))))
  );
}

const LB20_CSS = __ff_css("styles/lb20.css");

const TM20_CSS = __ff_css("styles/tm20.css");

/* v17.9.2: the "2 minutes" panel is now the FF Team video. Portrait (9:16), press to play, never autoplays; the poster is the
   video's own first frame (the doors). Source and poster: src/content/homepage/team-intro-video.json. */
function TwoMinutes20() {
  const h = React.createElement;
  const V = CONTENT_ADAPTER.homepageTeamIntroVideo();
  const IM = window.FF_IMG || {};
  const [play, setPlay] = useState(false);
  const [src, setSrc] = useState(null);
  const ref = useRef(null);
  const poster = IM[V.poster];
  /* Some hosts serve files without byte ranges, which iPad and iPhone browsers refuse to play: fetch the file whole and play it from memory, falling back to the plain address. */
  const start = () => {
    setPlay(true);
    let done = false;
    const use = (u) => { if (!done) { done = true; setSrc(u); } };
    try {
      fetch(V.src).then((r) => (r.ok ? r.blob() : Promise.reject(new Error("video")))).then((b) => use(URL.createObjectURL(new Blob([b], { type: "video/mp4" })))).catch(() => use(V.src));
    } catch (e) { use(V.src); }
  };
  const failed = () => { if (src && src !== V.src) setSrc(V.src); };
  useEffect(() => { if (src && ref.current) { const p = ref.current.play(); if (p && p.catch) p.catch(() => {}); } }, [src]);
  return h(
    "section",
    { className: "ff-sect ff-tm20", id: "ff-two-minutes", "aria-label": V.label },
    h("style", null, TM20_CSS),
    h(
      "div",
      { className: "ff-tm20-st", style: poster ? { "--tm-poster": "url(" + poster + ")" } : undefined },
      h(
        "div",
        { className: "ff-tm20-v", style: { aspectRatio: V.width + " / " + V.height } },
        play && src
          ? h("video", { ref, src, poster, controls: true, playsInline: true, preload: "auto", onError: failed, "aria-label": V.label })
          : h(
              "button",
              { type: "button", className: "ff-tm20-p", onClick: start, "aria-label": V.label },
              poster ? h("img", { src: poster, alt: "", width: V.width, height: V.height, decoding: "async", draggable: false }) : null,
              h("span", { className: "ff-tm20-play", "aria-hidden": "true" }, h("svg", { viewBox: "0 0 24 24", width: 30, height: 30 }, h("path", { d: "M8 5.5v13l11-6.5z", fill: "currentColor" })))
            )
      )
    )
  );
}

/* homefix: the FF Team Launch Challenge, short form. Four equal boxes (each opens its existing detail sheet), the countdown,
   and the ladder: live count, 100 (bookings go live), 1,000 (launch party and nationwide campaign). Styles: styles/home-fix22.css. */
const LC22_I = { CalendarDays: lucideIcon("CalendarDays"), Users: lucideIcon("Users"), Crown: lucideIcon("Crown"), Plane: lucideIcon("Plane"),
  UserCheck: lucideIcon("UserCheck"), CalendarCheck: lucideIcon("CalendarCheck"), PartyPopper: lucideIcon("PartyPopper"), ChevronRight: lucideIcon("ChevronRight") };

function LaunchLadder22() {
  const h = React.createElement;
  const people = useDirectory();
  const c = FF_CHALLENGE20, n = people.length;
  const pct = n <= c.staffAt ? n / c.staffAt * 50 : 50 + (Math.min(n, c.partyAt) - c.staffAt) / (c.partyAt - c.staffAt) * 50;
  const stops = [
    [LC22_I.UserCheck, n.toLocaleString("en-GB"), "Joined", 0],
    [LC22_I.CalendarCheck, c.staffAt.toLocaleString("en-GB"), "Bookings go live", 50],
    [LC22_I.PartyPopper, c.partyAt.toLocaleString("en-GB"), "Launch party and nationwide campaign", 100]
  ];
  return h("div", { className: "ff-lc22-lad" },
    h("div", { className: "ff-lc22-ic" }, stops.map((s, i) => h("span", { key: i, className: "p" + i, "aria-hidden": "true" }, h(s[0], { size: 16, strokeWidth: 1.8 })))),
    h("div", { className: "ff-lc22-tr", role: "progressbar", "aria-valuemin": 0, "aria-valuemax": c.partyAt, "aria-valuenow": n, "aria-label": "Professionals joined" },
      h("span", { className: "f", style: { width: pct + "%" } }),
      stops.map((s, i) => h("i", { key: i, className: "d" + (pct >= s[3] ? " on" : ""), style: { left: s[3] + "%" } }))),
    h("div", { className: "ff-lc22-st" }, stops.map((s, i) => h("div", { key: i, className: "p" + i }, h("b", null, s[1]), h("span", null, s[2])))));
}

function TeamCompetition20() {
  const h = React.createElement;
  const nav = useHomeNav();
  const [rules, setRules] = useState(false);
  const [box, setBox] = useState(null);
  const CH = TP21.challenge;
  /* [sheet title, face label, face line, icon, sheet sections] */
  const boxes = [
    [CH.boxes[0].t, "90 days", "1 Dec to 28 Feb", LC22_I.CalendarDays, [["Dates", "The challenge runs for 90 days, from 1 December 2026 to 28 February 2027."]]],
    [CH.boxes[1].t, "Open to all", "Anyone in hospitality", LC22_I.Users, [["Who can enter", "Any hospitality professional, and anyone who wants to get into hospitality and is willing and available to undertake suitable freelance hospitality work."], ["Experience", "Previous hospitality experience is not mandatory."], ["Where", "Hospitality professionals can sign up from anywhere in the world."]]],
    [CH.boxes[2].t, "Top 10 go Gold", "Gold membership", LC22_I.Crown, [[CH.rewards[0][0], CH.rewards[0][1]]]],
    [CH.boxes[3].t, "Win Athens", "Athens Bar Show trip", LC22_I.Plane, [[CH.rewards[1][0], CH.rewards[1][1]], [CH.rewards[2][0], CH.rewards[2][1]]]]
  ];
  const cur = box === null ? null : [boxes[box][0], null, boxes[box][4]];
  const sec = (t, body) => h("div", { key: t }, h("h3", { className: "ff-label" }, t), body);
  const pick = (i) => setBox(i);
  return h(
    "section",
    { className: "ff-sect ff-lc22-sect", id: "ff-competition", "aria-labelledby": "ff-cp20-h" },
    h("style", null, PROMO_CSS20 + LB20_CSS),
    h(
      "div",
      { className: "ff-lc22" },
      h(
        "div",
        { className: "ff-lc22-top" },
        h(
          "div",
          { className: "ff-lc22-head" },
          h("div", { className: "ff-lc22-eye" }, h(Coin, { size: 30, tier: "gold" }), h("span", null, "FF Team Launch Challenge")),
          h("h2", { id: "ff-cp20-h" }, "Grow your Team. Win prizes.")
        ),
        h(
          "div",
          { className: "ff-lc22-go" },
          h(Countdown20, null),
          h(
            "div",
            { className: "ff-lc22-btns" },
            h(ShineButton, { onClick: nav.goProfile }, "Join Challenge"),
            h("button", { type: "button", className: "ff-lc22-rules", onClick: () => setRules(true) }, "Rules")
          )
        )
      ),
      h("div", { className: "ff-lc22-boxes" }, boxes.map((b, i) => h("button", { key: b[1], type: "button", className: "ff-lc22-box", onClick: () => pick(i), "aria-haspopup": "dialog" },
        h("span", { className: "ic", "aria-hidden": "true" }, h(b[3], { size: 18, strokeWidth: 1.7 })),
        h("span", { className: "ch", "aria-hidden": "true" }, h(LC22_I.ChevronRight, { size: 16, strokeWidth: 2 })),
        h("b", null, b[1]),
        h("span", { className: "t" }, b[2])))),
      h(LaunchLadder22, null)
    ),
    h(
      Sheet,
      { open: box !== null, onClose: () => setBox(null), title: cur ? cur[0] : "", center: true },
      cur ? h("div", { className: "ff-cp20r" }, cur[2].map((r) => sec(r[0], h("p", null, r[1])))) : null
    ),
    h(
      Sheet,
      { open: rules, onClose: () => setRules(false), title: "Competition rules", center: true },
      h(
        "div",
        { className: "ff-cp20r" },
        sec("To enter", h(
          "ol",
          null,
          h("li", null, "Create a profile."),
          h("li", null, "Upload a profile picture."),
          h("li", null, "Add your professions."),
          h("li", null, "Register your interest."),
          h("li", null, "Answer some questions.")
        )),
        sec("To win", h(
          "ol",
          null,
          h("li", null, "Invite hospitality professionals you have worked with, would like to work with, or believe are great."),
          h("li", null, "Build genuine Network and Team connections."),
          h("li", null, "Have the largest and best Team at the end of the challenge.")
        )),
        h("p", { style: { marginTop: 8 } }, "Network and Team are separate features. Team connections need mutual acceptance."),
        COMP_RULES20.map((r) => sec(r[0], h("p", null, r[1]))),
        sec("Rewards", h("ul", null, CH.rewards.map((r) => h("li", { key: r[0] }, h("b", null, r[0] + ": "), r[1])))),
        h("p", { style: { marginTop: 8 } }, "Challenge results are separate from XP levels."),
        sec("Fair participation", h("p", null, "Only genuine accounts and authentic professional connections qualify. Duplicate, fabricated or manipulated activity may be disqualified following review.")),
        sec("Final terms", h("div", null, h("p", null, "To be confirmed before the challenge opens:"), COMP_TBC20.map((t) => h("span", { key: t, className: "tbc" }, t + ": to be confirmed"))))
      )
    )
  );
}

/* VIP Host Card (formerly VIP Host Card) — a free membership benefit, not a subscription or contract.
   Founding VIP: the first FF_VIP_CONFIG.foundingLimit qualifying registrations. Everything an operator may change sits in FF_VIP_CONFIG.
   A registration qualifies when a VIP Host Card is saved with a name by a signed-in account (or, failing that, a unique phone or email). One per account.
   vipClaims is the prototype's record of qualifying registrations; the live version keeps it server-side and shows places left only from that real count. */
const FF_VIP_CONFIG = {
  foundingLimit: 1000,
  showRemaining: false,
  benefits: [],
  rates: [],
  offers: [],
};

FF_VIP_CONFIG.benefits = [
  { t: "Free VIP Host Card", s: "No subscription", d: ["A free membership benefit.", "It is not a subscription or a contract, and there is nothing to cancel."] },
  { t: "Exclusive rates", s: "On eligible bookings", d: ["Exclusive FireFlair rates for eligible bookings and packages.", "Eligible rates are confirmed before launch and shown here."] },
  { t: "Special offers", s: "For members", d: ["Access to special member offers.", "Offers are shared with VIP Hosts as they are agreed."] },
  { t: "Founding VIP", s: "First " + FF_VIP_CONFIG.foundingLimit.toLocaleString("en-GB") + " members", d: ["The first " + FF_VIP_CONFIG.foundingLimit.toLocaleString("en-GB") + " qualifying VIP Host Card registrations receive Founding VIP status.", "It shows on your VIP Host Card and is saved against your account. One per account."] },
];

const vipClaim20 = (s, patch) => {
  if (!patch || !patch.cardSavedAt) return s;
  if (!(s.role === "staff" && s.site === "party")) return s;
  const c = s.company || {};
  if (c.vip) return s;
  const norm = (v) => String(v || "").toLowerCase().replace(/[^a-z0-9@.+]/g, "");
  const key = s.auth && s.auth.status === "signedIn" && s.auth.tag ? "tag:" + String(s.auth.tag).toLowerCase() : (norm(c.phone) ? "ph:" + norm(c.phone) : (norm(c.email) ? "em:" + norm(c.email) : ""));
  if (!String(c.name || "").trim() || !key) return s;
  const claims = s.vipClaims || [];
  const had = claims.find((x) => x.key === key);
  if (had) return { ...s, company: { ...c, vip: { status: had.status, n: had.n, at: had.at } } };
  const n = claims.length + 1;
  const status = n <= FF_VIP_CONFIG.foundingLimit ? "founding" : "standard";
  const at = Date.now();
  return { ...s, vipClaims: claims.concat([{ key, n, status, at }]), company: { ...c, vip: { status, n, at } } };
};

const vipFoundingCount20 = (state) => (state.vipClaims || []).filter((x) => x.status === "founding").length;

/* FF Staff launch box (v17.4.6.1): Be first in line for Gold. Launch messaging only: no counter, no automatic
   Gold enrolment. Eligibility is recorded once per company at its first confirmed hire (goldClaims17, see
   goldClaim17 in autofill.jsx); this box only reads it. */
const GOLD20 = {
  limit: 100,
  tiles: [
    { k: "marketing", t: "Marketing", img: "gold_marketing", d: ["We help promote your company across FireFlair, so more hosts and businesses find you."], story: "how-to-get-mobile-bar-bookings" },
    { k: "training", t: "Staff training and equipment", img: "gold_training", d: ["We help train your team and provide them with cocktail equipment."] },
    { k: "events", t: "Smaller events", img: "gold_events", d: ["We can help you run smaller events under your own brand."], story: "small-cocktail-event-profitability" },
    { k: "brand", t: "Your brand", img: "gold_brand", d: ["Your cocktails, your staff and your events, booked through FireFlair."], story: "signature-cocktail-services-on-ff-party" },
  ],
};

function GoldLaunch20() {
  const h = React.createElement;
  const { state } = useStore();
  const nav = useHireNav();
  const [box, setBox] = useState(null);
  const IM = window.FF_IMG || {};
  const cur = box === null ? null : GOLD20.tiles[box];
  const key = goldKey17(state);
  const mine = key && (state.goldClaims17 || []).find((x) => x.key === key);
  const story = cur && cur.story && typeof JR17 !== "undefined" && JR17[cur.story] ? JR17[cur.story] : null;
  const read = () => { const id = cur.story; setBox(null); setTimeout(() => window.dispatchEvent(new CustomEvent("ff-openstory", { detail: id })), 60); };
  return h("section", { className: "ff-sect", id: "ff-gold", "aria-labelledby": "ff-gold-h" },
    h("style", null, PROMO_CSS20 + PROMO_BOX_CSS20 + ".ff-gold20-tiles{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ff-gold20-t{position:relative;display:flex;align-items:flex-end;aspect-ratio:1/1;padding:10px;border-radius:16px;corner-shape:squircle;border:1px solid rgba(201,162,75,.45);background:#1C0E12 center/cover no-repeat;color:#F4EBD6;font:inherit;text-align:left;cursor:pointer;overflow:hidden}.ff-gold20-t:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,10,9,0) 35%,rgba(11,10,9,.85))}.ff-gold20-t b{position:relative;font-size:13.5px;line-height:1.2;overflow-wrap:normal;word-break:normal}@media(max-width:640px){.ff-gold20-tiles{grid-template-columns:repeat(2,1fr)}}"),
    h("div", { className: "ff-cp20" },
      h("div", { className: "ff-cp20-in" },
        h("div", null,
          h("div", { className: "ff-cp20-eye" }, h(Coin, { size: 34, tier: "gold" }), h("span", null, "FF Staff launch · Gold")),
          h("h2", { id: "ff-gold-h" }, "Be first in line for Gold"),
          h("p", null, "The first " + GOLD20.limit + " companies to sign up and confirm a hire through FF Staff will be eligible for priority access to our Gold business package."),
          mine ? h("span", { className: "ff-cp20-date" }, mine.n <= GOLD20.limit ? "Your company is in line for Gold" : "Your first hire is confirmed") : null,
          h("div", { className: "ff-cp20-btns" }, h(ShineButton, { onClick: nav.toEvent }, "Hire staff"))),
        h("div", null,
          h("div", { className: "ff-gold20-tiles", role: "group", "aria-label": "What Gold includes" },
            GOLD20.tiles.map((t, i) => h("button", { key: t.k, type: "button", className: "ff-gold20-t", style: IM[t.img] ? { backgroundImage: "url(" + IM[t.img] + ")", backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat" } : undefined, onClick: () => setBox(i) }, h("b", null, t.t)))),
          h("div", { className: "ff-cp20-url" }, "FFStaff.uk")))),
    h(Sheet, { open: box !== null, onClose: () => setBox(null), title: cur ? cur.t : "", center: true },
      cur ? h("div", { className: "ff-cp20r" }, cur.d.map((p, i) => h("p", { key: i }, p)),
        story ? h(Button, { variant: "ghost", onClick: read }, "Read: " + story.title) : null) : null));
}


function VipFounding20() {
  const h = React.createElement;
  const { state, dispatch } = useStore();
  const [info, setInfo] = useState(false);
  const [box, setBox] = useState(null);
  const cfg = FF_VIP_CONFIG;
  const lim = cfg.foundingLimit.toLocaleString("en-GB");
  const vip = (state.company || {}).vip;
  const left = cfg.showRemaining ? Math.max(0, cfg.foundingLimit - vipFoundingCount20(state)) : null;
  const go = () => { dispatch({ type: "TAB", tab: "profile" }); window.scrollTo(0, 0); };
  const sec = (t, body) => h("div", { key: t }, h("h3", { className: "ff-label" }, t), body);
  const cur = box === null ? null : cfg.benefits[box];
  return h("section", { className: "ff-sect", id: "ff-vip", "aria-labelledby": "ff-vip-h" },
    h("style", null, PROMO_CSS20 + PROMO_BOX_CSS20),
    h("div", { className: "ff-cp20 big" },
      h("div", { className: "ff-cp20-in" },
        h("div", null,
          h("div", { className: "ff-cp20-eye" }, h(Coin, { size: 40, tier: "gold" }), h("span", null, "VIP Host Card")),
          h("h2", { id: "ff-vip-h" }, "You’re invited to VIP."),
          h("p", null, "Be one of our first " + lim + " VIP Hosts and enjoy exclusive FireFlair rates, special offers and member benefits."),
          left !== null ? h("span", { className: "ff-cp20-date" }, left.toLocaleString("en-GB") + " founding places left") : null,
          h("div", { className: "ff-cp20-btns" },
            h(LockedBtn17, { shine: true }, vip ? "Open your VIP Host Card" : "Create your VIP Host Card"),
            h(Button, { onClick: () => setInfo(true) }, "VIP details"))),
        h("div", null,
          h("div", { className: "ff-cp20-boxes" }, cfg.benefits.map((b, i) => h("button", { key: b.t, type: "button", className: "ff-cp20-box", onClick: () => setBox(i) }, h("b", null, b.t), h("span", null, b.s)))),
          h("div", { className: "ff-cp20-url" }, "FFParty.uk")))),
    h(Sheet, { open: box !== null, onClose: () => setBox(null), title: cur ? cur.t : "", center: true },
      cur ? h("div", { className: "ff-cp20r" }, cur.d.map((p, i) => h("p", { key: i }, p))) : null),
    h(Sheet, { open: info, onClose: () => setInfo(false), title: "VIP Host Card", center: true },
      h("div", { className: "ff-cp20r" },
        sec("What it is", h("p", null, "A free membership benefit. It is not a subscription or a contract, and there is nothing to cancel.")),
        sec("Founding VIP", h("p", null, "The first " + lim + " qualifying VIP Host Card registrations receive Founding VIP status, saved against the account. One per account.")),
        sec("Benefits", h("ul", null, cfg.benefits.map((b) => h("li", { key: b.t }, b.t + ": " + b.s)))),
        sec("Final terms", h("div", null, h("p", null, "To be confirmed before launch:"), ["Eligible FireFlair rates", "Special member offers", "Qualifying registration definition", "Offer end date", "Promoter details"].map((t) => h("span", { key: t, className: "tbc" }, t + ": to be confirmed")))))));
}
