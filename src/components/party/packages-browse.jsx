/* src/components/party/packages-browse.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const BCATS17 = [
  { k: "bar", label: "Bar", Ic: S17I.Martini }, { k: "ent", label: "Entertainment", Ic: S17I.Music },
  { k: "svc", label: "Services", Ic: S17I.Camera }, { k: "food", label: "Food", Ic: S17I.UtensilsCrossed },
];


const FFCAT17 = { svc_staffing: "svc" };


/* v17.4.7: the three selling points come from the package catalogue. */
const FEATS17 = PKG_CAT17.reduce((m, x) => { m[x.id] = x.points.slice(); return m; }, {});


const ALLB17 = ["s", "m", "l"];


/* Packages from FireFlair professionals (sample data in the prototype), beside the host's own. */
const SAMPLE_PKGS17 = [
  { id: "ex_dj", cat: "ent", tone: "platinum", level: "Entertainment", title: "Party DJ Set", tagline: "Music from first drinks to last dance.", includes: "DJ, speakers and lights", ideal: "Birthdays, weddings and parties", time: "4 hours", price: "", bands: ALLB17, by: "Tom Beatson" },
  { id: "ex_photo", cat: "svc", tone: "white", level: "Services", title: "Event Photography", tagline: "Natural, candid photos of your guests.", includes: "Photographer and an edited gallery", ideal: "Weddings, launches and parties", time: "3 hours", price: "", bands: ALLB17, by: "Jon Reeves" },
  { id: "ex_graze", cat: "food", tone: "white", level: "Food", title: "Grazing Table", tagline: "A generous spread, set up and cleared away.", includes: "Cheese, charcuterie, fruit and bread", ideal: "Garden parties and birthdays", time: "Set up 1 hour before", price: "", bands: ["s", "m"], by: "Sample caterer" },
  { id: "ex_canape", cat: "food", tone: "white", level: "Food", title: "Canapé Service", tagline: "Hot and cold canapés, served by staff.", includes: "Chef, serving staff and canapés", ideal: "Weddings, launches and corporate events", time: "2 hours", price: "", bands: ["m", "l"], by: "Sample caterer" },
];


/* DJ packages (Entertainment). Prototype content from Storm DJs' public packages, in FireFlair's own words. */
const DJ_PKGS17 = CONTENT_ADAPTER.djPackages();


const DJ_IDS17 = DJ_PKGS17.map((x) => x.id);


/* One DJ package per booking: choosing another swaps it in. */
const pkFlip17 = (pk, id) => pk.includes(id) ? pk.filter((x) => x !== id) : [...pk.filter((x) => !(DJ_IDS17.includes(id) && DJ_IDS17.includes(x))), id];


/* Preferred quality on FF Party: helps match packages and custom quotes. */
const QUALITY17 = [{ k: "bronze", label: "Best value" }, { k: "silver", label: "Best balance" }, { k: "gold", label: "Best quality" }];


const REC17 = { s: "up to 30 guests", m: "31 to 100 guests", l: "100+ guests", "s,m": "up to 100 guests", "m,l": "31+ guests" };


const recOf17 = (b) => REC17[(b || []).join(",")] || "parties of any size";


const lvl17 = (l) => (/^(bronze|silver|gold)$/i.test(l || "") ? "" : (l || ""));


function pkgsOf17(state) {
  const ff = [...(V101.PARTY_SERVICES || []).map(sv => ({ ...sv, features: FEATS17[sv.id], cat: FFCAT17[sv.id] || "bar", bands: SVC_BANDS11[sv.id] || ALLB17, ff: true })),     ...[...DJ_PKGS17, ...RTB_PKGS17].filter(x => !hid17(state, "packages", x.id)).map(x => ({ ...x, ff: true }))];
  const bt = ff.find(x => x.id === "svc_bartending");
  if (bt) ff.push({ ...bt, id: "svc_supplier", title: "Bar company supplier", tagline: "A bar company supplies the bar, the drinks and the team.", includes: "Bar, drinks and bartenders from one company",
    role: "Bartender", ideal: "Parties that want everything supplied", time: "From 4 hours", noPrice: true, drinks: true, shop: false,
    features: ["A bar company looks after your whole bar", "Bar, drinks and bartenders supplied", "Set-up, service and tidy-down included", "Chosen from FireFlair bar companies"] });
  const mine = myContent17(state, "services").filter(x => x.type !== "addon" && String(x.title).trim() && !hid17(state, "cards", x.id)).map(x => ({ ...svcFrom17(x), cat: x.cat || "bar", bands: (x.bands && x.bands.length) ? x.bands : ALLB17, mine: true }));
  return [...ff, ...mine, ...SAMPLE_PKGS17];
}


/* The same pick buttons as the glassware: one or several. */
function PkgPick17({ edit, multi, value = [], opts, onChange, cols = 3 }) {
  if (!edit) return <b>{opts.filter(([k]) => value.includes(k)).map(([, l]) => l).join(", ") || (multi ? "All sizes" : "Not set")}</b>;
  return (
    <div className={`ff-c17-glass pk c${cols}`} role={multi ? "group" : "radiogroup"}>
      {opts.map(([k, l]) => { const on = value.includes(k); return (
        <button key={k} type="button" role={multi ? "checkbox" : "radio"} aria-checked={on} className={on ? "on" : ""}
          onClick={() => onChange(multi ? (on ? value.filter(x => x !== k) : [...value, k]) : [k])}><small>{l}</small></button>); })}
    </div>
  );
}


/* What each FireFlair package is chosen from: the people who offer it (or the bar companies). */
const BNOUN17 = { svc_supplier: ["bar company", "bar companies"], svc_bartending: ["bartender", "bartenders"], svc_mixology: ["cocktail bartender", "cocktail bartenders"], svc_masterclass: ["mixologist", "mixologists"], svc_flair: ["flair bartender", "flair bartenders"], svc_full: ["bar company", "bar companies"], svc_staffing: ["event staff member", "event staff"] };



