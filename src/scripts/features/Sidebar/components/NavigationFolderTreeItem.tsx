import { UnstyledButton, Group, Text, ActionIcon, Box, Stack, Collapse } from "@mantine/core"
import {
  IconBookmark,
  IconFolder,
  IconFolderOpen,
  IconChevronRight,
  IconChevronDown
} from "@tabler/icons-react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { NavigateApi } from "@/api/NavigateApi"
import { getChildBookmarks, hasChildren, sortBookmarksByDate } from "@/utils/bookmarkTreeUtils"

interface NavigationFolderTreeItemProps {
  bookmark: BookmarkItemType
  level: number
  bookmarks: BookmarkItemType[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}

export const NavigationFolderTreeItem = ({
  bookmark,
  level,
  bookmarks,
  expandedIds,
  onToggleExpand,
}: NavigationFolderTreeItemProps) => {
  const children = sortBookmarksByDate(getChildBookmarks(bookmarks, bookmark.id))
  const isFolder = hasChildren(bookmarks, bookmark.id)
  const isExpanded = expandedIds.has(bookmark.id)

  const handleClick = async () => {
    try {
      await NavigateApi.navigateToBookmark(bookmark)
    } catch (error) {
      console.error("Failed to navigate to bookmark:", error)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleExpand(bookmark.id)
  }

  const getIcon = () => {
    if (isFolder) {
      return isExpanded ? <IconFolderOpen size={TREE_ICON_SIZE} /> : <IconFolder size={TREE_ICON_SIZE} />
    }
    return <IconBookmark size={TREE_ICON_SIZE} />
  }

  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        w="100%"
        p="xs"
        pl={level * TREE_INDENT_PER_LEVEL + TREE_BASE_INDENT}
      >
        <Group gap="xs" wrap="nowrap">
          {isFolder ? (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleToggle}
              style={{ flexShrink: 0 }}
            >
              {isExpanded ? <IconChevronDown size={TREE_CHEVRON_SIZE} /> : <IconChevronRight size={TREE_CHEVRON_SIZE} />}
            </ActionIcon>
          ) : (
            <Box w={TREE_SPACER_WIDTH} style={{ flexShrink: 0 }} />
          )}
          <Box style={{ flexShrink: 0 }}>
            {getIcon()}
          </Box>
          <Text
            size="sm"
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1,
            }}
          >
            {bookmark.bookmark_name}
          </Text>
        </Group>
      </UnstyledButton>

      {isFolder && (
        <Collapse in={isExpanded}>
          <Stack gap="xs" mt="xs">
            {children.map((child) => (
              <NavigationFolderTreeItem
                key={child.id}
                bookmark={child}
                level={level + 1}
                bookmarks={bookmarks}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  )
}
