import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, Stack, Title, Paper, Text, SegmentedControl, ColorPicker } from '@mantine/core'
import '@mantine/core/styles.css'
import { ChatMarkSettings, DEFAULT_SETTINGS, MessageType } from '@/types'

const PopupApp = () => {
  const [settings, setSettings] = useState<ChatMarkSettings>(DEFAULT_SETTINGS)
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.SettingsGet }, (response) => {
      if (response.success) {
        setSettings(response.data)
      }
    })
  }, [])

  const handleScrollBehaviorChange = (value: string) => {
    const newSettings = { ...settings, scrollBehavior: value as 'instant' | 'smooth' }
    setSettings(newSettings)
    chrome.runtime.sendMessage({
      type: MessageType.SettingsUpdate,
      payload: { scrollBehavior: value }
    })
  }

  const handleHighlightColorChange = (color: string) => {
    const newSettings = { ...settings, highlightColor: color }
    setSettings(newSettings)
    chrome.runtime.sendMessage({
      type: MessageType.SettingsUpdate,
      payload: { highlightColor: color }
    })
  }

  const presetColors = [
    '#81c147', // green
    '#ffd93d', // Yellow
    '#ff6b9d', // Pink
    '#6bcf7f', // Light green
    '#a8dadc', // Light blue
    '#f4a261', // Orange
    '#e76f51', // Red-orange
  ]

  return (
    <MantineProvider defaultColorScheme="dark">
      <Paper p="lg" w={320}>
        <Stack gap="lg">
          <Title order={3}>ChatMark Settings</Title>

          <Stack gap="xs">
            <Text size="sm" fw={500}>Scroll Behavior</Text>
            <SegmentedControl
              fullWidth
              value={settings.scrollBehavior}
              onChange={handleScrollBehaviorChange}
              data={[
                { label: 'Instant', value: 'instant' },
                { label: 'Smooth', value: 'smooth' },
              ]}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500}>Highlight Color</Text>
            <ColorPicker
              format="hex"
              value={settings.highlightColor}
              onChange={handleHighlightColorChange}
              swatches={presetColors}
              fullWidth
            />
            <Text size="xs" c="dimmed">
              Current: {settings.highlightColor}
            </Text>
          </Stack>
        </Stack>
      </Paper>
    </MantineProvider>
  )
}

// Mount React app
const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <PopupApp />
    </StrictMode>
  )
}
