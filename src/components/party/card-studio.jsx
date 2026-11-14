/* src/components/party/card-studio.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==== v17.3.7 The completed profile, and the card studio ===================================
   After someone has made their profile, the Profile tab shows it the way other people see it,
   with the things they keep adding underneath: Cocktail Cards, Service Cards and Blog posts.
   "Edit profile" opens the profile building screen as it was.
   Every new card is made the same way: type straight onto a two-sided card and turn it over.
   ============================================================================================ */
const S17I = {
  CreditCard: lucideIcon("CreditCard"), Wallet: lucideIcon("Wallet"), Smartphone: lucideIcon("Smartphone"), FileText: lucideIcon("FileText"), Receipt: lucideIcon("Receipt"),
  Info: lucideIcon("Info"), Truck: lucideIcon("Truck"), Snowflake: lucideIcon("Snowflake"), Wine: lucideIcon("Wine"),
  RotateCw: lucideIcon("RotateCw"), Pencil: lucideIcon("Pencil"), Plus: lucideIcon("Plus"), Trash2: lucideIcon("Trash2"),
  X: lucideIcon("X"), Check: lucideIcon("Check"), Martini: lucideIcon("Martini"), Sparkles: lucideIcon("Sparkles"),
  BookOpen: lucideIcon("BookOpen"), MapPin: lucideIcon("MapPin"), AtSign: lucideIcon("AtSign"), Camera: lucideIcon("Camera"),
  ShoppingBasket: lucideIcon("ShoppingBasket"), Clock: lucideIcon("Clock"), Users: lucideIcon("Users"),
  CalendarDays: lucideIcon("CalendarDays"), Search: lucideIcon("Search"), Truck: lucideIcon("Truck"), Wine: lucideIcon("Wine"),
  GlassWater: lucideIcon("GlassWater"), MessageSquare: lucideIcon("MessageSquare"), Star: lucideIcon("Star"),
  Heart: lucideIcon("Heart"), SlidersHorizontal: lucideIcon("SlidersHorizontal"), Layers: lucideIcon("Layers"),
  Snowflake: lucideIcon("Snowflake"), Hash: lucideIcon("Hash"), Link2: lucideIcon("Link2"), Minus: lucideIcon("Minus"),
  Music: lucideIcon("Music"), Briefcase: lucideIcon("Briefcase"), UtensilsCrossed: lucideIcon("UtensilsCrossed"), ChevronDown: lucideIcon("ChevronDown"), ArrowRight: lucideIcon("ArrowRight"),
};


const img17 = (k) => (window.FF_IMG || {})[k] || (typeof IMGS !== "undefined" && IMGS[k]) || "";


const today17 = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });



/* ---- Recipes and shopping lists ---------------------------------------------------------- */
const UNITS17 = ["ml", "cl", "dash", "barspoon", "wedge", "wheel", "slice", "twist", "leaf", "sprig", "piece"];


const PLURAL17 = { dash: "dashes", barspoon: "barspoons", wedge: "wedges", wheel: "wheels", slice: "slices", twist: "twists", leaf: "leaves", sprig: "sprigs", piece: "pieces" };


const UNIT_ML17 = { ml: 1, cl: 10, dash: 0.8, barspoon: 5 };


const FRESH_PER17 = { wedge: [8, "whole fruit"], wheel: [8, "whole fruit"], slice: [8, "whole fruit"], twist: [6, "whole fruit"], leaf: [40, "bunch", "bunches"], sprig: [10, "bunch", "bunches"], piece: [1, ""] };


const BUY17 = {
  spirit: { label: "Spirits", short: "Spirit", sizes: [700, 1000] },
  liqueur: { label: "Liqueurs and vermouths", short: "Liqueur", sizes: [500, 700] },
  wine: { label: "Wine and fizz", short: "Wine", sizes: [750] },
  mixer: { label: "Juices and mixers", short: "Mixer", sizes: [1000] },
  syrup: { label: "Syrups", short: "Syrup", sizes: [700, 1000] },
  bitters: { label: "Bitters", short: "Bitters", sizes: [200] },
  fresh: { label: "Fresh", short: "Fresh" },
  other: { label: "Other", short: "Other" },
};


const BUY_ORDER17 = ["spirit", "liqueur", "wine", "mixer", "syrup", "bitters", "fresh", "other"];


function guessBuy17(name) {
  const n = String(name || "").toLowerCase();
  const has = (...w) => w.some(x => n.includes(x));
  if (!n.trim()) return "other";
  if (has("bitters")) return "bitters";
  if (has("syrup", "sugar", "grenadine", "honey", "agave", "orgeat", "falernum")) return "syrup";
  if (has("liqueur", "triple sec", "cointreau", "kahl", "amaretto", "vermouth", "campari", "aperol", "chartreuse", "maraschino", "chambord", "baileys", "limoncello", "st germain", "elderflower", "coffee liq", "crème", "creme de")) return "liqueur";
  if (has("vodka", "gin", "rum", "tequila", "mezcal", "whisk", "bourbon", "rye", "scotch", "brandy", "cognac", "pisco", "cacha")) return "spirit";
  if (has("prosecco", "champagne", "cava", "wine", "crémant", "cremant", "sparkling")) return "wine";
  if (has("lime", "lemon", "orange", "grapefruit", "mint", "basil", "cucumber", "berr", "passion", "pineapple chunk", "egg", "cherry", "olive", "rosemary", "thyme")) return has("juice") ? "mixer" : "fresh";
  if (has("espresso", "coffee", "tea")) return "other";
  if (has("juice", "tonic", "soda", "cola", "ginger", "lemonade", "water", "cream", "milk", "puree", "purée", "coconut")) return "mixer";
  return "other";
}


