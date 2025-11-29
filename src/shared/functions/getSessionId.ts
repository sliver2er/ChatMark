/**
 * Extract session_id from ChatGPT URL
 * URL format: https://chatgpt.com/c/{session_id}
 */
export function getSessionId(): string | null {
  const match = window.location.pathname.match(/\/c\/([^\/]+)/);
  return match ? match[1] : null;
}
