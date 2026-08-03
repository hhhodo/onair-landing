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

const nav = document.querySelector('.nav');
const collagePinWrapForNav = document.querySelector('.collage-pin-wrap');
if (nav && collagePinWrapForNav) {
  const navObserver = new IntersectionObserver(
    ([entry]) => nav.classList.toggle('nav--transparent', entry.isIntersecting),
    { threshold: 0 }
  );
  navObserver.observe(collagePinWrapForNav);
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealTargets = document.querySelectorAll('[data-reveal]');
if (revealTargets.length) {
  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  }
}

function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = (el.dataset.count.split('.')[1] || '').length;
  const duration = 1500;
  const start = performance.now();

  function frame(now) {
    const elapsed = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    const value = target * eased;
    el.textContent = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    if (elapsed < 1) {
      requestAnimationFrame(frame);
    } else {
      el.textContent = target.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    }
  }
  requestAnimationFrame(frame);
}

const statGrid = document.querySelector('.stat-grid');
if (statGrid) {
  const statValues = statGrid.querySelectorAll('.stat-cell__value[data-count]');
  if (reduceMotion) {
    statValues.forEach(el => {
      const decimals = (el.dataset.count.split('.')[1] || '').length;
      el.textContent = parseFloat(el.dataset.count).toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
    });
  } else {
    const statObserver = new IntersectionObserver(([entry], observer) => {
      if (entry.isIntersecting) {
        statValues.forEach(animateCount);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    statObserver.observe(statGrid);
  }
}
