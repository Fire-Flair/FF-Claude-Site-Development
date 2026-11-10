/* src/adapters/auth-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — AUTH_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   available  (value)
   note  (value)
   TAG_MIN  (value)
   TAG_MAX  (value)
   cleanTag(t)
   tagOk(t)
   _taken(t)
   _tag(tag)
   _phone(phone)
   isAvailable(tag, current)
   suggestTag(name)
   async sendSignupCode(tag, phone)
   async verifySignupCode(tag, phone, code)
   async setPassword(tag, password)
   async changeTag(oldTag, newTag)
   async loginWithPassword(tag, password)
   async sendCode(tag, phone)
   async verifyCode(tag, phone, code)
   async logout()
   Nothing outside this file talks to a backend: the rest of the app calls AUTH_ADAPTER only. */
/* ==========================================================================
   AUTH adapter — the ONLY place the app asks "who is this?".
   The nav, the login sheet and the reducer only ever see { tag, method }
   come back, so a live FireFlair Core auth API replaces these bodies and
   nothing above them changes.

   Account creation:  FF Tag + phone number -> WhatsApp one-time code ->
   account created. A password is optional and offered afterwards.
   Sign-in:           FF Tag + WhatsApp code (always), or FF Tag + password
                      (only once one has been created).

   FF TAG: a short username — 3 to 8 letters or numbers, unique, not case
   sensitive (stored lower case: alex, alexg, alex94). Eight is the most
   that fits cleanly on the Profile Card. It can be changed later.

   HONEST STATUS: no account service is connected and no WhatsApp message
   is sent. This mock accepts any available Tag, any mobile number of nine
   or more digits, any six-digit code, and any password of six or more
   characters.
   ========================================================================== */
const AUTH_ADAPTER = {
  available: false,
  note: "Prototype sign-in: no FireFlair account service is connected yet.",
  TAG_MIN: 3, TAG_MAX: 8,
  cleanTag: (t) => String(t || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8),
  tagOk: (t) => { const n = AUTH_ADAPTER.cleanTag(t).length; return n >= AUTH_ADAPTER.TAG_MIN && n <= AUTH_ADAPTER.TAG_MAX; },
  _taken: (t) => TAKEN_TAGS.some(x => x.toLowerCase() === t),
  _tag(tag) {
    const t = AUTH_ADAPTER.cleanTag(tag);
    if (!AUTH_ADAPTER.tagOk(t)) throw new Error("Your FF Tag is 3 to 8 letters or numbers.");
    return t;
  },
  _phone(phone) {
    if (String(phone || "").replace(/\D/g, "").length < 9) throw new Error("Enter your mobile number, with the country code if you're outside the UK.");
    return String(phone).trim();
  },
  /* Availability. Core checks this against every account; the mock checks
     a short list. `current` is the person's own Tag, which is never
     "taken" from their point of view. */
  isAvailable(tag, current) {
    const t = AUTH_ADAPTER.cleanTag(tag);
    if (!AUTH_ADAPTER.tagOk(t)) return false;
    return t === String(current || "").toLowerCase() || !AUTH_ADAPTER._taken(t);
  },
  /* A suggested Tag from the person's name: their first name where it's
     free (alex), then first name + initial (alexg), then name + number
     (alex94). Only ever a suggestion — the field stays editable. */
  suggestTag(name) {
    const words = String(name || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
    if (!words.length) return "";
    const first = words[0], rest = words.slice(1).join("");
    const pad = (x) => (x + rest).slice(0, 8);
    const options = [];
    if (first.length >= 3) options.push(first.slice(0, 8));
    if (rest) options.push((first.slice(0, 7) + rest[0]));
    options.push(pad(first));
    const free = options.find(t => AUTH_ADAPTER.tagOk(t) && !AUTH_ADAPTER._taken(t));
    if (free) return free;
    let h = 0; for (const ch of words.join("")) h = (h * 31 + ch.charCodeAt(0)) % 9973;
    const stem = pad(first).slice(0, 6);
    for (let i = 0; i < 90; i++) {
      const t = stem + String(10 + ((h + i) % 90));
      if (AUTH_ADAPTER.tagOk(t) && !AUTH_ADAPTER._taken(t)) return t;
    }
    return "";
  },
  async sendSignupCode(tag, phone) {
    await new Promise(r => setTimeout(r, 450));
    const t = AUTH_ADAPTER._tag(tag);
    if (!AUTH_ADAPTER.isAvailable(t)) throw new Error(`${t} is taken — try another Tag.`);
    return { sentTo: AUTH_ADAPTER._phone(phone), channel: "whatsapp" };
  },
  /* Verifying the code IS account creation: the Tag is reserved and the
     number is recorded as verified in the same step. */
  async verifySignupCode(tag, phone, code) {
    await new Promise(r => setTimeout(r, 450));
    const t = AUTH_ADAPTER._tag(tag);
    if (!/^\d{6}$/.test(String(code || ""))) throw new Error("The code is six digits.");
    return { tag: t, phone: AUTH_ADAPTER._phone(phone), method: "otp" };
  },
  async setPassword(tag, password) {
    await new Promise(r => setTimeout(r, 350));
    AUTH_ADAPTER._tag(tag);
    if (String(password || "").length < 5) throw new Error("Choose a password of at least 5 characters.");
    return { ok: true };
  },
  async changeTag(oldTag, newTag) {
    await new Promise(r => setTimeout(r, 400));
    const t = AUTH_ADAPTER._tag(newTag);
    if (t === String(oldTag || "").toLowerCase()) return { tag: t };
    if (!AUTH_ADAPTER.isAvailable(t, oldTag)) throw new Error(`${t} is taken — try another Tag.`);
    return { tag: t };
  },
  async loginWithPassword(tag, password) {
    await new Promise(r => setTimeout(r, 450));
    const t = AUTH_ADAPTER._tag(tag);
    if (String(password || "").length < 5) throw new Error("That password doesn't match this FF Tag.");
    return { tag: t, method: "password" };
  },
  async sendCode(tag, phone) {
    await new Promise(r => setTimeout(r, 450));
    AUTH_ADAPTER._tag(tag);
    if (String(phone || "").replace(/\D/g, "").length < 9) throw new Error("Enter the mobile number on your FireFlair account.");
    return { sentTo: phone, channel: "whatsapp" };
  },
  async verifyCode(tag, phone, code) {
    await new Promise(r => setTimeout(r, 450));
    const t = AUTH_ADAPTER._tag(tag);
    if (!/^\d{6}$/.test(String(code || ""))) throw new Error("The code is six digits.");
    return { tag: t, method: "otp" };
  },
  async logout() { await new Promise(r => setTimeout(r, 120)); },
};
