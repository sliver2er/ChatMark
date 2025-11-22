/**
 * Main entry point - event binding and initialization
 */

(function() {
  'use strict';

  let currentSessionId = null;

  function handleDoubleClick(e) {
    const text = window.getSelection().toString().trim();
    if (!text) return;
    window.SideQuest.showBookmarkPopup(text, e.pageX, e.pageY, e);
  }

  function loadSessionBookmark(sessionId) {
    if (!sessionId) {
      window.SideQuest.removeReturnButton();
      return;
    }

    const bookmark = window.SideQuest.loadBookmark(sessionId);
    if (bookmark) {
      window.SideQuest.removeReturnButton();
      window.SideQuest.createReturnButton(bookmark);
    } else {
      window.SideQuest.removeReturnButton();
    }
  }

  function handleSessionChange() {
    const newSessionId = window.SideQuest.getSessionId();

    if (newSessionId !== currentSessionId) {
      console.log('Session changed:', currentSessionId, '->', newSessionId);
      currentSessionId = newSessionId;
      loadSessionBookmark(newSessionId);
    }
  }

  function init() {
    document.addEventListener('dblclick', handleDoubleClick);

    currentSessionId = window.SideQuest.getSessionId();
    loadSessionBookmark(currentSessionId);

    setInterval(handleSessionChange, 500);

    window.addEventListener('popstate', handleSessionChange);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
