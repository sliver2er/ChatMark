import { ActionIcon, Tooltip, rem } from "@mantine/core";
import { IconBookmarkFilled } from "@tabler/icons-react";

interface Props {
  onClick?: () => void;
}

export function BookmarkIcon({ onClick }: Props) {
  return (
    <Tooltip label="북마크 추가" offset={4}>
      <ActionIcon
        variant="light"
        color="red"
        radius="lg"
        size="sm"
        onClick={onClick}
        style={{
          marginLeft: "8px",
          cursor: "pointer",
        }}
      >
        <IconBookmarkFilled style={{ width: rem(16), height: rem(16) }} />
      </ActionIcon>
    </Tooltip>
  );
}
