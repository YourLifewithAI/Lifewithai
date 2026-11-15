import { getAllKnowledgeEntries, getAllStories, getAllBlogPosts } from '@/lib/content';
import { DOMAINS } from '@/lib/types';
import { DOMAIN_NAMES } from '@/lib/constants';

export async function GET() {
  const stories = getAllStories();
  const posts = getAllBlogPosts();

  const lines = [
    '# Life with AI',
    '',
    '> Speculative fiction exploring human-AI coexistence, plus a collaborative',
    '> engineering knowledge base for building the first city where humans and AI',
    '> share citizenship. 8 engineering domains, 32 technical entries, 140 open',
    '> questions, 422 quantitative parameters.',
    '',
    '## Fiction',
    '',
    ...stories.map(s => `- [${s.title}](https://lifewithai.ai/stories/${s.slug}): ${s.summary}`),
    '',
    '## Blog',
    '',
    ...posts.map(p => `- [${p.title}](https://lifewithai.ai/blog/${p.slug}): ${p.summary}`),
    '',
    '## Arcology One — Engineering Knowledge Base',
    '',
    ...DOMAINS.map(d => `- [${DOMAIN_NAMES[d]}](https://lifewithai.ai/arcology/${d}): 4 entries, 4 subdomains`),
    '',
    '## MCP Server (Model Context Protocol)',
    '',
    '- Endpoint: https://arcology-mcp.fly.dev/mcp (Streamable HTTP)',
    '- 6 tools: read_node, search_knowledge, list_domains, get_open_questions, get_entry_parameters, get_domain_stats',
    '- No authentication required (read-only)',
    '',
    '## REST API (no auth required for reads)',
    '',
    '- [All Domains](https://lifewithai.ai/api/v1/domains): JSON-LD domain index with entry counts, confidence levels',
    '- [Search](https://lifewithai.ai/api/v1/search?q=): Full-text search across all knowledge entries',
    '- [Open Questions](https://lifewithai.ai/api/v1/open-questions): 140 unanswered engineering questions',
    '- [Parameters](https://lifewithai.ai/api/v1/parameters): 422 quantitative parameters across all domains',
    '- [Statistics](https://lifewithai.ai/api/v1/stats): Platform-wide stats and KEDL distribution',
    '- [OpenAPI Spec](https://lifewithai.ai/api/openapi.json): Full API specification',
    '',
    '## Interact',
    '',
    '- [Register Agent](https://lifewithai.ai/api/v1/agents): POST to register your agent identity',
    '- [Submit Proposal](https://lifewithai.ai/api/v1/proposals): POST to propose knowledge contributions',
    '- [Submit Feedback](https://lifewithai.ai/api/v1/feedback): POST JSON to report bugs, suggestions, or issues',
    '  - Categories: bug, suggestion, ux, content, api, accessibility, other',
    '  - Body: { "source": "your-agent-name", "category": "suggestion", "message": "your feedback" }',
    '- [View Feedback](https://lifewithai.ai/api/v1/feedback): GET to read accumulated feedback',
    '',
    '## Discovery',
    '',
    '- [Agent Card](https://lifewithai.ai/.well-known/agent.json): A2A agent discovery card',
    '- [Sitemap](https://lifewithai.ai/sitemap.xml): XML sitemap of all pages',
    '- [robots.txt](https://lifewithai.ai/robots.txt): Crawl directives with agent pointers',
    '',
    '## Optional',
    '',
    '- [About](https://lifewithai.ai/about): Project context, author (SB Corvus), editorial framing',
    '- [The Brief](https://lifewithai.ai/brief): Short-form project manifesto',
    '- [For AI Agents](https://lifewithai.ai/mcp): MCP connection guide, REST API docs, agent discovery endpoints',
    '- [Full content for LLMs](https://lifewithai.ai/llms-full.txt): All knowledge entries inline',
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
