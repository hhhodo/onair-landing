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
const navBurger = document.querySelector('.nav__burger');
if (navBurger && nav) {
  navBurger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    navBurger.setAttribute('aria-expanded', String(isOpen));
  });
  nav.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      nav.classList.remove('nav--open');
      navBurger.setAttribute('aria-expanded', 'false');
    }
  });
}

const transparentNavSections = document.querySelectorAll('.hero, .collage-pin-wrap');
if (nav && transparentNavSections.length) {
  const intersecting = new Set();
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) intersecting.add(entry.target);
      else intersecting.delete(entry.target);
    });
    nav.classList.toggle('nav--transparent', intersecting.size > 0);
  }, { threshold: 0 });
  transparentNavSections.forEach(section => navObserver.observe(section));
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

const dotfield = document.querySelector('.hero__dotfield');
if (dotfield && !reduceMotion) {
  const SPACING = 28;
  const RADIUS = 150;
  const MAX_SCALE = 3.2;

  let dots = [];
  let activeDots = new Set();
  let pointer = null;
  let ticking = false;

  function buildDots() {
    dotfield.innerHTML = '';
    dots = [];
    const w = dotfield.offsetWidth;
    const h = dotfield.offsetHeight;
    const cols = Math.ceil(w / SPACING) + 1;
    const rows = Math.ceil(h / SPACING) + 1;
    const frag = document.createDocumentFragment();
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * SPACING;
        const y = r * SPACING;
        const el = document.createElement('div');
        el.className = 'hero__dot';
        el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) scale(1)`;
        frag.appendChild(el);
        dots.push({ el, x, y });
      }
    }
    dotfield.appendChild(frag);
  }

  function updateDots() {
    ticking = false;
    if (!pointer) return;
    const stillActive = new Set();
    for (const dot of dots) {
      const dx = dot.x - pointer.x;
      const dy = dot.y - pointer.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS;
        const scale = 1 + t * (MAX_SCALE - 1);
        dot.el.style.transform = `translate(${dot.x}px, ${dot.y}px) translate(-50%, -50%) scale(${scale})`;
        dot.el.classList.add('hero__dot--cross');
        stillActive.add(dot.el);
      }
    }
    activeDots.forEach(el => {
      if (!stillActive.has(el)) {
        el.classList.remove('hero__dot--cross');
        el.style.transform = el.style.transform.replace(/scale\([^)]+\)/, 'scale(1)');
      }
    });
    activeDots = stillActive;
  }

  function requestUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateDots);
      ticking = true;
    }
  }

  buildDots();
  window.addEventListener('resize', buildDots);

  const heroSection = document.querySelector('.hero');
  heroSection.addEventListener('mousemove', (e) => {
    const rect = dotfield.getBoundingClientRect();
    pointer = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    requestUpdate();
  });
  heroSection.addEventListener('mouseleave', () => {
    pointer = null;
    activeDots.forEach(el => {
      el.classList.remove('hero__dot--cross');
      el.style.transform = el.style.transform.replace(/scale\([^)]+\)/, 'scale(1)');
    });
    activeDots = new Set();
  });
}