/* ---- Classic cocktail menu (launch scroller; the full 52 will live at ffparty.uk/menu) ------------------- */
/* Simple generated drink pictures until real photos are added: a glass, the liquid, a garnish. */
function drinkImg17(glass, a) {
  const G = { tall: "M121 30 L179 30 L174 150 L126 150 Z", short: "M114 72 L186 72 L180 150 L120 150 Z", martini: "M104 44 L196 44 L150 112 Z" }[glass] || "";
  const top = { tall: 30, short: 72, martini: 44 }[glass] || 44;
  const lv = top + (glass === "martini" ? 5 : 16);
  const rx = glass === "martini" ? 186 : 176, ry = top;
  const gar = {
    lime: `<circle cx="${rx}" cy="${ry}" r="15" fill="#4E8A1E"/><circle cx="${rx}" cy="${ry}" r="12" fill="#A7D45A"/><path d="M${rx} ${ry}V${ry - 12}M${rx} ${ry}L${rx + 10} ${ry - 6}M${rx} ${ry}L${rx + 10} ${ry + 6}M${rx} ${ry}L${rx} ${ry + 12}M${rx} ${ry}L${rx - 10} ${ry + 6}M${rx} ${ry}L${rx - 10} ${ry - 6}" stroke="#E6F3B8" stroke-width="1.4"/>`,
    orange: `<circle cx="${rx}" cy="${ry}" r="15" fill="#D9751A"/><circle cx="${rx}" cy="${ry}" r="12" fill="#F7A23C"/><path d="M${rx} ${ry}V${ry - 12}M${rx} ${ry}L${rx + 10} ${ry - 6}M${rx} ${ry}L${rx + 10} ${ry + 6}M${rx} ${ry}L${rx} ${ry + 12}M${rx} ${ry}L${rx - 10} ${ry + 6}M${rx} ${ry}L${rx - 10} ${ry - 6}" stroke="#FFD8A0" stroke-width="1.4"/>`,
    lemon: `<circle cx="${rx}" cy="${ry}" r="15" fill="#C9A81A"/><circle cx="${rx}" cy="${ry}" r="12" fill="#F6E27A"/><path d="M${rx} ${ry}V${ry - 12}M${rx} ${ry}L${rx + 10} ${ry + 6}M${rx} ${ry}L${rx - 10} ${ry + 6}" stroke="#FFF6C4" stroke-width="1.4"/>`,
    mint: `<g fill="#3E9A4A"><ellipse cx="140" cy="${top - 12}" rx="7" ry="13" transform="rotate(-28 140 ${top - 12})"/><ellipse cx="152" cy="${top - 16}" rx="7" ry="14"/><ellipse cx="164" cy="${top - 12}" rx="7" ry="13" transform="rotate(28 164 ${top - 12})"/></g>`,
    cherry: `<path d="M150 ${lv - 2}Q156 ${lv - 22} 170 ${top - 14}" stroke="#4a2a14" stroke-width="2" fill="none"/><circle cx="150" cy="${lv - 2}" r="8" fill="#B3122B"/><circle cx="147" cy="${lv - 5}" r="2.4" fill="#F3A0AC"/>`,
    bean: `<g fill="#3B2314"><ellipse cx="140" cy="${lv - 1}" rx="6" ry="3.6" transform="rotate(-20 140 ${lv - 1})"/><ellipse cx="152" cy="${lv - 2}" rx="6" ry="3.6"/><ellipse cx="164" cy="${lv - 1}" rx="6" ry="3.6" transform="rotate(20 164 ${lv - 1})"/></g>`,
    pine: `<path d="M${rx - 14} ${ry + 6}L${rx + 12} ${ry - 18}L${rx + 14} ${ry + 8}Z" fill="#F4CF3F"/><path d="M${rx + 12} ${ry - 18}l-4 -10 6 6 4 -9 2 11z" fill="#3E9A4A"/>`,
    passion: `<ellipse cx="150" cy="${lv - 3}" rx="22" ry="7" fill="#E8A21B"/><ellipse cx="150" cy="${lv - 3}" rx="14" ry="4.5" fill="#5B3A12"/>`,
    twist: `<path d="M${rx - 8} ${ry + 10}q10 -22 22 -6q-12 -10 -4 -22" stroke="#F09A28" stroke-width="3.4" fill="none" stroke-linecap="round"/>`,
    cream: `<ellipse cx="150" cy="${lv}" rx="${glass === "short" ? 30 : 36}" ry="4.5" fill="#FBF5E6"/>`,
  }[a.g] || "";
  const ice = a.ice ? [[130, lv + 14], [152, lv + 24], [136, lv + 46], [158, lv + 52], [140, lv + 72]].filter(q => q[1] < 138).map(q => `<rect x="${q[0]}" y="${q[1]}" width="19" height="19" rx="4" fill="#fff" opacity=".28" transform="rotate(${q[0] % 17} ${q[0] + 9} ${q[1] + 9})"/>`).join("") : "";
  const stem = glass === "martini" ? `<path d="M150 112V146M128 148Q150 142 172 148" stroke="rgba(255,255,255,.6)" stroke-width="3" fill="none" stroke-linecap="round"/>` : "";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 170" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="b" cx=".5" cy=".4" r=".8"><stop offset="0" stop-color="#4a2b1c"/><stop offset="1" stop-color="#120c09"/></radialGradient><clipPath id="g"><path d="${G}"/></clipPath></defs><rect width="300" height="170" fill="url(#b)"/><g fill="#E4C36A" opacity=".16"><circle cx="40" cy="38" r="20"/><circle cx="258" cy="56" r="26"/><circle cx="232" cy="130" r="14"/><circle cx="64" cy="124" r="11"/></g><ellipse cx="150" cy="152" rx="62" ry="8" fill="#000" opacity=".35"/>${stem}<g clip-path="url(#g)"><rect x="90" y="${lv}" width="120" height="120" fill="${a.c}"/>${a.top ? `<rect x="90" y="${lv}" width="120" height="${glass === "martini" ? 7 : 11}" fill="${a.top}"/>` : ""}${ice}</g><path d="${G}" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.65)" stroke-width="2" stroke-linejoin="round"/><path d="M${glass === "martini" ? 118 : 130} ${top + 6}L${glass === "martini" ? 140 : 134} ${glass === "martini" ? 64 : 138}" stroke="#fff" stroke-width="3" opacity=".25" stroke-linecap="round"/>${gar}</svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}


/* Ordered by how popular they are in UK bars (Bacardi Cocktail Trends 2025 top ten first, then the best-loved classics). */
const CLASSICS17 = [
  ["Margarita", "short", "Sharp lime, silver tequila and a salted rim.", [["50","Tequila"],["25","Lime juice"],["20","Triple sec"]], { c: "#D8E9A0", g: "lime", ice: true }],
  ["Mojito", "tall", "Fresh mint, lime and white rum, long and cool.", [["50","White rum"],["25","Lime juice"],["10","Mint leaves","sprig"],["60","Soda water"]], { c: "#DDEFC8", g: "mint", ice: true }],
  ["Passion Fruit Martini", "martini", "Passion fruit, vanilla and vodka, served with a glass of fizz.", [["40","Vodka"],["15","Passion fruit liqueur"],["30","Passion fruit purée"],["10","Vanilla syrup"],["10","Lime juice"]], { c: "#F2B632", top: "#F8D77A", g: "passion" }],
  ["Espresso Martini", "martini", "Cold, bold and silky, with a coffee-bean crown.", [["50","Vodka"],["30","Fresh espresso"],["20","Coffee liqueur"]], { c: "#2A150C", top: "#C9A06A", g: "bean" }],
  ["Cosmopolitan", "martini", "Crisp cranberry and citrus with a pink glow.", [["40","Citrus vodka"],["15","Triple sec"],["30","Cranberry juice"],["15","Lime juice"]], { c: "#E0506F", g: "orange" }],
  ["Piña Colada", "tall", "Rum, coconut and pineapple, holiday in a glass.", [["50","White rum"],["30","Coconut cream"],["90","Pineapple juice"]], { c: "#F8EDC4", g: "pine", ice: true }],
  ["Aperol Spritz", "tall", "Bittersweet orange bubbles over ice.", [["60","Aperol"],["90","Prosecco"],["30","Soda water"]], { c: "#F26B1D", g: "orange", ice: true }],
  ["Daiquiri", "martini", "Three ingredients, endlessly fresh: rum, lime, sugar.", [["60","White rum"],["25","Lime juice"],["15","Sugar syrup"]], { c: "#EDF3C6", g: "lime" }],
  ["Old Fashioned", "short", "Slow, strong and softly sweet: bourbon, bitters and orange oil.", [["60","Bourbon"],["1","Sugar cube","piece"],["2","Angostura bitters","dash"]], { c: "#B5651D", g: "twist", ice: true }],
  ["Negroni", "short", "Bitter, sweet and herbal in perfect thirds.", [["30","Gin"],["30","Campari"],["30","Sweet vermouth"]], { c: "#B3172B", g: "orange", ice: true }],
  ["Moscow Mule", "tall", "Ginger beer, vodka and lime with a spicy kick.", [["50","Vodka"],["15","Lime juice"],["120","Ginger beer"]], { c: "#F1E3A6", g: "lime", ice: true }],
  ["Tom Collins", "tall", "Lemony, fizzy gin, light and refreshing.", [["50","Gin"],["25","Lemon juice"],["15","Sugar syrup"],["60","Soda water"]], { c: "#F4F0C0", g: "lemon", ice: true }],
  ["Irish Coffee", "short", "Hot coffee, Irish whiskey and a float of cream.", [["40","Irish whiskey"],["120","Hot coffee"],["10","Sugar syrup"],["30","Cream"]], { c: "#2A150C", top: "#FBF5E6", g: "none" }],
  ["Whisky Sour", "short", "Silky, tart and rich with a foamy top.", [["50","Whisky"],["25","Lemon juice"],["15","Sugar syrup"],["20","Egg white"]], { c: "#E0A93C", top: "#FBF1D6", g: "cherry", ice: true }],
  ["Bramble", "short", "Gin and lemon, crowned with blackberry liqueur.", [["50","Gin"],["25","Lemon juice"],["12","Sugar syrup"],["15","Crème de mûre"]], { c: "#E8E2C2", g: "lemon", ice: true }],
  ["Manhattan", "martini", "Dark, smooth and stirred, the late-night classic.", [["50","Rye whiskey"],["20","Sweet vermouth"],["2","Angostura bitters","dash"]], { c: "#8A2A14", g: "cherry" }],
  ["Dry Martini", "martini", "Icy gin, a whisper of vermouth, a twist.", [["60","Gin"],["10","Dry vermouth"]], { c: "#EDF3F0", g: "twist" }],
  ["Dark & Stormy", "tall", "Dark rum over spicy ginger beer and lime.", [["50","Dark rum"],["10","Lime juice"],["100","Ginger beer"]], { c: "#4A2412", top: "#E8D9A0", g: "lime", ice: true }],
  ["Paloma", "tall", "Tequila and grapefruit soda, tangy and fun.", [["50","Tequila"],["15","Lime juice"],["100","Grapefruit soda"]], { c: "#F49A9A", g: "lime", ice: true }],
  ["Gin & Tonic", "tall", "Dry gin, bright tonic, a squeeze of citrus.", [["50","Gin"],["150","Tonic water"],["1","Lime","wedge"]], { c: "#E9F2E4", g: "lime", ice: true }],
  ["Lychee Martini", "martini", "Delicate lychee, vodka and lime, floral and silky.", [["50","Vodka"],["25","Lychee liqueur"],["15","Lime juice"]], { c: "#F6EFE4", g: "lime" }],
  ["Strawberry Daiquiri", "martini", "Ripe strawberry, white rum and lime, blended or shaken.", [["50","White rum"],["25","Lime juice"],["15","Sugar syrup"],["60","Fresh strawberries","piece"]], { c: "#E5405E", g: "lime" }],
  ["Mai Tai", "short", "Aged rum, orange curaçao and orgeat, tiki royalty.", [["40","Aged rum"],["20","Orange curaçao"],["15","Orgeat syrup"],["25","Lime juice"]], { c: "#E8913A", g: "mint", ice: true }],
  ["French 75", "tall", "Gin, lemon and Champagne, sharp, bright and celebratory.", [["30","Gin"],["15","Lemon juice"],["10","Sugar syrup"],["60","Champagne"]], { c: "#F6F0B8", g: "lemon" }],
  ["French Martini", "martini", "Vodka, raspberry and pineapple, fruity with a velvet top.", [["40","Vodka"],["15","Raspberry liqueur"],["30","Pineapple juice"]], { c: "#E7889B", top: "#F8D9DF", g: "none" }],
  ["Limoncello Spritz", "tall", "Limoncello and prosecco, sunny lemon over ice.", [["50","Limoncello"],["90","Prosecco"],["30","Soda water"]], { c: "#F6E27A", g: "lemon", ice: true }],
  ["Sarti Rosé Spritz", "tall", "Italian rosé aperitivo and prosecco, soft and pink.", [["50","Sarti Rosé"],["90","Prosecco"],["30","Soda water"]], { c: "#F3A0A8", g: "orange", ice: true }],
  ["Elderflower Spritz", "tall", "Elderflower, prosecco and soda, light and floral.", [["40","Elderflower liqueur"],["90","Prosecco"],["30","Soda water"]], { c: "#F3EFC3", g: "lemon", ice: true }],
  ["Spicy Margarita", "short", "Silver tequila, lime and fresh chilli with a salted rim.", [["50","Tequila"],["25","Lime juice"],["20","Triple sec"],["2","Chilli slices","piece"]], { c: "#E9C64A", g: "lime", ice: true }],
  ["Guava Margarita", "short", "Tequila and lime softened with tropical guava.", [["50","Tequila"],["25","Lime juice"],["20","Triple sec"],["40","Guava juice"]], { c: "#F29AA0", g: "lime", ice: true }],
  ["Strawberry Mojito", "tall", "Muddled strawberry, mint, lime and white rum.", [["50","White rum"],["25","Lime juice"],["10","Mint leaves","sprig"],["40","Fresh strawberries","piece"],["60","Soda water"]], { c: "#F2B6B8", g: "mint", ice: true }],
  ["Pineapple Mojito", "tall", "Sweet pineapple, mint and lime over crushed ice.", [["50","White rum"],["25","Lime juice"],["10","Mint leaves","sprig"],["50","Pineapple juice"],["60","Soda water"]], { c: "#F6EBA0", g: "mint", ice: true }],
  ["Mango Mojito", "tall", "Ripe mango, mint and lime, long and tropical.", [["50","White rum"],["25","Lime juice"],["10","Mint leaves","sprig"],["50","Mango purée"],["60","Soda water"]], { c: "#F7C25A", g: "mint", ice: true }],
  ["Peach Mojito", "tall", "Juicy peach, fresh mint and white rum.", [["50","White rum"],["25","Lime juice"],["10","Mint leaves","sprig"],["40","Peach purée"],["60","Soda water"]], { c: "#F8CFA0", g: "mint", ice: true }]
].map((r, i) => ({ id: "cl17_" + i, classic: true, style: "classic", kind: "cocktail", spirit: "", spiritOther: "", price: "", name: r[0], note: r[2], photo: VK_CK17[r[0]] || drinkImg17(r[1], r[4]), glass: r[1], glassOther: "",
  keywords: r[3].slice(0, 3).map(x => x[1]), ings: r[3].map((x, j) => ({ id: "cl17_" + i + "_" + j, amt: x[0], unit: x[2] === "dash" ? "dash" : x[2] === "sprig" ? "sprig" : x[2] === "wedge" ? "wedge" : x[2] ? "piece" : "ml", name: x[1], buy: "" })) }));


const MOCKS17 = [
  ["Virgin Mojito", "tall", "Fresh mint and lime with soda, all the freshness and none of the rum.", [["25","Lime juice"],["10","Mint leaves","sprig"],["15","Sugar syrup"],["100","Soda water"]], { c: "#DDEFC8", g: "mint", ice: true }],
  ["Virgin Piña Colada", "tall", "Coconut and pineapple, blended smooth.", [["30","Coconut cream"],["90","Pineapple juice"],["30","Lime juice"]], { c: "#F8EDC4", g: "pine", ice: true }],
  ["Shirley Temple", "tall", "Ginger ale and grenadine with a cherry, a party classic.", [["120","Ginger ale"],["15","Grenadine"],["1","Cherry","piece"]], { c: "#E8566A", g: "cherry", ice: true }],
  ["Cinderella", "tall", "Orange, pineapple and lemon over a splash of grenadine.", [["40","Orange juice"],["40","Pineapple juice"],["20","Lemon juice"],["10","Grenadine"]], { c: "#F4B04A", g: "orange", ice: true }],
  ["Virgin Mary", "tall", "Tomato, lemon and spice, with a little Worcestershire sauce.", [["120","Tomato juice"],["15","Lemon juice"],["2","Worcestershire sauce","dash"]], { c: "#C0392B", g: "lemon", ice: true }],
  ["Virgin Cosmopolitan", "martini", "Cranberry and lime, served up.", [["60","Cranberry juice"],["20","Lime juice"],["15","Sugar syrup"]], { c: "#E0506F", g: "orange" }],
  ["Strawberry Daiquiri", "martini", "Fresh strawberry and lime, no rum needed.", [["50","Strawberry purée"],["25","Lime juice"],["15","Sugar syrup"]], { c: "#EE6F86", g: "lime" }],
  ["Arnold Palmer", "tall", "Iced tea and lemonade, half and half.", [["100","Iced tea"],["100","Lemonade"]], { c: "#E2B34F", g: "lemon", ice: true }],
  ["Elderflower Fizz", "tall", "Light, floral and sparkling.", [["30","Elderflower cordial"],["15","Lemon juice"],["120","Soda water"]], { c: "#F1F0C8", g: "lemon", ice: true }],
  ["Virgin Moscow Mule", "tall", "Ginger beer and lime over ice.", [["15","Lime juice"],["150","Ginger beer"]], { c: "#F1E3A6", g: "lime", ice: true }],
].map((r, i) => ({ id: "mk17_" + i, classic: true, mock: true, style: "classic", kind: "cocktail", spirit: "", spiritOther: "", price: "", name: r[0], note: r[2], photo: drinkImg17(r[1], r[4]), glass: r[1], glassOther: "",
  keywords: r[3].slice(0, 3).map(x => x[1]), ings: r[3].map((x, j) => ({ id: "mk17_" + i + "_" + j, amt: x[0], unit: x[2] === "dash" ? "dash" : x[2] === "sprig" ? "sprig" : x[2] ? "piece" : "ml", name: x[1], buy: "" })) }));


const ALLCK17 = [...CLASSICS17, ...MOCKS17];


/* The cocktails chosen for an event, with servings (steps of 20), and a recipe scaled to those servings. */
const cocktailLines17 = (state, evId) => { const sel = ((state.addons17 || {})[evId || "draft"]) || {}; return [...ALLCK17, ...myContent17(state, "cocktails")].filter(c => sel[c.id] > 0).map(c => ({ c, qty: sel[c.id] })); };


const scaleAmt17 = (i, qty) => { const a = parseFloat(i.amt); if (!a) return "–"; const t = +(a * qty).toFixed(2), u = i.unit || "ml";
  if (u === "ml") return t >= 1000 ? `${+(t / 1000).toFixed(2)} litres` : `${t} ml`; if (u === "cl") return t >= 100 ? `${+(t / 100).toFixed(2)} litres` : `${t} cl`;
  if (u === "dash") return `${t} ${t === 1 ? "dash" : "dashes"}`; return `${t} ${u}${t === 1 ? "" : "s"}`; };


const CLASSIC_URL17 = CARD_DOMAIN + "/menu/classics";



/* A section that opens and closes, headed like Featured people. Closed until opened. */
function Fold17({ id, icon, title, count, big, shut, children }) {
  const { state, dispatch } = useStore();
  const v = state.categoryVisibility[id];
  const open = v === undefined ? !shut : v !== false;
  const tg = (
    <button type="button" onClick={() => dispatch({ type: "TOGGLE_CATEGORY", key: id, visible: !open })} aria-label={open ? "Hide this section" : "Show this section"} title={open ? "Hide" : "Show"} aria-expanded={open}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, flex: "none", border: "1px solid var(--gold-dk)", borderRadius: 8, background: open ? "rgba(201,162,39,.08)" : "transparent", color: "var(--gold-dk)" }}>
      <svg width="9" height="9" viewBox="0 0 10 10" style={{ transform: open ? "rotate(0deg)" : "rotate(-90deg)", transition: "transform .15s ease" }}><path d="M0 2 L10 2 L5 9 Z" fill="currentColor" /></svg>
    </button>);
  return (
    <section className={`ff-pn-sec ff-fold17${big ? " big" : ""}`} id={id}>
      {big ? <div className="ff-pbh17"><h3>{title}</h3>{count !== undefined && <span className="ff-pill">{count}</span>}<span className="line" />{tg}</div>
        : <SectionHead icon={icon} title={title} count={count} action={tg} />}
      {open && <div className="ff-fold17-b">{children}</div>}
    </section>);
}


