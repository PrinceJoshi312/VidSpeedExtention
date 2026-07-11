# Tempo: Browser-Neutral Video Speed Control Extension

A high-performance, browser-neutral browser extension (Manifest V3) that regulates video playback speed on any website (YouTube, Vimeo, Netflix, custom players, etc.) using your Numpad keyboard controls.

## Features
- **Browser Neutrality**: Dynamically supports the standard `chrome.*` and `browser.*` namespaces, ensuring compatibility with Chrome, Firefox, Edge, Safari, Brave, and other WebExtensions-compliant browsers.
- **Global Injections**: Automatically detects HTML5 players on any web page.
- **Numpad Mapping**: Fast, single-keypress speed regulations.
- **Laptop Fallback**: Works on standard laptop keys too.
- **Shadow DOM Overlay**: Premium HUD display inside the page that is protected from website CSS overrides.
- **Responsive Popup Dashboard**: Accessible speed controls, customizable increments, and preset quick actions.

---

## Keyboard Controls Reference

| Action | Numpad Key | Standard Laptop Key |
|---|---|---|
| **Speed Up** | `Numpad +` | `+` or `=` |
| **Slow Down** | `Numpad -` | `-` |
| **Reset Speed (1.0x)** | `Numpad *` | `*` |
| **Play / Pause** | `Numpad 5` | - |
| **Seek Backward (5s)** | `Numpad 4` | - |
| **Seek Forward (5s)** | `Numpad 6` | - |

> [!NOTE]
> Keyboard hotkeys automatically disable when typing in text boxes, search fields, or textareas so they won't interfere with typing comments or search queries.

---

## How to Install the Extension in Your Browser

Since this is in development format, you can load it directly into your preferred browser:

### For Chromium-Based Browsers (Chrome, Edge, Brave, Opera, Vivaldi)
1. **Open Extension Management Page**:
   - In Chrome, navigate to: `chrome://extensions/`
   - Or click the Extensions menu (puzzle piece icon) and select **Manage Extensions**.
2. **Enable Developer Mode**:
   - Toggle the **Developer mode** switch in the top-right corner of the extensions page.
3. **Load the Extension**:
   - Click the **Load unpacked** button in the top-left corner.
   - Select the workspace folder: `C:\Users\HP\OneDrive\Desktop\videospeedext`
4. **Pin for Easy Access**:
   - Click the extensions puzzle icon in the browser toolbar and pin **Tempo Video Speed Regulator**.

### For Mozilla Firefox (Gecko-Based)
1. **Open Debugging Console**:
   - In Firefox, navigate to: `about:debugging#/runtime/this-firefox`
2. **Load Temporary Add-on**:
   - Click the **Load Temporary Add-on...** button.
3. **Select Manifest File**:
   - Navigate to the workspace folder: `C:\Users\HP\OneDrive\Desktop\videospeedext` and choose the `manifest.json` file.
4. **Test & Play**:
   - The extension will instantly load and remain active for your current browser session.

---

## Project Structure

- [manifest.json](file:///C:/Users/HP/OneDrive/Desktop/videospeedext/manifest.json) – Configuration for Manifest V3.
- [content.js](file:///C:/Users/HP/OneDrive/Desktop/videospeedext/content.js) – Content script injected into tabs. Handles keystrokes, controls HTML5 playback, and overlays the Shadow DOM HUD.
- [popup.html](file:///C:/Users/HP/OneDrive/Desktop/videospeedext/popup.html) – UI layout for browser action panel.
- [popup.css](file:///C:/Users/HP/OneDrive/Desktop/videospeedext/popup.css) – Premium styles for extension popup.
- [popup.js](file:///C:/Users/HP/OneDrive/Desktop/videospeedext/popup.js) – Extension tab communication.
