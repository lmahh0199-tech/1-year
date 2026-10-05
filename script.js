// ============================================================
//  Anniversary Website — script.js
//  All memories are in the MEMORIES array below.
//  Edit freely!
// ============================================================

// ── MEMORIES ──────────────────────────────────────────────
// Fields: emoji | when | title | text
const MEMORIES = [
  {
    emoji: "☕",
    when:  "Day 1 — October 2025",
    title: "The First Coffee",
    text:  "Nervous hands, a too-hot latte, and somehow we talked for three hours. I didn't want to leave."
  },
  {
    emoji: "🎬",
    when:  "October 2025",
    title: "Our First Movie Night",
    text:  "You picked something scary so you could hide behind a blanket. I pretended not to notice. Best plan ever."
  },
  {
    emoji: "🌧️",
    when:  "November 2025",
    title: "Caught in the Rain",
    text:  "We ran for cover and ended up laughing in a doorway for twenty minutes. Perfect, honestly."
  },
  {
    emoji: "🎄",
    when:  "December 2025",
    title: "Our First Christmas",
    text:  "Fairy lights everywhere, your favourite hot chocolate, and you wrapping me in the same blanket as you. That's when I knew."
  },
  {
    emoji: "🌅",
    when:  "Early 2026",
    title: "That Sunrise We Caught",
    text:  "We stayed up way too late, stepped outside at 5 a.m., and neither of us said a word. It was enough."
  },
  {
    emoji: "💌",
    when:  "Today — October 2026",
    title: "365 Days Later",
    text:  "A whole year of you. A year of laughing too loud, sharing every meal, and finding a home in a person. I'd pick you again in every timeline. Happy anniversary, love."
  }
];

// ── HIDDEN SURPRISE CONTENT ───────────────────────────────
// Change the title and message to whatever you'd like to reveal!
const SURPRISE = {
  title: "🎁 One more thing...",
  message: "I've booked us a table at your favourite restaurant this Saturday. Just us, fairy lights, and way too much dessert. You deserve the world — this is just the beginning. 💕"
};

// ── SQUEAK MESSAGES ───────────────────────────────────────
const SQUEAKS = ["hehe", "love you!", "boop!", "you're stuck with me", "hi hi hi", "🌸", "eep!", "softest", "squish~"];

// ── FLOAT EMOJIS ──────────────────────────────────────────
const FLOAT_EMOJIS = ["💖", "🌸", "✨", "🫧", "🧸", "💌", "🌷", "💗"];

// ── CONFETTI EMOJIS ───────────────────────────────────────
const CONFETTI = ["💖", "🌸", "✨", "💜", "🩷", "⭐", "💛"];

