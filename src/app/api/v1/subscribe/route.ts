// ============================================================
// Life with AI: sign-up for new pieces by email
// ============================================================
// POST /api/v1/subscribe  { email, topics?: string[], website?: string, source?: string }
//
// - Email is the only required field. Topics, if sent, must be among the six verbs.
// - `website` is a honeypot: people never see it, so a filled one is dropped quietly.
// - Bodies over MAX_BODY bytes are refused.
// - Stored in Netlify Blobs, keyed by a hash of the email, so a second sign-up with the same address
//   merges its topics into the first. Store "signups" on the live site; deploy previews and branch
//   deploys write to "signups-preview". (The old site's "subscribers" store is left as it was.)
// - In production with no durable store, it answers 503 rather than "you're on the list".
// - The reply is the same whether the address was new or already on the list, and it never
//   echoes the address back: nothing personal goes out in a response.
// - In local dev (no Netlify environment) storage falls back to an in-memory map that is lost
//   when the server stops (see src/lib/storage.ts).

import crypto from 'crypto';
import { getStore, hasDurableStore, setJSON } from '@/lib/storage';
import { TOPIC_IDS, type TopicId } from '@/lib/topics';

export const dynamic = 'force-dynamic';

// Netlify sets CONTEXT to production, deploy-preview or branch-deploy.
const SIGNUPS_STORE =
  process.env.CONTEXT && process.env.CONTEXT !== 'production' ? 'signups-preview' : 'signups';
const MAX_BODY = 2048; // bytes
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SOURCE_RE = /^[a-z0-9-]{1,40}$/;

interface StoredSubscription {
  id: string;
  email: string;
  topics: TopicId[]; // empty = everything
  subscribed_at: string;
  updated_at: string;
  source: string; // where the form was sent from, e.g. "site:home", "site:topic-making"
  confirmed: boolean; // no confirmation step yet
}

function reply(body: Record<string, unknown>, status: number): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}

const fail = (message: string, status = 400) => reply({ ok: false, error: message }, status);

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production' && !hasDurableStore()) {
    return fail('Sign-up is not available right now', 503);
  }

  const declared = Number(request.headers.get('content-length') ?? '0');
  if (declared > MAX_BODY) return fail('Request too large', 413);

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail('Could not read the request');
  }
  if (Buffer.byteLength(raw, 'utf8') > MAX_BODY) return fail('Request too large', 413);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return fail('Invalid JSON in request body');
  }

  // Honeypot: answer as if it worked, store nothing.
  if (typeof body.website === 'string' && body.website.trim() !== '') {
    return reply({ ok: true }, 200);
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return fail('A valid email address is required');
  }

  const sent = body.topics === undefined ? [] : body.topics;
  if (!Array.isArray(sent) || sent.length > TOPIC_IDS.length) return fail('Topics must be a list of topic ids');
  const topics: TopicId[] = [];
  for (const t of sent) {
    if (typeof t !== 'string' || !TOPIC_IDS.includes(t as TopicId)) return fail('Unknown topic');
    if (!topics.includes(t as TopicId)) topics.push(t as TopicId);
  }

  const from = typeof body.source === 'string' && SOURCE_RE.test(body.source) ? body.source : 'api';
  const source = `site:${from}`;

  const id = hashEmail(email);
  const now = new Date().toISOString();

  try {
    const store = getStore(SIGNUPS_STORE);
    const existing = await store.get(id);
    let subscription: StoredSubscription;
    if (existing) {
      const prev = JSON.parse(existing) as Partial<StoredSubscription>;
      const prevTopics = Array.isArray(prev.topics) ? prev.topics : [];
      subscription = {
        id,
        email,
        topics: [...new Set([...prevTopics, ...topics])],
        subscribed_at: prev.subscribed_at ?? now,
        updated_at: now,
        source: prev.source ?? source,
        confirmed: prev.confirmed ?? false,
      };
    } else {
      subscription = { id, email, topics, subscribed_at: now, updated_at: now, source, confirmed: false };
    }
    await setJSON(SIGNUPS_STORE, id, subscription);
  } catch {
    return fail('Could not save right now', 503);
  }

  return reply({ ok: true }, 200);
}

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email).digest('hex').substring(0, 16);
}
