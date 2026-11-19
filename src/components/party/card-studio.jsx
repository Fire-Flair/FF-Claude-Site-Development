/* src/components/party/card-studio.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
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







/* The same base on every card, the one the Profile Card has: the coin and the owner's FF Tag address. */
function CardBase17({ tag, url }) {
  return <div className="base"><FFLogo size={20} tier="gold" /><em>{url || `${CARD_DOMAIN}/${pc17Tag(tag) || "yourtag"}`}</em></div>;
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







const NEW_SERVICE17 = () => ({ id: uid("sv"), type: "base", cat: "bar", bands: [], price: "", priceFor: "", tone: "silver", title: "", tagline: "", includes: "", ideal: "", time: "", base: "", areas: [], events: [], guests: "", staff: "", setup: "", provides: "", equipment: "", extras: [], days: [], keywords: [] });




/* Five plain terms for customers booking a Service Card. They apply to every card, or a card can have its own. */
const TERMS17 = [
  { k: "book", label: "Your booking", text: "Your booking is confirmed once we accept it and you receive confirmation through FireFlair. The date, time, place and what is included are as shown on this Service Card." },
  { k: "pay", label: "Payment", text: "Payment is as agreed when we confirm your booking. Any deposit and the date the balance is due are confirmed with your booking." },
  { k: "changes", label: "Changes and cancellation", text: "Tell us as early as you can if you need to change or cancel, through FireFlair, so we can do our best to move your booking." },
  { k: "access", label: "Access and set-up", text: "We need access to the venue, a suitable space and power at the agreed set-up time. You provide anything listed under the client provides." },
  { k: "care", label: "Guests, safety and insurance", text: "You are responsible for your guests and the venue. We hold the licences and insurance needed to deliver this service, and may refuse service where the law or safety requires it." },
];














/* The Packages tab on a profile: the Q&A. In Phase 2 what a person saves in the card builders (Signature cocktails, Service Cards)
   is kept on their profile editor only and is not shown on any public view. */
function PkgExtras17({ person }) {
  return <PublicQA person={person} />;
}
