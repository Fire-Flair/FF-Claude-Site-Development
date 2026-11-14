/* src/content/stories/stories-reader.jsx — Stories reader (part of the prototype script; joined in manifest order). */
/* ==== Stories phase 2 (reader code; data from stories/*.md via scripts/build-stories.py) ==================
   Do not edit story data by hand: edit the markdown in stories/ and run `npm run stories`.
   - ST18 holds the new editorial articles, keyed by slug, and is merged into JR17.
   - ST18_ORDER sets the order shown on each site; older stories that were merged into a new one
     are no longer listed (their data stays in JR17 until the developers delete it).
   - ST18_ROUTES: set to true once the server delivers /stories/{slug} (see stories/INVENTORY.md).
     With false the reader still works, but the address bar is left alone. */
const ST18_ROUTES = false;
const ST18 = CONTENT_ADAPTER.storyArticles();
const ST18_ORDER = CONTENT_ADAPTER.storyOrder();
const ST18_IMGS = CONTENT_ADAPTER.storyImages();
const ST18_IDS = {};
Object.keys(ST18).forEach((s) => { JR17[s] = ST18[s]; ST18_IDS[ST18[s].id] = s; });
Object.assign(JR17_ORDER, ST18_ORDER);

const ST18_CSS = [
  ".ff .ff-jr17-card .ph.txt{display:flex;align-items:flex-end;padding:14px;background:linear-gradient(165deg,#2A2318,#16130F);color:#E4C36A;text-align:left}",
  ".ff .ff-jr17-card .ph.txt span{font-family:var(--display);font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:#E4C36A}",
  ".ff a.ff-jr17-card{text-decoration:none;color:inherit;border-radius:22px;corner-shape:squircle}",
  ".ff .ff-jr17-art{overflow-wrap:normal;word-break:normal;hyphens:none}",
  ".ff .ff-jr17-art .ff-st-tw{width:100%;overflow-x:auto;margin:6px 0 12px;border:1px solid rgba(126,97,29,.3);border-radius:14px;corner-shape:squircle;-webkit-overflow-scrolling:touch}",
  ".ff .ff-jr17-art table{border-collapse:collapse;width:100%;min-width:480px;font-size:13.5px;line-height:1.4;background:#FFFDF8}",
  ".ff .ff-jr17-art th{background:#16130F;color:#E4C36A;text-align:left;padding:8px 10px;font-weight:700;white-space:nowrap}",
  ".ff .ff-jr17-art td{padding:8px 10px;vertical-align:top;border-top:1px solid rgba(126,97,29,.2);color:#2E2820}",
  ".ff .ff-jr17-art ul,.ff .ff-jr17-art ol{margin:0 0 10px;padding-left:20px;font-size:15.5px;line-height:1.55;color:#3A342B}",
  ".ff .ff-jr17-art li{margin:0 0 4px}",
  ".ff .ff-jr17-art blockquote{margin:4px 0 12px;padding:10px 14px;border-left:3px solid #B08D2A;background:rgba(201,162,39,.1);border-radius:10px;corner-shape:squircle;font-size:15px;line-height:1.5;color:#2E2820}",
  ".ff .ff-jr17-art a.ff-st-link{color:#7E611D;font-weight:700;text-decoration:underline}",
  ".ff .ff-jr17-art .ff-st-rev{font-size:12.5px;color:#6A6253;margin:2px 0 6px}",
  ".ff .ff-jr17-art .ff-st-more{margin-top:14px;padding-top:12px;border-top:1px solid rgba(126,97,29,.25);width:100%}",
  ".ff .ff-jr17-art .ff-st-more b{display:block;margin-bottom:6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#7E611D}",
  ".ff .ff-jr17-art .ff-st-more a{display:block;padding:7px 0;font-weight:700;color:#16130F;text-decoration:none;border-bottom:1px solid rgba(126,97,29,.15)}",
  ".ff .ff-jr17-art .ff-st-cta{margin-top:16px}"
].join("\n");

