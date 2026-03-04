export async function GET() {
  const spec = {
    openapi: '3.1.0',
    info: {
      title: 'Arcology One — Engineering Knowledge Base API',
      description:
        'Read-only REST API for the Arcology One engineering knowledge base. ' +
        '8 domains, 32 technical entries, 140 open questions, 422 quantitative parameters. ' +
        'JSON-LD responses. No authentication required for reads.',
      version: '1.0.0',
      contact: {
        name: 'SB Corvus',
        url: 'https://lifewithai.ai/about',
      },
    },
    servers: [{ url: 'https://lifewithai.ai', description: 'Production' }],
    paths: {
      '/api/v1/domains': {
        get: {
          operationId: 'listDomains',
          summary: 'List all engineering domains',
          description:
            'Returns all 8 domains with entry counts, confidence levels, subdomain counts, and last updated dates.',
          responses: {
            '200': {
              description: 'Domain list',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      domains: {
                        type: 'array',
                        items: { $ref: '#/components/schemas/DomainSummary' },
                      },
                      count: { type: 'integer' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      '/api/v1/domains/{slug}': {
        get: {
          operationId: 'getDomain',
          summary: 'Get domain details with subdomains and entries',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              example: 'energy-systems',
            },
          ],
          responses: {
            '200': { description: 'Domain with entries' },
            '404': { description: 'Domain not found' },
          },
        },
      },
      '/api/v1/domains/{slug}/entries': {
        get: {
          operationId: 'listDomainEntries',
          summary: 'List all entries in a domain',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Entry list for domain' },
          },
        },
      },
      '/api/v1/entries/{id}': {
        get: {
          operationId: 'getEntry',
          summary: 'Get a single knowledge entry with full content',
          description:
            'Returns the complete entry including content, parameters, citations, cross-references, and open questions. ' +
            'Entry IDs follow the format: {domain}/{subdomain}/{slug}.',
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string' },
              description: 'Entry ID in format domain/subdomain/slug. Use /api/v1/domains/{slug}/entries to discover entry IDs.',
              example: 'energy-systems/solar/solar-integration',
            },
          ],
          responses: {
            '200': { description: 'Full knowledge entry' },
            '404': { description: 'Entry not found' },
          },
        },
      },
      '/api/v1/search': {
        get: {
          operationId: 'searchEntries',
          summary: 'Full-text search across all knowledge entries',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Search query (searches titles, summaries, content, tags)',
            },
            {
              name: 'domain',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by domain slug',
            },
            {
              name: 'kedl_min',
              in: 'query',
              required: false,
              schema: { type: 'integer', enum: [100, 200, 300, 350, 400, 500] },
              description: 'Minimum KEDL level',
            },
            {
              name: 'confidence_min',
              in: 'query',
              required: false,
              schema: { type: 'integer', minimum: 1, maximum: 5 },
              description: 'Minimum confidence level',
            },
            {
              name: 'type',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['concept', 'analysis', 'specification', 'reference', 'open-question'],
              },
              description: 'Filter by entry type',
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 50 },
              description: 'Max results',
            },
          ],
          responses: {
            '200': { description: 'Search results (content stripped for brevity)' },
            '400': { description: 'Must provide at least q or domain' },
          },
        },
      },
      '/api/v1/open-questions': {
        get: {
          operationId: 'listOpenQuestions',
          summary: 'List unanswered engineering questions',
          description:
            '140 open questions across all domains. Each linked to the entry that raised it.',
          parameters: [
            {
              name: 'domain',
              in: 'query',
              required: false,
              schema: { type: 'string' },
            },
            {
              name: 'limit',
              in: 'query',
              required: false,
              schema: { type: 'integer', default: 50 },
            },
          ],
          responses: {
            '200': { description: 'Open questions list' },
          },
        },
      },
      '/api/v1/parameters': {
        get: {
          operationId: 'listParameters',
          summary: 'List quantitative parameters across entries',
          description:
            '422 parameters with values, units, and confidence levels. Useful for cross-domain consistency checking.',
          parameters: [
            {
              name: 'domain',
              in: 'query',
              required: false,
              schema: { type: 'string' },
            },
            {
              name: 'parameter_name',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Filter by name substring',
            },
          ],
          responses: {
            '200': { description: 'Parameters list' },
          },
        },
      },
      '/api/v1/stats': {
        get: {
          operationId: 'getStats',
          summary: 'Aggregate platform statistics',
          description:
            'KEDL distribution, confidence distribution, citation density, cross-domain reference percentage, and per-domain breakdowns.',
          responses: {
            '200': { description: 'Platform statistics' },
          },
        },
      },
    },
    components: {
      schemas: {
        DomainSummary: {
          type: 'object',
          properties: {
            slug: { type: 'string', example: 'energy-systems' },
            name: { type: 'string', example: 'Energy Systems' },
            color: { type: 'string', example: '#F4A261' },
            entry_count: { type: 'integer', example: 4 },
            subdomain_count: { type: 'integer', example: 4 },
            open_question_count: { type: 'integer', example: 19 },
            average_confidence: { type: 'number', example: 2.0 },
            last_updated: { type: 'string', example: '2026-02-28' },
          },
        },
      },
    },
  };

  return Response.json(spec, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
