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
  parent_bookmark: z.string().optional(), // UUID of parent folder/bookmark
});

export type BookmarkItem = z.infer<typeof BookmarkItemSchema>;

export enum MessageType {
  Add = "BOOKMARK_ADD",
  GetAll = "BOOKMARK_GET_ALL",
  Delete = "BOOKMARK_DELETE",
  DeleteAll = "BOOKMARK_DELETE_ALL",
  Navigate = "BOOKMARK_NAVIGATE",
  PanelRefresh = "PANEL_REFRESH",
  SettingsGet = "SETTINGS_GET",
  SettingsUpdate = "SETTINGS_UPDATE",
}

export interface ChatMarkSettings {
  highlightColor: string;
  scrollBehavior: "instant" | "smooth";
}

export const DEFAULT_SETTINGS: ChatMarkSettings = {
  highlightColor: "#ffd93d",
  scrollBehavior: "instant",
};
