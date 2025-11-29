import { createPortal } from "react-dom";
import { useBookmarkElement } from "./hooks/useBookmarkElement";
import { BookmarkBtn } from "./components/BookmarkBtn";
import { log } from "@/shared/logger"

export function BookmarkPopup() {
  const targetElement = useBookmarkElement();

  if (!targetElement) return null;
  log("targetElement", targetElement)

  return createPortal(
    <BookmarkBtn onClick={() => alert("bookmark")} />,
    targetElement
  );
}
