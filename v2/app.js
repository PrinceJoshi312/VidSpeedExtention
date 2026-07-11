document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const sourcePanel = document.getElementById('sourcePanel');
  const playerSection = document.getElementById('playerSection');
  const dropZone = document.getElementById('dropZone');
  const fileInput = document.getElementById('fileInput');
  const videoUrlInput = document.getElementById('videoUrlInput');
  const loadUrlBtn = document.getElementById('loadUrlBtn');
  
  const videoWrapper = document.getElementById('videoWrapper');
  const mainVideo = document.getElementById('mainVideo');
  const speedHud = document.getElementById('speedHud');
  const speedHudValue = document.getElementById('speedHudValue');
  
  // Custom Control Elements
  const progressBarContainer = document.getElementById('progressBarContainer');
  const progressBar = document.getElementById('progressBar');
  const progressFilled = document.getElementById('progressFilled');
  const progressHandle = document.getElementById('progressHandle');
  const progressHover = document.getElementById('progressHover');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');
  const currentTimeDisplay = document.getElementById('currentTime');
  const durationTimeDisplay = document.getElementById('durationTime');
  const changeSourceBtn = document.getElementById('changeSourceBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  
  // Dashboard & Settings Elements
  const speedDisplay = document.getElementById('speedDisplay');
  const videoSpeedBadge = document.getElementById('videoSpeedBadge');
  const stepSelect = document.getElementById('stepSelect');
  const togglePresetsBtn = document.getElementById('togglePresetsBtn');
  const presetsPanel = document.getElementById('presetsPanel');
  const presetButtons = document.querySelectorAll('.preset-btn');

  // --- State Variables ---
  let speedStep = parseFloat(stepSelect.value);
  let currentSpeed = 1.0;
  let hudTimeout = null;
  let controlsTimeout = null;

  // --- Initialization & Setup ---
  // Speed bounds
  const MIN_SPEED = 0.1;
  const MAX_SPEED = 16.0;

  // Badge overlay button controls
  const badgeDownBtn = document.getElementById('badgeDownBtn');
  const badgeUpBtn = document.getElementById('badgeUpBtn');
  const badgeText = document.getElementById('badgeText');

  if (badgeDownBtn) {
    badgeDownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      updateSpeed(currentSpeed - speedStep);
    });
  }
  if (badgeUpBtn) {
    badgeUpBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      updateSpeed(currentSpeed + speedStep);
    });
  }
  if (badgeText) {
    badgeText.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      updateSpeed(1.0);
    });
  }
  if (videoSpeedBadge) {
    const preventPropagation = (e) => {
      e.stopPropagation();
    };
    videoSpeedBadge.addEventListener('click', preventPropagation);
    videoSpeedBadge.addEventListener('mousedown', preventPropagation);
    videoSpeedBadge.addEventListener('mouseup', preventPropagation);
    videoSpeedBadge.addEventListener('dblclick', preventPropagation);
  }

  // Track step size adjustments
  stepSelect.addEventListener('change', () => {
    speedStep = parseFloat(stepSelect.value);
  });

  // --- Toggle Presets Panel (Hidden by default, no localStorage) ---
  togglePresetsBtn.addEventListener('click', () => {
    presetsPanel.classList.toggle('show');
  });

  // Setup Presets Buttons click handlers
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetSpeed = parseFloat(btn.getAttribute('data-speed'));
      updateSpeed(targetSpeed);
    });
  });

  // --- Source loading functions ---
  function loadVideoSource(source) {
    mainVideo.src = source;
    mainVideo.load();
    
    // Reset player states
    currentSpeed = 1.0;
    mainVideo.playbackRate = 1.0;
    updateSpeedometerDisplay();
    
    // Switch panels
    sourcePanel.classList.add('hidden');
    playerSection.classList.remove('hidden');
    
    // Force a visual play state sync
    playPauseBtn.querySelector('.play-icon').classList.remove('hidden');
    playPauseBtn.querySelector('.pause-icon').classList.add('hidden');
  }

  // File picker handler
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      loadVideoSource(fileUrl);
    }
  });

  // URL input loader
  loadUrlBtn.addEventListener('click', () => {
    const url = videoUrlInput.value.trim();
    if (url) {
      loadVideoSource(url);
    } else {
      alert('Please enter a valid video URL.');
    }
  });

  // Handle enter key in URL input
  videoUrlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      loadUrlBtn.click();
    }
  });

  // Drag and drop event listeners
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      const fileUrl = URL.createObjectURL(files[0]);
      loadVideoSource(fileUrl);
    }
  });

  // Return to source select
  changeSourceBtn.addEventListener('click', () => {
    mainVideo.pause();
    playerSection.classList.add('hidden');
    sourcePanel.classList.remove('hidden');
    videoUrlInput.value = '';
    fileInput.value = '';
  });

  // --- Speed Regulation System ---
  function updateSpeed(newSpeed) {
    // Clamp speed to legal HTML5 bounds
    newSpeed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, newSpeed));
    // Round to 2 decimal places to avoid floating point representation bugs (e.g. 1.3000000000000003)
    currentSpeed = Math.round(newSpeed * 100) / 100;
    
    // Apply speed to media element
    mainVideo.playbackRate = currentSpeed;
    
    // Update dashboard visual speedometer
    updateSpeedometerDisplay();

    // Trigger floating speed HUD overlay animation
    showSpeedHUD();
  }

  function updateSpeedometerDisplay() {
    speedDisplay.textContent = currentSpeed.toFixed(2) + 'x';
    
    // Update Video Speed Badge
    if (videoSpeedBadge) {
      const badgeTextEl = videoSpeedBadge.querySelector('.badge-text');
      if (badgeTextEl) {
        badgeTextEl.textContent = currentSpeed.toFixed(2) + 'x';
      } else {
        videoSpeedBadge.textContent = currentSpeed.toFixed(2) + 'x';
      }
      if (Math.abs(currentSpeed - 1.0) > 0.01) {
        videoSpeedBadge.classList.add('active-speed');
      } else {
        videoSpeedBadge.classList.remove('active-speed');
      }
      
      // Trigger pop animation
      videoSpeedBadge.classList.remove('pop');
      void videoSpeedBadge.offsetWidth; // Force reflow
      videoSpeedBadge.classList.add('pop');
      setTimeout(() => {
        videoSpeedBadge.classList.remove('pop');
      }, 300);
    }
    
    // Sync active state on presets grid
    presetButtons.forEach(btn => {
      const speedVal = parseFloat(btn.getAttribute('data-speed'));
      if (Math.abs(speedVal - currentSpeed) < 0.01) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  function showSpeedHUD() {
    // Update text
    speedHudValue.textContent = currentSpeed.toFixed(1) + 'x';
    
    // Reset/clear animations
    speedHud.classList.remove('hidden', 'flash-animate');
    
    // Force reflow
    void speedHud.offsetWidth;
    
    // Trigger CSS scaling and glow animation
    speedHud.classList.add('flash-animate');
    
    // Clear any previous hide trigger
    if (hudTimeout) clearTimeout(hudTimeout);
    
    // Set timer to fade it out
    hudTimeout = setTimeout(() => {
      speedHud.classList.remove('flash-animate');
      speedHud.classList.add('hidden');
    }, 900);
  }

  // --- Keyboard Control Interface ---
  document.addEventListener('keydown', (e) => {
    // Crucial: Bypass shortcuts when user is focused on textual input elements
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT' || document.activeElement.tagName === 'TEXTAREA') {
      return;
    }

    // Capture speed & playback hotkeys
    let keyHandled = false;

    // Detect Numpad + / standard + / =
    if (e.code === 'NumpadAdd' || e.key === '+' || e.key === '=') {
      updateSpeed(currentSpeed + speedStep);
      keyHandled = true;
    }
    // Detect Numpad - / standard -
    else if (e.code === 'NumpadSubtract' || e.key === '-' || e.key === '_') {
      updateSpeed(currentSpeed - speedStep);
      keyHandled = true;
    }
    // Detect Numpad * / standard *
    else if (e.code === 'NumpadMultiply' || e.key === '*') {
      updateSpeed(1.0);
      keyHandled = true;
    }
    // Detect Numpad 5: Toggle Play / Pause
    else if (e.code === 'Numpad5' || (e.code === 'Digit5' && e.location === 3)) {
      togglePlay();
      keyHandled = true;
    }
    // Detect Numpad 4: Seek Backward 5s
    else if (e.code === 'Numpad4' || (e.code === 'Digit4' && e.location === 3)) {
      seekDelta(-5);
      keyHandled = true;
    }
    // Detect Numpad 6: Seek Forward 5s
    else if (e.code === 'Numpad6' || (e.code === 'Digit6' && e.location === 3)) {
      seekDelta(5);
      keyHandled = true;
    }

    if (keyHandled) {
      e.preventDefault(); // Prevent page scrolling, browser zoom controls
    }
  });

  // Helper seek function
  function seekDelta(seconds) {
    if (!mainVideo.src) return;
    mainVideo.currentTime = Math.max(0, Math.min(mainVideo.duration || 0, mainVideo.currentTime + seconds));
    showControlsTemporarily();
  }

  // --- Custom Controls Logic ---

  // Play / Pause toggler
  function togglePlay() {
    if (!mainVideo.src) return;
    if (mainVideo.paused) {
      mainVideo.play();
    } else {
      mainVideo.pause();
    }
  }

  playPauseBtn.addEventListener('click', togglePlay);
  
  // Update play icons
  mainVideo.addEventListener('play', () => {
    playPauseBtn.querySelector('.play-icon').classList.add('hidden');
    playPauseBtn.querySelector('.pause-icon').classList.remove('hidden');
  });

  mainVideo.addEventListener('pause', () => {
    playPauseBtn.querySelector('.play-icon').classList.remove('hidden');
    playPauseBtn.querySelector('.pause-icon').classList.add('hidden');
  });

  // Click on video directly to play/pause
  mainVideo.addEventListener('click', togglePlay);

  // Time formatting helper (HH:MM:SS / MM:SS)
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return "00:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    let result = "";
    if (hrs > 0) {
      result += hrs + ":" + (mins < 10 ? "0" : "");
    }
    result += mins + ":" + (secs < 10 ? "0" : "") + secs;
    return result;
  }

  // Progress Bar Time Updates
  mainVideo.addEventListener('timeupdate', () => {
    if (!mainVideo.duration) return;
    const progressPercent = (mainVideo.currentTime / mainVideo.duration) * 100;
    progressFilled.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;
    currentTimeDisplay.textContent = formatTime(mainVideo.currentTime);
  });

  // Load duration when metadata finishes
  mainVideo.addEventListener('loadedmetadata', () => {
    durationTimeDisplay.textContent = formatTime(mainVideo.duration);
  });

  // Clicking/seeking progress bar
  function scrub(e) {
    if (!mainVideo.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const scrubPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    mainVideo.currentTime = scrubPercent * mainVideo.duration;
  }

  let isScrubbing = false;
  progressBarContainer.addEventListener('mousedown', (e) => {
    isScrubbing = true;
    scrub(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isScrubbing) scrub(e);
  });

  window.addEventListener('mouseup', () => {
    isScrubbing = false;
  });

  // Progress Bar Hover Indicator
  progressBarContainer.addEventListener('mousemove', (e) => {
    if (!mainVideo.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const hoverPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const hoverTime = hoverPercent * mainVideo.duration;
    
    progressHover.style.left = `${e.clientX - rect.left}px`;
    progressHover.textContent = formatTime(hoverTime);
  });

  // Mute / Unmute
  muteBtn.addEventListener('click', () => {
    mainVideo.muted = !mainVideo.muted;
    updateMuteUI();
  });

  function updateMuteUI() {
    if (mainVideo.muted || mainVideo.volume === 0) {
      muteBtn.querySelector('.volume-up').classList.add('hidden');
      muteBtn.querySelector('.volume-muted').classList.remove('hidden');
      volumeSlider.value = 0;
    } else {
      muteBtn.querySelector('.volume-up').classList.remove('hidden');
      muteBtn.querySelector('.volume-muted').classList.add('hidden');
      volumeSlider.value = mainVideo.volume;
    }
  }

  // Volume slider input
  volumeSlider.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    mainVideo.volume = val;
    mainVideo.muted = (val === 0);
    updateMuteUI();
  });

  // Fullscreen support
  fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      videoWrapper.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Track Fullscreen status for layout classes
  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      videoWrapper.classList.add('controls-active');
    } else {
      videoWrapper.classList.remove('controls-active');
    }
  });

  // Auto-hide controls overlay helper in fullscreen or inactive modes
  function showControlsTemporarily() {
    videoWrapper.classList.add('controls-active');
    if (controlsTimeout) clearTimeout(controlsTimeout);
    
    if (!mainVideo.paused) {
      controlsTimeout = setTimeout(() => {
        videoWrapper.classList.remove('controls-active');
      }, 2500);
    }
  }

  videoWrapper.addEventListener('mousemove', showControlsTemporarily);
  mainVideo.addEventListener('play', showControlsTemporarily);
});