// ── SVG BLOB BUILDER ──────────────────────────────────────
// Returns an SVG string for a blob character.
// type: 'peach' | 'lilac'
// hugging: if true, arms are extended toward center
function makeBlobSVG(type, { size = 100, hugging = false, holdingHand = false } = {}) {
  const isPeach = type === "peach";
  const bodyColor = isPeach ? "#ffb59c" : "#d4c1ff";
  const cheekColor = isPeach ? "#ff9999" : "#c084fc";
  const id = `blob-${type}-${Math.random().toString(36).slice(2,7)}`;

  // arm paths differ slightly for hugging vs normal
  const leftArm  = hugging
    ? `M30,62 Q10,50 5,38`
    : holdingHand
    ? `M30,62 Q14,58 8,52`
    : `M32,65 Q18,60 14,50`;
  const rightArm = hugging
    ? `M70,62 Q90,50 95,38`
    : holdingHand
    ? `M70,62 Q86,58 92,52`
    : `M68,65 Q82,60 86,50`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 110" width="${size}" height="${size * 1.1}" role="img" aria-hidden="true">
  <defs>
    <clipPath id="${id}-clip">
      <ellipse cx="50" cy="54" rx="38" ry="36"/>
    </clipPath>
  </defs>
  <!-- shadow -->
  <ellipse cx="51" cy="96" rx="26" ry="6" fill="#4a2c5a" opacity="0.12"/>
  <!-- body -->
  <ellipse cx="50" cy="54" rx="38" ry="36" fill="${bodyColor}" stroke="#4a2c5a" stroke-width="2.2"/>
  <!-- left arm -->
  <path d="${leftArm}" fill="none" stroke="${bodyColor}" stroke-width="10" stroke-linecap="round"/>
  <path d="${leftArm}" fill="none" stroke="#4a2c5a" stroke-width="2.2" stroke-linecap="round"/>
  <!-- right arm -->
  <path d="${rightArm}" fill="none" stroke="${bodyColor}" stroke-width="10" stroke-linecap="round"/>
  <path d="${rightArm}" fill="none" stroke="#4a2c5a" stroke-width="2.2" stroke-linecap="round"/>
  <!-- eyes (two circles, will be animated via JS) -->
  <g class="blob-eyes">
    <ellipse class="eye-left"  cx="40" cy="50" rx="3.5" ry="4" fill="#4a2c5a"/>
    <ellipse class="eye-right" cx="60" cy="50" rx="3.5" ry="4" fill="#4a2c5a"/>
  </g>
  <!-- cheeks -->
  <ellipse cx="33" cy="56" rx="6" ry="4" fill="${cheekColor}" opacity="0.55"/>
  <ellipse cx="67" cy="56" rx="6" ry="4" fill="${cheekColor}" opacity="0.55"/>
  <!-- smile -->
  <path d="M42,61 Q50,68 58,61" fill="none" stroke="#4a2c5a" stroke-width="2" stroke-linecap="round"/>
</svg>`;
}

// ── DOM REFS ──────────────────────────────────────────────
const gravityBtn      = document.getElementById('gravity-btn');
const heroHeadline    = document.getElementById('hero-headline');
const heroBlobPeach   = document.getElementById('hero-blob-peach');
const heroBlobLilac   = document.getElementById('hero-blob-lilac');
const cardsContainer  = document.getElementById('cards-list');
const surpriseBtn     = document.getElementById('surprise-btn');
const surpriseReveal  = document.getElementById('surprise-reveal');
const surpriseTitle   = document.getElementById('surprise-title');
const surpriseMsg     = document.getElementById('surprise-msg');
const finaleHugStage  = document.getElementById('finale-hug');

// ── INJECT SVGs ───────────────────────────────────────────
function injectBlobs() {
  // Hero — side-by-side holding hands
  if (heroBlobPeach) heroBlobPeach.innerHTML = makeBlobSVG('peach', { size: 90, holdingHand: true });
  if (heroBlobLilac) heroBlobLilac.innerHTML = makeBlobSVG('lilac', { size: 90, holdingHand: true });
  // Finale — hugging
  if (finaleHugStage) {
    finaleHugStage.innerHTML =
      `<div class="blob-wrap bob" style="margin-right:-18px;z-index:2">
        ${makeBlobSVG('peach', { size: 86, hugging: true })}
      </div>
      <div class="blob-wrap bob-slow" style="margin-left:-18px">
        ${makeBlobSVG('lilac', { size: 86, hugging: true })}
      </div>`;
  }
}

// ── BLINKING ──────────────────────────────────────────────
function startBlinks() {
  document.querySelectorAll('.blob-wrap').forEach(wrap => {
    const eyes = wrap.querySelectorAll('.eye-left, .eye-right');
    function blink() {
      eyes.forEach(e => {
        e.setAttribute('ry', '0.8');
        e.style.transition = 'none';
      });
      setTimeout(() => {
        eyes.forEach(e => e.setAttribute('ry', '4'));
      }, 120);
      setTimeout(blink, 2500 + Math.random() * 2000);
    }
    setTimeout(blink, 800 + Math.random() * 1500);
  });
}

// ── SQUEAK ON TAP ─────────────────────────────────────────
function attachSqueak(wrapEl, bubbleEl) {
  if (!wrapEl || !bubbleEl) return;
  let squeakTimer;
  function doSqueak(e) {
    e.stopPropagation();
    wrapEl.classList.remove('wiggle');
    void wrapEl.offsetWidth; // reflow
    wrapEl.classList.add('wiggle');
    bubbleEl.textContent = SQUEAKS[Math.floor(Math.random() * SQUEAKS.length)];
    bubbleEl.classList.add('show');
    clearTimeout(squeakTimer);
    squeakTimer = setTimeout(() => bubbleEl.classList.remove('show'), 1800);
    wrapEl.addEventListener('animationend', () => wrapEl.classList.remove('wiggle'), { once: true });
  }
  wrapEl.addEventListener('click', doSqueak);
  wrapEl.addEventListener('touchstart', doSqueak, { passive: true });
  wrapEl.setAttribute('tabindex', '0');
  wrapEl.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') doSqueak(e); });
}

// ── SPLIT HEADLINE INTO LETTERS ───────────────────────────
function splitHeadline() {
  if (!heroHeadline) return;
  const text = heroHeadline.textContent;
  heroHeadline.textContent = '';
  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'letter';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.setProperty('--delay', `${i * 0.06}s`);
    span.style.setProperty('--dur',   `${2.2 + Math.random() * 0.8}s`);
    span.style.setProperty('--rot',   `${(Math.random() - 0.5) * 10}deg`);
    heroHeadline.appendChild(span);
  });
}

// ── GRAVITY BUTTON ────────────────────────────────────────
let gravityOff = false;
if (gravityBtn) {
  gravityBtn.addEventListener('click', () => {
    if (gravityOff) {
      document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
      return;
    }
    gravityOff = true;
    gravityBtn.textContent = 'Keep scrolling ↓';

    // floating letters
    heroHeadline.classList.add('floating');

    // blobs rise + spin
    [heroBlobPeach, heroBlobLilac].forEach(w => {
      if (!w) return;
      const wrap = w.closest('.blob-wrap');
      if (wrap) {
        wrap.classList.remove('bob', 'bob-slow');
        wrap.classList.add('gravity-off');
      }
    });

    // confetti burst
    burstConfetti();
  });
}

// ── CONFETTI BURST ────────────────────────────────────────
function burstConfetti(originX, originY) {
  const cx = originX ?? window.innerWidth  / 2;
  const cy = originY ?? window.innerHeight / 2;
  const count = 32;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span');
    el.className = 'confetti-heart';
    el.textContent = CONFETTI[i % CONFETTI.length];
    const angle = (i / count) * Math.PI * 2;
    const spread = 60 + Math.random() * 80;
    const sx = Math.cos(angle) * spread * 0.4;
    const sy = Math.sin(angle) * spread * 0.4;
    const mx = Math.cos(angle) * spread;
    const ex = Math.cos(angle) * spread * 1.6;
    const ey = -140 - Math.random() * 100;
    el.style.cssText = `
      left: ${cx}px; top: ${cy}px;
      --sx: ${sx}px; --sy: ${sy}px;
      --mx: ${mx}px; --my: ${-80 - Math.random()*60}px;
      --ex: ${ex}px; --ey: ${ey}px;
      --spin: ${(Math.random()-0.5)*720}deg;
      --dur: ${1.8 + Math.random()*1.2}s;
    `;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }
}

// ── PHOTO PUZZLE CONFIG ────────────────────────────────────
const photoPuzzleConfig = {
  leftImage: "images/puzzle-left.jpg",
  rightImage: "images/puzzle-right.jpg",
  snapThreshold: 15,
  initialGap: 60
};

// ── BUILD PHOTO PUZZLE (Replaces Memory Cards) ─────────────
function buildCards() {
  if (!cardsContainer) return;
  cardsContainer.innerHTML = `
    <div class="photo-puzzle-container">
      <div class="puzzle-track" id="puzzle-track" style="gap: ${photoPuzzleConfig.initialGap}px">
        <img src="${photoPuzzleConfig.leftImage}" class="puzzle-piece left-piece" id="puzzle-left" draggable="false" alt="Left photo half">
        <img src="${photoPuzzleConfig.rightImage}" class="puzzle-piece right-piece" id="puzzle-right" draggable="false" alt="Right photo half">
      </div>
      <div class="puzzle-status" id="puzzle-status" aria-live="polite">Pull us closer.</div>
      <button class="puzzle-reset hidden" id="puzzle-reset" aria-label="Reset">reset</button>
    </div>
  `;

  const track = document.getElementById('puzzle-track');
  const leftEl = document.getElementById('puzzle-left');
  const rightEl = document.getElementById('puzzle-right');
  const statusEl = document.getElementById('puzzle-status');
  const resetBtn = document.getElementById('puzzle-reset');

  let dxL = 0;
  let dxR = 0;
  let isDragging = false;
  let startX = 0;
  let initialDx = 0;
  let activePiece = null;
  let isSnapped = false;

  function updateTransforms() {
    if (isSnapped) {
      leftEl.style.transform = `translateX(${photoPuzzleConfig.initialGap / 2}px)`;
      rightEl.style.transform = `translateX(${-photoPuzzleConfig.initialGap / 2}px)`;
    } else {
      leftEl.style.transform = `translateX(${dxL}px)`;
      rightEl.style.transform = `translateX(${-dxR}px)`;
    }
  }

  function handlePointerDown(e) {
    if (isSnapped) return;
    isDragging = true;
    startX = e.clientX;
    if (e.target === leftEl) {
      activePiece = 'left';
      initialDx = dxL;
    } else {
      activePiece = 'right';
      initialDx = dxR;
    }
    e.target.setPointerCapture(e.pointerId);
    e.target.classList.add('dragging');
  }

  function handlePointerMove(e) {
    if (!isDragging || isSnapped) return;
    const deltaX = e.clientX - startX;
    const gap = photoPuzzleConfig.initialGap;

    if (activePiece === 'left') {
      dxL = Math.max(0, Math.min(gap - dxR, initialDx + deltaX));
    } else {
      dxR = Math.max(0, Math.min(gap - dxL, initialDx - deltaX));
    }

    updateTransforms();

    const currentGap = gap - (dxL + dxR);
    if (currentGap <= photoPuzzleConfig.snapThreshold) {
      snapPuzzle();
    }
  }

  function handlePointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    e.target.releasePointerCapture(e.pointerId);
    e.target.classList.remove('dragging');
  }

  leftEl.addEventListener('pointerdown', handlePointerDown);
  rightEl.addEventListener('pointerdown', handlePointerDown);
  leftEl.addEventListener('pointermove', handlePointerMove);
  rightEl.addEventListener('pointermove', handlePointerMove);
  leftEl.addEventListener('pointerup', handlePointerUp);
  rightEl.addEventListener('pointerup', handlePointerUp);
  leftEl.addEventListener('pointercancel', handlePointerUp);
  rightEl.addEventListener('pointercancel', handlePointerUp);

  let seqTimers = [];

  function snapPuzzle() {
    isSnapped = true;
    isDragging = false;
    leftEl.classList.remove('dragging');
    rightEl.classList.remove('dragging');

    track.classList.add('snapped');
    leftEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    rightEl.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    updateTransforms();

    statusEl.style.opacity = 0;
    setTimeout(() => {
      statusEl.textContent = "There we are.";
      statusEl.style.opacity = 1;
    }, 300);

    seqTimers.push(setTimeout(() => {
      statusEl.style.opacity = 0;
      setTimeout(() => {
        statusEl.textContent = "Just like us. ❤️";
        statusEl.style.opacity = 1;
        resetBtn.classList.remove('hidden');
      }, 300);
    }, 2000));
  }

  resetBtn.addEventListener('click', () => {
    isSnapped = false;
    dxL = 0;
    dxR = 0;
    seqTimers.forEach(clearTimeout);
    seqTimers = [];

    track.classList.remove('snapped');
    leftEl.style.transition = 'transform 0.5s ease-out';
    rightEl.style.transition = 'transform 0.5s ease-out';
    updateTransforms();

    resetBtn.classList.add('hidden');
    statusEl.style.opacity = 0;
    setTimeout(() => {
      statusEl.textContent = "Pull us closer.";
      statusEl.style.opacity = 1;
      leftEl.style.transition = 'none';
      rightEl.style.transition = 'none';
    }, 500);
  });
}

// Intercept observeCards so it does nothing (since we replaced cards with puzzle)
function observeCards() {}

// ── FLOATING EMOJI ON ANY TAP/CLICK ──────────────────────
function spawnFloatEmoji(emoji, x, y) {
  const el = document.createElement('span');
  el.className = 'float-emoji';
  el.textContent = emoji ?? FLOAT_EMOJIS[Math.floor(Math.random() * FLOAT_EMOJIS.length)];
  const dx = (Math.random() - 0.5) * 80;
  const spin = (Math.random() - 0.5) * 120;
  const dur  = 1.8 + Math.random() * 0.8;
  el.style.cssText = `left:${x}px; top:${y}px; --dx:${dx}px; --spin:${spin}deg; --dur:${dur}s;`;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

let lastSparkleTime = 0;
function spawnSparkle(x, y) {
  const now = performance.now();
  if (now - lastSparkleTime < 45) return;
  lastSparkleTime = now;
  const el = document.createElement('div');
  el.className = 'sparkle';
  const hue = Math.floor(Math.random() * 360);
  const colors = ['#fff0a8','#ffd6e0','#d4c1ff','#b8f0dd','#ffb59c'];
  el.style.cssText = `
    left:${x}px; top:${y}px;
    background:${colors[Math.floor(Math.random()*colors.length)]};
    --sdx:${(Math.random()-0.5)*20}px;
    --sdy:${-8 - Math.random()*12}px;
  `;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
}

function handlePointerFloat(e) {
  const target = e.target;
  // don't spawn on button clicks
  if (target.closest('button, .pill-btn, .surprise-trigger, .blob-wrap, .memory-card')) return;
  const x = e.clientX ?? (e.touches && e.touches[0]?.clientX);
  const y = e.clientY ?? (e.touches && e.touches[0]?.clientY);
  if (x == null) return;
  spawnFloatEmoji(null, x, y);
}

document.addEventListener('click',     handlePointerFloat);
document.addEventListener('touchstart', e => {
  const target = e.target;
  if (target.closest('button, .pill-btn, .surprise-trigger, .blob-wrap, .memory-card')) return;
  if (e.touches.length > 0) {
    const t = e.touches[0];
    spawnFloatEmoji(null, t.clientX, t.clientY);
  }
}, { passive: true });

document.addEventListener('pointermove', e => {
  spawnSparkle(e.clientX, e.clientY);
});
document.addEventListener('touchmove', e => {
  if (e.touches.length > 0) {
    const t = e.touches[0];
    spawnSparkle(t.clientX, t.clientY);
  }
}, { passive: true });

// ── BACKGROUND BUBBLES ────────────────────────────────────
function makeBgBubbles() {
  const wrap = document.querySelector('.bg-bubbles');
  if (!wrap) return;
  const colors = ['#ffd6e0','#d4c1ff','#b8f0dd','#fff0a8','#ffb59c'];
  for (let i = 0; i < 18; i++) {
    const b = document.createElement('div');
    b.className = 'bubble';
    const size = 40 + Math.random() * 120;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dur = 8 + Math.random() * 12;
    const delay = Math.random() * -20;
    b.style.cssText = `
      width:${size}px; height:${size}px;
      background:${color};
      left:${x}%; top:${y}%;
      animation: bubble-drift ${dur}s ${delay}s ease-in-out infinite alternate;
    `;
    wrap.appendChild(b);
  }
  // inject keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes bubble-drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(${Math.random()>0.5?'':'-'}${10+Math.floor(Math.random()*25)}px, ${-10-Math.floor(Math.random()*30)}px) scale(${0.85+Math.random()*0.3}); }
  }`;
  document.head.appendChild(style);
}

