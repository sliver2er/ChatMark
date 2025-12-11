import { ScrollArea, Title, Box, Paper, CloseButton, Group, Stack } from '@mantine/core'
import { BookmarkTree } from './components'
import { Resizable } from 're-resizable'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  width: number
  onWidthChange: (width: number) => void
}

export const Sidebar = ({ isOpen, onClose, width, onWidthChange }: SidebarProps) => {
  console.log('[ChatMark] Sidebar render, isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <Resizable
      size={{ width, height: '100vh' }}
      minWidth={SIDEBAR_MIN_WIDTH}
      maxWidth={SIDEBAR_MAX_WIDTH}
      enable={{
        top: false,
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false
      }}
      onResizeStop={(e, direction, ref, d) => {
        onWidthChange(width + d.width)
      }}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        zIndex: SIDEBAR_Z_INDEX,
      }}
      handleStyles={{
        left: {
          width: SIDEBAR_RESIZE_HANDLE_WIDTH,
          left: 0,
          cursor: 'ew-resize',
        }
      }}
    >
      <Paper
        shadow="xl"
        radius={0}
        w="100%"
        h="100%"
        style={{
          borderLeft: '1px solid var(--mantine-color-dark-4)',
        }}
        bg="dark.8"
      >
      <Stack gap={0} h="100%">
        {/* Header */}
        <Box
          p="md"
          style={{
            borderBottom: '1px solid var(--mantine-color-dark-4)',
          }}
        >
          <Group justify="space-between" align="center">
            <Title order={3} c="white">Bookmarks</Title>
            <CloseButton
              onClick={onClose}
              size="lg"
              c="white"
              variant="subtle"
            />
          </Group>
        </Box>

        {/* Content */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ScrollArea h="100%">
            <Box p="md">
              <BookmarkTree />
            </Box>
          </ScrollArea>
        </Box>
      </Stack>
    </Paper>
    </Resizable>
  )
}
