# FireFlair prototype — changelog

## v16.12 — 2026-10-15 — FF Staff Event Card, booking bar, company profile
Artifact version 1792072685-c201 · file `fireflair-v16.12.html`

- Definitions: FF Team is for freelance hospitality staff; FF Staff is for hospitality businesses of all kinds and is where they hire staff for their events. Updated in the sites menu (FF_SITES), the FF Team and FF Staff sections on Home, the FF Staff home page, the map legend and the SEO description.
- FF Staff home: the Event Card is now made on the page itself (StaffEventSection / StaffEventCard), no separate "create event" screen. It follows the Shift Card picture: white card, black "Event Card" tab, FF coin, rows with black icon tiles (date, time, venue, company/client, dress code, guests and team), notes, and a black WhatsApp footer with a QR code. Typed straight onto, then saved; Edit and New Event Card under it. The old eventNew route lands here.
- Booking bar (BookingBar) replaces the basket count. Works like the XP bar: fixed at the bottom on phones (stacks above the XP bar when both show), a row under the menu bar on desktop (stays when the XP row hides on scroll). Shows the Event Card as a small card (or a dashed blank card where it will go), then a small card for each person added. Appears once there's an Event Card or anyone in the basket.
- Drag and drop on desktop: Profile Cards on FF Staff home are draggable (dragPerson); dropping on the booking bar adds that person (new SELECT_ADD action). The bar shows a "Drop" slot while dragging. The drag state change is deferred a tick so Chrome doesn't cancel the drag. Phones tap instead.
- FF Staff company profile rebuilt on the FF Team Profile page pattern and card system: 1 Join FF Staff (company name and page address instead of an FF Tag, phone verified on WhatsApp, new COMPANY_SIGNED_IN action), 2 Company Card typed straight onto (logo upload, name, what you do, location, colour), 3 FF AI (proposes card and profile, approve before saving), 4 company profile as cards, then Save & Share and Section 5 (Welcome to FF Staff: Create an Event Card, Add FF). All on the Profile tab; CompanyEdit screen removed and every "Create/Edit Company Card" link now opens the Profile tab.
- Company information uses the same records and card editor as FF Team: company.records, with REC_* actions carrying owner "company" (reducer re-runs them against the company's records). Categories in COMPANY_CATEGORIES: services, service locations, venues, documents, contact & social. T&Cs/NDA show as cards ("Sent with every booking"), hiring questions as Question Cards (new gold "hiring" colour), reviews as cards, regular team as Profile Cards. companyDocs() / companyLocations() merge the older company.documents / serviceLocations fields with the new records.
- Information Cards redesigned: square with rounded corners (22px), calmer and closer to Apple's style, no grain. Label at the top, then the title, then either the description (up to four lines) or up to four images (1, 2, 3 or 4-image layouts). Profession Cards keep their five level diamonds in the top row. MAX_MEDIA_PER_CARD is now 4 and Qualifications can carry images too. Add tiles are matching dashed rounded squares.
- Account menu shows the company name and page address when on FF Staff.
- Tested headless at phone and desktop widths: Event Card create/view/edit, booking bar (tap, synthetic drag and drop), Event page, company join/card/FF AI/cards with images/save/welcome, square cards on FF Team. SEO self-test 36/36, no page errors.

## v16.11 — 2026-10-15 — Two-way Add to team, Section 5, Publish
Artifact version 1792070271-02de · file `fireflair-v16.11.html`

Network: two-way "Add to team" with a review, and Ask a question on FF Team. Profile page: Section 5 on the left line, card creator cleaned up, levels on Profession Cards, Publish on FF Party.

How the network works (Alex's answer to the developers' questions):
- You add people to your network, you review them, and they are invited to join your team. It is a two-way confirmation: nobody is connected until the other person accepts.

For the developers:
- Person profile (from Network): the Back button at the top stays. On FF Team (and for guests) "Add to basket" is replaced by "Ask a question", which opens the existing Ask a question sheet and adds a Question Card to their profile. FF Staff keeps Add to basket.
- "Add to team" opens a sheet like the review box: "Have you worked with [name] before?" Yes/No, "Would you like to work with [name] again?" Yes/No, "How is [name] to work with?" (Excellent, Great, Good, Could improve; only when they have worked together) and a free-text review (a note instead when they haven't). Add is enabled once the questions are answered.
- Add shows a confirmation: "Your team invitation and review will be sent to [name] on WhatsApp. [Name] will be notified that you'd like to add them to your team. You're connected once [name] accepts." Send invitation / Back.
- Sending stores a team invitation (state `teamInvites`, action `TEAM_INVITE`, persisted) with status "pending": the answers, the how-to-work-with label mapped to a 1-5 rating, and the review. The button then reads "Invitation sent" with a waiting note.
- When they accept (`TEAM_INVITE_ACCEPT`), they join your network (connections) and, if you've worked together, the review is posted to their profile. The prototype has a "Preview: [name] accepts" link to show this; the real accept comes from their WhatsApp notification. Core should require a signed-in sender and send the WhatsApp message.
- Previously "Add to team" connected people instantly (`CONNECT`); that button no longer does.
- Profile page, Section 5: the 05 marker now sits on the left-hand line, level with the middle of Save & Share, with the line and three dashes running down beneath it. The journey line continues from Section 4. After Save, the page extends and "Welcome to the Team" opens with its marker on the same line (`ff-s5row`, `ff-s5mark`, `ff-s5open`). Save & Share now lines up with the section column.
- Profile Card creator: removed the second FF Tag under Professions (the footer keeps it) and the five level diamonds. The label is just "Professions". The colour picker is unchanged.
- The finished Profile Card no longer shows five level diamonds under the title either; it has the single brand diamond on the gold rule, so creator and card match.
- Profession Cards: the profession's level (record.level, 1-5, chosen in the card's editor) shows as five diamonds top right, grey until filled. Demo people show their level on their top profession.
- Section 5, Welcome to the Team: the card, then the main button "Publish on FF Party", then Add FF, then Add to Apple Wallet and Add to Google Wallet.
- Publish sets `profile.published` / `publishedAt` (and the publish XP, once) and opens a pop-up: "We've published your profile as a website", a "Click here to view it as a guest" button, and the note "For now we're publishing on FF Team, to help build the network. Once FF Party goes live, your profile will be ready for B2C bookings." Afterwards the button reads "View my published profile".
- Guest view of your own profile: `VIEW` with `guest: true` sets `viewingAsGuest`. It shows the public layout (no editing, no hidden or proposed cards, your own network) under "This is your profile as a guest sees it", with "Back to my profile".

## v16.10 — 2026-10-15 — Sticky desktop bar, new arrow
Artifact version 1792058955-7aba · file `fireflair-v16.10.html`

Desktop menu bar stays on screen; new dropdown arrow.

For the developers:
- Desktop (900px and wider): the menu bar (FireFlair menu, Home / Network / Bookings / Profile, coin, Add, Log in/out) now stays at the top of the screen while scrolling. It was always meant to be sticky, but `overflow-x: hidden` on the `.ff` wrapper made it a scroll container, which stopped `position: sticky` working. The wrapper now uses `overflow-x: clip` (with `hidden` kept before it as a fallback for older browsers); it still stops the page scrolling sideways.
- Desktop: the XP row under the menu bar hides once the page is scrolled down (past 120px) and comes back near the top (above 20px). The gap between the two stops it flickering as the row collapses. If someone has a basket, the basket row stays so "Build team" is always reachable. State: `scrolled` in `Shell`, passive scroll listener.
- Phones: the top bar is no longer sticky and scrolls away with the page, because the bottom nav with the five icons is always on screen and already gives the way between pages and the coin. The phone XP and basket bars at the bottom are unchanged.
- The dropdown arrow beside FireFlair (top left) is now a larger plain triangle pointing down, drawn as a small SVG, with no circle round it. It still turns over when the menu is open.
- The sticky bar uses `top: env(safe-area-inset-top, 0px)` so it clears a phone's status bar in the app.

## v16.9 — 2026-10-15 — Sites menu, Event Card, FF VIP
Artifact version 1792058542-6c88 · file `fireflair-v16.9.html`

Header, Home and FF Party changes across the site. The top-left FireFlair menu is now a standing rule for every FireFlair site.

For the developers:
- Top-left FireFlair button (every site, signed in or out): opens a "FireFlair sites" menu listing FF Team, FF Staff, FF Party and FF VIP with their domains (ffteam.uk, ffstaff.uk, ffparty.uk, ffvip.uk). The current site is marked "You're here". One list, `FF_SITES`, drives the menu and the closing section on Home; add a row to add a site. On the real sites each row is a link to its `url`. In the prototype FF Team and FF Staff switch role; FF Party and FF VIP open their section on FireFlair Home (`useGoSite`). Signed in, the menu still shows the name, tag and "FF Tag & sign-in". Escape closes it.
- Desktop header: Home, Network, Bookings and Profile now sit in the centre of the bar (three-column grid). The XP coin, Add and Log in/Log out moved to the right-hand group. Phone bottom nav unchanged.
- Buttons: the standard button is now a light gold gradient instead of cream. Black (primary) is unchanged; cream stays the page background. Each button kind keeps its own colour on hover (fixes primary, ghost and on-dark buttons turning cream on desktop hover). Home jump links are light gold too.
- Home intro: Connect, Take reviews and Take bookings are one three-step journey. Their marks are drawn (`PromiseMark`), not taken from the icon library, in matching burgundy medallions, joined by gold diamonds. Rows on phones, cards from 640px.
- FF Party, step 1 "Search FireFlair for your team" (was "Search the FF Team") now comes before the Event Card. Each result has "Add to my Event Card"; the people added show in a tray and on the card.
- FF Party, step 2: the side form and preview are replaced by the ffme.uk card builder, used the same way as the Profile page: you type straight onto the Event Card (name, line under the title, note, guests, venue, area, date, start and finish times, your name). Occasion and roles are chips under the card; backgrounds are round swatches (Onyx, Ivory, Burgundy, Gold Confetti, Champagne). "Your team" on the card shows the people added and an open place for each role nobody covers yet. Component: `EventPoster` (CSS `.ff-ec-*`, sized in cqw like the ffme.uk Invite Card). The FF mark carries a spade, matching the Ace of Spades Event Card on the flyer. Saved cards keep all fields plus `team` (person ids) in `partyEvents`.
- Training: easier to read. Stronger borders, a gold label band for the kind, bold titles, darker text and a clear "I'm interested" footer on each option. Multiple choices still work.
- Signed-in visitors don't type a WhatsApp number on Training, the Event Card or the FF VIP list. They see "Signed in as TAG" and confirm (`signedInAs`, `SignedInContact`). Signed out, the number field is unchanged.
- FF VIP rewritten. For the people who book the most (yearly Christmas and summer parties, regular staff bookings): a VIP profile with preferences, a regular team, suppliers added by phone, Event Cards and invoices for everything with the whole party on a single invoice; invitations worth having; favourite cocktails and an About you section later. VIP Experiences (not "venues"): package bookings at bars, restaurants, spas and wellness venues, also used as FF Team rewards; the venue is briefed before arrival so something is ready (champagne or favourite drinks); at select venues you choose your private bartender and waiter. New "Join the FF VIP list" form: state `vipInterest`, action `VIP_INTEREST`, persisted. Anchors `ff-vip` and `ff-vip-join`; FF VIP added to the Home jump links. Home FF AI sends VIP and experience questions there.
- Closing section: "Join them." and the two role cards are replaced by "Find your place on FireFlair": one card per FireFlair site with a way in, plus "See a finished profile". Two across on phones, four across from 760px.
- New colour alias `--burg` for burgundy, used by the new code.
- SEO self-test still passes 36/36. No change to routes, sign-in, profile editing, XP or FF Staff booking.

## v16.8 — 2026-10-13 — Home: FF Party, Training, Festivals
Artifact version 1791913778-7ac5 · file `fireflair-v16.8.html`

Home rebuilt as FireFlair's main selling page. It is the first page people see, so it now introduces everything FireFlair offers, in this order: what FireFlair is, FF Team, FF Party, Training, Festivals, FF Staff, FF VIP, then the map and the join cards. The same sections show on FF Team Home when signed in.

For the developers:
- Intro (from the coming-soon page): "The event connection platform", the three promises (Connect, Take reviews, Take bookings) and jump links to each section. Sect now takes an `id`; section anchors are ff-team, ff-party, ff-training, ff-festivals, ff-staff.
- FF Team: four example Profile Cards (labelled as examples; the full people wall stays on Network), why join, and a Create your Profile Card button.
- FF Party: the three steps, an Event Card you fill in on Home with a live preview (occasion, date, guests, area or venue, who you need, WhatsApp number). Saving stores the card as a lead (FF Party stage 1); bookings open with FF Party 1.0. New state `partyEvents`, action PARTY_EVENT_SAVE.
- FF Party search: clients search FF Team members by skill, interest, qualification, language or area, with results as bookable Profile Cards. One shared `personSearchText(p)` now powers this and the Network search, which also gained interests, qualifications and languages.
- "Found wherever people search": FF Party is where the public Profile Card pages live, written for Google and AI assistants like ChatGPT. Wording is aspirational, not a ranking promise.
- Service Cards (coming soon) moved into the FF Party section, with the Party > Service > Review > Rebook line.
- Training: eight training types (Introduction to Cocktails, Mixology, WSET Spirits, WSET Wine, spirit brand training, FireFlair Open Class, FireFlair Open Bar, FireFlair Masterclass). Tap to mark interest, then Register interest with a WhatsApp number. New state `trainingInterest`, action TRAINING_INTEREST. The separate Training feed row on FF Team Home was removed, as this section replaces it.
- Festivals 2027: complete teams. Work festivals and other jobs with friends as one team. Shows an example team, Join FF Team and Invite a friend. Signed-in FF Team members get the Festivals 2027 wish list (ShiftRequests) right there. Team booking itself is marked coming soon.
- Home FF AI now sends events to FF Party, training to Training and festivals to Festivals; actions are Join FF Team, Plan an event, Training, Hire staff.
- Demo people now carry qualifications (WSET, Personal Licence, Food Hygiene). They show on their profiles and are searchable.
- WhatsApp numbers: the prototype stores only a masked copy (last three digits). The real site sends the full number to Core with the person's WhatsApp opt-in.
- Brand rule: the card theme previously keyed with the other word is now `burgundy` / "Burgundy". A profile saved with the old key falls back to Burgundy on load.
- SEO: home meta description and the text crawlers read before scripts run now mention FF Party, training and festival teams. The SEO self-test still passes 36/36.

## v16.7 — 2026-10-13 — SEO metadata module and accessibility pass
Artifact version 1791884567-4c1f · file `fireflair-v16.7.html`

SEO and accessibility pass — no change to look, routes, sign-in, profile editing, XP or cards.

For the developers:
- New SEO module (FF_SEO, ffSeoFor, ffSeoApply, ffSeoValidate, ffSeoSelfTest) builds title, description, canonical, robots, social tags and JSON-LD for each view and writes them to the head. Port it as the metadata layer of the real site; it is plain JS with no dependencies.
- Only signed-out Home is indexable. Signed-in and guest screens are noindex. A Profile Card is indexable only when person.public === true, it has a tag and FF_SEO.demoData is false (the sample people here are fictional, so it is true).
- Published cards get ProfilePage + Person JSON-LD built from the fields the card shows; never phone or e-mail. No dateModified is invented — Core must supply createdAt / updatedAt (ISO) if wanted.
- In the real site these tags must be in the server-rendered HTML, and each Profile Card needs its own URL (/TAG). Search engines may not honour a noindex or canonical that is only added by script.
- Home description now fits the 160-character limit; home title unchanged. Twitter card changed to "summary" because there is no share image yet; add a real 1200x630 image URL and switch to summary_large_image.
- Landing HTML now carries readable text before scripts run (replaced on first render).
- Headings: Home and signed-in Home FF AI title is now the page h1; the person page name is an h1 (PlayerCard nameAs prop, FFAI titleAs prop). Defaults unchanged.
- Accessibility: skip link, main landmark id, labelled navs, aria-current on the active tab, text alternative on profile photos (they are CSS backgrounds).
- Self-test: window.__ffSeo.selfTest() checks every screen and production-mode cases (36 checks).
- Hook point for analytics: FF_SEO.onView(seo). Nothing is sent from here.

## v16.6 — 2026-10-09 — FF AI CV reading tuned on real CVs
Artifact version 1791554187-acd6 · file `fireflair-v16.6.html`

FF AI CV extraction tuned against the five real CVs Alex supplied: Alexandru Gavrilas (regression CV), Hemant Shah, Marco (Word) and the two Mixology editions. The CVs themselves are not in this repo.

What changed
- Skills: one item per distinct skill, near-synonyms merged, and not every duty turned into a skill. On the regression CV this cut skill suggestions from 21 to 17, and on the Word CV from 39 to 32.
- Evidence quotes never carry phone numbers, emails or street addresses (these were showing up on location items).
- A name written in capitals on the CV ("ALEXANDRU GAVRILAS") is proposed in normal case ("Alexandru Gavrilas").
- Prompt wording for one page / one picture ("Picture 1 shows page 1…") and the photo line in the review ("From page 1 of your CV").

Regression result: Alexandru Gavrilas CV, through the app with a stand-in Claude answering the app's own prompts
- 64 suggestions. All 13 checks pass:
  - 7 employment entries, each with employer, title, dates, location and responsibilities.
  - Freelance section kept separate with Soho Mews House, The Roof Gardens, 77 Nightclub and Oriole.
  - All 10 interests (cooking, running, swimming, marathon, half marathon, shorter races, Ironman goal, drinks, team development, memorable guest experiences).
  - 7 professions and 17 skills.
  - WSET Wine & Spirits Level 2, plus flair/bartending courses and seminars/masterclasses.
  - Romanian Native and English Fluent.
  - Education.
  - Profile summary as About.
  - Achievements.
  - His portrait was found inside the PDF, proposed, and saved as the profile photo.
- 0 items rejected by validation. No duplicates when added twice.

Other CVs
- Hemant Shah (2-page PDF, no photo): 93 suggestions, including 12 jobs, 9 achievements and 4 degrees.
- Marco (Word): 67 suggestions, including 7 jobs and 3 languages.
- Mixology 5.1 (2 pages, logo grid): 123 suggestions, including 26 venues read from client logos (marked "check this") and a photo proposal.
- Mixology 5.0 is read identically.
- No errors on any of them.

## v16.5 — 2026-10-09 — FF AI reads CVs: extraction + review
Artifact version 1791552281-a5e0 · file `fireflair-v16.5.html`

FF AI now really reads a CV (PDF, Word, a photo or text) — every page — and turns it into editable profile suggestions. Nothing is saved until the person adds it.

Why
- The old FF AI was a keyword matcher (profileFromText) and the CV adapter was a mock that always said "not connected". That is why interests, descriptions and job history were missed and only a handful of items came back.

Pipeline (section 4, SERVICES — FF AI profile extraction)
- CV_READER.read(file): PDFs through pdf.js (pdfjs-dist 6.2.108, legacy build, loaded from jsDelivr only when a PDF is read; parsed on the page, no Worker). Text page by page in reading order, sections kept; each page is also pictured for the AI (layout, columns, scans); pictures inside the PDF are found from the drawing operations and cropped as possible profile photos. Word (.docx) is unzipped in the browser (DecompressionStream) — paragraphs, headings, bullets, tables, text boxes, headers/footers and embedded pictures. Photos of CVs go to the AI as pictures (it reads them). Text files as text. Old .doc and unknown types get a clear message.
- CV_ADAPTER.extract(doc): two FF AI calls run side by side (work history; profile details), each with the whole CV. The CV is wrapped as untrusted data and the prompt forbids following anything written inside it. Typed "Tell us about yourself" text uses one call.
- In this prototype FF AI is Claude through the artifact's `sample` capability (the viewer's own Claude account; no key in the page). The artifact now declares `sample` alongside `db`.
- validateExtraction(): every item is checked against the schema (category, title, description, evidence, confidence, page, proficiency, details: employer, location, start, end, venues, level, issuer, group). Failures are counted and listed, never silently dropped.
- buildSuggestions(): semantic de-duplication (case, punctuation, &/and, plurals, word order, bracketed notes) inside the result and against the profile. Distinct activities stay distinct (Running is not Marathon Running).
- extractionReport(): what was read, statuses (extracted, needs confirmation, unreadable, rejected by validation, duplicates merged, already on profile, failures), per-category counts, timings. Logged to the console as "[FF AI] extraction report" and shown under "How FF AI read this".

