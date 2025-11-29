import { handleBookmarkAdd, handleBookmarkGetAll, handleBookmarkDelete } from "../services/bookmarkService";
import { MessageType } from "@/types/index";

export function routeMessage(msg: any, sendResponse: Function) {
  const map: Record<string, Function> = {
    "BOOKMARK_ADD": handleBookmarkAdd,
    "BOOKMARK_GET_ALL": handleBookmarkGetAll,
    "BOOKMARK_DELETE": handleBookmarkDelete,
  };

  const handler = map[msg.type];
  if (!handler) return sendResponse({ success: false, error: "Unknown message type" });

  handler(msg, sendResponse);
}
