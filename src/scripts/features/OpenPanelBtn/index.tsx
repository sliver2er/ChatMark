import { IconBookmarkFilled } from "@tabler/icons-react"
import { ActionIcon } from "@mantine/core"

interface OpenPanelBtnProps {
    onOpenSidebar: () => void
}

export const OpenPanelBtn = ({ onOpenSidebar }: OpenPanelBtnProps) => {
    const handleClick = () => {
        console.log('[ChatMark] OpenPanelBtn clicked');
        onOpenSidebar();
    };

    return (
        <ActionIcon
            onClick={handleClick}
            size={64}
            radius="xl"
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 135 }}
            style={{
                position: 'fixed',
                bottom: '48px',
                right: '56px',
                zIndex: 9999,
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            styles={{
                root: {
                    '&:hover': {
                        transform: 'scale(1.1) translateY(-2px)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.1)',
                    }
                }
            }}
        >
            <IconBookmarkFilled size={30} />
        </ActionIcon>
    )
}