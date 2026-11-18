# Venues in Phase 2: Google's business search, area pages and the map

Venues replace Experience on FF Team profiles (and sit in the same place on FF Staff company profiles). A member types the name of a bar, hotel or event venue, picks it from a dropdown that works like the location search, and FireFlair works out everything else: address, map point and which area pages it belongs to. Nobody is asked which town a venue is in. The prototype (v17.14) shows every screen described here.

## 1. What the member does

1. Profile → Venues → Add venue.
2. Type part of the name ("Savoy"). The dropdown lists matching businesses, name on the first line and address on the second, with "Add “Savoy” as a venue" at the bottom.
3. Pick one. The sheet shows the address and a View on Google Maps button. A description and images are optional, as on every other card.
4. Add venue.

Picking "Add “…” as a venue" saves the name only. That is for places Google doesn't know: private homes, marquees, pop-ups.

There is no role, no dates and no town to choose. The card's professions already say what someone does.

## 2. The search (same as the location search, one setting changed)

The live site already calls Google Places autocomplete from the browser (`src/api/places.ts`, `searchPlaces`) with `includedPrimaryTypes: ["(regions)"]`. Venues use the same call with the venue types instead:

```
includedPrimaryTypes: ["bar", "restaurant", "night_club", "hotel", "event_venue"]   // Autocomplete takes up to five
languageCode: "en-GB", regionCode: "gb"                                                 // no region restriction: members work abroad
```

Please test pubs, wine bars and cocktail bars against that filter. If any don't come back, drop the filter and accept any business.

When a suggestion is picked, one Place Details (New) call ends the session (same session token as the keystrokes) with this field mask:

```
id,displayName,formattedAddress,location,addressComponents,primaryType,types,googleMapsUri
```

The prototype's contract is `PLACES_ADAPTER` in `src/adapters/places-adapter.js` (autocomplete and details, with inputs and outputs). With no key it searches 31 sample venues in `src/content/data/venue-samples.json`, which are shaped exactly like a Place Details response. A key saved in the browser as `localStorage.ff_places_key` switches the prototype to the live Google calls. No key is in the code.

Google's rules: show Google attribution on a suggestion list that isn't on a Google map (the prototype writes "Powered by Google" in live mode; use Google's logo per their attribution guidelines), and store the place id permanently but refresh the other Google fields as Google's terms require. The area we work out (section 4) is FireFlair's own data and is kept.

## 3. What we store

One venue = one record in the existing venues section, the same records list as every other profile card:

```
{
  name, address, description, media,              // address = Google's formattedAddress
  place: { id, lat, lng, primaryType, types, mapsUri, source: "google",
           parts: { neighbourhood, sublocality, locality, postalTown, admin3, admin2, admin1, country, cc, postcode } },
  area:  { id, name, label, path, how: "name" | "nearest" | "country", from },   // our place in the area list
  review: true | false                                                           // FireFlair has to look at it
}
```

A venue typed by hand has `place: null, area: null, review: true`.

Back end: add a venue section to the card set-up script (`seedCards.js`) and run it again. The back end already saves whatever details the front end sends, so no other back-end code changes. Experience records already saved are left exactly as they are.

## 4. Placing a venue in the area list (automatic)

The area list is the same 1,068-place list the work-location tick list and the area pages use (`fd-rows.json`, see `docs/locations-phase2.md`). For a venue in the UK, the first rule that matches wins:

1. **A name match.** Try these names in order, most specific first: Google's neighbourhood and sublocality, then (from the postcode lookup we already run for "where are you based") the ward, parish and local authority, then Google's postal town and locality. The first one that is a place in our list wins. If two places share the name, the nearer one is used, and a match that is too far from the venue's point is ignored.
2. **The nearest place.** No name matched: the nearest neighbourhood, borough or town to the venue's point, within 50 km.
3. **The county.** Only if there is no point at all: Google's county names.

Abroad, the venue goes to its country page (by country code).

If nothing matches, `area` stays empty and `review` is true.

Examples from the sample venues: Claridge's → Mayfair; Satan's Whiskers → Bethnal Green; Diamond Club, Emirates Stadium → Holloway; The Grove → Watford; Twickenham Stadium → Richmond upon Thames with the postcode lookup (Hounslow by nearest point without it); Three Blue Ducks → Australia.

The postcode lookup runs server-side in production (postcodes.io or the ONS Postcode Directory), the same lookup as the base postcode. It now also returns `ward` and `parish` (`LOCATION_ADAPTER.lookupPostcode`).

The code is `venueAreaFor17` in `src/components/shared/venues17.jsx`. Run it again whenever the area list changes. `area.from` records the name or distance it was matched on.

## 5. Where venues appear

| Where | Which venues | How |
| --- | --- | --- |
| The member's profile | All of them, including typed ones | Landscape venue card: name, address, type · area, View on Google Maps (Google venues only) |
| Area pages (`/areas/...`) | Placed venues at or under that place | "Venues in <place>", after Available packages and before the FF Event Directory. Each card opens Google Maps; the names under it open the profiles of the people and companies who listed it |
| The Network map | Placed venues | The Venues layer: one pin per venue at its own point. People stay at area level |
| FF Admin → Venues to review | Typed venues, and Google venues with no area | Read-only list: venue, who added it, why it's there |

One venue added by several people is shown once, by Google place id, with everyone who listed it.

A parent page lists everything beneath it: The Savoy (Covent Garden) shows on Covent Garden, Camden, London, England and the UK pages.

The invented venues the map used to show are gone. The Venues layer now holds only venues members have added.

## 6. The review list

Anything with `review: true` waits for FireFlair: typed venues (not on Google) and Google venues that couldn't be placed. They stay on the member's profile and are left off area pages and the map until placed. How FireFlair works through the list (match it to a Google place, or pick the area by hand) is still to be decided. For now FF Admin only lists them, and in production this is a server-side query on `review: true`.

## 7. Experience

Nobody can add a new Experience card. Profiles that already have Experience entries (from a CV, or the six real members' work history) still show them, after Venues. Nothing is deleted or moved. Reading employers out of CVs into Venues instead of Experience is a later change to FF AI's instructions.

## 8. Where to look in the code

- `src/adapters/places-adapter.js`: the search contract, live calls and the sample search.
- `src/components/shared/venues17.jsx`: placing a venue (`venueAreaFor17`), the record patch (`venuePatch17`, `venueTypedPatch17`, `venueResolve17`), who has which venues (`venueEntries17`, `publicVenues17`, `venuesIn17`, `venueReviewList17`), the dropdown (`VenueSearch17`) and the area page section (`AreaVenues17`).
- `src/components/team/attribute-cards.jsx`: the Add venue sheet and the venue card (`VenueLandscapeCard`).
- `src/components/shared/map.jsx`: the Venues layer.
- `src/components/admin/admin-ui.jsx`: Venues to review (`AdmVenues17`).
