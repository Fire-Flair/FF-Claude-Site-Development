# Locations in Phase 2: where you are based, and the places you work

This is how locations work in FF Team and FF Staff, written for the developers. It sits on the Work Location record you already store, so there are no new collections, and nothing we have already collected has to be collected again. The prototype (v17.6.1) shows every screen described here.

## 1. How the live site stores locations today

- There is one "Work Location" section. Each location is a record with a title and `additional_data.lat` / `additional_data.lng`. The back end requires both numbers (`assertLocation` in `cardService.js`). The front end also keeps `placeId` and `address`.
- People find a place with a Google Places search limited to regions (cities, boroughs, neighbourhoods, postcodes). Each pick becomes a chip with a map point at the centre of the place. FF AI does the same through `ffai/geocode.js`, which turns a found place into a region centre.
- The home-page map is a locked picture, and there is no separate "where you are based".
- The weakness is reach. A chip only ever covers the one place it names, so coverage stops at a handful of places, and a pick as wide as "London" puts the point in the city centre.

## 2. The Phase 2 model: one base point and one list of places

| Thing | What it is | Who sees it |
| --- | --- | --- |
| Base | One map point: where the person or company is based | The public sees the town or city only, for example "London" or "Luton" |
| Work locations | The places ticked from one list. Each ticked place is one Work Location record | The public sees each ticked place as a chip |

There is nothing else to set. There is no distance setting and no ranking of places: a member's places are all equal, so nothing is called primary, secondary or extra.

### Base: private and public parts

The member types a postcode into one box, labelled "Postcode". We look it up and save at once, with no list of places to pick from. A line under the box says: "We put you on the map to find jobs close to you." (FF Team) or "We put you on the map so people nearby can find you." (a company).

What we save:

- Private: the postcode and its exact latitude and longitude. They are never shown, never plotted and never sent in a public card response.
- Public: a label at town or city level (any London postcode gives "London"), the id of that place, and the centre point of that place. The map plots this centre point and nothing else. If the place is not one we know, the public point is the postcode point rounded to about 1 km.
- `approx`: true when we do not have a postcode-accurate point (a typed place such as "London", or the offline estimate).

The base is used for the map pin and for nothing else. It does not decide who appears on an area page, and choosing or changing it never ticks or unticks a work location.

The prototype shape, which is the shape we suggest storing:

```
base17: {
  locId, label, lat, lng, approx,      // public: the place, its name and its centre point
  postcode: { code, lat, lng, approx } // private: left out of every public response
}
```

A person can type a place name instead of a postcode (our catalogue search stands in for your Google search). Picking a place saves that place's centre and marks the base `approx: true`. We do not block it, because people will type "London".

### Work locations: one tick list

On the FF Team profile ("Work locations") and the FF Staff company builder ("Areas covered") there is one closed drop-down, headed "Tick all the places you'd like to work". It shows the ticked places as a short summary. Opening it shows the list of places as a tree:

- United Kingdom, then England, Scotland and Wales, then regions, counties and towns. London has its own branch (London, then its boroughs, then neighbourhoods). Northern Ireland sits with Ireland, as the island, and not under the United Kingdom. Worldwide is the second top-level branch.
- Every row has its own tick box. Rows with places beneath them also have their own expand arrow, so ticking and expanding are separate. Every branch starts closed, and so does the drop-down.
- A search box at the top of the list finds a place by name and ticks it where it stands.

Ticking a place ticks everything beneath it: ticking England covers every place in England. The nearest ticked-or-excluded place above a place decides whether it is covered. Unticking one place under a ticked parent records an exception, and the parent shows as partly ticked. Ticking a partly ticked place clears the exceptions beneath it.

What we store:

- One Work Location record per ticked place, in the same list as before: `{ locId, name, lat, lng, ... }`. `locId` is the place id, `name` is the title, and `lat` / `lng` are the centre of the place. We create the record with both numbers when the place is ticked, and fill them in on older records that lack them.
- The exceptions are one list of place ids kept next to the records (`coverage17.exc` in the prototype).
- `coverage17.inc` mirrors the ticked place ids and is only a convenience; the records are the source of truth.
- A record whose place is not in our list (a place typed in v17.6, or a name a CV import produced) is kept. It shows as a ticked row at the end of the list, so nothing collected is lost, and it can be unticked there, which removes the record.
- A base is a different kind of record: if you keep it as a Work Location record (for example with `additional_data.is_base: true`), leave it out of the ticked places.

### What the public sees

The ticked places as chips, in the tree's order, with no labels. When a whole parent is ticked we show the parent only (England, not England plus its counties). The same reading is used by the Locations card on the profile, the "all attributes" sheet, the company page and the introduction text.

