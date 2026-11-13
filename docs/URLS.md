# FireFlair addresses (URLs)

Every page a person can open or share has its own address on FF Party, FF Team and FF Staff. FF Party is the search site:
profiles and companies live at `ffparty.uk/<tag-or-slug>`, whichever site someone is looking at them on.

The prototype is one file, so its addresses are hash routes (`#/ff-party/sammy`). The live sites use real paths
(`ffparty.uk/sammy`). The two forms are one-to-one: drop `#/ff-party` and you have the path.

Code: `src/utils/routes17.js` (the router, mounted once in `App.jsx`), `src/utils/seo.js` (canonical and robots),
and the three older routers it leaves alone (see the end).

## The address map

Prefixes: FF Party `#/ff-party`, FF Team `#/ff-team`, FF Staff `#/ff-staff`. Production host: `ffparty.uk`, `ffteam.uk`, `ffstaff.uk`.

| Production path | Prototype hash | What it shows | Canonical | Index |
|---|---|---|---|---|
| `/` | `#/<site>` | the site's Home | the site's own home | FF Party index; FF Team and FF Staff per their own rules |
| `/network` | `#/<site>/network` | Network (FF Party calls it Browse) | none of its own | noindex |
| `/bookings` | `#/<site>/bookings` | Bookings (FF Team, FF Staff) | none of its own | noindex |
| `/profile` | `#/<site>/profile` | your own profile or business page | none of its own | noindex |
| `/<tag>` | `#/<site>/<tag>` | a professional's profile | `https://ffparty.uk/<tag>` | see below |
| `/<tag>/packages` `/team` `/reviews` | `#/<site>/<tag>/packages` etc. | the same profile on that tab | `https://ffparty.uk/<tag>` | see below |
| `/<company-slug>` | `#/<site>/<slug>` | a claimed company page | `https://ffparty.uk/<slug>` | see below |
| `/<company-slug>/packages` `/team` `/reviews` | `#/<site>/<slug>/packages` etc. | the company on that tab | `https://ffparty.uk/<slug>` | see below |
| `/areas/...` | `#/<site>/areas/...` | area pages (Front Doors) | that site's own origin | per `docs/front-doors/behaviour.md` |
| `/packages`, `/packages/<id>` | `#/ff-party/packages[/<id>]` | package list and package pages (FF Party only) | `ffparty.uk/packages...` | index once live |
| `/stories/<slug>` | `#/<site>/stories/<slug>` | a Story open in the reader on that site's Home | the story's own site | index once live |

Notes:

- FF Party shows Home and Browse only for now. `/bookings` and `/profile` on FF Party send the visitor to the FF Party home.
  Accepted aliases: `browse` = `network`, `book` = `bookings`, `party` = `profile`. Output is always `network`, `bookings`, `profile`.
- The tab word is the same for people and companies: `packages`, `team`, `reviews`. Overview is the bare address.
  A tab never changes the canonical.
- **Directory entries (unclaimed companies) have no address.** Opening one leaves the address on the list it was opened from.
  A company gets its address when it is claimed.
- Your own public profile is `/<your tag>`. `/profile` is your own page inside the app.
- Home sections that open on a Home page (the Discover pillars) use `#/<site>/home/<section>`; they are part of the Home page, not separate pages.

### Canonical and index rules (as built in `seo.js`)

- A professional or company is always canonical at `https://ffparty.uk/<tag-or-slug>` in lower case, on every site, and on every tab.
- The prototype runs with `FF_SEO.demoData = true`, so every profile and company is `noindex, nofollow` today. That is deliberate:
  the sample people are fictional.
- Production rule built in, for when `demoData` is false: a profile is `index, follow` only when it is published (`person.public`),
  has a tag, and is viewed on FF Party. A profile viewed on FF Team, FF Staff or FF VIP is `noindex, nofollow` and its canonical still
  names the `ffparty.uk` address. A claimed company is `index, follow` on FF Party only. A Directory entry is `noindex` and
  points at the FF Party home.
- Titles stay per page (`<Name> — <Profession> | FireFlair`, `<Company> | FireFlair`).
- Search engines read the HTML before scripts run, so production must send the title, canonical and robots in the server-rendered
  HTML. See `docs/FIREFLAIR-INTRODUCTIONS.md`.

## Tags and slugs

Tags (from `AUTH_ADAPTER`): 3 to 8 letters or numbers, nothing else, unique, **not case sensitive**, stored in lower case
(`alex`, `alexg`, `alex94`). A tag can be changed later, so a changed tag needs a redirect from the old address.

Company slugs (from `slugify` in `company-profile.jsx`): lower case, `&` becomes `and`, every other run of characters outside
`a-z0-9` becomes one hyphen, no leading or trailing hyphen, at most 40 characters. A person and a company can never share an address,
so tags and slugs are checked against each other in production.

Reserved words that can never be a tag or a slug:

`network`, `browse`, `bookings`, `book`, `profile`, `party`, `areas`, `packages`, `stories`, `vip`, `team`, `staff`, `admin`, `login`, `home`.

The prototype already refuses them: `AUTH_ADAPTER.isAvailable` returns false for a reserved tag and a new company slug that
matches one gets `-co` added. Add any new top-level page to the list in `src/utils/routes17.js` (`RT17_RESERVED`) and here.

## Behaviour

- Opening a profile, a company or a profile tab updates the address. Back closes it; Forward reopens it.
- Loading or refreshing an address opens that screen on that site, signed in or signed out.
- Tags and slugs are read case-insensitively. `SAMMY` opens `sammy`, and the address is rewritten to lower case.
- An unknown tag or slug goes to that site's home, and the address becomes the home address. No error page.
- A locked page (Bookings or Profile on FF Party) goes to that site's home.
- Switching site rewrites the prefix (`#/ff-party/sammy` then FF Team gives `#/ff-team`).
- Signing out clears the address back to the start page.
- Share and copy link give the production address `https://ffparty.uk/<tag>` (company: `https://ffparty.uk/<slug>`), unchanged.

### Redirects (decision for FireFlair)

The prototype's canonical tags say the profile belongs to `ffparty.uk`, and that FF Team and FF Staff views are copies of it.
The suggested rule is: `ffteam.uk/<tag>` and `ffstaff.uk/<tag>` answer with a 301 to `https://ffparty.uk/<tag>` for public visitors, and
the signed-in app on FF Team and FF Staff keeps its own screens. This is not decided. If FireFlair wants the profile
to stay on `ffteam.uk` for FF Team members, the canonical in `seo.js` changes and nothing else.
Other redirects needed: upper case tag to lower case (one 301), an old tag to the new tag, area aliases (see Front Doors),
and a trailing slash to none.

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
7. `/<company-slug>` opens a claimed company; a Directory company never gets an address.
8. `/bookings` and `/profile` on FF Party show the home page.
9. A reserved word cannot be registered as a tag or a company slug.
10. Area pages (`/areas/...`) and package pages (`/packages/...`) still load directly and by Back.
11. A Story opens from its address, closes on Back, and a refresh on it reopens it.
12. View-source on a profile: canonical is `https://ffparty.uk/<tag>`; on `ffteam.uk` and `ffstaff.uk` the same canonical and `noindex`.
13. Repeat 1 to 8 at 390 px and at 1280 px wide: no sideways scrolling, no console errors.
