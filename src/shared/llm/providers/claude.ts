import { LLMProviderStrategy } from "../types";
import { LLMProvider } from "@/types";

export class ClaudeProvider implements LLMProviderStrategy {
  readonly provider: LLMProvider = "Claude";

  detectTheme(): "dark" | "light" {
    const bgColor = getComputedStyle(document.body).backgroundColor;
    const rgb = bgColor.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      const brightness = (parseInt(rgb[0]) + parseInt(rgb[1]) + parseInt(rgb[2])) / 3;
      return brightness < 128 ? "dark" : "light";
    }
    return "light";
  }

  watchTheme(callback: (theme: "dark" | "light") => void): () => void {
    const observer = new MutationObserver(() => {
      callback(this.detectTheme());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    return () => observer.disconnect();
  }

  getSessionId(): string | null {
    const match = window.location.pathname.match(/\/chat\/([a-f0-9-]+)/);
    return match ? match[1] : null;
  }

  isInChatSession(): boolean {
    return /\/chat\/[a-f0-9-]+/.test(window.location.pathname);
  }

  getSessionTitle(): string | null {
    const titleEl = document.querySelector('button[data-testid="chat-title-button"] .truncate');
    return titleEl?.textContent?.trim() || null;
  }

  getMessageElementSelector(): string {
    return "div[data-test-render-count]";
  }

  getScrollContainerSelector(): string {
    return ".overflow-y-scroll.overflow-x-hidden";
  }

  findMessageId(element: Element): string | null {
    const messageEl = element.closest("div[data-test-render-count]");
    if (!messageEl) return null;

    const allMessages = document.querySelectorAll("div[data-test-render-count]");
    const index = Array.from(allMessages).indexOf(messageEl);
    return index >= 0 ? `msg-${index}` : null;
  }

  isValidChatSelection(range: Range): boolean {
    const container = range.commonAncestorContainer;
    const parent = container instanceof Element ? container : container.parentElement;
    return parent?.closest('[data-testid="user-message"], .font-claude-response') !== null;
  }

  buildSessionUrl(sessionId: string): string {
    return `https://claude.ai/chat/${sessionId}`;
  }
}