The profile card's location line shows the base town ("Based in London"). When there is no base, it shows the first ticked place in the tree's order.

### Who appears on an area page

A person or company appears on an area page when that place is covered by their ticks: at or under a ticked place, minus exceptions. Nothing else puts anyone on a page: the base point is not used. A parent page lists people who work anywhere beneath it. Matching is the existing Front Door matching:

```
{ whole: [ticked place ids], sub: [], exc: [exception ids] }
```

`whole` covers a place and everything beneath it; `exc` removes a place and everything beneath it. Northern Ireland sits under the United Kingdom on the area pages but under Ireland in the list, so the matching shape adds or removes it to agree with the list. The area pages and their addresses are unchanged.

## 3. How it fits the back end you already have

- Work locations: the Work Location records that exist today. Keep `place_id`, `lat` and `lng`. If you can, also save Google's place types and viewport in `additional_data`, so the size of a place is known.
- Base: one record marked as the base in `additional_data`. The postcode and its exact point live in a private part of `additional_data` and are removed from the public card response. The public part carries the label and the centre point.
- Exceptions: one list of place ids on the same section.
- For members already on the live site: their current chips are Work Location records, so they show as ticked once the place ids line up with our list; any that do not line up are kept and shown at the end of the list. Nobody is asked again.

## 4. The list of places

The list has 1,068 rows. 980 are the United Kingdom and everything beneath it: the United Kingdom itself, its four nations, 186 counties and other areas, 33 London boroughs, 695 towns and cities and 61 neighbourhoods. The other 88 are Worldwide, 7 continents and 80 countries. The list is four levels deep below the top.

It is generated, not typed: `npm run locations` reads the launch pages from the Front Doors kit and our additions in `data/front-doors/` and writes `src/content/data/fd-rows.json` (the rows) and `fd-aliases.json` (alternative names and old paths). The build checks for duplicate ids and paths, unknown parents, cycles and alias clashes, and fails on any of them. Row order is stable, so adding a place never moves an existing one. To add a place, edit `location_additions.json` and run it again.

Every place in the United Kingdom has a centre point. The United Kingdom itself takes the middle of its four nations. The 88 worldwide rows (Worldwide, the continents and the countries) have no centre point in our list, so a record made by ticking one carries `lat` and `lng` as null in the prototype. The live site should fill these in from the place id when the record is saved, because the back end requires both.

## 5. What changed from v17.6, and why nobody is asked again

v17.6 asked each member for a distance setting and for places added one by one as typed chips. v17.6.1 removes the distance setting and replaces the typed chips with the tick list. Nothing a member entered is lost:

- The chips added in v17.6 are the same records the tick list reads and writes (`locId`, `name`, `lat`, `lng`), so they simply show as ticked.
- A chip whose place is not in the list is kept and shown as a ticked row at the end of the list.
- On load, a saved distance setting is dropped. A "UK-wide" setting becomes a tick on the United Kingdom (`country:GB`), which covers England, Scotland, Wales and Northern Ireland, so nobody loses coverage. A numeric distance is simply dropped: no distance-based matching remains.
- The postcode, the private point and the public base are unchanged. Only the line under the postcode box changed, from "...as close to you as possible." to "...close to you."
- Records made before v17.6 (names only) get their place id and centre filled in once, on load, when the name matches a place in our list.

The prototype does this in `covMigrate17` (on load) and `covFill17` (whenever a tick changes the records), both in `src/components/shared/coverage17.jsx`.

## 6. Postcode lookup

The prototype asks `LOCATION_ADAPTER.lookupPostcode`. In production this runs on the server (postcodes.io or the ONS Postcode Directory) so the browser never talks to a third party. The lookup returns the point, the local authority and the region; the region "London" gives the London label. When the service cannot be reached the prototype uses an estimate from the outward code and flags it as approximate. A real failure is shown to the person ("We couldn't look that postcode up"), it is never hidden.

## 7. Where to look in the code

- `src/components/shared/coverage17.jsx`: the tick list (`CoverageTree17`), the rules (`covOf17`, `covOn17`, `covToggle17`, `covPartial17`), the ticked places in display order (`covPlaces17`), the records (`cov17Reducer`, `covNewRec17`, `covFill17`), the load step (`covMigrate17`) and the public chips (`AreasChips17`).
- `src/components/shared/base17.jsx`: the postcode box and the base point.
- `src/components/shared/find-directory.jsx`: the area pages and their matching.
- `src/adapters/location-adapter.js`: the postcode lookup.
