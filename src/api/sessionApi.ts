import { SessionMeta } from "@/types";
import { error } from "@/shared/logger";

export const sessionApi = {
  getAll(): Promise<SessionMeta[]> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "SESSION_GET_ALL" }, (response) => {
        if (!response?.success) {
          error("Failed to get sessions:", response?.error);
          reject(response?.error);
        } else {
          resolve(response.data);
        }
      });
    });
  },

  getMeta(session_id: string): Promise<SessionMeta | null> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "SESSION_GET_META", session_id }, (response) => {
        if (!response?.success) {
          error("Failed to get session meta:", response?.error);
          reject(response?.error);
        } else {
          resolve(response.data);
        }
      });
    });
  },

  saveMeta(meta: SessionMeta): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({ type: "SESSION_SAVE_META", payload: meta }, (response) => {
        if (!response?.success) {
          error("Failed to save session meta:", response?.error);
          reject(response?.error);
        } else {
          resolve();
        }
      });
    });
  },
};
