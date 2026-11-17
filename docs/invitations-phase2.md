# Invitations, network and reviews, Phase 2 (prototype v17.22)

This is how we build invitations, the network and reviews: who brought a newcomer in, the join link, the banner on the create-a-profile page, the buttons on someone's profile, the one connection record, the notifications and the one review form.
It replaces the old behaviour where every visitor was told "Don Gee invited you". Nothing on the site may say or imply that someone invited you, added you or reviewed you unless a real record says so. Sample data appears only when a DEV button puts it there.

Code:
- Records and rules: `src/state/invite17.js` (referral, `connStatus17`, the review draft at sign-in), `src/state/store.js` (`REVIEW_ADD`, `REVIEW_DRAFT`, `REVIEW_DECIDE`, `TEAM_INVITE`, `TEAM_INVITE_ACCEPT`, `CONN_REMOVE`, `AUTH_SIGNED_IN`, `review17Add`), `src/state/records.js` (`reviewRecordsFor`), `src/state/notes17.js` (notification list), `src/components/staff/questions-and-dates.jsx` (`NET_TOGGLE`, `TEAM_ASK_REPLY`), `src/state/persistence.js` (`PERSIST_KEYS`).
- Notifications: `src/components/party/delivery-and-extras.jsx` (`AskNote17`, `TeamAskNote17`, `ReviewAskNote17`, the samples).
- Screens: `src/components/team/network.jsx` (profile buttons), `src/components/team/profile-from-text.jsx` (the review form), `src/components/team/invite17.jsx` (the banner and Share), `src/utils/routes17.js` (the `join` route).

The records and notifications came in net-ladder 1/3. The profile buttons, the review form, the banner wording and Share came in net-ladder 2/3.

## The link and what opens

- Team invitation link: `https://ffteam.uk/join/<code>`. `<code>` is the sender's FF Tag in lower case. On screen it is written FFTeam.uk/join/<tag>. In the prototype: `#/ff-team/join/<code>`.
- Signed out: we record the code (kind `team`) and open FF Team, Profile, the create-a-profile page, at the top. There is no separate join page.
- Signed in: no banner and no new account. The sender's profile opens, with its relationship button. Nothing is recorded.
- Unknown code, or the visitor's own code: FF Team, Profile, no banner. Sign-up works and nobody is credited.
- A shared Profile Card, profile or shift link carries `?r=<code>` (kind `share`). It is read when the page loads.
- At sign-up both kinds now do the same thing: the sender goes in the newcomer's network and a waiting team invitation from the sender is created. (Alex decided this.) `referredBy.kind` still stores truthfully which kind of link it was.

## The banner (top of the create-a-profile page)

The inviter's Profile Card, smaller, sits on the left (tapping it opens their profile). The words sit on the right. No other text.

| State | Words |
|---|---|
| Signed out, join link | **You have been invited to join {Full name}'s team** / **{First name} will be rewarded when your profile is complete.** |
| Signed out, shared card or shift link | **{Full name} invited you to FireFlair** / **{First name} will be rewarded when your profile is complete.** |
| Signed in, team invitation waiting (either kind) | **You have been invited to join {Full name}'s team**, line 2 until the profile is complete, plus **Accept** and **Not now** |
| Accepted | line 1 becomes **You are on {First name}'s team**; line 2 stays until the profile is complete; the review form (**Review {First name}**) opens once |
| Not now | the buttons go; the invitation stays waiting in the notification centre |
| Profile complete | line 2 goes. The banner goes once the team invitation is accepted or set aside (Not now, or declined in the notification centre) and the review step is done or skipped. This is the same for both kinds of link |

The banner lives on the create-a-profile page. Once a profile is published the page is the finished profile, and the banner is not shown there; a waiting invitation is still in the notification centre.

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
| A review written before sign-up | Never credits anyone |
| Sign out | `refTag` and `refKind` are cleared |

## On someone's profile

### Signed out

Three buttons only, in this order:

1. **Join {First name}'s team** (gold, the largest).
2. **Review**.
3. **Share**.

Join records the profile owner's code as kind `team` and opens sign-up. The first valid code still wins. There is no Add to network, Add to team, Ask or Availability for a signed-out visitor.

