import { Stack, Text, Loader, Center } from "@mantine/core"
import { useEffect, useState } from "react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { BookmarkItem } from "./BookmarkItem"

export const BookmarkTree = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [sessionId, setSessionId] = useState<string | null>(null)

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

    useEffect(() => {
        // Get initial session_id from URL parameters
        const params = new URLSearchParams(window.location.search)
        const initialSessionId = params.get('session_id')

        console.log("Session ID from URL:", initialSessionId)

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
                console.log("Panel refreshing for new session:", msg.session_id)
                setSessionId(msg.session_id)
                fetchBookmarks(msg.session_id)
            }
        }

        chrome.runtime.onMessage.addListener(handleMessage)

        return () => {
            chrome.runtime.onMessage.removeListener(handleMessage)
        }
    }, [])

    if (loading) {
        return (
            <Center h="100vh">
                <Loader size="lg" />
            </Center>
        )
    }

    if (error) {
        return (
            <Center h="100vh">
                <Text c="red">{error}</Text>
            </Center>
        )
    }

    if (bookmarks.length === 0) {
        return (
            <Center h="100vh">
                <Text c="dimmed">No bookmarks yet</Text>
            </Center>
        )
    }

    return (
        <Stack gap="xs" p="md">
            {bookmarks.map((bookmark) => (
                <BookmarkItem key={bookmark.id} bookmark={bookmark} />
            ))}
        </Stack>
    )
}
