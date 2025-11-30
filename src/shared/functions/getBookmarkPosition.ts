import { BookmarkItem } from "@/types";

/**
 * Find the message element containing the bookmarked text
 * Returns the message element to scroll to
 */
export function getBookmarkPosition(bookmark: BookmarkItem): HTMLElement | null {
  // Find the message element by data-message-id
  const messageElement = document.querySelector(
    `[data-message-id="${bookmark.message_id}"]`
  ) as HTMLElement;

  if (!messageElement) {
    console.error(`Message with id ${bookmark.message_id} not found`);
    return null;
  }

  return messageElement;
}
