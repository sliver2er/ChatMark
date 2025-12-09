import { getBookmarkPosition } from "@/shared/functions/getBookmarkPosition";
import { highlightRange } from "@/shared/functions/highlightRange";
import { BookmarkItem } from "@/types";
import { scrollToRange, scrollToElement, selectElement } from "./scrollUtils";

export function setupBookmarkNavigationListener() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "BOOKMARK_NAVIGATE") {
      handleBookmarkNavigate(msg.bookmark, sendResponse);
    }
    return true;
  });
}

function handleBookmarkNavigate(bookmark: BookmarkItem, sendResponse: Function) {
  const result = getBookmarkPosition(bookmark);

  if (!result) {
    sendResponse({ success: false, error: "Element not found" });
    return;
  }

  const { element, range } = result;

  if (range) {
    scrollToRange(range, element);
    setTimeout(() => highlightRange(range), 100);
  } else {
    scrollToElement(element);
    selectElement(element);
  }

  sendResponse({ success: true });
}
