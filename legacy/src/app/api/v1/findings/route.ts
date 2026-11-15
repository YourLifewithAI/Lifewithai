// ============================================================
// Arcology Knowledge Node — Findings API
// ============================================================
// POST /api/v1/findings — Submit a discovered inconsistency
// GET  /api/v1/findings — List submitted findings
//
// Part of the reasoning benchmark: agents explore the knowledge
// base, discover inconsistencies, and report them here.
// Stored in Netlify Blobs ('findings' store).

import { type NextRequest } from 'next/server';
import crypto from 'crypto';
import { apiResponse, errorResponse } from '@/lib/api-helpers';
import { setJSON, getAll } from '@/lib/storage';

const FINDINGS_STORE = 'findings';

interface StoredFinding {
  id: string;
  source: string;
  model?: string;
  finding_type: 'parameter-conflict' | 'assumption-contradiction' | 'reference-gap' | 'unit-mismatch' | 'other';
  entry_a: string;
  entry_b?: string;
  description: string;
  parameter_name?: string;
  value_a?: string;
  value_b?: string;
  severity: 'low' | 'medium' | 'high';
  ip_hash: string;
  created_at: string;
}

const VALID_TYPES = [
  'parameter-conflict',
  'assumption-contradiction',
  'reference-gap',
  'unit-mismatch',
  'other',
] as const;

const VALID_SEVERITIES = ['low', 'medium', 'high'] as const;

// Rate limit: 30/hour per IP
const rateLimits = new Map<string, { count: number; reset: number }>();

function checkRate(identifier: string, maxPerHour: number = 30): boolean {
  const now = Date.now();
  const entry = rateLimits.get(identifier);

  if (!entry || now > entry.reset) {
    rateLimits.set(identifier, { count: 1, reset: now + 3600_000 });
    return true;
  }

  if (entry.count >= maxPerHour) return false;
  entry.count++;
  return true;
}

// --- POST: Submit a finding ---

export async function POST(request: NextRequest) {
  const ipHash = hashIP(request);

  if (!checkRate(ipHash)) {
    return errorResponse('Rate limit exceeded. Max 30 findings per hour.', 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400);
  }

  // Validate required fields
  if (!body.source || typeof body.source !== 'string') {
    return errorResponse('Missing required field: source (string — agent name or model identifier)', 400);
  }
  if (!body.finding_type || !VALID_TYPES.includes(body.finding_type as typeof VALID_TYPES[number])) {
    return errorResponse(
      `Missing or invalid field: finding_type. Must be one of: ${VALID_TYPES.join(', ')}`,
      400
    );
  }
  if (!body.entry_a || typeof body.entry_a !== 'string') {
    return errorResponse('Missing required field: entry_a (string — entry ID where inconsistency was found)', 400);
  }
  if (!body.description || typeof body.description !== 'string') {
    return errorResponse('Missing required field: description (string — explain the inconsistency)', 400);
  }
  if (body.severity && !VALID_SEVERITIES.includes(body.severity as typeof VALID_SEVERITIES[number])) {
    return errorResponse(
      `Invalid field: severity. Must be one of: ${VALID_SEVERITIES.join(', ')}`,
      400
    );
  }

  const finding: StoredFinding = {
    id: crypto.randomUUID(),
    source: (body.source as string).slice(0, 200),
    model: body.model ? String(body.model).slice(0, 100) : undefined,
    finding_type: body.finding_type as StoredFinding['finding_type'],
    entry_a: (body.entry_a as string).slice(0, 300),
    entry_b: body.entry_b ? String(body.entry_b).slice(0, 300) : undefined,
    description: (body.description as string).slice(0, 2000),
    parameter_name: body.parameter_name ? String(body.parameter_name).slice(0, 200) : undefined,
    value_a: body.value_a ? String(body.value_a).slice(0, 200) : undefined,
    value_b: body.value_b ? String(body.value_b).slice(0, 200) : undefined,
    severity: (body.severity as StoredFinding['severity']) || 'medium',
    ip_hash: ipHash,
    created_at: new Date().toISOString(),
  };

  await setJSON(FINDINGS_STORE, finding.id, finding);

  return apiResponse(
    {
      message: 'Finding recorded. Thank you for your analysis.',
      finding_id: finding.id,
      finding_type: finding.finding_type,
      created_at: finding.created_at,
    },
    202
  );
}

// --- GET: List findings ---

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const findingType = searchParams.get('type');
  const limitParam = searchParams.get('limit');
  const limit = Math.min(parseInt(limitParam || '50', 10), 200);

  let items = await getAll<StoredFinding>(FINDINGS_STORE);

  // Filter by type
  if (findingType && VALID_TYPES.includes(findingType as typeof VALID_TYPES[number])) {
    items = items.filter(f => f.finding_type === findingType);
  }

  // Sort newest first
  items.sort((a, b) => b.created_at.localeCompare(a.created_at));

  // Apply limit
  items = items.slice(0, limit);

  // Strip IP hashes from public response
  const sanitized = items.map(({ ip_hash: _ip, ...rest }) => rest);

  // Aggregate by source for leaderboard
  const leaderboard: Record<string, number> = {};
  for (const item of items) {
    const key = item.model ? `${item.source} (${item.model})` : item.source;
    leaderboard[key] = (leaderboard[key] || 0) + 1;
  }

  return apiResponse({
    findings: sanitized,
    total: sanitized.length,
    leaderboard: Object.entries(leaderboard)
      .map(([agent, count]) => ({ agent, findings_count: count }))
      .sort((a, b) => b.findings_count - a.findings_count),
    filters: {
      type: findingType || 'all',
      limit,
    },
  });
}

// --- Helpers ---

function hashIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}
