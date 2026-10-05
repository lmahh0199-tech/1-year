// ============================================================
//  bottle.js — Love Letter in a Bottle
//  Self-contained. Reads CSS variables from the root.
//  Reuses: burstConfetti(), makeBlobSVG(), CONFETTI from script.js
// ============================================================

// ── EASY TO EDIT ─────────────────────────────────────────────
// Replace with your real letter. Each string is a paragraph.
const LETTER_PARAGRAPHS = [
  "My Cutuuuuuuuuu,",
  "I honestly don't know how we've already reached 365 days. It feels like yesterday and forever ago at the same time.",
  "This year with you has given me so many memories that I know I'll always keep close. From our stupid conversations and random laughs to the little moments that probably didn't seem important at the time, you've made even normal days feel special.",
  "You've seen me at my best, my worst, and all the annoying versions in between, and somehow you're still here 😭. I'm genuinely so grateful for that.",
  "I don't know what the next year is going to look like, but I know I want you in it. I want more pictures, more late-night talks, more laughs, more memories, and honestly, just more of us.",
  "Thank you for being my person and for making this year so special.",
  "Happy 1 year, pooks. ❤️",
  "I love you, always."
];

// ── REDUCED MOTION CHECK ────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── WEB AUDIO CONTEXT (lazy, first-tap activated) ─────────────
let audioCtx = null;
let isMuted   = false;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playTone(freq, type, gain, dur, delay = 0) {
  if (isMuted) return;
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);
    env.gain.setValueAtTime(0, ctx.currentTime + delay);
    env.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
    env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
    osc.connect(env); env.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + dur + 0.05);
  } catch(_) {}
}

function playCorkPop() {
  // Short percussive "pop"
  playTone(280, 'sine',   0.35, 0.12);
  playTone(180, 'square', 0.08, 0.10, 0.02);
  playTone(380, 'sine',   0.12, 0.06, 0.05);
}

function playPenTick() {
  // Very quiet soft click
  playTone(1800, 'sine', 0.03, 0.04);
}

function playFinalChime() {
  // Gentle ascending triad
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    playTone(f, 'sine', 0.14, 0.55, i * 0.12);
  });
}

