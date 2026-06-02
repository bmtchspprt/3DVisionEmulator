let currentVessel = 'Coal';
let currentDetailTab = 'Overview';
let wizardStep = 1;
const WIZARD_STEPS = 4;

let simValues = {
  Coal:   { avgDist: 10.60, maxDist: 11.09, minDist: 8.93,  vol: 41.02, snr: 62.24, temp: 24.83, output: 16.89 },
  FlyAsh: { avgDist:  4.53, maxDist:  5.30, minDist: 3.44,  vol: 75.41, snr: 47.08, temp: 23.10, output: 15.60 }
};

let troubleshootingPaths = [
  {
    id: 1,
    title: "SNR Reading is 0",
    steps: [
      { target: "#menuDevice",     instruction: "Click the <strong>Device</strong> menu in the top menu bar." },
      { target: "#dropDevice .dd-item:nth-child(2)", instruction: "Select <strong>Advanced Parameters…</strong> (F3) from the Device menu." },
      { target: "#apDampening",    instruction: "Change <strong>Output Dampening Power</strong> to <strong>420</strong> seconds." },
      { target: "#apMPNRate",      instruction: "Change <strong>MPN Rate</strong> to <strong>7</strong> mass/hour." },
      { target: "#apMaxFill",      instruction: "Change <strong>Max Fill</strong> to <strong>7</strong> mass/hour." },
      { target: ".modal-btn-primary", instruction: "Click <strong>Upload All</strong> to push parameters to the sensor." },
      { target: "#menuDevice",     instruction: "Go back to the <strong>Device</strong> menu." },
      { target: "#dropDevice .dd-item:nth-child(14)", instruction: "Select <strong>Device False Echo Mapping…</strong>" },
      { target: "#falseEchoAction", instruction: "Choose <strong>Reset Mapping</strong> from the dropdown and click Execute." },
      { target: "#tbLoadVessel",   instruction: "Click <strong>Load from Vessel</strong> in the toolbar to take a new measurement. Repeat once per minute while monitoring SNR." }
    ]
  },
  {
    id: 2,
    title: "Sensor Reading Full (Wrong Level)",
    steps: [
      { target: "#tbWizard",       instruction: "Click the <strong>Wizard</strong> button in the toolbar to open the Configuration Wizard." },
      { target: "#wizardBody",     instruction: "Click <strong>Next</strong> through Steps 1, 2, and 3 to reach the <strong>Full/Empty Calibration</strong> screen (Step 4/4)." },
      { target: "#wizFullDist",    instruction: "In the <strong>Distance (Top)</strong> field, change the Full Calibration distance to <strong>1.64 feet</strong>. The sensor auto-calculates the rest." },
      { target: "#wizNext",        instruction: "Click <strong>Finish</strong> to apply the new calibration." },
      { target: "#tbLoadVessel",   instruction: "Click <strong>Load from Vessel</strong> to take a fresh reading and confirm the level has corrected." }
    ]
  },
  {
    id: 3,
    title: "Sensor Reset After Mapping Clear",
    steps: [
      { target: "#menuDevice",     instruction: "Click the <strong>Device</strong> menu at the top." },
      { target: "#dropDevice .dd-item:nth-child(16)", instruction: "Select <strong>Devices Activations…</strong> from the Device menu." },
      { target: "#btnReset",       instruction: "Click <strong>Reset</strong> — do <em>NOT</em> select Reset to Factory. This clears the echo map while keeping your programmed parameters." },
      { target: "#tbLoadVessel",   instruction: "Wait for the sensor to restart (watch for a temperature alert). Then click <strong>Load from Vessel</strong> to confirm it is back online at ~20 mA output." }
    ]
  },
  {
    id: 4,
    title: "Controller Goes to Sleep (Disconnects)",
    steps: [
      { target: ".title-bar",      instruction: "On the Windows desktop, click the <strong>Start button</strong> (bottom-left corner of the screen)." },
      { target: ".title-bar",      instruction: "Type <strong>sleep</strong> in the Start search box and open <strong>Power, Sleep & Battery Settings</strong>." },
      { target: ".title-bar",      instruction: "Expand the <strong>Screen, sleep, and hibernation timeouts</strong> section in the settings window." },
      { target: ".title-bar",      instruction: "Set <strong>"Make my device sleep after"</strong> to <strong>Never</strong>. The screen turning off is OK — only the sleep setting causes disconnects." }
    ]
  },
  {
    id: 5,
    title: "Auto Beam Selection Causing Issues",
    steps: [
      { target: "#menuDevice",     instruction: "Click the <strong>Device</strong> menu." },
      { target: "#dropDevice .dd-item:nth-child(2)", instruction: "Open <strong>Advanced Parameters…</strong>" },
      { target: ".modal-tab:nth-child(3)", instruction: "Click the <strong>Beams</strong> tab inside Advanced Parameters." },
      { target: "#apAutoBeam",     instruction: "Verify all beam checkboxes at the top are checked. Then <strong>uncheck Auto Beam Selection</strong> at the bottom." },
      { target: ".modal-btn-primary", instruction: "Click <strong>Upload All</strong> to apply the change." },
      { target: "#tbLoadVessel",   instruction: "Click <strong>Load from Vessel</strong> to confirm the sensor is measuring correctly." }
    ]
  }
];

