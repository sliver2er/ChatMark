import { BookmarkItem } from "@/types";
import { error } from "@/shared/logger";
import { useProviderStore } from "@/stores/useProviderStore";

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

export function captureTextSelection(): BookmarkItem | null {
  const provider = useProviderStore.getState().provider;
  if (!provider) {
    error("Provider not initialized");
    return null;
  }

  const selection = window.getSelection();

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return null;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString().trim();

  if (!selectedText) {
    return null;
  }

  const startContainer = range.startContainer;
  const parent = startContainer instanceof Element ? startContainer : startContainer.parentElement;

  if (!parent) {
    error("Could not find parent element");
    return null;
  }

  const messageId = provider.findMessageId(parent);

  if (!messageId) {
    error("Could not find message ID");
    return null;
  }

  const messageSelector = provider.getMessageElementSelector();
  const messageNode = parent.closest(messageSelector);
  const fullText = messageNode?.textContent || "";

  const selectionIndex = fullText.indexOf(selectedText);

  if (selectionIndex === -1) {
    error("Could not find selected text in message content");
    return null;
  }

  const context_before = fullText.substring(Math.max(0, selectionIndex - 50), selectionIndex);
  const context_after = fullText.substring(
    selectionIndex + selectedText.length,
    Math.min(fullText.length, selectionIndex + selectedText.length + 50)
  );

  const sessionId = provider.getSessionId();

  if (!sessionId) {
    error("Could not extract session_id from URL");
    return null;
  }

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
    parent_bookmark: null,
    order: 0,
    provider: provider.provider,
  };

  return bookmarkItem;
}
