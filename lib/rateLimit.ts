const WINDOW_MS = 60_000; // 1 minute
const MAX_PER_WINDOW = 10;

interface Window {
  count: number;
  start: number;
}

const windows = new Map<string, Window>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
} {
  const now = Date.now();
  const win = windows.get(ip);

  if (!win || now - win.start > WINDOW_MS) {
    windows.set(ip, { count: 1, start: now });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1, resetInMs: WINDOW_MS };
  }

  if (win.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetInMs: WINDOW_MS - (now - win.start) };
  }

  win.count++;
  return {
    allowed: true,
    remaining: MAX_PER_WINDOW - win.count,
    resetInMs: WINDOW_MS - (now - win.start),
  };
}
