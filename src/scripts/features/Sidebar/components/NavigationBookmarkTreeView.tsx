import { Stack } from "@mantine/core"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { NavigationFolderTreeItem } from "./NavigationFolderTreeItem"
import { getRootBookmarks, sortBookmarksByDate } from "@/utils/bookmarkTreeUtils"

interface NavigationBookmarkTreeViewProps {
  bookmarks: BookmarkItemType[]
  expandedIds: Set<string>
  onToggleExpand: (id: string) => void
}

export const NavigationBookmarkTreeView = ({
  bookmarks,
  expandedIds,
  onToggleExpand,
}: NavigationBookmarkTreeViewProps) => {
  const rootBookmarks = sortBookmarksByDate(getRootBookmarks(bookmarks))

  if (rootBookmarks.length === 0) {
    return null
  }

  return (
    <Stack gap="xs">
      {rootBookmarks.map((bookmark) => (
        <NavigationFolderTreeItem
          key={bookmark.id}
          bookmark={bookmark}
          level={0}
          bookmarks={bookmarks}
          expandedIds={expandedIds}
          onToggleExpand={onToggleExpand}
        />
      ))}
    </Stack>
  )
}
