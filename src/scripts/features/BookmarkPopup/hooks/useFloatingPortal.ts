import { TextSelectionState } from "./useTextSelection";

const PORTAL_ID = "chatmark-bookmark-floating-portal";

export function useFloatingPortal(
  selectionState: TextSelectionState,
  enabled: boolean = true
): HTMLElement | null {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!enabled || !selectionState.hasValidSelection || !selectionState.position) {
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

    // Update position to bottom-right of selection
    const { x, y } = selectionState.position;

    container.style.display = "block";
    container.style.left = `${x}px`;
    container.style.top = `${y}px`;
    container.style.transform = ""; // No transform needed - position is already calculated

    setPortalElement(container);

    return () => {
      if (container) {
        container.style.display = "none";
      }
    };
  }, [selectionState, enabled]);

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
