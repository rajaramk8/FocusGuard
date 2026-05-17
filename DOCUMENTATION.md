# Focus Guard - Project Documentation (Firefox)

## Overview
**Focus Guard** is a Firefox browser extension (Manifest V3) designed to help users manage their digital well-being by limiting daily time spent on distracting websites. It currently tracks and restricts usage of YouTube and YouTube Shorts.

## Features
- **Daily Time Limits:** 
  - YouTube: 60 minutes
  - YouTube Shorts: 15 minutes
- **Real-time Blocking:** Automatically redirects to a "Blocked" page once the daily limit is reached.
- **SPA Support:** Correctly handles internal navigation on YouTube (Single Page Application routing) to ensure accurate tracking.
- **Persistence:** Daily usage data is stored locally and resets every day.
- **Incognito Support:** Tracks usage even in private browsing windows.

## Project Structure
- `manifest.json`: Extension configuration, permissions, and background script registration.
- `background.js`: The core logic that monitors active tabs, tracks time, and enforces blocking rules.
- `blocked.html`: The landing page displayed when a user exceeds their daily limit.

## Technical Implementation

### Time Tracking
The extension uses a "heartbeat" mechanism implemented via `setInterval` in `background.js`. Every 60 seconds, it:
1. Queries all active tabs.
2. Identifies if the user is on YouTube or YouTube Shorts.
3. Increments the daily usage counter in `browser.storage.local`.

### Blocking Mechanism
Blocking is enforced in two ways:
1. **Heartbeat Check:** If the heartbeat detects a limit has been reached, it immediately updates the tab URL to `blocked.html`.
2. **Navigation Guard:** `browser.tabs.onUpdated` and `browser.webNavigation.onHistoryStateUpdated` listeners intercept URL changes and redirect to `blocked.html` if the limit is already exceeded.

### Storage
The extension uses `browser.storage.local` to store:
- `usage`: An object containing the minutes used for each site key (e.g., `{"youtube.com": 45, "shorts": 10}`).
- `lastDate`: The last date the extension was active, used to trigger the daily reset.

## Deployment Steps (Firefox)

1. Open **Firefox**.
2. In the address bar, type `about:debugging#/runtime/this-firefox` and press Enter.
3. Click the **Load Temporary Add-on...** button.
4. Navigate to your project folder and select the `manifest.json` file.
5. The extension is now active. You can verify it by visiting YouTube.

**Note:** Temporary add-ons are removed when Firefox is restarted. To install it permanently, the extension must be signed and distributed through [Mozilla Add-ons (AMO)](https://addons.mozilla.org/).

## Configuration
To modify the daily limits, edit the `LIMITS` constant at the top of `background.js`:

```javascript
const LIMITS = {
  "youtube.com": 60, // Limit for main YouTube in minutes
  "shorts": 15       // Limit for YouTube Shorts in minutes
};
```
