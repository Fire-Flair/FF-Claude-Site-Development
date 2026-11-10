/* src/components/shared/card-brand.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* flagFor now lives with LANGUAGE_MASTER (Phase 1): real flag images, 52 languages. */

const CARD_DOMAIN = "ffparty.uk";



const A_GROUND = [["#2A2118", "#0A0A0C"], ["#241C22", "#0A0A0C"], ["#1B2028", "#08080A"], ["#2A211A", "#0B0A08"]];


const A_SKIN = [["#EFCFA8", "#966E49"], ["#D9A876", "#7A522F"], ["#B07B4E", "#5E3B21"], ["#8A5A36", "#472A16"], ["#6B4227", "#331D10"]];


const A_GARMENT = [["#17171A", "#08080A"], ["#1E1A16", "#0B0A08"], ["#241318", "#0D0709"], ["#15191F", "#080A0D"]];


const A_HAIR = ["#171310", "#2A1B10", "#4A3117", "#100E0C", "#5A4632"];



function avatarFor(seed) {
  const key = String(seed || "FireFlair");
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const at = (arr, shift) => arr[(h >>> shift) % arr.length];
  const [g1, g2] = at(A_GROUND, 2);
  const [sk1, sk2] = at(A_SKIN, 7);
  const [gm1, gm2] = at(A_GARMENT, 12);
  const hair = at(A_HAIR, 17);
  const style = (h >>> 22) % 4;
  const tie = (h >>> 27) % 3 === 0;
  const flip = (h >>> 29) % 2 === 1;

  const crown = "M55 64 C55 37 105 37 105 64 C105 49 95 41 80 41 C65 41 55 49 55 64 Z";
  const hairShape = {
    0: `<path d='M57 60 C57 40 103 40 103 60 C103 50 94 44 80 44 C66 44 57 50 57 60 Z' fill='${hair}'/>`,
    1: `<path d='${crown}' fill='${hair}'/>`,
    2: `<path d='${crown}' fill='${hair}'/><path d='M55 58 C50 86 52 112 57 126 L68 120 C62 104 60 80 61 62 Z' fill='${hair}'/><path d='M105 58 C110 86 108 112 103 126 L92 120 C98 104 100 80 99 62 Z' fill='${hair}'/>`,
    3: `<path d='${crown}' fill='${hair}'/><circle cx='80' cy='30' r='11' fill='${hair}'/>`,
  }[style];

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'>`
    + `<defs>`
    + `<radialGradient id='bg' cx='36%' cy='26%' r='86%'><stop offset='0' stop-color='${g1}'/><stop offset='1' stop-color='${g2}'/></radialGradient>`
    + `<linearGradient id='sk' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${sk1}'/><stop offset='1' stop-color='${sk2}'/></linearGradient>`
    + `<linearGradient id='gm' x1='0' y1='0' x2='0' y2='1'><stop offset='0' stop-color='${gm1}'/><stop offset='1' stop-color='${gm2}'/></linearGradient>`
    + `</defs>`
    + `<rect width='160' height='160' fill='url(#bg)'/>`
    + `<circle cx='126' cy='34' r='17' fill='#C9A227' fill-opacity='.10'/>`
    + `<circle cx='30' cy='52' r='11' fill='#C9A227' fill-opacity='.08'/>`
    + `<circle cx='142' cy='96' r='8' fill='#EAD79C' fill-opacity='.07'/>`
    + `<g transform='${flip ? "translate(160,0) scale(-1,1)" : "translate(0,0)"}'>`
    + `<path d='M12 160 C16 118 42 100 64 94 L80 104 L96 94 C118 100 144 118 148 160 Z' fill='url(#gm)'/>`
    + `<path d='M70 78 h20 v24 l-10 7 -10 -7 Z' fill='url(#sk)' fill-opacity='.9'/>`
    + `<path d='M64 94 L80 106 L96 94 L96 104 L80 118 L64 104 Z' fill='#EFEAE0' fill-opacity='.9'/>`
    + (tie ? `<path d='M80 110 l-11 -5 v10 z M80 110 l11 -5 v10 z' fill='#1A1A1D'/><circle cx='80' cy='110' r='3' fill='#1A1A1D'/>` : ``)
    + `<ellipse cx='80' cy='66' rx='23' ry='28' fill='url(#sk)'/>`
    + hairShape
    + `<path d='M101 48 C110 60 110 80 100 92' stroke='#EAD79C' stroke-opacity='.55' stroke-width='2.5' fill='none' stroke-linecap='round'/>`
    + `<path d='M104 106 C118 110 132 124 138 144' stroke='#C9A227' stroke-opacity='.35' stroke-width='2' fill='none' stroke-linecap='round'/>`
    + `</g></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}



function Corners() {
  return (<>
    <span className="ff-corner tl" /><span className="ff-corner tr" />
    <span className="ff-corner bl" /><span className="ff-corner br" />
  </>);
}


const FF_LOGO_GOLD = __ff_json("content/data/ff-logo-gold.json");


const FF_LOGO_SILVER = __ff_json("content/data/ff-logo-silver.json");


const FF_LOGO_BRONZE = __ff_json("content/data/ff-logo-bronze.json");


const FF_EMBLEM_SRC = { standard: FF_LOGO_GOLD, gold: FF_LOGO_GOLD, silver: FF_LOGO_SILVER, bronze: FF_LOGO_BRONZE };



const METAL = {
  base:     { edge: ["#EDEBE7", "#A9A6A0", "#55534F", "#9A978F", "#E2DFD9"], hair: "rgba(150,147,140,.40)", ink: "#D8D4CC", face: ["#2A2A2C", "#0C0C0D"] },
  standard: { edge: ["#F6E7B0", "#C9A227", "#5F4712", "#B99424", "#EFDB9A"], hair: "rgba(201,162,39,.40)", ink: "#F0DC9A", face: ["#2B2B31", "#0B0B0D"] },
  bronze:   { edge: ["#F2C89A", "#C07A3C", "#5A3315", "#B0692F", "#EABF8C"], hair: "rgba(200,126,62,.42)", ink: "#F0C08A", face: ["#2A1A10", "#0D0705"] },
  silver:   { edge: ["#FFFFFF", "#D4D8DE", "#767C85", "#C6CBD2", "#F4F6F9"], hair: "rgba(214,219,226,.40)", ink: "#EFF1F4", face: ["#2C2E33", "#0A0A0C"] },
  gold:     { edge: ["#FFF3C4", "#E8C75E", "#7A5C12", "#D8B443", "#FBEDB6"], hair: "rgba(232,199,94,.48)", ink: "#F9E9B4", face: ["#2E2714", "#0C0A05"] },
};


const metalOf = (tier) => METAL[tier] || METAL.standard;


const metalEdge = (tier, angle = 150) => {
  const m = metalOf(tier);
  return `linear-gradient(${angle}deg, ${m.edge[0]}, ${m.edge[1]} 24%, ${m.edge[2]} 50%, ${m.edge[3]} 74%, ${m.edge[4]})`;
};



const F_FORM = "M0 0 H24.5 V7.4 H8.6 V20.6 H20.4 V28 H8.6 V48 H0 Z";



let __ffIdSeq = 0;


function useSimpleId() { const r = useRef(null); if (r.current == null) r.current = `ffid${__ffIdSeq++}`; return r.current; }


function FFEmblem({ size = 40, tier = "standard", flat = false, style }) {
  const m = metalOf(tier);
  const id = useSimpleId();
  if (tier === "base")
    return React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 100 100",
      "aria-hidden": "true",
      style: { display: "block", flex: "none", ...style }
    }, React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "48",
      fill: "#FBFAF7",
      stroke: "#BDB9B1",
      strokeWidth: "3"
    }), React.createElement("circle", {
      cx: "50",
      cy: "50",
      r: "40",
      fill: "none",
      stroke: "#CFCBC3",
      strokeWidth: "1.4",
      strokeDasharray: "3 3"
    }), React.createElement("g", {
      transform: "translate(33.66 29.84) skewX(-9) scale(0.84)",
      fill: "none",
      stroke: "#8E8A82",
      strokeWidth: "2.6",
      strokeLinejoin: "round"
    }, React.createElement("path", {
      d: F_FORM
    }), React.createElement("g", {
      transform: "translate(22 0)"
    }, React.createElement("path", {
      d: F_FORM
    }))));
  const logo = FF_EMBLEM_SRC && (FF_EMBLEM_SRC[tier] || FF_EMBLEM_SRC.standard);
  if (logo) {
    const grey = tier === "base" ? { filter: "grayscale(1) brightness(2.1) contrast(.5) drop-shadow(0 0 1px rgba(0,0,0,.45))", opacity: 0.9 } : null;
    return React.createElement("img", { decoding: "async",
      src: logo,
      width: size,
      height: size,
      alt: "",
      "aria-hidden": "true",
      draggable: false,
      style: { display: "block", flex: "none", objectFit: "contain", ...grey, ...style }
    });
  }
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    "aria-hidden": "true",
    style: { display: "block", flex: "none", ...style }
  }, React.createElement("defs", null, React.createElement("linearGradient", {
    id: `e${id}`,
    x1: "0.12",
    y1: "0",
    x2: "0.88",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: m.edge[0]
  }), React.createElement("stop", {
    offset: "24%",
    stopColor: m.edge[1]
  }), React.createElement("stop", {
    offset: "50%",
    stopColor: m.edge[2]
  }), React.createElement("stop", {
    offset: "74%",
    stopColor: m.edge[3]
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: m.edge[4]
  })), React.createElement("radialGradient", {
    id: `f${id}`,
    cx: "36%",
    cy: "26%",
    r: "82%"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: m.face[0]
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: m.face[1]
  })), React.createElement("linearGradient", {
    id: `t${id}`,
    x1: "0.1",
    y1: "0",
    x2: "0.9",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: m.edge[0]
  }), React.createElement("stop", {
    offset: "42%",
    stopColor: m.edge[1]
  }), React.createElement("stop", {
    offset: "70%",
    stopColor: m.edge[3]
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: m.edge[4]
  })), React.createElement("linearGradient", {
    id: `s${id}`,
    x1: "0",
    y1: "0",
    x2: "0.6",
    y2: "1"
  }, React.createElement("stop", {
    offset: "0%",
    stopColor: "#FFFFFF",
    stopOpacity: ".6"
  }), React.createElement("stop", {
    offset: "100%",
    stopColor: "#FFFFFF",
    stopOpacity: "0"
  }))), React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "49",
    fill: `url(#e${id})`
  }), React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "43.5",
    fill: `url(#f${id})`
  }), !flat && React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "40.6",
    fill: "none",
    stroke: "#8C1526",
    strokeWidth: "1.5",
    opacity: ".8"
  }), React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: "37.4",
    fill: "none",
    stroke: m.edge[1],
    strokeWidth: ".7",
    opacity: ".5"
  }), React.createElement("g", {
    transform: "translate(33.66 29.84) skewX(-9) scale(0.84)"
  }, React.createElement("path", {
    d: F_FORM,
    fill: `url(#t${id})`
  }), React.createElement("g", {
    transform: "translate(22 0)"
  }, React.createElement("path", {
    d: F_FORM,
    fill: "none",
    stroke: m.face[1],
    strokeWidth: "3.4",
    strokeLinejoin: "round"
  }), React.createElement("path", {
    d: F_FORM,
    fill: `url(#t${id})`
  }))), React.createElement("path", {
    d: "M16 32 A40 40 0 0 1 58 11",
    fill: "none",
    stroke: `url(#s${id})`,
    strokeWidth: "3",
    strokeLinecap: "round",
    opacity: ".55"
  }));
}