let activeGuide = null;
let guideStepIndex = 0;

const menuMap = {
  menuFile:          'dropFile',
  menuCommunication: 'dropCommunication',
  menuEdit:          'dropEdit',
  menuDevice:        'dropDevice',
  menuTools:         'dropTools',
  menuHelp:          'dropHelp'
};

function toggleMenu(menuId) {
  const dropId = menuMap[menuId];
  const wasOpen = document.getElementById(dropId).classList.contains('show');
  closeMenus();
  if (!wasOpen) {
    document.getElementById(dropId).classList.add('show');
    document.getElementById(menuId).classList.add('open');
    const item = document.getElementById(menuId);
    const drop = document.getElementById(dropId);
    const rect = item.getBoundingClientRect();
    drop.style.left = rect.left + 'px';
    drop.style.top = rect.bottom + 'px';
  }
}

function closeMenus() {
  Object.keys(menuMap).forEach(m => document.getElementById(m).classList.remove('open'));
  Object.values(menuMap).forEach(d => document.getElementById(d).classList.remove('show'));
}

document.addEventListener('click', e => {
  if (!e.target.closest('.menu-bar')) closeMenus();
});

function selectVessel(name) {
  currentVessel = name;
  document.querySelectorAll('.vessel-tab').forEach(t => t.classList.remove('active-vessel'));
  document.getElementById('vessel' + name).classList.add('active-vessel');
}

function showHome() {
  document.getElementById('mainHome').classList.remove('hidden');
  document.getElementById('mainDetail').classList.add('hidden');
}

function openVesselDetail(vessel) {
  selectVessel(vessel);
  currentVessel = vessel;
  document.getElementById('mainHome').classList.add('hidden');
  document.getElementById('mainDetail').classList.remove('hidden');

  const isFlyAsh = vessel === 'FlyAsh';
  const label = isFlyAsh ? 'Fly Ash' : vessel;
  const vals = simValues[vessel] || simValues.Coal;

  document.getElementById('dtScannerSelect').value = label + ' (MV)';
  document.getElementById('ovVesselName').textContent = label + ' (MV)';
  document.getElementById('ovMaterial').textContent = label;
  document.getElementById('ovAvgDist').textContent = vals.avgDist.toFixed(2);
  document.getElementById('ovMinDist').textContent = vals.minDist.toFixed(2);
  document.getElementById('ovMaxDist').textContent = vals.maxDist.toFixed(2);
  document.getElementById('ovVolPct').textContent = vals.vol.toFixed(2);
  document.getElementById('ovTemp').textContent = vals.temp.toFixed(2);
  document.getElementById('ovSNR').textContent = vals.snr.toFixed(2);
  document.getElementById('ovOutput').textContent = vals.output.toFixed(2);

  const fillEl = document.getElementById('ovFill');
  fillEl.style.height = vals.vol + '%';
  fillEl.className = 'silo-fill ' + (isFlyAsh ? 'flyash-fill' : 'coal-fill');

  showDetailTab('Overview');
  draw3DSilo(vals.vol / 100, isFlyAsh);
  drawMiniMap();
}

function showDetailTab(tab) {
  currentDetailTab = tab;
  ['Overview','Logs','Parameters','Devices'].forEach(t => {
    const el = document.getElementById('tab' + t);
    const link = document.getElementById('dt' + t);
    if (el) el.classList.toggle('hidden', t !== tab);
    if (link) link.classList.toggle('active-tab', t === tab);
  });
  if (tab === 'Logs') { setTimeout(drawCharts, 50); }
}

