import { createRoot } from "react-dom/client";
import { App } from "./App";
import { ChatGPTProvider } from "@/shared/llm/providers/chatgpt";
import { useProviderStore } from "@/stores/useProviderStore";
import { initSessionStore } from "@/stores/useSessionStore";
import { setupBookmarkNavigationListener } from "./features/Sidebar/utils/bookmarkNavigationHandler";

const provider = new ChatGPTProvider();
useProviderStore.getState().setProvider(provider);
initSessionStore();

(function mount() {
  const container = document.createElement("div");
  container.id = "chatmark-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.zIndex = "999999";
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App />);
})();

setupBookmarkNavigationListener();
