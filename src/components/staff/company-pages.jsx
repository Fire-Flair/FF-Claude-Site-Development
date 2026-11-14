/* src/components/staff/company-pages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COMPANIES — on Network (FF Team and FF Staff), and each company's page.
   Sample companies stand in for the ones Core will serve.
   ========================================================================== */
const IMG11 = window.FF_IMG || {};


const VK17 = __ff_json("content/data/vk17.json");


const vkSrc17 = (f) => f;


const VK_CK17 = __ff_json("content/data/vk-ck17.json");


const VK_SIG17 = {"Popcorn Whisky":["short","Whisky","Whisky softened with sweet popcorn and a squeeze of lemon.",["whisky", "popcorn", "lemon"],[["50","Whisky"],["15","Popcorn syrup"],["20","Lemon juice"]]],"Marmalade Gin":["short","Gin","Gin, bitter orange marmalade and lemon over ice.",["gin", "marmalade", "citrus"],[["50","Gin"],["15","Orange marmalade"],["20","Lemon juice"]]],"Limoncello Martini":["martini","Vodka","Zesty limoncello and vodka, bright and sharp.",["vodka", "limoncello", "lemon"],[["40","Vodka"],["25","Limoncello"],["15","Lemon juice"]]],"Maple Old Fashioned":["short","Bourbon","Bourbon and bitters, sweetened with maple.",["bourbon", "maple", "bitters"],[["60","Bourbon"],["10","Maple syrup"],["2","Angostura bitters","dash"]]],"Maple Manhattan":["martini","Whisky","A smooth stirred Manhattan with a touch of maple.",["whisky", "vermouth", "maple"],[["50","Rye whiskey"],["20","Sweet vermouth"],["10","Maple syrup"]]],"Maple Espresso Martini":["martini","Vodka","Rich espresso and vodka with a hint of maple.",["vodka", "coffee", "maple"],[["40","Vodka"],["30","Fresh espresso"],["20","Coffee liqueur"],["10","Maple syrup"]]],"Raspberry & Lychee Mojito":["tall","Rum","Fresh mint, raspberry and lychee over crushed ice.",["rum", "raspberry", "lychee"],[["50","White rum"],["25","Lime juice"],["20","Lychee purée"],["6","Raspberries","piece"],["10","Mint leaves","sprig"]]],"Ginger & Passionfruit Mojito":["tall","Rum","Zingy ginger and passion fruit with fresh mint.",["rum", "passion fruit", "ginger"],[["50","White rum"],["25","Lime juice"],["20","Passion fruit purée"],["10","Ginger syrup"],["10","Mint leaves","sprig"]]],"Strawberry & Ting Mojito":["tall","Rum","Strawberry and grapefruit soda, a long and fruity mojito.",["rum", "strawberry", "grapefruit"],[["50","White rum"],["25","Lime juice"],["4","Strawberries","piece"],["60","Ting grapefruit soda"],["10","Mint leaves","sprig"]]],"Limoncello & Lychee Mojito":["tall","Rum","Limoncello and lychee lifted by lemon and mint.",["rum", "limoncello", "lychee"],[["50","White rum"],["20","Limoncello"],["20","Lychee purée"],["20","Lime juice"],["10","Mint leaves","sprig"]]],"Spicy Strawberry Margarita":["martini","Tequila","Strawberry and a little chilli heat with a spiced rim.",["tequila", "strawberry", "chilli"],[["50","Tequila"],["20","Triple sec"],["25","Lime juice"],["4","Strawberries","piece"],["2","Chilli slices","piece"]]],"Mango Colada":["tall","Rum","Mango, coconut and pineapple, holiday in a glass.",["rum", "mango", "coconut"],[["50","White rum"],["30","Mango purée"],["30","Coconut cream"],["60","Pineapple juice"]]],"Penicillin":["short","Whisky","Smoky whisky, lemon, honey and ginger.",["whisky", "honey", "ginger"],[["50","Blended whisky"],["25","Lemon juice"],["20","Honey ginger syrup"],["5","Smoky whisky"]]],"Passionfruit & Lychee Sour":["martini","Vodka","A silky sour of passion fruit and lychee.",["vodka", "passion fruit", "lychee"],[["40","Vodka"],["25","Passion fruit purée"],["20","Lychee purée"],["20","Lemon juice"],["20","Egg white"]]],"Guava & Ginger Mule":["tall","Vodka","Guava and ginger beer with a lime kick.",["vodka", "guava", "ginger"],[["50","Vodka"],["40","Guava juice"],["15","Lime juice"],["100","Ginger beer"]]],"Raspberry & Rose Martini":["martini","Vodka","Raspberry and rose, delicate and floral.",["vodka", "raspberry", "rose"],[["45","Vodka"],["15","Rose syrup"],["6","Raspberries","piece"],["15","Lime juice"]]]};