function draw3DSilo(fillPct, isFlyAsh) {
  const canvas = document.getElementById('silo3dCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2, bodyTop = 80, bodyBot = H - 60, bodyW = 160, bodyH = bodyBot - bodyTop;
  const halfW = bodyW / 2;

  ctx.fillStyle = '#c0ccd8';
  ctx.fillRect(0, 0, W, H);

  ctx.beginPath();
  ctx.moveTo(cx - halfW, bodyTop);
  ctx.lineTo(cx, bodyTop - 50);
  ctx.lineTo(cx + halfW, bodyTop);
  ctx.closePath();
  ctx.fillStyle = '#9ab0c0';
  ctx.fill();
  ctx.strokeStyle = '#6a8090';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#445566';
  ctx.fillRect(cx - 8, bodyTop - 58, 16, 14);
  ctx.fillStyle = '#667788';
  ctx.fillRect(cx - 4, bodyTop - 62, 8, 6);

  ctx.fillStyle = '#8aaccc';
  ctx.fillRect(cx - halfW, bodyTop, bodyW, bodyH);

  const fillH = bodyH * fillPct;
  const fillTop = bodyBot - fillH;
  const grad = ctx.createLinearGradient(cx - halfW, fillTop, cx + halfW, bodyBot);
  if (isFlyAsh) {
    grad.addColorStop(0, 'rgba(30,80,200,0.85)');
    grad.addColorStop(0.5, 'rgba(80,140,255,0.9)');
    grad.addColorStop(1, 'rgba(20,60,180,0.95)');
  } else {
    grad.addColorStop(0, 'rgba(0,180,220,0.8)');
    grad.addColorStop(0.4, 'rgba(80,230,255,0.85)');
    grad.addColorStop(1, 'rgba(0,160,210,0.9)');
  }

  ctx.beginPath();
  ctx.moveTo(cx - halfW, fillTop);
  for (let x = cx - halfW; x <= cx + halfW; x += 8) {
    const wave = Math.sin((x - cx) * 0.08 + Date.now() * 0.002) * 4;
    ctx.lineTo(x, fillTop + wave);
  }
  ctx.lineTo(cx + halfW, bodyBot);
  ctx.lineTo(cx - halfW, bodyBot);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.strokeStyle = '#6090b0';
  ctx.lineWidth = 2;
  ctx.strokeRect(cx - halfW, bodyTop, bodyW, bodyH);

  ctx.beginPath();
  ctx.moveTo(cx - halfW, bodyBot);
  ctx.lineTo(cx, bodyBot + 40);
  ctx.lineTo(cx + halfW, bodyBot);
  ctx.closePath();
  ctx.fillStyle = '#7090aa';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#cc2222';
  ctx.font = 'bold 14px Roboto';
  ctx.fillText('F', cx + halfW + 8, bodyTop + 12);
  ctx.fillStyle = '#cc8800';
  ctx.fillText('E', cx + halfW + 8, bodyBot - 4);
}

function drawMiniMap() {
  const canvas = document.getElementById('miniMapCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#1a2a3a';
  ctx.fillRect(0, 0, W, H);
  for (let x = 0; x < W; x += 4) {
    for (let y = 0; y < H; y += 4) {
      const cx = x - W/2, cy = y - H/2;
      const r = Math.sqrt(cx*cx + cy*cy);
      const v = Math.cos(r * 0.2) * 0.5 + 0.5;
      const hue = v * 240;
      ctx.fillStyle = `hsl(${hue}, 80%, ${30 + v * 40}%)`;
      ctx.fillRect(x, y, 4, 4);
    }
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.strokeRect(1, 1, W-2, H-2);
}

function drawCharts() {
  const times = ['10:35','10:40','10:45','10:50','10:55'];
  drawLineChart('chartAvgDist', times, [4.1,4.0,4.2,4.1,4.0], '#2244cc', 0, 18, '[m]');
  drawLineChart('chartVolume',  times, [75,75,75,80,80],       '#2244cc', 0, 100, '[%]');
  drawLineChart('chartSNR',     times, [40,40,40,65,50],       '#cc2222', 0, 100, '[dB]');
  drawLineChart('chartTemp',    times, [25,25,25,25,25],       '#44aa44', -50, 200, '[C]');
}

function drawLineChart(id, labels, data, color, yMin, yMax, unit) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const pad = { t:10, r:10, b:40, l:40 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, W, H);

  const yRange = yMax - yMin;
  const xStep = cW / (labels.length - 1);

  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const y = pad.t + cH - (i / 5) * cH;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(pad.l + cW, y); ctx.stroke();
    const val = (yMin + (i / 5) * yRange).toFixed(0);
    ctx.fillStyle = '#888'; ctx.font = '9px Roboto'; ctx.textAlign = 'right';
    ctx.fillText(val, pad.l - 4, y + 3);
  }

  ctx.fillStyle = '#555'; ctx.font = '9px Roboto'; ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    const x = pad.l + i * xStep;
    ctx.fillText(l, x, H - 6);
    ctx.strokeStyle = '#e8e8e8'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, pad.t); ctx.lineTo(x, pad.t + cH); ctx.stroke();
  });

  ctx.fillStyle = '#666'; ctx.font = '9px Roboto'; ctx.textAlign = 'left';
  ctx.fillText(unit, 2, 16);

  ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round';
  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.l + i * xStep;
    const y = pad.t + cH - ((v - yMin) / yRange) * cH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.beginPath();
  data.forEach((v, i) => {
    const x = pad.l + i * xStep;
    const y = pad.t + cH - ((v - yMin) / yRange) * cH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.lineTo(pad.l + (data.length-1)*xStep, pad.t + cH);
  ctx.lineTo(pad.l, pad.t + cH);
  ctx.closePath();
  const aGrad = ctx.createLinearGradient(0, pad.t, 0, pad.t + cH);
  aGrad.addColorStop(0, color + '33');
  aGrad.addColorStop(1, color + '05');
  ctx.fillStyle = aGrad;
  ctx.fill();
}

function setToolbarMode(mode) {
  document.querySelectorAll('.tb-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tbLevel').classList.add('active');
  showToast('Mode: ' + mode);
}

function simulateConnect() {
  showToast('Connecting to vessel...');
  setTimeout(() => showToast('✓ Connected to ' + currentVessel), 1200);
}

function simulateLoad() {
  showToast('Loading measurement from vessel...');
  const v = simValues[currentVessel];
  if (v) {
    v.avgDist = +(v.avgDist + (Math.random() - 0.5) * 0.3).toFixed(2);
    v.snr = +(v.snr + (Math.random() - 0.5) * 2).toFixed(2);
    updateHomeCards();
  }
  setTimeout(() => showToast('✓ Measurement updated'), 800);
}

function updateHomeCards() {
  const c = simValues.Coal, f = simValues.FlyAsh;
  if (c) {
    document.getElementById('coalAvgDist').textContent = c.avgDist + ' m';
    document.getElementById('coalMaxDist').textContent = c.maxDist + ' m';
    document.getElementById('coalMinDist').textContent = c.minDist + ' m';
    document.getElementById('coalVol').textContent = c.vol + ' %';
    document.getElementById('coalFill').style.height = c.vol + '%';
  }
  if (f) {
    document.getElementById('flyashAvgDist').textContent = f.avgDist + ' m';
    document.getElementById('flyashMaxDist').textContent = f.maxDist + ' m';
    document.getElementById('flyashMinDist').textContent = f.minDist + ' m';
    document.getElementById('flyashVol').textContent = f.vol + ' %';
    document.getElementById('flyashFill').style.height = f.vol + '%';
  }
}

function uploadAll() {
  showToast('Uploading parameters to device...');
  closeModal('modalAdvanced');
  setTimeout(() => showToast('✓ Parameters uploaded successfully'), 1000);
}

function openAdvancedParams()    { openModal('modalAdvanced'); }
function openDeviceActivations() { openModal('modalActivations'); }
function openFalseEchoMapping()  { openModal('modalFalseEcho'); }
function openEchoCurveAnalysis() { openModal('modalEchoCurve'); }
function openVDC()               { openModal('modalVDC'); }

function openModal(id)  { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function switchModalTab(modalPrefix, tabName) {
  if (modalPrefix === 'adv') {
    ['Basic','Advanced','Beams'].forEach(t => {
      const el = document.getElementById('adv' + t);
      if (el) el.classList.toggle('hidden', t !== tabName);
    });
    document.querySelectorAll('.modal-tab').forEach((btn, i) => {
      const tabs = ['Basic','Advanced','Beams'];
      btn.classList.toggle('active-modal-tab', tabs[i] === tabName);
    });
  }
}

function doReset() {
  closeModal('modalActivations');
  showToast('Sensor resetting… watch for temperature alert');
  setTimeout(() => showToast('✓ Sensor back online — output: 20 mA'), 3000);
}

function confirmFactoryReset() {
  if (confirm('WARNING: Reset to Factory will erase all programmed parameters.\n\nAre you sure?')) {
    closeModal('modalActivations');
    showToast('⚠ Factory reset complete — all parameters cleared');
  }
}

function executeFalseEcho() {
  const action = document.getElementById('falseEchoAction').value;
  document.getElementById('falseEchoStatus').textContent = 'Executing: ' + action + '... Calculating...';
  setTimeout(() => {
    document.getElementById('falseEchoStatus').textContent = '✓ ' + action + ' completed successfully.';
  }, 2000);
}

function startEchoAnalysis() {
  document.getElementById('echoStatus').textContent = 'Server Echo Curve analysis status: Active ✓';
  showToast('Echo Curve Analysis started');
}
function stopEchoAnalysis() {
  document.getElementById('echoStatus').textContent = 'Server Echo Curve analysis status: Not active.';
  showToast('Echo Curve Analysis stopped');
}
function openEchoViewer() {
  showToast('Opening Echo Curve Viewer...');
  closeModal('modalEchoCurve');
}

function openWizardDialog() {
  wizardStep = 1;
  renderWizardStep();
  openModal('modalWizard');
}

function renderWizardStep() {
  document.getElementById('wizardTitle').textContent = currentVessel + ' - Configuration Wizard';
  const body = document.getElementById('wizardBody');
  const nextBtn = document.getElementById('wizNext');
  const backBtn = document.getElementById('wizBack');

  backBtn.disabled = wizardStep === 1;
  backBtn.style.opacity = wizardStep === 1 ? '0.5' : '1';

  if (wizardStep === WIZARD_STEPS) {
    nextBtn.textContent = 'Finish';
    nextBtn.onclick = () => { closeModal('modalWizard'); showToast('✓ Configuration saved'); };
  } else {
    nextBtn.textContent = 'Next ▶';
    nextBtn.onclick = () => wizardNav(1);
  }

  const steps = { 1: renderWizStep1, 2: renderWizStep2, 3: renderWizStep3, 4: renderWizStep4 };
  body.innerHTML = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'wizard-body';
  const left = document.createElement('div');
  left.className = 'wizard-left';
  left.innerHTML = steps[wizardStep]();
  const right = document.createElement('div');
  right.className = 'wizard-right';
  right.innerHTML = renderWizardPreview();
  wrapper.appendChild(left);
  wrapper.appendChild(right);
  body.appendChild(wrapper);
}

function renderWizStep1() {
  return `<div class="wiz-step-title">Step 1/4</div>
    <div class="wiz-section">General</div>
    <div class="wiz-field-row"><label class="wiz-field-label">Distance:</label><select class="wiz-field-select"><option>m</option><option>ft</option></select></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Temperature:</label><select class="wiz-field-select"><option>Celsius</option><option>Fahrenheit</option></select></div>
    <div class="wiz-section">Vessel Dimension</div>
    <strong class="wiz-section" style="font-size:12px">Top Shape</strong>
    <div class="wiz-field-row"><label class="wiz-field-label">Shape:</label><select class="wiz-field-select"><option>Cone</option><option>Flat</option></select></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Height:</label><input type="number" class="wiz-field-input" value="1.000"></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Diameter:</label><input type="number" class="wiz-field-input" value="0"></div>
    <strong class="wiz-section" style="font-size:12px">Center Shape</strong>
    <div class="wiz-field-row"><label class="wiz-field-label">Shape:</label><select class="wiz-field-select"><option>Cylinder</option><option>Rectangle</option></select></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Height:</label><input type="number" class="wiz-field-input" value="16"></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Diameter:</label><input type="number" class="wiz-field-input" value="9"></div>
    <strong class="wiz-section" style="font-size:12px">Bottom Shape</strong>
    <div class="wiz-field-row"><label class="wiz-field-label">Shape:</label><select class="wiz-field-select"><option>Cone</option><option>Flat</option></select></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Height:</label><input type="number" class="wiz-field-input" value="1.000"></div>
    <div class="wiz-field-row"><label class="wiz-field-label">Diameter:</label><input type="number" class="wiz-field-input" value="0"></div>`;
}

function renderWizStep2() {
  return `<div class="wiz-step-title">Step 2/4</div>
    <div class="wiz-section">Device Position</div>
    <label style="font-size:12px;display:flex;align-items:center;gap:6px;margin-bottom:10px"><input type="checkbox"> Set device angle manually</label>
    <table style="font-size:12px;border-collapse:collapse;width:100%">
      <tr style="background:#2a6db5;color:white">
        <th style="padding:5px 8px">Name</th><th style="padding:5px 8px">X</th><th style="padding:5px 8px">Y</th>
        <th style="padding:5px 8px">Z</th><th style="padding:5px 8px">Offset</th><th style="padding:5px 8px">Angle</th><th style="padding:5px 8px">Addr.</th>
      </tr>
      <tr style="background:#f0f4f8">
        <td style="padding:4px 8px">Coal_0</td>
        <td><input type="number" style="width:40px;border:1px solid #bbb;padding:2px;font-size:11px" value="0"></td>
        <td><input type="number" style="width:40px;border:1px solid #bbb;padding:2px;font-size:11px" value="0"></td>
        <td><input type="number" style="width:40px;border:1px solid #bbb;padding:2px;font-size:11px" value="18"></td>
        <td><input type="number" style="width:40px;border:1px solid #bbb;padding:2px;font-size:11px" value="0"></td>
        <td><input type="number" style="width:44px;border:1px solid #bbb;padding:2px;font-size:11px" value="180"></td>
        <td><input type="number" style="width:40px;border:1px solid #bbb;padding:2px;font-size:11px" value="0"></td>
      </tr>
    </table>`;
}

function renderWizStep3() {
  return `<div class="wiz-step-title">Step 3/4</div>
    <div class="wiz-section">Device Position</div>
    <table style="font-size:12px;border-collapse:collapse;width:100%;margin-bottom:14px">
      <tr style="background:#2a6db5;color:white">
        <th style="padding:5px 8px">Name</th><th style="padding:5px 8px">X</th><th style="padding:5px 8px">Y</th>
        <th style="padding:5px 8px">Z</th><th style="padding:5px 8px">Offset</th><th style="padding:5px 8px">Angle</th><th style="padding:5px 8px">Addr.</th>
      </tr>
      <tr style="background:#f0f4f8">
        <td style="padding:4px 8px">Coal_0</td><td style="padding:4px 8px">0</td><td style="padding:4px 8px">0</td>
        <td style="padding:4px 8px">18</td><td style="padding:4px 8px">0</td><td style="padding:4px 8px">180</td><td style="padding:4px 8px">0</td>
      </tr>
    </table>
    <div class="wiz-section">Filling Points</div>
    <table style="font-size:12px;border-collapse:collapse;width:100%;margin-bottom:8px">
      <tr style="background:#2a6db5;color:white"><th style="padding:5px 50px">X</th><th style="padding:5px 50px">Y</th></tr>
    </table>
    <div style="display:flex;gap:8px">
      <button class="modal-btn" style="font-size:11px">Add</button>
      <button class="modal-btn" style="font-size:11px">Delete</button>
      <button class="modal-btn" style="font-size:11px">Clear</button>
    </div>`;
}

function renderWizStep4() {
  return `<div class="wiz-step-title">Step 4/4</div>
    <div class="wiz-section">Device Position</div>
    <table style="font-size:12px;border-collapse:collapse;width:100%;margin-bottom:14px">
      <tr style="background:#2a6db5;color:white">
        <th style="padding:5px 8px">Name</th><th style="padding:5px 8px">X</th><th style="padding:5px 8px">Y</th>
        <th style="padding:5px 8px">Z</th><th style="padding:5px 8px">Offset</th><th style="padding:5px 8px">Angle</th><th style="padding:5px 8px">Addr.</th>
      </tr>
      <tr style="background:#f0f4f8">
        <td style="padding:4px 8px">Coal_0</td><td style="padding:4px 8px">0</td><td style="padding:4px 8px">0</td>
        <td style="padding:4px 8px">18</td><td style="padding:4px 8px">0</td><td style="padding:4px 8px">180</td><td style="padding:4px 8px">0</td>
      </tr>
    </table>
    <div class="wiz-section">Filling Points</div>
    <table style="font-size:12px;border-collapse:collapse;width:100%;margin-bottom:8px">
      <tr style="background:#2a6db5;color:white"><th style="padding:5px 50px">X</th><th style="padding:5px 50px">Y</th></tr>
    </table>
    <div style="display:flex;gap:8px;margin-bottom:16px">
      <button class="modal-btn" style="font-size:11px">Add</button>
      <button class="modal-btn" style="font-size:11px">Delete</button>
      <button class="modal-btn" style="font-size:11px">Clear</button>
    </div>
    <div class="wiz-section">Full Empty Calibration</div>
    <table style="font-size:12px;width:100%">
      <tr>
        <td style="padding:4px 0;width:80px">Full Calib</td>
        <td><input type="number" class="wiz-field-input" style="width:70px" value="17"></td>
        <td style="padding:0 8px">+</td>
        <td><input type="number" id="wizFullDist" class="wiz-field-input" style="width:70px" value="1"></td>
        <td style="padding:0 8px">=</td>
        <td><input type="number" class="wiz-field-input" style="width:70px;background:#eee" value="18" readonly></td>
      </tr>
      <tr>
        <td style="padding:4px 0">Empty Calib</td>
        <td><input type="number" class="wiz-field-input" style="width:70px" value="0"></td>
        <td style="padding:0 8px">+</td>
        <td><input type="number" class="wiz-field-input" style="width:70px" value="18"></td>
        <td style="padding:0 8px">=</td>
        <td><input type="number" class="wiz-field-input" style="width:70px;background:#eee" value="18" readonly></td>
      </tr>
    </table>
    <div style="display:flex;gap:8px;margin-top:12px">
      <button class="modal-btn" style="font-size:11px">Default</button>
      <button class="modal-btn" style="font-size:11px">View Table</button>
    </div>`;
}

function renderWizardPreview() {
  return `<svg width="260" height="320" viewBox="0 0 260 320" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="wg1" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#c8c060"/><stop offset="50%" stop-color="#e8e070"/><stop offset="100%" stop-color="#b8b050"/></linearGradient></defs>
    <polygon points="130,30 200,70 200,280 60,280 60,70" fill="url(#wg1)" stroke="#a09040" stroke-width="2"/>
    <polygon points="60,70 130,30 200,70" fill="#d0c860" stroke="#a09040" stroke-width="1.5"/>
    <polygon points="60,280 200,280 180,310 80,310" fill="#b0a840"/>
    <rect x="122" y="14" width="16" height="20" fill="#445566" rx="2"/>
    <rect x="126" y="6" width="8" height="10" fill="#667788" rx="1"/>
    <line x1="122" y1="34" x2="60" y2="70" stroke="#cc2222" stroke-width="2" stroke-dasharray="4,2"/>
    <text x="205" y="74" fill="#cc2222" font-size="13" font-weight="bold" font-family="Roboto">F</text>
    <text x="205" y="284" fill="#cc8800" font-size="13" font-weight="bold" font-family="Roboto">E</text>
    <circle cx="130" cy="34" r="6" fill="#2244bb" stroke="#88aaff" stroke-width="1.5"/>
  </svg>`;
}

function wizardNav(dir) {
  wizardStep = Math.max(1, Math.min(WIZARD_STEPS, wizardStep + dir));
  renderWizardStep();
}

let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 2800);
}

