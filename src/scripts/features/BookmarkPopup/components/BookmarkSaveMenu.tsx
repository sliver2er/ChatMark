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
import { IconBookmark, IconFolderPlus, IconBookmarkPlus } from "@tabler/icons-react"
import { useEffect, useState, useRef } from "react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { SelectionBookmarkTreeView } from "./SelectionBookmarkTreeView"

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
      gap="0"
      p="sm"
      py="0"
      bdrs={12}
      w="350px"
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Text
        size="lg"
        fw={600}
        mt="sm"
      >
        Add Bookmark
      </Text>
      <Text 
        size="sm"
        c="dimmed"
        mt="0"
        mb="xs"
      >
        Save this snippet for later
      </Text>
      <TextInput
        mt={0}
        ref={inputRef}
        placeholder="Enter bookmark name..."
        value={bookmarkName}
        onChange={(e) => setBookmarkName(e.currentTarget.value)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onMouseUp={(e) => e.stopPropagation()}
        leftSection={<IconBookmark size={16} />}
        disabled={saving}
        variant="filled"
        bdrs="lg"
      />

      <Divider />

      <Text size="sm" fw={500} mb = "xs" mt = "sm">
        Choose folder <Text span c="dimmed">(optional)</Text>
      </Text>

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


      <Stack gap="xs">
        <Button
          variant="filled"
          leftSection={<IconBookmarkPlus size={16} />}
          onClick={handleSaveToRoot}
          radius="md"
          size="md"
          fw={600}
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
            radius="md"
            size="md"
            leftSection={<IconFolderPlus size={16} />}
            fw={600}
          >
            Save in Parent Bookmark
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
