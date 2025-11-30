import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import { getBookmarkPosition } from "@/shared/functions/getBookmarkPosition";
import { getSessionId } from "@/shared/functions/getSessionId";
import { BookmarkItem } from "@/types";

(function mount() {
  // React root container 생성
  const container = document.createElement("div");
  container.id = "chatmark-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.zIndex = "999999";
  document.body.appendChild(container);

  // React 부팅 - App 컴포넌트가 모든 기능 관리
  const root = createRoot(container);
  root.render(<App/>);
})();

// Track current session ID to detect navigation
let currentSessionId = getSessionId();

// Detect URL changes and notify panel
setInterval(() => {
  const newSessionId = getSessionId();

  if (newSessionId && newSessionId !== currentSessionId) {
    currentSessionId = newSessionId;

    // Notify panel about navigation
    chrome.runtime.sendMessage({
      type: "PANEL_REFRESH",
      session_id: newSessionId
    });
  }
}, 1000); // Check every second

// Listen for bookmark navigation messages from the panel
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "BOOKMARK_NAVIGATE") {
    const bookmark = msg.bookmark as BookmarkItem;
    const element = getBookmarkPosition(bookmark);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: "Element not found" });
    }
  }
  return true; // Allow async response
});
