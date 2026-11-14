# The FireFlair company-profile format

This is the one shape we use for a company page. The company builder writes it, the owner's own page and every directory company read it, and the directory agent fills it. The agent fills this shape and nothing outside it: a field that is not listed here does not exist on a company page.

Everything is built from the universal card record that the live FF Team site already has (`CardSectionData`): `title`, `description`, up to 5 images (`media`), one document (`document`, a PDF), `display_order`, `is_hidden`, and free-form `additional_data`. In the prototype that record is `makeRecord` and it is edited by `GenericAttributeCardCreator`.

## Limits

- 5 photos and 1 PDF per card.
- A card needs a title; every other part is optional.
- Hidden cards stay stored and are not shown on the public page.
- Order is the order of the list (`display_order`).

## Mapping to the back-end record

| Prototype | Back-end record |
| --- | --- |
| `name` | `title` |
| `description` | `description` |
| `media[].dataUrl` | `media` (image) |
| `document` | `document` (PDF) |
| position in the list (`rank`) | `display_order` |
| `hidden` | `is_hidden` |
| section settings, `alt` captions and other extras | `additional_data` |

## Fields, and the builder control that makes each

| Field | What it is | Builder control |
| --- | --- | --- |
| Card (`name`, `kind`, `logo`, `theme`, `layout`, `slug`, `socials`) | The Company Card and the company address | The Company Card at the top of the builder |
| Base (`base17`) | Where the company is based | Where are you based? |
| Areas (`records.locations`) | Areas covered | Areas covered |
| Photos (`media[]`: `src`, optional `alt` caption) | The gallery, in display order | The Add photos row; each photo opens its caption and order |
| About (`description`) | The company text; paragraphs split on blank lines | About |
| Sections (`info[]`) | See below | More information |
| Packages (`records.packages`) | Simple cards: title, description, photos, optional PDF | Packages tab, Packages |
| Cocktails (`records.cocktail_menu`) | Simple cards: title, description, photos, optional PDF | Packages tab, Cocktails |
| Reviews from other sources (`records.web_reviews`) | Title is who said it, description is what they said | Reviews tab, Reviews from other sources |
| Q&A (`qa[]`) | `{ text, answer ("Yes" or "No" or empty), note }`; shown when it has an answer or a note | Q&A, Add a question |
| Contact (`records.contact`) | Title is the value, description is its kind (WhatsApp, Website, Email, Phone) | Contact & social |

## Sections

Each entry of `info[]` has these settings:

- `id`: stable key.
- `title`: required.
- `lead`: the headline, one bold line (optional).
- `text`: paragraphs separated by blank lines (optional).
- `chips`: tags, short labels (optional).
- `numbered`: true shows 01, 02 on each card.
- `quote`: the closing line (optional).

The cards of a section are stored in `records["info_<id>"]`. A section with only tags and nothing else shows as a heading with chips. On the public page, if every visible card has a photo the cards show as a photo grid (title and description as the caption); otherwise they show as boxes in a row, and a box with photos opens them in its pop-up. A photo section such as Bar styles is made by adding many photos at once: one card per photo, titled with the file name without its extension.

## Example (Vooshka, trimmed)

```json
{
  "name": "Vooshka Cocktail Bar",
  "kind": "Luxury mobile cocktail bar",
  "slug": "vooshka",
  "media": [{ "id": "vk_g0", "src": "photo-1.webp", "alt": "Behind every memorable occasion" }],
  "info": [
    { "id": "vk_exp", "title": "The Vooshka experience", "lead": "A little theatre. A lot of elegance.",
      "text": "You bring the people and the reason to celebrate; we'll take care of the bar.",
      "chips": ["Bespoke Bars", "Cocktails", "Mocktails"] },
    { "id": "vk_steps", "title": "The Vooshka process", "numbered": true,
      "quote": "Not just a bar. A beautiful part of your celebration." }
  ],
  "records": {
    "info_vk_steps": [{ "name": "It Begins With You", "description": "Our team will take you through the details of your event." }],
    "packages": [{ "name": "Weddings", "description": "From the welcome drinks to the final toast.\n\nIncludes: Bespoke bar, cocktails, mocktails and an expert team\nIdeal for: Wedding receptions and celebrations", "media": [] }],
    "cocktail_menu": [{ "name": "Popcorn Whisky", "description": "Whisky softened with sweet popcorn and a squeeze of lemon." }],
    "web_reviews": [{ "name": "Pav", "description": "Just wanted to say a massive thank you to you and the team." }]
  },
  "qa": [{ "text": "Does an enquiry reserve my date?", "answer": "No", "note": "Your date is secured once your signed agreement and deposit are received." }]
}
```
