// ============================================================
// Arcology Knowledge Node — Query Log Ingestion
// ============================================================
// POST /api/v1/query-log — Receive query events from MCP server
// GET  /api/v1/query-log — Return raw daily logs (internal/debug)
//
// Events arrive fire-and-forget from the MCP server on Fly.io.
// Stored in daily buckets: "2026-03-16" → [{ts, tool, params, result_size}, ...]

import { type NextRequest } from 'next/server';
import { getJSON, setJSON, listKeys } from '@/lib/storage';

const STORE = 'query-log';

interface QueryEvent {
  ts: string;
  tool: string;
  params: Record<string, unknown>;
  result_size: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept single event or batch
    const events: QueryEvent[] = Array.isArray(body) ? body : [body];

    // Validate events
    for (const event of events) {
      if (!event.ts || !event.tool) {
        return Response.json(
          { error: 'Each event must have ts and tool fields' },
          { status: 400 }
        );
      }
    }

    // Group events by date
    const byDate = new Map<string, QueryEvent[]>();
    for (const event of events) {
      const date = event.ts.slice(0, 10); // "2026-03-16"
      const existing = byDate.get(date) || [];
      existing.push(event);
      byDate.set(date, existing);
    }

    // Append to daily buckets
    for (const [date, dayEvents] of byDate) {
      const existing = await getJSON<QueryEvent[]>(STORE, date) || [];
      existing.push(...dayEvents);
      await setJSON(STORE, date, existing);
    }

    return Response.json(
      { received: events.length },
      {
        status: 202,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (e) {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const days = parseInt(searchParams.get('days') || '7', 10);

  // If specific date requested, return that bucket
  if (date) {
    const events = await getJSON<QueryEvent[]>(STORE, date) || [];
    return Response.json(
      { date, count: events.length, events },
      { headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  }

  // Otherwise return last N days of keys + counts
  const keys = await listKeys(STORE);
  const sorted = keys.sort().reverse().slice(0, days);

  const summary = [];
  for (const key of sorted) {
    const events = await getJSON<QueryEvent[]>(STORE, key) || [];
    summary.push({ date: key, count: events.length });
  }

  return Response.json(
    { days: summary.length, daily_counts: summary },
    { headers: { 'Access-Control-Allow-Origin': '*' } }
  );
}

// CORS preflight
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
