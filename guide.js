// ═══════════════════════════════════════════════════════════════
// GUIDE.JS — Troubleshoot panel · Guide engine · AI generator
//
// HOW TO EDIT TROUBLESHOOTING PATHS:
//   1. Find tsData array below
//   2. Each object = one problem button in the panel
//   3. Each step needs:
//      - target: CSS selector of element to highlight
//      - inst: instruction text shown to technician (HTML ok)
//
// COMMON SELECTORS:
//   #mDevice        → Device menu
//   #mComm          → Communication menu
//   #ddAdvParams    → Advanced Parameters menu item
//   #ddFalseEcho    → False Echo Mapping menu item
//   #ddActivations  → Devices Activations menu item
//   #tbLoad         → Load from Vessel toolbar button
//   #tbWizard       → Wizard toolbar button
//   #tbEcho         → Echo Curve toolbar button
//   #apDamp         → Output Dampening Power field
//   #apMPN          → MPN Rate field
//   #apMFill        → Max Fill field
//   #apMEmpty       → Max Empty field
//   #apAutoBeam     → Auto Beam Selection checkbox
//   #btnReset       → Reset button in Activations
//   #feAction       → False Echo action dropdown
//   #wizFD          → Full calibration distance field
//   #wizNext        → Wizard Next/Finish button
//   .title-bar      → Title bar (for Windows OS steps)
//   .toolbar        → Toolbar area
//   #menuBar        → Menu bar (fallback)
// ═══════════════════════════════════════════════════════════════

let activeGuide = null;
let guideIdx    = 0;
let tsMini      = false;
let aiResultData = null;

// ─────────────────────────────────────────────────────────────
// TROUBLESHOOTING PATHS — ADD / EDIT HERE
// ─────────────────────────────────────────────────────────────
let tsData = [

  // ── PROBLEM 1 ─────────────────────────────────────────────
  {
    id: 1,
    title: "SNR Reading is 0",
    steps: [
      { target: "#mDevice",
        inst: "Click the <strong>Device</strong> menu in the top menu bar." },
      { target: "#ddAdvParams",
        inst: "Select <strong>Advanced Parameters…</strong> (F3) from the Device menu." },
      { target: "#apDamp",
        inst: "Change <strong>Output Dampening Power</strong> to <strong>420</strong> seconds." },
      { target: "#apMPN",
        inst: "Change <strong>MPN Rate</strong> to <strong>7</strong> mass/hour." },
      { target: "#apMFill",
        inst: "Change <strong>Max Fill</strong> to <strong>7</strong> and <strong>Max Empty</strong> to <strong>8</strong>." },
      { target: "#mAdvanced .mbtn-p",
        inst: "Click <strong>Upload All</strong> to push parameters to the sensor." },
      { target: "#mDevice",
        inst: "Go back to the <strong>Device</strong> menu." },
      { target: "#ddFalseEcho",
        inst: "Select <strong>Device False Echo Mapping…</strong>" },
      { target: "#feAction",
        inst: "Choose <strong>Reset Mapping</strong> from the dropdown and click <strong>Execute</strong>. Wait while it calculates." },
      { target: "#tbLoad",
        inst: "Click <strong>Load from Vessel</strong> in the toolbar. Repeat once per minute while monitoring SNR." }
    ]
  },

  // ── PROBLEM 2 ─────────────────────────────────────────────
  {
    id: 2,
    title: "Sensor Reading Full (Wrong Level)",
    steps: [
      { target: "#tbWizard",
        inst: "Click the <strong>Wizard</strong> button in the toolbar." },
      { target: "#wizBody",
        inst: "Click <strong>Next</strong> through Steps 1–3 to reach Step 4/4 — <strong>Full/Empty Calibration</strong>." },
      { target: "#wizFD",
        inst: "Change the <strong>Distance (Top)</strong> field for Full Calibration to <strong>1.64 feet</strong>. The sensor auto-calculates the rest." },
      { target: "#wizNext",
        inst: "Click <strong>Finish</strong> to apply the calibration." },
      { target: "#tbLoad",
        inst: "Click <strong>Load from Vessel</strong> to confirm the level has corrected." }
    ]
  },

  // ── PROBLEM 3 ─────────────────────────────────────────────
  {
    id: 3,
    title: "Sensor Reset After Mapping Clear",
    steps: [
      { target: "#mDevice",
        inst: "Click the <strong>Device</strong> menu at the top." },
      { target: "#ddActivations",
        inst: "Select <strong>Devices Activations…</strong> from the Device menu." },
      { target: "#btnReset",
        inst: "Click <strong>Reset</strong> — do <em>NOT</em> select Reset to Factory. This clears the echo map while keeping your parameters." },
      { target: "#tbLoad",
        inst: "Wait for the temperature alert, then click <strong>Load from Vessel</strong> to confirm sensor is back online at ~20 mA output." }
    ]
  },

  // ── PROBLEM 4 ─────────────────────────────────────────────
  {
    id: 4,
    title: "Controller Goes to Sleep",
    steps: [
      { target: ".title-bar",
        inst: "On the Windows desktop, click the <strong>Start button</strong> (bottom-left corner of the screen)." },
      { target: ".title-bar",
        inst: "Type <strong>sleep</strong> in the search box. Open <strong>Power, Sleep &amp; Battery Settings</strong>." },
      { target: ".title-bar",
        inst: "Expand <strong>Screen, sleep, and hibernation timeouts</strong>." },
      { target: ".title-bar",
        inst: "Set <strong>'Make my device sleep after'</strong> to <strong>Never</strong>. The screen turning off is fine — only the sleep setting causes disconnects." }
    ]
  },

  // ── PROBLEM 5 ─────────────────────────────────────────────
  {
    id: 5,
    title: "Auto Beam Selection Issues",
    steps: [
      { target: "#mDevice",
        inst: "Click the <strong>Device</strong> menu." },
      { target: "#ddAdvParams",
        inst: "Open <strong>Advanced Parameters…</strong>" },
      { target: "#mAdvanced .mtab:nth-child(3)",
        inst: "Click the <strong>Beams</strong> tab inside Advanced Parameters." },
      { target: "#apAutoBeam",
        inst: "Verify all beam checkboxes at the top are checked. Then <strong>uncheck Auto Beam Selection</strong> at the bottom." },
      { target: "#mAdvanced .mbtn-p",
        inst: "Click <strong>Upload All</strong> to apply the change." },
      { target: "#tbLoad",
        inst: "Click <strong>Load from Vessel</strong> to confirm correct readings." }
    ]
  }

  // ── ADD MORE PROBLEMS HERE ─────────────────────────────────
  // Copy the block below, increment id, fill in title and steps:
  //
  // ,{
  //   id: 6,
  //   title: "Your Problem Title Here",
  //   steps: [
  //     { target: "#mDevice", inst: "Step 1 instruction." },
  //     { target: "#tbLoad",  inst: "Step 2 instruction." }
  //   ]
  // }
];


