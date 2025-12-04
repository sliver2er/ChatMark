import { ActionIcon, Box, rem } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";

interface BookmarkBtnProps {
  onClick?: () => void;
}

export const BookmarkBtn = ({ onClick }: BookmarkBtnProps) => {
  return (
    <Box
      ml="xs"
      bg="dark.6"
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
        color="white"
        size="md"
        onClick={onClick}
        style={{
          cursor: "pointer",
          color: "white",
        }}
      >
        <IconBookmark size={20} stroke={2} style={{ color: "white" }} />
      </ActionIcon>
    </Box>
  );
}
