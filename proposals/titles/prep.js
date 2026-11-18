() => {
  const dx = document.querySelector('.ff-dx-h'); if (dx) dx.textContent = 'What is FF Team?';
  const big = [...document.querySelectorAll('.ff-big20')];
  big.forEach((h, i) => {
    const isH1 = h.tagName === 'H1' || (i === 0 && /^Bookings$/.test(h.innerText.trim()));
    h.classList.add(isH1 ? 'tl-h1' : 'tl-h2'); if (isH1) h.setAttribute('data-eb', 'FF Team');
  });
  document.querySelectorAll('.ff-dx-h, .ff-qg-title').forEach(h => h.classList.add('tl-h2'));
  document.querySelectorAll('.ff-about-h').forEach(h => {
    h.classList.add('tl-p');
    let n = h; while (n && n.parentElement) { let p = n.previousElementSibling; while (p && p.tagName === 'STYLE') p = p.previousElementSibling; if (p) break; n = n.parentElement; }
    if (n) n.classList.add('tl-psec');
  });
  // hide fixed bars at the bottom for full-page shots
  for (const e of document.querySelectorAll('body *')) { const s = getComputedStyle(e); if (s.position === 'fixed' && e.getBoundingClientRect().bottom >= innerHeight - 2 && e.getBoundingClientRect().top > innerHeight * 0.5) e.style.visibility = 'hidden'; }
  return document.querySelectorAll('.tl-h1,.tl-h2,.tl-p').length;
}