const PX17 = {"px_team_com": "", "px_team_pk": "", "px_team_ev": "", "px_biz_com": "", "px_biz_ev": "", "px_biz_sv": "", "px_biz_pf": "", "px_pty_com": "", "px_pty_pk": "", "px_pty_ev": "", "px_pty_pf": "", "px_bar": ""};


if (window.FF_IMG)
  Object.assign(window.FF_IMG, PX17);


window.FF_IMG_AI = Object.assign({}, window.FF_IMG || {});


const PHOTOS17 = __ff_json("content/data/photos17.json");


/* Where the faces are in each crop, for any place a photo is shown at another shape
   (desktop tiles, the "Next" strip, story headers, the Bookings photos on desktop). */
const FOCUS17 = {
 "t17_p35": "50% 52%",
 "t17_vke01": "39% 14%",
 "t17_vke06": "59% 62%",
 "t17_aiIntl": "50% 50%",
 "t17_vke10": "50% 60%",
 "j17_p45": "50% 6%",
 "j17_p13": "50% 1%",
 "j17_vkg15": "50% 100%",
 "t17_p01": "54% 35%",
 "t17_vke02": "50% 65%",
 "t17_vkg14": "41% 45%",
 "t17_vke12": "50% 79%",
 "t17_p30": "46% 50%",
 "j17_v01": "50% 37%",
 "j17_p05": "50% 45%",
 "j17_vkg02": "50% 60%",
 "t17_aiMusic": "50% 50%",
 "t17_vkg11": "50% 58%",
 "t17_vkg09": "50% 50%",
 "t17_vke05": "50% 65%",
 "t17_vke11": "50% 79%",
 "j17_p23": "58% 2%",
 "j17_p32": "45% 48%",
 "j17_vkg05": "50% 50%",
 "t17_vke04": "70% 28%",
 "t17_vke09": "62% 34%",
 "t17_p11": "53% 24%",
 "t17_vke07": "55% 19%",
 "j17_p27": "33% 6%",
 "j17_p04": "45% 6%",
 "j17_p10": "20% 6%",
 "t17_p45": "31% 4%",
 "j17_aiIntl": "50% 80%",
 "j17_vke06": "60% 6%",
 "j17_p35": "54% 42%",
 "j17_aiMusic": "50% 80%",
 "t17_p23": "50% 0%",
 "t17_p46": "50% 34%",
 "t17_p24": "60% 27%",
 "t17_p31": "50% 10%",
 "j17_p46": "52% 13%",
 "j17_p24": "60% 6%",
 "j17_p31": "50% 6%",
 "t17_p06": "49% 40%",
 "t17_v01": "50% 43%",
 "t17_p13": "50% 0%",
 "j17_p06": "50% 66%",
 "j17_p30": "45% 59%",
 "j17_p01": "55% 55%",
 "t17_p27": "33% 19%",
 "t17_p05": "50% 45%",
 "t17_p04": "46% 14%",
 "j17_p11": "53% 19%",
 "j17_vke04": "70% 6%",
 "t17_p14": "50% 35%",
 "j17_p14": "50% 75%",
 "j17_vke02": "50% 100%",
 "t17_p32": "41% 45%",
 "t17_p12": "54% 4%",
 "t17_p18": "49% 30%",
 "t17_p20": "50% 50%",
 "t17_p15": "51% 35%",
 "t17_p08": "50% 50%",
 "j17_p12": "55% 6%",
 "j17_p18": "50% 61%",
 "j17_p20": "50% 59%",
 "j17_p15": "50% 55%",
 "j17_p08": "30% 52%",
 "tm_live": "50% 50%",
 "cocktail_0": "42% 60%",
 "cocktail_1": "48% 45%",
 "cocktail_2": "47% 45%",
 "jr_whyteam": "46% 10%",
 "jr_sidehustle": "50% 58%",
 "jr_workteam": "50% 6%",
 "jr_profile": "48% 6%",
 "jr_shifts": "35% 42%",
 "jr_sites": "45% 37%",
 "jr_cards": "50% 65%",
 "jr_menuteam": "50% 49%",
 "jr_cardsteam": "55% 6%",
 "bk_training": "60% 18%",
 "bk_jobs": "52% 6%",
 "bk_rewards": "50% 50%",
 "in_tr_intro_cocktails": "60% 44%",
 "in_tr_mixology": "50% 30%",
 "in_tr_brand_training": "77% 53%",
 "in_tr_ff_open_bar": "50% 60%",
 "in_tr_ff_masterclass": "50% 50%",
 "in_dj_food_festivals": "50% 50%",
 "in_rw_shoot": "49% 42%"
};


