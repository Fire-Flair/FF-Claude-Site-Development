/* src/components/staff/company-pages.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* v1.1 (FF Team only): trimmed to the parts FF Team uses; the FF Staff / FF Party / VIP / admin code that was here is deleted. */
/* ==========================================================================
   COMPANIES — on Network (FF Team and FF Staff), and each company's page.
   Sample companies stand in for the ones Core will serve.
   ========================================================================== */
const IMG11 = window.FF_IMG || {};


const VK_CK17 = __ff_json("content/data/vk-ck17.json");




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
 "in_rw_shoot": "49% 42%",
 "j17_vke07": "55% 50%",
 "j17_vke09": "62% 50%",
 "t17_hp02": "40% 38%",
 "j17_hp02": "40% 50%",
 "j17_vke12": "50% 50%",
 "t17_hp03": "55% 44%",
 "j17_hp03": "55% 50%",
 "t17_hp01": "30% 51%",
 "j17_hp01": "30% 50%",
 "t17_p44": "50% 62%",
 "j17_p37": "60% 50%",
 "t17_vkg15": "50% 30%",
 "j17_hp04": "40% 55%",
 "j17_p43": "60% 50%"
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
  if (c && c.fixedCards) return "j17_" + c.fixedCards[i % c.fixedCards.length];
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
  if (id === "mine") { const c = state.company || {}; const cl = coClaimMine17(state), open = cl && cl.status !== "approved"; return { ...c, ...(open ? { unclaimed: true, claimPending: cl.status === "pending", claimRejected: cl.status === "rejected" } : {}), id: "mine", mine: true, mediaList: (c.media || []), areas: c.areas !== undefined ? c.areas : (c.location || "") }; }
  const base = COMPANIES.find(x => x.id === id) || SUPPLIER_BASES17[id];
  const page = COMPANY_PAGES[id];
  if (!base || !page) return null;
  /* FireFlair's edits or a live claim sit over the profile file (claims17.js). */
  const ov = dirOverlay17(state, id);
  const merged = ov ? { ...base, ...page, ...ov } : { ...base, ...page };
  return { ...merged, id, mediaList: merged.media.map(k => typeof k === "string" ? { id: k, src: IMG11[k] } : k).filter(m => m.src) };
}


function coIsVk17(state) {
  const c = state.company || {};
  /* The sample company: the dev/demo Vooshka account, or the signed-out preview (no company yet). A company that has joined has a slug and starts empty. */
  return c.slug === "vooshka" || (!c.slug && !String(c.name || "").trim());
}


function coPartners17(state, co) {
  const ids = (co && (co.mine ? (state.company || {}).partners : co.partners)) || [];
  return ids.map(id => companyById(state, id)).filter(Boolean);
}


const companyList = (state) => adminCompanies17(state, [
  ...(state.company && state.company.joinedAt ? [companyById(state, "mine")] : []),
  ...COMPANIES.map(x => companyById(state, x.id)).filter(Boolean),
]);
