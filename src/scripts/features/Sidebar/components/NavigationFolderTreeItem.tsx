import { UnstyledButton, Group, Text, Box, Stack, Collapse, ActionIcon, Flex } from "@mantine/core";
import { IconBookmark, IconFolder, IconFolderOpen, IconTrash } from "@tabler/icons-react";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { NavigateApi } from "@/api/NavigateApi";
import { getChildBookmarks, hasChildren, sortBookmarksByOrder } from "@/utils/bookmarkTreeUtils";
import { useIsDark } from "@/shared/hooks/useIsDark";
import { useBookmarkStore } from "@/stores/useBookmarkStore";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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
  const isDark = useIsDark();
  const children = sortBookmarksByOrder(getChildBookmarks(bookmarks, bookmark.id));
  const isFolder = hasChildren(bookmarks, bookmark.id);
  const isExpanded = expandedIds.has(bookmark.id);
  const isSelected = selectedId === bookmark.id;
  const colors = useThemeColors();
  const deleteBookmark = useBookmarkStore((state) => state.deleteBookmark);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: bookmark.id,
    data: {
      type: "bookmark",
      bookmark,
    },
  });

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

  return (
    <>
      <Box
        ref={setNodeRef}
        py={4}
        px={4}
        pl={level * 20 + 12}
        display="flex"
        {...attributes}
        {...listeners}
        style={(theme) => ({
          ...style,
          borderRadius: theme.radius.md,
          backgroundColor: isSelected
            ? isDark
              ? "rgba(255, 255, 255, 0.06)"
              : "rgba(0, 0, 0, 0.04)"
            : "transparent",
          border: isSelected
            ? `1px solid ${isDark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)"}`
            : "1px solid transparent",
          cursor: isDragging ? "grabbing" : "grab",
          "&:hover": {
            backgroundColor: isSelected
              ? isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)"
              : isDark
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.03)",
          },
        })}
      >
        <Group gap="sm" wrap="nowrap" style={{ width: "100%", minWidth: 0, flex: "1 1 0" }}>
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
