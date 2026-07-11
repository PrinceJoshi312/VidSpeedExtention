# Playback+ - Browser-Neutral Video Speed Control Extension

A lightweight, high-performance browser extension (Manifest V3) that lets you control video playback speed on any website - YouTube, Vimeo, Netflix, custom HTML5 players, and more - using your numpad or standard keyboard.

## Features

- **Browser Neutral** - Works across the standard `chrome.*` and `browser.*` extension APIs, so it runs on Chrome, Firefox, Edge, Brave, Safari, and other WebExtensions-compliant browsers.
- **Universal Detection** - Automatically finds and attaches to any HTML5 `<video>` element on a page.
- **Numpad Shortcuts** - Fast, single-keypress speed changes.
- **Laptop-Friendly Fallback** - Full functionality on keyboards without a numpad.
- **Shadow DOM HUD** - An on-page overlay that displays the current speed, isolated from the host site's CSS so it always looks and behaves correctly.
- **Popup Dashboard** - A responsive control panel with adjustable increments and speed presets.

---

## Keyboard Controls

| Action | Numpad Key | Laptop Key |
|---|---|---|
| Speed Up | `Numpad +` | `+` or `=` |
| Slow Down | `Numpad -` | `-` |
| Reset Speed (1.0x) | `Numpad *` | `*` |
| Play / Pause | `Numpad 5` | — |
| Seek Backward 5s | `Numpad 4` | — |
| Seek Forward 5s | `Numpad 6` | — |

> [!NOTE]
> Shortcuts are automatically disabled while typing in text boxes, search fields, or textareas, so they won't interfere with normal typing.

---

## Installation (from local file structure)

This extension isn't published on any extension store yet, so it needs to be loaded manually as an "unpacked" extension. This works directly from a folder on your computer - no build step required.

### 1. Get the files onto your machine

Clone the repo:

```bash
git clone https://github.com/PrinceJoshi312/playback-plus.git
```

Or download it as a ZIP from GitHub (**Code → Download ZIP**) and extract it somewhere memorable.

You should end up with a folder containing at least:
```
manifest.json
content.js
popup.html
popup.css
popup.js
```

### 2. Load it into your browser

**Chromium-based (Chrome, Edge, Brave, Opera, Vivaldi):**
1. Go to `chrome://extensions/` (or Menu → Extensions → **Manage Extensions**).
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked**.
4. Select the folder you cloned/extracted — the one containing `manifest.json`.
5. Click the puzzle-piece icon in the toolbar and pin **Playback+** for quick access.

**Firefox (Gecko-based):**
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file inside the folder.

> [!WARNING]
> Firefox removes temporary add-ons when the browser closes. You'll need to reload it via `about:debugging` each session, or package it properly (`web-ext build`) for persistent use.

### 3. Updating

Since it's loaded from a local folder, updates are simple:
- Pull the latest changes (`git pull`) or re-download the ZIP.
- On Chromium browsers, click the refresh icon on the extension's card in `chrome://extensions/`.
- On Firefox, reload the temporary add-on from `about:debugging`.

---

## Usage

Once installed, navigate to any page with a video (YouTube, Netflix, a raw `<video>` tag, etc.):

1. Click into the page (the tab needs focus) so keyboard shortcuts are picked up.
2. Use the keys from the [Keyboard Controls](#keyboard-controls) table to change speed, seek, or play/pause.
3. A small HUD will briefly appear on screen confirming the new speed.
4. Alternatively, click the **Playback+** icon in your toolbar to open the popup dashboard, where you can set a precise speed, adjust the increment size, or use one-click presets.

Shortcuts are automatically suspended while a text field is focused, so you can type in comments, search bars, etc. without accidentally changing playback speed.

---

This repository contains two versions of the extension:

### 📁 [v1 - Keyboard-Only Version](v1)
- The original version mapping video playback controls exclusively to the numpad/laptop keyboard.
- Contains its own standalone `manifest.json`, `content.js`, `index.html`, and popup components.

### 📁 [v2 - Keyboard & Mouse Controls Version (Upgraded)](v2)
- The upgraded version adding interactive, hoverable, and clickable 3D keycap-style arrow buttons directly on the video speed badges.
- Allows full mouse-click regulation of speed step-up, step-down, and reset to 1x, while keeping all key mappings active.
- Contains its own standalone `manifest.json`, `content.js`, `index.html`, and popup components.

---

## Contributing

Issues and pull requests are welcome. If you find a site where speed control doesn't work correctly, please open an issue with the URL so the video-detection logic can be improved.

