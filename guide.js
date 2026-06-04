// ═══════════════════════════════════════════════════════════════
// GUIDE.JS — Troubleshoot panel · Guide engine · AI generator
// ═══════════════════════════════════════════════════════════════

let activeGuide  = null;
let guideIdx     = 0;
let tsMini       = false;
let aiResultData = null;

// ─────────────────────────────────────────────────────────────
// ELEMENT LIBRARY
// ─────────────────────────────────────────────────────────────
const elementLibrary = [

  // ════════════════════════════════════════════════════════
  // BLACK MENU BAR
  // ════════════════════════════════════════════════════════

  {
    group: '📁 File',
    items: [
      { label: 'File › New Project',
        action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { label: 'File › Open Project',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(2)' } },
      { label: 'File › Save Project',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(4)' } },
      { label: 'File › Save Project As',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(5)' } },
      { label: 'File › Export Project from Server',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(7)' } },
      { label: 'File › Import Project to Server',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(8)' } },
      { label: 'File › Delete Project',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(9)' } },
      { label: 'File › Browse to Local Folder',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(11)' } },
      { label: 'File › Exit',
        action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(13)' } },
    ]
  },

  {
    group: '📡 Communication',
    items: [
      { label: 'Communication › Connect All',
        action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { label: 'Communication › Disconnect All',
        action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(2)' } },
      { label: 'Communication › Load from Vessels',
        action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(3)' } },
      { label: 'Communication › Connect Vessel',
        action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(5)' } },
      { label: 'Communication › Disconnect Vessel',
        action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(6)' } },
      { label: 'Communication › Load from Vessel',
        action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(7)' } },
    ]
  },

  {
    group: '✏️ Edit',
    items: [
      { label: 'Edit › Add',
        action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { label: 'Edit › Delete',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(2)' } },
      { label: 'Edit › Properties',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(3)' } },
      { label: 'Edit › Edit Project',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(4)' } },
      { label: 'Edit › Save Selected Vessel Configuration As',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(6)' } },
      { label: 'Edit › Load Vessel Configuration Online',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(7)' } },
      { label: 'Edit › Offline Configuration',
        action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(8)' } },
    ]
  },

  {
    group: '⚙️ Device',
    items: [
      { label: 'Device › Device Configuration Wizard',
        action: { do:'openModal', menuId:'mDevice', fn:'openWizard', sel:'#wizBody' } },
      { label: 'Device › Advanced Parameters',
        action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#apDamp' } },
      { label: 'Device › Device Current Simulation Settings',
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(4)' } },
      { label: 'Device › Device Output Current',
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(5)' } },
      { label: 'Device › Device Output Settings',
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(6)' } },
      { label: 'Device › Echo Curve Analysis',
        action: { do:'openModal', menuId:'mDevice', fn:'openEcho', sel:'#echoStat' } },
      { label: 'Device › Echo Curve Analyze Viewer',
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(9)' } },
      { label: 'Device › Device False Echo Mapping',
        action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#feAction' } },
      { label: 'Device › Devices Activations',
        action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#btnReset' } },
      { label: 'Device › Update Model',
        action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(13)' } },
    ]
  },

  {
    group: '🔧 Tools',
    items: [
      { label: 'Tools › Reports',
        action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { label: 'Tools › Material Configuration',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(2)' } },
      { label: 'Tools › Server Options',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(3)' } },
      { label: 'Tools › Connect to Server',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(4)' } },
      { label: 'Tools › Sign Out',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(6)' } },
      { label: 'Tools › Switch User',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(7)' } },
      { label: 'Tools › Client Options',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(10)' } },
      { label: 'Tools › Refresh Display',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(11)' } },
      { label: 'Tools › Demo',
        action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(12)' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // BLUE TOOLBAR
  // ════════════════════════════════════════════════════════

  {
    group: '🔵 Toolbar — Echo Curve',
    items: [
      { label: 'Echo Curve › Open Echo Curve dialog',
        action: { do:'openModal', fn:'openEcho', sel:'#echoStat' } },
      { label: 'Echo Curve › Server status display',
        action: { do:'highlightInModal', sel:'#echoStat' } },
      { label: 'Echo Curve › Type dropdown',
        action: { do:'highlightInModal', sel:'#mEcho .adv-sel' } },
      { label: 'Echo Curve › Every (mins) setting',
        action: { do:'highlightInModal', sel:'#mEcho .echo-num' } },
      { label: 'Echo Curve › Open Viewer button',
        action: { do:'highlightInModal', sel:'#mEcho .mbtn-p:nth-child(1)' } },
      { label: 'Echo Curve › Start button',
        action: { do:'highlightInModal', sel:'#mEcho .mbtn-p:nth-child(2)' } },
      { label: 'Echo Curve › Stop button',
        action: { do:'highlightInModal', sel:'#mEcho .mbtn' } },
    ]
  },

  {
    group: '🔵 Toolbar — Wizard Step 1 (Vessel Dimensions)',
    items: [
      { label: 'Wizard Step 1 › Open Wizard',
        action: { do:'openModal', fn:'openWizard', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Distance unit (m / ft)',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Temperature unit',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Top Shape',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Center Shape Height',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Center Shape Diameter',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Bottom Shape',
        action: { do:'highlightInModal', sel:'#wizBody' } },
      { label: 'Wizard Step 1 › Next button',
        action: { do:'highlightInModal', sel:'#wizNext' } },
    ]
  },

  {
    group: '🔵 Toolbar — Wizard Step 2 (Device Position)',
    items: [
      { label: 'Wizard Step 2 › Device Position table',
        action: { do:'wizardStep', step:2, sel:'#wizBody' } },
      { label: 'Wizard Step 2 › Set device angle manually',
        action: { do:'wizardStep', step:2, sel:'#wizBody' } },
      { label: 'Wizard Step 2 › Next button',
        action: { do:'wizardStep', step:2, sel:'#wizNext' } },
    ]
  },

  {
    group: '🔵 Toolbar — Wizard Step 3 (Filling Points)',
    items: [
      { label: 'Wizard Step 3 › Filling Points table',
        action: { do:'wizardStep', step:3, sel:'#wizBody' } },
      { label: 'Wizard Step 3 › Add filling point',
        action: { do:'wizardStep', step:3, sel:'#wizBody' } },
      { label: 'Wizard Step 3 › Next button',
        action: { do:'wizardStep', step:3, sel:'#wizNext' } },
    ]
  },

  {
    group: '🔵 Toolbar — Wizard Step 4 (Full/Empty Calibration)',
    items: [
      { label: 'Wizard Step 4 › Full Calibration Distance (Top)',
        action: { do:'wizardStep', step:4, sel:'#wizFD' } },
      { label: 'Wizard Step 4 › Full Calibration Level (Bottom)',
        action: { do:'wizardStep', step:4, sel:'#wizBody' } },
      { label: 'Wizard Step 4 › Empty Calibration fields',
        action: { do:'wizardStep', step:4, sel:'#wizBody' } },
      { label: 'Wizard Step 4 › Finish button',
        action: { do:'wizardStep', step:4, sel:'#wizNext' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // VESSEL DETAIL TABS
  // ════════════════════════════════════════════════════════

  {
    group: '🚢 Vessel — Overview Tab',
    items: [
      { label: 'Vessel › Overview tab',
        action: { do:'highlightOnly', sel:'#dtOv' } },
      { label: 'Vessel › Overview › Avg Distance reading',
        action: { do:'highlightOnly', sel:'#ovAD' } },
      { label: 'Vessel › Overview › SNR reading',
        action: { do:'highlightOnly', sel:'#ovSNR' } },
      { label: 'Vessel › Overview › Output Current reading',
        action: { do:'highlightOnly', sel:'#ovOut' } },
      { label: 'Vessel › Overview › Temperature reading',
        action: { do:'highlightOnly', sel:'#ovTemp' } },
      { label: 'Vessel › Overview › Volume % reading',
        action: { do:'highlightOnly', sel:'#ovVolP' } },
      { label: 'Vessel › Overview › Material button',
        action: { do:'highlightOnly', sel:'.mat-btn' } },
    ]
  },

  {
    group: '🚢 Vessel — Logs Tab',
    items: [
      { label: 'Vessel › Logs tab',
        action: { do:'highlightOnly', sel:'#dtLg' } },
      { label: 'Vessel › Logs › Avg Distance chart',
        action: { do:'highlightOnly', sel:'#chAD' } },
      { label: 'Vessel › Logs › SNR chart',
        action: { do:'highlightOnly', sel:'#chSNR' } },
      { label: 'Vessel › Logs › Temperature chart',
        action: { do:'highlightOnly', sel:'#chTemp' } },
      { label: 'Vessel › Logs › Volume chart',
        action: { do:'highlightOnly', sel:'#chVol' } },
      { label: 'Vessel › Logs › Browse button',
        action: { do:'highlightOnly', sel:'.log-abtn' } },
    ]
  },

  {
    group: '🚢 Vessel — Parameters Tab',
    items: [
      { label: 'Vessel › Parameters tab',
        action: { do:'highlightOnly', sel:'#dtPr' } },
      { label: 'Vessel › Parameters › Parameters table',
        action: { do:'highlightOnly', sel:'.params-wrap' } },
    ]
  },

  {
    group: '🚢 Vessel — Devices Tab',
    items: [
      { label: 'Vessel › Devices tab',
        action: { do:'highlightOnly', sel:'#dtDv' } },
      { label: 'Vessel › Devices › Connection Type',
        action: { do:'highlightOnly', sel:'.conn-grid' } },
      { label: 'Vessel › Devices › Serial Port selector',
        action: { do:'highlightOnly', sel:'.cfg-sel' } },
      { label: 'Vessel › Devices › Polling Address',
        action: { do:'highlightOnly', sel:'.poll-sel' } },
      { label: 'Vessel › Devices › Disconnect button',
        action: { do:'highlightOnly', sel:'.disconn-btn' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // ADVANCED PARAMETERS DIALOG
  // ════════════════════════════════════════════════════════

  {
    group: '⚙️ Advanced Parameters — Basic Tab',
    items: [
      { label: 'Adv Params › Output Dampening Power',
        action: { do:'highlightInModal', sel:'#apDamp' } },
      { label: 'Adv Params › MPN Rate',
        action: { do:'highlightInModal', sel:'#apMPN' } },
      { label: 'Adv Params › Max Fill',
        action: { do:'highlightInModal', sel:'#apMFill' } },
      { label: 'Adv Params › Max Empty',
        action: { do:'highlightInModal', sel:'#apMEmpty' } },
      { label: 'Adv Params › Upload All button',
        action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' } },
    ]
  },

  {
    group: '⚙️ Advanced Parameters — Advanced Tab',
    items: [
      { label: 'Adv Params › Advanced tab',
        action: { do:'switchTab', tabName:'Advanced', sel:'#mAdvanced .mtab:nth-child(2)' } },
      { label: 'Adv Params › User False Echoes',
        action: { do:'switchTab', tabName:'Advanced', sel:'#apAutoFE' } },
      { label: 'Adv Params › Auto False Echoes',
        action: { do:'switchTab', tabName:'Advanced', sel:'#apAutoFE' } },
    ]
  },

  {
    group: '⚙️ Advanced Parameters — Beams Tab',
    items: [
      { label: 'Adv Params › Beams tab',
        action: { do:'switchTab', tabName:'Beams', sel:'#mAdvanced .mtab:nth-child(3)' } },
      { label: 'Adv Params › Auto Beam Selection checkbox',
        action: { do:'switchTab', tabName:'Beams', sel:'#apAutoBeam' } },
      { label: 'Adv Params › Individual Beam checkboxes',
        action: { do:'switchTab', tabName:'Beams', sel:'.beam-grid' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // DEVICES ACTIVATIONS DIALOG
  // ════════════════════════════════════════════════════════

  {
    group: '🔴 Devices Activations Dialog',
    items: [
      { label: 'Activations › Reset button',
        action: { do:'highlightInModal', sel:'#btnReset' } },
      { label: 'Activations › Reset to Factory button',
        action: { do:'highlightInModal', sel:'#mActivations .danger' } },
      { label: 'Activations › Restart Device button',
        action: { do:'highlightInModal', sel:'#mActivations .act-btn:nth-child(3)' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // FALSE ECHO MAPPING DIALOG
  // ════════════════════════════════════════════════════════

  {
    group: '📡 False Echo Mapping Dialog',
    items: [
      { label: 'False Echo › Action dropdown',
        action: { do:'highlightInModal', sel:'#feAction' } },
      { label: 'False Echo › Execute button',
        action: { do:'highlightInModal', sel:'#mFalseEcho .mbtn-p' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // TOOLBAR OTHER
  // ════════════════════════════════════════════════════════

  {
    group: '🔵 Toolbar — Other Buttons',
    items: [
      { label: 'Toolbar › Load from Vessel',
        action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbLoad' } },
      { label: 'Toolbar › VDC (Vessel Data Collection)',
        action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbVDC' } },
      { label: 'Toolbar › Level mode',
        action: { do:'closeAndHighlight', modalId:'_none', sel:'#tbLevel' } },
    ]
  },

  // ════════════════════════════════════════════════════════
  // WINDOWS OS
  // ════════════════════════════════════════════════════════

  {
    group: '🪟 Windows OS Steps',
    items: [
      { label: 'Windows › Start Menu / Search box',
        action: { do:'highlightOnly', sel:'.title-bar' } },
      { label: 'Windows › Power & Sleep Settings',
        action: { do:'highlightOnly', sel:'.title-bar' } },
      { label: 'Windows › Any other OS-level step',
        action: { do:'highlightOnly', sel:'.title-bar' } },
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
      { inst: "You are on <strong>Step 4/4 — Full/Empty Calibration</strong>. Find the <strong>Distance (Top)</strong> field.",
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
  document.addEventListener('mousemove', e => {
    if (!drag) return;
    p.style.left = (ol + e.clientX - sx) + 'px';
    p.style.top  = (ot + e.clientY - sy) + 'px';
  });
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
  <p style="font-size:12px;color:#555;margin-bottom:14px">Or build a path manually — click <strong>+ Add Problem</strong> then use the step builder.</p>`;

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
    const libItem  = findLibraryItem(s.action);
    const locLabel = libItem ? libItem.label : (s.action.sel || 'Custom');
    const r = document.createElement('div');
    r.className = 'adm-srow';
    r.style.cssText = 'display:flex;align-items:flex-start;gap:8px;padding:10px;background:white;border:1px solid #ddd;border-radius:5px;margin-bottom:6px';
    r.innerHTML = `
      <div style="background:#2a6db5;color:white;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-size:11px;flex-shrink:0;margin-top:2px">${si + 1}</div>
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

function findLibraryItem(action) {
  if (!action) return null;
  for (const group of elementLibrary) {
    for (const item of group.items) {
      if (item.action.sel === action.sel && item.action.do === action.do) return item;
    }
  }
  return null;
}

let builderPi  = null;
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

  let leftHtml = '';
  elementLibrary.forEach(group => {
    leftHtml += `<div style="padding:6px 10px 2px;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.5px;border-top:1px solid #e0e0e0;margin-top:4px">${group.group}</div>`;
    group.items.forEach(item => {
      const selected = builderSel && builderSel.label === item.label;
      const itemJson = JSON.stringify(item).replace(/\\/g,'\\\\').replace(/'/g,"\\'");
      leftHtml += `<div
        onclick="selectBuilderItem('${itemJson}')"
        style="padding:7px 14px;cursor:pointer;font-size:12px;color:${selected?'#1a5a9a':'#222'};
               border-left:3px solid ${selected?'#2a6db5':'transparent'};
               background:${selected?'#e8f0fa':'transparent'};
               font-weight:${selected?'600':'400'};
               transition:all 0.1s">
        ${item.label}
      </div>`;
    });
  });

  wrap.innerHTML = `
  <div style="display:flex;gap:14px;height:460px">
    <div style="width:310px;flex-shrink:0;overflow-y:auto;border:1px solid #ccc;border-radius:5px;background:#f9f9f9">
      <div style="padding:8px 12px;background:#2a6db5;color:white;font-size:12px;font-weight:700;border-radius:4px 4px 0 0;position:sticky;top:0">
        📍 Select where this step points to
      </div>
      ${leftHtml}
    </div>
    <div style="flex:1;display:flex;flex-direction:column;gap:10px">
      <div style="font-size:12px;font-weight:700;color:#333">Selected destination:</div>
      <div id="sbSelectedLabel" style="background:#e8f0fa;border:1px solid #2a6db5;border-radius:5px;padding:10px 14px;font-size:13px;color:#1a5a9a;min-height:40px;font-weight:600">
        ${builderSel ? '📍 ' + builderSel.label : '<span style="color:#aaa;font-weight:400">← Click an item on the left to select it</span>'}
      </div>
      <div style="font-size:12px;font-weight:700;color:#333">Instruction for the technician:</div>
      <textarea id="sbInstText"
        style="flex:1;border:1px solid #bbb;padding:10px;font-size:13px;border-radius:5px;resize:none;font-family:inherit;line-height:1.6"
        placeholder="Describe what the technician should do at this location.

Examples:
- Change Output Dampening Power to 420 seconds
- Select Reset Mapping from the dropdown and click Execute
- Click Upload All to apply the changes
- Do NOT select Reset to Factory

Use <strong>text</strong> to bold menu names and values."></textarea>
      <div style="font-size:11px;color:#888">HTML is supported in instructions. Use &lt;strong&gt;value&lt;/strong&gt; for bold.</div>
    </div>
  </div>`;
}

function selectBuilderItem(itemJson) {
  try {
    builderSel = JSON.parse(itemJson.replace(/\\'/g,"'"));
  } catch(e) {
    // fallback parse
    builderSel = JSON.parse(decodeURIComponent(itemJson));
  }
  const instText = document.getElementById('sbInstText');
  const savedInst = instText ? instText.value : '';
  renderStepBuilder();
  const ta = document.getElementById('sbInstText');
  if (ta && savedInst) ta.value = savedInst;
}

function saveBuilderStep() {
  if (!builderSel) { toast('Please select a destination first'); return; }
  const inst = (document.getElementById('sbInstText').value || '').trim();
  if (!inst)  { toast('Please enter an instruction'); return; }
  tsData[builderPi].steps.push({ inst, action: builderSel.action });
  closeM('mStepBuilder');
  renderAdmin();
  renderTS();
  toast('✓ Step added');
}

function moveStep(pi, si, dir) {
  const steps = tsData[pi].steps;
  const ni = si + dir;
  if (ni < 0 || ni >= steps.length) return;
  [steps[si], steps[ni]] = [steps[ni], steps[si]];
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
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
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
{ "do":"openMenu",          "menuId":"mDevice",       "sel":"#mDevice" }
{ "do":"highlightMenuItem", "menuId":"mDevice",        "sel":"#ddActivations" }
{ "do":"openModal",         "menuId":"mDevice","fn":"openActivations","sel":"#btnReset" }
{ "do":"highlightInModal",  "sel":"#btnReset" }
{ "do":"switchTab",         "tabName":"Beams",         "sel":"#mAdvanced .mtab:nth-child(3)" }
{ "do":"closeAndHighlight", "modalId":"mAdvanced",     "sel":"#tbLoad" }
{ "do":"highlightOnly",     "sel":".title-bar" }

MODAL fn NAMES: openAdvParams, openActivations, openFalseEcho, openEcho, openWizard, openVDC
`.trim();

async function runAIGenerate() {
  const inputText = document.getElementById('aiInputText').value.trim();
  if (!inputText) { toast('Please paste some text first'); return; }
  const btn        = document.getElementById('aiGenBtn');
  const status     = document.getElementById('aiStatus');
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
3. Every step MUST have an action object from the types listed.
4. Menu steps: openMenu first, then highlightMenuItem for the item inside.
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
  renderAdmin(); renderTS();
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
