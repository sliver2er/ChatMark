import { ScrollArea, Title, Box, Paper, CloseButton, Group, Stack } from '@mantine/core'
import { BookmarkTree } from './components'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  console.log('[ChatMark] Sidebar render, isOpen:', isOpen);

  if (!isOpen) return null;

  return (
    <Paper
      shadow="xl"
      radius={0}
      pos="fixed"
      top={0}
      right={0}
      w={400}
      h="100vh"
      style={{
        zIndex: 10000,
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
  )
}
