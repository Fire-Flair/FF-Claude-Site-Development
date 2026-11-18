/* src/adapters/places-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — PLACES_ADAPTER (v17.14): the business search behind the Venues section.
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs):
   async autocomplete(input, { sessionToken })
       -> { ok: true, live, suggestions: [{ placeId, main, secondary, types }] } | { ok: false, reason }
   async details(placeId, { sessionToken })
       -> { ok: true, live, place } | { ok: false, reason }
       place = { id, name, address, lat, lng, primaryType, types, mapsUri,
                 parts: { neighbourhood, sublocality, locality, postalTown, admin3, admin2, admin1, country, cc, postcode },
                 source: "google" | "sample" }
   Live: Places API (New), called from the browser exactly as the live site's location search (src/api/places.ts,
   searchPlaces) already is, with the type filter swapped from ["(regions)"] to the venue types below (Autocomplete
   takes up to five). One session token runs from the first keystroke to the Place Details call that ends it.
   Prototype: there is no key in the code. A key saved in this browser as localStorage "ff_places_key" switches the
   search to Google; without one, or when the request fails, the same dropdown searches the sample places in
   content/data/venue-samples.json (real venues, approximate points, prototype ids). */
const PLACES_VENUE_TYPES17 = ["bar", "restaurant", "night_club", "hotel", "event_venue"];


const PLACES_SAMPLES17 = __ff_json("content/data/venue-samples.json").places;


/* Google's addressComponents -> the few names FireFlair matches against its list of places. */
function placesParts17(comps) {
  const get = (t, short) => { const c = (comps || []).find(x => (x.types || []).includes(t)); return c ? String((short ? c.shortText : c.longText) || c.longText || "") : ""; };
  return {
    neighbourhood: get("neighborhood"), sublocality: get("sublocality_level_1") || get("sublocality"),
    locality: get("locality"), postalTown: get("postal_town"),
    admin3: get("administrative_area_level_3"), admin2: get("administrative_area_level_2"), admin1: get("administrative_area_level_1"),
    country: get("country"), cc: get("country", true).toUpperCase(), postcode: get("postal_code"),
  };
}


/* One Place Details (New) response -> the place shape above. */
function placesNorm17(p, source) {
  const loc = p.location || {};
  return {
    id: p.id, name: (p.displayName && p.displayName.text) || "", address: p.formattedAddress || "",
    lat: typeof loc.latitude === "number" ? loc.latitude : null, lng: typeof loc.longitude === "number" ? loc.longitude : null,
    primaryType: p.primaryType || "", types: p.types || [], mapsUri: p.googleMapsUri || "",
    parts: placesParts17(p.addressComponents), source,
  };
}


const PLACES_ADAPTER = {
  key() { try { return (typeof localStorage !== "undefined" && localStorage.getItem("ff_places_key")) || ""; } catch (e) { return ""; } },
  async autocomplete(input, opts = {}) {
    const q = String(input || "").trim();
    if (q.length < 2) return { ok: true, live: false, suggestions: [] };
    const key = PLACES_ADAPTER.key();
    if (key) {
      try {
        const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
          method: "POST", headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
          body: JSON.stringify({ input: q, includedPrimaryTypes: PLACES_VENUE_TYPES17, languageCode: "en-GB", regionCode: "gb", sessionToken: opts.sessionToken || undefined }),
        });
        if (res.ok) {
          const j = await res.json();
          const suggestions = (j.suggestions || []).map(s => s.placePrediction).filter(Boolean).map(p => ({
            placeId: p.placeId, types: p.types || [],
            main: (p.structuredFormat && p.structuredFormat.mainText && p.structuredFormat.mainText.text) || (p.text && p.text.text) || "",
            secondary: (p.structuredFormat && p.structuredFormat.secondaryText && p.structuredFormat.secondaryText.text) || "",
          }));
          return { ok: true, live: true, suggestions };
        }
      } catch (e) { /* blocked or offline: the sample search below */ }
    }
    return { ok: true, live: false, suggestions: PLACES_ADAPTER.sampleSearch(q) };
  },
  async details(placeId, opts = {}) {
    const sample = PLACES_SAMPLES17.find(p => p.id === placeId);
    if (sample) return { ok: true, live: false, place: placesNorm17(sample, "sample") };
    const key = PLACES_ADAPTER.key();
    if (!key) return { ok: false, reason: "not-connected" };
    try {
      const qs = new URLSearchParams({ languageCode: "en-GB", regionCode: "gb", ...(opts.sessionToken ? { sessionToken: opts.sessionToken } : {}) });
      const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?${qs}`, {
        headers: { "X-Goog-Api-Key": key, "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents,primaryType,types,googleMapsUri" },
      });
      if (res.ok) return { ok: true, live: true, place: placesNorm17(await res.json(), "google") };
      return { ok: false, reason: res.status === 404 ? "not-found" : "unavailable" };
    } catch (e) { return { ok: false, reason: "unavailable" }; }
  },
  /* The stand-in search: every word typed must start a word of the venue's name or address. */
  sampleSearch(q) {
    const words = (s) => String(s || "").toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9&+]+/).filter(Boolean);
    const want = words(q);
    if (!want.length) return [];
    return PLACES_SAMPLES17.map(p => {
      const name = words(p.displayName.text), all = [...name, ...words(p.formattedAddress)];
      if (!want.every(w => all.some(x => x.startsWith(w)))) return null;
      return [want.every(w => name.some(x => x.startsWith(w))) ? 0 : 1, p];
    }).filter(Boolean).sort((a, b) => a[0] - b[0] || a[1].displayName.text.localeCompare(b[1].displayName.text)).slice(0, 5)
      .map(([, p]) => ({ placeId: p.id, main: p.displayName.text, secondary: p.formattedAddress.replace(/, UK$/, ""), types: p.types }));
  },
};
