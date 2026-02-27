/* ══════════════════════════════════════
   MUSICA.JS — Player de Áudio
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const audio         = document.getElementById('audioPlayer');
  const btnPlay       = document.getElementById('btnPlay');
  const playIcon      = document.getElementById('playIcon');
  const btnRewind     = document.getElementById('btnRewind');
  const btnForward    = document.getElementById('btnForward');
  const progressFill  = document.getElementById('progressFill');
  const progressThumb = document.getElementById('progressThumb');
  const progressWrap  = document.getElementById('progressWrap');
  const timeCurrent   = document.getElementById('timeCurrent');
  const timeTotal     = document.getElementById('timeTotal');
  const volumeSlider  = document.getElementById('volumeSlider');
  const vinyl         = document.getElementById('vinyl');
  const audioWaves    = document.getElementById('audioWaves');

  // ─── Partículas de fundo ────────────────────────────────
  const particlesEl = document.getElementById('particles');
  if (particlesEl) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.style.cssText = `
        position:absolute;
        width:${2 + Math.random()*3}px;
        height:${2 + Math.random()*3}px;
        background:rgba(${Math.random() > 0.5 ? '155,89,182' : '78,205,196'},0.4);
        border-radius:50%;
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        animation: particleFloat ${4 + Math.random()*6}s ease-in-out ${Math.random()*4}s infinite alternate;
      `;
      particlesEl.appendChild(p);
    }
    const styleTag = document.createElement('style');
    styleTag.textContent = `
      @keyframes particleFloat {
        0%   { transform: translate(0,0); opacity:0.3; }
        100% { transform: translate(${Math.random()>0.5?'':'-'}${20+Math.random()*40}px, ${Math.random()>0.5?'':'-'}${20+Math.random()*40}px); opacity:0.8; }
      }
    `;
    document.head.appendChild(styleTag);
  }

  // ─── Utilitários ────────────────────────────────────────
  function formatTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  }

  function setPlaying(playing) {
    playIcon.textContent = playing ? '⏸' : '▶';
    if (vinyl)     vinyl.classList.toggle('playing', playing);
    if (audioWaves) audioWaves.classList.toggle('playing', playing);
  }

  // ─── Controles ──────────────────────────────────────────
  btnPlay.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  btnRewind.addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 10); });
  btnForward.addEventListener('click', () => { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10); });

  volumeSlider.addEventListener('input', () => { audio.volume = volumeSlider.value; });

  // ─── Eventos do áudio ───────────────────────────────────
  audio.addEventListener('play',  () => setPlaying(true));
  audio.addEventListener('pause', () => setPlaying(false));
  audio.addEventListener('ended', () => setPlaying(false));

  audio.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    timeCurrent.textContent = formatTime(audio.currentTime);
  });

  // ─── Clique na barra de progresso ───────────────────────
  let dragging = false;

  function seekTo(e) {
    const rect = progressWrap.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    if (audio.duration) {
      audio.currentTime = pct * audio.duration;
    }
  }

  progressWrap.addEventListener('mousedown',  e => { dragging = true; seekTo(e); });
  progressWrap.addEventListener('touchstart', e => { dragging = true; seekTo(e); }, { passive: true });
  window.addEventListener('mousemove',  e => { if (dragging) seekTo(e); });
  window.addEventListener('touchmove',  e => { if (dragging) seekTo(e); }, { passive: true });
  window.addEventListener('mouseup',   () => { dragging = false; });
  window.addEventListener('touchend',  () => { dragging = false; });

  // ─── Volume inicial ─────────────────────────────────────
  audio.volume = parseFloat(volumeSlider.value);
});
