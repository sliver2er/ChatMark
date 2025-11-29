export const log = (...args: any[]) => {
  console.log("[ChatMark]", ...args);
};

export const error = (...args: any[]) => {
  console.error("[ChatMark:ERROR]", ...args);
};

export const warn = (...args: any[]) => {
  console.warn("[ChatMark:WARN]", ...args);
};

export const info = (...args: any[]) => {
  console.info("[ChatMark:INFO]", ...args);
};