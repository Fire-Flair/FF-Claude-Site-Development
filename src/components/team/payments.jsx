/* src/components/team/payments.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ---------------------------------------------------------------------------
   STRIPE PAY WINDOW (v17.4) — the pop-up that opens from "Confirm" / "Pay and
   send on WhatsApp". HONEST STATUS: no payment provider is connected in this
   prototype, so nothing is charged. PAYMENT_ADAPTER.confirmPayment below is
   what FireFlair Core replaces with a Stripe PaymentIntent and the Stripe
   Payment Element (Apple Pay and Google Pay included). The booking requests
   are sent only after confirmPayment resolves ok, exactly as the live flow
   must do (event stays a draft until paid).
   Test behaviour: card 4000 0000 0000 0002 is declined; any other card passes.
   --------------------------------------------------------------------------- */
const STRIPE17_CSS = __ff_css("styles/stripe17.css");


const stripeGroup17 = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();


const stripeExp17 = (v) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + " / " + d.slice(2) : d; };



function StripePay17({ total, reference, onPaid, onClose, payLabel }) {
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [nm, setNm] = useState("");
  const [phase, setPhase] = useState("form"); // form | busy | done
  const [err, setErr] = useState("");
  const first = useRef(null);
  const digits = num.replace(/\D/g, "");
  const ed = exp.replace(/\D/g, "");
  const mm = Number(ed.slice(0, 2)), yy = 2000 + Number(ed.slice(2, 4));
  const now = new Date();
  const expOk = ed.length === 4 && mm >= 1 && mm <= 12 && (yy > now.getFullYear() || (yy === now.getFullYear() && mm >= now.getMonth() + 1));
  const valid = digits.length >= 13 && expOk && cvc.length >= 3 && nm.trim().length > 1;
  const busy = phase === "busy";
  useEffect(() => { if (first.current) first.current.focus(); }, []);
  useEffect(() => {
    const k = (e) => { if (e.key === "Escape" && phase !== "busy") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [phase, onClose]);
  const run = (method) => {
    setErr(""); setPhase("busy");
    PAYMENT_ADAPTER.confirmPayment({ method, amount: total, reference, card: method === "card" ? digits : "" }).then((r) => {
      if (!r.ok) { setPhase("form"); setErr(r.error || "The payment didn't go through."); return; }
      setPhase("done");
      setTimeout(() => onPaid(r), 700);
    });
  };
  return ReactDOM.createPortal(
    <div className="ff-stp-scrim" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy && phase !== "done") onClose(); }}>
      <style>{STRIPE17_CSS}</style>
      <div className="ff-stp" role="dialog" aria-modal="true" aria-label="Pay with Stripe">
        <div className="ff-stp-top">
          <div><div className="ff-stp-brand">FireFlair</div><div className="ff-stp-amt">£{total}</div></div>
          <button type="button" className="ff-stp-x" aria-label="Close" disabled={busy || phase === "done"} onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <form className="ff-stp-body" onSubmit={(e) => { e.preventDefault(); if (valid && phase === "form") run("card"); }}>
          <div className="ff-stp-ex">
            <button type="button" disabled={phase !== "form"} onClick={() => run("apple")}>Apple Pay</button>
            <button type="button" className="g" disabled={phase !== "form"} onClick={() => run("google")}>Google Pay</button>
          </div>
          <div className="ff-stp-or">Or pay with card</div>
          <div className="ff-stp-f">
            <label htmlFor="ff-stp-num">Card number</label>
            <input id="ff-stp-num" ref={first} inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" value={num} disabled={phase !== "form"} onChange={(e) => setNum(stripeGroup17(e.target.value))} />
          </div>
          <div className="ff-stp-2">
            <div className="ff-stp-f">
              <label htmlFor="ff-stp-exp">Expiry</label>
              <input id="ff-stp-exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" value={exp} disabled={phase !== "form"} onChange={(e) => setExp(stripeExp17(e.target.value))} />
            </div>
            <div className="ff-stp-f">
              <label htmlFor="ff-stp-cvc">CVC</label>
              <input id="ff-stp-cvc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" value={cvc} disabled={phase !== "form"} onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} />
            </div>
          </div>
          <div className="ff-stp-f">
            <label htmlFor="ff-stp-nm">Name on card</label>
            <input id="ff-stp-nm" autoComplete="cc-name" value={nm} disabled={phase !== "form"} onChange={(e) => setNm(e.target.value)} />
          </div>
          {err && <p className="ff-stp-err" role="alert">{err}</p>}
          <button type="submit" className={`ff-stp-pay${phase === "done" ? " ok" : ""}`} disabled={phase === "form" ? !valid : true}>
            {phase === "busy" && <span className="ff-stp-spin" aria-hidden="true" />}
            {phase === "busy" ? "Processing" : phase === "done" ? "Paid" : payLabel ? `${payLabel} · £${total}` : `Pay £${total}`}
          </button>
          <div className="ff-stp-foot"><span>Powered by <b>stripe</b></span><span className="ff-stp-test">Test mode</span></div>
        </form>
      </div>
    </div>,
    document.body
  );
}




function BuyCreditsSheet({ open, need, onClose }) {
  const { state, dispatch } = useStore();
  const [n, setN] = useState(need || 1);
  useEffect(() => { if (open) setN(Math.max(1, need || 1)); }, [open, need]);
  if (!open) return null;
  return (
    <Sheet open onClose={onClose} title="Buy FireFlair credits">
      <p className="ff-body" style={{ marginTop: 0 }}>
        One credit ({CREDIT_FEE} connection fee) per Service Card you send for availability. It's only used when that person confirms.
      </p>
      <Field label="Credits">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button className="ff-btn sm ghost" onClick={() => setN(Math.max(1, n - 1))}>−</button>
          <span className="ff-display" style={{ fontSize: 26, minWidth: 40, textAlign: "center" }}>{n}</span>
          <button className="ff-btn sm ghost" onClick={() => setN(n + 1)}>+</button>
          <span className="ff-body ff-muted" style={{ marginLeft: "auto", fontSize: 12 }}>You have {state.credits?.balance || 0}</span>
        </div>
      </Field>
      <Btn variant="primary wide" onClick={() => {
        dispatch({ type: "CREDITS_BUY", n });
        dispatch({ type: "TOAST", toast: `${n} credit${n === 1 ? "" : "s"} added` });
        onClose();
      }}><CreditCard size={15} /> Buy {n} credit{n === 1 ? "" : "s"}</Btn>
      <p className="ff-body ff-muted" style={{ fontSize: 11.5, marginBottom: 0 }}>
        Prototype: no payment provider is connected, so no money is taken — test credits are added. Live payments run through {PAYMENT_ADAPTER.provider}. Unused credits are non-refundable and stay available for future bookings.
      </p>
    </Sheet>
  );
}
