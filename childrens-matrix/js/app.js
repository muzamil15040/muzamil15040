const form = document.getElementById('child-form');
const formPanel = document.getElementById('form-panel');
const loadingEl = document.getElementById('loading');
const resultsEl = document.getElementById('results');
const formError = document.getElementById('form-error');
const loadingSteps = [...document.querySelectorAll('#loading-steps li')];

let state = null;
let selectedId = null;

const SECTION_ORDER = [
  ['corePersonality', 'Core Personality', 'core'],
  ['expression', 'How They Show Up', 'expression'],
  ['talents', 'Natural Talents', 'talents'],
  ['learning', 'Learning Tendencies', 'learning'],
  ['communication', 'Communication', 'communication'],
  ['emotions', 'Emotional Expression', 'emotions'],
  ['creativity', 'Creativity & Imagination', 'creativity'],
  ['social', 'Social Interaction', 'social'],
  ['motivation', 'Motivation', 'motivation'],
  ['family', 'Family Dynamic', 'family'],
  ['purpose', 'Inner Direction', 'purpose'],
  ['growth', 'Developmental Growth', 'growth'],
];

function showError(msg) {
  formError.hidden = !msg;
  formError.textContent = msg || '';
}

function setLoading(active) {
  loadingEl.hidden = !active;
  if (!active) {
    loadingSteps.forEach((li) => li.classList.remove('active', 'done'));
    return;
  }
  loadingSteps.forEach((li, i) => {
    li.classList.toggle('active', i === 0);
    li.classList.toggle('done', false);
  });
}

async function animateLoading() {
  for (let i = 0; i < loadingSteps.length; i += 1) {
    loadingSteps.forEach((li, idx) => {
      li.classList.toggle('done', idx < i);
      li.classList.toggle('active', idx === i);
    });
    await new Promise((r) => setTimeout(r, 280));
  }
}

function octagonPoints(octagon) {
  return octagon.map((p) => `${p.x},${p.y}`).join(' ');
}

function connectedKeys(chart, chartKey) {
  const set = new Set([chartKey]);
  for (const [a, b] of chart.connections) {
    if (a === chartKey) set.add(b);
    if (b === chartKey) set.add(a);
  }
  return set;
}

function renderChart(chart) {
  const root = document.getElementById('chart-root');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lines = chart.connections
    .map(([a, b], idx) => {
      const pa = chart.nodes.find((n) => n.chartKey === a);
      const pb = chart.nodes.find((n) => n.chartKey === b);
      if (!pa || !pb) return '';
      return `<line class="conn" data-conn="${idx}" data-a="${a}" data-b="${b}" x1="${pa.x}" y1="${pa.y}" x2="${pb.x}" y2="${pb.y}" />`;
    })
    .join('');

  const nodes = chart.nodes
    .map((n) => {
      const labelY = n.y + n.radius + 14;
      const valueClass = n.tier === 'support' ? 'node-value is-support' : 'node-value';
      const circleClass = n.tier === 'center' ? 'node-circle is-center' : 'node-circle';
      const label = n.positionId
        ? `<text class="node-label" x="${n.x}" y="${labelY}">${escapeXml(shortLabel(n.label))}</text>`
        : '';
      return `
        <g class="node" data-id="${n.id}" data-position="${n.positionId || ''}">
          <circle class="${circleClass}" cx="${n.x}" cy="${n.y}" r="${n.radius}" fill="${n.color}" />
          <text class="${valueClass}" x="${n.x}" y="${n.y}">${n.energy}</text>
          ${label}
          <circle class="node-hit" cx="${n.x}" cy="${n.y}" r="${n.radius + 8}"
            tabindex="0" role="button"
            aria-label="Energy ${n.energy}${n.positionId ? ', ' + n.label : ''}"></circle>
        </g>`;
    })
    .join('');

  root.innerHTML = `
    <svg viewBox="${chart.viewBox}" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
      <g class="geometry">
        <polygon class="matrix-frame" points="${octagonPoints(chart.octagon)}"></polygon>
        <rect class="matrix-frame" x="163.63" y="126.14" width="340.16" height="340.16"></rect>
        <rect class="matrix-frame" x="227.87" y="127.54" width="340.16" height="340.16"
          transform="translate(-158.13 367.16) rotate(-45)"></rect>
        <line class="matrix-axis" x1="333.7" y1="27.76" x2="333.7" y2="564.68"></line>
        <line class="matrix-axis" x1="65.24" y1="296.22" x2="602.17" y2="296.22"></line>
        <line class="matrix-diag-a" x1="442" y1="405" x2="226" y2="189"></line>
        <line class="matrix-diag-b" x1="442" y1="189" x2="226" y2="405"></line>
      </g>
      <g class="connections">${lines}</g>
      <g class="nodes">${nodes}</g>
    </svg>`;

  if (!reduceMotion) {
    root.querySelectorAll('.node-circle').forEach((el, i) => {
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.transition = `opacity 320ms ease ${80 + i * 18}ms`;
        el.style.opacity = '1';
      });
    });
  }

  root.querySelectorAll('.node').forEach((g) => {
    const activate = () => selectNode(g.dataset.id);
    g.querySelector('.node-hit').addEventListener('click', activate);
    g.querySelector('.node-hit').addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        activate();
      }
    });
    g.querySelector('.node-hit').addEventListener('mouseenter', () => highlight(g.dataset.id, true));
    g.querySelector('.node-hit').addEventListener('mouseleave', () => highlight(g.dataset.id, false));
  });

  const badge = document.getElementById('purpose-badge');
  if (chart.purposeBadge) {
    badge.hidden = false;
    badge.textContent = `${chart.purposeBadge.title}: ${chart.purposeBadge.energy}`;
  } else {
    badge.hidden = true;
  }
}

