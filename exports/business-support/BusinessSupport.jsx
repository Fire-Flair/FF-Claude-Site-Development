// FireFlair — Business & Support module (v17.3.72)
// React component for the bottom of the FF Team home page. Pair with business-support.css.
// No dependencies beyond React: the two icons are inline SVG.
import React from "react";

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
);
const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
);

const Row = ({ label, children }) => (
  <div className="ff-biz19-row"><dt>{label}</dt><dd>{children}</dd></div>
);

export default function BusinessSupport() {
  return (
    <section className="ff-sect ff-biz19" id="ff-business" aria-labelledby="ff-biz19-h">
      <div className="ff-biz19-box">
        <span className="eb">FireFlair Ltd</span>
        <h2 id="ff-biz19-h" className="ff-biz19-h">Business &amp; Support</h2>
        <p className="ff-biz19-lead">FFTeam.uk is operated by FIREFLAIR LTD.</p>
        <div className="ff-biz19-grid">
          <div className="ff-biz19-pane">
            <h3>Business</h3>
            <dl style={{ margin: 0 }}>
              <Row label="Registered in">England and Wales</Row>
              <Row label="Company number">17240998</Row>
              <Row label="Registered office">71–75 Shelton Street, Covent Garden, London, <span className="ff-biz19-nb">WC2H 9JQ</span></Row>
            </dl>
          </div>
          <div className="ff-biz19-pane">
            <h3>Customer support</h3>
            <a className="ff-biz19-link" href="mailto:mrg@ffvip.uk">
              <span className="ff-biz19-ic"><MailIcon /></span>
              <span className="ff-biz19-tx"><small>Email</small><b>mrg@ffvip.uk</b></span>
            </a>
            <a className="ff-biz19-link" href="tel:+442045020424">
              <span className="ff-biz19-ic"><PhoneIcon /></span>
              <span className="ff-biz19-tx"><small>Phone</small><b>+44 20 4502 0424</b></span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
