import { create } from "zustand";
import { BookmarkItem } from "@/types";
import { bookmarkApi } from "@/api/bookmarkApi";
import { error } from "@/shared/logger";
import { useSessionStore } from "./useSessionStore";

interface BookmarkStore {
  bookmarks: BookmarkItem[];
  loading: boolean;
  setBookmarks: (bookmarks: BookmarkItem[]) => void;
  setLoading: (loading: boolean) => void;
  loadBookmarks: () => Promise<void>;
  addBookmark: (item: BookmarkItem) => Promise<void>;
  deleteBookmark: (bookmark_id: string) => Promise<void>;
  deleteAllBookmarksinSession: (session_id: string) => Promise<void>;
  deleteAllBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  loading: true,

  setBookmarks: (bookmarks) => set({ bookmarks }),

  setLoading: (loading) => set({ loading }),

  loadBookmarks: async () => {
    set({ loading: true });
    const sessionId = useSessionStore.getState().sessionId;
    if (!sessionId) {
      set({ bookmarks: [], loading: false });
      return;
    }

    try {
      const list = await bookmarkApi.getAll(sessionId);
      set({ bookmarks: list, loading: false });
    } catch (err) {
      error("Failed to load bookmarks: ", err);
      set({ bookmarks: [], loading: false });
    }
  },

  addBookmark: async (item) => {
    try {
      await bookmarkApi.add(item);
      await get().loadBookmarks();
    } catch (err) {
      error("Failed to add bookmark: ", err);
      throw err;
    }
  },

  deleteBookmark: async (bookmark_id) => {
    const sessionId = useSessionStore.getState().sessionId;
    if (!sessionId) return;

    try {
      await bookmarkApi.delete(sessionId, bookmark_id);
      await get().loadBookmarks();
    } catch (err) {
      error("Failed to delete bookmark: ", err);
    }
  },

  deleteAllBookmarksinSession: async (session_id) => {
    try {
      await bookmarkApi.deleteSession(session_id);
      await get().loadBookmarks();
    } catch (err) {
      error("Failed to delete session bookmarks: ", err);
    }
  },

  deleteAllBookmarks: async () => {
    try {
      await bookmarkApi.deleteAll();
      await get().loadBookmarks();
    } catch (err) {
      error("Failed to delete all bookmarks: ", err);
    }
  },
}));

// Subscribe to sessionId changes and reload bookmarks
useSessionStore.subscribe((state, prevState) => {
  // Only reload if sessionId actually changed
  if (state.sessionId !== prevState.sessionId) {
    useBookmarkStore.getState().loadBookmarks();
  }
});
