/* ============================================================
   BRAND.JS — Brand Detail Page: Gallery + Lightbox
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ─── Get brand id from URL ───────────────────────────────── */
function getBrandId() {
  return new URLSearchParams(window.location.search).get('id');
}

function getBrand(id) {
  return BRANDS.find(b => b.id === id) || null;
}

/* ─── Populate brand hero ─────────────────────────────────── */
function renderBrandHero(brand) {
  // footer logo text only — nav logo keeps its <img> intact
  document.querySelectorAll('.footer-logo').forEach(el => el.textContent = CONFIG.owner.name);

  // brand counter (e.g. 01 / 12)
  const idx   = BRANDS.findIndex(b => b.id === brand.id) + 1;
  const total = BRANDS.length;
  const counter = document.getElementById('brand-counter');
  if (counter) counter.textContent = `${String(idx).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;

  // cover image
  const coverImg = document.getElementById('brand-cover-img');
  if (coverImg) {
    coverImg.src = `${BASE}/${brand.folder}/${brand.cover}`;
    coverImg.alt = brand.name;
  }

  document.getElementById('brand-eyebrow').textContent = brand.tags.join(' · ');
  document.getElementById('brand-title').textContent   = brand.name;
  document.getElementById('brand-year').textContent    = brand.year;

  // description
  const descEl = document.getElementById('brand-desc');
  if (descEl) descEl.textContent = brand.description || '';

  // tag pills
  const tagsEl = document.getElementById('brand-tags');
  brand.tags.forEach(t => {
    const span = document.createElement('span');
    span.className = 'brand-hero-tag';
    span.textContent = t;
    tagsEl.appendChild(span);
  });

  // page title
  document.title = `${brand.name} — ${CONFIG.owner.name}`;

  // gallery count — images only (videos go to video section)
  const imgCount = brand.files.filter(f => f.type !== 'video').length;
  document.getElementById('gallery-count').textContent = `${imgCount} image${imgCount !== 1 ? 's' : ''}`;
}

/* ─── Render Case Study ───────────────────────────────────── */
function renderCaseStudy(brand) {
  // Scope tags
  const scopeEl = document.getElementById('case-scope');
  if (scopeEl) {
    brand.tags.forEach(t => {
      const s = document.createElement('span');
      s.className = 'case-tag';
      s.textContent = t;
      scopeEl.appendChild(s);
    });
  }

  // Output count
  const imgCount = brand.files.filter(f => f.type !== 'video').length;
  const vidCount = brand.files.filter(f => f.type === 'video').length;
  const ytCount  = (brand.youtubeIds || []).length;
  const outputEl = document.getElementById('case-output');
  if (outputEl) {
    const parts = [];
    if (imgCount > 0) parts.push(`${imgCount} visuals`);
    if (vidCount + ytCount > 0) parts.push(`${vidCount + ytCount} videos`);
    outputEl.textContent = parts.join(' · ') || `${brand.files.length} pieces`;
  }

  // Year
  const yearEl = document.getElementById('case-year');
  if (yearEl) yearEl.textContent = brand.year;

  // Overview
  const briefEl = document.getElementById('case-brief-text');
  if (briefEl) briefEl.textContent = brand.description || '';
}

/* ─── Render Video Section (mp4 + YouTube embeds) ─────────── */
function renderVideoSection(brand) {
  const section  = document.getElementById('video-section');
  const grid     = document.getElementById('video-grid');
  const countEl  = document.getElementById('video-count');
  if (!section || !grid) return;

  const mp4Files = brand.files.filter(f => f.type === 'video');
  const ytIds    = brand.youtubeIds || [];
  const total    = mp4Files.length + ytIds.length;

  // hide section if no videos at all
  if (total === 0) {
    section.style.display = 'none';
    return;
  }

  if (countEl) countEl.textContent = `${total} video${total > 1 ? 's' : ''}`;

  // ── mp4 videos ──
  mp4Files.forEach(file => {
    const item = document.createElement('div');
    item.className = 'video-item';

    const video = document.createElement('video');
    video.src        = `${BASE}/${brand.folder}/${file.name}`;
    video.controls   = true;
    video.preload    = 'metadata';
    video.playsInline = true;

    item.appendChild(video);
    grid.appendChild(item);
  });

  // ── YouTube facade (thumbnail → click → embed) ──
  ytIds.forEach(id => {
    const item = document.createElement('div');
    item.className = 'video-item is-yt-facade';

    const facade = document.createElement('div');
    facade.className = 'yt-facade';
    facade.setAttribute('role', 'button');
    facade.setAttribute('tabindex', '0');
    facade.setAttribute('aria-label', 'Play YouTube video');

    const thumb = document.createElement('img');
    thumb.src     = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    thumb.alt     = `${brand.name} — YouTube video`;
    thumb.loading = 'lazy';
    thumb.onerror = () => { thumb.src = `https://img.youtube.com/vi/${id}/hqdefault.jpg`; };

    const overlay = document.createElement('div');
    overlay.className = 'yt-facade-overlay';
    overlay.innerHTML = `
      <div class="yt-facade-btn">
        <svg viewBox="0 0 68 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M66.5 7.5s-.8-5.2-3.1-7.5C60.2-2.8 56.6-2.8 55 -3c-9.3-.7-23.3-.7-23.3-.7h0S17.7-3.7 8.4-3c-1.6.1-5.2.1-8.4 3.1C-2.3 2.3-3 7.5-3 7.5S-3.8 13.7-3.8 20v5.9c0 6.3.8 12.5.8 12.5s.8 5.2 3.1 7.5C3.3 48.8 7.7 48.6 9.6 49c6.2.6 26.4.8 26.4.8s14-.1 23.3-.8c1.6-.1 5.2-.1 8.4-3.1 2.3-2.3 3.1-7.5 3.1-7.5S72 31.9 72 25.9V20c0-6.3-.5-12.5-.5-12.5z" fill="#f00"/>
          <path d="M27 34V14l20 10-20 10z" fill="#fff"/>
        </svg>
      </div>`;

    facade.appendChild(thumb);
    facade.appendChild(overlay);

    // click → replace facade with real iframe (autoplay)
    const activate = () => {
      const wrap = document.createElement('div');
      wrap.className = 'video-iframe-wrap';

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = `${brand.name} — video`;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');

      wrap.appendChild(iframe);
      item.innerHTML = '';
      item.appendChild(wrap);
    };

    facade.addEventListener('click', activate);
    facade.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });

    item.appendChild(facade);
    grid.appendChild(item);
  });
}

