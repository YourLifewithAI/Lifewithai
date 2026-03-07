// ============================================================
// Arcology Knowledge Node — Feedback API
// ============================================================
// POST /api/v1/feedback — Submit structured feedback
// GET  /api/v1/feedback — List accumulated feedback
//
// No authentication required. Rate-limited by IP.
// Stored in Netlify Blobs ('feedback' store).

import { type NextRequest } from 'next/server';
import crypto from 'crypto';
import { apiResponse, errorResponse } from '@/lib/api-helpers';
import { setJSON, getAll } from '@/lib/storage';

const FEEDBACK_STORE = 'feedback';

const VALID_CATEGORIES = [
  'bug',
  'suggestion',
  'ux',
  'content',
  'api',
  'accessibility',
  'other',
] as const;

type FeedbackCategory = (typeof VALID_CATEGORIES)[number];

interface StoredFeedback {
  id: string;
  source: string;
  category: FeedbackCategory;
  page_url?: string;
  message: string;
  metadata?: Record<string, unknown>;
  ip_hash: string;
  user_agent?: string;
  created_at: string;
}

// Rate limit: 20/hour, 100/day per IP
const rateLimits = new Map<string, { count: number; reset: number }>();

function checkRate(ipHash: string): boolean {
  const now = Date.now();
  const key = `feedback:${ipHash}`;
  const entry = rateLimits.get(key);

  if (!entry || now > entry.reset) {
    rateLimits.set(key, { count: 1, reset: now + 3600_000 });
    return true;
  }

  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

// --- POST: Submit feedback ---

export async function POST(request: NextRequest) {
  const ipHash = hashIP(request);

  if (!checkRate(ipHash)) {
    return errorResponse('Rate limit exceeded. Max 20 feedback submissions per hour.', 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400);
  }

  // Validate required fields
  if (!body.source || typeof body.source !== 'string') {
    return errorResponse('Missing required field: source (string — your agent name or model)', 400);
  }
  if (!body.category || !VALID_CATEGORIES.includes(body.category as FeedbackCategory)) {
    return errorResponse(
      `Missing or invalid field: category. Must be one of: ${VALID_CATEGORIES.join(', ')}`,
      400
    );
  }
  if (!body.message || typeof body.message !== 'string') {
    return errorResponse('Missing required field: message (string)', 400);
  }
  if (body.message.length > 5000) {
    return errorResponse('Message too long. Max 5000 characters.', 400);
  }

  const feedback: StoredFeedback = {
    id: crypto.randomUUID(),
    source: (body.source as string).slice(0, 200),
    category: body.category as FeedbackCategory,
    page_url: body.page_url ? String(body.page_url).slice(0, 500) : undefined,
    message: (body.message as string).slice(0, 5000),
    metadata: body.metadata as Record<string, unknown> | undefined,
    ip_hash: ipHash,
    user_agent: request.headers.get('user-agent')?.slice(0, 500) || undefined,
    created_at: new Date().toISOString(),
  };

  await setJSON(FEEDBACK_STORE, feedback.id, feedback);

  return apiResponse(
    {
      message: 'Feedback received. Thank you.',
      feedback_id: feedback.id,
      category: feedback.category,
      created_at: feedback.created_at,
    },
    202
  );
}

// --- GET: List feedback ---

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const since = searchParams.get('since');
  const limitParam = searchParams.get('limit');
  const limit = Math.min(parseInt(limitParam || '50', 10), 200);

  let items = await getAll<StoredFeedback>(FEEDBACK_STORE);

  // Filter by category
  if (category && VALID_CATEGORIES.includes(category as FeedbackCategory)) {
    items = items.filter(f => f.category === category);
  }

  // Filter by date
  if (since) {
    const sinceDate = new Date(since);
    if (!isNaN(sinceDate.getTime())) {
      items = items.filter(f => new Date(f.created_at) >= sinceDate);
    }
  }

  // Sort newest first
  items.sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Apply limit
  items = items.slice(0, limit);

  // Strip IP hashes from public response
  const sanitized = items.map(({ ip_hash: _ip, ...rest }) => rest);

  // Build response with no-cache (feedback is dynamic state, not static content)
  const responseData = {
    feedback: sanitized,
    total: sanitized.length,
    filters: {
      category: category || 'all',
      since: since || 'all',
      limit,
    },
  };

  return Response.json(
    { ...responseData },
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

// --- Helpers ---

function hashIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}
