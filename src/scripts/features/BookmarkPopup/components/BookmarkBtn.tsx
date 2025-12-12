import { ActionIcon, Box, rem } from "@mantine/core";
import { IconBookmarkFilled } from "@tabler/icons-react";
import { forwardRef } from "react";

interface BookmarkBtnProps {
  onClick?: () => void;
}

export const BookmarkBtn = forwardRef<HTMLDivElement, BookmarkBtnProps>(
  ({ onClick }, ref) => {
    return (
      <Box
        ref={ref}
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
            color: "white"
          }}
        >
          <IconBookmarkFilled size={20} />
        </ActionIcon>
      </Box>
    );
  }
);
