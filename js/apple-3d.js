/* Spatial details for the portfolio. No dependency required. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('#hero');

  if (hero && !reduceMotion) {
    hero.addEventListener('pointermove', ({ clientX, clientY }) => {
      const box = hero.getBoundingClientRect();
      hero.style.setProperty('--pointer-x', `${((clientX - box.left) / box.width) * 100}%`);
      hero.style.setProperty('--pointer-y', `${((clientY - box.top) / box.height) * 100}%`);
    }, { passive: true });
  }

  if (!reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.brand-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        card.style.setProperty('--mouse-x', `${x * 100}%`);
        card.style.setProperty('--mouse-y', `${y * 100}%`);
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 7}deg) rotateY(${(x - 0.5) * 9}deg) translateY(-7px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
})();