// ─────────────────────────────────────────────────────────────
// TROUBLESHOOT PANEL
// ─────────────────────────────────────────────────────────────
function renderTS() {
  const el = document.getElementById('tsList');
  if (!el) return;
  el.innerHTML = '';
  if (!tsData.length) {
    el.innerHTML = '<div class="ts-empty">No problems configured.<br>Click ✎ to add.</div>';
    return;
  }
  tsData.forEach(p => {
    const b = document.createElement('button');
    b.className = 'prob-btn';
    b.innerHTML = '⚡ ' + p.title;
    b.onclick = () => startGuide(p);
    el.appendChild(b);
  });
}

function toggleTS() {
  tsMini = !tsMini;
  document.getElementById('tsBody').classList.toggle('mini', tsMini);
  document.getElementById('tsMin').textContent = tsMini ? '+' : '−';
}

// Drag troubleshoot panel
(function initTSDrag() {
  const p = document.getElementById('tsPanel');
  const h = document.getElementById('tsHdr');
  if (!p || !h) return;
  let drag = false, sx, sy, ol, ot;
  h.addEventListener('mousedown', e => {
    if (e.target.closest('.ts-hbtn')) return;
    drag = true; sx = e.clientX; sy = e.clientY;
    const r = p.getBoundingClientRect(); ol = r.left; ot = r.top;
    p.style.right = 'auto'; p.style.bottom = 'auto';
    p.style.left = ol + 'px'; p.style.top = ot + 'px';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    p.style.left = (ol + e.clientX - sx) + 'px';
    p.style.top  = (ot + e.clientY - sy) + 'px';
  });
  document.addEventListener('mouseup', () => drag = false);
})();