/* A classic cocktail in a pop-up: the card, then add it to the basket or to favourites. */
function ClassicPop17({ c, onClose }) {
  const { state, dispatch } = useStore();
  const bk = bkOf17(state), fv = state.ckFav17 || [];
  const inB = bk.ck.includes(c.id), inF = fv.includes(c.id);
  const toggleB = () => { dispatch({ type: "V11_SET", patch: { bk17: { ...bk, ck: inB ? bk.ck.filter(x => x !== c.id) : [...bk.ck, c.id] } } }); if (!inB) dispatch({ type: "TOAST", toast: `${c.name} added to your basket` }); };
  const toggleF = () => { dispatch({ type: "V11_SET", patch: { ckFav17: inF ? fv.filter(x => x !== c.id) : [...fv, c.id] } }); if (!inF) dispatch({ type: "TOAST", toast: `${c.name} added to your favourites` }); };
  return (
    <Sheet open onClose={onClose} title={c.name}>
      <div className="ff-pop17 ff-ckpop17">
        <Card17 kind="cocktail" tone="dark" plate={c.mock ? "Classic Mocktail" : "Classic Cocktail"} size="lg" url={CLASSIC_URL17}><CocktailFront17 c={c} /></Card17>
        <div className="ff-ckpop17-act">
          <button type="button" className={`pri${inB ? " on" : ""}`} aria-pressed={inB} disabled={!inB && bk.ck.length >= 10} onClick={toggleB}>{inB ? <><S17I.Check size={16} strokeWidth={2.6} /> In your basket</> : bk.ck.length >= 10 ? "Basket full" : <><S17I.Plus size={16} /> Add to basket</>}</button>
          <button type="button" className={`sec${inF ? " on" : ""}`} aria-pressed={inF} onClick={toggleF}><S17I.Heart size={16} fill={inF ? "currentColor" : "none"} /> {inF ? "In your favourites" : "Add to favourites"}</button>
        </div>
      </div>
    </Sheet>);
}


