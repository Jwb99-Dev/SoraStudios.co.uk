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

/* Allow native touch scroll on mobile */
wrapper.addEventListener('touchstart', () => {}, { passive: true });

/* ===========================
   HERO TAG INTRO ANIMATION
   =========================== */
const heroTags = document.querySelectorAll('.hero__tags .tag');

heroTags.forEach((tag, index) => {
  setTimeout(() => {
    tag.classList.add('intro-pop');
    tag.addEventListener('animationend', () => {
      tag.classList.remove('intro-pop');
      tag.removeAttribute('style');
      tag.classList.add('settled');
    }, { once: true });
  }, 1900 + (index * 400));
});



