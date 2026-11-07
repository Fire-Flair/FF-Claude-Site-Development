# Front Doors: location pages for FF Party, FF Team and FF Staff

**Read this first.** It says what the prototype demonstrates, what is faked, and where the rest of the
documents are. The code is in `source/fireflair-app.jsx`, section "FRONT DOORS (v17.3.110)"
(search for `FD_ROWS`). The brief it was built from is `data/front-doors/FireFlair_Front_Doors_Claude_Prompt.md`.

"Front Doors" is the internal name. Never show it, or "SEO content", on a public page.

## What it is

One shared location engine and one reusable area-page template with three site intents:

| Site | Visitor | Main action | Supporting action |
|---|---|---|---|
| FF Party (`ffparty.uk`) | Private host wanting bartenders and event services in an area | Find a professional (existing profile and booking flow) | Ask us to find people |
| FF Team (`ffteam.uk`) | Professional wanting freelance bar/hospitality work | Create a Profile Card and say where they work | Register interest where not recruiting |
| FF Staff (`ffstaff.uk`, the business site) | Venue or business needing staff | Start a staffing request | Create a company profile |

1,000 prepared places can each have one page per site (up to 3,000 routes). Each site's page has its own
title, H1, introduction, action, FAQ and self-canonical URL. They are never cross-canonicalised.

## What is real in the prototype, and what is simulated

| Area | In the prototype | For the real build |
|---|---|---|
| Route manifest | Real: the kit's 1,000 pages, compact (`FD_ROWS`) | Location table; fetch children on demand; never ship the 47,990-record catalogue |
| Explore by area | Real UI: nested disclosure, place search, live pages linked, others "Ask us to find people" | Same, backed by an API |
| Area page template | Real, three intents, breadcrumbs, FAQ, child/sibling links | Server-rendered / prerendered HTML |
| Coverage + fallback | Real algorithm over **fixture** coverage | Providers' own confirmed work locations |
| Request form | Real validation, duplicate guard, reference, honest success state; saved in `state.fd.requests` | `local_service_request` table, notifications, rate limits, spam checks |
| Admin | Real queue, per-(site, place) review/publish/approve, batch review, markets, sitemap preview | Same on real data and roles |
| Metadata | Real title, description, canonical, robots, JSON-LD set per page | Emitted in server HTML |
| Sitemap | Preview only (FF Admin → Areas and requests → Sitemap) | Per-site XML from approved pages |
| Notifications | Simulated (record says `simulated`) | Existing channels; dedupe by request ID + type |

Nothing is marked operational or approved for search by default. While `FF_SEO.demoData` is on, the prototype
emits `noindex` even for an approved page; approval is still recorded.

## Documents

- [behaviour.md](behaviour.md): how it must work in the final version (URLs, coverage, fallback, copy, leads, unclaimed companies, states, SEO).
- [data-model.md](data-model.md): records, relationships, indexes, caching and invalidation.
- [backend-todo.md](backend-todo.md): what remains, known limitations, validation checklist, analytics events.

## Demo pages

Open FF Party (or Team/Staff) → People → **Explore by area**, or use these addresses (replace `ff-party`
with `ff-team` or `ff-staff`):

- `#/ff-party/areas/uk/england/hertfordshire/berkhamsted`: nobody lists Berkhamsted, so a labelled Hertfordshire selection and the request form.
- `#/ff-party/areas/uk/england/birmingham`: nobody there; wider selection stops at England.
- `#/ff-party/areas/uk/england/greater-london/camden`: exact coverage (whole-area Greater London plus selected boroughs).
- `#/ff-party/areas/uk/england/greater-london`: parent hub: covering, and serving places within.
- `#/ff-party/areas/worldwide/europe/france`: interest-only market.
- `#/ff-party/areas/uk/england/atlantis`: unknown place, a 404 view.
- `#/ff-party/areas/uk/england/london`: route alias, redirected once to Greater London.
- FF Admin → **Areas and requests**: requests queue, pages, markets, sitemap.
