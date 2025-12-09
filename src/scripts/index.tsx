import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";
import { setupBookmarkNavigationListener } from "./features/Sidebar/utils/bookmarkNavigationHandler";

(function mount() {
  const container = document.createElement("div");
  container.id = "chatmark-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.zIndex = "999999";
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<App/>);
})();

setupBookmarkNavigationListener();
