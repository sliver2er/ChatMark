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
      return isExpanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />
    }
    return <IconBookmark size={16} />
  }

  return (
    <>
      <UnstyledButton
        onClick={handleClick}
        w="100%"
        p="xs"
        pl={level * 20 + 12}
      >
        <Group gap="xs" wrap="nowrap">
          {isFolder ? (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleToggle}
              style={{ flexShrink: 0 }}
            >
              {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
            </ActionIcon>
          ) : (
            <Box w={28} style={{ flexShrink: 0 }} />
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
