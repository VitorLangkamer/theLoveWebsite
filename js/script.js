/* ══════════════════════════════════════
   SCRIPT.JS — Splash, Timeline, Contador
══════════════════════════════════════ */

// ─── Contador de dias juntos ───────────────────────────────
function calcDays() {
  const start = new Date('2023-09-27T00:00:00');
  const now   = new Date();
  const diff  = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  return diff;
}

function animateCounter(el, target, duration = 1500) {
  if (!el) return;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ─── Splash Screen ─────────────────────────────────────────
(function initSplash() {
  const splash  = document.getElementById('splash');
  const content = document.getElementById('home');
  if (!splash) return; // Só roda na index

  // Mostra o splash
  splash.style.opacity = '1';

  // Após 3s, some o splash e mostra o conteúdo
  setTimeout(() => {
    splash.style.opacity = '0';
    if (content) content.classList.add('show');
    document.body.classList.add('content-ready');

    setTimeout(() => {
      splash.classList.add('hidden');

      // Inicia contador
      const daysEl = document.getElementById('daysCount');
      if (daysEl) animateCounter(daysEl, calcDays());
    }, 1300);
  }, 5000);
})();

// ─── Timeline Scroll Reveal ────────────────────────────────
(function initTimeline() {
  const events = document.querySelectorAll('.timeline-event');
  if (!events.length) return;

  function reveal() {
    const wh = window.innerHeight;
    events.forEach(ev => {
      const top = ev.getBoundingClientRect().top;
      if (top < wh * 0.88) {
        ev.classList.add('reveal');
      }
    });
  }

  // Ao carregar e ao scrollar
  window.addEventListener('load', reveal);
  window.addEventListener('scroll', reveal, { passive: true });

  // Contador na página da timeline
  const daysTimeline = document.getElementById('daysCountTimeline');
  if (daysTimeline) {
    // Observa quando o elemento fica visível
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(daysTimeline, calcDays(), 2000);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    observer.observe(daysTimeline.parentElement);
  }
})();
