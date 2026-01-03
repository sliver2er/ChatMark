import { Stack, Text, ScrollArea } from "@mantine/core";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { getRootBookmarks, sortBookmarksByOrder } from "@/utils/bookmarkTreeUtils";
import { PopupBookmarkTreeItem } from "./PopupBookmarkTreeItem";
import { useTranslation } from "react-i18next";

interface PopupBookmarkTreeViewProps {
  bookmarks: BookmarkItemType[];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  selectedId?: string;
  onSelectBookmark?: (bookmark: BookmarkItemType) => void;
}

export const PopupBookmarkTreeView = ({
  bookmarks,
  expandedIds,
  onToggleExpand,
  selectedId,
  onSelectBookmark,
}: PopupBookmarkTreeViewProps) => {
  const { t } = useTranslation();
  const rootBookmarks = sortBookmarksByOrder(getRootBookmarks(bookmarks));

  if (bookmarks.length === 0) {
    return (
      <Text size="sm" c="dimmed" ta="center" p="md">
        {t("popup.noBookmarksInSession")}
      </Text>
    );
  }

  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Stack gap={2} p="xs">
        {rootBookmarks.map((bookmark) => (
          <PopupBookmarkTreeItem
            key={bookmark.id}
            bookmark={bookmark}
            level={0}
            bookmarks={bookmarks}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
            selectedId={selectedId}
            onSelectBookmark={onSelectBookmark}
          />
        ))}
      </Stack>
    </ScrollArea>
  );
};
