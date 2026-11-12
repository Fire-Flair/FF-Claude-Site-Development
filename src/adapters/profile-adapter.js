/* src/adapters/profile-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — PROFILE_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   available  (value)
   async save(tag)
   async share(tag, phone)
   async shareTo(tag, phone)
   async saveContent(tag, content)   -> { ok, content } | { ok: false, reason, kind, id }   (v17.4.6)
   Nothing outside this file talks to a backend: the rest of the app calls PROFILE_ADAPTER only. */
/* PROFILE adapter — where the profile goes once the account exists.
   save():  called automatically as cards are created or changed (and by the
            Save button). The prototype already keeps everything in this
            page's own storage, so the mock only reports the time.
   share(): sends the Profile Card to the person's verified WhatsApp number.
   HONEST STATUS: not connected — nothing leaves this page. */
const PROFILE_ADAPTER = {
  available: false,
  async save(tag) { return { savedAt: Date.now() }; },
  async share(tag, phone) {
    await new Promise(r => setTimeout(r, 500));
    return { sentTo: phone || "your verified number", channel: "whatsapp", url: `${CARD_DOMAIN}/${tag}` };
  },
  /* Build your packages (v17.4.6): the one versioned content field on the profile.
     Live API: no supported profile extension field is documented (ff-team-phase-1/AUDIT.md §4 lists
     PATCH /api/user/card/profile and the card section routes only), so production needs
       PUT /api/user/card/content   body { v, rev, cocktails, services, stories }   (authenticated, owner only)
       GET /api/user/card/content   (owner)   and   content in GET /api/user/card/public/:ffTag (published only)
     with this same validation server-side. See docs/handoff-v17.4.6.md.
     SIMULATED: validation runs here and the store is the persistence. */
  async saveContent(tag, content) {
    await new Promise(r => setTimeout(r, 120));
    const clean = pcClean17(content, 0);
    const bad = pcValidate17(clean, clean && clean.owner, tag);
    if (bad) return { ok: false, ...bad };
    return { ok: true, content: { ...clean, rev: (clean.rev || 0) + 1, updatedAt: new Date().toISOString() } };
  },
  /* Add FF: send the card to someone else's number. */
  async shareTo(tag, phone) {
    await new Promise(r => setTimeout(r, 450));
    return { sentTo: String(phone).trim(), channel: "whatsapp", url: `${CARD_DOMAIN}/${tag}` };
  },
};
