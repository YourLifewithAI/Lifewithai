// ============================================================
// Arcology Knowledge Node — Engagement Metrics API
// ============================================================
// GET /api/v1/engagement — Aggregated engagement metrics
//
// Returns counts of registered agents, feedback, findings,
// proposals, and recent activity. Used by the daily scheduled
// task to generate engagement summaries.

import { type NextRequest } from 'next/server';
import { getContentIndex } from '@/lib/api-helpers';
import { getAll, listKeys, getJSON } from '@/lib/storage';

const AGENTS_STORE = 'agents';
const FEEDBACK_STORE = 'feedback';
const FINDINGS_STORE = 'findings';
const PROPOSALS_STORE = 'proposals';
const QUERY_LOG_STORE = 'query-log';

interface TimestampedRecord {
  created_at: string;
  [key: string]: unknown;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since');

  // Fetch all stores in parallel
  const [agents, feedback, findings, proposals] = await Promise.all([
    getAll<TimestampedRecord>(AGENTS_STORE),
    getAll<TimestampedRecord>(FEEDBACK_STORE),
    getAll<TimestampedRecord>(FINDINGS_STORE),
    getAll<TimestampedRecord>(PROPOSALS_STORE),
  ]);

  // Filter by 'since' date if provided
  const sinceDate = since ? new Date(since) : null;

  function filterRecent(items: TimestampedRecord[]): TimestampedRecord[] {
    if (!sinceDate || isNaN(sinceDate.getTime())) return items;
    return items.filter(i => new Date(i.created_at) >= sinceDate);
  }

  const recentAgents = filterRecent(agents);
  const recentFeedback = filterRecent(feedback);
  const recentFindings = filterRecent(findings);
  const recentProposals = filterRecent(proposals);

  // Build leaderboard from findings
  const findingsLeaderboard: Record<string, number> = {};
  for (const f of findings) {
    const key = (f.model ? `${f.source} (${f.model})` : f.source) as string;
    findingsLeaderboard[key] = (findingsLeaderboard[key] || 0) + 1;
  }

  // Feedback by category
  const feedbackByCategory: Record<string, number> = {};
  for (const f of feedback) {
    const cat = (f.category as string) || 'unknown';
    feedbackByCategory[cat] = (feedbackByCategory[cat] || 0) + 1;
  }

  // Get knowledge base version
  let knowledgeBaseVersion = '';
  try {
    const index = getContentIndex();
    knowledgeBaseVersion = index.knowledge_base_version;
  } catch {
    // Index may not be available
  }

  // Query activity summary (last 7 days)
  let queryTotal = 0;
  let queryDays = 0;
  const queryTopTools: Record<string, number> = {};
  try {
    const queryKeys = await listKeys(QUERY_LOG_STORE);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 7);
    const cutoffStr = cutoff.toISOString().slice(0, 10);
    const recentKeys = queryKeys.filter(k => k >= cutoffStr);
    queryDays = recentKeys.length;

    for (const key of recentKeys) {
      const events = await getJSON<{ tool: string }[]>(QUERY_LOG_STORE, key) || [];
      queryTotal += events.length;
      for (const e of events) {
        queryTopTools[e.tool] = (queryTopTools[e.tool] || 0) + 1;
      }
    }
  } catch {
    // Query log may not exist yet
  }

  const response = {
    generated_at: new Date().toISOString(),
    knowledge_base_version: knowledgeBaseVersion,

    // Lifetime totals
    totals: {
      registered_agents: agents.length,
      feedback_received: feedback.length,
      findings_submitted: findings.length,
      proposals_submitted: proposals.length,
    },

    // Recent activity (filtered by 'since' param)
    recent: {
      since: since || 'all-time',
      new_agents: recentAgents.length,
      new_feedback: recentFeedback.length,
      new_findings: recentFindings.length,
      new_proposals: recentProposals.length,
    },

    // Breakdown
    feedback_by_category: feedbackByCategory,
    findings_leaderboard: Object.entries(findingsLeaderboard)
      .map(([agent, count]) => ({ agent, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20),

    // Query activity (7-day window from MCP server)
    query_activity: {
      total_queries_7d: queryTotal,
      active_days_7d: queryDays,
      tool_usage: Object.entries(queryTopTools)
        .map(([tool, count]) => ({ tool, count }))
        .sort((a, b) => b.count - a.count),
      detail_url: '/api/v1/query-activity',
    },

    // Most recent activity timestamps
    latest: {
      agent: agents.length > 0
        ? agents.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].created_at
        : null,
      feedback: feedback.length > 0
        ? feedback.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].created_at
        : null,
      finding: findings.length > 0
        ? findings.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].created_at
        : null,
      proposal: proposals.length > 0
        ? proposals.sort((a, b) => b.created_at.localeCompare(a.created_at))[0].created_at
        : null,
    },
  };

  return Response.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
