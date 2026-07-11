// --- Tempo Player Content Script ---

// State variables (runtime only, no persistence per requirements)
let speedStep = 0.25;
let hudTimeout = null;

// --- Helper: Find the most active video player on the page ---
function getActiveVideo() {
  const videos = Array.from(document.querySelectorAll('video'));
  if (videos.length === 0) return null;
  
  // 1. Try to find a video that is currently playing
  const playingVideo = videos.find(v => !v.paused && !v.ended && v.readyState > 2);
  if (playingVideo) return playingVideo;
  
  // 2. Fallback: Find the largest visible video on screen
  let bestVideo = null;
  let maxArea = 0;
  
  for (const video of videos) {
    const rect = video.getBoundingClientRect();
    const area = rect.width * rect.height;
    if (area > maxArea && rect.width > 0 && rect.height > 0) {
      maxArea = area;
      bestVideo = video;
    }
  }
  
  return bestVideo || videos[0];
}

// --- Shadow DOM Speed HUD Injection ---
function showSpeedHUD(speed) {
  let hudRoot = document.getElementById('__tempo_speed_hud_root__');
  
  if (!hudRoot) {
    hudRoot = document.createElement('div');
    hudRoot.id = '__tempo_speed_hud_root__';
    hudRoot.style.cssText = `
      position: fixed !important;
      top: 30px !important;
      right: 30px !important;
      z-index: 2147483647 !important;
      pointer-events: none !important;
      transition: none !important;
    `;
    document.body.appendChild(hudRoot);
    
    const shadow = hudRoot.attachShadow({ mode: 'open' });
    
    // Inject Scoped Styles for the HUD
    const style = document.createElement('style');
    style.textContent = `
      .hud-card {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: rgba(7, 9, 19, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #f8fafc !important;
        padding: 10px 22px !important;
        border-radius: 50px !important;
        backdrop-filter: blur(12px) !important;
        -webkit-backdrop-filter: blur(12px) !important;
        font-weight: 700 !important;
        font-size: 1.5rem !important;
        box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.2) !important;
        opacity: 0;
        transform: translate3d(0, -10px, 0) scale(0.95);
        transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        letter-spacing: -0.02em;
        text-shadow: 0 0 8px rgba(99, 102, 241, 0.5);
      }
      .hud-card.show {
        opacity: 1 !important;
        transform: translate3d(0, 0, 0) scale(1) !important;
      }
    `;
    shadow.appendChild(style);
    
    const card = document.createElement('div');
    card.id = 'hud-card';
    card.className = 'hud-card';
    shadow.appendChild(card);
  }
  
  const shadow = hudRoot.shadowRoot;
  const card = shadow.getElementById('hud-card');
  card.textContent = `${speed.toFixed(2)}x`;
  
  // Clear any existing transition timers
  if (hudTimeout) clearTimeout(hudTimeout);
  
  // Trigger animation
  card.classList.remove('show');
  void card.offsetWidth; // Force Reflow
  card.classList.add('show');
  
  hudTimeout = setTimeout(() => {
    card.classList.remove('show');
  }, 1000);
}

// --- Shadow DOM Video Speed Badge ---
function createOrUpdateBadge(video) {
  if (!video || !video.isConnected) return;
  
  const parent = video.parentElement;
  if (!parent) return;

  // Ensure parent is positioned to host our absolute badge
  const computedStyle = window.getComputedStyle(parent);
  if (computedStyle.position === 'static') {
    parent.style.position = 'relative';
  }

  let badgeHost = parent.querySelector('.__tempo_video_badge_host__');
  let badge = null;

  if (!badgeHost) {
    badgeHost = document.createElement('div');
    badgeHost.className = '__tempo_video_badge_host__';
    badgeHost.style.cssText = `
      position: absolute !important;
      top: 12px !important;
      right: 12px !important;
      z-index: 2147483647 !important;
      pointer-events: auto !important;
      width: auto !important;
      height: auto !important;
    `;
    
    const shadow = badgeHost.attachShadow({ mode: 'open' });
    
    const style = document.createElement('style');
    style.textContent = `
      .tempo-badge {
        font-family: 'Outfit', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        background: rgba(15, 23, 42, 0.75) !important;
        border: 1px solid rgba(255, 255, 255, 0.15) !important;
        color: #ffffff !important;
        padding: 4px 10px !important;
        border-radius: 20px !important;
        backdrop-filter: blur(8px) !important;
        -webkit-backdrop-filter: blur(8px) !important;
        font-weight: 600 !important;
        font-size: 11px !important;
        line-height: 1.2 !important;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        cursor: default !important;
        user-select: none !important;
        opacity: 0.35;
        transform: scale(1);
        transition: opacity 0.3s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background-color 0.3s ease, border-color 0.3s ease !important;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap !important;
      }
      .tempo-badge.active-speed {
        opacity: 0.85;
        background: rgba(15, 23, 42, 0.8) !important;
        border-color: rgba(99, 102, 241, 0.5) !important;
        box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2), 0 0 8px rgba(99, 102, 241, 0.1) !important;
      }
      .tempo-badge:hover {
        opacity: 1 !important;
        transform: scale(1.05) !important;
        background: rgba(15, 23, 42, 0.9) !important;
        border-color: rgba(99, 102, 241, 0.8) !important;
      }
      .tempo-badge.pop {
        transform: scale(1.3) !important;
        background: rgba(99, 102, 241, 0.95) !important;
        border-color: rgba(255, 255, 255, 0.6) !important;
        opacity: 1 !important;
      }
    `;
    shadow.appendChild(style);
    
    badge = document.createElement('div');
    badge.id = 'tempo-badge-element';
    badge.className = 'tempo-badge';
    shadow.appendChild(badge);
    
    parent.appendChild(badgeHost);
  } else {
    badge = badgeHost.shadowRoot.getElementById('tempo-badge-element');
  }

  if (badge) {
    const currentSpeed = video.playbackRate;
    badge.textContent = `${currentSpeed.toFixed(2)}x`;
    
    if (Math.abs(currentSpeed - 1.0) > 0.01) {
      badge.classList.add('active-speed');
    } else {
      badge.classList.remove('active-speed');
    }
  }
}

