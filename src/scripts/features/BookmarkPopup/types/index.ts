import { z } from "zod";

export const BookmarkItemSchema = z.object({
  id: z.string(), // UUID
  session_id: z.string(),
  message_id: z.string(),
  text: z.string(),
  start: z.number(),
  end: z.number(),
  created_at: z.date(),
  note: z.string().optional(),
  parent_bookmark: z.string().optional(), // UUID of parent folder/bookmark
  type: z.enum(["text-fragment", "full-message"]).default("text-fragment"),
});

export type BookmarkItem = z.infer<typeof BookmarkItemSchema>;