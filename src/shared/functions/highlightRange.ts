import { MessageType, DEFAULT_SETTINGS } from "@/types";

/**
 * Temporarily highlight a text range with a visual effect using Selection API
 * The highlight fades out after 2 seconds
 */
export async function highlightRange(range: Range): Promise<void> {
  const selection = window.getSelection();
  if (!selection) return;

  // Get highlight color from settings
  let highlightColor = DEFAULT_SETTINGS.highlightColor;
  try {
    const response = await chrome.runtime.sendMessage({ type: MessageType.SettingsGet });
    if (response.success && response.data.highlightColor) {
      highlightColor = response.data.highlightColor;
    }
  } catch (error) {
    console.error('[ChatMark] Failed to get settings:', error);
  }

  const styleElement = document.createElement("style");
  styleElement.id = "chatmark-highlight-style";
  styleElement.textContent = `
    ::selection {
      background-color: ${highlightColor} !important;
      color: inherit !important;
    }
    ::-moz-selection {
      background-color: ${highlightColor} !important;
      color: inherit !important;
    }
  `;
  document.head.appendChild(styleElement);
  selection.removeAllRanges();
  selection.addRange(range);
  setTimeout(() => {
    if (selection) {
      selection.removeAllRanges();
    }
    styleElement.remove();
  }, 2000);
}
