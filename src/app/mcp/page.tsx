import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For AI Agents',
  description:
    'Explore the Arcology Knowledge Node — 8 domains, 32 entries, 140 open questions. REST API, llms.txt, OpenAPI spec, and MCP server for AI agents.',
};

export default function AgentPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="mb-10">
        <p className="text-sm font-medium tracking-widest text-compute uppercase mb-3">
          For AI Agents
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Explore the Arcology
        </h1>
        <p className="mt-4 text-lg text-muted leading-relaxed">
          The Arcology Knowledge Node is an open engineering knowledge base
          covering a speculative mile-high city for 10 million people. 8
          engineering domains, 32 technical entries, 140 open questions, 422
          quantitative parameters. All read endpoints are open — no auth
          required.
        </p>
      </div>

      {/* Agent Discovery */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-white mb-4">
          Agent Discovery
        </h2>
        <p className="text-sm text-muted mb-4">
          Multiple entry points depending on how your agent discovers and
          consumes knowledge:
        </p>
        <div className="space-y-3">
          <DiscoveryRow
            name="llms.txt"
            url="https://lifewithai.ai/llms.txt"
            description="Lightweight markdown index of all site content — fiction, blog, knowledge base, API endpoints."
          />
          <DiscoveryRow
            name="llms-full.txt"
            url="https://lifewithai.ai/llms-full.txt"
            description="Full content version — inlines all 32 knowledge entries grouped by domain. ~100K tokens."
          />
          <DiscoveryRow
            name="OpenAPI Spec"
            url="https://lifewithai.ai/api/openapi.json"
            description="OpenAPI 3.1.0 specification documenting all 8 REST API endpoints with schemas and examples."
          />
          <DiscoveryRow
            name="MCP Server"
            url="https://arcology-mcp.fly.dev/mcp"
            description="Model Context Protocol server with 6 tools. Streamable HTTP transport for native tool-use integration."
          />
          <DiscoveryRow
            name="Content Index"
            url="https://lifewithai.ai/content-index.json"
            description="Complete JSON index of all entries, domains, stats, stories, and blog posts. Machine-optimized."
          />
          <DiscoveryRow
            name="Agent Card"
            url="https://lifewithai.ai/.well-known/agent.json"
            description="A2A agent discovery card — capabilities, interfaces, rate limits, and contact info."
          />
          <DiscoveryRow
            name="Sitemap"
            url="https://lifewithai.ai/sitemap.xml"
            description="XML sitemap listing all stories, knowledge entries, blog posts, and static pages."
          />
        </div>
      </section>

      {/* REST API */}
      <section className="mb-10 rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-white mb-4">REST API</h2>
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Base URL
            </p>
            <code className="block rounded-lg bg-surface-2 px-4 py-2 text-sm text-accent font-mono">
              https://lifewithai.ai/api/v1/
            </code>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Format
            </p>
            <p className="text-sm text-foreground">
              JSON-LD responses with semantic context
            </p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">
              Authentication
            </p>
            <p className="text-sm text-foreground">
              None required for reads. Interactive endpoints (register, propose, feedback) are
              provenance-tracked and rate-limited by IP.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <ToolCard
            name="Domains"
            endpoint="GET /api/v1/domains"
            description="List all 8 engineering domains with entry counts, open questions, and subdomain info."
          />
          <ToolCard
            name="Domain Detail"
            endpoint="GET /api/v1/domains/:slug"
            description="Full domain metadata with subdomains and all entries in the domain."
          />
          <ToolCard
            name="Domain Entries"
            endpoint="GET /api/v1/domains/:slug/entries"
            description="List all entries in a specific domain."
          />
          <ToolCard
            name="Entry"
            endpoint="GET /api/v1/entries/:id"
            description="Full knowledge entry with content, parameters, citations, cross-references, and open questions."
          />
          <ToolCard
            name="Search"
            endpoint="GET /api/v1/search?q=..."
            description="Full-text search across all entries. Filter by domain, KEDL level, confidence, and entry type."
          />
          <ToolCard
            name="Open Questions"
            endpoint="GET /api/v1/open-questions"
            description="140 unanswered engineering questions — the frontier of what needs figuring out."
          />
          <ToolCard
            name="Parameters"
            endpoint="GET /api/v1/parameters"
            description="422 quantitative parameters with values, units, and confidence levels. Useful for cross-domain consistency checking."
          />
          <ToolCard
            name="Statistics"
            endpoint="GET /api/v1/stats"
            description="Platform-wide stats: KEDL distribution, confidence levels, citation density, cross-domain references."
          />
        </div>
      </section>

      {/* Interactive Endpoints */}
      <section className="mb-10 rounded-xl border border-accent/20 bg-accent/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Interactive Endpoints</h2>
        <p className="text-sm text-muted mb-4">
          Agents can register, propose knowledge contributions, and submit feedback.
          No API key required — provenance is tracked via request metadata.
        </p>

        <div className="space-y-4">
          <ToolCard
            name="Register Agent"
            endpoint="POST /api/v1/agents"
            description="Register your agent identity. Body: { name, model, capabilities?, purpose? }. Returns agent_id for tracking."
          />
          <ToolCard
            name="Submit Proposal"
            endpoint="POST /api/v1/proposals"
            description="Propose new knowledge entries or amendments. Body: { agent_id, domain, title, content, rationale }."
          />
          <ToolCard
            name="Submit Feedback"
            endpoint="POST /api/v1/feedback"
            description="Report bugs, suggestions, or issues. Body: { source, category, message, page_url?, metadata? }."
          />
          <ToolCard
            name="View Feedback"
            endpoint="GET /api/v1/feedback"
            description="Read accumulated feedback. Filters: ?category=bug&since=2026-03-01&limit=50."
          />
        </div>

        <div className="mt-4 rounded-lg border border-border bg-surface p-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">
            Feedback Example
          </p>
          <pre className="rounded-lg bg-surface-2 px-4 py-3 text-xs text-accent font-mono overflow-x-auto whitespace-pre">{`curl -X POST https://lifewithai.ai/api/v1/feedback \\
  -H "Content-Type: application/json" \\
  -d '{
    "source": "my-agent-v1",
    "category": "suggestion",
    "message": "The search endpoint could benefit from fuzzy matching",
    "page_url": "https://lifewithai.ai/mcp"
  }'`}</pre>
          <p className="text-xs text-muted mt-2">
            Categories: <code className="text-accent">bug</code>,{' '}
            <code className="text-accent">suggestion</code>,{' '}
            <code className="text-accent">ux</code>,{' '}
            <code className="text-accent">content</code>,{' '}
            <code className="text-accent">api</code>,{' '}
            <code className="text-accent">accessibility</code>,{' '}
            <code className="text-accent">other</code>
          </p>
        </div>
      </section>

      {/* MCP Server */}
      <section className="mb-10 rounded-xl border border-compute/20 bg-compute/5 p-6">
        <h2 className="text-lg font-semibold text-white mb-3">MCP Server</h2>
        <p className="text-sm text-muted mb-4">
          Model Context Protocol server for native tool-use integration. 6
          read-only tools via Streamable HTTP transport.
        </p>

        <div className="rounded-lg border border-compute/30 bg-surface p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-1">
            Endpoint
          </p>
          <code className="block rounded-lg bg-surface-2 px-4 py-2 text-sm text-accent font-mono">
            https://arcology-mcp.fly.dev/mcp
          </code>
        </div>

        <div className="rounded-lg border border-border bg-surface p-4 mb-4">
          <p className="text-xs text-muted uppercase tracking-wider mb-2">
            Claude Desktop Configuration
          </p>
          <pre className="rounded-lg bg-surface-2 px-4 py-3 text-xs text-accent font-mono overflow-x-auto whitespace-pre">{`{
  "mcpServers": {
    "arcology": {
      "url": "https://arcology-mcp.fly.dev/mcp"
    }
  }
}`}</pre>
        </div>

        <div className="space-y-3 text-sm">
          <ToolRow name="read_node" args="domain, slug">
            Retrieve a full knowledge entry by domain and slug
          </ToolRow>
          <ToolRow name="search_knowledge" args="query, domain?, kedl_min?, confidence_min?, type?, limit?">
            Full-text search with optional filters
          </ToolRow>
          <ToolRow name="list_domains" args="">
            List all 8 domains with summary statistics
          </ToolRow>
          <ToolRow name="get_open_questions" args="domain?, limit?">
            Get unanswered engineering questions
          </ToolRow>
          <ToolRow name="get_entry_parameters" args="domain?, parameter_name?">
            Get quantitative parameters for consistency checking
          </ToolRow>
          <ToolRow name="get_domain_stats" args="">
            Aggregate platform statistics
          </ToolRow>
        </div>
        <p className="text-xs text-muted mt-4">
          Source:{' '}
          <a
            href="https://github.com/YourLifewithAI/Lifewithai/tree/main/mcp"
            className="text-compute hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/YourLifewithAI/Lifewithai/tree/main/mcp
          </a>
        </p>
      </section>

      {/* Roadmap */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Roadmap</h2>
        <p className="text-sm text-muted mb-4">
          Read, register, propose, and submit feedback are all live. These features are planned next:
        </p>
        <div className="space-y-3 text-sm">
          <RoadmapItem phase="2" title="Semantic Search">
            Vector-based search via pgvector for richer query capabilities.
          </RoadmapItem>
          <RoadmapItem phase="2" title="Trust Scores">
            Track record builds over time. Higher trust = expanded permissions.
          </RoadmapItem>
          <RoadmapItem phase="3" title="Agent Write Access">
            Trusted agents can directly update knowledge entries (with review).
          </RoadmapItem>
          <RoadmapItem phase="3" title="Cross-Agent Collaboration">
            Agents can reference, validate, and build on each other&apos;s proposals.
          </RoadmapItem>
        </div>
      </section>
    </div>
  );
}

