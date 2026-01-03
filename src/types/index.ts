import { z } from "zod";

export const BookmarkItemSchema = z.object({
  id: z.string(), // UUID
  bookmark_name: z.string(),
  session_id: z.string(),
  message_id: z.string(),
  text: z.string(),
  context_before: z.string(), // 50 characters before the bookmarked text
  context_after: z.string(), // 50 characters after the bookmarked text
  start: z.number().optional(), // DOM offset (unreliable, for reference only)
  end: z.number().optional(), // DOM offset (unreliable, for reference only)
  created_at: z.date(),
  note: z.string().optional(),
  parent_bookmark: z.string().nullable(), // UUID of parent folder/bookmark (null = root)
  order: z.number(), // Order within the same parent (0-indexed)
});

export type BookmarkItem = z.infer<typeof BookmarkItemSchema>;

// 세션 메타데이터 (제목 저장용)
export const SessionMetaSchema = z.object({
  session_id: z.string(),
  title: z.string(),
  updated_at: z.date(),
});

export type SessionMeta = z.infer<typeof SessionMetaSchema>;

export enum MessageType {
  Add = "BOOKMARK_ADD",
  GetAll = "BOOKMARK_GET_ALL",
  Delete = "BOOKMARK_DELETE",
  DeleteAll = "BOOKMARK_DELETE_ALL",
  DeleteSession = "BOOKMARK_DELETE_SESSION",
  Navigate = "BOOKMARK_NAVIGATE",
  Update = "BOOKMARK_UPDATE",
  UpdateMany = "BOOKMARKS_UPDATE",
  PanelRefresh = "PANEL_REFRESH",
  SettingsGet = "SETTINGS_GET",
  SettingsUpdate = "SETTINGS_UPDATE",
  // 세션 관련
  SessionGetAll = "SESSION_GET_ALL",
  SessionSaveMeta = "SESSION_SAVE_META",
  SessionGetMeta = "SESSION_GET_META",
}

export interface ChatMarkSettings {
  highlightColor: string;
  scrollBehavior: "instant" | "smooth";
  colorScheme: "dark" | "light";
  language?: "en" | "ko";
}

export const DEFAULT_SETTINGS: ChatMarkSettings = {
  highlightColor: "#ffd93d",
  scrollBehavior: "instant",
  colorScheme: "dark",
  language: "en",
};
