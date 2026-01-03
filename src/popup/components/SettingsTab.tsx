import { useState, useEffect } from "react";
import {
  Stack,
  Text,
  SegmentedControl,
  ColorPicker,
  Box,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { ChatMarkSettings, DEFAULT_SETTINGS, MessageType } from "@/types";
import { useTranslation } from "react-i18next";
import { useBookmarkStore } from "@/stores/useBookmarkStore";

const presetColors = [
  "#81c147", // green
  "#ffd93d", // Yellow
  "#ff6b9d", // Pink
  "#6bcf7f", // Light green
  "#a8dadc", // Light blue
  "#f4a261", // Orange
  "#e76f51", // Red-orange
];

export const SettingsTab = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<ChatMarkSettings>(DEFAULT_SETTINGS);
  const deleteAllBookmarks = useBookmarkStore((state) => state.deleteAllBookmarks);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.SettingsGet }, (response) => {
      if (response?.success) {
        setSettings(response.data);
      }
    });
  }, []);

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

  return (
    <Stack gap="md" p="md">
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

      <Group justify="space-between" align="center" wrap="nowrap" gap="md">
        <Box style={{ flex: "1 1 0", minWidth: 0 }}>
          <Text size="sm" fw={600} c="red" truncate="end">
            {t("popup.deleteAll")}
          </Text>
          <Text
            size="xs"
            c="dimmed"
            lh={1.2}
            style={{ wordBreak: "break-word", display: "block" }}
          >
            {t("popup.warning")}
          </Text>
        </Box>
        <ActionIcon
          variant="light"
          color="red"
          size="lg"
          onClick={deleteAllBookmarks}
          style={{ flexShrink: 0 }}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};
