/* ============================================================
   SORA STUDIOS — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     PRELOADER
     — Star animates for 1.8 s, then the preloader fades out
       and page animations begin mid-exit so the hero is still
       animating when the loader finishes.
     ============================================================ */
  const preloader   = document.getElementById('preloader');

  // Total time the preloader is visible before exit starts
  const PRELOADER_DURATION = 1400; // ms  (matches star animation)
  // How long the CSS exit transition takes (see #preloader.preloader-exit)
  const EXIT_DURATION      = 550;  // ms

  // The moment the preloader starts exiting, kick off page animations
  // so they're already partway through when the preloader disappears.
  const PAGE_ANIM_LEAD     = 200;  // ms before exit — head-start for page

  setTimeout(() => {
    // Start page animations slightly before the exit so they're visible underneath
    startPageAnimations();

    setTimeout(() => {
      // Trigger CSS exit transition on the preloader
      preloader.classList.add('preloader-exit');
      document.body.classList.remove('preloader-active');

      // Remove from DOM after transition completes
      setTimeout(() => {
        preloader.remove();
      }, EXIT_DURATION + 100);
    }, PAGE_ANIM_LEAD);

  }, PRELOADER_DURATION - PAGE_ANIM_LEAD);

  /* ============================================================
     PAGE ANIMATIONS
     — Called mid-preloader-exit so animations are in progress
       when the preloader finishes disappearing.
     ============================================================ */
  function startPageAnimations() {

    /* ---- HERO stagger text ---- */
    const staggerEls = document.querySelectorAll('.animate-stagger');

    staggerEls.forEach(el => {
      const delay = parseFloat(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('visible');
      }, 80 + delay * 260);
    });

    /* ---- HERO TAGS — appear then pulse one by one ---- */
    const tags = document.querySelectorAll('.animate-tag');
    const baseTagDelay = 80 + (staggerEls.length - 1) * 260 + 300;

    tags.forEach(tag => {
      const tagDelay = parseInt(tag.dataset.tagDelay || 0);
      const appearAt  = baseTagDelay + tagDelay * 220;
      const pulseAt   = baseTagDelay + tags.length * 220 + tagDelay * 280 + 150;

      setTimeout(() => { tag.classList.add('tag-visible'); }, appearAt);

      setTimeout(() => {
        tag.classList.add('tag-pulse');
        setTimeout(() => tag.classList.remove('tag-pulse'), 600);
      }, pulseAt);

      tag.addEventListener('mouseenter', () => {
        tag.classList.remove('tag-pulse');
        tag.classList.add('hovered');
      });
      tag.addEventListener('mouseleave', () => {
        tag.classList.remove('hovered');
      });
    });
  }

  /* ============================================================
     NAVBAR — scroll & mobile toggle
     ============================================================ */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
  });

  // X close button
  const navClose = document.getElementById('navClose');
  if (navClose) {
    navClose.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  }

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

 /* ============================================================
     HERO — set video playback speed to 50%
     ============================================================ */
  const heroVideo = document.querySelector('.hero-bg-video');
  if (heroVideo) {
    heroVideo.playbackRate = 0.5;
  }

  /* ============================================================
     SCROLL DOWN — click to scroll to services
     ============================================================ */
  const scrollDown = document.getElementById('scrollDown');
  const servicesSection = document.getElementById('services');

  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const heroWrap = document.querySelector('.hero-sticky-wrap');
      const scrollTarget = heroWrap ? heroWrap.offsetTop + window.innerHeight : window.innerHeight;
      window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
    });
  }

  /* ============================================================
     INTERSECTION OBSERVER — section reveals
     ============================================================ */
  const observerOpts = { threshold: 0.12, rootMargin: '0px 0px -40px 0px' };

  // Heading reveal
  const headingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        headingObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.reveal-heading').forEach(el => headingObserver.observe(el));

  // Service tiles reveal with stagger
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

  document.querySelectorAll('.reveal-tile').forEach(el => tileObserver.observe(el));

  // Service tile — overlay flash on scroll-in, staggered one by one
  const flashObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseFloat(entry.target.dataset.tileDelay || 0);
        setTimeout(() => {
          entry.target.classList.remove('flash');
          // Force reflow so animation restarts cleanly
          void entry.target.offsetWidth;
          entry.target.classList.add('flash');
        }, delay * 200);
        flashObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.service-tile').forEach(el => flashObserver.observe(el));

  // About reveal
  const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        aboutObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-about').forEach(el => aboutObserver.observe(el));

  /* ============================================================
     WORK SCROLL — arrow navigation
     ============================================================ */
  const workTrack = document.getElementById('workTrack');
  const workLeft  = document.getElementById('workLeft');
  const workRight = document.getElementById('workRight');

  let currentOffset = 0;
  const CARD_WIDTH  = 300; // card width + gap

  function updateWorkArrows() {
    if (!workTrack) return;
    const maxScroll = workTrack.scrollWidth - workTrack.parentElement.clientWidth;
    const scrollLeft = -currentOffset;

    if (workLeft)  workLeft.disabled  = scrollLeft <= 0;
    if (workRight) workRight.disabled = scrollLeft >= maxScroll - 10;
  }

  function scrollWork(direction) {
    if (!workTrack) return;
    const wrapperWidth = workTrack.parentElement.clientWidth;
    const maxScroll    = workTrack.scrollWidth - wrapperWidth;

    currentOffset += direction * -CARD_WIDTH;
    currentOffset  = Math.max(-maxScroll, Math.min(0, currentOffset));

    workTrack.style.transform = `translateX(${currentOffset}px)`;
    updateWorkArrows();
  }

  if (workLeft)  workLeft.addEventListener('click',  () => scrollWork(-1));
  if (workRight) workRight.addEventListener('click', () => scrollWork(1));

  // Touch / swipe support for work track
  let touchStartX = 0;
  let touchStartOffset = 0;

  if (workTrack) {
    workTrack.parentElement.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX;
      touchStartOffset = currentOffset;
    }, { passive: true });

    workTrack.parentElement.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - touchStartX;
      const wrapperWidth = workTrack.parentElement.clientWidth;
      const maxScroll    = workTrack.scrollWidth - wrapperWidth;
      currentOffset = Math.max(-maxScroll, Math.min(0, touchStartOffset + dx));
      workTrack.style.transform = `translateX(${currentOffset}px)`;
    }, { passive: true });

    workTrack.parentElement.addEventListener('touchend', () => {
      updateWorkArrows();
    }, { passive: true });
  }

  // Init arrows
  updateWorkArrows();
  window.addEventListener('resize', updateWorkArrows, { passive: true });

});
