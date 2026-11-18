/* src/utils/analytics.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
const AN17 = { events: [], sid: `s_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, cur: null, since: 0, scroll: 0, started: false, l: new Set(), t: null };


const AN17_KEY = "ff_analytics17";


(function an17Load() {
  try {
    const raw = localStorage.getItem(AN17_KEY);
    if (raw) {
      const v = JSON.parse(raw);
      AN17.events = Array.isArray(v.events) ? v.events.slice(-3000) : [];
    }
  } catch (e) {}
})();


const an17Save = () => { clearTimeout(AN17.t); AN17.t = setTimeout(() => { try { localStorage.setItem(AN17_KEY, JSON.stringify({ events: AN17.events.slice(-3000) })); } catch (e) {} }, 400); };


const an17Emit = () => AN17.l.forEach(f => f());


function track17(type, props = {}) {
  const ev = { type, at: Date.now(), sid: AN17.sid, screen: AN17.cur, w: window.innerWidth, ...props };
  AN17.events.push(ev); if (AN17.events.length > 3000) AN17.events.splice(0, AN17.events.length - 3000);
  ANALYTICS_ADAPTER.send([ev]); an17Save(); an17Emit();
}


function clearAnalytics17() { AN17.events = []; an17Save(); an17Emit(); }


function useAn17() { const [, f] = useState(0); useEffect(() => { const g = () => f(n => n + 1); AN17.l.add(g); return () => AN17.l.delete(g); }, []); return AN17; }


const an17Label = (el) => (el.getAttribute("aria-label") || el.innerText || el.getAttribute("title") || el.getAttribute("placeholder") || "").replace(/\s+/g, " ").trim().slice(0, 60);


const AN17_SEL = "button, a, [role=button], [role=tab], [role=switch], summary, select";


const AN17_SKIP = ".ff-adm";


function an17Session(signedIn) {
  if (AN17.started) return; AN17.started = true;
  const q = new URLSearchParams(location.search), ua = navigator.userAgent || "";
  const utm = {}; ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(k => { if (q.get(k)) utm[k] = q.get(k); });
  let tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) {}
  track17("session_start", { referrer: document.referrer || "", utm, lang: navigator.language || "", tz, screenW: screen.width, screenH: screen.height, winW: window.innerWidth, winH: window.innerHeight,
    device: /Mobi|Android|iPhone/i.test(ua) ? "phone" : /iPad|Tablet/i.test(ua) ? "tablet" : "desktop", browser: /Edg\//.test(ua) ? "Edge" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : /Firefox\//.test(ua) ? "Firefox" : "Other", signedIn: !!signedIn });
}


function an17Shown() {
  if (AN17.cur === "FF Admin") return;
  const seen = new Set();
  document.querySelectorAll(AN17_SEL).forEach(el => { if (seen.size >= 60 || el.closest(AN17_SKIP)) return; const r = el.getBoundingClientRect(); if (!r.width || r.bottom < 0 || r.top > window.innerHeight * 2) return; const l = an17Label(el); if (l) seen.add(l); });
  if (seen.size) track17("shown", { labels: [...seen] });
}


const an17Depth = () => { const h = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1); return Math.min(100, Math.round((window.scrollY / h) * 100)); };


function an17ViewEnd() { if (AN17.cur && AN17.since) track17("view_end", { ms: Date.now() - AN17.since, scroll: AN17.scroll }); AN17.since = 0; AN17.scroll = 0; }


/* Runs in the root render. Watches the screen and a few funnel signals; a few listeners for the whole page. */
function useAnalytics17(state) {
  const site = state.role === "team" ? "FF Team" : state.site === "party" ? "FF Party" : state.role === "staff" ? "FF Staff" : "FF Team";
  const screen = [site, state.viewingCompany ? "company page" : state.viewing ? "profile page" : (state.tab || "home"), typeof state.route === "string" && !/home|entry/i.test(state.route) ? state.route : ""].filter(Boolean).join(" / ");
  const prev = useRef({});
  useEffect(() => {
    an17Session(state.auth && state.auth.tag);
    if (screen === AN17.cur) return;
    an17ViewEnd(); AN17.cur = screen; AN17.since = Date.now(); track17("view", {});
    const t = setTimeout(an17Shown, 900); return () => clearTimeout(t);
  }, [screen]);
  useEffect(() => {
    const p = prev.current, signedIn = !!(state.auth && state.auth.tag), live = !!(state.profile && state.profile.live), n = (state.engagements || []).length, ev = (state.events || []).length;
    if (p.init) {
      if (signedIn && !p.signedIn) track17("sign_in", { site: state.site });
      if (live && !p.live) track17("profile_live", {});
      if (n > p.n) track17("booking_request", { count: n - p.n });
      if (ev > p.ev) track17("event_created", { site: state.site });
      if (state.site !== p.site) track17("site_switch", { to: state.site });
    }
    prev.current = { init: true, signedIn, live, n, ev, site: state.site };
  });
  useEffect(() => {
    const onClick = (e) => { const el = e.target.closest && e.target.closest(AN17_SEL); if (!el || el.closest(AN17_SKIP)) return; const label = an17Label(el); if (label) track17("click", { label }); };
    const FIELD = "input, textarea";
    const touched = new Map();
    const onFocus = (e) => { const el = e.target; if (!el.matches || !el.matches(FIELD) || el.closest(AN17_SKIP) || el.type === "password") return; const l = an17Label(el); if (l && !touched.has(el)) { touched.set(el, l); track17("field", { label: l, action: "start" }); } };
    const onBlur = (e) => { const el = e.target; if (!el.matches || !el.matches(FIELD) || !touched.has(el)) return; if (!String(el.value || "").trim()) track17("field", { label: touched.get(el), action: "empty" }); touched.delete(el); };
    const onScroll = () => { const d = an17Depth(); if (d > AN17.scroll) AN17.scroll = d; };
    const onHide = () => { if (document.visibilityState === "hidden") { an17ViewEnd(); } else if (AN17.cur) { AN17.since = Date.now(); } };
    document.addEventListener("click", onClick, true); document.addEventListener("focusin", onFocus); document.addEventListener("focusout", onBlur);
    window.addEventListener("scroll", onScroll, { passive: true }); document.addEventListener("visibilitychange", onHide); window.addEventListener("pagehide", an17ViewEnd);
    return () => { document.removeEventListener("click", onClick, true); document.removeEventListener("focusin", onFocus); document.removeEventListener("focusout", onBlur); window.removeEventListener("scroll", onScroll); document.removeEventListener("visibilitychange", onHide); window.removeEventListener("pagehide", an17ViewEnd); };
  }, []);
}
