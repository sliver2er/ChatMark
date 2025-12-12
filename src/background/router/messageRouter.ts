import {
  handleBookmarkAdd,
  handleBookmarkGetAll,
  handleBookmarkDelete,
  handleBookmarkNavigate,
  handleBookmarkDeleteAll,
} from "../services/bookmarkService";
import { getSettings, updateSettings } from "../repository/settingsCRUD";
import { MessageType } from "@/types/index";
import { handleSettingsGet, handleSettingsUpdate } from "../services/settingsService";

export function routeMessage(
  msg: any,
  sendResponse: Function,
  sender: chrome.runtime.MessageSender
) {
  const map: Record<string, Function> = {
    "BOOKMARK_ADD": handleBookmarkAdd,
    "BOOKMARK_GET_ALL": handleBookmarkGetAll,
    "BOOKMARK_DELETE": handleBookmarkDelete,
    "BOOKMARK_NAVIGATE": handleBookmarkNavigate,
    "SETTINGS_GET": handleSettingsGet,
    "SETTINGS_UPDATE": handleSettingsUpdate,
    "BOOKMARK_DELETE_ALL": handleBookmarkDeleteAll,
  };

  const handler = map[msg.type];
  if (!handler) return sendResponse({ success: false, error: "Unknown message type" });

  handler(msg, sendResponse, sender);
}