Review (ExtractionReview, used by both FF AI and the CV panel)
- Replaces "Found N things": "FF AI found N suggestions" where N is exactly what is listed. Grouped by category with counts and Tick all / Untick all; every item can be ticked, edited (title, employer, location, dates, level, description, and where it's saved) or removed. Employment shows employer · place · dates, freelance shows its venues, each item shows the CV quote it came from, and anything not clearly stated is marked "Check this".
- Proposed profile photo: preview, drag to move, zoom to crop, "Not me". Ticked only when the profile has no photo; otherwise it says it would replace the current one and stays unticked.
- Name (only when the profile has none) and the CV's personal summary as About.
- Things already on the profile are listed separately; if FF AI found details a card is missing, it can fill those EMPTY fields only (new RECORDS_FILL action). RECORDS_MERGE now uses the same semantic match so it never adds a near-duplicate card.
- When FF AI isn't available in a view (or the viewer declines), the old matcher is used and the review says so plainly.
- Progress with Stop; clear messages and a manual Try again for busy, failed or unreadable documents; a scanned CV in a view that can't send pictures is told so rather than returning nothing.

Profile
- New About section (profile.about) at the top of the profile, editable; shown on public profiles too.
- Information Cards show the CV details line (employer · place · dates, or a language's level as written); the card sheet shows and edits those details (record.details, with details.type = employment / freelance / education / achievement …). Venues get their location as the address.
- CV panel: "FF AI fills in your profile from it — PDF, Word or a photo." After upload FF AI starts reading; a saved CV has "Read with FF AI".

Tested in the built page (headless Chromium, phone and desktop)
- A synthetic two-page CV (7 jobs, freelance section with venues, interests in the summary and closing lines, WSET Level 2, flair courses, Romanian + English, education, portrait + logo) as PDF, Word and a photo; prompts recorded from the app and answered by a stand-in Claude, then replayed through the app: all 17 checks pass (all 7 jobs with details, freelance + venues, all 10 interests incl. Ironman goal, WSET, courses, languages with levels, education, About). Adding twice creates no duplicate cards and never overwrites an edit.
- Failure cases pass: FF AI absent or declined (fallback, labelled), busy (message + manual retry, no automatic retries), one call failing (partial result, flagged), Stop, picture-only CV without vision, damaged PDF, invalid items rejected and counted, oversized document cut to fit and flagged.
- Not testable from here: live FF AI answers in the published page (needs the viewer's consent), and the real Alexandru Gavrilas CV (not received yet).

Backend
- FireFlair-Backend gets the same contract on OpenAI as a separate pull request for Griffy (key in Render's environment only).

## v16.4 — 2026-10-09 — Q&A: green answered cards, two sides, shuffled
Artifact version 1791549316-6309 · file `fireflair-v16.4.html`

Q&A section: answered questions feel like an achievement, sit on their own side, and the order changes each visit.

Answered state
- Answered Question Cards turn green (QUESTION_DONE colours) with a green outline and a large green tick badge top-right, replacing the small tick.
- Answering a question for the first time plays a completion animation on that card: the card pops, a large green disc draws a tick, a ring pulses out with a few gold sparks (about 1.5s). Editing an existing answer doesn't replay it. Reduced-motion settings switch the animation off.
- The green state comes from the saved answer, so it's there on every visit.

Two sides
- One row, split by an "Answered" divider: unanswered on the left, answered on the right. Labels above: "To answer · n" and "Answered · n" (tap to jump to the answered side).
- Answering moves the card to the right side straight away and scrolls the row to it while the animation plays.
- Empty states: "Answered questions move here." / "All answered — nice work."

Order
- Each side is shuffled independently once per visit to the Profile page (ProfilePage calls resetQuestionOrder on mount) and stays still while the person is answering. Display order only — answers and completion are never changed.

Wording
- The "Generic" question group is now labelled "Freelancer" everywhere it shows (the internal key stays "generic").


## v16.3 — 2026-10-09 — Profession levels; public profile order + Ask a question
Artifact version 1791501889-f4bd · file `fireflair-v16.3.html`

Two focused additions: a level on each Profession Card, and a new section order for someone else's profile.

Profession level (Profession Card editor)
- New LEVEL field when creating or editing a Profession Card: five boxes, 1 Apprentice, 2 Developing, 3 Professional, 4 Expert, 5 Master. The chosen one is black/gold; tap it again to clear.
- One short line under it: "Profession level helps FireFlair connect Masters with Apprentices for training and development."
- Stored per profession as record.level (1–5, null until chosen); each profession has its own level. Constants: PROFESSION_LEVELS / professionLevelTitle.
- Never shown on the Profile Card, on profession cards, or to visitors (the field only appears in the owner's editor). Purpose: later Master <-> Apprentice training and mentorship matching in FireFlair Core.

Someone else's profile (PersonProfile / ProfileSections when isMe is false)
- Section order: Media, Network, Reviews & References, Professions, then the rest (qualifications, skills, interests, work locations, languages, experience, venues). Empty sections stay hidden, as before.
- Q&A is always the last section. "Ask a question" opens a sheet; the question becomes a Question Card on that person's profile (state.profileQuestions: { id, personId, text, askedAt, by, answer }). In this prototype it shows as "Sent to <name>"; Core needs to deliver it and supply the answer (from the person, or from FF AI using their profile).
- Book · Review · Join moved from under the card to the very bottom, below Q&A (same behaviour, now a shared ProfileActions component).
- Your own profile keeps its existing order.


## v16.2 — 2026-10-08 — Readability: Profile Card and Q&A text
Artifact version 1791498672-eb3d · file `fireflair-v16.2.html`

Readability pass on the Profile Card, Q&A cards and other cards. No layout or colour changes.

Typography rule now used on the profile:
- Tier 1 (names, main profession, questions, answers): biggest, darkest.
- Tier 2 (skills, interests, locations, languages, card titles, descriptions): medium size, strong contrast.
- Tier 3 (labels, card types, XP, status): small but solid, never faint.
- Display type (Cinzel) stays for headings, the card plate and the name. Everything a person writes about themselves is in Inter, which stays legible at small sizes. Cormorant is no longer used for profile content.

Profile Card (editable, in Profile Card step 2)
- Name: larger and bolder (Cinzel, 22px, 700).
- Profession, skill, interest, location and language chips: Inter 13.5px; the first profession (the main one) is bold.
- Typing fields in Inter 15px with stronger placeholders. Row labels are small but darker.
- FF Tag line and footer address in Inter, darker and larger.

Profile Card (finished: Section 5, Network tiles, profile view)
- Main profession bigger and darker gold (#6A4F12 on light cards).
- Row values in Inter semibold, about 1.5x the previous visible size. Labels darker.
- FF Tag address on the black pill is larger, with less letter-spacing.
- The FF watermark behind the card is about half as strong.
- Mini and landscape card formats: profession and address in Inter too.

Q&A cards
- Slightly wider (176–204px). Question in Inter 16px semibold; answer Inter 17px bold. "Tap to answer" is 15px, not tiny italic.
- Group, XP and "Answer" labels are smaller and quieter, so question and answer come first.

Other cards
- Profession / skill / qualification / experience cards, media cards and venue cards: titles in Inter bold 15px, descriptions in Inter 13px with stronger contrast, type labels raised from 6.5px to 8.5px.


## v16.1 — 2026-10-08 — Join the Team profile, WhatsApp sign-up, Save & Share, Section 5, invited-by Network
Artifact version 1791497422-8086 · file `fireflair-v16.1.html`

Everything since v16, in one release.

Profile page — "Join the Team"
- Section 1 is the account: FF Tag + phone number -> Continue -> WhatsApp code -> Create. The account exists once the code is verified.
- Optional password pop-up straight after ("Create a password?" / Skip for now). Without one, people sign in with a WhatsApp code.
- FF Tag is now a username: 3 to 8 letters or numbers, unique, not case sensitive, stored lower case (alex, alexg, alex94). It's suggested from the person's name, shown after "ffparty.uk/" with a live available/taken tick, and can be changed later (Section 1, or "FF Tag & sign-in" in the account menu). The placeholder is /username.
- Log in opens on "WhatsApp code"; password is the second option.
- Short headings, far less explanatory text: 1 Join the Team, 2 Profile Card, 3 FF AI & CV, 4 Your profile, then Save & Share, then Section 5.
- The profile saves itself once the account exists (no "Save your Profile Card" section).
- Save & Share replaces Save & Publish. Save is the explicit "done". Share sends the card to the person's own WhatsApp and turns their card link on.
- Section 5 sits under Save & Share, closed (its number, a short line and three dashes running down). Save opens it: "Welcome to the Team" + the finished Profile Card + an Add button.
- Add (the FF mark, also in the header) = "Share your card": type someone's phone number and send them your card.

Network
- A new user starts with one connection: the person who invited them, labelled "Invited you". Prototype: everyone arrives on Don Gee's link (DONGE). Tapping Join on someone's profile before having an account makes that person the inviter instead.

Cards
- Reorder controls are clear left/right arrows: <- 1 ->
- The decorative circle between the card type and the title is gone.
- Media cards: title at the top, the media fills the rest, no description.
- Question cards: question on the top half, answer on the bottom half in larger type.

Look and feel
- Have a CV?: pale burgundy box with a burgundy button before upload; after upload it stays on the page in a calm neutral state with Replace.
- Pick your professions uses the FireFlair gold, with dark text and burgundy for chosen professions.
- Profile photo control: camera with a + in the small circle on the card. The microphone is drawn into the page. The icon library now loads from a second source if the first doesn't arrive.
- Real map (Leaflet) on Home and Network.

For the developers — what Core needs to provide (all mocked here, nothing is sent):
- AUTH_ADAPTER: suggestTag, isAvailable, sendSignupCode, verifySignupCode (this creates the account), setPassword, changeTag, loginWithPassword, sendCode/verifyCode (WhatsApp log-in).
- PROFILE_ADAPTER: save (auto-save and the Save button), share (card to the person's own WhatsApp), shareTo (card to someone else's number).
- Invites: the inviter comes from the link's tag (INVITE_LINK_TAG in the prototype) or from Join on a profile.


