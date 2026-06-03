// ═══════════════════════════════════════════════════════════════
// GUIDE.JS — Troubleshoot panel · Guide engine · AI generator
// ═══════════════════════════════════════════════════════════════

let activeGuide  = null;
let guideIdx     = 0;
let tsMini       = false;
let aiResultData = null;

// ─────────────────────────────────────────────────────────────
// TROUBLESHOOTING PATHS
//
// Each step has:
//   inst       — instruction text shown to technician
//   action     — what happens when this step is shown:
//
//   { do:'highlightOnly', sel:'#someId' }
//     → just circle the element, no UI change
//
//   { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
//     → opens the menu, circles the menu item
//
//   { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddActivations' }
//     → menu stays open, circles the item inside it
//
//   { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#ddActivations' }
//     → opens the modal (via fn), closes menu, circles the trigger item briefly
//       then circles element inside modal
//
//   { do:'highlightInModal', sel:'#btnReset' }
//     → modal already open, circles element inside it
//
//   { do:'switchTab', tabName:'Beams', sel:'#mAdvanced .mtab:nth-child(3)' }
//     → switches the adv params tab, circles the tab button
//
//   { do:'closeAndHighlight', modalId:'mAdvanced', sel:'#tbLoad' }
//     → closes a modal, circles the target element
//
//   { do:'wizardStep', step:4, sel:'#wizFD' }
//     → jumps wizard to step, circles target field
// ─────────────────────────────────────────────────────────────

