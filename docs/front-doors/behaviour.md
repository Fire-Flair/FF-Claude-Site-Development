# How Front Doors must behave in the final version

## 1. Places and URLs

- One catalogue of stable location IDs (GeoNames IDs with a prefix, e.g. `gn:2655858`). Never match places by name alone.
  Distinct places with the same name stay distinct. Berkhamsted, Hemel Hempstead and St Albans are separate records.
- Four relationships, kept separate and never inferred from each other:
  - `source_parent_id`: the gazetteer association, with provenance and review status.
  - `browse_parent_id`: the editorial parent used for the directory, breadcrumbs and fallback.
  - `related_location_ids`: reviewed neighbours.
  - `coverage_location_ids`: places a provider has actually selected.
- Route: `/areas/<path>`, lowercase, hyphenated, no trailing slash, e.g. `/areas/uk/england/hertfordshire/berkhamsted`.
  Path = parent path + slug. One landing route per site and place. The UK is a top-level shortcut (no duplicate UK URLs under Europe).
- Greater London is one browsing hub with the City of London and 32 boroughs beneath it; boroughs can have neighbourhoods.
  No separate London and Greater London pages. `/areas/uk/england/london` redirects (once, permanent) to Greater London.
- Profession, date, sort and availability filters are **not** URLs. They must not multiply indexed pages. Role-and-area pages can be considered later, only for a distinct supported need.
- Unknown places return a real 404. Valid aliases redirect once. Stable profile URLs never contain a location.

## 2. Explore by area (on-site)

- A compact section on the existing Network/People page of all three sites, above the map, separate from it. Choosing a place never opens the map.
- Nested disclosure controls (UK, nation, county/area, town or borough, neighbourhood). Children are fetched when opened. Places with a live page come first.
- Place-name search returns distinct, disambiguated places ("Newport · Wales").
- A place with a page is a normal crawlable link. A place with no page is **not** a link: it offers "Ask us to find people" (a broad request form that accepts a known place before it has a page).
- A JavaScript-only dropdown must not be the only way to discover pages: pages also link to parents, children, siblings and breadcrumbs.

## 3. Coverage and fallback

Provider coverage has two meanings:

- **whole**: serves everywhere beneath that place. Greater London covers Camden.
- **sub**: serves exactly that place. Camden does not cover Fitzrovia, Highgate or Kilburn.

Only confirmed, public, published, eligible providers on live supported professions count. Never use a private home address, CV history, or an AI-suggested nearby town. Respect suspension, deletion and the person's own selected work areas.

For a place P:

1. **Exact**: providers whose coverage includes P. State that the event date still needs confirming unless the booking engine really knows availability.
2. **Within** (parent pages only): providers serving places beneath P, labelled "Serving places within P". It is an overview; places are not interchangeable.
3. **Wider** (only if 1 and 2 are empty): climb the *browse* tree one parent at a time; the first parent with anyone is shown, labelled "Explore professionals across <parent>". Each person's actual coverage is shown, with a note that service in P needs checking. The visitor's original place stays on their request.
4. **Boundary**: UK places stop at the UK nation (never a Europe-wide or worldwide roster); other countries stop at the country.
5. Nothing left: show the sourcing request (or register-interest form) and the recruitment/supplier actions.

Cap results, de-duplicate providers, cache queries. This is **not** a distance ranking: do not say "nearby" or "closest" unless a real distance ranking exists. No travel-time API. A wider-area preview must never bypass the booking engine's eligibility rules or automatically invite anyone outside their confirmed coverage.

## 4. Site intents and copy

One template, three configurations (see `fdCopy` in the source). Copy is stored per (site, place) and manual edits are preserved; the prototype generates deterministic text so publication never waits on a model call.

- **FF Party**: with sourcing on: "Hire a bartender for your party in X" (if people are listed) or "Find a bartender for your party in X". Interest-only: "Bartender hire in X: register interest". Do not claim to compare the whole market or find the cheapest supplier.
- **FF Team**: "Freelance bar and hospitality work in X: join FF Team". It must say that joining the network is not applying for a job, that there are no vacancies on the page, and that nothing guarantees work, hours or income. In a market that is not recruiting: "FF Team in X: register interest".
- **FF Staff**: "Bar and hospitality staffing in X" with a staffing request; interest-only where the team can't service requests.

Never invent local testimonials, venues served, demand figures or provider counts. No tourist filler. FAQs are short, factual and consistent with the app ("Can I request a bartender in Berkhamsted if nobody is listed?", "Does joining FF Team guarantee work?").

## 5. "Ask us to find people" (lead workflow)

Shown only where the team really accepts sourcing requests (market mode recruiting/operational and the per-site switch on). Otherwise the same form is labelled **Register interest** and records an `expansion_interest`.

