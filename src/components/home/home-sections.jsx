/* src/components/home/home-sections.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  function Sect({ id, eyebrow, title, lede, badge, boxed, className, children }) {
    const inner = React.createElement(React.Fragment, null, (eyebrow || title) && React.createElement("div", {
      className: "ff-sect-head"
    }, badge && React.createElement("div", {
      className: "mb-2.5"
    }, badge), eyebrow && React.createElement("div", {
      className: "ff-eyebrow"
    }, eyebrow), title && React.createElement("h2", {
      className: "ff-h1 mt-1.5"
    }, title), lede && React.createElement("p", {
      className: "ff-lede mt-2.5 mb-0"
    }, lede)), children);
    return React.createElement("section", {
      className: `ff-sect${boxed ? " boxed" : ""}${className ? ` ${className}` : ""}`,
      id
    }, boxed ? React.createElement("div", {
      className: `ff-bigsq${boxed === "dark" ? " dark" : ""}`
    }, inner) : inner);
  }

  function PromiseMark({ mark, size = 24 }) {
    const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" };
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      className: "block"
    }, mark === "connect" && React.createElement(React.Fragment, null, React.createElement("circle", {
      cx: "8.6",
      cy: "12",
      r: "5",
      ...p
    }), React.createElement("circle", {
      cx: "15.4",
      cy: "12",
      r: "5",
      ...p
    }), React.createElement("path", {
      d: "M12 8.3v7.4",
      ...p,
      strokeWidth: "1.1",
      opacity: ".7"
    })), mark === "profile" && React.createElement(React.Fragment, null, React.createElement("rect", {
      x: "5",
      y: "3.4",
      width: "14",
      height: "17.2",
      rx: "2",
      ...p
    }), React.createElement("circle", {
      cx: "12",
      cy: "9.6",
      r: "2.7",
      ...p
    }), React.createElement("path", {
      d: "M8 16.6c.8-2.1 2.2-3.1 4-3.1s3.2 1 4 3.1",
      ...p
    })), mark === "reviews" && React.createElement("path", {
      d: "M12 3.8l2.45 5 5.5.8-3.98 3.88.94 5.48L12 16.36l-4.91 2.6.94-5.48L4.05 9.6l5.5-.8z",
      ...p
    }));
  }

  function ShineButton({ onClick, children }) {
    return React.createElement("button", {
      type: "button",
      className: "ff-btn ff-shine" + ffPcardClass(children),
      onClick
    }, React.createElement("i", {
      className: "sp s1",
      "aria-hidden": "true"
    }), React.createElement("i", {
      className: "sp s2",
      "aria-hidden": "true"
    }), React.createElement("i", {
      className: "sp s3",
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "lab"
    }, children));
  }

  function InertBox({ className, children }) {
    const r = useRef(null);
    useEffect(() => {
      r.current?.setAttribute("inert", "");
    }, []);
    return React.createElement("div", {
      ref: r,
      className,
      "aria-hidden": "true"
    }, children);
  }

  const site = (key) => FF_SITES.find((s) => s.key === key);

  const person = (id) => dirFind(id);

  const people = (ids) => ids.map(person).filter(Boolean);

  const first = (p) => p.name.split(" ")[0];

  const EXAMPLE_ID = "dir_sam";

  function HomeFeatured_unused() {
    const nav = useHomeNav();
    const navigate = useNavigate();
    const [featured, setFeatured] = useState(null);
    const [attempt, setAttempt] = useState(0);
    useEffect(() => {
      const ctrl = new AbortController;
      fetchFeatured(ctrl.signal).then(setFeatured, (err) => {
        if (!ctrl.signal.aborted)
          setFeatured({ error: err instanceof Error ? err.message : "Couldn't load the featured professionals." });
      });
      return () => ctrl.abort();
    }, [attempt]);
    if (Array.isArray(featured) && !featured.length)
      return null;
    const open = (p) => {
      navigate(`/${p.tag}`);
      window.scrollTo(0, 0);
    };
    return React.createElement("section", {
      className: "ff-sect ff-feat17",
      id: "ff-team",
      "aria-labelledby": "ff-feat17-h"
    }, React.createElement("div", {
      className: "ff-feat17-head"
    }, React.createElement("h2", {
      id: "ff-feat17-h",
      className: "ff-h1"
    }, "Featured professionals"), React.createElement("button", {
      type: "button",
      className: "ff-linkbtn",
      onClick: nav.goNetwork
    }, "See everyone ", React.createElement(ArrowRight, {
      size: 13
    }))), featured === null ? React.createElement("div", {
      role: "status",
      "aria-label": "Loading featured professionals",
      className: "flex gap-3 overflow-hidden"
    }, [0, 1, 2, 3].map((i) => React.createElement(Skeleton, {
      key: i,
      width: CARD_W.player,
      style: { aspectRatio: "5 / 7", height: "auto", borderRadius: 14 }
    }))) : ("error" in featured) ? React.createElement("p", {
      className: "ff-body ff-muted m-0 text-[13px]",
      role: "alert"
    }, featured.error, " ", React.createElement("button", {
      type: "button",
      className: "font-semibold underline underline-offset-2",
      onClick: () => {
        setFeatured(null);
        setAttempt((n) => n + 1);
      }
    }, "Try again")) : React.createElement(HomeCarousel, {
      label: "Featured professionals"
    }, featured.map((p) => React.createElement(PlayerTile, {
      key: p.id,
      person: p,
      onClick: () => open(p)
    }))));
  }

  const PROFILE_PARTS = [
    { icon: UserRound, label: "Your online profile" },
    { icon: IdCard, label: "A shareable business card" },
    { icon: Users, label: "A network of hospitality professionals" },
    { icon: Star, label: "Reviews from the people you work with" }
  ];

  const WHY = [
    { icon: Search, label: "We take your experience and make it searchable." },
    { icon: Eye, label: "We make you easy to find." },
    { icon: MapPin, label: "We put you on the map." }
  ];

  function HomeWhatIs() {
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-what",
      "aria-labelledby": "ff-wf18-h"
    }, React.createElement("div", {
      className: "ff-wf18 ff-wf101"
    }, React.createElement("div", {
      className: "ff-wf18-coin"
    }, React.createElement(Coin, {
      size: 46
    })), React.createElement("span", {
      className: "ff-wf18-eye"
    }, "What is FF Team?"), React.createElement("h2", {
      id: "ff-wf18-h",
      className: "ff-wf18-h"
    }, "Your CV, brought into the 21st century."), React.createElement("p", {
      className: "ff-wf18-q"
    }, "FF Team is the platform to modernise your CV."), React.createElement("div", {
      className: "ff-orn",
      "aria-hidden": "true"
    }, React.createElement("i", null), React.createElement("span", null, "◆"), React.createElement("i", null)), React.createElement("ol", {
      className: "ff-wf101-flow",
      "aria-label": "From your CV, to your profile, to jobs"
    }, React.createElement("li", {
      className: "step"
    }, React.createElement("span", {
      className: "ff-medal sm"
    }, React.createElement(FileText, {
      size: 20,
      strokeWidth: 1.6
    })), React.createElement("b", null, "Your CV"), React.createElement("span", null, "Uploaded and upgraded in less than 1 minute")), React.createElement("li", {
      className: "arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("li", {
      className: "step big"
    }, React.createElement("span", {
      className: "ff-medal"
    }, React.createElement(PromiseMark, {
      mark: "profile",
      size: 28
    })), React.createElement("em", {
      className: "tag"
    }, "The modern version"), React.createElement("b", null, "Your FF Team profile"), React.createElement("ul", null, PROFILE_PARTS.map((x) => React.createElement("li", {
      key: x.label
    }, React.createElement(x.icon, {
      size: 15,
      strokeWidth: 1.8
    }), " ", x.label)))), React.createElement("li", {
      className: "arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("li", {
      className: "step"
    }, React.createElement("span", {
      className: "ff-medal sm"
    }, React.createElement(Briefcase, {
      size: 20,
      strokeWidth: 1.6
    })), React.createElement("b", null, "Jobs"), React.createElement("span", null, "We advertise you to clients"))), React.createElement("div", {
      className: "ff-wf101-why"
    }, React.createElement("span", {
      className: "ff-wf18-eye"
    }, "Why FF Team?"), React.createElement("p", {
      className: "no"
    }, "What matters is your experience and your connections."), React.createElement("ul", null, WHY.map((x) => React.createElement("li", {
      key: x.label
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(x.icon, {
      size: 16,
      strokeWidth: 1.8
    })), x.label))))));
  }

  const PARTY_FEATURES = [
    { icon: CalendarDays, label: "Event Cards" },
    { icon: Clock, label: "Service Cards" },
    { icon: ScrollText, label: "Terms & conditions" },
    { icon: Martini, label: "Cocktail menus" }
  ];

  const PLATFORMS = [
    {
      n: 1,
      site: "team",
      name: "FF Team",
      status: "Open now",
      tone: "on",
      who: "For freelance hospitality professionals.",
      chips: [
        { icon: IdCard, label: "Profile card" },
        { icon: UserRound, label: "Profile page" },
        { icon: Users, label: "Network" },
        { icon: Star, label: "Reviews" },
        { icon: UsersRound, label: "Teams" }
      ]
    },
    {
      n: 2,
      site: "staff",
      name: "FF Staff",
      status: "Launching next",
      tone: "next",
      who: "A search platform for hospitality businesses.",
      chips: [
        { icon: Star, label: "Skills" },
        { icon: Heart, label: "Interests" },
        { icon: MapPin, label: "Location" },
        { icon: CalendarDays, label: "Availability requests" }
      ]
    },
    {
      n: 3,
      site: "party",
      name: "FF Party",
      status: "Launching 2026",
      tone: "soon",
      who: "Bookings direct from clients.",
      text: "With your FF Team profile, we connect you directly with the clients who want to hire you.",
      chips: PARTY_FEATURES
    },
    {
      n: 4,
      site: "vip",
      name: "FF VIP",
      status: "Launching early 2027",
      tone: "soon",
      who: "VIP cards, luxury experiences and rewards."
    }
  ];

  function HomePlatforms() {
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-how",
      "aria-labelledby": "ff-pl-h"
    }, React.createElement("div", {
      className: "ff-wif ff-hw18 ff-pl ff-pl101"
    }, React.createElement("div", {
      className: "ff-hw18-top"
    }, React.createElement("h2", {
      id: "ff-pl-h",
      className: "ff-hw18-h"
    }, "The FireFlair platforms"), React.createElement("p", {
      className: "ff-pl-order"
    }, "2026 roadmap"), React.createElement("ol", {
      className: "ff-pl-list"
    }, PLATFORMS.map((pl) => React.createElement("li", {
      key: pl.site,
      className: `ff-pl-row${pl.n === 1 ? " first" : ""}${pl.site === "party" ? " party" : ""}`
    }, React.createElement("span", {
      className: "n",
      "aria-hidden": "true"
    }, pl.n), React.createElement("div", {
      className: "hd"
    }, React.createElement(SiteMark, {
      site: site(pl.site),
      size: 48
    }), React.createElement("div", {
      className: "tx"
    }, React.createElement("b", null, pl.name), React.createElement("em", {
      className: pl.tone
    }, pl.status))), React.createElement("span", {
      className: "who"
    }, pl.who), pl.site === "party" && React.createElement("div", {
      className: "ff-pl-flow",
      "aria-label": "Clients book you on FF Party through your FF Team profile"
    }, React.createElement("div", {
      className: "src"
    }, React.createElement("span", {
      className: "ff-pl-clients"
    }, React.createElement(Users, {
      size: 24,
      strokeWidth: 1.6
    })), React.createElement("b", null, "Clients")), React.createElement("i", {
      className: "ar",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("div", {
      className: "src"
    }, React.createElement(SiteMark, {
      site: site("party"),
      size: 54
    }), React.createElement("b", null, "FF Party")), React.createElement("i", {
      className: "ar",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("div", {
      className: "src"
    }, React.createElement("span", {
      className: "ff-pl-you"
    }, React.createElement("img", { decoding: "async",
      src: FACE.you,
      alt: ""
    })), React.createElement("b", null, "You"))), pl.text && React.createElement("p", null, pl.text), pl.site === "party" && pl.chips ? React.createElement("ul", {
      className: "ff-pl-feats",
      "aria-label": "What FF Party provides"
    }, pl.chips.map((f) => React.createElement("li", {
      key: f.label
    }, React.createElement(f.icon, {
      size: 22,
      strokeWidth: 1.6
    }), React.createElement("span", null, f.label)))) : pl.chips ? React.createElement("ul", {
      className: "ff-pl-chips",
      "aria-label": `${pl.name}: what's in it`
    }, pl.chips.map((c) => React.createElement("li", {
      key: c.label
    }, React.createElement(c.icon, {
      size: 13
    }), " ", c.label))) : null))))));
  }

  const TEAM_FACES = {
    dir_maya: FACE.maya,
    dir_theo: FACE.theo,
    dir_priya: FACE.priya,
    dir_sam: FACE.sam,
    dir_ines: FACE.ines,
    dir_kofi: FACE.kofi,
    dir_elena: FACE.elena
  };

  const withFace = (p) => p;

  function TeamCard({ name, skills, interests, url, members, more = 0 }) {
    return React.createElement("article", {
      className: "ff-tcard",
      "aria-label": `Team Card: ${name}, ${members.length + more} members`
    }, React.createElement("span", {
      className: "ff-tcard-plate"
    }, "Team Card"), React.createElement("span", {
      className: "ff-tcard-coin"
    }, React.createElement(Coin, {
      size: 34,
      tier: "gold"
    })), React.createElement("div", {
      className: "ff-tcard-faces"
    }, members.map((p) => React.createElement("span", {
      key: p.id,
      className: "f"
    }, React.createElement(Portrait, {
      src: p.photo,
      name: p.name,
      size: 52,
      tier: p.tier
    }))), more > 0 && React.createElement("span", {
      className: "f more"
    }, "+", more)), React.createElement("span", {
      className: "ff-tcard-count"
    }, members.length + more, " members"), React.createElement("h3", {
      className: "ff-tcard-name"
    }, name), React.createElement("div", {
      className: "ff-tcard-rule",
      "aria-hidden": "true"
    }, React.createElement("i", null), React.createElement("span", null, "◆"), React.createElement("i", null)), React.createElement("div", {
      className: "ff-tcard-rows"
    }, React.createElement("div", null, React.createElement("span", {
      className: "ic"
    }, React.createElement(Star, {
      size: 13,
      fill: "currentColor"
    })), React.createElement("span", {
      className: "k"
    }, "Skills"), React.createElement("span", {
      className: "v"
    }, skills.join(" · "))), React.createElement("div", null, React.createElement("span", {
      className: "ic"
    }, React.createElement(Heart, {
      size: 13,
      fill: "currentColor"
    })), React.createElement("span", {
      className: "k"
    }, "Interests"), React.createElement("span", {
      className: "v"
    }, interests.join(" · ")))), React.createElement("span", {
      className: "ff-tcard-url"
    }, React.createElement(Coin, {
      size: 18,
      tier: "gold"
    }), " ", url));
  }

  function HomeTeams() {
    const nav = useHomeNav();
    const trio = people(["dir_maya", "dir_theo", "dir_priya"]).map(withFace);
    const crew = people(["dir_sam", "dir_ines", "dir_kofi", "dir_elena"]).map(withFace);
    return React.createElement("section", {
      className: "ff-sect ff-teams17 ff-tm",
      id: "ff-teams",
      "aria-labelledby": "ff-tm-h"
    }, React.createElement("h2", {
      id: "ff-tm-h",
      className: "ff-tm-h101"
    }, React.createElement("span", {
      className: "a"
    }, "Build your team."), " ", React.createElement("span", {
      className: "b"
    }, "Work with friends.")), React.createElement("ol", {
      className: "ff-tm-flow",
      "aria-label": "From your Profile Cards to a Team Card to a live event"
    }, React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(InertBox, {
      className: "ff-tm-minis"
    }, trio.map((p) => React.createElement("div", {
      key: p.id,
      className: "ff-tm-mini"
    }, React.createElement(PlayerCard, {
      person: p
    })))), React.createElement("b", null, "Your Profile Cards"), React.createElement("small", null, "You and your friends")), React.createElement("li", {
      className: "ff-tm-arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 20
    })), React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(TeamCard, {
      name: "The Dream Team",
      skills: ["Mixology", "Fast service"],
      interests: ["Weddings", "Festivals"],
      url: `${CARD_DOMAIN}/dreamteam`,
      members: crew,
      more: 3
    }), React.createElement("b", null, "Your Team Card"), React.createElement("small", null, "One card for the whole team")), React.createElement("li", {
      className: "ff-tm-arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 20
    })), React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement("div", {
      className: "ff-tm-live"
    }, React.createElement("img", { decoding: "async",
      src: NEXT_IMG.liveEvent,
      alt: "",
      loading: "eager"
    }), React.createElement("span", {
      className: "shade",
      "aria-hidden": "true"
    })), React.createElement("b", null, "Live event"), React.createElement("small", null, "Get booked together"))), React.createElement("div", {
      className: "ff-teams17-cta"
    }, React.createElement(Button, {
      onClick: nav.goNetwork
    }, React.createElement(Users, {
      size: 14
    }), " Explore the network")));
  }

  function HomeRelationships() {
    const nav = useHomeNav();
    const from = person("dir_maya");
    const to = person(EXAMPLE_ID);
    return React.createElement("section", {
      className: "ff-sect ff-rel17 ff-cv18",
      id: "ff-relationships",
      "aria-labelledby": "ff-rel17-h"
    }, React.createElement("div", {
      className: "ff-cv18-box ff-cv18-rv"
    }, React.createElement("div", {
      className: "hd"
    }, React.createElement("span", {
      className: "ff-cv18-eye"
    }, "Verified by the people you work with"), React.createElement("h2", {
      id: "ff-rel17-h",
      className: "ff-cv18-h"
    }, "Collect reviews from everyone.")), from && to && React.createElement("div", {
      className: "rv"
    }, React.createElement(ReviewCardSample, {
      from,
      to,
      how: "Excellent",
      status: `Accepted · on ${first(to)}'s profile`,
      text: "Ran the bar at our launch night without a single hiccup. Fast, clean and great with the guests."
    }), React.createElement("p", {
      className: "cap"
    }, "Example Review Card")), React.createElement("div", {
      className: "ft"
    }, React.createElement("div", {
      className: "ff-cv18-vis",
      "aria-hidden": "true"
    }, React.createElement("div", {
      className: "lvl"
    }, React.createElement("div", null, React.createElement(Coin, {
      size: 44,
      tier: "bronze"
    }), React.createElement("small", null, "Bronze")), React.createElement("i", null, React.createElement(ArrowRight, {
      size: 14
    })), React.createElement("div", null, React.createElement(Coin, {
      size: 44,
      tier: "silver"
    }), React.createElement("small", null, "Silver")), React.createElement("i", null, React.createElement(ArrowRight, {
      size: 14
    })), React.createElement("div", null, React.createElement(Coin, {
      size: 44,
      tier: "gold"
    }), React.createElement("small", null, "Gold")))), React.createElement("p", {
      className: "ff-cv18-t"
    }, "We make it super easy to collect reviews, and every review raises your level."), React.createElement(Button, {
      variant: "onDark",
      onClick: nav.goNetwork
    }, React.createElement(Users, {
      size: 14
    }), " Explore the network"))));
  }

  const XP_HOW = [
    { icon: User, title: "Build", text: "Complete your Profile Card and profile." },
    { icon: Send, title: "Share", text: "Publish and share your Profile Card." },
    { icon: Users, title: "Grow", text: "Connect with the people you work with." }
  ];

  function HomeXPSection() {
    return React.createElement(Sect, {
      id: "ff-xp",
      className: "ff-whitebox",
      badge: React.createElement("span", {
        className: "ff-soonbadge sm"
      }, React.createElement(Lock, {
        size: 10,
        strokeWidth: 2.4
      }), " Coming 2027"),
      eyebrow: "FF XP · 2027",
      title: "XP verification levels",
      lede: "Earn XP by building your profile and growing your network. More connections mean a higher verification level. XP is coming in 2027."
    }, React.createElement("ol", {
      className: "ff-xphow3",
      "aria-label": "How you earn XP"
    }, XP_HOW.map((h, i) => React.createElement("li", {
      key: h.title
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(h.icon, {
      size: 20,
      strokeWidth: 1.7
    })), React.createElement("b", null, i + 1, ". ", h.title), React.createElement("span", null, h.text)))), React.createElement("div", {
      className: "ff-verladder",
      role: "list",
      "aria-label": "Verification levels"
    }, VERIFICATION_LEVELS.map((l) => React.createElement("div", {
      key: l.tier,
      className: `ff-verstep ${l.tier}${l.connections === null ? " locked" : ""}`,
      role: "listitem"
    }, React.createElement("span", {
      className: "coin"
    }, React.createElement(Coin, {
      size: 64,
      tier: l.tier
    }), l.connections === null && React.createElement("i", null, React.createElement(Lock, {
      size: 12,
      strokeWidth: 2.4
    }))), React.createElement("b", null, l.name), React.createElement("small", null, l.connections === null ? "Locked for now" : l.connections === 0 ? "Where you start" : `${l.connections} connections`)))), React.createElement("div", {
      className: "ff-goldnet"
    }, React.createElement("span", {
      className: "eye"
    }, React.createElement(Coin, {
      size: 24,
      tier: "gold"
    }), " Gold"), React.createElement("h3", null, "Earn Gold. Become a shareholder."), React.createElement("p", null, "Gold members join the FireFlair business network."), React.createElement("ul", null, React.createElement("li", null, React.createElement(Vote, {
      size: 20,
      strokeWidth: 1.6
    }), React.createElement("span", null, "A vote in how the company is run")), React.createElement("li", null, React.createElement(HandCoins, {
      size: 20,
      strokeWidth: 1.6
    }), React.createElement("span", null, "Dividends: you profit when the company profits")), React.createElement("li", null, React.createElement(Gift, {
      size: 20,
      strokeWidth: 1.6
    }), React.createElement("span", null, "The best rewards available")))));
  }

  function ReviewCardSample({ from, to, how, text, status }) {
    return React.createElement("article", {
      className: "ff-rvcard",
      "aria-label": `Example Review Card from ${from.name} to ${to.name}`
    }, React.createElement("div", {
      className: "ff-rvcard-ribbon"
    }, React.createElement(Star, {
      size: 11,
      fill: "currentColor"
    }), " Review Card"), React.createElement("span", {
      className: "ff-rvcard-coin"
    }, React.createElement(Coin, {
      size: 34,
      tier: "gold"
    })), React.createElement("div", {
      className: "ff-rvcard-who"
    }, React.createElement("span", {
      className: "p"
    }, React.createElement(Portrait, {
      src: from.photo,
      name: from.name,
      size: 54,
      tier: from.tier
    }), React.createElement("b", null, first(from)), React.createElement("small", null, from.profession)), React.createElement("span", {
      className: "arrow",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("span", {
      className: "p"
    }, React.createElement(Portrait, {
      src: to.photo,
      name: to.name,
      size: 54,
      tier: to.tier
    }), React.createElement("b", null, first(to)), React.createElement("small", null, to.profession))), React.createElement("div", {
      className: "ff-rvcard-kind"
    }, "Worked together"), React.createElement("div", {
      className: "ff-rvcard-stars",
      "aria-label": "Five out of five"
    }, "★★★★★"), React.createElement("div", {
      className: "ff-rvcard-rows"
    }, React.createElement("div", null, React.createElement("span", null, "Worked with ", first(to), " before?"), React.createElement("b", {
      className: "yes"
    }, "Yes")), React.createElement("div", null, React.createElement("span", null, "Work together again?"), React.createElement("b", {
      className: "yes"
    }, "Yes")), React.createElement("div", null, React.createElement("span", null, "How is ", first(to), " to work with?"), React.createElement("b", {
      className: "yes"
    }, how))), React.createElement("p", {
      className: "ff-rvcard-quote"
    }, '"', text, '"'), React.createElement("div", {
      className: "ff-rvcard-foot done"
    }, React.createElement(Check, {
      size: 14,
      strokeWidth: 2.6
    }), " ", status));
  }

  function HomeBeta() {
    const [open, setOpen] = useState(false);
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-beta",
      "aria-labelledby": "ff-beta-h"
    }, React.createElement("div", {
      className: "ff-beta-box"
    }, React.createElement("span", {
      className: "ff-beta-tag"
    }, "Beta ", BETA_VERSION), React.createElement("h2", {
      id: "ff-beta-h",
      className: "ff-beta-h"
    }, "We're in beta - please give us feedback."), React.createElement("p", {
      className: "ff-beta-t"
    }, "Tell us what works and what you'd like next. It goes straight to the people building FF Team."), React.createElement(Button, {
      onClick: () => setOpen(true)
    }, "Give feedback")), React.createElement(BetaFeedbackSheet, {
      open,
      onClose: () => setOpen(false)
    }));
  }

  function SwipeCarousel({ section, title, note, icon: Icon, items, onOpen }) {
    const { ref, edge, active, moved, by } = useScroller(200);
    return React.createElement("section", {
      className: `ff-sw18 ${section}`,
      "aria-label": title
    }, React.createElement("header", {
      className: "ff-sw18-head"
    }, React.createElement("span", {
      className: "ico",
      "aria-hidden": "true"
    }, React.createElement(Icon, {
      size: 18,
      strokeWidth: 1.6
    })), React.createElement("h3", null, title), React.createElement("span", {
      className: `hint${moved ? " gone" : ""}`,
      "aria-hidden": "true"
    }, React.createElement(MoveHorizontal, {
      size: 15,
      strokeWidth: 1.8
    }), React.createElement("span", {
      className: "lbl"
    }, "Swipe")), React.createElement("button", {
      type: "button",
      className: "open",
      onClick: onOpen
    }, "Open ", React.createElement(ArrowRight, {
      size: 13
    }))), React.createElement("p", {
      className: "ff-sw18-note"
    }, note), React.createElement("div", {
      className: "ff-sw18-stage"
    }, React.createElement("button", {
      type: "button",
      className: "ff-sw18-btn prev",
      "aria-label": `Previous ${title}`,
      disabled: edge.start,
      onClick: () => by(-1)
    }, React.createElement(ChevronLeft, {
      size: 18
    })), React.createElement("div", {
      className: "ff-sw18-track",
      ref,
      tabIndex: 0,
      role: "group",
      "aria-roledescription": "carousel",
      "aria-label": `${title} carousel`
    }, items.map((it) => React.createElement("button", {
      key: it.id,
      type: "button",
      className: "ff-sw18-card",
      onClick: onOpen,
      "aria-label": `${it.title}. Open ${title}`
    }, React.createElement("img", { decoding: "async",
      src: it.img,
      alt: "",
      loading: "eager",
      draggable: false
    }), React.createElement("span", {
      className: "shade",
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "t"
    }, it.title)))), React.createElement("button", {
      type: "button",
      className: "ff-sw18-btn next",
      "aria-label": `Next ${title}`,
      disabled: edge.end,
      onClick: () => by(1)
    }, React.createElement(ChevronRight, {
      size: 18
    }))), React.createElement("div", {
      className: "ff-sw18-dots",
      "aria-hidden": "true"
    }, items.map((it, i) => React.createElement("i", {
      key: it.id,
      className: i === active ? "on" : ""
    }))));
  }

  const SETS = {
    training: {
      id: "ff-training",
      title: "Training",
      icon: Award,
      list: TRAINING_COURSES,
      note: "Register your interest and we'll message you to book a course."
    },
    jobs: {
      id: "ff-jobs",
      title: "Dream jobs",
      icon: Plane,
      list: DREAM_JOBS,
      note: "Register your interest and we'll message you to make arrangements."
    },
    rewards: {
      id: "ff-rewards",
      title: "Rewards",
      icon: Sparkles,
      list: XP_REWARDS,
      note: "Register your interest and show us you're worth it."
    }
  };

  function HomeBookingTiles({ only }) {
    const nav = useHomeNav();
    const s = SETS[only];
    return React.createElement("section", {
      className: "ff-sect ff-bt17 ff-bt18 one ff-whitebox",
      id: only === "training" ? "ff-booktiles" : `ff-booktiles-${only}`,
      "aria-label": s.title
    }, React.createElement("div", {
      className: "ff-bt18-grid"
    }, React.createElement(SwipeCarousel, {
      section: only,
      title: s.title,
      note: s.note,
      icon: s.icon,
      items: s.list,
      onOpen: () => nav.goBookings(s.id)
    })));
  }

  function CreateServiceCard() {
    return React.createElement("div", {
      className: "ff-nx-create",
      role: "img",
      "aria-label": "Create your own Service Card - coming in 2027"
    }, React.createElement("span", {
      className: "plus"
    }, React.createElement(Plus, {
      size: 30,
      strokeWidth: 2
    })), React.createElement("b", null, "Create your own Service Card"), React.createElement("small", null, "Your own package, your way."), React.createElement("span", {
      className: "ff-soonbadge sm"
    }, React.createElement(Lock, {
      size: 10,
      strokeWidth: 2.4
    }), " Coming 2027"));
  }

  function CreateCocktailCard() {
    return React.createElement("div", {
      className: "ff-nx-create ck",
      role: "img",
      "aria-label": "Create your own Signature Cocktail - coming in 2027"
    }, React.createElement("span", {
      className: "ribbon"
    }, "Signature Cocktail"), React.createElement("span", {
      className: "plus"
    }, React.createElement(Plus, {
      size: 30,
      strokeWidth: 2
    })), React.createElement("b", null, "Create your own Signature Cocktail"), React.createElement("small", null, "Only on your profile - people order it when they book you."), React.createElement("span", {
      className: "ff-soonbadge sm"
    }, React.createElement(Lock, {
      size: 10,
      strokeWidth: 2.4
    }), " Coming 2027"));
  }

  function NextModule({ id, icon: Icon, title, children, cards }) {
    return React.createElement("section", {
      className: "ff-nx-mod",
      "aria-labelledby": `${id}-h`
    }, React.createElement("header", {
      className: "ff-nx-head"
    }, React.createElement("span", {
      className: "ico",
      "aria-hidden": "true"
    }, React.createElement(Icon, {
      size: 18,
      strokeWidth: 1.6
    })), React.createElement("h3", {
      id: `${id}-h`
    }, title), React.createElement("span", {
      className: "ff-soonbadge sm"
    }, React.createElement(Lock, {
      size: 10,
      strokeWidth: 2.4
    }), " Coming 2027")), children && React.createElement("div", {
      className: "ff-nx-txt"
    }, children), React.createElement(HScroll, {
      label: title,
      snap: true
    }, cards));
  }

  const HOME_JOBS = [
    { id: "bartending", tone: "bronze", level: "Bronze", title: "Bartending Package", meta: "\xA3100 \xB7 3 hours", reqs: ["Basic equipment", "Be professional", "Able to work solo"] },
    { id: "mixology", tone: "silver", level: "Silver", title: "Mixology Package", reqs: ["Write a cocktail menu", "Follow a cocktail menu", "Your own cocktail kit"] },
    { id: "flair", tone: "gold", level: "Flair", title: "Flair Package", reqs: ["Do some flair"] },
    { id: "staff", tone: "white", level: "Staffing", title: "Staffing Service", reqs: ["Able to work solo", "Communicate with businesses and clients"] }
  ];

  const JOBS_CSS = __ff_css("styles/jobs.css");

  function HomeJobCard({ j }) {
    return /* @__PURE__ */ React.createElement("article", { className: `ff-job ${j.tone}` }, /* @__PURE__ */ React.createElement("span", { className: "lv" }, j.level), /* @__PURE__ */ React.createElement("h3", null, j.title), j.meta && /* @__PURE__ */ React.createElement("p", { className: "mt" }, j.meta), /* @__PURE__ */ React.createElement("ul", null, j.reqs.map((r) => /* @__PURE__ */ React.createElement("li", { key: r }, r))));
  }

  function HomeComingSoon() {
    return /* @__PURE__ */ React.createElement("section", { className: "ff-sect ff-nx", id: "ff-coming", "aria-labelledby": "ff-nx-h" }, /* @__PURE__ */ React.createElement("style", null, JOBS_CSS), /* @__PURE__ */ React.createElement("h2", { id: "ff-nx-h", className: "ff-h1" }, "Services"), /* @__PURE__ */ React.createElement("p", { className: "ff-nx-lede" }, "Service Cards are the services you offer on FF Party, and what it takes to get the job. Coming 2027."), /* @__PURE__ */ React.createElement(NextModule, { id: "ff-nx-svc", icon: Sparkles, title: "Service Cards", cards: HOME_JOBS.map((j) => /* @__PURE__ */ React.createElement("div", { key: j.id, className: "ff-nx-cell", style: { width: 232 } }, /* @__PURE__ */ React.createElement(HomeJobCard, { j }))) }), /* @__PURE__ */ React.createElement(NextModule, { id: "ff-nx-ck", icon: Martini, title: "Signature Cocktails", cards: [
      ...COCKTAIL_CARDS.map((c) => /* @__PURE__ */ React.createElement("img", { decoding: "async", key: c.name, className: "ff-nx-ck", src: c.img, alt: `${c.name} - FireFlair classic cocktail card`, loading: "eager", draggable: false })),
      /* @__PURE__ */ React.createElement("div", { key: "create", className: "ff-nx-ck" }, /* @__PURE__ */ React.createElement(CreateCocktailCard, null))
    ] }, /* @__PURE__ */ React.createElement("p", null, "Build a library of your signature cocktails and they travel with you."), /* @__PURE__ */ React.createElement("p", { className: "em" }, "People can book you for your best cocktails, advertised right here on FireFlair.")));
  }

  const COIN_SRC = (window.FF_IMG || {}).coin_gold;

  function useCoinSpin(ref) {
    useEffect(() => {
      const root = ref.current;
      if (!root)
        return;
      let stopped = false;
      let raf = 0;
      let idle;
      const offset = new WeakMap;
      let list = [];
      const coins = () => {
        if (!list.length || list.some((el) => !el.isConnected) || root.querySelectorAll(".ff-coin3d .spin").length !== list.length)
          list = Array.from(root.querySelectorAll(".ff-coin3d .spin"));
        return list;
      };
      const nearCoins = () => {
        const vh = window.innerHeight || 800;
        const out = [];
        for (const el of coins()) {
          const r = (el.parentElement ?? el).getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200)
            continue;
          const fromCentre = r.top + r.height / 2 - vh / 2;
          out.push({ el, a: fromCentre * 360 / (vh * 1.5) + (offset.get(el) ?? 0) });
        }
        return out;
      };
      const safely = (fn) => {
        if (stopped)
          return;
        try {
          fn();
        } catch {
          stop();
        }
      };
      const write = () => safely(() => {
        raf = 0;
        for (const { el, a } of nearCoins()) {
          el.style.transition = "none";
          el.style.transform = `rotateY(${a.toFixed(1)}deg)`;
        }
      });
      const settle = () => safely(() => {
        for (const { el, a } of nearCoins()) {
          const face = Math.round(a / 360) * 360;
          offset.set(el, (offset.get(el) ?? 0) + face - a);
          el.style.transition = "transform 1.4s cubic-bezier(.22,.7,.2,1)";
          el.style.transform = `rotateY(${face}deg)`;
        }
      });
      const onScroll = () => {
        if (!raf)
          raf = requestAnimationFrame(write);
        window.clearTimeout(idle);
        idle = window.setTimeout(settle, 220);
      };
      const stop = () => {
        stopped = true;
        document.removeEventListener("scroll", onScroll, { capture: true });
        window.removeEventListener("resize", onScroll);
        window.clearTimeout(idle);
        if (raf)
          cancelAnimationFrame(raf);
      };
      const cancelStart = afterLoad(() => safely(() => {
        document.addEventListener("scroll", onScroll, { capture: true, passive: true });
        window.addEventListener("resize", onScroll);
      }));
      return () => {
        cancelStart();
        stop();
      };
    }, [ref]);
  }

  function afterLoad(fn) {
    let handle;
    let cancelled = false;
    const idle = () => {
      if (cancelled)
        return;
      const w = window;
      handle = w.requestIdleCallback ? w.requestIdleCallback(fn, { timeout: 2000 }) : window.setTimeout(fn, 300);
    };
    if (document.readyState !== "loading")
      idle();
    else {
      document.addEventListener("DOMContentLoaded", idle, { once: true });
      window.addEventListener("load", idle, { once: true });
    }
    return () => {
      cancelled = true;
      window.removeEventListener("load", idle);
      const w = window;
      if (handle !== undefined)
        (w.cancelIdleCallback ?? window.clearTimeout)(handle);
    };
  }

  function useGameReady(box) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
      const el = box.current;
      if (!el || typeof IntersectionObserver === "undefined")
        return;
      const conn = navigator.connection;
      if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? ""))
        return;
      let near = false;
      let loaded = false;
      const check = () => near && loaded && setReady(true);
      const io = new IntersectionObserver(([e]) => {
        if (e?.isIntersecting) {
          near = true;
          io.disconnect();
          check();
        }
      }, { rootMargin: "600px 0px" });
      io.observe(el);
      const cancel = afterLoad(() => {
        loaded = true;
        check();
      });
      return () => {
        io.disconnect();
        cancel();
      };
    }, [box]);
    return ready;
  }

  const EDGE = [-2.5, -2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2, 2.5];

  function CoinDivider() {
    return React.createElement("div", {
      className: "ff-coindiv",
      "aria-hidden": "true"
    }, React.createElement("i", {
      className: "ln"
    }), React.createElement("span", {
      className: "ff-coin3d"
    }, React.createElement("span", {
      className: "spin"
    }, EDGE.map((z) => React.createElement("span", {
      key: z,
      className: "edge",
      style: { transform: `translateZ(${z}px)` }
    })), React.createElement("img", { decoding: "async",
      className: "face front",
      src: COIN_SRC,
      alt: "",
      draggable: false,
      loading: "eager",
      decoding: "async"
    }), React.createElement("img", { decoding: "async",
      className: "face back",
      src: COIN_SRC,
      alt: "",
      draggable: false,
      loading: "eager",
      decoding: "async"
    }))), React.createElement("i", {
      className: "ln"
    }));
  }

  function HomeJoin() {
    const { state } = useStore();
    const nav = useHomeNav();
    const member = state.auth && state.auth.status === "signedIn";
    const box = useRef(null);
    const game = useGameReady(box);
    return React.createElement("section", {
      className: "ff-sect ff-join",
      "aria-labelledby": "ff-join-h"
    }, React.createElement("div", {
      className: "ff-join-box ff-game",
      ref: box
    }, React.createElement("div", {
      className: "ff-join-in"
    }, React.createElement(Coin, {
      size: 56,
      tier: "gold"
    }), React.createElement("h2", {
      id: "ff-join-h",
      className: "ff-join-h"
    }, member ? "Your FireFlair" : "Join FF Team"), React.createElement("p", {
      className: "ff-join-t"
    }, "Your online profile, so we can get you booked."), React.createElement(ShineButton, {
      onClick: nav.goProfile
    }, React.createElement(User, {
      size: 15
    }), " ", member ? "My Profile Card" : "Join now")), game && React.createElement(QuietBoundary, null, React.createElement(Suspense, {
      fallback: null
    }, React.createElement(CoinDrop, {
      area: box
    })))));
  }

  const DROP_COINS = 16;

  const DROP_SRC = [(window.FF_IMG || {}).coin_gold, (window.FF_IMG || {}).coin_silver, FF_VIP_LOGO];

  const BIN_POINTS = [5, 10, 15, 20];

  const GRAVITY = 0.55;

  const BOUNCE_LIMIT = 5;

  const MAX_PULL = 110;

  function machine(w, h) {
    const hopper = Math.max(100, Math.min(150, w * 0.3));
    const wall = 8;
    const bx = w - hopper - wall;
    const btop = h - Math.min(h * 0.46, 210);
    const R = Math.min(hopper + 60, h * 0.45);
    return { hopper, wall, bx, btop, R, cx: w - R, cy: R, binW: bx / 4, divTop: h - 88 };
  }

  function hitRect(c, x0, y0, x1, y1, e) {
    const px = Math.max(x0, Math.min(c.x, x1));
    const py = Math.max(y0, Math.min(c.y, y1));
    let nx = c.x - px;
    let ny = c.y - py;
    const d = Math.hypot(nx, ny);
    if (d >= c.r)
      return;
    if (d > 0) {
      nx /= d;
      ny /= d;
      c.x = px + nx * c.r;
      c.y = py + ny * c.r;
    } else {
      const top = c.y - y0;
      const left = c.x - x0;
      const right = x1 - c.x;
      if (top <= left && top <= right)
        [nx, ny, c.y] = [0, -1, y0 - c.r];
      else if (left < right)
        [nx, ny, c.x] = [-1, 0, x0 - c.r];
      else
        [nx, ny, c.x] = [1, 0, x1 + c.r];
    }
    const vn = c.vx * nx + c.vy * ny;
    if (vn < 0) {
      const settled = c.n >= BOUNCE_LIMIT;
      if (-vn > 0.8)
        c.n++;
      const k = settled ? 0 : e;
      c.vx -= (1 + k) * vn * nx;
      c.vy -= (1 + k) * vn * ny;
      if (settled) {
        c.vx *= 0.6;
        c.va *= 0.6;
      }
    }
  }

  const isControl = (t) => t instanceof Element && !!t.closest("button, a");

  function CoinDrop({ area }) {
    const stage = useRef(null);
    const els = useRef([]);
    const labels = useRef([]);
    const api = useRef(null);
    const [size, setSize] = useState({ w: 360, h: 520 });
    useLayoutEffect(() => {
      const box = stage.current;
      if (!box)
        return;
      const read = () => setSize({ w: box.clientWidth, h: box.clientHeight });
      read();
      const ro = new ResizeObserver(read);
      ro.observe(box);
      return () => ro.disconnect();
    }, []);
    useEffect(() => {
      const box = stage.current;
      const zone = area.current;
      if (!box || !zone)
        return;
      let w = box.clientWidth;
      let h = box.clientHeight;
      let m = machine(w, h);
      let raf = 0;
      let pull = 0;
      let lastLaunch = 0;
      const place = (dropIn = false) => {
        const left = m.bx + m.wall;
        const perRow = Math.max(2, Math.floor(m.hopper / 32));
        const gap = m.hopper / perRow;
        return Array.from({ length: DROP_COINS }, (_, k) => {
          const r = 14 + k % 3 * 2;
          const row = Math.floor(k / perRow);
          const col = k % perRow;
          return {
            x: left + gap * col + gap / 2 + (row % 2 ? 3 : -3),
            y: h - r - row * 26 - (dropIn ? m.btop * 0.6 + k * 9 : 0),
            n: 0,
            cd: 0,
            vx: 0,
            vy: 0,
            a: k * 47 % 360,
            va: dropIn ? k % 2 ? 6 : -6 : 0,
            r,
            flying: false,
            bin: null
          };
        });
      };
      let coins = place();
      const draw = () => {
        coins.forEach((c, k) => {
          const el = els.current[k];
          if (!el)
            return;
          el.style.width = el.style.height = `${c.r * 2}px`;
          el.style.transform = `translate(${(c.x - c.r).toFixed(1)}px, ${(c.y - c.r).toFixed(1)}px) rotate(${c.a.toFixed(1)}deg)`;
        });
      };
      const flash = (bin) => {
        const el = labels.current[bin];
        if (!el)
          return;
        el.classList.remove("hit");
        el.offsetWidth;
        el.classList.add("hit");
      };
      const step = () => {
        let moving = pull > 0;
        for (const c of coins) {
          c.vy += GRAVITY;
          c.x += c.vx;
          c.y += c.vy;
          c.a += c.va;
          c.va *= 0.99;
          if (c.cd > 0)
            c.cd--;
          if (c.x > m.cx && c.y < m.cy) {
            const dx = c.x - m.cx;
            const dy = c.y - m.cy;
            const d = Math.hypot(dx, dy);
            const lim = m.R - c.r;
            if (d > lim) {
              const nx = dx / d;
              const ny = dy / d;
              c.x = m.cx + nx * lim;
              c.y = m.cy + ny * lim;
              const vn = c.vx * nx + c.vy * ny;
              if (vn > 0) {
                const k = c.n >= BOUNCE_LIMIT ? 1 : 1.8;
                if (vn > 0.8)
                  c.n++;
                c.vx -= k * vn * nx;
                c.vy -= k * vn * ny;
              }
            }
          } else if (c.y < c.r) {
            c.y = c.r;
            if (c.vy < 0) {
              if (c.n >= BOUNCE_LIMIT)
                c.vy = 0;
              else {
                c.vy = -c.vy * 0.5;
                if (c.vy > 0.4)
                  c.n++;
              }
            }
          }
          const wallBounce = (dir) => {
            if (Math.abs(c.vx) > 0.8 && c.n < BOUNCE_LIMIT) {
              c.vx = dir * Math.abs(c.vx) * 0.5;
              c.n++;
            } else
              c.vx = 0;
          };
          if (c.x < c.r) {
            c.x = c.r;
            wallBounce(1);
          }
          if (c.x > w - c.r) {
            c.x = w - c.r;
            wallBounce(-1);
          }
          if (c.y > h - c.r) {
            c.y = h - c.r;
            if (Math.abs(c.vy) > 1.4 && c.n < BOUNCE_LIMIT) {
              c.vy = -c.vy * 0.3;
              c.n++;
            } else
              c.vy = 0;
            c.vx *= 0.8;
            c.va *= 0.8;
          }
          hitRect(c, m.bx, m.btop, m.bx + m.wall, h, 0.35);
          for (let k = 1;k < 4; k++)
            hitRect(c, m.binW * k - 2, m.divTop, m.binW * k + 2, h, 0.2);
          if (c.flying && c.x < m.bx && c.y > m.divTop - c.r * 0.5 && c.vy >= 0) {
            c.flying = false;
            c.bin = Math.max(0, Math.min(3, Math.floor(c.x / m.binW)));
            flash(c.bin);
          }
          if (c.bin !== null && c.y > m.divTop) {
            c.vx *= 0.7;
            c.va *= 0.7;
          }
          if (c.flying && c.x > m.bx + m.wall && c.y > m.btop && c.vy >= 0)
            c.flying = false;
          if (Math.abs(c.vx) > 0.04 || Math.abs(c.vy) > 0.04 || Math.abs(c.va) > 0.08)
            moving = true;
        }
        for (let i = 0;i < coins.length; i++) {
          for (let j = i + 1;j < coins.length; j++) {
            const a = coins[i];
            const b = coins[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const min = (a.r + b.r) * 0.92;
            const d2 = dx * dx + dy * dy;
            if (d2 > 0 && d2 < min * min) {
              const d = Math.sqrt(d2);
              const push = (min - d) / 2;
              const nx = dx / d;
              const ny = dy / d;
              for (const q of [a, b]) {
                if (q.n >= BOUNCE_LIMIT) {
                  q.vx *= 0.5;
                  q.vy *= 0.5;
                  q.va *= 0.5;
                } else if (q.cd <= 0 && Math.hypot(q.vx, q.vy) > 1.5) {
                  q.n++;
                  q.cd = 10;
                }
              }
              a.x -= nx * push;
              a.y -= ny * push;
              b.x += nx * push;
              b.y += ny * push;
            }
          }
        }
        for (const c of coins) {
          c.x = Math.max(c.r, Math.min(w - c.r, c.x));
          if (c.bin === null && !c.flying)
            c.x = Math.max(m.bx + m.wall + c.r, c.x);
          c.y = Math.min(h - c.r, c.y);
          hitRect(c, m.bx, m.btop, m.bx + m.wall, h, 0);
          for (let k = 1;k < 4; k++)
            hitRect(c, m.binW * k - 2, m.divTop, m.binW * k + 2, h, 0);
        }
        draw();
        raf = moving ? requestAnimationFrame(step) : 0;
      };
      const run = () => {
        if (!raf)
          raf = requestAnimationFrame(step);
      };
      const launch = (strength) => {
        const now = performance.now();
        if (now - lastLaunch < 420)
          return;
        lastLaunch = now;
        const inBox = coins.filter((c) => c.bin === null && c.x > m.bx + m.wall).sort((a, b) => a.y - b.y);
        const n = Math.min(inBox.length, 2 + (Math.random() < 0.45 ? 1 : 0));
        const base = Math.sqrt(2 * GRAVITY * h * 0.82);
        inBox.forEach((c) => {
          c.n = 0;
          c.cd = 0;
        });
        inBox.slice(0, n).forEach((c) => {
          c.vy = -base * strength * (0.74 + Math.random() * 0.42);
          c.vx = -Math.random() * 1.4;
          c.va = (Math.random() - 0.5) * 26;
          c.flying = true;
        });
        inBox.slice(n).forEach((c) => {
          c.vy -= 1.2 + Math.random() * 1.6;
          c.va += (Math.random() - 0.5) * 8;
        });
        run();
      };
      api.current = {
        reset: () => {
          coins = place(true);
          run();
        }
      };
      draw();
      const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      const setPull = (v, spring = false) => {
        pull = Math.max(0, Math.min(MAX_PULL, v));
        const el = zone;
        el.style.transition = spring ? "transform .55s cubic-bezier(.34,1.56,.64,1)" : "none";
        el.style.transform = `translateY(${-pull}px)`;
      };
      let release;
      const letGo = () => {
        if (pull > 20)
          launch(Math.min(1.25, 0.9 + pull / 300));
        setPull(0, true);
      };
      const flickStrength = (dy, ms) => dy > 12 ? Math.max(0.85, Math.min(1.3, 0.85 + dy / Math.max(16, ms) * 0.3)) : 1;
      let lastY = 0;
      let flick = null;
      const onStart = (e) => {
        lastY = e.touches[0].clientY;
        flick = zone.contains(e.target) && !isControl(e.target) ? { y: lastY, t: performance.now() } : null;
      };
      const onMove = (e) => {
        const y = e.touches[0].clientY;
        const dy = lastY - y;
        lastY = y;
        if (!atBottom() || dy <= 0 && pull === 0)
          return;
        setPull(pull + dy * 0.5);
      };
      const onEnd = () => {
        if (flick && flick.y - lastY > -12)
          launch(flickStrength(flick.y - lastY, performance.now() - flick.t));
        flick = null;
        letGo();
      };
      const onWheel = (e) => {
        if (e.deltaY <= 0 || !atBottom())
          return;
        setPull(pull + e.deltaY * 0.2);
        window.clearTimeout(release);
        release = window.setTimeout(letGo, 140);
      };
      let down = null;
      const onDown = (e) => {
        if (e.pointerType !== "touch" && !isControl(e.target))
          down = { y: e.clientY, t: performance.now() };
      };
      const onUp = (e) => {
        if (!down || e.pointerType === "touch")
          return;
        launch(flickStrength(down.y - e.clientY, performance.now() - down.t));
        down = null;
      };
      const onResize = () => {
        const nw = box.clientWidth;
        const nh = box.clientHeight;
        if (nw === w && nh === h)
          return;
        for (const c of coins) {
          c.x *= nw / w;
          c.y = nh - (h - c.y);
        }
        w = nw;
        h = nh;
        m = machine(w, h);
        run();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(box);
      const html = document.documentElement;
      const before = [html.style.overscrollBehaviorY, document.body.style.overscrollBehaviorY];
      html.style.overscrollBehaviorY = "none";
      document.body.style.overscrollBehaviorY = "none";
      window.addEventListener("touchstart", onStart, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onEnd, { passive: true });
      window.addEventListener("touchcancel", onEnd, { passive: true });
      window.addEventListener("wheel", onWheel, { passive: true });
      zone.addEventListener("pointerdown", onDown);
      zone.addEventListener("pointerup", onUp);
      return () => {
        html.style.overscrollBehaviorY = before[0];
        document.body.style.overscrollBehaviorY = before[1];
        window.removeEventListener("touchstart", onStart);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onEnd);
        window.removeEventListener("touchcancel", onEnd);
        window.removeEventListener("wheel", onWheel);
        zone.removeEventListener("pointerdown", onDown);
        zone.removeEventListener("pointerup", onUp);
        ro.disconnect();
        window.clearTimeout(release);
        if (raf)
          cancelAnimationFrame(raf);
        api.current = null;
      };
    }, [area]);
    const m = machine(size.w, size.h);
    const curve = `M ${m.cx.toFixed(1)} 2 A ${(m.R - 2).toFixed(1)} ${(m.R - 2).toFixed(1)} 0 0 1 ${(size.w - 2).toFixed(1)} ${m.cy.toFixed(1)}`;
    return React.createElement(React.Fragment, null, React.createElement("div", {
      className: "ff-drop",
      "aria-hidden": "true"
    }, React.createElement("div", {
      className: "ff-drop-stage",
      ref: stage
    }, React.createElement("svg", {
      className: "ff-drop-art",
      width: size.w,
      height: size.h,
      viewBox: `0 0 ${size.w} ${size.h}`
    }, React.createElement("path", {
      d: curve,
      className: "curve"
    }), BIN_POINTS.map((_, k) => React.createElement("rect", {
      key: k,
      x: m.binW * k + 3,
      y: m.divTop,
      width: m.binW - 6,
      height: size.h - m.divTop,
      rx: "5",
      className: "bin"
    })), [1, 2, 3].map((k) => React.createElement("rect", {
      key: k,
      x: m.binW * k - 2,
      y: m.divTop,
      width: "4",
      height: size.h - m.divTop,
      rx: "2",
      className: "divider"
    })), React.createElement("rect", {
      x: m.bx,
      y: m.btop,
      width: m.wall,
      height: size.h - m.btop,
      rx: "3",
      className: "barrier"
    }), React.createElement("rect", {
      x: m.bx + m.wall,
      y: m.btop,
      width: m.hopper,
      height: size.h - m.btop,
      className: "hopper"
    }), React.createElement("g", {
      className: "nudge",
      transform: `translate(${m.bx + m.wall + m.hopper / 2} ${m.btop - 22})`
    }, React.createElement("path", {
      d: "M-9 6 0 -3 9 6"
    }), React.createElement("path", {
      d: "M-9 14 0 5 9 14"
    }))), Array.from({ length: DROP_COINS }, (_, k) => React.createElement("img", { decoding: "async",
      key: k,
      ref: (el) => {
        els.current[k] = el;
      },
      className: "ff-drop-coin",
      src: DROP_SRC[k % DROP_SRC.length],
      alt: "",
      draggable: false
    }))), React.createElement("div", {
      className: "ff-drop-points"
    }, BIN_POINTS.map((p, k) => React.createElement("span", {
      key: p,
      ref: (el) => {
        labels.current[k] = el;
      },
      style: { left: `${(m.binW * k + m.binW / 2) / size.w * 100}%` }
    }, p)))), React.createElement("button", {
      type: "button",
      className: "ff-drop-reset",
      onClick: () => api.current?.reset(),
      "aria-label": "Put the coins back in the box",
      title: "Reset"
    }, React.createElement(RotateCcw, {
      size: 16,
      strokeWidth: 2.4,
      "aria-hidden": "true"
    })));
  }

  function HomeSearch() {
    const { dispatch } = useStore();
    const nav = useHomeNav();
    const [val, setVal] = useState("");
    const submit = () => {
      dispatch({ type: "NET_QUERY", q: val.trim() });
      nav.goNetwork();
    };
    return React.createElement("form", {
      className: "ff-frame ff-ai ff-ffai-tint hero bare ff-hero-search",
      role: "search",
      onSubmit: (e) => {
        e.preventDefault();
        submit();
      }
    }, React.createElement("div", {
      className: "ff-ai-row",
      style: { alignItems: "center" }
    }, React.createElement("span", {
      className: "ff-ai-tag",
      "aria-hidden": "true"
    }, React.createElement(Coin, {
      size: 20,
      tier: "gold"
    })), React.createElement("input", {
      type: "search",
      className: "ff-input ff-ai-in min-w-0 flex-1",
      "aria-label": "Search FireFlair",
      placeholder: "Search people, skills, locations…",
      value: val,
      onChange: (e) => setVal(e.target.value)
    }), React.createElement("button", {
      type: "submit",
      className: "ff-ai-send",
      "aria-label": "Search",
      title: "Search"
    }, React.createElement(Search, {
      size: 16,
      strokeWidth: 2
    }))));
  }

  function HomeHero101() {
    const { state } = useStore();
    const nav = useHomeNav();
    const mine = state.role === "team" && state.profile.live;
    return React.createElement("section", {
      className: "ff-hero18",
      "aria-labelledby": "ff-hero17-h",
      id: "ff-hero"
    }, React.createElement("div", {
      className: "ff-hero18-img"
    }, IMGS.hero ? React.createElement("img", { decoding: "async",
      className: "ff-hero18-photo",
      src: IMGS.hero,
      srcSet: IMGS.hero_sm ? `${IMGS.hero_sm} 900w, ${IMGS.hero} 1800w` : undefined,
      sizes: "(min-width:900px) 760px, 100vw",
      alt: "",
      decoding: "async"
    }) : React.createElement(HomeScene, {
      kind: "bar"
    }), React.createElement("div", {
      className: "ff-hero18-fade",
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "ff-hero18-shadow",
      "aria-hidden": "true"
    }), React.createElement("span", {
      className: "ff-hero18-coin refl",
      "aria-hidden": "true"
    }, React.createElement(SiteHeroCoin, { site: "team" })), React.createElement("span", {
      className: "ff-hero18-coin ff-hero17-coin"
    }, React.createElement(SiteHeroCoin, { site: "team" }))), React.createElement("div", {
      className: "ff-hero18-in"
    }, React.createElement("h1", {
      id: "ff-hero17-h",
      className: "ff-hero17-h ff-hero-h101"
    }, "Welcome to FF Team"), React.createElement("p", {
      className: "ff-hero-sub101"
    }, "Get seen. Get booked."), React.createElement("div", {
      className: "ff-hero17-cta"
    }, mine ? React.createElement(ShineButton, { onClick: nav.goNetwork }, React.createElement(Users, { size: 15 }), " Build your network") : React.createElement(ShineButton, { onClick: nav.goProfile }, React.createElement(User, { size: 15 }), " Create your Profile Card")), React.createElement("div", {
      className: "ff-hero17-ai"
    }, React.createElement(HomeSearch, null))));
  }

  function WelcomeBack101() {
    const { state, dispatch } = useStore();
    const shown = CARD_CATEGORIES.reduce((n, k) => n + featuredCount(state.profile, k), 0);
    const netCount = myNetwork(state, state.directory).list.length;
    const myReviews = (state.reviews || []).filter((r) => r.aboutId === "me").length;
    const first = (state.profile.name || "").trim().split(" ")[0];
    return React.createElement("div", {
      className: "ff-frame ff-welcome17",
      style: { padding: 14 }
    }, React.createElement(Corners, null), React.createElement("h2", {
      className: "ff-h2",
      style: { margin: "0 0 10px" }
    }, `Welcome back${first ? `, ${first}` : ""}`), React.createElement("div", {
      style: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }
    }, [["On card", shown, "profile"], ["Network", netCount, "network"], ["Reviews", myReviews, "profile"]].map(([l, v, tab]) => React.createElement("button", {
      key: l,
      className: "ff-frame",
      style: { padding: "10px 12px", textAlign: "left" },
      onClick: () => {
        dispatch({ type: "TAB", tab, route: "home" });
        window.scrollTo(0, 0);
      }
    }, React.createElement("div", {
      className: "ff-display",
      style: { fontSize: 22 }
    }, v), React.createElement("div", {
      className: "ff-label"
    }, l)))));
  }
