/* v17.35: Review Cards (option 1, Mr G). The home-page Review Card made real, shown only in a profile's Reviews tab.
   Dark gold landscape card: "Review Card" plate, FF logo, stars (worked together) or words only (not worked together),
   the review, the writer, and a black footer with the writer's address and the date. The writer's own waiting review
   has a burgundy footer "Waiting for {First} to accept". The card grows with its words; nothing is cut. */

/* The writer of one review: name, address tag, photo or company logo. */
function reviewWriter35(state, dir, raw) {
  const name = raw.byName || "FireFlair member";
  const co = typeof COMPANY_PAGES !== "undefined" ? Object.values(COMPANY_PAGES).find(c => c && c.name && c.name === name) : null;
  if (co) return { name, tag: co.tag || co.slug || "", logo: co.logo || null, photo: null };
  if (raw.byId === "me") return { name, tag: (state.session && state.session.tag) || "", photo: (state.profile && state.profile.photo) || null, logo: null };
  const p = (dir || []).find(x => x.id === raw.byId);
  return { name, tag: (p && p.tag) || "", photo: (p && p.photo) || null, logo: null };
}

const initials35 = (n) => String(n || "").trim().split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("") || "F";

const date35 = (t) => { if (!t) return ""; try { return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); } catch (e) { return ""; } };

/* One Review Card. rec: a record from reviewRecordsFor; raw: the stored review; about: the person reviewed. */
function ReviewCard35({ rec, raw = {}, writer, about, onOpen }) {
  const pending = !!rec.pending;
  const rating = raw.rating != null ? raw.rating : rec.rating;
  /* Old reviews with no `worked` count as accepted and show stars only if they have a rating. */
  const n = raw.worked === false || rating == null ? 0 : Math.max(1, Math.min(5, Math.round(rating)));
  const first = about && about.isCompany ? about.name : String((about && about.name) || "").split(" ")[0] || "them";
  const text = raw.text != null ? raw.text : rec.description;
  const w = writer || { name: raw.byName || "", tag: "", photo: null, logo: null };
  const pic = w.logo || w.photo || null;
  const label = `Review Card from ${w.name}${n ? `: ${n} out of 5 stars` : ""}. ${text || ""}${pending ? ` Waiting for ${first} to accept.` : ""}`;
  const Tag = onOpen ? "button" : "article";
  return (
    <Tag className={"ff-rc35" + (pending ? " pend" : "")} {...(onOpen ? { type: "button", onClick: () => onOpen(rec), "aria-label": label } : { "aria-label": label })}>
      <span className="in">
        <span className="pl">Review Card</span>
        <span className="lg" aria-hidden="true"><FFLogo size={30} /></span>
        {n > 0 && (
          <span className="st" aria-hidden="true">
            {[0, 1, 2, 3, 4].map(i => <Star key={i} size={20} strokeWidth={1.6} color={i < n ? "#E8C75E" : "#8C7A45"} fill={i < n ? "#E8C75E" : "none"} />)}
          </span>
        )}
        {text ? <span className="tx">{text}</span> : null}
        <span className="by">
          <span className={"av" + (w.logo ? " lg" : w.photo ? " ph" : "")}>{pic ? <img decoding="async" src={pic} alt="" draggable={false} /> : initials35(w.name)}</span>
          <b>{w.name}</b>
        </span>
      </span>
      {pending
        ? <span className="ft wait"><Clock size={15} strokeWidth={2} aria-hidden="true" /><span>Waiting for {first} to accept</span></span>
        : <span className="ft">{w.tag ? <span className="ad">{CARD_DOMAIN}/{pc17Tag(w.tag)}</span> : <span />}<span className="dt">{date35(raw.at)}</span></span>}
    </Tag>
  );
}

/* Every review of a person as Review Cards: one per row on phones, a wrapping grid on wider screens.
   children go after the cards in the same grid (the "Waiting on" and "Ask for a review" tiles on your own profile). */
function ReviewCards35({ person, records, onOpen, children }) {
  const { state } = useStore();
  const dir = useDirectory();
  const list = records || reviewRecordsFor(state, person.id);
  return (
    <div className="ff-rc35-list">
      <style>{RANK_CSS17}</style>
      {list.map(rec => {
        const raw = (state.reviews || []).find(x => x.id === rec.id) || {};
        return <ReviewCard35 key={rec.id} rec={rec} raw={raw} writer={reviewWriter35(state, dir, raw)} about={person} onOpen={onOpen} />;
      })}
      {children}
    </div>
  );
}

/* The Reviews tab of a profile (yours or someone else's): drop-in for ReviewsTab17. A tap opens the card on its own. */
function ReviewsTab35({ person }) {
  const { state } = useStore();
  const dir = useDirectory();
  const [open, setOpen] = useState(null);
  const first = String(person.name || "").split(" ")[0] || "them";
  const list = reviewRecordsFor(state, person.id);
  const raw = open ? (state.reviews || []).find(x => x.id === open.id) || {} : {};
  return (<>
    {list.length
      ? <ReviewCards35 person={person} records={list} onOpen={setOpen} />
      : <TabEmpty17 icon={<Award size={20} />}>{person.id === "me" || !String(person.name || "").trim() || /^your$/i.test(first) ? "No reviews yet." : `No reviews for ${first} yet.`}</TabEmpty17>}
    <Sheet open={!!open} onClose={() => setOpen(null)} title="Review">
      {open && <div className="ff-rc35-full"><ReviewCard35 rec={open} raw={raw} writer={reviewWriter35(state, dir, raw)} about={person} /></div>}
    </Sheet>
  </>);
}
