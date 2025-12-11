import { Text, Loader, Center, Alert } from "@mantine/core"
import { IconAlertCircle } from "@tabler/icons-react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { NavigationBookmarkTreeView } from "./NavigationBookmarkTreeView"
import { getSessionId } from "@/shared/functions/getSessionId"
import { useStorageSync } from "@/hooks/useStorageSync"

export const BookmarkTree = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

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

    const debouncedFetchBookmarks = useCallback((sid: string) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
            fetchBookmarks(sid)
        }, DEBOUNCE_DELAY)
    }, [])

    const handleStorageChange = useCallback(() => {
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
        if (sessionId) {
            debouncedFetchBookmarks(sessionId)
        }
    }, [sessionId])

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

        return () => {
            // Cleanup debounce timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [])

    // Real-time URL change detection
    useEffect(() => {
        const checkUrlChange = () => {
            const newSessionId = getSessionId()
            if (newSessionId && newSessionId !== sessionId) {
                setSessionId(newSessionId)
            }
        }

        const intervalId = setInterval(checkUrlChange, URL_POLLING_INTERVAL)
        return () => clearInterval(intervalId)
    }, [sessionId])

    if (loading) {
        return (
            <Center h={LOADING_CENTER_HEIGHT}>
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
            <Center h={EMPTY_STATE_HEIGHT}>
                <Text c="dimmed" size="sm">No bookmarks yet</Text>
            </Center>
        )
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

    return (
        <NavigationBookmarkTreeView
            bookmarks={bookmarks}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
        />
    )
}
