# The FireFlair company-profile format, version 2

This is the one shape we use for a company page. The company builder writes it. The owner's own page and every directory company read it. The directory agent fills it, and so do we and the company, and the page can then be handed to the company. The agent fills this shape and nothing outside it: a field that is not listed here does not exist on a company page.

One company is one file: `data/companies/profiles/<slug>.json`. The schema is `data/companies/company-profile.schema.json`. `npm run check-companies` checks every file against it and against the rules in "Who may change what" below. `npm run companies` (part of `npm run build`) checks the files again and writes the two bundles the prototype reads through `CONTENT_ADAPTER`. The instructions for the agent are `data/companies/AGENT.md`.

Everything is built from the universal card record that the live FF Team site already has (`CardSectionData`): `title`, `description`, up to 5 images, one document (a PDF), `display_order`, `is_hidden`, and free-form `additional_data`. In the prototype that record is `makeRecord`, edited by `GenericAttributeCardCreator`.

## What changed from version 1

Nothing is renamed. Version 2 adds `formatVersion`, `meta`, `base`, `areas`, `source` on every item, `proposed` on cards, and one file per company. The directory companies used to be stored in a thin "seed" shape (`summary`, `services`, `eventTypes`, `scale`, `facts`) that was not the builder's shape, so they could not carry packages, cocktails, Q&A or sections of their own. They now use the same shape as every other company page.

## Limits

- 5 photos and 1 PDF per card.
- A card needs a title (`name`); every other part is optional. Card titles are at most 150 characters and card text at most 2,000, the same limits the live site applies.
- Hidden cards stay stored and are not shown on the public page. Cards marked `proposed` are not shown either (see below).
- Order is the order of the list (`display_order`).

## The file

| Field | What it is | Builder control |
| --- | --- | --- |
| `formatVersion` | Always `2` | |
| `slug`, `name`, `kind` | The company address word, the name, and one short line saying what the company is | The Company Card at the top of the builder |
| `base` | Where the company is based, as a place name the way the company states it. The plain-name twin of `base17` | Where are you based? |
| `areas` | Places covered, as the company states them. The build resolves each one to a place id (see "Areas") | Areas covered |
| `logo`, `logoBg` (`dark` or `light`), `logoWide` | The logo and how it sits | The Company Card |
| `card` (`theme`, `layout`), `areasNote` | How the Company Card looks; one sentence on where the company works. Set by the company or by us, the agent leaves them out | The Company Card, the builder |
| `description`, `aboutSource` | The About text (paragraphs split on blank lines) and who wrote it | About |
| `media[]` | The gallery in display order: `{ id, src, alt, source }`; `alt` is the caption | The Add photos row |
| `info[]` | The company's own sections (see "Sections") | More information |
| `records.packages` | Cards: title, description, photos, optional PDF | Packages tab, Packages |
| `records.cocktail_menu` | Cards, same shape | Packages tab, Cocktails |
| `records.web_reviews` | Cards: the title is who said it, the description is what they said | Reviews tab, Reviews from other sources |
| `records.contact` | Cards: the title is the value, the description is its kind (Website, Instagram, Facebook, LinkedIn, TikTok, WhatsApp, Phone, Email) | Contact |
| `records["info_<id>"]` | The cards of the section with that id | More information |
| `qa[]` | `{ id, group, text, answer ("Yes", "No" or ""), note, source }`; shown when it has an answer or a note | Q&A, Add a question |
| `meta` | Facts about the file, not shown on the page (see "Meta") | Private |

A card is `{ id, name, description, media[], document, hidden, proposed, source }`. A photo is `{ id, src, alt, source }`. Every `id` is unique inside its list and does not change once written, because the next run finds an item by its id.

## Sections

Each entry of `info[]` has these settings:

- `id`: stable key.
- `title`: required.
- `lead`: the headline, one bold line (optional).
- `text`: paragraphs separated by blank lines (optional).
- `chips`: tags, short labels (optional).
- `numbered`: true shows 01, 02 on each card.
- `quote`: the closing line (optional).
- `source`, and `proposed` where the agent adds a section beside one a person has edited.

