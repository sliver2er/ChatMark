import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import { getBookmarkPosition } from "@/shared/functions/getBookmarkPosition";
import { highlightRange } from "@/shared/functions/highlightRange";
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
// Listen for bookmark navigation messages from the panel
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "BOOKMARK_NAVIGATE") {
    const bookmark = msg.bookmark as BookmarkItem;
    const result = getBookmarkPosition(bookmark);

    if (result) {
      const { element, range } = result;

      // Scroll to the exact text position if range exists
      if (range) {
        // Get the container of the text node
        const scrollTarget = range.startContainer.nodeType === Node.TEXT_NODE
          ? range.startContainer.parentElement
          : range.startContainer as HTMLElement;

        // Scroll to the exact position
        if (scrollTarget) {
          scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Fallback to message element
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Wait for scroll to complete before highlighting
        setTimeout(() => {
          highlightRange(range);
        }, 100);
      } else {
        // Fallback: scroll to the entire message element
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Select the entire message element visually
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          const messageRange = document.createRange();
          messageRange.selectNodeContents(element);
          selection.addRange(messageRange);

          // Clear selection after 2 seconds
          setTimeout(() => {
            selection.removeAllRanges();
          }, 2000);
        }
      }

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: "Element not found" });
    }
  }
  return true; // Allow async response
});
