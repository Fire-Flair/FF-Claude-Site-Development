/* src/components/party/cocktails.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   COCKTAILS (v16.15) — Cocktail Cards (the "Menu Cards" of the spec):
   ingredients with measures (garnish included) and the glass as an icon.
   52 FireFlair classics, one for every card in a deck: four suits of 13.
   Bartenders and businesses add their own Signature Cocktail Cards on their
   profile, with the same card editor as everything else. Hosts choose
   cocktails on FF Party's Cocktails page; the choice goes on the Event Card
   (event.cocktails) and the recipes go on the invoice.
   HONEST STATUS: the 52 are a starter list for Alex to confirm or replace.
   ========================================================================== */
const GLASSES = [
  { key: "rocks", label: "Rocks" }, { key: "coupe", label: "Coupe" }, { key: "martini", label: "Martini" },
  { key: "highball", label: "Highball" }, { key: "flute", label: "Flute" }, { key: "wine", label: "Wine glass" },
  { key: "mug", label: "Copper mug" }, { key: "hurricane", label: "Hurricane" }, { key: "julep", label: "Julep cup" },
  { key: "toddy", label: "Toddy glass" },
];


const glassLabel = (k) => (GLASSES.find(g => g.key === k) || {}).label || "";



/* Drawn glass shapes, so the glass reads at a glance. */
function GlassIcon({ glass = "rocks", size = 24, color = "currentColor", strokeWidth = 1.5 }) {
  const P = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const shapes = {
    rocks: <><path d="M5 7h14l-1.4 11.6a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 7z" {...P} /><path d="M6 12.5h12" {...P} /></>,
    coupe: <><path d="M3.5 6c0 3.6 3.8 6.2 8.5 6.2S20.5 9.6 20.5 6H3.5z" {...P} /><path d="M12 12.2V19.5M8 20h8" {...P} /></>,
    martini: <><path d="M3.5 4.5h17L12 13.5 3.5 4.5z" {...P} /><path d="M12 13.5V19.5M8 20h8M7 8h10" {...P} /></>,
    highball: <><path d="M7 3.5h10l-1 16.8a.8.8 0 0 1-.8.7H8.8a.8.8 0 0 1-.8-.7L7 3.5z" {...P} /><path d="M7.4 9.5h9.2" {...P} /></>,
    flute: <><path d="M9 3h6c0 5.8-.9 8.9-3 10-2.1-1.1-3-4.2-3-10z" {...P} /><path d="M12 13v6.5M9 20h6M9.4 7h5.2" {...P} /></>,
    wine: <><path d="M6.5 3h11c0 5.2-2.4 8.3-5.5 8.3S6.5 8.2 6.5 3z" {...P} /><path d="M12 11.3v8.2M8.5 20h7M7.1 6.5h9.8" {...P} /></>,
    mug: <><path d="M5 6h11v13a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 19V6z" {...P} /><path d="M16 9h2a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2M5 10h11" {...P} /></>,
    hurricane: <><path d="M8 3h8c0 3-1.8 4.2-1.8 6.8 0 2.8 2.8 3.9 2.8 7.2 0 1.8-2 2.6-5 2.6s-5-.8-5-2.6c0-3.3 2.8-4.4 2.8-7.2C9.8 7.2 8 6 8 3z" {...P} /><path d="M9 21h6" {...P} /></>,
    julep: <><path d="M6 6h12l-1.1 13.6a1.5 1.5 0 0 1-1.5 1.4H8.6a1.5 1.5 0 0 1-1.5-1.4L6 6z" {...P} /><path d="M10 6c-.4-1.8.4-3 2.2-3.4M13 6c.6-1.4 1.8-2 3.2-1.8" {...P} /></>,
    toddy: <><path d="M6 4h11l-1 9.5a3 3 0 0 1-3 2.7h-3a3 3 0 0 1-3-2.7L6 4z" {...P} /><path d="M17 6h1.3A1.7 1.7 0 0 1 20 7.7v1.6A1.7 1.7 0 0 1 18.3 11H16.6M11.5 16.2V20M8.5 20.5h6M6.4 8h10.2" {...P} /></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block", flex: "none" }}>{shapes[glass] || shapes.rocks}</svg>;
}



const SUITS = {
  S: { sym: "♠", name: "Spades", label: "Whisky & Brandy", red: false },
  H: { sym: "♥", name: "Hearts", label: "Gin", red: true },
  D: { sym: "♦", name: "Diamonds", label: "Vodka & Sparkling", red: true },
  C: { sym: "♣", name: "Clubs", label: "Rum & Tequila", red: false },
};


const RANKS = ["A", "K", "Q", "J", "10", "9", "8", "7", "6", "5", "4", "3", "2"];


const cslug = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");


const deal = (suit, list) => list.map(([name, base, glass, desc, ing], i) => ({ id: `cl_${cslug(name)}`, suit, rank: RANKS[i], name, base, glass, desc, ing }));



const CLASSICS = [
  ...deal("S", [
    ["Old Fashioned", "Bourbon", "rocks", "Whisky, sugar and bitters, stirred long and slow.", ["50ml bourbon", "10ml sugar syrup", "2 dashes Angostura bitters", "Garnish: orange zest"]],
    ["Manhattan", "Rye whiskey", "coupe", "Rye and sweet vermouth: rich, smooth and timeless.", ["50ml rye whiskey", "20ml sweet vermouth", "2 dashes Angostura bitters", "Garnish: cocktail cherry"]],
    ["Whisky Sour", "Bourbon", "rocks", "Sharp, silky and balanced, with a soft foam.", ["50ml bourbon", "25ml lemon juice", "20ml sugar syrup", "15ml egg white or aquafaba", "Garnish: Angostura drops and a cherry"]],
    ["Penicillin", "Blended Scotch", "rocks", "Smoky Scotch, honey, ginger and lemon.", ["50ml blended Scotch", "25ml lemon juice", "20ml honey-ginger syrup", "7.5ml Islay whisky float", "Garnish: candied ginger"]],
    ["Mint Julep", "Bourbon", "julep", "Bourbon and fresh mint over crushed ice.", ["60ml bourbon", "10ml sugar syrup", "8 mint leaves", "Crushed ice", "Garnish: mint sprig"]],
    ["Boulevardier", "Bourbon", "rocks", "The whisky lover's Negroni.", ["30ml bourbon", "30ml Campari", "30ml sweet vermouth", "Garnish: orange zest"]],
    ["Sazerac", "Rye whiskey", "rocks", "New Orleans' own: rye, Peychaud's and an absinthe rinse.", ["50ml rye whiskey", "5ml sugar syrup", "3 dashes Peychaud's bitters", "Absinthe rinse", "Garnish: lemon zest"]],
    ["Rob Roy", "Scotch", "coupe", "A Manhattan made with Scotch.", ["50ml blended Scotch", "25ml sweet vermouth", "2 dashes Angostura bitters", "Garnish: cocktail cherry"]],
    ["Irish Coffee", "Irish whiskey", "toddy", "Hot coffee, Irish whiskey and a float of cream.", ["40ml Irish whiskey", "90ml hot filter coffee", "15ml brown sugar syrup", "30ml lightly whipped cream"]],
    ["Godfather", "Scotch", "rocks", "Scotch softened with amaretto. Two ingredients, no fuss.", ["45ml blended Scotch", "15ml amaretto", "Garnish: orange zest"]],
    ["Sidecar", "Cognac", "coupe", "Cognac, orange liqueur and lemon, with a sugar rim.", ["50ml cognac", "20ml triple sec", "20ml lemon juice", "Garnish: sugar rim and orange zest"]],
    ["Brandy Alexander", "Cognac", "coupe", "Creamy, chocolatey and made for after dinner.", ["30ml cognac", "30ml dark crème de cacao", "30ml single cream", "Garnish: grated nutmeg"]],
    ["Vieux Carré", "Rye & cognac", "rocks", "Rye, cognac and vermouth: the French Quarter in a glass.", ["25ml rye whiskey", "25ml cognac", "25ml sweet vermouth", "5ml Bénédictine", "1 dash Peychaud's bitters", "1 dash Angostura bitters", "Garnish: lemon zest"]],
  ]),
  ...deal("H", [
    ["Martini", "Gin", "martini", "Ice-cold gin and a whisper of dry vermouth.", ["60ml London dry gin", "10ml dry vermouth", "Garnish: lemon twist or olive"]],
    ["Negroni", "Gin", "rocks", "Equal parts gin, Campari and sweet vermouth.", ["30ml gin", "30ml Campari", "30ml sweet vermouth", "Garnish: orange slice"]],
    ["French 75", "Gin & Champagne", "flute", "Gin, lemon and Champagne. Celebration in a glass.", ["30ml gin", "15ml lemon juice", "10ml sugar syrup", "Top Champagne", "Garnish: lemon twist"]],
    ["Bramble", "Gin", "rocks", "Gin and blackberry over crushed ice. A London classic.", ["50ml gin", "25ml lemon juice", "12.5ml sugar syrup", "15ml crème de mûre", "Garnish: blackberry and lemon slice"]],
    ["Tom Collins", "Gin", "highball", "Long, fresh and fizzy: grown-up gin lemonade.", ["50ml gin", "25ml lemon juice", "15ml sugar syrup", "Top soda water", "Garnish: lemon slice and cherry"]],
    ["Aviation", "Gin", "coupe", "Gin, maraschino and violet: pale sky blue.", ["45ml gin", "15ml maraschino liqueur", "7.5ml crème de violette", "15ml lemon juice", "Garnish: cocktail cherry"]],
    ["Clover Club", "Gin", "coupe", "Gin and raspberry with a silky pink foam.", ["45ml gin", "15ml raspberry syrup", "15ml lemon juice", "15ml egg white or aquafaba", "Garnish: fresh raspberries"]],
    ["Gin Basil Smash", "Gin", "rocks", "Bright green, herbal and very drinkable.", ["50ml gin", "25ml lemon juice", "15ml sugar syrup", "Handful of basil leaves", "Garnish: basil sprig"]],
    ["Southside", "Gin", "coupe", "Gin, lime and mint, shaken hard.", ["50ml gin", "25ml lime juice", "15ml sugar syrup", "6 mint leaves", "Garnish: mint leaf"]],
    ["Gimlet", "Gin", "coupe", "Gin and lime, crisp and simple.", ["50ml gin", "20ml lime juice", "15ml sugar syrup", "Garnish: lime wheel"]],
    ["White Lady", "Gin", "coupe", "Gin, orange liqueur and lemon, with a soft foam.", ["40ml gin", "20ml triple sec", "20ml lemon juice", "15ml egg white or aquafaba", "Garnish: lemon zest"]],
    ["Singapore Sling", "Gin", "hurricane", "Tropical, fruity and famously from Raffles.", ["30ml gin", "15ml cherry liqueur", "7.5ml triple sec", "7.5ml Bénédictine", "100ml pineapple juice", "15ml lime juice", "10ml grenadine", "1 dash Angostura bitters", "Garnish: pineapple and cherry"]],
    ["Last Word", "Gin", "coupe", "Gin, green Chartreuse, maraschino and lime in equal parts.", ["22.5ml gin", "22.5ml green Chartreuse", "22.5ml maraschino liqueur", "22.5ml lime juice", "Garnish: cocktail cherry"]],
  ]),
  ...deal("D", [
    ["Espresso Martini", "Vodka", "coupe", "Vodka, coffee liqueur and fresh espresso. The party starter.", ["50ml vodka", "25ml coffee liqueur", "25ml fresh espresso", "10ml sugar syrup", "Garnish: three coffee beans"]],
    ["Pornstar Martini", "Vanilla vodka", "coupe", "Passion fruit and vanilla, with a prosecco shot on the side.", ["40ml vanilla vodka", "15ml passion fruit liqueur", "30ml passion fruit purée", "15ml lime juice", "10ml vanilla syrup", "50ml prosecco, served on the side", "Garnish: half a passion fruit"]],
    ["Cosmopolitan", "Citrus vodka", "martini", "Cranberry pink, sharp and sophisticated.", ["40ml citrus vodka", "15ml triple sec", "15ml lime juice", "30ml cranberry juice", "Garnish: orange zest"]],
    ["Moscow Mule", "Vodka", "mug", "Vodka, lime and fiery ginger beer in a copper mug.", ["50ml vodka", "15ml lime juice", "Top ginger beer", "Garnish: lime wedge and mint"]],
    ["Bloody Mary", "Vodka", "highball", "The savoury classic, spiced to taste.", ["50ml vodka", "100ml tomato juice", "15ml lemon juice", "3 dashes Worcestershire sauce", "2 dashes Tabasco", "Pinch of celery salt and black pepper", "Garnish: celery stick and lemon wedge"]],
    ["Sex on the Beach", "Vodka", "highball", "Peach, orange and cranberry. Sunshine in a glass.", ["40ml vodka", "20ml peach schnapps", "40ml orange juice", "40ml cranberry juice", "Garnish: orange slice"]],
    ["White Russian", "Vodka", "rocks", "Vodka, coffee liqueur and cream.", ["50ml vodka", "20ml coffee liqueur", "30ml single cream"]],
    ["Lemon Drop", "Citrus vodka", "martini", "Sweet, sour and sugar-rimmed.", ["40ml citrus vodka", "20ml triple sec", "20ml lemon juice", "10ml sugar syrup", "Garnish: sugar rim and lemon twist"]],
    ["Aperol Spritz", "Aperol & prosecco", "wine", "Bittersweet orange and bubbles. Summer's favourite.", ["60ml Aperol", "90ml prosecco", "Splash of soda water", "Garnish: orange slice"]],
    ["Bellini", "Prosecco", "flute", "White peach and prosecco, from Harry's Bar in Venice.", ["50ml white peach purée", "100ml prosecco"]],
    ["Kir Royale", "Champagne", "flute", "Champagne with a blush of blackcurrant.", ["15ml crème de cassis", "125ml Champagne", "Garnish: blackberry"]],
    ["Mimosa", "Champagne", "flute", "Fresh orange juice and fizz. Brunch, sorted.", ["75ml fresh orange juice", "75ml Champagne or prosecco"]],
    ["Champagne Cocktail", "Champagne", "flute", "A sugar cube, bitters, cognac and Champagne.", ["1 sugar cube", "2 dashes Angostura bitters", "10ml cognac", "Top Champagne", "Garnish: orange twist"]],
  ]),
  ...deal("C", [
    ["Mojito", "White rum", "highball", "Rum, lime and mint, topped with soda.", ["50ml white rum", "25ml lime juice", "20ml sugar syrup", "8 mint leaves", "Top soda water", "Garnish: mint sprig and lime wedge"]],
    ["Margarita", "Tequila", "coupe", "Tequila, lime and orange liqueur, salt on the rim.", ["50ml tequila blanco", "25ml lime juice", "20ml triple sec", "Garnish: salt rim and lime wheel"]],
    ["Daiquiri", "White rum", "coupe", "Rum, lime and sugar. Simple and perfect.", ["50ml white rum", "25ml lime juice", "15ml sugar syrup", "Garnish: lime wheel"]],
    ["Piña Colada", "White rum", "hurricane", "Rum, coconut and pineapple, blended or shaken.", ["50ml white rum", "30ml coconut cream", "90ml pineapple juice", "Garnish: pineapple wedge and cherry"]],
    ["Mai Tai", "Aged rum", "rocks", "Two rums, orange, almond and lime. Tiki royalty.", ["30ml aged rum", "30ml Jamaican rum", "15ml orange curaçao", "15ml orgeat syrup", "25ml lime juice", "Garnish: mint sprig and lime shell"]],
    ["Dark and Stormy", "Dark rum", "highball", "Dark rum floated over spicy ginger beer.", ["50ml dark rum", "10ml lime juice", "Top ginger beer", "Garnish: lime wedge"]],
    ["Paloma", "Tequila", "highball", "Tequila and pink grapefruit soda. Mexico's favourite.", ["50ml tequila blanco", "15ml lime juice", "Pinch of salt", "Top pink grapefruit soda", "Garnish: grapefruit wedge"]],
    ["Tommy's Margarita", "Tequila", "rocks", "Tequila, lime and agave. No orange liqueur needed.", ["50ml tequila blanco", "25ml lime juice", "12.5ml agave syrup", "Garnish: lime wedge"]],
    ["Tequila Sunrise", "Tequila", "highball", "Orange juice and tequila with a grenadine sunrise.", ["45ml tequila blanco", "90ml orange juice", "15ml grenadine", "Garnish: orange slice and cherry"]],
    ["Caipirinha", "Cachaça", "rocks", "Brazil's national cocktail: cachaça, lime and sugar.", ["50ml cachaça", "Half a lime, cut into wedges", "2 tsp caster sugar", "Crushed ice"]],
    ["Zombie", "Three rums", "hurricane", "Three rums, citrus and spice. Strictly one per guest.", ["25ml white rum", "25ml gold rum", "20ml overproof dark rum", "20ml lime juice", "20ml grapefruit juice", "15ml falernum", "10ml grenadine", "1 dash Angostura bitters", "Garnish: mint sprig"]],
    ["Hemingway Daiquiri", "White rum", "coupe", "A daiquiri with grapefruit and maraschino.", ["50ml white rum", "15ml maraschino liqueur", "20ml grapefruit juice", "15ml lime juice", "Garnish: lime wheel"]],
    ["Cuba Libre", "White rum", "highball", "Rum, cola and a squeeze of lime.", ["50ml white rum", "10ml lime juice", "Top cola", "Garnish: lime wedge"]],
  ]),
];



/* Signature Cocktail Cards from the demo network: bartenders and a bar. */
const DEMO_SIGNATURES = [
  { id: "sig_sam_maple", by: "stf_sam", name: "Smoked Maple Old Fashioned", glass: "rocks",
    description: "Sammy's house Old Fashioned: maple instead of sugar, finished with a wisp of oak smoke.",
    ingredients: ["50ml bourbon", "10ml maple syrup", "2 dashes Angostura bitters", "1 dash orange bitters", "Garnish: orange zest and a torched cinnamon stick"] },
  { id: "sig_ava_garden", by: "stf_ava", name: "Garden Party Spritz", glass: "wine",
    description: "Elderflower, cucumber and prosecco. Ava's go-to for summer weddings.",
    ingredients: ["25ml gin", "20ml elderflower liqueur", "15ml lemon juice", "75ml prosecco", "Top soda water", "Garnish: cucumber ribbon and mint"] },
  { id: "sig_loft_caramel", by: "co_vooshka", name: "Salted Caramel Espresso Martini", glass: "coupe",
    description: "An Espresso Martini with salted caramel.",
    ingredients: ["40ml vodka", "20ml coffee liqueur", "25ml fresh espresso", "15ml salted caramel syrup", "Garnish: three coffee beans"] },
];



const ingredientsOf = (x) => Array.isArray(x && x.ing) ? x.ing
  : Array.isArray(x && x.ingredients) ? x.ingredients
  : String((x && x.ingredients) || "").split("\n").map(s => s.trim()).filter(Boolean);


/* "50ml bourbon" → "Bourbon"; garnishes left out. For one-line summaries. */
const keyIngredients = (x, n = 3) => ingredientsOf(x).filter(s => !/^garnish/i.test(s))
  .map(s => s.replace(/^(\d+\s+dash(es)?( of)?|dash( of)?|\d[\d.,½¼¾/]*\s*(ml|cl|tsp|tbsp)?|top|splash of|pinch of|half a|handful of)\s*/i, "").replace(/,.*$/, ""))
  .map(s => s.charAt(0).toUpperCase() + s.slice(1)).slice(0, n);



/* Every Signature Cocktail Card the page can offer: the demo network's,
   plus your own (FF Team profile) and your company's (FF Staff / FF Party). */
function allSignatures(state, directory) {
  const people = directory || adminPeople17(state, state.directory || []);
  const demo = DEMO_SIGNATURES.map(s => {
    const p = people.find(x => x.id === s.by);
    const co = !p && COMPANIES.find(x => x.id === s.by);
    return { ...s, creator: p ? { name: p.name, photo: p.photo, tier: p.tier, kind: "person", id: p.id } : { name: co ? co.name : "FireFlair", kind: "company" } };
  });
  const mine = recsOf(state.profile, "cocktails").filter(r => !r.hidden && !r.proposed && r.name).map(r => ({
    id: r.id, name: r.name, glass: r.glass, description: r.description, ingredients: ingredientsOf(r), photo: r.photo,
    creator: { name: state.profile.name || "You", photo: state.profile.photo, tier: state.profile.tier, kind: "person", id: "me" },
  }));
  const co = state.company ? recsOf(state.company, "cocktails").filter(r => !r.hidden && r.name).map(r => ({
    id: r.id, name: r.name, glass: r.glass, description: r.description, ingredients: ingredientsOf(r), photo: r.photo,
    creator: { name: state.company.name || "Your company", kind: "company" },
  })) : [];
  return [...mine, ...co, ...demo];
}


const cocktailById = (state, id, directory) => CLASSICS.find(c => c.id === id) || allSignatures(state, directory).find(s => s.id === id) || null;



/* The cocktail menu: on the open Event Card, or a draft until one is saved. */
const emptyMenu = () => ({ picks: [], mode: "start", count: "" });


function useCocktailMenu() {
  const { state, dispatch } = useStore();
  const ev = state.events.find(e => e.id === state.activeEventId);
  const menu = { ...emptyMenu(), ...((ev && ev.cocktails) || state.cocktailMenu || {}) };
  const set = (patch) => dispatch({ type: "COCKTAILS_PATCH", patch });
  return { menu, set, ev };
}


const menuLine = (menu) => {
  const n = parseInt(menu && menu.count, 10);
  return `${n ? `${n} cocktails` : "Cocktails"} · ${menu && menu.mode === "whole" ? "the whole event" : "to get started"}`;
};



/* Every cocktail card is the same card: black, gold rim, the banner at the top (Card17 + CocktailFront17).
   These adapt the older cocktail records (classics with a suit, signatures with a creator) to it. */
const ckGlass17 = (g) => ({ tall: "tall", highball: "tall", collins: "tall", julep: "tall", hurricane: "tall", tiki: "tall",
  short: "short", rocks: "short", martini: "martini", coupe: "martini", flute: "martini", wine: "martini" }[g] || "short");


function ckAdapt17(x) {
  const g = ckGlass17(x.glass);
  const base = CLASSICS17.find(c => c.name === x.name);
  return {
    name: x.name, glass: g, keywords: keyIngredients(x, 4),
    note: x.desc || x.description || (base && base.note) || "",
    photo: x.photo || (base && base.photo) || drinkImg17(g, { c: "#8A4B2A", ice: g !== "martini" }),
  };
}



/* A classic cocktail card. */
function CocktailPlayingCard({ c, on, onOpen, onToggle }) {
  return (
    <div className={`ff-ccard17${on ? " on" : ""}`}>
      <button type="button" className="ff-ccard17-hit" onClick={onOpen} aria-label={`${c.name}: see the recipe`}>
        <Card17 kind="cocktail" tone="dark" plate="Classic Cocktail" size="sm" url={CLASSIC_URL17}><CocktailFront17 c={ckAdapt17(c)} /></Card17>
      </button>
      {onToggle && (
        <button type="button" className="ff-ccard-add" aria-pressed={on} onClick={onToggle}
          aria-label={on ? `Take ${c.name} off your menu` : `Add ${c.name} to your menu`}>
          {on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} />}
        </button>
      )}
    </div>
  );
}



