// ═══════════════════════════════════════════════════════════════
// GUIDE.JS — Troubleshoot panel · Guide engine · Auto-navigation
// ═══════════════════════════════════════════════════════════════

let activeGuide  = null;
let guideIdx     = 0;
let tsMini       = false;
let aiResultData = null;

// ─────────────────────────────────────────────────────────────
// DESTINATION LIBRARY
// ─────────────────────────────────────────────────────────────
const destinations = [

  // ── FILE MENU ─────────────────────────────────────────────
  { group: '📁 File Menu', label: 'File › New Project',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu in the top menu bar.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>New Project</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(1)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Open Project',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Open Project</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(2)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Save Project',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Save Project</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(4)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Save Project As',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Save Project As</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(5)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Export Project from Server',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Export Project from Server</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(7)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Import Project to Server',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Import Project to Server</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(8)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Delete Project',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Delete Project</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(9)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Browse to Local Folder',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Browse to Local Folder</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(11)' } }
    ]
  },
  { group: '📁 File Menu', label: 'File › Exit',
    navPath: [
      { inst: 'Click the <strong>File</strong> menu.', action: { do:'openMenu', menuId:'mFile', sel:'#mFile' } },
      { inst: 'Click <strong>Exit</strong>.', action: { do:'highlightMenuItem', menuId:'mFile', sel:'#ddFile .dd-item:nth-child(13)' } }
    ]
  },

  // ── COMMUNICATION MENU ────────────────────────────────────
  { group: '📡 Communication Menu', label: 'Communication › Connect All',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Connect All</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(1)' } }
    ]
  },
  { group: '📡 Communication Menu', label: 'Communication › Disconnect All',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Disconnect All</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(2)' } }
    ]
  },
  { group: '📡 Communication Menu', label: 'Communication › Load from Vessels',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Load from Vessels</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(3)' } }
    ]
  },
  { group: '📡 Communication Menu', label: 'Communication › Connect Vessel',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Connect Vessel</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(5)' } }
    ]
  },
  { group: '📡 Communication Menu', label: 'Communication › Disconnect Vessel',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Disconnect Vessel</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(6)' } }
    ]
  },
  { group: '📡 Communication Menu', label: 'Communication › Load from Vessel',
    navPath: [
      { inst: 'Click the <strong>Communication</strong> menu.', action: { do:'openMenu', menuId:'mComm', sel:'#mComm' } },
      { inst: 'Click <strong>Load from Vessel</strong>.', action: { do:'highlightMenuItem', menuId:'mComm', sel:'#ddComm .dd-item:nth-child(7)' } }
    ]
  },

  // ── EDIT MENU ─────────────────────────────────────────────
  { group: '✏️ Edit Menu', label: 'Edit › Add',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Add</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(1)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Delete',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Delete</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(2)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Properties',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Properties</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(3)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Edit Project',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Edit Project</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(4)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Save Selected Vessel Configuration As',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Save Selected Vessel Configuration As</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(6)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Load Vessel Configuration Online',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Load Vessel Configuration Online</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(7)' } }
    ]
  },
  { group: '✏️ Edit Menu', label: 'Edit › Offline Configuration',
    navPath: [
      { inst: 'Click the <strong>Edit</strong> menu.', action: { do:'openMenu', menuId:'mEdit', sel:'#mEdit' } },
      { inst: 'Click <strong>Offline Configuration</strong>.', action: { do:'highlightMenuItem', menuId:'mEdit', sel:'#ddEdit .dd-item:nth-child(8)' } }
    ]
  },

  // ── DEVICE MENU ───────────────────────────────────────────
  { group: '⚙️ Device Menu', label: 'Device › Device Configuration Wizard',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device Configuration Wizard</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openWizard', sel:'#wizBody' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#apDamp' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Output Dampening Power',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Find <strong>Output Dampening Power</strong> on the Basic tab.', action: { do:'highlightInModal', sel:'#apDamp' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › MPN Rate',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Find <strong>MPN Rate</strong> on the Basic tab.', action: { do:'highlightInModal', sel:'#apMPN' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Max Fill',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Find <strong>Max Fill</strong> on the Basic tab.', action: { do:'highlightInModal', sel:'#apMFill' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Max Empty',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Find <strong>Max Empty</strong> on the Basic tab.', action: { do:'highlightInModal', sel:'#apMEmpty' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Upload All',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Click <strong>Upload All</strong> to push changes to the sensor.', action: { do:'highlightInModal', sel:'#mAdvanced .mbtn-p' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Beams Tab › Auto Beam Selection',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Click the <strong>Beams</strong> tab.', action: { do:'switchTab', tabName:'Beams', sel:'#mAdvanced .mtab:nth-child(3)' } },
      { inst: 'Find <strong>Auto Beam Selection</strong> at the bottom.', action: { do:'highlightInModal', sel:'#apAutoBeam' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Advanced Parameters › Advanced Tab › Auto False Echoes',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Advanced Parameters</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openAdvParams', sel:'#ddAdvParams' } },
      { inst: 'Click the <strong>Advanced</strong> tab.', action: { do:'switchTab', tabName:'Advanced', sel:'#mAdvanced .mtab:nth-child(2)' } },
      { inst: 'Find <strong>Auto False Echoes</strong>.', action: { do:'highlightInModal', sel:'#apAutoFE' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Device Current Simulation Settings',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device Current Simulation Settings</strong>.', action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(4)' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Device Output Current',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device Output Current</strong>.', action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(5)' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Device Output Settings',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device Output Settings</strong>.', action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(6)' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Echo Curve Analysis',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Echo Curve Analysis</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openEcho', sel:'#echoStat' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Echo Curve Analyze Viewer',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Echo Curve Analyze Viewer</strong>.', action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(9)' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › False Echo Mapping',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device False Echo Mapping</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#feAction' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › False Echo Mapping › Action Dropdown',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device False Echo Mapping</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#ddFalseEcho' } },
      { inst: 'Select the action from the <strong>Action</strong> dropdown.', action: { do:'highlightInModal', sel:'#feAction' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › False Echo Mapping › Execute Button',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Device False Echo Mapping</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openFalseEcho', sel:'#ddFalseEcho' } },
      { inst: 'Click <strong>Execute</strong>.', action: { do:'highlightInModal', sel:'#mFalseEcho .mbtn-p' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Devices Activations',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Devices Activations</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#btnReset' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Devices Activations › Reset Button',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Devices Activations</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#ddActivations' } },
      { inst: 'Click the <strong>Reset</strong> button.', action: { do:'highlightInModal', sel:'#btnReset' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Devices Activations › Reset to Factory',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Devices Activations</strong>.', action: { do:'openModal', menuId:'mDevice', fn:'openActivations', sel:'#ddActivations' } },
      { inst: 'Click <strong>Reset to Factory</strong>.', action: { do:'highlightInModal', sel:'#mActivations .danger' } }
    ]
  },
  { group: '⚙️ Device Menu', label: 'Device › Update Model',
    navPath: [
      { inst: 'Click the <strong>Device</strong> menu.', action: { do:'openMenu', menuId:'mDevice', sel:'#mDevice' } },
      { inst: 'Click <strong>Update Model</strong>.', action: { do:'highlightMenuItem', menuId:'mDevice', sel:'#ddDevice .dd-item:nth-child(13)' } }
    ]
  },

  // ── TOOLS MENU ────────────────────────────────────────────
  { group: '🔧 Tools Menu', label: 'Tools › Reports',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Reports</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(1)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Material Configuration',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Material Configuration</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(2)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Server Options',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Server Options</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(3)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Connect to Server',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Connect to Server</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(4)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Sign Out',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Sign Out</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(6)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Switch User',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Switch User</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(7)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Client Options',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Client Options</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(10)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Refresh Display',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Refresh Display</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(11)' } }
    ]
  },
  { group: '🔧 Tools Menu', label: 'Tools › Demo',
    navPath: [
      { inst: 'Click the <strong>Tools</strong> menu.', action: { do:'openMenu', menuId:'mTools', sel:'#mTools' } },
      { inst: 'Click <strong>Demo</strong>.', action: { do:'highlightMenuItem', menuId:'mTools', sel:'#ddTools .dd-item:nth-child(12)' } }
    ]
  },

  // ── TOOLBAR ───────────────────────────────────────────────
  { group: '🔵 Toolbar', label: 'Toolbar › Load from Vessel',
    navPath: [
      { inst: 'Click <strong>Load from Vessel</strong> in the blue toolbar.', action: { do:'highlightOnly', sel:'#tbLoad' } }
    ]
  },
  { group: '🔵 Toolbar', label: 'Toolbar › Echo Curve',
    navPath: [
      { inst: 'Click <strong>Echo Curve</strong> in the blue toolbar.', action: { do:'openModal', fn:'openEcho', sel:'#tbEcho' } }
    ]
  },
  { group: '🔵 Toolbar', label: 'Toolbar › Wizard',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the blue toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } }
    ]
  },
  { group: '🔵 Toolbar', label: 'Toolbar › VDC',
    navPath: [
      { inst: 'Click <strong>VDC</strong> in the blue toolbar.', action: { do:'openModal', fn:'openVDC', sel:'#tbVDC' } }
    ]
  },
  { group: '🔵 Toolbar', label: 'Toolbar › Level',
    navPath: [
      { inst: 'Click <strong>Level</strong> in the blue toolbar.', action: { do:'highlightOnly', sel:'#tbLevel' } }
    ]
  },

  // ── WIZARD STEPS ──────────────────────────────────────────
  { group: '🔵 Wizard', label: 'Wizard › Step 1 (Vessel Dimensions)',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: 'You are on <strong>Step 1 — Vessel Dimensions</strong>.', action: { do:'highlightInModal', sel:'#wizBody' } }
    ]
  },
  { group: '🔵 Wizard', label: 'Wizard › Step 2 (Device Position)',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: 'Click <strong>Next</strong> to reach Step 2 — <strong>Device Position</strong>.', action: { do:'wizardStep', step:2, sel:'#wizBody' } }
    ]
  },
  { group: '🔵 Wizard', label: 'Wizard › Step 3 (Filling Points)',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: 'Click <strong>Next</strong> twice to reach Step 3 — <strong>Filling Points</strong>.', action: { do:'wizardStep', step:3, sel:'#wizBody' } }
    ]
  },
  { group: '🔵 Wizard', label: 'Wizard › Step 4 › Full Calibration Distance (Top)',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: 'Click <strong>Next</strong> three times to reach Step 4 — <strong>Full/Empty Calibration</strong>.', action: { do:'wizardStep', step:4, sel:'#wizFD' } },
      { inst: 'Find the <strong>Distance (Top)</strong> field in the Full Calibration row.', action: { do:'highlightInModal', sel:'#wizFD' } }
    ]
  },
  { group: '🔵 Wizard', label: 'Wizard › Step 4 › Finish Button',
    navPath: [
      { inst: 'Click <strong>Wizard</strong> in the toolbar.', action: { do:'openModal', fn:'openWizard', sel:'#tbWizard' } },
      { inst: 'Navigate to Step 4 then click <strong>Finish</strong>.', action: { do:'wizardStep', step:4, sel:'#wizNext' } },
      { inst: 'Click <strong>Finish</strong> to save the configuration.', action: { do:'highlightInModal', sel:'#wizNext' } }
    ]
  },

  // ── VESSEL TABS ───────────────────────────────────────────
  { group: '🚢 Vessel Tabs', label: 'Vessel › Overview Tab',
    navPath: [
      { inst: 'Click the <strong>Overview</strong> tab on the vessel detail view.', action: { do:'highlightOnly', sel:'#dtOv' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Overview › SNR Reading',
    navPath: [
      { inst: 'Click the <strong>Overview</strong> tab.', action: { do:'highlightOnly', sel:'#dtOv' } },
      { inst: 'Find the <strong>SNR</strong> value in the left panel.', action: { do:'highlightOnly', sel:'#ovSNR' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Overview › Output Current',
    navPath: [
      { inst: 'Click the <strong>Overview</strong> tab.', action: { do:'highlightOnly', sel:'#dtOv' } },
      { inst: 'Find the <strong>Output Current</strong> value in the left panel.', action: { do:'highlightOnly', sel:'#ovOut' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Overview › Temperature',
    navPath: [
      { inst: 'Click the <strong>Overview</strong> tab.', action: { do:'highlightOnly', sel:'#dtOv' } },
      { inst: 'Find the <strong>Temperature</strong> value in the left panel.', action: { do:'highlightOnly', sel:'#ovTemp' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Logs Tab',
    navPath: [
      { inst: 'Click the <strong>Logs</strong> tab on the vessel detail view.', action: { do:'highlightOnly', sel:'#dtLg' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Parameters Tab',
    navPath: [
      { inst: 'Click the <strong>Parameters</strong> tab on the vessel detail view.', action: { do:'highlightOnly', sel:'#dtPr' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Devices Tab',
    navPath: [
      { inst: 'Click the <strong>Devices</strong> tab on the vessel detail view.', action: { do:'highlightOnly', sel:'#dtDv' } }
    ]
  },
  { group: '🚢 Vessel Tabs', label: 'Vessel › Devices › Serial Port',
    navPath: [
      { inst: 'Click the <strong>Devices</strong> tab.', action: { do:'highlightOnly', sel:'#dtDv' } },
      { inst: 'Find the <strong>Serial Port</strong> selector under Configuration.', action: { do:'highlightOnly', sel:'.cfg-sel' } }
    ]
  },

  // ── WINDOWS OS ────────────────────────────────────────────
  { group: '🪟 Windows OS', label: 'Windows › Start Menu / Search',
    navPath: [
      { inst: 'On the Windows controller PC, click the <strong>Start button</strong> (bottom-left corner).', action: { do:'highlightOnly', sel:'.title-bar' } }
    ]
  },
  { group: '🪟 Windows OS', label: 'Windows › Power & Sleep Settings',
    navPath: [
      { inst: 'On the Windows controller PC, click the <strong>Start button</strong>.', action: { do:'highlightOnly', sel:'.title-bar' } },
      { inst: 'Type <strong>sleep</strong> and open <strong>Power, Sleep &amp; Battery Settings</strong>.', action: { do:'highlightOnly', sel:'.title-bar' } }
    ]
  }

];


// ─────────────────────────────────────────────────────────────
// Build full step array from destination + user explanation
// ─────────────────────────────────────────────────────────────
function buildStepsFromDestination(dest, userExplanation) {
  return dest.navPath.map((s, i) => {
    if (i === dest.navPath.length - 1) {
      return { inst: userExplanation, action: s.action };
    }
    return { inst: s.inst, action: s.action };
  });
}


// ─────────────────────────────────────────────────────────────
// TROUBLESHOOTING DATA
// ─────────────────────────────────────────────────────────────
let tsData = [
  {
    id: 1,
    title: "SNR Reading is 0",
    destLabel: "Device › Advanced Parameters › Output Dampening Power",
    explanation: "Change <strong>Output Dampening Power</strong> to <strong>420</strong>, <strong>MPN Rate</strong> to <strong>7</strong>, <strong>Max Fill</strong> to <strong>7</strong>, <strong>Max Empty</strong> to <strong>8</strong>. Click <strong>Upload All</strong>. Then go to Device › False Echo Mapping, select <strong>Reset Mapping</strong> and click Execute. Finally click <strong>Load from Vessel</strong> and monitor SNR."
  },
  {
    id: 2,
    title: "Sensor Reading Full (Wrong Level)",
    destLabel: "Wizard › Step 4 › Full Calibration Distance (Top)",
    explanation: "Change <strong>Distance (Top)</strong> to <strong>1.64</strong>. Click <strong>Finish</strong> to save. Then click <strong>Load from Vessel</strong> to confirm the level reads correctly."
  },
  {
    id: 3,
    title: "Sensor Reset After Mapping Clear",
    destLabel: "Device › Devices Activations › Reset Button",
    explanation: "Click <strong>Reset</strong> — do <em>NOT</em> click Reset to Factory. Watch for a temperature alert confirming the reboot. Then click <strong>Load from Vessel</strong> to confirm ~20 mA output."
  },
  {
    id: 4,
    title: "Controller Goes to Sleep",
    destLabel: "Windows › Power & Sleep Settings",
    explanation: "Expand <strong>Screen, sleep, and hibernation timeouts</strong>. Set <strong>'Make my device sleep after'</strong> to <strong>Never</strong>. Screen turning off is OK — only the sleep setting causes disconnects."
  },
  {
    id: 5,
    title: "Auto Beam Selection Issues",
    destLabel: "Device › Advanced Parameters › Beams Tab › Auto Beam Selection",
    explanation: "Verify all 6 beam checkboxes at the top are checked. <strong>Uncheck Auto Beam Selection</strong> at the bottom. Click <strong>Upload All</strong> to apply. Then click <strong>Load from Vessel</strong> to confirm correct readings."
  }
];

function resolveSteps(item) {
  const dest = destinations.find(d => d.label === item.destLabel);
  if (!dest) {
    return [{ inst: item.explanation || 'No destination selected.', action: { do:'highlightOnly', sel:'#menuBar' } }];
  }
  return buildStepsFromDestination(dest, item.explanation);
}


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
function startGuide(item) {
  const steps = resolveSteps(item);
  activeGuide = { title: item.title, steps };
  guideIdx    = 0;
  document.getElementById('gPanel').classList.remove('hidden');
  document.getElementById('hlCircle').classList.remove('hidden');
  document.getElementById('gProb').textContent = item.title;
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
    if (!p.title || !p.title.trim()) return;
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
  b.innerHTML = `<p style="font-size:12px;color:#555;margin-bottom:14px">
    Each item needs a <strong>title</strong>, a <strong>destination</strong> (where to go in the software),
    and a short <strong>explanation</strong> of what to do when you get there.
    The navigation path is built automatically.</p>`;

  tsData.forEach((p, pi) => {
    const d = document.createElement('div');
    d.className = 'adm-block';

    // Build grouped destination dropdown
    let destOptions = '<option value="">— Select a destination —</option>';
    let currentGroup = '';
    destinations.forEach(dest => {
      if (dest.group !== currentGroup) {
        if (currentGroup) destOptions += '</optgroup>';
        destOptions += `<optgroup label="${dest.group}">`;
        currentGroup = dest.group;
      }
      const sel = p.destLabel === dest.label ? 'selected' : '';
      destOptions += `<option value="${esc(dest.label)}" ${sel}>${esc(dest.label)}</option>`;
    });
    if (currentGroup) destOptions += '</optgroup>';

    d.innerHTML = `
      <div class="adm-hdr">
        <input class="adm-tin" type="text" value="${esc(p.title)}"
          placeholder="Problem title (e.g. SNR Reading is 0)"
          oninput="tsData[${pi}].title=this.value">
        <button class="adm-del" onclick="delProb(${pi})">🗑</button>
      </div>
      <div style="margin-bottom:8px">
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:4px;text-transform:uppercase">
          Destination — where does this lead?
        </div>
        <select style="width:100%;border:1px solid #bbb;padding:6px 8px;font-size:12px;border-radius:4px;background:white"
          onchange="tsData[${pi}].destLabel=this.value">
          ${destOptions}
        </select>
      </div>
      <div>
        <div style="font-size:11px;font-weight:700;color:#555;margin-bottom:4px;text-transform:uppercase">
          Explanation — what should the technician do there?
        </div>
        <textarea style="width:100%;border:1px solid #bbb;padding:6px 8px;font-size:12px;border-radius:4px;resize:vertical;min-height:70px;font-family:inherit;line-height:1.5"
          placeholder="Describe what to do at the destination. Use &lt;strong&gt;text&lt;/strong&gt; for bold."
          oninput="tsData[${pi}].explanation=this.value">${esc(p.explanation)}</textarea>
        <div style="font-size:10px;color:#999;margin-top:2px">
          HTML ok: &lt;strong&gt;value&lt;/strong&gt; for bold, &lt;em&gt;text&lt;/em&gt; for italic.
        </div>
      </div>`;
    b.appendChild(d);
  });
}

function addProblem() {
  tsData.push({
    id: Date.now(),
    title: '',
    destLabel: '',
    explanation: ''
  });
  renderAdmin();
  renderTS();
  setTimeout(() => {
    const body = document.getElementById('adminBody');
    if (body) body.scrollTop = body.scrollHeight;
  }, 50);
}

function delProb(pi) {
  if (confirm('Delete this troubleshooting item?')) {
    tsData.splice(pi, 1);
    renderAdmin();
    renderTS();
  }
}

function saveAdmin() {
  // Explicitly read all field values from DOM before saving
  const blocks = document.querySelectorAll('#adminBody .adm-block');
  blocks.forEach((block, pi) => {
    if (!tsData[pi]) return;
    const titleEl  = block.querySelector('.adm-tin');
    const destEl   = block.querySelector('select');
    const explEl   = block.querySelector('textarea');
    if (titleEl)  tsData[pi].title       = titleEl.value.trim();
    if (destEl)   tsData[pi].destLabel   = destEl.value;
    if (explEl)   tsData[pi].explanation = explEl.value.trim();
  });
  renderTS();
  closeM('mAdmin');
  toast('✓ Saved');
}

function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}


// ─────────────────────────────────────────────────────────────
// INIT — called by index.html after all parts are loaded
// ─────────────────────────────────────────────────────────────
function initApp() {
  renderTS();
  const tb = document.getElementById('tbLevel');
  if (tb) tb.classList.add('active');
}
