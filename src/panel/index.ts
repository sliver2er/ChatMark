import { createRoot } from "react-dom/client"
import { StrictMode } from "react"
import { MantineProvider } from "@mantine/core"
import React from "react"
import { BookmarkTree } from "./features/BookmarkTree"

const root = document.getElementById("root")

if (root) {
    createRoot(root).render(
        React.createElement(StrictMode, null,
            React.createElement(MantineProvider, { defaultColorScheme: "dark" },
                React.createElement(BookmarkTree, null)
            )
        )
    )
}
