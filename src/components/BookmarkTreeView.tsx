import { Stack } from "@mantine/core"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { FolderTreeItem } from "@/scripts/features/Sidebar/FolderTreeItem"
import { getRootBookmarks, sortBookmarksByDate } from "@/utils/bookmarkTreeUtils"

interface BookmarkTreeViewProps {
  bookmarks: BookmarkItemType[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  renderMode: 'navigation' | 'selection'
  onSelectBookmark?: (bookmark: BookmarkItemType) => void
  selectedId?: string
}

export const BookmarkTreeView = ({
  bookmarks,
  expandedIds,
  onToggleExpand,
  renderMode,
  onSelectBookmark,
  selectedId,
}: BookmarkTreeViewProps) => {
  const rootBookmarks = sortBookmarksByDate(getRootBookmarks(bookmarks))

  if (rootBookmarks.length === 0) {
    return null
  }

  return (
    <Stack gap="xs">
      {rootBookmarks.map((bookmark) => (
        <FolderTreeItem
          key={bookmark.id}
          bookmark={bookmark}
          level={0}
          bookmarks={bookmarks}
          expandedIds={expandedIds}
          onToggleExpand={onToggleExpand}
          renderMode={renderMode}
          onSelectBookmark={onSelectBookmark}
          selectedId={selectedId}
        />
      ))}
    </Stack>
  )
}
