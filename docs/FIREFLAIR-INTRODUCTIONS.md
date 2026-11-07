# FireFlair Introductions — prototype notes for the developers

Status: **prototype only. The backend is not built.** Everything below marked "prototype" runs in the browser; the real site must do the same on the server.

## What the prototype does (v17.3.103)

- Every profile's Overview ends with an H2 **FireFlair Introductions**, beneath Skills and Attributes. Nothing else on the page moved.
- It is written when the owner presses Publish (the button labelled Save in the Save & Share card). Publish builds the public snapshot, asks the existing AI connection (`getSample()` / `sample.json`, the same one About Me uses), validates the reply, and stores it with the profile in one step. There is no extra screen or confirmation.
- Draft saves do not publish or generate anything.
- If the AI is unavailable, times out (40 s) or fails validation, a minimal fallback sentence is built only from the public name, main profession and confirmed work areas. With less than that, the section is not shown.
- Owner-only editor (on the owner's own profile, after publishing): Edit introduction, Regenerate (fills the editor only; nothing changes until Save), Save, Cancel. Manual edits are kept on later publishes; a paragraph whose source fact was removed is dropped.
- Duplicate and stale protection: the snapshot is hashed. Same hash plus a stored introduction means no new AI call; two identical publishes share one call; a result that finishes after a newer publish began is discarded.
- A visible H1 was added: "Name — Profession in Area". The card's name is no longer an H1, so the page has one H1.
- SEO: the profile canonical and its JSON-LD `url` / `@id` now use the profile's own site (`FF_SEO.profileOrigin = https://ffteam.uk`) instead of ffparty.uk. Title and meta description come from the same validated facts as the introduction (the AI's `seo_title` / `meta_description`; for a manually edited introduction the description is the first paragraph). ProfilePage JSON-LD keeps the same name, job title and URL as the page.
- The people on the sample directory show a composed preview (no AI) so the section can be reviewed everywhere. These people are fictional and are never indexable (`FF_SEO.demoData`).

## Code map (source/fireflair-app.jsx)

`FI_*` constants and `fi*17` functions sit directly above `PublicProfileBody`. `FireFlairIntroductions17` renders the section, `IntroEditor17` the owner editor, `ProfileH117` the H1, `ffIntroSeo17` the title/description, `ffSeoProfileUrl17` the canonical. Publish uses `saveWithIntro17`. The stored object is `profile.introduction`: `{ status, source (automatic | fallback | manual), paragraphs[{text, source_field_ids}], seoTitle, metaDescription, revision, hash, promptVersion, edited, generatedAt, notes }`. The prompt is `FI_PROMPT`; the checks are `fiValidate17`.

## What the real site needs

1. **Server-side generation.** Run the same snapshot, prompt and validation in the Publish request, with a short timeout and the deterministic fallback. Keep the browser out of it. Store the introduction, its source field ids, the profile revision, prompt version and failure reason with the profile.
2. **Public data only.** The snapshot must contain only fields the owner has made public: no phone, e-mail, private notes, hidden or unaccepted records.
3. **Server-rendered HTML.** The introduction, H1, title, meta description, canonical and JSON-LD must be in the HTML a crawler receives (SSR or prerender), not added by script. Profiles should be in the sitemap with a correct lastmod, and the sitemap should only list published, public profiles.
4. **Crawler access.** Allow search and AI-search crawlers on public profiles, including OAI-SearchBot, Googlebot and Bingbot, and check robots.txt and any bot protection do not block them.
5. **Canonical per site.** A profile canonicalises to its own site. Confirm the domain with Alex before launch. The share link shown in the editor (`CARD_DOMAIN`, currently ffparty.uk) is a separate setting and was not changed.
6. **Locations.** The prototype uses only the work areas the owner confirmed. Optional later step: a geocoder can suggest nearby areas for the owner to accept one by one. Suggestions must never be published or used in the text unless accepted.
7. **Validation to keep.** Heading text exact, profile revision matches, every source field id exists, no URLs, e-mails, phone numbers, prices or HTML, no unsupported superlatives or guarantees, the person's name in the first paragraph, length limits. Schema-valid is not the same as true, so the owner can always edit.
8. **Privacy and notice.** The "AI-assisted summary of this profile." line shows only on automatic, unedited text. Review wording and consent with the owner of the privacy policy.

## Not done in the prototype

Server generation, persistence, SSR, sitemap, robots changes, geocoder suggestions, admin review, analytics and automated tests in the real codebase. The two acceptance paths exercised here were run in a headless browser with a mocked AI connection: successful generation, API failure to fallback, invalid reply to fallback, duplicate and concurrent publishes, stale discard, manual-edit preservation and the SEO self-test.

Out of scope: location directory pages and the Stories rewrites.
