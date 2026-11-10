/* src/adapters/wallet-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — WALLET_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   available  (value)
   note  (value)
   async passFor(payload)
   Nothing outside this file talks to a backend: the rest of the app calls WALLET_ADAPTER only. */
/* Apple Wallet adapter — same honesty pattern as CV_ADAPTER. No pass-signing

   service is connected in this prototype, so passKit() reports that plainly
   rather than faking a .pkpass download. A live adapter would generate and
   sign a real pass from the same profile/booking data passed in here. */
const WALLET_ADAPTER = {
  available: false,
  note: "Wallet passes aren't connected in this prototype — Apple and Google passes need to be signed by a real wallet service. This is where that request would go.",

  /* Contract a live adapter must satisfy: given { kind: "profile"|"booking", ...data },
     -> a signed .pkpass file (or a URL to one) for the browser to open. */
  async passFor(payload) {
    await new Promise(r => setTimeout(r, 500));
    const err = new Error(WALLET_ADAPTER.note);
    err.notConnected = true;
    throw err;
  },
};