function triggerBadgePop(video) {
  if (!video) return;
  const parent = video.parentElement;
  if (!parent) return;
  const badgeHost = parent.querySelector('.__tempo_video_badge_host__');
  if (badgeHost && badgeHost.shadowRoot) {
    const badge = badgeHost.shadowRoot.getElementById('tempo-badge-element');
    if (badge) {
      badge.classList.remove('pop');
      void badge.offsetWidth; // force reflow
      badge.classList.add('pop');
      setTimeout(() => {
        badge.classList.remove('pop');
      }, 300);
    }
  }
}

function handleRateChange(video) {
  createOrUpdateBadge(video);
  triggerBadgePop(video);
}

function scanAndSetupVideos() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (!video.__tempo_badge_setup) {
      video.__tempo_badge_setup = true;
      
      createOrUpdateBadge(video);
      
      video.addEventListener('ratechange', () => {
        handleRateChange(video);
      });
      
      video.addEventListener('play', () => {
        createOrUpdateBadge(video);
      });
    } else {
      const parent = video.parentElement;
      if (parent && !parent.querySelector('.__tempo_video_badge_host__')) {
        createOrUpdateBadge(video);
      }
    }
  });
}

// Start scanning for videos and setup badges
setInterval(scanAndSetupVideos, 1000);
scanAndSetupVideos();

// --- Keyboard Event Handler ---
document.addEventListener('keydown', (e) => {
  // Safe exit if user is actively writing input
  const activeNode = document.activeElement;
  if (
    activeNode.tagName === 'INPUT' || 
    activeNode.tagName === 'SELECT' || 
    activeNode.tagName === 'TEXTAREA' || 
    activeNode.isContentEditable
  ) {
    return;
  }
  
  const video = getActiveVideo();
  if (!video) return;
  
  let keyHandled = false;
  
  // Numpad + / laptop + / =
  if (e.code === 'NumpadAdd' || e.key === '+' || e.key === '=') {
    const targetSpeed = Math.min(16.0, Math.max(0.1, video.playbackRate + speedStep));
    video.playbackRate = Math.round(targetSpeed * 100) / 100;
    showSpeedHUD(video.playbackRate);
    keyHandled = true;
  }
  // Numpad - / laptop -
  else if (e.code === 'NumpadSubtract' || e.key === '-' || e.key === '_') {
    const targetSpeed = Math.min(16.0, Math.max(0.1, video.playbackRate - speedStep));
    video.playbackRate = Math.round(targetSpeed * 100) / 100;
    showSpeedHUD(video.playbackRate);
    keyHandled = true;
  }
  // Numpad * / laptop *
  else if (e.code === 'NumpadMultiply' || e.key === '*') {
    video.playbackRate = 1.0;
    showSpeedHUD(1.0);
    keyHandled = true;
  }
  // Numpad 5: Toggle Play / Pause
  else if (e.code === 'Numpad5' || (e.code === 'Digit5' && e.location === 3)) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
    keyHandled = true;
  }
  // Numpad 4: Seek Backward 5s
  else if (e.code === 'Numpad4' || (e.code === 'Digit4' && e.location === 3)) {
    video.currentTime = Math.max(0, video.currentTime - 5);
    keyHandled = true;
  }
  // Numpad 6: Seek Forward 5s
  else if (e.code === 'Numpad6' || (e.code === 'Digit6' && e.location === 3)) {
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 5);
    keyHandled = true;
  }
  
  if (keyHandled) {
    e.preventDefault();
    e.stopPropagation();
  }
}, true); // Use capture phase to intercept hotkeys early

// --- Browser Neutral Extension Messaging Interface ---
const browserAPI = typeof chrome !== 'undefined' ? chrome : (typeof browser !== 'undefined' ? browser : null);

if (browserAPI && browserAPI.runtime) {
  browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const video = getActiveVideo();
    
    if (request.action === 'GET_STATUS') {
      if (!video) {
        sendResponse({ status: 'no_video', step: speedStep });
      } else {
        sendResponse({
          status: 'success',
          speed: video.playbackRate,
          paused: video.paused,
          step: speedStep
        });
      }
    }
    
    else if (request.action === 'SET_STEP') {
      speedStep = parseFloat(request.step);
      sendResponse({ status: 'success', step: speedStep });
    }
    
    else if (request.action === 'SET_SPEED') {
      if (video) {
        const targetSpeed = Math.min(16.0, Math.max(0.1, request.speed));
        video.playbackRate = Math.round(targetSpeed * 100) / 100;
        showSpeedHUD(video.playbackRate);
        sendResponse({ status: 'success', speed: video.playbackRate });
      } else {
        sendResponse({ status: 'no_video' });
      }
    }
    
    return true; // Keep message channel open for asynchronous responses
  });
}
