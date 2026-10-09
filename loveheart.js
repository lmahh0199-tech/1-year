/* ============================================================
   LOVE HEART — 50 LANGUAGES  (v2 — row-based, no overlap)
   loveheart.js
   ============================================================ */
(function () {
  'use strict';

  // ── 50 phrases [text, language] ───────────────────────────
  const PHRASES = [
    ['I love you',           'English'],
    ["Je t'aime",            'French'],
    ['Te amo',               'Spanish'],
    ['Ich liebe dich',       'German'],
    ['Ti amo',               'Italian'],
    ['Eu te amo',            'Portuguese'],
    ['Я тебя люблю',         'Russian'],
    ['أنا أحبك',             'Arabic'],
    ['我爱你',               'Mandarin'],
    ['愛してる',             'Japanese'],
    ['사랑해',               'Korean'],
    ['मैं तुमसे प्यार करता हूँ', 'Hindi'],
    ['Kimi seviyorum',       'Turkish'],
    ['Mahal kita',           'Filipino'],
    ['Saya cinta kamu',      'Indonesian'],
    ['ฉันรักคุณ',            'Thai'],
    ['Tôi yêu em',           'Vietnamese'],
    ['Nakupenda',            'Swahili'],
    ['Σε αγαπώ',             'Greek'],
    ['אני אוהב אותך',        'Hebrew'],
    ['Szeretlek',            'Hungarian'],
    ['Jag älskar dig',       'Swedish'],
    ['Jeg elsker dig',       'Danish'],
    ['Jeg elsker deg',       'Norwegian'],
    ['Rakastan sinua',       'Finnish'],
    ['Volim te',             'Croatian'],
    ['Milujem ťa',           'Slovak'],
    ['Miluji tě',            'Czech'],
    ['Kocham cię',           'Polish'],
    ['Te iubesc',            'Romanian'],
    ['Обичам те',            'Bulgarian'],
    ['Volim te',             'Serbian'],
    ['Ljubim te',            'Slovenian'],
    ['Es tevi mīlu',         'Latvian'],
    ['Aš tave myliu',        'Lithuanian'],
    ['Ma armastan sind',     'Estonian'],
    ['Unë të dua',           'Albanian'],
    ['Seni söýýärin',        'Turkmen'],
    ['Мен сені жақсы көремін', 'Kazakh'],
    ['Bi dé hezdim',         'Kurdish'],
    ['Ég elska þig',         'Icelandic'],
    ['Dw i\'n dy garu di',   'Welsh'],
    ['Tha gaol agam ort',    'Scottish Gaelic'],
    ['Tá grá agam duit',     'Irish'],
    ['Ndagukunda',           'Kinyarwanda'],
    ['Ik hou van jou',       'Dutch'],
    ['Σε αγαπώ πολύ',        'Cypriot Greek'],
    ['Saranghae',            'Korean (romanised)'],
    ['Nakupenda sana',       'Swahili (earnest)'],
    ['Wo ai ni',             'Mandarin (romanised)'],
  ];

  // ── Heart row width profile (normalised 0→1, top→bottom) ─
  // Hand-tuned to give a clean recognisable heart silhouette
  // 24 rows total
  const HEART_WIDTHS = [
    0.18,  // 0  — top gap (two small bumps barely exist)
    0.38,  // 1
    0.58,  // 2
    0.72,  // 3
    0.82,  // 4
    0.89,  // 5
    0.94,  // 6  — widest bump zone
    0.98,  // 7
    1.00,  // 8  — absolute widest
    0.99,  // 9
    0.96,  // 10
    0.91,  // 11
    0.84,  // 12
    0.75,  // 13
    0.65,  // 14
    0.54,  // 15
    0.43,  // 16
    0.33,  // 17
    0.24,  // 18
    0.16,  // 19
    0.10,  // 20
    0.05,  // 21
    0.02,  // 22  — tip
    0.00,  // 23  — point (skip)
  ];

  // ── Build the section and attach to DOM ───────────────────
  function buildSection() {
    const sec = document.createElement('section');
    sec.id = 'loveheart-section';
    sec.setAttribute('aria-label', 'I love you in 50 languages');

    sec.innerHTML = `
      <p class="lh-intro">50 languages. One feeling. You.</p>
      <div class="lh-rows" id="lh-rows" aria-label="Typographic heart of I love you in 50 languages"></div>
      <p class="lh-outro" id="lh-outro">
        No matter which language I speak, my heart will always find its way to you.
        <span class="lh-hs" aria-hidden="true"> ❤️</span>
      </p>
      <div class="lh-tooltip" id="lh-tt" role="tooltip" aria-hidden="true"></div>
    `;

    const finale = document.getElementById('finale');
    if (finale) finale.parentNode.insertBefore(sec, finale);
    else document.body.appendChild(sec);
  }

  // ── Render rows ───────────────────────────────────────────
  function renderRows() {
    const rowsEl = document.getElementById('lh-rows');
    if (!rowsEl) return;

    // Container width drives all sizing
    const W = rowsEl.offsetWidth;
    if (W < 10) return;

    // Font size: scale with container but clamp
    const FS = Math.round(Math.max(9, Math.min(13, W * 0.026)));

    rowsEl.innerHTML = '';

    let phraseIdx = 0;

    HEART_WIDTHS.forEach((frac, rowIdx) => {
      if (frac < 0.01) return; // skip tip

      const rowW = Math.round(frac * W);

      // Estimate how many words fit this row
      // avgWordWidth ≈ FS * 8 chars + separator width
      const avgWordPx = FS * 7.5;
      const sepPx     = FS * 1.4;       // " · "
      let numWords = Math.max(2, Math.floor(rowW / (avgWordPx + sepPx)));

      const rowDiv = document.createElement('div');
      rowDiv.className = 'lh-row';
      rowDiv.style.width     = rowW + 'px';
      rowDiv.style.fontSize  = FS + 'px';

      for (let w = 0; w < numWords; w++) {
        const [phrase, lang] = PHRASES[phraseIdx % PHRASES.length];
        phraseIdx++;

        const span = document.createElement('span');
        span.className   = 'lh-word';
        span.textContent = phrase;
        span.dataset.lang = lang;
        span.setAttribute('tabindex', '0');
        span.setAttribute('aria-label', `${phrase} — ${lang}`);

        rowDiv.appendChild(span);

        // Add separator except after last word
        if (w < numWords - 1) {
          const sep = document.createElement('span');
          sep.className = 'lh-sep';
          sep.textContent = '·';
          sep.setAttribute('aria-hidden', 'true');
          rowDiv.appendChild(sep);
        }
      }

      rowsEl.appendChild(rowDiv);
    });
  }

  // ── Animate rows in (staggered, outside-in) ───────────────
  function animateRows(onDone) {
    const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rows = document.querySelectorAll('.lh-row');
    const total = rows.length;

    if (REDUCED) {
      rows.forEach(r => r.classList.add('lh-row-visible'));
      onDone();
      return;
    }

    // Animate from middle outward — so middle rows appear first (cinematic)
    const mid = Math.floor(total / 2);
    let maxDelay = 0;

    rows.forEach((row, i) => {
      // Distance from middle → rows near middle appear first
      const dist = Math.abs(i - mid);
      const delay = 0.04 + dist * 0.06; // seconds
      if (delay > maxDelay) maxDelay = delay;
      row.style.transitionDelay = delay + 's';
    });

    // Trigger in next frame
    requestAnimationFrame(() => {
      rows.forEach(r => r.classList.add('lh-row-visible'));
    });

    // Call onDone after all transitions finish
    setTimeout(onDone, (maxDelay + 0.65) * 1000);
  }

  // ── Tooltip ───────────────────────────────────────────────
  function initTooltip() {
    const tt  = document.getElementById('lh-tt');
    const con = document.getElementById('lh-rows');
    if (!tt || !con) return;

    let hideTimer = null;

    function place(e) {
      const cx = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      const cy = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
      const tw = tt.offsetWidth || 80;
      const th = tt.offsetHeight || 20;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let x = cx + 14, y = cy - 30;
      if (x + tw + 8 > vw) x = cx - tw - 10;
      if (y < 6)           y = cy + 14;
      if (y + th > vh - 6) y = vh - th - 6;
      tt.style.left = x + 'px';
      tt.style.top  = y + 'px';
    }

    function showFor(el, e) {
      clearTimeout(hideTimer);
      tt.textContent = el.dataset.lang || '';
      tt.setAttribute('aria-hidden', 'false');
      place(e);
      tt.classList.add('lh-tt-on');
    }

    function hide() {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        tt.classList.remove('lh-tt-on');
        tt.setAttribute('aria-hidden', 'true');
      }, 160);
    }

    con.addEventListener('mouseover', e => {
      const w = e.target.closest('.lh-word');
      if (w) showFor(w, e);
    });
    con.addEventListener('mousemove', e => {
      if (tt.classList.contains('lh-tt-on')) place(e);
    });
    con.addEventListener('mouseout', e => {
      if (e.target.classList.contains('lh-word')) hide();
    });
    con.addEventListener('touchstart', e => {
      const w = e.target.closest('.lh-word');
      if (w) showFor(w, e);
    }, { passive: true });
    con.addEventListener('touchend', hide, { passive: true });
    con.addEventListener('focusin', e => {
      const w = e.target.closest('.lh-word');
      if (w) {
        const r = w.getBoundingClientRect();
        showFor(w, { clientX: r.left + r.width / 2, clientY: r.top });
      }
    });
    con.addEventListener('focusout', hide);
  }

  // ── Scroll-triggered reveal ───────────────────────────────
  function initReveal() {
    const sec = document.getElementById('loveheart-section');
    if (!sec) return;

    let fired = false;

    function reveal() {
      if (fired) return;
      fired = true;

      // Render needs offsetWidth — wait a tick after section is in view
      setTimeout(() => {
        renderRows();

        animateRows(() => {
          // Heartbeat
          const rows = document.getElementById('lh-rows');
          if (rows) rows.classList.add('lh-beating');

          // Outro text
          const outro = document.getElementById('lh-outro');
          if (outro) setTimeout(() => outro.classList.add('lh-outro-on'), 500);
        });
      }, 60);
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveal(); return;
    }

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { reveal(); io.disconnect(); }
    }, { threshold: 0.08 });

    io.observe(sec);
  }

  // ── Re-render on resize (debounced) ──────────────────────
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const fired = document.querySelector('.lh-row');
      if (!fired) return;
      renderRows();
      document.querySelectorAll('.lh-row').forEach(r => r.classList.add('lh-row-visible'));
    }, 250);
  }, { passive: true });

  // ── Boot ─────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { buildSection(); initTooltip(); initReveal(); });
  } else {
    buildSection(); initTooltip(); initReveal();
  }
})();