function Coin({ size = 40, tier = "standard", flat = false, style }) {
  return <FFEmblem size={size} tier={tier} flat={flat} style={style} />;
}



const WM_LIGHT = "linear-gradient(100deg,#FBF0CA,#E6CE84 26%,#B08D2A 52%,#EBD695 74%,#FCF2D2)";


const WM_DARK = "linear-gradient(100deg,#9A7A24,#6F5514 30%,#B08D2A 52%,#7E611D 76%,#A5832B)";


function Wordmark({ size = 15, tone = "#EAD79C", text = "FIREFLAIR", spacing = ".22em" }) {
  const onLight = tone !== "#EAD79C";
  const s = {
    fontFamily: "var(--display)", fontSize: size, letterSpacing: spacing, whiteSpace: "nowrap",
    backgroundImage: onLight ? WM_DARK : WM_LIGHT, display: "inline-block",
  };
  return (<span className="ff-metal" style={s}>{text}</span>);
}


function CardFrame({ tier = "standard", theme, ratio, selected, onClick, style, className = "", hair = true, corners = false, premium = false, as = "div", children }) {
  const t = theme || THEMES.onyx;
  const m = metalOf(tier);
  const Tag = as;
  return React.createElement(Tag, {
    className: `ff-deck ${premium ? "pc" : ""} ${t.dark ? "" : "lite"} ${selected ? "ff-sel" : ""} ${className}`,
    onClick,
    style: {
      backgroundImage: `${t.bg}, ${metalEdge(tier)}`,
      aspectRatio: ratio,
      cursor: onClick ? "pointer" : undefined,
      border: premium ? "3px solid transparent" : "1px solid transparent",
      "--deck-hair": premium ? t.edge || m.hair : m.hair,
      ...style
    }
  }, React.createElement("span", {
    className: "fx sheen"
  }), React.createElement("span", {
    className: "fx grain"
  }), premium && React.createElement("span", {
    className: "fx wm"
  }), hair && React.createElement("span", {
    className: "fx hair"
  }), corners && React.createElement(Corners, null), children);
}



