// ============================================================
// Arcology Knowledge Node — Proposals API
// ============================================================
// POST  /api/v1/proposals — Submit a new entry proposal
// GET   /api/v1/proposals — List proposals (filtered by status)
// PATCH /api/v1/proposals — Update proposal status (review workflow)
//
// Authentication (POST):
//   - With API key in Authorization header → agent submission
//   - Without API key → provisional human submission (rate-limited by IP)
// Authentication (PATCH):
//   - Currently open (steward auth deferred until OAuth ships)
// Authentication (GET):
//   - Public (read-only)

import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { apiResponse, errorResponse, jsonLdContext } from '@/lib/api-helpers';
import { validateApiKey, checkRateLimit } from '@/lib/auth';
import { authOptions } from '@/lib/auth-config';
import { API_KEY_PREFIX, DEFAULT_RATE_LIMITS } from '@/lib/auth-types';
import type { RegisteredAgent, SubmissionProvenance, ProposalStatus } from '@/lib/auth-types';
import { getAll, setJSON, getJSON } from '@/lib/storage';

const AGENTS_STORE = 'agents';
const PROPOSALS_STORE = 'proposals';

// Full proposal record (provenance + content)
interface StoredProposal {
  provenance: SubmissionProvenance;
  title: string;
  domain: string;
  subdomain: string;
  entry_type: string;
  summary: string;
  content: string;
  kedl?: number;
  confidence?: number;
  tags?: string[];
  assumptions?: string[];
  open_questions?: string[];
  parameters?: unknown[];
  citations?: unknown[];
  cross_references?: unknown[];
}

// --- POST: Submit a proposal ---

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const ipHash = hashRequestIP(request);
  const userAgent = request.headers.get('user-agent') || undefined;

  let authorType: 'human' | 'agent';
  let authorId: string;
  let submissionPath: 'web_form' | 'api';

  if (authHeader) {
    // --- Agent path: API key authentication ---
    const key = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!key.startsWith(API_KEY_PREFIX)) {
      return errorResponse('Invalid API key format. Keys must start with "arc_ak_"', 401);
    }

    const agents = await getAll<RegisteredAgent>(AGENTS_STORE);
    const agent = validateApiKey(key, agents);

    if (!agent) {
      return errorResponse('Invalid or revoked API key', 401);
    }

    // Check agent rate limit
    const rateCheck = await checkRateLimit(`agent:${agent.id}`, agent.rate_limit);
    if (!rateCheck.allowed) {
      return errorResponse(
        `Rate limit exceeded. Resets at ${new Date(rateCheck.reset_at).toISOString()}`,
        429
      );
    }

    // Update agent last_used
    agent.last_used = new Date().toISOString();
    await setJSON(AGENTS_STORE, agent.id, agent);

    authorType = 'agent';
    authorId = agent.id;
    submissionPath = 'api';
  } else {
    // --- Human path: check for OAuth session first, then fall back to provisional ---
    let sessionUser: { id: string; name?: string | null } | null = null;
    try {
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        sessionUser = { id: session.user.id, name: session.user.name };
      }
    } catch {
      // Session check failed — fall through to provisional
    }

    if (sessionUser) {
      // Authenticated human — higher rate limits, proper identity
      const rateCheck = await checkRateLimit(`user:${sessionUser.id}`, DEFAULT_RATE_LIMITS.human);
      if (!rateCheck.allowed) {
        return errorResponse(
          'Too many submissions. Please wait before submitting again.',
          429
        );
      }
      authorType = 'human';
      authorId = sessionUser.id;
      submissionPath = 'web_form';
    } else {
      // Provisional (anonymous) human — IP-limited
      const rateCheck = await checkRateLimit(`ip:${ipHash}`, {
        requests_per_hour: 10,
        requests_per_day: 50,
        submissions_per_day: 10,
      });
      if (!rateCheck.allowed) {
        return errorResponse(
          'Too many submissions. Please wait before submitting again.',
          429
        );
      }
      authorType = 'human';
      authorId = 'provisional';
      submissionPath = 'web_form';
    }
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400);
  }

  // Validate required fields
  const required = ['title', 'domain', 'subdomain', 'entry_type', 'summary', 'content'];
  const missing = required.filter(f => !body[f]);
  if (missing.length > 0) {
    return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
  }

  // Use self-reported author name if provided (provisional mode)
  if (body.author_name && authorId === 'provisional') {
    authorId = `provisional:${String(body.author_name).trim()}`;
  }

  // Build provenance record
  const provenance: SubmissionProvenance = {
    submission_id: crypto.randomUUID(),
    entry_id: `${body.domain}/${body.subdomain}/${slugify(body.title as string)}`,
    submitted_at: new Date().toISOString(),
    submission_path: submissionPath,
    author_type: authorType,
    author_id: authorId,
    ip_hash: ipHash,
    user_agent: userAgent,
    status: 'submitted' as ProposalStatus,
  };

  // Build full proposal record
  const proposal: StoredProposal = {
    provenance,
    title: body.title as string,
    domain: body.domain as string,
    subdomain: body.subdomain as string,
    entry_type: body.entry_type as string,
    summary: body.summary as string,
    content: body.content as string,
    kedl: (body.kedl as number) ?? 200,
    confidence: (body.confidence as number) ?? 2,
    tags: body.tags as string[] | undefined,
    assumptions: body.assumptions as string[] | undefined,
    open_questions: body.open_questions as string[] | undefined,
    parameters: body.parameters as unknown[] | undefined,
    citations: body.citations as unknown[] | undefined,
    cross_references: body.cross_references as unknown[] | undefined,
  };

  // Persist to Blobs
  await setJSON(PROPOSALS_STORE, provenance.submission_id, proposal);

  return apiResponse(
    {
      message: 'Proposal received',
      submission_id: provenance.submission_id,
      entry_id: provenance.entry_id,
      status: provenance.status,
      author_type: provenance.author_type,
      submission_path: submissionPath,
      provenance,
    },
    202
  );
}

