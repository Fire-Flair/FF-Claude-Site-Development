/* src/components/team/qa17.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   Q&A (Phase 2 Final, stage 3A)
   Three categories wherever Q&A is listed: "About me" (FireFlair's standard questions and the person's own), "Asked"
   (questions other people sent) and "Interests" (derived from the saved "I'm interested" answers). Feedback questions stay
   private and outside the filter. Each answer is Public or Private; Private is the default, Interests default to Public.
   ========================================================================== */
const QA_CATS17 = [["all", "All"], ["about", "About me"], ["asked", "Asked"], ["interest", "Interests"]];


/* A compact two-state switch: Public / Private. */
function VisSwitch17({ value, onChange }) {
  return (
    <div className="ff-vis17" role="group" aria-label="Who can see this answer">
      {[["public", "Public"], ["private", "Private"]].map(([k, l]) => (
        <button key={k} type="button" aria-pressed={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{l}</button>
      ))}
    </div>
  );
}


/* The chip row above a Q&A list. Chips with no items are hidden, and so is the whole row when there is nothing to choose between. */
function QaFilter17({ counts, value, onChange }) {
  const chips = QA_CATS17.filter(([k]) => k !== "all" && counts[k] > 0);
  if (chips.length < 2) return null;
  const all = chips.reduce((n, [k]) => n + counts[k], 0);
  return (
    <div className="ff-qa-tabs ff-qa-filter17" role="tablist" aria-label="Q&A categories">
      {[["all", "All", all], ...chips.map(([k, l]) => [k, l, counts[k]])].map(([k, l, n]) => (
        <button key={k} type="button" role="tab" aria-selected={value === k} className={value === k ? "on" : ""} onClick={() => onChange(k)}>{l} <span>{n}</span></button>
      ))}
    </div>
  );
}


/* "Interested in <title>?" = Yes cards, read from the saved int.* answers (nothing is stored twice).
   For someone else: the packages on their public profile. */
const INT_QIDS17 = ["int.training", "int.jobs", "int.rewards", "int.party_package"];


function interestCards17(state, person) {
  const mk = (qid, key, title) => { const id = `${qid}:${key}`; return { id, text: `Interested in ${title}?`, answer: "Yes", group: "interest", vis: qaVisOf17(state, { id }) }; };
  if (person && person.id !== "me") {
    return (person.serviceInterest || []).map(id => mk("int.party_package", id, qaOptionLabel17("int.party_package", id))).map(c => ({ ...c, vis: "public" }));
  }
  if (!(state.auth && state.auth.status === "signedIn")) return [];
  const accts = [...new Set([qaAccount17(state), "me", state.session && state.session.tag].filter(Boolean))];
  const out = [];
  INT_QIDS17.forEach(qid => {
    const ans = accts.map(a => qaAnswer17(state, a, qid)).find(Boolean);
    if (!ans) return;
    (ans.optionIds || []).forEach(id => out.push(mk(qid, id, qaOptionLabel17(qid, id))));
    (ans.own || []).forEach(t => out.push(mk(qid, `own:${t}`, t)));
  });
  return out;
}


/* A card in Interests: shows the question, "Yes" and the Public / Private switch. */
function InterestSheet17({ card, onClose }) {
  const { state, dispatch } = useStore();
  if (!card) return null;
  const vis = qaVisOf17(state, { id: card.id });
  return (
    <Sheet open onClose={onClose} title="Interest">
      <p className="ff-serif" style={{ fontSize: 19, lineHeight: 1.35, marginTop: 0 }}>{card.text}</p>
      <p className="ff-body" style={{ margin: "0 0 12px", fontWeight: 700 }}>Yes</p>
      <VisSwitch17 value={vis} onChange={(v) => dispatch({ type: "QA_VIS", qid: card.id, visibility: v })} />
    </Sheet>
  );
}
