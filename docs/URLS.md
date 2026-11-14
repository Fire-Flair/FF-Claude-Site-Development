# FireFlair addresses (URLs)

Every page a person can open or share has its own address on FF Party, FF Team and FF Staff. Each site serves its own version of a
profile or company at its own host: `ffparty.uk/<tag-or-slug>`, `ffteam.uk/<tag-or-slug>` and `ffstaff.uk/<tag-or-slug>`.
There are no redirects between the sites.

The prototype is one file, so its addresses are hash routes (`#/ff-party/sammy`). The live sites use real paths
(`ffparty.uk/sammy`). The two forms are one-to-one: drop `#/ff-party` and you have the path.

Code: `src/utils/routes17.js` (the router, mounted once in `App.jsx`), `src/utils/seo.js` (canonical and robots),
and the three older routers it leaves alone (see the end).

## The address map

Prefixes: FF Party `#/ff-party`, FF Team `#/ff-team`, FF Staff `#/ff-staff`. Production host: `ffparty.uk`, `ffteam.uk`, `ffstaff.uk`.

| Production path | Prototype hash | What it shows | Canonical | Index |
|---|---|---|---|---|
| `/` | `#/<site>` | the site's Home | the site's own home | index |
| `/network` | `#/<site>/network` | Network (FF Party calls it Browse) | none of its own | noindex |
| `/bookings` | `#/<site>/bookings` | Bookings (FF Team, FF Staff) | none of its own | noindex |
| `/profile` | `#/<site>/profile` | your own profile or business page | none of its own | noindex |
| `/<tag>` | `#/<site>/<tag>` | a professional's profile | this site's own address, `https://<site host>/<tag>` | index (see below) |
| `/<tag>/packages` `/team` `/reviews` | `#/<site>/<tag>/packages` etc. | the same profile on that tab | `https://<site host>/<tag>` | index |
| `/<company-slug>` | `#/<site>/<slug>` | a company page: claimed company or FF Event Directory entry | `https://<site host>/<slug>` | index |
| `/<company-slug>/packages` `/team` `/reviews` | `#/<site>/<slug>/packages` etc. | a claimed company on that tab | `https://<site host>/<slug>` | index |
| `/areas/...` | `#/<site>/areas/...` | area pages (Front Doors) | that site's own origin | per `docs/front-doors/behaviour.md` |
| `/packages`, `/packages/<id>` | `#/ff-party/packages[/<id>]` | package list and package pages (FF Party only) | `ffparty.uk/packages...` | index once live |
| `/stories/<slug>` | `#/<site>/stories/<slug>` | a Story open in the reader on that site's Home | the story's own site | index once live |

Notes:

- FF Party shows Home and Browse only for now. `/bookings` and `/profile` on FF Party send the visitor to the FF Party home.
  Accepted aliases: `browse` = `network`, `book` = `bookings`, `party` = `profile`. Output is always `network`, `bookings`, `profile`.
- The tab word is the same for people and companies: `packages`, `team`, `reviews`. Overview is the bare address.
  A tab never changes the canonical.
- **Directory entries (unclaimed companies) have their own address**, in the same form as a claimed company: `#/<site>/<slug>` in the
  prototype, `ffparty.uk/<slug>` (and the same on `ffteam.uk`, `ffstaff.uk`) in production. The slug is stable, from the entry's name.
  A Directory entry has no tabs, so it has the bare address only. Its Company Card shows the address.
- Your own public profile is `/<your tag>`. `/profile` is your own page inside the app.
- Home sections that open on a Home page (the Discover pillars) use `#/<site>/home/<section>`; they are part of the Home page, not separate pages.

### Canonical and index rules (as built in `seo.js`)

- Every site is canonical for its own pages. A profile, a company or a Directory entry is canonical at that site's own host plus path, in lower
  case, on every tab: `https://ffparty.uk/<x>` on FF Party, `https://ffteam.uk/<x>` on FF Team, `https://ffstaff.uk/<x>` on FF Staff.
  `FF_SEO.siteOrigins` holds the three hosts. FF VIP has no pages of its own and uses FF Team's host.
- Everything public is indexable in production: a profile (published, with a tag), a claimed company and a Directory entry are
  `index, follow` on every site. There is no site-based `noindex`. Account screens (Network, Bookings and Profile tabs) stay `noindex`.
- The prototype runs with `FF_SEO.demoData = true`, so every profile and company is `noindex, nofollow` today. That is deliberate:
  the sample people are fictional. The self-test (`window.__ffSeo.selfTest()`) also checks the production rules for each site by turning
  `demoData` off for the length of the test.
- Share links and copy link keep pointing at `https://ffparty.uk/<tag-or-slug>`.
- Search consequence: each profile has three indexable versions, one per site, each canonical to itself.
- Titles stay per page (`<Name> — <Profession> | FireFlair`, `<Company> | FireFlair`).
- Search engines read the HTML before scripts run, so production must send the title, canonical and robots in the server-rendered
  HTML. See `docs/FIREFLAIR-INTRODUCTIONS.md`.

## Tags and slugs

