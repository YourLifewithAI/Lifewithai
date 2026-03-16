'use client';

import { useState, useEffect, useCallback } from 'react';
import { DOMAIN_COLORS, DOMAIN_NAMES } from '@/lib/constants';
import type { Domain } from '@/lib/types';

// --- Types ---

type Tab = 'feedback' | 'proposals' | 'agents' | 'activity';

interface FeedbackItem {
  id: string;
  source: string;
  category: string;
  page_url?: string;
  message: string;
  metadata?: Record<string, unknown>;
  user_agent?: string;
  created_at: string;
}

interface ProposalItem {
  submission_id: string;
  entry_id: string;
  title: string;
  domain: string;
  subdomain: string;
  entry_type: string;
  summary: string;
  status: string;
  author_type: 'human' | 'agent';
  author_id: string;
  submitted_at: string;
  reviewed_at?: string;
  kedl?: number;
  confidence?: number;
}

interface QueryActivity {
  generated_at: string;
  total_queries: number;
  window: { days: number; from: string | null; to: string | null };
  daily_volume: { date: string; count: number }[];
  tool_usage: { key: string; count: number }[];
  trending_domains: { key: string; count: number }[];
  top_searches: { key: string; count: number }[];
  most_read_entries: { key: string; count: number }[];
  top_parameter_lookups: { key: string; count: number }[];
  top_cross_reference_targets: { key: string; count: number }[];
}

interface AgentItem {
  id: string;
  agent_name: string;
  model: string;
  api_key_prefix: string;
  permissions: {
    can_submit: boolean;
    can_amend: boolean;
    can_comment: boolean;
    allowed_domains: string[];
  };
  rate_limit: {
    requests_per_hour: number;
    requests_per_day: number;
    submissions_per_day: number;
  };
  trust_score: number;
  is_active: boolean;
  created_at: string;
  last_used: string;
  total_proposals: number;
}

// --- Category colors ---

const CATEGORY_COLORS: Record<string, string> = {
  bug: '#E63946',
  suggestion: '#48CAE4',
  ux: '#F4A261',
  content: '#2A9D8F',
  api: '#7B2CBF',
  accessibility: '#E9C46A',
  other: '#6b6b7b',
};

const STATUS_COLORS: Record<string, string> = {
  submitted: '#F4A261',
  under_review: '#48CAE4',
  revision_requested: '#E9C46A',
  accepted: '#2A9D8F',
  rejected: '#E63946',
  superseded: '#6b6b7b',
};

// --- Main Page ---

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<Tab>('feedback');
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [proposals, setProposals] = useState<ProposalItem[]>([]);
  const [agents, setAgents] = useState<AgentItem[]>([]);
  const [activity, setActivity] = useState<QueryActivity | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch all three on mount so stat cards always have counts
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const nocache = `_t=${Date.now()}`;
      const [fbRes, prRes, agRes, actRes] = await Promise.all([
        fetch(`/api/v1/feedback?${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/proposals?${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/agents?${nocache}`, { cache: 'no-store' }),
        fetch(`/api/v1/query-activity?days=7&${nocache}`, { cache: 'no-store' }),
      ]);
      const [fbData, prData, agData, actData] = await Promise.all([
        fbRes.json(), prRes.json(), agRes.json(), actRes.json(),
      ]);
      setFeedback(fbData.feedback || []);
      setProposals(prData.proposals || []);
      setAgents(agData.agents || []);
      setActivity(actData || null);
    } catch {
      // Silently handle — empty states will show
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setCategoryFilter('all');
    setStatusFilter('all');
  };

  // Proposal status update
  const updateProposalStatus = async (submissionId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/v1/proposals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submission_id: submissionId, status: newStatus }),
      });
      if (res.ok) {
        // Refresh all data
        fetchAll();
      }
    } catch {
      // Silent fail — could add toast later
    }
  };

  // Filter data
  const filteredFeedback = categoryFilter === 'all'
    ? feedback
    : feedback.filter(f => f.category === categoryFilter);

  const filteredProposals = statusFilter === 'all'
    ? proposals
    : proposals.filter(p => p.status === statusFilter);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">Inbox</h1>
        <p className="mt-3 text-muted leading-relaxed">
          Feedback, proposals, and agent activity.
        </p>
      </div>

      {/* Stat Cards */}
      <section className="mb-8 grid grid-cols-4 gap-4">
        <StatCard
          label="Feedback"
          value={feedback.length}
          active={activeTab === 'feedback'}
          onClick={() => handleTabChange('feedback')}
        />
        <StatCard
          label="Proposals"
          value={proposals.length}
          active={activeTab === 'proposals'}
          onClick={() => handleTabChange('proposals')}
        />
        <StatCard
          label="Agents"
          value={agents.length}
          active={activeTab === 'agents'}
          onClick={() => handleTabChange('agents')}
        />
        <StatCard
          label="Queries (7d)"
          value={activity?.total_queries || 0}
          active={activeTab === 'activity'}
          onClick={() => handleTabChange('activity')}
        />
      </section>

      {/* Tabs */}
      <div className="mb-6 flex rounded-lg border border-border overflow-hidden">
        {(['feedback', 'proposals', 'agents', 'activity'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-accent/10 text-accent'
                : 'text-muted hover:text-foreground hover:bg-surface-2'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Filters */}
      {activeTab === 'feedback' && feedback.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'bug', 'suggestion', 'ux', 'content', 'api', 'accessibility'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                categoryFilter === cat
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border text-muted hover:text-foreground hover:border-border'
              }`}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      )}

      {activeTab === 'proposals' && proposals.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'submitted', 'under_review', 'accepted', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                statusFilter === status
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border text-muted hover:text-foreground hover:border-border'
              }`}
            >
              {status === 'all' ? 'All' : status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="text-muted">Loading...</p>
        </div>
      ) : (
        <>
          {activeTab === 'feedback' && (
            filteredFeedback.length === 0 ? (
              <EmptyState message="No feedback yet. Agents can submit feedback via POST /api/v1/feedback." />
            ) : (
              <div className="space-y-3">
                {filteredFeedback.map((item) => (
                  <FeedbackCard key={item.id} item={item} />
                ))}
              </div>
            )
          )}

          {activeTab === 'proposals' && (
            filteredProposals.length === 0 ? (
              <EmptyState message="No proposals yet. Agents and humans can submit via POST /api/v1/proposals." />
            ) : (
              <div className="space-y-3">
                {filteredProposals.map((item) => (
                  <ProposalCard
                    key={item.submission_id}
                    item={item}
                    onStatusChange={updateProposalStatus}
                  />
                ))}
              </div>
            )
          )}

          {activeTab === 'agents' && (
            agents.length === 0 ? (
              <EmptyState message="No agents registered yet. Agents self-register via POST /api/v1/agents." />
            ) : (
              <div className="space-y-3">
                {agents.map((item) => (
                  <AgentCard key={item.id} item={item} />
                ))}
              </div>
            )
          )}

          {activeTab === 'activity' && (
            !activity || activity.total_queries === 0 ? (
              <EmptyState message="No query activity yet. As agents explore the knowledge base via MCP, aggregate patterns will appear here." />
            ) : (
              <ActivityPanel activity={activity} />
            )
          )}
        </>
      )}
    </div>
  );
}

