# FireFlair prototype — code review (v17.3.39, 31 Oct 2026)

A review of the whole prototype against what the developers have built:
- **Frontend:** `Fire-Flair/fireflair-frontend`, `dev`, `7ed5129`, 23 Oct.
- **Backend:** `Fire-Flair/fireflair-backend`, `dev`, `7e2e5aa`, 29 Oct.

It covers how well the two line up, what was fixed in this release, and what the live site still needs.
`ff-team-phase-1/AUDIT.md` (16 Oct) is the earlier, FF Team-only audit; this document supersedes its endpoint table.

## 1. Where things are

| What | Where |
| --- | --- |
| The page to open and run | `fireflair-v17.3.39.html` (the highest number is always the latest) |
| The readable app source, with every comment | `source/fireflair-app.jsx`, the exact code in the latest page before it was compiled. Images are shortened to markers; they are complete in the page. |
| What changed in each version | `CHANGELOG.md` |
| This review | `REVIEW.md` |
| FF Team Phase 1 reference and its audit | `ff-team-phase-1/` |

Since v17.3.38 the page is compiled before publishing (see §4.1). Compiling removes comments, so **read `source/fireflair-app.jsx`, not the `.html`**. File names in older changelog entries (`v11/admin17.jsx`, `studio17.jsx`, `teambookings.txt` and so on) are the prototype's internal build files. They are not in this repo, and all of their code is in `source/fireflair-app.jsx` under the same function names.

## 2. How the prototype lines up with the live code

### 2.1 FF Team Phase 1: aligned

Everything the live frontend calls exists in the backend, and the prototype's adapters map onto the same routes:

| Prototype | Core route (all under `/api/user`) |
| --- | --- |
| `AUTH_ADAPTER` | `GET /auth/tag-availability`, `POST /auth/send-otp`, `POST /auth/verify-otp`, `POST /auth/login`, `POST /auth/password`, `POST /auth/password/change`, `POST /auth/password/forgot`, `POST /auth/password/reset`, `PATCH /auth/tag` |
| `PROFILE_ADAPTER` (card and profile) | `GET /card`, `PATCH /card/profile`, `PATCH /card/theme`, `PATCH /card/publish`, `PATCH /card/interests`, `POST /card/profile-image`, `POST/PATCH/DELETE /card/sections/:sectionId/data[/:dataId]`, `PATCH …/data/order`, `GET /card/template`, `GET /card/themes` |
| Media on the profile | `POST /card/gallery`, `PATCH /card/gallery/order`, `PUT/DELETE /card/gallery/:mediaId` |
| Professions, languages, countries | `GET /professions?search=`, `GET /professions/categories`, `GET /languages`, `GET /countries` |
| Question Cards | `GET /questions`, `PUT /questions/:questionId/answer` |
| `CV_ADAPTER` (data entry and CV reading) | `POST /ffai/extract`, `GET /ffai/extractions/:id`, `POST /ffai/extractions/:id/apply` |
| Guest view of a profile | `GET /card/public/:ffTag` |
| Network lists (read only) | `GET /network/cards`, `GET /network/featured` |

New in the backend since the 16 Oct audit:
- **Publishing:** publish/unpublish.
- **Gallery (profile media):** add, reorder, replace, remove.
- **Profile Interests.**
- **Password:** forgot and reset.
- **Network:** network cards and featured professionals.
- **Accounts:** a fix for duplicate profiles.
- **WhatsApp:** webhook verification (`/api/whatsapp-webhook`).
- **Admin:** an empty admin API (`/api/admin/health`) with an `AdminUser` model.

### 2.2 Field-level differences to settle

1. **Verification levels.**
   - **Core:** `users.verification_level` = `base | bronze | silver | gold`, default `bronze`.
   - **Prototype:** `standard | bronze | silver | gold`.

   They mean the same thing. FF Admin now labels the first one "Base", so the screens match Core. On the live site use Core's values.
