/* ===========================
   HAMBURGER MENU
   =========================== */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    nav.classList.remove('open');
  });
});

/* ===========================
   WORK TRACK: DRAG TO SCROLL + STACKING
   =========================== */
const wrapper = document.getElementById('workTrackWrapper');
const track = document.getElementById('workTrack');

let isDown = false;
let startX;
let scrollLeft;

wrapper.addEventListener('mousedown', (e) => {
  isDown = true;
  wrapper.classList.add('grabbing');
  startX = e.pageX - wrapper.offsetLeft;
  scrollLeft = wrapper.scrollLeft;
});

wrapper.addEventListener('mouseleave', () => {
  isDown = false;
  wrapper.classList.remove('grabbing');
});

wrapper.addEventListener('mouseup', () => {
  isDown = false;
  wrapper.classList.remove('grabbing');
});

wrapper.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - wrapper.offsetLeft;
  const walk = (x - startX) * 1.4;
  wrapper.scrollLeft = scrollLeft - walk;
});

/* Convert vertical wheel to horizontal scroll when hovering the track */
wrapper.addEventListener('wheel', (e) => {
  const maxScroll = wrapper.scrollWidth - wrapper.clientWidth;
  if (maxScroll <= 0) return;
  e.preventDefault();
  wrapper.scrollLeft += e.deltaY * 1.5;
}, { passive: false });


/* ===========================
   SERVICES: HIGHLIGHT ICON ON SCROLL
   =========================== */
const panels = document.querySelectorAll('.service-panel');
const iconBtns = document.querySelectorAll('.service-icon-btn');

iconBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.index, 10);
    const target = document.querySelector(`.service-panel[data-index="${idx}"]`);
    if (target) {
      const navH = document.querySelector('.navbar').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 40;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===========================
   SERVICES: SCROLL-LOCK + CARD SWITCH
   =========================== */
const servicesSection = document.getElementById('our-services');

let currentService = 0;
let isTransitioning = false;
let serviceLocked = false;

function setActiveService(idx, callback) {
  if (isTransitioning) return;
  if (idx < 0 || idx >= panels.length) {
    if (callback) callback();
    return;
  }

  isTransitioning = true;
  currentService = idx;

  panels.forEach(p => p.classList.remove('active'));
  iconBtns.forEach(b => b.classList.remove('active'));

  const activePanel = document.querySelector(`.service-panel[data-index="${idx}"]`);
  const activeBtn = document.querySelector(`.service-icon-btn[data-index="${idx}"]`);
  if (activePanel) activePanel.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');

  setTimeout(() => {
    isTransitioning = false;
    if (callback) callback();
  }, 650);
}

// Click icon to switch
iconBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const idx = parseInt(btn.dataset.index, 10);
    setActiveService(idx);
  });
});

// Scroll lock logic
let scrollAccumulator = 0;
const SCROLL_THRESHOLD = 80;

window.addEventListener('wheel', (e) => {
  const rect = servicesSection.getBoundingClientRect();
  const inView = rect.top <= window.innerHeight * 0.3 && rect.bottom >= window.innerHeight * 0.7;

  if (!inView) {
    scrollAccumulator = 0;
    return;
  }

  const atFirst = currentService === 0;
  const atLast = currentService === panels.length - 1;

  // If scrolling up and on first, or scrolling down and on last — let page scroll
  if ((e.deltaY < 0 && atFirst) || (e.deltaY > 0 && atLast)) {
    scrollAccumulator = 0;
    return;
  }

  // Otherwise trap the scroll
  e.preventDefault();
  scrollAccumulator += e.deltaY;

  if (scrollAccumulator > SCROLL_THRESHOLD) {
    scrollAccumulator = 0;
    setActiveService(currentService + 1);
  } else if (scrollAccumulator < -SCROLL_THRESHOLD) {
    scrollAccumulator = 0;
    setActiveService(currentService - 1);
  }
}, { passive: false });

// Touch support
let touchStartY = 0;

servicesSection.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

servicesSection.addEventListener('touchend', (e) => {
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) < 40) return;
  if (diff > 0) {
    setActiveService(currentService + 1);
  } else {
    setActiveService(currentService - 1);
  }
}, { passive: true });

// Init
setActiveService(0);