The cards of a section are stored in `records["info_<id>"]`. A section with only tags and nothing else shows as a heading with chips. On the public page, if every visible card has a photo the cards show as a photo grid (title and description as the caption); otherwise they show as boxes in a row, and a box with photos opens them in its pop-up.

"Custom data entries" are sections. Any company, the agent included, can create any section with a title, and put cards in it. Nothing outside the format exists on a page.

The directory companies carry four tag sections, with the ids `services`, `events`, `scale` and `good-to-know` and the titles "Services", "Events", "Scale" and "Good to know".

## Meta

```
meta: {
  status:     "directory" | "claim-pending" | "claimed",
  statusAt:   "2026-11-14",            // the day the status last changed; needed once it is not "directory"
  category:   "bar" | "dj" | "photo" | "catering" | "svc",
  sub:        "ice" | "glassware" | "events",   // only for category "svc"
  tag:        "BARBR",                 // the short code on the Company Card; unique across files
  tier:       "gold",                  // verification level, set by us (standard, bronze, silver or gold)
  partner:    true,                    // FireFlair partner (Partners layer on the map)
  position:   20,                      // place in the directory list; lower first, no position goes last by slug
  legal:      { form: "limited" | "sole" | null, legalName, companyNumber },
  source:     { urls: [], retrievedAt },       // the pages the agent read, and when
  permission: { text: "own-words" | "granted", images: "none" | "to_confirm" | "granted" },
  verifiedBy: null,
  pins:       [{ label, lat, lng, approx }]    // map pins at town or city level, never an address
}
```

`permission.text` is `own-words` when the agent wrote everything itself, and `granted` when the company has agreed that its own wording may be used. `permission.images` says whether photos may be used: `none`, `to_confirm` (found, waiting for the company), or `granted`. `approx: true` on a pin means the base was not stated and needs confirming with the company.

## Source: who wrote each item

Every card (any record in `records.*`, including `info_<id>` cards), every section, every question, every gallery photo and the About text may carry:

```
source: { by: "agent" | "fireflair" | "owner", url, at }
```

- `by`: who wrote it. `url` is the page the agent read (needed when `by` is `agent`). `at` is the date.
- An item with no `source` is treated as written by a person.
- Whoever edits an item sets `source.by` to themselves: the builder sets `owner`, we set `fireflair`.

## Who may change what

| Who | May add | May change or remove | May not |
| --- | --- | --- | --- |
| The agent | Cards and sections | Only items whose `source.by` is `"agent"` | Change or remove an item whose `source.by` is `"fireflair"` or `"owner"`, or that has no source. If the website now says something different, it adds a new card marked `proposed: true` beside it |
| The agent, once `meta.status` is `"claim-pending"` or `"claimed"` | Nothing | Nothing | Write anything to the file |
| FireFlair | Anything | Anything; the item becomes `"fireflair"` | |
| The company (owner) | Anything | Anything; the item becomes `"owner"` | |

These rules apply to every file, and the check enforces them:

- No prices, fees or costs in anything the agent writes. What a supplier charges is the supplier's business. An item written by a company or by us may hold whatever the company supplied.
- No personal names, personal phone numbers or personal email addresses. The agent writes Website and social contacts only.
- Text is in the agent's own words unless `meta.permission.text` is `granted`.
- Photos and customer reviews are added by the agent only when `meta.permission.images` and `meta.permission.text` are `granted`.
- Outreach contact details (who to email about claiming) are never stored in these files or anywhere in this public repository.

What the check looks for: the schema; at most 5 photos and 1 PDF per card; a title on every card and section; unique slugs and tags; unique ids; no currency amounts, email addresses or phone numbers in text written by the agent; nothing written by the agent after `meta.statusAt` in a claimed or claim-pending file; photos and reviews only with permission. With `--against <commit>` it also compares with an earlier commit and reports any item a person wrote that has been changed or removed, and any file that was already claimed and has changed. Names that match no place in the location list are warnings.

