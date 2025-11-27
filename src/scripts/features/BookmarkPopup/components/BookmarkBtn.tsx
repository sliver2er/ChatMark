import { ActionIcon, Box, rem } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";

interface BookmarkIconProps {
  onClick?: () => void;
}

export const BookmarkIcon = ({ onClick }: BookmarkIconProps) => {
  return (
    <Box
      ml = "0"
      bg = "#222"
      bdrs={"sm"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "8px",
        padding: "4px 8px",

      }}
    >
      <ActionIcon
        p = "md"
        variant="subtle"
        radius="lg"
        size="xs"
        onClick={onClick}
        style={{
          cursor: "pointer",
        }}
      >
        <IconBookmark size = "28px"/>
      </ActionIcon>
    </Box>
  );
}
