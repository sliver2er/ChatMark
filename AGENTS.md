# AGENTS.md - ChatMark 개발 가이드라인

## 프로젝트 개요

ChatMark는 ChatGPT 대화 내용을 북마크하고 관리하는 Chrome 확장 프로그램입니다.

**기술 스택:** React 18, TypeScript, Zustand, Mantine v8, react-i18next, Vite + @crxjs/vite-plugin

## 빌드/린트/테스트 명령어

```bash
# 개발
yarn dev                 # 개발 서버 시작

# 빌드
yarn build               # 프로덕션 빌드
yarn preview             # 프로덕션 빌드 미리보기

# 테스트
yarn test                # 전체 테스트 실행 (jest)
yarn test:watch          # 워치 모드로 테스트 실행
yarn test path/to/test   # 단일 테스트 파일 실행
yarn test --testNamePattern="테스트명"  # 특정 테스트만 실행

# 린트 (스크립트 미정의, 수동 실행)
yarn eslint .            # 전체 파일 린트
yarn eslint src/         # src 디렉토리 린트
yarn eslint --fix .      # 자동 수정
```

## 코드 스타일 가이드라인

### Import 순서

다음 순서로 import하고 그룹 사이에 빈 줄 추가:
1. 외부 라이브러리 (React, Mantine 등)
2. 내부 feature/component
3. 공유 유틸리티/훅 (`@/shared/...`)
4. 스토어 (`@/stores/...`)
5. 타입 (`@/types`)
6. 설정 파일 (`@/config/...`)

```typescript
// 예시
import { Box, Text, ActionIcon } from "@mantine/core";
import { IconBookmark } from "@tabler/icons-react";

import { NavigateApi } from "@/api/NavigateApi";
import { useThemeColors } from "@/shared/hooks/useThemeColors";
import { useBookmarkStore } from "@/stores/useBookmarkStore";
import { BookmarkItem } from "@/types";
```

### Auto-Import (중요!)

React 훅은 `unplugin-auto-import`로 자동 import됩니다. **수동으로 import하지 마세요:**
- `useState`, `useEffect`, `useMemo`, `useCallback`, `useRef`, `useContext` 등
- 전체 목록은 `src/auto-imports.d.ts` 참고

```typescript
// 올바른 방법 - import 없이 바로 사용
const [value, setValue] = useState(false);
const memoized = useMemo(() => expensive(), [deps]);

// 잘못된 방법 - import 불필요!
import { useState } from "react";
```

### Path Alias

`src/` 내부 import는 항상 `@/` alias 사용:
```typescript
import { BookmarkItem } from "@/types";        // 좋음
import { BookmarkItem } from "../../types";    // 피하기
```

### 네이밍 컨벤션

| 타입 | 컨벤션 | 예시 |
|------|--------|------|
| 컴포넌트 | PascalCase | `BookmarkBtn`, `NavigationFolderTreeItem` |
| 훅 | camelCase + `use` 접두사 | `useThemeColors`, `useBookmarkStore` |
| 컴포넌트 파일 | PascalCase | `BookmarkSaveMenu.tsx` |
| 유틸리티 파일 | camelCase | `bookmarkTreeUtils.ts` |
| 상수 | SCREAMING_SNAKE_CASE | `SIDEBAR_MIN_WIDTH`, `DEBOUNCE_DELAY` |
| 타입/인터페이스 | PascalCase | `BookmarkItem`, `ChatMarkSettings` |
| Enum | PascalCase (타입 & 멤버) | `MessageType.Add` |
| 스토어 훅 | `use[Name]Store` | `useBookmarkStore`, `useSessionStore` |

### 컴포넌트 구조

```typescript
// 1. Props 인터페이스를 컴포넌트 위에 정의
interface ComponentProps {
  bookmark: BookmarkItem;
  onSelect?: (bookmark: BookmarkItem) => void;
}

// 2. 화살표 함수 + props 구조분해
export const Component = ({ bookmark, onSelect }: ComponentProps) => {
  // 3. 훅 먼저
  const colors = useThemeColors();
  const [state, setState] = useState(false);

  // 4. 메모이제이션된 값
  const computed = useMemo(() => /* ... */, [deps]);

  // 5. 콜백
  const handleClick = useCallback(() => /* ... */, [deps]);

  // 6. Effect
  useEffect(() => { /* ... */ }, [deps]);

  // 7. 렌더링
  return <Box>...</Box>;
};
```

