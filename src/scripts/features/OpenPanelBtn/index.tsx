import { IconBookmarkFilled } from "@tabler/icons-react"
import { PanelApi } from "@/scripts/api/PanelApi"
import { error } from "@/shared/logger"
import { useState } from "react"

const handleOpenPanel = async () => {
    try {
        await PanelApi.openPanel()
    } catch (err) {
        error(err)
    }
}

export const OpenPanelBtn = () => {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <button
            onClick={handleOpenPanel}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                position: 'fixed',
                bottom: '48px',
                right: '56px',
                zIndex: 9999,
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isHovered
                    ? '0 20px 40px rgba(102, 126, 234, 0.6), 0 0 0 4px rgba(255, 255, 255, 0.1)'
                    : '0 10px 30px rgba(102, 126, 234, 0.4)',
                transform: isHovered ? 'scale(1.1) translateY(-2px)' : 'scale(1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                outline: 'none',
            }}
        >
            <IconBookmarkFilled size={30} style={{ color: 'white' }} />
        </button>
    )
}