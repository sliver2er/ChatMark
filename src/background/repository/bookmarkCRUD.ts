import { BookmarkItem } from "@/types";
import { log } from "@/shared/logger";

const key = (session_id: string) => {
  return "chatmark.bookmarks." + session_id;
};
const allBookmarks = "chatmark.bookmarks";

export async function getBookmarks(session_id: string): Promise<BookmarkItem[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key(session_id)], (result) => {
      let bookmarks = result[key(session_id)] || [];
      resolve(bookmarks);
    });
  });
}

export async function saveBookmark(session_id: string, bookmark: BookmarkItem): Promise<boolean> {
  const bookmarks = await getBookmarks(session_id);
  bookmarks.push(bookmark);
  log("Bookmark saved successfully. Bookmark : ");
  log(bookmark);

  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: bookmarks }, () => {
      resolve(true);
    });
  });
}

export async function deleteBookmark(session_id: string, bookmark_id: string): Promise<boolean> {
  const bookmarks = await getBookmarks(session_id);
  const updated = bookmarks.filter((b) => b.id !== bookmark_id);

  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: updated }, () => {
      resolve(true);
    });
  });
}

export async function deleteAllBookmarks(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      const allKeys = Object.keys(items);
      const bookmarkKeys = allKeys.filter((k) => k.startsWith("chatmark.bookmarks."));
      if (bookmarkKeys.length === 0) {
        resolve();
        return;
      }
      chrome.storage.local.remove(bookmarkKeys, () => {
        resolve();
      });
    });
  });
}
