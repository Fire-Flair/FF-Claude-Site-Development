/* src/adapters/location-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — LOCATION_ADAPTER (v17.4.6)
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs):
   async lookupPostcode(raw) -> { ok, display, lat, lng, names: [district, ward, parish, region, country], approx,
                                 district, region, source: "service" | "offline-estimate" }
                              | { ok: false, reason: "format" | "not-found" | "unavailable" }
   v17.6: district is the local authority name and region is the English region (for example "London"); both are
   used to pick the public town or city. source "offline-estimate" means the request could not be made and the
   point is the centre of the outward-code area (approx is then always true): it is never presented as exact.
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
          const first = (v) => String([].concat(v || [])[0] || "").replace(/, unparished area$/i, "");
          return { ok: true, display: p.display, lat: r.latitude, lng: r.longitude, names, approx: !!p.partial, district: first(r.admin_district), region: first(r.region), source: "service" };
        }
      }
      if (res.status === 404) return LOCATION_ADAPTER.offline(p) || { ok: false, reason: "not-found" };
    } catch (e) { /* blocked or offline: fall back below */ }
    return LOCATION_ADAPTER.offline(p) || { ok: false, reason: "unavailable" };
  },
  /* Offline estimate from the outward code (prototype only). Centre points for the London areas, which are not
     places of their own in the catalogue; every other area uses the catalogue place of the same name. */
  OFFLINE_POINTS: { "Central London": [51.515, -0.11], "North London": [51.565, -0.12], "East London": [51.54, -0.02], "West London": [51.51, -0.25], "South London": [51.46, -0.1] },
  offline(p) {
    const area = postcodeArea(p);
    if (!area) return null;
    const n = FD_NODES.find(x => x.uk && x.lat != null && x.name.toLowerCase() === String(area.t).toLowerCase());
    const pt = n ? [n.lat, n.lng] : (LOCATION_ADAPTER.OFFLINE_POINTS[area.t] || [null, null]);
    return { ok: true, display: p.display, lat: pt[0], lng: pt[1], names: [area.t, ...area.n], approx: true, district: area.t, region: /London$/i.test(area.t) ? "London" : "", source: "offline-estimate" };
  },
};
