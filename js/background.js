// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     if (request.action === 'openNewTab') {
//       chrome.tabs.create({ url: request.url, active: false });
//     }
// });

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openNewTab') {
    // 获取当前活动的标签页信息
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return; // 异常处理：无活动标签页
      const currentTab = tabs[0];
      
      // 在当前标签页右侧插入新标签页
      chrome.tabs.create({
        url: request.url,
        active: false,
        index: currentTab.index + 1 // 关键参数：指定位置为当前标签页右侧
      });
    });
  }
});