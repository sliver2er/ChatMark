import { routeMessage } from "./router/messageRouter";

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  routeMessage(msg, sendResponse, sender);
  return true;  
});
