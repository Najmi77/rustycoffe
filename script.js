/* script.js — Star Coffe frontend
   - mobile nav toggle
   - parallax (light)
   - reveal on scroll (IntersectionObserver)
   - counters (animate when visible)
   - lightbox gallery
   - contact form (client-side)
   - small micro-interactions
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAV TOGGLE (mobile) ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const primaryNav = document.getElementById('primary-nav');

  if (navToggle && primaryNav) {
    navToggle.addEventListener('click', () => {
      const open = primaryNav.classList.toggle('open');
      primaryNav.style.display = open ? 'block' : '';
      navToggle.setAttribute('aria-expanded', String(open));
    });

    // close on nav link click for small screens
    primaryNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        primaryNav.classList.remove('open');
        primaryNav.style.display = 'none';
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  /* ---------- PARALLAX (hero) ---------- */
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const sc = window.scrollY;
      // small scale + translate for subtle parallax
      const scale = 1 + Math.min(sc / 2500, 0.06);
      const translateY = Math.min(sc / 6, 60);
      hero.style.setProperty('--parallax-scale', scale);
      hero.querySelector('::before'); // noop to avoid linter issues
      // apply transform on pseudo via style on element (works by transform)
      hero.style.setProperty('transform', `translateY(${translateY * 0.02}px)`);
      // better approach: set CSS variable to be read in :before (if used)
      hero.style.setProperty('--p-translate', `${translateY}px`);
      // scale the pseudo background by setting transform on hero::before is not directly possible from JS
      // Instead give hero::before transform using CSS and this var
      hero.style.setProperty('background-position-y', `${translateY * 0.4}px`);
    }, { passive: true });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // counters handling
        if (entry.target.querySelectorAll && entry.target.querySelectorAll('[data-sr="counter"]').length) {
          animateCounters(entry.target.querySelectorAll('[data-sr="counter"]'));
        }
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach(r => io.observe(r));

  /* ---------- COUNTERS ---------- */
  function animateCounters(nodes) {
    nodes.forEach(node => {
      const end = parseInt(node.textContent.replace(/[^\d]/g, ''), 10) || 0;
      const duration = 1400;
      let start = 0;
      const startTs = performance.now();
      const step = (ts) => {
        const progress = Math.min(1, (ts - startTs) / duration);
        const value = Math.floor(progress * end);
        node.textContent = value + (end >= 1000 && end % 1000 === 0 ? '+' : '');
        if (progress < 1) requestAnimationFrame(step);
        else node.textContent = end >= 1000 ? `${end}+` : `${end}`;
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- GALLERY LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = lightbox && lightbox.querySelector('.lb-img');
  const lbClose = lightbox && lightbox.querySelector('.lb-close');

  document.querySelectorAll('.g-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src || btn.querySelector('img')?.src;
      if (!src) return;
      lbImg.src = src;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) lbClose.addEventListener('click', closeLightbox);
  if (lightbox) lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  function closeLightbox() {
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  /* ---------- CONTACT FORM (client-side) ---------- */
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      contactStatus.textContent = '';
      const fm = new FormData(contactForm);
      const name = (fm.get('name') || '').toString().trim();
      const email = (fm.get('email') || '').toString().trim();
      const message = (fm.get('message') || '').toString().trim();

      if (!name || !email || !message) {
        contactStatus.textContent = 'Mohon lengkapi semua kolom.';
        contactStatus.style.color = 'crimson';
        return;
      }

      // Simulate submit (no backend)
      contactStatus.textContent = 'Terima kasih — pesan Anda telah diterima (simulasi).';
      contactStatus.style.color = 'green';
      contactForm.reset();

      // small micro-interaction: pulse header brand
      const brand = document.querySelector('.brand');
      if (brand) {
        brand.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 450, easing: 'ease' });
      }
    });
  }

  /* ---------- SMALL UI POLISH: hover on cards scale + shadow ---------- */
  document.querySelectorAll('.card, .menu-card, .person').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.transform = 'translateY(-6px)');
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });

  /* ---------- SET YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- ACCESSIBILITY: keyboard close lightbox on Esc ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const lb = document.getElementById('lightbox');
      if (lb && lb.getAttribute('aria-hidden') === 'false') closeLightbox();
    }
  });

  /* ---------- SMOOTH INTERNAL LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (ev) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      ev.preventDefault();
      const offset = 64; // header offset
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

}); // DOMContentLoaded

// Register Service Worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then((reg) => console.log("Service Worker registered:", reg))
      .catch((err) => console.log("SW registration failed:", err));
  });
}

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navLinks").classList.toggle("show");
});
