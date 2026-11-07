# Front Doors location data

Source: the FireFlair Front Doors Implementation Kit (prepared 7 November 2026). Location data
contains information from GeoNames, available under the Creative Commons Attribution 4.0 International
licence (see `LICENSE_AND_SOURCES.md`). GeoNames attribution must appear wherever this data is shown.

| File | What it is |
|---|---|
| `launch_pages.json` | The 1,000 prepared page candidates: stable IDs, names, kind, browse parent, slug, route, coordinates, UK fallback scope, review/publication/index state. |
| `route-manifest.compact.json` | The same 1,000 pages as compact rows. This is what the prototype embeds as `FD_ROWS`: `[location id, name, kind, parent row, slug, lat, lng, country, ukScope]`. Kinds: c country, n UK nation, a area, b London borough, p town/city, h neighbourhood, r hub, t continent. |
| `launch_locations.csv` | Flat export of the launch pages. |
| `countries_and_territories.json` | 250 countries/territories in the catalogue (not a claim that FireFlair operates in them). |
| `page_routing_aliases.json` | Routing only: gazetteer records that should redirect to a preferred page. Never use it to widen anyone's work coverage. |
| `validation_report.json`, `handoff_validation.json` | The kit's own checks. |
| `build_location_seed.py`, `source_data/` | Rebuilds the full seed offline from GeoNames. |
| `FireFlair_Front_Doors_Claude_Prompt.md` | The product brief this feature was built from. |

Not included: `locations.jsonl` (the 47,990-record catalogue, 26 MB). Rebuild it with
`python3 build_location_seed.py` (see `KIT_README.md`). It belongs in the database, never in the browser.

Importing must be repeatable and must never overwrite approved production routes, slugs or copy: import into a
reviewable diff, preserve published IDs and slugs.
