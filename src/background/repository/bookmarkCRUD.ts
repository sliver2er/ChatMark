import { BookmarkItem } from "@/types";

const key = (session_id : string) =>{
    return 'chatmark.bookmarks.' + session_id;

}

export async function getBookmarks(session_id : string): Promise<BookmarkItem[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([key(session_id)], (result) => {
        let bookmarks = result[key(session_id)] || [];
        resolve(bookmarks); 
    });
  });
}

export async function saveBookmark(session_id : string,bookmark: BookmarkItem) {
  const bookmarks = await getBookmarks(session_id);
  bookmarks.push(bookmark);

  return new Promise((resolve) => {
    chrome.storage.sync.set({[key(session_id)]: bookmarks }, () => {
      resolve(true);
    });
  });
}

export async function deleteBookmark(session_id : string, id: string) {
  const bookmarks = await getBookmarks(session_id);
  const updated = bookmarks.filter((b) => b.id !== id);

  return new Promise((resolve) => {
    chrome.storage.sync.set({ [key(session_id)]: updated }, () => {
      resolve(true);
    });
  });
}