window.FF_FOCUS = Object.assign(window.FF_FOCUS || {}, FOCUS17);


function fp17(k) { const f = (window.FF_FOCUS || {})[k]; return f ? { objectPosition: f } : undefined; }



/* Pillar photos: each pillar lists five library photos (pool). t17_<id> is the tile crop,
   j17_<id> the card crop. A visit counter (this browser only) moves the set on every visit. */
function dxVisit17() {
  let n = Math.floor(Math.random() * 5);
  try { const v = parseInt(localStorage.getItem("ff-dx-visit") || "", 10); if (!isNaN(v)) n = v + 1; localStorage.setItem("ff-dx-visit", String(n % 1000)); } catch (e) {}
  return n;
}


function dxPick17(c, n, shape) {
  const p = c && c.pool; if (!p || !p.length) return c ? c.img : "";
  return (shape === "t" ? "t17_" : "j17_") + p[((n % p.length) + p.length) % p.length];
}


/* A card photo: from the pillar's own card photos when it has them (FF Team), otherwise the
   pool photos after the one on the tile. Either way a card never shows the tile's photo. */
function dxCard17(c, n, i) {
  const k = c && c.cards; if (k && k.length) return "j17_" + k[(((n + i) % k.length) + k.length) % k.length];
  return dxPick17(c, n + 1 + i, "j");
}


/* The tile photo: all five stacked, the current one shown; changing n crossfades. */
function DxPh17({ c, n }) {
  const F = window.FF_IMG || {}, pool = (c && c.pool) || [];
  if (!pool.length) { const s = F[c.img]; return <span className="ph">{s ? <img decoding="async" src={s} style={fp17(c.img)} alt="" draggable={false} /> : null}</span>; }
  const on = ((n % pool.length) + pool.length) % pool.length;
  return (
    <span className="ph ff-rot17">
      {pool.map((pid, i) => { const k = "t17_" + pid, s = F[k]; return s ? <img decoding="async" key={pid} src={s} style={fp17(k)} className={i === on ? "on" : undefined} alt="" draggable={false} aria-hidden={i === on ? undefined : true} /> : null; })}
    </span>
  );
}


const ROT17_CSS = __ff_css("styles/rot17.css");


if (window.FF_IMG) Object.assign(window.FF_IMG, PHOTOS17);


let VKS17 = null;


const vkSeeds17 = () => VKS17 || (VKS17 = {
  cocktail: VK17.sig.map(([src, name], i) => {
    const m = VK_SIG17[name] || ["martini", "", "", [], []];
    return { ...NEW_COCKTAIL17("signature"), id: "vkck" + i, spirit: m[1], name, note: m[2], photo: src, glass: m[0], keywords: m[3], ings: m[4].map((g, j) => ({ id: "vkck" + i + "_" + j, amt: g[0], unit: g[2] === "dash" ? "dash" : g[2] === "sprig" ? "sprig" : g[2] ? "piece" : "ml", name: g[1], buy: "" })) };
  }),
  service: VK17_OCC.map(([title, tagline, includes, ideal], i) => ({ ...NEW_SERVICE17(), id: "vksv" + i, tone: "gold", title, tagline, includes, ideal, time: "Tailored to your event" }))
});


