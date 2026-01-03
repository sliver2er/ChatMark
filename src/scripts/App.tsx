import { StrictMode, useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/TogglePanelBtn";
import { Sidebar } from "./features/Sidebar";
import { useProviderStore } from "@/stores/useProviderStore";
import { initReactI18next } from "react-i18next";
import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { MessageType } from "@/types";

import enTranslation from "@/config/en.json";
import koTranslation from "@/config/ko.json";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    detection: {
      order: ["navigator", "localStorage"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
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

const SIDEBAR_WIDTH_STORAGE_KEY = "chatmark.sidebar.width";
const DEFAULT_SIDEBAR_WIDTH = 400;
const URL_CHECK_INTERVAL = 300;

export const App = () => {
  const provider = useProviderStore((state) => state.provider);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");
  const [isInSession, setIsInSession] = useState(provider?.isInChatSession() ?? false);

  useEffect(() => {
    chrome.storage.local.get([SIDEBAR_WIDTH_STORAGE_KEY], (result) => {
      if (result[SIDEBAR_WIDTH_STORAGE_KEY]) {
        setSidebarWidth(result[SIDEBAR_WIDTH_STORAGE_KEY]);
      }
    });
  }, []);

  useEffect(() => {
    if (!provider) return;

    const cleanup = provider.watchTheme((theme) => {
      setColorScheme(theme);
      chrome.runtime.sendMessage({
        type: MessageType.SettingsUpdate,
        payload: { colorScheme: theme },
      });
    });

    setColorScheme(provider.detectTheme());
    return cleanup;
  }, [provider]);

  useEffect(() => {
    if (!provider) return;

    const checkSessionStatus = () => {
      const currentlyInSession = provider.isInChatSession();
      if (currentlyInSession !== isInSession) {
        setIsInSession(currentlyInSession);
        if (!currentlyInSession && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    const intervalId = setInterval(checkSessionStatus, URL_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [provider, isInSession, isSidebarOpen]);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleSidebarWidthChange = (newWidth: number) => {
    setSidebarWidth(newWidth);
    chrome.storage.local.set({ [SIDEBAR_WIDTH_STORAGE_KEY]: newWidth });
  };

  if (!provider) return null;

  return (
    <StrictMode>
      <MantineProvider forceColorScheme={colorScheme}>
        <BookmarkPopup />
        {isInSession && (
          <OpenPanelBtn
            onToggleSidebar={handleToggleSidebar}
            isSidebarOpen={isSidebarOpen}
            sidebarWidth={sidebarWidth}
          />
        )}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          width={sidebarWidth}
          onWidthChange={handleSidebarWidthChange}
        />
      </MantineProvider>
    </StrictMode>
  );
};

export default App;
