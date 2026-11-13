/* src/state/phase-config.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   FIREFLAIR PROTOTYPE v16.16 — FF Team Phase 1 UI (v1.7.1) with FF Staff and
   FF Party open and the booking flow live. FF VIP stays Coming 2027.
   Rebased from the FF Team Phase 1 prototype; set PHASE1.sitesOpen and
   PHASE1.bookingsLive to switch sites and bookings on or off.

   Built from the FireFlair prototype v16.15 and checked against Griffy's
   FF Team frontend + FireFlair backend (GitHub, dev branch, 16 Oct 2026).
   Phase 1 = FF Team as a professional profile and networking platform that
   gets professionals ready for bookings:
     1. Home and website sign-up
     2. Professional profile: create, edit, publish
     3. Profile and card discovery
     4. Networking: invitations, connections, reviews
     5. Register interest: availability, Service Cards, Training, Dream jobs
   Everything else stays in this file for later releases, but is shown as
   Coming Soon and can't start a booking, payment or anything consequential.
   ========================================================================== */
const PHASE1 = {
  name: "FireFlair prototype",
  version: "16.16",
  status: "In development",
  /* The top-left selector, in this order. FF Team, FF Staff and FF Party
     are open in this prototype (FF VIP opens with its launch party in early 2027). */
  sitesShown: ["team", "staff", "party", "partners", "vip"],
  sitesOpen: ["team", "staff", "party", "partners", "vip"],
  /* Profile sections in Phase 1, in this order. Qualifications above Skills;
     Venues straight after Experience; Work locations as its own section.
     Signature cocktails stay in BASE_CATEGORIES for a later release. */
  profileOrder: ["professions", "qualifications", "skills", "experience", "venues", "locations", "languages", "interests", "media", "reviews"],
  /* FF XP · 2027 runs on the prototype's own XP and tier logic. The only
     way in is the FF coin pop-up: no XP bar, no XP page. */
  xpLive: false,   /* v1.2: XP isn't live in version 1 — the pop-up says Coming 2027 */
  xpBar: false,
  /* Shift requests and booked shifts open with FF Staff and FF Party. The
     Bookings tab shows them as Coming 2027, beside what works now (availability,
     Service Cards, Training and Dream jobs registration). */
  bookingsLive: true,
  /* "Top performers" rankings are leaderboards: not in Phase 1. */
  leaderboards: false,
  /* The desktop "Add FF" button in the top bar is hidden for now. */
  desktopAdd: false,
};


const p1SiteOpen = (key) => PHASE1.sitesOpen.includes(key);


const p1SiteName = (key) => ({ team: "FF Team", staff: "FF Staff", party: "FF Party", partners: "FF Partners", vip: "FF VIP" })[key] || "That";


/* " · +10 XP" after a toast, only once XP is live. */
const xpNote = (n) => (PHASE1.xpLive && n ? ` · +${n} XP` : "");
