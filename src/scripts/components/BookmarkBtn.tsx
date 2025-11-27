import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";

interface Props {
  onClick?: () => void;
}

export function BookmarkIcon({ onClick }: Props) {
  return (
    <Tooltip label="북마크 추가" offset={4}>
      <ActionIcon
        variant="light"
        color="white"
        radius="lg"
        size="sm"
        onClick={onClick}
        style={{
          marginLeft: "8px",
          cursor: "pointer",
        }}
      >
        <IconBookmark style={{ width: rem(16), height: rem(16) }} />
      </ActionIcon>
    </Tooltip>
  );
}