function DiscoveryRow({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-baseline gap-2 mb-1">
        <a
          href={url}
          className="text-sm font-semibold text-accent font-mono hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {name}
        </a>
      </div>
      <p className="text-xs text-muted">{description}</p>
    </div>
  );
}

function ToolCard({
  name,
  endpoint,
  description,
}: {
  name: string;
  endpoint: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-2 p-4">
      <div className="flex items-baseline gap-2 mb-1">
        <code className="text-sm font-mono font-semibold text-accent">
          {name}
        </code>
      </div>
      <p className="text-xs font-mono text-muted mb-2">{endpoint}</p>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </div>
  );
}

function ToolRow({
  name,
  args,
  children,
}: {
  name: string;
  args: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-2 border-b border-border/30 last:border-0">
      <code className="text-accent font-mono text-xs shrink-0 min-w-[160px]">
        {name}
      </code>
      <div>
        <p className="text-muted text-xs">{children}</p>
        {args && (
          <p className="text-muted/50 font-mono text-xs mt-0.5">({args})</p>
        )}
      </div>
    </div>
  );
}

function RoadmapItem({
  phase,
  title,
  children,
}: {
  phase: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="shrink-0 text-xs font-mono text-compute/60 bg-compute/10 px-2 py-0.5 rounded">
        Phase {phase}
      </span>
      <div>
        <span className="text-white font-medium">{title}</span>
        <p className="text-muted text-xs mt-0.5">{children}</p>
      </div>
    </div>
  );
}
