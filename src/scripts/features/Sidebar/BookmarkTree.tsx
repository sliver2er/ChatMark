import { Stack, Text, Loader, Center, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { useEffect, useState, useCallback, useRef } from "react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { BookmarkItem } from "./BookmarkItem"
import { getSessionId } from "@/shared/functions/getSessionId"
import { useStorageSync } from "@/hooks/useStorageSync"

export const BookmarkTree = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)

    // Debounce timer ref to prevent excessive re-fetches
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

    const fetchBookmarks = async (sid: string) => {
        try {
            setLoading(true)
            const data = await bookmarkApi.getAll(sid)
            setBookmarks(data)
            setError(null)
        } catch (err) {
            setError(String(err))
        } finally {
            setLoading(false)
        }
    }

    // Debounced fetch to prevent excessive API calls
    const debouncedFetchBookmarks = useCallback((sid: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchBookmarks(sid)
        }, 150) // 150ms debounce
    }, [])

    // Storage sync callback
    const handleStorageChange = useCallback((newBookmarks: BookmarkItemType[]) => {
        if (sessionId) {
            debouncedFetchBookmarks(sessionId)
        }
    }, [sessionId, debouncedFetchBookmarks])

    // Set up storage sync listener for this session's bookmarks
    useStorageSync({
        keyPattern: sessionId ? `chatmark.bookmarks.${sessionId}` : '',
        onChanged: handleStorageChange,
    })

    useEffect(() => {
        // Get session ID from current page
        const initialSessionId = getSessionId()

        if (!initialSessionId) {
            setError("No session ID found. Please open from a ChatGPT conversation.")
            setLoading(false)
            return
        }

        setSessionId(initialSessionId)
        fetchBookmarks(initialSessionId)

        // Listen for panel refresh messages from content script
        const handleMessage = (msg: any) => {
            if (msg.type === "PANEL_REFRESH" && msg.session_id) {
                setSessionId(msg.session_id)
                fetchBookmarks(msg.session_id)
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage)

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage)
            // Cleanup debounce timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    if (loading) {
        return (
            <Center h="300px">
                <Loader size="lg" type="dots" />
            </Center>
        )
    }

    if (error) {
        return (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="light"
            >
                {error}
            </Alert>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <Center h="300px">
                <Text c="dimmed" size="sm">No bookmarks yet</Text>
            </Center>
        )
    }

    return (
        <Stack gap="xs">
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
        </Stack>
    )
}
