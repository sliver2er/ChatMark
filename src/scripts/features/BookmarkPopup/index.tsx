import { createPortal } from "react-dom";
import { Popover } from "@mantine/core";
import { useTextSelection } from "./hooks/useTextSelection";
import { useFloatingPortal } from "./hooks/useFloatingPortal";
import { BookmarkBtn } from "./components/BookmarkBtn";
import { BookmarkSaveMenu } from "./components/BookmarkSaveMenu";
import { useSessionStore } from "@/stores/useSessionStore";
import { useBookmarkStore } from "@/stores/useBookmarkStore";
import { captureTextSelection } from "./utils/selectText";
import { error, warn } from "@/shared/logger";
import { BookmarkItem } from "@/types";
import { useIsDark } from "@/shared/hooks/useIsDark";

export function BookmarkPopup() {
  const [menuOpened, setMenuOpened] = useState(false);
  const [capturedBookmark, setCapturedBookmark] = useState<BookmarkItem | null>(null);

  // Text selection-based portal
  // Disable selection tracking when menu is open to prevent it from disappearing during streaming
  const selectionState = useTextSelection(!menuOpened);
  const floatingPortal = useFloatingPortal(selectionState, true);

  const targetElement = floatingPortal;

  const sessionId = useSessionStore((state) => state.sessionId);
  const addBookmark = useBookmarkStore((state) => state.addBookmark);
  const isDark = useIsDark();

  // Cleanup: close menu if target element disappears
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
      parent_bookmark: parentId ?? null,
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
      onChange={setMenuOpened}
      position="bottom"
      withArrow
      shadow="md"
      middlewares={{
        shift: { padding: 32 },
        flip: { fallbackPlacements: ["top"], padding: 32 },
        inline: true,
      }}
      offset={12}
      floatingStrategy="fixed"
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
          defaultName={capturedBookmark?.bookmark_name || ""}
        />
      </Popover.Dropdown>
    </Popover>,
    targetElement
  );
}