// ── SURPRISE BUTTON ───────────────────────────────────────
if (surpriseBtn) {
  surpriseTitle.textContent = SURPRISE.title;
  surpriseMsg.textContent   = SURPRISE.message;
  let surpriseOpened = false;
  surpriseBtn.addEventListener('click', () => {
    if (!surpriseOpened) {
      surpriseReveal.classList.add('open');
      surpriseOpened = true;
      surpriseBtn.setAttribute('aria-expanded', 'true');
      surpriseBtn.style.display = 'none';
      // big confetti!
      const rect = surpriseBtn.getBoundingClientRect();
      burstConfetti(rect.left + rect.width/2, rect.top + rect.height/2);
      setTimeout(() => burstConfetti(window.innerWidth/2, window.innerHeight/2), 400);
    }
  });
}

// ── BBG EASTER EGG ────────────────────────────────────────
// Type "bbg" anywhere on the keyboard to trigger it.
(function bbgEasterEgg() {
  const TARGET = 'bbg';
  let buffer = '';
  let onCooldown = false;

  document.addEventListener('keydown', e => {
    // ignore if typing in an input/textarea
    if (e.target.matches('input, textarea, [contenteditable]')) return;
    // only plain letter keys
    if (e.key.length !== 1) return;

    buffer = (buffer + e.key.toLowerCase()).slice(-TARGET.length);
    if (buffer === TARGET && !onCooldown) {
      onCooldown = true;
      triggerBBG();
      setTimeout(() => { onCooldown = false; }, 4000);
    }
  });

  function triggerBBG() {
    // 1. Backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position:fixed; inset:0; z-index:99990;
      background:rgba(74,44,90,0.45);
      display:flex; align-items:center; justify-content:center;
      animation: bbg-backdrop-in 0.35s ease forwards;
    `;

    // 2. Card
    const card = document.createElement('div');
    card.style.cssText = `
      background:#fff8f0;
      border:3.5px solid #4a2c5a;
      border-radius:28px;
      padding:2rem 2.5rem 1.8rem;
      text-align:center;
      box-shadow:6px 6px 0 #d4c1ff;
      max-width:min(88vw, 320px);
      animation: bbg-card-in 0.45s cubic-bezier(.175,.885,.32,1.275) forwards;
    `;

    // 3. Content
    card.innerHTML = `
      <div style="font-size:3.4rem;line-height:1;margin-bottom:0.3rem;animation:bbg-pulse 0.7s ease infinite alternate;">🥺</div>
      <div style="
        font-family:'Baloo 2',cursive;
        font-weight:800;
        font-size:clamp(1.9rem,8vw,2.6rem);
        color:#4a2c5a;
        line-height:1.1;
        margin-bottom:0.5rem;
      ">my bbg</div>
      <div style="
        font-family:'Nunito',sans-serif;
        font-size:0.95rem;
        color:#7a4e8a;
        line-height:1.55;
      ">the cutest person<br>in the entire universe 💗</div>
      <div style="margin-top:1rem;font-size:1.6rem;letter-spacing:0.15em;animation:bbg-bounce-row 1s ease infinite alternate;">💖 🌸 💖</div>
    `;

    backdrop.appendChild(card);
    document.body.appendChild(backdrop);

    // 4. Inject keyframes once
    if (!document.getElementById('bbg-styles')) {
      const s = document.createElement('style');
      s.id = 'bbg-styles';
      s.textContent = `
        @keyframes bbg-backdrop-in {
          from { opacity:0 } to { opacity:1 }
        }
        @keyframes bbg-card-in {
          from { opacity:0; transform:scale(0.5) rotate(-6deg) }
          to   { opacity:1; transform:scale(1)   rotate(0deg)  }
        }
        @keyframes bbg-pulse {
          from { transform:scale(1) }
          to   { transform:scale(1.2) rotate(8deg) }
        }
        @keyframes bbg-bounce-row {
          from { transform:translateY(0) }
          to   { transform:translateY(-6px) }
        }
        @keyframes bbg-out {
          from { opacity:1; transform:scale(1) }
          to   { opacity:0; transform:scale(0.85) }
        }
        @keyframes bbg-backdrop-out {
          from { opacity:1 } to { opacity:0 }
        }
      `;
      document.head.appendChild(s);
    }

    // 5. BIG heart burst from center
    burstConfetti(window.innerWidth / 2, window.innerHeight / 2);
    setTimeout(() => {
      burstConfetti(window.innerWidth / 2, window.innerHeight * 0.45);
    }, 250);

    // 6. Wiggle both hero blobs
    document.querySelectorAll('#hero .blob-wrap').forEach((w, i) => {
      setTimeout(() => {
        w.classList.remove('wiggle');
        void w.offsetWidth;
        w.classList.add('wiggle');
        w.addEventListener('animationend', () => w.classList.remove('wiggle'), { once: true });
      }, i * 120);
    });

    // 7. Dismiss after 2.8s (or tap)
    function dismiss() {
      card.style.animation      = 'bbg-out 0.4s ease forwards';
      backdrop.style.animation  = 'bbg-backdrop-out 0.5s 0.15s ease forwards';
      setTimeout(() => backdrop.remove(), 700);
      backdrop.removeEventListener('click', dismiss);
    }
    setTimeout(dismiss, 2800);
    backdrop.addEventListener('click', dismiss);
  }
})();

// ════════════════════════════════════════════════════════════
//  KEYWORD EASTER EGGS
// ════════════════════════════════════════════════════════════

// ── shared helpers ────────────────────────────────────────
function makeOverlay(bg) {
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;inset:0;z-index:99990;background:${bg};
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity 0.4s;`;
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; });
  return el;
}
function dismissOverlay(overlay, delay) {
  function go() {
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 500);
    overlay.removeEventListener('click', go);
  }
  setTimeout(go, delay);
  overlay.addEventListener('click', go);
}
function allBlobWraps() { return [...document.querySelectorAll('.blob-wrap')]; }
function wiggleAll() {
  allBlobWraps().forEach((w, i) => {
    setTimeout(() => {
      w.classList.remove('wiggle'); void w.offsetWidth;
      w.classList.add('wiggle');
      w.addEventListener('animationend', () => w.classList.remove('wiggle'), { once: true });
    }, i * 80);
  });
}
function keywordWatcher(keywords, handler) {
  const maxLen = Math.max(...keywords.map(k => k.length));
  let buf = '', cd = false;
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea,[contenteditable]')) return;
    if (e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-maxLen);
    const hit = keywords.find(k => buf.endsWith(k));
    if (hit && !cd) { cd = true; handler(hit); setTimeout(() => { cd = false; }, 4500); }
  });
}