Fields: place (prefilled, editable, resolves to a known place or stays as typed text for an admin to resolve), date (or "Date not decided"; validated in Europe/London), profession(s) from the real taxonomy, at least one contact method (email or telephone) with WhatsApp permission recorded separately. Optional: name, headcount, notes. No account, no Event Card, no payment.

Rules:

- Save first, then show a reference and an honest success state: received, not confirmed; nobody booked, reserved or charged. No promised response time or local office. Don't describe a national scout team.
- A durable `local_service_request` (fields in data-model.md). Statuses: `new`, `triaged`, `sourcing`, `options_found`, `contacted`, `converted`, `closed`, `unable_to_fill`.
- Retries must not duplicate the lead or the admin notification (idempotency key + notification dedupe). Failed notifications are visible to admins and never lose the request.
- Acknowledge only through the person's permitted channel. Contact details never appear in URLs, public HTML or analytics.
- Server-side validation, rate limits and spam controls (the prototype has a honeypot field).
- When options are agreed, an admin starts the **existing** Event/Shift flow prefilled; required details, payment and terms are collected there, before invitations. Front Doors never creates invitations, reserves staff or shows a confirmed booking.

## 6. Unclaimed company cards

Bar, DJ, photography and catering company cards are listed from public information and have not been claimed. They appear in area results (they are included for testing and may be advertised on FF Party). They are marked "Draft card".

Final-version handling: if someone wants an unclaimed company, they do **not** book it directly. FireFlair contacts the company, makes the enquiry, and passes the visitor's details on. In the prototype the visitor taps "Ask FireFlair to contact them", which opens the normal request form with the company attached (`companyId`/`companyName` on the request). The admin queue shows "Asked about: <company> (unclaimed card): contact the company and pass the enquiry on." Company coverage is the base location from the Company Card seed (Greater London counts as whole-area for London bases; elsewhere the nearest prepared town or area within 30 km). Owners must confirm bases and permissions before any claim is made (`data/companies/README.md`).

## 7. States: prepared, published, approved

Decided independently for each (site, location). FF Party readiness does not imply FF Team or FF Staff.

| State | Public behaviour | Sitemap / index |
|---|---|---|
| Prepared | Admin preview only; no advertised route; a public visit gets the 404/request view | Excluded |
| Published for use | Working page; crawlable when public | `noindex`, excluded from sitemap |
| Approved for search | Reviewed, useful, working action, accurate scope | Self-canonical, indexable, in that site's sitemap |

"Approved for search" is our editorial decision, not a promise that Google will index or rank the page.

Approval records reviewer, date and a short reason, and requires all five checks: accurate geography; actual service or recruitment capability; a functioning user task; reliable visible facts; why the page is useful separately from its parent and siblings. If it adds nothing, consolidate into the parent or keep it out of search. Admins can review batches with per-page evidence and exceptions (untick a page to leave it out).

An empty profile list alone doesn't make a page unsuitable: a genuinely operated sourcing service can be useful before profiles exist. But swapping town names in the same advert and adding a generic form is not enough to justify an indexed page. Don't flip indexing when a provider is briefly unavailable; reassess when the underlying offer ends. A public `noindex` page is not private: previews and personal records stay access-controlled.

Launch review order for FF Party: London, selected boroughs, Hertfordshire, Berkhamsted, Hemel Hempstead, St Albans, then others the team can really serve. This is a recommendation, not evidence that any area is served.

Market modes per country and site: `inactive`, `interest_only`, `recruiting`, `operational`. UK defaults to recruiting; nothing defaults to operational. Never reuse UK charges, currencies, terms or fulfilment promises abroad without approved configuration.

## 8. Metadata and structured data

- Server-rendered title, H1, text, links, listings, canonical and robots on a direct visit. Nothing may depend on a popup, login, the map or an AI request.
- Each (site, place) page is self-canonical. Robots: prepared `noindex, nofollow`; published `noindex, follow`; approved `index, follow`.
- `BreadcrumbList` always; `CollectionPage`/`ItemList` only when real profiles are listed; `Service` only when sourcing is actually accepted. No `JobPosting` anywhere (FF Team pages are profile sign-up pages, not vacancies), no invented offices, ratings, prices, hours or vacancy counts.
- Sitemaps list only canonical, indexable, successful pages with real last-modified dates. Don't block a `noindex` URL in robots.txt (crawlers must read it). Keep search-crawler decisions (including OAI-SearchBot) separate from training-crawler decisions. No special AI text file is needed.
- Recheck the earlier audit finding that `ffteam.uk/ALEX424` canonicalised to `ffparty.uk/ALEX424`; fix any canonical that points to a non-equivalent or unavailable page before expanding profile discovery.

## 9. Stories and Introductions

Stories keep their standalone `/stories/<slug>` pages and the in-app reader. Introductions stay on the profile Overview; do not create per-town copies. Area pages link to existing profile URLs. When a profile is unpublished or its public facts or coverage change, invalidate the affected area lists and cached profile text.
