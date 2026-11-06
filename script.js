'use strict';
(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const menu = $('#menu-button');
  const nav = $('#site-nav');
  menu?.addEventListener('click', () => {
    const isOpen = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(isOpen));
    nav.classList.toggle('open', isOpen);
  });
  $$('.site-nav a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menu?.setAttribute('aria-expanded', 'false');
  }));
  document.addEventListener('click', event => {
    if (nav?.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) {
      nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false');
    }
  });
  const io = ('IntersectionObserver' in window) && !matchMedia('(prefers-reduced-motion: reduce)').matches
    ? new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); io.unobserve(entry.target); } });
    }, { threshold: .09 }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('visible'));
  $$('#year').forEach(el => el.textContent = String(new Date().getFullYear()));
  // Original property photo -> licensed third-party illustrative stock -> local original SVG.
  // Every replacement is explicitly identified as illustrative, never as an actual hotel photo.
  $$('img[data-fallback], .photo-box[data-fallback] img').forEach(img => {
    const fallback = img.dataset.fallback || img.closest('[data-fallback]')?.dataset.fallback;
    if (!fallback) return;
    img.addEventListener('error', () => {
      if (!img.dataset.hasStock && img.dataset.stock) {
        img.dataset.hasStock = '1';
        img.src = img.dataset.stock;
        img.alt = 'Illustrative stock hotel photography, not an image of Spotlight Hotel';
        img.closest('.gallery-item')?.setAttribute('data-image-unavailable', 'true');
        const heroNote=img.closest('.hero-portrait')?.querySelector('.photo-note');
        if (heroNote) heroNote.textContent = 'ILLUSTRATIVE STOCK PHOTOGRAPH';
        return;
      }
      if (img.dataset.hasFallback) return;
      img.dataset.hasFallback = '1'; img.src = fallback;
      img.alt = 'Original illustrative hotel-themed artwork; property photograph unavailable';
      img.closest('.gallery-item')?.setAttribute('data-image-unavailable', 'true');
      const heroNote=img.closest('.hero-portrait')?.querySelector('.photo-note');
      if (heroNote) heroNote.textContent = 'ILLUSTRATIVE CONCEPT ARTWORK';
    });
  });
  const gallery = $$('.gallery-item');
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    const category = button.dataset.filter;
    $$('.filter').forEach(item => item.classList.toggle('active', item === button));
    gallery.forEach(item => { item.hidden = category !== 'all' && item.dataset.category !== category; });
  }));
  const modal = $('#lightbox');
  const modalImg = $('#lightbox-img');
  const caption = $('#lightbox-caption');
  let activeIndex = 0;
  let previousFocus = null;
  const visibleGallery = () => gallery.filter(el => !el.hidden);
  const showGallery = item => {
    const img = $('img', item);
    modalImg.src = img.currentSrc || img.src;
    modalImg.alt = img.alt;
    caption.textContent = item.dataset.title + ((img.dataset.hasFallback || img.dataset.hasStock) ? ' · Illustrative image, not the hotel' : ' · Public listing photograph');
  };
  function openGallery(item) {
    previousFocus = document.activeElement;
    activeIndex = visibleGallery().indexOf(item);
    showGallery(item);
    modal.hidden = false;
    document.body.classList.add('lock-scroll');
    $('#lightbox-close').focus();
  }
  function closeGallery() { modal.hidden = true; document.body.classList.remove('lock-scroll'); previousFocus?.focus(); }
  function shiftGallery(offset) {
    const items = visibleGallery();
    if (!items.length) return;
    activeIndex = (activeIndex + offset + items.length) % items.length;
    showGallery(items[activeIndex]);
  }
  gallery.forEach(item => item.addEventListener('click', () => openGallery(item)));
  $('#lightbox-close')?.addEventListener('click', closeGallery);
  $('#lightbox-prev')?.addEventListener('click', () => shiftGallery(-1));
  $('#lightbox-next')?.addEventListener('click', () => shiftGallery(1));
  modal?.addEventListener('click', event => { if (event.target === modal) closeGallery(); });
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') closeGallery();
    if (event.key === 'ArrowLeft') shiftGallery(-1);
    if (event.key === 'ArrowRight') shiftGallery(1);
    if (event.key === 'Tab') {
      const focusables = $$('.lightbox-close,.lightbox-prev,.lightbox-next',modal);
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const form = $('#enquiry-form');
  const checkin = $('#checkin'), checkout = $('#checkout');
  const localDate = date => {
    const y = date.getFullYear(); const m = String(date.getMonth()+1).padStart(2,'0'); const d=String(date.getDate()).padStart(2,'0');
    return `${y}-${m}-${d}`;
  };
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate()+1);
  checkin.min = localDate(now); checkin.value = localDate(next);
  checkout.min = localDate(new Date(next.getFullYear(), next.getMonth(), next.getDate()+1));
  checkout.value = checkout.min;
  checkin.addEventListener('change', () => {
    if(!checkin.value) return;
    const date = new Date(`${checkin.value}T12:00:00`);
    date.setDate(date.getDate()+1);
    checkout.min=localDate(date);
    if(!checkout.value || checkout.value < checkout.min) checkout.value=checkout.min;
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    if (checkout.value <= checkin.value) { $('#form-help').textContent = 'Check-out must be after check-in.'; checkout.focus(); return; }
    const data = new FormData(form);
    const lines = [
      'Hello Spotlight Hotel,', '',
      'I would like to enquire about room availability.', '',
      `Name: ${data.get('name')}`, `Check-in: ${data.get('checkin')}`,
      `Check-out: ${data.get('checkout')}`, `Guests: ${data.get('guests')}`,
      ...(data.get('contact') ? [`Contact: ${data.get('contact')}`] : []),
      ...(data.get('message') ? [`Message: ${data.get('message')}`] : []), '',
      'Please share available room options, rates and booking instructions. Thank you!'
    ];
    const message=lines.join('\n');
    $('#prepared-text').value=message;
    const subject=encodeURIComponent('Room enquiry — Spotlight Hotel Nawalgarh');
    $('#email-enquiry').href=`mailto:?subject=${subject}&body=${encodeURIComponent(message)}`;
    $('#prepared').hidden=false;
    $('#form-help').textContent='Your enquiry is ready below. Copy it, open your email app, or call the hotel directly.';
    $('#prepared').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('#copy-enquiry').addEventListener('click', async () => {
    const text=$('#prepared-text').value;
    try { await navigator.clipboard.writeText(text); $('#copy-enquiry').textContent='COPIED ✓'; }
    catch { $('#prepared-text').select(); document.execCommand('copy'); $('#copy-enquiry').textContent='SELECTED / COPIED'; }
  });
})();
