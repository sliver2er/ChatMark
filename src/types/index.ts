import { z } from "zod";

export const BookmarkItemSchema = z.object({
  id: z.string(), // UUID
  bookmark_name : z.string(),
  session_id: z.string(),
  message_id: z.string(),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  created_at: z.date(),
  note: z.string().optional(),
  parent_bookmark: z.string().optional(), // UUID of parent folder/bookmark
});

export type BookmarkItem = z.infer<typeof BookmarkItemSchema>;

export enum MessageType {
  Add = "BOOKMARK_ADD",
  GetAll = "BOOKMARK_GET_ALL",
  Delete = "BOOKMARK_DELETE",
  Navigate = "BOOKMARK_NAVIGATE",
  PanelRefresh = "PANEL_REFRESH"
}
