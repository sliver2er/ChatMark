import { MantineColor } from "@mantine/core";

/**
 * Theme color definitions for ChatMark
 */
export interface ThemeColors {
  bg: MantineColor;
  fg: MantineColor;
  bgSubtle: MantineColor;
  fgSubtle: MantineColor;
  border: string;
  deleteColor: MantineColor;
  // Drag & Drop colors
  dropValid: {
    bg: string;
    bgHover: string;
    border: string;
  };
  dropInvalid: {
    bg: string;
    bgHover: string;
    border: string;
  };
  // Root drop zone colors
  rootDropZone: {
    bg: string;
    bgHover: string;
    border: string;
    borderHover: string;
    text: string;
    textHover: string;
  };
  // Bookmark item colors
  bookmarkItem: {
    bg: string;
    bgSelected: string;
    bgSelectedHover: string;
    bgHover: string;
    border: string;
    borderSelected: string;
  };
}

/**
 * Get theme colors based on dark mode
 */
export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark
    ? {
        bg: "dark.6", // Main background
        fg: "gray.0", // Main foreground/text/icon
        bgSubtle: "dark.8", // Subtle background
        fgSubtle: "gray.5", // Subtle foreground
        border: "#424242", // Border color
        deleteColor: "red.4",
        dropValid: {
          bg: "rgba(99, 102, 241, 0.15)",
          bgHover: "rgba(99, 102, 241, 0.2)",
          border: "rgba(99, 102, 241, 0.5)",
        },
        dropInvalid: {
          bg: "rgba(239, 68, 68, 0.15)",
          bgHover: "rgba(239, 68, 68, 0.2)",
          border: "rgba(239, 68, 68, 0.5)",
        },
        rootDropZone: {
          bg: "rgba(99, 102, 241, 0.05)",
          bgHover: "rgba(99, 102, 241, 0.15)",
          border: "rgba(99, 102, 241, 0.2)",
          borderHover: "rgba(99, 102, 241, 0.5)",
          text: "rgba(156, 163, 175, 0.6)",
          textHover: "rgba(99, 102, 241, 1)",
        },
        bookmarkItem: {
          bg: "transparent",
          bgSelected: "rgba(255, 255, 255, 0.06)",
          bgSelectedHover: "rgba(255, 255, 255, 0.08)",
          bgHover: "rgba(255, 255, 255, 0.04)",
          border: "transparent",
          borderSelected: "rgba(255, 255, 255, 0.12)",
        },
      }
    : {
        bg: "gray.1", // Main background
        fg: "dark.8", // Main foreground/text/icon
        bgSubtle: "white", // Subtle background
        fgSubtle: "gray.6", // Subtle foreground
        border: "#e0e0e0", // Border color
        deleteColor: "red.6",
        dropValid: {
          bg: "rgba(99, 102, 241, 0.1)",
          bgHover: "rgba(99, 102, 241, 0.15)",
          border: "rgba(99, 102, 241, 0.5)",
        },
        dropInvalid: {
          bg: "rgba(239, 68, 68, 0.1)",
          bgHover: "rgba(239, 68, 68, 0.15)",
          border: "rgba(239, 68, 68, 0.5)",
        },
        rootDropZone: {
          bg: "rgba(99, 102, 241, 0.03)",
          bgHover: "rgba(99, 102, 241, 0.1)",
          border: "rgba(99, 102, 241, 0.15)",
          borderHover: "rgba(99, 102, 241, 0.5)",
          text: "rgba(107, 114, 128, 0.6)",
          textHover: "rgba(99, 102, 241, 1)",
        },
        bookmarkItem: {
          bg: "transparent",
          bgSelected: "rgba(0, 0, 0, 0.04)",
          bgSelectedHover: "rgba(0, 0, 0, 0.06)",
          bgHover: "rgba(0, 0, 0, 0.03)",
          border: "transparent",
          borderSelected: "rgba(0, 0, 0, 0.08)",
        },
      };
}