const byobOf17 = (state) => { const bart = pkgsOf17(state).find(x => x.id === "svc_bartending"); return bart && { ...bart, noPrice: true, shop: false, title: "BYOB", tagline: "Bring your own booze. We provide the bartender, you provide the drinks.", includes: "Our best value package",
    features: ["A professional bartender for your event", "Bar set-up and drinks service", "You provide the drinks", "Our best value package"] }; };


function CocktailBrowser17({ onPkg }) {
  const [pop, setPop] = useState(null);
  const B = useBk17();
  const [mode, setMode] = useState("cocktails");
  const [q, setQ] = useState("");
  const { state } = useStore();
  const bart = pkgsOf17(state).find(x => x.id === "svc_bartending");
  const supp = pkgsOf17(state).find(x => x.id === "svc_supplier");
  const byob = byobOf17(state);
  const n = q.trim().toLowerCase();
  const list = (mode === "mocktails" ? MOCKS17 : CLASSICS17).filter(c => !n || (c.name + " " + (c.keywords || []).join(" ")).toLowerCase().includes(n));
  const stdItems = mode === "standard" ? [byob, supp].filter(x => x && (!n || (x.title + " bring your own booze supplier bar company").toLowerCase().includes(n))) : [];
  return (
    <Fold17 big id="ff-br17-ck" title="Choose your drinks" count={CLASSICS17.length + MOCKS17.length + 2}>
      <div className="ff-ck17-bar">
        <div className="sort" role="radiogroup" aria-label="Cocktails, mocktails or standard drinks">
          {[["cocktails", "Cocktails"], ["mocktails", "Mocktails"], ["standard", "Standard drinks"]].map(([k, l]) => (
            <button key={k} type="button" role="radio" aria-checked={mode === k} className={mode === k ? "on" : ""} onClick={() => setMode(k)}>{l}</button>))}
        </div>
        <label className="srch"><S17I.Search size={15} /><input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search drinks" aria-label="Search drinks" /></label>
      </div>
      {mode === "standard" ? (
        stdItems.length ? <HScroll label="Standard drinks">{stdItems.map(x => <div className="ff-br17-co" key={x.title}><PkgCard17 svc={x} n={0} noun="" on={B.bk.pk.includes(x.id)} onToggle={() => B.togglePk(x.id)} onInfo={() => onPkg(x)} /></div>)}</HScroll>
          : <p className="ff-br17-soon">No drinks match.</p>
      ) : (<>
        <p className="ff-br17-cksub">We recommend choosing 3 to 5 different drinks.</p>
        {list.length ? <HScroll label={mode === "mocktails" ? "Mocktails" : "Cocktails"}>{list.map(c => (
          <div key={c.id} className={`ff-br17-ckw${B.bk.ck.includes(c.id) ? " sel" : ""}`} data-ck17={c.id}>
            <button type="button" className="ff-br17-ckc" aria-pressed={B.bk.ck.includes(c.id)} aria-label={`${c.name}, classic ${c.mock ? "mocktail" : "cocktail"}: ${B.bk.ck.includes(c.id) ? "selected" : "select"}`} onClick={() => B.toggleCk(c.id)}>
              <Card17 kind="cocktail" tone="dark" plate={c.mock ? "Classic Mocktail" : "Classic Cocktail"} size="sm" url={CLASSIC_URL17}><CocktailFront17 c={c} /></Card17>
            </button>
            <button type="button" className="inf" aria-label={`${c.name}: details`} onClick={() => setPop(c)}><S17I.Info size={16} strokeWidth={2} /></button>
          </div>))}</HScroll> : <p className="ff-br17-soon">No drinks match.</p>}
      </>)}
      {pop && <ClassicPop17 c={pop} onClose={() => setPop(null)} />}
    </Fold17>);
}