// --- PATCH: Update proposal status (review workflow) ---

export async function PATCH(request: NextRequest) {
  // TODO: When OAuth ships, authenticate reviewer via session or API key
  // For now, this endpoint exists for the review workflow but is open
  // In production, restrict to steward role

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400);
  }

  const { submission_id, status, review_notes } = body as {
    submission_id?: string;
    status?: ProposalStatus;
    review_notes?: string;
  };

  if (!submission_id || !status) {
    return errorResponse('Missing required fields: submission_id, status', 400);
  }

  const validTransitions: ProposalStatus[] = [
    'under_review', 'revision_requested', 'accepted', 'rejected', 'superseded'
  ];
  if (!validTransitions.includes(status)) {
    return errorResponse(
      `Invalid status transition. Must be one of: ${validTransitions.join(', ')}`,
      400
    );
  }

  // Load proposal
  const proposal = await getJSON<StoredProposal>(PROPOSALS_STORE, submission_id);
  if (!proposal) {
    return errorResponse('Proposal not found', 404);
  }

  // Get reviewer identity from session
  let reviewerId = 'system';
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      reviewerId = session.user.id;
    }
  } catch {
    // Fall back to 'system'
  }

  // Update provenance with review info
  const previousStatus = proposal.provenance.status;
  proposal.provenance.status = status;
  proposal.provenance.reviewed_at = new Date().toISOString();
  proposal.provenance.reviewed_by = reviewerId;
  if (review_notes) {
    proposal.provenance.review_notes = review_notes;
  }

  // Persist updated proposal
  await setJSON(PROPOSALS_STORE, submission_id, proposal);

  return apiResponse({
    message: `Proposal status updated: ${previousStatus} -> ${status}`,
    submission_id,
    previous_status: previousStatus,
    status,
    reviewed_at: proposal.provenance.reviewed_at,
  });
}

// --- GET: List proposals ---

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const domainFilter = searchParams.get('domain');

  const allProposals = await getAll<StoredProposal>(PROPOSALS_STORE);

  // Apply filters
  let filtered = allProposals;
  if (statusFilter) {
    filtered = filtered.filter(p => p.provenance.status === statusFilter);
  }
  if (domainFilter) {
    filtered = filtered.filter(p => p.domain === domainFilter);
  }

  // Sort by submission date (newest first)
  filtered.sort((a, b) =>
    b.provenance.submitted_at.localeCompare(a.provenance.submitted_at)
  );

  // Return summary view (not full content)
  const summaries = filtered.map(p => ({
    submission_id: p.provenance.submission_id,
    entry_id: p.provenance.entry_id,
    title: p.title,
    domain: p.domain,
    subdomain: p.subdomain,
    entry_type: p.entry_type,
    summary: p.summary,
    status: p.provenance.status,
    author_type: p.provenance.author_type,
    author_id: p.provenance.author_id,
    submitted_at: p.provenance.submitted_at,
    reviewed_at: p.provenance.reviewed_at,
    kedl: p.kedl,
    confidence: p.confidence,
  }));

  // Bypass CDN cache — proposals are dynamic (Netlify Blobs)
  return Response.json(
    { ...jsonLdContext(), proposals: summaries, total: summaries.length, filters: { status: statusFilter || 'all', domain: domainFilter || 'all' } },
    {
      headers: {
        'Content-Type': 'application/ld+json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

// --- Helpers ---

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function hashRequestIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown';
  const hash = crypto.createHash('sha256').update(ip).digest('hex');
  return hash.substring(0, 16);
}
