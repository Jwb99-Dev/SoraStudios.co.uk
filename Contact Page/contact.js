/* ============================================================
   SORA STUDIOS — contact.js
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
      const target = document.getElementById('contact-form');
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

  /* ============================================================
     SERVICE SELECT — show/hide website field
     ============================================================ */
  const serviceSelect  = document.getElementById('serviceRequired');
  const websiteField   = document.getElementById('field-website');
  const websiteInput   = document.getElementById('existingWebsite');

  const SERVICES_WITH_WEBSITE = ['ux', 'web'];

  serviceSelect.addEventListener('change', () => {
    const val = serviceSelect.value;
    if (SERVICES_WITH_WEBSITE.includes(val)) {
      websiteField.classList.remove('form-field--hidden');
      websiteField.classList.add('form-field--visible');
    } else {
      websiteField.classList.remove('form-field--visible');
      websiteField.classList.add('form-field--hidden');
      websiteInput.value = '';
    }
  });

  /* ============================================================
     FORM VALIDATION & SUBMISSION
     ============================================================ */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  // Clear error state on input
  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
      const field = input.closest('.form-field');
      if (field) field.classList.remove('has-error');
    });
  });

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateField(fieldEl, inputEl, customCheck) {
    const isValid = customCheck ? customCheck(inputEl.value.trim()) : inputEl.value.trim() !== '';
    if (!isValid) {
      fieldEl.classList.add('has-error');
      inputEl.focus();
      return false;
    }
    fieldEl.classList.remove('has-error');
    return true;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Gather field references
    const fields = [
      { el: document.getElementById('field-name'),    input: document.getElementById('fullName'),      check: null },
      { el: document.getElementById('field-email'),   input: document.getElementById('emailAddress'),  check: validateEmail },
      { el: document.getElementById('field-phone'),   input: document.getElementById('phoneNumber'),   check: null },
      { el: document.getElementById('field-service'), input: serviceSelect,                            check: v => v !== '' },
    ];

    let firstError = null;
    let allValid = true;

    fields.forEach(f => {
      const valid = validateField(f.el, f.input, f.check);
      if (!valid && !firstError) firstError = f.input;
      if (!valid) allValid = false;
    });

    if (!allValid) {
      firstError.focus();
      return;
    }

    // ---- Collect form data ----
    const formData = {
      fullName:        document.getElementById('fullName').value.trim(),
      emailAddress:    document.getElementById('emailAddress').value.trim(),
      phoneNumber:     document.getElementById('phoneNumber').value.trim(),
      serviceRequired: serviceSelect.options[serviceSelect.selectedIndex].text,
      existingWebsite: websiteInput.value.trim() || 'N/A',
      additionalInfo:  document.getElementById('additionalInfo').value.trim() || 'None provided',
    };

    // ---- Submit via EmailJS (see setup instructions in README) ----
    // If EmailJS is configured, uncomment and fill in your IDs:
    
    try {
      await emailjs.send(
        'service_o8in8tj',   // e.g. 'service_abc123'
        'template_nmtqogw',  // e.g. 'template_xyz789'
        {
          from_name:       formData.fullName,
          from_email:      formData.emailAddress,
          phone:           formData.phoneNumber,
          service:         formData.serviceRequired,
          existing_website: formData.existingWebsite,
          message:         formData.additionalInfo,
          to_email:        'contact@sora-studios.co.uk',
        }
      );
    } catch (err) {
      console.error('EmailJS error:', err);
      // Optionally show an error message here
      return;
    }
    

    // ---- Show success state ----
    form.style.display = 'none';
    formSuccess.classList.add('visible');

  });

});
