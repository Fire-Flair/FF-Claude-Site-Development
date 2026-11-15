# Claiming a company page, Phase 2 (prototype v17.8)

One company page, one format, three writers (the agent, FireFlair, the owner). Nothing a person wrote is lost or silently replaced. Nothing shows as claimed or approved until FireFlair has approved it.

Code: `src/state/claims17.js` (claims, FireFlair edits, who wrote what), `src/components/admin/admin-ui.jsx` (the Claims list), `src/components/staff/network-directory.jsx` (the buttons on a company page), `src/components/staff/company-cards.jsx` (the join step and Find your company).

## What a visitor sees

- A directory company that nobody has claimed shows **Claim this profile** on FF Staff. It does not show on FF Team or FF Party, and it does not show once a claim is being checked or approved.
- The button starts the same create-a-company steps as a new company, with the page as it is now already in the builder: the About text, the sections with their tags, the contact cards, the areas, the packages, cocktails and questions.
- What the agent wrote shows a plate, **From your website**, on the About row, the section rows, the contact row and the cards. A card the agent was unsure of shows as **New**; the company chooses **Keep** or **Remove**.
- Changing something removes its plate and sets `source.by` to `owner`. The rest keep their plates.
- Save shows the finished page with Edit.
- The company's public page shows the edit but still looks unclaimed (no logo, no coin, no Ask, no Review) and says **Claim being checked**.
- **Find your company**: a closed row at the top of the create-a-company page. Part of a name shows its Company Card; choosing it opens its page, where Claim this profile is.

## What FireFlair sees

- **Claims** in FF Admin (FF Staff and All sites): each claim with its company, **Approve** and **Reject**. The permission is `claims`.
- **Approve** makes the page claimed: FireFlair logo and coin, Ask a question, Review, tabs, and it is listed with the claimed companies.
- **Reject** brings the directory version back for everyone. The owner keeps their own copy, comes back with the same phone number, and sees **Claim not approved**.
- **Edit** on any company page, in an admin session whose role has the permission `edit`: opens the builder on that page. What FireFlair changes is stamped `source.by` `fireflair`. Save keeps the edits, Cancel drops them. **Company details** then holds the text and image permission and the legal form, legal name and company number (the profile's `meta.permission` and `meta.legal`).

## State

| Key | What it holds |
| --- | --- |
| `session.claimSlug` | The company the visitor pressed Claim this profile on |
| `coClaims17` | `{ id, slug, phone, at, status: pending, approved or rejected, company }`; `company` is the owner's copy in the builder's shape |
| `dirEdits17[slug]` | FireFlair's edits of a directory page, in the builder's shape |
| `company.meta.status` | `claim-pending` while checked, `claimed` once approved, `directory` if not approved (the same words as the profile file) |

Rules the code keeps: one claim at a time on a page (and one per owner); a person's words are stamped by the reducer, not by each screen; the three keys above survive signing out; a company is never claimed by editing a file.

## What Core has to do

- Keep the claim, the owner's copy and FireFlair's edits as records of the company, and keep the agent's file unchanged. The agent writes nothing once the status is `claim-pending` or `claimed`.
- Let FireFlair approve or reject, and keep the phone number of the claimant in the private contact record, never in a profile file.
- On approval, copy the page into the main tables, as `docs/shared-data-repo.md` describes.

## Text for FF Notifications section 5.4

**Who is invited.** Limited companies, by email, until there is a consent route for sole traders. This is unchanged from v1.4. It needs a legal check before anything is sent. This is not legal advice.

**What the invitation says.** The company has a page on FF Staff, written from its own website. It can check the page, correct it, and claim it. Nothing on the page is shown as claimed until FireFlair has approved the claim.

**The link.** `ffstaff.uk/<slug>`, where `<slug>` is the company's address on FireFlair. It opens the company's page.

**The claim steps.**

1. Open the link and choose Claim this profile.
2. Enter a mobile number and the six-digit code that is sent to it.
3. Check the page, change anything that is wrong, and Save.
4. The page shows Claim being checked until FireFlair has approved it.

**FireFlair checks each claim.** A person at FireFlair looks at every claim before the page shows as claimed. If a claim is not approved, the directory page comes back and the owner is told.

**Opt out and removal.** Every invitation has a way to say "do not contact us again", and a company can ask FireFlair to remove its page. Once a company opts out, nothing more is sent.

**No company contact details.** The invitation text, this document and every profile file hold no company email address or phone number. Core keeps those in the private contact record.

### Section 6 table row

| Item | Status |
| --- | --- |
| Claim this profile | Now built in the prototype |