function renderTSPanel() {
  const list = document.getElementById('tsProblemList');
  list.innerHTML = '';
  if (troubleshootingPaths.length === 0) {
    list.innerHTML = '<div class="ts-empty">No problems configured yet.<br>Click ✎ to add paths.</div>';
    return;
  }
  troubleshootingPaths.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'ts-problem-btn';
    btn.textContent = '⚡ ' + p.title;
    btn.onclick = () => startGuide(p);
    list.appendChild(btn);
  });
}

let tsPanelMinimized = false;
function toggleTSPanel() {
  tsPanelMinimized = !tsPanelMinimized;
  const body = document.getElementById('tsBody');
  body.classList.toggle('minimized', tsPanelMinimized);
  document.getElementById('tsMinBtn').textContent = tsPanelMinimized ? '+' : '−';
}

(function initDrag() {
  const panel = document.getElementById('tsPanel');
  const header = document.getElementById('tsPanelHeader');
  let isDragging = false, startX, startY, origLeft, origTop;
  header.addEventListener('mousedown', e => {
    if (e.target.closest('.ts-hbtn')) return;
    isDragging = true;
    startX = e.clientX; startY = e.clientY;
    const rect = panel.getBoundingClientRect();
    origLeft = rect.left; origTop = rect.top;
    panel.style.right = 'auto';
    panel.style.bottom = 'auto';
    panel.style.left = origLeft + 'px';
    panel.style.top = origTop + 'px';
    e.preventDefault();
  });
  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    panel.style.left = (origLeft + e.clientX - startX) + 'px';
    panel.style.top = (origTop + e.clientY - startY) + 'px';
  });
  document.addEventListener('mouseup', () => { isDragging = false; });
})();