## Areas

`areas` holds place names as the company states them. The build resolves each name to a place id in the location list, using the same names the page uses, and writes the result next to the profile as `areaPlaces`: a work location record `{ locId, name, lat, lng }` where the name matches, and `{ name }` where it does not. A name that matches nothing is a warning and stays a plain name; the page still shows it. `areaPlaces` is what a claimed company's ticked work locations start from (`docs/locations-phase2.md`). The directory page shows the stated names as they are.

## Example (a directory company, trimmed)

```json
{
  "formatVersion": 2,
  "slug": "example-bars",
  "name": "Example Bars",
  "kind": "Mobile bars",
  "base": "Leeds",
  "areas": ["Leeds", "Yorkshire"],
  "description": "A Leeds mobile bar company for weddings and parties.",
  "aboutSource": { "by": "agent", "url": "https://example.invalid/about", "at": "2026-11-14" },
  "media": [],
  "info": [
    { "id": "services", "title": "Services", "chips": ["Mobile bar hire", "Cocktail masterclasses"],
      "source": { "by": "agent", "url": "https://example.invalid/services", "at": "2026-11-14" } },
    { "id": "why-us", "title": "Why choose us", "lead": "A little theatre. A lot of elegance.",
      "source": { "by": "fireflair", "at": "2026-11-14" } }
  ],
  "records": {
    "contact": [{ "id": "website", "name": "https://example.invalid", "description": "Website",
      "source": { "by": "agent", "url": "https://example.invalid", "at": "2026-11-14" } }],
    "info_why-us": [{ "id": "why-1", "name": "Trained team", "description": "Every bartender is trained in house.",
      "source": { "by": "fireflair", "at": "2026-11-14" } }],
    "packages": [{ "id": "wedding-bar", "name": "Wedding bar", "description": "A staffed bar from the welcome drinks to the last toast.",
      "source": { "by": "agent", "url": "https://example.invalid/weddings", "at": "2026-11-14" } }],
    "cocktail_menu": [{ "id": "espresso-martini", "name": "Espresso Martini", "description": "Vodka, coffee liqueur, espresso.",
      "source": { "by": "agent", "url": "https://example.invalid/menu", "at": "2026-11-14" } }]
  },
  "qa": [{ "id": "travel", "group": "business", "text": "Do you travel?", "answer": "Yes", "note": "Across Yorkshire.",
    "source": { "by": "agent", "url": "https://example.invalid/faq", "at": "2026-11-14" } }],
  "meta": {
    "status": "directory", "category": "bar", "tag": "EXBAR", "position": 0,
    "source": { "urls": ["https://example.invalid/"], "retrievedAt": "2026-11-14" },
    "permission": { "text": "own-words", "images": "none" },
    "verifiedBy": null,
    "pins": [{ "label": "Leeds", "lat": 53.8008, "lng": -1.5491, "approx": false }]
  }
}
```

## How the prototype reads it

`npm run companies` reads every file in `data/companies/profiles/`, checks them, and writes `src/content/companies/real-companies.json` (bar companies) and `suppliers.json` (every other category): the profiles as they are, in `meta.position` order, plus `areaPlaces`. The page cannot fetch files while it runs, so the bundles are read at build time through `CONTENT_ADAPTER.companyProfiles()` and `supplierProfiles()`, and `npm run check` fails if they are out of date. The real service returns the same profiles from the Content API. `src/content/companies.js` passes a profile to the page as it is: the short list row (name, kind, tag, pins) comes from `meta`, the page from the rest.

A directory company stays unclaimed on the page: no FireFlair logo or coin, "Not yet claimed", no Ask or Review, not bookable, and off FF Party's bar lists unless its category is `bar`.

