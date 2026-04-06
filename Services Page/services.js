/* ============================================================
   SORA STUDIOS — services.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     ============================================================ */
  const preloader   = document.getElementById('preloader');
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
        setTimeout(() => {
          preloader.remove();
        }, EXIT_DURATION + 100);
      }, PAGE_ANIM_LEAD);
    }, PRELOADER_DURATION - PAGE_ANIM_LEAD);
  } else {
    preloader.remove();
    document.body.classList.remove('preloader-active');
    startPageAnimations();
  }

  /* ============================================================
     PAGE ANIMATIONS — hero stagger
     ============================================================ */
  function startPageAnimations() {
    const staggerEls = document.querySelectorAll('.animate-stagger');
    staggerEls.forEach(el => {
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
     SCROLL DOWN BUTTON
     ============================================================ */
  const scrollDown = document.getElementById('scrollDown');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const target = document.getElementById('services-detail');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  /* ============================================================
     SERVICES TAB NAV
     ============================================================ */
  const tabBtns   = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  function activateTab(tabName) {
    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tabName);
    });
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));
  });

  // Default: activate first tab
  activateTab('ux');

  /* ============================================================
     DEEP LINK — ?service=web etc.
     — Used when coming from the home page service tiles
     ============================================================ */
  function handleDeepLink() {
    const params  = new URLSearchParams(window.location.search);
    const service = params.get('service');

    if (service) {
      // Activate the correct tab immediately (no scroll yet)
      activateTab(service);

      // Wait for preloader + page to settle, then smooth scroll to section
      const scrollToServices = () => {
        const target = document.getElementById('services-detail');
        if (target) {
          // Give the sticky hero time to settle
          setTimeout(() => {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 200);
        }
      };

      // Delay until preloader is gone
      setTimeout(scrollToServices, PRELOADER_DURATION + EXIT_DURATION + 100);
    }
  }

  handleDeepLink();

  /* ============================================================
     INTERSECTION OBSERVER — pricing reveal
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
