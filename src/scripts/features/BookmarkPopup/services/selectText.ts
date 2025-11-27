import { BookmarkItem } from "../types";
import { getSessionId } from "../utils/getSessionId";

/**
 * Find the closest parent element with data-message-id
 */
function findMessageNode(node: Node): HTMLElement | null {
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
function findSpanWithDataStart(node: Node): HTMLElement | null {
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

  // a Find message node with data-message-id
  const messageNode = findMessageNode(range.startContainer);

  if (!messageNode || !messageNode.dataset.messageId) {
    console.error("Could not find message node with data-message-id");
    return null;
  }

  const messageId = messageNode.dataset.messageId;

  // b Calculate start/end positions from data-start/data-end
  const startSpan = findSpanWithDataStart(range.startContainer);
  const endSpan = findSpanWithDataStart(range.endContainer);

  if (!startSpan || !endSpan) {
    console.error("Could not find span with data-start attribute");
    return null;
  }

  const spanStart = parseInt(startSpan.dataset.start || "0", 10);
  const spanEnd = parseInt(endSpan.dataset.start || "0", 10);

  const start = spanStart + range.startOffset;
  const end = spanEnd + range.endOffset;

  // c Get session_id from URL
  const sessionId = getSessionId();

  if (!sessionId) {
    console.error("Could not extract session_id from URL");
    return null;
  }

  // d Create bookmark item
  const bookmarkItem: BookmarkItem = {
    id: crypto.randomUUID(),
    session_id: sessionId,
    message_id: messageId,
    text: selectedText,
    start,
    end,
    created_at: new Date(),
    type: "text-fragment",
  };

  return bookmarkItem;
}
