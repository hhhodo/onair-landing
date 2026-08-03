document.querySelectorAll('.svc-item__row').forEach(row => {
  row.addEventListener('click', () => {
    const item = row.closest('.svc-item');
    const isOpen = item.classList.contains('svc-item--open');
    document.querySelectorAll('.svc-item--open').forEach(el => el.classList.remove('svc-item--open'));
    if (!isOpen) item.classList.add('svc-item--open');
  });
});

const collageWheel = document.querySelector('.collage__wheel');
const collagePinWrap = document.querySelector('.collage-pin-wrap');
if (collageWheel && collagePinWrap && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;

  function updateWheelRotation() {
    const rect = collagePinWrap.getBoundingClientRect();
    const vh = window.innerHeight;
    const scrollRange = rect.height - vh;
    const progress = scrollRange > 0
      ? Math.min(1, Math.max(0, -rect.top / scrollRange))
      : 0;
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
