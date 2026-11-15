// ============================================================
// Arcology Knowledge Node — Content Index API
// ============================================================
// Serves the full content index as JSON, generated on-demand.
// Replaces the static public/content-index.json that was going
// stale due to build-step issues.
//
// Consumed by:
//   - MCP server on Fly.io (fetched over HTTP)
//   - Client-side search
//   - Any agent or tool needing the full index

import {
  getAllKnowledgeEntries,
  getAllDomainMeta,
  getAllStories,
  getAllBlogPosts,
  getAllPages,
  getMissionControlData,
} from '@/lib/content';
import { computeDomainStats, computeAggregateStats } from '@/lib/stats';

export const dynamic = 'force-dynamic';

export async function GET() {
  const entries = getAllKnowledgeEntries();
  const domains = getAllDomainMeta();
  const stories = getAllStories();
  const blogPosts = getAllBlogPosts();
  const pages = getAllPages();

  const domainStats = computeDomainStats(entries, domains);
  const aggregateStats = computeAggregateStats(entries, domains);
  const missionControl = getMissionControlData();

  const index = {
    generated_at: new Date().toISOString(),
    entries,
    domains,
    domain_stats: domainStats,
    stories,
    blog_posts: blogPosts,
    pages,
    aggregate_stats: aggregateStats,
    mission_control: missionControl,
  };

  return Response.json(index, {
    headers: {
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