/* A Signature Cocktail Card: the same card, made by a bartender or a bar. */
function SignatureCocktailCard({ s, on, onOpen, onToggle }) {
  return (
    <div className={`ff-ccard17${on ? " on" : ""}`}>
      <button type="button" className="ff-ccard17-hit" onClick={onOpen} aria-label={`${s.name}, signature cocktail by ${s.creator.name}: see the recipe`}>
        <Card17 kind="cocktail" tone="dark" plate="Signature Cocktail" size="sm" url={`By ${s.creator.name}`}><CocktailFront17 c={ckAdapt17(s)} /></Card17>
      </button>
      {onToggle && (
        <button type="button" className="ff-ccard-add" aria-pressed={on} onClick={onToggle}
          aria-label={on ? `Take ${s.name} off your menu` : `Add ${s.name} to your menu`}>
          {on ? <Check size={14} strokeWidth={2.6} /> : <Plus size={14} />}
        </button>
      )}
    </div>
  );
}



function RecipeList({ items }) {
  return (
    <div className="ff-recipes">
      {items.map(x => (
        <div key={x.id} className="ff-recipe">
          <div className="ff-recipe-head">
            <span className="gl"><GlassIcon glass={x.glass} size={22} /></span>
            <span style={{ minWidth: 0, flex: 1 }}>
              <b>{x.name}</b>
              <small>{x.suit ? `${x.rank}${SUITS[x.suit].sym} · FireFlair classic` : `Signature · ${x.creator ? x.creator.name : ""}`} · {glassLabel(x.glass)}</small>
            </span>
          </div>
          <ul>{ingredientsOf(x).map((g, i) => <li key={i} className={/^garnish/i.test(g) ? "gn" : ""}>{g}</li>)}</ul>
        </div>
      ))}
    </div>
  );
}



