import { create } from "zustand";
import { useProviderStore } from "./useProviderStore";

interface SessionStore {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
  syncSessionId: () => void;
}

let urlObserver: MutationObserver | null = null;
let previousUrl = window.location.href;

const getSessionIdFromProvider = () => {
  const provider = useProviderStore.getState().provider;
  return provider?.getSessionId() ?? null;
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  sessionId: null,

  setSessionId: (session_id) => set({ sessionId: session_id }),

  syncSessionId: () => {
    const currentSessionId = getSessionIdFromProvider();
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

  urlObserver = new MutationObserver(syncSession);

  urlObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  window.addEventListener("popstate", syncSession);

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

export function initSessionStore() {
  useSessionStore.getState().syncSessionId();
  startUrlObserver();
}
