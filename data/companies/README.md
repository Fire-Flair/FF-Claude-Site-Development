# Company seeds

`seed-companies.json` holds ten real UK event bar companies as draft Company Cards. The prototype loads this file as data, and the developers can import the same file into the real site through the content API.

Rules for every record:

- **Unclaimed.** Shown as "Not yet claimed". Not offered for booking, no packages, no reviews, no Ask or Review buttons until the company claims the profile and verifies it.
- **Facts only.** The summary is written fresh from facts on the company's own site or a public listing. Nothing is copied word for word.
- **No images yet.** Logo and photos stay empty until the company grants permission or supplies them (`images.permission`). The card shows a monogram.
- **No prices, no personal contact details, no individuals' names.** Business contact details are collected separately for outreach, not stored in the card.
- **Source kept.** `source.urls` and `retrievedAt` record where each draft came from, so it can be re-checked.
- **Registered details** (`legalName`, `companyNumber`) come from the company's own site and are for matching against Companies House when verifying a claim.

Import behaviour for the developers: create each record as a draft with `status: unclaimed`, keep it hidden from public search and FF Party booking, and publish it only after a claim is verified (for example a code sent to a company email address or phone).