function ST18_inline(text, onLink) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      const href = m[2];
      const internal = href.indexOf("/stories/") === 0;
      const slug = internal ? href.slice(9) : "";
      if (internal && !JR17[slug]) out.push(m[1]);
      else out.push(React.createElement("a", {
        key: k++, href, className: "ff-st-link",
        target: internal ? undefined : "_blank", rel: internal ? undefined : "noopener",
        onClick: (e) => { if (internal && onLink && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); onLink(slug); } }
      }, m[1]));
    } else if (m[3]) out.push(React.createElement("b", { key: k++ }, m[3]));
    else out.push(React.createElement("em", { key: k++ }, m[4]));
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function ST18_blocks(text, onLink) {
  const kind = (l) => /^\|/.test(l) ? "t" : /^- /.test(l) ? "u" : /^\d+\. /.test(l) ? "o" : /^> ?/.test(l) ? "q" : "p";
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const groups = [];
  lines.forEach((l) => {
    const t = kind(l), g = groups[groups.length - 1];
    if (g && g.t === t) g.l.push(l); else groups.push({ t, l: [l] });
  });
  const inl = (s) => ST18_inline(s, onLink);
  return groups.map((g, i) => {
    if (g.t === "t") {
      const rows = g.l.map((r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim()));
      const body = rows.slice(/^[-: ]+$/.test(rows[1] ? rows[1][0] : "") ? 2 : 1);
      return React.createElement("div", { key: i, className: "ff-st-tw" }, React.createElement("table", null,
        React.createElement("thead", null, React.createElement("tr", null, rows[0].map((c, j) => React.createElement("th", { key: j }, inl(c))))),
        React.createElement("tbody", null, body.map((r, j) => React.createElement("tr", { key: j }, r.map((c, n) => React.createElement("td", { key: n }, inl(c))))))));
    }
    if (g.t === "u") return React.createElement("ul", { key: i }, g.l.map((l, j) => React.createElement("li", { key: j }, inl(l.replace(/^- /, "")))));
    if (g.t === "o") return React.createElement("ol", { key: i }, g.l.map((l, j) => React.createElement("li", { key: j }, inl(l.replace(/^\d+\. /, "")))));
    if (g.t === "q") return React.createElement("blockquote", { key: i }, inl(g.l.map((l) => l.replace(/^> ?/, "")).join(" ")));
    return React.createElement("p", { key: i }, inl(g.l.join(" ")));
  });
}

/* ---- Shared Stories footer (v17.3.136): reader Q&A, one primary CTA, people and sources ---------
   PROTOTYPE PERSISTENCE: answers are held in window.__ffStoryFeedback for this browser session only.
   Nothing is sent to a server. The footer says so. Set window.__ffStoryFeedbackFail = true to test retry. */
const ST19_PROFILES = CONTENT_ADAPTER.storyProfiles();
const ST19_CSS = [
  ".ff .ff-st-qa{margin-top:18px;padding:14px;border:1px solid rgba(126,97,29,.3);border-radius:16px;corner-shape:squircle;background:#FFFDF8}",
  ".ff .ff-st-qa h4{margin:0 0 4px}",
  ".ff .ff-st-qa .note{font-size:12.5px;line-height:1.4;color:#6A6253;margin:0 0 10px}",
  ".ff .ff-st-qa fieldset{border:0;margin:0 0 12px;padding:0;min-width:0}",
  ".ff .ff-st-qa legend{font-size:15px;font-weight:700;color:#16130F;padding:0;margin-bottom:6px}",
  ".ff .ff-st-qa label.opt{display:flex;align-items:center;gap:10px;min-height:44px;padding:6px 10px;border:1px solid rgba(126,97,29,.3);border-radius:12px;corner-shape:squircle;margin-bottom:6px;font-size:15px;color:#2E2820;cursor:pointer}",
  ".ff .ff-st-qa label.opt:has(input:checked){border-color:#B08D2A;background:rgba(201,162,39,.12)}",
  ".ff .ff-st-qa label.opt:has(input:focus-visible){outline:2px solid #7E611D;outline-offset:2px}",
  ".ff .ff-st-qa input[type=radio]{width:20px;height:20px;accent-color:#7E611D;flex:none}",
  ".ff .ff-st-qa textarea{width:100%;box-sizing:border-box;min-height:72px;margin-top:2px;padding:10px;border:1px solid rgba(126,97,29,.4);border-radius:12px;font:inherit;font-size:16px;color:#16130F;background:#fff}",
  ".ff .ff-st-qa .tl{display:block;font-size:13px;color:#6A6253;margin:4px 0 2px}",
  ".ff .ff-st-qa .sub{min-height:44px;padding:0 16px;border-radius:12px;corner-shape:squircle;border:1px solid #7E611D;background:transparent;color:#4D3C10;font:inherit;font-weight:700;cursor:pointer}",
  ".ff .ff-st-qa .sub:focus-visible{outline:2px solid #7E611D;outline-offset:2px}",
  ".ff .ff-st-qa .st{margin-top:8px;font-size:14px;color:#2E2820}",
  ".ff .ff-st-qa .st.err{color:#8A2A1D}",
  ".ff .ff-st-ppl{margin-top:16px;padding-top:12px;border-top:1px solid rgba(126,97,29,.25);font-size:14px;line-height:1.5;color:#3A342B}",
  ".ff .ff-st-ppl b.h{display:block;margin-bottom:6px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#7E611D}",
  ".ff .ff-st-ppl dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:4px 12px}",
  ".ff .ff-st-ppl dt{color:#6A6253}",
  ".ff .ff-st-ppl dd{margin:0;font-weight:700;color:#16130F}"
].join("\n");

