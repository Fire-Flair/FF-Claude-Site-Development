# Company seeds

`seed-companies.json` holds 30 real UK event bar companies as draft Company Cards. The prototype loads this file as data, and the developers can import the same file into the real site through the content API.

Rules for every record:

- **Unclaimed.** The card carries no FireFlair logo or coin until the claim is verified; the page shows "Not yet claimed". Not offered for booking, no packages, no reviews, no Ask or Review buttons until the company claims the profile and verifies it.
- **Facts only.** The summary is written fresh from facts on the company's own site or a public listing. Nothing is copied word for word.
- **Images.** `images.logo`, `logoBg` ("dark" or "light" backing), `logoWide`, and `photos` link to the company's own site, used with the owners' permission (`images.permission`). The prototype hotlinks them and falls back to a monogram if one fails to load. Developers should fetch and host copies; companies can replace or delete them once they claim. Records with no images yet show a monogram.
- **No prices, no personal contact details, no individuals' names.** Business contact details are collected separately for outreach, not stored in the card.
- **Source kept.** `source.urls` and `retrievedAt` record where each draft came from, so it can be re-checked.
- **Registered details** (`legalName`, `companyNumber`) come from the company's own site and are for matching against Companies House when verifying a claim.

Import behaviour for the developers: create each record as a draft with `status: unclaimed`, keep it hidden from public search and FF Party booking, and publish it only after a claim is verified (for example a code sent to a company email address or phone).

Map locations: each record has `locations`, a list of area-level pins (`label`, `lat`, `lng`, `approx`). They are town centres, never addresses. `approx: true` means the base was not stated on the company's own site or listing and needs confirming with the company. The prototype shows one pin per location on the map on FF Team, FF Staff and FF Party (pins are nudged apart where several companies share a town). `images.permission` is `granted` for the first ten and `to_confirm` for the rest.
