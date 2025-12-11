import {
  TextInput,
  Button,
  Stack,
  Divider,
  Text,
  ScrollArea,
  Group,
  Loader,
} from "@mantine/core"
import { IconBookmark, IconFolderPlus } from "@tabler/icons-react"
import { useEffect, useState, useRef } from "react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { SelectionBookmarkTreeView } from "./SelectionBookmarkTreeView"
import { error } from "@/shared/logger"

interface BookmarkSaveMenuProps {
  opened: boolean
  onClose: () => void
  onSave: (name: string, parentId?: string) => Promise<void>
  sessionId: string
  defaultName: string
}

export const BookmarkSaveMenu = ({
  opened,
  onClose,
  onSave,
  sessionId,
  defaultName,
}: BookmarkSaveMenuProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [bookmarkName, setBookmarkName] = useState(defaultName)
  const [selectedParent, setSelectedParent] = useState<string | undefined>()
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (opened && sessionId) {
      loadBookmarks()
    }
  }, [opened, sessionId])

  useEffect(() => {
    setBookmarkName(defaultName)
  }, [defaultName])

  useEffect(() => {
    if (opened && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 100)
    }
  }, [opened])

  const loadBookmarks = async () => {
    try {
      setLoading(true)
      const data = await bookmarkApi.getAll(sessionId)
      setBookmarks(data)
    } catch (err) {
      console.error("Failed to load bookmarks:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectBookmark = (bookmark: BookmarkItemType) => {
    setSelectedParent(bookmark.id)
  }

  const handleSave = async () => {
    if (!bookmarkName.trim()) {
      alert("Please enter a bookmark name.")
      return
    }
    try {
      setSaving(true)
      await onSave(bookmarkName.trim(), selectedParent)
      setBookmarkName("")
      setSelectedParent(undefined)
      onClose()
    } catch (err) {
      console.error("Failed to save bookmark:", err)
    } finally {
      setSaving(false)
    }
  }

  const handleSaveToRoot = async () => {
    if (!bookmarkName.trim()) {
      alert("Please enter a bookmark name.")
      return
    }

    try {
      setSaving(true)
      await onSave(bookmarkName.trim(), undefined)
      setBookmarkName("")
      setSelectedParent(undefined)
      onClose()
    } catch (err) {
      console.error("Failed to save bookmark:", err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Stack
      gap="md"
      p="md"
      style={{ minWidth: 300, maxWidth: 400 }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <TextInput
        ref={inputRef}
        label="Bookmark name"
        placeholder="Enter bookmark name..."
        value={bookmarkName}
        onChange={(e) => setBookmarkName(e.currentTarget.value)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        leftSection={<IconBookmark size={16} />}
        disabled={saving}
      />

      <Divider />

      <Text size="sm" fw={500}>Choose Parent Bookmark(Optional)</Text>

      {loading ? (
        <Group justify="center" p="md">
          <Loader size="sm" />
        </Group>
      ) : bookmarks.length === 0 ? (
        <Text size="sm" c="dimmed" ta="center" p="md">
          No Bookmarks
        </Text>
      ) : (
        <ScrollArea h={250} offsetScrollbars>
          <SelectionBookmarkTreeView
            bookmarks={bookmarks}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
            onSelectBookmark={handleSelectBookmark}
            selectedId={selectedParent}
          />
        </ScrollArea>
      )}

      <Divider />

      <Stack gap="xs">
        <Button
          variant="light"
          leftSection={<IconFolderPlus size={16} />}
          onClick={handleSaveToRoot}
          disabled={saving}
        >
          Save in Root
        </Button>
        {selectedParent && (
          <Button
            variant="filled"
            onClick={handleSave}
            disabled={saving}
            loading={saving}
          >
            선택한 폴더에 저장
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