/* Tips and requests on the booking confirmation, between the event invoice and FireFlair's own invoice. */
function TipRequest17({ ev, attach }) {
  const { state, dispatch } = useStore();
  const all = state.req17 || {};
  const r = all[ev.id] || { tip: "", disc: false, ask: "" };
  const put = (p) => { dispatch({ type: "V11_SET", patch: { req17: { ...all, [ev.id]: { ...r, ...p } } } }); if ("ask" in p) dispatch({ type: "EVENT_PATCH", id: ev.id, patch: { request: p.ask } }); };
  const num = (v) => String(v).replace(/[^0-9]/g, "").slice(0, 5);
  return (
    <div className={`ff-req17${attach ? " attach" : ""}`} role="group" aria-label="Tips and requests">
      <h3 className="ff-fh">Tips and requests</h3>
      <label className="amt"><span>Add a tip</span><span className="f"><i>£</i><input inputMode="numeric" value={r.tip} onChange={(e) => put({ tip: num(e.target.value) })} aria-label="Tip in pounds" /></span></label>
      <label className="tick"><span>Request a charitable discount</span><input type="checkbox" checked={r.disc === true} onChange={(e) => put({ disc: e.target.checked })} /><i aria-hidden="true">{r.disc === true && <S17I.Check size={16} strokeWidth={3} />}</i></label>
      <label className="ta"><span>Special requests</span><textarea rows={3} value={r.ask} onChange={(e) => put({ ask: e.target.value.slice(0, 500) })} placeholder="Glassware, stock or anything else you would like" aria-label="Special requests" /></label>
    </div>);
}



