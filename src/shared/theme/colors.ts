import { MantineColor } from '@mantine/core'

/**
 * Theme color definitions for ChatMark
 */
export interface ThemeColors {
  bg: MantineColor
  fg: MantineColor
  bgSubtle: MantineColor
  fgSubtle: MantineColor
  border: string
}

/**
 * Get theme colors based on dark mode
 */
export function getThemeColors(isDark: boolean): ThemeColors {
  return isDark
    ? {
        bg: 'dark.6',         // Main background
        fg: 'gray.0',         // Main foreground/text/icon
        bgSubtle: 'dark.8',   // Subtle background
        fgSubtle: 'gray.5',   // Subtle foreground
        border: '#424242',    // Border color
      }
    : {
        bg: 'gray.1',         // Main background
        fg: 'dark.8',         // Main foreground/text/icon
        bgSubtle: 'white',    // Subtle background
        fgSubtle: 'gray.6',   // Subtle foreground
        border: '#e0e0e0',    // Border color
      }
}
