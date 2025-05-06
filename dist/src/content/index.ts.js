console.log("Yorizon Buddy content script loaded");
function extractPageData() {
  return {
    url: window.location.href,
    title: document.title,
    metaTags: Array.from(document.querySelectorAll("meta")).map((meta) => ({
      name: meta.getAttribute("name") || meta.getAttribute("property") || "",
      content: meta.getAttribute("content") || ""
    })),
    headings: Array.from(document.querySelectorAll("h1, h2, h3")).map((heading) => ({
      level: heading.tagName.toLowerCase(),
      text: heading.textContent || ""
    })),
    paragraphs: Array.from(document.querySelectorAll("p")).map((p) => p.textContent || "").filter(Boolean)
  };
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  if (message.action === "extractData") {
    const data = extractPageData();
    sendResponse({ success: true, data });
  }
  return true;
});
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection()?.toString();
  if (selectedText && selectedText.trim().length > 0) {
    chrome.runtime.sendMessage({
      action: "textSelected",
      text: selectedText
    });
  }
});
