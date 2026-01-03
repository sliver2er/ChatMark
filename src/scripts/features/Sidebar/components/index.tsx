import { Text, Loader, Center, Alert } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { BookmarkItem as BookmarkItemType } from "@/types";
import { bookmarkApi } from "@/api/bookmarkApi";
import { NavigationBookmarkTreeView } from "./NavigationBookmarkTreeView";
import { getSessionId } from "@/shared/functions/getSessionId";
import { useStorageSync } from "@/hooks/useStorageSync";
import {
  DEBOUNCE_DELAY,
  URL_POLLING_INTERVAL,
  LOADING_CENTER_HEIGHT,
  EMPTY_STATE_HEIGHT,
} from "../config/constants";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback, useRef } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { wouldCreateCycle, hasChildren } from "@/utils/bookmarkTreeUtils";

export const BookmarkTree = () => {
  const { t } = useTranslation();
  const [bookmarks, setBookmarks] = useState<BookmarkItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const debounceTimerRef = useRef<number | null>(null);

  const fetchBookmarks = async (sid: string) => {
    try {
      setLoading(true);
      const data = await bookmarkApi.getAll(sid);
      setBookmarks(data);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchBookmarks = useCallback((sid: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchBookmarks(sid);
    }, DEBOUNCE_DELAY);
  }, []);

  const handleStorageChange = useCallback(() => {
    if (sessionId) {
      debouncedFetchBookmarks(sessionId);
    }
  }, [sessionId, debouncedFetchBookmarks]);

  // Set up storage sync listener for this session's bookmarks
  useStorageSync({
    keyPattern: sessionId ? `chatmark.bookmarks.${sessionId}` : "",
    onChanged: handleStorageChange,
  });

  useEffect(() => {
    if (sessionId) {
      debouncedFetchBookmarks(sessionId);
    }
  }, [sessionId, debouncedFetchBookmarks]);

  useEffect(() => {
    // Get session ID from current page
    const initialSessionId = getSessionId();

    if (!initialSessionId) {
      setError(t("sidebar.noSessionId"));
      setLoading(false);
      return;
    }

    setSessionId(initialSessionId);
    fetchBookmarks(initialSessionId);

    return () => {
      // Cleanup debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Real-time URL change detection
  useEffect(() => {
    const checkUrlChange = () => {
      const newSessionId = getSessionId();
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
      }
    };

    const intervalId = setInterval(checkUrlChange, URL_POLLING_INTERVAL);
    return () => clearInterval(intervalId);
  }, [sessionId]);

  if (loading) {
    return (
      <Center h={LOADING_CENTER_HEIGHT}>
        <Loader size="lg" type="dots" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        title={t("sidebar.error")}
        color="red"
        variant="light"
      >
        {error}
      </Alert>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <Center h={EMPTY_STATE_HEIGHT}>
        <Text c="dimmed" size="sm">
          {t("sidebar.noBookmarksYet")}
        </Text>
      </Center>
    );
  }

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSelectBookmark = (bookmark: BookmarkItemType) => {
    setSelectedId(bookmark.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const activeBookmark = bookmarks.find((b) => b.id === active.id);
    const overBookmark = bookmarks.find((b) => b.id === over.id);

    if (!activeBookmark || !overBookmark) return;

    // 순환 참조 체크
    if (wouldCreateCycle(bookmarks, activeBookmark.id, overBookmark.id)) {
      console.warn("Cannot move bookmark: would create cycle");
      return;
    }

    try {
      // Case 1: 같은 부모 내에서 순서 변경
      if (activeBookmark.parent_bookmark === overBookmark.parent_bookmark) {
        await handleReorderInSameParent(activeBookmark, overBookmark);
      }
      // Case 2: 다른 폴더로 이동
      else {
        await handleMoveToNewParent(activeBookmark, overBookmark);
      }
    } catch (error) {
      console.error("Failed to handle drag:", error);
      // 에러 발생 시 북마크 다시 로드하여 원래 상태로 복구
      if (sessionId) {
        await fetchBookmarks(sessionId);
      }
    }
  };

  const handleReorderInSameParent = async (
    activeBookmark: BookmarkItemType,
    overBookmark: BookmarkItemType
  ) => {
    if (!sessionId) return;

    const parentId = activeBookmark.parent_bookmark;

    // 같은 부모를 가진 모든 형제 북마크 가져오기
    const siblings = bookmarks
      .filter((b) => b.parent_bookmark === parentId)
      .sort((a, b) => a.order - b.order);

    const oldIndex = siblings.findIndex((b) => b.id === activeBookmark.id);
    const newIndex = siblings.findIndex((b) => b.id === overBookmark.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // 배열 순서 변경
    const reorderedSiblings = arrayMove(siblings, oldIndex, newIndex);

    // 각 북마크에 새로운 order 할당
    const updates = reorderedSiblings.map((bookmark, index) => ({
      id: bookmark.id,
      updates: { order: index },
    }));

    // API 호출하여 일괄 업데이트
    await bookmarkApi.updateMany(sessionId, updates);

    // 로컬 상태 업데이트 (optimistic update)
    setBookmarks((prev) =>
      prev.map((b) => {
        const update = updates.find((u) => u.id === b.id);
        return update ? { ...b, ...update.updates } : b;
      })
    );
  };

  const handleMoveToNewParent = async (
    activeBookmark: BookmarkItemType,
    overBookmark: BookmarkItemType
  ) => {
    if (!sessionId) return;

    // overBookmark이 폴더인지 확인
    const isOverFolder = hasChildren(bookmarks, overBookmark.id);

    // 새로운 부모 ID 결정
    const newParentId = isOverFolder ? overBookmark.id : overBookmark.parent_bookmark;

    // 새 부모의 자식들 가져오기
    const newSiblings = bookmarks
      .filter((b) => b.parent_bookmark === newParentId)
      .sort((a, b) => a.order - b.order);

    // 이동한 북마크를 맨 끝에 추가
    const newOrder = newSiblings.length;

    // 북마크 업데이트
    await bookmarkApi.update(sessionId, activeBookmark.id, {
      parent_bookmark: newParentId,
      order: newOrder,
    });

    // 로컬 상태 업데이트
    setBookmarks((prev) =>
      prev.map((b) =>
        b.id === activeBookmark.id ? { ...b, parent_bookmark: newParentId, order: newOrder } : b
      )
    );

    // 폴더를 자동으로 확장
    if (isOverFolder) {
      setExpandedIds((prev) => new Set([...prev, overBookmark.id]));
    }
  };

  return (
    <NavigationBookmarkTreeView
      bookmarks={bookmarks}
      expandedIds={expandedIds}
      onToggleExpand={handleToggleExpand}
      selectedId={selectedId}
      onSelectBookmark={handleSelectBookmark}
      onDragEnd={handleDragEnd}
    />
  );
};
