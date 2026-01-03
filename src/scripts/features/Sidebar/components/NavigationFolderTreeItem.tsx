import { UnstyledButton, Group, Text, Box, Stack, Collapse, ActionIcon, Flex } from "@mantine/core";
import { IconBookmark, IconFolder, IconFolderOpen, IconTrash } from "@tabler/icons-react";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { NavigateApi } from "@/api/NavigateApi";
import {
  getChildBookmarks,
  hasChildren,
  sortBookmarksByOrder,
  wouldCreateCycle,
} from "@/utils/bookmarkTreeUtils";
import { useIsDark } from "@/shared/hooks/useIsDark";
import { useBookmarkStore } from "@/stores/useBookmarkStore";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable, useDndContext } from "@dnd-kit/core";

interface NavigationFolderTreeItemProps {
  bookmark: BookmarkItemType;
  level: number;
  bookmarks: BookmarkItemType[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  selectedId?: string;
  onSelectBookmark?: (bookmark: BookmarkItemType) => void;
}

export const NavigationFolderTreeItem = ({
  bookmark,
  level,
  bookmarks,
  expandedIds,
  onToggleExpand,
  selectedId,
  onSelectBookmark,
}: NavigationFolderTreeItemProps) => {
  const children = sortBookmarksByOrder(getChildBookmarks(bookmarks, bookmark.id));
  const isFolder = hasChildren(bookmarks, bookmark.id);
  const isExpanded = expandedIds.has(bookmark.id);
  const isSelected = selectedId === bookmark.id;
  const colors = useThemeColors();
  const deleteBookmark = useBookmarkStore((state) => state.deleteBookmark);

  // 자동 펼침 타이머
  const [expandTimer, setExpandTimer] = useState<number | null>(null);

  // dnd-kit 훅들
  const { active, over } = useDndContext();
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: bookmark.id,
    data: {
      type: "bookmark",
      bookmark,
    },
  });

  // 3개의 독립적인 드롭존
  const { isOver: isOverBefore, setNodeRef: setBeforeRef } = useDroppable({
    id: `${bookmark.id}-before`,
    data: {
      type: "insert-before",
      bookmark,
    },
  });

  const { isOver: isOverNest, setNodeRef: setNestRef } = useDroppable({
    id: `${bookmark.id}-nest`,
    data: {
      type: "nest",
      bookmark,
    },
  });

  const { isOver: isOverAfter, setNodeRef: setAfterRef } = useDroppable({
    id: `${bookmark.id}-after`,
    data: {
      type: "insert-after",
      bookmark,
    },
  });

  // 드롭 가능 여부 판정
  const canDrop = useMemo(() => {
    if (!active || active.id === bookmark.id) return false;

    const activeBookmark = bookmarks.find((b) => b.id === active.id);
    if (!activeBookmark) return false;

    // 순환 참조 체크
    if (wouldCreateCycle(bookmarks, activeBookmark.id, bookmark.id)) {
      return false;
    }

    return true;
  }, [active, bookmark.id, bookmarks]);

  const isOver = isOverBefore || isOverNest || isOverAfter;
  const isValidDropTarget = isOver && canDrop;
  const isInvalidDropTarget = isOver && !canDrop;

  // 스타일 헬퍼 함수들
  const getBackgroundColor = useCallback(() => {
    // 삽입 위치(상단/하단)는 배경색 변경 안 함
    if (isValidDropTarget && isOverNest) return colors.dropValid.bg;
    if (isInvalidDropTarget && isOverNest) return colors.dropInvalid.bg;
    if (isSelected) return colors.bookmarkItem.bgSelected;
    return colors.bookmarkItem.bg;
  }, [isValidDropTarget, isInvalidDropTarget, isOverNest, isSelected, colors]);

  const getBorderStyle = useCallback(() => {
    // 삽입 위치는 테두리 변경 안 함
    if (isValidDropTarget && isOverNest) return `2px solid ${colors.dropValid.border}`;
    if (isInvalidDropTarget && isOverNest) return `2px solid ${colors.dropInvalid.border}`;
    if (isSelected) return `1px solid ${colors.bookmarkItem.borderSelected}`;
    return `1px solid ${colors.bookmarkItem.border}`;
  }, [isValidDropTarget, isInvalidDropTarget, isOverNest, isSelected, colors]);

  const getHoverBackgroundColor = useCallback(() => {
    if (isValidDropTarget && isOverNest) return colors.dropValid.bgHover;
    if (isInvalidDropTarget && isOverNest) return colors.dropInvalid.bgHover;
    if (isSelected) return colors.bookmarkItem.bgSelectedHover;
    return colors.bookmarkItem.bgHover;
  }, [isValidDropTarget, isInvalidDropTarget, isOverNest, isSelected, colors]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = async () => {
    if (onSelectBookmark) {
      onSelectBookmark(bookmark);
    }
    try {
      await NavigateApi.navigateToBookmark(bookmark);
    } catch (error) {
      console.error("Failed to navigate to bookmark:", error);
    }
  };

  const handleToggleFolder = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggleExpand(bookmark.id);
  };

  const getIcon = () => {
    if (isFolder) {
      return isExpanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />;
    }
    return <IconBookmark size={16} />;
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      e.stopPropagation();
      await deleteBookmark(bookmark.id);
    } catch (error) {
      console.error("Failed to delete bookmark:", error);
    }
  };

  useEffect(() => {
    if (!isFolder || isExpanded) return;

    // nest 드롭존에 over되었을 때만 자동 펼침
    if (over?.id === `${bookmark.id}-nest`) {
      const timer = window.setTimeout(() => {
        onToggleExpand(bookmark.id);
      }, 1000);

      setExpandTimer(timer);

      return () => {
        clearTimeout(timer);
      };
    } else {
      if (expandTimer) {
        clearTimeout(expandTimer);
        setExpandTimer(null);
      }
    }
  }, [over?.id, bookmark.id, isFolder, isExpanded, onToggleExpand, expandTimer]);
  useEffect(() => {
    return () => {
      if (expandTimer) {
        clearTimeout(expandTimer);
      }
    };
  }, [expandTimer]);

  return (
    <>
      <Box
        ref={setSortableRef}
        py={4}
        px={4}
        pl={level * 20 + 12}
        display="flex"
        style={(theme) => ({
          ...style,
          position: "relative",
          borderRadius: theme.radius.md,
          backgroundColor: getBackgroundColor(),
          border: getBorderStyle(),
          cursor: isDragging ? "grabbing" : "grab",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: getHoverBackgroundColor(),
          },
        })}
        {...attributes}
        {...listeners}
      >
        {/* 상단 삽입 라인 */}
        {isValidDropTarget && isOverBefore && (
          <Box
            style={{
              position: "absolute",
              top: 0,
              left: level * 20 + 12,
              right: 4,
              height: "2px",
              backgroundColor: colors.dropValid.border,
              zIndex: 10,
            }}
          />
        )}

        {/* 하단 삽입 라인 */}
        {isValidDropTarget && isOverAfter && (
          <Box
            style={{
              position: "absolute",
              bottom: 0,
              left: level * 20 + 12,
              right: 4,
              height: "2px",
              backgroundColor: colors.dropValid.border,
              zIndex: 10,
            }}
          />
        )}

        {/* 3개의 드롭존 (투명 오버레이) */}
        <Box
          ref={setBeforeRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "20%",
            pointerEvents: "auto",
            zIndex: 5,
            // 디버그용: isOverBefore일 때만 배경색 표시
            backgroundColor: isOverBefore ? "rgba(99, 102, 241, 0.1)" : "transparent",
          }}
        />
        <Box
          ref={setNestRef}
          style={{
            position: "absolute",
            top: "20%",
            left: 0,
            right: 0,
            height: "60%",
            pointerEvents: "auto",
            zIndex: 5,
            // 디버그용: isOverNest일 때만 배경색 표시
            backgroundColor: isOverNest ? "rgba(99, 102, 241, 0.1)" : "transparent",
          }}
        />
        <Box
          ref={setAfterRef}
          style={{
            position: "absolute",
            top: "80%",
            left: 0,
            right: 0,
            height: "20%",
            pointerEvents: "auto",
            zIndex: 5,
            // 디버그용: isOverAfter일 때만 배경색 표시
            backgroundColor: isOverAfter ? "rgba(99, 102, 241, 0.1)" : "transparent",
          }}
        />

        <Group gap="sm" wrap="nowrap" style={{ width: "100%", minWidth: 0, flex: "1 1 0", position: "relative", zIndex: 10 }}>
          {isFolder ? (
            <ActionIcon
              variant="subtle"
              w="24px"
              h="24px"
              onClick={handleToggleFolder}
              style={{ flexShrink: 0 }}
              c={isSelected ? undefined : "dimmed"}
            >
              {getIcon()}
            </ActionIcon>
          ) : (
            <Box
              w="24px"
              h="24px"
              style={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              c={isSelected ? undefined : "dimmed"}
            >
              {getIcon()}
            </Box>
          )}
          <UnstyledButton
            onClick={handleClick}
            p={0}
            style={{
              display: "flex",
              alignItems: "center",
              flex: "1 1 0",
              minWidth: 0,
            }}
          >
            <Text
              size="sm"
              lh={1.35}
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                flex: "1 1 0",
                minWidth: 0,
              }}
            >
              {bookmark.bookmark_name}
            </Text>
          </UnstyledButton>
        </Group>
        <ActionIcon
          variant="subtle"
          size="sm"
          onClick={handleDelete}
          style={{ flexShrink: 0, marginLeft: 4 }}
          c={colors.deleteColor}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Box>

      {isFolder && (
        <Collapse in={isExpanded}>
          <SortableContext items={children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <Stack gap={4}>
              {children.map((child) => (
                <NavigationFolderTreeItem
                  key={child.id}
                  bookmark={child}
                  level={level + 1}
                  bookmarks={bookmarks}
                  expandedIds={expandedIds}
                  onToggleExpand={onToggleExpand}
                  selectedId={selectedId}
                  onSelectBookmark={onSelectBookmark}
                />
              ))}
            </Stack>
          </SortableContext>
        </Collapse>
      )}
    </>
  );
};
