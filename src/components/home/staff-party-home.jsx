/* src/components/home/staff-party-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  function StaffHome11() {
    const { state, dispatch } = useStore();
    DIR = useDirectory();
    const root = useRef(null);
    useCoinSpin(root);
    useEffect(() => {
      if (state.route === "eventNew") {
        dispatch({ type: "GO", route: "staffHome" });
        dispatch({ type: "V11_SET", patch: { bkView: { mode: "new", open: "event" } } });
        dispatch({ type: "TAB", tab: "bookings" });
      }
    }, [state.route]);
    return React.createElement("div", {
      className: "ff-home ff-home11 staff",
      ref: root
    }, React.createElement("div", {
      className: "ff-home17"
    }, React.createElement(HireHero, {
      kind: "staff"
    }), withCoins([
      React.createElement(DiscoverHub11, {
        key: "discover",
        cats: DX_BIZ,
        kind: "staff"
      }),
      React.createElement(GoldLaunch20, { key: "gold" }),
      React.createElement(HowBooking17, {
        key: "how",
        kind: "staff"
      }),
      React.createElement(GuideQuestions11, {
        key: "guide",
        kind: "staff"
      }),
      React.createElement(Journal17, {
        key: "journal",
        kind: "staff"
      }), React.createElement(FireFlairFold18, { key: "why", kind: "staff" }),
      React.createElement(BusinessSupport19, { key: "business" }),
      React.createElement(HireJoin, {
        key: "join",
        kind: "staff"
      })
    ])));
  }

  const PARTY_STEPS11 = [
    { icon: Sparkles, title: "Your service", text: "The type of service that suits your event." },
    { icon: Users, title: "Your people", text: "The professionals you would like at your event." },
    { icon: CalDays11, title: "Your Event Card", text: "The date, the place and how many guests." },
    { icon: MessageSquare, title: "Confirmation", text: "Confirmed within 24 hours." }
  ];

  function PartyHow() {
    const nav = useHireNav();
    return React.createElement("section", {
      className: "ff-sect ff-hw11 party",
      id: "ff-how-book",
      "aria-labelledby": "ff-phw11-h"
    }, React.createElement("div", {
      className: "ff-hw11-box"
    }, React.createElement("span", {
      className: "ff-hw11-eye"
    }, "How FF Party works"), React.createElement("h2", {
      id: "ff-phw11-h",
      className: "ff-hw11-h"
    }, "Your party, sorted."), React.createElement("p", {
      className: "ff-hw11-t"
    }, "Book professionals from FF Team, the network of hospitality professionals, for your party or private event."), React.createElement("ol", {
      className: "ff-hw11-steps"
    }, PARTY_STEPS11.map((s, i) => React.createElement("li", {
      key: s.title
    }, React.createElement("span", {
      className: "n"
    }, i + 1), React.createElement("span", {
      className: "ic"
    }, React.createElement(s.icon, {
      size: 18,
      strokeWidth: 1.7
    })), React.createElement("b", null, s.title), React.createElement("span", null, s.text)))), React.createElement("div", {
      className: "ff-hw11-cta"
    }, React.createElement(ShineButton, {
      onClick: nav.toEvent
    }, React.createElement(Popper11, {
      size: 15
    }), " Plan your event"))));
  }

  function PartyCompanies() {
    const { state, dispatch } = useStore();
    const list = companyList(state).filter((c) => !c.mine && !c.unclaimed);
    return React.createElement("section", {
      className: "ff-sect ff-pco11",
      id: "ff-companies",
      "aria-labelledby": "ff-pco11-h"
    }, React.createElement("h2", {
      id: "ff-pco11-h",
      className: "ff-h1"
    }, "Book a bar company"), React.createElement("p", {
      className: "ff-feat11-note"
    }, "Book a company, then choose your bartenders from its team."), React.createElement(HomeCarousel, {
      label: "Bar companies"
    }, list.map((co) => React.createElement("button", {
      key: co.id,
      type: "button",
      className: "ff-co11-tile big",
      onClick: () => {
        dispatch({ type: "VIEW_COMPANY", id: co.id });
        window.scrollTo(0, 0);
      },
      "aria-label": `${co.name}: open their page`
    }, React.createElement(CompanyCardFace, {
      c: co,
      size: "sm"
    }), React.createElement("span", {
      className: "ff-co11-team"
    }, (co.team || []).slice(0, 4).map((id) => {
      const p = dirFind(id);
      return p ? React.createElement(Portrait, {
        key: id,
        src: p.photo,
        name: p.name,
        size: 26,
        tier: p.tier
      }) : null;
    }), React.createElement("small", null, (co.team || []).length, " on the team"))))));
  }

  const PARTY_OFFER = [
    ["Mobile bar hire", "A complete bar, set up at your venue or your home, with bartenders, glassware and ice."],
    ["Cocktail bartenders", "Professional and flair bartenders who make your cocktails and look after your guests."],
    ["Cocktail bartenders and signature cocktails", "A cocktail menu built around your event, or a bartender's own signature cocktails."],
    ["Cocktail masterclasses", "A hands-on masterclass for your group: learn, shake and taste."],
    ["Full event service", "Bar, cocktails and the whole team, taken care of from set-up to close."],
    ["Event staff", "Waiters, hosts, barbacks and front of house for any size of event."]
  ];

  const PARTY_OCCASIONS = ["Hen parties", "Stag dos", "Birthdays", "House parties", "Garden parties", "Engagement parties", "Anniversaries", "Baby showers", "Intimate weddings", "Christmas parties", "New Year's Eve", "Summer parties", "Private dinners"];

  function PartyOffer() {
    const nav = useHireNav();
    return React.createElement("section", {
      className: "ff-sect ff-offer11",
      id: "ff-offer",
      "aria-labelledby": "ff-offer-h"
    }, React.createElement("h2", {
      id: "ff-offer-h",
      className: "ff-h1"
    }, "What we offer"), React.createElement("p", {
      className: "ff-offer11-lede"
    }, "Professionals and services for parties in London and across the UK. Choose a Service Card and book."), React.createElement(HomeCarousel, {
      label: "FF Party Service Cards"
    }, PARTY_SERVICES.map((sv) => React.createElement("div", {
      key: sv.id,
      style: { width: CARD_W.poster, flex: "none" }
    }, React.createElement(ServicePoster, {
      svc: sv
    })))), React.createElement("div", {
      className: "ff-hero17-cta",
      style: { marginTop: 14 }
    }, React.createElement(ShineButton, {
      onClick: nav.toEvent
    }, React.createElement(Popper11, {
      size: 15
    }), " Plan your event")), React.createElement("ul", {
      className: "ff-offer11-list"
    }, PARTY_OFFER.map(([t, d]) => React.createElement("li", {
      key: t
    }, React.createElement("b", null, t), React.createElement("span", null, d)))), React.createElement("h3", {
      className: "ff-offer11-h3"
    }, "Perfect for"), React.createElement("ul", {
      className: "ff-offer11-occ"
    }, PARTY_OCCASIONS.map((o) => React.createElement("li", {
      key: o
    }, o))), React.createElement("p", {
      className: "ff-offer11-seo"
    }, "FF Party makes it easy to hire a mobile bar, cocktail bartenders and event staff for your party. Whether it's a hen party, a wedding reception, a birthday at home or a corporate event, choose the service you need, add your cocktail menu, and book trusted hospitality professionals with real reviews."));
  }

  function PartyComingSoon() {
    return React.createElement("section", {
      className: "ff-sect ff-nx",
      id: "ff-coming",
      "aria-labelledby": "ff-pnx11-h"
    }, React.createElement("h2", {
      id: "ff-pnx11-h",
      className: "ff-h1"
    }, "Coming to FF Party"), React.createElement(NextModule, {
      id: "ff-pnx11-svc",
      icon: Sparkles,
      title: "Service Cards",
      cards: PARTY_SERVICES.map((sv) => React.createElement("div", {
        key: sv.id,
        className: "ff-nx-cell",
        style: { width: CARD_W.poster }
      }, React.createElement(ServicePoster, {
        svc: sv
      })))
    }, React.createElement("p", null, "Book a complete service in one go: the bartenders, the bar and the drinks.")), React.createElement(NextModule, {
      id: "ff-pnx11-ck",
      icon: Martini,
      title: "Signature Cocktails",
      cards: COCKTAIL_CARDS.map((c) => React.createElement("img", { decoding: "async",
        key: c.name,
        className: "ff-nx-ck",
        src: c.img,
        alt: `${c.name} - FireFlair classic cocktail card`,
        loading: "eager",
        draggable: false
      }))
    }, React.createElement("p", null, "Choose from your bartenders' own signature cocktails."), React.createElement("p", {
      className: "em"
    }, "The recipes come with your booking.")));
  }

  function PartyHome11() {
    const { state, dispatch } = useStore();
    DIR = useDirectory();
    const root = useRef(null);
    useCoinSpin(root);
    useEffect(() => {
      if (state.route === "eventNew") {
        dispatch({ type: "GO", route: "staffHome" });
        dispatch({ type: "V11_SET", patch: { bkView: { mode: "new", open: "event" } } });
        dispatch({ type: "TAB", tab: "bookings" });
      }
    }, [state.route]);
    return React.createElement("div", {
      className: "ff-home ff-home11 party",
      ref: root
    }, React.createElement("div", {
      className: "ff-home17"
    }, React.createElement(Css18, null), React.createElement(HireHero, { kind: "party" }), withCoins([
      React.createElement(DiscoverHub11, {
        key: "discover",
        cats: DX_PARTY,
        kind: "party"
      }),
      React.createElement(VipFounding20, { key: "vip" }),
      React.createElement(GuideQuestions11, {
        key: "guide",
        kind: "party"
      }),
      React.createElement(Journal17, {
        key: "journal",
        kind: "party"
      }), React.createElement(FireFlairFold18, { key: "why" }),
      React.createElement(BusinessSupport19, { key: "business" }),
      React.createElement(HireJoin, {
        key: "join",
        kind: "party"
      })
    ])));
  }

  window.__ffVipX = { DiscoverHub11, HireSearch };
