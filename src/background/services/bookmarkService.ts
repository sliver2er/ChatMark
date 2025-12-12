import * as repo from "../repository/bookmarkCRUD";
import { BookmarkItem } from "@/types";
import { log } from "@/shared/logger";

export async function handleBookmarkAdd(msg: any, sendResponse: Function) {
  const item: BookmarkItem = msg.payload;
  await repo.saveBookmark(item.session_id, item);
  log("Bookmark add signal received");
  log("Bookmark", item);

  sendResponse({ success: true });
}

export async function handleBookmarkGetAll(msg: any, sendResponse: Function) {
  const list = await repo.getBookmarks(msg.session_id);
  sendResponse({ success: true, data: list });
}

export async function handleBookmarkDelete(msg: any, sendResponse: Function) {
  const { session_id, id } = msg;
  await repo.deleteBookmark(session_id, id);
  sendResponse({ success: true });
}

export async function handleBookmarkDeleteAll(msg: any, sendResponse: Function) {
  await repo.deleteAllBookmarks();
  sendResponse({ success: true });
}

export async function handleBookmarkNavigate(msg: any, sendResponse: Function) {
  const bookmark: BookmarkItem = msg.bookmark;

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.id) {
      sendResponse({ success: false, error: "No active tab found" });
      return;
    }
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: "BOOKMARK_NAVIGATE",
        bookmark,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({
            success: false,
            error: chrome.runtime.lastError.message,
          });
        } else {
          sendResponse(response);
        }
      }
    );
  } catch (error) {
    sendResponse({ success: false, error: String(error) });
  }
}