/* The basket on FF Party browse: packages, extras and classic cocktails, kept until the event is made. */
/* The confirm spin button: the spinning FF coin from the booking pages, used wherever something is confirmed or saved. */
function ConfirmSpin17({ lines, onClick, disabled, label, done, note }) {
  return (
    <div className={`ff-cs17${note ? " has-note" : ""}`}>
      <Spin3D11 half={8} inset="0px" className="cfm" back={<div className="ff-cfm-back big"><span className="lg" /></div>}>
        <button type="button" className={`ff-cfm11${done ? " done" : ""}`} disabled={disabled} aria-label={label || lines.filter(l => l !== "&").join(" ")} onClick={onClick}>
          <span className="unit">{lines.map((l, i) => l === "&" ? <i key={i} className="amp" aria-hidden="true">&amp;</i> : <b key={i}>{l}</b>)}</span>
        </button>
      </Spin3D11>
      {note && <p className="note" role="status">{note}</p>}
    </div>);
}


/* People for a package: your favourites first, then the nearest to your event. */
function orderPeople17(state, all, svcId, venue) {
  const favs = state.favs || [], home = areaKey11(venue) || "Central London";
  const dist = (p) => { const a = personArea11(p); if (!a || !MAP_AREAS[a] || !MAP_AREAS[home]) return 999; const [x1, y1] = MAP_AREAS[a], [x2, y2] = MAP_AREAS[home]; return Math.hypot(x1 - x2, y1 - y2); };
  return all.filter(p => p.id !== "me" && !p.isCompany && signedUp11(p, svcId === "svc_full" ? "svc_bartending" : svcId))
    .map(p => ({ p, fav: favs.includes(p.id), d: dist(p) })).sort((a, b) => (b.fav - a.fav) || (a.d - b.d)).slice(0, 14);
}


const bkOf17 = (state) => ({ pk: [], ex: [], ck: [], pp: [], ...(state.bk17 || {}) });


/* Tapping a card selects it (gold highlight) and puts it in the basket; tapping again takes it out. */
function useBk17() {
  const { state, dispatch } = useStore();
  const bk = bkOf17(state);
  const set = (b) => dispatch({ type: "V11_SET", patch: { bk17: b } });
  const flip = (key, id) => set({ ...bk, [key]: bk[key].includes(id) ? bk[key].filter(x => x !== id) : [...bk[key], id] });
  return { bk, togglePk: (id) => set({ ...bk, pk: pkFlip17(bk.pk, id) }), toggleEx: (id) => flip("ex", id), togglePp: (id) => flip("pp", id),
    toggleCk: (id) => { if (!bk.ck.includes(id) && bk.ck.length >= 10) { dispatch({ type: "TOAST", toast: "Your basket is full" }); return; } flip("ck", id); } };
}


const SHOP17 = ["svc_bartending", "svc_mixology", "svc_flair"];


const shop17 = (svc) => SHOP17.includes(svc.id) && svc.shop !== false;


const ADDONS17 = [
  { id: "ax_staff", title: "Staff service", tagline: "Extra hands to serve, set up and tidy away.", note: "From £50", Ic: S17I.Users },
  { id: "ax_stock", title: "Stock delivery", tagline: "Your drinks and mixers delivered to the venue.", Ic: S17I.Truck },
  { id: "ax_ice", title: "Ice delivery", tagline: "Ice delivered in time for the first drink.", Ic: S17I.Snowflake },
  { id: "ax_glass", title: "Glassware delivery", tagline: "Your choice of glassware, delivered and collected.", Ic: S17I.Wine },
];


/* Raise the Bar packages and cocktail add-ons (v17.3.138): one add-on card per cocktail per size. */
const RTB_SIZES17 = CONTENT_ADAPTER.raiseTheBarSizes();


const RTB_PKGS17 = [
  { id: "rtb_bar", cat: "bar", tone: "silver", level: "Mobile bar", by: "Raise the Bar", co: "co_raise-the-bar", img: RTB_BLOB17 + "1769265189036.jpg", role: "Bartender", drinks: true, title: "Mobile Cocktail Bar", tagline: "A fully staffed mobile cocktail bar with the cocktails you choose.",
    includes: "Mixologist, mobile bar, menu, spirits, ice and glassware", ideal: "Weddings, parties and corporate events", time: "3 hours of service", price: "From £400", bands: ALLB17,
    features: ["Professional mixologist", "Fully stocked mobile bar", "Printed cocktail menu of your choices", "Premium spirits, liqueurs, mixers and fresh ingredients", "Garnishes, ice and all glassware", "3 hours of service, team arrives 30 minutes early", "Travel within 30 miles of Glasgow included", "Public liability insurance", "Choose your cocktails from the add-ons below"] },
  { id: "rtb_class", cat: "bar", tone: "gold", level: "Masterclass", by: "Raise the Bar", co: "co_raise-the-bar", img: RTB_BLOB17 + "1783870927210.jpg", role: "Bartender", drinks: true, noPrice: true, title: "Cocktail Masterclass", tagline: "Learn to shake, stir and garnish with professional mixologists.",
    includes: "Mixologist, equipment, set-up and clean-up", ideal: "Team events, hen parties and private groups", time: "Arranged by enquiry", price: "", bands: ALLB17,
    features: ["Hands-on cocktail making", "Interactive demonstrations", "Classic, signature and alcohol-free options", "Mixologist brings all equipment", "Set-up and clean-up handled", "Quoted for your group size and venue"] },
  { id: "rtb_whisky", cat: "bar", tone: "bronze", level: "Tasting", by: "Raise the Bar", co: "co_raise-the-bar", img: RTB_BLOB17 + "1776281026122.jpg", role: "Bartender", drinks: true, noPrice: true, title: "Whisky Tasting", tagline: "A guided Scotch whisky tasting led by kilted hosts.",
    includes: "Hosts, curated drams, tasting notes and stories", ideal: "Client entertainment and private groups", time: "Arranged by enquiry", price: "", bands: ALLB17,
    features: ["Curated selection of drams", "Distillery history and storytelling", "Tasting notes included", "Beginner or advanced format", "Anywhere in Scotland", "Quoted for your group size and venue"] },
];


