// ============================================================
// Arcology Knowledge Node — Persistence Layer
// ============================================================
// Wraps @netlify/blobs for production (Netlify Functions)
// with an in-memory fallback for local development.
//
// Usage:
//   const store = getStore('agents');
//   await store.set('agent-id', agentRecord);
//   const agent = await store.get('agent-id');
//   const all = await store.list();

// --- In-Memory Store (local dev fallback) ---

class InMemoryStore {
  private data = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.data.delete(key);
  }

  async list(): Promise<{ blobs: { key: string }[] }> {
    return { blobs: Array.from(this.data.keys()).map(key => ({ key })) };
  }
}

// --- Store Interface ---

export interface BlobStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<{ blobs: { key: string }[] }>;
}

// --- Store Cache ---

const storeCache = new Map<string, BlobStore>();

function isNetlify(): boolean {
  return !!(
    process.env.NETLIFY ||
    process.env.NETLIFY_DEV ||
    process.env.DEPLOY_URL
  );
}

/**
 * Get a named blob store. Returns Netlify Blobs in production,
 * in-memory Map in local dev.
 */
export function getStore(name: string): BlobStore {
  const cached = storeCache.get(name);
  if (cached) return cached;

  let store: BlobStore;

  if (isNetlify()) {
    // Dynamic import to avoid bundling issues in dev
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getStore: getNetlifyStore } = require('@netlify/blobs');
    store = getNetlifyStore(name) as BlobStore;
  } else {
    store = new InMemoryStore();
  }

  storeCache.set(name, store);
  return store;
}

// --- JSON Convenience Wrappers ---

/**
 * Get a JSON object from a store by key.
 */
export async function getJSON<T>(storeName: string, key: string): Promise<T | null> {
  const store = getStore(storeName);
  const raw = await store.get(key);
  if (!raw) return null;
  return JSON.parse(raw) as T;
}

/**
 * Set a JSON object in a store by key.
 */
export async function setJSON<T>(storeName: string, key: string, value: T): Promise<void> {
  const store = getStore(storeName);
  await store.set(key, JSON.stringify(value));
}

/**
 * List all keys in a store.
 */
export async function listKeys(storeName: string): Promise<string[]> {
  const store = getStore(storeName);
  const result = await store.list();
  return result.blobs.map(b => b.key);
}

/**
 * Get all JSON objects from a store.
 */
export async function getAll<T>(storeName: string): Promise<T[]> {
  const keys = await listKeys(storeName);
  const store = getStore(storeName);
  const items: T[] = [];
  for (const key of keys) {
    const raw = await store.get(key);
    if (raw) items.push(JSON.parse(raw) as T);
  }
  return items;
}

/**
 * Delete a key from a store.
 */
export async function deleteKey(storeName: string, key: string): Promise<void> {
  const store = getStore(storeName);
  await store.delete(key);
}