function Portrait({ src, name, size = 92, ring = "#C9A227", ink = "#EAD79C", tier }) {
  const initials = (name || "").split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const band = size * 0.032 + 1.4;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", flex: "none", padding: band,
      background: tier ? metalEdge(tier, 145) : `linear-gradient(145deg, ${ring}, ${ring})`,
      boxShadow: `0 ${size * 0.06}px ${size * 0.18}px rgba(0,0,0,.45), inset 0 0 0 1px rgba(255,255,255,.22)`,
    }}>
      <div role={src ? "img" : undefined} aria-label={src ? `Photo of ${name || "profile"}` : undefined} style={{
        width: "100%", height: "100%", borderRadius: "50%", position: "relative", overflow: "hidden",
        border: "1px solid rgba(8,8,10,.9)",
        background: src ? `url("${src}") center/cover` : "radial-gradient(circle at 38% 30%,#26262B,#0A0A0C)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "inset 0 2px 9px rgba(0,0,0,.6)",
      }}>
        {!src && <span style={{ fontFamily: "var(--display)", color: ink, fontSize: size * 0.3, letterSpacing: ".05em", opacity: .85 }}>{initials}</span>}
        <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(64% 46% at 30% 16%, rgba(255,255,255,.20), transparent 62%)" }} />
      </div>
    </div>
  );
}
