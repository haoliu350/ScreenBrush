chrome.storage.sync.get(['isEnabled', 'autoDisappear'], (settings) => {
  const togglePlugin = document.getElementById('toggle-plugin');
  togglePlugin.checked = settings.isEnabled !== false;
  togglePlugin.addEventListener('change', handleTogglePlugin);

  const toggleAuto = document.getElementById('toggle-autodisappear');
  toggleAuto.checked = settings.autoDisappear !== false;
  toggleAuto.addEventListener('change', handleToggleAuto);
});

function handleTogglePlugin(e) {
  const isEnabled = e.target.checked;
  chrome.storage.sync.set({ isEnabled });
}

function handleToggleAuto(e) {
  const autoDisappear = e.target.checked;
  chrome.storage.sync.set({ autoDisappear });
}