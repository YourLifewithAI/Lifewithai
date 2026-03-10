// ============================================================
// Arcology Knowledge Node — Build-Time Index Generator
// ============================================================
// Runs as `npm run prebuild` before Next.js build.
// Reads all content files and generates public/content-index.json
// This index is consumed by:
//   - REST API routes (at request time)
//   - MCP server on Fly.io (fetched over HTTP)
//   - Client-side search (loaded in browser)

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  getAllKnowledgeEntries,
  getAllDomainMeta,
  getAllStories,
  getAllBlogPosts,
  getAllPages,
  getMissionControlData,
} from './content';
import { computeDomainStats, computeAggregateStats } from './stats';
import type { ContentIndex } from './types';

function buildIndex(): void {
  console.log('[index-builder] Starting content index generation...');

  const entries = getAllKnowledgeEntries();
  const domains = getAllDomainMeta();
  const stories = getAllStories();
  const blogPosts = getAllBlogPosts();
  const pages = getAllPages();

  console.log(`[index-builder] Found ${entries.length} knowledge entries`);
  console.log(`[index-builder] Found ${domains.length} domain metadata files`);
  console.log(`[index-builder] Found ${stories.length} stories`);
  console.log(`[index-builder] Found ${blogPosts.length} blog posts`);
  console.log(`[index-builder] Found ${pages.length} pages`);

  const domainStats = computeDomainStats(entries, domains);
  const aggregateStats = computeAggregateStats(entries, domains);

  // Mission Control pipeline data
  const missionControl = getMissionControlData();
  if (missionControl.pipeline) {
    console.log(`[index-builder] Pipeline: ${missionControl.pipeline.completed}/${missionControl.pipeline.total} research items complete`);
  } else {
    console.log('[index-builder] Pipeline data not found (research-queue.json missing)');
  }

  // Compute a stable content hash from knowledge entries so agents can
  // pin reasoning to a specific knowledge base snapshot (per Cash's feedback)
  const entryFingerprint = entries
    .map((e) => `${e.slug}:${e.updated}:${e.kedl}:${e.confidence}`)
    .sort()
    .join('|');
  const knowledgeBaseVersion = crypto
    .createHash('sha256')
    .update(entryFingerprint)
    .digest('hex')
    .slice(0, 12);

  console.log(`[index-builder] Knowledge base version: ${knowledgeBaseVersion}`);

  const index: ContentIndex = {
    generated_at: new Date().toISOString(),
    knowledge_base_version: knowledgeBaseVersion,
    entries,
    domains,
    domain_stats: domainStats,
    stories,
    blog_posts: blogPosts,
    pages,
    aggregate_stats: aggregateStats,
    mission_control: missionControl,
  };

  const outputPath = path.join(process.cwd(), 'public', 'content-index.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2), 'utf-8');

  console.log(`[index-builder] Index written to ${outputPath}`);
  console.log(`[index-builder] Total entries: ${aggregateStats.total_entries}`);
  console.log(`[index-builder] Schema completeness: ${aggregateStats.schema_completeness}%`);
  console.log(`[index-builder] Domain balance index: ${aggregateStats.domain_balance_index}`);
  console.log('[index-builder] Done.');
}

buildIndex();
