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

chrome.tabs.query({}, renderTabs);
