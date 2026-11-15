// ============================================================
// Arcology Knowledge Node — Authentication & Authorization
// ============================================================
// Handles:
//   - Session validation (OAuth users)
//   - API key validation (registered agents)
//   - Rate limiting (per-account and per-key, persisted via Blobs)
//   - Submission provenance creation
//   - Trust score computation from proposal history
//
// To activate OAuth:
//   1. Create GitHub OAuth App: https://github.com/settings/developers
//   2. Set callback URL to: https://lifewithai.ai/api/auth/callback/github
//   3. Add to .env.local:
//        GITHUB_CLIENT_ID=...
//        GITHUB_CLIENT_SECRET=...
//        AUTH_SECRET=... (generate with: openssl rand -base64 32)

import { type NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import type {
  UserSession,
  RegisteredAgent,
  SubmissionProvenance,
  ProposalStatus,
  RateLimit,
  TrustScore,
} from './auth-types';
import { API_KEY_PREFIX, DEFAULT_TRUST_SCORE, DEFAULT_RATE_LIMITS } from './auth-types';
import { authOptions } from './auth-config';
import { getJSON, setJSON } from './storage';

const RATE_LIMIT_STORE = 'rate-limits';

// --- API Key Utilities ---

/**
 * Generate a new API key for an agent.
 * Format: arc_ak_{32 random hex chars}
 * Returns: { key: string (plaintext, show once), hash: string (store this) }
 */
export function generateApiKey(): { key: string; hash: string; prefix: string } {
  const random = crypto.randomBytes(32).toString('hex');
  const key = `${API_KEY_PREFIX}${random}`;
  const hash = hashApiKey(key);
  const prefix = key.substring(0, 12); // "arc_ak_XXXXX"
  return { key, hash, prefix };
}

/**
 * Hash an API key for storage. Uses SHA-256.
 * We don't use bcrypt here because API keys are high-entropy
 * (unlike passwords) so dictionary attacks aren't a concern.
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Validate an API key from a request.
 * Checks format, then looks up hash in the agent registry.
 */
export function validateApiKey(
  key: string,
  agents: RegisteredAgent[]
): RegisteredAgent | null {
  // Format check
  if (!key.startsWith(API_KEY_PREFIX)) return null;
  if (key.length < 40) return null;

  const hash = hashApiKey(key);
  return agents.find(a => a.api_key_hash === hash && a.is_active) || null;
}

// --- Request Authentication ---

export type AuthResult =
  | { type: 'human'; user: UserSession }
  | { type: 'agent'; agent: RegisteredAgent }
  | { type: 'anonymous' }
  | { type: 'error'; message: string };

/**
 * Authenticate a request. Checks (in order):
 *   1. API key in Authorization header (for agents)
 *   2. NextAuth session (for OAuth humans)
 *   3. Falls back to anonymous
 */
export async function authenticateRequest(
  request: NextRequest,
  agents: RegisteredAgent[]
): Promise<AuthResult> {
  // 1. Check for API key
  const authHeader = request.headers.get('authorization');
  if (authHeader) {
    const key = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (key.startsWith(API_KEY_PREFIX)) {
      const agent = validateApiKey(key, agents);
      if (!agent) {
        return { type: 'error', message: 'Invalid or revoked API key' };
      }
      return { type: 'agent', agent };
    }
  }

  // 2. Check for NextAuth session
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      // Build a UserSession-compatible object from the NextAuth session
      const user: UserSession = {
        id: session.user.id,
        provider: (session.user.provider || 'github') as 'github' | 'google',
        provider_id: session.user.providerId || '',
        name: session.user.name || '',
        email: session.user.email || '',
        avatar_url: session.user.image || undefined,
        created_at: '', // Not available from session, but not needed for auth check
        last_login: new Date().toISOString(),
        trust_score: {
          ...DEFAULT_TRUST_SCORE,
          overall: session.user.trustScore ?? 0.5,
        },
        role: (session.user.role || 'visitor') as UserSession['role'],
      };
      return { type: 'human', user };
    }
  } catch {
    // Session check failed — fall through to anonymous
  }

  // 3. Anonymous
  return { type: 'anonymous' };
}

// --- Rate Limiting (persisted via Blobs) ---

interface RateLimitRecord {
  count: number;
  window_start: number;
}

/**
 * Check and update rate limits for an identifier.
 * Uses Netlify Blobs in production, in-memory in dev.
 * Keyed by identifier + hour bucket for automatic window rotation.
 */
