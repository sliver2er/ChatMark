import { BookmarkItem } from "@/types";
import { getSessionId } from "@/shared/functions/getSessionId";
import  { error }  from "@/shared/logger"

/**
 * Find the closest parent element with data-message-id
 */
function findMessageId(node: Node): HTMLElement | null {
  let current = node instanceof Text ? node.parentElement : (node as HTMLElement);

  while (current) {
    if (current.dataset?.messageId) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

/**
 * Find the closest parent span with data-start attribute
 */
function findDataStart(node: Node): HTMLElement | null {
  let current = node instanceof Text ? node.parentElement : (node as HTMLElement);

  while (current) {
    if (current.tagName === 'SPAN' && current.dataset?.start !== undefined) {
      return current;
    }
    current = current.parentElement;
  }

  return null;
}

/**
 * Capture the current text selection and create a bookmark item
 */
export function captureTextSelection(): BookmarkItem | null {
  // ` Get current selection
  const selection = window.getSelection();

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString().trim();

  if (!selectedText) {
    return null;
  }
  const messageNode = findMessageId(range.startContainer);

  if (!messageNode || !messageNode.dataset.messageId) {
    error("Could not find message node with data-message-id");
    return null;
  }

  const messageId = messageNode.dataset.messageId;

  const startSpan = findDataStart(range.startContainer);
  const endSpan = findDataStart(range.endContainer);

  if (!startSpan || !endSpan) {
    error("Could not find span with data-start attribute");
    return null;
  }

  const spanStart = parseInt(startSpan.dataset.start || "0", 10);
  const spanEnd = parseInt(endSpan.dataset.start || "0", 10);

  const start = spanStart + range.startOffset;
  const end = spanEnd + range.endOffset;

  // c Get session_id from URL
  const sessionId = getSessionId();

  if (!sessionId) {
    error("Could not extract session_id from URL");
    return null;
  }

  // d Create bookmark item
  const bookmarkItem: BookmarkItem = {
    id: crypto.randomUUID(),
    bookmark_name : selectedText,
    session_id: sessionId,
    message_id: messageId,
    text: selectedText,
    start,
    end,
    created_at: new Date(),
  };

  return bookmarkItem;
}
