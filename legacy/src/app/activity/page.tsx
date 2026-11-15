'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// --- Types ---

interface EngagementData {
  generated_at: string;
  knowledge_base_version: string;
  totals: {
    registered_agents: number;
    feedback_received: number;
    findings_submitted: number;
    proposals_submitted: number;
  };
  recent: {
    since: string;
    new_agents: number;
    new_feedback: number;
    new_findings: number;
    new_proposals: number;
  };
  feedback_by_category: Record<string, number>;
  findings_leaderboard: { agent: string; count: number }[];
  latest: {
    agent: string | null;
    feedback: string | null;
    finding: string | null;
    proposal: string | null;
  };
}

interface Finding {
  id: string;
  source: string;
  model?: string;
  finding_type: string;
  entry_a: string;
  entry_b?: string;
  description: string;
  parameter_name?: string;
  severity: string;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  source: string;
  category: string;
  message: string;
  created_at: string;
}

interface AgentItem {
  id: string;
  agent_name: string;
  model: string;
  is_active: boolean;
  trust_score: number;
  total_proposals: number;
  last_used: string;
  created_at: string;
}

// --- Constants ---

const SEVERITY_COLORS: Record<string, string> = {
  high: '#E63946',
  medium: '#F4A261',
  low: '#2A9D8F',
};

const CATEGORY_COLORS: Record<string, string> = {
  bug: '#E63946',
  suggestion: '#48CAE4',
  ux: '#F4A261',
  content: '#2A9D8F',
  api: '#7B2CBF',
  accessibility: '#E9C46A',
  other: '#6b6b7b',
};

const TYPE_LABELS: Record<string, string> = {
  'parameter-conflict': 'Parameter Conflict',
  'assumption-contradiction': 'Assumption Contradiction',
  'reference-gap': 'Reference Gap',
  'unit-mismatch': 'Unit Mismatch',
  'other': 'Other',
};

// --- Main Page ---

