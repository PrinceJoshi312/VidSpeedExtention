# Tempo — Browser-Neutral Video Speed Control Extension

A lightweight, high-performance browser extension (Manifest V3) that lets you control video playback speed on any website — YouTube, Vimeo, Netflix, custom HTML5 players, and more — using your numpad or standard keyboard.

## Features

- **Browser Neutral** — Works across the standard `chrome.*` and `browser.*` extension APIs, so it runs on Chrome, Firefox, Edge, Brave, Safari, and other WebExtensions-compliant browsers.
- **Universal Detection** — Automatically finds and attaches to any HTML5 `<video>` element on a page.
- **Numpad Shortcuts** — Fast, single-keypress speed changes.
- **Laptop-Friendly Fallback** — Full functionality on keyboards without a numpad.
- **Shadow DOM HUD** — An on-page overlay that displays the current speed, isolated from the host site's CSS so it always looks and behaves correctly.
- **Popup Dashboard** — A responsive control panel with adjustable increments and speed presets.

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

## Installation

This extension is currently in development/unpacked form and must be loaded manually.

### Chromium-Based Browsers (Chrome, Edge, Brave, Opera, Vivaldi)

1. Go to `chrome://extensions/` (or open the puzzle-piece icon → **Manage Extensions**).
2. Enable **Developer mode** (top-right toggle).
3. Click **Load unpacked** and select the project folder (the one containing `manifest.json`).
4. Click the puzzle-piece icon in the toolbar and pin **Tempo** for quick access.

### Firefox (Gecko-Based)

1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select the `manifest.json` file inside the project folder.

> Firefox unloads temporary add-ons when the browser closes, so you'll need to reload it each session during development.

---

## Project Structure

```
videospeedext/
├── manifest.json   # Manifest V3 configuration
├── content.js      # Injected into pages: handles keystrokes, playback control, and HUD overlay
├── popup.html       # Popup UI layout
├── popup.css        # Popup styling
└── popup.js          # Popup ↔ tab communication logic
```

---

## Contributing

Issues and pull requests are welcome. If you run into a site where speed control doesn't work, please open an issue with the URL so the video-detection logic can be improved.

## License

*(Add your license here — e.g. MIT)*
