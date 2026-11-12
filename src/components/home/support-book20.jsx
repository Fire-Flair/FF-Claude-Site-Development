/* src/components/home/support-book20.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   BOOK A 15-MINUTE CALL (v17.4.6.4) — URL-addressable support page.
   Reachable at  #/support/book-a-call  (and /support/book-a-call when the host rewrites that path to the app) on
   FF Team, FF Staff, FF Party and FF VIP. The Calendly address lives only in content/data/support.json.
   ========================================================================== */
const SUPPORT20 = __ff_json("content/data/support.json");
const SUPPORT20_RE = /^(?:#)?\/support\/book-a-call\/?$/i;

function support20Url() {
  const u = String(SUPPORT20.calendlyUrl || "").trim();
  return /^https:\/\/(?:www\.)?calendly\.com\/[^\s]+$/i.test(u) ? u : "";
}

function support20Match() {
  const h = String(window.location.hash || ""), p = String(window.location.pathname || "");
  return SUPPORT20_RE.test(h) || SUPPORT20_RE.test(p);
}

function SupportRoute20() {
  const { state, dispatch } = useStore();
  const ref = useRef(state); ref.current = state;
  useEffect(() => {
    const sync = () => {
      const on = support20Match(), cur = ref.current.supportPage20;
      if (on && !cur) dispatch({ type: "V11_SET", patch: { supportPage20: { open: true } } });
      else if (!on && cur) dispatch({ type: "V11_SET", patch: { supportPage20: null } });
    };
    sync();
    window.addEventListener("popstate", sync); window.addEventListener("hashchange", sync);
    return () => { window.removeEventListener("popstate", sync); window.removeEventListener("hashchange", sync); };
  }, []);
  return null;
}

function support20Open(dispatch) {
  try { const u = "#" + SUPPORT20.path; if (window.location.hash !== u) window.history.pushState({ ff: "support" }, "", u); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { supportPage20: { open: true } } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
}

function support20Close(dispatch) {
  try { window.history.pushState(null, "", "/" === window.location.pathname || !SUPPORT20_RE.test(window.location.pathname) ? window.location.pathname + window.location.search : "/"); } catch (e) { /* ignore */ }
  dispatch({ type: "V11_SET", patch: { supportPage20: null } });
  try { window.scrollTo(0, 0); } catch (e) { /* ignore */ }
  setTimeout(() => { const el = document.getElementById("ff-staff"); if (el && el.scrollIntoView) el.scrollIntoView({ block: "center" }); }, 60);
}

function support20Seo(state) {
  if (!state.supportPage20) return null;
  return { page: "support-book", title: "Book a 15-minute Call — FireFlair Support", description: "Book a 15-minute call with FireFlair support.", canonical: ffSeoUrl(SUPPORT20.path), robots: support20Url() ? "index, follow" : "noindex, nofollow", type: "website", jsonLd: null };
}

function SupportBookPage20() {
  const { state, dispatch } = useStore();
  const key = siteBrandKey(state.role === "vip" || state.site === "vip" ? "vip" : state.site === "party" ? "party" : state.role === "staff" ? "staff" : "team");
  const brand = FF_SITE_BRAND[key] || FF_SITE_BRAND.team;
  const cal = support20Url();
  const embed = cal ? cal + (cal.includes("?") ? "&" : "?") + "embed_domain=" + encodeURIComponent(window.location.hostname || "ffteam.uk") + "&embed_type=Inline&hide_gdpr_banner=1" : "";
  const back = h18("button", { type: "button", className: "ff-fd-back", onClick: () => support20Close(dispatch) }, "← Back to support options");
  return h18("main", { className: "ff-fd-page ff-sb20", "aria-labelledby": "sb20-h1" },
    h18("style", null, ".ff-sb20-top{display:flex;align-items:center;gap:12px;margin:2px 0 12px}.ff-sb20-top img{width:44px;height:44px;border-radius:14px}.ff-sb20-top span{font:700 13px var(--sans);letter-spacing:.14em;text-transform:uppercase;color:var(--gold-dk)}.ff-sb20 h1{margin:0 0 8px;font-size:clamp(24px,6vw,34px);line-height:1.12}.ff-sb20 p{margin:0 0 14px;line-height:1.5}.ff-sb20-frame{width:100%;min-height:680px;border:1px solid var(--gold-dk);border-radius:22px;background:var(--paper)}.ff-sb20-cfg{padding:18px;border:1px dashed var(--gold-dk);border-radius:22px}"),
    back,
    h18("div", { className: "ff-sb20-top" }, h18("img", { src: brand.icon, alt: "", width: 44, height: 44 }), h18("span", null, brand.name || "FireFlair")),
    h18("h1", { id: "sb20-h1" }, SUPPORT20.callLabel),
    h18("p", null, "A short call with the FireFlair team about your profile, bookings or events. Pick a time that suits you."),
    cal
      ? h18(React.Fragment, null,
          h18("iframe", { className: "ff-sb20-frame", src: embed, title: "Book a 15-minute call", loading: "lazy" }),
          h18("p", { style: { marginTop: 12 } }, h18("a", { className: "ff-biz19-link", href: cal, target: "_blank", rel: "noopener" }, "Open the booking page in a new tab")))
      : h18("div", { className: "ff-sb20-cfg", role: "status" },
          h18("b", null, "Call booking isn't connected yet."),
          h18("p", { style: { margin: "6px 0 0" } }, "The Calendly link hasn't been added. It is set in one place, content/data/support.json (calendlyUrl).")));
}
