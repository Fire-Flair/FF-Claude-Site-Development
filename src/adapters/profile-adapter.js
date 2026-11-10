/* src/adapters/profile-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — PROFILE_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   available  (value)
   async save(tag)
   async share(tag, phone)
   async shareTo(tag, phone)
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
  /* Add FF: send the card to someone else's number. */
  async shareTo(tag, phone) {
    await new Promise(r => setTimeout(r, 450));
    return { sentTo: String(phone).trim(), channel: "whatsapp", url: `${CARD_DOMAIN}/${tag}` };
  },
};