Tags (from `AUTH_ADAPTER`): 3 to 8 letters or numbers, nothing else, unique, **not case sensitive**, stored in lower case
(`alex`, `alexg`, `alex94`). A tag can be changed later, so a changed tag needs a redirect from the old address.

Company slugs (from `slugify` in `company-profile.jsx`): lower case, `&` becomes `and`, every other run of characters outside
`a-z0-9` becomes one hyphen, no leading or trailing hyphen, at most 40 characters. A person and a company can never share an address,
so tags and slugs are checked against each other in production.

Directory entries use the slug in their own data (`slug` in the company JSON). `rt17SlugMap()` in `routes17.js` makes every slug unique the
same way every time: claimed companies keep the plain slug; an entry that clashes with a reserved word, a person's tag or an earlier
entry takes its town (`pure-photo-ni-lisburn`), then `-2`, `-3`. A new company whose slug matches a Directory entry gets `-co`.
No two entries currently clash. The directory data has one `Pure Photo N.I` and one `EPIC Caterers` (the repeats seen on the map are
two base pins each, not two entries).

Reserved words that can never be a tag or a slug:

`network`, `browse`, `bookings`, `book`, `profile`, `party`, `areas`, `packages`, `stories`, `vip`, `team`, `staff`, `admin`, `login`, `home`.

The prototype already refuses them: `AUTH_ADAPTER.isAvailable` returns false for a reserved tag and a new company slug that
matches one gets `-co` added. Add any new top-level page to the list in `src/utils/routes17.js` (`RT17_RESERVED`) and here.

## Behaviour

- Opening a profile, a company, a Directory entry or a profile tab updates the address. Back closes it; Forward reopens it.
- Each tab click is its own history step.
- Every detail screen (profile, company, Directory company, area page, package page, Story article) has a visible Back button on all
  sites. It goes back one step when the app has history (`history.back()`), otherwise to the parent list or the home page
  (`rt17Back`, `BackBtn17`).
- Loading or refreshing an address opens that screen on that site, signed in or signed out.
- Tags and slugs are read case-insensitively. `SAMMY` opens `sammy`, and the address is rewritten to lower case.
- An unknown tag or slug goes to that site's home, and the address becomes the home address. No error page.
- A locked page (Bookings or Profile on FF Party) goes to that site's home.
- Switching site rewrites the prefix (`#/ff-party/sammy` then FF Team gives `#/ff-team`).
- Signing out clears the address back to the start page.
- Share and copy link give the production address `https://ffparty.uk/<tag>` (company: `https://ffparty.uk/<slug>`), unchanged.

### Redirects

- None between sites: `ffteam.uk/<tag>`, `ffstaff.uk/<tag>` and `ffparty.uk/<tag>` each serve their own version.
- Still needed: upper case tag to lower case (one 301), an old tag to the new tag, area aliases (see Front Doors), and a trailing slash to none.

## Prototype pieces left as they are

| Address | Router | Notes |
|---|---|---|
| `#/<site>/areas/...` | `FdRoute11` in `find-directory.jsx` | `routes17` ignores it |
| `#/ff-party/packages[/<id>]` | `PkgRoute18` in `package-pages.jsx` | `routes17` ignores it |
| `#/support/book-a-call` | `SupportRoute20` | `routes17` ignores it |
| `#/<site>/home/<section>` | `DiscoverHub11` | moved here from `#/<site>/<section>` so the section names (`network`, `packages`, `party`) are free for pages |
| `#/<site>/stories/<slug>` | `Journal17` using `rt17Parse` | `ST18_ROUTES` (real `/stories/<slug>`) stays off in the single file because a real path cannot be reloaded there; turn it on in production |

Story pages do not yet change the canonical or title while the reader is open. In production each story is its own page
at `/stories/<slug>` on the site named in `articles.json` (`site`).

## What to test (start on ffparty.uk)

1. Direct load of `/<tag>` opens that profile, signed out and signed in.
2. Refresh on a profile, on a profile tab and on a company tab keeps the same screen.
3. Back and Forward walk through Home, Browse, a profile and its tabs, and Back from a profile returns to the list.
4. A shared link (`https://ffparty.uk/<tag>`) opens the profile and shows the right title.
5. `SAMMY`, `Sammy` and `sammy` give one page; the upper-case forms redirect to lower case.
6. An unknown tag shows the FF Party home, not an error.
7. `/<company-slug>` opens a claimed company or a Directory entry, on each site.
8. `/bookings` and `/profile` on FF Party show the home page.
9. A reserved word cannot be registered as a tag or a company slug.
10. Area pages (`/areas/...`) and package pages (`/packages/...`) still load directly and by Back.
11. A Story opens from its address, closes on Back, and a refresh on it reopens it.
12. View-source on a profile: on each site the canonical is that site's own `https://<host>/<tag>` and robots is `index, follow` (for a published profile).
    No redirect from `ffteam.uk` or `ffstaff.uk` to `ffparty.uk`.
13. Repeat 1 to 8 at 390 px and at 1280 px wide: no sideways scrolling, no console errors.
