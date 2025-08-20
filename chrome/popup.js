// --- SVG Canvas Tab Rendering ---
function renderTabsOnCanvas(tabs) {
  const svg = document.getElementById('tabsCanvas');
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const radius = 30;
  const padding = 20;
  tabs.forEach((tab, i) => {
    const cx = radius + padding + (i * (radius * 2 + padding));
    const cy = 60;
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', '#90caf9');
    circle.setAttribute('stroke', '#1976d2');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('tabindex', '0');
    circle.setAttribute('data-tab-id', tab.id);
    circle.style.cursor = 'pointer';
    circle.addEventListener('click', () => {
      // Future: drill-down to tab details
      alert(`Tab: ${tab.title}\nURL: ${tab.url}`);
    });
    svg.appendChild(circle);
    // Add tab title below the circle
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', cx);
    text.setAttribute('y', cy + radius + 16);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '12');
    text.setAttribute('fill', '#333');
    text.textContent = tab.title.length > 18 ? tab.title.slice(0, 15) + '...' : tab.title;
    svg.appendChild(text);
  });
  // Future: render tab groups as polygons, collections as containers
}
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


function getMockTabs() {
  return [
    { id: 1, title: 'Open Tabs Home', url: 'https://opentabs.dev', favIconUrl: '', },
    { id: 2, title: 'GitHub', url: 'https://github.com', favIconUrl: '', },
    { id: 3, title: 'Design Inspiration', url: 'https://dribbble.com', favIconUrl: '', },
  ];
}

function tabsQuery(callback) {
  if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({}, callback);
  } else {
    callback(getMockTabs());
  }
}

tabsQuery(tabs => {
  renderTabs(tabs);
  renderTabsOnCanvas(tabs);
  const saveBtn = document.getElementById('saveTabsBtn');
  if (saveBtn) saveBtn.onclick = () => saveTabs(tabs);
});
