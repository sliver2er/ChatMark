# ChatMark API Reference

## Types

### LLMProvider

```typescript
type LLMProvider = "ChatGPT" | "Gemini" | "Claude";
```

### BookmarkItem

```typescript
interface BookmarkItem {
  id: string;                      // UUID
  bookmark_name: string;           // User-defined name
  session_id: string;              // Chat session ID
  message_id: string;              // Message element ID
  text: string;                    // Bookmarked text
  context_before: string;          // 50 chars before (for matching)
  context_after: string;           // 50 chars after (for matching)
  start?: number;                  // DOM offset (reference only)
  end?: number;                    // DOM offset (reference only)
  created_at: Date;
  note?: string;
  parent_bookmark: string | null;  // Parent folder ID (null = root)
  order: number;                   // Sort order within parent
  provider: LLMProvider;
}
```

### SessionMeta

```typescript
interface SessionMeta {
  session_id: string;
  title: string;
  updated_at: Date;
  provider: LLMProvider;
}
```

### ChatMarkSettings

```typescript
interface ChatMarkSettings {
  highlightColor: string;              // Hex color for highlights
  scrollBehavior: "instant" | "smooth";
  colorScheme: "dark" | "light";
  language?: "en" | "ko";
}
```

## APIs

All APIs communicate via `chrome.runtime.sendMessage`. Use the wrapper functions in `src/api/`.

### bookmarkApi

```typescript
import { bookmarkApi } from "@/api/bookmarkApi";

// Get all bookmarks for a session
const bookmarks = await bookmarkApi.getAll(sessionId);

// Add bookmark
await bookmarkApi.add(bookmarkItem);

// Delete single bookmark
await bookmarkApi.delete(sessionId, bookmarkId);

// Delete all bookmarks in a session
await bookmarkApi.deleteSession(sessionId);

// Delete all bookmarks globally
await bookmarkApi.deleteAll();

// Update single bookmark
await bookmarkApi.update(sessionId, bookmarkId, { bookmark_name: "New Name" });

// Batch update (for reordering)
await bookmarkApi.updateMany(sessionId, [
  { id: "abc", updates: { order: 0 } },
  { id: "def", updates: { order: 1 } }
]);
```

### sessionApi

```typescript
import { sessionApi } from "@/api/sessionApi";

// Get all sessions
const sessions = await sessionApi.getAll();

// Get single session metadata
const meta = await sessionApi.getMeta(sessionId);

// Save/update session metadata
await sessionApi.saveMeta({ session_id, title, updated_at, provider });

// Delete session (removes bookmarks too)
await sessionApi.delete(sessionId);
```

## Message Types

Used internally for background script communication:

```typescript
enum MessageType {
  // Bookmarks
  Add = "BOOKMARK_ADD",
  GetAll = "BOOKMARK_GET_ALL",
  Delete = "BOOKMARK_DELETE",
  DeleteAll = "BOOKMARK_DELETE_ALL",
  DeleteSession = "BOOKMARK_DELETE_SESSION",
  Update = "BOOKMARK_UPDATE",
  UpdateMany = "BOOKMARKS_UPDATE",
  Navigate = "BOOKMARK_NAVIGATE",
  
  // Settings
  SettingsGet = "SETTINGS_GET",
  SettingsUpdate = "SETTINGS_UPDATE",
  
  // Sessions
  SessionGetAll = "SESSION_GET_ALL",
  SessionSaveMeta = "SESSION_SAVE_META",
  SessionGetMeta = "SESSION_GET_META",
  SessionDelete = "SESSION_DELETE",
  
  // UI
  PanelRefresh = "PANEL_REFRESH",
}
```

## LLM Provider Strategy

Interface for adding new provider support:

```typescript
interface LLMProviderStrategy {
  readonly provider: LLMProvider;

  // Theme
  detectTheme(): "dark" | "light";
  watchTheme(callback: (theme: "dark" | "light") => void): () => void;

  // Session
  getSessionId(): string | null;
  isInChatSession(): boolean;
  getSessionTitle(): string | null;

  // DOM
  getMessageElementSelector(): string;
  getScrollContainerSelector(): string;
  findMessageId(element: Element): string | null;

  // Validation
  isValidChatSelection(range: Range): boolean;

  // Navigation
  buildSessionUrl(sessionId: string): string;
}
```

### Provider Implementations

- `ChatGPTProvider` - `src/shared/llm/providers/chatgpt.ts`
- `GeminiProvider` - `src/shared/llm/providers/gemini.ts`
- `ClaudeProvider` - `src/shared/llm/providers/claude.ts`

## Storage Schema

Data stored in `chrome.storage.local`:

```
chatmark_bookmarks_{session_id}: BookmarkItem[]
chatmark_sessions: SessionMeta[]
chatmark_settings: ChatMarkSettings
```