function ST19_person(key) {
  const p = ST19_PROFILES[key];
  return p && p.verified && p.public && p.url ? p : null;
}

function ST19_Footer({ o, children }) {
  const [ans, setAns] = useState({});
  const [txt, setTxt] = useState({});
  const [state, setState] = useState("idle");
  const sid = useRef("sf-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
  const qa = o.qa && o.qa.questions && o.qa.questions.length === 3 ? o.qa : null;
  const answered = qa ? qa.questions.filter((q) => ans[q.id] !== undefined) : [];
  const submit = () => {
    if (!answered.length) return;
    setState("sending");
    setTimeout(() => {
      if (window.__ffStoryFeedbackFail) { setState("error"); return; }
      const rec = {
        submissionId: sid.current, slug: o.slug, site: o.site, revision: o.qa.revision, ai: true, submittedAt: new Date().toISOString(),
        answers: answered.map((q) => {
          const a = ans[q.id], other = a === "other";
          return { id: q.id, question: q.text, answer: other ? "Something else" : q.options[a], other: other && (txt[q.id] || "").trim() ? (txt[q.id] || "").trim().slice(0, 500) : undefined };
        })
      };
      const list = (window.__ffStoryFeedback = window.__ffStoryFeedback || []);
      const i = list.findIndex((r) => r.submissionId === rec.submissionId);
      if (i >= 0) list[i] = rec; else list.push(rec);
      setState("done");
    }, 250);
  };
  const feat = (o.featured || []).map((k) => ({ k, p: ST19_person(k) })).filter((x) => x.p);
  const named = o.by && o.by !== "FireFlair editorial team";
  const src = o.sources || [];
  return React.createElement(React.Fragment, null,
    qa && React.createElement("section", { className: "ff-st-qa", "aria-labelledby": "ff-st-qa-h" },
      React.createElement("h4", { id: "ff-st-qa-h" }, "Three quick questions"),
      React.createElement("p", { className: "note" }, "Optional. Questions are written by AI and reviewed against this article. Answer any or all. Prototype only: answers stay in this browser session and are not sent anywhere."),
      state === "done"
        ? React.createElement("p", { className: "st", role: "status" }, "Thanks. " + answered.length + " of 3 answered (stored in this prototype session only).")
        : React.createElement(React.Fragment, null,
          qa.questions.map((q) => React.createElement("fieldset", { key: q.id },
            React.createElement("legend", null, q.text),
            q.options.concat(["Something else"]).map((label, i) => {
              const val = i === 2 ? "other" : i, id = "ffqa-" + q.id + "-" + i;
              return React.createElement("label", { key: i, className: "opt", htmlFor: id },
                React.createElement("input", { type: "radio", id, name: "ffqa-" + q.id, checked: ans[q.id] === val, onChange: () => { setAns((a) => ({ ...a, [q.id]: val })); setState("idle"); } }), label);
            }),
            ans[q.id] === "other" && React.createElement("label", { className: "tl", htmlFor: "ffqa-" + q.id + "-t" }, "Tell us more (optional)"),
            ans[q.id] === "other" && React.createElement("textarea", { id: "ffqa-" + q.id + "-t", maxLength: 500, value: txt[q.id] || "", onChange: (e) => setTxt((t) => ({ ...t, [q.id]: e.target.value })) }))),
          React.createElement("button", { type: "button", className: "sub", disabled: !answered.length || state === "sending", onClick: submit }, state === "sending" ? "Sending..." : state === "error" ? "Try again" : "Send answers"),
          React.createElement("div", { className: "st" + (state === "error" ? " err" : ""), role: "status", "aria-live": "polite" }, state === "error" ? "That did not send. Your answers are still here. Try again." : answered.length ? answered.length + " of 3 answered" : ""))),
    children,
    React.createElement("div", { className: "ff-st-ppl" }, React.createElement("b", { className: "h" }, "People and sources"),
      React.createElement("dl", null,
        React.createElement("dt", null, "Written by"), React.createElement("dd", null, o.by),
        o.posted && o.posted !== o.by && React.createElement(React.Fragment, null, React.createElement("dt", null, "Posted by"), React.createElement("dd", null, o.posted)),
        feat.length > 0 && React.createElement(React.Fragment, null, React.createElement("dt", null, "Featured"), React.createElement("dd", null, feat.map((x, i) => React.createElement("a", { key: x.k, className: "ff-st-link", href: x.p.url }, (i ? ", " : "") + x.p.name)))),
        React.createElement("dt", null, "Sources"), React.createElement("dd", null, src.length ? src.join("; ") : "None listed"))));
}

/* Five story categories on all three sites (plus All). Every story's own category is folded into one of them. */
const STORY_CATS17 = ["How it works", "Planning and booking", "Pay and costs", "Skills and growth", "Local and news"];
function storyCat17(c) {
  const t = String(c || "").toLowerCase();
  if (/local|news/.test(t)) return STORY_CATS17[4];
  if (/cost|fee|pay|tax|money|terms|rate/.test(t)) return STORY_CATS17[2];
  if (/compar|how ff|your profile|staffing options/.test(t)) return STORY_CATS17[0];
  if (/book|accept|plan|urgent|problem|finding work|choosing|shift/.test(t)) return STORY_CATS17[1];
  return STORY_CATS17[3];
}


function Journal17({ kind = "team" }) {
  const [open, setOpen] = useState(null);
  const [cat, setCat] = useState("All");
  const nav = useHireNav();
  const { dispatch } = useStore();
  const opener = useRef(null);
  const ids = (JR17_ORDER[kind] || JR17_ORDER.team).filter((i) => JR17[i]);
  const cats = ["All", ...STORY_CATS17.filter((c) => ids.some((i) => storyCat17(JR17[i].cat) === c))];
  const shown = ids.filter((i) => cat === "All" || storyCat17(JR17[i].cat) === cat);
  const img = (k) => k ? ((ST18_IMGS[k] && ST18_IMGS[k].src) || CfImg11(k) || (typeof IMGS !== "undefined" && IMGS[k]) || "") : "";
  const fpos = (k) => (ST18_IMGS[k] ? { objectPosition: ST18_IMGS[k].pos } : fp17(k));
  const o = open ? JR17[open] : null;

  useEffect(() => {
    if (!document.getElementById("ff-st18-css")) {
      const s = document.createElement("style"); s.id = "ff-st18-css"; s.textContent = ST18_CSS + "\n" + ST19_CSS; document.head.appendChild(s);
    }
    /* A direct visit to /stories/{slug} opens the article. */
    const m = /^\/stories\/([a-z0-9-]+)\/?$/.exec(window.location.pathname || "");
    if (m && ids.indexOf(m[1]) >= 0) setOpen(m[1]);
    const pop = () => { const mm = /^\/stories\/([a-z0-9-]+)/.exec(window.location.pathname || ""); setOpen(mm && JR17[mm[1]] ? mm[1] : null); };
    /* Address (single file): #/<site>/stories/<slug> opens the article on load, on Back and on Forward. */
    const site = RT17_SITE_OF_KIND(kind);
    const fromHash = () => { const r = rt17Parse(window.location.hash); return r.kind === "stories" && r.site === site && ids.indexOf(r.slug) >= 0 ? r.slug : null; };
    const h0 = fromHash(); if (h0) setOpen(h0);
    const hpop = () => { if (rt17Parse(window.location.hash).kind !== "foreign") setOpen(fromHash()); };
    window.addEventListener("popstate", hpop);
    if (ST18_ROUTES) window.addEventListener("popstate", pop);
    return () => { window.removeEventListener("popstate", hpop); if (ST18_ROUTES) window.removeEventListener("popstate", pop); };
  }, []);

  const openStory = (id, trigger) => {
    if (!JR17[id]) return;
    if (trigger) opener.current = trigger;
    setOpen(id);
    if (ST18_ROUTES) { try { window.history.pushState({ story: id }, "", "/stories/" + id); } catch (e) { /* ignore */ } }
    else rt17Go(rt17Href({ kind: "stories", site: RT17_SITE_OF_KIND(kind), slug: id }));
  };
  /* Other parts of the page (the FF Staff Gold box) open a story with the "ff-openstory" event. */
  useEffect(() => {
    const h = (e) => { if (e && e.detail && ids.indexOf(e.detail) >= 0) openStory(e.detail); };
    window.addEventListener("ff-openstory", h);
    return () => window.removeEventListener("ff-openstory", h);
  }, [ids.join("|")]);
  const closeStory = () => {
    setOpen(null);
    if (ST18_ROUTES && /^\/stories\//.test(window.location.pathname)) { try { window.history.back(); } catch (e) { /* ignore */ } }
    else if (!ST18_ROUTES && rt17Parse(window.location.hash).kind === "stories") rt17Go(rt17Href({ kind: "home", site: RT17_SITE_OF_KIND(kind) }));
    const t = opener.current; if (t && t.focus) setTimeout(() => { try { t.focus(); } catch (e) { /* ignore */ } }, 50);
  };

  /* Search and AI crawlers read the Article data; it matches the visible article. */
  useEffect(() => {
    const old = document.getElementById("ff-st18-ld"); if (old) old.remove();
    const prevTitle = document.title;
    if (!o || !o.slug) return;
    const ld = {
      "@context": "https://schema.org", "@type": "Article", headline: o.title, description: o.blurb,
      datePublished: o.iso, dateModified: o.iso,
      author: (o.by && o.by !== "FireFlair editorial team") ? Object.assign({ "@type": "Person", name: o.by }, ST19_person((o.featured || [])[0]) ? { url: ST19_person(o.featured[0]).url } : {}) : { "@type": "Organization", name: "FireFlair editorial team" },
      publisher: { "@type": "Organization", name: "FIREFLAIR LTD" },
      mainEntityOfPage: "https://" + o.site + "/stories/" + o.slug
    };
    const s = document.createElement("script"); s.type = "application/ld+json"; s.id = "ff-st18-ld"; s.textContent = JSON.stringify(ld);
    document.head.appendChild(s);
    document.title = (o.seo || o.title) + " | FireFlair";
    return () => { s.remove(); document.title = prevTitle; };
  }, [open]);

  const cta = () => {
    setOpen(null);
    const to = (o && o.to) || "";
    /* Each button goes to the flow its label promises (v17.3.134). */
    if (/packages/i.test(to)) { nav.toNetwork(); return; }
    if (o && o.site === "ffteam.uk" && /FF Team home/i.test(to)) { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "home" }); window.scrollTo(0, 0); return; }
    if (o && o.site === "ffteam.uk") { dispatch({ type: "ROLE", role: "team" }); dispatch({ type: "TAB", tab: "profile", route: "home" }); window.scrollTo(0, 0); }
    else nav.toEvent();
  };
  /* Phase 2: on FF Party a button that would start a booking is locked; one that opens the network or another site still works. */
  const ctaLocked = !!o && o.site !== "ffteam.uk" && !/packages/i.test((o && o.to) || "") && kind === "party";
  const more = o && o.related ? o.related.map((r) => ST18_IDS[r]).filter((s) => s && JR17[s] && JR17[s].site === o.site) : [];

  return React.createElement("section", { className: "ff-sect ff-jr17", id: "ff-journal", "aria-labelledby": "ff-jr-h" },
    React.createElement("h2", { id: "ff-jr-h", className: "ff-h1 ff-jr17-title" }, React.createElement("span", { className: "k" }, "FireFlair"), React.createElement("span", { className: "s" }, "Stories")),
    React.createElement("div", { className: "ff-jr17-rule", "aria-hidden": "true" }, React.createElement("i", null),
      React.createElement("svg", { viewBox: "0 0 24 24", width: "18", height: "18" }, React.createElement("path", { d: "M12 2c1 3.5 5 5.5 5 10.5A5 5 0 0 1 7 13c0-2 1-3 2-4 .3 1.3 1 2 2 2-.5-3 0-6 1-9z", fill: "currentColor" })), React.createElement("i", null)),
    React.createElement("div", { className: "ff-jr17-cats", role: "group", "aria-label": "Story categories" },
      cats.map((c) => React.createElement("button", { key: c, type: "button", className: cat === c ? "on" : "", "aria-pressed": cat === c, onClick: () => setCat(c) }, c))),
    React.createElement("div", { className: "ff-jr17-row" }, shown.map((id) => {
      const p = JR17[id], src = img(p.img);
      return React.createElement("a", {
        key: id, className: "ff-jr17-card", href: "/stories/" + id,
        onClick: (e) => { if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); openStory(id, e.currentTarget); } }
      },
        React.createElement("span", { className: "ph" + (src ? "" : " txt") }, src ? React.createElement("img", { src, style: fpos(p.img), alt: p.alt || "", loading: "lazy", draggable: false }) : React.createElement("span", null, storyCat17(p.cat))),
        React.createElement("span", { className: "tx" }, React.createElement("i", null, storyCat17(p.cat) + " · " + p.date), React.createElement("b", null, p.title), React.createElement("small", null, p.blurb || p.intro)));
    })),
    React.createElement(Sheet, { open: !!o, onClose: closeStory, title: o ? storyCat17(o.cat) : "", center: true },
      o && React.createElement("article", { className: "ff-jr17-pop ff-jr17-art" },
        React.createElement(BackBtn17, { fallback: closeStory }),
        img(o.img) && React.createElement("img", { className: "hero", src: img(o.img), style: fpos(o.img), alt: o.alt || "" }),
        React.createElement("div", { className: "meta" }, React.createElement("time", null, o.date), React.createElement("span", null, o.min + " min read")),
        React.createElement("h3", null, o.title),
        React.createElement("div", { className: "by" }, React.createElement("span", { className: "coin" }, React.createElement(Coin, { size: 22, tier: "gold" })), React.createElement("span", null, "By ", React.createElement("b", null, o.by))),
        o.reviewed && React.createElement("div", { className: "ff-st-rev" }, "Last reviewed " + o.reviewed),
        React.createElement("div", { className: "lede" }, ST18_blocks(o.intro, openStory)),
        o.body.map(([h, t]) => React.createElement(React.Fragment, { key: h }, React.createElement("h4", null, h), ST18_blocks(t, openStory))),
        React.createElement(ST19_Footer, { key: o.slug, o },
          o.cta && React.createElement("div", { className: "ff-st-cta" }, ctaLocked ? React.createElement(LockedBtn17, null, o.cta) : React.createElement(Button, { onClick: cta }, o.cta))),
        more.length > 0 && React.createElement("div", { className: "ff-st-more" }, React.createElement("b", null, "Keep reading"),
          more.map((s) => React.createElement("a", { key: s, href: "/stories/" + s, onClick: (e) => { if (e.button === 0 && !e.metaKey && !e.ctrlKey) { e.preventDefault(); openStory(s); } } }, JR17[s].title))))));
}

