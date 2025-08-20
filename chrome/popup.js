// --- SVG Canvas Tab Rendering ---
function renderTabsOnCanvas(tabs) {
  const svg = document.getElementById('tabsCanvas');
  while (svg.firstChild) svg.removeChild(svg.firstChild);
  const radius = 30;
  const padding = 20;
  tabs.forEach((tab, i) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const cx = radius + padding + (i * (radius * 2.5 + padding));
    const cy = 80;
    // Background rounded rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', cx - radius - 10);
    rect.setAttribute('y', cy - radius - 10);
    rect.setAttribute('rx', 18);
    rect.setAttribute('ry', 18);
    rect.setAttribute('width', radius * 2 + 20);
    rect.setAttribute('height', radius * 2 + 40);
    rect.setAttribute('fill', '#e3f2fd');
    rect.setAttribute('stroke', '#90caf9');
    rect.setAttribute('stroke-width', '2');
    group.appendChild(rect);
    // Tab circle
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
    group.appendChild(circle);
    // Tab title
    const titleText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    titleText.setAttribute('x', cx);
    titleText.setAttribute('y', cy + radius + 18);
    titleText.setAttribute('text-anchor', 'middle');
    titleText.setAttribute('font-size', '14');
    titleText.setAttribute('fill', '#1976d2');
    titleText.setAttribute('font-weight', 'bold');
    titleText.textContent = tab.title.length > 18 ? tab.title.slice(0, 15) + '...' : tab.title;
    group.appendChild(titleText);
    // Tab URL
    const urlText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    urlText.setAttribute('x', cx);
    urlText.setAttribute('y', cy + radius + 36);
    urlText.setAttribute('text-anchor', 'middle');
    urlText.setAttribute('font-size', '11');
    urlText.setAttribute('fill', '#333');
    urlText.textContent = tab.url.length > 28 ? tab.url.slice(0, 25) + '...' : tab.url;
    group.appendChild(urlText);
    svg.appendChild(group);
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
  let extensionVersion = 'dev';
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getManifest) {
    extensionVersion = chrome.runtime.getManifest().version;
  }
  return {
    browser: navigator.userAgent,
    language: navigator.language,
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    platform: navigator.platform,
    extensionVersion
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
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set({ savedTabs: tabObjects }, () => {
      alert('Tabs saved!');
    });
  } else {
    // Fallback for local development: use localStorage
    try {
      localStorage.setItem('savedTabs', JSON.stringify(tabObjects));
      alert('Tabs saved locally!');
    } catch (e) {
      alert('Error saving tabs locally.');
    }
  }
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
