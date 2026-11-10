/* src/adapters/payment-adapter.js — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ADAPTER FILE — PAYMENT_ADAPTER
   CONTRACT SUMMARY (the real service keeps these names, inputs and outputs; see the comments below for details):
   available  (value)
   provider  (value)
   confirmPayment({ method, amount, reference, card })
   Nothing outside this file talks to a backend: the rest of the app calls PAYMENT_ADAPTER only. */
/* Buy FireFlair credits. HONEST STATUS: no payment provider is connected in
   this prototype — the adapter adds test credits and says so. In Core this
   runs through the payment-provider adapter; FireFlair never touches it. */
const PAYMENT_ADAPTER = {
  available: false,
  provider: "Stripe · Apple Pay · American Express",
  /* Prototype stand-in for Stripe. FireFlair Core replaces this with a Stripe PaymentIntent
     confirmed through the Stripe Payment Element. Resolves { ok, id } or { ok:false, error }.
     Test card 4000 0000 0000 0002 is declined; anything else passes. Nothing is charged. */
  confirmPayment({ method, amount, reference, card }) {
    return new Promise((resolve) => setTimeout(() => {
      if (card === "4000000000000002") resolve({ ok: false, error: "Your card was declined." });
      else resolve({ ok: true, id: "pi_test_" + Math.random().toString(36).slice(2, 10), method, amount, reference });
    }, method === "card" ? 1400 : 900));
  },
};
