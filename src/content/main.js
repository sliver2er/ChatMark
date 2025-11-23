/**
 * Main entry point - event binding and initialization
 */

(function() {
  'use strict';

  let currentSessionId = null;
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType !== 1) continue;

        const askBtn = node.matches
          ? (node.matches('button.btn.relative.btn-secondary.shadow-long.flex.rounded-xl')
              ? node
              : node.querySelector('button.btn.relative.btn-secondary.shadow-long.flex.rounded-xl'))
          : null;

        if (!askBtn) continue;
        const text = window.getSelection().toString().trim();
        if (!text) continue;

        const selection = window.getSelection();
        if (!selection.rangeCount) continue;

        const range = selection.getRangeAt(0);
        let target = range.commonAncestorContainer;
        if (target.nodeType === Node.TEXT_NODE) {
          target = target.parentElement;
        }
        const event = { target };
        window.SideQuest.showBookmarkPopup(text, event);
        return;
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  function handleDoubleClick(e) {
    const text = window.getSelection().toString().trim();
    if (!text) return;
    window.SideQuest.showBookmarkPopup(text, e);
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
