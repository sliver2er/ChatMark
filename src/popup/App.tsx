import { useState, useEffect } from "react";
import { MantineProvider, Paper, Tabs } from "@mantine/core";
import { IconBookmarks, IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { DEFAULT_SETTINGS, MessageType } from "@/types";
import { AllSessionsView } from "./components/AllSessionsView";
import { SettingsTab } from "./components/SettingsTab";

export const App = () => {
  const { t } = useTranslation();
  const [colorScheme, setColorScheme] = useState<"dark" | "light">(DEFAULT_SETTINGS.colorScheme);

  useEffect(() => {
    chrome.runtime.sendMessage({ type: MessageType.SettingsGet }, (response) => {
      if (response?.success) {
        setColorScheme(response.data.colorScheme || DEFAULT_SETTINGS.colorScheme);
      }
    });
  }, []);

  useEffect(() => {
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === "local" && changes["chatmark.settings"]) {
        const newSettings = changes["chatmark.settings"].newValue;
        if (newSettings?.colorScheme) {
          setColorScheme(newSettings.colorScheme);
        }
      }
    };
    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <MantineProvider forceColorScheme={colorScheme}>
      <Paper w={560}>
        <Tabs defaultValue="bookmarks">
          <Tabs.List>
            <Tabs.Tab value="bookmarks" leftSection={<IconBookmarks size={16} />}>
              {t("popup.allBookmarks")}
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              {t("popup.settings")}
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="bookmarks">
            <AllSessionsView />
          </Tabs.Panel>

          <Tabs.Panel value="settings">
            <SettingsTab />
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </MantineProvider>
  );
};
