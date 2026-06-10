(function () {
  'use strict';

  // ── 1. INJECT STYLES ───────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── Dark theme variables ── */
    html[data-theme="dark"] {
      --bg:              #141412;
      --surface:         #1E1D1A;
      --border:          #2E2C28;
      --border-light:    #252320;
      --text-primary:    #F0EEE8;
      --text-secondary:  #8A8880;
      --text-tertiary:   #5A5854;
      --accent-math:     #8E8BE0;
      --accent-math-light: #1E1D2E;
      --accent-phy:      #22C98A;
      --accent-phy-light: #121E18;
      --accent-chem:     #D96239;
      --accent-chem-light: #201510;
    }

    /* Nav backdrop — overrides the hardcoded rgba in base CSS */
    html[data-theme="dark"] nav {
      background: rgba(20, 20, 18, 0.92);
    }

    /* Modal overlay tint */
    html[data-theme="dark"] .modal-overlay {
      background: rgba(0, 0, 0, 0.72);
    }

    /* Pill overrides */
    html[data-theme="dark"] .pill-ncert      { background: #0D2B23; color: #5DDDB6; }
    html[data-theme="dark"] .pill-ncert-plus { background: #0A2620; color: #2CC99A; }
    html[data-theme="dark"] .pill-jee        { background: #1A1930; color: #A09EE8; }
    html[data-theme="dark"] .pill-jee-plus   { background: #534AB7; color: #EEEDFE; }

    /* Hover shadow in dark mode */
    html[data-theme="dark"] .pdf-card:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    /* ── Toggle button ── */
    #dm-toggle {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-secondary);
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    #dm-toggle:hover {
      color: var(--text-primary);
      border-color: var(--text-tertiary);
      background: var(--border-light);
    }
    #dm-toggle .dm-icon { font-size: 14px; line-height: 1; }
  `;
  document.head.appendChild(style);

  // ── 2. INJECT TOGGLE BUTTON INTO NAV ──────────────────────────────────────
  const nav = document.querySelector('nav');
  const btn = document.createElement('button');
  btn.id = 'dm-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.innerHTML = '<span class="dm-icon">☀️</span><span class="dm-label">Light</span>';
  nav.appendChild(btn);

  // ── 3. CHART COLOUR HELPERS ───────────────────────────────────────────────
  const DARK_SUBJ_COLORS = {
    maths:     { bar: '#8E8BE0', light: '#1E1D2E' },
    physics:   { bar: '#22C98A', light: '#121E18' },
    chemistry: { bar: '#D96239', light: '#201510' },
  };

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  // Patch renderWeightChart to use dark-aware colours when re-rendering
  const _origRenderWeightChart = window.renderWeightChart;
  window.renderWeightChart = function () {
    // Temporarily swap SUBJ_COLORS if dark mode is on
    const original = {};
    if (isDark()) {
      Object.keys(DARK_SUBJ_COLORS).forEach(k => {
        original[k] = { ...window.SUBJ_COLORS[k] };
        window.SUBJ_COLORS[k] = DARK_SUBJ_COLORS[k];
      });
    }
    _origRenderWeightChart.call(this);
    // Restore original colours
    if (isDark()) {
      Object.keys(original).forEach(k => {
        window.SUBJ_COLORS[k] = original[k];
      });
    }

    // Patch chart scales/tooltip colours post-render
    patchChartTheme();
  };

  function patchChartTheme() {
    if (!window.weightChart) return;
    const dark = isDark();

    const gridColor   = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    const borderColor = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const tickColorX  = dark ? '#5A5854' : '#A8A69F';
    const tickColorY  = dark ? '#F0EEE8' : '#1A1916';
    const tooltipBg   = dark ? '#F0EEE8' : '#1A1916';
    const tooltipTxt  = dark ? '#1A1916' : undefined; // Chart.js default is white

    const chart = window.weightChart;
    chart.options.scales.x.grid.color  = gridColor;
    chart.options.scales.x.border.color = borderColor;
    chart.options.scales.x.ticks.color = tickColorX;
    chart.options.scales.y.ticks.color = tickColorY;
    chart.options.plugins.tooltip.backgroundColor = tooltipBg;
    if (tooltipTxt) {
      chart.options.plugins.tooltip.titleColor = tooltipTxt;
      chart.options.plugins.tooltip.bodyColor  = tooltipTxt;
    } else {
      delete chart.options.plugins.tooltip.titleColor;
      delete chart.options.plugins.tooltip.bodyColor;
    }
    chart.update('none');
  }

  // ── 4. APPLY / REMOVE THEME ───────────────────────────────────────────────
  function applyTheme(dark) {
    const html = document.documentElement;
    if (dark) {
      html.setAttribute('data-theme', 'dark');
      btn.innerHTML = '<span class="dm-icon">🌙</span><span class="dm-label">Dark</span>';
    } else {
      html.removeAttribute('data-theme');
      btn.innerHTML = '<span class="dm-icon">☀️</span><span class="dm-label">Light</span>';
    }
    // Re-render chart with correct palette
    window.renderWeightChart();
  }

  // ── 5. TOGGLE HANDLER + PERSISTENCE ──────────────────────────────────────
  btn.addEventListener('click', () => {
    const going = !isDark();
    localStorage.setItem('cee-theme', going ? 'dark' : 'light');
    applyTheme(going);
  });

  // ── 6. RESTORE SAVED PREFERENCE ON LOAD ──────────────────────────────────
  const saved = localStorage.getItem('cee-theme');
  // Also honour OS preference if no saved choice
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    applyTheme(true);
  }

})();
