/* src/components/staff/company-shape.jsx — part of the FireFlair prototype script (classic script, shared global scope; files are joined in the order of src/manifest.json). */
/* ==========================================================================
   THE COMPANY PAGE SHAPE (v17.6)

   One shape builds a company page. The builder writes it, the owner's page
   and every directory company read it, and the directory agent fills it.
   Field by field: docs/company-profile-format.md.

   company.info                 [{ id, title, lead, text, chips, numbered, quote }]   the "More information" sections (settings only)
   company.records["info_<id>"] the cards of that section (the shared card record)
   company.records.packages     the Packages cards
   company.records.cocktail_menu the Cocktails cards
   company.records.web_reviews  "Reviews from your website" (title = who said it, description = what they said)
   company.media                [{ id, src, alt }]   gallery photos; alt is the caption; the array order is the display order

   A card is the shared card record (makeRecord): name, description, media (up to 5), document, hidden, rank.
   Old sections that still hold items (info[].items) are read as cards, and CO_INFO_MIGRATE writes them to records.
   ========================================================================== */
const CO_MAX_MEDIA17 = 5;


const coInfoKey17 = (id) => "info_" + id;


/* The records a card category is read from: info sections, packages, cocktails, website reviews. */
const coRecsOf17 = (c, key) => ((c && c.records && c.records[key]) || []);


/* Old items ({ title, text, photo }) read as cards. */
function coLegacyCards17(sec) {
  return (sec.items || []).filter((it) => String(it.title || it.text || it.photo || "").trim()).map((it, i) => makeRecord("info", it.title || "", {
    id: sec.id + "_" + i,
    description: it.text || "",
    media: it.photo ? [{ id: sec.id + "_" + i + "_p", name: it.title || "", dataUrl: it.photo }] : [],
  }));
}


/* Every card of a section (hidden ones too), in display order. */
function coSecAll17(c, sec) {
  const key = coInfoKey17(sec.id);
  if (c && c.records && Array.isArray(c.records[key])) return c.records[key];
  return rankAll(coLegacyCards17(sec));
}


/* Cards people see: not hidden, not proposed, in display order. */
const coShownCards17 = (list) => rankedRecords(list || []).filter((r) => !r.hidden && !r.proposed && (String(r.name || "").trim() || String(r.description || "").trim() || (r.media || []).length));


const coSections17 = (c) => ((c && c.info) || []).filter((s) => s && String(s.title || "").trim());


const coPackages17 = (c) => coShownCards17(coRecsOf17(c, "packages"));


const coCocktails17 = (c) => coShownCards17(coRecsOf17(c, "cocktail_menu"));


const coWebReviews17 = (c) => coShownCards17(coRecsOf17(c, "web_reviews"));


const coPhotos17 = (r) => ((r && r.media) || []).map((m) => m.dataUrl).filter(Boolean);


/* Build a card record for source data (Vooshka, Raise the Bar) in the builder's own shape. */
function coCard17(category, id, title, text, photos) {
  return makeRecord(category, title, {
    id,
    description: text || "",
    media: (photos || []).filter(Boolean).slice(0, CO_MAX_MEDIA17).map((p, i) => ({ id: id + "_p" + i, name: title, dataUrl: p })),
  });
}


const coCardList17 = (category, idBase, rows) => rankAll(rows.map(([title, text, photos], i) => coCard17(category, idBase + "_" + i, title, text, photos)));


/* Photos picked in bulk become one card each, titled with the file name without its extension. */
const coTitleOfFile17 = (name) => String(name || "").replace(/\.[A-Za-z0-9]{1,5}$/, "").trim();


/* Reducer cases for the company page shape (run from v11Reducer). */
function coShapeReducer17(s, a) {
  const c = s.company || {};
  switch (a.type) {
    case "COMPANY_MEDIA_PATCH": return { ...s, company: { ...c, media: (c.media || []).map((m) => m.id === a.id ? { ...m, ...a.patch } : m) } };
    case "COMPANY_MEDIA_MOVE": {
      const list = [...(c.media || [])];
      const i = list.findIndex((m) => m.id === a.id), j = i + a.dir;
      if (i < 0 || j < 0 || j >= list.length) return s;
      [list[i], list[j]] = [list[j], list[i]];
      return { ...s, company: { ...c, media: list } };
    }
    /* A section and all of its cards go together. */
    case "CO_SECTION_DELETE": {
      const records = { ...(c.records || {}) };
      delete records[coInfoKey17(a.id)];
      return { ...s, company: { ...c, info: (c.info || []).filter((x) => x.id !== a.id), records } };
    }
    /* Old sections with items: the items become cards (once), and the section keeps its settings only. */
    case "CO_INFO_MIGRATE": {
      const info = c.info || [];
      if (!info.some((x) => x && x.items && x.items.length)) return s;
      const records = { ...(c.records || {}) };
      const next = info.map((sec) => {
        if (!sec || !sec.items) return sec;
        const key = coInfoKey17(sec.id);
        if (!Array.isArray(records[key])) records[key] = rankAll(coLegacyCards17(sec));
        const { items, ...rest } = sec;
        return rest;
      });
      return { ...s, company: { ...c, info: next, records } };
    }
    default: return null;
  }
}
