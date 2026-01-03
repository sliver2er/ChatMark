import { useProviderStore } from "@/stores/useProviderStore";

export function isValidChatSelection(selection: Selection): boolean {
  const provider = useProviderStore.getState().provider;
  if (!provider) return false;

  if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
    return false;
  }

  const range = selection.getRangeAt(0);
  const selectedText = range.toString().trim();

  if (!selectedText) {
    return false;
  }

  return provider.isValidChatSelection(range);
}

/**
 * Calculate optimal position for floating button based on selection
 * Position at bottom-right corner to avoid overlapping with AskChatGPT button
 */
export function getSelectionPosition(range: Range): { x: number; y: number } {
  const endRange = range.cloneRange();
  endRange.collapse(false);
  let rect = endRange.getClientRects()[0];

  if (!rect) {
    const rects = range.getClientRects();
    rect = rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();
  }

  // Position at the bottom-right corner of selection
  let x = rect.right + 8; // 8px offset to the right
  let y = rect.bottom + 4; // 4px offset below

  // Boundary detection - prevent overflow
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const buttonApproxWidth = 50; // Approximate button width
  const buttonApproxHeight = 40; // Approximate button height

  // Adjust horizontal position if too close to right edge
  if (x + buttonApproxWidth > viewportWidth) {
    x = rect.right - buttonApproxWidth - 8; // Position to left of selection end
  }

  // Adjust vertical position if too close to bottom edge
  if (y + buttonApproxHeight > viewportHeight) {
    y = rect.top - buttonApproxHeight - 4; // Position above selection
  }

  return { x, y };
}
