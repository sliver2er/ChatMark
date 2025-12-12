import { handleBookmarkAdd, 
        handleBookmarkGetAll,
        handleBookmarkDelete,
        handleBookmarkNavigate } from "../services/bookmarkService";
import { getSettings, updateSettings } from "../repository/settingsCRUD";
import { MessageType } from "@/types/index";

export function routeMessage(msg: any, sendResponse: Function, sender: chrome.runtime.MessageSender) {
  const map: Record<string, Function> = {
    "BOOKMARK_ADD": handleBookmarkAdd,
    "BOOKMARK_GET_ALL": handleBookmarkGetAll,
    "BOOKMARK_DELETE": handleBookmarkDelete,
    "BOOKMARK_NAVIGATE": handleBookmarkNavigate,
    "SETTINGS_GET": async (msg: any, sendResponse: Function) => {
      const settings = await getSettings();
      sendResponse({ success: true, data: settings });
    },
    "SETTINGS_UPDATE": async (msg: any, sendResponse: Function) => {
      const settings = await updateSettings(msg.payload);
      sendResponse({ success: true, data: settings });
    },
  };

  const handler = map[msg.type];
  if (!handler) return sendResponse({ success: false, error: "Unknown message type" });

  handler(msg, sendResponse, sender);
}
