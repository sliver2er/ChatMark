import { createRoot } from "react-dom/client";
import React from "react";
import { App } from "./App";

(function mount() {
  // React root container 생성
  const container = document.createElement("div");
  container.id = "chatmark-root";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.right = "0";
  container.style.zIndex = "999999";
  document.body.appendChild(container);

  // React 부팅 - App 컴포넌트가 모든 기능 관리
  const root = createRoot(container);
  root.render(<App/>);
})();