const RTB_ADDONS17 = RTB_MENU17.flatMap(([name, i, m, p], n) => [i, m, p].map((pr, k) => pr ? { id: "rtb_" + n + "_" + "imp"[k], title: name, sz: RTB_SIZES17[k][1], rtb: "imp"[k], tagline: RTB_SIZES17[k][1] + ", " + RTB_SIZES17[k][2], note: rtbMoney17(pr) + (k ? "" : " each"), Ic: S17I.Wine } : null).filter(Boolean));


const ALLAX17 = [...ADDONS17, ...RTB_ADDONS17];


function RtbAddons17() {
  const { state } = useStore();
  const B = useBk17();
  const bk = bkOf17(state);
  return React.createElement(Fold17, { big: true, shut: true, id: "ff-br17-rtb", title: "Raise the Bar cocktails", count: RTB_ADDONS17.length },
    RTB_SIZES17.map(([k, label, note]) => React.createElement("div", { className: "ff-br17-row", key: k },
      React.createElement("h3", { className: "ff-br17-h3" }, label + " · " + note),
      React.createElement(HScroll, { label }, RTB_ADDONS17.filter((a) => a.rtb === k).map((a) => { const on = bk.ex.includes(a.id); return React.createElement("div", { className: "ff-br17-co", key: a.id },
        React.createElement("button", { type: "button", className: "ff-ax17" + (on ? " sel" : ""), "aria-pressed": on, onClick: () => B.toggleEx(a.id) },
          React.createElement("span", { className: "ic" }, React.createElement(a.Ic, { size: 26, strokeWidth: 1.5 })),
          React.createElement("b", null, a.title), React.createElement("small", null, a.tagline), React.createElement("span", { className: "nt" }, a.note),
          React.createElement("span", { className: "go" }, on ? React.createElement(React.Fragment, null, React.createElement(S17I.Check, { size: 13, strokeWidth: 2.6 }), " Selected") : "Select"))); })))));
}


const BIMG17 = { bar: "px_bar", ent: "dream_music_festivals", svc: "reward_photoshoot", food: "dream_food_festivals_markets" };


const BTEXT17 = { bar: "Bar packages", ent: "Music and performers", svc: "Photo and more", food: "Catering" };



/* The pillar boxes: four tiles and one panel joined by a single outline. The same markup, classes and outline as the homepage pillars. */
function PillarBox17({ items, open, onPick, label, children }) {
  const [shape, setShape] = useState(null);
  const well = useRef(null), bar = useRef(null), panel = useRef(null);
  useLayoutEffect(() => {
    if (!open) { setShape(null); return; }
    const calc = () => {
      const w = well.current, b = bar.current, p = panel.current; if (!w || !b || !p) return;
      const t = b.querySelector(`[data-k="${open}"]`); if (!t) return;
      const wr = w.getBoundingClientRect(), pr = p.getBoundingClientRect(), tr = t.getBoundingClientRect();
      const px0 = pr.left - wr.left, px1 = pr.right - wr.left, py0 = pr.top - wr.top, py1 = pr.bottom - wr.top;
      const tx0 = Math.max(tr.left - wr.left, px0), tx1 = Math.min(tr.right - wr.left, px1), ty0 = tr.top - wr.top;
      const mob = window.innerWidth < 760;
      const R = mob ? 12 : 18, rt = mob ? 18 : 22, rc = mob ? 22 : 30, rp = 8;
      const gl = tx0 - px0, gr = px1 - tx1;
      const fL = gl < 3, fR = gr < 3, Rl = gl < 7 ? 0 : Math.min(R, gl), Rr = gr < 7 ? 0 : Math.min(R, gr);
      let d = `M${px0},${py1 - rc} `;
      if (fL) d += `L${px0},${ty0 + rt} A${rt},${rt} 0 0 1 ${px0 + rt},${ty0} `;
      else d += `L${px0},${py0 + rp} A${rp},${rp} 0 0 1 ${px0 + rp},${py0} L${tx0 - Rl},${py0} A${Rl},${Rl} 0 0 0 ${tx0},${py0 - Rl} L${tx0},${ty0 + rt} A${rt},${rt} 0 0 1 ${tx0 + rt},${ty0} `;
      d += `L${tx1 - rt},${ty0} `;
      if (fR) d += `A${rt},${rt} 0 0 1 ${px1},${ty0 + rt} L${px1},${py1 - rc} `;
      else d += `A${rt},${rt} 0 0 1 ${tx1},${ty0 + rt} L${tx1},${py0 - Rr} A${Rr},${Rr} 0 0 0 ${tx1 + Rr},${py0} L${px1 - rp},${py0} A${rp},${rp} 0 0 1 ${px1},${py0 + rp} L${px1},${py1 - rc} `;
      d += `A${rc},${rc} 0 0 1 ${px1 - rc},${py1} L${px0 + rc},${py1} A${rc},${rc} 0 0 1 ${px0},${py1 - rc} Z`;
      const fills = [];
      if (!fL && Rl > 5) fills.push(`M${tx0 - Rl},${py0} A${Rl},${Rl} 0 0 0 ${tx0},${py0 - Rl} L${tx0},${py0} Z`);
      if (!fR && Rr > 5) fills.push(`M${tx1},${py0 - Rr} A${Rr},${Rr} 0 0 0 ${tx1 + Rr},${py0} L${tx1},${py0} Z`);
      setShape({ w: Math.round(wr.width), h: Math.round(wr.height), d, fills, tx: Math.round(tx0 - px0), tw: Math.round(tx1 - tx0), tr: Math.round(Math.max(0, gr)) });
    };
    calc();
    const b = bar.current, ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(calc) : null;
    if (ro) { ro.observe(panel.current); ro.observe(well.current); }
    window.addEventListener("resize", calc);
    if (b) b.addEventListener("scroll", calc, { passive: true });
    return () => { if (ro) ro.disconnect(); window.removeEventListener("resize", calc); if (b) b.removeEventListener("scroll", calc); };
  }, [open, items.length]);
  const cur = items.find(c => c.k === open);
  return (
    <section className={`ff-sect ff-dx ff-pb17-dx${cur ? " is-open" : ""}`} aria-label={label}>
      <div className="ff-dx-well" ref={well}>
        <div className="ff-dx-bar" ref={bar} role="group" aria-label={label}>
          {items.map(c => { const on = open === c.k; return (
            <button key={c.k} type="button" data-k={c.k} className={`ff-dx-tile${on ? " on" : ""}`} aria-expanded={on} onClick={() => onPick(on ? "" : c.k)}>
              <span className="ph">{c.img ? <img decoding="async" src={c.img} alt="" draggable={false} /> : null}</span>
              <span className="chev" aria-hidden="true"><I11.ChevronDown size={14} strokeWidth={2.4} /></span>
              <span className="tx"><b>{c.t}</b><small>{c.s}</small></span>
            </button>); })}
        </div>
        {cur && (
          <div className="ff-dx-panel ff-pb17-panel" ref={panel} role="region" aria-label={cur.t} style={shape ? { "--tx": `${shape.tx}px`, "--tw": `${shape.tw}px`, "--tr": `${shape.tr}px` } : undefined}>{children}</div>)}
        {cur && shape && (
          <svg className="ff-dx-svg" width={shape.w} height={shape.h} viewBox={`0 0 ${shape.w} ${shape.h}`} aria-hidden="true" focusable="false">
            {shape.fills.map((p, n) => <path key={n} d={p} className="fl" />)}
            <path d={shape.d} className="ln" />
          </svg>)}
      </div>
    </section>);
}


