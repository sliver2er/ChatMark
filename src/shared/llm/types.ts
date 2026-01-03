import { LLMProvider } from "@/types";

export interface LLMProviderStrategy {
  readonly provider: LLMProvider;

  detectTheme(): "dark" | "light";
  watchTheme(callback: (theme: "dark" | "light") => void): () => void;

  getSessionId(): string | null;
  isInChatSession(): boolean;
  getSessionTitle(): string | null;

  getMessageElementSelector(): string;
  getScrollContainerSelector(): string;
  findMessageId(element: Element): string | null;

  isValidChatSelection(range: Range): boolean;

  buildSessionUrl(sessionId: string): string;
}
