import { useState, useEffect, useCallback } from "react";
import { BookmarkItem } from "@/types";
import { bookmarkApi } from "../api/bookmarkApi";
import { error } from "@/shared/logger";

export const useBookmark = (session_id: string) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadBookmarks = useCallback(async () => {
    try {
      const list = await bookmarkApi.getAll(session_id);
      setBookmarks(list);
      setLoading(false);
    } catch (err) {
      error("Failed to load bookmarks : ", err);
      setLoading(false);
      setBookmarks([]);
    }
  }, [session_id]);

  const addBookmark = useCallback(
    async (item: BookmarkItem) => {
      try {
        await bookmarkApi.add(item);
        loadBookmarks();
      } catch (err) {
        error("Failed to add bookmark : ", err);
      }
    },
    [session_id]
  );

  const deleteBookmark = useCallback(
    async (bookmark_id: string) => {
      try {
        await bookmarkApi.delete(session_id, bookmark_id);
        loadBookmarks();
      } catch (err) {
        error("Failed to delete bookmark : ", err);
      }
    },
    [session_id]
  );

  useEffect(() => {
    loadBookmarks();
  }, [session_id]);

  return {
    bookmarks,
    loading,
    loadBookmarks,
    addBookmark,
    deleteBookmark,
  };
};
