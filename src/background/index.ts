import { routeMessage } from "./router/messageRouter";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("[BG] onMessage received:", msg);
  routeMessage(msg, sendResponse);
  return true;  // allow async
});
