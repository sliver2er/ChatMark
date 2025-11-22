/**
 * LocalStorage management for bookmarks
 */

window.SideQuest = window.SideQuest || {};

const STORAGE_KEY = "SideQuestBookmarks";

window.SideQuest.loadBookmarks = function() {
  const bookmarks = localStorage.getItem(STORAGE_KEY);
  return bookmarks ? JSON.parse(bookmarks) : {};
};

window.SideQuest.saveBookmark = function(sessionId, bookmark) {
  const bookmarks = window.SideQuest.loadBookmarks();
  bookmarks[sessionId] = bookmark;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
};

window.SideQuest.loadBookmark = function(sessionId) {
  const bookmarks = window.SideQuest.loadBookmarks();
  return bookmarks[sessionId] || null;
};

window.SideQuest.removeBookmark = function(sessionId) {
  const bookmarks = window.SideQuest.loadBookmarks();
  if (bookmarks[sessionId]) {
    delete bookmarks[sessionId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  }
};