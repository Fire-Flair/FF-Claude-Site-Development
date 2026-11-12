/* src/utils/pay17.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   PAY AND DURATION (v17.4.6) — one calculation for every Shift Card.
   Money is whole pence, time is whole minutes. Nothing here invents an
   amount: when a shift carries no agreed pay, the result says so.

   payOf17(shift) -> {
     status   "ok" | "missing" (no agreed pay recorded) | "invalid" (times or
              amounts that can't be read)
     basis    "hourly" (agreed hourly rate x paid duration) | "fixed" (a fixed
              package total; the hourly figure is derived from it)
     hourlyP  pence per hour     totalP  pence for the shift
     mins     paid minutes       problem  why status isn't "ok"
   }
   Inputs, in order of authority:
     hourly   shift.rateP (pence) > shift.rate (pounds) > shift.pay "£22 an hour"
     fixed    shift.totalP (pence) > shift.total (pounds) > FF Party package pay (PAY17[svcId])
     duration shift.paidMins > shift.hoursM (hours, typed by the business) > the
              time span "19:00 — 23:00" (an end at or before the start runs past
              midnight) less shift.breakMins
   Rounding: totals and derived hourly rates round half up to the nearest penny.
   ========================================================================== */
const PAY17_HOURLY_RE = /£\s*(\d+(?:\.\d{1,2})?)\s*(?:an?\s*hour|an?\s*hr|per\s*hour|\/\s*h(?:ou)?r?|ph)\b/i;


function penceOf17(v) {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v).replace(/[£,\s]/g, ""));
  if (!isFinite(n) || n <= 0) return NaN;
  return Math.round(n * 100);
}


function clockMins17(t) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || "").trim());
  if (!m) return null;
  const h = +m[1], mi = +m[2];
  return h > 24 || mi > 59 || (h === 24 && mi > 0) ? null : h * 60 + mi;
}


/* Paid minutes for a shift, or { mins: null, problem }. */
function paidMins17(sh) {
  if (!sh) return { mins: null, problem: "No shift" };
  if (sh.paidMins != null && sh.paidMins !== "") {
    const m = Math.round(+sh.paidMins);
    return m > 0 ? { mins: m } : { mins: null, problem: "Paid duration is not a positive number" };
  }
  if (sh.hoursM != null && String(sh.hoursM).trim() !== "") {
    const h = parseFloat(String(sh.hoursM).replace(/[^\d.]/g, ""));
    return isFinite(h) && h > 0 ? { mins: Math.round(h * 60) } : { mins: null, problem: "Hours can't be read" };
  }
  const [a, b] = splitTime(sh.time || "");
  const s = clockMins17(a), e = clockMins17(b);
  if (s === null || e === null) return { mins: null, problem: sh.time ? `Shift times "${sh.time}" can't be read` : "No shift times" };
  let d = e - s; if (d <= 0) d += 1440;
  d -= Math.max(0, Math.round(+sh.breakMins || 0));
  return d > 0 ? { mins: d } : { mins: null, problem: "Break is longer than the shift" };
}


function payOf17(sh) {
  if (!sh) return { status: "invalid", problem: "No shift" };
  const dur = paidMins17(sh);
  let hourlyP = sh.rateP != null && sh.rateP !== "" ? Math.round(+sh.rateP) : penceOf17(sh.rate);
  if (hourlyP === null) { const m = PAY17_HOURLY_RE.exec(String(sh.pay || "")); if (m) hourlyP = penceOf17(m[1]); }
  let totalP = sh.totalP != null && sh.totalP !== "" ? Math.round(+sh.totalP) : penceOf17(sh.total);
  if (totalP === null && sh.svcId && typeof PAY17 !== "undefined" && PAY17[sh.svcId] != null) totalP = penceOf17(PAY17[sh.svcId]);
  if (Number.isNaN(hourlyP) || Number.isNaN(totalP)) return { status: "invalid", mins: dur.mins, problem: "Pay amount can't be read" };
  if (hourlyP !== null) {
    if (!dur.mins) return { status: "invalid", basis: "hourly", hourlyP, problem: dur.problem };
    return { status: "ok", basis: "hourly", hourlyP, totalP: Math.round(hourlyP * dur.mins / 60), mins: dur.mins };
  }
  if (totalP !== null) {
    if (!dur.mins) return { status: "invalid", basis: "fixed", totalP, problem: dur.problem };
    return { status: "ok", basis: "fixed", totalP, hourlyP: Math.round(totalP * 60 / dur.mins), mins: dur.mins };
  }
  return { status: "missing", mins: dur.mins, problem: "No agreed pay on this shift" };
}


/* £22, £22.50 */
const gbp17 = (p) => p == null || !isFinite(p) ? "" : `£${(p / 100).toFixed(p % 100 === 0 ? 0 : 2)}`;


/* 4 hrs, 4 hrs 30 min */
const minsText17 = (m) => { if (!m) return ""; const h = Math.floor(m / 60), r = m % 60; return `${h ? `${h} hr${h === 1 ? "" : "s"}` : ""}${h && r ? " " : ""}${r ? `${r} min` : ""}`; };
