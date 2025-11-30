import { Stack, Text, Loader, Center } from "@mantine/core"
import { useEffect, useState } from "react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { bookmarkApi } from "@/api/bookmarkApi"
import { BookmarkItem } from "./BookmarkItem"

export const BookmarkTree = () => {
    const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchBookmarks = async () => {
            try {
                // Get session_id from URL parameters
                const params = new URLSearchParams(window.location.search)
                const sessionId = params.get('session_id')

                console.log("Session ID from URL:", sessionId)

                if (!sessionId) {
                    setError("No session ID found. Please open from a ChatGPT conversation.")
                    setLoading(false)
                    return
                }

                const data = await bookmarkApi.getAll(sessionId)
                setBookmarks(data)
                setError(null)
            } catch (err) {
                setError(String(err))
            } finally {
                setLoading(false)
            }
        }

        fetchBookmarks()
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
