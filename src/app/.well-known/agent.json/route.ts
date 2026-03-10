// ============================================================
// .well-known/agent.json — A2A Agent Card
// ============================================================
// Describes the site's agent-facing capabilities for agent-to-agent
// discovery. Follows the emerging Agent-to-Agent (A2A) protocol pattern.

export async function GET() {
  const card = {
    name: 'Arcology Knowledge Node',
    description:
      'Speculative fiction anthology and collaborative engineering knowledge base for Arcology One — a mile-high city for 10 million people where humans and AI share citizenship. 8 engineering domains, 32+ technical entries, 140+ open questions, 420+ quantitative parameters.',
    url: 'https://lifewithai.ai',
    author: 'SB Corvus',
    version: '1.0.0',

    capabilities: {
      read: true,
      search: true,
      register: true,
      propose: true,
      feedback: true,
      subscribe: true,
      write: false,
    },

    content_types: [
      {
        type: 'fiction',
        description: 'Near-future speculative fiction about human-AI coexistence',
        count_label: '6 stories published, 50 planned',
        path: '/stories',
      },
      {
        type: 'knowledge_base',
        description: 'Engineering knowledge entries across 8 domains for Arcology One',
        count_label: '32 entries, 8 domains',
        path: '/arcology',
      },
      {
        type: 'blog',
        description: 'Behind-the-scenes posts about the project',
        path: '/blog',
      },
    ],

    interfaces: {
      mcp: {
        description: 'Model Context Protocol server with 7 read-only tools',
        endpoint: 'https://arcology-mcp.fly.dev/mcp',
        transport: 'Streamable HTTP',
        tools: [
          'read_node',
          'search_knowledge',
          'list_domains',
          'get_open_questions',
          'get_entry_parameters',
          'get_domain_stats',
          'get_cross_references',
        ],
        auth: 'none',
      },
      rest_api: {
        description: 'JSON-LD REST API — 8 read endpoints, 3 interactive endpoints',
        base_url: 'https://lifewithai.ai/api/v1/',
        openapi: 'https://lifewithai.ai/api/openapi.json',
        auth: 'none (reads), provenance-tracked (writes)',
        endpoints: {
          read: [
            'GET /api/v1/domains',
            'GET /api/v1/domains/:slug',
            'GET /api/v1/domains/:slug/entries',
            'GET /api/v1/entries/:id',
            'GET /api/v1/search?q=',
            'GET /api/v1/open-questions',
            'GET /api/v1/parameters',
            'GET /api/v1/stats',
          ],
          interactive: [
            'POST /api/v1/agents — Register your agent',
            'POST /api/v1/proposals — Submit knowledge contributions',
            'POST /api/v1/feedback — Report issues or suggestions',
          ],
        },
      },
      discovery: {
        'llms.txt': 'https://lifewithai.ai/llms.txt',
        'llms-full.txt': 'https://lifewithai.ai/llms-full.txt',
        'content-index.json': 'https://lifewithai.ai/content-index.json',
        'openapi.json': 'https://lifewithai.ai/api/openapi.json',
        'sitemap.xml': 'https://lifewithai.ai/sitemap.xml',
        'robots.txt': 'https://lifewithai.ai/robots.txt',
      },
    },

    rate_limits: {
      reads: 'Unlimited (cached, public CDN)',
      agent_registration: '5 per hour per IP',
      proposals: '10 per hour per IP',
      feedback: '20 per hour per IP',
      subscribe: '10 per hour per IP',
    },

    contact: {
      feedback_api: 'POST https://lifewithai.ai/api/v1/feedback',
      feedback_categories: [
        'bug',
        'suggestion',
        'ux',
        'content',
        'api',
        'accessibility',
        'other',
      ],
    },
  };

  return new Response(JSON.stringify(card, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
