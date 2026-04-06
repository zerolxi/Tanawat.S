/* ============================================================
   MAIN.JS — Homepage GSAP Animations
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ─── Respect prefers-reduced-motion ────────────────────── */
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (REDUCED_MOTION) {
  gsap.globalTimeline.timeScale(1000); // skip all GSAP animations instantly
}

/* ─── Inject CONFIG into DOM ─────────────────────────────── */
function applyConfig() {
  const { name, role, tagline, email } = CONFIG.owner;
  document.querySelectorAll('[data-owner-name]').forEach(el => el.textContent = name);
  document.querySelectorAll('[data-owner-role]').forEach(el => el.textContent = role);
  document.querySelectorAll('[data-owner-tagline]').forEach(el => el.textContent = tagline);
  document.querySelectorAll('[data-owner-email]').forEach(el => {
    el.textContent = email;
    if (el.tagName === 'A') el.href = `mailto:${email}`;
  });
  document.querySelectorAll('[data-owner-phone]').forEach(el => {
    el.textContent = CONFIG.owner.phone;
    if (el.tagName === 'A') el.href = `tel:${CONFIG.owner.phone.replace(/-/g, '')}`;
  });
  document.querySelectorAll('.footer-logo').forEach(el => el.textContent = name);

  // ── About section ──────────────────────────────────────────
  const { quote, bio, skills } = CONFIG.about;

  // quote (รองรับ \n และ <em>)
  document.querySelectorAll('[data-about-quote]').forEach(el => {
    el.innerHTML = quote.replace(/\n/g, '<br>');
  });

  // bio
  document.querySelectorAll('[data-about-bio]').forEach(el => el.textContent = bio);

  // skills grid
  const skillsEl = document.getElementById('about-skills');
  if (skillsEl) {
    skills.forEach(s => {
      const d = document.createElement('div');
      d.className = 'about-skill-item';
      d.textContent = s;
      skillsEl.appendChild(d);
    });
  }
}

/* ─── Split by word (block) → then char inside each word ──── */
function splitChars(el) {
  const text = el.textContent.trim();
  el.innerHTML = '';
  el.setAttribute('aria-label', text);

  const allChars = [];

  text.split(/\s+/).forEach(word => {
    // each word = its own block so it never breaks mid-word
    const wordWrap = document.createElement('div');
    wordWrap.style.cssText = 'display:block; overflow:hidden; white-space:nowrap; width:max-content;';

    [...word].forEach(ch => {
      const char = document.createElement('span');
      char.className = 'char';
      char.style.display = 'inline-block';
      char.textContent = ch;
      wordWrap.appendChild(char);
    });

    el.appendChild(wordWrap);
    allChars.push(...wordWrap.querySelectorAll('.char'));
  });

  return allChars;
}



/* ─── Preloader ───────────────────────────────────────────── */
function initPreloader() {
  const preloader  = document.getElementById('preloader');
  const nameEl     = preloader?.querySelector('.preloader-logo');
  const bar        = preloader?.querySelector('.preloader-bar');
  if (!preloader) return;

  const tl = gsap.timeline({
    onComplete: () => {
      preloader.style.pointerEvents = 'none';
      runHeroEntrance();
    }
  });

  tl
    .to(nameEl, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    .to(bar, { scaleX: 1, duration: 1, ease: 'power3.inOut' }, '<0.1')
    .to([nameEl, bar], { opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.3')
    .to(preloader, { opacity: 0, duration: 0.5, ease: 'power2.in' }, '<0.1')
    .set(preloader, { display: 'none' });
}

/* ─── Hero Entrance ───────────────────────────────────────── */
function runHeroEntrance() {
  const heroTitle   = document.querySelector('.hero-title');
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroCta     = document.querySelector('.hero-cta');
  const heroScroll  = document.querySelector('.hero-scroll');
  const scrollLine  = document.querySelector('.hero-scroll-line');

  const chars = heroTitle ? splitChars(heroTitle) : [];

  // reveal title container immediately — chars are hidden by overflow:hidden
  // until they animate up, so there's no flash of raw text
  if (heroTitle) gsap.set(heroTitle, { opacity: 1 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl
    .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.5 }, 0)
    .from(chars, {
      y: '100%',
      duration: 0.7,
      stagger: { amount: 0.6, from: 'start' },
      ease: 'power4.out'
    }, 0.2)
    .to(heroTagline, { opacity: 1, duration: 0.7 }, 0.7)
    .to('.hero-cta',   { opacity: 1, duration: 0.6 }, 1.0)
    .to('#hero-info',  { opacity: 1, duration: 0.8 }, 1.0)
    .to(heroScroll,   { opacity: 1, duration: 0.5 }, 1.1)
    .from(scrollLine, { scaleX: 0, duration: 0.8, ease: 'power2.inOut' }, 1.1);

}

/* ─── Navbar scroll effect ────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  ScrollTrigger.create({
    start: 80,
    onEnter: ()  => nav?.classList.add('scrolled'),
    onLeaveBack: () => nav?.classList.remove('scrolled'),
  });
}

/* ─── Build brand cards ───────────────────────────────────── */
function buildBrandGrid() {
  const grid = document.getElementById('brands-grid');
  if (!grid) return;

  BRANDS.forEach((brand, i) => {
    const card = document.createElement('article');
    card.className = 'brand-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View ${brand.name} project`);

    // index badge
    const idx = document.createElement('span');
    idx.className = 'brand-card-index';
    idx.textContent = String(i + 1).padStart(2, '0');
    card.appendChild(idx);

    // media
    const img = document.createElement('img');
    img.className = 'brand-card-media';
    img.src = `${BASE}/${brand.folder}/${brand.cover}`;
    img.alt = brand.name;
    img.loading = 'lazy';
    card.appendChild(img);

    // overlay
    const overlay = document.createElement('div');
    overlay.className = 'brand-card-overlay';
    overlay.innerHTML = `
      <p class="brand-card-name">${brand.name}</p>
      <div class="brand-card-tags">
        ${brand.tags.map(t => `<span class="brand-card-tag">${t}</span>`).join('')}
      </div>
    `;
    card.appendChild(overlay);

    // navigate to brand page
    const navigate = () => {
      window.location.href = `brand.html?id=${brand.id}`;
    };
    card.addEventListener('click', navigate);
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(); }
    });

    grid.appendChild(card);
  });
}

