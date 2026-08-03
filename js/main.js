document.querySelectorAll('.svc-item__row').forEach(row => {
  row.addEventListener('click', () => {
    const item = row.closest('.svc-item');
    const isOpen = item.classList.contains('svc-item--open');
    document.querySelectorAll('.svc-item--open').forEach(el => el.classList.remove('svc-item--open'));
    if (!isOpen) item.classList.add('svc-item--open');
  });
});

const collageWheel = document.querySelector('.collage__wheel');
if (collageWheel && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const collageSection = document.querySelector('.collage');
  let ticking = false;

  function updateWheelRotation() {
    const rect = collageSection.getBoundingClientRect();
    const vh = window.innerHeight;
    const progress = Math.min(1, Math.max(0, (vh - rect.top) / (vh + rect.height)));
    collageWheel.style.transform = `rotate(${progress * 360}deg)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateWheelRotation);
      ticking = true;
    }
  }, { passive: true });

  updateWheelRotation();
}
