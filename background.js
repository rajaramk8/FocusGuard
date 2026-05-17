const LIMITS = {
  "youtube.com": 60, // limits in minutes
  "shorts": 15
};

// Central blocking logic
async function checkAndBlock(tabId, urlString) {
  if (!urlString) return;

  try {
    const url = new URL(urlString);
    const today = new Date().toLocaleDateString();

    let data = await browser.storage.local.get(["usage", "lastDate"]);

    if (data.lastDate !== today) {
      data.usage = {};
      data.lastDate = today;
      await browser.storage.local.set({ usage: {}, lastDate: today });
    }

    let siteKey = null;
    if (url.hostname.includes("youtube.com")) {
      siteKey = url.pathname.includes("/shorts/") ? "shorts" : "youtube.com";
    }

    if (siteKey && LIMITS[siteKey]) {
      const currentUsage = data.usage[siteKey] || 0;
      if (currentUsage >= LIMITS[siteKey]) {
        // Force redirect immediately
        browser.tabs.update(tabId, { url: "blocked.html" });
      }
    }
  } catch (e) {
    console.error("Error evaluating URL:", e);
  }
}

// 1. HEARTBEAT: Checks every minute for active browsing
setInterval(async () => {
  // Query ALL active tabs across normal AND private windows
  const tabs = await browser.tabs.query({ active: true });
  
  for (const tab of tabs) {
    if (!tab.url) continue;

    const url = new URL(tab.url);
    const today = new Date().toLocaleDateString();
    let data = await browser.storage.local.get(["usage", "lastDate"]);
    
    if (data.lastDate !== today) {
      data.usage = {};
      data.lastDate = today;
      await browser.storage.local.set({ usage: {}, lastDate: today });
    }

    let siteKey = null;
    if (url.hostname.includes("youtube.com")) {
      siteKey = url.pathname.includes("/shorts/") ? "shorts" : "youtube.com";
    }

    if (siteKey && LIMITS[siteKey]) {
      data.usage[siteKey] = (data.usage[siteKey] || 0) + 1;
      
      if (data.usage[siteKey] >= LIMITS[siteKey]) {
        browser.tabs.update(tab.id, { url: "blocked.html" });
      } else {
        await browser.storage.local.set({ usage: data.usage });
      }
    }
  }
}, 60000);

// 2. LIVE TRAFFIC GUARD: Detects typing a URL or clicking an external link
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    checkAndBlock(tabId, changeInfo.url);
  }
});

// 3. INTERNAL NAVIGATION GUARD: Catches clicks inside YouTube (SPA routing)
browser.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId === 0) {
    checkAndBlock(details.tabId, details.url);
  }
}, { url: [{ hostSuffix: 'youtube.com' }] });