### Signed in

One relationship button. It changes with the connection's status (`connStatus17`, plus the waiting invitations to me):

| Status | Button | Tap |
|---|---|---|
| none | Add to network | One tap, no form. Then the review is offered in place, one tap to skip |
| network | Invite to your team | One tap, no form |
| network, and their invitation to you is waiting | Accept invitation | Completes the team |
| pending | Invitation sent | None |
| team | On your team | None |

Never two relationship buttons.

The ⋯ menu holds:
- **Review {First name}**.
- **Remove from network**, **Cancel invitation** or **Remove from team**, whichever fits the status.
- In the prototype only, **Preview: {First name} accepts**.

Removing from team or cancelling an invitation keeps the person in your network.

Ask and Availability sit in a row below. Share is last. FF Staff keeps Favourite and Add to booking.

## The connection record

Core keeps ONE record per pair, with a status, in place of separate network, invitation and team lists:

```
connection = { id, fromId, toId, status, createdAt, invitedAt, decidedAt, message }
```

| Status | Meaning |
|---|---|
| `network` | One way: `from` added `to` to their network |
| `pending` | `from` has invited `to` onto their team |
| `team` | Two way: both accepted |

Moves:
- none to `network`: Add to network, or sign-up from a valid code.
- `network` to `pending`: Invite to your team. A connection is also created as `pending` at sign-up from a join or shared link, with the sender as `from`.
- `pending` to `team`: the other person says Yes or Accept.
- Not now leaves it `pending`.
- No or Decline returns it to `network`.
- Remove from team returns it to `network`.
- Remove from network deletes the connection.

The prototype keeps several stores. They map to the one record like this:

| Prototype store | Connection |
|---|---|
| `netAdds17` (ids) | status `network`, from me |
| `teamInvites` with status `pending` | status `pending`, sent by me |
| `teamAsksIn17` (and the samples) with `teamAsks17` | status `pending`, sent to me; `teamAsks17` holds my answer (`accepted` or `declined`) |
| `connections` | status `team` |
| `teamAskNotes17` | `message` (what I typed with my answer) |

`connStatus17(state, id)` in `src/state/invite17.js` is the one function the screens read. It returns `team`, `pending`, `network` or `none`, from my side: `team` if they are in `connections`, `pending` if I have a pending invitation to them in `teamInvites`, `network` if they are in `netAdds17`. It does not read invitations sent to me: the screens add the "their invitation to you is waiting" case from `teamAsksWaiting17(state)`.

What each action does in the prototype:

| Action | Effect |
|---|---|
| `NET_TOGGLE { id }` | Adds the id to `netAdds17`, or takes it out. Adding a company also tells that company |
| `TEAM_INVITE { invite }` | Signed-in members only. Adds a pending invitation `{ id, personId, name, tag, note, at, status: "pending" }` and puts the person in my network |
| `TEAM_INVITE_ACCEPT { id }` | The prototype's "Preview: {First name} accepts". Marks the invitation accepted, adds them to `connections`, and accepts my waiting reviews of them |
| `TEAM_ASK_REPLY { ask, accept, text? }` | My answer to an invitation sent to me. Accept adds them to `connections` (a company invitation makes me a member of its team). The typed text goes in `teamAskNotes17` |
| `CONN_REMOVE { id, from: "network" }` | Takes them out of my network and cancels my pending invitation to them |
| `CONN_REMOVE { id, from: "pending" }` | Cancels my pending invitation; they stay in my network |
| `CONN_REMOVE { id, from: "team" }` | Takes them off my team; they stay in my network |

## The notification to the person added

When A adds B to their network, B gets a site notification in the FF coin notification centre, drawn as a Question Card (`AskNote17`):

- From-line: **{First name} added you to their network**
- Question: **Add {First name} to your team?**
- **Yes** / **No**, and a type box below: **Say hello to {First name}**

Yes makes the connection `team`. No leaves it `network`. What was typed is delivered with the answer (the type box has no send button of its own). Site notification only: no WhatsApp message is sent for a network add.

