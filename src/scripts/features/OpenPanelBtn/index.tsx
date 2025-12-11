import { IconBookmarkFilled } from "@tabler/icons-react"
import { ActionIcon } from "@mantine/core"
import { motion, useMotionValue } from "framer-motion"
import { useEffect, useRef } from "react"

interface OpenPanelBtnProps {
    onOpenSidebar: () => void
    isSidebarOpen: boolean
}

const STORAGE_KEY = 'chatmark.openPanelBtn.position'
const SIDEBAR_WIDTH = 400

export const OpenPanelBtn = ({ onOpenSidebar, isSidebarOpen }: OpenPanelBtnProps) => {
    // Default position: bottom-right corner
    const defaultX = window.innerWidth - 120
    const defaultY = window.innerHeight - 112

    const x = useMotionValue(defaultX)
    const y = useMotionValue(defaultY)
    const isDraggingRef = useRef(false)

    useEffect(() => {
        chrome.storage.local.get([STORAGE_KEY], (result) => {
            if (result[STORAGE_KEY]) {
                x.set(result[STORAGE_KEY].x)
                y.set(result[STORAGE_KEY].y)
            }
        })
    }, [])

    // Push button out when sidebar opens
    useEffect(() => {
        if (isSidebarOpen) {
            const currentX = x.get()
            const sidebarLeftEdge = window.innerWidth - SIDEBAR_WIDTH
            if (currentX + 64 > sidebarLeftEdge) {
                const newX = sidebarLeftEdge - 64 - 24
                x.set(newX)
                chrome.storage.local.set({
                    [STORAGE_KEY]: {
                        x: newX,
                        y: y.get()
                    }
                })
            }
        }
    }, [isSidebarOpen, x, y])

    const handleDragStart = () => {
        isDraggingRef.current = true
    }

    // Save position on drag end
    const handleDragEnd = () => {
        chrome.storage.local.set({
            [STORAGE_KEY]: {
                x: x.get(),
                y: y.get()
            }
        })
        setTimeout(() => {
            isDraggingRef.current = false
        }, 50)
    }

    const handleClick = () => {
        if (!isDraggingRef.current) {
            onOpenSidebar()
        }
    }

    // Calculate drag constraints based on sidebar state
    const dragConstraints = {
        left: 0,
        top: 0,
        right: isSidebarOpen ? window.innerWidth - SIDEBAR_WIDTH - 64 : window.innerWidth - 64,
        bottom: window.innerHeight - 64
    }

    return (
        <motion.div
            drag
            dragConstraints={dragConstraints}
            dragElastic={0}
            dragMomentum={true}
            dragTransition={{
                power: 0.2,
                timeConstant: 200,
                modifyTarget: (target) => Math.round(target)
            }}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                x,
                y,
                zIndex: 9999,
                cursor: 'grab'
            }}
            whileDrag={{ cursor: 'grabbing' }}
        >
            <ActionIcon
                onClick={handleClick}
                size={64}
                radius="xl"
                variant="default"
                style={{
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    pointerEvents: 'auto'
                }}
            >
                <IconBookmarkFilled size={30} />
            </ActionIcon>
        </motion.div>
    )
}