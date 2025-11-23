/**
 * DOM utilities for interacting with ChatGPT's DOM structure
 */

window.SideQuest = window.SideQuest || {};

window.SideQuest.getMessageIdfromEvent = function(event) {
  const messageNode = event.target.closest('[data-message-id]');
  if (!messageNode) return null;
  return messageNode.getAttribute('data-message-id');
};

window.SideQuest.getDataRangeFromSelection = function() {
  const selection = window.getSelection();
  if (!selection.rangeCount) {
    return { dataStart: null, dataEnd: null };
  }

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;
  let element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

  while (element) {
    if (element.hasAttribute('data-start') && element.hasAttribute('data-end')) {
      return {
        dataStart: element.getAttribute('data-start'),
        dataEnd: element.getAttribute('data-end')
      };
    }
    element = element.parentElement;
  }

  return { dataStart: null, dataEnd: null };
};

window.SideQuest.getSessionId = function() {
  const url = window.location.href;
  const match = url.match(/\/c\/([^\/\?#]+)/);
  return match ? match[1] : null;
};

window.SideQuest.returnToBookmark = function(bookmark) {
  let target = null;
  let messageRoot = null;

if (bookmark.messageId) {
    messageRoot = document.querySelector(`[data-message-id="${bookmark.messageId}"]`);
  }

  if (messageRoot && bookmark.dataStart) {
    target = messageRoot.querySelector(`[data-start="${bookmark.dataStart}"]`);
  }

  if (!target && messageRoot && bookmark.dataEnd) {
    target = messageRoot.querySelector(`[data-end="${bookmark.dataEnd}"]`);
  }

  if (target) {
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  } else if (messageRoot) {
    messageRoot.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  window.SideQuest.removeReturnButton();
  window.SideQuest.removeBookmark(bookmark.sessionId);
};
