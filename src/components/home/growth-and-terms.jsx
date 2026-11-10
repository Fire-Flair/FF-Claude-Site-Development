/* src/components/home/growth-and-terms.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  const GE17 = [
    { n: "Athens Bar Show", d: "2 to 5 November 2026", w: "Athens, Greece", t: "Four days for the bar industry, held at Technopolis City of Athens." },
    { n: "BCB London", d: "10 and 11 May 2027", w: "Tobacco Dock, London", t: "Bar Convent London at Tobacco Dock, bringing the drinks trade together for two days." },
    { n: "Bar Convent Berlin", d: "4 and 5 October 2027", w: "Exhibition Centre Berlin", t: "Bar Convent Berlin, the international bar trade event, held at the Exhibition Centre Berlin." }
  ];

  function GrowthEvents17() {
    return React.createElement("section", {
      className: "ff-sect ff-ge17",
      id: "ff-barshows",
      "aria-labelledby": "ff-ge-h"
    }, React.createElement("h2", {
      id: "ff-ge-h",
      className: "ff-h1"
    }, "Growth events"), React.createElement("p", {
      className: "ff-ge17-sub"
    }, "Hospitality industry events across Europe, where the trade learns, meets and grows."), React.createElement("ul", {
      className: "ff-ge17-row"
    }, GE17.map((e) => React.createElement("li", {
      key: e.n
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(V17I.CalendarDays, {
      size: 20,
      strokeWidth: 1.7
    })), React.createElement("b", null, e.n), React.createElement("em", null, e.d), React.createElement("small", null, React.createElement(V17I.MapPin, {
      size: 12
    }), " ", e.w), React.createElement("p", null, e.t)))));
  }

  function Terms17() {
    const pts = [
      { ic: "ShieldCheck", t: "Set by the business", d: "Every Event Card carries the terms of whoever is booking you: times, breaks, dress code and what happens if plans change." },
      { ic: "MessageSquare", t: "In plain words", d: "Terms are short, clear points rather than pages of small print, so you know what you are agreeing to at a glance." },
      { ic: "CheckCircle2", t: "Agreed before you reply", d: "You see the terms before you accept on WhatsApp, and your confirmation is the agreement. Nothing is hidden." }
    ];
    return React.createElement("section", {
      className: "ff-sect ff-ge17",
      id: "ff-terms",
      "aria-labelledby": "ff-tc-h"
    }, React.createElement("h2", {
      id: "ff-tc-h",
      className: "ff-h1"
    }, "How terms and conditions work"), React.createElement("ul", {
      className: "ff-ge17-row"
    }, pts.map((p) => {
      const I = V17I[p.ic];
      return React.createElement("li", {
        key: p.t
      }, React.createElement("span", {
        className: "ic"
      }, React.createElement(I, {
        size: 20,
        strokeWidth: 1.7
      })), React.createElement("b", null, p.t), React.createElement("p", null, p.d));
    })));
  }

  function HomeTeam11() {
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
    }, "Work with friends.")), React.createElement("p", {
      className: "ff-tm11-t"
    }, "Everyone you add to your network is on your team. It shows on your profile, so the people who book you can see who you work with."), React.createElement("ol", {
      className: "ff-tm-flow",
      "aria-label": "From your Profile Card, to your team, to a live event"
    }, React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(InertBox, {
      className: "ff-tm-minis"
    }, trio.slice(0, 1).map((p) => React.createElement("div", {
      key: p.id,
      className: "ff-tm-mini solo"
    }, React.createElement(PlayerCard, {
      person: p
    })))), React.createElement("b", null, "Your Profile Card"), React.createElement("small", null, "Show who you are")), React.createElement("li", {
      className: "ff-tm-arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 20
    })), React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(InertBox, {
      className: "ff-tm-minis"
    }, crew.map((p) => React.createElement("div", {
      key: p.id,
      className: "ff-tm-mini"
    }, React.createElement(PlayerCard, {
      person: p
    })))), React.createElement("b", null, "Your team"), React.createElement("small", null, "Everyone in your network")), React.createElement("li", {
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

  function GuideQuestions11({ kind = "team" }) {
    const nav = useHomeNav();
    const hire = useHireNav();
    const goSite = useGoSite();
    const [pick, setPick] = useState({});
    const sec = (id) => () => scrollToSection(id);
    const A = {
      team: {
        profile: ["Create your Profile Card", () => nav.goProfile()],
        network: ["Explore the network", () => nav.goNetwork()],
        career: ["See Career Support", sec("ff-career")],
        party: ["Visit FF Party", () => goSite("party")],
        biz: ["Visit FF Staff", () => goSite("staff")]
      },
      staff: {
        company: ["Create your Company Card", () => hire.toProfile()],
        event: ["Choose your team", () => hire.toEvent()],
        network: ["Explore the network", () => hire.toNetwork("")],
        team: ["Visit FF Team", () => goSite("team")],
        party: ["Visit FF Party", () => goSite("party")]
      },
      party: {
        plan: ["Plan your event", () => hire.toEvent()],
        offer: ["See what we offer", sec("ff-offer")],
        cocktails: ["Choose your cocktails", sec("ff-cocktails")],
        companies: ["See bar companies", sec("ff-companies")],
        network: ["Explore the network", () => hire.toNetwork("")],
        team: ["Visit FF Team", () => goSite("team")]
      }
    }[kind];
    const Q = {
      team: [
        { q: "Do you work in hospitality?", a: [
          { l: "Yes, it's my career", r: "Then FireFlair is built for you. Make a Profile Card with your skills, experience and reviews, and businesses can find you and book you.", c: A.profile },
          { l: "Not yet, but I'd like to", r: "Start with Career Support. Training, Dream Jobs and rewards will help you take your first steps.", c: A.career },
          { l: "No, I'm here for something else", r: "If you are planning a party of your own, FF Party is the place to start.", c: A.party }
        ] },
        { q: "Do you work events, or would you like to?", a: [
          { l: "Yes, I work events", r: "Put your event experience and the venues you work at on your profile, and ask the people you work with for reviews.", c: A.profile },
          { l: "I'm full time, but could pick up a shift now and then", r: "Make a Profile Card and answer availability for the dates you can do. Businesses can book you around your main job.", c: A.profile },
          { l: "I run a hospitality business", r: "FF Staff is where companies hire staff and advertise their services for free.", c: A.biz }
        ] },
        { q: "What would help you most right now?", a: [
          { l: "Getting booked", r: "Share your Profile Card and answer availability, so businesses can book you in a tap.", c: A.profile },
          { l: "Growing my network", r: "Add the people you work with. They become your team, and every review they give you counts.", c: A.network },
          { l: "Learning new skills", r: "Career Support brings training and standards together in one place.", c: A.career }
        ] }
      ],
      staff: [
        { q: "Do you hire hospitality staff for your business?", a: [
          { l: "Yes, regularly", r: "Make your Company Card once. It goes to everyone you hire and advertises your business on FF Party.", c: A.company },
          { l: "Just for one event", r: "Create an Event Card, add the roles you need and choose your staff. Everyone is asked on WhatsApp.", c: A.event },
          { l: "I'm a professional looking for work", r: "FF Team is where professionals build the Profile Cards that businesses book.", c: A.team }
        ] },
        { q: "Do you have an event coming up?", a: [
          { l: "Yes", r: "Start with the date, time and place. Then add shift details and choose your people.", c: A.event },
          { l: "Not yet", r: "Browse the network and see who is available. You can keep favourites for next time.", c: A.network }
        ] },
        { q: "Are you looking to get more bookings in 2027?", a: [
          { l: "Yes, I want more bookings", r: "Put your Company Card on FF Party, with your services, team and reviews, so people planning events can find and book you.", c: A.company },
          { l: "I need more staff, not more bookings", r: "Browse the network and book the people you can trust for your shifts.", c: A.network },
          { l: "Both", r: "Start with your Company Card, then build your team from the network.", c: A.company }
        ] }
      ],
      party: [
        { q: "Are you planning an event?", a: [
          { l: "Yes", r: "Start with your event: date, place, private or corporate, and the number of guests. It takes about a minute.", c: A.plan },
          { l: "Not yet, just looking", r: "See what we offer, from bartenders to full event service.", c: A.offer },
          { l: "I'm a bartender looking for work", r: "FF Team is where hospitality professionals build their Profile Cards.", c: A.team }
        ] },
        { q: "Are you looking for a bar at your event?", a: [
          { l: "Yes, a full bar", r: "Choose a Service Card and we show the ones that suit your guest numbers.", c: A.offer },
          { l: "Just the drinks", r: "Choose your cocktails first and they are added to your booking.", c: A.cocktails },
          { l: "Not sure yet", r: "Tell us about your event and we will show you what fits.", c: A.plan }
        ] },
        { q: "Are you looking to inquire or book?", a: [
          { l: "I'm ready to book", r: "Plan your event and choose a service and your team.", c: A.plan },
          { l: "I'd like to ask something first", r: "Open anyone's profile and ask them a question, or browse the network.", c: A.network },
          { l: "I want to compare companies", r: "See the bar companies and their teams, reviews and areas.", c: A.companies }
        ] }
      ]
    }[kind];
    return React.createElement("section", {
      className: "ff-sect ff-qg",
      id: "ff-guide",
      "aria-labelledby": "ff-qg-h"
    }, React.createElement("h2", {
      id: "ff-qg-h",
      className: "ff-h1 ff-qg-title"
    }, React.createElement("span", null, "Can FireFlair help you?")), React.createElement("p", {
      className: "ff-qg-lede"
    }, "Answer three quick questions and we'll point you to the right place."), React.createElement("div", {
      className: "ff-qg-grid"
    }, Q.map((x, i) => {
      const on = pick[i], ans = on != null ? x.a[on] : null;
      return React.createElement("div", {
        key: x.q,
        className: "ff-qg-q"
      }, React.createElement("div", {
        className: "h"
      }, React.createElement("span", {
        className: "n"
      }, i + 1), React.createElement("b", null, x.q)), React.createElement("div", {
        className: "opts",
        role: "group",
        "aria-label": x.q
      }, x.a.map((o, j) => React.createElement("button", {
        key: o.l,
        type: "button",
        "aria-pressed": on === j,
        onClick: () => setPick((p) => ({ ...p, [i]: p[i] === j ? null : j }))
      }, o.l))), ans && React.createElement("div", {
        className: "res",
        role: "status"
      }, React.createElement("p", null, ans.r), React.createElement("button", {
        type: "button",
        className: "ff-btn primary wide",
        onClick: ans.c[1]
      }, ans.c[0], " ", React.createElement(ArrowRight, {
        size: 14
      }))));
    })));
  }
