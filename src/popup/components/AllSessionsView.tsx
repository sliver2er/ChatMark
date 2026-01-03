import { useState, useEffect, useCallback } from "react";
import { Flex, Box, Text, Button, Loader, Stack, Divider } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";
import { SessionMeta, BookmarkItem } from "@/types";
import { sessionApi } from "@/api/sessionApi";
import { bookmarkApi } from "@/api/bookmarkApi";
import { SessionList } from "./SessionList";
import { PopupBookmarkTreeView } from "./PopupBookmarkTreeView";
import { useTranslation } from "react-i18next";

export const AllSessionsView = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<SessionMeta[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // 세션 목록 로드
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoadingSessions(true);
        const data = await sessionApi.getAll();
        setSessions(data);
      } catch (err) {
        console.error("Failed to load sessions:", err);
      } finally {
        setLoadingSessions(false);
      }
    };

    loadSessions();
  }, []);

  // 선택된 세션의 북마크 로드
  useEffect(() => {
    if (!selectedSession) {
      setBookmarks([]);
      return;
    }

    const loadBookmarks = async () => {
      try {
        setLoadingBookmarks(true);
        const data = await bookmarkApi.getAll(selectedSession);
        setBookmarks(data);
        setExpandedIds(new Set()); // 새 세션 선택 시 펼침 상태 초기화
      } catch (err) {
        console.error("Failed to load bookmarks:", err);
      } finally {
        setLoadingBookmarks(false);
      }
    };

    loadBookmarks();
  }, [selectedSession]);

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

      // 새 탭에서 해당 세션 열고 북마크 위치로 이동
      const url = `https://chatgpt.com/c/${selectedSession}`;
      chrome.tabs.create({ url }, (tab) => {
        // 탭이 로드된 후 navigation 메시지 전송
        if (tab.id) {
          const tabId = tab.id;
          const listener = (
            updatedTabId: number,
            changeInfo: chrome.tabs.TabChangeInfo
          ) => {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
              chrome.tabs.onUpdated.removeListener(listener);
              // 약간의 딜레이 후 메시지 전송 (content script 로드 대기)
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
    const url = `https://chatgpt.com/c/${selectedSession}`;
    chrome.tabs.create({ url });
  };

  if (loadingSessions) {
    return (
      <Flex justify="center" align="center" h={300}>
        <Loader size="md" />
      </Flex>
    );
  }

  return (
    <Flex h={350} gap={0}>
      {/* 좌측: 세션 목록 */}
      <Box w={180} style={{ borderRight: "1px solid var(--mantine-color-default-border)" }}>
        <Text size="xs" fw={600} p="xs" pb={4}>
          {t("popup.sessions")}
        </Text>
        <Divider />
        <Box h="calc(100% - 36px)">
          <SessionList
            sessions={sessions}
            selectedSession={selectedSession}
            onSelectSession={setSelectedSession}
          />
        </Box>
      </Box>

      {/* 우측: 북마크 트리뷰 */}
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
              <Button
                variant="light"
                size="xs"
                fullWidth
                leftSection={<IconExternalLink size={14} />}
                onClick={handleGoToSession}
              >
                {t("popup.goToSession")}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Flex>
  );
};