function PartyBrowse17() {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const [q, setQ] = useState(() => state.netQuery || "");
  useEffect(() => { if (state.netQuery) dispatch({ type: "NET_QUERY", q: "" }); }, []);
  const br = state.br17 || {};
  const p2 = ph17(state) === 2;
  const qual = br.q || "";
  const [pop, setPop] = useState(null);
  const cos = companyList(state).filter(c => !c.mine && !c.unclaimed);
  const feat = TOP_STAFF11.map(id => all.find(p => p.id === id)).filter(Boolean);
  const bk = bkOf17(state);
  const pkgs = pkgsOf17(state);
  const band = br.band || "";
  const items = [...bk.pk.map(id => { const x = pkgs.find(y => y.id === id); const Ic = x && (PKICON17[x.cat] || S17I.Sparkles); return x && { key: id, label: x.id === "svc_supplier" ? "Supplier" : x.title, icon: <Ic size={20} strokeWidth={1.5} />, rm: () => ({ ...bk, pk: bk.pk.filter(y => y !== id) }) }; }),
    ...bk.ck.map(id => { const x = ALLCK17.find(y => y.id === id); return x && { key: id, label: x.name, thumb: x.photo, rm: () => ({ ...bk, ck: bk.ck.filter(y => y !== id) }) }; }),
    ...bk.pp.map(id => { if (id.startsWith("auto:")) return { key: id, label: "Auto match", icon: <Coin size={30} tier="gold" />, rm: () => ({ ...bk, pp: bk.pp.filter(y => y !== id) }) };
      const x = all.find(y => y.id === id); return x && { key: id, label: firstName(x.name), thumb: x.photo, rm: () => ({ ...bk, pp: bk.pp.filter(y => y !== id) }) }; }),
    ...bk.ex.map(id => { const x = ALLAX17.find(y => y.id === id); return x && { key: id, label: x.title + (x.sz ? " · " + x.sz : ""), icon: <x.Ic size={20} strokeWidth={1.5} />, rm: () => ({ ...bk, ex: bk.ex.filter(y => y !== id) }) }; })].filter(Boolean);
  const cont = () => {
    const label = (PARTY_BANDS11.find(b => b.k === band) || {}).guests || "";
    let ev = state.events.find(e => e.id === state.activeEventId);
    let evId = ev && ev.id;
    if (!evId) {
      evId = uid("evt");
      dispatch({ type: "EVENT_ADD", event: { id: evId, ...eventData11({ ...eventDraft11(null), band, aud: "", guests: label }), band, audience: "", site: "party", phone: state.bookPhone || "", email: state.bookEmail || "", questionIds: [] } });
      dispatch({ type: "ACTIVE_EVENT", id: evId });
    } else if (band && !ev.band) dispatch({ type: "EVENT_PATCH", id: evId, patch: { band, guests: label } });
    if (qual) dispatch({ type: "EVENT_PATCH", id: evId, patch: { quality: qual } });
    bk.pk.forEach(id => {
      const svc = pkgs.find(y => y.id === id); if (!svc) return;
      const who = all.filter(p => (bk.pp || []).includes(p.id) && signedUp11(p, svc.id === "svc_full" ? "svc_bartending" : svc.id)).map(p => p.id), auto = (bk.pp || []).includes("auto:" + svc.id);
      const had = state.shifts.find(x => x.eventId === evId && x.svcId === svc.id);
      if (had) { if (who.length) dispatch({ type: "SHIFT_STAFF", id: had.id, staffIds: [...new Set([...(had.staffIds || []), ...who])] }); return; }
      dispatch({ type: "SHIFT_ADD", shift: { id: uid("shf"), eventId: evId, staffIds: who, staffId: who[0] || "", skills: [], ...(auto ? { route: "auto" } : {}), qty: 1, dress: "", notes: "", tcs: "company", rate: "", total: "", hoursM: "", pay: svc.price,
        role: svc.title, matchRole: svc.role || SVC_ROLE[svc.id] || svc.title, svcId: svc.id, svcPrice: svc.price, svcTime: svc.time, svcLevel: svc.level, provider: svc.by || "",
        time: svcTimeFor(svc, (ev && ev.start) || ""), date: (ev && ev.date) || "", iso: (ev && ev.iso) || "", venue: (ev && ev.venue) || "" } });
    });
    const ao = state.addons17 || {}, sel = { ...(ao[evId] || {}) };
    bk.ck.forEach(id => { if (!sel[id]) sel[id] = 20; });
    dispatch({ type: "V11_SET", patch: { addons17: { ...ao, [evId]: sel }, xa17: { ...(state.xa17 || {}), [evId]: bk.ex }, bkView: { eventId: evId } } });
    dispatch({ type: "TAB", tab: "bookings" }); window.scrollTo(0, 0);
  };
  useLiveAction17({
    status: items.length ? "Your basket" : "",
    chips: items.map(i => ({ key: i.key, label: i.label, thumb: i.thumb, icon: i.icon, onRemove: () => dispatch({ type: "V11_SET", patch: { bk17: i.rm() } }) })),
    actions: items.length ? [{ key: "go", label: bk.pk.length ? "Continue to your event" : "Add a service to continue", coin: true, disabled: !bk.pk.length, onClick: cont }] : [],
  }, [JSON.stringify(bk), band, qual, state.activeEventId, state.events.length, state.shifts.length]);
  return React.createElement("div", { className: "ff-pn ff-br17" },
    React.createElement(BigHead20, { tag: "h1", title: "Our network" }),
    p2 && React.createElement("p", { className: "ff-br17-launch", role: "note" }, React.createElement("b", null, "FireFlair is launching with bar packages."), " Every other profession on the platform will be added later."),
    React.createElement(FFAI, { query: q, onQuery: setQ, title: "Search for your team", context: "FF Party", purpose: "Find the right people for your event: search by name, profession, skill or area.", placeholder: "Name, profession, skill or area\u2026" }),
    pop && React.createElement(PkgSheet17, { svc: pop, qual: qual, onClose: function () { setPop(null); } }),
    state.netBrief && React.createElement(BookingBrief, { brief: state.netBrief }),
    !state.netBrief && React.createElement(NetBrowse17, { query: q, onPick: function (p) { dispatch({ type: "VIEW", id: p.id }); }, scope: "staff_", after: !q ? React.createElement(NetMap11, null) : null }));
}