// ── BUILD THE OVERLAY DOM ────────────────────────────────────
function buildBottleOverlay() {
  if (document.getElementById('bottle-overlay')) return; // already built

  const overlay = document.createElement('div');
  overlay.id = 'bottle-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Love letter in a bottle');

  overlay.innerHTML = `
    <!-- Sky canvas -->
    <canvas id="bottle-sky" aria-hidden="true"></canvas>

    <!-- Controls -->
    <button id="bottle-mute" aria-label="Toggle sound">🔊 Sound</button>
    <button id="bottle-close" aria-label="Close letter">&times;</button>

    <!-- Floating bottle -->
    <div id="bottle-svg-wrap" tabindex="0" role="button" aria-label="Tap the bottle to open it">
      ${makeBottleSVG()}
      <p id="bottle-hint">Tap the bottle</p>
    </div>

    <!-- Letter card (hidden until bottle tapped) -->
    <div id="bottle-letter-wrap" aria-live="polite">
      <div id="bottle-letter-card">
        <div id="bottle-letter-scroll">
          <div id="bottle-letter-text"></div><span id="bottle-cursor" aria-hidden="true"></span>
          <button id="bottle-skip" aria-label="Skip to end of letter">skip to end ↓</button>
        </div>
        <div id="bottle-finish-btns">
          <button class="bottle-action-btn secondary" id="bottle-read-again">Read it again</button>
          <button class="bottle-action-btn" id="bottle-close-letter">Close</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

// ── BOTTLE SVG ──────────────────────────────────────────────
function makeBottleSVG() {
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 210" width="110" height="190" aria-hidden="true" id="bottle-svg">
    <defs>
      <linearGradient id="btl-glass" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#c8eeff" stop-opacity="0.55"/>
        <stop offset="40%"  stop-color="#e8f8ff" stop-opacity="0.75"/>
        <stop offset="70%"  stop-color="#b0ddf5" stop-opacity="0.60"/>
        <stop offset="100%" stop-color="#90c8e8" stop-opacity="0.50"/>
      </linearGradient>
      <linearGradient id="btl-cork" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   stop-color="#d4a060"/>
        <stop offset="100%" stop-color="#9a6832"/>
      </linearGradient>
      <filter id="btl-glow">
        <feGaussianBlur stdDeviation="2.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>

    <!-- Bottle body -->
    <path d="M38,80 Q26,95 24,130 Q22,165 25,185 Q28,200 60,200 Q92,200 95,185 Q98,165 96,130 Q94,95 82,80 Z"
          fill="url(#btl-glass)" stroke="#4a2c5a" stroke-width="2" stroke-linejoin="round"/>

    <!-- Shoulder / neck taper -->
    <path d="M38,80 Q40,68 44,58 L76,58 Q80,68 82,80 Z"
          fill="url(#btl-glass)" stroke="#4a2c5a" stroke-width="2"/>

    <!-- Neck -->
    <rect x="44" y="32" width="32" height="28" rx="8"
          fill="url(#btl-glass)" stroke="#4a2c5a" stroke-width="2"/>

    <!-- Ribbon around neck -->
    <path d="M44,46 Q55,38 60,46 Q65,54 76,46" fill="none" stroke="#d4c1ff" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M60,46 L55,42 M60,46 L65,42" fill="none" stroke="#d4c1ff" stroke-width="2.5" stroke-linecap="round"/>

    <!-- Cork (will be hidden via JS when popped) -->
    <g id="btl-cork">
      <rect x="46" y="18" width="28" height="18" rx="5"
            fill="url(#btl-cork)" stroke="#4a2c5a" stroke-width="2"/>
      <!-- cork grain lines -->
      <line x1="52" y1="21" x2="52" y2="33" stroke="#7a5020" stroke-width="1" opacity="0.4"/>
      <line x1="60" y1="21" x2="60" y2="33" stroke="#7a5020" stroke-width="1" opacity="0.4"/>
      <line x1="68" y1="21" x2="68" y2="33" stroke="#7a5020" stroke-width="1" opacity="0.4"/>
    </g>

    <!-- Rolled letter inside bottle -->
    <g id="btl-letter-inside" opacity="0.7">
      <rect x="46" y="110" width="28" height="42" rx="4" fill="#fff8f0" stroke="#4a2c5a" stroke-width="1.5"/>
      <line x1="51" y1="120" x2="69" y2="120" stroke="#d4c1ff" stroke-width="1.5"/>
      <line x1="51" y1="127" x2="69" y2="127" stroke="#d4c1ff" stroke-width="1.5"/>
      <line x1="51" y1="134" x2="62" y2="134" stroke="#ffb59c" stroke-width="1.5"/>
      <!-- tie around roll -->
      <path d="M44,128 Q60,122 76,128" fill="none" stroke="#b8f0dd" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- Glossy highlight -->
    <ellipse cx="42" cy="130" rx="5" ry="28" fill="white" opacity="0.22" transform="rotate(-8,42,130)"/>
    <ellipse cx="40" cy="95"  rx="4" ry="10"  fill="white" opacity="0.25" transform="rotate(-12,40,95)"/>
  </svg>`;
}

// ── SKY SCENE (rAF loop) ────────────────────────────────────
let skyRaf   = null;
let skyState = null;