const VK17_OCC = [
  ["Weddings", "From the welcome drinks to the final toast, a bar designed around your day, your tastes and the people celebrating with you.", "Bespoke bar, cocktails, mocktails and an expert team", "Wedding receptions and celebrations"],
  ["Private Celebrations", "Your favourite drinks, a distinctive bar and a team who know how to look after your guests.", "Bespoke bar, cocktails, mocktails and an expert team", "Birthdays, anniversaries and parties"],
  ["Corporate Events", "A polished bar service that reflects your brand and welcomes your guests, from product launches to company celebrations.", "Branded bar styling, cocktails, mocktails and an expert team", "Product launches and company celebrations"],
  ["Full Bar Service", "Beyond cocktails, we offer a complete drinks selection: premium spirits, wines, draught and bottled beers, mocktails and soft drinks.", "Premium spirits, wines, draught and bottled beers, mocktails and soft drinks", "Any occasion that needs a complete bar"]
];


const VK17_WHY = [
  ["Your Bar, Bespoke", "Created to complement your occasion. Work with our design team to tailor the size, style and finish of your bar, from understated elegance to a striking centrepiece."],
  ["Drinks with Personality", "Your favourites, alongside something new to discover. Choose from classic cocktails, signature creations and alcohol-free serves, with a menu that reflects your tastes and gives every guest something to enjoy."],
  ["Care in Every Detail", "Quality spirits, fresh ingredients and precise preparation make the difference. From the balance of a cocktail to the glass and garnish, each serve is finished with care."],
  ["Expert Team", "Skilled bartenders, creative mixologists and accomplished flair bartenders bring exceptional drinks and effortless hosting to your occasion, with a touch of theatre when the moment calls for it."]
];


const VK17_STEPS = [
  ["It Begins With You", "Our team will take you through the details of your event, exploring your vision, your venue and the atmosphere you\u2019d like to create. Together, we\u2019ll shape a bar experience that feels entirely yours."],
  ["The Details, Designed Around You", "Enjoy a personal tasting with our mixologist to create a drinks menu for your occasion. Work alongside our design team to select your bar style and develop bespoke artwork, bringing your vision to life."],
  ["A Date to Look Forward To", "Once you\u2019re happy with your proposal, return your signed agreement and pay the agreed deposit to secure your date."],
  ["We\u2019ll Take It From Here", "We\u2019ll confirm the final arrangements and coordinate with your venue. From setup to the last drink and breakdown, our team takes care of the bar, leaving you free to enjoy the occasion."]
];


const VK17_QA = [
  ["Do you offer a full bar service?", "Yes", "Bespoke bars, cocktails, mocktails, spirits, wines, beers, draught beer and soft drinks."],
  ["Do you travel across the UK?", "Yes", "Mobile bar experiences across the UK. Share your venue or postcode to discuss availability and access."],
  ["Do you design the bar around my event?", "Yes", "Choose from 42 bar styles or ask for a made to measure design, with bespoke artwork."],
  ["Do you offer alcohol-free serves?", "Yes", "Mocktails and soft drinks sit alongside the cocktails."],
  ["Do you hold a tasting before the event?", "Yes", "A personal tasting with our mixologist to create your drinks menu."],
  ["Do you coordinate with my venue?", "Yes", "We confirm final arrangements with your venue, from setup to breakdown."],
  ["Does my venue need to provide space, access, power and water?", "Yes", "Requirements depend on the bar and service you choose. We discuss them with you and your venue before the event."],
  ["Does an enquiry reserve my date?", "No", "Your date is secured once your signed agreement and deposit are received."]
];


const VK17_DESC = "Vooshka is a luxury mobile cocktail bar bringing exquisite drinks and elevated hospitality to events across the UK. Bespoke bars, exceptional cocktails and complete drinks service for weddings, private celebrations and corporate events nationwide.\n\nA great bar brings people together. At Vooshka, distinctive design, expertly made drinks and a warm welcome create a natural gathering place at the heart of your celebration. From intimate gatherings to grand receptions, we work with you to find the right look, menu and style of service.";