const fmtVol17 = (ml) => ml >= 1000 ? `${+(ml / 1000).toFixed(2)} L` : `${Math.round(ml * 10) / 10} ml`;


const fmtSize17 = (s) => s >= 1000 ? `${s / 1000} L` : `${s / 10} cl`;


const unitWord17 = (u, amt) => (UNIT_ML17[u] === 1 || u === "cl") ? u : (+amt === 1 ? u : (PLURAL17[u] || u));


function buyOptions17(total, sizes) {
  const opts = sizes.map(s => { const k = Math.max(1, Math.ceil(total / s - 1e-9)); return { s, k, w: k * s - total }; })
    .sort((a, b) => a.w - b.w || a.k - b.k);
  return opts.slice(0, 2).map(o => `${o.k} × ${fmtSize17(o.s)}`).join(" or ");
}


/* One ingredient, for n cocktails: what it says on the recipe, and what to buy. */
function shopLine17(ing, n) {
  const amt = +ing.amt || 0, u = ing.unit || "ml", buy = ing.buy || guessBuy17(ing.name);
  if (n === 1) return { qty: amt ? `${amt} ${unitWord17(u, amt)}` : "", buy: "" };
  if (UNIT_ML17[u]) {
    const ml = amt * UNIT_ML17[u] * n;
    const sizes = (BUY17[buy] || {}).sizes;
    return { qty: fmtVol17(ml), buy: sizes && ml ? buyOptions17(ml, sizes) : "" };
  }
  const count = amt * n;
  const f = FRESH_PER17[u];
  if (f && f[0] > 1) { const k = Math.ceil(count / f[0]); return { qty: `${count} ${unitWord17(u, count)}`, buy: `${k} ${k === 1 || !f[2] ? f[1] : f[2]}` }; }
  return { qty: `${count} ${unitWord17(u, count)}`, buy: "" };
}



/* ---- Small typing helpers ------------------------------------------------------------------- */
function Grow17({ value, onChange, placeholder, className = "", max = 400, label, rows = 1 }) {
  const r = useRef(null);
  React.useLayoutEffect(() => { const t = r.current; if (!t) return; t.style.height = "auto"; t.style.height = t.scrollHeight + "px"; }, [value]);
  return <textarea ref={r} rows={rows} className={`ff-c17-ta ${className}`} value={value || ""} placeholder={placeholder} maxLength={max}
    aria-label={label || placeholder} onChange={(e) => onChange(e.target.value)} />;
}


function Line17({ value, onChange, placeholder, className = "", max = 80, label }) {
  return <input className={`ff-c17-in ${className}`} value={value || ""} placeholder={placeholder} maxLength={max}
    aria-label={label || placeholder} onChange={(e) => onChange(e.target.value)} />;
}


function Chips17({ value = [], onChange, placeholder, prefix = "", icon: Ic, edit, max = 12 }) {
  const [t, setT] = useState("");
  const add = () => {
    const v = t.trim().replace(/^[@#]+/, (m) => prefix && m[0] === prefix ? "" : m);
    if (!v) return;
    const full = prefix && !/^[@#]/.test(v) ? prefix + v : v;
    if (!value.includes(full) && value.length < max) onChange([...value, full]);
    setT("");
  };
  if (!edit && !value.length) return null;
  return (
    <div className="ff-c17-chips">
      {value.map(v => (
        <span key={v} className="chip">{Ic && <Ic size={11} />}{v}
          {edit && <button type="button" aria-label={`Remove ${v}`} onClick={() => onChange(value.filter(x => x !== v))}><S17I.X size={10} /></button>}
        </span>))}
      {edit && value.length < max && <input value={t} placeholder={placeholder} aria-label={placeholder}
        onChange={(e) => { const v = e.target.value; if (/[,\n]$/.test(v)) { setT(v.slice(0, -1)); setTimeout(add, 0); } else setT(v); }}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} onBlur={add} />}
    </div>
  );
}


function Photo17({ src, fallback, edit, onChange, label = "Add a photo", icon: Ph, fit }) {
  const shown = src || img17(fallback);
  const pick = (e) => {
    const f = e.target.files && e.target.files[0];
    e.target.value = "";
    if (f)
      shrinkPhoto(f, 900).then(onChange).catch(() => {});
  };
  return React.createElement("div", {
    className: "ff-c17-ph"
  }, shown ? fit ? React.createElement("img", { decoding: "async",
    className: "fg",
    src: shown,
    alt: "",
    draggable: false
  }) : React.createElement("img", { decoding: "async",
    src: shown,
    alt: "",
    draggable: false
  }) : React.createElement("span", {
    className: "none",
    "aria-hidden": "true"
  }, Ph ? React.createElement(Ph, {
    size: 54,
    strokeWidth: 1.1
  }) : null), edit && React.createElement("label", {
    className: "up"
  }, React.createElement("input", {
    type: "file",
    accept: "image/*",
    onChange: pick
  }), React.createElement(S17I.Camera, {
    size: 15
  }), React.createElement("span", null, src ? "Change photo" : label)));
}



/* ---- The card, and the pair (front and back, side by side) -------------------------------------- */
const slug17 = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");


const PATH17 = { cocktail: "cocktails", service: "services" };


/* The same base on every card, the one the Profile Card has: the coin and the owner's FF Tag address. */
function CardBase17({ tag, url }) {
  return <div className="base"><FFLogo size={20} tier="gold" /><em>{url || `${CARD_DOMAIN}/${tag || "yourtag"}`}</em></div>;
}


function Card17({ kind, tone = "", plate, tag, url, edit, size = "", children }) {
  return (
    <div className={`ff-c17 k-${kind} ${tone}${edit ? " edit" : ""} ${size}`}>
      <div className="in"><div className="face">
        <span className="pl">{plate}</span>
        {kind === "cocktail" && <span className="cn" aria-hidden="true"><FFLogo size={34} tier="gold" /></span>}
        {children}
        <CardBase17 tag={tag} url={url} />
      </div></div>
    </div>
  );
}



/* ---- Signature Cocktail ---------------------------------------------------------------------------- */
const GLASS17 = [["tall", "highball", "Tall"], ["short", "rocks", "Short"], ["martini", "martini", "Martini"]];


const SPIRITS17 = ["Vodka", "Gin", "Rum", "Tequila", "Mezcal", "Whisky", "Bourbon", "Brandy", "Cognac", "Liqueur"];


const newIng17 = () => ({ id: uid("ing"), amt: "", unit: "ml", name: "", buy: "" });


const NEW_COCKTAIL17 = (style) => ({ id: uid("ck"), style: style === "classic" ? "classic" : "signature", kind: "cocktail", spirit: "", spiritOther: "", price: "", name: "", note: "", photo: "", glass: "martini", glassOther: "", keywords: [], ings: [newIng17(), newIng17(), newIng17()] });


function GlassPick17({ value, other, onChange, onOther, edit }) {
  const sp = value === "special" && String(other || "").trim();
  const cur = sp ? "special" : (GLASS17.some(g => g[0] === value) ? value : "martini");
  const list = edit ? GLASS17 : (sp ? [] : GLASS17.filter(g => g[0] === cur));
  return (
    <div className="ff-c17-glasswrap">
      {list.length > 0 && (
        <div className="ff-c17-glass" role="radiogroup" aria-label="Glass">
          {list.map(([k, icon, label]) => (
            <button key={k} type="button" role="radio" aria-checked={cur === k} className={cur === k ? "on" : ""} disabled={!edit} onClick={() => { onChange(k); onOther(""); }} aria-label={label}>
              <GlassIcon glass={icon} size={edit ? 30 : 24} /><small>{label}</small>
            </button>))}
        </div>)}
      {edit && <input className={"ff-c17-glass-in" + (sp ? " on" : "")} value={other || ""} placeholder="Special glassware" maxLength={30} aria-label="Special glassware"
        onChange={(e) => { const v = e.target.value; onOther(v); onChange(v.trim() ? "special" : (value === "special" ? "martini" : value)); }} />}
      {!edit && sp && <span className="ff-c17-glass-sp"><S17I.Wine size={18} /> {other}</span>}
    </div>
  );
}


function FitTtl17({ text }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = "";
      let fs = parseFloat(getComputedStyle(el).fontSize) || 22;
      while (el.scrollWidth > el.clientWidth + 0.5 && fs > 11) { fs -= 0.5; el.style.fontSize = fs + "px"; }
    };
    fit();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fit) : null;
    if (ro) ro.observe(el);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    return () => ro && ro.disconnect();
  }, [text]);
  return <h3 className="ttl fit" ref={ref}>{text}</h3>;
}


