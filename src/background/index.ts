// Background script for the Chrome extension

// Listen for installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Webhook Buddy extension installed');
});

// Listen for side panel activation
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => {
  console.error('Error setting panel behavior:', error);
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
  console.log('Received message:', message);
  
  // Add message handling logic here
  
  return true; // Will respond asynchronously
});
