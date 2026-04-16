/* ============================================================
   SORA STUDIOS — about/script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader = document.getElementById('preloader');
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
        setTimeout(() => { preloader.remove(); }, EXIT_DURATION + 100);
      }, PAGE_ANIM_LEAD);
    }, PRELOADER_DURATION - PAGE_ANIM_LEAD);
  } else {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    startPageAnimations();
  }

  /* ============================================================
     HERO ANIMATIONS — staggered on load
     ============================================================ */
  function startPageAnimations() {
    const heroEls = document.querySelectorAll('.animate-in');
    heroEls.forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, 100 + delay * 220);
    });
  }

  /* ============================================================
     NAVBAR — scroll & mobile toggle
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
     INTERSECTION OBSERVERS — section reveals
     ============================================================ */
  const baseOpts = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };

  // Generic fade reveals
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, baseOpts);

  document.querySelectorAll('.reveal-fade, .about-cta-inner').forEach(el => fadeObserver.observe(el));

  // Slide reveals (story section)
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        slideObserver.unobserve(entry.target);
      }
    });
  }, baseOpts);

  document.querySelectorAll('.reveal-slide').forEach(el => slideObserver.observe(el));

  // Value cards with stagger
  const tileObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.tileDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 140);
        tileObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.value-card').forEach(el => tileObserver.observe(el));

  // Stat numbers (intro strip)
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.delay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 120);
        statObserver.unobserve(entry.target);
      }
    });
  }, baseOpts);

  document.querySelectorAll('.about-intro-stat').forEach(el => statObserver.observe(el));

  // Process steps
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.stepDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 160);
        stepObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  document.querySelectorAll('.process-step').forEach(el => stepObserver.observe(el));

  // Values header
  const headerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        headerObserver.unobserve(entry.target);
      }
    });
  }, baseOpts);

  document.querySelectorAll('.values-header, .process-header').forEach(el => headerObserver.observe(el));

  /* ============================================================
     SCROLL DOWN BUTTON
     ============================================================ */
  const scrollDown = document.getElementById('scrollDown');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      document.querySelector('.story-section').scrollIntoView({ behavior: 'smooth' });
    });
  }

});
