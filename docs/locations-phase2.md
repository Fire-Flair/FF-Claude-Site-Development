# Locations in Phase 2: where you are based, and the areas you cover

This is how we want locations to work in FF Team and FF Staff in Phase 2, written for the developers. It is built on the Work Location record you already store, so there are no new collections and nothing we collect now has to be collected again in Phase 3. The prototype (v17.6) shows every screen described here.

## 1. How the live site stores locations today

- There is one "Work Location" section. Each location is a record with a title and `additional_data.lat` / `additional_data.lng`. The back end requires both numbers (`assertLocation` in `cardService.js`). The front end also keeps `placeId` and `address`.
- People find a place with a Google Places search limited to regions (cities, boroughs, neighbourhoods, postcodes). Each pick becomes a chip with a map point at the centre of the place. FF AI does the same through `ffai/geocode.js`, which turns a found place into a region centre.
- There is no separate "where you are based" and no travel distance. The home-page map is a locked picture.
- The weakness is size. A pin needs a latitude and longitude, and a pick as wide as "London" puts the point in the city centre, which is poor for matching. A chip also only ever covers the one place it names, so coverage stops at a handful of chips.

## 2. The Phase 2 model: three things, one point and one number

| Thing | What it is | Who sees it |
| --- | --- | --- |
| Base | One map point: where the person or company is based | The public sees the town or city only, for example "London" or "Luton" |
| Travel distance | One number: 5, 10, 25, 50 or 100 miles, or UK-wide | The public sees "Within 25 miles of Luton" or "UK-wide" |
| Added places | Any number of places, each a Work Location record | The public sees each place as a chip |

Order on a public profile or company page: the travel distance first, then each added place. An owner with a base but no travel distance and no places shows no travel chip. An owner who has never opened the section has no travel distance at all (we assume nothing).

### Base: private and public parts

The member types a postcode into one box, labelled "Postcode". We look it up and save at once, with no list of places to pick from. A line under the box tells them why: "We put you on the map to find jobs as close to you as possible." (FF Team) or "We put you on the map so people nearby can find you." (a company).

What we save:

- Private: the postcode and its exact latitude and longitude. They are used only to measure distance. They are never shown, never plotted and never sent in a public card response.
- Public: a label at town or city level (any London postcode gives "London"), the id of that place, and the centre point of that place. The map plots this centre point and nothing else. If the place is not one we know, the public point is the postcode point rounded to about 1 km.
- `approx`: true when we do not have a postcode-accurate point, so you can tell a postcode base from a "London"-wide one.

The prototype shape, which is the shape we suggest storing:

```
base17: {
  locId, label, lat, lng, approx,      // public: the place, its name and its centre point
  postcode: { code, lat, lng, approx } // private: left out of every public response
}
travel17: 5 | 10 | 25 | 50 | 100 | "uk"
```

A person can type a place name instead of a postcode (our catalogue search stands in for your Google search). Picking a place saves that place's centre and marks the base `approx: true`. We do not block it, because people will type "London".

### Added places

Each added place is exactly the record you already store: title, `place_id`, `lat`, `lng`. We would like two more things saved with each one, taken from Google's response: the place types and the viewport. The viewport tells us how big a place is, which is what lets us tell "Camden" from "England" later without guessing. A person can add as many as they like, countries, regions, cities, boroughs and towns included, and remove any of them.

## 3. How it fits the back end you already have

- Base: a Work Location record marked as the base in `additional_data` (for example `additional_data.is_base: true`). The postcode and its exact point live in a private part of `additional_data` and are removed from the public card response. The public part of the record carries the label and the centre point.
- Added places: the Work Location records that exist today. Keep `place_id`, `lat` and `lng`, and also save Google's place types and viewport in `additional_data`.
- Travel distance: one number on the same card, stored next to the base.
- Matching is a distance check between two points. The database supports that directly (a geospatial index on the base point and a distance query). A person is covered at a place when any one of these is true:
  1. the place is at or under a place they added;
  2. the place lies within their travel distance of their base point (straight line);
  3. their travel is UK-wide and the place is in the UK.

  For distance we test places that are a point on the map (towns, neighbourhoods, boroughs, counties). A nation or country is never covered just because its middle happens to be close.
- Existing live members: their current chips stay as added places. They are asked for a postcode once, and from then on they have a base. Nobody is asked for a travel distance until they choose to set one.

## 4. The "London" question

A postcode gives an accurate point and still shows "London" publicly, so a bartender in Walthamstow and a bartender in Richmond both read "London" but are matched by their real positions. A typed "London" is accepted and stored as approximate, at the centre of London. Both are valid. The `approx` flag is how matching and the map know the difference.

## 5. The map

Every person and company with a base gets a pin from the centre of their public place, including someone who has only a base and no areas. The exact postcode point is never plotted. The prototype map follows this for both people and companies.

## 6. Postcode lookup

The prototype asks `LOCATION_ADAPTER.lookupPostcode`. In production this runs on the server (postcodes.io or the ONS Postcode Directory) so the browser never talks to a third party. The lookup returns the point, the local authority and the region; the region "London" gives the London label. When the service cannot be reached the prototype uses an estimate from the outward code and flags it as approximate. A real failure is shown to the person ("We couldn't look that postcode up"), it is never hidden.

## 7. Phase 3

The catalogue of about 1,000 places returns as area pages and as the tick tree. The area pages and their addresses already work in the prototype and stay as they are. Each catalogue place has a centre point, so everything collected in Phase 2 (the base point, the travel distance and the added places) decides who appears on each page, without asking anyone again. In the prototype the tick tree is still in the code behind one switch (`COV_TREE_PHASE3`, off in Phase 2).
