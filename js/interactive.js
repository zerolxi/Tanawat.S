/* ============================================================
   INTERACTIVE.JS — Custom Cursor · Card Tilt · Hero Glow
   ============================================================ */

/* ─── Custom Cursor ───────────────────────────────────────── */
function initCursor() {
  // touch devices → skip
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  const DOT_HALF  = 4;   // 8px ÷ 2
  const RING_HALF = 20;  // 40px ÷ 2

  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
  let ringX  = mouseX;
  let ringY  = mouseY;

  // dot: instant follow
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.set(dot, { x: mouseX - DOT_HALF, y: mouseY - DOT_HALF });
  });

  // ring: lerp follow via ticker
  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.10;
    ringY += (mouseY - ringY) * 0.10;
    gsap.set(ring, { x: ringX - RING_HALF, y: ringY - RING_HALF });
  });

  // expand ring on interactive elements
  const interactors = 'a, button, [role="button"], .brand-card, .gallery-item, .nav-back';
  document.querySelectorAll(interactors).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // fade when cursor leaves viewport
  document.addEventListener('mouseleave', () =>
    gsap.to([dot, ring], { opacity: 0, duration: 0.3 })
  );
  document.addEventListener('mouseenter', () =>
    gsap.to([dot, ring], { opacity: 1, duration: 0.3 })
  );
}

/* ─── 3D Tilt + Shimmer (brand cards & gallery items) ────── */
function applyTilt(el, maxRotY = 7, maxRotX = 5) {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2);
    const dy = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);

    gsap.to(el, {
      rotationY:            dx * maxRotY,
      rotationX:           -dy * maxRotX,
      transformPerspective: 900,
      ease: 'power2.out',
      duration: 0.35,
      overwrite: 'auto',
    });

    // shimmer follow
    el.style.setProperty('--mouse-x', ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%');
    el.style.setProperty('--mouse-y', ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%');
  });

  el.addEventListener('mouseleave', () => {
    gsap.to(el, {
      rotationY: 0, rotationX: 0,
      ease: 'power3.out',
      duration: 0.8,
      overwrite: 'auto',
    });
  });
}

function initCardTilt() {
  // homepage brand cards only — gallery items ไม่ใส่ tilt (งานเยอะ ลายตา)
  document.querySelectorAll('.brand-card').forEach(el => applyTilt(el, 7, 5));
}

/* ─── Hero Mouse Glow ─────────────────────────────────────── */
function initHeroGlow() {
  // index.html → #hero  |  brand.html → .brand-hero-info (right panel only)
  const hero = document.getElementById('hero')
            || document.querySelector('.brand-hero-info')
            || document.getElementById('brand-hero');
  if (!hero) return;

  const glow = document.createElement('div');
  glow.className = 'hero-mouse-glow';
  hero.appendChild(glow);

  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - 300;
    const y = e.clientY - rect.top  - 300;

    gsap.to(glow, { opacity: 1, duration: 0.4, overwrite: false });
    gsap.to(glow, { x, y, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
  });

  hero.addEventListener('mouseleave', () => {
    gsap.to(glow, { opacity: 0, duration: 0.6 });
  });
}

/* ─── Cover Image Parallax (brand page) ──────────────────── */
function initCoverParallax() {
  const brandHero = document.getElementById('brand-hero');
  const coverImg  = document.getElementById('brand-cover-img');
  if (!brandHero || !coverImg) return;

  brandHero.addEventListener('mousemove', e => {
    const rect = brandHero.getBoundingClientRect();
    const dx = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2); // -1→1
    const dy = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2); // -1→1

    gsap.to(coverImg, {
      scale: 1.04,
      x: dx * 14,
      y: dy * 10,
      duration: 1.2,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  });

  brandHero.addEventListener('mouseleave', () => {
    gsap.to(coverImg, {
      scale: 1, x: 0, y: 0,
      duration: 1.2,
      ease: 'power3.out',
    });
  });
}

/* ─── Scroll Zoom — "Entering the World" ─────────────────── */
function initScrollZoom() {
  const hero = document.getElementById('hero');
  if (!hero) return; // index.html only
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Dark transition overlay (sits above everything in hero)
  const overlay = document.createElement('div');
  overlay.className = 'hero-zoom-overlay';
  hero.appendChild(overlay);

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',     // pin hero for one extra viewport-height of scroll
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      pinSpacing: true,  // reserves space so layout below stays correct
    }
  });

  // ① Title + tagline: fly upward (you're leaving the intro world behind)
  tl.to('.hero-content', {
    y: -110, opacity: 0, scale: 1.06,
    ease: 'power2.in',
  }, 0);

  tl.to('.hero-scroll', {
    y: -24, opacity: 0,
    ease: 'power1.in',
  }, 0);


  // ③ Glow blobs: inflate — the "world" expanding
  // Note: main.js initParallax uses gsap.set(blob, {y}), we use scale — different props, safe to combine
  tl.to('.glow-blob-1', { scale: 3.0, ease: 'power1.inOut' }, 0);
  tl.to('.glow-blob-2', { scale: 3.6, x: 40, ease: 'power1.inOut' }, 0.05);

  // ④ Fade to dark — cinematic portal into the next world
  tl.to(overlay, {
    opacity: 1,
    ease: 'power3.in',
  }, 0.6);

  // ⑤ Work section: zooms into frame after the portal
  // Use scale only (no opacity/autoAlpha — initBrandGridAnim owns card opacity)
  gsap.from('#work', {
    scale: 0.96,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#work',
      start: 'top 90%',
      end: 'top 30%',
      scrub: 1,
    }
  });
}

/* ─── Init ────────────────────────────────────────────────── */
/* ─── Mobile Nav ──────────────────────────────────────────── */
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const overlay   = document.getElementById('nav-mobile-overlay');
  if (!hamburger || !overlay) return;

  function open() {
    hamburger.classList.add('open');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // stagger links in
    gsap.from('.nav-mobile-link', {
      y: 40, opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power3.out',
    });
  }

  function close() {
    hamburger.classList.remove('open');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () =>
    hamburger.classList.contains('open') ? close() : open()
  );

  // close when a link is tapped
  overlay.querySelectorAll('.nav-mobile-link').forEach(link =>
    link.addEventListener('click', close)
  );

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) close();
  });
}

/* ─── Init ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initHeroGlow();
  initCoverParallax();
  initMobileNav();
  initScrollZoom();
  setTimeout(initCardTilt, 300);
});
