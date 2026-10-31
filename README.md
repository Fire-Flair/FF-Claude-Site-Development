# FF Claude Site Development

Prototype code for FireFlair (FF Team, FF Business, FF Party, FF VIP and FF Admin),
built as a Claude artifact. Each `fireflair-v*.html` file is one version of the whole prototype as
a single page: open it in a browser to run it. The highest number is the latest.

What changed in each version is in `CHANGELOG.md` and in the commit notes.

The page is compiled before it is published, so it has no comments. The readable
source of the latest page, with every comment, is `source/fireflair-app.jsx`
(images shortened to markers). Read that, not the `.html`. `REVIEW.md` is the
latest code review: how the prototype lines up with the live frontend and
backend, what is still prototype-only, and what the live build should do.

The prototype is a reference for the real site. Anything that needs a backend
(accounts, WhatsApp codes, saving, sharing, CV reading) sits behind clearly
marked adapters in the code (`AUTH_ADAPTER`, `PROFILE_ADAPTER`, `CV_ADAPTER`,
`NETWORK_ADAPTER`, `ADMIN_ADAPTER` and others). Each one notes that no service is connected yet, and its function
bodies are what FireFlair Core replaces.

## FF Team Phase 1

`ff-team-phase-1/` holds the separate Phase 1 reference prototype (FF Team as a
profile and networking platform), built from v16.15 and checked against
Griffy's frontend and backend. Latest: `ff-team-phase-1-v1.7.1.html` (v1.7.1, in
development). Start with `ff-team-phase-1/README.md`; the code audit is
`ff-team-phase-1/AUDIT.md`.