function initSkyScene() {
  const canvas = document.getElementById('bottle-sky');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const W = canvas.width, H = canvas.height;

  // Bubbles
  const bubbles = Array.from({ length: 18 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    r: 18 + Math.random() * 42,
    dx: (Math.random() - 0.5) * 0.25,
    dy: -(0.12 + Math.random() * 0.2),
    alpha: 0.08 + Math.random() * 0.15,
    hue: 280 + Math.random() * 60
  }));

  // Stars (twinkle)
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * W,
    y: Math.random() * H * 0.7,
    r: 0.6 + Math.random() * 1.4,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.03
  }));

  // Clouds (soft ellipses)
  const clouds = Array.from({ length: 5 }, () => ({
    x: Math.random() * W,
    y: 0.05 * H + Math.random() * H * 0.35,
    w: 70 + Math.random() * 100,
    h: 24 + Math.random() * 20,
    dx: 0.08 + Math.random() * 0.12,
    alpha: 0.12 + Math.random() * 0.1
  }));

  skyState = { ctx, W, H, bubbles, stars, clouds, t: 0 };

  function draw() {
    const s = skyState;
    if (!s) return;
    s.t += 1;

    // Gradient sky
    const grad = s.ctx.createLinearGradient(0, 0, 0, s.H);
    grad.addColorStop(0,   '#ffe0f0');
    grad.addColorStop(0.5, '#eed0ff');
    grad.addColorStop(1,   '#d4c1ff');
    s.ctx.fillStyle = grad;
    s.ctx.fillRect(0, 0, s.W, s.H);

    // Stars
    s.stars.forEach(st => {
      st.phase += st.speed;
      const a = 0.35 + 0.6 * Math.abs(Math.sin(st.phase));
      s.ctx.beginPath();
      s.ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      s.ctx.fillStyle = `rgba(255,240,255,${a})`;
      s.ctx.fill();
    });

    // Clouds
    s.clouds.forEach(cl => {
      cl.x += cl.dx;
      if (cl.x - cl.w > s.W) cl.x = -cl.w;
      s.ctx.beginPath();
      s.ctx.ellipse(cl.x, cl.y, cl.w, cl.h, 0, 0, Math.PI * 2);
      s.ctx.fillStyle = `rgba(255,255,255,${cl.alpha})`;
      s.ctx.fill();
    });

    // Bubbles
    s.bubbles.forEach(b => {
      b.x += b.dx + Math.sin(s.t * 0.012 + b.r) * 0.15;
      b.y += b.dy;
      if (b.y + b.r < 0) { b.y = s.H + b.r; b.x = Math.random() * s.W; }
      s.ctx.beginPath();
      s.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      s.ctx.strokeStyle = `hsla(${b.hue},70%,85%,${b.alpha * 2})`;
      s.ctx.lineWidth = 1.5;
      s.ctx.stroke();
      s.ctx.fillStyle = `hsla(${b.hue},65%,90%,${b.alpha})`;
      s.ctx.fill();
    });

    skyRaf = requestAnimationFrame(draw);
  }
  draw();
}

function stopSkyScene() {
  if (skyRaf) { cancelAnimationFrame(skyRaf); skyRaf = null; }
  skyState = null;
}

// ── BOTTLE DRIFT ────────────────────────────────────────────
let bottleRaf = null;
let bottlePhase = 0;

function startBottleDrift() {
  if (prefersReducedMotion) {
    positionBottleCenter();
    return;
  }
  const wrap = document.getElementById('bottle-svg-wrap');
  if (!wrap) return;
  const W = window.innerWidth, H = window.innerHeight;

  let bx = W * 0.5 - 55;   // start near center
  let by = H * 0.42 - 95;
  let vx = 0.4;
  let vy = -0.2;
  let rot = -4;
  wrap.style.setProperty('--bottle-rot', rot + 'deg');

  function drift() {
    bottlePhase += 0.018;
    bx += vx + Math.sin(bottlePhase * 0.7) * 0.3;
    by += vy + Math.cos(bottlePhase * 0.9) * 0.2;
    rot = -4 + Math.sin(bottlePhase * 0.5) * 6;

    // Soft bounce off edges
    if (bx < 20)       { bx = 20;        vx = Math.abs(vx); }
    if (bx > W - 140)  { bx = W - 140;   vx = -Math.abs(vx); }
    if (by < 60)       { by = 60;        vy = Math.abs(vy); }
    if (by > H - 230)  { by = H - 230;   vy = -Math.abs(vy); }

    wrap.style.left      = bx + 'px';
    wrap.style.top       = by + 'px';
    wrap.style.position  = 'absolute';
    wrap.style.transform = `rotate(${rot}deg)`;
    wrap.style.setProperty('--bottle-rot', rot + 'deg');

    bottleRaf = requestAnimationFrame(drift);
  }
  drift();
}

function stopBottleDrift() {
  if (bottleRaf) { cancelAnimationFrame(bottleRaf); bottleRaf = null; }
}

function positionBottleCenter() {
  const wrap = document.getElementById('bottle-svg-wrap');
  if (!wrap) return;
  wrap.style.position  = 'absolute';
  wrap.style.left      = `calc(50% - 55px)`;
  wrap.style.top       = `calc(50% - 95px)`;
  wrap.style.transform = 'rotate(-4deg)';
}

