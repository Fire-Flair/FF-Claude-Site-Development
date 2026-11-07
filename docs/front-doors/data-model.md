# Front Doors data model, indexes and caching

Reuse the existing database. Do not add a second one for locations.

| Record | Purpose | Key fields |
|---|---|---|
| `location` | Stable place identity | `id` (e.g. `gn:2655858`), `name`, `aliases`, `kind`, `country_code`, `lat`, `lng`, `source_url`, `source_parent_id` (+provenance, review status), `browse_parent_id`, `related_location_ids`, `uk_fallback_scope`, source dates |
| `site_area_page` | One page per (site, location) | `site_key`, `location_id`, `path`, `title`, `h1`, `intro`, `faq`, `cta_label`, `market_mode`, `publication_state` (prepared/published/approved), `reviewed_by`, `reviewed_at`, `review_reason`, `review_checks`, `manual_copy_flags`, `updated_at` |
| `provider_coverage` | What a provider confirmed they serve | `provider_id`, `provider_kind` (person/company), `location_id`, `scope` (`whole`/`sub`), `public`, `eligible`, `updated_at` |
| `local_service_request` | Private lead + admin fulfilment | see below |
| `route_alias` | Explicit redirects | `site_key`, `from_path`, `to_location_id`, `permanent` |
| `market_mode` | Per country and site | `site_key`, `country_code`, `mode`, `sourcing_enabled` |

## local_service_request

`id`, `reference` (shown to the visitor), `idempotency_key`, `kind` (`sourcing_request` | `expansion_interest`), `site_key`, `location_id` (nullable), `location_text`, `profession_ids`, `event_date` (nullable), `date_undecided`, `time_zone`, contact `name/email/phone`, `whatsapp_permission`, `headcount`, `brief`, `company_id` (when the visitor asked about an unclaimed company card), `status` (`new`, `triaged`, `sourcing`, `options_found`, `contacted`, `converted`, `closed`, `unable_to_fill`), `assigned_admin`, `admin_note`, `source_site`, `source_path`, `campaign` (UTM etc.), `notification_state` (admin, acknowledgement, failures), `booking_id` (set when it moves into the booking flow), `created_at`, `updated_at`.

Access: the submitter's confirmation page and admins only. Contact fields never go into URLs, public HTML, logs or analytics.

The prototype stores these in `state.fd.requests` (persisted with the rest of the preview, key `fd`), pages in `state.fd.pages["<site>|<location id>"]`, markets in `state.fd.markets["<site>|<country>"]`, switches in `state.fd.sourcing`, decisions in `state.fd.log`.

## Indexes

- `site_area_page (site_key, location_id)` unique; `(site_key, path)` unique.
- `location (browse_parent_id)`, `location (country_code, kind)`, name search (trigram or prefix) for the explorer.
- `provider_coverage (location_id, public, eligible)` and `(provider_id)`; provider role, coverage and publication filters.
- `local_service_request (status, created_at)`, `(location_id)`, `(site_key)`, `(idempotency_key)` unique.

Precompute stable ancestor relations (a closure table or materialised path) so "everything beneath P" and "P's ancestors" are index lookups.

## Rendering and caching

- Render HTML on the server or prerender; cache HTML and listing queries; paginate.
- Invalidate only what changed: when a profile is published, unpublished, suspended, deleted, or its coverage/public facts change, invalidate the area pages whose results could include it (its coverage locations, their ancestors, and any parent pages that aggregate them). Do not rebuild all three sites after every edit. Do not calculate 3,000 pages from live whole-database scans per request.
- Cap fallback results, de-duplicate providers, and reuse cached queries.
- Store drafted copy once from approved data; regenerate only affected content when source facts change and policy permits; never overwrite manual edits silently. Normal page views need **zero** AI calls and **zero** external geocoding calls.
- Optional AI drafting (not used by the prototype): give structured facts only (site intent, brand facts, exact location identity, reviewed hierarchy, market mode, supported professions, verified public coverage facts, actual sourcing/signup process, approved terms, existing manual copy) and require structured output (title, H1, intro, answers, CTA label, supporting fact IDs, missing information, review flags). Never infer availability, demand, wages, local offices or coverage.

## Import rules

Importing the kit is repeatable and goes through a reviewable diff. It must preserve published IDs, slugs, approved copy and manual edits, and never overwrite approved production routes. GeoNames attribution (CC BY 4.0): "Contains information from GeoNames, available under the Creative Commons Attribution 4.0 International licence." Later boundary checks use ONS/OSNI or other official geography; OS Open Names enriches Great Britain but does not cover Northern Ireland. The proposed geography needs review before it decides who is eligible to work somewhere.