function shortLabel(label) {
  return label.replace(' & Imagination', '').replace(' Tendencies', '').replace(' Interaction', '').replace(' Expression', '').replace(' Personality', '').replace(' Dynamic', '').replace(' Developmental ', '');
}

function escapeXml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlight(chartKey, on) {
  if (!state) return;
  const lit = connectedKeys(state.chart, chartKey);
  document.querySelectorAll('.conn').forEach((line) => {
    const a = line.getAttribute('data-a');
    const b = line.getAttribute('data-b');
    const active = on && lit.has(a) && lit.has(b);
    line.classList.toggle('lit', active || (selectedId && lit.has(a) && lit.has(b) && (a === selectedId || b === selectedId)));
  });
  document.querySelectorAll('.node-circle').forEach((c) => {
    const id = c.parentElement.dataset.id;
    c.classList.toggle('is-active', id === chartKey || id === selectedId);
  });
}

function selectNode(chartKey) {
  selectedId = chartKey;
  highlight(chartKey, true);
  const node = state.chart.nodes.find((n) => n.chartKey === chartKey);
  const empty = document.querySelector('.detail-empty');
  const body = document.getElementById('detail-body');
  if (!node?.positionId) {
    empty.hidden = false;
    empty.textContent = `Energy ${node?.energy ?? ''} — supporting chart point.`;
    body.hidden = true;
    return;
  }
  const detail = state.details[node.positionId];
  empty.hidden = true;
  body.hidden = false;
  body.innerHTML = `
    <div class="energy-chip"><strong>${detail.energy}</strong> ${escapeHtml(detail.name)}</div>
    <h3>${escapeHtml(detail.title)}</h3>
    <div class="detail-block"><h4>Symbolic meaning</h4><p>${escapeHtml(detail.symbolicMeaning)}</p></div>
    <div class="detail-block"><h4>Positive expression</h4><ul>${detail.positiveExpression.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
    <div class="detail-block"><h4>Possible shadow expression</h4><ul>${detail.shadowExpression.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
    <div class="detail-block"><h4>What parents may observe</h4><p>${escapeHtml(detail.parentsMayObserve)}</p></div>
    <div class="detail-block"><h4>Supportive ideas</h4><ul>${detail.supportiveIdeas.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}</ul></div>
  `;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderResults(data) {
  state = data;
  selectedId = null;
  resultsEl.hidden = false;
  formPanel.hidden = true;

  document.getElementById('result-name').textContent = `${data.child.name}'s Destiny Matrix`;
  document.getElementById('result-meta').textContent =
    `Age band ${data.child.ageBand} · methodology ${data.methodologyVersion} · chart ${data.chartVersion}`;

  const core = data.positions.find((p) => p.id === 'core');
  const coreDetail = data.details.core;
  document.getElementById('core-pill').innerHTML =
    `<strong>${core.energy}</strong><span>${escapeHtml(coreDetail.name)}</span>`;

  renderChart(data.chart);

  const overview = document.getElementById('overview-text');
  const readingError = document.getElementById('reading-error');
  if (data.reading) {
    overview.textContent = data.reading.overview;
    readingError.hidden = true;
  } else {
    overview.textContent = '';
    readingError.hidden = false;
    readingError.textContent = data.readingError || 'Interpretation unavailable.';
  }

  const accordion = document.getElementById('accordion');
  accordion.innerHTML = '';
  if (data.reading) {
    for (const [key, title, posId] of SECTION_ORDER) {
      const text = data.reading[key];
      if (!text) continue;
      const energy = data.positions.find((p) => p.id === posId)?.energy;
      const color = data.chart.nodes.find((n) => n.positionId === posId)?.color || '#d4af5a';
      const item = document.createElement('div');
      item.className = 'acc-item';
      item.innerHTML = `
        <button type="button" class="acc-btn" aria-expanded="false">
          <span class="num" style="background:${color}">${energy ?? ''}</span>
          <span class="title">${escapeHtml(title)}</span>
          <span class="chev">+</span>
        </button>
        <div class="acc-body">${escapeHtml(text)}</div>`;
      item.querySelector('.acc-btn').addEventListener('click', () => {
        const open = item.classList.contains('open');
        accordion.querySelectorAll('.acc-item').forEach((el) => {
          el.classList.remove('open');
          el.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
          el.querySelector('.chev').textContent = '+';
        });
        if (!open) {
          item.classList.add('open');
          item.querySelector('.acc-btn').setAttribute('aria-expanded', 'true');
          item.querySelector('.chev').textContent = '−';
        }
      });
      accordion.appendChild(item);
    }

    // Areas for growth as extra accordion items
    (data.reading.growthAreas || []).forEach((area, idx) => {
      const item = document.createElement('div');
      item.className = 'acc-item';
      const color = '#9bb0d4';
      item.innerHTML = `
        <button type="button" class="acc-btn" aria-expanded="false">
          <span class="num" style="background:${color}">${area.energy}</span>
          <span class="title">${escapeHtml(area.title)}</span>
          <span class="chev">+</span>
        </button>
        <div class="acc-body">${escapeHtml(area.text)}</div>`;
      item.querySelector('.acc-btn').addEventListener('click', () => {
        const open = item.classList.contains('open');
        accordion.querySelectorAll('.acc-item').forEach((el) => {
          el.classList.remove('open');
          el.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
          el.querySelector('.chev').textContent = '+';
        });
        if (!open) {
          item.classList.add('open');
          item.querySelector('.acc-btn').setAttribute('aria-expanded', 'true');
          item.querySelector('.chev').textContent = '−';
        }
      });
      accordion.appendChild(item);
    });
  }

  const support = document.getElementById('parent-support');
  support.innerHTML = '';
  (data.reading?.parentSupport || []).forEach((line) => {
    const li = document.createElement('li');
    li.textContent = line;
    support.appendChild(li);
  });

  const summary = document.getElementById('final-summary');
  summary.innerHTML = '';
  if (data.reading?.finalSummary) {
    const s = data.reading.finalSummary;
    const blocks = [
      ['Core theme', s.coreTheme],
      ['Natural strength', s.strength],
      ['Area to explore', s.growthArea],
      ['Supportive environment', s.supportiveEnvironment],
      ['Reflection', s.reflection, true],
    ];
    for (const [title, text, wide] of blocks) {
      const card = document.createElement('div');
      card.className = wide ? 'summary-card wide' : 'summary-card';
      card.innerHTML = `<h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>`;
      summary.appendChild(card);
    }
  }

  // Auto-select core
  selectNode('epoint');
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  showError('');
  const name = document.getElementById('child-name').value;
  const birthDate = document.getElementById('child-dob').value;
  const guardianName = document.getElementById('guardian-name').value;

  resultsEl.hidden = true;
  setLoading(true);
  const anim = animateLoading();

  try {
    const res = await fetch('/api/children-matrix/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        child: { name, birthDate },
        guardianName,
      }),
    });
    const data = await res.json();
    await anim;
    setLoading(false);
    if (!res.ok || !data.ok) {
      formPanel.hidden = false;
      showError(data.error || 'We couldn\'t calculate the child\'s matrix. Please check the birth date and try again.');
      return;
    }
    renderResults(data);
  } catch (err) {
    await anim;
    setLoading(false);
    formPanel.hidden = false;
    showError('We couldn\'t calculate the child\'s matrix. Please check the birth date and try again.');
  }
});

document.getElementById('reset-btn').addEventListener('click', () => {
  state = null;
  resultsEl.hidden = true;
  formPanel.hidden = false;
  showError('');
});

document.getElementById('print-btn').addEventListener('click', () => window.print());

document.getElementById('share-btn').addEventListener('click', async () => {
  if (!state) return;
  const core = state.positions.find((p) => p.id === 'core');
  const talents = state.positions.find((p) => p.id === 'talents');
  const learning = state.positions.find((p) => p.id === 'learning');
  const text = [
    `Children's Destiny Matrix — ${state.child.name}`,
    `Core Energy: ${core.energy}`,
    `Natural Talent Energy: ${talents.energy}`,
    `Learning Energy: ${learning.energy}`,
  ].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    const btn = document.getElementById('share-btn');
    const prev = btn.textContent;
    btn.textContent = 'Copied (no DOB)';
    setTimeout(() => { btn.textContent = prev; }, 1600);
  } catch {
    alert(text);
  }
});
