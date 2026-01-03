import { Stack } from "@mantine/core";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { NavigationFolderTreeItem } from "./NavigationFolderTreeItem";
import { getRootBookmarks, sortBookmarksByOrder } from "@/utils/bookmarkTreeUtils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface NavigationBookmarkTreeViewProps {
  bookmarks: BookmarkItemType[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  selectedId?: string;
  onSelectBookmark?: (bookmark: BookmarkItemType) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const NavigationBookmarkTreeView = ({
  bookmarks,
  expandedIds,
  onToggleExpand,
  selectedId,
  onSelectBookmark,
  onDragEnd,
}: NavigationBookmarkTreeViewProps) => {
  const rootBookmarks = sortBookmarksByOrder(getRootBookmarks(bookmarks));
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  if (rootBookmarks.length === 0) {
    return null;
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    onDragEnd(event);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={rootBookmarks.map((b) => b.id)}
        strategy={verticalListSortingStrategy}
      >
        <Stack gap={8}>
          {rootBookmarks.map((bookmark) => (
            <NavigationFolderTreeItem
              key={bookmark.id}
              bookmark={bookmark}
              level={0}
              bookmarks={bookmarks}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
              selectedId={selectedId}
              onSelectBookmark={onSelectBookmark}
            />
          ))}
        </Stack>
      </SortableContext>

      <DragOverlay>
        {activeId ? (
          <div style={{ opacity: 0.5 }}>
            {bookmarks.find((b) => b.id === activeId)?.bookmark_name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
