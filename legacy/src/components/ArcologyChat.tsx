// ============================================================
// Arcology Chat — Client Component
// ============================================================
// The chat interface that renders in the browser. Uses the AI SDK
// useChat hook to stream messages from the /api/chat route.
//
// Updated for AI SDK v6:
// - useChat returns sendMessage() instead of input/handleInputChange/handleSubmit
// - status replaces isLoading
// - Messages use parts array for structured content

'use client';

import { useChat } from '@ai-sdk/react';
import { useState, type FormEvent } from 'react';

// Domain colors — matches globals.css for visual consistency
const DOMAIN_COLORS: Record<string, string> = {
  'structural-engineering': '#E63946',
  'energy-systems': '#F4A261',
  'environmental-systems': '#2A9D8F',
  'mechanical-electrical': '#457B9D',
  'ai-compute-infrastructure': '#7B2CBF',
  'institutional-design': '#E9C46A',
  'construction-logistics': '#E76F51',
  'urban-design-livability': '#48CAE4',
};

// KEDL level labels so users know what they mean
const KEDL_LABELS: Record<number, string> = {
  100: 'Conceptual',
  200: 'Schematic',
  300: 'Preliminary',
  350: 'Developed',
  400: 'Construction',
  500: 'As-Built',
};

// Starter questions to help users get going
const STARTERS = [
  'How tall is Arcology One?',
  'What are the hardest unsolved problems?',
  'How does the power budget break down?',
  'How do 10 million people move around inside?',
];

export default function ArcologyChat() {
  const { messages, sendMessage, status, error } = useChat();

  const [input, setInput] = useState('');
  const isLoading = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ parts: [{ type: 'text', text: input }] });
    setInput('');
  };

  return (
    <div className="flex flex-col" style={{ minHeight: '60vh' }}>
      {/* Messages */}
      <div className="flex-1 space-y-4 mb-4">
        {messages.length === 0 && (
          <StarterPrompts onSelect={(q) => {
            sendMessage({ parts: [{ type: 'text', text: q }] });
          }} />
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message as unknown as AnyMessage} />
        ))}

        {isLoading && (
          <div className="flex gap-2 px-4 py-3">
            <ThinkingDots />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Something went wrong. Check that ANTHROPIC_API_KEY is set in .env.local.
          </div>
        )}
      </div>

      {/* Input */}
      <form
        id="chat-form"
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex gap-2 border-t border-border bg-background pt-4 pb-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the Arcology..."
          className="flex-1 rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-white placeholder:text-muted focus:border-accent/50 focus:outline-none transition-colors"
          disabled={isLoading}
          autoFocus
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-background disabled:opacity-40 hover:bg-accent/90 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}

// --- Message Rendering ---
// AI SDK v6 uses UIMessage with parts[] — no more content string.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMessage = { id: string; role: string; parts: Array<any> };

