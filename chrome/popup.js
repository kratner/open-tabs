function renderTabs(tabs) {
  const tabsDiv = document.getElementById('tabs');
  tabsDiv.innerHTML = '';
  tabs.forEach(tab => {
    const div = document.createElement('div');
    div.className = 'tab-item';
    div.textContent = tab.title;
    const btn = document.createElement('button');
    btn.textContent = 'Go';
    btn.onclick = () => chrome.tabs.update(tab.id, { active: true });
    div.appendChild(btn);
    tabsDiv.appendChild(div);
  });
}


function getSystemInfo() {
  return {
    browser: navigator.userAgent,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    platform: navigator.platform,
    extensionVersion: chrome.runtime.getManifest().version
  };
}

function saveTabs(tabs) {
  const systemInfo = getSystemInfo();
  const tabObjects = tabs.map(tab => ({
    id: tab.id,
    title: tab.title,
    url: tab.url,
    favIconUrl: tab.favIconUrl,
    savedAt: new Date().toISOString(),
    browser: systemInfo.browser,
    language: systemInfo.language,
    screen: systemInfo.screen,
    platform: systemInfo.platform,
    extensionVersion: systemInfo.extensionVersion,
    // Future: userId, groupId, notes, tags, etc.
  }));
  chrome.storage.local.set({ savedTabs: tabObjects }, () => {
    alert('Tabs saved!');
  });
}

chrome.tabs.query({}, tabs => {
  renderTabs(tabs);
  document.getElementById('saveTabsBtn').onclick = () => saveTabs(tabs);
});
