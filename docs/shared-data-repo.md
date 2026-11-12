# Shared data repository (planned)

Data used by both the prototype and the released sites lives in one separate GitHub repository, so neither
copy drifts: the FF Event Directory, site images and site content.

Proposed name: `Fire-Flair/FF-Shared-Data` (public, like this repo).

```
directory/            FF Event Directory: unclaimed company profiles, one JSON file per category
  schema.json         the company seed schema (today data/companies/company-seed.schema.json)
  bar-services.json   caterers.json  djs.json  photographers.json  companies.json …
  CHANGELOG.md        one line per weekly crawl: date, category, added, updated, removed
photos/               the photo library (today photo-library/), named by hash, with an index
content/              site content read through CONTENT_ADAPTER: homepage copy, packages, Stories
locations/            the location catalogue inputs (today data/front-doors/)
```

How each side reads it:

- **Prototype**: a sync script copies the files it needs into `src/content/` at build time (the artifact page
  cannot rely on fetching GitHub at runtime). `npm run check` fails if the copy is stale.
- **Real site**: the Content API serves the same JSON; the directory is imported into its own table, outside the
  main FireFlair database.
- **Claiming**: when a business owner claims a Directory profile, its record is copied into the main database
  as a Company Card and marked claimed in the directory; the directory entry is never deleted.
- **Growth**: weekly crawls (Claude) append entries now; user submissions come later through the Content API,
  landing in the same files for review.

Current locations of this data in this repo: `data/companies/`, `src/content/companies/`, `photo-library/`,
`media/`, `src/content/homepage/`, `src/content/packages/`, `stories/`, `data/front-doors/`.
