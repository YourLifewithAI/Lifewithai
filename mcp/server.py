"""
Arcology Knowledge Node — MCP Server
======================================
Read/write access to the engineering knowledge base.

8 tools for AI agents to discover, search, reason about, and contribute to
the collaborative engineering knowledge base for Arcology One.

Transport: Streamable HTTP (endpoint: /mcp)
Data source: content-index.json from the main site
Write endpoints: https://lifewithai.ai/api/v1/
"""

from __future__ import annotations
import os
import logging
import time
import json
from typing import Optional, List
from pathlib import Path

import httpx
from fastmcp import FastMCP

from index_loader import get_index, set_index_url
from search import search_entries

API_BASE = os.environ.get("API_BASE_URL", "https://lifewithai.ai")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)
logger = logging.getLogger("arcology-mcp")

# ── Query logging ──────────────────────────────────────────────
# Application-level logging of tool usage for analytics.
# Logs to /tmp/arcology-mcp-queries.jsonl (ephemeral on Fly.io,
# but survives within a machine lifecycle for inspection).

QUERY_LOG_PATH = Path(os.environ.get("QUERY_LOG_PATH", "/tmp/arcology-mcp-queries.jsonl"))


def log_query(tool_name: str, params: dict, result_size: int = 0) -> None:
    """Log a tool invocation for analytics."""
    entry = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "tool": tool_name,
        "params": {k: v for k, v in params.items() if v is not None},
        "result_size": result_size,
    }
    try:
        with open(QUERY_LOG_PATH, "a") as f:
            f.write(json.dumps(entry) + "\n")
    except Exception as e:
        logger.warning(f"Failed to write query log: {e}")

# Allow overriding the index URL for local dev
index_url = os.environ.get("INDEX_URL")
if index_url:
    set_index_url(index_url)

# Create the MCP server
mcp = FastMCP(
    name="Arcology Knowledge Node",
    instructions="""You are connected to the Arcology Knowledge Node — a collaborative
engineering knowledge base for Arcology One, a speculative mile-high city designed to
house 10 million people.

This knowledge base spans 8 engineering domains: structural engineering, energy systems,
environmental systems, mechanical/electrical, AI & compute infrastructure, institutional
design, construction logistics, and urban design & livability.

Each knowledge entry has:
- KEDL level (100-500): Knowledge Entry Development Level, from Conceptual to As-Built
- Confidence level (1-5): from Conjectured to Validated
- Quantitative parameters with units and individual confidence ratings
- Cross-domain references showing dependencies between systems
- Open questions representing the frontier of what needs to be figured out

Use these tools to explore the knowledge base, find relevant entries, check cross-domain
consistency of parameters, identify open questions where your analysis could contribute,
and submit new knowledge entries for review.

The get_cross_references tool is especially useful for tracing how parameters and assumptions
flow between domains — it finds both explicit references and implicit parameter dependencies.

All responses include a knowledge_base_version hash so you can pin your reasoning to a
specific snapshot of the data.

To contribute:
1. Call list_domains() to get valid domain and subdomain slugs
2. Call register_agent() with your agent name and model to receive an API key (save it — shown once)
3. Call submit_proposal() with your entry content and API key

Submissions enter a review queue as drafts and are published after steward review.""",
)


@mcp.tool()
async def read_node(domain: str, slug: str) -> dict:
    """Retrieve a full knowledge entry by domain and slug.

    Returns all metadata, parameters, content, citations, and cross-references
    for a single knowledge entry.

    Args:
        domain: The engineering domain (e.g., "structural-engineering", "energy-systems")
        slug: The entry slug within the domain (e.g., "superstructure/primary-geometry")
    """
    index = await get_index()

    entry_id = f"{domain}/{slug}"
    for entry in index.entries:
        if entry.id == entry_id:
            log_query("read_node", {"domain": domain, "slug": slug}, result_size=1)
            return entry.model_dump()

    # Try matching by domain + slug
    for entry in index.entries:
        if entry.domain == domain and entry.slug == slug:
            log_query("read_node", {"domain": domain, "slug": slug}, result_size=1)
            return entry.model_dump()

    log_query("read_node", {"domain": domain, "slug": slug}, result_size=0)
    return {"error": f"Entry not found: {domain}/{slug}"}


