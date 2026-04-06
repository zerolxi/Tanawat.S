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

  // gallery count
  const imgCount = brand.files.filter(f => f.type === 'image').length;
  const vidCount = brand.files.filter(f => f.type === 'video').length;
  let countText  = `${brand.files.length} assets`;
  if (vidCount > 0) countText = `${imgCount} images · ${vidCount} videos`;
  document.getElementById('gallery-count').textContent = countText;
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
  const outputEl = document.getElementById('case-output');
  if (outputEl) {
    outputEl.textContent = vidCount > 0
      ? `${imgCount} visuals · ${vidCount} videos`
      : `${brand.files.length} pieces`;
  }

  // Year
  const yearEl = document.getElementById('case-year');
  if (yearEl) yearEl.textContent = brand.year;

  // Overview
  const briefEl = document.getElementById('case-brief-text');
  if (briefEl) briefEl.textContent = brand.description || '';
}

/* ─── Render YouTube cards into gallery grid ──────────────── */
function renderYoutube(brand) {
  if (!brand.youtubeIds || brand.youtubeIds.length === 0) return;

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  brand.youtubeIds.forEach(id => {
    const item = document.createElement('div');
    item.className = 'gallery-item is-youtube';

    const thumb = document.createElement('img');
    thumb.src     = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
    thumb.alt     = `${brand.name} — YouTube`;
    thumb.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'yt-overlay';
    overlay.innerHTML = `
      <svg class="yt-play" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="12" cy="12" r="12" fill="rgba(0,0,0,0.55)"/>
        <polygon points="10,8 17,12 10,16" fill="#fff"/>
      </svg>
      <span class="yt-label">Watch on YouTube</span>`;

    item.appendChild(thumb);
    item.appendChild(overlay);
    item.addEventListener('click', () => window.open(`https://youtu.be/${id}`, '_blank', 'noopener'));
    item.style.cursor = 'pointer';

    grid.appendChild(item);
  });
}

/* ─── Build gallery grid ──────────────────────────────────── */
let lightboxImages = [];   // index array of image-type items only
let currentLightboxIdx = 0;

function renderGallery(brand) {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  lightboxImages = brand.files.filter(f => f.type === 'image');

  // images/gifs ก่อน, videos (mp4) ล่างสุด
  const sortedFiles = [
    ...brand.files.filter(f => f.type !== 'video'),
    ...brand.files.filter(f => f.type === 'video'),
  ];

  sortedFiles.forEach((file, i) => {
    const item = document.createElement('div');
    item.className = `gallery-item is-${file.type}`;

    if (file.type === 'video') {
      // ── Video item ──
      const video = document.createElement('video');
      video.src = `${BASE}/${brand.folder}/${file.name}`;
      video.controls = true;
      video.preload = 'metadata';
      video.playsInline = true;

      // play hint icon
      const hint = document.createElement('div');
      hint.className = 'video-play-hint';
      hint.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="rgba(255,255,255,0.8)">
        <path d="M8 5v14l11-7z"/>
      </svg>`;

      item.appendChild(video);
      item.appendChild(hint);

      // hide hint when video plays
      video.addEventListener('play', () => { hint.style.display = 'none'; });
      video.addEventListener('pause', () => { hint.style.display = 'flex'; });

    } else {
      // ── Image / GIF item ──
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'gif') item.classList.add('is-gif');

      const img = document.createElement('img');
      img.src = `${BASE}/${brand.folder}/${file.name}`;
      img.alt = `${brand.name} — ${file.name}`;
      img.loading = 'lazy';
      item.appendChild(img);

      // lightbox click
      const lbIndex = lightboxImages.findIndex(f => f.name === file.name);
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
  renderYoutube(brand);
  renderGallery(brand);
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
