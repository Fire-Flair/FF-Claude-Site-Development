/* src/adapters/location-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — LOCATION_ADAPTER (v17.4.6)
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs):
   async lookupPostcode(raw) -> { ok, display, lat, lng, names: [district, ward, parish, region, country], approx }
                              | { ok: false, reason: "format" | "not-found" | "unavailable" }
   The postcode is private: it is used to suggest and open branches of the location tree and is never
   shown on a profile, a card or an area page, and never sent with a public payload.
   Production: the same call server-side (postcodes.io or the Ordnance Survey / ONS Postcode Directory),
   so the browser never talks to a third party. Prototype: postcodes.io from the browser when the page
   is allowed to reach it, otherwise the offline outward-code table in work-locations.jsx (approx). */
const LOCATION_ADAPTER = {
  available: false,
  async lookupPostcode(raw) {
    const p = parsePostcode(raw);
    if (!p.ok) return { ok: false, reason: "format" };
    const url = p.partial ? `https://api.postcodes.io/outcodes/${encodeURIComponent(p.outward)}` : `https://api.postcodes.io/postcodes/${encodeURIComponent(p.display)}`;
    try {
      const ctl = typeof AbortController !== "undefined" ? new AbortController() : null;
      const t = setTimeout(() => ctl && ctl.abort(), 4000);
      const res = await fetch(url, ctl ? { signal: ctl.signal } : undefined);
      clearTimeout(t);
      if (res.ok) {
        const j = await res.json(), r = j && j.result;
        if (r) {
          const names = [].concat(r.admin_district || [], r.admin_ward || [], r.parish || [], r.admin_county || [], r.region || [], r.country || []).map(x => String(x).replace(/, unparished area$/i, ""));
          return { ok: true, display: p.display, lat: r.latitude, lng: r.longitude, names, approx: !!p.partial };
        }
      }
      if (res.status === 404) return LOCATION_ADAPTER.offline(p) || { ok: false, reason: "not-found" };
    } catch (e) { /* blocked or offline: fall back below */ }
    return LOCATION_ADAPTER.offline(p) || { ok: false, reason: "unavailable" };
  },
  /* Offline estimate from the outward code (prototype only). */
  offline(p) {
    const area = postcodeArea(p);
    if (!area) return null;
    const n = FD_NODES.find(x => x.uk && x.lat != null && x.name.toLowerCase() === String(area.t).toLowerCase());
    return { ok: true, display: p.display, lat: n ? n.lat : null, lng: n ? n.lng : null, names: [area.t, ...area.n], approx: true };
  },
};
