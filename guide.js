// ═══════════════════════════════════════════════════════════════
// GUIDE.JS — Troubleshoot panel · Guide engine · AI generator
// ═══════════════════════════════════════════════════════════════

let activeGuide  = null;
let guideIdx     = 0;
let tsMini       = false;
let aiResultData = null;

// ─────────────────────────────────────────────────────────────
// ELEMENT LIBRARY — every clickable destination in the software
// This powers the visual step builder in the admin panel
// ─────────────────────────────────────────────────────────────
const elementLibrary = [
  {
    group: 'Top Menu Bar',
    items: [
      { label: 'File Menu',          sel: '#mFile',   action: { do:'openMenu', menuId:'mFile',   sel:'#mFile' } },
      { label: 'Communication Menu', sel: '#mComm',   action: { do:'openMenu', menuId:'mComm',   sel:'#mComm' } },
      { label: 'Edit Menu',          sel: '#mEdit',   action: { do:'openMenu', menuId:'mEdit',   sel:'#mEdit' } },
      { label: 'Device Menu',        sel: '#mDevice', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { label: 'Tools Menu',         sel: '#mTools',  action: { do:'openMenu', menuId:'mTools',  sel:'#mTools' } },
      { label: 'Help Menu',          sel: '#mHelp',   action: { do:'openMenu', menuId:'mHelp',   sel:'#mHelp' } },
    ]
  },
  {
    group: 'Device Menu Items',
    items: [
      { label: 'Device › Configuration Wizard',  sel: '#ddDevice .dd-item:nth-child(1)',  action: { do:'openModal', menuId:'mDevice', fn:'openWizard',      sel:'#wizBody' } },
      { label: 'Device › Advanced Parameters',   sel: '#ddAdvParams',                     action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams',   sel:'#apDamp' } },
      { label: 'Device › Echo Curve Analysis',   sel: '#ddDevice .dd-item:nth-child(7)',  action: { do:'openModal', menuId:'mDevice', fn:'openEcho',        sel:'#echoStat' } },
      { label: 'Device › False Echo Mapping',    sel: '#ddFalseEcho',                     action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho',   sel:'#feAction' } },
      { label: 'Device › Devices Activations',   sel: '#ddActivations',                   action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#btnReset' } },
    ]
  },
  {
    group: 'Communication Menu Items',
    items: [
      { label: 'Communication › Connect All',     sel: '#ddComm .dd-item:nth-child(1)', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(1)' } },
      { label: 'Communication › Disconnect All',  sel: '#ddComm .dd-item:nth-child(2)', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(2)' } },
      { label: 'Communication › Load from Vessels', sel: '#ddComm .dd-item:nth-child(3)', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(3)' } },
    ]
  },
  {
    group: 'Toolbar Buttons',
    items: [
      { label: 'Toolbar › Connect',         sel: '#tbLoad',   action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbLoad' } },
      { label: 'Toolbar › Load from Vessel', sel: '#tbLoad',  action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbLoad' } },
      { label: 'Toolbar › Echo Curve',      sel: '#tbEcho',   action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbEcho' } },
      { label: 'Toolbar › Wizard',          sel: '#tbWizard', action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbWizard' } },
      { label: 'Toolbar › VDC',             sel: '#tbVDC',    action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbVDC' } },
    ]
  },
  {
    group: 'Advanced Parameters — Basic Tab',
    items: [
      { label: 'Adv Params › Output Dampening Power', sel: '#apDamp',   action: { do:'highlightInModal', sel:'#apDamp' } },
      { label: 'Adv Params › MPN Rate',               sel: '#apMPN',    action: { do:'highlightInModal', sel:'#apMPN' } },
      { label: 'Adv Params › Max Fill',               sel: '#apMFill',  action: { do:'highlightInModal', sel:'#apMFill' } },
      { label: 'Adv Params › Max Empty',              sel: '#apMEmpty', action: { do:'highlightInModal', sel:'#apMEmpty' } },
      { label: 'Adv Params › Upload All button',      sel: '#mAdvanced .mbtn-p', action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' } },
    ]
  },
  {
    group: 'Advanced Parameters — Advanced Tab',
    items: [
      { label: 'Adv Params › Auto False Echoes',   sel: '#apAutoFE',  action: { do:'switchTab', tabName:'Advanced', sel:'#apAutoFE' } },
    ]
  },
  {
    group: 'Advanced Parameters — Beams Tab',
    items: [
      { label: 'Adv Params › Auto Beam Selection', sel: '#apAutoBeam', action: { do:'switchTab', tabName:'Beams', sel:'#apAutoBeam' } },
      { label: 'Adv Params › Beams Tab',           sel: '#mAdvanced .mtab:nth-child(3)', action: { do:'switchTab', tabName:'Beams', sel:'#mAdvanced .mtab:nth-child(3)' } },
    ]
  },
  {
    group: 'Devices Activations Dialog',
    items: [
      { label: 'Activations › Reset button',          sel: '#btnReset', action: { do:'highlightInModal', sel:'#btnReset' } },
      { label: 'Activations › Reset to Factory',      sel: '#mActivations .danger', action: { do:'highlightInModal', sel:'#mActivations .danger' } },
    ]
  },
  {
    group: 'False Echo Mapping Dialog',
    items: [
      { label: 'False Echo › Action dropdown',  sel: '#feAction',           action: { do:'highlightInModal', sel:'#feAction' } },
      { label: 'False Echo › Execute button',   sel: '#mFalseEcho .mbtn-p', action: { do:'highlightInModal', sel:'#mFalseEcho .mbtn-p' } },
    ]
  },
  {
    group: 'Configuration Wizard',
    items: [
      { label: 'Wizard › Step 1 (Vessel Dimensions)', sel: '#wizBody', action: { do:'highlightInModal', sel:'#wizNext' } },
      { label: 'Wizard › Step 4 Full Calibration Distance', sel: '#wizFD', action: { do:'wizardStep', step:4, sel:'#wizFD' } },
      { label: 'Wizard › Next / Finish button',       sel: '#wizNext', action: { do:'highlightInModal', sel:'#wizNext' } },
    ]
  },
  {
    group: 'Windows OS Steps',
    items: [
      { label: 'Windows › Start Menu / Search',       sel: '.title-bar', action: { do:'highlightOnly', sel:'.title-bar' } },
      { label: 'Windows › Power & Sleep Settings',    sel: '.title-bar', action: { do:'highlightOnly', sel:'.title-bar' } },
      { label: 'Windows › Any OS-level instruction',  sel: '.title-bar', action: { do:'highlightOnly', sel:'.title-bar' } },
    ]
  }
];


// ─────────────────────────────────────────────────────────────
// TROUBLESHOOTING PATHS
// ─────────────────────────────────────────────────────────────
let tsData = [

  {
    id: 1,
    title: "SNR Reading is 0",
    steps: [
      { inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: "Select <strong>Advanced Parameters…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddAdvParams' } },
      { inst: "The <strong>Advanced Parameters</strong> dialog is now open. Change <strong>Output Dampening Power</strong> to <strong>420</strong> seconds.",
        action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#apDamp' } },
      { inst: "Change <strong>MPN Rate</strong> to <strong>7</strong> mass/hour.",
        action: { do:'highlightInModal', sel:'#apMPN' } },
      { inst: "Change <strong>Max Fill</strong> to <strong>7</strong> and <strong>Max Empty</strong> to <strong>8</strong>.",
        action: { do:'highlightInModal', sel:'#apMFill' } },
      { inst: "Click <strong>Upload All</strong> to push the new parameters to the sensor.",
        action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' } },
      { inst: "Close Advanced Parameters. Now click the <strong>Device</strong> menu again.",
        action: { do:'closeAndHighlight', modalId:'mAdvanced', sel:'#mDevice' } },
      { inst: "Click the <strong>Device</strong> menu to open it.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: "Select <strong>Device False Echo Mapping…</strong> from the menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddFalseEcho' } },
      { inst: "The <strong>False Echo Mapping</strong> dialog is open. Select <strong>Reset Mapping</strong> from the dropdown.",
        action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#feAction' } },
      { inst: "Click <strong>Execute</strong> to reset the map. Wait while it calculates.",
        action: { do:'highlightInModal', sel:'#mFalseEcho .mbtn-p' } },
      { inst: "Click <strong>Load from Vessel</strong> in the toolbar. Repeat once per minute while monitoring SNR.",
        action: { do:'closeAndHighlight', modalId:'mFalseEcho', sel:'#tbLoad' } }
    ]
  },

  {
    id: 2,
    title: "Sensor Reading Full (Wrong Level)",
    steps: [
      { inst: "Click the <strong>Wizard</strong> button in the toolbar.",
        action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: "You are on <strong>Step 1/4</strong>. Click <strong>Next ▶</strong> to continue.",
        action: { do:'highlightInModal', sel:'#wizNext' } },
      { inst: "You are on <strong>Step 2/4</strong>. Click <strong>Next ▶</strong> to continue.",
        action: { do:'wizardStep', step:2, sel:'#wizNext' } },
      { inst: "You are on <strong>Step 3/4</strong>. Click <strong>Next ▶</strong> to continue.",
        action: { do:'wizardStep', step:3, sel:'#wizNext' } },
      { inst: "You are on <strong>Step 4/4 — Full/Empty Calibration</strong>. Find the <strong>Distance (Top)</strong> field next to Full Calib.",
        action: { do:'wizardStep', step:4, sel:'#wizFD' } },
      { inst: "Change <strong>Distance (Top)</strong> to <strong>1.64</strong>. The sensor auto-calculates the rest.",
        action: { do:'highlightInModal', sel:'#wizFD' } },
      { inst: "Click <strong>Finish</strong> to save the calibration.",
        action: { do:'highlightInModal', sel:'#wizNext' } },
      { inst: "Click <strong>Load from Vessel</strong> to confirm the level now reads correctly.",
        action: { do:'closeAndHighlight', modalId:'mWizard', sel:'#tbLoad' } }
    ]
  },

  {
    id: 3,
    title: "Sensor Reset After Mapping Clear",
    steps: [
      { inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: "Select <strong>Devices Activations…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddActivations' } },
      { inst: "The <strong>Devices Activations</strong> dialog is open. Click <strong>Reset</strong> — do <em>NOT</em> click Reset to Factory.",
        action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#btnReset' } },
      { inst: "Watch for a <strong>temperature alert</strong> — this confirms the sensor is rebooting.",
        action: { do:'highlightInModal', sel:'#btnReset' } },
      { inst: "Click <strong>Load from Vessel</strong> to confirm the sensor is back online at ~<strong>20 mA</strong> output.",
        action: { do:'closeAndHighlight', modalId:'mActivations', sel:'#tbLoad' } }
    ]
  },

  {
    id: 4,
    title: "Controller Goes to Sleep",
    steps: [
      { inst: "This fix is done in <strong>Windows</strong>. On the controller PC, click the <strong>Start button</strong> in the bottom-left corner.",
        action: { do:'highlightOnly', sel:'.title-bar' } },
      { inst: "Type <strong>sleep</strong> into the Start search box. Click <strong>Power, Sleep &amp; Battery Settings</strong>.",
        action: { do:'highlightOnly', sel:'.title-bar' } },
      { inst: "Expand <strong>Screen, sleep, and hibernation timeouts</strong>.",
        action: { do:'highlightOnly', sel:'.title-bar' } },
      { inst: "Set <strong>'Make my device sleep after'</strong> to <strong>Never</strong>.",
        action: { do:'highlightOnly', sel:'.title-bar' } }
    ]
  },

  {
    id: 5,
    title: "Auto Beam Selection Issues",
    steps: [
      { inst: "Click the <strong>Device</strong> menu in the top menu bar.",
        action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: "Select <strong>Advanced Parameters…</strong> from the Device menu.",
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddAdvParams' } },
      { inst: "The <strong>Advanced Parameters</strong> dialog is open. Click the <strong>Beams</strong> tab.",
        action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#mAdvanced .mtab:nth-child(3)' } },
      { inst: "You are on the <strong>Beams</strong> tab. Verify all 6 beam checkboxes are checked.",
        action: { do:'switchTab', tabName:'Beams', sel:'#apAutoBeam' } },
      { inst: "<strong>Uncheck Auto Beam Selection</strong> at the bottom.",
        action: { do:'highlightInModal', sel:'#apAutoBeam' } },
      { inst: "Click <strong>Upload All</strong> to push the change to the sensor.",
        action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' } },
      { inst: "Click <strong>Load from Vessel</strong> to confirm correct readings.",
        action: { do:'closeAndHighlight', modalId:'mAdvanced', sel:'#tbLoad' } }
    ]
  }

];


// ─────────────────────────────────────────────────────────────
// ACTION ENGINE
// ─────────────────────────────────────────────────────────────
function executeAction(action, callback) {
  if (!action) { callback(); return; }

  switch (action.do) {

    case 'highlightOnly':
      cm();
      callback();
      break;

    case 'openMenu':
      cm();
      setTimeout(() => {
        const item = document.getElementById(action.menuId);
        if (!item) { callback(); return; }
        const menuMap = { mFile:'ddFile', mComm:'ddComm', mEdit:'ddEdit', mDevice:'ddDevice', mTools:'ddTools', mHelp:'ddHelp' };
        const dropId  = menuMap[action.menuId];
        const drop    = document.getElementById(dropId);
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

    case 'highlightMenuItem':
      callback();
      break;

    case 'openModal':
      cm();
      setTimeout(() => {
        if (typeof window[action.fn] === 'function') window[action.fn]();
        setTimeout(callback, 200);
      }, 150);
      break;

    case 'highlightInModal':
      callback();
      break;

    case 'switchTab':
      setTimeout(() => {
        const tabs  = document.querySelectorAll('#mAdvanced .mtab');
        const names = ['Basic', 'Advanced', 'Beams'];
        tabs.forEach((btn, i) => { if (names[i] === action.tabName) advTab(action.tabName, btn); });
        callback();
      }, 150);
      break;

    case 'closeAndHighlight':
      if (action.modalId && action.modalId !== '_none') closeM(action.modalId);
      cm();
      setTimeout(callback, 150);
      break;

    case 'wizardStep':
      setTimeout(() => {
        if (typeof wizStep !== 'undefined') { wizStep = action.step; if (typeof renderWiz === 'function') renderWiz(); }
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
  if (!el && sel) {
    const parts = sel.split(' ');
    for (let i = 1; i < parts.length; i++) {
      try { el = document.querySelector(parts.slice(i).join(' ')); if (el) break; } catch(e) {}
    }
  }
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
  const c = document.getElementById('hlCircle');
  if (c) c.classList.add('hidden');
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
  document.getElementById('gTitle').textContent = 'Step ' + (guideIdx + 1) + ' of ' + tot;
  document.getElementById('gCtr').textContent   = (guideIdx + 1) + ' / ' + tot;
  document.getElementById('gInst').innerHTML    = step.inst;
  const prev = document.getElementById('gPrev');
  prev.disabled      = guideIdx === 0;
  prev.style.opacity = guideIdx === 0 ? '0.4' : '1';
  const next = document.getElementById('gNext');
  if (guideIdx === tot - 1) { next.textContent = 'Done ✓'; next.onclick = endGuide; }
  else                      { next.textContent = 'Next ▶'; next.onclick = () => guideNav(1); }
  hideCircle();
  executeAction(step.action, () => { setTimeout(() => posCircle(step.action.sel), 100); });
}

function guideNav(d) {
  if (!activeGuide) return;
  guideIdx = Math.max(0, Math.min(activeGuide.steps.length - 1, guideIdx + d));
  renderGuide();
}

function endGuide() {
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
    b.onclick   = () => startGuide(p);
    el.appendChild(b);
  });
}

function toggleTS() {
  tsMini = !tsMini;
  document.getElementById('tsBody').classList.toggle('mini', tsMini);
  document.getElementById('tsMin').textContent = tsMini ? '+' : '−';
}

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
  document.addEventListener('mousemove', e => { if (!drag) return; p.style.left = (ol + e.clientX - sx) + 'px'; p.style.top = (ot + e.clientY - sy) + 'px'; });
  document.addEventListener('mouseup', () => drag = false);
})();

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
    <div class="ai-gen-desc">Paste any rough text — a support email, call transcript, or field notes — and AI will extract the steps automatically.</div>
    <textarea class="ai-gen-textarea" id="aiInputText" placeholder="Paste email, transcript, or notes here..."></textarea>
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
  <p style="font-size:12px;color:#555;margin-bottom:14px">Or build a path manually below — click <strong>+ Add Problem</strong> then use the step builder.</p>`;

  tsData.forEach((p, pi) => {
    const d = document.createElement('div');
    d.className = 'adm-block';
    d.innerHTML = `
      <div class="adm-hdr">
        <input class="adm-tin" type="text" value="${esc(p.title)}"
          oninput="tsData[${pi}].title=this.value;renderTS()"
          placeholder="Problem title (e.g. SNR Reading is 0)">
        <button class="adm-del" onclick="delProb(${pi})">🗑 Delete</button>
      </div>
      <div id="adS_${pi}"></div>
      <button class="adm-addstep" onclick="showStepBuilder(${pi})">+ Add Step</button>`;
    b.appendChild(d);
    renderAdminSteps(pi);
  });
}

function renderAdminSteps(pi) {
  const c = document.getElementById('adS_' + pi);
  if (!c) return;
  c.innerHTML = '';
  tsData[pi].steps.forEach((s, si) => {
    // Find the matching library item label
    const libItem = findLibraryItem(s.action);
    const locLabel = libItem ? libItem.label : (s.action.sel || 'Custom');
    const r = document.createElement('div');
    r.className = 'adm-srow';
    r.style.cssText = 'display:flex;align-items:flex-start;gap:8px;padding:10px;background:white;border:1px solid #ddd;border-radius:5px;margin-bottom:6px';
    r.innerHTML = `
      <div class="adm-snum" style="background:#2a6db5;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:2px">${si + 1}</div>
      <div style="flex:1;display:flex;flex-direction:column;gap:5px">
        <div style="font-size:11px;font-weight:700;color:#2a6db5;background:#e8f0fa;padding:3px 8px;border-radius:4px;display:inline-block">
          📍 ${esc(locLabel)}
        </div>
        <textarea style="border:1px solid #bbb;padding:6px 8px;font-size:12px;border-radius:4px;resize:vertical;min-height:44px;width:100%;font-family:inherit"
          oninput="tsData[${pi}].steps[${si}].inst=this.value">${esc(s.inst)}</textarea>
      </div>
      <div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">
        <button onclick="moveStep(${pi},${si},-1)" style="background:#e0e0e0;border:1px solid #bbb;border-radius:3px;cursor:pointer;padding:2px 7px;font-size:13px" title="Move up">▲</button>
        <button onclick="moveStep(${pi},${si},1)"  style="background:#e0e0e0;border:1px solid #bbb;border-radius:3px;cursor:pointer;padding:2px 7px;font-size:13px" title="Move down">▼</button>
        <button onclick="delStep(${pi},${si})" style="background:#e74c3c;color:white;border:none;border-radius:3px;cursor:pointer;padding:2px 7px;font-size:13px" title="Delete">✕</button>
      </div>`;
    c.appendChild(r);
  });
}

// Find a library item matching an action
function findLibraryItem(action) {
  if (!action) return null;
  for (const group of elementLibrary) {
    for (const item of group.items) {
      if (item.action.sel === action.sel && item.action.do === action.do) return item;
    }
  }
  return null;
}

// Step builder modal — shown when clicking "+ Add Step"
let builderPi = null;
let builderSel = null;

function showStepBuilder(pi) {
  builderPi  = pi;
  builderSel = null;
  renderStepBuilder();
  openM('mStepBuilder');
}

function renderStepBuilder() {
  const wrap = document.getElementById('stepBuilderBody');
  if (!wrap) return;

  let html = `
  <div style="display:flex;gap:14px;height:440px">

    <!-- LEFT: element picker -->
    <div style="width:300px;flex-shrink:0;overflow-y:auto;border:1px solid #ccc;border-radius:5px;background:#f9f9f9">
      <div style="padding:8px 12px;background:#2a6db5;color:white;font-size:12px;font-weight:700;border-radius:4px 4px 0 0">
        📍 Select where this step points
      </div>`;

  elementLibrary.forEach(group => {
    html += `<div style="padding:6px 10px 2px;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e0e0e0;margin-top:4px">${group.group}</div>`;
    group.items.forEach(item => {
      const selected = builderSel && builderSel.label === item.label;
      html += `<div class="sb-item${selected ? ' sb-selected' : ''}"
        onclick="selectBuilderItem(${JSON.stringify(item).replace(/"/g,'&quot;')})"
        style="padding:7px 14px;cursor:pointer;font-size:12px;color:#222;border-left:3px solid transparent;transition:all 0.15s;
               ${selected ? 'background:#e8f0fa;border-left-color:#2a6db5;font-weight:600;color:#1a5a9a' : ''}">
        ${item.label}
      </div>`;
    });
  });

  html += `</div>

    <!-- RIGHT: instruction box -->
    <div style="flex:1;display:flex;flex-direction:column;gap:10px">
      <div style="font-size:12px;font-weight:700;color:#333">Step destination selected:</div>
      <div id="sbSelectedLabel" style="background:#e8f0fa;border:1px solid #2a6db5;border-radius:5px;padding:8px 12px;font-size:12px;color:#1a5a9a;min-height:36px">
        ${builderSel ? '📍 ' + builderSel.label : '<span style="color:#aaa">← Click an item on the left</span>'}
      </div>
      <div style="font-size:12px;font-weight:700;color:#333">Instruction for the technician:</div>
      <textarea id="sbInstText" style="flex:1;border:1px solid #bbb;padding:8px 10px;font-size:13px;border-radius:5px;resize:none;font-family:inherit;line-height:1.5"
        placeholder="Describe what the technician should do at this location.&#10;&#10;Examples:&#10;• Change Output Dampening Power to 420 seconds&#10;• Select Reset Mapping from the dropdown&#10;• Click Upload All to apply changes&#10;&#10;HTML is supported: use &lt;strong&gt; for bold">${builderSel && builderSel._inst ? builderSel._inst : ''}</textarea>
      <div style="font-size:11px;color:#888">Tip: Use &lt;strong&gt;text&lt;/strong&gt; to bold menu names and values.</div>
    </div>
  </div>`;

  wrap.innerHTML = html;
}

function selectBuilderItem(item) {
  builderSel = item;
  // Update selected label display
  document.getElementById('sbSelectedLabel').innerHTML = '📍 ' + item.label;
  // Refresh left panel to show selection highlight
  renderStepBuilder();
  // Restore any typed instruction
  const ta = document.getElementById('sbInstText');
  if (ta && item._inst) ta.value = item._inst;
}

function saveBuilderStep() {
  if (!builderSel) { toast('Please select a destination first'); return; }
  const inst = document.getElementById('sbInstText').value.trim();
  if (!inst)  { toast('Please enter an instruction'); return; }

  tsData[builderPi].steps.push({
    inst:   inst,
    action: builderSel.action
  });

  closeM('mStepBuilder');
  renderAdmin();
  renderTS();
  toast('✓ Step added');
}

function moveStep(pi, si, dir) {
  const steps = tsData[pi].steps;
  const newIdx = si + dir;
  if (newIdx < 0 || newIdx >= steps.length) return;
  const tmp = steps[si];
  steps[si] = steps[newIdx];
  steps[newIdx] = tmp;
  renderAdminSteps(pi);
}

function addProblem() {
  tsData.push({ id: Date.now(), title: 'New Problem ' + (tsData.length + 1), steps: [] });
  renderAdmin();
  renderTS();
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
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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

ACTION TYPES:
{ "do":"openMenu",         "menuId":"mDevice",      "sel":"#mDevice" }
{ "do":"highlightMenuItem","menuId":"mDevice",       "sel":"#ddActivations" }
{ "do":"openModal",        "menuId":"mDevice","fn":"openActivations","sel":"#btnReset" }
{ "do":"highlightInModal", "sel":"#btnReset" }
{ "do":"switchTab",        "tabName":"Beams",        "sel":"#mAdvanced .mtab:nth-child(3)" }
{ "do":"closeAndHighlight","modalId":"mAdvanced",    "sel":"#tbLoad" }
{ "do":"highlightOnly",    "sel":".title-bar" }

MODAL fn NAMES: openAdvParams, openActivations, openFalseEcho, openEcho, openWizard, openVDC
`.trim();

async function runAIGenerate() {
  const inputText = document.getElementById('aiInputText').value.trim();
  if (!inputText) { toast('Please paste some text first'); return; }
  const btn = document.getElementById('aiGenBtn');
  const status = document.getElementById('aiStatus');
  const resultWrap = document.getElementById('aiResultWrap');
  btn.disabled = true; btn.textContent = '⏳ Generating...';
  status.className = 'ai-gen-status loading';
  status.textContent = 'Analyzing your text and mapping to software steps...';
  resultWrap.classList.remove('show');

  const systemPrompt = `You are an expert field service trainer for BinMaster 3D MultiVision.
Read support text and extract a structured troubleshooting path.
${selectorRef}
RULES:
1. Respond with ONLY valid JSON. No markdown.
2. Output ONE object: {"id":0,"title":"<symptom>","steps":[{"inst":"<instruction>","action":<action>}]}
3. Every step MUST have an action object.
4. Menu steps: openMenu first, then highlightMenuItem for item inside.
5. Modal steps: openModal to open, highlightInModal for elements inside, closeAndHighlight to exit.
6. Use <strong> tags for menu names, button names, values.
7. Title = symptom not solution. Second person instructions.`;

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
    let raw = data.content[0].text.trim().replace(/^```[\w]*\n?/,'').replace(/\n?```$/,'').trim();
    let parsed;
    try { parsed = JSON.parse(raw); }
    catch(e) { const m = raw.match(/\{[\s\S]*\}/); if (m) parsed = JSON.parse(m[0]); else throw new Error('Could not parse JSON'); }
    parsed.id = Date.now();
    aiResultData = parsed;
    status.className = 'ai-gen-status success';
    status.textContent = '✓ ' + parsed.steps.length + ' steps generated. Review below then import.';
    document.getElementById('aiResultPreview').textContent = JSON.stringify(parsed, null, 2);
    resultWrap.classList.add('show');
  } catch(err) {
    status.className = 'ai-gen-status error';
    status.textContent = 'Error: ' + err.message;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M7 1 L8.5 5 L13 5 L9.5 7.5 L11 12 L7 9 L3 12 L4.5 7.5 L1 5 L5.5 5 Z" fill="white"/></svg> Generate Troubleshooting Path';
  }
}

function importAIResult() {
  if (!aiResultData) { toast('No result to import'); return; }
  tsData.push(aiResultData);
  aiResultData = null;
  renderAdmin(); renderTS();
  document.getElementById('aiResultWrap').classList.remove('show');
  document.getElementById('aiInputText').value = '';
  document.getElementById('aiStatus').className = 'ai-gen-status success';
  document.getElementById('aiStatus').textContent = '✓ Imported successfully.';
  toast('✓ New troubleshooting path imported');
}


// ─────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────
function initApp() {
  renderTS();
  const tb = document.getElementById('tbLevel');
  if (tb) tb.classList.add('active');
}
