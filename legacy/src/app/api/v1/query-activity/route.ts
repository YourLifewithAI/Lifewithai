// ============================================================
// Arcology Knowledge Node — Query Activity (Public Aggregate)
// ============================================================
// GET /api/v1/query-activity — Public aggregate query analytics
//
// Returns: trending domains, popular searches, most-read entries,
// tool usage distribution, and volume over time. All aggregate —
// no individual agent attribution.

import { type NextRequest } from 'next/server';
import { getJSON, listKeys } from '@/lib/storage';

const STORE = 'query-log';

interface QueryEvent {
  ts: string;
  tool: string;
  params: Record<string, unknown>;
  result_size: number;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(parseInt(searchParams.get('days') || '7', 10), 90);

  // Get all daily buckets within the window
  const keys = await listKeys(STORE);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  const relevantKeys = keys.filter(k => k >= cutoffStr).sort().reverse();

  // Load all events in the window
  const allEvents: QueryEvent[] = [];
  const dailyVolume: { date: string; count: number }[] = [];

  for (const key of relevantKeys) {
    const events = await getJSON<QueryEvent[]>(STORE, key) || [];
    allEvents.push(...events);
    dailyVolume.push({ date: key, count: events.length });
  }

  // Tool usage distribution
  const toolCounts: Record<string, number> = {};
  for (const e of allEvents) {
    toolCounts[e.tool] = (toolCounts[e.tool] || 0) + 1;
  }

  // Domain distribution (from read_node, search_knowledge, get_open_questions, get_entry_parameters)
  const domainCounts: Record<string, number> = {};
  for (const e of allEvents) {
    const domain = e.params.domain as string | undefined;
    if (domain) {
      domainCounts[domain] = (domainCounts[domain] || 0) + 1;
    }
  }

  // Top search queries
  const queryCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.tool === 'search_knowledge' && e.params.query) {
      const q = (e.params.query as string).toLowerCase().trim();
      queryCounts[q] = (queryCounts[q] || 0) + 1;
    }
  }

  // Most-read entries (from read_node)
  const readCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.tool === 'read_node' && e.params.domain && e.params.slug) {
      const key = `${e.params.domain}/${e.params.slug}`;
      readCounts[key] = (readCounts[key] || 0) + 1;
    }
  }

  // Parameter lookups (from get_entry_parameters)
  const paramCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.tool === 'get_entry_parameters' && e.params.parameter_name) {
      const p = (e.params.parameter_name as string).toLowerCase().trim();
      paramCounts[p] = (paramCounts[p] || 0) + 1;
    }
  }

  // Cross-reference lookups
  const xrefCounts: Record<string, number> = {};
  for (const e of allEvents) {
    if (e.tool === 'get_cross_references' && e.params.entry_id) {
      const id = e.params.entry_id as string;
      xrefCounts[id] = (xrefCounts[id] || 0) + 1;
    }
  }

  // Sort helpers
  const topN = (counts: Record<string, number>, n: number) =>
    Object.entries(counts)
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, n);

  const response = {
    generated_at: new Date().toISOString(),
    window: {
      days,
      from: relevantKeys[relevantKeys.length - 1] || null,
      to: relevantKeys[0] || null,
    },
    total_queries: allEvents.length,
    daily_volume: dailyVolume,

    // What tools are agents using?
    tool_usage: topN(toolCounts, 10),

    // Which domains are getting attention?
    trending_domains: topN(domainCounts, 10),

    // What are agents searching for?
    top_searches: topN(queryCounts, 20),

    // Which entries are most read?
    most_read_entries: topN(readCounts, 20),

    // What parameters are agents checking?
    top_parameter_lookups: topN(paramCounts, 15),

    // Which entries get cross-reference analysis?
    top_cross_reference_targets: topN(xrefCounts, 10),
  };

  return Response.json(response, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300', // 5-minute cache — this is aggregate data
    },
  });
}
