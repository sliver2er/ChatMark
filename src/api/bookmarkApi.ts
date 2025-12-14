import { BookmarkItem } from "@/types";
import { error } from "@/shared/logger";

export const bookmarkApi = {
  getAll(session_id: string): Promise<BookmarkItem[]> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "BOOKMARK_GET_ALL", session_id }, (response) => {
        if (!response?.success) {
          error("Failed to get bookmarks : ", response?.error);
          reject(response?.error);
        } else resolve(response.data);
      });
    });
  },

  add(item: BookmarkItem): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "BOOKMARK_ADD", payload: item }, (response) => {
        if (!response?.success) {
          error("Failed to add bookmark : ", response?.error);
          reject(response?.error);
        } else {
          resolve();
        }
      });
    });
  },

  delete(session_id: string, bookmark_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: "BOOKMARK_DELETE", session_id, bookmark_id },
        (response) => {
          if (!response?.success) {
            error("Failed to delete bookmark : ", response?.error);
            reject(response?.error);
          } else resolve();
        }
      );
    });
  },
  deleteSession(session_id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "BOOKMARK_DELETE_SESSION", session_id }, (response) => {
        if (!response?.success) {
          error("Failed to delete session bookmarks : ", response?.error);
          reject(response?.error);
        } else resolve();
      });
    });
  },

  deleteAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "BOOKMARK_DELETE_ALL" }, (response) => {
        if (!response?.success) {
          error("Failed to delete all bookmarks : ", response?.error);
          reject(response?.error);
        } else resolve();
      });
    });
  },
};
