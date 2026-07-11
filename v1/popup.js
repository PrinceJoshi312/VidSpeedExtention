// --- Tempo Extension Popup Controller ---

document.addEventListener('DOMContentLoaded', () => {
  const speedDisplay = document.getElementById('speedDisplay');
  const stepSelect = document.getElementById('stepSelect');
  const togglePresetsBtn = document.getElementById('togglePresetsBtn');
  const presetsPanel = document.getElementById('presetsPanel');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Resolve API Namespace (Chrome vs Firefox / WebExtensions)
  const browserAPI = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);
  let activeTabId = null;

  if (!browserAPI) {
    showNoVideoState();
    return;
  }

  // 1. Query the active tab
  browserAPI.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    activeTabId = tabs[0].id;
    
    // Check status of player in current tab
    browserAPI.tabs.sendMessage(activeTabId, { action: 'GET_STATUS' }, (response) => {
      if (browserAPI.runtime.lastError || !response) {
        // Content script not loaded (e.g. browser:// URL, extension store, or loaded before extension installed)
        showNoVideoState();
        return;
      }
      
      if (response.status === 'success') {
        updatePopupUI(response.speed, response.step);
      } else {
        showNoVideoState();
      }
    });
  });

  // UI state for pages without video
  function showNoVideoState() {
    speedDisplay.textContent = 'None';
    speedDisplay.style.fontSize = '1.8rem';
    speedDisplay.style.color = '#64748b';
  }

  // Update popup visual indicators
  function updatePopupUI(speed, step) {
    speedDisplay.textContent = speed.toFixed(2) + 'x';
    speedDisplay.style.fontSize = '2.5rem';
    speedDisplay.style.color = ''; // Restore default gradient style
    
    // Sync step size dropdown
    if (step) {
      stepSelect.value = step.toString();
    }
    
    // Sync presets active indicators
    presetButtons.forEach(btn => {
      const speedVal = parseFloat(btn.getAttribute('data-speed'));
      if (Math.abs(speedVal - speed) < 0.01) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // Change speed step
  stepSelect.addEventListener('change', () => {
    if (!activeTabId) return;
    const newStep = parseFloat(stepSelect.value);
    browserAPI.tabs.sendMessage(activeTabId, { action: 'SET_STEP', step: newStep });
  });

  // Toggle presets panel (collapsible setting)
  togglePresetsBtn.addEventListener('click', () => {
    presetsPanel.classList.toggle('show');
  });

  // Click handler for presets buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!activeTabId) return;
      const targetSpeed = parseFloat(btn.getAttribute('data-speed'));
      
      browserAPI.tabs.sendMessage(activeTabId, { action: 'SET_SPEED', speed: targetSpeed }, (response) => {
        if (response && response.status === 'success') {
          updatePopupUI(response.speed, parseFloat(stepSelect.value));
        }
      });
    });
  });
});