const vkMedia17 = () => [
  ...VK17.occ.map((f, i) => f ? { id: "vk_occ" + i, src: f, alt: VK17_OCC[i][0] } : null).filter(Boolean),
  ...VK17.gal.map(([f, a], i) => ({ id: "vk_g" + i, src: vkSrc17(f), alt: a }))
];


const vkInfo17 = () => [
  { id: "vk_exp", title: "The Vooshka experience", lead: "A little theatre. A lot of elegance.", text: "You bring the people and the reason to celebrate; we\u2019ll take care of the bar.", chips: ["Bespoke Bars", "Cocktails", "Mocktails", "Spirits", "Beers"], items: [] },
  { id: "vk_why", title: "Why Vooshka", items: VK17_WHY.map(([t, d]) => ({ title: t, text: d })) },
  { id: "vk_steps", title: "The Vooshka process", numbered: true, items: VK17_STEPS.map(([t, d]) => ({ title: t, text: d })), quote: "Not just a bar. A beautiful part of your celebration." },
  { id: "vk_bars", title: "Bar styles", text: "Ordered by overall span, from smallest to largest. Made-to-measure designs appear last. All bars are 1.2 m high.", items: VK17.bars.map(([f, l, sz]) => ({ title: l, text: sz, photo: f })) }
];


const vkReviews17 = () => VK17.revs.map(([by, text]) => [null, 0, text, by]);


const vkContact17 = () => [["WhatsApp", "+44 7814 904355"], ["Instagram", "@vooshkacocktailbar"], ["Website", "vooshkabars.co.uk"]];


function vooshkaEditable17() {
  return {
    name: "Vooshka Cocktail Bar",
    kind: "Luxury mobile cocktail bar",
    areas: "England and Wales",
    base17: { locId: "gn:3333168", at: 0 },
    slug: "vooshka",
    socials: { whatsapp: "+44 7814 904355", instagram: "@vooshkacocktailbar" },
    theme: "onyx",
    layout: "centre",
    logoWide: true,
    description: VK17_DESC,
    logo: vkSrc17(VK17.logo),
    media: vkMedia17(),
    records: {
      contact: [
        makeRecord("contact", "+44 7814 904355", { description: "WhatsApp" }),
        makeRecord("contact", "@vooshkacocktailbar", { description: "Instagram" }),
        makeRecord("contact", "vooshkabars.co.uk", { description: "Website" })
      ],
      locations: [
        makeRecord("locations", "England", { description: "Mobile bar experiences across England and Wales" }),
        makeRecord("locations", "Wales")
      ]
    },
    qa: [
      ...CO_QA_SEED.filter((q) => q.group === "feedback"),
      ...VK17_QA.map(([text, answer, note], i) => ({ id: "qa_vk" + i, group: "business", text, answer, note }))
    ],
    reviews: VK17.revs.map(([byName, text], i) => ({ id: "vkr" + i, rating: 0, text, byName })),
    info: vkInfo17(),
    partners: []
  };
}


function VkFold17({ title, count, children }) {
  const [open, setOpen] = useState(false);
  return React.createElement("section", {
    className: "ff-copub-sec ff-vk-fold"
  }, React.createElement("button", {
    type: "button",
    className: "ff-vk-fold-h",
    "aria-expanded": open,
    onClick: () => setOpen(!open)
  }, React.createElement("span", {
    className: "t"
  }, title), count != null && React.createElement("span", {
    className: "n"
  }, count), React.createElement("span", {
    className: "ch" + (open ? " o" : ""),
    "aria-hidden": "true"
  })), open && React.createElement("div", {
    className: "ff-vk-fold-b"
  }, children));
}


function VkGrid17({ items }) {
  return React.createElement("div", {
    className: "ff-vk-grid"
  }, items.map((it, i) => React.createElement("figure", {
    key: i,
    className: "ff-vk-it"
  }, React.createElement("img", { decoding: "async",
    src: it.src,
    alt: it.name || it.label || "",
    loading: "lazy",
    referrerPolicy: "no-referrer",
    onError: (e) => {
      e.currentTarget.style.visibility = "hidden";
    }
  }), (it.name || it.label) && React.createElement("figcaption", null, React.createElement("b", null, it.name || it.label), it.size && React.createElement("small", null, it.size)))));
}