function MessageBubble({ message }: { message: AnyMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? 'bg-accent/15 text-white'
            : 'bg-surface border border-border text-foreground'
        }`}
      >
        {message.parts.map((part: Record<string, unknown>, i: number) => (
          <PartRenderer key={i} part={part} />
        ))}
      </div>
    </div>
  );
}

// --- Part Rendering ---
// Each message can have multiple "parts": text, tool invocations, etc.

function PartRenderer({ part }: { part: Record<string, unknown> }) {
  // Text part — just render the text
  if (part.type === 'text' && part.text) {
    return <span className="whitespace-pre-wrap">{String(part.text)}</span>;
  }

  // Tool invocation part (AI SDK v4 format)
  if (part.type === 'tool-invocation' && part.toolInvocation) {
    return <ToolInvocationCard invocation={part.toolInvocation as Record<string, unknown>} />;
  }

  // Tool result part (AI SDK v5+ / v6 format)
  if (part.type === 'tool-result') {
    return <ToolResultCard part={part} />;
  }

  return null;
}

// --- Tool Invocation Card ---
// Shows a compact card for each tool call with its results.

function ToolInvocationCard({ invocation }: { invocation: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const toolName = String(invocation.toolName || '');
  const state = String(invocation.state || '');
  const args = invocation.args as Record<string, unknown> | undefined;
  const result = invocation.result;

  // While the tool is still running, show a loading state
  if (state === 'call' || state === 'partial-call') {
    return (
      <div className="my-2 rounded-lg border border-border/50 bg-surface-2 px-3 py-2 text-xs text-muted">
        <span className="inline-flex items-center gap-1.5">
          <ThinkingDots />
          <span>{toolLabel(toolName)}</span>
          {args && 'query' in args && (
            <span className="text-accent/70">
              &ldquo;{String(args.query)}&rdquo;
            </span>
          )}
        </span>
      </div>
    );
  }

  // Tool finished — render the result
  if (state === 'result' && result != null) {
    return (
      <div className="my-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
        >
          <span className="text-[10px]">{expanded ? '▼' : '▶'}</span>
          <span>{toolLabel(toolName)}</span>
          {args && 'query' in args && (
            <span className="text-accent/50">
              &ldquo;{String(args.query)}&rdquo;
            </span>
          )}
        </button>
        {expanded && (
          <div className="mt-2">
            <ToolResultRenderer toolName={toolName} result={result} />
          </div>
        )}
      </div>
    );
  }

  return null;
}

function ToolResultCard({ part }: { part: Record<string, unknown> }) {
  const [expanded, setExpanded] = useState(false);
  const toolName = (part.toolName as string) || 'tool';
  const result = part.output || part.result;

  return (
    <div className="my-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
      >
        <span className="text-[10px]">{expanded ? '▼' : '▶'}</span>
        <span>{toolLabel(toolName)}</span>
      </button>
      {expanded && result != null && (
        <div className="mt-2">
          <ToolResultRenderer toolName={toolName} result={result} />
        </div>
      )}
    </div>
  );
}

// --- Tool Result Renderers ---
// Each tool gets a custom renderer.

function ToolResultRenderer({ toolName, result }: { toolName: string; result: unknown }) {
  if (toolName === 'searchKnowledgeBase' && Array.isArray(result)) {
    return <SearchResultCards results={result} />;
  }

  if (toolName === 'getEntry' && typeof result === 'object' && result !== null) {
    return <EntryCard entry={result as Record<string, unknown>} />;
  }

  if (toolName === 'listDomains' && Array.isArray(result)) {
    return <DomainList domains={result} />;
  }

  if (toolName === 'getOpenQuestions' && Array.isArray(result)) {
    return <QuestionList questions={result} />;
  }

  // Fallback: show raw JSON for unknown tool results
  return (
    <pre className="rounded-lg bg-surface-2 p-3 text-xs text-muted overflow-x-auto">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}

// Search results — compact cards with domain color accent
function SearchResultCards({ results }: { results: Array<Record<string, unknown>> }) {
  return (
    <div className="space-y-2">
      {results.map((r, i) => {
        const domain = String(r.domain || '');
        const color = DOMAIN_COLORS[domain] || '#888';
        return (
          <a
            key={i}
            href={`/arcology/${domain}/${r.slug}`}
            className="block rounded-lg border border-border/50 bg-surface-2 p-3 hover:border-accent/30 transition-colors"
            style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="font-medium text-white text-xs">{String(r.title)}</div>
              <div className="flex gap-1.5 shrink-0">
                <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                  KEDL {String(r.kedl)} {KEDL_LABELS[Number(r.kedl)] || ''}
                </span>
                <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                  Conf {String(r.confidence)}/5
                </span>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-muted leading-relaxed line-clamp-2">
              {String(r.summary)}
            </p>
            {Array.isArray(r.parameters) && r.parameters.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(r.parameters as Array<Record<string, unknown>>).slice(0, 3).map((p, j) => (
                  <span
                    key={j}
                    className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent"
                  >
                    {String(p.name)}: {String(p.value)} {String(p.unit)}
                  </span>
                ))}
              </div>
            )}
          </a>
        );
      })}
    </div>
  );
}

// Full entry card — shown when Claude reads a specific entry
function EntryCard({ entry }: { entry: Record<string, unknown> }) {
  if ('error' in entry) {
    return <p className="text-xs text-red-400">{String(entry.error)}</p>;
  }
  const domain = String(entry.domain || '');
  const color = DOMAIN_COLORS[domain] || '#888';

  return (
    <div
      className="rounded-lg border border-border/50 bg-surface-2 p-3"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <div className="font-medium text-white text-xs">{String(entry.title)}</div>
      <div className="mt-1 flex gap-1.5 text-[10px] text-muted">
        <span>{String(entry.subdomain)}</span>
        <span>&middot;</span>
        <span>KEDL {String(entry.kedl)}</span>
        <span>&middot;</span>
        <span>Confidence {String(entry.confidence)}/5</span>
      </div>
      {Array.isArray(entry.parameters) && entry.parameters.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(entry.parameters as Array<Record<string, unknown>>).map((p, j) => (
            <span
              key={j}
              className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] text-accent"
            >
              {String(p.name)}: {String(p.value)} {String(p.unit)}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Domain list — when Claude calls listDomains
function DomainList({ domains }: { domains: Array<Record<string, unknown>> }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {domains.map((d, i) => {
        const color = DOMAIN_COLORS[String(d.slug)] || '#888';
        return (
          <div
            key={i}
            className="rounded-lg bg-surface-2 px-2.5 py-2 text-xs"
            style={{ borderLeft: `2px solid ${color}` }}
          >
            <div className="font-medium text-white">{String(d.name)}</div>
            <div className="text-[10px] text-muted">{String(d.entryCount)} entries</div>
          </div>
        );
      })}
    </div>
  );
}

// Open questions — the frontier
function QuestionList({ questions }: { questions: Array<Record<string, unknown>> }) {
  return (
    <div className="space-y-1.5">
      {questions.slice(0, 8).map((q, i) => (
        <div key={i} className="rounded-lg bg-surface-2 px-3 py-2 text-xs">
          <p className="text-white">{String(q.question)}</p>
          <p className="mt-0.5 text-[10px] text-muted">
            from {String(q.entry)} ({String(q.domain)})
          </p>
        </div>
      ))}
    </div>
  );
}

// --- Utilities ---

function toolLabel(toolName: string): string {
  const labels: Record<string, string> = {
    searchKnowledgeBase: 'Searched knowledge base',
    getEntry: 'Read entry',
    listDomains: 'Listed domains',
    getOpenQuestions: 'Found open questions',
  };
  return labels[toolName] || toolName;
}

function ThinkingDots() {
  return (
    <span className="inline-flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-accent/60"
          style={{
            animation: 'pulse 1.4s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </span>
  );
}

function StarterPrompts({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <p className="text-sm text-muted mb-2">Try asking:</p>
      <div className="flex flex-wrap justify-center gap-2">
        {STARTERS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-xs text-muted hover:border-accent/30 hover:text-white transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
