// src/scripts/injectBookmarkButton.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { BookmarkIcon } from "./components/BookmarkBtn";
import { findAskGPTButton } from ".";

export function injectBookmarkButton() {
  const askGPTBtn = findAskGPTButton();
  if (!askGPTBtn) {
    console.log("[ChatMark] askGPT button not found yet...");
    return;
  }

  // 이미 생성되어 있으면 중복 방지
  if (document.getElementById("bookmark-btn")) return;

  const container = document.createElement("span");
  container.id = "bookmark-btn";
  container.style.display = "inline-flex";
  container.style.alignItems = "center";

  askGPTBtn.insertAdjacentElement("afterend", container);

  const root = createRoot(container);
  root.render(
    <MantineProvider>    
      <BookmarkIcon onClick={() => alert("bookmark")} />
    </MantineProvider>

  );

  console.log("[ChatMark] 북마크 버튼 삽입됨!");
}