/* A company's own "More information" sections, as people see them. */
function CoInfo17({ list }) {
  const [pop, setPop] = useState(null);
  return (
    <>
      <Sheet open={!!pop} onClose={() => setPop(null)} title={pop ? pop.title : ""} center>
        {pop ? <div className="ff-coqa17-pop"><p className="a">{pop.text}</p></div> : null}
      </Sheet>
      {(list || []).filter(sec => String(sec.title || "").trim()).map((sec, si) => {
        const items = (sec.items || []).filter(it => String(it.title || it.text || it.photo || "").trim());
        const rows = items.filter(it => !it.photo), pics = items.filter(it => it.photo);
        const paras = String(sec.text || "").split(/\n\s*\n/).map(x => x.trim()).filter(Boolean);
        return (
          <VkFold17 key={sec.id || si} title={sec.title} count={items.length || null}>
            {sec.lead ? <h4 className="ff-vk-h">{sec.lead}</h4> : null}
            {paras.map((p, i) => <p key={"p" + i} className="ff-body ff-vk-p">{p}</p>)}
            {sec.chips && sec.chips.length ? <div className="ff-copub-chips">{sec.chips.map(c => <span key={c}>{c}</span>)}</div> : null}
            {rows.length ? <HScroll label={sec.title}>{rows.map((it, i) => <InformationCard key={"r" + i} record={{ ...makeRecord("info", it.title || sec.title), id: (sec.id || si) + "_" + i, description: it.text || "" }} def={{ label: sec.title, singular: sec.title, icon: "qualification", fields: ["description"] }} themeKey="onyx" onClick={() => setPop({ title: it.title || sec.title, text: it.text || "" })} />)}</HScroll> : null}
            {pics.length ? <VkGrid17 items={pics.map(it => ({ src: it.photo, label: it.title, size: it.text }))} /> : null}
            {sec.quote ? <p className="ff-vk-quote">{sec.quote}</p> : null}
          </VkFold17>
        );
      })}
    </>
  );
}


function VkExtras17({ x }) {
  const total = (x.cocktails || []).reduce((n, g) => n + g.items.length, 0);
  return React.createElement(React.Fragment, null, x.pkgs && React.createElement(VkFold17, {
    title: "Packages",
    count: x.pkgs.length
  }, x.pkgs.map(([t, pr, d]) => React.createElement("div", {
    key: t,
    className: "ff-vk-row"
  }, React.createElement("b", null, t + " · " + pr), React.createElement("span", null, d)))), x.faq && React.createElement(VkFold17, {
    title: "Questions and answers",
    count: x.faq.length
  }, x.faq.map(([t, d]) => React.createElement("div", {
    key: t,
    className: "ff-vk-row"
  }, React.createElement("b", null, t), React.createElement("span", null, d)))), x.experience && React.createElement(VkFold17, {
    title: "The " + (x.name || "Vooshka") + " experience"
  }, React.createElement("h4", {
    className: "ff-vk-h"
  }, x.experience[0]), x.experience.slice(1).map((p) => React.createElement("p", {
    key: p,
    className: "ff-body ff-vk-p"
  }, p)), x.offering && React.createElement("div", {
    className: "ff-copub-chips"
  }, x.offering.map((o) => React.createElement("span", {
    key: o
  }, o)))), x.why && React.createElement(VkFold17, {
    title: "Why " + (x.name || "Vooshka"),
    count: x.why.length
  }, x.why.map(([t, d]) => React.createElement("div", {
    key: t,
    className: "ff-vk-row"
  }, React.createElement("b", null, t), React.createElement("span", null, d)))), x.occasions && React.createElement(VkFold17, {
    title: "Occasions",
    count: x.occasions.length
  }, React.createElement("div", {
    className: "ff-vk-grid wide"
  }, x.occasions.map((o) => React.createElement("figure", {
    key: o.t,
    className: "ff-vk-it" + (o.src ? "" : " noimg")
  }, o.src && React.createElement("img", { decoding: "async",
    src: o.src,
    alt: o.t,
    loading: "lazy"
  }), React.createElement("figcaption", null, React.createElement("b", null, o.t), React.createElement("small", null, o.d)))))), x.steps && React.createElement(VkFold17, {
    title: "The " + (x.name || "Vooshka") + " process",
    count: x.steps.length
  }, x.steps.map(([t, d], i) => React.createElement("div", {
    key: t,
    className: "ff-vk-row"
  }, React.createElement("b", null, String(i + 1).padStart(2, "0"), "  ", t), React.createElement("span", null, d))), x.quote && React.createElement("p", {
    className: "ff-vk-quote"
  }, x.quote)), x.bars && x.bars.length > 0 && React.createElement(VkFold17, {
    title: "Bar styles",
    count: x.bars.length
  }, x.barsNote && React.createElement("p", {
    className: "ff-body ff-vk-p"
  }, x.barsNote), React.createElement(VkGrid17, {
    items: x.bars
  })), total > 0 && React.createElement(VkFold17, {
    title: x.cocktailsTitle || "Signature cocktails",
    count: total
  }, x.cocktails.map((g) => React.createElement("div", {
    key: g.cat,
    className: "ff-vk-grp"
  }, React.createElement("h4", {
    className: "ff-vk-h"
  }, g.cat), React.createElement(VkGrid17, {
    items: g.items
  })))));
}


