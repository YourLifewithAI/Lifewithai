# Arcology Knowledge Node — MCP Server

Read-only MCP server for AI agents to query the Arcology One engineering knowledge base.

## Tools

| Tool | Purpose |
|------|---------|
| `read_node(domain, slug)` | Retrieve full knowledge entry |
| `search_knowledge(query, ...)` | Full-text search with filters |
| `list_domains()` | All 8 domains with stats |
| `get_open_questions(domain?, limit?)` | Unanswered engineering questions |
| `get_entry_parameters(domain?, parameter_name?)` | Quantitative parameters for consistency checking |
| `get_domain_stats()` | Aggregate platform statistics |

## Local Development

```bash
# Install dependencies
pip install -e .

# Run with stdio (for Claude Desktop)
python server.py

# Run with Streamable HTTP (for remote access)
MCP_TRANSPORT=streamable-http python server.py

# Point to local Next.js dev server
INDEX_URL=http://localhost:3000/content-index.json python server.py
```

## Claude Desktop Configuration

Add to `~/.claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "arcology": {
      "command": "python",
      "args": ["C:/Users/blues/Claude Code Projects/arcology-node/mcp/server.py"],
      "env": {
        "INDEX_URL": "https://lifewithai.ai/content-index.json"
      }
    }
  }
}
```

## Deploy to Fly.io

```bash
cd mcp/
fly auth login
fly launch --name arcology-mcp --region dfw
fly deploy
```

Then point DNS: `mcp.lifewithai.ai` → Fly.io app.

## Architecture

```
content-index.json (Netlify) → [HTTP fetch, cached 5 min] → MCP server (Fly.io) → agents via Streamable HTTP (/mcp)
```
