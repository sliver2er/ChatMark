import { StrictMode, useState } from "react";
import { MantineProvider } from "@mantine/core";
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/OpenPanelBtn";
import { Sidebar } from "./features/Sidebar";


export const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <StrictMode>
        <MantineProvider defaultColorScheme="dark">
          <BookmarkPopup />
          <OpenPanelBtn onOpenSidebar={() => setIsSidebarOpen(true)} />
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </MantineProvider>
    </StrictMode>

  );
};

export default App;