The old seed files (`data/companies/seed-*.json`) stay as they were; the profile files are now the source. Raise the Bar Glasgow is the worked example of a rich profile: its packages, cocktails and questions are cards written by the company (`source.by` `owner`). Vooshka is a profile file too (`vooshka.json`, status `claimed`); its page and the DEV owner account are both read from it, and nothing about it is built by hand. The one list of Vooshka's own signature cocktail and service cards for the Studio builders (`vkSeeds17`) is kept in `company-pages.jsx`.

Claiming and FireFlair editing in the prototype are described in `docs/company-claim-phase2.md`. In the prototype a claim never writes to a profile file: the owner's copy and FireFlair's edits are kept in the app's state in the same format, and are shown over the file.

## How this maps to the back end you already have

This section describes only what we can see in the back-end code (`CardSectionDefinition`, `CardProfileSection`, `CardSectionData`, `UserProfile` and the custom-section code in `cardService.js`).

| Format 2 | Back end |
| --- | --- |
| A section in `info[]` | A profile section (`CardProfileSection`: `section_name`, `display_order`, `is_enabled`). The company's own sections are custom sections: `createCustomSection` makes a `CardSectionDefinition` (`key` like `custom_<name>_<hex>`, `is_default: false`) and a `CardProfileSection` with `custom_name_key`, the trimmed lower-case name. A unique index stops a profile having two custom sections with the same name |
| Section settings (`lead`, `text`, `chips`, `numbered`, `quote`) | The section definition's `schema` object (`CardSectionDefinition.schema`, free-form, empty by default). A custom definition belongs to one profile, so the settings can live there. A shared default definition cannot hold one company's settings |
| A card | A record, `CardSectionData`: `name` is `title`, `description` is `description`, `media` is `media_ids` (at most 5), `document` is `document_id` (one), the position in the list is `display_order` (1 to n), `hidden` is `is_hidden` |
| `proposed` | No field. Store `is_hidden: true` and `additional_data.proposed: true` |
| `source` and photo captions (`alt`) | `additional_data` on the record. See the warning below |
| `source.by` | `created_by_type` on the profile section and the section definition (a free string, no list of allowed values). The code only ever writes `user`. We would add `admin` for FireFlair and one new value for the agent. There is no `created_by_type` on a record, so for a card the answer lives in `additional_data` |
| `records.packages`, `records.cocktail_menu`, `records.web_reviews`, `records.contact` | Sections of the same names. We could not confirm from the code that default definitions with these names exist; if they do not, they are created the way a custom section is |
| `areas` and `areaPlaces` | The Work Location section. The service requires numeric `additional_data.lat` and `lng` on each record, which `areaPlaces` supplies |
| `description` (About) | `UserProfile.about_me` is plain text, with a limit of 500 characters in the code comment. The longest About text in the directory today is 300 characters |
| `media` (gallery) | `UserProfile.gallery_media_ids`, up to 12 images |
| The directory | Imported as drafts through the admin or content API, and kept outside the main tables until a company claims its page, as `docs/shared-data-repo.md` describes |

Two things to settle before this is built:

1. The key `source` is already taken. `additional_data.source` is written only by the server for records that FF AI or a CV import created (it holds the evidence quoted from the person's CV). The validator deletes a `source` sent by a client, the public card removes it, and edits keep it. Our `source` therefore cannot live under that key. We suggest `additional_data.provenance` for `{ by, url, at }`, kept by the server across edits in the same way, with `by` changed to `owner` when the company edits the item. This is a suggestion; it needs your agreement.
2. `additional_data` is limited to 5,000 characters as stored JSON, and titles and text to 150 and 2,000 characters. Format 2 fits inside those limits.

### What does not exist in the back end yet

- There is no company profile at all. Nothing in the code we read mentions a company: the profile (`UserProfile`) belongs to one user (`user_id` is required and unique), so a directory company with no account has nowhere to live.
- There is no directory import. The admin API we have only answers a health check.
- There is no agent value for `created_by_type`, and nothing reads `CardSectionDefinition.schema` yet.
- There is no `proposed` card, no `source` on a record, and no claim step that copies a directory file into the main tables.
- We did not read the Q&A models, so we do not say how `qa[]` maps.
