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

  // 같은 부모를 가진 북마크들 중 최대 order 찾기
  const siblings = bookmarks.filter(b => b.parent_bookmark === bookmark.parent_bookmark);
  const maxOrder = siblings.length > 0
    ? Math.max(...siblings.map(b => b.order ?? -1))
    : -1;

  // 새 북마크의 order는 최대 order + 1
  const newBookmark = {
    ...bookmark,
    order: maxOrder + 1,
  };

  bookmarks.push(newBookmark);
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: bookmarks }, () => {
      resolve(true);
    });
  });
}

export async function deleteBookmark(session_id: string, bookmark_id: string): Promise<boolean> {
  const bookmarks = await getBookmarks(session_id);

  const idsToDelete = new Set<string>();

  const collectChildrenIds = (parentId: string) => {
    idsToDelete.add(parentId);
    const children = bookmarks.filter((b) => b.parent_bookmark === parentId);
    children.forEach((child) => collectChildrenIds(child.id));
  };

  collectChildrenIds(bookmark_id);
  const updated = bookmarks.filter((b) => !idsToDelete.has(b.id));

  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: updated }, () => {
      resolve(true);
    });
  });
}

export async function deleteBookmarksInSession(session_id: string): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([key(session_id)], () => {
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

export async function updateBookmark(
  session_id: string,
  bookmark_id: string,
  updates: Partial<BookmarkItem>
): Promise<boolean> {
  const bookmarks = await getBookmarks(session_id);
  const index = bookmarks.findIndex((b) => b.id === bookmark_id);

  if (index === -1) {
    throw new Error(`Bookmark not found: ${bookmark_id}`);
  }

  bookmarks[index] = {
    ...bookmarks[index],
    ...updates,
  };

  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: bookmarks }, () => {
      resolve(true);
    });
  });
}

export async function updateBookmarks(
  session_id: string,
  updates: Array<{ id: string; updates: Partial<BookmarkItem> }>
): Promise<boolean> {
  const bookmarks = await getBookmarks(session_id);

  const updateMap = new Map(updates.map((u) => [u.id, u.updates]));

  const updatedBookmarks = bookmarks.map((bookmark) => {
    const update = updateMap.get(bookmark.id);
    if (update) {
      return { ...bookmark, ...update };
    }
    return bookmark;
  });

  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(session_id)]: updatedBookmarks }, () => {
      resolve(true);
    });
  });
}
