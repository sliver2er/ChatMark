import { createPortal } from "react-dom";
import { useBookmark } from "./hooks/useBookmark";
import { BookmarkIcon } from "./components/BookmarkBtn";

export function BookmarkPopup() {
  const targetElement = useBookmark();

  if (!targetElement) return null;

  return createPortal(
    <BookmarkIcon onClick={() => alert("bookmark")} />,
    targetElement
  );
}
