import { useState, useEffect, useCallback } from "react";
import { isValidChatSelection, getSelectionPosition } from "../utils/selectionHelpers";

export interface TextSelectionState {
  hasValidSelection: boolean;
  position: { x: number; y: number } | null;
  range: Range | null;
}

export function useTextSelection(): TextSelectionState {
  const [state, setState] = useState<TextSelectionState>({
    hasValidSelection: false,
    position: null,
    range: null,
  });

  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();

    if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
      setState({ hasValidSelection: false, position: null, range: null });
      return;
    }

    const range = selection.getRangeAt(0);
    const selectedText = range.toString().trim();

    if (!selectedText || !isValidChatSelection(selection)) {
      setState({ hasValidSelection: false, position: null, range: null });
      return;
    }

    const position = getSelectionPosition(range);
    setState({
      hasValidSelection: true,
      position,
      range,
    });
  }, []);

  useEffect(() => {
    // Debounce to avoid excessive updates
    let timeoutId: NodeJS.Timeout;

    const debouncedHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleSelectionChange, 100);
    };

    document.addEventListener("selectionchange", debouncedHandler);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("selectionchange", debouncedHandler);
    };
  }, [handleSelectionChange]);

  return state;
}