/* v17.4.6: the FireFlair Stories editor shows the member's story rendered as an article, with the same
   article layout as the published Stories. User text goes through pcSafeMd17, so only https and
   /stories/ links stay links; everything else is plain text (React escapes it). */
function StoryPreview17({ p, by }) {
  const img = (k) => (window.FF_IMG || {})[k] || k;
  const paras = String(p.body || "").split(/\n{2,}/).map((t) => t.trim()).filter(Boolean);
  const words = [p.intro, p.body].join(" ").split(/\s+/).filter(Boolean).length;
  return React.createElement("section", { className: "ff-st17-prev", "aria-label": "Article preview" },
    React.createElement("style", null, ST18_CSS + ".ff .ff-st17-prev{margin:14px 0 4px;padding:14px;border:1px solid rgba(126,97,29,.3);border-radius:18px;corner-shape:squircle;background:#FFFDF8}.ff .ff-st17-prev .hero{width:100%;max-height:220px;object-fit:cover;border-radius:14px;corner-shape:squircle}.ff .ff-st17-prev h3{margin:8px 0 4px}.ff .ff-st17-prev .meta{display:flex;gap:10px;font-size:12.5px;color:#6A6253}.ff .ff-st17-prev .by{font-size:13px;margin:4px 0 10px}"),
    React.createElement("article", { className: "ff-jr17-art" },
      p.photo && React.createElement("img", { className: "hero", src: img(p.photo), alt: "" }),
      React.createElement("div", { className: "meta" }, React.createElement("span", null, p.cat ? storyCat17(p.cat) : "Story"), React.createElement("time", null, p.date), React.createElement("span", null, Math.max(1, Math.round(words / 200)) + " min read")),
      React.createElement("h3", null, p.title || "Untitled story"),
      React.createElement("div", { className: "by" }, "By ", React.createElement("b", null, by || "You")),
      p.intro && React.createElement("div", { className: "lede" }, ST18_blocks(pcSafeMd17(p.intro))),
      paras.map((t, i) => React.createElement(React.Fragment, { key: i }, ST18_blocks(pcSafeMd17(t)))),
      (p.places || []).length > 0 && React.createElement("p", { className: "ff-st-rev" }, (p.places || []).join(" · "))));
}
