import * as repo from "../repository/bookmarkCRUD";
import { BookmarkItem } from "@/types";
import { log } from "@/shared/logger";


export async function handleBookmarkAdd(msg: any, sendResponse: Function) {
  const item: BookmarkItem = msg.payload;
  await repo.saveBookmark(item.session_id, item);
  log("Bookmark add signal received")
  log("Bookmark", item)

  sendResponse({ success: true });
}

export async function handleBookmarkGetAll(msg: any, sendResponse: Function) {
  const list = await repo.getBookmarks(msg.session_id);
  sendResponse({ success: true, data: list });
}

export async function handleBookmarkDelete(msg: any, sendResponse: Function) {
  const { session_id, id } = msg;
  await repo.deleteBookmark(session_id, id);
  sendResponse({ success: true });
}
