import { LLMProviderStrategy } from "../types";
import { LLMProvider } from "@/types";

export class ChatGPTProvider implements LLMProviderStrategy {
  readonly provider: LLMProvider = "ChatGPT";

  detectTheme(): "dark" | "light" {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  }

  watchTheme(callback: (theme: "dark" | "light") => void): () => void {
    const observer = new MutationObserver(() => {
      callback(this.detectTheme());
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }

  getSessionId(): string | null {
    const match = window.location.pathname.match(/\/c\/([^/]+)/);
    return match ? match[1] : null;
  }

  isInChatSession(): boolean {
    return /\/c\/[^/]+/.test(window.location.pathname);
  }

  getSessionTitle(): string | null {
    const sessionId = this.getSessionId();
    if (!sessionId) return null;

    const linkEl = document.querySelector(
      `nav a[href*="/c/${sessionId}"]`
    ) as HTMLAnchorElement | null;

    return linkEl?.textContent?.trim() || null;
  }

  getMessageElementSelector(): string {
    return "[data-message-id]";
  }

  getScrollContainerSelector(): string {
    return 'div[class*="react-scroll-to-bottom"]';
  }

  findMessageId(element: Element): string | null {
    const messageEl = element.closest("[data-message-id]") as HTMLElement | null;
    return messageEl?.dataset.messageId || null;
  }

  isValidChatSelection(range: Range): boolean {
    const container = range.commonAncestorContainer;
    const parent = container instanceof Element ? container : container.parentElement;
    return parent?.closest("[data-message-id]") !== null;
  }

  buildSessionUrl(sessionId: string): string {
    return `https://chatgpt.com/c/${sessionId}`;
  }
}
