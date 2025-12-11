import { UnstyledButton, Group, Text, Box, Stack, Collapse, useMantineColorScheme } from "@mantine/core"
import {
  IconBookmark,
  IconFolder,
  IconFolderOpen
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
  selectedId?: string
  onSelectBookmark?: (bookmark: BookmarkItemType) => void
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
  const { colorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'
  const children = sortBookmarksByDate(getChildBookmarks(bookmarks, bookmark.id))
  const isFolder = hasChildren(bookmarks, bookmark.id)
  const isExpanded = expandedIds.has(bookmark.id)
  const isSelected = selectedId === bookmark.id

  const handleClick = async () => {
    if (isFolder) {
      // 폴더인 경우
      if (onSelectBookmark) {
        onSelectBookmark(bookmark)
      }

      if (isSelected) {
        // 이미 선택되어 있으면 토글 (열림 ↔ 닫힘)
        onToggleExpand(bookmark.id)
      } else {
        // 선택되어 있지 않으면 열기
        if (!isExpanded) {
          onToggleExpand(bookmark.id)
        }
      }
    } else {
      // 일반 북마크는 네비게이션
      if (onSelectBookmark) {
        onSelectBookmark(bookmark)
      }
      try {
        await NavigateApi.navigateToBookmark(bookmark)
      } catch (error) {
        console.error("Failed to navigate to bookmark:", error)
      }
    }
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
        py={10}
        px="sm"
        pl={level * 20 + 12}
        style={(theme) => ({
          borderRadius: theme.radius.md,
          transition: 'all 0.15s ease',
          backgroundColor: isSelected
            ? isDark
              ? 'rgba(255, 255, 255, 0.06)'
              : 'rgba(0, 0, 0, 0.04)'
            : 'transparent',
          border: isSelected
            ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`
            : '1px solid transparent',
          '&:hover': {
            backgroundColor: isSelected
              ? isDark
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.06)'
              : isDark
                ? 'rgba(255, 255, 255, 0.04)'
                : 'rgba(0, 0, 0, 0.03)',
          },
        })}
      >
        <Group gap="sm" wrap="nowrap">
          <Box style={{ flexShrink: 0 }} c={isSelected ? undefined : "dimmed"}>
            {getIcon()}
          </Box>
          <Text
            size="sm"
            lh={1.35}
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
          <Stack gap={2} mt={4}>
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
        </Collapse>
      )}
    </>
  )
}
