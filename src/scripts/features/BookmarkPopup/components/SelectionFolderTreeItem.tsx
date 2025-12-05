import { UnstyledButton, Group, Text, ActionIcon, Box, Stack, Collapse } from "@mantine/core"
import {
  IconBookmark,
  IconFolder,
  IconFolderOpen,
  IconChevronRight,
  IconChevronDown
} from "@tabler/icons-react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { getChildBookmarks, hasChildren, sortBookmarksByDate } from "@/utils/bookmarkTreeUtils"

interface SelectionFolderTreeItemProps {
  bookmark: BookmarkItemType
  level: number
  bookmarks: BookmarkItemType[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onSelectBookmark: (bookmark: BookmarkItemType) => void
  selectedId?: string
}

export const SelectionFolderTreeItem = ({
  bookmark,
  level,
  bookmarks,
  expandedIds,
  onToggleExpand,
  onSelectBookmark,
  selectedId,
}: SelectionFolderTreeItemProps) => {
  const children = sortBookmarksByDate(getChildBookmarks(bookmarks, bookmark.id))
  const isFolder = hasChildren(bookmarks, bookmark.id)
  const isExpanded = expandedIds.has(bookmark.id)
  const isSelected = selectedId === bookmark.id

  const handleClick = () => {
    onSelectBookmark(bookmark)
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
        style={(theme) => ({
          borderRadius: theme.radius.md,
          transition: 'background-color 0.2s',
          backgroundColor: isSelected
            ? 'rgba(66, 153, 225, 0.2)'
            : 'transparent',
          '&:hover': {
            backgroundColor: isSelected
              ? 'rgba(66, 153, 225, 0.3)'
              : 'rgba(255, 255, 255, 0.05)',
          },
        })}
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
              <SelectionFolderTreeItem
                key={child.id}
                bookmark={child}
                level={level + 1}
                bookmarks={bookmarks}
                expandedIds={expandedIds}
                onToggleExpand={onToggleExpand}
                onSelectBookmark={onSelectBookmark}
                selectedId={selectedId}
              />
            ))}
          </Stack>
        </Collapse>
      )}
    </>
  )
}
