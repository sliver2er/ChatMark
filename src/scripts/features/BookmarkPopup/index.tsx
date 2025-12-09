import { createPortal } from "react-dom";
import { useState, useEffect } from "react";
import { Popover } from "@mantine/core";
import { useBookmarkPortal } from "./hooks/useBookmarkPortal";
import { BookmarkBtn } from "./components/BookmarkBtn";
import { BookmarkSaveMenu } from "./components/BookmarkSaveMenu";
import { getSessionId } from "@/shared/functions/getSessionId";
import { captureTextSelection } from "./utils/selectText";
import { error } from "@/shared/logger";
import { useBookmark } from "@/hooks/useBookmark";
import { BookmarkItem } from "@/types";


export function BookmarkPopup() {
  const targetElement = useBookmarkPortal();
  const sessionId = getSessionId();

  const { addBookmark } = useBookmark(sessionId || "");

  const [menuOpened, setMenuOpened] = useState(false);
  const [capturedBookmark, setCapturedBookmark] = useState<BookmarkItem | null>(null);

  // targetElement가 변경되면 Popover를 닫음 (재마운트 대응)
  useEffect(() => {
    if (!targetElement && menuOpened) {
      setMenuOpened(false);
      setCapturedBookmark(null);
    }
  }, [targetElement, menuOpened]);

  if (!targetElement) return null;

  const handleBookmarkClick = () => {
    const bookmarkItem = captureTextSelection();

    if (!bookmarkItem) {
      error("Failed to capture text selection");
      return;
    }

    if (!sessionId) {
      error("Failed to get session ID");
      return;
    }

    setCapturedBookmark(bookmarkItem);
    setMenuOpened(true);
  };

  const handleSave = async (name: string, parentId?: string) => {
    if (!capturedBookmark) return;

    const finalBookmark: BookmarkItem = {
      ...capturedBookmark,
      bookmark_name: name,
      parent_bookmark: parentId,
    };

    try {
      await addBookmark(finalBookmark);
      setCapturedBookmark(null);
    } catch (err) {
      error("Failed to add bookmark:", err);
      throw err;
    }
  };

  return createPortal(
    <Popover
      opened={menuOpened}
      onChange={() => {
        // closeOnClickOutside={false}이므로 onChange를 무시
      }}
      position="bottom"
      withArrow
      shadow="md"
      closeOnClickOutside={false}
      clickOutsideEvents={['mouseup', 'touchend']}
      withinPortal={false}
    >
      <Popover.Target>
        <BookmarkBtn onClick={handleBookmarkClick} />
      </Popover.Target>
      <Popover.Dropdown>
        <BookmarkSaveMenu
          opened={menuOpened}
          onClose={() => setMenuOpened(false)}
          onSave={handleSave}
          sessionId={sessionId || ""}
          defaultName={capturedBookmark?.bookmark_name || ""}
        />
      </Popover.Dropdown>
    </Popover>,
    targetElement
  );
}