2. **Question Cards.**
   - **Keys:** the prototype uses short ids (`g_freelance`) and Core uses `question_key` (`generic_freelance_availability`). The map is `CORE_QUESTION_KEYS` in the source, and FF Admin's CSV export now includes the Core key.
   - **Wording and options:** they match the seed (`scripts/seedQuestions.js`) exactly.
   - **Categories:** Core has `generic | feedback | profession`. The prototype also uses:
     - `hiring`: FF Business questions to staff;
     - `asked`: questions visitors ask on a profile;
     - `ai`: suggested questions.

     Core needs categories (or tables) for those.
3. **"Are you available for freelance work?"** This is one answer (`generic_freelance_availability`) shown in three places: Question Cards, the FF Team Bookings screen and the home page. On the live site all three must read and write the same answer through `PUT /questions/:id/answer`.
4. **Reviews.**
   - **What Core has:** a `UserReview` model (`profile_id`, `reviewer_id`, `booking_id`, `rating`, `review_text`, `review_tags`, `status`) but no routes.
   - **What the prototype also records:** worked before, would work again and how they worked together, which could become tags or fields.
   - **What's missing:** routes for create, accept and list.
5. **Hiding by admins vs hiding by the owner.** Core has `visibility: public | private | hidden` and `is_hidden` on section data and media. Those are the owner's own choices. Admin moderation needs its own flag, for example `admin_hidden: { by, at, reason }`, so an admin hiding something never overwrites, or gets overwritten by, the owner's setting.
6. **Roles.** Core `ROLE` is `ff_team | ff_staff | ff_party`. The product now says FF Business (ffbusiness.uk). Either rename the value or map `ff_staff` to FF Business everywhere it's shown.
7. **Admins.**
   - **Core today:** `AdminUser` is a separate email-and-password account.
   - **The plan:** admins are FireFlair members, by FF Tag, with roles (Owner, Admin, Gold package), and Gold package members get admin tools automatically. That fits a role on `users` (for example `admin_role`) better than separate admin accounts.
   - **Decision needed:** keep `AdminUser` only for a back-office login, or retire it.

### 2.3 In the prototype, not yet in Core

Everything below is prototype-only state. Each item needs a model and routes:

| Area | Prototype state (in `PERSIST_KEYS` unless noted) |
| --- | --- |
| Invitations, connections, team invites | `invitations`, `connections`, `teamInvites` (`NETWORK_ADAPTER` lists the routes) |
| Questions asked on profiles | `profileQuestions` |
| FF Business company profiles | `company` (+ demo `COMPANIES`) |
| Events, shifts and booking requests (FF Business and FF Party) | `events`, `shifts`, `engagements`, `activeEventId` |
| Service cards, signature cocktails, stories | `myServices`, `myCocktails`, `myPosts` |
| Terms | `svcTerms17` (service cards), `myTerms17` (personal terms shown when hired) |
| FF Team Bookings | `profile.serviceInterest` (party card sign-ups), `profile.unavail17` (dates not available) |
| Training, Dream jobs, FF rewards, FF VIP interest | `trainingInterest`, `jobsInterest`, `rewardsInterest`, `vipInterest` |
| FF Party favourites and preferences | `favs`, `favCocktails`, preferred quality on the event (`quality`) |
| FF Admin | `admin17` (hidden items, verification overrides, settings, admins, activity log). Routes are listed in `ADMIN_ADAPTER` |
| Credits and payments | `credits` (`PAYMENT_ADAPTER`, not connected) |

## 3. Fixed in this release

1. **Comments are back for developers.** v17.3.38 compiled the page (right for speed) but that stripped every comment, including the adapter notes. The full commented source now ships as `source/fireflair-app.jsx` with every version.
2. **A real bug: the FF Team profile crashed after signing in.**
   - **What happened:** FF Admin (v17.3.36) declared a component with the same name as the profile's chip editor (`Chips17`). In one page the later one wins, so the profile threw an error and showed nothing.
   - **The fix:** the admin one is now `AdmChips17`.
   - **Prevention:** the build now refuses two top-level functions with one name.