function CocktailFront17({ c, edit, set }) {
  return (<>
    <Photo17 fit src={c.photo} fallback="" icon={S17I.Martini} edit={edit} onChange={(photo) => set({ photo })} label="Add a photo of the drink" />
    <div className="ff-c17-body">
      {edit ? <Line17 className="ttl" value={c.name} onChange={(name) => set({ name })} placeholder="Cocktail name" max={40} />
        : <FitTtl17 text={c.name || "Cocktail"} />}
      {edit ? <Grow17 className="note" rows={2} value={c.note} onChange={(note) => set({ note })} placeholder="What it tastes like, in a line or two" max={160} />
        : (c.note && <p className="note">{c.note}</p>)}
      {edit ? <GlassPick17 value={c.glass} other={c.glassOther} onChange={(glass) => set({ glass })} onOther={(glassOther) => set({ glassOther })} edit />
        : (() => {
          const sp = c.glass === "special" && String(c.glassOther || "").trim();
          const g = GLASS17.find(x => x[0] === c.glass) || GLASS17[2];
          const kw = (c.keywords || []).filter(Boolean);
          const tags = (kw.length ? kw : (c.ings || []).map(i => String(i.name || "").trim()).filter(Boolean)).slice(0, 6);
          return <div className="ff-c17-tags"><span className="gl" aria-label={sp ? c.glassOther : g[2]}>{sp ? <S17I.Wine size={26} /> : <GlassIcon glass={g[1]} size={28} />}</span>
            <span className="ch">{tags.map((t, i) => <em key={t + i}>{t}</em>)}</span></div>;
        })()}
    </div>
  </>);
}


function AmtInput17({ value, mult, onChange }) {
  const [txt, setTxt] = useState("");
  const focus = useRef(false);
  const shown = value === "" || value == null ? "" : String(+(parseFloat(value) * mult).toFixed(2));
  useEffect(() => { if (!focus.current) setTxt(shown); }, [shown, mult]);
  return <input className="a" inputMode="decimal" value={txt} placeholder={mult === 1 ? "50" : "700"} aria-label="Amount"
    onFocus={() => { focus.current = true; }} onBlur={() => { focus.current = false; setTxt(shown); }}
    onChange={(e) => { const v = e.target.value.replace(/[^0-9.]/g, "").slice(0, 6); setTxt(v); const f = parseFloat(v); onChange(v === "" || isNaN(f) ? "" : String(+(f / mult).toFixed(4))); }} />;
}


