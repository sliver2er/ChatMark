import { ActionIcon, Box } from "@mantine/core"
import { IconBookmarkFilled } from "@tabler/icons-react"
import { PanelApi } from "@/scripts/api/PanelApi"
import { error } from "@/shared/logger"

const handleOpenPanel = async () => {
    try {
        await PanelApi.openPanel()
    } catch (err) {
        error(err)
    }
}

export const OpenPanelBtn = () => {
    return (
        <Box
            style={{
                position: 'fixed',
                bottom: '32px',
                right: '32px',
                zIndex: 9999
            }}
            bdrs="50%"
            p="xs"
            size = "48px"
        >
            <ActionIcon onClick={handleOpenPanel} size="lg">
                <IconBookmarkFilled />
            </ActionIcon>
        </Box>
    )
}