function startGuide(problem) {
  activeGuide = problem;
  guideStepIndex = 0;
  document.getElementById('guidePanel').classList.remove('hidden');
  document.getElementById('highlightRing').classList.remove('hidden');
  document.getElementById('gpProblem').textContent = problem.title;
  renderGuideStep();
}

function renderGuideStep() {
  if (!activeGuide) return;
  const steps = activeGuide.steps;
  const step = steps[guideStepIndex];
  const total = steps.length;

  document.getElementById('gpTitle').textContent = 'Step ' + (guideStepIndex + 1) + ' of ' + total;
  document.getElementById('gpCounter').textContent = (guideStepIndex + 1) + ' / ' + total;
  document.getElementById('gpInstruction').innerHTML = step.instruction;

  const prev = document.getElementById('gpPrev');
  prev.disabled = guideStepIndex === 0;
  prev.style.opacity = guideStepIndex === 0 ? '0.4' : '1';

  const next = document.getElementById('gpNext');
  if (guideStepIndex === total - 1) {
    next.textContent = 'Done ✓';
    next.onclick = endGuide;
  } else {
    next.textContent = 'Next ▶';
    next.onclick = () => guideNav(1);
  }

  positionArrow(step.target);
}

function guideNav(dir) {
  if (!activeGuide) return;
  guideStepIndex = Math.max(0, Math.min(activeGuide.steps.length - 1, guideStepIndex + dir));
  renderGuideStep();
}

