# ChatMark

Bookmark specific parts of your LLM conversations. Highlight text, save it, find it later.

![Demo](ChatMark_descriptions/demoVideo_v1.0.0.mp4)

## Supported Platforms

- ChatGPT (chatgpt.com)
- Google Gemini (gemini.google.com)
- Claude (claude.ai)

## Install

```bash
# Clone and install
git clone https://github.com/user/chatmark.git
cd chatmark
yarn install

# Production build
yarn build
```

Load as unpacked extension in Chrome:

1. Go to `chrome://extensions`
2. Enable Developer mode
3. Click "Load unpacked"
4. Select the `dist` folder

## Usage

1. Select text in any conversation
2. Click the bookmark button that appears
3. Name it and pick a folder (optional)
4. Access bookmarks from the sidebar or popup

## Stack

React 18, TypeScript, Zustand, Mantine v8, Vite, @crxjs/vite-plugin

## License

Apache 2.0
