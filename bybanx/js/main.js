/* =====================================================
   ByBanx BYB025 — Main JavaScript
   bybanx.com · byb025.com
   ===================================================== */

'use strict';

// ── Particle Canvas ──────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.r = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -(Math.random() * 0.4 + 0.15);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.6
        ? `rgba(240,192,64,${this.alpha})`
        : `rgba(90,155,245,${this.alpha})`;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(240,192,64,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W * H / 8000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  window.addEventListener('resize', () => { init(); });
  init();
})();


// ── Navbar scroll effect ─────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


// ── Hamburger menu ───────────────────────────────────
(function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('active');
      links.classList.remove('open');
    });
  });
})();


// ── Scroll-triggered animations (AOS-lite) ──────────
(function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
})();


// ── Counter animations ───────────────────────────────
(function initCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.target);
      const isFloat = target % 1 !== 0;
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        const val = target * ease;
        el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(1) : target;
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(el => observer.observe(el));
})();


// ── Token Donut Chart ────────────────────────────────
(function initTokenChart() {
  const canvas = document.getElementById('tokenChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W / 2, cy = H / 2;
  const outerR = W * 0.46;
  const innerR = W * 0.30;

  const segments = [
    { pct: 0.40, color: '#f0c040', label: '社區挖礦' },
    { pct: 0.25, color: '#3a7bd5', label: 'RWA生態' },
    { pct: 0.15, color: '#00d2d3', label: '生態發展' },
    { pct: 0.10, color: '#5f27cd', label: '團隊顧問' },
    { pct: 0.10, color: '#ee5a24', label: '流動性' },
  ];

  let drawn = false;

  function drawChart(progress) {
    ctx.clearRect(0, 0, W, H);

    // Background circle
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.fill();

    let startAngle = -Math.PI / 2;
    const gap = 0.02;

    segments.forEach(seg => {
      const sweep = seg.pct * Math.PI * 2 * progress;
      if (sweep <= 0) return;

      // Gradient
      const grad = ctx.createLinearGradient(
        cx + Math.cos(startAngle) * outerR * 0.5,
        cy + Math.sin(startAngle) * outerR * 0.5,
        cx + Math.cos(startAngle + sweep) * outerR * 0.5,
        cy + Math.sin(startAngle + sweep) * outerR * 0.5
      );
      grad.addColorStop(0, seg.color);
      grad.addColorStop(1, seg.color + 'bb');

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle + gap, startAngle + sweep - gap);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();

      // Glow
      ctx.shadowColor = seg.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      startAngle += sweep;
    });

    // Inner hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fillStyle = '#0d1f3c';
    ctx.fill();

    // Inner border
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animateChart() {
    if (drawn) return;
    drawn = true;
    const start = performance.now();
    const dur = 1400;
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 2);
      drawChart(ease);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  drawChart(1); // draw immediately, then animate on scroll

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      drawn = false;
      animateChart();
      observer.disconnect();
    }
  }, { threshold: 0.3 });
  observer.observe(canvas);
})();


// ── Smooth anchor scroll ─────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ── Active nav link on scroll ─────────────────────────
(function initActiveSections() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const mbLinks = document.querySelectorAll('.mb-nav-item');

  function setActive() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active-link', a.getAttribute('href') === '#' + current);
    });
    mbLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
  setActive();
})();


// ── Roadmap timeline animate ──────────────────────────
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item:not(.active)');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelector('.marker-dot')?.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  // Add CSS for in-view dots
  const style = document.createElement('style');
  style.textContent = `.marker-dot.in-view { border-color: var(--blue); background: var(--blue); box-shadow: 0 0 0 4px rgba(58,123,213,0.2); }`;
  document.head.appendChild(style);

  items.forEach(el => observer.observe(el));
})();


// ── Mini app item hover glow ──────────────────────────
(function initMiniApps() {
  document.querySelectorAll('.mini-app-item').forEach((item, i) => {
    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = '0 0 20px rgba(240,192,64,0.2)';
    });
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
    });
  });
})();


// ── Floating cards micro-animation ───────────────────
(function initFloatingCards() {
  const cards = document.querySelectorAll('.floating-card');
  cards.forEach((card, i) => {
    // Animate value changes periodically
    const valEl = card.querySelector('.card-value');
    if (!valEl) return;
    const origVal = valEl.textContent;
    setInterval(() => {
      valEl.style.transform = 'scale(1.1)';
      valEl.style.color = '#ffd966';
      setTimeout(() => {
        valEl.style.transform = '';
        valEl.style.color = '';
      }, 400);
    }, 3000 + i * 1200);
  });
})();


// ── Copy invite code ──────────────────────────────────
(function initInviteCode() {
  const invite = document.querySelector('.invite-tip strong');
  if (!invite) return;
  invite.style.cursor = 'pointer';
  invite.title = '點擊複製邀請碼';
  invite.addEventListener('click', () => {
    navigator.clipboard?.writeText('BYB025').then(() => {
      const orig = invite.textContent;
      invite.textContent = '✅ 已複製：BYB025';
      setTimeout(() => invite.textContent = orig, 2000);
    });
  });
})();


// ── Page load animation ───────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});


// ── Console brand message ─────────────────────────────
console.log(
  '%c ByBanx BYB025 %c bybanx.com · byb025.com %c\n' +
  '  Web3 Human Network · RWA Ecosystem · Global Crypto Payment\n' +
  '  © 2025 ByBanx. All rights reserved.',
  'background:#f0c040;color:#0d1f3c;font-weight:900;font-size:14px;padding:4px 8px;border-radius:4px 0 0 4px;',
  'background:#0d1f3c;color:#f0c040;font-size:12px;padding:4px 8px;border-radius:0 4px 4px 0;',
  ''
);