function endGuide() {
  activeGuide = null;
  document.getElementById('guidePanel').classList.add('hidden');
  document.getElementById('guideArrow').classList.add('hidden');
  document.getElementById('highlightRing').classList.add('hidden');
  showToast('Guided walkthrough complete');
}

function positionArrow(selector) {
  const arrow = document.getElementById('guideArrow');
  const ring = document.getElementById('highlightRing');
  let el = null;
  try { el = document.querySelector(selector); } catch(e) {}
  if (!el) { el = document.getElementById('menuBar') || document.getElementById('toolbar'); }
  if (!el) { arrow.classList.add('hidden'); ring.classList.add('hidden'); return; }

  const rect = el.getBoundingClientRect();
  arrow.classList.remove('hidden');
  arrow.style.left = (rect.left + rect.width / 2 - 25) + 'px';
  arrow.style.top = (rect.top - 58) + 'px';
  ring.classList.remove('hidden');
  ring.style.left = (rect.left - 4) + 'px';
  ring.style.top = (rect.top - 4) + 'px';
  ring.style.width = (rect.width + 8) + 'px';
  ring.style.height = (rect.height + 8) + 'px';
}

function openAdmin() {
  renderAdminPanel();
  openModal('adminPanel');
}

function renderAdminPanel() {
  const body = document.getElementById('adminBody');
  body.innerHTML = `<p style="font-size:12px;color:#555;margin-bottom:14px">
    Each problem has a title and steps. Each step has a <strong>CSS selector</strong> (to target the UI element) and an <strong>instruction</strong> for the technician.</p>`;

  troubleshootingPaths.forEach((problem, pi) => {
    const block = document.createElement('div');
    block.className = 'admin-problem-block';
    block.innerHTML = `
      <div class="admin-problem-header">
        <input class="admin-problem-title-input" type="text" value="${escHtml(problem.title)}"
          oninput="troubleshootingPaths[${pi}].title = this.value; renderTSPanel()">
        <button class="admin-delete-problem" onclick="deleteProblem(${pi})">🗑 Delete</button>
      </div>
      <div class="admin-steps-list" id="adminSteps_${pi}"></div>
      <button class="admin-add-step" onclick="addStep(${pi})">+ Add Step</button>`;
    body.appendChild(block);
    renderAdminSteps(pi);
  });
}

