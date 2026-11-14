/* src/components/home/card-family.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
  function CfImg11(name) {
    return (window.FF_IMG || {})[name] || "";
  }

  function CfPlate11({ children }) {
    return React.createElement("span", {
      className: "cf-plate"
    }, children);
  }

  function CfProfile11({ photo, name, role, tier }) {
    return React.createElement("div", {
      className: "cf-face cf-profile"
    }, React.createElement("div", {
      className: "ph",
      style: { backgroundImage: `url(${photo})` }
    }), React.createElement("div", {
      className: "tx"
    }, React.createElement("b", null, name), React.createElement("small", null, role)), React.createElement("span", {
      className: "coin"
    }, React.createElement(FFLogo, {
      size: 26,
      tier,
      flat: true
    })), React.createElement(CfPlate11, null, "Profile Card"));
  }

  function CfCompany11({ banner, name, kind, area }) {
    return React.createElement("div", {
      className: "cf-face cf-company"
    }, React.createElement("div", {
      className: "ph",
      style: { backgroundImage: `url(${banner})` }
    }), React.createElement("span", {
      className: "mk"
    }, React.createElement(I11.Briefcase, {
      size: 20,
      strokeWidth: 1.6
    })), React.createElement("div", {
      className: "tx"
    }, React.createElement("b", null, name), React.createElement("small", null, kind), React.createElement("em", null, React.createElement(I11.MapPin, {
      size: 10
    }), " ", area)), React.createElement(CfPlate11, null, "Company Card"));
  }

  function CfService11({ tone, tier, title, line }) {
    return React.createElement("div", {
      className: `cf-face cf-service ${tone}`
    }, React.createElement("span", {
      className: "rb"
    }, "Service Card"), React.createElement("span", {
      className: "coin"
    }, React.createElement(FFLogo, {
      size: 28,
      tier: tone === "bronze" ? "bronze" : tone === "silver" ? "silver" : "gold",
      flat: true
    })), React.createElement("div", {
      className: "tx"
    }, React.createElement("i", null, tier, " · FF Party"), React.createElement("b", null, title), React.createElement("small", null, line)), React.createElement("span", {
      className: "ln"
    }, React.createElement(I11.Sparkles, {
      size: 12
    }), " Includes bar, staff and drinks"));
  }

  function CfEvent11({ photo, title, when, where }) {
    return React.createElement("div", {
      className: "cf-face cf-event",
      style: { backgroundImage: `url(${photo})` }
    }, React.createElement("span", {
      className: "dt"
    }, React.createElement(I11.CalendarDays, {
      size: 11
    }), " ", when), React.createElement("div", {
      className: "tx"
    }, React.createElement("b", null, title), React.createElement("small", null, React.createElement(I11.MapPin, {
      size: 10
    }), " ", where)), React.createElement(CfPlate11, null, "Event Card"));
  }

  function CfReview11({ text, from, to }) {
    return React.createElement("div", {
      className: "cf-face cf-review"
    }, React.createElement("span", {
      className: "st"
    }, [0, 1, 2, 3, 4].map((i) => React.createElement(I11.Star, {
      key: i,
      size: 13,
      fill: "currentColor",
      strokeWidth: 0
    }))), React.createElement("p", null, "“", text, "”"), React.createElement("div", {
      className: "by"
    }, React.createElement("span", {
      className: "av"
    }, from[0]), React.createElement("small", null, from, " ", React.createElement("i", null, "for"), " ", to)), React.createElement(CfPlate11, null, "Review Card"));
  }

  function CardFamily11() {
    const SV = typeof PARTY_SERVICES !== "undefined" && PARTY_SERVICES || [];
    const sv = (i, d) => SV[i] || d;
    const g = sv(2, { title: "Cocktail masterclass", tagline: "A hosted class for your guests" }), s = sv(1, { title: "Mobile bar", tagline: "Bartender and bar, fully set up" }), b = sv(0, { title: "Bartender hire", tagline: "A skilled bartender for the night" });
    const stacks = [
      { k: "profile", t: "Profile Cards", d: "People, with their skills and reviews.", cards: [
        React.createElement(CfProfile11, {
          key: "a",
          photo: CfImg11("face_you"),
          name: "Sophie Hart",
          role: "Cocktail Bartender",
          tier: "gold"
        }),
        React.createElement(CfProfile11, {
          key: "b",
          photo: CfImg11("dream_flair_jobs"),
          name: "Marcus Bell",
          role: "Flair Bartender",
          tier: "silver"
        }),
        React.createElement(CfProfile11, {
          key: "c",
          photo: CfImg11("dream_after_dark"),
          name: "Ines Moreau",
          role: "Bar Manager",
          tier: "gold"
        })
      ] },
      { k: "company", t: "Company Cards", d: "Businesses, bars and venues.", cards: [
        React.createElement(CfCompany11, {
          key: "a",
          banner: CfImg11("dream_after_dark"),
          name: "Ministry of Cocktails",
          kind: "Mobile cocktail bars & full bar service",
          area: "UK-wide"
        }),
        React.createElement(CfCompany11, {
          key: "b",
          banner: CfImg11("dream_food_festivals_markets"),
          name: "Barsmith Event Bars",
          kind: "Event bars & bartender hire",
          area: "London"
        }),
        React.createElement(CfCompany11, {
          key: "c",
          banner: CfImg11("dream_international_events"),
          name: "Mix & Twist",
          kind: "Bar hire for large events",
          area: "Leeds and London"
        })
      ] },
      { k: "service", t: "Service Cards", d: "The shifts and packages you book.", cards: [
        React.createElement(CfService11, {
          key: "a",
          tone: "gold",
          tier: "Gold",
          title: g.title,
          line: g.tagline
        }),
        React.createElement(CfService11, {
          key: "b",
          tone: "silver",
          tier: "Silver",
          title: s.title,
          line: s.tagline
        }),
        React.createElement(CfService11, {
          key: "c",
          tone: "bronze",
          tier: "Bronze",
          title: b.title,
          line: b.tagline
        })
      ] },
      { k: "cocktail", t: "Cocktail Cards", d: "Signature drinks, with the recipe.", cards: [
        React.createElement("img", { decoding: "async",
          key: "a",
          className: "cf-face cf-cock",
          src: CfImg11("cocktail_0"),
          alt: "Old Fashioned cocktail card",
          loading: "eager",
          decoding: "async"
        }),
        React.createElement("img", { decoding: "async",
          key: "b",
          className: "cf-face cf-cock",
          src: CfImg11("cocktail_1"),
          alt: "French Martini cocktail card",
          loading: "eager",
          decoding: "async"
        }),
        React.createElement("img", { decoding: "async",
          key: "c",
          className: "cf-face cf-cock",
          src: CfImg11("cocktail_2"),
          alt: "Piña Colada cocktail card",
          loading: "eager",
          decoding: "async"
        })
      ] },
      { k: "event", t: "Event Cards", d: "Every booking starts here.", cards: [
        React.createElement(CfEvent11, {
          key: "a",
          photo: CfImg11("dream_music_festivals"),
          title: "Summer Festival Bar",
          when: "Sat 12 Jun",
          where: "Victoria Park"
        }),
        React.createElement(CfEvent11, {
          key: "b",
          photo: CfImg11("dream_flair_jobs"),
          title: "Spring Launch Party",
          when: "Sat 20 Mar",
          where: "The Loft, Enfield"
        }),
        React.createElement(CfEvent11, {
          key: "c",
          photo: CfImg11("dream_yacht_jobs"),
          title: "Yacht Reception",
          when: "Fri 4 Jul",
          where: "St Katharine Docks"
        })
      ] },
      { k: "review", t: "Review Cards", d: "Reputation, earned one event at a time.", cards: [
        React.createElement(CfReview11, {
          key: "a",
          text: "Ran the bar at our launch night without a single hiccup.",
          from: "Ava",
          to: "Sam"
        }),
        React.createElement(CfReview11, {
          key: "b",
          text: "Fast, clean and brilliant with the guests.",
          from: "Jo",
          to: "Marcus"
        }),
        React.createElement(CfReview11, {
          key: "c",
          text: "Our guests are still talking about the cocktails.",
          from: "Priya",
          to: "Sophie"
        })
      ] }
    ];
    return React.createElement("section", {
      className: "ff-sect ff-cf",
      id: "ff-cards",
      "aria-labelledby": "ff-cf-h"
    }, React.createElement("h2", {
      id: "ff-cf-h",
      className: "ff-h1"
    }, "The card family"), React.createElement("p", {
      className: "ff-cf-lede"
    }, "Everything on FireFlair is a card."), React.createElement("div", {
      className: "ff-cf-board"
    }, stacks.map((st) => React.createElement("figure", {
      key: st.k,
      className: `ff-cf-cell ${st.k}`
    }, React.createElement("div", {
      className: "ff-cf-stack",
      "aria-hidden": "true"
    }, React.createElement("div", {
      className: "ff-cf-card c3"
    }, st.cards[2]), React.createElement("div", {
      className: "ff-cf-card c2"
    }, st.cards[1]), React.createElement("div", {
      className: "ff-cf-card c1"
    }, st.cards[0])), React.createElement("figcaption", null, React.createElement("b", null, st.t), React.createElement("span", null, st.d))))));
  }

  const V17I = {
    MessageSquare: lucideIcon("MessageSquare"),
    CheckCircle2: lucideIcon("CheckCircle2"),
    ShieldCheck: lucideIcon("ShieldCheck"),
    BadgeCheck: lucideIcon("BadgeCheck"),
    Star: lucideIcon("Star"),
    Heart: lucideIcon("Heart"),
    History: lucideIcon("History"),
    SlidersHorizontal: lucideIcon("SlidersHorizontal"),
    Users: lucideIcon("Users"),
    ListChecks: lucideIcon("ListChecks"),
    MapPin: lucideIcon("MapPin"),
    UserPlus: lucideIcon("UserPlus"),
    Trophy: lucideIcon("Trophy"),
    GraduationCap: lucideIcon("GraduationCap"),
    Gift: lucideIcon("Gift"),
    BookOpen: lucideIcon("BookOpen"),
    CalendarDays: lucideIcon("CalendarDays"),
    Briefcase: lucideIcon("Briefcase"),
    Wine: lucideIcon("Wine"),
    Search: lucideIcon("Search"),
    Rocket: lucideIcon("Rocket"),
    Compass: lucideIcon("Compass"),
    Newspaper: lucideIcon("Newspaper"),
    ArrowRight: lucideIcon("ArrowRight"),
    ArrowLeft: lucideIcon("ArrowLeft"),
    X: lucideIcon("X"),
    Sparkles: lucideIcon("Sparkles"),
    Layers: lucideIcon("Layers"),
    Store: lucideIcon("Store"),
    PartyPopper: lucideIcon("PartyPopper"),
    Contact: lucideIcon("Contact"),
    Repeat: lucideIcon("Repeat"),
    Quote: lucideIcon("Quote")
  };

  function CfConfirm17() {
    return React.createElement("div", {
      className: "cf-face cf-confirm"
    }, React.createElement("span", {
      className: "ok"
    }, React.createElement(V17I.CheckCircle2, {
      size: 34,
      strokeWidth: 1.8
    })), React.createElement("div", {
      className: "tx"
    }, React.createElement("b", null, "Confirmed"), React.createElement("small", null, "on WhatsApp")), React.createElement("div", {
      className: "bub"
    }, React.createElement(V17I.MessageSquare, {
      size: 11
    }), React.createElement("span", null), React.createElement("span", null)), React.createElement(CfPlate11, null, "Confirmation"));
  }

  const CJ_CSS = __ff_css("styles/cj.css");

  function CardJourney11({ kind = "party" }) {
    const SV = typeof PARTY_SERVICES !== "undefined" && PARTY_SERVICES || [];
    const sv = SV[1] || { title: "Mobile bar", tagline: "Bartender and bar, fully set up" };
    const F = {
      profile: /* @__PURE__ */ React.createElement(CfProfile11, { photo: CfImg11("face_you"), name: "Sophie Hart", role: "Cocktail Bartender", tier: "gold" }),
      company: /* @__PURE__ */ React.createElement(CfCompany11, { banner: CfImg11("dream_after_dark"), name: "Ministry of Cocktails", kind: "Mobile cocktail bars & full bar service", area: "UK-wide" }),
      service: /* @__PURE__ */ React.createElement(CfService11, { tone: "silver", tier: "Silver", title: sv.title, line: sv.tagline }),
      event: /* @__PURE__ */ React.createElement(CfEvent11, { photo: CfImg11("dream_music_festivals"), title: "Summer Festival Bar", when: "Sat 12 Jun", where: "Victoria Park" }),
      confirm: /* @__PURE__ */ React.createElement(CfConfirm17, null),
      review: /* @__PURE__ */ React.createElement(CfReview11, { text: "Ran the bar at our launch night without a single hiccup.", from: "Ava", to: "Sophie" })
    };
    const order = {
      party: ["event", "service", "profile", "confirm", "review"],
      staff: ["company", "event", "profile", "confirm", "review"],
      team: ["profile", "service", "confirm", "event", "review"]
    }[kind] || ["event", "service", "profile", "confirm", "review"];
    const board = useRef(null);
    const [at, setAt] = useState(0);
    const onScroll = () => {
      const el = board.current;
      if (!el) return;
      const max = el.scrollWidth - el.clientWidth;
      setAt(max > 4 ? Math.round(el.scrollLeft / max * (order.length - 1)) : order.length - 1);
    };
    useEffect(() => {
      onScroll();
      window.addEventListener("resize", onScroll);
      return () => window.removeEventListener("resize", onScroll);
    }, []);
    return /* @__PURE__ */ React.createElement("section", { className: "ff-sect ff-cj", id: "ff-cards", "aria-labelledby": "ff-cj-h" }, /* @__PURE__ */ React.createElement("style", null, CJ_CSS), /* @__PURE__ */ React.createElement("h2", { id: "ff-cj-h", className: "ff-h1" }, "Follow a booking"), /* @__PURE__ */ React.createElement("p", { className: "ff-cj-ex" }, "Every booking moves through the same five cards, from the first request to the five-star review."), /* @__PURE__ */ React.createElement("div", { className: `ff-cj-wrap${at >= order.length - 1 ? " end" : ""}` }, /* @__PURE__ */ React.createElement("div", { className: "ff-cj-board", ref: board, onScroll }, /* @__PURE__ */ React.createElement("ol", { className: "ff-cj-row" }, order.map((k, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: k }, i > 0 && /* @__PURE__ */ React.createElement("li", { className: "arr", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement(V17I.ArrowRight, { size: 22, strokeWidth: 2 })), /* @__PURE__ */ React.createElement("li", { className: "stp" }, /* @__PURE__ */ React.createElement("span", { className: "n" }, i + 1), /* @__PURE__ */ React.createElement("div", { className: "ff-cj-card", "aria-hidden": "true" }, F[k]))))))), /* @__PURE__ */ React.createElement("div", { className: "ff-cj-dots", "aria-hidden": "true" }, order.map((k, i) => /* @__PURE__ */ React.createElement("i", { key: k, className: i === at ? "on" : "" }))));
  }

  function TrustSection17() {
    const hire = useHireNav();
    const items = [
      { icon: V17I.Star, t: "Reviewed by hosts", d: "Every review comes from a real event, left by the person who booked." },
      { icon: V17I.BadgeCheck, t: "Verified by FireFlair", d: "Bronze, Silver and Gold badges, set by FireFlair, show on every profile." },
      { icon: V17I.Users, t: "Vouched for by the community", d: "The people they work with show on their profile, so you can see who vouches for them." }
    ];
    return React.createElement("section", {
      className: "ff-sect ff-trust17",
      id: "ff-trust",
      "aria-labelledby": "ff-trust-h"
    }, React.createElement("h2", {
      id: "ff-trust-h",
      className: "ff-h1"
    }, "Verified by the community"), React.createElement("div", {
      className: "ff-trust17-grid"
    }, items.map((x) => React.createElement("div", {
      key: x.t,
      className: "ff-trust17-c"
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(x.icon, {
      size: 22,
      strokeWidth: 1.7
    })), React.createElement("b", null, x.t), React.createElement("span", null, x.d)))), React.createElement("div", {
      className: "ff-trust17-cta"
    }, React.createElement(Button, {
      onClick: () => hire.toNetwork("")
    }, React.createElement(V17I.Users, {
      size: 14
    }), " Explore the network")));
  }

  function YourParty17() {
    const hire = useHireNav();
    const items = [
      { icon: V17I.SlidersHorizontal, t: "Your preferences", d: "Your kind of party, your drinks and what your staff should know. Applied to every booking." },
      { icon: V17I.Heart, t: "Your favourites", d: "The people you love working with, ready to add to your next booking." },
      { icon: V17I.History, t: "Your bookings", d: "Every party you have booked, ready to book again." },
      { icon: V17I.Contact, t: "Shared with your staff", d: "The people you hire see your VIP Host Card before the day." }
    ];
    return React.createElement("section", {
      className: "ff-sect ff-yp17",
      id: "ff-yourparty",
      "aria-labelledby": "ff-yp-h"
    }, React.createElement("h2", {
      id: "ff-yp-h",
      className: "ff-h1"
    }, "Your Party"), React.createElement("div", {
      className: "ff-yp17-grid"
    }, items.map((x) => React.createElement("div", {
      key: x.t,
      className: "ff-yp17-c"
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(x.icon, {
      size: 20,
      strokeWidth: 1.7
    })), React.createElement("b", null, x.t), React.createElement("span", null, x.d)))), React.createElement("div", {
      className: "ff-trust17-cta"
    }, React.createElement(LockedBtn17, {
      icon: React.createElement(V17I.PartyPopper, { size: 14 })
    }, "Create your Party profile")));
  }

  function PartyOccasions17() {
    const hire = useHireNav();
    return React.createElement("section", {
      className: "ff-sect ff-occ17",
      id: "ff-occasions",
      "aria-labelledby": "ff-occ-h"
    }, React.createElement("h2", {
      id: "ff-occ-h",
      className: "ff-h1"
    }, "Every kind of party"), React.createElement("div", {
      className: "ff-occ17-chips"
    }, PARTY_OCCASIONS.map((o) => React.createElement("button", {
      key: o,
      type: "button",
      className: "ff-locked17",
      "aria-disabled": "true",
      "aria-label": o + ". " + LOCKED_LABEL17,
      title: LOCKED_LABEL17,
      onClick: (e) => e.preventDefault()
    }, o))), React.createElement("div", {
      className: "ff-trust17-cta"
    }, React.createElement(LockedBtn17, {
      icon: React.createElement(V17I.PartyPopper, { size: 14 })
    }, "Plan your event")));
  }

  function HowSteps17({ kind = "party" }) {
    const P = kind === "party";
    const steps = P ? [["Your event", "When, where and how many guests"], ["Your service", "A FireFlair Service Card, or your own"], ["Your staff", "The people or company who deliver it"]] : [["Event Card", "Date, time and place"], ["Shift details", "Role, hours and pay"], ["Staff", "Choose who you want"], ["Review", "Send and confirm"]];
    return React.createElement("section", {
      className: "ff-sect ff-hs17",
      id: "ff-steps",
      "aria-labelledby": "ff-hs-h"
    }, React.createElement("h2", {
      id: "ff-hs-h",
      className: "ff-h1"
    }, P ? "Plan your party in three steps." : "Book your staff in four steps."), React.createElement("p", null, P ? "Tell us about the event, choose the service you want, then pick who delivers it. We confirm everything with you on WhatsApp." : "Create your Event Card, add the shift details for each role, choose your people, then review and confirm. Everyone is asked on WhatsApp."), React.createElement("ol", {
      className: P ? "" : "four"
    }, steps.map(([t, d], i) => React.createElement("li", {
      key: t
    }, React.createElement("span", null, i + 1), React.createElement("b", null, t), React.createElement("em", null, d)))));
  }