/* ─── Masonry layout ─────────────────────────────────────── */
function getCols() {
  const w = window.innerWidth;
  if (w <= 640)  return 1;
  if (w <= 1024) return 2;
  return 3;
}

function runMasonry() {
  const grid  = document.getElementById('brands-grid');
  const cards = [...grid.querySelectorAll('.brand-card')];
  if (!cards.length) return;

  const cols     = getCols();
  const gap      = 3;
  const colWidth = (grid.offsetWidth - (cols - 1) * gap) / cols;
  const colH     = Array(cols).fill(0);

  cards.forEach((card, i) => {
    // first row: force sequential order (left → right)
    const col = i < cols ? i : colH.indexOf(Math.min(...colH));
    card.style.width = colWidth + 'px';
    card.style.left  = col * (colWidth + gap) + 'px';
    card.style.top   = colH[col] + 'px';
    colH[col] += card.offsetHeight + gap;
  });

  grid.style.height = Math.max(...colH) - gap + 'px';
}

/* ─── Scroll-triggered brand cards ───────────────────────── */
function initBrandGridAnim() {
  const cards = document.querySelectorAll('.brand-card');
  gsap.to(cards, {
    opacity: 1,
    duration: 0.6,
    stagger: { amount: 0.5, from: 'start' },
    ease: 'power3.out',
    scrollTrigger: { trigger: '#work', start: 'top 80%' }
  });
}

/* ─── About section stats ─────────────────────────────────── */
function initAboutAnim() {
  gsap.utils.toArray('.section-reveal').forEach(el => {
    gsap.from(el, {
      opacity: 0, y: 30, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

}

/* ─── Parallax blob ───────────────────────────────────────── */
function initParallax() {
  const blob1 = document.querySelector('.glow-blob-1');
  const blob2 = document.querySelector('.glow-blob-2');
  if (!blob1) return;

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: 1,
    onUpdate: self => {
      gsap.set(blob1, { y: self.progress * 120 });
      gsap.set(blob2, { y: self.progress * -80 });
    }
  });
}

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  // hero brand count
  const countEl = document.getElementById('hero-brand-count');
  if (countEl) countEl.textContent = BRANDS.length;
  buildBrandGrid();
  initPreloader();
  initNav();
  initParallax();

  // รอ images load แล้วค่อย run masonry
  const imgs = [...document.querySelectorAll('.brand-card-media')];
  const loads = imgs.map(img =>
    img.complete ? Promise.resolve() : new Promise(r => { img.onload = r; img.onerror = r; })
  );
  Promise.all(loads).then(() => {
    runMasonry();
    ScrollTrigger.refresh();
  });

  // re-run masonry on resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { runMasonry(); ScrollTrigger.refresh(); }, 150);
  });

  setTimeout(() => {
    runMasonry(); // fallback ถ้า image load ช้า
    initBrandGridAnim();
    initAboutAnim();
    ScrollTrigger.refresh();
  }, 2800);
});