function CocktailDetailSheet({ item, on, onToggle, onClose }) {
  if (!item) return null;
  const classic = !!item.suit;
  return (
    <Sheet open onClose={onClose} title={item.name}>
      <div className="ff-cdetail">
        {classic ? <div style={{ width: 268, maxWidth: "100%", margin: "0 auto" }}><CocktailPlayingCard c={item} on={on} onOpen={() => {}} /></div>
          : <p className="ff-body" style={{ margin: "0 0 4px", fontSize: 13 }}>Signature Cocktail Card by <b>{item.creator.name}</b></p>}
        <p className="ff-serif" style={{ fontSize: 17, lineHeight: 1.45, margin: "12px 0" }}>{classic ? item.desc : item.description}</p>
        <RecipeList items={[item]} />
      </div>
      <Btn variant={on ? "ghost wide" : "primary wide"} onClick={() => { onToggle(); onClose(); }}>
        {on ? <><X size={14} /> Take off my menu</> : <><Plus size={14} /> Add to my cocktail menu</>}
      </Btn>
    </Sheet>
  );
}



/* Recipes for the chosen cocktails. The same list goes on the invoice. */
function RecipeSheet({ open, items, menu, onClose }) {
  if (!open) return null;
  return (
    <Sheet open onClose={onClose} title="Recipe sheet">
      <div className="ff-pendingnote" style={{ marginTop: 0, marginBottom: 12 }}>
        <Receipt size={15} /><span>These recipes are added to your invoice when it's generated. {menu ? menuLine(menu) : ""}.</span>
      </div>
      {items.length ? <RecipeList items={items} /> : <p className="ff-body ff-muted">No cocktails chosen yet.</p>}
    </Sheet>
  );
}



