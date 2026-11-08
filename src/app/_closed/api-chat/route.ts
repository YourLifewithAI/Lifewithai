// ============================================================
// Arcology Chat — API Route
// ============================================================
// Connects Claude to the Arcology knowledge base using AI SDK
// tool calling. Claude can search entries, read full content,
// list domains, and surface open questions.
//
// Setup:
//   npm install ai @ai-sdk/anthropic zod
//   Add ANTHROPIC_API_KEY to .env.local
//
// How it works:
//   1. Client sends chat messages via POST
//   2. Claude receives the conversation + tool definitions
//   3. Claude decides which tools to call (if any) to answer
//   4. Tool results stream back alongside Claude's text response
//   5. maxSteps: 5 lets Claude chain multiple tool calls per turn

import { streamText, tool, zodSchema, stepCountIs } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { z } from 'zod';
import { getContentIndex } from '@/lib/api-helpers';
import { searchEntries } from '@/lib/search';
import type { Domain } from '@/lib/types';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Load the pre-built content index (generated during npm run build).
  // This is a JSON file with every knowledge entry, domain, and stat.
  const index = getContentIndex();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),

    system: `You are the Arcology Knowledge Assistant — an AI guide to the engineering knowledge base for Arcology One, a speculative mile-high city designed to house 10 million people.

You have tools to search and read the knowledge base. Use them to answer questions with specific data, parameters, and citations. Always mention which entries you're drawing from so users can explore further.

The knowledge base covers 8 engineering domains:
- Structural Engineering — superstructure, materials, foundations
- Energy Systems — power budget, grid architecture, district energy
- Environmental Systems — HVAC, water, waste, food production
- Mechanical & Electrical — elevators, plumbing, fire safety
- AI & Compute Infrastructure — data centers, networking
- Institutional Design — governance, economics, legal
- Construction Logistics — phasing, workforce, supply chain
- Urban Design & Livability — transport, residential, healthcare

When answering:
- Lead with the specific answer, then provide context
- Include quantitative parameters with units when available
- Note KEDL level (100=Conceptual to 500=As-Built) and confidence (1-5) so users know how mature the data is
- If information is uncertain or the knowledge base has open questions about the topic, say so
- Suggest related entries or domains the user might want to explore
- Keep responses conversational but substantive — this is for curious people, not engineers writing specs`,

    messages,

    // These tools give Claude read access to the knowledge base.
    // Each tool returns structured data that the client renders as cards.
    tools: {
      searchKnowledgeBase: tool({
        description:
          'Search the Arcology knowledge base. Returns matching entry summaries with parameters and confidence levels.',
        inputSchema: zodSchema(z.object({
          query: z.string().describe('Search keywords — e.g., "elevator capacity", "power budget", "water recycling"'),
          domain: z
            .string()
            .optional()
            .describe('Optional domain slug to narrow results, e.g., "energy-systems"'),
        })),
        execute: async ({ query, domain }) => {
          const results = searchEntries(index.entries, {
            query,
            domain: domain as Domain | undefined,
          });
          return results.slice(0, 5).map((e) => ({
            title: e.title,
            domain: e.domain,
            subdomain: e.subdomain,
            slug: e.slug,
            summary: e.summary,
            kedl: e.kedl,
            confidence: e.confidence,
            parameters: e.parameters.slice(0, 5),
            open_questions: e.open_questions.slice(0, 3),
          }));
        },
      }),

      getEntry: tool({
        description:
          'Read the full content of a specific knowledge entry by slug (e.g., "primary-geometry", "power-budget").',
        inputSchema: zodSchema(z.object({
          slug: z.string().describe('The entry slug — use searchKnowledgeBase first to find it'),
        })),
        execute: async ({ slug }) => {
          const entry = index.entries.find((e) => e.slug === slug);
          if (!entry) return { error: `Entry "${slug}" not found` };
          return {
            title: entry.title,
            domain: entry.domain,
            subdomain: entry.subdomain,
            kedl: entry.kedl,
            confidence: entry.confidence,
            // Truncate content to avoid blowing up Claude's context
            content: entry.content.slice(0, 3000),
            parameters: entry.parameters,
            citations: entry.citations.slice(0, 5),
            open_questions: entry.open_questions,
            cross_references: entry.cross_references,
          };
        },
      }),

      listDomains: tool({
        description: 'List all 8 engineering domains with entry counts and subdomain names.',
        inputSchema: zodSchema(z.object({})),
        execute: async () => {
          return index.domains.map((d) => ({
            name: d.name,
            slug: d.slug,
            description: d.description,
            entryCount: index.entries.filter((e) => e.domain === d.slug).length,
            subdomains: d.subdomains.map((s) => s.name),
          }));
        },
      }),

      getOpenQuestions: tool({
        description:
          'Get unanswered engineering questions — the frontier of what needs to be figured out. Useful when users ask "what don\'t we know?" or "what are the hard problems?"',
        inputSchema: zodSchema(z.object({
          domain: z.string().optional().describe('Optional domain slug to filter questions'),
        })),
        execute: async ({ domain }) => {
          let entries = index.entries;
          if (domain) entries = entries.filter((e) => e.domain === domain);
          return entries
            .flatMap((e) =>
              e.open_questions.map((q) => ({
                question: q,
                entry: e.title,
                domain: e.domain,
                slug: e.slug,
              }))
            )
            .slice(0, 20);
        },
      }),
    },

    // Allow Claude to chain up to 5 tool calls per message.
    // Example: search -> read entry -> read related entry -> synthesize answer
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
