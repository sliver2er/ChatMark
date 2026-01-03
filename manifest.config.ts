import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "ChatMark",
  version: "1.1.0",
  icons: {
    "16": "src/assets/icons/icon-16.png",
    "48": "src/assets/icons/icon-48.png",
    "128": "src/assets/icons/icon-128.png",
  },
  action: {
    default_popup: "src/popup/index.html",
  },
  permissions: ["storage", "activeTab"],
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  content_scripts: [
    {
      matches: ["https://chat.openai.com/*", "https://chatgpt.com/*"],
      js: ["src/scripts/index.tsx"],
    },
  ],
});
