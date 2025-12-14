import { TextInput, Button, Stack, Divider, Text, ScrollArea, Group, Loader } from "@mantine/core";
import { IconBookmarkFilled, IconFolderFilled } from "@tabler/icons-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { bookmarkApi } from "@/api/bookmarkApi";
import { SelectionBookmarkTreeView } from "./SelectionBookmarkTreeView";
import { useTranslation } from "react-i18next";
import { useStorageSync } from "@/hooks/useStorageSync";
import { getHotkeyHandler } from "@mantine/hooks";

interface BookmarkSaveMenuProps {
  opened: boolean;
  onClose: () => void;
  onSave: (name: string, parentId?: string) => Promise<void>;
  sessionId: string;
  defaultName: string;
}

export const BookmarkSaveMenu = ({
  opened,
  onClose,
  onSave,
  sessionId,
  defaultName,
}: BookmarkSaveMenuProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [bookmarkName, setBookmarkName] = useState(defaultName);
  const [selectedParent, setSelectedParent] = useState<string | undefined>();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load bookmarks when menu opens
  useEffect(() => {
    if (opened && sessionId) {
      loadBookmarks();
    }
  }, [opened, sessionId]);

  useEffect(() => {
    setBookmarkName(defaultName);
  }, [defaultName]);

  useEffect(() => {
    if (opened && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [opened]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const data = await bookmarkApi.getAll(sessionId);
      setBookmarks(data);
    } catch (err) {
      console.error("Failed to load bookmarks:", err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced reload for storage changes
  const debouncedReloadBookmarks = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (opened && sessionId) {
        loadBookmarks();
      }
    }, DEBOUNCE_DELAY);
  }, [opened, sessionId]);

  // Real-time sync when menu is open
  const handleStorageChange = useCallback(() => {
    debouncedReloadBookmarks();
  }, [debouncedReloadBookmarks]);

  useStorageSync({
    keyPattern: opened && sessionId ? `chatmark.bookmarks.${sessionId}` : "",
    onChanged: handleStorageChange,
  });

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectBookmark = (bookmark: BookmarkItemType) => {
    setSelectedParent(bookmark.id);
  };

  const handleSave = async () => {
    if (!bookmarkName.trim()) {
      alert(t("bookmark.enterNameAlert"));
      return;
    }
    try {
      setSaving(true);
      await onSave(bookmarkName.trim(), selectedParent);
      setBookmarkName("");
      setSelectedParent(undefined);
      onClose();
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveToRoot = async () => {
    if (!bookmarkName.trim()) {
      alert(t("bookmark.enterNameAlert"));
      return;
    }

    try {
      setSaving(true);
      await onSave(bookmarkName.trim(), undefined);
      setBookmarkName("");
      setSelectedParent(undefined);
      onClose();
    } catch (err) {
      console.error("Failed to save bookmark:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Stack
      gap="0"
      p="sm"
      pt="0"
      pb="xs"
      bdrs={12}
      w="360px"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Text size="lg" fw={600} mt="sm" lh={1.35}>
        {t("bookmark.addTitle")}
      </Text>
      <Text size="sm" c="dimmed" mt={4} lh={1.35}>
        {t("bookmark.saveSnippet")}
      </Text>
      <TextInput
        mt={12}
        ref={inputRef}
        placeholder={t("bookmark.enterName")}
        value={bookmarkName}
        onChange={(e) => setBookmarkName(e.currentTarget.value)}
        onKeyDown={getHotkeyHandler([
          ["Enter", handleSaveToRoot],
          ["shift+Enter", handleSave],
        ])}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        leftSection={<IconBookmarkFilled size={16} />}
        disabled={saving}
        variant="filled"
        bdrs="lg"
        mb={4}
      />

      <Divider mt="lg" mb="md" />

      <Text size="md" fw={500} mb="md" lh={1.45}>
        {t("bookmark.chooseFolder")}{" "}
        <Text span c="dimmed">
          {t("bookmark.optional")}
        </Text>
      </Text>

      {loading ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
        </Group>
      ) : bookmarks.length === 0 ? (
        <Text size="md" c="dimmed" ta="center" p="md">
          {t("bookmark.noBookmarks")}
        </Text>
      ) : (
        <ScrollArea mih={150} mah={300} offsetScrollbars>
          <SelectionBookmarkTreeView
            bookmarks={bookmarks}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
            onSelectBookmark={handleSelectBookmark}
            selectedId={selectedParent}
          />
        </ScrollArea>
      )}

      <Stack gap="xs" mt="md" mb="xs">
        <Button
          variant="filled"
          leftSection={<IconBookmarkFilled size={16} />}
          rightSection={
            <Text size="xs" fw={400} opacity={0.9}>
              ⏎
            </Text>
          }
          onClick={handleSaveToRoot}
          radius="md"
          size="md"
          fw={500}
          disabled={saving}
          mb="xs"
        >
          {t("bookmark.saveInRoot")}
        </Button>
        {selectedParent && (
          <Button
            variant="filled"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
            radius="md"
            size="md"
            leftSection={<IconFolderFilled size={16} />}
            rightSection={
              <Text size="xs" fw={400} opacity={0.9}>
                ⇧⏎
              </Text>
            }
            fw={500}
          >
            {t("bookmark.saveInFolder")}
          </Button>
        )}
      </Stack>
    </Stack>
  );
};