After Yes, the review form opens once, one tap to skip.

A team invitation that came through a link (`teamAsksIn17`) shows in the notification centre as **Team invitation** with the sender's Profile Card, **Accept** and **Decline**.

In the prototype this card and the review card below appear only as samples after the DEV complete-profile login (`state.devDone.team`), because nothing may say a real person did something unless a real record says so. The prototype has one user, so a real "added you" card never appears.

## Reviews: one form, one shape

The form is the same everywhere: on a profile, after Add to network, after Accept, in bookings, on FF Party and on company pages.

- **Have you worked with {First name}?** Yes / No.
- Stars: five are chosen by default. The writer can lower them.
- A type box.
- **Post review**.

On No the stars are hidden and no rating is stored.

The shape:

```
review = { id, aboutId, byId, byName, worked, rating, text, status, at, shiftId }
```

| Field | Values |
|---|---|
| `worked` | `true` or `false` |
| `rating` | 1 to 5, or `null` when `worked` is `false` |
| `status` | `"pending"`, `"accepted"` or `"declined"` |

Rules:
- A review is `pending` until its subject accepts it. A saved review with no status counts as accepted.
- The subject is asked in the notification centre, as a Question Card (`ReviewAskNote17`): **{First name} reviewed you** with the stars, the review text, **Show this review on your profile?**, **Yes** / **No**, and a type box (**Reply to {First name}**). The answer is kept in `reviewAsks17`.
- Until then only the writer sees it, marked **Waiting for {First name}** (`reviewRecordsFor` gives the writer's own pending reviews `pending: true`).
- Declined reviews are hidden, never deleted.
- One review by me per person outside a shift. A new one replaces the old. Reviews tied to a shift are never replaced.
- A signed-out visitor cannot post (`REVIEW_ADD` does nothing). The draft is kept (`REVIEW_DRAFT` writes `session.reviewDraft17`), they are taken to sign-up, and it is saved as pending when they sign up or log in. The DEV login drops the draft unsent.
- Adding someone to your team no longer needs a review.
- The old questions (work again, how are they to work with) are gone. Older saved invitations may still carry `workedBefore`, `workAgain`, `howTo`, `rating` and `review`; nothing reads them.

Moments that offer a review, each optional and one tap to skip:
1. Straight after Add to network.
2. Straight after accepting a team invitation (banner or notification centre).
3. From the ⋯ menu on a profile.

## Sending an invitation

Invite is now part of Share. A member whose profile is complete (`profileBasics17`) shares their own Profile Card with the text **Join my team on FireFlair:** and the link `https://ffteam.uk/join/<tag in lower case>`. The link carries no `?r=` (the code is already in it). On screen the address is written FFTeam.uk/join/<tag>.

The Invite tiles are removed. The `/join/` link and the `ff-invite` event still work: the event opens the same Share sheet, and anyone whose profile is not complete goes to FF Team, Profile, with no message.

## Not in Phase 2

- Pre-filled phone numbers on the join page.
- The Phase 3 chat route (click to chat with pre-filled text, section 5.3).
- Per-invitation codes. Core may issue one code per invitation that resolves to the same sender; the page behaves the same.
- Duplicate and fake-activity review before an invitation counts (Core).
- The contact-list invitation sheet (removed; it listed invented contacts).

## What we store

- `session.refTag` the sender's code (their FF Tag, upper case). No default.
- `session.refKind` `"team"` (join link) or `"share"` (shared card, profile or shift link).
- `session.reviewDraft17 = { aboutId, worked, rating, text }` a review written while signed out. One at a time. Sent, pending, at sign-up or log in, then cleared.
- `profile.referredBy = { code, personId, kind, at }` written once at sign-up of a new account on FF Team from a valid code. These four fields never change. Later we add only: `completedAt` (the first time the profile is complete), `notNowAt` (Not now), `reviewOfferedAt` (the review form has been offered).
- `state.teamAsksIn17 = [{ id, fromId, name, tag, note, at, viaLink: true }]` a team invitation that came through a join link or a shared card, profile or shift link. It is decided through `TEAM_ASK_REPLY`; `state.teamAsks17` holds the answer. Accepting puts the two people on each other's team (`connections`).
- `state.teamAskNotes17 = { [invitation id]: text }` what I typed when I answered a team invitation.
- `state.reviews` each review in the shape above, with its `status`.
- `state.reviewAsks17 = { [review id]: { show, text, at } }` my answer to a review about me.
- `state.teamInvites`, `state.netAdds17`, `state.connections` as in the table above.
- At sign-up we also add the sender to the newcomer's network (`netAdds17`, one way). Team is never made without a tap.
- "Complete" is one function, `profileBasics17(state)`: signed in, `profile.savedAt` set, a name, a profile picture, and at least one confirmed (not proposed) profession.
- `PERSIST_KEYS` (`src/state/persistence.js`) holds all of these: `session` (so `refTag`, `refKind` and `reviewDraft17`), `profile`, `teamAsksIn17`, `teamAsks17`, `teamAskNotes17`, `reviews`, `reviewAsks17`, `teamInvites`, `netAdds17` and `connections`. Sign out clears them. Saved state from before v17.6.1 still loads; a saved `refTag` with no `refKind` is dropped, because it was the old forced code.

## The invitation in two places

The same record shows in the FF coin notification centre (team invitation card) and in the banner. Deciding it in one place updates the other. The notification centre shows only real records. The sample cards (Alexandru Gavrilas added you to their network, Vooshka Cocktail Bar's company invitation, Alexandru Gavrilas reviewed you, and the "Are you available?" question) appear only after the DEV complete-profile login (`state.devDone.team`).

## What Core does at each step (message numbers from FF Notifications v1.4)

| Step | Core |
|---|---|
| Link opened | Stores the opened time against the invitation |
| New member signs up with a valid code | Stores `referred_by`; creates the connection as `pending` from the sender (join link or shared link). Sends 10.5 to the sender when the profile first becomes complete (the prototype records `completedAt`) |
| Newcomer taps Accept (banner or notification centre) | Status `team`. Sends 10.6 to the sender |
| Newcomer taps Not now | Status stays `pending`; the sender is not told |
| Add to network | Creates the connection, status `network`. Site notification to the person added |
| Invite to your team | Status `pending`. Site notification to the person invited |
| Yes on the Question Card | Status `team`, with the typed message. Notifies the inviter (site notification) |
| No on the Question Card | Status stays `network`, with the typed message |
| Review posted | Stored as `pending`. Site notification to the subject |
| Review accepted or declined | Sets `status`. Notifies the writer on accept (site notification). Published only when accepted |
| Sender | Receives 10.5 and 10.6 on WhatsApp only if opted in; the site notification always shows |

## Differences from FF Notifications v1.4

- No separate join page: the join link lands on the create-a-profile page and the banner carries the invitation.
- Accept and Not now are shown in the banner as well as in the notification centre.
- Signed out, the banner says "You have been invited to join {name}'s team" for a join link and "{name} invited you to FireFlair" for a shared card. Signed in with an invitation waiting, both say "You have been invited to join {name}'s team".
- A shared card, profile or shift link creates the waiting team invitation at sign-up, the same as a join link.
- A signed-out Join tap on a profile records the profile owner as sender (kind `team`).
- A network add is one tap with no form and sends a site notification only. The person added is asked, as a Question Card, whether to add the sender to their team.
- Invitations no longer carry a review or the worked-before questions. A review is one form, offered after Add to network, after Accept and from the ⋯ menu (the document puts reviews to non-members after sign-up, 10.8).
- A review waits for its subject's Yes before it is shown. Declined reviews are kept, hidden.

## Real and simulated in the prototype

- There is one user. Everything is kept in this preview only. Nothing is sent: no WhatsApp message, no site notification to anyone else.
- Real: the referral record, the waiting invitation from a link, your network, your invitations, your team, your reviews and your answers, all saved in this browser.
- Simulated: the "added you to their network" and "reviewed you" cards, the Vooshka company invitation and the "Are you available?" question are samples, shown only after the DEV complete-profile login.
- "Preview: {First name} accepts" stands in for the other person accepting your team invitation. It also accepts your waiting reviews of them.