// ── 1. "love" → Canvas Aurora ────────────────────────────
(function() {
  keywordWatcher(['love'], () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:99990;
      display:flex;align-items:center;justify-content:center;
      opacity:0;transition:opacity .6s;`;
    document.body.appendChild(overlay);

    const canvas = document.createElement('canvas');
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';
    overlay.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const waves = [
      { color:[255,214,224], speed:.40, amp:.14, freq:1.8, phase:0   },
      { color:[212,193,255], speed:.60, amp:.12, freq:2.3, phase:1.2 },
      { color:[184,240,221], speed:.50, amp:.10, freq:1.5, phase:2.5 },
      { color:[255,181,156], speed:.35, amp:.09, freq:2.8, phase:.7  },
      { color:[255,240,168], speed:.55, amp:.08, freq:3.2, phase:3.8 },
    ];
    const hearts = Array.from({length:18}, () => ({
      x:Math.random()*W, y:H+20,
      size:18+Math.random()*28, dx:(Math.random()-.5)*1.2,
      speed:.8+Math.random()*1.4,
      emoji:['💖','💗','🌸','✨','💜'][Math.floor(Math.random()*5)]
    }));

    let t = 0, raf, done = false;
    function draw() {
      if (done) return;
      const bg = ctx.createLinearGradient(0,0,0,H);
      bg.addColorStop(0,'rgba(30,10,45,.98)');
      bg.addColorStop(.5,'rgba(55,20,75,.9)');
      bg.addColorStop(1,'rgba(74,44,90,.98)');
      ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

      waves.forEach((w,wi) => {
        const baseY = H*(.18+wi*.14);
        ctx.beginPath(); ctx.moveTo(0,H);
        for (let x=0;x<=W;x+=3) {
          const y = baseY
            + Math.sin(x*w.freq*.004+t*w.speed+w.phase)*H*w.amp
            + Math.sin(x*.008+t*.3)*H*.04;
          ctx.lineTo(x,y);
        }
        ctx.lineTo(W,H); ctx.closePath();
        const [r,g,b]=w.color;
        const gr=ctx.createLinearGradient(0,baseY-H*w.amp*2,0,baseY+H*w.amp*2);
        gr.addColorStop(0,`rgba(${r},${g},${b},0)`);
        gr.addColorStop(.4,`rgba(${r},${g},${b},.55)`);
        gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
        ctx.fillStyle=gr; ctx.fill();
      });

      hearts.forEach(h => {
        h.y -= h.speed; h.x += h.dx;
        if (h.y < -40) { h.y=H+20; h.x=Math.random()*W; }
        ctx.save();
        ctx.globalAlpha = .7*Math.min(1,(H-h.y)/120);
        ctx.font = `${h.size}px serif`;
        ctx.fillText(h.emoji, h.x, h.y);
        ctx.restore();
      });

      t += .04; raf = requestAnimationFrame(draw);
    }
    draw();

    const card = document.createElement('div');
    card.style.cssText = `position:relative;z-index:2;
      background:rgba(255,248,240,.12);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);
      border:2px solid rgba(255,214,224,.5);border-radius:28px;
      padding:2rem 2.5rem;text-align:center;
      animation:bbg-card-in .5s cubic-bezier(.175,.885,.32,1.275) forwards;
      max-width:min(88vw,310px);`;
    card.innerHTML = `
      <div style="font-size:3rem;margin-bottom:.4rem;filter:drop-shadow(0 0 12px #ff9ec7);">💖</div>
      <div style="font-family:'Baloo 2',cursive;font-weight:800;font-size:clamp(1.8rem,7vw,2.4rem);
        color:#fff;text-shadow:0 0 20px rgba(255,182,193,.8);margin-bottom:.4rem;">love you</div>
      <div style="font-family:'Nunito',sans-serif;font-size:.9rem;color:rgba(255,240,255,.9);line-height:1.6;">
        so much it's a little<br>embarrassing honestly 🌸</div>`;
    overlay.appendChild(card);
    requestAnimationFrame(() => { overlay.style.opacity='1'; });
    wiggleAll();

    function dismiss() {
      done=true; cancelAnimationFrame(raf);
      overlay.style.opacity='0'; setTimeout(()=>overlay.remove(),600);
      overlay.removeEventListener('click',dismiss);
    }
    setTimeout(dismiss,4200); overlay.addEventListener('click',dismiss);
  });
})();

