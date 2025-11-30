import { BookmarkItem } from "@/types";

export const NavigateApi = {
  async navigateToBookmark(bookmark: BookmarkItem): Promise<void> {
    // Query the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab?.id) {
      throw new Error("No active tab found");
    }

    // Send message to content script in the active tab
    await chrome.tabs.sendMessage(tab.id, {
      type: "BOOKMARK_NAVIGATE",
      bookmark
    });
  }
};
