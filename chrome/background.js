chrome.runtime.onInstalled.addListener(() => {
  console.log('Open Tabs Manager installed');
});

// Example: Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  // You can add tab management logic here
});