// ── CORK POP EFFECT ─────────────────────────────────────────
function popCork(bottleWrap) {
  const corkEl = document.getElementById('btl-cork');
  if (!corkEl) return;

  const rect = bottleWrap.getBoundingClientRect();
  const cx   = rect.left + rect.width  * 0.5;
  const cy   = rect.top  + 0.1 * rect.height;

  // Hide cork inside SVG
  corkEl.style.opacity = '0';
  corkEl.style.transition = 'opacity 0.1s';

  // Flying cork DOM element
  const cork = document.createElement('div');
  cork.className = 'bottle-cork-pop';
  cork.innerHTML = makeSmallCorkSVG();
  cork.style.cssText = `
    left: ${cx - 14}px; top: ${cy - 9}px;
    --cx: ${(Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 40)}px;
    --cy: ${-60 - Math.random() * 50}px;
    --arc-dur: 0.85s;
  `;
  document.body.appendChild(cork);
  cork.addEventListener('animationend', () => cork.remove(), { once: true });

  // Sparkle burst at cork position
  const colors = ['#fff0a8','#ffd6e0','#d4c1ff','#b8f0dd','#ffb59c'];
  for (let i = 0; i < 14; i++) {
    const sp = document.createElement('div');
    sp.className = 'bottle-sparkle';
    const angle = (i / 14) * Math.PI * 2;
    const dist  = 16 + Math.random() * 28;
    sp.style.cssText = `
      left: ${cx + Math.cos(angle) * 8}px;
      top:  ${cy + Math.sin(angle) * 8}px;
      background: ${colors[i % colors.length]};
      --dx: ${Math.cos(angle) * dist}px;
      --dy: ${Math.sin(angle) * dist - 10}px;
      --dur: ${0.4 + Math.random() * 0.35}s;
    `;
    document.body.appendChild(sp);
    sp.addEventListener('animationend', () => sp.remove(), { once: true });
  }

  playCorkPop();
}

function makeSmallCorkSVG() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 18" width="28" height="18">
    <rect x="1" y="1" width="26" height="16" rx="4" fill="#c08040" stroke="#4a2c5a" stroke-width="1.5"/>
    <line x1="8" y1="4" x2="8" y2="13" stroke="#8a5820" stroke-width="1" opacity="0.4"/>
    <line x1="14" y1="4" x2="14" y2="13" stroke="#8a5820" stroke-width="1" opacity="0.4"/>
    <line x1="20" y1="4" x2="20" y2="13" stroke="#8a5820" stroke-width="1" opacity="0.4"/>
  </svg>`;
}

// ── TYPING ENGINE ───────────────────────────────────────────
let typingRaf     = null;
let typingDone    = false;
let skipRequested = false;

function startTyping(onFinish) {
  const textEl   = document.getElementById('bottle-letter-text');
  const cursorEl = document.getElementById('bottle-cursor');
  const skipBtn  = document.getElementById('bottle-skip');
  if (!textEl) return;

  // Build the full text with paragraph breaks
  const fullText = LETTER_PARAGRAPHS.join('\n\n');
  let charIndex  = 0;
  let lastTickAt = 0;
  let tickInterval = prefersReducedMotion ? 0 : 28; // ms per char

  skipBtn && skipBtn.classList.remove('hidden');
  skipBtn && skipBtn.addEventListener('click', () => {
    skipRequested = true;
    tickInterval  = 0;
  }, { once: true });

  // One-tap speed-up
  const card = document.getElementById('bottle-letter-text');
  card && card.addEventListener('click', () => {
    if (!typingDone) tickInterval = Math.max(0, tickInterval - 18);
  }, { once: true });

  function step(ts) {
    if (skipRequested || prefersReducedMotion) {
      textEl.textContent = fullText;
      finishTyping(onFinish, cursorEl, skipBtn);
      return;
    }
    if (charIndex < fullText.length) {
      if (ts - lastTickAt >= tickInterval) {
        textEl.textContent = fullText.slice(0, ++charIndex);
        // Pen tick sound on letters (not spaces/newlines)
        const ch = fullText[charIndex - 1];
        if (ch !== ' ' && ch !== '\n' && charIndex % 3 === 0) playPenTick();
        lastTickAt = ts;

        // Auto-scroll inside card
        const scroll = document.getElementById('bottle-letter-scroll');
        if (scroll) scroll.scrollTop = scroll.scrollHeight;
      }
      typingRaf = requestAnimationFrame(step);
    } else {
      finishTyping(onFinish, cursorEl, skipBtn);
    }
  }
  typingRaf = requestAnimationFrame(step);
}

function finishTyping(onFinish, cursorEl, skipBtn) {
  typingDone = true;
  if (cursorEl) cursorEl.classList.add('hidden');
  if (skipBtn)  skipBtn.classList.add('hidden');
  playFinalChime();
  onFinish && onFinish();
}

function stopTyping() {
  if (typingRaf) { cancelAnimationFrame(typingRaf); typingRaf = null; }
  typingDone    = false;
  skipRequested = false;
}

// ── RISING HEARTS ────────────────────────────────────────────
function riseHearts() {
  if (prefersReducedMotion) return;
  const W = window.innerWidth, H = window.innerHeight;
  const emojis = ['❤️','🩷','💜','🌸','✨'];
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'bottle-love-heart';
      el.textContent = emojis[i % emojis.length];
      el.style.cssText = `
        font-size: ${0.8 + Math.random() * 0.9}rem;
        left: ${10 + Math.random() * 80}vw;
        top: ${H * 0.75}px;
        --dx: ${(Math.random() - 0.5) * 80}px;
        --rot: ${(Math.random() - 0.5) * 30}deg;
        --spin: ${(Math.random() - 0.5) * 60}deg;
        --dur: ${2 + Math.random() * 1.5}s;
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove(), { once: true });
    }, i * 80);
  }
}