// ─────────────────────────────────────────────────────────────
// GUIDE PANEL — draggable, always on top
// ─────────────────────────────────────────────────────────────
(function initGuideDrag() {
  const p = document.getElementById('gPanel');
  const h = document.getElementById('gPanelHdr');
  if (!p || !h) return;
  let drag = false, sx, sy, ol, ot;
  h.addEventListener('mousedown', e => {
    if (e.target.closest('.gp-x')) return;
    drag = true; sx = e.clientX; sy = e.clientY;
    const r = p.getBoundingClientRect(); ol = r.left; ot = r.top;
    p.style.left = ol + 'px'; p.style.top = ot + 'px'; p.style.bottom = 'auto';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    p.style.left = (ol + e.clientX - sx) + 'px';
    p.style.top  = (ot + e.clientY - sy) + 'px';
    if (activeGuide) posCircle(activeGuide.steps[guideIdx].target);
  });
  document.addEventListener('mouseup', () => drag = false);
})();


// ─────────────────────────────────────────────────────────────
// GUIDE ENGINE
// ─────────────────────────────────────────────────────────────
function startGuide(prob) {
  activeGuide = prob;
  guideIdx    = 0;
  document.getElementById('gPanel').classList.remove('hidden');
  document.getElementById('hlCircle').classList.remove('hidden');
  document.getElementById('gProb').textContent = prob.title;
  renderGuide();
}

function renderGuide() {
  if (!activeGuide) return;
  const s   = activeGuide.steps;
  const st  = s[guideIdx];
  const tot = s.length;
  document.getElementById('gTitle').textContent = 'Step ' + (guideIdx + 1) + ' of ' + tot;
  document.getElementById('gCtr').textContent   = (guideIdx + 1) + ' / ' + tot;
  document.getElementById('gInst').innerHTML    = st.inst;
  const prev = document.getElementById('gPrev');
  prev.disabled    = guideIdx === 0;
  prev.style.opacity = guideIdx === 0 ? '0.4' : '1';
  const next = document.getElementById('gNext');
  if (guideIdx === tot - 1) {
    next.textContent = 'Done ✓';
    next.onclick = endGuide;
  } else {
    next.textContent = 'Next ▶';
    next.onclick = () => guideNav(1);
  }
  posCircle(st.target);
}

function guideNav(d) {
  if (!activeGuide) return;
  guideIdx = Math.max(0, Math.min(activeGuide.steps.length - 1, guideIdx + d));
  renderGuide();
}

function endGuide() {
  activeGuide = null;
  document.getElementById('gPanel').classList.add('hidden');
  document.getElementById('hlCircle').classList.add('hidden');
  toast('Walkthrough complete ✓');
}


// ─────────────────────────────────────────────────────────────
// PULSING CIRCLE POSITIONING
// ─────────────────────────────────────────────────────────────
function posCircle(sel) {
  const circle = document.getElementById('hlCircle');
  let el = null;
  try { el = document.querySelector(sel); } catch(e) {}
  // fallback: try partial selectors
  if (!el && sel) {
    const parts = sel.split(' ');
    for (let i = 1; i < parts.length; i++) {
      try { el = document.querySelector(parts.slice(i).join(' ')); if (el) break; } catch(e) {}
    }
  }
  if (!el) el = document.getElementById('menuBar');
  if (!el) { circle.classList.add('hidden'); return; }
  const r    = el.getBoundingClientRect();
  const pad  = 10;
  const size = Math.max(r.width + pad * 2, r.height + pad * 2, 40);
  circle.classList.remove('hidden');
  circle.style.width  = size + 'px';
  circle.style.height = size + 'px';
  circle.style.left   = (r.left + r.width  / 2 - size / 2) + 'px';
  circle.style.top    = (r.top  + r.height / 2 - size / 2) + 'px';
}

document.addEventListener('scroll', () => {
  if (activeGuide) posCircle(activeGuide.steps[guideIdx].target);
}, true);

window.addEventListener('resize', () => {
  if (activeGuide) posCircle(activeGuide.steps[guideIdx].target);
});


// ─────────────────────────────────────────────────────────────
// ADMIN PANEL
// ─────────────────────────────────────────────────────────────
function openAdmin() { renderAdmin(); openM('mAdmin'); }

