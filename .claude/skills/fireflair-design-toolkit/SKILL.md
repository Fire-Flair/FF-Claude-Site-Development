---
name: fireflair-design-toolkit
description: FireFlair design guard. Read FIRST for any FireFlair design, redesign, UI build, layout, card or page review, and before using design-taste-frontend, web-design-guidelines, image-to-code or playwright-cli on FireFlair. Sets FireFlair's design system as the source of truth and the picture-first workflow.
---

# FireFlair design toolkit (guard skill)

## Source of truth (highest first)
1. Alex's instructions in the current conversation, quoted word for word.
2. This repo: CLAUDE.md, docs/, `src/` (tokens in `src/styles/tokens.css`), CHANGELOG.md, and the approved pictures Alex has signed off.
3. Alex's standing rules below.
4. Third-party skills and DESIGN.md references: checklists and ideas only. They never override 1–3.

## Standing FireFlair rules
- Colours: gold #C9A227, burgundy #5C1220 (always "burgundy", never "oxblood"), cream #F4EFE4, black #0B0B0C. Gold fills for action buttons. A new raw colour needs a token first.
- Fonts: Cinzel (display, names) and Inter (everything else). Never a third font, never italic serif.
- Squircle corners everywhere — buttons, tabs, boxes, tiles. No ovals/pills unless Alex asks.
- Never split a word across lines; wrap between words, shrink the font if a word doesn't fit. Never "…" or "/" cut-offs: leave a whole entry out instead.
- Horizontal rows scroll LEFT/RIGHT only; never let a row or tab bar scroll vertically or jump up and down.
- Collapsible boxes collapsed by default unless Alex says otherwise. No instruction text telling people what to tap — BUT keep every description Alex has asked for (FF Tag, Phone number, Media, Venues line). Never remove a description or section without being told.
- One clear action per thing: never two X icons with different meanings; no "Add a …" button rows when a type box will do (type, press Enter, it's added).
- Addresses written FFTeam.uk / FFParty.uk (FF + capital first letter). No prices anywhere.
- Photos: never crop heads; no photo used twice on a site; no AI-generated people.
- Phase 2 = FFTeam.uk version 1.1. Version numbers go 17.21, 17.22… (no strings of ones).

## Tool roles
- `web-design-guidelines`: rule audit of the changed files (`file:line`). Pinned rules: `.claude/fireflair-toolkit/guidelines/vercel-web-interface-guidelines.md`.
- `design-taste-frontend`: critique only (hierarchy, spacing rhythm, alignment, "slop" patterns). Never its dealing/generation scripts.
- `image-to-code`: only with reference images Alex supplies; extract layout/spacing/type, implement with FireFlair tokens.
- `playwright-cli` (or the repo's Playwright scripts): render at 390×844 portrait, 844×390 landscape, 768 and 1280/1440; check overflow, scroll axis, tap targets ≥44px, contrast, focus, console errors.
- `.claude/fireflair-toolkit/references/awesome-design-md/<brand>/DESIGN.md`: structure and ideas only; never copy another brand's colours or fonts.

## Workflow (mandatory for any visual change)
1. Benchmark: render the current page AND the last version Alex liked (from git history) side by side.
2. Picture first: render the proposed design as full-size screenshots (portrait + landscape) and get Alex's approval BEFORE writing production code. Mark anything that is your own idea as a suggestion.
3. Plan quotes Alex's words next to each item. Small batches, one area at a time.
4. Review against the approved picture, Alex's words, this rule list and the web-design-guidelines audit; test interactions (scroll axis, taps, Enter to add, drag) — not just static screenshots.
5. Only then publish/push per the repo CLAUDE.md.