// ── OPEN / CLOSE OVERLAY ─────────────────────────────────────
let scrollY = 0;
let overlayOpen = false;

function openBottle() {
  // Build DOM once
  buildBottleOverlay();

  const overlay = document.getElementById('bottle-overlay');

  // Lock body scroll
  scrollY = window.scrollY;
  document.body.style.overflow   = 'hidden';
  document.body.style.position   = 'fixed';
  document.body.style.top        = `-${scrollY}px`;
  document.body.style.width      = '100%';

  // Fade in
  overlay.classList.add('open');
  overlayOpen = true;

  // Sky + drift
  initSkyScene();
  startBottleDrift();

  // Mute button
  const muteBtn = document.getElementById('bottle-mute');
  muteBtn && muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇 Muted' : '🔊 Sound';
  });

  // Close button
  document.getElementById('bottle-close')?.addEventListener('click', closeBottle);

  // Bottle tap
  const bottleWrap = document.getElementById('bottle-svg-wrap');
  bottleWrap && bottleWrap.addEventListener('click', onBottleTap, { once: true });
  bottleWrap && bottleWrap.addEventListener('touchend', onBottleTap, { once: true });
  bottleWrap && bottleWrap.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && !overlayOpen) return;
    if (e.key === 'Enter' || e.key === ' ') onBottleTap(e);
  }, { once: true });

  // Click outside overlay to close (only on the sky canvas)
  const skyCanvas = document.getElementById('bottle-sky');
  skyCanvas && skyCanvas.addEventListener('click', closeBottle);

  // Escape key
  document.addEventListener('keydown', handleEscape);

  // Focus trap
  setTimeout(() => document.getElementById('bottle-close')?.focus(), 200);
}

