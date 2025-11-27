import { injectBookmarkButton } from "./injectBookmarkButton";



export function findAskGPTButton(): HTMLElement | null {
  const buttons = document.querySelectorAll("button");

  for (const btn of Array.from(buttons)) {
    if (btn.textContent?.trim() === "ChatGPT에게 묻기") {
      return btn as HTMLElement;
    }
  }

  return null;
}

// ChatGPT DOM 상단에 AskGPT 버튼이 생기는 순간을 감지해야 함
const observer = new MutationObserver(() => {
  const askGPTBtn = findAskGPTButton();
  if (askGPTBtn) {
    injectBookmarkButton();
  }
});

// body 전체를 감시
observer.observe(document.body, {
  childList: true,
  subtree: true,
});