function CocktailBack17({ c, edit, set }) {
  const [n, setN] = useState(1);
  const setIng = (id, patch) => set({ ings: c.ings.map((i) => i.id === id ? { ...i, ...patch } : i) });
  const rows = (c.ings || []).filter((i) => edit || String(i.name).trim());
  const pickUnit = (i, u) => {
    if (u === "bottle")
      setIng(i.id, { unit: "ml", amt: String(+35 .toFixed(4)) });
    else
      setIng(i.id, { unit: u });
  };
  return React.createElement("div", {
    className: "ff-c17-body back"
  }, edit ? React.createElement("div", {
    className: "ff-c17-kind"
  }, React.createElement("div", {
    className: "ff-c17-tabs",
    role: "tablist",
    "aria-label": "Classic or signature"
  }, [["classic", "Classic"], ["signature", "Signature"]].map(([k, l]) => React.createElement("button", {
    key: k,
    type: "button",
    role: "tab",
    "aria-selected": (c.style || "signature") === k,
    className: (c.style || "signature") === k ? "on" : "",
    onClick: () => set({ style: k })
  }, l))), React.createElement("div", {
    className: "ff-c17-tabs",
    role: "tablist",
    "aria-label": "Cocktail or mocktail"
  }, [["cocktail", "Cocktail"], ["mocktail", "Mocktail"]].map(([k, l]) => React.createElement("button", {
    key: k,
    type: "button",
    role: "tab",
    "aria-selected": (c.kind || "cocktail") === k,
    className: (c.kind || "cocktail") === k ? "on" : "",
    onClick: () => set({ kind: k })
  }, l)))) : React.createElement("span", {
    className: "ff-c17-kindline"
  }, c.style === "classic" ? "Classic " : "Signature ", c.kind === "mocktail" ? "mocktail" : "cocktail", c.kind !== "mocktail" && (c.spirit === "other" ? c.spiritOther : c.spirit) ? ` · ${c.spirit === "other" ? c.spiritOther : c.spirit}` : ""), React.createElement("div", {
    className: "ff-c17-rechead"
  }, React.createElement("b", {
    className: "h"
  }, React.createElement(S17I.Martini, {
    size: 14
  }), " Recipe"), React.createElement("span", {
    className: "ff-c17-size",
    role: "tablist",
    "aria-label": "Recipe size"
  }, [1, 20].map((x) => React.createElement("button", {
    key: x,
    type: "button",
    role: "tab",
    "aria-selected": n === x,
    className: n === x ? "on" : "",
    onClick: () => setN(x),
    "aria-label": x === 1 ? "1 cocktail" : "20 cocktails"
  }, x)))), edit ? React.createElement("div", {
    className: "ff-c17-rows"
  }, c.ings.map((i, ix) => {
    const sr = ix === 0 && c.kind !== "mocktail";
    const other = sr && (i.other || String(i.name).trim() && !SPIRITS17.includes(i.name));
    return React.createElement(React.Fragment, {
      key: i.id
    }, React.createElement("div", {
      className: "r"
    }, React.createElement(AmtInput17, {
      value: i.amt,
      mult: n,
      onChange: (amt) => setIng(i.id, { amt })
    }), React.createElement("select", {
      className: "u",
      value: i.unit,
      "aria-label": "Unit",
      onChange: (e) => pickUnit(i, e.target.value)
    }, UNITS17.map((u) => React.createElement("option", {
      key: u,
      value: u
    }, u)), n === 20 && React.createElement("option", {
      value: "bottle"
    }, "bottle (70 cl)")), sr ? React.createElement("select", {
      className: "nm sp",
      value: other ? "other" : i.name || "",
      "aria-label": "Spirit",
      onChange: (e) => {
        const v = e.target.value;
        if (v === "other")
          set({ spirit: "other", ings: c.ings.map((x) => x.id === i.id ? { ...x, name: "", other: true } : x) });
        else
          set({ spirit: v, spiritOther: "", ings: c.ings.map((x) => x.id === i.id ? { ...x, name: v, other: false } : x) });
      }
    }, React.createElement("option", {
      value: ""
    }, "Spirit"), SPIRITS17.map((x) => React.createElement("option", {
      key: x,
      value: x
    }, x)), React.createElement("option", {
      value: "other"
    }, "Other…")) : React.createElement("input", {
      className: "nm",
      value: i.name,
      placeholder: "Ingredient",
      maxLength: 40,
      "aria-label": "Ingredient",
      onChange: (e) => setIng(i.id, { name: e.target.value })
    }), React.createElement("select", {
      className: "by",
      value: i.buy || guessBuy17(i.name),
      "aria-label": "Shopping list group",
      onChange: (e) => setIng(i.id, { buy: e.target.value })
    }, BUY_ORDER17.map((k) => React.createElement("option", {
      key: k,
      value: k
    }, BUY17[k].short))), React.createElement("button", {
      type: "button",
      className: "x",
      "aria-label": "Remove ingredient",
      onClick: () => set({ ings: c.ings.filter((x) => x.id !== i.id) })
    }, React.createElement(S17I.X, {
      size: 12
    }))), other && React.createElement("div", {
      className: "r o"
    }, React.createElement("input", {
      className: "nm",
      value: i.name,
      placeholder: "Type the spirit",
      maxLength: 24,
      "aria-label": "Other spirit",
      onChange: (e) => set({ spiritOther: e.target.value, ings: c.ings.map((x) => x.id === i.id ? { ...x, name: e.target.value, other: true } : x) })
    })));
  }), c.ings.length < 10 && React.createElement("button", {
    type: "button",
    className: "add",
    onClick: () => set({ ings: [...c.ings, newIng17()] })
  }, React.createElement(S17I.Plus, {
    size: 13
  }), " Ingredient")) : React.createElement("ul", {
    className: "ff-c17-rec"
  }, rows.filter((i) => String(i.name).trim()).map((i) => {
    const l = shopLine17(i, n);
    return React.createElement("li", {
      key: i.id
    }, React.createElement("span", {
      className: "q"
    }, l.qty), React.createElement("span", {
      className: "nm"
    }, i.name, l.buy && React.createElement("small", null, "Buy ", l.buy)));
  }), !rows.some((i) => String(i.name).trim()) && React.createElement("li", {
    className: "none"
  }, "The recipe appears here.")), React.createElement("b", {
    className: "h"
  }, React.createElement(S17I.Hash, {
    size: 14
  }), " Keywords"), React.createElement(Chips17, {
    edit,
    value: c.keywords || [],
    onChange: (keywords) => set({ keywords }),
    placeholder: "Add a keyword, like coffee or sweet"
  }));
}



