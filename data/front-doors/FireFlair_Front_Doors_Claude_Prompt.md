# FireFlair Front Doors — Claude implementation prompt

Prepared 7 November 2026. Use this prompt with the current FireFlair project and the accompanying `FireFlair_Front_Doors_Implementation_Kit.zip`. Extract the kit into the project workspace if your Claude environment supports files. The prompt is self-contained about product decisions; the kit supplies the actual location records and a reproducible importer.

**Deliverable:** one inexpensive, shared location system for three sites, with FF Party as the main consumer SEO destination. The seed contains 1,000 candidate location pages, supporting up to 3,000 site-specific routes. Prepared routes are not automatic publication or indexing approvals.

## Begin instructions for Claude

You are updating the existing FireFlair product. Implement its location-based **Front Doors** alongside existing Stories and **FireFlair Introductions**. Keep the existing brand, profile cards, booking flow and design system. This is an implementation task, not an invitation to redesign the entire platform.

Start by inspecting the current routes, rendering strategy, site configuration, profession taxonomy, work-location fields, public-profile data, forms, notifications and admin screens. Briefly identify the files you will change, then proceed with the reversible implementation. Reuse existing components and dependencies. Do not spend the context window printing the full location database or writing thousands of separate articles.

If the supplied project is only the HTML prototype, implement the demonstrable interface and reusable data contracts there, and provide a precise backend handover. Identify simulated persistence, notifications and booking transitions explicitly. Never report a working production feature when it is only a prototype. Do not invent access to the live backend or deploy to production as part of this prompt.

### 1. Three sites, three purposes

Use one shared engine with the following site configurations:

| Site | Primary visitor and search intent | Main action | Supporting action |
|---|---|---|---|
| FF Party, `ffparty.uk` | Private hosts looking for bartenders and supported event services in an area | Find/book a suitable professional through the existing flow | Ask FireFlair to find people for the event |
| FF Team, `ffteam.uk` | Professionals looking for freelance bar and hospitality work in an area | Create/publish a professional profile | View genuine opportunities, if that functionality and those opportunities exist |
| Existing business site, branded FF Business or FF Staff according to current approved configuration | Venues and businesses needing bar/hospitality staff | Start a staffing request or existing shift booking | Create a supplier/company profile where that service exists |

FF Business and FF Staff are alternative names for the business site, not two sites. Do not register domains, rename it or introduce a fourth site. Read its actual name and canonical domain from configuration.

FF Party is the priority for consumer acquisition. FF Team must answer the worker's question; the business site must answer the venue's question. Do not put the same hiring advert on all three domains. Reuse layout and factual records, but give each site its own useful content, actions, title and canonical URL.

FireFlair is bartender-first, based on the founding team's bar experience. Use only approved, supportable descriptions of that experience. Include waiters, hosts, DJs, photographers and other professions only where they are genuinely supported by the current product. Do not invent awards, verification, guaranteed work, supplier availability, lowest prices, coverage or response promises.

### 2. Use the supplied location database

Read `README.md`, `data/validation_report.json` and a few relevant records first. Process the larger files using code, not by loading every record into the model context.

The kit contains:

- **47,990 location/navigation records**, including **43,681 UK populated-place source records**, administrative records, continents and country/territory records.
- **250 countries and territories** in the underlying catalog. This is not a claim that 250 sovereign countries exist or that FireFlair operates in all of them.
- **1,000 prepared page candidates**: UK and international hubs, all four UK nations, the supplied county/unitary-area layer, London boroughs and selected settlements.
- **52 Europe navigation entries excluding the UK**, following the source's country/territory classification.
- All **32 London boroughs**, the **City of London**, and **20 selected Camden neighbourhood records**.
- GeoNames source IDs, original names, aliases, coordinates, administrative codes, source links, review flags and the source files required to rebuild the seed offline.

This is a practical starting catalog, not a boundary-verified gazetteer or an exhaustive list of useful SEO targets. The population field is used to order the initial candidates; it is not keyword volume, current population research or proof of commercial demand. Some source administrative associations can be outdated. Coordinates are representative points, not service-area polygons.

Keep stable IDs. Never match places solely by name. Keep distinct places with the same name distinct. Keep the raw source hierarchy separate from the editorial browsing hierarchy and the professional's actual work coverage.

Support these relationships separately:

