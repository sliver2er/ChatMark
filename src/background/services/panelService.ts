import { log } from "@/shared/logger";

export async function handlePanelOpen(msg: any, sendResponse: Function, sender: chrome.runtime.MessageSender) {
  try {
    // Get window ID from the sender's tab
    const tab = sender.tab;
    if (!tab?.windowId) {
      throw new Error("No window ID available");
    }

    const sessionId = msg.session_id;

    // Open the panel first (must be in response to user gesture)
    await (chrome as any).sidePanel.open({ windowId: tab.windowId });

    // Then set the panel path with session_id as URL parameter
    await (chrome as any).sidePanel.setOptions({
      tabId: tab.id,
      path: `src/panel/index.html?session_id=${sessionId}`,
      enabled: true
    });

    log("Panel opened with session_id:", sessionId);
    sendResponse({ success: true });
  } catch (error) {
    log("Error opening panel:", error);
    sendResponse({ success: false, error: String(error) });
  }
}
