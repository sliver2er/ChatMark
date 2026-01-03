import { useState, useEffect, useCallback } from "react";
import { Flex, Box, Text, Button, Loader, Divider, SegmentedControl, Group } from "@mantine/core";
import { IconExternalLink, IconTrash } from "@tabler/icons-react";
import { SessionMeta, BookmarkItem, LLMProvider } from "@/types";
import { sessionApi } from "@/api/sessionApi";
import { bookmarkApi } from "@/api/bookmarkApi";
import { SessionList } from "./SessionList";
import { PopupBookmarkTreeView } from "./PopupBookmarkTreeView";
import { useTranslation } from "react-i18next";

type ProviderFilter = LLMProvider;

const buildSessionUrl = (sessionId: string, provider: LLMProvider): string => {
  switch (provider) {
    case "ChatGPT":
      return `https://chatgpt.com/c/${sessionId}`;
    case "Gemini":
      return `https://gemini.google.com/app/${sessionId}`;
    case "Claude":
      return `https://claude.ai/chat/${sessionId}`;
    default:
      return `https://chatgpt.com/c/${sessionId}`;
  }
};

export const AllSessionsView = () => {
  const { t } = useTranslation();
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>("ChatGPT");
  const [allSessions, setAllSessions] = useState<SessionMeta[]>([]);
  const [selectedSession, setSelectedSession] = useState<SessionMeta | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  const filteredSessions = allSessions.filter(
    (session) => session.provider === providerFilter
  );

  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoadingSessions(true);
        const data = await sessionApi.getAll();
        setAllSessions(data);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    loadSessions();
  }, []);

  useEffect(() => {
    if (!selectedSession) {
      setBookmarks([]);
      return;
    }

    const loadBookmarks = async () => {
      try {
        setLoadingBookmarks(true);
        const data = await bookmarkApi.getAll(selectedSession.session_id);
        setBookmarks(data);
        setExpandedIds(new Set());
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [selectedSession]);

  useEffect(() => {
    if (selectedSession && !filteredSessions.find((s) => s.session_id === selectedSession.session_id)) {
      setSelectedSession(null);
    }
  }, [providerFilter, filteredSessions, selectedSession]);

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectBookmark = useCallback(
    (bookmark: BookmarkItem) => {
      if (!selectedSession) return;

      const url = buildSessionUrl(selectedSession.session_id, selectedSession.provider);
      chrome.tabs.create({ url }, (tab) => {
        if (tab.id) {
          const tabId = tab.id;
          const listener = (updatedTabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              setTimeout(() => {
                chrome.tabs.sendMessage(tabId, {
                  type: "BOOKMARK_NAVIGATE",
                  payload: bookmark,
                });
              }, 1000);
            }
          };
          chrome.tabs.onUpdated.addListener(listener);
        }
      });
    },
    [selectedSession]
  );

  const handleGoToSession = () => {
    if (!selectedSession) return;
    const url = buildSessionUrl(selectedSession.session_id, selectedSession.provider);
    chrome.tabs.create({ url });
  };

  const handleDeleteSession = async () => {
    if (!selectedSession) return;
    await sessionApi.delete(selectedSession.session_id);
    setAllSessions((prev) => prev.filter((s) => s.session_id !== selectedSession.session_id));
    setSelectedSession(null);
  };

  const handleSelectSession = (sessionId: string) => {
    const session = allSessions.find((s) => s.session_id === sessionId);
    setSelectedSession(session || null);
  };

  if (loadingSessions) {
    return (
      <Flex justify="center" align="center" h={300}>
        <Loader size="md" />
      </Flex>
    );
  }

  return (
    <Box>
      <Box p="xs" pb={0}>
        <SegmentedControl
          value={providerFilter}
          onChange={(val) => setProviderFilter(val as ProviderFilter)}
          data={[
            { label: t("popup.providerChatGPT"), value: "ChatGPT" },
            { label: t("popup.providerGemini"), value: "Gemini" },
            { label: t("popup.providerClaude"), value: "Claude" },
          ]}
          size="xs"
          fullWidth
        />
      </Box>
      <Flex h={320} gap={0}>
        <Box w={180} style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}>
          <Text size="xs" fw={600} p="xs" pb={4}>
            {t("popup.sessions")}
          </Text>
          <Divider />
          <Box h="calc(100% - 36px)">
            <SessionList
              sessions={filteredSessions}
              selectedSession={selectedSession?.session_id || null}
              onSelectSession={handleSelectSession}
            />
          </Box>
        </Box>

        <Box style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {!selectedSession ? (
            <Flex justify="center" align="center" h="100%">
              <Text size="sm" c="dimmed">
                {t("popup.selectSession")}
              </Text>
            </Flex>
          ) : loadingBookmarks ? (
            <Flex justify="center" align="center" h="100%">
              <Loader size="sm" />
            </Flex>
          ) : (
            <>
              <Box style={{ flex: 1, overflow: "hidden" }}>
                <PopupBookmarkTreeView
                  bookmarks={bookmarks}
                  expandedIds={expandedIds}
                  onToggleExpand={handleToggleExpand}
                  onSelectBookmark={handleSelectBookmark}
                />
              </Box>
              <Divider />
              <Box p="xs">
                <Group gap="xs">
                  <Button
                    variant="light"
                    size="xs"
                    style={{ flex: 1 }}
                    leftSection={<IconExternalLink size={14} />}
                    onClick={handleGoToSession}
                  >
                    {t("popup.goToSession")}
                  </Button>
                  <Button
                    variant="light"
                    color="red"
                    size="xs"
                    leftSection={<IconTrash size={14} />}
                    onClick={handleDeleteSession}
                  >
                    {t("popup.deleteSession")}
                  </Button>
                </Group>
              </Box>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