/* ─── Build gallery grid ──────────────────────────────────── */
let lightboxImages = [];   // index array of image-type items only
let currentLightboxIdx = 0;

function renderGallery(brand) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // gallery shows images + gifs only; videos go to #video-section
  const imageFiles = brand.files.filter(f => f.type !== 'video');
  lightboxImages   = brand.files.filter(f => f.type === 'image');

  imageFiles.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'gif') item.classList.add('is-gif');

    const img = document.createElement('img');
    img.src     = `${BASE}/${brand.folder}/${file.name}`;
    img.alt     = `${brand.name} — ${file.name}`;
    img.loading = 'lazy';
    item.appendChild(img);

    // lightbox click (images only, not gifs)
    const lbIndex = lightboxImages.findIndex(f => f.name === file.name);
    if (lbIndex !== -1) {
      item.addEventListener('click', () => openLightbox(lbIndex));
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View image ${lbIndex + 1} of ${lightboxImages.length}`);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(lbIndex); }
      });
    }

    grid.appendChild(item);
  });
}

/* ─── Gallery Masonry (เหมือน homepage brand grid) ──────── */
function getGalleryCols() {
  const w = window.innerWidth;
  if (w <= 640)  return 1;
  if (w <= 1024) return 2;
  return 3;
}

function runGalleryMasonry() {
  const grid  = document.getElementById('gallery-grid');
  const items = [...grid.querySelectorAll('.gallery-item')];
  if (!items.length) return;

  const cols     = getGalleryCols();
  const gap      = 3;
  const colWidth = (grid.offsetWidth - (cols - 1) * gap) / cols;
  const colH     = Array(cols).fill(0);

  items.forEach((item, i) => {
    // แถวแรก: เรียงซ้ายไปขวาตามลำดับ
    const col = i < cols ? i : colH.indexOf(Math.min(...colH));
    item.style.width = colWidth + 'px';
    item.style.left  = col * (colWidth + gap) + 'px';
    item.style.top   = colH[col] + 'px';
    colH[col] += item.offsetHeight + gap;
  });

  grid.style.height = Math.max(...colH) - gap + 'px';
}

/* ─── Scroll-triggered gallery reveal ────────────────────── */
function initGalleryAnim() {
  const items = document.querySelectorAll('.gallery-item');
  gsap.to(items, {
    opacity: 1,
    duration: 0.6,
    stagger: { amount: 0.8, from: 'start' },
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 90%',
    }
  });
}

/* ─── Brand hero entrance ─────────────────────────────────── */
function runBrandEntrance() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Cover image: subtle scale-in (Ken Burns feel)
  tl.from('#brand-cover-img', {
    scale: 1.08,
    duration: 1.4,
    ease: 'power2.out',
  }, 0);

  // Info panel: staggered reveal
  tl
    .to('#brand-eyebrow', { opacity: 1, y: 0, duration: 0.5 }, 0.3)
    .to('#brand-title',   { opacity: 1, y: 0, duration: 0.7 }, 0.45)
    .to('#brand-desc',    { opacity: 1,        duration: 0.6 }, 0.7)
    .to('#brand-meta',    { opacity: 1,        duration: 0.5 }, 0.9);
}

/* ─── Lightbox ────────────────────────────────────────────── */
function openLightbox(index) {
  if (lightboxImages.length === 0) return;
  currentLightboxIdx = index;
  updateLightboxImage();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightboxImage() {
  const brand    = getBrand(getBrandId());
  const file     = lightboxImages[currentLightboxIdx];
  const img      = document.getElementById('lightbox-img');
  const counter  = document.getElementById('lightbox-counter');

  img.src = `${BASE}/${brand.folder}/${file.name}`;
  img.alt = `${brand.name} — image ${currentLightboxIdx + 1}`;
  counter.textContent = `${currentLightboxIdx + 1} / ${lightboxImages.length}`;
}

function lightboxNext() {
  currentLightboxIdx = (currentLightboxIdx + 1) % lightboxImages.length;
  updateLightboxImage();
}

function lightboxPrev() {
  currentLightboxIdx = (currentLightboxIdx - 1 + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn  = document.getElementById('lightbox-prev');
  const nextBtn  = document.getElementById('lightbox-next');

  closeBtn?.addEventListener('click', closeLightbox);
  prevBtn?.addEventListener('click',  lightboxPrev);
  nextBtn?.addEventListener('click',  lightboxNext);

  // click backdrop to close
  lb?.addEventListener('click', e => {
    if (e.target === lb) closeLightbox();
  });

  // keyboard navigation
  document.addEventListener('keydown', e => {
    if (!lb?.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowRight')  lightboxNext();
    if (e.key === 'ArrowLeft')   lightboxPrev();
  });
}

/* ─── Nav back button ─────────────────────────────────────── */
function initNavBack() {
  document.getElementById('nav-back')?.addEventListener('click', () => {
    window.location.href = 'index.html';
  });
}

/* ─── Nav scroll effect ───────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 80,
    onEnter:     () => nav?.classList.add('scrolled'),
    onLeaveBack: () => nav?.classList.remove('scrolled'),
  });
}

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const id    = getBrandId();
  const brand = getBrand(id);

  if (!brand) {
    // brand not found → redirect home
    window.location.href = 'index.html';
    return;
  }

  renderBrandHero(brand);
  renderCaseStudy(brand);
  renderGallery(brand);
  renderVideoSection(brand);
  initNav();
  initNavBack();
  initLightbox();
  runBrandEntrance();

  // รอ images โหลดก่อน run masonry (เพื่อได้ความสูงที่ถูกต้อง)
  const grid = document.getElementById('gallery-grid');
  const imgs = [...grid.querySelectorAll('img')];
  const loads = imgs.map(img =>
    img.complete
      ? Promise.resolve()
      : new Promise(r => { img.onload = r; img.onerror = r; })
  );

  Promise.all(loads).then(() => {
    runGalleryMasonry();
    // hide loader
    const loader = document.getElementById('gallery-loader');
    if (loader) gsap.to(loader, { opacity: 0, duration: 0.3, onComplete: () => loader.remove() });
    initGalleryAnim();
    // tilt บน gallery items — เรียกหลัง masonry วาง items แล้ว
    if (typeof initCardTilt === 'function') initCardTilt();
    ScrollTrigger.refresh();
  });

  // fallback กรณี image โหลดช้า
  setTimeout(() => {
    runGalleryMasonry();
    initGalleryAnim();
    ScrollTrigger.refresh();
  }, 2500);

  // re-run masonry เมื่อ resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      runGalleryMasonry();
      ScrollTrigger.refresh();
    }, 150);
  });
});
