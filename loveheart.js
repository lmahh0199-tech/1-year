/* ============================================================
   LOVE HEART — 50 LANGUAGES  (v6 — Typographic Heart Formation)
   loveheart.js
   ============================================================ */
(function () {
  'use strict';

  // ── Layout configuration (Mathematically forms a heart silhouette) ──
  // The layout decreases in width smoothly to form the point, and splits at the top for lobes.
  const LAYOUT = [
    { type: 'split',  leftWidth: 32, gap: 12, rightWidth: 32, leftCount: 2, rightCount: 2 }, // Row 0
    { type: 'split',  leftWidth: 40, gap: 4,  rightWidth: 40, leftCount: 3, rightCount: 3 }, // Row 1
    { type: 'single', width: 94,  count: 5 }, // Row 2
    { type: 'single', width: 100, count: 5 }, // Row 3
    { type: 'single', width: 98,  count: 5 }, // Row 4
    { type: 'single', width: 90,  count: 5 }, // Row 5
    { type: 'single', width: 80,  count: 5 }, // Row 6
    { type: 'single', width: 68,  count: 4 }, // Row 7
    { type: 'single', width: 54,  count: 4 }, // Row 8
    { type: 'single', width: 40,  count: 3 }, // Row 9
    { type: 'single', width: 26,  count: 2 }, // Row 10
    { type: 'single', width: 14,  count: 1 }, // Row 11
    { type: 'single', width: 6,   count: 1 }, // Row 12
  ];

  // ── 50 phrases ordered to fit the layout perfectly (Short at edges/bottom, long in middle) ──
  const PHRASES_ORDERED = [
    // Row 0 (4 short)
    ['Te amo', 'Spanish'], ['Ti amo', 'Italian'], ['我爱你', 'Mandarin'], ['사랑해', 'Korean'],
    // Row 1 (6 short/medium)
    ["Je t'aime", 'French'], ['Eu te amo', 'Portuguese'], ['Mahal kita', 'Filipino'],
    ['Saya cinta kamu', 'Indonesian'], ['Tôi yêu em', 'Vietnamese'], ['Σε αγαπώ', 'Greek'],
    // Row 2 (5 mix)
    ['Ich liebe dich', 'German'], ['Я тебя люблю', 'Russian'], ['أنا أحبك', 'Arabic'],
    ['Kimi seviyorum', 'Turkish'], ['ฉันรักคุณ', 'Thai'],
    // Row 3 (5 long/mix)
    ['मैं तुमसे प्यार करता हूँ', 'Hindi'], ['Szeretlek', 'Hungarian'], ['Jag älskar dig', 'Swedish'],
    ['Jeg elsker dig', 'Danish'], ['Rakastan sinua', 'Finnish'],
    // Row 4 (5 long/mix)
    ['Jeg elsker deg', 'Norwegian'], ['Volim te', 'Croatian'], ['Milujem ťa', 'Slovak'],
    ['Miluji tě', 'Czech'], ['Kocham cię', 'Polish'],
    // Row 5 (5 mix)
    ['Te iubesc', 'Romanian'], ['Обичам те', 'Bulgarian'], ['Volim te', 'Serbian'],
    ['Ljubim te', 'Slovenian'], ['Es tevi mīlu', 'Latvian'],
    // Row 6 (5 long/mix)
    ['Aš tave myliu', 'Lithuanian'], ['Ma armastan sind', 'Estonian'], ['Unë të dua', 'Albanian'],
    ['Seni söýýärin', 'Turkmen'], ['Мен сені жақсы көремін', 'Kazakh'],
    // Row 7 (4 long/mix)
    ['Bi dé hezdim', 'Kurdish'], ['Ég elska þig', 'Icelandic'], ["Dw i'n dy garu di", 'Welsh'],
    ['Tha gaol agam ort', 'Scottish Gaelic'],
    // Row 8 (4 mix)
    ['Tá grá agam duit', 'Irish'], ['Ndagukunda', 'Kinyarwanda'], ['Ik hou van jou', 'Dutch'],
    ['Nakupenda', 'Swahili'],
    // Row 9 (3 mix)
    ['Σε αγαπώ πολύ', 'Cypriot Greek'], ['Nakupenda sana', 'Swahili (deep)'], ['Saranghaeyo', 'Korean (formal)'],
    // Row 10 (2 short/medium)
    ['אני אוהב אותך', 'Hebrew'], ['Wo ai ni', 'Mandarin (romanised)'],
    // Row 11 (1 short)
    ['愛してる', 'Japanese'],
    // Row 12 (1 very short — the bottom point of the heart)
    ['I love you', 'English']
  ];

  let isAnimating = false;
  let animationTimers = [];

  // ── Build Section ──
  function buildSection() {
    const sec = document.createElement('section');
    sec.id = 'loveheart-section';
    sec.setAttribute('aria-label', 'I love you in 50 languages');

    sec.innerHTML = `
      <p class="lh-intro" id="lh-intro" aria-hidden="true">50 languages. One feeling.</p>
      <div class="lh-heart-container" id="lh-heart-container" aria-label="Typographic heart forming"></div>
      <p class="lh-outro" id="lh-outro">
        50 languages. One heart. And it's always yours.
        <span class="lh-hs" aria-hidden="true"> ❤️</span>
      </p>
      <button class="lh-replay" id="lh-replay">Watch it again</button>
      <div class="lh-tt" id="lh-tt" role="tooltip" aria-hidden="true"></div>
    `;

    const container = sec.querySelector('#lh-heart-container');
    let phraseIndex = 0;

    // Construct the layout mathematically
    LAYOUT.forEach(row => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'lh-row';

      if (row.type === 'split') {
        rowDiv.appendChild(createLobe(row.leftWidth, row.leftCount));
        
        const gapDiv = document.createElement('div');
        gapDiv.className = 'lh-gap';
        gapDiv.style.width = row.gap + '%';
        rowDiv.appendChild(gapDiv);
        
        rowDiv.appendChild(createLobe(row.rightWidth, row.rightCount));
      } else {
        rowDiv.appendChild(createLobe(row.width, row.count));
      }

      container.appendChild(rowDiv);
    });

    function createLobe(width, count) {
      const lobe = document.createElement('div');
      lobe.className = 'lh-lobe ' + (count > 1 ? 'lh-lobe-multi' : 'lh-lobe-single');
      lobe.style.width = width + '%';

      for (let i = 0; i < count; i++) {
        if (phraseIndex < PHRASES_ORDERED.length) {
          const [text, lang] = PHRASES_ORDERED[phraseIndex++];
          const span = document.createElement('span');
          span.className = 'lh-phrase';
          span.textContent = text;
          span.dataset.lang = lang;
          
          // Accessibility attributes
          span.setAttribute('tabindex', '0');
          span.setAttribute('aria-label', `${text} (${lang})`);
          
          lobe.appendChild(span);
        }
      }
      return lobe;
    }

    const finale = document.getElementById('finale');
    if (finale) finale.parentNode.insertBefore(sec, finale);
    else document.body.appendChild(sec);
  }

  // ── Tooltip Logic ──
  function initTooltip() {
    const tt = document.getElementById('lh-tt');
    const container = document.getElementById('lh-heart-container');
    if (!tt || !container) return;

    let hideTimer = null;

    function place(e) {
      const cx = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const cy = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      const tw = tt.offsetWidth;
      let x = cx + 15, y = cy - 25;
      
      // Keep tooltip in bounds
      if (x + tw + 10 > window.innerWidth) x = cx - tw - 15;
      if (y < 10) y = cy + 15;
      
      tt.style.left = x + 'px';
      tt.style.top = y + 'px';
    }

    function showTooltip(target, e) {
      if (!target.classList.contains('lh-visible')) return;
      clearTimeout(hideTimer);
      tt.textContent = target.dataset.lang;
      tt.classList.add('lh-on');
      tt.setAttribute('aria-hidden', 'false');
      place(e);
    }

    function hideTooltip() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        tt.classList.remove('lh-on');
        tt.setAttribute('aria-hidden', 'true');
      }, 100);
    }

    // Mouse events
    container.addEventListener('mouseover', e => {
      const target = e.target.closest('.lh-phrase');
      if (target) showTooltip(target, e);
    });
    container.addEventListener('mousemove', e => {
      if (tt.classList.contains('lh-on')) place(e);
    });
    container.addEventListener('mouseout', e => {
      if (e.target.closest('.lh-phrase')) hideTooltip();
    });

    // Touch events
    container.addEventListener('touchstart', e => {
      const target = e.target.closest('.lh-phrase');
      if (target) showTooltip(target, e);
    }, { passive: true });
    container.addEventListener('touchend', hideTooltip, { passive: true });

    // Keyboard focus
    container.addEventListener('focusin', e => {
      const target = e.target.closest('.lh-phrase');
      if (target) {
        const rect = target.getBoundingClientRect();
        showTooltip(target, { clientX: rect.left + rect.width / 2, clientY: rect.top });
      }
    });
    container.addEventListener('focusout', hideTooltip);
  }

  // ── Cinematic Animation Logic ──
  function clearTimers() {
    animationTimers.forEach(clearTimeout);
    animationTimers = [];
  }

  function startAnimation(isReplay = false) {
    if (isAnimating) return;
    isAnimating = true;
    clearTimers();

    const intro = document.getElementById('lh-intro');
    const phrases = document.querySelectorAll('.lh-phrase');
    const container = document.getElementById('lh-heart-container');
    const outro = document.getElementById('lh-outro');
    const replayBtn = document.getElementById('lh-replay');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reset state completely
    phrases.forEach(p => p.classList.remove('lh-visible'));
    container.classList.remove('lh-beating');
    outro.classList.remove('lh-on');
    replayBtn.classList.remove('lh-on');

    if (reducedMotion) {
      // Instant reveal for accessibility
      intro.style.display = 'none';
      phrases.forEach(p => p.classList.add('lh-visible'));
      outro.classList.add('lh-on');
      replayBtn.classList.add('lh-on');
      isAnimating = false;
      return;
    }

    let delay = 0;

    if (!isReplay) {
      // 1. Show intro: "50 languages. One feeling."
      intro.classList.remove('lh-off');
      intro.classList.add('lh-on');
      
      // 2. Hide intro after a pause
      animationTimers.push(setTimeout(() => {
        intro.classList.add('lh-off');
        intro.classList.remove('lh-on');
      }, 2200));

      delay = 3200; // Wait for intro to fade out before starting phrases
    } else {
      delay = 500; // Fast restart for replay
    }

    // 3. Reveal phrases sequentially (Total ~ 7.5 seconds)
    const phraseDelay = 150; // ms per phrase
    
    phrases.forEach((phrase, index) => {
      animationTimers.push(setTimeout(() => {
        phrase.classList.add('lh-visible');
      }, delay + (index * phraseDelay)));
    });

    // 4. Conclude animation
    const totalTime = delay + (phrases.length * phraseDelay);
    
    animationTimers.push(setTimeout(() => {
      container.classList.add('lh-beating');
      outro.classList.add('lh-on');
      
      animationTimers.push(setTimeout(() => {
        replayBtn.classList.add('lh-on');
        isAnimating = false;
      }, 1000));
      
    }, totalTime + 600));
  }

  // ── Scroll Reveal ──
  function initReveal() {
    const sec = document.getElementById('loveheart-section');
    if (!sec) return;

    // Replay button listener
    const replayBtn = document.getElementById('lh-replay');
    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        startAnimation(true);
      });
    }

    // Intersection Observer to trigger on scroll
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        startAnimation(false);
        io.disconnect();
      }
    }, { threshold: 0.25 });
    
    io.observe(sec);
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      buildSection();
      initTooltip();
      initReveal();
    });
  } else {
    buildSection();
    initTooltip();
    initReveal();
  }
})();