- `source_parent_id`: the gazetteer association, with provenance and review status.
- `browse_parent_id`: the chosen parent for a concise directory and breadcrumb.
- `related_location_ids`: neighbouring or overlapping places, explicitly reviewed.
- `coverage_location_ids`: areas a provider has actually selected or confirmed they serve.

Do not infer one relationship from another. A Camden browsing parent does not establish the exact boundary of Fitzrovia, Highgate, Holborn, Kilburn, King's Cross or Covent Garden.

Use current ONS/OSNI or other appropriate official geography for any later boundary validation. OS Open Names can enrich Great Britain; it does not cover Northern Ireland. Record source dates and attribution. Import updates into a reviewable diff; preserve published IDs, slugs, approved copy and manual overrides. Do not overwrite the production catalog with a fresh population-ranked top 1,000 on every update.

### 3. Hierarchy, navigation and URLs

The public explorer begins with **UK** and **Worldwide**. Worldwide contains continents; start its detailed navigation with Europe. The UK is a convenient top-level shortcut, while its geographic record remains associated with Europe. Do not create duplicate UK URLs beneath both navigation paths.

Within the UK, use England, Scotland, Wales and Northern Ireland. Below these, use meaningful counties, council areas, boroughs and settlements as appropriate. The UK does not have one uniform administrative hierarchy, so do not force every city through an invented county layer.

Use one **London / Greater London** browsing hub. Put the 32 boroughs and City of London below it. Boroughs can have neighbourhood children. Avoid separate, largely overlapping London and Greater London landing pages. Preserve the distinct underlying geographic records; a page-routing alias does not widen anyone's work coverage.

Example routes from the supplied seed:

| Area | Relative route on each applicable site |
|---|---|
| UK | `/areas/uk` |
| Greater London | `/areas/uk/england/greater-london` |
| Camden | `/areas/uk/england/greater-london/camden` |
| Camden Town | `/areas/uk/england/greater-london/camden/camden-town` |
| Berkhamsted | `/areas/uk/england/hertfordshire/berkhamsted` |
| Birmingham | `/areas/uk/england/birmingham` |
| Northampton | `/areas/uk/england/west-northamptonshire/northampton` |
| Scotland | `/areas/uk/scotland` |
| France | `/areas/worldwide/europe/france` |

If existing published routes already serve these purposes, preserve them and adapt the manifest. Use explicit permanent redirects for genuine replacements, not duplicate indexed URLs. Do not change stable profile URLs to include a location; professionals may work in several places or move.

Place keywords in readable titles, headings and copy. A complete keyword phrase does not need to be repeated in every URL segment. Use one geographic landing route per site and area initially. Profession, date, sort and availability filters must not multiply this into every possible indexed combination. Curated role-and-area pages can be considered later when they address a distinct, supported need.

Berkhamsted, Hemel Hempstead and St Albans remain separate records. They can be related nearby destinations; they are not interchangeable aliases. Do not create invented alternate place names to chase variations in search results.

### 4. Keep the on-site interface small

On the existing Network/People page, add a compact **Explore by area** section. Keep the map feature separate and preserve the main booking/profile actions. Do not put a huge directory above them or open a map just because someone selects a place.

Use accessible nested disclosure controls or the existing suitable component: UK → country → county/area → town or borough → neighbourhood. Fetch children as needed. Offer place-name search that returns distinct, disambiguated locations. The entire 47,990-record catalog must not be shipped to the browser as a default JavaScript bundle.

Selecting a published area opens its standalone page. Use ordinary crawlable links for parent, child and breadcrumb navigation; a JavaScript-only dropdown is not the sole discovery path. Render a small relevant set of links on each page, with a usable way to expand larger lists. Prepared, unpublished nodes should not lead to dead links. A broader request form can accept a known place even before that place has a public landing page.

Each landing page should put its purpose, location and principal action near the top. Suggested order:

1. Breadcrumb, clear H1, short factual introduction and primary CTA.
2. Relevant local professionals/services, genuine opportunities, or the signup/request action appropriate to the site.
3. Wider-area results if appropriate, with accurate labels.
4. A brief explanation of how the relevant service works and a few useful questions/answers.
5. Child/nearby area links and a small number of relevant Stories.

Use the existing visual language. Do not label public content “SEO content”, “AI optimisation” or “Front Door #142”. Front Doors is the internal name for this acquisition system.

### 5. Match coverage honestly and make parent fallback useful

Return only public, published, eligible profiles and live supported professions. Respect privacy, suspension, deletion and user-selected work locations. Do not use a private home address, CV employment history or an AI-suggested nearby town as confirmed service coverage.

