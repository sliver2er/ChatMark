import { injectBookmarkButton } from "./components/injectBookmarkButton";

export function findAskGPTButton(): HTMLElement | null {
  const buttons = document.querySelectorAll("button");

  for (const btn of Array.from(buttons)) {
    if (btn.textContent?.trim() === "ChatGPT에게 묻기") {
      return btn as HTMLElement;
    }
  }

  return null;
}

const observer = new MutationObserver(() => {
  const askGPTBtn = findAskGPTButton();
  if (askGPTBtn) {
    injectBookmarkButton();
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
