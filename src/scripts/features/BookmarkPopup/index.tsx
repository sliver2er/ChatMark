import { createPortal } from "react-dom";
import { Popover } from "@mantine/core";
import { useBookmarkPortal } from "./hooks/useBookmarkPortal";
import { useTextSelection } from "./hooks/useTextSelection";
import { useFloatingPortal } from "./hooks/useFloatingPortal";
import { BookmarkBtn } from "./components/BookmarkBtn";
import { BookmarkSaveMenu } from "./components/BookmarkSaveMenu";
import { getSessionId } from "@/shared/functions/getSessionId";
import { captureTextSelection } from "./utils/selectText";
import { error, warn } from "@/shared/logger";
import { useBookmark } from "@/hooks/useBookmark";
import { BookmarkItem } from "@/types";
import { useIsDark } from "@/shared/hooks/useIsDark";

export function BookmarkPopup() {
  // OLD: Button-anchored portal (keep for backward compatibility)
  const legacyPortal = useBookmarkPortal();

  const [menuOpened, setMenuOpened] = useState(false);
  const [capturedBookmark, setCapturedBookmark] = useState<BookmarkItem | null>(null);

  // NEW: Text selection-based portal (only active if legacy is not available)
  // Disable selection tracking when menu is open to prevent it from disappearing during streaming
  const selectionState = useTextSelection(!menuOpened);
  const floatingPortal = useFloatingPortal(selectionState, !legacyPortal);

  // Use legacy portal if available, otherwise use floating portal
  const targetElement = legacyPortal || floatingPortal;

  const sessionId = getSessionId();
  const { addBookmark } = useBookmark(sessionId || "");

  const isDark = useIsDark();

  // Close menu when selection changes or disappears
  useEffect(() => {
    if (!selectionState.hasValidSelection && menuOpened && floatingPortal) {
      setMenuOpened(false);
      setCapturedBookmark(null);
    }
  }, [selectionState.hasValidSelection, menuOpened, floatingPortal]);

  // Existing cleanup logic for legacy portal
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
      warn("Failed to capture text selection");
      return;
    }

    if (!sessionId) {
      warn("Failed to get session ID");
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
      position="bottom"
      withArrow
      shadow="md"
      closeOnClickOutside={false}
      clickOutsideEvents={[]}
      withinPortal={false}
      middlewares={{
        shift: { padding: 8 },
        flip: { padding: 8 },
      }}
      offset={8}
    >
      <Popover.Target>
        <BookmarkBtn onClick={handleBookmarkClick} />
      </Popover.Target>
      <Popover.Dropdown
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        bg={isDark ? "dark.8" : "white"}
      >
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