Model explicit whole-area coverage separately from selected subareas. Someone explicitly offering service throughout Greater London can be eligible for a Camden request. Someone selecting only Camden is not automatically eligible throughout London. A broad parent directory can aggregate providers serving its children without making every child interchangeable.

For a selected area:

1. Show providers whose confirmed work coverage includes that requested area. State that the event date still needs confirmation unless the booking engine actually knows availability.
2. If none qualify, move up the **reviewed browsing tree**, fetch a bounded set of relevant profiles and clearly label the wider scope: for example, “Explore professionals across Hertfordshire”.
3. Show each person's actual stated coverage. Explain that service in the original area needs checking. Preserve the original requested area in the user's event/request.
4. If the next parent has no appropriate results, continue only within the configured market boundary. For UK local pages, stop at the relevant UK nation by default. Never fill a Berkhamsted page with a Europe-wide or worldwide roster.
5. If no useful results remain, show the assisted sourcing request and useful recruitment/supplier actions instead.

Cap fallback results, deduplicate providers and reuse cached queries. Parent fallback is not a distance calculation. Call results “nearby” or “closest” only if a real distance ranking supports that wording; straight-line point distance is not travel time or willingness to travel. Do not add a paid travel-time API for this feature.

A wider-area preview must not bypass the booking engine's eligibility rules or automatically invite people outside their confirmed coverage. The same parent roster reused on many pages is also not, by itself, distinctive local editorial content.

### 6. Add “Ask us to find people” as a real lead workflow

Make this prominent on FF Party and available to the business site. This is a practical way for FireFlair to recruit/source manually where supply is missing.

Suggested public copy, enabled only where the team actually accepts sourcing requests:

> **Need people for an event in Berkhamsted?**
> Tell us the date and the kind of professional you need. Our team will look for suitable people and contact you about the options.
>
> **Ask us to find people**

The place name is dynamic. Do not promise a confirmed professional, a fixed response time, a local office or a successful search before those promises are supported operationally.

Minimum form fields:

- Event location, prefilled from the page and editable. Request a postcode or venue only when needed to resolve ambiguity.
- Event date; include a “Date not decided” option if the existing lead process supports exploratory enquiries.
- Profession needed, from the real role taxonomy.
- At least one contact method: email or telephone. Explain how the team will respond; record WhatsApp permission separately when used.

Keep name, headcount, approximate hours, event type, brief and budget optional unless the existing workflow requires one to make the request useful. Do not require account creation, a full Event Card or payment at this stage. Validate dates in the event's local time zone. Do not put submitted contact information in URLs, public HTML or analytics events.

Create a durable `local_service_request` using existing infrastructure. Minimum fields: ID, site key, requested location ID and supplied location text, profession IDs, event date/time zone, contact details, contact permissions, optional brief, creation time, status, assigned admin, source URL/campaign data, notification state and eventual booking ID. Restrict access to the appropriate user/admin roles.

Suggested statuses: `new`, `triaged`, `sourcing`, `options_found`, `contacted`, `converted`, `closed`, `unable_to_fill`. Keep statuses simple enough for the existing admin interface. Provide an admin queue filterable by place, date, profession and status. No separate scout application is needed.

On successful creation:

- Save first, return a request reference and show a clear success state.
- Notify the responsible admin using an existing supported channel. Deduplicate retries using the request ID and notification type.
- Send an acknowledgement only through the user's permitted channel and existing notification infrastructure. Record delivery failures; they must not lose the saved request.
- Use existing server-side validation, rate limits and spam controls. Handle duplicate submission without creating duplicate leads or notifications.

The success screen must say that the request is received and staffing is not yet confirmed. Do not charge, create invitations, reserve staff or show a confirmed booking. When options are agreed, prefill the existing Event/Shift flow and collect its required details, payment and terms before its normal invitations begin. Preserve the current booking rules, prices, selection windows and refund logic; this feature does not replace them.

Do not describe a national “scout team” unless it exists. The honest service is that the FireFlair team will actively look for suitable people. Where requests cannot currently be serviced, offer an accurately labelled expansion-interest registration, not the sourcing promise above.

### 7. Write useful content for each intent

Use concise paragraphs that explain who the service is for, what is actually offered in the area, what the visitor can do now and what happens next. Roughly 80–160 introductory words may be sufficient; there is no required word count. Add information because it helps the visitor, not to fill an SEO template.

