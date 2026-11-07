# Backend work remaining, limitations and checks

## What the developers still need to build

1. Location tables and import (`data/front-doors/`), with child-on-demand APIs and name search.
2. `site_area_page` store with copy, review state and per-(site, place) approval; admin UI on real roles.
3. Provider coverage selection in the Profile Card (the person's own confirmed work areas, whole-area vs selected places) and the same for companies. The prototype's coverage is **fixture data**: `FD_PERSON_COV`/`FD_REGION` for the sample people and base locations for company cards.
4. `local_service_request`: persistence, idempotency, rate limits and spam controls, admin and acknowledgement notifications through existing channels, failure visibility, and the hand-off into the existing Event/Shift flow (`booking_id`).
5. Server-rendered or prerendered area pages with the metadata in behaviour.md; per-site sitemaps from approved pages; robots.txt review.
6. Cache and invalidation as in data-model.md.
7. Preserve the original requested place in the user's event: the prototype keeps it on the **request** but does not yet carry it into an Event created from a wider-area profile view.
8. Analytics (below) without contact data.
9. Recheck profile canonicals (see behaviour.md §8) and keep Stories/Introductions coherent.

## Known limitations of the prototype

- The 1,000-page manifest is embedded in the page. That is fine for a prototype; production must not ship the full catalogue (47,990 records).
- Geography is GeoNames points, flagged `needs_review`. Neighbourhood boundaries are not verified.
- The role list is a small mapping over the real profession taxonomy (`FD_ROLES`); align it with the real taxonomy IDs.
- Admin notifications, acknowledgements and the sitemap are simulated. The prototype can't prove server-rendered HTML; the metadata is set in the browser.
- Company bases are unconfirmed (some approximate); permissions for images on newer cards are still to be confirmed.
- No page is operational or approved by default; the demo pages are published for use (`noindex`).

## Analytics (no contact data)

Track by site and location ID: landing-page visits, meaningful profile views, sign-up completion (FF Team), sourcing enquiries submitted, completed paid bookings, sourcing outcomes (`converted`, `unable_to_fill`). Use Search Console for real indexing and queries. Page count is not a success measure. Report cost drivers from the real stack (hosting requests, database queries, storage, notifications, optional one-time drafting); don't quote a price without configuration and usage assumptions.

## Validation checklist

- A direct area URL renders useful HTML with a site-specific canonical and the right index state.
- Aliases redirect once; unknown places 404; no filter combination creates an indexable URL.
- UK, nations, London boroughs, City of London and neighbourhood navigation resolve without duplicate routes or cycles.
- Exact coverage is distinguished from broader discovery. Empty local results fall back with the right label and keep the original area. Nation/country limits, role filters and unpublished profiles are respected. A provider is never listed twice. Withdrawing a profile invalidates the relevant views.
- A lead survives refresh; retries create no duplicate lead or notification; failures show to admins; personal data stays private; no charge, invitation or confirmed booking results from a request.
- A real booking uses the existing booking engine.
- No `JobPosting` markup or vacancy counts on recruitment pages.
- Keyboard and mobile navigation work, the map stays independent and the main action stays prominent.
- The browser doesn't download the gazetteer; a normal page view makes no model or geocoder call.
- Re-running the import is repeatable and overwrites no approved route or copy.

## How the prototype was checked (7 November 2026)

Browser tests on mobile width across all three sites: Explore by area present and map unaffected; Berkhamsted (fallback to Hertfordshire), Birmingham (stops at England), Camden (exact), Greater London (parent), France (interest-only), unknown place (404 view), alias redirects; request validation, reference, duplicate guard (same reference returned, no second record); admin queue, status change, batch review with five checks and reason, sitemap preview listing only approved pages; no `JobPosting` anywhere.
