/* ══════════════════════════════════════
   FINAL.JS — Botão fugitivo e celebração
══════════════════════════════════════ */

// ─── Contador de dias ──────────────────────────────────────
function calcDays() {
  const start = new Date('2023-10-14T00:00:00');
  const now   = new Date();
  return Math.floor((now - start) / (1000 * 60 * 60 * 24));
}
function animateCounter(el, target, duration = 2000) {
  if (!el) return;
  const start = performance.now();
  (function update(now) {
    const p = Math.min((now - start) / duration, 1);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(e * target);
    if (p < 1) requestAnimationFrame(update);
  })(performance.now());
}

// ─── Corações flutuantes de fundo ──────────────────────────
(function spawnHearts() {
  const bg = document.getElementById('heartsBg');
  if (!bg) return;
  function addHeart() {
    const h = document.createElement('span');
    h.className = 'heart-float';
    h.textContent = Math.random() > 0.5 ? '♥' : '♡';
    h.style.left = Math.random() * 100 + '%';
    h.style.fontSize = (0.8 + Math.random() * 1.6) + 'rem';
    h.style.animationDuration = (7 + Math.random() * 8) + 's';
    h.style.animationDelay = '0s';
    bg.appendChild(h);
    setTimeout(() => h.remove(), 15000);
  }
  setInterval(addHeart, 700);
  for (let i = 0; i < 8; i++) setTimeout(addHeart, i * 200);
})();

// ─── Botão Não fugitivo ────────────────────────────────────
const btnNao    = document.getElementById('btnNao');
const btnSim    = document.getElementById('btnSim');
const area      = document.getElementById('buttonsArea');
const escapeMsg = document.getElementById('escapeMsg');

const escapeMsgs = [
  'Ei, para!',
  'Você não vai me pegar!',
  'Tente de novo... kkk',
  'Nem pensar!',
  'Esse botão é tímido hein!',
  'Volte aqui! kkkk',
  'Quase! 😂',
];

let isMobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);
let escapeCount = 0;
let naoAbsolute = false;

function makeAbsolute() {
  if (naoAbsolute) return;
  naoAbsolute = true;
  const rect = btnNao.getBoundingClientRect();
  const areaRect = area.getBoundingClientRect();
  btnNao.style.position = 'fixed'; // Usa fixed pra poder ir em qualquer lugar da tela
  btnNao.style.left = rect.left + 'px';
  btnNao.style.top  = rect.top  + 'px';
  btnNao.style.margin = '0';
  document.body.appendChild(btnNao); // Move pra body pra usar coordenadas da viewport
}

function runAway() {
  if (isMobile) {
    // No mobile: teleporta para posição aleatória na tela
    makeAbsolute();
    const margin = 80;
    const maxX = window.innerWidth  - btnNao.offsetWidth  - margin;
    const maxY = window.innerHeight - btnNao.offsetHeight - margin;
    const newX = margin + Math.random() * maxX;
    const newY = margin + Math.random() * maxY;
    btnNao.style.left = newX + 'px';
    btnNao.style.top  = newY + 'px';
  } else {
    // No desktop: foge do cursor em direção oposta
    makeAbsolute();
    const margin = 30;
    const btnRect = btnNao.getBoundingClientRect();
    const btnCX = btnRect.left + btnRect.width  / 2;
    const btnCY = btnRect.top  + btnRect.height / 2;

    // Direção OPOSTA ao centro do botão partindo do cursor (usa mouse position)
    const dx = btnCX - (window._mouseX ?? btnCX);
    const dy = btnCY - (window._mouseY ?? btnCY);
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const flee = 160 + Math.random() * 80;

    let newX = btnRect.left + nx * flee;
    let newY = btnRect.top  + ny * flee;

    // Mantém dentro da tela
    newX = Math.max(margin, Math.min(window.innerWidth  - btnNao.offsetWidth  - margin, newX));
    newY = Math.max(margin, Math.min(window.innerHeight - btnNao.offsetHeight - margin, newY));

    btnNao.style.left = newX + 'px';
    btnNao.style.top  = newY + 'px';
  }

  escapeCount++;
  escapeMsg.textContent = escapeMsgs[escapeCount % escapeMsgs.length];
}

// Rastreia posição do mouse
window.addEventListener('mousemove', e => {
  window._mouseX = e.clientX;
  window._mouseY = e.clientY;
});

// Foge pro touch também
btnNao.addEventListener('touchstart', e => { e.preventDefault(); runAway(); }, { passive: false });

// ─── Sim! ──────────────────────────────────────────────────
window.handleSim = function() {
  const card        = document.getElementById('questionCard');
  const celebration = document.getElementById('celebration');
  if (!card || !celebration) return;

  // Lança confetti
  launchConfetti();

  // Troca o card pela celebração
  card.style.animation = 'none';
  card.style.opacity = '0';
  card.style.transform = 'scale(0.9)';
  card.style.transition = 'all 0.4s ease';

  setTimeout(() => {
    card.style.display = 'none';
    if (btnNao.parentElement !== area) btnNao.remove(); // Remove o botão fugitivo
    celebration.classList.add('show');
    animateCounter(document.getElementById('celebrateDays'), calcDays(), 2500);
  }, 400);
};

// ─── Confetti ─────────────────────────────────────────────
function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  const colors = ['#e91e8c', '#7AC142', '#9B59B6', '#4ECDC4', '#f1c40f', '#ff6b6b', '#fff'];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left   = Math.random() * 100 + 'vw';
      piece.style.top    = '-20px';
      piece.style.width  = (6 + Math.random() * 8) + 'px';
      piece.style.height = (6 + Math.random() * 8) + 'px';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay   = '0s';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }, i * 20);
  }
}
