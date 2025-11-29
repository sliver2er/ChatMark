import { createPortal } from "react-dom";
import { useBookmark } from "./hooks/useBookmark";
import { BookmarkBtn } from "./components/BookmarkBtn";

export function BookmarkPopup() {
  const targetElement = useBookmark();

  if (!targetElement) return null;
  console.log("targetElement", targetElement)

  return createPortal(
    <BookmarkBtn onClick={() => alert("bookmark")} />,
    targetElement
  );
}
