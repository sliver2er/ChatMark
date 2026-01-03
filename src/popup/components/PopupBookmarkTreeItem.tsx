import { UnstyledButton, Group, Text, Box, Stack, Collapse, ActionIcon } from "@mantine/core";
import { IconBookmark, IconFolder, IconFolderOpen } from "@tabler/icons-react";
import { BookmarkItem as BookmarkItemType } from "@/types";
import {
  getChildBookmarks,
  hasChildren,
  sortBookmarksByOrder,
} from "@/utils/bookmarkTreeUtils";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

interface PopupBookmarkTreeItemProps {
  bookmark: BookmarkItemType;
  level: number;
  bookmarks: BookmarkItemType[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  selectedId?: string;
  onSelectBookmark?: (bookmark: BookmarkItemType) => void;
}

export const PopupBookmarkTreeItem = ({
  bookmark,
  level,
  bookmarks,
  expandedIds,
  onToggleExpand,
  selectedId,
  onSelectBookmark,
}: PopupBookmarkTreeItemProps) => {
  const children = sortBookmarksByOrder(getChildBookmarks(bookmarks, bookmark.id));
  const isFolder = hasChildren(bookmarks, bookmark.id);
  const isExpanded = expandedIds.has(bookmark.id);
  const isSelected = selectedId === bookmark.id;
  const colors = useThemeColors();

  const handleClick = () => {
    if (onSelectBookmark) {
      onSelectBookmark(bookmark);
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

  return (
    <>
      <Box
        py={4}
        px={4}
        pl={level * 16 + 8}
        display="flex"
        style={(theme) => ({
          borderRadius: theme.radius.md,
          backgroundColor: isSelected ? colors.bookmarkItem.bgSelected : colors.bookmarkItem.bg,
          border: isSelected
            ? `1px solid ${colors.bookmarkItem.borderSelected}`
            : `1px solid ${colors.bookmarkItem.border}`,
          cursor: "pointer",
          transition: "all 0.15s ease",
          "&:hover": {
            backgroundColor: isSelected
              ? colors.bookmarkItem.bgSelectedHover
              : colors.bookmarkItem.bgHover,
          },
        })}
      >
        <Group
          gap="sm"
          wrap="nowrap"
          style={{ width: "100%", minWidth: 0, flex: "1 1 0" }}
        >
          {isFolder ? (
            <ActionIcon
              variant="subtle"
              w="20px"
              h="20px"
              onClick={handleToggleFolder}
              style={{ flexShrink: 0 }}
              c={isSelected ? undefined : "dimmed"}
            >
              {getIcon()}
            </ActionIcon>
          ) : (
            <Box
              w="20px"
              h="20px"
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
              size="xs"
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
      </Box>

      {isFolder && (
        <Collapse in={isExpanded}>
          <Stack gap={2}>
            {children.map((child) => (
              <PopupBookmarkTreeItem
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
        </Collapse>
      )}
    </>
  );
};
