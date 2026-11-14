/* ============================================================
   AHD IT Solutions — v2 shared script
   ====== CONFIG — owner fills these in (one place only) ======
   ============================================================ */
const WHATSAPP_NUMBER = "8801843817376"; // agency WhatsApp (owner-provided 2026-11-14)
const FACEBOOK_PAGE   = "https://www.facebook.com/ahditsolutions"; // owner-confirmed 2026-11-14

/* ---------- Floating WhatsApp button (all pages) ---------- */
if (WHATSAPP_NUMBER) {
  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello AHD IT Solutions! I want to discuss a project.')}`;
  wa.target = '_blank'; wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Chat with AHD IT Solutions on WhatsApp');
  wa.innerHTML = '<svg viewBox="0 0 24 24" width="27" height="27" fill="#fff"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3z"/></svg>';
  document.body.appendChild(wa);
}

/* ---------- Mobile menu ---------- */
const header = document.querySelector('header.site');
const burger = document.getElementById('burger');
if (header && burger) {
  burger.addEventListener('click', () => header.classList.toggle('open'));
  header.querySelectorAll('.mobile-menu a').forEach(a =>
    a.addEventListener('click', () => header.classList.remove('open')));
}

/* ---------- Sticky header state + back-to-top ---------- */
const toTop = document.querySelector('.to-top');
addEventListener('scroll', () => {
  if (header) header.classList.toggle('scrolled', scrollY > 24);
  if (toTop) toTop.classList.toggle('show', scrollY > 600);
}, { passive: true });
if (toTop) toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Proof strip marquee (duplicate track for seamless loop) ---------- */
const proofTrack = document.getElementById('proofTrack');
if (proofTrack) proofTrack.innerHTML += proofTrack.innerHTML;

/* ---------- Scroll reveal ---------- */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Count-up stats (real work numbers only) ---------- */
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  const dur = 1500, start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US');
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}
const cio = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); }
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

/* ---------- FAQ accordion ---------- */
document.querySelectorAll('.faq-q').forEach(btn => btn.addEventListener('click', () => {
  const item = btn.parentElement, wasOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) item.classList.add('open');
}));

/* ---------- Portfolio filter ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work[data-cat]');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  workCards.forEach(card => {
    const show = f === 'all' || card.dataset.cat.split(' ').includes(f);
    card.classList.toggle('hide', !show);
  });
}));

/* ---------- Project form -> WhatsApp brief ---------- */
const form = document.getElementById('projectForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const val = id => (document.getElementById(id)?.value || '').trim();
  const name = val('fName'), phone = val('fPhone'), email = val('fEmail'),
        service = val('fService'), budget = val('fBudget'), msg = val('fMsg');
  const method = form.querySelector('input[name="fMethod"]:checked')?.value || 'WhatsApp';
  if (!name || !phone || !msg) { alert('Please fill in your name, phone / WhatsApp number and project details.'); return; }
  const lines = [
    'Hello AHD IT Solutions!', '',
    `Name: ${name}`, `Phone: ${phone}`,
    ...(email ? [`Email: ${email}`] : []),
    `Service: ${service}`,
    ...(budget ? [`Budget: ${budget}`] : []),
    `Preferred contact: ${method}`,
    `Project: ${msg}`
  ];
  const ok = document.getElementById('formOk');
  if (ok) ok.style.display = 'block';
  if (WHATSAPP_NUMBER) open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank');
  else if (FACEBOOK_PAGE) open(FACEBOOK_PAGE, '_blank');
  form.reset();
  if (ok) ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
});