// ── 2. "stars" → Canvas Starfield ────────────────────────
(function() {
  keywordWatcher(['stars'], () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;z-index:99990;opacity:0;transition:opacity .5s;`;
    document.body.appendChild(overlay);

    const canvas = document.createElement('canvas');
    canvas.width=window.innerWidth; canvas.height=window.innerHeight;
    canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;';
    overlay.appendChild(canvas);
    const ctx=canvas.getContext('2d'), W=canvas.width, H=canvas.height;

    const STARS = Array.from({length:260}, ()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:.4+Math.random()*1.8, twinkle:Math.random()*Math.PI*2,
      speed:.02+Math.random()*.06,
      color:['#fff','#ffd6e0','#d4c1ff','#b8f0dd','#fff0a8'][Math.floor(Math.random()*5)]
    }));
    const SHOOTS = Array.from({length:4},()=>({active:false,x:0,y:0,len:0,angle:0,alpha:0,t:Math.random()*300}));
    let t=0, raf, done=false;

    function draw() {
      if (done) return;
      const bg=ctx.createRadialGradient(W*.5,H*.4,0,W*.5,H*.5,W*.75);
      bg.addColorStop(0,'#2a0a3a'); bg.addColorStop(.5,'#1a0528'); bg.addColorStop(1,'#0a0015');
      ctx.fillStyle=bg; ctx.fillRect(0,0,W,H);

      STARS.forEach(s => {
        s.twinkle+=s.speed;
        const a=.4+.6*Math.abs(Math.sin(s.twinkle));
        ctx.beginPath();
        ctx.arc(s.x,s.y,s.r*(.8+.4*Math.abs(Math.sin(s.twinkle))),0,Math.PI*2);
        ctx.fillStyle=s.color; ctx.globalAlpha=a; ctx.fill();
        if (s.r>1.4) {
          const glow=ctx.createRadialGradient(s.x,s.y,0,s.x,s.y,s.r*3);
          glow.addColorStop(0,'rgba(255,220,255,.3)'); glow.addColorStop(1,'rgba(255,220,255,0)');
          ctx.beginPath(); ctx.arc(s.x,s.y,s.r*3,0,Math.PI*2);
          ctx.fillStyle=glow; ctx.fill();
        }
      });
      ctx.globalAlpha=1;

      SHOOTS.forEach(sh => {
        sh.t++;
        if (!sh.active && sh.t>80+Math.random()*120) {
          sh.active=true; sh.t=0;
          sh.x=Math.random()*W*.7; sh.y=Math.random()*H*.4;
          sh.len=80+Math.random()*120; sh.angle=.4+Math.random()*.3; sh.alpha=0;
        }
        if (sh.active) {
          sh.t++;
          sh.alpha=sh.t<15?sh.t/15:Math.max(0,1-(sh.t-15)/30);
          if (sh.alpha<=0){sh.active=false;sh.t=0;return;}
          const ex=sh.x+Math.cos(sh.angle)*sh.len*Math.min(1,sh.t/20);
          const ey=sh.y+Math.sin(sh.angle)*sh.len*Math.min(1,sh.t/20);
          const gr=ctx.createLinearGradient(sh.x,sh.y,ex,ey);
          gr.addColorStop(0,`rgba(255,255,255,${sh.alpha})`);
          gr.addColorStop(.3,`rgba(212,193,255,${sh.alpha*.6})`);
          gr.addColorStop(1,'rgba(212,193,255,0)');
          ctx.beginPath(); ctx.moveTo(sh.x,sh.y); ctx.lineTo(ex,ey);
          ctx.strokeStyle=gr; ctx.lineWidth=2; ctx.stroke();
        }
      });
      ctx.globalAlpha=1;
      t++; raf=requestAnimationFrame(draw);
    }
    draw();

    const card=document.createElement('div');
    card.style.cssText=`position:absolute;z-index:2;top:50%;left:50%;
      transform:translate(-50%,-50%);text-align:center;
      animation:bbg-card-in .5s cubic-bezier(.175,.885,.32,1.275) forwards;`;
    card.innerHTML=`
      <div style="font-size:3.5rem;filter:drop-shadow(0 0 18px #d4c1ff);animation:bbg-pulse .9s ease infinite alternate;">⭐</div>
      <div style="font-family:'Baloo 2',cursive;font-weight:800;font-size:clamp(1.7rem,6vw,2.3rem);
        color:#fff;text-shadow:0 0 24px rgba(212,193,255,.9);margin:.3rem 0;">
        you're my<br>favourite star</div>
      <div style="font-family:'Nunito',sans-serif;color:rgba(212,193,255,.85);font-size:.88rem;">
        ✨ in any galaxy ✨</div>`;
    overlay.appendChild(card);
    requestAnimationFrame(()=>{ overlay.style.opacity='1'; });

    function dismiss(){done=true;cancelAnimationFrame(raf);overlay.style.opacity='0';setTimeout(()=>overlay.remove(),600);overlay.removeEventListener('click',dismiss);}
    setTimeout(dismiss,4500); overlay.addEventListener('click',dismiss);
  });
})();

// ── 3. "pretty" → Flowers All Over & Text ─────────────────────────
(function() {
  keywordWatcher(['pretty'], () => {
    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;inset:0;z-index:99990;pointer-events:all;
      background:rgba(255,248,240,0.4);
      display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .4s;`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=>{ overlay.style.opacity='1'; });

    if (!document.getElementById('petal-styles')) {
      const s=document.createElement('style'); s.id='petal-styles';
      s.textContent=`
        @keyframes flower-pop {
          0% { opacity:0; transform: scale(0.2) rotate(var(--rot-start)); }
          70% { transform: scale(1.15) rotate(var(--rot-end)); }
          100% { opacity:1; transform: scale(1) rotate(var(--rot-end)); }
        }`;
      document.head.appendChild(s);
    }

    const PETALS=['🌸','🌷','🌺','✿','🌻','🌼','🏵️','🪷','💖'];
    const count=85; // Flowers all over the screen
    Array.from({length:count},()=>{
      const el=document.createElement('span');
      el.textContent=PETALS[Math.floor(Math.random()*PETALS.length)];
      const size=16+Math.random()*38;
      el.style.cssText=`position:absolute;top:${Math.random()*100}vh;left:${Math.random()*100}vw;
        font-size:${size}px;pointer-events:none;opacity:0;
        --rot-start:${Math.random()*90}deg; --rot-end:${(Math.random()-.5)*120}deg;
        animation:flower-pop 0.5s ${Math.random()*0.6}s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        z-index: 1; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.06));`;
      overlay.appendChild(el);
    });

    const card=document.createElement('div');
    card.style.cssText=`position:relative;z-index:2;
      background:rgba(255,255,255,.92);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
      border:3.5px solid #4a2c5a;border-radius:28px;padding:2.2rem 2.5rem;text-align:center;
      box-shadow:6px 6px 0 #ffb59c;max-width:min(90vw,320px);
      animation:bbg-card-in .45s cubic-bezier(.175,.885,.32,1.275) forwards;`;
    card.innerHTML=`
      <div style="font-size:3.2rem;animation:bbg-pulse .8s ease infinite alternate;margin-bottom:0.4rem;">💐</div>
      <div style="font-family:'Baloo 2',cursive;font-weight:800;
        font-size:clamp(1.6rem,7vw,2.2rem);color:#4a2c5a;margin:.3rem 0;line-height:1.15;">my bbg is<br>the prettiest &lt;3</div>
      <div style="font-family:'Nunito',sans-serif;font-size:1rem;color:#7a4e8a;line-height:1.55;margin-top:0.6rem;">
        like. genuinely.<br>it's unfair. 🌸</div>`;
    overlay.appendChild(card);
    wiggleAll();

    function dismiss(){overlay.style.opacity='0';setTimeout(()=>overlay.remove(),500);overlay.removeEventListener('click',dismiss);}
    setTimeout(dismiss,4500); overlay.addEventListener('click',dismiss);
  });
})();

