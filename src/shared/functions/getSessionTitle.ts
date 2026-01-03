/**
 * Extract session title from ChatGPT sidebar
 * DOM structure: a[data-sidebar-item="true"][href="/c/{sessionId}"] .truncate span
 */
export function getSessionTitle(sessionId: string): string | null {
  const selector = `a[data-sidebar-item="true"][href="/c/${sessionId}"] .truncate span`;
  const titleEl = document.querySelector(selector);

  if (titleEl?.textContent) {
    return titleEl.textContent.trim();
  }

  // Fallback: try alternative selector
  const altSelector = `a[href="/c/${sessionId}"] span[dir="auto"]`;
  const altTitleEl = document.querySelector(altSelector);

  return altTitleEl?.textContent?.trim() || null;
}
