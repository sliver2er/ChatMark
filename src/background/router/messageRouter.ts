import {
  handleBookmarkAdd,
  handleBookmarkGetAll,
  handleBookmarkDelete,
  handleBookmarkNavigate,
  handleBookmarkDeleteAll,
  handleBookmarkDeleteAllInSession,
  handleBookmarkUpdate,
  handleBookmarksUpdate,
} from "../services/bookmarkService";
import { getSettings, updateSettings } from "../repository/settingsCRUD";
import { MessageType } from "@/types/index";
import { handleSettingsGet, handleSettingsUpdate } from "../services/settingsService";
import {
  handleSessionGetAll,
  handleSessionGetMeta,
  handleSessionSaveMeta,
} from "../services/sessionService";

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
    "BOOKMARK_UPDATE": handleBookmarkUpdate,
    "BOOKMARKS_UPDATE": handleBookmarksUpdate,
    "SETTINGS_GET": handleSettingsGet,
    "SETTINGS_UPDATE": handleSettingsUpdate,
    "BOOKMARK_DELETE_ALL": handleBookmarkDeleteAll,
    "BOOKMARK_DELETE_SESSION": handleBookmarkDeleteAllInSession,
    // 세션 관련
    "SESSION_GET_ALL": handleSessionGetAll,
    "SESSION_GET_META": handleSessionGetMeta,
    "SESSION_SAVE_META": handleSessionSaveMeta,
  };

  const handler = map[msg.type];
  if (!handler) return sendResponse({ success: false, error: "Unknown message type" });

  handler(msg, sendResponse, sender);
}
