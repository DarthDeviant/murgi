/* ─────────────────────────────────────────────────────────────────────
   patch.js  —  CEE Prep Hub · Cutoffs tab
   Drop this file next to cee_prep_hub.html and add before </body>:
     <script src="patch.js"></script>
   ───────────────────────────────────────────────────────────────────── */

(function () {

  /* ── 1. STYLES ─────────────────────────────────────────────────── */
  const css = `
    /* NAV LINK */
    .nav-links li a[href="#cutoffs"] { }

    /* CUTOFFS SECTION CARD */
    #cutoffs { margin-bottom: 24px; }

    /* CAT TOGGLE (UR / OBC) */
    .co-cat-bar {
      display: flex;
      gap: 4px;
      background: var(--bg);
      padding: 3px;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border);
    }
    .co-cat-btn {
      padding: 5px 14px;
      border: none;
      background: transparent;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all .15s;
    }
    .co-cat-btn.active {
      background: var(--surface);
      color: var(--text-primary);
      box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }

    /* COLLEGE FILTER PILLS */
    .co-inst-bar { display:flex; gap:8px; flex-wrap:wrap; }
    .co-inst-btn {
      padding: 5px 14px;
      border-radius: 20px;
      border: 1px solid var(--border);
      background: transparent;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      color: var(--text-secondary);
      transition: all .15s;
    }
    .co-inst-btn:hover { border-color: var(--text-tertiary); color: var(--text-primary); }
    .co-inst-btn.on-aec { background: #E6F1FB; color: #0C447C; border-color: #378ADD; }
    .co-inst-btn.on-jec { background: #E1F5EE; color: #085041; border-color: #1D9E75; }

    /* SUMMARY STRIP */
    .co-stat-strip {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1px;
      background: var(--border-light);
      border-top: 1px solid var(--border-light);
      border-bottom: 1px solid var(--border-light);
    }
    .co-stat-item {
      background: var(--surface);
      padding: 14px 18px;
    }
    .co-stat-label {
      font-size: 11px;
      color: var(--text-tertiary);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: .05em;
      margin-bottom: 4px;
    }
    .co-stat-val {
      font-family: 'DM Serif Display', serif;
      font-size: 20px;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }
    .co-stat-sub { font-size: 11px; color: var(--text-secondary); margin-top: 2px; }

    /* CHART */
    .co-chart-wrap { padding: 20px 22px; position: relative; }

    /* TABLE */
    .co-table-wrap { overflow-x: auto; }
    .co-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .co-table th {
      text-align: left;
      padding: 9px 14px;
      border-bottom: 1px solid var(--border);
      font-size: 11px;
      font-weight: 600;
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: .06em;
      background: var(--bg);
      white-space: nowrap;
    }
    .co-table td {
      padding: 10px 14px;
      border-bottom: .5px solid var(--border-light);
      vertical-align: middle;
    }
    .co-table tr:last-child td { border-bottom: none; }
    .co-table tbody tr:hover td { background: var(--bg); }

    /* BADGES */
    .co-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 9px;
      border-radius: 20px;
    }
    .co-badge-aec { background: #E6F1FB; color: #185FA5; }
    .co-badge-jec { background: #E1F5EE; color: #0F6E56; }

    /* DIFFICULTY CHIPS */
    .co-chip {
      display: inline-block;
      font-size: 11px;
      font-weight: 500;
      padding: 2px 8px;
      border-radius: var(--radius-sm);
    }
    .co-chip-hard   { background: #FCEBEB; color: #791F1F; }
    .co-chip-medium { background: #FAEEDA; color: #633806; }
    .co-chip-easy   { background: #EAF3DE; color: #27500A; }

    /* RANK CELL */
    .co-rank { font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 13px; }
    .co-marks { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-secondary); }
    .co-na { color: var(--text-tertiary); font-size: 12px; }

    /* LEGEND */
    .co-legend {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      font-size: 12px;
      color: var(--text-secondary);
      margin-bottom: 10px;
      padding: 0 22px;
    }
    .co-leg-sq {
      display: inline-block;
      width: 10px; height: 10px;
      border-radius: 2px;
      margin-right: 4px;
      vertical-align: middle;
    }

    /* DISCLAIMER */
    .co-note {
      font-size: 12px;
      color: var(--text-tertiary);
      padding: 14px 22px;
      border-top: .5px solid var(--border-light);
      line-height: 1.6;
    }
  `;
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);


  /* ── 2. DATA (AEC + JEC only, excluding 5% reservation) ─────────── */
  const CUTOFF = {
    aec: {
      label: 'AEC',
      branches: {
        'CSE':  { ur: [80,  271], obc: [90,  261] },
        'E&TE': { ur: [188, 229], obc: [456, 189] },
        'EE':   { ur: [366, 198], obc: [697, 167] },
        'CE':   { ur: [414, 193], obc: [895, 153] },
        'ME':   { ur: [411, 194], obc: [861, 155] },
        'IE':   { ur: [612, 174], obc: [1168,127] },
        'IPE':  { ur: [753, 163], obc: [1340,130] },
      }
    },
    jec: {
      label: 'JEC',
      branches: {
        'CSE':  { ur: [223, 221], obc: [477, 187] },
        'EE':   { ur: [583, 176], obc: [1054,143] },
        'ME':   { ur: [745, 164], obc: [1255,133] },
        'CE':   { ur: [720, 166], obc: [1069,142] },
        'IE':   { ur: [886, 155], obc: [2310,100] },
      }
    }
  };

  const INST_COLORS = { aec: '#378ADD', jec: '#1D9E75' };
  const BRANCH_ORDER = ['CSE','E&TE','EE','CE','ME','IE','IPE'];

  /* ── 3. STATE ───────────────────────────────────────────────────── */
  let coCat  = 'ur';            // 'ur' | 'obc'
  let coInst = ['aec', 'jec']; // visible colleges
  let coChart = null;

  /* ── 4. BUILD SECTION HTML ──────────────────────────────────────── */
  const section = document.createElement('section');
  section.id = 'cutoffs';

  section.innerHTML = `
    <div class="section-card">

      <div class="section-header">
        <h2 class="section-title">College Cutoffs</h2>
        <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-end;">
          <div class="co-inst-bar">
            <button class="co-inst-btn on-aec" id="co-btn-aec" onclick="coToggleInst('aec',this)">AEC</button>
            <button class="co-inst-btn on-jec" id="co-btn-jec" onclick="coToggleInst('jec',this)">JEC</button>
          </div>
          <div class="co-cat-bar">
            <button class="co-cat-btn active" id="co-cat-ur"  onclick="coSetCat('ur')">General (UR)</button>
            <button class="co-cat-btn"         id="co-cat-obc" onclick="coSetCat('obc')">OBC / MOBC</button>
          </div>
        </div>
      </div>

      <div class="co-stat-strip" id="coStats"></div>

      <div class="co-legend" id="coLegend"></div>
      <div class="co-chart-wrap">
        <div id="coChartArea" style="position:relative;">
          <canvas id="coChart" role="img" aria-label="Rank cutoff comparison between AEC and JEC by branch"></canvas>
        </div>
      </div>

      <div class="co-table-wrap">
        <table class="co-table">
          <thead>
            <tr>
              <th>Branch</th>
              <th>College</th>
              <th>Closing rank</th>
              <th>Marks</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody id="coTableBody"></tbody>
        </table>
      </div>

      <p class="co-note">
        Cutoffs are from CEE official branch/caste distribution sheets · General (UR) and OBC/MOBC categories · Excluding 5% seats ·
        Difficulty: <strong>Hard</strong> &lt; rank 400 · <strong>Medium</strong> 400–1000 · <strong>Easy</strong> &gt; 1000
      </p>

    </div>
  `;

  /* Insert before closing </main> */
  const main = document.querySelector('main.main');
  main.appendChild(section);


  /* ── 5. ADD NAV LINK ────────────────────────────────────────────── */
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    const li = document.createElement('li');
    li.innerHTML = '<a href="#cutoffs">Cutoffs</a>';
    navLinks.appendChild(li);
  }


  /* ── 6. RENDER FUNCTIONS ────────────────────────────────────────── */
  function chip(rank) {
    if (!rank && rank !== 0) return '<span class="co-na">—</span>';
    if (rank < 400)  return `<span class="co-chip co-chip-hard">Hard</span>`;
    if (rank < 1000) return `<span class="co-chip co-chip-medium">Medium</span>`;
    return `<span class="co-chip co-chip-easy">Easy</span>`;
  }

  function renderStats() {
    const allRows = [];
    coInst.forEach(inst => {
      Object.entries(CUTOFF[inst].branches).forEach(([br, d]) => {
        const v = d[coCat];
        if (v) allRows.push({ inst, br, rank: v[0], marks: v[1] });
      });
    });
    if (!allRows.length) { document.getElementById('coStats').innerHTML = ''; return; }

    allRows.sort((a, b) => a.rank - b.rank);
    const hardest = allRows[0];
    const easiest = allRows[allRows.length - 1];

    const aecRows = allRows.filter(r => r.inst === 'aec');
    const jecRows = allRows.filter(r => r.inst === 'jec');

    const avgAec = aecRows.length ? Math.round(aecRows.reduce((s,r) => s + r.rank, 0) / aecRows.length) : null;
    const avgJec = jecRows.length ? Math.round(jecRows.reduce((s,r) => s + r.rank, 0) / jecRows.length) : null;

    document.getElementById('coStats').innerHTML = `
      <div class="co-stat-item">
        <div class="co-stat-label">Hardest branch</div>
        <div class="co-stat-val">${hardest.inst.toUpperCase()} ${hardest.br}</div>
        <div class="co-stat-sub">Rank ${hardest.rank.toLocaleString()} · ${hardest.marks} marks</div>
      </div>
      <div class="co-stat-item">
        <div class="co-stat-label">Easiest branch</div>
        <div class="co-stat-val">${easiest.inst.toUpperCase()} ${easiest.br}</div>
        <div class="co-stat-sub">Rank ${easiest.rank.toLocaleString()} · ${easiest.marks} marks</div>
      </div>
      ${avgAec !== null ? `<div class="co-stat-item">
        <div class="co-stat-label">AEC avg. rank</div>
        <div class="co-stat-val">${avgAec.toLocaleString()}</div>
        <div class="co-stat-sub">${coCat === 'ur' ? 'General' : 'OBC/MOBC'} · all branches</div>
      </div>` : ''}
      ${avgJec !== null ? `<div class="co-stat-item">
        <div class="co-stat-label">JEC avg. rank</div>
        <div class="co-stat-val">${avgJec.toLocaleString()}</div>
        <div class="co-stat-sub">${coCat === 'ur' ? 'General' : 'OBC/MOBC'} · all branches</div>
      </div>` : ''}
    `;
  }

  function renderTable() {
    const rows = [];
    coInst.forEach(inst => {
      Object.entries(CUTOFF[inst].branches).forEach(([br, d]) => {
        const v = d[coCat];
        rows.push({ inst, br, rank: v ? v[0] : null, marks: v ? v[1] : null });
      });
    });
    rows.sort((a, b) => (a.rank ?? 99999) - (b.rank ?? 99999));

    document.getElementById('coTableBody').innerHTML = rows.map(r => `
      <tr>
        <td style="font-weight:500">${r.br}</td>
        <td><span class="co-badge co-badge-${r.inst}">${CUTOFF[r.inst].label}</span></td>
        <td>${r.rank ? `<span class="co-rank">${r.rank.toLocaleString()}</span>` : '<span class="co-na">—</span>'}</td>
        <td>${r.marks ? `<span class="co-marks">${r.marks}</span>` : '<span class="co-na">—</span>'}</td>
        <td>${chip(r.rank)}</td>
      </tr>
    `).join('');
  }

  function renderChart() {
    const h = Math.max(280, BRANCH_ORDER.length * 48 + 70);
    const area = document.getElementById('coChartArea');
    area.style.height = h + 'px';

    const datasets = coInst.map(inst => ({
      label: CUTOFF[inst].label,
      data: BRANCH_ORDER.map(br => {
        const b = CUTOFF[inst].branches[br];
        return b && b[coCat] ? b[coCat][0] : null;
      }),
      backgroundColor: INST_COLORS[inst],
      borderRadius: 3,
      borderSkipped: false,
    }));

    if (coChart) { coChart.destroy(); coChart = null; }
    coChart = new Chart(document.getElementById('coChart'), {
      type: 'bar',
      data: { labels: BRANCH_ORDER, datasets },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1A1916',
            callbacks: {
              label: ctx => ctx.raw ? ` ${CUTOFF[coInst[ctx.datasetIndex] || Object.keys(CUTOFF)[ctx.datasetIndex]]?.label || ''} · Rank ${ctx.raw.toLocaleString()}` : ' No data'
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: 'rgba(128,128,128,0.08)' },
            ticks: {
              font: { family: "'JetBrains Mono', monospace", size: 11 },
              color: '#A8A69F',
              callback: v => v.toLocaleString()
            }
          },
          y: {
            grid: { display: false },
            ticks: {
              font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
              color: '#1A1916'
            }
          }
        }
      }
    });

    /* custom legend */
    document.getElementById('coLegend').innerHTML = coInst.map(inst =>
      `<span><span class="co-leg-sq" style="background:${INST_COLORS[inst]}"></span>${CUTOFF[inst].label}</span>`
    ).join('');
  }

  function renderAll() {
    renderStats();
    renderChart();
    renderTable();
  }


  /* ── 7. GLOBAL HANDLERS (called from inline onclick) ────────────── */
  window.coSetCat = function (cat) {
    coCat = cat;
    document.getElementById('co-cat-ur').classList.toggle('active', cat === 'ur');
    document.getElementById('co-cat-obc').classList.toggle('active', cat === 'obc');
    renderAll();
  };

  window.coToggleInst = function (inst, btn) {
    const idx = coInst.indexOf(inst);
    if (idx === -1) {
      coInst.push(inst);
    } else {
      if (coInst.length === 1) return; /* keep at least one */
      coInst.splice(idx, 1);
    }
    const onClass = `on-${inst}`;
    btn.classList.toggle(onClass, coInst.includes(inst));
    renderAll();
  };


  /* ── 8. INIT ────────────────────────────────────────────────────── */
  /* Wait for Chart.js (already loaded by the host page) */
  function init() {
    if (typeof Chart === 'undefined') {
      setTimeout(init, 50);
      return;
    }
    renderAll();
  }
  init();

})();
