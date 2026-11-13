/* src/components/home/staff-home.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const FIRE17_STILL = __ff_json("content/data/fire17-still.json");

  const Repeat11 = lucideIcon("Repeat"), Contact11 = lucideIcon("Contact"), CalDays11 = lucideIcon("CalendarDays"), Clip11 = lucideIcon("ClipboardList"), Popper11 = lucideIcon("PartyPopper"), Badge11 = lucideIcon("BadgeCheck"), Bot11 = lucideIcon("Bot");

  function useHireNav() {
    const { state, dispatch } = useStore();
    const site = hireSiteOf(state);
    const tab = (t) => {
      dispatch({ type: "TAB", tab: t });
      window.scrollTo(0, 0);
    };
    return {
      site,
      toEvent: () => {
        if (site.party) {
          dispatch({ type: "V11_SET", patch: { bkView: { mode: "new" } } });
          tab("bookings");
          return;
        }
        dispatch({ type: "V11_SET", patch: { bkView: { mode: "new", open: "event" } } });
        tab("bookings");
      },
      toBookings: (view) => {
        dispatch({ type: "V11_SET", patch: { bkView: view || { tab: "events" } } });
        tab("bookings");
      },
      toNetwork: (q) => {
        dispatch({ type: "NET_QUERY", q: q || "" });
        tab("network");
      },
      toProfile: () => tab("profile"),
      view: (id) => {
        dispatch({ type: "VIEW", id });
        window.scrollTo(0, 0);
      }
    };
  }

  const HIRE = {
    staff: { img: "training_ff_open_bar", h: "Welcome to FF Staff", sub: "Find staff. Book staff.", cta: "Hire staff", search: "Search staff, skills, locations…" },
    party: { img: "teams", h: "Welcome to FF Party", sub: "Plan your party. Choose your people.", cta: "Book now", search: "Search people, skills, areas…" }
  };

  function HireSearch({ placeholder }) {
    const nav = useHireNav();
    const [val, setVal] = useState("");
    const mic = useMic11(setVal);
    return React.createElement("form", {
      className: "ff-frame ff-ai ff-ffai-tint hero bare ff-hero-search",
      role: "search",
      onSubmit: (e) => {
        e.preventDefault();
        nav.toNetwork(val.trim());
      }
    }, React.createElement("div", {
      className: "ff-ai-row",
      style: { alignItems: "center" }
    }, React.createElement("button", {
      type: "button",
      className: `ff-mic${mic.listening ? " on" : ""}`,
      onClick: mic.toggle,
      "aria-pressed": mic.listening,
      "aria-label": mic.listening ? "Stop listening" : "Speak instead of typing",
      title: mic.listening ? "Stop" : "Speak"
    }, React.createElement(MicGlyph, {
      size: 18
    })), React.createElement("span", {
      className: "ff-ai-tag",
      "aria-hidden": "true"
    }, React.createElement(Coin, {
      size: 20,
      tier: "gold"
    })), React.createElement("input", {
      type: "search",
      className: "ff-input ff-ai-in min-w-0 flex-1",
      "aria-label": "Search FireFlair",
      placeholder,
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

  function HireHero({ kind }) {
    const nav = useHireNav();
    const c = HIRE[kind];
    return React.createElement("section", {
      className: `ff-hero18 ff-hero11 ${kind}`,
      "aria-labelledby": "ff-hero11-h",
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
    }, React.createElement(SiteHeroCoin, { site: kind === "party" ? "party" : "staff" })), React.createElement("span", {
      className: "ff-hero18-coin ff-hero17-coin"
    }, React.createElement(SiteHeroCoin, { site: kind === "party" ? "party" : "staff" }))), React.createElement("div", {
      className: "ff-hero18-in"
    }, React.createElement("h1", {
      id: "ff-hero11-h",
      className: "ff-hero17-h ff-hero-h101"
    }, c.h), React.createElement("p", {
      className: "ff-hero-sub101"
    }, c.sub), React.createElement("div", {
      className: kind === "party" ? "ff-hero17-cta two" : "ff-hero17-cta"
    }, kind === "party" ? React.createElement(LockedBtn17, { shine: true, icon: React.createElement(CalDays11, { size: 15 }) }, c.cta) : React.createElement(ShineButton, {
      onClick: nav.toEvent
    }, React.createElement(CalDays11, {
      size: 15
    }), " ", c.cta), kind === "party" ? React.createElement("button", {
      type: "button",
      className: "ff-btn",
      onClick: () => nav.toNetwork("")
    }, "Browse our network") : null), React.createElement("div", {
      className: "ff-hero17-ai"
    }, React.createElement(HireSearch, {
      placeholder: c.search
    }))));
  }

  function HireFeatured({ title, ids, note }) {
    const nav = useHireNav();
    const list = ids.map(dirFind).filter(Boolean);
    return React.createElement("section", {
      className: "ff-sect ff-feat17",
      id: "ff-team",
      "aria-labelledby": "ff-feat11-h"
    }, React.createElement("div", {
      className: "ff-feat17-head"
    }, React.createElement("h2", {
      id: "ff-feat11-h",
      className: "ff-h1"
    }, title), React.createElement("button", {
      type: "button",
      className: "ff-linkbtn",
      onClick: () => nav.toNetwork("")
    }, "See everyone ", React.createElement(ArrowRight, {
      size: 13
    }))), note && React.createElement("p", {
      className: "ff-feat11-note"
    }, note), React.createElement(HomeCarousel, {
      label: title
    }, list.map((p) => React.createElement(PlayerTile, {
      key: p.id,
      person: p,
      onClick: () => nav.view(p.id)
    }))));
  }

  const STAFF_PARTS = [
    { icon: Contact11, label: "Profiles with skills, experience and reviews" },
    { icon: Clip11, label: "Shift details for every person you book" },
    { icon: MessageSquare, label: "Requests and replies on WhatsApp" },
    { icon: Users, label: "Your own team, ready to rebook" }
  ];

  const STAFF_WHY = [
    { icon: Star, label: "See their experience, skills and reviews before you book." },
    { icon: Users, label: "Book the people other professionals vouch for." },
    { icon: Repeat11, label: "Rebook your favourites in a couple of taps." }
  ];

  function StaffWhatIs() {
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-what",
      "aria-labelledby": "ff-wf11-h"
    }, React.createElement("div", {
      className: "ff-wf18 ff-wf101"
    }, React.createElement("div", {
      className: "ff-wf18-coin"
    }, React.createElement(Coin, {
      size: 46,
      tier: "silver"
    })), React.createElement("span", {
      className: "ff-wf18-eye"
    }, "What is FF Staff?"), React.createElement("h2", {
      id: "ff-wf11-h",
      className: "ff-wf18-h"
    }, "Hire hospitality staff, the modern way."), React.createElement("p", {
      className: "ff-wf18-q"
    }, "FF Staff is where hospitality businesses book freelance staff from FF Team."), React.createElement("div", {
      className: "ff-orn",
      "aria-hidden": "true"
    }, React.createElement("i", null), React.createElement("span", null, "◆"), React.createElement("i", null)), React.createElement("ol", {
      className: "ff-wf101-flow",
      "aria-label": "From your event, to FF Staff, to your team booked"
    }, React.createElement("li", {
      className: "step"
    }, React.createElement("span", {
      className: "ff-medal sm"
    }, React.createElement(CalDays11, {
      size: 20,
      strokeWidth: 1.6
    })), React.createElement("b", null, "Your event"), React.createElement("span", null, "The start time and location. That's it.")), React.createElement("li", {
      className: "arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("li", {
      className: "step big"
    }, React.createElement("span", {
      className: "ff-medal"
    }, React.createElement(Users, {
      size: 26,
      strokeWidth: 1.5
    })), React.createElement("em", {
      className: "tag"
    }, "The modern way"), React.createElement("b", null, "FF Staff"), React.createElement("ul", null, STAFF_PARTS.map((x) => React.createElement("li", {
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
    }, React.createElement(Check, {
      size: 20,
      strokeWidth: 1.8
    })), React.createElement("b", null, "Your team, booked"), React.createElement("span", null, "Confirmed on WhatsApp"))), React.createElement("div", {
      className: "ff-wf101-why"
    }, React.createElement("span", {
      className: "ff-wf18-eye"
    }, "Why FF Staff?"), React.createElement("p", {
      className: "no"
    }, "What matters is who you can trust."), React.createElement("ul", null, STAFF_WHY.map((x) => React.createElement("li", {
      key: x.label
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(x.icon, {
      size: 16,
      strokeWidth: 1.8
    })), x.label))))));
  }

  const STAFF_STEPS = [
    { icon: CalDays11, title: "Event Card", text: "The start time and location." },
    { icon: Users, title: "Choose", text: "Pick the roles you need, then people from featured staff, the network or your own team." },
    { icon: Clip11, title: "Shift details", text: "Times, pay and your T&Cs for each person." },
    { icon: Send, title: "Send", text: "On WhatsApp. They confirm, and it's in their FF Team bookings." }
  ];

  const SAMPLE_EVENT = { id: "smp_ev", kind: "Brand launch", title: "Spring Launch Party", iso: "2027-03-20", start: "18:00", venue: "Hackney Depot, E8", guests: "180" };

  const SAMPLE_SHIFT = { id: "smp_sh", role: "Cocktail Bartender", iso: "2027-03-20", time: "17:00 — 23:00", dress: "All black", notes: "Batch cocktails for the first hour.", tcs: "company" };

  function StaffHowItWorks() {
    const nav = useHireNav();
    const sam = dirFind("dir_sam");
    return React.createElement("section", {
      className: "ff-sect ff-hw11",
      id: "ff-how-book",
      "aria-labelledby": "ff-hw11-h"
    }, React.createElement("div", {
      className: "ff-hw11-box"
    }, React.createElement("span", {
      className: "ff-hw11-eye"
    }, "How booking works"), React.createElement("h2", {
      id: "ff-hw11-h",
      className: "ff-hw11-h"
    }, "Four steps. All on WhatsApp."), React.createElement("ol", {
      className: "ff-hw11-steps"
    }, STAFF_STEPS.map((s, i) => React.createElement("li", {
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
    }, React.createElement("div", {
      className: "it ev"
    }, React.createElement(EventCard11, {
      ev: SAMPLE_EVENT,
      people: sam ? [sam] : []
    })), React.createElement("span", {
      className: "ar"
    }, React.createElement(ArrowRight, {
      size: 18
    })), React.createElement("div", {
      className: "it sh"
    }, React.createElement(ShiftCard11, {
      shift: SAMPLE_SHIFT,
      event: SAMPLE_EVENT,
      person: sam,
      status: { label: "Confirmed", tone: "gold" }
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
    }), " ", sam ? sam.name.split(" ")[0] : "They", " accepted · in their FF Team bookings"))), React.createElement("div", {
      className: "ff-hw11-cta"
    }, React.createElement(Button, {
      onClick: nav.toEvent
    }, React.createElement(CalDays11, {
      size: 14
    }), " Choose your team"), React.createElement(Button, {
      variant: "ghost",
      onClick: () => nav.toBookings({ tab: "events" })
    }, "Go to Bookings ", React.createElement(ArrowRight, {
      size: 13
    })))));
  }

  function StaffTeams() {
    const nav = useHireNav();
    const trio = people(["dir_sam", "dir_ines", "dir_theo"]);
    const crew = people(["dir_sam", "dir_maya", "dir_kofi", "dir_elena"]);
    return React.createElement("section", {
      className: "ff-sect ff-teams17 ff-tm",
      id: "ff-teams",
      "aria-labelledby": "ff-tm11-h"
    }, React.createElement("h2", {
      id: "ff-tm11-h",
      className: "ff-tm-h101"
    }, React.createElement("span", {
      className: "a"
    }, "Book a team."), " ", React.createElement("span", {
      className: "b"
    }, "Not just a person.")), React.createElement("p", {
      className: "ff-tm11-t"
    }, "Book someone and see their network. Add the people they work with to the same event, so teams that work well together stay together."), React.createElement("ol", {
      className: "ff-tm-flow",
      "aria-label": "From a Profile Card, to their team, to your event"
    }, React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(InertBox, {
      className: "ff-tm-minis"
    }, trio.map((p) => React.createElement("div", {
      key: p.id,
      className: "ff-tm-mini"
    }, React.createElement(PlayerCard, {
      person: p
    })))), React.createElement("b", null, "Their Profile Cards"), React.createElement("small", null, "Tap anyone to see who they work with")), React.createElement("li", {
      className: "ff-tm-arr",
      "aria-hidden": "true"
    }, React.createElement(ArrowRight, {
      size: 20
    })), React.createElement("li", {
      className: "ff-tm-step"
    }, React.createElement(TeamCard, {
      name: "Vooshka Cocktail Bar",
      skills: ["Cocktails", "Fast service"],
      interests: ["Weddings", "Brand nights"],
      url: `${CARD_DOMAIN}/vooshka`,
      members: crew,
      more: 6
    }), React.createElement("b", null, "A business team"), React.createElement("small", null, "Book a bar company, then choose from its team")), React.createElement("li", {
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
    })), React.createElement("b", null, "Your event"), React.createElement("small", null, "Booked together"))), React.createElement("div", {
      className: "ff-teams17-cta"
    }, React.createElement(Button, {
      onClick: () => nav.toNetwork("")
    }, React.createElement(Users, {
      size: 14
    }), " Explore the network")));
  }

  function ReviewCard11({ from, to, how, text, status }) {
    const nm = (p) => p.isCompany ? p.name : p.name.split(" ")[0];
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
    }, from.isCompany ? React.createElement("span", {
      className: "ff-rv11-co"
    }, coInitials(from.name)) : React.createElement(Portrait, {
      src: from.photo,
      name: from.name,
      size: 54,
      tier: from.tier
    }), React.createElement("b", null, nm(from)), React.createElement("small", null, from.profession)), React.createElement("span", {
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
    }), React.createElement("b", null, nm(to)), React.createElement("small", null, to.profession))), React.createElement("div", {
      className: "ff-rvcard-kind"
    }, from.isCompany ? "Booked together" : "Booked for a party"), React.createElement("div", {
      className: "ff-rvcard-stars",
      "aria-label": "Five out of five"
    }, "★★★★★"), React.createElement("div", {
      className: "ff-rvcard-rows"
    }, React.createElement("div", null, React.createElement("span", null, "Booked ", nm(to), " before?"), React.createElement("b", {
      className: "yes"
    }, from.isCompany ? "Yes" : "No")), React.createElement("div", null, React.createElement("span", null, "Book again?"), React.createElement("b", {
      className: "yes"
    }, "Yes")), React.createElement("div", null, React.createElement("span", null, "How is ", nm(to), " to work with?"), React.createElement("b", {
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

  function HireReviews({ kind }) {
    const nav = useHireNav();
    const to = dirFind("dir_sam");
    const from = kind === "party" ? { id: "smp_host", name: "Sophie Turner", profession: "Birthday party host", photo: FACE.you, tier: "standard" } : { id: "co_vooshka", name: "Vooshka Cocktail Bar", profession: "Luxury mobile cocktail bar", photo: null, tier: "gold", isCompany: true };
    return React.createElement("section", {
      className: "ff-sect ff-rel17 ff-cv18",
      id: "ff-relationships",
      "aria-labelledby": "ff-rel11-h"
    }, React.createElement("div", {
      className: "ff-cv18-box ff-cv18-rv"
    }, React.createElement("div", {
      className: "hd"
    }, React.createElement("span", {
      className: "ff-cv18-eye"
    }, "Verified by the people they work with"), React.createElement("h2", {
      id: "ff-rel11-h",
      className: "ff-cv18-h"
    }, kind === "party" ? "Book people you can trust." : "Hire people you can trust.")), to && React.createElement("div", {
      className: "rv"
    }, React.createElement(ReviewCard11, {
      from,
      to,
      how: "Excellent",
      status: `Accepted · on ${to.name.split(" ")[0]}'s profile`,
      text: kind === "party" ? "Made our garden party. Amazing cocktails and the guests loved him." : "Ran the bar at our launch night without a single hiccup. Fast, clean and great with the guests."
    }), React.createElement("p", {
      className: "cap"
    }, "Example Review Card")), React.createElement("div", {
      className: "ft"
    }, React.createElement("p", {
      className: "ff-cv18-t"
    }, kind === "party" ? "Every review shows on their profile. After your party, you review your team in a tap." : "Every review shows on their profile. After each shift you review them, and they review you."), React.createElement(Button, {
      variant: "onDark",
      onClick: () => nav.toNetwork("")
    }, React.createElement(Users, {
      size: 14
    }), " Explore the network"))));
  }

  const CO_PARTS = [
    { icon: FileText, label: "T&Cs" },
    { icon: FileText, label: "Documents" },
    { icon: MessageSquare, label: "Q&A" },
    { icon: Images11, label: "Media" },
    { icon: MapPin, label: "Areas covered" },
    { icon: Users, label: "Your team" }
  ];

  function Images11(p) {
    return React.createElement(I11.Images, {
      ...p
    });
  }

  function StaffCompanyCard() {
    const { state } = useStore();
    const nav = useHireNav();
    const mine = !!(state.company && state.company.joinedAt);
    const [layout, setLayout] = useState("classic");
    const sample = { ...COMPANY_PAGES.co_vooshka, layout };
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-company",
      "aria-labelledby": "ff-co11-h"
    }, React.createElement("div", {
      className: "ff-coh11"
    }, React.createElement("span", {
      className: "ff-coh11-eye"
    }, "Your Company Card"), React.createElement("h2", {
      id: "ff-co11-h",
      className: "ff-coh11-h"
    }, "One card for your business."), React.createElement("p", {
      className: "ff-coh11-t"
    }, "Your Company Card is sent to anyone you hire, to show them who you are. It can also be added to FF Party to advertise your services."), React.createElement(InertBox, {
      className: "ff-coh11-card"
    }, React.createElement(CompanyCardFace, {
      c: sample
    })), React.createElement("div", {
      className: "ff-cc11-layouts mini",
      role: "group",
      "aria-label": "Example layouts"
    }, CC_LAYOUTS.map((l) => React.createElement("button", {
      key: l.key,
      type: "button",
      "aria-pressed": layout === l.key,
      onClick: () => setLayout(l.key)
    }, React.createElement("span", {
      className: `thumb t-${l.key}`,
      "aria-hidden": "true"
    }, React.createElement("i", {
      className: "lg"
    }), React.createElement("i", {
      className: "a"
    }), React.createElement("i", {
      className: "b"
    }), React.createElement("i", {
      className: "c"
    })), l.name))), React.createElement("ul", {
      className: "ff-coh11-parts"
    }, CO_PARTS.map((x) => React.createElement("li", {
      key: x.label
    }, React.createElement(x.icon, {
      size: 14,
      strokeWidth: 1.8
    }), " ", x.label))), React.createElement(Button, {
      onClick: nav.toProfile
    }, React.createElement(Briefcase, {
      size: 14
    }), " ", mine ? "Your Company Card" : "Create your Company Card")));
  }

  const BIZ_PLATFORMS = [
    {
      n: 1,
      site: "team",
      name: "FF Team",
      status: "Open now",
      tone: "on",
      who: "Where your staff are.",
      chips: [{ icon: Contact11, label: "Profile cards" }, { icon: Star, label: "Reviews" }, { icon: Users, label: "Network" }, { icon: Users, label: "Teams" }]
    },
    {
      n: 2,
      site: "staff",
      name: "FF Staff",
      status: "Open now",
      tone: "on",
      who: "Hire staff for your events.",
      chips: [{ icon: CalDays11, label: "Event Cards" }, { icon: Clip11, label: "Shift details" }, { icon: Clock, label: "Availability Cards" }, { icon: Briefcase, label: "Company Card" }]
    },
    {
      n: 3,
      site: "party",
      name: "FF Party",
      status: "Launching 2026",
      tone: "soon",
      who: "Bookings direct from clients.",
      text: "Phase 2: advertise your company on FF Party, and clients book you and your team.",
      chips: [{ icon: Sparkles, label: "Service Cards" }, { icon: Martini, label: "Signature cocktails" }, { icon: Briefcase, label: "Company page" }, { icon: Star, label: "Reviews" }]
    },
    { n: 4, site: "vip", name: "FF VIP", status: "Launching early 2027", tone: "soon", who: "VIP cards, luxury experiences and rewards." }
  ];

  function StaffPlatforms() {
    return React.createElement("section", {
      className: "ff-sect",
      id: "ff-how",
      "aria-labelledby": "ff-pl11-h"
    }, React.createElement("div", {
      className: "ff-wif ff-hw18 ff-pl ff-pl101"
    }, React.createElement("div", {
      className: "ff-hw18-top"
    }, React.createElement("h2", {
      id: "ff-pl11-h",
      className: "ff-hw18-h"
    }, "The FireFlair platforms"), React.createElement("p", {
      className: "ff-pl-order"
    }, "2026 roadmap"), React.createElement("ol", {
      className: "ff-pl-list"
    }, BIZ_PLATFORMS.map((pl) => React.createElement("li", {
      key: pl.site,
      className: `ff-pl-row${pl.n === 1 ? " first" : ""}${pl.site === "party" ? " party" : ""}${pl.site === "staff" ? " here" : ""}`
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
      "aria-label": "Clients book your company on FF Party"
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
      className: "ff-pl-clients co"
    }, React.createElement(Briefcase, {
      size: 22,
      strokeWidth: 1.6
    })), React.createElement("b", null, "Your company"))), pl.text && React.createElement("p", null, pl.text), pl.site === "party" ? React.createElement("ul", {
      className: "ff-pl-feats",
      "aria-label": "What FF Party adds"
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

  const STAFF_LATER = [
    { icon: Bot11, title: "Automatic staff assignment", note: "FireFlair fills a shift for you." },
    { icon: Users, title: "FireFlair Staffing Service", note: "Tell us about your event and we put your team together." },
    { icon: Star, title: "Google reviews", note: "Post a review to Google Maps in a tap." },
    { icon: Badge11, title: "Companies House", note: "Verify your Company Card against the register." }
  ];

  function StaffComingSoon() {
    return React.createElement("section", {
      className: "ff-sect ff-nx",
      id: "ff-coming",
      "aria-labelledby": "ff-nx11-h"
    }, React.createElement("h2", {
      id: "ff-nx11-h",
      className: "ff-h1"
    }, "What's next for FF Staff?"), React.createElement("p", {
      className: "ff-nx11-lede"
    }, "Phase 2: advertise your company to clients on FF Party."), React.createElement(NextModule, {
      id: "ff-nx11-svc",
      icon: Sparkles,
      title: "Service Cards",
      cards: [
        ...PARTY_SERVICES.map((sv) => React.createElement("div", {
          key: sv.id,
          className: "ff-nx-cell",
          style: { width: CARD_W.poster }
        }, React.createElement(ServicePoster, {
          svc: sv
        }))),
        React.createElement("div", {
          key: "create",
          className: "ff-nx-cell",
          style: { width: CARD_W.poster }
        }, React.createElement(CreateServiceCard, null))
      ]
    }, React.createElement("p", null, "Create your company's own Service Cards. Clients book them on FF Party, and you choose the team.")), React.createElement(NextModule, {
      id: "ff-nx11-ck",
      icon: Martini,
      title: "Signature Cocktails",
      cards: [
        ...COCKTAIL_CARDS.map((c) => React.createElement("img", { decoding: "async",
          key: c.name,
          className: "ff-nx-ck",
          src: c.img,
          alt: `${c.name} - FireFlair classic cocktail card`,
          loading: "eager",
          draggable: false
        })),
        React.createElement("div", {
          key: "create",
          className: "ff-nx-ck"
        }, React.createElement(CreateCocktailCard, null))
      ]
    }, React.createElement("p", null, "Your cocktail menu on your company page."), React.createElement("p", {
      className: "em"
    }, "Clients choose your cocktails when they book you on FF Party.")), React.createElement("div", {
      className: "ff-nx11-later"
    }, STAFF_LATER.map((it) => React.createElement("div", {
      key: it.title,
      className: "it"
    }, React.createElement("span", {
      className: "ic"
    }, React.createElement(it.icon, {
      size: 20,
      strokeWidth: 1.6
    })), React.createElement("b", null, it.title), React.createElement("small", null, it.note), React.createElement("span", {
      className: "ff-soonbadge sm"
    }, React.createElement(Lock, {
      size: 10,
      strokeWidth: 2.4
    }), " Coming 2027")))));
  }

  function HireJoin({ kind }) {
    const { state } = useStore();
    const nav = useHireNav();
    const box = useRef(null);
    const game = useGameReady(box);
    const joined = !!(state.company && state.company.joinedAt);
    const c = kind === "party" ? { h: "Now enjoy it.", t: "Your celebration, beautifully looked after.", b: "Plan your event", go: nav.toEvent, icon: Popper11 } : joined ? { h: "Your FF Staff", t: "Create an Event Card, choose your staff, then add their shift details.", b: "Choose your team", go: nav.toEvent, icon: CalDays11 } : { h: "Join FF Staff", t: "Your Company Card, so you can start booking.", b: "Join now", go: nav.toProfile, icon: Briefcase };
    return React.createElement("section", {
      className: "ff-sect ff-join",
      "aria-labelledby": "ff-join11-h"
    }, React.createElement("div", {
      className: "ff-join-box ff-game",
      ref: box
    }, React.createElement("div", {
      className: "ff-join-in"
    }, React.createElement(Coin, {
      size: 56,
      tier: kind === "party" ? "bronze" : "silver"
    }), React.createElement("h2", {
      id: "ff-join11-h",
      className: "ff-join-h"
    }, c.h), React.createElement("p", {
      className: "ff-join-t"
    }, c.t), kind === "party" ? React.createElement(LockedBtn17, {
      shine: true,
      icon: React.createElement(c.icon, { size: 15 })
    }, c.b) : React.createElement(ShineButton, {
      onClick: c.go
    }, React.createElement(c.icon, {
      size: 15
    }), " ", c.b)), game && React.createElement(QuietBoundary, null, React.createElement(Suspense, {
      fallback: null
    }, React.createElement(CoinDrop, {
      area: box
    })))));
  }
