import { StrictMode, useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  MantineProvider,
  Stack,
  Title,
  Paper,
  Text,
  SegmentedControl,
  ColorPicker,
  Box,
  Group,
  ActionIcon,
} from "@mantine/core";
import "@mantine/core/styles.css";
import { IconTrash } from "@tabler/icons-react";
import { ChatMarkSettings, DEFAULT_SETTINGS, MessageType } from "@/types";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { watchChatGPTTheme } from "@/shared/functions/detectChatGPTTheme";
import { useBookmark } from "@/hooks/useBookmark";

import koTranslation from "@/config/ko.json";
import enTranslation from "@/config/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ko: { translation: koTranslation },
    },
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

const PopupApp = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ChatMarkSettings>(DEFAULT_SETTINGS);
  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.SettingsGet }, (response) => {
      if (response.success) {
        setSettings(response.data);
      }
    });
  }, []);
  const { deleteAllBookmarks } = useBookmark("");

  const handleScrollBehaviorChange = (value: string) => {
    const newSettings = { ...settings, scrollBehavior: value as "instant" | "smooth" };
    setSettings(newSettings);
    chrome.runtime.sendMessage({
      type: MessageType.SettingsUpdate,
      payload: { scrollBehavior: value },
    });
  };

  const handleHighlightColorChange = (color: string) => {
    const newSettings = { ...settings, highlightColor: color };
    setSettings(newSettings);
    chrome.runtime.sendMessage({
      type: MessageType.SettingsUpdate,
      payload: { highlightColor: color },
    });
  };

  const presetColors = [
    "#81c147", // green
    "#ffd93d", // Yellow
    "#ff6b9d", // Pink
    "#6bcf7f", // Light green
    "#a8dadc", // Light blue
    "#f4a261", // Orange
    "#e76f51", // Red-orange
  ];
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");
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
          <Title order={4}>{t("popup.title")}</Title>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              {t("popup.scrollBehavior")}
            </Text>
            <SegmentedControl
              fullWidth
              value={settings.scrollBehavior}
              onChange={handleScrollBehaviorChange}
              data={[
                { label: t("popup.scrollInstant"), value: "instant" },
                { label: t("popup.scrollSmooth"), value: "smooth" },
              ]}
            />
          </Stack>

          <Stack gap="xs">
            <Text size="sm" fw={500}>
              {t("popup.highlightColor")}
            </Text>
            <ColorPicker
              format="hex"
              value={settings.highlightColor}
              onChange={handleHighlightColorChange}
              swatches={presetColors}
              withPicker={false}
              fullWidth
            />
          </Stack>
          <Group justify="space-between" align="center" wrap="nowrap">
            {/* 왼쪽: 텍스트 뭉치 */}
            <Box>
              <Text size="sm" fw={600} c="red">
                {" "}
                {/* 위험한 기능이니 빨간색 강조 추천 */}
                {t("popup.deleteAll")}
              </Text>
              <Text size="xs" c="dimmed" lh={1.2}>
                {t("popup.warning")}
              </Text>
            </Box>

            {/* 오른쪽: 삭제 버튼 */}
            <ActionIcon variant="light" color="red" size="lg" onClick={deleteAllBookmarks}>
              <IconTrash size={18} />
            </ActionIcon>
          </Group>
        </Stack>
      </Paper>
    </MantineProvider>
  );
};

// Mount React app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <PopupApp />
    </StrictMode>
  );
}
