import { MessageType, DEFAULT_SETTINGS } from "@/types";

const SELECTION_REMOVE_DELAY = 2000;

async function getScrollBehavior(): Promise<ScrollBehavior> {
  try {
    const response = await chrome.runtime.sendMessage({ type: MessageType.SettingsGet });
    if (response.success && response.data.scrollBehavior) {
      return response.data.scrollBehavior;
    }
  } catch (error) {
    console.error("[ChatMark] Failed to get scroll behavior:", error);
  }
  return DEFAULT_SETTINGS.scrollBehavior;
}

export async function scrollToRange(range: Range, fallbackElement: HTMLElement) {
  const behavior = await getScrollBehavior();
  const scrollTarget =
    range.startContainer.nodeType === Node.TEXT_NODE
      ? range.startContainer.parentElement
      : (range.startContainer as HTMLElement);

  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior, block: "center" });
  } else {
    fallbackElement.scrollIntoView({ behavior, block: "center" });
  }
}

export async function scrollToElement(element: HTMLElement) {
  const behavior = await getScrollBehavior();
  element.scrollIntoView({ behavior, block: "center" });
}

export function selectElement(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  selection.removeAllRanges();
  const messageRange = document.createRange();
  messageRange.selectNodeContents(element);
  selection.addRange(messageRange);

  setTimeout(() => {
    selection.removeAllRanges();
  }, SELECTION_REMOVE_DELAY);
}

export async function scrollToBottom() {
  const behavior = await getScrollBehavior();

  // ChatGPT uses a specific scrollable container, not window
  // Find the main scrollable element
  const scrollableElement =
    document.querySelector("main") ||
    document.querySelector('[class*="scroll"]') ||
    document.documentElement;

  console.log("[ChatMark] Scrolling element:", scrollableElement.tagName, {
    scrollHeight: scrollableElement.scrollHeight,
    scrollTop: scrollableElement.scrollTop,
    behavior,
  });

  scrollableElement.scrollTo({
    top: scrollableElement.scrollHeight,
    behavior,
  });
}