function onBottleTap(e) {
  e.preventDefault && e.preventDefault();
  const bottleWrap = document.getElementById('bottle-svg-wrap');
  if (!bottleWrap) return;

  // Wobble
  if (!prefersReducedMotion) {
    bottleWrap.classList.remove('wobble');
    void bottleWrap.offsetWidth;
    bottleWrap.classList.add('wobble');
  }

  // Stop sky click from closing
  const skyCanvas = document.getElementById('bottle-sky');
  skyCanvas && skyCanvas.removeEventListener('click', closeBottle);

  // Short delay then pop
  setTimeout(() => {
    popCork(bottleWrap);
    stopBottleDrift();

    // Animate bottle to center
    if (!prefersReducedMotion) {
      bottleWrap.style.transition = 'left 0.6s cubic-bezier(.175,.885,.32,1.275), top 0.6s cubic-bezier(.175,.885,.32,1.275), transform 0.6s ease';
    }
    bottleWrap.style.left      = `calc(50% - 55px)`;
    bottleWrap.style.top       = `calc(50% - 95px)`;
    bottleWrap.style.transform = 'rotate(0deg)';

    // Hide the inside letter SVG element
    const letterInside = document.getElementById('btl-letter-inside');
    if (letterInside) letterInside.style.opacity = '0';

    // After centering, fade in the letter
    setTimeout(() => {
      const bottleSvgWrap = document.getElementById('bottle-svg-wrap');
      const hint = document.getElementById('bottle-hint');
      if (hint) hint.style.display = 'none';

      // Fade out the bottle
      if (bottleSvgWrap && !prefersReducedMotion) {
        bottleSvgWrap.style.transition = 'opacity 0.5s ease';
        bottleSvgWrap.style.opacity = '0';
      } else if (bottleSvgWrap) {
        bottleSvgWrap.style.opacity = '0';
      }
      bottleSvgWrap && setTimeout(() => { bottleSvgWrap.style.display = 'none'; }, 500);

      // Show letter card
      const letterWrap = document.getElementById('bottle-letter-wrap');
      if (letterWrap) {
        letterWrap.classList.add('visible');
        letterWrap.focus();
      }

      // Start typing
      startTyping(() => {
        // On finish: rise hearts and show action buttons
        riseHearts();

        setTimeout(() => {
          const finishBtns = document.getElementById('bottle-finish-btns');
          if (finishBtns) finishBtns.classList.add('show');

          // Read again
          document.getElementById('bottle-read-again')?.addEventListener('click', () => {
            restartLetter();
          });

          // Close
          document.getElementById('bottle-close-letter')?.addEventListener('click', closeBottle);
        }, 600);
      });

    }, prefersReducedMotion ? 0 : 700);
  }, prefersReducedMotion ? 0 : 350);
}

function restartLetter() {
  stopTyping();
  const textEl   = document.getElementById('bottle-letter-text');
  const cursorEl = document.getElementById('bottle-cursor');
  const btns     = document.getElementById('bottle-finish-btns');
  if (textEl)   textEl.textContent = '';
  if (cursorEl) cursorEl.classList.remove('hidden');
  if (btns)     btns.classList.remove('show');
  const scroll = document.getElementById('bottle-letter-scroll');
  if (scroll) scroll.scrollTop = 0;

  startTyping(() => {
    riseHearts();
    setTimeout(() => {
      if (btns) btns.classList.add('show');
    }, 600);
  });
}

function closeBottle() {
  const overlay = document.getElementById('bottle-overlay');
  if (!overlay) return;

  stopSkyScene();
  stopTyping();
  overlayOpen = false;

  overlay.classList.remove('open');
  document.removeEventListener('keydown', handleEscape);

  // Restore body scroll
  document.body.style.overflow   = '';
  document.body.style.position   = '';
  document.body.style.top        = '';
  document.body.style.width      = '';
  window.scrollTo(0, scrollY);

  // Clean up overlay after fade
  setTimeout(() => {
    if (overlay) overlay.remove();
  }, 700);
}

function handleEscape(e) {
  if (e.key === 'Escape') closeBottle();
}

// ── INIT: add trigger buttons ───────────────────────────────
function initBottle() {
  // Add Caveat / Patrick Hand font
  if (!document.getElementById('bottle-font-link')) {
    const link = document.createElement('link');
    link.id   = 'bottle-font-link';
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Patrick+Hand&display=swap';
    document.head.appendChild(link);
  }

  // Button in hero (beside gravity button)
  const gravityBtn = document.getElementById('gravity-btn');
  if (gravityBtn) {
    const heroBtn = document.createElement('button');
    heroBtn.className = 'pill-btn bottle-btn';
    heroBtn.style.cssText = 'margin-left: 0.75rem; background: var(--plum); color: var(--white); border-color: var(--plum); box-shadow: 4px 4px 0 var(--lilac);';
    heroBtn.textContent = 'Open the bottle 🍾';
    heroBtn.setAttribute('aria-label', 'Open the love letter in a bottle');
    heroBtn.addEventListener('click', openBottle);
    gravityBtn.insertAdjacentElement('afterend', heroBtn);
  }
}

// Boot when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBottle);
} else {
  initBottle();
}
