// ============================================================
// Arcology Knowledge Node — Agent Registry API
// ============================================================
// POST /api/v1/agents — Self-register as an agent (open)
// GET  /api/v1/agents — List registered agents (public, no secrets)
//                        Trust scores computed live from proposal history.

import { type NextRequest } from 'next/server';
import { apiResponse, errorResponse, jsonLdContext } from '@/lib/api-helpers';
import { generateApiKey, computeTrustScore } from '@/lib/auth';
import type { RegisteredAgent, AgentPermissions, SubmissionProvenance } from '@/lib/auth-types';
import { DEFAULT_RATE_LIMITS, DEFAULT_TRUST_SCORE } from '@/lib/auth-types';
import { getAll, setJSON } from '@/lib/storage';

const AGENTS_STORE = 'agents';
const PROPOSALS_STORE = 'proposals';

interface StoredProposal {
  provenance: SubmissionProvenance;
  kedl?: number;
  confidence?: number;
}

// --- GET: List registered agents (public info, live trust scores) ---

export async function GET() {
  const [agents, proposals] = await Promise.all([
    getAll<RegisteredAgent>(AGENTS_STORE),
    getAll<StoredProposal>(PROPOSALS_STORE),
  ]);

  // Group proposals by author for trust scoring
  const proposalsByAgent = new Map<string, StoredProposal[]>();
  for (const p of proposals) {
    if (p.provenance.author_type === 'agent') {
      const existing = proposalsByAgent.get(p.provenance.author_id) || [];
      existing.push(p);
      proposalsByAgent.set(p.provenance.author_id, existing);
    }
  }

  // Build public agent list with live trust scores
  const publicAgents = agents.map(a => {
    const agentProposals = proposalsByAgent.get(a.id) || [];
    const trustScore = agentProposals.length > 0
      ? computeTrustScore(agentProposals.map(p => ({
          status: p.provenance.status,
          kedl: p.kedl,
          confidence: p.confidence,
        })))
      : a.trust_score;

    return {
      id: a.id,
      agent_name: a.agent_name,
      model: a.model,
      api_key_prefix: a.api_key_prefix,
      permissions: a.permissions,
      rate_limit: a.rate_limit,
      trust_score: trustScore,
      is_active: a.is_active,
      created_at: a.created_at,
      last_used: a.last_used,
      total_proposals: agentProposals.length,
    };
  });

  // Bypass CDN cache — agents are dynamic (Netlify Blobs)
  return Response.json(
    { ...jsonLdContext(), agents: publicAgents, total: publicAgents.length },
    {
      headers: {
        'Content-Type': 'application/ld+json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

// --- POST: Register a new agent (open registration) ---

export async function POST(request: NextRequest) {
  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON in request body', 400);
  }

  // Validate required fields
  const required = ['agent_name', 'model'];
  const missing = required.filter(f => !body[f]);
  if (missing.length > 0) {
    return errorResponse(`Missing required fields: ${missing.join(', ')}`, 400);
  }

  // Basic input validation
  const agentName = String(body.agent_name).trim();
  const model = String(body.model).trim();
  if (agentName.length < 2 || agentName.length > 100) {
    return errorResponse('agent_name must be 2-100 characters', 400);
  }
  if (model.length < 2 || model.length > 100) {
    return errorResponse('model must be 2-100 characters', 400);
  }

  // Generate API key
  const { key, hash, prefix } = generateApiKey();

  // Build agent record
  const agent: RegisteredAgent = {
    id: crypto.randomUUID(),
    agent_name: agentName,
    model,
    owner_id: 'self-registered',
    api_key_hash: hash,
    api_key_prefix: prefix,
    permissions: (body.permissions as AgentPermissions) || {
      can_submit: true,
      can_amend: false,
      can_comment: true,
      allowed_domains: 'all',
    },
    rate_limit: DEFAULT_RATE_LIMITS.agent,
    created_at: new Date().toISOString(),
    last_used: '',
    is_active: true,
    trust_score: DEFAULT_TRUST_SCORE,
  };

  // Persist to Blobs
  await setJSON(AGENTS_STORE, agent.id, agent);

  // Return the key ONCE — it cannot be retrieved after this
  return apiResponse(
    {
      message: 'Agent registered successfully',
      agent_id: agent.id,
      agent_name: agent.agent_name,
      api_key: key, // SHOW ONCE — never stored or returned again
      api_key_prefix: prefix,
      permissions: agent.permissions,
      rate_limit: agent.rate_limit,
      _warning: 'Save this API key now. It cannot be retrieved after this response.',
    },
    201
  );
}
