import { useIsDark } from "./useIsDark";
import { getThemeColors, ThemeColors } from "../theme/colors";

/**
 * Custom hook to get theme colors based on current color scheme
 * @returns ThemeColors object with bg, fg, bgSubtle, fgSubtle
 */
export function useThemeColors(): ThemeColors {
  const isDark = useIsDark();
  return getThemeColors(isDark);
}
