// ============================================================
// .well-known/mcp.json — MCP Server Discovery
// ============================================================
// Auto-discovery endpoint for MCP-aware clients and directories.
// Returns the MCP server endpoint and metadata so agents can
// find and connect without manual configuration.

export async function GET() {
  const mcpConfig = {
    mcp_version: '2025-03-26',
    name: 'Arcology Knowledge Node',
    description:
      'Read-only engineering knowledge base for Arcology One — a speculative mile-high city. Query across 8 engineering domains with structured parameters, confidence levels, and cross-references.',
    url: 'https://arcology-mcp.fly.dev/mcp',
    transport: 'streamable-http',

    tools: [
      {
        name: 'read_node',
        description: 'Retrieve a specific knowledge entry by slug',
      },
      {
        name: 'search_knowledge',
        description: 'Full-text search across all knowledge entries',
      },
      {
        name: 'list_domains',
        description: 'List all engineering domains and their subdomains',
      },
      {
        name: 'get_open_questions',
        description: 'Get unanswered research questions, optionally filtered by domain',
      },
      {
        name: 'get_entry_parameters',
        description: 'Get quantitative parameters for a specific entry',
      },
      {
        name: 'get_domain_stats',
        description: 'Get aggregate statistics for a domain',
      },
      {
        name: 'get_cross_references',
        description: 'Get entries that reference or are referenced by a given entry',
      },
    ],

    auth: {
      type: 'none',
    },

    links: {
      homepage: 'https://lifewithai.ai/arcology',
      agent_card: 'https://lifewithai.ai/.well-known/agent.json',
      documentation: 'https://lifewithai.ai/llms-full.txt',
      source: 'https://github.com/YourLifewithAI/Lifewithai/tree/main/mcp',
    },
  };

  return new Response(JSON.stringify(mcpConfig, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
