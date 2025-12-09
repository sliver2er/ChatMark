import { createPortal } from "react-dom";
import { useState } from "react";
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

  // 디버깅: menuOpened 상태 변화 추적
  const handleSetMenuOpened = (value: boolean) => {
    console.log('[BookmarkPopup] setMenuOpened called:', value, new Error().stack);
    setMenuOpened(value);
  };

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
    handleSetMenuOpened(true);
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
      position="bottom"
      withArrow
      shadow="md"
      closeOnClickOutside={false}
      trapFocus={false}
    >
      <Popover.Target>
        <BookmarkBtn onClick={handleBookmarkClick} />
      </Popover.Target>
      <Popover.Dropdown>
        <BookmarkSaveMenu
          opened={menuOpened}
          onClose={() => handleSetMenuOpened(false)}
          onSave={handleSave}
          sessionId={sessionId || ""}
          defaultName={capturedBookmark?.bookmark_name || ""}
        />
      </Popover.Dropdown>
    </Popover>,
    targetElement
  );
}