function renderAdminSteps(pi) {
  const container = document.getElementById('adminSteps_' + pi);
  if (!container) return;
  container.innerHTML = '';
  troubleshootingPaths[pi].steps.forEach((step, si) => {
    const row = document.createElement('div');
    row.className = 'admin-step-row';
    row.innerHTML = `
      <div class="admin-step-num">${si + 1}</div>
      <div class="admin-step-fields">
        <span class="admin-target-hint">CSS Selector (target element):</span>
        <input class="admin-step-target" type="text" value="${escHtml(step.target)}"
          oninput="troubleshootingPaths[${pi}].steps[${si}].target = this.value"
          placeholder="#elementId or .className">
        <span class="admin-target-hint">Instruction text (HTML allowed):</span>
        <textarea class="admin-step-instruction"
          oninput="troubleshootingPaths[${pi}].steps[${si}].instruction = this.value"
          >${escHtml(step.instruction)}</textarea>
      </div>
      <button class="admin-step-delete" onclick="deleteStep(${pi},${si})">✕</button>`;
    container.appendChild(row);
  });
}

function addNewProblem() {
  troubleshootingPaths.push({
    id: Date.now(),
    title: 'New Problem ' + (troubleshootingPaths.length + 1),
    steps: [{ target: '#menuDevice', instruction: 'Describe what the technician should do here.' }]
  });
  renderAdminPanel();
  renderTSPanel();
}

