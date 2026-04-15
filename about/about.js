/* ============================================================
   SORA STUDIOS — about.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader        = document.getElementById('preloader');
  const PRELOADER_DURATION = 1400;
  const EXIT_DURATION      = 550;
  const PAGE_ANIM_LEAD     = 200;

  const hasVisited = sessionStorage.getItem('soraVisited');

  if (!hasVisited) {
    sessionStorage.setItem('soraVisited', 'true');
    setTimeout(() => {
      startPageAnimations();
      setTimeout(() => {
        preloader.classList.add('preloader-exit');
        document.body.classList.remove('preloader-active');
        setTimeout(() => preloader.remove(), EXIT_DURATION + 100);
      }, PAGE_ANIM_LEAD);
    }, PRELOADER_DURATION - PAGE_ANIM_LEAD);
  } else {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    startPageAnimations();
  }

  /* ============================================================
     PAGE ANIMATIONS
     ============================================================ */
  function startPageAnimations() {
    document.querySelectorAll('.animate-stagger').forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), 80 + delay * 260);
    });
  }

  /* ============================================================
     NAVBAR
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navClose  = document.getElementById('navClose');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  if (navClose) {
    navClose.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  }

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ============================================================
     SCROLL DOWN
     ============================================================ */
  const scrollDown = document.getElementById('scrollDown');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const target = document.getElementById('about-content');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER — reveals
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('revealed'), delay * 1000);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));

});
