import { ActionIcon, Box, rem } from "@mantine/core";
import { IconBookmarkFilled } from "@tabler/icons-react";

interface Props {
  onClick?: () => void;
}

export function BookmarkIcon({ onClick }: Props) {
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
        <IconBookmarkFilled style={{ width: rem(16), height: rem(16) }} />
      </ActionIcon>
    </Box>
  );
}
