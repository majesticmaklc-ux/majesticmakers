// public/js/main.js — Majestic Makers Frontend Logic

document.addEventListener('DOMContentLoaded', () => {

  // ══════════════════════════════════════════════════════════════
  //  NAVBAR SCROLL + HAMBURGER
  // ══════════════════════════════════════════════════════════════
  const navbar     = document.getElementById('navbar');
  const hamburger  = document.querySelector('.hamburger');
  const navLinks   = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // Highlight active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    document.querySelectorAll('.nav-links a').forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  });

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger?.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ══════════════════════════════════════════════════════════════
  //  ANIMATE ON SCROLL
  // ══════════════════════════════════════════════════════════════
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate').forEach(el => observer.observe(el));

  // ══════════════════════════════════════════════════════════════
  //  COUNTER ANIMATION (stats)
  // ══════════════════════════════════════════════════════════════
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let start = 0, duration = 1800;
      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ══════════════════════════════════════════════════════════════
  //  TOAST NOTIFICATION
  // ══════════════════════════════════════════════════════════════
  function showToast(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      toast.innerHTML = '<span class="toast-icon"></span><span class="toast-msg"></span>';
      document.body.appendChild(toast);
    }
    toast.className = `toast ${type}`;
    toast.querySelector('.toast-icon').textContent = type === 'success' ? '✅' : '❌';
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  // ══════════════════════════════════════════════════════════════
  //  ENQUIRY FORM
  // ══════════════════════════════════════════════════════════════
  const enquiryForm = document.getElementById('enquiry-form');
  enquiryForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = enquiryForm.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Sending…';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(enquiryForm));

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        enquiryForm.reset();
      } else {
        const msg = json.errors?.[0]?.msg || json.message || 'Something went wrong.';
        showToast(msg, 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  REGISTRATION FORM
  // ══════════════════════════════════════════════════════════════
  const regForm = document.getElementById('register-form');
  regForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = regForm.querySelector('.btn-submit');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Registering…';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(regForm));
    // Collect interests
    data.interests = [...regForm.querySelectorAll('input[name="interests"]:checked')].map(el => el.value);
    data.newsletter = regForm.querySelector('input[name="newsletter"]')?.checked || false;

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        regForm.reset();
      } else {
        const msg = json.errors?.[0]?.msg || json.message || 'Something went wrong.';
        showToast(msg, 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
    } finally {
      btn.innerHTML = orig;
      btn.disabled = false;
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  LOAD DYNAMIC CONTENT from server
  // ══════════════════════════════════════════════════════════════
  async function loadDynamicContent() {
    const container = document.getElementById('dynamic-blocks');
    if (!container) return;
    try {
      const res = await fetch('/api/content');
      const json = await res.json();
      if (!json.success || !json.data.length) {
        container.closest('#dynamic-content')?.style.setProperty('display', 'none');
        return;
      }
      container.innerHTML = json.data.map(item => `
        <div class="content-block animate">
          <div class="content-block-label">${item.section}</div>
          ${item.icon ? `<div style="font-size:2rem;margin-bottom:0.8rem">${item.icon}</div>` : ''}
          ${item.title ? `<h3>${item.title}</h3>` : ''}
          ${item.subtitle ? `<p style="color:var(--gold-pale);margin-bottom:0.6rem;font-size:0.9rem">${item.subtitle}</p>` : ''}
          ${item.body ? `<p>${item.body}</p>` : ''}
        </div>
      `).join('');
      // Re-observe new elements
      container.querySelectorAll('.animate').forEach(el => observer.observe(el));
    } catch (err) {
      container.closest('#dynamic-content')?.style.setProperty('display', 'none');
    }
  }

  loadDynamicContent();

  // ══════════════════════════════════════════════════════════════
  //  SMOOTH SCROLL for anchor links
  // ══════════════════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
