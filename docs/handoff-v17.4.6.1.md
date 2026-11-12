# Handoff — v17.4.6.1 (Phase 3 prototype)

Follows `handoff-v17.4.6.md`. Source of truth is `src/`; build with `npm run check`, `npm run build`, `npm run publish-build`.

## What changed
- **FF Team area pages.** Five area-specific questions replace the recruitment FAQ; one Create your Profile Card button follows the FAQ. FAQPage JSON-LD is built from the same list. Job adverts link to the location page.
- **FF Staff homepage.** Four pillars unchanged. "What is FireFlair?" moved into Our philosophy (same fold as FF Party; shared parts, no duplication). New "Be first in line for Gold" box (`GoldLaunch20`): four picture tiles (Marketing, Staff training and equipment, Smaller events, Your brand), Hire staff button, FF Story link only when a published story exists. No counters, no automatic enrolment. Gold eligibility is recorded once per company at its first confirmed FF Staff hire (`goldClaim17`, `state.goldClaims17`).
- **Company teams.** `src/state/co-teams17.js`, `state.coTeams17`. Your team sits after Chefs in FF Staff Browse the network (open by default; Invite your team for new companies). Membership only from an accepted invitation (recipient accepts on FF Team) or an accepted request (business accepts on FF Staff). Shifts never create membership. Duplicate pending records and duplicate roster entries are prevented. Invitations to people without an account are kept against the phone number and reach them when they join with it. Accepted members with a published Profile Card appear in the company's Team section and can be added to a booking one by one. Availability is separate from membership.
- **Bookings.** FF Staff with an active event see Your bookings first. After payment, "Your invitations have been sent" shows only once dispatch is confirmed, with "X of N staff confirmed". "Use Autofill if they don't reply in time" (`AF_BACKUP`) sets the backup flag only: no resend, no new charge.
- **Wording.** Accept shift (exclusive), I'm available (Autofill), Unavailable (either), Ask kept. Same words on the website and the WhatsApp template definitions (see `whatsapp-templates.md`).
- **Notifications.** The booker gets updates for confirmed, unavailable, available, and "No reply before the deadline". Availability opens the booking selection step. The badge counts visible updates only; no duplicates.
- **Shared.** Business & Support appears at the bottom of every Network and Bookings page, second from the bottom on every homepage (FF Team, FF Staff, FF Party, FF VIP), once per page. The "We're in beta" box is gone. The decorative QR-style block is gone from the VIP Host Card.

## Production dependencies
- **Company team records** (`coTeams17`): Core owns them; endpoints to create, list and decide invitations and requests; uniqueness per company and person; phone-number matching at sign-up.
- **Notifications:** templates `company_team_invite` and `company_team_request`; booker update events (confirmed, unavailable, available, no reply) from the Autofill engine.
- **WhatsApp:** the four reply definitions in `whatsapp-templates.md` need approval with the provider.
- **Gold:** eligibility must be counted server side, once per company, at first confirmed FF Staff hire.

## Checked in this build
Run in headless Chrome against the built file (state driven directly where noted):
- Real: `npm run check`, `npm run build`; no console errors on FF Staff home, support placement on team/staff/party/vip home, network and bookings (desktop and mobile); Gold box, tiles, sheet, Hire staff route; philosophy fold contents; VIP card has no QR block; five-question FAQ and JSON-LD; Explore by area on all three Network pages.
- Simulated (reducer actions, no live service): company invite/request/accept/decline, duplicate prevention, phone-number match for an invitee who signs up later, notification counts.
- Not live: nothing is sent to WhatsApp or any provider; booking dispatch and replies are prototype state.
- Not exercised in a browser this round: full payment-to-sent flow with Autofill on and off, and per-member selection from the company Team section. Test these on the next pass.