// ── 4. "hi" → Blobs Wave Back ────────────────────────────
(function() {
  keywordWatcher(['hi'], () => {
    const bubbles=[document.getElementById('bubble-peach'),document.getElementById('bubble-lilac')];
    ['hi!! 👋','hello!! 🌸'].forEach((msg,i)=>{
      if (!bubbles[i]) return;
      bubbles[i].textContent=msg;
      bubbles[i].classList.add('show');
      setTimeout(()=>bubbles[i].classList.remove('show'),2200);
    });
    wiggleAll();

    const toast=document.createElement('div');
    toast.style.cssText=`position:fixed;bottom:2rem;left:50%;
      transform:translateX(-50%) translateY(60px);z-index:99991;
      background:#4a2c5a;color:#fff8f0;
      font-family:'Baloo 2',cursive;font-weight:700;font-size:1rem;
      padding:.55em 1.5em;border-radius:999px;box-shadow:3px 3px 0 #d4c1ff;
      transition:transform .35s cubic-bezier(.175,.885,.32,1.275),opacity .3s;
      opacity:0;white-space:nowrap;`;
    toast.textContent='babyboy says hi too 👋';
    document.body.appendChild(toast);
    requestAnimationFrame(()=>{ toast.style.transform='translateX(-50%) translateY(0)'; toast.style.opacity='1'; });
    setTimeout(()=>{
      toast.style.opacity='0';
      toast.style.transform='translateX(-50%) translateY(30px)';
      setTimeout(()=>toast.remove(),400);
    },2500);
  });
})();

// ── 5. "help" → Too Late ─────────────────────────────────
(function() {
  keywordWatcher(['help'], () => {
    if (!document.getElementById('help-styles')) {
      const s=document.createElement('style'); s.id='help-styles';
      s.textContent=`@keyframes help-shake{
        0%,100%{transform:rotate(0) scale(1)}
        15%{transform:rotate(-7deg) scale(1.06)}
        30%{transform:rotate(6deg) scale(1.09)}
        45%{transform:rotate(-5deg) scale(1.05)}
        60%{transform:rotate(4deg) scale(1.03)}}`;
      document.head.appendChild(s);
    }
    const overlay=makeOverlay('rgba(74,44,90,.5)');
    const card=document.createElement('div');
    card.style.cssText=`background:#fff8f0;border:3.5px solid #4a2c5a;border-radius:28px;
      padding:2rem 2.2rem;text-align:center;box-shadow:5px 5px 0 #ffb59c;
      max-width:min(88vw,300px);
      animation:help-shake .5s cubic-bezier(.36,.07,.19,.97) .2s both;`;
    card.innerHTML=`
      <div style="font-size:3rem;animation:bbg-pulse .6s ease infinite alternate;">🥺</div>
      <div style="font-family:'Baloo 2',cursive;font-weight:800;
        font-size:clamp(1.4rem,5vw,1.9rem);color:#4a2c5a;margin:.4rem 0;">too late.</div>
      <div style="font-family:'Nunito',sans-serif;font-size:.9rem;color:#7a4e8a;line-height:1.6;">
        you're stuck with me<br>forever and ever 💜</div>
      <div style="margin-top:.9rem;font-size:1.3rem;animation:bbg-bounce-row .8s ease infinite alternate;">
        🔒 💖 🔒</div>`;
    overlay.appendChild(card);
    wiggleAll();
    dismissOverlay(overlay,3200);
  });
})();

// ── 6. "bored" → Pastel Disco Party ─────────────────────
(function() {
  keywordWatcher(['bored'], () => {
    if (!document.getElementById('party-styles')) {
      const s=document.createElement('style'); s.id='party-styles';
      s.textContent=`@keyframes party-rain{
        0%{opacity:1;transform:translate(0,0) rotate(0deg);}
        100%{opacity:0;transform:translate(var(--dx),105vh) rotate(540deg);}}`;
      document.head.appendChild(s);
    }
    const COLORS=['rgba(255,214,224,.3)','rgba(212,193,255,.3)','rgba(184,240,221,.3)','rgba(255,240,168,.3)','rgba(255,181,156,.3)'];
    const EMOJIS=['🎉','✨','💖','🌈','🎊','🦄','🌸','💜','🎶','🥳','⭐','💛'];

    const overlay=document.createElement('div');
    overlay.style.cssText=`position:fixed;inset:0;z-index:99989;pointer-events:all;transition:background .12s;`;
    document.body.appendChild(overlay);

    let ci=0;
    const cycleColor=setInterval(()=>{ overlay.style.background=COLORS[ci++%COLORS.length]; },130);

    let spawnCount=0;
    const rain=setInterval(()=>{
      if (spawnCount++>45) return;
      const el=document.createElement('span');
      el.textContent=EMOJIS[Math.floor(Math.random()*EMOJIS.length)];
      el.style.cssText=`position:fixed;top:-50px;left:${Math.random()*95}vw;
        font-size:${20+Math.random()*28}px;pointer-events:none;z-index:99990;
        animation:party-rain ${1.4+Math.random()*1.6}s ease-in forwards;
        --dx:${(Math.random()-.5)*60}px;`;
      document.body.appendChild(el);
      el.addEventListener('animationend',()=>el.remove(),{once:true});
    },80);

    const banner=document.createElement('div');
    banner.style.cssText=`position:fixed;top:50%;left:50%;z-index:99991;
      transform:translate(-50%,-50%);
      background:#fff8f0;border:3px solid #4a2c5a;border-radius:24px;
      padding:1.4rem 2rem;text-align:center;box-shadow:5px 5px 0 #d4c1ff;
      max-width:min(88vw,300px);
      animation:bbg-card-in .4s cubic-bezier(.175,.885,.32,1.275) forwards;
      pointer-events:none;`;
    banner.innerHTML=`
      <div style="font-size:2.5rem;animation:bbg-pulse .5s ease infinite alternate;">🥳</div>
      <div style="font-family:'Baloo 2',cursive;font-weight:800;
        font-size:clamp(1.5rem,5vw,2rem);color:#4a2c5a;margin:.3rem 0;">PARTY TIME!!</div>
      <div style="font-family:'Nunito',sans-serif;font-size:.88rem;color:#7a4e8a;">
        never bored when<br>you're with me 🎶</div>`;
    document.body.appendChild(banner);
    wiggleAll();
    burstConfetti(window.innerWidth/2,window.innerHeight/2);

    function end() {
      clearInterval(cycleColor); clearInterval(rain);
      overlay.style.opacity='0'; overlay.style.transition='opacity .4s';
      banner.style.opacity='0'; banner.style.transition='opacity .4s';
      setTimeout(()=>{ overlay.remove(); banner.remove(); },500);
      overlay.removeEventListener('click',end);
    }
    setTimeout(end,3400);
    overlay.addEventListener('click',end);
  });
})();

// ── HINT SYSTEM ───────────────────────────────────────────
const HINTS = [
  { key:'bbg',    icon:'🥺', desc:'for something sweet'           },
  { key:'love',   icon:'💖', desc:'for something beautiful'        },
  { key:'stars',  icon:'⭐', desc:'for a whole sky'               },
  { key:'pretty', icon:'🌸', desc:'for a petal shower'            },
  { key:'hi',     icon:'👋', desc:'to say hello'                  },
  { key:'help',   icon:'🔒', desc:'to find out why that\'s funny' },
  { key:'bored',  icon:'🎉', desc:'and watch what happens'        },
];

