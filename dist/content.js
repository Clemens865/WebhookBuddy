/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!******************************!*\
  !*** ./src/content/index.ts ***!
  \******************************/

// Content script for the Chrome extension
// This script runs in the context of web pages
console.log('Yorizon Buddy content script loaded');
// Function to extract page data
function extractPageData() {
    // Get the URL and title
    const url = window.location.href;
    const title = document.title;
    // Extract meta tags
    const metaTags = Array.from(document.querySelectorAll('meta[name], meta[property]'))
        .map((meta) => {
        const element = meta;
        const name = element.getAttribute('name') || element.getAttribute('property') || '';
        return { name, content: element.content };
    })
        .filter((meta) => meta.name && meta.content);
    // Extract headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map((heading) => {
        return {
            level: heading.tagName.toLowerCase(),
            text: heading.textContent?.trim() || ''
        };
    })
        .filter((heading) => heading.text);
    // Extract paragraphs
    const paragraphs = Array.from(document.querySelectorAll('p'))
        .map((p) => p.textContent?.trim() || '')
        .filter((text) => text);
    // Get selected text if any
    const selectedText = window.getSelection()?.toString().trim();
    return {
        url,
        title,
        metaTags,
        headings,
        paragraphs,
        selectedText: selectedText || undefined
    };
}
// Listen for messages from the extension
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('Content script received message:', message);
    if (message.action === 'extractData') {
        const data = extractPageData();
        sendResponse({ success: true, data });
    }
    return true; // Will respond asynchronously
});
// Listen for selected text
document.addEventListener('mouseup', () => {
    const selectedText = window.getSelection()?.toString();
    if (selectedText && selectedText.trim().length > 0) {
        chrome.runtime.sendMessage({
            action: 'textSelected',
            text: selectedText
        });
    }
});

/******/ })()
;
//# sourceMappingURL=content.js.map