import { Stack, Box, Text } from "@mantine/core";
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
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useIsDark } from "@/shared/hooks/useIsDark";
import { useTranslation } from "react-i18next";

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
  const isDark = useIsDark();
  const { t } = useTranslation();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // 외부 드롭 존 설정
  const { setNodeRef: setRootDropZoneRef, isOver: isOverRootZone } = useDroppable({
    id: 'root-drop-zone',
    data: {
      type: 'root-zone',
    },
  });

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

      {/* 외부 드롭 존 */}
      <Box
        ref={setRootDropZoneRef}
        style={{
          minHeight: isOverRootZone ? '80px' : '40px',
          marginTop: '12px',
          border: isOverRootZone
            ? '2px dashed rgba(99, 102, 241, 0.6)'
            : `2px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: '8px',
          backgroundColor: isOverRootZone
            ? 'rgba(99, 102, 241, 0.08)'
            : isDark
            ? 'rgba(255, 255, 255, 0.02)'
            : 'rgba(0, 0, 0, 0.02)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isOverRootZone ? (
          <Text size="sm" fw={500} c="blue.6">
            {t('sidebar.dropToMakeRoot')}
          </Text>
        ) : (
          <Text size="xs" c="dimmed" opacity={0.5}>
            {t('sidebar.dropToMakeRoot')}
          </Text>
        )}
      </Box>

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