3. **Saved data is private per person.**
   - **The problem:** the page saved everyone's state into one shared record (`fireflair/state`). Anyone opening the link loaded the last person's data (profile, phone number, events) and overwrote it.
   - **The fix:** each signed-in viewer now saves to their own private record (`data/users/<id>/fireflair`). This is the same fix the FF Team Phase 1 prototype made.
   - **Effect:** previously saved prototype data does not carry over; the dev login rebuilds a complete profile in one tap.
4. **Unused code removed.** 164 functions and constants that nothing could reach are left out of the published page and the source:
   - superseded `_old` and `_v16` versions;
   - earlier home pages;
   - sheets nothing opens.

   They are listed at the top of `source/fireflair-app.jsx`. Removal is worked out from the code itself, and each cut is checked to be exactly one declaration.
5. **Lighter images.** The page is 6.7 MB, down from 8.3 MB:
   - **Coin artwork:** stored at 1,100–1,200 px but shown at most a few hundred, now 640 px.
   - **Campfire animation:** 512 px wide, same frames and timing.
   - **Campfire still frame:** 680 px.
6. **Start-up is fast.** The app is on screen in about half a second (v17.3.38 removed in-browser Babel). The short start-up screen is just the coin.

Checked with the prototype's test runs and a sweep of every site, tab, Discover pillar, FF Admin section, the notifications sheet and a company page, at phone and desktop widths. No page errors.

## 4. Recommendations for the live build

1. **Compile, split and lazy-load.** Never compile JSX in the browser (the live site already builds with Vite). Split by site and route: FF Team, FF Business, FF Party and FF Admin load separately. The prototype is one page only because an artifact has one URL.
2. **Images from storage, not inside the page.** About 4 MB of the prototype is embedded pictures. On the live site, serve them from S3 or a CDN at the sizes they're shown, with `srcset`, and load below-the-fold images lazily.
3. **Icons and the map.**
   - **Icons:** the prototype loads the whole Lucide library for 114 icons. `lucide-react` with per-icon imports ships only what's used.
   - **Map:** Leaflet loads on every visit in the prototype. On the live site, load it only on screens with a map.
4. **One source of truth for names.** The prototype renames "FF Staff" to "FF Business" and removes "FF AI" by text replacement at build time. Do these as real renames in the live code. Text replacement can change data and identifiers it wasn't meant to.
5. **State.** The prototype keeps one global store with 41 saved keys. On the live site each of those becomes an API resource (the table in §2.3), loaded where it's used.
6. **Moderation is hide, never delete.** FF Admin is built on that rule:
   - every hide or show is logged;
   - admins are deactivated, not removed.

   Public routes (`GET /card/public/:ffTag`, lists, search, featured) must leave hidden records out.
7. **Security housekeeping.**
   - **Login code:** the backend's fixed sign-in code (now `619619`) must go before any public launch.
   - **API docs:** `/api/docs` should be gated again outside development.
   - **Maps key:** the frontend's `.env` was removed and ignored on 23 Oct (`b8e8714`, `7ed5129`), but the Google Maps key is still in the repo history. Rotate it, keep the new one in Amplify's environment settings, and restrict it to FireFlair domains.
8. **Area and town pages.** One list of areas, fed by every location entered: work locations, company areas, venues and events. Each area gets its own page, for example `ffparty.uk/hemel-hempstead`, using the same package cards, companies and people components, plus a sitemap.

## 5. Notes corrected

- **v17.3.38** said "Nothing in the app code changed". True, but compiling also removed the comments from the published page. Fixed here (§3.1).
- **v17.3.36 to v17.3.38** point to internal build files (`v11/admin17.jsx`, `v101/build.mjs`, `harness.mjs`). Those are not in this repo; the code is in `source/fireflair-app.jsx` (§1).
- **v17.3.36:** FF Admin's verification choice "Standard" is "Base" in Core, and FF Admin now says Base (§2.2.1).
- **v17.3.33:** the pay figure on FF Team package tiles was later replaced, in v17.3.34, by a fixed lookup (`PAY17`). `PAY_CUT17` no longer exists.
- **README:** it now says FF Business (not FF Staff) and explains the source file and the compiled page.
