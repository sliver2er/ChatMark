import { LLMProviderStrategy } from "../types";
import { LLMProvider } from "@/types";

export class GeminiProvider implements LLMProviderStrategy {
  readonly provider: LLMProvider = "Gemini";

  detectTheme(): "dark" | "light" {
    return document.body.classList.contains("dark-theme") ? "dark" : "light";
  }

  watchTheme(callback: (theme: "dark" | "light") => void): () => void {
    const observer = new MutationObserver(() => {
      callback(this.detectTheme());
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }

  getSessionId(): string | null {
    const match = window.location.pathname.match(/^\/app\/([a-f0-9]+)/);
    return match ? match[1] : null;
  }

  isInChatSession(): boolean {
    return /^\/app\/[a-f0-9]+/.test(window.location.pathname);
  }

  getSessionTitle(): string | null {
    const titleEl = document.querySelector("conversation-actions .conversation-title");
    if (titleEl?.textContent?.trim()) {
      return titleEl.textContent.trim();
    }

    const selectedConv = document.querySelector(".conversation.selected .conversation-title");
    return selectedConv?.textContent?.trim() || null;
  }

  getMessageElementSelector(): string {
    return ".conversation-container";
  }

  getScrollContainerSelector(): string {
    return "#chat-history";
  }

  findMessageId(element: Element): string | null {
    const container = element.closest(".conversation-container");
    return container?.id || null;
  }

  isValidChatSelection(range: Range): boolean {
    const container = range.commonAncestorContainer;
    const parent = container instanceof Element ? container : container.parentElement;
    return parent?.closest("message-content, user-query-content") !== null;
  }

  buildSessionUrl(sessionId: string): string {
    return `https://gemini.google.com/app/${sessionId}`;
  }
}
