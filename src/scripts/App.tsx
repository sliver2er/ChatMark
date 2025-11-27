import { MantineProvider } from "@mantine/core";
import { BookmarkPopup } from "./features/BookmarkPopup";

export const App = () => {
  return (
    <MantineProvider defaultColorScheme="dark">
      <BookmarkPopup />
    </MantineProvider>
  );
};

export default App;