export async function checkRateLimit(
  identifier: string,
  limits: RateLimit
): Promise<{ allowed: boolean; remaining: number; reset_at: number }> {
  const now = Date.now();
  const hourMs = 60 * 60 * 1000;
  const hourBucket = Math.floor(now / hourMs);
  const key = `${identifier}:${hourBucket}`;

  const existing = await getJSON<RateLimitRecord>(RATE_LIMIT_STORE, key);

  if (!existing) {
    // New window — first request
    await setJSON(RATE_LIMIT_STORE, key, { count: 1, window_start: now });
    return {
      allowed: true,
      remaining: limits.requests_per_hour - 1,
      reset_at: (hourBucket + 1) * hourMs,
    };
  }

  if (existing.count >= limits.requests_per_hour) {
    return {
      allowed: false,
      remaining: 0,
      reset_at: (hourBucket + 1) * hourMs,
    };
  }

  // Increment
  existing.count++;
  await setJSON(RATE_LIMIT_STORE, key, existing);

  return {
    allowed: true,
    remaining: limits.requests_per_hour - existing.count,
    reset_at: (hourBucket + 1) * hourMs,
  };
}

// --- Submission Provenance ---

export function createProvenance(params: {
  entry_id: string;
  submission_path: 'web_form' | 'api';
  author_type: 'human' | 'agent';
  author_id: string;
  ip_hash?: string;
  user_agent?: string;
}): SubmissionProvenance {
  return {
    submission_id: crypto.randomUUID(),
    entry_id: params.entry_id,
    submitted_at: new Date().toISOString(),
    submission_path: params.submission_path,
    author_type: params.author_type,
    author_id: params.author_id,
    ip_hash: params.ip_hash,
    user_agent: params.user_agent,
    status: 'submitted' as ProposalStatus,
  };
}

// --- IP Hashing (for abuse detection, not tracking) ---

export function hashIP(ip: string, salt: string): string {
  return crypto.createHash('sha256').update(ip + salt).digest('hex').substring(0, 16);
}

// --- Trust Score Computation ---

interface ProposalSummary {
  status: string;
  kedl?: number;
  confidence?: number;
}

/**
 * Compute trust score from an agent's proposal history.
 * Uses actual proposal outcomes, not placeholders.
 *
 * Metrics:
 *   - acceptance_rate: % of proposals accepted
 *   - confidence_calibration: how well predicted confidence matches outcomes
 *     (agents that self-assess accurately score higher)
 *   - consistency_score: based on proposal quality signals
 *   - overall: weighted composite (acceptance 50%, calibration 25%, consistency 25%)
 */
export function computeTrustScore(proposals: ProposalSummary[]): TrustScore {
  if (proposals.length === 0) return DEFAULT_TRUST_SCORE;

  // Count outcomes
  const reviewed = proposals.filter(p =>
    ['accepted', 'rejected', 'revision_requested', 'superseded'].includes(p.status)
  );
  const accepted = proposals.filter(p => p.status === 'accepted');
  const rejected = proposals.filter(p => p.status === 'rejected');

  // Acceptance rate (0-1)
  const acceptanceRate = reviewed.length > 0
    ? accepted.length / reviewed.length
    : 0;

  // Confidence calibration (0-1)
  // Agents that submit with appropriate confidence levels score higher.
  // High confidence on rejected entries or low confidence on accepted ones = poor calibration.
  let calibrationScore = 0.5; // neutral default
  if (reviewed.length >= 3) {
    let calibrationSum = 0;
    let calibrationCount = 0;
    for (const p of reviewed) {
      if (p.confidence !== undefined) {
        const isAccepted = p.status === 'accepted';
        // High confidence (4-5) on accepted = good. Low confidence (1-2) on rejected = good.
        if (isAccepted && p.confidence >= 3) calibrationSum += 1;
        else if (!isAccepted && p.confidence <= 2) calibrationSum += 1;
        else if (isAccepted && p.confidence <= 2) calibrationSum += 0.5; // underconfident
        else if (!isAccepted && p.confidence >= 4) calibrationSum += 0; // overconfident
        else calibrationSum += 0.5; // neutral
        calibrationCount++;
      }
    }
    calibrationScore = calibrationCount > 0 ? calibrationSum / calibrationCount : 0.5;
  }

  // Consistency score (0-1)
  // Based on submission patterns: agents that submit with complete metadata score higher.
  let consistencyScore = 0.5;
  if (proposals.length >= 2) {
    const withKedl = proposals.filter(p => p.kedl !== undefined).length;
    const withConfidence = proposals.filter(p => p.confidence !== undefined).length;
    const completeness = (withKedl + withConfidence) / (proposals.length * 2);
    consistencyScore = completeness;
  }

  // Weighted composite
  const overall = (
    acceptanceRate * 0.50 +
    calibrationScore * 0.25 +
    consistencyScore * 0.25
  );

  return {
    overall: Math.round(overall * 100) / 100,
    acceptance_rate: Math.round(acceptanceRate * 100) / 100,
    confidence_calibration: Math.round(calibrationScore * 100) / 100,
    citation_accuracy: 0, // Requires citation verification (future)
    consistency_score: Math.round(consistencyScore * 100) / 100,
    total_submissions: proposals.length,
    total_accepted: accepted.length,
    last_updated: new Date().toISOString(),
  };
}
