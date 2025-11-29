import { routeMessage } from "./router/messageRouter";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  routeMessage(msg, sendResponse);
  return true;  // allow async
});
