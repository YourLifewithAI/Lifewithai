// ============================================================
// Arcology Knowledge Node — Auth & Identity Types
// ============================================================
// Defines the authentication, authorization, and identity
// verification types for the contribution system.
//
// Design principle: the submission PATH determines author type.
//   - OAuth login → web form → human
//   - API key → POST endpoint → agent
// No self-reporting. No toggles.

// --- Session & User ---

export interface UserSession {
  id: string;                        // Internal user ID (UUID)
  provider: 'github' | 'google';    // OAuth provider
  provider_id: string;               // Provider's user ID
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;                // ISO date
  last_login: string;                // ISO date
  trust_score: TrustScore;
  role: UserRole;
}

export type UserRole = 'visitor' | 'contributor' | 'steward' | 'admin';

// --- Agent Registry ---

export interface RegisteredAgent {
  id: string;                        // Internal agent ID (UUID)
  agent_name: string;                // Human-readable name (e.g., "MIRROR Editorial Agent")
  model: string;                     // Model identifier (e.g., "claude-opus-4-6")
  owner_id: string;                  // User ID of the human who registered this agent
  api_key_hash: string;              // bcrypt hash of the API key (never store plaintext)
  api_key_prefix: string;            // First 8 chars of the key for identification (e.g., "arc_ak_1")
  permissions: AgentPermissions;
  rate_limit: RateLimit;
  created_at: string;
  last_used: string;
  is_active: boolean;
  trust_score: TrustScore;
}

export interface AgentPermissions {
  can_submit: boolean;               // Can create new proposals
  can_amend: boolean;                // Can propose amendments to existing entries
  can_comment: boolean;              // Can add review comments
  allowed_domains: string[] | 'all'; // Which domains can this agent submit to
}

export interface RateLimit {
  requests_per_hour: number;
  requests_per_day: number;
  submissions_per_day: number;
}

// --- Trust Scoring ---
// Universal: same metrics for humans and agents.
// See CONTRIBUTION-FRAMEWORK.md §6.2

export interface TrustScore {
  overall: number;                   // 0.0 - 1.0 composite score
  acceptance_rate: number;           // % of submissions accepted
  confidence_calibration: number;    // How accurate are their confidence levels
  citation_accuracy: number;         // % of citations that verify
  consistency_score: number;         // Do parameters stay consistent across entries
  total_submissions: number;
  total_accepted: number;
  last_updated: string;
}

export const DEFAULT_TRUST_SCORE: TrustScore = {
  overall: 0.5,
  acceptance_rate: 0,
  confidence_calibration: 0,
  citation_accuracy: 0,
  consistency_score: 0,
  total_submissions: 0,
  total_accepted: 0,
  last_updated: new Date().toISOString(),
};

// --- API Key Format ---
// Keys follow format: arc_ak_{random32chars}
// Prefix "arc_ak_" makes them identifiable in logs/leaks

export const API_KEY_PREFIX = 'arc_ak_';

// --- Submission Provenance ---
// Every entry records HOW it was submitted. Immutable after creation.

export interface SubmissionProvenance {
  submission_id: string;             // UUID
  entry_id: string;                  // The proposed entry's ID
  submitted_at: string;              // ISO timestamp
  submission_path: 'web_form' | 'api'; // How it arrived
  author_type: 'human' | 'agent';   // Determined by path, not self-report
  author_id: string;                 // User ID (human) or Agent ID (agent)
  ip_hash?: string;                  // Hashed IP for abuse detection (not stored plaintext)
  user_agent?: string;               // Browser/client UA string
  status: ProposalStatus;
  reviewed_by?: string;              // User ID of reviewer
  reviewed_at?: string;              // ISO timestamp
  review_notes?: string;
}

export type ProposalStatus =
  | 'draft'                          // Initial creation, not yet submitted
  | 'submitted'                      // Submitted for review
  | 'under_review'                   // Steward is reviewing
  | 'revision_requested'             // Needs changes before acceptance
  | 'accepted'                       // Approved for publication
  | 'rejected'                       // Not accepted (with reason)
  | 'superseded';                    // Replaced by a newer entry

// --- Auth Configuration ---

export interface AuthConfig {
  github: {
    client_id: string;
    client_secret: string;
  };
  google?: {
    client_id: string;
    client_secret: string;
  };
  jwt_secret: string;
  api_key_salt: string;
}

// --- Rate Limiting Defaults ---

export const DEFAULT_RATE_LIMITS = {
  human: {
    requests_per_hour: 60,
    requests_per_day: 500,
    submissions_per_day: 10,
  } satisfies RateLimit,
  agent: {
    requests_per_hour: 30,
    requests_per_day: 200,
    submissions_per_day: 5,
  } satisfies RateLimit,
};
