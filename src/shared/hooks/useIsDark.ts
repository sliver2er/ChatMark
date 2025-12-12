import { useMantineColorScheme } from '@mantine/core'

/**
 * Custom hook to check if current color scheme is dark
 * @returns true if dark mode, false if light mode
 */
export function useIsDark(): boolean {
  const { colorScheme } = useMantineColorScheme()
  return colorScheme === 'dark'
}
