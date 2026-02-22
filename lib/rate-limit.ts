interface Entry {
  count: number;
  resetAt: number;
}

const MAX_ENTRIES = 10_000;
const store = new Map<string, Entry>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();

  // Clean up expired entries on each call
  for (const [k, v] of store) {
    if (v.resetAt <= now) store.delete(k);
  }

  // Prevent unbounded growth from spoofed keys
  if (store.size > MAX_ENTRIES) {
    store.clear();
  }

  const entry = store.get(key);
  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count++;
  return true;
}
