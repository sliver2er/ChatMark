import { StrictMode } from "react";
import { MantineProvider } from "@mantine/core";
import { BookmarkPopup } from "./features/BookmarkPopup";
import { OpenPanelBtn } from "./features/OpenPanelBtn"


export const App = () => {
  return (
    <StrictMode>
        <MantineProvider defaultColorScheme="dark">
          <BookmarkPopup />
          <OpenPanelBtn />
      </MantineProvider>
    </StrictMode>

  );
};

export default App;