### 상태 관리 (Zustand)

```typescript
// 패턴: 인터페이스 먼저, 그 다음 스토어 생성
interface BookmarkStore {
  bookmarks: BookmarkItem[];
  loading: boolean;
  setBookmarks: (bookmarks: BookmarkItem[]) => void;
  loadBookmarks: () => Promise<void>;
}

export const useBookmarkStore = create<BookmarkStore>((set, get) => ({
  bookmarks: [],
  loading: true,
  setBookmarks: (bookmarks) => set({ bookmarks }),
  loadBookmarks: async () => {
    set({ loading: true });
    // ... 비동기 로직
    set({ bookmarks: list, loading: false });
  },
}));
```

### 타입 안전성

Zod 스키마로 런타임 검증하고 `z.infer`로 TypeScript 타입 추출:
```typescript
export const BookmarkItemSchema = z.object({
  id: z.string(),
  bookmark_name: z.string(),
  // ...
});
export type BookmarkItem = z.infer<typeof BookmarkItemSchema>;
```

### 다국어 (i18n)

**모든 사용자 노출 텍스트는 반드시 `t()` 함수 사용:**
```typescript
import { useTranslation } from "react-i18next";

const { t } = useTranslation();
return <Text>{t("sidebar.title")}</Text>;
```

**항상 두 번역 파일 모두 업데이트:**
- `src/config/en.json` (영어)
- `src/config/ko.json` (한국어)

### 에러 처리

`@/shared/logger`의 커스텀 로거 사용:
```typescript
import { error, log, warn, info } from "@/shared/logger";

try {
  await someAsyncOperation();
} catch (err) {
  error("Failed to perform operation:", err);
  throw err; // 호출자가 처리해야 할 때만 re-throw
}
```

메시지 응답은 `{ success: boolean, error?: string }` 패턴 사용.

### 테마

`useThemeColors()` 훅으로 일관된 테마 적용:
```typescript
const colors = useThemeColors();
<Box style={{ backgroundColor: colors.bookmarkItem.bg }}>
```

### UI 컴포넌트

- Mantine 컴포넌트 사용 (`Box`, `Text`, `ActionIcon`, `Stack`, `Group` 등)
- Tabler 아이콘 사용 (`@tabler/icons-react`)

## 프로젝트 구조

```
src/
├── api/                    # Chrome 메시지 패싱 API 레이어
├── background/             # 서비스 워커 (백그라운드 스크립트)
│   ├── repository/         # Chrome 스토리지 데이터 접근
│   ├── router/             # 메시지 라우팅
│   └── services/           # 비즈니스 로직
├── config/                 # i18n 번역 파일 (en.json, ko.json)
├── scripts/                # 컨텐츠 스크립트
│   └── features/           # 기능 모듈 (Sidebar, BookmarkPopup 등)
├── shared/                 # 공유 유틸리티, 훅, 로거, 테마
├── stores/                 # Zustand 스토어
├── types/                  # TypeScript 타입 및 Zod 스키마
└── utils/                  # 유틸리티 함수
```

## Chrome 확장 프로그램 패턴

- **Manifest V3**, 권한: `storage`, `activeTab`
- 컨텐츠 스크립트 실행 대상: `chat.openai.com/*`, `chatgpt.com/*`
- 컨텐츠 스크립트 <-> 백그라운드 통신: `chrome.runtime.sendMessage` 사용
- 모든 스토리지 작업은 백그라운드 스크립트에서 메시지 라우팅으로 처리

## TypeScript 설정

- Strict 모드 활성화
- Target: ES2020, Module: ESNext
- JSX: react-jsx (JSX에 React import 불필요)
- Chrome 타입 포함 (`@types/chrome`)

## 핵심 규칙

1. **React 훅은 import 불필요** - 전역 auto-import
2. **텍스트는 항상 `t()` 사용** - en.json, ko.json 둘 다 업데이트
3. **Mantine 컴포넌트 사용** - `useThemeColors`로 테마 적용
4. **상태 관리는 Zustand** - `useSessionStore`, `useBookmarkStore`
