import { Stack } from "@mantine/core"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { SelectionFolderTreeItem } from "./SelectionFolderTreeItem"
import { getRootBookmarks, sortBookmarksByDate } from "@/utils/bookmarkTreeUtils"

interface SelectionBookmarkTreeViewProps {
  bookmarks: BookmarkItemType[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
  onSelectBookmark: (bookmark: BookmarkItemType) => void
  selectedId?: string
}

export const SelectionBookmarkTreeView = ({
  bookmarks,
  expandedIds,
  onToggleExpand,
  onSelectBookmark,
  selectedId,
}: SelectionBookmarkTreeViewProps) => {
  const rootBookmarks = sortBookmarksByDate(getRootBookmarks(bookmarks))

  if (rootBookmarks.length === 0) {
    return null
  }

  return (
    <Stack gap={4}>
      {rootBookmarks.map((bookmark) => (
        <SelectionFolderTreeItem
          key={bookmark.id}
          bookmark={bookmark}
          level={0}
          bookmarks={bookmarks}
          expandedIds={expandedIds}
          onToggleExpand={onToggleExpand}
          onSelectBookmark={onSelectBookmark}
          selectedId={selectedId}
        />
      ))}
    </Stack>
  )
}
