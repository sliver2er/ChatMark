import { Stack, Text, UnstyledButton, ScrollArea, Box } from "@mantine/core";
import { SessionMeta } from "@/types";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useTranslation } from "react-i18next";

interface SessionListProps {
  sessions: SessionMeta[];
  selectedSession: string | null;
  onSelectSession: (sessionId: string) => void;
}

export const SessionList = ({
  sessions,
  selectedSession,
  onSelectSession,
}: SessionListProps) => {
  const { t } = useTranslation();
  const colors = useThemeColors();

  if (sessions.length === 0) {
    return (
      <Box p="md">
        <Text size="sm" c="dimmed" ta="center">
          {t("popup.noSessions")}
        </Text>
      </Box>
    );
  }

  return (
    <ScrollArea h="100%" offsetScrollbars>
      <Stack gap={2} p="xs">
        {sessions.map((session) => {
          const isSelected = selectedSession === session.session_id;

          return (
            <UnstyledButton
              key={session.session_id}
              onClick={() => onSelectSession(session.session_id)}
              py={6}
              px={8}
              style={(theme) => ({
                borderRadius: theme.radius.md,
                backgroundColor: isSelected
                  ? colors.bookmarkItem.bgSelected
                  : colors.bookmarkItem.bg,
                border: isSelected
                  ? `1px solid ${colors.bookmarkItem.borderSelected}`
                  : `1px solid ${colors.bookmarkItem.border}`,
                transition: "all 0.15s ease",
                "&:hover": {
                  backgroundColor: isSelected
                    ? colors.bookmarkItem.bgSelectedHover
                    : colors.bookmarkItem.bgHover,
                },
              })}
            >
              <Text
                size="xs"
                fw={isSelected ? 600 : 400}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {session.title}
              </Text>
            </UnstyledButton>
          );
        })}
      </Stack>
    </ScrollArea>
  );
};
