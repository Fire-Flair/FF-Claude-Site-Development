# Invitations, Phase 2 (prototype v17.6.1)

This is how we build invitations: who brought a newcomer in, the join link, the banner on the create-a-profile page, the team invitation and the reviews.
It replaces the old behaviour where every visitor was told "Don Gee invited you". Nothing on the site may say or imply that someone invited you unless a real record says so. Sample data appears only when a DEV button puts it there.

Code: `src/state/invite17.js` (records and rules), `src/components/team/invite17.jsx` (the banner and the Invite sheet), `src/utils/routes17.js` (the `join` route).

## The link and what opens

- Team invitation link: `https://ffteam.uk/join/<code>`. `<code>` is the sender's FF Tag in lower case. In the prototype: `#/ff-team/join/<code>`.
- Signed out: we record the code (kind `team`) and open FF Team, Profile, the create-a-profile page, at the top. There is no separate join page.
- Signed in: no banner and no new account. The sender's profile opens, where Add to team already is. Nothing is recorded.
- Unknown code, or the visitor's own code: FF Team, Profile, no banner. Sign-up works and nobody is credited.
- A shared Profile Card or shift link carries `?r=<code>` (kind `share`). It is read when the page loads.

## The banner (top of the create-a-profile page)

The inviter's Profile Card, smaller, sits on the left (tapping it opens their profile). The words sit on the right. No other text.

| State | Words |
|---|---|
| Signed out, join link | **You have been invited to join {Full name}'s team** / **{First name} will be rewarded when your profile is complete.** |
| Signed out, shared card or shift link | **{Full name} invited you to FireFlair** / **{First name} will be rewarded when your profile is complete.** |
| Signed in, team invitation pending | the two lines, plus **Accept** and **Not now** |
| Accepted | line 1 becomes **You are on {First name}'s team**; line 2 stays until the profile is complete; the review sheet (**Review {First name}**) opens once |
| Not now | the buttons go; the invitation stays pending in the notification centre |
| Profile complete | line 2 goes. The banner goes once the team invitation is accepted or set aside (Not now, or declined in the notification centre) and the review step is done or skipped. A shared-card banner goes as soon as the profile is complete |

The banner lives on the create-a-profile page. Once a profile is published the page is the finished profile, and the banner is not shown there; a pending invitation is still in the notification centre.

## Attribution rules

| Case | Result |
|---|---|
| Two codes before sign-up | The first valid code wins (`session.refTag`). It is not replaced |
| The same sender's join link after a shared-card link | `refKind` moves from `share` to `team`; the sender does not change |
| Code is unknown, or not a member in the directory | Ignored silently. Sign-up works; nobody is credited |
| Code is the visitor's own tag | Not counted |
| Link opened while signed in | Nothing is recorded |
| Log in to an existing account | Never credited (only a new account is) |
| DEV complete-profile login | Never credited |
| Sign out | `refTag` and `refKind` are cleared |

## What we store

- `session.refTag` the sender's code (their FF Tag, upper case). No default.
- `session.refKind` `"team"` (join link) or `"share"` (shared card or shift link).
- `profile.referredBy = { code, personId, kind, at }` written once at sign-up of a new account on FF Team from a valid code. These four fields never change. Later we add only: `completedAt` (the first time the profile is complete), `notNowAt` (Not now), `reviewOfferedAt` (the review sheet has been offered).
- `state.teamAsksIn17 = [{ id, fromId, name, tag, note, at, viaLink: true }]` a team invitation that came through a link. It is decided through the existing `TEAM_ASK_REPLY` action; `state.teamAsks17` holds the answer. Accepting puts the two people on each other's team (`connections`).
- At sign-up we also add the sender to the newcomer's network (`netAdds17`, one way). Team is never made without a tap.
- "Complete" is one function, `profileBasics17(state)`: signed in, `profile.savedAt` set, a name, a profile picture, and at least one confirmed (not proposed) profession.
- All of these are in `PERSIST_KEYS` (`session`, `profile`, `teamAsksIn17`). Saved state from before v17.6.1 still loads; a saved `refTag` with no `refKind` is dropped, because it was the old forced code.

## The invitation in two places

The same record shows in the FF coin notification centre (team invitation card) and in the banner. Deciding it in one place updates the other. The notification centre shows only real records. The two sample invitations (Ava Clarke and Vooshka Cocktail Bar) and the sample "Are you available?" question appear only after the DEV complete-profile login (`state.devDone.team`).

## What Core does at each step (message numbers from FF Notifications v1.4)

| Step | Core |
|---|---|
| Link opened | Stores the opened time against the invitation |
| New member signs up with a valid code | Stores `referred_by`; creates the Network connection; creates the pending Team invitation (join link only). Sends 10.5 to the sender when the profile first becomes complete (the prototype records `completedAt`) |
| Newcomer taps Accept (banner or notification centre) | Connects both ways. Sends 10.6 to the sender |
| Newcomer taps Not now | Nothing connects; the sender is not told; the invitation stays pending |
| Sender | Receives 10.5 and 10.6 on WhatsApp only if opted in; the site notification always shows |

## Where the reviews sit

Not during profile creation. Two moments, both optional and one tap to skip:

1. The newcomer reviews the sender straight after Accept: the existing review sheet (`ReviewSheet`, "Review {First name}") opens once. Close it to skip.
2. The sender reviews the newcomer when told they joined or accepted (10.5 / 10.6). That is the sender's own notification and cannot be shown with one user, so the prototype builds nothing for it. It is described in the `NETWORK_ADAPTER` comments.

A review is published only when its subject accepts it.

## Sending an invitation

Invite opens the Share sheet with the member's own Profile Card, the text **Join my team on FireFlair:** and the link `https://ffteam.uk/join/<their tag in lower case>`. The link carries no `?r=` (the code is already in it). Invite needs a signed-in member whose profile passes `profileBasics17`; anyone else goes to FF Team, Profile, with no message. Invite is reached from the Invite tile beside Add people in the Network section of the member's own profile, and from the `ff-invite` event.

## Not in Phase 2

- Pre-filled phone numbers on the join page.
- The Phase 3 chat route (click to chat with pre-filled text, section 5.3).
- Per-invitation codes. Core may issue one code per invitation that resolves to the same sender; the page behaves the same.
- Duplicate and fake-activity review before an invitation counts (Core).
- The contact-list invitation sheet (removed; it listed invented contacts).

## Differences from FF Notifications v1.4

- No separate join page: the join link lands on the create-a-profile page and the banner carries the invitation.
- Accept and Not now are shown in the banner as well as in the notification centre.
- The banner says "You have been invited to join {name}'s team" for a join link and "{name} invited you to FireFlair" for a shared card.
- The review of the sender is offered right after Accept (the document puts reviews to non-members after sign-up, 10.8).
- A shared-card or profile Join tap also records the sender (kind `share`), so the Network connection follows the same rule.