function addStep(pi) {
  troubleshootingPaths[pi].steps.push({ target: '', instruction: 'Enter step instruction here.' });
  renderAdminSteps(pi);
}

function deleteStep(pi, si) {
  troubleshootingPaths[pi].steps.splice(si, 1);
  renderAdminSteps(pi);
}

function deleteProblem(pi) {
  if (confirm('Delete this problem and all its steps?')) {
    troubleshootingPaths.splice(pi, 1);
    renderAdminPanel();
    renderTSPanel();
  }
}

function saveAdminAndClose() {
  renderTSPanel();
  closeModal('adminPanel');
  showToast('✓ Troubleshooting paths saved');
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

setInterval(() => {
  ['Coal','FlyAsh'].forEach(v => {
    const d = simValues[v];
    d.temp   = +(d.temp   + (Math.random()-0.5)*0.05).toFixed(2);
    d.snr    = +(Math.max(0, d.snr + (Math.random()-0.5)*0.8)).toFixed(2);
    d.output = +(d.output + (Math.random()-0.5)*0.02).toFixed(2);
  });
  if (!document.getElementById('mainDetail').classList.contains('hidden') && currentDetailTab === 'Overview') {
    const v = simValues[currentVessel];
    if (v) {
      safeSet('ovSNR',    v.snr.toFixed(2));
      safeSet('ovTemp',   v.temp.toFixed(2));
      safeSet('ovOutput', v.output.toFixed(2));
    }
  }
  const canvas = document.getElementById('silo3dCanvas');
  if (canvas && !document.getElementById('tabOverview').classList.contains('hidden')) {
    draw3DSilo(simValues[currentVessel].vol / 100, currentVessel === 'FlyAsh');
  }
}, 2000);

function safeSet(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

document.addEventListener('DOMContentLoaded', () => {
  renderTSPanel();
  document.getElementById('tbLevel').classList.add('active');
});
