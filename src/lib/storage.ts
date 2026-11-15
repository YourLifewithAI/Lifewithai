// ============================================================
// Life with AI: storage for the sign-up form
// ============================================================
// Netlify Blobs on Netlify. In local dev (no Netlify environment) an in-memory map that is lost when the
// server stops. The sign-up route refuses to answer "you're on the list" in production unless the
// store is durable (see hasDurableStore).

class InMemoryStore {
  private data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }
}

export interface BlobStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}

const storeCache = new Map<string, BlobStore>();

/** True when Netlify Blobs is available, so a write outlives this process. */
export function hasDurableStore(): boolean {
  return !!(process.env.NETLIFY || process.env.NETLIFY_DEV || process.env.DEPLOY_URL);
}

/** A named blob store: Netlify Blobs on Netlify, an in-memory map elsewhere. */
export function getStore(name: string): BlobStore {
  const cached = storeCache.get(name);
  if (cached) return cached;

  let store: BlobStore;
  if (hasDurableStore()) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getStore: getNetlifyStore } = require('@netlify/blobs');
    store = getNetlifyStore(name) as BlobStore;
  } else {
    store = new InMemoryStore();
  }

  storeCache.set(name, store);
  return store;
}

/** Store a JSON value under a key. */
export async function setJSON<T>(storeName: string, key: string, value: T): Promise<void> {
  await getStore(storeName).set(key, JSON.stringify(value));
}
