import { getBookmarkPosition } from "@/shared/functions/getBookmarkPosition";
import { highlightRange } from "@/shared/functions/highlightRange";
import { BookmarkItem, MessageType } from "@/types";
import { scrollToRange, scrollToElement, selectElement } from "./scrollUtils";

const HIGHLIGHT_DELAY = 100;

export function setupBookmarkNavigationListener() {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === MessageType.Navigate) {
      handleBookmarkNavigate(msg.bookmark, sendResponse);
    }
    return true;
  });
}

async function handleBookmarkNavigate(bookmark: BookmarkItem, sendResponse: Function) {
  const result = getBookmarkPosition(bookmark);

  if (!result) {
    sendResponse({ success: false, error: "Element not found" });
    return;
  }

  const { element, range } = result;

  if (range) {
    await scrollToRange(range, element);
    setTimeout(() => highlightRange(range), HIGHLIGHT_DELAY);
  } else {
    await scrollToElement(element);
    selectElement(element);
  }

  sendResponse({ success: true });
}