Use this as an intent guide, not as permission to publish unsupported claims:

| Area example | FF Party | FF Team | Business site |
|---|---|---|---|
| Birmingham | “Hire bartenders for parties in Birmingham” when the service is offered; otherwise an honest sourcing/interest title | “Freelance bar work in Birmingham — join FF Team” | “Bar and hospitality staffing in Birmingham” when operational |
| Berkhamsted with no matching profiles | Explain the real local sourcing option; label Hertfordshire previews accurately | Invite professionals who work here to publish profiles; explain how booking requests work | Accept a venue staffing enquiry if the team can handle it |
| Camden | Explain the supported private-event service, show genuinely covering profiles and useful neighbourhood links | Explain registration and relevant real opportunities | Explain venue staffing, relevant professions and the actual request process |

FF Team pages must distinguish joining the network from applying to a current job. Never imply that selecting a city creates vacancies, income, guaranteed hours or guaranteed bookings. Do not apply `JobPosting` markup to recruitment marketing or profile-signup pages. Genuine current vacancies, if implemented, need their own accurate job pages and expiry handling.

Use approved facts from the platform: professions, explicit coverage, service types, actual public profiles, operational sourcing availability, current terms, existing local work examples, and practical questions the team can answer. Do not invent local testimonials, venues served, demand figures or provider counts. Do not pad pages with tourist facts unrelated to booking or working.

For FF Party, describe matching the host's requirements where the product supports it. Do not claim to be an independent whole-market comparison service, to compare all bar companies, or to find the cheapest supplier unless that is actually how the product works.

### 8. Separate readiness, publication and indexing

Create all 1,000 candidate records now. Apply publication and indexing decisions independently for each `(site, location)` pair; FF Party readiness does not imply FF Team or the business site is ready.

Use three operational states:

| State | Public behaviour | Sitemap/index behaviour |
|---|---|---|
| Prepared | Admin preview; no advertised public landing route | Excluded from sitemap |
| Published for use | Useful working page, potentially still awaiting editorial/search review | `noindex`; excluded from sitemap; crawlable when public |
| Approved for search | Reviewed, useful page with working action and accurate scope | Self-canonical, indexable and included in its site's sitemap |

“Approved for search” is our internal editorial decision, not a promise that Google will index or rank the page.

Before approving a page, record a reviewer, date and short reason covering: accurate geography, actual service/recruitment capability, a functioning user task, reliable visible facts, and why this page is useful separately from its parent and sibling pages. If it offers no additional usefulness, consolidate it into a parent or keep it out of search. Allow admins to review batches with per-page evidence and exceptions, so approval does not require opening 1,000 separate forms.

An empty profile list alone does **not** make a page unsuitable. A genuinely operated local sourcing service can be useful before profiles exist. However, swapping town names in the same advert, adding a generic form, or changing AI-written wording is not sufficient justification for thousands of indexed pages. This is a product quality decision, not a fixed minimum-profile rule.

Start review with FF Party priority markets: London, selected genuinely relevant boroughs, Hertfordshire, Berkhamsted, Hemel Hempstead and St Albans, plus other areas the team can actually serve. Review Birmingham and other recruitment targets according to real operations. This list is a launch recommendation, not evidence that any area is already served.

Keep international records ready while setting per-country/per-site market modes such as `inactive`, `interest_only`, `recruiting` and `operational`. Do not reuse UK charges, currencies, terms or fulfilment promises internationally without approved configuration.

Do not flip indexing every time a provider becomes temporarily unavailable. Retain a useful service page where the service continues. Reassess a page when its underlying offer ends. A public `noindex` page is not private; keep previews and personal records properly access-controlled.

### 9. Technical SEO and AI-readable information

Return meaningful HTML on a direct URL visit: title, H1, text, links, applicable public listings, canonical and robots directives. Use the project's existing static generation, prerendering or server-rendering capability. Do not depend on opening a popup, logging in, using the map or running an AI request to read the page.

Each genuinely different site-intent page is self-canonical. Do not cross-canonical all area pages to FF Party: doing so would undermine the distinct worker and venue pages. Where the content really is duplicated, consolidate it instead of manufacturing cosmetic differences.

Use stable lowercase, hyphenated routes; consistent trailing-slash rules; real 404s for unknown places; explicit redirects for valid aliases; and meaningful modification dates. Include only canonical, indexable, successful pages in sitemaps. Do not create unlimited routes from arbitrary text or filter parameters. Define crawl handling for filter combinations deliberately; do not block a URL in robots.txt while expecting a crawler to read that same URL's `noindex` directive.

