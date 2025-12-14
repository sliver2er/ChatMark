import { create } from "zustand";
import { getSessionId } from "@/shared/functions/getSessionId";

interface SessionStore {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  syncSessionId: () => void;
}

let urlObserver: MutationObserver | null = null;
let previousUrl = window.location.href;

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionId: getSessionId(),

  setSessionId: (session_id) => set({ sessionId: session_id }),

  syncSessionId: () => {
    const currentSessionId = getSessionId();
    const storeSessionId = get().sessionId;

    if (currentSessionId !== storeSessionId) {
      set({ sessionId: currentSessionId });
    }
  },
}));

function startUrlObserver() {
  if (urlObserver) return;

  const syncSession = () => {
    const currentUrl = window.location.href;
    if (currentUrl !== previousUrl) {
      previousUrl = currentUrl;
      useSessionStore.getState().syncSessionId();
    }
  };

  // MutationObserver: DOM 변경 감지 (SPA 라우팅)
  urlObserver = new MutationObserver(syncSession);

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // popstate: 브라우저 뒤로/앞으로 버튼
  window.addEventListener("popstate", syncSession);

  // History API 감지
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function (...args) {
    originalPushState.apply(this, args);
    syncSession();
  };

  history.replaceState = function (...args) {
    originalReplaceState.apply(this, args);
    syncSession();
  };
}

export function stopUrlObserver() {
  if (urlObserver) {
    urlObserver.disconnect();
    urlObserver = null;
  }
}

startUrlObserver();