/* Raise the Bar Glasgow (v17.3.138): full profile built from their public website, with their permission. */
const RTB_BLOB17 = "https://6istx3ephgqw5ngz.public.blob.vercel-storage.com/cocktails/";


const RTB_MENU17 = CONTENT_ADAPTER.raiseTheBarMenu();


const rtbMoney17 = (n) => "£" + (n % 1 ? n.toFixed(2) : String(n));


function rtbPage17() {
  const base = realPage11(REAL_COMPANIES11.find((c) => c.slug === "raise-the-bar"))[1];
  return {
    ...base,
    contact: [["Website", "raisethebarglasgow.com"], ["Email", "info@raisethebarglasgow.com"], ["Phone", "07498 723388"]],
    extras: {
      name: "Raise the Bar",
      cocktailsTitle: "Cocktail menu",
      pkgs: [
        ["Mobile Cocktail Bar", "From £400", "A fully staffed mobile cocktail bar: mixologist, bar, printed menu, spirits, mixers, garnishes, ice and glassware. 3 hours of service. Choose your cocktails as add-ons."],
        ["Cocktail Masterclass", "Enquire for a quote", "A hands-on class led by professional mixologists, at your venue, for teams, hen parties and private groups. Alcohol-free options available."],
        ["Whisky Tasting", "Enquire for a quote", "A guided Scotch whisky tasting led by kilted hosts, with distillery stories and a curated selection of drams."]
      ],
      experience: ["Fully staffed mobile cocktail bars for Glasgow and Scotland.", "Raise the Bar brings a professional mixologist, a fully stocked mobile bar and a printed menu of the cocktails you choose to weddings, parties, corporate events and festivals. Everything needed for the service is included, and travel within 30 miles of Glasgow is part of the price."],
      offering: ["Mobile cocktail bar", "Individual serve cocktails", "Mini party packs", "Party packs", "Mocktails", "Masterclasses", "Whisky tastings", "Branded bars"],
      faq: [
        ["What is included?", "A professional mixologist, a fully stocked mobile bar, a bespoke printed cocktail menu, spirits, liqueurs, mixers, fresh ingredients, garnishes, ice and all glassware."],
        ["Is there a minimum booking?", "Yes, £400 before any travel charge. Travel within 30 miles of Glasgow is included; beyond that a travel charge may apply and is quoted before you confirm."],
        ["How long is the service?", "3 hours from your start time. The team arrives about 30 minutes before to set up. Longer service is quoted on request."],
        ["How many cocktails can I choose?", "Up to 6 online. For a longer menu, or drinks that are not on the menu, ask for a bespoke menu."],
        ["Can I order single serves?", "Yes, with a minimum of 5 of each cocktail, and the £400 minimum booking still applies."],
        ["How do deposits work?", "A £50 deposit secures the request and the team confirm within 48 hours. The balance is invoiced and due within 14 days, and no later than 72 hours before the event. The deposit is non-refundable if you cancel, and refunded in full if they cannot attend."],
        ["How big is the bar?", "About 1.6 m by 1 m, with working room needed behind it. The front can be branded for an extra fee."],
        ["Are they insured?", "Yes, they hold public liability insurance and can share proof on request."]
      ],
      cocktails: [{ cat: "Single serve, mini party pack (14) and party pack (28)", items: RTB_MENU17.map(([n, i, m, p, f]) => ({ src: RTB_BLOB17 + f, name: n, size: [i && "Single " + rtbMoney17(i), m && "Mini " + rtbMoney17(m), p && "Party " + rtbMoney17(p)].filter(Boolean).join(" · ") })) }]
    }
  };
}


