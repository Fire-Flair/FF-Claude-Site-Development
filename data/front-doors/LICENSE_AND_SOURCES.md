# Data attribution and sources

## GeoNames licence and attribution

**Contains information from GeoNames, available under the Creative Commons Attribution 4.0 International licence.**

- Source organisation: [GeoNames](https://www.geonames.org/).
- Licence: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- Source format and licence notice: [GeoNames export readme](https://download.geonames.org/export/dump/readme.txt).
- Download date for this kit: **7 November 2026**.
- `source_data/GB.zip`: [UK country extract](https://download.geonames.org/export/dump/GB.zip).
- `source_data/countryInfo.txt`: [country/territory information](https://download.geonames.org/export/dump/countryInfo.txt).

The two files in `source_data` are unmodified downloads. Files in `data` are adapted extracts. Adaptations select populated-place and administrative records, remove two obsolete country records (`AN`, `CS`), create navigation roots, choose a candidate launch set, simplify some display names, produce proposed slugs/routes, suggest routing aliases and add review metadata. Geographic source IDs and provenance are retained where applicable.

When publishing derived location information, keep reasonable attribution, a licence link and an indication that the data has been adapted. Do not suggest GeoNames endorses FireFlair. This document does not apply a new licence to the underlying GeoNames data or waive its attribution requirements.

### Download checksums

| File | SHA-256 |
|---|---|
| `GB.zip` | `729cc29540d283e8151d7a2e3de64dca2607e8f52cb1ebbbd92baa0738de4d50` |
| `countryInfo.txt` | `79f8f59ea01cbb40438bf1856dd6c2ff201f03f8fc72d0530b2646aaf603ef04` |

## Accuracy and geographic scope

The source is supplied as-is. Its points, populations, place names and administrative associations can be incomplete, duplicated or outdated. Inclusion here does not certify an official boundary, service area, current population or commercially important search term.

This kit excludes feature codes explicitly labelled abandoned, historical or destroyed populated places, but that does not independently verify that every retained record is current. It retains source alternate names for lookup, not automatic publication of every historic or multilingual alias.

The catalog's source administrative tree and the proposed page tree are different. Some district layers are deliberately omitted from the browsing route. The current seed uses the downloaded county/unitary-area layer; it is not a complete current ONS hierarchy. No official boundary polygons have been included.

The Europe navigation list follows the GeoNames continent assignment and includes territories as well as countries. The UK has a separate browsing shortcut without changing its geographic continent. Places classified elsewhere, including Türkiye, remain in the worldwide country catalog; an editorial Europe cross-link can be added later without creating a duplicate canonical country page.

## Sources consulted for future geography validation

- [ONS names, codes and lookups](https://www.ons.gov.uk/methodology/geography/geographicalproducts/namescodesandlookups/namesandcodeslistings) and [ONS Open Geography Portal](https://geoportal.statistics.gov.uk/).
- [Ordnance Survey OS Open Names](https://docs.os.uk/os-downloads/products/addresses-and-names-portfolio/os-open-names): potential Great Britain enrichment, not Northern Ireland coverage.
- [OSNI open place-name gazetteer](https://admin.opendatani.gov.uk/dataset/osni-open-data-gazetteer-place-names): a separate Northern Ireland source; review dataset date and positional suitability before use.
- [GLA London borough boundaries](https://data.london.gov.uk/dataset/london-boroughs-e55pw).
- [Camden neighbourhood planning](https://www.camden.gov.uk/about-neighbourhood-planning) and [Camden area profiles](https://jsna.camden.gov.uk/data/area-profiles/).

These datasets were researched but are **not** redistributed or merged into this seed. Review each dataset's own terms if later importing it; do not assume the GeoNames licence covers third-party additions.

## Search and content guidance consulted

- [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies).
- [Google faceted navigation](https://developers.google.com/crawling/docs/faceted-navigation).
- [Google site structure](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure).
- [Google URL structure](https://developers.google.com/search/docs/crawling-indexing/url-structure).
- [Google JobPosting requirements](https://developers.google.com/search/docs/appearance/structured-data/job-posting).
- [Google AI features and websites](https://developers.google.com/search/docs/appearance/ai-features).
- [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing).
- [OpenAI crawlers](https://developers.openai.com/api/docs/bots).

Links were checked during the research on 7 November 2026. The implementation prompt applies these sources to FireFlair's product; neither the sources nor this kit guarantee indexing, rankings, AI citations or policy approval of a future implementation.
