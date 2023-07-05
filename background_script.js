chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.set({ selectedData: request }, () => {});
});
