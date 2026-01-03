import { SessionMeta } from "@/types";

const SESSION_KEY_PREFIX = "chatmark.sessions.";

const key = (session_id: string) => {
  return SESSION_KEY_PREFIX + session_id;
};

export async function getSessionMeta(session_id: string): Promise<SessionMeta | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get([key(session_id)], (result) => {
      const meta = result[key(session_id)] || null;
      if (meta) {
        // Date 복원
        meta.updated_at = new Date(meta.updated_at);
      }
      resolve(meta);
    });
  });
}

export async function saveSessionMeta(meta: SessionMeta): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [key(meta.session_id)]: meta }, () => {
      resolve(true);
    });
  });
}

export async function getAllSessionMetas(): Promise<SessionMeta[]> {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      const allKeys = Object.keys(items);
      const sessionKeys = allKeys.filter((k) => k.startsWith(SESSION_KEY_PREFIX));

      const metas: SessionMeta[] = sessionKeys.map((k) => {
        const meta = items[k];
        return {
          ...meta,
          updated_at: new Date(meta.updated_at),
        };
      });

      // 최신순 정렬
      metas.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
      resolve(metas);
    });
  });
}

export async function deleteSessionMeta(session_id: string): Promise<boolean> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([key(session_id)], () => {
      resolve(true);
    });
  });
}