Use breadcrumb links and suitable visible-content-aligned structured data. `CollectionPage`/`ItemList` can describe a real directory; `Service` can describe an actual offered service. Do not fabricate LocalBusiness offices, ratings, prices, opening hours or job vacancies. Structured data is not a substitute for the page's visible content and does not guarantee a rich result.

Present short direct answers to genuine questions such as “Can I request a bartender in Berkhamsted if nobody is listed?” and “Does joining FF Team guarantee work?” Keep the answers factual, readable and consistent with the application. Stable URLs, understandable entities and accurate text help search systems identify what is offered; they do not guarantee a ChatGPT recommendation.

Audit access for legitimate search crawlers, including OAI-SearchBot where discovery through ChatGPT is desired. Keep search-crawler decisions separate from training-crawler decisions. Calling the OpenAI API to generate text does not submit the site to ChatGPT or make that text a cited source. No special AI text file or invented AI schema is required for this feature.

### 10. Integrate the other Front Doors

Stories retain full, standalone `/stories/<slug>` pages and the convenient in-app reading/modal experience where implemented. The URL, canonical and content must remain coherent between the two views. Preserve booking state when a visitor reads a Story and returns.

FireFlair Introductions remain on the individual public profile's Overview, beneath Skills/Attributes. They are generated from that person's public, confirmed profile facts when publishing, stored, editable and protected from overwriting manual edits. Do not move them into separate stories or create one duplicate introduction per town. Link area pages to the existing profile URL.

Invalidate affected listings and cached profile text when a profile is unpublished or its public facts/coverage change. Do not keep exposing deleted content through area-page caches.

A previous audit reported that the working `ffteam.uk/ALEX424` profile canonical pointed to a then-unavailable `ffparty.uk/ALEX424` page. Recheck the actual current behaviour. Correct any canonical pointing to a non-equivalent or unavailable page before expanding profile discovery. Do not blindly apply an old finding if the live implementation has since changed.

### 11. Keep costs and maintenance low

Use one location catalog, one reusable area-page template with three intent configurations, and stored page records. This does not require 3,000 React components, separate websites per town, a vector database, a new CMS or an LLM call for each visitor.

Recommended storage responsibilities:

| Record | Purpose |
|---|---|
| Location | Stable ID, source, names/aliases, type, point, reviewed relations |
| Site-area page | Site key, location ID, route, title, copy, market mode, review/index state |
| Provider coverage | Provider ID, confirmed location/whole-area semantics, public/eligibility state |
| Local service request | Private lead and admin fulfilment record |
| Redirect/alias | Explicit legacy or alternate route to its preferred page |

Add appropriate uniqueness and lookup indexes, such as `(site_key, location_id)`, `(site_key, path)` and provider role/coverage/publication indexes. Reuse the existing database; do not introduce a second one merely for locations.

Precompute stable ancestor relations and bounded result lists where useful. Cache HTML and listing queries, paginate, and invalidate only affected profile/area pages. Do not rebuild all three sites after every profile edit. Do not calculate all 3,000 pages from live whole-database scans on every request. Keep source data and population figures out of ordinary public API payloads unless needed.

Draft page text once from approved data, store it, and preserve manual changes. Regenerate only affected content when source facts change and policy permits it. Implement deterministic metadata fallbacks and avoid blocking publication on an unnecessary model call. Do not generate all 3,000 bespoke paragraphs just to fill the database.

For any optional AI drafting job, supply structured facts and require structured output:

```text
Input: site intent, approved brand facts, exact location identity,
reviewed hierarchy, operational market mode, supported professions,
verified public coverage facts, actual sourcing/signup process,
current approved terms, existing manually edited copy.

Output: proposed title, H1, short introduction, useful factual answers,
CTA label, supporting fact IDs, missing information and review flags.

Rules: use only supplied facts; never infer availability, demand, wages,
local offices or coverage. Do not describe previews from a wider area as
local providers. If the proposed claim lacks evidence, omit it and flag
the gap. Existing manual copy must not be silently overwritten.
```

Report operating cost drivers from the actual stack: hosting requests, database queries, storage, notifications and optional one-time drafting. Do not invent a monthly price without configuration and usage assumptions. Normal page views must require zero AI calls and zero external geocoding calls.

### 12. Deliver and verify

