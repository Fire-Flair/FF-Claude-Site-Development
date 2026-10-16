# FF Claude Site Development

Prototype code for FireFlair (FF Team, FF Staff, FF Party), built as a Claude
artifact. Each `fireflair-v*.html` file is one version of the whole prototype as
a single page: open it in a browser to run it. The highest number is the latest.

What changed in each version is in `CHANGELOG.md` and in the commit notes.

The prototype is a reference for the real site. Anything that needs a backend
(accounts, WhatsApp codes, saving, sharing, CV reading) sits behind clearly
marked adapters in the code (`AUTH_ADAPTER`, `PROFILE_ADAPTER`, `CV_ADAPTER`,
and others). Each one notes that no service is connected yet, and its function
bodies are what FireFlair Core replaces.

## FF Team Phase 1 Final

`ff-team-phase-1/` holds the separate Phase 1 reference prototype (FF Team as a
profile and networking platform), built from v16.15 and checked against
Griffy's frontend and backend. Start with `ff-team-phase-1/README.md`; the code
audit is `ff-team-phase-1/AUDIT.md`.

