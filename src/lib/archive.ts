// The old site lives on its own host. This is the one place that names it.
// Today: the archive's Netlify address. Before launch: https://arcology.lifewithai.ai, once its DNS record
// is in. The archive's own podcast feed already points its episodes at that host, and a 301 is cached for
// good, so switch this line before the first deploy. Every redirect follows it.
export const ARCHIVE_HOST = 'https://lifewithai-arcology.netlify.app';

// Old paths that answer with a 301 to the same path on the archive host.
// `:path*` matches the bare path and everything under it.
// Query strings are carried over by Next.js.
export const ARCHIVED_PATHS: string[] = [
  // Arcology One fiction, the city and the Knowledge Node
  '/arcology/:path*',
  '/stories/:path*',
  // The old blog, podcast page, infographics, manifesto and signpost
  '/blog/:path*',
  '/podcast/:path*',
  '/infographics/:path*',
  '/brief',
  '/workshop',
  // Dashboards
  '/activity',
  '/inbox',
  '/mission-control',
  // Recruiting and agent pages
  '/join/:path*',
  '/mcp',
  // Sign-in (the new site has none)
  '/auth/:path*',
  '/api/auth/:path*',
  // The old API, every route except /api/v1/subscribe, which the new sign-up uses
  '/api/openapi.json',
  '/api/v1/agents',
  '/api/v1/auth',
  '/api/v1/domains/:path*',
  '/api/v1/engagement',
  '/api/v1/entries/:path*',
  '/api/v1/feedback',
  '/api/v1/findings',
  '/api/v1/open-questions',
  '/api/v1/parameters',
  '/api/v1/podcast/:path*',
  '/api/v1/proposals',
  '/api/v1/query-activity',
  '/api/v1/query-log',
  '/api/v1/search',
  '/api/v1/stats',
  // Machine files. /llms.txt is not here: the new site serves its own short one.
  '/llms-full.txt',
  '/content-index.json',
  '/validation-report.json',
  '/validation-report.md',
  '/.well-known/mcp.json',
  '/.well-known/agent.json',
  // Old images and the old share picture (moved to legacy/public with the podcast files)
  '/images/:path*',
  '/opengraph-image.png',
];

export function archiveRedirects() {
  return ARCHIVED_PATHS.map((source) => ({
    source,
    destination: `${ARCHIVE_HOST}${source}`,
    statusCode: 301 as const,
  }));
}