/* Event page: the cocktail menu on this Event Card, with its recipe sheet. */
function EventCocktails({ event }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const [sheet, setSheet] = useState(false);
  const cm = { ...emptyMenu(), ...(event.cocktails || {}) };
  const items = cm.picks.map(id => cocktailById(state, id, directory)).filter(Boolean);
  return (
    <div className="ff-panel ff-evcocktails">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Martini size={18} color="var(--gold-dk)" />
        <div className="ff-label" style={{ flex: 1 }}>Cocktails</div>
        {items.length > 0 && <Pill tone="gold">{menuLine(cm)}</Pill>}
      </div>
      {items.length ? (
        <div className="ff-cpicks">{items.map(x => <span key={x.id} className="ff-cpick"><GlassIcon glass={x.glass} size={15} /> {x.name}</span>)}</div>
      ) : <p className="ff-body" style={{ margin: "8px 0 0", fontSize: 13.5 }}>No cocktails yet. Choose from 52 FireFlair classics and bartenders' signatures.</p>}
      <div className="ff-cmenu-acts">
        <Btn variant="sm" onClick={() => { dispatch({ type: "TAB", tab: "home", route: "cocktails" }); window.scrollTo(0, 0); }}><Martini size={12} /> {items.length ? "Change cocktails" : "Choose cocktails"}</Btn>
        <Btn variant="sm" disabled={!items.length} onClick={() => setSheet(true)}><Receipt size={12} /> Recipe sheet</Btn>
      </div>
      {items.length > 0 && <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "8px 0 0" }}>The recipes are added to your invoice when it's generated.</p>}
      <RecipeSheet open={sheet} items={items} menu={cm} onClose={() => setSheet(false)} />
    </div>
  );
}



