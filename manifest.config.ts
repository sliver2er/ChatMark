import { defineManifest } from "@crxjs/vite-plugin";

export default defineManifest({
  manifest_version: 3,
  name: "ChatMark",
  version: "1.0.0",
  action: {
    default_popup: "src/popup/index.html"
  },
  permissions: ["storage", "activeTab", "scripting"],
  background: {
    service_worker: "src/background/index.ts",
    type: "module"
  },
  content_scripts: [
    {
      matches: [
        "https://chat.openai.com/*",
        "https://chatgpt.com/*"
      ],
      js: ["src/scripts/index.tsx"]
    }
  ],
});
