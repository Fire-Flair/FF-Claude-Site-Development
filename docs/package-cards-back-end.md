# Package cards: back-end note for developers (Alex, 19 Nov 2026)

**For now, package cards are saved through the Q&A system. Nothing more.**

- This covers the FFParty package cards (including Create your own, with its name, line, You provide, Ideal for, Duration and You earn) and the FFStaff shift cards on the FFTeam Bookings tab.
- Signing up on a card only records the member's interest. Do not build separate package, pricing, matching or booking tables for it yet. The goal at this stage is to capture interest.
- Store each sign-up, withdrawal and Create your own entry as a Q&A answer against the member, in the same way as the other profile Q&A.
- The Q&A system is going to expand a lot. Alex has GPT building a Google Sheet for it. **When that sheet is ready, add the package-card questions and fields to it** (Claude will do this once the sheet exists).
- Until the rest of the back end is built, nothing else reads these records.

Front-end: `src/components/team/bookings.jsx` (`BkPkgOwn17`, sign-up and withdraw handlers) and `src/components/team/profile-packages.jsx`.