function renderAdmin() {
  const b = document.getElementById('adminBody');
  b.innerHTML = `
  <div class="ai-gen-panel">
    <div class="ai-gen-title">🤖 AI Path Generator</div>
    <div class="ai-gen-desc">
      Paste any rough text — a support email, call transcript, Slack thread, or field notes —
      and AI will extract the troubleshooting steps and output a ready-to-import path.
    </div>
    <textarea class="ai-gen-textarea" id="aiInputText"
      placeholder="Paste your text here. Examples:&#10;• Support email describing a problem and fix&#10;• Call transcript or chat log&#10;• Handwritten field notes"></textarea>
    <button class="ai-gen-btn" id="aiGenBtn" onclick="runAIGenerate()">
      <svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L8.5 5 L13 5 L9.5 7.5 L11 12 L7 9 L3 12 L4.5 7.5 L1 5 L5.5 5 Z" fill="white"/></svg>
      Generate Troubleshooting Path
    </button>
    <div class="ai-gen-status" id="aiStatus"></div>
    <div class="ai-result-wrap" id="aiResultWrap">
      <div class="ai-result-title">Generated JSON — review before importing:</div>
      <div class="ai-result-preview" id="aiResultPreview"></div>
      <button class="ai-import-btn" onclick="importAIResult()">✓ Import into Troubleshoot Panel</button>
    </div>
  </div>
  <p style="font-size:12px;color:#555;margin-bottom:12px">
    Or edit paths manually below. Each step needs a <strong>CSS selector</strong>
    (see comments at top of guide.js) and an <strong>instruction</strong>.
  </p>`;

  tsData.forEach((p, pi) => {
    const d = document.createElement('div');
    d.className = 'adm-block';
    d.innerHTML = `
      <div class="adm-hdr">
        <input class="adm-tin" type="text" value="${esc(p.title)}"
          oninput="tsData[${pi}].title=this.value;renderTS()">
        <button class="adm-del" onclick="delProb(${pi})">🗑 Delete</button>
      </div>
      <div id="adS_${pi}"></div>
      <button class="adm-addstep" onclick="addStep(${pi})">+ Add Step</button>`;
    b.appendChild(d);
    renderAdminSteps(pi);
  });
}

function renderAdminSteps(pi) {
  const c = document.getElementById('adS_' + pi);
  if (!c) return;
  c.innerHTML = '';
  tsData[pi].steps.forEach((s, si) => {
    const r = document.createElement('div');
    r.className = 'adm-srow';
    r.innerHTML = `
      <div class="adm-snum">${si + 1}</div>
      <div class="adm-sfields">
        <span class="adm-hint">CSS Selector — which element to highlight (e.g. #mDevice, #tbLoad):</span>
        <input class="adm-starget" type="text" value="${esc(s.target)}"
          oninput="tsData[${pi}].steps[${si}].target=this.value"
          placeholder="#id or .class">
        <span class="adm-hint">Instruction shown to technician (HTML allowed):</span>
        <textarea class="adm-sinst"
          oninput="tsData[${pi}].steps[${si}].inst=this.value">${esc(s.inst)}</textarea>
      </div>
      <button class="adm-sdel" onclick="delStep(${pi},${si})">✕</button>`;
    c.appendChild(r);
  });
}

function addProblem() {
  tsData.push({
    id: Date.now(),
    title: 'New Problem ' + (tsData.length + 1),
    steps: [{ target: '#mDevice', inst: 'Enter instruction here.' }]
  });
  renderAdmin();
  renderTS();
}

function addStep(pi) {
  tsData[pi].steps.push({ target: '', inst: 'Enter instruction here.' });
  renderAdminSteps(pi);
}

function delStep(pi, si) {
  tsData[pi].steps.splice(si, 1);
  renderAdminSteps(pi);
}

function delProb(pi) {
  if (confirm('Delete this problem and all its steps?')) {
    tsData.splice(pi, 1);
    renderAdmin();
    renderTS();
  }
}

