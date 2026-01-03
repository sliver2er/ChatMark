import { BookmarkItem } from "@/types";
import { getSessionId } from "@/shared/functions/getSessionId";
import { error } from "@/shared/logger";
import { findMessageId } from "./selectionHelpers";

/**
 * Find the closest parent element with data-start attribute
 */
function findDataStart(node: Node): HTMLElement | null {
  let current = node instanceof Text ? node.parentElement : (node as HTMLElement);

  while (current) {
    if (current.dataset?.start !== undefined) {
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
  // Get current selection
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

  // Get full message text content
  const fullText = messageNode.textContent || "";

  // Find the selected text position in the full message
  const selectionIndex = fullText.indexOf(selectedText);

  if (selectionIndex === -1) {
    error("Could not find selected text in message content");
    return null;
  }

  // Extract context (50 characters before and after)
  const context_before = fullText.substring(Math.max(0, selectionIndex - 50), selectionIndex);
  const context_after = fullText.substring(
    selectionIndex + selectedText.length,
    Math.min(fullText.length, selectionIndex + selectedText.length + 50)
  );

  // Get session_id from URL
  const sessionId = getSessionId();

  if (!sessionId) {
    error("Could not extract session_id from URL");
    return null;
  }

  // Optional: try to get DOM offsets for reference (unreliable)
  let start: number | undefined;
  let end: number | undefined;

  const startSpan = findDataStart(range.startContainer);
  const endSpan = findDataStart(range.endContainer);

  if (startSpan && endSpan) {
    const spanStart = parseInt(startSpan.dataset.start || "0", 10);
    const spanEnd = parseInt(endSpan.dataset.start || "0", 10);
    start = spanStart + range.startOffset;
    end = spanEnd + range.endOffset;
  }

  // Create bookmark item
  const bookmarkItem: BookmarkItem = {
    id: crypto.randomUUID(),
    bookmark_name: selectedText,
    session_id: sessionId,
    message_id: messageId,
    text: selectedText,
    context_before,
    context_after,
    start,
    end,
    created_at: new Date(),
    order: 0, // Initial order, will be recalculated by API
  };

  return bookmarkItem;
}
