chrome.storage.sync.get(['lineColor', 'lineWidth'], (settings) => {
    document.getElementById('line-color').value = settings.lineColor || '#03B3FF';
    document.getElementById('line-width').value = settings.lineWidth || 4;
    document.getElementById('line-width-value').textContent = settings.lineWidth || 4;
});
  
document.getElementById('line-width').addEventListener('input', (e) => {
  document.getElementById('line-width-value').textContent = e.target.value;
});
  
document.getElementById('save-btn').addEventListener('click', () => {
  const lineColor = document.getElementById('line-color').value;
  const lineWidth = document.getElementById('line-width').value;
  
  chrome.storage.sync.set({ lineColor, lineWidth }, () => {
    alert('Settings Saved!');
  });
});