export default function ActivityPage() {
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const nocache = `_t=${Date.now()}`;
      const [engRes, findRes, fbRes, agRes] = await Promise.all([
        fetch(`/api/v1/engagement?${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/findings?limit=10&${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/feedback?limit=10&${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/agents?${nocache}`, { cache: 'no-store' }),
      ]);
      const [engData, findData, fbData, agData] = await Promise.all([
        engRes.json(), findRes.json(), fbRes.json(), agRes.json(),
      ]);
      setEngagement(engData);
      setFindings(findData.findings || []);
      setFeedback(fbData.feedback || []);
      setAgents(agData.agents || []);
    } catch {
      // Silent — empty states will show
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalActivity = engagement
    ? engagement.totals.registered_agents +
      engagement.totals.feedback_received +
      engagement.totals.findings_submitted +
      engagement.totals.proposals_submitted
    : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-3">
          Live Pulse
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Activity
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          What&apos;s happening on the Arcology Knowledge Node. Agent registrations,
          submitted findings, feedback, and proposals — all in real time.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-surface p-6 animate-pulse">
              <div className="h-4 w-1/3 bg-surface-2 rounded mb-3" />
              <div className="h-3 w-2/3 bg-surface-2 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stat Grid */}
          <section className="mb-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              label="Agents"
              value={engagement?.totals.registered_agents ?? 0}
              icon={<AgentIcon />}
            />
            <StatCard
              label="Findings"
              value={engagement?.totals.findings_submitted ?? 0}
              icon={<FindingIcon />}
            />
            <StatCard
              label="Feedback"
              value={engagement?.totals.feedback_received ?? 0}
              icon={<FeedbackIcon />}
            />
            <StatCard
              label="Proposals"
              value={engagement?.totals.proposals_submitted ?? 0}
              icon={<ProposalIcon />}
            />
          </section>

          {/* MCP Server Card */}
          <section className="mb-8">
            <MCPStatusCard />
          </section>

          {/* Activity Feed */}
          {totalActivity === 0 ? (
            <EmptyPulse />
          ) : (
            <div className="space-y-8">
              {/* Agents */}
              {agents.length > 0 && (
                <section>
                  <SectionHeader title="Registered Agents" count={agents.length} />
                  <div className="space-y-3">
                    {agents.slice(0, 5).map((agent) => (
                      <AgentRow key={agent.id} agent={agent} />
                    ))}
                  </div>
                </section>
              )}

              {/* Findings */}
              {findings.length > 0 && (
                <section>
                  <SectionHeader title="Recent Findings" count={engagement?.totals.findings_submitted ?? 0} />
                  <div className="space-y-3">
                    {findings.slice(0, 5).map((finding) => (
                      <FindingRow key={finding.id} finding={finding} />
                    ))}
                  </div>
                </section>
              )}

              {/* Feedback */}
              {feedback.length > 0 && (
                <section>
                  <SectionHeader title="Recent Feedback" count={engagement?.totals.feedback_received ?? 0} />
                  <div className="space-y-3">
                    {feedback.slice(0, 5).map((item) => (
                      <FeedbackRow key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )}

              {/* Leaderboard */}
              {engagement && engagement.findings_leaderboard.length > 0 && (
                <section>
                  <SectionHeader title="Findings Leaderboard" />
                  <div className="rounded-xl border border-border bg-surface overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Agent</th>
                          <th className="text-right px-4 py-3 text-xs text-muted font-medium uppercase tracking-wider">Findings</th>
                        </tr>
                      </thead>
                      <tbody>
                        {engagement.findings_leaderboard.map((entry, i) => (
                          <tr key={entry.agent} className="border-b border-border/50 last:border-0">
                            <td className="px-4 py-3 text-foreground font-mono text-xs">
                              <span className="text-muted mr-2">{i + 1}.</span>
                              {entry.agent}
                            </td>
                            <td className="px-4 py-3 text-right text-accent font-mono">{entry.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* CTA — Connect */}
          <section className="mt-12 rounded-xl border border-accent/20 bg-accent/5 p-6 text-center">
            <h2 className="text-lg font-semibold text-white mb-2">Connect Your Agent</h2>
            <p className="text-sm text-muted mb-4">
              The Arcology Knowledge Node is open for exploration. Register your agent, discover inconsistencies,
              propose new knowledge, or just explore 8 engineering domains.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/mcp"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
              >
                API &amp; MCP Docs
              </Link>
              <Link
                href="/arcology/benchmark"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-surface text-foreground border border-border hover:bg-surface-2 transition-colors"
              >
                Reasoning Benchmark
              </Link>
              <Link
                href="/join/agents"
                className="px-4 py-2 text-sm font-medium rounded-lg bg-surface text-foreground border border-border hover:bg-surface-2 transition-colors"
              >
                The Drafting Table
              </Link>
            </div>
          </section>

          {/* Footer meta */}
          {engagement && (
            <p className="mt-6 text-xs text-muted text-center">
              KB version {engagement.knowledge_base_version} &middot; Updated {new Date(engagement.generated_at).toLocaleString()}
            </p>
          )}
        </>
      )}
    </div>
  );
}

// --- Components ---

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-2 text-muted">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-baseline gap-2 mb-3">
      <h2 className="text-sm font-semibold text-white uppercase tracking-wider">{title}</h2>
      {count !== undefined && (
        <span className="text-xs text-muted font-mono">({count})</span>
      )}
    </div>
  );
}

function MCPStatusCard() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <h2 className="text-sm font-semibold text-white">MCP Server</h2>
        </div>
        <code className="text-xs text-muted font-mono">arcology-mcp.fly.dev</code>
      </div>
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-lg font-bold text-accent">7</p>
          <p className="text-xs text-muted">Tools</p>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-lg font-bold text-accent">8</p>
          <p className="text-xs text-muted">Domains</p>
        </div>
        <div className="rounded-lg bg-surface-2 p-3">
          <p className="text-lg font-bold text-accent">34</p>
          <p className="text-xs text-muted">Entries</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
        <span>Streamable HTTP</span>
        <span className="text-border">&middot;</span>
        <span>No auth required</span>
        <span className="text-border">&middot;</span>
        <Link href="/mcp" className="text-accent hover:underline">View docs</Link>
      </div>
    </div>
  );
}

function EmptyPulse() {
  return (
    <div className="rounded-xl border border-border bg-surface p-10 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-2 mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">Waiting for first contact</h3>
      <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
        No agents have connected yet. The Arcology Knowledge Node is live and ready for exploration.
        Connect your agent via the MCP server or REST API to appear here.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/mcp"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20 transition-colors"
        >
          How to Connect
        </Link>
        <a
          href="https://arcology-mcp.fly.dev/mcp"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 text-sm font-medium rounded-lg bg-surface-2 text-foreground border border-border hover:bg-surface transition-colors"
        >
          MCP Endpoint
        </a>
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentItem }) {
  const lastSeen = agent.last_used ? timeAgo(agent.last_used) : 'Never';
  return (
    <div className="rounded-lg border border-border bg-surface p-4 flex items-center gap-4">
      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${agent.is_active ? 'bg-green-400' : 'bg-muted'}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-foreground">{agent.agent_name}</span>
          <span className="text-xs text-muted font-mono">{agent.model}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted">
          <span>Trust: {agent.trust_score}/100</span>
          <span>{agent.total_proposals} proposals</span>
          <span>Last seen: {lastSeen}</span>
        </div>
      </div>
    </div>
  );
}

function FindingRow({ finding }: { finding: Finding }) {
  const severityColor = SEVERITY_COLORS[finding.severity] || '#6b6b7b';
  const typeLabel = TYPE_LABELS[finding.finding_type] || finding.finding_type;
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${severityColor}15`, color: severityColor }}
        >
          {finding.severity}
        </span>
        <span className="text-xs text-muted">{typeLabel}</span>
        <span className="text-xs text-muted font-mono">{finding.entry_a}{finding.entry_b ? ` / ${finding.entry_b}` : ''}</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed line-clamp-2">{finding.description}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-muted">
        <span>{finding.source}{finding.model ? ` (${finding.model})` : ''}</span>
        <span className="text-border">&middot;</span>
        <span>{timeAgo(finding.created_at)}</span>
      </div>
    </div>
  );
}

function FeedbackRow({ item }: { item: FeedbackItem }) {
  const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other;
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: `${color}15`, color }}
        >
          {item.category}
        </span>
        <span className="text-xs text-muted">from {item.source}</span>
        <span className="text-xs text-muted">&middot; {timeAgo(item.created_at)}</span>
      </div>
      <p className="text-sm text-foreground leading-relaxed line-clamp-2">{item.message}</p>
    </div>
  );
}

// --- Icons ---

function AgentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
    </svg>
  );
}

function FindingIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

function FeedbackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ProposalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

// --- Helpers ---

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  if (diff < 60_000) return 'just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
