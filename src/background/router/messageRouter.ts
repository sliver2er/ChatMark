import { handleBookmarkAdd, handleBookmarkGetAll, handleBookmarkDelete } from "../services/bookmarkService";
import { handlePanelOpen } from "../services/panelService";
import { MessageType } from "@/types/index";

export function routeMessage(msg: any, sendResponse: Function, sender: chrome.runtime.MessageSender) {
  const map: Record<string, Function> = {
    "BOOKMARK_ADD": handleBookmarkAdd,
    "BOOKMARK_GET_ALL": handleBookmarkGetAll,
    "BOOKMARK_DELETE": handleBookmarkDelete,
    "PANEL_OPEN": handlePanelOpen,
  };

  const handler = map[msg.type];
  if (!handler) return sendResponse({ success: false, error: "Unknown message type" });

  handler(msg, sendResponse, sender);
}
