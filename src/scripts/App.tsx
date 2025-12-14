import { StrictMode, useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/TogglePanelBtn";
import { Sidebar } from "./features/Sidebar";
import { watchChatGPTTheme } from "@/shared/functions/detectChatGPTTheme";
import { isInChatSession } from "@/shared/functions/isInChatSession";
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [colorScheme, setColorScheme] = useState<"dark" | "light">("dark");
  const [isInSession, setIsInSession] = useState(isInChatSession());

  // Load saved sidebar width
  useEffect(() => {
    chrome.storage.local.get([SIDEBAR_WIDTH_STORAGE_KEY], (result) => {
      if (result[SIDEBAR_WIDTH_STORAGE_KEY]) {
        setSidebarWidth(result[SIDEBAR_WIDTH_STORAGE_KEY]);
      }
    });
  }, []);

  // Watch ChatGPT's theme and sync
  useEffect(() => {
    const cleanup = watchChatGPTTheme((theme) => {
      setColorScheme(theme);
      chrome.runtime.sendMessage({
        type: MessageType.SettingsUpdate,
        payload: { colorScheme: theme },
      });
    });

    return cleanup;
  }, []);

  // Monitor URL changes to detect session transitions
  useEffect(() => {
    const checkSessionStatus = () => {
      const currentlyInSession = isInChatSession();
      if (currentlyInSession !== isInSession) {
        setIsInSession(currentlyInSession);
        if (!currentlyInSession && isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    const intervalId = setInterval(checkSessionStatus, URL_CHECK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [isInSession, isSidebarOpen]);

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
