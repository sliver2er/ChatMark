import { Group, Text } from "@mantine/core"
import { IconBookmark } from "@tabler/icons-react"
import { BookmarkItem as BookmarkItemType } from "@/types"

interface BookmarkItemProps {
    bookmark: BookmarkItemType
}

export const BookmarkItem = ({ bookmark }: BookmarkItemProps) => {
    return (
        <Group
            gap="sm"
            p="sm"
            style={{
                cursor: 'pointer',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
            }}
        >
            <IconBookmark size={20} style={{ flexShrink: 0 }} />
            <Text
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                }}
            >
                {bookmark.bookmark_name}
            </Text>
        </Group>
    )
}
