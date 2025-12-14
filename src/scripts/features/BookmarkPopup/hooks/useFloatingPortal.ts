import { useState, useEffect } from "react";
import { TextSelectionState } from "./useTextSelection";

const PORTAL_ID = "chatmark-bookmark-floating-portal";

export function useFloatingPortal(
  selectionState: TextSelectionState,
  enabled: boolean = true
): HTMLElement | null {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Don't create portal if disabled (e.g., when legacy portal is active)
    if (!enabled) {
      const existing = document.getElementById(PORTAL_ID);
      if (existing) {
        existing.style.display = "none";
      }
      setPortalElement(null);
      return;
    }

    if (!selectionState.hasValidSelection || !selectionState.position) {
      // Hide portal if no valid selection
      const existing = document.getElementById(PORTAL_ID);
      if (existing) {
        existing.style.display = "none";
      }
      setPortalElement(null);
      return;
    }

    // Create or reuse portal container
    let container = document.getElementById(PORTAL_ID) as HTMLElement;

    if (!container) {
      container = document.createElement("div");
      container.id = PORTAL_ID;
      container.style.position = "fixed";
      container.style.zIndex = "9999";
      container.style.pointerEvents = "auto";
      document.body.appendChild(container);
    }

    // Update position - always position above selected text
    const { x, y } = selectionState.position;

    container.style.display = "block";
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = "translateY(-100%)"; // Position above the selection

    setPortalElement(container);

    return () => {
      // Don't remove container, just hide it (reused)
      if (container) {
        container.style.display = "none";
      }
    };
  }, [selectionState, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const container = document.getElementById(PORTAL_ID);
      if (container) {
        container.remove();
      }
    };
  }, []);

  return portalElement;
}
