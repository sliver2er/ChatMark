import { createPortal } from "react-dom";
import { useBookmarkPortal } from "./hooks/useBookmarkPortal";
import { BookmarkBtn } from "./components/BookmarkBtn";
import { getSessionId } from "@/shared/functions/getSessionId";
import { captureTextSelection } from "./utils/selectText";
import { error, log } from "@/shared/logger";
import { useBookmark } from "@/hooks/useBookmark";


export function BookmarkPopup() {
  const targetElement = useBookmarkPortal();
  const sessionId = getSessionId();

  const { addBookmark } = useBookmark(sessionId || "");

  if (!targetElement) return null;

  const handleBookmarkClick = async () => {
    const bookmarkItem = captureTextSelection();

    if (!bookmarkItem) {
      error("Failed to capture text selection");
      return;
    }

    if (!sessionId) {
      error("Failed to get session ID");
      return;
    }

    try {
      await addBookmark(bookmarkItem);
    } catch (err) {
      error("Failed to add bookmark:", err);
    }
  };

  return createPortal(
    <BookmarkBtn onClick={handleBookmarkClick} />,
    targetElement
  );
}