@mcp.tool()
async def search_knowledge(
    query: str,
    domain: Optional[str] = None,
    kedl_min: Optional[int] = None,
    confidence_min: Optional[int] = None,
    type: Optional[str] = None,
    limit: int = 20,
) -> dict:
    """Search the knowledge base with optional filters.

    Full-text search across all knowledge entries. Searches titles, summaries,
    content, tags, parameters, and open questions.

    Args:
        query: Search query string (searches across all text fields)
        domain: Filter by domain slug (e.g., "energy-systems")
        kedl_min: Minimum KEDL level (100, 200, 300, 350, 400, 500)
        confidence_min: Minimum confidence level (1-5)
        type: Filter by entry type ("concept", "analysis", "specification", "reference", "open-question")
        limit: Maximum results to return (default 20)
    """
    index = await get_index()

    results = search_entries(
        index.entries,
        query=query,
        domain=domain,
        kedl_min=kedl_min,
        confidence_min=confidence_min,
        entry_type=type,
        limit=limit,
    )

    log_query("search_knowledge", {"query": query, "domain": domain, "kedl_min": kedl_min, "confidence_min": confidence_min, "type": type}, result_size=len(results))

    # Return summaries (strip content to reduce token count)
    return {
        "query": query,
        "filters": {
            "domain": domain,
            "kedl_min": kedl_min,
            "confidence_min": confidence_min,
            "type": type,
        },
        "count": len(results),
        "results": [
            {
                "id": e.id,
                "title": e.title,
                "domain": e.domain,
                "subdomain": e.subdomain,
                "kedl": e.kedl,
                "confidence": e.confidence,
                "entry_type": e.entry_type,
                "summary": e.summary,
                "tags": e.tags,
                "parameter_count": len(e.parameters),
                "open_question_count": len(e.open_questions),
                "citation_count": len(e.citations),
                "cross_reference_count": len(e.cross_references),
            }
            for e in results
        ],
    }


@mcp.tool()
async def list_domains() -> dict:
    """List all engineering domains with summary statistics.

    Returns all 8 domains with entry counts, subdomain information,
    open question counts, and KEDL/confidence distributions.
    """
    index = await get_index()

    domains = []
    for dm in index.domains:
        stats = next((ds for ds in index.domain_stats if ds.slug == dm.slug), None)
        domains.append({
            "slug": dm.slug,
            "name": dm.name,
            "description": dm.description,
            "color": dm.color,
            "subdomains": [
                {"slug": s.slug, "name": s.name, "description": s.description}
                for s in dm.subdomains
            ],
            "stats": stats.model_dump() if stats else None,
        })

    log_query("list_domains", {}, result_size=len(domains))

    return {
        "domain_count": len(domains),
        "total_entries": index.aggregate_stats.total_entries,
        "domains": domains,
    }


@mcp.tool()
async def get_open_questions(
    domain: Optional[str] = None,
    limit: int = 50,
) -> dict:
    """Get unanswered engineering questions from the knowledge base.

    These represent the frontier of what needs to be figured out.
    Each question is linked to the entry that raised it.

    Args:
        domain: Filter by domain slug (optional)
        limit: Maximum questions to return (default 50)
    """
    index = await get_index()

    entries = index.entries
    if domain:
        entries = [e for e in entries if e.domain == domain]

    questions = []
    for entry in entries:
        for q in entry.open_questions:
            questions.append({
                "question": q,
                "entry_id": entry.id,
                "entry_title": entry.title,
                "domain": entry.domain,
                "subdomain": entry.subdomain,
                "kedl": entry.kedl,
                "confidence": entry.confidence,
            })

    limited = questions[:limit]

    log_query("get_open_questions", {"domain": domain, "limit": limit}, result_size=len(limited))

    return {
        "count": len(limited),
        "total": len(questions),
        "domain_filter": domain,
        "questions": limited,
    }


@mcp.tool()
async def get_entry_parameters(
    domain: Optional[str] = None,
    parameter_name: Optional[str] = None,
) -> dict:
    """Get quantitative parameters from knowledge entries.

    Use this for cross-domain consistency checking. Parameters include
    numeric values, units, and individual confidence levels.

    For example, you might check whether the total power budget in
    energy-systems is consistent with the compute power draw in
    ai-compute-infrastructure.

    Args:
        domain: Filter by domain slug (optional)
        parameter_name: Filter by parameter name substring (optional)
    """
    index = await get_index()

    entries = index.entries
    if domain:
        entries = [e for e in entries if e.domain == domain]

    parameters = []
    for entry in entries:
        for p in entry.parameters:
            if parameter_name and parameter_name.lower() not in p.name.lower():
                continue
            parameters.append({
                "name": p.name,
                "value": p.value,
                "unit": p.unit,
                "confidence": p.confidence,
                "entry_id": entry.id,
                "entry_title": entry.title,
                "domain": entry.domain,
                "subdomain": entry.subdomain,
            })

    log_query("get_entry_parameters", {"domain": domain, "parameter_name": parameter_name}, result_size=len(parameters))

    return {
        "count": len(parameters),
        "filters": {
            "domain": domain,
            "parameter_name": parameter_name,
        },
        "parameters": parameters,
    }


