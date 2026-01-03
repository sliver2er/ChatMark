import {
  getAllSessionMetas,
  getSessionMeta,
  saveSessionMeta,
  deleteSessionMeta,
} from "../repository/sessionCRUD";
import { deleteBookmarksInSession } from "../repository/bookmarkCRUD";

export async function handleSessionGetAll(
  msg: any,
  sendResponse: Function,
  sender: chrome.runtime.MessageSender
) {
  try {
    const metas = await getAllSessionMetas();
    sendResponse({ success: true, data: metas });
  } catch (err) {
    sendResponse({ success: false, error: String(err) });
  }
}

export async function handleSessionGetMeta(
  msg: any,
  sendResponse: Function,
  sender: chrome.runtime.MessageSender
) {
  try {
    const meta = await getSessionMeta(msg.session_id);
    sendResponse({ success: true, data: meta });
  } catch (err) {
    sendResponse({ success: false, error: String(err) });
  }
}

export async function handleSessionSaveMeta(
  msg: any,
  sendResponse: Function,
  sender: chrome.runtime.MessageSender
) {
  try {
    await saveSessionMeta(msg.payload);
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ success: false, error: String(err) });
  }
}

export async function handleSessionDelete(
  msg: any,
  sendResponse: Function,
  sender: chrome.runtime.MessageSender
) {
  try {
    await deleteBookmarksInSession(msg.session_id);
    await deleteSessionMeta(msg.session_id);
    sendResponse({ success: true });
  } catch (err) {
    sendResponse({ success: false, error: String(err) });
  }
}
