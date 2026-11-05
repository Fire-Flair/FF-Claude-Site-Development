# Business & Support module (v17.3.74, compact)

Sits last on the FF Team home page, after the join section. Gold-framed ivory box in the
same style as "Built on trust"; squircle corners; no word splits (wraps between words only).

Files
- BusinessSupport.jsx: React component. Render it as the last section of the FF Team home.
- business-support.css: styles. Every selector sits under `.ff`, the site's existing root class.
- business-support.html.snippet: the same markup as plain HTML, for a non-React page.
- business-support-preview.html: open in a browser to see the module on its own.

Content
- FFTeam.uk is operated by FIREFLAIR LTD. Company no. 17240998, incorporated 25 May 2026. Registered in England and Wales.
- Office: 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ
- Customer support: MrG@FFVip.uk (mailto:mrg@ffvip.uk), +442045 020424 (tel:+442045020424)
- Legal line: (c) 2026 FIREFLAIR LTD. All rights reserved.

Uses the site's existing `--display` (Cinzel) and `--gold-dk` tokens, with fallbacks defined in the CSS.
Stacks to one column on phones; two columns from 640px.