const NEW_SERVICE17 = () => ({ id: uid("sv"), type: "base", cat: "bar", bands: [], price: "", priceFor: "", tone: "silver", title: "", tagline: "", includes: "", ideal: "", time: "", base: "", areas: [], events: [], guests: "", staff: "", setup: "", provides: "", equipment: "", extras: [], days: [], keywords: [] });


function ServiceFront17({ s, edit, set, site }) {
  const row = (Ic, label, k, ph, max = 120) => (
    <div className="ff-c17-row"><span className="ic"><Ic size={15} /></span><span className="tx"><small>{label}</small>
      {edit ? <Grow17 value={s[k]} onChange={(v) => set({ [k]: v })} placeholder={ph} max={max} /> : <b>{s[k] || "Not set"}</b>}</span></div>
  );
  const addon = s.type === "addon";
  return (
    <div className="ff-c17-body svc">
      {edit ? <Line17 className="ttl" value={s.title} onChange={(title) => set({ title })} placeholder="Name your service" max={40} /> : <h3 className="ttl">{s.title || "Service"}</h3>}
      {edit ? <Grow17 className="note" value={s.tagline} onChange={(tagline) => set({ tagline })} placeholder="One line that sells it" max={90} /> : (s.tagline && <p className="note">{s.tagline}</p>)}
      <div className="ff-c17-rule" aria-hidden="true"><i /><span>◆</span><i /></div>
      {row(S17I.Sparkles, "What the client gets", "includes", "Everything that is included", 800)}
      {row(S17I.Users, "Ideal for", "ideal", "The events it suits", 300)}
      {row(S17I.Clock, "Duration", "time", "For example, 4 hours", 80)}
      <div className="ff-c17-foot">
        {edit ? <div className="ff-c17-tabs" role="tablist" aria-label="Base package or add-on">{[["base", "Base package"], ["addon", "Add-on"]].map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={(s.type || "base") === k} className={(s.type || "base") === k ? "on" : ""} onClick={() => set({ type: k })}>{l}</button>)}</div>
          : <span className="kind">{addon ? "Add-on" : "Base package"}</span>}
        <div className="ff-c17-price"><small>{addon ? "Add-on price" : "Base price"}</small>
          {edit ? (<div className="pi"><span className="gbp"><i>£</i><input inputMode="decimal" value={s.price || ""} placeholder="0" maxLength={8} aria-label="Price in pounds" onChange={(e) => set({ price: e.target.value.replace(/[^0-9.,]/g, "") })} /></span><input className="for" value={s.priceFor || ""} placeholder="per event" maxLength={24} aria-label="What the price covers" onChange={(e) => set({ priceFor: e.target.value })} /></div>)
            : (<><b>{s.price ? `£${s.price}` : "Price on request"}</b>{s.priceFor && <span>{s.priceFor}</span>}</>)}
        </div>
      </div>
    </div>
  );
}


/* Five plain terms for customers booking a Service Card. They apply to every card, or a card can have its own. */
const TERMS17 = [
  { k: "book", label: "Your booking", text: "Your booking is confirmed once we accept it and you receive confirmation through FireFlair. The date, time, place and what is included are as shown on this Service Card." },
  { k: "pay", label: "Payment", text: "Payment is as agreed when we confirm your booking. Any deposit and the date the balance is due are confirmed with your booking." },
  { k: "changes", label: "Changes and cancellation", text: "Tell us as early as you can if you need to change or cancel, through FireFlair, so we can do our best to move your booking." },
  { k: "access", label: "Access and set-up", text: "We need access to the venue, a suitable space and power at the agreed set-up time. You provide anything listed under the client provides." },
  { k: "care", label: "Guests, safety and insurance", text: "You are responsible for your guests and the venue. We hold the licences and insurance needed to deliver this service, and may refuse service where the law or safety requires it." },
];


const termsFor17 = (s, shared) => { const base = { ...Object.fromEntries(TERMS17.map(t => [t.k, t.text])), ...(shared || {}) }; return s.ownTerms ? { ...base, ...(s.terms || {}) } : base; };


function TermsBox17({ s, set }) {
  const { state, dispatch } = useStore();
  const [open, setOpen] = useState(false);
  const own = !!s.ownTerms;
  const cur = termsFor17(s, state.svcTerms17);
  const put = (k, v) => own ? set({ terms: { ...cur, [k]: v } }) : dispatch({ type: "V11_SET", patch: { svcTerms17: { ...Object.fromEntries(TERMS17.map(t => [t.k, cur[t.k]])), [k]: v } } });
  return (
    <div className="ff-tc17">
      <button type="button" className="hd" aria-expanded={open} onClick={() => setOpen(o => !o)}><S17I.Layers size={15} /><span>Define your terms and conditions</span><S17I.ChevronDown size={16} className={open ? "up" : ""} /></button>
      {open && <div className="bd">
        <div className="ff-c17-tabs" role="tablist" aria-label="Which cards these terms are for">
          {[[false, "All my service cards"], [true, "This card only"]].map(([v, l]) => <button key={l} type="button" role="tab" aria-selected={own === v} className={own === v ? "on" : ""} onClick={() => set(v ? { ownTerms: true, terms: s.terms && Object.keys(s.terms).length ? s.terms : cur } : { ownTerms: false })}>{l}</button>)}
        </div>
        {TERMS17.map(t => <label key={t.k} className="tc"><small>{t.label}</small><Grow17 value={cur[t.k]} onChange={(v) => put(t.k, v)} max={500} label={t.label} rows={2} /></label>)}
      </div>}
    </div>
  );
}


