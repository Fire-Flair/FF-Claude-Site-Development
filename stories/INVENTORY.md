# FireFlair Stories: inventory, decisions and handover (draft 1, 7 Nov 2026)

Base: fireflair-v17.3.93 (JR17 holds 21 editorial stories, ordered per site by JR17_ORDER; Journal17 opens them in a Sheet with local state).
Brief: "FireFlair Stories: research and implementation prompt" (7 Nov 2026).

## Decisions taken with Alex (7 Nov 2026)
- Build across all three sites in prototype phase 2, FF Party first for SEO (B2C search), FF Team for job seekers, FF Staff lighter. Backlinks between the sites are wanted.
- Fee figures may appear in the cost and refund articles, framed as first-year launch pricing that stays fixed for loyal users. Final wording, VAT presentation and the "fixed for loyal users" terms still need approval before publication.
- Business site name: the prototype uses FF Staff in current story titles (v17.3.93 "How to book staff on FF Staff"). Used FF Staff. Canonical domain not confirmed in the repo: to be set from approved configuration.

## Existing 21 stories: action
| Existing id | Action | Destination |
|---|---|---|
| sidehustle | Rewrite, remove unverified quotes | T18 |
| workteam | Expand, separate exclusive vs Autofill, check 30-day reminder | T03 |
| bookstaff | Update | B01 |
| securestaff | Merge with whyparty | P01 |
| wedding | Expand | P08 |
| howmany | Expand with assumptions, own on FF Party | P05 |
| cocktails | Merge with menuparty | P10 |
| launch | Expand | B10 |
| profile | Expand | T02 |
| shifts | Rewrite | T10 (work-finding to T01) |
| sites | Consolidate | T16 |
| cards | Distribute | T03, B01, P01 |
| whyparty | Merge | P01, P03, P04, P10 (correct instant-confirmation and 24-hour claims) |
| menuparty | Merge | P10 |
| cardsparty | Merge useful material | P03, P13 (verify tiers first) |
| whybiz | Rebuild | B14-B17, B01, B18 |
| signbiz | Hold | C12 (conditional) |
| cardsbiz | Rewrite | B16 |
| whyteam | Consolidate, drop unsupported £15/£30 comparison | T16, T01, T05 |
| menuteam | Expand | T17 |
| cardsteam | Merge | T03 |

## Batch 1 (this commit): FF Party Priority A
P01, P02, P03, P04, P05, P06, P10, P17, P23. Files in stories/ffparty/.
Remaining Priority A: T01-T05, T13 (FF Team); B01, B02, B03, B07, B18 (FF Staff).

## Unmet publication conditions (batch 1)
- P02: dated supplier price examples (S21, S26, S29) were not in the brief's text; add after a live check of those pages. Article currently explains cost drivers and FireFlair's own charge only.
- P04, P17: the scope of complete bar companies in the FF Party network must be confirmed before the "what FF Party covers" paragraph goes live; wording is written conditionally.
- P05: staffing ratios need experienced-bartender review before publication.
- P10: confirm whether the menu basket records preferences, quantities or a paid order.
- P23: post-confirmation cancellation wording is not stated because it is not approved.
- All competitor facts were taken from the brief's 7 Nov 2026 research; recheck on the day of publication.

## Technical state (not yet done)
- Real /stories/{slug} routes need hosting or prerendering work; the prototype is a single compiled page.
- The compiled page cannot be rebuilt from source/fireflair-app.jsx in this environment (the source has image markers, and the build step is not in the repo), so the template and reader changes are specified, not yet shipped.
- Pushing to GitHub is currently refused for this session (Claude GitHub app not installed for the organisation).
