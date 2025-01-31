const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let lineColor = '#03B3FF';
let lineWidth = 4;
let isDrawing = false;
let isEnabled = true;
let autoDisappear = true;
let lastRightClickTime = 0;
let isDoubleClick = false; 
let points = [];
let drawHistory = [];
canvas.style = "position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999;";
document.body.appendChild(canvas);

chrome.storage.sync.get(['lineColor', 'lineWidth', 'isEnabled'], (settings) => {
  lineColor = settings.lineColor || '#03B3FF';
  lineWidth = settings.lineWidth || 3;
  isEnabled = settings.isEnabled !== undefined ? settings.isEnabled : true;
  autoDisappear = settings.autoDisappear !== undefined ? settings.autoDisappear : true;
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.lineColor) lineColor = changes.lineColor.newValue;
  if (changes.lineWidth) lineWidth = changes.lineWidth.newValue;
  if (changes.isEnabled !== undefined) {
    isEnabled = changes.isEnabled.newValue;
  }
  if (changes.autoDisappear) {
    autoDisappear = changes.autoDisappear.newValue;
  }
});

document.addEventListener('mousedown', (e) => {
  if (isEnabled && e.button === 2) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastRightClickTime;
  
    if (timeDiff < 300) {
      isDoubleClick = true;
      lastRightClickTime = 0;
    } else {
      isDoubleClick = false;
      lastRightClickTime = currentTime;
      
      isDrawing = true;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      //points = [{x: e.clientX, y: e.clientY}];
    }
    points = [{x: e.clientX, y: e.clientY}];
  }
});

document.addEventListener('mousemove', (e) => {
  if (isEnabled && isDrawing) {
    points.push({x: e.clientX, y: e.clientY});
    drawPath();
  }
});

document.addEventListener('mouseup', (e) => {
    if (isEnabled && e.button === 2) {
      isDrawing = false;
      if (autoDisappear) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        if (points.length > 1) {
          drawHistory.push([...points]);
        }
        points = [];
      }
    }
});

document.addEventListener('keydown', (event) => {
    if (isEnabled && !autoDisappear && event.key === 'Escape') {
      drawHistory = []; 
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

function drawPath() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawHistory.forEach(historyPoints => {
      ctx.beginPath();
      ctx.moveTo(historyPoints[0].x, historyPoints[0].y);
      historyPoints.forEach(point => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    });
  
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

document.addEventListener('contextmenu', (e) => {
    if (isEnabled) {
        if (!isDoubleClick) {
            e.preventDefault();
          } else {
            isDoubleClick = false;
        }
    }
});

let draggedLinkUrl = null;

document.addEventListener('dragstart', (e) => {
    if (isEnabled) {
        if (e.target.tagName === 'A') {
            draggedLinkUrl = e.target.href;
            e.dataTransfer.effectAllowed = 'copy';
        }
    }
});

document.addEventListener('dragover', (e) => {
    if (isEnabled) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {
    if (isEnabled) {
        e.preventDefault();
        if (draggedLinkUrl) {
          chrome.runtime.sendMessage({
            action: 'openNewTab',
            url: draggedLinkUrl
          });
          draggedLinkUrl = null;
        }
    }
});