function saveAdmin() {
  renderTS();
  closeM('mAdmin');
  toast('✓ Paths saved');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


// ─────────────────────────────────────────────────────────────
// AI PATH GENERATOR
// ─────────────────────────────────────────────────────────────
const selectorRef = `
AVAILABLE CSS SELECTORS FOR THIS SOFTWARE:
Menus: #mFile, #mComm, #mEdit, #mDevice, #mTools, #mHelp
Device menu items: #ddAdvParams (Advanced Parameters), #ddFalseEcho (False Echo Mapping), #ddActivations (Devices Activations)
Toolbar: #tbLevel, #tbLoad (Load from Vessel), #tbEcho (Echo Curve), #tbWizard (Wizard), #tbVDC (VDC)
Advanced Parameters Basic tab: #apDamp (Output Dampening Power), #apMPN (MPN Rate), #apMFill (Max Fill), #apMEmpty (Max Empty)
Advanced Parameters Advanced tab: #apAutoFE (Auto False Echoes)
Advanced Parameters Beams tab: #apAutoBeam (Auto Beam Selection checkbox)
Advanced Parameters tabs: #mAdvanced .mtab:nth-child(1) Basic, #mAdvanced .mtab:nth-child(2) Advanced, #mAdvanced .mtab:nth-child(3) Beams
Advanced Parameters Upload All button: #mAdvanced .mbtn-p
Device Activations modal: #btnReset (Reset button)
False Echo Mapping modal: #feAction (action dropdown)
Wizard: #wizBody, #wizFD (Full calibration distance), #wizNext (Next/Finish button)
General fallbacks: .title-bar (Windows OS steps), .toolbar (toolbar area), #menuBar (menu bar)
`.trim();

async function runAIGenerate() {
  const inputText = document.getElementById('aiInputText').value.trim();
  if (!inputText) { toast('Please paste some text first'); return; }

  const btn       = document.getElementById('aiGenBtn');
  const status    = document.getElementById('aiStatus');
  const resultWrap = document.getElementById('aiResultWrap');

  btn.disabled    = true;
  btn.textContent = '⏳ Generating...';
  status.className    = 'ai-gen-status loading';
  status.textContent  = 'Sending to AI — analyzing your text and mapping to software steps...';
  resultWrap.classList.remove('show');

  const systemPrompt = `You are an expert field service trainer for BinMaster 3D MultiVision level measurement sensors.
Read support text (emails, call transcripts, notes) and extract a structured troubleshooting path.

${selectorRef}

OUTPUT RULES — follow exactly:
1. Respond with ONLY valid JSON. No explanation, no markdown fences.
2. Output exactly ONE JSON object:
{"id":0,"title":"<problem symptom max 8 words>","steps":[{"target":"<CSS selector>","inst":"<instruction>"}]}
3. Use only selectors from the list above. Use .title-bar for Windows OS steps.
4. If opening a menu is required, make that its own step.
5. Extract ALL distinct actions as separate steps.
6. Write in second person: "Click...", "Change...", "Select..."
7. Use <strong> tags around menu names, button names, field names, and numeric values.
8. Title = problem symptom not solution.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Extract a troubleshooting path from this text:\n\n' + inputText }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error ' + response.status);

    let raw = data.content[0].text.trim();
    raw = raw.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch(e) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error('Could not parse JSON from AI response');
    }

    parsed.id = Date.now();
    aiResultData = parsed;

    status.className   = 'ai-gen-status success';
    status.textContent = '✓ Path generated — ' + parsed.steps.length + ' steps found. Review below then import.';
    document.getElementById('aiResultPreview').textContent = JSON.stringify(parsed, null, 2);
    resultWrap.classList.add('show');

  } catch(err) {
    status.className   = 'ai-gen-status error';
    status.textContent = 'Error: ' + err.message;
    console.error('AI error:', err);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L8.5 5 L13 5 L9.5 7.5 L11 12 L7 9 L3 12 L4.5 7.5 L1 5 L5.5 5 Z" fill="white"/></svg> Generate Troubleshooting Path';
  }
}

function importAIResult() {
  if (!aiResultData) { toast('No result to import'); return; }
  tsData.push(aiResultData);
  aiResultData = null;
  renderAdmin();
  renderTS();
  document.getElementById('aiResultWrap').classList.remove('show');
  document.getElementById('aiInputText').value = '';
  document.getElementById('aiStatus').className   = 'ai-gen-status success';
  document.getElementById('aiStatus').textContent = '✓ Imported successfully. Scroll down to see your new path.';
  toast('✓ New troubleshooting path imported');
}


// ─────────────────────────────────────────────────────────────
// INIT — called by index.html after all parts are loaded
// ─────────────────────────────────────────────────────────────
function initApp() {
  renderTS();
  const tb = document.getElementById('tbLevel');
  if (tb) tb.classList.add('active');
}
