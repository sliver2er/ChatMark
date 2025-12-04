import { BookmarkItem } from "@/types";

/**
 * Result of finding bookmark position
 */
export interface BookmarkPositionResult {
  element: HTMLElement;
  range: Range | null;
}

/**
 * Find the exact position of bookmarked text using multi-layered approach
 * Layer 1: Find message by ID
 * Layer 2: Search with context for accuracy
 * Layer 3: Fallback to text-only search
 */
export function getBookmarkPosition(bookmark: BookmarkItem): BookmarkPositionResult | null {
  // Layer 1: Find the message element by data-message-id
  const messageElement = document.querySelector(
    `[data-message-id="${bookmark.message_id}"]`
  ) as HTMLElement;

  if (!messageElement) {
    console.error(`Message with id ${bookmark.message_id} not found`);
    return null;
  }

  // Get full message text content
  const fullText = messageElement.textContent || "";

  // Layer 2: Try to find with context (most accurate)
  const searchPattern = bookmark.context_before + bookmark.text + bookmark.context_after;
  let textIndex = fullText.indexOf(searchPattern);

  if (textIndex !== -1) {
    // Context match successful - adjust index to point to actual text
    textIndex += bookmark.context_before.length;
  } else {
    // Layer 3: Fallback to text-only search
    textIndex = fullText.indexOf(bookmark.text);

    if (textIndex === -1) {
      console.error("Could not find bookmarked text in message");
      return {
        element: messageElement,
        range: null
      };
    }
  }

  // Create DOM Range from text index
  const range = findTextRange(
    messageElement,
    textIndex,
    textIndex + bookmark.text.length
  );

  return {
    element: messageElement,
    range
  };
}

/**
 * Convert text index to DOM Range
 * Walks through all text nodes to find the exact position
 */
function findTextRange(
  element: HTMLElement,
  startIndex: number,
  endIndex: number
): Range | null {
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );

  let currentOffset = 0;
  let startNode: Node | null = null;
  let startOffset = 0;
  let endNode: Node | null = null;
  let endOffset = 0;

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const textLength = textNode.textContent?.length || 0;

    // Find start position
    if (!startNode && currentOffset + textLength > startIndex) {
      startNode = textNode;
      startOffset = startIndex - currentOffset;
    }

    // Find end position
    if (currentOffset + textLength >= endIndex) {
      endNode = textNode;
      endOffset = endIndex - currentOffset;
      break;
    }

    currentOffset += textLength;
  }

  if (!startNode || !endNode) {
    console.error("Could not create range from text indices");
    return null;
  }

  const range = document.createRange();
  try {
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    return range;
  } catch (error) {
    console.error("Error creating range:", error);
    return null;
  }
}
