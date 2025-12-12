import { ActionIcon, Box, rem } from "@mantine/core";
import { IconBookmarkFilled } from "@tabler/icons-react";
import { forwardRef } from "react";
import { useThemeColors } from "@/shared/hooks/useThemeColors";

interface BookmarkBtnProps {
  onClick?: () => void;
}

export const BookmarkBtn = forwardRef<HTMLDivElement, BookmarkBtnProps>(({ onClick }, ref) => {
  const colors = useThemeColors();

  return (
    <Box
      ref={ref}
      ml="xs"
      bg={colors.bg}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        padding: "4px",
      }}
    >
      <ActionIcon
        variant="subtle"
        color={colors.fg}
        size="md"
        onClick={onClick}
        style={{
          cursor: "pointer",
        }}
      >
        <IconBookmarkFilled size={20} />
      </ActionIcon>
    </Box>
  );
});
