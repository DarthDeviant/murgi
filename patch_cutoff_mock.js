(function () {
  'use strict';

  // ── 1. CUTOFF DATA ────────────────────────────────────────────────────────
  // marks = closing marks (out of 360); ranks = closing rank (AIR).
  // Values are approximate; actual cutoffs vary by reservation category.
  const COLLEGES = [
    'AEC',   // Assam Engineering College
    'JEC',   // Jorhat Engineering College
    'DUIET', // Dibrugarh University Inst. of Engg.
    'GIMT',  // Girijananda Chowdhury Inst.
    'BBEC',  // Bineswar Brahma Engineering College
  ];
  const COLLEGE_FULL = {
    'AEC':   'Assam Engineering College',
    'JEC':   'Jorhat Engineering College',
    'DUIET': 'DU Inst. of Engineering & Technology',
    'GIMT':  'Girijananda Chowdhury Inst.',
    'BBEC':  'Bineswar Brahma Engineering College',
  };

  const CUTOFF_DATA = {
    cs: {
      2022: { marks: [151, 140, 128, 119, 109], ranks: [260,  590, 1310, 2050, 3750] },
      2023: { marks: [155, 143, 131, 123, 113], ranks: [225,  530, 1160, 1860, 3320] },
    },
    civil: {
      2022: { marks: [134, 124, 112, 103,  95], ranks: [790, 1500, 2600, 3700, 5200] },
      2023: { marks: [137, 127, 115, 106,  98], ranks: [700, 1350, 2400, 3400, 4800] },
    },
    mech: {
      2022: { marks: [130, 120, 109,  99,  90], ranks: [980, 1800, 3100, 4500, 6300] },
      2023: { marks: [133, 123, 112, 102,  93], ranks: [880, 1630, 2900, 4100, 5700] },
    },
    eee: {
      2022: { marks: [127, 118, 106,  97,  87], ranks: [1150, 2100, 3500, 5000, 7200] },
      2023: { marks: [130, 121, 109,  100,  90], ranks: [1020, 1900, 3200, 4600, 6500] },
    },
  };

  // ── 2. STATE ──────────────────────────────────────────────────────────────
  let cBranch = 'cs';
  let cYear   = 2023;
  let cMode   = 'marks'; // 'marks' | 'ranks'
  let cutoffChart = null;

  // ── 3. INJECT STYLES ──────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── Mode toggle (Marks / Ranks) ── */
    .mode-toggle {
      display: flex;
      gap: 4px;
      background: var(--bg);
      padding: 3px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }
    .mode-btn {
      padding: 4px 14px;
      border: none;
      background: transparent;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.15s;
    }
    .mode-btn.active {
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    /* ── Branch pills ── */
    .branch-bar { display: flex; gap: 6px; flex-wrap: wrap; }
    .branch-btn {
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: transparent;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all 0.15s;
    }
    .branch-btn:hover { border-color: var(--text-tertiary); color: var(--text-primary); }
    .branch-btn.active {
      background: var(--accent-math-light);
      color: var(--accent-math);
      border-color: var(--accent-math);
    }

    /* ── Rank note badge ── */
    .rank-note {
      display: none;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      color: var(--text-tertiary);
      padding: 3px 10px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: var(--bg);
      white-space: nowrap;
    }
    .rank-note.visible { display: inline-flex; align-items: center; gap: 5px; }

    /* ── Mock section card ── */
    #mock-section {
      margin-bottom: 24px;
    }
    .mock-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 16px;
    }
    .mock-icon-wrap {
      width: 64px; height: 64px;
      border-radius: 16px;
      background: var(--accent-math-light);
      display: flex; align-items: center; justify-content: center;
      font-size: 28px;
    }
    .mock-card h2 {
      font-family: 'DM Serif Display', serif;
      font-size: 24px;
      letter-spacing: -0.4px;
      color: var(--text-primary);
    }
    .mock-card p {
      font-size: 14px;
      color: var(--text-secondary);
      max-width: 420px;
      line-height: 1.7;
    }
    .mock-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 24px;
      background: var(--text-primary);
      color: var(--bg);
      border-radius: var(--radius-sm);
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      transition: opacity 0.15s;
      margin-top: 4px;
    }
    .mock-cta:hover { opacity: 0.82; }

    /* ── Cutoff footer note ── */
    .cutoff-footer {
      padding: 12px 22px;
      font-size: 11px;
      color: var(--text-tertiary);
      font-family: 'JetBrains Mono', monospace;
      border-top: 1px solid var(--border-light);
    }
  `;
  document.head.appendChild(style);

  // ── 4. INJECT NAV LINKS ───────────────────────────────────────────────────
  const navLinks = document.querySelector('.nav-links');
  ['cutoffs', 'mock'].forEach(id => {
    const li = document.createElement('li');
    const a  = document.createElement('a');
    a.href = `#${id}-section`;
    a.textContent = id === 'cutoffs' ? 'Cutoffs' : 'Mock Tests';
    li.appendChild(a);
    navLinks.appendChild(li);
  });

  // ── 5. INJECT HTML INTO <main> ────────────────────────────────────────────
  const main = document.querySelector('main.main');

  // — 5a. Cutoff section —
  const cutoffSection = document.createElement('section');
  cutoffSection.id = 'cutoffs-section';
  cutoffSection.innerHTML = `
    <div class="section-card">
      <div class="section-header">
        <div>
          <h2 class="section-title">College Cutoffs</h2>
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end;">
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
            <span class="rank-note" id="rankNote">↓ lower rank = better</span>
            <div class="mode-toggle">
              <button class="mode-btn active" id="modeMarks" onclick="setCMode('marks',this)">Marks</button>
              <button class="mode-btn"        id="modeRanks" onclick="setCMode('ranks',this)">Ranks</button>
            </div>
          </div>
          <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
            <div class="branch-bar" id="branchBar">
              <button class="branch-btn active" onclick="setCBranch('cs',this)">CS/IT</button>
              <button class="branch-btn" onclick="setCBranch('civil',this)">Civil</button>
              <button class="branch-btn" onclick="setCBranch('mech',this)">Mech</button>
              <button class="branch-btn" onclick="setCBranch('eee',this)">EEE</button>
            </div>
            <div class="year-toggle">
              <button class="year-btn" id="cYear2022" onclick="setCYear(2022)">2022</button>
              <button class="year-btn active" id="cYear2023" onclick="setCYear(2023)">2023</button>
            </div>
          </div>
        </div>
      </div>
      <div class="chart-wrap">
        <div style="position:relative;height:260px;">
          <canvas id="cutoffChart" role="img" aria-label="College cutoff bar chart"></canvas>
        </div>
      </div>
      <div class="cutoff-footer">
        Closing cutoffs · General category · Approximate values — verify with official ASTU counselling data
      </div>
    </div>
  `;
  main.appendChild(cutoffSection);

  // — 5b. Mock section —
  const mockSection = document.createElement('section');
  mockSection.id = 'mock-section';
  mockSection.innerHTML = `
    <div class="mock-card">
      <div class="mock-icon-wrap">✏️</div>
      <h2>Full-Length Mock Tests</h2>
      <p>Attempt CEE-pattern mock tests with auto-evaluation, chapter-wise performance breakdown, and time analytics — all free.</p>
      <a class="mock-cta" href="https://mocksphere-cee.pages.dev/mock-tests" target="_blank" rel="noopener">
        Start a Mock Test &nbsp;↗
      </a>
    </div>
  `;
  main.appendChild(mockSection);

  // ── 6. CHART RENDER ───────────────────────────────────────────────────────
  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function renderCutoffChart() {
    const raw    = CUTOFF_DATA[cBranch][cYear];
    const values = raw[cMode];
    const labels = COLLEGES.map(c => COLLEGE_FULL[c]);

    // Sort: marks desc, ranks asc (lower rank = better → sort asc so best appears first)
    const paired = COLLEGES.map((c, i) => ({ label: labels[i], val: values[i] }));
    paired.sort((a, b) => cMode === 'marks' ? b.val - a.val : a.val - b.val);

    const sortedLabels = paired.map(p => p.label);
    const sortedVals   = paired.map(p => p.val);

    const dark = isDark();
    const barColor   = dark ? '#8E8BE0' : '#3D3A8C';
    const gridColor  = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    const borderCol  = dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    const tickColorX = dark ? '#5A5854' : '#A8A69F';
    const tickColorY = dark ? '#F0EEE8' : '#1A1916';
    const tooltipBg  = dark ? '#F0EEE8' : '#1A1916';
    const tooltipFg  = dark ? '#1A1916' : '#FFFFFF';

    if (cutoffChart) { cutoffChart.destroy(); cutoffChart = null; }

    const ctx = document.getElementById('cutoffChart');
    cutoffChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: sortedLabels,
        datasets: [{
          label: cMode === 'marks' ? 'Closing Marks' : 'Closing Rank',
          data: sortedVals,
          backgroundColor: barColor,
          borderColor: barColor,
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: tooltipBg,
            titleColor: tooltipFg,
            bodyColor: tooltipFg,
            titleFont: { family: 'Inter', size: 12, weight: '600' },
            bodyFont: { family: 'JetBrains Mono', size: 11 },
            callbacks: {
              label: ctx => cMode === 'marks'
                ? ` ${ctx.raw} / 360 marks`
                : ` Rank ${ctx.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            beginAtZero: false,
            reverse: false,
            grid: { color: gridColor },
            border: { color: borderCol },
            ticks: {
              font: { family: 'JetBrains Mono', size: 11 },
              color: tickColorX,
              callback: v => cMode === 'marks' ? v : v.toLocaleString(),
            }
          },
          y: {
            grid: { display: false },
            ticks: { font: { family: 'Inter', size: 12, weight: '500' }, color: tickColorY },
            border: { display: false }
          }
        }
      }
    });
  }

  // ── 7. CONTROL HANDLERS ───────────────────────────────────────────────────
  window.setCMode = function (mode, el) {
    cMode = mode;
    document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('rankNote').classList.toggle('visible', mode === 'ranks');
    renderCutoffChart();
  };

  window.setCBranch = function (branch, el) {
    cBranch = branch;
    document.querySelectorAll('#branchBar .branch-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    renderCutoffChart();
  };

  window.setCYear = function (year) {
    cYear = year;
    document.getElementById('cYear2022').classList.toggle('active', year === 2022);
    document.getElementById('cYear2023').classList.toggle('active', year === 2023);
    renderCutoffChart();
  };

  // ── 8. RE-RENDER ON DARK MODE TOGGLE (compat with patch_darkmode.js) ──────
  // If dark mode patch is loaded, it calls renderWeightChart after toggling.
  // We hook into that by wrapping it here, or by observing the attribute.
  const observer = new MutationObserver(() => {
    if (cutoffChart) renderCutoffChart();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  // ── 9. INIT ───────────────────────────────────────────────────────────────
  // Defer until Chart.js is confirmed ready
  if (typeof Chart !== 'undefined') {
    renderCutoffChart();
  } else {
    window.addEventListener('load', renderCutoffChart);
  }

})();
