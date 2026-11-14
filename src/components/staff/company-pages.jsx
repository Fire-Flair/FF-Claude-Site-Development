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


/* A card as people see it: open it for every photo, the full text and the PDF. */
function CoCardPop17({ card, onClose }) {
  const photos = card ? coPhotos17(card) : [];
  const doc = card && card.document && card.document.name ? card.document : null;
  return (
    <Sheet open={!!card} onClose={onClose} title={card ? card.name : ""} center>
      {card ? <div className="ff-coqa17-pop">
        {photos.length > 0 && <div className={"ff-co-pop-ph n" + Math.min(photos.length, 5)}>{photos.map((src, i) => <img key={i} decoding="async" src={src} alt="" referrerPolicy="no-referrer" />)}</div>}
        {String(card.description || "").trim() ? <p className="ff-co-pop-tx">{card.description}</p> : null}
        {doc ? (doc.dataUrl ? <a className="ff-btn sm" href={doc.dataUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}><I11.FileText size={13} /> {doc.name}</a> : <span className="ff-body"><I11.FileText size={13} /> {doc.name}</span>) : null}
      </div> : null}
    </Sheet>
  );
}


/* Boxes in a row: a squircle per card with its first photo, its title and its text. A number shows when the section is numbered. */
function CoBoxes17({ cards, label, numbered, onOpen }) {
  return (
    <HScroll label={label}>
      {cards.map((r, i) => {
        const ph = coPhotos17(r)[0];
        return (
          <button key={r.id} type="button" className="ff-co-box" onClick={() => onOpen(r)}>
            {ph ? <img decoding="async" src={ph} alt="" loading="lazy" referrerPolicy="no-referrer" onError={(e) => { if (/^https?:/.test(ph)) e.currentTarget.style.display = "none"; }} /> : null}
            {numbered ? <span className="no">{String(i + 1).padStart(2, "0")}</span> : null}
            <b>{r.name}</b>
            {String(r.description || "").trim() ? <span className="tx">{r.description}</span> : null}
          </button>
        );
      })}
    </HScroll>
  );
}


/* One section's cards. Every card with a photo: the photo grid (title and text as the caption). Otherwise: boxes in a row. */
function CoCardsView17({ cards, label, numbered, onOpen }) {
  if (!cards.length) return null;
  if (cards.every((r) => coPhotos17(r).length)) {
    return (
      <div className="ff-vk-grid">
        {cards.map((r, i) => {
          const more = coPhotos17(r).length > 1 || (r.document && r.document.name);
          const inner = <>
            <img decoding="async" src={coPhotos17(r)[0]} alt={r.name || ""} loading="lazy" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.visibility = "hidden"; }} />
            <figcaption>{numbered ? <span className="no">{String(i + 1).padStart(2, "0")}</span> : null}{r.name ? <b>{r.name}</b> : null}{String(r.description || "").trim() ? <small>{r.description}</small> : null}</figcaption>
          </>;
          return more
            ? <figure key={r.id} className="ff-vk-it"><button type="button" className="ff-vk-itb" onClick={() => onOpen(r)}>{inner}</button></figure>
            : <figure key={r.id} className="ff-vk-it">{inner}</figure>;
        })}
      </div>
    );
  }
  return <CoBoxes17 cards={cards} label={label} numbered={numbered} onOpen={onOpen} />;
}


/* A company's own "More information" sections, as people see them. Reads the one company shape (sections plus their cards). */
function CoInfo17({ co }) {
  const [pop, setPop] = useState(null);
  return (
    <>
      <CoCardPop17 card={pop} onClose={() => setPop(null)} />
      {coSections17(co).map((sec, si) => {
        const cards = coShownCards17(coSecAll17(co, sec));
        const paras = String(sec.text || "").split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
        const chips = (sec.chips || []).filter(Boolean);
        if (!cards.length && !paras.length && !sec.lead && !sec.quote && chips.length) {
          return (
            <section key={sec.id || si} className="ff-copub-sec"><SectionHead icon={<I11.Star size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title={sec.title} />
              <div className="ff-copub-chips">{chips.map((x) => <span key={x}>{x}</span>)}</div></section>
          );
        }
        return (
          <VkFold17 key={sec.id || si} title={sec.title} count={cards.length || null}>
            {sec.lead ? <h4 className="ff-vk-h">{sec.lead}</h4> : null}
            {paras.map((p, i) => <p key={"p" + i} className="ff-body ff-vk-p">{p}</p>)}
            {chips.length ? <div className="ff-copub-chips">{chips.map((x) => <span key={x}>{x}</span>)}</div> : null}
            <CoCardsView17 cards={cards} label={sec.title} numbered={!!sec.numbered} onOpen={setPop} />
            {sec.quote ? <p className="ff-vk-quote">{sec.quote}</p> : null}
          </VkFold17>
        );
      })}
    </>
  );
}


/* Packages and Cocktails: simple cards in a row, each opening its photos and full text. */
function CoSimpleRow17({ cards, label }) {
  const [pop, setPop] = useState(null);
  return (
    <>
      <CoBoxes17 cards={cards} label={label} onOpen={setPop} />
      <CoCardPop17 card={pop} onClose={() => setPop(null)} />
    </>
  );
}


/* Raise the Bar Glasgow: their page is data/companies/profiles/raise-the-bar.json like every other company.
   These three constants are only for the FF Party package browser (packages-browse.jsx). */
const RTB_BLOB17 = "https://6istx3ephgqw5ngz.public.blob.vercel-storage.com/cocktails/";


const RTB_MENU17 = CONTENT_ADAPTER.raiseTheBarMenu();


const rtbMoney17 = (n) => "£" + (n % 1 ? n.toFixed(2) : String(n));


const COMPANY_PAGES = {
  /* The same source the DEV owner's account is built from. */
  ...Object.fromEntries(REAL_COMPANIES11.map(realPage11)),
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
