/**
 * Check if current URL is within a ChatGPT chat session
 * Returns true if URL contains /c/{session_id} pattern
 *
 * Valid session URLs:
 * - https://chatgpt.com/c/{session_id}
 * - https://chatgpt.com/g/g-.../c/{session_id}
 *
 * Invalid (non-session) URLs:
 * - https://chatgpt.com
 * - https://chatgpt.com/g/g-.../
 */
export function isInChatSession(): boolean {
  return /\/c\/[^\/]+/.test(window.location.pathname);
}
