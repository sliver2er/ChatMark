import { StrictMode, useState } from "react";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/OpenPanelBtn";
import { Sidebar } from "./features/Sidebar";


export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = () => {
    console.log('[ChatMark] Opening sidebar, current state:', isSidebarOpen);
    setIsSidebarOpen(true);
    console.log('[ChatMark] Sidebar state set to true');
  };

  const handleCloseSidebar = () => {
    console.log('[ChatMark] Closing sidebar');
    setIsSidebarOpen(false);
  };

  return (
    <StrictMode>
        <MantineProvider defaultColorScheme="dark">
          <BookmarkPopup />
          <OpenPanelBtn onOpenSidebar={handleOpenSidebar} isSidebarOpen={isSidebarOpen} />
          <Sidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />
      </MantineProvider>
    </StrictMode>

  );
};

export default App;