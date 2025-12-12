import { BookmarkItem, MessageType } from "@/types";

export const NavigateApi = {
  navigateToBookmark(bookmark: BookmarkItem): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        {
          type: MessageType.Navigate,
          bookmark,
        },
        (response) => {
          if (!response?.success) {
            reject(response?.error || "Failed to navigate");
          } else {
            resolve();
          }
        }
      );
    });
  },
};
