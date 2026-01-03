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
      ml="sm"
      bg={colors.bg}
      bdrs="50%"
      bd={`0.5px solid ${colors.border}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
        pointerEvents: "auto",
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
        <IconBookmarkFilled size={32} />
      </ActionIcon>
    </Box>
  );
});
