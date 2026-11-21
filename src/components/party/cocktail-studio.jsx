/* src/components/party/cocktail-studio.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.162 (Alex 20 Nov 05:19): the Signature Cocktail builder is back (restored from v1.80), below the Q&A on the Packages tab. Cocktails are saved in profile.content.cocktails. */



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



const SPIRITS17 = ["Vodka", "Gin", "Rum", "Tequila", "Mezcal", "Whisky", "Bourbon", "Brandy", "Cognac", "Liqueur"];


const newIng17 = () => ({ id: uid("ing"), amt: "", unit: "ml", name: "", buy: "" });


const NEW_COCKTAIL17 = (style) => ({ id: uid("ck"), style: style === "classic" ? "classic" : "signature", kind: "cocktail", spirit: "", spiritOther: "", price: "", name: "", note: "", photo: "", glass: "martini", glassOther: "", keywords: [], ings: [newIng17(), newIng17(), newIng17()] });



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
  const recHead = React.createElement("div", {
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
  }, x))));
  const modeTabs = React.createElement("div", {
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
  }, l)));
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
  }, l)))) : React.createElement("span", {
    className: "ff-c17-kindline"
  }, c.style === "classic" ? "Classic " : "Signature ", c.kind === "mocktail" ? "mocktail" : "cocktail", c.kind !== "mocktail" && (c.spirit === "other" ? c.spiritOther : c.spirit) ? ` · ${c.spirit === "other" ? c.spiritOther : c.spirit}` : ""), edit ? React.createElement("div", {
    className: "ff-c17-modrow"
  }, modeTabs, recHead) : recHead, edit ? React.createElement("div", {
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





function CocktailStudio17() {
  const { state, dispatch } = useStore();
  const tag = String(state.auth.tag || state.session.tag || "");
  const mine = myContent17(state, "cocktails");
  const [draft, setDraft] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (patch) => setDraft(d => ({ ...d, ...patch }));
  const persist = async (list) => {
    setBusy(true);
    const r = await PROFILE_ADAPTER.saveContent(tag, { ...pcOf17(state.profile), owner: tag, cocktails: list });
    setBusy(false);
    if (r.ok) { dispatch({ type: "PC_SAVE", content: r.content }); return true; }
    dispatch({ type: "TOAST", toast: "Create your FF Tag first to save a cocktail" });
    return false;
  };
  const save = async () => {
    if (!String(draft.name || "").trim()) { dispatch({ type: "TOAST", toast: "Give the cocktail a name" }); return; }
    const has = mine.some(x => x.id === draft.id);
    const list = has ? mine.map(x => x.id === draft.id ? draft : x) : [...mine, draft];
    if (await persist(list)) { setDraft(null); dispatch({ type: "TOAST", toast: "Cocktail saved" }); }
  };
  const del = async () => { if (await persist(mine.filter(x => x.id !== draft.id))) setDraft(null); };
  const pair = (x, edit) => (
    <div className={"ff-c17pair" + (edit ? "" : " sm")}>
      <Card17 kind="cocktail" tone="dark" plate="Signature Cocktail" tag={tag} edit={edit} size={edit ? "auto" : "sm"}><CocktailFront17 c={x} edit={edit} set={set} /></Card17>
      <Card17 kind="cocktail" tone="dark" plate="Recipe" tag={tag} edit={edit} size={edit ? "auto" : "sm"}><CocktailBack17 c={x} edit={edit} set={set} /></Card17>
    </div>
  );
  return (
    <section className="ff-pp ff-pp21 ff-cks17" aria-label="Your menu">
      {draft ? (<>
        {pair(draft, true)}
        <div className="ff-cks17-act">
          {mine.some(x => x.id === draft.id) && <GacDelete17 onDelete={del} />}
          <button type="button" className="ff-btn ghost" onClick={() => setDraft(null)}>Cancel</button>
          <Btn variant="gold" disabled={busy} onClick={save}><Check size={15} strokeWidth={2.4} /> Save</Btn>
        </div>
      </>) : (
        <HScroll label="Your menu">
          {mine.map(x => <button key={x.id} type="button" className="ff-cks17-it" aria-label={`Edit ${x.name || "cocktail"}`} onClick={() => setDraft(x)}><Card17 kind="cocktail" tone="dark" plate="Signature Cocktail" tag={tag} size="sm"><CocktailFront17 c={x} /></Card17></button>)}
          <button type="button" className="ff-cks17-add" aria-label="New cocktail" onClick={() => setDraft(NEW_COCKTAIL17("signature"))}><S17I.Martini size={22} /><span className="pe2-plus1" aria-hidden="true"><Plus size={22} strokeWidth={2.2} /></span></button>
        </HScroll>
      )}
    </section>
  );
}