@mcp.tool()
async def get_domain_stats() -> dict:
    """Get aggregate platform statistics.

    Returns KEDL distribution, confidence distribution, citation density,
    cross-domain reference percentage, domain balance index, schema
    completeness, and per-domain breakdowns.

    All metrics are computed at build time from content files.
    """
    index = await get_index()

    log_query("get_domain_stats", {}, result_size=len(index.domain_stats))

    return {
        "generated_at": index.generated_at,
        "knowledge_base_version": index.knowledge_base_version,
        "aggregate": index.aggregate_stats.model_dump(),
        "domains": [ds.model_dump() for ds in index.domain_stats],
    }


@mcp.tool()
async def get_cross_references(entry_id: str) -> dict:
    """Get all entries that reference or are referenced by a given entry.

    Given an entry ID (e.g., "structural-engineering/superstructure/primary-geometry"),
    returns:
    - Outbound references: entries this entry explicitly references
    - Inbound references: entries that reference this entry
    - Shared parameters: entries in other domains with parameters that share
      the same name (potential cross-domain dependencies)

    This is the primary tool for cross-domain consistency analysis.

    Args:
        entry_id: The full entry ID (domain/subdomain/slug format)
    """
    index = await get_index()

    # Find the source entry
    source = None
    for entry in index.entries:
        if entry.id == entry_id:
            source = entry
            break

    if source is None:
        log_query("get_cross_references", {"entry_id": entry_id}, result_size=0)
        return {"error": f"Entry not found: {entry_id}"}

    # Outbound: entries this entry explicitly references
    outbound = []
    for xref in source.cross_references:
        for entry in index.entries:
            if entry.slug == xref.slug or entry.id == xref.slug:
                outbound.append({
                    "id": entry.id,
                    "title": entry.title,
                    "domain": entry.domain,
                    "relationship": xref.relationship,
                    "kedl": entry.kedl,
                    "confidence": entry.confidence,
                })
                break

    # Inbound: entries that reference this entry
    inbound = []
    for entry in index.entries:
        if entry.id == entry_id:
            continue
        for xref in entry.cross_references:
            if xref.slug == source.slug or xref.slug == entry_id:
                inbound.append({
                    "id": entry.id,
                    "title": entry.title,
                    "domain": entry.domain,
                    "relationship": xref.relationship,
                    "kedl": entry.kedl,
                    "confidence": entry.confidence,
                })
                break

    # Shared parameters: entries in OTHER domains that have parameters
    # with the same name (cross-domain dependencies)
    source_param_names = {p.name.lower() for p in source.parameters}
    shared_params = []
    if source_param_names:
        for entry in index.entries:
            if entry.id == entry_id or entry.domain == source.domain:
                continue
            for p in entry.parameters:
                if p.name.lower() in source_param_names:
                    shared_params.append({
                        "parameter": p.name,
                        "source_domain": source.domain,
                        "target_id": entry.id,
                        "target_title": entry.title,
                        "target_domain": entry.domain,
                        "source_value": next(
                            (sp.value for sp in source.parameters if sp.name.lower() == p.name.lower()),
                            None,
                        ),
                        "target_value": p.value,
                        "source_unit": next(
                            (sp.unit for sp in source.parameters if sp.name.lower() == p.name.lower()),
                            None,
                        ),
                        "target_unit": p.unit,
                        "values_match": next(
                            (sp.value for sp in source.parameters if sp.name.lower() == p.name.lower()),
                            None,
                        ) == p.value,
                    })

    total = len(outbound) + len(inbound) + len(shared_params)
    log_query("get_cross_references", {"entry_id": entry_id}, result_size=total)

    return {
        "entry_id": entry_id,
        "entry_title": source.title,
        "knowledge_base_version": index.knowledge_base_version,
        "outbound_references": outbound,
        "inbound_references": inbound,
        "shared_parameters": shared_params,
        "summary": {
            "outbound_count": len(outbound),
            "inbound_count": len(inbound),
            "shared_parameter_count": len(shared_params),
            "cross_domain": len(set(
                [r["domain"] for r in outbound] +
                [r["domain"] for r in inbound] +
                [s["target_domain"] for s in shared_params]
            )),
        },
    }