function ServiceBack17({ s, edit, set }) {
  const { state } = useStore();
  const terms = termsFor17(s, state.svcTerms17);
  const f = (Ic, label, body) => <div className="ff-c17-f"><small><Ic size={12} /> {label}</small>{body}</div>;
  const txt = (k, ph) => edit ? <Line17 value={s[k]} onChange={(v) => set({ [k]: v })} placeholder={ph} max={60} /> : <b>{s[k] || "Not set"}</b>;
  return (
    <div className="ff-c17-body back">
      {!edit && (s.includes || s.ideal || s.time) && <>
        <b className="h"><S17I.Sparkles size={14} /> The package</b>
        {s.includes && f(S17I.Sparkles, "What the client gets", <b>{s.includes}</b>)}
        {s.ideal && f(S17I.Users, "Ideal for", <b>{s.ideal}</b>)}
        {s.time && f(S17I.Clock, "Duration", <b>{s.time}</b>)}
      </>}
      <b className="h"><S17I.MapPin size={14} /> Where and when</b>
      {f(S17I.MapPin, "Based in", txt("base", "Town or postcode area"))}
      {f(S17I.Truck, "Areas covered", <Chips17 edit={edit} value={s.areas} onChange={(areas) => set({ areas })} placeholder="Add an area, like London" />)}
      <b className="h"><S17I.Layers size={14} /> On the night</b>
      {f(S17I.Layers, "Category", <PkgPick17 edit={edit} multi={false} cols={2} value={[s.cat || "bar"]} opts={BCATS17.map(b => [b.k, b.label])} onChange={(v) => set({ cat: v[0] })} />)}
      {f(S17I.Users, "Guest numbers", <PkgPick17 edit={edit} multi value={s.bands || []} opts={PARTY_BANDS11.map(b => [b.k, b.label])} onChange={(bands) => set({ bands })} />)}
      {f(S17I.Users, "Staff", txt("staff", "For example, 2 people"))}
      {f(S17I.Clock, "Set-up time", txt("setup", "For example, 1 hour before"))}
      {f(S17I.Wine, "We bring", txt("equipment", "Equipment, tools, materials"))}
      {f(S17I.Plus, "Extras", <Chips17 edit={edit} value={s.extras || []} onChange={(extras) => set({ extras })} placeholder="Add an extra" />)}
      {f(S17I.Sparkles, "The client provides", txt("provides", "Space, power, parking…"))}
      {!edit && <><b className="h"><S17I.Check size={14} /> Terms</b>{TERMS17.map(t => f(S17I.Check, t.label, <b>{terms[t.k]}</b>))}</>}
      <b className="h"><S17I.Hash size={14} /> Found by</b>
      {f(S17I.PartyPopper || S17I.Star, "Event types", <Chips17 edit={edit} value={s.events} onChange={(events) => set({ events })} placeholder="Weddings, birthdays…" />)}
      {f(S17I.Search, "Keywords", <Chips17 edit={edit} value={s.keywords} onChange={(keywords) => set({ keywords })} placeholder="DJ, photographer, chef…" />)}
    </div>
  );
}



/* ---- Blog post: FireFlair Stories -------------------------------------------------------------- */
/* ---- One studio per card type: your cards, and the card you are making ------------------------ */
const STUDIO17 = {
  cocktail: { key: "myCocktails", title: "Cocktails", plate: "Signature Cocktail", plateOf: (x) => (x && x.style === "classic" ? "Classic Cocktail" : "Signature Cocktail"), back: "Recipe", icon: S17I.Martini, add: "New cocktail", make: NEW_COCKTAIL17, ok: (x) => String(x.name).trim(), name: (x) => x.name, tone: () => "dark",
    Front: ({ x, edit, set }) => <CocktailFront17 c={x} edit={edit} set={set} />, Back: ({ x, edit, set }) => <CocktailBack17 c={x} edit={edit} set={set} /> },
  service: { key: "myServices", title: "Service Cards", plate: "Service Card", back: "Details", icon: S17I.Sparkles, add: "New Service Card", make: NEW_SERVICE17, ok: (x) => String(x.title).trim(), name: (x) => x.title, tone: () => "ivory",
    Front: ({ x, edit, set, site }) => <ServiceFront17 s={x} edit={edit} set={set} site={site} />, Back: ({ x, edit, set }) => <ServiceBack17 s={x} edit={edit} set={set} /> },
};


/* Both sides at once: the front is what the customer sees, the back is the detail. */
function StudioPair17({ type, x, edit, set, site, by, tag, size, only }) {
  const T = STUDIO17[type];
  const tone = T.tone(x);
  const plate = T.plateOf ? T.plateOf(x) : T.plate;
  return (
    <div className={`ff-c17pair${only ? " one" : ""}`}>
      <Card17 kind={type} tone={tone} plate={plate} tag={tag} edit={edit} size={edit ? "auto" : size}><T.Front x={x} edit={edit} set={set} site={site} by={by} /></Card17>
      {!only && <Card17 kind={type} tone={tone} plate={T.back} tag={tag} edit={edit} size={edit ? "auto" : size}><T.Back x={x} edit={edit} set={set} /></Card17>}
    </div>
  );
}