let tsData = [

  // ══════════════════════════════════════════════════════════
  // PROBLEM 1 — SNR Reading is 0
  // ══════════════════════════════════════════════════════════
  {
    id: 1,
    title: "SNR Reading is 0",
    steps: [
      {
        inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
      },
      {
        inst: "Select <strong>Advanced Parameters…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddAdvParams' }
      },
      {
        inst: "The <strong>Advanced Parameters</strong> dialog is now open. Find <strong>Output Dampening Power</strong> and change it to <strong>420</strong> seconds.",
        action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#apDamp' }
      },
      {
        inst: "Change <strong>MPN Rate</strong> to <strong>7</strong> mass/hour.",
        action: { do:'highlightInModal', sel:'#apMPN' }
      },
      {
        inst: "Change <strong>Max Fill</strong> to <strong>7</strong> and <strong>Max Empty</strong> to <strong>8</strong>.",
        action: { do:'highlightInModal', sel:'#apMFill' }
      },
      {
        inst: "Click <strong>Upload All</strong> to push the new parameters to the sensor.",
        action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' }
      },
      {
        inst: "Close Advanced Parameters. Now click the <strong>Device</strong> menu again.",
        action: { do:'closeAndHighlight', modalId:'mAdvanced', sel:'#mDevice' }
      },
      {
        inst: "Click the <strong>Device</strong> menu to open it.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
      },
      {
        inst: "Select <strong>Device False Echo Mapping…</strong> from the menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddFalseEcho' }
      },
      {
        inst: "The <strong>False Echo Mapping</strong> dialog is open. Select <strong>Reset Mapping</strong> from the dropdown.",
        action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#feAction' }
      },
      {
        inst: "Click <strong>Execute</strong> to reset the map. Wait while it calculates (this may take 30–60 seconds).",
        action: { do:'highlightInModal', sel:'#mFalseEcho .mbtn-p' }
      },
      {
        inst: "Close the dialog. Click <strong>Load from Vessel</strong> in the toolbar. Repeat once per minute while monitoring the SNR value.",
        action: { do:'closeAndHighlight', modalId:'mFalseEcho', sel:'#tbLoad' }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PROBLEM 2 — Sensor Reading Full (Wrong Level)
  // ══════════════════════════════════════════════════════════
  {
    id: 2,
    title: "Sensor Reading Full (Wrong Level)",
    steps: [
      {
        inst: "Click the <strong>Wizard</strong> button in the toolbar to open the Configuration Wizard.",
        action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' }
      },
      {
        inst: "You are on <strong>Step 1/4</strong> — Vessel Dimensions. Click <strong>Next ▶</strong> to continue.",
        action: { do:'highlightInModal', sel:'#wizNext' }
      },
      {
        inst: "You are on <strong>Step 2/4</strong> — Device Position. Click <strong>Next ▶</strong> to continue.",
        action: { do:'wizardStep', step:2, sel:'#wizNext' }
      },
      {
        inst: "You are on <strong>Step 3/4</strong> — Filling Points. Click <strong>Next ▶</strong> to continue.",
        action: { do:'wizardStep', step:3, sel:'#wizNext' }
      },
      {
        inst: "You are on <strong>Step 4/4</strong> — Full/Empty Calibration. Find the <strong>Distance (Top)</strong> field next to Full Calib.",
        action: { do:'wizardStep', step:4, sel:'#wizFD' }
      },
      {
        inst: "Change the <strong>Distance (Top)</strong> value to <strong>1.64</strong>. The sensor will auto-calculate the rest.",
        action: { do:'highlightInModal', sel:'#wizFD' }
      },
      {
        inst: "Click <strong>Finish</strong> to save the new calibration.",
        action: { do:'highlightInModal', sel:'#wizNext' }
      },
      {
        inst: "Click <strong>Load from Vessel</strong> to take a fresh measurement and confirm the level now reads correctly.",
        action: { do:'closeAndHighlight', modalId:'mWizard', sel:'#tbLoad' }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PROBLEM 3 — Sensor Reset After Mapping Clear
  // ══════════════════════════════════════════════════════════
  {
    id: 3,
    title: "Sensor Reset After Mapping Clear",
    steps: [
      {
        inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
      },
      {
        inst: "Select <strong>Devices Activations…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddActivations' }
      },
      {
        inst: "The <strong>Devices Activations</strong> dialog is open. Click <strong>Reset</strong> — do <em>NOT</em> click Reset to Factory.",
        action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#btnReset' }
      },
      {
        inst: "The sensor is now resetting. Watch for a <strong>temperature alert</strong> — this confirms it is rebooting. Wait for it to come back online.",
        action: { do:'highlightInModal', sel:'#btnReset' }
      },
      {
        inst: "Close the dialog. Click <strong>Load from Vessel</strong> to confirm the sensor is back online. You should see an output current near <strong>20 mA</strong>.",
        action: { do:'closeAndHighlight', modalId:'mActivations', sel:'#tbLoad' }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PROBLEM 4 — Controller Goes to Sleep
  // ══════════════════════════════════════════════════════════
  {
    id: 4,
    title: "Controller Goes to Sleep",
    steps: [
      {
        inst: "This fix is done in <strong>Windows</strong>, not the BinMaster software. On the controller PC, click the <strong>Start button</strong> in the bottom-left corner of the screen.",
        action: { do:'highlightOnly', sel:'.title-bar' }
      },
      {
        inst: "Type <strong>sleep</strong> into the Start search box. Click <strong>Power, Sleep &amp; Battery Settings</strong> when it appears.",
        action: { do:'highlightOnly', sel:'.title-bar' }
      },
      {
        inst: "In the settings window, expand <strong>Screen, sleep, and hibernation timeouts</strong>.",
        action: { do:'highlightOnly', sel:'.title-bar' }
      },
      {
        inst: "Set <strong>'Make my device sleep after'</strong> to <strong>Never</strong>. Note: the screen turning off is OK — only the <em>sleep</em> setting causes disconnects.",
        action: { do:'highlightOnly', sel:'.title-bar' }
      }
    ]
  },

  // ══════════════════════════════════════════════════════════
  // PROBLEM 5 — Auto Beam Selection Issues
  // ══════════════════════════════════════════════════════════
  {
    id: 5,
    title: "Auto Beam Selection Issues",
    steps: [
      {
        inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
      },
      {
        inst: "Select <strong>Advanced Parameters…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddAdvParams' }
      },
      {
        inst: "The <strong>Advanced Parameters</strong> dialog is open. Click the <strong>Beams</strong> tab.",
        action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#mAdvanced .mtab:nth-child(3)' }
      },
      {
        inst: "You are now on the <strong>Beams</strong> tab. Verify all 6 beam checkboxes at the top are checked.",
        action: { do:'switchTab', tabName:'Beams', sel:'#apAutoBeam' }
      },
      {
        inst: "<strong>Uncheck Auto Beam Selection</strong> at the bottom of the Beams tab.",
        action: { do:'highlightInModal', sel:'#apAutoBeam' }
      },
      {
        inst: "Click <strong>Upload All</strong> to push the change to the sensor.",
        action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' }
      },
      {
        inst: "Click <strong>Load from Vessel</strong> to take a fresh measurement and confirm correct readings.",
        action: { do:'closeAndHighlight', modalId:'mAdvanced', sel:'#tbLoad' }
      }
    ]
  }

];


// ─────────────────────────────────────────────────────────────
// ACTION ENGINE
// Executes each step's UI action then positions the circle
// ─────────────────────────────────────────────────────────────
function executeAction(action, callback) {
  if (!action) { callback(); return; }

  switch (action.do) {

    // Just highlight an element, no UI change
    case 'highlightOnly':
      cm();
      callback();
      break;

    // Open a top-level menu and circle the menu button
    case 'openMenu':
      cm();
      setTimeout(() => {
        const item = document.getElementById(action.menuId);
        if (!item) { callback(); return; }
        const menuMap = {
          mFile:'ddFile', mComm:'ddComm', mEdit:'ddEdit',
          mDevice:'ddDevice', mTools:'ddTools', mHelp:'ddHelp'
        };
        const dropId = menuMap[action.menuId];
        const drop = document.getElementById(dropId);
        if (!drop) { callback(); return; }
        const r = item.getBoundingClientRect();
        drop.style.left = r.left + 'px';
        drop.style.top  = r.bottom + 'px';
        drop.classList.add('show');
        item.classList.add('open');
        openDrop = dropId;
        callback();
      }, 80);
      break;

    // Menu is already open — just circle the dropdown item
    case 'highlightMenuItem':
      // Keep menu open, just move the circle
      callback();
      break;

    // Open a modal via function call, close menu, circle element inside modal
    case 'openModal':
      cm(); // close menu
      setTimeout(() => {
        if (typeof window[action.fn] === 'function') {
          window[action.fn]();
        }
        // Give modal time to render before circling
        setTimeout(callback, 200);
      }, 150);
      break;

    // Modal already open — circle element inside it
    case 'highlightInModal':
      callback();
      break;

    // Switch a tab inside a modal
    case 'switchTab':
      setTimeout(() => {
        const tabs = document.querySelectorAll('#mAdvanced .mtab');
        const names = ['Basic', 'Advanced', 'Beams'];
        tabs.forEach((btn, i) => {
          if (names[i] === action.tabName) {
            advTab(action.tabName, btn);
          }
        });
        callback();
      }, 150);
      break;

    // Close a modal then circle an element on the main UI
    case 'closeAndHighlight':
      closeM(action.modalId);
      cm();
      setTimeout(callback, 150);
      break;

    // Navigate wizard to a specific step
    case 'wizardStep':
      setTimeout(() => {
        if (typeof wizStep !== 'undefined') {
          wizStep = action.step;
          if (typeof renderWiz === 'function') renderWiz();
        }
        setTimeout(callback, 200);
      }, 150);
      break;

    default:
      callback();
  }
}


// ─────────────────────────────────────────────────────────────
// PULSING CIRCLE
// ─────────────────────────────────────────────────────────────
function posCircle(sel) {
  const circle = document.getElementById('hlCircle');
  if (!circle) return;

  let el = null;
  try { el = document.querySelector(sel); } catch(e) {}

  // Fallback chain — try progressively simpler selectors
  if (!el && sel) {
    const parts = sel.split(' ');
    for (let i = 1; i < parts.length; i++) {
      try {
        el = document.querySelector(parts.slice(i).join(' '));
        if (el) break;
      } catch(e) {}
    }
  }

  // Final fallback
  if (!el) el = document.getElementById('menuBar');
  if (!el) { circle.classList.add('hidden'); return; }

  const r    = el.getBoundingClientRect();
  const pad  = 12;
  const size = Math.max(r.width + pad * 2, r.height + pad * 2, 44);

  circle.classList.remove('hidden');
  circle.style.width  = size + 'px';
  circle.style.height = size + 'px';
  circle.style.left   = (r.left + r.width  / 2 - size / 2) + 'px';
  circle.style.top    = (r.top  + r.height / 2 - size / 2) + 'px';
}

function hideCircle() {
  const circle = document.getElementById('hlCircle');
  if (circle) circle.classList.add('hidden');
}

document.addEventListener('scroll', () => {
  if (activeGuide) posCircle(activeGuide.steps[guideIdx].action.sel);
}, true);

window.addEventListener('resize', () => {
  if (activeGuide) posCircle(activeGuide.steps[guideIdx].action.sel);
});


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

  const steps = activeGuide.steps;
  const step  = steps[guideIdx];
  const tot   = steps.length;

  // Update panel text
  document.getElementById('gTitle').textContent = 'Step ' + (guideIdx + 1) + ' of ' + tot;
  document.getElementById('gCtr').textContent   = (guideIdx + 1) + ' / ' + tot;
  document.getElementById('gInst').innerHTML    = step.inst;

  // Prev button
  const prev = document.getElementById('gPrev');
  prev.disabled      = guideIdx === 0;
  prev.style.opacity = guideIdx === 0 ? '0.4' : '1';

  // Next / Done button
  const next = document.getElementById('gNext');
  if (guideIdx === tot - 1) {
    next.textContent = 'Done ✓';
    next.onclick = endGuide;
  } else {
    next.textContent = 'Next ▶';
    next.onclick = () => guideNav(1);
  }

  // Execute the action, then position circle after UI settles
  hideCircle();
  executeAction(step.action, () => {
    setTimeout(() => posCircle(step.action.sel), 100);
  });
}

function guideNav(d) {
  if (!activeGuide) return;
  guideIdx = Math.max(0, Math.min(activeGuide.steps.length - 1, guideIdx + d));
  renderGuide();
}

function endGuide() {
  // Clean up all UI state
  cm();
  ['mAdvanced','mActivations','mFalseEcho','mEcho','mWizard','mVDC'].forEach(id => closeM(id));
  activeGuide = null;
  document.getElementById('gPanel').classList.add('hidden');
  hideCircle();
  toast('Walkthrough complete ✓');
}


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


// Drag guide panel
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
    if (activeGuide) posCircle(activeGuide.steps[guideIdx].action.sel);
  });
  document.addEventListener('mouseup', () => drag = false);
})();


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
    Or edit paths manually below.
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
        <span class="adm-hint">Instruction (HTML allowed):</span>
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
    steps: [{
      inst: 'Enter instruction here.',
      action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' }
    }]
  });
  renderAdmin();
  renderTS();
}

function addStep(pi) {
  tsData[pi].steps.push({
    inst: 'Enter instruction here.',
    action: { do:'highlightOnly', sel:'#menuBar' }
  });
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
AVAILABLE CSS SELECTORS:
Menus: #mFile #mComm #mEdit #mDevice #mTools #mHelp
Device dropdown items: #ddAdvParams #ddFalseEcho #ddActivations
Toolbar: #tbLevel #tbLoad #tbEcho #tbWizard #tbVDC
Adv Params inputs: #apDamp #apMPN #apMFill #apMEmpty #apAutoFE #apAutoBeam
Adv Params tabs: #mAdvanced .mtab:nth-child(1) #mAdvanced .mtab:nth-child(2) #mAdvanced .mtab:nth-child(3)
Adv Params Upload All: #mAdvanced .mbtn-p
Activations modal: #btnReset
False Echo modal: #feAction #mFalseEcho .mbtn-p
Wizard: #wizBody #wizFD #wizNext
Fallbacks: .title-bar .toolbar #menuBar

ACTION TYPES for each step:
{ "do":"openMenu",        "menuId":"mDevice",      "sel":"#mDevice" }
{ "do":"highlightMenuItem","menuId":"mDevice",     "sel":"#ddActivations" }
{ "do":"openModal",       "menuId":"mDevice", "fn":"openActivations", "sel":"#btnReset" }
{ "do":"highlightInModal","sel":"#btnReset" }
{ "do":"switchTab",       "tabName":"Beams",       "sel":"#mAdvanced .mtab:nth-child(3)" }
{ "do":"closeAndHighlight","modalId":"mAdvanced",  "sel":"#tbLoad" }
{ "do":"highlightOnly",   "sel":".title-bar" }

MODAL fn NAMES:
openAdvParams, openActivations, openFalseEcho, openEcho, openWizard, openVDC
`.trim();

async function runAIGenerate() {
  const inputText = document.getElementById('aiInputText').value.trim();
  if (!inputText) { toast('Please paste some text first'); return; }

  const btn        = document.getElementById('aiGenBtn');
  const status     = document.getElementById('aiStatus');
  const resultWrap = document.getElementById('aiResultWrap');

  btn.disabled    = true;
  btn.textContent = '⏳ Generating...';
  status.className   = 'ai-gen-status loading';
  status.textContent = 'Analyzing your text and mapping to software steps...';
  resultWrap.classList.remove('show');

  const systemPrompt = `You are an expert field service trainer for BinMaster 3D MultiVision level measurement sensors.
Read support text and extract a structured troubleshooting path.

${selectorRef}

RULES:
1. Respond with ONLY valid JSON. No markdown, no explanation.
2. Output ONE object: {"id":0,"title":"<symptom max 8 words>","steps":[{"inst":"<instruction>","action":<action object>}]}
3. Every step MUST have an action object from the types listed above.
4. Steps that open a menu must use openMenu first, then highlightMenuItem for the item inside.
5. Steps that open a modal must use openModal with the correct fn name.
6. Steps inside an open modal use highlightInModal.
7. The last step inside a modal before moving on uses closeAndHighlight.
8. Use <strong> tags in instructions for menu names, button names, values.
9. Title = symptom not solution. Write in second person.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Extract troubleshooting path from:\n\n' + inputText }]
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error?.message || 'API error ' + response.status);

    let raw = data.content[0].text.trim()
      .replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '').trim();

    let parsed;
    try { parsed = JSON.parse(raw); }
    catch(e) {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) parsed = JSON.parse(match[0]);
      else throw new Error('Could not parse JSON from AI response');
    }

    parsed.id = Date.now();
    aiResultData = parsed;

    status.className   = 'ai-gen-status success';
    status.textContent = '✓ ' + parsed.steps.length + ' steps generated. Review below then import.';
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
  document.getElementById('aiStatus').textContent = '✓ Imported successfully.';
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
