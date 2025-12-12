import { ScrollArea, Title, Box, Paper, CloseButton, Group, Stack, Divider, ThemeIcon } from '@mantine/core'
import { BookmarkTree } from './components'
import { Resizable } from 're-resizable'
import { IconBookmarks, IconXboxX } from '@tabler/icons-react'
import { useIsDark } from '@/shared/hooks/useIsDark'
import { useThemeColors } from '@/shared/hooks/useThemeColors'
import { useTranslation } from 'react-i18next'


interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  width: number
  onWidthChange: (width: number) => void
}

export const Sidebar = ({ isOpen, onClose, width, onWidthChange }: SidebarProps) => {
  const { t } = useTranslation()
  const isDark = useIsDark()
  const colors = useThemeColors()

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
        radius={0}
        w="100%"
        h="100%"
        variant='default'
        bg={colors.bgSubtle}
        bd={`0.5px solid ${colors.border}`}
      >
      <Stack gap={0} h="100%">
        {/* Header */}
        <Box py="md" px="lg">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="sm" align="center" wrap="nowrap">
              <IconBookmarks size={24} />
              <Title order={3} fw={600} lh={1.2}>{t('sidebar.title')}</Title>
            </Group>
            <CloseButton
              onClick={onClose}
              size="lg"
            />
          </Group>
        </Box>
        <Divider px = "sm" mx="sm"/>

        {/* Content */}
        <Box flex={1} style={{ overflow: 'hidden' }}>
          <ScrollArea h="100%">
            <Box p="md" pt="lg">
              <BookmarkTree />
            </Box>
          </ScrollArea>
        </Box>
      </Stack>
    </Paper>
    </Resizable>
  )
}