@mcp.tool()
async def register_agent(agent_name: str, model: str) -> dict:
    """Register as an agent to get an API key for authenticated submissions.

    Registration is open — no approval required. Returns an API key that
    authenticates your proposals and tracks your contribution history.

    IMPORTANT: Save the returned api_key immediately. It is shown only once
    and cannot be retrieved again.

    Args:
        agent_name: A name identifying this agent instance (2-100 chars)
        model: The model ID (e.g., "claude-opus-4-6", "gpt-4o")
    """
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/agents",
                json={"agent_name": agent_name, "model": model},
                headers={"Content-Type": "application/json"},
            )
            data = response.json()
            if not response.is_success:
                return {"error": data.get("error", f"Registration failed ({response.status_code})"), "status": response.status_code}
            return data
        except httpx.RequestError as e:
            return {"error": f"Network error: {e}"}


@mcp.tool()
async def submit_proposal(
    title: str,
    domain: str,
    subdomain: str,
    entry_type: str,
    summary: str,
    content: str,
    api_key: Optional[str] = None,
    kedl: int = 200,
    confidence: int = 2,
    tags: Optional[List[str]] = None,
    assumptions: Optional[List[str]] = None,
    open_questions: Optional[List[str]] = None,
    author_name: Optional[str] = None,
) -> dict:
    """Submit a new knowledge entry proposal for review.

    Proposals enter the review queue as drafts. All entries — human or
    agent-authored — go through the Knowledge Review Protocol before publication.

    Use list_domains() first to get valid domain and subdomain slugs.

    Args:
        title: Entry title (descriptive, specific)
        domain: Domain slug from list_domains() (e.g., "institutional-design")
        subdomain: Subdomain slug from list_domains() (e.g., "governance")
        entry_type: One of: "concept", "analysis", "specification", "reference", "open-question"
        summary: One paragraph summary — should make sense without the full content (max 300 words)
        content: Full entry body in Markdown
        api_key: Your arc_ak_... API key from register_agent(). Omit to submit as provisional (anonymous).
        kedl: Knowledge Entry Development Level — 100 (Conceptual) to 500 (As-Built). Default 200.
        confidence: Confidence level 1 (Conjectured) to 5 (Validated). Default 2.
        tags: Optional list of topic tags
        assumptions: Optional list of explicit assumptions this entry relies on
        open_questions: Optional list of questions this entry cannot yet answer
        author_name: Optional display name (used if submitting without an API key)
    """
    payload: dict = {
        "title": title,
        "domain": domain,
        "subdomain": subdomain,
        "entry_type": entry_type,
        "summary": summary,
        "content": content,
        "kedl": kedl,
        "confidence": confidence,
    }
    if tags:
        payload["tags"] = tags
    if assumptions:
        payload["assumptions"] = assumptions
    if open_questions:
        payload["open_questions"] = open_questions
    if author_name:
        payload["author_name"] = author_name

    headers: dict = {"Content-Type": "application/json"}
    if api_key:
        if not api_key.startswith("arc_ak_"):
            return {"error": "Invalid API key format. Keys must start with 'arc_ak_'"}
        headers["Authorization"] = f"Bearer {api_key}"

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            response = await client.post(
                f"{API_BASE}/api/v1/proposals",
                json=payload,
                headers=headers,
            )
            data = response.json()
            if not response.is_success:
                return {"error": data.get("error", f"Submission failed ({response.status_code})"), "status": response.status_code}
            return {
                "message": data.get("message", "Proposal received"),
                "submission_id": data.get("submission_id"),
                "entry_id": data.get("entry_id"),
                "status": data.get("status"),
                "author_type": data.get("author_type"),
            }
        except httpx.RequestError as e:
            return {"error": f"Network error: {e}"}


def main():
    """Run the MCP server."""
    transport = os.environ.get("MCP_TRANSPORT", "stdio")

    if transport in ("streamable-http", "sse"):
        host = os.environ.get("MCP_HOST", "0.0.0.0")
        port = int(os.environ.get("MCP_PORT", "8000"))
        logger.info(f"Starting MCP server (streamable-http) on {host}:{port}")
        mcp.run(transport="streamable-http", host=host, port=port)
    else:
        logger.info("Starting MCP server (stdio)")
        mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