const COMPANY_PAGES = {
  co_vooshka: {
    name: "Vooshka Cocktail Bar",
    kind: "Luxury mobile cocktail bar",
    areas: "England and Wales",
    slug: "vooshka",
    socials: { whatsapp: "+44 7814 904355", instagram: "@vooshkacocktailbar" },
    theme: "onyx",
    layout: "centre",
    logoWide: true,
    tier: "gold",
    logo: vkSrc17(VK17.logo),
    description: VK17_DESC,
    media: vkMedia17(),
    team: [],
    contact: vkContact17(),
    venues: [],
    reviews: vkReviews17(),
    qa: [...CO_QA_SEED.filter((q) => q.group === "feedback"), ...VK17_QA.map(([text, answer, note], i) => ({ id: "qa_vk" + i, group: "business", text, answer, note }))],
    /* Packages and Cocktails are the same Service Cards and Cocktail Cards a company makes on FF Staff. */
    get services() { return vkSeeds17().service; },
    get cocktails() { return vkSeeds17().cocktail; },
    info: vkInfo17(),
    partners: []
  },
  ...Object.fromEntries(REAL_COMPANIES11.map(realPage11)),
  "co_raise-the-bar": rtbPage17(),
  ...Object.fromEntries(REAL_SUPPLIERS17.map(realPage11)),
};


function companyById(state, id) {
  if (id === "mine") { const c = state.company || {}; return { ...c, id: "mine", mine: true, mediaList: (c.media || []), areas: c.areas !== undefined ? c.areas : (c.location || "") }; }
  const base = COMPANIES.find(x => x.id === id) || SUPPLIER_BASES17[id];
  const page = COMPANY_PAGES[id];
  if (!base || !page) return null;
  return { ...base, ...page, id, mediaList: page.media.map(k => typeof k === "string" ? { id: k, src: IMG11[k] } : k).filter(m => m.src) };
}


function coIsVk17(state) {
  const c = state.company || {};
  /* The sample company: the dev/demo Vooshka account, or the signed-out preview (no company yet). A company that has joined has a slug and starts empty. */
  return c.slug === "vooshka" || (!c.slug && !String(c.name || "").trim());
}


function coSeeds17(state) { return coIsVk17(state) ? vkSeeds17() : {}; }


function coCards17(state, co, pub) {
  if (!co || (pub && co.mine)) return { services: [], cocktails: [] };  /* Phase 2: what a company saves in its card builders is not shown on its public page. */
  const sd = co.mine ? coSeeds17(state) : {};
  const services = co.mine ? (state.coServices17 || sd.service || []) : (co.services || []);
  const cocktails = co.mine ? (state.coCocktails17 || sd.cocktail || []) : (co.cocktails || []);
  return { services: services.filter(x => String(x.title || "").trim()), cocktails: cocktails.filter(x => String(x.name || "").trim()) };
}


function coPartners17(state, co) {
  const ids = (co && (co.mine ? (state.company || {}).partners : co.partners)) || [];
  return ids.map(id => companyById(state, id)).filter(Boolean);
}


const companyList = (state) => adminCompanies17(state, [
  ...(state.company && state.company.joinedAt ? [companyById(state, "mine")] : []),
  ...COMPANIES.map(x => companyById(state, x.id)).filter(Boolean),
]);
