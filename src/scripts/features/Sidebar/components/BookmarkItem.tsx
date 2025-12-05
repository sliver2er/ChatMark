import { UnstyledButton, Group, Text } from "@mantine/core"
import { IconBookmark } from "@tabler/icons-react"
import { BookmarkItem as BookmarkItemType } from "@/types"
import { NavigateApi } from "@/api/NavigateApi"

interface BookmarkItemProps {
    bookmark: BookmarkItemType
}

export const BookmarkItem = ({ bookmark }: BookmarkItemProps) => {
    const handleClick = async () => {
        try {
            await NavigateApi.navigateToBookmark(bookmark)
        } catch (error) {
            console.error("Failed to navigate to bookmark:", error)
        }
    }

    return (
        <UnstyledButton
            onClick={handleClick}
            w="100%"
            p="sm"
            style={(theme) => ({
                borderRadius: theme.radius.md,
                transition: 'background-color 0.2s',
                '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
            })}
        >
            <Group gap="sm" wrap="nowrap">
                <IconBookmark size={20} style={{ flexShrink: 0 }} />
                <Text
                    size="sm"
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
        </UnstyledButton>
    )
}
