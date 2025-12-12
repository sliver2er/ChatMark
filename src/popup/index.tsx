import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider, Stack, Title, Paper, Text, SegmentedControl, ColorPicker } from '@mantine/core'
import '@mantine/core/styles.css'
import { ChatMarkSettings, DEFAULT_SETTINGS, MessageType } from '@/types'
import { useTranslation } from 'react-i18next'
import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { watchChatGPTTheme } from '@/shared/functions/detectChatGPTTheme'

import koTranslation from '@/config/ko.json'
import enTranslation from '@/config/en.json'


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {translation: enTranslation},
      ko: {translation: koTranslation}
    },
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  })





const PopupApp = () => {
  const { t } = useTranslation()
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
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>('dark');
  useEffect(() => {
  const cleanup = watchChatGPTTheme((theme) => {
    setColorScheme(theme);
  });

    return cleanup;
  }, []);
  return (
    <MantineProvider forceColorScheme={colorScheme}>
      <Paper p="lg" w={320}>
        <Stack gap="lg">
          <Title order={3}>{t('popup.title')}</Title>

          <Stack gap="xs">
            <Text size="sm" fw={500}>{t('popup.scrollBehavior')}</Text>
            <SegmentedControl
              fullWidth
              value={settings.scrollBehavior}
              onChange={handleScrollBehaviorChange}
              data={[
                { label: t('popup.scrollInstant'), value: 'instant' },
                { label: t('popup.scrollSmooth'), value: 'smooth' },
              ]}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500}>{t('popup.highlightColor')}</Text>
            <ColorPicker
              format="hex"
              value={settings.highlightColor}
              onChange={handleHighlightColorChange}
              swatches={presetColors}
              fullWidth
            />
            <Text size="xs" c="dimmed">
              {t('popup.currentColor', { color: settings.highlightColor })}
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
