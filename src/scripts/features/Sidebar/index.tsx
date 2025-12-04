import { Drawer, ScrollArea, Title, Box } from '@mantine/core'
import { BookmarkTree } from './BookmarkTree'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <Drawer
      opened={isOpen}
      onClose={onClose}
      position="right"
      size="400px"
      title={<Title order={3}>Bookmarks</Title>}
      styles={{
        content: {
          backgroundColor: '#1a1b1e',
        },
        header: {
          backgroundColor: '#1a1b1e',
          borderBottom: '1px solid #2c2e33',
        },
        body: {
          padding: 0,
        },
      }}
    >
      <ScrollArea h="calc(100vh - 60px)">
        <Box p="md">
          <BookmarkTree />
        </Box>
      </ScrollArea>
    </Drawer>
  )
}
