const MAX_ENTRIES = 100;
const TTL_MS = 60 * 60 * 1000; // 1 hour

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

class LRUCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  private key(raw: string): string {
    return raw.toLowerCase().trim().replace(/\s+/g, "-");
  }

  get(rawKey: string): T | null {
    const k = this.key(rawKey);
    const entry = this.store.get(k);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(k);
      return null;
    }
    // Refresh to end of Map (LRU touch)
    this.store.delete(k);
    this.store.set(k, entry);
    return entry.data;
  }

  set(rawKey: string, data: T): void {
    const k = this.key(rawKey);
    // Evict oldest when at capacity
    if (this.store.size >= MAX_ENTRIES) {
      const oldest = this.store.keys().next().value;
      if (oldest) this.store.delete(oldest);
    }
    this.store.set(k, { data, expiresAt: Date.now() + TTL_MS });
  }

  size(): number {
    return this.store.size;
  }
}

// Singleton — persists across requests in the same Node.js process
export const analysisCache = new LRUCache<any>();
