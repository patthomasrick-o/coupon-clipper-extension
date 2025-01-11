// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

// Listen for messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "EXAMPLE_ACTION") {
    // Handle the action
    sendResponse({ result: "Action processed" });
  }
});

// Example of using storage API
chrome.storage.sync.get(["key"], (result) => {
  console.log("Value currently is " + result.key);
});

// Example of a browser action listener
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle" });
  }
});