function buildHintUI() {
  // floating trigger button
  const btn = document.createElement('button');
  btn.innerHTML = '✨ psst...';
  btn.setAttribute('aria-label','Show secret hints');
  btn.style.cssText = `
    position:fixed;bottom:1.4rem;left:1.2rem;z-index:8888;
    font-family:'Baloo 2',cursive;font-weight:700;font-size:.82rem;
    color:#4a2c5a;background:#fff8f0;
    border:2px solid #4a2c5a;border-radius:999px;
    padding:.38em 1em;cursor:pointer;
    box-shadow:3px 3px 0 #d4c1ff;
    opacity:.75;transition:opacity .2s,transform .08s,box-shadow .08s;
    -webkit-tap-highlight-color:transparent;
  `;
  btn.addEventListener('mouseenter', ()=>btn.style.opacity='1');
  btn.addEventListener('mouseleave', ()=>{ if (!panelOpen) btn.style.opacity='.75'; });
  btn.addEventListener('mousedown',  ()=>{ btn.style.transform='translate(2px,2px)';btn.style.boxShadow='1px 1px 0 #d4c1ff'; });
  btn.addEventListener('mouseup',    ()=>{ btn.style.transform='';btn.style.boxShadow='3px 3px 0 #d4c1ff'; });
  document.body.appendChild(btn);

  // hint panel
  const panel = document.createElement('div');
  panel.setAttribute('aria-label','Secret hints');
  panel.style.cssText = `
    position:fixed;bottom:4rem;left:1.2rem;z-index:8889;
    background:#fff8f0;border:3px solid #4a2c5a;border-radius:22px;
    padding:1.1rem 1.15rem 1rem;
    box-shadow:5px 5px 0 #d4c1ff;
    width:min(88vw,272px);
    transform:translateY(14px) scale(.94);transform-origin:bottom left;
    opacity:0;pointer-events:none;
    transition:opacity .25s cubic-bezier(.175,.885,.32,1.275),
               transform .25s cubic-bezier(.175,.885,.32,1.275);
  `;

  // header
  const hdr = document.createElement('div');
  hdr.style.cssText=`font-family:'Baloo 2',cursive;font-weight:800;font-size:1rem;
    color:#4a2c5a;margin-bottom:.7rem;display:flex;align-items:center;gap:.4rem;`;
  hdr.innerHTML='<span style="font-size:1.1rem">🤫</span> secret things to try';
  panel.appendChild(hdr);

  // rows
  HINTS.forEach(h => {
    const row = document.createElement('div');
    row.style.cssText=`display:flex;align-items:center;gap:.55rem;
      padding:.3rem .05rem;border-bottom:1.5px dashed rgba(74,44,90,.12);`;
    row.innerHTML=`
      <span style="font-size:1rem;flex-shrink:0">${h.icon}</span>
      <span style="font-family:'Nunito',sans-serif;font-size:.82rem;font-weight:700;
        color:#4a2c5a;background:#ffd6e0;border-radius:6px;padding:.08em .42em;
        white-space:nowrap">${h.key}</span>
      <span style="font-family:'Nunito',sans-serif;font-size:.78rem;color:#7a4e8a;
        line-height:1.3">${h.desc}</span>
    `;
    panel.appendChild(row);
  });

  // footer
  const note = document.createElement('p');
  note.style.cssText=`font-family:'Nunito',sans-serif;font-size:.72rem;color:#b89ab8;
    margin-top:.6rem;text-align:center;`;
  note.textContent='just type — no need to click 🌸';
  panel.appendChild(note);
  document.body.appendChild(panel);

  // toggle
  let panelOpen = false;
  function openPanel()  {
    panelOpen=true;
    panel.style.opacity='1';
    panel.style.transform='translateY(0) scale(1)';
    panel.style.pointerEvents='all';
    btn.style.opacity='1'; btn.innerHTML='✕ close';
  }
  function closePanel() {
    panelOpen=false;
    panel.style.opacity='0';
    panel.style.transform='translateY(14px) scale(.94)';
    panel.style.pointerEvents='none';
    btn.style.opacity='.75'; btn.innerHTML='✨ psst...';
  }
  btn.addEventListener('click', ()=> panelOpen ? closePanel() : openPanel());
  document.addEventListener('click', e=>{
    if (panelOpen && !panel.contains(e.target) && e.target!==btn) closePanel();
  });
}

// periodic whisper toasts — one random hint slides in from the right
function startWhispers() {
  const seen = new Set();
  function showWhisper() {
    const pool = HINTS.filter(h=>!seen.has(h.key));
    const hint = (pool.length ? pool : HINTS)[Math.floor(Math.random()*(pool.length||HINTS.length))];
    seen.add(hint.key);

    const t = document.createElement('div');
    t.style.cssText=`
      position:fixed;bottom:4.8rem;right:1.2rem;z-index:8890;
      background:#fff8f0;border:2.5px solid #4a2c5a;border-radius:16px;
      padding:.58rem .85rem;max-width:min(88vw,215px);
      box-shadow:3px 3px 0 #ffb59c;
      transform:translateX(115%);opacity:0;
      transition:transform .35s cubic-bezier(.175,.885,.32,1.275),opacity .3s;
    `;
    t.innerHTML=`
      <div style="font-family:'Nunito',sans-serif;font-size:.68rem;font-weight:700;
        color:#b89ab8;text-transform:uppercase;letter-spacing:.07em;margin-bottom:.2rem;">psst 🤫</div>
      <div style="display:flex;align-items:center;gap:.45rem;">
        <span style="font-size:1rem">${hint.icon}</span>
        <div style="line-height:1.35">
          <span style="font-family:'Baloo 2',cursive;font-weight:700;font-size:.85rem;
            color:#4a2c5a;background:#ffd6e0;border-radius:6px;
            padding:.05em .38em">${hint.key}</span>
          <span style="font-family:'Nunito',sans-serif;font-size:.76rem;
            color:#7a4e8a;margin-left:.25rem">${hint.desc}</span>
        </div>
      </div>
    `;
    document.body.appendChild(t);
    requestAnimationFrame(()=>{ t.style.transform='translateX(0)'; t.style.opacity='1'; });
    setTimeout(()=>{
      t.style.transform='translateX(115%)'; t.style.opacity='0';
      setTimeout(()=>t.remove(), 400);
    }, 4000);
  }
  // first whisper after 9s, then every 28s
  setTimeout(()=>{ showWhisper(); setInterval(showWhisper, 28000); }, 9000);
}

// ── SUSPICIOUS BUTTON ─────────────────────────────────────
function initSuspiciousButton() {
  const btn = document.getElementById('suspicious-btn');
  if (!btn) return;

  let clickCount = 0;
  let resetTimer = null;
  let isAnimating = false;

  const texts = [
    "whatever you do, don't click this",
    "I literally told you not to 😭",
    "Since you're already here...",
    "I love you. ❤️",
    "Okay fine.",
    "bro you're just clicking buttons now 💀",
    "AGRIMA STOP 😭",
    "fine. you win. ❤️"
  ];

  function updateText(text) {
    btn.classList.remove('text-fade');
    void btn.offsetWidth; // trigger reflow
    btn.textContent = text;
    btn.classList.add('text-fade');
  }

  function resetBtn() {
    clickCount = 0;
    updateText(texts[0]);
    isAnimating = false;
  }

  function triggerHeartBurst() {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    for (let i = 0; i < 16; i++) {
      const el = document.createElement('div');
      el.className = 'susp-heart';
      el.textContent = '❤️';
      const angle = Math.random() * Math.PI * 2;
      const dist = 35 + Math.random() * 55;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30; // Float slightly upward
      const rot = (Math.random() - 0.5) * 120;
      const dur = 1.2 + Math.random() * 0.8;

      el.style.cssText = `
        left: ${cx}px; top: ${cy}px;
        --dx: ${dx}px; --dy: ${dy}px;
        --rot: ${rot}deg; --dur: ${dur}s;
      `;
      document.body.appendChild(el);
      el.addEventListener('animationend', () => el.remove());
    }
  }

  btn.addEventListener('click', () => {
    if (isAnimating) return;

    clickCount++;
    clearTimeout(resetTimer);
    resetTimer = setTimeout(resetBtn, 20000); // Auto-reset after 20s of inactivity

    if (clickCount === 1) {
      updateText(texts[1]);
    } else if (clickCount === 2) {
      updateText(texts[2]);
    } else if (clickCount === 3) {
      updateText(texts[3]);
    } else if (clickCount === 4) {
      isAnimating = true;
      updateText(texts[4]);
      setTimeout(() => {
        if (clickCount !== 4) return;
        updateText("I REALLY love you.");
        isAnimating = false;
      }, 1200);
    } else if (clickCount === 5) {
      updateText(texts[5]);
    } else if (clickCount === 6) {
      updateText(texts[6]);
    } else if (clickCount === 7) {
      isAnimating = true; // Lock the button
      updateText(texts[7]);
      triggerHeartBurst();
      clearTimeout(resetTimer);
      setTimeout(resetBtn, 8000); // Auto-reset 8 seconds after completion
    }
  });
}

