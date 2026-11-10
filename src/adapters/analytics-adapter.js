/* src/adapters/analytics-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — ANALYTICS_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   connected  (value)
   platform  (value)
   send(events)
   Nothing outside this file talks to a backend: the rest of the app calls ANALYTICS_ADAPTER only. */
/* ---- Analytics framework (v17.3.41) -------------------------------------------------------------------
   Tracking is on for every visitor from the moment they land. There is no cookie banner: the live site
   covers it in the terms and conditions and the privacy policy (to be written, Phase 2 or 3).

   The page records, for every visitor:
     session_start  once per visit: referrer, campaign tags (utm_*), language, time zone, screen and window size,
                    device type, browser, whether the visitor is signed in
     view           a screen opened (site / tab / route), and view_end with the time spent (ms) and how far down the
                    page they scrolled (%)
     shown          the buttons and links visible on that screen, once per view. Compared with clicks this gives
                    "seen but not clicked"
     click          the label of the button or link (aria-label, else its text, 60 chars)
     field          a form field was started or left empty: its label only, never what was typed. This shows which
                    questions people skip
     sign_in, profile_live, booking_request, event_created, site_switch   funnel steps, from the state
   Every event carries a session id, the time, the screen and the window width. Typed text is never recorded.

   Live site (Phase 2 framework, deeper analysis Phase 2.5 / 3):
     Platform: a product-analytics service does the heavy lifting (sessions, funnels, heatmaps, replays).
       Recommended: PostHog (EU cloud) or GA4. ANALYTICS_ADAPTER.send() is the only place the page talks to it.
     Core: POST /api/analytics/events  [{ type, at, sid, screen, label?, ms?, scroll?, w }].
       Core adds what the page can't know reliably: IP address, approximate location from the IP, user agent,
       and links the session to the account once the visitor signs in.
     Core: GET  /api/admin/analytics/summary?from=&to=   screens by visits, time and scroll depth, top clicks,
       seen-not-clicked, skipped fields, funnel (landed -> signed up -> profile live -> first booking), visitors by
       area, device and source.
     Legal: say what is tracked in the terms and conditions and a privacy policy before launch. Take legal advice
       on tracking linked to named people and on session replay, which may need consent. */
const ANALYTICS_ADAPTER = {
  connected: false,
  platform: "Not connected",
  send(events) { /* Live: posthog.capture(...) or fetch("/api/analytics/events", { method: "POST", body: JSON.stringify(events) }) */ },
};
