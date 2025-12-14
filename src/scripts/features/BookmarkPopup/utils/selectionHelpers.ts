/**
 * Find the closest parent element with data-message-id
 * Used to determine if a text selection is within a ChatGPT message
 */
export function findMessageId(node: Node): HTMLElement | null {
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
 * Check if a text selection is within a ChatGPT message
 */
export function isValidChatSelection(selection: Selection): boolean {
  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString().trim();

  if (!selectedText) {
    return false;
  }

  // Check if selection is within a message element
  const messageNode = findMessageId(range.startContainer);
  return messageNode !== null;
}

/**
 * Calculate optimal position for floating button based on selection
 */
export function getSelectionPosition(range: Range): { x: number; y: number } {
  const rect = range.getBoundingClientRect();

  // Position at the end (bottom-right) of selection
  let x = rect.right + 8; // 8px offset to the right
  let y = rect.bottom;

  // Boundary detection - prevent overflow
  const viewportWidth = window.innerWidth;
  const buttonApproxWidth = 50; // Approximate button width

  // Adjust horizontal position if too close to right edge
  if (x + buttonApproxWidth > viewportWidth) {
    x = rect.left - buttonApproxWidth - 8; // Position to left instead
  }

  // Keep vertical position (will be adjusted by useFloatingPortal if needed)
  return { x, y };
}
