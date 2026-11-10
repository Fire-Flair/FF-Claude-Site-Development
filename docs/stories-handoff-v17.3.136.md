# FF Stories: footer, attribution and November batch (v17.3.136)

## For the agency
Reader footer (all three sites share one component, `ST19_Footer` in `scripts/stories-reader.js`):
1. Reader Q&A: exactly three questions per article, each with two answers plus "Something else" (optional text, max 500 characters, plain text, sent only when "Something else" is chosen). Partial answers are allowed. Questions are AI-generated and reviewed against the article; each set carries a revision id (`r1`) and `ai: true`.
2. One primary call to action, from the article's `cta` front matter.
3. People and sources: Written by, Posted by, Featured (only if the profile resolves), Sources.
Roles: author (`author`), posted by (`posted_by`), featured person (`featured`, keys in `profiles.json`). JSON-LD uses a Person author for named bylines and Organization otherwise. No FAQPage markup.
Persistence in the prototype: answers live in `window.__ffStoryFeedback` for the browser session only and the footer says so. Production needs: an endpoint taking `{submissionId, slug, site, revision, ai, submittedAt, answers[{id, question, answer, other}]}`, idempotent on `submissionId`; a reader identity decision; retention for free text; spam control. `window.__ffStoryFeedbackFail = true` forces the retry state for testing.
Profile cards: needs a public profile URL scheme and a resolver. Until then featured people render no card.
Data to build: `stories/*/*.md` + `qa.json` + `profiles.json` + `images.json` -> `scripts/build-stories.py`.

## Review report
1. Shared functionality: built and verified in the prototype on all three sites. Backfill of 79 legacy stories is not done (no question sets); audit in INVENTORY.md.
2. Treatments:
| Ref | Site | Slug | Byline / posted by | CTA | Status | Evidence to lift a hold |
|---|---|---|---|---|---|---|
| T1 | FF Team | last-minute-bartending-shifts | Alex Gagnon / editorial team | Create your FF Team profile | Shipped | Alex to approve the first-person byline and the "short-notice" framing (from the brief, not the transcript) |
| T2 | FF Team | private-cocktail-booking-pay | - | - | Held | Booking records, pay structure without figures |
| T3 | FF Team | who-would-you-call-for-a-bar-shift | Editorial team | Create your FF Team profile | Shipped | Confirm the described add/review/invite flow against live v1.1 |
| T4 | FF Team | ff-team-launch-competition | - | - | Held | Terms, dates, entry route, scoring, prizes |
| T5 | FF Team | three-questions-behind-the-bar | - | - | Held | A real, consented interview |
| S1 | FF Staff | small-cocktail-event-profitability | Editorial team | Create a staffing request | Shipped | Worksheet is qualitative; real figures would need Alex's records |
| S2 | FF Staff | bartender-decisions-company-booking | Editorial team | Create a staffing request | Shipped | Scenario is labelled illustrative |
| P1 | FF Party | when-to-serve-cocktails-at-a-party | Editorial team | Explore FireFlair Packages | Shipped | "My own work with house parties" wording needs a named voice or rewording |
| P2 | FF Party | choose-a-signature-cocktail-for-your-party | Editorial team | Explore FireFlair Packages | Shipped | - |
| P3 | FF Party | cocktail-party-timeline | Editorial team | Explore FireFlair Packages | Shipped | Times are an example |
3. Unresolved: Alex's public profile reference (none found on ffteam.uk; the in-app founding profile is demo data); booking figures; an approved interview; competition terms; audio check of quotes. Quotes are used as attributed paraphrase only (transcript refs Q12-Q15 in T22); Q01-Q16 are unverified against audio. Three briefed pieces ("What Makes a Shift Work for You?", the smaller-events research piece, "Why I Wanted Hosts to Speak Directly to Their Bartender") have no matching existing article, so the links were omitted.
4. Verification: Playwright at phone size on all three sites: three fieldsets and nine radios; send disabled until one answer; keyboard selection of "Something else"; text kept after a failed send, retry succeeds, single record per submission; partial answers; CTA works with nothing answered and goes to the right flow; no console errors; no horizontal overflow on the table article.
