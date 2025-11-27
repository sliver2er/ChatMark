import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BookmarkIcon } from "../../components/Bookmark/BookmarkBtn";
import { findAskGPTButton } from "../..";

export function injectBookmarkButton() {
  const askGPTBtn = findAskGPTButton();
  if (!askGPTBtn) {
    return;
  }

  if (document.getElementById("bookmark-btn")) return;

  const container = document.createElement("span");
  container.id = "bookmark-btn";
  container.style.display = "inline-flex";
  container.style.alignItems = "center";

  askGPTBtn.insertAdjacentElement("afterend", container);

  const root = createRoot(container);
  root.render(
    <MantineProvider withGlobalClasses = {false}>
      <BookmarkIcon onClick={() => alert("bookmark")} />
    </MantineProvider>

  );
}