Implement the shared data adapter, area routes/template, compact explorer, coverage/fallback behaviour, local request workflow, admin handling, review/index controls, metadata and sitemap integration supported by the supplied project.

Use a small set of representative pages to demonstrate all three intents: Berkhamsted, Birmingham and Camden, plus a parent hub and an international interest-only example. Do not mark examples as operational or indexable just to make the demo look populated. Use clearly identified fixtures when production data is absent.

Validate the important behaviours:

- A direct area URL renders useful HTML, a correct site-specific canonical and appropriate index state.
- Aliases redirect once; unknown locations return 404; no filter combination produces an uncontrolled new indexed page.
- UK, its four nations, London boroughs, City of London and neighbourhood navigation resolve without duplicate routes or cycles.
- Exact coverage is distinguished from broader discovery. Empty local results fall back with the correct wider-area label and preserve the event's original area. Country/nation boundaries, role filters and private/unpublished profiles are respected.
- The same provider is not duplicated, and withdrawing a profile invalidates relevant cached views.
- A lead survives refresh; retries do not duplicate it or admin notifications; failures are visible to admins; personal data remains private. Submitting it creates no charge, invitation or confirmed booking.
- A real booking uses the existing booking engine rather than a new shortcut.
- Recruitment marketing emits no fake job schema or vacancy counts.
- Keyboard/mobile navigation works, the map stays independent, and the main CTA remains prominent.
- The browser does not download the complete gazetteer; a normal page view makes no model/geocoder call.
- Importing the kit is repeatable and does not overwrite approved production routes or copy.

Track landing-page visits, meaningful profile views, signup completion, sourcing enquiries, completed paid bookings and sourcing outcomes by site/area. Exclude contact data from analytics. Use Search Console to observe actual indexing and search queries; page count alone is not a success measure.

Finish with a concise account of changes, validation, files touched, genuine limitations and any backend work remaining. Keep output proportional: show representative content and a route summary, not all 3,000 pages. List only decisions that genuinely block further work.

## End instructions for Claude

## Research basis and source notes

The architecture above is a FireFlair implementation recommendation, not a claim of Google approval. Research checked 7 November 2026:

1. [Google spam policies](https://developers.google.com/search/docs/essentials/spam-policies): regional doorway pages and scaled content with little added value are risks. This informs the per-page usefulness review and distinct site intents.
2. [Google site structure guidance](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure): use links and a navigable hierarchy; URL depth alone does not establish importance.
3. [Google faceted navigation guidance](https://developers.google.com/crawling/docs/faceted-navigation): control unnecessary URL combinations and their crawl costs.
4. [Google job posting requirements](https://developers.google.com/search/docs/appearance/structured-data/job-posting): job markup is for genuine job postings, not recruitment adverts masquerading as vacancies.
5. [Google AI features guidance](https://developers.google.com/search/docs/appearance/ai-features): ordinary search eligibility and useful accessible content remain relevant; no special AI markup is required and inclusion is not guaranteed.
6. [Google noindex guidance](https://developers.google.com/search/docs/crawling-indexing/block-indexing) and [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): align crawl access, index instructions and canonical URLs.
7. [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): distinguish search crawling from training crawling.
8. [GeoNames download documentation](https://download.geonames.org/export/dump/readme.txt), [UK source](https://download.geonames.org/export/dump/GB.zip) and [country source](https://download.geonames.org/export/dump/countryInfo.txt): actual downloaded source data behind this kit, licensed CC BY 4.0. Source accuracy and currency require review.
9. [ONS names, codes and lookups](https://www.ons.gov.uk/methodology/geography/geographicalproducts/namescodesandlookups/namesandcodeslistings), [OS Open Names](https://docs.os.uk/os-downloads/products/addresses-and-names-portfolio/os-open-names), [OSNI place names](https://admin.opendatani.gov.uk/dataset/osni-open-data-gazetteer-place-names), [London borough boundaries](https://data.london.gov.uk/dataset/london-boroughs-e55pw) and [Camden neighbourhood planning](https://www.camden.gov.uk/about-neighbourhood-planning): sources for reviewing geography and future enrichment. These boundary datasets have not been merged into this initial seed.

Location data attribution: **Contains information from GeoNames, available under the Creative Commons Attribution 4.0 International licence.** FireFlair-specific transformations select records, create navigation/route candidates and add review metadata. See the kit's `LICENSE_AND_SOURCES.md` for provenance, changes and source checksums.