/* The card in a pop-up: the fixed front, then the back with everything on it, one above the other. */
function CardPop17({ type, x, site, by, tag, onClose }) {
  const T = STUDIO17[type];
  const tone = T.tone(x);
  const addr = `${CARD_DOMAIN}/${tag || "yourtag"}/${PATH17[type]}/${slug17(T.name(x)) || "your-card"}`;
  const nm = T.name(x) || (T.plateOf ? T.plateOf(x) : T.plate);
  return (
    <CardShareSheet17 open onClose={onClose} title={nm} url={"https://" + addr} fileName={"fireflair-" + cx17Slug(nm)}
      extra={<div className="ff-pop17" style={{ marginTop: 14 }}><Card17 kind={type} tone={tone} plate={T.back} tag={tag} size="auto lg"><T.Back x={x} /></Card17></div>}>
      <Card17 kind={type} tone={tone} plate={T.plateOf ? T.plateOf(x) : T.plate} tag={tag} url={addr} size="lg"><T.Front x={x} site={site} by={by} /></Card17>
    </CardShareSheet17>
  );
}


/* v17.4.6: one studio per card type. The editor sits inline and is open from the start (a fresh card
   when there is none), with one plus card for a new entry; Classic or Signature is chosen inside the card.
   FF Team (profile): entries live in profile.content and Save goes through PROFILE_ADAPTER.saveContent;
   saving is the only publication step. FF Staff (company): the company lists, as before. */
function Studio17({ type, site, by, tag, k: listKey, seed, profile }) {
  const { state, dispatch } = useStore();
  const T = STUDIO17[type];
  const sk = listKey || T.key;
  const kind = PC17_KINDS[type];
  const list = profile ? myContent17(state, kind) : (state[sk] || seed || []);
  const [draft, setDraft] = useState(() => (list.length ? null : T.make()));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isNew = draft && !list.some(x => x.id === draft.id);
  const account = qaAccount17(state) || state.session.tag || "";
  const commit = async (entry, remove) => {
    if (!profile) {
      dispatch({ type: "V11_SET", patch: { [sk]: remove ? list.filter(x => x.id !== entry.id) : isNew ? [entry, ...list] : list.map(x => x.id === entry.id ? entry : x) } });
      return true;
    }
    const cur = pcOf17(state.profile);
    setBusy(true); setErr("");
    const r = await PROFILE_ADAPTER.saveContent(account, { ...pcWith17(cur, kind, entry, remove), owner: account });
    setBusy(false);
    if (!r.ok) { setErr(r.reason === "not-owner" ? "Sign in to save." : r.reason === "name-required" ? "Add a name first." : r.reason === "bad-image" ? "That photo can't be used." : r.reason === "too-many" ? "You've reached the limit for these cards." : "That couldn't be saved."); return false; }
    dispatch({ type: "PC_SAVE", content: r.content });
    return true;
  };
  const done = async () => {
    if (!draft || !T.ok(draft) || busy) return;
    if (await commit(draft, false)) { dispatch({ type: "TOAST", toast: `${T.plateOf ? T.plateOf(draft) : T.plate} saved` }); setDraft(null); }
  };
  const remove = async () => { if (busy) return; if (await commit(draft, true)) setDraft(null); };
  const edRef = useRef(null);
  const open = (x) => { setErr(""); setDraft(JSON.parse(JSON.stringify(x))); setTimeout(() => { if (edRef.current) edRef.current.scrollIntoView({ behavior: "smooth", block: "start" }); }, 60); };
  const addr = (x) => `${CARD_DOMAIN}/${tag || "yourtag"}/${PATH17[type]}/${slug17(T.name(x)) || "your-card"}`;
  return (
    <div className="ff-st17">
      {draft ? (
        <div className="ff-st17-ed" ref={edRef}>
          <StudioPair17 key={draft.id} type={type} x={draft} edit set={(p) => setDraft(d => ({ ...d, ...p }))} site={site} by={by} tag={tag} />
          <div className="ff-c17-addr"><S17I.Link2 size={13} /><span>{addr(draft)}</span></div>
          {type === "service" && <TermsBox17 s={draft} set={(p) => setDraft(d => ({ ...d, ...p }))} />}
          {err && <p className="ff-st17-err" role="alert">{err}</p>}
          <div className="acts">
            <Btn variant="primary" onClick={done} disabled={!T.ok(draft) || busy}><S17I.Check size={14} /> {busy ? "Saving…" : "Save"}</Btn>
            {(list.length > 0 || !isNew) && <Btn variant="ghost" onClick={() => { setErr(""); setDraft(null); }}>Cancel</Btn>}
            {!isNew && <button type="button" className="del" onClick={remove} disabled={busy}><S17I.Trash2 size={14} /> Delete</button>}
          </div>
        </div>
      ) : null}
      {(list.length > 0 || !draft) && (
        <HScroll label={T.title}>
          {list.map(x => (
            <div className="ff-st17-item" key={x.id}>
              <div className="ff-st17-tap" role="button" tabIndex={0} aria-label={`Edit ${T.name(x) || (T.plateOf ? T.plateOf(x) : T.plate)}`} onClick={() => open(x)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(x); } }}>
                <StudioPair17 type={type} x={x} site={site} by={by} tag={tag} size="sm" only />
              </div>
              <span className="ff-c17-addr"><S17I.Link2 size={12} /><span>{addr(x)}</span></span>
            </div>))}
          <div className="ff-st17-item"><button type="button" className="ff-st17-plus" aria-label={T.add} onClick={() => open(T.make())}><S17I.Plus size={34} strokeWidth={1.5} /></button></div>
        </HScroll>
      )}
    </div>
  );
}


/* Phase 2: the card builders work and save, but are marked Coming soon: a very small lock beside the section title. */
function SoonTitle17({ children }) {
  return <span className="ff-soon17-t">{children}<span className="ff-soon17"><Lock size={9} aria-hidden="true" /> {LOCKED_LABEL17}</span></span>;
}