// --- Components ---

function StatCard({ label, value, active, onClick }: {
  label: string; value: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 text-center transition-all ${
        active
          ? 'border-accent/40 bg-accent/5'
          : 'border-border bg-surface hover:border-border'
      }`}
    >
      <p className={`text-2xl font-bold ${active ? 'text-accent' : 'text-white'}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-8 text-center">
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}

function FeedbackCard({ item }: { item: FeedbackItem }) {
  const color = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.other;
  const time = new Date(item.created_at).toLocaleString();

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${color}15`, color }}
            >
              {item.category}
            </span>
            <span className="text-xs text-muted">from {item.source}</span>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{item.message}</p>
          {item.page_url && (
            <p className="mt-2 text-xs text-muted">
              Page: <span className="text-accent/70">{item.page_url}</span>
            </p>
          )}
        </div>
        <span className="text-xs text-muted flex-shrink-0">{time}</span>
      </div>
    </div>
  );
}

function ProposalCard({ item, onStatusChange }: {
  item: ProposalItem;
  onStatusChange: (id: string, status: string) => void;
}) {
  const domainColor = DOMAIN_COLORS[item.domain as Domain] || '#6b6b7b';
  const domainName = DOMAIN_NAMES[item.domain as Domain] || item.domain;
  const statusColor = STATUS_COLORS[item.status] || '#6b6b7b';
  const time = new Date(item.submitted_at).toLocaleString();
  const statusLabel = item.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Available status transitions
  const actions: { label: string; status: string }[] = [];
  if (item.status === 'submitted') {
    actions.push({ label: 'Review', status: 'under_review' });
    actions.push({ label: 'Reject', status: 'rejected' });
  } else if (item.status === 'under_review') {
    actions.push({ label: 'Accept', status: 'accepted' });
    actions.push({ label: 'Request Revision', status: 'revision_requested' });
    actions.push({ label: 'Reject', status: 'rejected' });
  } else if (item.status === 'revision_requested') {
    actions.push({ label: 'Review', status: 'under_review' });
    actions.push({ label: 'Reject', status: 'rejected' });
  }

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${domainColor}15`, color: domainColor }}
            >
              {domainName}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: `${statusColor}15`, color: statusColor }}
            >
              {statusLabel}
            </span>
            <span className="text-xs text-muted capitalize">{item.entry_type}</span>
            <span className="text-xs text-muted">
              {item.author_type === 'agent' ? '🤖' : '👤'} {item.author_id}
            </span>
          </div>
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          <p className="mt-1 text-sm text-muted line-clamp-2">{item.summary}</p>
          <p className="mt-2 text-xs text-muted">
            {item.entry_id}
            {item.kedl && <span className="ml-2">KEDL {item.kedl}</span>}
            {item.confidence && <span className="ml-2">CL {item.confidence}</span>}
          </p>
        </div>
        <span className="text-xs text-muted flex-shrink-0">{time}</span>
      </div>

      {/* Actions */}
      {actions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border flex gap-2">
          {actions.map((action) => (
            <button
              key={action.status}
              onClick={() => onStatusChange(item.submission_id, action.status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                action.status === 'rejected'
                  ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                  : action.status === 'accepted'
                  ? 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                  : 'border-border text-muted hover:text-foreground hover:bg-surface-2'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ActivityPanel({ activity }: { activity: QueryActivity }) {
  const maxVolume = Math.max(...activity.daily_volume.map(d => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Daily Volume Sparkline */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <h3 className="text-sm font-medium text-foreground mb-3">Daily Query Volume</h3>
        <div className="flex items-end gap-1 h-16">
          {activity.daily_volume.map((day) => (
            <div
              key={day.date}
              className="flex-1 group relative"
              title={`${day.date}: ${day.count} queries`}
            >
              <div
                className="w-full rounded-sm bg-accent/60 hover:bg-accent transition-colors"
                style={{ height: `${Math.max((day.count / maxVolume) * 100, 4)}%` }}
              />
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-muted hidden group-hover:block whitespace-nowrap">
                {day.date.slice(5)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-xs text-muted">
          <span>{activity.window.from?.slice(5) || ''}</span>
          <span>{activity.total_queries} total queries</span>
          <span>{activity.window.to?.slice(5) || ''}</span>
        </div>
      </div>

      {/* Two-column layout for lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Trending Domains */}
        {activity.trending_domains.length > 0 && (
          <RankedList
            title="Trending Domains"
            subtitle="Where agents are focusing"
            items={activity.trending_domains}
          />
        )}

        {/* Tool Usage */}
        {activity.tool_usage.length > 0 && (
          <RankedList
            title="Tool Usage"
            subtitle="How agents explore"
            items={activity.tool_usage}
          />
        )}

        {/* Top Searches */}
        {activity.top_searches.length > 0 && (
          <RankedList
            title="Top Searches"
            subtitle="What agents are looking for"
            items={activity.top_searches}
          />
        )}

        {/* Most Read Entries */}
        {activity.most_read_entries.length > 0 && (
          <RankedList
            title="Most-Read Entries"
            subtitle="What agents are studying"
            items={activity.most_read_entries}
          />
        )}

        {/* Parameter Lookups */}
        {activity.top_parameter_lookups.length > 0 && (
          <RankedList
            title="Parameter Lookups"
            subtitle="What values agents are checking"
            items={activity.top_parameter_lookups}
          />
        )}

        {/* Cross-Reference Targets */}
        {activity.top_cross_reference_targets.length > 0 && (
          <RankedList
            title="Cross-Reference Targets"
            subtitle="What agents trace dependencies on"
            items={activity.top_cross_reference_targets}
          />
        )}
      </div>

      <p className="text-xs text-muted text-center">
        Aggregate data only — no individual agent attribution.
        Updated every 5 minutes. API: <code className="text-accent/60">/api/v1/query-activity</code>
      </p>
    </div>
  );
}

function RankedList({ title, subtitle, items }: {
  title: string;
  subtitle: string;
  items: { key: string; count: number }[];
}) {
  const max = items[0]?.count || 1;
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="text-xs text-muted mb-3">{subtitle}</p>
      <div className="space-y-2">
        {items.slice(0, 8).map((item, i) => (
          <div key={item.key} className="flex items-center gap-2">
            <span className="text-xs text-muted w-4 text-right">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-foreground truncate">{item.key}</span>
                <span className="text-xs text-muted ml-2 flex-shrink-0">{item.count}</span>
              </div>
              <div className="h-1 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent/40"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ item }: { item: AgentItem }) {
  const created = new Date(item.created_at).toLocaleDateString();
  const lastUsed = item.last_used ? new Date(item.last_used).toLocaleString() : 'Never';

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              item.is_active ? 'bg-green-400' : 'bg-red-400'
            }`} />
            <h3 className="font-semibold text-foreground">{item.agent_name}</h3>
            <span className="text-xs text-muted">{item.model}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span>Trust: {item.trust_score}/100</span>
            <span>Proposals: {item.total_proposals}</span>
            <span>Key: {item.api_key_prefix}...</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            <span>Registered {created}</span>
            <span>Last used: {lastUsed}</span>
          </div>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted">
            <span>Rate: {item.rate_limit.requests_per_hour}/hr, {item.rate_limit.submissions_per_day} submissions/day</span>
          </div>
        </div>
      </div>
    </div>
  );
}
