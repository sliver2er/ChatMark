import { StrictMode, useState, useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/OpenPanelBtn";
import { Sidebar } from "./features/Sidebar";
import { watchChatGPTTheme } from "@/shared/functions/detectChatGPTTheme";


const SIDEBAR_WIDTH_STORAGE_KEY = 'chatmark.sidebar.width'
const DEFAULT_SIDEBAR_WIDTH = 400

export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
  const [colorScheme, setColorScheme] = useState<'dark' | 'light'>('dark');

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
    });

    return cleanup;
  }, []);

  const handleOpenSidebar = () => {
    console.log('[ChatMark] Opening sidebar, current state:', isSidebarOpen);
    setIsSidebarOpen(true);
    console.log('[ChatMark] Sidebar state set to true');
  };

  const handleCloseSidebar = () => {
    console.log('[ChatMark] Closing sidebar');
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
          <OpenPanelBtn
            onOpenSidebar={handleOpenSidebar}
            isSidebarOpen={isSidebarOpen}
            sidebarWidth={sidebarWidth}
          />
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