function Sec17({ icon, title, count, children, id, first }) {
  const [open, setOpen] = useState(!!first);
  return <StaffBox id={id} icon={icon} title={title} count={count} open={open} onToggle={() => setOpen(o => !o)}>{children}</StaffBox>;
}


const BULK17 = {
  cocktail: { label: "Cocktail menu", icon: S17I.Martini, ph: "Upload a menu photo, or paste your drinks" },
  service: { label: "Service packages", icon: S17I.Sparkles, ph: "Upload your packages, or describe them" },
};


/* FireFlair makes many cards at once. Coming 2027: it needs the back end. */
function BulkAI17() {
  const [k, setK] = useState("cocktail");
  const T = BULK17[k];
  return (
    <div className="ff-bulk17" role="group" aria-label="Many cards at once">
      <div className="top"><span className="tag" aria-hidden="true"><Coin size={20} tier="gold" /></span><em>Coming{" "}soon</em></div>
      <div className="kinds" role="tablist" aria-label="What to create">
        {Object.entries(BULK17).map(([key, v]) => <button key={key} type="button" role="tab" aria-selected={k === key} className={k === key ? "on" : ""} onClick={() => setK(key)}><v.icon size={14} /> {v.label}</button>)}
      </div>
      <div className="row"><input disabled placeholder={T.ph} aria-label={T.ph} /><button type="button" disabled aria-label="Upload a photo or file"><S17I.Camera size={16} /></button></div>
    </div>
  );
}


function Creators17({ kind, by: byIn }) {
  const { state } = useStore();
  const team = kind === "team";
  const site = team ? "FF Team" : "FF Staff";
  const by = byIn || (team ? (String(state.profile.name || "").trim() || "You") : (String((state.company || {}).name || "").trim() || "You"));
  const demoCo = !team && !(state.company || {}).slug && !String((state.company || {}).name || "").trim() ? COMPANY_PAGES.co_vooshka : null;
  const tag = team ? (state.auth.tag || state.session.tag || "yourtag") : ((state.company || {}).slug || (demoCo && demoCo.slug) || "yourbusiness");
  const bizKeys = team ? {} : { cocktail: "coCocktails17", service: "coServices17" };
  const seeds = team ? {} : coSeeds17(state);
  const types = ["cocktail", "service"];
  const count = (t) => team ? myContent17(state, PC17_KINDS[t]).length : (state[bizKeys[t] || STUDIO17[t].key] || seeds[t] || []).length;
  return (
    <section className="ff-cr17" aria-labelledby="ff-cr17-h">
      <h2 id="ff-cr17-h" className="ff-done17-h">Build your packages</h2>
      {types.map((t, i) => { const T = STUDIO17[t]; return (
        <Sec17 key={t} first={i === 0} id={`ff-cr17-${t}`} icon={T.icon} title={<SoonTitle17>{t === "cocktail" ? "Signature cocktails" : T.title}</SoonTitle17>} count={count(t)}><Studio17 type={t} site={site} by={by} tag={tag} k={bizKeys[t]} seed={seeds[t]} profile={team} /></Sec17>); })}
    </section>
  );
}



/* The Packages tab on a profile: the Q&A. In Phase 2 what a person saves in the card builders (Signature cocktails, Service Cards)
   is kept on their profile editor only and is not shown on any public view. */
function PkgExtras17({ person }) {
  return <PublicQA person={person} />;
}



/* ---- FF Party: favourite cocktails, shown as cards ------------------------------------------------- */
function FavCocktails17({ demo }) {
  const { state, dispatch } = useStore();
  const all = useDirectory();
  const own = state.favCocktails || [];
  const demoIds = !own.length && demo ? String(demo).split(/[·,]/).map(n => n.trim().toLowerCase()).map(n => (CLASSICS.find(c => c.name.toLowerCase() === n) || {}).id).filter(Boolean) : [];
  const ids = own.concat(demoIds);
  const [pick, setPick] = useState(false);
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);
  const toggle = (id) => dispatch({ type: "V11_SET", patch: { favCocktails: own.includes(id) ? own.filter(x => x !== id) : [...own, id] } });
  const items = ids.map(id => cocktailById(state, id, all)).filter(Boolean);
  const pool = [...CLASSICS, ...allSignatures(state, all)].filter(x => !q.trim() || `${x.name} ${x.base || ""}`.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className="ff-fav17">
      {items.length > 0 && (
        <HScroll label="Favourite cocktails">
          {items.map(x => x.suit
            ? <CocktailPlayingCard key={x.id} c={x} on={false} onOpen={() => setDetail(x)} />
            : <SignatureCocktailCard key={x.id} s={x} on={false} onOpen={() => setDetail(x)} />)}
        </HScroll>)}
      <button type="button" className="ff-st17-new" onClick={() => setPick(true)}><S17I.Heart size={15} /> {items.length ? "Change favourites" : "Choose your favourite cocktails"}</button>
      <Sheet open={pick} onClose={() => setPick(false)} title="Favourite cocktails" center>
        <div className="ff-fav17-pick">
          <label className="srch"><S17I.Search size={14} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search cocktails" aria-label="Search cocktails" /></label>
          <ul>
            {pool.map(x => { const on = ids.includes(x.id); return (
              <li key={x.id}><button type="button" className={on ? "on" : ""} aria-pressed={on} onClick={() => toggle(x.id)}>
                <GlassIcon glass={x.glass} size={22} /><span><b>{x.name}</b><small>{x.base || (x.creator ? `By ${x.creator.name}` : "")}</small></span>
                <S17I.Heart size={17} fill={on ? "currentColor" : "none"} />
              </button></li>); })}
          </ul>
        </div>
      </Sheet>
      <CocktailDetailSheet item={detail} on={false} onClose={() => setDetail(null)} />
    </div>
  );
}