// ── SECRET EYE EASTER EGG ─────────────────────────────────
function initEyeEasterEgg() {
  const eyeBtn = document.getElementById('secret-eye');
  if (!eyeBtn) return;

  // Create overlay modal
  const overlay = document.createElement('div');
  overlay.className = 'eye-overlay';
  overlay.innerHTML = `
    <button class="eye-close" aria-label="Close">×</button>
    <div id="eye-text-1" class="eye-text">Yeah.</div>
    <div id="eye-text-2" class="eye-text">Those eyes.</div>
    <div id="eye-text-3" class="eye-text">The ones that still make me forget what I was saying.</div>
    <div id="eye-photo-container" class="eye-photo-container">
      <img src="images/eyes.jpg" alt="Agrima's eyes" class="eye-photo">
      <div class="eye-photo-caption">365 days later and this still hasn't gotten any easier. ❤️</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.eye-close');
  const t1 = overlay.querySelector('#eye-text-1');
  const t2 = overlay.querySelector('#eye-text-2');
  const t3 = overlay.querySelector('#eye-text-3');
  const pc = overlay.querySelector('#eye-photo-container');

  let seqTimers = [];

  function resetOverlay() {
    overlay.classList.remove('active');
    seqTimers.forEach(clearTimeout);
    seqTimers = [];
    setTimeout(() => {
      [t1, t2, t3, pc].forEach(el => {
        el.style.opacity = '0';
        el.style.transform = el === pc ? 'scale(0.95)' : 'translateY(10px)';
      });
    }, 1000); // Wait for overlay fade out
  }

  eyeBtn.addEventListener('click', () => {
    overlay.classList.add('active');

    // Sequence timings
    seqTimers.push(setTimeout(() => {
      t1.style.opacity = '1'; t1.style.transform = 'translateY(0)';
    }, 1200));

    seqTimers.push(setTimeout(() => {
      t1.style.opacity = '0'; t1.style.transform = 'translateY(-10px)';
    }, 3000));

    seqTimers.push(setTimeout(() => {
      t2.style.opacity = '1'; t2.style.transform = 'translateY(0)';
    }, 3800));

    seqTimers.push(setTimeout(() => {
      t2.style.opacity = '0'; t2.style.transform = 'translateY(-10px)';
    }, 5600));

    seqTimers.push(setTimeout(() => {
      t3.style.opacity = '1'; t3.style.transform = 'translateY(0)';
    }, 6600));

    seqTimers.push(setTimeout(() => {
      t3.style.opacity = '0'; t3.style.transform = 'translateY(-10px)';
    }, 9000));

    seqTimers.push(setTimeout(() => {
      pc.style.opacity = '1'; pc.style.transform = 'scale(1)';
    }, 10200));
  });

  closeBtn.addEventListener('click', resetOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) resetOverlay();
  });
}

// ── SCROLL REVEAL ─────────────────────────────────────────
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr--visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sr').forEach(el => io.observe(el));

  // Hero elements are already visible on load — fire them immediately with a small delay so CSS transitions run
  setTimeout(() => {
    document.querySelectorAll('#hero .sr').forEach(el => {
      el.classList.add('sr--visible');
      io.unobserve(el);
    });
  }, 80);
}

// ── INIT ──────────────────────────────────────────────────
function init() {
  makeBgBubbles();
  injectBlobs();
  splitHeadline();
  buildCards();
  observeCards();
  startBlinks();
  buildHintUI();
  startWhispers();
  initSuspiciousButton();
  initEyeEasterEgg();
  initScrollReveal();

  // attach squeaks to hero blobs
  const wrapPeach = heroBlobPeach?.closest('.blob-wrap');
  const wrapLilac = heroBlobLilac?.closest('.blob-wrap');
  const bubPeach  = document.getElementById('bubble-peach');
  const bubLilac  = document.getElementById('bubble-lilac');
  attachSqueak(wrapPeach, bubPeach);
  attachSqueak(wrapLilac, bubLilac);
}

document.addEventListener('DOMContentLoaded', init);

// ── CURSOR WHISPER EASTER EGG ─────────────────────────────
// "pooks, you there?" — whispers beside the cursor after stillness.
(function () {
  // Disable entirely on touch-only / mobile devices
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const MESSAGES = [
    'pooks, you there? ❤️',
    'pooks, you there? ❤️',  // weighted: appears twice → more likely
    'hey pooks 👀',
    'still here? ❤️',
    'what are you looking at? 😭',
    'hi pooks.'
  ];

  const IDLE_MS   = 2600;   // ms of stillness before trigger
  const COOLDOWN  = 25000;  // ms before it can trigger again
  const MAX_SHOWS = 3;      // max triggers per session
  const OFFSET_X  = 18;     // px right of cursor
  const OFFSET_Y  = -28;    // px above cursor
  const REDUCED   = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let shows       = 0;
  let lastShownAt = -Infinity;
  let idleTimer   = null;
  let curX = 0, curY = 0;
  let tipEl       = null;
  let tipVisible  = false;
  let hideTimer   = null;

  // Create the tooltip element once
  function createTip() {
    const el = document.createElement('div');
    el.setAttribute('aria-hidden', 'true');
    el.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'z-index:999999',
      "font-family:'Baloo 2',cursive",
      'font-size:0.82rem',
      'font-weight:600',
      'color:var(--plum,#4a2c5a)',
      'letter-spacing:0.01em',
      'white-space:nowrap',
      'opacity:0',
      'user-select:none',
      '-webkit-user-select:none',
      `transition:opacity ${REDUCED?'0ms':'280ms'} ease,transform ${REDUCED?'0ms':'280ms'} cubic-bezier(0.22,1,0.36,1)`,
      `transform:translateY(${REDUCED?'0':'6px'})`
    ].join(';');
    document.body.appendChild(el);
    return el;
  }

  // Position tip beside cursor, clamped to viewport
  function placeTip(x, y) {
    if (!tipEl) return;
    const w  = tipEl.offsetWidth  || 160;
    const h  = tipEl.offsetHeight || 20;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let left = x + OFFSET_X;
    let top  = y + OFFSET_Y;
    if (left + w + 12 > vw) left = x - w - OFFSET_X;
    if (top < 8)            top  = y + Math.abs(OFFSET_Y);
    if (top + h > vh - 8)  top  = vh - h - 8;
    tipEl.style.left = left + 'px';
    tipEl.style.top  = top  + 'px';
  }

  // Show the whisper
  function showTip() {
    if (shows >= MAX_SHOWS) return;
    const now = Date.now();
    if (now - lastShownAt < COOLDOWN) return;
    shows++;
    lastShownAt = now;
    if (!tipEl) tipEl = createTip();
    tipEl.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    placeTip(curX, curY);
    void tipEl.offsetWidth; // force reflow
    tipEl.style.opacity   = '1';
    tipEl.style.transform = 'translateY(0)';
    tipVisible = true;
  }

  // Hide the whisper
  function hideTip(delay) {
    if (!tipEl || !tipVisible) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      tipEl.style.opacity   = '0';
      tipEl.style.transform = 'translateY(' + (REDUCED ? '0' : '6px') + ')';
      tipVisible = false;
    }, delay);
  }

  // Mouse move — reset idle timer; if visible, follow then fade
  document.addEventListener('mousemove', function (e) {
    curX = e.clientX;
    curY = e.clientY;
    if (tipVisible) {
      placeTip(curX, curY);
      hideTip(400);
      clearTimeout(idleTimer);
      return;
    }
    clearTimeout(idleTimer);
    idleTimer = setTimeout(showTip, IDLE_MS);
  }, { passive: true });

  // Stop idle timer when cursor leaves window
  document.addEventListener('mouseleave', function () {
    clearTimeout(idleTimer);
    hideTip(0);
  });
})();