/* Your cocktail menu: what's chosen, for how long, and how many. */
function CocktailMenuPanel({ onRecipes, compact }) {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const { menu, set, ev } = useCocktailMenu();
  const items = menu.picks.map(id => cocktailById(state, id, directory)).filter(Boolean);
  const guests = parseInt((ev && (ev.guests || (ev.poster && ev.poster.guests))) || "", 10) || 0;
  const per = menu.mode === "whole" ? [2, 3, 4] : [1, 2];
  const site = hireSiteOf(state);
  const backToCard = () => { dispatch({ type: "TAB", tab: "home", route: "staffHome" }); setTimeout(() => scrollToSection(site.anchor), 140); };
  return (
    <div className={`ff-panel ff-cmenu${compact ? " compact" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <Martini size={18} color="var(--gold-dk)" />
        <div className="ff-label" style={{ flex: 1 }}>Your cocktail menu</div>
        <Pill tone="gold">{items.length} chosen</Pill>
      </div>
      {items.length ? (
        <div className="ff-cpicks">
          {items.map(x => (
            <span key={x.id} className="ff-cpick">
              <GlassIcon glass={x.glass} size={15} /> {x.name}
              <button type="button" aria-label={`Take ${x.name} off your menu`} onClick={() => set({ picks: menu.picks.filter(id => id !== x.id) })}><X size={12} /></button>
            </span>
          ))}
        </div>
      ) : <p className="ff-body" style={{ margin: "8px 0 0", fontSize: 13.5 }}>Tap + on any card below to add it. Choose as many as you like.</p>}
      <div className="ff-cmenu-row">
        <span className="ff-label">Cocktails for</span>
        <span className="ff-seg" role="group" aria-label="Cocktails for">
          <button type="button" aria-pressed={menu.mode !== "whole"} onClick={() => set({ mode: "start" })}>To get started</button>
          <button type="button" aria-pressed={menu.mode === "whole"} onClick={() => set({ mode: "whole" })}>The whole event</button>
        </span>
      </div>
      <div className="ff-cmenu-row">
        <label className="ff-label" htmlFor="ff-ccount">How many cocktails?</label>
        <input id="ff-ccount" className="ff-input ff-ccount" inputMode="numeric" value={menu.count || ""} placeholder="e.g. 100"
          onChange={(e) => set({ count: e.target.value.replace(/\D/g, "").slice(0, 5) })} />
        {guests > 0 && per.map(k => (
          <button key={k} type="button" className="ff-opt" aria-pressed={String(menu.count) === String(guests * k)} onClick={() => set({ count: String(guests * k) })}>
            {k} each · {guests * k}
          </button>
        ))}
      </div>
      <div className="ff-cmenu-acts">
        <Btn variant="sm" disabled={!items.length} onClick={onRecipes}><Receipt size={12} /> Recipe sheet</Btn>
        {ev ? <Btn variant="sm primary" onClick={backToCard}><Check size={12} /> Saved to {ev.title}</Btn>
          : <Btn variant="sm primary" onClick={backToCard}><Calendar size={12} /> Create my Event Card</Btn>}
      </div>
      {!ev && items.length > 0 && <p className="ff-body ff-muted" style={{ fontSize: 12, margin: "8px 0 0" }}>Your choices go onto your Event Card when you save it.</p>}
    </div>
  );
}



/* FF Party · Cocktails page. */
function CocktailsPage() {
  const { state, dispatch } = useStore();
  const directory = useDirectory();
  const { menu, set } = useCocktailMenu();
  const [suit, setSuit] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [sheet, setSheet] = useState(false);
  const site = hireSiteOf(state);
  const n = q.trim().toLowerCase();
  const match = (x) => !n || [x.name, x.base, ...(ingredientsOf(x))].join(" ").toLowerCase().includes(n);
  const sigs = allSignatures(state, directory).filter(match);
  const toggle = (id) => {
    const on = menu.picks.includes(id);
    set({ picks: on ? menu.picks.filter(x => x !== id) : [...menu.picks, id] });
    const item = cocktailById(state, id, directory);
    dispatch({ type: "TOAST", toast: on ? `${item ? item.name : "Cocktail"} taken off your menu` : `${item ? item.name : "Cocktail"} added to your menu` });
  };
  const items = menu.picks.map(id => cocktailById(state, id, directory)).filter(Boolean);
  const back = () => { dispatch({ type: "TAB", tab: "home", route: "staffHome" }); setTimeout(() => scrollToSection(site.anchor), 140); };
  const suitKeys = suit === "all" ? Object.keys(SUITS) : [suit];

  return (
    <div>
      <button className="ff-btn sm ghost" style={{ marginBottom: 14 }} onClick={back}><ChevronLeft size={13} /> {site.name}</button>
      <div className="ff-eyebrow">{site.name} · Cocktails</div>
      <h1 className="ff-h1" style={{ marginTop: 4 }}>Choose your cocktails</h1>
      <p className="ff-body" style={{ marginTop: 6, maxWidth: 680 }}>
        52 FireFlair classics, one for every card in the deck, plus Signature Cocktail Cards from bartenders and bars.
        Book cocktails to get your guests started or for the whole event. The recipes for everything you choose are added to your invoice.
      </p>

      <CocktailMenuPanel onRecipes={() => setSheet(true)} />

      <div className="ff-cfilter">
        <div className="ff-searchfield" style={{ flex: "1 1 220px" }}>
          <Search size={16} color="var(--gold-dk)" aria-hidden="true" />
          <label className="ff-sr" htmlFor="ff-csearch">Search cocktails</label>
          <input id="ff-csearch" className="ff-input" type="search" placeholder="Gin, espresso, mint…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="ff-chipset" role="group" aria-label="Suits">
          <button type="button" className="ff-opt" aria-pressed={suit === "all"} onClick={() => setSuit("all")}>All 52</button>
          {Object.entries(SUITS).map(([k, s]) => (
            <button key={k} type="button" className={`ff-opt ff-suitopt${s.red ? " red" : ""}`} aria-pressed={suit === k} onClick={() => setSuit(k)}>
              <span aria-hidden="true">{s.sym}</span> {s.label}
            </button>
          ))}
        </div>
      </div>

      {suit === "all" && (
        <section style={{ marginTop: 20 }}>
          <SectionHead icon={<Sparkles size={15} color="var(--gold-dk)" strokeWidth={1.6} />} title="Signature cocktails" count={sigs.length} />
          <p className="ff-body" style={{ margin: "-2px 0 4px", fontSize: 13.5 }}>
            Bartenders, cocktail bars and cocktail companies add their own Signature Cocktail Cards on their profile. Book them and their signatures come too.
          </p>
          <HScroll label="Signature cocktails" snap>
            {sigs.map(s => <SignatureCocktailCard key={s.id} s={s} on={menu.picks.includes(s.id)} onOpen={() => setOpen(s)} onToggle={() => toggle(s.id)} />)}
          </HScroll>
        </section>
      )}

      {suitKeys.map(k => {
        const s = SUITS[k];
        const list = CLASSICS.filter(c => c.suit === k && match(c));
        if (!list.length) return null;
        return (
          <section key={k} style={{ marginTop: 22 }}>
            <div className={`ff-suithead${s.red ? " red" : ""}`}><span className="sym" aria-hidden="true">{s.sym}</span><b>{s.name}</b><span>{s.label}</span><i /></div>
            <div className="ff-deckgrid">
              {list.map(c => <CocktailPlayingCard key={c.id} c={c} on={menu.picks.includes(c.id)} onOpen={() => setOpen(c)} onToggle={() => toggle(c.id)} />)}
            </div>
          </section>
        );
      })}
      {!sigs.length && !CLASSICS.some(match) && <Empty icon={<Search size={26} />} title="No cocktails match that. Try a spirit or an ingredient." />}

      <CocktailDetailSheet item={open} on={!!open && menu.picks.includes(open.id)} onToggle={() => open && toggle(open.id)} onClose={() => setOpen(null)} />
      <RecipeSheet open={sheet} items={items} menu={menu} onClose={() => setSheet(false)} />
    </div>
  );
}
