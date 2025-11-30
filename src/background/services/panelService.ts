import { log } from "@/shared/logger";

export async function handlePanelOpen(msg: any, sendResponse: Function, sender: chrome.runtime.MessageSender) {
  try {
    // Get window ID from the sender's tab
    const tab = sender.tab;
    if (!tab?.windowId) {
      throw new Error("No window ID available");
    }

    await (chrome as any).sidePanel.open({ windowId: tab.windowId });
    log("Panel opened");
    sendResponse({ success: true });
  } catch (error) {
    log("Error opening panel:", error);
    sendResponse({ success: false, error: String(error) });
  }
}
